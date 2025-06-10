---
title: React之路由管理
icon: react
date: 2023-03-24
category:
  - 框架
tag:
  - React
star: false
sticky: false
---

## 前言

前端路由的核心是改变 URL，但是也没不进行整体的刷新。由此带来了俩种模式：Hash 和 HTML5 的 History。

### URL 的 hash

**URL 的 hash 也就是锚点(#)**，本质上是改变`window.location`的`href`属性；我们可以通过直接赋值`location.hash`来改变`href`，但是页面不发生刷新。

以下是最常用的用法，当用户点击页面中的链接时，可以使用 hash 来实现不同内容的展示，而不需要重新加载整个页面。以下是一个简单的 HTML 示例，演示了如何在页面中使用 hash：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hash Example</title>
  </head>
  <body>
    <h1>Hash Example</h1>
    <nav>
      <ul>
        <li><a href="#section1">Section 1</a></li>
        <li><a href="#section2">Section 2</a></li>
        <li><a href="#section3">Section 3</a></li>
      </ul>
    </nav>
    <div id="section1">
      <h2>Section 1 Content</h2>
      <p>This is the content for section 1.</p>
    </div>
    <div id="section2">
      <h2>Section 2 Content</h2>
      <p>This is the content for section 2.</p>
    </div>
    <div id="section3">
      <h2>Section 3 Content</h2>
      <p>This is the content for section 3.</p>
    </div>
  </body>
</html>
```

在这个例子中，我们创建了一个包含三个链接和三个带有唯一 ID 的 div 元素的页面。每个链接都包含一个 href 属性，以 `#` 开头并跟随对应的 div 元素 ID。当用户点击链接时，浏览器会自动滚动到指定的 div 元素，并在 URL 中添加相应的 hash 值，以便用户可以通过浏览器前进/后退按钮导航到不同的内容区域。同时，我们也可以根据当前 URL 中的 hash 值来确定哪个 div 元素需要显示。

### HTML5 的 History

HTML5 的 History API 是一组用于操作浏览器历史记录（history）和 URL 的 JavaScript 接口。通过 History API，可以实现在不刷新整个页面的情况下改变页面的 URL 和内容，从而实现单页应用（SPA）中的路由跳转、前进/后退功能等。

History API 主要包括以下几个方法：

- `pushState(state, title, url)`：将新的状态（state）、标题（title）和 URL（url）添加到浏览器历史记录中。
- `replaceState(state, title, url)`：替换当前状态（state）、标题（title）和 URL（url）。
- `go(delta)`：在浏览器历史记录中向前或者向后移动 delta 个位置。
- `forward()`：将浏览器历史记录向前移动一个位置。
- `back()`：将浏览器历史记录向后移动一个位置。

这些方法可以用来动态地更新 URL 和页面内容，并且可以与浏览器的前进/后退按钮结合使用。例如，可以使用 `pushState` 方法将新的状态和 URL 添加到浏览器历史记录中，并根据需要更新页面内容。然后，当用户点击浏览器的后退按钮时，可以使用 `popstate` 事件监听器来获取最近的历史记录并更新页面内容，以实现无需刷新页面的路由跳转。

以下是一个简单的例子，演示了如何使用 History API 来更新页面 URL 和内容：

```js
// 添加新的状态到历史记录中
history.pushState({ page: 1 }, 'Page 1', '/page1')

// 监听 popstate 事件，当用户点击浏览器的后退或前进按钮时触发
window.addEventListener('popstate', function (event) {
  // 获取最近的历史记录并更新页面内容
  var state = event.state
  if (state && state.page === 1) {
    document.title = 'Page 1'
    showPage1Content()
  } else if (state && state.page === 2) {
    document.title = 'Page 2'
    showPage2Content()
  }
})
```

在这个例子中，我们使用 `pushState` 方法将一个新状态（包含一个 page 属性）添加到浏览器历史记录中，并同时更新了页面的 URL 和标题。然后，在 `popstate` 事件监听器中，我们获取最近的状态并根据需要更新页面内容。

## React 中的 React-router

在 React 中，Route 是一个由 React Router 库提供的组件，用于定义应用程序中 URL 的路径和相应的组件渲染。通过 Route，可以将不同的组件与特定的 URL 路径相关联，并在 URL 路径匹配时渲染这些组件。Route 可以支持动态路由、嵌套路由、路由守卫等功能，使得应用程序能够更加灵活地处理导航和页面展示逻辑。

在 React Router 6 中，react-router-dom 和 react-router 的区别与之前版本的 React Router 相同。主要区别在于 react-router-dom 多了一些针对浏览器环境的 DOM 组件和 API，如 Link、NavLink、useHistory 等，这些组件和 API 可以方便地进行页面导航和 URL 操作。

而 react-router 则不包含这些 DOM 组件和 API，它只提供了路由相关的核心功能，如 Route、Routes、Link、useNavigate 等，可以在不同平台上使用（如 React Native）。

简单总结：`react-router-dom` 是针对 Web 应用的路由库，依赖 `react-router` 提供的核心功能，并添加了专门为浏览器环境设计的功能。

下面着重介绍 `react-router-dom`，安装: `npm install react-router-dom`。

### 基本使用

React-router 提供了一些基础组件：BrowserRouter 和 HashRouter 等。俩个组件分别对应路由中的的 History 模式和 Hash 模式：

```jsx
// History 模式
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
}
```

```jsx
// Hash 模式
import { HashRouter } from 'react-router-dom'

function App() {
  return (
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
  )
}
```

### 路由映射配置

定义完路由模式后，可以设置路由的映射关系。React Router 6 中的路由映射配置并不像 React Router 5 中那样使用 `<Switch/>`和`<Route/>` 组件，而是通过 `<Routes>` 和 `<Route>` 组件配合使用来实现，默认一个匹配成功，就不再匹配下面的了，并且默认每一项都是精确匹配，不再需要 `exact` 属性。以下是一个示例：

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home'
import About from './About'
import Contact from './Contact'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  )
}
```

在上述代码中，我们首先导入了需要使用的组件（包括 `BrowserRouter`、`Routes` 和 `Route`），然后在应用中定义了三个路由规则。其中，`element` 属性指定了对应的组件，`path` 属性指定了路由路径。

> 需要注意的是，在 React Router 6 中，`exact` 属性已经不再被支持了。相反，精准匹配现在是默认的行为。也就是说，如果路径与路由定义完全匹配，则只有该路由将被匹配到。

路由路径是匹配一个（或一部分）URL 的 [一个字符串模式](https://react-guide.github.io/react-router-cn/docs/guides/basics/docs/Glossary.md#routepattern)。大部分的路由路径都可以直接按照字面量理解，除了以下几个特殊的符号：

- `:paramName` – 匹配一段位于 `/`、`?` 或 `#` 之后的 URL。 命中的部分将被作为一个[参数](https://react-guide.github.io/react-router-cn/docs/guides/basics/docs/Glossary.md#params)
- `()` – 在它内部的内容被认为是可选的
- `*` – 匹配任意字符（非贪婪的）直到命中下一个字符或者整个 URL 的末尾，并创建一个 `splat` [参数](https://react-guide.github.io/react-router-cn/docs/guides/basics/docs/Glossary.md#params)

```js
<Route path="/hello/:name">         // 匹配 /hello/michael 和 /hello/ryan
<Route path="/hello(/:name)">       // 匹配 /hello, /hello/michael 和 /hello/ryan
<Route path="/files/*.*">           // 匹配 /files/hello.jpg 和 /files/path/to/hello.jpg
```

如果一个路由使用了相对`路径`，那么完整的路径将由它的所有祖先节点的`路径`和自身指定的相对`路径`拼接而成。[使用绝对`路径`](https://react-guide.github.io/react-router-cn/docs/guides/basics/RouteConfiguration.html#decoupling-the-ui-from-the-url)可以使路由匹配行为忽略嵌套关系。

#### Router5 中的精确匹配

在 Router5 中需要增加 `Switch` 组件，包裹 `Route` 确保路由中只要有一项匹配，则不再继续向下匹配。并且需要 `exact` 属性，确保路径完全匹配。

```jsx
import { Switch, Route } from 'react-router-dom'

function App() {
  return (
    <Switch>
      {/* / home 则为精确匹配 */}
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
    </Switch>
  )
}
```

### 路由配置和跳转

在 React Router 6 中，可以使用 `Link` 和 `NavLink` 组件来生成链接并进行页面导航。其中，`Link` 组件是基础组件，而 `NavLink` 组件则是对 `Link` 组件进行了**扩展**，增加了激活状态的样式(选中会默认设置 active 样式类, 可以给予 `activeClassName` 自定义样式)和高亮效果, 也可以基于 `exact` 精确匹配。

以下是一个使用 `Link` 和 `NavLink` 组件的示例：

```jsx
import { Link, NavLink } from 'react-router-dom'

function Header() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <NavLink to="/about" activeClassName="active">
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" activeClassName="active">
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
```

在上述代码中，我们使用 `Link` 和 `NavLink` 组件生成了三个链接，并使用 `to` 属性指定了对应的路由路径。`NavLink` 组件还使用了 `activeClassName` 属性来指定激活时的样式类名。

此外，还有一个 `Navigate` 组件用于路由的重定向，**当这个组件出现时，就会执行跳转到对应的 `to` 路径中。** 与 `Link` 和 `NavLink` 不同的是，`Navigate` 组件是通过 _编程方式_ 进行页面导航的。`<Navigate to={{...}} ></Navigate>` 中`to` 的值可以是一个对象, `pathname` 是跳转的路径, `search` 是问号传参信息,`state` 是携带的其它状态。

以下是一个使用 `Navigate` 组件的示例：

```jsx
import { Navigate } from 'react-router-dom'

function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  function handleLogin() {
    setIsLoggedIn(true)
  }

  if (isLoggedIn) {
    return <Navigate to="/dashboard" />
  }

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Log In</button>
    </div>
  )
}
```

在上述代码中，我们首先定义了一个状态 `isLoggedIn`，表示用户是否已经登录。然后，在点击登录按钮后，如果用户已经成功登录，则使用 `Navigate` 组件进行页面导航，并跳转到 `/dashboard` 路径对应的页面。

需要注意的是，在使用 `Navigate` 组件时，需要确保该组件被渲染在 `Router` 组件的范围之内。否则，页面导航将无法正常工作。

### Not Found 页面配置

若是路由未能匹配到，则需要一个 Not Found 页面：

```jsx
<Route path="*" element={<NotFound />} />
```

### 路由的嵌套

在开发中，路由是存在嵌套关系的，也就是多级路由。在 V6 版本中，要求所有路由（二级或者多级路由），不再分散到各个组件中编写，而是统一写在一起！！！

路由占位符，这里同 Vue 有点类似，需要用到 `<Outlet>` 占位组件，先看代码：

```jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom'
import Home from './Home'
import Products from './Products'
import NotFound from './NotFound'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/products/*" element={<Products />}>
          <Route path="/" element={<ProductList />} />
          <Route path="/:productId" element={<ProductDetail />} />
          {/* 如果以上都不匹配, 则可渲染 404 组件 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}

function Products() {
  return (
    <div>
      <h1>Products</h1>
      <Outlet />
    </div>
  )
}
```

在上述代码中，我们在 `/products` 路径对应的路由规则中定义了一个名为 `Products` 的组件，并将其作为该路由规则的子组件。在 `Products` 组件中，我们使用 `<Outlet>` 组件来渲染所有子级路由规则匹配到的组件。

另外，在 `Products` 组件的示例中，我们还定义了两个子路由规则：`/` 和 `/:productId`。其中，`/` 对应的是产品列表页面，而 `/:productId` 对应的是单个产品详情页面。

需要注意的是，在 React Router 6 中，**使用 `<Outlet>` 组件进行路由嵌套**是比较常见和推荐的做法，可以使得代码结构更加清晰和易于维护。

### 手动路由的跳转

目前我们实现的跳转主要是通过 Link 或者 NavLink 进行跳转的，实际上我们也可以通过 JavaScript 代码进行跳转。（需要注意的是 Navigate 组件可以进行路由的逻辑跳转，但依旧是组件的形式）如果希望通过 JavaScript 代码逻辑进行跳转（如点击了一个 button 按钮），那么就需要获取到 navigate 对象。

Router 6 版本之后，代码类 API 都迁移到了 hooks 写法去了（可以先学 Hooks 之后再看下面内容）。在 React Router 6 中，`useNavigate` Hook 可以用来进行编程式的页面导航。通过 `useNavigate` Hook，我们可以访问到一个 `navigate` 函数，**该函数接受一个字符串类型的参数，表示需要导航的目标路径。**

以下是一个使用 `useNavigate` Hook 的示例：

```js
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const navigate = useNavigate()

  function handleLogin() {
    // 登录成功后进行页面导航
    navigate('/dashboard')
  }

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Log In</button>
    </div>
  )
}
```

在上述代码中，我们首先使用 `useNavigate` Hook 获取了 `navigate` 函数。然后，在登录按钮被点击后，如果用户已经成功登录，则使用 `navigate` 函数进行页面导航，并跳转到 `/dashboard` 路径对应的页面。

需要注意的是，在使用 `useNavigate` Hook 时，需要确保该 Hook 被使用在 `Router` 组件的范围之内。否则，页面导航将无法正常工作。

### 在组件中获取对象信息

在 react-router-dom V5 中，基于 Route 路由匹配渲染的组件，路由会默认给每个组件传递三个属性：history、location 和 match。

```jsx
<Route path="/a" component={A}>
  {/* 这里给 A 组件传递了三个属性: history、location 和 match。 */}
</Route>

// 而基于 render 方法，则需要 `props/this.props` 获取传递的属性
<Route path="/a" render={(props) => {
  // 在 render 中可以获取到传递的属性
  return <A {...props}/>
}}>
</Route>
```

function api 中则有对应的 hooks 函数，编程式导航。

只要在 `<HashRouter/>、<BrowserRouter/>` 中渲染的组件，在组件内部，基于 useHistory、useLocation、useRouteMatch 这些 Hook 函数，就可以获取 history、location 和 match 对象。
即便这个组件并不是基于 `<Route></Route>` 渲染的。而 `props` 属性需要基于 `<Route></Route>` 匹配渲染的组件，才可以获取这三个对象信息。

```jsx
import React from 'react'
import { useLocation, useHistory, useRouteMatch } from 'react-router-dom'

function A() {
  const location = useLocation()
  const history = useHistory()
  const match = useRouteMatch()

  console.log(location, history, match)
  return (
    <div history={history} location={location} match={match}>
      组件 A
    </div>
  )
}
```

实践建议：所有组件最好都包裹在 `<HashRouter/>、<HashRouter/>` 中，这样就可以在组件内部获取到 history、location 和 match 对象，而不需要基于 `<Route></Route>` 匹配渲染的组件。

1. 函数组件，并且是基于 `<Route></Route>` 匹配渲染的:

   - 基于 `props` 属性获取 「render 渲染的, 需要自己处理一下」
   - 基于 `useHistory、useLocation、useRouteMatch` 这些 Hook 函数获取

2. 函数组件，并且不是基于 `<Route></Route>` 匹配渲染的:

   - 基于 Hook 函数获取;
   - 基于 `withRouter` 代理一下这个组件, 这样就可以基于 `props` 获取了。

3. 类组件，只能基于 props 获取了。但是如果没有被 `<Route></Route>` 匹配渲染，则需要基于 `withRouter` 代理一下这个组件。

```jsx
import React from 'react'
import { Link } from 'react-router-dom'

class HomeHead extends React.Component {
  render() {
    console.log(this.props) // 被 Hoc 处理后，这里可以获取到 history、location 和 match 对象
    return (
      <NavBox>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
      </NavBox>
    )
  }
}

// react-router-dom V5 版本提供的 withRouter 函数，用于将组件包裹在 Router 组件中，从而使其可以获取到路由相关的属性。原理如下
const Handle = function Handle(Component) {
  return function Hoc(props) {
    const history = useHistory()
    const location = useLocation()
    const match = useRouteMatch()
    return (
      <Component
        {...props}
        history={history}
        location={location}
        match={match}
      />
    )
  }
}

// 最终导出高阶组件
export default Handle(HomeHead)
// 等价于以下
// export default withRouter(HomeHead)
```

### 路由参数传递

传递参数的方式有俩种:

- 动态路由传参：在目标组件中使用 `useParams` 钩子获取参数；
- search 查询参数通过 URL 的 `?key=value` 格式传递，使用 `useSearchParams` 钩子解析查询参数。search 存储的就是问号传参信息，要求是 urlencoded 字符串编码格式。如果要传对象，可用 qs 库进行序列化。

```jsx
const Com = function () {
  const history = useHistory()
  return <div>
    <button onClick={() => {
      {/* 1. 问号传参 */}
      {/* history.push('/com?name=123') */}
      history.push({
        pathname: '/com',
        search: '?name=123',
        {/* 或者 search: qs.stringify({name: '123'}) */}
        {/* 2. 隐式传参, 不会显示在 url 上, 刷新后也不会保存 */}
        otherState: {
          name: '123',
          obj: '{a: 1, b: 2}'
        }
      })
    }}>按钮</button>
  </div>
}
```

传递的信息会出现在 url 上，数据是显示的，且刷新依旧存在。

动态路由是指路由路径中包含变量的一种路由方式。在动态路由中，变量可以根据实际情况进行替换，从而实现更加灵活和通用的路由匹配。

在 React Router 6 中，可以使用冒号 `:` 来定义动态路由。例如：

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProductDetail from './ProductDetail'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
      </Routes>
    </Router>
  )
}
```

在上述代码中，我们定义了一个 `/products/:productId` 的路由规则，并将其映射到 `ProductDetail` 组件上。其中，`productId` 是一个变量，可以根据实际情况进行替换。

例如，在访问路径为 `/products/123` 的时候，React Router 6 会自动将 `123` 这个参数传递给 `ProductDetail` 组件，从而渲染对应的产品详情信息。

**需要注意的是，在使用动态路由时，需要确保路由规则的顺序是正确的。如果多个路由规则都可以匹配同一个路径，那么 React Router 6 将按照规则定义的顺序进行匹配，并选择第一个匹配成功的路由规则进行渲染。**

在 React Router 6 中，可以通过使用路由组件的 `useParams` Hook 来获取动态路由的参数。`useParams` Hook 接受一个空对象作为参数，返回一个对象，其中包含了当前路径中所有动态路由参数以及其对应的值。

以下是一个示例：

```jsx
import { useParams } from 'react-router-dom'

