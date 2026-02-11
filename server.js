/**
 * 本地发布服务器
 * 用于本地写入 Markdown 文件和更新 posts.json
 * 
 * 启动方式: node server.js
 * 默认端口: 3000
 * 访问: http://localhost:3000
 */

const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const cors = require('cors');
const app = express();

// 配置
const PORT = 3000;
const PROJECT_ROOT = __dirname; // 项目根目录（当前文件所在位置）
const POSTS_DIR = path.join(PROJECT_ROOT, 'blog', 'posts');
const POSTS_JSON_PATH = path.join(PROJECT_ROOT, 'data', 'posts.json');

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use(express.static(PROJECT_ROOT));
app.use('/admin', express.static(path.join(PROJECT_ROOT, 'blog', 'admin')));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    projectRoot: PROJECT_ROOT 
  });
});

// 获取文章列表
app.get('/api/posts', async (req, res) => {
  try {
    const data = await fs.readJson(POSTS_JSON_PATH);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '读取文章列表失败', message: error.message });
  }
});

// 发布新文章
app.post('/api/posts', async (req, res) => {
  try {
    const { id, file, title, date, author, tags, summary, content } = req.body;

    // 验证必填字段
    if (!id || !title || !date || !author || !content) {
      return res.status(400).json({ 
        error: '缺少必填字段',
        required: ['id', 'title', 'date', 'author', 'content']
      });
    }

    // 确保文件名有 .md 后缀
    const mdFilename = file.endsWith('.md') ? file : `${file}.md`;
    const mdFilePath = path.join(POSTS_DIR, mdFilename);

    // 检查文件是否已存在
    const fileExists = await fs.pathExists(mdFilePath);
    
    // 读取并更新 posts.json
    const postsData = await fs.readJson(POSTS_JSON_PATH);
    
    // 检查 ID 是否已存在
    const existingIndex = postsData.posts.findIndex(p => p.id === id);
    
    const postEntry = {
      id,
      file: mdFilename,
      title,
      date,
      author,
      tags: tags || [],
      summary: summary || ''
    };

    if (existingIndex >= 0) {
      // 更新现有文章
      postsData.posts[existingIndex] = postEntry;
      console.log(`更新文章: ${id}`);
    } else {
      // 添加新文章
      postsData.posts.push(postEntry);
      console.log(`新增文章: ${id}`);
    }

    // 按日期排序（最新的在前面）
    postsData.posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 写入 Markdown 文件
    await fs.writeFile(mdFilePath, content, 'utf8');
    console.log(`写入文件: ${mdFilePath}`);

    // 写入 posts.json
    await fs.writeJson(POSTS_JSON_PATH, postsData, { spaces: 2 });
    console.log(`更新: ${POSTS_JSON_PATH}`);

    res.json({
      success: true,
      message: fileExists ? '文章已更新' : '文章发布成功',
      post: postEntry,
      filePath: mdFilePath
    });

  } catch (error) {
    console.error('发布失败:', error);
    res.status(500).json({ 
      error: '发布失败', 
      message: error.message,
      stack: error.stack 
    });
  }
});

// 删除文章
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 读取 posts.json
    const postsData = await fs.readJson(POSTS_JSON_PATH);
    const postIndex = postsData.posts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
      return res.status(404).json({ error: '文章不存在' });
    }

    const post = postsData.posts[postIndex];
    
    // 删除 Markdown 文件
    const mdFilePath = path.join(POSTS_DIR, post.file);
    if (await fs.pathExists(mdFilePath)) {
      await fs.remove(mdFilePath);
      console.log(`删除文件: ${mdFilePath}`);
    }

    // 从 posts.json 中移除
    postsData.posts.splice(postIndex, 1);
    await fs.writeJson(POSTS_JSON_PATH, postsData, { spaces: 2 });
    console.log(`从列表移除: ${id}`);

    res.json({ success: true, message: '文章已删除' });

  } catch (error) {
    console.error('删除失败:', error);
    res.status(500).json({ error: '删除失败', message: error.message });
  }
});

// 创建必要的目录
async function init() {
  await fs.ensureDir(POSTS_DIR);
  console.log('初始化完成');
  console.log(`项目根目录: ${PROJECT_ROOT}`);
  console.log(`文章目录: ${POSTS_DIR}`);
  console.log(`JSON 文件: ${POSTS_JSON_PATH}`);
}

// 启动服务器
init().then(() => {
  app.listen(PORT, () => {
    console.log(`\n✅ 本地发布服务器已启动`);
    console.log(`🌐 访问地址: http://localhost:${PORT}`);
    console.log(`📝 发布器页面: http://localhost:${PORT}/admin/index.html`);
    console.log(`📖 博客首页: http://localhost:${PORT}/blog/index.html\n`);
    console.log(`按 Ctrl+C 停止服务器\n`);
  });
}).catch(err => {
  console.error('启动失败:', err);
  process.exit(1);
});
