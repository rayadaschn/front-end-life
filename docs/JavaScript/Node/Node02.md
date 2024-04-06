---
title: Node 服务器开发基础
icon: nodeJS
date: 2023-05-28
category:
  - javascript
tag:
  - node
---

# Node 服务器开发基础

首先要理解一个概念，在前面的文章中，谈到文件读取的几种方法。但是这些方法都是直接将文件读取放到内存中进行管理，但是如果我们需要读取一部超长的电影，这个时候服务器的内存可能并没有那么大，所以，导致我们不能够直接读取到完整的一部电影。我们可以片段的读取想要的电影片段（这并不会打断我们看电影的过程）。

那么 Node 是如何实现的呢？通过 Stream 流，是连续字节的一种表现形式和抽象概念，它可以读也可以写。

## 文件读写的 Stream

实际上，Node 中很多对象是基于流实现的，并且所有的流都是 `EventEmitter` 的实例。在 Node.js 中，有四种基本流类型：

1. 可读流（Readable Stream）：用于从数据源中读取数据的流。可读流可以被视为一个源头，它会逐个或批量地将数据块（也称为 "chunk"）推送到下游消费者，如`fs.createReadStream()`。
2. 可写流（Writable Stream）：用于将数据写入目标位置的流。可写流可以被视为一个终点，它会接收来自上游生产者的数据块，并将其持久化存储到目标位置中，如`fs.createWriteStream()`。
3. 双工流（Duplex Stream）：同时支持读取和写入数据的流。双工流可以被视为一种中间件，它可以同时作为数据的生产者和消费者，并在处理中间数据时进行转换、过滤等操作，如`net.Socket`。
4. 转换流（Transform Stream）：用于对数据进行转换、过滤等操作的流。转换流可以被视为一种特殊的双工流，它在接收到上游数据块后可以对其进行转换处理，并将处理后的数据块推送到下游消费者中。

在 Node.js 中，`Stream` 的实例都是由 `stream.Readable`、`stream.Writable`、`stream.Duplex` 和 `stream.Transform` 等内置类派生而来的。同时，Node.js 还提供了许多内置模块和第三方模块，例如 `fs`、`http`、`zlib` 等，都提供了相应的流接口，可以用于读取和写入数据。

### 可读流（Readable Stream）

先看之前的 `fs.readFile`，它是一次性读取，将数据文件完整取出来。因此会存在以下缺点：

- 无法精准控制从文件的制定位置读取数据
- 无法做到读取到某一个位置的时， 暂停读取，而后恢复读取
- 文件非常大的时候，无法分次读取文件

```js
fs.readFile('./text.txt', (err, data) *=>* {
  console.log(data)
})
```

`fs.createReadStream()`就是解决这些问题的，它是 Node.js 内置模块 `fs` 提供的一个方法，用于创建一个可读流（Readable Stream）以从文件中读取数据。

以下是使用 `fs.createReadStream()` 的基本语法：

```js
const fs = require('fs')

const readStream = fs.createReadStream(path[, options])
```

参数说明：

- `path`：要读取的文件路径。
- `options`：一个可选的对象，包含一些配置项，例如：
  - `flags`：默认为 `'r'`，表示以只读方式打开文件。
  - `encoding`：默认为 `null`，表示返回原始的 Buffer 数据。可以设置为 `'utf8'`、`'base64'` 等编码格式，以便返回字符串或其他格式的数据。
  - `autoClose`：默认为 `true`，表示读取结束后自动关闭文件句柄。
  - **`start`**：要读取的起始位置（以字节为单位）。
  - **`end`**：要读取的结束位置（以字节为单位）。
  - `highWaterMark`：每次读取的数据块大小（以字节为单位），默认为 64 KB。

例如，以下代码演示了如何使用 `fs.createReadStream()` 方法从文件中读取数据，并将其输出到控制台：

```js
const fs = require('fs')

const readStream = fs.createReadStream('example.txt', { encoding: 'utf8' })

let formData = '' // 保存的最终完整数据
// 监听读取到的数据
readStream.on('data', (chunk) => {
  console.log(chunk) // 会持续更新, 如需完整数据需要及时保存
  formData += chunk

  readStream.pause() // 中途暂停读取

  setTimeout(() => {
    readStream.resume() // 恢复读取
  }, 2000)
})

// 监听打开事件--事件开启
readStream.on('open', (fd) => {
  console.log('通过流将文件打开~', fd)
})

// 监听事件即将关闭,此时还可接着写入数据
readStream.on('end', () => {
  console.log('已经读取到end位置')
})
```

在上面的例子中，我们使用 `fs.createReadStream()` 方法创建了一个可读流，并从文件 `'example.txt'` 中读取数据。由于我们在配置项中设置了 `encoding: 'utf8'`，因此每次读取到的数据块都会以字符串的形式输出到控制台。然后，我们监听了该可读流的 `'data'` 和 `'end'` 等事件，以便在可读流有新的数据块可用或所有数据块都被消费完毕时执行相应的操作。

其中的，`chunk` 变量是指从可读流（Readable Stream）中读取到的数据块（也称为 "chunk"）。当可读流有新的数据块可用时，会触发 `'data'` 事件，并将数据块作为回调函数的参数传递给消费者。因此，在消费者处理完当前数据块后，下一个数据块就会被推送到 `'data'` 事件中，并作为一个新的 `chunk` 变量传递给消费者。

### 可写流（Writable Stream）

与可读流类似，在 Node.js 中，可写流（Writable Stream）是一种用于将数据写入目标位置的机制。例如，可以使用可写流将数据写入文件、网络或其他目标位置。

要创建一个可写流，可以使用 `stream.Writable` 类的实例，并通过实现 `_write()` 方法来消费数据块。每当可写流有新的数据块可用时，`_write()` 方法都会被调用一次，并将新的数据块、编码格式和回调函数传递给方法。

然后，在处理完数据块后，需要调用回调函数来通知可写流可以接收下一个数据块。

以下是一个简单的示例，演示如何创建一个可写流，并使用它将数据写入控制台：

```js
const { Writable } = require('stream')

class MyWritable extends Writable {
  constructor(options) {
    super(options)
  }

  _write(chunk, encoding, callback) {
    console.log(`Received data: ${chunk.toString()}`)
    callback()
  }
}

const myWritable = new MyWritable()

myWritable.write('a\n')
myWritable.write('b\n')
myWritable.write('c\n')
myWritable.end(() => {
  console.log('Done')
})
```

在上面的例子中，我们创建了一个名为 `MyWritable` 的可写流，并实现了 `_write()` 方法，以便在每次有新的数据块可用时消费它。然后，我们创建了一个新的 `MyWritable` 实例，并使用 `myWritable.write()` 方法将数据块推送到可写流中。

当所有数据块都被推送完毕后，我们会调用 `myWritable.end()` 方法来结束可写流，并在回调函数中执行相应的操作。

当然，我们可以使用内置的 `fs.createWriteStream()`、`http.request()` 和 `net.Socket` 等方法创建可写流，并通过调用可写流的接口来进行数据写入。例如：

```js
const fs = require('fs')

const writeStream = fs.createWriteStream('output.txt')

writeStream.write('a\n')
writeStream.write('b\n')
writeStream.write('c\n')
writeStream.end(() => {
  // end 方法实际上干了俩件事: 将最后的内容写入到文件中; 并且关闭文件
  // 也就是同时做了 'finish' 和 'close' 俩个事件
  console.log('Done')
})
```

在上面的例子中，我们使用 `fs.createWriteStream()` 方法创建了一个可写流，并将数据块 `'a\n'`、`'b\n'` 和 `'c\n'` 推送到该可写流中。当所有数据块都被推送完毕后，我们会调用 `writeStream.end()` 方法来结束可写流，并在回调函数中执行相应的操作。

### 拷贝流（Copy Stream）

拷贝流（Copy Stream）是一种将数据从一个可读流复制到另一个可写流的机制。

在 Node.js 中，可以使用 `pipeline()` 方法将两个或多个流连接起来，并自动处理错误和关闭流等问题。以下是一个简单的示例，演示如何创建一个可读流、一个可写流和一个拷贝流，并使用它们将数据从文件 `'input.txt'` 复制到文件 `'output.txt'`：

```js
const fs = require('fs')
const { pipeline } = require('stream')

const readStream = fs.createReadStream('input.txt')
const writeStream = fs.createWriteStream('output.txt')

pipeline(readStream, writeStream, (err) => {
  if (err) {
    console.error('Pipeline failed', err)
  } else {
    console.log('Pipeline succeeded')
  }
})
```

在上面的例子中，我们使用 `fs.createReadStream()` 和 `fs.createWriteStream()` 方法创建了一个可读流和一个可写流。然后，我们使用 `pipeline()` 方法将这两个流连接起来，并定义一个回调函数以处理错误和成功完成的情况。

