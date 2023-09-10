---
title: Interview -- 查漏补缺
icon: note
date: 2023-09-04
category:
  - anonymous
tag:
  - note
star: false
# sticky: true
sticky: false
---

## 基础题

### 请描述 TCP 三次握手和四次挥手

1. 先建立连接(确保双方都有收发消息的能力)
2. 再传输内容(如发送一个 get 请求)
3. 网络连接是 TCP 协议，传输内容是 HTTP 协议。

![三次握手](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202309042127410.png)

![四次挥手](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/format,png-20230309230614791.png)

## for...in 和 for...of 的区别是什么

在 JavaScript 中，`for...in` 和 `for...of` 是两种不同的循环语句，区别如下：

1. `for...in` 循环：

   - 用于迭代对象的可枚举属性。
   - 循环变量是对象的属性名（字符串类型）。
   - 可以用于迭代普通对象、数组和原型链上的属性。
   - 注意：`for...in` 循环不保证按照特定的顺序遍历对象的属性。

   示例：

   ```js
   const obj = { a: 1, b: 2, c: 3 }

   for (let key in obj) {
     console.log(key) // 输出属性名：a, b, c
     console.log(obj[key]) // 输出属性值：1, 2, 3
   }
   ```

2. `for...of` 循环：

   - 用于迭代可迭代对象（例如**数组**、**字符串**、**Set**、**Map** 等）的元素。
   - 循环变量是对象的值，而不是索引或属性名。
   - 不能直接用于迭代普通对象，需要通过转换或手动迭代对象的属性。

   示例：

   ```js
   const arr = [1, 2, 3]

   for (let element of arr) {
     console.log(element) // 输出数组元素：1, 2, 3
   }

   const str = 'Hello'

   for (let char of str) {
     console.log(char) // 输出字符串字符：H, e, l, l, o
   }
   ```

总结：

- `for...in` 用于迭代对象的属性名。
- `for...of` 用于迭代可迭代对象的元素值。
- `for...in` 适用于迭代**对象**的属性，而 `for...of` 适用于迭代**数组**、**字符串**等可迭代对象的元素。

### offsetHeight、scrollHeight 和 clientHeight 的区别是什么

- offsetHeight 包含了元素的整体高度，包括内容、内边距和**边框**。
  - offsetHeight 和 offsetWidth = content + padding + border
- scrollHeight 包含了元素内容的整体高度，**包括溢出部分**。
  - scrollHeight 和 scrollWidth = padding + 实际内容尺寸
- clientHeight 表示元素可见区域的高度，不包括滚动条、边框和外边距。
  - clientHeight 和 clientWidth = content + padding

### Vue 组件通讯有几种方式?

- props 和 $emit
- provide 和 inject
- Vuex 和 pinia
- $ref
- 自定义事件 evenBus

### 严格模式的特点

使用: 在头部声明 `'use strict'`。

- 全局变量必须先声明
- 禁止用 with

  - with 是用于在指定的对象上创建一个代码块作用域，以便在该作用域内可以更方便地访问对象的属性和方法。

    ```js
    with (object) {
      // 在此代码块中可以直接使用 object 的属性和方法
    }
    ```

- 创建 eval 作用域

  - eval 是 JavaScript 中的一个内置函数，它接受一个字符串作为参数，并将该字符串作为 JavaScript 代码进行解析和执行。

    ```js
    eval(code)
    ```

- 禁止 this 指向 window
- 函数参数不能重名

### HTTP 跨域请求时为何发送 options 请求

- options 请求是跨域请求之前的与检查;
- 它是浏览器自行发起的，无需干预。

## 深入原理

### JS 内存垃圾回收用什么算法

1. 标记清除（Mark and Sweep）：这是 JavaScript 中最常见的垃圾回收机制。它的工作原理是通过标记那些不再被引用的对象，然后将它们清除（回收）掉。该算法通过从根对象开始，递归遍历整个对象图，并标记所有可访问的对象。然后，清除阶段将清除未被标记的对象。

2. 引用计数（Reference Counting）：【已废弃】该算法跟踪每个对象被引用的次数。当对象的引用计数为零时，即没有任何引用指向它时，该对象就可以被回收。然而，引用计数算法难以处理循环引用的情况，即使循环引用的对象已经不再被使用，它们的引用计数也不会降为零，导致内存泄漏。

