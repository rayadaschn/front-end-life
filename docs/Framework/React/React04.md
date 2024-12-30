---
title: React之数据管理 Redux
icon: react
date: 2023-03-23
category:
  - 框架
tag:
  - React
star: true
sticky: false
---

## JavaScript 中的纯函数

在 JavaScript 中，纯函数是指具有以下两个特性的函数：

1. 相同的输入总是返回相同的输出
2. 函数执行期间没有副作用，也就是说它不会修改任何在函数作用域外部的状态，如全局变量、输入参数、引用参数等。

因为纯函数的输出仅仅由输入决定，所以它们在并发编程和缓存数据等方面非常有用。由于不会修改外部状态，纯函数通常比有副作用的函数更容易测试、调试和优化。

```js
function sum(a, b) {
  return a + b
}
```

这个函数只是将输入的两个数字相加，它没有副作用，也不会修改任何外部变量或状态。每次调用 `sum` 函数时，给定相同的参数，它总是返回相同的结果。这就使得它成为一个纯函数。

```js
let total = 0
function addToTotal(num) {
  total += num
  return total
}
```

这个函数有副作用，因为它修改了外部变量 `total`。每次调用 `addToTotal` 函数时，给定相同的参数，它返回不同的结果，因为它会修改全局变量。因此，这个函数不是一个纯函数。

## JavaScript 中的副概念

在 JavaScript 中，副作用指的是函数执行期间对除函数作用域内部的状态进行了修改或对外部环境产生了可观察的影响。副作用是指对函数外部状态的任何修改，包括但不限于：

- 修改全局变量或对象属性
- 修改参数或引用对象的属性
- 执行 I/O 操作，如读取文件或修改数据库
- 抛出异常或改变控制流程
- 调用其他有副作用的函数

函数的副作用可能会对代码的可读性、可维护性和可测试性产生负面影响。特别是在多线程和分布式系统中，副作用可能导致非常难以诊断的错误。

函数式编程是一种强调避免副作用的编程范式。在函数式编程中，更倾向于使用纯函数，因为它们不会产生副作用。这使得函数式编程更加模块化、可组合和易于测试。

## 什么是 Redux?

