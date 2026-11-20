# PurrfectCat UIUX Choice：接手说明

这份说明是写给「下一个窗口里的 Claude」或你自己看的，让工作能直接接着做。

- **网站地址（唯一的完整版本）：** https://claude.ai/artifact/QEQtWsFpXzCvwHGPMne7AC
- **当前版本：** 38（2026-11-16）
- **当前规模：** 144 个动效，其中 72 个有参考来源、72 个原创，24 个标了「推荐」

> 重要：上一个窗口的工作文件放在它自己的临时文件夹里，新窗口拿不到。**以已发布的网页为准**，开工前先从网页把文件读下来（见「开工步骤」）。

---

## 1. 这个网站是什么

一个双语（中文 / 英文）的网页动效库。每个动效都有：
- 悬停就能看的小预览；
- 一键复制的 AI 提示词、HTML、CSS、JS；
- 「减弱动效」版本（给晕动症用户），以及使用建议和设计要点。

两条入口：
- **动效库**（`#v=lib`）：按大类 / 类型筛选、关键词搜索、只看推荐。只有一页，没有「生成方案」那一步，也没有勾选框。
- **我要设计…**（`#v=func`）：选主题（按钮、登录页、首屏……）→ 挑动效 → 拿结果（提示词 + 可运行的 HTML）。

---

## 2. 文件结构

网页一共 5 个文件，都能用 Artifact 工具读取：

| 文件 | 大小 | 内容 |
|---|---|---|
| `index.html` | 小 | 页面骨架：顶栏、`#app`、底栏（步骤 + 按钮）、弹窗、toast |
| `assets/content.js` | 约 650 KB | 全部数据：`window.CONTENT = {...}` |
| `assets/previews.js` | 约 71 KB | 每个动效的小预览：`window.PREVIEWS` |
| `assets/app.js` | 约 67 KB | 界面逻辑、文案（中英）、渲染 |
| `assets/style.css` | 约 135 KB | 全部样式，越往后越新，后面的规则覆盖前面的 |

### `content.js` 的结构

```
themes      主题（「我要设计」第一步的卡片），每个指向一个 section
layers      主题的四层：组件 / 板块 / 整页 / 流程
sections    37 个栏目，每个有 motions: [动效 id...]，可选 groups（只有 quiz 用了）
motions     144 个动效（结构见下）
categories  4 个大类：feedback 交互反馈 / data 数据表达 / decor 装饰氛围 / nav 导航与布局
mtypes      17 个类型，每个属于一个大类
libs        旧字段，现在没用
tokens      复制出去的代码使用的 CSS 变量（--color-primary、--space-4、--ease-out 等）
```

**注意：** `content.js` 第一行写着「自动生成，不要手改。运行 `python3 site/build_data.py` 重新生成」。但那个脚本不在网页里，我们一直是直接改这个文件的。如果以后有人用原脚本重新生成，这几轮加的 80 个动效、关键词、推荐标记都会丢。

### 一个动效的数据格式

```js
"shimmer-button": {
  category: "feedback",            // 大类：feedback / data / decor / nav
  type: "hover-press",             // 类型（必须属于上面那个大类）
  name:     { zh: "按钮流光", en: "Shimmer button" },
  summary:  { zh: "…一句话描述…", en: "…" },
  trigger:  { zh: "鼠标悬停或键盘聚焦", en: "…" },
  duration: { zh: "700ms", en: "700ms" },
  use:      { zh: "- 适用场景…\n\n**不要用：** …", en: "- …\n\n**Don't use:** …" },
  reduced:  { zh: "- 替代方式：…\n- 保留的信息：…", en: "- Instead: …\n- Still communicates: …" },
  tips:     { zh: "- 设计要点…\n- 效果参考 X 的 Y，这里是独立实现的", en: "…" },
  html: "…", css: "…", js: "…",    // 复制出去的代码，用 tokens 里的变量
  rmcss: "@media (prefers-reduced-motion: reduce) { … }",   // 可以是 ""
  ref: "Magic UI · Shimmer Button",  // 参考来源；原创写 ""
  kw:  { zh: ["按钮","流光"], en: ["button","shimmer"] },   // 搜索关键词
  rec: true                        // 可选：推荐
}
```

