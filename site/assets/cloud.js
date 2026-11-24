// 云端数据层：登录、个人资料、收藏。界面代码只通过 window.Cloud 访问，不直接碰 Supabase。
// 默认用 Supabase；测试时可以在这个文件之前定义 window.CLOUD_BACKEND 换成假的后端。
(function () {
  const cfg = window.CLOUD_CONFIG || {};
  const SDK = {
    src: "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js",
    integrity: "sha384-0w2KAL2YHP6wKOkUDzkCDGgVvfmHnj02DHeQ6XcHOgTfFsGyonKOpShMH1x6nk9o",
  };
  const enabled = !!(window.CLOUD_BACKEND || (cfg.url && cfg.anonKey));
  const listeners = [];
  let session = null;

  // ---------- Supabase 后端 ----------
  function supabaseBackend() {
    let sb = null;
    const load = () => new Promise((res, rej) => {
      if (window.supabase) return res();
      const s = document.createElement("script");
      s.src = SDK.src; s.integrity = SDK.integrity; s.crossOrigin = "anonymous";
      s.onload = res; s.onerror = () => rej(new Error("无法加载登录组件，请检查网络"));
      document.head.appendChild(s);
    });
    const client = async () => {
      if (sb) return sb;
      await load();
      // 网站用 #hash 存状态，所以登录回调必须走 ?code=（PKCE），不能走 #access_token
      sb = window.supabase.createClient(cfg.url, cfg.anonKey, { auth: { flowType: "pkce", persistSession: true, detectSessionInUrl: true } });
      return sb;
    };
    const must = ({ data, error }) => { if (error) throw error; return data; };
    return {
      async init(onChange) {
        const c = await client();
        const { data } = await c.auth.getSession();
        c.auth.onAuthStateChange((_e, s) => onChange(s && s.user ? { id: s.user.id, email: s.user.email } : null));
        return data.session && data.session.user ? { id: data.session.user.id, email: data.session.user.email } : null;
      },
      async signIn(email) {
        const c = await client();
        must(await c.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin + location.pathname } }));
      },
      async signOut() { must(await (await client()).auth.signOut()); },
      async profileByHandle(handle) {
        const c = await client();
        return must(await c.from("profiles").select("*").eq("handle", handle).maybeSingle());
      },
      async profileById(id) {
        const c = await client();
        return must(await c.from("profiles").select("*").eq("id", id).maybeSingle());
      },
      async saveProfile(p) { // p: { id, handle, display_name, bio }
        const c = await client();
        return must(await c.from("profiles").upsert(p).select().single());
      },
      // 行级权限会自动把别人的 private 过滤掉
      async items(userId) {
        const c = await client();
        return must(await c.from("items").select("*").eq("user_id", userId).order("created_at", { ascending: false }));
      },
      async saveItem(it) {
        const c = await client();
        if (it.id) { // 已有的：只改内容。用 update 而不是 upsert，避免被“每人 300 条”的插入检查误拦
          const { id, user_id, created_at, updated_at, ...rest } = it;
          return must(await c.from("items").update(rest).eq("id", id).select().single());
        }
        return must(await c.from("items").insert(it).select().single());
      },
      async deleteItem(id) { must(await (await client()).from("items").delete().eq("id", id)); },
    };
  }

  const backend = window.CLOUD_BACKEND || (enabled ? supabaseBackend() : null);
  let me = null; // 当前用户的 profile（可能为 null：还没起名字）

  const Cloud = {
    enabled,
    user: () => session,
    me: () => me,
    onChange(fn) { listeners.push(fn); },
    ready: false,
    profileError: null, // 读个人资料失败时不要误以为“还没起名字”
    async start() {
      if (!backend) return;
      const loadMe = async (s) => {
        Cloud.profileError = null; me = null;
        if (!s) return;
        try { me = await backend.profileById(s.id); } catch (e) { Cloud.profileError = e; }
      };
      try {
        session = await backend.init(async (s) => { session = s; await loadMe(s); listeners.forEach((f) => f()); });
        await loadMe(session);
      } catch (e) { Cloud.error = e; }
      Cloud.ready = true;
      listeners.forEach((f) => f());
    },
    signIn: (email) => backend.signIn(email),
    async signOut() { await backend.signOut(); session = null; me = null; listeners.forEach((f) => f()); },
    profileByHandle: (h) => backend.profileByHandle(h),
    async saveProfile(p) { me = await backend.saveProfile({ ...p, id: session.id }); listeners.forEach((f) => f()); return me; },
    items: (userId) => backend.items(userId),
    saveItem: (it) => backend.saveItem({ ...it, user_id: session.id }),
    deleteItem: (id) => backend.deleteItem(id),
  };
  window.Cloud = Cloud;
  // 等其它脚本都加载完再启动，这样监听登录状态的代码不会错过第一次通知
  if (enabled) (document.readyState === "loading" ? addEventListener("DOMContentLoaded", () => Cloud.start()) : setTimeout(() => Cloud.start(), 0));
})();
