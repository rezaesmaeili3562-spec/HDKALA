(function(){
  const scriptQueue = [
    './dom.js',
    './modules/validators.js',
    './modules/form-behaviors.js',
    './modules/otp-manager.js',
    './modules/compare-modal-manager.js',
    './core.js',
    './storage.js',
    './router.js',
    './admin.js',
    './cart.js',
    './auth.js',
    './filters.js',
    './pages.js',
    './ui.js',
    './validation.js',
    './components.js',
    './utils.js',
    './constants.js'
  ];

  function loadScriptSequentially(src){
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(src);
      script.onerror = () => reject(new Error('Failed to load script: ' + src));
      document.body.appendChild(script);
    });
  }

  function loadScriptsInOrder(){
    return scriptQueue.reduce((chain, src) => {
      return chain.then(() => loadScriptSequentially(src));
    }, Promise.resolve());
  }

  function boot(){
    const loader = window.TemplateLoader && typeof window.TemplateLoader.load === 'function'
      ? window.TemplateLoader.load()
      : Promise.resolve();

    loader
      .catch(error => {
        console.error(error);
      })
      .then(loadScriptsInOrder)
      .catch(error => {
        console.error(error);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
