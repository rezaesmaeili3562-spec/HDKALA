// ─────────────────────────────────────────────────────────────
//  نقطه ورود برنامه — راه‌اندازی React، تم اولیه و محو صفحه
//  خوش‌آمد با jQuery
// ─────────────────────────────────────────────────────────────
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import $ from 'jquery';
import App from './App';
import { useStore } from './store';
import './index.css';

// اعمال تم ذخیره‌شده قبل از رندر (جلوگیری از فلش تم اشتباه)
const savedTheme = useStore.getState().theme;
const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
useStore.getState().setTheme(initialTheme);
document.documentElement.classList.toggle('dark', initialTheme === 'dark');
document.documentElement.style.colorScheme = initialTheme;

// نکته: HashRouter انتخاب شده تا اپ در همه محیط‌ها — حالت توسعه، پیش‌نمایش
// npm run build و حتی باز کردن مستقیم خروجی — دقیقاً یکسان دیده شود.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);

// محو نرم صفحه خوش‌آمد با jQuery بعد از آماده شدن رابط کاربری
$(() => {
  $('#splash')
    .delay(350)
    .fadeOut(450, function () {
      $(this).remove();
    });
});
