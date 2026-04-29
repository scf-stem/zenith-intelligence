(function () {
    const VISITOR_KEY = "zenith_site_visitor_id";
    const SESSION_KEY = "zenith_site_session";
    const SESSION_TTL = 30 * 60 * 1000;
    const startedAt = Date.now();

    function isLocalhost() {
        return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    }

    function apiBases() {
        const env = window.__env__ || {};
        if (env.VITE_API_BASE_URL) {
            return [env.VITE_API_BASE_URL];
        }
        if (isLocalhost()) {
            return ["http://localhost:5001", ""];
        }
        return [""];
    }

    function makeId(prefix) {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return `${prefix}_${window.crypto.randomUUID()}`;
        }
        return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    }

    function getVisitorId() {
        let visitorId = localStorage.getItem(VISITOR_KEY);
        if (!visitorId) {
            visitorId = makeId("v");
            localStorage.setItem(VISITOR_KEY, visitorId);
        }
        return visitorId;
    }

    function getSessionId() {
        const now = Date.now();
        const rawSession = sessionStorage.getItem(SESSION_KEY);
        if (rawSession) {
            try {
                const session = JSON.parse(rawSession);
                if (session.id && now - session.updatedAt < SESSION_TTL) {
                    session.updatedAt = now;
                    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
                    return session.id;
                }
            } catch (error) {
                sessionStorage.removeItem(SESSION_KEY);
            }
        }

        const session = { id: makeId("s"), updatedAt: now };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session.id;
    }

    function currentPath() {
        return `${window.location.pathname}${window.location.search}` || "/";
    }

    function send(path, payload) {
        const body = JSON.stringify({
            visitorId: getVisitorId(),
            sessionId: getSessionId(),
            path: currentPath(),
            ...payload
        });

        for (const base of apiBases()) {
            const url = `${base}${path}`;
            if (navigator.sendBeacon) {
                const blob = new Blob([body], { type: "application/json" });
                if (navigator.sendBeacon(url, blob)) {
                    return;
                }
            }

            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body,
                keepalive: true
            }).catch(() => {});
            return;
        }
    }

    function trackPageview() {
        send("/api/site-analytics/collect", {
            type: "pageview",
            title: document.title,
            referrer: document.referrer || null
        });
    }

    function trackDuration() {
        const duration = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
        send("/api/site-analytics/collect", {
            type: "duration",
            duration
        });
    }

    window.ZenithAnalytics = {
        track(eventName, metadata) {
            if (!eventName) {
                return;
            }
            send("/api/site-analytics/collect", {
                type: "event",
                eventName,
                metadata: metadata || {}
            });
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", trackPageview, { once: true });
    } else {
        trackPageview();
    }

    window.addEventListener("pagehide", trackDuration);
})();
