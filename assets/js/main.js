/* ======================
   GSAP REGISTER
====================== */
gsap.registerPlugin(ScrollTrigger);

/* ======================
   GLOBAL STATE
====================== */
let siteInitialized = false;
let lenisInstance = null;
let cursorInitialized = false;

/* ======================
   GLOBAL LOADER (SAFE)
====================== */
(() => {
  const loader = document.getElementById("loader");

  if (!loader) {
    window.addEventListener("load", initSiteOnce);
    return;
  }

  lockScroll();

  let exited = false;

  function exitLoader() {
    if (exited) return;
    exited = true;

    gsap.to(loader, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete() {
        loader.remove();
        unlockScroll();
        initSiteOnce();
        ScrollTrigger.refresh(true);
      }
    });
  }

  window.addEventListener("load", () => {
    setTimeout(exitLoader, 300);
  });

  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
  });

  // Hard failsafe
  setTimeout(exitLoader, 3500);

  // Back/forward cache fix
  window.addEventListener("pageshow", e => {
    if (e.persisted) {
      unlockScroll();
      loader?.remove();
      initSiteOnce();
      ScrollTrigger.refresh(true);
    }
  });

  function lockScroll() {
    document.documentElement.classList.add("loading");
    document.body.classList.add("loading");
  }

  function unlockScroll() {
    document.documentElement.classList.remove("loading");
    document.body.classList.remove("loading");
  }
})();

/* ======================
   INIT SITE (ONCE)
====================== */
function initSiteOnce() {
  if (siteInitialized) return;
  siteInitialized = true;

  initLenis();
  initGSAP();
  initCursor();
}

/* ======================
   LENIS (SMOOTH SCROLL)
====================== */
function initLenis() {
  if (!window.Lenis) return;
  if (window.innerWidth < 768) return;
  if (lenisInstance) return;

  lenisInstance = new Lenis({
    lerp: 0.07,          // instant response
    smoothWheel: true,
    smoothTouch: false
  });

  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  lenisInstance.on("scroll", ScrollTrigger.update);

  ScrollTrigger.refresh();
}

/* ======================
   GSAP ANIMATIONS
====================== */
function initGSAP() {

  // HERO (LOAD ANIMATION)
  gsap.from(".hero h1", {
    y: 60,
    duration: 0.9,
    ease: "power3.out"
  });

  gsap.from(".hero p", {
    y: 30,
    delay: 0.15,
    duration: 0.9,
    ease: "power3.out"
  });

  // PRODUCT GRID (VISIBLE IMMEDIATELY)
  gsap.utils.toArray(".product-card").forEach(card => {
    gsap.from(card, {
      y: 40,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        once: true   // ensures instant appearance without repaint delay
      }
    });
  });

  // OTHER SECTIONS
  gsap.utils.toArray(".section").forEach(section => {
    gsap.from(section, {
      y: 50,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        once: true
      }
    });
  });
}

/* ======================
   CURSOR (OPTIMIZED)
====================== */
function initCursor() {
  if ("ontouchstart" in window) return;
  if (cursorInitialized) return;

  const cursor = document.querySelector(".cursor");
  const follower = document.querySelector(".cursor-follower");
  if (!cursor || !follower) return;

  cursorInitialized = true;

  let mouseX = 0, mouseY = 0;
  let posX = 0, posY = 0;

  window.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.transform =
      `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  gsap.ticker.add(() => {
    posX += (mouseX - posX) * 0.15;
    posY += (mouseY - posY) * 0.15;

    follower.style.transform =
      `translate(${posX}px, ${posY}px) translate(-50%, -50%)`;
  });

  document.querySelectorAll("a, button, .product-card, .card").forEach(el => {
    el.addEventListener("mouseenter", () => {
      follower.style.transform += " scale(1.5)";
    });

    el.addEventListener("mouseleave", () => {
      follower.style.transform =
        `translate(${posX}px, ${posY}px) translate(-50%, -50%)`;
    });
  });
}
window.addEventListener("load", () => {
  if (gsap && ScrollTrigger) {
    gsap.utils.toArray(".footer-card").forEach(card => {
      gsap.from(card, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%"
        }
      });
    });
  }
});
if (window.innerWidth <= 480) {
    const cards = document.querySelectorAll('.product-card');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('show');
            }, index * 120); // stagger timing
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2
      }
    );

    cards.forEach(card => observer.observe(card));
  }