> **闭包是内存泄漏嘛?**
>
> 闭包不是内存泄漏！区别是闭包数据是无法被回收清除。

### 如何检测 JS 内存泄漏

使用浏览器的开发者工具：现代浏览器（如 Chrome、Firefox）提供了内置的开发者工具，其中包含用于分析 JavaScript 内存使用情况的功能。用"Memory"或"Performance"选项卡来监测内存的分配和释放情况，查找潜在的内存泄漏问题。

若内存一直在增加，而无法释放，则存在内存泄漏。

> 内存泄漏的场景有哪些?
>
> 以 Vue 举例:
>
> - 被全局变量、函数引用，组件销毁时未清除；
> - 被全局事件、定时器引用，组件销毁时未清楚；
> - 被自定义事件引用，组件销毁时未清除。

### 浏览器和 Node.js 的事件循环有什么区别?

> 宏任务和微任务
>
> - 宏任务：如 setTimeout、setInterval 和网络请求等；
> - 微任务：如 Promise、async/await；
> - 微任务在下一轮 DOM 渲染之前执行，宏任务在之后执行。

- 浏览器和 node.js 的 event loop 流程基本相同;
- node.js 宏任务和微任务分类型，有优先级。
- 推荐使用 `setImmediate` 代替 `process.nextTick` 看

具体可看[《node 基础》](../JavaScript/Node01.md)

## 查漏补缺

### 【历史问题】如何解决移动端 300ms 的延迟？

> 背景: 触摸屏 double tap to zoom

初始解决方案: fastClick 库

- 监听 `touchend` 事件(`touchstart` 和 `touchend` 会优先 click 触发)
- 使用自定义 DOM 事件模拟一个 click 事件
- 把默认的 click 是啊金(300ms 之后触发) 静止掉

现代浏览器的改进:

在 `meta` 中加入 `content="width=device-width"` 更改默认视口宽度。禁用了浏览器默认的双击缩放行为，但用户仍然可以通过双指缩放操作来缩放页面。

还可以在 meta 中加入 `user-scalable=no` 禁用用户对页面进行缩放，从而减少延迟。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no"
    />
  </head>
</html>
```

### token 和 cookie 的区别

- cookie 是 HTTP 规范;会默认被浏览器存储;有跨域限制;需要配合 session 使用;
- token 无标准;默认没有跨域限制; 以 JWT 自定义传递；并且需要自己存储；

> 现代浏览器禁止第三方 js 库设置 cookie

JSON Web Token（JWT）是一种用于在网络应用之间传递认证和授权信息的**开放标准**。JWT 的基本流程：

1. 身份验证：用户提供其凭据（如用户名和密码）进行身份验证。

2. 服务端生成 Token：服务器验证用户的凭据，并生成一个 JWT。JWT 由三个部分组成：头部（Header）、载荷（Payload）和签名（Signature）。

   - 头部（Header）：包含指定算法（如 HMAC SHA256 或 RSA）用于签名验证的信息。
   - 载荷（Payload）：包含关于用户或其他数据的声明（Claims），如用户 ID、角色等。
   - 签名（Signature）：使用服务器密钥或私钥对头部和载荷进行签名，以确保 JWT 的完整性和真实性。

3. 返回 Token：服务器将生成的 JWT 返回给客户端（通常是通过 HTTP 响应的方式）。

4. 存储 Token：客户端通常将 JWT 存储在本地，例如使用浏览器的本地存储（如 localStorage）或会话存储（如 sessionStorage）。

5. 发送 Token：客户端在后续的请求中将 JWT 作为身份验证凭据发送到服务器。通常，JWT 被添加到请求的授权头部（Authorization Header）中，使用 Bearer 方案。

6. 验证和解析 Token：服务器接收到带有 JWT 的请求后，使用相同的算法和密钥来验证 JWT 的签名，并解析其中的信息。

7. 授权访问：服务器根据 JWT 的有效性和包含的声明进行授权判断，决定是否允许用户访问请求的资源。

JWT 的优势在于它是无状态的，因为所有必要的信息都包含在 JWT 中，服务器不需要在后端存储会话信息。这使得 JWT 成为分布式系统和基于微服务架构的身份验证和授权解决方案的有力选项。

### HTTP 协议 和 1.0、1.1 和 2.0 有什么区别?

HTTP 1.0 是最基础的 HTTP 协议，支持基本的 GET、POST 方法；

HTTP 1.1 增加缓存策略 cache-control E-tag; 支持长连接 `Connection: keep-alive`，一次 TCP 连接多次请求；支持断点续传，状态码 206；支持新的 PUT DELETE 等，可用于 Restful API。

HTTP 2.0 可压缩 header,减少体积; 多路复用, 一次 TCP 连接中可以多个 HTTP 并行请求；服务端推送。

### 什么是 HTTPS 中间人攻击？如何预防？

> HTTP 是明文传输，实际问的是 HTTPS 加密过程。

### script 标签中 defer 和 async 有什么区别?

- 无属性时，HTML 会暂停解析，下载 JS 文件，并执行 JS 代码；再继续解析 HTML。
- defer：HTML 会继续解析，并行下载 JS，HTML 解析完成后再执行 JS。
- async：HTML 继续解析，并行下载 JS，下载完成立刻执行 JS 代码，再解析 HTML。

### prefetch 和 dns-prefetch 有什么区别？

- preload 资源在当前页面使用，会优先加载；
- prefetch 资源会在未来的页面使用，所以在空闲时加载。

```html
<head>
  <!-- 普通引用 -->
  <link rel="stylesheet" href="style.css" />

  <!-- preload -->
  <link rel="preload" href="style.css" as="style" />

  <!-- prefetch -->
  <link rel="preftch" href="other.js" as="script" />
