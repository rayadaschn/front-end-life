---
title: Vue3中的script-setup
icon: vue
date: 2023-03-16
category:
  - 框架
tag:
  - Vue
star: true
sticky: false
---

# Vue3 中的 script-setup

## 1. 动物园里有什么?

在 `Vue@3.1.4` 以后 Vue 加入了 **`set-up`** 语法糖，以助于高效开发。先抛开其它其它概念，由于在 Vue3 中， template 模版如果需要使用 **`script`** 中的变量，需要在 **`setup()`** 中 `return{}` 抛出。

```js
<!-- Vue3 中的标准组件格式 -->
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    // 定义变量...

    return {
      // 抛出变量...
    }
  },
})
</script>
```

一不留神，就会忘记抛出，导致报错。为此，`setup` 语法糖的出现，就是为了去除 `return{}` 而产生的。换句话说，整个 `script` 内都在 `setup()` 函数中。

```js
<!-- 使用 script-setup 格式 -->
<script setup lang="ts">
// ...
</script>
```

不过，便利也是有代价的，由于`Vue3`多用 `composition API` ，这种无需`return`抛出变量，就在 `template` 中使用，也会产生一定的困惑。

## 2. 原 setup 函数中的参数使用

由于没有了`setup()` 函数，所以也就没有了给 `setup()` 函数传参的入口了。不过 `Vue3` 也为此提供了新的 `API` 解决方案。我们先来回顾一下原先`setup`函数中的参数。

```js
import { toRefs, toRef } from "vue";

export default {
  setup(props, context) {
    // 将 `props` 转为一个其中全是 ref 的对象，然后解构
    const { title } = toRefs(props);
    // `title` 是一个追踪着 `props.title` 的 ref
    console.log(title.value);

    // 透传 Attributes（非响应式的对象，等价于 $attrs）
    console.log(context.attrs);

    // 触发事件（函数，等价于 $emit）
    console.log(context.emit);

    // 插槽（非响应式的对象，等价于 $slots）
    console.log(context.slots);

    // 暴露公共属性（函数）
    console.log(context.expose);
  },
};
```

即共有俩个参数，`props` (由父组件传递下来的数据)和 `context` (组件的执行上下文)。

- **`props`** ： 表示由父组件传递下来的数据，它**是响应式的**，当父组件传递过来的数据发生变化，该 `props` 中对应的数据也会被更新。所以**解构前需要利用 `torefs` 进行响应式数据转换**。
- **`context`** ： 表示组件的执行上下文，类型也是 `Object`，但是**不是响应式**，可以直接对其进行解构。它公包含组件的三个 `property`:
  - **`attrs`** : **非响应式对象**，表示第一个参数 `props` 未定义的剩余属性（如 class 等）。
  - **`slots`** : **非响应式对象**，表示插槽。
  - **`emit`** : 方法，非对象，用于触发事件。

由于没有了参数，`Vue3` 新增了对应的几个全局编译器宏: `defineProps`、 `defineEmits`、`defineExpose` 和 `withDefaults`。不用导入噢~ 具体用法见下面。

当然，如果 Eslint 报错了， 我们还是需要在 `.eslintrc.js` 中进行提前说明：

```js
// .eslintrc.js
module.exports = {
  // 全局 globals 说明
  globals: {
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly",
  },
};
```

## 3. 省力的改变

### 3.1 子组件无需手动注册

由上文可知，整个 `script` 标签均为 `setup` 函数。因此，像之前的与 `setup(){}` 同级的子组件注册 `component:{ Child }`，已无需额外设置了。（没有地方给你写啦~）

```vue
<!-- setup 语法糖之前 -->
<template>
  <Child />
</template>

<script lang="ts">
import { defineComponent } from "vue";

// 导入子组件
import Child from "@cp/Child.vue";

export default defineComponent({
  // 需要启用子组件作为模板
  components: {
    Child,
  },

  // 组件里的业务代码
  setup() {
    // ...
  },
});
</script>
```

