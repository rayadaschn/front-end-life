<template><div><h1 id="小程序debug宝典" tabindex="-1"><a class="header-anchor" href="#小程序debug宝典" aria-hidden="true">#</a> 小程序Debug宝典</h1>
<ol>
<li>
<p>数据绑定： 在 <code v-pre>WXML</code> 中动态数据利用 <code v-pre>Mustache</code> 双括号语法将变量包裹起来，可以绑定动态内容及 组件 class 属性，需注意的是 <strong>控制的变量需要放在双括号内</strong>，才能生效。如：</p>
<div class="language-HTML line-numbers-mode" data-ext="HTML"><pre v-pre class="language-HTML"><code>&lt;view wx:if=&quot;{{value}}&quot; &gt;&lt;/view&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
</ol>
</div></template>


