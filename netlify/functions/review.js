// netlify/functions/generate-seo-review.js
// Requires: Node 18+ runtime (Netlify supports this)
// Set env var in Netlify: OPENAI_API_KEY
//
// POST body JSON:
// { city: "...", notes: "...", job_reference_photos: ["https://..."] }
//
// Returns:
// { review: "..." }

import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function safeString(v) {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function clampText(s, max = 2500) {
  const t = safeString(s);
  return t.length > max ? t.slice(0, max) + "…" : t;
}

function isProbablyUrl(s) {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function uniq(arr) {
  return [...new Set(arr)];
}

function normalizePhotos(input) {
  if (!input) return [];
  if (Array.isArray(input)) {
    return uniq(input.map(safeString).filter(Boolean).filter(isProbablyUrl)).slice(0, 12);
  }
  const s = safeString(input);
  if (!s) return [];
  try {
    const maybe = JSON.parse(s);
    if (Array.isArray(maybe)) return normalizePhotos(maybe);
  } catch {}
  return normalizePhotos(s.split(/[\n,|]+/g));
}

// Basic CORS (lock down to your domain if you want)
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export async function handler(event) {
  // Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed. Use POST." }),
    };
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing OPENAI_API_KEY env var." }),
      };
    }

    let body = {};
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid JSON body." }),
      };
    }

    const city = clampText(body.city, 120);
    const notes = clampText(body.notes, 2500);
    const photos = normalizePhotos(body.job_reference_photos);

    if (!notes && photos.length === 0) {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Missing job context. Provide notes or at least one photo URL.",
        }),
      };
    }

    const systemPrompt = [
      "You write short, natural-sounding Google reviews for junk removal customers.",
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

    const userPayload = {
      city: city || "",
      opportunity_notes: notes || "",
      job_reference_photos: photos,
    };

    // Netlify functions have execution limits; keep it quick.
    // Use a smaller/fast model; switch to "gpt-4.1" if you want best quality.
    const resp = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(userPayload) },
      ],
      temperature: 0.7,
      max_output_tokens: 220,
    });

    const review = safeString(resp.output_text || "");
    if (!review) {
      return {
        statusCode: 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "OpenAI returned an empty response." }),
      };
    }

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ review }),
    };
  } catch (err) {
    console.error("generate-seo-review error:", err);
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server error generating review." }),
    };
  }
}