[Redux](https://cn.redux.js.org/) 是一种用于管理应用程序状态的 JavaScript 库。它可以在 React、Angular、Vue 或任何其他 JavaScript 应用程序中使用。Redux 通过强制将应用程序的状态存储在单个全局对象中来简化状态管理。这个全局状态对象是只读的，唯一可以更改它的方式是通过发出“操作”来修改它。操作是一个纯 JavaScript 对象，描述了发生了什么类型的更改以及需要更新状态的数据。

### 哪些数据需要 Redux 进行维护呢?

- UI 相关的组件内部可以维护的状态，在组件内部自己来维护；
- 只要是需要共享的状态，都交给 redux 来管理和维护；
- 从服务器请求的数据（包括请求的操作），交给 redux 来维护；

Redux 的工作方式可以概括为三个步骤：

1. 将应用程序状态存储在一个全局对象中
2. 通过“操作”描述要更改的状态
3. 通过“操作”修改状态

Redux 的核心概念包括：

1. **Store**: 存储应用程序的状态，是一个只读的 JavaScript 对象。
2. **Action**: 描述发生的更改的纯 JavaScript 对象。需要注意的是，所以的数据变化，都必须通过派发（dispatch）action 来更新。
3. **Reducer**: 接收旧状态和操作对象，并返回新状态的纯函数。简单的说，`reducer`就是一个纯函数，作用就是将传入的 state 和 action 结合起来生成一个新的 state。
4. **Dispatch**: 触发操作以更改应用程序状态的函数。

Redux 可以帮助开发人员有效地管理复杂的应用程序状态，提高应用程序的可维护性和可测试性。

### Redux 的三大原则

Redux 的三大原则是：

1. **单一数据源**：应用程序的所有状态都存储在单个全局状态树中，这使得状态的管理变得简单且一致。这也使得状态的变化可预测，因为应用程序中的任何状态变化都是通过操作发起的，这些操作以明确的方式描述了要更改的状态。
2. **状态不可变**：状态是只读的，不允许在原处修改。相反，当状态需要更改时，Redux 使用纯函数 (Reducers) 来创建新状态对象。这确保了状态的可预测性和一致性，因为任何修改状态的尝试都会导致创建新的状态对象。
3. **纯函数修改状态**：状态的变化由纯函数 (Reducers) 处理。这些函数接收旧状态和操作对象作为参数，并返回一个新状态对象。由于 Redux 使用纯函数修改状态，因此它使得应用程序状态更容易调试和测试，并且它的行为更容易预测和维护。

### Redux 使用方法

1. 安装 Redux：可以使用 npm 或 yarn 安装 Redux。

   ```bash
   $: npm install redux
   # 或者
   $: yarn add redux
   ```

2. 创建一个存储状态的 store：使用 Redux 的 `createStore` 方法创建一个 store，并将一个 reducer 传递给它。

   ```js
   // index.js
   import { createStore } from 'redux'
   import { reducer } from './reducers'

   export const store = createStore(reducer)
   ```

3. 创建 reducer 函数：一个 reducer 函数是一个纯函数，它接收旧状态和一个 action，然后返回一个新状态。

   ```js
   // reducer.js
   // 创建初始数据
   const initialState = {
     name: 'Redux',
     count: 0,
   }

   // 参数一: store中目前保存的state
   // 参数二: 本次需要更新的action(dispatch传入的action), 本质上是一个对象
   // 返回值: 它的返回值会作为store之后存储的state
   export function reducer(state = initialState, action) {
     switch (action.type) {
       case 'INCREMENT':
         return { ...state, count: state.count + action.num } // 为了数据单一性,此处的 state 需要进行结构
       case 'DECREMENT':
         return { ...state, count: state.count - action.num }
       default:
         // 没有新数据更新, 那么返回之前的state
         return state
     }
   }
   ```

4. 创建 action：一个 action 是一个简单的 JavaScript 对象，它包含一个 `type` 属性和一些数据，用于描述要执行的操作。

   ```js
   // actionCreators.js 储存 action
   export const incrementAction = (num) => ({ type: 'INCREMENT', num })
   export const decrementAction = (num) => ({ type: 'DECREMENT', num })
   ```

5. 发送 action：要更新状态，需要通过 `store.dispatch` 方法发送一个 action。

   ```js
   // 修改 store 中的数据
   import { store } from './index'
   import { incrementAction, decrementAction } from 'actionCreators.js'

   store.dispatch(incrementAction(10)) // 真正执行改变的操作
   store.dispatch(decrementAction(20))
   ```

6. 订阅状态变化：通过 `store.subscribe` 方法订阅 store 中状态的变化。

   ```js
   import { store } from './index'
   store.subscribe(() => {
     // 数据变化,自动执行该函数
     console.log(store.getState())
   })
   ```

7. 使用 store 中的数据，通过 `store.getState()`。

   ```js
   import { store } from './index'
   console.log(store.getState())
   ```

### 在组件中使用 Redux

这里要用到 React 专用的 Redux 库 [React-Redux](https://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_three_react-redux.html)，内部封装了很多便利 API。
从上述流程中，可以知道想要获取动态变化的 `store` 中的数据，需要借助 `store.subscribe` 订阅方法。通常这一步是在生命周期 `componentDidMount` 的中进行订阅绑定。而后正常使用：

```jsx
import store from '../store'
import { addNumberAction } from '../store/actionCreators'

export class App extends PureComponent {
  constructor() {
    super()
    // 获取 store 中的数据
    this.state = {
      counter: store.getState().counter,
    }
  }

  componentDidMount() {
    // 订阅数据, 实时监听数据变化
    store.subscribe(() => {
      const state = store.getState()
      this.setState({ counter: state.counter })
    })
  }

  addNumber(num) {
    // 更新数据变化
    store.dispatch(addNumberAction(num))
  }

  render() {
    const { counter } = this.state // 解构获取 counter 数据

    return (
      <div>
        <h2>展示 App 中的 Counter: {counter}</h2>
        <button onClick={(e) => this.addNumber(1)}>+1</button>
      </div>
    )
  }
}
```

可以看出，这样的操作较为复杂，因此 React 提供了一个 `connect` api，它会返回一个高阶组件（Higher Order Component，HOC），用于连接 React 组件与 Redux store。它是 React-Redux 库提供的一个重要 API，通过它我们可以将 Redux store 中的数据和方法传递给组件，从而实现组件的数据状态管理。

`connect` 的作用可以简单地概括为：将 Redux store 中的数据和方法映射到组件的 props 中。 通过 `connect`，我们可以让组件访问 Redux store 中的数据，并将 store 中的更新操作转换为组件的 props 属性，从而实现组件的重新渲染。

`connect` 接受两个参数：`mapStateToProps` 和 `mapDispatchToProps`。它们分别用于将 Redux store 中的 state 和 action 映射到组件的 props 中。

- `mapStateToProps` 函数用于将 Redux store 中的 state 映射到组件的 props 中。这个函数接受一个参数 `state`，它表示当前的 Redux store 的 state。`mapStateToProps` 函数返回一个对象，对象的属性即为要传递给组件的 props，属性的值则是从 Redux store 中取出的数据。

  ```js
  const mapStateToProps = (state) => {
    return {
      count: state.count,
    }
  }
  ```

  上述代码中，`mapStateToProps` 函数返回了一个对象，该对象的 `count` 属性表示 Redux store 中的 `count` 属性，它会被映射到组件的 props 中。

- `mapDispatchToProps` 函数用于将 Redux store 中的 action 映射到组件的 props 中。这个函数接受一个参数 `dispatch`，它是 Redux store 的 dispatch 方法。`mapDispatchToProps` 函数返回一个对象，对象的属性即为要传递给组件的 props，属性的值则是一个函数，用于将 action 分发到 Redux store 中。

  ```js
  const mapDispatchToProps = (dispatch) => {
    return {
      increment: (num) => dispatch({ type: 'INCREMENT', num }),
      decrement: (num) => dispatch({ type: 'DECREMENT', num }),
    }
  }
  ```

  上述代码中，`mapDispatchToProps` 函数返回了一个对象，该对象的 `increment` 和 `decrement` 属性分别表示了两个分发 action 的函数，它们会被映射到组件的 props 中。

最后，我们可以使用 `connect` 函数将 `mapStateToProps` 和 `mapDispatchToProps` 函数与 React 组件进行连接，从而实现数据和方法的传递。例如：

```jsx
import { connect } from 'react-redux'

export class App extends PureComponent {
  calcNumber(num, isAdd) {
    // 处理更新 counter
    if (isAdd) {
      console.log('加', num)
      this.props.increment(num)
    } else {
      console.log('减', num)
      this.props.decrement(num)
    }
  }

  render() {
    const { counter } = this.props // 从 this.props 中取出 store 中的数据

    return (
      <div>
        <h2>About Page: {counter}</h2>
        <div>
          <button onClick={(e) => this.calcNumber(6, true)}>+6</button>
          <button onClick={(e) => this.calcNumber(8, false)}>-8</button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    counter: state.counter,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    increment: (num) => dispatch({ type: 'INCREMENT', num }),
    decrement: (num) => dispatch({ type: 'DECREMENT', num }),
  }
}

// 通过 connect 将 mapStateToProps 和 mapDispatchToProps 俩个高阶函数映射到 App 组件的 props 中
export default connect(mapStateToProps, mapDispatchToProps)(App)
```

此外，`connect`方法生成容器组件以后，需要让容器组件拿到`state`对象，才能生成 UI 组件的参数。React-Redux 提供`Provider`组件，可以让容器组件拿到`state`。

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { StoreContext } from './hoc'
import App from './App'
import store from './store'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <StoreContext.Provider value={store}>
      <App />
    </StoreContext.Provider>
  </Provider>
  // </React.StrictMode>
)
```

上面代码中，`Provider`在根组件外面包了一层，这样一来，`App`的所有子组件就默认都可以拿到`state`了。

> StoreContext 是其它高阶函数的 context

**redux 代码优化**:

1. 将派发的 action 生成过程放到一个`actionCreators`函数中；
2. 将定义的所有`actionCreators`的函数, 放到一个独立的文件中: `actionCreators.js` ；
3. `actionCreators`和`reducer`函数中使用字符串常量是一致的, 所以将常量抽取到一个独立`constants`的文件中；
4. 将`reducer`和默认值(`initialState`)放到一个独立的`reducer.js`文件中, 而不是在`index.js` ；

![Redux 流程图](https://www.ruanyifeng.com/blogimg/asset/2016/bg2016091802.jpg)

该流程图描述了 Redux 的基本流程，包括以下步骤：

1. 使用 `action` 触发状态的变化。
2. `store` 接收到 `action`，通过调用 `reducer` 来更新状态。
3. `reducer` 接收到 `action` 和当前状态，根据 `action` 的类型返回一个新的状态。
4. `store` 更新状态并通知所有订阅了该状态变化的组件。
5. 组件根据新的状态重新渲染。

需要注意的是，这里的状态更新是单向的，即只能通过 `action` 触发 `reducer` 来更新状态，而不能直接修改状态。这种单向数据流的设计是 Redux 的核心思想之一，它能够保证状态变化的可预测性和可维护性。

### Redux 处理异步函数

在 Redux 中，action 只能是一个普通的 JavaScript 对象，它描述了一个状态的变化，例如：

```js
const addTodoAction = {
  type: 'ADD_TODO',
  payload: {
    id: 1,
    text: 'Buy milk',
    completed: false,
  },
}

// dispatch the action
store.dispatch(addTodoAction)
```

这个 action 描述了一个添加待办事项的操作，它的 type 是 'ADD_TODO'，payload 是要添加的待办事项的具体内容。

但是，在实际的应用场景中，有很多操作是需要异步执行的，例如向服务器请求数据、操作浏览器的 DOM 等。**如果你直接在 action 中执行异步操作，那么这个 action 就不再是一个纯粹的 JavaScript 对象了，它会有一些副作用，例如会发起网络请求，或者访问浏览器的 DOM。**

这时候，就需要 Redux Thunk 中间件来解决这个问题。**Redux Thunk 允许 action 创造者（也就是 action creator 函数）返回一个函数，而不是一个普通的 JavaScript 对象。这个函数可以接受两个参数：`dispatch` 和 `getState`。在这个函数内部，你可以执行异步操作，并在操作完成后再次调用 `dispatch` 方法来发送一个新的 action，从而更新应用的状态。**

使用方法:

- 安装: `npm install redux-thunk` ；

- 在创建 store 时传入应用了 `middleware` 的 `enhance`函数；

- 将 `enhance` 函数(应用 redux-thunk 的中间件)作为第二个参数传入到 `createStore` 中；

  ```js
  import { createStore, applyMiddleware } from 'redux'

  const enhancer = applyMiddleware(thunkMiddleware)
  const store = createStore(reducer, enhancer)
  ```

  > 在上述代码中，`applyMiddleware` 是 Redux 提供的一个函数，用于将中间件应用于 Redux store。

- 定义异步 Action Creator，使用 Thunk 中间件的异步 Action Creator：，**注意：这里不再是返回一个对象，而是返回一个函数，函数的入参为 `dispatch`，并且该函数会在 `dispatch`之后被执行**。

  ```js
  // actions.js
  export const fetchData = () => {
    return (dispatch, getState) => {
      // 触发请求开始的 action
      dispatch({ type: 'FETCHING_DATA' })

      // 发起异步请求
      fetch('https://api.example.com/data')
        .then((response) => response.json())
        .then((data) => {
          // 请求成功，触发成功的 action
          dispatch({ type: 'FETCHING_DATA_SUCCESS', payload: data })
        })
        .catch((error) => {
          // 请求失败，触发失败的 action
          dispatch({ type: 'FETCHING_DATA_FAILURE', payload: error.message })
        })
    }
  }
  ```

下面是一个使用 `redux-thunk` 处理异步操作的完整示例代码：

```js
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer.js'

const store = createStore(reducer, applyMiddleware(thunk))
```

根据不同的 Action 类型更新状态：

```js
// reducer.js
const initialState = {
  isLoading: false,
  data: null,
  error: null,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCHING_DATA':
      return { ...state, isLoading: true }
    case 'FETCHING_DATA_SUCCESS':
      return { ...state, isLoading: false, data: action.payload }
    case 'FETCHING_DATA_FAILURE':
      return { ...state, isLoading: false, error: action.payload }
    default:
      return state
  }
}

