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

