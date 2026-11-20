// 每个原创动效的小预览。
// html: 预览舞台里的内容；play(stage): 播放一次；stop(stage): 复原。
// 「减弱动效」开关打开时（<html data-rm="1">），CSS 和 play() 都会换成减弱版本。
(function () {
  const rm = () => document.documentElement.dataset.rm === "1";
  const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  const t = (zh, en) => (document.documentElement.lang === "en" ? en : zh);

  const FLAME = '<svg class="fl" viewBox="3 2 18 20" width="1em" height="1em" aria-hidden="true"><path d="M12 12c2 -2.96 0 -7 -1 -8c0 3.038 -1.773 4.741 -3 6c-1.226 1.26 -2 3.24 -2 5a6 6 0 1 0 12 0c0 -1.532 -1.056 -3.94 -2 -5c-1.786 3 -2.791 3 -4 2z" fill="#f97316" stroke="#f97316" stroke-width="1.2" stroke-linejoin="round"/><path d="M12 12c2 -2.96 0 -7 -1 -8c0 3.038 -1.773 4.741 -3 6c-1.226 1.26 -2 3.24 -2 5a6 6 0 1 0 12 0c0 -1.532 -1.056 -3.94 -2 -5c-1.786 3 -2.791 3 -4 2z" fill="#fde68a" transform="translate(12 17) scale(.45) translate(-12 -17)"/></svg>';

  const P = {};

  P["card-hover-lift"] = {
    html: () => `<div class="pv-card"><div class="pv-cover"></div><b>${t("一元一次方程", "Linear equations")}</b><small>${t("12 课时", "12 lessons")}</small></div>`,
    play: (s) => s.querySelector(".pv-card").classList.add("on"),
    stop: (s) => s.querySelector(".pv-card").classList.remove("on"),
  };

  P["bookmark-pop"] = {
    html: () => `<span class="pv-bookmark"><svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z"/></svg></span>`,
    play: (s) => restart(s.querySelector(".pv-bookmark"), "on"),
    stop: (s) => s.querySelector(".pv-bookmark").classList.remove("on"),
  };

  P["play-pause-morph"] = {
    html: () => `<span class="pv-play"><svg class="i-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><svg class="i-pause" viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg></span>`,
    play: (s) => s.querySelector(".pv-play").classList.toggle("on"),
    stop: (s) => s.querySelector(".pv-play").classList.remove("on"),
    loop: 1100,
  };

  P["option-select-pulse"] = {
    html: () => `<div class="pv-options"><span class="pv-opt">3</span><span class="pv-opt">4</span><span class="pv-opt">7</span></div>`,
    play: (s) => restart(s.querySelectorAll(".pv-opt")[1], "on"),
    stop: (s) => s.querySelectorAll(".pv-opt")[1].classList.remove("on"),
  };

  P["correct-confetti"] = {
    html: () => `<div class="pv-confetti"><span class="pv-btn">${t("提交", "Submit")}</span><span class="pv-badge">✓ ${t("答对了", "Correct")}</span></div>`,
    play: (s) => {
      const box = s.querySelector(".pv-confetti");
      if (rm()) { restart(box.querySelector(".pv-badge"), "on"); return; }
      const colors = ["#e8743b", "#f6c344", "#4fb286", "#6b8afd", "#e86a9b"];
      for (let i = 0; i < 24; i++) {
        const p = document.createElement("i");
        const a = (Math.PI * 2 * i) / 24 + Math.random() * 0.3;
        const d = 50 + Math.random() * 60;
        p.style.setProperty("--x", Math.cos(a) * d + "px");
        p.style.setProperty("--y", Math.sin(a) * d - 20 + "px");
        p.style.setProperty("--r", Math.random() * 540 + "deg");
        p.style.background = colors[i % colors.length];
        p.addEventListener("animationend", () => p.remove());
        box.appendChild(p);
      }
    },
    stop: (s) => { s.querySelectorAll(".pv-confetti i").forEach((p) => p.remove()); s.querySelector(".pv-badge").classList.remove("on"); },
  };

  P["wrong-answer-shake"] = {
    html: () => `<div class="pv-options"><span class="pv-opt pv-wrong">7</span></div><small class="pv-hint">${t("再想想", "Try again")}</small>`,
    play: (s) => { restart(s.querySelector(".pv-wrong"), "on"); s.querySelector(".pv-hint").classList.add("on"); },
    stop: (s) => { s.querySelector(".pv-wrong").classList.remove("on"); s.querySelector(".pv-hint").classList.remove("on"); },
  };

  P["progress-grow"] = {
    html: () => `<div class="pv-progress"><span></span></div><small class="pv-pct">70%</small>`,
    play: (s) => s.querySelector(".pv-progress").classList.add("on"),
    stop: (s) => s.querySelector(".pv-progress").classList.remove("on"),
  };

  P["number-countup"] = {
    html: () => `<b class="pv-num">0</b><small>${t("位同学在学", "learners")}</small>`,
    play: (s) => {
      const el = s.querySelector(".pv-num");
      const target = 12840;
      cancelAnimationFrame(el._raf);
      if (rm()) { el.textContent = target.toLocaleString(); return; }
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / 1200);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString();
        if (p < 1) el._raf = requestAnimationFrame(tick);
      };
      el._raf = requestAnimationFrame(tick);
    },
    stop: (s) => { const el = s.querySelector(".pv-num"); cancelAnimationFrame(el._raf); el.textContent = "0"; },
  };

  P["streak-counter"] = {
    html: () => `<span class="pv-streak">${FLAME} <b>2</b></span>`,
    play: (s) => {
      const b = s.querySelector(".pv-streak b");
      b.textContent = String(Number(b.textContent) + 1);
      restart(s.querySelector(".pv-streak"), "on");
    },
    stop: (s) => { s.querySelector(".pv-streak b").textContent = "2"; s.querySelector(".pv-streak").classList.remove("on"); },
    loop: 1000,
  };

  P["checkmark-draw"] = {
    html: () => `<span class="pv-check"><svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg></span><small>${t("合并同类项", "Combine like terms")}</small>`,
    play: (s) => restart(s.querySelector(".pv-check"), "on"),
    stop: (s) => s.querySelector(".pv-check").classList.remove("on"),
  };

  P["scroll-fade-in"] = {
    html: () => `<div class="pv-reveal"><b>${t("继续学习", "Keep learning")}</b><span></span><span></span></div>`,
    play: (s) => restart(s.querySelector(".pv-reveal"), "on"),
    stop: (s) => s.querySelector(".pv-reveal").classList.remove("on"),
  };

  P["stagger-reveal"] = {
    html: () => `<div class="pv-stagger">${[0, 1, 2, 3].map((i) => `<span style="--i:${i}"></span>`).join("")}</div>`,
    play: (s) => restart(s.querySelector(".pv-stagger"), "on"),
    stop: (s) => s.querySelector(".pv-stagger").classList.remove("on"),
  };

  P["card-flip"] = {
    html: () => `<div class="pv-flip"><div class="pv-flip__in"><span class="f">2x + 3 = 11</span><span class="b">x = 4</span></div></div>`,
    play: (s) => s.querySelector(".pv-flip").classList.toggle("on"),
    stop: (s) => s.querySelector(".pv-flip").classList.remove("on"),
    loop: 1400,
  };

  P["ambient-glow"] = {
    html: () => `<div class="pv-glow"><span class="a"></span><span class="b"></span></div>`,
    play: (s) => s.querySelector(".pv-glow").classList.add("on"),
    stop: (s) => s.querySelector(".pv-glow").classList.remove("on"),
  };


  // ======== 做题栏目新增动效 ========
  const opts3 = (cls = "") => `<div class="pv-options">${["3", "4", "7"].map((n, i) => `<span class="pv-opt ${i === 1 ? cls : ""}">${n}</span>`).join("")}</div>`;
  const later = (s, fn, ms) => { (s._to ||= []).push(setTimeout(fn, ms)); };
  const clearLater = (s) => { (s._to || []).forEach(clearTimeout); s._to = []; };

  P["option-fill-slide"] = {
    html: () => opts3("pv-fill"),
    play: (s) => s.querySelector(".pv-fill").classList.add("sel"),
    stop: (s) => s.querySelector(".pv-fill").classList.remove("sel"),
  };
  P["option-check-pop"] = {
    html: () => opts3("pv-chk"),
    play: (s) => s.querySelector(".pv-chk").classList.add("sel"),
    stop: (s) => s.querySelector(".pv-chk").classList.remove("sel"),
  };
  P["correct-glow"] = {
    html: () => `<span class="pv-opt pv-right pv-wide">4 <small>✓ ${t("正确", "Correct")}</small></span>`,
    play: (s) => restart(s.querySelector(".pv-right"), "glow"),
    stop: (s) => s.querySelector(".pv-right").classList.remove("glow"),
  };
  P["correct-bounce"] = {
    html: () => `<span class="pv-opt pv-right pv-wide">4 <small>✓ ${t("正确", "Correct")}</small></span>`,
    play: (s) => restart(s.querySelector(".pv-right"), "bounce"),
    stop: (s) => s.querySelector(".pv-right").classList.remove("bounce"),
  };
  P["wrong-hint-slide"] = {
    html: () => `<div class="pv-col"><span class="pv-opt pv-bad pv-wide">7 <small>✗</small></span><span class="pv-hintbox">💡 ${t("先把 +3 移到右边", "Move +3 to the right")}</span></div>`,
    play: (s) => restart(s.querySelector(".pv-hintbox"), "on"),
    stop: (s) => s.querySelector(".pv-hintbox").classList.remove("on"),
  };
  P["wrong-reveal-correct"] = {
    html: () => `<div class="pv-col"><span class="pv-opt pv-bad pv-wide">7 <small>✗</small></span><span class="pv-opt pv-wide pv-ans">4 <small>✓ ${t("正确答案", "Answer")}</small></span></div>`,
    play: (s) => restart(s.querySelector(".pv-ans"), "show"),
    stop: (s) => s.querySelector(".pv-ans").classList.remove("show"),
  };
  P["submit-press"] = {
    html: () => `<span class="pv-btn pv-press">${t("提交", "Submit")}</span>`,
    play: (s) => { const b = s.querySelector(".pv-press"); b.classList.add("on"); later(s, () => b.classList.remove("on"), 180); },
    stop: (s) => { clearLater(s); s.querySelector(".pv-press").classList.remove("on"); },
    loop: 900,
  };
  P["next-arrow-nudge"] = {
    html: () => `<span class="pv-btn">${t("下一题", "Next")} <i class="pv-arrow">→</i></span>`,
    play: (s) => restart(s.querySelector(".pv-arrow"), "on"),
    stop: (s) => s.querySelector(".pv-arrow").classList.remove("on"),
  };
  P["progress-ring"] = {
    html: () => `<span class="pv-ring"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5"/><circle class="bar" cx="18" cy="18" r="15.5" pathLength="100"/></svg><b>2/3</b></span>`,
    play: (s) => s.querySelector(".pv-ring").classList.add("on"),
    stop: (s) => s.querySelector(".pv-ring").classList.remove("on"),
  };
  P["step-dots"] = {
    html: () => `<span class="pv-dots">${"<i></i>".repeat(5)}</span>`,
    play: (s) => {
      const dots = [...s.querySelectorAll(".pv-dots i")];
      s._n = ((s._n ?? -1) + 1) % 6;
      dots.forEach((d, i) => { d.className = i < s._n ? "done" : i === s._n ? "cur" : ""; });
    },
    stop: (s) => { s._n = -1; s.querySelectorAll(".pv-dots i").forEach((d) => (d.className = "")); },
    loop: 650,
  };
  P["segmented-progress"] = {
    html: () => `<span class="pv-seg">${["r", "r", "w", "r"].map((k, i) => `<i class="${k}" style="--i:${i}"></i>`).join("")}</span>`,
    play: (s) => s.querySelector(".pv-seg").classList.add("on"),
    stop: (s) => s.querySelector(".pv-seg").classList.remove("on"),
  };
  P["streak-flame"] = {
    html: () => `<span class="pv-flame" data-l="0"><i>${FLAME}</i> <b>0</b></span>`,
    play: (s) => {
      const f = s.querySelector(".pv-flame"), n = (Number(f.dataset.l) + 1) % 5;
      f.dataset.l = n; f.style.setProperty("--l", Math.min(n, 3)); f.querySelector("b").textContent = n;
      if (n) restart(f, "flare");
    },
    stop: (s) => { const f = s.querySelector(".pv-flame"); f.dataset.l = 0; f.style.setProperty("--l", 0); f.querySelector("b").textContent = 0; f.classList.remove("flare"); },
    loop: 800,
  };
  P["combo-multiplier"] = {
    html: () => `<span class="pv-streak sm">${FLAME} <b>1</b></span><span class="pv-combo" hidden></span>`,
    play: (s) => {
      const b = s.querySelector(".pv-streak b"), c = s.querySelector(".pv-combo");
      const n = Number(b.textContent) + 1 > 5 ? 1 : Number(b.textContent) + 1;
      b.textContent = n;
      if (n < 2) { c.hidden = true; return; }
      c.hidden = false; c.textContent = `×${n} ${t("连击", "combo")}`; restart(c, "on");
    },
    stop: (s) => { s.querySelector(".pv-streak b").textContent = 1; s.querySelector(".pv-combo").hidden = true; },
    loop: 900,
  };
  P["star-rating-fill"] = {
    html: () => `<span class="pv-stars">${[0, 1, 2].map((i) => `<i style="--i:${i}" class="${i < 2 ? "lit" : ""}">${i < 2 ? "★" : "☆"}</i>`).join("")}</span>`,
    play: (s) => restart(s.querySelector(".pv-stars"), "on"),
    stop: (s) => s.querySelector(".pv-stars").classList.remove("on"),
  };
  P["xp-level-up"] = {
    html: () => `<div class="pv-xp"><div class="h"><b>Lv 1</b><span>+30 XP</span></div><div class="t"><i></i></div></div>`,
    play: (s) => {
      const bar = s.querySelector(".pv-xp i"), lv = s.querySelector(".pv-xp b");
      clearLater(s);
      const set = (v, anim) => { bar.style.transition = anim ? "" : "none"; bar.style.transform = `scaleX(${v})`; void bar.offsetWidth; };
      set(0.8, false); lv.textContent = "Lv 1"; lv.classList.remove("up");
      if (rm()) { set(0.1, false); lv.textContent = "Lv 2"; lv.classList.add("up"); return; }
      later(s, () => set(1, true), 60);
      later(s, () => { lv.textContent = "Lv 2"; restart(lv, "up"); set(0, false); later(s, () => set(0.1, true), 40); }, 900);
    },
    stop: (s) => { clearLater(s); const bar = s.querySelector(".pv-xp i"); bar.style.transition = "none"; bar.style.transform = "scaleX(0.8)"; s.querySelector(".pv-xp b").textContent = "Lv 1"; s.querySelector(".pv-xp b").classList.remove("up"); },
    loop: 2400,
  };
  const countdown = (s, sel, render) => {
    clearLater(s);
    let left = 13;
    render(left);
    const step = () => { left--; render(left); if (left > 0) later(s, step, 260); };
    later(s, step, 260);
  };
  P["timer-ring"] = {
    html: () => `<span class="pv-timer"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5"/><circle class="bar" cx="18" cy="18" r="15.5" pathLength="100"/></svg><b>13</b></span>`,
    play: (s) => {
      const el = s.querySelector(".pv-timer");
      countdown(s, ".pv-timer", (left) => {
        el.querySelector("b").textContent = left;
        el.style.setProperty("--used", 100 - (left / 13) * 100);
        el.classList.toggle("low", left <= 10);
      });
    },
    stop: (s) => { clearLater(s); const el = s.querySelector(".pv-timer"); el.classList.remove("low"); el.style.setProperty("--used", 0); el.querySelector("b").textContent = 13; },
    loop: 4200,
  };
  P["timer-urgent"] = {
    html: () => `<span class="pv-count"><b>0:13</b><small></small></span>`,
    play: (s) => {
      const el = s.querySelector(".pv-count");
      countdown(s, ".pv-count", (left) => {
        el.querySelector("b").textContent = "0:" + String(left).padStart(2, "0");
        el.classList.toggle("low", left <= 10 && left > 0);
        el.querySelector("small").textContent = left <= 0 ? t("时间到", "Time's up") : left <= 10 ? t("最后 10 秒", "Last 10s") : "";
      });
    },
    stop: (s) => { clearLater(s); const el = s.querySelector(".pv-count"); el.classList.remove("low"); el.querySelector("b").textContent = "0:13"; el.querySelector("small").textContent = ""; },
    loop: 4200,
  };
  P["explain-slide"] = {
    html: () => `<div class="pv-slide"><span class="f">2x + 3 = 11</span><span class="b">x = 4</span></div>`,
    play: (s) => s.querySelector(".pv-slide").classList.toggle("on"),
    stop: (s) => s.querySelector(".pv-slide").classList.remove("on"),
    loop: 1400,
  };
  const nextQ = (cls) => ({
    html: () => `<div class="pv-q"><span>${t("第", "Q")} <b>1</b>${t(" 题", "")}</span></div>`,
    play: (s) => {
      const q = s.querySelector(".pv-q span"), b = q.querySelector("b");
      b.textContent = (Number(b.textContent) % 5) + 1;
      restart(q, cls);
    },
    stop: (s) => { const q = s.querySelector(".pv-q span"); q.querySelector("b").textContent = 1; q.classList.remove(cls); },
    loop: 1100,
  });
  P["question-slide"] = nextQ("slide");
  P["question-fade-scale"] = nextQ("fade");


  // ======== 原来只能去官网看的外部组件，改写成原创 ========
  const slideTo = (pill, el) => { pill.style.setProperty("--x", el.offsetLeft + "px"); pill.style.setProperty("--w", el.offsetWidth + "px"); };
  P["tab-indicator-slide"] = {
    html: () => `<div class="pv-seg2"><span class="t on">${t("本周", "Week")}</span><span class="t">${t("本月", "Month")}</span><span class="t">${t("全部", "All")}</span><i></i></div>`,
    play: (s) => {
      const tabs = [...s.querySelectorAll(".pv-seg2 .t")], pill = s.querySelector(".pv-seg2 i");
      s._k = ((s._k ?? 0) + 1) % tabs.length;
      tabs.forEach((x, i) => x.classList.toggle("on", i === s._k)); slideTo(pill, tabs[s._k]);
    },
    stop: (s) => { const tabs = [...s.querySelectorAll(".pv-seg2 .t")]; s._k = 0; tabs.forEach((x, i) => x.classList.toggle("on", !i)); slideTo(s.querySelector(".pv-seg2 i"), tabs[0]); },
    loop: 800, init: true,
  };
  P["nav-hover-pill"] = {
    html: () => `<div class="pv-nav"><span class="cur">${t("课程", "Courses")}</span><span>${t("练习", "Practice")}</span><span>${t("排行", "Ranks")}</span><i></i></div>`,
    play: (s) => {
      const links = [...s.querySelectorAll(".pv-nav span")], pill = s.querySelector(".pv-nav i");
      s._k = ((s._k ?? 0) + 1) % (links.length + 1);
      slideTo(pill, links[s._k === links.length ? 0 : s._k]);
    },
    stop: (s) => { s._k = 0; slideTo(s.querySelector(".pv-nav i"), s.querySelector(".pv-nav span")); },
    loop: 650, init: true,
  };
  P["scroll-progress-bar"] = {
    html: () => `<div class="pv-page"><i class="bar"></i><div class="doc"><b></b><span></span><span></span><span></span><span></span><span></span><span></span></div></div>`,
    play: (s) => s.querySelector(".pv-page").classList.add("on"),
    stop: (s) => s.querySelector(".pv-page").classList.remove("on"),
  };
  P["checkbox-draw"] = {
    html: () => `<span class="pv-cbx"><svg viewBox="0 0 20 20"><rect x="1" y="1" width="18" height="18" rx="5"/><path d="M5.5 10.5l3 3 6-7"/></svg>${t("记住我", "Remember me")}</span>`,
    play: (s) => s.querySelector(".pv-cbx").classList.toggle("on"),
    stop: (s) => s.querySelector(".pv-cbx").classList.remove("on"),
    loop: 1000,
  };
  P["dot-pattern"] = {
    html: () => `<div class="pv-dots-bg"></div><b class="pv-login">${t("登录", "Sign in")}</b>`,
    play: (s) => restart(s.querySelector(".pv-dots-bg"), "on"),
    stop: (s) => s.querySelector(".pv-dots-bg").classList.remove("on"),
  };
  P["heatmap-reveal"] = {
    html: () => `<div class="pv-heat">${Array.from({ length: 70 }, (_, i) => `<i data-l="${[0, 1, 2, 3, 0, 2, 1, 3, 0, 1][(i * 7 + (i >> 3)) % 10]}" style="--c:${Math.floor(i / 7)}"></i>`).join("")}</div>`,
    play: (s) => restart(s.querySelector(".pv-heat"), "on"),
    stop: (s) => s.querySelector(".pv-heat").classList.remove("on"),
  };
  P["list-reorder-flip"] = {
    html: () => `<ol class="pv-rank">${[["林", 320], ["杰", 290], [t("你", "You"), 260]].map(([n, p], i) => `<li data-i="${i}"><b>${i + 1}</b>${n}<span>${p}</span></li>`).join("")}</ol>`,
    play: (s) => {
      const list = s.querySelector(".pv-rank"), items = [...list.children];
      const before = new Map(items.map((li) => [li, li.offsetTop]));
      const last = items[items.length - 1];
      items.forEach((li) => li.classList.remove("up"));
      list.prepend(last); last.classList.add("up");
      [...list.children].forEach((li, i) => (li.querySelector("b").textContent = i + 1));
      if (rm()) return;
      items.forEach((li) => { const dy = before.get(li) - li.offsetTop; if (dy) li.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration: 400, easing: "cubic-bezier(0.2,0.8,0.2,1)" }); });
    },
    stop: (s) => {
      const list = s.querySelector(".pv-rank");
      [...list.children].sort((a, b) => a.dataset.i - b.dataset.i).forEach((li, i) => { list.appendChild(li); li.classList.remove("up"); li.querySelector("b").textContent = i + 1; });
    },
    loop: 1300,
  };
  P["avatar-stack-spread"] = {
    html: () => `<span class="pv-stack">${["林", "杰", "M", "+9"].map((x, i) => `<i style="--i:${i}">${x}</i>`).join("")}</span>`,
    play: (s) => s.querySelector(".pv-stack").classList.add("on"),
    stop: (s) => s.querySelector(".pv-stack").classList.remove("on"),
  };


  // ======== 第一批组件 ========
  const tog = (s, sel, cls = "on") => s.querySelector(sel).classList.toggle(cls);
  const add = (s, sel, cls = "on") => restart(s.querySelector(sel), cls);
  const off = (s, sel, cls = "on") => s.querySelector(sel).classList.remove(cls);
  const mini = (cls, body) => ({ html: () => `<div class="pv-win ${cls}"><i class="bd"></i><div class="dlg">${body()}</div></div>`, play: (s) => tog(s, ".pv-win"), stop: (s) => off(s, ".pv-win"), loop: 1300 });
  P["modal-tip-in"] = mini("tip", () => `<b>${t("保存更改？", "Save?")}</b><span class="ln"></span><span class="bt"></span>`);
  P["modal-scale-fade"] = mini("scale", () => `<b>${t("编辑资料", "Edit")}</b><span class="ln"></span><span class="bt"></span>`);
  P["drawer-slide"] = mini("drawer", () => `<b>${t("筛选", "Filters")}</b><span class="ln"></span><span class="ln"></span>`);
  const toast = (v) => ({ html: () => `<div class="pv-toastbox ${v}"><span class="pv-toast">${t("已保存", "Saved")}</span></div>`, play: (s) => add(s, ".pv-toast"), stop: (s) => off(s, ".pv-toast") });
  P["toast-rise"] = toast("rise");
  P["toast-side"] = toast("side");
  const alertPv = (v) => ({ html: () => `<div class="pv-alert ${v}"><i>!</i><span>${t("没能保存", "Couldn't save")}</span></div>`, play: (s) => add(s, ".pv-alert"), stop: (s) => off(s, ".pv-alert") });
  P["alert-slide-down"] = alertPv("slide");
  P["alert-attention"] = alertPv("ring");
  const acc = (v) => ({ html: () => `<div class="pv-acc ${v}"><div class="h">${t("怎么退款？", "Refunds?")}<i></i></div><div class="p"><div><span>${t("7 天内可申请", "Within 7 days")}</span></div></div></div>`, play: (s) => tog(s, ".pv-acc"), stop: (s) => off(s, ".pv-acc"), loop: 1200 });
  P["accordion-height"] = acc("grow");
  P["accordion-chevron"] = acc("chev");
  const sw = (v) => ({ html: () => `<span class="pv-sw ${v}"><i></i></span>`, play: (s) => { const el = s.querySelector(".pv-sw"); el.classList.add("press"); later(s, () => { el.classList.remove("press"); el.classList.toggle("on"); }, 220); }, stop: (s) => { clearLater(s); s.querySelector(".pv-sw").className = "pv-sw " + v; }, loop: 900 });
  P["switch-stretch"] = sw("stretch");
  P["switch-fill"] = sw("fill");
  const inp = (v, label) => ({ html: () => `<div class="pv-in ${v}"><span class="lb">${label()}</span><span class="box"></span></div>`, play: (s) => tog(s, ".pv-in"), stop: (s) => off(s, ".pv-in"), loop: 1200 });
  P["input-focus-ring"] = inp("ring", () => t("邮箱", "Email"));
  P["input-float-label"] = inp("float", () => t("邮箱", "Email"));
  P["input-underline"] = inp("line", () => t("昵称", "Name"));
  P["badge-bump"] = {
    html: () => `<span class="pv-bell">🔔<b class="pv-badge">3</b></span>`,
    play: (s) => { const b = s.querySelector(".pv-badge"); b.textContent = Number(b.textContent) + 1; restart(b, "on"); },
    stop: (s) => { const b = s.querySelector(".pv-badge"); b.textContent = 3; b.classList.remove("on"); }, loop: 900,
  };
  P["badge-ping"] = { html: () => `<span class="pv-bell">🔔<b class="pv-dot"></b></span>`, play: (s) => add(s, ".pv-dot"), stop: (s) => off(s, ".pv-dot"), loop: 2400 };
  const dd = (v) => ({ html: () => `<div class="pv-dd ${v}"><span class="btn">${t("最新", "Newest")} ▾</span><ul>${[t("最新", "Newest"), t("最热", "Popular"), t("评分", "Rating")].map((x, i) => `<li style="--i:${i}">${x}</li>`).join("")}</ul></div>`, play: (s) => tog(s, ".pv-dd"), stop: (s) => off(s, ".pv-dd"), loop: 1300 });
  P["dropdown-scale"] = dd("scale");
  P["dropdown-stagger"] = dd("stagger");
  const tip = (v) => ({ html: () => `<span class="pv-tip ${v}"><i>${t("按 Enter 保存", "Press Enter")}</i><b>?</b></span>`, play: (s) => tog(s, ".pv-tip"), stop: (s) => off(s, ".pv-tip"), loop: 1200 });
  P["tooltip-spring"] = tip("spring");
  P["tooltip-fade"] = tip("fade");
  P["table-row-hover"] = {
    html: () => `<div class="pv-tbl">${[["代数", 128], ["几何", 152], ["分数", 93]].map(([a, b]) => `<p><span>${a}</span><span>${b}</span></p>`).join("")}</div>`,
    play: (s) => { const rows = [...s.querySelectorAll(".pv-tbl p")]; s._r = ((s._r ?? -1) + 1) % rows.length; rows.forEach((r, i) => r.classList.toggle("on", i === s._r)); },
    stop: (s) => { s._r = -1; s.querySelectorAll(".pv-tbl p").forEach((r) => r.classList.remove("on")); }, loop: 600,
  };
  P["table-sort"] = {
    html: () => `<div class="pv-tbl sort"><p class="hd"><span>${t("课程", "Course")}</span><span>${t("人数", "Learners")} <i>↑</i></span></p>${[["代数", 128], ["几何", 152], ["分数", 93]].map(([a, b]) => `<p><span>${a}</span><span>${b}</span></p>`).join("")}</div>`,
    play: (s) => { const box = s.querySelector(".pv-tbl"); box.classList.toggle("desc"); restart(box, "flash"); },
    stop: (s) => { s.querySelector(".pv-tbl").classList.remove("desc", "flash"); }, loop: 1200,
  };


  // ---------- 第二波 ----------
  const NEVER = 3600000; // 持续动画：play 只需要执行一次
  P["shimmer-button"] = {
    html: () => `<span class="pv-shbtn">${t("开始练习", "Start practice")}</span>`,
    play: (s) => restart(s.querySelector(".pv-shbtn"), "on"),
    stop: (s) => s.querySelector(".pv-shbtn").classList.remove("on"),
  };
  P["magnetic-button"] = {
    html: () => `<div class="pv-mag"><i></i><span class="b">${t("立即加入", "Join now")}</span></div>`,
    play: (s) => s.querySelector(".pv-mag").classList.toggle("on"),
    stop: (s) => s.querySelector(".pv-mag").classList.remove("on"),
    loop: 1300,
  };
  P["spotlight-card"] = {
    html: () => `<div class="pv-spot"><b>${t("一元一次方程", "Linear equations")}</b><small>${t("12 课时", "12 lessons")}</small></div>`,
    play: (s) => {
      const pts = [[18, 25], [82, 30], [72, 78], [24, 72]], el = s.querySelector(".pv-spot");
      s._i = ((s._i ?? -1) + 1) % pts.length;
      el.style.setProperty("--mx", pts[s._i][0] + "%");
      el.style.setProperty("--my", pts[s._i][1] + "%");
    },
    stop: (s) => { const el = s.querySelector(".pv-spot"); s._i = -1; el.style.setProperty("--mx", "50%"); el.style.setProperty("--my", "50%"); },
    loop: 750,
  };
  P["tilt-card"] = {
    html: () => `<div class="pv-tilt"><div class="c"><b>${t("连续学习 7 天", "7-day streak")}</b><small>${t("解锁「坚持者」", "Unlock Steady")}</small></div></div>`,
    play: (s) => { const el = s.querySelector(".pv-tilt"); s._f = !s._f; el.classList.toggle("a", s._f); el.classList.toggle("b", !s._f); },
    stop: (s) => { s._f = false; s.querySelector(".pv-tilt").classList.remove("a", "b"); },
    loop: 900,
  };
  P["border-beam"] = {
    html: () => `<div class="pv-beam"><b>${t("支付成功", "Payment done")}</b><small>${t("课程已解锁", "Course unlocked")}</small></div>`,
    play: (s) => s.querySelector(".pv-beam").classList.add("on"),
    stop: (s) => s.querySelector(".pv-beam").classList.remove("on"),
    loop: NEVER,
  };
  P["text-shimmer"] = {
    html: () => `<span class="pv-ts">${t("正在批改你的答案", "Checking your answers")}</span>`,
    play: (s) => s.querySelector(".pv-ts").classList.add("on"),
    stop: (s) => s.querySelector(".pv-ts").classList.remove("on"),
    loop: NEVER,
  };
  P["marquee"] = {
    html: () => {
      const set = [t("北京大学", "Alpha U"), t("清华大学", "Beta U"), t("复旦大学", "Gamma U"), t("浙江大学", "Delta U")].map((x) => `<span>${x}</span>`).join("");
      return `<div class="pv-marq"><div class="in">${set}${set}</div></div>`;
    },
    play: (s) => s.querySelector(".pv-marq").classList.add("on"),
    stop: (s) => s.querySelector(".pv-marq").classList.remove("on"),
    loop: NEVER,
  };
  P["blur-fade"] = {
    html: () => `<div class="pv-bfs"><b class="pv-bf" style="--i:0">${t("今天练点什么？", "What to practice?")}</b><span class="pv-bf" style="--i:1">${t("5 道题 · 约 8 分钟", "5 questions · ~8 min")}</span><i class="pv-bf" style="--i:2">${t("开始", "Start")}</i></div>`,
    play: (s) => restart(s.querySelector(".pv-bfs"), "on"),
    stop: (s) => s.querySelector(".pv-bfs").classList.remove("on"),
  };


  // ---------- 第三波 ----------
  P["ripple"] = {
    html: () => `<div class="pv-rip"><i></i><i></i><i></i><span class="core"></span></div>`,
    play: (s) => s.querySelector(".pv-rip").classList.add("on"),
    stop: (s) => s.querySelector(".pv-rip").classList.remove("on"),
    loop: NEVER,
  };
  const TYPED = () => t("今天练点什么？", "What shall we practice?");
  P["typing-text"] = {
    html: () => `<span class="pv-type"><span class="tx">${TYPED()}</span></span>`,
    play: (s) => {
      const tx = s.querySelector(".tx"), full = TYPED();
      clearInterval(s._ty);
      if (rm()) { tx.textContent = full; return; }
      let i = 0; tx.textContent = "";
      s._ty = setInterval(() => { tx.textContent = full.slice(0, ++i); if (i >= full.length) clearInterval(s._ty); }, 80);
    },
    stop: (s) => { clearInterval(s._ty); s.querySelector(".tx").textContent = TYPED(); },
    loop: 3400,
  };
  P["gradient-text"] = {
    html: () => `<span class="pv-gt">${t("学得更聪明", "Learn smarter")}</span>`,
    play: (s) => s.querySelector(".pv-gt").classList.add("on"),
    stop: (s) => s.querySelector(".pv-gt").classList.remove("on"),
    loop: NEVER,
  };
  P["meteors"] = {
    html: () => `<div class="pv-met"><i style="--x:18%;--d:0s"></i><i style="--x:46%;--d:0.9s"></i><i style="--x:74%;--d:1.8s"></i><i style="--x:92%;--d:0.4s"></i></div>`,
    play: (s) => s.querySelector(".pv-met").classList.add("on"),
    stop: (s) => s.querySelector(".pv-met").classList.remove("on"),
    loop: NEVER,
  };
  P["text-fade-chars"] = {
    html: () => `<div class="pv-chars">${[...TYPED()].map((c, i) => `<span style="--i:${i}">${c}</span>`).join("")}</div>`,
    play: (s) => restart(s.querySelector(".pv-chars"), "on"),
    stop: (s) => s.querySelector(".pv-chars").classList.remove("on"),
    loop: 2600,
  };
  P["particle-button"] = {
    html: () => `<div class="pv-pbtn"><span class="b">${t("提交答案", "Submit")}</span></div>`,
    play: (s) => {
      const box = s.querySelector(".pv-pbtn"), b = box.querySelector(".b");
      restart(b, "press");
      if (rm()) return;
      for (let i = 0; i < 12; i++) {
        const d = document.createElement("i"), a = (i / 12) * Math.PI * 2, r = 38 + (i % 3) * 8;
        d.className = "pp"; d.style.setProperty("--x", Math.cos(a) * r + "px"); d.style.setProperty("--y", Math.sin(a) * r + "px");
        box.appendChild(d); setTimeout(() => d.remove(), 700);
      }
    },
    stop: (s) => { s.querySelectorAll(".pp").forEach((d) => d.remove()); s.querySelector(".b").classList.remove("press"); },
    loop: 1400,
  };
  const STATUS = () => [t("正在读题", "Reading the question"), t("正在分析思路", "Analyzing your approach"), t("正在生成讲解", "Writing the explanation")];
  P["status-text-cycle"] = {
    html: () => `<span class="pv-stc"><span class="tx">${STATUS()[0]}</span></span>`,
    play: (s) => { const tx = s.querySelector(".tx"); s._i = ((s._i ?? -1) + 1) % 3; tx.textContent = STATUS()[s._i]; restart(tx, "in"); },
    stop: (s) => { s._i = -1; const tx = s.querySelector(".tx"); tx.textContent = STATUS()[0]; tx.classList.remove("in"); },
    loop: 1500,
  };
  P["orbiting-circles"] = {
    html: () => `<div class="pv-orb"><span class="core">${t("学", "A")}</span><i style="--r:34px;--a:0deg;--t:6s"></i><i style="--r:34px;--a:180deg;--t:6s"></i><i style="--r:52px;--a:90deg;--t:10s"></i></div>`,
    play: (s) => s.querySelector(".pv-orb").classList.add("on"),
    stop: (s) => s.querySelector(".pv-orb").classList.remove("on"),
    loop: NEVER,
  };


  // ---------- 第四波 ----------
  const WORDS = () => [t("练习", "practice"), t("复习", "review"), t("挑战", "challenge")];
  P["word-rotate"] = {
    html: () => `<span class="pv-wr">${t("一起", "Let's")} <span class="ws">${WORDS().map((w, i) => `<span class="${i ? "" : "on"}">${w}</span>`).join("")}</span></span>`,
    play: (s) => {
      const ws = [...s.querySelectorAll(".ws > span")];
      s._i = s._i ?? 0;
      const out = ws[s._i]; s._i = (s._i + 1) % ws.length;
      ws.forEach((w) => w.classList.remove("on", "out"));
      out.classList.add("out"); ws[s._i].classList.add("on");
    },
    stop: (s) => { s._i = 0; s.querySelectorAll(".ws > span").forEach((w, i) => { w.classList.remove("out"); w.classList.toggle("on", i === 0); }); },
    loop: 1500,
  };

  const FEED = () => [t("林杰完成了「分数」", "Lin finished Fractions"), t("M 获得「连续 7 天」", "M earned a 7-day streak"), t("小周开始了「几何」", "Zhou started Geometry")];
  const feedHtml = (items) => items.map((x) => `<li>${x}</li>`).join("");
  P["animated-list"] = {
    html: () => `<ul class="pv-feed">${feedHtml(FEED().slice(1))}</ul>`,
    play: (s) => {
      const ul = s.querySelector(".pv-feed"), old = [...ul.children], before = old.map((el) => el.getBoundingClientRect().top);
      s._n = ((s._n ?? 0) + 1);
      const li = document.createElement("li"); li.textContent = FEED()[(s._n + 1) % 3]; ul.prepend(li);
      while (ul.children.length > 3) ul.lastElementChild.remove();
      if (rm()) return;
      const opts = { duration: 300, easing: "cubic-bezier(0.2,0.8,0.2,1)" };
      old.forEach((el, n) => { const dy = before[n] - el.getBoundingClientRect().top; if (dy) el.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], opts); });
      li.animate([{ opacity: 0, transform: "translateY(-12px)" }, { opacity: 1, transform: "none" }], opts);
    },
    stop: (s) => { s._n = 0; s.querySelector(".pv-feed").innerHTML = feedHtml(FEED().slice(1)); },
    loop: 1400,
  };

  const SCR = () => t("坚持者", "Steady");
  P["hyper-text"] = {
    html: () => `<span class="pv-scr">${SCR()}</span>`,
    play: (s) => {
      const el = s.querySelector(".pv-scr"), text = SCR(), pool = [...text];
      cancelAnimationFrame(s._raf);
      if (rm()) { el.textContent = text; return; }
      const start = performance.now();
      const frame = (now) => {
        const p = Math.min((now - start) / 700, 1);
        el.textContent = [...text].map((ch, i) => (i < p * text.length ? ch : pool[Math.floor(Math.random() * pool.length)])).join("");
        if (p < 1) s._raf = requestAnimationFrame(frame);
      };
      s._raf = requestAnimationFrame(frame);
    },
    stop: (s) => { cancelAnimationFrame(s._raf); s.querySelector(".pv-scr").textContent = SCR(); },
    loop: 1800,
  };

  P["glow-effect"] = {
    html: () => `<div class="pv-glowc"><b>${t("升级会员", "Upgrade")}</b><small>${t("解锁全部课程", "Unlock all courses")}</small></div>`,
    play: (s) => s.querySelector(".pv-glowc").classList.add("on"),
    stop: (s) => s.querySelector(".pv-glowc").classList.remove("on"),
    loop: NEVER,
  };

  P["cursor-follow"] = {
    html: () => `<div class="pv-cur"><i class="ring"></i><span>${t("把今天过成一个小目标", "Make today one small goal")}</span></div>`,
    play: (s) => {
      const pts = [[14, 22], [118, 30], [100, 62], [30, 66]], ring = s.querySelector(".ring");
      s._i = ((s._i ?? -1) + 1) % pts.length;
      ring.style.transform = `translate(${pts[s._i][0]}px, ${pts[s._i][1]}px)`;
      ring.style.opacity = 1;
    },
    stop: (s) => { s._i = -1; const ring = s.querySelector(".ring"); ring.style.transform = ""; ring.style.opacity = ""; },
    loop: 800,
  };

  P["morphing-dialog"] = {
    html: () => `<div class="pv-morph"><div class="c"><span class="s">${t("一元一次方程", "Linear equations")}</span><span class="d"><b>${t("一元一次方程", "Linear equations")}</b><small>${t("12 课时，从列方程到解方程。", "12 lessons, from setting up to solving.")}</small></span></div></div>`,
    play: (s) => s.querySelector(".pv-morph").classList.toggle("on"),
    stop: (s) => s.querySelector(".pv-morph").classList.remove("on"),
    loop: 1500,
  };

  P["search-expand"] = {
    html: () => `<div class="pv-sx"><div class="box">${t("搜索课程", "Search courses")}</div><ul><li style="--i:0">${t("一元一次方程", "Linear equations")}</li><li style="--i:1">${t("分数的加减", "Fractions")}</li></ul></div>`,
    play: (s) => s.querySelector(".pv-sx").classList.toggle("on"),
    stop: (s) => s.querySelector(".pv-sx").classList.remove("on"),
    loop: 1600,
  };

  const STEPS = () => [t("检查账号信息", "Checking account"), t("创建学习计划", "Building plan"), t("发送确认邮件", "Sending email")];
  P["step-checklist"] = {
    html: () => `<ol class="pv-ls">${STEPS().map((x, i) => `<li data-state="${i === 0 ? "running" : "todo"}">${x}</li>`).join("")}</ol>`,
    play: (s) => {
      const lis = [...s.querySelectorAll(".pv-ls li")];
      s._i = ((s._i ?? 0) + 1);
      if (s._i > lis.length) { s._i = 0; lis.forEach((li, i) => li.dataset.state = i === 0 ? "running" : "todo"); return; }
      lis.forEach((li, i) => li.dataset.state = i < s._i ? "done" : i === s._i ? "running" : "todo");
    },
    stop: (s) => { s._i = 0; s.querySelectorAll(".pv-ls li").forEach((li, i) => li.dataset.state = i === 0 ? "running" : "todo"); },
    loop: 900,
  };


  // ---------- 第五波 ----------
  P["pulsating-button"] = {
    html: () => `<span class="pv-pulse"><span class="b">${t("领取奖励", "Claim reward")}</span></span>`,
    play: (s) => restart(s.querySelector(".pv-pulse"), "on"),
    stop: (s) => s.querySelector(".pv-pulse").classList.remove("on"),
    loop: 6200,
  };
  P["interactive-hover-button"] = {
    html: () => `<span class="pv-ihb"><i class="dot"></i><span class="lb">${t("开始学习", "Start")}</span><svg class="go" viewBox="0 0 24 24" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`,
    play: (s) => s.querySelector(".pv-ihb").classList.toggle("on"),
    stop: (s) => s.querySelector(".pv-ihb").classList.remove("on"),
    loop: 1300,
  };
  P["highlighter"] = {
    html: () => `<span class="pv-mkp">${t("今天坚持", "Stick with")} <mark class="pv-mk">${t("练习十分钟", "ten minutes")}</mark></span>`,
    play: (s) => restart(s.querySelector(".pv-mk"), "on"),
    stop: (s) => s.querySelector(".pv-mk").classList.remove("on"),
  };
  const MORPH = () => [t("加入课程", "Join course"), t("已加入", "Joined")];
  P["text-morph"] = {
    html: () => `<span class="pv-tm">${MORPH()[0]}</span>`,
    play: (s) => {
      const el = s.querySelector(".pv-tm"), words = MORPH();
      s._k = ((s._k ?? 0) + 1) % 2;
      const next = words[s._k], prev = el.dataset.text || words[0];
      el.dataset.text = next; el.textContent = "";
      [...next].forEach((ch, i) => {
        const sp = document.createElement("span"); sp.textContent = ch; sp.style.display = "inline-block"; sp.style.whiteSpace = "pre";
        if (!rm() && ch !== prev[i]) sp.animate([{ opacity: 0, transform: "translateY(0.5em)" }, { opacity: 1, transform: "none" }], { duration: 300, delay: i * 30, easing: "cubic-bezier(0.2,0.8,0.2,1)", fill: "backwards" });
        el.appendChild(sp);
      });
    },
    stop: (s) => { s._k = 0; const el = s.querySelector(".pv-tm"); el.dataset.text = ""; el.textContent = MORPH()[0]; },
    loop: 1500,
  };
  P["spinning-text"] = {
    html: () => {
      const chars = [...t("坚持学习 · 每天进步 · ", "KEEP LEARNING · EVERY DAY · ")];
      return `<div class="pv-spinb"><span class="ring">${chars.map((c, i) => `<span style="--i:${i};--n:${chars.length}">${c}</span>`).join("")}</span><span class="core">${t("学", "A")}</span></div>`;
    },
    play: (s) => s.querySelector(".pv-spinb").classList.add("on"),
    stop: (s) => s.querySelector(".pv-spinb").classList.remove("on"),
    loop: NEVER,
  };
  P["image-comparison"] = {
    html: () => `<div class="pv-cmp"><div class="a">${t("改后", "After")}</div><div class="b">${t("改前", "Before")}</div><i class="bar"></i></div>`,
    play: (s) => s.querySelector(".pv-cmp").classList.toggle("on"),
    stop: (s) => s.querySelector(".pv-cmp").classList.remove("on"),
    loop: 1500,
  };
  P["carousel-snap"] = {
    html: () => `<div class="pv-car"><div class="in">${[t("方程", "Equations"), t("分数", "Fractions"), t("几何", "Geometry")].map((x) => `<span>${x}</span>`).join("")}</div></div>`,
    play: (s) => { const el = s.querySelector(".pv-car"); s._k = ((s._k ?? 0) + 1) % 3; el.style.setProperty("--k", s._k); },
    stop: (s) => { s._k = 0; s.querySelector(".pv-car").style.setProperty("--k", 0); },
    loop: 1200,
  };
  P["progressive-blur"] = {
    html: () => `<div class="pv-pbl"><div class="ln"></div><div class="ln w"></div><div class="ln"></div><div class="ln w"></div><div class="ln"></div><i class="e t"></i><i class="e b"></i></div>`,
    play: (s) => { const el = s.querySelector(".pv-pbl"); s._k = !s._k; el.classList.toggle("top", s._k); },
    stop: (s) => { s._k = false; s.querySelector(".pv-pbl").classList.remove("top"); },
    loop: 1300,
  };


  // ---------- 第六波 ----------
  P["ripple-button"] = {
    html: () => `<span class="pv-rbtn">${t("保存", "Save")}</span>`,
    play: (s) => {
      if (rm()) return restart(s.querySelector(".pv-rbtn"), "press");
      const b = s.querySelector(".pv-rbtn"), ink = document.createElement("i");
      const pts = [[22, 12], [70, 24], [44, 8]]; s._i = ((s._i ?? -1) + 1) % pts.length;
      ink.style.left = pts[s._i][0] + "px"; ink.style.top = pts[s._i][1] + "px";
      b.appendChild(ink); setTimeout(() => ink.remove(), 700);
    },
    stop: (s) => s.querySelectorAll(".pv-rbtn i").forEach((i) => i.remove()),
    loop: 900,
  };
  P["liquid-button"] = {
    html: () => `<span class="pv-lq">${t("立即登录", "Sign in")}</span>`,
    play: (s) => s.querySelector(".pv-lq").classList.toggle("on"),
    stop: (s) => s.querySelector(".pv-lq").classList.remove("on"),
    loop: 1300,
  };
  P["flip-button"] = {
    html: () => `<span class="pv-fb"><span class="f">${t("开始挑战", "Start challenge")}</span><span class="b">${t("准备好了！", "Ready!")}</span></span>`,
    play: (s) => s.querySelector(".pv-fb").classList.toggle("on"),
    stop: (s) => s.querySelector(".pv-fb").classList.remove("on"),
    loop: 1400,
  };
  P["box-reveal"] = {
    html: () => `<span class="pv-br"><span class="tx">${t("今天练点什么？", "What to practice?")}</span></span>`,
    play: (s) => restart(s.querySelector(".pv-br"), "on"),
    stop: (s) => s.querySelector(".pv-br").classList.remove("on"),
  };
  P["sparkles-text"] = {
    html: () => `<span class="pv-spk">${t("新纪录", "New record")}<i style="--x:4%;--y:6%;--d:0s"></i><i style="--x:96%;--y:14%;--d:.5s"></i><i style="--x:28%;--y:96%;--d:1s"></i><i style="--x:78%;--y:98%;--d:1.5s"></i></span>`,
    play: (s) => s.querySelector(".pv-spk").classList.add("on"),
    stop: (s) => s.querySelector(".pv-spk").classList.remove("on"),
    loop: NEVER,
  };
  P["theme-toggle"] = {
    html: () => `<div class="pv-tt"><div class="pg"><i></i><i class="w"></i><i></i></div><div class="pg dk"><i></i><i class="w"></i><i></i></div><span class="btn"></span></div>`,
    play: (s) => s.querySelector(".pv-tt").classList.toggle("on"),
    stop: (s) => s.querySelector(".pv-tt").classList.remove("on"),
    loop: 1600,
  };
  P["copy-button"] = {
    html: () => `<span class="pv-cpb"><span class="ico"><svg class="c" viewBox="0 0 24 24" width="15" height="15"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg><svg class="d" viewBox="0 0 24 24" width="15" height="15"><path d="M5 12l5 5 9-10"/></svg></span><span class="lb">${t("复制邀请码", "Copy code")}</span></span>`,
    play: (s) => { const el = s.querySelector(".pv-cpb"), on = el.classList.toggle("on"); el.querySelector(".lb").textContent = on ? t("已复制", "Copied") : t("复制邀请码", "Copy code"); },
    stop: (s) => { const el = s.querySelector(".pv-cpb"); el.classList.remove("on"); el.querySelector(".lb").textContent = t("复制邀请码", "Copy code"); },
    loop: 1400,
  };
  const ODO = [128, 342, 907, 561];
  const odoSet = (el, v) => [...String(v)].forEach((ch, i) => el.children[i].firstChild.style.setProperty("--d", ch));
  P["digit-roll"] = {
    html: () => {
      const strip = Array.from({ length: 10 }, (_, n) => `<span>${n}</span>`).join("");
      return `<span class="pv-odo">${[...String(ODO[0])].map((ch) => `<span class="col"><span class="strip" style="--d:${ch}">${strip}</span></span>`).join("")}</span>`;
    },
    play: (s) => { s._i = ((s._i ?? 0) + 1) % ODO.length; odoSet(s.querySelector(".pv-odo"), ODO[s._i]); },
    stop: (s) => { s._i = 0; odoSet(s.querySelector(".pv-odo"), ODO[0]); },
    loop: 1300,
  };


  // ---------- 第七波 ----------
  P["animated-beam"] = {
    html: () => `<div class="pv-abeam"><span class="nd">${t("答案", "You")}</span><svg viewBox="0 0 100 30" preserveAspectRatio="none"><path class="tr" d="M0 15 C 30 0, 70 30, 100 15"/><path class="lt" d="M0 15 C 30 0, 70 30, 100 15" pathLength="100"/></svg><span class="nd">AI</span></div>`,
    play: (s) => s.querySelector(".pv-abeam").classList.add("on"),
    stop: (s) => s.querySelector(".pv-abeam").classList.remove("on"),
    loop: NEVER,
  };
  P["retro-grid"] = {
    html: () => `<div class="pv-rgrid"><div class="pl"></div><b>${t("欢迎回来", "Welcome back")}</b></div>`,
    play: (s) => s.querySelector(".pv-rgrid").classList.add("on"),
    stop: (s) => s.querySelector(".pv-rgrid").classList.remove("on"),
    loop: NEVER,
  };
  P["card-drag-flip"] = {
    html: () => `<div class="pv-dflip"><div class="in"><span class="f">apple</span><span class="f b">${t("苹果", "a fruit")}</span></div></div>`,
    play: (s) => {
      const seq = [-45, -180, -135, 0], inn = s.querySelector(".pv-dflip .in");
      s._i = ((s._i ?? -1) + 1) % seq.length;
      inn.classList.toggle("drag", s._i % 2 === 0);   // 拖动时跟手，松手后落位
      inn.style.setProperty("--ry", seq[s._i] + "deg");
    },
    stop: (s) => { s._i = -1; const inn = s.querySelector(".pv-dflip .in"); inn.classList.remove("drag"); inn.style.setProperty("--ry", "0deg"); },
    loop: 750,
  };
  P["bottom-sheet"] = {
    html: () => `<div class="pv-bs"><div class="sh"><b>${t("更多操作", "More")}</b><i style="--i:0"></i><i style="--i:1"></i><i style="--i:2"></i></div></div>`,
    play: (s) => s.querySelector(".pv-bs").classList.toggle("on"),
    stop: (s) => s.querySelector(".pv-bs").classList.remove("on"),
    loop: 1600,
  };
  const TP = () => [[t("介绍", "Intro"), t("12 课时，从列方程到解方程", "12 lessons, start to finish")], [t("目录", "Contents"), t("什么是方程 · 移项 · 应用题", "Equations · Moving terms · Problems")], [t("评价", "Reviews"), t("4.9 分，1,280 位同学", "4.9 from 1,280 learners")]];
  const tpHtml = (k) => `<div class="tabs">${TP().map(([n], i) => `<span class="${i === k ? "on" : ""}">${n}</span>`).join("")}</div><div class="bd"><span class="tx">${TP()[k][1]}</span></div>`;
  P["transition-panel"] = {
    html: () => `<div class="pv-tpn">${tpHtml(0)}</div>`,
    play: (s) => {
      const seq = [1, 2, 1, 0], box = s.querySelector(".pv-tpn");
      s._i = ((s._i ?? -1) + 1) % seq.length;
      const prev = s._k ?? 0, k = seq[s._i]; s._k = k;
      box.innerHTML = tpHtml(k);
      if (!rm()) box.querySelector(".tx").animate([{ opacity: 0, transform: `translateX(${k > prev ? 16 : -16}px)` }, { opacity: 1, transform: "none" }], { duration: 300, easing: "cubic-bezier(0.2,0.8,0.2,1)" });
    },
    stop: (s) => { s._i = -1; s._k = 0; s.querySelector(".pv-tpn").innerHTML = tpHtml(0); },
    loop: 1100,
  };
  P["skeleton-shimmer"] = {
    html: () => `<div class="pv-skel"><i class="t"></i><i></i><i class="s"></i></div>`,
    play: (s) => s.querySelector(".pv-skel").classList.add("on"),
    stop: (s) => s.querySelector(".pv-skel").classList.remove("on"),
    loop: NEVER,
  };
  P["top-loading-bar"] = {
    html: () => `<div class="pv-tlb"><i class="bar"></i><i class="ln"></i><i class="ln w"></i><i class="ln"></i></div>`,
    play: (s) => {
      const steps = [0.3, 0.6, 0.8, 1, 0], box = s.querySelector(".pv-tlb"), bar = box.querySelector(".bar");
      s._i = ((s._i ?? -1) + 1) % steps.length;
      const p = steps[s._i];
      box.classList.toggle("on", p > 0 && p < 1 || p === 1);
      bar.style.transform = `scaleX(${p})`;
      if (p === 1) setTimeout(() => box.classList.remove("on"), 300);
    },
    stop: (s) => { s._i = -1; const box = s.querySelector(".pv-tlb"); box.classList.remove("on"); box.querySelector(".bar").style.transform = "scaleX(0)"; },
    loop: 600,
  };
  const PW = () => [t("至少 8 位", "8+ characters"), t("弱", "Weak"), t("一般", "Fair"), t("较强", "Good"), t("强", "Strong")];
  P["password-strength"] = {
    html: () => `<div class="pv-pw"><span class="in">••••</span><div class="mt" data-level="0"><i></i><i></i><i></i><i></i></div><b class="lb">${PW()[0]}</b></div>`,
    play: (s) => {
      const box = s.querySelector(".pv-pw");
      s._l = ((s._l ?? 0) + 1) % 5;
      box.querySelector(".mt").dataset.level = s._l;
      box.querySelector(".in").textContent = "•".repeat(4 + s._l * 3);
      box.querySelector(".lb").textContent = PW()[s._l];
    },
    stop: (s) => { s._l = 0; const box = s.querySelector(".pv-pw"); box.querySelector(".mt").dataset.level = 0; box.querySelector(".in").textContent = "••••"; box.querySelector(".lb").textContent = PW()[0]; },
    loop: 800,
  };


  // ---------- 第八波（原创） ----------
  P["bar-chart-grow"] = {
    html: () => `<div class="pv-bars">${[0.45, 0.9, 0.6, 1, 0.7].map((v, i) => `<i style="--v:${v};--i:${i}"></i>`).join("")}</div>`,
    play: (s) => restart(s.querySelector(".pv-bars"), "on"),
    stop: (s) => s.querySelector(".pv-bars").classList.remove("on"),
  };
  P["rank-up-badge"] = {
    html: () => `<span class="pv-rank">${t("第 5 名", "5th")}<span class="dl"><svg viewBox="0 0 24 24" width="11" height="11"><path d="M12 19V5M6 11l6-6 6 6"/></svg>3</span></span>`,
    play: (s) => restart(s.querySelector(".pv-rank .dl"), "on"),
    stop: (s) => s.querySelector(".pv-rank .dl").classList.remove("on"),
  };
  P["checkin-stamp"] = {
    html: () => `<span class="pv-stp"><b>16</b><span class="st">${t("已打卡", "DONE")}</span></span>`,
    play: (s) => s.querySelector(".pv-stp").classList.toggle("on"),
    stop: (s) => s.querySelector(".pv-stp").classList.remove("on"),
    loop: 1300,
  };
  const LP = () => [t("方程", "Eq."), t("移项", "Terms"), t("应用", "Apply"), t("综合", "Mix")];
  const lpSet = (el, k) => { [...el.querySelectorAll("li")].forEach((li, i) => { li.className = i < k ? "dn" : i === k ? "cur" : ""; }); el.style.setProperty("--p", k / 3); };
  P["learning-path"] = {
    html: () => `<ol class="pv-lp">${LP().map((x) => `<li>${x}</li>`).join("")}</ol>`,
    play: (s) => { s._k = ((s._k ?? 0) + 1) % 4; lpSet(s.querySelector(".pv-lp"), s._k); },
    stop: (s) => { s._k = 0; lpSet(s.querySelector(".pv-lp"), 0); },
    loop: 1000,
  };
  const flipTo = (clock, text) => {
    const ds = clock.querySelectorAll(".d");
    [...text.replace(":", "")].forEach((ch, i) => {
      const d = ds[i];
      if (d.textContent === ch) return;
      if (rm()) { d.textContent = ch; return; }
      d.animate([{ transform: "rotateX(0)" }, { transform: "rotateX(-90deg)" }], { duration: 150, easing: "ease-in" }).onfinish = () => {
        d.textContent = ch; d.animate([{ transform: "rotateX(90deg)" }, { transform: "none" }], { duration: 150, easing: "ease-out" });
      };
    });
  };
  P["flip-countdown"] = {
    html: () => `<span class="pv-fc"><span class="d">0</span><span class="d">5</span><span class="sep">:</span><span class="d">0</span><span class="d">0</span></span>`,
    play: (s) => { s._t = ((s._t ?? 300) - 1 + 300) % 300 || 300; const m = String(Math.floor(s._t / 60)).padStart(2, "0"), x = String(s._t % 60).padStart(2, "0"); flipTo(s.querySelector(".pv-fc"), m + ":" + x); },
    stop: (s) => { s._t = 300; s.querySelectorAll(".pv-fc .d").forEach((d, i) => (d.textContent = "0500"[i])); },
    loop: 1000,
  };
  P["audio-bars"] = {
    html: () => `<span class="pv-eqw"><span class="pv-eq"><i></i><i></i><i></i><i></i></span><span>${t("第 3 课 · 播放中", "Lesson 3 · playing")}</span></span>`,
    play: (s) => s.querySelector(".pv-eq").classList.add("on"),
    stop: (s) => s.querySelector(".pv-eq").classList.remove("on"),
    loop: NEVER,
  };
  P["error-summary"] = {
    html: () => `<div class="pv-es"><b>${t("有 2 处需要修改", "2 things to fix")}</b><u>${t("邮箱格式不对", "Email is invalid")}</u><u>${t("密码至少 8 位", "Password too short")}</u></div>`,
    play: (s) => restart(s.querySelector(".pv-es"), "on"),
    stop: (s) => s.querySelector(".pv-es").classList.remove("on"),
  };
  P["char-counter"] = {
    html: () => `<div class="pv-cc" data-state="ok"><span class="box">${t("这节课讲得很清楚……", "Great lesson, really clear...")}</span><span class="row"><svg viewBox="0 0 20 20" width="18" height="18"><circle class="bg" cx="10" cy="10" r="8"/><circle class="fg" cx="10" cy="10" r="8" pathLength="100"/></svg><span class="tx"></span></span></div>`,
    play: (s) => {
      const steps = [[45, "ok", ""], [85, "warn", t("还能输入 15 字", "15 left")], [95, "warn", t("还能输入 5 字", "5 left")], [100, "full", t("已达到上限", "Limit reached")]];
      s._i = ((s._i ?? -1) + 1) % steps.length;
      const [p, st, tx] = steps[s._i], box = s.querySelector(".pv-cc");
      box.dataset.state = st; box.querySelector(".fg").style.strokeDashoffset = 100 - p; box.querySelector(".tx").textContent = tx;
    },
    stop: (s) => { s._i = -1; const box = s.querySelector(".pv-cc"); box.dataset.state = "ok"; box.querySelector(".fg").style.strokeDashoffset = 100; box.querySelector(".tx").textContent = ""; },
    loop: 900,
  };


  // ---------- 第九波（原创） ----------
  P["like-count"] = {
    html: () => `<span class="pv-like"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg><span class="n"><span>128</span></span></span>`,
    play: (s) => {
      const el = s.querySelector(".pv-like"), box = el.querySelector(".n");
      const on = el.classList.toggle("on"), old = box.lastElementChild, next = document.createElement("span");
      next.textContent = on ? 129 : 128; box.appendChild(next);
      if (rm()) { old.remove(); return; }
      const d = on ? 1 : -1, o = { duration: 250, easing: "cubic-bezier(0.2,0.8,0.2,1)" };
      old.animate([{ transform: "none", opacity: 1 }, { transform: `translateY(${-d * 100}%)`, opacity: 0 }], o).onfinish = () => old.remove();
      next.animate([{ transform: `translateY(${d * 100}%)`, opacity: 0 }, { transform: "none", opacity: 1 }], o);
    },
    stop: (s) => { const el = s.querySelector(".pv-like"); el.classList.remove("on"); el.querySelector(".n").innerHTML = "<span>128</span>"; },
    loop: 1200,
  };
  const AS = () => ({ saving: t("正在保存…", "Saving…"), saved: t("已保存", "Saved"), idle: t("所有更改已保存", "All changes saved") });
  P["autosave-status"] = {
    html: () => `<div class="pv-as"><span class="doc">${t("今天学了移项……", "Today I learned...")}</span><span class="st" data-state="idle"><i></i><span class="tx">${AS().idle}</span></span></div>`,
    play: (s) => {
      const seq = ["saving", "saved", "idle"], st = s.querySelector(".pv-as .st");
      s._i = ((s._i ?? -1) + 1) % seq.length;
      st.dataset.state = seq[s._i]; st.querySelector(".tx").textContent = AS()[seq[s._i]];
    },
    stop: (s) => { s._i = -1; const st = s.querySelector(".pv-as .st"); st.dataset.state = "idle"; st.querySelector(".tx").textContent = AS().idle; },
    loop: 1000,
  };
  const CARDS = () => [["apple", t("苹果", "a fruit")], ["banana", t("香蕉", "yellow")], ["cherry", t("樱桃", "small, red")]];
  P["flashcard-swipe"] = {
    html: () => `<div class="pv-fsw">${CARDS().map(([w, m]) => `<div class="c">${w}<small>${m}</small></div>`).join("")}</div>`,
    play: (s) => {
      const box = s.querySelector(".pv-fsw"), card = box.firstElementChild;
      s._d = s._d === 1 ? -1 : 1;
      const done = () => box.appendChild(card);
      if (rm()) return done();
      card.animate([{ transform: "none" }, { transform: `translateX(${s._d * 30}px) rotate(${s._d * 4}deg)`, offset: 0.35 }, { transform: `translateX(${s._d * 140}%) rotate(${s._d * 20}deg)`, opacity: 0 }], { duration: 650, easing: "ease-in" }).onfinish = done;
    },
    stop: (s) => { s._d = -1; s.querySelector(".pv-fsw").innerHTML = CARDS().map(([w, m]) => `<div class="c">${w}<small>${m}</small></div>`).join(""); },
    loop: 1300,
  };
  P["timeline-draw"] = {
    html: () => `<ol class="pv-tld">${[t("第 1 周", "Week 1"), t("第 3 周", "Week 3"), t("第 6 周", "Week 6")].map((x, i) => `<li style="--i:${i}">${x}</li>`).join("")}</ol>`,
    play: (s) => restart(s.querySelector(".pv-tld"), "on"),
    stop: (s) => s.querySelector(".pv-tld").classList.remove("on"),
    loop: 2200,
  };
  P["header-shrink"] = {
    html: () => `<div class="pv-hs"><div class="hd"><b>PurrfectCat</b><span></span></div><i></i><i class="w"></i><i></i></div>`,
    play: (s) => s.querySelector(".pv-hs").classList.toggle("on"),
    stop: (s) => s.querySelector(".pv-hs").classList.remove("on"),
    loop: 1300,
  };
  P["back-to-top"] = {
    html: () => `<div class="pv-btt"><i></i><i class="w"></i><i></i><i class="w"></i><span class="b"><svg class="r" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" pathLength="100"/></svg><svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 19V5M6 11l6-6 6 6"/></svg></span></div>`,
    play: (s) => {
      const steps = [0, 0.35, 0.7, 1], box = s.querySelector(".pv-btt");
      s._i = ((s._i ?? -1) + 1) % steps.length;
      box.classList.toggle("on", steps[s._i] > 0);
      box.style.setProperty("--off", 100 - steps[s._i] * 100);
    },
    stop: (s) => { s._i = -1; const box = s.querySelector(".pv-btt"); box.classList.remove("on"); box.style.setProperty("--off", 100); },
    loop: 800,
  };
  P["toast-stack"] = {
    html: () => `<div class="pv-tst"></div>`,
    play: (s) => {
      const box = s.querySelector(".pv-tst");
      if (box.children.length >= 3) { box.innerHTML = ""; s._n = 0; }
      s._n = (s._n ?? 0) + 1;
      const el = document.createElement("div"); el.className = "t"; el.textContent = t(`第 ${s._n} 条：作业已提交`, `#${s._n}: Homework sent`);
      box.appendChild(el);
      [...box.children].reverse().forEach((c, n) => c.style.setProperty("--n", n));
    },
    stop: (s) => { s._n = 0; s.querySelector(".pv-tst").innerHTML = ""; },
    loop: 900,
  };
  P["upload-progress"] = {
    html: () => `<div class="pv-upl" data-state="up"><span class="nm">${t("作业.pdf", "homework.pdf")}</span><span class="pc">0%</span><svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 12l5 5 9-10"/></svg><span class="bar"><i></i></span></div>`,
    play: (s) => {
      const steps = [0.2, 0.45, 0.75, 1, 0], box = s.querySelector(".pv-upl");
      s._i = ((s._i ?? -1) + 1) % steps.length;
      const p = steps[s._i];
      box.style.setProperty("--p", p);
      box.dataset.state = p >= 1 ? "done" : "up";
      box.querySelector(".pc").textContent = p >= 1 ? t("上传完成", "Done") : Math.round(p * 100) + "%";
    },
    stop: (s) => { s._i = -1; const box = s.querySelector(".pv-upl"); box.style.setProperty("--p", 0); box.dataset.state = "up"; box.querySelector(".pc").textContent = "0%"; },
    loop: 650,
  };


  // ---------- 第十波（效果参考 React Bits，代码独立重写） ----------
  P["hold-button"] = {
    html: () => `<span class="pv-hold"><i></i><span class="lb">${t("按住删除", "Hold to delete")}</span></span>`,
    play: (s) => {
      const el = s.querySelector(".pv-hold"), lb = el.querySelector(".lb");
      s._k = ((s._k ?? -1) + 1) % 3;
      el.classList.toggle("holding", s._k === 0);
      el.classList.toggle("done", s._k === 1);
      lb.textContent = s._k === 1 ? t("已删除", "Deleted") : t("按住删除", "Hold to delete");
    },
    stop: (s) => { s._k = -1; const el = s.querySelector(".pv-hold"); el.classList.remove("holding", "done"); el.querySelector(".lb").textContent = t("按住删除", "Hold to delete"); },
    loop: 1200,
  };
  P["slide-commit"] = {
    html: () => `<div class="pv-slc"><span class="tx">${t("向右滑动提交", "Slide to submit")}</span><span class="hd"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div>`,
    play: (s) => {
      const el = s.querySelector(".pv-slc"), steps = [0.45, 0.2, 1, 1, 0];
      s._i = ((s._i ?? -1) + 1) % steps.length;
      const p = steps[s._i];
      el.style.setProperty("--x", p);
      el.classList.toggle("done", s._i === 2 || s._i === 3);
      el.querySelector(".tx").textContent = el.classList.contains("done") ? t("已提交", "Submitted") : t("向右滑动提交", "Slide to submit");
    },
    stop: (s) => { s._i = -1; const el = s.querySelector(".pv-slc"); el.style.setProperty("--x", 0); el.classList.remove("done"); el.querySelector(".tx").textContent = t("向右滑动提交", "Slide to submit"); },
    loop: 700,
  };
  P["code-slots"] = {
    html: () => `<div class="pv-otp">${"<span></span>".repeat(6)}</div>`,
    play: (s) => {
      const slots = [...s.querySelectorAll(".pv-otp span")], code = "382915";
      s._n = ((s._n ?? 0) + 1) % 8;
      slots.forEach((sp, i) => {
        const ch = i < s._n ? code[i] : "";
        if (ch && !sp.textContent) restart(sp, "new");
        sp.textContent = ch;
        sp.classList.toggle("act", i === Math.min(s._n, 5) && s._n < 7);
      });
    },
    stop: (s) => { s._n = 0; s.querySelectorAll(".pv-otp span").forEach((sp, i) => { sp.textContent = ""; sp.classList.remove("new"); sp.classList.toggle("act", i === 0); }); },
    loop: 450,
  };
  P["jelly-radio"] = {
    html: () => `<div class="pv-jelly">${[t("简单", "Easy"), t("中等", "Mid"), t("困难", "Hard")].map((x, i) => `<span class="${i === 0 ? "on" : ""}">${x}</span>`).join("")}</div>`,
    play: (s) => {
      const chips = [...s.querySelectorAll(".pv-jelly span")];
      s._k = ((s._k ?? 0) + 1) % chips.length;
      chips.forEach((c, i) => { c.classList.toggle("on", i === s._k); c.classList.toggle("l", i === s._k - 1); c.classList.toggle("r", i === s._k + 1); });
      restart(chips[s._k], "on");
    },
    stop: (s) => { s._k = 0; s.querySelectorAll(".pv-jelly span").forEach((c, i) => { c.className = i === 0 ? "on" : ""; }); },
    loop: 1000,
  };
  P["fuse-undo"] = {
    html: () => `<span class="pv-fuse">${t("删除这条笔记", "Delete note")}</span>`,
    play: (s) => {
      const el = s.querySelector(".pv-fuse");
      s._k = ((s._k ?? -1) + 1) % 3;
      el.dataset.state = ["pending", "done", ""][s._k];
      el.textContent = [t("已删除 · 撤销", "Deleted · Undo"), t("已永久删除", "Gone for good"), t("删除这条笔记", "Delete note")][s._k];
    },
    stop: (s) => { s._k = -1; const el = s.querySelector(".pv-fuse"); el.dataset.state = ""; el.textContent = t("删除这条笔记", "Delete note"); },
    loop: 2600,
  };
  P["dock-magnify"] = {
    html: () => `<div class="pv-dock">${[0, 1, 2, 3, 4].map(() => `<i></i>`).join("")}</div>`,
    play: (s) => {
      const items = [...s.querySelectorAll(".pv-dock i")];
      s._x = ((s._x ?? -1) + 1) % 9;                    // 虚拟鼠标从左扫到右
      const px = s._x / 2;
      items.forEach((it, i) => it.style.setProperty("--s", rm() ? 1 : 1 + 0.6 * Math.max(0, 1 - Math.abs(i - px) / 1.6)));
    },
    stop: (s) => { s._x = -1; s.querySelectorAll(".pv-dock i").forEach((it) => it.style.setProperty("--s", 1)); },
    loop: 220,
  };
  P["true-focus"] = {
    html: () => `<div class="pv-tf">${[t("看懂", "See"), t("记住", "Keep"), t("用上", "Use")].map((x) => `<span>${x}</span>`).join("")}</div>`,
    play: (s) => {
      const el = s.querySelector(".pv-tf"), ws = [...el.querySelectorAll("span")];
      s._k = ((s._k ?? -1) + 1) % (ws.length + 1);
      const on = s._k < ws.length && !rm();
      el.classList.toggle("act", on);
      ws.forEach((w, i) => w.classList.toggle("f", i === s._k));
    },
    stop: (s) => { s._k = -1; const el = s.querySelector(".pv-tf"); el.classList.remove("act"); el.querySelectorAll("span").forEach((w) => w.classList.remove("f")); },
    loop: 800,
  };
  P["stroke-text"] = {
    html: () => `<svg class="pv-stk" viewBox="0 0 220 60"><text x="50%" y="44" text-anchor="middle">${t("学而时习之", "Learn")}</text></svg>`,
    play: (s) => restart(s.querySelector(".pv-stk"), "on"),
    stop: (s) => s.querySelector(".pv-stk").classList.remove("on"),
    loop: 3000,
  };


  // ---------- 第十一波（参考开源项目的示例，代码独立重写） ----------
  P["stagger-grid"] = {
    html: () => `<div class="pv-sg">${"<i></i>".repeat(28)}</div>`,
    play: (s) => {
      const cells = [...s.querySelectorAll(".pv-sg i")], COLS = 7;
      const origins = [10, 0, 27, 20, 6];
      s._k = ((s._k ?? -1) + 1) % origins.length;
      const o = origins[s._k], ox = o % COLS, oy = Math.floor(o / COLS);
      cells.forEach((c, i) => { c.style.setProperty("--d", Math.hypot(i % COLS - ox, Math.floor(i / COLS) - oy)); c.classList.remove("w"); });
      void s.offsetWidth;
      if (!rm()) cells.forEach((c) => c.classList.add("w"));
    },
    stop: (s) => { s._k = -1; s.querySelectorAll(".pv-sg i").forEach((c) => c.classList.remove("w")); },
    loop: 1400,
  };
  P["spring-drag"] = {
    html: () => `<span class="pv-spr">${t("7 天", "7d")}</span>`,
    play: (s) => {
      const el = s.querySelector(".pv-spr");
      if (rm()) return el.animate([{ transform: "translate(40px,-18px)" }, { transform: "translate(40px,-18px)", offset: 0.5 }, { transform: "none" }], { duration: 800, easing: "steps(1, end)" });
      el.animate([
        { transform: "none" }, { transform: "translate(44px,-20px)", offset: 0.3 },
        { transform: "translate(-14px,7px)", offset: 0.5 }, { transform: "translate(6px,-3px)", offset: 0.65 },
        { transform: "translate(-2px,1px)", offset: 0.8 }, { transform: "none" },
      ], { duration: 1300, easing: "linear" });
    },
    stop: () => {},
    loop: 1600,
  };
  P["vine-grow"] = {
    html: () => `<svg class="pv-vine" viewBox="0 0 300 120"><path style="--i:0" d="M10 110 C 60 90, 80 40, 140 50 S 230 90, 290 30" pathLength="100"/><path style="--i:1" d="M82 68 C 90 50, 108 38, 120 20" pathLength="100"/><path style="--i:2" d="M196 64 C 208 84, 228 96, 252 100" pathLength="100"/><ellipse style="--i:0" cx="120" cy="20" rx="10" ry="6"/><ellipse style="--i:1" cx="252" cy="100" rx="10" ry="6"/><ellipse style="--i:2" cx="290" cy="30" rx="10" ry="6"/><ellipse style="--i:3" cx="150" cy="50" rx="8" ry="5"/></svg>`,
    play: (s) => restart(s.querySelector(".pv-vine"), "on"),
    stop: (s) => s.querySelector(".pv-vine").classList.remove("on"),
    loop: 3200,
  };
  P["physics-drop"] = {
    html: () => `<div class="pv-phy">${[t("7天", "7d"), t("满分", "A+"), t("早起", "AM")].map((x, i) => `<span style="left:${18 + i * 32}%">${x}</span>`).join("")}</div>`,
    play: (s) => {
      if (rm()) return;
      s.querySelectorAll(".pv-phy span").forEach((b, i) => b.animate([
        { transform: "translateY(-110px)", easing: "cubic-bezier(0.5,0,1,1)" }, { transform: "none", offset: 0.4, easing: "cubic-bezier(0,0,0.5,1)" },
        { transform: "translateY(-26px)", offset: 0.58, easing: "cubic-bezier(0.5,0,1,1)" }, { transform: "none", offset: 0.74, easing: "cubic-bezier(0,0,0.5,1)" },
        { transform: "translateY(-7px)", offset: 0.86, easing: "cubic-bezier(0.5,0,1,1)" }, { transform: "none" },
      ], { duration: 1100, delay: i * 150, fill: "backwards" }));
    },
    stop: () => {},
    loop: 2400,
  };
  P["line-chart-draw"] = {
    html: () => `<svg class="pv-lc" viewBox="0 0 300 120"><path class="ar" d="M0 89 L50 68 L100 73 L150 55 L200 42 L250 47 L300 26 L300 120 L0 120 Z"/><path class="ln" d="M0 89 L50 68 L100 73 L150 55 L200 42 L250 47 L300 26" pathLength="100"/>${[[0, 89], [50, 68], [100, 73], [150, 55], [200, 42], [250, 47], [300, 26]].map(([x, y], i) => `<circle style="--i:${i}" cx="${x}" cy="${y}" r="6"/>`).join("")}</svg>`,
    play: (s) => restart(s.querySelector(".pv-lc"), "on"),
    stop: (s) => s.querySelector(".pv-lc").classList.remove("on"),
    loop: 2800,
  };
  P["coin-fly"] = {
    html: () => `<div class="pv-coin"><span class="btn">${t("答对了", "Correct")}</span><span class="sc">${t("积分", "Pts")} <b>120</b></span></div>`,
    play: (s) => {
      const box = s.querySelector(".pv-coin"), num = box.querySelector("b");
      const bump = () => { num.textContent = Number(num.textContent) + 10; restart(num, "bump"); };
      if (rm()) return bump();
      const frames = [{ transform: "translate(0,0) scale(1)" }, { transform: "translate(55px,-50px) scale(1.3)", offset: 0.5 }, { transform: "translate(110px,-58px) scale(0.6)" }];
      [0, 40, 80, 120].forEach((d, i) => {
        const st = document.createElement("i"); st.className = "star"; st.style.opacity = 1 - i * 0.28; box.appendChild(st);
        st.animate(frames, { duration: 700, delay: d, easing: "cubic-bezier(0.5,0,0.3,1)", fill: "backwards" }).onfinish = () => { st.remove(); if (!i) bump(); };
      });
    },
    stop: (s) => { s.querySelectorAll(".pv-coin .star").forEach((x) => x.remove()); s.querySelector(".pv-coin b").textContent = 120; },
    loop: 1500,
  };
  P["step-sequencer"] = {
    html: () => `<div class="pv-seq">${["10101010", "00100010"].map((r) => [...r].map((c, i) => `<i data-c="${i}" class="${c === "1" ? "on" : ""}"></i>`).join("")).join("")}</div>`,
    play: (s) => {
      s._c = ((s._c ?? -1) + 1) % 8;
      s.querySelectorAll(".pv-seq i").forEach((p) => {
        const now = Number(p.dataset.c) === s._c;
        p.classList.toggle("now", now);
        if (now && p.classList.contains("on") && !rm()) restart(p, "hit");
      });
    },
    stop: (s) => { s._c = -1; s.querySelectorAll(".pv-seq i").forEach((p) => p.classList.remove("now", "hit")); },
    loop: 250,
  };
  const WH = [30, 50, 70, 40, 90, 60, 35, 80, 100, 65, 45, 75, 55, 85, 40, 30, 60, 95, 70, 50, 35, 65, 80, 45];
  P["waveform-progress"] = {
    html: () => { const bars = WH.map((h) => `<i style="--h:${h}%"></i>`).join(""); return `<div class="pv-wv" style="--p:0%"><div class="b">${bars}</div><div class="b pl">${bars}</div></div>`; },
    play: (s) => { s._p = ((s._p ?? 0) + 4) % 104; s.querySelector(".pv-wv").style.setProperty("--p", s._p + "%"); },
    stop: (s) => { s._p = 0; s.querySelector(".pv-wv").style.setProperty("--p", "0%"); },
    loop: 160,
  };

  window.PREVIEWS = P;
})();