function ProductDetail() {
  const { productId } = useParams()

  // 根据 productId 获取对应的产品详情信息

  return (
    <div>
      <h1>Product Detail - {productId}</h1>
      {/* 渲染产品详情信息 */}
    </div>
  )
}
```

在上述代码中，我们首先使用 `useParams` Hook 获取了当前路径中的动态路由参数 `productId` 的实际值，并将其保存到变量 `productId` 中。然后，在组件渲染时，我们可以使用 `productId` 变量来渲染对应的产品详情信息。

需要注意的是，在使用 `useParams` Hook 时，需要确保该 Hook 被使用在路由组件内部。否则，无法获取到动态路由的参数。同时，如果路径中不存在指定名称的动态路由参数，则 `useParams` Hook 返回的对应值为 `undefined`。

search 查询方式获取参数:

```jsx
import { useSearchParams } from 'react-router-dom'

function SearchPage() {
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') // 获取查询参数
  return <div>Search Keyword: {keyword}</div>
}

export default SearchPage
```

### 统一配置文件

现在，基本将所有的路由功能介绍完毕。但是还是有些地方需要优化，如如果想将路由的配置像 Vue 一样都放到一个地方进行集中管理，该怎么办？

为了方便管理路由配置，可以将所有的路由规则定义在一个单独的文件中，并在应用程序中进行引入和注册。这样做除了能够集中管理所有的路由规则，还能够使得代码更加清晰、易于维护和扩展。

> 路由配置表: 是一个数组，数组中每一项就是每一个需要配置的路由规则
>
> - redirect：true 重定向
> - from: 来源地址
> - to: 重定向地址
> - exact: 是否精准匹配
> - path: 匹配的路径
> - component: 渲染的组件
> - name: 路由名称(命名路由)
> - meta: {} 路由元信息, 包含当前路由的一些信息，当路由匹配后，可以拿这些信息做一些事情。
> - children:[] 子路由
>   ...

以下是一个示例：

```jsx
// routes.jsx
import Home from './Home'
import About from './About'
import Contact from './Contact'
import Products from './Products'
import ProductList from './ProductList'
import ProductDetail from './ProductDetail'

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  {
    path: '/products/*',
    element: <Products />,
    children: [
      { path: '/', element: <ProductList /> },
      { path: ':productId', element: <ProductDetail /> },
    ],
  },
]
```

在上述代码中，我们定义了所有的路由规则，并将它们保存在一个称为 `routes` 的数组中。其中，每个元素都代表一个路由规则，包括 `path`、`element` 和 `children` 三个属性。

然后，在应用程序中，我们只需要引入 `routes` 数组，并使用 `<Routes>` 组件和一个简单的循环语句来注册所有的路由规则。例如：

```jsx
// App:
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'

// 递归渲染路由
function App() {
  return (
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element}>
            {route.children &&
              route.children.map((child, i) => (
                <Route key={i} path={child.path} element={child.element} />
              ))}
          </Route>
        ))}
      </Routes>
    </Router>
  )
}
```

在上述代码中，我们首先引入了 `routes` 数组，并在 `<Routes>` 组件中使用一个简单的循环语句来注册所有的路由规则。对于每个路由规则，我们使用 `<Route>` 组件进行注册，并传递对应的 `path` 和 `element` 属性。如果该路由规则存在子路由规则，则同样使用一个简单的循环语句来注册子路由规则。

这样做，就可以实现将路由配置放到一个地方进行集中管理的目的。同时，只需要修改 `routes.js` 文件即可改变整个应用程序的路由规则，具有很好的可维护性和扩展性。

当前上面还可以做一些路由拦截，如在赋值 Element 的时候，可以做权限、登录校验和传递属性等。

```jsx
import { routes } from './routes'
import { Routes, Route, useNavigate } form 'react-router-dom'

const Element = function (props) {
  const { element } = props
  // 可以在这里进行一些权限校验、登录校验等操作
  const navigate = useNavigate()
  const location = useLocation()
  const [usp] = useSearchParams()

  // 最后吧 Component 渲染出来
  return <element navigate={navigate} location={location} usp={usp} />
}

