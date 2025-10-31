/* ---------- Product Detail Page ---------- */
function renderProductDetailSkeleton() {
    if (!contentRoot) return;
    contentRoot.setAttribute('aria-busy', 'true');
    contentRoot.innerHTML = `
        <div class="space-y-8 animate-pulse" role="status" aria-live="polite">
            <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                <div class="space-y-4">
                    <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3"></div>
                    <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2"></div>
                </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                ${Array.from({ length: 4 }, () => '<div class="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>').join('')}
            </div>
        </div>
    `;
}

function createProductBreadcrumbSection(product) {
    return `
        <nav class="mb-6" aria-label="مسیر راهنما">
            <ol class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#home" class="hover:text-primary transition-colors">خانه</a></li>
                <li aria-hidden="true"><iconify-icon icon="mdi:chevron-left" width="16"></iconify-icon></li>
                <li><a href="#products" class="hover:text-primary transition-colors">محصولات</a></li>
                <li aria-hidden="true"><iconify-icon icon="mdi:chevron-left" width="16"></iconify-icon></li>
                <li><a href="#products:${product.category}" class="hover:text-primary transition-colors">${getCategoryName(product.category)}</a></li>
                <li aria-hidden="true"><iconify-icon icon="mdi:chevron-left" width="16"></iconify-icon></li>
                <li><span class="text-primary">${product.name}</span></li>
            </ol>
        </nav>
    `;
}

