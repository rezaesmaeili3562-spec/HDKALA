/* ---------- helpers ---------- */
const $ = (s, ctx=document) => ctx.querySelector(s);
const $$ = (s, ctx=document) => Array.from((ctx||document).querySelectorAll(s));
function uid(prefix='id'){ return prefix + Math.random().toString(36).slice(2,9); }

function on(element, eventName, handler, options){
    if(!element || typeof element.addEventListener !== 'function'){
        return () => {};
    }

    element.addEventListener(eventName, handler, options);
    return () => element.removeEventListener(eventName, handler, options);
}

function formatPrice(n){ return n.toLocaleString('fa-IR') + ' تومان'; }

function getProductImages(product) {
    if (!product) return [];
    const images = Array.isArray(product.images)
        ? product.images.filter(Boolean)
        : [];
    if (images.length > 0) {
        return images;
    }
    if (product.img) {
        return [product.img];
    }
    return [];
}

function getPrimaryProductImage(product) {
    const images = getProductImages(product);
    return images.length > 0 ? images[0] : '';
}

function createEmptyState({ icon = 'mdi:information-outline', title = '', description = '', actions = '' } = {}) {
    return `
        <div class="empty-state bg-white dark:bg-gray-800 border border-dashed border-primary/30 rounded-2xl p-10 text-center flex flex-col items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl">
                <iconify-icon icon="${icon}" width="32"></iconify-icon>
            </div>
            <div>
                <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">${title}</h2>
                ${description ? `<p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">${description}</p>` : ''}
            </div>
            ${actions ? `<div class="flex flex-wrap items-center justify-center gap-2">${actions}</div>` : ''}
        </div>
    `;
}

function getCategoryName(category) {
    const categories = {
        'electronics': 'الکترونیک',
        'fashion': 'مد و پوشاک',
        'home': 'خانه و آشپزخانه',
        'books': 'کتاب',
        'sports': 'ورزشی'
    };
    return categories[category] || category;
}

// تابعی برای نگاشت مسیر به کلید ناوبری جهت هایلایت صحیح
function mapRouteToNavigationKey(route) {
    switch(route){
        case 'product':
        case 'compare':
        case 'wishlist':
            return 'products';
        case 'checkout':
            return 'cart';
        case 'addresses':
            return 'addresses';
        case 'orders':
        case 'order-success':
        case 'profile':
            return 'profile';
        default:
            return route || 'home';
    }
}

// تابعی برای بروزرسانی لینک‌های ناوبری بر اساس صفحه فعال
function setActiveNavigation(route) {
    const normalizedRoute = mapRouteToNavigationKey(route);
    const links = $$('[data-route-link]');

    links.forEach(link => {
        const targetRoute = link.getAttribute('data-route-link');
        const activeClasses = (link.getAttribute('data-active-class') || '').split(/\s+/).filter(Boolean);
        const inactiveClasses = (link.getAttribute('data-inactive-class') || '').split(/\s+/).filter(Boolean);
        const isActive = targetRoute === normalizedRoute;

        link.setAttribute('aria-current', isActive ? 'page' : 'false');

        activeClasses.forEach(cls => {
            if (!cls) return;
            link.classList.toggle(cls, isActive);
        });

        inactiveClasses.forEach(cls => {
            if (!cls) return;
            if (isActive) {
                link.classList.remove(cls);
            } else {
                link.classList.add(cls);
            }
        });
    });
}

function handleProductActions(e) {
    const addBtn = e.target.closest('.add-to-cart');
    if(addBtn){
        if (addBtn.disabled || addBtn.getAttribute('aria-disabled') === 'true') {
            if (addBtn.dataset.outOfStock === 'true') {
                notify('این محصول در حال حاضر موجود نیست', 'warning', { allowDuplicates: false });
            }
            return;
        }
        addToCart(addBtn.getAttribute('data-id'), 1);
        return;
    }
    const viewBtn = e.target.closest('.view-detail');
    if(viewBtn){
        location.hash = `product:${viewBtn.getAttribute('data-id')}`; 
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
}

function renderProductsList(list, container){
    if(!container) return;
    container.innerHTML = '';
    if(!list || list.length===0){
        container.innerHTML = `
            <div class="col-span-full">
                ${createEmptyState({
                    icon: 'mdi:package-variant-remove',
                    title: 'محصولی یافت نشد',
                    description: 'لطفا فیلترهای خود را تغییر دهید یا دسته دیگری را امتحان کنید.'
                })}
            </div>
        `;
        return;
    }
    
    list.forEach(product => {
        const card = typeof createProductCard === 'function'
            ? createProductCard(product)
            : null;

        if (card) {
            container.appendChild(card);
        }
    });
}

function getOperatorLogo(phone) {
    if (phone.startsWith('099')) return 'irancell';
    if (phone.startsWith('091') || phone.startsWith('0990')) return 'mci';
    if (phone.startsWith('093')) return 'rightel';
    return 'unknown';
}

function quickAddDemoProduct() {
    const availableProduct = Array.isArray(products)
        ? products.find(product => product && product.stock > 0)
        : null;

    if (!availableProduct) {
        notify('محصولی برای افزودن سریع موجود نیست', 'warning', { allowDuplicates: false });
        return;
    }

    addToCart(availableProduct.id, 1);
    notify(`«${availableProduct.name}» به سبد اضافه شد`, 'success', {
        id: `quick-add-${availableProduct.id}`,
        allowDuplicates: false
    });
}