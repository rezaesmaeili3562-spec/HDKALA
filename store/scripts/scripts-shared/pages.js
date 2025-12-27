/* ---------- Product Detail Page ---------- */
function renderProductDetailPage(id){
    if (!contentRoot || typeof getProductById !== 'function') {
        return;
    }
    const p = getProductById(id);
    if(!p){ 
        contentRoot.innerHTML = `
            <div class="text-center text-gray-500 py-20">
                <iconify-icon icon="mdi:package-variant-remove" width="64" class="mb-4"></iconify-icon>
                <p class="text-lg">محصول مورد نظر یافت نشد</p>
                <a href="#products" class="text-primary hover:text-primary/80 mt-4 inline-block">بازگشت به محصولات</a>
            </div>
        `; 
        return; 
    }
    
    if (typeof addViewedProduct === 'function') {
        addViewedProduct(id);
    }
    const finalPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
    const wishlistSafe = Array.isArray(window.wishlist) ? window.wishlist : [];
    const compareSafe = Array.isArray(window.compareList) ? window.compareList : [];
    const inWishlist = wishlistSafe.includes(p.id);
    const inCompare = compareSafe.includes(p.id);
    
    const page = document.createElement('div');
    page.innerHTML = `
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <a href="#home" class="hover:text-primary transition-colors">خانه</a>
            <iconify-icon icon="mdi:chevron-left" width="16"></iconify-icon>
            <a href="#products" class="hover:text-primary transition-colors">محصولات</a>
            <iconify-icon icon="mdi:chevron-left" width="16"></iconify-icon>
            <a data-element="breadcrumb-category" class="hover:text-primary transition-colors"></a>
            <iconify-icon icon="mdi:chevron-left" width="16"></iconify-icon>
            <span class="text-primary" data-element="breadcrumb-product"></span>
        </nav>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <!-- Product Images -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                <div class="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                    <img data-element="product-image" class="w-full h-96 object-cover rounded-lg zoom-image hidden" />
                    <iconify-icon data-element="product-image-placeholder" icon="mdi:image-off" width="64" class="text-gray-400"></iconify-icon>
                </div>
                <div class="grid grid-cols-4 gap-2" data-element="product-thumbnails"></div>
            </div>
            
            <!-- Product Info -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                <div class="flex justify-between items-start mb-4">
                    <h1 class="text-2xl font-bold" data-element="product-name"></h1>
                    <div class="flex gap-2">
                        <button class="add-to-wishlist p-2 text-gray-500 hover:text-red-500 transition-colors" data-element="wishlist-button">
                            <iconify-icon data-element="wishlist-icon" width="24"></iconify-icon>
                        </button>
                        <button class="add-to-compare p-2 text-gray-500 hover:text-primary transition-colors" data-element="compare-button">
                            <iconify-icon icon="mdi:scale-balance" width="24"></iconify-icon>
                        </button>
                        <button class="notify-me p-2 text-gray-500 hover:text-blue-500 transition-colors" data-element="notify-button">
                            <iconify-icon icon="mdi:bell-outline" width="24"></iconify-icon>
                        </button>
                    </div>
                </div>
                
                <div class="flex items-center gap-2 mb-4">
                    <div class="text-yellow-500" data-element="product-rating"></div>
                    <span class="text-gray-500 text-sm">(۱۲ نظر)</span>
                </div>
                
                <div class="mb-6">
                    <div class="flex items-center gap-4 mb-2" data-element="price-with-discount">
                        <span class="text-2xl font-bold text-primary" data-element="final-price"></span>
                        <span class="text-lg text-gray-500 line-through" data-element="original-price"></span>
                        <span class="bg-red-500 text-white px-2 py-1 rounded-full text-sm" data-element="discount-badge"></span>
                    </div>
                    <div class="text-2xl font-bold text-primary mb-2" data-element="price-no-discount"></div>
                    
                    <div data-element="status-badges"></div>
                </div>
                
                <p class="text-gray-600 dark:text-gray-400 mb-6" data-element="product-description"></p>
                
                <div class="mb-6 hidden" data-element="color-section">
                    <h3 class="font-medium mb-2">رنگ‌بندی:</h3>
                    <div class="flex gap-2" data-element="color-options"></div>
                </div>
                
                <div class="mb-6">
                    <h3 class="font-medium mb-2">تعداد:</h3>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2">
                            <button class="decrease-qty w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">-</button>
                            <span class="w-12 text-center text-lg quantity-display">1</span>
                            <button class="increase-qty w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">+</button>
                        </div>
                        <div class="text-sm text-gray-500" data-element="stock-status"></div>
                    </div>
                </div>
                
                <div class="flex gap-3 mb-6">
                    <button class="add-to-cart flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2" data-element="add-to-cart">
                        <iconify-icon icon="mdi:cart-plus" width="20"></iconify-icon>
                        <span data-element="add-to-cart-text"></span>
                    </button>
                    <button class="buy-now flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors" data-element="buy-now">
                        خرید الآن
                    </button>
                </div>
                
                <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div class="flex items-center gap-1">
                            <iconify-icon icon="mdi:package-variant"></iconify-icon>
                            <span>ارسال رایگان برای خرید بالای ۵۰۰ هزار تومان</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <iconify-icon icon="mdi:shield-check"></iconify-icon>
                            <span>ضمانت بازگشت ۷ روزه</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Product Tabs -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-primary/20 mb-12">
            <div class="border-b border-gray-200 dark:border-gray-700">
                <div class="flex gap-8 px-6">
                    <button class="tab-button py-4 border-b-2 border-primary text-primary font-medium" data-tab="description">توضیحات محصول</button>
                    <button class="tab-button py-4 border-b-2 border-transparent text-gray-500 hover:text-primary transition-colors" data-tab="specifications">مشخصات فنی</button>
                    <button class="tab-button py-4 border-b-2 border-transparent text-gray-500 hover:text-primary transition-colors" data-tab="reviews">نظرات (۱۲)</button>
                </div>
            </div>
            <div class="p-6">
                <div id="tab-description" class="tab-content active">
                    <p class="text-gray-600 dark:text-gray-400 leading-relaxed" data-element="tab-description"></p>
                    <div class="mt-6 hidden" data-element="feature-section">
                        <h4 class="font-medium mb-3">ویژگی‌های اصلی:</h4>
                        <ul class="grid grid-cols-1 md:grid-cols-2 gap-2" data-element="feature-list"></ul>
                    </div>
                </div>
                
                <div id="tab-specifications" class="tab-content">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-element="spec-list"></div>
                </div>
                
                <div id="tab-reviews" class="tab-content">
                    <div class="space-y-6">
                        <div class="flex items-center gap-4 mb-6">
                            <div class="text-center">
                                <div class="text-3xl font-bold text-primary">۴.۲</div>
                                <div class="text-yellow-500">★★★★☆</div>
                                <div class="text-sm text-gray-500 mt-1">بر اساس ۱۲ نظر</div>
                            </div>
                            <div class="flex-1 space-y-2">
                                ${[5,4,3,2,1].map(stars => `
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm w-8">${stars} ستاره</span>
                                        <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div class="bg-yellow-500 h-2 rounded-full" style="width: ${stars === 5 ? '70%' : stars === 4 ? '20%' : stars === 3 ? '8%' : stars === 2 ? '2%' : '0%'}"></div>
                                        </div>
                                        <span class="text-sm w-8 text-gray-500">${stars === 5 ? '۷۰%' : stars === 4 ? '۲۰%' : stars === 3 ? '۸%' : stars === 2 ? '۲%' : '۰%'}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="space-y-4">
                            ${[1,2,3].map(i => `
                                <div class="border-b border-gray-100 dark:border-gray-700 pb-4">
                                    <div class="flex justify-between items-start mb-2">
                                        <div>
                                            <div class="font-medium">کاربر ${i}</div>
                                            <div class="text-yellow-500 text-sm">★★★★★</div>
                                        </div>
                                        <span class="text-sm text-gray-500">۱۴۰۲/۱۰/${10+i}</span>
                                    </div>
                                    <p class="text-gray-600 dark:text-gray-400 text-sm">محصول بسیار با کیفیتی بود. از خریدم راضی هستم و توصیه می‌کنم.</p>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="mt-6">
                            <h4 class="font-medium mb-4">ثبت نظر</h4>
                            <form class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium mb-2">امتیاز شما</label>
                                    <div class="flex gap-1" id="rating-stars">
                                        ${[1,2,3,4,5].map(star => `
                                            <iconify-icon icon="mdi:star-outline" class="rating-star text-2xl text-gray-300 cursor-pointer" data-rating="${star}"></iconify-icon>
                                        `).join('')}
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-2">نظر شما</label>
                                    <textarea rows="4" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" placeholder="نظر خود را بنویسید..."></textarea>
                                </div>
                                <button type="submit" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">ثبت نظر</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Related Products -->
        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6">محصولات مرتبط</h2>
            <div id="relatedProducts" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"></div>
        </section>
    `;
    contentRoot.appendChild(page);

    const breadcrumbCategory = page.querySelector('[data-element="breadcrumb-category"]');
    if (breadcrumbCategory) {
        breadcrumbCategory.href = `#products:${p.category}`;
        breadcrumbCategory.textContent = typeof getCategoryName === 'function' ? getCategoryName(p.category) : p.category;
    }

    const breadcrumbProduct = page.querySelector('[data-element="breadcrumb-product"]');
    if (breadcrumbProduct) {
        breadcrumbProduct.textContent = p.name;
    }

    const imageEl = page.querySelector('[data-element="product-image"]');
    const placeholderEl = page.querySelector('[data-element="product-image-placeholder"]');
    if (imageEl) {
        if (p.img) {
            imageEl.src = p.img;
            imageEl.alt = p.name;
            imageEl.classList.remove('hidden');
            placeholderEl?.classList.add('hidden');
        } else {
            imageEl.classList.add('hidden');
            placeholderEl?.classList.remove('hidden');
        }
    }

    const thumbnails = page.querySelector('[data-element="product-thumbnails"]');
    if (thumbnails) {
        thumbnails.innerHTML = '';
        [1,2,3,4].forEach(() => {
            const thumb = document.createElement('div');
            thumb.className = 'h-20 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center cursor-pointer border-2 border-transparent hover:border-primary transition-colors';
            if (p.img) {
                const img = document.createElement('img');
                img.src = p.img;
                img.alt = p.name;
                img.className = 'w-full h-20 object-cover rounded-lg';
                thumb.appendChild(img);
            } else {
                const icon = document.createElement('iconify-icon');
                icon.setAttribute('icon', 'mdi:image');
                icon.setAttribute('width', '24');
                icon.className = 'text-gray-400';
                thumb.appendChild(icon);
            }
            thumbnails.appendChild(thumb);
        });
    }

    const nameEl = page.querySelector('[data-element="product-name"]');
    if (nameEl) {
        nameEl.textContent = p.name;
    }

    const wishlistButton = page.querySelector('[data-element="wishlist-button"]');
    const wishlistIcon = page.querySelector('[data-element="wishlist-icon"]');
    if (wishlistButton) {
        wishlistButton.dataset.id = p.id;
    }
    if (wishlistIcon) {
        wishlistIcon.setAttribute('icon', inWishlist ? 'mdi:heart' : 'mdi:heart-outline');
    }

    const compareButton = page.querySelector('[data-element="compare-button"]');
    if (compareButton) {
        compareButton.dataset.id = p.id;
    }

    const notifyButton = page.querySelector('[data-element="notify-button"]');
    if (notifyButton) {
        notifyButton.dataset.id = p.id;
    }

    const ratingEl = page.querySelector('[data-element="product-rating"]');
    if (ratingEl) {
        const rating = Math.max(0, Math.min(5, p.rating || 0));
        ratingEl.textContent = `${'★'.repeat(rating)}${rating < 5 ? '☆'.repeat(5 - rating) : ''}`;
    }

    const priceWithDiscount = page.querySelector('[data-element="price-with-discount"]');
    const priceNoDiscount = page.querySelector('[data-element="price-no-discount"]');
    const finalPriceEl = page.querySelector('[data-element="final-price"]');
    const originalPriceEl = page.querySelector('[data-element="original-price"]');
    const discountBadgeEl = page.querySelector('[data-element="discount-badge"]');
    const hasDiscount = p.discount > 0;
    if (priceWithDiscount && priceNoDiscount) {
        priceWithDiscount.classList.toggle('hidden', !hasDiscount);
        priceNoDiscount.classList.toggle('hidden', hasDiscount);
    }
    if (finalPriceEl) {
        finalPriceEl.textContent = formatPrice(finalPrice);
    }
    if (originalPriceEl) {
        originalPriceEl.textContent = formatPrice(p.price);
    }
    if (discountBadgeEl) {
        discountBadgeEl.textContent = `${p.discount}% تخفیف`;
    }
    if (priceNoDiscount && !hasDiscount) {
        priceNoDiscount.textContent = formatPrice(finalPrice);
    }

    const statusBadges = page.querySelector('[data-element="status-badges"]');
    if (statusBadges) {
        statusBadges.innerHTML = '';
        if (p.status === 'new') {
            const badge = document.createElement('span');
            badge.className = 'badge badge-new mr-2';
            badge.textContent = 'جدید';
            statusBadges.appendChild(badge);
        }
        if (p.status === 'hot') {
            const badge = document.createElement('span');
            badge.className = 'badge badge-hot mr-2';
            badge.textContent = 'فروش ویژه';
            statusBadges.appendChild(badge);
        }
        if (p.status === 'bestseller') {
            const badge = document.createElement('span');
            badge.className = 'badge bg-purple-500 text-white mr-2';
            badge.textContent = 'پرفروش';
            statusBadges.appendChild(badge);
        }
    }

    const descEl = page.querySelector('[data-element="product-description"]');
    if (descEl) {
        descEl.textContent = p.desc || '';
    }

    const colorSection = page.querySelector('[data-element="color-section"]');
    const colorOptions = page.querySelector('[data-element="color-options"]');
    if (colorSection && colorOptions) {
        if (Array.isArray(p.colors) && p.colors.length > 0) {
            colorSection.classList.remove('hidden');
            colorOptions.innerHTML = '';
            p.colors.forEach(color => {
                const button = document.createElement('button');
                button.className = 'color-option px-3 py-1 border border-gray-300 rounded-lg hover:border-primary transition-colors';
                button.dataset.color = color;
                button.textContent = color;
                colorOptions.appendChild(button);
            });
        } else {
            colorSection.classList.add('hidden');
        }
    }

    const stockStatus = page.querySelector('[data-element="stock-status"]');
    if (stockStatus) {
        stockStatus.innerHTML = '';
        const span = document.createElement('span');
        if (p.stock > 0) {
            span.className = 'text-green-500';
            span.textContent = `${p.stock} عدد در انبار`;
        } else {
            span.className = 'text-red-500';
            span.textContent = 'ناموجود';
        }
        stockStatus.appendChild(span);
    }

    const addToCartButton = page.querySelector('[data-element="add-to-cart"]');
    const addToCartText = page.querySelector('[data-element="add-to-cart-text"]');
    if (addToCartButton && addToCartText) {
        addToCartButton.dataset.id = p.id;
        addToCartButton.disabled = p.stock === 0;
        addToCartText.textContent = p.stock > 0 ? 'افزودن به سبد خرید' : 'ناموجود';
    }

    const buyNowButton = page.querySelector('[data-element="buy-now"]');
    if (buyNowButton) {
        buyNowButton.dataset.id = p.id;
        buyNowButton.disabled = p.stock === 0;
    }

    const tabDescription = page.querySelector('[data-element="tab-description"]');
    if (tabDescription) {
        tabDescription.textContent = p.desc || '';
    }

    const featureSection = page.querySelector('[data-element="feature-section"]');
    const featureList = page.querySelector('[data-element="feature-list"]');
    if (featureSection && featureList) {
        if (Array.isArray(p.features) && p.features.length > 0) {
            featureSection.classList.remove('hidden');
            featureList.innerHTML = '';
            p.features.forEach(feature => {
                const item = document.createElement('li');
                item.className = 'flex items-center gap-2 text-sm';
                const icon = document.createElement('iconify-icon');
                icon.setAttribute('icon', 'mdi:check-circle');
                icon.className = 'text-green-500';
                const text = document.createElement('span');
                text.textContent = feature;
                item.appendChild(icon);
                item.appendChild(text);
                featureList.appendChild(item);
            });
        } else {
            featureSection.classList.add('hidden');
        }
    }

    const specList = page.querySelector('[data-element="spec-list"]');
    if (specList) {
        specList.innerHTML = '';
        const specs = p.specifications && typeof p.specifications === 'object' ? p.specifications : {};
        Object.entries(specs).forEach(([key, value]) => {
            const row = document.createElement('div');
            row.className = 'flex justify-between py-2 border-b border-gray-100 dark:border-gray-700';
            const keyEl = document.createElement('span');
            keyEl.className = 'text-gray-600 dark:text-gray-400';
            keyEl.textContent = `${key}:`;
            const valueEl = document.createElement('span');
            valueEl.className = 'font-medium';
            valueEl.textContent = value;
            row.appendChild(keyEl);
            row.appendChild(valueEl);
            specList.appendChild(row);
        });
    }
    
    // Show related products (same category)
    const related = Array.isArray(products)
        ? products.filter(product => product.category === p.category && product.id !== p.id).slice(0, 4)
        : [];
    renderProductsList(related, $('#relatedProducts'));
    
    // Add event listeners
    if (typeof setupProductDetailEvents === 'function') {
        setupProductDetailEvents(page, p);
    }
}

function setupProductDetailEvents(page, product) {
    let quantity = 1;
    const quantityDisplay = $('.quantity-display', page);
    
    // Quantity controls
    $('.decrease-qty', page).addEventListener('click', () => {
        if(quantity > 1){
            quantity--;
            quantityDisplay.textContent = quantity;
        }
    });
    
    $('.increase-qty', page).addEventListener('click', () => {
        if(quantity < product.stock){
            quantity++;
            quantityDisplay.textContent = quantity;
        }
    });
    
    // Product actions
    page.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.add-to-cart');
        if(addBtn){ 
            addToCart(addBtn.getAttribute('data-id'), quantity); 
            return; 
        }
        
        const favBtn = e.target.closest('.add-to-wishlist');
        if(favBtn){ 
            toggleWishlist(favBtn.getAttribute('data-id')); 
            return; 
        }
        
        const compBtn = e.target.closest('.add-to-compare');
        if(compBtn){ 
            toggleCompare(compBtn.getAttribute('data-id')); 
            return; 
        }
        
        const notifyBtn = e.target.closest('.notify-me');
        if(notifyBtn){ 
            showNotifyMeModal(product); 
            return; 
        }
        
        const buyBtn = e.target.closest('.buy-now');
        if(buyBtn){ 
            addToCart(buyBtn.getAttribute('data-id'), quantity); 
            location.hash = 'checkout';
            return; 
        }
        
        const tabBtn = e.target.closest('.tab-button');
        if(tabBtn){
            $$('.tab-button', page).forEach(btn => {
                btn.classList.remove('border-primary', 'text-primary');
                btn.classList.add('border-transparent', 'text-gray-500');
            });
            tabBtn.classList.add('border-primary', 'text-primary');
            tabBtn.classList.remove('border-transparent', 'text-gray-500');
            
            $$('.tab-content', page).forEach(content => content.classList.remove('active'));
            $(`#tab-${tabBtn.getAttribute('data-tab')}`, page).classList.add('active');
            return;
        }
        
        const star = e.target.closest('.rating-star');
        if(star){
            const rating = parseInt(star.getAttribute('data-rating'));
            $$('.rating-star', page).forEach((s, index) => {
                if(index < rating){
                    s.classList.add('filled');
                    s.setAttribute('icon', 'mdi:star');
                } else {
                    s.classList.remove('filled');
                    s.setAttribute('icon', 'mdi:star-outline');
                }
            });
            return;
        }
    });
    
    $('#relatedProducts', page).addEventListener('click', handleProductActions);
}

