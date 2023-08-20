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
  - 如何遍历对象? -- `v-for`
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
  - v-model
  - 常见表单项 textarea,checkbox,radio,select
  - 修饰符 v-model.lazy, v-model.number, v-model.trim

## vue 组件使用

- 组件间通信 : props 和 $emit
- 自定义事件
- 生命周期
  - 单个: 挂载,更新,销毁
  - 多个(父子组件):
    - created(setup): 父 -> 子
    - mounted(onMounted): 子 -> 父
    - beforeUpdate(onBeforeUpdate): 父 -> 子
    - updated(onUpdated): 子 -> 父
    - beforeDestroy(onBeforeUnmount): 父 -> 子
    - destroyed(onUnmounted): 子 -> 父
- props(类型和默认值)
- v-on

## vue 的高级特性

- 自定义 v-model
- $nextTick
  - Vue 是异步渲染;
  - data 改变之后, DOM 不会立即渲染;
  - $nextTick 会在 DOM 渲染之后执行，以获取最新的 DOM 节点。
- slot 插槽: 父组件向子组件传递内容
  - 作用域插槽 `v-slot="{ item }"` : 父组件向子组件传递内容
  - 具名插槽 `v-slot:xxx`: 父组件向子组件传递内容，并指定插槽的名字
- keep-alive
  - 场景: 缓存组件;频繁切换,不需要重复渲染的组件;vue 性能优化。
  - 同 `v-show` 的区别: `keep-alive` 是在 vue 框架层级进行的 JS 对象渲染; `v-show`是 CSS display 控制显示和隐藏
- mixin: 多个组件有相同逻辑,抽离出来。vue3 中已被 composition API 所代替。
- 动态、异步组件

  - 动态组件: `<component :is='componentName'>`
  - 异步组件: - 考点: `import()`函数和按需异步加载

    ```js
    import { defineAsyncComponent } from 'vue'
    // simple usage
    const LoginPopup = defineAsyncComponent(() =>
      import('./components/LoginPopup.vue')
    )
    ```

## 全局数据管理 vuex

Vue3 中已被 pinia 所代替。

![vuex](https://vuex.vuejs.org/vuex.png)

- state
- getters
- action
- mutation
- 在 vue 中使用:
  - dispatch
  - commit
  - mapState
  - mapGetters
  - mapActions
  - mapMutations

## vue-router

- 路由模式(hash、H5 history)
- 路由配置（动态路由、懒加载）
- 路由守卫（全局守卫、路由独享守卫、组件内守卫）
- 路由组件传参（query(url 显式)、params(url 不显示)）

## 框架原理

主要考察点：

- 组件化
- 响应式
- vdom 和 diff
- 模版编译
- 渲染过程
- 前端路由

### 组件化

- 组件化: 把页面拆分成多个可复用的组件
- 组件化优势: 提高开发效率、代码复用、简化调试

### 响应式

- 数据驱动视图: 数据改变, 视图随之改变，即 MVVM（model view viewModel）。
- vue2 中用的 Object.defineProperty，vue3 中用了 Proxy。

```js
// vue2 中 Object.defineProperty 的基本用法

const data = {}
const name = '张三'

Object.defineProperty(data, 'name', {
  get() {
    console.log('get')
    return name
  },
  set(newValue) {
    console.log('set')
    name = newValue
  },
})

// 测试
data.name = '李四' // set
console.log(data.name) // get
```

```js
// vue2 中深度绑定实现

function updateView() {
  console.log('updateView')
}

let num = 0
function defineReactive(data, key, value) {
  // 深度监听
  observe(value)

  // 核心 API
  Object.defineProperty(data, key, {
    get() {
      console.log('get')
      return value
    },
    set(newValue) {
      if (newValue !== value) {
        observe(newValue)
        value = newValue
        console.log('set')

        // 触发更新视图
        updateView()
      }
    },
  })
}

// 监听对象属性

function observe(data) {
  if (typeof data !== 'object' || data === null) {
    return
  }

  // 递归子属性
  Object.keys(data).forEach((key) => {
    defineReactive(data, key, data[key])
  })
}

// 测试

const data = {
  name: '张三',
  age: 18,
  info: {
    sex: '男',
  },
  numbers: [1, 2, 3],
}

observe(data)

data.name = '李四' // set
console.log(data.name) // get
data.x = 'new param' // 新增属性
delete data.name // 删除属性
data.info.sex = '女' // 深度监听,修改属性
```

可以看出，Object.defineProperty 的缺点很明显:

- 深度监听，需要递归到底，一次性计算量大；
- 无法监听新增属性/删除属性(`Vue.set`/`Vue.delete`)
- 无法监听数组, 需要做特殊处理。

### vdom 和 diff

- 虚拟 DOM（Virtual DOM）: 把真实 DOM 中的 DOM 节点用 JavaScript 对象来表示，从而实现跨平台和跨浏览器。
- virtual dom 使用 JS 模拟 DOM 结构，把 DOM 结构转换成 JavaScript 对象，然后通过 diff 算法比较新旧虚拟 DOM 的差异，最终把差异更新到真实 DOM 中。
- diff 算法: 计算出最小的差异, 从而实现最小化更新。

可参考资源库: [snabbdom](https://github.com/snabbdom/snabbdom)

### 1. 什么是虚拟 DOM？

虚拟 DOM 是一种模拟真实 DOM 的技术，它把浏览器页面渲染时需要进行的 DOM 操作模拟成 JavaScript 对象，这样就可以在运行时更高效地更新 DOM。虚拟 DOM 的优点是可以在较短的时间内虚拟地表示真实 DOM，并且可以方便地实现跨平台和跨浏览器。

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