- `use`、`reduced`、`tips` 用简单 Markdown（`- ` 列表、`**粗体**`、`` `代码` ``）。
- `reduced` 的两行固定写法：「替代方式」和「保留的信息」，英文是 "Instead" 和 "Still communicates"。

### 17 个类型

- **feedback（交互反馈）：** hover-press 悬停与按下、select-toggle 选中与切换、success 成功与庆祝、input-focus 输入与聚焦、notice 通知与提示、error 错误与提示
- **data（数据表达）：** progress 进度、number 数字变化、achievement 完成与成就、timer 计时、rank-change 排名变化、chart 图表
- **decor（装饰氛围）：** entrance 进场、ambient 背景氛围
- **nav（导航与布局）：** popup 展开与弹出、transition 切换与转场、nav-tabs 导航与标签

### 37 个栏目（section id）

course-list 课程浏览、quiz 练习做题、video-player 视频观看、nav 导航、login 登录注册、progress-dashboard 学习进度面板、leaderboard 排行榜、button 按钮、text-input 输入框、radio-checkbox 单选与复选、toggle 开关、select 下拉选择、toc 目录、tabs 标签页、steps 步骤条、card 卡片、table 表格、avatar-group 头像组、badge 徽章与红点、accordion 折叠面板、drag-sort 拖拽排序、alert 警告提示、modal 弹窗、drawer 抽屉、toast 消息提示、tooltip 悬停提示、heading-motion 标题文字动画、hero 首屏、stats 数据亮点、faq 常见问题、check-in 打卡日历、music-player 音乐播放器、achievements 成就徽章墙、legal 条款与隐私页、payment-success 支付成功页、story-page 滚动讲故事长页面、signup-flow 分步注册

每个新动效挂 2 个栏目左右。**hero（首屏）已经很挤，尽量别再往里放。**

### 预览（`previews.js`）

```js
P["shimmer-button"] = {
  html: () => `<span class="pv-shbtn">${t("开始练习", "Start practice")}</span>`,
  play: (s) => restart(s.querySelector(".pv-shbtn"), "on"),   // s 是预览舞台
  stop: (s) => s.querySelector(".pv-shbtn").classList.remove("on"),
  loop: 1900,   // 可选。不写：每 1.9s 先 stop 再 play；写了：每隔 loop 毫秒只调用 play
};
```

可用的工具函数：`t(zh, en)` 取当前语言、`rm()` 是否开了减弱动效、`restart(el, cls)` 重新触发 CSS 动画、`FLAME`（火苗 SVG）、`NEVER`（持续动画用的超长 loop）。预览样式类名统一用 `pv-` 开头，预览里用网站自己的变量（`--accent`、`--surface`、`--border`、`--ink`、`--muted`、`--ok`、`--bad`）。

**减弱动效：** 网站用 `<html data-rm="1">` 表示减弱动效，每个预览都要写对应的 `[data-rm="1"] …` 规则（不能只靠 `@media`）。

---

## 3. 加一批动效的流程（之前每一批都是这么做的）

1. **选题和核对来源。** 如果参考别的库，先搜索确认组件名真实存在、看清许可，再写 `ref`。不确定的就当原创，不写来源。
2. **写三个文件**，放在 `tools/` 里，比如批次名 `wave14`：
   - `wave14_data.js`：`module.exports = [{ id, sections: [...], kw: ["中文 关键词", "english keywords"], m: { …动效数据… } }]`
   - `wave14_previews.js`：一段 `P["id"] = {...}` 代码（会被插进 previews.js 里，可以直接用 `t`、`rm`、`restart`、`NEVER`）
   - `wave14.css`：预览样式，加上 `[data-rm="1"]` 规则
   - 数据文件里的代码字符串用 `String.raw` 模板写；**代码里不要用反引号和 `${`**（会和模板冲突），JS 里拼字符串用 `+`。
