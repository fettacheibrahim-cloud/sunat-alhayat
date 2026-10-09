(function () {
  const links = [
    ['browse.html', 'التصفح'],
    ['interests.html', 'الاهتمامات'],
    ['messages.html', 'المحادثات'],
    ['profile.html', 'ملفي'],
    ['admin.html', 'الإدارة']
  ];
  const here = location.pathname.split('/').pop() || 'index.html';
  const bar = document.createElement('nav');
  bar.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:12px 16px;background:#FFFDF8;border-bottom:1px solid #E6E1D3';
  links.forEach(([href, label]) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    const on = here === href;
    a.style.cssText = 'padding:8px 16px;border-radius:999px;font-weight:700;font-size:15px;' +
      (on ? 'background:#0E3B3C;color:#fff' : 'color:#0E3B3C;border:1px solid #D5CFBF');
    bar.appendChild(a);
  });
  document.addEventListener('DOMContentLoaded', () => {
    const h = document.querySelector('header');
    if (h && h.parentNode) h.parentNode.insertBefore(bar, h.nextSibling);
  });
})();
