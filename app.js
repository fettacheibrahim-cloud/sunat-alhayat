const SUPABASE_URL = 'https://yepoakpeqonheksryalx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_kPVlHG491QyXLsYhvM7GOw_gJyVphsX';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
window.sb = sb;

// المفتاح العام لإشعارات الهاتف (VAPID). المفتاح الخاص يبقى في أسرار Supabase فقط
const VAPID_PUBLIC = 'BHzS68u1WQunIPwMWFySXp4MOfdRXcRsW3B1A_JjcYGpm-VHltpBYEou0XajASSq7b2iPigjVkWR_dxuCNHZ22g';

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

// رسالة «الحساب غير مقبول بعد»: قيد المراجعة، أو موقوف/مرفوض مع سبب الإدارة إن وُجد
function showNotApproved(target, mine, pendingText) {
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) return;
  if (!mine || mine.status !== 'suspended') { showMsg(el, pendingText, 'error'); return; }
  el.textContent = '';
  el.className = 'msg error';
  el.appendChild(document.createTextNode('تم إيقاف حسابك أو رفضه.'));
  if (mine.reject_reason) {
    el.appendChild(document.createElement('br'));
    el.appendChild(document.createTextNode('السبب:'));
    el.appendChild(document.createTextNode(' '));
    const r = document.createElement('span'); r.className = 'ugc'; r.textContent = mine.reject_reason;
    el.appendChild(r);
  }
  el.appendChild(document.createElement('br'));
  el.appendChild(document.createTextNode('عدّل ملفك ثم راسلنا ليُعاد فحصه.'));
  el.appendChild(document.createTextNode(' '));
  const a = document.createElement('a'); a.href = 'contact.html'; a.textContent = 'اتصل بنا';
  el.appendChild(a);
  el.style.display = 'block';
}

async function getSession() {
  const { data } = await sb.auth.getSession();
  return data.session;
}

