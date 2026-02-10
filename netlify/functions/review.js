// netlify/functions/review.js
//
// POST /.netlify/functions/review
// Body: { contactId: "..." }
//
// What it does:
// 1) Fetch contact -> city
// 2) Search opportunities for that contact -> prefer latest WON (status==="won"), else latest overall
// 3) Extract notes from a specific custom field (GHL_NOTES_FIELD_ID) OR fallback to joining all string fields
// 4) Extract job_photos (single-line text field URL) via GHL_JOB_PHOTOS_FIELD_ID
// 5) If job_photos contains one or more image URLs, send them to a vision model + generate a review
// 6) Return { review, city, opportunityId, jobPhotosUrl }
//
// Required Netlify env vars:
// - OPENAI_API_KEY
// - GHL_PRIVATE_TOKEN
// - GHL_LOCATION_ID
//
// Recommended env vars:
// - GHL_JOB_PHOTOS_FIELD_ID   (custom field id for your "job_photos" single-line text field)
// - GHL_NOTES_FIELD_ID        (custom field id for your notes/service-type field)
// - MAX_VISION_IMAGES         (default 3)

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

function parseCsvEnv(name) {
  return (process.env[name] || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
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

function getCustomFieldString(opp, fieldId) {
  const id = safeString(fieldId);
  if (!id) return "";

  const cf = opp?.customFields || opp?.custom_fields;
  if (!Array.isArray(cf)) return "";

  const hit = cf.find((x) => safeString(x?.id) === id);
  // LeadConnector commonly uses fieldValueString for strings
  return safeString(hit?.fieldValueString || hit?.value || "");
}

function extractNotesFromOpportunity(opp) {
  const preferredFieldId = safeString(process.env.GHL_NOTES_FIELD_ID);
  const cf = opp?.customFields || opp?.custom_fields;
  if (!Array.isArray(cf)) return "";

  if (preferredFieldId) {
    const hit = cf.find((x) => safeString(x?.id) === preferredFieldId);
    return clampText(hit?.fieldValueString || "", 2500);
  }

  // Fallback: join all string fields
  const parts = cf
    .map((x) => x?.fieldValueString)
    .filter(Boolean)
    .map((s) => safeString(s))
    .filter(Boolean);

  return clampText(parts.join(" | "), 2500);
}

// job_photos is a single-line text field, but you can paste multiple URLs separated by comma/newline.
// We'll parse anything that looks like an http(s) URL.
function uniq(arr) {
  var out = [];
  var seen = {};
  for (var i = 0; i < arr.length; i++) {
    var v = String(arr[i] || "").trim();
    if (!v) continue;
    if (seen[v]) continue;
    seen[v] = true;
    out.push(v);
  }
  return out;
}

function parseUrlsFromText(text) {
  var raw = safeString(text);
  if (!raw) return [];

  // split on commas/newlines/pipes
  var parts = raw.split(/[\n,|]+/g);
  var urls = [];

  for (var i = 0; i < parts.length; i++) {
    var p = safeString(parts[i]);
    if (!p) continue;
    var matches = p.match(/https?:\/\/[^\s]+/g);
    if (matches && matches.length) {
      for (var j = 0; j < matches.length; j++) {
        var u = matches[j].replace(/[)\].,]+$/g, "");
        urls.push(u);
      }
    }
  }
  return uniq(urls);
}

function isLikelyImageUrl(url) {
  var u = String(url || "").toLowerCase();
  return (
    u.indexOf(".jpg") > -1 ||
    u.indexOf(".jpeg") > -1 ||
    u.indexOf(".png") > -1 ||
    u.indexOf(".webp") > -1 ||
    u.indexOf(".gif") > -1 ||
    u.indexOf("googleusercontent.com") > -1 ||
    u.indexOf("lh3.googleusercontent.com") > -1 ||
    u.indexOf("storage.googleapis.com") > -1
  );
}

