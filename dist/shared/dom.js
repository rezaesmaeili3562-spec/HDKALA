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
})();