async function logout() {
  // نزيل اشتراك هذا الجهاز من حسابي حتى لا تصل إشعاراتي لمن يستعمل الجهاز بعدي
  try {
    const reg = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistration() : null;
    const sub = reg && reg.pushManager ? await reg.pushManager.getSubscription() : null;
    if (sub) { await sb.rpc('delete_push_subscription', { p_endpoint: sub.endpoint }); localStorage.removeItem('push_sig'); }
  } catch (e) {}
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
    .vf{display:inline-block;margin-inline-start:6px;padding:1px 9px;border-radius:999px;background:#e3f0ff;color:#0b5cad;font:700 12px 'Tajawal',sans-serif;vertical-align:middle;white-space:nowrap}
    .app-banner{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 16px;background:#fff1cc;color:#5c4400;font:500 14px 'Tajawal',sans-serif;border-bottom:1px solid #e5d49a}
    .app-banner span{flex:1;min-width:160px}
    .app-banner span::before{content:'⭐ '}
    .app-banner a{background:#0E3B3C;color:#fff;border-radius:999px;padding:5px 14px;text-decoration:none;font-weight:700}
    .app-banner button{background:none;border:0;font-size:18px;cursor:pointer;color:inherit;padding:0 4px}
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

  // اشتراك الهاتف في الإشعارات (يعمل بعد منح الإذن). نحفظه في الخادم ليصلك تنبيه والتطبيق مغلق
  const b64u = s => { const p = '='.repeat((4 - s.length % 4) % 4), r = atob((s + p).replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(r, c => c.charCodeAt(0)); };
  async function ensurePush() {
    try {
      if (!VAPID_PUBLIC || !('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window) || Notification.permission !== 'granted') return false;
      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        try { sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64u(VAPID_PUBLIC) }); }
        catch (e) { return false; }
      }
      const j = sub.toJSON();
      if (!j.keys) return false;
      const lang = window.I18N_LANG || 'ar';
      const sig = [j.endpoint, me, lang].join('|');
      let saved = ''; try { saved = localStorage.getItem('push_sig') || ''; } catch (e) {}
      if (saved === sig) return true;
      const { error } = await sb.rpc('save_push_subscription', { p_endpoint: j.endpoint, p_p256dh: j.keys.p256dh, p_auth: j.keys.auth, p_lang: lang });
      if (error) return false;
      try { localStorage.setItem('push_sig', sig); } catch (e) {}
      return true;
    } catch (e) { return false; }
  }
  window.ensurePush = ensurePush;

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
      if (p === 'granted') { toast('تم تفعيل الإشعارات ✓', here); ensurePush(); }
    };
    actions.insertBefore(bell, out);
  }

  // زر «تثبيت» (أندرويد/حاسوب) ولافتة إرشاد لآيفون
  const isStandalone = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone;
  if (!isStandalone()) {
    const inst = document.createElement('button');
    inst.textContent = '📲 تثبيت'; inst.style.display = 'none';
    inst.onclick = async () => {
      const e = window.__bip; if (!e) return;
      e.prompt();
      try { await e.userChoice; } catch (x) {}
      window.__bip = null; inst.style.display = 'none';
    };
    const showInst = () => { if (window.__bip && !isStandalone()) inst.style.display = ''; };
    actions.insertBefore(inst, out);
    showInst(); window.addEventListener('bip', showInst);
    window.addEventListener('appinstalled', () => { inst.style.display = 'none'; });

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    let iosSeen = false; try { iosSeen = !!localStorage.getItem('ios_tip'); } catch (e) {}
    if (ios && !iosSeen && here !== 'install.html') {
      const bn = document.createElement('div'); bn.className = 'app-banner';
      const sp = document.createElement('span'); sp.textContent = 'لتثبيت التطبيق: اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية».';
      const go = document.createElement('a'); go.href = 'install.html'; go.textContent = 'كيف؟';
      const x = document.createElement('button'); x.type = 'button'; x.textContent = '×'; x.setAttribute('aria-label', 'Close');
      x.onclick = () => { bn.remove(); try { localStorage.setItem('ios_tip', '1'); } catch (e) {} };
      bn.append(sp, go, x);
      top.insertAdjacentElement('afterend', bn);
    }
  }

  // لافتة تجديد العضوية المميزة: قبل 3 أيام من الانتهاء أو خلال 14 يوماً بعده (تُغلق لبقية اليوم)
  (async function membershipBanner() {
    try {
      if (here === 'premium.html') return;
      const { data } = await sb.rpc('my_membership');
      if (!data) return;
      const until = new Date(data), ms = until - Date.now(), c = Math.ceil(ms / 864e5);
      if (c > 3 || ms < -14 * 864e5) return;
      const key = 'mb_' + me + '_' + until.toISOString().slice(0, 10) + '_' + new Date().toDateString();
      try { if (localStorage.getItem(key)) return; } catch (e) {}
      const text = ms <= 0 ? 'انتهت عضويتك المميزة. جدّدها لتستعيد الشارة والحدّ الأعلى.'
        : c <= 1 ? 'تنتهي عضويتك المميزة خلال 24 ساعة.'
        : c === 2 ? 'تنتهي عضويتك المميزة خلال يومين.' : 'تنتهي عضويتك المميزة خلال 3 أيام.';
      const bn = document.createElement('div'); bn.className = 'app-banner';
      const sp = document.createElement('span'); sp.textContent = text;
      const go = document.createElement('a'); go.href = 'premium.html'; go.textContent = 'جدّد الآن';
      const x = document.createElement('button'); x.type = 'button'; x.textContent = '×'; x.setAttribute('aria-label', 'Close');
      x.onclick = () => { bn.remove(); try { localStorage.setItem(key, '1'); } catch (e) {} };
      bn.append(sp, go, x);
      top.insertAdjacentElement('afterend', bn);
    } catch (e) {}
  })();

  document.addEventListener('visibilitychange', () => { if (!document.hidden) poll(); });
  ensurePush();
  poll();
  setInterval(poll, 15000);
})();
