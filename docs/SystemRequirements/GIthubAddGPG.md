---
title: GIthub添加GPG 签名
icon: linux
date: 2023-03-09
category:
  - linux
tag:
  - linux
# sticky: true
sticky: false
---

# GIthub 添加 GPG 签名

出于参与开源项目或是保护自身开源项目的安全考虑，在 GIthub 分支保护中，有一项 GPG 签名的设置。

当然，这不是它诞生的主要目的。我们可以看看提交的 Commit 记录，发现就算是不一个账号，如果在本地的 `git config` 中设置相同的 user 信息，最终提交的用户就是一样的。这个在网上有一个很形象的比喻：你的同事获取到了你的 `git config` ，便可以假装你删库跑路了。哈哈哈哈

而签名就是可以证明，你是不是真正的代码提交者，所以可以用于可靠的代码审计和追踪了。（删库跑路也不行了）

## 安装 GPG 生成秘钥

在 MacOS 下，我们利用 brew 包进行下载：

```bash
$: brew install gpg
```

安装完毕，进行验证：

```bash
$: gpg --help
gpg (GnuPG) 2.2.27
libgcrypt 1.8.8
Copyright (C) 2021 Free Software Foundation, Inc.
License GNU GPL-3.0-or-later <https://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Home: /home/xxxx/.gnupg
支持的算法：
公钥： RSA, ELG, DSA, ECDH, ECDSA, EDDSA
密文： IDEA, 3DES, CAST5, BLOWFISH, AES, AES192, AES256, TWOFISH,
    CAMELLIA128, CAMELLIA192, CAMELLIA256
散列： SHA1, RIPEMD160, SHA256, SHA384, SHA512, SHA224
压缩：  不压缩, ZIP, ZLIB, BZIP2

语法：gpg [options] [files]
签名、检查、加密或解密
默认的操作依输入数据而定

命令：

 -s, --sign                  生成一份签名
     --clear-sign            生成一份明文签名
 -b, --detach-sign           生成一份分离的签名
 -e, --encrypt               加密数据
 -c, --symmetric             仅使用对称密文加密
 -d, --decrypt               解密数据（默认）
     --verify                验证签名
 -k, --list-keys             列出密钥
     --list-signatures       列出密钥和签名
     --check-signatures      列出并检查密钥签名
     --fingerprint           列出密钥和指纹
 -K, --list-secret-keys      列出私钥
     --generate-key          生成一个新的密钥对
     --quick-generate-key    快速生成一个新的密钥对
     --quick-add-uid         快速添加一个新的用户标识
     --quick-revoke-uid      快速吊销一个用户标识
     --quick-set-expire      快速设置一个过期日期
     --full-generate-key     完整功能的密钥对生成
     --generate-revocation   生成一份吊销证书
     --delete-keys           从公钥钥匙环里删除密钥
     --delete-secret-keys    从私钥钥匙环里删除密钥
     --quick-sign-key        快速签名一个密钥
     --quick-lsign-key       快速本地签名一个密钥
     --quick-revoke-sig      quickly revoke a key signature
     --sign-key              签名一个密钥
     --lsign-key             本地签名一个密钥
     --edit-key              签名或编辑一个密钥
     --change-passphrase     更改密码
     --export                导出密钥
     --send-keys             个密钥导出到一个公钥服务器上
     --receive-keys          从公钥服务器上导入密钥
     --search-keys           在公钥服务器上搜索密钥
     --refresh-keys          从公钥服务器更新所有密钥
     --import                导入/合并密钥
     --card-status           打印卡片状态
     --edit-card             更改卡片上的数据
     --change-pin            更改卡片的 PIN
     --update-trustdb        更新信任数据库
     --print-md              打印消息摘要
     --server                以服务器模式运行
     --tofu-policy VALUE     设置一个密钥的 TOFU 政策

选项：

 -a, --armor                 创建 ASCII 字符封装的输出
 -r, --recipient USER-ID     为 USER-ID 加密
 -u, --local-user USER-ID    使用 USER-ID 来签名或者解密
 -z N                        设置压缩等级为 N （0 为禁用）
     --textmode              使用规范的文本模式
 -o, --output FILE           写输出到 FILE
 -v, --verbose               详细模式
 -n, --dry-run               不做任何更改
 -i, --interactive           覆盖前提示
     --openpgp               使用严格的 OpenPGP 行为

（请参考手册页以获得所有命令和选项的完整列表）

例子：

 -se -r Bob [file]          为用户 Bob 签名和加密
 --clear-sign [file]        创建一个明文签名
 --detach-sign [file]       创建一个分离签名
 --list-keys [names]        列出密钥
 --fingerprint [names]      显示指纹
```

