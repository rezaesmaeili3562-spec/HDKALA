(function (global) {
    'use strict';

    const GRID_CLASS_MAP = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4'
    };

    class CompareModalManager {
        constructor(options = {}) {
            this.getList = typeof options.getList === 'function' ? options.getList : () => [];
            this.setList = typeof options.setList === 'function' ? options.setList : () => {};
            this.storage = options.storage || global.LS || null;
            this.storageKey = options.storageKey || 'HDK_compare';
            this.notify = typeof options.notify === 'function' ? options.notify : () => {};
            this.productResolver = typeof options.productResolver === 'function' ? options.productResolver : () => null;
            this.templateRenderer = typeof options.templateRenderer === 'function' ? options.templateRenderer : () => '';
            this.badgeUpdater = typeof options.badgeUpdater === 'function' ? options.badgeUpdater : () => {};
            this.cartAdder = typeof options.cartAdder === 'function' ? options.cartAdder : () => {};
            this.wishlistToggler = typeof options.wishlistToggler === 'function' ? options.wishlistToggler : () => {};
            this.maxItems = typeof options.maxItems === 'number' ? Math.max(1, options.maxItems) : 4;

            this.container = options.container || null;
            this.modal = options.modal || null;
            this.openTrigger = options.openTrigger || null;
            this.closeTrigger = options.closeTrigger || null;

            this.isOpen = false;

            if (this.container) {
                this.container.addEventListener('click', (event) => this.handleContainerClick(event));
            }

            if (this.openTrigger) {
                this.openTrigger.addEventListener('click', () => this.open());
            }

            if (this.closeTrigger) {
                this.closeTrigger.addEventListener('click', () => this.close());
            }

            if (this.modal) {
                this.modal.addEventListener('click', (event) => {
                    if (event.target === this.modal) {
                        this.close();
                    }
                });
            }
        }

        toggle(rawProductId) {
            const productId = this.normalizeId(rawProductId);
            if (!productId) {
                return;
            }

            const list = this.getListSnapshot();
            const index = list.indexOf(productId);

            if (index > -1) {
                list.splice(index, 1);
                this.notify('محصول از لیست مقایسه حذف شد');
                this.updateList(list, { render: this.isOpen });
                return;
            }

            if (list.length >= this.maxItems) {
                this.notify(`حداکثر ${this.maxItems} محصول قابل مقایسه هستند`, true);
                return;
            }

            list.push(productId);
            this.notify('محصول به لیست مقایسه اضافه شد');
            this.updateList(list, { render: this.isOpen });
        }

        open() {
            const list = this.getListSnapshot();
            if (!list.length) {
                this.notify('لطفا ابتدا محصولاتی برای مقایسه انتخاب کنید', true);
                return;
            }

            if (this.modal) {
                this.modal.classList.remove('hidden');
                this.modal.classList.add('flex');
            }

            this.isOpen = true;
            this.render();
        }

        close() {
            if (this.modal) {
                this.modal.classList.add('hidden');
                this.modal.classList.remove('flex');
            }
            this.isOpen = false;
        }

        render() {
            if (!this.container) {
                return;
            }

            const list = this.getListSnapshot();
            this.container.innerHTML = '';

            if (!list.length) {
                this.renderEmptyState();
                return;
            }

            const fragment = global.document ? global.document.createDocumentFragment() : null;
            if (!fragment) {
                return;
            }

            const validIds = [];
            const invalidIds = [];

            list.forEach((productId) => {
                const product = this.productResolver(productId);
                if (!product) {
                    invalidIds.push(productId);
                    return;
                }

                const wrapper = global.document.createElement('div');
                wrapper.innerHTML = this.templateRenderer(product);
                const element = wrapper.firstElementChild;
                if (element) {
                    fragment.appendChild(element);
                    validIds.push(productId);
                }
            });

            if (invalidIds.length) {
                const cleaned = validIds.slice();
                this.updateList(cleaned, { render: false });
                if (!cleaned.length) {
                    this.renderEmptyState();
                    return;
                }
            }

            this.container.appendChild(fragment);
            this.applyGridClass(validIds.length || list.length);
        }

        remove(rawProductId, options = {}) {
            const productId = this.normalizeId(rawProductId);
            if (!productId) {
                return;
            }

            const list = this.getListSnapshot().filter((id) => id !== productId);
            this.updateList(list, { render: true });

            if (!options.silent) {
                this.notify('محصول از مقایسه حذف شد');
            }
        }

        handleContainerClick(event) {
            const target = event.target instanceof HTMLElement ? event.target : null;
            if (!target) {
                return;
            }

            const removeBtn = target.closest('.remove-compare');
            if (removeBtn) {
                const productId = removeBtn.getAttribute('data-id');
                this.remove(productId);
                return;
            }

            const addToCartBtn = target.closest('.add-to-cart');
            if (addToCartBtn) {
                const productId = addToCartBtn.getAttribute('data-id');
                if (productId) {
                    this.cartAdder(productId);
                }
                return;
            }

            const wishlistBtn = target.closest('.add-to-wishlist');
            if (wishlistBtn) {
                const productId = wishlistBtn.getAttribute('data-id');
                if (productId) {
                    this.wishlistToggler(productId);
                    if (this.isOpen) {
                        this.render();
                    }
                }
            }
        }

        updateList(nextList, options = {}) {
            const listCopy = Array.isArray(nextList) ? nextList.slice() : [];
            this.setList(listCopy);

            if (this.storage && typeof this.storage.set === 'function') {
                this.storage.set(this.storageKey, listCopy);
            }

            this.badgeUpdater();

            const shouldRender = options.render ?? this.isOpen;
            if (shouldRender) {
                this.render();
            }
        }

        applyGridClass(count) {
            if (!this.container) {
                return;
            }

            const normalized = Math.max(1, Math.min(this.maxItems, count));
            Object.values(GRID_CLASS_MAP).forEach((cls) => {
                this.container.classList.remove(cls);
            });
            this.container.classList.add('grid', 'grid-cols-1', 'gap-6');
            this.container.classList.add(GRID_CLASS_MAP[normalized] || GRID_CLASS_MAP[1]);
        }

        renderEmptyState() {
            if (!this.container) {
                return;
            }

            this.container.innerHTML = `
                <div class="col-span-full text-center py-8 text-gray-500">
                    <iconify-icon icon="mdi:scale-off" width="48" class="mb-4"></iconify-icon>
                    <p>محصولی برای مقایسه وجود ندارد</p>
                </div>
            `;
            this.applyGridClass(1);
        }

        getListSnapshot() {
            const list = this.getList();
            return Array.isArray(list) ? list.slice() : [];
        }

        normalizeId(id) {
            if (typeof id === 'string' && id.trim()) {
                return id;
            }
            if (typeof id === 'number' && !Number.isNaN(id)) {
                return String(id);
            }
            return null;
        }
    }

    global.CompareModalManager = CompareModalManager;
})(typeof window !== 'undefined' ? window : globalThis);
