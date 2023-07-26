---
title: 设计模式 02
icon: javascript
date: 2022-07-11
category:
  - javascript
tag:
  - javascript

sticky: false
---

从这里开始学习设计模式。

接着上篇继续来聊设计模式。

- [模版方法模式](#模版方法模式)
- [享元模式](#享元模式)
- [职责链模式](#职责链模式)
- [中介模式](#中介模式)
- [装饰者模式](#装饰者模式)
- [状态模式](#状态模式)
- [适配器模式](#适配器模式)

## 模版方法模式

模板方法模式是一种只需使用继承就可以实现的非常简单的模式。

模板方法模式由两部分结构组成，第一部分是抽象父类，第二部分是具体的实现子类。通常在抽象父类中封装了子类的算法框架，包括实现一些公共方法以及封装子类中所有方法的执行顺序。子类通过继承这个抽象类，也继承了整个算法结构，并且可以选择重写父类的方法。

```js
const Beverage = function (param) {
  const boilWater = function () {
    console.log('把水煮沸')
  }
  const brew =
    param.brew ||
    function () {
      throw new Error('必须传递 brew 方法')
    }
  const pourInCup =
    param.pourInCup ||
    function () {
      throw new Error('必须传递 pourInCup 方法')
    }
  const addCondiments =
    param.addCondiments ||
    function () {
      throw new Error('必须传递 addCondiments 方法')
    }
  const F = function () {}
  F.prototype.init = function () {
    boilWater()
    brew()
    pourInCup()
    addCondiments()
  }
  return F
}

const Coffee = Beverage({
  brew: function () {
    console.log('用沸水冲泡咖啡')
  },
  pourInCup: function () {
    console.log('把咖啡倒进杯子')
  },
  addCondiments: function () {
    console.log('加糖和牛奶')
  },
})

const Tea = Beverage({
  brew: function () {
    console.log('用沸水浸泡茶叶')
  },
  pourInCup: function () {
    console.log('把茶倒进杯子')
  },
  addCondiments: function () {
    console.log('加柠檬')
  },
})

const coffee = new Coffee()
coffee.init()

const tea = new Tea()
tea.init()
```

## 享元模式

享元(flyweight)模式是一种用于性能优化的模式，“fly”在这里是苍蝇的意思，意为蝇量级。享元模式的核心是运用共享技术来有效支持大量细粒度的对象。

享元模式的目标是尽量减少共享对象的数量，关于如何划分内部状态和外部状态，下面的几条经验提供了一些指引。

- 内部状态存储于对象内部。
- 内部状态可以被一些对象共享。
- 内部状态独立于具体的场景，通常不会改变。
- 外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享。

在享元模式中，对象被分为两种类型：内部状态和外部状态。内部状态是可以共享的，它们不依赖于具体的场景，因此可以在不同的对象之间共享。而外部状态则依赖于具体的场景，因此不能被共享。

享元模式的核心思想是将内部状态和外部状态分离，将内部状态存储在享元对象中，并通过参数传递外部状态。这样，当需要创建一个新的对象时，可以先检查是否存在具有相同内部状态的对象，如果存在，则可以重用该对象，而不必创建新的对象。

举个例子，假设我们有一个文本编辑器，需要创建大量的字符对象来表示文本中的每个字符。如果我们使用常规的方式来创建字符对象，那么每个字符对象都会占用一定的内存空间。但是，如果使用享元模式，我们可以将字符对象的内部状态（例如字符的字体、大小、颜色等）存储在享元对象中，并通过参数传递字符的位置等外部状态。这样，如果需要创建同一字符的多个实例，可以重用已经存在的享元对象，从而减少内存使用和对象创建的开销。

在 JavaScript 中，可以通过将内部状态存储在共享的对象中来实现享元模式。

下面是一个简单的示例，演示如何使用享元模式创建大量的圆形对象：

```js
// 定义一个 Circle 类表示圆形
class Circle {
  constructor(radius, color) {
    this.radius = radius
    this.color = color
  }

  // 定义一个 draw 方法来绘制圆形
  draw(x, y) {
    console.log(
      `Drawing a ${this.color} circle with radius ${this.radius} at (${x}, ${y})`
    )
  }
}

// 定义一个 CircleFactory 工厂类来创建圆形对象
class CircleFactory {
  constructor() {
    this.circles = {}
  }

  getCircle(radius, color) {
    // 如果已经存在相同内部状态的圆形对象，则直接返回该对象
    const key = `${radius}_${color}`
    if (this.circles[key]) {
      return this.circles[key]
    }

    // 否则，创建新的圆形对象，并将其存储在共享对象中
    const circle = new Circle(radius, color)
    this.circles[key] = circle
    return circle
  }
}

// 使用 CircleFactory 工厂类创建大量的圆形对象
const factory = new CircleFactory()
const circle1 = factory.getCircle(5, 'red')
const circle2 = factory.getCircle(10, 'blue')
const circle3 = factory.getCircle(5, 'red')

// 由于 circle1 和 circle3 具有相同的内部状态，因此它们实际上是同一个对象
console.log(circle1 === circle3) // true

// 绘制圆形对象
circle1.draw(0, 0) // Drawing a red circle with radius 5 at (0, 0)
circle2.draw(10, 10) // Drawing a blue circle with radius 10 at (10, 10)
circle3.draw(20, 20) // Drawing a red circle with radius 5 at (20, 20)
```

在上面的示例中，我们定义了一个 `Circle` 类来表示圆形，并定义了一个 `CircleFactory` 工厂类来创建圆形对象。在 `CircleFactory` 类中，我们使用一个共享的对象（`this.circles`）来存储已经创建的圆形对象。当需要创建新的圆形对象时，我们首先检查是否已经存在具有相同内部状态的圆形对象，如果存在，则直接返回该对象，否则，创建新的圆形对象，并将其存储在共享对象中。

在使用 `CircleFactory` 工厂类创建圆形对象时，我们可以看到，如果创建具有相同内部状态的圆形对象，则返回的实际上是同一个对象。这样，可以避免创建大量相似的圆形对象，从而减少内存使用和对象创建的开销。

## 职责链模式

职责链模式的定义是:使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。

```js
// 定义一个基础处理器类
class Handler {
  constructor() {
    this.nextHandler = null
  }

  setNextHandler(handler) {
    this.nextHandler = handler
  }

  handleRequest(request) {
    if (this.nextHandler) {
      return this.nextHandler.handleRequest(request)
    }
    return null
  }
}

// 定义具体的处理器类
class ConcreteHandler1 extends Handler {
  handleRequest(request) {
    if (request.type === 'type1') {
      console.log('ConcreteHandler1 处理了请求：', request)
      return request
    }
    return super.handleRequest(request)
  }
}

class ConcreteHandler2 extends Handler {
  handleRequest(request) {
    if (request.type === 'type2') {
      console.log('ConcreteHandler2 处理了请求：', request)
      return request
    }
    return super.handleRequest(request)
  }
}

class ConcreteHandler3 extends Handler {
  handleRequest(request) {
    if (request.type === 'type3') {
      console.log('ConcreteHandler3 处理了请求：', request)
      return request
    }
    return super.handleRequest(request)
  }
}

// 使用处理器类处理请求
const handler1 = new ConcreteHandler1()
const handler2 = new ConcreteHandler2()
const handler3 = new ConcreteHandler3()

handler1.setNextHandler(handler2)
handler2.setNextHandler(handler3)

const request1 = { type: 'type1', data: 'data1' }
const request2 = { type: 'type2', data: 'data2' }
const request3 = { type: 'type3', data: 'data3' }
const request4 = { type: 'type4', data: 'data4' }

handler1.handleRequest(request1)
handler1.handleRequest(request2)
handler1.handleRequest(request3)
handler1.handleRequest(request4)
```

在上面的例子中，我们定义了一个基础的处理器类 `Handler`，它有一个 `nextHandler` 属性，用于存储下一个处理器。然后，我们定义了三个具体的处理器类 `ConcreteHandler1`、`ConcreteHandler2` 和 `ConcreteHandler3`，它们都继承自 `Handler` 类，并实现了 `handleRequest` 方法，用于在满足条件时处理请求，否则将请求传递给下一个处理器。

接着，我们创建了三个处理器实例 `handler1`、`handler2` 和 `handler3`，并将它们按照处理顺序连接起来。最后，我们创建了四个请求对象 `request1`、`request2`、`request3` 和 `request4`，并将它们依次交给 `handler1` 处理。

在运行上述代码后，你会看到如下输出：

```log
ConcreteHandler1 处理了请求： { type: 'type1', data: 'data1' }
ConcreteHandler2 处理了请求： { type: 'type2', data: 'data2' }
ConcreteHandler3 处理了请求： { type: 'type3', data: 'data3' }
```

可以看到，当请求的类型分别为 `type1`、`type2` 和 `type3` 时，对应的处理器成功处理了请求，而当请求类型为 `type4` 时，由于没有对应的处理器，请求被最后一个处理器忽略。

总的来说，职责链模式就是利用了链表这样的数据结构对转态进行传递，直至找到需要的节点。

## 中介模式

中介模式是许多个对象之间通过一个中介对象进行通信和协作，而不是直接相互引用和交互。中介者对象将对象之间的交互集中在一起，从而降低了对象之间的耦合度，使得系统更易于维护和扩展。

> 中介模式和代理模式的主要区别在于它们的目的和应用场景:
> 中介模式的主要目的是将多个对象之间的交互行为集中到一个中介者对象中，从而降低对象之间的耦合度，使得系统更易于维护和扩展。中介模式通常适用于对象之间的交互比较复杂、耦合度较高的情况，例如 GUI 应用程序中的组件之间的交互、多人在线游戏中的玩家之间的交互等。
> 代理模式的主要目的是为其他对象提供一个代理，从而控制对对象的访问。代理对象通常充当了被代理对象的占位符，可以在不改变原有代码的情况下增加额外的功能，例如缓存、权限控制、日志记录等。代理模式通常适用于需要对对象的访问进行控制和管理的情况，例如网络代理、远程代理、虚拟代理等。

中介模式的关键在于将对象之间的交互行为抽象出来，形成一个中介者对象。中介者对象负责维护对象之间的关系，处理对象之间的通信和协作，从而实现对象之间的解耦。通常情况下，中介者对象会提供一些公共方法，用于对象之间的通信和协作，而对象则通过调用中介者对象的方法来实现与其他对象的交互。

下面是一个简单的中介模式示例：

```js
// 定义一个中介者类
class Mediator {
  constructor() {
    this.components = []
  }

  register(component) {
    this.components.push(component)
    component.setMediator(this)
  }

  send(message, sender) {
    for (const component of this.components) {
      if (component !== sender) {
        component.receive(message)
      }
    }
  }
}

// 定义一个组件类
class Component {
  constructor(name) {
    this.name = name
    this.mediator = null
  }

  setMediator(mediator) {
    this.mediator = mediator
  }

  send(message) {
    console.log(`${this.name} 发送了消息：${message}`)
    this.mediator.send(message, this)
  }

  receive(message) {
    console.log(`${this.name} 收到了消息：${message}`)
  }
}

// 使用中介者模式实现组件之间的通信
const mediator = new Mediator()

const component1 = new Component('Component 1')
const component2 = new Component('Component 2')
const component3 = new Component('Component 3')

mediator.register(component1)
mediator.register(component2)
mediator.register(component3)

component1.send('Hello from Component 1')
component2.send('Hello from Component 2')
component3.send('Hello from Component 3')
```

在上面的示例中，我们定义了一个中介者类 `Mediator`，它维护了一个组件对象数组 `components`，并提供了注册组件和发送消息的方法。我们还定义了一个组件类 `Component`，它有一个 `name` 属性和一个 `mediator` 属性，用于存储组件的名字和中介者对象。组件类提供了发送消息和接收消息的方法，其中发送消息方法会调用中介者对象的 `send` 方法，从而实现了组件之间的通信。

最后，我们创建了三个组件对象 `component1`、`component2` 和 `component3`，并将它们注册到中介者对象 `mediator` 中。接着，我们分别调用了三个组件对象的 `send` 方法，从而实现了它们之间的通信。在运行上述代码后，你会看到如下输出：

```log
Component 1 发送了消息：Hello from Component 1
Component 2 收到了消息：Hello from Component 1
Component 3 收到了消息：Hello from Component 1
Component 2 发送了消息：Hello from Component 2
Component 1 收到了消息：Hello from Component 2
Component 3 收到了消息：Hello from Component 2
Component 3 发送了消息：Hello from Component 3
Component 1 收到了消息：Hello from Component 3
Component 2 收到了消息：Hello from Component 3
```

可以看到，在中介者模式的帮助下，组件之间的通信变得简单和灵活，组件之间的耦合度也得到了降低。

## 装饰者模式

装饰者模式:

## 状态模式

状态模式:

## 适配器模式

适配器模式:
