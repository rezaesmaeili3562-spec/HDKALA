import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { useStore } from './store/useStore';
import './index.css';

// اعمال تم ذخیره‌شده قبل از رندر (جلوگیری از فلش تم اشتباه)
const savedTheme = useStore.getState().theme;
const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
useStore.getState().setTheme(initialTheme);
document.documentElement.classList.toggle('dark', initialTheme === 'dark');
document.documentElement.style.colorScheme = initialTheme;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
