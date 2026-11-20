// 往网站里加一批动效。
// 用法：node tools/add-motions.js <assets 目录> <批次名>
//   需要同目录下有三个文件：<批次名>_data.js、<批次名>_previews.js、<批次名>.css（格式见 README）
// 例子：node tools/add-motions.js site/assets wave14
const fs = require("fs");
const path = require("path");
const [dir, name] = process.argv.slice(2);
if (!dir || !name) throw new Error("用法：node tools/add-motions.js <assets 目录> <批次名>");
const here = __dirname;

// 1) content.js：加动效、挂到栏目、写关键词
global.window = {};
require(path.resolve(dir, "content.js"));
const C = window.CONTENT;
const wave = require(path.join(here, name + "_data.js"));
for (const w of wave) {
  if (C.motions[w.id]) throw new Error("重复的动效 id：" + w.id);
  if (!C.mtypes[w.m.type]) throw new Error(w.id + " 的类型不存在：" + w.m.type);
  if (C.mtypes[w.m.type].category !== w.m.category) throw new Error(w.id + " 的类型和大类对不上");
  const [zh, en] = w.kw;
  C.motions[w.id] = { ...w.m, kw: { zh: zh.split(/\s+/), en: en.split(/\s+/) } };
  for (const sid of w.sections) {
    if (!C.sections[sid]) throw new Error("没有这个栏目：" + sid);
    if (!C.sections[sid].motions.includes(w.id)) C.sections[sid].motions.push(w.id);
  }
}
const noKw = Object.keys(C.motions).filter((id) => !C.motions[id].kw);
if (noKw.length) throw new Error("这些动效没有关键词：" + noKw);
fs.writeFileSync(path.resolve(dir, "content.js"), "// 自动生成，不要手改。运行 python3 site/build_data.py 重新生成\nwindow.CONTENT = " + JSON.stringify(C, null, 1) + ";\n");

// 2) previews.js：在 window.PREVIEWS = P; 之前插入预览
const pvPath = path.resolve(dir, "previews.js");
let pv = fs.readFileSync(pvPath, "utf8");
if (!pv.includes("  window.PREVIEWS = P;")) throw new Error("找不到 PREVIEWS 结尾");
pv = pv.replace("  window.PREVIEWS = P;", () => fs.readFileSync(path.join(here, name + "_previews.js"), "utf8") + "  window.PREVIEWS = P;");
fs.writeFileSync(pvPath, pv);

// 3) style.css：追加预览样式
fs.appendFileSync(path.resolve(dir, "style.css"), fs.readFileSync(path.join(here, name + ".css"), "utf8"));

console.log("完成。动效总数：", Object.keys(C.motions).length, "，有参考来源：", Object.values(C.motions).filter((m) => m.ref).length);
