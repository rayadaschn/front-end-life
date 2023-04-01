---
title: React 高阶组件、动画及 CSS
icon: react
category:
  - 框架
tag:
  - React
star: true
sticky: false


---

# React 高阶组件、动画及 CSS

## 高阶组件

**高阶组件（`High-Order Component`）**接受 React 组件作为输入，输出一个新的 React 组件。

- 高阶组件不是组件，是增强函数，可以输入一个元组件，输出一个新的增强组件
- 高阶组件的主要作用是代码复用，操作状态和参数

定义一个高阶组件:

```jsx
import React, { PureComponent } from 'react'

function hoc(Cpn) {
  // 定义类组件
  class NewCpn extends PureComponent {
    render() {
      return <Cpn name="Bob" />;
    }
  }
  return NewCpn;
}
```

上述代码中的 `hoc` 函数可以将被包裹的组件默认设置 `name` 参数。

用途有俩种：

- 属性代理（props proxy），高阶组件通过被包裹的 React 组件来操作 `props`；
- 反向代理（inheritance inversion），高阶组件继承呗包裹的 React 组件。

### 属性代理

**属性代理**（Props Proxy）：输出一个组件，它基于被包裹组件进行 **功能增强**。

```jsx
import React from 'react';

const HighOrderComponent = (WrappedComponent) =>
  class extends Component {
    render() {
      return <WrapperdComponent {...this.props} />;
    }
  };
```

这里的高阶组件中采用了匿名类通过 `render` 方法返回传入的 React 组件（WrappedComponent）。通过高阶组件传递 `props`，这种方式即为 **属性代理**。

这样组件就可以一层层地作为参数被调用，**原始组件就具备了高阶组件对它的修饰**。好处是，在保持单个组件封装性的同时还保留了易用性。

### 其它应用:

- 渲染判断鉴权

  可以利用高阶组件来完成鉴权操作，若无权限则返回登录页:

  ```jsx
  function loginAuth(Page) {
    return props => {
      if (props.isLogin) {
        return <Page />
      } else {
        return <LoginPage />
      }
    }
  }
  ```

- 生命周期劫持

  可以利用高阶组件来劫持生命周期，在生命周期中完成自己的逻辑：

  ```jsx
  function logRenderTime(WrapperCpn) {
    return class extends PureComponent {
      UNSAFE_componentWillMount() {
        this.begin = Date.now();
      }
  
      componentDidMount() {
        this.end = Date.now();
        const interval = this.end - this.begin;
        console.log(`${WrapperCpn.name}渲染使用时间:${interval}ms`);
      }
  
      render() {
        return <WrapperCpn {...this.props} />;
      }
    };
  }
  ```

高阶组件的缺点: 

- HOC需要在原组件上进行包裹或者嵌套，如果大量使用HOC，将会产生非常多的嵌套，这让调试变得非常困难; 
-  HOC可以劫持props，在不遵守约定的情况下也可能造成冲突;

### ref 的转发

在 React 中想要获取函数式组件中的某个元素的 DOM，需要借助 forwardRef 高阶函数：

```jsx
const Home = forwardRef(function(props, ref){
  return (
  	<div>
      <h2 ref={ref}>Home</h2>
      <button>按钮</button>
    </div>
  )
})
```

### fragment 语法

同 Vue 中一样，React 只允许一个组件中返回内容时包含一个 div 元素。在 Vue 中如果不渲染这样一个 div 可以在外部用 template 进行包裹；同理在 React 中是 fragment 元素进行包裹。

```jsx
<fragment>xxxx</fragment>
```

为了更加方便书写，React 还为我们提供了 fragment 短语法：`<></>`。看起来像空标签，需要注意的是如果我们需要再 fragment 中添加 key，那么就不能使用短语法。

### StrictMode

StrictMode 是一个用来 突显应用程序中潜在问题的工具:

- 与 Fragment 一样，**StrictMode 不会渲染任何可见的 UI**;
- **它为其后代元素触发额外的检查和警告**;
-  严格模式检查仅在开发模式下运行，它们不会影响生产构建。

可以将其看做是应用程序的任何部分启用严格模式。需要注意的是，不会对 Header 和 Footer 组件运行严格模式检查。但是，ComponentOne 和 ComponentTwo 以及它们的所有后代元素都将进行检查。所以，常用于 App 组件的最外层。

