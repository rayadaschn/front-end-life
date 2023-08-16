---
title: Interview -- vue 相关面试题
date: 2023-08-11
category:
  - anonymous
tag:
  - note
star: false
# sticky: true
sticky: false
---

框架类面试主要考察三个方面:

- 框架的使用(基本使用, 高级特性, 周边插件)
- 框架的原理(基本原理的了解, 热门技术的深度和全面性)
- 框架的实际应用,即设计能力(组件结构和数据结构)

## 基本使用

- 指令和插值
  - 插值、表达式
  - 指令、动态属性
  - v-html：会有 XSS 风险，会覆盖子组件
- computed 和 watch
  - computed 有缓存 data 不变则不会重新计算
  - watch 的深度监听
  - watch 监听引用类型，拿不到 oldValue
- class 和 style
- 条件渲染
  - `v-if` 和 `v-else` 的用法, 可使用变量, 也可使用 `===` 表达式
  - `v-if` 和 `v-show` 的区别
  - `v-if` 和 `v-show` 的使用场景
- 循环(列表)渲染
  - 如何遍历对象? -- 也可使用 `v-for`
  - key 的重要性，key 不能重复
  - `v-for` 和 `v-if` 不能一起使用
- 事件
  - event 参数，自定义参数
  - 事件修饰符
    - 阻止单击事件继续传播: `<a @click.stop="doThis" >A</a>`
    - 提交时间不再重载页面: `<a @click.submit.prevent="onSubmit" >B</a>`
    - 修饰符可以串联: `<a @click.stop.prevent="doThat" >C</a>`
    - 只有修饰符: `<a v-on:submit.prevent="doThat" >D</a>`
  - 按键修饰符
    - 即使 Alt 或 Shift 被一同按下也会触发: `<a @click.ctrl="onClick" >A</a>`
    - 只有 Ctrl 被按下才会触发: `<a @click.ctrl.exact="onClick" >B</a>`
    - 没有任何修饰符被按下时才会触发: `<a @click.exact="onClick" >C</a>`
  - 事件如何绑定 -- `@click`
- 表单
- 组件
  - 生命周期
  - props(类型和默认值)
  - v-on 和 $emit
  - 自定义事件

## 框架原理

### 1. 什么是虚拟 DOM？

虚拟 DOM（Virtual DOM）是一种模拟真实 DOM 的技术，它把浏览器页面渲染时需要进行的 DOM 操作模拟成 JavaScript 对象，这样就可以在运行时更高效地更新 DOM。虚拟 DOM 的优点是可以在较短的时间内虚拟地表示真实 DOM，并且可以方便地实现跨平台和跨浏览器。

### 2. v-show 和 v-if 有什么区别？

v-show 指令是通过设置元素的 display 属性来控制元素是否显示，而 v-if 指令是通过控制元素在文档中的存在性来控制元素的显示和隐藏。

v-show 指令在初始渲染时就会创建元素，而 v-if 指令在条件第一次满足时才会创建元素，在条件第二次满足时会销毁元素，因此 v-if 指令比 v-show 指令具有更高的性能。

v-show 指令在条件改变时，并不会去操作 DOM，而 v-if 指令在条件改变时，会根据条件的改变去操作 DOM。

### 3. v-for 和 v-if 一起使用有什么问题？

v-for 指令和 v-if 指令不能同时使用，因为 v-for 指令会遍历数组或对象，而 v-if 指令会从初始渲染时就创建元素，因此 v-for 指令和 v-if 指令不能同时使用。

### 4. 为什么 v-for 循环的 key 需要唯一？

key 属性是 v-for 指令的参数，它用于指定当前元素的 key，key 必须是唯一的，这样 Vue 才能识别元素，从而高效地更新 DOM。

当使用 v-for 指令时，如果不提供 key 属性，可能会导致性能问题。key 属性用于确保 Vue.js 能够正确地更新 DOM，特别是当列表项的顺序发生变化时。key 属性应该是一个唯一的值，用于标识每个列表项。

### Vue 中的生命周期是什么(当父子组件同事存在)

在父子组件之间，父组件的生命周期钩子函数总是在子组件的生命周期钩子函数之前被调用。例如，父组件的 beforeCreate 和 created 钩子函数会在子组件的相应钩子函数之前调用，而父组件的 mounted 钩子函数会在子组件的 mounted 钩子函数之后调用。

这种执行顺序确保了父组件可以在子组件挂载之前进行必要的准备工作，并在子组件挂载完成后对其进行操作。

### vue 组件如何通讯

### 描述组件渲染和更新的过程

### 双向数据绑定 v-model 的实现原理