`pipeline()` 函数的作用是将一个或多个可读流、一个或多个可写流和任意数量的转换流（Transform Stream）连接在一起，并将它们链接成一个管道。这个管道把数据从一个流传输到另一个流，同时也会自动控制流量，保证内存不会耗尽。

`pipeline()` 函数的语法如下：

```js
pipeline(source, ...transforms, destination, callback)
```

其中：

- `source`：一个可读流，它是管道的起点。
- `transforms`：一个或多个转换流，每个转换流都可以对数据进行修改或转换。
- `destination`：一个可写流，它是管道的终点。
- `callback`：可选的回调函数，在管道完成或出错时被调用。

当执行上述代码时，它会自动读取文件 `'input.txt'` 的内容，并将其复制到文件 `'output.txt'` 中。同时，如果出现任何错误或异常情况，它也会自动处理并输出相应的错误信息。

需要注意的是，在使用拷贝流时，请特别注意内存泄漏和错误处理等问题。同时，也应该及时释放资源、关闭流等，避免出现资源浪费和程序不稳定等问题。

### 双工流（Duplex Stream）

双工流是一种同时具有可读和可写功能的流。例如，可以使用 `net.Socket` 创建一个双工流，并在该流上同时发送和接收数据。双工流的实现方式与可读流和可写流略有不同，因为它们需要同时支持读取和写入操作。

拷贝流是一种将数据从一个可读流复制到另一个可写流的机制。当需要将大量数据从一个位置复制到另一个位置时，可以使用拷贝流来避免将所有数据存储在内存中。拷贝流通常是单向的，因为它们只需要将数据从一个流传输到另一个流。

虽然双工流和拷贝流是两种不同类型的流，但它们都是基于流的概念，并且都具有一些共同的特点和用途。例如，它们都可以帮助处理大型数据集并提高性能，同时还可以自动处理错误和关闭流等问题。

转换流（Transform Stream）是一种实现双工流中特定场景下的功能的流。转换流通常从可读流中读取数据块，并对其进行处理，然后将处理的结果推送到可写流中。

转换流允许我们在数据传输过程中对数据进行转换或修改，而无需显式地为每个操作创建一个单独的可读流和可写流。例如，可以使用 `zlib.createGzip()` 方法创建一个转换流，并将其插入到可读流和可写流之间，以便在数据传输期间自动压缩数据。

## Web 服务器

刚刚到文件读写操作都是基于本地文件的，但是服务器还应当能够执行网络数据的交互。

Web 服务器就是（Web Server）一种软件程序，用于接收来自客户端的 HTTP 请求并响应这些请求。它们通常在互联网上提供 Web 服务，允许用户通过浏览器访问和查看 Web 页面、图像、视频和其他内容。

Web 服务器通常运行在高性能计算机上，并具有强大的处理能力、高速的网络连接和可靠的存储设备等硬件资源。它们可以使用各种编程语言和框架来实现，例如 Node.js、Apache、Nginx 等。

Web 服务器的主要功能包括以下几个方面：

1. 接收客户端请求：Web 服务器接收来自客户端的 HTTP 请求，例如 GET、POST、PUT 和 DELETE 请求等。
2. 处理请求：Web 服务器根据请求的内容和方法对其进行处理，并将响应返回给客户端。如果请求需要访问后端数据库或其他资源，则 Web 服务器可以协调这些资源，并将数据返回给客户端。
3. 提供安全性：Web 服务器可以提供各种安全措施，例如 SSL/TLS 加密、防火墙、入侵检测和预防等，以保护客户端和服务器之间的通信安全。
4. 支持静态和动态内容：Web 服务器可以支持静态内容，例如 HTML、CSS、JavaScript、图像和视频等，并且可以生成动态内容，例如动态网页、Web 应用程序和 API 等。

### HTTP 模块

HTTP 模块是 Node.js 中一个核心模块，它提供了一组 API，用于创建 HTTP 服务器和客户端，并处理 HTTP 请求和响应。

在 Node.js 中，可以使用 HTTP 模块来创建 HTTP 服务器，并监听来自客户端的 HTTP 请求。以下是一个简单的示例，演示如何使用 HTTP 模块来创建一个 HTTP 服务器：

