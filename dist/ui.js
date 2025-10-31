/* ---------- Checkout Page ---------- */
function renderCheckoutPage(){
    if (typeof window.renderEnhancedCheckoutPage === 'function') {
        return window.renderEnhancedCheckoutPage();
    }

    console.error('Enhanced checkout renderer is not available.');
}

/* ---------- About Page ---------- */
function renderAboutPage(){
    const page = document.createElement('div');
    page.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-primary/20">
            <h1 class="text-3xl font-bold mb-6 text-primary">درباره HDKALA</h1>
            <div class="prose prose-lg dark:prose-invert max-w-none">
                <p class="text-lg leading-relaxed mb-6">
                    فروشگاه اینترنتی HDKALA با هدف ارائه بهترین تجربه خرید آنلاین برای کاربران ایرانی در سال ۱۴۰۲ تأسیس شد. 
                    ما بر این باوریم که خرید آنلاین باید ساده, مطمئن و لذت‌بخش باشد.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                    <div class="bg-primary/10 p-6 rounded-xl">
                        <iconify-icon icon="mdi:shield-check" width="48" class="text-primary mb-4"></iconify-icon>
                        <h3 class="text-xl font-bold mb-2">ضمانت اصالت کالا</h3>
                        <p class="text-gray-600 dark:text-gray-400">همه محصولات ما دارای ضمانت اصالت و سلامت فیزیکی هستند.</p>
                    </div>
                    <div class="bg-green-500/10 p-6 rounded-xl">
                        <iconify-icon icon="mdi:package-variant" width="48" class="text-green-500 mb-4"></iconify-icon>
                        <h3 class="text-xl font-bold mb-2">ارسال سریع</h3>
                        <p class="text-gray-600 dark:text-gray-400">ارسال رایگان برای خریدهای بالای ۵۰۰ هزار تومان در سراسر کشور.</p>
                    </div>
                    <div class="bg-blue-500/10 p-6 rounded-xl">
                        <iconify-icon icon="mdi:headset" width="48" class="text-blue-500 mb-4"></iconify-icon>
                        <h3 class="text-xl font-bold mb-2">پشتیبانی ۲۴/۷</h3>
                        <p class="text-gray-600 dark:text-gray-400">تیم پشتیبانی ما همیشه آماده پاسخگویی به سوالات شماست.</p>
                    </div>
                    <div class="bg-purple-500/10 p-6 rounded-xl">
                        <iconify-icon icon="mdi:arrow-u-turn-left" width="48" class="text-purple-500 mb-4"></iconify-icon>
                        <h3 class="text-xl font-bold mb-2">بازگشت ۷ روزه</h3>
                        <p class="text-gray-600 dark:text-gray-400">امکان بازگشت کالا تا ۷ روز پس از دریافت برای همه محصولات.</p>
                    </div>
                </div>
                <h2 class="text-2xl font-bold mt-8 mb-4">چرا HDKALA را انتخاب کنید؟</h2>
                <ul class="space-y-3 mb-6">
                    <li class="flex items-center gap-2">
                        <iconify-icon icon="mdi:check-circle" class="text-green-500"></iconify-icon>
                        <span>تنوع بی‌نظیر محصولات از برندهای معتبر</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <iconify-icon icon="mdi:check-circle" class="text-green-500"></iconify-icon>
                        <span>قیمت‌های رقابتی و تخفیف‌های ویژه</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <iconify-icon icon="mdi:check-circle" class="text-green-500"></iconify-icon>
                        <span>سیستم ارسال سریع و بهینه</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <iconify-icon icon="mdi:check-circle" class="text-green-500"></iconify-icon>
                        <span>پشتیبانی حرفه‌ای و پاسخگویی سریع</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <iconify-icon icon="mdi:check-circle" class="text-green-500"></iconify-icon>
                        <span>امنیت کامل در پرداخت‌های آنلاین</span>
                    </li>
                </ul>
            </div>
        </div>
    `;
    contentRoot.appendChild(page);
}

/* ---------- Contact Page ---------- */
function renderContactPage(){
    const page = document.createElement('div');
    page.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-primary/20">
                <h1 class="text-3xl font-bold mb-6 text-primary">تماس با ما</h1>
                <form class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">نام</label>
                            <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">نام خانوادگی</label>
                            <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" required>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">ایمیل</label>
                        <input type="email" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">موضوع</label>
                        <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">پیام</label>
                        <textarea rows="5" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" required></textarea>
                    </div>
                    <button type="submit" class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">ارسال پیام</button>
                </form>
            </div>
            <div class="space-y-6">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                    <h2 class="text-xl font-bold mb-4">اطلاعات تماس</h2>
                    <div class="space-y-4">
                        <div class="flex items-center gap-3">
                            <iconify-icon icon="mdi:phone" width="24" class="text-primary"></iconify-icon>
                            <div>
                                <div class="font-medium">تلفن پشتیبانی</div>
                                <div class="text-gray-600 dark:text-gray-400">۰۲۱-۱۲۳۴۵۶۷۸</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <iconify-icon icon="mdi:email" width="24" class="text-primary"></iconify-icon>
                            <div>
                                <div class="font-medium">ایمیل</div>
                                <div class="text-gray-600 dark:text-gray-400">info@hdkala.com</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <iconify-icon icon="mdi:map-marker" width="24" class="text-primary"></iconify-icon>
                            <div>
                                <div class="font-medium">آدرس</div>
                                <div class="text-gray-600 dark:text-gray-400">تهران، خیابان ولیعصر، پلاک ۱۲۳۴</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <iconify-icon icon="mdi:clock" width="24" class="text-primary"></iconify-icon>
                            <div>
                                <div class="font-medium">ساعات کاری</div>
                                <div class="text-gray-600 dark:text-gray-400">هر روز از ۹ صبح تا ۹ شب</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                    <h2 class="text-xl font-bold mb-4">پرسش‌های متداول</h2>
                    <div class="space-y-4">
                        <div>
                            <h3 class="font-medium mb-2">چگونه می‌توانم سفارشم را پیگیری کنم؟</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">پس از ثبت سفارش، کد رهگیری برای شما ارسال می‌شود که می‌توانید از طریق آن سفارش خود را پیگیری کنید.</p>
                        </div>
                        <div>
                            <h3 class="font-medium mb-2">شرایط بازگشت کالا چگونه است؟</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">تا ۷ روز پس از دریافت کالا امکان بازگشت وجود دارد. کالا باید در شرایط اولیه و بدون استفاده باشد.</p>
                        </div>
                        <div>
                            <h3 class="font-medium mb-2">هزینه ارسال چقدر است؟</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">برای خریدهای بالای ۵۰۰ هزار تومان، ارسال رایگان است. در غیر این صورت هزینه ارسال ۳۰ هزار تومان می‌باشد.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    contentRoot.appendChild(page);
}

/* ---------- Blog Page ---------- */
function renderBlogPage(){
    const page = document.createElement('div');
    page.innerHTML = `
        <h1 class="text-3xl font-bold mb-8 text-primary">بلاگ HDKALA</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${blogs.map(blog => `
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-primary/20 hover:shadow-lg transition-shadow">
                    <div class="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        ${blog.image ? 
                            `<img src="${blog.image}" alt="${blog.title}" class="w-full h-48 object-cover" />` :
                            `<iconify-icon icon="mdi:image-off" width="48" class="text-gray-400"></iconify-icon>`
                        }
                    </div>
                    <div class="p-6">
                        <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">${blog.category}</span>
                        <h3 class="font-bold text-xl mt-3 mb-2">${blog.title}</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">${blog.excerpt}</p>
                        <div class="flex justify-between items-center text-sm text-gray-500">
                            <span>${blog.date}</span>
                            <a href="#blog:${blog.id}" class="text-primary hover:text-primary/80 transition-colors">ادامه مطلب</a>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    contentRoot.appendChild(page);
}

/* ---------- Profile Page ---------- */
function renderProfilePage(){
    const page = document.createElement('div');
    page.innerHTML = `
        <h1 class="text-2xl font-bold mb-6">پروفایل کاربری</h1>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                    <h2 class="text-lg font-bold mb-4">اطلاعات شخصی</h2>
                    <form class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">نام</label>
                                <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" value="${user ? user.name : ''}">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">شماره تلفن</label>
                                <input type="tel" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" value="${user ? user.phone : ''}" readonly>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">ایمیل</label>
                            <input type="email" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                        </div>
                        <button type="submit" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">ذخیره تغییرات</button>
                    </form>
                </div>
            </div>
            <div class="space-y-6">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20 text-center">
                    <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <iconify-icon icon="mdi:user" width="32" class="text-primary"></iconify-icon>
                    </div>
                    <h3 class="font-bold text-lg">${user ? user.name : 'کاربر'}</h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">${user ? user.phone : ''}</p>
                    <p class="text-gray-500 text-xs mt-2">عضو از ${user ? new Date(user.created).toLocaleDateString('fa-IR') : '---'}</p>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                    <h3 class="font-bold mb-4">آمار شما</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">تعداد سفارشات</span>
                            <span class="font-medium">${orders.length}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">علاقه‌مندی‌ها</span>
                            <span class="font-medium">${wishlist.length}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">نظرات</span>
                            <span class="font-medium">۰</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    contentRoot.appendChild(page);
}

/* ---------- Orders Page ---------- */
function renderOrdersPage(){
    const page = document.createElement('div');
    page.innerHTML = `
        <h1 class="text-2xl font-bold mb-6">سفارش‌های من</h1>
        ${orders.length === 0 ? `
            <div class="text-center py-12">
                <iconify-icon icon="mdi:package-variant-remove" width="64" class="text-gray-400 mb-4"></iconify-icon>
                <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">هنوز سفارشی ثبت نکرده‌اید</p>
                <a href="#products" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">مشاهده محصولات</a>
            </div>
        ` : `
            <div class="space-y-4">
                ${orders.map(order => `
                    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="font-bold text-lg">سفارش #${order.id}</h3>
                                <p class="text-gray-600 dark:text-gray-400 text-sm">${order.date}</p>
                            </div>
                            <span class="px-3 py-1 rounded-full text-sm ${
                                order.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                                order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' :
                                order.status === 'processing' ? 'bg-yellow-500/10 text-yellow-500' :
                                'bg-gray-500/10 text-gray-500'
                            }">
                                ${
                                    order.status === 'delivered' ? 'تحویل شده' :
                                    order.status === 'shipped' ? 'ارسال شده' :
                                    order.status === 'processing' ? 'در حال پردازش' :
                                    'لغو شده'
                                }
                            </span>
                        </div>
                        <div class="space-y-3 mb-4">
                            ${order.items.map(item => {
                                const product = getProductById(item.productId);
                                if (!product) return '';
                                return `
                                    <div class="flex justify-between items-center">
                                        <div class="flex items-center gap-3">
                                            <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                ${product.img ? 
                                                    `<img src="${product.img}" alt="${product.name}" class="w-12 h-12 object-cover rounded-lg" />` :
                                                    `<iconify-icon icon="mdi:package" width="20" class="text-gray-400"></iconify-icon>`
                                                }
                                            </div>
                                            <div>
                                                <div class="font-medium">${product.name}</div>
                                                <div class="text-gray-500 text-sm">${item.qty} عدد</div>
                                            </div>
                                        </div>
                                        <div class="font-medium">${formatPrice((product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price) * item.qty)}</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <div class="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
                            <div class="text-lg font-bold">${formatPrice(order.total)}</div>
                            <button class="text-primary hover:text-primary/80 transition-colors">مشاهده جزئیات</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `}
    `;
    contentRoot.appendChild(page);
}
