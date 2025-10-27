/* ---------- Update Brand Filter ---------- */
function updateBrandFilter() {
    if (!brandFilter) return;
    brandFilter.innerHTML = '<option value="">همه برندها</option>';
    const brands = [...new Set(products.map(p => p.brand))].filter(b => b);
    brands.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b;
        opt.textContent = b;
        brandFilter.appendChild(opt);
    });
}

/* ---------- New Filter Functions ---------- */
function getFilteredProducts(source = products) {
    let list = Array.isArray(source) ? source.slice() : [];
    const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    if(q) list = list.filter(p => p.name.toLowerCase().includes(q) || (p.desc||'').toLowerCase().includes(q));

    const mn = Number(minPrice ? minPrice.value || 0 : 0), mx = Number(maxPrice ? maxPrice.value || 0 : 0);
    if(mn>0) list = list.filter(p => (p.price * (1 - (p.discount / 100))) >= mn);
    if(mx>0) list = list.filter(p => (p.price * (1 - (p.discount / 100))) <= mx);

    const cat = categoryFilter ? categoryFilter.value : '';
    if(cat) list = list.filter(p => p.category === cat);

    const disc = discountFilter ? discountFilter.value : '';
    if(disc === 'has_discount') list = list.filter(p => p.discount > 0);
    if(disc === 'no_discount') list = list.filter(p => p.discount === 0);
    if(disc === 'high_discount') list = list.filter(p => p.discount >= 50);

    const brand = brandFilter ? brandFilter.value : '';
    if(brand) list = list.filter(p => p.brand === brand);

    const stock = stockFilter ? stockFilter.value : '';
    if(stock === 'in_stock') list = list.filter(p => p.stock > 0);
    if(stock === 'out_of_stock') list = list.filter(p => p.stock === 0);

    const rating = ratingFilter ? ratingFilter.value : '';
    if(rating) list = list.filter(p => p.rating >= parseInt(rating));

    const sort = sortSelect ? sortSelect.value : 'popular';
    if(sort==='price_asc') list.sort((a,b)=> (a.price*(1-a.discount/100)) - (b.price*(1-b.discount/100)));
    else if(sort==='price_desc') list.sort((a,b)=> (b.price*(1-b.discount/100)) - (a.price*(1-a.discount/100)));
    else if(sort==='discount') list.sort((a,b)=>b.discount - a.discount);
    else if(sort==='newest') list.sort((a,b)=> new Date(b.created || 0) - new Date(a.created || 0));
    else list.sort((a,b)=> (b.rating||0) - (a.rating||0));

    return list;
}

function applyFilters(){
    const filtered = getFilteredProducts(products);
    setFilteredProductsCache(filtered);

    const params = currentCategory ? [currentCategory] : [];
    const nextQuery = { ...(currentRouteQuery || {}) };
    delete nextQuery.page;

    if (typeof navigate === 'function') {
        navigate({ name: 'products', params, query: nextQuery }, { replace: true });
    } else if (typeof refreshCurrentRoute === 'function') {
        refreshCurrentRoute({ preserveScroll: true });
    } else {
        renderProducts(filtered);
    }

    updateActiveFilters();
}

