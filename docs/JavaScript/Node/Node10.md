---
title: 手写简易 Commonjs
icon: nodeJS
date: 2024-11-02
category:
  - javascript
tag:
  - node
---

## CommonJS

### 概念

CommonJS 是一种模块化规范，它允许我们在一个文件中定义模块，然后在另一个文件中引入和使用这些模块。CommonJS 是运行时的这点和 ESModule 不同。

可以简单思考一下，这个文件导出后的结果是什么？

```js
// commonjs 待导出文件
this.a = 1
exports.b = 2
exports = {
  c: 3,
}

module.exports = {
  d: 4,
}

exports.e = 5
this.f = 6
```

结果是 `{d:4}`，通过简单实现 `require` 来更好理解这个想象，下面来简单实现一下。

## 伪代码实现

```js
function require(modulePath) {
  // 1. 根据传递模块路径, 得到模块完整的绝对路径
  var moduleId = getModuleId(modulePath)
  // 2. 根据模块id, 查找缓存中是否已经存在
  if (cache[moduleId]) {
    return cache[moduleId].exports
  }
  // 3. 如果不存在, 真正运行模块代码的辅助函数
  function _require(exports, require, module, __filename, __dirname) {
    // 运行导入的模块代码
    // ...
  }

  // 准备并运行辅助函数
  var module = {
    id: moduleId,
    exports: {},
  }

  var exports = module.exports

  // 得到模块文件的绝对路径
  var __filename = moduleId
  // 得到模块文件所在目录的绝对路径, 通过内置模块 getDirname
  var __dirname = getDirname(__filename)

  // 用 call 绑定 this, 即 exports
  _require.call(exports, exports, require, module, __filename, __dirname)

  // 4. 将运行结果缓存起来
  cache[moduleId] = module.exports

  // 5. 返回模块的导出结果
  return module.exports
}
```

## 验证理解

通过上面的伪代码，可以更好的理解下面的代码导出结果：

```js
// commonjs 待导出文件
this.a = 1
exports.b = 2
exports = {
  c: 3,
}

module.exports = {
  d: 4,
}

exports.e = 5
this.f = 6
```

那么实际上这个文件导出的结果是什么呢？我们来一行一行理解

```js
// 1. 最开始的时候, this 和 exports 都指向 module.exports
console.info(this === module.exports, exports === module.exports) // true true

// 2. this.a = 1, module.exports.a = 1
this.a = 1

// 3. exports.b = 2, module.exports.b = 2
exports.b = 2

// 4. 此时 exports 改变了地址指向，指向了一个新的对象
exports = {
  c: 3,
}

// 5. 此时 exports 和 module.exports 指向的不是同一个对象了, 只有 this 还指向原来的对象。
module.exports = {
  d: 4,
}

// 这个时候三者的状态是:
// this: { a: 1, b: 2}; exports: { c: 3 }; module.exports: { d: 4 }

// 6. 继续改变 exports 和 this 的对象值
exports.e = 5
this.f = 6

// 最终导出的结果是:
// this: { a: 1, b: 2, f: 6 };
// exports: { c: 3, e: 5 };
// module.exports: { d: 4 }

// 从伪代码中可以知道，最终导出的是 module.exports 的值, 浏览器缓存的也是它, 因此该文件的输出为 { d: 4 }
```
