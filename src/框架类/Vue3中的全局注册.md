---
title: Vue3中的全局注册
icon: vue
order: 2
category:
  - 框架
tag:
  - Vue
star: true
sticky: false
---

# Vue3 中的全局注册

## 1. 动物园里有什么?

在 `Vue3` 中当我们想用某个功能，并且想要这个能够全局生效时，我们通常会说去安装一个插件。如我们想全局注册 `element-plus` 的 `Icons-vue` 图标组件，我们得在 `main.ts` 内部加入如下代码 [注册所有图标](https://element-plus.gitee.io/en-US/component/icon.html#register-all-icons) ：

```typescript
// main.ts

// if you're using CDN, please remove this line.
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
```

好像有点不大优雅，这个时候我们可能会把它封装成一个函数，让后外部导入进来，然后再执行。不过也有点问题需要解决：得获取到 `createApp()` 当前所创建的应用实例。`Vue` 为我们提供了一种较为优雅的方式： `app.use()` 安装插件。

好，这里我们暂时把上述内容按下不表。我们先来看看什么是插件？ (● ﾟ ω ﾟ ●)

[插件 (Plugins) ](https://cn.vuejs.org/guide/reusability/plugins.html)，Vue 官方的解释是一种能为 Vue 添加全局功能的工具代码。主要运用场景为:

1. 通过 [`app.component()`](https://cn.vuejs.org/api/application.html#app-component) 和 [`app.directive()`](https://cn.vuejs.org/api/application.html#app-directive) 注册一到多个全局组件或自定义指令。
2. 通过 [`app.provide()`](https://cn.vuejs.org/api/application.html#app-provide) 使一个资源[可被注入](https://cn.vuejs.org/guide/components/provide-inject.html)进整个应用。
3. 向 [`app.config.globalProperties`](https://cn.vuejs.org/api/application.html#app-config-globalproperties) 中添加一些全局实例属性或方法
4. 一个可能上述三种都包含了的功能库 (例如 [vue-router](https://github.com/vuejs/vue-router-next))。

好像也不是很懂，没有关系，举个栗子。在 vue 中我们定义的单组件本身也是一个插件，所以我们在父组件中使用它需要用 `components` 进行挂载:

```vue
<template>
  <Child />
</template>

<script lang="ts">
import { defineComponent } from "vue";

// 导入子组件
import Child from "@cp/Child.vue";

export default defineComponent({
  // 挂载组件模版
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

除了这种组件插件外，我们还有一种更为通用的 **`JS/TS`插件**，其实就是我们封装好的 `JS/TS` 独立函数文件。

```vue
<script lang="ts">
import { defineComponent } from "vue";
import md5 from "md5"; // 导入即是挂载

export default defineComponent({
  setup() {
    // 使用
    const md5Msg: string = md5("message");
  },
});
</script>
```

所以，我们可以通过在本地封装组件/JS/TS 插件，也能直接通过 `npm` 下载插件，供项目使用。只不过，这里要注意的是全局使用还是局部使用。局部使用就是如上述所示，我们接下来看看全局插件如何挂载。

## 2. 在全局挂载插件

在全局挂载插件，我们用的最多是在 `main.ts` 上挂载 `pinia` 和 `router`等。这类其实就是 `JS/TS插件`，也是我们用的最多的，当然也有全局引用 UI 组件库的，如`ElementPlus` 等。我们先来看看是如何挂载的：

```ts
// main.ts
import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";

const app = createApp(App);

app.use(ElementPlus); // 挂载
app.mount("#app");
```

我们知道，`createApp` 会返回创建的一个实例应用 `app`，而这个实例上便有 `use` 方法用于挂载全局插件。来看看官方介绍:

```ts
interface App {
  use(plugin: Plugin, ...options: any[]): this;
}
```

第一个参数应是插件本身，可选的第二个参数是要传递给插件的选项。

**插件可以是一个带 `install()` 方法的对象，亦或直接是一个将被用作 `install()` 方法的函数。** 插件选项 (`app.use()` 的第二个参数) 将会传递给插件的 `install()` 方法。

若 `app.use()` 对同一个插件多次调用，该插件只会被安装一次。

```ts
import { createApp } from 'vue'
import MyPlugin from './plugins/MyPlugin'

const app = createApp({
  /* ... */
})

const options = { } // 插件参数
app.use(MyPlugin，options)
```

也就是说，在 Vue 中插件支持导出两种格式的：一种是函数，一种是对象。

- **当导出为一个函数时， Vue 会直接调用这个函数**：

```ts
// 函数形式
export default function (app, options) {
  // 逻辑代码...
}
```

- 当导出为一个对象时，对象上面需要有一个 `install` 方法给 Vue ， **Vue 通过调用这个方法来启用插件**：

```ts
// 对象形式
export default {
  install: (app, options) => {
    // 逻辑代码...
  },
};
```

俩种形式都有两个相同的入参`app`和 `options` :

| 参数    | 作用                     | 类型                                                   |
| ------- | ------------------------ | ------------------------------------------------------ |
| app     | `createApp()` 生成的实例 | Vue3 中 为`App<Element>`                               |
| options | 插件初始化时的选项       | `undefined` 或一个对象，对象的 TS 类型由插件的选项决定 |

“插件选项 (`app.use()` 的第二个参数) 将会传递给插件的 `install()` 方法。”这里的插件选项就是 `options`。

## 3. 自己编写一个插件

我们先来看看简单的函数形式插件，由于拥有 `app` 实例以及当全局挂载后，会自动运行。所以，给开头的封装提供了机会，结合上述函数式插件的表现方式，我们可以有：

```ts
// ./global/register-icons.ts
import type { App } from "vue"; // 导入 App 类型
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 执行的函数, 此处不传 options
function registerIcons(app: App<Element>) {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
}

export default registerIcons;
```

然后在 `main.ts` 中应用就行了。

```ts
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import registerIcons from "./global/register-icons";

const app = createApp(App);
app.use(registerIcons); // 注册全局 Element-icons

app.mount("#app");
```

也许你这里会有困惑，为什么在挂载时直接 `app.use(registerIcons)` 就可以了，我们并没有给它传递参数 `app` 呀。

我们看看 `use` 的 TS 类型定义：

```ts
export declare interface App<HostElement = any> {
  // ...
  use<Options extends unknown[]>(
    plugin: Plugin_2<Options>,
    ...options: Options
  ): this;
  use<Options>(plugin: Plugin_2<Options>, options: Options): this;
  // ...
}
```

这里我们可以看到 `plugin`的定义类型为 `Plugin_2<Options>` ，接着往下看：

```ts
declare type Plugin_2<Options = any[]> =
  | (PluginInstallFunction<Options> & {
      install?: PluginInstallFunction<Options>;
    })
  | {
      install: PluginInstallFunction<Options>;
    };
export { Plugin_2 as Plugin };

declare type PluginInstallFunction<Options> = Options extends unknown[]
  ? (app: App, ...options: Options) => any
  : (app: App, options: Options) => any;
```

我们可以看到，`Plugin_2` 内部会检测是否有 `install` 方法，该方法最终指向 `PluginInstallFunction` 方法，而最终的 `PluginInstallFunction`内部就有用到 `app` 。

不懂也没有关系，对代码的理解交给时间吧。

以上是函数式插件，那我们定义一个对象式插件呢？（自定义的指令就是用对象式来定义哒~）

关于自定义指令可以看《[Vue3 中的 script-setup](Vue3中的script-setup.md)》。

```ts
// src/plugins/directive.ts
import type { App } from "vue";

// 插件选项的类型
interface Options {
  // 文本高亮选项
  highlight?: {
    // 默认背景色
    backgroundColor: string;
  };
}

/**
 * 自定义指令
 * @description 保证插件单一职责，当前插件只用于添加自定义指令
 */
export default {
  install: (app: App, options?: Options) => {
    /**
     * 文本高亮
     * @description 用于给指定的 DOM 节点添加背景色，搭配文本内容形成高亮效果
     * @tips 指令传入的值需要是合法的 CSS 颜色名称或者 Hex 值
     * @example <div v-highlight="`cyan`" />
     */
    app.directive("highlight", (el, binding) => {
      // 获取默认颜色
      let defaultColor = "unset";
      if (
        Object.prototype.toString.call(options) === "[object Object]" &&
        options?.highlight?.backgroundColor
      ) {
        defaultColor = options.highlight.backgroundColor;
      }

      // 设置背景色
      el.style.backgroundColor =
        typeof binding.value === "string" ? binding.value : defaultColor;
    });
  },
};
```

这里我们定义了一个文本高亮的插件，并且给高亮指令一个可选的颜色值。

然后，我们就可以在 `main.ts` 中启用该插件了，并且在启用的过程中，可以进行 `options` 配置默认背景颜色。

```ts
// src/main.ts
import { createApp } from "vue";
import App from "@/App.vue";
import directive from "@/plugins/directive"; // 导入插件

createApp(App)
  // 自定义插件
  .use(directive, {
    highlight: {
      backgroundColor: "#ddd",
    },
  })
  .mount("#app");
```

在 Vue 组件中使用:

```vue
<template>
  <div>根据 highlight 指令的判断规则：</div>
  <div v-highlight="`red`">这个是红色高亮</div>
  <div v-highlight>这个是使用插件初始化时设置的灰色</div>
</template>
```

搞定~ (づ｡◕‿‿◕｡)づ

感谢你的时间，希望你也有所收获。

## 参考文献

- [注册全局组件](https://element-plus.gitee.io/en-US/component/icon.html#register-all-icons)

- [插件](https://cn.vuejs.org/guide/reusability/plugins.html)

- [Vue3 入门指南与实战案例](https://vue3.chengpeiquan.com/)
