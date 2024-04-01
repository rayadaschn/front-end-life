const e=JSON.parse('{"key":"v-21abd08f","path":"/JavaScript/JS/JS15.html","title":"权限管理设计思路","lang":"zh-CN","frontmatter":{"title":"权限管理设计思路","icon":"javascript","date":"2024-02-07T00:00:00.000Z","category":["javascript"],"tag":["javascript"],"sticky":false},"headers":[{"level":2,"title":"登录鉴权","slug":"登录鉴权","link":"#登录鉴权","children":[]},{"level":2,"title":"访问权限","slug":"访问权限","link":"#访问权限","children":[]},{"level":2,"title":"页面权限","slug":"页面权限","link":"#页面权限","children":[]},{"level":2,"title":"按钮权限","slug":"按钮权限","link":"#按钮权限","children":[]}],"git":{"createdTime":1711950553000,"updatedTime":1711950553000,"contributors":[{"name":"rayadaschn","email":"115447518+rayadaschn@users.noreply.github.com","commits":1}]},"readingTime":{"minutes":1.05,"words":316},"filePathRelative":"JavaScript/JS/JS15.md","localizedDate":"2024年2月7日","excerpt":"<p>总结一下在前端中做权限管理的设计思路:</p>\\n<h2> 登录鉴权</h2>\\n<p>在用户登录后，获取 token 并在前端保存，作为用户凭证（LocalStore 或 SessionStore），后面每次发送请求都会携带 Token，后端对 Token 进行验证。当页面发生刷新时，可以用 Token 来获取用户权限。</p>\\n<div class=\\"language-javascript line-numbers-mode\\" data-ext=\\"js\\"><pre class=\\"language-javascript\\"><code>config<span class=\\"token punctuation\\">.</span>headers<span class=\\"token punctuation\\">.</span>authorization <span class=\\"token operator\\">=</span> token\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div></div></div>"}');export{e as data};
