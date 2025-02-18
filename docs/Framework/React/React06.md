---
title: React之Hooks
icon: react
date: 2023-03-25
category:
  - 框架
tag:
  - React
sticky: false
---

React Hooks 是 React 16.8 新增的功能，它允许函数组件中使用状态和其他 React 特性。Hooks 可以帮助我们更轻松地编写可复用、独立和易于测试的组件，并且可以避免类组件中常见的代码冗余和样板代码。

先看看，在过去的 Class 组件中所存在的问题：

- 复杂组件难以理解；
- ES6 中的 class 和 React 中的 this 指向入门难度较高；
- 组件复用状态较难。复用组件必须使用高阶组件，使得流程较为繁琐。

在之前的 React 版本中，类组件是唯一能够使用 React 特性的方式。而函数组件则只能渲染静态数据和返回 DOM 元素。但随着函数组件的流行，开发人员往往希望在函数组件中使用状态和其他 React 特性。看一个函数式组件的样例:

```jsx
function HelloWorld(props) {
  let message = 'Hello World!'
  return (
    <div>
      <h2>文本内容: {message}</h2>
      <button onClick={(e) => (message = 'Hello React!')}>修改文本</button>
    </div>
  )
}
```

可以看到，函数式组件可能存在的最大缺陷有：

- 组件不会被重新渲染：修改变量`message`之后，组件无法自动检测修改；
- 如果页面重新渲染：函数会被重新执行，第二次重新执行时，依旧会重新将`message`赋值为 `"Hello World!"`；
- 没有生命周期、上下文等 React 特性。

Hooks 的出现解决了这个问题。它们使得我们能够在不编写类组件的情况下使用状态、生命周期方法、上下文等 React 特性，从而使函数组件更加强大和灵活。

但需要注意的是，**Hooks 只能在函数组件和自定义 Hook 中使用，不能在普通 JavaScript 函数中使用。**

以下是错误的写法：

```js
import { useState } from 'react'

function Foo() {
  const [message] = useState('Hello World')
  return message
}
const message = Foo()
console.log('message', message)
```

则会报错，原因有二：自定义 Hook 的函数名需要以 `use`开头，如`useFoo`；必须在函数组件内使用。

> 为什么要用 `use`开头，不用如 `create` 等词语？
>
> `create` 可能并不准确，需要注意的是 Hook 的本意实际上是钩子函数。它内部会第一个变量状态，然后将这个变量状态返回出来。我们无需关注这个变量的状态是如何改变的，只需要使用它就可以。每次函数重新执行时，这个 Hook 并不会重新定义，而是沿用其内部这个变量。可以理解为是闭包函数。

正确用法：

```jsx
import { memo, useState } from 'react'

function useFoo() {
  // 自定义 Hook
  const [message] = useState('Hello World')
  return message
}

// 函数组件
function CounterHook(props) {
  const [counter, setCounter] = useState(0)

  const message = useFoo() // 使用自定义 Hook
  console.log('message', message)

  return (
    <div>
      <div>{message}</div>
      <h2>当前计数: {counter}</h2>
      <button onClick={(e) => setCounter(counter + 1)}>+1</button>
      <button onClick={(e) => setCounter(counter - 1)}>-1</button>
    </div>
  )
}

export default memo(CounterHook)
```

## 函数组件机制

函数组件的每一次渲染(或者更新)，都是把函数重新执行，产生一个全新的「私有上下文」

- 内部的代码也需要重新执行。
- 涉及的函数需要重新的构建，这些函数的作用域(函数执行的上级上下文)，是每一次执行函数组件产生的闭包。
- 每一次执行函数组件，也会把 useState 重新执行，但是只有第一次设置的初始值会生效，其余以后再执行，获取的状态都是最新的状态值「而不是初始值」。返回的修改状态的方法，每一次都是返回一个新的。

![函数组件渲染原理](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202502162130452.png)

## useState

以 `useState` Hook 作为入门，先来看一下这个 Hook 的用法。

useState Hook 用于在函数组件中添加状态。它返回一个数组，第一个元素是当前状态的值，第二个元素是更新状态的函数。

```jsx
const [state, setState] = useState(initialState)
```

其中，**`state` 表示当前状态的值，`setState` 是更新状态的函数，`initialState` 是状态的初始值。**

- **useState** 会帮助我们定义一个 `state`变量，`useState` 是一种新方法，它与 `class` 里面的 `this.state` 提供的功能完全相同（一般来说，在函数退出后变量就会”消失”，而 `state` 中的变量会被 React 保留）。
- **useState** 接受唯一一个参数，在第一次组件被调用时使用来作为初始化值。(如果没有传递参数，那么初始化值为`undefined`)
- **useState** 会返回一个数组。同其它 Hook 类似，这个数组中第一个为状态值，第二个为更新状态的钩子函数。
- setState 不支持部分状态的更新，更新时需要把状态整体进行修改。

