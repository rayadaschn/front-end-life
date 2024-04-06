---
title: Express 基础
icon: nodeJS
date: 2023-05-29
category:
  - javascript
tag:
  - node
---

# Express 基础

在前面的文章中，介绍了基于 Node 的本地开发和服务器开发的常用功能。但是这些 API 操作都过于的繁琐了，因此大神开发了 Express 框架，并在之后又开发了轻量级的 Koa。

本文介绍 Express 的基础用法，以做入门介绍。

## Express 安装

首先假定你已经安装了 [Node.js](https://nodejs.org/)，接下来为你的应用创建一个目录，然后进入此目录并将其作为当前工作目录。

```bash
mkdir myapp
cd myapp
```

通过 `npm init` 命令为你的应用创建一个 `package.json` 文件。 欲了解 `package.json` 是如何起作用的，请参考 [Specifics of npm’s package.json handling](https://docs.npmjs.com/files/package.json).

```bash
npm init
```

此命令将要求你输入几个参数，例如此应用的名称和版本。 你可以直接按“回车”键接受大部分默认设置即可，下面这个除外：

```bash
entry point: (index.js)
```

键入 `app.js` 或者你所希望的名称，这是当前应用的入口文件。如果你希望采用默认的 `index.js` 文件名，只需按“回车”键即可。

接下来在 `myapp` 目录下安装 Express 并将其保存到依赖列表中。如下：

```bash
npm install express --save
```

如果只是临时安装 Express，不想将它添加到依赖列表中，可执行如下命令：

```bash
npm install express --no-save
```

## 基本使用

```js
// index.js
const express = require('express')

// 1.创建express的服务器
const app = express()

// 客户端访问URL: /login和/home
// post 请求
app.post('/login', (req, res) => {
  // 处理login请求
  res.end('登录成功, 欢迎回来~')
})

// get 请求
app.get('/home', (req, res) => {
  res.end('首页的轮播图/推荐数据列表~')
})

// 2.启动服务器, 并且监听端口
app.listen(9000, () => {
  console.log('express服务器启动成功~')
})
```

## 中间件

![中间件](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/20230412143557.png)

在 Express 中，中间件（middleware）是一个函数，它可以访问和修改请求对象（`req`）和响应对象（`res`），并且可以调用下一个中间件或路由处理程序。定义在 Express 创建的 app 传入的第二参数（回调函数）。

```js
app.post('/', (req, res, next) => {})
// app.post(匹配路径, 回调函数 => 中间件)
```

中间件在处理 HTTP 请求时非常有用。例如，可以使用中间件来验证请求、记录请求信息、压缩响应、设置 CORS 头等。

在 Express 中，中间件可以使用 `app.use()` 或 `app.METHOD()`（如 `app.get()`、`app.post()` 等）方法来添加到应用程序的处理流程中。`app.use()` 方法可以将中间件添加到处理流程中的任何地方，而 `app.METHOD()` 方法只会将中间件添加到特定 HTTP 方法的处理流程中。

下面是一个示例，展示了如何使用中间件来记录请求信息：

```js
const express = require('express')
const app = express()

// 中间件函数，用于记录请求信息
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`)
  next()
}

// 将中间件添加到应用程序处理流程中
app.use(logger)

// 处理 GET 请求
app.get('/', (req, res) => {
  res.send('Hello, World!')
})

// 启动服务器
app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
```

在这个例子中，我们定义了一个 `logger` 中间件函数，用于记录 HTTP 请求的方法和 URL。然后，我们使用 `app.use()` 方法将中间件添加到应用程序的处理流程中。这样，在处理任何请求之前，都会先执行 `logger` 中间件函数，然后再执行请求的处理程序。

### 中间件的匹配规则

Express 中间件的匹配规则是基于路径的。当 Express 接收到一个 HTTP 请求时，它会尝试匹配与该请求路径匹配的中间件或路由处理程序。

路径匹配规则是基于字符串模式匹配的，因此可以使用通配符和正则表达式来指定路径。Express 中的路径匹配器将请求路径与每个中间件的路径进行比较，并在找到与请求路径匹配的中间件时执行该中间件。

此外，中间件可以嵌套调用。Express 默认匹配第一个第一的中间件，要继续匹配剩余的中间件需要在上层中间最后调用 `next()` 。

```js
const express = require('express')

const app = express()

// app.get(路径, 中间件1, 中间件2, 中间件3)
app.get(
  '/home',
  (req, res, next) => {
    console.log('match /home get middleware01')
    next()
  },
  (req, res, next) => {
    console.log('match /home get middleware02')
    next()
  },
  (req, res, next) => {
    console.log('match /home get middleware03')
    next()
  },
  (req, res, next) => {
    console.log('match /home get middleware04')
  }
)

app.listen(9000, () => {
  console.log('express服务器启动成功~')
})
```

### 解析 request

在 Http 里面要读取请求中的 body 数据，是调用 `on` 方法进行监听。在 Express 中也是一样：

```js
const express = require('express')
const app = express()

