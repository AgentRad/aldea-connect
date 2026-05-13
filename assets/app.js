// Aldea Connect — light interactivity
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Footer year
  const yr = $("#yr");
  if (yr) yr.textContent = new Date().getFullYear();

  // Mobile menu
  const hamburger = $("#hamburger");
  const mobileMenu = $("#mobile-menu");
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const open = mobileMenu.dataset.open === "true";
      mobileMenu.dataset.open = open ? "false" : "true";
      mobileMenu.hidden = open;
      hamburger.setAttribute("aria-expanded", String(!open));
    });
    // Close on link click
    $$("#mobile-menu a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileMenu.dataset.open = "false";
        mobileMenu.hidden = true;
        hamburger.setAttribute("aria-expanded", "false");
      })
    );
  }

  // Intake form: client-side acknowledgement (no backend required for v1)
  const form = $("#intake-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // Basic required check
      const required = $$("[required]", form);
      let ok = true;
      required.forEach((el) => {
        if (!el.value.trim()) {
          el.style.borderColor = "#c44";
          ok = false;
        } else {
          el.style.borderColor = "";
        }
      });
      if (!ok) return;

      // Persist locally so it isn't lost; real submission goes to /api/intake later
      try {
        const data = Object.fromEntries(new FormData(form).entries());
        data._ts = new Date().toISOString();
        const queue = JSON.parse(localStorage.getItem("aldea_intake_queue") || "[]");
        queue.push(data);
        localStorage.setItem("aldea_intake_queue", JSON.stringify(queue));
      } catch (_) {}

      const success = $(".form-success", form);
      $$("label, .btn-primary, .fineprint", form).forEach((el) => (el.style.display = "none"));
      if (success) success.hidden = false;
    });
  }

  // Provider filters (works on /providers.html)
  const filterBar = $(".filters");
  if (filterBar) {
    const items = $$("[data-tags]");
    const buttons = $$("button", filterBar);
    const apply = (tag) => {
      buttons.forEach((b) => b.setAttribute("aria-pressed", b.dataset.tag === tag ? "true" : "false"));
      items.forEach((el) => {
        const tags = (el.dataset.tags || "").split(",");
        el.style.display = tag === "all" || tags.includes(tag) ? "" : "none";
      });
    };
    buttons.forEach((b) => b.addEventListener("click", () => apply(b.dataset.tag)));

    // Honor ?service=xyz from the homepage links
    const qs = new URLSearchParams(location.search);
    const initial = qs.get("service");
    if (initial && buttons.some((b) => b.dataset.tag === initial)) apply(initial);
  }

  // Provider search
  const search = $("#provider-search");
  if (search) {
    search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      $$(".provider").forEach((card) => {
        const hay = card.textContent.toLowerCase();
        card.style.display = !q || hay.includes(q) ? "" : "none";
      });
    });
  }

  // Screener mini-quiz (on /screeners.html)
  const quiz = $("#screener");
  if (quiz) {
    const questions = $$(".q", quiz);
    const result = $("#screener-result", quiz);
    quiz.addEventListener("change", () => {
      const answered = questions.filter((q) => $('input[type="radio"]:checked', q));
      if (answered.length !== questions.length) {
        result.hidden = true;
        return;
      }
      const score = answered.reduce((acc, q) => acc + Number($('input[type="radio"]:checked', q).value || 0), 0);
      const max = questions.length * 2;
      const ratio = score / max;
      let band, message;
      if (ratio < 0.34) {
        band = "Low";
        message = "Your answers suggest few flags right now. If you still have concerns, our care navigators can help.";
      } else if (ratio < 0.67) {
        band = "Moderate";
        message = "A few flags showed up — a quick conversation with a clinician is worth scheduling.";
      } else {
        band = "Higher";
        message = "Several flags came up. We recommend reaching out for an evaluation match this week.";
      }
      $(".band", result).textContent = band;
      $(".message", result).textContent = message;
      result.hidden = false;
      result.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
})();
