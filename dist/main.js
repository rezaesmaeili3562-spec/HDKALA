import { registerRoute, startRouter, navigate } from './shared/js/router.js';
import { toggleMobileMenu } from './shared/js/ui.js';

import homeController from './features/home/js/home.js';
import productsController from './features/products/js/products.js';
import productController from './features/product/js/product.js';
import cartController from './features/cart/js/cart.js';
import checkoutController from './features/checkout/js/checkout.js';
import loginController from './features/login/js/login.js';
import signupController from './features/signup/js/signup.js';
import profileController from './features/profile/js/profile.js';
import adminController from './features/admin/js/admin.js';
import aboutController from './features/about/js/about.js';
import contactController from './features/contact/js/contact.js';
import blogController from './features/blog/js/blog.js';

const routes = {
  home: { html: './features/home/html/home.html', controller: homeController },
  products: { html: './features/products/html/products.html', controller: productsController },
  product: { html: './features/product/html/product.html', controller: productController },
  cart: { html: './features/cart/html/cart.html', controller: cartController },
  checkout: { html: './features/checkout/html/checkout.html', controller: checkoutController },
  login: { html: './features/login/html/login.html', controller: loginController },
  signup: { html: './features/signup/html/signup.html', controller: signupController },
  profile: { html: './features/profile/html/profile.html', controller: profileController },
  admin: { html: './features/admin/html/admin.html', controller: adminController },
  about: { html: './features/about/html/about.html', controller: aboutController },
  contact: { html: './features/contact/html/contact.html', controller: contactController },
  blog: { html: './features/blog/html/blog.html', controller: blogController }
};

Object.entries(routes).forEach(([name, config]) => registerRoute(name, config));

const mobileToggle = document.getElementById('mobileMenuToggle');
mobileToggle?.addEventListener('click', () => toggleMobileMenu());

document.getElementById('mobileMenu')?.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  toggleMobileMenu(false);
});

startRouter();

Array.from(document.querySelectorAll('a[href^="#"]')).forEach((link) => {
  link.addEventListener('click', (event) => {
    const hash = link.getAttribute('href');
    if (!hash) return;
    event.preventDefault();
    if (window.location.hash === hash) {
      const target = hash.replace('#', '');
      const [route, param] = target.split('/');
      navigate(route, param ? { id: param } : {});
    } else {
      window.location.hash = hash;
    }
  });
});
