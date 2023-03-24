---
title: React 基础语法
icon: react
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

开发React必须依赖三个核心库：

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

> 注意:这里我们编写React的script代码中，必须添加 `type="text/babel"`，作用是可以让 **babel** 解析 **jsx** 的语法。

这样的链式形式，也较为复杂。因此，React 为我们提供了俩个 API：

- `React.createElement` ： 用于创建一个 **React根** ，之后渲染的内容会包含在这个根中。该函数会返回一个 `root` 根;
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

以上代码，整个逻辑其实可以看做一个整体，那么我们就可以将其封装成一个组件。也可以说，`root.render` 渲染的参数是一个HTML元素或者一个组件。所以，在 React 中可以先将业务逻辑封装到一个组件中，然后传入`ReactDOM.render` 函数中的第一个参数中去，进行渲染。

那如何封装一个组件呢？在 React 中我们通常是定义一个类，继承自**`React.Component`**。这个类中包含 data 数据、函数/方法 和 render 函数而后用 `root.render`渲染这个组件。最终代码如下:

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

- `重点`： 定义的函数方法，在调用时为何需要 `bind` 绑定。

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

  

  