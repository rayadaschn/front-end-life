---
title: 解决前端跨域问题
icon: build
date: 2023-03-27
article: false
category:
  - 框架
tag:
  - webpack
star: false
sticky: false
---

# 解决前端跨域问题

## 前言-同源策略

同源策略（Same-Origin Policy，简称 SOP）是一种重要的安全策略，用于 Web 浏览器保护用户隐私和安全。它指定浏览器在加载文档或执行脚本时，只能访问与原始文档具有相同协议、主机名和端口号的资源。

简单来说，如果一个网页中使用了 JavaScript 脚本或其他方式加载了其他来源的资源（例如图片、脚本、样式表等），那么这些资源的加载和访问将受到同源策略的限制，只能访问与该网页同源的资源，不能访问其他来源的资源。这种限制可以有效防止恶意网站窃取用户的信息，保护用户隐私和安全。

> 实际上，跨域的产生和前后端分离有很大关系。若前后端不分离，数据全有后端提供，则无跨域问题。
>
> 当前后端分离后，浏览器发现静态资源和 API 接口(XHR、Fetch)请求不是来自同一个地方时(同源策略)，就产生了跨域。

## 跨域的解决方案总结

### 常见方案

1. 使用 CORS，跨域资源共享;
2. node 代理服务器（本地 webpack 中设置的就是它）；
3. Nginx 等反向代理；
4. JSONP，以前较为流行，但也许前后端统一设置。

### CORS

**跨源资源共享**(CORS， Cross-Origin Resource Sharing 跨域资源共享)。它是一种基于`http header`的机制；该机制通过允许服务器标示除了它自己以外的其它源（域、协议和端口），使得浏览器允许这些 origin 访问加载自己的资源。

cors 的实现需要浏览器和服务器共同支持。浏览器在发送跨域请求时，会在请求头中添加一个 origin 字段，表示请求来源。服务器在接收到请求时，会在响应头中添加一个 access-control-allow-origin 字段，指定允许访问的域名。如果服务器允许该域名访问资源，就会在响应头中添加其他一些字段，比如 access-control-allow-methods、access-control-allow-headers 等，用于控制请求方法和请求头信息。

下面是一个简单的 cors 示例：

客户端代码：

```js
fetch("http://www.example.com/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

服务器代码：

```js
const http = require("http");

http
  .createserver((req, res) => {
    res.setheader("access-control-allow-origin", "http://www.example.com");
    res.setheader("access-control-allow-methods", "get, post, options");
    res.setheader("access-control-allow-headers", "content-type");
    if (req.method === "options") {
      res.writehead(200);
      res.end();
      return;
    }
    res.writehead(200, { "content-type": "application/json" });
    res.end(json.stringify({ message: "hello, world!" }));
  })
  .listen(8080);
```

在这个例子中，客户端向`http://www.example.com/data`发送 get 请求，服务器返回一个 json 格式的数据。在服务器的响应头中，我们设置了`access-control-allow-origin`字段，允许`http://www.example.com`域名访问资源，若是允许任意域名访问则可设置为星号`*`。

### Node 服务器代理

node.js 服务器代理是一种解决服务端跨域请求的方式。它的基本原理是在 node.js 服务器上设置一个代理服务器，将跨域请求转发到目标服务器上，实现跨域请求。

具体实现步骤如下：

1. 在 node.js 服务器上安装 http-proxy-middleware 中间件：`npm install http-proxy-middleware --save`

2. 在 node.js 服务器代码中引入中间件，并设置代理规则：

   ```js
   const express = require("express");
   const { createproxymiddleware } = require("http-proxy-middleware");

   const app = express();

   app.use(
     "/api",
     createproxymiddleware({
       target: "http://www.example.com", // 目标服务器地址
       changeorigin: true, // 是否跨域
       pathrewrite: {
         "^/api": "", // 将 /api 前缀替换为空
       },
     })
   );

   app.listen(3000, () => {
     console.log("server started on port 3000");
   });
   ```

   在这个例子中，我们设置了一个代理规则，将以 /api 开头的请求转发到 `http://www.example.com/` 服务器上。同时，我们还设置了 **changeorigin** 为 **true**，表示允许跨域请求。**pathrewrite** 用于替换请求路径中的前缀，这里将 `/api` 前缀替换为空。

   通过这种方式，我们可以在 node.js 服务器上实现跨域请求，同时也可以对请求进行一些处理，比如修改请求头、请求参数等。

   需要注意的是，node.js 服务器代理也需要注意安全性问题，避免被恶意攻击。同时，代理服务器的性能也需要考虑，避免成为瓶颈。