使用 useState Hook 可以帮助我们避免使用 `class` 组件和 `this.setState()` 方法来管理状态，并且让函数组件和类组件的状态管理方式保持一致。

接下来，让我们看一个简单的例子，使用 useState Hook 来实现计数器的功能：

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  const handleIncrement = () => {
    setCount(count + 1)
  }

  const handleDecrement = () => {
    setCount(count - 1)
  }

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleDecrement}>-</button>
    </div>
  )
}
```

在上述代码中，我们定义了一个名为 `Counter` 的函数组件，并使用 `useState` Hook 在其中添加了一个 `count` 状态。然后，我们提供了两个更新状态的方法 `handleIncrement` 和 `handleDecrement`，分别用于增加和减少计数器的值。

最后，在组件的返回值中，我们渲染了当前的计数器值和两个按钮，并将更新状态的方法绑定在了对应的按钮上。

### useState 其它

此外，useState 还自带了性能优化，修改值会基于 `Object.is` 作比较，若俩次的 set 值一致，则不会重新渲染。类似于 PureComponent 在 shouldComponentUpdate 中的浅比较。

![useState 潜比较](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202502172201896.png)

## useEffect

除了定义状态，还需要解决函数组件中的生命周期问题，`useEffect` 这个 Effect Hook 便是用来干这个的。

> 在 react 哲学中，所有的副作用都要在 useEffect 中完成。

先来回顾一下一个名词：副作用。像网络请求、手动更新 DOM、一些事件的监听等都是 React 更新 DOM 的一些副作用(**Side Effects**)。因此，对于完成这些功能的 Hook 被称之为 Effect Hook。

`useEffect` 可以告诉 React 需要在渲染后执行某些操作，它用于在函数组件中添加副作用，例如订阅数据、设置定时器等。**它接受一个回调函数，并在组件渲染时调用**。

以下是 useEffect Hook 的基本语法：

```js
useEffect(() => {
  // do something...
}, [dependencies])
```

其中，**第一个参数是回调函数，称为 Effect**。它会在组件的每次渲染周期结束后执行一次。**第二个参数是可选的依赖列表(数组形式)，用于控制 Effect 的执行时机。只有依赖项变化时，Effect 才会重新运行**。

> 若第二个参数是 undefined => 任何状态改变时, 都会重新执行回调;
>
> 若第二个参数不是一个数组 => 报警告错误。
>
> 若第二个参数是一个有元素的数组 =》 元素为状态的话，状态更新，回调重新执行一次。

使用 useEffect Hook 可以帮助我们避免使用 class 组件和生命周期方法来管理副作用，并且让函数组件和类组件的副作用管理方式保持一致。

接下来，让我们看一个简单的例子，使用 useEffect Hook 来实现在组件挂载时和卸载时输出信息的功能：

```jsx
import { useState, useEffect } from 'react'

function Example() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // 此处也常用语添加监听事件,但需要记得在卸载时取消监听
    console.log('Component mounted!') // 每次渲染周期结束后执行一次,相当于生命周期中的 componentDidMount
    return () => {
      // 此处常用于取消监听, 同上面的添加监听相对应
      // 这里的变量是上一次的状态值
      console.log('Component unmounted!') // 组件卸载时执行，相当于生命周期中的 componentWillUnmount
    }
  }, [])

  const handleIncrement = () => {
    setCount(count + 1)
  }

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={handleIncrement}>+</button>
    </div>
  )
}
```

在上述代码中，我们定义了一个名为 `Example` 的函数组件，并使用 `useState` Hook 在其中添加了一个 `count` 状态。然后，我们使用 `useEffect` Hook 来在组件挂载时输出一条信息，并在组件卸载时输出另一条信息。

需要注意的是，在 useEffect Hook 中我们返回了一个清理函数，这个函数会在组件卸载时执行。它可以用于清除副作用，例如取消订阅或清除定时器等。可以参考这个回调函数的定义：

```typescript
type EffectCallback = () => void | (() => void | undefined)
```

最后，在组件的返回值中，我们渲染了当前的计数器值和一个按钮，并将更新状态的方法绑定在了对应的按钮上。

![useEffect 执行顺序](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202502172301648.png)

### Effect 性能优化

实际上，上述的代码已经做了性能优化处理。在前文中，我们介绍了 `useEffect` 有俩个参数，第一个是 `EffectCallback` 回调函数，第二个是数组形式的依赖列表。若不加这个依赖列表，则函数组件每次重新加载时，都是执行 `useEffect` 中回调函数（相当于每次重新执行）。若是只需要执行一次，不依赖任何的内容时，则可传入空数组 `[]`。

这里相当于控制生命周期中的 `componentDidUpdate` 了。

另外最后的 `constructor` 生命周期，也完全可以在 `return` 组件之前实现。

> 注意点:
>
> 1. useEffect 必须在函数的最外层上下文中调用，不能把其嵌入到条件判断、循环语句中去！！！
> 2. useEffect 回调函数的返回函数，不能是异步函数！！！即不能返回一个 promise，否则会报错。

## useContext

解决的是类组件中组件内共享 `Context` 的方法。它用于在函数组件中访问上下文对象的值。它接受一个上下文对象，并返回上下文对象的当前值。

以下是 useContext Hook 的基本语法：

```js
const value = useContext(MyContext)
```

其中，`MyContext` 是一个上下文对象，`value` 是上下文对象的当前值。

使用 useContext Hook 可以帮助我们避免使用 props 层层传递数据的方式来访问上下文对象的值，并且让函数组件和类组件的上下文对象管理方式保持一致。

接下来，让我们看一个简单的例子，使用 useContext Hook 来实现主题色的切换功能：

```js
import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext() // 一般放在其它的独立文件中

