---
title: 新版 stylelint
icon: javascript
date: 2023-05-27
category:
  - javascript
tag:
  - javascript
---

# 新版 stylelint 的配置

很早就知道了前端代码格式化的几件套了：ESlint、Prettier、Stylelint。ESlint + Prettier 的配合已经非常流行了，但是对于 CSS 等样式进行检测修复的 Stylelint 却没有那么需要了。在项目中也不是必须的，但是对于维护一些老项目还是有用的，在过去的话不推荐的理由：

- ESlint 和 Prettier 已经是会产生冲突，再加入 Stylelint 会让本地配置变得更加复杂，包也变得更加臃肿（因此官方在@15 版本中做了优化配置，不再有冲突配置）；
- 如今更加流行的是 CSS-in-JS ，能利用静态分析优化掉大量冗余的 CSS，减小包的体积；再如 Tailwind 等框架的流行，直接干掉了纯 CSS，Stylelint 也就不需要了。当然，它还是给予了 CSS-in-JS 支持，但是请注意 Stylelint 的版本，@15 已经做了大量的优化，[删除 processors 配置](https://stylelint.io/migration-guide/to-15/#removed-processors-configuration-property)。

总的来说，一般的项目中，ESlint + Prettier 已经足够满足项目需求了，若不是必须，可不做配置（配置项实在是太多了 T^T）。

## 起步

首先要明确自己的项目是老项目，还是新项目。所需要的 Stylelint 的版本是多少，最新的 Stylelint@15 同之前的配置有较大出入！@15 整合了同 Prettier 之间冲突的规则，不再需要扩展 [Prettier 的 Stylelint 配置](https://www.npmjs.com/package/stylelint-config-prettier)，因为应该没有冲突的规则！因此，接下来的配置说明都是基于新版@15 的。并且，由于已经对 Prettier 左右兼容性支持，因此不管项目中是否已经配置安装过了 ESlint + Prettier 都可以直接安装下面的配置入手。

参考文档：[Stylelint 官方文档](https://stylelint.io/)。

基础性配置：

1 . 使用 [npm](https://docs.npmjs.com/about-npm/) 安装 Stylelint 和配置（默认安装最新版）：

```bash
$: npm install --save-dev stylelint stylelint-config-standard-scss
```

2 . 使用以下内容在项目的根目录中创建一个配置文件：`.stylelintrc.json`

```json
{
  "extends": "stylelint-config-standard-scss"
}
```

3 . 对项目中的所有 SCSS 文件运行 Stylelint：

```bash
$: npx stylelint "**/*.scss"
```

[更多好用的插件-Awesome Stylelint](https://github.com/stylelint/awesome-stylelint#readme)。

此时，已经能够对独立的 CSS、SCSS 的代码进行检测了，但是，这还不够，想要让它对项目中不合规的代码进行修复，所以可以在项目中的 package.json 文件中加入以下脚本命令：

```json
"scripts": {
  "serve": "vue-cli-service serve",
  "build": "vue-cli-service build",
  "build:test": "vue-cli-service build --mode test",
  "lint": "eslint --fix --ext .js,.vue src",
+  "lint:style": "stylelint \"src/**/*.(scss|css)\"  --fix",
+  "lint:style-test": "stylelint \"src/**/*.(scss|css)\"  -o > styleReport.txt",
},
```

新增俩个脚本命令：

- “`lint:style`”：对 src 文件夹内的所有 css 和 scss 代码进行检测修复；
- “`lint:style-test`”：对 src 文件夹内的所有 css 和 scss 代码进行检测，并将不合规的结果输出到 styleReport.txt 文件中。

使用方法：同常规命令一样，如在项目终端中键入：`npm run lint:style`，进行样式修复。

## 定制需求

单文件的检测，并不能满足我们的项目需求，如还想让其帮助我们检测修复 `.vue` 格式的代码帮助我们检测修复 css 样式书写的顺序等，此时就要配置其它的插件了。

- stylelint-config-recess-order：一个 Stylelint 配置，它像 Recess 和 Bootstrap 那样对 CSS 属性进行排序。
- stylelint-config-recommended-vue：Stylelint 推荐的可共享 Vue 配置。

1. 在上面的基础上，再将这俩个配置安装：

   ```bash
   $: npm install --save-dev stylelint-config-recess-order stylelint-config-recommended-vue
   ```

2. 在配置文件`.stylelintrc.json` 中新增这俩个配置：

   ```json
   {
     "extends": [
       "stylelint-config-standard",
       "stylelint-config-recess-order",
       "stylelint-config-standard-scss",
       "stylelint-config-recommended-vue"
     ],
     "order/properties-order": [
       "position",
       "display",
       "float",
       "top",
       "right",
       "bottom",
       "left",
       "z-index",
       "overflow",
       "clear",
       "width",
       "height",
       "max-width",
       "max-height",
       "min-width",
       "min-height",
       "padding",
       "padding-top",
       "padding-right",
       "padding-bottom",
       "padding-left",
       "margin",
       "margin-top",
       "margin-right",
       "margin-bottom",
       "margin-left",
       "margin-collapse",
       "margin-top-collapse",
       "margin-right-collapse",
       "margin-bottom-collapse",
       "margin-left-collapse",
       "font",
       "font-family",
       "font-size",
       "font-smoothing",
       "osx-font-smoothing",
       "font-style",
       "font-weight",
       "hyphens",
       "src",
       "line-height",
       "letter-spacing",
       "word-spacing",
       "color",
       "text-align",
       "text-decoration",
       "text-indent",
       "text-overflow",
       "text-rendering",
       "text-size-adjust",
       "text-shadow",
       "text-transform",
       "word-break",
       "word-wrap",
       "white-space",
       "vertical-align",
       "list-style",
       "content",
       "box-shadow",
       "border-radius",
       "transform"
     ]
   }
   ```

   > 注意，需要将 stylelint-config-recommended-vue 放置于末尾，否则可能会不起作用。这是由于配置的读取顺序决定的。

   除新增的配置外，还在其中规定了 css 样式的书写顺序规则 “order/properties-order” ：

   1、定位：`position` `z-index` `left` `right` `top` `bottom` `clip`等。

   2、自身属性：`width` `height` `min-height` `max-height` `min-width` `max-width`等。

   3、文字样式：`color` `font-size` `letter-spacing`, `color` `text-align`等。

   4、背景：`background-image` `border`等。

   5、文本属性: `text-align` `vertical-align` `text-wrap` `text-transform` `text-indent` `text-decoration` `letter-spacing` `word-spacing` `white-space` `text-overflow`等。

   6、css3 中属性：`content`、`box-shadow`、`animation`、`border-radius`、`transform`等

由此，完成了基于 vue 项目的 Stylelint 的配置了，若不是基于 vue，可不用 “stylelint-config-recommended-vue ”的相关配置。

其它需求，可以查看官网的官方推荐。

## 报错查询

做完以上的配置，在项目中编写样式可能发现全是错误，这很正常，因为很多规则还不熟悉，但是没关系，慢慢来，写的多了，自然就熟悉了。但是，来看看如何查询报错信息。

简单的举例：可能在编写类名的时候多种方式混用，如我这样写：`.a_B-c`。

不出意外的出意外了，报错原因：“selector-class-pattern”。

查找方法：在官方文档的 Rules 中查找：[Stylelint Rules](https://stylelint.io/user-guide/rules)。

如上这个“选择器-类-模式”，实际上是规定了类名的编写格式，常用的[命名约定格式](https://stylelint.docschina.org/user-guide/faq/#%E5%A6%82%E4%BD%95%E7%94%A8%E7%9F%AD%E6%A8%AA%E7%BA%BF%E9%9A%94%E5%BC%80-kebab-case-%E7%AD%89%E5%B8%B8%E8%A7%81-css-%E5%91%BD%E5%90%8D%E7%BA%A6%E5%AE%9A%E9%85%8D%E7%BD%AE--pattern-%E8%A7%84%E5%88%99%EF%BC%9F)如下：

- 短横线命名(kebab-case): `^([a-z][a-z0-9]*)(-[a-z0-9]+)*$`
- 小驼峰命名(lowerCamelCase): `^[a-z][a-zA-Z0-9]+$`
- 蛇形命名(snake*case): `^([a-z][a-z0-9]\*)(*[a-z0-9]+)\*$`
- 大驼峰命名(UpperCamelCase): `^[A-Z][a-zA-Z0-9]+$`

找到原因后，自定义自己的规则，还是在配置文件`.stylelintrc.json` 中编写，新增自定义的 rules 规则：

```json
{
  // ....其它配置
  "rules": {
    "selector-class-pattern": "^[a-z][a-zA-Z0-9]+$"
  }
}
```

以上配置，选择了遵循小驼峰拼写式的类选择器。若是要关闭此规则，则直接赋值为 **`null`**。

> 在编写 json 格式时，参考官方文档去进行编写，格式可以这样理解：
>
> 若是配置的参数有顺序，在 json 中用数组形式表示；
>
> 若是复杂、多属性配置用对象形式进行配置。
