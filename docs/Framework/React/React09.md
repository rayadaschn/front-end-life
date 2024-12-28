---
title: React之技术细节
icon: react
date: 2024-12-08
category:
  - 框架
tag:
  - React
sticky: false
---

这里用于梳理 React 的一些技术实现细节，以作技术回顾。

## setState 的更新逻辑

setState 的更新逻辑有时是同步的有时是异步的，这取决于调用 setState 的环境。实际上，在 React 控制之内的事件处理过程中，setState 是异步的，而在 React 控制之外的事件处理过程中，setState 是同步的。

```js
onClick() {
  this.setState({ count: this.state.count + 1 });
}

componentDidMount() {
  document.querrySelector('#btn').addEventListener('click', this.onClick);
}

render() {
  return (
    <React.Fragment>
      <button id="btn" onClick={this.onClick}>Click out React</button>

      <button onClick={this.onClick}>Click in React</button>
    </React.Fragment>
  )
}
```

在上述代码中，当点击第一个按钮时，`onClick` 方法是在 React 控制之外的事件处理过程中调用的，因此 setState 是同步的。当点击第二个按钮时，`onClick` 方法是在 React 控制之内的事件处理过程中调用的，因此 setState 是异步的。

这样的设计并不难理解，通过延迟更新，可以获得更好的性能。

## setState 的 Promise 化

由于 setState 是异步的，因此我们无法直接通过 `then` 方法来获取更新后的状态。为了解决这个问题，我们可以使用 `Promise` 来封装 setState，从而实现 setState 的 Promise 化。

```js
function setStateAsync(me, state) {
  return new Promise((resolve) => {
    me.setState(state, () => {
      resolve()
    })
  })
}
```

## 什么时候用 Redux?

可以从数据持久度、数据消费范围来考虑。

1. 快速变更型：这类数据在应用中代表了某些原子级别的信息，且显著特点是变更评率最快。如比，一个文本输入框中的数据值可能随着用户输入在短时间内持续发生变化。这类数据更适合在 React **组件内维护**。
2. 中等持续性：在用户浏览货使用应用时，这类数据往往会在页面刷新前保持稳定。比如，从异步请求接口通过 AJAX 方式得来的数据，或者用户在个人中心页编辑提交的数据。这类数据比较通用，也行会被不同组件所使用。适合在 **Redux** 中维护，并通过 `connect` 方法和组件进行连接。
3. 长远型稳定型：指在页面多次刷新或多次访问期间保持不变的数据。因为 Redux 会在每次页面挂在后都重新生成一份新的数据，因此这种类型的数据显然应该存储在 Redux 以外的地方，比如**服务端数据库或浏览器的本地存储**。