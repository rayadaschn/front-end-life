---
title: DOM 梳理
icon: javascript
date: 2024-04-27
category:
  - javascript
tag:
  - node

sticky: false
---

## DOM 是什么？

DOM 全称叫 `Document Object Model`，中文叫文档对象模型。实际上就是一种对象，但是宿主对象。

在 JavaScript 中，有三种对象：

1. 本地对象:
   1. Object、Function、Array、String、Number 和 Boolean；
   2. Error、EvalError、SyntaxError、RangeError、ReferenceError、TypeError、URIError；
   3. 本地对象是 JavaScript 语言内置的，它们提供基本的操作和功能。
2. 内置对象:
   1. Global、Math；
   2. 内置对象是本地对象的一种，它提供了一些基本的操作和功能。
3. 宿主对象:
   1. 宿主对象是运行时环境提供的对象，比如浏览器提供的 window（BOM）、document（DOM） 等对象；
   2. 宿主对象是本地对象的一种，它提供了一些基本的操作和功能。

本地对象和内置对象都是 ECMAScript 规范中定义的内部对象，而宿主对象则是运行时环境提供的，即浏览器提供，所以 DOM 存在兼容性问题。

DOM 存在的意义是，通过浏览器提供的这一套方法去**表示**或**操作** HTML 页面，使得我们可以通过 JavaScript 去操作 HTML 页面。

## DOM 节点

DOM 节点是 DOM 树中的一个节点，它表示文档中的一个元素、文本或注释等。DOM 节点具有以下特征：

1. 每个节点都有一个父节点；
2. 每个节点可以有零个或多个子节点；
3. 每个节点可以有零个或多个兄弟节点；
4. 每个节点都有一个节点类型（NodeType）；

节点选择:

1. document.getElementById()：通过元素的 id 属性获取元素；
2. document.getElementsByTagName()：通过元素的标签名获取元素；
3. document.getElementsByClassName()：通过元素的 class 属性获取元素；
4. document.querySelector()：通过选择器获取元素；
5. document.querySelectorAll()：通过选择器获取所有元素；
6. document.createElement()：创建元素；
7. document.createTextNode()：创建文本节点；

> 值得注意的是，一般不建议直接使用 querySelector 和 querySelectorAll，而建议使用 getElementByTagName 等来获取。原因在于 querySelector 的性能问题，以及它获取的元素并不是实时的。

```js
const queryDivs = document.querySelectorAll('div')
const getPs = document.getElementsByTagName('p')

console.log(queryDivs) // 返回完整列表
console.log(getPs) // 返回完整列表

// 元素删除
queryDivs[0].remove()
getPs[0].remove()

console.log(queryDivs) // 返回依旧是完整列表
console.log(getPs) // 返回删除元素后的列表
```

> 区分元素、元素节点
>
> 像在 document 文档中的 `<div>我是元素</div>` 这样的标签实际上是元素;
> 而元素节点是由元素构造出来的, 并且才会有 nodeName、nodeType、nodeValue 这些属性。
> 即： 元素 div -> 构造函数实例化 `new HTMLDivElement()` 将 div DOM 对象存储到了内存中 --> 并由此产生了 div 节点。
> 此时会有一个现象，当我们操作 `removeChild(div)` 时, 只是删除了节点，但是内存中还是会有这个 DOM 对象。

## 遍历元素节点树

节点包含元素，元素节点就是 DOM 元素。

![DOM 结构树](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202404212133176.png)

节点的类型其实很多，并不止上文所述那么简单。一个子节点可能有如下类型：

- 元素节点：`nodeType` 为 1，`nodeName` 为大写的标签名，`nodeValue` 为 `null`；
- 属性节点：`nodeType` 为 2，`nodeName` 为属性的名称，`nodeValue` 为属性的值；
- 文本节点：`nodeType` 为 3，`nodeName` 为 `#text`，`nodeValue` 为文本内容，注意换行也算文本节点`\n`，可以用 `hasChildNodes()` 来检测；
- 注释节点：`nodeType` 为 8，`nodeName` 为 `#comment`，`nodeValue` 为注释内容；
- 文档节点：`nodeType` 为 9，`nodeName` 为 `#document`，`nodeValue` 为 `null`；

```jsx
{
  /* 
  <li>
    <a>a 标签</a>
    <p>p 标签</p>
    <h1>h1 标签</h1>
  </li> 
  */
}

const li = document.getElementsByTagName('li')[0]
console.log(li.childNodes.length) // 返回结果是 6 !!! 并不是 3, 原因在于还有很多其它的节点, 如 文本等
```

遍历节点树的方法:

- `node.childNodes`：返回子节点列表；
- `node.firstChild`：返回第一个子节点；
- `node.lastChild`：返回最后一个子节点；
- `node.nextSibling`：返回下一个兄弟节点；
- `node.previousSibling`：返回上一个兄弟节点；

```js
const li = document.getElementsByTagName('li')[0]

// 获取第一个子节点
const firstChild = li.firstChild

// 获取最后一个子节点
const lastChild = li.lastChild

// 获取下一个兄弟节点
const nextSibling = li.nextSibling

// 获取上一个兄弟节点
const previousSibling = li.previousSibling

// 获取子节点列表
const childNodes = li.childNodes

console.log(firstChild) // 返回第一个子节点
console.log(lastChild) // 返回最后一个子节点
console.log(nextSibling) // 返回下一个兄弟节点
console.log(previousSibling) // 返回上一个兄弟节点
console.log(childNodes) // 返回子节点列表
```

## 创建节点

创建节点的方法:

- `document.createElement(tagName)`：创建一个元素节点；
- `document.createTextNode(text)`：创建一个文本节点；
- `document.createComment(text)`：创建一个注释节点；

```js
const li = document.getElementsByTagName('li')[0]

// 创建一个元素节点
const a = document.createElement('a')

// 创建一个文本节点
const text = document.createTextNode('a 标签')

// 创建一个注释节点
const comment = document.createComment('注释节点')

// 将元素节点添加到 li 元素中
li.appendChild(a)

// 将文本节点添加到 li 元素中
li.appendChild(text)

// 将注释节点添加到 li 元素中
li.appendChild(comment)
```

:::tip

踩坑点: JavaScript 实际上是对节点进行管理。

如通常用 `document.body.appendChild(div)` 会在文档末尾添加节点，但是若该节点是文档中原本就有的，此时就不是添加了，而是**剪切节点**。

```js
const a = document.getElementsByTagName('a')[0]
const div = document.createElement('div')

div.innerHTML = '<p>第一段新增段落标签</p>'

// 此方法是文档末尾添加 div
document.body.appendChild(div)

// 此方法是剪切节点，即从文档中剪切出来，然后添加到 div 标签中, 因为 a 标签是原来就有的
div.appendChild(a)
```

:::

## 插入节点

```js
parentDiv.insertBefore(newNode, referenceNode)
```

- `parentDiv`：要插入的父节点；
- `newNode`：要插入的节点；
- `referenceNode`：要插入的参考节点。

