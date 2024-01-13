---
title: Interview -- 读代码
icon: note
date: 2023-09-01
category:
  - anonymous
tag:
  - note
star: false
# sticky: true
sticky: false
---

## ['1','2','3'].map(parseInt)

```js
console.log(['1', '2', '3'].map(parseInt))
```

代码最终输出 `[1, NaN, NaN]`。

分析原因：

parseInt 的实际上有俩个参数，第二参数取值为进制，即取 2-36。若省略第二个参数，默认为 10 进制；若第二个参数以 `0x` 开头，则表示 16 进制 `0x2F`。

因此有:

```js
// 转换为:
const num = ['1', '2', '3']
num.map((item, index) => {
  // item1: '1', index: 0 -> 忽略 0 进制，按 10 进制处理
  // item1: '2', index: 1 -> 进制 1 不符合 2-36 进制的范围，即返回 NaN
  // item1: '3', index: 2 -> 进制 2 符合要求，但 2 进制下没有 3，因此依旧返回 NaN
  return parseInt(item, index)
})
```

> 进制 0 是按照不存在处理，即忽略该参数，所以进制变为 10 进制；
>
> 进制 1 是不存在该进制，因此返回结果为 NaN，如: `console.log(['1', '1', '3'].map(parseInt))`
>
> 返回结果依旧为: `[1, NaN, NaN]`

## 函数修改形参，能否影响实参？

```js
function changeArg(x) {
  x = 200
}

let num = 100
changeArg(num)
console.log('changeArg num:', num)

let Obj = { name: '小明' }
changeArg(Obj)
console.log('changeArg Obj:', Obj)
```

结果为都不变：

```log
changeArg num: 100
changeArg Obj: {name: '小明'}
```

关键点: 函数参数是赋值传递。先 let 定义 x，而后将参数 num、Obj 赋值给 x。

> eslint 建议函数参数不要修改，当做常量。

## 对象和属性的连续赋值

```js
let a = { n: 1 }
let b = a
a.x = a = { n: 2 }

console.log(a.x)
console.log(b.x)
```

输出结果为:

```log
console.log(a.x) // undefined
console.log(b.x) // {n: 2}
```

分析原因:

1. 在 js 中，连续赋值的执行顺序为从右到左进行的。这意味着右边的表达式先于左边的表达式进行求值和赋值。

   ```js
   let a = 1
   let b = 2
   let c = 3
   let d

   d = c = b = a
   ```

   - 首先，右侧的表达式 a 被求值，其结果为 1。
   - 然后，右侧的表达式 b = a 被求值，将变量 b 的值设置为 1。
   - 接着，右侧的表达式 c = b 被求值，将变量 c 的值设置为 1。
   - 最后，左侧的表达式 d = c 被求值，将变量 d 的值设置为 1。

2. a.x 的定义属性比赋值的优先级高，即表达式中`a.x = a = { n: 2 }`，需要先定义 `a.x = undefined` 再进行赋值计算。
3. 因此在`a.x = a = { n: 2 }`这个复合赋值语句中，首先执行 `a.x`，但此时 a 还是指向对象 `{ n: 1 }`，所以将对象 `{ n: 1 }` 的属性 `x` 设置为 `undefined`；接着，执行 `a = { n: 2 }`，将变量 `a` 的引用指向新的对象 `{ n: 2 }`；最后将对象 `{n: 1, x: undefined}`的 `x` 属性赋值为对象 `{ n: 2 }`。

## 构造函数和原型的重名属性

```js
function Foo() {
  Foo.a = function () {
    console.log(1)
  }
  this.a = function () {
    console.log(2)
  }
}

Foo.prototype.a = function () {
  console.log(3)
}
Foo.a = function () {
  console.log(4)
}

Foo.a()
const obj = new Foo()
obj.a()
Foo.a()
```

输出结果为：

```log
Foo.a() // 4
const obj = new Foo()
obj.a() // 2
Foo.a() // 1
```

## promise 执行顺序问题

```js
Promise.resolve()
  .then(() => {
    console.log(0)
    return Promise.resolve(4)
  })
  .then((res) => {
    console.log(res)
  })

Promise.resolve()
  .then(() => {
    console.log(1)
  })
  .then(() => {
    console.log(2)
  })
  .then(() => {
    console.log(3)
  })
  .then(() => {
    console.log(5)
  })
  .then(() => {
    console.log(6)
  })
  .then(() => {
    console.log(7)
  })
```

输出结果为:

```log
0 1 2 3 4 5 6 7
```

梳理问题关键：

- 不同的 promise 是“交替执行”，分别插入到微任务队列中；
- 而在 Promise 的 then 中返回 promise 实例，会出现“慢俩拍”的效果；
- 第一拍，promise 需要由 pending 变为 fulfilled；
- 第二拍，then 函数挂载到 MicroTaskQueue。
