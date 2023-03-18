---
title: CSS 基本常识
icon: style
category:
  - CSS
tag:
  - CSS

---

# CSS 基本常识

> 三读《CSS 世界》，记录一些基本常识笔记，以便加固理解。
>
> 说是基本常识，实际上还是算内容进阶。

## 基础内容

- **长度单位**
  
  - 相对字体长度单位：`em` 、`rem`、`ch`（字符 0 的宽度）；
  - 相对视区长度单位： `vh`（视高）、`vw`（视宽）。
  
- **选择器**
  
  - 类 选择器：“`.`” 开头；
  - ID 选择器：“`#`” 开头；
  - 属性选择器： 指含有“`[]`”选择器，如 `[title]{}`；
  - 伪类选择器： 指前面有一个英文冒号（`:`）
  - 伪元素选择器： 指前面有一个英文冒号（`::`），如： `::before`、`::after`。
  
- **关系选择器**
  
  - 后代选择器： 空格连接；
  - 相邻后代选择器：`>` 连接；
  - 兄弟选择器：`~` 连接；
  - 相邻兄弟选择器：+连接。
  
- **块级元素**

  `display` 为 `block`、`table`和如 `<li>`元素的 `list-item` 。

  代表: `<div>`、`<p>`、`<table>` 等

  块级元素具有换行特性，可以配合 `clear` 属性清除浮动带来的影响。

  -  `list-item`是标记盒子，专门用于存放圆点和数字这些项目符号。
  - 如行内块 `display：inline-block` ，实际上是由俩个盒子共同组成，一个内部块级的“容器盒子”和一个外部的内联级的外在盒子共同组成。

- **内联元素**

  `display` 为`inline`、 `inline-bloc` 和 `inline-table`。

  如： `<span>`、 `<button>` 、 `<img>` 、`<em>`

  需要注意的是，内联盒子模型中，存在一个幽灵空白节点，在 `line-height` 和 `vertical-align` 影响巨大。
  
  ### 内容区域、内联盒子、行框盒子、包含盒子
  
  - **内容区域(content area)**：是一种围绕文字看不见的盒子，其大小仅受字符本身特性控制，本质上是一个字符盒子（character box）。内容区域的大小与 `font-size` 大小和 `font-family` 相关，与 `line-height` 没有任何关系。
  
  - **内联盒子(inline boxes)**：**每个行内元素会生成一个行内框**，行内框是一个浏览器渲染模型中的一个概念，无法显示出来。内联盒子不会让内容成块显示，而是排成一行。
  
    如：外部包含inline水平的标签(span、a、em、strong等)，则属于内联盒子。如果是个光秃秃的文字，则属于匿名内联盒子。行内框默认等于内容区域，除非设置了padding。
  
  - **行框盒子(line boxes)：** **每一行就是一个行框盒子，每个行框盒子又是由一个一个内联盒子组成**。行框盒子是浏览器渲染模式中的一个概念，无法显示出来。行框高度等于本行中所有行内框高度的最大值。**当有多行内容时，每一行都有自己的行框**。
  
  - **包含盒子(containing box)**：或者准确为**包含块**，**由一行一行的行框盒子组成**，**高度就是单行文本高度的累加**。
  
  ![盒子模型](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/20230318123201.png)
  
- **幽灵空白节点**，内联元素的所有解析和渲染表现就如同每个行框盒子的前面有一个“空白节点”，这个“空白节点”永远透明，不占据任何宽度，看不见也无法通过脚本获取，就如同幽灵一样，但又确确实实地存在，表现如图文本节点一般。

## width 宽度特性

- `width:auto` 特性

  - 充分利用可用空间
  - 收缩与包裹
  - 收缩到最小
  - 超出容器限制

  `width` 宽度是加在 `content box`内容盒子上的。

  包裹性实用案例:

  页面某个模块文字内容是动态的，希望文字较少时居中显示，文字超过一行时局左显示：

  ```css
  /* 方案一 */
  .box {
    text-align: center;
  }
  .content {
    display: inline-block;
    text-align: left;
  }
  ```

  ```css
  /* 方案二 css3 fit-content */
  .content {
    width: fit-content;
    margin: auto;
  }
  ```

  > `fit-content` 相当于紧身裤，内容多宽，盒子就多宽。
  >
  > 优点: 保留了 `display` 的计算值，让尺寸有了确定的值。

- `box-sizing: border-box` 

  `width` 的宽度最终是施加于 `content box` 内容盒子上。影响盒子的大小可以用 css3 中的 `box-sizing` 改变，或者用 “宽度分离” ，在外部增加一个设置宽度确定的父级元素。

  一般而言，需要重置 `width` 宽度的为：

  ```css
  input, textarea, img, video, object{
    box-sizing: border-box;
  }
  ```

## height 高度特性