function filenameFromUrl(url) {
  try {
    var u = new URL(url);
    var last = (u.pathname || "").split("/").pop() || "photo";
    if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(last)) last += ".jpg";
    return last;
  } catch (e) {
    return "photo.jpg";
  }
}

function downloadImage(url) {
  // This works best if the image URL allows CORS. For Googleusercontent links, it often works.
  // If it fails, we fallback to opening in a new tab so they can long-press save on mobile.
  fetch(url)
    .then(function (res) {
      if (!res.ok) throw new Error("fetch failed");
      return res.blob();
    })
    .then(function (blob) {
      var a = document.createElement("a");
      var objUrl = URL.createObjectURL(blob);
      a.href = objUrl;
      a.download = filenameFromUrl(url);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objUrl);
    })
    .catch(function () {
      window.open(url, "_blank", "noopener,noreferrer");
    });
}

function renderPhotoStrip(jobPhotosUrl) {
  var wrap = document.getElementById("pml-photos");
  var row = document.getElementById("pml-photos-row");
  var count = document.getElementById("pml-photos-count");
  if (!wrap || !row) return;

  row.innerHTML = "";
  var urls = parseUrlsFromText(jobPhotosUrl).filter(isLikelyImageUrl);

  if (!urls.length) {
    wrap.style.display = "none";
    return;
  }

  wrap.style.display = "grid";
  if (count) count.textContent = urls.length + " photo" + (urls.length === 1 ? "" : "s");

  for (var i = 0; i < urls.length; i++) {
    (function (url, idx) {
      var tile = document.createElement("div");
      tile.className = "pml-photo-tile";

      var img = document.createElement("img");
      img.className = "pml-photo-img";
      img.src = url;
      img.alt = "Job photo " + (idx + 1);
      img.loading = "lazy";

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pml-photo-save";
      btn.setAttribute("aria-label", "Save photo " + (idx + 1));
      btn.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M12 3v10m0 0 4-4m-4 4-4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>' +
        '<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>' +
        "</svg>";

      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        downloadImage(url);
      });

      tile.appendChild(img);
      tile.appendChild(btn);

      // Optional: tap image opens full size
      tile.addEventListener("click", function () {
        window.open(url, "_blank", "noopener,noreferrer");
      });

      row.appendChild(tile);
    })(urls[i], i);
  }
}

