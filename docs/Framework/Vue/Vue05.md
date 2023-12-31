---
title: Vue 中 History 路由和 Hash 路由的实现基本原理
icon: vue
date: 2023-12-31
category:
  - 框架
tag:
  - Vue
sticky: false
---

在 Vue 中，路由系统通过 Vue Router 来管理。Vue Router 支持两种模式：history 模式和 hash 模式，它们分别使用 HTML5 History API 和 URL 的哈希部分来实现路由。

### History 模式

在 history 模式下，Vue Router 使用 HTML5 History API 来实现路由。它基于浏览器的 `pushState` 和 `replaceState` 等 `window.history` 的方法，如这两个方法允许我们在浏览器的会话历史中添加和修改记录。

1. **实现原理：**

   - 当用户点击链接或触发导航时，Vue Router 使用 `pushState` 或 `replaceState` 向浏览器的历史堆栈中添加或修改记录。
   - 同时，Vue Router 还会监听 `popstate` 事件，以便在用户点击浏览器前进或后退按钮时进行相应的导航。
   - 在服务器端，需要配置使得所有路径都返回同一个 HTML 文件，因为 history 模式下直接访问某个 URL 会导致 404 错误。

2. **示例：**
   - 用户访问`/user/123`，浏览器不会发送请求到服务器，但是 Vue Router 会捕获该路径，通过 History API 添加记录，然后加载相应的组件。

:::tip

`router.push`、`router.replace` 和 `router.go` 是 `window.history.pushState`、`window.history.replaceState` 和 `window.history.go` 的改造，它们模仿了 `window.history` 的 API。

:::

### Hash 模式

在 hash 模式下，Vue Router 使用 URL 的哈希部分（#）来实现路由。哈希部分的变化不会导致浏览器向服务器发送请求，因此可以在前端实现页面切换，而无需配置服务器。

1. **实现原理：**

   - 当用户点击链接或触发导航时，Vue Router 会改变 URL 的哈希部分，例如，从`/user/123`变为`#/user/123`。
   - 浏览器会触发 `hashchange` 事件，Vue Router 监听该事件，并根据新的哈希值进行相应的导航。

   ```js
   addEventListener('hashchange', (event) => {})
   ```

2. **示例：**
   - 用户访问`/#/user/123`，浏览器会根据哈希值的变化触发`hashchange`事件，然后 Vue Router 会捕获该事件，加载相应的组件。

### 区别

- **History 模式：**

  - 更美观的 URL，没有`#`符号。
  - 需要服务器端配置，以处理直接访问 URL 时的情况。
  - 依赖 HTML5 History API，可能在一些老旧的浏览器中不兼容。

- **Hash 模式：**
  - 在所有浏览器中都兼容。
  - URL 中带有`#`符号。
  - 不需要特殊的服务器配置，可以直接部署在任意静态文件服务器上。

选择使用哪种模式通常取决于项目的需求和部署环境。在开发环境下，建议使用 hash 模式，因为它不需要配置服务器。在生产环境下，建议使用 history 模式，因为它更美观、更符合规范。
