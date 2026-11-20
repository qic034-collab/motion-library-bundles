(function () {
  var RANGE = 40;     // 鼠标离按钮边缘多少像素内开始吸
  var STRENGTH = 0.25; // 偏移量占鼠标距离的比例（别超过 0.3，会点不准）
  var MAX = 10;        // 最大偏移像素
  var items = [], raf = 0, last = null;
  function clamp(v) { return Math.max(-MAX, Math.min(MAX, v)); }
  function reset(el) { if (el.__fxm) { el.style.translate = ""; el.__fxm = null; } }
  function update() {
    raf = 0;
    items = items.filter(function (el) { return el.isConnected; });
    items.forEach(function (el) {
      if (!last || U.disabled(el)) return reset(el);
      var r = el.getBoundingClientRect(), cur = el.__fxm || { x: 0, y: 0 };
      var left = r.left - cur.x, top = r.top - cur.y; // 去掉当前位移，得到原始位置
      var cx = left + r.width / 2, cy = top + r.height / 2;
      var dx = Math.max(left - last.clientX, 0, last.clientX - (left + r.width));
      var dy = Math.max(top - last.clientY, 0, last.clientY - (top + r.height));
      if (Math.hypot(dx, dy) > RANGE) return reset(el);
      var ox = clamp((last.clientX - cx) * STRENGTH), oy = clamp((last.clientY - cy) * STRENGTH);
      el.style.translate = ox + "px " + oy + "px";
      el.__fxm = { x: ox, y: oy };
    });
  }
  FX.magnetic = {
    ok: function () { return true; },
    init: function (el) {
      U.addTransition(el, "translate", "var(--fx-base)", "var(--fx-spring)");
      items.push(el);
    },
    boot: function () {
      document.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse" || U.reduced()) return; // 触屏没有“靠近”这回事
        last = e;
        if (!raf) raf = requestAnimationFrame(update);
      });
      document.documentElement.addEventListener("mouseleave", function () { last = null; update(); });
    }
  };
})();
