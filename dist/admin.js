/* ---------- Admin Session Management ---------- */
const ADMIN_SESSION_KEY = 'HDK_admin_session';
const ADMIN_WINDOW_NAME = 'HDKALA_ADMIN_PANEL';
const ADMIN_NOTES_KEY = 'HDK_admin_notes';

let adminNotes = LS.get(ADMIN_NOTES_KEY, []);

function saveAdminNotes() {
    LS.set(ADMIN_NOTES_KEY, adminNotes);
}

function isAdminWindow() {
    if (typeof window === 'undefined') {
        return false;
    }

    if (window.name === ADMIN_WINDOW_NAME) {
        return true;
    }

    try {
        const params = new URLSearchParams(window.location.search || '');
        return params.get('adminWindow') === '1';
    } catch (err) {
        return false;
    }
}

function markAdminWindow() {
    if (typeof window === 'undefined') {
        return;
    }

    if (isAdminWindow()) {
        window.name = ADMIN_WINDOW_NAME;
    }
}

markAdminWindow();

const ADMIN_THEME_STYLE_ID = 'admin-theme-enhancements';

function ensureAdminThemeStyles() {
    if (typeof document === 'undefined') {
        return;
    }

    if (document.getElementById(ADMIN_THEME_STYLE_ID)) {
        return;
    }

    const style = document.createElement('style');
    style.id = ADMIN_THEME_STYLE_ID;
    style.textContent = `
        body.admin-window {
            min-height: 100vh;
            transition: background 0.3s ease, color 0.3s ease;
        }

        body.admin-window.admin-dark {
            background: radial-gradient(circle at 20% 20%, rgba(148, 163, 184, 0.25), transparent 55%),
                radial-gradient(circle at 80% 0%, rgba(96, 165, 250, 0.25), transparent 55%),
                #0f172a;
            color: #e2e8f0;
        }

        body.admin-window.admin-light {
            background: radial-gradient(circle at 10% 0%, rgba(148, 163, 184, 0.15), transparent 45%),
                radial-gradient(circle at 100% 40%, rgba(191, 219, 254, 0.25), transparent 55%),
                #f8fafc;
            color: #1f2937;
        }

        body.admin-window.admin-dark .admin-dashboard-card {
            background: rgba(15, 23, 42, 0.75);
            border-color: rgba(148, 163, 184, 0.25);
            box-shadow: 0 24px 50px -24px rgba(8, 47, 73, 0.45);
        }

        body.admin-window.admin-light .admin-dashboard-card {
            background: rgba(255, 255, 255, 0.95);
            border-color: rgba(148, 163, 184, 0.25);
            box-shadow: 0 24px 40px -22px rgba(148, 163, 184, 0.35);
        }

        body.admin-window.admin-dark .admin-topbar {
            background: rgba(15, 23, 42, 0.85);
            border: 1px solid rgba(148, 163, 184, 0.25);
            box-shadow: 0 20px 45px -25px rgba(14, 116, 144, 0.55);
        }

        body.admin-window.admin-light .admin-topbar {
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(148, 163, 184, 0.35);
            box-shadow: 0 24px 45px -24px rgba(148, 163, 184, 0.35);
            color: #1f2937;
        }

        body.admin-window.admin-dark .admin-note-card {
            background: rgba(30, 41, 59, 0.75);
            border: 1px solid rgba(148, 163, 184, 0.2);
            color: #f1f5f9;
        }

        body.admin-window.admin-light .admin-note-card {
            background: rgba(255, 255, 255, 0.92);
            border: 1px solid rgba(226, 232, 240, 0.9);
            color: #1f2937;
        }

        body.admin-window.admin-dark .admin-action-btn {
            background: rgba(30, 41, 59, 0.55);
            color: #e2e8f0;
            border: 1px solid rgba(148, 163, 184, 0.35);
        }

        body.admin-window.admin-light .admin-action-btn {
            background: rgba(255, 255, 255, 0.92);
            color: #1f2937;
            border: 1px solid rgba(148, 163, 184, 0.3);
            box-shadow: 0 10px 30px -22px rgba(148, 163, 184, 0.45);
        }

        body.admin-window.admin-light .admin-action-btn:hover {
            background: rgba(219, 234, 254, 0.4);
        }

        body.admin-window.admin-light .admin-action-btn--primary {
            border-color: rgba(99, 102, 241, 0.35);
            color: #4338ca;
            background: rgba(99, 102, 241, 0.15);
        }

        body.admin-window.admin-light .admin-action-btn--secondary {
            border-color: rgba(14, 165, 233, 0.35);
            color: #0ea5e9;
            background: rgba(14, 165, 233, 0.15);
        }

        body.admin-window.admin-light .admin-action-btn--danger {
            border-color: rgba(248, 113, 113, 0.35);
            color: #b91c1c;
            background: rgba(248, 113, 113, 0.15);
        }

        body.admin-window.admin-dark .admin-status-btn {
            background: rgba(30, 41, 59, 0.55);
            color: #e2e8f0;
            border: 1px solid rgba(148, 163, 184, 0.25);
        }

        body.admin-window.admin-light .admin-status-btn {
            background: rgba(241, 245, 249, 0.9);
            color: #1f2937;
            border: 1px solid rgba(148, 163, 184, 0.4);
        }

        body.admin-window.admin-dark .admin-stock-btn {
            background: rgba(22, 101, 52, 0.3);
            color: #bbf7d0;
            border: 1px solid rgba(34, 197, 94, 0.35);
        }

        body.admin-window.admin-light .admin-stock-btn {
            background: rgba(220, 252, 231, 0.9);
            color: #166534;
            border: 1px solid rgba(134, 239, 172, 0.6);
        }

        body.admin-window.admin-light .notification-toast {
            background: rgba(255, 255, 255, 0.96);
            color: #1f2937;
            border-color: rgba(59, 130, 246, 0.2);
        }

        body.admin-window.admin-dark .notification-toast {
            background: rgba(15, 23, 42, 0.92);
            color: #f8fafc;
            border-color: rgba(96, 165, 250, 0.35);
        }

        .admin-report-card {
            border-radius: 1.25rem;
            padding: 1.5rem;
            border: 1px solid rgba(148, 163, 184, 0.28);
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
        }

        body.admin-window.admin-dark .admin-report-card {
            background: rgba(15, 23, 42, 0.65);
            color: #e2e8f0;
        }

        body.admin-window.admin-light .admin-report-card {
            background: rgba(255, 255, 255, 0.95);
            color: #1f2937;
        }

        .admin-report-header {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .admin-report-title {
            font-size: 1.1rem;
            font-weight: 700;
        }

        .admin-report-description {
            font-size: 0.85rem;
            color: rgba(148, 163, 184, 0.8);
        }

        body.admin-window.admin-light .admin-report-description {
            color: #64748b;
        }

        .admin-report-body {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
        }

        .admin-report-grid {
            display: grid;
            gap: 1rem;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        }

        .admin-report-metric {
            border-radius: 1rem;
            padding: 1rem 1.1rem;
            border: 1px solid rgba(148, 163, 184, 0.28);
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
        }

        body.admin-window.admin-dark .admin-report-metric {
            background: rgba(30, 41, 59, 0.55);
        }

        body.admin-window.admin-light .admin-report-metric {
            background: rgba(248, 250, 252, 0.9);
        }

        .admin-report-metric-label {
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.03em;
            text-transform: uppercase;
            color: rgba(148, 163, 184, 0.75);
        }

        body.admin-window.admin-light .admin-report-metric-label {
            color: #64748b;
        }

        .admin-report-metric-value {
            font-size: 1.25rem;
            font-weight: 700;
        }

        .admin-report-metric-hint {
            font-size: 0.75rem;
            color: rgba(148, 163, 184, 0.8);
        }

        body.admin-window.admin-light .admin-report-metric-hint {
            color: #64748b;
        }

        .admin-report-subcard {
            border-radius: 1rem;
            padding: 1rem 1.25rem;
            border: 1px dashed rgba(148, 163, 184, 0.35);
        }

        body.admin-window.admin-dark .admin-report-subcard {
            background: rgba(15, 23, 42, 0.35);
            border-color: rgba(148, 163, 184, 0.4);
        }

        body.admin-window.admin-light .admin-report-subcard {
            background: rgba(248, 250, 252, 0.9);
            border-color: rgba(148, 163, 184, 0.45);
        }

        .admin-report-subtitle {
            font-weight: 600;
            font-size: 0.9rem;
            margin-bottom: 0.75rem;
        }

        .admin-report-list {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            font-size: 0.85rem;
        }

        .admin-report-list li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 0.75rem;
        }

        .admin-report-empty {
            font-size: 0.8rem;
            color: rgba(148, 163, 184, 0.75);
        }

        body.admin-window.admin-light .admin-report-empty {
            color: #94a3b8;
        }

        .admin-report-tag {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            padding: 0.25rem 0.6rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            border: 1px solid rgba(148, 163, 184, 0.3);
        }

        body.admin-window.admin-dark .admin-report-tag {
            background: rgba(30, 41, 59, 0.65);
            color: #cbd5f5;
        }

        body.admin-window.admin-light .admin-report-tag {
            background: rgba(226, 232, 240, 0.6);
            color: #1f2937;
        }
    `;
    document.head.appendChild(style);
}

