/* ---------- Product Detail Page ---------- */
function renderProductDetailPage(id){
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
    
    addViewedProduct(id);
    const finalPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
    const inWishlist = wishlist.includes(p.id);
    const inCompare = compareList.includes(p.id);
    
    const page = document.createElement('div');
    page.innerHTML = `
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <a href="#home" class="hover:text-primary transition-colors">خانه</a>
            <iconify-icon icon="mdi:chevron-left" width="16"></iconify-icon>
            <a href="#products" class="hover:text-primary transition-colors">محصولات</a>
            <iconify-icon icon="mdi:chevron-left" width="16"></iconify-icon>
            <a href="#products:${p.category}" class="hover:text-primary transition-colors">${getCategoryName(p.category)}</a>
            <iconify-icon icon="mdi:chevron-left" width="16"></iconify-icon>
            <span class="text-primary">${p.name}</span>
        </nav>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <!-- Product Images -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                <div class="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                    ${p.img ? 
                        `<img src="${p.img}" alt="${p.name}" class="w-full h-96 object-cover rounded-lg zoom-image" />` :
                        `<iconify-icon icon="mdi:image-off" width="64" class="text-gray-400"></iconify-icon>`
                    }
                </div>
                <div class="grid grid-cols-4 gap-2">
                    ${[1,2,3,4].map(i => `
                        <div class="h-20 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center cursor-pointer border-2 border-transparent hover:border-primary transition-colors">
                            ${p.img ? 
                                `<img src="${p.img}" alt="${p.name}" class="w-full h-20 object-cover rounded-lg" />` :
                                `<iconify-icon icon="mdi:image" width="24" class="text-gray-400"></iconify-icon>`
                            }
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Product Info -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                <div class="flex justify-between items-start mb-4">
                    <h1 class="text-2xl font-bold">${p.name}</h1>
                    <div class="flex gap-2">
                        <button class="add-to-wishlist p-2 text-gray-500 hover:text-red-500 transition-colors" data-id="${p.id}">
                            <iconify-icon icon="${inWishlist ? 'mdi:heart' : 'mdi:heart-outline'}" width="24"></iconify-icon>
                        </button>
                        <button class="add-to-compare p-2 text-gray-500 hover:text-primary transition-colors" data-id="${p.id}">
                            <iconify-icon icon="mdi:scale-balance" width="24"></iconify-icon>
                        </button>
                        <button class="notify-me p-2 text-gray-500 hover:text-blue-500 transition-colors" data-id="${p.id}">
                            <iconify-icon icon="mdi:bell-outline" width="24"></iconify-icon>
                        </button>
                    </div>
                </div>
                
                <div class="flex items-center gap-2 mb-4">
                    <div class="text-yellow-500">${'★'.repeat(p.rating)}${p.rating < 5 ? '☆'.repeat(5-p.rating) : ''}</div>
                    <span class="text-gray-500 text-sm">(۱۲ نظر)</span>
                </div>
                
                <div class="mb-6">
                    ${p.discount > 0 ? `
                        <div class="flex items-center gap-4 mb-2">
                            <span class="text-2xl font-bold text-primary">${formatPrice(finalPrice)}</span>
                            <span class="text-lg text-gray-500 line-through">${formatPrice(p.price)}</span>
                            <span class="bg-red-500 text-white px-2 py-1 rounded-full text-sm">${p.discount}% تخفیف</span>
                        </div>
                    ` : `
                        <div class="text-2xl font-bold text-primary mb-2">${formatPrice(finalPrice)}</div>
                    `}
                    
                    ${p.status === 'new' ? `<span class="badge badge-new mr-2">جدید</span>` : ''}
                    ${p.status === 'hot' ? `<span class="badge badge-hot mr-2">فروش ویژه</span>` : ''}
                    ${p.status === 'bestseller' ? `<span class="badge bg-purple-500 text-white mr-2">پرفروش</span>` : ''}
                </div>
                
                <p class="text-gray-600 dark:text-gray-400 mb-6">${p.desc}</p>
                
                ${p.colors.length > 0 ? `
                <div class="mb-6">
                    <h3 class="font-medium mb-2">رنگ‌بندی:</h3>
                    <div class="flex gap-2">
                        ${p.colors.map(color => `
                            <button class="color-option px-3 py-1 border border-gray-300 rounded-lg hover:border-primary transition-colors" data-color="${color}">${color}</button>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                <div class="mb-6">
                    <h3 class="font-medium mb-2">تعداد:</h3>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2">
                            <button class="decrease-qty w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">-</button>
                            <span class="w-12 text-center text-lg quantity-display">1</span>
                            <button class="increase-qty w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">+</button>
                        </div>
                        <div class="text-sm text-gray-500">
                            ${p.stock > 0 ? 
                                `<span class="text-green-500">${p.stock} عدد در انبار</span>` : 
                                `<span class="text-red-500">ناموجود</span>`
                            }
                        </div>
                    </div>
                </div>
                
                <div class="flex gap-3 mb-6">
                    <button class="add-to-cart flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2" data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>
                        <iconify-icon icon="mdi:cart-plus" width="20"></iconify-icon>
                        ${p.stock > 0 ? 'افزودن به سبد خرید' : 'ناموجود'}
                    </button>
                    <button class="buy-now flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors" data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>
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
                    <p class="text-gray-600 dark:text-gray-400 leading-relaxed">${p.desc}</p>
                    ${p.features.length > 0 ? `
                        <div class="mt-6">
                            <h4 class="font-medium mb-3">ویژگی‌های اصلی:</h4>
                            <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                ${p.features.map(feature => `
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
                        ${Object.entries(p.specifications).map(([key, value]) => `
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
        
        <!-- Related Products -->
        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6">محصولات مرتبط</h2>
            <div id="relatedProducts" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"></div>
        </section>
    `;
    contentRoot.appendChild(page);
    
    // Show related products (same category)
    const related = products.filter(product => 
        product.category === p.category && product.id !== p.id
    ).slice(0, 4);
    renderProductsList(related, $('#relatedProducts'));
    
    // Add event listeners
    setupProductDetailEvents(page, p);
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
    const modalHTML = createNotifyMeModal(product);
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
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