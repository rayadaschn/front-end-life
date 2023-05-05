---
title: Webpack 开发服务端配置
icon: build
category:
  - 框架
tag:
  - webpack
star: false
sticky: false




---

# Webpack 开发服务端配置

## 起步: 设置一个新的 Webpack 项目

Webpack 有大量的配置项，可能会让你不知所措，请利用 [webpack-cli 的 init 命令](https://webpack.docschina.org/api/cli/#init)，它可以根据你的项目需求快速生成 webpack 配置文件，它会在创建配置文件之前询问你几个问题。

```bash
npx webpack init
```

如果尚未在项目或全局安装 `@webpack-cli/generators`，npx 可能会提示你安装。根据在配置生成过程中的选择，也可能会安装额外的 package 到项目中。

生成的目录文档：

```tree
.
├── README.md
├── index.html
├── package-lock.json
├── package.json
├── src
│   └── index.js
└── webpack.config.js
```

## 解析 package.json

查看项目前，先来看一下初始化后的 `package.json`：

```json
{
  "version": "1.0.0",
  "description": "My webpack project",
  "name": "my-webpack-project",
  "scripts": {
    "build": "webpack --mode=production --node-env=production",
    "build:dev": "webpack --mode=development",
    "build:prod": "webpack --mode=production --node-env=production",
    "watch": "webpack --watch",
    "serve": "webpack serve"
  }
}
```

可以看到，我们之前运行 `npm run build:dev` 和 `npm run build:prod` 等，主要区别在于给 Webpack 传递的 `mode` 参数不同。实际上，配置对象`webpack.config.js`中也可以设置 mode，只是不太常用，它有做较多预设。

| mode 选项     | 描述                                                         |
| :------------ | :----------------------------------------------------------- |
| `development` | 会将 `DefinePlugin` 中 `process.env.NODE_ENV` 的值设置为 `development`. 为模块和 chunk 启用有效的名。 |
| `production`  | 会将 `DefinePlugin` 中 `process.env.NODE_ENV` 的值设置为 `production`。为模块和 chunk 启用确定性的混淆名称，`FlagDependencyUsagePlugin`，`FlagIncludedChunksPlugin`，`ModuleConcatenationPlugin`，`NoEmitOnErrorsPlugin` 和 `TerserPlugin` 。 |
| `none`        | 不使用任何默认优化选项                                       |

如果没有设置，webpack 会给 `mode` 的默认值设置为 `production`。

## 配置 webpack.config.js

先来看一下基础初始化配置：

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';

const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
    ],
    module: {
        rules: [...],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
    } else {
        config.mode = 'development';
    }
    return config;
};
```

在 `config` 中主要配置了入口和出口。但我们主要用到的还是 `devServer`、`plugins`和 `module`这三个相关配置。

### devServer 配置

`devServer` 顾名思义，就是本地开发服务器。内置了相当多的配置，具体可以查看 webpack [官网](https://webpack.docschina.org/configuration/dev-server/)。举例几个常用的配置。

- `devServer.static`: 该配置项允许配置从目录提供静态文件的选项（默认是 `'public'` 文件夹）。将其设置为 `false` 以禁用：

  ```js
  module.exports = {
    //...
    devServer: {
      static: false,
      // static: ['assets', 'css'], // 配置多个静态资源路径
    },
  };
  ```

  **它的主要作用是如果我们打包后的资源，又依赖于其他的一些资源，那么就需要指定从该定义的路径中查找相关内容。** 

- `devServer.hotOnly`: `hotOnly`是当代码编译失败时，是否刷新整个页面:

  - 默认情况下当代码编译失败修复后，我们会重新刷新整个页面; 

  - 如果不希望重新刷新整个页面，可以设置hotOnly为true;


- `devServer.host`: host设置主机地址: 默认值是`localhost`; 如果希望其他地方也可以访问，可以设置为 `0.0.0.0`;

  > **localhost** **和** **0.0.0.0** **的区别:
  >
  > - `localhost`:本质上是一个域名，通常情况下会被解析成`127.0.0.1`;
  >
  > - `127.0.0.1`:回环地址(Loop Back Address)，表达的意思其实是我们主机自己发出去的包，直接被自己接收;
  >
  >   - 正常的数据库包经常 应用层 - 传输层 - 网络层 - 数据链路层 - 物理层 ;
  >
  >   - 而回环地址，是在网络层直接就被获取到了，是不会经常数据链路层和物理层的; ✓ 比如我们监听 `127.0.0.1`时，在同一个网段下的主机中，通过ip地址是不能访问的;
  >
  > - `0.0.0.0`:监听IPV4上所有的地址，再根据端口找到不同的应用程序;
  >
  >   - 比如我们监听 `0.0.0.0`时，在同一个网段下的主机中，通过ip地址是可以访问的;

- `devServer.open`: 设置是否打开浏览器，默认`false`。

- `devServer.compress`: 是否为静态文件开启 `gzip compression`，默认值是false。

- `devServer.proxy`: **设置代理解决跨域访问的问题** :

  ```js
  devServer: {
      static: ['public', 'content'],
      // host: '0.0.0.0',
      port: 3000,
      open: true,
      compress: true,
      proxy: {
        '/api': {
          target: 'http://localhost:9000', // 目标地址
          pathRewrite: {  // 默认情况下，/api 也会被写入到URL中，如果希望删除，可以使用pathRewrite;
            '^/api': ''
          },
          changeOrigin: true  // 表示是否更新代理后请求的headers中host地址,一般设置为true
        }
      },
      historyApiFallback: true
    },
  ```

  > 关于**changeOrigin**，若不设置，默认情况下请求访问会使用 8000 的端口号进行数据请求。若改为 true，则使用自定义的端口号。

- `devServer.historyApiFallback`: 解决 SPA 页面在路由跳转之后，进行页面刷新时，返回 404 的错误。 

  类型一：Boolean 类型，默认为 false，如果设置为 true，那么在刷新时，返回404 错误时，会自动返回 `index.html` 的内容。

  类型 二：Object 类型，可以配置 from 来匹配路径，决定要跳转到哪一个页面。

 

