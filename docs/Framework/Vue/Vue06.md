---
title: 基于 Vue 简单实现一个 message 提示框
icon: vue
date: 2025-12-13
category:
  - 框架
tag:
  - Vue
sticky: false
---

在日常开发中，像 `Message.success()`、`Message.error()` 这类 **API 式调用的提示框**非常常见，例如 Element Plus、Ant Design Vue 都提供了类似能力。

本文基于 **Vue 3**，从最简单的实现入手，手写一个 `message` 提示框，帮助理解这类组件背后的实现原理。

## 一、Message 的实现思路

API 式 message 的核心思想可以总结为一句话：

> **在需要的时候，动态创建一个组件实例，并挂载到 `body` 上**

具体步骤如下：

1. 使用 `createApp` 创建一个 Vue 应用实例
2. 将 message 组件挂载到一个动态创建的 DOM 节点
3. 插入到 `document.body`
4. 在指定时间后销毁组件并移除 DOM

## 二、创建 Message 组件

首先实现一个最基础的 Message 组件，仅负责展示内容。

```vue
<template>
  <div class="message">
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: String,
})
</script>

<style>
.message {
  position: fixed;
  top: 20px;
  right: 20px;
  background: black;
  color: white;
  padding: 12px 16px;
  border-radius: 4px;
  z-index: 9999;
}
</style>
```

这里有几个关键点：

- 使用 `position: fixed`，避免受父级布局影响
- 提示框不参与页面布局
- 样式尽量保持简单，聚焦功能本身

## 三、通过 createApp 动态创建组件

接下来实现核心的 `message` 函数。

```js
import { createApp } from 'vue'
import MyMessage from './MyMessage.vue'

function createMessage(options) {
  const { text = '', duration = 2000 } = options || {}

  // 1. 创建一个容器
  const container = document.createElement('div')

  // 2. 创建应用实例
  const app = createApp(MyMessage, {
    message: text,
  })

  // 3. 挂载并插入 body
  app.mount(container)
  document.body.appendChild(container)

  // 4. 定时销毁
  setTimeout(() => {
    app.unmount()
    document.body.removeChild(container)
  }, duration)
}

export function message(text) {
  createMessage({ text })
}
```

调用方式如下：

```js
message('操作成功')
```

## 四、为什么要手动 unmount？

这里有一个很容易被忽略但**非常重要**的点：

```js
app.unmount()
document.body.removeChild(container)
```

如果只移除 DOM，不卸载 Vue 实例：

- 组件的响应式依然存在
- 定时器、watch、事件监听可能不会释放
- 多次调用会造成 **内存泄漏**
