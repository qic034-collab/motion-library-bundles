// 测试用的假云端：数据存在浏览器 localStorage 里，规则和 supabase/schema.sql 一致
// （别人只能看到 public；只有主人能改；名字唯一且不能改；每人最多 300 条）。
// 用法：tools/cloud-test.html 里在 cloud.js 之前加载。
(function () {
  const K = "pc-mock-db";
  const load = () => { try { return JSON.parse(localStorage.getItem(K)) || {}; } catch (e) { return {}; } };
  const db = Object.assign({ users: [], profiles: [], items: [], session: null }, load());
  const save = () => localStorage.setItem(K, JSON.stringify(db));
  const uuid = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => { const r = (Math.random() * 16) | 0; return (c === "x" ? r : (r & 3) | 8).toString(16); });
  const sleep = () => new Promise((r) => setTimeout(r, 30));
  let cb = null;
  const cur = () => { const u = db.users.find((x) => x.id === db.session); return u ? { id: u.id, email: u.email } : null; };
  const fail = (message, code) => { const e = new Error(message); e.code = code; throw e; };
  window.CLOUD_BACKEND = {
    async init(onChange) { cb = onChange; await sleep(); return cur(); },
    async signIn(email) {
      await sleep();
      let u = db.users.find((x) => x.email === email);
      if (!u) { u = { id: uuid(), email }; db.users.push(u); }
      db.session = u.id; save(); // 真实环境要点邮件链接，这里直接当作点过了
      setTimeout(() => cb && cb(cur()), 50);
    },
    async signOut() { db.session = null; save(); },
    async profileByHandle(h) { await sleep(); return db.profiles.find((p) => p.handle === h) || null; },
    async profileById(id) { await sleep(); return db.profiles.find((p) => p.id === id) || null; },
    async saveProfile(p) {
      await sleep();
      const u = cur(); if (!u || u.id !== p.id) fail("not allowed", "42501");
      if (!/^[a-z0-9_-]{3,20}$/.test(p.handle)) fail("bad handle", "23514");
      const ex = db.profiles.find((x) => x.id === p.id);
      if (!ex && db.profiles.some((x) => x.handle === p.handle)) fail("duplicate key value", "23505");
      if (ex && ex.handle !== p.handle) fail("handle cannot be changed", "P0001");
      const row = { created_at: new Date().toISOString(), ...ex, ...p };
      db.profiles = db.profiles.filter((x) => x.id !== p.id).concat(row); save(); return row;
    },
    async items(userId) {
      await sleep(); const u = cur();
      return db.items.filter((i) => i.user_id === userId && (i.visibility === "public" || (u && u.id === userId))).sort((a, b) => b.created_at.localeCompare(a.created_at));
    },
    async saveItem(it) {
      await sleep(); const u = cur(); if (!u) fail("not signed in", "42501");
      if (it.id) {
        const ex = db.items.find((i) => i.id === it.id);
        if (!ex || ex.user_id !== u.id) fail("not allowed", "42501");
        const { id, user_id, created_at, ...rest } = it;
        Object.assign(ex, rest, { updated_at: new Date().toISOString() }); save(); return { ...ex };
      }
      if (it.user_id !== u.id) fail("not allowed", "42501");
      if (db.items.filter((i) => i.user_id === u.id).length >= 300) fail("item limit reached (300)", "P0001");
      if (it.kind === "motion" && db.items.some((i) => i.user_id === u.id && i.kind === "motion" && i.motion_id === it.motion_id)) fail("duplicate key value", "23505");
      if (!["public", "private"].includes(it.visibility)) fail("bad visibility", "23514");
      const row = { liked: false, ...it, id: uuid(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      db.items.push(row); save(); return { ...row };
    },
    async deleteItem(id) {
      await sleep(); const u = cur(); const ex = db.items.find((i) => i.id === id);
      if (!ex || !u || ex.user_id !== u.id) return;
      db.items = db.items.filter((i) => i.id !== id); save();
    },
  };
  window.__mockdb = db; // 调试用
})();
