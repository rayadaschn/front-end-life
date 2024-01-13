---
title: Interview -- 综合应用
icon: note
date: 2023-08-12
category:
  - anonymous
tag:
  - note
star: false
# sticky: true
sticky: false
---

## H5 页面如何进行首屏优化?

- 使用 SSR 优化，`Nuxt.js`(Vue) 和 `Next.js`(React)
- App 预获取
- 针对列表页进行分页，默认只展示第一页内容，上滑加载更多
- 图片懒加载 lazyLoad，注意图片尽量设置好尺寸；
- 路由懒加载

## 文字超出省略

**单行文字**省略

```css
#box {
  border: 1px solid #ccc;
  width: 100px;
  white-space: nowrap; /** 不换行 */
  overflow: hidden;
  text-overflow: ellipsis; /** 超出省略 */
}
```

**多行文字**省略

```css
#box {
  border: 1px solid #ccc;
  width: 100px;
  overflow: hidden;
  display: -webkit-box; /** 将对象作为弹性伸缩盒子模型展示 */
  -webkit-box-orient: vertical; /** 设置子元素排列方式 */
  -webkit-line-clamp: 3; /** 显示几行, 超出省略 */
}
```

## 手写一个 getType 函数，获取详细的数据类型

> 常见的类型判断
>
> 1. `typeof`: 只能判断值类型，其他就是 `function` 和 `object。`
> 2. `instanceof`: 需要俩个参数来判断，而不是获取类型。

实现方法: `Object.prototype.toString.call(obj)` 进判断，返回 `[object 数据类型]`。

```js
function getType(x: any): string {
  const originType = Object.prototype.toString.call(x)
  const spaceIndex = originType.indexOf(' ')
  const type = spaceIndex.slice(spaceIndex + 1, -1) // 空格开始, ']' 前结束
  return type.toLowCase()
}
```

## 手写一个 new 对象的过程

创建对象的过程分为 3 步:

1. 创建一个空对象 obj，继承 constructor 的原型；
2. 将 obj 作为 this，执行 constructor，并传入参数；
3. 返回 obj。

```js
function customNem<T>(constructor: Function, ...args: any[]): T {
  // 1. 创建一个空对象 obj，继承 constructor 的原型；
  const obj = Object.create(constructor.prototype)
  // 2. 将 obj 作为 this，执行 constructor，并传入参数；
  obj.apply(obj, args)
  // 3. 返回 obj。
  return obj
}
```

## instanceof 原理是什么, 请用代码表示

原理:

`f instanceof Foo` 表示会随着原型链 `f.__proto__` 向上查找，看是否能够找到 `Foo.prototype`。

核心步骤:

- 排除 null 和 undefined；
- 排除值类型；
- while 循环逐级向上查找，看是否能够匹配到，直至 null。

```ts
/**
 * 手写 instanceof
 */

function myInstanceof(instance: any, origin: any): boolean {
  if (instance == null) return false // 排除 null undefined

  const type = typeof instance
  if (type !== 'object' && type !== 'function') {
    // 值类型
    return false
  }

  let tempInstance = instance // 防止修改 instance
  while (tempInstance) {
    // 向上查找, 最终到 null
    if (tempInstance.__proto__ === origin.prototype) {
      return true
    } else {
      tempInstance = tempInstance.__proto__
    }
  }
  return false
}

// 功能测试
console.log(myInstanceof({}, Object))
console.log(myInstanceof([], Object))
console.log(myInstanceof('', Object))
```

## 手写 bind 函数

核心要点:

- bind 会返回一个新函数，但不会执行；
- 会绑定 this 和部分参数；
- 如果是箭头函数，无法改变 this，只改变参数。

```ts
/**
 * 手写 bind 函数
 * @param context bind 传入的 this
 * @param bindArgs bind 传入的各个参数
 */

// @ts-ignore
Function.prototype.customBind = function (context: any, ...bindArgs: any[]) {
  const self = this // 当前函数本身
  return function (...args: any[]) {
    const newArgs = bindArgs.concat(args) // 拼接参数
    self.apply(context, newArgs)
  }
}

// 功能测试

function fn(this: any, a: any, b: any, c: any) {
  console.info(this, a, b, c)
}

// @ts-ignore
const fn1 = fn.customBind(10)
fn1(20, 30, 40)

// @ts-ignore
const fn2 = fn.customBind(10, 20)
fn2(30, 40)
```

