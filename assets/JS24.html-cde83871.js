import{_ as n,X as s,Y as a,$ as t}from"./framework-5dd7fabc.js";const p={},e=t,o=s,c=a,l=e(`<p>本文简单手写一个 Canvas 画板，效果如下：</p><figure><img src="https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202405261550616.png" alt="Canvas 画板" tabindex="0" loading="lazy"><figcaption>Canvas 画板</figcaption></figure><p>功能点：</p><ol><li>更改画笔颜色;</li><li>更改画笔大小;</li><li>清空画布。</li></ol><h2 id="理清思路" tabindex="-1"><a class="header-anchor" href="#理清思路" aria-hidden="true">#</a> 理清思路</h2><ol><li>获取画布元素;</li><li>获取画笔颜色、画笔大小;</li><li>获取画布上下文;</li><li>监听鼠标按下事件;</li><li>监听鼠标移动事件;</li><li>监听鼠标抬起事件;</li><li>鼠标按下时，记录鼠标按下时的坐标;</li><li>鼠标移动时，根据鼠标按下时的坐标和移动时的坐标，绘制出一条线段;</li><li>鼠标抬起时，结束绘制。</li></ol><h2 id="代码实现" tabindex="-1"><a class="header-anchor" href="#代码实现" aria-hidden="true">#</a> 代码实现</h2><h3 id="绘制-ui" tabindex="-1"><a class="header-anchor" href="#绘制-ui" aria-hidden="true">#</a> 绘制 UI</h3><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>en<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>UTF-8<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>viewport<span class="token punctuation">&quot;</span></span> <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>width=device-width, initial-scale=1.0<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">&gt;</span></span>Canvas 画板<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>style</span><span class="token punctuation">&gt;</span></span><span class="token style"><span class="token language-css">
      <span class="token selector">body</span> <span class="token punctuation">{</span>
        <span class="token property">margin</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token selector">.container</span> <span class="token punctuation">{</span>
        <span class="token property">width</span><span class="token punctuation">:</span> 1024px<span class="token punctuation">;</span>
        <span class="token property">height</span><span class="token punctuation">:</span> 600px<span class="token punctuation">;</span>
        <span class="token property">margin</span><span class="token punctuation">:</span> 50px auto 0<span class="token punctuation">;</span>
        <span class="token property">box-shadow</span><span class="token punctuation">:</span> 0 0 10px #000<span class="token punctuation">;</span>
        <span class="token property">border-radius</span><span class="token punctuation">:</span> 10px<span class="token punctuation">;</span>
        <span class="token property">overflow</span><span class="token punctuation">:</span> hidden<span class="token punctuation">;</span>
        <span class="token property">cursor</span><span class="token punctuation">:</span> crosshair<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token comment">/* 工具栏 */</span>
      <span class="token selector">.tool-bar</span> <span class="token punctuation">{</span>
        <span class="token property">width</span><span class="token punctuation">:</span> 1024px<span class="token punctuation">;</span>
        <span class="token property">height</span><span class="token punctuation">:</span> 80px<span class="token punctuation">;</span>
        <span class="token property">margin</span><span class="token punctuation">:</span> 18px auto<span class="token punctuation">;</span>
        <span class="token property">border-radius</span><span class="token punctuation">:</span> 5px<span class="token punctuation">;</span>
        <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
        <span class="token property">align-items</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
        <span class="token comment">/* background-color: #8b8888;  */</span>
      <span class="token punctuation">}</span>

      <span class="token selector">.tool-bar div</span> <span class="token punctuation">{</span>
        <span class="token property">width</span><span class="token punctuation">:</span> 78px<span class="token punctuation">;</span>
        <span class="token property">height</span><span class="token punctuation">:</span> 78px<span class="token punctuation">;</span>
        <span class="token property">border</span><span class="token punctuation">:</span> 1px solid #b3b2b2<span class="token punctuation">;</span>
        <span class="token property">margin</span><span class="token punctuation">:</span> 0 2px<span class="token punctuation">;</span>
        <span class="token property">border-radius</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>
        <span class="token property">box-sizing</span><span class="token punctuation">:</span> border-box<span class="token punctuation">;</span>
        <span class="token property">cursor</span><span class="token punctuation">:</span> pointer<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token selector">.tool-bar .black</span> <span class="token punctuation">{</span>
        <span class="token property">background-color</span><span class="token punctuation">:</span> #000<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token selector">.tool-bar .red</span> <span class="token punctuation">{</span>
        <span class="token property">background-color</span><span class="token punctuation">:</span> #f00<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token selector">.tool-bar .green</span> <span class="token punctuation">{</span>
        <span class="token property">background-color</span><span class="token punctuation">:</span> #0f0<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token selector">.tool-bar .blue</span> <span class="token punctuation">{</span>
        <span class="token property">background-color</span><span class="token punctuation">:</span> #00f<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token selector">.tool-bar .line</span> <span class="token punctuation">{</span>
        <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
        <span class="token property">justify-content</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
        <span class="token property">align-items</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token selector">.tool-bar .line span</span> <span class="token punctuation">{</span>
        <span class="token property">display</span><span class="token punctuation">:</span> block<span class="token punctuation">;</span>
        <span class="token property">border-radius</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>
        <span class="token property">background-color</span><span class="token punctuation">:</span> #000000<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token selector">.tool-bar .line-4 span</span> <span class="token punctuation">{</span>
        <span class="token property">width</span><span class="token punctuation">:</span> 4px<span class="token punctuation">;</span>
        <span class="token property">height</span><span class="token punctuation">:</span> 4px<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token selector">.tool-bar .line-8 span</span> <span class="token punctuation">{</span>
        <span class="token property">width</span><span class="token punctuation">:</span> 8px<span class="token punctuation">;</span>
        <span class="token property">height</span><span class="token punctuation">:</span> 8px<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token selector">.tool-bar .line-12 span</span> <span class="token punctuation">{</span>
        <span class="token property">width</span><span class="token punctuation">:</span> 12px<span class="token punctuation">;</span>
        <span class="token property">height</span><span class="token punctuation">:</span> 12px<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token selector">.tool-bar .remove</span> <span class="token punctuation">{</span>
        <span class="token property">text-align</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
        <span class="token property">line-height</span><span class="token punctuation">:</span> 78px<span class="token punctuation">;</span>
        <span class="token property">font-size</span><span class="token punctuation">:</span> 40<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    </span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>style</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">&gt;</span></span>
    <span class="token comment">&lt;!-- 画板主体 --&gt;</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>container<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>canvas</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>myCanvas<span class="token punctuation">&quot;</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>canvas<span class="token punctuation">&quot;</span></span> <span class="token attr-name">width</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>1024<span class="token punctuation">&quot;</span></span> <span class="token attr-name">height</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>600<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>

    <span class="token comment">&lt;!-- 工具栏 --&gt;</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>tool-bar<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>color black<span class="token punctuation">&quot;</span></span> <span class="token attr-name">data-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>black<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>color red<span class="token punctuation">&quot;</span></span> <span class="token attr-name">data-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>red<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>color green<span class="token punctuation">&quot;</span></span> <span class="token attr-name">data-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>green<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>color blue<span class="token punctuation">&quot;</span></span> <span class="token attr-name">data-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>blue<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>line line-4<span class="token punctuation">&quot;</span></span> <span class="token attr-name">data-line</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>4<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>line line-8<span class="token punctuation">&quot;</span></span> <span class="token attr-name">data-line</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>8<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>line line-12<span class="token punctuation">&quot;</span></span> <span class="token attr-name">data-line</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>12<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>remove<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>擦除<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="编写插件事件" tabindex="-1"><a class="header-anchor" href="#编写插件事件" aria-hidden="true">#</a> 编写插件事件</h3><p>在写插件时，分为俩个步骤:</p><ol><li>初始化插件;</li><li>绑定监听事件;</li></ol><h4 id="初始化插件" tabindex="-1"><a class="header-anchor" href="#初始化插件" aria-hidden="true">#</a> 初始化插件</h4><p>初始化插件，包含初始化数据和定义所需要的监听事件。</p><p>监听事件包含，点击事件、移动事件，抬起事件。而事件监听都放在 bindEvent 函数中。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token punctuation">;</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 获取元素</span>
  <span class="token keyword">var</span> can <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;myCanvas&#39;</span><span class="token punctuation">)</span>
  <span class="token keyword">var</span> tools <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementsByClassName</span><span class="token punctuation">(</span><span class="token string">&#39;tool-bar&#39;</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>

  <span class="token comment">// 初始化数据</span>
  <span class="token keyword">var</span> ctx <span class="token operator">=</span> can<span class="token punctuation">.</span><span class="token function">getContext</span><span class="token punctuation">(</span><span class="token string">&#39;2d&#39;</span><span class="token punctuation">)</span>
  <span class="token keyword">var</span> cWidth <span class="token operator">=</span> can<span class="token punctuation">.</span>width
  <span class="token keyword">var</span> cHeight <span class="token operator">=</span> can<span class="token punctuation">.</span>height
  <span class="token keyword">var</span> color <span class="token operator">=</span> <span class="token string">&#39;block&#39;</span>
  <span class="token keyword">var</span> lineWidth <span class="token operator">=</span> <span class="token number">4</span>
  <span class="token keyword">var</span> x <span class="token operator">=</span> <span class="token number">0</span>
  <span class="token keyword">var</span> y <span class="token operator">=</span> <span class="token number">0</span>

  <span class="token doc-comment comment">/** 定义初始化函数 */</span>
  <span class="token keyword">var</span> <span class="token function-variable function">init</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">bindEvent</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/** 绑定事件 */</span>
  <span class="token keyword">function</span> <span class="token function">bindEvent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token doc-comment comment">/** 鼠标点击 */</span>
  <span class="token keyword">function</span> <span class="token function">mouseDown</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token doc-comment comment">/** 移动鼠标 */</span>
  <span class="token keyword">function</span> <span class="token function">mouseMove</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token doc-comment comment">/** 鼠标抬起 */</span>
  <span class="token keyword">function</span> <span class="token function">mouseUp</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token doc-comment comment">/** 点击工具栏 */</span>
  <span class="token keyword">function</span> <span class="token function">clickTool</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="完善监听事件" tabindex="-1"><a class="header-anchor" href="#完善监听事件" aria-hidden="true">#</a> 完善监听事件</h4><p>思路为:</p><ol><li>获取 Canvas 上下文;</li><li>调用 beginPath 开始新的绘制;</li><li>调用 moveTo 将画笔移动到鼠标位置;</li><li>持续监听鼠标移动位置, 并调用 lineTo 绘制线条;</li><li>调用 stroke 完成绘制，并在最后鼠标抬起时，清空监听事件。</li></ol><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token punctuation">;</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> can <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;myCanvas&#39;</span><span class="token punctuation">)</span>
  <span class="token keyword">var</span> tools <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementsByClassName</span><span class="token punctuation">(</span><span class="token string">&#39;tool-bar&#39;</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>

  <span class="token keyword">var</span> ctx <span class="token operator">=</span> can<span class="token punctuation">.</span><span class="token function">getContext</span><span class="token punctuation">(</span><span class="token string">&#39;2d&#39;</span><span class="token punctuation">)</span>
  <span class="token keyword">var</span> cWidth <span class="token operator">=</span> can<span class="token punctuation">.</span>width
  <span class="token keyword">var</span> cHeight <span class="token operator">=</span> can<span class="token punctuation">.</span>height
  <span class="token keyword">var</span> color <span class="token operator">=</span> <span class="token string">&#39;block&#39;</span>
  <span class="token keyword">var</span> lineWidth <span class="token operator">=</span> <span class="token number">4</span>
  <span class="token keyword">var</span> x <span class="token operator">=</span> <span class="token number">0</span>
  <span class="token keyword">var</span> y <span class="token operator">=</span> <span class="token number">0</span>

  <span class="token keyword">var</span> <span class="token function-variable function">init</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">bindEvent</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/** 绑定事件 */</span>
  <span class="token keyword">function</span> <span class="token function">bindEvent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 画布事件</span>
    can<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span>
      <span class="token string">&#39;mousedown&#39;</span><span class="token punctuation">,</span>
      <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">mouseDown</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span>

        document<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;mousemove&#39;</span><span class="token punctuation">,</span> mouseMove<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>
        document<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;mouseup&#39;</span><span class="token punctuation">,</span> mouseUp<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token boolean">false</span>
    <span class="token punctuation">)</span>

    <span class="token comment">// 工具栏事件</span>
    tools<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;click&#39;</span><span class="token punctuation">,</span> clickTool<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/** 鼠标点击 */</span>
  <span class="token keyword">function</span> <span class="token function">mouseDown</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">setCanXY</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span>

    ctx<span class="token punctuation">.</span><span class="token function">beginPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 开始新的绘制,避免干扰之前已有的绘图</span>
    ctx<span class="token punctuation">.</span>strokeStyle <span class="token operator">=</span> color
    ctx<span class="token punctuation">.</span>lineWidth <span class="token operator">=</span> lineWidth
    ctx<span class="token punctuation">.</span>lineCap <span class="token operator">=</span> <span class="token string">&#39;round&#39;</span>
    ctx<span class="token punctuation">.</span>lineJoin <span class="token operator">=</span> <span class="token string">&#39;round&#39;</span>
    ctx<span class="token punctuation">.</span><span class="token function">moveTo</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span> y<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/** 移动鼠标 */</span>
  <span class="token keyword">function</span> <span class="token function">mouseMove</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">setCanXY</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span>

    ctx<span class="token punctuation">.</span><span class="token function">lineTo</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span> y<span class="token punctuation">)</span>
    ctx<span class="token punctuation">.</span><span class="token function">stroke</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/** 鼠标抬起 */</span>
  <span class="token keyword">function</span> <span class="token function">mouseUp</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    document<span class="token punctuation">.</span><span class="token function">removeEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;mousemove&#39;</span><span class="token punctuation">,</span> mouseMove<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>
    document<span class="token punctuation">.</span><span class="token function">removeEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;mouseup&#39;</span><span class="token punctuation">,</span> mouseUp<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/** 设置落笔位置 */</span>
  <span class="token keyword">function</span> <span class="token function">setCanXY</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">var</span> e <span class="token operator">=</span> e <span class="token operator">||</span> window<span class="token punctuation">.</span>event

    <span class="token keyword">var</span> xPos <span class="token operator">=</span> e<span class="token punctuation">.</span>clientX <span class="token operator">-</span> can<span class="token punctuation">.</span>offsetLeft
    <span class="token keyword">var</span> yPos <span class="token operator">=</span> e<span class="token punctuation">.</span>clientY <span class="token operator">-</span> can<span class="token punctuation">.</span>offsetTop
    <span class="token comment">// 边界限制</span>
    x <span class="token operator">=</span> xPos <span class="token operator">&lt;</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token number">0</span> <span class="token operator">:</span> xPos <span class="token operator">&gt;</span> cWidth <span class="token operator">?</span> cWidth <span class="token operator">:</span> xPos
    y <span class="token operator">=</span> yPos <span class="token operator">&lt;</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token number">0</span> <span class="token operator">:</span> yPos <span class="token operator">&gt;</span> cHeight <span class="token operator">?</span> cHeight <span class="token operator">:</span> yPos
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/** 点击工具栏 */</span>
  <span class="token keyword">function</span> <span class="token function">clickTool</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">var</span> e <span class="token operator">=</span> e <span class="token operator">||</span> window<span class="token punctuation">.</span>event
    <span class="token keyword">var</span> tar <span class="token operator">=</span> e<span class="token punctuation">.</span>target <span class="token operator">||</span> e<span class="token punctuation">.</span>srcElement

    <span class="token comment">// 检查是否点击了颜色工具</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>tar<span class="token punctuation">.</span>classList<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span><span class="token string">&#39;color&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      color <span class="token operator">=</span> tar<span class="token punctuation">.</span><span class="token function">getAttribute</span><span class="token punctuation">(</span><span class="token string">&#39;data-color&#39;</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 检查是否点击了线宽工具</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>tar<span class="token punctuation">.</span>classList<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span><span class="token string">&#39;line&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      lineWidth <span class="token operator">=</span> tar<span class="token punctuation">.</span><span class="token function">getAttribute</span><span class="token punctuation">(</span><span class="token string">&#39;data-line&#39;</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 检查是否点击了擦除工具</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>tar<span class="token punctuation">.</span>classList<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span><span class="token string">&#39;remove&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      ctx<span class="token punctuation">.</span><span class="token function">clearRect</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> cWidth<span class="token punctuation">,</span> cHeight<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="完整插件代码" tabindex="-1"><a class="header-anchor" href="#完整插件代码" aria-hidden="true">#</a> 完整插件代码</h2><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>en<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>UTF-8<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>viewport<span class="token punctuation">&quot;</span></span> <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>width=device-width, initial-scale=1.0<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">&gt;</span></span>Canvas 画板<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>style</span><span class="token punctuation">&gt;</span></span><span class="token style"><span class="token language-css">
      <span class="token selector">body</span> <span class="token punctuation">{</span>
        <span class="token property">margin</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token selector">.container</span> <span class="token punctuation">{</span>
        <span class="token property">width</span><span class="token punctuation">:</span> 1024px<span class="token punctuation">;</span>
        <span class="token property">height</span><span class="token punctuation">:</span> 600px<span class="token punctuation">;</span>
        <span class="token property">margin</span><span class="token punctuation">:</span> 50px auto 0<span class="token punctuation">;</span>
        <span class="token property">box-shadow</span><span class="token punctuation">:</span> 0 0 10px #000<span class="token punctuation">;</span>
        <span class="token property">border-radius</span><span class="token punctuation">:</span> 10px<span class="token punctuation">;</span>
        <span class="token property">overflow</span><span class="token punctuation">:</span> hidden<span class="token punctuation">;</span>
        <span class="token property">cursor</span><span class="token punctuation">:</span> crosshair<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token comment">/* 工具栏 */</span>
      <span class="token selector">.tool-bar</span> <span class="token punctuation">{</span>
        <span class="token property">width</span><span class="token punctuation">:</span> 1024px<span class="token punctuation">;</span>
        <span class="token property">height</span><span class="token punctuation">:</span> 80px<span class="token punctuation">;</span>
        <span class="token property">margin</span><span class="token punctuation">:</span> 18px auto<span class="token punctuation">;</span>
        <span class="token property">border-radius</span><span class="token punctuation">:</span> 5px<span class="token punctuation">;</span>
        <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
        <span class="token property">align-items</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
        <span class="token comment">/* background-color: #8b8888;  */</span>
      <span class="token punctuation">}</span>

      <span class="token selector">.tool-bar div</span> <span class="token punctuation">{</span>
        <span class="token property">width</span><span class="token punctuation">:</span> 78px<span class="token punctuation">;</span>
        <span class="token property">height</span><span class="token punctuation">:</span> 78px<span class="token punctuation">;</span>
        <span class="token property">border</span><span class="token punctuation">:</span> 1px solid #b3b2b2<span class="token punctuation">;</span>
        <span class="token property">margin</span><span class="token punctuation">:</span> 0 2px<span class="token punctuation">;</span>
        <span class="token property">border-radius</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>
        <span class="token property">box-sizing</span><span class="token punctuation">:</span> border-box<span class="token punctuation">;</span>
        <span class="token property">cursor</span><span class="token punctuation">:</span> pointer<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token selector">.tool-bar .black</span> <span class="token punctuation">{</span>
        <span class="token property">background-color</span><span class="token punctuation">:</span> #000<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token selector">.tool-bar .red</span> <span class="token punctuation">{</span>
        <span class="token property">background-color</span><span class="token punctuation">:</span> #f00<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token selector">.tool-bar .green</span> <span class="token punctuation">{</span>
        <span class="token property">background-color</span><span class="token punctuation">:</span> #0f0<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token selector">.tool-bar .blue</span> <span class="token punctuation">{</span>
        <span class="token property">background-color</span><span class="token punctuation">:</span> #00f<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token selector">.tool-bar .line</span> <span class="token punctuation">{</span>
        <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
        <span class="token property">justify-content</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
        <span class="token property">align-items</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token selector">.tool-bar .line span</span> <span class="token punctuation">{</span>
        <span class="token property">display</span><span class="token punctuation">:</span> block<span class="token punctuation">;</span>
        <span class="token property">border-radius</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>
        <span class="token property">background-color</span><span class="token punctuation">:</span> #000000<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token selector">.tool-bar .line-4 span</span> <span class="token punctuation">{</span>
        <span class="token property">width</span><span class="token punctuation">:</span> 4px<span class="token punctuation">;</span>
        <span class="token property">height</span><span class="token punctuation">:</span> 4px<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token selector">.tool-bar .line-8 span</span> <span class="token punctuation">{</span>
        <span class="token property">width</span><span class="token punctuation">:</span> 8px<span class="token punctuation">;</span>
        <span class="token property">height</span><span class="token punctuation">:</span> 8px<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token selector">.tool-bar .line-12 span</span> <span class="token punctuation">{</span>
        <span class="token property">width</span><span class="token punctuation">:</span> 12px<span class="token punctuation">;</span>
        <span class="token property">height</span><span class="token punctuation">:</span> 12px<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token selector">.tool-bar .remove</span> <span class="token punctuation">{</span>
        <span class="token property">text-align</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
        <span class="token property">line-height</span><span class="token punctuation">:</span> 78px<span class="token punctuation">;</span>
        <span class="token property">font-size</span><span class="token punctuation">:</span> 40<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    </span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>style</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">&gt;</span></span>
    <span class="token comment">&lt;!-- 画板主体 --&gt;</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>container<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>canvas</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>myCanvas<span class="token punctuation">&quot;</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>canvas<span class="token punctuation">&quot;</span></span> <span class="token attr-name">width</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>1024<span class="token punctuation">&quot;</span></span> <span class="token attr-name">height</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>600<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>

    <span class="token comment">&lt;!-- 工具栏 --&gt;</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>tool-bar<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>color black<span class="token punctuation">&quot;</span></span> <span class="token attr-name">data-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>black<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>color red<span class="token punctuation">&quot;</span></span> <span class="token attr-name">data-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>red<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>color green<span class="token punctuation">&quot;</span></span> <span class="token attr-name">data-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>green<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>color blue<span class="token punctuation">&quot;</span></span> <span class="token attr-name">data-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>blue<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>line line-4<span class="token punctuation">&quot;</span></span> <span class="token attr-name">data-line</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>4<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>line line-8<span class="token punctuation">&quot;</span></span> <span class="token attr-name">data-line</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>8<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>line line-12<span class="token punctuation">&quot;</span></span> <span class="token attr-name">data-line</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>12<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>remove<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>擦除<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>

    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
      <span class="token punctuation">;</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">var</span> can <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;myCanvas&#39;</span><span class="token punctuation">)</span>
        <span class="token keyword">var</span> tools <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementsByClassName</span><span class="token punctuation">(</span><span class="token string">&#39;tool-bar&#39;</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>

        <span class="token keyword">var</span> ctx <span class="token operator">=</span> can<span class="token punctuation">.</span><span class="token function">getContext</span><span class="token punctuation">(</span><span class="token string">&#39;2d&#39;</span><span class="token punctuation">)</span>
        <span class="token keyword">var</span> cWidth <span class="token operator">=</span> can<span class="token punctuation">.</span>width
        <span class="token keyword">var</span> cHeight <span class="token operator">=</span> can<span class="token punctuation">.</span>height
        <span class="token keyword">var</span> color <span class="token operator">=</span> <span class="token string">&#39;block&#39;</span>
        <span class="token keyword">var</span> lineWidth <span class="token operator">=</span> <span class="token number">4</span>
        <span class="token keyword">var</span> x <span class="token operator">=</span> <span class="token number">0</span>
        <span class="token keyword">var</span> y <span class="token operator">=</span> <span class="token number">0</span>

        <span class="token keyword">var</span> <span class="token function-variable function">init</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">bindEvent</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>

        <span class="token doc-comment comment">/** 绑定事件 */</span>
        <span class="token keyword">function</span> <span class="token function">bindEvent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token comment">// 画布事件</span>
          can<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span>
            <span class="token string">&#39;mousedown&#39;</span><span class="token punctuation">,</span>
            <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
              <span class="token function">mouseDown</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span>

              document<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;mousemove&#39;</span><span class="token punctuation">,</span> mouseMove<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>
              document<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;mouseup&#39;</span><span class="token punctuation">,</span> mouseUp<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token boolean">false</span>
          <span class="token punctuation">)</span>

          <span class="token comment">// 工具栏事件</span>
          tools<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;click&#39;</span><span class="token punctuation">,</span> clickTool<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>

        <span class="token doc-comment comment">/** 鼠标点击 */</span>
        <span class="token keyword">function</span> <span class="token function">mouseDown</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">setCanXY</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span>

          ctx<span class="token punctuation">.</span><span class="token function">beginPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 开始新的绘制,避免干扰之前已有的绘图</span>
          ctx<span class="token punctuation">.</span>strokeStyle <span class="token operator">=</span> color
          ctx<span class="token punctuation">.</span>lineWidth <span class="token operator">=</span> lineWidth
          ctx<span class="token punctuation">.</span>lineCap <span class="token operator">=</span> <span class="token string">&#39;round&#39;</span>
          ctx<span class="token punctuation">.</span>lineJoin <span class="token operator">=</span> <span class="token string">&#39;round&#39;</span>
          ctx<span class="token punctuation">.</span><span class="token function">moveTo</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span> y<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>

        <span class="token doc-comment comment">/** 移动鼠标 */</span>
        <span class="token keyword">function</span> <span class="token function">mouseMove</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">setCanXY</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span>

          ctx<span class="token punctuation">.</span><span class="token function">lineTo</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span> y<span class="token punctuation">)</span>
          ctx<span class="token punctuation">.</span><span class="token function">stroke</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>

        <span class="token doc-comment comment">/** 鼠标抬起 */</span>
        <span class="token keyword">function</span> <span class="token function">mouseUp</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          document<span class="token punctuation">.</span><span class="token function">removeEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;mousemove&#39;</span><span class="token punctuation">,</span> mouseMove<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>
          document<span class="token punctuation">.</span><span class="token function">removeEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;mouseup&#39;</span><span class="token punctuation">,</span> mouseUp<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>

        <span class="token doc-comment comment">/** 设置落笔位置 */</span>
        <span class="token keyword">function</span> <span class="token function">setCanXY</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">var</span> e <span class="token operator">=</span> e <span class="token operator">||</span> window<span class="token punctuation">.</span>event

          <span class="token keyword">var</span> xPos <span class="token operator">=</span> e<span class="token punctuation">.</span>clientX <span class="token operator">-</span> can<span class="token punctuation">.</span>offsetLeft
          <span class="token keyword">var</span> yPos <span class="token operator">=</span> e<span class="token punctuation">.</span>clientY <span class="token operator">-</span> can<span class="token punctuation">.</span>offsetTop
          <span class="token comment">// 边界限制</span>
          x <span class="token operator">=</span> xPos <span class="token operator">&lt;</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token number">0</span> <span class="token operator">:</span> xPos <span class="token operator">&gt;</span> cWidth <span class="token operator">?</span> cWidth <span class="token operator">:</span> xPos
          y <span class="token operator">=</span> yPos <span class="token operator">&lt;</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token number">0</span> <span class="token operator">:</span> yPos <span class="token operator">&gt;</span> cHeight <span class="token operator">?</span> cHeight <span class="token operator">:</span> yPos
        <span class="token punctuation">}</span>

        <span class="token doc-comment comment">/** 点击工具栏 */</span>
        <span class="token keyword">function</span> <span class="token function">clickTool</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">var</span> e <span class="token operator">=</span> e <span class="token operator">||</span> window<span class="token punctuation">.</span>event
          <span class="token keyword">var</span> tar <span class="token operator">=</span> e<span class="token punctuation">.</span>target <span class="token operator">||</span> e<span class="token punctuation">.</span>srcElement

          <span class="token comment">// 检查是否点击了颜色工具</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>tar<span class="token punctuation">.</span>classList<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span><span class="token string">&#39;color&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            color <span class="token operator">=</span> tar<span class="token punctuation">.</span><span class="token function">getAttribute</span><span class="token punctuation">(</span><span class="token string">&#39;data-color&#39;</span><span class="token punctuation">)</span>
          <span class="token punctuation">}</span>

          <span class="token comment">// 检查是否点击了线宽工具</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>tar<span class="token punctuation">.</span>classList<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span><span class="token string">&#39;line&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            lineWidth <span class="token operator">=</span> tar<span class="token punctuation">.</span><span class="token function">getAttribute</span><span class="token punctuation">(</span><span class="token string">&#39;data-line&#39;</span><span class="token punctuation">)</span>
          <span class="token punctuation">}</span>

          <span class="token comment">// 检查是否点击了擦除工具</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>tar<span class="token punctuation">.</span>classList<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span><span class="token string">&#39;remove&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            ctx<span class="token punctuation">.</span><span class="token function">clearRect</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> cWidth<span class="token punctuation">,</span> cHeight<span class="token punctuation">)</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>

        <span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    </span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,22),i=[l];function u(k,r){return o(),c("div",null,i)}const v=n(p,[["render",u],["__file","JS24.html.vue"]]);export{v as default};
