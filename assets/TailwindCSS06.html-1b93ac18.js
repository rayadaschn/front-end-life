import{_ as t,X as e,Y as d,$ as o}from"./framework-97fa2d96.js";const r={},l=o,a=e,s=d,i=l(`<p>一些常见的&quot;border&quot;类名规律：</p><ul><li><p>边框粗细（Border Width）：可以使用类名格式为&quot;<code>border-&lt;width&gt;</code>&quot;来设置边框的粗细。例如，&quot;<code>border</code>&quot;表示默认宽度的边框，&quot;<code>border-2</code>&quot;表示 2 个像素宽度的边框。</p></li><li><p>边框颜色（Border Color）：可以使用类名格式为&quot;<code>border-&lt;color&gt;</code>&quot;来设置边框的颜色。例如，&quot;<code>border-red-500</code>&quot;表示应用红色系列的边框颜色。</p></li><li><p>边框样式（Border Style）：可以使用类名格式为&quot;<code>border-&lt;style&gt;</code>&quot;来设置边框的样式，如实线、虚线等。例如，&quot;<code>border-dashed</code>&quot;表示使用虚线边框样式。</p></li><li><p>圆角边框（Border Radius）：可以使用类名格式为&quot;<code>rounded-&lt;size&gt;</code>&quot;来设置边框的圆角效果。例如，&quot;<code>rounded</code>&quot;表示默认圆角边框，&quot;<code>rounded-lg</code>&quot;表示更大程度的圆角边框。</p></li></ul><h2 id="border-width-边框粗细" tabindex="-1"><a class="header-anchor" href="#border-width-边框粗细" aria-hidden="true">#</a> Border Width 边框粗细</h2><p>常见的&quot;border-width&quot;类名规律：</p><ul><li><p>边框宽度（Border Width）：可以使用类名格式为&quot;<code>border-&lt;size&gt;</code>&quot;来设置边框的宽度。例如，&quot;<code>border</code>&quot;表示默认宽度的边框，&quot;<code>border-2</code>&quot;表示 2 个像素宽度的边框。</p></li><li><p>特定方向的边框宽度（Specific Directions）：如果你只想应用边框到特定的方向，可以使用特定方向的类名来设置边框宽度。这些类名的格式为&quot;<code>border-&lt;direction&gt;-&lt;size&gt;</code>&quot;。例如，&quot;<code>border-l-4</code>&quot;表示只在左侧应用 4 个像素宽度的边框。</p></li><li><p>上、下、左、右边框宽度（Individual Sides）：可以使用单独边框宽度的类名设置仅限于上、下、左、右边的边框宽度。这些类名的格式为&quot;<code>border-&lt;side&gt;-&lt;size&gt;</code>&quot;。例如，&quot;<code>border-t-2</code>&quot;表示仅应用 2 个像素宽度的顶部边框。</p></li></ul><p>部分对照表：</p><table><thead><tr><th>Class</th><th>Properties</th></tr></thead><tbody><tr><td>border-0</td><td>border-width: 0px;</td></tr><tr><td>border-2</td><td>border-width: 2px;</td></tr><tr><td>border-4</td><td>border-width: 4px;</td></tr><tr><td>border-8</td><td>border-width: 8px;</td></tr><tr><td>border</td><td>border-width: 1px;</td></tr><tr><td>border-x-0</td><td>border-left-width: 0px; border-right-width: 0px;</td></tr></tbody></table><h2 id="border-color-边框颜色" tabindex="-1"><a class="header-anchor" href="#border-color-边框颜色" aria-hidden="true">#</a> Border Color 边框颜色</h2><p>&quot;border-color&quot;类名规律：</p><ul><li><p>边框颜色（Border Color）：可以使用类名格式为&quot;<code>border-&lt;color&gt;</code>&quot;来设置边框的颜色。例如，&quot;<code>border-red-500</code>&quot;表示应用红色系列的边框颜色。</p></li><li><p>不透明度（Opacity）：你还可以使用不透明度类名来调整边框的透明度。这些类名的格式为&quot;<code>border-&lt;color&gt;/&lt;value&gt;</code>&quot;，其中&quot;value&quot;可以是从 0 到 100 的整数值。例如，&quot;<code>border-indigo-500/50</code>&quot;表示边框透明度为 50%。</p></li><li><p>特定方向的边框颜色：类名格式为 &quot;<code>border-&lt;side&gt;-&lt;color&gt;</code>&quot;。例如，“<code>border-t-indigo-500</code>”表示顶部边框有颜色。</p></li><li><p>自定义边框颜色：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>border-[#243c5a]<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token comment">&lt;!-- 意为 border-color: #243c5a; --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h2 id="border-style-边框样式" tabindex="-1"><a class="header-anchor" href="#border-style-边框样式" aria-hidden="true">#</a> Border Style 边框样式</h2><p>格式为：<code>border-{style}</code></p><table><thead><tr><th>Class</th><th>Properties</th></tr></thead><tbody><tr><td>border-solid</td><td>border-style: solid;</td></tr><tr><td>border-dashed</td><td>border-style: dashed;</td></tr><tr><td>border-dotted</td><td>border-style: dotted;</td></tr><tr><td>border-double</td><td>border-style: double;</td></tr><tr><td>border-hidden</td><td>border-style: hidden;</td></tr><tr><td>border-none</td><td>border-style: none;</td></tr></tbody></table><h2 id="border-radius-圆角边框" tabindex="-1"><a class="header-anchor" href="#border-radius-圆角边框" aria-hidden="true">#</a> Border Radius 圆角边框</h2><p>设置边框圆角的规则较多，大体可以分为如下几种情况：</p><ul><li><p>圆角边框（Border Radius）：可以使用类名格式为&quot;<code>rounded-&lt;size&gt;</code>&quot;来设置边框的圆角效果。例如，&quot;<code>rounded</code>&quot;表示默认圆角边框，&quot;<code>rounded-lg</code>&quot;表示更大程度的圆角边框。</p></li><li><p>特定方向的圆角边框（Specific Directions）：除了整体圆角边框外，还可以使用特定方向的类名来控制某个方向的圆角边框。这些类名的格式为&quot;<code>rounded-&lt;direction&gt;-&lt;size&gt;</code>&quot;。例如，&quot;<code>rounded-tl-lg</code>&quot;表示左上角（top left）有更大程度的圆角。</p></li><li><p>椭圆形边框（Ellipse）：通过使用类名&quot;rounded-full&quot;，可以将元素的边框变成椭圆形，使其看起来是一个圆形。</p></li></ul><p>部分对照表：</p><table><thead><tr><th style="text-align:left;">Class</th><th style="text-align:left;">Properties</th></tr></thead><tbody><tr><td style="text-align:left;">rounded-none</td><td style="text-align:left;">border-radius: 0px;</td></tr><tr><td style="text-align:left;">rounded-sm</td><td style="text-align:left;">border-radius: 0.125rem; /_ 2px _/</td></tr><tr><td style="text-align:left;">rounded</td><td style="text-align:left;">border-radius: 0.25rem; /_ 4px _/</td></tr><tr><td style="text-align:left;">rounded-md</td><td style="text-align:left;">border-radius: 0.375rem; /_ 6px _/</td></tr><tr><td style="text-align:left;">rounded-t-sm</td><td style="text-align:left;">border-top-left-radius: 0.125rem; border-top-right-radius: 0.125rem;</td></tr></tbody></table>`,18),n=[i];function u(c,p){return a(),s("div",null,n)}const h=t(r,[["render",u],["__file","TailwindCSS06.html.vue"]]);export{h as default};