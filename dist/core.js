/* ---------- helpers ---------- */
const $ = (s, ctx=document) => ctx.querySelector(s);
const $$ = (s, ctx=document) => Array.from((ctx||document).querySelectorAll(s));
function uid(prefix='id'){ return prefix + Math.random().toString(36).slice(2,9); }

function formatPrice(n){ return n.toLocaleString('fa-IR') + ' تومان'; }

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
            <div class="col-span-full text-center text-gray-500 py-10">
                <iconify-icon icon="mdi:package-variant-remove" width="64" class="mb-4"></iconify-icon>
                <p class="text-lg">محصولی یافت نشد</p>
                <p class="text-sm mt-2">لطفا فیلترهای خود را تغییر دهید</p>
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