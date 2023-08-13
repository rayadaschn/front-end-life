---
title: Interview -- JS 进阶
date: 2023-08-11
category:
  - anonymous
tag:
  - note
star: false
# sticky: true
sticky: false
---

## 函数声明和函数表达式的区别

- 函数声明 `function fn() {}`
- 函数表达式 `const fn = function() {}`
- 函数声明会在代码执行前预加载，而函数表达式不会;
- 函数声明无法立即执行，函数表达式可以通过添加括号或调用立即执行。

## new Object() 和 Object.create() 的区别

- `{}` 等同于 `new Object()`，原型均为 `Object.prototype`；
- `Object.create(null)` 没有原型，为空对象;
- `Object.create({...})` 可指定原型，并以此为原型返回一个“空对象”。

> Object.create() 方法创建的对象并不是空对象，它是一个以指定的原型对象为原型的新对象。
> ![Object.create 返回“空对象”](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202308102215506.png)

## 手写字符串 trim 方法，保证浏览器兼容性

```js
String.prototype.trim = function () {
  return this.replace(/^\s+/, '').replace(/\s+$/, '')
}
```

## 如何捕获 JS 中的异常

手动捕获异常 try-catch-finally:

```js
function divide(a, b) {
  try {
    // 尝试执行可能会引发异常的代码
    const result = a / b
    console.log('Division result:', result)
  } catch (error) {
    // 在异常发生时执行的代码，可以对异常进行处理
    console.error('An error occurred:', error)
  } finally {
    // 无论是否发生异常，都会执行的代码块
    console.log('Finally block executed.')
  }
}

divide(10, 2) // 输出：Division result: 5, Finally block executed.
divide(10, 0) // 输出：An error occurred: Infinity, Finally block executed.
```

## 解析 url 参数

1. 使用 `window.location.search` 和正则表达式：

   ```javascript
   function getURLParameters(url) {
     const params = {}
     const queryString = url
       ? url.split('?')[1]
       : window.location.search.slice(1)
     const regex = /([^&=]+)=([^&]*)/g
     let match

     while ((match = regex.exec(queryString))) {
       const key = decodeURIComponent(match[1])
       const value = decodeURIComponent(match[2])
       params[key] = value
     }

     return params
   }

   const url = 'http://example.com/?name=John&age=30'
   const parameters = getURLParameters(url)
   console.log(parameters) // 输出：{ name: "John", age: "30" }
   ```

   > 这里的正则表达式 /([^&=]+)=([^&]\*)/g 是用来匹配 URL 参数字符串中的键值对的模式。
   >
   > 1. `/`：正则表达式的开始和结束符号。
   > 2. `([^&=]+)`：这是第一个捕获组，用于匹配除了 "&" 和 "=" 之外的任意字符。[^&=] 表示一个字符集，^ 在字符集的开头表示取反。+ 表示匹配一个或多个前面的字符。
   > 3. `=`匹配等号 "=" 字符。
   > 4. `([^&]*)`：这是第二个捕获组，用于匹配除了 "&" 字符之外的任意字符零次或多次。
   > 5. `/g`：这是正则表达式的标志。g 表示全局匹配，即匹配字符串中的所有符合模式的部分。
   >
   > 因此，整个正则表达式的含义是匹配形如 "key=value" 的键值对模式，并且可以在字符串中找到多个匹配项。

   该方法使用正则表达式解析 `window.location.search` 或自定义的 URL 字符串中的查询字符串部分，并将其解析为键值对的对象。

2. 使用 `URLSearchParams` API：

   ```javascript
   function getURLParameters(url) {
     const params = {}
     const queryString = url
       ? url.split('?')[1]
       : window.location.search.slice(1)
     const searchParams = new URLSearchParams(queryString)

     searchParams.forEach(function (value, key) {
       params[key] = value
     })

     return params
   }

   const url = 'http://example.com/?name=John&age=30'
   const parameters = getURLParameters(url)
   console.log(parameters) // 输出：{ name: "John", age: "30" }
   ```

   此方法使用 `URLSearchParams` API，它提供了一组方便的方法来处理 URL 查询字符串。可以通过迭代 `URLSearchParams` 的键值对来获取参数，并将其存储在对象中。

3. 使用第三方库，例如 `query-string`：

   ```javascript
   // 使用 npm 安装 query-string：npm install query-string
   const queryString = require('query-string')

   const url = 'http://example.com/?name=John&age=30'
   const parameters = queryString.parseUrl(url).query
   console.log(parameters) // 输出：{ name: "John", age: "30" }
   ```

   这种方法使用第三方库 `query-string`，它提供了一个简单的接口来解析和字符串化 URL 查询参数。

## Map 和 Object 的区别

Map 和 Object 是两种不同的数据结构，它们在功能和使用上有一些区别：