```js
const http = require('http')

const server = http.createServer((req, res) => {
  // req 对象中包含本次客户端请求的所有信息
  // 请求的url
  // 请求的method
  // 请求的headers
  // 请求携带的数据
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World\n')
})

// 开启对应的服务器, 并且告知需要监听的端口
// 监听端口时, 监听1024以上的端口, 666535以下的端口（1024 以下为系统预留端口）
// 1025~65535之间的端口
// 2个字节 => 256*256 => 65536 => 0~65535
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/')
})
```

在上面的例子中，我们使用 `http.createServer()` 方法创建了一个 HTTP 服务器，并定义一个回调函数来处理每个客户端请求。在该回调函数中，我们设置了 HTTP 响应的状态码、头信息和正文内容，并在处理完请求后通过 `res.end()` 方法结束响应。

然后，我们使用 `server.listen()` 方法将服务器绑定到特定的端口号（在这个例子中是 3000），并在端口绑定完成后执行回调函数。

`listen()` 方法的语法如下：

```js
server.listen([port[, hostname[, backlog]]][, callback])
```

它有四个参数，它们都是可选的，含义如下：

- `port`：一个数字，表示服务器要监听的端口号。如果未指定，则默认为 `80`（HTTP）或 `443`（HTTPS）。

- `hostname`：一个字符串，主机名，表示要绑定的网络地址。如果未指定，则服务器将会监听所有可用的网络地址。即通常会被解析成 `127.0.0.1`，也就是域名：`localhost`，它是一个回环地址。

  - 回环地址（loopback address）是一种预留的 IP 地址，用于将网络数据包定向回发起方的主机。它通常使用 `127.0.0.1` 这个特殊的 IP 地址来表示，也可以使用 IPv6 中的 `::1` 来表示。

    正常的数据库包经常 应用层 - 传输层 - **网络层** - 数据链路层 - 物理层 。而回环地址，是在**网络层**直接就被获取到了，是不会经常数据链路层和物理层的。

- `backlog`：一个数字，表示服务器在拒绝新连接之前，操作系统可以排队的最大连接请求数。默认值为 `511`。

- `callback`：一个回调函数，在服务器开始监听指定的地址和端口时被调用。

### URL 的处理

服务器对 URL 进行处理是必要的，因为不同的 URL 表示不同的请求地址，其次，它上面可能还会携带不同的请求参数。因此，服务器需要根据不同的请求地址做出不同的响应。（当然，现在有很多的框架帮我简化了这些基础操作）

```js
const http = require('http')

// 1.创建server服务器
const server = http.createServer((req, res) => {
  const url = req.url

  // 区别不同的 URL
  if (url === '/login') {
    res.end('登录成功~')
  } else if (url === '/products') {
    res.end('商品列表~')
  } else if (url === '/other') {
    res.end('其它')
  }
})

// 2.开启server服务器
server.listen(8000, () => {
  console.log('服务器开启成功~')
})
```

```js
// 参数处理
const url = require('url')
const qs = require('querystring')

// 1.创建server服务器
const server = http.createServer((req, res) => {
  // 1.参数一: query类型参数
  // /home/list?offset=100&size=20
  // 1.1.解析url
  const urlString = req.url
  const urlInfo = url.parse(urlString)

  // 1.2.解析query: offset=100&size=20
  const queryString = urlInfo.query
  const queryInfo = qs.parse(queryString)
  console.log('offset:', queryInfo.offset, 'size:', queryInfo.size)

  res.end('请求结束')
})

// 2.开启server服务器
server.listen(8000, () => {
  console.log('服务器开启成功~')
})
```

### 区别不同的 method

在 HTTP 协议中，定义了多种不同的请求方法（也称为 HTTP 动词），用于指定客户端希望服务器执行的操作类型。以下是一些常见的 HTTP 方法及其区别：

1. GET：用于从服务器获取特定资源，并返回响应正文。GET 请求通常不会对服务器上的资源进行修改。之前的访问都是这个 GET。
2. POST：用于向服务器提交数据，例如在 Web 表单中向服务器提交表单数据。POST 请求通常会导致服务器上的资源进行修改。
3. PUT：用于向服务器上传新的资源或更新现有的资源。PUT 请求常常用于将文件上传到服务器或替换现有的文件。
4. DELETE：用于删除服务器上的资源。DELETE 请求会将指定的资源从服务器上彻底删除。
5. HEAD：与 GET 方法类似，但是只返回响应头部，而不包括响应正文。HEAD 请求通常用于检查资源是否存在以及获取资源的元数据信息。
6. OPTIONS：用于获取服务器支持的请求方法和其他可用选项。OPTIONS 请求通常用于客户端需要确定服务器所支持的功能和配置选项时。