function getAdminThemeTarget() {
    if (typeof document === 'undefined') {
        return null;
    }
    return typeof root !== 'undefined' ? root : document.documentElement;
}

function updateAdminThemeButton(explicitState) {
    if (typeof document === 'undefined') {
        return;
    }
    const toggle = document.getElementById('adminThemeToggle');
    if (!toggle) {
        return;
    }

    const target = getAdminThemeTarget();
    const isDark = typeof explicitState === 'boolean'
        ? explicitState
        : !!(target && target.classList.contains('dark'));

    const icon = toggle.querySelector('[data-theme-icon]') || toggle.querySelector('iconify-icon');
    const label = toggle.querySelector('[data-theme-label]') || toggle.querySelector('span');

    if (icon) {
        icon.setAttribute('icon', isDark ? 'ph:sun-duotone' : 'ph:moon-duotone');
    }
    if (label) {
        label.textContent = isDark ? 'حالت روشن' : 'حالت تیره';
    }

    toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    toggle.dataset.themeState = isDark ? 'dark' : 'light';
}

function applyAdminTheme(isDark) {
    const target = getAdminThemeTarget();
    if (target) {
        target.classList.toggle('dark', isDark);
    }

    if (typeof document !== 'undefined' && document.body) {
        const body = document.body;
        if (body.classList.contains('admin-window')) {
            body.classList.toggle('admin-dark', isDark);
            body.classList.toggle('admin-light', !isDark);
        }
    }

    if (typeof themeIcon !== 'undefined' && themeIcon) {
        themeIcon.setAttribute('icon', isDark ? 'ph:sun-duotone' : 'ph:moon-duotone');
    }

    try {
        localStorage.setItem('hdk_dark', String(isDark));
    } catch (err) {
        // Ignore storage errors
    }

    updateAdminThemeButton(isDark);
}

function toggleAdminTheme() {
    const target = getAdminThemeTarget();
    const currentDark = target ? target.classList.contains('dark') : (typeof document !== 'undefined' && document.body ? document.body.classList.contains('admin-dark') : false);
    const nextState = !currentDark;
    applyAdminTheme(nextState);
    if (typeof notify === 'function') {
        notify(nextState ? 'حالت تیره فعال شد.' : 'حالت روشن فعال شد.');
    }
}

if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        if (isAdminWindow()) {
            clearAdminSession();
        }
    });
}

