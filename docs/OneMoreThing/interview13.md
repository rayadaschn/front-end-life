---
title: Interview -- 算法
icon: note
date: 2023-08-31
category:
  - anonymous
tag:
  - note
star: false
# sticky: true
sticky: false
---

总述算法的一些常见考题和常见数据结构等。

## 常见数据结构

### 栈 Stack

栈是先进后出的一种数据结构。

![栈](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202308310907807.png)

```js
const stack = []
stack.push('xxx') // 压栈
stack.pop() // 出栈
```

### 队列 Queue

队列是先进先出的一种数据结构。

![队列](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202308310909775.png)

```js
const queue = []
queue.push('xxx') // 入队
queue.shift() // 出队
```

### 链表 Linked list

链表不是连续的数据结构，而是由一些列的节点组成，各个节点之间通过指针连接。

![链表](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202308310912878.png)

```ts
interface IListNode {
  data: any
  next: IListNode | null
}
```

### 树 Tree

树，是一种有序的层次结构，每个节点下面都可以有若干个子节点。常见的树有 DOM 树。

![树](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202308310915590.png)

```ts
interface ITreeNode {
  data: any
  children: ITreeNode[] | null
}
```

### 二叉树

二叉树，是树的一种特殊结构，它的每个节点最多只有只有俩个，分别为 left 和 right。

![二叉树](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202308310917757.png)

```ts
interface IBinaryTreeNode {
  data: any
  left: IBinaryTreeNode | null
  right: IBinaryTreeNode | null
}
```
