---
title: Vue3中的懒加载
icon: vue
date: 2023-03-18
category:
  - 框架
tag:
  - Vue
star: true
sticky: false
---

# Vue3 中的懒加载

## 1. 动物园里有什么?

我们都知道前端项目完成之后，需要对页面进行优化。首当其冲的便是优化首页加载速率，方法有很多，我们来看看其中重要的一项**懒加载**。

顾名思义，懒加载，就是加载页面的时候不是同步全部加载完成，而是在需要的时候进行加载。由此，产生俩个定义：**同步组件**和**异步组件**。

**同步组件**就是在页面打包时，组件会同所有代码一同打包到一个文件中。体积大了，加载的速率也就慢了。使用很简单，调用时直接静态 `import` 导入就行了，导入对象在加载时就被编译（无法做到按需编译，降低首页加载速度）。当然也不是没有好处的，**静态导入能够更好的初始化依赖，而且更有利于静态分析工具和 [tree shaking](https://developer.mozilla.org/zh-CN/docs/Glossary/Tree_shaking) 发挥作用。所以不是必要情况，优先使用静态导入。**

**异步组件**，由于是按需加载，所以导入时需要用到动态函数 `import()`。这种方式下的关键字 `import` 可以像调用函数一样来动态导入模块。并且，这种方式，将返回一个 `Promise`。

```js
import("/modules/my-module.js").then((module) => {
  // Do something with the module.
});
```

## 2. 把大象装进冰箱

知道了定义，那在 Vue3 中如何使用呢？

由于动态加载多用于首屏优化，所以我们以 `router` 路由加载举例。分为 `webpack` 和 `vite`。

在路由中同步组件加载：

```ts
// 同步组件
import home from "@views/home.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: home,
  },
];
```

在 `Webpack` 中，我们是这样使用的：

```typescript
// 异步组件
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "@views/home.vue"),
  },
];
```

其中，懒加载的配置便是在 `component` 中设置的，通过设置一个箭头函数，来动态加载。而 `import` 内部注释 /_ webpackChunkName: "home" _/ 起到的作用是项目打包后为切割后的代码文件命名（结果更加语义化）。

```txt
File                                        Size                    Gzipped

dist\static\js\chunk-vendors.23code666.js    137.27 KiB              48.66 KiB
dist\static\css\home.2023cd88.css           0.13 KiB                0.13 KiB
dist\static\css\app.no996life.css            0.04 KiB                0.06 KiB
```

再来看看 `vite`打包是怎么实现的。Vite 作为一个打包工具，如果直接用 `import()` 做懒加载，在打包到生产环境会报错，页面不会正常显示。为此，在 Vue3 中，新增了一个全新 API：`defineAsyncComponent`。顾名思义，就是显示声明一个异步组件。所以在 `router` 中如下使用：

```js
// 异步组件: Vue3通用方法
import { defineAsyncComponent } from "vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => defineAsyncComponent(() => import(`@views/home.vue`)),
  },
];
```

也非常简洁，当然为了更好的提议，`Vite`还提供了特殊导入方法 `import.meta.glob` ，从文件系统导入多个模块。

```js
const modules = import.meta.glob("./dir/*.js");
```

以上将会被转译为下面的样子：

```js
// vite 生成的代码
const modules = {
  "./dir/foo.js": () => import("./dir/foo.js"),
  "./dir/bar.js": () => import("./dir/bar.js"),
};
```

你可以遍历 `modules` 对象的 `key` 值来访问相应的模块：

```js
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod);
  });
}
```

匹配到的文件默认是懒加载的，通过动态导入实现，并会在构建时分离为独立的 `chunk`。

所以最终在路由中，可以这样做：

```typescript
// 异步组件: vite 打包 import.meta.glob 方法
import { defineAsyncComponent } from "vue";
const modules = import.meta.glob("@views/*.vue"); // 导入所有 vue 组件,返回对象, key 为路径名称

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: modules[`@views/home.vue`],
  },
];
```

以上，便是 3 种懒加载的方案了。

到这里，我们已经可以实现常用的懒加载方案了，有什么实际的应用？可以看看《[Vue3 中的动态路由懒加载实例](Vue3中的动态路由懒加载实例.md)》。

感谢你的时间，也希望你能有所收获。

## 参考文献

- [Import](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import)
- [Glob 导入](https://cn.vitejs.dev/guide/features.html#glob-import)