**在 WebPack 中设置以解决跨域问题**：

在 webpack 中设置 node 服务器代理，可以使用 webpack-dev-server 提供的 proxy 选项来实现。proxy 选项可以将请求代理到另一个服务器上，从而实现跨域请求。

具体实现步骤如下：

1. 在 webpack 配置文件中添加 devserver 配置项，并设置 proxy 选项：

   ```js
   devserver: {
     proxy: {
       '/api': {
         target: 'http://www.example.com', // 目标服务器地址
         changeorigin: true, // 是否跨域
         pathrewrite: {
           '^/api': '', // 将 /api 前缀替换为空
         },
       },
     },
   }
   ```

   在这个例子中，我们设置了一个代理规则，将以 `/api` 开头的请求转发到 `http://www.example.com/` 服务器上。同时，我们还设置了 **changeorigin** 为 **true**，表示允许跨域请求。**pathrewrite** 用于替换请求路径中的前缀，这里将 `/api` 前缀替换为空。

2. 在前端代码中发送请求时，将请求路径设置为代理路径即可：

   ```js
   fetch("/api/data")
     .then((response) => response.json())
     .then((data) => console.log(data))
     .catch((error) => console.error(error));
   ```

### Nginx 反向代理

nginx 反向代理可以通过设置跨域请求头来解决跨域问题。具体实现步骤如下：

1. 在 nginx 的配置文件中设置反向代理规则：

```js
location /api {
  proxy_pass http://www.example.com; // 目标服务器地址
  add_header 'access-control-allow-origin' '*'; // 设置跨域请求头
}
```

在这个例子中，我们设置了一个反向代理规则，将以 /api 开头的请求转发到 `http://www.example.com` 服务器上。同时，我们还设置了 `access-control-allow-origin` 请求头，允许任意域名访问该资源，从而实现跨域请求。

2. 在前端代码中发送请求时，将请求路径设置为反向代理路径即可：

```js
fetch("/api/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

在这个例子中，我们使用 fetch 发送请求时，将请求路径设置为 `/api/data`，nginx 反向代理会将该请求转发到 `http://www.example.com/data`，从而实现跨域请求。

### JSONP 解决跨域

JSONP 是一种常用的跨域解决方案，它通过动态创建`<script>`标签，利用 HTML 中`<script>`标签没有跨域限制的特性，实现跨域数据传输。

具体实现过程如下：

1. 前端页面通过 `<script>` 标签动态加载一个跨域的 JS 文件，并传递一个回调函数的名称作为参数，如：

```html
<script src="http://example.com/data.js?callback=handleData"></script>
```

2. 服务端接收到请求后，将数据封装在回调函数中返回给客户端，如：

```js
handleData({ name: "John", age: 30 });
```

3. 前端页面定义回调函数，解析返回的数据（实际返回的数据为函数+参数，参数为实际跨域返回的数据），如：

```js
function handleData(data) {
  console.log(data.name, data.age);
}
```

这样，前端页面就可以通过 JSONP 方式获取跨域数据，并在本地解析和使用了。

需要注意的是，JSONP 只支持 GET 请求，并且要求服务端返回的数据必须是可执行的 JavaScript 代码，而且需要约定回调函数的名称。同时，由于 JSONP 会将回调函数作为参数传递到服务端，因此存在一定的安全风险，可能会被恶意利用，因此需要谨慎使用。

可以看出，以上解决跨域的方案，大多都需要服务端进行配合设置。
