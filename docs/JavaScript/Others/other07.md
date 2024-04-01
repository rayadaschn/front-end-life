---
title: 大话 JSON
icon: javascript
date: 2023-03-24
category:
  - javascript
tag:
  - javascript
---

## 什么是 JSON

JSON 指的是 JavaScript 对象表示法（JavaScript Object Notation）。

JSON 是**轻量级**的文本**数据交换**格式。

这么说可能比较抽象，先总结一下所有编程语言都离不开的三大数据结构：

1. scalar 标量: 由字符串和数字组成;
2. sequence 序列: 有序的标量, 如数组和列表组成;
3. mapping 映射: 无序的键值对, 由键名和键值。

JSON 就是由映射结构组成。相较于 XML 没有过多的标签，JSON 结构更加清晰。

## JSON 语法

1. 字符串用双引号括起来, 映射用冒号隔开 `"name": "Huy"`;
2. 映射集合用 `{}` 包裹 `{"name": "Huy"}`;
3. 并列数据用逗号隔开 `{"name": "Huy", "age": 20}`;
4. 并列数据集合用 `[]` 包裹 `["Huy", "John"]`;
