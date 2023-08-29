---
title: Interview -- webpack 相关应用
date: 2023-08-12
category:
  - anonymous
tag:
  - note
star: false
# sticky: true
sticky: false
---

对于 webpack，在框架类中有几篇[专题](../Framework/webpack01)介绍，此处仅做面试题集梳理。

## 基础梳理

- 多入口，通常 SPA 为单入口。多入口配置：

  - 在 entry 中配置多入口；
  - 在 output 中配置多出口 `filename: [name].[contentHash:8].js`
  - 在 plugins 中为每个入口做插件解析。

    ```js
    new HtmlWebpackPlugin({
      // 生成 index.html
      template: path.join(srcPath, 'index.html'),
      filename: 'index.html',
      chunks: ['index'], // 只引用 index.js
    }),
      new HtmlWebpackPlugin({
        // 生成 other.html
        template: path.join(srcPath, 'other.html'),
        filename: 'other.html',
        chunks: ['other'], // 只引用 other.js
      })
    ```

- 抽离公共代码

  - 在`optimization`中的`splitChunks`配置生成单独的 chunks 文件。

    ```js
    optimization: {
      // 生成单独的chunks文件配置
      splitChunks: {
        chunks: 'all',
        minSize: 0,
        maxAsyncRequests: 9,
        maxInitialRequests: 9,
        name: false,
        cacheGroups: {
          Axios: {
            test: /[\\/]node_modules[\\/]axios[\\/]/,
            name: 'common/axios'
          }
        }
      },
    }
    ```

  - 还需要在入口插件的`HtmlWebpackPlugin`中的 chunk 内加入抽离的公共组件，如上的 axios，这样在入口文件中才会导入该公共抽离的组件：

    ```js
    new HtmlWebpackPlugin({
      // 生成 index.html
      template: path.join(srcPath, 'index.html'),
      filename: 'index.html',
      chunks: ['index', 'common/axios'], // 引用 index.js 和 common/axios.js
    }),
    ```

- 懒加载
- 处理 Vue 等特殊格式文件

## module、chunk 和 bundle 的区别是什么？

- module：在 webpack 中各个源文件都是模块（module）
- chunk：多个模块合并而成的，如 entry、import()、splitChunk
- bundle：最终的输出文件

## webpack 的性能优化-构建速度

- 优化 babel-loader
- IgnorePlugins
- noParse
- happyPack
- ParallelUglifyPlugin
- 自动刷新
- 热更新
- DllPlugin

### 优化 babel-loader

- 开启缓存，没有改变的不再更新
- 明确 babel 的作用范围：include 和 exclude 二者选其一即可

```js
{
  test: /\.js$/,
  use:['babel-loader?cacheDirectory'], // 开启缓存
  include: path.resolve(__dirname, 'src'), // 明确范围
}
```

### IgnorePlugins 避免引入无用模块

> 以 `moment.js` 为例，`import moment from 'moment'` 默认会引入所有语言的 JS 代码，这样代码就过于的大了。
> 此时我们便需要避免引入其它语言的模块了。

需要利用在 plugins 下，引入 `new webpack.IgnorePlugin({ resourceRegExp, contextRegExp })`：

- resourceRegExp: 用于检测资源的正则。
- contextRegExp: (optional) 用于检测资源上下文(目录)的正则。

以 moment.js 为例，多语言目录在`/locale/**`下，因此有：

```js
// 忽略 moment 下的 /locale 目录
new webpack.IgnorePlugin(/\./locale/, /moment/)
```

其次在需要使用的地方手动引入需要使用的语言包:

```js
import moment from 'moment'
import 'moment/locale/zh-cn' // 此处多加一行, 手动引入中文语音包

moment.locale('zh-cn') // 设置语言为中文
console.log(moment().format('ll')) // 使用
```

### noParse 避免重复打包

```js
module.exports = {
  module: {
    // 对于优化后的'react.min.js' 文件,就没有必要重复打包
    // 因此忽略对'react.min.js' 文件的递归解析处理
    noParse: [/react\.min\.js/],
  },
}
```

区别于 IgnorePlugin，noParse 引入了文件，但不打包。而 IgnorePlugin 直接不引入，代码中没有该文件。

### happyPack 多进程打包

- JS 单线程，开启多进程打包
- 提高构建速度（特别是多核 CPU）

也是在 plugins 中引入:

```js
// happyPack 开启多进程打包
new HappyPack({
  // 用唯一标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
  id: 'babel',
  // 如何处理 .js 文件, 用啊和 Loader 配置中医院
  loaders: ['babel-loader?cacheDirectory'],
})
```

### ParallelUglifyPlugin 多进程压缩 JS

- webpack 内置 Uglify 工具压缩 JS
- JS 单线程,开启多进程压缩更快

> 关于开启多进程
>
> - 项目较大，打包较慢，开启多进程能提高速度；
> - 项目较小，打包很快，开启多进程会降低速度（存在进程开销）；
> - 因此需要按需使用。

### 自动刷新和热更新

