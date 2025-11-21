(function(){
  const target = '#blog';

  function activate(){
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
