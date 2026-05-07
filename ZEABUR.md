# Zeabur 部署说明

本项目已适配 Zeabur Dockerfile 部署。Zeabur 会自动识别根目录 `Dockerfile`，构建前端静态资源，并在同一容器内用 Nginx 代理 Flask API。

## 部署方式

1. 在 Zeabur 新建服务，选择 GitHub 仓库。
2. 部署类型选择 Dockerfile 自动识别。
3. 设置环境变量：
   - `JWT_SECRET`：生产环境必须改成长随机字符串。
   - `DEEPSEEK_API_KEY`：默认文本模型密钥，用于题目解析、解题和编程助手。
   - `DEEPSEEK_API_URL`：默认 `https://api.deepseek.com`。
   - `DEEPSEEK_MODEL`：默认 `deepseek-v4-flash`。
   - `DEFAULT_MODEL_PROVIDER`：默认 `deepseek`。
   - `ARK_API_KEY`：图片识别需要；纯文本解题不需要。
   - `ZENITH_DATA_DIR`：SQLite 数据目录，Zeabur 挂载盘为 `/data` 时可设置为 `/data`；不设置时生产环境也默认使用 `/data`。
   - `DATABASE_URL`：可选；设置后会覆盖默认 SQLite，例如 `sqlite:////data/app.db` 或 PostgreSQL 连接串。
   - `PORT`：Zeabur 会自动注入；不需要手动设置时默认 `8080`。
   - `VITE_API_BASE_URL`：通常留空，前端会同源访问 `/api`。

## 运行机制

- `docker-entrypoint.sh` 会在容器启动时生成 `/usr/share/nginx/html/env.js`，用于前端读取运行时配置。
- 同一个脚本会把 Zeabur 注入的 `PORT` 写入 Nginx 配置，确保 Nginx 监听平台指定端口。
- Flask 由 Gunicorn 监听容器内部 `127.0.0.1:3000`，Nginx 将 `/api/*` 代理到 Gunicorn。

## 数据说明

当前用户账号、学习数据、反馈数据和站长统计数据默认写入 SQLite。开发环境路径为 `backend/data/app.db`，生产环境路径为 `/data/app.db`，与 Zeabur 持久硬盘挂载目录一致。

如果 Zeabur 已挂载硬盘到 `/data`，无需额外设置也会写入：

```text
/data/app.db
```

建议显式添加环境变量，便于后续排查：

```text
ZENITH_DATA_DIR=/data
```

如果需要完整覆盖数据库连接，也可以设置：

```text
DATABASE_URL=sqlite:////data/app.db
```

注意：`DATABASE_URL` 优先级高于 `ZENITH_DATA_DIR`。如果使用 PostgreSQL，则直接将 `DATABASE_URL` 设置为 PostgreSQL 连接串。
