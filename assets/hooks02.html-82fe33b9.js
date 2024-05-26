import{_ as n,X as s,Y as a,$ as t}from"./framework-97fa2d96.js";const p={},e=t,o=s,c=a,l=e(`<p>该文为上篇<a href="./hooks01">《手写一个具备拖拉拽多功能的弹窗》</a>的延续。</p><p>最终效果图如下:</p><figure><img src="https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/Kapture 2024-05-27 at 00.02.01.gif" alt="Canvas 绘制及拖动" tabindex="0" loading="lazy"><figcaption>Canvas 绘制及拖动</figcaption></figure><p>首先需要区分 <code>e.clientX</code> 和 <code>e.offsetX</code> 的区别:</p><ul><li><code>e.clientX</code> 是相对于整个文档左上角的坐标。</li><li><code>e.offsetX</code> 是相对于触发事件的元素左上角的坐标。</li></ul><p>设计思路:</p><ol><li>绘制获取 Canvas 元素。</li><li>创建存储绘制矩形的数组, 后续依据这个数组来遍历绘制矩阵;</li><li>创建绘制矩阵的类, 包含绘制矩阵的方法, 以及矩形的四角信息;</li><li>监听 Canvas 的鼠标按下事件 onmousedown, 分俩种情况, 一种是点击了已绘制矩形, 另一种是点击了空白处开始绘制矩形;</li><li>创建判断是否是绘制块, 创建依据遍历绘制数组, 绘制 Canvas。</li></ol><p>关键代码:</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 创建 Canvas</span>
<span class="token keyword">const</span> cvs <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">querySelector</span><span class="token punctuation">(</span><span class="token string">&#39;canvas&#39;</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> ctx <span class="token operator">=</span> cvs<span class="token punctuation">.</span><span class="token function">getContext</span><span class="token punctuation">(</span><span class="token string">&#39;2d&#39;</span><span class="token punctuation">)</span>

<span class="token comment">// 绘制矩阵</span>
ctx<span class="token punctuation">.</span><span class="token function">beginPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 开始绘制新的路径</span>
ctx<span class="token punctuation">.</span><span class="token function">moveTo</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span> <span class="token comment">// 移动到指定点</span>
ctx<span class="token punctuation">.</span><span class="token function">lineTo</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span> <span class="token comment">// 绘制一条线</span>
<span class="token comment">// ...</span>
ctx<span class="token punctuation">.</span><span class="token function">stroke</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 绘制路径</span>
ctx<span class="token punctuation">.</span>fillStyle <span class="token operator">=</span> black
ctx<span class="token punctuation">.</span>lineCap <span class="token operator">=</span> <span class="token string">&#39;square&#39;</span> <span class="token comment">// 消除锯齿状</span>
ctx<span class="token punctuation">.</span><span class="token function">fill</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 填充路径</span>

<span class="token comment">// 监听点击</span>

<span class="token comment">// 1. 获取 Canvas 元素位置信息</span>
<span class="token keyword">const</span> bounding <span class="token operator">=</span> cvs<span class="token punctuation">.</span><span class="token function">getBoundingClientRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 获取了 cvs 元素相对于视口（viewport）的位置信息</span>
<span class="token comment">// 2. 遍历 Array 数组, 判断是否点击了已绘制的矩形</span>
<span class="token comment">// 3. 点击未绘制的矩形, 则开始绘制矩形, 依据创建的 矩形类创建新的实例, 并将其推入数组; 同时监听修改该数组的四角信息;</span>
<span class="token comment">// 4. 点击已绘制的矩形, 则修改该矩形的四角信息;</span>

<span class="token comment">// 绘制函数，使用 requestAnimationFrame 实现动画效果</span>
<span class="token function">requestAnimationFrame</span><span class="token punctuation">(</span>draw<span class="token punctuation">)</span>
<span class="token comment">// 清理原有的视图</span>
ctx<span class="token punctuation">.</span><span class="token function">clearRect</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> cvs<span class="token punctuation">.</span>width<span class="token punctuation">,</span> cvs<span class="token punctuation">.</span>height<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以有如下代码:</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">&gt;</span></span>
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
          ctx<span class="token punctuation">.</span><span class="token function">beginPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 开始绘制新的路径</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述是在绘制连线的基础上进行的，实际上还可以简化代码：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>en<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>UTF-8<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>viewport<span class="token punctuation">&quot;</span></span> <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>width=device-width, initial-scale=1.0<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">&gt;</span></span>Canvas 画矩形<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">&gt;</span></span>
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

      <span class="token selector">.tool-bar div,
      input</span> <span class="token punctuation">{</span>
        <span class="token property">width</span><span class="token punctuation">:</span> 78px<span class="token punctuation">;</span>
        <span class="token property">height</span><span class="token punctuation">:</span> 78px<span class="token punctuation">;</span>
        <span class="token property">border</span><span class="token punctuation">:</span> 1px solid #b3b2b2<span class="token punctuation">;</span>
        <span class="token property">margin</span><span class="token punctuation">:</span> 0 2px<span class="token punctuation">;</span>
        <span class="token property">cursor</span><span class="token punctuation">:</span> pointer<span class="token punctuation">;</span>
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
      <span class="token comment">&lt;!-- 颜色选择器 --&gt;</span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>color<span class="token punctuation">&quot;</span></span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>color<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>remove<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>擦除<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>

    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
      <span class="token keyword">var</span> can <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;myCanvas&#39;</span><span class="token punctuation">)</span>
      <span class="token keyword">var</span> tools <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementsByClassName</span><span class="token punctuation">(</span><span class="token string">&#39;tool-bar&#39;</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>
      <span class="token keyword">var</span> colorPicker <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementsByClassName</span><span class="token punctuation">(</span><span class="token string">&#39;color&#39;</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>
      <span class="token keyword">var</span> ctx <span class="token operator">=</span> can<span class="token punctuation">.</span><span class="token function">getContext</span><span class="token punctuation">(</span><span class="token string">&#39;2d&#39;</span><span class="token punctuation">)</span>
      <span class="token keyword">var</span> cWidth <span class="token operator">=</span> can<span class="token punctuation">.</span>width
      <span class="token keyword">var</span> cHeight <span class="token operator">=</span> can<span class="token punctuation">.</span>height
      <span class="token keyword">var</span> lineWidth <span class="token operator">=</span> <span class="token number">4</span>
      <span class="token keyword">var</span> x <span class="token operator">=</span> <span class="token number">0</span>
      <span class="token keyword">var</span> y <span class="token operator">=</span> <span class="token number">0</span>

      <span class="token keyword">var</span> curRect <span class="token operator">=</span> <span class="token keyword">null</span>
      <span class="token keyword">var</span> isMoveRect <span class="token operator">=</span> <span class="token boolean">false</span>
      <span class="token keyword">var</span> moveRect <span class="token operator">=</span> <span class="token keyword">null</span>

      <span class="token keyword">var</span> <span class="token function-variable function">init</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">bindEvent</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token function">drawAllRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">var</span> rectLists <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
      <span class="token keyword">class</span> <span class="token class-name">Rectangle</span> <span class="token punctuation">{</span>
        <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">startX<span class="token punctuation">,</span> startY<span class="token punctuation">,</span> color</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span>startX <span class="token operator">=</span> startX
          <span class="token keyword">this</span><span class="token punctuation">.</span>startY <span class="token operator">=</span> startY
          <span class="token keyword">this</span><span class="token punctuation">.</span>endX <span class="token operator">=</span> startX
          <span class="token keyword">this</span><span class="token punctuation">.</span>endY <span class="token operator">=</span> startY
          <span class="token keyword">this</span><span class="token punctuation">.</span>color <span class="token operator">=</span> color
        <span class="token punctuation">}</span>

        <span class="token comment">// 绘制方法</span>
        <span class="token function">draw</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          ctx<span class="token punctuation">.</span><span class="token function">beginPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
          ctx<span class="token punctuation">.</span>fillStyle <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>color
          ctx<span class="token punctuation">.</span>strokeStyle <span class="token operator">=</span> <span class="token string">&#39;black&#39;</span>
          ctx<span class="token punctuation">.</span>lineWidth <span class="token operator">=</span> lineWidth <span class="token operator">||</span> <span class="token number">1</span>
          ctx<span class="token punctuation">.</span><span class="token function">fillRect</span><span class="token punctuation">(</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>startX<span class="token punctuation">,</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>startY<span class="token punctuation">,</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>endX <span class="token operator">-</span> <span class="token keyword">this</span><span class="token punctuation">.</span>startX<span class="token punctuation">,</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>endY <span class="token operator">-</span> <span class="token keyword">this</span><span class="token punctuation">.</span>startY
          <span class="token punctuation">)</span>
          ctx<span class="token punctuation">.</span><span class="token function">closePath</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
          ctx<span class="token punctuation">.</span><span class="token function">stroke</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
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
        curRect <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Rectangle</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span> y<span class="token punctuation">,</span> colorPicker<span class="token punctuation">.</span>value<span class="token punctuation">)</span>

        <span class="token keyword">var</span> rect <span class="token operator">=</span> <span class="token function">getRect</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span> y<span class="token punctuation">)</span>
        <span class="token comment">// 判断是否点击到了已有的矩形</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>rect<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          isMoveRect <span class="token operator">=</span> <span class="token boolean">true</span>
          moveRect <span class="token operator">=</span> rect
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          rectLists<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>curRect<span class="token punctuation">)</span> <span class="token comment">// 补充当前矩形</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token doc-comment comment">/** 移动鼠标 */</span>
      <span class="token keyword">function</span> <span class="token function">mouseMove</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 保存当前鼠标位置</span>
        <span class="token keyword">var</span> startX <span class="token operator">=</span> x
        <span class="token keyword">var</span> startY <span class="token operator">=</span> y
        <span class="token comment">// 更新鼠标位置</span>
        <span class="token function">setCanXY</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span>

        <span class="token comment">// 是否移动矩形</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>isMoveRect<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token comment">// 移动点击矩形</span>
          disX <span class="token operator">=</span> startX <span class="token operator">-</span> x
          disY <span class="token operator">=</span> startY <span class="token operator">-</span> y
          moveRect<span class="token punctuation">.</span>startX <span class="token operator">-=</span> disX
          moveRect<span class="token punctuation">.</span>startY <span class="token operator">-=</span> disY
          moveRect<span class="token punctuation">.</span>endX <span class="token operator">-=</span> disX
          moveRect<span class="token punctuation">.</span>endY <span class="token operator">-=</span> disY
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          <span class="token comment">// 开始绘制矩形</span>
          curRect<span class="token punctuation">.</span>endX <span class="token operator">=</span> x
          curRect<span class="token punctuation">.</span>endY <span class="token operator">=</span> y
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token doc-comment comment">/** 鼠标抬起 */</span>
      <span class="token keyword">function</span> <span class="token function">mouseUp</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        isMoveRect <span class="token operator">=</span> <span class="token boolean">false</span>
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

        <span class="token comment">// 检查是否点击了擦除工具</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>tar<span class="token punctuation">.</span>classList<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span><span class="token string">&#39;remove&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          rectLists<span class="token punctuation">.</span>length <span class="token operator">=</span> <span class="token number">0</span> <span class="token comment">// 清空绘制数组</span>
          <span class="token comment">// ctx.clearRect(0, 0, cWidth, cHeight);</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token doc-comment comment">/** 尝试获取矩形 */</span>
      <span class="token keyword">function</span> <span class="token function">getRect</span><span class="token punctuation">(</span><span class="token parameter">x<span class="token punctuation">,</span> y</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> inx <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> inx <span class="token operator">&lt;</span> rectLists<span class="token punctuation">.</span>length<span class="token punctuation">;</span> inx<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">var</span> rect <span class="token operator">=</span> rectLists<span class="token punctuation">[</span>inx<span class="token punctuation">]</span>
          <span class="token keyword">var</span> rectMinX <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">min</span><span class="token punctuation">(</span>rect<span class="token punctuation">.</span>startX<span class="token punctuation">,</span> rect<span class="token punctuation">.</span>endX<span class="token punctuation">)</span>
          <span class="token keyword">var</span> rectMaxX <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span>rect<span class="token punctuation">.</span>startX<span class="token punctuation">,</span> rect<span class="token punctuation">.</span>endX<span class="token punctuation">)</span>
          <span class="token keyword">var</span> rectMinY <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">min</span><span class="token punctuation">(</span>rect<span class="token punctuation">.</span>startY<span class="token punctuation">,</span> rect<span class="token punctuation">.</span>endY<span class="token punctuation">)</span>
          <span class="token keyword">var</span> rectMaxY <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span>rect<span class="token punctuation">.</span>startY<span class="token punctuation">,</span> rect<span class="token punctuation">.</span>endY<span class="token punctuation">)</span>

          <span class="token keyword">if</span> <span class="token punctuation">(</span>
            x <span class="token operator">&gt;=</span> rectMinX <span class="token operator">&amp;&amp;</span>
            x <span class="token operator">&lt;=</span> rectMaxX <span class="token operator">&amp;&amp;</span>
            y <span class="token operator">&gt;=</span> rectMinY <span class="token operator">&amp;&amp;</span>
            y <span class="token operator">&lt;=</span> rectMaxY
          <span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> rect
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token keyword">null</span>
      <span class="token punctuation">}</span>

      <span class="token doc-comment comment">/** 绘制所有矩形 */</span>
      <span class="token keyword">function</span> <span class="token function">drawAllRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">requestAnimationFrame</span><span class="token punctuation">(</span>drawAllRect<span class="token punctuation">)</span>
        ctx<span class="token punctuation">.</span><span class="token function">clearRect</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> cWidth<span class="token punctuation">,</span> cHeight<span class="token punctuation">)</span>
        <span class="token comment">// 在动画帧下, 依次绘制每个矩形</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> rectLists<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          rectLists<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">draw</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    </span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13),i=[l];function u(k,r){return o(),c("div",null,i)}const v=n(p,[["render",u],["__file","hooks02.html.vue"]]);export{v as default};
