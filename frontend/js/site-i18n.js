(function () {
    const LOCALE_KEY = 'zenith_locale';
    const DEFAULT_LOCALE = 'en';
    const SUPPORTED_LOCALES = ['en', 'zh-CN'];

    const en = {
        'Zenith Intelligence (极智学习)': 'Zenith Intelligence',
        '智能解题': 'Problem Solver',
        '课程中心': 'Courses',
        '编程助手': 'Programming',
        '学习统计': 'Stats',
        '个人中心': 'Profile',
        '学习界面': 'Learning',
        '站长统计': 'Admin Stats',
        '网络': 'Network',
        '在线': 'Online',
        '离线': 'Offline',
        '未知': 'Unknown',
        '模型就绪': 'Model Ready',
        '模型在线': 'Model Online',
        '模型离线': 'Model Offline',
        '语言': 'Language',
        '登录': 'Log in',
        '注册': 'Register',
        '退出登录': 'Log out',
        '个人资料': 'Profile',
        '所有学科': 'All subjects',
        '所有难度': 'All levels',
        '编程': 'Programming',
        '入门': 'Beginner',
        '进阶': 'Intermediate',
        '高级': 'Advanced',
        '今天想学点什么？': 'What would you like to learn today?',
        '拍照或输入题目，AI为您提供深度解析与引导。': 'Upload a photo or type a problem to get guided AI explanations.',
        '请输入题目内容，支持数学公式、化学方程式等...\n例如：求解一元二次方程 x² + 2x - 3 = 0': 'Enter a problem. Math formulas and chemistry equations are supported...\nExample: Solve the quadratic equation x² + 2x - 3 = 0',
        '上传图片': 'Upload image',
        '清空': 'Clear',
        '开始解答': 'Solve',
        '处理中...': 'Processing...',
        '正在处理您的请求...': 'Processing your request...',
        '解题成功！': 'Solved successfully.',
        '选择模型': 'Choose model',
        '识别结果': 'Recognized Problem',
        '题目解析': 'Problem Analysis',
        '解题思路': 'Thinking',
        '详细步骤': 'Steps',
        '最终答案': 'Final Answer',
        '知识总结': 'Summary',
        '历史记录': 'History',
        '暂无历史记录': 'No history yet',
        '编辑': 'Edit',
        '题目类型': 'Type',
        '所属学科': 'Subject',
        '知识点': 'Knowledge Points',
        '难度': 'Difficulty',
        '简单': 'Easy',
        '中等': 'Medium',
        '困难': 'Hard',
        '暂未生成解题思路，请重试。': 'No thinking generated yet. Please try again.',
        '暂未生成详细步骤，请重试或简化题目后再次生成。': 'No detailed steps generated yet. Try again or simplify the problem.',
        '暂未生成最终答案，请重试。': 'No final answer generated yet. Please try again.',
        '暂未生成知识总结，请重试。': 'No summary generated yet. Please try again.',
        '课程': 'Courses',
        '按章节展开学习': 'Learn by chapter',
        '准备开始学习': 'Ready to start',
        '将从第一节课直接进入学习界面': 'You will enter the learning view from lesson one.',
        '开始学习': 'Start learning',
        '继续学习': 'Continue',
        '课程详情': 'Course details',
        '讲师': 'Instructor',
        '章节': 'Chapters',
        '课时': 'Lessons',
        'AI 助手': 'AI Tutor',
        '选择一个 AI 工具来处理代码': 'Choose an AI tool to process your code',
        '正在处理中...': 'Processing...',
        '已取消语言转换': 'Language conversion canceled',
        '不支持的目标语言': 'Unsupported target language',
        '目标语言不能与当前语言相同': 'Target language must differ from the current language',
        '处理失败': 'Processing failed',
        '代码不能为空': 'Code cannot be empty',
        '运行成功': 'Run succeeded',
        '运行代码': 'Run code',
        '解释代码': 'Explain code',
        '检查错误': 'Check errors',
        '优化建议': 'Optimization tips',
        '转换语言': 'Convert language',
        '用户名': 'Username',
        '初学者': 'Beginner',
        '这个人很懒，什么都没写...': 'No bio yet.',
        '经验值': 'XP',
        '连续学习': 'Streak',
        '学习时长': 'Study time',
        '连续学习天数': 'Study streak',
        '总学习时长': 'Total study time',
        '每日学习时长': 'Daily study time',
        '学习活动热力图': 'Learning activity heatmap',
        '连续学习排名': 'Streak ranking',
        '读取本项目内置轻量统计数据': 'Reading built-in lightweight analytics',
        '正在读取统计数据...': 'Loading analytics...',
        '读取统计数据失败': 'Failed to load analytics',
        '浏览量 PV': 'Page views',
        '独立访客 UV': 'Unique visitors',
        '自定义事件': 'Events',
        '平均停留': 'Avg. duration',
        '热门页面': 'Top pages',
        '来源渠道': 'Referrers',
        '最近访问': 'Recent visits',
        '用户反馈': 'Feedback',
        '全部状态': 'All statuses',
        '全部类型': 'All categories',
        '刷新': 'Refresh',
        '保存': 'Save',
        '取消': 'Cancel',
        '确认': 'Confirm',
        '关闭': 'Close',
        '删除图片': 'Remove image',
        '图片预览': 'Image preview',
        '后端服务离线，部分功能可能无法使用': 'Backend is offline. Some features may be unavailable.',
        '无法连接到后端服务，请检查网络连接': 'Cannot connect to the backend. Check your network.',
        'AI模型离线，解题功能可能无法使用': 'AI model is offline. Problem solving may be unavailable.',
        '无法检查AI模型状态，请稍后重试': 'Cannot check AI model status. Try again later.',
        '请选择图片文件': 'Please choose an image file.',
        '图片大小不能超过 5MB': 'Image size cannot exceed 5 MB.',
        '正在处理图片...': 'Processing image...',
        '识别失败': 'Recognition failed',
        '解析失败': 'Parsing failed',
        '解答生成失败': 'Solution generation failed',
        '后端服务不可用': 'Backend service unavailable',
        '登录成功！正在跳转...': 'Logged in. Redirecting...',
        '登录失败': 'Login failed',
        '登录失败，请稍后重试': 'Login failed. Try again later.',
        '注册成功！正在登录...': 'Registered. Logging in...',
        '登录或注册以开始使用': 'Log in or register to start',
        '智能学习，从这里开始': 'Start learning intelligently',
        '利用先进的AI技术，为你提供准确、详细的题目解析和解答过程，': 'Use advanced AI to get accurate, detailed problem analysis and solution steps,',
        '帮助你更好地理解知识点，提高学习效率。': 'so you can understand concepts better and learn more efficiently.',
        'AI智能解答': 'AI Answers',
        '已有账号？': 'Already have an account?',
        '立即登录': 'Log in now',
        '没有账号？': 'No account?',
        '立即注册': 'Register now',
    };

    const named = {
        en: {
            'site.name': 'Zenith Intelligence',
            'site.model': 'DeepSeek V4 Flash',
            'nav.solve': 'Problem Solver',
            'nav.courses': 'Courses',
            'nav.programming': 'Programming',
            'nav.stats': 'Stats',
            'nav.profile': 'Profile',
            'status.network': 'Network',
            'status.model': 'Model',
            'status.online': 'Online',
            'status.offline': 'Offline',
            'status.unknown': 'Unknown',
            'status.ready': 'Ready',
            'action.logout': 'Log out',
            'action.login': 'Log in',
            'lang.label': 'Language',
        },
        'zh-CN': {
            'site.name': 'Zenith Intelligence (极智学习)',
            'site.model': 'DeepSeek V4 Flash',
            'nav.solve': '智能解题',
            'nav.courses': '课程中心',
            'nav.programming': '编程助手',
            'nav.stats': '学习统计',
            'nav.profile': '个人中心',
            'status.network': '网络',
            'status.model': '模型',
            'status.online': '在线',
            'status.offline': '离线',
            'status.unknown': '未知',
            'status.ready': '就绪',
            'action.logout': '退出登录',
            'action.login': '登录',
            'lang.label': '语言',
        },
    };

    let applying = false;

    function normalizeLocale(value) {
        return SUPPORTED_LOCALES.includes(value) ? value : DEFAULT_LOCALE;
    }

    function getLocale() {
        return normalizeLocale(localStorage.getItem(LOCALE_KEY) || DEFAULT_LOCALE);
    }

    function translateText(original) {
        if (getLocale() === 'zh-CN') {
            return original;
        }
        return en[original.trim()] || original;
    }

    function preserveWhitespace(original, translated) {
        const leading = original.match(/^\s*/)[0];
        const trailing = original.match(/\s*$/)[0];
        return `${leading}${translated}${trailing}`;
    }

    function shouldSkipElement(element) {
        if (!element) return true;
        return ['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'TEXTAREA'].includes(element.tagName);
    }

    function translateNodeText(node) {
        const parent = node.parentElement;
        if (shouldSkipElement(parent)) return;
        if (parent.closest('[data-i18n]')) return;

        if (!node.__zenithOriginalText) {
            node.__zenithOriginalText = node.nodeValue;
        }

        const original = node.__zenithOriginalText;
        if (!original || !original.trim()) return;

        node.nodeValue = preserveWhitespace(original, translateText(original));
    }

    function translateAttribute(element, attr) {
        const originalAttr = `data-zenith-original-${attr}`;
        if (!element.hasAttribute(attr)) return;
        if (!element.hasAttribute(originalAttr)) {
            element.setAttribute(originalAttr, element.getAttribute(attr) || '');
        }
        const original = element.getAttribute(originalAttr) || '';
        element.setAttribute(attr, translateText(original));
    }

    function apply(root) {
        if (applying) return;
        applying = true;
        const scope = root || document.body;
        document.documentElement.lang = getLocale();

        scope.querySelectorAll('[data-i18n]').forEach((element) => {
            const key = element.getAttribute('data-i18n');
            element.textContent = t(key, element.textContent || '');
        });

        const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) {
            nodes.push(walker.currentNode);
        }
        nodes.forEach(translateNodeText);

        scope.querySelectorAll('[placeholder],[title],[aria-label]').forEach((element) => {
            translateAttribute(element, 'placeholder');
            translateAttribute(element, 'title');
            translateAttribute(element, 'aria-label');
        });

        applying = false;
    }

    function setLocale(locale) {
        localStorage.setItem(LOCALE_KEY, normalizeLocale(locale));
        apply(document.body);
        window.dispatchEvent(new CustomEvent('zenith:localechange', { detail: { locale: getLocale() } }));
    }

    function t(key, fallback) {
        const locale = getLocale();
        return (named[locale] && named[locale][key]) || (named.en && named.en[key]) || fallback || key;
    }

    function init() {
        apply(document.body);
        const observer = new MutationObserver((mutations) => {
            if (applying) return;
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        apply(node);
                    } else if (node.nodeType === Node.TEXT_NODE) {
                        translateNodeText(node);
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.ZenithI18n = {
        key: LOCALE_KEY,
        locales: SUPPORTED_LOCALES,
        getLocale,
        setLocale,
        apply,
        t,
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
