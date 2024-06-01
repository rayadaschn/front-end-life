import{_ as i,a0 as c,F as l,a2 as o,a1 as u,Z as r,X as d,Y as v,$ as k}from"./framework-5dd7fabc.js";const b={},n=c,s=l,m=o,a=u,e=r,h=k,x=d,g=v,f={href:"https://less.bootcss.com/",target:"_blank",rel:"noopener noreferrer"},y=h(`<h2 id="变量" tabindex="-1"><a class="header-anchor" href="#变量" aria-hidden="true">#</a> 变量</h2><p>变量以 <code>@</code> 开头，在变量声明时，变量名和 <code>:</code> 之间可以添加注释，注释内容以 <code>/**/</code> 包裹。</p><div class="language-less line-numbers-mode" data-ext="less"><pre class="language-less"><code><span class="token variable">@color<span class="token punctuation">:</span></span> #fff<span class="token punctuation">;</span>
<span class="token variable">@width<span class="token punctuation">:</span></span> 100px<span class="token punctuation">;</span>
<span class="token variable">@height<span class="token punctuation">:</span></span> 100px<span class="token punctuation">;</span>

<span class="token selector">.box</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> <span class="token variable">@width</span><span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> <span class="token variable">@height</span><span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> <span class="token variable">@color</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编译后：</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.box</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> #fff<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="导入" tabindex="-1"><a class="header-anchor" href="#导入" aria-hidden="true">#</a> 导入</h2><p>less 文件的导入用 <code>@import</code> 指令，可以导入其他 less 文件。</p><div class="language-less line-numbers-mode" data-ext="less"><pre class="language-less"><code><span class="token variable">@import</span> <span class="token string">&#39;mixins.less&#39;</span><span class="token punctuation">;</span>

<span class="token selector">.box</span> <span class="token punctuation">{</span>
  <span class="token mixin-usage function">.border-radius</span><span class="token punctuation">(</span>10px<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="嵌套" tabindex="-1"><a class="header-anchor" href="#嵌套" aria-hidden="true">#</a> 嵌套</h2><p>less 支持嵌套语法，可以避免使用无语意的 class。</p><div class="language-less line-numbers-mode" data-ext="less"><pre class="language-less"><code><span class="token selector">.box</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> #fff<span class="token punctuation">;</span>

  <span class="token selector">.title</span> <span class="token punctuation">{</span>
    <span class="token property">font-size</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>
    <span class="token property">color</span><span class="token punctuation">:</span> #000<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编译后：</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.box</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> #fff<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.box .title</span> <span class="token punctuation">{</span>
  <span class="token property">font-size</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>
  <span class="token property">color</span><span class="token punctuation">:</span> #000<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="数学计算" tabindex="-1"><a class="header-anchor" href="#数学计算" aria-hidden="true">#</a> 数学计算</h2><p>less 支持数学计算，可以在变量和表达式中使用加减乘除等运算符。</p><div class="language-less line-numbers-mode" data-ext="less"><pre class="language-less"><code><span class="token variable">@width<span class="token punctuation">:</span></span> 100px<span class="token punctuation">;</span>
<span class="token variable">@height<span class="token punctuation">:</span></span> 100px<span class="token punctuation">;</span>

<span class="token selector">.box</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> <span class="token variable">@width</span> <span class="token operator">+</span> 10px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> <span class="token variable">@height</span> <span class="token operator">-</span> 10px<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编译后：</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.box</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 110px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 90px<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="混合" tabindex="-1"><a class="header-anchor" href="#混合" aria-hidden="true">#</a> 混合</h2><p>混合（Mixin）用于定义可重复使用的样式，避免了使用无语意的 class。</p><div class="language-less line-numbers-mode" data-ext="less"><pre class="language-less"><code><span class="token selector">.border-radius(<span class="token variable">@radius</span>)</span> <span class="token punctuation">{</span>
  <span class="token property">-webkit-border-radius</span><span class="token punctuation">:</span> <span class="token variable">@radius</span><span class="token punctuation">;</span>
  <span class="token property">-moz-border-radius</span><span class="token punctuation">:</span> <span class="token variable">@radius</span><span class="token punctuation">;</span>
  <span class="token property">-ms-border-radius</span><span class="token punctuation">:</span> <span class="token variable">@radius</span><span class="token punctuation">;</span>
  <span class="token property">-o-border-radius</span><span class="token punctuation">:</span> <span class="token variable">@radius</span><span class="token punctuation">;</span>
  <span class="token property">border-radius</span><span class="token punctuation">:</span> <span class="token variable">@radius</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.box</span> <span class="token punctuation">{</span>
  <span class="token mixin-usage function">.border-radius</span><span class="token punctuation">(</span>10px<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编译后：</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.box</span> <span class="token punctuation">{</span>
  <span class="token property">-webkit-border-radius</span><span class="token punctuation">:</span> 10px<span class="token punctuation">;</span>
  <span class="token property">-moz-border-radius</span><span class="token punctuation">:</span> 10px<span class="token punctuation">;</span>
  <span class="token property">-ms-border-radius</span><span class="token punctuation">:</span> 10px<span class="token punctuation">;</span>
  <span class="token property">-o-border-radius</span><span class="token punctuation">:</span> 10px<span class="token punctuation">;</span>
  <span class="token property">border-radius</span><span class="token punctuation">:</span> 10px<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="选择器" tabindex="-1"><a class="header-anchor" href="#选择器" aria-hidden="true">#</a> 选择器</h2><p>less 使用符号 <code>&amp;</code> 来表示父选择器。</p><div class="language-less line-numbers-mode" data-ext="less"><pre class="language-less"><code><span class="token selector">.box</span> <span class="token punctuation">{</span>
  <span class="token selector">&amp;:hover</span> <span class="token punctuation">{</span>
    <span class="token property">color</span><span class="token punctuation">:</span> #fff<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编译后：</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.box:hover</span> <span class="token punctuation">{</span>
  <span class="token property">color</span><span class="token punctuation">:</span> #fff<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,28);function _(w,N){const p=s("RouterLink"),t=s("ExternalLinkIcon");return x(),g("div",null,[e("p",null,[n("此前快速复盘过一轮 "),a(p,{to:"/CSS/Scss01.html"},{default:m(()=>[n("Scss")]),_:1}),n("，本文则是针对 "),e("a",f,[n("Less"),a(t)]),n(" 进行复盘梳理。")]),y])}const L=i(b,[["render",_],["__file","Less01.html.vue"]]);export{L as default};