export default reducer
```

在 Redux 中，中间件是一个函数，它可以在 action 被发起之后，到达 reducer 之前执行一些自定义的逻辑。中间件可以用来处理异步操作、日志记录、错误处理等任务。

`applyMiddleware` 接收一个或多个中间件作为参数，返回一个函数，这个函数接收一个 `createStore` 方法作为参数，返回一个被增强后的 `createStore` 方法。使用这个增强后的 `createStore` 方法创建 Redux store 时，中间件就会被应用。

最后在组件中使用异步 Action

结合 React Redux 的 `useDispatch` 和 `useSelector` 使用：

```js
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from './actions'

const DataComponent = () => {
  const dispatch = useDispatch()
  const { isLoading, data, error } = useSelector((state) => state) // Redux 的 state 结构由 reducer 决定, reducer 返回的 state 包含了这几个字段。useSelector 从 Redux Store 中提取的正是这个 state 对象。

  useEffect(() => {
    dispatch(fetchData()) // 触发异步操作
  }, [dispatch])

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h1>Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default DataComponent
```

在上面的代码中，`getData` 是一个 action 创建函数，它返回一个函数而不是一个简单的对象。在返回的函数中，我们可以进行异步操作，例如发送请求和处理响应。在请求成功或失败后，我们可以使用 `dispatch` 发送新的 action 来更新状态。在 `reducer` 中，我们可以根据不同的 action 类型来更新状态，例如在请求数据时更新 `isLoading` 状态，在请求成功时更新 `data` 状态，在请求失败时更新 `error` 状态。

需要注意的是，`redux-thunk` 并不是唯一的 Redux 中间件，还有许多其他的中间件可供选择，例如 `redux-saga` 和 `redux-observable` 等。这些中间件各有特点，可以根据实际需求进行选择。

### 合并多个 Reducer 函数

`combineReducers` 是 Redux 提供的一个辅助函数，用于合并多个 reducer 为一个单一的 reducer 函数。

在 Redux 中，reducer 负责根据 action 更新应用程序的状态。通常情况下，一个应用程序有多个 reducer，每个 reducer 只处理全局 state 树的一部分。因此，为了组合多个 reducer，Redux 提供了 `combineReducers` 函数。

`combineReducers` 接受一个对象作为参数，这个对象的键值对是多个 reducer 函数。它会返回一个新的 reducer 函数，这个函数会将每个 reducer 的返回值合并为一个新的状态对象。

例如，如果我们有两个 reducer 分别处理 todos 和 visibilityFilter 两个 state 的更新：

```js
function todosReducer(state = [], action) {
  // 处理 todos 状态的更新
}

function visibilityFilterReducer(state = 'SHOW_ALL', action) {
  // 处理 visibilityFilter 状态的更新
}
```

我们可以使用 `combineReducers` 将这两个 reducer 合并为一个：

```js
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  todos: todosReducer,
  visibilityFilter: visibilityFilterReducer,
})

