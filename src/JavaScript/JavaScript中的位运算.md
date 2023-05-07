---
title: JavaScript中的位运算
icon: javascript
category:
  - javascript
tag:
  - javascript
---

# JavaScript 中的位运算

在 **JavaScript** 中, **移位运算**就是对二进制进行有规律低移位。在本篇中, 将要简要总结 **js 位运算** 的常用方法及技巧。在 **算法中的整除和整乘** 常以 **位运算** 代替 **`Math`** 方法，速度确实提升很多。常用的位移运算有三种:

```javascript
<<     //左移
>>     //带符号右移
>>>    //无符号右移
```

## 左移 <<

**左移操作符 (`<<`)** 将第一个操作数向左移动指定位数，左边超出的位数将会被清除，右边将会补零。

- **正、负数相同， 且不区分奇偶:** 左移 **n** 位, 即结果乘以 **2 的 n 次方** ;

  ```javascript
  /** 正数 */
  2 << 1; // 结果为 4
  ((3 <<
    (1 - // 结果为 6
      /** 负数 */
      2)) <<
    (1 - // 结果为 -4
      3)) <<
    1; // 结果为 -6
  ```

## 带符号右移 >>

**右移操作符 (`>>`)** 是将一个操作数按指定移动的位数向右移动，右边移出位被丢弃，左边移出的空位补符号位（最左边那位）。

- **正、负数相同:** 右移 **n** 位, 相当于**整除 n 且 向下取整** , 等同于 `Math.floor( Num/(2^n) )` ;

  【**Tips**】若想要得到 **整除向上取整** 结果, 可以 预先 **给`Num+1`** ： `( (Num+1) >> n )` 等同于 `Math.floor( Num/(2^n) )` ;

```javascript
// 正数
3 >> 1; // 1
4 >> 1; // 2
(((5 >>
  (1 - // 2
    // 负数
    3)) >>
  (1 - // -2
    4)) >>
  (1 - // -2
    5)) >>
  1; // -3
```

> 【**Tips**】需要注意的是, 负数与正数不同, **向上/向下取整** 后结果的大小差异。

## 无符号右移运算符（>>>）

**无符号右移运算符（>>>）**（零填充右移）将第一个操作数向右移动指定（二进制）位数。

- **正数:** 与 **带符号右移运算符(>>)** 无差异。

```javascript
3 >>> 1; // 1
4 >>> 1; // 2
5 >>> 1; // 2
```

**负数:** 与 **带符号右移运算符(>>)** 差异较大, 直接超出数据大小了。**最好不要用 !!!**

```javascript
((-3 >>>
  (1 - // 2147483646
    4)) >>>
  (1 - // 2147483646
    5)) >>>
  1; // 2147483645
```

## 参考文献

- [左移 (<<) - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Left_shift)
- [右移 (>>) - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Right_shift)
- [无符号右移运算符（>>>） - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Unsigned_right_shift)