```vue
<!-- 加入 setup 语法糖后 -->
<template>
  <Child />
</template>

<script setup lang="ts">
import Child from "@cp/Child.vue";
</script>
```

简直省了大力气呀~

### 3.2 props 父级传参的接收变化

同子组件注册一样，原先父组件传参过来需要在 `setup()` 函数内进行传参。而现在没有了这个显式写法了，所以 `Vue3` 提供了全新的 API ：**`defineProps`** 。

对照第二节中的定义，我们还是看看原先的写法吧：

```vue
<!-- 原 父组件 -->
<template>
  <Child title="用户信息" :index="007" :uid="userInfo.id" />
</template>
<script>
import { defineComponent } from "vue";
import Child from "@cp/Child.vue";

interface Member {
  id: number;
}

export default defineComponent({
  components: {
    Child,
  },
  setup() {
    const userInfo: Member = {
      id: 955,
    };
    return {
      userInfo, // return 给template使用
    };
  },
});
</script>
```

```vue
<!-- 原 子组件 -->
<template>
  <div>xxxxx</div>
</template>
<script>
import { defineComponent, torefs } from 'vue'

export default defineComponent({
  // props: ['title', 'index', 'userName', 'uid'], // A. 数组类型定义 props
  props: {  // B. 对象类型定义 props
    title: {  // 1. 可选，并提供默认值
      type: String,
      required: false,
      default: '默认标题',
    },
    index: Number, // 2. 默认可选，单类型
    userName: { // 3. 添加一些自定义校验
      type: String,
      // 在这里校验用户名必须至少3个字
      validator: (v) => v.length >= 3,
    },
    uid: [Number, String], // 4. 默认可选，但允许多种类型
  }
  setup(props) {
    console.log(props) // 该入参包含了当前组件定义的所有 Props
    const propsValue = torefs(props) // props 对象是响应式的,所以需要用 torefs 进行响应式装换，方能解构
    return {
      ...propsValue   // 响应式返回
    }
  },
})
</script>
```

运用 `setup` 语法糖后，利用 `defineProps` 接收 `props` 。

`defineProps` 是一个方法，内部返回一个对象，这个对象（也是响应式的）并将会挂载到这个组件上的所有 `props` 。需要注意的是，同普通的 `props` 一样，若不指定，则父组件传递下来的属性将会被归于 `attrs` 中去。

具体用法：

1. 使用数组( `string[]` )作为入参：

   A. 只需在 `template` 中使用，则只需简单定义（无需像 `setup` 函数一样 return 噢，没有`setup` 函数了）

   ```js
   defineProps(["name", "userInfo", "tags"]);
   ```

   B. `defineProps` 会返回一个对象，该对象包含`string[]` 入参的`props` 对象。

   ```js
   const props = defineProps(["name", "userInfo", "tags"]);
   console.log(props.name);
   ```

2. 使用对象作为入参，可对 `props` 类型进行约束：

   A. 基础用法:

   ```js
   defineProps({
     name: String,
     userInfo: Object, // 构造函数校验 大写
     tags: Array,
   });
   ```

   B. 进行校验:

   ```js
   defineProps({
     name: {
       type: String, // 类型
       required: false, // 是否必传
       default: "Petter", // 默认值
     },
     userInfo: Object, // 构造函数校验 大写
     tags: Array,
   });
   ```

   C. 使用**类型注解检查** `props` :

   若是使用的是 `TypeScript` 的类型注解，我们还可以用 `defineProps<T>` 尖括号包裹类型定义，紧跟在 API 后面。另外，由于 `defineProps` 返回的是一个对象（`Props` 本身就是一个对象呀~(ﾟ ▽ ﾟ)/），所以 `T` 也需要写成对象形式：

   ```js
   defineProps<{ name: string }>() // 类型校验 小写
   ```

   > Tips: 这里是类型校验，不再是构造函数校验，所以尖括号内是写 `小写string`。
   >
   > 定义数据过多，可以外部导入 `interface`

   当然，这种方式是不能指定默认值啦，所以 `Vue3` 非常贴心的加入了全新 API： `withDefaults` 。

   D. 为类型注解提供的 `withDefaults` :

   `withDefaults` 需要传入俩个参数，第一个当然就是使用 类型注解的 props ： **`defineProps<T>()`** ，第二个参数就是约束规范的默认值 **`defaultValues`** (也是一个对象噢)。用法如下：

   ```js
   withDefaults(
     defineProps<{
       size?: number, // 可选类型
       labels?: string[]
     }>(),
     {
       size: 3,
       labels: () => ['default label'], // 函数返回
     }
   )
   ```

