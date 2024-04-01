---
title: 设计模式 01
icon: javascript
date: 2023-07-11
category:
  - javascript
tag:
  - javascript

sticky: false
---

从这里开始学习设计模式。牢记一个规则：设计模式的主题总是把不变的事物和变化的事物分离开来。

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
- [参考文献](#参考文献)

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

能够联想到的是 Vue2 中常用的事件总线 EventBus，确实也是基于此模式实现的。基于此，实现一个最小可行的发布-订阅：

```js
// 设置订阅功能
const Event = {
  clientList: [],
  listen: function (key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = []
    }
    this.clientList[key].push(fn) // 订阅的消息添加进缓存列表
  },
  trigger: function () {
    let key = Array.prototype.shift.call(arguments),
      fns = this.clientList[key]

    if (!fns || fns.length === 0) {
      return false
    }

    for (let i = 0; i < fns.length; i++) {
      const fn = fns[i++]
      fn.apply(this, arguments) // arguments 是 trigger 时附带的参数
    }
  },
  remove: function (key, fn) {
    const fns = this.clientList[key]

    // 开始遍历取消订阅
    if (!fns) return false // 1. key 没有被人订阅, 直接返回

    if (!fn) {
      // 若没有传入具体的回调函数，则取消 key 对应的所有订阅
      fns && (fns.length = 0)
    } else {
      for (let i = fns.length - 1; i >= 0; i--) {
        const fnItem = fns[i]
        if (fnItem === fn) fns.splice(i, 1) // 删除订阅者的回调函数
      }
    }
  },
}

// 安装订阅
const installEvent = function (obj) {
  for (const key in Event) {
    obj[key] = Event[key]
  }
}

// 订阅测试
const salesOffices = {}
installEvent(salesOffices)
salesOffices.listen('squareMeter88', function (price) {
  // 消息订阅 1
  console.log('价格= ' + price)
})
salesOffices.listen('squareMeter100', function (price) {
  // 消息订阅 2
  console.log('价格= ' + price)
})

salesOffices.trigger('squareMeter88', 2000000) // 输出:2000000
salesOffices.trigger('squareMeter100', 3000000) // 输出:3000000
```

发布—订阅模式的优点非常明显，一为时间上的解耦，二为对象之间的解耦。它的应用非常广泛，既可以用在异步编程中，也可以帮助我们完成更松耦合的代码编写。发布—订阅模式还可 以用来帮助实现一些别的设计模式，比如中介者模式。从架构上来看，无论是 MVC 还是 MVVM， 都少不了发布—订阅模式的参与，而且 JavaScript 本身也是一门基于事件驱动的语言。

当然，发布—订阅模式也不是完全没有缺点。创建订阅者本身要消耗一定的时间和内存，而且当你订阅一个消息后，也许此消息最后都未发生，但这个订阅者会始终存在于内存中。另外，发布—订阅模式虽然可以弱化对象之间的联系，但如果过度使用的话，对象和对象之间的必要联系也将被深埋在背后，会导致程序难以跟踪维护和理解。特别是有多个发布者和订阅者嵌套到一起的时候，要跟踪一个 bug 不是件轻松的事情。

## 命令模式

命令模式（Command Pattern）是一种行为型设计模式，它将请求封装成对象，从而使得请求发起者和请求接收者解耦，并且可以方便地记录、撤销和重做请求操作。

在命令模式中，客户端发起请求的对象称为请求者（Invoker），请求接收者称为接收者（Receiver），请求封装成的对象称为命令（Command）。命令对象中包含了请求的操作和相关的参数，以及执行该操作的方法。请求者通过调用命令对象的方法来发起请求，接收者通过执行命令对象的方法来响应请求。

命令模式的核心思想是将请求封装成对象，从而将请求的发起者和接收者解耦。在使用命令模式时，可以将命令对象存储在队列中，实现命令的记录、撤销和重做等功能。此外，命令模式还可以与其他模式结合使用，例如备忘录模式、组合模式等。

命令模式的由来，其实是回调(callback)函数的一个面向对象的替代品。实际上 JavaScript 可以用高阶函数非常方便地实现命令模式。命令模式在 JavaScript 语言中是一种隐形的模式。

```html
<body>
  <button id="button1">点击按钮 1</button>
  <button id="button2">点击按钮 2</button>
  <button id="button3">点击按钮 3</button>
</body>
<script>
  let button1 = document.getElementById( 'button1' ),

  let setCommand = function( button, func ){
    button.onclick = function(){
      func();
    }
  };
  let MenuBar = {
    refresh: function(){
      console.log( '刷新菜单界面' );
    }
  };
  let RefreshMenuBarCommand = function( receiver ){
    return function(){
      receiver.refresh();
    }
  };
  let refreshMenuBarCommand = RefreshMenuBarCommand( MenuBar );
  setCommand( button1, refreshMenuBarCommand );
</script>
```

命令模式的优点包括：

- 降低系统的耦合度，请求者和接收者之间解耦，可以方便地扩展和修改系统。
- 可以对请求进行记录、撤销和重做等操作，提高系统的灵活性和可维护性。
- 可以将请求封装成独立的对象，并且可以方便地传递和存储，提高系统的可重用性。

命令模式的缺点包括：

- 会增加系统的复杂性，需要定义大量的命令对象和接收者对象。
- 如果命令对象过多，可能会导致系统的性能下降。
- 命令模式中的请求者和接收者之间存在间接调用关系，可能会影响系统的响应速度。

## 组合模式

组合模式就是用小的子对象来构建更大的对象，而这些小的子对象本身也许是由更小的“孙对象”构成的。

简单的描述就是搭积木，一个大的对象由数个小的对象组成。

值得注意的地方：

1. 组合模式不是父子关系，它们可以是并列的。
2. 组合模式除了要求组合对象和叶对象拥有相同的接口之外，还有一个必要条件，就是对一组
   叶对象的操作必须具有一致性。下面这个比喻非常恰当：
   比如公司要给全体员工发放元旦的过节费 1000 块，这个场景可以运用组合模式，但如果公 司给今天过生日的员工发送一封生日祝福的邮件，组合模式在这里就没有用武之地了，除非先把 今天过生日的员工挑选出来。只有用一致的方式对待列表中的每个叶对象的时候，才适合使用组合模式。
3. 双向映射关系，这主要是防止重复嵌套。若不是如此，可能并不适用组合模式。

## 参考文献

- 《JavaScript 设计模式与开发实践》
