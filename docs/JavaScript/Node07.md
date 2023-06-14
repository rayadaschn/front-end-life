---
title: nvm 使用技巧
icon: nodeJS
category:
  - javascript
tag:
  - node
date: 2023-06-14
---

# nvm 使用技巧

nvm（Node Version Manager）是一款针对 Node.js 的版本管理工具。它允许用户同时安装和管理多个 Node.js 版本，并提供了一些命令行工具来快速切换不同的版本，以适应不同的使用场景。

官方文档: [Nvm 官方文档](https://github.com/nvm-sh/nvm#intro)

nvm 的主要优点包括：

- 管理 Node.js 版本：nvm 允许用户同时安装、激活、卸载不同的 Node.js 版本，避免了多个项目之间出现版本冲突或兼容性问题的情况。
- 快速切换版本：通过 nvm 提供的命令行工具，用户可以快速地在不同的 Node.js 版本之间进行切换，大大节省了手动更改系统环境变量或重新安装 Node.js 的时间。
- 管理全局模块：当切换不同的 Node.js 版本时，nvm 还可以自动为每个版本挑选相应的全局模块，在保持用户数据的独立性的同时，也确保了运行时环境的正确性。

使用 nvm 进行 Node.js 版本管理时，通常需要先安装 nvm 工具本身，然后在命令行中执行相应的指令进行版本管理，例如：

- 安装最新版本的 Node.js： nvm install node
- 安装指定版本的 Node.js：nvm install 14.17.0
- 查看已安装的 Node.js 版本：nvm ls
- 切换到指定版本的 Node.js：nvm use 14.17.0

需要注意的是，nvm 只用于管理 Node.js 版本，不会影响和管理系统的其他环境变量或软件包。

## 安装

官方文档提供了较多安装方法，这里记录一种较为便捷的：利用 Brew 对 nvm 进行管理，nvm 则单独拎出来对 node 进行管理。

1. Brew 的安装配置流程：

   [Homebrew](https://zhuanlan.zhihu.com/p/111014448)

   ```shell
   # 若无法正常下载, 还需为 git 添加可信任的三个文件目录
   $: git config --global --add safe.directory /opt/homebrew/Library/Taps/homebrew/homebrew-cask
   $: git config --global --add safe.directory /opt/homebrew/Library/Taps/homebrew/homebrew-service
   $: git config --global --add safe.directory /opt/homebrew/Library/Taps/homebrew/homebrew-core
   ```

2. 利用 Homebrew 安装 nvm

   ```shell
   # 1. 安装 nvm, 会弹出英文提示, 依据英文提示进行下一步
   $: brew install nvm

   # 2. 创建 .nvm 目录
   $: mkdir ~/.nvm

   # 3. 依据提示继续编辑 ~/.zshrc 配置文件
   $: vim ~/.zshrc
   # 在配置文件下添加如下内容
   export NVM_DIR="$HOME/.nvm"
    [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && . "/opt/homebrew/opt/nvm/nvm.sh" # This loads nvm

    [ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && . "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" # This loads nvm bash_completion
   # 按Esc退出到一般模式后, 输入 :wq 指令,保存退出

   # 4. 使用 source 命令使配置生效
   $: source ~/.zshrc

   # 5. 查看配置是否生效
   $: echo $NVM_DIR
   ```

3. nvm 的使用技巧

   ```bash
   # 1. 查看帮助
   $: nvm -help
   # 删除卸载nvm只需要移除$NVM_DIR文件夹即可

   # 2. 安装不同版本的node
   $： nvm install 12
   $： nvm install 16

   # 3. 切换不同的 node 版本
   $: nvm use <version>
      # 如 切换 16
   $: nvm use 16

   # 3. 设置node 默认版本
   $: nvm use 16
   $: nvm alias default 16

   # 4. 升级当前环境下的 node 版本, 小版本更新
   $: nvm install-latest-npm

   # 5. 垮版本更新全局依赖包, 如从 16 到 18
   $: nvm use 18
      # 这里的 16 为 包的版本 version
   $: nvm reinstall-packages 16
   ```

   最后，当不记得指令时，请善用 `nvm --help` 查看帮助！这个比搜指令快的多。