</head>
```

- dns-prefetch 实际上是 DNS 预查询;
- preconnect 是 DNS 预连接。

```html
<head>
  <!-- dns-preftch -->
  <link rel="dns-preftch" href="https://fonts.xxx.com" />

  <!-- preconnect -->
  <link rel="preconnect" href="https://fonts.xxx.com" />
</head>
```

> **href 和 src 有什么区别?**
>
> 1. 用途：
>
> - href：href 属性用于指定链接的目标地址，通常用于`<a>`（锚点）标签，用于创建超链接，将用户导航到其他网页或资源。
> - src：src 属性用于指定外部资源（如图片、脚本、样式表等）的来源，通常用于 `<img>`、`<script>`、`<link>` 等标签，用于引入外部资源。
>
> 2. 加载方式：
>
> - href：href 指定的目标地址会被浏览器解析为一个新的文档，浏览器会重新加载并显示该文档的内容。
> - src：src 指定的资源会被浏览器请求并加载到当前文档中，例如图片会被显示，脚本会被执行。
>
> 3. 影响文档解析：
>
> - href：href 属性不会影响当前文档的解析过程，浏览器会继续解析当前文档，并在遇到 `<a>` 标签时处理链接。
> - src：src 属性会影响当前文档的解析过程，浏览器会在遇到包含 src 属性的标签时暂停文档解析，先加载并执行资源，然后再继续解析文档。
>
> 4. 标签使用：
>
> - href：常见的标签使用 href 属性，如 `<a>`、`<link>`（用于引入样式表）。
> - src：常见的标签使用 src 属性，如 `<img>`（用于引入图片）、`<script>`（用于引入脚本）。

### 前端攻击有哪些?该如何预防?

- XSS(Cross Site Script) 跨脚本攻击;
- 手段：黑客将 JS 代码插入到网页内容中，渲染时执行 JS 代码。
- 预防：特殊字符替换（前端或后端处理）

- DDOS(Distribute denial-of-service) 分布式拒绝服务
- 手段: 分布式的、大规模的流量访问，使服务器瘫痪；
- 预防：需要硬件层预防（如阿里云 WAF）

### HTTP 和 WebSocket 有什么区别?

WebSocket 支持端对端通讯

- 先发起一个 HTTP 请求
- 成功后再升级到 WebSocket 协议，再通讯。

俩者区别:

- WebSocket 协议名是`ws://`，可双端发起请求；
- WebSocket 没有跨域限制；
- 通过 send 和 onmessage 通信（HTTP 通过 req 和 res）

简单实现一个 WebSocket:

