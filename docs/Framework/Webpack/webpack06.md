---
title: Webpack  使用总结
icon: build
date: 2023-05-09

category:
  - 框架
tag:
  - webpack
star: false
sticky: false
---

## 梳理 Webpack 运行流程

Webpack 的运行流程可以简单地概括为以下几个步骤：

1. 读取 webpack.config.js 配置文件，生成一个编译器（compiler）实例，并将其传递给各个插件（plugins）的 apply 方法进行处理。
2. 根据配置中设置的入口（entry），递归遍历所有入口文件，并使用配置中指定的 loader 对文件内容进行编译。这些 loader 在编译过程中可以修改文件内容，例如将 ES6 语法转换成 ES5 语法或者将 CSS 文件转换成 JavaScript 模块。
3. 编译完成后，Webpack 将所有模块中的 `require()` 语法替换为 `__webpack_require__` ，以实现模块化操作。
4. 接下来，Webpack 分析模块之间的依赖关系，创建一个称为 “Chunk” 的数据结构，其中包含了一组模块和它们之间的依赖关系。
5. 最后，Webpack 将 Chunk 打包成一个自执行函数（IIFE），并在其中提供了`__webpack_require__` 作为模块加载器，以便浏览器可以正确加载和执行打包后的代码。

> Loader 和 Plugin 的区别是 Loader 是实现各种资源的加载，而 Plugin 是为了解决除资源加载外的一些自动化工作，例如帮助开发者在打包之前清空 `dist` 目录等。

总的来说，Webpack 的工作就是将多个模块打包成一个或多个 Chunk，并将这些 Chunk 通过 script 标签引入到 HTML 页面中。这样做可以减少请求次数、提高性能，并且方便管理和维护代码。具体流程如下：

![webpack 打包流程](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202305090950493.png)

## 核心概念

- 入口 (entry)
- 输出 (output)
- 转载器 (loader)
- 插件 (plugins)

### entey

入口文件可以有一个或多个它是 Webpack 构建开始的文件，通过它 Webpack 可以逐步递归找到整个项目中的所有依赖文件。

```js
// webpack.config.js

module.exports = {
  entry: './index.js',
}
```

### output

出口文件，即最终打包的 bundle 文件存放的位置，以及如何命名这些打包文件。

```js
// webpack.config.js
const path = require('path')

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'outputFileName.bundle.js',
  },
}
```

### loader

由于运行加载的都是 JavaScript 代码，所以为了让 Webpack 能够处理其它非 JS 文件，并将其转换为相应的模块，因此需要 loader 管道对这些文件进行处理。

```js
// webpack.config.js
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProdution = true

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'outputFileName.bundle.js',
  },
  module: {
    rules: [
      {
        // 根据正则匹配需要处理的文件
        test: /\.jsx?$/,
        // 使用对应的loader处理文件
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          // 'style-loader', //开发阶段
          // MiniCssExtractPlugin.loader, // 生产阶段
          isProdution ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
      },
    ],
  },
}
```

> **自定义 loader**：loader 实际上就一个转换函数，接收一个参数 content，就是当前的文件内容，然后稍加处理，就可以 return 出一个新的文件内容。
>
> ```js
> // 自定义的 loader
> {
>   test: /\.css$/,
>   use: [
>     "myLoader",
>   ]
> }
> ```
>
> ```js
> // myLoader.js
> const loaderUtils = require('loader-utils')
>
> module.exports = function (content) {
>   // 获取loader中传递的配置信息
>   const options = loaderUtils.getOptions(this)
>   // 返回处理后的内容
>   this.callback(null, '/ *增加一个注释 */' + content)
>   // 也可以直接return
>   // return "/ *增加一个注释 */" + content;
> }
> ```

### plugins

在 Webpack 中，plugins 是用于扩展 Webpack 功能的插件。通过使用 plugins，我们可以在 Webpack 的构建过程中添加一些额外的处理功能，例如压缩代码、拷贝文件、注入变量等等。

Webpack 插件是一个具有 `apply()` 方法的 JavaScript 对象。当 Webpack 开始运行时，它会实例化这些插件，并**按照指定的顺序**调用它们的 `apply()` 方法。这样，插件就可以在 Webpack 的构建过程中获取到编译器实例 compiler，并与其进行交互，从而对构建过程进行干预和扩展。

使用插件：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // ...
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
}
```

> 常用插件：
>
> - `clean-webpack-plugin`：自动清空 dist 文件夹;
> - `html-webpack-plugin`：自动生成使用打包结果的 HTML。

编写插件：

要编写一个 Webpack 插件，可以按照以下步骤操作：

1. 创建一个 JavaScript 文件，并在其中定义一个插件类。这个类需要实现一个 `apply()` 方法，该方法会接收一个 compiler 对象作为参数。

```js
class MyPlugin {
  // apply方法，会在new plugin后被webpack自动执行。
  apply(compiler) {
    // 在这里实现插件的功能
  }
}
```

2. 在 `apply()` 方法中实现插件的功能。一般来说，插件的功能通常是通过挂载钩子函数（hook）来实现的。Webpack 提供了很多钩子函数，例如 beforeRun、run、emit 等等。我们可以根据具体需求选择一个或多个钩子函数，并注册对应的回调函数来实现插件的功能。

```js
class MyPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('MyPlugin', (stats) => {
      console.log('Webpack 构建完成！', stats)
    })
  }
}
```

3. 在完成插件的开发后，可以使用 npm 将其打包成一个可发布的模块。可以在 package.json 文件中添加一个 "main" 字段，指定插件的入口文件。

4. 将插件安装到项目中。可以使用 `npm install` 命令将插件安装到项目中，然后在 Webpack 配置文件中引入并实例化该插件。

```js
const MyPlugin = require('my-webpack-plugin')

module.exports = {
  plugins: [new MyPlugin()],
}
```

## 性能优化

Webpack 已经做了很多预置的性能优化处理，可以直接在 Webpack 配置项中设置 mode 即可。但是，也可以进行自定义一些相关配置。

1. 环境分离，依据不同的环境对配置项进行定制；

2. 在处理 `loader` 时，配置 `include`，缩小 `loader` 检查范围；

3. 配置别名和常用后缀名，加快搜索：

   ```js
   module.exports = {
     // ....
     resolve: {
       // 使用别名，加快搜索
       alias: {
         '~': path.resolve(__dirname, '../src'),
       },
       // 配置用到的后缀名，方便webpack查找
       extensions: ['js', 'css'],
     },
   }
   ```

4. 等等 ......