严格模式检测的东西：

1. 识别不安全的生命周期:

2. **使用过时的ref API**

3. 检查意外的副作用

   - 这个组件的`constructor`会被调用两次;
   - 这是严格模式下故意进行的操作，让你来查看在这里写的一些逻辑代码被调用多次时，是否会产生一些副作用; 
   - 在生产环境中，是不会被调用两次的;.

4. 使用废弃的`findDOMNode`方法

   - 在之前的React API中，可以通过`findDOMNode`来获取DOM，不过已经不推荐使用了。
5. 检测过时的context API
      - 早期的`Context`是通过`static`属性声明`Context`对象属性，通过`getChildContext`返回`Context`对象等方式来使用`Context`的; 
      - 目前这种方式已经不推荐使用。

## React 的过渡动画

在 React 中想要实现过渡动画，可以使用React社区为我们提供了**react-transition-group**用来完成过渡动画。它的前身是 React 为开发者提供的动画插件**react-addons-css-transition-group**，转变为现在社区维护。

在**react-transition-group**这个库中，我们 可以很方便的实现组件的入场和离场动画。

### 安装

```bash
$: npm install react-transition-group
```

### react-transition-group 主要组件

- **Transition**
  该组件是一个和平台无关的组件(不一定要结合CSS)。在前端开发中，我们一般是结合CSS来完成样式，所以比较常用的是CSSTransition；
- **CSSTransition**
  在前端开发中，通常使用CSSTransition来完成过渡动画效果；
- **SwitchTransition**
   两个组件显示和隐藏切换时，使用该组件；
- **TransitionGroup**
   将多个动画组件包裹在其中，一般用于列表中元素的动画。

### CSSTransition

CSSTransition是基于**Transition**组件构建的，在执行过程中有三个状态：`appear`、`enter`、`exit`。

三种状态对应相应的 CSS 样式：

- 开始状态：对应的类是 `-appear`、`-enter`、`exit`
- 执行动画：对应的类是 `-appear-active`、`enter-active`、`-exit-active`
- 执行结束：对应的类是 `-appear-done`、`-enter-done`、`-exit-done`

```css
/* 进入动画 */
.demoName-appear,
.demoName-enter {
  opacity: 0;
}

.demoName-appear-active,
.demoName-enter-active {
  opacity: 1;
  transition: opacity 2s ease;
}

/* 离开动画 */
.demoName-exit {
  opacity: 1;
}

.demoName-exit-active {
  opacity: 0;
  transition: opacity 2s ease;
}
```

```jsx
export class App extends PureComponent {
  constructor(props) {
    super();

    this.state = {
      isShow: true,
    };
  }

  render() {
    const { isShow } = this.state;
    return (
      <div>
        <HelloWorld />
        <button onClick={(e) => this.setState({ isShow: !isShow })}>
          点击执行动画效果
        </button>
        <CSSTransition classNames="demoName" in={isShow} timeout={2000}>
          <div>动画渲染内容</div>
        </CSSTransition>
      </div>
    );
  }
}
```

从上述代码中，我们可以看出，为了实现过渡动画，我们定义了一个名为 `demoName` 的动画名。并以它为动画类CSS的前缀，同 Vue 中一样定义入场动画和出场动画的状态。

需要注意的是，动画类 CSS 的名称 “ `demoName` ” 需要定义在 `CSSTransition`的 class 属性上（即 `classNames`）。另外，为了让过渡动画动起来，还需为 `CSSTransition` 定义几个属性：

- `in` ：（Boolean）触发进入或者退出状态。
  - 当`in`为`true`时，触发进入状态，会添加`-enter`、-enter-acitve的**class**开始执行动画，当动画执行结束后，会移除两个**class**， 并且添加 `-enter-done` 的**class**;
  - 当`in`为`false`时，触发退出状态，会添加`-exit`、`-exit-active`的**class**开始执行动画，当动画执行结束后，会移除两个**class**，并 且添加`-enter-done`的**class**;
  - 如果添加了`unmountOnExit={true}`，那么该组件会在执行退出动画结束后被移除掉。
- `timeout`：（Number）过渡动画时间。虽然在 css 中的`transition`定义了动画时间，但是该属性在CSSTransition上依旧是必要的。

#### CSSTransition 的其它常见属性

