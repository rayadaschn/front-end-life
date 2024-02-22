---
title: React之手写 Hooks
icon: react
date: 2024-02-20
category:
  - 框架
tag:
  - React
sticky: false
---

Hooks 的好处很多，为了加强对 Hooks 的理解，手动实现一遍 React 的一些 Hooks 方法，便是再好不过的了。

本文中，我们统一规定 初始 `App.jsx` 如下：

```jsx
import { root, useState, ...otherHooks } from "./React";

function App() {
  // useHook 的使用
  return ( <div>....具体代码</div> );
}

root.render(<App />);

export default App;
```

其中 `React.jsx` 是我们要实现 Hooks 的方法，基本如下：

```jsx
//  ReactDOM 来源于:   <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js"></script>

const { createRoot } = ReactDOM

// 导出 root 根节点
export const root = createRoot(document.getElementById('app'))

// 定义手动渲染函数
async function render() {
  // 获取 React 节点
  const App = (await import('./App')).default
  root.render(<App />)
}
```

## 手写 useState

`useState` 是 React 中的一个 Hook，用于在函数组件中管理状态。它是 React 16.8 中引入的新特性之一，可以让你在函数组件中使用状态。在使用 `useState` 之前，函数组件是无状态的，即它们不能保存任何状态。但是使用 `useState` 之后，可以在函数组件中保存和更新状态。

`useState` 函数接受一个参数，即状态的初始值，然后返回一个数组，其中包含两个值：当前状态和一个更新状态的函数。可以使用这两个值来读取和更新状态。

简单示例：

```jsx
import React, { useState } from 'react'

function Counter() {
  // 使用 useState 定义一个状态
  const [count, setCount] = useState(0)

  // 使用 count 和 setCount 来读取和更新状态
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```

在上面的例子中，我们使用 `useState` 定义了一个状态 `count`，并且初始化为 0。然后我们在 `button` 元素的 `onClick` 事件中使用 `setCount` 函数来更新状态。每次点击按钮，`count` 的值就会加一。

### 具体实现

```jsx
const { createRoot } = ReactDOM

export const root = createRoot(document.getElementById('app'))

const states = []
const stateSetters = []
let stateIndex = 0

function createState(initialState, stateIndex) {
  return states[stateIndex] ? states[stateIndex] : initialState
}

function createStateSetter(stateIndex) {
  return (newState) => {
    // 区分函数和纯数值情况
    if (typeof newState === 'function') {
      states[stateIndex] = newState(states[stateIndex])
    } else {
      states[stateIndex] = newState
    }

    render() // 重新渲染视图
  }
}

export function useState(initialState) {
  states[stateIndex] = createState(initialState, stateIndex)

  if (!stateSetters[stateIndex]) {
    stateSetters.push(createStateSetter(stateIndex))
  }

  const _state = states[stateIndex]
  const _setSetter = stateSetters[stateIndex]

  stateIndex++

  return [_state, _setSetter]
}

async function render() {
  stateIndex = 0 // 重新渲染后, index 重置, 合理利用闭包
  const App = (await import('./App')).default
  root.render(<App />)
}
```

## 手写 useReducer

useReducer 的作用是在函数组件中使用 Reducer 模式来管理 state。实现逻辑是派发器思想，即该 hook 返回的第二个参数，即一个函数，该函数用于向 Reducer 发送 action。Reducer 是一个纯函数，它接收当前的 state 和 action，根据 action 的类型返回新的 state。

> 派发器思想的核心在于，你可以在你的组件中定义一个函数，然后通过派发器将这个函数传递给 Reducer，Reducer 在处理 action 时会调用这个函数，这样就可以在组件中触发一些副作用。
>
> 这个函数通常被称为 action creator，它返回一个 action 对象，这个对象至少包含一个 type 字段用于描述 action 的类型。

具体使用可以参考 [《React 之 Hooks》](./React06)，下面来实现一下这个 Hooks 方法。

由于上文实现了 useState，所以 useReducer 很容易就能实现。

```jsx
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState)

  const dispatch = (action) => {
    const newState = reducer(state, action)
    setState(newState)
  }

  return [state, dispatch]
}
```

代码非常简单，实际上就是复现派发器的逻辑，返回一个定义值（或对象）和一个函数，用于处理定义量变更逻辑。

```jsx
const effectDepArr = []
const clearCallbacks = []
let effectIndex = 0

export function useEffect(callback, deps) {
  if (typeof callback !== 'function') {
    throw new TypeError('callback must be a function')
  }

  if (deps !== undefined && !Array.isArray(deps)) {
    throw new TypeError('Dependence must be an array')
  }

  const curIndex = effectIndex++
  const lastDeps = effectDepArr[curIndex]
  const isChanged =
    !lastDeps || // 首次渲染
    !deps || // 是否有依赖
    deps.some((dep, i) => dep !== lastDeps[i]) // 综合比较, 依赖是否改变

  if (isChanged) {
    effectDepArr[curIndex] = deps

    // 只实现改变渲染时, 清除副作用函数, 未实现组件卸载时,清除副作用回调
    const clearCallback = clearCallbacks[curIndex]

    if (clearCallback) clearCallback()
    clearCallbacks[curIndex] = callback() // 存储清除副作用函数, 并同时执行回调函数
  }
}

// 更新渲染函数
async function render() {
  stateIndex = 0 // 重新渲染后, index 重置, 合理利用闭包
  effectIndex = 0 // 重新渲染后, 也要重新副作用函数的 index
  const App = (await import('./App')).default
  root.render(<App />)
}
```

## 手写 memo 函数

memo 函数不是 Hook，但是是为了后面 useMemo 做铺垫，因此也实现一下。

memo 函数的作用和 Vue 中 computed 计算属性一样，目的在于优化性能。

首先定义一个 PureComponent 纯函数组件：

```jsx
const { Component } = React

export default class PureComponent extends Component {
  // 重新定义是否需要重新渲染的钩子函数
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    )
  }
}

/** 浅比较 */
function shallowEqual(o1, o2) {
  // 组件不能调用 render 函数
  if (o1 === o2) return true

  if (
    typeof o1 !== 'object' ||
    o1 === null ||
    typeof o2 !== 'object' ||
    o2 === null
  ) {
    return false
  }

  const k1 = Object.keys(o1)
  const k2 = Object.keys(o2)

  if (k1.length !== k2.length) return false

  // 检测键
  for (const k of k1) {
    if (!o2.hasOwnProperty(k) || o1[k] !== o2[k]) {
      return false
    }
  }

  return true
}
```

最后实现:

```jsx
export function memo(FC) {
  // 匿名类的定义，它继承自 PureComponent，并覆盖了 render 方法。
  return class extends PureComponent {
    render() {
      // 调用原始的函数组件 FC，并将 props 传递给它
      return FC(this.props)
    }
  }
}
```
