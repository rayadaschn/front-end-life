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
  - [简单实现策略模式](#简单实现策略模式)
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

策略模式的定义是:定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。

通俗的理解就是厨子为了做饭准备了一些列的厨具，例如菜刀系列都可以切肉，但是每把刀都有所差异。

策略模式的使用，是定义一系列的算法，把它们一个个封装起来。将不变的部分和变化的部分隔开是每个设计模式的主题，目的是将算法的使用与算法的实现分离开来。

### 简单实现策略模式

以发统计绩效奖金为例，定义一个 strategy 策略计算不同绩效下的奖金：

```js
let strategies = {
  S: function (salary) {
    return salary * 4
  },
  A: function (salary) {
    return salary * 3
  },
  B: function (salary) {
    return salary * 2
  },
}
```

实际奖金的计算则交由专门的 context 去做：

```js
let calculateBonus = function (level, salary) {
  return strategies[level](salary)
}

console.log(calculateBonus('S', 20000)) // 输出:80000
console.log(calculateBonus('A', 10000)) // 输出:30000
```

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