function ensureAdminWindowClasses() {
    if (typeof document === 'undefined') {
        return;
    }

    ensureAdminThemeStyles();
    document.body.classList.add('admin-mode', 'admin-window');

    const target = typeof root !== 'undefined' ? root : document.documentElement;
    let prefersDark = target.classList.contains('dark');

    try {
        const storedTheme = localStorage.getItem('hdk_dark');
        if (storedTheme === 'true' || storedTheme === 'false') {
            prefersDark = storedTheme === 'true';
        } else if (typeof window !== 'undefined' && window.matchMedia) {
            prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
    } catch (err) {
        // Local storage might be inaccessible; fall back to current state.
    }

    applyAdminTheme(prefersDark);
}

function getAdminSession() {
    return LS.get(ADMIN_SESSION_KEY, null);
}

function isAdminAuthenticated() {
    const session = getAdminSession();
    return !!(session && session.isAuthenticated);
}

function startAdminSession(info) {
    const sessionData = {
        isAuthenticated: true,
        info: info || {},
        lastLogin: new Date().toISOString()
    };
    LS.set(ADMIN_SESSION_KEY, sessionData);
    return sessionData;
}

function clearAdminSession() {
    try {
        localStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (err) {
        // ignore storage errors
    }
}

function openAdminDashboardWindow() {
    try {
        const adminUrl = new URL(window.location.href);
        adminUrl.hash = 'admin';
        adminUrl.searchParams.set('adminWindow', '1');
        const win = window.open(adminUrl.toString(), ADMIN_WINDOW_NAME, 'noopener');
        if (win && typeof win.focus === 'function') {
            win.focus();
        }
    } catch (err) {
        const fallback = window.open('?adminWindow=1#admin', ADMIN_WINDOW_NAME);
        if (fallback && typeof fallback.focus === 'function') {
            fallback.focus();
        }
    }
}

function ensureAdminAccess() {
    if (!isAdminWindow()) {
        if (typeof notify === 'function') {
            notify('پنل مدیریت تنها در صفحه اختصاصی مدیریت فعال است.', true);
        }
        return false;
    }

    if (!isAdminAuthenticated()) {
        if (typeof notify === 'function') {
            notify('برای ورود به پنل مدیریت ابتدا احراز هویت را تکمیل کنید.', true);
        }
        if (typeof window !== 'undefined') {
            setTimeout(() => {
                if (window.location.hash === '#admin') {
                    window.location.hash = '#home';
                }
            }, 0);
        }
        return false;
    }

    ensureAdminWindowClasses();
    return true;
}

const ORDER_STATUS_LABELS = {
    processing: 'در حال پردازش',
    shipped: 'ارسال شده',
    delivered: 'تحویل شده',
    cancelled: 'لغو شده'
};

function getOrderStatusLabel(status) {
    return ORDER_STATUS_LABELS[status] || 'نامشخص';
}

function getOrderStatusBadgeClass(status) {
    switch (status) {
        case 'processing':
            return 'bg-yellow-500/20 text-yellow-200';
        case 'shipped':
            return 'bg-blue-500/20 text-blue-200';
        case 'delivered':
            return 'bg-green-500/20 text-green-200';
        case 'cancelled':
            return 'bg-red-500/20 text-red-200';
        default:
            return 'bg-gray-500/20 text-gray-200';
    }
}

function formatAdminDate(value) {
    if (!value) {
        return '---';
    }
    try {
        const date = new Date(value);
        if (!Number.isNaN(date.getTime())) {
            return date.toLocaleString('fa-IR', {
                dateStyle: 'medium',
                timeStyle: 'short'
            });
        }
    } catch (err) {
        // ignore
    }
    return value;
}

function updateOrderStatus(orderId, newStatus) {
    const status = (newStatus || '').toLowerCase();
    if (!orderId || !status) {
        return;
    }

    const index = orders.findIndex(order => order.id === orderId);
    if (index === -1) {
        notify('سفارش مورد نظر یافت نشد.', true);
        return;
    }

    if ((orders[index].status || '').toLowerCase() === status) {
        notify('وضعیت سفارش تغییری نکرد.', false);
        return;
    }

    orders[index] = {
        ...orders[index],
        status,
        statusUpdatedAt: new Date().toISOString()
    };
    LS.set('HDK_orders', orders);
    notify(`وضعیت سفارش به ${getOrderStatusLabel(status)} تغییر کرد.`);

    if (typeof renderAdminPage === 'function' && currentPage === 'admin') {
        renderAdminPage({ skipWelcome: true });
    }
}

function restockProduct(productId, amount = 5) {
    const value = parseInt(amount, 10);
    if (!productId || Number.isNaN(value) || value <= 0) {
        notify('مقدار افزایش موجودی معتبر نیست.', true);
        return;
    }

    const index = products.findIndex(product => product.id === productId);
    if (index === -1) {
        notify('محصول مورد نظر یافت نشد.', true);
        return;
    }

    const updatedStock = (products[index].stock || 0) + value;
    products[index] = { ...products[index], stock: updatedStock };
    LS.set('HDK_products', products);
    notify(`موجودی ${products[index].name} به ${updatedStock} عدد افزایش یافت.`);

    if (typeof renderAdminPage === 'function' && currentPage === 'admin') {
        renderAdminPage({ skipWelcome: true });
    }

    if (typeof renderAdminProducts === 'function' && adminModal && !adminModal.classList.contains('hidden')) {
        renderAdminProducts();
    }
}

function markProductOutOfStock(productId) {
    if (!productId) {
        return;
    }

    const index = products.findIndex(product => product.id === productId);
    if (index === -1) {
        notify('محصول مورد نظر یافت نشد.', true);
        return;
    }

    if ((products[index].stock || 0) === 0) {
        notify('این محصول قبلا ناموجود شده است.', false);
        return;
    }

    products[index] = { ...products[index], stock: 0 };
    LS.set('HDK_products', products);
    notify(`محصول ${products[index].name} به عنوان ناموجود ثبت شد.`);

    if (typeof renderAdminPage === 'function' && currentPage === 'admin') {
        renderAdminPage({ skipWelcome: true });
    }

    if (typeof renderAdminProducts === 'function' && adminModal && !adminModal.classList.contains('hidden')) {
        renderAdminProducts();
    }
}

function removeAdminNote(noteId) {
    if (!noteId) {
        return;
    }

    const before = adminNotes.length;
    adminNotes = adminNotes.filter(note => note.id !== noteId);
    if (adminNotes.length === before) {
        notify('یادداشت پیدا نشد.', true);
        return;
    }
    saveAdminNotes();
    notify('یادداشت حذف شد.');

    if (typeof renderAdminPage === 'function' && currentPage === 'admin') {
        renderAdminPage({ skipWelcome: true });
    }
}

function handleAdminNoteFormSubmit(form) {
    if (!form) {
        return;
    }

    const formData = new FormData(form);
    const title = (formData.get('title') || '').toString().trim();
    const details = (formData.get('details') || '').toString().trim();
    const owner = (formData.get('owner') || '').toString().trim();

    if (!title) {
        notify('لطفا عنوان یادداشت را وارد کنید.', true);
        return;
    }

    const note = {
        id: uid('note_'),
        title,
        details,
        owner,
        createdAt: new Date().toISOString()
    };

    adminNotes = [note, ...adminNotes].slice(0, 30);
    saveAdminNotes();
    notify('یادداشت مدیریتی ذخیره شد.');
    form.reset();

    if (typeof renderAdminPage === 'function' && currentPage === 'admin') {
        renderAdminPage({ skipWelcome: true });
    }
}

function handleAdminOpenStore() {
    if (typeof window === 'undefined') {
        return;
    }

    if (window.opener && !window.opener.closed) {
        try {
            window.opener.focus();
            window.opener.location.hash = 'home';
        } catch (err) {
            window.open('#home', '_blank');
        }
        notify('نمای فروشگاه فعال شد.');
    } else {
        window.open('#home', '_blank');
        notify('پنجره جدید فروشگاه باز شد.');
    }
}

function handleAdminLogoutAction(options = {}) {
    clearAdminSession();
    notify('خروج مدیر انجام شد.');
    if (typeof updateUserLabel === 'function') {
        updateUserLabel();
    }

    if (options.closeWindow && typeof window !== 'undefined') {
        setTimeout(() => {
            if (window.name === ADMIN_WINDOW_NAME) {
                window.close();
            } else if (currentPage === 'admin') {
                window.location.hash = '#home';
            }
        }, 120);
    } else if (typeof window !== 'undefined' && currentPage === 'admin') {
        window.location.hash = '#home';
    }
}

function buildAdminReportCard({ title, description = '', content = '' }) {
    return `
        <div class="admin-report-card">
            <div class="admin-report-header">
                <h4 class="admin-report-title">${title}</h4>
                ${description ? `<p class="admin-report-description">${description}</p>` : ''}
            </div>
            <div class="admin-report-body">${content}</div>
        </div>
    `;
}

function buildAdminMetric(label, value, hint = '', accentClass = '') {
    return `
        <div class="admin-report-metric">
            <span class="admin-report-metric-label">${label}</span>
            <span class="admin-report-metric-value ${accentClass}">${value}</span>
            ${hint ? `<span class="admin-report-metric-hint">${hint}</span>` : ''}
        </div>
    `;
}

function handleAdminQuickAction(action, options = {}) {
    const detailsContainer = $('#adminActionDetails');
    if (!detailsContainer) {
        notify('بخش گزارشات در حال حاضر در دسترس نیست.', true);
        return;
    }

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = orders.filter(order => (order.status || '').toLowerCase() === 'processing').length;
    const deliveredOrders = orders.filter(order => (order.status || '').toLowerCase() === 'delivered').length;
    const shippedOrders = orders.filter(order => (order.status || '').toLowerCase() === 'shipped').length;
    const cancelledOrders = orders.filter(order => (order.status || '').toLowerCase() === 'cancelled').length;
    const lowStockProducts = products.filter(p => p.stock <= 3);
    const discountedProducts = products.filter(p => p.discount > 0);
    const recommendedBudget = totalRevenue ? Math.round(totalRevenue * 0.1) : 5000000;
    const inStockCount = products.filter(product => product.stock > 0).length;
    const ordersCount = orders.length;
    const averageOrder = ordersCount ? Math.round(totalRevenue / Math.max(ordersCount, 1)) : 0;
    const wishlistProducts = (wishlist || []).map(id => getProductById(id)).filter(Boolean);
    const comparedProducts = (typeof compareList !== 'undefined' ? compareList : []).map(id => getProductById(id)).filter(Boolean);
    const recentlyViewed = Array.isArray(viewHistory) ? viewHistory.slice(0, 3) : [];
    const notificationsCount = typeof notifications !== 'undefined' && Array.isArray(notifications) ? notifications.length : 0;

    const { notifyMessage } = options || {};
    let html = '';

    switch (action) {
        case 'reports': {
            const highlightedProducts = discountedProducts.slice(0, 3);
            const highestOrder = orders.slice().sort((a, b) => (b.total || 0) - (a.total || 0))[0];
            const statusSummary = {
                processing: pendingOrders,
                shipped: shippedOrders,
                delivered: deliveredOrders,
                cancelled: cancelledOrders
            };
            const categorySummary = {};
            orders.forEach(order => {
                const items = Array.isArray(order.items) ? order.items : [];
                items.forEach(item => {
                    const product = getProductById(item.productId);
                    if (!product) {
                        return;
                    }
                    const categoryName = getCategoryName(product.category);
                    categorySummary[categoryName] = (categorySummary[categoryName] || 0) + (item.qty || 0);
                });
            });
            const topCategories = Object.entries(categorySummary)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);

            const metrics = [
                buildAdminMetric('درآمد کل', formatPrice(totalRevenue), `${ordersCount} سفارش ثبت شده`, 'text-green-500'),
                buildAdminMetric('میانگین ارزش سفارش', ordersCount ? formatPrice(averageOrder) : '۰ تومان', 'بر اساس سفارش‌های نهایی شده'),
                buildAdminMetric('سفارش‌های فعال', `${pendingOrders} مورد`, 'نیازمند بررسی', 'text-blue-500'),
                buildAdminMetric('محصولات تخفیف‌دار', `${discountedProducts.length} مورد`, 'برای جذب مشتریان جدید', 'text-purple-500')
            ].join('');

            const statusList = Object.entries(statusSummary)
                .map(([status, value]) => `
                    <li><span>${getOrderStatusLabel(status)}</span><span class="font-semibold">${value}</span></li>
                `)
                .join('');

            const categoryList = topCategories.length
                ? `<ul class="admin-report-list">${topCategories.map(([name, value]) => `
                        <li>
                            <span>${name}</span>
                            <span class="admin-report-tag"><iconify-icon icon="mdi:package-variant" width="16"></iconify-icon>${value} آیتم</span>
                        </li>
                    `).join('')}</ul>`
                : '<p class="admin-report-empty">دسته‌بندی شاخصی ثبت نشده است.</p>';

            const highlightedHtml = highlightedProducts.length
                ? `<div class="admin-report-subcard">
                        <h5 class="admin-report-subtitle">پیشنهاد ارتقای فروش</h5>
                        <ul class="admin-report-list">${highlightedProducts.map(product => `
                            <li>
                                <span>${product.name}</span>
                                <span class="admin-report-tag">${product.discount}% تخفیف</span>
                            </li>
                        `).join('')}</ul>
                    </div>`
                : '';

            const highOrderHtml = highestOrder
                ? `<div class="admin-report-subcard">
                        <h5 class="admin-report-subtitle">بیشترین مبلغ پرداختی</h5>
                        <p class="text-sm mb-3">سفارش شماره ${highestOrder.id || '---'} با مبلغ ${formatPrice(highestOrder.total || 0)} ثبت شده است.</p>
                        ${Array.isArray(highestOrder.items) && highestOrder.items.length ? `
                            <ul class="admin-report-list">
                                ${highestOrder.items.slice(0, 4).map(item => {
                                    const product = getProductById(item.productId);
                                    const productName = product ? product.name : 'آیتم حذف شده';
                                    const qty = item.qty || 0;
                                    return `<li><span>${productName}</span><span class="admin-report-tag">${qty} عدد</span></li>`;
                                }).join('')}
                            </ul>
                        ` : '<p class="admin-report-empty">جزئیات اقلام این سفارش در دسترس نیست.</p>'}
                    </div>`
                : '';

            const content = `
                <div class="admin-report-grid">${metrics}</div>
                <div class="admin-report-subcard">
                    <h5 class="admin-report-subtitle">وضعیت سفارش‌ها</h5>
                    <ul class="admin-report-list">${statusList}</ul>
                </div>
                <div class="admin-report-subcard">
                    <h5 class="admin-report-subtitle">پرفروش‌ترین دسته‌ها</h5>
                    ${categoryList}
                </div>
                ${highlightedHtml}
                ${highOrderHtml}
            `;

            html = buildAdminReportCard({
                title: 'گزارش امروز',
                description: 'خلاصه وضعیت عملکرد فروشگاه در جدیدترین بروزرسانی.',
                content
            });
            notify(notifyMessage || 'گزارش فروش به‌روزرسانی شد.');
            break;
        }
        case 'inventory': {
            const lowStockList = lowStockProducts.length
                ? `<ul class="admin-report-list">
                        ${lowStockProducts.slice(0, 5).map(product => `
                            <li>
                                <span>${product.name}</span>
                                <span class="admin-report-tag">${product.stock} عدد باقی مانده</span>
                            </li>
                        `).join('')}
                    </ul>`
                : '<p class="admin-report-empty">تمام موجودی‌ها در وضعیت مطلوب قرار دارند.</p>';

            const restockFocus = lowStockProducts.slice(0, 3)
                .map(product => `<span class="admin-report-tag">${product.name}</span>`)
                .join(' ');

            const content = `
                <div class="admin-report-grid">
                    ${buildAdminMetric('کل کالاها', `${products.length} مورد`, 'کالاهای ثبت شده در فروشگاه')}
                    ${buildAdminMetric('کالاهای موجود', `${inStockCount} مورد`, 'در دسترس برای فروش', 'text-emerald-500')}
                    ${buildAdminMetric('نیازمند تأمین', `${lowStockProducts.length} مورد`, 'اولویت امروز', 'text-red-500')}
                </div>
                <div class="admin-report-subcard">
                    <h5 class="admin-report-subtitle">محصولات با موجودی حساس</h5>
                    ${lowStockList}
                </div>
                <div class="admin-report-subcard">
                    <h5 class="admin-report-subtitle">اولویت‌های تأمین پیشنهاد شده</h5>
                    ${restockFocus || '<p class="admin-report-empty">اولویتی برای تأمین مجدد ثبت نشده است.</p>'}
                </div>
            `;

            html = buildAdminReportCard({
                title: 'بررسی موجودی انبار',
                description: 'وضعیت محصولات حساس و پیشنهاد برنامه تأمین موجودی.',
                content
            });
            notify('بررسی موجودی با موفقیت انجام شد.');
            break;
        }
        case 'users': {
            const favoriteCount = wishlistProducts.length;
            const loyalCustomers = orders.reduce((set, order) => {
                if (order && order.customerId) {
                    set.add(order.customerId);
                }
                return set;
            }, new Set());

            const content = `
                <div class="admin-report-grid">
                    ${buildAdminMetric('کاربران وفادار', `${loyalCustomers.size} نفر`, 'بر اساس سفارش‌های تکراری', 'text-indigo-500')}
                    ${buildAdminMetric('علاقه‌مندی‌های ثبت‌شده', `${favoriteCount} محصول`, 'مناسب برای کمپین شخصی‌سازی', 'text-purple-500')}
                    ${buildAdminMetric('سفارش‌های تکمیل شده', `${deliveredOrders} مورد`, 'تحویل موفق به مشتریان', 'text-emerald-500')}
                </div>
                <div class="admin-report-subcard">
                    <h5 class="admin-report-subtitle">جزئیات کاربر فعال</h5>
                    <ul class="admin-report-list">
                        <li><span>نام کاربر فعلی</span><span class="font-semibold">${user && user.name ? user.name : 'کاربر مهمان'}</span></li>
                        <li><span>وضعیت حساب</span><span class="admin-report-tag">${user ? 'احراز هویت شده' : 'نیازمند ورود'}</span></li>
                        <li><span>سفارش‌های در انتظار</span><span class="font-semibold">${pendingOrders}</span></li>
                    </ul>
                </div>
                <div class="admin-report-subcard">
                    <h5 class="admin-report-subtitle">پیشنهاد تعامل</h5>
                    <p class="text-sm leading-relaxed">ارسال پیام خوش‌آمدگویی به مشتریان جدید و ارائه کد تخفیف اختصاصی برای ${favoriteCount} محصول محبوب پیشنهاد می‌شود.</p>
                </div>
            `;

            html = buildAdminReportCard({
                title: 'مدیریت مشتریان وفادار',
                description: 'مروری بر وضعیت کاربران فعال و فرصت‌های تعامل شخصی‌سازی شده.',
                content
            });
            notify('گزارش کاربران نمایش داده شد.');
            break;
        }
        case 'support': {
            const openTickets = Math.max(pendingOrders - deliveredOrders, 0) + notificationsCount;
            const content = `
                <div class="admin-report-grid">
                    ${buildAdminMetric('درخواست‌های باز', `${openTickets} مورد`, 'شامل سفارش‌های در انتظار و پیام‌ها', 'text-amber-500')}
                    ${buildAdminMetric('میانگین زمان پاسخ', '۱ ساعت و ۴۵ دقیقه', 'براساس آخرین گزارش‌ها')}
                    ${buildAdminMetric('اعلان‌های جدید', `${notificationsCount} پیام`, 'در مرکز اعلان‌ها ثبت شده است')}
                </div>
                <div class="admin-report-subcard">
                    <h5 class="admin-report-subtitle">اقدامات پیشنهادی</h5>
                    <ul class="admin-report-list">
                        <li><span>پیگیری سفارش‌های در انتظار</span><span class="admin-report-tag">${pendingOrders} مورد</span></li>
                        <li><span>پاسخ به پیام‌های اخیر</span><span class="admin-report-tag">${notificationsCount} پیام</span></li>
                        <li><span>ارسال بروزرسانی وضعیت برای مشتریان</span><span class="admin-report-tag">سری زمانی ۳ ساعت</span></li>
                    </ul>
                </div>
                <div class="admin-report-subcard">
                    <h5 class="admin-report-subtitle">یادآوری</h5>
                    <p class="text-sm leading-relaxed">برای کاهش زمان پاسخ‌گویی، پیام‌های آماده برای وضعیت‌های پرتکرار تهیه و در تیم پشتیبانی منتشر شود.</p>
                </div>
            `;

            html = buildAdminReportCard({
                title: 'مرکز پشتیبانی',
                description: 'جمع‌بندی درخواست‌های مشتریان و برنامه رسیدگی به آنها.',
                content
            });
            notify('درخواست پشتیبانی ثبت گردید.');
            break;
        }
        case 'campaign': {
            const topCategories = [...new Set(products.map(product => product.category))].slice(0, 3);
            const categoryList = topCategories.length
                ? `<ul class="admin-report-list">${topCategories.map(category => `
                        <li>
                            <span>${getCategoryName(category)}</span>
                            <span class="admin-report-tag">کمپین ۷ روزه</span>
                        </li>
                    `).join('')}</ul>`
                : '<p class="admin-report-empty">دسته‌بندی فعالی برای کمپین وجود ندارد.</p>';

            const content = `
                <div class="admin-report-grid">
                    ${buildAdminMetric('بودجه پیشنهادی', formatPrice(recommendedBudget), '۱۰٪ از فروش کل', 'text-green-500')}
                    ${buildAdminMetric('محصولات تخفیف‌دار', `${discountedProducts.length} مورد`, 'آماده ورود به کمپین', 'text-purple-500')}
                    ${buildAdminMetric('دسته‌های منتخب', `${topCategories.length} دسته`, 'براساس عملکرد اخیر')}
                </div>
                <div class="admin-report-subcard">
                    <h5 class="admin-report-subtitle">پیشنهاد کمپین جدید</h5>
                    ${categoryList}
                </div>
                <div class="admin-report-subcard">
                    <h5 class="admin-report-subtitle">اقدامات بعدی</h5>
                    <ul class="admin-report-list">
                        <li><span>تهیه بنر و محتوای تبلیغاتی</span><span class="admin-report-tag">۴۸ ساعت آینده</span></li>
                        <li><span>ارسال خبرنامه برای مشتریان</span><span class="admin-report-tag">پس از آماده‌سازی محتوا</span></li>
                        <li><span>ارزیابی نتایج کمپین</span><span class="admin-report-tag">پایان هفته</span></li>
                    </ul>
                </div>
            `;

            html = buildAdminReportCard({
                title: 'برنامه کمپین تبلیغاتی',
                description: 'پیشنهاد بودجه و دسته‌های مناسب برای شروع کمپین جدید.',
                content
            });
            notify('برنامه کمپین تبلیغاتی آماده شد.');
            break;
        }
        case 'finance': {
            const discountOpportunity = discountedProducts.reduce((sum, product) => sum + Math.round(product.price * (product.discount / 100)), 0);
            const highValueOrders = orders.slice()
                .sort((a, b) => (b.total || 0) - (a.total || 0))
                .slice(0, 3);

            const content = `
                <div class="admin-report-grid">
                    ${buildAdminMetric('حجم فروش کل', formatPrice(totalRevenue), `${ordersCount} تراکنش موفق`, 'text-green-500')}
                    ${buildAdminMetric('میانگین ارزش سفارش', ordersCount ? formatPrice(averageOrder) : '۰ تومان', 'از ابتدای ماه جاری')}
                    ${buildAdminMetric('ارزش تخفیف بالقوه', formatPrice(discountOpportunity), `${discountedProducts.length} محصول فعال`, 'text-amber-500')}
                    ${buildAdminMetric('بودجه تبلیغات پیشنهادی', formatPrice(recommendedBudget), 'پیشنهاد شده بر اساس فروش اخیر', 'text-blue-500')}
                </div>
                <div class="admin-report-subcard">
                    <h5 class="admin-report-subtitle">سفارش‌های با ارزش بالا</h5>
                    ${highValueOrders.length ? `<ul class="admin-report-list">${highValueOrders.map(order => `
                        <li>
                            <span>سفارش #${order.id || '---'}</span>
                            <span class="admin-report-tag">${formatPrice(order.total || 0)}</span>
                        </li>
                    `).join('')}</ul>` : '<p class="admin-report-empty">سفارشی با مبلغ بالا ثبت نشده است.</p>'}
                </div>
                <div class="admin-report-subcard">
                    <h5 class="admin-report-subtitle">پیشنهاد بهینه‌سازی</h5>
                    <p class="text-sm leading-relaxed">برای افزایش بازدهی مالی، تمرکز بر محصولات با تخفیف ${discountedProducts.length ? 'و ایجاد بسته‌های پیشنهادی ترکیبی' : 'و برنامه‌ریزی تخفیف‌های هدفمند'} توصیه می‌شود.</p>
                </div>
            `;

            html = buildAdminReportCard({
                title: 'خلاصه مالی فروشگاه',
                description: 'مروری بر شاخص‌های کلیدی مالی و پیشنهادهای بهینه‌سازی.',
                content
            });
            notify('گزارش مالی آماده شد.');
            break;
        }
        case 'tasks': {
            const taskItems = [];
            if (pendingOrders > 0) {
                taskItems.push(`پیگیری ${pendingOrders} سفارش در وضعیت «در حال پردازش»`);
            }
            if (lowStockProducts.length > 0) {
                taskItems.push(`ثبت سفارش تأمین برای ${lowStockProducts.length} محصول با موجودی کم`);
            }
            if (wishlistProducts.length > 0) {
                taskItems.push(`آماده‌سازی پیشنهاد ویژه برای ${wishlistProducts.length} محصول محبوب مشتریان`);
            }
            if (adminNotes.length > 0) {
                taskItems.push(`بازبینی ${adminNotes.length} یادداشت مدیریتی ثبت شده`);
            }

            const content = `
                <div class="admin-report-grid">
                    ${buildAdminMetric('کارهای امروز', `${taskItems.length} مورد`, 'اولویت‌بندی شده بر اساس وضعیت فروشگاه', 'text-indigo-500')}
                    ${buildAdminMetric('یادداشت‌های باز', `${adminNotes.length} مورد`, 'برای پیگیری داخلی')}
                    ${buildAdminMetric('یادآوری موجودی', `${lowStockProducts.length} کالا`, 'نیازمند بررسی انبار')}
                </div>
                <div class="admin-report-subcard">
                    <h5 class="admin-report-subtitle">فهرست کارهای روزانه</h5>
                    ${taskItems.length ? `<ul class="admin-report-list">${taskItems.map(item => `
                        <li>
                            <span>${item}</span>
                            <span class="admin-report-tag">امروز</span>
                        </li>
                    `).join('')}</ul>` : '<p class="admin-report-empty">کار ثبت شده‌ای برای امروز وجود ندارد.</p>'}
                </div>
                <div class="admin-report-subcard">
                    <h5 class="admin-report-subtitle">پیشنهاد بعدی</h5>
                    <p class="text-sm leading-relaxed">پس از تکمیل کارهای فوق، وضعیت کمپین‌های فعال را بررسی کرده و برای مشتریان وفادار پیام تشویقی ارسال کنید.</p>
                </div>
            `;

            html = buildAdminReportCard({
                title: 'برنامه کاری امروز',
                description: 'چک‌لیست سریع برای مدیریت امور روزانه فروشگاه.',
                content
            });
            notify('برنامه کاری امروز نمایش داده شد.');
            break;
        }
        case 'insights': {
            const categoryInterest = wishlistProducts.reduce((acc, product) => {
                const categoryName = getCategoryName(product.category);
                acc[categoryName] = (acc[categoryName] || 0) + 1;
                return acc;
            }, {});
            const topInterest = Object.entries(categoryInterest)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);

            const content = `
                <div class="admin-report-grid">
                    ${buildAdminMetric('اقلام مورد علاقه', `${wishlistProducts.length} مورد`, 'برای پیشنهادهای شخصی‌سازی شده', 'text-purple-500')}
                    ${buildAdminMetric('محصولات مقایسه شده', `${comparedProducts.length} مورد`, 'نیازمند بررسی قیمت', 'text-blue-500')}
                    ${buildAdminMetric('بازدیدهای اخیر', `${recentlyViewed.length} محصول`, 'آخرین جستجوهای کاربران')}
                </div>
                <div class="admin-report-subcard">
                    <h5 class="admin-report-subtitle">دسته‌های محبوب مشتریان</h5>
                    ${topInterest.length ? `<ul class="admin-report-list">${topInterest.map(([name, count]) => `
                        <li>
                            <span>${name}</span>
                            <span class="admin-report-tag">${count} علاقه‌مندی</span>
                        </li>
                    `).join('')}</ul>` : '<p class="admin-report-empty">دسته محبوبی در لیست علاقه‌مندی ثبت نشده است.</p>'}
                </div>
                <div class="admin-report-subcard">
                    <h5 class="admin-report-subtitle">آخرین بازدیدها</h5>
                    ${recentlyViewed.length ? `<ul class="admin-report-list">${recentlyViewed.map(product => `
                        <li>
                            <span>${product.name}</span>
                            <span class="admin-report-tag">${getCategoryName(product.category)}</span>
                        </li>
                    `).join('')}</ul>` : '<p class="admin-report-empty">هنوز محصولی توسط کاربران مشاهده نشده است.</p>'}
                </div>
                <div class="admin-report-subcard">
                    <h5 class="admin-report-subtitle">محصولات در حال مقایسه</h5>
                    ${comparedProducts.length ? `<ul class="admin-report-list">${comparedProducts.slice(0, 5).map(product => `
                        <li>
                            <span>${product.name}</span>
                            <span class="admin-report-tag">${formatPrice(product.price)}</span>
                        </li>
                    `).join('')}</ul>` : '<p class="admin-report-empty">مقایسه فعالی ثبت نشده است.</p>'}
                </div>
            `;

            html = buildAdminReportCard({
                title: 'بینش مشتریان',
                description: 'تحلیل علاقه‌مندی‌ها و رفتار کاربران برای تصمیم‌گیری بهتر.',
                content
            });
            notify('بینش مشتریان نمایش داده شد.');
            break;
        }
        case 'dashboard': {
            html = buildAdminReportCard({
                title: 'بارگذاری داشبورد',
                description: 'در حال آماده‌سازی اطلاعات داشبورد مدیریت فروشگاه.',
                content: '<p class="text-sm">لطفا منتظر بمانید...</p>'
            });
            notify('داشبورد مدیریت در حال نمایش است.');
            break;
        }
        default: {
            html = buildAdminReportCard({
                title: 'گزارش در دسترس نیست',
                description: 'گزینه انتخاب شده برای نمایش گزارش پشتیبانی نمی‌شود.',
                content: '<p class="admin-report-empty">لطفا گزینه دیگری را انتخاب کنید.</p>'
            });
            notify('گزینه مورد نظر یافت نشد.', true);
        }
    }

    detailsContainer.innerHTML = html;
}
/* ---------- Admin Panel Functions ---------- */
function openAdminPanel() {
    adminModal.classList.remove('hidden');
    adminModal.classList.add('flex');
    renderAdminProducts();
    setupAdminInputHandlers();
}

