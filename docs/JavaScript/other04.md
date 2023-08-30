---
title: 利用 husky 进行 git 提交前检查
icon: javascript
date: 2023-05-24
category:
  - javascript
tag:
  - 工程化
---

# 利用 husky 进行 git 提交前检查

本文将系统梳理一遍，在新项目中配置 Husky 对 git 进行检查的过程。在最后实战几个场景。

## 工具介绍

- Husky 是 git hook 工具，**它允许我们轻松地处理 Git Hooks 并在提交代码时运行我们想要的脚本**。 它的工作原理是在我们的 package.json 文件中加入一个对象，配置 Husky 来运行我们指定的脚本。 之后，Husky 会管理我们的脚本将在 Git 生命周期的哪个阶段运行。

- lint-staged：**是一个前端文件过滤的工具**。 是一个仅仅过滤出 Git 代码暂存区文件（被 committed 的文件）的工具。 Lint-staged 仅仅是文件过滤器，不会帮你格式化任何东西。

> 常见的钩子插件：
>
> 1. `commitlint`：用于检测提交的信息。
> 2. `lint-staged`：检查本次修改更新的代码，并自动修复并且可以添加到暂存区。
> 3. `pre-commit`：`git hooks`的钩子，在代码提交前检查代码是否符合规范，不符合规范将不可被提交。
> 4. `commit-msg`：`git hooks`的钩子，在代码提交前检查`commit`信息是否符合规范。
> 5. `commitizen`：`git`的规范化提交工具，帮助你填写`commit`信息，符合 [约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0/) 要求。

## 配置过程

通常来说 git 推送代码的过程为：`git add` - `git commit` - `git push`，在 `git commit` 提交之前检测操作是较好的。

Git 的钩子通常是放置在 `.git/hooks/` 文件夹内，它在我们初始化仓库时，便会自动生成。一般这个文件里会有如下内容：

![Git Hooks](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202305291546790.png)

以 `.sample` 结尾的文件便是钩子脚本，来看一下几个最常用的 Git 本地钩子：

1. pre-commit：预提交钩子，在每次运行 `git commit` 命令之前执行；
2. prepare-commit-msg：在调用 `pre-commit` 钩子之后执行。具体是在 Git 进入默认提交消息编辑器之前、生成 commit 信息前执行。该钩子在 commit-msg 钩子之前执行，允许在默认编辑器启动之前对提交消息进行额外的处理，比如为全新的 commit 添加 issue 编号或者其他信息。
3. commit-msg：在 Git 执行完默认的提交消息编辑器之后、生成 commit 信息（包括消息、作者、时间等）之前执行。可以用来验证或重构提交消息的格式或内容，例如强制确保提交消息符合团队约定、添加额外的元数据等。

   - 需要注意的是，这两个钩子都可以接收一个参数 $1，该参数表示即将被提交的信息文件的路径。

4. post-commit：在 `commit-msg` 执行之后，用于改变 git commit 命令的输出，主要用于消息通知。

一般来说，pre-commit 和 commit-msg 俩个钩子用的最多。前者用于检测代码质量；后者用于约束 commit 提交信息。接下来看处理过程：

