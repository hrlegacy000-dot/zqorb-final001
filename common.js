/* Shared ZQORB behavior — loaded on every page so nav, menu, motion and
   the workspace upload-preview behave identically everywhere without
   being rewritten per page. Page-specific scripts (script.js on the
   homepage) can call window.ZQORB.observe(el) to register elements
   they inject dynamically with the same reveal observer. */
window.ZQORB = (function () {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: .12 });

  function observe(el) { observer.observe(el); }
  function observeAll(root = document) { root.querySelectorAll(".reveal").forEach(observe); }

  function initNav() {
    const nav = document.getElementById("nav");
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initMobileMenu() {
    const menu = document.getElementById("menu"), mobile = document.getElementById("mobileMenu");
    if (!menu || !mobile) return;
    menu.addEventListener("click", () => mobile.classList.toggle("open"));
    mobile.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mobile.classList.remove("open")));
  }

  function initPointer() {
    if (reduceMotion || !matchMedia("(pointer:fine)").matches) return;
    const dot = document.querySelector(".cursor-dot");
    if (dot) window.addEventListener("pointermove", e => {
      dot.style.left = e.clientX + "px"; dot.style.top = e.clientY + "px";
    });
    document.querySelectorAll(".magnetic").forEach(el => {
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * .12, y = (e.clientY - r.top - r.height / 2) * .12;
        el.style.transform = `translate(${x}px,${y}px)`;
      });
      el.addEventListener("pointerleave", () => el.style.transform = "");
    });
  }

  function initYear() {
    document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
  }

  // Generic upload-preview wiring: any .file-panel with a .file-input
  // fills the matching .file-list / .image-list inside that same panel.
  // Works for however many panels exist on a page (homepage teaser,
  // or a single project page), without hardcoded element IDs.
  function initWorkspaceUploads(root = document) {
    root.querySelectorAll(".file-input").forEach(input => {
      if (input.dataset.bound) return;
      input.dataset.bound = "1";
      input.addEventListener("change", () => {
        const files = [...input.files];
        const panel = input.closest(".file-panel");
        const target = panel && panel.querySelector(input.dataset.kind === "images" ? ".image-list" : ".file-list");
        if (!target || !files.length) return;
        target.innerHTML = "";
        files.forEach(file => {
          const row = document.createElement("div");
          row.className = "file-item";
          if (input.dataset.kind === "images" && file.type.startsWith("image/")) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(file); img.className = "image-thumb"; img.alt = file.name;
            row.append(img, document.createTextNode(file.name));
          } else {
            row.textContent = file.name;
          }
          target.appendChild(row);
        });
      });
    });
  }

  function init() {
    initYear(); initNav(); initMobileMenu(); initPointer(); initWorkspaceUploads(); observeAll();
  }

  document.addEventListener("DOMContentLoaded", init);

  return { observe, observeAll, initWorkspaceUploads };
})();
