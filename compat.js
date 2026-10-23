// ثوابت وتسميات مشتركة + حساب نسبة التوافق التقريبية
var LBL = {
  marital: { never_married: 'أعزب/عزباء', divorced: 'مطلّق/ة', widowed: 'أرمل/ة' },
  edu: { secondary: 'ثانوي', diploma: 'دبلوم', bachelor: 'إجازة', postgraduate: 'دراسات عليا' },
  religiosity: { practicing: 'ملتزم/ة', moderate: 'متوسّط الالتزام', learning: 'في طريق الالتزام' },
  prayer: { always: 'يحافظ على الصلاة', mostly: 'غالباً', sometimes: 'أحياناً', rarely: 'نادراً' },
  smoking: { no: 'لا يدخّن', yes: 'مدخّن', quit: 'أقلع عن التدخين' },
  children: { yes: 'يرغب في أطفال', no: 'لا يرغب', open: 'منفتح على الأمر' }
};

function ageOf(d) {
  if (!d) return null;
  var b = new Date(d), t = new Date();
  var a = t.getFullYear() - b.getFullYear();
  if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--;
  return a;
}

// تُرجع {pct, reasons} أو null إن لم تكفِ البيانات (أقل من 3 عناصر قابلة للمقارنة)
function compat(a, b) {
  if (!a || !b) return null;
  var sum = 0, max = 0, reasons = [];
  function add(w, got, label) {
    max += w; sum += got;
    if (label && got >= w * 0.75) reasons.push(label);
  }
  function ord(list, x, y) { var i = list.indexOf(x), j = list.indexOf(y); return (i < 0 || j < 0) ? null : Math.abs(i - j); }
  var n = 0;

  var c1 = (a.city || '').trim().toLowerCase(), c2 = (b.city || '').trim().toLowerCase();
  var k1 = (a.country || '').trim().toLowerCase(), k2 = (b.country || '').trim().toLowerCase();
  if ((c1 && c2) || (k1 && k2)) {
    n++;
    if (c1 && c1 === c2) add(25, 25, 'نفس المدينة');
    else if (k1 && k1 === k2) add(25, 12, 'نفس البلد');
    else add(25, 0);
  }

  var a1 = ageOf(a.birth_date), a2 = ageOf(b.birth_date);
  if (a1 != null && a2 != null) {
    n++;
    var g = Math.abs(a1 - a2);
    add(20, g <= 3 ? 20 : g <= 6 ? 14 : g <= 10 ? 8 : 2, g <= 6 ? 'عمران متقاربان' : '');
  }

  if (a.marital_status && b.marital_status) {
    n++; add(10, a.marital_status === b.marital_status ? 10 : 4, a.marital_status === b.marital_status ? 'نفس الحالة الاجتماعية' : '');
  }

  var d = ord(['secondary', 'diploma', 'bachelor', 'postgraduate'], a.education, b.education);
  if (d != null) { n++; add(10, d === 0 ? 10 : d === 1 ? 7 : 3, d <= 1 ? 'مستوى دراسي متقارب' : ''); }

  d = ord(['learning', 'moderate', 'practicing'], a.religiosity, b.religiosity);
  if (d != null) { n++; add(20, d === 0 ? 20 : d === 1 ? 10 : 0, d === 0 ? 'نفس درجة الالتزام' : ''); }

  d = ord(['rarely', 'sometimes', 'mostly', 'always'], a.prayer, b.prayer);
  if (d != null) { n++; add(10, d === 0 ? 10 : d === 1 ? 6 : d === 2 ? 2 : 0, d <= 1 ? 'عادات صلاة متقاربة' : ''); }

  if (a.wants_children && b.wants_children) {
    n++;
    var x = a.wants_children, y = b.wants_children;
    var s = x === y ? 15 : (x === 'open' || y === 'open') ? 9 : 0;
    add(15, s, x === y ? 'نفس الرغبة في الأطفال' : '');
  }

  if (a.smoking && b.smoking) {
    n++;
    var sm = a.smoking === b.smoking ? 5 : (a.smoking !== 'yes' && b.smoking !== 'yes') ? 3 : 1;
    add(5, sm, a.smoking === b.smoking ? 'نفس العادة في التدخين' : '');
  }

  if (n < 3 || !max) return null;
  return { pct: Math.round(sum / max * 100), reasons: reasons.slice(0, 4) };
}

function pctClass(p) { return p >= 75 ? 'pct' : p >= 50 ? 'pct mid' : 'pct low'; }
