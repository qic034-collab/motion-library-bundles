# 接上云端：登录、收藏、我的代码、个人主页

网站是纯静态页面，账号和数据放在 Supabase（免费额度够用）。**不接也能用**：`site/assets/config.js` 留空时，网站和以前一样，只是不显示登录和收藏。

## 一次性设置（约 10 分钟）

1. 到 [supabase.com](https://supabase.com) 注册并新建一个项目。
2. 左边 **SQL Editor** → 新建查询 → 把 [`schema.sql`](schema.sql) 整份粘贴进去 → **Run**。这一步会建表，并打开「公开的谁都能看、私密的只有自己能看」的权限规则。
3. **Authentication → URL Configuration**：
   - **Site URL** 填网站上线后的地址（例如 `https://你的名字.github.io/motion-library-bundles/`）；
   - **Redirect URLs** 里同样加上这个地址；本地调试再加 `http://localhost:8000/`（端口按你的来）。
4. **Project Settings → API**：复制 **Project URL** 和 **anon public** 密钥，填进 `site/assets/config.js`：
   ```js
   window.CLOUD_CONFIG = { url: "https://xxxx.supabase.co", anonKey: "eyJ…" };
   ```
   `anon` 密钥是公开的，可以放在网页里。**千万不要放 `service_role` 密钥。**
5. 把 `site/` 文件夹部署出去（GitHub Pages、Vercel、Netlify 都行）。

## 怎么用

- 点右上角 **登录** → 输入邮箱 → 点邮件里的链接回来 → 起一个主页名字。
- 动效库每张卡片右上角的爱心 = 收藏（默认只有自己能看）。
- 点自己的名字进入主页：每张卡片可以切换 **公开 / 私密**、标记喜欢、删除；**添加我的代码** 可以粘贴自己的 HTML / CSS / JS。
- 主页链接是 `…/#u=你的名字`，复制给别人，对方只能看到你设成公开的卡片。

## 安全说明

- 公开 / 私密由数据库的行级权限（`schema.sql` 里的 policy）保证，不是靠前端隐藏。
- 别人的代码只会在隔离的沙箱 iframe 里运行：不能联网，也读不到这个网站的任何数据，并且要点「运行预览」才会运行。
- 每人最多 300 条，每段代码最多 20000 字符。主页名字起好后不能改。
- 目前**没有举报和审核功能**。如果会有陌生人公开内容，上线前建议先加一个举报入口。

## 已知限制

- Supabase 自带的发信服务每小时只能发很少的邮件，正式上线要在 **Authentication → SMTP** 里接自己的邮件服务。
- 登录链接和浏览器绑定，在手机邮件 App 的内置浏览器里点开会登录不上，需要用系统浏览器打开。
- `tools/cloud-test.html` + `tools/mock-cloud.js` 是不连网的假云端，用来本地测界面；它只模拟规则，不能代替在真实 Supabase 上测一遍。
