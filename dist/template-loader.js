(function(){
  const templateFiles = [
    { id: 'tpl-product-card', file: './templates/tpl-product-card.html' },
    { id: 'tpl-product-empty', file: './templates/tpl-product-empty.html' },
    { id: 'tpl-blog-card', file: './templates/tpl-blog-card.html' },
    { id: 'tpl-home-page', file: './templates/tpl-home-page.html' },
    { id: 'tpl-products-page', file: './templates/tpl-products-page.html' },
    { id: 'tpl-cart-empty', file: './templates/tpl-cart-empty.html' },
    { id: 'tpl-cart-item', file: './templates/tpl-cart-item.html' }
  ];

  function injectTemplate(html){
    const container = document.createElement('div');
    container.innerHTML = html.trim();
    const template = container.querySelector('template');
    if (!template) {
      console.warn('Template fragment does not contain a <template> root.');
      return;
    }
    const existing = document.getElementById(template.id);
    if (existing) {
      existing.replaceWith(template);
    } else {
      document.body.appendChild(template);
    }
  }

  function loadTemplate(file){
    return fetch(file)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load template: ' + file);
        }
        return response.text();
      })
      .then(injectTemplate)
      .catch(error => {
        console.error(error);
      });
  }

  function loadAll(){
    return Promise.all(templateFiles.map(({ file }) => loadTemplate(file)));
  }

  window.TemplateLoader = {
    load: loadAll
  };
})();