> 注意，以下皆为 husky@6.0 以上的版本，截止 2023.05.24 为 husky@8.0.3。
>
> 旧版本的 husky 的构建流程同现在的不同，具体问题可以查看[《husky 为什么放弃了之前的配置方式》](https://zhuanlan.zhihu.com/p/366786798)。
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

  > shell 脚本释义：
  >
  > `#!/usr/bin/env sh` 是一个 Unix/Linux 操作系统中用来指定脚本解释器的标准写法。该行以“`#`”开头，其目的是标记此文件的解释器类型和路径，告诉操作系统应该如何运行它。
  >
  > 在这个例子中，它指定了使用 `/usr/bin/env` 命令查找 `sh` 解释器，并将其作为解析当前脚本文件的默认解释器。
  >
  > `$(dirname -- "$0")` 与 `_husky.sh` 配合使用来引入一个名为 "husky" 的 Git Hook 工具，具体表示：
  >
  > - `$0` 表示当前 Shell 脚本的文件名。
  > - `--` 表示停止处理命令行选项参数，确保后续所有内容都被解释器视为参数。
  > - `dirname` 命令返回指定路径的上级目录名。
  > - `"$0"` 使用引号对 `$0` 进行转义，以允许包含空格或其他特殊字符。
  > - `. "$(dirname -- "$0")/_/husky.sh"` 会将整个 `husky.sh` 脚本文件导入到当前 Shell 类型的脚本环境中，采用的 "." 符号意味着当前 Shell 脚本将以另一个 Shell 脚本文件中的所有其它命令、函数和配置进行装载执行。
  >
  > 然后执行 `npm run lint-staged` 。

  此时，已经完成了 Husky 部分的相关配置了，接下来为 lint-staged 进行配置。

- 配置 `lint-staged`

  我们设置的脚本是“`npm run lint-staged`”，因此需要继续在`package.json` 中添加相关指令：

  ```json
  // package.json
  {
    "scripts": {
      "prepare": "husky install",
      "lint-staged": "lint-staged"
    }
  }
  ```

  即“`npm run lint-staged`”脚本的作用是直接执行 `lint-staged`，因此，接着需要对 `lint-staged`进行设置，依旧在 `package.json` 中：

  ```json
  // package.json
  {
    "scripts": {
      "prepare": "husky install",
      "lint-staged": "lint-staged"
    },
    "lint-staged": {
      "src/**/*.{js,jsx,tsx,ts,less,sass,md}": ["prettier --write"]
    }
  }
  ```

  上述`lint-staged`配置中的意思是 **表明只对 src 目录下的`git add`到 stage 区的文件进行扫描**，且同时对这些文件执行 `prettier --write` 操作。

  > `prettier --write` 操作需要安装相应的 prettier 依赖包：
  >
  > ```bash
  > $: npm install -D prettier
  > ```
  >
  > 具体使用可以看[《代码规范和自动格式化》](other01)

此时，我们已经完成了所有的配置，更多配置可以查看[官网](https://typicode.github.io/husky/guide.html)。

## Husky 配置实战

> 场景：利用 Husky 对提交的代码进行 ESlint 检测，并对不规范的代码利用 Prettier 进行修复。
>
> 加料：【特殊场景】假设当前项目在 GitA 仓库的 mySonProjectName 目录下，即此时 `.git` 文件不再是在项目的外层，而是在 `./GitA/mySonProjectName` 下。

注意一般情况下是仓库即为项目文件保存位置，无需下面的 CD，请依据个人情况进行配置！

配置过程：

1. 从 Git 仓库中将项目下拉下来，并 CD 切换进项目目录。

   ```bash
   # a. 拉下项目
   $: git clone GitA

   # b. 切换目录，进入项目文件
   $: cd mySonProjectName
   ```

2. 安装依赖，ESlint 和 Prettier 的配置详情可以看[《代码规范和自动格式化》](other01)。

   ```bash
   # 安装所需基本包
   $: npm install -D husky lint-staged eslint prettier

   # 安装 ESlint 和 Prettier 解决冲突 plugins, 若是 Vue 等项目可安装其对应的其它 plugins
   $: npm install -D eslint-config-prettier eslint-plugin-prettier
   ```

   > [eslint-plugin-prettier](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprettier%2Feslint-plugin-prettier)： 基于 prettier 代码风格的 eslint 规则，即 eslint 使用 prettier 规则来格式化代码。
   >
   > [eslint-config-prettier](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprettier%2Feslint-config-prettier)： 禁用所有与格式相关的 eslint 规则，解决 prettier 与 eslint 规则冲突，确保将其放在 extends 队列最后，这样它将覆盖其他配置。
   >
   > 后续只需在扩展末尾添加 `"plugin:prettier/recommended"` 即可。

3. 创建 ESlint 和 Prettier 的配置文件。

   - 创建 ESlint 配置文件，依据个人需求选择相应的配置。

     ```bash
     $: npx eslint --init
     ```

     如图依据个人项目需求生成相应的 ESlint 配置文件：

     <img src="https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202305251318216.png" style="zoom:50%;" />

   - 手动创建 Prettier 配置文件 `.prettierrc` ，该文件为 prettier 的默认配置文件：

     ```js
     // .prettierrc
     {
      "endOfLine": "lf",
      "singleQuote": true,
      "printWidth": 150,
      "tabWidth": 2,
      "indentStyle": "space",
      "bracketSpacing": true,
      "useTabs": true
     }
     ```

   - 创建 `.eslintignore` 文件，排除部分无需检查的代码文件：

     ```.eslintignore
     .eslintrc.cjs
     /node_modules/
     public
     dist
     ```

   - 为前面生成的 ESlint 配置文件，添加扩展，使得以 Prettier 进行修复代码，并解决冲突。我这里为 `.eslintrc.cjs` ：

     ```js
     module.exports = {
       // 其它配置
       extends: [
         'eslint:recommended',
         'plugin:vue/vue3-essential',
         'plugin:@typescript-eslint/recommended',
         // --- 在末尾添加如下插件, 即为此前安装的插件配置 ---
         'plugin:prettier/recommended',
       ],
       // 其它配置
     }
     ```

     > 值得注意的是，此处是 Vue3 + Ts 的配置，extends 中的“`plugin:vue/vue3-essential`” 插件，存在解析器 “`vue-eslint-parser`”，用`npx eslint --init` 生成的配置中，默认使用的是“_`@typescript-eslint/parser`_”解析器，而 extends 的顺序是 ts 在 vue 后面，因此将 vue 的解析器覆盖掉了，所以需要对解析器的配置做出微小调整：
     >
     > ```js
     > // "parser": "@typescript-eslint/parser",
     > "parser": "vue-eslint-parser",
     > "parserOptions": {
     >    "ecmaVersion": "latest",
     >    "parser": "@typescript-eslint/parser",
     >    "sourceType": "module"
     > },
     > ```

     最终的“`.eslintrc.cjs`”：

     ```js
     module.exports = {
       env: {
         browser: true,
         es2021: true,
         node: true,
       },
       extends: [
         'eslint:recommended',
         'plugin:vue/vue3-essential',
         'plugin:@typescript-eslint/recommended',
         'plugin:prettier/recommended',
       ],
       overrides: [],
       parser: 'vue-eslint-parser', // 修改解析器
       parserOptions: {
         ecmaVersion: 'latest',
         parser: '@typescript-eslint/parser', // 添加解析器
         sourceType: 'module',
       },
       plugins: ['vue', '@typescript-eslint'],
       rules: {},
     }
     ```

     此时，已经可以用 Prettier 去修复 ESlint 检测出的不合规的代码了。可在 `package.json` 中添加 `scripts`：

     ```json
     {
       "scripts": {
         "dev": "vite",
         "build": "vue-tsc && vite build",
         "preview": "vite preview",
         "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix"
       }
     }
     ```

     我们添加了 `lint` 指令，然后运行 `npm run lint` 即可检测修复不合规的代码了。接下来，我们将这个步骤添加到 git commit 期间去。

   - 配置 Husky 和 lint-staged ：

     - 启动 Husky ，这里的是特殊场景，需要到外面的父级目录去启动 Husky ，并将 Husky 安装到项目所在文件夹。因此需要在 `package.json` 中添加如下 prepare：

       ```json
       // package.json
       {
         "scripts": {
           "prepare": "cd .. && husky install [mySonProjectName]/.husky"
         }
       }
       ```

       这里面的 mySonProjectName 是该项目的项目名(实际编写前端项目的文件夹名)。成功运行后，在项目目录下创建出基础的 Husky 文件夹。

     - 添加 Git Hook 指令：

       ```bash
       $: npx husky add .husky/pre-commit "cd [mySonProjectName] && npm run lint-staged"
       ```

       手动创建 husky 的钩子指令文件！当然这里也需要区分项目目录，在执行指令前，先 `cd [mySonProjectName]` 切换到目的文件夹后再执行`npm run lint-staged`实际 lint 指令。

       其余就都和常规项目都是一样的啦。

     - 继续配置 `package.json` ：

       ```json
       // package.json
       {
         "scripts": {
           "prepare": "cd .. && husky install mySonProjectName/.husky",
           "dev": "vite",
           "build": "vue-tsc && vite build",
           "preview": "vite preview",
           "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix",
           "lint-staged": "lint-staged"
         },
         "lint-staged": {
           "src/**/*.{vue,js,ts,jsx,tsx}": ["eslint --fix"]
         }
       }
       ```

   以上即完成了所有的配置了，在下次提交代码时，会自动触发检测修复代码指令。

​