export default rootReducer
```

这样，`rootReducer` 就可以处理 `todos` 和 `visibilityFilter` 两个状态的更新了。

需要注意的是，`combineReducers` 并不会修改传入的 reducer 函数。它会将每个 reducer 的返回值合并为一个新的状态对象，但不会修改每个 reducer 的内部逻辑。这也是 Redux 的设计哲学之一：保持 reducer 的独立性和可测试性。

### Redux 调试

Redux 为开发者提供了一个 Redux DevTools 的浏览器插件，它可以帮助开发者更方便地调试 Redux 应用程序。下面是使用 Redux DevTools 的一些步骤：

1. 安装 Redux DevTools 浏览器插件。Redux DevTools 提供了 Chrome 和 Firefox 版本的插件。安装好插件后，在浏览器的扩展程序中可以看到 Redux DevTools 的图标。
2. 在应用程序中安装 Redux DevTools 的相关中间件。Redux DevTools 提供了多个中间件，包括 `redux-devtools-extension`、`redux-logger`、`redux-thunk` 等。使用 `redux-devtools-extension` 中间件可以自动连接 Redux DevTools 插件。安装: `npm install redux-devtools-extension`（ 查看更多 [Redux-devtool-extension 的相关设置](https://github.com/zalmoxisus/redux-devtools-extension) ）

```js
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

