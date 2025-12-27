/* ---------- Checkout Page ---------- */
function renderCheckoutPage(){
    if (!contentRoot) {
        return;
    }
    const page = document.createElement('div');
    page.innerHTML = `
        <h1 class="text-2xl font-bold mb-6">تسویه حساب</h1>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20 mb-6">
                    <h2 class="text-lg font-bold mb-4">اطلاعات ارسال</h2>
                    <form class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="checkout-first-name" class="block text-sm font-medium mb-2">نام</label>
                                <input id="checkout-first-name" type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                            </div>
                            <div>
                                <label for="checkout-last-name" class="block text-sm font-medium mb-2">نام خانوادگی</label>
                                <input id="checkout-last-name" type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                            </div>
                        </div>
                        <div>
                            <label for="checkout-address" class="block text-sm font-medium mb-2">آدرس</label>
                            <textarea id="checkout-address" rows="3" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"></textarea>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label for="checkout-city" class="block text-sm font-medium mb-2">شهر</label>
                                <input id="checkout-city" type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                            </div>
                            <div>
                                <label for="checkout-state" class="block text-sm font-medium mb-2">استان</label>
                                <input id="checkout-state" type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                            </div>
                            <div>
                                <label for="checkout-postal-code" class="block text-sm font-medium mb-2">کد پستی</label>
                                <input id="checkout-postal-code" type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                            </div>
                        </div>
                        <div>
                            <label for="checkout-phone" class="block text-sm font-medium mb-2">شماره تماس</label>
                            <input id="checkout-phone" type="tel" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                        </div>
                    </form>
                </div>
                
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                    <h2 class="text-lg font-bold mb-4">روش پرداخت</h2>
                    ${createPaymentOptions('online')}
                </div>
            </div>
            
            <div>
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20 sticky top-4">
                    <h2 class="text-lg font-bold mb-4">خلاصه سفارش</h2>
                    <div id="checkoutItems" class="space-y-3 mb-4">
                        <!-- Cart items will be populated here -->
                    </div>
                    <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                        <div class="flex justify-between">
                            <span>جمع کل:</span>
                            <span id="checkoutTotal">۰ تومان</span>
                        </div>
                        <div class="flex justify-between">
                            <span>تخفیف:</span>
                            <span id="checkoutDiscount" class="text-green-500">۰ تومان</span>
                        </div>
                        <div class="flex justify-between">
                            <span>هزینه ارسال:</span>
                            <span id="checkoutShipping">۰ تومان</span>
                        </div>
                        <div class="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                            <span>مبلغ قابل پرداخت:</span>
                            <span id="checkoutFinalTotal">۰ تومان</span>
                        </div>
                    </div>
                    <button class="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors mt-6">
                        پرداخت و ثبت سفارش
                    </button>
                </div>
            </div>
        </div>
    `;
    contentRoot.appendChild(page);
    const firstNameInput = $('#checkout-first-name', page);
    const phoneInput = $('#checkout-phone', page);
    if (firstNameInput && user?.name) {
        firstNameInput.value = user.name;
    }
    if (phoneInput && user?.phone) {
        phoneInput.value = user.phone;
    }
    updateCheckoutDisplay();
}

