---
title: Webpack 性能优化之文件压缩
icon: build
date: 2023-04-20

category:
  - 框架
tag:
  - webpack
star: false
sticky: false
---

# Webpack 性能优化之文件压缩

## Terser JS 压缩

在 webpack 的优化(Optimization)选项中，还有俩个选择：

- `optimization.minimize`: Boolean，告知 webpack 是否使用 [TerserPlugin](https://webpack.docschina.org/plugins/terser-webpack-plugin/) 或其它在 [`optimization.minimizer`](https://webpack.docschina.org/configuration/optimization/#optimizationminimizer)定义的插件压缩 bundle。
- `optimization.minimizer`: `[TerserPlugin]` 或 `[function (compiler)]`，允许你通过提供一个或多个定制过的 [TerserPlugin](https://webpack.docschina.org/plugins/terser-webpack-plugin/) 实例，覆盖默认压缩工具(minimizer)。

TerserPlugin 形式：

```js
// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
    ],
  },
}
```

或函数形式：

```js
// webpack.config.js
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      (compiler) => {
        const TerserPlugin = require('terser-webpack-plugin')
        new TerserPlugin({
          /* 你的配置 */
        }).apply(compiler)
      },
    ],
  },
}
```

一些重要的配置，详细配置可看[官方文档](https://terser.org/docs/cli-usage)：

- **Compress option**：
  - `arrows`：class 或者 object 中的函数，转换成箭头函数；
  - `arguments`：将函数中使用 `arguments[index]`转成对应的形参名称；
  - `dead_code`：移除不可达的代码（tree shaking）。如永远为 false 的 if 判断函数。
- **Mangle option**：
  - `toplevel`：默认值是`false`，顶层作用域中的变量名称，进行丑化（转换）；
  - `keep_classnames`：默认值是`false`，是否保持依赖的类名称;
  - `keep_fnames`：默认值是`false`，是否保持原来的函数名称;

> 在 terser 中，compress 和 mangle 都是优化 JavaScript 代码的选项。
>
> compress 选项用于压缩代码并删除没有实际用处的部分，例如空格、注释和未使用的变量。这可以减小代码文件的大小，并帮助加快加载时间。
>
> 而 mangle 选项则用于混淆代码中的变量名，将变量名替换为更短的名称。这可以进一步减小生成的代码文件的大小，并防止他人轻易地读懂和修改代码。

在 webpack 中进行配置：

```js
// webpack.config.js

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      (compiler) => {
        const TerserPlugin = require('terser-webpack-plugin')
        new TerserPlugin({
          /* 你的配置 */
        }).apply(compiler)
      },
    ],
  },
}
```

## CSS 压缩

除了基本的 JS 压缩外，还可对代码的 CSS 进行压缩。

- CSS 压缩通常是去除无用的空格等，因为很难去修改选择器、属性的名称、值等；
- CSS 的压缩我们可以使用另外一个插件：`css-minimizer-webpack-plugin`；
- `css-minimizer-webpack-plugin` 是使用 cssnano 工具来优化、压缩 CSS（也可以单独使用）;

使用步骤：

1. 安装 `css-minimizer-webpack-plugin` ：`npm  run  css-minimizer-webpack-plugin -D` ；

2. 在 webpack 中的 `optimization.minimizer` 进行相应配置：

   ```js
   // webpack.config.js
   const TerserPlugin = require('terser-webpack-plugin')
   const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

   module.exports = {
     optimization: {
       minimize: true,
       minimizer: [
         new TerserPlugin({
           parallel: true,
           // other ....
         }),

         new CssMinimizerPlugin({
           parallel: true,
         }),
       ],
     },
   }
   ```

此外，在 CSS 中还可用 Tree Shaking 进行优化，有俩种方案：

- `usedExports`：通过标记某些函数是否被使用，之后通过 Terser 来进行优化的；
- `sideEffects`：跳过整个模块/文件，直接查看该文件是否有副作用；

### usedExportd 配置

`optimization.usedExports` 是 Webpack 中的一个优化配置项，用于启用或禁用 Tree Shaking 功能。Tree Shaking 是一种通过静态分析代码中未使用的部分，并将其从最终包中删除的优化技术。

取值范围： `boolean = truestring: 'global'`

当 `usedExports` 配置为 `true` 时，Webpack 将检测代码中的所有导出，并确定哪些导出实际上被使用了。然后，Webpack 只会在最终包中包含那些被使用的导出，而将未使用的导出从最终包中删除。

这样可以减小最终包的大小，并加快应用程序的加载速度。但是，如果某些导出仅在代码中动态使用（例如通过反射或字符串拼接），则可能会出现问题，因为 Webpack 在这种情况下无法静态分析代码并确定哪些导出实际上被使用。

因此，在使用 `usedExports` 时，需要根据具体情况谨慎选择是否启用，以确保不会意外删除必要的代码。

> 实际上，开启此选项会在相关代码中增加魔法注释：“unused harmony export mul”，意为告知 Terser 在优化时，可以删除这段代码。

此外，当 `usedExports` 配置为 `true` 时，Webpack 将只考虑当前模块内部的导出，并且只会将被使用的导出包含在构建结果中。

而当 `usedExports` 配置为 `'global'` 时，Webpack 将会遍历整个项目并找到所有被使用的导出，然后将这些导出包含在构建结果中。这个过程需要更长的时间，但可以确保每个文件都被正确地优化。

因此，如果应用程序是一个单页应用程序，或者只有少量的入口文件和**依赖项（第三方包）**，那么将 `usedExports` 配置为 `true` 可能是更好的选择，因为它可以更快地完成构建过程。

但是，如果应用程序比较复杂，有许多入口文件和依赖项，并且想要最大限度地减小打包后的文件大小，则可以将 `usedExports` 配置为 `'global'`，以确保每个文件都被正确地优化。

### sideEffects 副作用配置

在 Webpack 中，副作用是指模块中的一些代码会影响到其它模块或全局环境，而这些影响不能通过静态分析来检测和优化。例如，在某个模块中调用了全局函数，可能会影响该函数在其他地方的行为。

在默认情况下，Webpack 会假定所有代码都具有副作用，因此不会将未使用的导出删除。但是，如果确定某个模块中的代码没有副作用，则可以使用 Webpack 的 `sideEffects` 配置项来告诉 Webpack 这些信息，以便在 Tree Shaking 时进行更精确的判断。

`sideEffects` 可以是以下几种类型之一：

- `false`：表示模块中不含有任何副作用，所有代码都可以被安全地删除。
- `true`：表示模块中有副作用，不能被删除。
- 数组：包含了一些特定的文件路径和/或通配符模式，可以指定哪些文件或目录中的代码具有副作用。

例如，如果想要告诉 Webpack 在使用 Tree Shaking 时忽略 Lodash 的副作用，则可以将 `sideEffects` 配置为一个数组，并将 Lodash 的路径添加到其中：

```js
// webpack.config.js

module.exports = {
  // ...其他配置项
  optimization: {
    usedExports: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  // 只有 Lodash 中的某些方法会有副作用
  // 因此，我们可以使用数组来指定哪些文件或目录中的代码具有副作用
  // 注意：该配置仅在 mode 设置为 production 时生效
  sideEffects: ['lodash/includes.js', 'lodash/isEmpty.js'],
}
```

需要注意的是，`sideEffects` 的配置项仅在 Webpack 的 production 模式下才会生效。在 development 模式下，Webpack 默认会假设所有代码都具有副作用，并且不会进行 Tree Shaking。因此，默认情况下，开发模式下的打包结果更大，但构建速度更快。

### CSS 实现 Tree Shaking

需要安装 [PurgeCss](https://www.purgecss.cn/plugins/webpack/) 的 webpack 插件：

```bash
$: npm install purgecss-webpack-plugin -D
```

在生产环境配置插件：

```js
// webpack.config.js

const path = require('path')
const glob = require('glob')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')

const PATHS = {
  src: path.join(__dirname, 'src'),
}

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
  ],
}
```

## HTML 压缩

HTTP 压缩是一种内置在 服务器 和 客户端 之间的，以改进传输速度和带宽利用率的方式。旨在通过消除不必要的空格、注释和其他冗余内容来提高页面加载速度。在 Webpack 中使用 `html-webpack-plugin` 插件可以很容易地实现 HTML 压缩。

以下是一个示例 Webpack 配置，展示了如何在生产模式下使用 `html-webpack-plugin` 和 `html-minifier-terser` 插件对 HTML 文件进行压缩：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin')

module.exports = {
  // ...
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'path/to/template.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    new HtmlMinimizerPlugin(),
  ],
}
```

在上述代码中，我们首先导入了 `html-webpack-plugin` 和 `html-minimizer-webpack-plugin` 模块，并将它们添加到 Webpack 配置文件的 `plugins` 数组中。

然后，我们配置了 `HtmlWebpackPlugin` 插件，指定了要使用的 HTML 模板文件的路径以及要应用于 HTML 压缩的选项。这些选项包括：

- `collapseWhitespace`: 删除 HTML 中的空格。
- `removeComments`: 删除注释。
- `removeRedundantAttributes`: 删除 HTML 中的冗余属性。
- `removeScriptTypeAttributes`: 删除 `<script>` 标签中的 `type` 属性。
- `removeStyleLinkTypeAttributes`: 删除 `<style>` 和 `<link>` 标签中的 `type` 属性。
- `useShortDoctype`: 在 HTML5 中使用短文档类型声明。

最后，我们使用 `HtmlMinimizerPlugin` 插件对压缩后的 HTML 文件进行进一步优化。该插件使用 `html-minifier-terser` 模块将 HTML 文件压缩为最小体积。

> `HtmlWebpackPlugin` 用于生成 HTML 文件，并将打包后的 JavaScript 和 CSS 资源自动注入到 HTML 文件中。它可以从一个模板文件中生成 HTML 文件，并支持多个 HTML 文件的生成。此外，`HtmlWebpackPlugin` 还提供了一些选项和钩子函数，使用户能够对生成的 HTML 文件进行自定义设置，例如支持不同模板文件、HTML 压缩、多语言配置等。
>
> `HtmlMinimizerPlugin` 和 `CompressionPlugin` 都是 Webpack 中用于减小文件体积的插件，但它们的作用和处理对象是不同的。
>
> `HtmlMinimizerPlugin` 用于压缩 HTML 文件，可以消除不必要的空格、注释和其他冗余内容，从而减小文件大小并加速页面加载速度。通常情况下，它会与 `html-webpack-plugin` 插件联合使用，在 Webpack 打包过程中自动压缩生成的 HTML 文件。
>
> `CompressionPlugin` 用于在 Webpack 打包完成后对 JavaScript、CSS 和其他资源文件进行 gzip 压缩，并生成相应的 `.gz` 文件。这样可以减小浏览器下载这些文件的时间，并节省网络带宽和服务器资源。通常情况下，它会与 Web 服务器一起使用，并在客户端请求文件时自动返回相应的压缩文件。
>
> 需要注意的是，使用 `CompressionPlugin` 进行 gzip 压缩时需要确保 Web 服务器支持该压缩格式，并且在服务器配置中启用了相应的选项。例如，在 Apache 服务器上，需要使用 `mod_deflate` 模块来启用 gzip 压缩。
