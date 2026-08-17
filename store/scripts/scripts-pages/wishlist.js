(function(){
  const target = '#wishlist';

  function activate(){
    if (!location.hash || location.hash === '#') {
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
