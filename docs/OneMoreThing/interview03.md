---
title: Interview -- 手写 ajax
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
