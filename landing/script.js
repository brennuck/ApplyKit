// Counting animation in the hero
(function () {
  const el = document.getElementById("counter");
  if (!el) return;

  const target = 1247;
  const duration = 2000;
  let start = null;

  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const value = Math.floor(ease(progress) * target);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(step);
        observer.disconnect();
      }
    },
    { threshold: 0.5 },
  );
  observer.observe(el);
})();

// Scroll reveal for sections
(function () {
  const targets = document.querySelectorAll(
    ".step-card, .site-chip, .contrast-col, .section-heading",
  );
  targets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );

  targets.forEach((el) => observer.observe(el));
})();

// Stagger reveal for site chips
(function () {
  const chips = document.querySelectorAll(".site-chip");
  chips.forEach((chip, i) => {
    chip.style.transitionDelay = `${i * 60}ms`;
  });
})();