3. **先备份 assets，再运行：** `node tools/add-motions.js site/assets wave14`
4. **检查：**
   - `node --check` 检查 app.js、previews.js、content.js；
   - 用 node 确认每个动效都有预览、每个预览的 `html()` 能运行；
   - 把 `tools/smoke.html` 放到网站根目录，用本地服务器（`python3 -m http.server 8780 --bind 127.0.0.1`）打开，等 5–7 秒看 `window.__res.errors`（以 `harness` 开头的不用管）；
   - 打开 `index.html#v=lib&lang=zh` 截图看新卡片，亮色和暗色各看一次。
5. **发布：** 用 Artifact 工具，`url` 填网站地址，`file_path` 指向 `index.html`，`root` 指向网站文件夹，`files` 列出改过的文件（比如 `["assets/style.css", "assets/content.js", "assets/previews.js"]`）。
6. 用完关掉本地服务器。

### 每个动效都要做到

- 代码只动 `transform` 和 `opacity`；不得不动宽高（比如搜索框展开、Dock 放大）时，在 tips 里说明。
- 有完整的减弱动效方案，而且不是简单删掉，要说明「保留的信息」。
- 循环超过 5 秒的动画要能暂停（悬停暂停或暂停按钮）。
- 状态要有文字，不能只靠颜色或动画；需要时用 `aria-live` 播报，但别每次按键都播。
- 拖拽、长按、滑动等手势，一定要有点击或键盘的替代方式。
- 装饰元素加 `aria-hidden`；逐字或乱序的文字要给读屏软件留一份完整文字。
- 中英文都要写。

---

## 4. 来源和许可（重要）

- **Magic UI、Motion Primitives、Animate UI、Kokonut UI：** MIT。
- **React Bits：** **MIT + Commons Clause**（已读官方 LICENSE）。可以在自己的产品里用，但**不能出售、转授权或再分发组件本身**。这个网站本身就是可复制代码的动效库，所以**绝对不能把 React Bits 的代码放进来**，只能参考效果创意、自己重写。
- **anime.js、react-spring、p5.js、matter-js、D3、Tone.js：** 只参考了它们示例的创意，没引入这些库。许可没逐个核实原文（印象中 p5.js 是 LGPL，其他是 MIT 或 ISC）。
- 所有参考来源的动效，代码都是独立重写的，没有复制任何一行原代码。首页页脚已经写明了这一点。

**目前各来源的数量：** Magic UI 23、Motion Primitives 16、Animate UI 12、React Bits 8、Kokonut UI 7，anime.js、react-spring、p5.js、matter-js、D3、Tone.js 各 1。

**已确认重复、故意没加的组件：** Shine Border、Neon Gradient Card、Magic Card、Number Ticker、Animated Circular Progress Bar、Morphing Text、Animated Subscribe Button（Magic UI）；Text Loop、Infinite Slider、Disclosure、Animated Number（Motion Primitives）；Dynamic Text、Shimmer Text、Beams Background（Kokonut）。没能确认存在的：Dock（Magic UI 版）、Scratch To Reveal。

---

## 5. 用户已经定下的设计决定（别改回去）