```js
const server = http.createServer((req, res) => {
  const method = req.method // 在 req 请求里
})
```

### 解析 Body 参数

在 HTTP 请求中，除了请求头部之外，还可以包含一个请求主体（request body）部分，用于传递客户端向服务器提交的数据。这些请求体数据通常是以某种特定格式编码的数据，例如 JSON、XML 或表单数据等。

在 Node.js 中，可以使用 `http` 模块提供的 API 来访问 HTTP 请求主体数据。以下是一些常见的方法：

`req.on('data', callback)`：用于监听 HTTP 请求主体数据的 'data' 事件，并在收到新的数据时调用指定的回调函数。例如：

```js
const http = require('http')

const server = http.createServer((req, res) => {
  let body = ''
  req.setEncoding('utf-8') // body 解析格式

  req.on('data', (chunk) => {
    body += chunk.toString()
  })

  req.on('end', () => {
    // 在请求主体结束后调用指定的回调函数。
    console.log(body)
    res.end('Hello World\n')
  })
})

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/')
})
```

在上面的例子中，我们使用 `req.on('data', callback)` 方法监听 'data' 事件，并在每次接收到新的数据块时将其添加到请求主体字符串中。

### Header 参数

HTTP 请求和响应中包含了一些元数据信息，这些信息被称为头部（header）。请求头部中包含了客户端向服务器发送的信息，如请求的 URL、请求体的格式等；响应头部中包含了服务器返回给客户端的信息，如返回的数据类型、缓存设置等。

- `req.headers`：一个包含所有请求头部的对象。例如，要获取请求头部的 'content-type' 字段值，可以使用 `req.headers['content-type']`。
- `req.getHeader(name)`：用于获取指定请求头部的值。例如，要获取请求头部的 'content-type' 字段值，可以使用 `req.getHeader('content-type')`。
- `req.setHeaders(headers)`：用于设置多个请求头部字段的值。例如，要设置请求头部的 'content-type' 和 'accept' 字段值，可以使用 `req.setHeaders({ 'content-type': 'application/json', 'accept': 'application/json' })`。
- `req.setHeader(name, value)`：用于设置指定请求头部字段的值。例如，要设置请求头部的 'content-type' 字段值为 'application/json'，可以使用 `req.setHeader('content-type', 'application/json')`。

着重说一下 `content-type`，作为请求携带的数据类型，它定义了解析数据的方式，如果不指定则默认客户端接收到的是字符串，客户端会按照自己默认的方式进行处理。

- `application/x-www-form-urlencoded`:表示数据被编码成以 `'&'` 分隔的键 `-` 值对，同时以 `'='` 分隔键和值 ；
- `application/json`:表示是一个 json 类型；
- `text/plain`:表示是文本类型；
- `application/xml`:表示是 xml 类型；
- `multipart/form-data`:表示是上传文件；

### 响应对象

在 HTTP 协议中，响应对象（response object）是服务器返回给客户端的表示资源和状态信息的对象。响应对象通常包括以下几个部分：

1. 状态行（status line）：包含了响应的状态码和状态描述。
2. 响应头部（response headers）：包含了响应相关的元数据信息，例如**内容类型**（content-type）、缓存控制等。
3. 响应主体（response body）：包含了实际的响应数据，例如 HTML 内容、JSON 数据等。

在 Node.js 中，可以使用 `http` 模块提供的 API 来创建和操作 HTTP 响应对象。以下是一些常见的方法：

1. `res.writeHead(statusCode, [reasonPhrase], [headers])`：用于设置响应的状态行和头部信息。例如：

   ```js
   const http = require('http')

   const server = http.createServer((req, res) => {
     res.writeHead(200, { 'Content-Type': 'text/plain' })
     res.write('Hello World\n')
     res.end()
   })

   server.listen(3000, () => {
     console.log('Server running at http://localhost:3000/')
   })
   ```

   在上面的例子中，我们使用 `res.writeHead()` 方法设置了响应的状态码为 200，状态描述为默认值 OK，以及 Content-Type 头部字段为 text/plain，并发送了一个简单的文本响应。