即在父级 `parentDiv` 节点下的子节点 `referenceNode` 之前插入新的节点 `newN

## 操作元素位置

### 浏览器的怪异模式和标准模式

虽然 ie 已经淘汰了，但是还是可以过一遍。

标准模式和怪异模式的判断方法: [`document.compatMode`](https://developer.mozilla.org/en-US/docs/Web/API/Document/compatMode) 该属性若返回 `CSS1Compat` 则为标准模式，若返回 `BackCompat` 则为怪异模式。实际上就是浏览器在检测是否有 `<!DOCTYPE html>` 标签，若有则使用 W3C 的规范，若无则使用浏览器自己的规范，较老浏览器可能产生怪异模式。

### 可视宽高

**两种模式下的浏览器可视区域尺寸(窗口的宽高)**:

常规: `window.innerWidth/innerHeight`;

IE9/IE8 及以下: `document.documentElement.clientWidth/clientHeight`;

怪异模式: `document.body.clientWidth/clientHeight`。

封装一个获取窗口的宽高方法：

```js
function getViewSize() {
  if (window.innerWidth) {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  } else {
    // 兼容 ie 及 怪异模式
    if (document.compatMode === 'BackCompat') {
      // 怪异模式
      return {
        width: document.body.clientWidth,
        height: document.body.clientHeight,
      }
    } else {
      // IE9/IE8 及以下
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      }
    }
  }
}
```

> 现代浏览器中的 `window.innerWidth/innerHeight` 是视口宽高，还有一个属性是 `window.outerWidth/outerHeight` 会比这个视口宽高大一点，它还包括浏览器的菜单栏、工具栏、滚动条等的大小。

### 查看滚动条距离

常规方法: `window.pageXOffset` 和 `window.pageYOffset`;

IE9/IE8 以下: `document.body.scrollLeft` 和 `document.body.scrollTop`。

> 滚动条的距离是缩放距离, 而不是实际距离！！！值是页面实际滚动的距离。
>
> window.pageYOffset === window.scrollY; // 永远相等

封装一个获取滚动条的距离方法：

```js
function getScrollOffset() {
  if (window.pageXOffset) {
    return {
      x: window.pageXOffset,
      y: window.pageYOffset,
    }
  } else {
    // 兼容 ie 等怪异浏览器，因为下述方法只可用其一，另一值为 0，所以相加判断
    return {
      x: document.body.scrollLeft + document.documentElement.scrollLeft,
      y: document.body.scrollTop + document.documentElement.scrollTop,
    }
  }
}
```

### 整个页面的宽高

常规: `document.body.scrollHeight/scrollWidth`;

兼容写法: `document.documentElement.scrollHeight/scrollWidth`。

> 值得注意的是, 这俩种写法可能都同时存在。

这个 scrollWidth 实际上等于 `widow.innerWidth` + `widow.pageXOffset`，及就是整个页面的实际宽度。

封装方法:

```js
function getScrollSize() {
  if (document.body.scrollWidth) {
    return {
      width: document.body.scrollWidth,
      height: document.body.scrollHeight,
    }
  } else {
    return {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    }
  }
}
```

### 元素相对位置

获取元素位置的方法:

- `element.offsetLeft`：返回元素相对于其**定位父元素**的水平偏移量；
- `element.offsetTop`：返回元素相对于其**定位父元素**的垂直偏移量；
- `element.offsetParent`：返回元素的**定位父元素**；
- `element.offsetWidth`：返回元素的宽度（包括内边距、滚动条和边框）；
- `element.offsetHeight`：返回元素的高度（包括内边距、滚动条和边框）；
- `element.offsetParent`：返回元素的**定位父元素**；

获取元素定位方法:

```js
function getElementPosition(el) {
  let parent = el.offsetParent
  let offsetLeft = el.offsetLeft
  let offsetTop = el.offsetTop

  // 递归向上遍历
  while (parent) {
    offsetLeft += parent.offsetLeft
    offsetTop += parent.offsetTop
    parent = parent.offsetParent
  }

  return {
    left: offsetLeft,
    top: offsetTop,
  }
}
```

### 封装获取元素位置

首先鼠标点击的位置是基于页面左上角的，即：

1. clientX/clientY: 鼠标点击位置相对于**页面**左上角的距离(不包括滚动条距离);
2. pageX/pageY: 鼠标点击位置相对于**页面**左上角的距离，加上滚动条滚动的距离;
3. screenX/screenY: 鼠标点击位置相对于**屏幕**左上角的距离(浏览器在屏幕上也会移动);
4. offsetX/offsetY: 鼠标点击位置相对于**元素**左上角的距离;
5. x/y: 同 clientX/clientY 相同,但火狐浏览器不支持;
6. layerX/layerY: 同 pageX/pageY 相同,但 IE 浏览器不支持;

封装方法:

```js
/** 获取滚动条距离 */
function getScrollOffset() {
  if (window.pageXOffset) {
    return {
      left: window.pageXOffset,
      top: window.pageYOffset,
    }
  } else {
    return {
      left: document.body.scrollLeft + document.documentElement.scrollLeft,
      top: document.body.scrollTop + document.documentElement.scrollTop,
    }
  }
}

function getPagePosition(e) {
  var sLeft = getScrollOffset().left,
    sTop = getScrollOffset().top,
    // 浏览器中页面偏移量, 普通为 8px 像素
    cLeft =
      document.documentElement.clientLeft || document.body.clientLeft || 0,
    cTop = document.documentElement.clientTop || document.body.clientTop || 0

  return {
    x: e.clientX + sLeft - cLeft,
    y: e.clientY + sTop - cTop,
  }
}
```

### 移动元素

基础方法: `window.scroll(x, y)` 和 `window.scrollTo(x, y)` 俩种方法效果一直, 相对于页面原点`(0,0)`移动到指定位置;

还有一个现对于自身位置进行移动: `window.scrollBy(x ,y)`。

判断是否滚动到底部: `window.pageYOffset + window.innerHeight === document.body.scrollHeight`。即可视高度加上滚动条滚动距离为页面高度。

## DOM 间接操作 CSS

先来看一个踩坑点: DOM 是无法直接操作 CSS 样式表的，它操作的是标签 style li 的属性。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .box {
        width: 100px;
        height: 100px;
        background-color: red;
      }
    </style>
  </head>
  <body>
    <div class="box"></div>
    <script>
      const box = document.querySelector('.box')
      console.log('初始 width:', box.style.width) // 返回初始 width: undefined

      box.style.width = '200px' // 更改标签上 style 属性, 变成内联样式
      console.log('内联 width:', box.style.width) // 返回内联 width: 200px
    </script>
  </body>
</html>
```