function guessMimeFromUrl(url) {
  const u = url.toLowerCase();
  if (u.endsWith(".png")) return "image/png";
  if (u.endsWith(".webp")) return "image/webp";
  if (u.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

// Fetch image and return as base64 data URL so the vision model can see it even if the URL is not accessible to OpenAI.
async function fetchImageAsDataUrl(url, { timeoutMs = 9000, maxBytes = 2_500_000 } = {}) {
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

async function generateReviewWithVision({ city, notes, jobPhotosUrl }) {
  const maxImages = Math.max(0, Math.min(6, Number(process.env.MAX_VISION_IMAGES || 3)));

  const urls = parseUrlsFromText(jobPhotosUrl).slice(0, 12);
  const candidateImageUrls = urls.filter(isLikelyImageUrl).slice(0, maxImages);

  // Try to fetch and embed as base64. If any fail, we skip them.
  const imageDataUrls = [];
  for (const u of candidateImageUrls) {
    try {
      const dataUrl = await fetchImageAsDataUrl(u);
      imageDataUrls.push(dataUrl);
    } catch (e) {
      console.log("VISION_IMAGE_SKIP", u, e?.message || e);
    }
  }

  console.log("VISION_IMAGE_COUNT", imageDataUrls.length);

  const systemPrompt = [
    "You write a short, natural-sounding 5-star SEO-optimized Google review for a junk removal company from the customer's perspective.",
    "You may receive job photos and brief notes.",
    "Rules:",
    "- Sound like a real customer (1st person).",
    "- 70–140 words (4–8 sentences).",
    "- Mention the CITY exactly once if provided.",
    "- Identify the SERVICE TYPE using notes and/or photos (yard cleanout, garage cleanout, furniture removal, appliance removal, etc.).",
    "- If photos clearly show specific items, you may mention 1–2 items briefly. Do not invent details not supported by notes/photos.",
    "- No phone numbers, URLs, hashtags, emojis, pricing, or discounts.",
    "- No bullets. No quotes. No ALL CAPS.",
    "- End with a simple recommendation sentence.",
    "Output only the review text.",
  ].join("\n");

  const textContext = {
    city: safeString(city),
    opportunity_notes: safeString(notes),
    job_photos_url: safeString(jobPhotosUrl),
    parsed_url_count: urls.length,
    included_image_count: imageDataUrls.length,
  };

  console.log("CHATGPT_TEXT_CONTEXT", JSON.stringify(textContext, null, 2));

  const userContent = [
    { type: "input_text", text: JSON.stringify(textContext) },
    ...imageDataUrls.map((dataUrl) => ({
      type: "input_image",
      image_url: dataUrl,
    })),
  ];

  const resp = await openai.responses.create({
    model: "gpt-4.1", // vision-capable
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
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

    const jobPhotosFieldId = safeString(process.env.GHL_JOB_PHOTOS_FIELD_ID);
    if (!jobPhotosFieldId) {
      return json(500, { error: "Missing GHL_JOB_PHOTOS_FIELD_ID (custom field id for job_photos)" });
    }

    let body = {};
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return json(400, { error: "Invalid JSON body." });
    }

    const contactId = safeString(body.contactId);
    if (!contactId) return json(400, { error: "Missing contactId" });

    console.log("INBOUND", { contactId });

    // 1) Contact -> city
    const contactResp = await ghlFetch(`/contacts/${contactId}`);
    const contact = contactResp?.contact || contactResp;
    const city = safeString(contact?.city);

    // 2) Opportunities search
    const oppSearch = await ghlFetch(`/opportunities/search`, {
      query: { location_id: locationId, contact_id: contactId, limit: 100 },
    });

    const opportunities = oppSearch?.opportunities || [];
    console.log("OPP_SEARCH_COUNT", opportunities.length);

    // Prefer WON opportunities; else fallback to all
    const wonOpps = opportunities.filter((o) => safeString(o?.status).toLowerCase() === "won");
    console.log("OPP_WON_COUNT", wonOpps.length);

    const picked = pickLatestOpportunity(wonOpps.length ? wonOpps : opportunities);
    if (!picked) {
      return json(200, {
        review: "",
        error: "No opportunities found for this contact.",
        city,
        opportunityId: "",
        jobPhotosUrl: "",
      });
    }

    const opportunityId = safeString(picked.id || picked._id);

    // 3) Notes (custom field strings)
    const notes = extractNotesFromOpportunity(picked);

    // 4) job_photos single-line text field URL
    const jobPhotosUrl = getCustomFieldString(picked, jobPhotosFieldId);

    console.log("PICKED_OPP", {
      opportunityId,
      status: picked.status,
      pipelineId: picked.pipelineId,
      pipelineStageId: picked.pipelineStageId,
      updatedAt: picked.updatedAt,
      createdAt: picked.createdAt,
      notesPreview: (notes || "").slice(0, 120),
      jobPhotosUrlPreview: (jobPhotosUrl || "").slice(0, 140),
    });

    // 5) Generate review (vision-enabled if job_photos has image URLs)
    const review = await generateReviewWithVision({ city, notes, jobPhotosUrl });

    if (!review) {
      return json(502, {
        error: "OpenAI returned an empty review.",
        city,
        opportunityId,
        jobPhotosUrl,
      });
    }

    // 6) Return everything the HTML needs for your tip line
    return json(200, {
      review,
      city,
      opportunityId,
      jobPhotosUrl, // ✅ your single-line text field URL
    });
  } catch (err) {
    console.error("review function error:", err);
    return json(500, {
      error: "Server error generating review.",
      debug: { message: err?.message || String(err) },
    });
  }
}
