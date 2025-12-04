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
function applyFilters(){
    let list = products.slice();
    const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    if(q) list = list.filter(p => p.name.toLowerCase().includes(q) || (p.desc||'').toLowerCase().includes(q));
    
    const mn = Number(minPrice.value||0), mx = Number(maxPrice.value||0);
    if(mn>0) list = list.filter(p => (p.price * (1 - (p.discount / 100))) >= mn);
    if(mx>0) list = list.filter(p => (p.price * (1 - (p.discount / 100))) <= mx);
    
    const cat = categoryFilter.value;
    if(cat) list = list.filter(p => p.category === cat);
    
    const disc = discountFilter.value;
    if(disc === 'has_discount') list = list.filter(p => p.discount > 0);
    if(disc === 'no_discount') list = list.filter(p => p.discount === 0);
    if(disc === 'high_discount') list = list.filter(p => p.discount >= 50);
    
    const brand = brandFilter.value;
    if(brand) list = list.filter(p => p.brand === brand);
    
    const stock = stockFilter.value;
    if(stock === 'in_stock') list = list.filter(p => p.stock > 0);
    if(stock === 'out_of_stock') list = list.filter(p => p.stock === 0);
    
    const rating = ratingFilter.value;
    if(rating) list = list.filter(p => p.rating >= parseInt(rating));
    
    const sort = sortSelect.value;
    if(sort==='price_asc') list.sort((a,b)=> (a.price*(1-a.discount/100)) - (b.price*(1-b.discount/100)));
    else if(sort==='price_desc') list.sort((a,b)=> (b.price*(1-b.discount/100)) - (a.price*(1-a.discount/100)));
    else if(sort==='discount') list.sort((a,b)=>b.discount - a.discount);
    else if(sort==='newest') list.sort((a,b)=> new Date(b.created || 0) - new Date(a.created || 0));
    else list.sort((a,b)=> (b.rating||0) - (a.rating||0));
    
    renderProducts(list);
    updateActiveFilters();
    notify('فیلترها اعمال شدند');
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

/* ---------- Improved Filter Sidebar ---------- */
function setupFilterSidebar() {
    // ایجاد سایدبار فیلتر جدید
    if (!filterSidebar) return;
    
    filterSidebar.innerHTML = `
        <div class="fixed inset-0 bg-black/50 z-40 lg:hidden" id="filterOverlay"></div>
        <div class="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:shadow-none custom-scrollbar overflow-y-auto">
            ${createFilterHeader()}
            <div class="p-4 space-y-6">
                ${createPriceFilter()}
                
                <div>
                    <label class="block text-sm font-medium mb-2">دسته‌بندی</label>
                    <select id="categoryFilter" class="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700">
                        <option value="">همه دسته‌ها</option>
                        <option value="electronics">الکترونیک</option>
                        <option value="fashion">مد و پوشاک</option>
                        <option value="home">خانه و آشپزخانه</option>
                        <option value="books">کتاب</option>
                        <option value="sports">ورزشی</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium mb-2">برند</label>
                    <select id="brandFilter" class="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700">
                        <option value="">همه برندها</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium mb-2">تخفیف</label>
                    <select id="discountFilter" class="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700">
                        ${discountOptions.map(opt => 
                            `<option value="${opt.value}">${opt.label}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium mb-2">وضعیت موجودی</label>
                    <select id="stockFilter" class="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700">
                        ${stockOptions.map(opt => 
                            `<option value="${opt.value}">${opt.label}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium mb-2">حداقل امتیاز</label>
                    <select id="ratingFilter" class="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700">
                        ${ratingOptions.map(opt => 
                            `<option value="${opt.value}">${opt.label}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="flex gap-3 pt-4">
                    <button id="applyFilter" class="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
                        اعمال فیلتر
                    </button>
                    <button id="clearFilter" class="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">
                        پاک کردن
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Update brand filter after creating the sidebar
    setTimeout(updateBrandFilter, 0);
}

/* ---------- Enhanced Filter Functionality ---------- */
function setupFilterToggle() {
    let isFilterOpen = false;
    
    filterBtn.addEventListener('click', () => {
        if (isFilterOpen) {
            filterSidebar.classList.add('translate-x-full');
            filterSidebar.classList.remove('translate-x-0');
            isFilterOpen = false;
        } else {
            filterSidebar.classList.remove('translate-x-full');
            filterSidebar.classList.add('translate-x-0');
            isFilterOpen = true;
        }
    });
    
    // بستن فیلتر با کلیک خارج
    document.addEventListener('click', (e) => {
        if (isFilterOpen && !filterSidebar.contains(e.target) && !filterBtn.contains(e.target)) {
            filterSidebar.classList.add('translate-x-full');
            filterSidebar.classList.remove('translate-x-0');
            isFilterOpen = false;
        }
    });
    
    // بستن با دکمه بستن
    document.addEventListener('click', (e) => {
        if (e.target.closest('#closeFilters') || e.target.closest('#filterCollapse')) {
            filterSidebar.classList.add('translate-x-full');
            filterSidebar.classList.remove('translate-x-0');
            isFilterOpen = false;
        }
    });
}

/* ---------- Search Functionality ---------- */
function setupSearch() {
    let searchTimeout;
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                applyFilters();
            }, 500);
        });
        
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
            applyFilters();
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
                notify('حداقل قیمت نمی‌تواند از حداکثر قیمت بیشتر باشد', true);
                minPrice.value = '';
                minPrice.focus();
            }
        });
        
        maxPrice.addEventListener('blur', () => {
            const min = parseInt(minPrice.value);
            const max = parseInt(maxPrice.value);
            
            if (min && max && max < min) {
                notify('حداکثر قیمت نمی‌تواند از حداقل قیمت کمتر باشد', true);
                maxPrice.value = '';
                maxPrice.focus();
            }
        });
    }
}

