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

实际上在 JavaScript 这种将函数作为一等对象的语言里，策略模式已经融入到了语言本身 当中，我们经常用高阶函数来封装不同的行为，并且把它传递到另一个函数中。当我们对这些函数发出“调用”的消息时，不同的函数会返回不同的执行结果。将上述的策略模式略加修饰便更具隐匿性了：

```js
var S = function (salary) {
  return salary * 4
}
var A = function (salary) {
  return salary * 3
}
var B = function (salary) {
  return salary * 2
}
var calculateBonus = function (func, salary) {
  return func(salary)
}
calculateBonus(S, 10000)
```

## 代理模式

代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问。

来简单实现一个虚拟代理实现图片预加载的实现：

```js
const myImage = (function () {
  const imgNode = document.createElement('img')
  document.body.appendChild(imgNode)
  return {
    setSrc: function (src) {
      imgNode.src = src
    },
  }
})()

const proxyImage = (function () {
  const img = new Image()
  img.onload = function () {
    myImage.setSrc(this.src)
  }
  return {
    setSrc: function (src) {
      myImage.setSrc('file://C:/Users/Desktop/loading.gif')
      img.src = src
    },
  }
})()

proxyImage.setSrc(
  'https://picx.zhimg.com/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.jpg'
)
```

这段代码创建了两个立即执行函数（IIFE），myImage 和 proxyImage，并在页面上加载了一张图片。

首先，myImage IIFE 创建了一个 imgNode 元素并将其附加到页面的 body 元素上。然后，它返回一个包含 setSrc 方法的对象。 setSrc 方法用于设置 imgNode 元素的 src 属性，以便加载指定的图像。

接下来，proxyImage IIFE 创建了一个新的 Image 对象，并为其设置了一个 onload 事件处理程序。 **onload 事件处理程序需要在图片成功加载后才会执行**，这里会将图片的 src 属性设置为 myImage 的 setSrc 方法。proxyImage IIFE 返回一个包含 setSrc 方法的对象，该方法设置 img 对象的 src 属性，并将 myImage 的 setSrc 方法设置为一个本地的 loading.gif 图像的路径，以便在图像加载期间显示 loading 图像。

最后，proxyImage 的 setSrc 方法被调用，并传入了一个图像 URL。这将触发 img 对象的 onload 事件处理程序，该处理程序将 myImage 对象的 setSrc 方法设置为新加载的图像 URL，并从本地路径加载 loading.gif 图像，以便在新图像加载期间显示 loading 图像。

刚刚接触代理时，会觉得这个功能大可不必，不经过代理也可实现，但是这里运用到了单一职责思想。单一职责原则指的是，就一个类(通常也包括对象和函数等)而言，应该仅有一个引起它变 化的原因。如果一个对象承担了多项职责，就意味着这个对象将变得巨大，引起它变化的原因可 能会有多个。面向对象设计鼓励将行为分布到细粒度的对象之中，如果一个对象承担的职责过多， 等于把这些职责耦合到了一起，这种耦合会导致脆弱和低内聚的设计。当变化发生时，设计可能 会遭到意外的破坏。

通俗的解释就是，如果后续不需要这个预加载占位，直接去掉代理即可，这个功能便去掉了不会对图片加载本身造成影响。

## 迭代模式

迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。实际上 js 已经实现了迭代模式。如 Array.prototype.froEach 便可迭代的顺序访问各个属性值。而且目前，绝大部分语言都内置了迭代器。

## 发布-订阅模式

发布-订阅模式又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状 态发生改变时，所有依赖于它的对象都将得到通知。在 JavaScript 开发中，我们一般用事件模型来替代传统的发布—订阅模式。

## 命令模式

命令模式:

## 组合模式

组合模式:
