import{_ as n,X as s,Y as a,$ as t}from"./framework-97fa2d96.js";const p={},e=t,o=s,c=a,l=e(`<p>该文为上篇<a href="./hooks01">《手写一个具备拖拉拽多功能的弹窗》</a>的延续。</p><p>首先需要区分 <code>e.clientX</code> 和 <code>e.offsetX</code> 的区别:</p><ul><li><code>e.clientX</code> 是相对于整个文档左上角的坐标。</li><li><code>e.offsetX</code> 是相对于触发事件的元素左上角的坐标。</li></ul><p>可以有如下代码:</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>en<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>UTF-8<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>viewport<span class="token punctuation">&quot;</span></span> <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>width=device-width, initial-scale=1.0<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">&gt;</span></span>Canvas 绘制及拖拽<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>style</span><span class="token punctuation">&gt;</span></span><span class="token style"><span class="token language-css">
      <span class="token selector">canvas</span> <span class="token punctuation">{</span>
        <span class="token property">border</span><span class="token punctuation">:</span> 1px solid black<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    </span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>style</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">&gt;</span></span>
    <span class="token comment">&lt;!-- 颜色选择器 --&gt;</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>color<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
    <span class="token comment">&lt;!-- 画布元素 --&gt;</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>canvas</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>canvas</span><span class="token punctuation">&gt;</span></span>

    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
      <span class="token comment">// 获取颜色选择器和画布元素</span>
      <span class="token keyword">const</span> colorPicker <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">querySelector</span><span class="token punctuation">(</span><span class="token string">&#39;input&#39;</span><span class="token punctuation">)</span>
      <span class="token keyword">const</span> cvs <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">querySelector</span><span class="token punctuation">(</span><span class="token string">&#39;canvas&#39;</span><span class="token punctuation">)</span>
      <span class="token keyword">const</span> ctx <span class="token operator">=</span> cvs<span class="token punctuation">.</span><span class="token function">getContext</span><span class="token punctuation">(</span><span class="token string">&#39;2d&#39;</span><span class="token punctuation">)</span>
      <span class="token keyword">const</span> devicePixelRatio <span class="token operator">=</span> window<span class="token punctuation">.</span>devicePixelRatio <span class="token operator">||</span> <span class="token number">1</span>

      <span class="token comment">// 初始化画布</span>
      <span class="token keyword">function</span> <span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> w <span class="token operator">=</span> <span class="token number">500</span><span class="token punctuation">,</span>
          h <span class="token operator">=</span> <span class="token number">300</span>
        cvs<span class="token punctuation">.</span>width <span class="token operator">=</span> w <span class="token operator">*</span> devicePixelRatio
        cvs<span class="token punctuation">.</span>height <span class="token operator">=</span> h <span class="token operator">*</span> devicePixelRatio
        cvs<span class="token punctuation">.</span>style<span class="token punctuation">.</span>width <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>w<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">px</span><span class="token template-punctuation string">\`</span></span>
        cvs<span class="token punctuation">.</span>style<span class="token punctuation">.</span>height <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>h<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">px</span><span class="token template-punctuation string">\`</span></span>
      <span class="token punctuation">}</span>

      <span class="token comment">// 调用初始化函数</span>
      <span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

      <span class="token comment">// 存储绘制矩形的数组</span>
      <span class="token keyword">const</span> shapes <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

      <span class="token comment">// 矩形类</span>
      <span class="token keyword">class</span> <span class="token class-name">Rectangle</span> <span class="token punctuation">{</span>
        <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">color<span class="token punctuation">,</span> startX<span class="token punctuation">,</span> startY</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span>color <span class="token operator">=</span> color
          <span class="token keyword">this</span><span class="token punctuation">.</span>startX <span class="token operator">=</span> startX
          <span class="token keyword">this</span><span class="token punctuation">.</span>startY <span class="token operator">=</span> startY
          <span class="token keyword">this</span><span class="token punctuation">.</span>endX <span class="token operator">=</span> startX
          <span class="token keyword">this</span><span class="token punctuation">.</span>endY <span class="token operator">=</span> startY
        <span class="token punctuation">}</span>

        <span class="token comment">// 获取矩形的最小 X 坐标</span>
        <span class="token keyword">get</span> <span class="token function">minX</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">return</span> Math<span class="token punctuation">.</span><span class="token function">min</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>startX<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>endX<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// 获取矩形的最大 X 坐标</span>
        <span class="token keyword">get</span> <span class="token function">maxX</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">return</span> Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>startX<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>endX<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// 获取矩形的最小 Y 坐标</span>
        <span class="token keyword">get</span> <span class="token function">minY</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">return</span> Math<span class="token punctuation">.</span><span class="token function">min</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>startY<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>endY<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// 获取矩形的最大 Y 坐标</span>
        <span class="token keyword">get</span> <span class="token function">maxY</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">return</span> Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>startY<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>endY<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// 绘制矩形</span>
        <span class="token function">draw</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          ctx<span class="token punctuation">.</span><span class="token function">beginPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
          ctx<span class="token punctuation">.</span><span class="token function">moveTo</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>minX <span class="token operator">*</span> devicePixelRatio<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>minY <span class="token operator">*</span> devicePixelRatio<span class="token punctuation">)</span>
          ctx<span class="token punctuation">.</span><span class="token function">lineTo</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>maxX <span class="token operator">*</span> devicePixelRatio<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>minY <span class="token operator">*</span> devicePixelRatio<span class="token punctuation">)</span>
          ctx<span class="token punctuation">.</span><span class="token function">lineTo</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>maxX <span class="token operator">*</span> devicePixelRatio<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>maxY <span class="token operator">*</span> devicePixelRatio<span class="token punctuation">)</span>
          ctx<span class="token punctuation">.</span><span class="token function">lineTo</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>minX <span class="token operator">*</span> devicePixelRatio<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>maxY <span class="token operator">*</span> devicePixelRatio<span class="token punctuation">)</span>
          ctx<span class="token punctuation">.</span><span class="token function">lineTo</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>minX <span class="token operator">*</span> devicePixelRatio<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>minY <span class="token operator">*</span> devicePixelRatio<span class="token punctuation">)</span>
          ctx<span class="token punctuation">.</span>fillStyle <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>color
          ctx<span class="token punctuation">.</span>lineCap <span class="token operator">=</span> <span class="token string">&#39;square&#39;</span> <span class="token comment">// 消除锯齿状</span>
          ctx<span class="token punctuation">.</span><span class="token function">fill</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
          <span class="token comment">// 绘制白边</span>
          ctx<span class="token punctuation">.</span>strokeStyle <span class="token operator">=</span> <span class="token string">&#39;blue&#39;</span>
          ctx<span class="token punctuation">.</span>lineWidth <span class="token operator">=</span> <span class="token number">3</span> <span class="token operator">*</span> devicePixelRatio
          ctx<span class="token punctuation">.</span><span class="token function">stroke</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token comment">// 监听 canvas 点击</span>
      cvs<span class="token punctuation">.</span><span class="token function-variable function">onmousedown</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> bounding <span class="token operator">=</span> cvs<span class="token punctuation">.</span><span class="token function">getBoundingClientRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 获取了 cvs 元素相对于视口（viewport）的位置信息</span>
        <span class="token keyword">const</span> rect <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Rectangle</span><span class="token punctuation">(</span>
          colorPicker<span class="token punctuation">.</span>value<span class="token punctuation">,</span>
          e<span class="token punctuation">.</span>clientX <span class="token operator">-</span> bounding<span class="token punctuation">.</span>left<span class="token punctuation">,</span>
          e<span class="token punctuation">.</span>clientY <span class="token operator">-</span> bounding<span class="token punctuation">.</span>top
        <span class="token punctuation">)</span>

        <span class="token keyword">const</span> shape <span class="token operator">=</span> <span class="token function">getShape</span><span class="token punctuation">(</span>
          e<span class="token punctuation">.</span>clientX <span class="token operator">-</span> bounding<span class="token punctuation">.</span>left<span class="token punctuation">,</span>
          e<span class="token punctuation">.</span>clientY <span class="token operator">-</span> bounding<span class="token punctuation">.</span>top
        <span class="token punctuation">)</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>shape<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;拖动&#39;</span><span class="token punctuation">)</span>
          <span class="token keyword">const</span> <span class="token punctuation">{</span> startX<span class="token punctuation">,</span> startY<span class="token punctuation">,</span> endX<span class="token punctuation">,</span> endY <span class="token punctuation">}</span> <span class="token operator">=</span> shape
          <span class="token keyword">const</span> mouseX <span class="token operator">=</span> e<span class="token punctuation">.</span>clientX <span class="token operator">-</span> bounding<span class="token punctuation">.</span>left
          <span class="token keyword">const</span> mouseY <span class="token operator">=</span> e<span class="token punctuation">.</span>clientY <span class="token operator">-</span> bounding<span class="token punctuation">.</span>top
          window<span class="token punctuation">.</span><span class="token function-variable function">onmousemove</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            <span class="token keyword">const</span> disX <span class="token operator">=</span> e<span class="token punctuation">.</span>clientX <span class="token operator">-</span> bounding<span class="token punctuation">.</span>left <span class="token operator">-</span> mouseX
            <span class="token keyword">const</span> disY <span class="token operator">=</span> e<span class="token punctuation">.</span>clientY <span class="token operator">-</span> bounding<span class="token punctuation">.</span>top <span class="token operator">-</span> mouseY
            shape<span class="token punctuation">.</span>startX <span class="token operator">=</span> startX <span class="token operator">+</span> disX
            shape<span class="token punctuation">.</span>startY <span class="token operator">=</span> startY <span class="token operator">+</span> disY
            shape<span class="token punctuation">.</span>endX <span class="token operator">=</span> endX <span class="token operator">+</span> disX
            shape<span class="token punctuation">.</span>endY <span class="token operator">=</span> endY <span class="token operator">+</span> disY
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          shapes<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>rect<span class="token punctuation">)</span>

          <span class="token comment">// 监听鼠标移动</span>
          window<span class="token punctuation">.</span><span class="token function-variable function">onmousemove</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            rect<span class="token punctuation">.</span>endX <span class="token operator">=</span> e<span class="token punctuation">.</span>clientX <span class="token operator">-</span> bounding<span class="token punctuation">.</span>left
            rect<span class="token punctuation">.</span>endY <span class="token operator">=</span> e<span class="token punctuation">.</span>clientY <span class="token operator">-</span> bounding<span class="token punctuation">.</span>top
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// 监听鼠标松开</span>
        window<span class="token punctuation">.</span><span class="token function-variable function">onmouseup</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
          window<span class="token punctuation">.</span>onmousemove <span class="token operator">=</span> <span class="token keyword">null</span>
          window<span class="token punctuation">.</span>onmouseup <span class="token operator">=</span> <span class="token keyword">null</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token comment">// 判断是否是绘制块</span>
      <span class="token keyword">function</span> <span class="token function">getShape</span><span class="token punctuation">(</span><span class="token parameter">x<span class="token punctuation">,</span> y</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 从后向前, 后面绘制的, 可能会覆盖前面的</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> shapes<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&gt;=</span> <span class="token number">0</span><span class="token punctuation">;</span> i<span class="token operator">--</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">const</span> shape <span class="token operator">=</span> shapes<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>
            x <span class="token operator">&gt;=</span> shape<span class="token punctuation">.</span>minX <span class="token operator">&amp;&amp;</span>
            x <span class="token operator">&lt;=</span> shape<span class="token punctuation">.</span>maxX <span class="token operator">&amp;&amp;</span>
            y <span class="token operator">&gt;=</span> shape<span class="token punctuation">.</span>minY <span class="token operator">&amp;&amp;</span>
            y <span class="token operator">&lt;=</span> shape<span class="token punctuation">.</span>maxY
          <span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> shape
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token boolean">false</span>
      <span class="token punctuation">}</span>

      <span class="token comment">// 绘制函数，使用 requestAnimationFrame 实现动画效果</span>
      <span class="token keyword">function</span> <span class="token function">draw</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">requestAnimationFrame</span><span class="token punctuation">(</span>draw<span class="token punctuation">)</span>
        ctx<span class="token punctuation">.</span><span class="token function">clearRect</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> cvs<span class="token punctuation">.</span>width<span class="token punctuation">,</span> cvs<span class="token punctuation">.</span>height<span class="token punctuation">)</span>

        <span class="token comment">// 遍历绘制所有矩形</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> shape <span class="token keyword">of</span> shapes<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          shape<span class="token punctuation">.</span><span class="token function">draw</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token comment">// 调用绘制函数</span>
      <span class="token function">draw</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    </span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),i=[l];function u(k,r){return o(),c("div",null,i)}const v=n(p,[["render",u],["__file","hooks02.html.vue"]]);export{v as default};
