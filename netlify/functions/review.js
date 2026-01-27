// netlify/functions/review.js
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const API_BASE = "https://services.leadconnectorhq.com";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(statusCode, body) {
  return { statusCode, headers: { ...CORS, "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

function safeString(v) {
  if (v == null) return "";
  return String(v).trim();
}

function isProbablyUrl(s) {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizePhotos(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(safeString).filter(Boolean).filter(isProbablyUrl);

  const s = safeString(value);
  if (!s) return [];
  try {
    const maybe = JSON.parse(s);
    if (Array.isArray(maybe)) return normalizePhotos(maybe);
  } catch {}
  return s.split(/[\n,|]+/g).map(x => x.trim()).filter(Boolean).filter(isProbablyUrl);
}

async function ghlFetch(path, { method = "GET", query, body } = {}) {
  const token = process.env.GHL_PRIVATE_TOKEN;
  if (!token) throw new Error("Missing GHL_PRIVATE_TOKEN");
  const url = new URL(API_BASE + path);

  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).length) url.searchParams.set(k, String(v));
    });
  }

  const res = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GHL ${method} ${path} failed (${res.status}): ${text || "no body"}`);
  }
  return res.json();
}

// cache custom fields across warm invocations
let oppFieldCache = null;

async function getOpportunityCustomFieldIdByName(fieldName, locationId) {
  if (!fieldName) return null;
  if (!locationId) throw new Error("Missing GHL_LOCATION_ID");

  if (!oppFieldCache) {
    // Pull custom fields for the location and filter for opportunity fields
    // Endpoint: GET /locations/:locationId/customFields :contentReference[oaicite:2]{index=2}
    const data = await ghlFetch(`/locations/${locationId}/customFields`, { method: "GET" });
    oppFieldCache = data?.customFields || data || [];
  }

  const lower = fieldName.toLowerCase();
  const match =
    oppFieldCache.find(f => safeString(f.name).toLowerCase() === lower && safeString(f.model).toLowerCase() === "opportunity") ||
    oppFieldCache.find(f => safeString(f.name).toLowerCase() === lower);

  return match ? (match.id || match._id) : null;
}

function pickLatestOpportunity(opps) {
  if (!Array.isArray(opps) || opps.length === 0) return null;

  // Prefer updatedAt, then createdAt (handle different casing)
  const score = (o) => {
    const u = Date.parse(o.updatedAt || o.updated_at || o.lastUpdatedAt || "");
    const c = Date.parse(o.createdAt || o.created_at || "");
    return (isFinite(u) ? u : 0) || (isFinite(c) ? c : 0) || 0;
  };

  return opps.slice().sort((a, b) => score(b) - score(a))[0];
}

function extractNotes(opp) {
  // GHL schemas vary across endpoints; try common fields.
  return (
    safeString(opp.notes) ||
    safeString(opp.note) ||
    safeString(opp.description) ||
    safeString(opp.additionalInfo) ||
    ""
  );
}

function extractCustomFieldValue(opp, fieldId) {
  if (!fieldId) return null;

  // Some APIs return { customFields: [{id,value}, ...] }
  const arr = opp.customFields || opp.custom_fields;
  if (Array.isArray(arr)) {
    const found = arr.find(x => safeString(x.id) === fieldId || safeString(x.fieldId) === fieldId);
    return found ? (found.value ?? found.fieldValue ?? found.field_value) : null;
  }

  // Some APIs return object map: { [fieldId]: value }
  if (arr && typeof arr === "object") {
    if (arr[fieldId] !== undefined) return arr[fieldId];
  }

  return null;
}

async function generateReview({ city, notes, photoUrls }) {
  const systemPrompt = [
    "You write short, natural-sounding SEO-optimized Google reviews for junk removal customers.",
    "Rules:",
    "- Write like a real customer (1st person), not a company ad.",
    "- 70–130 words (roughly 4–7 sentences).",
    "- Mention the CITY exactly once if provided.",
    "- Mention the SERVICE TYPE once (garage cleanout, yard cleanout, appliance removal, furniture haul-away, etc.) inferred from notes.",
    "- Mention 1–2 specific items if available from notes.",
    "- Do NOT include phone numbers, URLs, hashtags, emojis, pricing, or discounts.",
    "- No bullet points. No quotes. No ALL CAPS.",
    "- End with a simple recommendation sentence.",
    "Output only the review text.",
  ].join("\n");

  const payload = { city: city || "", opportunity_notes: notes || "", job_reference_photos: photoUrls || [] };

  console.log("CHATGPT_PAYLOAD", JSON.stringify(payload, null, 2));
  const resp = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: JSON.stringify(payload) },
    ],
    temperature: 0.7,
    max_output_tokens: 220,
  });

  return safeString(resp.output_text || "");
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed. Use POST." });

  try {
    if (!process.env.OPENAI_API_KEY) return json(500, { error: "Missing OPENAI_API_KEY" });
    const locationId = process.env.GHL_LOCATION_ID;
    if (!locationId) return json(500, { error: "Missing GHL_LOCATION_ID" });

    const body = JSON.parse(event.body || "{}");
    const contactId = safeString(body.contactId);
    if (!contactId) return json(400, { error: "Missing contactId" });

    // 1) Contact -> city  (GET /contacts/:contactId) :contentReference[oaicite:3]{index=3}
    const contact = await ghlFetch(`/contacts/${contactId}`);
    const city = safeString(contact?.contact?.city || contact?.city || "");

    // 2) Find latest opportunity for this contact
    // GET /opportunities/search with location_id required + contact_id filter :contentReference[oaicite:4]{index=4}
    const oppSearch = await ghlFetch(`/opportunities/search`, {
      query: {
        location_id: locationId,
        contact_id: contactId,
        limit: 100,
      },
    });

    const opportunities =
      oppSearch?.opportunities ||
      oppSearch?.data?.opportunities ||
      oppSearch?.data ||
      [];

    const latest = pickLatestOpportunity(opportunities);
    if (!latest) {
      // No opps: still return something based on city only (or force manual)
      return json(200, {
        review: "",
        fallback_city: city,
        error: "No opportunities found for this contact.",
      });
    }

    // 3) Get the full opportunity (helps ensure custom fields are present)
    // GET /opportunities/:id :contentReference[oaicite:5]{index=5}
    const oppId = latest.id || latest._id;
    const oppFull = oppId ? await ghlFetch(`/opportunities/${oppId}`) : latest;
    const opp = oppFull?.opportunity || oppFull;

    // 4) Notes + photos custom field
    const notes = extractNotes(opp);

    const photosFieldName = safeString(process.env.GHL_OPP_PHOTOS_FIELD_NAME || "job_reference_photos");
    const photosFieldId = await getOpportunityCustomFieldIdByName(photosFieldName, locationId);

    const rawPhotosValue = extractCustomFieldValue(opp, photosFieldId);
    const photoUrls = normalizePhotos(rawPhotosValue);

    const review = await generateReview({ city, notes, photoUrls });

    return json(200, { review, city, opportunityId: oppId });
  } catch (err) {
    console.error("review function error:", err);
    return json(500, { error: "Server error generating review." });
  }
}
