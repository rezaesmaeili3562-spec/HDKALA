const featuredProducts = [
  {
    name: 'گوشی هوشمند پرچمدار',
    description: 'نمایشگر ۶.۷ اینچی سوپر امولد، دوربین ۵۰ مگاپیکسلی و شارژ فوق سریع.',
    price: '۳۱,۹۰۰,۰۰۰ تومان'
  },
  {
    name: 'هدفون بی‌سیم نویزگیر',
    description: 'حذف نویز فعال، ۲۴ ساعت شارژدهی، سازگاری کامل با تمام دستگاه‌ها.',
    price: '۵,۴۹۰,۰۰۰ تومان'
  },
  {
    name: 'ساعت هوشمند ورزشی',
    description: 'پایش ضربان قلب، سنسور اکسیژن خون و ۱۲۰ حالت ورزشی.',
    price: '۴,۲۹۰,۰۰۰ تومان'
  },
  {
    name: 'لپ‌تاپ حرفه‌ای طراحی',
    description: 'پردازنده نسل جدید، کارت گرافیک قدرتمند و صفحه نمایش ۱۰۰٪ sRGB.',
    price: '۴۸,۷۰۰,۰۰۰ تومان'
  }
];

export default function UserDashboard({ user }) {
  return (
    <section className="user-dashboard">
      <div className="hero-card">
        <h1 className="hero-title">{user ? `سلام ${user.name}!` : 'به اچ دی کالا خوش آمدید'}</h1>
        <p className="hero-subtitle">
          فروشگاهی مدرن با تجربه خرید سریع و مطمئن. با ثبت‌نام یا ورود، خرید خود را به‌سادگی آغاز کنید
          و از پیشنهادهای ویژه ما بهره‌مند شوید.
        </p>
        {!user && (
          <p className="text-muted">
            برای دسترسی به سبد خرید و پیگیری سفارش‌ها لازم است وارد حساب کاربری خود شوید.
          </p>
        )}
      </div>

      <div className="card">
        <h2 className="section-title">پیشنهادهای ویژه امروز</h2>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <article key={product.name} className="product-card">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <strong>{product.price}</strong>
              <button type="button">افزودن به سبد خرید</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
