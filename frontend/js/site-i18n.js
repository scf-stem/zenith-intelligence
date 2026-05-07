(function () {
    const LOCALE_KEY = 'zenith_locale';
    const DEFAULT_LOCALE = 'en';
    const SUPPORTED_LOCALES = ['en', 'zh-CN'];

    const en = {
        'Zenith Intelligence (极智学习) - 智能学习，从这里开始': 'Zenith Intelligence - Start learning intelligently',
        'Zenith Intelligence (极智学习) - 智能解题': 'Zenith Intelligence - Problem Solver',
        'Zenith Intelligence (极智学习) - 课程': 'Zenith Intelligence - Courses',
        'Zenith Intelligence (极智学习) - 学习界面': 'Zenith Intelligence - Learning',
        'Zenith Intelligence (极智学习) - 编程助手': 'Zenith Intelligence - Programming',
        'Zenith Intelligence (极智学习) - 个人中心': 'Zenith Intelligence - Profile',
        'Zenith Intelligence (极智学习) - 学习统计': 'Zenith Intelligence - Stats',
        'Zenith Intelligence - 站长统计': 'Zenith Intelligence - Admin Stats',
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
        '利用先进的AI技术，为你提供准确、详细的题目解析和解答过程，\n                    帮助你更好地理解知识点，提高学习效率。': 'Use advanced AI to get accurate, detailed problem analysis and solution steps, so you can understand concepts better and learn more efficiently.',
        'AI智能解答': 'AI Answers',
        '已有账号？': 'Already have an account?',
        '还没有账号？': 'No account yet?',
        '立即登录': 'Log in now',
        '没有账号？': 'No account?',
        '立即注册': 'Register now',
        '欢迎回来': 'Welcome back',
        '拍照或输入题目': 'Upload or type a problem',
        '获取详细解答': 'Get detailed answers',
        '支持多模态问答，图文混合输入': 'Supports multimodal Q&A with mixed image and text input',
        '企业级数据安全，会话端到端加密': 'Enterprise-grade data security with end-to-end session encryption',
        '无限历史记录，知识随时回溯': 'Unlimited history so knowledge is always easy to revisit',
        '✨ 支持多模态问答，图文混合输入': '✨ Supports multimodal Q&A with mixed image and text input',
        '🔒 企业级数据安全，会话端到端加密': '🔒 Enterprise-grade data security with end-to-end session encryption',
        '📚 无限历史记录，知识随时回溯': '📚 Unlimited history so knowledge is always easy to revisit',
        '智能图像识别': 'Smart image recognition',
        '精准题目解析': 'Accurate problem analysis',
        '安全可靠': 'Secure and reliable',
        'SSL安全': 'SSL secure',
        '数据加密': 'Data encrypted',
        '密码': 'Password',
        '记住我': 'Remember me',
        '忘记密码？': 'Forgot password?',
        '请输入用户名': 'Enter username',
        '请输入密码': 'Enter password',
        '登录中...': 'Logging in...',
        '3-20 个字符': '3-20 characters',
        '至少 6 个字符': 'At least 6 characters',
        '密码强度': 'Password strength',
        '至少6个字符': 'At least 6 characters',
        '包含字母': 'Contains letters',
        '确认密码': 'Confirm password',
        '请再次输入密码': 'Enter password again',
        '我已阅读并同意': 'I have read and agree to',
        '和': 'and',
        '《服务条款》': 'Terms of Service',
        '《隐私政策》': 'Privacy Policy',
        '创建账号': 'Create account',
        '注册中...': 'Registering...',
        '密码需至少6位且包含字母': 'Password must be at least 6 characters and include letters',
        '两次输入的密码不一致': 'Passwords do not match',
        '反馈': 'Feedback',
        '提交反馈': 'Submit feedback',
        '告诉我们你遇到的问题或建议': 'Tell us about an issue or suggestion',
        '关闭反馈窗口': 'Close feedback dialog',
        '反馈类型': 'Feedback type',
        '一般反馈': 'General feedback',
        '问题反馈': 'Bug report',
        '功能建议': 'Feature request',
        '账号相关': 'Account',
        '内容建议': 'Content suggestion',
        '反馈内容': 'Feedback',
        '请描述你遇到的问题、建议或想法': 'Describe the issue, suggestion, or idea',
        '联系方式（选填）': 'Contact (optional)',
        '邮箱、手机号或其他联系方式': 'Email, phone, or other contact',
        '提交中...': 'Submitting...',
        '反馈内容至少需要 5 个字符': 'Feedback must be at least 5 characters',
        '提交失败': 'Submission failed',
        '反馈已提交，感谢你的建议': 'Feedback submitted. Thank you.',
        '反馈提交失败，请稍后重试': 'Failed to submit feedback. Try again later.',
        '课程标题': 'Course title',
        '课程概览': 'Course overview',
        '时长': 'Duration',
        '分钟': 'min',
        '你将学到什么': 'What you will learn',
        '课程目录': 'Course outline',
        '课程描述': 'Course description',
        '章节列表将在这里动态生成': 'Chapter list will be generated here',
        '暂无课程': 'No courses yet',
        '暂无描述': 'No description yet',
        '没有符合条件的课程': 'No courses match the filters',
        '精选课程': 'Featured course',
        '编程课程': 'Programming',
        '课程目录整理中，稍后会在这里展示完整章节。': 'The course outline is being prepared. Full chapters will appear here later.',
        '暂无课时': 'No lessons yet',
        '请先登录才能开始学习课程！': 'Please log in before starting a course.',
        '课程内容': 'Course content',
        '代码实验室': 'Code Lab',
        '运行状态': 'Run status',
        '代码运行结果会显示在这里。': 'Code output will appear here.',
        '读取教案中...': 'Loading lesson...',
        '运行中...': 'Running...',
        '正在执行代码...': 'Executing code...',
        '执行成功 (Return Code 0)': 'Execution succeeded (Return Code 0)',
        '(脚本未输出任何内容)': '(The script did not output anything)',
        '执行异常': 'Execution error',
        '运行被拒绝': 'Run rejected',
        '网络错误': 'Network error',
        '无法连接到代码执行沙盒引擎。请确保后端开启。': 'Cannot connect to the code execution sandbox. Make sure the backend is running.',
        '站长统计': 'Admin Stats',
        '统计周期': 'Date range',
        '最近 7 天': 'Last 7 days',
        '最近 30 天': 'Last 30 days',
        '最近 90 天': 'Last 90 days',
        '页面浏览量': 'Page views',
        '页面访问次数': 'Page visits',
        '独立访客数': 'Unique visitors',
        '按匿名访客 ID 去重': 'Deduplicated by anonymous visitor ID',
        '登录、注册、反馈等事件': 'Login, registration, feedback, and other events',
        '页面关闭或跳转时上报': 'Reported when the page closes or navigates',
        '访问趋势': 'Traffic trend',
        '查看哪些页面被访问最多，以及每页的访客和停留情况。': 'See which pages are visited most and each page’s visitors and duration.',
        '用户操作统计': 'User events',
        '统计用户完成的关键操作，例如注册、登录和反馈提交。': 'Track key actions such as registration, login, and feedback submission.',
        '最近访客记录': 'Recent visits',
        '按时间查看最近访问的页面和本次停留时长。': 'Review recent pages and visit duration by time.',
        '反馈状态': 'Feedback status',
        '待处理': 'Open',
        '处理中': 'In review',
        '已解决': 'Resolved',
        '已归档': 'Archived',
        '刷新反馈': 'Refresh feedback',
        '正在读取反馈...': 'Loading feedback...',
        '访问来源': 'Referrer',
        '暂无来源数据': 'No referrer data',
        '暂无页面数据': 'No page data',
        '暂无事件数据': 'No event data',
        '暂无最近访问': 'No recent visits',
        '需要先登录后才能查看反馈。请从首页登录后再打开本页。': 'Log in before viewing feedback. Log in from the home page, then open this page again.',
        '读取反馈失败': 'Failed to load feedback',
        '当前没有符合条件的反馈': 'No feedback matches the filters',
        '更新状态失败': 'Failed to update status',
        '等级排名': 'Level ranking',
        '题目数排名': 'Problems ranking',
        '总用户数': 'Total users',
        '题目数': 'Problems',
        '学习时长(分钟)': 'Study time (min)',
        '题目数量趋势': 'Problem trend',
        '学科分布': 'Subject distribution',
        '难度分布': 'Difficulty distribution',
        '我的排名': 'My ranking',
        '下一级需要': 'Next level needs',
        '总题目数': 'Total problems',
        '正确率': 'Accuracy',
        '当前等级': 'Current level',
        '最近解题记录': 'Recent problem history',
        '成就徽章': 'Achievements',
        '账户设置': 'Account settings',
        '昵称': 'Nickname',
        '个人简介': 'Bio',
        '保存设置': 'Save settings',
        '查看全部': 'View all',
        '暂无成就': 'No achievements yet',
        '暂无最近记录': 'No recent records',
        '总学习天数': 'Total study days',
        '平均正确率': 'Average accuracy',
        '今日学习': 'Today',
        '本周学习': 'This week',
        '正在加载目录...': 'Loading outline...',
        '正在读取核心教案...': 'Loading core lesson...',
        '终端输出 (Output)': 'Terminal output',
        '代码编辑器': 'Code editor',
        '▶ 运行': '▶ Run',
        '▶ 运行代码': '▶ Run code',
        '输出': 'Output',
        '运行代码后，输出将显示在这里...': 'Output will appear here after you run code.',
        '等待执行代码...': 'Waiting to run code...',
        '解释代码': 'Explain code',
        '代码审查': 'Code review',
        '调试代码': 'Debug code',
        '优化代码': 'Optimize code',
        '生成测试': 'Generate tests',
        '语言转换': 'Convert language',
        '# 在这里输入你的代码...\n# 例如：\nprint(\'Hello, World!\')': '# Enter your code here...\n# Example:\nprint(\'Hello, World!\')',
        '页面访问排行': 'Page ranking',
        'Lv.1 初学者': 'Lv.1 Beginner',
        '正确题目': 'Correct problems',
        '我的成就': 'Achievements',
        '最近答题': 'Recent problems',
        '暂无答题记录': 'No problem history yet',
        '个人设置': 'Profile settings',
        '介绍一下自己吧...': 'Introduce yourself...',
        '设置已保存': 'Settings saved',
        '保存失败，请重试': 'Save failed. Please try again.',
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
        translateDocumentTitle();

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

    function translateDocumentTitle() {
        if (!document.__zenithOriginalTitle) {
            document.__zenithOriginalTitle = document.title;
        }
        document.title = translateText(document.__zenithOriginalTitle || document.title);
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
