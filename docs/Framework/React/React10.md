---
title: React之MobX
icon: react
date: 2025-02-06
category:
  - 框架
tag:
  - React
sticky: false
---

简单入门一下 Mobx~

MobX 是一个用于 JavaScript 应用程序的状态管理库，它通过响应式编程原则简化和扩展了状态管理。它在 React 应用程序中特别受欢迎，但也可以与任何 JavaScript 框架或库一起使用。

![Mobx](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202502062052064.png)

## 简单介绍

MobX 的主要特点

1. 响应式编程：MobX 使用响应式编程自动跟踪和更新依赖于状态的应用程序部分。当状态发生变化时，只有依赖于该状态的组件会重新渲染，从而优化性能。
2. 可观察状态：任何 JavaScript 对象、数组或原始值都可以在 MobX 中变成可观察的。当可观察状态发生变化时，MobX 会自动更新依赖于它的组件。
3. 动作（Actions）：动作是修改状态的方法。通过使用动作，可以以结构化的方式跟踪状态修改。
4. 计算值（Computed Values）：这些值是从可观察状态派生出来的，并且会在可观察状态发生变化时自动重新计算。
5. 反应（Reactions）：反应是基于可观察值变化而运行的副作用。它们适用于根据状态变化触发动作。

MobX 如何与 React 一起工作

MobX 通过 `observer` 高阶组件与 React 无缝集成，允许 React 组件在可观察状态发生变化时自动重新渲染。以下是使用 MobX 与 React 的简单示例：

1. 安装 MobX 和 mobx-react：

   ```bash
   npm install mobx mobx-react
   ```

2. 创建可观察的 Store：

   ```js
   import { makeAutoObservable } from 'mobx'

   class CounterStore {
     count = 0

     constructor() {
       makeAutoObservable(this)
     }

     increment() {
       this.count++
     }

     decrement() {
       this.count--
     }
   }

   export const counterStore = new CounterStore()
   ```

   将 React 组件变为观察者：

   ```js
   import React from 'react'
   import { observer } from 'mobx-react'
   import { counterStore } from './CounterStore'

   const Counter = observer(() => {
     return (
       <div>
         <p>计数: {counterStore.count}</p>
         <button onClick={() => counterStore.increment()}>增加</button>
         <button onClick={() => counterStore.decrement()}>减少</button>
       </div>
     )
   })

   export default Counter
   ```

使用 MobX 的优势

1. 简单性：MobX 减少了样板代码，简化了状态管理。
2. 自动重新渲染：依赖于状态的组件会自动重新渲染。
3. 细粒度的可观察性：只有必要的组件会在状态变化时重新渲染，提高性能。
4. 声明式状态管理：状态以声明式的方式管理，使代码更易读和维护。

## 兼容性

