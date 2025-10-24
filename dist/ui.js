/* ---------- Checkout Page ---------- */
function renderCheckoutPage(){
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
                                <label class="block text-sm font-medium mb-2">نام</label>
                                <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" value="${user ? user.name : ''}">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">نام خانوادگی</label>
                                <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">آدرس</label>
                            <textarea rows="3" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"></textarea>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">شهر</label>
                                <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">استان</label>
                                <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">کد پستی</label>
                                <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">شماره تماس</label>
                            <input type="tel" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" value="${user ? user.phone : ''}">
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
    updateCheckoutDisplay();
}

function updateCheckoutDisplay() {
    const checkoutItems = $('#checkoutItems');
    const checkoutTotal = $('#checkoutTotal');
    const checkoutDiscount = $('#checkoutDiscount');
    const checkoutShipping = $('#checkoutShipping');
    const checkoutFinalTotal = $('#checkoutFinalTotal');
    
    if (!checkoutItems) return;
    
    checkoutItems.innerHTML = '';
    if (cart.length === 0) {
        checkoutItems.innerHTML = '<p class="text-gray-500 text-center">سبد خرید خالی است</p>';
        checkoutTotal.textContent = '۰ تومان';
        checkoutDiscount.textContent = '۰ تومان';
        checkoutShipping.textContent = '۰ تومان';
        checkoutFinalTotal.textContent = '۰ تومان';
        return;
    }
    
    let total = 0;
    let totalDiscount = 0;
    
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
        itemEl.innerHTML = `
            <div>
                <div class="font-medium">${product.name}</div>
                <div class="text-gray-500">${item.qty} × ${formatPrice(finalPrice)}</div>
            </div>
            <div class="font-medium">${formatPrice(itemTotal)}</div>
        `;
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
function formatOrderDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
        return date.toLocaleString('fa-IR');
    }
    return value;
}

