import{_ as n,V as s,W as a,$ as t}from"./framework-2060dede.js";const e={},p=t(`<h1 id="多种方式实现居中" tabindex="-1"><a class="header-anchor" href="#多种方式实现居中" aria-hidden="true">#</a> 多种方式实现居中</h1><p>实现元素居中显示，有很多相关总结，但是还是有很多可以絮叨的地方。</p><p>先看示例代码：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>parent<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>son son-size<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>居中内容<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_1-居中元素定宽高" tabindex="-1"><a class="header-anchor" href="#_1-居中元素定宽高" aria-hidden="true">#</a> 1 居中元素定宽高</h2><p>若居中元素的大小固定，我们可以采用 <code>absolute</code> + <code>son 元素位置修正</code> 的方式进行。</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.son-size</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">heigh</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-1-absolute-负-margin" tabindex="-1"><a class="header-anchor" href="#_1-1-absolute-负-margin" aria-hidden="true">#</a> 1.1 absolute + 负 margin</h3><blockquote><p><strong>Tips: 绝对定位元素的百分比是基于父元素的宽高计算出来的。</strong></p></blockquote><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.parent</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.son</span> <span class="token punctuation">{</span>
  <span class="token property">posion</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
  <span class="token property">top</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>
  <span class="token property">left</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>
  <span class="token property">margin-left</span><span class="token punctuation">:</span> -50px<span class="token punctuation">;</span>
  <span class="token property">margin-top</span><span class="token punctuation">:</span> -50px<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种方式思路非常简单，先上下偏移父元素的一半，再依据自身宽高修正居中显示。</p><p>实际上容错性非常不好，若日后居中元素发生微小变化，则又需要进行调整。</p><h3 id="_1-2-absolute-calc" tabindex="-1"><a class="header-anchor" href="#_1-2-absolute-calc" aria-hidden="true">#</a> 1.2 absolute + calc</h3><p>同上种方式一样，只是换成了 <code>calc</code> 计算便宜位置了。</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.parent</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.son</span> <span class="token punctuation">{</span>
  <span class="token property">posion</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
  <span class="token property">top</span><span class="token punctuation">:</span> <span class="token function">calc</span><span class="token punctuation">(</span>50% - 50px<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token property">left</span><span class="token punctuation">:</span> <span class="token function">calc</span><span class="token punctuation">(</span>50% - 50px<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>calc</code> 中的百分比依旧遵循 <em>绝对定位元素的百分比是基于父元素的宽高计算出来的。</em></p><h3 id="_1-3-absolute-margin-auto-较好的实现" tabindex="-1"><a class="header-anchor" href="#_1-3-absolute-margin-auto-较好的实现" aria-hidden="true">#</a> 1.3 absolute + margin auto 较好的实现</h3><p>其实这种方式已经可以归纳为居中元素不定宽高了，但是由于属于上述俩种方式的优化，所以在此进行归类。</p><p>先看代码:</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.parent</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.son</span> <span class="token punctuation">{</span>
  <span class="token property">posion</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
  <span class="token property">top</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">left</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">right</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">bottom</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">margin</span><span class="token punctuation">:</span> auto<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上述代码中，有很多可以讨论的地方。</p><p>如，绝对定位中的 <code>top</code>、<code>left</code>等的含义是什么?</p><p>《CSS 世界》中解释： <code>left/top/right/bottom</code> 是具有定位特性元素专用的 CSS 属性，当一个绝对定位元素，其对立定位方向属性同时具有具体定位数值到时候，流体特性就发生了。</p><p>当统一方向上只有单一属性时，如只有 <code>left</code> 或 <code>top</code>，这个时候 元素的宽度或高度其实 0；只有当 <code>left</code> 和 <code>right</code>同时存在（<code>top</code> 和 <code>bottom</code> 同时存在），这个时候的宽度不为 0。表现为“格式化宽度”——宽度自适应与 包含该对象的 父级块 的 <code>padding box</code>。就是说这个时候的 宽高是等于父级元素的。</p><p>不是很好的写法：</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.parent</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.son</span> <span class="token punctuation">{</span>
  <span class="token property">posion</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
  <span class="token property">top</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">left</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 100%<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100%<span class="token punctuation">;</span>
  <span class="token property">margin</span><span class="token punctuation">:</span> auto<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>像这种，一边固定，宽度和高度用 <code>100%</code> 去继承父级 包含块，就不是很好的用法。因为“格式化宽度”是 父级包含块的 <code>padding box</code> ，所以如果父级包含块 有 <code>padding</code> 或者 <code>margin</code> 等属性时，这个时候 子元素就不是 父级包含块的 宽高大小了。</p><h2 id="_2-居中元素不定高" tabindex="-1"><a class="header-anchor" href="#_2-居中元素不定高" aria-hidden="true">#</a> 2 居中元素不定高</h2><p>若居中元素会动态变化，此时要实现居中，则还需要用到一些其它技巧了。</p><h3 id="_2-1-absolute-transform" tabindex="-1"><a class="header-anchor" href="#_2-1-absolute-transform" aria-hidden="true">#</a> 2.1 absolute + transform</h3><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.parent</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.son</span> <span class="token punctuation">{</span>
  <span class="token property">posion</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
  <span class="token property">top</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>
  <span class="token property">left</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>
  <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">translate</span><span class="token punctuation">(</span>-50%<span class="token punctuation">,</span> -50%<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中，我们用到了 <code>css3</code> 中的 <code>transform</code> 属性，通过 <code>transform</code> 对自身宽高进行偏移修正。</p><blockquote><p><strong>Tips： <code>transform</code> 中的百分比是基于自身宽高的，同 <code>top</code> 等属性不同。</strong></p></blockquote><h3 id="_2-2-lineheight-文本居中" tabindex="-1"><a class="header-anchor" href="#_2-2-lineheight-文本居中" aria-hidden="true">#</a> 2.2 lineheight 文本居中</h3><p>通过将 <code>parent</code> 父元素设置为行内元素，则可通过 <code>text-align</code> 实现 待居中元素的水平居中。而后，通过 <code>vertical-align</code> 将行内元素内容 垂直向上居中，实现整体效果。</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.parent</span> <span class="token punctuation">{</span>
  <span class="token property">line-height</span><span class="token punctuation">:</span> 400px<span class="token punctuation">;</span>
  <span class="token property">text-align</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span> // 行内元素 水平居中
  <span class="token property">font-size</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span> // 避免对 垂直居中进行干扰
<span class="token punctuation">}</span>
<span class="token selector">.son</span> <span class="token punctuation">{</span>
  <span class="token property">font-size</span><span class="token punctuation">:</span> 16px<span class="token punctuation">;</span>
  <span class="token property">display</span><span class="token punctuation">:</span> inline-block<span class="token punctuation">;</span>
  <span class="token property">vertical-align</span><span class="token punctuation">:</span> middle<span class="token punctuation">;</span>
  <span class="token property">line-height</span><span class="token punctuation">:</span> initial<span class="token punctuation">;</span>
  <span class="token property">text-align</span><span class="token punctuation">:</span> left<span class="token punctuation">;</span> // 修正文字
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实这种方式，还可称为多行文本垂直居中，若是单行文本居中，还有常用方法：</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">// 让 line-height 等于 height，实现垂直居中
.parent</span> <span class="token punctuation">{</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 400px<span class="token punctuation">;</span>
  <span class="token property">line-height</span><span class="token punctuation">:</span> 400px<span class="token punctuation">;</span>
  <span class="token property">text-align</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span> // 行内元素 水平居中
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-table-表格居中" tabindex="-1"><a class="header-anchor" href="#_2-3-table-表格居中" aria-hidden="true">#</a> 2.3 table 表格居中</h3><p>过去好像，利用 table 实现元素的居中方式也很流行，只不过如今被 flex 等更加强大的 css3 属性给代替了。</p><p>缺点也很明显，代码冗余，且性能不佳。</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>table</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>tbody</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>tr</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>parent<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>son<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>居中内容<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>td</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>tr</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>tbody</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>table</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.parent</span> <span class="token punctuation">{</span>
  <span class="token property">text-align</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.son</span> <span class="token punctuation">{</span>
  <span class="token property">display</span><span class="token punctuation">:</span> inline-block<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然，如果不用 table 布局，依旧想使用 table 属性，我们可以使用 <code>css-table</code> ：</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.parent</span> <span class="token punctuation">{</span>
  <span class="token property">display</span><span class="token punctuation">:</span> table-css<span class="token punctuation">;</span>
  <span class="token property">text-align</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span> // 水平居中
  <span class="token property">vertical-align</span><span class="token punctuation">:</span> middle<span class="token punctuation">;</span> // 垂直居中
<span class="token punctuation">}</span>
<span class="token selector">.son</span> <span class="token punctuation">{</span>
  <span class="token property">display</span><span class="token punctuation">:</span> inline-block<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-flex-布局" tabindex="-1"><a class="header-anchor" href="#_2-4-flex-布局" aria-hidden="true">#</a> 2.4 flex 布局</h3><p>终于轮到 flex 布局了，现代流行的一维强大布局方式。</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.parent</span> <span class="token punctuation">{</span>
  <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
  <span class="token property">justify-content</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
  <span class="token property">align-items</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>代码非常简洁，优雅。</p><h3 id="_2-5-grid-布局" tabindex="-1"><a class="header-anchor" href="#_2-5-grid-布局" aria-hidden="true">#</a> 2.5 grid 布局</h3><p>相对于 flex 布局，grid 布局更多用于二维，但是也是布局能手。</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.parent</span> <span class="token punctuation">{</span>
  <span class="token property">display</span><span class="token punctuation">:</span> grid<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.son</span> <span class="token punctuation">{</span>
  <span class="token property">align-self</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
  <span class="token property">justify-self</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也很优雅，但是兼容性可能较差。</p><p>差不多，常用的就是这些布局方式了，对于日常工作也够用了。当然还有很多技巧，往后见到再做补充吧。</p><p>以上。</p>`,55),c=[p];function o(i,l){return s(),a("div",null,c)}const d=n(e,[["render",o],["__file","DifferentMethodsToAchieveCentering.html.vue"]]);export{d as default};