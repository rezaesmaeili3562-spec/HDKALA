(function(){
  const templateCache = new Map();

  function getTemplate(id){
    if (templateCache.has(id)) {
      return templateCache.get(id).cloneNode(true);
    }
    const tpl = document.getElementById(id);
    if (!tpl) {
      console.warn('Template not found:', id);
      return document.createDocumentFragment();
    }
    const content = tpl.content;
    templateCache.set(id, content);
    return content.cloneNode(true);
  }

  function renderTemplate(target, id){
    if (!target) return null;
    target.innerHTML = '';
    const fragment = getTemplate(id);
    target.appendChild(fragment);
    return target.firstElementChild || target;
  }

  window.Templates = {
    clone: getTemplate,
    render: renderTemplate
  };

  // ماژول‌های مشترک به صورت داینامیک لود می‌شوند و معمولا بعد از DOMContentLoaded اجرا می‌شوند؛
  // init ها در یک صف ثبت می‌شوند و پس از لود «همه» ماژول‌ها (توسط لودر) اجرا می‌گردند
  // تا وابستگی‌های بین ماژولی (مثلا updateUserDropdown در auth.js) برقرار باشد
  window.__domReadyQueue = window.__domReadyQueue || [];
  window.onDomReady = function(fn) {
    if (typeof fn !== 'function') return;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      window.__domReadyQueue.push(fn);
    }
  };
  window.__flushDomReadyQueue = function() {
    const queue = window.__domReadyQueue;
    while (queue.length) {
      const fn = queue.shift();
      try {
        fn();
      } catch (err) {
        console.error('Init error:', err);
      }
    }
  };
})();
