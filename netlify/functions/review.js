// netlify/functions/review.js
//
// POST /.netlify/functions/review
// Body: { contactId: "..." }
//
// Env Vars required:
// - OPENAI_API_KEY
// - GHL_PRIVATE_TOKEN
// - GHL_LOCATION_ID
//
// Optional env vars:
// - GHL_NOTES_FIELD_ID        (string custom field id to treat as notes; else joins all string fields)
// - GHL_PIPELINE_ID           (filters opportunities)
// - GHL_STAGE_ID              (filters opportunities)
// - MAX_VISION_IMAGES         (default 5)

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
      if (v !== undefined && v !== null && String(v).length) url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Version: "2021-07-28", // required by LeadConnector
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GHL ${method} ${path} failed (${res.status}): ${text || "no body"}`);
  }
  return res.json();
}

// From your /opportunities/search response shape:
function extractPhotoUrlsFromOpportunity(opp) {
  const cf = opp?.customFields || opp?.custom_fields;
  if (!Array.isArray(cf)) return [];

  const urls = [];
  for (const f of cf) {
    if (Array.isArray(f.fieldValueFiles)) {
      for (const file of f.fieldValueFiles) {
        const url = safeString(file?.url);
        if (url) urls.push(url);
      }
    }
  }
  return uniq(urls);
}

// Notes: in your sample, there's no opp.notes; it’s customFields.fieldValueString
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

// ---- Vision helpers ----

// Very lightweight content-type sniffing
function guessMimeFromUrl(url) {
  const u = url.toLowerCase();
  if (u.endsWith(".png")) return "image/png";
  if (u.endsWith(".webp")) return "image/webp";
  if (u.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

// Download image from URL and return a data URL (base64)
// If the URL is not accessible (403), it will throw.
async function fetchImageAsDataUrl(url, { timeoutMs = 8000, maxBytes = 2_500_000 } = {}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`image fetch failed (${res.status}): ${txt?.slice?.(0, 120) || "no body"}`);
    }

    const contentType = res.headers.get("content-type") || guessMimeFromUrl(url);
    const buf = Buffer.from(await res.arrayBuffer());

    if (buf.byteLength > maxBytes) {
      throw new Error(`image too large (${buf.byteLength} bytes)`);
    }

    const b64 = buf.toString("base64");
    return `data:${contentType};base64,${b64}`;
  } finally {
    clearTimeout(t);
  }
}

async function generateReviewWithVision({ city, notes, photoUrls }) {
  // Keep vision cost + latency controlled
  const maxImages = Math.max(0, Math.min(6, Number(process.env.MAX_VISION_IMAGES || 5)));
  const urlsToUse = Array.isArray(photoUrls) ? photoUrls.slice(0, maxImages) : [];

  // Download images server-side (so OpenAI doesn't need access to the private URL)
  const imageDataUrls = [];
  for (const url of urlsToUse) {
    try {
      const dataUrl = await fetchImageAsDataUrl(url, {
        timeoutMs: 8000,
        maxBytes: 2_500_000, // ~2.5MB each
      });
      imageDataUrls.push(dataUrl);
    } catch (e) {
      console.log("VISION_IMAGE_SKIP", url, e?.message || e);
    }
  }

  const systemPrompt = [
    "You write a short, natural-sounding 5-star SEO-optimized Google review for a junk removal company from the customer's perspective.",
    "You will be given city, notes, and job photos.",
    "Rules:",
    "- Sound like a real customer (1st person).",
    "- 70–140 words (about 4–8 sentences).",
    "- Mention the CITY exactly once if provided.",
    "- Identify the SERVICE TYPE using the notes and/or photos (garage cleanout, yard cleanout, appliance removal, furniture haul-away, etc.).",
    "- If photos show specific items, you may mention 1–2 items briefly. Do not invent details not supported by notes/photos.",
    "- No phone numbers, URLs, hashtags, emojis, pricing, or discounts.",
    "- No bullets. No quotes. No ALL CAPS.",
    "- End with a simple recommendation sentence.",
    "Output only the review text.",
  ].join("\n");

  const content = [
    {
      type: "input_text",
      text: JSON.stringify({
        city: safeString(city),
        opportunity_notes: safeString(notes),
        photo_count: imageDataUrls.length,
      }),
    },
    ...imageDataUrls.map((dataUrl) => ({
      type: "input_image",
      image_url: dataUrl, // base64 data URL is allowed :contentReference[oaicite:1]{index=1}
    })),
  ];

  console.log("VISION_IMAGE_COUNT", imageDataUrls.length);

  // Use a vision-capable model (gpt-4.1 is good)
  const resp = await openai.responses.create({
    model: "gpt-4.1",
    input: [{ role: "system", content: systemPrompt }, { role: "user", content }],
    temperature: 0.7,
    max_output_tokens: 260,
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

    // Contact -> city
    const contactResp = await ghlFetch(`/contacts/${contactId}`);
    const contact = contactResp?.contact || contactResp;
    const city = safeString(contact?.city);

    // Opportunities search
    const oppSearch = await ghlFetch(`/opportunities/search`, {
      query: { location_id: locationId, contact_id: contactId, limit: 100 },
    });

    const opportunities = oppSearch?.opportunities || [];
    console.log("OPP_SEARCH_COUNT", opportunities.length);

    // Optional filters for “correct” opportunity
    const PIPELINE_ID = safeString(process.env.GHL_PIPELINE_ID);
    const STAGE_ID = safeString(process.env.GHL_STAGE_ID);

    let filtered = opportunities;
    if (PIPELINE_ID) filtered = filtered.filter((o) => safeString(o?.pipelineId) === PIPELINE_ID);
    if (STAGE_ID) filtered = filtered.filter((o) => safeString(o?.pipelineStageId) === STAGE_ID);

    const latest = pickLatestOpportunity(filtered.length ? filtered : opportunities);
    if (!latest) return json(200, { review: "", error: "No opportunities found for this contact.", city });

    const opportunityId = latest.id || latest._id;

    const notes = extractNotesFromOpportunity(latest);
    const photoUrls = extractPhotoUrlsFromOpportunity(latest);

    console.log("EXTRACTED", {
      opportunityId,
      city,
      notesPreview: notes.slice(0, 160),
      photoCount: photoUrls.length,
    });

    // This is what the model "sees" as non-image context
    console.log("CHATGPT_TEXT_CONTEXT", JSON.stringify({ city, notes }, null, 2));

    const review = await generateReviewWithVision({ city, notes, photoUrls });

    if (!review) return json(502, { error: "OpenAI returned an empty review.", city, opportunityId });

    return json(200, { review, city, opportunityId });
  } catch (err) {
    console.error("review function error:", err);
    return json(500, { error: "Server error generating review.", debug: { message: err?.message || String(err) } });
  }
}
