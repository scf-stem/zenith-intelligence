/**
 * AI Learning Assistant - Learning Workspace Logic
 * Handles the dual-pane UI: Markdown reading on left, Code Playground on right.
 */

const LearningApp = {
    courseId: null,
    currentCourse: null,
    currentLessonId: null,
    editor: null,
    cacheKey: 'ai_learning_current_course',
    usesCachedCourse: false,
    isInitialized: false,

    locale() {
        return window.ZenithI18n ? window.ZenithI18n.getLocale() : (localStorage.getItem('zenith_locale') || 'en');
    },

    isEnglish() {
        return this.locale() === 'en';
    },

    apiWithLocale(path) {
        const separator = path.includes('?') ? '&' : '?';
        return `${path}${separator}locale=${encodeURIComponent(this.locale())}`;
    },

    text(en, zh) {
        return this.isEnglish() ? en : zh;
    },

    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        // Parse courseId from URL query string
        const urlParams = new URLSearchParams(window.location.search);
        this.courseId = urlParams.get('course_id');

        if (!this.courseId) {
            alert(this.text('Failed to load course information. Please go back and try again.', '获取课程信息失败，请返回重试！'));
            window.location.href = 'courses.html';
            return;
        }

        this.initEditor();
        this.bindEvents();
        this.loadCourseData();
    },

    initEditor() {
        const textarea = document.getElementById('code-editor');
        if (!textarea) return;

        if (typeof CodeMirror === 'undefined') {
            textarea.style.display = 'block';
            textarea.style.width = '100%';
            textarea.style.height = '100%';
            textarea.style.minHeight = '260px';
            textarea.style.padding = '16px';
            textarea.style.border = '0';
            textarea.style.resize = 'none';
            textarea.style.background = '#282a36';
            textarea.style.color = '#f8f8f2';
            textarea.style.fontFamily = 'Menlo, Monaco, Consolas, monospace';
            textarea.value = textarea.value || 'print("Hello Playground!")';
            this.editor = {
                getValue: () => textarea.value,
                setValue: (value) => {
                    textarea.value = value;
                },
                setOption: () => {}
            };
            return;
        }

        this.editor = CodeMirror.fromTextArea(textarea, {
            mode: 'python',
            theme: 'dracula',
            lineNumbers: true,
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: false,
            lineWrapping: true,
            matchBrackets: true,
            autoCloseBrackets: true
        });
    },

    bindEvents() {
        const runBtn = document.getElementById('run-code-btn');
        if (runBtn) {
            runBtn.addEventListener('click', () => {
                this.executeCode();
            });
        }
    },

    cacheCurrentCourse() {
        if (!this.currentCourse) return;

        try {
            sessionStorage.setItem(this.cacheKey, JSON.stringify({
                courseId: this.currentCourse.id,
                cachedAt: Date.now(),
                course: this.currentCourse
            }));
        } catch (error) {
            console.warn('缓存课程信息失败:', error);
        }
    },

    getCachedCourse() {
        try {
            const raw = sessionStorage.getItem(this.cacheKey);
            if (!raw) return null;

            const payload = JSON.parse(raw);
            const cachedCourse = payload?.course;
            const cachedCourseId = payload?.courseId ?? cachedCourse?.id;

            if (!cachedCourse || String(cachedCourseId) !== String(this.courseId)) {
                return null;
            }

            return cachedCourse;
        } catch (error) {
            console.warn('读取课程缓存失败:', error);
            return null;
        }
    },

    renderLoadError(message) {
        document.getElementById('lesson-content').innerHTML = `
            <div class="loader" style="color: red;">
                <p>${message}</p>
                <p><a href="courses.html" style="color: inherit;">${this.text('Back to courses', '返回课程中心')}</a></p>
            </div>`;
    },

    openFirstLesson() {
        if (this.currentCourse?.chapters?.length > 0) {
            const firstChapter = this.currentCourse.chapters[0];
            if (firstChapter.lessons?.length > 0) {
                this.loadLesson(firstChapter.lessons[0].id);
                return true;
            }
        }

        document.getElementById('lesson-content').innerHTML = `
            <div class="loader">
                 <p>${this.text('No lesson content is available for this course yet.', '课程暂时没有上架课时内容。')}</p>
            </div>`;
        return false;
    },

    loadCachedCourseData(message) {
        const cachedCourse = this.getCachedCourse();
        if (!cachedCourse) {
            return false;
        }

        this.currentCourse = cachedCourse;
        this.usesCachedCourse = true;
        this.renderNavigation();
        this.openFirstLesson();
        console.warn(message);
        return true;
    },

    getLocalCourseById(courseId) {
        const id = parseInt(courseId, 10);
        const isEn = this.isEnglish();
        const makeChapters = (items, startId = 1) => items.map((item, index) => ({
            id: startId + index,
            name: item.name,
            description: item.description,
            lessons: [{
                id: startId + index,
                name: item.name,
                description: item.description,
                duration: item.duration || 35,
                docFile: item.docFile
            }]
        }));

        const courses = [
            {
                id: 1,
                name: isEn ? 'Python Programming Basics' : 'Python 基础编程',
                description: isEn
                    ? 'Learn Python from scratch, including variables, data types, control flow, functions, object-oriented programming, and exception handling.'
                    : '从零开始学习 Python 编程语言，掌握变量、数据类型、控制流、函数、面向对象编程和异常处理等核心概念。',
                subject: 'programming',
                chapters: makeChapters([
                    { name: isEn ? 'Python Basics' : 'Python 基础', description: isEn ? 'Variables, data types, input/output, operators, and type conversion.' : '变量、数据类型、输入输出、运算符、类型转换', docFile: '01_python_basics.md' },
                    { name: isEn ? 'Conditions and Loops' : '条件分支与循环', description: isEn ? 'if/elif/else, for loops, while loops, break, and continue.' : 'if/elif/else、for 循环、while 循环、break/continue', docFile: '02_conditions_loops.md' },
                    { name: isEn ? 'Functions and Methods' : '函数与方法', description: isEn ? 'Function definitions, parameters, return values, scope, built-ins, and lambda expressions.' : '函数定义、参数类型、返回值、作用域、内置函数、lambda 表达式', docFile: '03_functions_methods.md' },
                    { name: isEn ? 'Lists and Dictionaries' : '列表与字典', description: isEn ? 'List operations, dictionary operations, slicing, comprehensions, and common methods.' : '列表操作、字典操作、切片、推导式、常用方法', docFile: '04_list_dict.md' },
                    { name: isEn ? 'Classes and Objects' : '类与对象', description: isEn ? 'Class definitions, constructors, attributes, and methods.' : '类定义、构造函数、实例属性、类属性、实例方法', docFile: '05_class_object.md' },
                    { name: isEn ? 'Object-Oriented Programming' : '面向对象编程', description: isEn ? 'Encapsulation, inheritance, polymorphism, super(), and magic methods.' : '封装、继承、多态、super()、魔术方法', docFile: '06_oop.md' },
                    { name: isEn ? 'Exception Handling' : '异常处理', description: isEn ? 'try/except/finally, raise, custom exceptions, and assertions.' : 'try/except/finally、raise、自定义异常、断言', docFile: '07_exception.md' }
                ])
            },
            {
                id: 2,
                name: isEn ? 'C Programming Basics' : 'C 语言基础',
                description: isEn
                    ? 'Learn core C concepts, including data types, control structures, functions, arrays, and pointers.'
                    : '系统学习 C 语言的核心概念：数据类型、控制结构、函数、数组和指针。',
                subject: 'programming',
                chapters: makeChapters([
                    { name: isEn ? 'Getting Started with C' : 'C 语言入门', description: isEn ? 'C history, Hello World, and the compile-run workflow.' : '了解 C 语言的历史与特点，编写第一个 Hello World 程序，理解编译流程', docFile: '01_c_intro.md' },
                    { name: isEn ? 'Data Types and Variables' : '数据类型与变量', description: isEn ? 'Basic C data types, declarations, initialization, scanf, and printf.' : '基本数据类型、变量声明与初始化、scanf 和 printf 的使用', docFile: '02_data_types.md' },
                    { name: isEn ? 'Operators and Expressions' : '运算符与表达式', description: isEn ? 'Arithmetic, relational, logical, assignment, and bitwise operators.' : '算术、关系、逻辑和位运算符的使用', docFile: '03_operators.md' },
                    { name: isEn ? 'Conditional Statements' : '条件语句', description: isEn ? 'if/else decisions and switch/case control flow.' : 'if-else 条件判断、switch-case 多分支选择结构', docFile: '04_conditions.md' },
                    { name: isEn ? 'Loops' : '循环结构', description: isEn ? 'for, while, do-while, break, and continue.' : 'for 循环、while 循环、do-while 循环、break 和 continue', docFile: '05_loops.md' },
                    { name: isEn ? 'Arrays' : '数组', description: isEn ? 'One-dimensional arrays, two-dimensional arrays, character arrays, and strings.' : '一维数组、二维数组、字符数组和字符串', docFile: '06_arrays.md' },
                    { name: isEn ? 'Functions' : '函数', description: isEn ? 'Function definitions, calls, arguments, return values, recursion, and scope.' : '函数定义与调用、参数、返回值、递归和作用域', docFile: '07_functions.md' },
                    { name: isEn ? 'Pointer Basics' : '指针基础', description: isEn ? 'Addresses, pointer declarations, dereferencing, arrays, and functions.' : '内存地址、指针声明、解引用、指针与数组和函数', docFile: '08_pointers.md' }
                ], 101)
            },
            {
                id: 3,
                name: isEn ? 'Vibe Coding for Beginners' : 'Vibe 编程入门',
                description: isEn
                    ? 'Build games, tools, and websites with AI by describing what you want clearly.'
                    : '不需要记代码，学会用 AI 做出游戏、工具和网站。',
                subject: 'programming',
                chapters: makeChapters([
                    { name: isEn ? 'AI Is Your Super Teammate' : 'AI 是你的超级队友', description: isEn ? 'Understand AI, Vibe Coding, and the strengths and limits of AI tools.' : '认识 AI，了解 Vibe Coding 理念，体验 AI 的能力和局限', docFile: '01_vibe_intro.md' },
                    { name: isEn ? 'Learn to Talk to AI' : '学会跟 AI 说话', description: isEn ? 'Use prompt techniques to express needs clearly.' : '掌握 Prompt 技巧，学会清晰表达需求', docFile: '02_vibe_prompt.md' },
                    { name: isEn ? 'Build a Snake Game' : '做一个贪吃蛇游戏', description: isEn ? 'Generate your first playable game with AI.' : '用 AI 生成第一个可玩的游戏', docFile: '03_vibe_snake.md' },
                    { name: isEn ? 'Build Your Own Small Tool' : '做一个属于你的小工具', description: isEn ? 'Create practical tools such as a Pomodoro timer or flashcards.' : '用 AI 做实用小工具，如番茄钟、单词卡片等', docFile: '04_vibe_tools.md' },
                    { name: isEn ? 'Publish Your Work' : '让全世界看到你的作品', description: isEn ? 'Deploy your project online and share it.' : '学习如何把作品发布到网上', docFile: '05_vibe_website.md' },
                    { name: isEn ? 'When AI Gets It Wrong' : '当 AI 出错了怎么办', description: isEn ? 'Learn debugging tactics and how to ask AI for targeted fixes.' : '学习调试技巧，掌握错误排查方法', docFile: '06_vibe_debug.md' },
                    { name: isEn ? 'Free Creation Time' : '自由创作时间', description: isEn ? 'Plan and build a creative project.' : '综合运用所学，独立完成一个创意项目', docFile: '07_vibe_final.md' },
                    { name: isEn ? 'Showcase and Wrap-up' : '成果展示与总结', description: isEn ? 'Present your work and review what you learned.' : '展示作品、互相点评、回顾学习成果', docFile: '08_vibe_showcase.md' }
                ], 201)
            }
        ];

        return courses.find(course => course.id === id) || null;
    },

    async readLocalLessonMarkdown(lesson) {
        if (!lesson?.docFile) {
            return '';
        }

        const path = `Docs/${this.isEnglish() ? 'en/' : ''}${lesson.docFile}`;
        try {
            const response = await fetch(path, { cache: 'force-cache' });
            if (!response.ok) return '';
            const text = await response.text();
            if (/^\s*<!doctype html/i.test(text) || /^\s*<html[\s>]/i.test(text)) {
                return '';
            }
            return text;
        } catch (error) {
            console.warn('读取本地 Markdown 失败:', error);
            return '';
        }
    },

    async getLocalLessonPayload(lessonId, reason = '') {
        const targetLessonId = parseInt(lessonId, 10);

        if (!this.currentCourse?.chapters?.length) {
            return null;
        }

        for (const chapter of this.currentCourse.chapters) {
            const lesson = (chapter.lessons || []).find(item => parseInt(item.id, 10) === targetLessonId);
            if (lesson) {
                const notice = reason || (this.usesCachedCourse
                    ? this.text('Local preview mode: server lesson content has not synced yet.', '当前为本地预览模式，服务器课程内容暂未同步。')
                    : this.text('Server lesson content is unavailable. Showing local preview.', '服务器课时内容暂不可用，已切换到本地预览。'));
                const localMarkdown = await this.readLocalLessonMarkdown(lesson);

                const content = [
                    `> ${notice}`,
                    '',
                    localMarkdown || [
                        `## ${this.text('Course', '课程')}：${this.currentCourse.name}`,
                        `## ${this.text('Chapter', '章节')}：${chapter.name}`,
                        '',
                        `${lesson.description || chapter.description || this.currentCourse.description || this.text('Course content is being prepared.', '课程内容准备中。')}`,
                        '',
                        `### ${this.text('Current learning suggestions', '当前学习建议')}`,
                        `- ${this.text('Read the chapter list on the left and learn in order.', '先阅读左侧章节目录，按顺序完成学习。')}`,
                        `- ${this.text('If the code lab is available, run the sample code directly.', '如右侧代码实验室已开启，可直接运行示例代码。')}`,
                        `- ${this.text('Sync the server course seed data to get the full lesson plan.', '若需要完整教案内容，请补齐后端课程种子数据。')}`
                    ].join('\n')
                ].join('\n');

                return {
                    ...lesson,
                    content
                };
            }
        }

        return null;
    },

    async renderCachedLesson(lessonId, reason = '') {
        const lesson = await this.getLocalLessonPayload(lessonId, reason);
        if (!lesson) {
            return false;
        }

        this.renderLessonContent(lesson);
        return true;
    },

    hasRichMarkdownRenderer() {
        return typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined';
    },

    sanitizeRenderedHtml(html) {
        if (!this.hasRichMarkdownRenderer()) {
            return html;
        }

        return DOMPurify.sanitize(html, {
            USE_PROFILES: { html: true }
        });
    },

    renderMarkdown(text) {
        const source = String(text ?? '').replace(/\r\n?/g, '\n').trim();
        if (!source) {
            return '';
        }

        if (typeof marked === 'undefined') {
            return this.renderSimpleMarkdown(source);
        }

        marked.setOptions({
            gfm: true,
            breaks: true,
            langPrefix: 'hljs language-',
            highlight(code, lang) {
                if (typeof hljs === 'undefined') return code;
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            }
        });

        return this.sanitizeRenderedHtml(marked.parse(source));
    },

    escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    renderInlineMarkdown(value) {
        return this.escapeHtml(value)
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    },

    renderSimpleMarkdown(source) {
        const lines = source.split('\n');
        let html = '';
        let inCode = false;
        let listOpen = false;

        const closeList = () => {
            if (listOpen) {
                html += '</ul>';
                listOpen = false;
            }
        };

        lines.forEach((line) => {
            if (line.startsWith('```')) {
                closeList();
                if (inCode) {
                    html += '</code></pre>';
                    inCode = false;
                } else {
                    html += '<pre><code>';
                    inCode = true;
                }
                return;
            }

            if (inCode) {
                html += `${this.escapeHtml(line)}\n`;
                return;
            }

            if (!line.trim()) {
                closeList();
                return;
            }

            const heading = line.match(/^(#{1,3})\s+(.+)$/);
            if (heading) {
                closeList();
                const level = heading[1].length;
                html += `<h${level}>${this.renderInlineMarkdown(heading[2])}</h${level}>`;
                return;
            }

            const listItem = line.match(/^[-*]\s+(.+)$/);
            if (listItem) {
                if (!listOpen) {
                    html += '<ul>';
                    listOpen = true;
                }
                html += `<li>${this.renderInlineMarkdown(listItem[1])}</li>`;
                return;
            }

            if (line.startsWith('>')) {
                closeList();
                html += `<blockquote>${this.renderInlineMarkdown(line.replace(/^>\s?/, ''))}</blockquote>`;
                return;
            }

            closeList();
            html += `<p>${this.renderInlineMarkdown(line)}</p>`;
        });

        closeList();
        if (inCode) {
            html += '</code></pre>';
        }
        return html;
    },

    buildLessonHtml(lesson) {
        const rawMarkdown = String(lesson.content || '').trim();
        const hasMarkdownTitle = /^#\s+.+/m.test(rawMarkdown);

        if (rawMarkdown) {
            const markdownHtml = this.renderMarkdown(rawMarkdown);
            return hasMarkdownTitle
                ? `<article class="markdown-content">${markdownHtml}</article>`
                : `<article class="markdown-content"><h1>${lesson.name}</h1>${markdownHtml}</article>`;
        }

        if (lesson.content_html) {
            const html = this.sanitizeRenderedHtml(lesson.content_html);
            const hasHtmlTitle = /<h1[\s>]/i.test(html);
            return hasHtmlTitle
                ? `<article class="markdown-content">${html}</article>`
                : `<article class="markdown-content"><h1>${lesson.name}</h1>${html}</article>`;
        }

        return `<article class="markdown-content"><h1>${lesson.name}</h1><p>${this.text('This lesson has no content yet.', '该课时暂无内容。')}</p></article>`;
    },

    async loadCourseData() {
        const localCourse = this.getLocalCourseById(this.courseId);
        if (localCourse) {
            this.currentCourse = localCourse;
            this.usesCachedCourse = true;
            this.cacheCurrentCourse();
            this.renderNavigation();
            this.openFirstLesson();
            this.refreshCourseDataFromServer();
            return;
        }

        try {
            const response = await UserManager.fetchApi(this.apiWithLocale(`/api/course/${this.courseId}`));
            if (response.status === 404) {
                if (this.loadCachedCourseData(this.text('Course not found on the server. Switched to local preview mode.', '服务器中未找到该课程，已切换到本地预览模式。'))) {
                    return;
                }

                this.renderLoadError(this.text('This course is not synced to the server yet. Please return to Courses and try again.', '该课程当前未同步到服务器，请返回课程中心重试。'));
                return;
            }

            const result = await response.json();
            if (result.success) {
                this.currentCourse = result.data;
                this.usesCachedCourse = false;
                this.cacheCurrentCourse();
                this.renderNavigation();
                this.openFirstLesson();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('加载课程数据失败:', error);
            if (this.loadCachedCourseData(this.text('Network error. Switched to local preview mode.', '网络异常，已切换到本地预览模式。'))) {
                return;
            }

            this.renderLoadError(this.text('Network error. Unable to load the course outline. Check that the service is running.', '网络错误，无法加载课程大纲。请检查服务运行状态。'));
        }
    },

    async refreshCourseDataFromServer() {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500);
        try {
            const response = await UserManager.fetchApi(this.apiWithLocale(`/api/course/${this.courseId}`), {
                signal: controller.signal
            });

            if (!response.ok) return;
            const result = await response.json();
            if (!result.success || !result.data?.chapters?.length) return;

            this.currentCourse = result.data;
            this.usesCachedCourse = false;
            this.cacheCurrentCourse();
            this.renderNavigation();
        } catch (error) {
            console.info('服务器课程数据暂不可用，继续使用本地课程内容。');
        } finally {
            clearTimeout(timeout);
        }
    },

    renderNavigation() {
        document.getElementById('top-course-title').textContent = this.currentCourse.name;

        const dirHtml = this.currentCourse.chapters.map((chapter, index) => {
            const lessonsHtml = (chapter.lessons || []).map(lesson => `
                <div class="menu-lesson" data-lesson-id="${lesson.id}" onclick="LearningApp.loadLesson(${lesson.id})">
                    ${lesson.name}
                </div>
            `).join('');

            return `
                <div class="menu-chapter-group">
                    <div class="menu-chapter">${this.text(`Chapter ${index + 1}:`, `第${index + 1}章:`)} ${chapter.name}</div>
                    <div class="menu-lessons-list">${lessonsHtml}</div>
                </div>
            `;
        }).join('');

        document.getElementById('course-directory').innerHTML = dirHtml;
    },

    async loadLesson(lessonId) {
        this.currentLessonId = lessonId;

        // Highlight active menu item
        document.querySelectorAll('.menu-lesson').forEach(el => {
            el.classList.remove('active');
            if (parseInt(el.dataset.lessonId) === lessonId) {
                el.classList.add('active');
            }
        });

        const mainContent = document.getElementById('lesson-content');
        mainContent.innerHTML = `
            <div class="loader">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="15" stroke-dashoffset="15" class="animate-spin" style="margin-bottom: 15px; animation: spin 2s linear infinite;">
                    <circle cx="12" cy="12" r="10" />
                </svg>
                <p>${this.text('Loading lesson...', '读取教案中...')}</p>
            </div>`;

        if (this.usesCachedCourse) {
            if (await this.renderCachedLesson(lessonId, this.text('Local course content loaded instantly. Server sync is running in the background.', '已即时加载本地课程内容，服务器同步正在后台进行。'))) {
                this.refreshLessonDataFromServer(lessonId);
                return;
            }
        }

        try {
            const response = await UserManager.fetchApi(this.apiWithLocale(`/api/course/lesson/${lessonId}`));
            if (response.status === 404) {
                if (await this.renderCachedLesson(lessonId, this.text('This lesson is not synced to the server yet. Showing local preview.', '当前课时内容尚未同步到服务器，已展示本地预览。'))) {
                    return;
                }

                mainContent.innerHTML = `<p style="color:red; padding: 20px;">${this.text('Failed to load lesson: content does not exist.', '读取课时失败：课程内容不存在。')}</p>`;
                return;
            }

            const result = await response.json();

            if (result.success) {
                this.renderLessonContent(result.data);
            } else if (await this.renderCachedLesson(lessonId, this.text(`Failed to load lesson: ${result.error || 'server returned an error'}. Showing local preview.`, `读取课时失败：${result.error || '服务器返回异常'}，已展示本地预览。`))) {
                return;
            } else {
                mainContent.innerHTML = `<p style="color:red; padding: 20px;">${this.text('Failed to load lesson', '读取课时失败')}: ${result.error}</p>`;
            }
        } catch (error) {
            console.error('加载课时内容失败:', error);
            if (await this.renderCachedLesson(lessonId, this.text('Network error. Showing local preview content.', '网络异常，已展示本地预览内容。'))) {
                return;
            }

            mainContent.innerHTML = `<p style="color:red; padding: 20px;">${this.text('An error occurred. Please try again later.', '发生错误，请稍后重试。')}</p>`;
        }
    },

    async refreshLessonDataFromServer(lessonId) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500);
        try {
            const response = await UserManager.fetchApi(this.apiWithLocale(`/api/course/lesson/${lessonId}`), {
                signal: controller.signal
            });
            if (!response.ok || this.currentLessonId !== lessonId) return;

            const result = await response.json();
            const hasLessonContent = result.data?.name || result.data?.content || result.data?.content_html;
            if (result.success && hasLessonContent && this.currentLessonId === lessonId) {
                this.usesCachedCourse = false;
                this.renderLessonContent(result.data);
            }
        } catch (error) {
            console.info('服务器课时数据暂不可用，继续使用本地教案。');
        } finally {
            clearTimeout(timeout);
        }
    },

    renderLessonContent(lesson) {
        const mainContent = document.getElementById('lesson-content');
        mainContent.innerHTML = this.buildLessonHtml(lesson);

        // Display code playground if course is a programming language course
        const subject = this.currentCourse.subject;
        const codePlayground = document.getElementById('code-playground');

        if (subject === 'programming' || this.currentCourse.name.includes('Python') || this.currentCourse.name.includes('C ')) {
            codePlayground.style.display = 'flex';

            // Set mode
            if (this.currentCourse.name.includes('C ')) {
                this.editor.setOption('mode', 'text/x-csrc');
                if (!this.editor.getValue()) {
                    this.editor.setValue('#include <stdio.h>\n\nint main() {\n    printf("Hello World!");\n    return 0;\n}');
                }
            } else {
                this.editor.setOption('mode', 'python');
                if (!this.editor.getValue()) {
                    this.editor.setValue('print("Hello Playground!")');
                }
            }
        } else {
            codePlayground.style.display = 'none';
        }
    },

    async executeCode() {
        if (!this.editor) return;

        const code = this.editor.getValue().trim();
        if (!code) return;

        const btn = document.getElementById('run-code-btn');
        const consoleOutput = document.getElementById('console-output');
        const statusEl = document.getElementById('run-status');

        btn.disabled = true;
        btn.textContent = this.text('Running...', '运行中...');
        consoleOutput.innerHTML = '';
        consoleOutput.classList.remove('error');

        statusEl.textContent = this.text('Executing code...', '正在执行代码...');
        statusEl.style.color = '#FFA500';
        statusEl.style.display = 'block';

        const runLanguage = this.currentCourse.name.includes('C ') ? 'c' : 'python';

        if (runLanguage === 'c') {
            // C execution is now allowed
        }

        try {
            const response = await UserManager.fetchApi('/api/programming/execute', {
                method: 'POST',
                body: JSON.stringify({ code: code, language: runLanguage })
            });

            const result = await response.json();

            if (result.success) {
                // Return Code Handling
                if (result.data.returnCode === 0) {
                    statusEl.textContent = this.text('Execution succeeded (Return Code 0)', '执行成功 (Return Code 0)');
                    statusEl.style.color = '#4CAF50';
                    consoleOutput.textContent = result.data.stdout || this.text('(The script did not output anything)', '(脚本未输出任何内容)');
                } else {
                    statusEl.textContent = this.text('Execution error', '执行异常');
                    statusEl.style.color = '#f44336';
                    consoleOutput.classList.add('error');
                    consoleOutput.textContent = result.data.stderr || result.data.stdout || this.text('Unknown internal error during execution', '执行中发生未知内部错误');
                }
            } else {
                statusEl.textContent = this.text('Run rejected', '运行被拒绝');
                statusEl.style.color = '#f44336';
                consoleOutput.classList.add('error');
                consoleOutput.textContent = result.error || 'Server Side Execution Exception';
            }
        } catch (error) {
            console.error('执行代码失败:', error);
            statusEl.textContent = this.text('Network error', '网络错误');
            statusEl.style.color = '#f44336';
            consoleOutput.classList.add('error');
            consoleOutput.textContent = this.text('Cannot connect to the code execution sandbox. Make sure the backend is running.', '无法连接到代码执行沙盒引擎。请确保后端开启。');
        } finally {
            btn.disabled = false;
            btn.textContent = this.text('▶ Run code', '▶ 运行代码');
        }
    }
};

if (document.getElementById('lesson-content')) {
    LearningApp.init();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        LearningApp.init();
    });
}
