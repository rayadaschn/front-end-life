---
title: 高效开发 之命名规范
icon: note
date: 2023-08-19
category:
  - anonymous
tag:
  - note
star: false
# sticky: true
sticky: false
---

## 文件命名

- 路由组件: 通常放置于 `src/views` 下，一般情况下以单个名词或动词进行命名。对于一些需要用多个单词才能描述的资源，可以使用 kebab-case 短横线风格命名。

  ```ts
  // src/router/routes.ts
  import type { RouteRecordRaw } from 'vue-router'

  const routes: RouteRecordRaw[] = [
    // 面对面栏目
    {
      path: '/face-to-face',
      name: 'face-to-face',
      component: () => import('@views/face-to-face.vue'),
    },
  ]

  export default routes
  ```

- 公共组件: 通常放置于 `src/components` 下，也可以视不同的使用情况，在路由文件夹下创建属于当前路由的 components 目录，作为一个小范围共享的公共组件目录来管理，而 src/components 则只存放全局性质的公共组件。

  公共组件一般采用 PascalCase 帕斯卡大驼峰命名。这在 VSCode 里可以得到不同颜色的高亮效果。

- types 文件, 通常放置于'src/types'目录作为管理公共类型, 统一使用`.ts`作为拓展名管理。而不是用`.d.ts`作为类型声明文件，好处是可以通过 `import type`显示导入。

## 代码变量命名

变量**只采用 camelCase 小驼峰进行命名**，并且依据不同类型，搭配不同的命名前缀和后缀。

- 对于 string 字符串类型，使用相关的名词进行命名；
- 对于 number 数值类型，除变量本身可以代表数字的名词（如 age、second）外，还可以搭配**后缀命名**，常用的有 **Count**、**Number**、**Size**和**Amount** 等相关单位；
- 对于 boolean 布尔值类型，除常见可以表示状态的形容词（如 disabled、visible）外，还可以搭配 **is**、**has** 等 Be 动词进行**前缀命名**；

  > **is** 是为了同函数进行区分，如`showDialog()`是像是弹窗的方法，而 `isShowDialog`才是一个 boolean 类型逻辑判断。

- 对于 array 数组类型，通常采用名词复数形式，或者名词后面加上 **List** 结尾作为命名后缀。
- 对于 function 函数的命名，**只采用 camelCase 小驼峰风格**。但是需要区分是否为异步。

  获取数据的函数，通常采用 `get` 、 `query` 、 `read` 等代表会返回数据的动词作为前缀，如果还是觉得很难确定使用哪一个，可以统一使用 `get` ，也可以根据函数的操作性质来决定：

  - 如果是**同步操作**，不涉及接口请求，使用 `get` 作为前缀
  - 如果是需要从 API 接口查询数据的**异步操作**，使用 `query` 作为前缀
  - 如果是 Node.js 程序这种需要进行文件内容读取的场景，就使用 `read`

  **修改数据的函数**，通常采用 `save` 、 `update` 、 `delete` 等会变更数据的动词作为前缀，一般情况下：

  - 数据存储可以统一使用 `save`
  - 如果要区分新建或者更新操作，可以对新建操作使用 `create` ，对更新操作使用 `update`
  - 删除使用 `delete` 或 `remove`
  - 如果是 Node.js 程序需要对文件写入内容，使用 `write`
  - 表单验证合法性等场景，可以使用 `verify` 或 `check`
  - 切换可见性可以用 `show` 和 `hide` ，如果是写在一个函数里，可以使用 `toggle`
  - 发送验证码、发送邮件等等可以使用 `send`
  - 打开路由、打开外部 URL 可以使用 `open`

## Vue 中变量

对于 Composition API，如`ref`，为了显示区分此为 ref 类型响应式变量，可对变量增加后缀`Ref`:

```js
import { ref } from 'vue'

const numberRef = ref(0)
```

## 参考文件

- [Vue3 入门指南与实战案例](https://vue3.chengpeiquan.com/efficient.html#%E5%91%BD%E5%90%8D%E6%8A%80%E5%B7%A7)