- **顶栏：** 左上角三个纯图标（小房子 / 放大镜 / 「我要设计」图标），贴页面最左边，留 12px；logo 在正中间；语言、深浅色、减弱动效三个按钮贴最右边，留 12px。
- **首页文案：** 「这按钮，有点东西。」/「120+ 个好玩又好用的动效，喜欢就带走。」；英文 "Not Your Average Button." / "120+ delightful UI animations. Pick one. Make it yours."
- **说明文字收进「？」：** 步骤说明在步骤名旁边的「？」里；各分组标题旁的灰色说明也收进「？」。
- **步骤条在底栏**（只有「我要设计」流程有，动效库没有）。
- **层级区分用方案 C：** 大类标题是主题橙色、24px；类型分组挂在一条橙色竖线上并缩进。
- **卡片样式：**
  - **浅色模式：** 新样式，左上角编号、按分类着色的浅色预览区、大号粗体名字、底部「来源 + ● 分类」一行。
  - **深色模式：** 用户要求**保持之前的样子**：灰色预览区、无编号、无分类标签、左下角只显示「参考 …」。
- **卡片左下角写来源**（「参考 Magic UI · …」）；原创在浅色模式显示「原创」，深色模式不显示。
- **方向 A（搜索关键词）和方向 B（推荐）已做完**；方向 C（相近动效合成一组）没做。
- 火苗用 SVG，不用 emoji；界面上不用 emoji 当图标。

---

## 6. 开工步骤（新窗口）

0. **这个文件夹里已经有一份版本 38 的完整副本：** `site/index.html` 和 `site/assets/`。如果网页之后没有再被改过，可以直接用它；不确定的话按第 1 步重新读一遍。
1. **读当前版本：** 用 Artifact 工具 `action: "read"` 读网站地址，再用 `paths: ["assets/style.css", "assets/app.js", "assets/content.js", "assets/previews.js"]` 把四个文件下载下来，和 `index.html` 一起放进同一个文件夹，比如 `site/`（`index.html` 在根目录，其余放进 `site/assets/`）。
2. **复制工具：** 把这份 README 旁边的 `tools/` 文件夹复制到新窗口的工作目录。
3. **跑一次自检：** 确认读下来的版本没问题，应当是 144 个动效、0 个运行错误。
4. 按第 3 节的流程继续。

---

## 7. 待办和可以接着做的事

- **React Bits 里还没加、也不重复的：** Warm Tooltip（连续悬停的提示免等待）、Pixel Transition（像素溶解切换）、Peek Rating（评分星星波浪）、Swipe Row（左滑露出操作）、Rubber Segment（橡皮筋分段控件）、Bell Toggle、Status Mark 等。注意它的许可（见第 4 节）。
- **方向 C：** 把相近动效合成一组，比如几种光晕、几种按钮悬停、几种进场。
- **Kokonut Bento Grid：** 可拖动、可缩放的网格，工作量大。
- **同步回源头：** 如果本地真有 `site/build_data.py`，要把这几轮的改动同步回原始数据，否则重新生成会覆盖。
- **没测过的东西：**
  - 拖拽、长按、滑动类动效的真实手感；
  - 「可撤销引线」烧完后的最终状态；
  - 浅色模式下所有新卡片的逐个视觉检查。
- **自检脚本的小毛病：** 它对弹窗有个错误假设，会对 drawer-slide、modal-scale-fade、modal-tip-in、bottom-sheet 报 `harness` 错误，可以修一下。

---

## 8. 每一批加了什么（版本对照）

| 版本 | 内容 |
|---|---|
| 12–22 | UIUX 审查修复、布局调整（顶栏、底栏步骤、「？」说明、层级方案 C） |
| 23 | 火苗换 SVG、卡片来源小字、第二波 8 个（Magic UI / Motion Primitives） |
| 24–26 | 第三、四、五波各 8 个 |
| 27 | 搜索关键词（方向 A） |
| 28 | 推荐标记（方向 B） |
| 29–30 | 第六、七波（含原创），修复深浅色切换的报错 |
| 31–34 | 第八波原创、首页文案、顶栏左右贴边、logo 居中 |
| 35 | 第九波原创 |
| 36 | 第十波：参考 React Bits 8 个，页脚改成准确的许可说明 |
| 37 | 卡片新样式、第十一波：参考 anime.js 等开源项目 |
| 38 | 深色模式卡片恢复旧样式 |
