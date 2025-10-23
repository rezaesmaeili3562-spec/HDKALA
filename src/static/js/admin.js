/* ---------- Admin Panel Functions ---------- */
function openAdminPanel() {
    adminModal.classList.remove('hidden');
    renderAdminProducts();
    setupAdminInputHandlers();
}

function closeAdminPanel() {
    adminModal.classList.add('hidden');
    productForm.classList.add('hidden');
    editingProductId = null;
}

function renderAdminProducts() {
    adminProductsList.innerHTML = '';
    let filteredProducts = products;
    const searchTerm = adminSearch.value.toLowerCase().trim();
    if (searchTerm) {
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            (product.brand && product.brand.toLowerCase().includes(searchTerm)) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filteredProducts.length === 0) {
        adminProductsList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <iconify-icon icon="mdi:package-variant-remove" width="48" class="mb-4"></iconify-icon>
                <p>محصولی یافت نشد</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const finalPrice = product.discount > 0 ? 
            product.price * (1 - product.discount / 100) : product.price;
        const productEl = document.createElement('div');
        productEl.className = 'bg-white dark:bg-gray-700 p-4 rounded-lg border border-primary/20';
        productEl.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4 flex-1">
                    <div class="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                        ${product.img ? 
                            `<img src="${product.img}" alt="${product.name}" class="w-16 h-16 object-cover rounded-lg">` :
                            `<iconify-icon icon="mdi:image-off" width="24" class="text-gray-400"></iconify-icon>`
                        }
                    </div>
                    <div class="flex-1">
                        <h4 class="font-semibold text-primary">${product.name}</h4>
                        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                            <div class="flex flex-wrap gap-4">
                                <span>قیمت: ${formatPrice(product.price)}</span>
                                ${product.discount > 0 ? `
                                    <span>تخفیف: ${product.discount}% → ${formatPrice(finalPrice)}</span>
                                ` : ''}
                                <span>موجودی: ${product.stock}</span>
                                <span>دسته: ${getCategoryName(product.category)}</span>
                                ${product.brand ? `<span>برند: ${product.brand}</span>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button class="edit-product bg-primary/20 text-primary px-3 py-1 rounded-lg hover:bg-primary/30 transition-colors" data-id="${product.id}">
                        ویرایش
                    </button>
                    <button class="delete-product bg-red-500/20 text-red-500 px-3 py-1 rounded-lg hover:bg-red-500/30 transition-colors" data-id="${product.id}">
                        حذف
                    </button>
                </div>
            </div>
        `;
        adminProductsList.appendChild(productEl);
    });
    
    // Add event listeners for edit and delete buttons
    $$('.edit-product').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            editProduct(productId);
        });
    });
    
    $$('.delete-product').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            deleteProduct(productId);
        });
    });
    
    // Update stats
    updateAdminStats();
}

function updateAdminStats() {
    adminProductCount.textContent = products.length;
    adminInStockCount.textContent = products.filter(p => p.stock > 0).length;
    adminDiscountCount.textContent = products.filter(p => p.discount > 0).length;
    adminOrderCount.textContent = orders.length;
}

function showProductForm() {
    productForm.classList.remove('hidden');
    formTitle.textContent = editingProductId ? 'ویرایش محصول' : 'افزودن محصول جدید';

    if (editingProductId) {
        const product = getProductById(editingProductId);
        $('#productName').value = product.name;
        $('#productPrice').value = product.price;
        $('#productDesc').value = product.desc;
        $('#productCategory').value = product.category;
        $('#productBrand').value = product.brand || '';
        $('#productDiscount').value = product.discount;
        $('#productStock').value = product.stock;
        $('#productStatus').value = product.status || '';
        $('#productRating').value = product.rating;
        $('#productImageUrl').value = product.img && !product.img.startsWith('data:') ? product.img : '';

        // Set image preview if exists
        if (product.img) {
            $('#imagePreview').innerHTML = `
                <img src="${product.img}" alt="Preview" class="w-32 h-32 object-cover rounded-lg">
            `;
        }
    } else {
        // Reset form for new product
        $('#productName').value = '';
        $('#productPrice').value = '';
        $('#productDesc').value = '';
        $('#productCategory').value = 'electronics';
        $('#productBrand').value = '';
        $('#productDiscount').value = '0';
        $('#productStock').value = '0';
        $('#productStatus').value = '';
        $('#productRating').value = '5';
        $('#productImageUrl').value = '';
        $('#imagePreview').innerHTML = '';
    }
}

