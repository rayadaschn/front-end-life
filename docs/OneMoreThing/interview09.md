---
title: Interview -- vue 相关面试题
icon: note
date: 2023-08-23
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

### 什么是虚拟 DOM？

虚拟 DOM 是一种模拟真实 DOM 的技术，它把浏览器页面渲染时需要进行的 DOM 操作模拟成 JavaScript 对象，这样就可以在运行时更高效地更新 DOM。虚拟 DOM 的优点是可以在较短的时间内虚拟地表示真实 DOM，并且可以方便地实现跨平台和跨浏览器。

### v-show 和 v-if 有什么区别？

v-show 指令是通过设置元素的 display 属性来控制元素是否显示，而 v-if 指令是通过控制元素在文档中的存在性来控制元素的显示和隐藏。

v-show 指令在初始渲染时就会创建元素，而 v-if 指令在条件第一次满足时才会创建元素，在条件第二次满足时会销毁元素，因此 v-if 指令比 v-show 指令具有更高的性能。

v-show 指令在条件改变时，并不会去操作 DOM，而 v-if 指令在条件改变时，会根据条件的改变去操作 DOM。

### v-for 和 v-if 一起使用有什么问题？

v-for 指令和 v-if 指令不能同时使用，因为 v-for 指令会遍历数组或对象，而 v-if 指令会从初始渲染时就创建元素，因此 v-for 指令和 v-if 指令不能同时使用。

### 为什么 v-for 循环的 key 需要唯一？

key 属性是 v-for 指令的参数，它用于指定当前元素的 key，key 必须是唯一的，这样 Vue 才能识别元素，从而高效地更新 DOM。

原理是在 diff 算法中通过 tag 和 key 来判断，是否是 sameNode，以减少渲染次数，提升渲染性能。

当使用 v-for 指令时，如果不提供 key 属性，可能会导致性能问题。key 属性用于确保 Vue.js 能够正确地更新 DOM，特别是当列表项的顺序发生变化时。key 属性应该是一个唯一的值，用于标识每个列表项。

### Vue 中的生命周期是什么(当父子组件同事存在)

在父子组件之间，父组件的生命周期钩子函数总是在子组件的生命周期钩子函数之前被调用。例如，父组件的 beforeCreate 和 created 钩子函数会在子组件的相应钩子函数之前调用，而父组件的 mounted 钩子函数会在子组件的 mounted 钩子函数之后调用。

这种执行顺序确保了父组件可以在子组件挂载之前进行必要的准备工作，并在子组件挂载完成后对其进行操作。

### vue 组件如何通讯

- 父子组件 `props` 和 `$emit`;
- eventBus，自定义事件 `event.$on`、`event.$off`和`event.$emit`;
- vuex/pinia，共享状态管理;

### 描述组件渲染和更新的过程

一个组件渲染到页面 ≥,修改 data 触发更新(数据驱动视图)，其背后的原理是什么？需要掌握哪些要点？

要点：

- 响应式：监听 data 属性 getter 和 setter
- 模版编译：模版到 render 函数，再到 vnode
- vdom：patch（elem， vnode）和 patch（vnode，newVnode）

1. 初次渲染过程:
   - 解析模版为 render 函数(在开发环境已完成, vue-loader)
   - 触发响应式，监听 data 属性 getter 和 setter
   - 执行 render 函数，得到 vnode，patch(elem, vnode)
2. 更新过程:
   - 修改 data，触发 setter（此前在 getter 中已被监听）
   - 重新执行 render 函数，得到新的 vnode，patch(vnode, newVnode)

### 为什么组件的 data 必须是一个函数？

- 组件是可复用的 Vue 实例，且可以有多个实例，如果 data 是一个对象，那么这些实例共用一个 data，就会造成一个修改 data，会影响到其他实例。
- 如果是组件，组件的 data 选项必须是一个函数，因此每次创建该组件实例的时候，data 都会被重新计算。

### ajax 请求应该放在哪个生命周期中？

