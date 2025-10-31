import { useMemo, useState } from 'react';

const adminMenu = [
  'مدیریت کاربران',
  'گزارش فروش',
  'مدیریت محصولات',
  'تنظیمات سایت',
  'پشتیبانی و تیکت‌ها'
];

export default function AdminPanel() {
  const [activeItem, setActiveItem] = useState(adminMenu[0]);

  const description = useMemo(() => {
    switch (activeItem) {
      case 'مدیریت کاربران':
        return 'لیست کاربران جدید، وضعیت فعال بودن حساب‌ها و مدیریت نقش‌ها را در این بخش مشاهده کنید.';
      case 'گزارش فروش':
        return 'نمودار فروش روزانه، هفتگی و ماهانه همراه با تحلیل کانال‌های درآمدی در این بخش نمایش داده می‌شود.';
      case 'مدیریت محصولات':
        return 'افزودن محصول جدید، ویرایش موجودی، مدیریت قیمت‌گذاری و تخفیف‌ها از اینجا قابل انجام است.';
      case 'تنظیمات سایت':
        return 'تنظیمات ظاهری، ساختار منوها، بنرهای تبلیغاتی و مدیریت صفحات ثابت را در این قسمت کنترل کنید.';
      case 'پشتیبانی و تیکت‌ها':
        return 'درخواست‌های ثبت شده توسط کاربران را بررسی کرده و پاسخ‌های تیم پشتیبانی را مدیریت نمایید.';
      default:
        return '';
    }
  }, [activeItem]);

  return (
    <section className="admin-layout">
      <aside className="admin-sidebar">
        <div>
          <h2>پنل مدیریت</h2>
          <p className="text-muted" style={{ color: 'rgba(226, 232, 240, 0.8)' }}>
            کنترل کامل فروشگاه آنلاین اچ دی کالا
          </p>
        </div>
        <div className="admin-menu">
          {adminMenu.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveItem(item)}
              style={
                item === activeItem
                  ? { background: 'rgba(37, 99, 235, 0.55)', color: '#ffffff' }
                  : undefined
              }
            >
              {item}
            </button>
          ))}
        </div>
      </aside>

      <div className="admin-content">
        <div>
          <h2 className="section-title">{activeItem}</h2>
          <p className="text-muted">{description}</p>
        </div>
        <div className="admin-stat-grid">
          <div className="admin-stat">
            <span>فروش امروز</span>
            <strong>۳۲,۵۰۰,۰۰۰ تومان</strong>
            <small className="text-muted">۵٪ افزایش نسبت به دیروز</small>
          </div>
          <div className="admin-stat">
            <span>کاربران فعال</span>
            <strong>۸,۴۵۰ نفر</strong>
            <small className="text-muted">۲۰ کاربر جدید در ۲۴ ساعت گذشته</small>
          </div>
          <div className="admin-stat">
            <span>سفارش‌های در انتظار</span>
            <strong>۴۸ سفارش</strong>
            <small className="text-muted">اقدام فوری برای ارسال</small>
          </div>
          <div className="admin-stat">
            <span>میانگین رضایت مشتریان</span>
            <strong>۴.۷ از ۵</strong>
            <small className="text-muted">بر اساس ۱۲۰۰ نظر ثبت شده</small>
          </div>
        </div>
      </div>
    </section>
  );
}
