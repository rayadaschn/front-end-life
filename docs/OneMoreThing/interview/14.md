---
title: Interview -- 算法实战
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

> 总述算法的一些常见考题。

## 判断一个字符串是否括号匹配

- 一个字符串 s 可能包含 `{}()[]` 三种括号;
- 判断 s 是否是括号匹配的;
- 如`(a{b}c)`匹配，而`{a(b`或`{a(b}c)`就不匹配。

```ts
/**
 * @description 括号匹配
 * @param str str
 */
function matchBracket(str: string): boolean {
  const length = str.length
  if (length === 0) return true

  const stack = []

  const leftSymbols = '{[('
  const rightSymbols = '}])'

  for (let i = 0; i < length; i++) {
    const s = str[i]

    if (leftSymbols.includes(s)) {
      // 左括号, 压栈
      stack.push(s)
    } else if (rightSymbols.includes(s)) {
      // 左括号, 判断栈顶(是否出栈)
      const top = stack.pop()
      if (!isMatch(top, s)) return false
    }
  }

  return stack.length === 0
}

function isMatch(left: any, right: any): boolean {
  if (left === '(' && right === ')') return true
  if (left === '[' && right === ']') return true
  if (left === '{' && right === '}') return true
  return false
}

console.log(matchBracket('(a)'))
```

## 定义一个 JS 函数，反转单向链表

定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。

```ts
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function reverseList(head: ListNode | null): ListNode | null {
  // 节点少于 2 个
  if (head == null || head.next == null) return head

  let currentList = head,
    preList = null,
    nextList = null

  while (currentList.next !== null) {
    nextList = currentList.next
    currentList.next = preList
    preList = currentList
    currentList = nextList
  }
  currentList.next = preList

  return currentList
}
```
