/* ---------- helpers ---------- */
const $ = (s, ctx=document) => {
    const scope = ctx || document;
    try {
        return scope.querySelector(s);
    } catch (err) {
        if (typeof s === 'string' && s.startsWith('#')) {
            return scope.getElementById(s.slice(1));
        }
        return null;
    }
};
const $$ = (s, ctx=document) => {
    const scope = ctx || document;
    try {
        return Array.from(scope.querySelectorAll(s));
    } catch (err) {
        return [];
    }
};
const notifyEl = document.getElementById('notification');
const notifyMessageEl = document.getElementById('notificationMessage');

function notify(msg, isError=false){
    if (!notifyEl) return;

    if (notifyMessageEl) {
        notifyMessageEl.textContent = msg;
    } else {
        notifyEl.textContent = msg;
    }

    notifyEl.classList.remove('notification--error', 'notification--success', 'show');
    void notifyEl.offsetWidth;
    notifyEl.classList.add(isError ? 'notification--error' : 'notification--success');
    notifyEl.classList.add('show');

    clearTimeout(notifyEl._t);
    notifyEl._t = setTimeout(() => {
        notifyEl.classList.remove('show');
    }, 3500);
}

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
        container.appendChild(Templates.clone('tpl-product-empty'));
        return;
    }

    list.forEach(p => {
        const fragment = Templates.clone('tpl-product-card');
        const root = fragment.querySelector('[data-element="product-card"]') || fragment.firstElementChild;
        if (!root) {
            return;
        }

        const finalPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
        const hasDiscount = p.discount > 0;
        const inWishlist = wishlist.includes(p.id);
        const inCompare = compareList.includes(p.id);

        const productLink = fragment.querySelector('[data-element="product-link"]');
        if (productLink) {
            productLink.href = `#product:${p.id}`;
        }

        const detailBtn = fragment.querySelector('[data-element="detail-button"]');
        if (detailBtn) {
            detailBtn.href = `#product:${p.id}`;
        }

        const wishlistBtn = fragment.querySelector('[data-element="wishlist-btn"]');
        const wishlistIcon = fragment.querySelector('[data-element="wishlist-icon"]');
        if (wishlistBtn) {
            wishlistBtn.dataset.id = p.id;
        }
        if (wishlistIcon) {
            wishlistIcon.setAttribute('icon', inWishlist ? 'mdi:heart' : 'mdi:heart-outline');
            wishlistIcon.classList.toggle('text-red-500', inWishlist);
            wishlistIcon.classList.toggle('text-gray-600', !inWishlist);
            wishlistIcon.classList.toggle('dark:text-gray-400', !inWishlist);
        }

        const compareBtn = fragment.querySelector('[data-element="compare-btn"]');
        const compareIcon = fragment.querySelector('[data-element="compare-icon"]');
        if (compareBtn) {
            compareBtn.dataset.id = p.id;
        }
        if (compareIcon) {
            compareIcon.classList.toggle('text-primary', inCompare);
            compareIcon.classList.toggle('text-gray-600', !inCompare);
            compareIcon.classList.toggle('dark:text-gray-400', !inCompare);
        }

        const imageEl = fragment.querySelector('[data-element="product-image"]');
        const placeholderIcon = fragment.querySelector('[data-element="product-placeholder"]');
        if (imageEl) {
            if (p.img) {
                imageEl.src = p.img;
                imageEl.alt = p.name;
                imageEl.classList.remove('hidden');
                if (placeholderIcon) {
                    placeholderIcon.classList.add('hidden');
                }
            } else {
                imageEl.classList.add('hidden');
                if (placeholderIcon) {
                    placeholderIcon.classList.remove('hidden');
                }
            }
        }

        const badgeDiscount = fragment.querySelector('[data-element="badge-discount"]');
        if (badgeDiscount) {
            if (hasDiscount) {
                badgeDiscount.textContent = `${p.discount}%`;
                badgeDiscount.classList.remove('hidden');
            } else {
                badgeDiscount.classList.add('hidden');
            }
        }

        const badgeNew = fragment.querySelector('[data-element="badge-new"]');
        if (badgeNew) {
            badgeNew.classList.toggle('hidden', p.status !== 'new');
        }

        const badgeHot = fragment.querySelector('[data-element="badge-hot"]');
        if (badgeHot) {
            badgeHot.classList.toggle('hidden', p.status !== 'hot');
        }

        const badgeBest = fragment.querySelector('[data-element="badge-bestseller"]');
        if (badgeBest) {
            badgeBest.classList.toggle('hidden', p.status !== 'bestseller');
        }

        const nameEl = fragment.querySelector('[data-element="product-name"]');
        if (nameEl) {
            nameEl.textContent = p.name;
        }

        const descEl = fragment.querySelector('[data-element="product-description"]');
        if (descEl) {
            descEl.textContent = p.desc || '';
        }

        const originalPriceEl = fragment.querySelector('[data-element="product-original-price"]');
        if (originalPriceEl) {
            if (hasDiscount) {
                originalPriceEl.textContent = formatPrice(p.price);
                originalPriceEl.classList.remove('hidden');
            } else {
                originalPriceEl.classList.add('hidden');
            }
        }

        const finalPriceEl = fragment.querySelector('[data-element="product-final-price"]');
        if (finalPriceEl) {
            finalPriceEl.textContent = formatPrice(finalPrice);
        }

        const ratingEl = fragment.querySelector('[data-element="product-rating"]');
        if (ratingEl) {
            const rating = Math.max(0, Math.min(5, p.rating || 0));
            ratingEl.textContent = `${'★'.repeat(rating)}${rating < 5 ? '☆'.repeat(5 - rating) : ''}`;
        }

        const stockEl = fragment.querySelector('[data-element="product-stock"]');
        if (stockEl) {
            if (p.stock > 0) {
                stockEl.innerHTML = `موجودی: <span class="text-green-500">${p.stock}</span>`;
            } else {
                stockEl.innerHTML = 'موجودی: <span class="text-red-500">ناموجود</span>';
            }
        }

        const brandEl = fragment.querySelector('[data-element="product-brand"]');
        if (brandEl) {
            brandEl.textContent = p.brand || '---';
        }

        const addToCartBtn = fragment.querySelector('[data-element="add-to-cart"]');
        if (addToCartBtn) {
            addToCartBtn.dataset.id = p.id;
            addToCartBtn.textContent = p.stock > 0 ? 'افزودن به سبد' : 'ناموجود';
            if (p.stock === 0) {
                addToCartBtn.disabled = true;
                addToCartBtn.classList.add('opacity-60', 'cursor-not-allowed');
            } else {
                addToCartBtn.disabled = false;
                addToCartBtn.classList.remove('opacity-60', 'cursor-not-allowed');
            }
        }

        container.appendChild(fragment);
    });
}

function getOperatorLogo(phone) {
    if (phone.startsWith('099')) return 'irancell';
    if (phone.startsWith('091') || phone.startsWith('0990')) return 'mci';
    if (phone.startsWith('093')) return 'rightel';
    return 'unknown';
}