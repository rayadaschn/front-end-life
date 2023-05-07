const e=JSON.parse('{"key":"v-46e3c1bf","path":"/CSS/FlexboxLayoutTechniques.html","title":"弹性布局 flex","lang":"zh-CN","frontmatter":{"title":"弹性布局 flex","icon":"style","category":["CSS"],"tag":["CSS"]},"headers":[{"level":2,"title":"子项特性","slug":"子项特性","link":"#子项特性","children":[]},{"level":2,"title":"布局设置","slug":"布局设置","link":"#布局设置","children":[]},{"level":2,"title":"css 对齐特性综述","slug":"css-对齐特性综述","link":"#css-对齐特性综述","children":[]},{"level":2,"title":"深入理解 flex 属性","slug":"深入理解-flex-属性","link":"#深入理解-flex-属性","children":[{"level":3,"title":"flex-basis 属性与尺寸计算规则：","slug":"flex-basis-属性与尺寸计算规则","link":"#flex-basis-属性与尺寸计算规则","children":[]}]},{"level":2,"title":"* 弹性布局最后一行不对齐的处理","slug":"弹性布局最后一行不对齐的处理","link":"#弹性布局最后一行不对齐的处理","children":[]}],"git":{"createdTime":1680364551000,"updatedTime":1683451196000,"contributors":[{"name":"rayadaschn","email":"115447518+rayadaschn@users.noreply.github.com","commits":3}]},"readingTime":{"minutes":5.29,"words":1586},"filePathRelative":"CSS/FlexboxLayoutTechniques.md","localizedDate":"2023年4月1日","excerpt":"<h1> 弹性布局 flex</h1>\\n<blockquote>\\n<p>读《CSS 新世界》flex 布局篇笔记</p>\\n</blockquote>\\n<h2> 子项特性</h2>\\n<ol>\\n<li>flex 子项块转化</li>\\n<li>flex 子项浮动失效</li>\\n<li>flex 子项支持 z-index 属性</li>\\n<li><strong>flex 子项的 margin 值不会合并</strong></li>\\n<li>flex 子项是格式化的尺寸</li>\\n<li>flex 子项若被绝对定位，则会脱离弹性布局</li>\\n</ol>\\n<h2> 布局设置</h2>\\n<ol>\\n<li>\\n<p><strong>flex-direction</strong> 属性与整体布局方向</p>\\n<div class=\\"language-css line-numbers-mode\\" data-ext=\\"css\\"><pre class=\\"language-css\\"><code><span class=\\"token property\\">flex-direction</span><span class=\\"token punctuation\\">:</span> row | row-reverse | column | column-reverse<span class=\\"token punctuation\\">;</span>\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div></div></div></li>\\n<li>\\n<p><strong>flex-wrap</strong> 属性与整体布局的换行表现</p>\\n<div class=\\"language-css line-numbers-mode\\" data-ext=\\"css\\"><pre class=\\"language-css\\"><code><span class=\\"token property\\">flex-wrap</span><span class=\\"token punctuation\\">:</span> nowrap | wrap | wrap-reverse<span class=\\"token punctuation\\">;</span>\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div></div></div></li>\\n<li>\\n<p><strong>flex-flow</strong> 属性是 <strong>flex-direction</strong> 和 flex-wrap 的缩写</p>\\n</li>\\n</ol>"}');export{e as data};
