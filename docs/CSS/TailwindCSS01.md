---
title: Tailwind 入门
date: 2023-07-21
icon: style
category:
  - CSS
tag:
  - CSS
---

> 在接触 Tailwind 的刚开始，并没有感受到它的好处，反而觉得这是一种非常繁琐的事情。入门了几次都以失败告终，但是这一次，终于有一点小感悟了，遂记录下来。

利用 Tailwind 去构建 CSS 的一些实在的好处：

- 无需为给类命名而浪费时间。这对于同一代码规范非常友好，不用再纠结这个项目是 BEM(Block-Element-Modifier)的规范，而下一个项目是 SMACSS (Scalable and Modular Architecture for CSS)，因为想在全都是 Atomic CSS，全为 inline-style。
- CSS 代码不再增加。因为所有的 CSS 都是可复用的，所以在大部分情况下都无需再写新的 CSS 样式了。
- 改写样式更加安全。在以往的项目中，CSS 样式可能是全局的，所以一旦更改可能会对其它 HTML 造成破坏，从一部分情况上看，是降低了用户心智。

## 安装和初始化配置

1. 通过 npm 安装 Tailwind：

   ```bash
   $: npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
   ```

2. 初始化 Tailwind CSS

   初始化生成 `tailwind.config.js` 和 `postcss.config.js` 文件

   ```bash
   $: npx tailwindcss init -p
   ```

   生成最小化的 `tailwind.config.js` 和 配置好 `tailwindcss` ​ 和 `​autoprefixer` 的 `postcss.config.js`。

   ```js
   // tailwind.config.js
   /** @type {import('tailwindcss').Config} */
   export default {
     content: ['],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

3. 对 tailwind.config.js 文件进行配置，如 content 哪些文件需要用 Tailwind。

   ```js
   // tailwind.config.js
   /** @type {import('tailwindcss').Config} */
   export default {
     content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

4. 两种引入项目的方式:

   - 通用配置: 在 CSS 中引入 Tailwind。创建 ​./src/index.css​ 文件 并使用 ​@tailwind​ 指令来包含 Tailwind 的 ​base​、 ​components ​ 和 ​utilities ​ 样式，来替换掉原来的文件内容。

   ```css
   /* ./src/index.css */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

   Tailwind 会在构建的时候，将这些指令全部转换成基于自定义配置的样式文件。

   > 需要注意的是，应当确保 css 文件有被引用使用，否则可能会报错。

   - 若是在如 vue+vite 等框架内使用，应为改为 vite.config.ts 中增加配置。

   ```ts
   // vite.config.ts
   import { defineConfig } from 'vite'
   import vue from '@vitejs/plugin-vue'
   import tailwindcss from 'tailwindcss'
   import autoprefixer from 'autoprefixer'

   // https://vitejs.dev/config/
   export default defineConfig({
     plugins: [vue()],
     css: {
       postcss: {
         plugins: [tailwindcss, autoprefixer],
       },
     },
   })
   ```

   并在 main.ts 中引入样式“`'tailwindcss/tailwind.css'`”:

   ```ts
   import { createApp } from 'vue'
   import App from './App.vue'
   import 'tailwindcss/tailwind.css'

   createApp(App).mount('#app')
   ```

## 响应式设计

Tailwind 对响应式做了较好的兼容，如下是常用断点：

| 断点前缀 | 最小宽度 | CSS                                  |
| :------- | :------- | :----------------------------------- |
| `sm`     | 640px    | `@media (min-width: 640px) { ... }`  |
| `md`     | 768px    | `@media (min-width: 768px) { ... }`  |
| `lg`     | 1024px   | `@media (min-width: 1024px) { ... }` |
| `xl`     | 1280px   | `@media (min-width: 1280px) { ... }` |
| `2xl`    | 1536px   | `@media (min-width: 1536px) { ... }` |

要添加一个仅在特定断点生效的功能类，只需要在该功能类前加上断点名称，后面跟 `:` 字符。

```html
<!--宽度默认 16, 中等屏幕宽度为 32, a 大屏宽度为 48 -->
<img class="w-16 md:w-32 lg:w-48" src="..." />
```

## 悬停、焦点和其他状态
