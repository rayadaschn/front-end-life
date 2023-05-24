---
title: Koa 基础
icon: nodeJS
category:
  - javascript
tag:
  - node




---

# Koa 基础

实际上，Koa 同 Express 非常相似。最大的区别在于，Koa 解决了异步执行代码中中间件的回调问题：如同洋葱一般能够回调继续执行，这是 Express 所不能的。

## 基本使用

```js
const Koa = require('koa')

// 创建app对象
const app = new Koa()

// 注册中间件(middleware)
// koa的中间件有两个参数: ctx/next
app.use((ctx, next) => {
  console.log('匹配到koa的中间件')
  ctx.body = 'Hello Koa'
})

// 启动服务器
app.listen(6000, () => {
  console.log('koa服务器启动成功~')
})
```

## ctx 参数解析

```js
const Koa = require('koa')

// 创建app
const app = new Koa()

// 中间件
app.use((ctx, next) => {
  // 1.请求对象
  console.log(ctx.request) // 请求对象: Koa封装的请求对象
  console.log(ctx.req) // 请求对象: Node封装的请求对象

  // 2.响应对象
  console.log(ctx.response) // 响应对象: Koa封装的响应对象
  console.log(ctx.res) // 响应对象: Node封装的响应对象

  // 3.其他属性
  console.log(ctx.query)
  // console.log(ctx.params)

  next()
})

app.use((ctx, next) => {
  console.log('second middleware~')
})


// 启动服务器
app.listen(6000, () => {
  console.log('koa服务器启动成功~')
})
```

在 Koa 中，`ctx.response` 和 `ctx.res` 都代表 HTTP 响应对象，但它们有一些区别：

- `ctx.response` 是 Koa 封装后的响应对象，包含了许多扩展方法和属性，例如 `ctx.response.body` 用于设置响应内容、`ctx.response.status` 用于设置响应状态码等。
- `ctx.res` 是 Node.js 的原生响应对象，由 HTTP 模块提供，具有更底层的实现和更高的可定制性。在需要进行一些底层操作时，可以直接访问 `ctx.res` 对象。

因为 Koa 使用 `ctx.response` 封装了原生的 HTTP 响应对象，所以在大部分情况下使用 `ctx.response` 更加方便和易读。同时，Koa 还提供了很多中间件来扩展 `ctx.response` 对象的功能，例如 `koa-bodyparser` 可以将请求体解析为 JSON 格式、`koa-static` 可以提供静态资源服务等。但是，在某些情况下，可能需要直接访问 `ctx.res` 对象，例如在处理文件下载或流式数据传输等场景下。

需要注意的是，虽然 `ctx.response` 和 `ctx.res` 都代表 HTTP 响应对象，但它们并不是完全等价的，不能随意互换使用。如果同时对 `ctx.response` 和 `ctx.res` 进行设置，那么以最后设置的为准。通常情况下，建议只使用一种方式来设置响应对象，以避免产生不必要的混淆和错误。

## 路径区分

```js
const Koa = require('koa')

// 创建app
const app = new Koa()

// 中间件: path/method使用路由
app.use((ctx, next) => {
  if (ctx.path === '/users') {
    if (ctx.method === 'GET') {
      ctx.body = 'user data list'
    } else if (ctx.method === 'POST') {
      ctx.body = 'create user success~'
    }
  } else if (ctx.path === '/home') {
    ctx.body = 'home data list~'
  } else if (ctx.path === '/login') {
    ctx.body = '登录成功, 欢迎回来~'
  }
})

// 启动服务器
app.listen(6000, () => {
  console.log('koa服务器启动成功~')
})
```

通过 `ctx.path` 进行路径区分。

## 路由使用

```js
const Koa = require('koa')

const KoaRouter = require('@koa/router')

// 创建服务器app
const app = new Koa()

// 路由的使用
// 1.创建路由对象
const userRouter = new KoaRouter({ prefix: '/users' })

// 2.在路由中注册中间件: path/method
userRouter.get('/', (ctx, next) => {
  ctx.body = 'users list data~'
})
userRouter.get('/:id', (ctx, next) => {
  const id = ctx.params.id
  ctx.body = '获取某一个用户' + id
})
userRouter.post('/', (ctx, next) => {
  ctx.body = '创建用户成功~'
})
userRouter.delete('/:id', (ctx, next) => {
  const id = ctx.params.id
  ctx.body = '删除某一个用户' + id
})
userRouter.patch('/:id', (ctx, next) => {
  const id = ctx.params.id
  ctx.body = '修改某一个用户' + id
})

// 3.让路由中的中间件生效
app.use(userRouter.routes())  // 注册路由规则
app.use(userRouter.allowedMethods())  // 处理错误处理和响应头设置等操作

// 启动服务器
app.listen(6000, () => {
  console.log('koa服务器启动成功~')
})
```

