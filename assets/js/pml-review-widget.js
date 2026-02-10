(function () {
  var WEBHOOK_URL = "https://readynowjunkremoval.com/.netlify/functions/review";

  var START_DELAY_MS = 250;
  var SLOW_NOTICE_MS = 6500;     // show "taking longer" after 6.5s
  var HARD_TIMEOUT_MS = 25000;   // switch to manual after 25s

  var statusText = document.getElementById("pml-status-text");
  var spinner = document.getElementById("pml-spinner");
  var slowBox = document.getElementById("pml-slow");
  var manualBtn = document.getElementById("pml-manual-btn");

  var out = document.getElementById("pml-output");
  var ta = document.getElementById("pml-review-text");
  var copyBtn = document.getElementById("pml-copy-btn");

  var manualWrap = document.getElementById("pml-manual");
  var manualTa = document.getElementById("pml-manual-text");
  var manualCopyBtn = document.getElementById("pml-copy-btn-manual");

  var errEl = document.getElementById("pml-error");

  function safeString(v){ return (v == null) ? "" : String(v).replace(/^\s+|\s+$/g, ""); }

  function setLoading(isLoading, msg) {
    if (spinner) spinner.style.display = isLoading ? "inline-block" : "none";
    if (statusText) statusText.textContent = msg || (isLoading ? "Generating your review…" : "");
  }

  function showError(msg) {
    if (!errEl) return;
    errEl.textContent = msg;
    errEl.style.display = "block";
  }
  function clearError() {
    if (!errEl) return;
    errEl.textContent = "";
    errEl.style.display = "none";
  }

  // ✅ ONLY URL param (GHL blocks localStorage reads)
  function getContactIdFromUrl() {
    var p = new URLSearchParams(window.location.search);
    return p.get("contactId") || p.get("contact_id") || p.get("cid") || "";
  }

  function getContactId() {
    return getContactIdFromUrl();
  }

  function openManual(city) {
    if (out) out.style.display = "none";
    if (manualWrap) manualWrap.style.display = "block";
    if (slowBox) slowBox.style.display = "none";
    setLoading(false, "You can write a quick review below ✅");

    var c = city || "CITY";
    var starter =
      "I hired them for a SERVICE_TYPE in " + c + " and the experience was great.\n" +
      "They showed up on time, worked fast, and left the area clean.\n" +
      "They were professional, friendly, and communication was easy.\n" +
      "Highly recommend if you need junk removal!";

    if (manualTa && !manualTa.value) manualTa.value = starter;

    // reset manual copy button
    if (manualCopyBtn) {
      var icon = manualCopyBtn.querySelector(".pml-copy-icon");
      var text = manualCopyBtn.querySelector(".pml-copy-text");
      if (icon) icon.textContent = "⧉";
      if (text) text.textContent = "Copy me";
    }
  }

  function pmlCopyText(text) {
    return new Promise(function(resolve, reject){
      var t = safeString(text);
      if (!t) return reject(new Error("Nothing to copy."));

      try {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(t).then(function(){ resolve(true); }).catch(function(){ fallback(); });
          return;
        }
      } catch (e) {}

      fallback();

      function fallback(){
        try {
          var temp = document.createElement("textarea");
          temp.value = t;
          temp.setAttribute("readonly", "");
          temp.style.position = "fixed";
          temp.style.top = "-9999px";
          temp.style.left = "-9999px";
          temp.style.opacity = "0";
          document.body.appendChild(temp);

          temp.focus();
          temp.select();
          temp.setSelectionRange(0, temp.value.length);

          var ok = false;
          try { ok = document.execCommand("copy"); }
          finally { document.body.removeChild(temp); }

          if (!ok) return reject(new Error("Copy blocked."));
          resolve(true);
        } catch (e2) {
          reject(e2);
        }
      }
    });
  }

  function setCopied(btn) {
    if (!btn) return;
    var icon = btn.querySelector(".pml-copy-icon");
    var text = btn.querySelector(".pml-copy-text");
    if (icon) icon.textContent = "✓";
    if (text) text.textContent = "Copied";

    window.setTimeout(function(){
      if (icon) icon.textContent = "⧉";
      if (text) text.textContent = "Copy me";
    }, 1500);
  }

  function handleCopy(btn, textareaEl) {
    var value = textareaEl ? textareaEl.value : "";
    pmlCopyText(value).then(function(){
      setCopied(btn);
    }).catch(function(){
      try {
        if (textareaEl) {
          textareaEl.removeAttribute("readonly");
          textareaEl.focus();
          textareaEl.select();
          textareaEl.setSelectionRange(0, textareaEl.value.length);
          textareaEl.setAttribute("readonly", "");
        }
      } catch (e) {}
      alert("Copy may be blocked in this embedded form.\n\nTap inside the text and use Select all → Copy, or Ctrl/Cmd+A then Ctrl/Cmd+C.");
    });
  }

  // ----------------------------
  // Photos: parse + render strip
  // ----------------------------
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
    // Try download via blob; if blocked by CORS, open image in new tab
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

        tile.addEventListener("click", function () {
          window.open(url, "_blank", "noopener,noreferrer");
        });

        row.appendChild(tile);
      })(urls[i], i);
    }
  }

  function resetPhotoStrip() {
    var wrap = document.getElementById("pml-photos");
    var row = document.getElementById("pml-photos-row");
    var count = document.getElementById("pml-photos-count");
    if (row) row.innerHTML = "";
    if (count) count.textContent = "";
    if (wrap) wrap.style.display = "none";
  }

  function generateReviewAuto() {
    resetPhotoStrip();

    clearError();
    if (out) out.style.display = "none";
    if (manualWrap) manualWrap.style.display = "none";
    if (slowBox) slowBox.style.display = "none";
    if (ta) ta.value = "";

    // reset copy button label
    if (copyBtn) {
      var icon = copyBtn.querySelector(".pml-copy-icon");
      var text = copyBtn.querySelector(".pml-copy-text");
      if (icon) icon.textContent = "⧉";
      if (text) text.textContent = "Copy me";
    }

    var contactId = getContactId();
    if (!contactId) {
      setLoading(false, "");
      showError("Missing contactId. Please open this page using the review link from the text/email we sent you.");
      return;
    }

    setLoading(true, "Generating your review…");

    var slowTimer = window.setTimeout(function(){
      if (slowBox) slowBox.style.display = "block";
    }, SLOW_NOTICE_MS);

    var hardTimer = window.setTimeout(function(){
      if (slowBox) slowBox.style.display = "block";
      openManual("");
    }, HARD_TIMEOUT_MS);

    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactId: contactId })
    })
    .then(function(res){
      if (!res.ok) {
        return res.text().then(function(t){
          throw new Error("Server error (" + res.status + "): " + (t || "No response body"));
        });
      }
      return res.json();
    })
    .then(function(data){
      var review = safeString(data && data.review);
      if (!review) throw new Error("Missing review in response.");

      renderPhotoStrip((data && data.jobPhotosUrl) ? data.jobPhotosUrl : "");

      if (ta) ta.value = review;
      if (out) out.style.display = "block";
      if (slowBox) slowBox.style.display = "none";
      setLoading(false, "");
    })
    .catch(function(e){
      console.error(e);
      if (slowBox) slowBox.style.display = "block";
      openManual("");
    })
    .finally(function(){
      window.clearTimeout(slowTimer);
      window.clearTimeout(hardTimer);
    });
  }

  if (copyBtn) copyBtn.addEventListener("click", function(){ handleCopy(copyBtn, ta); });
  if (manualCopyBtn) manualCopyBtn.addEventListener("click", function(){ handleCopy(manualCopyBtn, manualTa); });
  if (manualBtn) manualBtn.addEventListener("click", function(){ openManual(""); });

  function start() {
    setLoading(true, "Loading your job details…");
    window.setTimeout(generateReviewAuto, START_DELAY_MS);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
