---
title: 手写 Pinia
icon: vue
date: 2024-02-29
category:
  - 框架
tag:
  - Vue
sticky: false
---

在 Vuex 中是基于 Flux 架构进行设计的，它的核心思想是单向数据流，即数据只能从 Store 向外传递到组件，组件不能直接修改 Store 中的数据，只能通过提交 Mutations 来修改。

即: view --> dispatch --> action --> mutation --> state --> view

并且 Vuex 使用一个全局的 Store 来存储应用的状态，所有组件都共享这个 Store。由此会产生较多的 modules。

而 pinia 则是将整个 store 体系进行 "拍平"。Pinia 不是使用一个全局的 Store，而是允许创建多个 Store，每个 Store 都可以独立管理自己的状态。

## 前置基础知识

Vue3 中有俩个不常用的 API : `effect` 和 `effectScope`, 它们是用来处理副作用的函数。有点类似于 React 中的 `useEffect`。

### effect 函数

effect 函数是 Vue 3 提供的一个用来创建响应式副作用的函数。它接收一个函数作为参数，这个函数就是副作用函数。当副作用函数内部的响应式数据发生改变时，effect 函数会自动执行副作用函数。

```js
import { effect } from 'vue'

const state = reactive({ count: 0 })

const stop = effect(() => {
  console.log(state.count)
})

// 更新 count 的值，会触发副作用函数执行
state.count++
```

在上面的代码中，我们创建了一个响应式对象 `state`，并且调用了 `effect` 函数来创建一个副作用函数。当 `state.count` 发生改变时，effect 函数内部的 `console.log` 语句会被执行。

### effectScope 函数

[Vue3 官网](https://cn.vuejs.org/api/reactivity-advanced.html#effectscope)

`effectScope` 会创建一个 effect 作用域，可以捕获其中所创建的响应式副作用 (即计算属性和侦听器)，这样捕获到的副作用可以一起处理。

```ts
function effectScope(detached?: boolean): EffectScope

interface EffectScope {
  run<T>(fn: () => T): T | undefined // 如果作用域不活跃就为 undefined
  stop(): void
}
```

示例:

```ts
const scope = effectScope()

scope.run(() => {
  const doubled = computed(() => counter.value * 2)

  watch(doubled, () => console.log(doubled.value))

  watchEffect(() => console.log('Count: ', doubled.value))
})

// 处理掉当前作用域内的所有 effect
scope.stop()
```
