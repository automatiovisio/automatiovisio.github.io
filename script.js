/* =========================================================
   AutomatioVisio — script.js
   Edit the three lines below to change contact details everywhere.
   ========================================================= */
const CONTACT_EMAIL = "automatiovisio@gmail.com";
const WHATSAPP_NUMBER = "+0123456789"; // WhatsApp needs the full international number, e.g. +60123456789
const WHATSAPP_MESSAGE = "Hello AutomatioVisio, I would like to discuss a project.";

(function () {
  "use strict";

  /* ---------- Icon library (one sprite, used by every page) ---------- */
  const ICONS = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    up: '<path d="M6 15l6-6 6 6"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    chev: '<path d="M6 9l6 6 6-6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    flow: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7 6h10M6.2 7.8l4.6 8.4M17.8 7.8l-4.6 8.4"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    box: '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    upload: '<path d="M12 15V3m0 0L7 8m5-5 5 5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>',
    check: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 14l2 2 4-4"/>',
    ok: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
    sync: '<path d="M4 4v6h6M20 20v-6h-6"/><path d="M20 10a8 8 0 0 0-14.3-4M4 14a8 8 0 0 0 14.3 4"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    phone: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18h2"/>',
    camera: '<path d="M3 8a2 2 0 0 1 2-2h2l2-2.5h6L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
    grid: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/>',
    chart: '<path d="M3 20h18"/><path d="M6 16v-4M11 16V8M16 16V5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
    send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
    zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    star: '<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    wa: '<path d="M20 11.5a8 8 0 0 1-11.9 7L3 20l1.6-4.9A8 8 0 1 1 20 11.5z"/><path d="M9 8.5c.5 2.6 2.4 4.5 5 5.2l1.2-1.3-1.8-1-.8.6c-.9-.4-1.5-1-1.9-1.9l.6-.8-1-1.8z"/>'
  };

  /* ---------- Planner data (illustrative flows, no invented numbers) ---------- */
  const FIT = { web: "Website Development", flow: "Workflow Automation", sys: "System Development", stock: "StockSense" };
  const NEED = { web: "Website development", flow: "Workflow automation", sys: "Custom system development", stock: "StockSense", unsure: "Not sure yet, let's talk" };
  const NEED_MSG = {
    web: "We would like to discuss a website for our business.",
    flow: "We would like to automate a workflow in our business.",
    sys: "We would like to discuss a custom system for our business.",
    stock: "We would like a demo of StockSense for our stock counts.",
    unsure: ""
  };
  const PLAN = {
    approvals: {
      title: "Approval requests", fit: ["flow", "sys"],
      manual: [["doc", "Paper form"], ["mail", "Email it"], ["clock", "Chase"], ["grid", "Re-type"], ["alert", "Lost track"]],
      auto: [["upload", "Submit"], ["check", "Check"], ["ok", "Approve"], ["sync", "Record"], ["bell", "Notify"]],
      pain: ["Requests wait in inboxes", "People are chased for sign-off", "No one can see where it is"],
      gain: ["Routed to the right approver by your rules", "Reminders when someone is slow", "A full history of who approved what"],
      msg: "We would like to improve our approval process."
    },
    stock: {
      title: "Stock counts", fit: ["stock"],
      manual: [["doc", "Paper sheet"], ["grid", "Re-key"], ["clock", "Wait"], ["alert", "No proof"], ["chart", "Late report"]],
      auto: [["phone", "Count"], ["camera", "Photo"], ["upload", "Submit"], ["sync", "HQ sees"], ["chart", "Report"]],
      pain: ["Paper sheets are typed in later", "No proof of what was counted", "Results arrive late"],
      gain: ["Count on a phone, tap by tap", "Photo proof attached to every count", "Management sees the result straight away"],
      msg: "We would like a demo of StockSense for our stock counts."
    },
    claims: {
      title: "Expense claims", fit: ["flow", "sys"],
      manual: [["doc", "Paper claim"], ["mail", "Lost receipt"], ["clock", "Chase"], ["grid", "Re-type"], ["alert", "Delays"]],
      auto: [["upload", "Submit"], ["camera", "Receipt"], ["check", "Check"], ["ok", "Approve"], ["bell", "Notify"]],
      pain: ["Receipts get lost", "Claims sit waiting for approval", "Finance re-types everything"],
      gain: ["Receipt attached when the claim is submitted", "Approval follows your limits and levels", "Everyone can see the status"],
      msg: "We would like to improve our expense claim process."
    },
    onboarding: {
      title: "Staff onboarding", fit: ["flow", "sys"],
      manual: [["mail", "Email HR"], ["list", "To-do list"], ["clock", "Chase"], ["alert", "Missed step"], ["doc", "Forms"]],
      auto: [["user", "Request"], ["check", "Check"], ["ok", "Approve"], ["list", "Tasks"], ["bell", "Notify"]],
      pain: ["Steps get forgotten between teams", "Paperwork is chased by email", "No single view of progress"],
      gain: ["One request starts every task", "Tasks assigned to the right owners", "Progress visible in one place"],
      msg: "We would like to improve our staff onboarding process."
    },
    surveys: {
      title: "Customer surveys", fit: ["flow", "sys"],
      manual: [["doc", "Build form"], ["mail", "Send out"], ["clock", "Chase"], ["grid", "Collate"], ["alert", "Missed date"]],
      auto: [["ok", "Approve"], ["send", "Send"], ["bell", "Remind"], ["list", "Collect"], ["chart", "Report"]],
      pain: ["Responses are chased one by one", "Results are collated by hand", "Cut-off dates get missed"],
      gain: ["Questions approved before they go out", "Sent in batches with automatic reminders", "Responses collected in one place"],
      msg: "We would like to improve how we run customer surveys."
    },
    website: {
      title: "Website enquiries", fit: ["web", "flow"],
      manual: [["phone", "Phone only"], ["mail", "Missed mail"], ["clock", "Slow reply"], ["alert", "Lost enquiry"], ["doc", "No record"]],
      auto: [["globe", "Visitor"], ["list", "Pages"], ["send", "Enquiry"], ["mail", "Emailed"], ["bell", "Follow up"]],
      pain: ["Customers cannot find clear information", "Enquiries arrive by phone and get missed", "Nothing records who asked what"],
      gain: ["A fast, mobile-friendly website in your brand", "An enquiry form that emails you automatically", "Can connect to a workflow when you are ready"],
      msg: "We would like a new website that brings in enquiries."
    }
  };
  const ORDER = ["approvals", "stock", "claims", "onboarding", "surveys", "website"];

  function init() {
    if (window.__avReady) return;
    window.__avReady = true;

    const root = document.documentElement;
    root.classList.add("js");
    const $ = (s, c) => (c || document).querySelector(s);
    const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const page = document.body.dataset.page;

    /* ---------- Icon sprite ---------- */
    document.body.insertAdjacentHTML(
      "afterbegin",
      '<svg aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden"><defs>' +
        Object.keys(ICONS).map((k) => '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + "</symbol>").join("") +
        "</defs></svg>"
    );
    const ic = (n, c) => '<svg class="' + (c || "i") + '" aria-hidden="true">i-' + n + '"/></svg>';

    /* ---------- Year, email, WhatsApp ---------- */
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    $$("[data-email-text]").forEach((el) => (el.textContent = CONTACT_EMAIL));
    $$("[data-email-link]").forEach((a) => (a.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent("Enquiry from the AutomatioVisio website")));
    const waDigits = WHATSAPP_NUMBER.replace(/\D/g, "");
    $$("[data-wa]").forEach((a) => {
      a.href = "https://wa.me/" + waDigits + "?text=" + encodeURIComponent(a.dataset.waMsg || WHATSAPP_MESSAGE);
      a.target = "_blank";
      a.rel = "noopener";
    });
    $$("[data-wa-text]").forEach((el) => (el.textContent = WHATSAPP_NUMBER));

    /* ---------- Toast ---------- */
    const toast = $("#toast");
    let toastTimer = 0;
    function showToast(msg) {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("show"), 3600);
    }

    /* ---------- Day / night mode ---------- */
    const themeBtn = $("#themeToggle");
    const metaTheme = document.getElementsByName("theme-color")[0];
    function paintTheme(light) {
      root.classList.toggle("light", light);
      if (metaTheme) metaTheme.setAttribute("content", light ? "#F3F5FB" : "#07090E");
      if (themeBtn) themeBtn.setAttribute("aria-label", light ? "Switch to night mode" : "Switch to day mode");
    }
    function setTheme(light) {
      paintTheme(light);
      try { localStorage.setItem("av-theme", light ? "light" : "dark"); } catch (e) {}
    }
    paintTheme(root.classList.contains("light"));
    if (themeBtn) {
      themeBtn.addEventListener("click", (e) => {
        const next = !root.classList.contains("light");
        if (fine && !reduce && document.startViewTransition) {
          const r = themeBtn.getBoundingClientRect();
          const x = e.clientX || r.left + r.width / 2;
          const y = e.clientY || r.top + r.height / 2;
          const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
          const t = document.startViewTransition(() => setTheme(next));
          t.ready.then(() => {
            root.animate(
              { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + radius + "px at " + x + "px " + y + "px)"] },
              { duration: 600, easing: "cubic-bezier(.2,.8,.2,1)", pseudoElement: "::view-transition-new(root)" }
            );
          }).catch(() => {});
        } else {
          setTheme(next);
        }
      });
    }

    /* ---------- Mobile menu + Services dropdown ---------- */
    const menuBtn = $("#menuBtn");
    const menu = $("#mobileMenu");
    function setMenu(open) {
      if (!menuBtn || !menu) return;
      menuBtn.classList.toggle("open", open);
      menu.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (menuBtn) {
      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        setMenu(!menu.classList.contains("open"));
      });
    }
    const dd = $("#dd");
    const ddBtn = $(".dd-btn");
    let ddTimer = 0;
    function setDD(open) {
      if (!dd) return;
      dd.classList.toggle("open", open);
      ddBtn.setAttribute("aria-expanded", String(open));
    }
    if (dd) {
      dd.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { clearTimeout(ddTimer); setDD(true); } });
      dd.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") ddTimer = setTimeout(() => setDD(false), 160); });
      ddBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (e.pointerType === "mouse" && dd.classList.contains("open")) return; // already opened by hover
        setDD(!dd.classList.contains("open"));
      });
      dd.addEventListener("focusout", (e) => { if (!dd.contains(e.relatedTarget)) setDD(false); });
    }
    function closeAll() { setMenu(false); setDD(false); }
    document.addEventListener("click", (e) => {
      if (menu && menu.classList.contains("open") && !e.target.closest("#header")) setMenu(false);
      if (dd && !e.target.closest("#dd")) setDD(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const wasOpen = dd && dd.classList.contains("open");
      closeAll();
      if (wasOpen) ddBtn.focus();
    });
    window.addEventListener("resize", () => { if (innerWidth >= 960) setMenu(false); movePill(activeLink); });

    /* ---------- Desktop nav: active link + sliding highlight ---------- */
    const navLinks = $("#navLinks");
    const pill = $(".nav-pill");
    const links = $$("#navLinks .nav-link");
    let activeLink = null;
    function movePill(el) {
      if (!pill || !navLinks) return;
      if (!el || innerWidth < 960) { pill.style.opacity = "0"; return; }
      const nr = navLinks.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      pill.style.width = r.width + "px";
      pill.style.transform = "translate(" + (r.left - nr.left) + "px,-50%)";
      pill.style.opacity = "1";
    }
    function setActive(el) {
      activeLink = el;
      links.forEach((l) => l.classList.toggle("on", l === el));
      movePill(el);
    }
    setActive(links.find((l) => l.dataset.nav === page) || null);
    if (navLinks) {
      links.forEach((l) => l.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") movePill(l); }));
      navLinks.addEventListener("pointerleave", () => movePill(activeLink));
      window.addEventListener("load", () => movePill(activeLink));
    }
    // On the home page the highlight follows the section you are reading
    if (page === "home" && "IntersectionObserver" in window) {
      const spy = {};
      links.forEach((l) => { if (l.dataset.spy) spy[l.dataset.spy] = l; });
      const secs = Object.keys(spy).map((id) => document.getElementById(id)).filter(Boolean);
      const seen = new Set();
      const so = new IntersectionObserver((entries) => {
        entries.forEach((en) => (en.isIntersecting ? seen.add(en.target.id) : seen.delete(en.target.id)));
        const cur = secs.find((s) => seen.has(s.id));
        setActive(cur ? spy[cur.id] : null);
      }, { rootMargin: "-45% 0px -50% 0px" });
      secs.forEach((s) => so.observe(s));
    }

    /* ---------- Navigation: smooth scrolling + logo goes to the main page ---------- */
    function goTo(id) {
      if (!id || id === "top") {
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth
