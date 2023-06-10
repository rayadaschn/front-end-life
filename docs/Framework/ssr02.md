---
title: Nuxt 之项目创建
icon: nuxt
date: 2023-06-08

category:
  - 框架
tag:
  - ssr
star: true
sticky: false
---

# Nuxt 之项目创建

在上一篇文章[《服务端渲染 SSR 概述》](./ssr01) 中，简单介绍了一下关于 Nuxt 的一些基本概念。该文接着记录一下从头创建一个 Nuxt 服务端渲染的项目过程。

项目最终配置地址可见 [Github](https://github.com/rayadaschn/nuxt3-demo.git)。

该项目包含以下内容：

- Nuxt3 以 Vue3、Typescript 和 Vite 进行开发；
- 利用 Sass 进行 css 代码编写;
- 利用 Pinia 代替 Vuex 进行状态管理；
- 路由为文件式管理；
- Git Husk 进行 代码提交验证
- 使用 ESlint、Prettier 和 Stylelint 进行代码检测修复；
- 集成 Vueuse 作为 Hooks 库（不是项目必须项）；

## 环境配置

- Node.js 当前 LTS 已为 V18;
- VSCode
- VSCode 插件:
  - Volar
  - ESLint
  - Prettier
  - Stylelint

## 安装 Nuxt3

本项目依旧选用 npm 作为包的管理工具，随着 node 的升级（版本应当大于 16.11），同 pnpm 等差距感觉并不大，当然依据个人喜好进行管理便可。

- 官方脚手架安装：

  ```bash
  $: npx nuxi init <project-name>
  ```

- 安装依赖：

  ```bash
  $: npm install
  ```

- 启动服务：

  ```bash
  $: npm run dev -- -o
  ```

  > 在终端中，-- 符号通常被用作分隔符来将选项和参数分离开，比如 command -- option1 --arg value。它的作用是告诉命令行解析器不要解释其后面的参数为选项，而是作为参数传递给运行的程序或脚本。
  > 浏览器自动打开 `http://localhost:3000`

至此，已经完成了项目的第一步。

## 配置项目规范

在之前的 [代码规范和自动格式化](other01.md) 、[利用 husky 进行 git 提交前检查](other04) 和 [新版 stylelint 的配置](other05) 详细介绍了这块的配置需求，在此项目中，直接用上~

### ESLint 和 Prettier 规范 JS 代码

1. 安装依赖

   ```bash
   $: npm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier
   ```

   - eslint：核心包；
   - prettier：核心包；
   - eslint-config-prettier：禁用所有与格式相关的 eslint 规则，解决 prettier 与 eslint 规则冲突，确保将其放在 extends 队列最后，这样它将覆盖其他配置；
   - eslint-plugin-prettier：基于 prettier 代码风格的 eslint 规则，即 eslint 使用 prettier 规则来格式化代码。

2. 在根目录创建 ESLint 和 Prettier 的配置文件：

   ```bash
   $: npx eslint --init
   ```

   对生成的 ESlint 配置文件，添加扩展，使得以 Prettier 进行修复代码，并解决冲突。我这里为 `.eslintrc.cjs` :

   ```js {11,14,17}
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
     rules: {
       'vue/multi-word-component-names': ['off'],
     },
   }
   ```

   创建 `.eslintignore` 文件，排除部分无需检查的代码文件：

   ```.eslintignore
   .eslintrc.cjs
   .prettierrc
   /node_modules/
   public
   dist
   ```

   手动创建 Prettier 配置文件 `.prettierrc` ，该文件为 prettier 的默认配置文件：

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

   此时，已经可以用 Prettier 去修复 ESlint 检测出的不合规的代码了。可在 `package.json` 中添加 `scripts`：

   ```json
   {
     "scripts": {
       "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix"
     }
   }
   ```

### Stylelint 规范 CSS

1. 安装依赖:

   ```bash
   $: npm install -D stylelint stylelint-config-standard postcss-html stylelint-config-recommended-vue stylelint-config-recess-order
   ```

   ```bash
   # 若要配置完整的 Sass, 还需要安装 stylelint-config-recommended-scss
   $: npm install -D sass stylelint-config-recommended-scss
   ```

   - stylelint：核心库;
   - stylelint-config-standard：CSS 规范;
   - postcss-html：stylelint-config-recommended-vue 中依赖这个包;
   - stylelint-config-recommended-vue：由 stylelint （CSS 代码检查工具）提供的推荐配置之一，专门用于 Vue.js 项目的 CSS/SCSS 格式和规范规则;
   - stylelint-config-recess-order：规范 CSS 编写属性顺序；
   - stylelint-config-recommended-scss: 是有关 SCSS 最流行、最常用的规则的推荐配置方案，包含了许多推荐的 SCSS 格式和规范（如嵌套、变量命名等）。

2.安装完依赖，还需要再项目的根目录创建一个配置文件：`stylelint.config.{cjs,js}`：

```js
  // stylelint.config.js
  module.exports = {
    /* 继承其它规则 */
    extends: [
      'stylelint-config-standard', // 配置stylelint拓展插件
      'stylelint-config-recommended-vue', // 配置 vue 样式格式化
      'stylelint-config-recommended-vue/scss', // 支持 sass, 配置 vue 样式格式化
      'stylelint-config-recess-order', // 配置stylelint css属性书写顺序插件,
    ],
    overrides: [
      // 扫描 .vue/html 文件中的<style>标签内的样式
      {
        files: ['**/*.{vue,html}'],
        customSyntax: 'postcss-html',
      },
    ],
    order/properties-order: [
      "position",
      "display",
      "float",
      "top",
      "right",
      "bottom",
      "left",
      "z-index",
      "overflow",
      "clear",
      "width",
      "height",
      "max-width",
      "max-height",
      "min-width",
      "min-height",
      "padding",
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
      "margin",
      "margin-top",
      "margin-right",
      "margin-bottom",
      "margin-left",
      "margin-collapse",
      "margin-top-collapse",
      "margin-right-collapse",
      "margin-bottom-collapse",
      "margin-left-collapse",
      "font",
      "font-family",
      "font-size",
      "font-smoothing",
      "osx-font-smoothing",
      "font-style",
      "font-weight",
      "hyphens",
      "src",
      "line-height",
      "letter-spacing",
      "word-spacing",
      "color",
      "text-align",
      "text-decoration",
      "text-indent",
      "text-overflow",
      "text-rendering",
      "text-size-adjust",
      "text-shadow",
      "text-transform",
      "word-break",
      "word-wrap",
      "white-space",
      "vertical-align",
      "list-style",
      "content",
      "box-shadow",
      "border-radius",
      "transform"
    ]
  }
```

### Husk 代码提交检测

1. 安装依赖包

   ```bash
   $: npm install -D husky lint-staged
   ```

   - husky：git Hook 核心包
   - lint-staged：用于在 Git 中拦截并检查指定的文件，以确保它们已正确格式化、规范化或测试通过。

2. 在 package.json 中加入配置基础设置：

   ```json
   {
     "scripts": {
       "prepare": "husky install",
       "lint-staged": "lint-staged"
     },
     "lint-staged": {
       "*.{vue,css,scss,html}": ["stylelint --cache --fix"],
       "*.{js,ts,tsx,jsx,vue}": ["eslint --fix --ext"]
     }
   }
   ```

   - 在 `package.json` 中添加 prepare 脚本命令，这个命令会在 `npm install` （不带参数）之后自动执行，也就是它会在安装完依赖后自动执行 `husky install` 命令。
   - "scripts": {"lint-staged": "lint-staged"} 定义了通过执行 npm run lint-staged 命令来运行 lint-staged 库。

3. 创建 Git commit 的钩子文件：

   ```bash
   $: npx husky install
   $: npx husky add .husky/pre-commit "npm run lint-staged"
   ```

至此，关于代码的规范部分就已经全部完成了。

## 状态管理 Pinia

Pinia 的配置较为简单, 一共也就两步：

- 安装 Pinia 依赖：

  ```bash
  $: npm install @pinia/nuxt pinia
  ```

- 在 nuxt.config.ts 中增加 Pinia 的配置文件：

  ```ts
  export default defineNuxtConfig({
    alias: {
      pinia: '/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs',
    },
    modules: [['@pinia/nuxt']],
  })
  ```

就可以直接在项目中使用了。

1. 创建 `store/index.ts` ：

   ```ts
   // import { defineStore } from 'pinia'; // 经过配置无需额外引入

   const USER_INFO = {
     userName: 'Huy',
     sex: 'man',
     age: 18,
   }

   export const useUserStore = defineStore('userInfo', () => {
     const userInfo = reactive(USER_INFO)

     return {
       userInfo,
     }
   })
   ```

2. 在页面中使用 `pages/index.vue`：

   ```vue
   <template>
     <div>
       <hr />
       <div>
         Pinia 内容
         <strong>
           姓名：{{ userInfo.userName }} 性别：{{ userInfo.sex }} 年龄:
           {{ userInfo.age }}
         </strong>
       </div>
     </div>
   </template>
   <script setup lang="ts">
   import { useUserStore } from '~/store'
   const userInfo = useUserStore().userInfo
   </script>
   ```

## Vueuse hook 配置

Vueuse 是 Vue 的 Hooks 库，内部封装了较多便捷的 Hooks。同 Pinia 一样，集成进项目也是两步：

- 安装 vueuse 依赖：

  ```bash
  $: npm install -D @vueuse/nuxt @vueuse/core
  ```

- 在 nuxt.config.ts 中增加 Vueuse 的配置文件：

  ```ts
  // https://nuxt.com/docs/api/configuration/nuxt-config

  export default defineNuxtConfig({
    devtools: { enabled: true },
    alias: {
      pinia: '/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs',
    },
    modules: ['@vueuse/nuxt', '@pinia/nuxt'],
  })
  ```

就可以直接在项目中使用了。

如:

```vue
<template>
  <div>
    <hr />
    <div>
      Vueuse 内容
      <div>pos: {{ x }}, {{ y }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
// Hook
const { x, y } = useMouse()
</script>
```

没有报错，即引入成功。
