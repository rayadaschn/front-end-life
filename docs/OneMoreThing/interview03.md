---
title: Interview -- ajax 相关问题
icon: note
date: 2023-08-09
category:
  - anonymous
tag:
  - note
star: false
# sticky: true
sticky: false
---

虽然主题是手写 ajax，但是主要还是梳理一下前端流浪器发起数据请求的几种方法。

## fetch 函数

当前主要流行的是使用浏览器提供的 fetch 函数，`fetch` 是浏览器提供的现代化的网络请求 API，它基于 Promise，支持异步操作。使用 `fetch` 函数可以发送 HTTP 请求并接收响应。

以下是使用 `fetch` 函数发送 GET 请求的示例：

```javascript
fetch('https://api.example.com/data')
  .then((response) => response.json())
  .then((data) => {
    // 处理返回的数据
    console.log(data)
  })
  .catch((error) => {
    // 处理错误
    console.error(error)
  })
```

在上述示例中，`fetch` 函数接收一个 URL 参数，并返回一个 Promise 对象。我们可以使用 `.then()` 方法来处理成功的响应，并使用 `.catch()` 方法来处理错误。

`fetch` 函数返回的是一个代表响应的 `Response` 对象，我们可以使用 `.json()` 方法将响应的数据解析为 JSON 格式，或使用其他方法如 `.text()`、`.blob()` 等。

`fetch` 函数还可以配置请求的方法、请求头、请求体等，以满足不同的需求。

## 使用 `XMLHttpRequest` 对象

`XMLHttpRequest` 是一个传统的方式，也是早期浏览器提供的发送 HTTP 请求的 API。它基于回调函数，较为复杂，但仍然被广泛使用。

ajax 即是对 XMLHttpRequest 进行封装的一种数据请求方法。

```js
const ajax = function (url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true) // get 方法请求, 支持异步操作
    xhr.onreadystatechange = function () {
      // 当 readyState 属性发生变化时，调用的事件处理器。
      if (xhr.readyState === 4) {
        // 请求响应类型的枚举值
        if (xhr.state === 200 || xhr.state === 304) {
          // 请求的响应状态
          resolve(xhr.responseText) // 返回一个 DOMString，该 DOMString 包含对请求的响应，如果请求未成功或尚未发送，则返回 null。
        } else {
          reject(new Error(xhr.responseText))
        }
      }
    }
    xhr.send()
  })
}
```

方法共分为 5 步:

1. 定义 XMLHttpRequest
2. 定义 open 方法发起请求
3. onreadystatechange 方法监听请求响应类型 readystate 和响应状态 state
4. 依据请求状态返回数据
5. 调用 send 方法发起实际请求

## 解释 jsonp 原理，为什么不是真正的 ajax？

首先需要解释浏览器的同源策略(服务端没有同源策略)和跨域，具体可见 [《解决前端跨域问题》](../Framework/webpack01.md)。

其次要知道在 HTML 中，有几个标签和属性可以帮助绕过跨域限制，使得在页面上加载来自其他源的内容。

1. `<img>` 标签: 使用 `<img>` 标签可以加载来自其他域的图片资源。由于图片资源通常不受同源策略的限制，可以通过设置 `<img>` 标签的 `src` 属性来加载跨域的图片。

   ```html
   <img src="http://example.com/image.jpg" alt="Cross-origin image" />
   ```

2. `<script>` 标签的 `src` 属性: `<script>` 标签的 `src` 属性可以用来加载跨域的 JavaScript 文件。这可以用于实现 JSONP（JSON with Padding）技术。

   ```html
   <script src="http://example.com/script.js"></script>
   ```

3. `<link>` 标签的 `href` 属性: `<link>` 标签的 `href` 属性可以用来加载跨域的样式表文件（CSS）。

   ```html
   <link rel="stylesheet" href="http://example.com/styles.css" />
   ```

4. `<iframe>` 标签: `<iframe>` 标签可以用来嵌入来自其他域的网页。通过设置 `src` 属性，可以加载跨域的网页内容。

   ```html
   <iframe src="http://example.com" frameborder="0"></iframe>
   ```

5. `sandbox` 属性: `<iframe>` 标签的 `sandbox` 属性可以用于创建一个受限制的沙盒环境，其中可以加载跨域的内容。通过 `sandbox` 属性，可以指定一些限制规则，例如禁止表单提交、脚本执行等。

   ```html
   <iframe src="http://example.com" sandbox></iframe>
   ```

JSONP 实现跨域的原理就是通过动态创建 `<script>` 标签来加载外部脚本文件，这些脚本文件在服务器上生成并返回一个包装在函数调用中的 JSON 数据。

下面是 JSONP 的基本原理步骤：

1. 客户端（浏览器）创建一个 `<script>` 标签，并指定其 `src` 属性为跨域请求的 URL，同时将一个回调函数名作为查询参数传递给服务器。

   ```html
   <script src="http://example.com/api?callback=myCallback"></script>
   ```

2. 服务器接收到请求后，根据回调函数名生成一个 JSON 数据的字符串，并将其包装在回调函数的调用中返回给客户端。服务器的响应内容类似于以下形式：

   ```json
   myCallback({ name: 'John', age: 25 })
   ```

3. 客户端在全局作用域中定义回调函数，以便在服务器返回的脚本被加载和执行时调用。

   ```javascript
   function myCallback(data) {
     console.log(data)
   }
   ```

4. 浏览器加载并执行服务器返回的脚本，触发回调函数调用，并将 JSON 数据作为参数传递给回调函数。

JSONP 之所以不是真正的 AJAX（Asynchronous JavaScript and XML），是因为它并没有使用 XMLHttpRequest 对象来进行数据交互。相反，它使用了 `<script>` 标签来加载外部脚本文件，充分利用了浏览器对脚本文件的跨域访问没有同源策略限制的特性。

然而，JSONP 也存在一些限制和安全风险，例如它只能用于 GET 请求，无法处理 POST 请求。此外，由于 JSONP 的工作原理依赖于服务器返回的脚本内容，客户端需要完全信任服务器返回的脚本，以避免潜在的安全漏洞。因此，在使用 JSONP 时，需要确保从可信任的源加载脚本，并采取适当的安全措施来防止恶意脚本注入。
