---
title: vite 插件
icon: build
date: 2023-08-28

category:
  - 框架
tag:
  - vite
sticky: false
---

vite 生态里面有很多好用的插件，以托尼老师为例，开发出了很多以 "unplugin" 为代表的实用工具。该文简述其中俩款常用插件：`unplugin-auto-import/vite` 和 `unplugin-vue-components/vite`。

俩款插件的共同点都是按需自动导入。

## unplugin-auto-import/vite

[官网 🚪](https://github.com/antfu/unplugin-auto-import#configuration)

这个插件的作用是：根据需要自动导入 Vite，Webpack，Rspack，Rollup 和 esbuild API。支持 TypeScript。

来看个实例:

在 Vue3 开发中，有很多响应式 API 例如 ref 和 computed 等，在每个 vue 文件中，都需要导入方能使用：

```js
import { computed, ref } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
```

但是如果引入了插件`unplugin-auto-import/vite`后，就无需依次导入这些 API 了：

```js
const count = ref(0)
const doubled = computed(() => count.value * 2)
```

可以直接使用，而不会报错。

### 安装使用

1. 安装: `npm i -D unplugin-auto-import`
2. 使用插件:

   ```js
   // vite.config.ts
   import AutoImport from 'unplugin-auto-import/vite'

   export default defineConfig({
     plugins: [
       AutoImport({
         /* options */
       }),
     ],
   })
   ```

在这里面，我们需要在 options 里面对需要全局按需导入的 API 进行注册。 options 有很多配置，这里我们以最常见的进行介绍：

```ts
autoImport({
  imports: ['vue', 'vue-router', 'pinia'],
  dts: 'src/types/declaration-files/auto-import.d.ts',
  eslintrc: {
    enabled: true,
    filepath: './.eslintrc-auto-import.json',
    globalsPropValue: true,
  },
}),
```

- imports: imports 属性为全局按需导入的注册入口，以数组形式定义:

  ```ts
  Options.imports?: Arrayable<ImportsMap | "ahooks" | "@vueuse/core" | "@vueuse/math" | "@vueuse/head" | "mobx" | "mobx-react-lite" | "preact" | "quasar" | "react" | "react-router" | "react-router-dom" | ... 27 more ... | InlinePreset> | undefined
  ```

  一般我们定义为: `imports: ['vue', 'vue-router', 'pinia']` 即可，也可以自定义一些导入，但是可能会影响代码的可读性，所以，我们只对熟知的 API 进行导入。

- dts：自动生成 `.d.ts` 的文件路径。若是我们引用了 ts，则该配置为必填项:

  ```ts
  Options.dts?: string | boolean | undefined
  ```

  依据定义可知，该配置可显式的传入自动生成声明文件的路径；若是传 true 则在当前目录下自动生成；若是 false 则不自动生成。

  我们这里给它固定的类型声明地址：`dts: 'src/types/declaration-files/auto-import.d.ts'`。

- eslintrc: 生成相应的`.eslintrc-auto-import.json` 文件。这个主要是生产全局 eslint 变量名的配置文件。具体可看 [eslint global🚪](https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals)

  ```ts
  Options.eslintrc?: ESLintrc | undefined
  ```

  依据定义可知这里传入的是 eslint 的配置参数，我们自理定义为：启用该全局配置、生成 eslintrc 的文件地址。

### 完整配置

```ts
AutoImport({
  // 转换目标
  include: [
    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
    /\.vue$/,
    /\.vue\?vue/, // .vue
    /\.md$/, // .md
  ],

  // 全局按需导入注册
  imports: [
    // 预设自动导入类
    'vue',
    'vue-router',
    // 自定义自动按需导入类
    {
      '@vueuse/core': [
        // 导入名
        'useMouse', // import { useMouse } from '@vueuse/core',
        // 导入别名
        ['useFetch', 'useMyFetch'], // import { useFetch as useMyFetch } from '@vueuse/core',
      ],
      axios: [
        // 默认导入名
        ['default', 'axios'], // import { default as axios } from 'axios',
      ],
      '[package-name]': [
        '[import-names]',
        // 别名
        ['[from]', '[alias]'],
      ],
    },
    // 示例类型导入
    {
      from: 'vue-router',
      imports: ['RouteLocationRaw'],
      type: true,
    },
  ],
  // 为目录下的默认模块导出启用按文件名自动导入
  defaultExportByFilename: false,

  // 自动导入目录下的模块导出
  // 默认情况下，它只扫描目录下的一级模块
  dirs: [
    // './hooks',
    // './composables' // only root modules
    // './composables/**', // all nested modules
    // ...
  ],

  // 自动生成对应的. d.ts 文件的定义地址
  // 默认为“ ./auto-import. d.ts”
  dts: './auto-imports.d.ts',

  // 是否在 Vue 模板中自动导入
  // see https://github.com/unjs/unimport/pull/15 and https://github.com/unjs/unimport/pull/72
  vueTemplate: false,

  // 自定义解析器，与“ unplugin-vue-Component”兼容
  // see https://github.com/antfu/unplugin-auto-import/pull/23/
  resolvers: [
    /* ... */
  ],

  // 控制自动导入的模块在代码中的位置
  // 当 injectAtEnd 设置为 true 时，自动导入的模块将在其他导入语句的末尾被注入。
  injectAtEnd: true,

  // 生成相应的. eslintrc-auto-import. json 文件。
  // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
  eslintrc: {
    enabled: false, // Default `false`
    filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
    globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
  },
})
```

## unplugin-vue-components/vite

同自动按需导入 API 一样，插件`unplugin-vue-components/vite`为自动按需导入 vue 组件。

例如常规的在父组件中引入子组件是需要先导入子组件的:

```vue
<template>
  <div>
    <HelloWorld msg="Hello Vue 3.0 + Vite" />
  </div>
</template>

<script>
import HelloWorld from './src/components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
  },
}
</script>
```

当我们全局引入该插件后，就无需导入了，全交由 vite 进行处理，所以在一些项目中没有看到子组件的引入便可在 vite 中查看是不是用了这类插件了:

```vue
<template>
  <div>
    <HelloWorld msg="Hello Vue 3.0 + Vite" />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>
```

### 安装

1. 安装: `npm i unplugin-vue-components -D`
2. 使用插件:

   ```js
   // vite.config.ts
   import Components from 'unplugin-vue-components/vite'

   export default defineConfig({
     plugins: [
       Components({
         /* options */
       }),
     ],
   })
   ```

常用 options 的介绍:

```ts
components({
  dirs: ['src/components'],
  extensions: ['vue', 'ts', 'tsx'],
  deep: true,
  directoryAsNamespace: true,
  dts: 'src/types/declaration-files/components.d.ts',
})
```

- dirs：到目录的相对路径来搜索组件，即全局按需导入的组件的存放地址。
- extensions：组件的有效文件扩展名。
- deep：是否搜索子目录。
- directoryAsNamespace：是否允许子目录作为组件的命名空间前缀。
- dts: ts 类型声明地址。同上一样，若是采用了 ts，则该配置可以自动生成相应的类型声明。

完整配置:

```ts
Components({
  // 用于搜索组件的目录的相对路径。
  dirs: ['src/components'],

  // 组件的有效文件扩展名。
  extensions: ['vue'],
  // 搜索子目录
  deep: true,
  // 自定义组件的解析器
  resolvers: [],

  //生成`components.d.ts`的全局声明,
  //也接受自定义文件名的路径
  // 如果安装了typescript包default: true
  dts: false,

  // 允许子目录作为组件的名称空间前缀。
  directoryAsNamespace: false,

  // 是否允许折叠文件夹和组件的使用相同前缀(驼峰敏感)
  // 以防止名称空间组件名称内部的重复。
  collapseSamePrefixes: false,

  // 忽略名称空间前缀的子目录路径
  // 当`directoryAsNamespace: true`时工作
  globalNamespaces: [],

  // 自动导入指令
  // 默认:' true '用于Vue 3， ' false '用于Vue 2
  // Vue 2需要使用Babel进行转换，出于性能考虑，它在默认情况下是禁用的
  // 要安装Babel，运行:' npm install -D @babel/parser '
  directives: true,

  // 在解析之前转换路径
  importPathTransform: (v) => v,

  // 允许组件覆盖具有相同名称的其他组件
  allowOverrides: false,

  // 变换目标的滤波器
  include: [/.vue$/, /.vue?vue/],
  exclude: [/[\/]node_modules[\/]/, /[\/].git[\/]/, /[\/].nuxt[\/]/],

  // Vue版本的项目。如果没有指定，它将自动检测。
  // 取值范围: 2 | 2.7 | 3
  version: 2.7,

  // 只提供库中组件的类型(全局注册)
  types: [],
})
```