生产密钥对:

```bash
## 生成新的密钥对
## 以专家模式生成可以添加 --expert 选项
$: gpg --gen-key
$: gpg --generate-key

## 以全功能形式生成新的密钥对（期间会有一些密钥的配置）
$: gpg --full-generate-key
$: gpg --full-gen-key
```

生成的密钥对一般放在`~/.gnupg`目录下。

本文用 `gpg --full-gen-key` 按照提示进行，需要说明的是，`name` 和 `email` 还是应当同 `git config` 中保持一致。

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
gpg: revocation certificate stored as '/Users/xxx...xxx/openpgp-revocs.d/---------.rev'
public and secret key created and signed.

pub   edxxx 2023-xx-xx [SC] [expires: 2025-xx-xx]
      C1Fxxxxxxx79D
uid                      userName <xxxxxxx@github.com>
sub   cvxxx 2023-xx-xx [E] [expires: 2025-xx-xx]
```

需要注意的是，这里的主公钥名称为**[PRIMARYKEYID]**： `C1Fxxxxxxx79D` 。

再对上述结果进行说明:

- `pub` : 显示的是公钥特性。加密算法为 `ed25519`，然后是时间，主密钥：`C1Fxxxxxxx79D` 。

  如果你选择了其它加密算法，则依据具体情况而定，如 `RSA` ： `pub 4096R/EDDD6D76 2022-03-15`。这串的释义是 RSA 加密的公钥特征（4096 位，Hash 字符串和生成时间）

- `uid`: 为用户 ID；

- `sub`： 显示私钥特征。

> 生成密钥之后 建议生成一张"撤销证书"，用于密钥作废时，可以请求外部的公钥服务器撤销公钥。
>
> 命令为:
>
> ```bash
> $: gpg --gen-revoke [用户ID]
> ```
>
> 此处的 用户 ID 可以是用户邮箱

设置 git 电子邮箱（此处，可全局也可局部设置，依据项目来）：

```bash
$: git config --global user.email "xxxxxxx@github.com"

# --global 全局配置
# --local 仓库级配置
```

**Step 1**：列出签名的公钥

```bash
$: gpg --list-keys
$: gpg --list-key [用户ID]


/xxxx...xxxx/pubring.kbx
-----------------------------
pub   edxxx 2023-xx-xx [SC] [expires: 2025-xx-xx]
      C1Fxxxxxxx79D
uid           [ultimate] yourName <xxxxxxx@github.com>
sub   cvxxx 2023-xx-xx [E] [expires: 2025-xx-xx]
```

列出私钥：

```bash
$: gpg --list-secret-keys
```

**Step 2**：在 GitHub 中添加 GPG 公钥。具体步骤参照 [这里](https://docs.github.com/cn/authentication/managing-commit-signature-verification/adding-a-new-gpg-key-to-your-github-account)

**Step 3**：修改本地 git 配置

```bash
$: git config --global user.signingkey [PRIMARYKEYID]
```

- 其中 **PRIMARYKEYID** 为主公钥 `C1Fxxxxxxx79D`

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

- 列出秘钥:

```bash
$: gpg --list-keys
```

- 删除私钥:

```bash
$: gpg --delete-secret-keys your@email.addr
```

`your@email.addr` 为你加密的邮箱，在 `uid`中显示

- 删除公钥：

```bash
$: gpg --delete-keys your@email.addr
```

- 删除私钥和公钥:

```bash
$: gpg --delete-secret-and-public-key your@email.addr
```

- 添加子公钥:

  GPG 提供了交互式添加子密钥的方法，`gpg --expert --edit-key [用户ID]` 进入交互式密钥编辑，使用 `addkey` 添加子密钥。

## 参考文档

- [简明 GPG 概念](https://zhuanlan.zhihu.com/p/137801979)
- [使用 GPG 为 GIthub 签名](https://www.yangqi.show/posts/gpg-github)
- [GPG 教程](https://www.bitlogs.tech/2019/01/gpg%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B/)