const createRoute = function (routes) {
  return <>
    {routes.map((route, index) => (
      <Route key={index} path={route.path} element={<Element element={route.element} />}>
        {route.children && createRoute(route.children)}
      </Route>
    ))}
  </>
}

function App() {
  return <div className="counter">{createRoute(routes)}</div>
  </>

}

```

此外，React Router 6 中提供了一个名为 `useRoutes` 的 Hooks，它可以让我们更加灵活地定义路由规则，并将其作为一个组件函数进行导出和使用。我们对上面的 App 组件进行改造：

```jsx
// App:
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
} from 'react-router-dom'
import { routes } from './routes'

function App() {
  return <div className="counter">{useRoutes(routes)}</div>
}
```

当然实际项目中，更可能采用 `createBrowserRouter` 创建路由器实例，结合 `RouterProvider` 用于将路由器绑定到 React 应用中，来管理整个应用的导航逻辑。

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// 定义路由
const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Home Page</h1>,
  },
  {
    path: '/about',
    element: <h1>About Page</h1>,
  },
])

// 渲染路由器
ReactDOM.render(
  <RouterProvider router={router} />,
  document.getElementById('root')
)
```

### 路由的懒加载

React Router 6 支持路由的懒加载，可以大幅度减小应用程序的初始加载时间，提高应用程序的性能。