- 百分比%

`width` 宽度就算父元素 `width:auto` ，其百分比也是支持的。但是对于 `height` ，百分比高度必须其父级有一个可以生效的高度值！

> 为何父元素高度不指定，子元素的百分比无法渲染计算？这是由浏览器渲染原理造成的。
>
> 浏览器首先，先下载文档内容，加载头部样式资源。然后，**按照从上而下、自外而内的顺序渲染 DOM 内容。即，先渲染父级元素，后渲染子集元素。**
>
> 对于宽度而言，父级元素是先以子元素的占位宽度为加载宽度的，等到子元素渲染时，`width：100%`，便会继承该宽度，多元素宽度叠加超过了父元素宽度，则造成溢出。
>
> 对于高度而言，父级元素的高度没有显示指定（高度由内容决定），并且该元素不是绝对定位，则计算值为 `auto`，因此，子元素的高度用 百分比无法计算。

解决办法:

1. 设定显示高度值；
2. 使用绝对定位。绝对定位的宽高百分比是基于 `padding box`，非绝对定位则是基于 `content box`。

`min-width`、`min-height` 初始值是 `auto`；`min-width`、`min-width`初始值是 `none`。

它们的覆盖值超越 `!important` 。

应用实例，点击按钮，高度动画展开：

```css
.element{
  max-height: 0;
  overflow: hidden;
  transition: max-height .25s;
}
.element.active {
  max-height: 100px;
}
```

> 注意，此处的展开高度应设置的足够小。在回收缩放的时候，使得延迟难以察觉。

## 替换元素 和 非替换元素

替换元素的定义是通过修改某个属性值呈现的内容就可以被替换的元素。如： `<img>`、`<video>`、`<iframe>`和表单元素`<textarea>`和`<input>`都是替换元素。

替换元素的特性：

- 内容的外观不受页面上的 CSS 影响；
- 拥有自己的尺寸，可能为 0；
- 在很多 CSS 属性上拥有自己的一套表现规则：`vertical-align` 非替换元素为字符`x`的下边缘，而替换元素的基线为元素的下边缘。

**替换元素和非替换元素之间只隔了一个 CSS `content`属性。**

- 替换元素之所以可以替换，就是其拥有 `content`属性，这个属性替换的内容为 `content box`。

  ```css
  img:hover {
   content: url(xxx.png); 
  }
  ```

- `content`属性改变的仅仅是视觉呈现。所以保存图片时，保存的还是原来的 `src`所对应的图片。

- `content` 生成的文本是无法选中、复制的，就如同设置了 `user-select：none` 声明一般。

- 不能左右 `:empty` 伪类。

- `content` 动态生成值无法获取。

## 盒子模型

### padding 较为温和

- 在默认情况下，`css`的盒子里 `box-sizing:content-box`，所以 `padding` 会增加元素的尺寸。

- 对于非替换元素的内联元素，`padding` 和 `margin` 不会加入行盒子的高度计算。

- `padding` 垂直和水平的百分比是基于 `width` 宽度。

  若是在块级特性上，`padding` 的百分比还有一个特性，就是会断行。

### margin 较为激进

`padding`负责内间距，而 `margin` 负责外间距。俩者差别较大：

- `margin` 的尺寸实际上相当于“空间”。所以它可以是负值，模块向内裁剪了。

- 需要注意的是： 对于普通流体元素，`margin` 只能改变元素的水平方向尺寸；对于具有拉伸特性的绝对定位元素，则水平或垂直方向都可以，此时符合“充分利用可用空间”原则。

  ```css
  /* 图片左侧, 右侧文字 */
  .box { overflow: hidden; }
  .box > img { float: left; }
  .box > p { margin-left: 100px; }
  ```

  ```css
  /* 除去行内块最后一块的 margin 间距 */
  .box { margin-left: -20px; }
  .box > li {
    float: left;
    width: 100px;
    margin-right: 20px; /* 最后一个会有 margin 间距 */
  }
  ```

  ```css
  /* 双栏瀑布流 */
  .box { ovewflow: hidden; }
  .box-content-right,
  .box-content-left{
    margin-bottom: -9999px;
    padding-bottom: 9999px;
  }
  ```

  解释一下，**双栏瀑布流**：`margin-bottom: -9999px` 意味着元素的外部尺寸在垂直方向上小了 `-9999px` 。默认情况下，垂直方向块级元素上下距离为0，一旦`margin-bottom: -9999px` 就意味着后面所有元素和上面元素的空间距离变成了 `-9999px` ，也就是后面的元素都向上移动了 `9999px`。此时，通过 `padding-bottom: 9999px` 增加元素高度，这正负一抵消，对布局层并无影响，但却带来了 **视觉层 `9999px` 高度的可使用的背景色** 。但是这里的 `9999px` 背景实在是太大了，所以父级用 `ovewflow: hidden` 把多出来的色块背景隐藏掉了，于是实现了视觉上的等高布局效果。

  缺点：子元素如果需要定位到容器之外的地方，父级的 `ovewflow: hidden` 是一个棘手的限制；其次，当触发锚点定位或者使用 `DOM.scrollIntoview()` 方法时，可能会出现奇怪的定位问题。

