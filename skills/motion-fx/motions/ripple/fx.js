FX.ripple = {
  ok: function (el) { return el.tagName !== "INPUT" && el.tagName !== "IMG"; }, // input 不能放子元素
  init: function (el) {
    U.fixPos(el);
    U.tint(el);
    el.addEventListener("pointerenter", function () { U.tint(el); });
  },
  boot: function () {
    // 事件委托：整页只挂一个监听
    document.addEventListener("click", function (e) {
      var el = e.target.closest && e.target.closest('[data-fx~="ripple"]');
      if (!el || U.disabled(el) || U.reduced()) return;
      var r = el.getBoundingClientRect();
      // e.detail 为 0 说明是键盘触发，从中心扩散
      var x = e.detail ? e.clientX - r.left : r.width / 2;
      var y = e.detail ? e.clientY - r.top : r.height / 2;
      var d = 2 * Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y));
      var ink = document.createElement("span");
      ink.className = "fx-ink";
      ink.setAttribute("aria-hidden", "true");
      ink.style.cssText = "width:" + d + "px;height:" + d + "px;left:" + (x - d / 2) + "px;top:" + (y - d / 2) + "px";
      el.appendChild(ink);
      ink.addEventListener("animationend", function () { ink.remove(); });
    });
  }
};
