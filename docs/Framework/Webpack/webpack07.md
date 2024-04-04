---
title: Webpack 性能优化之更多
icon: build
date: 2023-05-09

category:
  - 框架
tag:
  - webpack
star: true
sticky: false
---

## 开启 HappyPack 多进程打包

Node 是单线程的，而 Webpack 又是基于 Node 构建的，所以 Webpack 也是单线程的。

开启 HappyPack 可以让 Webpack 同一时间处理多个任务（多进程），从而缩短 Webpack 的打包时间。

配置过程:

1. 首先，安装 HappyPack 插件及其依赖：

   ```bash
   npm install happypack webpack@4 @happypack/core @happypack/loader --save-dev
   ```

2. 在 webpack 配置文件中引入 HappyPack 插件：

   ```js
   const HappyPack = require('happypack')

   module.exports = {
     // 其他配置项...
     plugins: [
       new HappyPack({
         id: 'babel', // 指定唯一的标识符 id 来处理对应的 loader
         loaders: ['babel-loader'], // 将要使用的 loader
         threads: 3, // 开启多线程
       }),
     ],
     module: {
       rules: [
         {
           test: /\.js$/,
           // 指定使用 HappyPack 加载器处理匹配的文件
           loader: 'happypack/loader?id=babel',
           exclude: /node_modules/,
         },
       ],
     },
   }
   ```

> 在 Webpack 5 中，HappyPack 插件已经不再推荐使用，因为 Webpack 5 已经内置了对多线程构建的支持。Webpack 5 通过使用 thread-loader 来实现多线程构建，因此不再需要 HappyPack 插件来管理多线程任务。