```js
/**
 * 服务端端代码
 */

const WebSocket = require('ws')
const WebSocketServer = WebSocket.Server

const wsServer = new WebSocketServer({ port: 3000 }) // 确立端口号

wsServer.on('connection', (ws) => {
  console.info('connection')

  ws.on('message', (msg) => {
    console.info('收到消息:', msg.toString())

    // 服务端向客户端发送消息
    setTimeout(() => {
      ws.send('服务端已经收到了信息:', msg.toString())
    }, 2000)
  })
})
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WebSocket 客户端</title>
  </head>
  <body>
    <p>WebSocket 客户端代码</p>

    <script>
      const ws = new WebSocket('ws://127.0.0.1:3000')

      ws.onopen = () => {
        console.info('opened~')
        ws.send('客户端建立连接')
      }

      ws.onmessage = (event) => {
        console.info('收到了信息:', event.data)
      }
    </script>
  </body>
</html>
```

### 从输入 url 到页面渲染的完整过程

#### 网络请求

- DNS 查询(得到 IP), 建立 TCP 连接(三次握手)；
- 浏览器发起 HTTP 请求；
- 收到请求响应，得到 HTML 源代码。

得到 HTML 源代码后，还会继续请求静态资源：

- 解析 HTML 过程中，遇到静态资源还会继续发起网络请求；
- JS、CSS、图片和视频等。

主要静态资源可能会有缓存，此时不必发起网络请求。

#### 解析

解析： 字符串 -> 结构化数据的过程

- HTML 构建 DOM 树
- CSS 构建 CSSOM 树(style tree)
- 俩者结合，形成 render tree

> 优化解析:
>
> - css 放在 `<head></head>` 中，不要异步加载 CSS；
> - JS 放在 `<body></body>` 最下面(或合理使用 defer async)
> - `<img>`提前定义 width 和 height。

#### 渲染

渲染： Render Tree 绘制到页面

- 计算各个 DOM 的尺寸、定位，最后绘制到页面；
- 遇到 JS 可能会执行（参考 defer async）；
- 异步 CSS、图片加载，可能会触发重新渲染。

### 重绘和重排的区别?

重绘（repaint）: 是指元素外观改变，如**颜色**、**背景色**，但是元素的**尺寸**、**定位**不变，不会影响到其他元素的位置。

重排（reflow）：是指重新计算尺寸和布局，可能会影响其他元素的位置。如元素的高度增加，可能会使相邻元素位置下移。

区别：重排播重绘要影响更大，消耗也更大，因此要避免无意义的重排。

减少重排的方法：

- 集中修改样式，或直接切换 css class；
- 修改之前先设置 `display: none`，脱离文档流；
- 使用 BFC 特性，不影响其它元素的位置；
- 频繁触发的使用节流和防抖；
- 使用 createDocumentFragment 批量操作 DOM；
- 优化动画，使用 CSS3 和 requestAnimationFrame。

### 网页多标签 tab 通讯

1. 使用 WebSocket：无跨域限制，但需要服务端支持，成本高。
2. 使用 LocalStorage 通讯：直接解决**同域**的 tab 页面通讯。

   ```js
   window.addEventListener('storage', (event) => {
     console.log('key:', event.key)
     console.log('value:', event.newValue)
   })
   ```

3. SharedWorker 通讯：SharedWorker 是 WebWorker 的一种。WebWorker 可开启进程执行 JS，但不能操作 DOM；SharedWorker 可单独开启一个进程，用于**同域页面**通讯。

### 网页和 iframe 如何通信?

使用 PostMessage 进行网页和 iframe 通信。 注意跨域的限制和判断(域名的合法性)。

在父窗口（父网页）中：

```js
// 获取 iframe 元素
var iframe = document.getElementById('myIframe')

// 发送消息给 iframe
function sendMessageToIframe() {
  var message = 'Hello from parent window!'
  iframe.contentWindow.postMessage(message, '*') // '*' 表示允许跨域通信
}

// 监听来自 iframe 的消息
window.addEventListener('message', function (event) {
  if (event.source === iframe.contentWindow) {
    var receivedMessage = event.data
    console.log('Received message from iframe:', receivedMessage)
  }
})
```

在 iframe 中：

```js
// 发送消息给父窗口
function sendMessageToParent() {
  var message = 'Hello from iframe!'
  parent.postMessage(message, '*') // '*' 表示允许跨域通信
}

// 监听来自父窗口的消息
window.addEventListener('message', function (event) {
  if (event.source === parent) {
    var receivedMessage = event.data
    console.log('Received message from parent window:', receivedMessage)
  }
})
```
