import './components/site-header.js';
import './components/site-footer.js';
import './components/product-card.js';
import { initNotifications } from './services/notifications.js';

document.addEventListener('DOMContentLoaded', () => {
  initNotifications();
});
