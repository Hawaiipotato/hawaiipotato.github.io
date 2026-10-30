# Project conventions

- Default language: Chinese. Preserve all original article and page text.
- Active site: Astro static output in `dist/`; `source/` is the preserved content source.
- Hexo is retired. Its pre-migration snapshot is preserved at `qiusyan-projects/potatoblog` (`a0f5f39`); do not reintroduce its runtime or build chain.
- Use Node 24.19.0 or newer. Verify with `npm run build` and `node src/scripts/verify-build.cjs`; browser-check responsive behavior after layout changes.
- Fonts: Chillax for the brand, Georgia + Source Han Serif SC for prose, Maple Mono CN for code. Theme colors: light indigo / dark amber.
- Keep article URLs and Asia/Shanghai dates stable. Only strip legacy inline script/style from standalone pages, never from article code examples.
- Build and verify in CI with the root lockfile; publish `dist/`. Do not push, publish, or alter deployment workflows without confirmation.
