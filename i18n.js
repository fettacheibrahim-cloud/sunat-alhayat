// دعم اللغات (العربية / الفرنسية / الإنجليزية)
// الصفحات مكتوبة بالعربية، وهذا الملف يترجم النصوص الظاهرة عند التحميل وعند ظهور نصوص جديدة،
// اعتماداً على القاموس في i18n-dict.js. اللغة المحفوظة في localStorage باسم «lang».
(function () {
  var LANGS = { ar: 'العربية', fr: 'Français', en: 'English' };
  var lang = 'ar';
  try { lang = localStorage.getItem('lang') || 'ar'; } catch (e) {}
  if (!LANGS[lang]) lang = 'ar';
  window.I18N_LANG = lang;

  var root = document.documentElement;
  root.setAttribute('lang', lang);
  root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  var st = document.createElement('style');
  st.textContent =
    '.lang-sel{font:500 13px Tajawal,sans-serif;border-radius:999px;padding:5px 10px;cursor:pointer;width:auto;min-height:0}' +
    '.app-top .lang-sel{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.5)}' +
    '.app-top .lang-sel option{color:#1F2D2D}' +
    '.lang-float{position:fixed;bottom:12px;left:12px;z-index:60}' +
    '.lang-float .lang-sel{background:#fff;color:#0E3B3C;border:1px solid #E8E0CC;box-shadow:0 2px 10px rgba(14,59,60,.15)}' +
    '[dir=ltr] .b.me{align-self:flex-end !important}[dir=ltr] .b.other{align-self:flex-start !important}' +
    '[dir=ltr] ol,[dir=ltr] ul{padding-right:0 !important;padding-left:20px}' +
    '[dir=ltr] .plan ul{padding:0 0 0 18px}' +
    '[dir=ltr] .vip{margin-right:0;margin-left:6px}.vip{white-space:nowrap}' +
    '[dir=ltr] .app-top a.brand{font-size:1.15rem;white-space:nowrap}.app-top .lang-sel{padding:4px 6px}' +
    '[dir=ltr] #lb button{left:auto;right:14px}';
  document.head.appendChild(st);

  window.i18nSwitcher = function () {
    var s = document.createElement('select');
    s.className = 'lang-sel';
    s.setAttribute('aria-label', 'Language');
    Object.keys(LANGS).forEach(function (k) {
      var o = document.createElement('option'); o.value = k; o.textContent = LANGS[k]; s.appendChild(o);
    });
    s.value = lang;
    s.onchange = function () {
      try { localStorage.setItem('lang', s.value); } catch (e) {}
      location.reload();
    };
    return s;
  };

  function mountFloat() {
    if (document.querySelector('.app-top') || document.querySelector('.lang-float')) return;
    var w = document.createElement('div'); w.className = 'lang-float';
    w.appendChild(window.i18nSwitcher());
    document.body.appendChild(w);
  }
  if (document.body) mountFloat(); else document.addEventListener('DOMContentLoaded', mountFloat);

  window.i18nT = function (s) { return s; };
  if (lang === 'ar') return; // العربية هي الأصل: لا شيء يُترجم

  var D = window.I18N_DICT || {};
  var X = lang === 'fr' ? 0 : 1;
  var AR = /[؀-ۿ]/;
  function L(fr, en) { return lang === 'fr' ? fr : en; }
  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
  function ex(key) { var e = D[key]; return e ? e[X] : null; }

  // ترجمة الآية بالإنجليزية الموجودة في الصفحة إلى الفرنسية
  var VERSE_EN = '"And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought." (Quran 30:21)';
  if (lang === 'fr') D[VERSE_EN] = ['« Et parmi Ses signes : Il a créé de vous, pour vous, des épouses pour que vous trouviez la quiétude auprès d\'elles, et Il a mis entre vous de l\'affection et de la bonté. Il y a en cela des signes pour des gens qui réfléchissent. » (Coran 30:21)'];

  // مفاتيح تنتهي بنقطتين: تُترجم كبادئة ويبقى باقي النص (أسماء، رسائل خطأ…)
  var PREFIX = Object.keys(D).filter(function (k) { return /[:：]$/.test(k) && k.length > 3; })
    .sort(function (a, b) { return b.length - a.length; });

  var PAT = [
    [/^عدد النتائج: (\d+)(?: من (\d+))?$/, function (m) { return L('Résultats : ', 'Results: ') + m[1] + (m[2] ? L(' sur ', ' of ') + m[2] : ''); }],
    [/^(?:اهتماماتك|الاهتمامات) في آخر 7 أيام: (\d+) من (\d+)$/, function (m) { return L('Intérêts ces 7 derniers jours : ', 'Interests in the last 7 days: ') + m[1] + L(' sur ', ' of ') + m[2]; }],
    [/^نقاط التقاء: (.+)$/, function (m) { return L('Points communs : ', 'Common ground: ') + m[1].split(' • ').map(function (p) { return ex(norm(p)) || p; }).join(' • '); }],
    [/^أنت: (.*)$/, function (m) { return L('Vous : ', 'You: ') + (ex(norm(m[1])) || m[1]); }],
    [/^هل تريد حظر (.+)؟ لن تظهر لك المحادثة بعد الآن\.$/, function (m) { return L('Voulez-vous bloquer ' + m[1] + ' ? La conversation ne s\'affichera plus.', 'Do you want to block ' + m[1] + '? The chat will no longer be shown to you.'); }],
    [/^(🔔 )?رسالة جديدة من (.+?)(?: و(\d+) آخرين)?$/, function (m) { return (m[1] || '') + L('Nouveau message de ', 'New message from ') + m[2] + (m[3] ? L(' et ' + m[3] + ' autres', ' and ' + m[3] + ' others') : ''); }],
    [/^(🔔 )?وصلك اهتمام جديد 💌$/, function (m) { return (m[1] || '') + L('Vous avez reçu un nouvel intérêt 💌', 'You received a new interest 💌'); }],
    [/^وفّر (\d+) درهماً$/, function (m) { return L('Économisez ' + m[1] + ' MAD', 'Save ' + m[1] + ' MAD'); }],
    [/^(\d+) درهماً$/, function (m) { return m[1] + ' MAD'; }],
    [/^ينتهي في (.+)$/, function (m) { return L('Expire le ', 'Expires on ') + m[1]; }]
  ];

  // استبدالات داخل النص (للأرقام والوحدات) — لا تُطبَّق على نصوص الأعضاء
  var INL = [
    [/(\d+) سنة/g, L('$1 ans', '$1 years')],
    [/(\d+)٪ توافق/g, L('$1 % de compatibilité', '$1% match')],
    [/(\d+)٪/g, '$1%'],
    [/(\d+) سم/g, '$1 cm'],
    [/— تأكد من تشغيل ملف (\S+)/g, L('— vérifiez que le fichier $1 a été exécuté', '— make sure the file $1 has been run')]
  ];

  function trCore(core) {
    var key = norm(core);
    var e = D[key];
    if (e) return e[X] != null ? e[X] : core;
    if (!AR.test(key)) return core;
    for (var i = 0; i < PAT.length; i++) { var m = PAT[i][0].exec(key); if (m) return PAT[i][1](m); }
    for (var j = 0; j < PREFIX.length; j++) {
      var p = PREFIX[j];
      if (key.indexOf(p) === 0) {
        var rest = key.slice(p.length).trim();
        return D[p][X] + (rest ? ' ' + trCore(rest) : '');
      }
    }
    var r = key;
    for (var k = 0; k < INL.length; k++) r = r.replace(INL[k][0], INL[k][1]);
    return r;
  }

  function tr(s) {
    if (!s) return s;
    var m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s);
    if (!m[2]) return s;
    var out = trCore(m[2]);
    return out === m[2] ? s : m[1] + out + m[3];
  }
  window.i18nT = tr;

  // نصوص الأعضاء لا تُترجم تلقائياً (النبذة، رسائل المحادثة، ترجمة الرسائل)
  var SKIP = '.ugc,.bio,textarea,script,style';
  function skipNode(n) {
    var el = n.nodeType === 1 ? n : n.parentNode;
    return !el || (el.closest && el.closest(SKIP));
  }

  var ATTRS = ['placeholder', 'title', 'alt', 'aria-label'];
  function doNode(n) {
    if (n.nodeType === 3) {
      if (skipNode(n)) return;
      var t = tr(n.nodeValue);
      if (t !== n.nodeValue) n.nodeValue = t;
      return;
    }
    if (n.nodeType !== 1) return;
    var tag = n.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') return;
    if (skipNode(n)) return;
    ATTRS.forEach(function (a) {
      if (n.hasAttribute(a)) { var v = n.getAttribute(a), t = tr(v); if (t !== v) n.setAttribute(a, t); }
    });
    for (var c = n.firstChild; c; c = c.nextSibling) doNode(c);
  }

  function doTitle() { var t = tr(document.title); if (t !== document.title) document.title = t; }

  function run() { doNode(document.body); doTitle(); }
  run();

  var busy = false;
  var obs = new MutationObserver(function (list) {
    if (busy) return;
    busy = true;
    list.forEach(function (r) {
      if (r.type === 'characterData') doNode(r.target);
      else if (r.type === 'attributes') {
        var v = r.target.getAttribute(r.attributeName), t = tr(v);
        if (t !== v && !skipNode(r.target)) r.target.setAttribute(r.attributeName, t);
      } else r.addedNodes.forEach(doNode);
    });
    doTitle();
    obs.takeRecords();
    busy = false;
  });
  obs.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });

  // النوافذ المنبثقة
  var _alert = window.alert, _confirm = window.confirm, _prompt = window.prompt;
  window.alert = function (m) { return _alert.call(window, tr(String(m))); };
  window.confirm = function (m) { return _confirm.call(window, tr(String(m))); };
  window.prompt = function (m, d) { return _prompt.call(window, tr(String(m)), d); };
})();
