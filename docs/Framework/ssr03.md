---
title: Nuxt3 之基础入门
icon: nuxt
date: 2023-06-11

category:
  - 框架
tag:
  - ssr
star: false
sticky: false
---

# Nuxt 3 之基础入门

## 路由

不同于常规的 Vue 项目是以 `index.js` 为项目的入口文件，Nuxt 将 `App.vue` 作为文件入口点，并为应用程序的每个路由展示内容。这是 Nuxt 的一个核心特性是文件系统路由器。`pages/` 目录中的每个 Vue 文件都会创建一个相应的 URL(或路由)来显示文件的内容。

> 路由的嵌套:
> 路由的嵌套则直接是文件夹形式：pages 文件夹下新建子文件夹。

1. 路由的占位：

   同 Vue 一样，Nuxt 也是通过路由占位切换不同的页面。在 Vue 中是通过 `RouterView` ，而 Nuxt 为 `NuxtPage`。

2. 路由的切换:

   通常在 Nuxt 中是通过 `<NuxtLink>` 组件在它们之间链接页面。它呈现一个 `<a>` 标记，其中 href 属性设置为页面的路由。

   当然可以通过 `navigateTo` 或者 `useRouter` 等函数式编程进行路由切换，但是这不利于 SEO 的解析。此时效果等同于 SPA 。

3. 路由参数 params:

   通过 `useRoute` 可以获取路由参数。

   ```js
   <script setup>
     const route = useRoute() // 当访问 /posts/1, route.params.id 值为 1
     console.log(route.params.id)
   </script>
   ```

4. 导航守卫: 中间件 Middleware

   在 Nuxt 中有一个中间件 Middleware 的概念。实际上就是导航守卫的作用。使用流程如下：

   - 创建 middleware 文件

     在 Nuxt 项目中，在 `middleware` 目录下创建一个新的 JavaScript 文件。该文件将包含所有的 middleware 代码。例如，可以创建一个名为 `auth.js` 的新文件：

     ```js
     // auth.js
     export default function ({ store, redirect }) {
       // 如果用户未经身份验证，则重定向到登录页面
       if (!store.state.auth.loggedIn) {
         return redirect('/login')
       }
     }
     ```

     在上面的代码中，我们定义了一个名为 `auth` 的 middleware，用于确保用户已经登录。如果用户未经身份验证，则该函数将使用 `redirect` 方法将用户重定向到登录页面。

   - 注册 middleware

     在 Nuxt 中，可以在路由配置对象或页面组件中注册 middleware。例如，可以在 `nuxt.config.js` 文件中为全局路由注册 middleware：

     ```js
     export default {
       router: {
         middleware: ['auth'],
       },
     }
     ```

     在上面的代码中，我们将 `auth` middleware 注册为全局路由 middleware。这意味着每个路由都将使用该 middleware。

     此外，我们还可以在路由配置对象或页面组件中注册 middleware。在页面组件中注册 middleware：

     ```js
     // page/xxx.vue
     export default {
       middleware: ['auth'],
     }
     ```

     在上面的代码中，我们将 `auth` middleware 注册为该页面组件的 middleware。这意味着该页面将使用该 middleware。

   - 使用 middleware

     现在，当用户访问需要身份验证的页面时，middleware 将运行并检查用户是否已经登录。如果用户未经身份验证，则 middleware 将将用户重定向到登录页面。

     这就是使用 middleware 的基本步骤。你可以使用 middleware 完成许多任务，例如身份验证、页面初始化、请求处理、性能指标跟踪等。在编写 middleware 时，请记住将其注册到正确的路由或页面上，并在 middleware 函数中执行必要的逻辑。

## 生命周期

Nuxt 的生命周期，全交由 Hooks 进行管理，先梳理一下：

| Hook                     | Arguments           | Environment     | Description                                                                                                      |
| :----------------------- | :------------------ | :-------------- | :--------------------------------------------------------------------------------------------------------------- |
| `app:created`            | `vueApp`            | Server & Client | 创建初始`vueApp` 实例时调用。                                                                                    |
| `app:error`              | `err`               | Server & Client | 发生致命错误时调用。                                                                                             |
| `app:error:cleared`      | `{ redirect? }`     | Server & Client | 发生致命错误时调用。                                                                                             |
| `app:data:refresh`       | `keys?`             | Server & Client | (internal)                                                                                                       |
| `vue:setup`              | -                   | Server & Client | (internal)                                                                                                       |
| `vue:error`              | `err, target, info` | Server & Client | 当 vue 错误跳转到根组件时调用。[了解更多](https://vuejs.org/api/composition-api-lifecycle.html#onerrorcaptured). |
| `app:rendered`           | `renderContext`     | Server          | 在 SSR 渲染完成时调用。                                                                                          |
| `app:redirected`         | -                   | Server          | 在 SSR 重定向之前调用。                                                                                          |
| `app:beforeMount`        | `vueApp`            | Client          | 在安装应用程序之前调用，仅在客户端调用。                                                                         |
| `app:mounted`            | `vueApp`            | Client          | Vue 应用程序初始化并 mounted 浏览器时调用。                                                                      |
| `app:suspense:resolve`   | `appComponent`      | Client          | 关于 [Suspense](https://vuejs.org/guide/built-ins/suspense.html#suspense) resolved 事件。                        |
| `link:prefetch`          | `to`                | Client          | 当观察到`<NuxtLink>` 被预取时调用。                                                                              |
| `page:start`             | `pageComponent?`    | Client          | 在[Suspense](https://vuejs.org/guide/built-ins/suspense.html#suspense) 等待事件中调用。                          |
| `page:finish`            | `pageComponent?`    | Client          | 调用 [Suspense](https://vuejs.org/guide/built-ins/suspense.html#suspense) resolved 事件。                        |
| `page:transition:finish` | `pageComponent?`    | Client          | 页面转换 [onAfterLeave](https://vuejs.org/guide/built-ins/transition.html#javascript-hooks) 事件.                |

使用方法也很简单:

在 `nuxt.config.ts` 全局生命周期:

```ts
export default defineNuxtConfig({
  hooks: {
    close: () => {},
  },
})
```

在模块中使用:

```js
import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  setup (options, nuxt) {
    nuxt.hook('close', async () => { })
  })
})
```
