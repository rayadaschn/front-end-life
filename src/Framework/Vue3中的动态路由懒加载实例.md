---
title: Vue3中的动态路由懒加载实例
icon: vue
order: 4
category:
  - 框架
tag:
  - Vue
star: true
sticky: false
---

# Vue3 中的动态路由懒加载实例

在[《Vue 3 中的懒加载》](Vue3中的懒加载.md) 一文中，我们总结了懒加载的实现方式。那懒加载最好用在什么地方呢？其实很常见，如在后台管理系统中，因为权限不同我们需要依据后端返回的数据，展现不同的菜单。菜单不同对应的二级列表路由地址不同，这个时候可不能一股脑的将所有子组件全部注册进去，否则，依据地址我们可以实现越权查看不同权限人的界面。

## 动物园里有什么

我们先来看看我们的需求是什么？

- 依据后端接口返回的数据，筛选出需要注册的二级组件，进行注册；
- 由于是动态加载，我们还需要考虑注册缓存的问题。（即，刷新后依旧能正常展现页面）

采用的方案：

在《[Vue3 中的懒加载](Vue3 中的懒加载.md[) 》一文中，我们有多种懒加载的方法，但是由于我们还是要获取到所有的二级组件，所以，我们选取的 `import.meta.glob` 方案:

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

有了加载组件的方法，我们还需要将组件注册的途径，利用上述显式的在路由中注册当然可行，只是我们当前的需求为动态注册二级子组件，所以我们还需要用到 `router.addRoute`[ API](https://router.vuejs.org/zh/guide/advanced/dynamic-routing.html) 。`router.addRoute` 非常灵活，可以对路由进行添加、删除和嵌套等，我们这里就是用到它的嵌套路由用法：

要将嵌套路由添加到现有的路由中，可以**将路由的 _name_ 作为第一个参数传递给 `router.addRoute()`**，这将有效地添加路由，就像通过 `children` 添加的一样：

```typescript
router.addRoute({ name: "admin", path: "/admin", component: Admin });
router.addRoute("admin", { path: "settings", component: AdminSettings });
```

这等效于：

```typescript
router.addRoute({
  name: "admin",
  path: "/admin",
  component: Admin,
  children: [{ path: "settings", component: AdminSettings }],
});
```

## 把大象装进冰箱

我们先来看看后端给我们的 "大象 🐘" 有哪些数据：

```typescript
const userMenus = [
  {
    id: 1,
    name: "analysis",
    child: [
      {
        id: "1-1",
        name: "overview",
        url: "/main/analysis/overview",
      },
      {
        id: "1-2",
        name: "dashboard",
        url: "/main/analysis/dashboard",
      },
    ],
  },
  {
    id: 2,
    name: "system",
    child: [
      {
        id: "2-1",
        name: "user",
        url: "/main/system/user",
      },
      {
        id: "2-2",
        name: "department",
        url: "/main/system/department",
      },
      {
        id: "2-3",
        name: "menu",
        url: "/main/system/menu",
      },
    ],
  },
];
```

共拥有俩个一级列表和多个二级列表。但是我们的组件可能拥有数十个（假设在`@/router/main/**/*` 目录下），我们通过 `import.meta.glob` 先把它们收集起来：

```typescript
// 收集所有的路由组件
import type { RouteRecordRaw } from "vue-router";

// 导入所有子路由
function loadLocalRoutes() {
  // * 路由对象都在独立的文件中
  // * 从文件中将所有路由对象先读取数组中
  const localRoutes: RouteRecordRaw[] = []; // 收集的所有路由对象
  // 从文件中读取所有 ts 文件
  const files: Record<string, any> = import.meta.glob("@/router/main/**/*.ts", {
    eager: true,
  });

  // 加载路由
  for (const key in files) {
    const module = files[key];
    localRoutes.push(module.default);
  }
  return localRoutes;
}
```

上述返回的 `localRoutes` 就是所有路由对象数组了:

```typescript
// localRoutes 打印结果
[
  0: {path: '/main/analysis/dashboard', component: ƒ}
  1: {path: '/main/analysis/overview', component: ƒ}
  2: {path: '/main/product/category', name: 'category', children: Array(0), component: ƒ}
  ......
]
```

我们可以从打印结果中看到有很多组件是我们不需要的，所以对其进行筛选，`userMenus` 为后端返回的目录数据（具体见上文），我们需要对其进行遍历，获取实际需要的二级路由列表：

```typescript
// userMenus 为后端返回数据
// 依据上文打印的 localRoutes 结果, 将本地的路由中的 path 与 后端返回的目录中的 url 进行匹配
const routes = []; // 最终匹配需要注册的二级路由
for (const menu of userMenus) {
  for (const subMenu of menu.child) {
    const route = localRoutes.find(
      (itemRoute) => itemRoute.path === subMenu.url
    );
    if (route) {
      routes.push(route); // 匹配到路由
    }
  }
}
```

经过上述遍历，我们拿到了最终需要注册的二级路由 `route` ，我们依次对其进行嵌套注册（当然也可以在上述匹配过程直接嵌套注册）：

```typescript
// 嵌套注册在 main 以及路由下
import { useRouter } from "vue-router";

const router = useRouter();
routes.forEach((route) => router.addRoute("main", route));
```

以上，我们就已经完成了动态注册路由的绝大部分工作了。但是，还有一个隐藏 `Bug` ，就是在我们注册的二级路由地址下，我们一旦刷新，则动态加载的组件数据则就没有了。因此，我们还需要将待需要动态注册的路由进行本地缓存，并在页面加载时，进行提取。

## 防止二级路由刷新数据丢失

> `Tips` 需要注意的是，在本地缓存的是后端返回的当前帐户数据，刷新时会对页面进行鉴权。因此，可以假设此方案可行，并且在用户退出时，应当将本地缓存的该数据进行清除处理。

此处的细节较多，请多多检查。以下，给出一种解决方法。

首先，我们要保障数据的安全性，所以在项目中我们会预先在本地缓存 `LOGIN_TOKEN` ，为了简化叙述，我们假设只要本地有 `LOGIN_TOKEN`文件便可通过鉴权，直接访问页面（实际项目中，可能还需要同后端进行校验）。

我们先准备一些封装的函数，将上文中的几个基础功能函数进行封装，便于统一调用，这里我们注意它们各自所在文件，亦可通过函数名进行全文查找。

```typescript
// '@/utils/useMapMenus.ts'
import type { RouteRecordRaw } from "vue-router";

// 导入所有子路由
function loadLocalRoutes() {
  // * 路由对象都在独立的文件中
  // * 从文件中将所有路由对象先读取数组中
  const localRoutes: RouteRecordRaw[] = []; // 收集的所有路由对象
  // 从文件中读取所有 ts 文件
  const files: Record<string, any> = import.meta.glob("@/router/main/**/*.ts", {
    eager: true,
  });

  // 加载路由
  for (const key in files) {
    const module = files[key];
    localRoutes.push(module.default);
  }
  return localRoutes;
}

// 从所有子路由中赛选出最终需要的子路由
export function mapMenusToRoutes(userMenus: any[]) {
  const localRoutes = loadLocalRoutes();
  const routes = []; // 最终筛选出的路由
  for (const menu of userMenus) {
    for (const subMenu of menu.child) {
      const route = localRoutes.find(
        (itemRoute) => itemRoute.path === subMenu.url
      );
      if (route) {
        routes.push(route);
      }
    }
  }
  return routes; // 导出最终需要加载的子路由结果
}
```

这里，再贴出一个使用对数据进行换存封装方法，实际使用可以依据自己的项目来进行：

```typescript
// '@/utils/useCache.ts'
enum CacheType {
  // 枚举是使用 LocalStorage 还是 sessionStorage
  Local,
  Session,
}
class Cache {
  storage: Storage;
  constructor(type: CacheType) {
    // 枚举匹配
    this.storage = type === CacheType.Local ? localStorage : sessionStorage;
  }

  setCache(key: string, value: any) {
    // 设置本地缓存
    value && this.storage.setItem(key, JSON.stringify(value));
  }

  getCache(key: string) {
    // 获取缓存
    const value = this.storage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
  }

  removeCache(key: string) {
    // 删除指定缓存
    this.storage.removeItem(key);
  }

  clear() {
    // 清空缓存
    this.storage.clear();
  }
}

const localCache = new Cache(CacheType.Local);
const sessionCache = new Cache(CacheType.Session);

export { localCache, sessionCache };
```

好了，基本的函数就是以上这几个，我们还需要注意的是，我们请求到的后端数据，我们如何进行处理。

**依据项目不同，处理方法有很多，我们这里先给出适用于本文的部分代码，请务必依据自身项目来进行操作**：

```typescript
// '@/store/login/login.ts'
import { defineStore } from 'pinia'
import { localCache } from '@/utils/useCache'
import { LOGIN_TOKEN } from '@/utils/useConst'
import router from '@/router'
import { mapMenusToRoutes } from '@/utils/useMapMenu'

const useLoginStore = defineStore('loginStore', {
  state: () => ({
    name: '',
    password: '',
    token: '',
    userMenus: <any>[]
  }),
  actions: {
    // 初次登录操作
    loginAction(name: string, password: string) {
      this.name = name
      this.password = password
      this.token = '*******'

      // 1. 设置本地 TOKEN 缓存
      localCache.setCache(LOGIN_TOKEN, this.token)

      // 依据用户信息请求菜单
      // !!! 我们这里直接给出结果, 方便查看 !!!
      this.userMenus = [ // ... 上文的后端数据 ]

      // 2. 依据请求到的菜单数据进行本地缓存
      localCache.setCache('userMenus', this.userMenus)

      // 3. 动态添加路由
      // 依据 mapMenusToRoutes 将后端数据转换为我们需要注册的路由数据
      const routes = mapMenusToRoutes(this.userMenus)
      routes.forEach((route) => {
        router.addRoute('main', route)
      })

      // 跳转首页
      router.push('/main')
    },

    // 再次刷新操作
    loadLocalCacheAction() {
      // 用户进行刷新,默认加载本地缓存数据
      const token = localCache.getCache(LOGIN_TOKEN)
      // .... 还有其它加载,如用户信息等
      const userMenus = localCache.getCache('userMenus') // 动态加载本地缓存的目录
      if (token && userMenus) {
        // 本地有缓存
        this.token = token
        // ... 其它加载
        this.userMenus = userMenus
        const routes: any[] = mapMenusToRoutes(userMenus) // 路由同本地数据进行匹配
        routes.forEach((route) => router.addRoute('main', route)) // 动态挂载
      }
    }
  }
})

export default useLoginStore
```

可以看到，通过这种方法，我们在 `Store` 中添加了一个刷新提取本地缓存数据的方法 `loadLocalCacheAction` 。这个方法应该添加到刷新就会访问的 根目录下的 `main.ts` 文件中，但是直接在 `main.ts` 中使用有点不大优雅，这里我们再进行一个插件封装，在 Vue3 中对插件的封装可以看《[Vue3 中的全局注册](Vue3中的全局注册.md)》一文，此处，我们直接给出结果。

```typescript
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import registerStore from "./store";

const app = createApp(App);
app.use(registerStore); // 注册路由, 代替 pinia

app.use(router);
// app.use(pinia) // 被代替的路由
app.mount("#app");
```

以上，的注意点是 路由注册 (**`app.use(router)`**)需要再 `pinia` (**`app.use(registerStore)`**)之后，否则在刷新时，在没有注册 `pinia` 时，无法正常注册二级路由。

再来看看被替换的 `pinia` :

```typescript
import { createPinia } from "pinia";
import type { App } from "vue";
import useLoginStore from "./login/login";

const pinia = createPinia();

// 刷新时,提取给 pinia 本地缓存
function registerStore(app: App) {
  app.use(pinia);

  // 加载本地数据
  const loginStore = useLoginStore(); // 这里的就是前文中注册的 Store
  loginStore.loadLocalCacheAction(); // 刷新,提前本地数据
}

// export default pinia

// 改为导出 registerStore
export default registerStore;
```

完成，以上就是本地数据防刷新的流程了，我们再来总结一下：

- 对动态加载匹配的注册路由函数进行封装： `loadLocalRoutes` 导入所有路由 和 `mapMenusToRoutes` 匹配子路由；
- 在 LoginStore 中封装刷新加载本地数据的 `loadLocalCacheAction` 操作，内容包括 提取本地数据，注册二级路由；
- 对 `pinia` 进行改造，使得每次刷新数据时，防止 `pinia` 中的数据丢失。同时，在此处动态注册二级路由。

其实流程不多，但是细节较多。多多体会，多多收获。

以上，感谢你的时间，也希望你也能有所收获。