总结: 改变还是挺大的，总的来说就是共有 4 种传递方式： 使用数组字符串形式基础定义 、 使用对象形式定义、使用类型注解定义 `props` 以及 全新 API `withDefault` 对 类型注解进行约束。

### 3.3 emits 子级发送事件的变化

同样的，由于没有了 `setup(){ return { }}` ，子组件定义的事件要让父组件获取到也用到 以 `default`开头的全新 API：`defineEmits` 。（**注意在 Vue@3.13 版本后这个 API 有 `s` 结尾，因为是复数嘛， 但是原先的 `setup` 参数中的 context.emit 也是不带 s 的！！！**）

按照惯例，我们先来看看没有用 `setup` 语法糖之前的写法吧：

```js
export default defineComponent({
  // emits: ['update-age'], // 数组形式写法
  emits: {
    // 对象形式写法 进行校验
    "update-age": (age: number) => {
      // 写一些条件拦截，记得返回false
      if (age < 18) {
        console.log("未成年人不允许参与");
        return false; // 返回 false 进行拦截
      }

      // 通过则返回true
      return true;
    },

    // 一些无需校验的，设置为null即可
    "update-name": null,
  },
  setup(props, { emit }) {
    // 在第二个 context 上下文中， 这里没有 s
    setTimeout(() => {
      emit("update-age", 22); // 更新事件发送
    }, 2000);
  },
});
```

都说到这了，再补充描述一下便捷省力的 `v-model / emits` 配合吧:

```vue
<!-- 父组件: v-model 使用 : 来指定要绑定的属性名 -->
<template>
  <Child v-model:user-name="userInfo.name" v-model:uid="userInfo.id" />
</template>
```

```vue
<!--子组件 接收发送, 通过 “update:属性名” 的格式，直接定义一个更新事件 -->
<script>
export default defineComponent({
  props: {
    // 接收定义属性
    userName: String,
    uid: Number,
  },
  emits: ["update:userName", "update:uid"], // 定义子组件发生事件名称
  setup(props, { emit }) {
    setTimeout(() => {
      emit("update:userName", "Tom"); // 更新事件发送
    }, 2000);
  },
});
</script>
```

使用 `setup` 语法糖后，改变仅在子组件的 a. 获取定义 emits；b. 调用发送 emits 上：

```js
// 获取 emit
const emits = defineEmits(["chang-name"]); // 定义完后返回一个 emits 供子组件调用发送

// 调用 emit
emits("chang-name", "Tom");
```

而在定义约束规范上，同之前一样。

### 3.4 attrs 额外参数的接收变化

`attrs` 同 `emit` 一样，在原先到 `setup(props, { attrs })` 第二个参数 context 全局上下文对象中（ **非响应式的对象** ）。它所表示的是父组件定义下来的数据没有被指定为 `props` ，则会被挂载到 `attrs ` 对象上。为了获取到它，Vue3 提供了全新的 API ： `useAttrs` （这次不再是 define 开头了，这里是使用参数，而不是定义数据，所以也不是响应式对象），**另外像以 `default` 开头的全新 API 是属于全局编译器宏，而这里的 `useAttrs` 并不是，所以还需要从 `vue` 中额外导入** 。

```js
// 导入 useAttrs 组件
import { useAttrs } from "vue";

// 获取 attrs
const attrs = useAttrs();

// attrs是个对象，和 props 一样，需要通过 key 来得到对应的单个 attr
console.log(attrs.msg);
```

### 3.5 slots 插槽的接收变化

子组件获取父组件传递过来的 **插槽** 内的数据，其实用的不多，更多的是给 **JSX/TSX** 开发者使用。它也是属于`setup(props, { slots })` 第二个参数 context 全局上下文对象中，现在我们用全新的 API : **`useSlots`** 。同 `attrs` 一样，是非响应式的。

```vue
<!-- 父组件 -->
<template>
  <!-- 子组件 -->
  <ChildTSX>
    <!-- 默认插槽 -->
    <p>I am a default slot from TSX.</p>
    <!-- 默认插槽 -->

    <!-- 命名插槽 -->
    <template #msg>
      <p>I am a msg slot from TSX.</p>
    </template>
    <!-- 命名插槽 -->
  </ChildTSX>
  <!-- 子组件 -->
</template>

<script setup lang="ts">
import ChildTSX from "@cp/context/Child.tsx";
</script>
```

```vue
<!-- 子组件通过 useSlots 来获取父组件传进来的 slots 数据进行渲染 -->
<script>
import { useSlots } from "vue";
// 获取插槽数据
const slots = useSlots();

// 使用插槽数据
console.log(slots.default); // 默认插槽
console.log(slots.msg); // 命名插槽
</script>
```

### 3.6 ref 通信方式的变化

其实上文中已经提到了，子组件由于用了 `setup` 语法糖后，无需 `return` ，`template` 中就能够使用这些变量。但是如果父组件若是想要使用子组件中所定义的方法，则需要用的全新的 API：`defineExpose`。将父组件要用的 方法/变量 暴露出去。

按照惯例，我们来看看原先的使用方案：

```vue
<template>
  <!-- 挂载子组件 -->
  <Child ref="child" />
  <!-- 挂载子组件 -->
</template>
<script>
import { defineComponent, onMounted, ref } from 'vue'
import Child from '@cp/Child.vue'

export default defineComponent({
  components: {
    Child,
  },
  setup() {
    // 定义挂载节点，声明的类型详见下方附表
    const child = ref<InstanceType<typeof Child>>()

    // 请保证视图渲染完毕后再执行节点操作 e.g. onMounted / nextTick
    onMounted(() => {
      // 或者操作子组件里的数据
      child.value.isShowDialog = true
    })

    // 必须return出去才可以给到template使用
    return {
      child,
    }
  },
})
</script>
```

用了语法糖后，直接用`defineExpose` 将需要使用的 方法函数/变量 暴露出去就行了。

```vue
<script setup lang="ts">
// 定义一个想提供给父组件拿到的数据
const msg: string = "Hello World!";

// 定义一个想提供给父组件拿到的方法函数
function foo() {
  console.log(msg);
}

// 显示暴露的数据，才可以在父组件拿到
defineExpose({
  msg,
  foo,
});
</script>
```

### 3.7 顶级 await 支持

最后一个很好用的方法，在 `script-setup` 模式下，不必再配合 `async` 就可以直接使用 `await` 了，这种情况下，组件的 `setup` 会自动变成 async setup 。

```vue
<script lang="ts">
import { defineComponent, withAsyncContext } from "vue";

export default defineComponent({
  async setup() {
    const post = await withAsyncContext(
      fetch(`/api/post/1`).then((r) => r.json())
    );

    return {
      post,
    };
  },
});
</script>
```

用语法糖后:

```vue
<script setup lang="ts">
const post = await fetch(`/api/post/1`).then((r) => r.json());
</script>
```

### 3.8 OneMorething: 自定义指令

Vue3 还是提供了很好用的自定义指令的，可以自定义一些特定功能。内容还是有点多的嘞 (ÒܫÓױ) ，如果你的暂时用不到，可以待日后再来查阅~

