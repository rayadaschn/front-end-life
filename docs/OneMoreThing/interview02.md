---
title: Interview -- JS 基础知识
icon: note
date: 2023-07-30
category:
  - anonymous
tag:
  - note
star: false
# sticky: true
sticky: false
---

在此梳理 JS 基础知识的一些问题。

## 目录

1. 值类型和引用类型
2. typeof 运算符
3. 深拷贝

### 值类型 和引用类型

值类型： Number、String、Boolean、Symbol、undefined

引用类型：Object、Array、Null(特殊引用类型、指针指向空地址)、Function(特殊引用类型,但不存储数据,所以没有"拷贝、复制函数"的说法)

### typeof 运算符

作用： 识别所有值类型、识别函数和判断是否是引用类型（不可再细分）

### 深拷贝

步骤:

1. 判断是否为 objec array 类型或者 null, 否则直接返回;
2. 判断是否为数组类型, 若为数组则定义拷贝类型为数组类型,否则为对象类型;
3. 遍历待拷贝数据的非原型属性, 则递归拷贝。（此处无需再判断属性是否为复杂类型，递归中会自行判断）

```js
const obj1 = {
  age: 20,
  name: '小明',
  address: {
    city: '上海',
  },
  tool: ['a', 'b', 'c'],
}

function deepClone(obj) {
  if (typeof obj === 'object' || obj == null) {
    const copyObj = obj instanceof Array ? [] : {} // 也可用 Array.isArray(obj)
    for (let key in obj) {
      // 保证 key 不是原型属性
      if (obj.hasOwnProperty(key)) {
        // 递归调用
        copyObj[key] = deepClone(obj[key])
      }
    }
    return copyObj
  }
  return obj
}
```

### 类型转换

- 字符串拼接

  ```js
  const a = '100' + 10 // '10010'
  const b = '100' - 10 // 90
  const c = true + '10' // 'true10'
  const d = true + 10 // '11'
  ```

  加号会转换为字符串拼接, 减号会转换为数值减法, Boolean 类型则看拼接的类型。

- "=="

  ```js
  100 == '100' // true
  0 == '' // true
  0 == false // true
  false == '' // true
  null == undefined // true
  ```

  > 除用 "== null" 判断 null 或 undefined 类型外, 其余一律用 '==='
  > 'val == null' 相当于 'val === null || val === undefined'，原因在于它们都会转换为 false。