- `margin` 的百分比值，**无论是水平方向还是垂直方向都是相对于宽度计算的**。

- `margin` 存在合并效果，这点也和 `padding` 不同。

  发生条件： **块级元素 并且 只发生在垂直方向。**

  合并规则： “正正取大值”、“正负相抵消相加”、“负负最负值”。

- `margin: auto` 非常好用!!!，**`margin: auto` 的填充规则**:
  - 如果一侧定值，一侧 `auto`，则 `auto` 为剩余空间大小;
  - 如果俩侧都是 `auto`，则平分剩余空间。

### border 边框

- `border-width` 不支持百分比

- `border-style`，默认为 `none`。因此，单独设置以下样式是无边框的：

  ```css
  div { border: 10px; }
  div { border: red; }
  ```

  需要加 `border-style: solid` :

  ```css
  div { border: 1px solid; }
  ```

- `border-color` 在没有指定颜色时，会默认使用当前元素的 `color` 计算值作为边框颜色。类似特性在 `outline`、`box-shadow`、`text-shadow` 都有类似特性。

- 透明边框可以增加点击区域：

  ```css
  .icon {
    width: 10px;
    height: 10px;
    border: 10px solid transparent;
  }
  ```

- 三角形绘制:

  ```css
  /* 倒三角形 */
  div {
    width: 0;
    border: 10px solid;
    border-color: #f30 transparent transparent;
  }
  ```


## 最难内联元素

块级元素负责结构，而内联元素负责内容。

`display` 计算值为 `inline`、`inline-block`、`inline-table` 或 `inline-cell` 的元素；

常见内联元素: `<span>` 、`<strong>` 、`<em>` ; 常见替换元素: `<img>` 、`<button>` 、`<input>` 。

### 俩大难点：`line-height`和`vertical-align`

#### `line-height` 内联元素高度之本

- 对于非替换元素的纯内联元素，其可视高度完全由 `line-height` 决定。

  `line-height` 的高度由固定高度（行距）和不固定高度（`font-size`）决定。

  行距就是文字之间的间隔，计算公式：**`行距 = line-height -font-size `** 。

- `line-height` 默认值在各个浏览器中的值不一样。其最终高度值同 `font-size` 相关，**若为数值 一般建议为 1.5**。

  计算公式: **`line-height最终高度 = line-height数值 * font-size `** 。

  也可以为百分比值，但百分比值的所有子元素继承的是计算结果的最终值，不会同数值一样，依据自身 `font-size`变化。

  也可以为长度具体值， 如 15px。

- `line-height` 对块级元素本身没有任何作用，实质是通过改变块级元素里的内联级元素占据的高度而变化的。

