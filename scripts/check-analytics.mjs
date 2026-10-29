import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../site/analytics.js", import.meta.url), "utf8");
const key = "arin-analytics-consent-v1";
function session({ saved, hostname = "arinhandyman.com", storageBlocked = false } = {}) {
  const scripts = [], events = {}, writes = [];
  let banner, cookie = "_ga=test; _ga_2XSD91R1NJ=test; _clck=test; essential=keep";
  const settings = { addEventListener(type, fn) { events.settings = fn; }, focus() {} };
  const button = { focus() {} };
  const document = {
    referrer: "https://example.com/?private=value",
    head: { append(script) { scripts.push(script.src); } },
    body: { append(element) { banner = element; } },
    createElement(tag) {
      return { setAttribute() {}, addEventListener(type, fn) { events[type] = fn; }, querySelector() { return button; } };
    },
    querySelector() { return settings; },
    get cookie() { return cookie; },
    set cookie(value) { writes.push(value); },
  };
  const location = { hostname, origin: `https://${hostname}`, pathname: "/blog/", reload() { events.reloaded = true; } };
  const window = { addEventListener(type, fn) { events[type] = fn; } };
  const localStorage = {
    getItem() { if (storageBlocked) throw Error("blocked"); return saved; },
    setItem(k, v) { if (storageBlocked) throw Error("blocked"); assert.equal(k, key); events.saved = JSON.parse(v); },
  };
  vm.runInNewContext(source, { document, location, window, localStorage, URL });
  return {
    scripts, events, writes, banner, window,
    choose(value) {
      events.click({ target: { closest(selector) { return selector === "[data-choice]" ? { dataset: { choice: value } } : null; } } });
    },
  };
}
const fresh = session();
assert.equal(fresh.scripts.length, 0, "No vendor scripts before consent");
assert.equal(fresh.banner.hidden, false);
fresh.choose("declined");
assert.equal(fresh.scripts.length, 0, "Declining must not load vendors");
assert.equal(fresh.events.saved.value, "declined");
assert(fresh.writes.every((value) => !value.startsWith("essential=")));
fresh.events.settings();
assert.equal(fresh.banner.hidden, false);
fresh.choose("accepted");
assert.deepEqual(fresh.scripts, ["https://www.googletagmanager.com/gtag/js?id=G-2XSD91R1NJ", "https://www.clarity.ms/tag/z528akcxqr"]);
fresh.choose("accepted");
assert.equal(fresh.scripts.length, 2, "Do not initialize tags twice");
const config = [...fresh.window.dataLayer].find((entry) => entry[0] === "config")[2];
assert.equal(config.page_location, "https://arinhandyman.com/blog/");
assert.equal(config.page_referrer, "https://example.com");
assert.equal(config.allow_google_signals, false);
fresh.choose("declined");
assert.equal(fresh.events.reloaded, true, "Withdrawal unloads running trackers");
assert.equal(fresh.window["ga-disable-G-2XSD91R1NJ"], true);
for (const value of ["accepted", "declined"]) {
  const restored = session({ saved: JSON.stringify({ value, time: Date.now() }) });
  assert.equal(restored.banner.hidden, true);
  assert.equal(restored.scripts.length, value === "accepted" ? 2 : 0);
}
for (const saved of ["invalid JSON", JSON.stringify({ value: "accepted", time: Date.now() - 181 * 86400000 })]) {
  const expired = session({ saved });
  assert.equal(expired.scripts.length, 0);
  assert.equal(expired.banner.hidden, false);
}
const blocked = session({ storageBlocked: true });
blocked.choose("accepted");
assert.equal(blocked.scripts.length, 2, "Storage failure must not break the page");
const local = session({ hostname: "localhost" });
local.choose("accepted");
assert.equal(local.scripts.length, 0, "Preview visits must not pollute production data");
console.log("Verified analytics consent, refusal, persistence, expiry, withdrawal, storage failure, and preview exclusion.");
