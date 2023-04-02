---
title: React之数据管理 Redux
icon: react
category:
  - 框架
tag:
  - React
star: true
sticky: false

---

# React之数据管理 Redux

## JavaScript 中的纯函数

在 JavaScript 中，纯函数是指具有以下两个特性的函数：

1. 相同的输入总是返回相同的输出
2. 函数执行期间没有副作用，也就是说它不会修改任何在函数作用域外部的状态，如全局变量、输入参数、引用参数等。

因为纯函数的输出仅仅由输入决定，所以它们在并发编程和缓存数据等方面非常有用。由于不会修改外部状态，纯函数通常比有副作用的函数更容易测试、调试和优化。

```js
function sum(a, b) {
  return a + b;
}
```

这个函数只是将输入的两个数字相加，它没有副作用，也不会修改任何外部变量或状态。每次调用 `sum` 函数时，给定相同的参数，它总是返回相同的结果。这就使得它成为一个纯函数。

```js
let total = 0;
function addToTotal(num) {
  total += num;
  return total;
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

Redux 是一种用于管理应用程序状态的 JavaScript 库。它可以在 React、Angular、Vue 或任何其他 JavaScript 应用程序中使用。Redux 通过强制将应用程序的状态存储在单个全局对象中来简化状态管理。这个全局状态对象是只读的，唯一可以更改它的方式是通过发出“操作”来修改它。操作是一个纯 JavaScript 对象，描述了发生了什么类型的更改以及需要更新状态的数据。

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

### Redux使用方法

1. 安装 Redux：可以使用 npm 或 yarn 安装 Redux。

   ```bash
   $: npm install redux
   # 或者
   $: yarn add redux
   ```

2. 创建一个存储状态的 store：使用 Redux 的 `createStore` 方法创建一个 store，并将一个 reducer 传递给它。

   ```js
   // index.js
   import { createStore } from 'redux';
   import { reducer } from './reducers';
   
   export const store = createStore(reducer);
   ```

3. 创建 reducer 函数：一个 reducer 函数是一个纯函数，它接收旧状态和一个 action，然后返回一个新状态。

   ```js
   // reducer.js
   // 创建初始数据
   const initialState = {
     name: 'Redux',
     count: 0,
   };
   
   // 参数一: store中目前保存的state
   // 参数二: 本次需要更新的action(dispatch传入的action), 本质上是一个对象
   // 返回值: 它的返回值会作为store之后存储的state
   export function reducer(state = initialState, action) {
     switch (action.type) {
       case 'INCREMENT':
         return { ...state, count: state.count + action.num };
       case 'DECREMENT':
         return { ...state, count: state.count - action.num };
       default:
         // 没有新数据更新, 那么返回之前的state
         return state;
     }
   }
   ```

4. 创建 action：一个 action 是一个简单的 JavaScript 对象，它包含一个 `type` 属性和一些数据，用于描述要执行的操作。

   ```js
   // actionCreators.js 储存 action 
   export const incrementAction = (num) => ({ type: 'INCREMENT', num });
   export const decrementAction = (num) => ({ type: 'DECREMENT', num });
   ```

5. 发送 action：要更新状态，需要通过 `store.dispatch` 方法发送一个 action。

   ```js
   // 修改 store 中的数据
   import { store } from './index';
   import { incrementAction, decrementAction } from 'actionCreators.js'
   
   store.dispatch(incrementAction(10)); // 真正执行改变的操作
   store.dispatch(decrementAction(20));
   ```

6. 订阅状态变化：通过 `store.subscribe` 方法订阅 store 中状态的变化。

   ```js
   import { store } from './index';
   store.subscribe(() => { // 数据变化,自动执行该函数
     console.log(store.getState());
   });
   ```

7. 使用 store 中的数据，通过 `store.getState()`。

   ```js
   import { store } from './index';
   console.log(store.getState());
   ```

**redux代码优化**:

1. 将派发的action生成过程放到一个`actionCreators`函数中；
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
    completed: false
  }
};

// dispatch the action
store.dispatch(addTodoAction);
```

这个 action 描述了一个添加待办事项的操作，它的 type 是 'ADD_TODO'，payload 是要添加的待办事项的具体内容。

但是，在实际的应用场景中，有很多操作是需要异步执行的，例如向服务器请求数据、操作浏览器的 DOM 等。**如果你直接在 action 中执行异步操作，那么这个 action 就不再是一个纯粹的 JavaScript 对象了，它会有一些副作用，例如会发起网络请求，或者访问浏览器的 DOM。**

这时候，就需要 Redux Thunk 中间件来解决这个问题。**Redux Thunk 允许 action 创造者（也就是 action creator 函数）返回一个函数，而不是一个普通的 JavaScript 对象。这个函数可以接受两个参数：`dispatch` 和 `getState`。在这个函数内部，你可以执行异步操作，并在操作完成后再次调用 `dispatch` 方法来发送一个新的 action，从而更新应用的状态。**