function showNotifyMeModal(product) {
    const modalContainer = createNotifyMeModal(product);
    if (!modalContainer) {
        return;
    }
    document.body.appendChild(modalContainer);
    
    // Event listeners for modal
    $('.close-notify-modal', modalContainer).addEventListener('click', () => {
        modalContainer.remove();
    });
    
    $('#notifyMeForm', modalContainer).addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;
        const phone = form.querySelector('input[type="tel"]').value;
        
        if (!validateEmail(email)) {
            notify('ایمیل وارد شده معتبر نیست', true);
            return;
        }
        
        if (!validatePhone(phone)) {
            notify('شماره تلفن معتبر نیست', true);
            return;
        }
        
        // Save notification request
        const notification = {
            id: uid('n'),
            productId: product.id,
            productName: product.name,
            email: email,
            phone: phone,
            date: new Date().toISOString(),
            notified: false
        };
        
        notifications.push(notification);
        LS.set('HDK_notifications', notifications);
        
        modalContainer.remove();
        notify('درخواست شما ثبت شد. هنگام موجود شدن محصول به شما اطلاع داده خواهد شد.');
    });
}

/* ---------- Wishlist Page ---------- */
function renderWishlistPage(){
    const wishlistProducts = products.filter(p => wishlist.includes(p.id));
    const page = document.createElement('div');
    page.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">لیست علاقه‌مندی‌ها</h1>
            <span class="text-gray-600 dark:text-gray-400">${wishlist.length} محصول</span>
        </div>
        ${wishlist.length === 0 ? `
            <div class="text-center py-12">
                <iconify-icon icon="mdi:heart-off" width="64" class="text-gray-400 mb-4"></iconify-icon>
                <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">لیست علاقه‌مندی‌های شما خالی است</p>
                <a href="#products" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">مشاهده محصولات</a>
            </div>
        ` : `
            <div id="wishlistProducts" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"></div>
        `}
    `;
    contentRoot.appendChild(page);
    
    if(wishlist.length > 0){
        renderProductsList(wishlistProducts, $('#wishlistProducts'));
        $('#wishlistProducts').addEventListener('click', handleProductActions);
    }
}

/* ---------- Compare Page ---------- */
function renderComparePage(){
    renderProductsPage();
    openCompareModal();
}

/* ---------- Cart Page ---------- */
function renderCartPage(){
    cartSidebar.classList.add('open');
    navigate('products');
}

/* ---------- Address Management ---------- */
let addressEventsInitialized = false;
function renderAddressesPage() {
    if (!user) {
        notify('لطفا ابتدا وارد حساب کاربری خود شوید', true);
        if (typeof updateAddressQuickPanel === 'function') {
            updateAddressQuickPanel(true);
        }
        location.hash = 'login';
        return;
    }

    const userAddresses = addresses.filter(addr => addr.userId === user.id);
    
    const page = document.createElement('div');
    page.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">آدرس‌های من</h1>
            <button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors" id="addAddressBtn">
                افزودن آدرس جدید
            </button>
        </div>
        
        <div id="addressesList" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            ${userAddresses.length === 0 ? `
                <div class="col-span-full text-center py-12">
                    <iconify-icon icon="mdi:map-marker-off" width="64" class="text-gray-400 mb-4"></iconify-icon>
                    <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">هنوز آدرسی ثبت نکرده‌اید</p>
                </div>
            ` : userAddresses.map(address => createAddressCard(address, address.isDefault)).join('')}
        </div>
        
        <div id="addressFormContainer" class="hidden"></div>
    `;

    contentRoot.appendChild(page);
    if (typeof updateAddressQuickPanel === 'function') {
        updateAddressQuickPanel(true);
    }
    setupAddressEvents();
    if (userAddresses.length === 0) {
        showAddressForm();
    }
}

