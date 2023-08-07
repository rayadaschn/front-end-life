---
title: 设计模式 03 实践总结
icon: javascript
date: 2023-08-01
category:
  - javascript
tag:
  - javascript

sticky: false
---

在前面总结了设计模式的常用方法，在该篇中总结设计模式在实践运用中的一些原则。

## 单一职责原则

单一职责原则（Single Responsibility Principle，SRP）是面向对象设计原则之一，它指导在设计类或模块时，一个类或模块应该只有一个职责。

单一职责原则认为一个类或模块应该只有一个引起它变化的原因。换句话说，一个类或模块应该只有一个主要的责任或任务。如果一个类或模块承担了多个职责，那么当其中一个职责发生变化时，可能会影响到其他职责的实现。这样的设计通常会导致代码的耦合性增加，难以理解、扩展和维护。

通过将不同职责的代码分离到不同的类或模块中，可以使系统更加灵活、可扩展和可维护。每个类或模块都应该专注于完成一个独立的任务，这样可以降低代码之间的依赖性，提高代码的可读性和可维护性。

一个例子：假设我们有一个名为`UserService`的类，负责处理用户相关的操作，包括用户的创建和验证。

```js
class UserService {
  createUser(username, password) {
    // 创建用户的逻辑
  }

  validateUser(username, password) {
    // 验证用户的逻辑
  }

  sendEmailVerification(username) {
    // 发送电子邮件验证的逻辑
  }

  generateUsername() {
    // 生成用户名的逻辑
  }

  // 其他与用户相关的方法...
}
```

在上述例子中，`UserService`类承担了多个职责，包括创建用户、验证用户、发送电子邮件验证和生成用户名。这违反了单一职责原则。

为了遵循单一职责原则，我们可以将不同的职责分离成独立的类。例如，我们可以创建一个`UserCreationService`类来处理用户的创建，一个`UserValidationService`类来处理用户的验证，以及一个`EmailService`类来处理发送电子邮件的功能。

```js
class UserCreationService {
  createUser(username, password) {
    // 创建用户的逻辑
  }

  generateUsername() {
    // 生成用户名的逻辑
  }

  // 其他与用户创建相关的方法...
}

class UserValidationService {
  validateUser(username, password) {
    // 验证用户的逻辑
  }

  // 其他与用户验证相关的方法...
}

class EmailService {
  sendEmailVerification(username) {
    // 发送电子邮件验证的逻辑
  }

  // 其他与电子邮件发送相关的方法...
}
```

通过将不同的职责分离到不同的类中，我们可以提高代码的可维护性和可扩展性。每个类都专注于完成一个独立的任务，并且更容易理解和修改。

## 最少知识原则

最少知识原则（Least Knowledge Principle），也被称为迪米特法则（Law of Demeter），是面向对象设计原则之一。它强调一个对象应该尽量减少与其他对象之间的交互，只与最直接的朋友通信，避免了对象之间的紧耦合关系。

最少知识原则的核心思想是一个对象应该只与以下几种对象发生交互：

1. 与该对象本身直接关联的对象。
2. 该对象所创建或实例化的对象。
3. 该对象的组件对象。

换句话说，一个对象不应该直接访问其他对象的内部状态和方法，而应该通过委托和封装来实现间接访问。这样可以降低对象之间的依赖性，减少耦合，提高代码的可维护性和扩展性。

以下是一个使用 JavaScript 的例子，演示最少知识原则的应用：

```javascript
class Customer {
  constructor(name, address) {
    this.name = name
    this.address = address
  }

  getName() {
    return this.name
  }

  // 其他与顾客相关的方法...
}

class Order {
  constructor(customer) {
    this.customer = customer
    this.items = []
  }

  addItem(item) {
    this.items.push(item)
  }

  getTotal() {
    // 计算订单总金额的逻辑
  }

  printInvoice() {
    const customerName = this.customer.getName()
    const total = this.getTotal()

    // 打印发票的逻辑
  }

  // 其他与订单相关的方法...
}

class Item {
  constructor(name, price) {
    this.name = name
    this.price = price
  }

  getName() {
    return this.name
  }

  getPrice() {
    return this.price
  }

  // 其他与商品相关的方法...
}
```

在上述示例中，`Order`类代表一个订单，它包含了顾客信息和订单项。`Customer`类代表顾客，`Item`类代表商品。

根据最少知识原则，`Order`类只与以下几种对象发生直接交互：

1. `Customer`类：通过调用`this.customer.getName()`来获取顾客的名称。
2. `Item`类：通过添加订单项时调用`this.items.push(item)`来操作订单项。

`Order`类没有直接访问`Customer`和`Item`类的内部状态和方法，而是通过委托的方式来获取所需的信息。这样可以避免`Order`类与其他对象之间的紧耦合关系，提高代码的灵活性和可维护性。

## 开放封闭原则

开放封闭原则（Open-Closed Principle，OCP）是面向对象设计原则之一，它指导我们在设计软件实体时，应该对扩展开放，对修改封闭。

开放封闭原则的核心思想是通过抽象和多态性来实现接口的可扩展性，而不是直接修改现有的代码。当需求发生变化时，我们应该通过添加新的代码来扩展系统的功能，而不是修改已有的代码。这样能够确保现有的代码稳定性，减少对系统的影响，并提高代码的可维护性和可扩展性。

以下是一个使用 JavaScript 的例子，演示开放封闭原则的应用：

```js
class Shape {
  draw() {
    // 绘制形状的逻辑
  }
}

class Circle extends Shape {
  draw() {
    // 绘制圆形的逻辑
  }
}

class Rectangle extends Shape {
  draw() {
    // 绘制矩形的逻辑
  }
}

class Triangle extends Shape {
  draw() {
    // 绘制三角形的逻辑
  }
}

// 绘制形状的函数
function drawShape(shape) {
  shape.draw()
}
```

在上述例子中，`Shape`类是一个抽象基类，定义了一个`draw`方法用于绘制形状。`Circle`、`Rectangle`和`Triangle`类继承自`Shape`类，并实现了各自特定形状的绘制逻辑。

通过这种设计，当我们需要绘制新的形状时，只需要创建一个新的类继承自`Shape`，并实现自己的绘制逻辑，而不需要修改现有的代码。例如，如果我们要添加一个`Square`类来绘制正方形，只需要创建一个`Square`类，并实现`draw`方法即可，而不需要修改`drawShape`函数或其他已有的类。

```js
class Square extends Shape {
  draw() {
    // 绘制正方形的逻辑
  }
}

const square = new Square()
drawShape(square)
```

通过遵循开放封闭原则，我们能够通过扩展来实现新的功能，而不会影响已有的代码。这种设计方式使系统更加稳定，易于扩展和维护。

## 代码重构的几个要点

1. 提炼函数

   - 避免出现超大函数。
   - 独立出来的函数有助于代码复用。
   - 独立出来的函数更容易被覆写。
   - 独立出来的函数如果拥有一个良好的命名，它本身就起到了注释的作用。

2. 合并重复的条件片段
3. 把条件分支语句提炼成函数
4. 合理使用循环，将相同代码提炼出来只循环变量以减少代码
5. 提前让函数退出代替嵌套条件分支
6. 传递**对象参数**代替过长的参数列表
7. 尽量减少参数数量
8. 少用三目运算符
9. 合理使用链式调用
10. 分解大型类
11. 用`return`退出多重循环

## 参考文献

- 《JavaScript 设计模式与开发实践》
