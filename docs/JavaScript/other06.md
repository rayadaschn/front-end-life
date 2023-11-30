---
title: 页面安全之无限 Debugger
icon: javascript
date: 2023-11-29
category:
  - javascript
tag:
  - javascript
---

在访问字节的大语言模型豆包的时候，打开谷歌的开发者工具后发现直接弹出一个无限 Debugger 循环函数：

![无限 Debugger](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202311292052407.png)

这种模式通常是为了防止用户调试页面，以起到安全策略。本文就这个技术是如何实现以及如何破解该安全策略展开一二。

## 基本原理

通常前端页面为了防止用户调试，常用的方式是不断输出 `debugger` 来产生断点。页面之所以可以正常运行是由于 `debugger` 断点只有在控制台被打开时才会执行。

当页面被卡在 `debugger` 断点上时，用户没办法进行调试也就无法查询网页的请求了。

因此可以在网页代码中插入如下安全代码：

```js
/**
 * 基础禁止调试代码
 */
;(() => {
  function ban() {
    setInterval(() => {
      debugger
    }, 50)
  }
  try {
    ban()
  } catch (err) {}
})()
```

## 应对策略

对于这种无限 debugger，实际上是可以解决的。在控制台上断点调试按钮的最右边有一个 `Deactivate breakpoints` 停用断点按钮，按下它便可关闭无线 debugger 了。

![Deactivate breakpoints 按钮](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202311292102838.png)

## 在项目中加入该安全策略

为了让我们的 debugger 代码不是那么的明显（让用户看不出代码执行策略 o(╥﹏╥)o），可以对上述代码进行一定的改造。

### 版本 1

> 通过将 `debugger` 改写成 `Function("debugger")();` 的形式。

利用 Function 构造函数生成一个 debugger 函数，而后再立即执行，来实现。

**原理：**

`Function` 是 JavaScript 中的一个内置构造函数，用于创建新的函数对象。它的语法是：

```javascript
new Function([arg1[, arg2[, ...argN]],] functionBody)
```

- `arg1, arg2, ...argN` 是函数的参数，可以有零个或多个。
- `functionBody` 是一个包含函数定义的字符串，即函数体。

例如：

```javascript
const add = new Function('a', 'b', 'return a + b')
console.log(add(2, 3)) // 输出 5
```

上述代码通过 `Function` 构造函数创建了一个新的函数 `add`，它接受两个参数 `a` 和 `b`，并返回它们的和。

**注意事项：**

1. 使用 `Function` 构造函数创建的函数对象没有词法作用域，它们在全局作用域中创建。这意味着它们无法直接访问它们被创建时所在的作用域的变量。
2. 创建函数的方式有很多种，通常使用函数声明或函数表达式就足够了。`Function` 构造函数通常用于动态生成函数代码，但在绝大多数情况下是不必要的。

**最终代码：**

```js
/** 加密前 */
;(() => {
  function ban() {
    setInterval(() => {
      Function('debugger')()
    }, 50)
  }
  try {
    ban()
  } catch (err) {}
})()

/** 加密后 */
eval(
  (function (c, g, a, b, d, e) {
    d = String
    if (!''.replace(/^/, String)) {
      for (; a--; ) e[a] = b[a] || a
      b = [
        function (f) {
          return e[f]
        },
      ]
      d = function () {
        return 'w+'
      }
      a = 1
    }
    for (; a--; )
      b[a] && (c = c.replace(new RegExp('\b' + d(a) + '\b', 'g'), b[a]))
    return c
  })(
    '(()=>{1 0(){2(()=>{3("4")()},5)}6{0()}7(8){}})();',
    9,
    9,
    'block function setInterval Function debugger 50 try catch err'.split(' '),
    0,
    {}
  )
)
```

### 版本 2

为了让上述代码更加难懂，可以再度丑化。

> 将 `Function('debugger').call()` 改成 `(function(){return false;})['constructor']('debugger')['call']();`

即：

```js
;(() => {
  function block() {
    setInterval(() => {
      ;(function () {
        return false
      })
        ['constructor']('debugger')
        ['call']()
    }, 50)
  }
  try {
    block()
  } catch (err) {}
})()
```

**实现原理：**

