# Potato's Blog

这是一个基于 [Hexo](https://hexo.io/) 和 [Redefine](https://github.com/EvanNotFound/hexo-theme-redefine) 主题构建的个人博客。

## 项目信息

- **Hexo 版本**: 8.1.1 (要求 >= 5.0.0)
- **主题**: Redefine
- **语言**: 简体中文 (zh_CN)
- **时区**: Asia/Shanghai
- **部署目标**: GitHub Pages

## 环境要求

- Node.js >= 12.0 (推荐 14.0+)
- npm 或 yarn
- Git

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 本地预览

```bash
npm run server
# 或
hexo server
```

访问 http://localhost:4000 查看效果。

### 3. 构建站点

```bash
npm run build
# 或
hexo generate
```

生成的静态文件位于 `public/` 目录。

### 4. 清理缓存

```bash
npm run clean
# 或
hexo clean
```

## 写作指南

### 创建新文章

```bash
hexo new post "文章标题"
```

文章将创建在 `source/_posts/文章标题.md`。

### 文章模板

新建的文章会自动使用 `scaffolds/post.md` 模板：

```yaml
---
title: {{ title }}
date: {{ date }}
tags:
---
```

### Front-matter 常用字段

```yaml
---
title: 文章标题
date: 2024-01-01 12:00:00
tags: [标签1, 标签2]
categories: 分类
description: 文章描述（用于SEO和摘要）
toc: true              # 是否显示目录
copyright: true        # 是否显示版权信息
sticky: 1              # 置顶权重，数字越大越靠前
---
```

### 资源文件

如需在文章中使用图片等资源：

1. 在 `_config.yml` 中设置 `post_asset_folder: true`
2. 创建文章时会自动生成同名文件夹
3. 在文章中引用：`![描述](文章标题/图片.jpg)`

### Markdown 扩展功能

Redefine 主题支持以下扩展语法：

- **Note 提示框**: `{% note 类型 %} 内容 {% endnote %}`
- **Tabs 标签页**: `{% tabs %} ... {% endtabs %}`
- **折叠面板**: `{% folding %} ... {% endfolding %}`
- **按钮**: `{% btn 链接, 文字, 图标 %}`
- **Mermaid 图表**: 直接写代码块标记为 `mermaid`

详细用法参考 [Redefine 文档](https://redefine-docs.ohevan.com/)。

## 配置文件说明

本项目包含两份主要配置文件，均名为 `_config.yml`：

| 配置文件 | 位置 | 用途 |
|---------|------|------|
| 站点配置 | 根目录 `_config.yml` | Hexo 本身配置 |
| 主题配置 | `themes/redefine/_config.yml` | 主题相关配置 |

### 最佳实践：使用独立主题配置文件

**⚠️ 重要提示**：为了避免主题更新时丢失自定义配置，强烈建议在根目录创建独立的主题配置文件。

根据 Hexo 5.0.0+ 的特性，在根目录创建 `_config.redefine.yml`，将主题配置复制进去：

```yaml
# 在 Hexo 根目录创建 _config.redefine.yml
# 此文件会覆盖 themes/redefine/_config.yml 的配置
```

优先级顺序（从高到低）：
1. `_config.redefine.yml` (根目录独立配置文件)
2. `themes/redefine/_config.yml` (主题目录配置文件)

### 站点配置 (`_config.yml`)

主要配置站点基本信息：

```yaml
# 站点信息
title: 网站标题
subtitle: 网站副标题
author: 作者名
language: zh_CN
timezone: Asia/Shanghai
url: https://your-domain.com

# 主题设置
theme: redefine

# 部署配置
deploy:
  type: git
  repo: https://github.com/username/username.github.io.git
  branch: main
```

更多配置参考 [Hexo 官方文档](https://hexo.io/zh-cn/docs/configuration)。

### 主题配置

主题配置包含基础信息、图片、颜色、首页横幅、导航栏、文章样式、评论系统、页脚等 489 行详细配置。

**配置路径**：`themes/redefine/_config.yml`

建议创建根目录 `_config.redefine.yml` 来覆盖主题配置，方便升级时保留自定义设置。

YAML 语法注意事项：
- 使用缩进表示层级关系（空格，不要用 Tab）
- 配置项冒号后需要空格
- 字符串可以用引号包裹，也可以不用
- 数组使用 `-` 表示

完整配置文档请参考 [Redefine 官方文档](https://redefine-docs.ohevan.com/)。

## 可用插件

项目已安装以下 Hexo 插件：

- `hexo-generator-archive` - 归档页面生成器
- `hexo-generator-category` - 分类页面生成器
- `hexo-generator-index` - 首页生成器
- `hexo-generator-tag` - 标签页面生成器
- `hexo-renderer-ejs` - EJS 模板引擎
- `hexo-renderer-marked` - Markdown 渲染器
- `hexo-renderer-stylus` - Stylus 渲染器
- `hexo-server` - 本地服务器

可选安装（按需）：

```bash
# 搜索功能
npm install hexo-generator-searchdb

# RSS 订阅
npm install hexo-generator-feed

# 字数统计
npm install hexo-wordcount

# 文章推荐
npm install nodejieba

# Mermaid 图表
npm install hexo-filter-mermaid-diagrams

# Git 部署
npm install hexo-deployer-git
```

## 目录结构

```
.
├── _config.yml              # Hexo 主配置
├── _config.redefine.yml     # 主题独立配置（建议创建）
├── package.json             # 项目依赖
├── scaffolds/               # 文章模板
│   ├── draft.md             # 草稿模板
│   ├── page.md              # 页面模板
│   └── post.md              # 文章模板
├── source/                  # 网站内容
│   ├── _posts/              # 文章目录
│   │   └── hello-world.md   # 示例文章
│   └── images/              # 图片资源（可自定义）
├── themes/                  # 主题目录
│   └── redefine/            # Redefine 主题
│       ├── _config.yml      # 主题默认配置
│       ├── layout/          # 页面布局模板
│       ├── source/          # 静态资源
│       │   ├── css/         # 样式文件
│       │   ├── js/          # JavaScript
│       │   └── images/      # 主题图片资源
│       └── languages/       # 国际化文件
└── public/                  # 构建输出（自动生成）
```

## 主题更新

### 更新主题

```bash
npm install hexo-theme-redefine@latest
```

### 迁移配置

更新后可能需要同步新配置项：

1. 使用 VS Code 的文件比对功能
2. 比较旧配置 `_config.redefine.yml` 和新配置 `node_modules/hexo-theme-redefine/_config.yml`
3. 将新配置项添加到旧配置中
4. 保持缩进一致

## 部署

### GitHub Pages

1. 安装部署插件：
```bash
npm install hexo-deployer-git --save
```

2. 配置 `_config.yml`：
```yaml
deploy:
  type: git
  repo: https://github.com/username/username.github.io.git
  branch: main
```

3. 部署：
```bash
npm run deploy
# 或
hexo clean && hexo generate && hexo deploy
```

### Vercel

直接导入 GitHub 仓库，Vercel 会自动识别为 Hexo 项目。

## 注意事项

### 对于 AI Agent

1. **写作**：只需操作 `source/_posts/` 目录，使用 `hexo new post "标题"` 创建文章
2. **图片**：资源放在 `source/images/` 或文章资源文件夹中
3. **配置**：
   - 修改 Hexo 配置：编辑根目录 `_config.yml`
   - 修改主题配置：优先编辑根目录 `_config.redefine.yml`（如不存在则创建）
4. **不要直接修改** `themes/redefine/` 目录下的文件，除非明确指示修改源码
5. **构建前** 先运行 `hexo clean` 清理缓存
6. **YAML 语法**：注意缩进（2个空格），冒号后加空格

### 常见命令

```bash
# 创建新文章
hexo new post "文章标题"

# 创建草稿
hexo new draft "草稿标题"

# 发布草稿
hexo publish draft "草稿标题"

# 创建页面
hexo new page "页面名称"

# 本地预览
hexo server
hexo server -p 5000    # 指定端口
hexo server -i 0.0.0.0 # 允许外部访问

# 生成静态文件
hexo generate
hexo generate --watch  # 监视文件变化

# 部署
hexo deploy

# 清理缓存
hexo clean

# 组合命令
hexo clean && hexo generate && hexo deploy
```

## 参考链接

- [Hexo 官方文档](https://hexo.io/docs/)
- [Hexo 中文文档](https://hexo.io/zh-cn/docs/)
- [Redefine 主题文档](https://redefine-docs.ohevan.com/)
- [Redefine GitHub](https://github.com/EvanNotFound/hexo-theme-redefine)
- [Markdown 语法](https://hexo.io/docs/tag-plugins)
- [YAML 语法](https://learnxinyminutes.com/docs/yaml/)

## License

MIT

---

**Happy Writing!** 📝
