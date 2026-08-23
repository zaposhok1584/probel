
// ===== ПЛЕЕР (кнопка play/pause в шапке) =====
(function () {
  const toggleBtn = document.getElementById('radioToggle');
  const trackName = document.getElementById('radioTrackName');
  const audio = document.getElementById('bgPlayer');
 
  if (!toggleBtn || !audio) return;
 
  toggleBtn.addEventListener('click', function () {
    if (audio.paused) {
      audio.play();
      toggleBtn.textContent = '⏸';
    } else {
      audio.pause();
      toggleBtn.textContent = '▶';
    }
  });
 
  audio.addEventListener('play', function () {
    trackName.textContent = 'играет: ' + (audio.dataset.trackTitle || 'без названия');
  });
  audio.addEventListener('pause', function () {
    trackName.textContent = 'на паузе';
  });
})();
 
// ===== ПЕРЕХОДЫ МЕЖДУ СТРАНИЦАМИ БЕЗ ПЕРЕЗАГРУЗКИ =====
(function () {
  const contentArea = document.getElementById('appContent');
  if (!contentArea) return;
 
  async function loadPage(url, pushState) {
    try {
      const res = await fetch(url);
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newContent = doc.getElementById('appContent');
 
      if (!newContent) {
        window.location.href = url;
        return;
      }
 
      contentArea.innerHTML = newContent.innerHTML;
 
      // скрипты внутри appContent не запускаются сами при вставке через
      // innerHTML — пересоздаём их вручную, чтобы они реально выполнились
      const scripts = contentArea.querySelectorAll('script');
    scripts.forEach(function (oldScript) {
  const newScript = document.createElement('script');
  if (oldScript.src) {
    newScript.src = oldScript.src;
    newScript.async = false; // сохраняем порядок выполнения скриптов
  } else {
    newScript.textContent = oldScript.textContent;
  }
  oldScript.replaceWith(newScript);
});
 
      document.title = doc.title;
 
      if (pushState) {
        history.pushState({ url: url }, '', url);
      }
 
      window.scrollTo(0, 0);
    } catch (err) {
      window.location.href = url;
    }
  }
 
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (!link) return;
 
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') || link.target === '_blank') {
      return; // внешние ссылки и якоря (#) не трогаем
    }
 
    e.preventDefault();
    loadPage(href, true);
  });
 
  window.addEventListener('popstate', function () {
    loadPage(window.location.href, false);
  });
})();
 