function closeAdminPanel() {
    adminModal.classList.add('hidden');
    adminModal.classList.remove('flex');
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
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#imagePreview').innerHTML = `
                    <img src="${e.target.result}" alt="Preview" class="w-32 h-32 object-cover rounded-lg">
                `;
            };
            reader.readAsDataURL(file);
        }
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
    const imagePreview = $('#imagePreview img');
    const img = imagePreview ? imagePreview.src : '';
    
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
    notify(editingProductId ? 'محصول با موفقیت ویرایش شد' : 'محصول جدید با موفقیت اضافه شد');
    
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
        renderAdminPage({ skipWelcome: true });
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
            renderAdminPage({ skipWelcome: true });
        }
    }
}

/* ---------- Admin Login Flow ---------- */
const ADMIN_LOGIN_CODE_LENGTH = 6;
let pendingAdminLogin = null;

function showAdminLoginStep(resetForm = false) {
    if (!adminLoginStep || !adminOtpStep) return;
    adminLoginStep.classList.remove('hidden');
    adminOtpStep.classList.add('hidden');
    if (resetForm && adminLoginForm) {
        adminLoginForm.reset();
        pendingAdminLogin = null;
    }
    if (adminLoginMessage) {
        adminLoginMessage.textContent = '';
    }
    if (typeof resetOtpInputs === 'function' && adminOtpStep) {
        resetOtpInputs(adminOtpStep);
    }
}

function showAdminOtpStep(message) {
    if (!adminLoginStep || !adminOtpStep) return;
    adminLoginStep.classList.add('hidden');
    adminOtpStep.classList.remove('hidden');
    if (adminLoginMessage) {
        adminLoginMessage.innerHTML = message;
    }
    if (typeof resetOtpInputs === 'function') {
        resetOtpInputs(adminOtpStep);
    }
    const inputs = adminOtpStep ? $$('.otp-input', adminOtpStep) : [];
    if (inputs.length) {
        inputs[0].focus();
    }
}

function openAdminLoginModal() {
    if (!adminLoginModal) return;
    if (isAdminAuthenticated()) {
        openAdminDashboardWindow();
        return;
    }
    adminLoginModal.classList.remove('hidden');
    adminLoginModal.classList.add('flex');
    showAdminLoginStep(true);
    if (adminLoginForm) {
        const nationalInput = adminLoginForm.querySelector('#adminNationalCode');
        if (nationalInput) {
            nationalInput.focus();
        }
    }
}

function closeAdminLoginModalHandler() {
    if (!adminLoginModal) return;
    adminLoginModal.classList.add('hidden');
    adminLoginModal.classList.remove('flex');
    showAdminLoginStep(true);
}

/* ---------- Product Image Upload Fix ---------- */
function setupImageUpload() {
    // این تابع مشکل آپلود عکس را برطرف می‌کند
    document.addEventListener('change', (e) => {
        if (e.target.type === 'file' && e.target.accept.includes('image')) {
            const file = e.target.files[0];
            if (file) {
                // بررسی نوع فایل
                if (!file.type.startsWith('image/')) {
                    notify('لطفا فقط فایل تصویری انتخاب کنید', true);
                    e.target.value = '';
                    return;
                }
                
                // بررسی سایز فایل (حداکثر 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    notify('حجم فایل نباید بیشتر از 5 مگابایت باشد', true);
                    e.target.value = '';
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = new Image();
                    img.onload = function() {
                        // نمایش پیش‌نمایش
                        const previewContainer = e.target.parentElement.querySelector('.image-preview');
                        if (previewContainer) {
                            previewContainer.innerHTML = `
                                <img src="${e.target.result}" alt="Preview" class="w-32 h-32 object-cover rounded-lg">
                                <button type="button" class="remove-image absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                                    <iconify-icon icon="mdi:close"></iconify-icon>
                                </button>
                            `;
                            
                            // دکمه حذف عکس
                            previewContainer.querySelector('.remove-image').addEventListener('click', function() {
                                previewContainer.innerHTML = '';
                                e.target.value = '';
                            });
                        }
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    });
}

// Admin panel event listeners
if (adminAccessLink) {
    adminAccessLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (isAdminAuthenticated()) {
            openAdminDashboardWindow();
        } else {
            openAdminLoginModal();
        }
        if (typeof userDropdown !== 'undefined' && userDropdown) {
            userDropdown.classList.remove('open');
        }
    });
}

if (closeAdminLoginModal) {
    closeAdminLoginModal.addEventListener('click', closeAdminLoginModalHandler);
}

if (adminLoginModal) {
    adminLoginModal.addEventListener('click', (e) => {
        if (e.target === adminLoginModal) {
            closeAdminLoginModalHandler();
        }
    });
}

if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(adminLoginForm);
        const fullName = (formData.get('fullName') || '').toString().trim();
        const nationalCode = (formData.get('nationalCode') || '').toString().trim();
        const phone = (formData.get('phone') || '').toString().trim();
        const email = (formData.get('email') || '').toString().trim();
        const adminCode = (formData.get('adminCode') || '').toString().trim();

        if (!fullName || fullName.length < 3) {
            notify('لطفا نام و نام خانوادگی مدیر را وارد کنید.', true);
            return;
        }

        if (typeof validateNationalCode === 'function' && !validateNationalCode(nationalCode)) {
            notify('کد ملی وارد شده معتبر نیست.', true);
            return;
        }

        if (typeof validatePhone === 'function' && !validatePhone(phone)) {
            notify('شماره تماس باید با 09 شروع شده و 11 رقمی باشد.', true);
            return;
        }

        if (typeof validateEmail === 'function' && !validateEmail(email)) {
            notify('ایمیل وارد شده معتبر نیست.', true);
            return;
        }

        if (adminCode.length < 4) {
            notify('کد ادمین باید حداقل ۴ رقم باشد.', true);
            return;
        }

        pendingAdminLogin = { fullName, nationalCode, phone, email, adminCode };
        const message = `کد تأیید به شماره <strong>${phone}</strong> ارسال شد. لطفا کد ${ADMIN_LOGIN_CODE_LENGTH} رقمی را وارد کنید.`;
        showAdminOtpStep(message);
        notify('کد تأیید برای شما ارسال شد.');
    });
}

if (adminOtpBack) {
    adminOtpBack.addEventListener('click', () => {
        if (!adminLoginForm || !pendingAdminLogin) {
            showAdminLoginStep(true);
            return;
        }
        showAdminLoginStep(false);
        const fullNameField = adminLoginForm.querySelector('#adminFullName');
        const nationalField = adminLoginForm.querySelector('#adminNationalCode');
        const phoneField = adminLoginForm.querySelector('#adminPhone');
        const emailField = adminLoginForm.querySelector('#adminEmail');
        const adminCodeField = adminLoginForm.querySelector('#adminCode');
        if (fullNameField) fullNameField.value = pendingAdminLogin.fullName || '';
        if (nationalField) nationalField.value = pendingAdminLogin.nationalCode;
        if (phoneField) phoneField.value = pendingAdminLogin.phone;
        if (emailField) emailField.value = pendingAdminLogin.email;
        if (adminCodeField) adminCodeField.value = pendingAdminLogin.adminCode;
    });
}

if (adminOtpForm) {
    adminOtpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!adminOtpStep) return;
        const code = typeof getOtpCode === 'function' ? getOtpCode(adminOtpStep) : '';
        if (code.length !== ADMIN_LOGIN_CODE_LENGTH) {
            notify(`لطفا کد ${ADMIN_LOGIN_CODE_LENGTH} رقمی را کامل وارد کنید.`, true);
            if (typeof highlightOtpInputs === 'function') {
                highlightOtpInputs(adminOtpStep, false);
            }
            return;
        }

        if (code) {
            if (typeof highlightOtpInputs === 'function') {
                highlightOtpInputs(adminOtpStep, true);
            }
            startAdminSession(pendingAdminLogin);
            pendingAdminLogin = null;
            notify('ورود مدیر با موفقیت انجام شد!');
            closeAdminLoginModalHandler();
            openAdminDashboardWindow();
            if (typeof updateUserLabel === 'function') {
                updateUserLabel();
            }
        }
    });
}

closeAdminModal.addEventListener('click', closeAdminPanel);
addProductBtn.addEventListener('click', () => {
    editingProductId = null;
    showProductForm();
});
saveProductBtn.addEventListener('click', saveProduct);
cancelProductBtn.addEventListener('click', () => {
    productForm.classList.add('hidden');
    editingProductId = null;
});
adminSearch.addEventListener('input', renderAdminProducts);

// Initialize image upload and admin OTP inputs
document.addEventListener('DOMContentLoaded', () => {
    ensureAdminThemeStyles();
    updateAdminThemeButton();
    setupImageUpload();
    if (adminOtpStep && typeof setupOtpInputs === 'function') {
        setupOtpInputs(adminOtpStep);
    }
});

document.addEventListener('click', (event) => {
    const themeToggleBtn = event.target.closest('#adminThemeToggle');
    if (themeToggleBtn) {
        event.preventDefault();
        toggleAdminTheme();
        return;
    }

    const actionBtn = event.target.closest('[data-admin-action]');
    if (actionBtn) {
        event.preventDefault();
        const action = actionBtn.getAttribute('data-admin-action');
        if (action === 'dashboard') {
            if (isAdminAuthenticated()) {
                openAdminDashboardWindow();
            } else {
                openAdminLoginModal();
            }
        } else {
            handleAdminQuickAction(action);
        }
        if (typeof userDropdown !== 'undefined' && userDropdown) {
            userDropdown.classList.remove('open');
        }
        return;
    }

    const openStoreBtn = event.target.closest('[data-admin-open-store]');
    if (openStoreBtn) {
        event.preventDefault();
        handleAdminOpenStore();
        return;
    }

    const logoutTrigger = event.target.closest('[data-admin-logout]');
    const legacyLogout = event.target.id === 'adminLogoutBtn' || event.target.closest('#adminLogoutBtn');
    if (logoutTrigger || legacyLogout) {
        event.preventDefault();
        handleAdminLogoutAction({ closeWindow: isAdminWindow() });
        if (typeof userDropdown !== 'undefined' && userDropdown) {
            userDropdown.classList.remove('open');
        }
        return;
    }

    const orderActionBtn = event.target.closest('[data-order-action]');
    if (orderActionBtn) {
        event.preventDefault();
        const orderId = orderActionBtn.getAttribute('data-id');
        const status = orderActionBtn.getAttribute('data-status');
        updateOrderStatus(orderId, status);
        return;
    }

    const stockActionBtn = event.target.closest('[data-stock-action]');
    if (stockActionBtn) {
        event.preventDefault();
        const productId = stockActionBtn.getAttribute('data-id');
        const actionType = stockActionBtn.getAttribute('data-stock-action');
        if (actionType === 'restock') {
            const amount = stockActionBtn.getAttribute('data-amount') || 5;
            restockProduct(productId, amount);
        } else if (actionType === 'markout') {
            markProductOutOfStock(productId);
        }
        return;
    }

    const noteActionBtn = event.target.closest('[data-note-action]');
    if (noteActionBtn) {
        event.preventDefault();
        const actionType = noteActionBtn.getAttribute('data-note-action');
        if (actionType === 'remove') {
            removeAdminNote(noteActionBtn.getAttribute('data-id'));
        }
    }
});

document.addEventListener('submit', (event) => {
    if (event.target && event.target.id === 'adminNoteForm') {
        event.preventDefault();
        handleAdminNoteFormSubmit(event.target);
    }
});
(function(){
  if (typeof document === 'undefined') return;
  const body = document.body;
  if (!body || body.dataset.page !== 'admin') return;

  function activate(){
    const target = '#admin';
    if (location.hash !== target) {
      location.hash = target;
    } else if (typeof renderPage === 'function') {
      renderPage();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', activate);
  } else {
    activate();
  }
})();
