---
id: "2"
title: "Markdown 样式演示"
date: "2026-02-10"
author: "Potato"
tags: ["技术", "Markdown"]
summary: "这是一篇用于测试 Markdown 渲染效果的文章，展示了各种 Markdown 语法的样式。"
---

这篇文章展示了博客支持的各种 Markdown 语法效果。

## 文本样式

**粗体文本** 和 *斜体文本* 和 ~~删除线~~

## 代码展示

### 行内代码

使用 `console.log()` 可以在控制台输出信息。

### 代码块

```python
# Python 示例
def hello_world():
    print("Hello, World!")
    return True

if __name__ == "__main__":
    hello_world()
```

```javascript
// JavaScript 示例
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}
```

```css
/* CSS 示例 */
.button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    color: white;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.button:hover {
    transform: translateY(-2px);
}
```

## 列表

### 无序列表

- 第一项
- 第二项
  - 子项 A
  - 子项 B
- 第三项

### 有序列表

1. 第一步
2. 第二步
3. 第三步

## 引用

> 这是一段引用文字。
> 
> 可以有多行，适合引用名人名言或重要提示。

## 表格

| 功能 | 支持状态 | 备注 |
|------|---------|------|
| Markdown 渲染 | ✅ 已支持 | 使用 Marked.js |
| 代码高亮 | ✅ 已支持 | 使用 Highlight.js |
| 暗色主题 | ✅ 已支持 | 自动切换 |
| 标签筛选 | ✅ 已支持 | 可点击筛选 |

## 链接

访问 [GitHub](https://github.com) 或 [我的博客首页](../)

## 分割线

上面的内容结束

---

下面的内容开始

## 总结

这个博客支持标准的 Markdown 语法，包括：

1. 标题层级（H1-H6）
2. 文本样式（粗体、斜体、删除线）
3. 代码（行内代码和代码块）
4. 列表（有序和无序）
5. 引用块
6. 表格
7. 链接和图片
8. 分割线

开始写作吧！
