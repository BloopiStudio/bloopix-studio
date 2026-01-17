gsap.registerPlugin(ScrollTrigger);

/* ======================
   SAFE GLOBAL LOADER
====================== */
(() => {
  const loader = document.getElementById("loader");
  if (!loader) {
    window.addEventListener("load", initSite);
    return;
  }

  document.documentElement.classList.add("loading");
  document.body.classList.add("loading");

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
        unlock();
        initSite();
      }
    });
  }

  function unlock() {
    document.documentElement.classList.remove("loading");
    document.body.classList.remove("loading");
  }

  // wait for full page load (IMPORTANT for cursor + GSAP)
  window.addEventListener("load", () => {
    setTimeout(exitLoader, 300);
  });

  // hard failsafe
  setTimeout(exitLoader, 3500);

  // back/forward cache fix
  window.addEventListener("pageshow", e => {
    if (e.persisted) {
      unlock();
      loader?.remove();
      initSite();
    }
  });
})();

/* ======================
   SITE INIT (AFTER LOAD)
====================== */
function initSite() {
  initLenis();
  initGSAP();
  initCursor();
}

/* ======================
   LENIS
====================== */
function initLenis() {
  if (!window.Lenis || window.innerWidth < 768) return;

  const lenis = new Lenis({ lerp: 0.08 });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

/* ======================
   GSAP ANIMATIONS
====================== */
function initGSAP() {
  gsap.from(".hero h1", {
    y: 80,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  gsap.from(".hero p", {
    y: 40,
    opacity: 0,
    delay: 0.2,
    duration: 1
  });

  gsap.utils.toArray(".section").forEach(section => {
    gsap.from(section, {
      y: 60,
      opacity: 0,
      scrollTrigger: {
        trigger: section,
        start: "top 80%"
      }
    });
  });
}

/* ======================
   CURSOR (FIXED)
====================== */
function initCursor() {
  if ("ontouchstart" in window) return;

  const cursor = document.querySelector(".cursor");
  const follower = document.querySelector(".cursor-follower");
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let posX = 0, posY = 0;

  window.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.transform =
      `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  gsap.ticker.add(() => {
    posX += (mouseX - posX) * 0.12;
    posY += (mouseY - posY) * 0.12;

    follower.style.transform =
      `translate(${posX}px, ${posY}px) translate(-50%, -50%)`;
  });

  document.querySelectorAll("a, button, .product-card, .card").forEach(el => {

    el.addEventListener("mouseenter", () => {
      follower.style.transform += " scale(1.6)";
    });

    el.addEventListener("mouseleave", () => {
      follower.style.transform =
        `translate(${posX}px, ${posY}px) translate(-50%, -50%)`;
    });
  });
}