按照惯例，我们先来看看，不用 `setup` 语法糖的 “朴素” 写法。

较好的学习方式：学习一个语法用法咱们可以从它的 TS 类型入手。

```typescript
// 1. 对象式写法的 TS 类型
// ...
export declare interface ObjectDirective<T = any, V = any> {
  created?: DirectiveHook<T, null, V>;
  beforeMount?: DirectiveHook<T, null, V>;
  mounted?: DirectiveHook<T, null, V>;
  beforeUpdate?: DirectiveHook<T, VNode<any, T>, V>;
  updated?: DirectiveHook<T, VNode<any, T>, V>;
  beforeUnmount?: DirectiveHook<T, null, V>;
  unmounted?: DirectiveHook<T, null, V>;
  getSSRProps?: SSRDirectiveHook;
  deep?: boolean;
}
// ...
```

这种是对象式写法，定义的钩子函数非常全面。还有一种是小清新的函数式写法（现在都流行这么写啦~）,不足之处在于这种写法只在 `mounted` 和 `updated` 这两个钩子生效，并且触发一样的行为。

```typescript
// 2. 函数式写法的 TS 类型
// ...
export declare type FunctionDirective<T = any, V = any> = DirectiveHook<
  T,
  any,
  V
>;
// ...
```

咱的来说，钩子函数的定义同组件的生命周期较为类似。目的也是同组件一同绑定。

每个钩子函数都需要 4 个入参：

```typescript
// 钩子函数的 TS 类型
// ...
export declare type DirectiveHook<
  T = any,
  Prev = VNode<any, T> | null,
  V = any
> = (
  el: T,
  binding: DirectiveBinding<V>,
  vnode: VNode<any, T>,
  prevVNode: Prev
) => void;
// ...
```

因此，钩子函数的具体用法如下：

```typescript
const myDirective = {
  created(el, binding, vnode, prevVnode) {
    // 四个参数...
  },
  mounted(el, binding, vnode, prevVnode) {
    // ...
  },
  // 其他钩子...
};
```

这四个参数的定义如下：

| 参数        | 作用                                                                                               |
| ----------- | -------------------------------------------------------------------------------------------------- |
| `el`        | 指令绑定的 DOM 元素，可以直接操作它。也就是我们通过 `document.querySelector` 拿到的那个 DOM 元素。 |
| `binding`   | 一个对象数据，见下方的单独说明                                                                     |
| `vnode`     | el 对应在 Vue 里的虚拟节点信息                                                                     |
| `prevVNode` | Update 时的上一个虚拟节点信息，仅在 `beforeUpdate` 和 `updated` 可用                               |

其中，用的最多的是头俩个参数 `el` 和 `binding`，`el` 是我们指令要绑定的 DOM 元素。所以我们再看看钩子函数的第二个参数 `DirectiveBinding` 定义:

```typescript
// ...
export declare interface DirectiveBinding<V = any> {
  instance: ComponentPublicInstance | null;
  value: V;
  oldValue: V | null;
  arg?: string;
  modifiers: DirectiveModifiers;
  dir: ObjectDirective<any, V>;
}
// ...
```

嗯，属性也还是相当多，它们的定义如下：

| 属性        | 作用                                                                      |
| ----------- | ------------------------------------------------------------------------- |
| `instance`  | 使用指令的组件实例                                                        |
| `value`     | 传递给指令的值，例如 `v-foo="bar"` 里的 `bar` ，支持任意有效的 JS 表达式  |
| `oldValue`  | 指令的上一个值，仅对 `beforeUpdate` 和 `updated` 可用                     |
| `arg`       | 传给指令的参数，例如 `v-foo:bar` 里的 `bar`                               |
| `modifiers` | 传给指令的修饰符，例如 `v-foo.bar` 里的 `bar`                             |
| `dir`       | 指令定义的对象（就是上面的 `const myDirective = { /* ... */ }` 这个对象） |

呼，终于看完主体了，我们来看看具体怎么使用吧。

1. 局部注册使用

   同其它的组件实例一样，区分局部和全局。在局部单个组件内，我们需要用到同 `setup`同级别的 `directive` 选项对自定义的指令进行定义：

   ```vue
   <template>
     <!-- 默认值 unset -->
     <div v-highlight>{{ msg }}</div>
     <!-- 默认值 unset -->

     <!-- 传参使用 -->
     <div v-highlight="`yellow`">{{ msg }}</div>
     <!-- 传参使用 -->
   </template>

   <script lang="ts">
   import { defineComponent, ref } from "vue";

   export default defineComponent({
     // 自定义指令全在这里编写，和 setup 同级别
     directives: {
       // directives 下的每个字段名就是指令名称
       highlight: {
         // 钩子函数, 仅展示 mounted
         mounted(el, binding) {
           el.style.backgroundColor =
             typeof binding.value === "string" ? binding.value : "unset";
         },
       },
     },
     setup() {
       const msg = ref<string>("Hello World!");

       return {
         msg,
       };
     },
   });
   </script>
   ```

   **对象式**写法较为全面，我们也可以使用**函数式**的写法：

   ```js
   export default defineComponent({
     directives: {
       highlight(el, binding) {
         el.style.backgroundColor =
           typeof binding.value === "string" ? binding.value : "unset";
       },
     },
   });
   ```

2. 全局注册使用

   全局注册，就无需在每个组件里定义了，定制使用的也是最多的。这个也是在 Vue 项目的入口文件 `main.ts` 里启用它。内容较多，请看《[Vue3 中的全局注册](Vue3中的全局注册.md)》。

在对象式写法中，我们还看到有一个可选的 `deep?: boolean` ，它的作用是：如果自定义指令用于一个有嵌套属性的对象，并且需要在嵌套属性更新的时候触发 `beforeUpdate` 和 `updated` 钩子，那么需要将这个选项设置为 `true` 才能够生效。

又抄了一个案例：

```vue
<template>
  <div v-foo="foo"></div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

export default defineComponent({
  directives: {
    foo: {
      beforeUpdate(el, binding) {
        console.log("beforeUpdate", binding);
      },
      updated(el, binding) {
        console.log("updated", binding);
      },
      mounted(el, binding) {
        console.log("mounted", binding);
      },
      // 需要设置为 true ，如果是 false 则不会触发
      deep: true,
    },
  },
  setup() {
    // 定义一个有嵌套属性的对象
    const foo = reactive({
      bar: {
        baz: 1,
      },
    });

    // 2s 后修改其中一个值，会触发 beforeUpdate 和 updated
    setTimeout(() => {
      foo.bar.baz = 2;
      console.log(foo);
    }, 2000);

    return {
      foo,
    };
  },
});
</script>
```

好了，我们回到主题，现在用了 `setup` 语法糖后，怎么去自定义指令呢？

方法很简单： 1. 当然是在全局自定义呀！ 哈哈哈哈；2. 局部自定义的话，则直接省力：**不需要显式注册，但需要遵循 `vNameOfDirective` 这样的命名规范**，也就是以 小写 `v` 开头命名自定义指令：

```vue
<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // 在元素上做些操作
  },
};
</script>
<template>
  <h1 v-my-directive>This is a Heading</h1>
</template>
```

若是从独立文件导入的，可以通过重命名使其符合命名规范：

```vue
<script setup>
import { myDirective as vMyDirective } from "./MyDirective.ts";
</script>
```

好了，内容大概就是这么多了。感谢你的时间，希望你也能有所收获。

## 参考文献

- [\<script setup>](https://cn.vuejs.org/api/sfc-script-setup.html#reactivity)
- [Vue3 入门指南与实战案例](https://vue3.chengpeiquan.com/)
- [TypeScript with Composition API](https://vuejs.org/guide/typescript/composition-api.html)
