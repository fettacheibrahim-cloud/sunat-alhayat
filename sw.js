// عامل خدمة بسيط: يعرض إشعارات النظام ويفتح الصفحة المناسبة عند الضغط عليها،
// ووجوده مع manifest.webmanifest يسمح بتثبيت الموقع كتطبيق.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// لا نخزّن شيئاً مؤقتاً؛ الطلبات تمر كما هي إلى الشبكة
self.addEventListener('fetch', () => {});

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
