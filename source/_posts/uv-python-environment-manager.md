---
title: uv：Python项目环境管理神器
date: 2026-02-10 14:30:00
author: 土豆
tags:
  - uv
  - Python
  - 开发工具
categories:
  - 技术分享
---

你有没有数过，为了跑通一个从 GitHub clone 下来的小项目，自己在"配置环境"这件事上浪费过多少个小时？

我记得最崩溃的一次，是一个周末下午。我兴冲冲地想试一个数据分析的小工具，结果从三点折腾到晚饭时间，Python 版本不对、`pip install` 报依赖冲突、好不容易装上的包又和系统自带的冲突……最后代码终于跑起来了，但我已经忘了当初想用它做什么。

以前高中那会搞信息会考用 Python 跑的都是简单得不能再简单的 First Things First，靠 CPython 自带的 `pip` 足以解决所有问题，但现在遇到的项目动不动就是十几个不同要求不同交叉依赖树的依赖，靠传统的工具链实在难以为继，于是我开始找起各种包管理方案。

---

## 1. Why uv

在用 uv 前，我也不是没有试过学习 Python 自带的工具：`venv` 管虚拟环境、`pip` 管装包；后来又找了一些第三方工具：`pipx` 管全局工具、`pyenv` 管多版本……每个工具单独看都还好，凑在一起就让我一个头两个大。

然后我也尝试了 conda，各种东西确实都集成完了，功能也确实够强大了，还能直接上手做 Machine Learning，但那个硕大无朋的体积，总让我隐隐想起气科学妹那台C盘红红的 Dell Inspiron。

后来在试了一个下午之后，我默默地把电脑里的裸 Python 和 Miniconda 都卸了。

选择 uv 的原因实在很简单：Rust 够快、功能够全、lock/sync完备。这个由 Astral 团队出品的全能 Python 项目管理工具，用一个工具集成了过去 `pip` / `venv` / `pipx` / `pyenv` 的全部功能，兼容过去 pip/conda 指令的 `requirements.txt` 同时，还加入了独创性的`uv lock` / `uv sync`机制，实在是很诱人，最后我还是倒戈了。

## 2. 安装 uv

Windows 下使用一条 PowerShell 命令：

```powershell
irm https://astral.sh/uv/install.ps1 | iex
```

或者 MacOS/Linux 使用一条 Shell 通用指令：

```shell
curl -LsSf https://astral.sh/uv/install.sh | sh
```

装好之后，首先解决 Python 版本的问题。uv 可以和 pyenv 一样管理多版本：

```shell
uv python list
uv python install 3.11.13
```

有了 Python，就可以开始创建项目了。`uv init` 会生成一个 `pyproject.toml`，然后 `uv venv` 创建虚拟环境：

```shell
uv init my-project
cd my-project
uv venv --python 3.11.13
```

> 实际上，由于我们预先有安装 uv 内的 py 版本，所以 `uv init` 默认使用的是 uv 内仅有读到的这个版本值，venv 同理，加上 `--python 3.11.13` 只是保险措施
>
> 以及，你也可以自定义虚拟环境的名字，比如给它起名叫 myenv：`uv venv myenv [--python 3.11.13]`

这和传统的 `python -m venv` 类似，但 uv 创建环境的速度明显更快——几乎感觉不到等待。

**激活环境**的方式和传统 venv 相同，但需要注意平台差异：

- **Windows (PowerShell)**：`.venv\Scripts\Activate.ps1`
- **Windows (CMD)**：`.venv\Scripts\activate.bat`
- **macOS/Linux**：`source .venv/bin/activate`

> **Windows 用户注意**：PowerShell 默认可能不允许运行脚本。如遇激活失败，可运行 `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` 解决，或改用 CMD 运行 `activate.bat`。

## 3. 环境锁定与同步

uv 最具独创性的还得是它的锁定机制。传统 `requirements.txt` 记录的是直接依赖，但间接依赖的版本往往是模糊的。`uv lock` 会生成一个 `uv.lock` 文件，精确锁定每一个包的版本和哈希值：

```shell
uv lock
```

团队协作时，只需共享源码和 `uv.lock`，对方运行 `uv sync` 就能得到完全一致的环境：

```shell
uv sync
```

这让我彻底告别了"在我电脑上能跑"的尴尬。删除 `.venv` 后重建环境，或者在新机器上部署，都是一条命令的事。

## 4. 包管理

安装依赖时，uv 提供了两种方式：`uv add/rm` 和 `uv pip`

`uv add` 会把包依赖写入 `pyproject.toml`，这是项目依赖的正规军（相应的 `uv remove` / `uv rm` 会把包依赖从 `pyproject.toml` 中去掉）：

```shell
uv add rich
uv remove rich
```

`uv pip install` 和 pip 效果完全一致——正常存入venv中使用，但是不会写入 `pyproject.toml`：

```shell
uv pip install testpack
uv pip uninstall testpack
```

格式和传统 pip 基本一致，但速度要快得多——特别是装一些有编译依赖的包时，这种差距尤为明显。

## 5. 全局工具管理

除了项目环境，uv 也能管理全局 CLI 工具，替代 pipx 的角色。例如我个人比较喜欢的 Python linter —— `ruff`（同样是 Astral 出品）：

```shell
uv tool install ruff
```

装完之后 `ruff` 全局可用，与项目环境完全隔离。`uv tool list` 查看已安装的工具，`uv tool uninstall` 卸载。

---

## 6. 实战：一个简单项目

我们来做一个极简的问候小脚本——输入名字，输出带彩色边框的问候语，用了 rich 库。

先准备 Python：

```shell
uv python install 3.11.13
```

初始化项目：

```shell
uv init greeting-cli && cd greeting-cli
uv venv --python 3.11.13
```

按需激活环境（或者用 `uv run` 跳过这一步）：

```powershell
.venv\Scripts\Activate.ps1
```

添加依赖：

```shell
uv add rich
```

写代码，`main.py`：

```python
from rich.panel import Panel
from rich import print

name = input("请输入你的名字：")
print(Panel.fit(
    f"你好，{name}！欢迎探索 uv 的世界！",
    title="问候",
    border_style="cyan"
))
```

运行：

```shell
uv run python main.py
```

最后锁定环境：

```shell
uv lock
```

---

## 写在最后

说实话，我已经不太记得上次手动激活 Python 虚拟环境是什么时候了。一方面确实，`uv run` 解决了我最烦的那一步，另一方面，现代IDE几乎都集成了自动 activate 的功能（即使没有自动 activate，我也可以在"终端"设置页的地址栏加上一串简单又重复的执行选项让终端启动时自动 activate）。而 `uv add` 和 `uv lock` 则是用最简单粗暴的方式，让我不用再操心任何依赖管理。

Astral 团队似乎很擅长这个——用 Rust 把那些我们每天都在用、但用起来有点别扭的工具重写一遍，然后让它快一点、顺手一点、集成一点、优雅一点。uv 是这样，ruff 也是这样。

如果你也受够了在终端里反复激活环境、或者看着 pip/conda 龟爬般的安装进度条、或是对着红红的C盘发呆，也许可以花一个下午试试 uv。最坏的结果，也就是再卸载掉而已。但大概率，你会像我一样，被它极致的技术优雅折服，然后默默地把其他环境管理工具都换成它。
