(function () {
    const NAV_ITEMS = [
        { page: 'app.html', key: 'nav.solve', icon: 'sparkles' },
        { page: 'courses.html', key: 'nav.courses', icon: 'courses' },
        { page: 'programming.html', key: 'nav.programming', icon: 'code' },
        { page: 'stats.html', key: 'nav.stats', icon: 'stats' },
        { page: 'profile.html', key: 'nav.profile', icon: 'profile' },
    ];

    function icon(name) {
        const attrs = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
        const paths = {
            sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/>',
            courses: '<path d="M22 10v6"/><path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
            code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
            stats: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
            profile: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
            logo: '<path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
            logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
        };
        return `<svg ${attrs}>${paths[name] || ''}</svg>`;
    }

    function currentPage() {
        const page = window.location.pathname.split('/').pop();
        return page || 'app.html';
    }

    function t(key, fallback) {
        return window.ZenithI18n ? window.ZenithI18n.t(key, fallback) : fallback;
    }

    function removeLegacyNavigation(page) {
        document.querySelectorAll('.nav-menu').forEach((node) => node.remove());
        if (page === 'app.html') {
            const legacyHeader = document.querySelector('body > header');
            if (legacyHeader && !legacyHeader.classList.contains('zenith-unified-header')) {
                legacyHeader.remove();
            }
        }
        if (page === 'learning.html') {
            const learningHeader = document.querySelector('.header');
            if (learningHeader) {
                learningHeader.remove();
            }
        }
    }

    function makeHeader(page) {
        const header = document.createElement('header');
        header.className = 'zenith-unified-header';
        header.innerHTML = `
            <div class="zenith-unified-inner">
                <a class="zenith-brand" href="app.html" aria-label="Zenith Intelligence">
                    <span class="zenith-brand-icon">${icon('logo')}</span>
                    <span class="zenith-brand-text" data-i18n="site.name">${t('site.name', 'Zenith Intelligence')}</span>
                </a>
                <nav class="zenith-main-nav" aria-label="Primary">
                    ${NAV_ITEMS.map((item) => `
                        <a class="zenith-nav-link ${item.page === page ? 'active' : ''}" href="${item.page}">
                            ${icon(item.icon)}
                            <span data-i18n="${item.key}">${t(item.key, item.page)}</span>
                        </a>
                    `).join('')}
                </nav>
                <div class="zenith-status-cluster">
                    <div class="zenith-status-pill" title="Backend status">
                        <span class="zenith-status-dot" id="site-backend-dot"></span>
                        <span data-i18n="status.network">${t('status.network', 'Network')}</span>
                        <span id="site-backend-status" data-i18n="status.unknown">${t('status.unknown', 'Unknown')}</span>
                        <span id="site-backend-delay"></span>
                    </div>
                    <div class="zenith-status-pill" title="Model status">
                        <span class="zenith-model-mark">DS</span>
                        <span data-i18n="site.model">${t('site.model', 'DeepSeek V4 Flash')}</span>
                        <span id="site-model-status" data-i18n="status.unknown">${t('status.unknown', 'Unknown')}</span>
                    </div>
                    <label class="zenith-language-select">
                        <span data-i18n="lang.label">${t('lang.label', 'Language')}</span>
                        <select id="zenith-locale-select" aria-label="Language">
                            <option value="en">EN</option>
                            <option value="zh-CN">中文</option>
                        </select>
                    </label>
                    <a class="zenith-login-link" id="site-login-link" href="index.html" data-i18n="action.login">${t('action.login', 'Log in')}</a>
                    <button class="zenith-user-chip" id="site-user-chip" type="button">
                        <span class="zenith-user-avatar" id="site-user-avatar">U</span>
                        <span id="site-user-name">User</span>
                        <span class="zenith-logout-icon">${icon('logout')}</span>
                    </button>
                </div>
            </div>
        `;
        return header;
    }

    function fetchApi(path, options) {
        if (window.UserManager && typeof window.UserManager.fetchApi === 'function') {
            return window.UserManager.fetchApi(path, options);
        }
        return fetch(path, options);
    }

    function setBackendStatus(healthy, statusKey, delay) {
        const dot = document.getElementById('site-backend-dot');
        const status = document.getElementById('site-backend-status');
        const delayNode = document.getElementById('site-backend-delay');
        if (dot) dot.className = `zenith-status-dot ${healthy ? 'online' : 'offline'}`;
        if (status) {
            status.setAttribute('data-i18n', statusKey);
            status.textContent = t(statusKey, healthy ? 'Online' : 'Offline');
        }
        if (delayNode) {
            delayNode.textContent = healthy && delay ? `${delay}ms` : '';
        }
    }

    function setModelStatus(healthy, statusKey) {
        const status = document.getElementById('site-model-status');
        if (status) {
            status.setAttribute('data-i18n', statusKey);
            status.textContent = t(statusKey, healthy ? 'Online' : 'Offline');
        }
    }

    async function refreshStatus() {
        try {
            const start = performance.now();
            const response = await fetchApi('/api/health');
            const data = await response.json();
            setBackendStatus(Boolean(data.success), data.success ? 'status.online' : 'status.offline', Math.round(performance.now() - start));
        } catch (error) {
            setBackendStatus(false, 'status.offline');
        }

        try {
            const response = await fetchApi('/api/model/providers/deepseek/health');
            const data = await response.json();
            setModelStatus(Boolean(data.success && data.data && data.data.healthy), data.success && data.data && data.data.healthy ? 'status.online' : 'status.offline');
        } catch (error) {
            setModelStatus(false, 'status.unknown');
        }

        if (window.ZenithI18n) {
            window.ZenithI18n.apply(document.querySelector('.zenith-unified-header'));
        }
    }

    function updateUser() {
        const chip = document.getElementById('site-user-chip');
        const login = document.getElementById('site-login-link');
        const name = document.getElementById('site-user-name');
        const avatar = document.getElementById('site-user-avatar');
        const isLoggedIn = window.UserManager && window.UserManager.isLoggedIn();
        const user = isLoggedIn ? window.UserManager.getSavedUser() : null;

        if (chip) chip.style.display = isLoggedIn ? 'inline-flex' : 'none';
        if (login) login.style.display = isLoggedIn ? 'none' : 'inline-flex';
        if (user && name && avatar) {
            const username = user.username || user.name || 'User';
            name.textContent = username;
            avatar.textContent = username.charAt(0).toUpperCase();
        }
    }

    function bindHeader() {
        const localeSelect = document.getElementById('zenith-locale-select');
        if (localeSelect && window.ZenithI18n) {
            localeSelect.value = window.ZenithI18n.getLocale();
            localeSelect.addEventListener('change', () => window.ZenithI18n.setLocale(localeSelect.value));
            window.addEventListener('zenith:localechange', () => {
                localeSelect.value = window.ZenithI18n.getLocale();
            });
        }

        const chip = document.getElementById('site-user-chip');
        if (chip) {
            chip.addEventListener('click', () => {
                if (window.UserManager) {
                    window.UserManager.logout();
                } else {
                    localStorage.removeItem('ai_learning_assistant_token');
                    localStorage.removeItem('ai_learning_assistant_user');
                    window.location.href = 'index.html';
                }
            });
        }
    }

    function init() {
        const page = currentPage();
        if (page === 'dashboard.html') {
            initDashboardControls();
            return;
        }
        if (!['app.html', 'courses.html', 'learning.html', 'programming.html', 'profile.html', 'stats.html'].includes(page)) {
            return;
        }

        removeLegacyNavigation(page);
        document.body.insertBefore(makeHeader(page), document.body.firstChild);
        bindHeader();
        updateUser();
        refreshStatus();
        setInterval(refreshStatus, 30000);

        if (window.ZenithI18n) {
            window.ZenithI18n.apply(document.querySelector('.zenith-unified-header'));
        }
    }

    function initDashboardControls() {
        const controls = document.querySelector('.controls');
        if (!controls) return;

        const language = document.createElement('label');
        language.className = 'zenith-language-select';
        language.innerHTML = `
            <span data-i18n="lang.label">${t('lang.label', 'Language')}</span>
            <select id="zenith-locale-select" aria-label="Language">
                <option value="en">EN</option>
                <option value="zh-CN">中文</option>
            </select>
        `;
        controls.appendChild(language);

        const localeSelect = language.querySelector('select');
        if (localeSelect && window.ZenithI18n) {
            localeSelect.value = window.ZenithI18n.getLocale();
            localeSelect.addEventListener('change', () => window.ZenithI18n.setLocale(localeSelect.value));
        }

        if (window.ZenithI18n) {
            window.ZenithI18n.apply(document.body);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
