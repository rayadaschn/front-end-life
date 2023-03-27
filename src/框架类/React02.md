---
title: React 工程化开发
icon: react
category:
  - 框架
tag:
  - React
star: true
sticky: false

---

# React 工程化开发

随着代码的增加，在项目中注定无法在一个 HMLT 文件内编写完所有的工作，并且随着需求的增加，也要求我们将页面进行组件化切分，因此 Reac 中有了以下几种分类：

- 根据组件的定义方式，可以分为：函数组件(`Functional Component` )和类组件(`Class Component`)；
- 根据组件内部是否有状态需要维护，可以分成：无状态组件(`Stateless Component` )和有状态组件(`Stateful Component`)，也就是有无 state 数据；
- 根据组件的不同职责，可以分成：展示型组件(`Presentational Component`)和容器型组件(`Container Component`)；

## 类组件

类组件即如基础语法中所示，用一个类来定义一个组件。内部封装了方法函数、数据以及 `render`函数。

在ES6之前，可以通过`create-react-class` 模块来定义类组件，但是目前官网建议我们使用ES6的class类定义。

使用**class**定义一个组件：

- **constructor**是可选的，我们通常在**constructor**中初始化一些数据。若不写，若需要传参，则直接用形如 `this.props.xxx`形式 ；
- **this.state**中维护的就是我们组件内部的数据，优化部分在下文做进一步讨论；
- `render()` 方法是 class 组件中唯一必须实现的方法。需要注意的是，当 `render` 被调用时，它会检查 `this.props` （继承属性）和 `this.state` （组件自身属性）的变化并返回以下类型之一：
  - React 元素，也就是组件元素；
  - 数组或 `fragments`；
  - `Portals`: 可以渲染子节点到不同的 DOM 子树中;
  - **字符串或数值类型**：它们在 DOM 中会被渲染为文本节点;
  - `布尔类型`或 `null`：什么都不渲染。

## 函数组件

当前用的最多的是 function 函数了，从这点看和 Vue 的转换一样。

```jsx
export default function App() {
  return (
  	<div>Hello World</div>
  )
}
```

这点，在 Hook 中做详细讨论。

## 生命周期

同 Vue 一样，React 也有自身的[生命周期](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)：

常用的生命周期如下:

![常用生命周期](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/20230325220324.png)

图中，非常清晰的展示了 React 的几个关键的生命周期钩子函数：

- `construct` 也即类的实例化。需要特别说明的是，有多少个子组件，就会依次实例化多少次。在实例化的过程中，通过给 `this.state` 赋值对象来初始化内部的 `state`，并且为事件绑定实例（this）。
- `componentDidMount` 在组件挂载后(插入到 DOM 树中) 立即调用。官方推荐在此处发送网络请求，也可以在此处添加一些订阅（订阅最终需在 componentWillUnmount 中取消订阅）；
- `componentDidUpdate()` 会在更新后会被立即调用，首次渲染不会执行此方法。当对组件更新后，可在此处对 DOM 进行操作。若对更新前后的 `props` 进行了比较，也可以选择在此处进行网络请求，但是此时已经组件已经挂载了，因此会执行两次 `render`。（此外，当 `props` 未发生变化时，则不会执行网络请求）;
- `componentWillUnmount()` 会在组件卸载及销毁之前直接调用。在此方法中执行必要的清理操作，例如，清除 `timer`，取消网络请求或清除在 `componentDidMount()` 中创建的订阅等。

