FX.shimmer = {
  ok: function (el) { return el.tagName !== "INPUT" && el.tagName !== "IMG"; }, // input 没有伪元素
  init: function (el) {
    U.fixPos(el);
    U.tint(el);
    el.addEventListener("pointerenter", function () { U.tint(el); }); // 深浅色主题切换后重新取色
  }
};