/* ---------- Event Listeners ---------- */
filterBtn.addEventListener('click', () => {
    filterSidebar.classList.remove('translate-x-full');
    filterSidebar.classList.add('translate-x-0');
});

closeFilters.addEventListener('click', () => {
    filterSidebar.classList.add('translate-x-full');
    filterSidebar.classList.remove('translate-x-0');
});

// Filter event listeners
if (sortSelect) sortSelect.addEventListener('change', applyFilters);
if (minPrice) minPrice.addEventListener('change', applyFilters);
if (maxPrice) maxPrice.addEventListener('change', applyFilters);
if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
if (discountFilter) discountFilter.addEventListener('change', applyFilters);
if (brandFilter) brandFilter.addEventListener('change', applyFilters);
if (stockFilter) stockFilter.addEventListener('change', applyFilters);
if (ratingFilter) ratingFilter.addEventListener('change', applyFilters);

if (priceRange) priceRange.addEventListener('input', (e) => {
    maxPrice.value = e.target.value;
    applyFilters();
});

if (applyFilterBtn) applyFilterBtn.addEventListener('click', applyFilters);

if (clearFilterBtn) clearFilterBtn.addEventListener('click', () => {
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
    filterSidebar.classList.add('translate-x-full');
    filterSidebar.classList.remove('translate-x-0');
});

if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
}

mobileMenuBtn.addEventListener('click', ()=> mobileMenu.classList.toggle('hidden'));

$('#wishlistBtn').addEventListener('click', () => location.hash = 'wishlist');
$('#homeLink').addEventListener('click', () => location.hash = 'home');

$$('a[href="#products"]').forEach(el => el.addEventListener('click', (e) => {
    e.preventDefault();
    location.hash = 'products';
}));

$$('a[href="#about"]').forEach(el => el.addEventListener('click', (e) => {
    e.preventDefault();
    location.hash = 'about';
}));

$$('a[href="#contact"]').forEach(el => el.addEventListener('click', (e) => {
    e.preventDefault();
    location.hash = 'contact';
}));

$$('a[href="#blog"]').forEach(el => el.addEventListener('click', (e) => {
    e.preventDefault();
    location.hash = 'blog';
}));

/* ---------- Theme toggle ---------- */
if(localStorage.getItem('hdk_dark') === 'true'){
    root.classList.add('dark'); 
    themeIcon.setAttribute('icon','ph:sun-duotone');
} else {
    themeIcon.setAttribute('icon','ph:moon-duotone');
}

themeToggle.addEventListener('click', ()=> { 
    root.classList.toggle('dark'); 
    const isDark = root.classList.contains('dark'); 
    localStorage.setItem('hdk_dark', String(isDark)); 
    themeIcon.setAttribute('icon', isDark ? 'ph:sun-duotone' : 'ph:moon-duotone'); 
});

/* ---------- Initialize Filters ---------- */
function initializeFilters() {
    setupFilterSidebar();
    setupFilterToggle();
    setupSearch();
    setupCategoryFiltering();
    setupPriceValidation();
    setupSingleFilterClearing();
    updateBrandFilter();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeFilters);