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
- 推荐使用 `setImmediate` 代替 `process.nextTick`

具体可看[《node 基础》](../JavaScript/Node01.md)
