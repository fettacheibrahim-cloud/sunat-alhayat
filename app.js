const SUPABASE_URL = 'https://yepoakpeqonheksryalx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_kPVlHG491QyXLsYhvM7GOw_gJyVphsX';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
window.sb = sb;

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
  const links = [
    ['browse.html', 'التصفح'],
    ['interests.html', 'الاهتمامات'],
    ['messages.html', 'المحادثات'],
    ['profile.html', 'ملفي']
  ];
  const session = await getSession();
  if (!session) return;
  const { data: me } = await sb.from('profiles')
    .select('is_admin').eq('id', session.user.id).maybeSingle();
  if (me && me.is_admin) links.push(['admin.html', 'الإدارة']);

  const here = location.pathname.split('/').pop() || 'index.html';
  const bar = document.createElement('div');
  bar.style.cssText = 'display:flex;gap:8px;justify-content:center;flex-wrap:wrap;padding:10px;background:#FAF7F0;border-bottom:1px solid #e5dcc5';
  links.forEach(([href, label]) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    const on = here === href;
    a.style.cssText = 'padding:8px 16px;border-radius:999px;text-decoration:none;font-size:14px;' +
      (on ? 'background:#0E3B3C;color:#fff' : 'color:#0E3B3C;border:1px solid #0E3B3C');
    bar.appendChild(a);
  });
  document.body.prepend(bar);
})();
