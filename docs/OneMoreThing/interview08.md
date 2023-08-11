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

## Map 和 Set 有序和无序

## Map 和 Object 的区别

## Set 和 Array 的区别

## WeakMap 和 WeakSet