MobX 兼容性可见[英文官网](https://mobx.js.org/migrating-from-4-or-5.html)，[中文文档](https://cn.mobx.js.org/)较为落后。

1. MobX >= 5.0 可运行在任何支持 ES6+ 的环境中，因为 observable 使用 Proxy 进行数据劫持和代理，所以不再支持 IE。
2. MobX 4.x 版本支持较旧的环境，包括 IE11 和较旧的浏览器。但是，MobX 4.x 版本不再维护，建议使用 MobX 5.x 版本。
3. MobX 6 「最新版本」移除了装饰器的操作（因为装饰器不是 JS 标准规范）。

## 常用 api

1. `autorun`: 如果你有一个函数应该自动运行，但不会产生一个新的值，请使用`autorun`。 其余情况都应该使用 `computed`。函数特点: 首次会立即执行一次, 自动建立起依赖监测「监测用到的转态」；当依赖的状态值发生改变，`callback` 会重新执行一次。不足之处, 修改多个状态,会让 autorun 监听器执行多次，应当用 action 进行批量更新。

   ```js
   import { observable, autorun } from 'mobx'
   var numbers = observable([1, 2, 3]) // 把状态变为可监测
   var sum = computed(() => numbers.reduce((a, b) => a + b, 0))

   var disposer = autorun(() => console.log(sum.get()))
   // 输出 '6'

   numbers.push(4)
   // 输出 '10'

   disposer()
   numbers.push(5)
   // 不会再输出任何值。`sum` 不会再重新计算。
   ```

2. `computed`: 如果你想创建一个基于当前状态的计算值，请使用 `computed`。计算值会缓存其结果，直到其依赖的可观察状态发生变化。

   ```js
   import { observable, computed } from 'mobx'

   var person = observable({
     name: 'John',
     age: 20,
   })

   var personAge = computed(() => person.age)

   console.log(personAge.get()) // 输出 '20'

   person.age = 21
   console.log(personAge.get()) // 输出 '21'
   ```

3. `reaction`: `reaction` 是 `autorun` 的一个变种，它接受两个参数：一个计算值和一个回调函数。**回调函数会在计算值发生变化时执行**。此外, reaction 的回调函数第一次也不会执行, 只有待到依赖的状态发生变化时才会执行。

   ```js
   import { observable, reaction } from 'mobx'

   var person = observable({
     name: 'John',
     age: 20,
   })

   reaction(
     () => person.age, // 自己设置需要监测的值, 多个值则用数组包裹
     (age) => console.log('Age changed to ' + age)
   )

   person.age = 21 // 输出 'Age changed to 21'
   ```

4. `action`：修改函数的装饰器，它会让函数中的状态更改变为「异步批处理」。实际项目中应当都用该方法。

   ```js
   import { observable, action } from 'mobx'

   var person = observable({
     name: 'John',
     age: 20,
   })

   action('updateName', function (newName) {
     this.name = newName
   })(person, 'Mike')

   console.log(person.name) // 输出 'Mike'
   ```

   装饰器写法：

   ```js
   import { observable, action } from 'mobx'

   class Person {
     @observable name = 'John'
     @observable age = 20

     @action.bound updateName(newName) {
       // bound 作用: 绑定 this, 是的函数无论如何执行, 函数中的 this 都是指向当前实例
       this.name = newName
     }
   }

   var person = new Person()

   person.updateName('Mike')

   console.log(person.name) // 输出 'Mike'
   ```

5. `configure`: `configure` 函数用于配置 MobX 的全局行为。例如，你可以使用它来启用或禁用严格模式。

   ```js
   import { configure } from 'mobx'

   configure({ enforceActions: 'observed' }) // 启用严格模式
   // 配置后, 只有 action 才能修改状态, 否则会报错
   ```

6. `runInAction`: `runInAction` 函数用于在单个事务中执行多个状态更新。它接受一个函数作为参数，并在函数执行期间将所有状态更新合并为一个事务。简单理解就是，`runInAction` 可以实现出和 `@action` 一样的效果。

   ```js
   import { observable, runInAction } from 'mobx'

   var person = observable({
     name: 'John',
     age: 20,
   })

   runInAction(() => {
     person.name = 'Mike'
     person.age = 21
   })

   console.log(person.name) // 输出 'Mike'
   console.log(person.age) // 输出 '21'
   ```

7. Mobx6 中的 `makeObservable`: 由于 V6 版本去除了装饰器，所以需要用 `makeObservable` 来代替装饰器。

   ```js
   import { observable, action, makeObservable } from 'mobx'

   class Store {
     constructor() {
       makeObservable(this, {
         x: observable,
         fetchData: action.bound,
       }) // 代替装饰器
     }

     // @observable
     x = 10
     // @action.bound async
     fetchData() {
       let res = 0
       try {
         const data = await query()
         res = data
       } catch (_) {}

       runInAction(() => {
         this.x = res
       })
     }
   }
   ```

8. MobX6 中的 `makeAutoObservable`: MobX6 中新增了 `makeAutoObservable`，可以自动将所有属性和方法转换为可观察的，并自动绑定 `this`。实际就是 `makeObservable` 的加强，可以自己给状态和方法设置装饰，7 中的示例等同于 `makeAutoObservable(this)`

## 异步处理

MobX 异步更新非常简单，直接在 action 中变为同步处理即可。

```js
import { observable, action, runInAction, configure } from 'mobx'

configure({ enforceActions: 'observed' }) // 启用严格模式

const query = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1)
    }, 1000)
  })
}

class Store {
  @observable x = 10

  @action.bound async fetchData() {
    let res = 0
    try {
      const data = await query()
      res = data
    } catch (_) {}

    // this.x = res // 这个在组件中使用会报错
    // 需要在异步结束后, 基于 runInAction 去修改状态
    runInAction(() => {
      this.x = res
    })
  }
}
```

上面报错的原因在于:

1. `await` 之后的代码`（this.x = res）`会被放到微任务队列
2. 当微任务执行时，原 `@action` 的同步上下文已经结束
3. 因此 `this.x = res` 实际上是在 `action` 之外修改状态，违反了严格模式规则。所以改用 `runInAction` 在当前时刻创建一个临时 `action` 上下文，确保 `observable` 的修改符合 MobX 规则。

## MobX 和 React 实战

```jsx
// index.js 定义 store
import { observable, action, runInAction } from 'mobx'
import { observer } from 'mobx-react'

class Store {
  @observable x = 10

  @action.bound async fetchData() {
    let res = 0
    try {
      const data = await query()
      res = data
    } catch (_) {}

    runInAction(() => {
      this.x = res
    })
  }
}

const store = new Store()

// App.js 使用 store
import React from 'react'
import ReactDOM from 'react-dom'
import { ConfigProvider } from 'antd'
import { Provider } from 'mobx-react'
import store from './store' // store 定义在 index.js 中

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <ConfigProvider store={store}>
    {/* 基于 Provider 把各个板块 Store 的实例, 都放在上下文中 */}
    <Provider {...store} />
  </ConfigProvider>
)
```
