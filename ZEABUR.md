# Zeabur 部署说明

本项目已适配 Zeabur Dockerfile 部署。Zeabur 会自动识别根目录 `Dockerfile`，构建前端静态资源，并在同一容器内用 Nginx 代理 Flask API。

## 部署方式

1. 在 Zeabur 新建服务，选择 GitHub 仓库。
2. 部署类型选择 Dockerfile 自动识别。
3. 设置环境变量：
   - `JWT_SECRET`：生产环境必须改成长随机字符串。
   - `CHATGLM_API_KEY` 或其他模型服务密钥。
   - `DEFAULT_MODEL_PROVIDER`：默认 `minimax`。
   - `PORT`：Zeabur 会自动注入；不需要手动设置时默认 `8080`。
   - `VITE_API_BASE_URL`：通常留空，前端会同源访问 `/api`。

## 运行机制

- `docker-entrypoint.sh` 会在容器启动时生成 `/usr/share/nginx/html/env.js`，用于前端读取运行时配置。
- 同一个脚本会把 Zeabur 注入的 `PORT` 写入 Nginx 配置，确保 Nginx 监听平台指定端口。
- Flask 由 Gunicorn 监听容器内部 `127.0.0.1:3000`，Nginx 将 `/api/*` 代理到 Gunicorn。

## 数据说明

当前学习数据、反馈数据和站长统计数据默认写入 SQLite：`backend/data/app.db`。如果 Zeabur 服务没有持久化存储，重新部署或重建容器可能导致 SQLite 数据丢失。生产环境建议在 Zeabur 配置持久化卷，或后续切换到托管数据库。
