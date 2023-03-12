---
title: JavaScript实用小技巧
icon: javascript
category:
  - javascript
tag:
  - javascript
star: true
sticky: false
---

# JavaScript实用小技巧

> 记录一些 JavaScript 实用的小技巧

- 对象的比较

  由于对象不是常量，所以比较俩个对象是否相同不能用 `===` 全等或是 `==` 比较符进行比较。我们很快可以想到用 `JSON.stringigy()` 函数进行比较。
  ```javascript
  let a = { name: 'Dionysia', age: 29};
  let b = { name: 'Dionysia', age: 29};
  
  console.log(JSON.stringify(a) === JSON.stringify(b)); // true
  ```

  当然，这里依然有局限性，就是键值的顺序问题，并且 `JSON`并不能代表所有的类型，它不能识别 `undefined` ：

  ```JavaScript
  let a = { name: 'Dionysia'};
  let b = { name: 'Dionysia', age: undefined};
  
  console.log(JSON.stringify(a) === JSON.stringify(b)); //true
  ```

  为此，我们的目标比较俩个对象是否相等的要素有：键值对属性一一对应（属性长度）、是否存在嵌套对象？以下是一种较为朴素的解法：

  ```javascript
  function deepEqual(objA, objB) {
    // 俩对象指向同一片内存
    if (objA === objB) return true;
    // 判断是否为对象, 若不为对象且不指向同一片内存,则返回 false
    if (
      typeof objA === "object" &&
      objA !== null &&
      typeof objB === "object" &&
      objB !== null
    ) {
      // 两者均为对象, 开始缩小比较范围
      if (Object.keys(objA).length !== Object.keys(objB).length) {
        return false;
      } else {
        // 长度满足要求, 进行深层次比较
        for (let item in objA) {
          // 对象枚举遍历, 检查是否有对应属性
          if (objB.hasOwnProperty(item)) {
            // 迭代遍历属性 防止其为对象
            if (!deepEqual(objA[item], objB[item])) return false;
          } else {
            return false;
          }
        }
        // 都通过了, 返回 true
        return true;
      }
    } else {
      return false;
    }
  }
  ```

  但是这依旧有问题，为此较好的处理边界的方式是 Lodash 库里的 `_.isEqual()`（或者是 `Underscore`库里的 `_.isEqual()`）。

  





