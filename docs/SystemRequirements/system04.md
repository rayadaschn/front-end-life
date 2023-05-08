---
title: 为 MacOS 设置终端代理
icon: linux
date: 2023-02-1
category:
  - linux
tag:
  - linux
# star: true
# sticky: true
sticky: false
---

# 为 MacOS 设置终端代理

## 环境

代理软件: [ClashX](https://github.com/yichengchen/clashX/tags) , 软件的终端混合代理端口号默认为: **7890**
HTTP 代理端口号 和 Socks5 代理端口号默认未设置。

## 为终端设置代理

1. 临时配置

   ```shell
   $: export http_proxy=http://127.0.0.1:7890
   $: export https_proxy=$http_proxy
   ```

   此时已设置好代理。

2. 快捷指令脚本

   临时设置，代码过长，因此为其设置快捷指令。

   ```shell
   # 脚本内容
   # 开启代理
   function proxy_on() {
       export http_proxy=http://127.0.0.1:7890
       export https_proxy=\$http_proxy
       echo -e "终端代理已开启。"
   }

   # 关闭代理
   function proxy_off(){
       unset http_proxy https_proxy
       echo -e "终端代理已关闭。"
   }
   ```

   指令脚本，我们一般写在 `~/.bash_profile` 内，因此，我们可以在终端输入如下指令，自动创建该文件。

   ```shell
   cat > ~/.bash_profile << EOF
   function proxy_on() {
       export http_proxy=http://127.0.0.1:7890
       export https_proxy=\$http_proxy
       echo -e "终端代理已开启。"
   }

   function proxy_off(){
       unset http_proxy https_proxy
       echo -e "终端代理已关闭。"
   }
   EOF
   ```

   创建完脚本指令后，我们还需为每次打开 zsh 或者 终端 去 `source ~/.bash_profile` 该脚本。因此，我们应该在 `~/.zshrc` 中末尾追加该指令

   ```shell
   # ~/.zshrc 文件
   # .... 其它配置

   source ~/.bash_profile
   ```

## 验证

到此，我们已经完成了终端代理的设置了，可以进行验证，在 新建 终端内输入：

```shell
# 开启代理
$: proxy_on

# 关闭代理
$: proxy_off
```

## 其它： 为 GIthub 设置代理

走 Github 下载时， 自动终端代理

在 `~/.ssh/config` 文件中追加设置。

```shell
# 全局
# ProxyCommand nc -X 5 -x 127.0.0.1:7890 %h %p
# 只为特定Github设定
Host github.com
    ProxyCommand nc -X 5 -x 127.0.0.1:7890 %h %p
```