function App() {
  const [theme, setTheme] = useState('light')

  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light') // 改变 theme, 此时给 ThemeContext 提供的 value 值也一同改变
  }

  return (
    // 将theme赋值进 ThemeContext
    <ThemeContext.Provider value={theme}>
      <div>
        <button onClick={handleToggleTheme}>Toggle Theme</button>
        <Toolbar />
      </div>
    </ThemeContext.Provider>
  )
}

function Toolbar() {
  const themeValue = useContext(ThemeContext) // 获取 ThemeContext 提供的 theme

  return (
    <div>
      <h1>Current Theme: {themeValue}</h1>
    </div>
  )
}
```

在上述代码中，我们定义了一个名为 `ThemeContext` 的上下文对象，并使用 `createContext` 函数创建了它。然后，我们定义了一个名为 `App` 的函数组件，并使用 `useState` Hook 在其中添加了一个 `theme` 状态。

接着，我们在 `App` 组件中使用 `ThemeContext.Provider` 组件将当前的主题色值传递给子组件。其中，`handleToggleTheme` 方法用于切换主题色的值。

最后，在 `Toolbar` 组件中，我们使用 `useContext` Hook 来获取当前的主题色值，并渲染到页面上。

需要注意的是，只有在 Provider 组件的祖先节点中使用 useContext Hook 才能获取到正确的上下文对象的值。

## useReducer

很多人看到 `useReducer` 的第一反应应该是 `redux` 的某个替代品，其实并不是。`useReducer` 仅仅是 `useState` 的一种替代方案，它用于在函数组件中管理复杂的状态逻辑。它接受一个回调函数和一个初始值，并返回当前状态和更新状态的函数。

简单理解: useReducer 就是收集所有操作某一个数据的「方案」；dispatch 就是派发器，依据传入的不同操作类型，去调用不同的逻辑。

以下是 useReducer Hook 的基本语法：

```jsx
const [state, dispatch] = useReducer(reducer, initialState)
```

其中，`reducer` 是一个回调函数，用于根据不同的 action 更新状态，`initialState` 是状态的初始值，`state` 表示当前状态的值，`dispatch` 是更新状态的派发器函数。

使用 useReducer Hook 可以帮助我们避免使用 `class` 组件和 `this.setState()` 方法来管理复杂的状态逻辑，并且让函数组件和类组件的状态管理方式保持一致。

接下来，让我们看一个简单的例子，使用 useReducer Hook 来实现计数器的功能：

```jsx
import { useReducer } from 'react';

