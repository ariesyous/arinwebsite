const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const header = document.querySelector(".site-header");

function setMenu(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
  navigation.classList.toggle("open", open);
}
menuToggle.addEventListener("click", () =>
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true"),
);
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuToggle.getAttribute("aria-expanded") === "true"
  ) {
    setMenu(false);
    menuToggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!header.contains(event.target)) setMenu(false);
});
window
  .matchMedia("(min-width: 681px)")
  .addEventListener("change", () => setMenu(false));
window.addEventListener(
  "scroll",
  () => header.classList.toggle("scrolled", window.scrollY > 20),
  { passive: true },
);
header.classList.toggle("scrolled", window.scrollY > 20);

const serviceSelect = document.querySelector("#service");
document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    serviceSelect.value = link.dataset.service;
    serviceSelect.dispatchEvent(new Event("change", { bubbles: true }));
    document.querySelector("#form-result").hidden = true;
  });
});
const form = document.querySelector("#estimate-form");
const result = document.querySelector("#form-result");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  result.hidden = false;
  result.focus({ preventScroll: true });
  result.scrollIntoView({ block: "nearest", behavior: "auto" });
});
form.addEventListener("input", () => {
  result.hidden = true;
});
form.addEventListener("change", () => {
  result.hidden = true;
});
document.querySelector("#year").textContent = new Date().getFullYear();