可以看到，上面的初始 width 返回的是 `undefined`，而更改后的内联样式返回的是 `200px`。

所以 DOM 是无法直接获取操作 CSS 样式表的。

书写 style 的内联样式时，注意事项：

1. 所有属性要用小驼峰格式书写，且值都是字符串;
2. 若是复合值，则进行拆解，分成一个一个的样式;
3. 保留字问题，遇到保留字，则在前面加上 css，并用小驼峰格式书写。如 `oBox.style.float = 'left'` 应当写成 `oBox.style.cssFloat = 'left'`。实际上只有 float 需要如此。

### 查看计算 css 值

方法: `window.getComputedStyle(element, [pseudoElt])`;

参数:

- `element`：要获取计算样式的元素;
- `pseudoElt`：【只读】伪元素，可选参数，传则获取伪元素的样式，不传则返回元素计算后的样式。

返回值: 计算后的样式对象。但 ie8 及以下不支持。

```js
const box = document.querySelector('.box')
const style = window.getComputedStyle(box)

console.log(style.width) // 返回 100px
```

## 封装页面拖拽函数

点击元素后，元素开始移动，直到松开鼠标。

简单实现:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>点击移动</title>
  </head>
  <body>
    <div
      class="box"
      style="
        height: 200px;
        width: 200px;
        background-color: red;
        position: absolute;
        left: 0;
        top: 0;
      "
    ></div>

    <script>
      const box = document.querySelector('.box')

      box.onmousedown = function (e) {
        let x = e.pageX - box.offsetLeft
        let y = e.pageY - box.offsetTop

        document.onmousemove = function (e) {
          box.style.left = e.pageX - x + 'px'
          box.style.top = e.pageY - y + 'px'
        }

        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    </script>
  </body>
</html>
```

封装成函数:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>点击移动</title>
  </head>
  <body>
    <div
      class="box"
      style="
        height: 200px;
        width: 200px;
        background-color: red;
        position: absolute;
        left: 0;
        top: 0;
      "
    ></div>

    <script>
      const box = document.querySelector('.box')

      // box.onmousedown = function (e) {
      //   let x = e.pageX - box.offsetLeft;
      //   let y = e.pageY - box.offsetTop;

      //   document.onmousemove = function (e) {
      //     box.style.left = e.pageX - x + "px";
      //     box.style.top = e.pageY - y + "px";
      //   };

      //   document.onmouseup = function () {
      //     document.onmousemove = null;
      //     document.onmouseup = null;
      //   };
      // };

      function elemDrag(elem) {
        let x = 0
        let y = 0

        elem.addEventListener('mousedown', function (e) {
          e = e || window.event
          x = e.pageX - elem.offsetLeft
          y = e.pageY - elem.offsetTop

          document.addEventListener('mousemove', mouseMove)
          document.addEventListener('mouseup', mouseUp)
          e.stopPropagation()
          e.preventDefault()
        })

        function mouseMove(e) {
          e = e || window.event
          elem.style.left = e.pageX - x + 'px'
          elem.style.top = e.pageY - y + 'px'
        }

        function mouseUp() {
          document.removeEventListener('mousemove', mouseMove)
          document.removeEventListener('mouseup', mouseUp)
        }
      }

      elemDrag(box)
    </script>
  </body>
</html>
```

## textContent 和 innerText 和 innerHTML 的区别

`textContent`、`innerText` 和 `innerHTML` 是用于操作 HTML 元素内容的属性。

1. `textContent`: 这个属性返回指定元素及其所有后代节点的文本内容，而且会保留所有空白和换行符。它不会返回任何 HTML 标签，**只返回纯文本内容**。

2. `innerText`: 与 `textContent` 类似，但是**会考虑** CSS 样式和元素的可见性。如果元素或其祖先元素被设置为 `display: none`，或者元素本身是一个 `<script>` 或 `<style>` 元素，`innerText` 将返回空字符串。与 `textContent` 不同，`innerText` 会忽略隐藏的元素和它们的内容。

3. `innerHTML`: 这个属性返回 HTML 元素的内部 HTML 代码，包括所有子元素、标签和文本内容。通过设置 `innerHTML` 可以动态改变元素的内容，并且可以将 HTML 字符串插入到元素中。

   缺点也很明显，`innerHTML`可能存在安全风险，如果未经过滤的内容被插入到 innerHTML 中，可能导致跨站脚本攻击（XSS）。此外，`innerHTML`操作 HTML 结构可能会导致性能损失(览器需要解析新的 HTML 字符串并将其转换为 DOM 结构，然后重新计算布局和绘制页面。)，特别是在大型文档或频繁操作的情况下。
