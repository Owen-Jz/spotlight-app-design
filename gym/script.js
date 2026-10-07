// Forge Gym: schedule, pricing toggle, nav, trial form.
(function () {
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const ACCENTS = { Strength: "#ff5a1f", Conditioning: "#ffd21f", Boxing: "#1fd2ff", Mobility: "#7cff6b" };

  // [day index, time, type, coach, spots left]
  const CLASSES = [
    [0, "06:00", "Strength", "Maya Reyes", 4], [0, "12:15", "Mobility", "Aiko Nakamura", 10], [0, "18:00", "Conditioning", "Sam Lindqvist", 0], [0, "19:15", "Boxing", "Dami Kolade", 6],
    [1, "06:00", "Conditioning", "Sam Lindqvist", 8], [1, "07:15", "Mobility", "Aiko Nakamura", 12], [1, "17:30", "Strength", "Maya Reyes", 2], [1, "19:00", "Boxing", "Dami Kolade", 9],
    [2, "06:00", "Strength", "Maya Reyes", 5], [2, "12:15", "Boxing", "Dami Kolade", 11], [2, "18:00", "Conditioning", "Sam Lindqvist", 3], [2, "19:15", "Mobility", "Aiko Nakamura", 14],
    [3, "06:00", "Boxing", "Dami Kolade", 7], [3, "07:15", "Conditioning", "Sam Lindqvist", 9], [3, "17:30", "Strength", "Maya Reyes", 1], [3, "19:00", "Mobility", "Aiko Nakamura", 13],
    [4, "06:00", "Conditioning", "Sam Lindqvist", 6], [4, "12:15", "Strength", "Maya Reyes", 8], [4, "17:30", "Boxing", "Dami Kolade", 0],
    [5, "08:00", "Strength", "Maya Reyes", 3], [5, "09:30", "Conditioning", "Sam Lindqvist", 10], [5, "11:00", "Boxing", "Dami Kolade", 12],
    [6, "09:00", "Mobility", "Aiko Nakamura", 15], [6, "10:30", "Strength", "Maya Reyes", 9],
  ];

  const state = { day: (new Date().getDay() + 6) % 7, type: "all" };

  // Schedule
  const dayTabs = document.getElementById("day-tabs");
  const list = document.getElementById("schedule-list");

  DAYS.forEach((d, i) => {
    const b = document.createElement("button");
    b.className = "day";
    b.textContent = d;
    b.dataset.day = i;
    b.addEventListener("click", () => { state.day = i; renderSchedule(); });
    dayTabs.appendChild(b);
  });

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.type = chip.dataset.filter;
      document.querySelectorAll(".chip").forEach((c) => {
        const on = c === chip;
        c.classList.toggle("active", on);
        c.setAttribute("aria-selected", on);
      });
      renderSchedule();
    });
  });

  function renderSchedule() {
    dayTabs.querySelectorAll(".day").forEach((b) => b.classList.toggle("active", +b.dataset.day === state.day));
    const rows = CLASSES.filter(([d, , type]) => d === state.day && (state.type === "all" || type === state.type));
    list.innerHTML = "";
    if (!rows.length) {
      list.innerHTML = '<li class="empty">No classes match on this day. Try another day or filter.</li>';
      return;
    }
    rows.forEach(([, time, type, coach, spots]) => {
      const li = document.createElement("li");
      li.className = "slot";
      li.style.setProperty("--accent", ACCENTS[type]);
      const full = spots === 0;
      li.innerHTML = `
        <time>${time}</time>
        <div><strong>${type}</strong><span class="coach-name">with ${coach}</span></div>
        <span class="spots ${spots > 0 && spots <= 3 ? "low" : ""}">${full ? "Full" : spots + " spots left"}</span>
        <button class="btn ${full ? "btn-ghost" : ""} book" ${full ? "disabled" : ""}>${full ? "Waitlist" : "Book"}</button>`;
      if (!full) {
        li.querySelector(".book").addEventListener("click", (e) => {
          e.target.textContent = "Booked ✓";
          e.target.disabled = true;
          li.querySelector(".spots").textContent = spots - 1 + " spots left";
        });
      }
      list.appendChild(li);
    });
  }
  renderSchedule();

  // Pricing toggle
  const sw = document.getElementById("billing-switch");
  sw.addEventListener("click", () => {
    const yearly = sw.getAttribute("aria-checked") !== "true";
    sw.setAttribute("aria-checked", yearly);
    document.querySelectorAll(".amount").forEach((el) => {
      el.textContent = yearly ? el.dataset.yearly : el.dataset.monthly;
    });
  });

  // Plan buttons preselect the form
  const planSelect = document.querySelector('#trial-form select[name="plan"]');
  document.querySelectorAll("[data-plan]").forEach((a) => {
    a.addEventListener("click", () => { planSelect.value = a.dataset.plan; });
  });

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  links.addEventListener("click", (e) => {
    if (e.target.tagName === "A") { links.classList.remove("open"); toggle.setAttribute("aria-expanded", false); }
  });

  // Trial form
  const form = document.getElementById("trial-form");
  const msg = form.querySelector(".form-msg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name;
    const email = form.elements.email;
    const badName = !name.value.trim();
    const badEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    name.setAttribute("aria-invalid", badName);
    email.setAttribute("aria-invalid", badEmail);
    if (badName || badEmail) {
      msg.className = "form-msg err";
      msg.textContent = badName ? "Please add your name." : "Please enter a valid email.";
      (badName ? name : email).focus();
      return;
    }
    msg.className = "form-msg ok";
    msg.textContent = `Thanks ${name.value.trim().split(" ")[0]}! We'll be in touch about your free week on ${form.elements.plan.value}.`;
    form.reset();
  });

  // Count-up stats
  const countUp = (el) => {
    const target = +el.dataset.count;
    const start = performance.now();
    const step = (t) => {
      const p = Math.min((t - start) / 1200, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString() + (p === 1 && target >= 1000 ? "+" : "");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      en.target.querySelectorAll("[data-count]").forEach(countUp);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".section-head, .card, .plan, .coach, blockquote, .stats").forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
