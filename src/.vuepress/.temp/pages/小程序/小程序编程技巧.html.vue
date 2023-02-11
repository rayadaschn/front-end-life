<template><div><h1 id="小程序-debug-宝典" tabindex="-1"><a class="header-anchor" href="#小程序-debug-宝典" aria-hidden="true">#</a> 小程序 Debug 宝典</h1>
<ol>
<li>
<p>数据绑定： 在 <code v-pre>WXML</code> 中动态数据利用 <code v-pre>Mustache</code> 双括号语法将变量包裹起来，可以绑定动态内容及 组件 class 属性，需注意的是 <strong>控制的变量需要放在双括号内</strong>，才能生效。如：</p>
<div class="language-HTML line-numbers-mode" data-ext="HTML"><pre v-pre class="language-HTML"><code>&lt;view wx:if=&quot;{{value}}&quot; &gt;&lt;/view&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
<li>
<p>数据更新 <code v-pre>this.setData</code> :</p>
<p>小程序的渲染过程是逻辑层负责生产、处理数据，利用 <code v-pre>setData</code> 传递数据到渲染层。其中，从逻辑层传递到渲染层是 <strong>异步</strong> 的，而 <strong><code v-pre>this.data</code></strong>  的修改是  <strong>同步</strong> 的。因此，连续多次的调用 <code v-pre>this.setData</code> 会导致 JS线程一直处于编译执行渲染阶段，造成卡顿。官方优化建议：</p>
<ul>
<li>避免频繁调用 <code v-pre>setData</code> ;</li>
<li>避免每次 <code v-pre>setData</code> 都传递大量数据;</li>
<li>在后台页面进行 <code v-pre>setData</code></li>
</ul>
</li>
</ol>
</div></template>


