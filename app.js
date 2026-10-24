const SUPABASE_URL = 'https://yepoakpeqonheksryalx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_kPVlHG491QyXLsYhvM7GOw_gJyVphsX';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
window.sb = sb;

(function () {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'style.css?v=10';
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
  const me = session.user.id;

  const links = [
    ['browse.html', 'التصفح', '🔍'],
    ['interests.html', 'الاهتمامات', '💌'],
    ['messages.html', 'المحادثات', '💬'],
    ['profile.html', 'ملفي', '👤']
  ];
  const { data: prof } = await sb.from('profiles')
    .select('is_admin').eq('id', me).maybeSingle();
  if (prof && prof.is_admin) links.push(['admin.html', 'الإدارة', '⚙️']);

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
    .app-bar a{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;padding:9px 2px 8px;
      text-decoration:none;color:#6B6B63;font:500 12px 'Tajawal',sans-serif;border-top:3px solid transparent}
    .app-bar a i{font-style:normal;font-size:22px;line-height:1}
    .app-bar a.on{color:#0E3B3C;font-weight:700;border-top-color:#B8903F;background:#FAF7F0}
    .app-badge{position:absolute;top:3px;left:calc(50% + 6px);background:#C0392B;color:#fff;border-radius:999px;
      min-width:18px;height:18px;padding:0 5px;font:700 11px 'Tajawal',sans-serif;display:none;align-items:center;justify-content:center}
    .app-toast{display:none;position:fixed;top:66px;right:12px;left:12px;max-width:420px;margin:0 auto;
      background:#0E3B3C;color:#fff;border:1px solid #D8B565;border-radius:14px;padding:12px 16px;z-index:100;
      box-shadow:0 8px 24px rgba(0,0,0,.25);cursor:pointer;font:500 15px 'Tajawal',sans-serif}
  `;
  document.head.appendChild(st);

  const here = location.pathname.split('/').pop() || 'index.html';

  const top = document.createElement('div');
  top.className = 'app-top';
  top.innerHTML = '<a class="brand" href="index.html">سنة <span>الحياة</span></a>';
  const out = document.createElement('button');
  out.textContent = 'خروج';
  out.onclick = logout;
  const actions = document.createElement('div');
  actions.style.cssText = 'display:flex;gap:8px;align-items:center';
  if (window.i18nSwitcher) {
    const fl = document.querySelector('.lang-float'); if (fl) fl.remove();
    actions.appendChild(window.i18nSwitcher());
  }
  actions.appendChild(out);
  top.appendChild(actions);

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

  // ================= الإشعارات =================
  const baseTitle = document.title;
  const names = {};
  let prevUnread = null, prevInterests = null, lastTotal = null, toastTimer = null;

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});

  function setBadge(href, n) {
    const a = bar.querySelector('a[href="' + href + '"]');
    if (!a) return;
    let b = a.querySelector('.app-badge');
    if (!b) { b = document.createElement('span'); b.className = 'app-badge'; a.appendChild(b); }
    b.textContent = n > 99 ? '99+' : String(n);
    b.style.display = n > 0 ? 'flex' : 'none';
  }

  function toast(text, href) {
    let t = document.querySelector('.app-toast');
    if (!t) { t = document.createElement('div'); t.className = 'app-toast'; document.body.appendChild(t); }
    t.textContent = '🔔 ' + text;
    t.onclick = () => { location.href = href; };
    t.style.display = 'block';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.style.display = 'none'; }, 6000);
  }

  function beep() {
    try {
      const C = window.AudioContext || window.webkitAudioContext;
      const c = new C(), o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.frequency.value = 880; g.gain.value = 0.08;
      o.start(); o.stop(c.currentTime + 0.18);
    } catch (e) {}
  }

  async function systemNotify(text, href) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    try {
      const reg = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.showNotification('سنة الحياة', { body: text, tag: href, dir: document.documentElement.dir || 'rtl', lang: document.documentElement.lang || 'ar', data: { url: href } });
        return;
      }
    } catch (e) {}
    try { new Notification('سنة الحياة', { body: text, tag: href }); } catch (e) {}
  }

  function alertUser(text, href) {
    if (window.i18nT) text = window.i18nT(text);
    if (document.hidden) systemNotify(text, href);
    else { toast(text, href); beep(); }
  }

  const seenOf = o => { try { return localStorage.getItem('seen_' + me + '_' + o) || ''; } catch (e) { return ''; } };
  const chatOpen = () => {
    const v = document.getElementById('chatView');
    return here === 'messages.html' && !!v && v.style.display === 'block';
  };
  const openWith = () => (chatOpen() && typeof curOther !== 'undefined') ? curOther : null;

  async function nameOf(ids) {
    const need = ids.filter(i => !names[i]);
    if (!need.length) return;
    const { data } = await sb.from('profiles').select('id,first_name').in('id', need);
    (data || []).forEach(p => { names[p.id] = p.first_name; });
  }

  async function poll() {
    try {
      const [cv, bl, it] = await Promise.all([
        sb.from('conversations').select('id,user_a,user_b').or('user_a.eq.' + me + ',user_b.eq.' + me),
        sb.from('blocks').select('blocker_id,blocked_id').or('blocker_id.eq.' + me + ',blocked_id.eq.' + me),
        sb.from('interests').select('id', { count: 'exact', head: true }).eq('to_id', me).in('status', ['sent', 'pending'])
      ]);
      if (cv.error) return;

      const hidden = new Set();
      (bl.data || []).forEach(b => hidden.add(b.blocker_id === me ? b.blocked_id : b.blocker_id));
      const owner = {};
      (cv.data || []).forEach(c => {
        const o = c.user_a === me ? c.user_b : c.user_a;
        if (!hidden.has(o)) owner[c.id] = o;
      });

      const unread = {};
      const ids = Object.keys(owner);
      if (ids.length) {
        const { data: ms } = await sb.from('messages').select('conversation_id,created_at')
          .in('conversation_id', ids).neq('sender_id', me)
          .order('created_at', { ascending: false }).limit(300);
        (ms || []).forEach(m => {
          const o = owner[m.conversation_id];
          if (o && m.created_at > seenOf(o)) unread[o] = (unread[o] || 0) + 1;
        });
      }

      const total = Object.values(unread).reduce((a, b) => a + b, 0);
      const pend = it.count || 0;
      setBadge('messages.html', total);
      setBadge('interests.html', pend);
      document.title = (total + pend > 0 ? '(' + (total + pend) + ') ' : '') + baseTitle;

      if (prevUnread !== null) {
        const skip = openWith();
        const fresh = Object.keys(unread).filter(o => o !== skip && unread[o] > (prevUnread[o] || 0));
        if (fresh.length) {
          await nameOf(fresh);
          alertUser('رسالة جديدة من ' + (names[fresh[0]] || 'عضو') +
            (fresh.length > 1 ? ' و' + (fresh.length - 1) + ' آخرين' : ''), 'messages.html');
        } else if (pend > prevInterests) {
          alertUser('وصلك اهتمام جديد 💌', 'interests.html');
        }
      }

      if (typeof loadList === 'function' && here === 'messages.html' && !chatOpen() && total !== lastTotal) loadList();
      prevUnread = unread; prevInterests = pend; lastTotal = total;
    } catch (e) {}
  }

  if ('Notification' in window && Notification.permission === 'default') {
    const bell = document.createElement('button');
    bell.textContent = '🔔 تفعيل';
    bell.onclick = async () => {
      const p = await Notification.requestPermission();
      if (p !== 'default') bell.remove();
      if (p === 'granted') toast('تم تفعيل الإشعارات ✓', here);
    };
    actions.insertBefore(bell, out);
  }

  document.addEventListener('visibilitychange', () => { if (!document.hidden) poll(); });
  poll();
  setInterval(poll, 15000);
})();
