/**
 * 博客发布服务器
 * 
 * 启动: node server.js
 * 访问: http://localhost:3000
 */

const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const app = express();
const PORT = 3000;
const PROJECT_ROOT = __dirname;
const POSTS_DIR = path.join(PROJECT_ROOT, 'blog', 'posts');
const POSTS_JSON_PATH = path.join(PROJECT_ROOT, 'data', 'posts.json');

const AUTH_SALT = 'hawaii_potato_2024_salt';
const AUTH_HASH = '79927adfc6cf2a27d129683b6cabbf6c';

const sessions = new Map();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(PROJECT_ROOT));

function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || !sessions.has(token)) {
        return res.status(401).json({ error: '未登录或会话已过期' });
    }
    next();
}

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/login', (req, res) => {
    const { passwordHash } = req.body;
    if (passwordHash === AUTH_HASH) {
        const token = crypto.randomBytes(32).toString('hex');
        sessions.set(token, { createdAt: Date.now() });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ error: '密码错误' });
    }
});

app.post('/api/logout', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) sessions.delete(token);
    res.json({ success: true });
});

app.get('/api/check-auth', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    res.json({ authenticated: !!token && sessions.has(token) });
});

app.get('/api/posts', authMiddleware, async (req, res) => {
    try {
        const data = await fs.readJson(POSTS_JSON_PATH);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: '读取文章列表失败', message: error.message });
    }
});

app.get('/api/posts/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const data = await fs.readJson(POSTS_JSON_PATH);
        const post = data.posts.find(p => p.id === id);
        if (!post) {
            return res.status(404).json({ error: '文章不存在' });
        }
        const mdPath = path.join(POSTS_DIR, post.file);
        const content = await fs.readFile(mdPath, 'utf8');
        res.json({ ...post, rawContent: content });
    } catch (error) {
        res.status(500).json({ error: '读取文章失败', message: error.message });
    }
});

app.post('/api/publish', authMiddleware, async (req, res) => {
    try {
        const { id, title, date, author, tags, summary, content, filename } = req.body;
        
        if (!id || !title || !date || !author || !summary || !content) {
            return res.status(400).json({ error: '缺少必填字段' });
        }
        
        const tagsStr = (tags || []).map(t => `"${t}"`).join(', ');
        const mdFilename = `${filename}.md`;
        const mdFilePath = path.join(POSTS_DIR, mdFilename);
        
        const frontmatter = `---
id: "${id}"
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
author: "${author.replace(/"/g, '\\"')}"
tags: [${tagsStr}]
summary: "${summary.replace(/"/g, '\\"')}"
---

${content}`;
        
        await fs.writeFile(mdFilePath, frontmatter, 'utf8');
        console.log(`写入: ${mdFilePath}`);
        
        console.log('运行构建脚本...');
        execSync('node build.js', { cwd: PROJECT_ROOT, stdio: 'inherit' });
        
        res.json({
            success: true,
            message: '发布成功',
            files: {
                md: `blog/posts/${mdFilename}`,
                html: `blog/post/${id}/index.html`,
                json: 'data/posts.json'
            }
        });
        
    } catch (error) {
        console.error('发布失败:', error);
        res.status(500).json({ error: '发布失败', message: error.message });
    }
});

app.delete('/api/posts/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const postsData = await fs.readJson(POSTS_JSON_PATH);
        const postIndex = postsData.posts.findIndex(p => p.id === id);
        
        if (postIndex === -1) {
            return res.status(404).json({ error: '文章不存在' });
        }
        
        const post = postsData.posts[postIndex];
        const mdFilePath = path.join(POSTS_DIR, post.file);
        
        if (await fs.pathExists(mdFilePath)) {
            await fs.remove(mdFilePath);
            console.log(`删除: ${mdFilePath}`);
        }
        
        const htmlDir = path.join(PROJECT_ROOT, 'blog', 'post', id);
        if (await fs.pathExists(htmlDir)) {
            await fs.remove(htmlDir);
            console.log(`删除: ${htmlDir}`);
        }
        
        postsData.posts.splice(postIndex, 1);
        await fs.writeJson(POSTS_JSON_PATH, postsData, { spaces: 2 });
        
        res.json({ success: true, message: '文章已删除' });
    } catch (error) {
        res.status(500).json({ error: '删除失败', message: error.message });
    }
});

async function init() {
    await fs.ensureDir(POSTS_DIR);
    await fs.ensureDir(path.join(PROJECT_ROOT, 'blog', 'post'));
    await fs.ensureDir(path.join(PROJECT_ROOT, 'data'));
    console.log('初始化完成');
    console.log(`项目目录: ${PROJECT_ROOT}`);
}

init().then(() => {
    app.listen(PORT, () => {
        console.log(`\n✅ 服务器已启动: http://localhost:${PORT}`);
        console.log(`📝 发布器: http://localhost:${PORT}/blog/admin/`);
        console.log(`📖 博客: http://localhost:${PORT}/blog/\n`);
    });
}).catch(err => {
    console.error('启动失败:', err);
    process.exit(1);
});
