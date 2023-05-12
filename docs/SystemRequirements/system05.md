---
title: 使用PicGo+GitHub 图床
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

# 使用 PicGo+GitHub 图床

图床有很多，看了半天最终入手 `PicGo` ，开源简单省心。为此记录一下配置过程。

## 创建自己的 GitHub 图床

首先要创建一个新的仓库，注意点是：

- 选择 Public 开源
- 应当新增一个 `Readme.md` ，好处在于会自定义生成 `main` 分支

创建完仓库后，我们从个人头像处进入账户设置（`Settings`） ,找到左侧边栏最底部的开发者设置（`Developer settings`）：

![Developer settings](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@main/img/20230309131309.png)

然后在 `Personal access tokens` -> `Tokens(classic)` ，点击右上角 `Generate new token` 选择`Generate new token(class)` :

![new token](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@main/img/20230309132556.png)

创建一个 Token ，用于操作仓库。由于是图传设置，所以有三个地方需要选择：

1. `token` 名称
2. `token` 过期时间
3. 定义 `scopes` 作用域定义个人令牌的访问

最后点击生成，注意生成的 `token` 只会显示一次。

![token](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@main/img/20230309133257.png)

到这里，Github 的图床配置已经完成，请务必妥善保存好生成的 `Token`

## 配置 `PicGO` 图床工具

首先下载运行 [PicGo 工具](https://github.com/Molunerfinn/PicGo/tags) ，依据自己的电脑配置下载对应的安装包，我们一般下载稳定版，不选 `beta`。

下载安装完后，我们还需要，安装一款插件：[picgo-plugin-github-plus](https://github.com/zWingz/picgo-plugin-github-plus) ，用于本地同步 Github 图床的上传和删除操作。

![PicGO Plug](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@main/img/20230309134314.png)

如上，类似于 `VScode` 在输入框中输入插件名称而后安装。

安装完后，我们在此插件设置界面对插件进行设置，选择 `配置 uploader github-plus` ，对插件进行配置。

对各项进行说明:

- `repo`：仓库名称，结构为 `账户名/仓库名` ;
- branch：图床的分支，由于之前的操作，我们图床的当前分支为 `main`，若不是，则自行检查；
- `token`：之前设置的 token，复制下来，粘贴至此；
- `path`： 图床在仓库中的保存路径，我们设置为 " `img`/ " 下；
- `customUrl`: 自定义域名，可以用于加速图片访问，也可以不设置。格式为: `https://cdn.jsdelivr.net/gh/[github用户名]/[仓库名]@[分支名称]` ，注意分支名称，在此处我们是在 `main` 分支下。
- `origin`： 源为 github。

同理，如果不用 `github-plus`，我们在 Github 图床中的设置也是和上面一样的。

好了，至此已经可以正常使用图床了，但是我们还可以设置快捷键，Mac 默认的是 `CommandOrControl + Shift` ，自动将剪切板中的图片上传至 Github。

另外，我们还可以自定义链接格式。在图片上传完毕后，使用图床的链接。这里我们使用默认的 `![$fileName]($url)`

好了，到此我们的图床使用流程为：

- 剪切板剪切图片；
- `CommandOrControl + Shift` 上传图片
- 待上传完毕，直接粘贴使用。