使用方法:

- 安装: `npm install redux-thunk` ；

- 在创建 store 时传入应用了 `middleware` 的 `enhance`函数；

- 将 `enhance` 函数作为第二个参数传入到 `createStore` 中；

  ```js
  import { createStore, applyMiddleware } from 'redux';
  
  const enhancer = applyMiddleware(thunkMiddleware);
  const store = createStore(reducer, enhancer);
  ```

- 定义返回一个函数的 `action`，**注意：这里不再是返回一个对象，而是返回一个函数，函数的入参为 `dispatch`，并且该函数会在 `dispatch`之后被执行**。

  ```js
  // action 函数
  function fetchTodos() {
    return function(dispatch) {
      // dispatch the initial action to indicate that we're starting the request
      dispatch({ type: 'FETCH_TODOS_REQUEST' });
  
      // make the actual API request
      return api.fetchTodos()
        .then(response => {
          // dispatch a success action with the received data
          dispatch({ type: 'FETCH_TODOS_SUCCESS', payload: response.data });
        })
        .catch(error => {
          // dispatch a failure action with the error message
          dispatch({ type: 'FETCH_TODOS_FAILURE', payload: error.message });
        });
    };
  }
  ```

下面是一个使用 `redux-thunk` 处理异步操作的完整示例代码：

```js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer.js';

const store = createStore(
  reducer,
  applyMiddleware(thunk)
);
```

```js
// reducer.js
const initialState = {
  isLoading: false,
  data: null,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCHING_DATA':
      return { ...state, isLoading: true };
    case 'FETCHING_DATA_SUCCESS':
      return { ...state, isLoading: false, data: action.payload };
    case 'FETCHING_DATA_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export default reducer;
```

在上述代码中，`applyMiddleware` 是 Redux 提供的一个函数，用于将中间件应用于 Redux store。

在 Redux 中，中间件是一个函数，它可以在 action 被发起之后，到达 reducer 之前执行一些自定义的逻辑。中间件可以用来处理异步操作、日志记录、错误处理等任务。

`applyMiddleware` 接收一个或多个中间件作为参数，返回一个函数，这个函数接收一个 `createStore` 方法作为参数，返回一个被增强后的 `createStore` 方法。使用这个增强后的 `createStore` 方法创建 Redux store 时，中间件就会被应用。

```js
// actions.js
export const getData = () => {
  return (dispatch, getState) => {
    dispatch({ type: 'FETCHING_DATA' });
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => {
        dispatch({ type: 'FETCHING_DATA_SUCCESS', payload: data });
      })
      .catch(error => {
        dispatch({ type: 'FETCHING_DATA_FAILURE', payload: error });
      });
  };
};
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
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  todos: todosReducer,
  visibilityFilter: visibilityFilterReducer
});

export default rootReducer;
```

这样，`rootReducer` 就可以处理 `todos` 和 `visibilityFilter` 两个状态的更新了。

需要注意的是，`combineReducers` 并不会修改传入的 reducer 函数。它会将每个 reducer 的返回值合并为一个新的状态对象，但不会修改每个 reducer 的内部逻辑。这也是 Redux 的设计哲学之一：保持 reducer 的独立性和可测试性。

### Redux 调试

Redux 为开发者提供了一个 Redux DevTools 的浏览器插件，它可以帮助开发者更方便地调试 Redux 应用程序。下面是使用 Redux DevTools 的一些步骤：

1. 安装 Redux DevTools 浏览器插件。Redux DevTools 提供了 Chrome 和 Firefox 版本的插件。安装好插件后，在浏览器的扩展程序中可以看到 Redux DevTools 的图标。
2. 在应用程序中安装 Redux DevTools 的相关中间件。Redux DevTools 提供了多个中间件，包括 `redux-devtools-extension`、`redux-logger`、`redux-thunk` 等。使用 `redux-devtools-extension` 中间件可以自动连接 Redux DevTools 插件。安装: `npm install redux-devtools-extension `（ 更多[Redux-devtool-extension的相关设置](https://github.com/zalmoxisus/redux-devtools-extension) ）

```js
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

let store;
// Redux DevTools 调试工具只在开发环境才使用
if (process.env.NODE_ENV === 'development') {
  store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
  );
} else {
  store = createStore(rootReducer, applyMiddleware(thunk));
}

export default store;
```

3. 打开浏览器，进入开发者工具。在浏览器中打开应用程序，然后按下 F12 键，进入开发者工具。
4. 打开 Redux DevTools 面板。在开发者工具中选择 Redux DevTools 面板，即可看到 Redux DevTools 的界面。