function setupAddressEvents() {
    const addBtn = $('#addAddressBtn');
    if (addBtn) {
        addBtn.addEventListener('click', showAddressForm);
    }

    if (addressEventsInitialized) {
        return;
    }
    addressEventsInitialized = true;

    // Edit address
    document.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-address');
        if (editBtn) {
            const addressId = editBtn.getAttribute('data-id');
            const address = addresses.find(addr => addr.id === addressId);
            if (address) {
                showAddressForm(address);
            }
        }
    });

    // Delete address
    document.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-address');
        if (deleteBtn) {
            const addressId = deleteBtn.getAttribute('data-id');
            deleteAddress(addressId);
        }
    });

    // Set default address
    document.addEventListener('click', (e) => {
        const setDefaultBtn = e.target.closest('.set-default-address');
        if (setDefaultBtn) {
            const addressId = setDefaultBtn.getAttribute('data-id');
            setDefaultAddress(addressId);
        }
    });
}

function showAddressForm(address = null) {
    const formContainer = $('#addressFormContainer');
    formContainer.innerHTML = createAddressForm(address);
    formContainer.classList.remove('hidden');
    
    // Load provinces and cities
    loadProvinces();
    if (address?.province) {
        loadCities(address.province);
    }
    
    // Province change handler
    $('#addressProvince').addEventListener('change', function() {
        loadCities(this.value);
    });
    
    // Form submission
    $('#addressForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveAddress(address?.id);
    });
    
    // Cancel button
    $('.cancel-address-form').addEventListener('click', () => {
        formContainer.classList.add('hidden');
    });
}