function getOrderStatusInfo(status) {
    const normalized = (status || '').toString().trim();
    const map = {
        'processing': { label: 'در حال پردازش', className: 'bg-yellow-500/10 text-yellow-500' },
        'در حال پردازش': { label: 'در حال پردازش', className: 'bg-yellow-500/10 text-yellow-500' },
        'shipped': { label: 'ارسال شده', className: 'bg-blue-500/10 text-blue-500' },
        'ارسال شده': { label: 'ارسال شده', className: 'bg-blue-500/10 text-blue-500' },
        'delivered': { label: 'تحویل شده', className: 'bg-green-500/10 text-green-500' },
        'تحویل شده': { label: 'تحویل شده', className: 'bg-green-500/10 text-green-500' },
        'cancelled': { label: 'لغو شده', className: 'bg-red-500/10 text-red-500' },
        'لغو شده': { label: 'لغو شده', className: 'bg-red-500/10 text-red-500' }
    };
    return map[normalized] || { label: normalized || 'نامشخص', className: 'bg-gray-500/10 text-gray-500' };
}

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
                ${orders.map(order => {
                    const statusInfo = getOrderStatusInfo(order.status);
                    const paymentInfo = typeof getPaymentMethod === 'function' ? getPaymentMethod(order.paymentMethod) : null;
                    const shippingInfo = typeof getShippingMethod === 'function' ? getShippingMethod(order.shippingMethod) : null;
                    const shippingName = order.shippingTitle || (shippingInfo ? shippingInfo.name : '');
                    const shippingCostValue = typeof order.shippingCost === 'number' ? order.shippingCost : null;
                    const shippingCostLabel = shippingCostValue === null ? '—' : (shippingCostValue === 0 ? 'رایگان' : formatPrice(shippingCostValue));
                    const subtotal = typeof order.subtotal === 'number' ? order.subtotal : (typeof order.total === 'number' ? order.total : 0);
                    const discount = typeof order.discount === 'number' ? order.discount : 0;
                    const totalValue = typeof order.total === 'number' ? order.total : subtotal + (shippingCostValue || 0);
                    const items = Array.isArray(order.items) ? order.items : [];
                    const address = order.address || null;

                    const itemsMarkup = items.map(item => {
                        const product = getProductById(item.productId);
                        const itemName = product ? product.name : `محصول ${item.productId}`;
                        const itemImage = product?.img;
                        const itemQty = item.qty || 1;
                        const itemPrice = product
                            ? (product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price)
                            : null;
                        const lineTotal = itemPrice !== null ? formatPrice(itemPrice * itemQty) : '—';

                        return `
                            <div class="flex justify-between items-center">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        ${itemImage
                                            ? `<img src=\"${itemImage}\" alt=\"${itemName}\" class=\"w-12 h-12 object-cover rounded-lg\" />`
                                            : `<iconify-icon icon=\"mdi:package\" width=\"20\" class=\"text-gray-400\"></iconify-icon>`}
                                    </div>
                                    <div>
                                        <div class="font-medium">${itemName}</div>
                                        <div class="text-gray-500 text-sm">${itemQty} عدد</div>
                                    </div>
                                </div>
                                <div class="font-medium">${lineTotal}</div>
                            </div>
                        `;
                    }).join('') || '<div class=\"text-sm text-gray-500\">آیتمی برای نمایش وجود ندارد</div>';

                    return `
                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h3 class="font-bold text-lg">سفارش #${order.id}</h3>
                                    <p class="text-gray-600 dark:text-gray-400 text-sm">${formatOrderDate(order.date)}</p>
                                </div>
                                <span class="px-3 py-1 rounded-full text-sm ${statusInfo.className}">${statusInfo.label}</span>
                            </div>

                            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                ${shippingName ? `<span class=\"flex items-center gap-2\"><iconify-icon icon=\"mdi:truck\"></iconify-icon><span>${shippingName}</span></span>` : ''}
                                <span class="flex items-center gap-2"><iconify-icon icon="mdi:credit-card-outline"></iconify-icon><span>${paymentInfo ? paymentInfo.name : (order.paymentMethod || '---')}</span></span>
                                <span class="flex items-center gap-2"><iconify-icon icon="mdi:cash"></iconify-icon><span>هزینه ارسال: ${shippingCostLabel}</span></span>
                            </div>

                            ${address ? `
                                <div class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                                    <div class="font-medium text-gray-700 dark:text-gray-200 mb-2">${address.title || 'آدرس ارسال'}</div>
                                    <div>${[address.province, address.city].filter(Boolean).join('، ')}</div>
                                    <div class="mt-1">${address.fullAddress || ''}</div>
                                    <div class="mt-1">کد پستی: ${address.postalCode || '---'}</div>
                                    <div class="mt-1">تلفن: ${address.phone || '---'}</div>
                                </div>
                            ` : ''}

                            <div class="space-y-3 mb-4">
                                ${itemsMarkup}
                            </div>

                            <div class="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
                                <div class="text-sm text-gray-500 dark:text-gray-400 flex flex-col gap-1">
                                    <span>جمع جزء: ${formatPrice(subtotal)}</span>
                                    ${discount > 0 ? `<span class="text-green-600 dark:text-green-400">تخفیف: ${formatPrice(discount)}</span>` : ''}
                                    <span>ارسال: ${shippingCostLabel}</span>
                                </div>
                                <div class="text-lg font-bold">${formatPrice(totalValue)}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `}
    `;
    contentRoot.appendChild(page);
}

function renderOrderSuccessPage(orderId){
    const order = orders.find(item => item.id === orderId);
    const page = document.createElement('div');

    if (!order) {
        page.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-primary/20 text-center">
                <iconify-icon icon="mdi:alert-circle-outline" width="64" class="text-yellow-500 mb-4"></iconify-icon>
                <h1 class="text-2xl font-bold mb-3">سفارشی با این مشخصات یافت نشد</h1>
                <p class="text-gray-600 dark:text-gray-400 mb-6">ممکن است شناسه سفارش را اشتباه وارد کرده باشید یا سفارش حذف شده باشد.</p>
                <a href="#orders" class="inline-flex items-center justify-center bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition-colors">بازگشت به سفارش‌ها</a>
            </div>
        `;
        contentRoot.appendChild(page);
        return;
    }

    const statusInfo = getOrderStatusInfo(order.status);
    const paymentInfo = typeof getPaymentMethod === 'function' ? getPaymentMethod(order.paymentMethod) : null;
    const shippingInfo = typeof getShippingMethod === 'function' ? getShippingMethod(order.shippingMethod) : null;
    const shippingName = order.shippingTitle || (shippingInfo ? shippingInfo.name : '');
    const shippingCostValue = typeof order.shippingCost === 'number' ? order.shippingCost : 0;
    const shippingCostLabel = shippingCostValue === 0 ? 'رایگان' : formatPrice(shippingCostValue);
    const subtotal = typeof order.subtotal === 'number' ? order.subtotal : (typeof order.total === 'number' ? order.total - shippingCostValue : 0);
    const discount = typeof order.discount === 'number' ? order.discount : 0;
    const totalValue = typeof order.total === 'number' ? order.total : subtotal + shippingCostValue;
    const address = order.address || null;
    const items = Array.isArray(order.items) ? order.items : [];

    page.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-primary/20">
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 text-green-500 mb-4">
                    <iconify-icon icon="mdi:check-circle" width="48"></iconify-icon>
                </div>
                <h1 class="text-3xl font-bold mb-2">سفارش شما با موفقیت ثبت شد!</h1>
                <p class="text-gray-600 dark:text-gray-400">از خرید شما سپاسگزاریم. جزئیات سفارش در زیر آمده است.</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <h2 class="font-semibold mb-3 text-gray-700 dark:text-gray-200">اطلاعات سفارش</h2>
                    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div class="flex justify-between">
                            <span>شناسه سفارش:</span>
                            <span class="font-medium text-gray-800 dark:text-gray-200">${order.id}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>تاریخ ثبت:</span>
                            <span>${formatOrderDate(order.date)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>وضعیت:</span>
                            <span class="px-3 py-1 rounded-full text-xs ${statusInfo.className}">${statusInfo.label}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>روش پرداخت:</span>
                            <span>${paymentInfo ? paymentInfo.name : (order.paymentMethod || '---')}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>روش ارسال:</span>
                            <span>${shippingName || '---'}</span>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 lg:col-span-2">
                    <h2 class="font-semibold mb-3 text-gray-700 dark:text-gray-200">آدرس تحویل</h2>
                    ${address ? `
                        <div class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <div>${[address.title, address.province, address.city].filter(Boolean).join('، ')}</div>
                            <div>${address.fullAddress || ''}</div>
                            <div>کد پستی: ${address.postalCode || '---'}</div>
                            <div>تلفن: ${address.phone || '---'}</div>
                        </div>
                    ` : '<p class="text-sm text-gray-500">آدرس ثبت شده‌ای برای این سفارش وجود ندارد.</p>'}
                </div>
            </div>

            <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-6">
                <h2 class="font-semibold mb-4 text-gray-700 dark:text-gray-200">اقلام سفارش</h2>
                <div class="space-y-4">
                    ${items.map(item => {
                        const product = getProductById(item.productId);
                        const itemName = product ? product.name : `محصول ${item.productId}`;
                        const itemImage = product?.img;
                        const itemQty = item.qty || 1;
                        const itemPrice = product
                            ? (product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price)
                            : null;
                        const lineTotal = itemPrice !== null ? formatPrice(itemPrice * itemQty) : '—';

                        return `
                            <div class="flex justify-between items-center">
                                <div class="flex items-center gap-3">
                                    <div class="w-14 h-14 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        ${itemImage
                                            ? `<img src="${itemImage}" alt="${itemName}" class="w-14 h-14 object-cover" />`
                                            : `<iconify-icon icon="mdi:package" width="24" class="text-gray-400"></iconify-icon>`}
                                    </div>
                                    <div>
                                        <div class="font-medium">${itemName}</div>
                                        <div class="text-gray-500 text-sm">${itemQty} عدد</div>
                                    </div>
                                </div>
                                <div class="font-medium">${lineTotal}</div>
                            </div>
                        `;
                    }).join('') || '<div class="text-sm text-gray-500">آیتمی برای نمایش وجود ندارد</div>'}
                </div>
            </div>

            <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>جمع جزء:</span>
                    <span>${formatPrice(subtotal)}</span>
                </div>
                ${discount > 0 ? `<div class="flex justify-between text-sm text-green-600 dark:text-green-400 mb-2"><span>تخفیف:</span><span>${formatPrice(discount)}</span></div>` : ''}
                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>هزینه ارسال:</span>
                    <span>${shippingCostLabel}</span>
                </div>
                <div class="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <span class="font-semibold text-lg">مبلغ قابل پرداخت:</span>
                    <span class="text-2xl font-bold text-primary">${formatPrice(totalValue)}</span>
                </div>
            </div>

            <div class="mt-8 flex flex-wrap gap-3 justify-center">
                <a href="#orders" class="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition-colors">مشاهده سفارش‌ها</a>
                <a href="#products" class="border border-primary text-primary px-5 py-2 rounded-lg hover:bg-primary/10 transition-colors">ادامه خرید</a>
            </div>
        </div>
    `;

    contentRoot.appendChild(page);
}
