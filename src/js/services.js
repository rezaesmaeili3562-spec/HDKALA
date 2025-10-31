/* ---------- Data Services & Event Bus ---------- */
const DataService = (() => {
    const manifest = Object.freeze({
        products: 'data/products.json',
        blogs: 'data/blogs.json',
        categories: 'data/categories.json',
        provinces: 'data/provinces.json'
    });

    const cache = new Map();
    const embeddedData = (() => {
        const runtimeData = (typeof globalThis !== 'undefined' && globalThis.__HDK_BOOTSTRAP_DATA__)
            ? globalThis.__HDK_BOOTSTRAP_DATA__
            : (typeof EMBEDDED_DATA !== 'undefined' ? EMBEDDED_DATA : null);

        const scriptData = readEmbeddedDataFromDom();
        const resolved = runtimeData || scriptData;

        if (!runtimeData && resolved && typeof globalThis !== 'undefined') {
            try {
                if (!globalThis.__HDK_BOOTSTRAP_DATA__) {
                    globalThis.__HDK_BOOTSTRAP_DATA__ = resolved;
                }
            } catch (error) {
                /* ignore global assignment errors */
            }
        }

        return resolved;
    })();

    if (embeddedData && typeof embeddedData === 'object') {
        Object.entries(embeddedData).forEach(([key, value]) => {
            if (manifest[key] && typeof value !== 'undefined' && !cache.has(key)) {
                cache.set(key, value);
            }
        });
    }
    const eventTarget = typeof window !== 'undefined' && typeof window.EventTarget === 'function'
        ? new EventTarget()
        : { addEventListener() {}, removeEventListener() {}, dispatchEvent() {} };

    let bootstrapPromise = null;

    function isBrowser() {
        return typeof window !== 'undefined' && typeof window.fetch === 'function';
    }

    function isFileProtocol() {
        if (typeof window === 'undefined' || typeof window.location === 'undefined') {
            return false;
        }

        const { protocol, origin } = window.location;

        if (protocol === 'file:') {
            return true;
        }

        return origin === 'null' || origin === null || typeof origin === 'undefined';
    }

    function readEmbeddedDataFromDom() {
        if (typeof document === 'undefined') {
            return null;
        }

        const script = document.getElementById('hdk-bootstrap-data');
        if (!script) {
            return null;
        }

        const text = script.textContent || script.innerText || '';
        if (!text.trim()) {
            return null;
        }

        try {
            return JSON.parse(text);
        } catch (error) {
            console.warn('[DataService] Failed to parse embedded bootstrap data:', error);
            return null;
        }
    }

    function resolveEmbeddedDataset(key) {
        const sources = [
            embeddedData,
            (typeof globalThis !== 'undefined' && globalThis.__HDK_BOOTSTRAP_DATA__)
                ? globalThis.__HDK_BOOTSTRAP_DATA__
                : null,
            (typeof EMBEDDED_DATA !== 'undefined') ? EMBEDDED_DATA : null,
            readEmbeddedDataFromDom()
        ];

        for (const source of sources) {
            if (source && Object.prototype.hasOwnProperty.call(source, key)) {
                return source[key];
            }
        }

        return undefined;
    }

    function primeFromEmbeddedData(key) {
        if (cache.has(key)) {
            return cache.get(key);
        }

        const dataset = resolveEmbeddedDataset(key);
        if (typeof dataset !== 'undefined') {
            cache.set(key, dataset);
            return dataset;
        }

        return undefined;
    }

    function buildRequestUrl(path) {
        if (!isBrowser()) {
            return path;
        }

        if (/^https?:/.test(path)) {
            return path;
        }

        const origin = window.location.origin && window.location.origin !== 'null'
            ? window.location.origin
            : `${window.location.protocol}//${window.location.host}`;
        const base = origin.endsWith('/') ? origin.slice(0, -1) : origin;
        const normalized = path.startsWith('/') ? path : `/${path}`;
        return `${base}${normalized}`;
    }

    async function fetchJson(key) {
        if (cache.has(key)) {
            return cache.get(key);
        }

        const resourcePath = manifest[key];
        if (!resourcePath) {
            throw new Error(`Resource "${key}" is not registered`);
        }

        if (!isBrowser() || isFileProtocol()) {
            const fallbackData = primeFromEmbeddedData(key);

            if (typeof fallbackData !== 'undefined') {
                return fallbackData;
            }

            if (!isBrowser()) {
                throw new Error(`Resource "${key}" cannot be fetched outside of a browser environment`);
            }

            throw new Error(`Cannot fetch "${resourcePath}" using the file protocol`);
        }

        const response = await fetch(buildRequestUrl(resourcePath), { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Failed to fetch ${resourcePath}: ${response.status}`);
        }

        const data = await response.json();
        cache.set(key, data);
        return data;
    }

    function subscribe(name, handler) {
        if (typeof handler !== 'function' || !eventTarget.addEventListener) {
            return () => {};
        }

        const listener = (event) => {
            if (event?.detail?.name === name) {
                handler(event.detail.data, event.detail);
            }
        };

        eventTarget.addEventListener('data', listener);
        return () => eventTarget.removeEventListener('data', listener);
    }

    function emit(name, data, meta = {}) {
        if (!eventTarget.dispatchEvent) {
            return;
        }

        eventTarget.dispatchEvent(new CustomEvent('data', {
            detail: { name, data, ...meta }
        }));
    }

    function primeCache(key, data) {
        if (typeof key !== 'string' || typeof data === 'undefined') {
            return;
        }
        cache.set(key, data);
    }

    function getCached(key) {
        return cache.get(key);
    }

    async function bootstrap(overrides = {}) {
        if (bootstrapPromise) {
            return bootstrapPromise;
        }

        bootstrapPromise = (async () => {
            const results = {};

            for (const key of Object.keys(manifest)) {
                const config = overrides[key] || {};
                if (config.prime) {
                    primeCache(key, config.prime);
                }

                try {
                    primeFromEmbeddedData(key);
                    const data = await fetchJson(key);
                    results[key] = data;
                    emit(key, data, { source: 'remote' });
                } catch (error) {
                    const fallback = typeof config.fallback !== 'undefined'
                        ? config.fallback
                        : null;

                    if (fallback !== null) {
                        primeCache(key, fallback);
                        results[key] = fallback;
                        emit(key, fallback, { source: 'fallback', error });
                    } else {
                        results[key] = null;
                        emit(key, null, { source: 'error', error });
                    }

                    console.warn('[DataService]', error.message || error);
                }
            }

            return results;
        })();

        return bootstrapPromise;
    }

    async function load(name, { fallback } = {}) {
        try {
            return await fetchJson(name);
        } catch (error) {
            if (typeof fallback !== 'undefined') {
                primeCache(name, fallback);
                emit(name, fallback, { source: 'fallback', error });
                return fallback;
            }
            throw error;
        }
    }

    return Object.freeze({
        bootstrap,
        subscribe,
        load,
        getCached,
        primeCache
    });
})();

const UIEventBus = (() => {
    const target = typeof window !== 'undefined' && typeof window.EventTarget === 'function'
        ? new EventTarget()
        : { addEventListener() {}, removeEventListener() {}, dispatchEvent() {} };

    function emit(name, detail) {
        if (!target.dispatchEvent) {
            return;
        }
        target.dispatchEvent(new CustomEvent(name, { detail }));
    }

    function on(name, handler) {
        if (!target.addEventListener) {
            return () => {};
        }

        target.addEventListener(name, handler);
        return () => target.removeEventListener(name, handler);
    }

    return Object.freeze({ emit, on });
})();