## 参数解析

```js
const Koa = require('koa')
const KoaRouter = require('@koa/router')
const bodyParser = require('koa-bodyparser')
const multer = require('@koa/multer')

// 创建app对象
const app = new Koa()

// 使用第三方中间件解析body数据
app.use(bodyParser())
const formParser = multer()

// 注册路由对象
const userRouter = new KoaRouter({ prefix: '/users' })

/**
 * 1.get: params方式, 例子:/:id
 * 2.get: query方式, 例子: ?name=why&age=18
 * 3.post: json方式, 例子: { "name": "why", "age": 18 }
 * 4.post: x-www-form-urlencoded
 * 5.post: form-data
 */
// 1.get/params
userRouter.get('/:id', (ctx, next) => {
  const id = ctx.params.id
  ctx.body = 'user list data~:' + id
})

// 2.get/query
userRouter.get('/', (ctx, next) => {
  const query = ctx.query
  console.log(query)
  ctx.body = '用户的query信息' + JSON.stringify(query)
})

// 3.post/json(使用最多)
userRouter.post('/json', (ctx, next) => {
  // 注意事项: 不能从ctx.body中获取数据
  console.log(ctx.request.body, ctx.req.body)

  // ctx.body用于向客户端返回数据
  ctx.body = '用户的json信息'
})

// 4.post/urlencoded
userRouter.post('/urlencoded', (ctx, next) => {
  console.log(ctx.request.body)

  ctx.body = '用户的urlencoded信息'
})

app.use(userRouter.routes())
app.use(userRouter.allowedMethods())


// 5.post/form-data
userRouter.post('/formdata', formParser.any(), (ctx, next) => {
  console.log(ctx.request.body)
  ctx.body = '用户的formdata信息'
})

// 启动服务器
app.listen(6000, () => {
  console.log('koa服务器启动成功~')
})
```

## 文件上传

`koa-multer` 是一个基于 Koa 框架和 Multer 库的文件上传中间件，可以帮助开发者方便地处理表单数据、文件上传等操作。Multer 是一个 Node.js 库，可用于处理 `multipart/form-data` 类型的表单数据，并支持多个文件上传、文件大小限制、文件类型过滤等功能。

```js
const Koa = require('koa')
const KoaRouter = require('@koa/router')
const multer = require('@koa/multer')

// 创建app对象
const app = new Koa()

// const upload = multer({
//   dest: './uploads'
// })

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './uploads')
    },
    filename(req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname)
    }
  })
})

// 注册路由对象
const uploadRouter = new KoaRouter({ prefix: '/upload' })

uploadRouter.post('/avatar', upload.single('avatar'), (ctx, next) => {
  console.log(ctx.request.file)
  ctx.body = '文件上传成功~'
})

uploadRouter.post('/photos', upload.array('photos'), (ctx, next) => {
  console.log(ctx.request.files)
  ctx.body = '文件上传成功~'
})

app.use(uploadRouter.routes())
app.use(uploadRouter.allowedMethods())

// 启动服务器
app.listen(6000, () => {
  console.log('koa服务器启动成功~')
})
```

## 结果响应

```js
const fs = require('fs')
const Koa = require('koa')
const KoaRouter = require('@koa/router')

// 创建app对象
const app = new Koa()

// 注册路由对象
const userRouter = new KoaRouter({ prefix: '/users' })

userRouter.get('/', (ctx, next) => {
  // 1.body的类型是string
  // ctx.body = 'user list data~'

  // 2.body的类型是Buffer
  // ctx.body = Buffer.from('你好啊, 李银河~')

  // 3.body的类型是Stream
  // const readStream = fs.createReadStream('./uploads/1668331072032_kobe02.png')
  // ctx.type = 'image/jpeg'
  // ctx.body = readStream

  // 4.body的类型是数据(array/object) => 使用最多
  ctx.status = 201
  ctx.body = {
    code: 0,
    data: [
      { id: 111, name: 'iphone', price: 100 },
      { id: 112, name: 'xiaomi', price: 990 },
    ]
  }

  // 5.body的值是null, 自动设置http status code为204
  // ctx.body = null
})

app.use(userRouter.routes())
app.use(userRouter.allowedMethods())

// 启动服务器
app.listen(6000, () => {
  console.log('koa服务器启动成功~')
})
```
