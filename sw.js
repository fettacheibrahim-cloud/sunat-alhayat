// عامل خدمة: يجعل الموقع قابلاً للتثبيت كتطبيق، ويعرض صفحة «لا يوجد اتصال» عند انقطاع الإنترنت،
// ويعرض إشعارات النظام ويفتح الصفحة المناسبة عند الضغط عليها.
// الاستراتيجية «الشبكة أولاً»: يُجلب دائماً أحدث ملف، ولا يُستعمل المخزَّن إلا عند انقطاع الاتصال،
// فلا تبقى نسخ قديمة من الموقع بعد أي تحديث.
const CACHE = 'sunat-v3';
const CORE = ['offline.html', 'style.css', 'i18n.js', 'i18n-dict.js', 'icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // لا نتدخل في Supabase ولا في الخطوط
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req, { ignoreSearch: true }).then(hit =>
          hit || (req.mode === 'navigate' ? caches.match('offline.html') : Response.error())
        )
      )
  );
});

// إشعار من الخادم (Web Push) حتى والتطبيق مغلق. إن كان الموقع مفتوحاً أمامك فالتنبيه داخل الصفحة يكفي.
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) {}
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (wins.some(w => w.visibilityState === 'visible' && w.focused)) return;
    await self.registration.showNotification(d.title || 'سنة الحياة', {
      body: d.body || '',
      tag: d.tag || undefined,
      renotify: !!d.tag,
      dir: d.dir || 'rtl',
      lang: d.lang || 'ar',
      data: { url: d.url || 'browse.html' }
    });
  })());
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || 'messages.html';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if ('focus' in c) {
          return c.focus().then(() => { if (c.navigate) return c.navigate(url); });
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