function reducer(state, action) { // action 中包含 type 和 num 的载荷
  switch (action.type) {
    case 'increment':
      return { ...state, counter: state.counter + 1};
    case 'decrement':
      return { ...state, counter: state.counter - action.num};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { counter: 0 });

  const handleIncrement = () => {
    dispatch({ type: 'increment' });
  };

  return (
    <div>
      <h1>{ state.counter }</h1>
      <button onClick={handleIncrement}>+</button>
      <button onClick={e => dispatch({type: "decrement", num: 10}>-10</button>
    </div>
  );
}
```

在上述代码中，我们定义了一个名为 `Counter` 的函数组件，并使用 `useReducer` Hook 在其中添加了一个 `counter` 状态。然后，我们提供了一个名为 `reducer` 的回调函数，用于根据不同的 action 更新状态。

接着，我们提供了两个更新状态的方法 `handleIncrement` 和 箭头函数`decrement` 递减函数，分别用于增加和减少计数器的值，并通过 dispatch 函数将对应的 action 传递给 reducer 函数。

最后，在组件的返回值中，我们渲染了当前的计数器值和两个按钮，并将更新状态的方法绑定在了对应的按钮上。

可以看到，**这里的数据是不会与其它组件共享的，因此无法替代 Redux。**

`useReducer` 适用于管理较小和简单的状态，例如表单数据、计数器等。它是 React 内置的 Hook，可以轻松地将状态逻辑集成到组件中，并且与其他 Hook（如 useContext 和 useEffect）一起使用。

`Redux` 则适用于管理更大和复杂的状态，例如全局状态、异步请求等。它是一个单独的库，提供了强大的工具和扩展性来处理复杂的状态逻辑，并且可以与任何框架和库一起使用。

总的来说，如果应用程序比较小和简单，可以考虑使用 useReducer 替代 Redux。但如果应用程序比较大和复杂，需要更好的可维护性和扩展性，则需要使用 Redux。

## useRef

useRef 返回一个**ref 对象**，返回的 **ref 对象** 在组件的整个生命周期保持不变。**它用于在函数组件中保存和访问可变值。它接受一个初始值，并返回一个对象，其中 `current` 属性包含着*最近一次赋值的值*。**

区别于 `React.createRef()` ，useRef 在每一次组件更新时（组件重新执行），useRef 不会再创建新的 Ref 对象了，获取到的还是第一次创建的 Ref。`React.createRef()` 每次都会创建一个新的 Ref 对象，更耗费性能。

以下是 useRef Hook 的基本语法：

```jsx
const ref = useRef(initialValue)
```

其中，`initialValue` 是 useRef Hook 的初始值，**`ref.current` 包含着最近一次赋值的值**。

使用 useRef Hook 可以帮助我们避免在重新渲染时丢失变量的值，并且可以在组件之间共享可变值。

接下来，让我们看两个常用场景的简单例子，使用 useRef Hook 来保存和访问组件的上一个状态和 DOM 元素的引用。

1. 使用 useRef Hook 来保存和访问组件的上一个状态，常用语解决闭包陷阱（异步不更新 state 值，依旧保留当时的值）：

```jsx
import { useState, useRef, useEffect } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  const prevCountRef = useRef() // 初始定义 { current: undefined }

  useEffect(() => {
    prevCountRef.current = count // 赋值为 0
  }, [count])

  const handleIncrement = () => {
    setCount(count + 1)
  }

  const alertFn = () => {
    setTimeout(() => {
      // alert(count) // count 值类型, 不更新
      alert(prevCountRef.current) // ref 引用类型
    }, 3000)
  }

  return (
    <div>
      <h1>Current Count: {count}</h1>
      <h2>Previous Count: {prevCountRef.current}</h2>
      <button onClick={handleIncrement}>+</button>
      <button onClick={alertFn}>异步更新</button>
    </div>
  )
}
```

在上述代码中，我们定义了一个名为 `Counter` 的函数组件，并使用 `useState` Hook 在其中添加了一个 `count` 状态。然后，我们使用 `useRef` Hook 在组件中添加了一个 `prevCountRef` 引用。

在 `useEffect` Hook 中，我们将当前的计数器值保存到 `prevCountRef.current` 中，以便在下一次渲染时访问。

最后，在组件的返回值中，我们渲染了当前的计数器值、上一个计数器值和一个按钮，并将更新状态的方法绑定在了对应的按钮上。

2. 使用 useRef Hook 来保存和访问 DOM 元素的引用：

```jsx
import { useRef, useEffect } from 'react'

function Input() {
  const inputRef = useRef(null) // 初始定义 { current: null }, 后续被绑定到组件上, current 值为组件 DOM 节点

  useEffect(() => {
    inputRef.current.focus() // 使得焦点聚集到 input 的输入框
  }, [])

  function showInputValue() {
    console.log('input 输入值为:', inputRef.current.value)
  }

  return (
    <div>
      <label htmlFor="input">Input: </label>
      <input id="input" type="text" ref={inputRef} />
      <button onClick={showInputValue}>查看input 输入值</button>
    </div>
  )
}
```

在上述代码中，我们定义了一个名为 `Input` 的函数组件，并使用 `useRef` Hook 在其中添加了一个 `inputRef` 引用。

在 `useEffect` Hook 中，我们将焦点设置到了 `inputRef.current` 即 input 元素中。

最后，在组件的返回值中，我们渲染了一个输入框，并将 `inputRef` 绑定到了 input 元素的 `ref` 属性上。

以上的案例还看不出 `useRef` 的好处，实际上它还可以用于性能优化，解决闭包陷阱。看接下来的 useCallback Hook。

## useCallback

`useCallback` 就是用来进行性能优化的。**它用于在函数组件中缓存一个回调函数。它接受一个回调函数和依赖列表，并返回一个缓存的回调函数。**

以下是 useCallback Hook 的基本语法：

```jsx
const memoizedCallback = useCallback(() => {
  // do something...
}, [dependencies])
```

其中，`memoizedCallback` 是缓存后的回调函数，`dependencies` 是可选的依赖列表，用于控制回调函数的缓存时机。

使用 useCallback Hook 可以帮助我们避免在每次渲染时重新创建回调函数，并且可以优化子组件的渲染性能。

接下来，让我们看一个简单的例子，使用 useCallback Hook 来缓存一个更新状态的方法：

```jsx
import { useState, useCallback } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  const handleIncrement = useCallback(() => {
    setCount(count + 1)
  }, [count])

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={handleIncrement}>+</button>
    </div>
  )
}
```

在上述代码中，我们定义了一个名为 `Counter` 的函数组件，并使用 `useState` Hook 在其中添加了一个 `count` 状态。

然后，我们使用 `useCallback` Hook 缓存了一个名为 `handleIncrement` 的更新状态的方法，并将 `count` 添加到依赖列表中。这样，每次 `count` 发生变化时，都会重新缓存 `handleIncrement` 方法。

最后，在组件的返回值中，我们渲染了当前的计数器值和一个按钮，并将缓存的更新状态的方法绑定在了对应的按钮上。

### useEffect 和 useCallback 的区别

从上面的案例可以看出，它和 `useEffect` 很像，但实际上俩者的用途和实现方式并不同。

`useCallback` 主要用于缓存回调函数，可以优化子组件的渲染性能，而 `useEffect` 主要用于管理副作用（如订阅、数据获取等）并响应组件的生命周期。

具体来说，`useCallback` 返回一个缓存过的回调函数，避免了在每次渲染时重新创建回调函数的开销，从而提高了组件的性能。`useEffect` 在每次组件渲染后执行一段副作用代码，例如数据获取或订阅事件等，还可以在组件卸载前清理副作用。

需要注意的是，**由于`useCallback`的缓存依赖列表可能与`useEffect`的依赖列表不同，因此在使用两者时需要谨慎处理依赖关系，以避免出现意外行为和性能问题。**

总的来说，`useCallback` 和 `useEffect` 是针对不同的场景和目的而设计的 Hook，开发者需要根据实际情况灵活选择使用。

### 闭包陷阱

先看一个定义，闭包陷阱指的是在 JavaScript 中，内部函数可以访问外部函数作用域中的变量，并将其绑定为自己的属性，从而形成一个闭包。如果不小心处理闭包会导致意外的行为和性能问题。

在 React 组件中，使用传统的回调函数可能会捕获不必要的 props 或 state 变量，从而导致组件重新渲染，甚至出现死循环等问题，这也是闭包陷阱的一种表现形式。

举一个案例：

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  const handleIncrement = () => {
    setCount(count + 1)
  }

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setTimeout(handleIncrement, 1000)}>+</button>
    </div>
  )
}
```