// نمایش فیلترهای فعال
function updateActiveFilters() {
    const activeFilters = $('#activeFilters');
    if (!activeFilters) return;
    
    activeFilters.innerHTML = '';
    
    const filters = [];
    
    if (minPrice.value || maxPrice.value) {
        const min = minPrice.value ? formatPrice(parseInt(minPrice.value)) : '۰';
        const max = maxPrice.value ? formatPrice(parseInt(maxPrice.value)) : '∞';
        filters.push(`قیمت: ${min} - ${max}`);
    }
    
    if (categoryFilter.value) {
        filters.push(`دسته: ${getCategoryName(categoryFilter.value)}`);
    }
    
    if (brandFilter.value) {
        filters.push(`برند: ${brandFilter.value}`);
    }
    
    if (discountFilter.value) {
        const discountLabels = {
            'has_discount': 'دارای تخفیف',
            'no_discount': 'بدون تخفیف',
            'high_discount': 'تخفیف بالا'
        };
        filters.push(discountLabels[discountFilter.value]);
    }
    
    if (stockFilter.value) {
        filters.push(stockFilter.value === 'in_stock' ? 'فقط موجود' : 'فقط ناموجود');
    }
    
    if (ratingFilter.value) {
        filters.push(`${ratingFilter.value} ستاره و بالاتر`);
    }
    
    if (filters.length === 0) {
        activeFilters.innerHTML = '<span class="text-gray-500">هیچ فیلتری اعمال نشده</span>';
        return;
    }
    
    filters.forEach(filter => {
        const badge = document.createElement('span');
        badge.className = 'bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2';
        badge.innerHTML = `
            ${filter}
            <button class="clear-single-filter hover:text-red-500 transition-colors">
                <iconify-icon icon="mdi:close" width="14"></iconify-icon>
            </button>
        `;
        activeFilters.appendChild(badge);
    });
}

// پاک کردن تک فیلتر
function setupSingleFilterClearing() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.clear-single-filter')) {
            const filterText = e.target.closest('span').textContent.trim();
            clearSingleFilter(filterText);
        }
    });
}

function clearSingleFilter(filterText) {
    if (filterText.includes('قیمت')) {
        minPrice.value = '';
        maxPrice.value = '';
    } else if (filterText.includes('دسته')) {
        categoryFilter.value = '';
    } else if (filterText.includes('برند')) {
        brandFilter.value = '';
    } else if (filterText.includes('تخفیف')) {
        discountFilter.value = '';
    } else if (filterText.includes('موجود') || filterText.includes('ناموجود')) {
        stockFilter.value = '';
    } else if (filterText.includes('ستاره')) {
        ratingFilter.value = '';
    }
    
    applyFilters();
}

/* ---------- Filter Sidebar helpers ---------- */
let isFilterOpen = false;
let filterKeydownHandlerAttached = false;

function refreshFilterElements() {
    filterSidebar = $('#filterSidebar');
    closeFilters = $('#closeFilters');
    filterOverlay = $('#filterOverlay');
    sortSelect = $('#sortSelect');
    minPrice = $('#minPrice');
    maxPrice = $('#maxPrice');
    categoryFilter = $('#categoryFilter');
    discountFilter = $('#discountFilter');
    brandFilter = $('#brandFilter');
    stockFilter = $('#stockFilter');
    ratingFilter = $('#ratingFilter');
    priceRange = $('#priceRange');
    applyFilterBtn = $('#applyFilter');
    clearFilterBtn = $('#clearFilter');
}

function setupPriceAccordion() {
    const toggle = $('#togglePriceFilter');
    const fields = $('#priceFilterFields');
    const icon = $('#priceFilterIcon');

    if (!toggle || !fields) return;

    toggle.addEventListener('click', () => {
        const willOpen = fields.classList.contains('hidden');
        fields.classList.toggle('hidden');
        if (icon) {
            icon.classList.toggle('rotate-180', willOpen);
        }
    });
}

function openFilterSidebar() {
    if (!filterSidebar || isFilterOpen) return;
    filterSidebar.classList.add('open');
    filterSidebar.setAttribute('aria-hidden', 'false');
    if (filterOverlay) {
        filterOverlay.classList.remove('hidden');
        filterOverlay.setAttribute('aria-hidden', 'false');
    }
    lockBodyScroll();
    filterSidebar.focus({ preventScroll: true });
    isFilterOpen = true;
}

function closeFilterSidebar() {
    if (!filterSidebar || !isFilterOpen) return;
    filterSidebar.classList.remove('open');
    filterSidebar.setAttribute('aria-hidden', 'true');
    if (filterOverlay) {
        filterOverlay.classList.add('hidden');
        filterOverlay.setAttribute('aria-hidden', 'true');
    }
    unlockBodyScroll();
    isFilterOpen = false;
    if (filterBtn && typeof filterBtn.focus === 'function') {
        filterBtn.focus();
    }
}

