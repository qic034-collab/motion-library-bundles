FX.pulse = {
  ok: function (el) { return el.tagName !== "INPUT" && el.tagName !== "IMG"; },
  init: function (el) { U.fixPos(el); U.tint(el); }
};