在上述代码中，我们定义了一个名为 `Counter` 的函数组件，并使用 `useState` Hook 在其中添加了一个 `count` 状态。

然后，在组件的返回值中，我们渲染了当前的计数器值和一个按钮，并将 `handleIncrement` 回调函数绑定在了对应的按钮上。当点击该按钮时，会触发一个 `setTimeout` 函数，延迟一秒钟执行 `handleIncrement` 函数。

这里的问题是，由于 `handleIncrement` 回调函数捕获了父级作用域中的 `count` 变量，而并没有传递给 `setTimeout` 函数内部，所以当一秒钟后 `handleIncrement` 被执行时，它引用的还是最初的 `count` 值，而不是最新的 `count` 值，从而导致计数器不会增加。

这就是闭包陷阱的一种常见表现形式。为了解决这个问题，我们可以使用 `useCallback` 将 `handleIncrement` 缓存起来，并将最新的 `count` 值添加到依赖项数组中。这样，每次 `count` 发生变化时，`useCallback` 都会重新缓存回调函数，避免了因为闭包陷阱导致的意外行为。

解决办法：

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  const handleIncrement = () => {
    // setCount(count + 1); // 不用 count 原值进行更改
    setCount((prevCount) => prevCount + 1) // 改用其它变量, 缓存上一个状态值
  }

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setTimeout(handleIncrement, 1000)}>+</button>
    </div>
  )
}
```

函数形式的 `setCount` 接受一个回调函数作为参数，该回调函数会接收上一个状态值作为参数，并返回新的状态值。这样，我们就可以保证回调函数内部使用的是最新的状态值，并且不必担心因为闭包陷阱导致的问题。

在上面的示例中，我们将前一个状态值命名为 `prevCount`，这个名称并不是固定的，你可以任意取一个有意义的名称。然后，我们返回的新状态值是 `prevCount + 1`，即前一个状态值加上 1。

这样，每次调用 `handleIncrement` 函数时，它都会使用最新的状态值，并将其加上 1，从而实现计数器的自增功能。

此外，`useCallback` 是 React 18 中解决这个问题的主要手段之一，它通过缓存回调函数并在依赖项发生变化时进行更新，避免了因为闭包陷阱造成的不必要的组件重新渲染。

具体来说，当创建一个回调函数时，`useCallback` Hook 会检查回调函数中是否引用了父级作用域中的变量，如果引用了，则会将这些变量添加到一个依赖项数组中。然后，每当依赖项发生变化时，`useCallback` 会重新缓存回调函数，从而保证使用最新的依赖项。

例如，在下面的示例中， `useCallback` 缓存了一个回调函数，并使用 `count` 作为依赖项：

```jsx
const memoizedCallback = useCallback(() => {
  console.log(count)
}, [count])
```

如果 `count` 发生变化，`useCallback` 将会重新缓存回调函数，并在下一次组件渲染时使用最新的 `count` 值。

通过使用 `useCallback`，我们可以避免因为闭包陷阱导致的不必要组件重新渲染，提高应用程序的性能和稳定性。

### 进一步优化 useCallback

实际上，上述代码依旧有性能问题，`useCallback` 返回的是回调函数，也就是如果 `count` 不变则这个回调函数不应该被重新定义。`memoizedCallback` 永远等于回调函数 `() => console.log(count)` 。可以看到的是，就算 `count` 改变了，我们也不应当重新定义 `memoizedCallback` 这个回调函数。那如何去优化呢？

可以遇见的是，有人会将 `useCallback` 的第二个依赖列表参数设置为空数组，这样回调函数只会定义一次。但是这样就会发生回调陷阱：

```jsx
const memoizedCallback = useCallback(() => {
  console.log(count) // 此时传入的 count 为其初始值
}, [])

