---
name: motion-fx
description: 一步把按钮动效套到整个网页项目，不用一个个改。用户说「所有按钮都加流光」「主按钮加脉冲」「给按钮加点击涟漪/按下回弹/磁吸」「按钮要有手感」「换一套按钮动效」时使用；也用于撤销或替换已加的按钮动效。Apply button micro-interactions (shimmer, ripple, press, magnetic, pulse) across a whole web project in one step, by selector instead of editing each button.
---

# motion-fx：按钮动效，一步套用

核心做法：**不改按钮本身**，只往页面里加两个文件（`motion-fx.css` + `motion-fx.js`）。运行时按「选择器 → 动效」的规则给匹配的按钮打上 `data-fx` 属性，样式靠这个属性触发。后来才出现的按钮（弹窗、单页应用）也会自动套上。

## 动效库（5 个）

先读 `index.json`（很小）。需要细节再读 `motions/<id>/meta.json`，不要一次读全部。

| id | 效果 | 范围 |
|---|---|---|
| `press` | 按下回弹 | 所有按钮 |
| `ripple` | 点击涟漪 | 所有按钮 |
| `shimmer` | 悬停流光 | **只给主按钮** |
| `pulse` | 载入后脉冲 3 次 | **只给主按钮**（只一个） |
| `magnetic` | 鼠标靠近被吸过去 | **只给主按钮**，仅桌面 |

组合（`bundles/`）：`friendly-buttons`（全体按下回弹 + 涟漪，主按钮流光）、`showcase-cta`（全体按下回弹，首屏主按钮磁吸 + 流光）。

## 工作流程

脚本路径：`<这个 skill 的目录>/scripts/apply.js`，下面简写为 `apply`。

1. **听懂两件事：要什么效果、套给哪些按钮。** 用户说「所有按钮都用流光」→ 效果是 shimmer，范围是所有。用户只说「给按钮加点动效」→ 推荐 `friendly-buttons`，一句话问是否用，不要罗列选项。
2. **摸清项目：** `node apply scan <项目目录>`。看技术栈、按钮数量、常见按钮类名、可能冲突的已有样式。
3. **守住「只给主按钮」的规则（重要）。** 这几个动效的 `meta.json` 里写了「不要用」：同一屏多个会吵、会让用户分不清重点。
   - 用户说「所有按钮」+ 流光/脉冲/磁吸 → **先说明一句并给出替代**：「流光建议只给主按钮，其余用按下回弹，这样重点才突出。要这样吗？」用户坚持才加 `--force`。
   - 找主按钮的选择器要根据 scan 报出的类名来定（`.btn-primary`、`button[type=submit]` 等）。找不到明显的主按钮类名就问用户哪个是主按钮，或让用户给想要的按钮加 `data-primary` 属性。
4. **先预演：** `node apply add <目录> --bundle friendly-buttons --dry`，或
   `node apply add <目录> --fx ripple --select "button, .btn" --exclude ".nav button" --dry`。把「将套用到哪些选择器、会改哪些 HTML」告诉用户。
5. **正式执行：** 去掉 `--dry`。脚本会写 `motion-fx/`（有 `public/` 目录时写到 `public/motion-fx/`），并在 HTML 的 `</head>` 前注入两行，用 `<!-- motion-fx:start/end -->` 包住。
   - 没有 HTML 文件的框架项目（React / Next / Vue 等）：脚本会打印要手动加的两行，加到入口页（`index.html` 或根布局）的 `<head>`。
6. **验证（别跳过）：**
   - 打开页面，控制台跑 `document.querySelectorAll('[data-fx]').length`，应该等于预期按钮数；
   - 悬停 / 点击一次，确认效果真的出现；
   - 模拟「减弱动效」（系统设置，或 `document.documentElement.dataset.rm = "1"`），确认动画没了但按钮仍有反馈（变亮 / 变暗 / 描边）；
   - 看按钮布局没有被撑开，角标没有被裁掉（涟漪会给按钮加 `overflow: hidden`）。
7. **汇报：** 说清楚套了什么、套给了谁、改了哪些文件、怎么撤销。

## 调整与撤销

- 只想排除某个按钮：给它加 `data-fx-skip` 属性（它里面的子元素也一起排除）。
- 换效果：`node apply remove <目录> --fx shimmer`，再 `add` 新的。
- 整个卸载：`node apply remove <目录>`（删掉生成的文件和注入的两行）。
- 配置都在 `motion-fx.config.json`，每条规则是 `{ select, exclude?, fx: [...] }`，可以直接改，再跑一次 `add` 或让 Claude 重新生成。

## 它怎么避免搞坏原来的页面

- 选择器和动画都不动按钮原来的颜色、字号、内边距。
- 按下和磁吸用独立的 `scale` / `translate` 属性，不会和按钮原有的 `transform` 冲突；原有的 `transition` 会保留并追加，不会被覆盖。
- 只有按钮 `position: static` 时才补 `relative`。
- 流光、涟漪、脉冲的颜色根据按钮底色自动选（深底用白光，浅底用深光，透明按钮用文字色）。
- `<input type=submit>` 不能放子元素和伪元素，流光 / 涟漪 / 脉冲会自动跳过它，只保留按下回弹和磁吸。
- 禁用状态（`disabled` / `aria-disabled`）的按钮没有任何动效。
- 减弱动效：每个动效都有替代方案，同时支持系统设置和 `<html data-rm="1">`。

## 已知限制

- 靠运行时脚本，所以关闭 JavaScript 时没有动效（按钮本身不受影响）。
- 在 `public/` 下输出时用根路径 `/motion-fx/…`；站点部署在子路径下时要改成相对路径。
- 浏览器要支持独立的 `scale` / `translate` 属性（2022 年之后的主流浏览器）。
- 页面里已有 Tailwind 的 `active:scale-95` 之类工具类时，和 `press` 叠加，`scan` 会提示。
- 涟漪会给按钮设 `overflow: hidden`，按钮上有伸出边框的角标会被裁掉，这类按钮用 `--exclude` 排除。

## 扩展

新增动效：在 `motions/<id>/` 放 `meta.json`（含 `scope: "all" | "primary"`）、`fx.css`、`fx.js`，然后 `node apply index` 更新索引。`fx.js` 里注册 `FX.<id> = { ok(el), init(el), boot() }`，可以用 `U.fixPos / U.tint / U.addTransition / U.reduced / U.disabled`。样式一律写成 `[data-fx~="<id>"]`，并带上减弱动效的版本（`@media` 和 `:root[data-rm="1"]` 各一份）。

动效来源：这些是对 Magic UI、Motion Primitives 等的效果创意的独立实现，没有复制它们的代码；见各 `meta.json` 的 `ref`。