function updateCheckoutDisplay() {
    const checkoutItems = $('#checkoutItems');
    const checkoutTotal = $('#checkoutTotal');
    const checkoutDiscount = $('#checkoutDiscount');
    const checkoutShipping = $('#checkoutShipping');
    const checkoutFinalTotal = $('#checkoutFinalTotal');
    
    if (!checkoutItems || !checkoutTotal || !checkoutDiscount || !checkoutShipping || !checkoutFinalTotal) return;
    
    checkoutItems.innerHTML = '';
    if (!Array.isArray(window.cart) || cart.length === 0) {
        checkoutItems.innerHTML = '<p class="text-gray-500 text-center">سبد خرید خالی است</p>';
        checkoutTotal.textContent = '۰ تومان';
        checkoutDiscount.textContent = '۰ تومان';
        checkoutShipping.textContent = '۰ تومان';
        checkoutFinalTotal.textContent = '۰ تومان';
        return;
    }
    
    let total = 0;
    let totalDiscount = 0;
    
    if (typeof getProductById !== 'function') {
        return;
    }

    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (!product) return;
        
        const finalPrice = product.discount > 0 ? 
            product.price * (1 - product.discount / 100) : product.price;
        const itemTotal = finalPrice * item.qty;
        const itemDiscount = (product.price - finalPrice) * item.qty;
        
        total += itemTotal;
        totalDiscount += itemDiscount;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'flex justify-between items-center text-sm';
        const info = document.createElement('div');
        const nameEl = document.createElement('div');
        nameEl.className = 'font-medium';
        nameEl.textContent = product.name;
        const qtyEl = document.createElement('div');
        qtyEl.className = 'text-gray-500';
        qtyEl.textContent = `${item.qty} × ${formatPrice(finalPrice)}`;
        info.appendChild(nameEl);
        info.appendChild(qtyEl);
        const totalEl = document.createElement('div');
        totalEl.className = 'font-medium';
        totalEl.textContent = formatPrice(itemTotal);
        itemEl.appendChild(info);
        itemEl.appendChild(totalEl);
        checkoutItems.appendChild(itemEl);
    });
    
    const shippingCost = total > 500000 ? 0 : 30000;
    const finalTotal = total + shippingCost;
    
    checkoutTotal.textContent = formatPrice(total + totalDiscount);
    checkoutDiscount.textContent = formatPrice(totalDiscount);
    checkoutShipping.textContent = shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost);
    checkoutFinalTotal.textContent = formatPrice(finalTotal);
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