memoizedCallback() // count 初始值
```

后期调用的 `memoizedCallback` 回调函数，其内部存储的 `count` 值将**永远是它的初始值**。这不是我们希望看到的。因此可以引入 `useRef`，`useRef` 返回的是一个对象，所以改变其内部的 `current`值，是可以被监听到的。

```jsx
const App = memo(function () {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('hello')

  const countRef = useRef() // 定义一个 Ref 对象
  countRef.current = count // 将对象内的 current 值赋值为 count

  const increment = useCallback(function foo() {
    console.log('increment')
    setCount(countRef.current + 1) // 通过 countRef.current 存储 counter 的值
  }, [])

  return (
    <div>
      <h2>计数: {count}</h2>
      <button onClick={increment}>+1</button>
    </div>
  )
})
```

## useMemo

`useMemo` 也是为了性能优化而设置的，它用于优化组件渲染性能，避免不必要的计算。

`useMemo` 接受一个工厂函数和一个依赖项数组作为参数，并返回根据工厂函数计算得到的值。在依赖项发生变化时，`useMemo` 会重新计算该值，并将其缓存起来以备下一次使用，从而减少重复计算的开销。

具体来说，如果没有定义第二个依赖项数组（注意，未定义不是空数组），`useMemo` 在每次组件渲染时都会执行一次工厂函数。同时，`useMemo` 也可以通过依赖项数组控制何时需要重新计算值，避免不必要的计算和组件重新渲染。（有点类似于 Vue 中的 watch 函数）

以下是一个简单的例子，展示了如何使用 `useMemo` 来优化组件渲染性能：

```jsx
import { useMemo, useState } from 'react'

function ExpensiveComponent(props) {
  const [count, setCount] = useState(0)

  const expensiveValue = useMemo(() => {
    console.log('Calculating expensive value...')
    let result = 0
    for (let i = 0; i < count * 10000000; i++) {
      result += Math.random()
    }
    return result
  }, [count])

  return (
    <div>
      <h1>Expensive Value: {expensiveValue}</h1>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
    </div>
  )
}
```

在上面的代码中，我们定义了一个名为 `ExpensiveComponent` 的组件，并使用 `useState` Hook 在其中添加了一个 `count` 状态。然后，我们使用 `useMemo` Hook 缓存了一个计算成本较高的值。

在工厂函数内部，我们模拟了一段耗时的计算过程，并将结果保存在变量 `result` 中。在依赖项列表中，我们将 `count` 添加为依赖项，这意味着只有当 `count` 发生变化时才需要重新计算 `expensiveValue` 值。

最后，在返回值中，我们渲染了计算得到的 `expensiveValue` 值和一个按钮，并在按钮被点击时增加 `count` 值。

由于 `useMemo` 的缓存机制，只有在 `count` 发生变化时才会重新计算 `expensiveValue` 值，从而避免了不必要的计算和组件重新渲染，提高了应用程序的性能和稳定性。

### useMemo 和 useCallback 的区别

`useMemo` 和 `useCallback` 在 React 中都是用于优化组件性能的 Hook，它们的作用相似但略有不同。

`useMemo` 用于**缓存一些昂贵的计算结果，只有在依赖项发生变化时才重新计算**。它接受一个工厂函数和一个依赖项数组作为参数，并返回根据工厂函数计算得到的值。当依赖项数组中的任何一个元素发生变化时，`useMemo` 会重新计算该值，并将其缓存起来以备下一次使用。

例如，在以下代码中，我们可以通过 `useMemo` 缓存一个由 `props.firstname` 和 `props.lastname` 计算得到的值：

```jsx
import { useMemo } from 'react'