- 需要注意的是每个行框盒子外部都有一个宽度为 0 ，表现形式都如同字符的“幽灵节点”。

  因此，`line-height` 还有一个[大值特性]([行高内联元素“大值特性”演示 » CSS世界demo演示 (cssworld.cn)](https://demo.cssworld.cn/5/2-6.php)) ：

  ```html
  <div class="box box1">
      <span>span: line-height:20px</span>
  </div>
  <div class="box box2">
      <span>span: line-height:20px</span>
  </div>
  ```

  ```css
  .box {
      width: 280px;
      margin: 1em auto;
      outline: 1px solid #beceeb;
      background: #f0f3f9;
  }
  .box1 { line-height: 96px; }
  .box1 span { line-height: 20px; }
  .box2 { line-height: 20px; }
  .box2 span { line-height: 96px; }
  ```

  以上，俩个 `.box` 的行高都是 `96px` ，原因就是幽灵节点，高度也是 `96px`，而`行框盒子`的高度是由最高的那个内联盒子觉得，所以最终 `.box` 的行高也是 `96px`。

关于 `line-height` 的几个误区:

- 误区 1: “要想让单行文字垂直居中，只要设置 `line-height` 大小和 `height`高度一样就行了。” 其实，当然从效果上看确实如此。（原理：行高等于盒子高度，中间内容天然垂直居中显示）但是这句话也存在误导，只需要设置 `line-height` 就行了（盒子高度由行高决定）。

  ![误区 1](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/20230318125852.png)

- 误区 2: “行高控制文字垂直居中，不使用于多行”。实际上，多行也可以。（准确是说近似居中，如微软雅黑文字会略微下沉）多行垂直居中的原理和单行的不同，需要借助 **`vertical-align`** 。原理如下：

  多行文字用一个标签包裹起来，然后设置 `display: inline-block`。好处在于既能重置外部的 `line-height`为正常大小，又能保持内联元素 特性，从而可以设置 `vertical-align: middle` （只对内联元素有效），并且会带来一个幽灵空白节点，有了这个幽灵节点，可以让行高 `line-height` 有了作用对象，从而相当于在盒子外部撑起了一个高度与父元素相当的内联元素。

  并且，内联元素默认基线对齐，所以，可以达到想要的结果。

  ![误区 2](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/20230318131410.png)

#### `vertical-align` 

**`vertical-align`** 用来指定行内元素（inline）或表格单元格（table-cell）元素的垂直对齐方式。它只对行内元素、表格单元格元素生效，**不能用它垂直对齐块级元素**。

取值：`top` 和 `bottom` 对齐边缘为行框盒子； `baseline` 和 `middle` 对齐为字符 x 。

**作用前提: 只能应用于内联元素以及 `display` 值为 `table-cell` 的元素。**

`vertical-align` 同 `line-height` 的关系：`vertical-align` 的百分比值由 `line-height` 决定， `line-height` 同 `font-size` 相关。因此，`font-size` 越大，字符的基线等也会随之变化。

带来的影响，如图片底部留有空隙的问题：任意一个块级元素，里面若有图片，则块级元素高度基本上都要比图片的高度高。原理就是“幽灵空白节点”、“line-height” 和“vertical-align” 的共同作用。

![图片底部空隙](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/20230318132718.png)

[解决办法](https://demo.cssworld.cn/5/3-5.php):

- 图片块状化。`display: block`
- 容器 `line-height` 足够小。如 `line-height:0`
- 容器 `font-size` 足够小。`line-height`和 `font-size`相关，因此可以设置 `font-size: 0`
- 图片设置其它 `vertical-align` 值，可以设置成 `top`、`middle`和 `bottom`中的任意一个。

注意点：**`vertical-align` 的属性默认值为 `baseline` 在文本之类的内联元素就是字符 `x` 的下边缘，对于替换元素则是替换元素的下边缘。但是，如果是 `display: inline-block` 元素，规则要复杂一些：**

- 一个 `display: inline-block` 元素，如果里面没有内联元素，或者 `overflow` 不是 `visible` ，则该元素的基线就是其 `margin` 底边缘；否则，其**基线就是元素里面最后一行内联元素的基线**。

[20px 图标文字对齐办法](https://demo.cssworld.cn/5/3-7.php)：

- 图标高度和当前行高都是 20px；
- 图标标签里面永远有字符；
- 图标 CSS 不使用 `overflow: hidden` ，保证基线为里面字符的基线，但是要让里面潜在的字符不可见。

```css
.icon {
    display: inline-block; 
    width:20px; height:20px; 
    white-space: nowrap; 
    letter-spacing: -1em; /* 字符间隔 */
    text-indent: -999em; /* 隐藏文字 */
}
.icon:before {
    content:'\3000'; /* 图标里面有文字,此处为空格 */
}
```



**最终应用： 水平垂直居中弹窗**

```html
<div class='container'>
  <div class='dialog'>占位内容</div>
</div>
```

```css
.container {
  background: pink;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0,0,0,.5);
  text-align: center;  /* 弹窗水平居中*/
  white-space: nowrap;
  font-size: 0; /* 压缩中心点 */
  z-index: 99;
}

/* 借助伪元素创建了一个和外部容器一样高的,宽度为0的 inline-bolck 元素。类似于“幽灵空白节点” */
.container:after {
  content: "";
  display: inline-block;
  height: 100%;
  vertical-align: middle; /* inline-bolck 元素，中心点垂直居中 */
}
.dialog {
  display: inline-block;
  vertical-align: middle; /* 弹窗元素也垂直居中, 不设置此,则只是近似垂直居中 */
  font-size: 14px;
  text-align: left;
  white-space: normal;
}
```

关键原理：`vertical-align: middle` 定义了元素的中线和字符 x 中心点对齐。在上述中，`container`容器设置了 `font-size: 0` ，所以 x 中心点位置就是 `container` 的上边缘，此时，高度 100% 的宽度为 0的伪元素和这个中心点位置对齐。如果中心点位置不动，这个伪元素的上半部分位置应该在容器的外部（好好理解一下这句话），但是 CSS 中默认是左上角排列对齐。所以伪元素和这个原本在容器上边缘的 x 中心点一起往下移动了半个容器高度。也就是说，此时x 中心点就在容器的垂直中心线上。

其次， 弹窗元素也设置了 `vertical-align: middle` ，此时弹窗的垂直中心位置和 x 中心点位置对齐。x 中心点就在容器的垂直中心位置。于是弹窗和容器的垂直中心就对齐了。
