/* القائمة الجانبية + تغيير الخلفيات (الموقع والمحادثة). تُحفظ الاختيارات على هذا الجهاز */
(function () {
  'use strict';
  var SITE = [
    ['default', 'الافتراضي', '#FAF7F0'],
    ['white', 'أبيض', '#FFFFFF'],
    ['mint', 'نعناعي', '#EAF4EE'],
    ['rose', 'وردي', '#FBEFF0'],
    ['sky', 'سماوي', '#EAF2FA'],
    ['lav', 'بنفسجي فاتح', '#F1EEF8'],
    ['warm', 'دافئ متدرّج', 'linear-gradient(180deg,#FAF7F0,#EFE6D0)'],
    ['dots', 'منقّط', 'radial-gradient(rgba(201,162,75,.28) 1.3px,transparent 1.3px) 0 0/22px 22px,#FAF7F0']
  ];
  var CHAT = [
    ['default', 'الافتراضي', '#F3EDDF'],
    ['white', 'أبيض', '#FFFFFF'],
    ['mint', 'نعناعي', '#E3F1E8'],
    ['rose', 'وردي', '#F9E6E8'],
    ['sky', 'سماوي', '#E1EDF8'],
    ['dots', 'منقّط', 'radial-gradient(rgba(14,59,60,.12) 1.3px,transparent 1.3px) 0 0/20px 20px,#F3EDDF'],
    ['night', 'ليلي', 'linear-gradient(180deg,#0f2526,#173a3c)']
  ];
  function get(k) { try { return localStorage.getItem(k) || 'default'; } catch (e) { return 'default'; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function find(list, id) { for (var i = 0; i < list.length; i++) if (list[i][0] === id) return list[i]; return list[0]; }

  var themeStyle = document.createElement('style'); themeStyle.id = 'themeCss'; document.head.appendChild(themeStyle);
  function applyTheme() {
    var s = find(SITE, get('theme_site')), c = find(CHAT, get('theme_chat'));
    var css = 'body{background:' + s[2] + ' !important;background-attachment:fixed}';
    css += '#box{background:' + c[2] + ' !important}';
    if (c[0] === 'night') css += '#box .b.other{background:#1f4244;color:#f3f7f5;border-color:#2c5a5c}#box .b.me{background:#D8B565;color:#0E3B3C}#box .b.me .rd.on{color:#0b5cad}#box .empty{color:#bcd0cc}';
    themeStyle.textContent = css;
  }
  applyTheme();
  window.applyTheme = applyTheme;

  var dirSign = (document.documentElement.dir === 'ltr') ? -1 : 1;
  var css = document.createElement('style');
  css.textContent =
    '#mBtn{background:transparent;border:1px solid rgba(255,255,255,.5);color:#fff;width:38px;height:36px;border-radius:12px;font-size:18px;line-height:1;cursor:pointer}' +
    '#mOv{position:fixed;inset:0;z-index:400;background:rgba(10,30,30,.55);opacity:0;pointer-events:none;transition:opacity .2s}' +
    '#mOv.open{opacity:1;pointer-events:auto}' +
    '#mPn{position:fixed;top:0;bottom:0;inset-inline-start:0;width:min(88vw,350px);z-index:401;background:#FAF7F0;box-shadow:0 0 30px rgba(0,0,0,.3);transform:translateX(' + (dirSign * 100) + '%);transition:transform .25s;overflow-y:auto;-webkit-overflow-scrolling:touch;font-family:Tajawal,sans-serif;color:#1F2D2D}' +
    '#mPn.open{transform:none}' +
    '#mPn .mh{background:linear-gradient(135deg,#0E3B3C,#14595A);color:#fff;padding:22px 18px 18px;display:flex;align-items:center;gap:12px}' +
    '#mPn .mav{flex:none;width:54px;height:54px;border-radius:50%;background:#FAF7F0;color:#0E3B3C;display:flex;align-items:center;justify-content:center;font:700 24px Amiri,serif}' +
    '#mPn .mnm{font-weight:700;font-size:17px}' +
    '#mPn .mnm a{display:block;font-size:13px;font-weight:400;color:#D8B565;text-decoration:none;margin-top:2px}' +
    '#mPn .mx{margin-inline-start:auto;background:rgba(255,255,255,.15);border:0;color:#fff;width:34px;height:34px;border-radius:50%;font-size:16px;cursor:pointer}' +
    '#mPn .mgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px}' +
    '#mPn .mt{display:flex;flex-direction:column;gap:6px;background:#fff;border:1px solid #E8E0CC;border-radius:14px;padding:12px;text-decoration:none;color:#0E3B3C;font-weight:700;font-size:14.5px;box-shadow:0 3px 10px rgba(14,59,60,.05)}' +
    '#mPn .mt i{font-style:normal;font-size:22px}' +
    '#mPn .ms{padding:4px 14px 2px;color:#6B6B63;font-size:12.5px;font-weight:700;letter-spacing:.5px}' +
    '#mPn .ml{margin:6px 14px 10px;background:#fff;border:1px solid #E8E0CC;border-radius:14px;overflow:hidden}' +
    '#mPn .mi{display:flex;align-items:center;gap:12px;width:100%;padding:13px 14px;background:none;border:0;border-bottom:1px solid #F0EADB;text-align:start;text-decoration:none;color:#1F2D2D;font:500 15px Tajawal,sans-serif;cursor:pointer}' +
    '#mPn .mi:last-child{border-bottom:0}#mPn .mi i{font-style:normal;width:30px;height:30px;border-radius:10px;background:#F3EDDF;display:inline-flex;align-items:center;justify-content:center;font-size:16px;flex:none}' +
    '#mPn .mi small{margin-inline-start:auto;color:#6B6B63;font-size:12px}' +
    '#mPn .mi.out{color:#B42318}' +
    '#mTh{position:fixed;inset:0;z-index:410;display:none;align-items:flex-end;justify-content:center;background:rgba(10,30,30,.55)}' +
    '#mTh.open{display:flex}' +
    '#mTh .sheet{background:#FAF7F0;width:100%;max-width:520px;border-radius:22px 22px 0 0;padding:18px 16px 26px;max-height:86vh;overflow-y:auto;font-family:Tajawal,sans-serif;color:#1F2D2D}' +
    '#mTh h3{margin:6px 0 10px;font-family:Amiri,serif;color:#0E3B3C}' +
    '#mTh .sw{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:12px}' +
    '#mTh .sw button{width:56px;display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:0;cursor:pointer;font:500 11px Tajawal,sans-serif;color:#1F2D2D;padding:0}' +
    '#mTh .sw b{width:46px;height:46px;border-radius:50%;border:2px solid #E8E0CC;display:flex;align-items:center;justify-content:center;font-size:18px;color:#0E3B3C}' +
    '#mTh .sw button.on b{border-color:#0E3B3C;box-shadow:0 0 0 3px #D8B56588}' +
    '#mTh .row{display:flex;gap:8px;margin-top:8px}' +
    '#mTh .row button{flex:1;padding:11px;border-radius:12px;border:1px solid #E8E0CC;background:#fff;font:700 14px Tajawal,sans-serif;color:#0E3B3C;cursor:pointer}' +
    '#mTh .row button.p{background:#0E3B3C;color:#fff;border-color:#0E3B3C}';
  document.head.appendChild(css);

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function tile(href, icon, label) { var a = el('a', 'mt'); a.href = href; a.appendChild(el('i', '', icon)); a.appendChild(el('span', '', label)); return a; }
  function item(icon, label, href, fn, small) {
    var n = el(href ? 'a' : 'button', 'mi'); if (href) n.href = href; else n.type = 'button';
    n.appendChild(el('i', '', icon)); n.appendChild(el('span', '', label));
    if (small) { var s = el('small', '', small); n.appendChild(s); n._small = s; }
    if (fn) n.onclick = fn; return n;
  }

  var ov = el('div'); ov.id = 'mOv';
  var pn = el('aside'); pn.id = 'mPn'; pn.setAttribute('role', 'dialog');
  function open() { ov.classList.add('open'); pn.classList.add('open'); }
  function close() { ov.classList.remove('open'); pn.classList.remove('open'); }
  ov.onclick = close;
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); closeTheme(); } });

  /* ---- نافذة المظهر ---- */
  var th = el('div'); th.id = 'mTh';
  function closeTheme() { th.classList.remove('open'); }
  th.onclick = function (e) { if (e.target === th) closeTheme(); };
  function swatches(list, key, title) {
    var box = el('div'); box.appendChild(el('h3', '', title));
    var sw = el('div', 'sw');
    list.forEach(function (o) {
      var b = el('button'); b.type = 'button';
      var c = el('b'); c.style.background = o[2]; if (o[0] === 'night') c.style.color = '#D8B565';
      c.textContent = o[0] === get(key) ? '✓' : '';
      b.appendChild(c); b.appendChild(el('span', '', o[1]));
      if (o[0] === get(key)) b.className = 'on';
      b.onclick = function () { set(key, o[0]); applyTheme(); renderTheme(); };
      sw.appendChild(b);
    });
    box.appendChild(sw); return box;
  }
  function renderTheme() {
    th.textContent = '';
    var sheet = el('div', 'sheet');
    sheet.appendChild(swatches(SITE, 'theme_site', 'خلفية الموقع'));
    sheet.appendChild(swatches(CHAT, 'theme_chat', 'خلفية المحادثة'));
    var row = el('div', 'row');
    var rs = el('button', '', 'إعادة الضبط'); rs.type = 'button'; rs.onclick = function () { set('theme_site', 'default'); set('theme_chat', 'default'); applyTheme(); renderTheme(); };
    var ok = el('button', 'p', 'تم'); ok.type = 'button'; ok.onclick = closeTheme;
    row.append(rs, ok); sheet.appendChild(row);
    th.appendChild(sheet);
  }

  /* ---- بناء اللوحة ---- */
  function notifState() { return ('Notification' in window) ? (Notification.permission === 'granted' ? 'مفعّلة' : Notification.permission === 'denied' ? 'محظورة' : 'غير مفعّلة') : 'غير مدعومة'; }

  function build(name, isAdmin) {
    pn.textContent = '';
    var h = el('div', 'mh');
    h.appendChild(el('div', 'mav', (name || 'س').charAt(0).toUpperCase()));
    var nm = el('div', 'mnm'); nm.appendChild(el('span', '', name || 'عضو'));
    var pa = el('a', '', 'عرض ملفي'); pa.href = 'profile.html'; nm.appendChild(pa); h.appendChild(nm);
    var x = el('button', 'mx', '✕'); x.type = 'button'; x.onclick = close; h.appendChild(x);
    pn.appendChild(h);

    var g = el('div', 'mgrid');
    [['home.html', '🏠', 'لوحتي'], ['browse.html', '🔍', 'التصفح'], ['interests.html', '💌', 'الاهتمامات'],
     ['messages.html', '💬', 'المحادثات'], ['favorites.html', '❤️', 'المفضلة'], ['profile.html', '👤', 'ملفي']]
      .forEach(function (t) { g.appendChild(tile(t[0], t[1], t[2])); });
    pn.appendChild(g);

    function section(title, items) {
      pn.appendChild(el('div', 'ms', title));
      var l = el('div', 'ml'); items.forEach(function (i) { l.appendChild(i); }); pn.appendChild(l);
    }
    section('الخدمات', [
      item('🌟', 'العضوية المميزة', 'premium.html'),
      item('✅', 'توثيق الحساب', 'verify.html'),
      item('🎁', 'ادعُ صديقاً', 'home.html#inv'),
      item('📣', 'انشر الموقع', 'share.html'),
      item('📚', 'مقالات ونصائح', 'articles.html'),
      item('🛡️', 'نصائح الأمان', 'article-safe-dating.html')
    ]);
    var nItem = item('🔔', 'الإشعارات', null, function () {
      if (!('Notification' in window)) return;
      if (Notification.permission === 'denied') { alert('الإشعارات محظورة. فعّلها من إعدادات الموقع في المتصفح.'); return; }
      Notification.requestPermission().then(function (p) {
        if (p === 'granted' && window.ensurePush) window.ensurePush();
        if (nItem._small) nItem._small.textContent = notifState();
      });
    }, notifState());
    section('الإعدادات', [
      item('🎨', 'المظهر والخلفيات', null, function () { close(); renderTheme(); th.classList.add('open'); }),
      nItem,
      item('📲', 'تثبيت التطبيق', 'install.html')
    ]);
    var help = [
      item('❓', 'الأسئلة الشائعة', 'faq.html'),
      item('✉️', 'اتصل بنا', 'contact.html'),
      item('📄', 'الشروط والخصوصية', 'legal.html')
    ];
    if (isAdmin) help.unshift(item('⚙️', 'لوحة الإدارة', 'admin.html'));
    section('المساعدة', help);
    var lo = item('🚪', 'تسجيل الخروج', null, function () { if (window.logout) window.logout(); });
    lo.className += ' out';
    var l2 = el('div', 'ml'); l2.appendChild(lo); pn.appendChild(l2);
    pn.appendChild(el('div', '', '')).style.height = '24px';
  }

  document.body.append(ov, pn, th);
  build('', false);
  var btn = document.getElementById('mBtn');
  if (btn) btn.onclick = function () { open(); };
  window.openMenu = open;

  (async function () {
    try {
      var me = window.__me; if (!me) return;
      var r = await window.sb.from('profiles').select('first_name,is_admin').eq('id', me).maybeSingle();
      if (r.data) build(r.data.first_name, !!r.data.is_admin);
    } catch (e) {}
  })();
})();
