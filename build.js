/**
 * 博客构建脚本
 * 自动扫描 MD 文件，生成 posts.json 和静态 HTML 页面
 * 
 * 使用: node build.js
 */

const fs = require('fs-extra');
const path = require('path');

const PROJECT_ROOT = __dirname;
const POSTS_DIR = path.join(PROJECT_ROOT, 'blog', 'posts');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'blog', 'post');
const DATA_DIR = path.join(PROJECT_ROOT, 'data');

function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
        return { meta: {}, content: content };
    }
    
    const frontmatter = match[1];
    const body = match[2];
    const meta = {};
    
    frontmatter.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.slice(0, colonIndex).trim();
            let value = line.slice(colonIndex + 1).trim();
            
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
            } else if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            } else if (value.startsWith("'") && value.endsWith("'")) {
                value = value.slice(1, -1);
            }
            
            meta[key] = value;
        }
    });
    
    return { meta, content: body };
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
}

function generatePostHtml(post, mdContent) {
    const tagsHtml = (post.tags || []).map(tag => `<span class="post-tag">${escapeHtml(tag)}</span>`).join('');
    
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(post.title)} - 土豆的小站</title>
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/blog/css/blog.css">
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css" id="hljs-light">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css" id="hljs-dark" disabled>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css">
    <script>
        (function() {
            const savedTheme = localStorage.getItem('theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
            document.documentElement.setAttribute('data-theme', theme);
        })();
    </script>
</head>
<body>
    <nav class="top-nav">
        <a href="/" class="nav-brand">土豆的小站</a>
        <div class="nav-center">
            <a href="/" class="nav-link">首页</a>
            <a href="/#about" class="nav-link">关于我</a>
            <a href="/blog/" class="nav-link active">博客</a>
            <a href="/#partner" class="nav-link">合作伙伴</a>
        </div>
        <div class="nav-right">
            <button class="theme-toggle" id="themeToggle" aria-label="切换主题">
                <svg class="theme-icon sun" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
                <div class="theme-slider"></div>
                <svg class="theme-icon moon" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
            </button>
            <a href="https://github.com/Hawaiipotato" target="_blank" class="github-link" aria-label="GitHub">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
            </a>
        </div>
    </nav>

    <div class="reading-progress" id="readingProgress"></div>

    <main class="post-page">
        <div class="post-wrapper">
            <div class="post-card">
                <h1 class="post-title">${escapeHtml(post.title)}</h1>
                <div class="post-meta">
                    <span class="post-date">${formatDate(post.date)}</span>
                    <span class="post-author">${escapeHtml(post.author)}</span>
                </div>
                <div class="post-tags">${tagsHtml}</div>
            </div>
            
            <div class="post-content markdown-body" id="postContent"></div>
            
            <div class="post-nav" id="postNav"></div>
            
            <!-- Giscus 评论区 -->
            <div class="giscus-container" id="giscusContainer"></div>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>土豆的小站</h4>
                    <p>一个开发者的个人空间，记录技术与生活的点滴。</p>
                </div>
                <div class="footer-section">
                    <h4>快速链接</h4>
                    <ul>
                        <li><a href="/">首页</a></li>
                        <li><a href="/blog/">博客</a></li>
                        <li><a href="/#about">关于我</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>联系方式</h4>
                    <ul>
                        <li><a href="https://github.com/Hawaiipotato" target="_blank">GitHub</a></li>
                        <li><a href="mailto:hawaiipotatoes@gmail.com">邮箱</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 土豆的小站 · Made with &#10084;&#65039; · All rights reserved</p>
            </div>
        </div>
    </footer>

    <script>
        (function() {
            const themeToggle = document.getElementById('themeToggle');
            const html = document.documentElement;
            const hljsLight = document.getElementById('hljs-light');
            const hljsDark = document.getElementById('hljs-dark');
            
            function updateHighlightTheme() {
                const isDark = html.getAttribute('data-theme') === 'dark';
                hljsLight.disabled = isDark;
                hljsDark.disabled = !isDark;
            }
            
            function updateGiscusTheme() {
                const isDark = html.getAttribute('data-theme') === 'dark';
                const iframe = document.querySelector('iframe.giscus-frame');
                if (iframe) {
                    iframe.contentWindow.postMessage(
                        { giscus: { setConfig: { theme: isDark ? 'dark' : 'light' } } },
                        'https://giscus.app'
                    );
                }
            }
            
            updateHighlightTheme();
            
            themeToggle.addEventListener('click', function() {
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateHighlightTheme();
                updateGiscusTheme();
            });
        })();

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById('readingProgress').style.width = scrolled + '%';
        });

        // 渲染 Markdown
        const mdContent = ${JSON.stringify(mdContent)};
        marked.setOptions({ breaks: true, gfm: true, headerIds: true, mangle: false });
        document.getElementById('postContent').innerHTML = marked.parse(mdContent);
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });

        // 加载文章导航
        fetch('/data/posts.json')
            .then(r => r.json())
            .then(data => {
                const posts = data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
                const currentId = '${post.id}';
                const currentIndex = posts.findIndex(p => p.id === currentId);
                const prevPost = posts[currentIndex + 1];
                const nextPost = posts[currentIndex - 1];
                
                if (!prevPost && !nextPost) return;
                
                let navHtml = '<div class="post-nav-inner">';
                
                if (prevPost) {
                    navHtml += '<a href="/blog/post/' + prevPost.id + '/" class="post-nav-link">' +
                        '<span class="post-nav-label">← 上一篇</span>' +
                        '<span class="post-nav-title">' + escapeHtml(prevPost.title) + '</span></a>';
                } else {
                    navHtml += '<div></div>';
                }
                
                if (nextPost) {
                    navHtml += '<a href="/blog/post/' + nextPost.id + '/" class="post-nav-link post-nav-next">' +
                        '<span class="post-nav-label">下一篇 →</span>' +
                        '<span class="post-nav-title">' + escapeHtml(nextPost.title) + '</span></a>';
                }
                
                navHtml += '</div>';
                document.getElementById('postNav').innerHTML = navHtml;
            });

        function escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        // 动态加载 giscus
        (function() {
            const savedTheme = localStorage.getItem('theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
            const giscusTheme = theme === 'dark' ? 'dark' : 'light';
            
            const script = document.createElement('script');
            script.src = 'https://giscus.app/client.js';
            script.setAttribute('data-repo', 'Hawaiipotato/hawaiipotato.github.io');
            script.setAttribute('data-repo-id', 'R_kgDOOI58bA');
            script.setAttribute('data-category', 'Announcements');
            script.setAttribute('data-category-id', 'DIC_kwDOOI58bM4C2MS1');
            script.setAttribute('data-mapping', 'pathname');
            script.setAttribute('data-strict', '0');
            script.setAttribute('data-reactions-enabled', '1');
            script.setAttribute('data-emit-metadata', '0');
            script.setAttribute('data-input-position', 'top');
            script.setAttribute('data-theme', giscusTheme);
            script.setAttribute('data-lang', 'zh-CN');
            script.setAttribute('crossorigin', 'anonymous');
            script.async = true;
            document.getElementById('giscusContainer').appendChild(script);
        })();
    </script>
</body>
</html>`;
}

async function build() {
    console.log('开始构建博客...\n');
    
    await fs.ensureDir(OUTPUT_DIR);
    await fs.ensureDir(DATA_DIR);
    
    const files = await fs.readdir(POSTS_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    console.log(`找到 ${mdFiles.length} 个 Markdown 文件\n`);
    
    const posts = [];
    
    for (const file of mdFiles) {
        const filePath = path.join(POSTS_DIR, file);
        const content = await fs.readFile(filePath, 'utf8');
        const { meta, content: body } = parseFrontmatter(content);
        
        if (!meta.id) {
            console.log(`跳过 ${file}：缺少 id`);
            continue;
        }
        
        const post = {
            id: meta.id,
            file: file,
            title: meta.title || file.replace('.md', ''),
            date: meta.date || new Date().toISOString().split('T')[0],
            author: meta.author || 'Potato',
            tags: meta.tags || [],
            summary: meta.summary || ''
        };
        
        posts.push(post);
        
        const postDir = path.join(OUTPUT_DIR, post.id);
        await fs.ensureDir(postDir);
        
        const htmlContent = generatePostHtml(post, body);
        await fs.writeFile(path.join(postDir, 'index.html'), htmlContent, 'utf8');
        
        console.log(`生成: /blog/post/${post.id}/ (${post.title})`);
    }
    
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    await fs.writeJson(path.join(DATA_DIR, 'posts.json'), { posts }, { spaces: 2 });
    console.log(`\n更新: data/posts.json (${posts.length} 篇文章)`);
    
    console.log('\n构建完成!');
}

build().catch(err => {
    console.error('构建失败:', err);
    process.exit(1);
});