1. 键类型：Map 可以使用任何类型的值作为键，包括基本类型和对象引用，而 Object 的键只能是字符串或符号类型。

2. 键值对的顺序：Map 保持插入顺序，即键值对的顺序与其插入的顺序相同，而 Object 不保证键值对的顺序。

3. 内置方法和属性：Map 提供了一系列用于操作和遍历键值对的内置方法，如 set()、get()、has()、delete()、size 等。而 Object 也提供了一些用于操作和访问属性的方法和属性，如 Object.keys()、Object.values()、Object.entries() 等。

4. 原型链：Object 是 JavaScript 中的基础类型，具有原型链的特性，可以继承其他对象的属性和方法。而 Map 是一个独立的数据结构，不具有原型链的特性。

5. 迭代器和遍历：Map 提供了内置的迭代器，可以通过 for...of、forEach() 等方式遍历键值对。而 Object 在遍历时需要先将其属性转换为数组或使用 for...in 循环。

综上所述，Map 更适合用于存储和操作键值对的集合，而 Object 则更适合表示和操作单个实体或对象。如果需要有序的键值对并且键可以是任意类型，或者需要使用一些特定的内置方法来操作键值对集合，则 Map 是更好的选择(查询速度更快, 但是消耗内存也更大)。而如果只是需要简单的键值对结构或者要利用原型链的特性，那么 Object 是更常用的选项。

## Set 和 Array 的区别

同 Map 和 Object 类型，Set 和 Array 也是相互对应的。

1. 值的唯一性：Set 中的值是唯一的，不允许重复的值。如果尝试向 Set 中添加重复的值，它将被忽略。而 Array 中的值可以重复，并且可以包含多个相同的值。

2. 元素顺序：Set 中的元素没有特定的顺序，它们被视为**无序**的。而 Array 中的元素按照它们在数组中的顺序进行排序，并保持插入顺序。

3. 内置方法和属性：Set 提供了一系列用于操作和遍历集合的内置方法，例如 add()、has()、delete()、size 等。而 Array 提供了一系列用于操作和访问数组元素的方法和属性，例如 push()、pop()、length 等。

4. 迭代器和遍历：Set 提供了内置的迭代器，可以通过 for...of 或 forEach() 等方式遍历集合中的元素。而 Array 可以使用索引来访问数组元素，并且可以使用 for 循环、for...of、forEach() 等方式遍历数组。

5. 数据存储：Set 存储唯一值的集合，不保留重复的值。而 Array 存储任意类型的值，可以包含重复的值。

综上所述，Set 更适合存储唯一值的集合，并且提供了方便的方法来处理和操作这些值。它适用于**去重、检查值的存在性**等场景。而 Array 则更适合存储有序的、可重复的值的集合，并且提供了丰富的数组操作方法和索引访问的特性。它适用于需要按顺序操作和访问数组元素的场景。根据具体的需求，选择适合的数据结构可以提高代码的效率和可读性。

## WeakMap 和 WeakSet

`WeakMap` 和 `WeakSet` 是 JavaScript 中的两种弱引用集合类型，它们与 `Map` 和 `Set` 在功能和使用上有一些区别：

1. 弱引用：`WeakMap` 和 `WeakSet` 中的键（对于 `WeakMap`）和值（对于 `WeakSet`）是弱引用的。这意味着如果键或值不再被其他地方引用，它们将被垃圾回收机制自动回收，即使它们存在于 `WeakMap` 或 `WeakSet` 中。

2. 迭代和大小：由于弱引用的特性，`WeakMap` 和 `WeakSet` 不支持迭代器和方法来获取集合的大小（例如 `size` 属性）。这是因为在迭代期间，集合中的键或值可能已被垃圾回收并且无法访问，因此无法准确计算集合的大小。

3. 可用类型：`WeakMap` **只接受对象作为键**，而 `WeakSet` **只接受对象作为值**。它们不允许使用基本类型（如字符串、数字、布尔值）作为键或值。

4. 方法和属性：`WeakMap` 和 `WeakSet` 提供了一些用于操作集合的方法，例如 `has(key)`、`get(key)`、`set(key, value)`（对于 `WeakMap`），以及 `has(value)`、`add(value)`、`delete(value)`（对于 `WeakSet`）。然而，它们没有提供类似于 `Map` 和 `Set` 的遍历方法或属性。

5. 应用场景：`WeakMap` 和 `WeakSet` 主要用于需要在存储对象的同时不影响垃圾回收过程的场景。它们常被用于实现对象私有数据或缓存等功能。

总结起来，`WeakMap` 和 `WeakSet` 是一种特殊类型的集合，其中的键和值是弱引用的，不会阻止相关对象被垃圾回收。它们主要适用于需要存储对象集合的场景，并且希望对象的生命周期不受集合的影响。
