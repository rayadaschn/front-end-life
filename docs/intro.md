---
title: 转码技术记录
date: 2023-02-30

index: false
icon: note
star: true
---

## 前端技术学习记录

从 2021 年 11 月开始决定转码，不知不觉已经有一年半了，在此记录一下所学的一些技术知识点，以作整体回顾。

## JavaScript

- ⭐️ 基础语法
- ⭐️ 数据类型
  - 值类型
    - 字符串 String
    - 数组 Number
    - 布尔 Boolean
    - 空值 Null
    - 未定义 Undefined
    - Symbol
  - 引用类型
    - 对象 Object
    - 数组 Array
    - 函数 Function
- 函数
- 调用方式
  - ⭐️ 全局调用
  - 构造函数调用
  - ⭐️ 函数方法调用
  - apply
  - call
- ⭐️ 闭包
- 对象
  - 概念
  - this
  - 原型链和继承
  - 常用对象
    - 数字 Number
    - 字符串 String 对象
    - 日期 Date 对象
    - 数组 Array
    - 布尔 Boolean
    - 算数 Math
  - 自定义对象
- 作用域（作用域链）
- ES6+ 新特性
  - let 和 const
  - 变量解构赋值
  - 对象扩展和新增方法
  - Symbol
  - Set 和 Map 数据结构
  - Promise & async / await 异步编程

## CSS

推荐张鑫旭的《CSS 世界》，学习总结：[《CSS 基础》](./CSS/CSSFundamentals)

- ⭐️ 引入方式
  - 行内样式
  - 内部样式表
  - 外部样式表
- ⭐️ 选择器
  - 通用选择器
  - 标签选择器
  - id 选择器
  - class 选择器
  - 属性选择器
  - 派生选择器
    - 后代选择器
    - 子元素选择器
    - 相邻兄弟选择器
  - 组合选择器
  - 伪选择器
  - 选择器优先级
- ⭐️ 属性
  - 单位
    - px
    - em
    - rem
    - vw
    - vh
  - 背景
  - 文本
  - 字体
  - 列表
  - 表格
- ⭐️ 文档流
  - 标准流
  - 浮动流
  - 定位流
- ⭐️ 内联元素 / 块状元素
- ⭐️ 盒子模型
  - content
  - padding
  - border
  - margin
- ⭐️ 定位
  - static
  - absolute
  - fixed
  - relative
  - sticky
- ⭐️ 层叠规则

## 前端基础知识

- HTTP
  - HTTP 请求过程
  - 常见 HTTP 协议
    - HTTP 1.0
    - ⭐️ HTTP 1.1
    - HTTP 2
    - HTTP 3
  - ⭐️ HTTP 请求类别
  - ⭐️ 常见状态码
    - 1xx 信息
    - 2xx 成功
    - 3xx 重定向
    - 4xx 客户端错误
    - 5xx 服务器错误
- ⭐️ HTTPS

- 数据结构：
  1. 数组
  2. 字符串
  3. 队列
  4. 栈
  5. 链表
  6. 集合
  7. 哈希表
  8. 二叉树
- 算法：
  1. 排序
  2. 双指针
  3. 动态规划
  4. 递归
  5. 回溯
  6. 贪心
- ⭐️ Git 版本控制

## 前端工厂化

- ⭐️ 研发流程

  1. 技术选型
  2. 初始化
  3. 开发
  4. 本地测试
  5. 代码提交
  6. 编译、打包、构建
  7. 部署
  8. 集成测试
  9. 发布上线
  10. 监控运维

- Node.JS

  - 包管理工具：

    1. npm
    2. pnpm
    3. yarn

  - 开发框架：
    1. Express
    2. Koa

- 开发框架

  1. Vue
     - Pinia
     - Vue Router
     - Vuex
  2. React
     - React Router
     - React Hooks
     - React Redux
     - styled-components

- CSS 预编译

  1. Sass
  2. Postcss

- 组件库

  1. Ant Design
  2. ElementUI

## 代码质量

- 类型校验

  TypeScript

- 代码检查

  - ESLint
  - StyleLint

- 统一代码风格

  Prettier

- Git 提交规范

  - pre-commit

## 构建工具

- Webpack
- Vite
- Rollup

## 部署/自动化

- Nginx
- husky
- Jenkins
- Github Action

## 服务端渲染 SSR

- [x] Nuxt

## 性能优化

- 代码分割组件化
- 防抖/节流
- 资源压缩：
  - 雪碧图
  - Webp 格式
  - js 代码 terser 丑化
  - Http 压缩
  - .......
- 懒加载
- 预获取
- CDN 内容分发

## 兼容性

- 浏览器兼容
  - CSS
    - Normalize.css
    - Postcss
  - JS
    - Babel
    - Polyfill

## 大前端

- 小程序：
  - 原生微信开发者工具
  - 阿里小程序

## 代码调试

- Chrome Dev Tools
- debugger
- adb logcat

## 其它

- 静态站点构建：Vuepress