- `appear`：（Boolean）是否在初次进入添加动画(需要和`in`属性同时为`true`);
-  `unmountOnExit` :（Boolean）退出后卸载组件。
- **`classNames`** : （String）**动画 class 的名称（注意有 `s` 结尾）**，在 React 中，`className` 是设置一个元素的 CSS 类名称的属性，通常我们会用它来给元素添加样式。`classNames` 则是一个帮助你动态生成 CSS 类名称的工具库，它可以相对方便地处理一些复杂的类名组合。决定了在编写css时，对应的class名称:比如`card-enter`、`card-enter-active`、`card-enter-done`等。
- **钩子函数 `onEnter`**: 在进入动画之前被触发;
- **钩子函数 `onEntering`**:在应用进入动画时被触发;
- **钩子函数 `onEntered`**:在应用进入动画结束后被触发;

其它属性可见[官网](http://reactcommunity.org/react-transition-group/transition)。

### SwitchTransition

`SwitchTransition` 可以完成两个组件之间切换的炫酷动画，这在 Vue 中为 vue transition modes。如我们有一个按钮需要在on和off之间切换，我们希望看到on先从左侧退出，off再从右侧进入。

重要属性：

- `mode`：表示状态，有俩个值。
  - `in-out`：表示新组件先进入，旧组件再移除；
  - `out-in`：表示就组件先移除，新组建再进入。

使用：

`SwitchTransition`组件里面要有`CSSTransition`或者`Transition`组件，不能直接包裹你想要切换的组件。

**`SwitchTransition`里面的`CSSTransition`或`Transition`组件不再像以前那样接受in属性来判断元素是何种状态，取而代之的是 `key`属性**。

```css
.login-enter {
  transform: translateX(100px);
  opacity: 0;
}

.login-enter-active {
  transform: translateX(0);
  opacity: 1;
  transition: all 1s ease;
}

.login-exit {
  transform: translateX(0);
  opacity: 1;
}

.login-exit-active {
  transform: translateX(-100px);
  opacity: 0;
  transition: all 1s ease;
}
```

```jsx
export class App extends PureComponent {
  constructor() {
    super() 
    this.state = {
      isLogin: true
    }
  }

  render() {
    const { isLogin } = this.state
    return (
      <div>
        <SwitchTransition mode='out-in'>
          <CSSTransition
            key={isLogin ? "exit": "login"}
            classNames="login"
            timeout={1000}
          >
            <button onClick={e => this.setState({ isLogin: !isLogin })}>
              { isLogin ? "退出": "登录" }
            </button>
          </CSSTransition>
        </SwitchTransition>
      </div>
    )
  }
}
```

### TransitionGroup

是 React 提供的一个组件，用于管理子组件的动画过渡。它可以帮助我们创建流畅的动画效果，例如在一个列表中添加或删除子组件时，过渡动画可以使用户感觉更加自然。

下面是一个简单的例子，展示如何在一个列表中添加或删除元素时使用 TransitionGroup：

```jsx
import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

class MyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ['apple', 'banana', 'orange']
    };
  }

  addItem() {
    const newItem = prompt('Enter a new item:');
    this.setState(state => ({
      items: [...state.items, newItem]
    }));
  }

  removeItem(index) {
    this.setState(state => ({
      items: state.items.filter((item, i) => i !== index)
    }));
  }

  render() {
    return (
      <div>
        <button onClick={() => this.addItem()}>Add Item</button>
        <ul>
          <TransitionGroup>
            {this.state.items.map((item, index) => (
              <CSSTransition key={item} timeout={500} classNames="demoName">
                <li
                  onClick={() => this.removeItem(index)}
                  key={item}
                >
                  {item}
                </li>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </ul>
      </div>
    );
  }
}
```

在这个例子中，我们使用了 `CSSTransition` 组件来定义过渡效果，它接受一个 `classNames` 属性用于指定过渡动画的 CSS 类名。当一个元素被添加或删除时，这个类名会被添加到该元素的 `className` 属性中，从而触发过渡效果。

## 在 React 中编写CSS样式

由于 CSS 不是为组件化而生的，所以在组件化的框架中需要一种适合 CSS 的解决方案。这点上看，Vue 做的比较好，天然有 `scoped`属性来决定编写样式是全局有效还是局部有效。以下是在 React 中编写样式的常用方案。

### 内联样式

内联样式是官方推荐的一种 css 样式编写方案：

- `style` 接受一个采用**小驼峰命名属性**的 JavaScript 对象，而不是 CSS 字符串；
- 并且可以引用state中的状态来设置相关的样式。

```jsx
export class App extends PureComponent {
  constructor() {
    super()
    this.state = {
      titleSize: 30
    }
  }

  addTitleSize() {
    this.setState({ titleSize: this.state.titleSize + 2 })
  }

  render() {
    const { titleSize } = this.state

    return (
      <div>
        <button onClick={e => this.addTitleSize()}>增加titleSize</button>
        <h2 style={{color: "red", fontSize: `${titleSize}px`}}>红色, 动态变化字号大小</h2>
        <p style={{color: "blue", fontSize: "20px"}}>蓝色, 固定字号大小</p>
      </div>
    )
  }
}
```

优点是：内联样式不会存在作用范围冲突问题（CSS权重决定），并且可以动态获取当前 `state`中的状态。

缺点是：

- 写法都需要驼峰标识；
- 部分样式提示性较差；
- 大量的内联样式导致代码较为混乱；
- 如伪类和伪元素等部分样式无法编写。

所以，可以看出内联样式还是有很多问题的。

### 普通 CSS 编写

普通的 CSS 编写就是**编写到一个单独CSS文件中，之后再进行引入**，虽然简单直接，但是缺点是样式之间可能会相互层叠代替，或是类名取名较为困难。

### CSS module

css modules 并不是 React 特有的解决方案，而是所有使用了类似于 `webpack` 配置的环境下都可以使用的。如果在其他项目中使用它，那么我们需要自己来进行配置，比如配置`webpack.config.js`中的`modules: true`等。

React的脚手架已经内置了`css modules`的配置：

- `.css/.less/.scss` 等样式文件都需要修改成 `.module.css/.module.less/.module.scss` 等;
- 之后再引用并自定义一个CSS变量名，后续就可以以该变量名开头获取其内部的 CSS 类了。

```css
/* 文件名: App.moudle.css */
.title {
  font-size: 32px;
  color: green;
}

.content {
  font-size: 22px;
  color: orange;
}
```

```jsx
import appStyle from "./App.module.css"

export class App extends PureComponent {
  render() {
    return (
      <div>
        <h2 className={appStyle.title}>修饰内容</h2>
        <p className={appStyle.content}>修饰内容</p>
      </div>
    )
  }
}
```

优点很明显，它解决了局部作用域的问题。缺点是引用的类名，**不能使用连接符**(如 `.home-title`)，在`JavaScript`中无法识别的；所有的`className`都必须使用`{style.className}` 的变量形式来编写；不方便动态来修改某些样式，依然需要使用内联样式的方式。

### 最佳实现: CSS in JS

如名字意思一样，就是在 JS 中编写 CSS 样式，CSS 由 JavaScript 生成而不是在外部文件中定义。

值得注意的是该功能并不是 React 的一部分，而是**由第三方库提供**，较为流行的 CSS-in-JS 库有：`styled-components`、`emotion`、`glamorous`。

以下介绍社区内最为流行的`styled-components`的用法。

安装：`npm install styled-components`。

在介绍 `styled-components` 的写法之前，先看一种ES6 中模版字符串的用法：[带标签的模板字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals#%E5%B8%A6%E6%A0%87%E7%AD%BE%E7%9A%84%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2)。

函数除了可以使用小括号的形式进行调用，还可以用带标签的模板字符串进行调用。当使用带标签的模板字符串时，可以在模板字符串前添加一个函数名称，并在模板字符串内部包含一个表达式列表。当模板字符串被执行时，该函数将被调用，并传递模板字符串的解析结果以及表达式列表作为参数。

```js
function myTag(strings, ...values) {
  console.log(strings); // ["Hello, ", "!"]
  console.log(values);  // ["world"]
  return "Something else"; // 该函数必须返回一个字符串
}

const myString = myTag`Hello, ${"world"}!`;
console.log(myString); // "Something else"
```

在此示例中，`myTag`函数作为模板字符串的标签。模板字符串被解析为一个字符串数组 `strings` 和一个值数组 `values`，它们分别包含模板字符串的文本段和表达式值。值得注意的是，**字符串数组是以模版字符串中的变量名进行切割的**。

```js
function myTag(strings, ...values) {
  console.log(strings); // ['', '', '', '!'] 注意,这里是如何切割字符串的
  console.log(values);  // ['A', 'B', 'world']
  return "Something else"; // 该函数必须返回一个字符串
}
const myString = myTag`${"A"}${"B"}${"world"}!`;
```

通过这种高级语法，`styled-components`通过调用函数，最终创建出一个组件出来。这个组件会被自动添加上一个不重复的 class，`styled-components`会给该 class 添加相关的样式。另外，它也支持类似于 CSS 预处理器一样的样式嵌套，支持直接子代选择器或后代选择器，并且直接编写样式；可以通过`&`连接符获取当前元素。

基础用法:

```js
// 文件名: style.js
import styled from "styled-components"
// 模板字符串的标签形式进行函数调用
export const AppWrapper = styled.div`
  .footer {
    border: 1px solid orange;
  }
`
```

```jsx
// 文件名: App.jsx 进行使用
import { AppWrapper } from "./style"
export class App extends PureComponent {
  render() {
    return (
      <AppWrapper>
        <div className='footer'>
          <p>免责声明</p>
          <p>版权声明</p>
        </div>
      </AppWrapper>
    )
  }
}
```

可以看到，在样式标签中定义的 `AppWrapper` 在使用时，将其作为一个标签将实际的 DOM 元素进行包裹，最终达到渲染效果。

此外，还以将子元素单独抽取到一个样式组件，这样可以接受外部传入的`props`，还可以通过`attrs`给标签模板字符串中提供的属性，从一个单独的文件中引入变量。

```js
import styled from "styled-components"
const largeSize = "18px"

// 此处为链式调用
export const AppWrapper = styled.div.attrs(props => ({
  tColor: props.color || "blue"
}))`
  border: 1px solid red;

  .title {
    font-size: ${props => props.size}px;
    color: ${props => props.tColor};

    &:hover {
      background-color: purple;
    }
  }

  .content {
    font-size: ${largeSize}px;
  }
`
```

```jsx
export class App extends PureComponent {

  constructor() {
    super()

    this.state = {
      size: 30,
      color: "yellow"
    }
  }

  render() {
    const { color } = this.state
    return (
      <AppWrapper color={color}>
        <h2 className='title'>我是标题</h2>
        <p className='content'>我是内容</p>
        <button onClick={e => this.setState({color: "skyblue"})}>修改颜色</button>
      </AppWrapper>
    )
  }
}
```

在上述代码中，给`AppWrapper`传递了一个颜色变量，通过`styled.div.attrs`链式调用获取属性，而后在其内部自定义一个 `tColor`的变量来接收该属性，进而使用。另外由于是在模版字面量中进行编写，所以 `props` 传递过来的属性需要用 `${}`进行包裹。

这里再捋一遍逻辑：在 jsx 中，给`AppWrapper` 传递了 `color` 的属性，该属性定义在`AppWrapper` 的 `attr` 上。因此，通过 `styled.div.attrs`对该属性进行处理。在`AppWrapper`中是通过 `props`使用自身属性的，并且 `props`会作为该函数的参数，在这里面可以自定义 `props`的内部属性，即可以对内部属性进行默认值的绑定。最后，在 css 类中，使用 `${props.变量名}`的形式进行使用。

### 在 JSX 中添加 class

在 Vue 中添加 class 很简单，可以直接传入一个对象、数组或者对象和数组混用：

```vue
<div :class="{ active: isActive }"> 传入对象 </div>
<div :class="[ activeClass, errorClass ]"> 传入数组 </div>
<div :class="[ { active: isActive }, errorClass]"> 对象数组混入 </div>
```

React在 `JSX` 给了我们开发者足够多的灵活性，你可以像编写 JavaScript 代码一样，通过一些逻辑来决定是否添加某些 class ：

```jsx
<div>
	<h2 className={"title " + { isActive ? "active" : "" }> 以字符串空格分割 class 类名</h2>
  <h2 className={["title", (isActive ? "active" : "")].join(" ") }> 以字符串空格分割 class 类名</h2>
</div>
```

`classNames` 则是一个帮助你动态生成 CSS 类名称的工具库，它可以相对方便地处理一些复杂的类名组合。可以通过 `npm` 安装：`npm install classnames`

```jsx
classNames('foo', 'bar'); // 'foo bar'
classNames('foo', { bar: true }); // 'foo bar'
```



