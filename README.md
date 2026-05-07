# Zenith Intelligence

Zenith Intelligence（极智学习）是一个 AI 学习助手，支持题目输入、图像识别、解题解析、课程学习、编程练习、学习统计、用户反馈和轻量站长统计。

## 核心功能

- 智能解题：支持文字题目和图片输入，调用后端 AI 服务生成解析与答案。
- 学习记录：保存历史题目、课程进度、学习统计和成就数据。
- 用户反馈：`index.html` 和 `app.html` 均提供反馈入口，用户可提交问题、建议、联系方式和所在页面。
- 轻量站长统计：无需 Umami、GA4 或额外服务，前端脚本直接上报到 Flask API，并将数据写入 SQLite。
- 站长看板：`dashboard.html` 可查看 PV、UV、事件、热门页面、来源渠道、最近访问和用户反馈列表。

## 本地运行

### 后端

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
PORT=5001 .venv/bin/python main.py
```

后端默认地址：

```text
http://127.0.0.1:5001
```

健康检查：

```text
http://127.0.0.1:5001/api/health
```

### 前端

```bash
cd frontend
python3 -m http.server 8080
```

常用页面：

```text
首页：http://127.0.0.1:8080/index.html
应用：http://127.0.0.1:8080/app.html
站长统计：http://127.0.0.1:8080/dashboard.html
```

本地静态服务访问时，前端会自动回退到 `http://localhost:5001` 调用后端 API。

## 用户反馈功能

反馈入口位于：

- `frontend/index.html`
- `frontend/app.html`

反馈提交 API：

```text
POST /api/feedback
```

字段：

- `category`：反馈类型，支持 `general`、`bug`、`feature`、`account`、`content`
- `content`：反馈内容，5-2000 字符
- `contact`：联系方式，可选
- `pageUrl`：提交反馈时所在页面

反馈管理 API：

```text
GET /api/feedback
GET /api/feedback/<id>
PATCH /api/feedback/<id>
```

反馈读取和状态更新需要登录 token。站长看板 `dashboard.html` 已集成反馈列表、状态筛选和状态更新。

## 轻量站长统计

统计脚本：

```text
frontend/js/analytics.js
```

采集 API：

```text
POST /api/site-analytics/collect
GET /api/site-analytics/summary
```

采集内容：

- 页面访问 PV
- 独立访客 UV
- 会话 ID
- 页面路径和标题
- 来源 referrer
- 浏览器 User-Agent
- 页面停留时长
- 自定义事件，例如登录、注册、反馈打开、反馈提交、反馈状态更新

数据模型：

- `SiteVisit`
- `SiteEvent`

站长看板：

```text
frontend/dashboard.html
```

看板展示：

- 浏览量 PV
- 独立访客 UV
- 自定义事件数
- 平均停留时长
- 访问趋势
- 来源渠道
- 热门页面
- 事件排行
- 最近访问
- 用户反馈

## Zeabur 部署

项目已适配 Zeabur Dockerfile 部署。Zeabur 会自动识别根目录 `Dockerfile`。

部署时建议配置：

```text
JWT_SECRET=生产环境随机密钥
DEEPSEEK_API_KEY=你的 DeepSeek API Key
DEEPSEEK_API_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
DEFAULT_MODEL_PROVIDER=deepseek
ARK_API_KEY=你的 Ark/Doubao 视觉模型 Key（图片识别需要）
VITE_API_BASE_URL=
```

`PORT` 通常由 Zeabur 自动注入。容器启动时，`docker-entrypoint.sh` 会根据 `PORT` 动态写入 Nginx 监听端口，并生成前端运行时配置 `env.js`。

更多说明见：

```text
ZEABUR.md
```

## 构建与测试

前端构建：

```bash
cd frontend
npm run build
```

后端测试：

```bash
PYTHONPATH=backend backend/.venv/bin/python -m unittest tests.test_deepseek_provider tests.test_feedback tests.test_site_analytics
```

## 数据存储

默认使用 SQLite：

```text
开发环境：backend/data/app.db
生产环境：/data/app.db
```

反馈数据、学习数据、用户账号和站长统计数据都会写入该数据库。Zeabur 生产环境默认使用挂载目录 `/data`，对应数据库文件为 `/data/app.db`。如需使用其他挂载目录，可设置 `ZENITH_DATA_DIR=/your/mount/path`；如需切换到托管数据库，可设置 `DATABASE_URL` 覆盖默认 SQLite。