- 组件创建完成之后的 mounted 中，此时 data 已经完成初始化，可以进行 ajax 请求；
- JS 是单线程，ajax 异步获取数据；
- 放在 mounted 之前没有作用，只会让逻辑变得更加混乱。

### 什么时候用 keep-alive？

- 缓存组件，不需要重复渲染
- 如多个静态 tab 页的切换
- 优化性能

### vue 常见的性能优化方式

- 合理使用 `v-show` 和 `v-if`;
- 合理使用 computed;
- 合理使用 `keep-alive`;
- 合理使用异步组件；
- `v-for` 加 key，以避免和 `v-if` 同时使用;
- 自定义事件、DOM 事件及时销毁；
- data 层级不要太深；
- 前端通用的性能优化，如图片懒加载。

### 网页 url 组成部分

举例：`http://127.0.0.1:8881/home.html?a=100&b=200#/second/other`

- `location.protocol`：协议 'http:'
- `location.hostname`：主机名 '127.0.0.1'
- `location.host`：主机名 '127.0.0.1:8881'
- `location.port`：端口 '8881'
- `location.pathname`：路径 '/home.html'
- `location.search`：参数 '?a=100&b=200'
- `location.hash`：锚点 '#/second/other'

### hash 跳转

hash 的特定:

- hash 变化会触发网页跳转，即浏览器的前进、后退
- hash 变化不会刷新页面，SPA 必需的特点
- hash 不会提交到 server 端

hash 变化的情况:

- JS 修改 URL: `location.href = '#/user'`
- 手动修改 URL 的 hash 部分
- 浏览器的前进和后退

### H5 history 跳转

history 跳转的特点:

- 用 url 规范的路由，但跳转不会刷新页面
- `history.pushState()`、`window.onpopstate` 和 `history.replaceState()` 改变 URL，但不会触发跳转
- H5 history 需要后端支持

hash 和 H5 history 的比较选择:

- to B 的系统推荐用 hash，简单易用，对 url 规范不敏感；
- to C 的系统可以考虑用 H5 history，但需要服务端支持；
- 能用简单的就不用复杂的，考虑成本和收益。

## vue3 部分

- createApp
- emits 属性
- 多事件处理
- Fragment
- 溢出 sync 改为 `v-model` 参数
- 异步组件的引用方式
- 移除 filter
- Teleport
- Suspense
- Composition API
  - ref、toRef、toRefs
  - reactive、shallowReactive、shallowRef
  - computed
  - watch 和 watchEffect
  - 生命周期钩子函数

### vue3 比 vue2 有什么优势?

- 性能提升，打包大小更小，初次渲染更快，更新渲染更快，内存使用减少;
- 更好的 ts 支持;
- 更好的代码组织，更好的逻辑抽离；

### Vue3 生命周期

- 破坏性的变更:

  - beforeDestroy 改名为 beforeUnmount
  - destroyed 改名为 unmounted

- 其它沿用 Vue2 的生命周期，但添加前缀 `on`;
  - beforeCreate -> onBeforeCreate
  - created -> onCreated
  - beforeMount -> onBeforeMount
  - mounted -> onMounted
  - beforeUpdate -> onBeforeUpdate
  - updated -> onUpdated
  - beforeUnmount -> onBeforeUnmount
  - unmounted -> onUnmounted
- setup 代替了 beforeCreate 和 created;

整合代码:

```vue
<script>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from 'vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    }
  },
  setup() {
    // composition API
    // 在 setup() 内部使用生命周期钩子
    console.log('setup')
    onBeforeMount(() => {})
    onMounted(() => {})
    onBeforeUpdate(() => {})
    onUpdated(() => {})
    onBeforeUnmount(() => {})
    onUnmounted(() => {})
  },

  // 兼容早期 Options API
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeUnmount() {},
  unmounted() {},
}
</script>
```

### Composition API 有什么好处?

- 更好的代码组织
- 更好的逻辑复用
- 更好的类型推导

