# Potato's Blog

> 休对故人思故国，且将新火试新茶，诗酒趁年华。

Potato's Blog 是夏威夷土豆的个人空间，记录技术实践、工具折腾和生活随笔。

这里偏向真实使用后的经验：Python 环境管理、Windows 调试、前端页面、小脚本、修机记录，以及一些读书观影和日常观察。文章会尽量写清楚问题从哪里来、尝试过什么、最后怎么处理，让之后的自己和刚好遇到同类问题的人都能少绕一点路。

## 站点

[https://hawaiipotato.pages.dev](https://hawaiipotato.pages.dev)

## 关于作者

我是 Potato，也叫夏威夷土豆，一名开发者与技术爱好者。

我喜欢把电脑和工具折腾到顺手，也喜欢把解决问题的过程写下来。这里既有偏技术的记录，也有一些更随性的内容：读点好书，看点美景，偶尔写写电影和日常。

## 内容方向

- 技术分享：开发工具、编程实践、环境配置、问题排查
- 折腾记录：Windows、脚本、硬件、效率工具
- 随笔：阅读、电影、风景和日常想法

## 联系

- Email: [hawaiipotatoes@gmail.com](mailto:hawaiipotatoes@gmail.com)
- GitHub: [@Hawaiipotato](https://github.com/Hawaiipotato)
- Bilibili: [Hawaiipotato 的个人空间](https://space.bilibili.com/401682702)

## 本地开发

使用 Node.js 24.19.0 或更新版本，版本记录在 `.nvmrc`。

```sh
npm ci
npm run dev
npm run verify
npm run preview
```

`verify` 运行内容回归测试、静态构建及链接／资源／锚点检查。Astro 构建产物位于 `dist/`。

文章位于 `source/_posts/`；关于、友链位于 `source/about/` 和 `source/links/`。日期按上海时区解析，仅显式填写 `updated` 时展示更新时间。页面组件与交互位于 `src/`，对外资源位于 `static/`。`source/images/` 保留原图片，当前对外副本在 `static/images/`，更新图片时需要同时核对这两处。

站名使用 Chillax，正文使用 Georgia／思源宋体，代码使用 Maple Mono CN。思源宋体和 Chillax 随站点提供；Maple Mono CN、Giscus 与 Vercount 使用外部服务。Chillax 来源与作者见 [字体样式](src/styles/main-font.css)，思源宋体分发遵循其 SIL OFL 1.1 许可。

## 部署

Cloudflare Pages 构建命令为 `npm ci && npm run verify`，输出目录为 `dist`，Node 版本由 `.nvmrc` 指定。GitHub Pages 使用仓库中的 Actions 工作流构建和发布。
