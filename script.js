/* ============================================================
   TOTAL SOCCER CHARLOTTE — SCRIPT
   Motion-powered entrance / reveal / hover animations
   + vanilla nav, mobile menu, lightbox, form validation
   ============================================================ */
import { animate, scroll } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Spring presets reused across the page */
const springSoft = { type: "spring", stiffness: 120, damping: 18 };
const springSnappy = { type: "spring", stiffness: 400, damping: 28 };

/* ============================================================
   NAV: transparent -> solid on scroll
   ============================================================ */
const nav = document.getElementById("nav");
const fab = document.getElementById("fabMenu");
function onScroll() {
  nav.classList.toggle("nav--scrolled", window.scrollY > 80);
  // Show the floating menu once the user scrolls past the hero.
  fab.classList.toggle("fab-menu--visible", window.scrollY > 500);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ============================================================
   MOBILE MENU
   ============================================================ */
const toggle = document.getElementById("navToggle");
const menu = document.getElementById("mobileMenu");
const menuClose = document.getElementById("mobileMenuClose");

function openMenu() {
  menu.classList.add("mobile-menu--open");
  menu.setAttribute("aria-hidden", "false");
  toggle.setAttribute("aria-expanded", "true");
  fab.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}
function closeMenu() {
  menu.classList.remove("mobile-menu--open");
  menu.setAttribute("aria-hidden", "true");
  toggle.setAttribute("aria-expanded", "false");
  fab.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

toggle.addEventListener("click", openMenu);
fab.addEventListener("click", openMenu);
menuClose.addEventListener("click", closeMenu);
menu.querySelectorAll(".mobile-menu__link, .mobile-menu__cta").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

/* ============================================================
   SERVICE DROPDOWNS — in-page expandable panels (no new tabs)
   ============================================================ */
const serviceCards = document.querySelectorAll(".service-card");
serviceCards.forEach((card) => {
  const trigger = card.querySelector(".service-card__cta");
  const panel = card.querySelector(".service-panel");
  if (!trigger || !panel) return;

  trigger.addEventListener("click", () => {
    const isOpen = panel.classList.contains("is-open");

    // Accordion behavior: close any other open panel first.
    serviceCards.forEach((other) => {
      if (other === card) return;
      other.querySelector(".service-panel")?.classList.remove("is-open");
      other.querySelector(".service-card__cta")?.setAttribute("aria-expanded", "false");
    });

    panel.classList.toggle("is-open", !isOpen);
    trigger.setAttribute("aria-expanded", String(!isOpen));
  });
});

/* ============================================================
   HERO ENTRANCE — staggered spring-in on load
   ============================================================ */
const heroItems = document.querySelectorAll(".hero__content .reveal-load");
if (reduceMotion) {
  heroItems.forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
} else {
  heroItems.forEach((el, i) => {
    animate(
      el,
      { opacity: [0, 1], transform: ["translateY(26px)", "translateY(0px)"] },
      { ...springSoft, delay: 0.15 + i * 0.12 }
    );
  });
}

/* ============================================================
   SCROLL REVEAL — spring-based, triggered as elements enter view
   ============================================================ */
const revealEls = document.querySelectorAll(".reveal");
if (reduceMotion || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
} else {
  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseFloat(getComputedStyle(el).getPropertyValue("--delay")) || 0;
        animate(
          el,
          { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0px)"] },
          { ...springSoft, delay }
        );
        observer.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
}

/* ============================================================
   HERO PARALLAX — subtle scroll-linked drift on the hero content
   ============================================================ */
const heroContent = document.querySelector(".hero__content");
if (!reduceMotion && heroContent) {
  scroll(
    animate(heroContent, { transform: ["translateY(0px)", "translateY(60px)"], opacity: [1, 0.6] }),
    { target: document.querySelector(".hero"), offset: ["start start", "end start"] }
  );
}

/* ============================================================
   HOVER MICRO-INTERACTIONS — buttons + service cards
   ============================================================ */
if (!reduceMotion) {
  // Buttons: gentle lift + scale
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      animate(btn, { transform: "translateY(-2px) scale(1.04)" }, springSnappy);
    });
    btn.addEventListener("mouseleave", () => {
      animate(btn, { transform: "translateY(0px) scale(1)" }, springSnappy);
    });
  });

  // Service cards: stronger lift on hover
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      animate(card, { transform: "translateY(-8px) scale(1.015)" }, springSoft);
    });
    card.addEventListener("mouseleave", () => {
      animate(card, { transform: "translateY(0px) scale(1)" }, springSoft);
    });
  });
}

/* ============================================================
   GALLERY LIGHTBOX
   ============================================================ */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const galleryItems = document.querySelectorAll(".gallery__item");

function openLightbox(item) {
  const img = item.querySelector("img");
  lightboxImg.src = item.getAttribute("data-src");
  lightboxImg.alt = img ? img.alt : "";
  lightbox.classList.add("lightbox--open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  if (!reduceMotion) {
    animate(lightboxImg, { transform: ["scale(0.85)", "scale(1)"], opacity: [0, 1] }, springSoft);
  }
}
function closeLightbox() {
  lightbox.classList.remove("lightbox--open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

galleryItems.forEach((item) => {
  item.addEventListener("click", () => openLightbox(item));
});
lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

/* Shared Escape handler: closes menu + lightbox */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMenu();
    closeLightbox();
  }
});

/* ============================================================
   CONTACT FORM VALIDATION
   ============================================================ */
const form = document.getElementById("contactForm");
const success = document.getElementById("contactSuccess");
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setError(name, message) {
  const input = form.querySelector(`[name="${name}"]`);
  const errorEl = form.querySelector(`[data-error-for="${name}"]`);
  const field = input.closest(".field");
  field.classList.toggle("field--invalid", Boolean(message));
  errorEl.textContent = message || "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;
  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    message: form.message.value.trim(),
  };

  if (!data.name) { setError("name", "Please enter your name."); valid = false; }
  else { setError("name", ""); }

  if (!data.email) { setError("email", "Please enter your email."); valid = false; }
  else if (!emailRe.test(data.email)) { setError("email", "Please enter a valid email address."); valid = false; }
  else { setError("email", ""); }

  if (!data.phone) { setError("phone", "Please enter your phone number."); valid = false; }
  else { setError("phone", ""); }

  if (!data.message) { setError("message", "Please enter a message."); valid = false; }
  else { setError("message", ""); }

  if (!valid) {
    success.classList.remove("contact__success--show");
    return;
  }

  // Form does not submit anywhere — show styled success message.
  form.reset();
  success.classList.add("contact__success--show");
  if (!reduceMotion) {
    animate(success, { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0px)"] }, springSoft);
  }
  success.scrollIntoView({ behavior: "smooth", block: "center" });
});

// Clear a field's error as the user corrects it.
form.querySelectorAll("input, textarea").forEach((el) => {
  el.addEventListener("input", () => {
    if (el.value.trim()) setError(el.name, "");
  });
});