function setupAdminInputHandlers() {
    // Auto-clear zero values
    $$('#productForm input[type="number"]').forEach(input => {
        input.addEventListener('focus', function() {
            if (this.value === '0' || this.value === '00') {
                this.value = '';
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.value = '0';
            }
        });
    });
    
    // Image upload handler
    $('#productImage').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                notify('فقط فایل‌های تصویری قابل بارگذاری هستند', true);
                e.target.value = '';
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                notify('حجم تصویر نباید بیشتر از ۵ مگابایت باشد', true);
                e.target.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#imagePreview').innerHTML = `
                    <img src="${e.target.result}" alt="Preview" class="w-32 h-32 object-cover rounded-lg">
                `;
                $('#productImageUrl').value = '';
            };
            reader.readAsDataURL(file);
        }
    });

    $('#productImageUrl').addEventListener('blur', function() {
        const url = this.value.trim();
        if (!url) {
            const fileInput = $('#productImage');
            const hasFile = fileInput && fileInput.value;
            if (!hasFile) {
                $('#imagePreview').innerHTML = '';
            }
            return;
        }

        const img = new Image();
        img.onload = () => {
            $('#imagePreview').innerHTML = `
                <img src="${url}" alt="Preview" class="w-32 h-32 object-cover rounded-lg">
            `;
            $('#productImage').value = '';
        };
        img.onerror = () => {
            notify('امکان بارگذاری تصویر از این آدرس وجود ندارد', true);
            $('#imagePreview').innerHTML = '';
            this.value = '';
            this.focus();
        };
        img.src = url;
    });
}

function editProduct(productId) {
    editingProductId = productId;
    showProductForm();
}

function deleteProduct(productId) {
    if (confirm('آیا از حذف این محصول مطمئن هستید؟')) {
        products = products.filter(p => p.id !== productId);
        LS.set('HDK_products', products);
        renderAdminProducts();
        notify('محصول با موفقیت حذف شد');
        // Update main products view if on products page
        if (currentPage === 'home' || currentPage === 'products') {
            renderProducts(products);
            updateBrandFilter();
        }
    }
}

function saveProduct() {
    const wasEditing = Boolean(editingProductId);
    const name = $('#productName').value.trim();
    const price = parseInt($('#productPrice').value) || 0;
    const desc = $('#productDesc').value.trim();
    const category = $('#productCategory').value;
    const brand = $('#productBrand').value.trim();
    const discount = parseInt($('#productDiscount').value) || 0;
    const stock = parseInt($('#productStock').value) || 0;
    const status = $('#productStatus').value;
    const rating = parseInt($('#productRating').value) || 5;
    
    if (!name || !price) {
        notify('لطفا نام و قیمت محصول را وارد کنید', true);
        return;
    }
    
    if (discount < 0 || discount > 100) {
        notify('تخفیف باید بین 0 تا 100 باشد', true);
        return;
    }
    
    if (stock < 0) {
        notify('موجودی نمی‌تواند منفی باشد', true);
        return;
    }
    
    // Get image data
    const imageUrl = $('#productImageUrl').value.trim();
    const imagePreview = $('#imagePreview img');
    const img = imageUrl || (imagePreview ? imagePreview.src : '');

    if (editingProductId) {
        // Update existing product
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                price,
                desc,
                category,
                brand,
                discount,
                stock,
                status,
                rating,
                img: img || products[index].img
            };
        }
    } else {
        // Add new product
        const newProduct = {
            id: uid('p'),
            name,
            price,
            desc,
            img: img,
            rating,
            discount,
            category,
            status,
            stock,
            brand,
            features: [],
            colors: [],
            specifications: {},
            created: new Date().toISOString()
        };
        products.push(newProduct);
    }
    
    LS.set('HDK_products', products);
    renderAdminProducts();
    productForm.classList.add('hidden');
    editingProductId = null;
    notify(wasEditing ? 'محصول با موفقیت ویرایش شد' : 'محصول جدید با موفقیت اضافه شد');
    
    // Update main products view if on products page
    if (currentPage === 'home' || currentPage === 'products') {
        renderProducts(products);
        updateBrandFilter();
    }
}

/* ---------- Blog Management ---------- */
function setupBlogManagement() {
    $('#addBlogBtn').addEventListener('click', showBlogForm);
    
    // Edit blog handlers
    $$('.edit-blog').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const blogId = e.target.getAttribute('data-id');
            editBlog(blogId);
        });
    });
    
    // Delete blog handlers
    $$('.delete-blog').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const blogId = e.target.getAttribute('data-id');
            deleteBlog(blogId);
        });
    });
}

function showBlogForm(blog = null) {
    const isEdit = !!blog;
    
    const formHTML = `
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold">${isEdit ? 'ویرایش مقاله' : 'افزودن مقاله جدید'}</h3>
                    <button class="close-blog-form p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <iconify-icon icon="mdi:close"></iconify-icon>
                    </button>
                </div>
                
                <form class="p-6 space-y-4" id="blogForm">
                    <div>
                        <label class="block text-sm font-medium mb-2">عنوان مقاله</label>
                        <input type="text" required 
                               class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"
                               value="${blog?.title || ''}">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">دسته‌بندی</label>
                        <input type="text" required 
                               class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"
                               value="${blog?.category || ''}">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">خلاصه مقاله</label>
                        <textarea required rows="3" 
                                  class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">${blog?.excerpt || ''}</textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">محتوای کامل</label>
                        <textarea required rows="6" 
                                  class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">${blog?.content || ''}</textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">آدرس تصویر (اختیاری)</label>
                        <input type="url" 
                               class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"
                               value="${blog?.image || ''}">
                    </div>
                    
                    <div class="flex gap-3 pt-4">
                        <button type="button" class="close-blog-form flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">
                            انصراف
                        </button>
                        <button type="submit" class="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
                            ${isEdit ? 'ویرایش مقاله' : 'ذخیره مقاله'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    const formContainer = document.createElement('div');
    formContainer.innerHTML = formHTML;
    document.body.appendChild(formContainer);
    
    // Event listeners
    $('.close-blog-form').addEventListener('click', () => {
        formContainer.remove();
    });
    
    $('#blogForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveBlog(blog?.id, formContainer);
    });
}

