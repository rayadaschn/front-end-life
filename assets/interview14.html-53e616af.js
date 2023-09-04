import{_ as n,X as s,Y as a,$ as e}from"./framework-97fa2d96.js";const t={},p=e,o=s,c=a,l=p(`<blockquote><p>总述算法的一些常见考题。</p></blockquote><h2 id="判断一个字符串是否括号匹配" tabindex="-1"><a class="header-anchor" href="#判断一个字符串是否括号匹配" aria-hidden="true">#</a> 判断一个字符串是否括号匹配</h2><ul><li>一个字符串 s 可能包含 <code>{}()[]</code> 三种括号;</li><li>判断 s 是否是括号匹配的;</li><li>如<code>(a{b}c)</code>匹配，而<code>{a(b</code>或<code>{a(b}c)</code>就不匹配。</li></ul><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">/**
 * @description 括号匹配
 * @param str str
 */</span>
<span class="token keyword">function</span> <span class="token function">matchBracket</span><span class="token punctuation">(</span>str<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">boolean</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> length <span class="token operator">=</span> str<span class="token punctuation">.</span>length
  <span class="token keyword">if</span> <span class="token punctuation">(</span>length <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token boolean">true</span>

  <span class="token keyword">const</span> stack <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

  <span class="token keyword">const</span> leftSymbols <span class="token operator">=</span> <span class="token string">&#39;{[(&#39;</span>
  <span class="token keyword">const</span> rightSymbols <span class="token operator">=</span> <span class="token string">&#39;}])&#39;</span>

  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> s <span class="token operator">=</span> str<span class="token punctuation">[</span>i<span class="token punctuation">]</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>leftSymbols<span class="token punctuation">.</span><span class="token function">includes</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 左括号, 压栈</span>
      stack<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>rightSymbols<span class="token punctuation">.</span><span class="token function">includes</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 左括号, 判断栈顶(是否出栈)</span>
      <span class="token keyword">const</span> top <span class="token operator">=</span> stack<span class="token punctuation">.</span><span class="token function">pop</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">isMatch</span><span class="token punctuation">(</span>top<span class="token punctuation">,</span> s<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> stack<span class="token punctuation">.</span>length <span class="token operator">===</span> <span class="token number">0</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">isMatch</span><span class="token punctuation">(</span>left<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> right<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">boolean</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>left <span class="token operator">===</span> <span class="token string">&#39;(&#39;</span> <span class="token operator">&amp;&amp;</span> right <span class="token operator">===</span> <span class="token string">&#39;)&#39;</span><span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token boolean">true</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>left <span class="token operator">===</span> <span class="token string">&#39;[&#39;</span> <span class="token operator">&amp;&amp;</span> right <span class="token operator">===</span> <span class="token string">&#39;]&#39;</span><span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token boolean">true</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>left <span class="token operator">===</span> <span class="token string">&#39;{&#39;</span> <span class="token operator">&amp;&amp;</span> right <span class="token operator">===</span> <span class="token string">&#39;}&#39;</span><span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token boolean">true</span>
  <span class="token keyword">return</span> <span class="token boolean">false</span>
<span class="token punctuation">}</span>

<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">matchBracket</span><span class="token punctuation">(</span><span class="token string">&#39;(a)&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="定义一个-js-函数-反转单向链表" tabindex="-1"><a class="header-anchor" href="#定义一个-js-函数-反转单向链表" aria-hidden="true">#</a> 定义一个 JS 函数，反转单向链表</h2><p>定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */</span>

<span class="token keyword">function</span> <span class="token function">reverseList</span><span class="token punctuation">(</span>head<span class="token operator">:</span> ListNode <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token operator">:</span> ListNode <span class="token operator">|</span> <span class="token keyword">null</span> <span class="token punctuation">{</span>
  <span class="token comment">// 节点少于 2 个</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>head <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> head<span class="token punctuation">.</span>next <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token keyword">return</span> head

  <span class="token keyword">let</span> currentList <span class="token operator">=</span> head<span class="token punctuation">,</span>
    preList <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    nextList <span class="token operator">=</span> <span class="token keyword">null</span>

  <span class="token keyword">while</span> <span class="token punctuation">(</span>currentList<span class="token punctuation">.</span>next <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    nextList <span class="token operator">=</span> currentList<span class="token punctuation">.</span>next
    currentList<span class="token punctuation">.</span>next <span class="token operator">=</span> preList
    preList <span class="token operator">=</span> currentList
    currentList <span class="token operator">=</span> nextList
  <span class="token punctuation">}</span>
  currentList<span class="token punctuation">.</span>next <span class="token operator">=</span> preList

  <span class="token keyword">return</span> currentList
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7),i=[l];function r(u,k){return o(),c("div",null,i)}const v=n(t,[["render",r],["__file","interview14.html.vue"]]);export{v as default};
