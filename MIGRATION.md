# Astro 迁移收尾

## 当前状态

- 现役构建为 Astro 7.4.4、Node 24.19.0，输出 `dist/`。普通页面导航，不依赖 Hexo、Redefine、Swup 或 APlayer。
- 保留 5 篇文章、关于和友链的原文件、图片及旧文章路径。只有“欢迎来到我的博客”的原四条技术栈按用户要求更新。
- 首页精简列表；归档按年份分组，兼容年份／月份路径，分类标签总览完整。超过 10 篇时生成下一页，现有内容尚未触发分页第二页。
- 已实现亮暗主题、手机菜单、目录、代码高亮及复制、medium-zoom、Giscus、Vercount、版权及相邻文章；页脚按秒显示运行时间。
- 字体为站名 Chillax、正文 Georgia + 思源宋体、代码 Maple Mono CN。

## 备份与清理

2026-10-30 用户在审阅清理清单后确认：验收通过即可删除旧框架。已删除 `themes/`、三个 `_config*.yml`、`scaffolds/`、`.nojekyll`，合计 298 个跟踪文件，以及本地旧 `public/`、`db.json` 和一次性 `update-footer.cjs` 脚本。

迁移前完整快照保留在 `qiusyan-projects/potatoblog` 主分支提交 `a0f5f399539cfa56a43d89db3ae040f315393177`，文件树与本项目迁移前 `7269b1e` 一致。备份仓库和原 Git 历史未修改。继续使用的 Chillax 字体已独立保留在 `static/fonts/`。全部 `source/`、`static/`、本地规划笔记及 `.claude/` 保留。

废弃的 marked 和试用黑体依赖、旧 Noto Sans 请求、弃用首屏样式及重复样式覆盖已清除。

## 验收结果

- 停止占用原生编译器的本次会话开发进程后，`npm ci` 干净安装成功；随后 `npm run verify` 通过。
- 6 项回归测试覆盖日期时区、代码示例保全、旧独立页转换、重复标题锚点、字数统计和更新时间语义。
- 29 个静态页面、389 个本地链接／资源／锚点检查通过；浏览器请求全部 29 页无非预期 HTTP 错误。
- 连续两次构建的 1,267 个产物文件哈希一致。删除 Hexo 后再次构建与检查通过。
- 主要页面在 320／768／1440px 无横向溢出；目录的 1279／1280px 布局切换、焦点返回、复制纯代码、主题持久化、秒级计时及短页页脚位置已实测。
- Ego Lite 新 TaskSpace 的桌面暗色和手机亮色截图已打开检查。之前会话出现过截图超时／黑图，根因未确定，browser-act 作为后备保留。
- Giscus 可延迟插入脚本并生成 iframe；Vercount 请求返回 200 且更新计数，本地共享域名数字不代表生产站数据。
- js-yaml 和 picomatch 已在兼容范围内更新，官方 npm 审计为 0 个漏洞。

## 部署准备与剩余边界

- GitHub Actions 已改为读取 `.nvmrc`、根目录 `npm ci`、`npm run verify`，上传 `dist/`。Cloudflare 构建记录已同步为同一命令及 Node 24.19.0。
- Cloudflare Pages 控制台仍需核对构建命令和输出目录 `dist`；`cloudflare.toml` 不是标准 Pages 自动识别配置，改文件不等于控制台已生效。
- GitHub Pages API 先前显示 Source 为 main 根目录、build_type 为 legacy；正式发布前应核对 Source 为 GitHub Actions，避免旧分支构建与 Actions 并存。
- 尚未提交、推送或发布；生产评论归属、生产统计及旧链接需在发布后复核。仓库权限和 protection workflow 未变更。

代码、文档、规则、本地运行态及旧框架清理已核验；全局记忆只读；公开发布与生产验证为 pending。