### 如何理解 ref、toRef 和 toRefs

#### ref

- 生成值类型的响应式数据
- 可用于模版和 reactive
- 通过 `.value` 修改值
- 使用技巧命名统一加后缀 `Ref`，如`const nameRef = ref('张三')`
- ref 还可以获取 DOM 元素，路径同 Vue2 一样：

  ```vue
  <template>
    <div ref="elemRef">被获取的 DOM 元素</div>
  </template>
  <script>
  import { ref } from 'vue'
  export default {
    name: 'RefDom',
    setup() {
      // 此处的 "elemRef" 为Dom 中 ref 的赋值项
      const elemRef = ref(null)
      onMounted(() => {
        console.log('ref 获取的元素为:', elemRef.value)
      })

      return {
        elemRef,
      }
    },
  }
  </script>
  ```

#### toRef

- 针对一个响应式对象(`reactive` 封装)的 `prop`，创建一个 `ref`，具有响应式；
- 两者保持引用关系

即对 reactive 对象的保持响应式的“解耦”：

```js
const state = reactive({
  name: '张三',
  age: 18,
})

const ageRef = toRef(state, 'age')

setTimeout(() => {
  state.age = 20 // ageRef 会同时响应
}, 1000)
```

#### toRefs

- 将响应式对象(`reactive` 封装)全部转换为普通对象;
- 但是普通对象的每个 `prop` 都是对应 `ref`;
- 俩者保持引用关系;

```js
const state = reactive({
  name: '张三',
  age: 18,
})

const stateRefs = toRefs(state)

const { age: ageRef, name: nameRef } = stateRefs

setTimeout(() => {
  state.age = 20 // ageRef 会同时响应
}, 1000)
```

俩个较好的应用:

1. 合成函数返回响应式对象

   ```js
   function useFeature() {
     const state = reactive({
       x: 1,
       y: 2,
     })
   }
   // ......
   // 返回时转换为 ref
   return toRefs(state)
   ```

2. 可以在不失去响应式的情况下破坏结构

   ```js
   export default {
     setup() {
       const { x, y } = useFeature()

       return {
         x,
         y,
       }
     },
   }
   ```

总结:

- 用 reactive 做对象的响应式,用 ref 做值类型的响应式;
- setup 中返回 `toRefs(state)`, 或者 `toRef(state, 'xxx')`
- ref 的变量命名都用"Ref"做后缀
- 合成函数返回响应式对象时，使用 toRefs

### 为什么需要 ref?

- 返回值类型，会丢失响应式。如在 setup、computed、合成函数等中，都有可能返回值类型。
- Vue 如不定义 ref，用户将自造 ref，反而混乱。

### 为什么需要 `.value`?

- ref 是一个对象（不丢失响应式），`value` 存储值；
- 通过 `.value` 属性的 `get` 和 `set` 实现响应式;
- 用于`模版`、`reactive` 时，不需要 `.value`，其它情况需要。

```js
// 简单理解 computed 返回一个 ref 值的逻辑

// -------- computed 应用 -----------
const state = reactive({
  name: '张三',
  age: 18,
})
const age = computed(() => {
  return state.age + 1
})

// -------- computed 实现原理 -----------
function computed(getter) {
  const ref = { value: null }
  watchEffect(() => {
    ref.value = getter()
  })
  return ref
}
```

### 为什么需要 `toRef` 和 `toRefs`

> toRef 的作用是创建一个新的 Ref 变量，转换 Reactive 对象的某个字段为 Ref 变量;
>
> toRefs 的作用是创建一个新的对象，它的每个字段都是 Reactive 对象各个字段的 Ref 变量。

- 初衷：不丢失响应式的情况下，把对象数据**分解**或**扩散**；
- 前提：针对的是响应式对象（reactive 封装过的）**非普通对象**；
- 目的是：**不创造**响应式，而是**延续响应式**。

### 如何理解 `v-model`? 同 vue2 中的 `.sync`

