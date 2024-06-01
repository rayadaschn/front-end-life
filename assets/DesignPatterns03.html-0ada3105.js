import{_ as n,X as s,Y as a,$ as e}from"./framework-5dd7fabc.js";const p={},c=e,t=s,i=a,l=c(`<p>在前面总结了设计模式的常用方法，在该篇中总结设计模式在实践运用中的一些原则。</p><h2 id="单一职责原则" tabindex="-1"><a class="header-anchor" href="#单一职责原则" aria-hidden="true">#</a> 单一职责原则</h2><p>单一职责原则（Single Responsibility Principle，SRP）是面向对象设计原则之一，它指导在设计类或模块时，一个类或模块应该只有一个职责。</p><p>单一职责原则认为一个类或模块应该只有一个引起它变化的原因。换句话说，一个类或模块应该只有一个主要的责任或任务。如果一个类或模块承担了多个职责，那么当其中一个职责发生变化时，可能会影响到其他职责的实现。这样的设计通常会导致代码的耦合性增加，难以理解、扩展和维护。</p><p>通过将不同职责的代码分离到不同的类或模块中，可以使系统更加灵活、可扩展和可维护。每个类或模块都应该专注于完成一个独立的任务，这样可以降低代码之间的依赖性，提高代码的可读性和可维护性。</p><p>一个例子：假设我们有一个名为<code>UserService</code>的类，负责处理用户相关的操作，包括用户的创建和验证。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">UserService</span> <span class="token punctuation">{</span>
  <span class="token function">createUser</span><span class="token punctuation">(</span><span class="token parameter">username<span class="token punctuation">,</span> password</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 创建用户的逻辑</span>
  <span class="token punctuation">}</span>

  <span class="token function">validateUser</span><span class="token punctuation">(</span><span class="token parameter">username<span class="token punctuation">,</span> password</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 验证用户的逻辑</span>
  <span class="token punctuation">}</span>

  <span class="token function">sendEmailVerification</span><span class="token punctuation">(</span><span class="token parameter">username</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 发送电子邮件验证的逻辑</span>
  <span class="token punctuation">}</span>

  <span class="token function">generateUsername</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 生成用户名的逻辑</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 其他与用户相关的方法...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上述例子中，<code>UserService</code>类承担了多个职责，包括创建用户、验证用户、发送电子邮件验证和生成用户名。这违反了单一职责原则。</p><p>为了遵循单一职责原则，我们可以将不同的职责分离成独立的类。例如，我们可以创建一个<code>UserCreationService</code>类来处理用户的创建，一个<code>UserValidationService</code>类来处理用户的验证，以及一个<code>EmailService</code>类来处理发送电子邮件的功能。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">UserCreationService</span> <span class="token punctuation">{</span>
  <span class="token function">createUser</span><span class="token punctuation">(</span><span class="token parameter">username<span class="token punctuation">,</span> password</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 创建用户的逻辑</span>
  <span class="token punctuation">}</span>

  <span class="token function">generateUsername</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 生成用户名的逻辑</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 其他与用户创建相关的方法...</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">UserValidationService</span> <span class="token punctuation">{</span>
  <span class="token function">validateUser</span><span class="token punctuation">(</span><span class="token parameter">username<span class="token punctuation">,</span> password</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 验证用户的逻辑</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 其他与用户验证相关的方法...</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">EmailService</span> <span class="token punctuation">{</span>
  <span class="token function">sendEmailVerification</span><span class="token punctuation">(</span><span class="token parameter">username</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 发送电子邮件验证的逻辑</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 其他与电子邮件发送相关的方法...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过将不同的职责分离到不同的类中，我们可以提高代码的可维护性和可扩展性。每个类都专注于完成一个独立的任务，并且更容易理解和修改。</p><h2 id="最少知识原则" tabindex="-1"><a class="header-anchor" href="#最少知识原则" aria-hidden="true">#</a> 最少知识原则</h2><p>最少知识原则（Least Knowledge Principle），也被称为迪米特法则（Law of Demeter），是面向对象设计原则之一。它强调一个对象应该尽量减少与其他对象之间的交互，只与最直接的朋友通信，避免了对象之间的紧耦合关系。</p><p>最少知识原则的核心思想是一个对象应该只与以下几种对象发生交互：</p><ol><li>与该对象本身直接关联的对象。</li><li>该对象所创建或实例化的对象。</li><li>该对象的组件对象。</li></ol><p>换句话说，一个对象不应该直接访问其他对象的内部状态和方法，而应该通过委托和封装来实现间接访问。这样可以降低对象之间的依赖性，减少耦合，提高代码的可维护性和扩展性。</p><p>以下是一个使用 JavaScript 的例子，演示最少知识原则的应用：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Customer</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> address</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name
    <span class="token keyword">this</span><span class="token punctuation">.</span>address <span class="token operator">=</span> address
  <span class="token punctuation">}</span>

  <span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>name
  <span class="token punctuation">}</span>

  <span class="token comment">// 其他与顾客相关的方法...</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">Order</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">customer</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>customer <span class="token operator">=</span> customer
    <span class="token keyword">this</span><span class="token punctuation">.</span>items <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>

  <span class="token function">addItem</span><span class="token punctuation">(</span><span class="token parameter">item</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>items<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>item<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token function">getTotal</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 计算订单总金额的逻辑</span>
  <span class="token punctuation">}</span>

  <span class="token function">printInvoice</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> customerName <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>customer<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">const</span> total <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getTotal</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    <span class="token comment">// 打印发票的逻辑</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 其他与订单相关的方法...</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">Item</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> price</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name
    <span class="token keyword">this</span><span class="token punctuation">.</span>price <span class="token operator">=</span> price
  <span class="token punctuation">}</span>

  <span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>name
  <span class="token punctuation">}</span>

  <span class="token function">getPrice</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>price
  <span class="token punctuation">}</span>

  <span class="token comment">// 其他与商品相关的方法...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上述示例中，<code>Order</code>类代表一个订单，它包含了顾客信息和订单项。<code>Customer</code>类代表顾客，<code>Item</code>类代表商品。</p><p>根据最少知识原则，<code>Order</code>类只与以下几种对象发生直接交互：</p><ol><li><code>Customer</code>类：通过调用<code>this.customer.getName()</code>来获取顾客的名称。</li><li><code>Item</code>类：通过添加订单项时调用<code>this.items.push(item)</code>来操作订单项。</li></ol><p><code>Order</code>类没有直接访问<code>Customer</code>和<code>Item</code>类的内部状态和方法，而是通过委托的方式来获取所需的信息。这样可以避免<code>Order</code>类与其他对象之间的紧耦合关系，提高代码的灵活性和可维护性。</p><h2 id="开放封闭原则" tabindex="-1"><a class="header-anchor" href="#开放封闭原则" aria-hidden="true">#</a> 开放封闭原则</h2><p>开放封闭原则（Open-Closed Principle，OCP）是面向对象设计原则之一，它指导我们在设计软件实体时，应该对扩展开放，对修改封闭。</p><p>开放封闭原则的核心思想是通过抽象和多态性来实现接口的可扩展性，而不是直接修改现有的代码。当需求发生变化时，我们应该通过添加新的代码来扩展系统的功能，而不是修改已有的代码。这样能够确保现有的代码稳定性，减少对系统的影响，并提高代码的可维护性和可扩展性。</p><p>以下是一个使用 JavaScript 的例子，演示开放封闭原则的应用：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Shape</span> <span class="token punctuation">{</span>
  <span class="token function">draw</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 绘制形状的逻辑</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">Circle</span> <span class="token keyword">extends</span> <span class="token class-name">Shape</span> <span class="token punctuation">{</span>
  <span class="token function">draw</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 绘制圆形的逻辑</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">Rectangle</span> <span class="token keyword">extends</span> <span class="token class-name">Shape</span> <span class="token punctuation">{</span>
  <span class="token function">draw</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 绘制矩形的逻辑</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">Triangle</span> <span class="token keyword">extends</span> <span class="token class-name">Shape</span> <span class="token punctuation">{</span>
  <span class="token function">draw</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 绘制三角形的逻辑</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// 绘制形状的函数</span>
<span class="token keyword">function</span> <span class="token function">drawShape</span><span class="token punctuation">(</span><span class="token parameter">shape</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  shape<span class="token punctuation">.</span><span class="token function">draw</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上述例子中，<code>Shape</code>类是一个抽象基类，定义了一个<code>draw</code>方法用于绘制形状。<code>Circle</code>、<code>Rectangle</code>和<code>Triangle</code>类继承自<code>Shape</code>类，并实现了各自特定形状的绘制逻辑。</p><p>通过这种设计，当我们需要绘制新的形状时，只需要创建一个新的类继承自<code>Shape</code>，并实现自己的绘制逻辑，而不需要修改现有的代码。例如，如果我们要添加一个<code>Square</code>类来绘制正方形，只需要创建一个<code>Square</code>类，并实现<code>draw</code>方法即可，而不需要修改<code>drawShape</code>函数或其他已有的类。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Square</span> <span class="token keyword">extends</span> <span class="token class-name">Shape</span> <span class="token punctuation">{</span>
  <span class="token function">draw</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 绘制正方形的逻辑</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> square <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Square</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token function">drawShape</span><span class="token punctuation">(</span>square<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过遵循开放封闭原则，我们能够通过扩展来实现新的功能，而不会影响已有的代码。这种设计方式使系统更加稳定，易于扩展和维护。</p><h2 id="代码重构的几个要点" tabindex="-1"><a class="header-anchor" href="#代码重构的几个要点" aria-hidden="true">#</a> 代码重构的几个要点</h2><ol><li><p>提炼函数</p><ul><li>避免出现超大函数。</li><li>独立出来的函数有助于代码复用。</li><li>独立出来的函数更容易被覆写。</li><li>独立出来的函数如果拥有一个良好的命名，它本身就起到了注释的作用。</li></ul></li><li><p>合并重复的条件片段</p></li><li><p>把条件分支语句提炼成函数</p></li><li><p>合理使用循环，将相同代码提炼出来只循环变量以减少代码</p></li><li><p>提前让函数退出代替嵌套条件分支</p></li><li><p>传递<strong>对象参数</strong>代替过长的参数列表</p></li><li><p>尽量减少参数数量</p></li><li><p>少用三目运算符</p></li><li><p>合理使用链式调用</p></li><li><p>分解大型类</p></li><li><p>用<code>return</code>退出多重循环</p></li></ol><h2 id="参考文献" tabindex="-1"><a class="header-anchor" href="#参考文献" aria-hidden="true">#</a> 参考文献</h2><ul><li>《JavaScript 设计模式与开发实践》</li></ul>`,35),o=[l];function u(d,r){return t(),i("div",null,o)}const k=n(p,[["render",u],["__file","DesignPatterns03.html.vue"]]);export{k as default};
