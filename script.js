/* =========================================================
   AutomatioVisio — script.js
   Change your contact email here (used everywhere on the site)
   ========================================================= */
const CONTACT_EMAIL = "hello@automatiovisio.com";

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Year + email text ---------- */
  $("#year").textContent = new Date().getFullYear();
  $$("[data-email-text]").forEach((el) => (el.textContent = CONTACT_EMAIL));

  /* ---------- Toast ---------- */
  const toast = $("#toast");
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  /* ---------- Mobile menu ---------- */
  const menuBtn = $("#menuBtn");
  const mobileMenu = $("#mobileMenu");
  function setMenu(open) {
    menuBtn.classList.toggle("open", open);
    mobileMenu.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    setMenu(!mobileMenu.classList.contains("open"));
  });
  document.addEventListener("click", (e) => {
    if (mobileMenu.classList.contains("open") && !e.target.closest("#header")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 900) setMenu(false); });

  /* ---------- Smooth scroll navigation ---------- */
  function goTo(id) {
    const top = id === "top" ? 0 : (() => {
      const el = document.getElementById(id);
      if (!el) return null;
      const pad = parseFloat(getComputedStyle(el).paddingTop) || 0;
      return el.getBoundingClientRect().top + window.scrollY - 84 + Math.max(0, pad - 40);
    })();
    if (top === null) return;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
    history.replaceState(null, "", id === "top" ? location.pathname : "#" + id);
  }
  $$("[data-go]").forEach((btn) =>
    btn.addEventListener("click", () => {
      setMenu(false);
      goTo(btn.dataset.go);
    })
  );
  if (location.hash) {
    const id = location.hash.slice(1);
    setTimeout(() => goTo(id), 150);
  }

  /* ---------- Email buttons ---------- */
  $$("[data-mail]").forEach((btn) =>
    btn.addEventListener("click", () => {
      window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent("Custom Solution Consultation");
    })
  );

  /* ---------- Scroll effects: header, progress, back-to-top, steps line ---------- */
  const header = $("#header");
  const progress = $("#scrollProgress");
  const toTop = $("#toTop");
  const steps = $(".steps");
  const stepsFill = $("#stepsFill");
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("scrolled", y > 20);
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    toTop.classList.toggle("show", y > 700);

    if (steps && stepsFill) {
      const r = steps.getBoundingClientRect();
      const start = window.innerHeight * 0.85;
      const pct = Math.min(1, Math.max(0, (start - r.top) / (r.height + window.innerHeight * 0.3)));
      stepsFill.style.width = pct * 100 + "%";
    }
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => goTo("top"));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const siblings = $$(".reveal", entry.target.parentElement);
        const idx = Math.max(0, siblings.indexOf(entry.target));
        setTimeout(() => entry.target.classList.add("in"), Math.min(idx, 5) * 90);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Active nav link ---------- */
  const navLinks = $$(".nav-link");
  const tracked = ["solutions", "stocksense", "why-us", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if ("IntersectionObserver" in window) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.toggle("active", l.dataset.go === entry.target.id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    tracked.forEach((s) => so.observe(s));
  }

  /* ---------- Card spotlight ---------- */
  $$(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  /* ---------- Hero network canvas ---------- */
  const canvas = $("#network");
  if (canvas && canvas.getContext && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    const hero = $("#hero");
    let w, h, dpr, points = [], running = true;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.offsetWidth;
      h = hero.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.floor((w * h) / 22000));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35
      }));
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        for (let j = i + 1; j < points.length; j++) {
          const q = points[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d = dx * dx + dy * dy;
          if (d < 16000) {
            ctx.strokeStyle = "rgba(129,140,248," + (0.16 * (1 - d / 16000)) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
        const md = mdx * mdx + mdy * mdy;
        if (md < 32000) {
          ctx.strokeStyle = "rgba(34,211,238," + (0.35 * (1 - md / 32000)) + ")";
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = "rgba(165,180,252,0.55)";
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    hero.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    new IntersectionObserver(([entry]) => {
      const wasRunning = running;
      running = entry.isIntersecting;
      if (running && !wasRunning) requestAnimationFrame(draw);
    }).observe(hero);

    resize();
    requestAnimationFrame(draw);
  }

  /* ---------- Hero live automation console ---------- */
  const requests = [
    { id: "PR-2048", type: "Purchase request", who: "Outlet 12", approver: "Finance Checker" },
    { id: "FA-0317", type: "Fixed asset request", who: "Admin Dept", approver: "Finance Manager" },
    { id: "SC-1190", type: "Stock count", who: "Main Store", approver: "Ops Manager" },
    { id: "CL-0562", type: "Expense claim", who: "Sales Team", approver: "Head of Sales" }
  ];
  const stages = $$("#pipeline .stage");
  const pipeBar = $("#pipeBar");
  const log = $("#log");
  const reqId = $("#reqId");
  const reqType = $("#reqType");
  const reqStatus = $("#reqStatus");
  const runCount = $("#runCount");
  let reqIndex = 0;
  let runs = 1284;

  function timeNow() {
    return new Date().toLocaleTimeString("en-GB", { hour12: false });
  }
  function addLog(html, ok) {
    const line = document.createElement("div");
    line.className = "log-line" + (ok ? " ok" : "");
    line.innerHTML = "<time>" + timeNow() + "</time><span>" + html + "</span>";
    log.appendChild(line);
    while (log.children.length > 5) log.removeChild(log.firstChild);
  }

  function runRequest() {
    const r = requests[reqIndex % requests.length];
    reqIndex++;
    reqId.textContent = r.id;
    reqType.textContent = r.type;
    reqStatus.textContent = "Running";
    reqStatus.classList.remove("done");
    stages.forEach((s) => s.classList.remove("on"));
    pipeBar.style.width = "0%";

    const messages = [
      "<b>" + r.id + "</b> submitted by " + r.who,
      "Fields validated · attachments OK",
      "Approved by <b>" + r.approver + "</b>",
      "Record synced to SharePoint list",
      "Requester notified by email"
    ];

    stages.forEach((stage, i) => {
      setTimeout(() => {
        stage.classList.add("on");
        pipeBar.style.width = ((i + 1) / stages.length) * 100 + "%";
        addLog(messages[i], i === stages.length - 1);
        if (i === stages.length - 1) {
          reqStatus.textContent = "Completed";
          reqStatus.classList.add("done");
          runs++;
          runCount.textContent = runs.toLocaleString("en-US");
        }
      }, 400 + i * 950);
    });

    setTimeout(runRequest, 400 + stages.length * 950 + 2200);
  }
  if (stages.length) runRequest();

  /* ---------- StockSense demo ---------- */
  const qVals = $$(".q-val");
  const ssBar = $("#ssBar");
  const ssText = $("#ssText");
  const photoBtn = $("#photoBtn");
  const photoText = $("#photoText");
  const photoTick = $("#photoTick");
  const ssSubmit = $("#ssSubmit");
  let photoAttached = false;

  function updateStock() {
    const done = qVals.filter((q) => Number(q.textContent) > 0).length;
    ssBar.style.width = Math.round((done / qVals.length) * 100) + "%";
    ssText.textContent = done + " of " + qVals.length + " items counted";
  }
  $$(".q-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      const q = qVals[Number(btn.dataset.i)];
      q.textContent = Math.max(0, Math.min(999, Number(q.textContent) + Number(btn.dataset.d)));
      q.classList.remove("bump");
      void q.offsetWidth;
      q.classList.add("bump");
      updateStock();
    })
  );
  photoBtn.addEventListener("click", () => {
    photoAttached = !photoAttached;
    photoBtn.classList.toggle("done", photoAttached);
    photoText.textContent = photoAttached ? "Photo proof attached" : "Tap to attach photo proof";
    photoTick.textContent = photoAttached ? "✓" : "";
  });
  ssSubmit.addEventListener("click", () => {
    const counted = qVals.filter((q) => Number(q.textContent) > 0).length;
    if (counted < qVals.length) {
      showToast("Count every item before submitting.");
      return;
    }
    if (!photoAttached) {
      showToast("Attach photo proof before submitting.");
      return;
    }
    ssSubmit.textContent = "✓ Submitted to HQ";
    ssSubmit.classList.add("sent");
    showToast("Demo: stock count submitted. HQ can see it instantly.");
    setTimeout(() => {
      ssSubmit.textContent = "Submit Count";
      ssSubmit.classList.remove("sent");
    }, 2600);
  });
  updateStock();

  /* ---------- Use case tabs ---------- */
  const tabs = $$(".tab");
  const panels = $$(".tab-panel");
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      const i = tab.dataset.tab;
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle("on", on);
        t.setAttribute("aria-selected", String(on));
      });
      panels.forEach((p) => p.classList.toggle("on", p.dataset.panel === i));
    })
  );

  /* ---------- Savings calculator ---------- */
  const cPeople = $("#cPeople"), cHours = $("#cHours"), cRate = $("#cRate"), cPct = $("#cPct");
  const fmtRM = new Intl.NumberFormat("en-MY", { maximumFractionDigits: 0 });
  const fmtNum = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

  function paintRange(input) {
    const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty("--val", pct + "%");
  }
  function calc() {
    const people = Number(cPeople.value);
    const hours = Number(cHours.value);
    const rate = Number(cRate.value);
    const pct = Number(cPct.value) / 100;

    $("#oPeople").textContent = people;
    $("#oHours").textContent = hours;
    $("#oRate").textContent = rate;
    $("#oPct").textContent = Math.round(pct * 100) + "%";

    const freed = people * hours * 48 * pct;
    $("#rHours").textContent = fmtNum.format(freed);
    $("#rCost").textContent = "RM " + fmtRM.format(freed * rate);
    $("#rFte").textContent = (freed / (40 * 48)).toFixed(1);

    [cPeople, cHours, cRate, cPct].forEach(paintRange);
  }
  [cPeople, cHours, cRate, cPct].forEach((el) => el.addEventListener("input", calc));
  calc();

  /* ---------- Contact form ---------- */
  const form = $("#contactForm");
  const formError = $("#formError");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#fName"), email = $("#fEmail"), msg = $("#fMsg");
    const company = $("#fCompany").value.trim();
    const need = $("#fNeed").value;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

    [name, email, msg].forEach((f) => f.classList.remove("invalid"));
    const missing = [];
    if (!name.value.trim()) missing.push(name);
    if (!emailOk) missing.push(email);
    if (!msg.value.trim()) missing.push(msg);

    if (missing.length) {
      missing.forEach((f) => f.classList.add("invalid"));
      formError.textContent = emailOk || !email.value.trim()
        ? "Please fill in the highlighted fields."
        : "Please enter a valid email address.";
      missing[0].focus();
      return;
    }
    formError.textContent = "";

    const subject = "Consultation request: " + need + (company ? " (" + company + ")" : "");
    const body =
      "Name: " + name.value.trim() + "\n" +
      "Company: " + (company || "-") + "\n" +
      "Email: " + email.value.trim() + "\n" +
      "Interested in: " + need + "\n\n" +
      "Process that slows us down:\n" + msg.value.trim();

    window.location.href =
      "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    showToast("Opening your email app. Just press Send.");
    form.reset();
  });
  ["#fName", "#fEmail", "#fMsg"].forEach((s) =>
    $(s).addEventListener("input", (e) => e.target.classList.remove("invalid"))
  );
});