function MyComponent(props) {
  const result = useMemo(() => {
    console.log('Calculating result...')
    return props.firstname + props.lastname
  }, [props.firstname, props.lastname])

  return <div>Result: {result}</div>
}
```

`useCallback` 用于**缓存回调函数**，并防止在每次渲染时重新创建新的回调函数。它接受一个回调函数和一个依赖项数组作为参数，并返回一个缓存了的回调函数。当依赖项数组中的任何一个元素发生变化时，`useCallback` 会返回一个新的回调函数。

例如，在以下代码中，我们可以通过 `useCallback` 缓存一个处理点击事件的回调函数：

```jsx
import { useCallback } from 'react'

function MyComponent(props) {
  const handleClick = useCallback(() => {
    console.log('Button clicked!')
  }, [])

  return <button onClick={handleClick}>Click me</button>
}
```

因此，`useMemo` 和 `useCallback` 的区别在于它们缓存的对象类型不同：**`useMemo`缓存的是计算结果，而 `useCallback`缓存的是回调函数。** 但是，它们都可以通过依赖项数组来控制何时需要重新计算或创建新的对象，以避免不必要的计算和组件重新渲染，提高应用程序的性能和稳定性。

需要注意的是，在使用 `useMemo` 和 `useCallback` 时，我们需要合理地选择依赖项数组中的元素，以确保它们准确反映了所依赖的状态和属性的变化情况。同时，我们也要注意不要过度进行优化，以避免代码可读性和维护性的降低。

## useImperativeHandle

`useImperativeHandle` 它允许我们在父组件中通过 Ref **访问子组件的特定方法或属性**。这个 Hook 常常与 `forwardRef` 方法一起使用。

```jsx
useImperativeHandle(ref, createHandle, [deps])
```

1. `ref`：需要被赋值的`ref`对象。
2. `createHandle`：`createHandle`函数的返回值作为`ref.current`的值。该对象包含可以暴露给父组件的方法和属性。
3. `[deps]`：依赖数组，依赖发生变化会重新执行`createHandle`函数。

在 `useImperativeHandle` 内部，我们可以选择性地指定一个依赖项数组来控制何时需要更新暴露给父组件的方法和属性。如果没有指定依赖项数组，那么每次渲染时都会重新计算暴露给父组件的内容，并更新 Ref 对象。

以下是一个简单的例子，展示了如何使用 `useImperativeHandle` 在子组件中暴露一个名为 `focusInput` 的方法：

```jsx
import { forwardRef, useImperativeHandle, useRef } from 'react'

const MyInput = forwardRef((props, ref) => {
  const inputRef = useRef()

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef.current.focus()
    },
  }))

  return <input type="text" ref={inputRef} />
})

export default MyInput
```

在上面的代码中，我们首先使用 `useRef` Hook 创建了一个名为 `inputRef` 的 Ref 对象，用于保存输入框的 DOM 引用。

然后，我们使用 `useImperativeHandle` Hook 将一个名为 `focusInput` 的方法暴露给父组件。该方法通过调用 `inputRef.current.focus()` 来将输入框聚焦。

最后，我们使用 `forwardRef` 方法将 `MyInput` 组件转发 Ref 属性，并在输入框中使用 `ref={inputRef}` 将 Ref 对象绑定到输入框元素上。

在父组件中，我们可以通过 Ref 访问子组件中暴露的 `focusInput` 方法，并在需要时手动调用该方法，以将输入框聚焦：

```jsx
import MyInput from './MyInput'

