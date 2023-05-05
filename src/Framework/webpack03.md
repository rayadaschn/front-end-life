---
title: Webpack 性能优化
icon: webpack
category:
  - 框架
tag:
  - webpack
star: false
sticky: false





---

# Webpack 性能优化

Webpack 性能优化可分为俩方面：

- 优化一：打包后的结果，上线时的性能优化。(比如分包处理、减小包体积、CDN服务器等) 
- 优化二：优化打包速度，开发或者构建时优化打包速度。(比如exclude、cache-loader等)

实际上，Webpack 在配置 mode 时，已经自动为项目做了很多优化了。但是，也可以定制一些相关配置。

## 代码分离

代码分离的主要目的是将代码分离到不同的bundle中，之后我们可以按需加载，或者并行加载这些文件。如默认情况下，所有的JavaScript代码（业务代码、第三方依赖、暂时没有用到的模块）在首页全部都加载，就会影响首页 的加载速度。代码分离可以分出更小的bundle，以及控制资源加载优先级，提供代码的加载性能。

Webpack 中常见的代码分离有三种：

- 入口起点：使用entry配置手动分离代码;
- 防止重复：使用Entry Dependencies或者SplitChunksPlugin去重和分离代码; 
- 动态导入：通过模块的内联函数调用来分离代码;

### 多入口起点



























