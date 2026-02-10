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

    // reset button label if we changed it to "Copied"
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

      // Try modern clipboard
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

  function generateReviewAuto() {
    var photosWrap = document.getElementById("pml-photos");
    if (photosWrap) photosWrap.style.display = "none";
    
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

      // ✅ show photos if available
      renderPhotoStrip(data.jobPhotosUrl || "");

      if (ta) ta.value = review;
      if (out) out.style.display = "block";
      if (slowBox) slowBox.style.display = "none";
      setLoading(false, "");
    })
    .catch(function(){
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
