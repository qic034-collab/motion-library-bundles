// 登录、收藏、我的代码、个人主页（界面部分）。
// 没配置云端（assets/config.js 为空）时，这个文件什么都不显示，网站和原来一样。
// 依赖：window.Cloud（cloud.js）和 window.PC（app.js 暴露的小工具）。
(function () {
  const Cloud = window.Cloud;
  const PC = () => window.PC;

  // ---------- 文字 ----------
  const T = {
    zh: {
      login: "登录", loginTitle: "登录", loginLead: "输入邮箱，我们发一个登录链接给你，点一下就进来了，不用设密码。", email: "邮箱", sendLink: "发送登录链接",
      sent: (e) => `已发送到 ${e}。点开邮件里的链接就登录了（没收到的话看看垃圾邮件）。`, sending: "发送中…",
      setName: "起个名字", profileTitle: "你的主页", profileLead: "主页地址会是 #u=你的名字。名字起好就不能改了。", handle: "主页名字", handleHint: "3–20 位：小写字母、数字、- 和 _", display: "显示名称（选填）", bio: "一句话介绍（选填）", save: "保存", cancel: "取消", taken: "这个名字被占用了，换一个吧。",
      saved: "已收藏（仅自己可见）· 去主页可以改成公开", unsaved: "已取消收藏", saveAria: "收藏", unsaveAria: "取消收藏",
      myProfile: "我的主页", loading: "加载中…", notFound: "没有这个用户。", off: "这个网站还没有连接云端，暂时不能使用主页功能。", loadFail: "加载失败：",
      all: "全部", motions: "收藏的动效", customs: "我的代码", liked: "喜欢", priv: "私密",
      addCode: "添加我的代码", editProfile: "编辑资料", copyLink: "复制主页链接", linkCopied: "主页链接已复制", signOut: "退出登录", signedOut: "已退出登录",
      statPub: (n) => `公开 ${n}`, statPriv: (n) => `私密 ${n}`,
      emptyOwn: "还没有内容。去动效库点爱心收藏，或者添加你自己写的代码。", emptyOther: "这个人还没有公开的内容。", emptyFilter: "这个分类里还没有内容。", toLib: "去动效库",
      public: "公开", private: "私密", toPublic: "改为公开", toPrivate: "改为私密", nowPublic: "已设为公开，任何人都能看到", nowPrivate: "已设为私密，只有你能看到",
      like: "喜欢", unlike: "取消喜欢", edit: "编辑", remove: "移除", removeSure: "再点一次删除", removed: "已删除",
      run: "运行预览", rerun: "重新运行", gone: "这个动效已经不在动效库里了。", mine: "我的代码", copyAll: "整页 HTML",
      codeTitleNew: "添加我的代码", codeTitleEdit: "编辑我的代码", title: "名称", desc: "说明（选填）", htmlL: "HTML", cssL: "CSS", jsL: "JS", vis: "谁能看到",
      visPriv: "私密：只有我", visPub: "公开：任何人都能在我的主页看到并复制", pubWarn: "公开后任何人都能复制这段代码。不要放密钥、密码或隐私。",
      try: "试运行", needCode: "HTML、CSS、JS 至少写一项。", sandboxNote: "代码在隔离的沙箱里运行，不能联网，也碰不到这个网站。",
      fork: "存为我的代码", forkToast: "已复制到编辑器，改完保存就是你的版本", copied: "已复制",
      err: (m) => `出错了：${m}`,
    },
    en: {
      login: "Sign in", loginTitle: "Sign in", loginLead: "Enter your email and we'll send a sign-in link. One click and you're in, no password.", email: "Email", sendLink: "Send sign-in link",
      sent: (e) => `Sent to ${e}. Open the link in the email to sign in (check spam if it's missing).`, sending: "Sending…",
      setName: "Pick a name", profileTitle: "Your profile", profileLead: "Your page will live at #u=yourname. The name can't be changed later.", handle: "Profile name", handleHint: "3–20 characters: lowercase letters, digits, - and _", display: "Display name (optional)", bio: "One-line bio (optional)", save: "Save", cancel: "Cancel", taken: "That name is taken. Try another.",
      saved: "Saved (only you can see it) · make it public from your profile", unsaved: "Removed from saved", saveAria: "Save", unsaveAria: "Remove from saved",
      myProfile: "My profile", loading: "Loading…", notFound: "No such user.", off: "This site isn't connected to the cloud yet, so profiles aren't available.", loadFail: "Couldn't load: ",
      all: "All", motions: "Saved motions", customs: "My code", liked: "Liked", priv: "Private",
      addCode: "Add my code", editProfile: "Edit profile", copyLink: "Copy profile link", linkCopied: "Profile link copied", signOut: "Sign out", signedOut: "Signed out",
      statPub: (n) => `${n} public`, statPriv: (n) => `${n} private`,
      emptyOwn: "Nothing here yet. Tap the heart in the library to save a motion, or add code you wrote.", emptyOther: "This person hasn't shared anything yet.", emptyFilter: "Nothing in this filter yet.", toLib: "Open the library",
      public: "Public", private: "Private", toPublic: "Make public", toPrivate: "Make private", nowPublic: "Now public. Anyone can see it", nowPrivate: "Now private. Only you can see it",
      like: "Like", unlike: "Unlike", edit: "Edit", remove: "Remove", removeSure: "Tap again to delete", removed: "Deleted",
      run: "Run preview", rerun: "Run again", gone: "This motion is no longer in the library.", mine: "My code", copyAll: "Full HTML",
      codeTitleNew: "Add my code", codeTitleEdit: "Edit my code", title: "Name", desc: "Description (optional)", htmlL: "HTML", cssL: "CSS", jsL: "JS", vis: "Who can see it",
      visPriv: "Private: only me", visPub: "Public: anyone can see and copy it on my profile", pubWarn: "Once public, anyone can copy this code. Don't include keys, passwords or private info.",
      try: "Try it", needCode: "Write at least one of HTML, CSS or JS.", sandboxNote: "Code runs in an isolated sandbox: no network, no access to this site.",
      fork: "Save as my code", forkToast: "Copied into the editor. Save it to make it yours", copied: "Copied",
      err: (m) => `Something went wrong: ${m}`,
    },
  };
  const t = () => T[PC().S.lang];
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---------- 状态 ----------
  const mine = { items: [], byMotion: new Map() };
  const pv = { handle: null, uid: null, profile: null, items: [], filter: "all", token: 0, error: null };

  const icons = {
    heart: ["M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"],
    lock: ["M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -6", "M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0", "M8 11v-4a4 4 0 1 1 8 0v4"],
    user: ["M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0", "M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"],
    trash: ["M4 7l16 0", "M10 11l0 6", "M14 11l0 6", "M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12", "M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"],
    plus: ["M12 5l0 14", "M5 12l14 0"],
    pencil: ["M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4", "M13.5 6.5l4 4"],
    code: ["M7 8l-4 4l4 4", "M17 8l4 4l-4 4", "M14 4l-4 16"],
    link: ["M9 15l6 -6", "M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464", "M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"],
    logout: ["M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2", "M9 12h12l-3 -3", "M18 15l3 -3"],
  };
  let iconsAdded = false;
  const ic = (n, cls) => { if (!iconsAdded) { Object.assign(PC().ICONS, icons); iconsAdded = true; } return PC().icon(n, cls); };
  const esc = (s) => PC().esc(s);

  const me = () => Cloud.me();
  const uid = () => (Cloud.user() ? Cloud.user().id : null);
  const isOwner = () => !!(me() && pv.profile && me().id === pv.profile.id);
  const errMsg = (e) => (e && e.message) || String(e);

  async function loadMine() {
    if (!Cloud.enabled || !uid() || !me()) { mine.items = []; mine.byMotion = new Map(); return; }
    try {
      mine.items = await Cloud.items(me().id);
      mine.byMotion = new Map(mine.items.filter((i) => i.kind === "motion").map((i) => [i.motion_id, i]));
    } catch (e) { /* 收藏状态读不到不影响浏览 */ }
  }

  // ---------- 给 app.js 用的小零件 ----------
  function saveBtn(id) {
    if (!Cloud.enabled) return "";
    const on = mine.byMotion.has(id), l = t();
    return `<button type="button" class="savebtn" data-save="${esc(id)}" aria-pressed="${on}" aria-label="${on ? l.unsaveAria : l.saveAria}" title="${on ? l.unsaveAria : l.saveAria}">${ic("heart", "ic-s")}</button>`;
  }
  function forkBtn(id) {
    if (!Cloud.enabled) return "";
    return `<button type="button" class="btn sm" data-fork="${esc(id)}">${ic("code", "ic-s")} ${t().fork}</button>`;
  }
  function refreshHearts() {
    const l = t();
    $$("[data-save]").forEach((b) => {
      const on = mine.byMotion.has(b.dataset.save);
      b.setAttribute("aria-pressed", on);
      b.setAttribute("aria-label", on ? l.unsaveAria : l.saveAria);
      b.title = on ? l.unsaveAria : l.saveAria;
    });
  }
  function updateAcct() {
    const b = $("#btn-acct"), l = t();
    if (!b) return;
    b.hidden = !Cloud.enabled || !Cloud.ready; // 还没确认登录状态之前先不显示，免得闪一下“登录”
    if (b.hidden) return;
    const label = !uid() ? l.login : me() ? "@" + me().handle : l.setName;
    b.innerHTML = `${ic("user", "ic-s")}<span class="lbl">${esc(label)}</span>`;
    b.setAttribute("aria-label", !uid() ? l.login : me() ? l.myProfile : l.setName);
  }

  // ---------- 弹窗 ----------
  function openDlg(html, label) {
    const dlg = $("#dlg");
    if (dlg.open) dlg.close();
    dlg.innerHTML = html;
    dlg.setAttribute("aria-labelledby", label || "dlg-title");
    dlg.onclick = (e) => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); };
    dlg.showModal();
    const first = $("input:not([readonly]), textarea", dlg);
    if (first) first.focus();
    return dlg;
  }
  const head = (title, id = "dlg-title") => `<div class="dlg-head"><div><h2 id="${id}">${esc(title)}</h2></div><button type="button" class="btn sm" data-close>${esc(t().cancel)}</button></div>`;

  function openLogin() {
    const l = t();
    openDlg(`${head(l.loginTitle)}<div class="dlg-body"><p>${esc(l.loginLead)}</p>
      <form id="loginform" class="form"><label class="field"><span>${l.email}</span><input type="email" name="email" required autocomplete="email" inputmode="email"></label>
      <div class="row"><button type="submit" class="btn primary">${l.sendLink}</button></div><p class="form__msg" id="formmsg" role="status" aria-live="polite"></p></form></div>`);
  }
  function openProfileForm() {
    const l = t(), p = me(), editing = !!p;
    openDlg(`${head(editing ? l.editProfile : l.profileTitle)}<div class="dlg-body"><p>${esc(l.profileLead)}</p>
      <form id="profileform" class="form">
        <label class="field"><span>${l.handle}</span><input name="handle" required minlength="3" maxlength="20" pattern="[a-z0-9_\\-]{3,20}" value="${esc(p ? p.handle : "")}" ${editing ? "readonly" : ""} autocomplete="off" autocapitalize="none" spellcheck="false"><small>${l.handleHint}</small></label>
        <label class="field"><span>${l.display}</span><input name="display_name" maxlength="40" value="${esc(p ? p.display_name || "" : "")}"></label>
        <label class="field"><span>${l.bio}</span><textarea name="bio" maxlength="200" rows="2">${esc(p ? p.bio || "" : "")}</textarea></label>
        <div class="row"><button type="submit" class="btn primary">${l.save}</button></div><p class="form__msg" id="formmsg" role="status" aria-live="polite"></p></form></div>`);
  }
  function sandboxDoc(it) {
    const cs = getComputedStyle(document.documentElement);
    const bg = cs.getPropertyValue("--surface-2").trim() || "#f4f1ec", ink = cs.getPropertyValue("--ink").trim() || "#1b1b1b";
    const tokens = (window.CONTENT && window.CONTENT.tokens) || "";
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; font-src data:; media-src data:">
<style>${tokens}
html,body{margin:0;height:100%}body{display:grid;place-items:center;background:${bg};color:${ink};font:16px system-ui,-apple-system,"PingFang SC",sans-serif}
${it.css || ""}</style></head><body>${it.html || ""}<script>try{${it.js || ""}\n}catch(e){}<\/script></body></html>`;
  }
  function mountSandbox(host, it) {
    host.innerHTML = "";
    const f = document.createElement("iframe");
    f.setAttribute("sandbox", "allow-scripts"); // 不加 allow-same-origin：代码碰不到这个网站的任何数据
    f.setAttribute("referrerpolicy", "no-referrer");
    f.title = it.title || "";
    f.className = "sandbox";
    f.srcdoc = sandboxDoc(it);
    host.appendChild(f);
  }
  function openItemForm(it) {
    const l = t(), editing = !!(it && it.id);
    it = it || { visibility: "private" };
    const dlg = openDlg(`${head(editing ? l.codeTitleEdit : l.codeTitleNew)}<div class="dlg-body">
      <form id="itemform" class="form" data-id="${esc(it.id || "")}">
        <label class="field"><span>${l.title}</span><input name="title" required maxlength="80" value="${esc(it.title || "")}"></label>
        <label class="field"><span>${l.desc}</span><input name="description" maxlength="300" value="${esc(it.description || "")}"></label>
        ${[["html", l.htmlL], ["css", l.cssL], ["js", l.jsL]].map(([k, lab]) => `<label class="field"><span>${lab}</span><textarea class="code" name="${k}" rows="${k === "html" ? 4 : 5}" maxlength="20000" spellcheck="false" autocapitalize="none" autocomplete="off">${esc(it[k] || "")}</textarea></label>`).join("")}
        <div class="stage tryhost" id="tryhost" hidden></div>
        <p class="hint">${ic("lock", "ic-s")} ${l.sandboxNote}</p>
        <fieldset class="field"><legend>${l.vis}</legend>
          <label class="radio"><input type="radio" name="visibility" value="private" ${it.visibility !== "public" ? "checked" : ""}> ${l.visPriv}</label>
          <label class="radio"><input type="radio" name="visibility" value="public" ${it.visibility === "public" ? "checked" : ""}> ${l.visPub}</label>
          <small class="pubwarn" ${it.visibility === "public" ? "" : "hidden"}>${l.pubWarn}</small></fieldset>
        <div class="row"><button type="button" class="btn" data-try>${l.try}</button><button type="submit" class="btn primary">${l.save}</button></div>
        <p class="form__msg" id="formmsg" role="status" aria-live="polite"></p></form></div>`);
    dlg.item = it;
  }

  // ---------- 动作 ----------
  const say = (m, bad) => { const el = $("#formmsg"); if (el) { el.textContent = m; el.classList.toggle("bad", !!bad); } };

  async function toggleSave(id) {
    const l = t();
    if (!uid()) return openLogin();
    if (!me()) return openProfileForm();
    try {
      const ex = mine.byMotion.get(id);
      if (ex) {
        await Cloud.deleteItem(ex.id);
        mine.items = mine.items.filter((i) => i.id !== ex.id); mine.byMotion.delete(id);
        pv.items = pv.items.filter((i) => i.id !== ex.id);
        PC().toast(l.unsaved);
      } else {
        const row = await Cloud.saveItem({ kind: "motion", motion_id: id, visibility: "private" });
        mine.items.unshift(row); mine.byMotion.set(id, row);
        if (isOwner()) pv.items.unshift(row);
        PC().toast(l.saved);
      }
      refreshHearts();
      if (PC().S.view === "profile") paint();
    } catch (e) { PC().toast(l.err(errMsg(e))); }
  }

  async function patchItem(id, patch, msg) {
    const it = pv.items.find((x) => x.id === id) || mine.items.find((x) => x.id === id);
    if (!it) return;
    try {
      const row = await Cloud.saveItem({ ...it, ...patch });
      for (const arr of [pv.items, mine.items]) { const i = arr.findIndex((x) => x.id === id); if (i >= 0) arr[i] = row; }
      if (row.kind === "motion") mine.byMotion.set(row.motion_id, row);
      if (msg) PC().toast(msg);
      paint();
    } catch (e) { PC().toast(t().err(errMsg(e))); }
  }

  async function removeItem(id) {
    try {
      await Cloud.deleteItem(id);
      const it = mine.items.find((x) => x.id === id);
      mine.items = mine.items.filter((x) => x.id !== id);
      if (it && it.kind === "motion") mine.byMotion.delete(it.motion_id);
      pv.items = pv.items.filter((x) => x.id !== id);
      PC().toast(t().removed);
      refreshHearts(); paint();
    } catch (e) { PC().toast(t().err(errMsg(e))); }
  }

  function openProfile(handle) { PC().S.u = handle; PC().go("profile", 1); }

  // ---------- 主页 ----------
  function view() { return `<section class="prof" id="prof" aria-live="polite"><p class="prof__state">${esc(t().loading)}</p></section>`; }

  async function loadProfile() {
    const S = PC().S, l = t(), token = ++pv.token;
    if (!Cloud.enabled) { $("#prof").innerHTML = `<p class="prof__state">${esc(l.off)}</p>`; return; }
    if (pv.handle === S.u && pv.uid === uid() && pv.profile && !pv.error) return paint();
    $("#prof").innerHTML = `<p class="prof__state">${esc(l.loading)}</p>`;
    try {
      const p = await Cloud.profileByHandle(S.u);
      if (token !== pv.token) return;
      pv.handle = S.u; pv.uid = uid(); pv.profile = p; pv.error = null; pv.filter = "all";
      pv.items = p ? await Cloud.items(p.id) : [];
      if (token !== pv.token) return;
    } catch (e) { pv.error = e; if (token === pv.token) $("#prof") && ($("#prof").innerHTML = `<p class="prof__state bad">${esc(l.loadFail + errMsg(e))}</p>`); return; }
    paint();
  }

  const visPill = (it) => `<span class="pill vis ${it.visibility}">${ic(it.visibility === "public" ? "world" : "lock", "ic-s")} ${t()[it.visibility]}</span>`;

  function ownerBar(it) {
    const l = t(), pub = it.visibility === "public";
    return `<div class="pcard__bar">
      <button type="button" class="chip sm vis" data-vis="${it.id}" data-to="${pub ? "private" : "public"}" title="${pub ? l.toPrivate : l.toPublic}" aria-label="${pub ? l.toPrivate : l.toPublic}">${ic(pub ? "world" : "lock", "ic-s")} ${l[it.visibility]}</button>
      <button type="button" class="chip sm like" data-like="${it.id}" aria-pressed="${!!it.liked}" aria-label="${it.liked ? l.unlike : l.like}" title="${it.liked ? l.unlike : l.like}">${ic("heart", "ic-s")}</button>
      ${it.kind === "custom" ? `<button type="button" class="chip sm" data-edit="${it.id}" aria-label="${l.edit}" title="${l.edit}">${ic("pencil", "ic-s")}</button>` : ""}
      <button type="button" class="chip sm del" data-del="${it.id}" aria-label="${l.remove}" title="${l.remove}">${ic("trash", "ic-s")}</button></div>`;
  }

  function motionItemCard(it, owner) {
    const P = PC(), l = t(), m = P.C.motions[it.motion_id];
    if (!m || !P.PV[it.motion_id]) return `<div class="card pcard"><p class="msum">${esc(l.gone)} (${esc(it.motion_id)})</p>${owner ? ownerBar(it) : ""}</div>`;
    const id = it.motion_id;
    const btns = [["prompt", P.L().prompt], ["html", "HTML", m.html], ["css", "CSS", m.css], ["js", "JS", m.js]].filter((b) => b.length === 2 || b[2]);
    return `<div class="card mcard pcard" data-pv="${id}" data-item="${it.id}">
      <div class="stage" data-stage="${id}">${P.PV[id].html()}<button type="button" class="playbtn" data-play="${id}" aria-label="${esc(P.L().play)}：${esc(P.tx(m.name))}">${ic("play", "ic-s")}</button></div>
      ${owner ? "" : saveBtn(id)}
      <div class="mbody"><button type="button" class="mname" data-detail="${id}">${esc(P.tx(m.name))}</button>${owner ? "" : ""}</div>
      ${P.tx(m.summary) ? `<p class="msum">${esc(P.tx(m.summary))}</p>` : ""}
      <div class="copies">${btns.map(([k, label]) => `<button type="button" class="cbtn" data-cp="${k}" data-id="${id}">${label}</button>`).join("")}</div>
      ${owner ? ownerBar(it) : ""}</div>`;
  }

  function customItemCard(it, owner) {
    const l = t();
    const btns = [["html", "HTML", it.html], ["css", "CSS", it.css], ["js", "JS", it.js]].filter((b) => b[2]);
    return `<div class="card mcard pcard custom" data-item="${it.id}">
      <div class="stage" data-host="${it.id}"><button type="button" class="runbtn" data-run="${it.id}">${ic("play", "ic-s")} ${l.run}</button></div>
      <div class="mbody"><span class="mname">${esc(it.title)}</span><span class="pill accent">${l.mine}</span></div>
      ${it.description ? `<p class="msum">${esc(it.description)}</p>` : ""}
      <div class="copies">${btns.map(([k, label]) => `<button type="button" class="cbtn" data-cpitem="${it.id}" data-k="${k}">${label}</button>`).join("")}<button type="button" class="cbtn" data-cpitem="${it.id}" data-k="all">${l.copyAll}</button></div>
      ${owner ? ownerBar(it) : ""}</div>`;
  }

  function paint() {
    const P = PC(), S = P.S, l = t(), host = $("#prof");
    if (!host || S.view !== "profile") return;
    const p = pv.profile;
    if (!p) { host.innerHTML = `<p class="prof__state">${esc(l.notFound)}</p>`; return; }
    const owner = isOwner(), items = pv.items;
    const pub = items.filter((i) => i.visibility === "public").length, priv = items.length - pub;
    const filters = [["all", l.all, items.length], ["motion", l.motions, items.filter((i) => i.kind === "motion").length], ["custom", l.customs, items.filter((i) => i.kind === "custom").length], ["liked", l.liked, items.filter((i) => i.liked).length]];
    if (owner) filters.push(["private", l.priv, priv]);
    if (!filters.some((f) => f[0] === pv.filter)) pv.filter = "all";
    const shown = items.filter((i) => ({ all: true, motion: i.kind === "motion", custom: i.kind === "custom", liked: i.liked, private: i.visibility === "private" }[pv.filter]));
    const name = p.display_name || p.handle;
    host.innerHTML = `<header class="prof__head">
        <div class="avatar" aria-hidden="true">${esc([...name][0] || "?").toUpperCase()}</div>
        <div class="prof__id"><h1 id="h1" tabindex="-1">${esc(name)}</h1><p class="prof__handle">@${esc(p.handle)}</p>${p.bio ? `<p class="prof__bio">${esc(p.bio)}</p>` : ""}
          <p class="prof__stat">${l.statPub(pub)}${owner ? " · " + l.statPriv(priv) : ""}</p></div>
        <div class="prof__acts">
          ${owner ? `<button type="button" class="btn primary sm" data-newcode>${ic("plus", "ic-s")} ${l.addCode}</button><button type="button" class="btn sm" data-editprofile>${ic("pencil", "ic-s")} ${l.editProfile}</button>` : ""}
          <button type="button" class="btn sm" data-copyprofile>${ic("link", "ic-s")} ${l.copyLink}</button>
          ${owner ? `<button type="button" class="btn sm quiet" data-signout>${ic("logout", "ic-s")} ${l.signOut}</button>` : ""}</div></header>
      <div class="filters prof__filters" role="group" aria-label="${esc(l.all)}">${filters.map(([k, lab, n]) => `<button type="button" class="chip" data-pf="${k}" aria-pressed="${pv.filter === k}">${esc(lab)} <span class="count">${n}</span></button>`).join("")}</div>
      ${shown.length ? `<div class="cards prof__cards">${shown.map((i) => (i.kind === "motion" ? motionItemCard(i, owner) : customItemCard(i, owner))).join("")}</div>`
        : `<div class="prof__empty"><p>${esc(!items.length ? (owner ? l.emptyOwn : l.emptyOther) : l.emptyFilter)}</p>${owner && !items.length ? `<button type="button" class="btn primary sm" data-golib="all">${l.toLib}</button>` : ""}</div>`}`;
    P.bindPreviews(host);
  }

  // ---------- 事件 ----------
  document.addEventListener("click", async (e) => {
    if (!Cloud.enabled) return;
    const b = e.target.closest("button");
    if (!b) return;
    const l = t();
    if (b.id === "btn-acct") { if (!uid()) return openLogin(); if (!me()) return openProfileForm(); return openProfile(me().handle); }
    if (b.dataset.save) return toggleSave(b.dataset.save);
    if (b.dataset.fork) {
      if (!uid()) return openLogin();
      if (!me()) return openProfileForm();
      const m = PC().C.motions[b.dataset.fork];
      openItemForm({ title: PC().tx(m.name), description: PC().tx(m.summary), html: m.html, css: m.css, js: m.js, visibility: "private" });
      return PC().toast(l.forkToast);
    }
    if (b.dataset.pf) { pv.filter = b.dataset.pf; paint(); $(`[data-pf="${pv.filter}"]`)?.focus(); return; }
    if (b.hasAttribute("data-newcode")) return openItemForm();
    if (b.hasAttribute("data-editprofile")) return openProfileForm();
    if (b.hasAttribute("data-copyprofile")) return PC().copy(location.href, l.linkCopied);
    if (b.hasAttribute("data-signout")) { await Cloud.signOut(); PC().toast(l.signedOut); return PC().go("home", 1); }
    if (b.dataset.vis) { const to = b.dataset.to; return patchItem(b.dataset.vis, { visibility: to }, to === "public" ? l.nowPublic : l.nowPrivate); }
    if (b.dataset.like) { const it = pv.items.find((x) => x.id === b.dataset.like); return patchItem(b.dataset.like, { liked: !(it && it.liked) }); }
    if (b.dataset.edit) { const it = pv.items.find((x) => x.id === b.dataset.edit); return it && openItemForm(it); }
    if (b.dataset.del) {
      if (b.dataset.armed !== "1") {
        b.dataset.armed = "1"; b.classList.add("armed");
        b.innerHTML = `${ic("trash", "ic-s")} ${l.removeSure}`;
        setTimeout(() => { if (b.isConnected) { b.dataset.armed = ""; b.classList.remove("armed"); b.innerHTML = ic("trash", "ic-s"); } }, 3000);
        return;
      }
      return removeItem(b.dataset.del);
    }
    if (b.dataset.run) { const it = pv.items.find((x) => x.id === b.dataset.run); const host = b.closest(".stage"); if (it) mountSandbox(host, it); return; }
    if (b.dataset.cpitem) {
      const it = pv.items.find((x) => x.id === b.dataset.cpitem); if (!it) return;
      const k = b.dataset.k;
      const text = k === "all" ? `<!doctype html>\n<html><head><meta charset="utf-8"><style>\n${it.css || ""}\n</style></head>\n<body>\n${it.html || ""}\n<script>\n${it.js || ""}\n<\/script>\n</body></html>` : it[k] || "";
      await PC().copy(text, l.copied);
      if (!b.dataset.label) b.dataset.label = b.textContent;
      b.textContent = PC().L().copiedShort; b.classList.add("is-copied");
      setTimeout(() => { b.textContent = b.dataset.label; b.classList.remove("is-copied"); }, 1200);
      return;
    }
    if (b.hasAttribute("data-try")) {
      const f = $("#itemform"), host = $("#tryhost"); if (!f || !host) return;
      const v = Object.fromEntries(new FormData(f)); host.hidden = false; mountSandbox(host, v); return;
    }
  });

  document.addEventListener("change", (e) => {
    if (e.target.name === "visibility") { const w = $(".pubwarn"); if (w) w.hidden = e.target.value !== "public"; }
  });
  document.addEventListener("input", (e) => {
    if (e.target.name === "handle" && !e.target.readOnly) e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
  });

  document.addEventListener("submit", async (e) => {
    const f = e.target, l = t();
    if (!["loginform", "profileform", "itemform"].includes(f.id)) return;
    e.preventDefault();
    const v = Object.fromEntries(new FormData(f));
    const btn = $('[type="submit"]', f); btn.disabled = true;
    try {
      if (f.id === "loginform") {
        say(l.sending); await Cloud.signIn(v.email.trim()); say(l.sent(v.email.trim()));
      } else if (f.id === "profileform") {
        const handle = (v.handle || "").toLowerCase();
        const creating = !me();
        await Cloud.saveProfile({ handle, display_name: (v.display_name || "").trim() || null, bio: (v.bio || "").trim() || null });
        pv.handle = null; // 让主页重新加载
        $("#dlg").close();
        await loadMine(); updateAcct();
        if (creating || PC().S.view === "profile") openProfile(handle);
      } else {
        if (!(v.html || "").trim() && !(v.css || "").trim() && !(v.js || "").trim()) { say(l.needCode, true); btn.disabled = false; return; }
        const base = f.dataset.id ? pv.items.find((x) => x.id === f.dataset.id) || mine.items.find((x) => x.id === f.dataset.id) : { kind: "custom" };
        await Cloud.saveItem({ ...base, kind: "custom", title: v.title.trim(), description: (v.description || "").trim() || null, html: v.html || null, css: v.css || null, js: v.js || null, visibility: v.visibility === "public" ? "public" : "private" });
        $("#dlg").close();
        await loadMine();
        if (me()) { pv.handle = null; if (PC().S.view === "profile" && PC().S.u === me().handle) loadProfile(); else openProfile(me().handle); }
        PC().toast(PC().S.lang === "zh" ? "已保存" : "Saved");
      }
    } catch (err) {
      say(err && err.code === "23505" ? l.taken : l.err(errMsg(err)), true);
    }
    btn.disabled = false;
  });

  // ---------- 对外接口 ----------
  window.PCCloud = {
    saveBtn, forkBtn,
    detailBtns: (id) => (Cloud.enabled ? `<div class="row dlg-save">${saveBtn(id)}${forkBtn(id)}</div>` : ""),
    view,
    afterRender() {
      updateAcct();
      if (PC().S.view === "profile") loadProfile();
    },
  };

  Cloud.onChange(async () => {
    pv.handle = null;
    await loadMine();
    updateAcct(); refreshHearts();
    if (PC().S.view === "profile") loadProfile();
    // 刚用邮件链接登录回来、还没起名字：直接引导起名字
    if (uid() && !me() && !Cloud.profileError && (!$("#dlg").open || $("#loginform"))) openProfileForm();
  });
})();
