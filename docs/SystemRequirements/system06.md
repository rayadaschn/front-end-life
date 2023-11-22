---
title: 使用 VScode 连接远程服务器并免密登录
icon: linux
date: 2023-09-20
category:
  - linux
tag:
  - linux
# sticky: true
sticky: false
---

最近管理服务器有点多，记录一下服务器配置操作。

如果想了解更多关于 ssh 秘钥登录的问题，可以参考阮一峰老师的[《SSH 密钥登录》](https://wangdoc.com/ssh/key)。

## 插件安装

首先进入插件商店安装 Remote 全家桶:

1. [Remote-SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh)
2. [Remote - SSH: Editing Configuration Files](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh-edit)
3. [Remote Explorer](https://marketplace.visualstudio.com/items?itemName=ms-vscode.remote-explorer)

三者的作用各不相同，都要下载：

- Remote-SSH 插件：

  Remote-SSH 插件使你能够通过 SSH 协议连接到远程服务器或虚拟机，并在本地的 VSCode 编辑器中进行开发。它提供了一个集成的终端，可以在远程服务器上执行命令，编辑远程文件，并在本地编写和调试代码。这个插件非常适用于需要在远程环境中进行开发的场景，如远程服务器的代码调试、远程容器的开发等。

- Remote - SSH: Editing Configuration Files 插件：

  Remote - SSH: Editing Configuration Files 插件是 Remote-SSH 插件的另一个附属插件，它提供了一个方便的方式来编辑远程服务器上的 SSH 配置文件。通过这个插件，你可以直接在 VSCode 编辑器中打开和编辑远程服务器上的 SSH 配置文件（如 ~/.ssh/config），并进行相应的修改和保存。

- Remote Explorer 插件：

  Remote Explorer 插件是 Remote-SSH 插件的附属插件，用于在 VSCode 中浏览和管理通过 Remote-SSH 连接的远程服务器。它提供了一个侧边栏面板，显示已连接的远程服务器列表，并允许你浏览服务器上的文件和文件夹，进行文件操作（如上传、下载、删除等），以及执行远程命令。

## 创建远程连接

点击 VScode 左侧 Remote 插件，在设置旁边的 ➕ 符号，创建一个新的 SSH 连接。

![远程连接](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202309201540003.png)

格式同 ssh 远程连接的指令相同，如： `ssh -p22 ubuntu@127.0.0.1`。

然后右下角会提示更新了本地 ssh 的 `config` 文件，可以打开进行二次编辑（后续保存私钥免密登录会用到）。

键入远程连接指令后，实际上就是修改了 ssh 的`config` 文件。此时再次刷新插件(插件右上角)。

![刷新配置](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202309201547670.png)

刷新配置后，会多出一台远程电脑的配置。点击这台新建的远程电脑，有俩种连接方式：在当前界面连接远程电脑/新建一个窗口连接远程电脑。

点击远程连接按钮后，会弹出输入框要求输入登录密码，待键入密码后，便可连接远程服务了。

此时的右侧文件夹为同步服务器文件，直接操作会同步修改。

## 设置免密登录

当前配置还是需要每次输入登录密码。此时我们打开底部的 terminal 终端输入框。

切换到 `.ssh` 目录去: `$ cd .ssh`

在该目录下会有三个文件: `authorized_keys  id_rsa  id_rsa.pub`

若没有，则自行在远程服务器新建秘钥： `$ ssh-keygen`，一路回车。

::: tip

authorized_keys 是一个用于存储 SSH 公钥的文件，用于实现 SSH 免密登录的授权列表。

当你使用 SSH 密钥对进行身份验证时，你会生成一对密钥：公钥和私钥。私钥保存在本地计算机上，而公钥则被添加到远程服务器上的 authorized_keys 文件中。

当你尝试使用 SSH 密钥进行连接时，远程服务器会检查你提供的公钥是否存在于 authorized_keys 文件中。如果存在匹配的公钥，服务器会验证该密钥，并允许你进行免密登录，而无需输入密码。

authorized_keys 文件通常位于每个用户的 `~/.ssh/` 目录下。每个用户都有自己的 authorized_keys 文件，用于管理其免密登录的授权。

在该文件中，每行包含一个公钥。你可以手动将公钥添加到 authorized_keys 文件中，也可以使用 `ssh-copy-id` 命令自动将公钥添加到远程服务器的 authorized_keys 文件中。

请注意，为了保证安全性，authorized_keys 文件的权限通常设置为只允许所有者进行读写操作（即权限为 600 或 400），以防止未授权的访问。

:::

这是我们将公钥追加到 authorized_keys 文件中去， 获取公钥 `$ cat id_rsa.pub`。

在 authorized_keys 文件尾部追加公钥 `$ cat id_rsa.pub >> authorized_keys`。

最后一步需要将配对的私钥文件保存到本地的 `~/.ssh` 文件夹中：

- 复制私钥 `$ cat id_rsa`;
- 保存到本地 `~/.ssh`文件夹中，文件名任取如：“id_rsa_ubuntu”

由于自定义了私钥名，所以在当前文件夹的 config 文件中找到该 ssh 的配置，并在响应配置尾部追加 IdentityFile 指定 SSH 密钥文件路径：

```config
# T4 服务器
Host 127.0.0.1
  HostName 127.0.0.1
  Port 22
  User ubuntu
  IdentityFile ~/.ssh/id_rsa_ubuntu
```

## 用 scp 传输文件

除了图形化文件传输外，偶尔我们还是需要用指令进行文件传输，这时，就要用到 ssh 提供的客户端程序 scp(secure copy) 了。它是用来在两台主机之间加密传送文件（即复制文件）。**相当于`cp`命令加上`SSH`命令。**它的底层是 SSH 协议，默认端口是 22，相当于先使用 ssh 命令登录远程主机，然后再执行拷贝操作。

scp 的语法类似 cp 的语法。

```bash
$: scp source destination
```

上面命令中，source 是文件当前的位置，destination 是文件所要复制到的位置。它们都可以包含用户名和主机名。

```bash
$: scp user@host:foo.txt bar.txt
```

上面命令将远程主机（user@host）用户主目录下的 foo.txt，复制为本机当前目录的 bar.txt。可以看到，主机与文件之间要使用冒号**（:）**分隔。

scp 会先用 SSH 登录到远程主机，然后在加密连接之中复制文件。客户端发起连接后，会提示用户输入密码，这部分是跟 SSH 的用法一致的。

> 注意，如果所要复制的文件，在目标位置已经存在同名文件，scp 会在没有警告的情况下覆盖同名文件。

## 参考文章

- [《SSH 密钥登录》](https://wangdoc.com/ssh/key)
