---
title: React之路由管理
icon: react
category:
  - 框架
tag:
  - React
star: true
sticky: false


---

# React之路由管理

## 前言

前端路由的核心是改变 URL，但是也没不进行整体的刷新。由此带来了俩种模式：Hash 和HTML5 的 History。

### URL 的 hash

**URL的hash也就是锚点(#)**，本质上是改变`window.location`的`href`属性；我们可以通过直接赋值`location.hash`来改变`href`，但是页面不发生刷新。

以下是最常用的用法，当用户点击页面中的链接时，可以使用 hash 来实现不同内容的展示，而不需要重新加载整个页面。以下是一个简单的 HTML 示例，演示了如何在页面中使用 hash：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
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

HTML5的History API是一组用于操作浏览器历史记录（history）和URL的JavaScript接口。通过 History API，可以实现在不刷新整个页面的情况下改变页面的 URL 和内容，从而实现单页应用（SPA）中的路由跳转、前进/后退功能等。

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
history.pushState({ page: 1 }, "Page 1", "/page1");

// 监听 popstate 事件，当用户点击浏览器的后退或前进按钮时触发
window.addEventListener("popstate", function(event) {
  // 获取最近的历史记录并更新页面内容
  var state = event.state;
  if (state && state.page === 1) {
    document.title = "Page 1";
    showPage1Content();
  } else if (state && state.page === 2) {
    document.title = "Page 2";
    showPage2Content();
  }
});
```

在这个例子中，我们使用 `pushState` 方法将一个新状态（包含一个 page 属性）添加到浏览器历史记录中，并同时更新了页面的 URL 和标题。然后，在 `popstate` 事件监听器中，我们获取最近的状态并根据需要更新页面内容。

## React 中的 React-router

在 React 中，Route 是一个由 React Router 库提供的组件，用于定义应用程序中 URL 的路径和相应的组件渲染。通过 Route，可以将不同的组件与特定的 URL 路径相关联，并在 URL 路径匹配时渲染这些组件。Route 可以支持动态路由、嵌套路由、路由守卫等功能，使得应用程序能够更加灵活地处理导航和页面展示逻辑。

在 React Router 6 中，react-router-dom 和 react-router 的区别与之前版本的 React Router 相同。主要区别在于 react-router-dom 多了一些针对浏览器环境的 DOM 组件和 API，如 Link、NavLink、useHistory 等，这些组件和 API 可以方便地进行页面导航和 URL 操作。

而 react-router 则不包含这些 DOM 组件和 API，它只提供了路由相关的核心功能，如 Route、Routes、Link、useNavigate 等，可以在不同平台上使用（如 React Native）。

因此，在开发 Web 应用时，建议使用 react-router-dom 更加便利。但如果需要在其他平台上使用 React Router，或者需要自定义一些路由相关的逻辑，则可以选择使用 react-router。

因此，我们选择安装 `react-router-dom` : `npm install react-router-dom`。

### 基本使用

React-router 提供了一些基础组件：BrowserRouter 和 HashRouter 等。俩个组件分别对应路由中的的 History 模式和 Hash 模式：

```jsx
// History 模式
import { BrowserRouter } from "react-router-dom";

<React.StrictMode>
  <BrowserRouter>
  	<App />
  </BrowserRouter>
</React.StrictMode>
```

```jsx
// Hash 模式
import { HashRouter } from "react-router-dom";

<React.StrictMode>
  <HashRouter>
  	<App />
  </HashRouter>
</React.StrictMode>
```

### 路由映射配置

定义完路由模式后，可以设置路由的映射关系。React Router 6 中的路由映射配置并不像 React Router 5 中那样使用 `<Route>` 组件，而是通过 `<Routes>` 和 `<Route>` 组件配合使用来实现。以下是一个示例：

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Contact from './Contact';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}
```

在上述代码中，我们首先导入了需要使用的组件（包括 `BrowserRouter`、`Routes` 和 `Route`），然后在应用中定义了三个路由规则。其中，`element` 属性指定了对应的组件，`path` 属性指定了路由路径。

需要注意的是，**在 React Router 6 中，`exact` 属性已经不再被支持了。相反，精准匹配现在是默认的行为。**也就是说，如果路径与路由定义完全匹配，则只有该路由将被匹配到。

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

### 路由配置和跳转

在 React Router 6 中，可以使用 `Link` 和 `NavLink` 组件来生成链接并进行页面导航。其中，`Link` 组件是基础组件，而 `NavLink` 组件则是对 `Link` 组件进行了扩展，增加了激活状态的样式和高亮效果。

以下是一个使用 `Link` 和 `NavLink` 组件的示例：

```jsx
import { Link, NavLink } from 'react-router-dom';

function Header() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><NavLink to="/about" activeClassName="active">About</NavLink></li>
        <li><NavLink to="/contact" activeClassName="active">Contact</NavLink></li>
      </ul>
    </nav>
  );
}
```

在上述代码中，我们使用 `Link` 和 `NavLink` 组件生成了三个链接，并使用 `to` 属性指定了对应的路由路径。`NavLink` 组件还使用了 `activeClassName` 属性来指定激活时的样式类名。

此外，还有一个 `Navigate` 组件用于路由的重定向，当这个组件出现时，就会执行跳转到对应的 `to` 路径中。与 `Link` 和 `NavLink` 不同的是，`Navigate` 组件是通过编程方式进行页面导航的。

以下是一个使用 `Navigate` 组件的示例：

```jsx
import { Navigate } from 'react-router-dom';

function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleLogin() {
    setIsLoggedIn(true);
  }

  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
}
```

在上述代码中，我们首先定义了一个状态 `isLoggedIn`，表示用户是否已经登录。然后，在点击登录按钮后，如果用户已经成功登录，则使用 `Navigate` 组件进行页面导航，并跳转到 `/dashboard` 路径对应的页面。

需要注意的是，在使用 `Navigate` 组件时，需要确保该组件被渲染在 `Router` 组件的范围之内。否则，页面导航将无法正常工作。

### Not Found 页面配置

若是路由未能匹配到，则需要一个 Not Found 页面：

```jsx
<Route path='*' element={<NotFound/>} />
```

### 路由的嵌套

在开发中，路由是存在嵌套关系的，也就是多级路由。









