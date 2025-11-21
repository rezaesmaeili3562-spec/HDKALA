(function(){
  function resolveHash(){
    const params = new URLSearchParams(location.search);
    const productId = params.get('id');
    return productId ? `#product:${productId}` : '#product';
  }

  function activate(){
    const target = resolveHash();
    if (location.hash !== target) {
      location.hash = target;
    } else if (typeof renderPage === 'function') {
      renderPage();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', activate);
  } else {
    activate();
  }
})();
