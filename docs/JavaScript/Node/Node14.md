---
title: 再论 Buffer
icon: nodeJS
date: 2025-06-09
category:
  - javascript
tag:
  - node
---

本文重新梳理一遍 Node.js 中的 Buffer 概念和使用方法。

> [!NOTE] 为什么需要 Buffer?
> 在 Node.js 中，Buffer 是处理二进制数据的核心对象。JavaScript 本身是基于 Unicode 的字符串处理，但在网络通信、文件操作等场景中，我们经常需要处理原始的二进制数据。Buffer 提供了一种高效的方式来存储和操作这些数据。(Blob 不能直接进行问卷的处理，ArrayBuffer 不能直接操作二进制数据，而 Buffer 则可以直接操作二进制数据)

## 关于字节

计算机内部，所有信息最终都是一个二进制值。每一个二进制位（bit）有 0 和 1 两种状态，因此八个二进制位就可以组合出 256 种状态，这被称为一个字节(byte) 。

因此对应的的单位有：

- 8 位 = 1 字节
- 1024 字节 = 1K
- 1024K = 1M
- 1024M = 1G
- 1024G = 1T

在 Javascript 中的进制转换

```js
// 1. 二进制转十进制
const binary = '101010'
const decimal = parseInt(binary, 2)
console.log(decimal) // 输出: 42

// 2. 十进制转二进制
const decimalNumber = 42
const binaryString = decimalNumber.toString(2)
console.log(binaryString) // 输出: '101010'

// 3. 十六进制转十进制
const hex = '2A'
const decimalFromHex = parseInt(hex, 16)
console.log(decimalFromHex) // 输出: 42
```

> [!NOTE] 为什么 0.1 + 0.2 !== 0.3?
> 在 JavaScript 中，浮点数的表示方式会导致某些小数无法精确表示，因此在进行浮点数运算时可能会出现微小的误差。
> 这就是为什么 `0.1 + 0.2 !== 0.3` 的原因。
>
> ```js
> console.log(0.1 + 0.2 === 0.3) // 输出: false
> console.log(0.1 + 0.2) // 输出: 0.30000000000000004
> ```

## 常见的编码

常见的编码方式有：

- UTF-8 缺点就是它是一种变长编码方式。
- UTF-16 是每次 16 个位置，因此它是一种定长编码方式。
- ASCII，一种单字节编码方式，主要用于英文
- GBK，一种双字节编码方式，主要用于中文
- base64，一种基于 64 个可打印字符来表示二进制数据的方法

在 node 中，Buffer 默认使用 UTF-8 编码。编码格式可参考阮一峰老师 [《Unicode 与 JavaScript 详解》](https://www.ruanyifeng.com/blog/2014/12/unicode.html)。

简单梳理就是最早编码采用的是 ascii 编码，后来每个国家为了支持更多的字符集，产生了不同的编码方式，如 GBK。而 unicode 则是为了统一所有字符集而产生的编码方式。它的实现由 utf 组织实现，utf-8 是最常用的编码方式。

而 base64 编码主要解决的是**传输问题**，例如中文是不好传输的。传输过程中如果发生中断，则容易乱码。它是将二进制数据转换为 ASCII 字符串的编码方式。base64 和 base32 的区别在于 base64 使用 64 个字符来表示数据，而 base32 使用 32 个字符。base64 编码的效率更高，但 base32 更适合于 URL 和文件名等场景。

base64 的缺点是以前是 3 个字节，编码后是 4 个字节，因此会增加数据的大小。base64 编码的效率是 3:4，即每 3 个字节的数据会被编码为 4 个字节的字符串，大了 1/3。

## 定义 Buffer 的三种方式

上文提到 Buffer 是用来存放内容处理操作二进制的，实质就是标识的就是内存空间。创建的方式有：

```js
/** 1. 通过长度定义 */
// 创建一个长度为 10、且用 0 填充的 Buffer。 alloc 也就是allocate，分配的意思
const buf1 = Buffer.alloc(10)
// 创建一个长度为 10、且用 0x1 填充的 Buffer。
const buf2 = Buffer.alloc(10, 1)
// 创建一个长度为 10、且未初始化的 Buffer。
const buf3 = Buffer.allocUnsafe(10)

/** 2. 通过数组定义 */
// 创建一个包含 [0x1, 0x2, 0x3] 的 Buffer。
const buf4 = Buffer.from([1, 2, 3])

/** 通过字符串创建 */
const buf5 = Buffer.from('字符串创建')
```

上面主要用到了俩个方法：

1. `Buffer.alloc()`: 分配内存大小;
2. `Buffer.from()`: 将内容转换为 buffer;

## buffer 常用方法

1. `Buffer.copy(targetBuffer[, targetStart[, sourceStart[, sourceEnd]]])`: 将一个 Buffer 复制到另一个 Buffer。
2. `Buffer.fill(value[, offset[, end]][, encoding])`：用指定的字节填充一个 Buffer。
3. `Buffer.concat(list[, totalLength])`: 将多个 Buffer 连接成一个 Buffer。
4. `Buffer.slice([start[, end]])`: 返回一个新的 Buffer，包含原 Buffer 中指定范围内的字节。
5. `Buffer.toString([encoding[, start[, end]]])`: 将 Buffer 转换为字符串。
6. `Buffer.write(string[, offset[, length]][, encoding])`: 将字符串写入 Buffer。
7. `Buffer.isBuffer(obj)`: 检查一个对象是否为 Buffer。
8. `Buffer.byteLength(string[, encoding])`: 返回字符串的字节长度。
