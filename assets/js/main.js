gsap.registerPlugin(ScrollTrigger);

/* ======================
   LOADER
====================== */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  gsap.to(loader, {
    opacity: 0,
    duration: 0.6,
    onComplete: () => {
      loader.remove();
      document.body.classList.add("loaded");
      initSite();
    }
  });
});

function initSite() {
  initLenis();
  initGSAP();
  initCursor();
}

/* ======================
   LENIS
====================== */
function initLenis() {
  if (!window.Lenis) return;

  const lenis = new Lenis({ lerp: 0.08 });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

/* ======================
   GSAP
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
   CURSOR (STABLE)
====================== */
function initCursor() {
  if ("ontouchstart" in window) return;

  const cursor = document.querySelector(".cursor");
  const follower = document.querySelector(".cursor-follower");

  let x = 0, y = 0, fx = 0, fy = 0;

  window.addEventListener("mousemove", e => {
    x = e.clientX;
    y = e.clientY;
  });

  gsap.ticker.add(() => {
    fx += (x - fx) * 0.15;
    fy += (y - fy) * 0.15;

    cursor.style.transform = `translate(${x}px, ${y}px)`;
    follower.style.transform = `translate(${fx}px, ${fy}px)`;
  });
}