let store
// Redux DevTools 调试工具只在开发环境才使用
if (process.env.NODE_ENV === 'development') {
  store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))
} else {
  store = createStore(rootReducer, applyMiddleware(thunk))
}

export default store
```

3. 打开浏览器，进入开发者工具。在浏览器中打开应用程序，然后按下 F12 键，进入开发者工具。
4. 打开 Redux DevTools 面板。在开发者工具中选择 Redux DevTools 面板，即可看到 Redux DevTools 的界面。

## Redux 的终极用法

上文中介绍了传统的 Redux 的用法，但是相对来说依旧较为繁琐，为此 React 官方提供了一个 Redux 工具包——**`reduxjs/toolkit`** 。它简化了 Redux 的使用，提供了一些内置的 API 和工具，让开发者更快、更方便地编写 Redux 应用。

其中包括以下特性：

1. 简化了 Redux 中的模板代码，如创建 Reducer 和 action creator 的样板代码。
2. 内置了常用的 Middleware，如 thunk 和 logger ，无需手动配置。
3. 提供了`createSlice`方法，可以通过一个简单的配置对象快速创建包含了 Reducer 和 action creator 的 Redux 模块。
4. 内置了 Immer 库，使得 Reducer 中的状态更新可以通过直接修改对象来完成，而无需手动编写不可变更新的代码。

安装: `npm install @reduxjs/toolkit react-redux`

`reduxjs/toolkit` 中几个核心 API 的简单介绍：

1. `createSlice()`：用于创建一个 Redux reducer，它可以根据指定的 state 初始值以及处理不同 action 的 reducer 函数，生成一个包含 reducer 函数以及相关 action 的对象。
2. `createAsyncThunk()`：用于创建一个异步的 Redux action creator。这个 action creator 可以接收一个 payloadCreator 函数，它会返回一个 Promise 对象，用于进行异步操作。
3. `configureStore()`：用于创建 Redux store，它可以帮助开发者自动配置常见的 Redux 中间件，如 Redux Thunk、Redux Logger 等，从而让开发者可以更方便地创建一个符合最佳实践的 Redux store。
4. `createEntityAdapter()`：用于创建一个 Entity Adapter 对象，用于处理 Redux store 中的实体数据（Entity Data），可以方便地进行增删改查等操作。

#### createSlice 的使用

createSlice 的主要作用是将 reducer 和 action creator 组合在一起，生成一个对象，对象中包含了定义 reducer 所需要的所有内容。下面是一个使用 `createSlice` 创建 reducer 的示例：

```jsx
import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
    incrementByAmount: (state, action) => state + action.payload,
    incrementByAmount2: (state, { payload }) => state + payload, // 直接对 payload 进行解构
  },
})

// 直接导出 action
export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer // 注意这里导出的是 Reducer 而不是 contentSlice
```

上面代码中，我们通过 `createSlice` 创建了一个名为 `counter` 的 reducer，并定义了它的初始状态为 `0`。同时，我们还定义了三个 action：`increment`、`decrement` 和 `incrementByAmount`。这三个 action 分别对应的 reducer 中的逻辑是，对状态进行加一、减一和加上指定值。

**`createSlice`方法的第一个参数是一个包含`name`、`initialState`和`reducers`的对象。**

- `name` 用于定义 reducer 的名称（在之后的 redux-devtool 中会显示对应的名词）；
- `initialState` 用于定义 reducer 的初始状态（第一次初始化时的值）；
- `reducers` 是一个对象，用于定义所有的 action 和对应的 reducer 函数，这些函数类似于 redux 原来 reducer 中的一个 case 判断语句，函数的参数有俩个： `state` 和调用这个 `action` 时传递过来的 action 参数。

同时，在上面的代码中，我们使用了一个简洁的写法，将 action 和 reducer 函数组合在一起定义。**通过 `createSlice` 生成的对象，我们可以直接将这些 action 导出，然后在组件中使用它们，无需再手动编写 action creator 和 reducer。**

值得注意的是，`createSlice` 生成的 reducer 函数是自动创建的，我们不需要手动编写。另外，通过 `createSlice` 创建的 reducer 函数可以自动处理 immutable 的状态更新，我们可以直接对状态进行修改，而不需要手动编写 immutable 的逻辑。

#### createAsyncThunk 的使用

`createAsyncThunk` 是 Redux Toolkit 中用于处理异步逻辑的 API，可以简化异步流程的编写。它的作用是创建一个带有三个状态（pending、fulfilled、rejected）的异步 action creator，可以用于处理异步请求、网络请求等需要异步操作的场景。

使用 `createAsyncThunk`，我们需要提供一个唯一标识的字符串类型的 action type，以及一个返回 Promise 对象的异步函数。异步函数接收两个参数：payload 和 thunkAPI。我们可以在这个函数中处理异步操作，并返回一个 promise 对象。`createAsyncThunk` 会根据 action type 自动为该异步函数生成三个 action 类型，分别对应请求发出时的 pending 状态，请求成功时的 fulfilled 状态和请求失败时的 rejected 状态。

以下是 `createAsyncThunk` 的基本用法：

```js
// userSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit'

