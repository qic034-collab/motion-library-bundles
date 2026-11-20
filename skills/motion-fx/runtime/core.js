/* motion-fx 运行时（自动生成，不要手改；用 scripts/apply.js 重新生成） */
(function () {
  "use strict";
  var CONFIG = /*__CONFIG__*/ null;
  var FX = {};

  /* ---------- 工具 ---------- */
  var U = {
    reduced: function () {
      return (
        (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) ||
        document.documentElement.getAttribute("data-rm") === "1"
      );
    },
    matches: function (el, sel) {
      try { return el.matches(sel); } catch (e) { return false; }
    },
    disabled: function (el) {
      return el.disabled || el.getAttribute("aria-disabled") === "true";
    },
    // 只有 static 的元素才补 position: relative，避免破坏原来的布局
    fixPos: function (el) {
      if (getComputedStyle(el).position === "static") el.setAttribute("data-fx-pos", "");
    },
    // 按钮底色偏深就用白色高光，偏浅就用深色高光；透明按钮用文字颜色
    tint: function (el) {
      var cs = getComputedStyle(el);
      var m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.%]+))?\s*\)/.exec(cs.backgroundColor);
      var a = m && m[4] != null ? parseFloat(m[4]) / (/%/.test(m[4]) ? 100 : 1) : 1;
      if (m && a > 0.5) {
        var lum = (0.299 * m[1] + 0.587 * m[2] + 0.114 * m[3]) / 255;
        el.style.setProperty("--fx-hl", lum < 0.55 ? "rgb(255 255 255 / 0.38)" : "rgb(0 0 0 / 0.14)");
        el.style.setProperty("--fx-bg", cs.backgroundColor);
      } else {
        el.style.setProperty("--fx-hl", "color-mix(in srgb, currentColor 22%, transparent)");
        el.style.setProperty("--fx-bg", "currentColor");
      }
    },
    // 给 scale / translate 加过渡，同时保留按钮原来的 transition，不覆盖
    addTransition: function (el, prop, dur, ease) {
      var cs = getComputedStyle(el);
      var props = cs.transitionProperty.split(",").map(function (s) { return s.trim(); });
      var durs = cs.transitionDuration.split(",").map(parseFloat);
      for (var i = 0; i < props.length; i++) {
        if ((props[i] === "all" || props[i] === prop) && durs[i % durs.length] > 0) return; // 已经有过渡
      }
      var plain = props.length === 1 && props[0] === "all" && durs.every(function (d) { return !d; });
      var add = prop + " " + (dur || "var(--fx-fast)") + " " + (ease || "var(--fx-ease)");
      el.style.transition = plain ? add : cs.transition + ", " + add;
    }
  };

  /*__EFFECTS__*/

  /* ---------- 把效果挂到匹配的元素上 ---------- */
  var done = new WeakMap(); // el -> { 效果名: true }

  function tag(el) {
    if (el.nodeType !== 1 || el.closest("[data-fx-skip]")) return;
    var names = [];
    CONFIG.rules.forEach(function (r) {
      if (!U.matches(el, r.select)) return;
      if (r.exclude && U.matches(el, r.exclude)) return;
      r.fx.forEach(function (n) {
        if (FX[n] && names.indexOf(n) < 0 && FX[n].ok(el)) names.push(n);
      });
    });
    if (!names.length) return;
    var d = done.get(el) || {};
    names.forEach(function (n) {
      if (!d[n]) { d[n] = true; if (FX[n].init) FX[n].init(el); }
    });
    done.set(el, d);
    el.setAttribute("data-fx", names.join(" "));
  }

  function scan(root) {
    tag(root);
    CONFIG.rules.forEach(function (r) {
      try { root.querySelectorAll(r.select).forEach(tag); } catch (e) { /* 选择器写错就跳过 */ }
    });
  }

  function start() {
    scan(document.documentElement);
    Object.keys(FX).forEach(function (n) { if (FX[n].boot) FX[n].boot(); });
    // 页面后来才出现的按钮（单页应用、弹窗里的按钮）也自动套上
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        if (m.type === "attributes") tag(m.target);
        else m.addedNodes.forEach(function (n) { if (n.nodeType === 1) scan(n); });
      });
    }).observe(document.documentElement, {
      childList: true, subtree: true, attributes: true,
      attributeFilter: ["class", "type", "role", "disabled"]
    });
  }

  window.MotionFX = { config: CONFIG, rescan: function () { scan(document.documentElement); } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