- 自动刷新： 整个网页全部刷新，速度较慢，且状态会丢失；
- 热更新：新代码生效，网页不会刷新，状态不会丢失。

### DllPlugin 动态链接库插件

- 前端框架如 vue 和 react，体积较大，构建慢；
- 但是框架较为稳定，不常升级。因此，同一个版本只构建一次即可，不用每次都重新构建。
- webpack 已经内置 DllPlugin 支持

## webpack 性能优化-产出代码

> 优化产出代码的好处有很多:
>
> - 体积更小
> - 合理分包,不重复加载
> - 速度更快,内存使用更少

- 小图片采用 base64 编码

  ```js
  {
    test: /\.(png|jpg|jpeg|gif)$/,
    use: {
      loader: 'url-loader',
      options: {
        // 小于 5kb 的图片采用 base64 格式产出, 否则产出 url 格式
        limit: 5 * 1024,
        // 打包到 img 目录下
        outputPath: '/img/'
      }
    }
  }
  ```

- bundle 加 hash
- 懒加载
- 提取公共代码
- IgnorePlugin
- 使用 CDN 加速
- 开启 Scope Hosting
- 使用 production 模式

  - 使用 production 模式，则会开始自动开始压缩代码；
  - Vue、React 等会自动删除调试代码（如开发环境的 warning）
  - 启动 Tree-Shaking

> ES6 Module 和 CommonJS 的区别
>
> - ES6 Module 是静态引入, 可以编译时引入;
> - CommonJS 是动态引入, 可以执行时引入;
> - 只有 ES6 Module 才能静态分析，实现 Tree-Shaking。

## babel 的基础使用

### 基本使用

配置 `.babelrc` 或者 `babel.config.js`添加 babel 的预设， 以`.babelrc`为例：

```json
{
  "presets": {
    ["@babel/preset-env"]
  },
  "plugins": []
}
```

### babel-polyfill

babel-polyfill 是一个用于在旧版浏览器中支持新的 JavaScript 特性和 API 的 Babel 插件。在 ES6（ECMAScript 2015）之后，JavaScript 引入了许多新的语法和全局对象方法，但这些功能在一些旧版浏览器中并不被支持。babel-polyfill 的目的是填充这些缺失的功能，以便在这些浏览器中使用最新的 JavaScript 特性。

babel-polyfill 在编译过程中会自动分析你的代码，并向目标环境中注入缺失的功能和 API 的代码。

需要注意的是，从 Babel 7.x 开始，推荐使用 @babel/preset-env 配合 core-js 来替代 babel-polyfill。@babel/preset-env 可以根据目标环境和配置自动引入所需的 polyfill，而 core-js 则提供了具体的 polyfill 实现。这种方式更加灵活和可定制，可以减小打包文件的体积，并且不会污染全局命名空间。

> core-js 是一个 JavaScript 库，提供了对新的 ECMAScript 标准（如 ES6、ES7、ES8 等）中新增特性的 polyfill 支持。它的目标是在不支持这些新特性的旧版 JavaScript 引擎中，通过注入缺失的功能代码来实现对这些特性的支持。

## 前端代码为何要进行构建和打包?

- 使得代码体积更小（Tree-Shaking、压缩、合并），加载更快；
- 使得项目能够编译高级语言或语法（TS、ES6+、模块化、less 等）；
- 使得 js 代码具备兼容性和错误检查功能（Polyfill、postcss、eslint）
- 可以是项目组拥有统一高效的开发环境；
- 可以统一的构建流程和产出标准；
- 能够集成公司的构建规范（提测、上线等）；

## loader 和 plugin 的区别是什么?

- loader 是模块装换器： less -> css
- plugin 是扩展插件，如 HtmlWebpackPlugin

## babel 和 webpack 的区别是什么?

- babel 是 JS 的新语法编译转换工具，不关系模块化；
- webpack 是打包构建工具，是多个 loader、plugin 的集合。

## webpack 如何实现懒加载?

使用动态 import：

动态 import 是 ES6 中的语法，它可以在运行时异步加载模块。Webpack 在打包时会将动态 import 转换为代码分割（code splitting），生成独立的文件，然后在需要时按需加载。

在使用动态 import 时，你可以结合使用 `import()` 函数或 `import(/* webpackChunkName: "chunk-name" */'module')` 形式的语法。例如：

```js
import('module').then((module) => {
  // 使用加载的模块
})
```

## babel-runtime 和 babel-polyfill 的区别是什么?

-`@babel/runtime`：它是一个运行时工具库，主要用于解决编译过程中产生的重复代码问题。它包含了一组公共的辅助函数，用于替代转换过程中重复的代码片段，从而减小生成的代码体积。

- `@babel/polyfill`：它是一个用于在旧版浏览器中支持新的 JavaScript 特性和 API 的 polyfill 库。它会根据目标环境和配置自动引入所需的 polyfill，以填充浏览器缺失的功能和 API。

## 为什么 Proxy 不能被 Polyfill?

原因在于 Proxy 的功能用 Object.defineProperty 无法模拟。
