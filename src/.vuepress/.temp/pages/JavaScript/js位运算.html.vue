<template><div><h1 id="javascript中的位运算" tabindex="-1"><a class="header-anchor" href="#javascript中的位运算" aria-hidden="true">#</a> JavaScript中的位运算</h1>
<pre><code>在 **JavaScript** 中, **移位运算**就是对二进制进行有规律低移位。在本篇中, 将要简要总结 **js位运算** 的常用方法及技巧。在 **算法中的整除和整乘** 常以 **位运算** 代替 **`Math`** 方法，速度确实提升很多。常用的位移运算有三种: 
</code></pre>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token operator">&lt;&lt;</span>     <span class="token comment">//左移</span>
<span class="token operator">>></span>     <span class="token comment">//带符号右移</span>
<span class="token operator">>>></span>    <span class="token comment">//无符号右移</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="左移" tabindex="-1"><a class="header-anchor" href="#左移" aria-hidden="true">#</a> 左移 &lt;&lt;</h2>
<p>​	<strong>左移操作符 (<code v-pre>&lt;&lt;</code>)</strong> 将第一个操作数向左移动指定位数，左边超出的位数将会被清除，右边将会补零。</p>
<ul>
<li>
<p><strong>正、负数相同， 且不区分奇偶:</strong> 左移 <strong>n</strong> 位, 即结果乘以 <strong>2的n次方</strong> ;</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token doc-comment comment">/** 正数 */</span>
<span class="token number">2</span> <span class="token operator">&lt;&lt;</span> <span class="token number">1</span> <span class="token comment">// 结果为 4</span>
<span class="token number">3</span> <span class="token operator">&lt;&lt;</span> <span class="token number">1</span> <span class="token comment">// 结果为 6</span>
<span class="token doc-comment comment">/** 负数 */</span>
<span class="token operator">-</span><span class="token number">2</span> <span class="token operator">&lt;&lt;</span> <span class="token number">1</span>  <span class="token comment">// 结果为 -4</span>
<span class="token operator">-</span><span class="token number">3</span> <span class="token operator">&lt;&lt;</span> <span class="token number">1</span> <span class="token comment">// 结果为 -6</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h2 id="带符号右移" tabindex="-1"><a class="header-anchor" href="#带符号右移" aria-hidden="true">#</a> 带符号右移 &gt;&gt;</h2>
<p>​	<strong>右移操作符 (<code v-pre>&gt;&gt;</code>)</strong> 是将一个操作数按指定移动的位数向右移动，右边移出位被丢弃，左边移出的空位补符号位（最左边那位）。</p>
<ul>
<li>
<p><strong>正、负数相同:</strong> 右移 <strong>n</strong> 位, 相当于<strong>整除 n 且 向下取整</strong> , 等同于 <code v-pre>Math.floor( Num/(2^n) )</code> ;</p>
<p>【<strong>Tips</strong>】若想要得到 <strong>整除向上取整</strong> 结果, 可以 预先 <strong>给<code v-pre>Num+1</code></strong> ： <code v-pre>( (Num+1) &gt;&gt; n )</code>  等同于 <code v-pre>Math.floor( Num/(2^n) )</code> ;</p>
</li>
</ul>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 正数</span>
<span class="token number">3</span> <span class="token operator">>></span> <span class="token number">1</span> <span class="token comment">// 1</span>
<span class="token number">4</span> <span class="token operator">>></span> <span class="token number">1</span> <span class="token comment">// 2</span>
<span class="token number">5</span> <span class="token operator">>></span> <span class="token number">1</span> <span class="token comment">// 2</span>
<span class="token comment">// 负数</span>
<span class="token operator">-</span><span class="token number">3</span> <span class="token operator">>></span> <span class="token number">1</span> <span class="token comment">// -2</span>
<span class="token operator">-</span><span class="token number">4</span> <span class="token operator">>></span> <span class="token number">1</span> <span class="token comment">// -2</span>
<span class="token operator">-</span><span class="token number">5</span> <span class="token operator">>></span> <span class="token number">1</span> <span class="token comment">// -3</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>【<strong>Tips</strong>】需要注意的是, 负数与正数不同,  <strong>向上/向下取整</strong> 后结果的大小差异。</p>
<h2 id="无符号右移运算符" tabindex="-1"><a class="header-anchor" href="#无符号右移运算符" aria-hidden="true">#</a> 无符号右移运算符（&gt;&gt;&gt;）</h2>
<p>​	<strong>无符号右移运算符（&gt;&gt;&gt;）</strong>（零填充右移）将第一个操作数向右移动指定（二进制）位数。</p>
<ul>
<li><strong>正数:</strong> 与 <strong>带符号右移运算符(&gt;&gt;)</strong> 无差异。</li>
</ul>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token number">3</span> <span class="token operator">>>></span> <span class="token number">1</span> <span class="token comment">// 1</span>
<span class="token number">4</span> <span class="token operator">>>></span> <span class="token number">1</span> <span class="token comment">// 2</span>
<span class="token number">5</span> <span class="token operator">>>></span> <span class="token number">1</span> <span class="token comment">// 2</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>负数:</strong> 与 <strong>带符号右移运算符(&gt;&gt;)</strong> 差异较大, 直接超出数据大小了。<strong>最好不要用 !!!</strong></p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token operator">-</span><span class="token number">3</span> <span class="token operator">>>></span> <span class="token number">1</span> <span class="token comment">// 2147483646</span>
<span class="token operator">-</span><span class="token number">4</span> <span class="token operator">>>></span> <span class="token number">1</span> <span class="token comment">// 2147483646</span>
<span class="token operator">-</span><span class="token number">5</span> <span class="token operator">>>></span> <span class="token number">1</span> <span class="token comment">// 2147483645</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Left_shift" target="_blank" rel="noopener noreferrer">左移 (&lt;&lt;) - JavaScript | MDN (mozilla.org)<ExternalLinkIcon/></a></li>
<li><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Right_shift" target="_blank" rel="noopener noreferrer">右移 (&gt;&gt;) - JavaScript | MDN (mozilla.org)<ExternalLinkIcon/></a></li>
<li><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Unsigned_right_shift" target="_blank" rel="noopener noreferrer">无符号右移运算符（&gt;&gt;&gt;） - JavaScript | MDN (mozilla.org)<ExternalLinkIcon/></a></li>
</ul>
</div></template>


