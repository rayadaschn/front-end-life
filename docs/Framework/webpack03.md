---
title: Webpack 性能优化之分包
icon: build
date: 2023-04-05
article: false
category:
  - 框架
tag:
  - webpack
star: false
sticky: false
---

# Webpack 性能优化之分包

Webpack 性能优化可分为俩方面：

- 优化一：打包后的结果，上线时的性能优化。(比如分包处理、减小包体积、CDN 服务器等)
- 优化二：优化打包速度，开发或者构建时优化打包速度。(比如 exclude、cache-loader 等)

实际上，Webpack 在配置 mode 时，已经自动为项目做了很多优化了。但是，也可以定制一些相关配置。

## 代码分离

代码分离的主要目的是将代码分离到不同的 bundle 中，之后我们可以按需加载，或者并行加载这些文件。如默认情况下，所有的 JavaScrip t 代码（业务代码、第三方依赖、暂时没有用到的模块）在首页全部都加载，就会影响首页 的加载速度。代码分离可以分出更小的 bundle，以及控制资源加载优先级，提供代码的加载性能。

Webpack 中常见的代码分离有三种：

- 入口起点：使用 entry 配置手动分离代码;
- 防止重复：使用 Entry Dependencies（依赖包重复）或者 SplitChunksPlugin 去重和分离代码;
- 动态导入：通过模块的内联函数调用来分离代码;

### 多入口起点

多入口起点，意思很简单，就是多个配置入口。通常情况下，我们会依据初始 `index.js` 作为依赖包的入口。但也可以同时分包多个，在需要时进行加载。

```js
// webpack.config.js

const path = require("path");

// ....
const config = {
  entry: {
    index: {
      import: "./src/index.js",
    },
    main: {
      import: "./src/math.js",
    },
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-bundle.js",
    clean: true,
  },
  // ....
};
```

在上述配置中，我们定义了俩个包的入口，并设置了导出包的配置。其中，导出配置中，我们设置文件名为：`filename: "[name]-bundle.js"` ，这里的 name 实际上是 placeholder 占位符，默认为文件名，但也可以自定义，后续介绍（给 webpack 增加魔法注释）。

但仅仅是将俩个包切割还是不够的，因为很有可能俩个包都有依赖同一份第三方包，如都各自引用了 `loadsh`，这个时候我们应该再对这种共享包进行优化处理。

优化关键属性：`shared`

```js
// ...
entry: {
  index: {
    import: './src/index.js',
    dependOn: 'shared'
  },
  main: {
    import: './src/main.js',
    dependOn: 'shared'
  },
  shared: ['loadsh', 'axios']
},
```

### SplitChunks

上文有提到第三方包重复的问题，实际上有预置安装 `SplitChunksPlugin` 来对重复的第三方包进行分包处理，只需要提供 `SplitChunksPlugin` 相关的配置信息即可。