function renderInfoPage({ title, description, sections = [] }){
    const page = document.createElement('div');
    const sectionMarkup = sections.map(section => `
            <div class="rounded-xl border border-primary/10 bg-primary/5 p-4">
                <h3 class="text-lg font-semibold mb-2">${section.title}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">${section.body}</p>
            </div>
        `).join('');

    page.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-primary/20 space-y-6">
            <div>
                <h1 class="text-3xl font-bold text-primary mb-3">${title}</h1>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">${description}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${sectionMarkup}
            </div>
        </div>
    `;
    contentRoot.appendChild(page);
}

/* ---------- Shipping & Policies ---------- */
function renderShippingPage(){
    renderInfoPage({
        title: 'ارسال و بازگشت',
        description: 'شفافیت در روند ارسال و بازگشت کالا باعث می‌شود با خیال راحت خرید کنید.',
        sections: [
            { title: 'زمان‌بندی ارسال', body: 'سفارش‌های تهران در بازه ۲۴ تا ۴۸ ساعت و سایر شهرها در بازه ۲ تا ۴ روز کاری تحویل می‌شوند.' },
            { title: 'هزینه ارسال', body: 'ارسال برای خریدهای بالای ۵۰۰ هزار تومان رایگان است. برای سفارش‌های پایین‌تر، هزینه ارسال در سبد خرید نمایش داده می‌شود.' },
            { title: 'بازگشت ۷ روزه', body: 'در صورت سلامت کالا، تا ۷ روز پس از دریافت امکان بازگشت وجود دارد. کالا باید در بسته‌بندی اصلی باشد.' },
            { title: 'پیگیری سفارش', body: 'کد پیگیری از طریق پیامک ارسال می‌شود و از بخش سفارش‌ها نیز قابل مشاهده است.' }
        ]
    });
}

function renderTermsPage(){
    renderInfoPage({
        title: 'قوانین و مقررات',
        description: 'با ثبت سفارش در HDKALA، قوانین زیر مورد پذیرش شما خواهد بود.',
        sections: [
            { title: 'ثبت سفارش', body: 'مسئولیت وارد کردن اطلاعات صحیح بر عهده کاربر است و سفارش پس از تأیید نهایی قابل پردازش است.' },
            { title: 'پرداخت', body: 'پرداخت‌ها از طریق درگاه‌های امن انجام می‌شوند و اطلاعات کارت نزد HDKALA ذخیره نمی‌شود.' },
            { title: 'لغو سفارش', body: 'تا پیش از ارسال کالا امکان لغو سفارش وجود دارد و مبلغ در کوتاه‌ترین زمان بازگردانده می‌شود.' },
            { title: 'حقوق مالکیت محتوا', body: 'تمامی محتوا، تصاویر و برند HDKALA تحت قوانین کپی‌رایت محفوظ است.' }
        ]
    });
}

function renderPrivacyPage(){
    renderInfoPage({
        title: 'حریم خصوصی',
        description: 'حریم خصوصی شما برای ما اولویت دارد و اطلاعات تنها برای بهبود تجربه خرید استفاده می‌شود.',
        sections: [
            { title: 'داده‌های جمع‌آوری‌شده', body: 'اطلاعات تماس، آدرس و سوابق سفارش برای ارائه خدمات بهتر ذخیره می‌شوند.' },
            { title: 'امنیت اطلاعات', body: 'اطلاعات کاربران با استانداردهای امنیتی محافظت می‌شود و به اشخاص ثالث واگذار نمی‌گردد.' },
            { title: 'کوکی‌ها', body: 'برای بهبود تجربه کاربری و تحلیل رفتار خرید از کوکی استفاده می‌شود.' },
            { title: 'حق ویرایش', body: 'کاربر می‌تواند اطلاعات حساب را در پروفایل به‌روزرسانی کند.' }
        ]
    });
}

function renderFaqPage(){
    renderInfoPage({
        title: 'سوالات متداول',
        description: 'پاسخ سوالات پرتکرار درباره خرید، ارسال و خدمات پس از فروش.',
        sections: [
            { title: 'چطور سفارش ثبت کنم؟', body: 'کالا را به سبد خرید اضافه کرده و مراحل پرداخت را تکمیل کنید.' },
            { title: 'چطور کد تخفیف وارد کنم؟', body: 'در مرحله نهایی پرداخت، کد تخفیف را وارد کرده و اعمال کنید.' },
            { title: 'چطور مرجوع کنم؟', body: 'از بخش سفارش‌ها درخواست مرجوعی ثبت کرده و منتظر تماس پشتیبانی بمانید.' },
            { title: 'چطور وضعیت سفارش را ببینم؟', body: 'در بخش سفارش‌ها می‌توانید وضعیت هر سفارش را مشاهده کنید.' }
        ]
    });
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
                                <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" data-element="profile-name">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">شماره تلفن</label>
                                <input type="tel" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" data-element="profile-phone" readonly>
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
                    <h3 class="font-bold text-lg" data-element="profile-display-name"></h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm" data-element="profile-display-phone"></p>
                    <p class="text-gray-500 text-xs mt-2" data-element="profile-created-at"></p>
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

    const nameInput = page.querySelector('[data-element="profile-name"]');
    const phoneInput = page.querySelector('[data-element="profile-phone"]');
    const displayName = page.querySelector('[data-element="profile-display-name"]');
    const displayPhone = page.querySelector('[data-element="profile-display-phone"]');
    const createdAt = page.querySelector('[data-element="profile-created-at"]');

    if (nameInput) {
        nameInput.value = user?.name || '';
    }
    if (phoneInput) {
        phoneInput.value = user?.phone || '';
    }
    if (displayName) {
        displayName.textContent = user?.name || 'کاربر';
    }
    if (displayPhone) {
        displayPhone.textContent = user?.phone || '';
    }
    if (createdAt) {
        createdAt.textContent = `عضو از ${user ? new Date(user.created).toLocaleDateString('fa-IR') : '---'}`;
    }
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
            <div class="space-y-4" data-element="orders-list"></div>
        `}
    `;
    contentRoot.appendChild(page);

    if (orders.length === 0) {
        return;
    }

    const list = page.querySelector('[data-element="orders-list"]');
    if (!list || typeof getProductById !== 'function') {
        return;
    }

    orders.forEach(order => {
        const statusLabel = order.status === 'delivered'
            ? 'تحویل شده'
            : order.status === 'shipped'
                ? 'ارسال شده'
                : order.status === 'processing'
                    ? 'در حال پردازش'
                    : 'لغو شده';
        const statusClass = order.status === 'delivered'
            ? 'bg-green-500/10 text-green-500'
            : order.status === 'shipped'
                ? 'bg-blue-500/10 text-blue-500'
                : order.status === 'processing'
                    ? 'bg-yellow-500/10 text-yellow-500'
                    : 'bg-gray-500/10 text-gray-500';

        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20';
        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="font-bold text-lg">سفارش #${order.id}</h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">${order.date}</p>
                </div>
                <span class="px-3 py-1 rounded-full text-sm ${statusClass}">${statusLabel}</span>
            </div>
            <div class="space-y-3 mb-4" data-element="order-items"></div>
            <div class="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
                <div class="text-lg font-bold">${formatPrice(order.total)}</div>
                <button class="text-primary hover:text-primary/80 transition-colors">مشاهده جزئیات</button>
            </div>
        `;

        const itemsContainer = card.querySelector('[data-element="order-items"]');
        if (itemsContainer) {
            order.items.forEach(item => {
                const product = getProductById(item.productId);
                if (!product) return;
                const itemRow = document.createElement('div');
                itemRow.className = 'flex justify-between items-center';

                const info = document.createElement('div');
                info.className = 'flex items-center gap-3';

                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center';
                if (product.img) {
                    const img = document.createElement('img');
                    img.src = product.img;
                    img.alt = product.name;
                    img.className = 'w-12 h-12 object-cover rounded-lg';
                    imgWrapper.appendChild(img);
                } else {
                    const icon = document.createElement('iconify-icon');
                    icon.setAttribute('icon', 'mdi:package');
                    icon.setAttribute('width', '20');
                    icon.className = 'text-gray-400';
                    imgWrapper.appendChild(icon);
                }

                const textBlock = document.createElement('div');
                const nameEl = document.createElement('div');
                nameEl.className = 'font-medium';
                nameEl.textContent = product.name;
                const qtyEl = document.createElement('div');
                qtyEl.className = 'text-gray-500 text-sm';
                qtyEl.textContent = `${item.qty} عدد`;
                textBlock.appendChild(nameEl);
                textBlock.appendChild(qtyEl);

                info.appendChild(imgWrapper);
                info.appendChild(textBlock);

                const priceEl = document.createElement('div');
                priceEl.className = 'font-medium';
                const unitPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
                priceEl.textContent = formatPrice(unitPrice * item.qty);

                itemRow.appendChild(info);
                itemRow.appendChild(priceEl);
                itemsContainer.appendChild(itemRow);
            });
        }

        list.appendChild(card);
    });
}

function closeCompareOverlay() {
    if (!compareModal) return;
    compareModal.classList.add('hidden');
    compareModal.classList.remove('flex');
}

function initCartAndCompareControls() {
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', () => {
            cartSidebar.classList.add('open');
        });
    }

    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
        });
    }

    if (compareBtn) {
        compareBtn.addEventListener('click', (event) => {
            event.preventDefault();
            openCompareModal();
        });
    }

    if (closeCompareModal) {
        closeCompareModal.addEventListener('click', closeCompareOverlay);
    }

    if (compareModal) {
        compareModal.addEventListener('click', (event) => {
            if (event.target === compareModal) {
                closeCompareOverlay();
            }
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                notify('سبد خرید شما خالی است', true);
                return;
            }
            location.hash = 'checkout';
            if (cartSidebar) {
                cartSidebar.classList.remove('open');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initCartAndCompareControls);
