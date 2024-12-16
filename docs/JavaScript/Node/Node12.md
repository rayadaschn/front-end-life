---
title: Koa 异步调用中间件的本质
icon: nodeJS
date: 2024-12-17
category:
  - javascript
tag:
  - node
---

Koa 是通过将中间件组织成一个“洋葱模型”（Onion Model），并使用 **`async/await`** 或 **`Promise`** 链式执行机制实现异步中间件的。

### **核心机制**

1. **中间件存储：**

   - 中间件被存储为一个数组（`middlewares`）。
   - 每个中间件是一个函数，接受 `ctx`（上下文）和 `next`（下一个中间件的执行函数）作为参数。

2. **组合中间件（compose）：**

   - Koa 使用一个函数（类似于 `compose`）将多个中间件组合成一个函数，并按顺序执行。
   - 每个中间件调用 `await next()` 来手动控制下一个中间件的执行时机。

3. **递归调用：**
   - 当一个中间件调用 `await next()` 时，它会等待下一个中间件执行完成后再继续执行当前中间件后面的逻辑。

### **简化实现：`compose` 函数**

```js
function compose(middlewares) {
  return function (ctx, next) {
    let index = -1 // 记录当前中间件的执行索引

    // 定义一个调度函数
    function dispatch(i) {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'))
      }
      index = i
      const fn = middlewares[i] || next // 获取当前中间件或默认的 next
      if (!fn) return Promise.resolve() // 如果没有更多中间件，直接 resolve

      try {
        // 执行中间件并递归调用下一个
        return Promise.resolve(fn(ctx, () => dispatch(i + 1)))
      } catch (err) {
        return Promise.reject(err) // 捕获同步异常
      }
    }

    // 从第一个中间件开始
    return dispatch(0)
  }
}
```

### **Koa 的执行流程**

假设我们有以下中间件：

```js
const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
  console.log('Middleware 1: Before next')
  await next()
  console.log('Middleware 1: After next')
})

app.use(async (ctx, next) => {
  console.log('Middleware 2: Before next')
  await next()
  console.log('Middleware 2: After next')
})

app.use(async (ctx) => {
  console.log('Middleware 3: Final')
})

app.listen(3000)
```

#### **执行顺序：**

1. 中间件按顺序执行：
   - `Middleware 1: Before next`
   - `Middleware 2: Before next`
   - `Middleware 3: Final`
2. 中间件回溯执行：
   - `Middleware 2: After next`
   - `Middleware 1: After next`

#### **输出：**

```plaintext
Middleware 1: Before next
Middleware 2: Before next
Middleware 3: Final
Middleware 2: After next
Middleware 1: After next
```

#### **流程图：**

```txt
  Middleware 1 -> Middleware 2 -> Middleware 3
    ↑              ↑
    └──────────────┘
```

### **总结**

1. **核心在于 `compose` 函数：** 它通过递归调用 `dispatch(i)` 来实现洋葱模型的中间件机制。
2. **异步机制：** 通过 `async/await` 或 `Promise` 确保中间件可以异步执行，同时保持调用顺序。
3. **中间件调用链：** 每个中间件通过 `await next()` 显式控制下一个中间件的执行，并且可以在后续逻辑中回溯执行。

这种机制保证了中间件能够以一致的方式处理异步任务，是 Koa 高度模块化和灵活的基础。