在 JavaScript 中，函数是一种特殊的对象，也就是说，函数可以拥有属性。其中，一个属性就是 `constructor`，它指向创建该函数的构造函数，通常是 `Function`。

现在，让我们详细解释为什么在这个代码片段中使用 `('debugger')` 会创建一个包含 `debugger;` 语句的新匿名函数。

1. `(function(){return false;})`：这是一个匿名的自执行函数，它返回 `false`。这个函数是一个普通的 JavaScript 函数。

2. `['constructor']`：通过使用数组访问语法，我们获取了上面函数对象的 `constructor` 属性。这个属性指向函数对象的构造函数，通常是 `Function`。

3. `('debugger')`：现在，我们调用了 `Function` 构造函数，它的参数是字符串 `'debugger'`。在 JavaScript 中，`Function` 构造函数接受一系列字符串作为参数，并创建一个新的函数。在这个例子中，我们传递了字符串 `'debugger'`，这个字符串包含了一个 JavaScript 语句，即 `debugger;`。

4. `['call']`：通过数组访问语法，我们获取了上一步创建的新函数的 `call` 方法。`call` 方法是 JavaScript 中函数对象的一个方法，它允许我们调用一个函数，并设置函数体内的 `this` 值。

5. `()`：最终，我们通过调用 `call` 方法，执行了这个新创建的函数，并且由于它的函数体是 `debugger;`，所以 `debugger;` 语句被执行。

好了，由此得到了一个不是很能一眼看懂的安全代码块，当然还可以在此基础上增加其它内容，如当窗口外部宽高和内部宽高的差值大于一定的值 ，可以将 body 里的内容换成指定内容，以此防止用户“偷窥”。

**最终代码：**

```js
;(() => {
  function block() {
    if (
      window.outerHeight - window.innerHeight > 200 ||
      window.outerWidth - window.innerWidth > 200
    ) {
      document.body.innerHTML = '检测到非法调试,请关闭后刷新重试!'
    }
    setInterval(() => {
      ;(function () {
        return false
      })
        ['constructor']('debugger')
        ['call']()
    }, 50)
  }
  try {
    block()
  } catch (err) {}
})()
```

## 其它方法

有没有其它更直接的方法？答案是有的，[console-ban](https://github.com/fz6m/console-ban)，实际上开头的豆包也是使用的这个库。

使用方法非常简单：

```bash
$: npm install console-ban
```

而后在 `main.js` 中加入：

```js
import { init } from 'console-ban'

init(options)
```

### Options

|    name     | required |       type        | default | description                                                 |
| :---------: | :------: | :---------------: | :-----: | :---------------------------------------------------------- |
|   `clear`   |    no    |      boolean      | `true`  | 禁用 `console.clear` 函数                                   |
|   `debug`   |    no    |      boolean      | `true`  | 是否开启定时 `debugger` 反爬虫审查                          |
| `debugTime` |    no    |      number       | `3000`  | 定时 `debugger` 时间间隔（毫秒）                            |
| `redirect`  |    no    |      string       |   `-`   | 开启控制台后重定向地址                                      |
|   `write`   |    no    | string \| Element |   `-`   | 开启控制台后重写 `document.body` 内容，支持传入节点或字符串 |
| `callback`  |    no    |     Function      |   `-`   | 开启控制台后的回调函数                                      |
|  `bfcache`  |    no    |      boolean      | `true`  | 禁用 `bfcache` 功能                                         |

注：`redirect`、`write`、`callback` 三种策略只能取其一，优先使用回调函数。

笔者则是在 `index.html` 中直接引入:

```html
<head>
  <!-- ... -->
  <script src="https://cdn.jsdelivr.net/npm/console-ban@5.0.0/dist/console-ban.min.js"></script>
  <script>
    ConsoleBan.init({
      debug: true, // options 开启 debugger 模式
    })
  </script>
</head>
```

便可以达到豆包的效果。其它效果如重写 `body` 则可使用 `write` options 改写成自己想要的 body。

总体来说 [console-ban](https://github.com/fz6m/console-ban) 还是很好用的。推荐 👍🏻

## 参考文章

- [《禁止别人调试自己的前端页面代码》](https://juejin.cn/post/7262175454714626108?searchId=20231129095552A38D1FFBA67A7DCC8404)
