---
title: Mac配置记录
icon: linux
date: 2023-02-1
article: false
category:
  - linux
tag:
  - linux
# star: true
# sticky: true
sticky: false
---

# Mac 配置记录

该博文记录新 Mac 收到后的相关配置说明，仅做记录。

[toc]

## Mac 基本设置

初始用户名较为重要，慎重选择。

快捷键记录:

- 系统级别
  - **command + w 关闭窗口**
  - command + m 最小化窗口
  - **command + q 退出当前程序**
  - command + c 复制
  - command + v 粘贴
  - **command + , 当前程序设置面板**
  - command + + 放大内容
  - command + - 缩小内容
  - command + s 保存
  - control + f 光标前进一格
  - control + b 光标后退一格
  - control + p 光标向上一行
  - control + n 光标向下一行
  - control + d 向前删除
  - control + h 向后删除
  - control + e 到行尾
  - control + a 到行首
- 终端
  - control + w 按单词删除已输入内容
- 浏览器
  - **command + r 刷新**
  - **command + l 进入地址栏**

### 通用设置

1. 桌面、屏保和触发角

2. 安全与隐私

   在“允许从以下位置下载的应用中”点选“**\*任何来源\***”，这样才能下载 Apple store 以外的免费应用。

## 软件安装

- 工具类

  1. **柠檬清理** 官网下载
  2. the unarchiver 优秀的解压软件,应用商店下载
  3. Google Chrome
  4. Microsoft Edge
  5. 搜狗输入法
  6. iRightMouse: 右键管理器
  7. NTFS for Mac 移动硬盘读写
  8. Typora: MarkDown 编辑器
  9. PDF Expert : pdf 编辑器
  10. Moment 日历记录
  11. [clashX ](https://github.com/yichengchen/clashX/tags) 科学上网利器
  12. **[Maccy](https://maccy.app/)** 优秀的剪切板工具
  13. **Hidden Bar** 隐藏菜单栏过多, 应用商店下载。
  14. Drink 提示喝水, 应用商店下载
  15. 欧路词典
  16. 有道云笔记
  17. Photoshop
  18. Finally Cut Pro
  19. Compressor 视频导出
  20. XMind: 脑图

- 工作类

  1. vscode
  2. 钉钉
  3. wps
  4. 腾讯会议
  5. 微信开发者工具
  6. 小程序开发者工具
  7. HBuilderX

- 下载类

  1. 阿里云盘
  2. 百度云盘
  3. 迅雷

- 娱乐类

  1. 微信

  2. QQ

  3. 网易云音乐

  4. IINA 视频播放器

## 开发者

1. [Homebrew](https://zhuanlan.zhihu.com/p/111014448)

   ```shell
   # 若无法正常下载, 还需为 git 添加可信任的三个文件目录
   $: git config --global --add safe.directory /opt/homebrew/Library/Taps/homebrew/homebrew-cask
   $: git config --global --add safe.directory /opt/homebrew/Library/Taps/homebrew/homebrew-service
   $: git config --global --add safe.directory /opt/homebrew/Library/Taps/homebrew/homebrew-core
   ```

2. [iTerm2 + oh-my-zsh + agnoster 配置 ](https://sliu.vip/notes/iterm2/)

3. Git

4. nvm + node + pnpm

   利用 Homebrew 安装

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

   # 6. 查看帮助
   $: nvm -help
   # 删除卸载nvm只需要移除$NVM_DIR文件夹即可

   # 7. 安装不同版本的node
   $： nvm install 12
   $： nvm install 16

   # 8. 设置node 默认版本
   $: nvm alias default 16
   ```

   ```shell
   # 利用curl 直接全局安装 pnpm
   $: curl -f https://get.pnpm.io/v6.js | node - add --global pnpm

   # 验证
   $: pnpm -v
   ```

5. Alfred: 搜索

6. Xcode

7. 配置 ~/.bash_profile 文件

   ```shell
   # HomeBrew
   export PATH="/usr/local/bin:$PATH"
   export PATH="/usr/local/sbin:$PATH"
   # HomeBrew END

   # NVM
   export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
   [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

   # NVM END

   # 代理
   function proxy_on(){
       export http_proxy=http://127.0.0.1:7890
       export https_proxy=http://127.0.0.1:7890
       echo -e "已开启代理"
   }
   function proxy_off(){
       unset http_proxy
       unset https_proxy
       echo -e "已关闭代理"
   }
   # 代理结束
   ```
