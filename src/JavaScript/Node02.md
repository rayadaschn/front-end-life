---
title: Node 服务器开发基础
icon: node
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

`fs.createReadStream()` 是 Node.js 内置模块 `fs` 提供的一个方法，用于创建一个可读流（Readable Stream）以从文件中读取数据。

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

readStream.on('data', chunk => {
  console.log(chunk)
})

readStream.on('end', () => {
  console.log('Done')
})
```

在上面的例子中，我们使用 `fs.createReadStream()` 方法创建了一个可读流，并从文件 `'example.txt'` 中读取数据。由于我们在配置项中设置了 `encoding: 'utf8'`，因此每次读取到的数据块都会以字符串的形式输出到控制台。然后，我们监听了该可读流的 `'data'` 和 `'end'` 事件，以便在可读流有新的数据块可用或所有数据块都被消费完毕时执行相应的操作。

需要注意的是，在处理可读流时，请特别注意内存泄漏和错误处理等问题。同时，也应该及时释放资源、关闭流等，避免出现资源浪费和程序不稳定等问题。