此外，还有几个不常用用的生命周期，加入后的[完整生命周期](https://legacy.reactjs.org/docs/react-component.html)如下：

![React 完整生命周期](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/20230325230255.png)

- `getDerivedStateFromProps：state` 的值在任何时候都依赖于 props时使用；该方法返回一个对象来更新state；
- `getSnapshotBeforeUpdate`：在React更新DOM之前回调的一个函数，可以获取DOM更新前的一些信息（比如说滚动位置）；
- `shouldComponentUpdate`：该生命周期函数实际较为很常用，它用于控制组件是否需要重新渲染，即如果函数返回 `false` 则组件不进行重新渲染。一般情况下，是用于比对 `this.state` 和 `this.props` 是否发生改变（**浅比较**），若没有发生变化，则返回 `false` 。不过一个一个的比对的话，着实比较费力，所以 React 为我们提供了 `PureComponent` 来代替  `React.Component` ，如此这部分的优化就无需我们手动控制了；

```jsx
import React from "react"

class HelloWorld extends React.Component {
  // 1.构造方法: constructor
  constructor() {
    console.log("HelloWorld constructor")
    super()

    this.state = {
      message: "Hello World"
    }
  }

  changeText() {
    this.setState({ message: "你好啊, React" })
  }

  // 2.执行render函数
  render() {
    console.log("HelloWorld render")
    const { message } = this.state

    return (
      <div>
        <h2>{message}</h2>
        <p>{message}是程序员的第一个代码!</p>
        <button onClick={e => this.changeText()}>修改文本</button>
      </div>
    )
  }

  // 3.组件被渲染到DOM: 被挂载到DOM
  componentDidMount() {
    console.log("HelloWorld componentDidMount")
  }

  // 4.组件的DOM被更新完成： DOM发生更新
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("HelloWorld componentDidUpdate:", prevProps, prevState, snapshot)
  }

  // 5.组件从DOM中卸载掉： 从DOM移除掉
  componentWillUnmount() {
    console.log("HelloWorld componentWillUnmount")
  }

  // 不常用的生命周期补充
  shouldComponentUpdate() {
    return true
  }

  getSnapshotBeforeUpdate() {
    console.log("getSnapshotBeforeUpdate")
    return {
      scrollPosition: 1000
    }
  }
}

export default HelloWorld
```



## 组件通信

- 父传子：父组件通过 **属性=值** 的形式来传递给子组件数据。如属性一般将数据传递给子组件；

  ```jsx
  <MainBanner banners={banners} title="轮播图"/>
  ```

  此时，子组件通过在 constructor 中的 **props** 参数获取父组件传递过来的数据。

  并且，为了对父组件传递过来的数据进行约束，可以用 `子组件类名.propTypes={}` 的方式进行约束;

  通过 `子组件类名.defaultProps={}` 的方式对数据进行默认值设置（也可以设置为静态属性）。

  ```jsx
  // 类组件
  import React, { Component } from 'react'
  import PropTypes from "prop-types"
  
  export class MainBanner extends Component {
    // static defaultProps = {
    //   banners: [],
    //   title: "默认标题"
    // }
  
    constructor(props) {
      super(props)
      this.state = {}
    }
  
    render() {
      // console.log(this.props)
      const { title, banners } = this.props
  
      return (
        <div className='banner'>
          <h2>封装一个轮播图: {title}</h2>
          <ul>
            {
              banners.map(item => {
                return <li key={item.acm}>{item.title}</li>
              })
            }
          </ul>
        </div>
      )
    }
  }
  
  // MainBanner传入的props类型进行验证
  MainBanner.propTypes = {
    banners: PropTypes.array,
    title: PropTypes.string
  }
  
  // MainBanner传入的props的默认值
  MainBanner.defaultProps = {
    banners: [],
    title: "默认标题"
  }
  
  export default MainBanner
  ```

  在函数式编程中，则同 Vue3 中的 `setup` 一般，需要在函数中显示传递 `props` 参数。

  ```jsx
  // 在函数式组件中
  function MainBanner(props) {
    const { banners, title } = props;
    return (
      <div className='banner'>
        <h2>封装一个轮播图: {title}</h2>
        <ul>
          {
            banners.map(item => {
              return <li key={item.acm}>{item.title}</li>
            })
          }
        </ul>
      </div>
    )
  }
  ```

  

- 子传父: 是通过 `props` 传递数据，则是让父组件给子组件传递一个回调函数，在子组件中调用这个函数即可。

  ```jsx
  // 父组件
  class App extends Component {
    constructor() {
      super()
      this.state = {
        counter: 100
      }
    }
  
    changeCounter(count) {
      this.setState({ counter: this.state.counter + count })
    }
  
    render() {
      const { counter } = this.state
  
      return (
        <div>
          <h2>当前计数: {counter}</h2>
          <AddCounter addClick={(count) => this.changeCounter(count)}/>
          <SubCounter subClick={(count) => this.changeCounter(count)}/>
        </div>
      )
    }
  }
  ```

  ```jsx
  // 子组件
  export class AddCounter extends Component {
    addCount(count) {
      // 自身定义一个方法, 调用在 props 上传递过来的父组件的方法, 从而改变父组件中的数据
      this.props.addClick(count)
    }
    render() {
      return (
        <div>
          <button onClick={e => this.addCount(1)}>+1</button>
        </div>
      )
    }
  }
  ```

## 插槽

插槽有俩种实现方法，第一种是使用 `props` 上的 `children` 实现；另外一种是直接使用 `props`。

- 第一种类似于 Vue 中使用插槽，将数据放在子组件标签内，但是缺点很明显：传递的数据不可变化，否则子组件上的数组对应不上；
- 第二种则较为灵活，直接将数据通过属性传递过去，子组件直接使用，也推荐如此使用。

```jsx
// 父组件
export class App extends Component {
  render() {
    const btn = <button>按钮2</button>

    return (
      <div>
        {/* 1.使用children实现插槽 */}
        <NavBar>
          <button>按钮</button>
          <h2>哈哈哈</h2>
          <i>斜体文本</i>
        </NavBar>

        {/* 2.使用props实现插槽 */}
        <NavBarTwo 
          leftSlot={btn}
          centerSlot={<h2>呵呵呵</h2>}
          rightSlot={<i>斜体2</i>}
        />
      </div>
    )
  }
}
```

```jsx
// 子组件: 第一种 使用children实现插槽
export class NavBar extends Component {
  render() {
    const { children } = this.props
    console.log(children)

    return (
      <div className='nav-bar'>
        <div className="left">{children[0]}</div>
        <div className="center">{children[1]}</div>
        <div className="right">{children[2]}</div>
      </div>
    )
  }
}
```

```jsx
// 子组件: 第二种 直接通过 props 属性传递
export class NavBarTwo extends Component {
  render() {
    const { leftSlot, centerSlot, rightSlot } = this.props

    return (
      <div className='nav-bar'>
        <div className="left">{leftSlot}</div>
        <div className="center">{centerSlot}</div>
        <div className="right">{rightSlot}</div>
      </div>
    )
  }
}
```

### 作用域插槽

在 Vue 中[作用域插槽](https://cn.vuejs.org/guide/components/slots.html#dynamic-slot-names)的意思是在某些场景下插槽的内容可能想要**同时使用父组件域内和子组件域内的数据**。要做到这一点，我们需要一种方法来让子组件在渲染时将一部分数据提供给插槽。

```vue
<!-- 在 Vue 中的作用域插槽 -->
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>
```

在 React 中，则要简单的多。直接通过属性传递函数，将父组件的数据传递过去。

```jsx
// 父组件
export class App extends Component {
  constructor() {
    super()

    this.state = {
      titles: ["流行", "新款", "精选"],
      tabIndex: 0
    }
  }

  tabClick(tabIndex) {
    this.setState({ tabIndex })
  }

  getTabItem(item) {
    if (item === "流行") {
      return <span>{item}</span>
    } else if (item === "新款") {
      return <button>{item}</button>
    } else {
      return <i>{item}</i>
    }
  }

  render() {
    const { titles, tabIndex } = this.state

    return (
      <div className='app'>
        <TabControl 
          titles={titles} 
          tabClick={i => this.tabClick(i)}
          // itemType={item => <button>{item}</button>}
          itemType={item => this.getTabItem(item)}
        />
        <h1>{titles[tabIndex]}</h1>
      </div>
    )
  }
}
```

```jsx
// 子组件
export class TabControl extends Component {
  constructor() {
    super()

    this.state = {
      currentIndex: 0
    }
  }

  itemClick(index) {
    // 1.自己保存最新的index
    this.setState({ currentIndex: index })

    // 2.让父组件执行对应的函数
    this.props.tabClick(index)
  }

  render() {
    const { titles, itemType } = this.props // 父组件传递过来的数据
    const { currentIndex } = this.state

    return (
      <div className='tab-control'>
        {
          titles.map((item, index) => {
            return (
              <div 
                className={`item ${index === currentIndex?'active':''}`} 
                key={item}
                onClick={e => this.itemClick(index)}
              >
                {/* <span className='text'>{item}</span> */}
                {itemType(item)}
              </div>
            )
          })
        }
      </div>
    )
  }
}
```

在上述代码中，最终要显示的插槽内容为 `{itemType(item)}`，也就是说 这块的内容完全有父组件调度，以此达到插槽的目的。

## React 的更新流程

了解了 React 在工程化组件中的基本用法后，我们来看一下 React 的更新流程（这对 React 的项目优化很重要）。

- React 的渲染流程是：

  由 JSX 代码编译为 虚拟 DOM，再从虚拟 DOM 编译为真实 DOM。

- React 的更新流程是：

  监听到 `props 和 state` 的变化 --> `render` 函数重新执行 --> 产生新的虚拟 DOM 树  --> 新旧虚拟 DOM 树进行 Diff 算法比较  --> 计算出虚拟 DOM 树中不同的地方进行更新 --> 再更新到真实 DOM 树

从上面的更新流程中可以看出，我们可以在 第一步 “监听到 `props 和 state` 的变化” 和 “新旧虚拟 DOM 树进行 Diff 算法比较 ” 俩个方面进行优化，其余步骤更多为框架自动完成。

### 更新优化

从上文的生命周期中，我们简单的介绍过不常用的生命周期 `shouldComponentUpdate`，这个生命周期可以控制组件是否需要重新渲染。但实际使用上，我们会采用 `PureComponent` 来帮助我们自动化优化这一部分。用法很简单，直接用将 `class` 继承自 `PureComponent`即可；而函数组件则利用高阶组件 `memo`进行包裹。

```jsx
// 类组件
export class Bar extends PureComponent {
  render() {
    return (
      <div>PureComponent优化渲染</div></div>
    )
  }
}
```

```jsx
// 函数组件
import { memo } from "react"

const Profile = memo(function(props) {
  console.log("profile render")
  return <h2>Profile: {props.message}</h2>
})

export default Profile
```

需要注意的是，这里的方法实际上都是调用 **shallowEqual** 进行浅比较，即 **`!shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)`** ，意为对比是否为浅拷贝，如果是浅拷贝指向的对象地址没有发生变化，则不会进行重写渲染。

这里要强调一个知识点：**React 的数据不可变力量**。

什么意思呢？就是不能够直接对 `this.state` 里的数据进行处理更新。我们必须先拷贝（将解构出来）一份数据出来，而后对拷贝出来的对象进行处理，最后再利用 `this.setstate` 将其赋值给原数据。

为什么需要这样做呢? 如果我们直接对 `this.state` 里的数据进行处理，而该对象恰好为一个对象。我们改变其内部的数据是不会改动这个对象的指向地址的，也就是说调用 **shallowEqual** 进行浅比较时，是不会有变化的，使得组件不会发生更新渲染，这并不是我们想要的。

为此，我们需要先将 `this.state` 中需要改变的对象，先解构出一份来。此时，虽然内部的属性可能也有对象，但是外部的堆内存地址已经改变了，可以被 **shallowEqual** 浅比较检测出来。

```jsx
// 数据不可变性
changeCount(index) {
  // this.state.data[index].count++
  const data = [...this.state.data]
  data[index].count++
  this.setState({ data: data }) // 请注意,这里的俩者堆内存不一致可以进行更新
}
```

## 操作 DOM 属性

和在 Vue 一样，在 React 中也是通过 `ref` 操作 DOM 原生（通常情况下，不需要也不建议这样做）。

应用场景:

- 管理焦点，文本选择或媒体播放;
- 触发强制动画;
- 集成第三方 DOM 库;

创建 `refs` 获取对应的 DOM 元素，有三种方式：

- 传入字符串： 通过 `this.refs` 传入的字符串格式获取对应的元素;
- 传入一个对象：对象是通过 React.createRef() 方式创建出来的。使用时获取到创建的对象其中有一个`current`属性就是对应的元素;
- 传入一个函数：该函数会在DOM被挂载时进行回调，这个函数会传入一个 元素对象，我们可以自己保存。使用时，直接拿到之前保存的元素对象即可。

需要注意的是，**ref** 的值根据节点的类型而有所不同：

- **当 ref 属性用于 HTML 元素时，构造函数中使用 `React.createRef()` 创建的 ref 接收底层 DOM 元素作为其 current 属性。**这种方式和 Vue 较为相似，也推荐这种形式！

```jsx
// 获取 DOM 元素属性
import React, { PureComponent, createRef } from 'react'

export class App extends PureComponent {
  constructor() {
    super()
    this.titleRef = createRef() // 需要用到 createRef()
    this.titleEl = null
  }

  getNativeDOM() {
    // 1.方式一: 在React元素上绑定一个ref字符串
    console.log(this.refs.someString)

    // 2.方式二: 提前创建好ref对象, createRef(), 将创建出来的对象绑定到元素
   console.log(this.titleRef.current)

    // 3.方式三: 传入一个回调函数, 在对应的元素被渲染之后, 回调函数被执行, 并且将元素传入
    console.log(this.titleEl)
  }

  render() {
    return (
      <div>
        <h2 ref="someString">字符串形式获取</h2>
        <h2 ref={this.titleRef}> ref 对象形式获取,利用 current 进行调用</h2>
        <h2 ref={el => this.titleEl = el}>函数形式获取</h2>
        <button onClick={e => this.getNativeDOM()}>获取DOM</button>
      </div>
    )
  }
}
```

- 当 ref 属性用于自定义 class 组件时，**ref 对象接收组件的挂载实例作为其 current 属性**；

```jsx
// 获取 class 组件
import React, { PureComponent, createRef } from 'react'

class SonComponent extends PureComponent {
  testFunc() {
    console.log("test------")
  }
  render() {
    return <h1>子组件</h1>
  }
}

export class App extends PureComponent {
  constructor() {
    super()
    this.someString = createRef() // 先定义ref
  }

  getComponent() {
    console.log(this.someString.current) 
    this.someString.current.testFunc() // 获取子组件上的属性方法
  }

  render() {
    return (
      <div>
        <SonComponent ref={this.someString}/>
        <button onClick={e => this.getComponent()}>获取组件实例</button>
      </div>
    )
  }
}
export default App
```

- 不能**在函数组件上使用** **ref** **属性**，因为他们没有实例。所以要获取函数子组件的 DOM，这时我们需要通过 [`React.forwardRef`](https://legacy.reactjs.org/docs/forwarding-refs.html) 来获取，此时在`forwardRef` 函数中能够获取俩个参数：`props`和父组件传递过来的`ref`。因此，通过父组件传递过来的 `ref`，能够达到父组件操作函数子组件的方法。当然，还有 `hooks`的操作方法，后续介绍。

```jsx
// 在函数组件上获取 DOM
import React, { PureComponent, createRef, forwardRef } from 'react'

const FuncSonComponent = forwardRef(function(props, ref) {
  return (
    <div>
      <h1 ref={ref}>函数子组件</h1>
    </div>
  )
})

export class App extends PureComponent {
  constructor() {
    super()
    this.someString = createRef() // 先定义ref
  }

  getComponent() {
    console.log(this.someString.current) // 获取子组件上的 DOM 节点
  }

  render() {
    return (
      <div>
        <FuncSonComponent ref={this.someString}/>
        <button onClick={e => this.getComponent()}>获取函数子组件实例</button>
      </div>
    )
  }
}

export default App
```

## 受控组件

学习过 Vue 的都知道 Vue 中的 `V-model` 双向绑定，它用于在表单元素和 Vue 实例的数据之间双向绑定。通过将 v-model 绑定到表单元素的 `value` 或 `checked` 属性，Vue 实例的数据将与表单元素的状态同步。Vue 中用法如下所示：

```vue
<template>
  <div>
    <input v-model="message" placeholder="Enter message">
    <p>Message is: {{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: ""
    };
  }
};
</script>
```

而在 React 中，表单的处理方式和普通的 DOM 元素不一样：表单元素通常会保存在一些内部的 **state** 。

受控组件的定义为表单输入元素的值受 React 组件 `state` 或 `prop` 控制的元素。它的值受 React 管理，通过组件的 `setState()` 方法或者 `prop` 来更新。

可以**使用受控组件来进行可预测的响应表单输入的变化**。它可以让开发人员很容易地管理表单的状态，并在表单提交时存储数据。也就是说，在 React 中，需要额外的监听如 `input` 等组件的 `value` 等输入值的变化。

```jsx
export class App extends PureComponent {
  constructor() {
    super()

    this.state = {
      inputValue: "" // input 中的初始值
    }
  }

  inputChange(event) { // 监听 input 中键入的事件变化
    console.log("inputChange:", event.target.value)
    this.setState({ inputValue: event.target.value })
  }

  render() {
    const { inputValue } = this.state

    return (
      <div>
        {/* 受控组件 */}
        <input type="checkbox" value={inputValue} onChange={e => this.inputChange(e)}/>

        {/* 非受控组件 */}
        <input type="text" />
        
        <h2>inputValue输入值: {inputValue}</h2>
      </div>
    )
  }
}
```

