---
title: DOM 01
icon: javascript
date: 2023-02-16
category:
  - javascript
tag:
  - javascript

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

即在父级 `parentDiv` 节点下的子节点 `referenceNode` 之前插入新的节点 `newNode`。
