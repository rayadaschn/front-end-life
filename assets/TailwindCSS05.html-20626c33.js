import{_ as t,X as a,Y as n,$ as s}from"./framework-97fa2d96.js";const e={},o=s,p=a,c=n,l=o(`<p>常见的&quot;background&quot;类名规律：</p><ul><li><p>背景颜色（Background Color）：可以使用类名格式为&quot;<code>bg-&lt;colorName&gt;</code>&quot;来设置元素的背景颜色。例如，&quot;<code>bg-red-500</code>&quot;表示应用红色系列的背景颜色。</p></li><li><p>背景图片（Background Image）：可以使用类名格式为&quot;<code>bg-&lt;name&gt;</code>&quot;来设置指定的背景图片。这需要在配置文件中定义对应的背景图像。例如，&quot;<code>bg-pattern</code>&quot;表示应用名为&quot;<code>pattern</code>&quot;的背景图片。</p></li><li><p>背景大小（Background Size）：可以使用类名格式为&quot;<code>bg-&lt;size&gt;</code>&quot;来设置背景图片的大小。例如，&quot;<code>bg-cover</code>&quot;表示以尽可能大的尺寸覆盖元素的背景图片。</p></li><li><p>背景位置（Background Position）：可以使用类名格式为&quot;<code>bg-&lt;position&gt;</code>&quot;来设置背景图片的位置。例如，&quot;<code>bg-center</code>&quot;表示将背景图片居中放置。</p></li><li><p>背景重复（Background Repeat）：可以使用类名格式为&quot;<code>bg-&lt;repeat&gt;</code>&quot;来设置背景图片的重复方式。例如，&quot;<code>bg-repeat</code>&quot;表示背景图片在水平和垂直方向上均重复。</p></li><li><p>背景附加效果（Background Attachment）：可以使用类名格式为&quot;<code>bg-&lt;attachment&gt;</code>&quot;来设置背景图片的附加效果。例如，&quot;<code>bg-fixed</code>&quot;表示背景图片固定在元素上方不随滚动而移动。</p></li></ul><h2 id="background-color-背景颜色" tabindex="-1"><a class="header-anchor" href="#background-color-背景颜色" aria-hidden="true">#</a> Background Color 背景颜色</h2><p>背景颜色同文本颜色一致，只是类名改为 bg，在此不再对基础设定进行重复。</p><p>改变背景的不透明度。在开发过程中，除了设定背景颜色外，还想同时设定背景颜色不透明度，可以用格式为 “<code>bg-&lt;colorName&gt;/&lt;number&gt;</code>” 的类名来改变背景颜色的不透明度。</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bg-sky-500/100 ...<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bg-sky-500/75 ...<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bg-sky-500/50 ...<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>效果如下: <img src="https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202306271056139.png" alt="opacity" loading="lazy"></p><p>数字代表不透明度的百分比，数值为 0 则完全透明化。</p><h2 id="background-image-背景图片" tabindex="-1"><a class="header-anchor" href="#background-image-背景图片" aria-hidden="true">#</a> Background Image 背景图片</h2><p>背景图片若是使用 类名表述，则需要事先在配置文件中定义对应的背景图像。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// tailwind.config.js</span>
module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">theme</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">extend</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">backgroundImage</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token string-property property">&#39;hero-pattern&#39;</span><span class="token operator">:</span> <span class="token string">&quot;url(&#39;/img/hero-pattern.svg&#39;)&quot;</span><span class="token punctuation">,</span>
        <span class="token string-property property">&#39;footer-texture&#39;</span><span class="token operator">:</span> <span class="token string">&quot;url(&#39;/img/footer-texture.png&#39;)&quot;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>定义了俩张图片，则可以直接使用它们：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bg-hero-pattern<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bg-footer-texture<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>当然也可自定义图片：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bg-[url(&#39;/img/hero-pattern.svg&#39;)]<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token comment">&lt;!-- 使用变量形式进行加载 --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="background-size-背景大小" tabindex="-1"><a class="header-anchor" href="#background-size-背景大小" aria-hidden="true">#</a> Background Size 背景大小</h2><table><thead><tr><th>Class</th><th>Properties</th></tr></thead><tbody><tr><td>bg-auto</td><td>background-size: auto;</td></tr><tr><td>bg-cover</td><td>background-size: cover;</td></tr><tr><td>bg-contain</td><td>background-size: contain;</td></tr></tbody></table><p>自定义图片大小，以 length 开头，下划线连接 <code>_</code>：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bg-[length:200px_100px]<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token comment">&lt;!-- 意为 background-size: 200px 100px; --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="background-position-背景位置" tabindex="-1"><a class="header-anchor" href="#background-position-背景位置" aria-hidden="true">#</a> Background Position 背景位置</h2><table><thead><tr><th>Class</th><th>Properties</th></tr></thead><tbody><tr><td>bg-bottom</td><td>background-position: bottom;</td></tr><tr><td>bg-center</td><td>background-position: center;</td></tr><tr><td>bg-left</td><td>background-position: left;</td></tr><tr><td>bg-left-bottom</td><td>background-position: left bottom;</td></tr><tr><td>bg-left-top</td><td>background-position: left top;</td></tr><tr><td>bg-right</td><td>background-position: right;</td></tr><tr><td>bg-right-bottom</td><td>background-position: right bottom;</td></tr><tr><td>bg-right-top</td><td>background-position: right top;</td></tr><tr><td>bg-top</td><td>background-position: top;</td></tr></tbody></table><p>自定义图片位置，以下划线连接 <code>_</code>：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bg-[center_top_1rem]<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token comment">&lt;!-- 意为 background-position: center top 1rem; --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="background-repeat-背景重复" tabindex="-1"><a class="header-anchor" href="#background-repeat-背景重复" aria-hidden="true">#</a> Background Repeat 背景重复</h2><table><thead><tr><th>Class</th><th>Properties</th></tr></thead><tbody><tr><td>bg-repeat</td><td>background-repeat: repeat;</td></tr><tr><td>bg-no-repeat</td><td>background-repeat: no-repeat;</td></tr><tr><td>bg-repeat-x</td><td>background-repeat: repeat-x;</td></tr><tr><td>bg-repeat-y</td><td>background-repeat: repeat-y;</td></tr><tr><td>bg-repeat-round</td><td>background-repeat: round;</td></tr><tr><td>bg-repeat-space</td><td>background-repeat: space;</td></tr></tbody></table><h2 id="background-attachment-背景附加效果" tabindex="-1"><a class="header-anchor" href="#background-attachment-背景附加效果" aria-hidden="true">#</a> Background Attachment 背景附加效果</h2><table><thead><tr><th>Class</th><th>Properties</th></tr></thead><tbody><tr><td>bg-fixed</td><td>background-attachment: fixed;</td></tr><tr><td>bg-local</td><td>background-attachment: local;</td></tr><tr><td>bg-scroll</td><td>background-attachment: scroll;</td></tr></tbody></table>`,27),d=[l];function r(u,i){return p(),c("div",null,d)}const k=t(e,[["render",r],["__file","TailwindCSS05.html.vue"]]);export{k as default};