const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users')
  return response.json()
})
```

在这个例子中，我们定义了一个名为 `fetchUsers` 的异步 action creator，它对应的 action type 是 `users/fetchUsers`。在异步函数中，我们使用 `fetch` 方法获取用户列表，并在请求成功时将结果以 JSON 格式返回。

在使用时，我们可以像普通的 action creator 一样将它 dispatch 到 Redux Store 中：

```jsx
import { useDispatch } from 'react-redux'
import { fetchUsers } from './userSlice'

const UserList = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])
  // ...
}
```

在这个例子中，我们在组件中使用 `fetchUsers` 异步 action creator，将其 dispatch 到 Redux Store 中，从而触发异步请求的执行。

当异步请求发出时，Redux Store 中会自动 dispatch 一个 `users/fetchUsers/pending` action，表示请求正在进行中；当请求成功时，会 dispatch 一个 `users/fetchUsers/fulfilled` action，并将请求结果传递给 reducer 处理；当请求失败时，会 dispatch 一个 `users/fetchUsers/rejected` action，并将请求失败的原因传递给 reducer 处理。

在使用 `createAsyncThunk` 时，我们可以通过指定 `payloadCreator` 选项，自定义异步函数返回的数据结构。此外，`createAsyncThunk` 还支持其他一些配置选项，如 `condition`、`dispatchConditionMet`、`getPendingMeta` 等。以下是一个完整的示例:

```js
import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchUserById } from '../api/userAPI'

export const getUserById = createAsyncThunk(
  'user/fetchByIdStatus',
  async (userId, thunkAPI) => {
    // 处理异步操作
    // 1. 可以发送异步的网络请求等, 获取数据
    const response = await fetchUserById(userId)

    // 2. 取出数据, 并且可以在此处直接 dispatch 操作(也可以不做)
    dispatch(changeUserById(response.data.id))

    // 3. 返回结果, 那么action状态会变成fulfilled状态
    return response.data // 返回数据
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    changeUserById(state, { payload }) {
      state.user = payload // payload 为此前发送的 id
    },
  },
  // 在 extraReducers 中，我们根据不同的状态来更新 Redux store 中的 state。
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { changeUserById } = userSlice.actions // 此处是从 action 中导出 reducers 操作
export default userSlice.reducer
```

在上述代码中，`extraReducers` 是 `createSlice` API 的一个选项，可以用来添加额外的 reducer。通常情况下，我们在 `createSlice` 中只定义与当前 slice 相关的 reducer，但在某些情况下，我们可能需要在当前 slice 中添加其他的 reducer，比如在处理另一个 slice 的 action 时，我们需要在当前 slice 中修改一些 state。

`extraReducers` 中的函数接受一个参数，即 `builder`，它是一个对象，具有以下方法：

- `addCase(type, reducer)`: 添加一个指定的 action type 和对应的 reducer 函数。当 action 的 type 匹配时，将会调用该 reducer 处理 state 的更新。
- `addMatcher(matcher, reducer)`: 添加一个 matcher 函数和对应的 reducer 函数，用于处理匹配的 action。
- `addDefaultCase(reducer)`: 添加一个默认的 reducer 函数，用于处理所有没有匹配到的 action。

其中，`matcher` 函数接受一个 action，返回一个布尔值，用于判断该 action 是否匹配当前的 matcher。`reducer` 函数接受两个参数，即当前的 state 和 action，返回一个新的 state。

`extraReducers` 中的函数应该返回一个对象，其中包含 reducer 函数，该 reducer 函数会被合并到该 Slice 的 reducer 函数中。这样，通过 `extraReducers`，可以将来自其他 Slice 的 reducer 函数合并到当前的 Slice 中，从而实现 reducer 的复用。

#### configureStore 的使用

configureStore 是 Redux Toolkit 提供的一个函数，用于简化 Redux 应用程序的 store 的创建过程。它封装了 createStore 和 applyMiddleware，并自动集成了常见的中间件和开发工具，例如 Redux DevTools。

使用 configureStore，可以快速创建一个包含了 Redux DevTools 和一些常见中间件的 Redux store。下面是一个简单的示例：

```js
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers'

const store = configureStore({
  reducer: rootReducer,
})

export default store
```

在上面的示例中，我们使用 configureStore 创建了一个 store，并将 rootReducer 作为 reducer 传递给 configureStore。这里的 rootReducer 是一个包含多个 reducer 的对象，可以通过 combineReducers 函数来合并。

configureStore 还可以接受其他参数，例如 middleware、preloadedState 和 enhancers。例如，如果你想添加一个 redux-thunk 中间件，可以这样做：

```js
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import rootReducer from './reducers'
import thunkMiddleware from 'redux-thunk'

const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware(), thunkMiddleware],
})