function saveAddress(addressId = null) {
    const form = $('#addressForm');
    const formData = {
        title: form.querySelector('input[type="text"]').value,
        province: $('#addressProvince').value,
        city: $('#addressCity').value,
        fullAddress: form.querySelector('textarea').value,
        postalCode: form.querySelector('input[data-postal]').value,
        phone: form.querySelector('input[data-phone]').value,
        isDefault: form.querySelector('#isDefault').checked,
        userId: user.id
    };
    
    // Validation
    if (!validatePostalCode(formData.postalCode)) {
        notify('کد پستی باید 10 رقمی باشد', true);
        return;
    }
    
    if (!validatePhone(formData.phone)) {
        notify('شماره تلفن معتبر نیست', true);
        return;
    }
    
    if (addressId) {
        // Update existing address
        const index = addresses.findIndex(addr => addr.id === addressId);
        if (index !== -1) {
            addresses[index] = { ...addresses[index], ...formData };
        }
    } else {
        // Add new address
        const newAddress = {
            id: uid('addr'),
            ...formData
        };
        addresses.push(newAddress);
    }
    
    // If this is set as default, remove default from others
    if (formData.isDefault) {
        addresses.forEach(addr => {
            if (addr.userId === user.id && addr.id !== addressId) {
                addr.isDefault = false;
            }
        });
    }
    
    LS.set('HDK_addresses', addresses);
    $('#addressFormContainer').classList.add('hidden');
    notify(addressId ? 'آدرس با موفقیت ویرایش شد' : 'آدرس جدید با موفقیت اضافه شد');
    if (typeof updateAddressQuickPanel === 'function') {
        updateAddressQuickPanel();
    }

    // Refresh addresses page
    if (currentPage === 'addresses') {
        renderAddressesPage();
    }
}

function deleteAddress(addressId) {
    if (confirm('آیا از حذف این آدرس مطمئن هستید؟')) {
        addresses = addresses.filter(addr => addr.id !== addressId);
        LS.set('HDK_addresses', addresses);
        notify('آدرس با موفقیت حذف شد');
        if (typeof updateAddressQuickPanel === 'function') {
            updateAddressQuickPanel();
        }

        // Refresh addresses page
        if (currentPage === 'addresses') {
            renderAddressesPage();
        }
    }
}

function setDefaultAddress(addressId) {
    addresses.forEach(addr => {
        if (addr.userId === user.id) {
            addr.isDefault = addr.id === addressId;
        }
    });

    LS.set('HDK_addresses', addresses);
    notify('آدرس پیش‌فرض تغییر کرد');
    if (typeof updateAddressQuickPanel === 'function') {
        updateAddressQuickPanel();
    }

    // Refresh addresses page
    if (currentPage === 'addresses') {
        renderAddressesPage();
    }
}