## 手写 call 和 apply

区别于 bind 会返回一个新的函数（不执行），call 和 apply 会立即执行函数。

实现关键点：解决如何在函数执行时绑定 this。

解决方案：利用对象的函数执行的隐式绑定。

```js
const obj = {
  x: 100,
  fn() {
    console.log(this)
  },
}

obj.fn() // 此时 this 指向 obj 本身，隐式绑定。谁调用指向谁。
```

构建顺序:

1. 排除 null ，为全局 globalThis
2. 排除值类型，变为 `new Object()`
3. 利用 Symbol 建立唯一属性，并在调用后取出该属性。

```ts
/**
 * 手写 call
 */
// @ts-ignore
Function.prototype.customCall = function (context: any, ...args: any[]) {
  if (context == null) context = globalThis
  if (typeof context !== 'object') context = new Object(context)

  const fnKey = Symbol()
  context[fnKey] = this // this 为当前函数, 相当于给绑定对象添加了当前 fn 函数属性

  const res = context[fnKey](...args) // 绑定了 this，相当于执行绑定对象函数属性，此时 this 为绑定的对象

  delete context[fnKey] // 清理掉函数属性, 防止污染

  return res
}

// 功能测试

function fn(this: any, a: any, b: any, c: any) {
  console.info(this, a, b, c)
}

// @ts-ignore
fn.customCall({ x: 100 }, 10, 20, 30)
```

手写 apply 则变化较少，直接将传入的参数改为数组即可(默认为空数组)：

```ts
/**
 * 手写 apply
 */
// @ts-ignore
Function.prototype.customCall = function (context: any, args: any[] = []) {
  if (context == null) context = globalThis
  if (typeof context !== 'object') context = new Object(context)

  const fnKey = Symbol()
  context[fnKey] = this // this 为当前函数, 相当于给绑定对象添加了当前 fn 函数属性

  const res = context[fnKey](...args) // 绑定了 this，相当于执行绑定对象函数属性，此时 this 为绑定的对象

  delete context[fnKey] // 清理掉函数属性, 防止污染

  return res
}

// 功能测试

function fn(this: any, a: any, b: any, c: any) {
  console.info(this, a, b, c)
}

// @ts-ignore
fn.customCall({ x: 100 }, [10, 20, 30])
```

## 遍历数组，生成 tree node

```js
const arr = [
  { id: 1, name: 'A', parentId: 0 },
  { id: 2, name: 'A', parentId: 1 },
  { id: 3, name: 'A', parentId: 2 },
  { id: 4, name: 'A', parentId: 3 },
  { id: 5, name: 'A', parentId: 4 },
  { id: 6, name: 'A', parentId: 5 },
]
```

思路：

1. 遍历数组
2. 每个元素，生成 tree node
3. 找到 parentNode，并加入它的 children。

```ts
/**
 * 数组转树结构
 */

interface IArrayItem {
  id: number
  name: string
  parentId: number
}

interface ITreeNode {
  id: number
  name: string
  children?: ITreeNode[]
}

function convert(arr: IArrayItem[]): ITreeNode | null {
  // 用于 id 和 treeNode 的映射
  const idToTreeNode: Map<number, ITreeNode> = new Map()

  let root = null
  arr.forEach((item) => {
    const { id, name, parentId } = item

    // 定义 tree node 并加入 map
    const treeNode: ITreeNode = { id, name }
    idToTreeNode.set(id, treeNode)

    // 找到 parentNode 并加入它们的 children
    const parentNode = idToTreeNode.get(parentId)
    if (parentNode) {
      if (parentNode.children == null) parentNode.children = []
      parentNode.children.push(treeNode)
    }

    // 找到根节点
    if (parentId === 0) root = treeNode
  })

  return root
}

const arr = [
  { id: 1, name: 'A', parentId: 0 },
  { id: 2, name: 'A', parentId: 1 },
  { id: 3, name: 'A', parentId: 2 },
  { id: 4, name: 'A', parentId: 3 },
  { id: 5, name: 'A', parentId: 4 },
  { id: 6, name: 'A', parentId: 5 },
]

const tree = convert(arr)
console.info(tree)
```
