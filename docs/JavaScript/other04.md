---
title: 利用 husky 进行 git 提交前检查
icon: javascript
date: 2023-05-24
category:
  - javascript
tag:
  - 工程化

---

# 利用husky进行 git 提交前检查

Husky 是 git hook 工具，**它允许我们轻松地处理Git Hooks 并在提交代码时运行我们想要的脚本**。 它的工作原理是在我们的 package.json 文件中加入一个对象，配置Husky 来运行我们指定的脚本。 之后，Husky 会管理我们的脚本将在Git 生命周期的哪个阶段运行。

lint-staged：**是一个前端文件过滤的工具**。 是一个仅仅过滤出Git代码暂存区文件（被committed 的文件）的工具。 Lint-staged 仅仅是文件过滤器，不会帮你格式化任何东西

通常来说 git 推送代码的过程为：`git add` - `git commit` - `git push`，在 `git commit` 期间进行代码检测操作是较好的。接下来看处理过程：

> 注意，以下皆为 husky@6.0 以上的版本，截止 2023.05.23 为 husky@8.0.3。
>
> 旧版本的 husky 的构建流程同现在的不同，具体问题可以查看[《husky为什么放弃了之前的配置方式》](https://zhuanlan.zhihu.com/p/366786798)。
>
> 简单的说，新版本的配置过程比旧版本的多一个动作：
>
> 老版本：安装 ——> 配置
>
> 新版本：安装 ——> 启用 ——> 生成 `.husky` 相关配置

- 安装依赖：

  ```bash
  $: npm install -D husky lint-staged
  ```

- 启动 husky：

  - 初次配置是手动启动：

    ```bash
    $: npx husky install
    ```

  - 后续其它小伙伴下拉代码是“被动启动 husky” ：

    在 `package.json` 中添加 prepare 脚本命令，这个命令会在 `npm install` （不带参数）之后自动执行，也就是它会在安装完依赖后自动执行 `husky install` 命令。

    ```json
    // package.json
    {
      "scripts": {
        "prepare": "husky install"
      }
    }
    ```

    这个命令会在 `.husky/` 目录中添加相关依赖。

- 添加 Git Hook 指令：

  ```bash
  $: npx husky add .husky/pre-commit "npm run lint-staged"
  ```

  我这里是在 git commit 之前添加运行 “`npm run lint-staged`” 脚本指令。这时，会在 `.husky/` 目录下新增一个名为 pre-commit 的 shell 脚本，内容如下：

  ```shell
  #!/usr/bin/env sh
  . "$(dirname -- "$0")/_/husky.sh"
  
  npm run lint-staged
  ```

  此时，已经完成了 Husky 部分的相关配置了，接下来为 lint-staged 进行配置。

- 配置 `lint-staged`

  我们设置的脚本是“`npm run lint-staged`”，因此需要继续在`package.json` 中添加相关指令：

  ```json
  // package.json
  {
    "scripts": {
      "prepare": "husky install",
      "lint-staged": "lint-staged",
    }
  }
  ```

  即“`npm run lint-staged`”脚本的作用是直接执行 `lint-staged`，因此，接着需要对 `lint-staged`进行设置，依旧在 `package.json` 中：

  ```json
  // package.json
  {
    "scripts": {
      "prepare": "husky install",
      "lint-staged": "lint-staged",
    },
    "lint-staged": {
      "src/**/*.{js,jsx,tsx,ts,less,sass,md}": [
        "prettier --write"
      ]
    },
  }
  ```

  上述`lint-staged`配置中的意思是 **表明只对src 目录下的`git add`到 stage 区的文件进行扫描**，且同时对这些文件执行 `prettier --write` 操作。

  > `prettier --write` 操作需要安装相应的 prettier 依赖包：
  >
  > ```bash
  > $: npm install -D prettier
  > ```
  >
  > 具体使用可以看[《代码规范和自动格式化》](other01)

此时，我们已经完成了所有的配置，更多配置可以查看[官网](https://typicode.github.io/husky/guide.html)。