```jsx
import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('./Home'))
const About = lazy(() => import('./About'))

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </Router>
  )
}
```

在上述代码中，我们 **使用 `lazy` 函数来懒加载路由组件，并使用 `<Suspense>` 组件来渲染加载状态。然后，在 `<Routes>` 中使用 `<Route>` 组件来定义路由规则。** 此外，`<Suspense>` 组件包裹在异步加载组件的父组件中，用于在组件加载完成之前渲染出一个指定的 “fallback” 组件。

`fallback` 属性就是用于设置这个指定的加载状态，它接受一个 React 组件作为其值，并会在异步组件加载完成前，渲染这个指定的组件。

需要注意的是，在使用懒加载时，需要将路由组件包裹在一个默认导出的函数中，以便能够异步加载该组件。例如：

```jsx
// Home.jsx:
export default function Home() {
  return <h1>Home</h1>
}
```

在上述代码中，我们将 `Home` 组件设置为默认导出，并且将其包裹在一个函数中。

## 总结 V5 和 V6 的区别

React Router 6 是 React Router 5 的一个重大更新，它引入了许多新的特性和改进，同时也废弃了一些旧的 API。以下是一些主要的区别：

1. V6 移除了 `Switch` 组件，改用 `<Routes>` 组件来包裹所有的路由规则。
2. 移除了 `Redirect` 组件，改用 `<Navigate>` 组件来重定向。遇到 `<Navigate>` 组件时，React Router 就会自动跳转到指定的路径。`<Navigate to={{...}} />` 中`to` 的值可以是路径或者一个对象, `pathname` 是跳转的路径, `search` 是问号传参信息,`state` 是携带的其它状态。
3. 移除了 `withRouter` 高阶组件，若要实现可自己手写一个，上文已给出。
4. 在 V6 中，即便当前函数组件是基于`<Route></Route>`匹配渲染的，也不会给予属性(props)获取 `location`、`match`、`history`等，需要通过`useNavigate`、`useLocation`、`useParams`等钩子函数来获取。并且使用这些 Hook 函数时，需要是在 `Router` 的 `HashRouter` 或 `BrowserRouter` 中。
5. 编程式导航取消了 History 对象，改用 `useNavigate` 钩子函数代替 V5 中的 useHistory。

   ```jsx
   const navigate = useNavigate()
   navigate('/about') // 跳转到 /about
   navigate(-1) // 后退
   navigate(1) // 前进
   navigate('/about', { replace: true }) // 替换当前历史记录
   navigate('/about', { state: { id: 123 } }) // 带参数跳转
   navigate({ pathname: '/about', search: '?id=123' }) // 带参数跳转
   ```

6. V6 中，新增了一个 useSearchParams 钩子函数，用于获取 URL 中的查询参数。得到的是一个 URLSearchParams 对象，可以像操作对象一样操作它。
7. V6 中用 `useMatch(pathname)` 替代了 V5 中的 `useRouteMatch()`。主要作用是手动匹配某个具体路径，看它是否与当前 URL 匹配，并获取匹配到的信息（包含参数）。由于 V6 中的 `useMatch(pathname)` 需要我们自己传地址，且 params 中也没有获取匹配的信息，所以常用用 `useParams()` 来获取匹配的信息，该钩子用的较少。

   ```jsx
   import { useMatch } from 'react-router-dom'

   function Profile() {
     const match = useMatch('/profile/:username')
     if (match) {
       console.log(match.params) // { username: 'huy' }
     }

     const params = useParams()
     console.log(params) // { username: 'huy' }

     return <div>Profile Page</div>
   }

   // 当前路径为 /profile/huy
   ```
