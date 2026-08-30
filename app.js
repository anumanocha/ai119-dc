/* ai119 — shared site behavior */

/* Console portal location — swap this one value when the real
   management platform goes live (e.g. "https://console.ai119.com"). */
const CONSOLE_URL = "/console/index.html";

document.addEventListener("DOMContentLoaded", () => {
  // Point every console link at the configured portal
  document.querySelectorAll("[data-console-link]").forEach((a) => {
    a.setAttribute("href", CONSOLE_URL);
  });

  // Theme toggle — light by default, dark on request, persisted
  const applyThemeIcon = () => {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    document.querySelectorAll(".theme-toggle").forEach((b) => {
      b.textContent = dark ? "☀" : "☾";
      b.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    });
  };
  applyThemeIcon();
  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dark = document.documentElement.getAttribute("data-theme") === "dark";
      if (dark) {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
      }
      try { localStorage.setItem("ai119-theme", dark ? "light" : "dark"); } catch (e) { /* noop */ }
      applyThemeIcon();
    });
  });

  // Mobile nav
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  // Animated counters in the stat band
  const counters = document.querySelectorAll("[data-count]");
  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    const dur = 1400;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  // Front-end-only forms: show the success note, never submit anywhere
  document.querySelectorAll("form[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const ok = form.parentElement.querySelector(".form-success");
      if (ok) {
        ok.classList.add("show");
        ok.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      form.reset();
    });
  });
});