// 注册中间件
app.post('/login', (req, res, next) => {
  const queryInfo = req.query // 解析 URL 中的 queryString
  const paramsInfo = req.params // 解析 URL 中的 params 参数

  let isLogin = false

  req.on('data', (data) => {
    // on 方法进行监听
    const dataString = data.toString()
    const dataInfo = JSON.parse(dataString) // JSON 解析
    if (dataInfo.name === 'userName' && dataInfo.password === '1234567') {
      // 登录用户账户密码匹配
      isLogin = true
    }
  })

  req.on('end', () => {
    if (isLogin) {
      // 账户密码鉴权是否通过
      res.end('登录成功')
    } else {
      res.end('登录失败，请检查账户密码是否正确')
    }
  })
})
```

上述代码中，定义了俩个监听事件，通过 JSON 解析数据请求中的 data 数据，而后进行相应操作。

### 第三方中间件

当然这样的使用较为麻烦，因此有很多第三方的中间件可以供我们使用，如上述的 JSON 解析：

```js
const express = require('express')

// 创建app对象
const app = express()

// 应用一些中间件
app.use(express.json()) // 解析客户端传递过来的json
// 解析传递过来urlencoded的时候, 默认使用的node内置querystring模块
// { extended: true }: 不再使用内置的querystring, 而是使用qs第三方库
app.use(express.urlencoded({ extended: true })) // 解析客户端传递过来的urlencoded

// 编写中间件
app.post('/login', (req, res, next) => {
  console.log(req.body)
  res.end('登录成功, 欢迎回来~')
})

// 启动服务器
app.listen(9000, () => {
  console.log('express服务器启动成功~')
})
```

在上述代码中，我们直接调用了 `express.json()` 这个中间件，它会默认替我们解析客户端传递过来的 json 数据。此外，还使用了 `express.urlencoded()` 中间件对客户端传递过来的 URL 进行了相应解析。

其它常用的中间件：

- 日志请求记录：`morgan` 这个第三方包需要我们额外去下载。

  ```bash
  $: npm i morgan
  ```

  使用：

  ```js
  const fs = require('fs')
  const express = require('express')
  const morgan = require('morgan')

  // 创建app对象
  const app = express()

  // 应用第三方中间件
  const writeStream = fs.createWriteStream('./logs/access.log')
  app.use(morgan('combined', { stream: writeStream })) // 定义写入流方法

  // 编写中间件
  app.post('/login', (req, res, next) => {
    res.end('登录成功, 欢迎回来~')
  })

  // 启动服务器
  app.listen(9000, () => {
    console.log('express服务器启动成功~')
  })
  ```

- 单文件上传：`multer` 这也是一个第三方包。

  ```bash
  $: npm i multer
  ```

  使用：

  ```js
  const express = require('express')
  const multer = require('multer')

  // 创建app对象
  const app = express()

  // 应用一个express编写第三方的中间件
  const upload = multer({
    dest: './uploads',
  })

  // 编写中间件
  // 上传单文件: singer方法
  app.post('/avatar', upload.single('avatar'), (req, res, next) => {
    console.log(req.file)
    res.end('文件上传成功~')
  })

  // 启动服务器
  app.listen(9000, () => {
    console.log('express服务器启动成功~')
  })
  ```

- 多文件上传：还是上述 `multer` 包，改 `upload.single()` 为 `upload.array()`

  ```js
  // 上传多文件:
  app.post('/photos', upload.array('photos'), (req, res, next) => {
    console.log(req.files)
    res.end('上传多张照片成功~')
  })
  ```

- 解析 FormData：应用 `multer` 包中，改 `upload.array()` 为 `upload.any()`

## 服务器返回客户端数据

服务器接收数据解决了，还需要对返回数据进行设置。这就用到了中间件中的 `res` 参数：

```js
const express = require('express')

// 创建app对象
const app = express()

// 编写中间件
app.post('/login', (req, res, next) => {
  // 1.res.end方法(比较少)
  // res.end('登录成功, 欢迎回来~')

  // 2.res.json方法(最多)
  // res.json({
  //   code: 0,
  //   message: '欢迎回来~',
  //   list: [
  //     { name: 'iPhone', price: 111 },
  //     { name: 'iPad', price: 111 },
  //     { name: 'iMac', price: 111 },
  //     { name: 'Mac', price: 111 },
  //   ]
  // })

  // 3.res.status方法: 设置http状态码
  res.status(201)
  res.json('创建用户成功~')
})

// 启动服务器
app.listen(9000, () => {
  console.log('express服务器启动成功~')
})
```

## 创建路由

```js
// useRouter.js
const express = require('express')

// 创建路由
const useRouter = express.Router()

// 定义路由对象中的映射接口
useRouter.get('/', (res, req, next) => {
  res.json('用户列表数据')
})
useRouter.get('/:id', (req, res, next) => {
  const id = req.params.id
  res.json('某一个用户的数据:' + id)
})
useRouter.post('/', (req, res, next) => {
  res.json('创建用户成功')
})
useRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id
  res.json('删除某一个用户的数据:' + id)
})
useRouter.patch('/:id', (req, res, next) => {
  const id = req.params.id
  res.json('修改某一个用户的数据:' + id)
})

// 3.将路由导出
module.exports = useRouter
```

使用路由：

```js
// index.js
const express = require('express')
const userRouter = require('./router/userRouter')

// 创建app对象
const app = express()

// 编写中间件
app.post('/login', (req, res, next) => {
  // xxxxxx
})

app.get('/home', (req, res, next) => {
  // xxxxxx
})

// 让路由生效
app.use('/users', useRouter)

// 启动服务器
app.listen(9000, () => {
  console.log('express服务器启动成功~')
})
```
