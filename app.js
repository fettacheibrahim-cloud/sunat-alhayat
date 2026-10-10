const SUPABASE_URL = 'https://yepoakpeqonheksryalx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_kPVlHG491QyXLsYhvM7GOw_gJyVphsX';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
window.sb = sb;

(function () {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'style.css?v=8';
  document.head.appendChild(l);
})();

function showMsg(target, text, type) {
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) return;
  el.textContent = text;
  el.className = 'msg ' + (type || '');
  el.style.display = 'block';
}

async function getSession() {
  const { data } = await sb.auth.getSession();
  return data.session;
}

async function logout() {
  await sb.auth.signOut();
  location.href = 'auth.html';
}

(async function () {
  const session = await getSession();
  if (!session) return;

  const links = [
    ['browse.html', 'التصفح', '🔍'],
    ['interests.html', 'الاهتمامات', '💌'],
    ['messages.html', 'المحادثات', '💬'],
    ['profile.html', 'ملفي', '👤']
  ];
  const { data: me } = await sb.from('profiles')
    .select('is_admin').eq('id', session.user.id).maybeSingle();
  if (me && me.is_admin) links.push(['admin.html', 'الإدارة', '⚙️']);

  const st = document.createElement('style');
  st.textContent = `
    body{padding-bottom:84px !important}
    .app-top{position:sticky;top:0;z-index:50;display:flex;justify-content:space-between;align-items:center;
      padding:12px 18px;background:linear-gradient(135deg,#0E3B3C,#14595A);box-shadow:0 4px 14px rgba(14,59,60,.25)}
    .app-top a.brand{font:700 1.4rem 'Amiri',serif;color:#fff;text-decoration:none}
    .app-top a.brand span{color:#D8B565}
    .app-top button{background:transparent;border:1px solid rgba(255,255,255,.5);color:#fff;
      padding:6px 14px;border-radius:999px;font:500 13px 'Tajawal',sans-serif;cursor:pointer}
    .app-bar{position:fixed;bottom:0;right:0;left:0;z-index:50;display:flex;background:#fff;
      border-top:1px solid #E5DCC5;box-shadow:0 -6px 20px rgba(14,59,60,.1);padding-bottom:env(safe-area-inset-bottom)}
    .app-bar a{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;padding:9px 2px 8px;
      text-decoration:none;color:#6B6B63;font:500 12px 'Tajawal',sans-serif;border-top:3px solid transparent}
    .app-bar a i{font-style:normal;font-size:22px;line-height:1}
    .app-bar a.on{color:#0E3B3C;font-weight:700;border-top-color:#B8903F;background:#FAF7F0}
  `;
  document.head.appendChild(st);

  const here = location.pathname.split('/').pop() || 'index.html';

  const top = document.createElement('div');
  top.className = 'app-top';
  top.innerHTML = '<a class="brand" href="index.html">سنة <span>الحياة</span></a>';
  const out = document.createElement('button');
  out.textContent = 'خروج';
  out.onclick = logout;
  top.appendChild(out);

  const bar = document.createElement('nav');
  bar.className = 'app-bar';
  links.forEach(([href, label, icon]) => {
    const a = document.createElement('a');
    a.href = href;
    if (here === href) a.className = 'on';
    a.innerHTML = '<i>' + icon + '</i>' + label;
    bar.appendChild(a);
  });

  document.body.prepend(top);
  document.body.appendChild(bar);
})();
