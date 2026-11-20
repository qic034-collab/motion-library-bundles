#!/usr/bin/env node
// motion-fx：把按钮动效一次性套到整个网页项目。零依赖，Node 16+。
//
//   node apply.js list
//   node apply.js index                                  重新生成 index.json
//   node apply.js scan   <项目目录>
//   node apply.js add    <项目目录> --bundle friendly-buttons [--dry]
//   node apply.js add    <项目目录> --fx ripple --select "button, .btn" [--exclude ".nav button"] [--out 目录] [--force] [--dry]
//   node apply.js remove <项目目录> [--fx shimmer,magnetic]   不带 --fx 就整个卸载
const fs = require("fs");
const path = require("path");

const SKILL = path.resolve(__dirname, "..");
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", ".nuxt", ".svelte-kit", ".turbo", "coverage", "out"]);
const CFG_NAME = "motion-fx.config.json";
const START = "<!-- motion-fx:start -->";
const END = "<!-- motion-fx:end -->";

/* ---------- 参数 ---------- */
const [cmd, ...rest] = process.argv.slice(2);
const pos = [];
const opt = {};
for (let i = 0; i < rest.length; i++) {
  const a = rest[i];
  if (a.startsWith("--")) {
    const k = a.slice(2);
    if (["dry", "force"].includes(k)) opt[k] = true;
    else opt[k] = rest[++i];
  } else pos.push(a);
}
const die = (msg, code = 1) => { console.error(msg); process.exit(code); };
const rd = (p) => fs.readFileSync(p, "utf8");

/* ---------- 动效库 ---------- */
function loadMotions() {
  const dir = path.join(SKILL, "motions");
  const out = {};
  for (const id of fs.readdirSync(dir)) {
    const m = path.join(dir, id, "meta.json");
    if (fs.existsSync(m)) out[id] = { ...JSON.parse(rd(m)), dir: path.join(dir, id) };
  }
  return out;
}
function loadBundle(id) {
  const p = path.join(SKILL, "bundles", id + ".json");
  if (!fs.existsSync(p)) die("没有这个组合：" + id + "。可用：" + fs.readdirSync(path.join(SKILL, "bundles")).map((f) => f.replace(".json", "")).join(", "));
  return JSON.parse(rd(p));
}

/* ---------- 文件遍历 ---------- */
function walk(root, exts, depth = 8) {
  const res = [];
  (function go(d, n) {
    if (n > depth) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name) && !e.name.startsWith(".")) go(path.join(d, e.name), n + 1); }
      else if (!exts || exts.includes(path.extname(e.name).toLowerCase())) res.push(path.join(d, e.name));
    }
  })(root, 0);
  return res;
}
const rel = (root, p) => path.relative(root, p) || ".";

/* ---------- list / index ---------- */
function cmdList() {
  const M = loadMotions();
  for (const m of Object.values(M)) console.log(`${m.id.padEnd(10)} [${m.scope === "all" ? "可用于所有按钮" : "只给主按钮  "}] ${m.name.zh} — ${m.summary.zh}`);
  console.log("\n组合：");
  for (const f of fs.readdirSync(path.join(SKILL, "bundles"))) {
    const b = JSON.parse(rd(path.join(SKILL, "bundles", f)));
    console.log(`${b.id.padEnd(18)} ${b.name.zh} — ${b.summary.zh}`);
  }
}
function cmdIndex() {
  const M = loadMotions();
  const motions = Object.values(M).map(({ dir, reduced, ...m }) => m);
  const bundles = fs.readdirSync(path.join(SKILL, "bundles")).map((f) => {
    const b = JSON.parse(rd(path.join(SKILL, "bundles", f)));
    return { id: b.id, name: b.name, summary: b.summary };
  });
  fs.writeFileSync(path.join(SKILL, "index.json"), JSON.stringify({ motions, bundles }, null, 2) + "\n");
  console.log("已写入 index.json：" + motions.length + " 个动效，" + bundles.length + " 个组合");
}