/* ---------- Improved Filter Sidebar ---------- */
function setupFilterSidebar() {
    refreshFilterElements();
    setupPriceAccordion();
    updateBrandFilter();
}

/* ---------- Enhanced Filter Functionality ---------- */
function setupFilterToggle() {
    const collapseBtn = $('#filterCollapse');

    if (!filterBtn || !filterSidebar) return;

    filterBtn.addEventListener('click', () => {
        if (isFilterOpen) {
            closeFilterSidebar();
        } else {
            openFilterSidebar();
        }
    });

    if (filterOverlay) {
        filterOverlay.addEventListener('click', closeFilterSidebar);
    }

    if (closeFilters) {
        closeFilters.addEventListener('click', closeFilterSidebar);
    }

    if (collapseBtn) {
        collapseBtn.addEventListener('click', closeFilterSidebar);
    }

    if (!filterKeydownHandlerAttached) {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && isFilterOpen) {
                event.preventDefault();
                closeFilterSidebar();
            }
        });
        filterKeydownHandlerAttached = true;
    }
}

/* ---------- Search Functionality ---------- */
function setupSearch() {
    let searchTimeout;

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (typeof applyFilters === 'function' && currentPage === 'products') {
                    applyFilters();
                }
            }, 500);
        });

        const triggerSearchNavigation = () => {
            const value = searchInput.value.trim();
            const newHash = value ? `#search:${encodeURIComponent(value)}` : '#search';

            if (location.hash === newHash && typeof navigate === 'function') {
                navigate(newHash.slice(1));
            } else {
                location.hash = newHash;
            }
        };

        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                triggerSearchNavigation();
            }
        });

        searchInput.addEventListener('search', triggerSearchNavigation);

        // دکمه پاک کردن جستجو
        const searchContainer = searchInput.parentElement;
        const clearSearch = document.createElement('button');
        clearSearch.innerHTML = '<iconify-icon icon="mdi:close"></iconify-icon>';
        clearSearch.className = 'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors hidden';
        clearSearch.type = 'button';
        searchContainer.classList.add('relative');
        searchContainer.appendChild(clearSearch);
        
        searchInput.addEventListener('input', () => {
            if (searchInput.value) {
                clearSearch.classList.remove('hidden');
            } else {
                clearSearch.classList.add('hidden');
            }
        });
        
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            clearSearch.classList.add('hidden');
            if (typeof applyFilters === 'function' && currentPage === 'products') {
                applyFilters();
            }
            triggerSearchNavigation();
            searchInput.focus();
        });
    }
}

/* ---------- Category-based Filtering ---------- */
function setupCategoryFiltering() {
    document.addEventListener('click', (e) => {
        const categoryLink = e.target.closest('a[href^="#products:"]');
        if (categoryLink) {
            e.preventDefault();
            const category = categoryLink.getAttribute('href').split(':')[1];
            
            // Set category filter
            if (categoryFilter) {
                categoryFilter.value = category;
                applyFilters();
            }
            
            // Navigate to products page
            location.hash = 'products';
        }
    });
}

/* ---------- Price Range Validation ---------- */
function setupPriceValidation() {
    if (minPrice && maxPrice) {
        minPrice.addEventListener('blur', () => {
            const min = parseInt(minPrice.value);
            const max = parseInt(maxPrice.value);

            if (min && max && min > max) {
                notify('حداقل قیمت نمی‌تواند از حداکثر قیمت بیشتر باشد', 'error');
                minPrice.value = '';
                minPrice.focus();
            }
        });

        maxPrice.addEventListener('blur', () => {
            const min = parseInt(minPrice.value);
            const max = parseInt(maxPrice.value);

            if (min && max && max < min) {
                notify('حداکثر قیمت نمی‌تواند از حداقل قیمت کمتر باشد', 'error');
                maxPrice.value = '';
                maxPrice.focus();
            }
        });
    }
}

