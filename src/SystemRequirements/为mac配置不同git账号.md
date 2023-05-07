---
title: 为 Mac 配置不同的 Git 账号
icon: linux
# date: 2023-02-1
category:
  - linux
tag:
  - linux
star: true
# sticky: true
sticky: false
---

# 为 Mac 配置不同的 Git 账号

[toc]

## 总结

【注】全文的用户环境为 MacOS，一些文件的目录有所不同。

- 检查配置

  ```shell
  $: git config --list  # 加 --global 为全局配置查看

  // 配置全局git用户名
  $: git config --global user.name "zhangsan"
  // 配置全局git提交邮箱
  $: git config --global user.email "emailA@gmail.com"
  ```

- 创建本地秘钥

  ```shell
  $: ssh-keygen -t rsa -C 'emailA.gmail.com'
  # 三次回车, 可以不设置相应存储密码。emailA 的秘钥为全局git通用

  # 设置第二个邮箱 emailB@gmail.com
  $: ssh-keygen -t rsa -f ~/.ssh/id_rsa_emailB@gmail.com -C "emailB@gmail.com"
  ```

- 远程添加公钥

  ```shell
  # 复制邮箱的公钥(默认全局私钥为: id_rsa) 到远程
  $: pbcopy < ~/.ssh/id_rsa.pub

  # 额外的第二个邮箱 emailB@gmail.com，复制公钥到远程
  $: pbcopy < ~/.ssh/id_rsa_emailB@gmail.com.pub
  ```

- 配置 **config** 文件

  打开 git 配置文件所在文件夹： `open ~/.ssh`

  创建 `config` 文件（没有后缀）：

  ```shell
  # 通用配置,解决git版本过高问题
  Host *
  UseKeychain yes
  AddKeysToAgent yes
  IdentityFile ~/.ssh/id_rsa
  KexAlgorithms +diffie-hellman-group1-sha1

  # 全局默认邮箱
  Host gitlab.xxx.cn
  Hostname gitlab.xxx.cn
  IdentityFile ~/.ssh/id_rsa
  User company

  # gmail
  Host gmail.github.com
  Hostname github.com
  IdentityFile ~/.ssh/id_rsa_emailB@gmail.com
  User gmail
  ```

- 测试连接

  格式： `ssh -T git@{config里面的user}.{config里面的Hostname}`

  ```shell
  # 全局默认的个人账户，若没有配置 config， 则直接 ssh -T git@gitlab.xxx.cn
  $: ssh -T git@company.gitlab.xxx.cn

  # 额外配置邮箱 <User> 为全局配置中的 User
  $: ssh -T git@gmail.github.com
  ```

- clone 使用

  格式： `git clone git@{config里面的user}.{config里面的Hostname}:{具体项目地址}.git`

  ```shell
  # User 为 'gmail'
  $: git clone git@gmail.github.com:vuejs/vue.git
  ```

- 不同项目不同的邮箱

  由于存在多个账户，为避免提交代码时使用个人邮箱，在每个项目前，最好进行 git 邮箱检查。

  若 `git config --list` 局部本地配置与预期不符，则进行局部设置。

  ```shell
  $: cd 项目名
  # 设置该项目使用的git账号和邮箱
  $: git config user.name 'AnotherName'
  $: git config user.email 'AnotherEmail'
  # 查看该项目git账号是否正确
  $: git config --list
  ```

## 准备