Webpack 提供了 [SplitChunksPlugin](https://webpack.docschina.org/plugins/split-chunks-plugin/) 默认的配置，chunks 仅仅针对异步请求，可以设置为 initial 或者 all。

```js
// webpack.config.js
optimization: {
  splitChunks: {
    chunks: 'all',
  }
}
```

自定义配置解析：

- `chunks`：默认值是 `async`，另外则为 `initial` 表示对通过的代码进行处理；`all` 表示对同步和异步代码都进行处理；
- `minSize`：拆分包的大小，至少为 minSize，若达不到则该包不会拆分；
- `maxSize`：将大于 `maxSize` 的拆分包拆分为不小于 `minSize` 的包；
- `cacheGroups`：用于对拆分的包就行分组，比如一个 lodash 在拆分之后，并不会立即打包，而是会等到有没有其他符合规则的包一起来打包。
  - `test` 属性：匹配符合规则的包；
  - `name` 属性：拆分包的 name 属性；
  - `filename` 属性： 拆分包的名称，可以自己使用 placeholder 属性。

```js
// webpack.config.js

// ...
// 优化配置
  optimization: {
    // 设置生成的chunkId的算法
    // development: named
    // production: deterministic(确定性)
    // webpack4中使用: natural
    chunkIds: 'deterministic',

    // runtime的代码是否抽取到单独的包中(早Vue2脚手架中)
    runtimeChunk: {
      name: "runtime"
    },

    // 分包插件: SplitChunksPlugin
    splitChunks: {
      chunks: "all",
      // 当一个包大于指定的大小时, 继续进行拆包
      // maxSize: 20000,
      // // 将包拆分成不小于minSize的包
      // minSize: 10000,
      minSize: 10,

      // 自己对需要进行拆包的内容进行分包
      cacheGroups: {
        utils: {
          test: /utils/,
          filename: "[id]_utils.js"
        },
        vendors: {
          // /node_modules/
          // window上面 '/\'
          // mac上面 '/'
          test: /[\\/]node_modules[\\/]/,
          filename: "[id]_vendors.js"
        }
      }
    },

    // 代码优化: TerserPlugin => 让代码更加简单 => Terser
    minimizer: [
      // JS代码简化
      new TerserPlugin({
        extractComments: false
      })
      // CSS代码简化
    ]
  },
```

### 动态导入

**webpack** 提供了两种实现动态导入的方式：

- 第一种，使用 ECMAScript 中的 `import()` 语法来完成，也是目前推荐的方式;
- 第二种，使用 webpack 遗留的 require.ensure，目前已经不推荐使用;

[动态导入](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import#%E5%8A%A8%E6%80%81_import) 有自身的好处，但不可滥用，因为静态框架能更好的初始化依赖，而且更有利于静态分析工具和 [tree shaking](https://developer.mozilla.org/zh-CN/docs/Glossary/Tree_shaking) 发挥作用。

关键字 import 可以像调用函数一样来动态的导入模块。以这种方式调用，将返回一个 `promise`。

```js
import("/modules/my-module.js").then((module) => {
  // Do something with the module.
});
```

这种使用方式也支持 `await` 关键字。

```js
let module = await import("/modules/my-module.js");
```

在 webpack 中，动态导入的文件通常是一定会打包成独立的文件的，所以它的命名一般在 `output.chunkFilename` 中命名:

```js
// webpack.config.js
// ...
output: {
  clean: true,
  path: path.resolve(__dirname, './build'),
  // placeholder
  filename: '[name]-bundle.js',
  // 单独针对分包的文件进行命名
  chunkFilename: '[name]_chunk.js'
},
```

> 如果我们希望修改 name 的值，可以通过 magic comments(魔法注释)的方式
>
> ```js
> btn1.onclick = function () {
>   import(/* webpackChunkName: "about" */ "./router/about").then((res) => {
>     res.about();
>     res.default();
>   });
> };
> ```
>
> `/* webpackChunkName: "about" */` 便是魔法注释。

此外，webpack v4.6+ 还增加了预获取（Prefetch）和预加载（Preload）的支持。

在魔法注释里面，可以使用这些内置指令：

- **prefetch** （预获取）：将来某些导航下可能需要的资源
- **preload** （预加载）：当前导航下可能需要资源

```js
import(
  /* webpackChunkName: "component" */
  /* webpackPreload: true */
  "./component"
);
```

与 prefetch 指令相比，preload 指令有许多不同之处：

- preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。
- preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
- preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。

## OneMoreThing

在我们给打包的文件进行命名的时候，会使用 placeholder ，placeholder 中有几个属性比较相似：

- hash、chunkhash、contenthash
- hash 本身是通过 MD4 的散列函数处理后，生成一个 128 位的 hash 值（ 32 个十六进制）。

hash 值的生成和整个项目有关系：

比如我们现在有两个入口`index.js`和`main.js`，它们分别会输出到不同的 bundle 文件中，并且在文件名称中我们有使用 hash ； 这个时候，如果修改了 index.js 文件中的内容，那么 hash 会发生变化；那就意味着两个文件的名称都会发生变化。

chunkhash 可以有效的解决上面的问题，它会根据不同的入口进行借来解析来生成 hash 值：比如我们修改了`index.js`，那么`main.js`的`chunkhash`是不会发生改变的;

contenthash 表示生成的文件 hash 名称，只和内容有关系:
比如我们的 `index.js`，引入了一个 `style.css`，`style.css` 有被抽取到一个独立的 css 文件中；这个 css 文件在命名时，如果我们使用的是`chunkhash`；那么当 `index.js` 文件的内容发生变化时，css 文件的命名也会发生变化；这个时候我们可以使用 `contenthash` 。

```js
// webpack.config.js
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
    main: "./src/main.js",
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, "./build"),
    filename: "[name]_[contenthash]_bundle.js",
    chunkFilename: "[contenthash]_chunk.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[contenthash]_[name].css",
    }),
  ],
};
```
