/* ---------- Toast System ---------- */
const TOAST_VARIANTS = {
    success: {
        icon: 'mdi:check-circle',
        label: 'موفقیت',
        className: 'toast--success',
        duration: 3800
    },
    error: {
        icon: 'mdi:alert-circle',
        label: 'خطا',
        className: 'toast--error',
        duration: 5600
    },
    warning: {
        icon: 'mdi:alert',
        label: 'هشدار',
        className: 'toast--warning',
        duration: 4800
    },
    info: {
        icon: 'mdi:information',
        label: 'اطلاعیه',
        className: 'toast--info',
        duration: 4200
    }
};

class ToastManager {
    constructor() {
        this.container = null;
        this.activeToasts = new Map();
        this.queue = [];
        this.maxVisible = 3;
        this.recentMessages = new Map();
        this.recentMessageWindow = 1200;
    }

    ensureContainer() {
        if (this.container && document.body.contains(this.container)) {
            return this.container;
        }

        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        container.setAttribute('role', 'region');
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'false');
        document.body.appendChild(container);
        this.container = container;
        return container;
    }

    normalizeVariant(variant) {
        if (typeof variant === 'boolean') {
            return variant ? 'error' : 'success';
        }
        if (typeof variant !== 'string') {
            return 'info';
        }
        return TOAST_VARIANTS[variant] ? variant : 'info';
    }

    shouldThrottle(message) {
        const key = message.trim();
        const now = Date.now();
        const last = this.recentMessages.get(key) || 0;
        if (now - last < this.recentMessageWindow) {
            return true;
        }
        this.recentMessages.set(key, now);
        return false;
    }

    show(message, variant = 'info', options = {}) {
        if (!message || typeof document === 'undefined') {
            return null;
        }

        const text = String(message).trim();
        if (!text) {
            return null;
        }

        const normalizedVariant = this.normalizeVariant(variant);
        const config = TOAST_VARIANTS[normalizedVariant] || TOAST_VARIANTS.info;
        const duration = typeof options.duration === 'number' ? Math.max(options.duration, 1500) : config.duration;

        if (!options.allowDuplicates && this.shouldThrottle(`${normalizedVariant}:${text}`)) {
            return null;
        }

        const container = this.ensureContainer();
        const id = options.id || uid('toast');
        const toast = this.createToastElement({ id, text, config, duration, options });

        if (this.activeToasts.size >= this.maxVisible) {
            this.queue.push({ message: text, variant: normalizedVariant, options });
            return id;
        }

        container.appendChild(toast.element);
        requestAnimationFrame(() => {
            toast.element.classList.add('toast--visible');
        });

        this.activeToasts.set(id, toast);
        toast.startTimer();
        return id;
    }

    createToastElement({ id, text, config, duration, options }) {
        const element = document.createElement('div');
        element.className = `toast ${config.className}`;
        element.setAttribute('role', config === TOAST_VARIANTS.error ? 'alert' : 'status');
        element.dataset.toastId = id;

        const content = document.createElement('div');
        content.className = 'toast__content';

        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'toast__icon';
        const icon = document.createElement('iconify-icon');
        icon.setAttribute('icon', config.icon);
        icon.setAttribute('width', '22');
        iconWrapper.appendChild(icon);

        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'toast__message';

        const label = document.createElement('span');
        label.className = 'toast__label';
        label.textContent = config.label;

        const textNode = document.createElement('div');
        textNode.className = 'toast__text';
        textNode.textContent = text;

        messageWrapper.appendChild(label);
        messageWrapper.appendChild(textNode);

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'toast__close';
        closeButton.setAttribute('aria-label', 'بستن اعلان');
        closeButton.appendChild(document.createTextNode('×'));

        content.appendChild(iconWrapper);
        content.appendChild(messageWrapper);
        element.appendChild(content);
        element.appendChild(closeButton);

        const toast = {
            id,
            element,
            duration,
            timer: null,
            pausedAt: null,
            options,
            startTimer: () => {
                toast.clearTimer();
                toast.timer = setTimeout(() => this.dismiss(id), duration);
            },
            clearTimer: () => {
                if (toast.timer) {
                    clearTimeout(toast.timer);
                    toast.timer = null;
                }
            }
        };

        const pause = () => {
            if (toast.timer) {
                toast.pausedAt = Date.now();
                toast.clearTimer();
            }
        };

        const resume = () => {
            if (!toast.pausedAt) {
                toast.startTimer();
                return;
            }
            const elapsed = Date.now() - toast.pausedAt;
            const remaining = Math.max(duration - elapsed, 1000);
            toast.clearTimer();
            toast.timer = setTimeout(() => this.dismiss(id), remaining);
            toast.pausedAt = null;
        };

        element.addEventListener('mouseenter', pause);
        element.addEventListener('mouseleave', resume);
        closeButton.addEventListener('click', () => this.dismiss(id, { userDismissed: true }));

        return toast;
    }

    dismiss(id, meta = {}) {
        const toast = this.activeToasts.get(id);
        if (!toast) {
            return;
        }

        toast.clearTimer();
        this.activeToasts.delete(id);
        const element = toast.element;
        element.classList.remove('toast--visible');

        const remove = () => {
            element.removeEventListener('transitionend', remove);
            if (element.parentElement) {
                element.parentElement.removeChild(element);
            }
            this.flushQueue();
        };

        element.addEventListener('transitionend', remove);
        setTimeout(remove, 260);

        if (typeof toast.options.onClose === 'function') {
            try {
                toast.options.onClose({ id, ...meta });
            } catch (error) {
                console.error('Toast onClose handler error:', error);
            }
        }
    }

    flushQueue() {
        if (this.queue.length === 0 || this.activeToasts.size >= this.maxVisible) {
            return;
        }

        const next = this.queue.shift();
        if (!next) {
            return;
        }
        this.show(next.message, next.variant, next.options);
    }

    clearAll() {
        Array.from(this.activeToasts.keys()).forEach(id => this.dismiss(id));
        this.queue = [];
    }
}

const toastManager = new ToastManager();

function notify(message, variant = 'info', options = {}) {
    return toastManager.show(message, variant, options);
}

if (typeof window !== 'undefined') {
    window.notify = notify;
    window.toastManager = toastManager;
}
