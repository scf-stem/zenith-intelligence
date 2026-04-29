(function () {
    function track(eventName, data) {
        if (window.ZenithAnalytics) {
            window.ZenithAnalytics.track(eventName, data || {});
        }
    }

    function notify(message, type) {
        if (typeof window.showToast === "function") {
            window.showToast(message, type || "info");
            return;
        }
        alert(message);
    }

    function createWidget() {
        if (document.getElementById("feedback-open-btn")) {
            return;
        }

        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
            <button type="button" class="feedback-fab app-feedback-fab" id="feedback-open-btn" aria-label="提交反馈">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                </svg>
                <span>反馈</span>
            </button>

            <div class="feedback-modal" id="feedback-modal" aria-hidden="true">
                <div class="feedback-backdrop" id="feedback-backdrop"></div>
                <section class="feedback-panel" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
                    <div class="feedback-header">
                        <div>
                            <h2 id="feedback-title">提交反馈</h2>
                            <p>告诉我们你遇到的问题或建议</p>
                        </div>
                        <button type="button" class="feedback-close" id="feedback-close-btn" aria-label="关闭反馈窗口">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <form id="feedback-form" class="feedback-form">
                        <div class="feedback-field">
                            <label for="feedback-category">反馈类型</label>
                            <select id="feedback-category" name="category">
                                <option value="general">一般反馈</option>
                                <option value="bug">问题反馈</option>
                                <option value="feature">功能建议</option>
                                <option value="account">账号相关</option>
                                <option value="content">内容建议</option>
                            </select>
                        </div>

                        <div class="feedback-field">
                            <label for="feedback-content">反馈内容</label>
                            <textarea id="feedback-content" name="content" rows="5" maxlength="2000" placeholder="请描述你遇到的问题、建议或想法" required></textarea>
                            <div class="feedback-count"><span id="feedback-count">0</span>/2000</div>
                        </div>

                        <div class="feedback-field">
                            <label for="feedback-contact">联系方式（选填）</label>
                            <input type="text" id="feedback-contact" name="contact" maxlength="120" placeholder="邮箱、手机号或其他联系方式">
                        </div>

                        <button type="submit" class="feedback-submit">
                            <span class="btn-text">提交反馈</span>
                            <span class="btn-loading" style="display: none;">提交中...</span>
                        </button>
                    </form>
                </section>
            </div>
        `;

        document.body.appendChild(wrapper);
    }

    function initWidget() {
        createWidget();

        const openBtn = document.getElementById("feedback-open-btn");
        const closeBtn = document.getElementById("feedback-close-btn");
        const backdrop = document.getElementById("feedback-backdrop");
        const modal = document.getElementById("feedback-modal");
        const form = document.getElementById("feedback-form");
        const contentInput = document.getElementById("feedback-content");
        const count = document.getElementById("feedback-count");

        if (!openBtn || !closeBtn || !backdrop || !modal || !form || !contentInput || !count) {
            return;
        }

        const openModal = () => {
            modal.classList.add("active");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("feedback-modal-open");
            contentInput.focus();
            track("feedback_open", { page: window.location.pathname });
        };

        const closeModal = () => {
            modal.classList.remove("active");
            modal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("feedback-modal-open");
        };

        openBtn.addEventListener("click", openModal);
        closeBtn.addEventListener("click", closeModal);
        backdrop.addEventListener("click", closeModal);
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && modal.classList.contains("active")) {
                closeModal();
            }
        });

        contentInput.addEventListener("input", () => {
            count.textContent = contentInput.value.length;
        });

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const category = document.getElementById("feedback-category").value;
            const content = contentInput.value.trim();
            const contact = document.getElementById("feedback-contact").value.trim();

            if (content.length < 5) {
                notify("反馈内容至少需要 5 个字符", "error");
                return;
            }

            const submitBtn = form.querySelector("button[type='submit']");
            submitBtn.disabled = true;
            submitBtn.querySelector(".btn-text").style.display = "none";
            submitBtn.querySelector(".btn-loading").style.display = "inline";

            try {
                const response = await UserManager.fetchApi("/api/feedback", {
                    method: "POST",
                    body: JSON.stringify({
                        category,
                        content,
                        contact,
                        pageUrl: window.location.href
                    })
                });
                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.error || "提交失败");
                }

                track("feedback_submit_success", { page: window.location.pathname, category });
                notify("反馈已提交，感谢你的建议", "success");
                form.reset();
                count.textContent = "0";
                closeModal();
            } catch (error) {
                track("feedback_submit_error", { page: window.location.pathname, category });
                notify(error.message || "反馈提交失败，请稍后重试", "error");
            } finally {
                submitBtn.disabled = false;
                submitBtn.querySelector(".btn-text").style.display = "inline";
                submitBtn.querySelector(".btn-loading").style.display = "none";
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initWidget, { once: true });
    } else {
        initWidget();
    }
})();