`v-model` 的作用是实现表单元素和 Vue 实例数据之间的双向绑定。在 Vue2 中`.sync`是实现这种父子组件之间双向数据绑定的语法糖，现在由`v-model`代替。

```vue
<template>
  <div>Vue3 中如下使用</div>
  <input type="text" v-model="message" />

  <div>实质是如下的语法糖:</div>
  <input type="text" :value="message" @input="message = $event.target.value" />
</template>

<script>
export default {
  data() {
    return {
      message: '',
    }
  },
}
</script>
```

同理还有 v-model/emits 父子组件的通信。

1. 在父组件中，通过 v-model 向子组件传值；
2. 在子组件中通过自身设定的 emits 向父组件**通知**数据更新。

```vue
<!-- 1. Father.vue 向子组件传值 -->
<template>
  <Child v-model:username="userInfo.name" />
</template>
```

```vue
<!-- 2. Child.vue 向父组件通知数据更新 -->
<script>
export default defineComponent({
  props: {
    username: String,
  },
  // 请注意这里是固定的 "update:" 的前缀
  emits: ['update:username'],
})
</script>
```

由上可知，这里的 v-model 的语法糖实质为：

```vue
<!-- Father.vue 向子组件传值 -->
<template>
  <!-- v-model 语法糖 -->
  <Child v-model:username="userInfo.name" />

  <!-- v-model 语法糖实质 -->
  <Child :username="userInfo.name" @update:username="userInfo.name = $event" />
</template>
```

### watch 和 watchEffect 的区别是什么?

- 俩者都可以监听 data 属性变化
- watch 需要明确监听哪个属性
- watchEffect 会根据函数内的变量属性，自动监听变化

```js
const numberRef = ref(100)
watch(
  numberRef, // 第一个参数为确定监听的属性
  (newVal, oldVal) => {
    // 第二个为回调函数
    console.log('numberRef 变化了', oldVal, newVal)
  },
  {
    Immediate: true,
  }
)

watchEffect(() => {
  // 初始化时, 一定会触发
  console.log('会依据回调函数内的变量变化, 而重新执行')
  console.log('numberRef:', numberRef)
})
```

### vue3 中 setup 如何获取组件实例

- 在 setup 和其他 Composition API 中没有 this;
- 可通过 getCurrentInstance 获取当前实例;
- 若使用 Options API 可照常使用 this。

```js
import { onMounted, getCurrentInstance } from 'vue'

export default {
  name: 'GetInstance',
  data() {
    return {
      x: 10,
      y: 20,
    }
  },
  setup() {
    console.log('this:', this)

    onMounted(() => {
      console.log('this in onMounted:', this) // undefined
      console.log('Instance 中的属性', instance.data.x) // 要在 Mounted 生命周期后再获取
    })

    const instance = getCurrentInstance()
    console.log('instance', instance)
  },
}
```

### Vue3 为什么比 Vue2 快?

- Proxy 响应式
- PatchFlag
  - 编译模版时, 动态节点做标记
  - 标记, 分为不同的类型, 如 TEXT PROPS
  - diff 算法中, 可区分静态节点, 以及不同类型的动态节点
- hoistStatic
  - 将静态节点的定义, 提升到父作用域, 缓存起来
  - 多个相邻的静态节点, 会被合并起来
  - 典型的拿空间换时间的优化策略
- cacheHandle
  - 缓存事件
- tree-shaking

### Vite 为什么会快?

- 开发环境使用 ES6 Module，无需打包因此非常快；
- 生产环境使用 rollup， 并不会快很多。

### Composition API 和 React Hook 对比

- Composition 的 setup 只会调用一次，而 React 的 Hook 函数会被被多次调用；
- 前者无需 useMemo useCallback，因为 setup 只会调用一次；
- 前者无需咕噜调用顺序，而后者需要保证 hooks 的顺序一致；
- 但是 reactive 和 ref 比后者的 useState 要更难理解。
