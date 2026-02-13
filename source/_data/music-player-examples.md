# APlayer + MetingJS 示例代码参考

## Rickroll 示例（可用于测试播放器）

### 方式一：使用 MetingJS（推荐用于在线音乐）

```markdown
---
title: Music
date: 2026-02-12 12:00:00
---

## Rick Astley - Never Gonna Give You Up

<meting-js
  server="netease"
  type="song"
  id="5221167"
  theme="#4A90D9"
  autoplay="false">
</meting-js>
```

### 方式二：使用 Aplayer 直链（可用于自定义音频）

```yaml
# 在 _config.redefine.yml 中配置
plugins:
  aplayer:
    enable: true
    type: fixed
    audios:
      - name: "Never Gonna Give You Up"
        artist: "Rick Astley"
        url: "https://你的服务器/rickroll.mp3"
        cover: "https://你的服务器/cover.jpg"
        lrc: "https://你的服务器/lyrics.lrc"
```

### 方式三：页面内嵌播放器（最灵活）

```html
<div id="aplayer"></div>
<script>
const ap = new APlayer({
    container: document.getElementById('aplayer'),
    audio: [{
        name: 'Never Gonna Give You Up',
        artist: 'Rick Astley',
        url: 'https://music.163.com/song/media/xxx.mp3',
        cover: 'https://p2.music.126.net/xxx.jpg',
        lrc: '[00:00.00]Never gonna give you up...'
    }]
});
</script>
```

## 常用音源 ID 示例

| 平台 | server | type | 示例ID | 说明 |
|------|--------|------|--------|------|
| 网易云 | netease | song | 5221167 | Rickroll |
| 网易云 | netease | playlist | 60198 | 示例歌单 |
| QQ音乐 | tencent | song | 001RGrEX3ija5X | 示例单曲 |
| 酷狗 | kugou | playlist | 123456 | 示例歌单 |

## 获取音乐 ID 的方法

### 网易云音乐
1. 打开 https://music.163.com
2. 找到歌曲/歌单
3. 复制 URL 中的 ID 数字

### QQ音乐
1. 打开 https://y.qq.com
2. 找到歌曲/歌单
3. 复制 URL 中的 ID

### 酷狗音乐
1. 打开 https://www.kugou.com
2. 找到歌单
3. 提取 URL 中的数字 ID

## 配置参数说明

```yaml
meting:
  enable: true               # 启用 MetingJS
  global_sticky_enable: true # 全局吸底播放器
  id: '5221167'              # 音乐ID
  server: 'netease'          # 平台：netease/tencent/kugou/xiami/baidu
  type: 'song'               # 类型：song/playlist/album/search/artist
  playerType: 'fixed'        # 样式：fixed(吸底) / mini(迷你)
  preload: 'auto'            # 预加载：none/metadata/auto
  loop: 'all'                # 循环：all/one/none
  order: 'list'              # 顺序：list/random
  theme: '#4A90D9'           # 主题色
  autoplay: false            # 自动播放
  mutex: true                # 互斥（暂停其他播放器）
  lrcType: 0                 # 歌词：0禁用/1原生/2API/3自定义
  listFolded: false          # 列表默认折叠
  listMaxHeight: '340px'     # 列表最大高度
  storageName: 'metingjs'    # 本地存储键名
```

## 完整页面示例

```markdown
---
title: My Music
---

# 我的音乐收藏

## 每日推荐

<meting-js
  server="netease"
  type="playlist"
  id="你的歌单ID"
  theme="#4A90D9"
  list-max-height="500px">
</meting-js>

## 单曲收藏

<meting-js
  server="netease"
  type="song"
  id="5221167"
  theme="#4A90D9">
</meting-js>

---

*音乐仅供个人欣赏，请支持正版*
```

## 注意事项

1. **VIP 歌曲**: 公共 API 无法播放完整 VIP 歌曲，只能播放试听片段
2. **自建 API**: 如需完整 VIP 支持，需部署自建 API 服务器
3. **版权问题**: 请遵守当地版权法规，仅供个人学习使用
4. **稳定性**: 第三方 API 可能随时失效，重要内容建议本地备份

---

*保存时间: 2026-02-12*
*适用于: Hexo + Redefine 主题 + MetingJS*
