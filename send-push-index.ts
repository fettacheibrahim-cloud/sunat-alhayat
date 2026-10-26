// دالة Supabase Edge: send-push
// تستقبل من قاعدة البيانات قائمة أجهزة ونوع الحدث، وترسل إشعار الهاتف (Web Push) بلغة كل جهاز.
// تحتاج الأسرار: VAPID_PUBLIC و VAPID_PRIVATE و PUSH_SECRET (وتتوفر SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY تلقائياً).
// ⚠️ لا ترفع هذا الملف إلى GitHub إن أضفت فيه أسراراً. هو لا يحوي أي سر.

const SITE = 'https://sunatalhayat.runs-at.dev';

const TEXTS = {
  ar: {
    title: 'سنة الحياة',
    message: who => 'رسالة جديدة من ' + (who || 'عضو'),
    interest: () => 'وصلك اهتمام جديد 💌',
    accepted: who => 'تم قبول اهتمامك من ' + (who || 'عضو') + ' 🎉 ابدأ المحادثة',
    approved: () => 'تم قبول حسابك ✅ يمكنك الآن تصفّح الأعضاء',
    rejected: who => 'تعذّر قبول ملفك' + (who ? ': ' + who : '') + '. عدّل ملفك وراسلنا.',
    test: () => 'الإشعارات تعمل على هذا الجهاز ✅'
  },
  fr: {
    title: 'Sunat Al-Hayat',
    message: who => 'Nouveau message de ' + (who || 'un membre'),
    interest: () => 'Vous avez reçu un nouvel intérêt 💌',
    accepted: who => (who || 'Un membre') + ' a accepté votre intérêt 🎉 Commencez la conversation',
    approved: () => 'Votre compte est accepté ✅ Vous pouvez parcourir les membres',
    rejected: who => 'Votre profil n\'a pas pu être accepté' + (who ? ' : ' + who : '') + '. Modifiez-le et contactez-nous.',
    test: () => 'Les notifications fonctionnent sur cet appareil ✅'
  },
  en: {
    title: 'Sunat Al-Hayat',
    message: who => 'New message from ' + (who || 'a member'),
    interest: () => 'You received a new interest 💌',
    accepted: who => (who || 'A member') + ' accepted your interest 🎉 Start the conversation',
    approved: () => 'Your account is approved ✅ You can now browse members',
    rejected: who => 'Your profile could not be accepted' + (who ? ': ' + who : '') + '. Edit it and contact us.',
    test: () => 'Notifications work on this device ✅'
  }
};

// نقبل فقط عناوين خدمات الإشعارات المعروفة (حماية من توجيه الدالة إلى مواقع أخرى)
const ALLOWED = /^https:\/\/(fcm\.googleapis\.com|android\.googleapis\.com|([a-z0-9-]+\.)*push\.services\.mozilla\.com|([a-z0-9-]+\.)*notify\.windows\.com|([a-z0-9-]+\.)*push\.apple\.com)\//i;

function json(obj, status) {
  return new Response(JSON.stringify(obj), { status: status || 200, headers: { 'Content-Type': 'application/json' } });
}

export function buildMessage(kind, who, lang) {
  const t = TEXTS[lang] || TEXTS.ar;
  const f = t[kind];
  if (typeof f !== 'function') return null;
  return { title: t.title, body: f(who) };
}

export async function handle(req, deps) {
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  if (!deps.secret || req.headers.get('x-push-secret') !== deps.secret) return json({ error: 'forbidden' }, 403);

  let b;
  try { b = await req.json(); } catch (e) { return json({ error: 'bad json' }, 400); }

  const kind = String(b.kind || '');
  const who = String(b.who || '').slice(0, 80);
  const page = /^[a-z]+\.html$/.test(String(b.url || '')) ? b.url : 'browse.html';
  const tag = String(b.tag || kind).slice(0, 80);
  const subs = Array.isArray(b.subs) ? b.subs.slice(0, 10) : [];

  let sent = 0, failed = 0, skipped = 0;
  const dead = [];
  for (const s of subs) {
    if (!s || typeof s.endpoint !== 'string' || !ALLOWED.test(s.endpoint) || typeof s.p256dh !== 'string' || typeof s.auth !== 'string') { skipped++; continue; }
    const lang = TEXTS[s.lang] ? s.lang : 'ar';
    const m = buildMessage(kind, who, lang);
    if (!m) { skipped++; continue; }
    const payload = JSON.stringify({ title: m.title, body: m.body, url: page, tag, lang, dir: lang === 'ar' ? 'rtl' : 'ltr' });
    try {
      await deps.send({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload);
      sent++;
    } catch (e) {
      // 404/410 = الجهاز ألغى الاشتراك: نحذفه
      if (e && (e.statusCode === 404 || e.statusCode === 410)) dead.push(s.endpoint); else failed++;
    }
  }
  if (dead.length) { try { await deps.remove(dead); } catch (e) {} }
  return json({ sent, failed, skipped, removed: dead.length });
}

// التشغيل الفعلي على Supabase (لا يعمل هذا الجزء في الاختبارات المحلية)
if (typeof Deno !== 'undefined' && Deno.serve) {
  const webpush = (await import('npm:web-push@3.6.7')).default;
  webpush.setVapidDetails(SITE, Deno.env.get('VAPID_PUBLIC'), Deno.env.get('VAPID_PRIVATE'));

  let admin = null;
  const url = Deno.env.get('SUPABASE_URL'), key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (url && key) {
    const { createClient } = await import('npm:@supabase/supabase-js@2');
    admin = createClient(url, key);
  }

  Deno.serve(req => handle(req, {
    secret: Deno.env.get('PUSH_SECRET'),
    send: (sub, payload) => webpush.sendNotification(sub, payload, { TTL: 86400, urgency: 'high' }),
    remove: async eps => { if (admin) await admin.from('push_subscriptions').delete().in('endpoint', eps); }
  }));
}
