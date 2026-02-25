---
title: vite  使用总结
icon: build
date: 2023-05-10

category:
  - 框架
tag:
  - vite
sticky: false
---

# Vite 使用总结

Vite 是一种新型前端构建工具，官方定位：下一代前端开发与构建工具，因此主要由俩部分组成：

- 一个开发服务器，它基于 [原生 ES 模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 提供了 [丰富的内建功能](https://www.vitejs.net/guide/features.html)，如速度快到惊人的 [模块热更新(HMR)](https://www.vitejs.net/guide/features.html#hot-module-replacement)；
- 一套构建指令，它使用 [Rollup](https://rollupjs.org/) 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。

## 底层原理

1. 原生 ES 模块支持：Vite 利用现代浏览器对原生 ES 模块的支持，无需事先打包，可以直接在浏览器中按需加载和编译模块代码，从而实现更快的开发体验和更短的构建时间。
2. HTTP/2 Server Push 技术：通过 HTTP/2 服务器推送技术，Vite 可以在浏览器请求一个 HTML 页面时，将该页面所依赖的 JavaScript、CSS 和其他资源文件预先推送到浏览器缓存中，以加快页面加载速度。
3. 中间件架构：Vite 初期使用了基于 Koa 的中间件架构，vite2 中已不再使用 Koa 了，而是使用 Connect 来搭建服务器。由于大多数逻辑应该通过插件钩子而不是中间件来完成，因此对中间件的需求大大减少。内部服务器的应用，现在是一个很好的旧版的 connect 实例，而不是 Koa。
4. 插件化架构：Vite 采用插件化架构，在内核提供的基础上，允许开发者使用自定义插件来扩展 Vite 的功能和特性，例如 TypeScript 支持、CSS 预处理器、打包压缩等。
5. 多进程编译：Vite 利用多进程编译技术，在开发模式下快速进行增量编译，提高了构建效率。此外，在生产模式下，Vite 支持基于 Rollup 进行代码打包和压缩，以提高应用的性能和加载速度。

## 功能

### 天然对 TypeScript 支持

只需导入，vite 会直接使用 ESBuild 来完成编译。但是需要注意的是，vite 只对 TypeScript 进行转译工作，并 **不** 执行任何类型检查。

### 天然支持对 CSS 支持

不同于 Webpack，vite 可以直接支持 css 的处理，直接导入 `.css` 文件将会把内容插入到 `<style>` 标签中，同时也带有 HMR 支持。也能够以字符串的形式检索处理后的、作为其模块默认导出的 CSS。

并且可以直接支持 css 预处理器，如支持`.scss`, `.sass`, `.less`, `.style` 和 `.stylus` 文件的内置支持。没有必要为它们安装特定的 Vite 插件，但必须安装相应的预处理器依赖：

```bash
$: npm install -D sass
```

不过，Vite 的目标是现代浏览器，因此它建议开发者使用原生 CSS 变量和实现 CSSWG 草案的 PostCSS 插件（例如 [postcss-nesting](https://github.com/jonathantneal/postcss-nesting)）来编写简单的、符合未来标准的 CSS。所以虽然直接支持 postcss 的转换，但还是需要安装 postcss，和配置 `postcss.config.js` 的配置文件。

```bash
$: npm install -D postcss postcss-preset-env
```

```js
// postcss.config.js
module.exports = {
  plugins: [require('postcss-preset-env')],
}
```

### 打包项目

除了良好的本地服务支持外，vite 利用 rollup 完成对项目的打包。（在 2022 年 vite 完成了几个大版的升级，其中因为就 Rollup 从 2.0 升级到 3.0，连带 Vite 也完成了一个大版的升级）

打包非常便利：

```bash
$: npx vite build
```

本地预览：

```bash
$: npx vite preview
```
