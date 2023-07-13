---
title: 设计模式 01
icon: javascript
date: 2022-07-11
category:
  - javascript
tag:
  - javascript

sticky: false
---

从这里开始学习设计模式。

设计模式一共有 23 种，在此共记录在 JavaScript 开发中更 常见的 14 种设计模式。它们分别是：

- [单例模式](#单例模式)
  - [简单实现单例模式](#简单实现单例模式)
  - [封装一个通用的单例模式](#封装一个通用的单例模式)
- [策略模式](#策略模式)
- [代理模式](#代理模式)
- [迭代模式](#迭代模式)
- [发布-订阅模式](#发布-订阅模式)
- [命令模式](#命令模式)
- [组合模式](#组合模式)

## 单例模式

单例模式的定义是:保证一个类仅有一个实例，并提供一个访问它的全局访问点。

通俗的解释就是只能开一个应用，如只能打开一个微信，应用开启后再点击，会打开在运行的微信无法创建一个新的微信。

### 简单实现单例模式

可以想到如果只能创建一个类或者实例，则会永远访问同一个内存地址。所以可以用闭包来实现：

```js
let Singleton = function (name) {
  this.name = name
}

Singleton.prototype.getName = function () {
  console.log(this.name)
}

Singleton.getInstance = (function () {
  let instance = null
  return function (name) {
    if (!instance) {
      instance = new Singleton(name)
    }
    return instance
  }
})()

const a = Singleton.getInstance('first') // 第一个应用
const b = Singleton.getInstance('second') // 第二个应用
console.log(a === b) // true
```

> 注意: 依据单例模式的特点，在 JavaScript 中，全局变量不是单例模式，但在 JavaScript 开发中，我们经常会把全局变量当成单例来使用。这容易造成命名空间污染，应当尽量避免全局变量的使用。

### 封装一个通用的单例模式

```js
const getSingle = function (fn) {
  let result = null
  return function () {
    return result || (result = fn.apply(this, arguments))
  }
}

// 应用实战
var bindEvent = getSingle(function () {
  document.getElementById('div1').onclick = function () {
    console.log('click 点击')
  }
  return true
})
var render = function () {
  console.log('开始渲染列表')
  bindEvent()
}
render()
render()
render()
```

在这里，render 函数和 bindEvent 函数都分别执行了 3 次，但 div 实际上只被绑定了一个事件。

看上去和防抖节流的实现很类似是不是？确实如此。这样做的好处是，使得要实现的方法作为高阶函数的参数被传入咱们的单例模型里，适用性较广。

## 策略模式

策略模式:

## 代理模式

代理模式:

## 迭代模式

迭代模式:

## 发布-订阅模式

发布-订阅模式:

## 命令模式

命令模式:

## 组合模式

组合模式:
