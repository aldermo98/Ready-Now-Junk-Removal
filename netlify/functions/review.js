// netlify/functions/review.js
//
// POST /.netlify/functions/review
// Body: { contactId: "..." }
//
// What it does:
// 1) Fetch contact -> city
// 2) Search opportunities for that contact -> pick latest (updatedAt/createdAt)
// 3) Extract "notes" from opportunity customFields (fieldValueString) OR a specific notes field id
// 4) Extract photo URLs from customFields.fieldValueFiles[].url
// 5) Call OpenAI -> return { review }
//
// Netlify Env Vars required:
// - OPENAI_API_KEY
// - GHL_PRIVATE_TOKEN
// - GHL_LOCATION_ID
//
// Optional env vars (recommended):
// - GHL_NOTES_FIELD_ID             (e.g. "CJKrhNSkPiMM1PeHc98Y")  // pick a specific string field to treat as notes
// - GHL_PIPELINE_ID                (filter opps to a pipeline)
// - GHL_STAGE_ID                   (filter opps to a stage)
//
// Notes:
// - LeadConnector requires header: Version: 2021-07-28

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const API_BASE = "https://services.leadconnectorhq.com";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { ...CORS, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function safeString(v) {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function clampText(v, max = 2500) {
  const s = safeString(v);
  return s.length > max ? s.slice(0, max) + "…" : s;
}

function uniq(arr) {
  return [...new Set(arr)];
}

function pickLatestOpportunity(opps) {
  if (!Array.isArray(opps) || opps.length === 0) return null;

  const score = (o) => {
    const u = Date.parse(o.updatedAt || o.updated_at || o.dateUpdated || "");
    const c = Date.parse(o.createdAt || o.created_at || o.dateAdded || "");
    return (isFinite(u) ? u : 0) || (isFinite(c) ? c : 0) || 0;
  };

  return opps.slice().sort((a, b) => score(b) - score(a))[0];
}

async function ghlFetch(path, { method = "GET", query, body } = {}) {
  const token = process.env.GHL_PRIVATE_TOKEN;
  if (!token) throw new Error("Missing GHL_PRIVATE_TOKEN");

  const url = new URL(API_BASE + path);

  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && String(v).length) {
        url.searchParams.set(k, String(v));
      }
    }
  }

  const res = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Version: "2021-07-28", // ✅ required by LeadConnector
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GHL ${method} ${path} failed (${res.status}): ${text || "no body"}`);
  }

  return res.json();
}

// Extract URLs from LeadConnector opportunity search response:
// customFields: [{ fieldValueFiles:[{url}], id, type:"array" }, ...]
function extractPhotoUrlsFromOpportunity(opp) {
  const cf = opp?.customFields || opp?.custom_fields;
  if (!Array.isArray(cf)) return [];

  const urls = [];

  for (const f of cf) {
    // Primary case from your sample response
    if (Array.isArray(f.fieldValueFiles)) {
      for (const file of f.fieldValueFiles) {
        const url = safeString(file?.url);
        if (url) urls.push(url);
      }
    }

    // Extra robustness (other shapes you might encounter)
    if (f.fieldValueFile?.url) {
      const url = safeString(f.fieldValueFile.url);
      if (url) urls.push(url);
    }

    if (Array.isArray(f.value)) {
      for (const v of f.value) {
        if (typeof v === "string") {
          const s = safeString(v);
          if (s.startsWith("http")) urls.push(s);
        } else if (v?.url) {
          const s = safeString(v.url);
          if (s) urls.push(s);
        }
      }
    }

    // Sometimes it’s a comma-delimited string of URLs
    if (typeof f.fieldValueString === "string" && f.fieldValueString.includes("http")) {
      const maybeUrls = f.fieldValueString
        .split(/[\n,|]+/g)
        .map((x) => x.trim())
        .filter(Boolean)
        .filter((x) => x.startsWith("http"));
      urls.push(...maybeUrls);
    }
  }

  return uniq(urls).slice(0, 12);
}

// Notes in your sample do NOT exist on opp.notes.
// Instead, you have customFields with fieldValueString.
// If GHL_NOTES_FIELD_ID is set, we use that exact field; otherwise we join all string fields.
function extractNotesFromOpportunity(opp) {
  const preferredFieldId = safeString(process.env.GHL_NOTES_FIELD_ID);
  const cf = opp?.customFields || opp?.custom_fields;
  if (!Array.isArray(cf)) return "";

  if (preferredFieldId) {
    const hit = cf.find((x) => safeString(x?.id) === preferredFieldId);
    return clampText(hit?.fieldValueString || "", 2500);
  }

  const parts = cf
    .map((x) => x?.fieldValueString)
    .filter(Boolean)
    .map((s) => safeString(s))
    .filter(Boolean);

  return clampText(parts.join(" | "), 2500);
}

async function generateReview({ city, notes, photoUrls }) {
  const systemPrompt = [
    "You write short, natural-sounding Google reviews for a junk removal company from a customer's perspective.",
    "Rules:",
    "- Write like a real customer (1st person), not a company ad.",
    "- 70–130 words (about 4–7 sentences).",
    "- Mention the CITY exactly once if provided.",
    "- Mention the SERVICE TYPE once (garage cleanout, yard cleanout, appliance removal, furniture haul-away, etc.) inferred from notes.",
    "- Mention 1–2 specific items only if notes implies them (do not hallucinate).",
    "- Do NOT include phone numbers, URLs, hashtags, emojis, pricing, or discounts.",
    "- No bullet points. No quotes. No ALL CAPS.",
    "- End with a simple recommendation sentence.",
    "Output only the review text.",
  ].join("\n");

  const payload = {
    city: safeString(city),
    opportunity_notes: safeString(notes),
    job_reference_photos: Array.isArray(photoUrls) ? photoUrls : [],
  };

  // Debug: see exactly what you're sending to ChatGPT
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
    const locationId = safeString(process.env.GHL_LOCATION_ID);
    if (!locationId) return json(500, { error: "Missing GHL_LOCATION_ID" });

    let body = {};
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return json(400, { error: "Invalid JSON body." });
    }

    const contactId = safeString(body.contactId);
    if (!contactId) return json(400, { error: "Missing contactId" });

    // 1) Contact -> city
    const contactResp = await ghlFetch(`/contacts/${contactId}`);
    const contact = contactResp?.contact || contactResp;
    const city = safeString(contact?.city);

    // 2) Opportunities search -> filter -> pick latest
    const oppSearch = await ghlFetch(`/opportunities/search`, {
      query: {
        location_id: locationId,
        contact_id: contactId,
        limit: 100,
      },
    });

    const opportunities = oppSearch?.opportunities || [];
    console.log("OPP_SEARCH_COUNT", opportunities.length);

    // Optional filtering if you want to ensure the “right” opportunity is used
    const PIPELINE_ID = safeString(process.env.GHL_PIPELINE_ID);
    const STAGE_ID = safeString(process.env.GHL_STAGE_ID);

    let filtered = opportunities;
    if (PIPELINE_ID) {
      filtered = filtered.filter((o) => safeString(o?.pipelineId) === PIPELINE_ID);
      console.log("OPP_FILTER_PIPELINE_COUNT", filtered.length);
    }
    if (STAGE_ID) {
      filtered = filtered.filter((o) => safeString(o?.pipelineStageId) === STAGE_ID);
      console.log("OPP_FILTER_STAGE_COUNT", filtered.length);
    }

    const latest = pickLatestOpportunity(filtered.length ? filtered : opportunities);
    if (!latest) {
      return json(200, {
        review: "",
        error: "No opportunities found for this contact.",
        city,
      });
    }

    const opportunityId = latest.id || latest._id;

    // 3) Extract notes + photos from the opportunity record returned by /search (it contains customFields)
    const notes = extractNotesFromOpportunity(latest);
    const photoUrls = extractPhotoUrlsFromOpportunity(latest);

    console.log("EXTRACTED", {
      opportunityId,
      city,
      notesPreview: notes.slice(0, 160),
      photoCount: photoUrls.length,
    });

    // If notes are empty and you want to force manual fallback:
    // if (!notes && photoUrls.length === 0) return json(200, { review: "", city, opportunityId });

    const review = await generateReview({ city, notes, photoUrls });

    if (!review) {
      return json(502, { error: "OpenAI returned an empty review.", city, opportunityId });
    }

    return json(200, { review, city, opportunityId });
  } catch (err) {
    console.error("review function error:", err);
    return json(500, {
      error: "Server error generating review.",
      debug: { message: err?.message || String(err) },
    });
  }
}