export default store
```

> `getDefaultMiddleware` 函数返回的是一个中间件数组，这个数组里面包含了一些 Redux 默认提供的中间件。这些中间件包括了 `thunk`、`immutableCheck`、`serializableCheck` 等等。
>
> 解构操作是为了在默认中间件数组的基础上，添加自定义的中间件。在这个过程中，我们可以方便地使用默认中间件的功能，同时也可以避免覆盖默认中间件的功能。

在上面的示例中，我们将 `getDefaultMiddleware()` 函数返回的默认中间件与 redux-thunk 中间件一起传递给 `configureStore` 函数。

> 注意：在使用 configureStore 函数时，不需要在根组件中使用 Provider 组件，因为 `configureStore` 已经自动将 store 注入了应用程序中。

### 最终实践

在 `store/index.js` 中利用 `configureStore` 创建 `store` :

```js
import { configureStore } from '@reduxjs/toolkit'

import counterReducer from './counter'
import homeReducer from './home'

const store = configureStore({
  reducer: {
    // 多个 reducer, 最终会在 redux 插件中显示
    counter: counterReducer,
    home: homeReducer,
  },
})

export default store
```

上述代码中，导入了俩个数据，现在来创建一下它们：

```js
// counter.js 同步处理数据
import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    counter: 955,
  },
  reducers: {
    addNumber(state, { payload }) {
      state.counter = state.counter + payload
    },
    subNumber(state, { payload }) {
      state.counter = state.counter - payload
    },
  },
})

export const { addNumber, subNumber } = counterSlice.actions
export default counterSlice.reducer
```

上述代码中利用 `createSlice` 创建了一个 Redux reducer，并导出我们需要的 `addNumber` 和 `subNumber` 俩个 render。再来实现一个异步的 reducer :

```js
// ./home.js 异步处理数据
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// 定义一个异步请求数据的 createAsyncThunk
export const fetchHomeMultidataAction = createAsyncThunk(
  'fetch/homemultidata',
  async (extraInfo, { dispatch, getState }) => {
    // extraInfo 为调用 fetchHomeMultidataAction(someData) 传递过来的 someData
    console.log('extraInfo:', extraInfo, dispatch, getState)
    // 1.发送网络请求, 获取数据
    const res = await axios.get('xxxxxxxxxx')
    // 2.返回结果, 那么action状态会变成fulfilled状态
    return res.data
  }
)

// 定义上述 Thunk 的 reducer
const homeSlice = createSlice({
  name: 'home',
  initialState: {
    banners: [], // 定义初始值
  },
  reducers: {
    // 也可以定义其它同步 reducer
    changeBanners(state, { payload }) {
      state.banners = payload // 同步 reducer 给其它指令调用
    },
  },
  extraReducers: (builder) => {
    // createAsyncThunk 异步请求的三种状态
    builder
      .addCase(fetchHomeMultidataAction.pending, (state, action) => {
        console.log('fetchHomeMultidataAction pending')
      })
      .addCase(fetchHomeMultidataAction.fulfilled, (state, { payload }) => {
        state.banners = payload.data.banner
      })
      .addCase(fetchHomeMultidataAction.rejected, (state, action) => {
        console.log('fetchHomeMultidataAction rejected')
      })
  },
})

export const { changeBanners } = homeSlice.actions
export default homeSlice.reducer
```

上面我们定义了一个异步的 reducer，通过`createAsyncThunk`创建了 `fetchHomeMultidataAction` 异步请求数据函数，实际上，可以直接在其内部接收到异步数据后就发出同步 `dispatch` 指令，这样子就和 `Vuex` 很像了。也可以直接返回数据，此时若成功请求到了数据，则调用下方由 `createSlice` 创建的 reducer，状态为 `fetchHomeMultidataAction.fulfilled` ；失败则为 `fetchHomeMultidataAction.rejected` 。

在组件中使用:

```jsx
// Home.jsx
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { addNumber } from '../store/features/counter'
import { fetchHomeMultidataAction } from '../store/features/home'

export class Home extends PureComponent {
  componentDidMount() {
    this.props.fetchHomeMultidata()
  }

  addNumber(num) {
    this.props.addNumber(num)
  }

