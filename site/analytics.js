(() => {
  "use strict";

  // Public project identifiers, managed by aries@magnascale.com.
  const measurementId = "G-2XSD91R1NJ";
  const clarityId = "z528akcxqr";
  const storageKey = "arin-analytics-consent-v1";
  const maxAge = 180 * 24 * 60 * 60 * 1000;
  // Local previews and the separate planning report never send analytics.
  const production = ["arinhandyman.com", "www.arinhandyman.com"].includes(location.hostname);

  let started = false;
  let choice = null;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && ["accepted", "declined"].includes(saved.value) &&
        saved.time <= Date.now() && Date.now() - saved.time < maxAge) choice = saved.value;
  } catch { /* A visitor can still choose when storage is unavailable. */ }

  function loadScript(src) {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    document.head.append(script);
  }

  function start() {
    if (started || !production) return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      page_location: location.origin + location.pathname,
      page_referrer: /^https?:/.test(document.referrer) ? new URL(document.referrer).origin : "",
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`);

    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    window.clarity("consentv2", { analytics_Storage: "granted", ad_Storage: "denied" });
    loadScript(`https://www.clarity.ms/tag/${clarityId}`);
  }

  const banner = document.createElement("section");
  banner.className = "analytics-choice";
  banner.setAttribute("aria-label", "Optional website analytics");
  banner.innerHTML = `<div><strong>Help us improve this website</strong>
    <p>With your permission, Google Analytics measures visits and Microsoft Clarity uses heatmaps and session recordings to help us understand how the site is used. Optional cookies stay off until you accept. <a href="#privacy-details">Privacy details</a></p></div>
    <div class="analytics-actions"><button type="button" data-choice="accepted">Accept analytics</button><button type="button" data-choice="declined">Decline analytics</button></div>`;
  document.body.append(banner);
  banner.hidden = choice !== null;

  function clearCookies() {
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=")[0].trim();
      if (!/^(_ga(?:_|$)|_clck$|_clsk$)/.test(name)) continue;
      for (const domain of ["", "; domain=arinhandyman.com", "; domain=.arinhandyman.com"]) {
        document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax`;
      }
    }
  }

  function save(value) {
    choice = value;
    try { localStorage.setItem(storageKey, JSON.stringify({ value, time: Date.now() })); }
    catch { /* Consent remains valid for this page only. */ }
    banner.hidden = true;
    if (value === "accepted") start();
    else {
      if (started) {
        window[`ga-disable-${measurementId}`] = true;
        window.gtag("consent", "update", { analytics_storage: "denied" });
        window.clarity("consentv2", { analytics_Storage: "denied", ad_Storage: "denied" });
      }
      clearCookies();
      // Unload already-running vendor scripts when consent is withdrawn.
      if (started) location.reload();
    }
    if (!started) document.querySelector("[data-analytics-settings]")?.focus();
  }

  banner.addEventListener("click", (event) => {
    const button = event.target.closest("[data-choice]");
    if (button) save(button.dataset.choice);
    if (event.target.closest("a")) {
      document.querySelector("#privacy-details").open = true;
      banner.hidden = true;
    }
  });
  document.querySelector("[data-analytics-settings]")?.addEventListener("click", () => {
    banner.hidden = false;
    banner.querySelector("button").focus();
  });
  window.addEventListener("storage", (event) => {
    if (event.key === storageKey) location.reload();
  });
  if (choice === "accepted") start();
  else clearCookies();
})();