2. `res.write(chunk, [encoding])`：用于向响应主体中写入数据。例如：

   ```js
   const http = require('http')

   const server = http.createServer((req, res) => {
     res.writeHead(200, { 'Content-Type': 'text/plain' })
     res.write('Hello ')
     res.write('World\n')
     res.end()
   })

   server.listen(3000, () => {
     console.log('Server running at http://localhost:3000/')
   })
   ```

   在上面的例子中，我们使用 `res.write()` 方法两次向响应主体中写入数据，并在最后通过 `res.end()` 方法结束响应。

3. `res.end([data], [encoding])`：用于结束响应并向客户端发送响应数据。例如：

   ```js
   const http = require('http')

   const server = http.createServer((req, res) => {
     res.writeHead(200, { 'Content-Type': 'text/plain' })
     res.end('Hello World\n')
   })

   server.listen(3000, () => {
     console.log('Server running at http://localhost:3000/')
   })
   ```

   在上面的例子中，我们使用 `res.end()` 方法向客户端发送了一个完整的响应，并结束了响应过程。

### 发送数据请求

Axios 库可以在浏览器中使用，也可以在 Node 中使用。区别是在浏览器中，使用的是封装`xhr`；在 Node 中，使用的是`http`内置模块。没错，`http`不仅可以创建服务，还可以发起请求。

以下是使用 Axios 发送 HTTP 请求的示例：

```js
const axios = require('axios')

// 发送 GET 请求
axios
  .get('https://jsonplaceholder.typicode.com/posts')
  .then((response) => {
    console.log(response.data)
  })
  .catch((error) => {
    console.error(error)
  })

// 发送 POST 请求
axios
  .post('https://jsonplaceholder.typicode.com/posts', {
    title: 'foo',
    body: 'bar',
    userId: 1,
  })
  .then((response) => {
    console.log(response.data)
  })
  .catch((error) => {
    console.error(error)
  })
```

上面的代码演示了如何使用 Axios 发送 GET 和 POST 请求，并处理响应数据。Axios 中的请求方法（例如 `get`、`post`）返回的是一个 Promise 对象，可以使用 `then` 和 `catch` 方法来处理异步响应数据。

Axios 还提供了其他一些方便的功能，例如设置请求头、发送文件等。以下是一些常见的用法示例：

```js
// 设置请求头
axios
  .get('https://jsonplaceholder.typicode.com/posts', {
    headers: {
      Authorization: 'Bearer token',
    },
  })
  .then((response) => {
    console.log(response.data)
  })
  .catch((error) => {
    console.error(error)
  })

// 发送 FormData 数据
const formData = new FormData()
formData.append('file', file)

axios
  .post('https://example.com/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  .then((response) => {
    console.log(response.data)
  })
  .catch((error) => {
    console.error(error)
  })
```

在使用 Axios 发送 HTTP 请求时，请确保了解其用法和准确性，并尽可能地考虑请求的正确性、安全性和可扩展性等方面的问题。同时，也要避免对服务器造成不必要的压力或安全问题，以确保应用程序具有足够的健壮性和可靠性。

### 实现一个服务器接收用户上传图片的代码

```js
const http = require('http')
const fs = require('fs')

// 1.创建server服务器
const server = http.createServer((req, res) => {
  req.setEncoding('binary')

  // 获取 boundary
  const boundary = req.headers['content-type']
    .split('; ')[1]
    .replace('boundary=', '')
  console.log(boundary)

  // 客户端传递的数据是表单数据(请求体)
  let formData = ''
  req.on('data', (data) => {
    formData += data
  })

  req.on('end', () => {
    console.log(formData)
    // 1.截图从image/jpeg位置开始后面所有的数据
    const imgType = 'image/jpeg'
    const imageTypePosition = formData.indexOf(imgType) + imgType.length
    let imageData = formData.substring(imageTypePosition)

    // 2.imageData开始位置会有两个空格
    imageData = imageData.replace(/^\s\s*/, '')

    // 3.替换最后的boundary
    imageData = imageData.substring(0, imageData.indexOf(`--${boundary}--`))

    // 4.将imageData的数据存储到文件中
    fs.writeFile('./bar.png', imageData, 'binary', () => {
      console.log('文件存储成功')
      res.end('文件上传成功~')
    })
  })
})

// 2.开启server服务器
server.listen(8000, () => {
  console.log('服务器开启成功~')
})
```

## Web 开发小工具

- postman 可以模拟数据收发请求
- nodemon：一个 node 库，可以监听 node 代码是否变化，若是改变了则重新开启刷新服务。
