---
title: React 基础语法
icon: react
date: 2023-03-20
category:
  - 框架
tag:
  - React
star: true
sticky: false
---

# React 基础语法

> 今天开始学习 Reac 系列，先从最基本的语法入手。
>
> 本文的 React18 为基础学习（和早期版本略有不同），参考文档为[官方文档](https://react.dev/learn)。

## 开发依赖

开发 React 必须依赖三个核心库：

- react：包含 react 所必须的核心代码，包含 React Web 和 react-native 所共同拥有的代码；
- react-dom：react 渲染在不同平台所需要的核心代码，针对 web 和 native 所完成的事情不同：
  - web 端：react-dom 会将 jsx 最终渲染成真实的 DOM，显示在浏览器中；
  - native 端：react-dom 会将 jsx 最终渲染成原生的控件（如 Android 中的 Button，IOS 中的 UIButton）。
- babel：将 jsx 转换为 React 代码的转换工具，可以将 ES6 等高级语法转换为大多数浏览器都支持的 ES5 语法。默认情况下，React 开发式不需要 babel 的，但是这时需要我们用 `React.createElement` 来编写代码，导致代码较为臃肿，且可读性较差。所以为了直接上手 jsx（JavaScript XML 语法），我们借助 babel 来帮助我们将 jsx 代码转换 `React.createElement`。

为了引入这三个核心依赖，通常有三种方法：

- 直接 [CDN](https://legacy.reactjs.org/docs/cdn-links.html) 引入;
- 将核心库下载后，在本地添加导入依赖；
- 通过 npm 等包管理。

我们先用 cdn 引入，看如何创建一个最小的 React Demo。

```HTML
<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```

> 注意，这里有一个`crossorigin`的属性，这个属性的目的是为了解决跨域脚本的错误信息。

## Hello World

创建一个 Hello World demo:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React 基础模版</title>
  </head>
  <body>
    <div id="root"></div>
    <script
      src="https://unpkg.com/react@18/umd/react.development.js"
      crossorigin
    ></script>
    <script
      src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"
      crossorigin
    ></script>
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

    <script type="text/babel">
      ReactDOM.render(<h2>Hello World</h2>, document.querySelector("#root"));
    </script>
  </body>
</html>
```

以上代码中，除去导入的 CDN 核心库外，我们定义了一个 id 为 root 的空节点，并用 `ReactDOM.render` 创建了一个 h2 DOM，挂载到这个空节点上。

> 注意:这里我们编写 React 的 script 代码中，必须添加 `type="text/babel"`，作用是可以让 **babel** 解析 **jsx** 的语法。

这样的链式形式，也较为复杂。因此，React 为我们提供了俩个 API：

- `React.createElement` ： 用于创建一个 **React 根** ，之后渲染的内容会包含在这个根中。该函数会返回一个 `root` 根;
- `render` 函数: 将 `root`根渲染出来。

最终代码：

```html
<div id="root"></div>
<script type="text/babel">
  const root = ReactDOM.createRoot(document.querySelector("#root"));
  root.render(
    <div>
      <h2>Hello World</h2>
      <button>按钮</button>
    </div>
  );
</script>
```

## 组件化

以上代码，整个逻辑其实可以看做一个整体，那么我们就可以将其封装成一个组件。也可以说，`root.render` 渲染的参数是一个 HTML 元素或者一个组件。所以，在 React 中可以先将业务逻辑封装到一个组件中，然后传入`ReactDOM.render` 函数中的第一个参数中去，进行渲染。

那如何封装一个组件呢？在 React 中我们通常是定义一个类，继承自 **`React.Component`**。这个类中包含 data 数据、函数/方法 和 render 函数而后用 `root.render`渲染这个组件。最终代码如下:

```html
<div id="root"></div>
<script type="text/babel">
  class App extends React.Component {
    // 组件数据
    constructor() {
      super();
      this.state = {
        message: "World",
      };
    }

    // 组件方法
    btnClick() {
      this.setState({
        message: "React",
      });
    }

    // 渲染内容
    render() {
      return (
        <div>
          <h2>Hello {this.state.message}</h2>
          <button onClick={this.btnClick.bind(this)}>修改文本</button>
        </div>
      );
    }
  }

  const root = ReactDOM.createRoot(document.querySelector("#root"));
  root.render(<App />);
</script>
```

以上代码有较多注意点:

- 我们用大驼峰 App 创建了一个类，并且继承自`React.Component`，此时我们可以将这个类当做一个组件。由于有继承关系，所以我们要在 `constructor`中用 `super` 继承父类中的属性方法；

- 在 React 中，数据需要定义在构造函数中的 `this.state` 里，修改则需要用 `this.setState`，这点和小程序很像；

- **重点**： 定义的函数方法，在调用时为何需要 `bind` 绑定。

  ```js
  // 调用的形式实际等同如下
  btnClick() {
    console.log(this)
  }

  const bar = btnClick()
  bar() // 严格条件下打印 undefined
  ```

  在正常的`DOM`操作中，监听点击，监听函数中的`this`其实是节点对象(比如说是`button`对象)，因为`React`并不是直接渲染成真实的`DOM`，我们所编写的`button`只是一个语法糖，它的本质`React的Element`对象。当发生监听的时候，`react`在执行函数时并没有绑定`this`，默认情况下就是一个`undefined`。

- 在 `jsx` 中，编写变量要用 `{}` 大括号括起来，vue 中是双大括号。

## JSX

JSX 是一种 JavaScript 的语法扩展(**extension**)，也在很多地方称之为**JavaScript XML**，因为看起就是一段 XML 语法。简单的说就是能在 JavaScript 中书写 XML 语法，而不会报错。

### 书写规范

- 和 Vue 的 Template 模版语法一样，JSX 的顶层**只能有一个根元素**，所以我们很多时候会在外层包裹一个 div 元素或者 Fragment（后续提及）；
- 通常在 jsx 的外层包裹一个小括号`()`，这样可以方便阅读，并且 jsx 可以进行换行书写;
- JSX 中的标签可以是单标签，也可以是双标签;

### 注释方式

在 JSX 中，注释方式不同于 js 或者 xml，而是二者的结合。将 XML 的注释放在大括号中，使得最终编译出来的结果能够在 XML 中显示未 XML 注释形式：

```jsx
{
  /* --- 注释 --- */
}
```

### 大括号包裹变量

jsx 用大括号包裹变量。

- 当变量是 Number、String、Array 类型时，可以直接显示；
- 当变量是`null`、`undefined`、`Boolean`类型时，内容为空。若想显示可以用 `String(undefined)`进行转换，以字符串的形式显示。当然也可以用 toString、同空字符串拼接等形式；
- 注意，jsx 可以自动解析数组，但是**Object 对象类型不能作为子元素**(not valid as a React child)。
- 在大括号中可以嵌入表达式：
  - 运算符表达式，如 `+`、`-`、`*`、`/`等；
  - 也可以书写一个三元运算符，或者用 `&&` 且 `||` 或运算，形式如同 JavaScript；
  - 也可以执行一个函数，推荐使用箭头函数。这样无需额外的绑定 `this`。

> 为什么当变量是`null`、`undefined`、`Boolean`类型时，内容为空?
>
> 后面会介绍到，当我们要渲染一个组件时，可以用变量是否存在来决定要不要渲染该组件。
>
> ```jsx
> {
>   !!Data && <Home infoData={Data} />;
> }
> ```
>
> 这里需要注意，如果是一个对象，则可对其键名个数进行判断，该变量是否存在：
>
> ```js
> function isEmptyObj(obj) {
>   return !!Object.keys(obj).length;
> }
> ```

### JSX 绑定属性

- XML 的基本属性绑定，如 `title`和`src`等；

- 需要注意的是元素的 `class` 属性，由于 `class` 是 JavaScript 中的类关键词，为了避免歧义最好使用 `className` 进行绑定，为此需要额外引入第三方库 **classname**；

- 此外，在利用 `for` 等循环渲染节点的时候，为了提高 `diff` 算法的效率，React 要求为每个节点绑定一个 `key` 属性，这点和 `Vue` 相同。

  ```jsx
  render() {
    const { title, imgURL, href, isActive, objStyle } = this.state

    // 需求: isActive: true -> active
    // 1.class绑定的写法一: 字符串的拼接
    const className = `abc cba ${isActive ? 'active': ''}`
    // 2.class绑定的写法二: 将所有的class放到数组中
    const classList = ["abc", "cba"]
    if (isActive) classList.push("active")
    // 3.class绑定的写法三: 第三方库classnames -> npm install classnames

    return (
      <div>
        { /* 1.基本属性绑定 */ }
        <h2 title={title}>我是h2元素</h2>
        {/*<img src={imgURL} alt=""/>*/}
        <a href={href}>百度一下</a>


        { /* 2.绑定class属性: 最好使用className */ }
        <h2 className={className}>哈哈哈哈</h2>
        <h2 className={classList.join(" ")}>哈哈哈哈</h2>


        { /* 3.绑定style属性: 绑定对象类型 */ }
        <h2 style={{color: "red", fontSize: "30px"}}>呵呵呵呵</h2>
        <h2 style={objStyle}>呵呵呵呵</h2>
      </div>
    )
  }
  ```

### JSX 绑定事件

事件绑定的方法有三种:

- `bind` 绑定，需要注意的是在传参时， `bind`绑定的第一个参数是 `this`；
- 直接传一个执行函数，需要注意的是该函数最好为箭头函数，否则也需要额外绑定；

```jsx
class App extends React.Component {
  // class fields
  name = "App";

  constructor() {
    super();
    this.state = {
      message: "Hello World",
      counter: 100,
    };

    this.btn1Click = this.btn1Click.bind(this);
  }

  btn1Click() {
    console.log("btn1Click", this);
    this.setState({ counter: this.state.counter + 1 });
  }

  btn2Click = () => {
    console.log("btn2Click", this);
    this.setState({ counter: 1000 });
  };

  btn3Click() {
    console.log("btn3Click", this);
    this.setState({ counter: 9999 });
  }

  render() {
    const { message } = this.state;

    return (
      <div>
        {/* 1.this绑定方式一: bind绑定 */}
        <button onClick={this.btn1Click}>按钮1</button>

        {/* 2.this绑定方式二: ES6 class fields */}
        <button onClick={this.btn2Click}>按钮2</button>

        {/* 3.this绑定方式三: 直接传入一个箭头函数(重要) */}
        <button onClick={() => console.log("btn3Click")}>按钮3</button>

        <button onClick={() => this.btn3Click()}>按钮3</button>

        <h2>当前计数: {this.state.counter}</h2>
      </div>
    );
  }
}
```

### 条件渲染

和 Vue 不同的是，在 React 中没有额外的模版语法，都是利用 js 的逻辑进行判断：

```jsx
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      message: "Hello World",

      isReady: false,

      friend: undefined,
    };
  }

  render() {
    const { isReady, friend } = this.state;

    // 1.条件判断方式一: 使用if进行条件判断
    let showElement = null;
    if (isReady) {
      showElement = <h2>准备开始比赛吧</h2>;
    } else {
      showElement = <h1>请提前做好准备!</h1>;
    }

    return (
      <div>
        {/* 1.方式一: 根据条件给变量赋值不同的内容 */}
        <div>{showElement}</div>

        {/* 2.方式二: 三元运算符 */}
        <div>{isReady ? <button>开始战斗!</button> : <h3>赶紧准备</h3>}</div>

        {/* 3.方式三: &&逻辑与运算 */}
        {/* 场景: 当某一个值, 有可能为undefined时, 使用&&进行条件判断 */}
        <div>{friend && <div>{friend.name + " " + friend.desc}</div>}</div>
      </div>
    );
  }
}
```

若想要实现 Vue 中 `v-show`的数据缓存，则可以利用 `style` 本身进行 `display` 语法判断：

```jsx
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      message: "Hello World",
      isShow: true,
    };
  }

  changeShow() {
    this.setState({ isShow: !this.state.isShow });
  }

  render() {
    const { message, isShow } = this.state;

    return (
      <div>
        <button onClick={() => this.changeShow()}>切换</button>
        {isShow && <h2>{message}</h2>}

        {/* v-show的效果 */}
        <h2 style={{ display: isShow ? "block" : "none" }}>哈哈哈哈</h2>
      </div>
    );
  }
}
```

### JSX 的本质

将一段 JSX 代码利用 [babel](https://babeljs.io/repl) 进行转换，结果如下：

![Babel 转换 JSX 代码](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202303252136114.png)

可以看到，在 babel 的帮助下 JSX 中包含 XML 的部分最终转换成了 `React.createElement()` 的形式。因此，可以将 JSX 当做 `React.createElement()` 的语法糖。