function ParentComponent() {
  const inputRef = useRef()

  const handleClick = () => {
    inputRef.current.focusInput()
  }

  return (
    <div>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>Focus Input</button>
    </div>
  )
}
```

在上面的代码中，我们定义了一个名为 `ParentComponent` 的父组件，并使用 `useRef` Hook 创建一个名为 `inputRef` 的 Ref 对象。然后，在渲染 `MyInput` 子组件时，我们将 Ref 对象传递给子组件并绑定到输入框元素上。

最后，在返回值中，我们渲染了一个按钮，并在按钮被点击时调用 `inputRef.current.focusInput()` 方法，将输入框聚焦。

## useLayoutEffect

`useLayoutEffect` 非常类似于 `useEffect`，区别是，**`useLayoutEffect`中注册的回调函数会在 React 完成更新 DOM 后、浏览器布局和绘制之前立即执行。** 这意味着在 `useLayoutEffect` 中的代码可以改变 DOM，并且这些 DOM 变更将在用户看到任何更新之前生效。因此会早于 useEffect 执行。

使用 `useLayoutEffect` 时需要格外小心，因为它可能会导致应用程序性能问题。如果没有必要在布局计算之前同步更新 DOM，请考虑使用 `useEffect` 来代替。

以下是一个简单的例子，展示了如何使用 `useLayoutEffect` 在组件渲染后立刻更新 DOM：

```jsx
import { useLayoutEffect, useRef } from 'react'

function MyComponent() {
  const containerRef = useRef()

  useLayoutEffect(() => {
    console.log('Updating DOM...')
    containerRef.current.style.color = 'red'
  }, [])

  return <div ref={containerRef}>Hello, World!</div>
}
```

在上面的代码中，我们定义了一个名为 `MyComponent` 的组件，并使用 `useRef` Hook 创建了一个名为 `containerRef` 的 Ref 对象。

然后，在 `useLayoutEffect` 中注册一个回调函数，该函数会在组件渲染后立即执行，并将 `containerRef.current.style.color` 设置为 `'red'`，以改变容器的文本颜色。

最后，在返回值中，我们渲染了一个包含文本内容的 `div` 元素，并将 Ref 对象绑定到该元素上。

![useEffect 和 useLayoutEffect 执行顺序区别](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202502172323425.png)

需要注意的是，由于 `useLayoutEffect` 中的 DOM 操作会在浏览器布局和绘制之前同步执行，因此应该尽可能避免在 `useLayoutEffect` 中进行昂贵的计算或长时间运行的操作，以确保应用程序的性能和稳定性。

原因在于，视图更新的步骤为：

1. 基于 babel-preset-react-app 将 jsx 编译为 createElement 格式；
2. 执行 createElement，创建出 virtualDOM；
3. 基于 root.render 方法把 virtualDOM 变为真实 DOM 对象「DOM-DIFF」；
4. 浏览器渲染和绘制真实 DOM 对象。

而 useLayoutEffect 是在第三步之后，会先去支持 effect 链表中的方法，造成阻塞，即它是「同步操作」。

useEffect 是在第三步之后，同第四步操作一起执行 effect 链表中的方法，不会阻塞第四步操作，即它是「异步操作」。

## 自定义 Hook

自定义 Hook 是一种将复用逻辑封装为可重用函数的方式，以便在 React 组件中使用。自定义 Hook 本质上是一个函数，它可以使用任何 React Hook（如 `useState`、`useEffect`、`useContext` 等），并可以根据特定的需求返回数据或执行操作。

自定义 Hook 的命名应该以 `use` 开头，这是为了告诉开发人员该函数是一个 Hook 并且可以与其他 Hook 一样使用。还可以在自定义 Hook 中使用其他自定义 Hook，以构建更高层次的抽象。

以下是一个简单的例子，展示了如何创建一个名为 `useWindowWidth` 的自定义 Hook，用于跟踪浏览器窗口的宽度：

```jsx
import { useState, useEffect } from 'react'

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize) // 监听事件

    return () => {
      window.removeEventListener('resize', handleResize) // 注销事件
    }
  }, [])

  return width
}
```

在上面的代码中，我们定义了一个名为 `useWindowWidth` 的自定义 Hook，并使用 `useState` 和 `useEffect` Hook 来创建一个名为 `width` 的状态和一个名为 `handleResize` 的事件处理程序。

然后，在 `useEffect` 中注册了一个事件监听器，当浏览器窗口大小改变时，会调用 `handleResize` 方法并更新 `width` 状态。在组件卸载时，我们使用 `useEffect` 的清除函数清理监听器。

最后，我们从自定义 Hook 中返回 `width` 状态，以便在 React 组件中使用。

以下是一个示例，演示了如何在 React 组件中使用 `useWindowWidth` 自定义 Hook：

```jsx
import { useWindowWidth } from './useWindowWidth'

function MyComponent() {
  const width = useWindowWidth()

  return <div>Window width is {width}px</div>
}
```

在上面的代码中，我们定义了一个名为 `MyComponent` 的 React 组件，并调用了 `useWindowWidth` 自定义 Hook 来获取当前浏览器窗口的宽度。

然后，在渲染结果中，我们将该值显示为字符串模板，以便用户可以看到当前窗口的宽度。

## 第三方 Hooks

国内流行的是 [aHooks](https://ahooks.js.org/zh-CN)由阿里巴巴开源，国外较为流行的是[react-use](https://github.com/streamich/react-use)
