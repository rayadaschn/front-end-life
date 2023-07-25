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

职责链模式:

## 中介模式

中介模式:

## 装饰者模式

装饰者模式:

## 状态模式

状态模式:

## 适配器模式

适配器模式:
