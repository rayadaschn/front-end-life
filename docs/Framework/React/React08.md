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
