---
title: GIthub添加GPG 签名
icon: linux
date: 2023-03-09
category:
  - linux
tag:
  - linux
star: true
# sticky: true
sticky: false


---

# GIthub添加GPG 签名

出于参与开源项目或是保护自身开源项目的安全考虑，在 GIthub 分支保护中，有一项 GPG 签名的设置。

当然，这不是它诞生的主要目的。我们可以看看提交的 Commit 记录，发现就算是不一个账号，如果在本地的 `git config` 中设置相同的 user 信息，最终提交的用户就是一样的。这个在网上有一个很形象的比喻：你的同事获取到了你的 `git config` ，便可以假装你删库跑路了。哈哈哈哈

而签名就是可以证明，你是不是真正的代码提交者，所以可以用于可靠的代码审计和追踪了。（删库跑路也不行了）

## 安装 GPG 生成秘钥

在 MacOS 下，我们利用 brew 包进行下载：

```bash
$: brew install gpg  
```

生产密钥对:

```bash
$: gpg --full-gen-key
```

按照提示进行，需要说明的是，`name` 和 `email` 还是应当同 `git config` 中保持一致。

生成流程如下:

```bash
$: gpg --generate-key
gpg (GnuPG) 2.4.0; Copyright (C) 2021 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Note: Use "gpg --full-generate-key" for a full featured key generation dialog.

GnuPG needs to construct a user ID to identify your key.

Real name: userName
Email address: xxxxxxx@github.com
You selected this USER-ID:
    "userName <xxxxxxx@github.com>"

Change (N)ame, (E)mail, or (O)kay/(Q)uit? o
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.
gpg: revocation certificate stored as '/Users/huy/.gnupg/openpgp-revocs.d/---------.rev'
public and secret key created and signed.

pub   ed25519 2023-03-09 [SC] [expires: 2025-03-08]
      C1F89F0xxxxxxxxxxxxxD
uid                      userName <xxxxxxx@github.com>
sub   cv25519 2023-03-09 [E] [expires: 2025-03-08]
```

需要注意的是，这里的公钥名称为： `C1F89F0xxxxxxxxxxxxxD` 。

设置 git 电子邮箱（此处，可全局也可局部设置，依据项目来）：

```bash
$: git config --global user.email "xxxxxxx@github.com"

# --global 全局配置
# --local 仓库级配置
```

**Step 1**：导出用于签名的 PGP 公钥

```bash
$: gpg -a --export [PRIMARYKEYID]
```

**Step 2**：在 GitHub 中添加 GPG 公钥。具体步骤参照 [这里](https://docs.github.com/cn/authentication/managing-commit-signature-verification/adding-a-new-gpg-key-to-your-github-account)

**Step 3**：修改本地 git 配置

```bash
$: git config --global user.signingkey [PRIMARYKEYID]
```

**Step 4**：（可选）macOS 如果使用时需要输入密码，请安装 `pinentry-mac`。

```bash
$: brew install pinentry-mac


$: echo "pinentry-program $(which pinentry-mac)" >> ~/.gnupg/gpg-agent.conf


$: killall gpg-agent
```

**Step 5**：对提交进行签名

```bash
$: git commit -S -m "your commit message"
```

1. 当本地分支中的提交更改时，请将 S 标志添加到 git commit 命令；
2. 输入密码；
3. 在本地完成创建提交后，将其推送到 GitHub 上的远程仓库 `git push`；
4. 在 GitHub 对应的代码仓库，检查 commit 信息：Verified（已验证）。

**Step 6**：对标签进行签名

```bash
# 本地签名打tag
$: git tag -s v1.0.0 -m "my version 1.0.0"

# 验证tag签名
$: git tag -v v1.0.0

# 推送远程仓库
$: git push --tag
```

## 其它常用指令

- 设置自动签名:

```bash
$: git config --global commit.gpgsign true

# --global 全局配置
# --local 仓库级配置
```

- 查看 Commit 签名信息:

```bash
$: git log --show-signature
```

- 引入 GitHub 公钥

```bash
# 引入 github 公钥
$: curl https://github.com/web-flow.gpg | gpg --import
# 签署 github 公钥
$: gpg --lsign-key GitHub
```





## 参考文档

[使用 GPG 为 GIthub 签名](https://www.yangqi.show/posts/gpg-github)