/* ---------- scan ---------- */
function cmdScan() {
  const root = path.resolve(pos[0] || ".");
  if (!fs.existsSync(root)) die("目录不存在：" + root);
  const files = walk(root, [".html", ".htm", ".jsx", ".tsx", ".vue", ".svelte", ".astro", ".js", ".ts", ".css", ".scss", ".less"]);
  let buttons = 0, roleBtn = 0, submit = 0;
  const cls = {};
  const clashes = [];
  let twClash = 0;
  const markup = /\.(html?|jsx|tsx|vue|svelte|astro)$/i;
  const style = /\.(css|scss|less)$/i;
  for (const f of files) {
    if (path.basename(f).startsWith("motion-fx")) continue;
    const s = rd(f);
    if (markup.test(f)) {
      buttons += (s.match(/<button\b/gi) || []).length;
      roleBtn += (s.match(/role\s*=\s*["']button["']/gi) || []).length;
      submit += (s.match(/type\s*=\s*["'](submit|button)["']/gi) || []).length;
      for (const m of s.matchAll(/class(?:Name)?\s*=\s*["'`{]+([^"'`}]*)/g))
        for (const t of m[1].split(/\s+/)) if (/btn|button/i.test(t) && t.length < 40) cls[t] = (cls[t] || 0) + 1;
      twClash += (s.match(/\b(?:active|hover|focus):-?(?:scale|translate)-/g) || []).length;
    }
    if (style.test(f)) {
      for (const m of s.matchAll(/([^{}@]+)\{([^{}]*)\}/g)) {
        const sel = m[1].trim().replace(/\s+/g, " ");
        const props = (m[2].match(/\b(transition|animation|transform|scale|translate)\b\s*:/g) || []).map((x) => x.replace(/\s*:$/, ""));
        if (props.length && /button|\.btn|btn-|\[role=.?button/i.test(sel)) clashes.push(`${rel(root, f)}  ${sel.slice(0, 60)}  → ${[...new Set(props)].join(", ")}`);
      }
    }
  }
  let pkg = {};
  try { pkg = JSON.parse(rd(path.join(root, "package.json"))); } catch (e) { /* 没有 package.json */ }
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const stack = ["react", "next", "vue", "nuxt", "svelte", "astro", "vite", "tailwindcss"].filter((d) => deps[d]);
  const htmls = walk(root, [".html", ".htm"]).filter((f) => !path.basename(f).startsWith("motion-fx"));
  const existing = findConfig(root);

  console.log("项目：" + root);
  console.log("技术栈：" + (stack.join(", ") || "未检测到框架（按纯 HTML 处理）"));
  console.log(`按钮：<button> ${buttons} 个，role=button ${roleBtn} 个，type=submit/button ${submit} 个`);
  const top = Object.entries(cls).sort((a, b) => b[1] - a[1]).slice(0, 15);
  console.log("常见按钮类名：" + (top.map(([k, v]) => `${k}(${v})`).join(", ") || "无"));
  console.log("HTML 入口：" + (htmls.length ? htmls.slice(0, 6).map((f) => rel(root, f)).join(", ") + (htmls.length > 6 ? " …共 " + htmls.length + " 个" : "") : "没有 .html 文件（框架项目要手动加两行，见 add 的输出）"));
  console.log("可能冲突的已有样式（" + clashes.length + "）：" + (clashes.length ? "\n  " + clashes.slice(0, 20).join("\n  ") : "无"));
  if (twClash) console.log(`Tailwind：发现 ${twClash} 处 active:/hover:/focus: 的 scale/translate 工具类，可能和 press / magnetic 叠加。`);
  console.log("已安装 motion-fx：" + (existing ? rel(root, existing) + "  规则 " + JSON.parse(rd(existing)).rules.length + " 条" : "否"));
}

/* ---------- 配置与构建 ---------- */
function findConfig(root) {
  const hit = walk(root, [".json"]).find((f) => path.basename(f) === CFG_NAME);
  return hit || null;
}
const BROAD = /^(button|a|input|\[role=["']?button["']?\])$/i;
function isBroad(select) {
  return select.split(",").map((s) => s.trim()).some((p) => BROAD.test(p));
}
function build(outDir, cfg, M) {
  const used = [...new Set(cfg.rules.flatMap((r) => r.fx))];
  for (const n of used) if (!M[n]) die("没有这个动效：" + n);
  const header = "/* motion-fx 自动生成，改配置请用 scripts/apply.js，不要手改 */\n";
  const css = header + rd(path.join(SKILL, "runtime/core.css")) + used.map((n) => "\n" + rd(path.join(M[n].dir, "fx.css"))).join("");
  const effects = used.map((n) => "\n  /* ---------- " + n + " ---------- */\n" + rd(path.join(M[n].dir, "fx.js")).replace(/^/gm, "  ")).join("\n");
  const js = header + rd(path.join(SKILL, "runtime/core.js")).replace("/*__CONFIG__*/ null", () => JSON.stringify(cfg)).replace("/*__EFFECTS__*/", () => effects);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "motion-fx.css"), css);
  fs.writeFileSync(path.join(outDir, "motion-fx.js"), js);
  fs.writeFileSync(path.join(outDir, CFG_NAME), JSON.stringify(cfg, null, 2) + "\n");
}

/* ---------- HTML 注入 ---------- */
function urlFor(root, outDir, htmlFile, name) {
  const pub = path.join(root, "public");
  if (outDir.startsWith(pub + path.sep)) return "/" + path.relative(pub, path.join(outDir, name)).split(path.sep).join("/");
  let r = path.relative(path.dirname(htmlFile), path.join(outDir, name)).split(path.sep).join("/");
  return r.startsWith(".") ? r : "./" + r;
}
function blockFor(root, outDir, f) {
  return `${START}\n<link rel="stylesheet" href="${urlFor(root, outDir, f, "motion-fx.css")}">\n<script src="${urlFor(root, outDir, f, "motion-fx.js")}" defer></script>\n${END}`;
}
function htmlTargets(root) {
  return walk(root, [".html", ".htm"]).filter((f) => !path.basename(f).startsWith("motion-fx") && /<\/head>/i.test(rd(f)));
}
const BLOCK_RE = new RegExp(START + "[\\s\\S]*?" + END + "\\n?", "g");

/* ---------- add ---------- */
function cmdAdd() {
  const root = path.resolve(pos[0] || ".");
  if (!fs.existsSync(root)) die("目录不存在：" + root);
  const M = loadMotions();
  let rules;
  if (opt.bundle) rules = loadBundle(opt.bundle).rules;
  else {
    if (!opt.fx || !opt.select) die("用法：add <目录> --bundle <名字>  或  add <目录> --fx a,b --select \"选择器\" [--exclude \"选择器\"]");
    rules = [{ select: opt.select, ...(opt.exclude ? { exclude: opt.exclude } : {}), fx: opt.fx.split(",").map((s) => s.trim()) }];
  }
  // 检查动效名；“只给主按钮”的动效用在宽泛选择器上要拦下来
  const warns = [];
  for (const r of rules) for (const n of r.fx) {
    if (!M[n]) die("没有这个动效：" + n + "。可用：" + Object.keys(M).join(", "));
    if (M[n].scope === "primary" && isBroad(r.select)) warns.push(`「${M[n].name.zh}」建议只给主按钮，但选择器 "${r.select}" 会套到所有按钮。${M[n].dont_use.zh}`);
  }
  if (warns.length && !opt.force) {
    console.error("⚠ 需要先确认：\n  " + warns.join("\n  ") + "\n\n确认要这样做就加 --force；否则把选择器收窄到主按钮（例如 .btn-primary）。");
    process.exit(2);
  }
  const existing = findConfig(root);
  let outDir, cfg = { version: 1, rules: [] };
  if (existing) { outDir = path.dirname(existing); cfg = JSON.parse(rd(existing)); }
  else outDir = path.resolve(opt.out || (fs.existsSync(path.join(root, "public")) ? path.join(root, "public/motion-fx") : path.join(root, "motion-fx")));
  for (const r of rules) {
    const dup = cfg.rules.find((x) => x.select === r.select && (x.exclude || "") === (r.exclude || ""));
    if (dup) dup.fx = [...new Set([...dup.fx, ...r.fx])];
    else cfg.rules.push(r);
  }
  const htmls = htmlTargets(root);
  console.log(`${opt.dry ? "[预演，不写文件] " : ""}输出目录：${rel(root, outDir)}`);
  for (const r of cfg.rules) console.log(`  规则：${r.select}${r.exclude ? "（排除 " + r.exclude + "）" : ""}  →  ${r.fx.join(" + ")}`);
  console.log("  注入 HTML：" + (htmls.length ? htmls.map((f) => rel(root, f)).join(", ") : "无"));
  if (opt.dry) return;
  build(outDir, cfg, M);
  for (const f of htmls) {
    let s = rd(f).replace(BLOCK_RE, "");
    s = s.replace(/<\/head>/i, (m) => blockFor(root, outDir, f) + "\n" + m);
    fs.writeFileSync(f, s);
  }
  console.log("完成。" + (htmls.length ? "" : "\n没有找到带 </head> 的 HTML。框架项目请在入口页的 <head> 里手动加：\n" + blockFor(root, outDir, path.join(root, "index.html"))));
}

/* ---------- remove ---------- */
function cmdRemove() {
  const root = path.resolve(pos[0] || ".");
  const existing = findConfig(root);
  if (!existing) die("没有找到 " + CFG_NAME + "，这个项目没装过 motion-fx。");
  const outDir = path.dirname(existing);
  const cfg = JSON.parse(rd(existing));
  const drop = opt.fx ? opt.fx.split(",").map((s) => s.trim()) : null;
  if (drop) {
    cfg.rules = cfg.rules.map((r) => ({ ...r, fx: r.fx.filter((n) => !drop.includes(n)) })).filter((r) => r.fx.length);
  }
  if (drop && cfg.rules.length) {
    if (opt.dry) return console.log("[预演] 将移除：" + drop.join(", ") + "；剩余规则 " + cfg.rules.length + " 条");
    build(outDir, cfg, loadMotions());
    console.log("已移除 " + drop.join(", ") + "，剩余规则 " + cfg.rules.length + " 条。刷新页面生效。");
    return;
  }
  const htmls = walk(root, [".html", ".htm"]).filter((f) => rd(f).includes(START));
  console.log(`${opt.dry ? "[预演] " : ""}将卸载：${htmls.map((f) => rel(root, f)).join(", ") || "（没有注入的 HTML）"}，并删除 ${rel(root, outDir)} 里生成的文件`);
  if (opt.dry) return;
  for (const f of htmls) fs.writeFileSync(f, rd(f).replace(BLOCK_RE, ""));
  for (const n of ["motion-fx.css", "motion-fx.js", CFG_NAME]) fs.rmSync(path.join(outDir, n), { force: true });
  try { fs.rmdirSync(outDir); } catch (e) { /* 目录里还有别的文件就留着 */ }
  console.log("已卸载。页面上的 data-fx 属性是运行时加的，刷新后就没有了。");
}

const cmds = { list: cmdList, index: cmdIndex, scan: cmdScan, add: cmdAdd, remove: cmdRemove };
if (!cmds[cmd]) die("用法：node apply.js <list|index|scan|add|remove> …\n详见 SKILL.md");
cmds[cmd]();