function createProductMediaSection(product, viewModel) {
    const { productImages, mainImage } = viewModel;
    return `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
            <div class="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                ${mainImage
                    ? `<img id="mainProductImage" src="${mainImage}" alt="${product.name}" class="w-full h-96 object-cover rounded-lg" data-active="${mainImage}" />`
                    : `<iconify-icon icon="mdi:image-off" width="64" class="text-gray-400"></iconify-icon>`}
            </div>
            ${productImages.length > 1 ? `
                <div class="grid grid-cols-4 gap-2 mt-4">
                    ${productImages.map((image, index) => `
                        <button type="button"
                                class="product-thumbnail h-20 rounded-lg overflow-hidden border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors ${index === 0 ? 'border-primary ring-2 ring-primary/30 shadow-sm' : 'hover:border-primary/60'}"
                                data-image="${image}"
                                aria-label="تصویر ${index + 1}"
                                aria-selected="${index === 0 ? 'true' : 'false'}">
                            <img src="${image}" alt="${product.name}" class="w-full h-20 object-cover" />
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

function createProductInfoSection(product, viewModel) {
    const {
        inWishlist,
        isOutOfStock,
        finalPrice,
        addToCartButtonClasses,
        addToCartIcon,
        addToCartLabelMarkup,
        buyNowClasses,
        stockLabel,
        hasColors,
        hasSizes,
        variantSummaryText,
        initialQuantity
    } = viewModel;

    const colorOptions = hasColors ? `
        <div class="mb-6">
            <h3 class="font-medium mb-2">انتخاب رنگ</h3>
            <div class="flex flex-wrap gap-2">
                ${product.colors.map((color, index) => `
                    <button type="button"
                            class="color-option px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${index === 0 ? 'bg-primary/5 border-primary text-primary ring-2 ring-primary/30 shadow-sm' : 'hover:border-primary/60'}"
                            data-color="${color}"
                            aria-pressed="${index === 0 ? 'true' : 'false'}">
                        ${color}
                    </button>
                `).join('')}
            </div>
        </div>
    ` : '';

    const sizeOptions = hasSizes ? `
        <div class="mb-6">
            <h3 class="font-medium mb-2">انتخاب سایز</h3>
            <div class="flex flex-wrap gap-2">
                ${product.sizes.map((size, index) => `
                    <button type="button"
                            class="size-option px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${index === 0 ? 'bg-primary/5 border-primary text-primary ring-2 ring-primary/30 shadow-sm' : 'hover:border-primary/60'}"
                            data-size="${size}"
                            aria-pressed="${index === 0 ? 'true' : 'false'}">
                        ${size}
                    </button>
                `).join('')}
            </div>
        </div>
    ` : '';

    const variantSummary = (hasColors || hasSizes) ? `
        <div class="selected-variant text-sm text-gray-600 dark:text-gray-300 bg-primary/5 border border-dashed border-primary/30 rounded-xl px-4 py-3 mb-6">
            ${variantSummaryText}
        </div>
    ` : '';

    return `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
            <div class="flex justify-between items-start mb-4">
                <h1 class="text-2xl font-bold">${product.name}</h1>
                <div class="flex gap-2">
                    <button class="add-to-wishlist wishlist-button wishlist-button--compact p-2 transition-colors"
                            data-id="${product.id}"
                            aria-label="${inWishlist ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}"
                            data-wishlist-active="${inWishlist ? 'true' : 'false'}"
                            data-label-active="حذف از علاقه‌مندی"
                            data-label-inactive="افزودن به علاقه‌مندی">
                        <span class="wishlist-icon-wrapper">
                            <iconify-icon icon="${inWishlist ? 'mdi:heart' : 'mdi:heart-outline'}" width="24" class="wishlist-icon wishlist-icon-current"></iconify-icon>
                            <iconify-icon icon="${inWishlist ? 'mdi:heart-off' : 'mdi:heart-plus'}" width="24" class="wishlist-icon wishlist-icon-preview"></iconify-icon>
                        </span>
                        <span class="wishlist-tooltip"></span>
                    </button>
                    <button class="add-to-compare p-2 text-gray-500 hover:text-primary transition-colors" data-id="${product.id}">
                        <iconify-icon icon="mdi:scale-balance" width="24"></iconify-icon>
                    </button>
                    ${isOutOfStock ? `
                        <button class="notify-me p-2 text-blue-500 hover:text-blue-600 transition-colors" data-id="${product.id}">
                            <iconify-icon icon="mdi:bell-alert-outline" width="24"></iconify-icon>
                        </button>
                    ` : ''}
                </div>
            </div>

            <div class="flex items-center gap-2 mb-4">
                <div class="text-yellow-500">${'★'.repeat(product.rating)}${product.rating < 5 ? '☆'.repeat(5-product.rating) : ''}</div>
                <span class="text-gray-500 text-sm">(۱۲ نظر)</span>
            </div>

            <div class="mb-6">
                ${product.discount > 0 ? `
                    <div class="flex items-center gap-4 mb-2">
                        <span class="text-2xl font-bold text-primary">${formatPrice(finalPrice)}</span>
                        <span class="text-lg text-gray-500 line-through">${formatPrice(product.price)}</span>
                        <span class="bg-red-500 text-white px-2 py-1 rounded-full text-sm">${product.discount}% تخفیف</span>
                    </div>
                ` : `
                    <div class="text-2xl font-bold text-primary mb-2">${formatPrice(finalPrice)}</div>
                `}

                ${product.status === 'new' ? `<span class="badge badge-new mr-2">جدید</span>` : ''}
                ${product.status === 'hot' ? `<span class="badge badge-hot mr-2">فروش ویژه</span>` : ''}
                ${product.status === 'bestseller' ? `<span class="badge bg-purple-500 text-white mr-2">پرفروش</span>` : ''}
            </div>

            <p class="text-gray-600 dark:text-gray-400 mb-6">${product.desc}</p>

            ${colorOptions}
            ${sizeOptions}
            ${variantSummary}

            <div class="mb-6">
                <h3 class="font-medium mb-2">تعداد:</h3>
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <button type="button" class="decrease-qty w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : ''}" ${isOutOfStock ? 'disabled aria-disabled="true"' : ''}>-</button>
                        <span class="w-12 text-center text-lg quantity-display">${initialQuantity}</span>
                        <button type="button" class="increase-qty w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : ''}" ${isOutOfStock ? 'disabled aria-disabled="true"' : ''}>+</button>
                    </div>
                    <div class="text-sm text-gray-500">
                        ${stockLabel}
                    </div>
                </div>
            </div>

            <div class="flex gap-3 mb-6">
                <button class="${addToCartButtonClasses}"
                        data-id="${product.id}"
                        data-out-of-stock="${isOutOfStock ? 'true' : 'false'}"
                        ${isOutOfStock ? 'disabled aria-disabled="true"' : ''}>
                    <iconify-icon icon="${addToCartIcon}" width="20"></iconify-icon>
                    ${addToCartLabelMarkup}
                </button>
                <button class="${buyNowClasses}" data-id="${product.id}" ${isOutOfStock ? 'disabled aria-disabled="true"' : ''}>
                    خرید الآن
                </button>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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
    `;
}

function createProductTabsSection(product) {
    return `
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
                    <p class="text-gray-600 dark:text-gray-400 leading-relaxed">${product.desc}</p>
                    ${product.features.length > 0 ? `
                        <div class="mt-6">
                            <h4 class="font-medium mb-3">ویژگی‌های اصلی:</h4>
                            <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                ${product.features.map(feature => `
                                    <li class="flex items-center gap-2 text-sm">
                                        <iconify-icon icon="mdi:check-circle" class="text-green-500"></iconify-icon>
                                        <span>${feature}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>

                <div id="tab-specifications" class="tab-content">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${Object.entries(product.specifications).map(([key, value]) => `
                            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                <span class="text-gray-600 dark:text-gray-400">${key}:</span>
                                <span class="font-medium">${value}</span>
                            </div>
                        `).join('')}
                    </div>
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
    `;
}

function createProductRelatedSection() {
    return `
        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6">محصولات مرتبط</h2>
            <div id="relatedProducts" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"></div>
        </section>
    `;
}

function buildProductDetailView(product, viewModel) {
    const container = document.createElement('div');
    container.className = 'space-y-12';
    container.innerHTML = `
        ${createProductBreadcrumbSection(product)}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            ${createProductMediaSection(product, viewModel)}
            ${createProductInfoSection(product, viewModel)}
        </div>
        ${createProductTabsSection(product)}
        ${createProductRelatedSection()}
    `;
    return container;
}

function renderProductDetailPage(id){
    renderProductDetailSkeleton();

    const hydrateProductView = () => {
        const product = getProductById(id);
        if(!product){
            if (contentRoot) {
                contentRoot.removeAttribute('aria-busy');
                contentRoot.innerHTML = `
                    <div class="text-center text-gray-500 py-20">
                        <iconify-icon icon="mdi:package-variant-remove" width="64" class="mb-4"></iconify-icon>
                        <p class="text-lg">محصول مورد نظر یافت نشد</p>
                        <a href="#products" class="text-primary hover:text-primary/80 mt-4 inline-block">بازگشت به محصولات</a>
                    </div>
                `;
            }
            return;
        }

        addViewedProduct(id);

        const productImages = typeof getProductImages === 'function' ? getProductImages(product) : (product.img ? [product.img] : []);
        const mainImage = productImages.length > 0 ? productImages[0] : '';
        const isOutOfStock = product.stock === 0;
        const initialQuantity = isOutOfStock ? 0 : 1;
        const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
        const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
        const variantSummaryParts = [];
        if (hasColors && product.colors[0]) { variantSummaryParts.push(`رنگ: ${product.colors[0]}`); }
        if (hasSizes && product.sizes[0]) { variantSummaryParts.push(`سایز: ${product.sizes[0]}`); }
        const variantSummaryText = variantSummaryParts.length > 0
            ? `انتخاب شما — ${variantSummaryParts.join(' | ')}`
            : 'گزینه‌ای برای انتخاب وجود ندارد.';

        const finalPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
        const addToCartButtonClasses = isOutOfStock
            ? 'add-to-cart flex-1 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2'
            : 'add-to-cart flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2';
        const addToCartIcon = isOutOfStock ? 'mdi:close-circle-outline' : 'mdi:cart-plus';
        const addToCartLabelMarkup = isOutOfStock
            ? '<span class="text-red-500 font-semibold">ناموجود</span>'
            : '<span>افزودن به سبد خرید</span>';
        const buyNowClasses = isOutOfStock
            ? 'buy-now flex-1 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed'
            : 'buy-now flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors';
        const stockLabel = isOutOfStock
            ? '<span class="text-red-500 font-semibold">ناموجود</span>'
            : `<span class="text-green-500 font-semibold">${product.stock} عدد در انبار</span>`;

        const viewModel = {
            inWishlist: wishlist.includes(product.id),
            productImages,
            mainImage,
            isOutOfStock,
            finalPrice,
            addToCartButtonClasses,
            addToCartIcon,
            addToCartLabelMarkup,
            buyNowClasses,
            stockLabel,
            hasColors,
            hasSizes,
            variantSummaryText,
            initialQuantity
        };

        if (!contentRoot) return;
        const page = buildProductDetailView(product, viewModel);
        contentRoot.innerHTML = '';
        contentRoot.removeAttribute('aria-busy');
        contentRoot.appendChild(page);

        const related = products.filter(item =>
            item.category === product.category && item.id !== product.id
        ).slice(0, 4);
        renderProductsList(related, $('#relatedProducts', page));

        setupProductDetailEvents(page, product);
    };

    if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(hydrateProductView);
    } else {
        setTimeout(hydrateProductView, 0);
    }
}

function setupProductDetailEvents(page, product) {
    const isOutOfStock = product.stock === 0;
    let quantity = isOutOfStock ? 0 : 1;
    const quantityDisplay = $('.quantity-display', page);
    const decreaseBtn = $('.decrease-qty', page);
    const increaseBtn = $('.increase-qty', page);
    const addToCartButton = $('.add-to-cart', page);
    const buyNowButton = $('.buy-now', page);
    const colorButtons = $$('.color-option', page);
    const sizeButtons = $$('.size-option', page);
    const variantSummary = $('.selected-variant', page);
    const thumbnails = $$('.product-thumbnail', page);
    const mainImageEl = $('#mainProductImage', page);
    let activeImage = mainImageEl ? (mainImageEl.getAttribute('data-active') || mainImageEl.getAttribute('src')) : null;
    let selectedColor = colorButtons.length > 0 ? colorButtons[0].getAttribute('data-color') : null;
    let selectedSize = sizeButtons.length > 0 ? sizeButtons[0].getAttribute('data-size') : null;

    if (quantityDisplay) {
        quantityDisplay.textContent = quantity;
    }

    const updateVariantButtons = (buttons, selectedValue, attribute) => {
        if (!Array.isArray(buttons) || buttons.length === 0) return;
        buttons.forEach(btn => {
            const value = btn.getAttribute(`data-${attribute}`);
            const isActive = value === selectedValue;
            btn.classList.toggle('border-primary', isActive);
            btn.classList.toggle('text-primary', isActive);
            btn.classList.toggle('bg-primary/5', isActive);
            btn.classList.toggle('shadow-sm', isActive);
            btn.classList.toggle('ring-2', isActive);
            btn.classList.toggle('ring-primary/30', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    };

    const updateVariantSummary = () => {
        if (!variantSummary) return;
        const parts = [];
        if (selectedColor) parts.push(`رنگ: ${selectedColor}`);
        if (selectedSize) parts.push(`سایز: ${selectedSize}`);
        variantSummary.textContent = parts.length > 0
            ? `انتخاب شما — ${parts.join(' | ')}`
            : 'گزینه‌ای برای انتخاب وجود ندارد.';
    };

    const syncVariantDataAttributes = () => {
        if (addToCartButton) {
            if (selectedColor) {
                addToCartButton.setAttribute('data-color', selectedColor);
            } else {
                addToCartButton.removeAttribute('data-color');
            }
            if (selectedSize) {
                addToCartButton.setAttribute('data-size', selectedSize);
            } else {
                addToCartButton.removeAttribute('data-size');
            }
        }
        if (buyNowButton) {
            if (selectedColor) {
                buyNowButton.setAttribute('data-color', selectedColor);
            } else {
                buyNowButton.removeAttribute('data-color');
            }
            if (selectedSize) {
                buyNowButton.setAttribute('data-size', selectedSize);
            } else {
                buyNowButton.removeAttribute('data-size');
            }
        }
    };

    const updateThumbnailState = (activeSrc) => {
        if (!Array.isArray(thumbnails) || thumbnails.length === 0) return;
        thumbnails.forEach(btn => {
            const isActive = btn.getAttribute('data-image') === activeSrc;
            btn.classList.toggle('border-primary', isActive);
            btn.classList.toggle('ring-2', isActive);
            btn.classList.toggle('ring-primary/30', isActive);
            btn.classList.toggle('shadow-sm', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    };

    updateVariantButtons(colorButtons, selectedColor, 'color');
    updateVariantButtons(sizeButtons, selectedSize, 'size');
    updateVariantSummary();
    syncVariantDataAttributes();
    updateThumbnailState(activeImage);

    // Quantity controls
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            if (isOutOfStock) return;
            if (quantity > 1) {
                quantity--;
                if (quantityDisplay) {
                    quantityDisplay.textContent = quantity;
                }
            }
        });
    }

    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            if (isOutOfStock) return;
            if (quantity < product.stock) {
                quantity++;
                if (quantityDisplay) {
                    quantityDisplay.textContent = quantity;
                }
            }
        });
    }

    // Product actions
    page.addEventListener('click', (e) => {
        const colorBtn = e.target.closest('.color-option');
        if (colorBtn) {
            selectedColor = colorBtn.getAttribute('data-color');
            updateVariantButtons(colorButtons, selectedColor, 'color');
            updateVariantSummary();
            syncVariantDataAttributes();
            return;
        }

        const sizeBtn = e.target.closest('.size-option');
        if (sizeBtn) {
            selectedSize = sizeBtn.getAttribute('data-size');
            updateVariantButtons(sizeButtons, selectedSize, 'size');
            updateVariantSummary();
            syncVariantDataAttributes();
            return;
        }

        const thumbnailBtn = e.target.closest('.product-thumbnail');
        if (thumbnailBtn) {
            const image = thumbnailBtn.getAttribute('data-image');
            if (image && mainImageEl) {
                mainImageEl.src = image;
                mainImageEl.setAttribute('data-active', image);
                activeImage = image;
            }
            updateThumbnailState(activeImage);
            return;
        }

        const addBtn = e.target.closest('.add-to-cart');
        if(addBtn){
            if (isOutOfStock) {
                notify('این محصول در حال حاضر موجود نیست', 'warning');
                return;
            }
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
            if (isOutOfStock) {
                notify('این محصول در حال حاضر موجود نیست', 'warning');
                return;
            }
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

    const relatedProducts = $('#relatedProducts', page);
    if (relatedProducts) {
        relatedProducts.addEventListener('click', handleProductActions);
    }
}

function showNotifyMeModal(product) {
    const modalHTML = createNotifyMeModal(product);
    const template = document.createElement('div');
    template.innerHTML = modalHTML.trim();
    const modalOverlay = template.firstElementChild;
    if (!modalOverlay) return;

    const dialog = modalOverlay.querySelector('[data-modal-dialog]');
    const closeButtons = modalOverlay.querySelectorAll('.close-notify-modal');
    const form = modalOverlay.querySelector('#notifyMeForm');
    const previouslyFocused = document.activeElement;

    let isClosing = false;

    const handleKeydown = (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            closeModal();
        }
    };

    const handleOverlayClick = (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    };

    const closeModal = () => {
        if (isClosing) return;
        isClosing = true;
        modalOverlay.setAttribute('aria-hidden', 'true');
        modalOverlay.classList.remove('modal-visible');
        modalOverlay.classList.add('modal-closing');
        unlockBodyScroll();
        document.removeEventListener('keydown', handleKeydown);
        modalOverlay.removeEventListener('click', handleOverlayClick);
        closeButtons.forEach(btn => btn.removeEventListener('click', handleCloseButton));

        const removeModal = () => {
            modalOverlay.removeEventListener('transitionend', removeModal);
            if (modalOverlay.parentElement) {
                modalOverlay.parentElement.removeChild(modalOverlay);
            }
            if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
                previouslyFocused.focus();
            }
        };

        modalOverlay.addEventListener('transitionend', removeModal);
        setTimeout(removeModal, 220);
    };

    const handleCloseButton = (event) => {
        event.preventDefault();
        closeModal();
    };

    closeButtons.forEach(btn => btn.addEventListener('click', handleCloseButton));

    modalOverlay.addEventListener('click', handleOverlayClick);
    document.addEventListener('keydown', handleKeydown);

    document.body.appendChild(modalOverlay);
    modalOverlay.setAttribute('aria-hidden', 'false');
    lockBodyScroll();
    requestAnimationFrame(() => modalOverlay.classList.add('modal-visible'));

    if (dialog) {
        dialog.focus({ preventScroll: true });
    }

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        const phone = form.querySelector('input[type="tel"]').value;

        if (!validateEmail(email)) {
            notify('ایمیل وارد شده معتبر نیست', 'error');
            return;
        }

        if (!validatePhone(phone)) {
            notify('شماره تلفن معتبر نیست', 'error');
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

        closeModal();
        notify('درخواست شما ثبت شد. هنگام موجود شدن محصول به شما اطلاع داده خواهد شد.', 'success');
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
            <div class="py-12">
                ${createEmptyState({
                    icon: 'mdi:heart-off',
                    title: 'لیست علاقه‌مندی‌های شما خالی است',
                    description: 'برای ذخیره محصولات محبوب خود، آن‌ها را به لیست علاقه‌مندی‌ها اضافه کنید.',
                    actions: '<a href="#products" class="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"><iconify-icon icon="mdi:shopping-outline" width="20"></iconify-icon><span>مشاهده محصولات</span></a>'
                })}
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
    openCompareModal();
    navigate('products');
}

/* ---------- Cart Page ---------- */
function renderCartPage(){
    cartSidebar.classList.add('open');
    navigate('products');
}

/* ---------- Address Management ---------- */
function renderAddressesPage() {
    if (!user) {
        notify('لطفا ابتدا وارد حساب کاربری خود شوید', 'warning');
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
    setupAddressEvents(page);
}

function setupAddressEvents(page) {
    const cleanups = [];

    cleanups.push(on($('#addAddressBtn', page), 'click', showAddressForm));

    const handleEditClick = (e) => {
        const editBtn = e.target.closest('.edit-address');
        if (!editBtn) return;
        const addressId = editBtn.getAttribute('data-id');
        const address = addresses.find(addr => addr.id === addressId);
        if (address) {
            showAddressForm(address);
        }
    };

    const handleDeleteClick = (e) => {
        const deleteBtn = e.target.closest('.delete-address');
        if (!deleteBtn) return;
        const addressId = deleteBtn.getAttribute('data-id');
        deleteAddress(addressId);
    };

    const handleDefaultClick = (e) => {
        const setDefaultBtn = e.target.closest('.set-default-address');
        if (!setDefaultBtn) return;
        const addressId = setDefaultBtn.getAttribute('data-id');
        setDefaultAddress(addressId);
    };

    cleanups.push(on(document, 'click', handleEditClick));
    cleanups.push(on(document, 'click', handleDeleteClick));
    cleanups.push(on(document, 'click', handleDefaultClick));

    if (typeof registerPageCleanup === 'function') {
        registerPageCleanup(() => {
            cleanups.forEach(dispose => {
                try {
                    dispose?.();
                } catch (error) {
                    console.error('Address cleanup error:', error);
                }
            });
        });
    }
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
        notify('کد پستی باید 10 رقمی باشد', 'error');
        return;
    }

    if (!validatePhone(formData.phone)) {
        notify('شماره تلفن معتبر نیست', 'error');
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
    notify(addressId ? 'آدرس با موفقیت ویرایش شد' : 'آدرس جدید با موفقیت اضافه شد', 'success');
    
    // Refresh addresses page
    if (currentPage === 'addresses') {
        renderAddressesPage();
    }
}

function deleteAddress(addressId) {
    if (confirm('آیا از حذف این آدرس مطمئن هستید؟')) {
        addresses = addresses.filter(addr => addr.id !== addressId);
        LS.set('HDK_addresses', addresses);
        notify('آدرس با موفقیت حذف شد', 'success');
        
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
    notify('آدرس پیش‌فرض تغییر کرد', 'success');
    
    // Refresh addresses page
    if (currentPage === 'addresses') {
        renderAddressesPage();
    }
}