  render() {
    const { counter } = this.props

    return (
      <div>
        <h2>Home Counter: {counter}</h2>
        <button onClick={(e) => this.addNumber(5)}>+5</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  console.log('state', state)
  return { counter: state.counter.counter }
}

const mapDispatchToProps = (dispatch) => ({
  addNumber(num) {
    dispatch(addNumber(num))
  },
  fetchHomeMultidata() {
    // 异步请求数据
    const extraInfo = { someData: 'someData' }
    dispatch(fetchHomeMultidataAction(extraInfo)) // extraInfo 可传可不传
  },
})

// 将 state 中的数据通过 connect 传入到组件的 props 属性中
export default connect(mapStateToProps, mapDispatchToProps)(Home)
```

上述代码用了 `connect` 将 `mapStateToProps` 等传入组件的 `props` 中，为了让组件拿到 state 对象，需要在外层（本文直接在根组件 App 外层追加）利用 `Provider` 组件进行包裹。此时容器内的组件均可拿到 `state`。

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

## Redux 之 Hooks

上面的最终实践，已经很完善了。不过 Redux 还是为开发者提供了几个便捷 Hooks。这里，介绍俩个主要常用的 Hooks。

### useSelector

`useSelector` 是一个用于从 Redux store 中选择数据的 React Hook。它允许组件订阅 Redux store 中特定的数据，以便在 store 中的状态发生变化时自动更新组件。

这么说好像有点晕，回顾一下上面实践中的代码。若是要在组件中使用 `Redux store` 内的数据，需要开发者利用 `connect` 将 `mapStateToProps` 和 `mapDispatchToProps` 传入到组件的 `props` 中去，而后访问。这期间，还是需要开发者额外的定义 `mapStateToProps` 和 `mapDispatchToProps` 俩个函数。而利用 `useSelector` 便可以省去这个步骤了。

定义：

```jsx
const result: any = useSelector(selector: Function, equalityFn?: Function)
```

`useSelector` 接受一个回调函数 `selector` 作为参数，**该回调函数接受整个`Redux store`中的状态作为参数**，并返回组件需要的特定数据部分。当该回调函数所依赖的数据发生变化时，`useSelector` 会自动更新组件，并返回新的数据。此外，`useSelector` 还可以接受一个可选的第二个参数 `equalityFn`，用于控制在选择器函数返回值发生变化时，是否触发组件的重新渲染。`equalityFn` 是一个比较函数，接受两个参数：前一个和后一个选择器函数返回的值。如果这两个值相等，则 `equalityFn` 返回 `true`，否则返回 `false`。如果未提供 `equalityFn`，则默认使用 `Object.is` 函数进行比较。多用 React-Redux 中的 `shallowEqual` 进行设置。

例如，下面的代码演示了如何在 React 组件中使用 `useSelector` 选择 Redux store 中的计数器状态：

```jsx
import { useSelector } from 'react-redux'

function Counter() {
  // state 参数为整个 Redux store 中的状态
  const count = useSelector((state) => state.counter.count)

  return (
    <div>
      <h1>Count: {count}</h1>
    </div>
  )
}
```

在这个例子中，`useSelector` 接受一个回调函数，该回调函数返回 Redux store 中的 `counter` 属性，其中包含计数器的状态值 `count`。组件会订阅这个特定的状态属性，并在状态发生变化时自动更新。

利用 `useSelector` 解决了 `connect` 中 `mapStateToProps` 为组件传入数据的场景，但是`mapDispatchToProps` 函数还有一个用途是组件传入 为组件提供 `dispatch` 分发的场景，还没解决。因此，就要用到接下来的 `useDispatch` Hook 了。

### useDispatch

`useDispatch` 返回一个对 Redux Store 中的 `dispatch` 函数引用，可以通过它来按需从组件中派发 Redux action。

在使用 `useDispatch` 之前，需要在组件中导入 `useDispatch`：

```jsx
import { useDispatch } from 'react-redux'
```

然后，可以在组件中调用 `useDispatch` 获取一个 `dispatch` 函数，这个函数可以用于派发 Redux action。

例如，下面是一个简单的示例，展示了如何在 React 组件中使用 `useDispatch`：

```jsx
import { useDispatch } from 'react-redux'
import { incrementCounter } from './actions'

function CounterButton() {
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(incrementCounter())
  }

  return <button onClick={handleClick}>Increment</button>
}
```

在这个例子中，我们定义了一个名为 `CounterButton` 的组件，当点击按钮时，它会调用 `dispatch` 函数，并传递一个 Redux action `incrementCounter()`，这个 action 会告诉 Redux 更新计数器的值。

需要注意的是，使用 `useDispatch` 时，需要确保当前组件处于一个已经连接了 Redux store 的 React 组件中。如果你的组件没有被包裹在 `Provider` 中，或者没有调用 `connect` 方法连接 Redux store，那么在使用 `useDispatch` 时会抛出错误。

### 优化

在 React 的 Hook 使用里面，介绍了一个 `useCallBack` Hook，`useCallback` 会返回一个 memoized（记忆化）的函数，只有当其依赖项发生变化时才会重新创建。俩者合并起来常用于性能优化，避免子组件由于回调引用变更而导致的不必要渲染：

```jsx
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { incrementCounter } from './actions'

function CounterButton() {
  const dispatch = useDispatch()

  const handleClick = useCallback(() => {
    dispatch(incrementCounter())
  }, [dispatch])

  return <button onClick={handleClick}>Increment</button>
}
```

在这个例子中，我们使用了 `useCallback` 缓存了 `handleClick` 函数，只有 `dispatch` 发生变化时才会重新创建。这样可以避免每次组件重新渲染时，都会重新创建一个新的函数。

需要注意的是，使用 `useCallback` 时，需要确保其依赖项是正确的。在这个例子中，我们传递了 `[dispatch]` 作为依赖项，这是因为我们需要确保 `handleClick` 函数中使用的 `dispatch` 始终是最新的。

当然也可以用 `useEffect` 这个 Hook 进行优化，如发送首次数据请求：

```jsx
const dispatch = useDispatch()
useEffect(() => {
  dispatch(fetchDataAction())
}, [dispatch])
```