首先，先 [下载 Git](https://git-scm.com/download) ，并按照提示，一路选择安转即可。

安转完成后，验证是否安转成功：

```bash
$: git --version
// 若出现类似以下提示, 则说明安装成功
// git version 2.24.3 (Apple Git-128)
```

- 【**Tips**】`$: ` 表示 `Bash` 指令符，只需复制后面指令即可。

## 添加全局默认 git 账号和邮箱, 用于每次提交代码

如果需要添加全局默认 git 账号的话，可以执行此步骤。若怕忘记弄混账号，则可对此步骤忽略（并不影响后续操作）：

```bash
// 配置全局git用户名, eg: git config --global user.name "zhangsan"
$: git config --global user.name "yourName"
// 配置全局git提交邮箱, eg: git config --global user.email "zhangsan@foxmail.com"
$: git config --global user.email "yourEmail"

// 配置完后,可以查看配置结果, 是否有 user.name 和 user.email 两项配置
$: git config --list
```

- 若不需要全局默认邮箱，清空默认的用户名和邮箱

```bash
$: git config --global --unset user.name
$: git config --global --unset user.email
```

## 生成秘钥

利用 Git 自带的加密算法，给不同的 Git 账户生成不同的 **ssh-key** 秘钥，如公司一个，个人一个账号（全局也算单独一个）。

### 检查秘钥

检测是否生成过秘钥，进入 `~/.ssh` 文件夹，若该文件中无类似 `id_rsa` 和 `id_ras.pub` 等文件，说明没有生成过秘钥。若有，则可以手动删除，或继续执行后续步骤，将其进行覆盖

```bash
// 方式1: 通过 cd 指令进入文件夹, 并通过 ls 指令查看文件夹下的所有文件
$: cd ~/.ssh
$: ls
// 方式2: 通过 open 指令打开图形化的文件夹界面
$: open ~/.ssh/
```

对 `.ssh` 文件夹下的文件进行简要说明，可以后续看完全文再来回看这部分，能更好理解其作用。

**id_rsa** : 私钥，通过 ras 算法对 git 账号生成。与公钥 **id_ras.pub** 是一对，注意一个 git 账号一般只有一对秘钥，当然你可以额外配置**全局默认 git 秘钥**，但是这样会多出来一个。私钥存放于本机中，用于与公钥验证。

**id_ras.pub** ：公钥，与私钥是一对，文件名结尾会多一个 `.pub` 表示是公开的意思。公钥需要存放于服务器上，用于信息交互。所以后续需要把它存储的内容复制粘贴到服务器内。

**config**: 相关配置，一般开始是没有 `config` 文件的，需要自己创建，在通过 `ssh` 连接主机时，对于不同的主机地址和密码需要不同的配置，后续会对该文件进行详细介绍。

**known_hosts**: 记录文件(不用管它= =)，当你用 `ssh` 方式去连接主机时，该文件会记录你访问主机的公钥，如果下次你再次访问相同主机时，这个时候 `OpenSSH` 会再次核对这个公钥，如果公钥不一样，那 `OpenSSH` 会发出警告，你的公钥被人改了，提醒你可能会收到 `DNS Hijack` 之类的攻击。

**known_hosts_old**: 字面意思，记录文件 **known_hosts** 的备份，也不用管它。

### 秘钥生成

生成秘钥的指令特别简单：

```bash
$: ssh-keygen -t rsa -C 'zhangsan.foxmail.com'
// 三次回车, 可以不设置相应存储密码
```

```bash
// 生成SHA信息
The key's randomart image is:
+---[RSA 3072]----+
|      o=.o...    |
|      +o* o+     |
|     .. +o=...    |
| .    ..oo.      |
|. .   ..S E      |
| o .. + o.*       |
|  = +. .= * .    |
| o = .oo. * + +   |
|  + o.o...+ o .  |
+----[SHA256]-----+
```

【**Tips**】如果该命令式默认生成，默认会 `~/.ssh/` 文件夹下 生成 **id_rsa** 和 **id_ras.pub** 俩个文件，并且此时对应的 git 账号为全局默认账号。就是上文中 `git config --global user.xxx ` 所设置的。如果你要配置不同的账号，那还需如下的额外操作。

**假设你的全局默认 Git 账号和邮箱是你的个人账号，此时需要配置公司的 git 账号** ，希望你能耐心看完。

假设你在公司的 git 邮箱是 **`yourName@company.com`** ，此时你要为这个邮箱生成相应的秘钥，为了**与全局默认 git 秘钥做区分**，我们将**秘钥文件**取名为 **`id_rsa_yourName@company.com`** ，但是你要加密的邮箱名还是 **`yourName@company.com`** ，对吧？因此，我们应当在终端键入以下指令：

```bash
$: ssh-keygen -t rsa -f ~/.ssh/id_rsa_yourName@company.com -C "yourName@company.com"
```

同样再按三次回车, 会在 `~/.ssh/ ` 文件下生成相应的秘钥对 **`id_rsa_yourName@company.com`** 和 **`id_rsa_yourName@company.com.pub`** 。我们可以打开 `~/.ssh` 文件夹进行查看，如上一小节中 **检查秘钥** 一样，键入 ` open ~/.ssh/` 查看是否有相应的文件。

同理如果你要再生成其它邮箱的 git 账号，只需将 **`yourName@company.com`** 改成 你的其它邮箱就行了。

### 小结

- 通过 `ssh-keygen ` 可以对邮箱利用 ras 加密方式， 在 `~/.ssh/` 文件夹下生成相应的秘钥对。
- 如果要设置不同的 git 账户，在生成邮箱秘钥时，应当取相应别名；
- 通过指令 `ssh-keygen -t ras -C 'yourEmail'` 生成的秘钥为全局默认 git 账户邮箱，使用它需要利用 `git config --global user.xxx ` 进行全局 git 设置。
- **如果你没有设置全局默认 git 账号和邮箱，那么全部统一按照配置额外的 git 账号设置，即： 不同邮箱重复同给公司邮箱设置 git 账号的方法。** 下同！

## 远程 **Git 仓库** 添加公钥

假设同上节所述，我们现在有的秘钥：

- 全局默认 git 账号秘钥 **`id_rsa`** ： 个人邮箱秘钥 --> 在 Github 中使用
- 公司邮箱设置的 git 账号秘钥 **`id_rsa_yourName@company.com`** : 公司邮箱秘钥 --> 在公司的 GitLab 中使用

因此，我们要将**不同 git 账号**的 **公钥** ，添加到**不同**的 **git 仓库** 中去。一般在个人设置中，会有一个 **SSH** 的选项 --> **Add SSH Key** 。

```bash
// 复制个人邮箱的公钥(私钥为: id_rsa)
$: pbcopy < ~/.ssh/id_rsa.pub

// 复制公司邮箱的公钥(私钥为: id_rsa_yourName@company.com)
$: pbcopy < ~/.ssh/id_rsa_yourName@company.com.pub
```

## 配置 **config** 文件

在前文中介绍过，`~/.ssh/` 下的 `config` 文件是 Git 的配置文件。接下来，我们开始对它进行简单设置。

1. 首先，通过指令 `open ~/.ssh/` 打开 `ssh` 目录，打开 `config` 文件，若没有则创建该文件。

2. 为公司账号做相应的配置（尾部的 gmail 配置作为参考用， 实际只需要设置公司邮箱部分）：

**config** 文件内容如下:

```bash
# 通用配置,解决git版本过高问题
Host *
UseKeychain yes
AddKeysToAgent yes
IdentityFile ~/.ssh/id_rsa
KexAlgorithms +diffie-hellman-group1-sha1

# 公司邮箱
Host gitlab.xxx.cn
Hostname gitlab.xxx.cn
IdentityFile ~/.ssh/id_rsa_yourName@company.com
User yourName

#gmail
Host gmail.github.com
Hostname github.com
IdentityFile ~/.ssh/id_rsa_xxx@gmail.com
User gmail
```

我们来看看配置的相关设置：

| 键           | 值       | 规则                                                                                                                                                                                                                                       |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Host         | 主机     | 主机名。如果你不知道，可以填写主机名，**通用配置就填 "\*"**。                                                                                                                                                                              |
| **Hostname** | 主机名   | **【必须准确无误】**这里填写对应 Git 仓库的公有地址。如果你不知道，可以在 Git 仓库下通过 SSH 方式克隆一个项目，一般会出现如: `git@github.com:vuejs/vue.git` ，在 **git@** **后面的 `github.com` 即为主机名**。                             |
| IdentityFile | 身份文件 | **【写绝对路径】**相应账号的私钥存放地址，如：`~/.ssh/id_rsa`                                                                                                                                                                              |
| **User**     | 用户     | 用户名。但是建议使用同**Host**的前面的名称部分。如：`Host gmail.github.com` ，则填写 `github` 。在后面具体 clone 操作中都会用到这个**User** 用户名。本文配置中，是为了后续做区分 因此 填写的是 ``yourName", 在前文总结中写的是 "company"。 |

再来看开始的通用配置，可有可无，主要用于解决 **`Unable to reach a settlement: [diffie-hellman-group1-sha1, diffie-hellman-group-exchange-sha1]...`** 的问题。许多公司的 Git 仓库还在用老旧的 `diffie-hellman-group1-sha1` 和 `diffie-hellman-group-exchange-sha1` 密钥交换算法，但是 **OpenSSH** 在 6.7 版本之后默认不再采用以上算法，因此我们需要在**相应主机**下手动添加 `KexAlgorithms +diffie-hellman-group1-sha1` 。

【**Tips**】我这里给出的是默认全局添加，若是公司出现类似报错，需要在公司的账户尾部添加 该设置！

## 测试连接

测试 Git 账户连接：如果单个账户情况一般就是 `ssh -T git@xxx主机名` ，如果配置了 config，那么可以这样测试：` `**ssh -T git@{config 里面的 user}.{config 里面的 Hostname}**

```bash
// 全局默认的个人账户
$: ssh -T git@gmail.github.com

// 额外设置的公司git账户(同上文中 config 的设置, User YourName)
// ssh -T git@<User>.gitlab.xxx.cn
$: ssh -T git@yourName.gitlab.xxx.cn
```

- **「第一次连接」**会出现主机连接验证： `Are you sure you want to continue connecting (yes/no/[fingerprint])? ` **输入** **`yes`** **回车**就行了。
- 若连接成功则会出现类似信息:

```bash
Hi xxx！ You've successfully authenticated.but GitHub does not provide shell acess
```

- 若**连接失败**，且同全文设置一样，依旧报错！请检查 **Git 仓库的端口号**是否正确。若是端口号错误，可以在 `config` 配置文件中，在相应账户下添加相应的 `Port 端口号` ，端口号设置； 或者自行在 诸如： **GIthub** 和 **Gitee** 等仓库进行检测。

## 使用 SSH 方法

做完上述操作后，就可以愉快玩耍啦！我们利用 `git clone` 进行检验：

【注】`git@github.com:vuejs/vue.git` 为 Github 仓库中的示例的 **SSH clone** 地址，**公司邮箱**克隆的地址这里也用这个**作为示例**！！！

```bash
// 进入要克隆的工作目录
$: cd xxxx

// 利用全库默认的个人账户进行下载
$: git clone git@github.com:vuejs/vue.git

// 利用公司的账户进行下载
$: git clone git@yourName.github.com:vuejs/vue.git
// 实际上就是 git clone git@<User>.github.com:vuejs/vue.git
```

## 为不同项目配置不同的 Git

```shell
$: cd 项目名
// 设置该项目使用的git账号和邮箱
$: git config user.name 'AnotherName'
$: git config user.email 'AnotherEmail'

// 若有 gpg 签名 和 设置自动签名
$: git config user.signingkey 'PRIMARYKEYID'
$: git config commit.gpgsign true

// 查看该项目git账号是否正确
$: git config --list

# --global 全局配置
# --local 仓库级配置
```

感谢你的耐心阅读，希望你看完是带着收获离开的！
