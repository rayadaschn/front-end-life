---
title: Webpack 配置分离
icon: build
date: 2023-05-03

category:
  - 框架
tag:
  - webpack
star: false
sticky: false
---

# Webpack 配置分离

## 前言

首先，我们来看我们在运行 `npm run build` 或者 `npm run watch` 时的实际代码是什么？在 `package.json` 中：

```json
"scripts": {
  "build": "webpack --mode=production --node-env=production",
  "build:dev": "webpack --mode=development",
  "build:prod": "webpack --mode=production --node-env=production",
  "watch": "webpack --watch",
  "serve": "webpack serve",

  "myBuild": "webpack --config ./config/comm.config.js --env production",
  "myServe": "webpack serve --config ./config/comm.config.js --env development",
},
```

上面有俩种，一种是 `"webpack  --node-env=production"` 一种是自定义的 `"webpack  --env production"` 。此外，自定义的 `myBuild` 传递了参数 `--config` ，这样不再读取默认的 `webpack.config.js` 配置文件，而是读取自定义的通用配置。

俩个都是传递的环境参数，区别在于 `env.production`和`process.env.NODE_ENV`都是用于指定当前 Webpack 构建的环境变量，但它们有不同的作用。

`env.production`是在 Webpack 配置文件中定义的一个自定义环境变量，用于指示当前是否处于生产环境。接收的是 `--env xxx` 传递过来的参数。

`process.env.NODE_ENV`是一个 Node.js 环境变量，通常用于指示当前正在运行的应用程序的环境（例如 development 或 production ）。可以直接在 js 中获取。

在 Webpack 配置文件中，通常会根据`process.env.NODE_ENV`的值来进行不同的操作，例如在生产环境下启用代码压缩等优化。因此，`env.production`和`process.env.NODE_ENV`都可以用于指定当前 Webpack 构建的环境，但它们的作用略有不同。

现在， 修改一下 `webpack.config.js` 的配置：

```js
// webpack.config.js

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin')

const isProduction = process.env.NODE_ENV == 'production'

console.log('node 环境: ', process.env)

const config = {
  // ...
}

module.exports = (envParams) => {
  console.log('webpack 自定义的环境变量 env: ', envParams)

  // 其它设置 ....
  return config
}
```

上面可以看到，`module.exports` 可以写成一个函数形式，此时 `webpack.config.js` 便可以接收相应的参数 **envParams** 。

再运行下列代码：

```bash
$: npx webpack --watch --node-env=prod --env=production --env=someString
```

控制台会打印如下结果（部分已省略）：

```bash
node 环境，直接获取:  {
  NVM_INC: '/Users/huy/.nvm/versions/node/v16.19.1/include/node',
  ....
  NODE_ENV: 'prod',
}

webpack 自定义的环境变量 env:  { WEBPACK_WATCH: true, production: true, someString: true }
```

可以看出，通过 “`--node-env`” 传递的参数，是直接定义到 node 环境变量上，可以通过 `process.env.NODE_ENV` 获取（注意！此参数不可随意填写）。

而通过 `--env` 传递的参数，最终落到了 webpack 中，并会以对象的形式传递回来。此外需要注意的是传递的参数是以 `{ Params: true }` 的键值对形式返回，所以如果只需检测是否有该属性即可。

## 配置分离

了解上述传递参数的方法后，便可以自定义 `package.json` 中的指令，并给不同的指令配置相应的代码。

要分离 webpack.config 的相关配置，可以选择保留 `webpack.config.js`，将其作为通用配置入口，也可以自定义一个 `common.config.js` 作为通用配置文件，只需在最终运行时将配置文件指定为此文件即可。这里，选择不删除默认 `webpack.config.js` 文件，并选择 webpack 传参方式。

```json
# 目录形式
├── ....
├── dev.config.js
├── prod.config.js
└── webpack.config.js
```

```json
# package.json

"scripts": {
  "build": "webpack  --env production",
  "serve": "webpack serve --env development",
  "ts-check": "tsc --noEmit",
  "ts-check-watch": "tsc --noEmit --watch"
},
```

通过上述配置可在 `webpack.config.js` 中，获取到不同的环境配置。

```js
// webpack.config.js
const { merge } = require('webpack-merge')
const devConfig = require('./dev.config')
const prodConfig = require('./prod.config')

/**
 * 抽取开发和生产环境的配置文件
 * 1.将配置文件导出的是一个函数, 而不是一个对象
 * 2.从上向下查看所有的配置属性应该属于哪一个文件
 * 3.针对单独的配置文件进行定义化
 * * css加载: 使用的不同的loader可以根据isProduction动态获取
 */
const getCommonConfig = (isProduction) => {
  return {
    // 此对象为 commonConfig 公共配置
    entry: './src/main.js',
    output: {
      // ...
    },
    // ...
  }
}

// webpack 导出一个函数
module.exports = function (env) {
  const isProduction = env.production // 返回值为 Boolean
  let mergeConfig = isProduction ? prodConfig : devConfig
  return merge(getCommonConfig(isProduction), mergeConfig)
}
```

依据 merge 函数，合并本地 `getCommonConfig()` 配置和不同环境下的特殊配置。
