// PurrfectCat UIUX Choice
// 两部分：动效库（搜索 + 筛选）和按功能找（选要做的事 → 按时刻对比动效 → 拿结果）
(function () {
  const C = window.CONTENT;
  const PV = window.PREVIEWS;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = document.documentElement;
  const app = $("#app");
  const CATS = ["feedback", "data", "decor", "nav"];
  const REPO_URL = "https://github.com/qic034-collab/motion-library-bundles";

  // ---------- 界面文字 ----------
  const UI = {
    zh: {
      lang: "EN", theme: { light: "浅色", dark: "深色" }, rm: "减弱动效",
      homeH1: "这按钮，有点东西。",
      homeLead: (n) => `${n} 个网页动效，挑好就能拿到给 AI 的提示词和代码。`,
      notes: ["每个动效都有减弱方案", "中英双语", "免费开源"],
      libT: "动效库", libD: (n) => `随便逛逛找灵感：全部 ${n} 个动效，按类型筛选、搜索。`, libBtn: "打开动效库",
      funcT: "我要设计……", funcD: "已经知道要做什么？选一个按钮、弹窗、登录页或结账流程，只看它能用的动效，最后拿到整套提示词。", funcBtn: "开始设计",
      quick: "直接进入：",
      fSteps: ["选元素", "挑动效", "拿结果"], fSubs: ["你要设计什么", "同组并排对比", "提示词和代码"],
      lSteps: ["动效库", "拿结果"], lSubs: ["筛选、预览、复制", "提示词和代码"],
      fH1: ["你要设计什么？", "挑动效", "你的方案"],
      fLead: [
        "从小到大分四层：组件、板块、整页、流程。勾选你要设计的，可以多选。灰色的还在建设中。",
        "同一组是同一件事的不同做法，放在一起对比。悬停预览，勾选加入方案，点按钮直接复制。",
        "复制提示词给 AI，或下载能直接打开的 HTML。",
      ],
      lH1: ["动效库", "你的动效清单"],
      lLead: ["按类型筛选或搜索。悬停预览，点按钮直接复制；想要一份完整清单就勾选，最后一起拿。", "复制提示词给 AI，或下载所有动效的代码（Markdown 文件）。"],
      siteFilter: "我在做：", allSites: "全部",
      soon: "建设中", seeReq: "看需求", hideReq: "收起", selAll: "全部选上", selNone: "全部取消",
      motionsN: (n) => `${n} 个动效`,
      home: "回到首页", themeSearch: "搜索元素，比如：弹窗、登录、价格", soonN: (n) => `还有 ${n} 个建设中`, readyN: (n) => `${n} 个可用`, noTheme: "没有找到这个元素。", all: "全部", allTypes: "全部类型", catLabel: "动效大类", typeLabel: "类型：", copiedShort: "已复制 ✓", search: "搜索动效名称或效果", empty: "没有符合条件的动效。",
      helpLabel: "这一页是做什么的", tryKw: "试试：", original: "原创", srcPrefix: "参考 ", recOnly: "只看推荐", recWhy: "推荐的标准：几乎所有页面都用得上、减弱动效方案完整、不会抢走内容的注意力。每个类型挑 1–2 个，排在最前面。", pickOne: "选一个", pickMany: "可多选", rec: "推荐", pickRec: "全部选推荐", pickRecHint: "不知道选哪个？", loop: "自动循环播放", loopWhy: "打开后，屏幕上看得到的动效会一直重复播放，方便并排比较，不用一张张悬停。会一直动，看完记得关掉。", recDone: "已选上推荐的动效",
      play: "播放预览", select: "选用", copied: (w) => `已复制${w}`, prompt: "AI 提示词",
      back: "上一步", next: "下一步", toResult: "生成方案", restart: "重新开始", restartConfirm: "再点一次，清空所有选择",
      sumF: (f, m) => `<b>${f}</b> 个元素 · <b>${m}</b> 个动效`, sumL: (m) => `已选 <b>${m}</b> 个动效`,
      duration: "时长", trigger: "触发", whenUse: "什么时候用", reduced: "减弱动效时", tips: "设计要点", code: "代码",
      close: "关闭", copy: "复制", rmCss: "减弱动效 CSS", refBy: "效果参考：", refNote: "用原生 HTML/CSS/JS 独立实现，可直接使用",
      promptTitle: "提示词", ctxLabel: "你的网站是做什么的？（选填）", ctxPh: "例如：Khan Academy 的代数练习页，给高中生用，希望他们做完一题还想继续做下一题", ctxHint: "写了会放进提示词开头，AI 更知道该做成什么样。", promptSubF: "复制给 Claude 或其他 AI，它会按这些功能和动效帮你写页面。", promptSubL: "复制给 AI，让它把这些动效加进你的页面。",
      codeTitle: "代码", codeSubF: "一个 HTML 文件，双击就能打开。有完整代码的功能和动效已经接好；还没写好代码的功能留了占位。示例内容目前是中文。",
      codeSubL: "一个 Markdown 文件，包含设计 token、每个动效的 HTML / CSS / JS 和减弱动效代码。",
      download: "下载 HTML", downloadMd: "下载代码（.md）", showCode: "查看代码", hideCode: "收起代码",
      share: "复制分享链接", shareDone: "链接已复制，打开就是同样的选择",
      checkT: "上线前检查清单", checkD: "给设计和开发逐项核对：功能该有的东西都有了吗？动效在减弱模式下替换对了吗？",
      rmLine: "♿ 减弱时：", sectionNeed: "要有：",
      other: "其他",
      noFunc: "先在上一步选至少一个元素。",
      rules: [
        "每个动效都要写 @media (prefers-reduced-motion: reduce) 的减弱方案，按「减弱动效时」的说明替代，不能只是删掉。",
        "颜色、圆角、间距、动效时长统一用 CSS 变量。",
        "动画只动 transform 和 opacity，不要动 width、top、margin。",
        "保留无障碍：语义化 HTML、键盘能操作、聚焦状态可见；状态要有文字，不能只靠颜色或动画。",
        "自动播放或循环超过 5 秒的内容，要有暂停按钮。",
        "如果你装了 PurrfectCat-UIUX_choice skill（Claude 可以安装的能力包），请优先使用 skill 里的代码和规则；没装的话忽略这一条。",
      ],
    },
    en: {
      lang: "中文", theme: { light: "Light", dark: "Dark" }, rm: "Reduce motion",
      homeH1: "Not Your Average Button.",
      homeLead: (n) => `${n} UI motions. Pick the ones you like and get a ready-to-paste AI prompt and code.`,
      notes: ["Every motion has a reduced-motion version", "Chinese & English", "Free and open source"],
      libT: "Motion library", libD: (n) => `Browse for ideas: all ${n} motions, filter by type or search.`, libBtn: "Open the library",
      funcT: "I'm designing…", funcD: "Know what you're building? Pick a button, a modal, a sign-in page or a checkout flow, see only the motions for it, and get one prompt for all of them.", funcBtn: "Start designing",
      quick: "Jump in: ",
      fSteps: ["Elements", "Motions", "Result"], fSubs: ["What you're designing", "Compare side by side", "Prompt and code"],
      lSteps: ["Library", "Result"], lSubs: ["Filter, preview, copy", "Prompt and code"],
      fH1: ["What are you designing?", "Pick motions", "Your plan"],
      fLead: [
        "Four layers from small to large: components, sections, pages and flows. Tick what you're designing; pick as many as you like. Gray ones are coming soon.",
        "Each group holds different ways to do the same thing, side by side. Hover to preview, tick to add, tap a button to copy.",
        "Copy the prompt into an AI, or download an HTML file that opens right away.",
      ],
      lH1: ["Motion library", "Your motion list"],
      lLead: ["Filter by type or search. Hover to preview and tap a button to copy; tick motions if you want them all in one list.", "Copy the prompt into an AI, or download the code for every motion (a Markdown file)."],
      siteFilter: "I'm building: ", allSites: "All",
      soon: "Coming soon", seeReq: "See spec", hideReq: "Hide", selAll: "Select all", selNone: "Clear all",
      motionsN: (n) => `${n} motions`,
      home: "Home", themeSearch: "Search elements, e.g. modal, sign-in, pricing", soonN: (n) => `${n} more coming soon`, readyN: (n) => `${n} ready`, noTheme: "No element found.", all: "All", allTypes: "All types", catLabel: "Motion categories", typeLabel: "Type: ", copiedShort: "Copied ✓", search: "Search motion names or effects", empty: "No motions match.",
      helpLabel: "What is this step for?", tryKw: "Try: ", original: "Original", srcPrefix: "Inspired by ", recOnly: "Recommended only", recWhy: "Recommended means: fits almost any page, has a complete reduced-motion version, and never steals attention from content. One or two per type, listed first.", pickOne: "Pick one", pickMany: "Pick any", rec: "Recommended", pickRec: "Select all recommended", pickRecHint: "Not sure what to pick?", loop: "Loop previews", loopWhy: "When on, every motion you can see keeps replaying so you can compare them side by side without hovering. It keeps moving, so turn it off when you are done.", recDone: "Recommended motions selected",
      play: "Play preview", select: "Select", copied: (w) => `Copied ${w}`, prompt: "AI prompt",
      back: "Back", next: "Next", toResult: "Build my plan", restart: "Start over", restartConfirm: "Tap again to clear everything",
      sumF: (f, m) => `<b>${f}</b> elements · <b>${m}</b> motions`, sumL: (m) => `<b>${m}</b> motions selected`,
      duration: "Duration", trigger: "Trigger", whenUse: "When to use", reduced: "With reduced motion", tips: "Design notes", code: "Code",
      close: "Close", copy: "Copy", rmCss: "Reduced-motion CSS", refBy: "Inspired by: ", refNote: "implemented independently in plain HTML/CSS/JS, ready to use",
      promptTitle: "Prompt", ctxLabel: "What is your site for? (optional)", ctxPh: "e.g. An algebra practice page on Khan Academy for high-school students; we want them to keep going after each question", ctxHint: "It goes at the top of the prompt so the AI knows what to build.", promptSubF: "Paste into Claude or another AI and it will build the page with these features and motions.", promptSubL: "Paste into an AI to add these motions to your page.",
      codeTitle: "Code", codeSubF: "A single HTML file you can double-click. Features with full code and their motions are wired up; features without code yet have placeholders. Sample content is currently in Chinese.",
      codeSubL: "A Markdown file with the design tokens and each motion's HTML / CSS / JS and reduced-motion code.",
      download: "Download HTML", downloadMd: "Download code (.md)", showCode: "Show code", hideCode: "Hide code",
      share: "Copy share link", shareDone: "Link copied — it opens with the same choices",
      checkT: "Pre-launch checklist", checkD: "For design and dev to tick off: does each feature have what it needs, and does each motion switch correctly with reduced motion?",
      rmLine: "♿ Reduced motion: ", sectionNeed: "Needs: ",
      other: "Other",
      noFunc: "Pick at least one feature in the previous step first.",
      rules: [
        "Every motion needs a @media (prefers-reduced-motion: reduce) version that replaces it as described, not just removes it.",
        "Use CSS variables for colors, radius, spacing and motion durations.",
        "Animate only transform and opacity, never width, top or margin.",
        "Keep it accessible: semantic HTML, keyboard operable, visible focus; state must be shown in text, not only color or motion.",
        "Anything that autoplays or loops for more than 5 seconds needs a pause button.",
        "If you have the PurrfectCat-UIUX_choice skill installed (an add-on package for Claude), prefer its code and rules; if not, ignore this line.",
      ],
    },
  };

  // ---------- 图标：Tabler Icons（MIT 许可，https://tabler.io/icons），直接内嵌 SVG ----------
  const ICONS = {
    world: ["M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0", "M3.6 9h16.8", "M3.6 15h16.8", "M11.5 3a17 17 0 0 0 0 18", "M12.5 3a17 17 0 0 1 0 18"],
    sun: ["M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0", "M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"],
    moon: ["M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008"],
    accessible: ["M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", "M10 16.5l2 -3l2 3m-2 -3v-2l3 -1m-6 0l3 1", ["M11.5 7.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0", true]],
    search: ["M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0", "M21 21l-6 -6"],
    shape: ["M3 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "M17 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "M3 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "M17 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "M5 7l0 10", "M7 5l10 0", "M7 19l10 0", "M19 7l0 10"],
    play: ["M7 4v16l13 -8z"],
    check: ["M5 12l5 5l10 -10"],
    arrowR: ["M5 12l14 0", "M13 18l6 -6", "M13 6l6 6"],
    arrowL: ["M5 12l14 0", "M5 12l6 6", "M5 12l6 -6"],
    external: ["M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6", "M11 13l9 -9", "M15 4h5v5"],
    help: ["M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0", "M12 17l0 .01", "M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4"],
    home: ["M5 12l-2 0l9 -9l9 9l-2 0", "M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7", "M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"],
    repeat: ["M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3", "M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3"],
    star: ["M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"],
  };
  const icon = (name, cls = "icon") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name].map((d) => Array.isArray(d) ? `<path d="${d[0]}" fill="currentColor"/>` : `<path d="${d}"/>`).join("")}</svg>`;

  // ---------- 状态（写进网址，方便分享） ----------
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };
  const sysDark = matchMedia("(prefers-color-scheme: dark)");
  const sysRM = matchMedia("(prefers-reduced-motion: reduce)");
  const S = { view: "home", step: 1, f: [], m: [], ft: "all", cat: "all", ty: "all", q: "", lt: "all", tq: "", lang: "zh", ctx: "", u: "" };
  const prefs = { theme: store.get("pc-theme") || "", rm: store.get("pc-rm"), loop: store.get("pc-loop") === "1" };

  function readHash() {
    const p = new URLSearchParams(location.hash.slice(1));
    S.u = (p.get("u") || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 20); // 个人主页 #u=名字
    S.view = S.u ? "profile" : ["func", "lib"].includes(p.get("v")) ? p.get("v") : "home";
    S.f = (p.get("f") || "").split(",").filter((id) => C.sections[id]);
    S.m = (p.get("m") || "").split(",").filter(Boolean);
    S.ft = C.types.some((t) => t.id === p.get("ft")) ? p.get("ft") : "all";
    S.step = Math.min(S.view === "lib" ? 1 : 3, Math.max(1, Number(p.get("step")) || 1));
    S.ctx = (p.get("d") || "").slice(0, 300);
    if (S.view === "func" && !S.f.length) S.step = 1;
    const lang = p.get("lang") || store.get("pc-lang") || (navigator.language.startsWith("zh") ? "zh" : "en");
    S.lang = lang === "en" ? "en" : "zh";
    sortFuncs();
  }
  function writeHash() {
    const p = new URLSearchParams();
    if (S.view === "profile") p.set("u", S.u);
    else if (S.view !== "home") p.set("v", S.view);
    if (S.view === "func" && S.f.length) p.set("f", S.f.join(","));
    if (S.view !== "home" && S.m.length) p.set("m", S.m.join(","));
    if (S.view === "func" && S.ft !== "all") p.set("ft", S.ft);
    if (S.step > 1) p.set("step", S.step);
    if (S.view !== "home" && S.ctx.trim()) p.set("d", S.ctx.trim()); // 分享链接也带上网站描述
    p.set("lang", S.lang);
    history.replaceState(null, "", "#" + p.toString());
  }

  // ---------- 小工具 ----------
  const L = () => UI[S.lang];
  const tx = (o) => (o && typeof o === "object" ? o[S.lang] ?? o.zh : o ?? "");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function md(src) {
    const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`(.+?)`/g, "<code>$1</code>");
    let html = "", list = false;
    for (const line of String(src || "").split("\n")) {
      const li = line.match(/^\s*-\s+(.*)/);
      if (li) { if (!list) { html += "<ul>"; list = true; } html += `<li>${inline(li[1])}</li>`; continue; }
      if (list) { html += "</ul>"; list = false; }
      if (line.trim()) html += `<p>${inline(line)}</p>`;
    }
    return html + (list ? "</ul>" : "");
  }
  const firstLine = (s) => String(s || "").split("\n").map((l) => l.replace(/^\s*-\s+/, "").trim()).filter(Boolean)[0] || "";
  const reducedLine = (m) => firstLine(tx(m.reduced)).replace(/^(替代方式：|Instead: )/, "");
  const notWhen = (m) => (tx(m.use).match(/\*\*(?:不要用：|Don't use:)\*\*\s*(.+)/) || [])[1] || "";
  const isRec = (e) => e.kind === "own" && !!(C.motions[e.id] && C.motions[e.id].rec);
  const recFirst = (arr) => [...arr].sort((a, b) => isRec(b) - isRec(a));
  const recCount = () => Object.values(C.motions).filter((m) => m.rec).length;
  const kwAll = (id) => { const k = C.motions[id] && C.motions[id].kw; return k ? [...k.zh, ...k.en] : []; };
  const KW_CHIPS = { zh: ["光", "流动", "边框", "文字", "悬停", "点击", "循环", "弹窗", "进度", "数字", "滚动"], en: ["light", "flow", "border", "text", "hover", "click", "loop", "dialog", "progress", "number", "scroll"] };
  const kwTags = (id, q) => {
    const k = C.motions[id] && C.motions[id].kw && C.motions[id].kw[S.lang];
    if (!k || !k.length) return "";
    const terms = q.split(/\s+/).filter(Boolean);
    return `<div class="kw" aria-label="${S.lang === "en" ? "Keywords" : "关键词"}">${k.map((w) => `<span class="${terms.some((t) => w.toLowerCase().includes(t)) ? "hit" : ""}">${esc(w)}</span>`).join("")}</div>`;
  };
  const funcOf = (id) => C.functions.find((f) => f.id === id);
  const siteType = () => C.types.find((t) => t.id === S.ft);
  const typeOf = (e) => (e.kind === "own" ? C.motions[e.id].type : e.type);
  const extKey = (e) => `x~${e.lib}~${e.name}`;

  // 页面上的功能顺序：导航、首屏在前，登录、页脚在后
  function sortFuncs() {
    const order = C.themes.map((f) => f.id);
    const rank = (id) => ({ nav: -2, hero: -1, login: 900, footer: 1000 }[id] ?? order.indexOf(id));
    S.f.sort((a, b) => rank(a) - rank(b));
  }

  // 一组功能里的全部动效（去重，记录用在哪些功能、分在哪个组）
  function pool(ids) {
    const map = new Map();
    for (const sid of ids) {
      const sec = C.sections[sid];
      for (const item of sec.motions) {
        const key = typeof item === "string" ? item : extKey(item);
        if (!map.has(key)) {
          map.set(key, typeof item === "string"
            ? { key, kind: "own", id: item, category: C.motions[item].category, sections: [], notes: {} }
            : { key, kind: "ext", ...item, sections: [], notes: {} });
        }
        const e = map.get(key);
        e.sections.push(sid);
        const note = typeof item === "string" ? sec.motion_notes?.[item] : item.note;
        if (note) e.notes[sid] = note;
      }
    }
    return [...map.values()];
  }
  const allPool = () => pool(Object.keys(C.sections));
  const funcPool = () => pool(S.f);
  const selected = () => (S.view === "lib" ? allPool() : funcPool()).filter((e) => S.m.includes(e.key));

  // 一个功能下的分组：栏目里写了「动效分组」就用它，其余按动效类型分
  function groupsFor(sid) {
    const sec = C.sections[sid];
    const entries = pool([sid]);
    const used = new Set();
    const groups = (sec.groups || []).map((g) => {
      const items = g.items.map((id) => entries.find((e) => e.key === id)).filter(Boolean);
      items.forEach((e) => used.add(e.key));
      return { key: sid + ":" + g.id, name: g.name, pick: g.pick, rec: g.rec, items };
    }).filter((g) => g.items.length);
    const rest = entries.filter((e) => !used.has(e.key));
    Object.keys(C.mtypes).forEach((t) => {
      const items = rest.filter((e) => typeOf(e) === t);
      if (items.length) groups.push({ key: sid + ":t:" + t, name: C.mtypes[t].name, pick: "many", rec: [], items });
    });
    return groups;
  }
  const groupByKey = (key) => S.f.flatMap(groupsFor).find((g) => g.key === key);

  // ---------- 偏好 ----------
  function applyPrefs() {
    root.lang = S.lang === "en" ? "en" : "zh-CN";
    root.dataset.theme = prefs.theme || (sysDark.matches ? "dark" : "light");
    root.dataset.rm = (prefs.rm === null ? sysRM.matches : prefs.rm === "1") ? "1" : "0";
    document.title = S.lang === "en" ? "PurrfectCat UIUX Choice — preview and copy web motions" : "PurrfectCat UIUX Choice — 预览、复制网页动效";
    const l = L(), dark = root.dataset.theme === "dark";
    $("#btn-lang").innerHTML = `${icon("world")} ${l.lang}`;
    $("#btn-lang").setAttribute("aria-label", S.lang === "en" ? "切换到中文" : "Switch to English");
    $("#btn-theme").innerHTML = `${icon(dark ? "moon" : "sun")}<span class="lbl">${dark ? l.theme.dark : l.theme.light}</span>`;
    $("#btn-rm").innerHTML = `<span class="dot" aria-hidden="true"></span>${icon("accessible")}<span class="lbl">${l.rm}</span>`;
    $("#btn-rm").setAttribute("aria-pressed", root.dataset.rm === "1");
    $("#btn-rm").setAttribute("aria-label", l.rm);
  }

  // ---------- 渲染 ----------
  function render() {
    applyPrefs();
    writeHash();
    if (typeof tipBtn !== "undefined" && tipBtn) toggleTip(null, false);
    const l = L();
    const F = S.view === "func", H = S.view === "home", PF = S.view === "profile";
    app.dataset.view = S.view;
    const navb = (cur, attr, label, ic) => `<button type="button" class="navbtn" ${attr} ${cur ? 'aria-current="page"' : ""} aria-label="${esc(label)}" title="${esc(label)}">${icon(ic, "ic-s")}</button>`;
    $("#navicons").innerHTML = navb(H, "data-home", l.home, "home") + navb(S.view === "lib", 'data-golib="all"', l.libT, "search") + navb(F, 'data-gofunc=""', l.funcT, "shape");
    const steps = F ? l.fSteps : l.lSteps, subs = F ? l.fSubs : l.lSubs;
    $("#steps").innerHTML = H || PF ? "" : steps.map((name, i) => {
      const n = i + 1, can = !F || n === 1 || S.f.length;
      const cur = n === S.step;
      const helpB = cur ? `<button type="button" class="helpbtn" data-help aria-expanded="false" aria-controls="helpbox" aria-label="${esc(l.helpLabel)}" title="${esc(l.helpLabel)}">${icon("help", "ic-s")}</button>` : "";
      return `<li class="${cur ? "cur" : ""} ${n < S.step ? "done" : ""} ${can ? "" : "disabled"}"><span class="n">${n < S.step ? icon("check", "ic-s") : n}</span>
        <div class="stxt"><span class="nameline"><button type="button" class="stepbtn" data-go="${n}" ${cur ? 'aria-current="step"' : ""} ${can ? "" : "disabled"}>${esc(name)}</button>${helpB}</span><small>${esc(subs[i])}</small></div></li>`;
    }).join("");
    if (H) {
      app.innerHTML = viewHome();
    } else if (PF) {
      $("#helpbox").hidden = true;
      app.innerHTML = window.PCCloud ? PCCloud.view() : "";
    } else {
      const h1 = F ? l.fH1 : l.lH1, lead = F ? l.fLead : l.lLead;
      const head = `<div class="head"><h1 id="h1" tabindex="-1" class="sr-only">${esc(h1[S.step - 1])}</h1></div>`;
      const hb = $("#helpbox");
      hb.hidden = true;
      hb.innerHTML = `<b>${esc(h1[S.step - 1])}</b><p>${esc(lead[S.step - 1])}</p>`;
      const views = F ? [null, viewFuncs, viewFuncMotions, viewResult] : [null, viewLibrary, viewResult];
      app.innerHTML = head + views[S.step]();
    }
    renderBar();
    syncBarH();
    bindPreviews(app);
    placeCatBar();
    if (window.PCCloud) PCCloud.afterRender(); // 账号按钮、个人主页
  }
  // 四大类的下划线滑块：从上一个位置滑到新位置
  function placeCatBar() {
    const wrap = $(".cattabs");
    if (!wrap) return;
    const bar = $(".cattabs__bar", wrap), cur = $('[aria-selected="true"]', wrap);
    if (S._bar) {
      bar.style.transition = "none";
      bar.style.setProperty("--x", S._bar.x + "px");
      bar.style.setProperty("--w", S._bar.w + "px");
      void bar.offsetWidth;
      bar.style.transition = "";
    }
    bar.style.setProperty("--x", cur.offsetLeft + "px");
    bar.style.setProperty("--w", cur.offsetWidth + "px");
    S._bar = { x: cur.offsetLeft, w: cur.offsetWidth };
  }

  function viewHome() {
    const l = L(), n = Object.keys(C.motions).length;
    const ready = ["button", "card", "tabs", "nav", "hero", "login", "quiz", "stats"].map((id) => C.themes.find((t) => t.id === id)).filter(Boolean);
    return `<div class="home">
      <h1 id="h1" tabindex="-1">${esc(l.homeH1)}</h1>
      <p class="home__lead">${esc(l.homeLead(n))}</p>
      <div class="hero-note">${l.notes.map((x, i) => i === 2
        ? `<a class="pill pill-link" href="${REPO_URL}" target="_blank" rel="noopener">${esc(x)} ${icon("external", "ic-s")}</a>`
        : `<span class="pill ${i === 0 ? "ok" : ""}">${i === 0 ? icon("accessible") : ""}${esc(x)}</span>`).join("")}</div>
      <div class="entries">
        <section class="entry-card">
          <div class="entry-card__icon">${icon("search")}</div>
          <h2>${l.libT}</h2><p>${esc(l.libD(n))}</p>
          <div class="entry-card__chips">${CATS.map((c) => `<button type="button" class="chip" data-golib="${c}">${esc(tx(C.categories[c]))}</button>`).join("")}</div>
          <button type="button" class="btn primary" data-golib="all">${l.libBtn} ${icon("arrowR", "ic-s")}</button>
        </section>
        <section class="entry-card">
          <div class="entry-card__icon">${icon("shape")}</div>
          <h2>${l.funcT}</h2><p>${esc(l.funcD)}</p>
          <div class="entry-card__chips"><span class="quick">${l.quick}</span>${ready.map((f) => `<button type="button" class="chip" data-gofunc="${f.id}">${esc(tx(f.name))}</button>`).join("")}</div>
          <button type="button" class="btn primary" data-gofunc="">${l.funcBtn} ${icon("arrowR", "ic-s")}</button>
        </section>
      </div>
      <p class="foot-note">${esc(S.lang === "en" ? "Some effects are inspired by Magic UI, Motion Primitives, Animate UI, Kokonut UI (MIT), React Bits (MIT + Commons Clause), and examples from open-source projects such as anime.js, react-spring, p5.js, matter-js, D3 and Tone.js. All code here is written independently in plain HTML/CSS/JS; none of their code is copied." : "部分效果参考了 Magic UI、Motion Primitives、Animate UI、Kokonut UI（MIT 许可）、React Bits（MIT + Commons Clause），以及 anime.js、react-spring、p5.js、matter-js、D3、Tone.js 等开源项目示例的创意。这里的代码全部用原生 HTML/CSS/JS 独立重写，没有复制它们的代码。")}</p>
    </div>`;
  }

  // ----- 按功能找：第 1 步 -----
  function reqHtml(sec) {
    if (sec.built) return `<div class="req">${md(tx(sec.structure))}</div>`;
    const r = sec.req[S.lang] || sec.req.zh;
    return `<dl class="req">${Object.entries(r).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>`;
  }
  function viewFuncs() {
    const l = L();
    const layers = Object.keys(C.layers);
    const count = (k) => C.themes.filter((t) => k === "all" || t.layer === k);
    const tabs = `<div class="cattabs" role="tablist" aria-label="${l.funcT}">${["all", ...layers].map((k) => `
      <button type="button" role="tab" data-lt="${k}" aria-controls="themes" tabindex="${S.lt === k ? 0 : -1}" aria-selected="${S.lt === k}">${k === "all" ? l.all : esc(tx(C.layers[k]))}<span class="count">${count(k).filter((t) => t.ready).length}</span></button>`).join("")}<span class="cattabs__bar" aria-hidden="true"></span></div>`;
    const search = `<label class="search"><span class="sr-only">${l.themeSearch}</span><input type="search" id="tq" placeholder="${l.themeSearch}" value="${esc(S.tq)}"></label>`;
    return `<div class="tabrow">${tabs}${search}</div>` + `<div id="themes" role="tabpanel" aria-label="${esc(l.funcT)}">${themeResults()}</div>`;
  }
  function themeResults() {
    const l = L(), q = S.tq.trim().toLowerCase();
    const list = C.themes.filter((t) => (S.lt === "all" || t.layer === S.lt) && (!q || [t.name.zh, t.name.en, t.group.zh, t.group.en, t.id].join(" ").toLowerCase().includes(q)));
    if (!list.length) return `<p class="empty">${l.noTheme}</p><div class="spacer"></div>`;
    const card = (t) => {
      const sec = C.sections[t.section], on = S.f.includes(t.id);
      const sum = tx(t.summary);
      return `<div class="card pick tcard ${on ? "is-on" : ""}">
        <input type="checkbox" value="${t.id}" data-role="func" ${on ? "checked" : ""} aria-label="${esc(tx(t.name))}">
        <span class="check-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg></span>
        <h3>${esc(tx(t.name))}</h3>
        ${sum ? `<p>${esc(sum)}</p>` : ""}
        <div class="meta"><span class="pill accent">${l.motionsN(sec.motions.length)}</span></div>
      </div>`;
    };
    return Object.keys(C.layers).filter((k) => list.some((t) => t.layer === k)).map((k) => {
      const inLayer = list.filter((t) => t.layer === k);
      const groups = [...new Set(inLayer.map((t) => t.group.zh))];
      return `<div class="group-title cat"><h2>${esc(tx(C.layers[k]))}</h2>${tip(C.layers[k].desc)}</div>
        ${groups.map((g) => {
          const items = inLayer.filter((t) => t.group.zh === g);
          const ready = items.filter((t) => t.ready), soon = items.filter((t) => !t.ready);
          const showSoon = q && !ready.length; // 搜索时如果只搜到建设中的，直接展开
          return `<div class="mgroup"><h3 class="mgroup__title">${esc(tx(items[0].group))} <small>${l.readyN(ready.length, items.length)}</small></h3>
            ${ready.length ? `<div class="grid flush tgrid">${ready.map(card).join("")}</div>` : ""}
            ${soon.length ? `<details class="soon" ${showSoon ? "open" : ""}><summary>${l.soonN(soon.length)}</summary>
              <div class="soon__list">${soon.map((t) => `<span class="pill">${esc(tx(t.name))}</span>`).join("")}</div></details>` : ""}
          </div>`;
        }).join("")}`;
    }).join("") + `<div class="spacer"></div>`;
  }

  // ----- 卡片 -----
  function motionCard(e, opts = {}) {
    const l = L(), on = S.m.includes(e.key);
    if (e.kind === "ext") {
      const lib = C.libs[e.lib];
      return `<div class="card pick mcard ext ${on ? "is-on" : ""}">
        <div class="stage"><span>${esc(lib.name)}</span></div>
        <label class="pickbox" title="${l.select}"><input type="checkbox" value="${esc(e.key)}" data-role="motion" ${on ? "checked" : ""} aria-label="${l.select} ${esc(e.name)}">
        <span class="check-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg></span></label>
        <div class="mbody"><span class="mname">${esc(e.name)}</span></div>
        <div class="copies"><a class="cbtn" href="${lib.url}" target="_blank" rel="noopener">${esc(lib.name)} ${icon("external", "ic-s")}</a></div>
      </div>`;
    }
    const m = C.motions[e.id];
    const btns = [["prompt", l.prompt], ["html", "HTML", m.html], ["css", "CSS", m.css], ["js", "JS", m.js]].filter((b) => b.length === 2 || b[2]);
    return `<div class="card pick mcard ${on ? "is-on" : ""}" data-pv="${e.id}" data-cat="${m.category}">
      <div class="stage" data-stage="${e.id}">${PV[e.id].html()}
        <button type="button" class="playbtn" data-play="${e.id}" aria-label="${l.play}：${esc(tx(m.name))}">${icon("play", "ic-s")}</button></div>
      ${window.PCCloud ? PCCloud.saveBtn(e.id) : ""}
      <label class="pickbox" title="${l.select}"><input type="checkbox" value="${e.key}" data-role="motion" ${on ? "checked" : ""} aria-label="${l.select} ${esc(tx(m.name))}"${opts.group ? ` data-group="${opts.group}"` : ""}>
      <span class="check-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg></span></label>
      <div class="mbody"><button type="button" class="mname" data-detail="${e.id}">${esc(tx(m.name))}</button>${opts.rec ? `<span class="pill ok rec">${icon("star", "ic-s")} ${l.rec}</span>` : ""}</div>
      ${tx(m.summary) ? `<p class="msum">${esc(tx(m.summary))}</p>` : ""}
      ${opts.q ? kwTags(e.id, opts.q) : ""}
      <div class="copies">${btns.map(([k, label]) => `<button type="button" class="cbtn" data-cp="${k}" data-id="${e.id}">${label}</button>`).join("")}</div>
      <div class="mmeta"><span class="mmeta__src"${m.ref ? ` title="${esc(l.srcPrefix + m.ref)}"` : ""}>${m.ref ? esc(l.srcPrefix + m.ref) : l.original}</span><span class="mmeta__cat"><i aria-hidden="true"></i>${esc(S.lang === "en" ? C.categories[m.category].en : C.categories[m.category].zh)}</span></div>
    </div>`;
  }

  // 「自动循环播放」开关：访客自己决定要不要让预览一直动（默认关）
  const loopBtn = () => `<button type="button" class="chip loopflt" data-loop aria-pressed="${prefs.loop}">${icon("repeat", "ic-s")} ${L().loop}</button>${tip(L().loopWhy)}`;

  // ----- 按功能找：第 2 步 -----
  function viewFuncMotions() {
    const l = L();
    if (!S.f.length) return `<p>${l.noFunc}</p><div class="spacer"></div>`;
    const hasRec = S.f.some((sid) => groupsFor(sid).some((g) => g.rec.length));
    return `<div class="mtools">${hasRec ? `<span class="mtools__hint">${l.pickRecHint}</span><button type="button" class="btn primary sm" data-pickrec>${icon("star", "ic-s")} ${l.pickRec}</button>` : ""}${loopBtn()}</div>`
      + S.f.map((sid) => `<section class="fblock" aria-labelledby="fb-${sid}">
        <h2 class="fblock__title" id="fb-${sid}">${esc(tx((C.themes.find((t) => t.id === sid) || C.sections[sid]).name))}</h2>
        ${groupsFor(sid).map((g) => `<div class="mgroup">
          <h3 class="mgroup__title">${esc(tx(g.name))} <span class="pill ${g.pick === "one" ? "accent" : ""}">${g.pick === "one" ? l.pickOne : l.pickMany}</span></h3>
          <div class="cards">${g.items.map((e) => motionCard(e, { group: g.pick === "one" ? g.key : "", rec: g.rec.includes(e.key) })).join("")}</div></div>`).join("")}
      </section>`).join("") + `<div class="spacer"></div>`;
  }

  // ----- 动效库 -----
  function viewLibrary() {
    const l = L(), all = allPool();
    const count = (c) => all.filter((e) => c === "all" || e.category === c).length;
    const typeIds = Object.keys(C.mtypes).filter((t) => (S.cat === "all" || C.mtypes[t].category === S.cat) && all.some((e) => typeOf(e) === t));
    if (S.ty !== "all" && !typeIds.includes(S.ty)) S.ty = "all";
    return `<div class="libhead"><div class="cattabs" role="tablist" aria-label="${l.catLabel}">${["all", ...CATS].map((c) => `
        <button type="button" role="tab" data-bcat="${c}" aria-controls="results" tabindex="${S.cat === c ? 0 : -1}" aria-selected="${S.cat === c}">${c === "all" ? l.all : esc(tx(C.categories[c]))}<span class="count">${count(c)}</span></button>`).join("")}<span class="cattabs__bar" aria-hidden="true"></span></div>
      <div class="filters typefilters"><span class="filters__label">${l.typeLabel}</span>${["all", ...typeIds].map((t) => `
        <button type="button" class="chip" data-ty="${t}" aria-pressed="${S.ty === t}">${t === "all" ? l.allTypes : esc(tx(C.mtypes[t].name))}</button>`).join("")}</div>
      <label class="search"><span class="sr-only">${l.search}</span><input type="search" id="bq" placeholder="${l.search}" value="${esc(S.q)}"></label>
      <div class="kwchips">${loopBtn()}<span class="kwchips__sep" aria-hidden="true"></span><button type="button" class="chip recflt" data-recflt aria-pressed="${!!S.recOnly}">${icon("star", "ic-s")} ${l.recOnly} · ${recCount()}</button>${tip(l.recWhy)}<span class="kwchips__sep" aria-hidden="true"></span><span class="kwchips__label">${l.tryKw}</span>${KW_CHIPS[S.lang].map((k) => `<button type="button" class="chip" data-kw="${k}" aria-pressed="${S.q.trim().toLowerCase() === k}">${k}</button>`).join("")}</div>
      </div>
      <div id="results" role="tabpanel" aria-label="${esc(l.catLabel)}">${libResults()}</div>`;
  }
  function libResults() {
    const l = L(), q = S.q.trim().toLowerCase(), terms = q.split(/\s+/).filter(Boolean);
    const list = allPool().filter((e) => {
      if (S.cat !== "all" && e.category !== S.cat) return false;
      if (S.ty !== "all" && typeOf(e) !== S.ty) return false;
      if (S.recOnly && !isRec(e)) return false;
      if (!q) return true;
      const hay = e.kind === "own"
        ? [C.motions[e.id].name.zh, C.motions[e.id].name.en, C.motions[e.id].summary.zh, C.motions[e.id].summary.en, e.id, ...kwAll(e.id)]
        : [e.name, C.libs[e.lib].name];
      const text = hay.join(" ").toLowerCase();
      return terms.every((w) => text.includes(w));
    });
    if (!list.length) return `<p class="empty">${l.empty}</p><div class="spacer"></div>`;
    return CATS.filter((c) => list.some((e) => e.category === c)).map((c) => `
      <div class="group-title cat"><h2>${esc(tx(C.categories[c]))}</h2>${tip(C.categories[c].desc)}</div>
      ${Object.keys(C.mtypes).filter((t) => C.mtypes[t].category === c && list.some((e) => typeOf(e) === t)).map((t) => `
        <div class="mgroup"><h3 class="mgroup__title">${esc(tx(C.mtypes[t].name))} ${tip(C.mtypes[t].desc)}</h3>
        <div class="cards">${recFirst(list.filter((e) => typeOf(e) === t)).map((e) => motionCard(e, { q, rec: isRec(e) })).join("")}</div></div>`).join("")}`).join("")
      + `<div class="spacer"></div>`;
  }

  // ----- 底栏 -----
  function syncBarH() {
    const bar = $("#bar");
    root.style.setProperty("--bar-h", bar.hidden ? "0px" : bar.offsetHeight + "px");
  }
  addEventListener("resize", () => syncBarH());
  function renderBar() {
    const l = L(), bar = $("#bar");
    if (S.view === "home" || S.view === "lib" || S.view === "profile") { bar.hidden = true; return; }
    bar.hidden = false;
    const F = S.view === "func", last = F ? 3 : 2;
    const n = selected().length;
    const sum = F ? l.sumF(S.f.length, n) : l.sumL(n);
    const canNext = F ? (S.step === 1 ? S.f.length > 0 : true) : n > 0;
    // 最后一步：「重新开始」不放在「生成方案」原来的位置，改成左边的弱按钮，并且要点两次才清空
    const isLast = S.step === last;
    $("#barsum").innerHTML = `<div class="sum" aria-live="polite">${sum}</div>
      ${isLast ? `<button type="button" class="btn quiet" data-restart>${l.restart}</button>` : ""}
      ${S.step > 1 ? `<button type="button" class="btn" data-go="${S.step - 1}">${l.back}</button>` : ""}
      ${!isLast ? `<button type="button" class="btn primary" data-go="${S.step + 1}" ${canNext ? "" : "disabled"}>${S.step === last - 1 ? l.toResult : l.next}</button>` : ""}`;
  }

  // ---------- 预览 ----------
  const timers = new WeakMap();
  function startPreview(stage) {
    const p = PV[stage.dataset.stage];
    if (!p || timers.has(stage)) return;
    p.play(stage);
    timers.set(stage, setInterval(() => {
      if (!p.loop) p.stop(stage);
      requestAnimationFrame(() => p.play(stage));
    }, p.loop || 1900));
  }
  function stopPreview(stage) {
    clearInterval(timers.get(stage));
    timers.delete(stage);
    PV[stage.dataset.stage]?.stop(stage);
  }
  // 循环模式：只让滚到屏幕里的卡片动，滚出去就停，省电也不卡
  let loopIO = null;
  function applyLoop(scope = app) {
    if (loopIO) { loopIO.disconnect(); loopIO = null; }
    const stages = $$("[data-pv] .stage", scope);
    if (!prefs.loop) { stages.forEach(stopPreview); return; }
    if (!("IntersectionObserver" in window)) { stages.forEach(startPreview); return; }
    loopIO = new IntersectionObserver((entries) => entries.forEach((en) => (en.isIntersecting ? startPreview(en.target) : stopPreview(en.target))), { rootMargin: "100px" });
    stages.forEach((st) => loopIO.observe(st));
  }
  function bindPreviews(scope) {
    $$("[data-stage]", scope).forEach((st) => PV[st.dataset.stage]?.init && PV[st.dataset.stage].stop(st));
    $$("[data-pv]", scope).forEach((card) => {
      const stage = $(".stage", card);
      card.addEventListener("mouseenter", () => startPreview(stage));
      card.addEventListener("mouseleave", () => { if (!prefs.loop) stopPreview(stage); });
      card.addEventListener("focusin", () => startPreview(stage));
      card.addEventListener("focusout", (e) => { if (!prefs.loop && !card.contains(e.relatedTarget)) stopPreview(stage); });
    });
    applyLoop(app);
  }

  // ---------- 详情（点名字） ----------
  function showDetail(id) {
    const l = L(), m = C.motions[id], dlg = $("#dlg");
    const codes = [["HTML", m.html], ["CSS", m.css], ["JS", m.js], [l.rmCss, m.rmcss]].filter(([, c]) => c);
    dlg.innerHTML = `<div class="dlg-head"><div><h2 id="dlg-title">${esc(tx(m.name))}</h2><p>${esc(tx(C.mtypes[m.type].name))} · ${l.duration} ${esc(tx(m.duration))} · ${l.trigger}：${esc(tx(m.trigger))}</p></div>
      <button type="button" class="btn sm" data-close>${l.close}</button></div>
      <div class="dlg-body">
        <div class="stage" data-stage="${id}">${PV[id].html()}</div>
        <div class="copies dlg-copies">${[["prompt", l.prompt], ["html", "HTML", m.html], ["css", "CSS", m.css], ["js", "JS", m.js]].filter((x) => x.length === 2 || x[2]).map(([k, label]) => `<button type="button" class="cbtn" data-cp="${k}" data-id="${id}">${label}</button>`).join("")}</div>
        ${window.PCCloud ? PCCloud.detailBtns(id) : ""}
        ${m.ref ? `<p class="refline">${l.refBy}${esc(m.ref)} · ${l.refNote}</p>` : ""}
        <h3>${l.whenUse}</h3>${md(tx(m.use))}
        <h3 class="with-icon">${icon("accessible")}${l.reduced}</h3>${md(tx(m.reduced))}
        <h3>${l.tips}</h3>${md(tx(m.tips))}
        <h3>${l.code}</h3>
        <div class="codetabs" role="tablist">${codes.map(([n], i) => `<button type="button" role="tab" data-code="${i}" aria-controls="dlg-code" tabindex="${i === 0 ? 0 : -1}" aria-selected="${i === 0}">${esc(n)}</button>`).join("")}</div>
        <pre tabindex="0" id="dlg-code" role="tabpanel"></pre>
        <div class="row"><button type="button" class="btn sm" data-copycode>${l.copy}</button></div>
      </div>`;
    dlg.setAttribute("aria-labelledby", "dlg-title");
    const pre = $("#dlg-code", dlg);
    const setCode = (i) => { pre.textContent = codes[i][1]; $$("[data-code]", dlg).forEach((b) => { const on = b.dataset.code == i; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; }); };
    setCode(0);
    dlg.onclick = (e) => {
      if (e.target === dlg || e.target.closest("[data-close]")) dlg.close();
      const c = e.target.closest("[data-code]"); if (c) setCode(Number(c.dataset.code));
      if (e.target.closest("[data-copycode]")) copy(pre.textContent);
      const cp = e.target.closest("[data-cp]");
      if (cp) {
        copyMotion(cp.dataset.cp, cp.dataset.id);
        if (!cp.dataset.label) cp.dataset.label = cp.textContent;
        cp.textContent = L().copiedShort; cp.classList.add("is-copied");
        setTimeout(() => { cp.textContent = cp.dataset.label; cp.classList.remove("is-copied"); }, 1200);
      }
    };
    const stage = $(".stage", dlg);
    dlg.addEventListener("close", () => stopPreview(stage), { once: true });
    dlg.showModal();
    if (PV[id].init) PV[id].stop(stage);
    startPreview(stage);
  }

  // ---------- 复制单个动效 ----------
  function motionPrompt(id) {
    const zh = S.lang === "zh", m = C.motions[id], nw = notWhen(m);
    return [
      zh ? `请在我的网页里加入「${m.name.zh}」动效。` : `Please add the "${m.name.en}" motion to my web page.`,
      `${zh ? "效果" : "Effect"}：${tx(m.summary)}`,
      `${zh ? "触发" : "Trigger"}：${tx(m.trigger)}；${zh ? "时长" : "duration"}：${tx(m.duration)}`,
      nw ? `${zh ? "不要用在" : "Don't use"}：${nw}` : "",
      `${zh ? "减弱动效时" : "With reduced motion"}：${reducedLine(m)}`,
      "",
      ...L().rules.slice(0, 4).map((r) => "- " + r),
    ].filter((x) => x !== "").join("\n");
  }
  function copyMotion(kind, id) {
    const m = C.motions[id];
    const text = { prompt: () => motionPrompt(id), html: () => m.html, css: () => [m.css, m.rmcss].filter(Boolean).join("\n\n"), js: () => m.js }[kind]();
    const label = { prompt: L().prompt, html: " HTML", css: " CSS", js: " JS" }[kind];
    copy(text, L().copied(S.lang === "zh" ? label.trim() : label.trim()));
  }

  // ---------- 结果 ----------
  function buildPrompt() {
    const zh = S.lang === "zh", st = siteType(), l = L(), out = [];
    out.push(st
      ? (zh ? `请帮我做一个「${st.name.zh}」网站的页面（${st.example.zh}）。核心目标：${st.summary.zh}。` : `Please build a page for a ${st.name.en} site (${st.example.en}). Core goal: ${st.summary.en}.`)
      : (zh ? "请帮我做一个网页，包含下面这些功能和动效。" : "Please build a web page with the following features and motions."));
    if (S.ctx.trim()) out.push("", (zh ? "关于这个网站：" : "About this site: ") + S.ctx.trim());
    out.push("", zh ? "## 功能" : "## Features");
    S.f.forEach((sid, i) => {
      const s = C.sections[sid];
      out.push(`${i + 1}. ${tx((C.themes.find((t) => t.id === sid) || s).name)} — ${tx(s.summary)}`);
      if (s.built) out.push(`   ${zh ? "结构" : "Structure"}：${tx(s.structure)}`);
      else Object.entries(s.req[S.lang]).forEach(([k, v]) => out.push(`   - ${k}：${v}`));
    });
    out.push("", zh ? "## 动效" : "## Motions");
    const mos = selected();
    if (!mos.length) out.push(zh ? "不需要额外动效，只保留基本的悬停和聚焦状态。" : "No extra motion; keep basic hover and focus states only.");
    mos.forEach((e) => {
      const where = e.sections.filter((sid) => S.f.includes(sid)).map((sid) => tx(C.sections[sid].name) + (e.notes[sid] ? (zh ? `（${tx(e.notes[sid])}）` : ` (${tx(e.notes[sid])})`) : "")).join(zh ? "、" : ", ");
      if (e.kind === "own") {
        const m = C.motions[e.id];
        out.push(`- ${tx(m.name)}（${tx(C.mtypes[m.type].name)}，${tx(m.duration)}，${tx(m.trigger)}）：${tx(m.summary)}。${zh ? "用在" : "Used in"}：${where}`);
        out.push(`  ${zh ? "减弱动效时" : "With reduced motion"}：${reducedLine(m)}`);
      } else {
        out.push(`- ${C.libs[e.lib].name} · ${e.name}（${C.libs[e.lib].url}）。${zh ? "用在" : "Used in"}：${where}`);
      }
    });
    out.push("", zh ? "## 必须遵守" : "## Rules");
    l.rules.forEach((r) => out.push("- " + r));
    return out.join("\n");
  }
  function buildLibPrompt() {
    const zh = S.lang === "zh", out = [];
    out.push(zh ? "请帮我在网页里加入下面这些动效。先看我现有的页面结构，把每个动效挂到合适的元素上。" : "Please add the following motions to my web page. Look at my existing markup first and attach each motion to the right element.");
    if (S.ctx.trim()) out.push("", (zh ? "关于这个网站：" : "About this site: ") + S.ctx.trim());
    out.push("", zh ? "## 动效" : "## Motions");
    selected().forEach((e) => {
      if (e.kind !== "own") { out.push(`- ${C.libs[e.lib].name} · ${e.name}（${C.libs[e.lib].url}）`); return; }
      const m = C.motions[e.id], nw = notWhen(m);
      out.push(`- ${tx(m.name)}（${tx(C.mtypes[m.type].name)}，${tx(m.duration)}，${tx(m.trigger)}）：${tx(m.summary)}`);
      if (nw) out.push(`  ${zh ? "不要用在" : "Don't use"}：${nw}`);
      out.push(`  ${zh ? "减弱动效时" : "With reduced motion"}：${reducedLine(m)}`);
    });
    out.push("", zh ? "## 必须遵守" : "## Rules");
    L().rules.forEach((r) => out.push("- " + r));
    return out.join("\n");
  }
  function buildMarkdown() {
    const zh = S.lang === "zh", l = L(), out = [];
    out.push(`# ${zh ? "动效代码" : "Motion code"} · PurrfectCat UIUX Choice`, "");
    out.push(zh ? "所有动效都用下面这组 CSS 变量，先把它放进你的样式表。" : "All motions use these CSS variables; add them to your stylesheet first.", "");
    out.push("```css", C.tokens, "```", "");
    selected().forEach((e) => {
      if (e.kind !== "own") { out.push(`## ${C.libs[e.lib].name} · ${e.name}`, "", C.libs[e.lib].url, ""); return; }
      const m = C.motions[e.id];
      out.push(`## ${tx(m.name)}（${e.id}）`, "", `${tx(C.mtypes[m.type].name)} · ${tx(m.duration)} · ${tx(m.trigger)}`, "", tx(m.summary), "");
      if (m.ref) out.push(`${l.refBy}${m.ref}`, "");
      out.push(`### ${l.whenUse}`, "", tx(m.use), "", `### ${l.code}`, "");
      [["html", m.html], ["css", m.css], ["js", m.js]].forEach(([lang, code]) => code && out.push("```" + lang, code, "```", ""));
      out.push(`### ${l.reduced}`, "");
      if (m.rmcss) out.push("```css", m.rmcss, "```", "");
      out.push(tx(m.reduced), "", `### ${l.tips}`, "", tx(m.tips), "");
    });
    return out.join("\n");
  }

  // 上线前检查清单（可勾选，默认折叠）
  function checklist() {
    const l = L(), mos = selected();
    const item = (html) => `<li><label><input type="checkbox"> <span>${html}</span></label></li>`;
    const motionItems = (list) => list.map((e) => {
      if (e.kind !== "own") return item(`${esc(C.libs[e.lib].name)} · ${esc(e.name)}`);
      const m = C.motions[e.id];
      return item(`<b>${esc(tx(m.name))}</b><br><small class="rmline">${l.rmLine}${esc(reducedLine(m))}</small>`);
    }).join("");
    let body;
    if (S.view === "lib") body = `<ul class="checks">${motionItems(mos)}</ul>`;
    else body = S.f.map((sid) => {
      const s = C.sections[sid];
      const needs = s.built ? [tx(s.structure)] : Object.values(s.req[S.lang]);
      return `<div class="check-group"><h3>${esc(tx(s.name))}</h3><ul class="checks">
        ${needs.map((n) => item(`${l.sectionNeed}${esc(n)}`)).join("")}
        ${motionItems(mos.filter((e) => e.sections.includes(sid)))}</ul></div>`;
    }).join("");
    return `<details class="panel checklist-panel"><summary><b>${l.checkT}</b><span>${esc(l.checkD)}</span></summary>${body}</details>`;
  }

  // 下载 HTML：没选某个动效时，功能仍要能正常用的静态兜底
  const FALLBACK = {
    "progress-grow": {
      css: `.progress { height: 8px; border-radius: var(--radius-full); background: var(--color-border); overflow: hidden; }
.progress__bar { height: 100%; border-radius: inherit; background: var(--color-primary); transform-origin: left center; transform: scaleX(var(--progress, 0)); }`,
      js: `document.querySelectorAll(".progress").forEach((el) => el.querySelector(".progress__bar")?.style.setProperty("--progress", (Number(el.dataset.value) || 0) / 100));`,
    },
    "bookmark-pop": {
      css: `.bookmark { border: 0; background: var(--color-surface); border-radius: var(--radius-full); padding: 6px; cursor: pointer; display: grid; }
.bookmark svg { fill: none; stroke: var(--color-muted); stroke-width: 2; }
.bookmark[aria-pressed="true"] svg { fill: var(--color-primary); stroke: var(--color-primary); }`,
      js: `document.querySelectorAll(".bookmark").forEach((b) => b.addEventListener("click", () => b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true")));`,
    },
    "play-pause-morph": {
      css: `.play-btn { width: 64px; height: 64px; border: 0; border-radius: 50%; background: var(--color-primary); display: grid; place-items: center; cursor: pointer; }
.play-btn svg { grid-area: 1 / 1; width: 28px; height: 28px; fill: #fff; }
.play-btn .icon-pause, .play-btn[data-state="playing"] .icon-play { display: none; }
.play-btn[data-state="playing"] .icon-pause { display: block; }`,
      js: `document.querySelectorAll(".play-btn").forEach((btn) => btn.addEventListener("click", () => {
  const video = btn.parentElement.querySelector("video");
  const playing = btn.dataset.state !== "playing";
  btn.dataset.state = playing ? "playing" : "paused";
  btn.setAttribute("aria-label", playing ? "暂停" : "播放");
  if (video) playing ? video.play().catch(() => {}) : video.pause();
}));`,
    },
    "checkmark-draw": {
      css: `.check { width: 20px; height: 20px; fill: none; stroke: var(--color-success); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; visibility: hidden; }
.done .check { visibility: visible; }`,
    },
  };

  function buildHtml() {
    const zh = S.lang === "zh", st = siteType();
    const mos = selected();
    const ownIds = mos.filter((e) => e.kind === "own").map((e) => e.id);
    const built = S.f.filter((sid) => C.sections[sid].built);
    const planned = S.f.filter((sid) => !C.sections[sid].built);
    const needed = new Set(built.flatMap((sid) => C.sections[sid].motions.filter((m) => typeof m === "string")));
    const fallbacks = [...needed].filter((id) => !ownIds.includes(id) && FALLBACK[id]);
    const title = st ? tx(st.name) : (zh ? "我的页面" : "My page");

    const css = [
      "/* ===== 设计 token（统一颜色、间距、时长） ===== */", C.tokens,
      `body { margin: 0; font-family: var(--font-sans); background: var(--color-bg); color: var(--color-text); line-height: 1.6; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.todo { max-width: 960px; margin: var(--space-6) auto; padding: var(--space-6); border: 2px dashed var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); }
.todo h2 { margin-top: 0; } .todo dt { font-weight: 700; } .todo dd { margin: 0 0 var(--space-3); color: var(--color-muted); }
.demo { max-width: 960px; margin: var(--space-8) auto; padding: 0 var(--space-6); }
.demo__item { margin: var(--space-6) 0; padding: var(--space-6); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); }
.demo__item h3 { margin: 0 0 var(--space-4); font-size: 0.9rem; color: var(--color-muted); }
button { font: inherit; }`,
      ...built.map((sid) => `/* ===== 功能：${C.sections[sid].name.zh} ${sid} ===== */\n${C.sections[sid].css}`),
      ...ownIds.map((id) => `/* ===== 动效：${C.motions[id].name.zh} ${id} ===== */\n${C.motions[id].css}\n${C.motions[id].rmcss}`),
      ...built.flatMap((sid) => ownIds.filter((id) => C.sections[sid].wiring[id]?.css).map((id) => `/* ===== 接线：${id} → ${sid} ===== */\n${C.sections[sid].wiring[id].css}`)),
      ...fallbacks.map((id) => `/* ===== 未选「${C.motions[id].name.zh}」：静态样式 ===== */\n${FALLBACK[id].css}`),
    ].join("\n\n");

    const body = S.f.map((sid) => {
      const s = C.sections[sid];
      if (s.built) return `<!-- ===== 功能：${s.name.zh} ${sid} ===== -->\n${s.html}`;
      if (s.component) {
        // 组件主题：把选中动效自带的示例 HTML 放进来，打开就能试
        const demos = mos.filter((e) => e.kind === "own" && e.sections.includes(sid) && C.motions[e.id].html);
        if (demos.length) {
          const seen = new Set();
          return `<!-- ===== 组件：${s.name.zh} ${sid} ===== -->\n<section class="demo" aria-label="${esc(tx(s.name))}">\n  <h2>${esc(tx(s.name))}</h2>\n${demos.filter((e) => !seen.has(C.motions[e.id].html) && seen.add(C.motions[e.id].html)).map((e) => `  <div class="demo__item"><h3>${esc(tx(C.motions[e.id].name))}</h3>\n${C.motions[e.id].html}\n  </div>`).join("\n")}\n</section>`;
        }
      }
      const r = s.req[S.lang];
      const owns = mos.filter((e) => e.kind === "own" && e.sections.includes(sid)).map((e) => `<li>${esc(tx(C.motions[e.id].name))}（${e.id}）${e.notes[sid] ? "：" + esc(tx(e.notes[sid])) : ""}</li>`).join("");
      return `<!-- ===== 功能：${s.name.zh} ${sid}（还没有现成代码，按下面的需求实现） ===== -->
<section class="todo" aria-label="${esc(tx(s.name))}">
  <h2>${esc(tx(s.name))} · ${zh ? "待实现" : "To build"}</h2>
  <dl>${Object.entries(r).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
  ${owns ? `<p><b>${zh ? "要用的动效（CSS / JS 已经在本文件里，做好这个功能后按动效说明挂上即可）" : "Motions to use (their CSS / JS is already in this file; attach them once the feature is built)"}</b></p><ul>${owns}</ul>` : ""}
</section>`;
    }).join("\n\n");

    const mountJs = built.flatMap((sid) => ownIds.flatMap((id) => (C.sections[sid].mounts[id] || []).map((m) => {
      const html = (v) => JSON.stringify(v === "@html" ? C.motions[id].html : v);
      const each = (code) => `document.querySelectorAll(${JSON.stringify(m.sel)}).forEach((el) => ${code}); // ${id}`;
      if (m.add) return each(`el.classList.add(${JSON.stringify(m.add)})`);
      if (m.prepend) return each(`el.insertAdjacentHTML("afterbegin", ${html(m.prepend)})`);
      if (m.append) return each(`el.insertAdjacentHTML("beforeend", ${html(m.append)})`);
      if (m.replace) return each(`el.outerHTML = ${html(m.replace)}`);
      return "";
    }))).join("\n");
    const sectionJs = built.map((sid) => C.sections[sid].js).filter(Boolean).join("\n\n");
    const skipJs = (id) => built.some((sid) => C.sections[sid].wiring[id]?.skipJs);
    const wiringJs = built.flatMap((sid) => ownIds.filter((id) => C.sections[sid].wiring[id]?.js).map((id) => `// 接线：${id} → ${sid}\n${C.sections[sid].wiring[id].js}`)).join("\n\n");
    const scripts = [
      `// 标记 JS 可用（scroll-fade-in 依赖 .js 前缀，JS 出错时内容不会一直透明）\ndocument.documentElement.classList.add("js");\n${mountJs}`,
      ...fallbacks.filter((id) => FALLBACK[id].js).map((id) => `// 未选「${C.motions[id].name.zh}」：基本功能\n${FALLBACK[id].js}`),
      ...ownIds.filter((id) => C.motions[id].js && !skipJs(id)).map((id) => `// 动效：${C.motions[id].name.zh} ${id}\n${C.motions[id].js}`),
      ...(wiringJs ? [wiringJs] : []),
      ...(sectionJs ? [`// 功能逻辑\n${sectionJs}`] : []),
    ].map((js) => `<script>\n${js}\n</script>`).join("\n");

    return `<!doctype html>
<html lang="${zh ? "zh-CN" : "en"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · PurrfectCat UIUX Choice</title>
<!--
  由 PurrfectCat UIUX Choice 生成
  功能：${S.f.join(", ")}
  动效：${ownIds.join(", ") || "无"}
  所有动效都带 prefers-reduced-motion 减弱方案。${planned.length ? `\n  还没写好代码的功能（${planned.join(", ")}）留了占位，请按占位里的需求实现，或把「提示词」交给 AI。` : ""}
-->
<style>
${css}
</style>
</head>
<body>
<main>
${body}
</main>
${scripts}
</body>
</html>
`;
  }

  function viewResult() {
    const l = L(), F = S.view === "func";
    return `<div class="result">
      <section class="panel"><h2>${l.promptTitle}</h2><p>${F ? l.promptSubF : l.promptSubL}</p>
        <div class="ctx"><label for="ctx">${l.ctxLabel}</label>
          <textarea id="ctx" rows="2" maxlength="300" placeholder="${esc(l.ctxPh)}" aria-describedby="ctx-hint">${esc(S.ctx)}</textarea>
          <small id="ctx-hint">${l.ctxHint}</small></div>
        <pre tabindex="0" id="out-prompt">${esc(F ? buildPrompt() : buildLibPrompt())}</pre>
        <div class="row"><button type="button" class="btn primary sm" data-copy="#out-prompt">${l.copy}</button>
        <button type="button" class="btn sm" data-share>${l.share}</button></div></section>
      <section class="panel"><h2>${l.codeTitle}</h2><p>${F ? l.codeSubF : l.codeSubL}</p>
        <div class="row"><button type="button" class="btn primary sm" data-download>${F ? l.download : l.downloadMd}</button>
        <button type="button" class="btn sm" data-togglecode aria-expanded="false" aria-controls="out-code">${l.showCode}</button></div>
        <pre tabindex="0" id="out-code" hidden style="margin-top:12px"></pre></section>
      ${checklist()}
      <div class="spacer"></div>
    </div>`;
  }

  // ---------- 通用动作 ----------
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("on");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("on"), 1600);
  }
  async function copy(text, msg) {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch {}
      ta.remove();
    }
    toast(msg || L().copied(""));
  }
  function download(name, text, type) {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = Object.assign(document.createElement("a"), { href: url, download: name });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  function go(view, step) {
    history.pushState(null, "", location.href);
    S.view = view; S.step = step; S._bar = null;
    render();
    scrollTo({ top: 0, behavior: root.dataset.rm === "1" ? "auto" : "smooth" });
    $("#h1")?.focus({ preventScroll: true });
  }
  function setMotion(key, on, groupKey) {
    S.m = on ? [...new Set([...S.m, key])] : S.m.filter((k) => k !== key);
    if (on && groupKey) {
      const g = groupByKey(groupKey);
      const others = g ? g.items.map((e) => e.key).filter((k) => k !== key) : [];
      S.m = S.m.filter((k) => !others.includes(k));
    }
    // 同一个动效可能出现在多个功能里，勾选状态要同步
    $$('input[data-role="motion"]').forEach((box) => {
      const v = S.m.includes(box.value);
      box.checked = v;
      box.closest(".card").classList.toggle("is-on", v);
    });
    writeHash();
    renderBar();
  }

  // ---------- 事件 ----------
  document.addEventListener("change", (e) => {
    const inp = e.target;
    if (inp.dataset.role === "func") {
      S.f = inp.checked ? [...S.f, inp.value] : S.f.filter((x) => x !== inp.value);
      sortFuncs();
      const valid = new Set(funcPool().map((x) => x.key));
      S.m = S.m.filter((k) => valid.has(k));
      inp.closest(".card").classList.toggle("is-on", inp.checked);
      writeHash(); renderBar();
    } else if (inp.dataset.role === "motion") {
      setMotion(inp.value, inp.checked, inp.dataset.group);
    }
  });

  const tip = (t) => {
    const text = tx(t);
    return text ? `<button type="button" class="tipbtn" data-tip="${esc(text)}" aria-expanded="false" aria-label="${S.lang === "en" ? "More info" : "查看说明"}">${icon("help", "ic-s")}</button>` : "";
  };
  let tipBtn = null;
  function toggleTip(btn, force) {
    let box = $("#tipbox");
    if (!box) {
      box = document.createElement("div");
      box.id = "tipbox"; box.className = "tipbox"; box.setAttribute("role", "note"); box.hidden = true;
      document.body.appendChild(box);
    }
    if (tipBtn) tipBtn.setAttribute("aria-expanded", "false");
    const open = force !== undefined ? force : (box.hidden || tipBtn !== btn);
    box.hidden = !open;
    tipBtn = open ? btn : null;
    if (!open) return;
    btn.setAttribute("aria-expanded", "true");
    box.textContent = btn.dataset.tip;
    const r = btn.getBoundingClientRect(), w = Math.min(320, innerWidth - 32);
    box.style.width = w + "px";
    box.style.left = Math.max(16, Math.min(r.left - 8, innerWidth - w - 16)) + "px";
    box.style.top = r.bottom + 6 + "px";
  }
  addEventListener("scroll", () => { if (tipBtn) toggleTip(null, false); }, { passive: true });
  document.addEventListener("click", (e) => {
    if (tipBtn && !e.target.closest("#tipbox, [data-tip]")) toggleTip(null, false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && tipBtn) { const b = tipBtn; toggleTip(null, false); b.focus(); }
  });

  // 「？」说明：点开显示这一步是做什么的
  function toggleHelp(btn, force) {
    const box = $("#helpbox");
    const open = force !== undefined ? force : box.hidden;
    box.hidden = !open;
    $$("[data-help]").forEach((x) => x.setAttribute("aria-expanded", open));
    if (open && btn) {
      const row = box.parentElement.getBoundingClientRect(), r = btn.getBoundingClientRect();
      const w = Math.min(380, innerWidth - 32);
      box.style.width = w + "px";
      box.style.left = Math.max(0, Math.min(r.left - row.left, row.width - w)) + "px";
    }
  }
  document.addEventListener("click", (e) => {
    if (!$("#helpbox").hidden && !e.target.closest("#helpbox, [data-help]")) toggleHelp(null, false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("#helpbox").hidden) { toggleHelp(null, false); $("[data-help]")?.focus(); }
  });

  document.addEventListener("click", (e) => {
    const b = e.target.closest("button, a");
    if (!b) {
      // 点动效卡片（勾选框、按钮以外的地方）→ 放大看详情
      const card = e.target.closest(".mcard[data-pv]");
      if (card && !e.target.closest("label, input")) showDetail(card.dataset.pv);
      return;
    }
    if (b.classList.contains("brand") || b.hasAttribute("data-home")) { e.preventDefault(); return go("home", 1); }
    if (b.hasAttribute("data-help")) return toggleHelp(b);
    if (b.dataset.tip !== undefined) return toggleTip(b);
    if (b.dataset.go) return go(S.view, Number(b.dataset.go));
    if (b.dataset.golib !== undefined) { S.cat = b.dataset.golib || "all"; S.ty = "all"; S.q = ""; return go("lib", 1); }
    if (b.dataset.gofunc !== undefined) {
      if (b.dataset.gofunc) { S.f = [b.dataset.gofunc]; return go("func", 2); }
      return go("func", 1);
    }
    if (b.hasAttribute("data-restart")) {
      if (b.dataset.armed !== "1") {
        b.dataset.armed = "1";
        b.textContent = L().restartConfirm;
        b.classList.add("armed");
        setTimeout(() => { if (b.isConnected) { b.dataset.armed = ""; b.textContent = L().restart; b.classList.remove("armed"); } }, 3000);
        return;
      }
      S.f = []; S.m = []; S.ft = "all"; return go("home", 1);
    }
    if (b.id === "btn-lang") { S.lang = S.lang === "zh" ? "en" : "zh"; store.set("pc-lang", S.lang); return render(); }
    if (b.id === "btn-theme") { prefs.theme = root.dataset.theme === "dark" ? "light" : "dark"; store.set("pc-theme", prefs.theme); return applyPrefs(); }
    if (b.id === "btn-rm") { prefs.rm = root.dataset.rm === "1" ? "0" : "1"; store.set("pc-rm", prefs.rm); return applyPrefs(); }
    if (b.hasAttribute("data-loop")) {
      prefs.loop = !prefs.loop;
      store.set("pc-loop", prefs.loop ? "1" : "0");
      $$("[data-loop]").forEach((x) => x.setAttribute("aria-pressed", prefs.loop));
      applyLoop(app);
      return;
    }
    if (b.hasAttribute("data-recflt")) {
      S.recOnly = !S.recOnly;
      b.setAttribute("aria-pressed", S.recOnly);
      $("#results").innerHTML = libResults();
      bindPreviews($("#results"));
      return;
    }
    if (b.dataset.kw !== undefined) {
      S.q = S.q.trim().toLowerCase() === b.dataset.kw ? "" : b.dataset.kw;
      $("#bq").value = S.q;
      $("#results").innerHTML = libResults();
      bindPreviews($("#results"));
      $$("[data-kw]").forEach((c) => c.setAttribute("aria-pressed", c.dataset.kw === S.q.trim().toLowerCase()));
      return;
    }
    if (b.dataset.lt) { S.lt = b.dataset.lt; render(); $(`[data-lt="${S.lt}"]`)?.focus(); return; }
    if (b.dataset.ft) { S.ft = b.dataset.ft; render(); $(`[data-ft="${S.ft}"]`)?.focus(); return; }
    if (b.dataset.bcat) { S.cat = b.dataset.bcat; S.ty = "all"; render(); $(`[data-bcat="${S.cat}"]`)?.focus(); return; }
    if (b.dataset.ty) { S.ty = b.dataset.ty; render(); $(`[data-ty="${S.ty}"]`)?.focus(); return; }
    if (b.dataset.req) {
      const box = $("#rq-" + b.dataset.req), open = box.hidden;
      box.hidden = !open;
      b.setAttribute("aria-expanded", open);
      b.textContent = open ? L().hideReq : L().seeReq;
      return;
    }
    if (b.hasAttribute("data-selall")) {
      const ids = C.functions.filter((f) => f.ready && (S.ft === "all" || f.types.includes(S.ft))).map((f) => f.id);
      S.f = ids.every((id) => S.f.includes(id)) ? S.f.filter((id) => !ids.includes(id)) : [...new Set([...S.f, ...ids])];
      sortFuncs();
      return render();
    }
    if (b.hasAttribute("data-pickrec")) {
      const groups = S.f.flatMap(groupsFor);
      const inGroups = new Set(groups.filter((g) => g.rec.length).flatMap((g) => g.items.map((x) => x.key)));
      S.m = [...new Set([...S.m.filter((k) => !inGroups.has(k)), ...groups.flatMap((g) => g.rec)])];
      render(); toast(L().recDone); return;
    }
    if (b.dataset.play) { const stage = b.closest(".stage"), p = PV[b.dataset.play]; p.stop(stage); requestAnimationFrame(() => p.play(stage)); return; }
    if (b.dataset.cp) {
      copyMotion(b.dataset.cp, b.dataset.id);
      if (!b.dataset.label) b.dataset.label = b.textContent;
      b.textContent = L().copiedShort; b.classList.add("is-copied");
      clearTimeout(b._t);
      b._t = setTimeout(() => { b.textContent = b.dataset.label; b.classList.remove("is-copied"); }, 1200);
      return;
    }
    if (b.dataset.detail) return showDetail(b.dataset.detail);
    if (b.dataset.copy) return copy($(b.dataset.copy).textContent);
    if (b.hasAttribute("data-share")) return copy(location.href, L().shareDone);
    if (b.hasAttribute("data-download")) {
      return S.view === "lib" ? download("purrfectcat-motions.md", buildMarkdown(), "text/markdown") : download("purrfectcat-page.html", buildHtml(), "text/html");
    }
    if (b.hasAttribute("data-togglecode")) {
      const pre = $("#out-code"), open = pre.hidden;
      if (open) pre.textContent = S.view === "lib" ? buildMarkdown() : buildHtml();
      pre.hidden = !open;
      b.setAttribute("aria-expanded", open);
      b.textContent = open ? L().hideCode : L().showCode;
    }
  });

  // 标签页：方向键 / Home / End 切换
  document.addEventListener("keydown", (e) => {
    const t = e.target.closest ? e.target.closest('[role="tab"]') : null;
    if (!t || e.altKey || e.ctrlKey || e.metaKey) return;
    const tabs = $$('[role="tab"]', t.closest('[role="tablist"]'));
    const i = tabs.indexOf(t);
    const to = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    const next = tabs[(to + tabs.length) % tabs.length];
    const key = ["data-lt", "data-bcat", "data-code"].find((a) => next.hasAttribute(a));
    next.click();
    // 点击会重新渲染，按属性把焦点放回新选中的标签
    const again = key && document.querySelector(`[${key}="${next.getAttribute(key)}"]`);
    (again || next).focus();
  });

  // 搜索：只刷新结果区，输入框不丢焦点
  document.addEventListener("input", (e) => {
    if (e.target.id === "ctx") {
      S.ctx = e.target.value;
      const pre = $("#out-prompt");
      if (pre) pre.textContent = S.view === "func" ? buildPrompt() : buildLibPrompt();
      writeHash();
      return;
    }
    if (e.target.id === "tq") { S.tq = e.target.value; $("#themes").innerHTML = themeResults(); return; }
    if (e.target.id !== "bq") return;
    S.q = e.target.value;
    $("#results").innerHTML = libResults();
    bindPreviews($("#results"));
    $$("[data-kw]").forEach((c) => c.setAttribute("aria-pressed", c.dataset.kw === S.q.trim().toLowerCase()));
  });

  sysDark.addEventListener("change", applyPrefs);
  sysRM.addEventListener("change", applyPrefs);
  addEventListener("hashchange", () => { readHash(); render(); });
  addEventListener("popstate", () => { readHash(); render(); });

  // 给 profile.js（登录、收藏、个人主页）用的小工具
  window.PC = { S, C, PV, L, tx, esc, icon, ICONS, toast, copy, go, bindPreviews, root };
  readHash();
  render();
  window.__pc = { S, buildHtml, buildPrompt, buildLibPrompt, buildMarkdown, render, allPool, motionPrompt };
})();
