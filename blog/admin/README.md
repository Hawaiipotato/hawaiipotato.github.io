# 博客本地发布器

## 快速开始

### 1. 安装依赖

确保你已安装 Node.js（推荘 v16+ 或 v18+ 版本）：

```bash
node --version
```

在项目根目录下运行：

```bash
npm install
```

### 2. 启动服务器

```bash
npm start
```

启动后会显示：
```
✅ 本地发布服务器已启动
🌐 访问地址: http://localhost:3000
📝 发布器页面: http://localhost:3000/admin/index.html
📖 博客首页: http://localhost:3000/blog/index.html
```

### 3. 使用发布器

1. 打开浏览器访问 http://localhost:3000
2. 点击「自动生成」获取下一个可用 ID
3. 填写文章信息（标题、日期、作者、标签、摘要）
4. 编写 Markdown 内容（不需要一级标题）
5. 点击「一键发布」
6. 使用 Git 提交更改

## 文件结构

发布后的文件会自动保存到：

- Markdown 文件: `blog/posts/[中文标题].md`
- 文章元数据: `data/posts.json`

## API 接口

### 检查服务器状态
```
GET /api/health
```

### 获取文章列表
```
GET /api/posts
```

### 发布/更新文章
```
POST /api/posts
Content-Type: application/json

{
  "id": "4",
  "file": "wo-de-di-yi-pian-wen-zhang.md",
  "title": "我的第一篇文章",
  "date": "2026-02-11",
  "author": "Potato",
  "tags": ["随笔", "博客"],
  "summary": "文章摘要...",
  "content": "Markdown 内容..."
}
```

### 删除文章
```
DELETE /api/posts/:id
```

## 注意事项

1. **一键发布**需要服务器运行中，否则会显示连接失败提示
2. 如果 ID 已存在，会更新该文章而不是创建新文章
3. Markdown 文件名基于中文标题自动生成拼音风格的文件名
4. 文章列表会自动按日期排序（最新的在前面）

## 停止服务器

按 `Ctrl+C` 终止服务器。

## 隐私说明

此服务器仅在本地运行，不会将任何数据发送到互联网。文件直接写入你的本地项目目录。
