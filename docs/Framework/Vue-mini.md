---
title: 手写 Vue3
icon: vue
date: 2023-11-20
category:
  - 框架
tag:
  - Vue
star: true
sticky: false
---

> 尤雨溪：框架的设计过程其实是一个不断取舍的过程。

## 理解命令式和声明式

"命令式"（Imperative）和"声明式"（Declarative）是两种编程范式，用来描述编程语言或编程风格的不同方式。

1. **命令式（Imperative）**：

   - **关注步骤和过程：** 命令式编程关注如何完成一个任务，通过指定每个步骤来达到目标。
   - **具体的控制流：** 开发者需要详细说明程序的控制流程，包括循环、条件语句等。
   - **修改状态：** 程序通过改变状态来实现目标，通常使用变量来存储和修改状态。
   - **示例：** 常见的命令式编程语言包括 C、C++、Java。例如，下面是一个简单的命令式编程的示例，计算阶乘的函数：

   ```js
   // 计算阶乘的命令式函数

     function factorial(n) {
     let result = 1;
     for (let i = 1; i <= n; ++i) {
     result \*= i;
     }
     return result;
     }

     console.log(factorial(5)); // 输出: 120
   ```

2. **声明式（Declarative）**：

   - **关注结果而非步骤：** 声明式编程关注定义要达到的目标，而不是详细说明如何实现这个目标。
   - **抽象控制流：** 具体的控制流程由编程语言或框架隐式处理，而不需要开发者明确指定。
   - **不修改状态：** 避免直接修改状态，而是通过声明式的方式描述所需的状态。
   - **示例：** 常见的声明式编程语言包括 SQL、HTML、React 中的 JSX。以下是一个声明式的 React 组件示例：

     ```jsx
     function Greeting({ name }) {
       return <p>Hello, {name}!</p>
     }
     ```

总的来说，声明式代码更利于阅读，也更利于维护，但是性能弱于命令式（步骤更多）。

## 区分运行时和编译时

Vue 是一个运行时 ➕ 编译时的框架。

通过 compiler 解析 html 模版，生成 render 函数，再通过 runtime 解析 render，从而挂载真实 DOM。

## 理解 Proxy 和 Reflect

`Proxy` 和 `Reflect` 是 JavaScript 中的两个关键对象，它们分别用于操作和拦截对象的操作。

### Proxy（代理）

`Proxy` 对象用于创建一个对象的代理，可以拦截并重定义该对象上的基本操作。它的基本语法如下：

```javascript
let proxy = new Proxy(target, handler)
```

- `target`: 要代理的目标对象。
- `handler`: 一个对象，其属性是用于定制代理行为的函数。

代理对象将所有操作转发到目标对象，并且你可以在 `handler` 中定义附加的行为。例如，可以在代理对象上设置 `get` 方法来拦截对目标对象属性的访问：

```js
let target = { name: 'John' }

let handler = {
  get: function (target, prop, receiver) {
    console.log(`Getting property "${prop}"`)
    return target[prop]
  },
}

let proxy = new Proxy(target, handler)

console.log(proxy.name) // 输出: Getting property "name"，然后输出 "John"
```

在上面的例子中，当访问 `proxy.name` 时，`get` 方法被触发，输出相应的信息并返回目标对象的属性值。

### Reflect（反射）

`Reflect` 对象提供了一组用于访问对象的方法，这些方法与操作符对应。`Reflect` 方法和对应的操作符有着一一对应的关系，例如 `Reflect.get()` 对应于 `obj[prop]`。

`Reflect` 的目的是为了替代一些以前可能直接在对象上执行的操作，使其更加规范和易于理解。例如，`Reflect.get()` 等价于 `obj[prop]`，但是它是一个函数，可以更容易地在函数式编程中使用。在 Vue 中则是配合 Proxy 改变 this 指向，下文 👇🏻 会介绍到。

```js
let target = { name: 'John' }

// 使用 Reflect.get() 获取属性值
console.log(Reflect.get(target, 'name')) // 输出: John
```

`Reflect` 还有其他一些方法，例如 `Reflect.set()`，`Reflect.has()`，等等，它们分别对应了对象属性的设置、检查属性是否存在等操作。

总体而言，`Proxy` 和 `Reflect` 结合使用可以提供更灵活和强大的对象操作机制。`Proxy` 用于拦截和定制对象的行为，而 `Reflect` 提供了一组规范的方法来执行常见的对象操作。

### 为什么它们可以组合使用?

当我们期望监听代理对象的 getter 和 setter 方法时，不应该使用 `target[key]`，因为它在某些时候是不可靠的，而应该借助 Reflect 的 get 和 set 方法，使用 receiver（proxy 实例）作为 this，以达到期望的结果。

如：

```js
const obj = {
  firstName: 'Huy',
  lastName: 'John',
  get fullName() {
    return this.lastName + this.firstName
  },
}

const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    console.log('触发 getter 方法')
    return target[key]
  },
})

console.log(proxy.fullName) // JohnHuy
```

在上面例子中，proxy 的 get 方法实际触发了 1 次。这其实“有点反常识”的。来看一下，每当 proxy 获取它的属性时，就会调用这个 get 方法。

按照预想：

1. 获取 fullName 时，调用一次 proxy 的 get；
2. 在 fullName 中又使用 this 去调用 obj 的方法时还应当再调用 proxy 的 get 方法。

原因在于 fullName 中的 this 指向 obj 对象本身，而不是 proxy。因此需要用到 Reflect 反射来改变其中的 this 指向。

因此利用 Proxy 和 Reflect 共有的第三个属性 receiver 进行改造：

```js
const obj = {
  firstName: 'Huy',
  lastName: 'John',
  get fullName() {
    return this.lastName + this.firstName
  },
}

const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    console.log('触发 getter 方法') // 成功打印 3 次
    // return target[key]
    return Reflect.get(target, key, receiver) // 利用 Reflect 改变 this 指向
  },
})

console.log(proxy.fullName) // JohnHuy
```
