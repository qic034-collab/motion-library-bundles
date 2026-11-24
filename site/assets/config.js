// 云端设置。留空时，网站照常使用，只是不显示登录、收藏和个人主页。
// 填法见 supabase/README.md。anonKey 是公开密钥，本来就设计成可以放在网页里（数据安全靠数据库的行级权限）。
// 绝对不要把 service_role 密钥放进来。
window.CLOUD_CONFIG = {
  url: "",     // 例如 https://xxxxxxxx.supabase.co
  anonKey: "", // Project Settings → API → anon public
};