function saveBlog(blogId = null, formContainer) {
    const form = $('#blogForm');
    const formData = new FormData(form);
    
    const blogData = {
        title: form.querySelector('input[type="text"]').value,
        category: form.querySelectorAll('input[type="text"]')[1].value,
        excerpt: form.querySelector('textarea').value,
        content: form.querySelectorAll('textarea')[1].value,
        image: form.querySelector('input[type="url"]').value,
        date: new Date().toLocaleDateString('fa-IR')
    };
    
    if (blogId) {
        // Edit existing blog
        const index = blogs.findIndex(b => b.id === blogId);
        if (index !== -1) {
            blogs[index] = { ...blogs[index], ...blogData };
        }
    } else {
        // Add new blog
        const newBlog = {
            id: uid('b'),
            ...blogData
        };
        blogs.push(newBlog);
    }
    
    LS.set('HDK_blogs', blogs);
    formContainer.remove();
    notify(blogId ? 'مقاله با موفقیت ویرایش شد' : 'مقاله جدید با موفقیت اضافه شد');
    
    // Refresh blog management view
    if (currentPage === 'admin') {
        renderAdminPage();
    }
}

function editBlog(blogId) {
    const blog = blogs.find(b => b.id === blogId);
    if (blog) {
        showBlogForm(blog);
    }
}

function deleteBlog(blogId) {
    if (confirm('آیا از حذف این مقاله مطمئن هستید؟')) {
        blogs = blogs.filter(b => b.id !== blogId);
        LS.set('HDK_blogs', blogs);
        notify('مقاله با موفقیت حذف شد');
        
        // Refresh blog management view
        if (currentPage === 'admin') {
            renderAdminPage();
        }
    }
}

// Admin panel event listeners
if (closeAdminModal) closeAdminModal.addEventListener('click', closeAdminPanel);
if (addProductBtn) addProductBtn.addEventListener('click', () => {
    editingProductId = null;
    showProductForm();
});
if (saveProductBtn) saveProductBtn.addEventListener('click', saveProduct);
if (cancelProductBtn) cancelProductBtn.addEventListener('click', () => {
    productForm.classList.add('hidden');
    editingProductId = null;
});
if (adminSearch) adminSearch.addEventListener('input', renderAdminProducts);