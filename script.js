/* =========================================================
   AutomatioVisio — script.js
   Change your contact email here (used on every page)
   ========================================================= */
const CONTACT_EMAIL = "automatiovisio@gmail.com";

(function () {
  "use strict";

  function init() {
    if (window.__avReady) return;
    window.__avReady = true;

    const root = document.documentElement;
    root.classList.add("js");
    const $ = (s, c) => (c || document).querySelector(s);
    const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Year + email ---------- */
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    $$("[data-email-text]").forEach((el) => (el.textContent = CONTACT_EMAIL));

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
        // The circular reveal is desktop-only: phones just switch instantly.
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

    /* ---------- Mobile menu ---------- */
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
    document.addEventListener("click", (e) => {
      if (menu && menu.classList.contains("open") && !e.target.closest("#header")) setMenu(false);
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", () => { if (innerWidth >= 960) setMenu(false); });

    /* ---------- Navigation (works on every page) ---------- */
    function goTo(id) {
      if (!id || id === "top") {
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        return;
      }
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      try { history.replaceState(null, "", "#" + id); } catch (e) {}
    }
    const clean = (p) => p.replace(/index\.html$/, "").replace(/\/$/, "");
    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-href]");
      if (!el) return;
      e.preventDefault();
      setMenu(false);
      const url = new URL(el.getAttribute("data-href"), location.href);
      if (clean(url.pathname) === clean(location.pathname)) goTo(url.hash.slice(1));
      else location.href = url.href;
    });
    if (location.hash.length > 1) {
      setTimeout(() => {
        const el = document.getElementById(location.hash.slice(1));
        if (el && Math.abs(el.getBoundingClientRect().top - 16) > 40) el.scrollIntoView({ block: "start" });
      }, 150);
    }
    const page = document.body.dataset.page;
    $$("[data-nav]").forEach((el) => el.classList.toggle("on", el.dataset.nav === page));

    /* ---------- Email buttons ---------- */
    $$("[data-mail]").forEach((b) =>
      b.addEventListener("click", () => {
        window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent("Custom Solution Consultation");
      })
    );

    /* ---------- Back-to-top (one tiny scroll check) ---------- */
    const toTop = $("#toTop");
    if (toTop) {
      let shown = false, ticking = false;
      addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const s = scrollY > 800;
          if (s !== shown) { shown = s; toTop.classList.toggle("show", s); }
          ticking = false;
        });
      }, { passive: true });
      toTop.addEventListener("click", () => goTo("top"));
    }

    /* ---------- Scroll reveal: desktop with a mouse only ---------- */
    const reveals = $$(".reveal");
    if (fine && !reduce && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
      reveals.forEach((el) => io.observe(el));
      const sweep = () => reveals.forEach((el) => {
        if (!el.classList.contains("in") && el.getBoundingClientRect().top < innerHeight) el.classList.add("in");
      });
      let st = 0;
      addEventListener("scroll", () => { clearTimeout(st); st = setTimeout(sweep, 150); }, { passive: true });
      addEventListener("load", sweep);
    } else {
      reveals.forEach((el) => el.classList.add("in"));
    }

    /* ---------- Hero network: desktop with a mouse only ---------- */
    const canvas = $("#network");
    const hero = $("#hero");
    if (canvas && hero && fine && !reduce && innerWidth >= 1024) {
      const ctx = canvas.getContext("2d");
      let w = 0, h = 0, pts = [], active = false, inView = false, last = 0;
      function size() {
        const dpr = Math.min(devicePixelRatio || 1, 2);
        w = hero.offsetWidth; h = hero.offsetHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const n = Math.min(40, Math.floor((w * h) / 26000));
        pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3 }));
      }
      function frame(t) {
        if (!active) return;
        requestAnimationFrame(frame);
        if (t - last < 33) return; // ~30 fps is plenty
        last = t;
        const light = root.classList.contains("light");
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          for (let j = i + 1; j < pts.length; j++) {
            const q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
            if (d < 17000) {
              ctx.strokeStyle = "rgba(" + (light ? "99,102,241" : "129,140,248") + "," + (0.18 * (1 - d / 17000)) + ")";
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
            }
          }
          ctx.fillStyle = light ? "rgba(79,70,229,.5)" : "rgba(165,180,252,.55)";
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, 6.2832); ctx.fill();
        }
      }
      function update() {
        const on = inView && !document.hidden && innerWidth >= 1024;
        if (on && !active) { active = true; requestAnimationFrame(frame); }
        else if (!on) active = false;
      }
      size();
      new IntersectionObserver(([en]) => { inView = en.isIntersecting; update(); }).observe(hero);
      document.addEventListener("visibilitychange", update);
      let rt = 0;
      addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { size(); update(); }, 200); });
    }

         /* ---------- Workflow card animation (plays only while on screen) ---------- */
    const flow = $(".flow");
    if (flow && !reduce && "IntersectionObserver" in window) {
      let vis = false;
      const sync = () => flow.classList.toggle("play", vis && !document.hidden);
      new IntersectionObserver(([en]) => { vis = en.isIntersecting; sync(); }, { threshold: 0.3 }).observe(flow);
      document.addEventListener("visibilitychange", sync);
    }
    /* ---------- Hero live console (runs only while visible) ---------- */
    const con = $("#console");
    if (con) {
      const stages = $$(".stage", con);
      const fill = $("#pipeFill"), log = $("#log"), reqId = $("#reqId"), reqType = $("#reqType");
      const status = $("#reqStatus"), runEl = $("#runCount");
      const reqs = [
        { id: "PR-2048", type: "Purchase request", who: "Outlet 12", by: "Finance Checker" },
        { id: "PA-0317", type: "Asset purchase approval", who: "Admin Dept", by: "Finance Manager" },
        { id: "SC-1190", type: "Stock count", who: "Main Store", by: "Ops Manager" },
        { id: "EX-0562", type: "Expense claim", who: "Sales Team", by: "Head of Sales" }
      ];
      const msgs = (r) => [
        "<b>" + r.id + "</b> submitted by " + r.who,
        "Fields validated · attachments OK",
        "Approved by <b>" + r.by + "</b>",
        "Record updated in the system",
        "<b>Done.</b> Requester notified"
      ];
      const clock = () => new Date().toLocaleTimeString("en-GB", { hour12: false });
      function addLog(html, ok) {
        const d = document.createElement("div");
        d.className = "log-line" + (ok ? " ok" : "");
        d.innerHTML = "<time>" + clock() + "</time><span>" + html + "</span>";
        log.appendChild(d);
        while (log.children.length > 3) log.removeChild(log.firstChild);
      }
      let ri = 0, si = 0, runs = 1284, cur = reqs[0], timer = 0, running = false;
      function pick() {
        cur = reqs[ri % reqs.length]; ri++;
        reqId.textContent = cur.id; reqType.textContent = cur.type;
        status.textContent = "Running"; status.classList.remove("done");
        stages.forEach((s) => s.classList.remove("on"));
        fill.style.transform = "scaleX(0)";
      }
      function tick() {
        if (!running) return;
        if (si === 0) pick();
        stages[si].classList.add("on");
        fill.style.transform = "scaleX(" + (si + 1) / stages.length + ")";
        addLog(msgs(cur)[si], si === stages.length - 1);
        si++;
        if (si === stages.length) {
          status.textContent = "Completed"; status.classList.add("done");
          runs++; runEl.textContent = runs.toLocaleString("en-US");
          si = 0; timer = setTimeout(tick, 2400);
        } else {
          timer = setTimeout(tick, 900);
        }
      }
      function setRun(v) {
        if (v === running) return;
        running = v; clearTimeout(timer);
        if (v) timer = setTimeout(tick, 300);
      }
      if (reduce) {
        pick();
        stages.forEach((s) => s.classList.add("on"));
        fill.style.transform = "scaleX(1)";
        msgs(cur).slice(-3).forEach((m, i) => addLog(m, i === 2));
        status.textContent = "Completed"; status.classList.add("done");
      } else {
        let inView = false;
        new IntersectionObserver(([en]) => { inView = en.isIntersecting; setRun(inView && !document.hidden); }, { threshold: 0.2 }).observe(con);
        document.addEventListener("visibilitychange", () => setRun(inView && !document.hidden));
      }
    }

    /* ---------- Use-case tabs ---------- */
    const tabs = $$(".tab");
    const panels = $$(".tab-panel");
    tabs.forEach((tab) => tab.addEventListener("click", () => {
      tabs.forEach((t) => { const on = t === tab; t.classList.toggle("on", on); t.setAttribute("aria-selected", String(on)); });
      panels.forEach((p) => p.classList.toggle("on", p.dataset.panel === tab.dataset.tab));
    }));

    /* ---------- +/- steppers (StockSense + calculator) ---------- */
    function paintStepper(st, v) {
      const min = Number(st.dataset.min), max = Number(st.dataset.max);
      st.dataset.value = v;
      st.querySelector(".st-val").textContent = v + (st.dataset.suffix || "");
      st.querySelector(".minus").classList.toggle("off", v <= min);
      st.querySelector(".plus").classList.toggle("off", v >= max);
    }
    function stepBy(btn) {
      const st = btn.closest(".stepper");
      if (!st) return false;
      const min = Number(st.dataset.min), max = Number(st.dataset.max);
      const step = Number(st.dataset.step) || 1;
      const next = Number(st.dataset.value) + Number(btn.dataset.dir) * step;
      if (next < min || next > max) return false;
      paintStepper(st, next);
      st.dispatchEvent(new CustomEvent("stepper", { bubbles: true }));
      return true;
    }
    $$(".stepper").forEach((st) => paintStepper(st, Number(st.dataset.value)));

    // A normal tap/click steps once. Pressing and holding repeats quickly.
    let holdT = 0, holdI = 0, held = false;
    const stopHold = () => { clearTimeout(holdT); clearInterval(holdI); holdT = holdI = 0; };
    document.addEventListener("pointerdown", (e) => {
      const b = e.target.closest(".st-btn");
      if (!b || (e.pointerType === "mouse" && e.button !== 0)) return;
      held = false; stopHold();
      holdT = setTimeout(() => {
        held = true;
        if (!stepBy(b)) { stopHold(); return; }
        holdI = setInterval(() => { if (!stepBy(b)) stopHold(); }, 100);
      }, 420);
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((t) => document.addEventListener(t, stopHold, true));
    document.addEventListener("click", (e) => {
      const b = e.target.closest(".st-btn");
      if (!b) return;
      if (held) { held = false; return; }
      stepBy(b);
    });
    document.addEventListener("contextmenu", (e) => { if (e.target.closest(".st-btn")) e.preventDefault(); });

    /* ---------- StockSense demo ---------- */
    const stock = $("#stock");
    if (stock) {
      const sts = $$(".stepper", stock);
      const bar = $("#ssBar"), txt = $("#ssText");
      const photoBtn = $("#photoBtn"), photoText = $("#photoText"), photoTick = $("#photoTick"), submit = $("#ssSubmit");
      let photo = false;
      const refresh = () => {
        const done = sts.filter((s) => Number(s.dataset.value) > 0).length;
        bar.style.transform = "scaleX(" + done / sts.length + ")";
        txt.textContent = done + " of " + sts.length + " items counted";
      };
      stock.addEventListener("stepper", refresh);
      refresh();
      photoBtn.addEventListener("click", () => {
        photo = !photo;
        photoBtn.classList.toggle("done", photo);
        photoText.textContent = photo ? "Photo proof attached" : "Tap to attach photo proof";
        photoTick.textContent = photo ? "✓" : "";
      });
      submit.addEventListener("click", () => {
        if (sts.some((s) => Number(s.dataset.value) === 0)) { showToast("Count every item before submitting."); return; }
        if (!photo) { showToast("Attach photo proof before submitting."); return; }
        submit.textContent = "✓ Submitted to HQ";
        submit.classList.add("sent");
        showToast("Demo: count submitted. HQ sees it instantly.");
        setTimeout(() => { submit.textContent = "Submit Count"; submit.classList.remove("sent"); }, 2400);
      });
    }

    /* ---------- Savings calculator ---------- */
    const calc = $("#calc");
    if (calc) {
      const val = (id) => Number($("#" + id).dataset.value);
      const fmt = (n) => Math.round(n).toLocaleString("en-US");
      const out = { cost: $("#rCost"), bar: $("#rBar"), month: $("#rMonth"), hours: $("#rHours"), fte: $("#rFte") };
      const render = () => {
        const freed = val("sPeople") * val("sHours") * 48 * (val("sPct") / 100);
        const yearly = freed * val("sRate");
        out.cost.textContent = "RM " + fmt(yearly);
        out.bar.textContent = "RM " + fmt(yearly);
        out.month.textContent = "RM " + fmt(yearly / 12);
        out.hours.textContent = fmt(freed);
        out.fte.textContent = (freed / (40 * 48)).toFixed(1);
      };
      calc.addEventListener("stepper", render);
      render();
    }

    /* ---------- Contact form: emails you automatically (FormSubmit) ---------- */
    const form = $("#contactForm");
    if (form) {
      const FORM_ENDPOINT = "https://formsubmit.co/ajax/" + CONTACT_EMAIL;
      const err = $("#formError");
      const sendBtn = form.querySelector('button[type="submit"]');
      const fName = $("#fName"), fEmail = $("#fEmail"), fMsg = $("#fMsg"), fNeed = $("#fNeed"), fCompany = $("#fCompany");

      $$("[data-prefill]").forEach((b) => b.addEventListener("click", () => {
        fNeed.value = b.dataset.prefill;
        if (!fMsg.value.trim()) fMsg.value = b.dataset.message || "";
        goTo("contact");
      }));
      [fName, fEmail, fMsg].forEach((f) => f.addEventListener("input", () => f.classList.remove("invalid")));

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fEmail.value.trim());
        [fName, fEmail, fMsg].forEach((f) => f.classList.remove("invalid"));
        const bad = [];
        if (!fName.value.trim()) bad.push(fName);
        if (!emailOk) bad.push(fEmail);
        if (!fMsg.value.trim()) bad.push(fMsg);
        if (bad.length) {
          bad.forEach((f) => f.classList.add("invalid"));
          err.textContent = emailOk || !fEmail.value.trim() ? "Please fill in the highlighted fields." : "Please enter a valid email address.";
          bad[0].focus();
          return;
        }
        err.textContent = "";

        const company = fCompany.value.trim();
        const payload = {
          _subject: "New enquiry: " + fNeed.value + (company ? " (" + company + ")" : ""),
          _template: "table",
          _captcha: "false",
          _honey: "",
          name: fName.value.trim(),
          company: company || "-",
          email: fEmail.value.trim(),
          interested_in: fNeed.value,
          message: fMsg.value.trim(),
          submitted_at: new Date().toLocaleString("en-MY", { timeZone: "Asia/Kuala_Lumpur" })
        };

        const label = sendBtn.innerHTML;
        sendBtn.disabled = true;
        sendBtn.textContent = "Sending...";
        try {
          const res = await fetch(FORM_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (!res.ok || String(data.success) !== "true") throw new Error("send failed");
          showToast("Thank you. We received your enquiry and will reply soon.");
          form.reset();
        } catch (x) {
          // Safety net: if the email service is unavailable, open the visitor's email app instead
          const body = "Name: " + payload.name + "\nCompany: " + payload.company + "\nEmail: " + payload.email + "\nInterested in: " + payload.interested_in + "\n\nProcess that slows us down:\n" + payload.message;
          window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(payload._subject) + "&body=" + encodeURIComponent(body);
          showToast("Opening your email app. Just press Send.");
        } finally {
          sendBtn.disabled = false;
          sendBtn.innerHTML = label;
        }
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
