(() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const header = $("[data-header]");
  const menu = $("[data-menu]");
  const modal = $("[data-modal]");
  const lightbox = $("[data-lightbox]");

  const openEl = (el) => {
    if (!el) return;
    el.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  const closeEl = (el) => {
    if (!el) return;
    el.classList.remove("is-open");
    if (!$(".overlay.is-open") && !$(".modal.is-open") && !$(".lightbox.is-open")) {
      document.body.style.overflow = "";
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    },
    { passive: true }
  );

  $$("[data-open-menu]").forEach((btn) =>
    btn.addEventListener("click", () => openEl(menu))
  );
  $$("[data-close-menu]").forEach((btn) =>
    btn.addEventListener("click", () => closeEl(menu))
  );
  $$("[data-open-modal]").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      closeEl(menu);
      openEl(modal);
    })
  );
  $$("[data-close-modal]").forEach((btn) =>
    btn.addEventListener("click", () => closeEl(modal))
  );
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeEl(modal);
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeEl(menu);
      closeEl(modal);
      closeEl(lightbox);
    }
  });

  const slides = $$("[data-hero-slide]");
  const pagerBtns = $$("[data-hero-to]");
  let heroIndex = 0;
  let heroTimer;

  const showHero = (index) => {
    if (!slides.length) return;
    heroIndex = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("is-active", i === heroIndex));
    pagerBtns.forEach((b, i) => b.classList.toggle("is-active", i === heroIndex));
  };

  const startHero = () => {
    if (slides.length < 2) return;
    clearInterval(heroTimer);
    heroTimer = setInterval(() => showHero(heroIndex + 1), 7000);
  };

  pagerBtns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      showHero(i);
      startHero();
    });
  });
  showHero(0);
  startHero();

  $$("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.filter;
      $$("[data-filter]").forEach((b) => b.classList.toggle("is-active", b === btn));
      $$("[data-project]").forEach((card) => {
        const show = value === "all" || card.dataset.project === value;
        card.style.display = show ? "" : "none";
      });
    });
  });

  const lbImg = lightbox && $("img", lightbox);
  $$("[data-lightbox-src]").forEach((el) => {
    el.addEventListener("click", () => {
      if (!lightbox || !lbImg) return;
      lbImg.src = el.dataset.lightboxSrc;
      lbImg.alt = el.dataset.lightboxAlt || "";
      openEl(lightbox);
    });
  });
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.closest("[data-close-lightbox]")) closeEl(lightbox);
    });
  }

  const thumbs = $$("[data-thumb]");
  const stage = $("[data-gallery-stage]");
  thumbs.forEach((btn) => {
    btn.addEventListener("click", () => {
      thumbs.forEach((b) => b.classList.toggle("is-active", b === btn));
      if (!stage) return;
      const img = $("img", stage);
      const source = $("source", stage);
      if (img) {
        img.src = btn.dataset.jpg;
        img.alt = btn.dataset.alt || img.alt;
      }
      if (source) source.srcset = btn.dataset.webp;
      const counter = $("[data-gallery-count]");
      if (counter && btn.dataset.index) counter.textContent = btn.dataset.index;
    });
  });

  $$("form[data-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = form.querySelector("[data-form-ok]");
      form.querySelectorAll("input, textarea, button[type=submit]").forEach((n) => {
        if (n.type !== "hidden") n.disabled = true;
      });
      if (ok) ok.style.display = "block";
    });
  });
})();
