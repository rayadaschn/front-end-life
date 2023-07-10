---
title: standard-version 自动打 git tag
icon: linux
date: 2023-07-08
category:
  - linux
tag:
  - linux
sticky: false
---

standard-version 是一个基于 Conventional Commits 规范的版本自动化管理工具。它可以自动化地生成 changelog、更新版本号和生成 git 标签等操作，使得版本管理和发布流程更加规范化和自动化。

Conventional Commit 规范在[《Git 操作手册》](GitOperationManuals) 一文中介绍过，这里不再赘述。本文介绍一下 standard-version 这个工具是如何通过 package.json 更新 CHANGELOG 的。

[官方文档传送门 🚪](https://github.com/conventional-changelog/standard-version#bumpfiles-packagefiles-and-updaters)

## 基本的 Git 发版过程

一个基本的 Git 版本发布流程，包括以下具体步骤：

- `git pull origin master`：从远程仓库的 master 分支拉取最新代码。这是为了确保本地代码与远程代码保持同步，避免版本冲突。
- 根据 package.json 中的 version 更新版本号和 changelog。通常可以使用自动化工具，如 standard-version 或 npm version 等，来自动生成版本号和 changelog，以提高版本管理的规范性和效率。
- `git add -A`：将所有变更的文件添加到 Git 暂存区。
- `git commit`：提交改动到本地 Git 仓库，并添加提交信息。提交信息应当清晰、简洁、明确，以便其他开发人员理解改动的内容。
- `git tag`：打上版本号标签，并将标签推送到远程仓库。例如，可以使用 `git tag v1.0.0` 命令打上版本号为 1.0.0 的标签。标签可以方便地标记版本和发布信息，同时也可以用于 Git 回退和比较等操作。
- `git push`：将本地代码和标签推送到远程仓库。例如，可以使用 `git push origin master --tags` 命令将本地 master 分支和所有标签推送到远程仓库。

上述过程中绝大部分可以通过 standard-version 来自动化完成，以减少意外的产生。

standard-version 所做的事情实际上就 3 点: 自动化升级 `package.json` 中的版本号、更新/生成 `CHANGELOG.md` 和 tag 版本。下面看一下具体如何使用。

## 安装和配置

在项目中安装：

```bash
$: npm install -D standard-version
```

或全局安装：

```bash
$: npm install -g standard-version
```

安装完后，在项目的 package.json 中添加脚本命令:

```json
// package.json
"scripts": {
    // other...
    "release": "standard-version"
}
```

## 使用

在项目目录下使用，以更新 CHANGELOG 和版本号：

```bash
# 方法 1:  局部安装使用方法
$: npx standard-version
# 方法 2:  局部安装使用刚刚添加的脚本命令
$: npm run release

# 方法 3:  若全局安装则直接使用
$: standard-version
```

运行上面的命令后，standard-version 工具会自动根据 Conventional Commits 规范生成新的版本号和 changelog，并更新 package.json 和 CHANGELOG.md 文件。同时，它会自动打上 git 标签，并等待 git push 推送到远程仓库。

## 定制使用

定制 standard-version：standard-version 工具支持定制化配置，以满足不同项目的需求。具体来说，可以通过以下方式进行定制化配置：

- `--first-release`：缩写 `-f`，指定是否为第一个版本发布，如果是，则不升级版本号，并会自动将版本号设置为 1.0.0。
- `--release-as <version>`：缩写 `-r <version>`，手动指定要发布的版本号。

  ```bash
  $: standard-version -r minor
  # output tag: v1.1.0

  $: standard-version -r 1.0.0
  # output tag: v1.0.0

  $: standard-version -r 1.0.1-test
  # output tag: v1.0.1-test
  ```

- `--tag-prefix [prefix]`：缩写 `-t [prefix]`，指定 git 标签的前缀，默认为 `v`。

  ```bash
  $: standard-version -t 'stable-'
  # output tag: stable-1.0.1
  ```

- `--prerelease [suffix]`：缩写 `-p [prefix]`，指定 git 标签的后缀。

  ```bash
  $: standard-version -p 'beta'
  # output tag: v1.0.1-beta.0

  $: standard-version -p 'beta'
  # output tag: v1.0.1-0
  ```

- `--dry-run`：缩写 `-d`，运行 standard-version 命令的模拟模式，不会对代码进行实际修改和提交。

## 使用技巧

若是在 package.json 中添加了脚本命令

```json
// package.json
"scripts": {
    // other...
    "release": "standard-version"
}
```

则在项目运行时，也可添加定制参数：

```bash
$: npm run release -- --dry-run
```

其中，第一个 `--` 是为了告诉 npm 命令后面的参数将会被传递给执行的脚本，而第二个 `--` 是为了将参数传递给 `npm run release` 命令所调用的脚本。

因此，为了将参数准确地传递给执行的脚本，需要在 npm run 命令后面添加两个 `--`，其中第一个 `--` 是告诉 npm 命令后面的参数将会被传递给执行的脚本，而第二个 `--` 是将参数传递给 npm run 命令所调用的脚本。通过这种方式，才能够正确地传递参数并执行脚本。