function bindFilterEvents() {
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);
    if (minPrice) minPrice.addEventListener('change', applyFilters);
    if (maxPrice) maxPrice.addEventListener('change', applyFilters);
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (discountFilter) discountFilter.addEventListener('change', applyFilters);
    if (brandFilter) brandFilter.addEventListener('change', applyFilters);
    if (stockFilter) stockFilter.addEventListener('change', applyFilters);
    if (ratingFilter) ratingFilter.addEventListener('change', applyFilters);

    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            maxPrice.value = e.target.value;
            applyFilters();
        });
    }

    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            applyFilters();
            closeFilterSidebar();
            notify('فیلترها اعمال شدند', 'success');
        });
    }

    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (sortSelect) sortSelect.value = 'popular';
            if (minPrice) minPrice.value = '';
            if (maxPrice) maxPrice.value = '';
            if (categoryFilter) categoryFilter.value = '';
            if (discountFilter) discountFilter.value = '';
            if (brandFilter) brandFilter.value = '';
            if (stockFilter) stockFilter.value = '';
            if (ratingFilter) ratingFilter.value = '';
            if (priceRange) priceRange.value = '50000000';

            applyFilters();
            closeFilterSidebar();
            notify('فیلترها بازنشانی شدند', 'info');
        });
    }
}

on(mobileMenuBtn, 'click', () => {
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
});

const wishlistBtn = $('#wishlistBtn');
const homeLink = $('#homeLink');

on(wishlistBtn, 'click', () => {
    location.hash = 'wishlist';
});

on(homeLink, 'click', () => {
    location.hash = 'home';
});

function bindHashNavigation(selector, targetHash) {
    $$(selector).forEach(link => {
        on(link, 'click', (event) => {
            event.preventDefault();
            location.hash = targetHash;
        });
    });
}

bindHashNavigation('a[href="#products"]', 'products');
bindHashNavigation('a[href="#about"]', 'about');
bindHashNavigation('a[href="#contact"]', 'contact');
bindHashNavigation('a[href="#blog"]', 'blog');

/* ---------- Theme toggle ---------- */
const THEME_STORAGE_KEY = 'hdk_dark';

function readStoredThemePreference() {
    try {
        const value = localStorage.getItem(THEME_STORAGE_KEY);
        if (value === 'true') return true;
        if (value === 'false') return false;
    } catch (error) {
        // localStorage may be unavailable (private mode, etc.)
    }
    return null;
}

function persistThemePreference(isDark) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, String(Boolean(isDark)));
    } catch (error) {
        // Ignore write failures (storage disabled or full)
    }
}

function getSystemThemePreference() {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
}

function applyThemePreference(isDark) {
    const enabled = Boolean(isDark);

    if (root) {
        root.classList.toggle('dark', enabled);
    }

    if (themeIcon) {
        themeIcon.setAttribute('icon', enabled ? 'ph:sun-duotone' : 'ph:moon-duotone');
    }

    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', String(enabled));
        themeToggle.setAttribute('data-theme', enabled ? 'dark' : 'light');
    }
}

let userSelectedTheme = readStoredThemePreference();
const systemPrefersDark = getSystemThemePreference();

applyThemePreference(userSelectedTheme ?? systemPrefersDark);

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (event) => {
        if (userSelectedTheme !== null) return;
        applyThemePreference(event.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleMediaChange);
    } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handleMediaChange);
    }
}

on(themeToggle, 'click', () => {
    const nextIsDark = !root.classList.contains('dark');
    userSelectedTheme = nextIsDark;
    applyThemePreference(nextIsDark);
    persistThemePreference(nextIsDark);
});

/* ---------- Initialize Filters ---------- */
function initializeFilters() {
    setupFilterSidebar();
    bindFilterEvents();
    setupFilterToggle();
    setupSearch();
    setupCategoryFiltering();
    setupPriceValidation();
    setupSingleFilterClearing();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeFilters);