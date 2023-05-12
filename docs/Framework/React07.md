---
title: React之项目实战
icon: react
date: 2023-03-26
category:
  - 框架
tag:
  - React
star: true
sticky: false
---

# React 之项目实战

## 创建项目

创建一个新项目：

```bash
$: npx create-react-app my-app
```

其中，`my-app` 是项目的名称。这个命令会自动创建一个基本的 React 项目，包括开发服务器，Webpack 构建系统和初始文件结构。

## 项目初始化预处理

项目初始化后，还需要进行一番预处理，首先是清除一些不需要的文件。

### 安装依赖

- 样式重置

  ```bash
  # 安装 normalize.css
  $: npm i normalize.css
  ```

  在 `index.js` 中引入 `normalize` : `import "normalize.css"` 。

  此外，还需要自定义重置一些样式，并一同将其引入：

  ```less
  // reset.less
  body,
  button,
  dd,
  dl,
  dt,
  form,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  input,
  li,
  ol,
  p,
  pre,
  td,
  textarea,
  th,
  ul {
    padding: 0;
    margin: 0;
  }

  a {
    color: @textColor;
    text-decoration: none;
  }

  img {
    vertical-align: top;
  }

  ul,
  li {
    list-style: none;
  }
  ```

- 配置 Webpack

  首先介绍一些概念。Create React App (CRA) 是一种快速创建 React 应用程序的工具，它默认提供了一组预配置的 Webpack 和 Babel 配置，并且在开发和构建过程中自动处理大部分细节。然而，在某些情况下，您可能需要修改 CRA 的默认配置，以满足特定的需求。

  以下是一些可以帮助您修改 CRA 配置的方法：

  1. 使用 `.env` 文件：您可以使用 `.env` 文件设置环境变量来覆盖 CRA 的默认配置。例如，您可以将 `PUBLIC_URL` 变量设置为 CDN 或静态资源 URL，或设置其他变量以控制开发、构建和测试行为。
  2. 使用 `react-scripts eject` 命令：该命令会将 CRA 应用程序的所有配置文件暴露出来，并将其复制到应用程序根目录中。这样，您就可以手动编辑配置文件并对其进行更改。但是，执行此命令后，您将**无法回退到 CRA 的默认配置**，因此请确保在执行此操作之前备份您的代码。
  3. 使用 `craco`：`craco` 是 Create React App Configuration Override 的缩写，它允许您使用常规 JavaScript 模块来轻松地覆盖 CRA 配置。使用 `craco`，您可以添加新的 Babel 插件、Webpack 配置等，也可以扩展 CRA 的功能，例如添加 Less 或 Sass 支持、启用 TypeScript 等。

  需要注意的是，尽管 CRA 提供了许多默认配置和工具，但在修改配置时需要小心。错误的配置可能会导致构建失败或应用程序行为不稳定，因此请确保仔细测试您的应用程序并备份代码，以避免潜在的问题。

  这里我们使用第三种方案，使用`craco`，因此先安装一下这个库（注意是安装时依赖）：

  ```bash
  $: npm install @craco/craco -D
  ```

  若是用的 `less` 则还需安装 `craco/less` 的库（需要注意的是 `@craco/craco@7。0` 需要安装 `craco-less@alpha` 的最新版本，可查看[原 Issue](https://github.com/DocSpring/craco-less/issues/102) ）：

  ```js
  $: npm i craco-less@alpha -D
  ```

  而后，再在根目录

  1. 创建 `craco.config.js` 文件：在应用程序的根目录中，创建一个名为 `craco.config.js` 的文件，并使用常规 JavaScript 模块来配置和扩展 CRA。

  例如，如果想添加 Less 支持、配置目录别名等，则可以将以下代码添加到 `craco.config.js` 文件中：

  ```js
  const path = require("path");
  const CracoLessPlugin = require("craco-less");

  const resolve = (pathname) => path.resolve(__dirname, pathname);

  module.exports = {
    // less
    plugins: [
      {
        plugin: CracoLessPlugin,
        options: {
          lessLoaderOptions: {
            lessOptions: {
              modifyVars: {},
              javascriptEnabled: true,
            },
          },
        },
      },
    ],
    // webpack
    webpack: {
      alias: {
        "@": resolve("src"), // 配置 ailas 根目录别名
        components: resolve("src/components"), // 组件目录别名
        utils: resolve("src/utils"), // 自定义工具目录别名
      },
    },
  };
  ```

  在上面的代码中，我们导出了一个包含 `plugs` 和 `webpack`的对象模块。

  但是，为了让上述配置生效还需做如下设置：在 `create-react-app` 的默认配置中，所有的脚本都是由 `react-scripts` 提供的。然而，如果您希望使用 `craco` 来扩展或自定义 CRA 的功能和配置，就需要将 `react-scripts` 替换为 `craco`。

  具体来说，替换 `react-scripts` 为 `craco` 可以让您轻松地覆盖 CRA 的默认配置，并使用常规 JavaScript 模块来自定义和扩展 CRA 的功能。例如，您可以添加新的 Babel 插件、Webpack 配置等等。

  另外，使用 `craco` 后，您需要向每个脚本添加 `craco` 前缀，以便在执行脚本时使用 `craco` 来代替原始的 `react-scripts`。这是因为 `craco` 不会自动替换 CRA 中的脚本，而是在您手动指定它们的情况下才会生效。

  简单的讲就是修改 `package.json` 中的脚本：将 `react-scripts` 替换为 `craco`：

  ```json
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test"
  }
  ```

  如此，项目可以正常引用 `less` 文件了。当然，在项目中为了更好的使用 CSS-in-JS 进行开发，还需要安装`styled-components`，具体介绍用法可看[《React 高阶组件、动画及 CSS》](React03.md)。

  ```bash
  $: npm install styled-components
  ```

- 配置 `jsconfig.json` ：

  `jsconfig.json` 是一个用于配置 JavaScript 项目的文件，它是 TypeScript 的 `tsconfig.json` 文件的非 TypeScript 版本。它可以帮助您在没有使用 TypeScript 的情况下，提供一些类型检查和 IntelliSense 的优秀开发体验。

  `jsconfig.json` 允许您定义 JavaScript 项目中的基本配置，例如：

  - `compilerOptions`: 定义 JavaScript 编译器的选项，例如启用严格模式、指定 ECMAScript 版本等。
    - `target`: 编译后的 JavaScript 代码应该针对哪个 ECMAScript 版本进行优化。
    - `module`: 使用什么模块系统来组织生成的代码。
    - `baseUrl`: 在解析非相对导入时使用的基本路径。
    - `moduleResolution`: 指定如何解析模块导入语句。
    - `paths`: 定义模块名称到模块路径映射的对象，以便在导入时可以简化路径。
  - `jsx`: 指定 JSX 代码的输出方式。
  - `lib`: 要包含在编译过程中的库文件列表。

  通过这些配置，可以让编辑器更好地了解项目的代码，并提供更准确和有帮助的建议和错误检查。与 TypeScript 相比，`jsconfig.json` 不需要任何类型注释或类型文件，而是使用 JSDoc 格式的类型推断来实现类型检查。

  需要注意的是，`jsconfig.json` 仅适用于支持 ES6 模块的代码，如果使用的是 CommonJS 模块，则需要将 `.js` 文件改为 `.cjs` 才能充分利用 `jsconfig.json` 中的配置。

  ```json
  // jsconfig.json
  {
    "compilerOptions": {
      "target": "es5",
      "module": "esnext",
      "baseUrl": "./",
      "moduleResolution": "node",
      "paths": {
        "@/*": ["src/*"]
      },
      "jsx": "preserve",
      "lib": ["esnext", "dom", "dom.iterable", "scripthost"]
    }
  }
  ```

## 安装路由

```bash
# 安装
$: npm i react-router-dom
```

第一步，确认是使用 Hash 还是 History 路由模式，这里本项目在开发阶段使用 Hash 模式，降低部署难度。具体介绍用法可看[《React 之路由管理》](React05.md)。

在根节点外部用 `<HashRouter>`节点包裹：

```jsx
// index.js
<HashRouter>
  <App />
</HashRouter>
```

新建一个管理路由的独立文档 `router/index.js`

```js
// router/index.js
import React from "react";
import { Navigate } from "react-router-dom";

// 懒加载
const Home = React.lazy(() => import("@/views/home"));

const router = [
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  // 其它路由....
];

export default router;
```

同 Vue 中一样为了性能优化，引入懒加载。由于加入了懒加载，组件渲染变成了异步加载，因此还需要对根目录中的根节点加入遮罩，使得在异步组件加载时的等待期间内显示一个自定义的占位符。在组件准备好后，再渲染组件。用法如下（仅做示例）：

```jsx
import React, { Suspense } from "react";

const LazyComponent = React.lazy(() => import("./LazyComponent"));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}
```

在上面的例子中，我们使用 React.lazy 函数来加载一个懒加载组件 `LazyComponent`。在组件的加载期间，我们使用 Suspense 组件来显示一个自定义的占位符 `<div>Loading...</div>`。当组件加载完毕后，Suspense 组件会自动渲染 `LazyComponent` 组件。

> 除了懒加载组件外，Suspense 还可以用于处理其他异步操作，例如数据的异步加载等。例如：
>
> ```jsx
> import React, { Suspense } from "react";
>
> const dataPromise = fetchData();
>
> function App() {
>   return (
>     <div>
>       <Suspense fallback={<div>Loading...</div>}>
>         <DataComponent dataPromise={dataPromise} />
>       </Suspense>
>     </div>
>   );
> }
> ```
>
> 在上面的例子中，我们通过一个名为 `fetchData()` 的异步函数获取数据，然后将数据传递给 `DataComponent` 组件，同时使用 Suspense 组件来显示一个自定义的占位符。在数据准备完毕后，Suspense 组件会自动渲染 `DataComponent` 组件，并将数据作为 props 传递给组件。

## 使用 Redux

本项目直接使用 `@reduxjs/toolkit`，具体介绍用法可看[《React 之数据管理 Redux》](React04.md)。

安装：

```bash
$: npm install @reduxjs/toolkit react-redux
```

在 `sotre/index.js` 中创建 `store` 进行数据管理：

```js
import { configureStore } from "@reduxjs/toolkit";
import homeSlice from "./modules/home";

const store = configureStore({
  reducer: {
    home: homeSlice,
  },
});

export default store;
```

并将不同页面的 `reducer` 独立封装在子文件夹 `modules`中，如 `home`：

```js
// ./moudles/home.js
import { createSlice } from "@reduxjs/toolkit";

const homeSlice = createSlice({
  name: "home",
  initialState: {
    productList: [],
  },
  reducers: {},
});

export default homeSlice;
```

在组件中使用 Redux，利用 `react-redux` 提供的 `<Provider>` 组件，对根节点进行包装，使得所有组件均能访问到该 `store`。

```jsx
// 最终的 index.js
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";

import store from "@/store/index";

import "normalize.css";
import "./assets/css/index.less";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Suspense fallback="loading....">
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </Suspense>
);
```

## 封装 Axios 数据请求

做完基础配置之后，还需要做数据请求的封装，这里使用的是 Axios：

```js
// ./config.js
// 定义一些全局的数据请求 config
export const BASE_URL = process.env.VUE_APP_BASE_URL || "http://localhost:3000";
export const TIMEOUT = parseInt(process.env.VUE_APP_TIMEOUT) || 5000;
```

```js
// request.js
import axios from "axios";
import { BASE_URL, TIMEOUT } from "./config";

class Request {
  constructor(baseURL, timeout) {
    this.instance = axios.create({
      baseURL,
      timeout,
    });

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        if (config.method === "post") {
          const contentType = config.headers["Content-Type"];
          if (
            !contentType ||
            contentType.indexOf("multipart/form-data") === -1
          ) {
            config.headers["Content-Type"] = "application/json";
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  request(config) {
    return this.instance.request(config);
  }

  get(config) {
    return this.request({ ...config, method: "get" });
  }

  post(config) {
    return this.request({ ...config, method: "post" });
  }

  put(config) {
    return this.request({ ...config, method: "put" });
  }

  delete(config) {
    return this.request({ ...config, method: "delete" });
  }
}

const service = new Request(BASE_URL, TIMEOUT);

export default service;
```

以上就是项目开发的事前工作准备了，接下来开始项目主体开发。
