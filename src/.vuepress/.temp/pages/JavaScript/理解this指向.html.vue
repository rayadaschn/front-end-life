<template><div><h1 id="理解-this-指向" tabindex="-1"><a class="header-anchor" href="#理解-this-指向" aria-hidden="true">#</a> 理解 this 指向</h1>
<blockquote>
<p>this 是 JavaScript 中的一个关键字，但是又一个相对比较特别的关键字，不像 function、var、for、if 这些关键字一样，可以很清楚的搞清楚它到底是如何使用的。</p>
<p>this 会在执行上下文中绑定一个对象，但是是根据什么条件绑定的呢？在不同的执行条件下会绑定不同的对象，这也是让人捉摸不定的地方。</p>
<p>这一次，我们一起来彻底搞定 this 到底是如何绑定的吧！</p>
</blockquote>
<h2 id="一-理解-this" tabindex="-1"><a class="header-anchor" href="#一-理解-this" aria-hidden="true">#</a> 一. 理解 this</h2>
<h3 id="_1-1-为什么使用-this" tabindex="-1"><a class="header-anchor" href="#_1-1-为什么使用-this" aria-hidden="true">#</a> 1.1. 为什么使用 this</h3>
<p>在常见的编程语言中，几乎都有 this 这个关键字（Objective-C 中使用的是 self），但是 JavaScript 中的 this 和常见的面向对象语言中的 this 不太一样：</p>
<ul>
<li>常见面向对象的编程语言中，比如 Java、C++、Swift、Dart 等等一系列语言中，this 通常只会出现在<code v-pre>类的方法</code>中。</li>
<li>也就是你需要有一个类，类中的方法（特别是实例方法）中，this 代表的是当前调用对象。</li>
<li>但是 JavaScript 中的 this 更加灵活，无论是它出现的位置还是它代表的含义。</li>
</ul>
<p>使用 this 有什么意义呢？下面的代码中，我们通过对象字面量创建出来一个对象，当我们调用对象的方法时，希望将对象的名称一起进行打印。</p>
<p>如果没有 this，那么我们的代码会是下面的写法：</p>
<ul>
<li>在方法中，为了能够获取到 name 名称，必须通过 obj 的引用（变量名称）来获取。</li>
<li>但是这样做有一个很大的弊端：如果我将 obj 的名称换成了 info，那么所有的方法中的 obj 都需要换成 info。</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>var obj = {
  name: "why",
  running: function() {
    console.log(obj.name + " running");
  },
  eating: function() {
    console.log(obj.name + " eating");
  },
  studying: function() {
    console.log(obj.name + " studying");
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>事实上，上面的代码，在实际开发中，我们都会使用 this 来进行优化：</p>
<ul>
<li>当我们通过 obj 去调用 running、eating、studying 这些方法时，this 就是指向的 obj 对象</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>var obj = {
  name: "why",
  running: function() {
    console.log(this.name + " running");
  },
  eating: function() {
    console.log(this.name + " eating");
  },
  studying: function() {
    console.log(this.name + " studying");
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以我们会发现，在某些函数或者方法的编写中，this 可以让我们更加便捷的方式来引用对象，在进行一些 API 设计时，代码更加的简洁和易于复用。</p>
<p>当然，上面只是应用 this 的一个场景而已，开发中使用到 this 的场景到处都是，这也是为什么它不容易理解的原因。</p>
<h3 id="_1-2-this-指向什么" tabindex="-1"><a class="header-anchor" href="#_1-2-this-指向什么" aria-hidden="true">#</a> 1.2. this 指向什么</h3>
<p>我们先说一个最简单的，this 在全局作用域下指向什么？</p>
<ul>
<li>这个问题非常容易回答，在浏览器中测试就是指向 window</li>
<li>所以，在全局作用域下，我们可以认为 this 就是指向的 window</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>console.log(this); // window

var name = "why";
console.log(this.name); // why
console.log(window.name); // why
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是，开发中很少直接在全局作用域下去使用 this，通常都是在<strong>函数中使用</strong>。</p>
<p>所有的函数在被调用时，都会创建一个执行上下文：</p>
<ul>
<li>这个上下文中记录着函数的调用栈、函数的调用方式、传入的参数信息等；</li>
<li>this 也是其中的一个属性；</li>
</ul>
<p>我们先来看一个让人困惑的问题：</p>
<ul>
<li>定义一个函数，我们采用三种不同的方式对它进行调用，它产生了三种不同的结果</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>// 定义一个函数
function foo() {
  console.log(this);
}

// 1.调用方式一: 直接调用
foo(); // window

// 2.调用方式二: 将foo放到一个对象中,再调用
var obj = {
  name: &quot;why&quot;,
  foo: foo
}
obj.foo() // obj对象

// 3.调用方式三: 通过call/apply调用
foo.call(&quot;abc&quot;); // String {&quot;abc&quot;}对象
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的案例可以给我们什么样的启示呢？</p>
<ul>
<li>1.函数在调用时，JavaScript 会默认给 this 绑定一个值；</li>
<li>2.this 的绑定和定义的位置（编写的位置）没有关系；</li>
<li>3.this 的绑定和调用方式以及调用的位置有关系；</li>
<li>4.this 是在运行时被绑定的；</li>
</ul>
<p>那么 this 到底是怎么样的绑定规则呢？一起来学习一下吧</p>
<h2 id="二-this-绑定规则" tabindex="-1"><a class="header-anchor" href="#二-this-绑定规则" aria-hidden="true">#</a> 二. this 绑定规则</h2>
<blockquote>
<p>我们现在已经知道 this 无非就是在函数调用时被绑定的一个对象，我们就需要知道它在不同的场景下的绑定规则即可。</p>
</blockquote>
<h3 id="_2-1-默认绑定" tabindex="-1"><a class="header-anchor" href="#_2-1-默认绑定" aria-hidden="true">#</a> 2.1. 默认绑定</h3>
<p>什么情况下使用默认绑定呢？独立函数调用。</p>
<ul>
<li>独立的函数调用我们可以理解成函数没有被绑定到某个对象上进行调用；</li>
</ul>
<p><strong>案例一：普通函数调用</strong></p>
<ul>
<li>该函数直接被调用，并没有进行任何的对象关联；</li>
<li>这种独立的函数调用会使用默认绑定，通常默认绑定时，函数中的 this 指向全局对象（window）；</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>function foo() {
  console.log(this); // window
}

foo();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>案例二：函数调用链（一个函数又调用另外一个函数）</strong></p>
<ul>
<li>所有的函数调用都没有被绑定到某个对象上；</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>// 2.案例二:
function test1() {
  console.log(this); // window
  test2();
}

function test2() {
  console.log(this); // window
  test3()
}

function test3() {
  console.log(this); // window
}
test1();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>案例三：将函数作为参数，传入到另一个函数中</strong></p>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>function foo(func) {
  func()
}

function bar() {
  console.log(this); // window
}

foo(bar);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们对案例进行一些修改，考虑一下打印结果是否会发生变化：</p>
<ul>
<li>这里的结果依然是 window，为什么呢？</li>
<li>原因非常简单，在真正函数调用的位置，并没有进行任何的对象绑定，只是一个独立函数的调用；</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>function foo(func) {
  func()
}

var obj = {
  name: &quot;why&quot;,
  bar: function() {
    console.log(this); // window
  }
}

foo(obj.bar);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-隐式绑定" tabindex="-1"><a class="header-anchor" href="#_2-2-隐式绑定" aria-hidden="true">#</a> 2.2. 隐式绑定</h3>
<p>另外一种比较常见的调用方式是通过某个对象进行调用的：</p>
<ul>
<li>也就是它的调用位置中，是通过某个对象发起的函数调用。</li>
</ul>
<p><strong>案例一：通过对象调用函数</strong></p>
<ul>
<li>foo 的调用位置是 obj.foo()方式进行调用的</li>
<li>那么 foo 调用时 this 会隐式的被绑定到 obj 对象上</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>function foo() {
  console.log(this); // obj对象
}

var obj = {
  name: &quot;why&quot;,
  foo: foo
}

obj.foo();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>案例二：案例一的变化</strong></p>
<ul>
<li>我们通过 obj2 又引用了 obj1 对象，再通过 obj1 对象调用 foo 函数；</li>
<li>那么 foo 调用的位置上其实还是 obj1 被绑定了 this；</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>function foo() {
  console.log(this); // obj对象
}

var obj1 = {
  name: &quot;obj1&quot;,
  foo: foo
}

var obj2 = {
  name: &quot;obj2&quot;,
  obj1: obj1
}

obj2.obj1.foo();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>案例三：隐式丢失</strong></p>
<ul>
<li>结果最终是 window，为什么是 window 呢？</li>
<li>因为 foo 最终被调用的位置是 bar，而 bar 在进行调用时没有绑定任何的对象，也就没有形成隐式绑定；</li>
<li>相当于是一种默认绑定；</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>function foo() {
  console.log(this);
}

var obj1 = {
  name: &quot;obj1&quot;,
  foo: foo
}

// 讲obj1的foo赋值给bar
var bar = obj1.foo;
bar();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-显示绑定" tabindex="-1"><a class="header-anchor" href="#_2-3-显示绑定" aria-hidden="true">#</a> 2.3. 显示绑定</h3>
<p>隐式绑定有一个前提条件：</p>
<ul>
<li>必须在调用的<code v-pre>对象内部</code>有一个对函数的引用（比如一个属性）；</li>
<li>如果没有这样的引用，在进行调用时，会报找不到该函数的错误；</li>
<li>正是通过这个引用，间接的将 this 绑定到了这个对象上；</li>
</ul>
<p>如果我们不希望在 <strong>对象内部</strong> 包含这个函数的引用，同时又希望在这个对象上进行强制调用，该怎么做呢？</p>
<ul>
<li>
<p>JavaScript 所有的函数都可以使用 call 和 apply 方法（这个和 Prototype 有关）。</p>
</li>
<li>
<ul>
<li>它们两个的区别这里不再展开；</li>
<li>其实非常简单，第一个参数是相同的，后面的参数，apply 为数组，call 为参数列表；</li>
</ul>
</li>
<li>
<p>这两个函数的第一个参数都要求是一个对象，这个对象的作用是什么呢？就是给 this 准备的。</p>
</li>
<li>
<p>在调用这个函数时，会将 this 绑定到这个传入的对象上。</p>
</li>
</ul>
<p>因为上面的过程，我们明确的绑定了 this 指向的对象，所以称之为 <strong>显示绑定</strong>。</p>
<h4 id="_2-3-1-call、apply" tabindex="-1"><a class="header-anchor" href="#_2-3-1-call、apply" aria-hidden="true">#</a> 2.3.1. call、apply</h4>
<p><strong>通过 call 或者 apply 绑定 this 对象</strong></p>
<ul>
<li>显示绑定后，this 就会明确的指向绑定的对象</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>function foo() {
  console.log(this);
}

foo.call(window); // window
foo.call({name: &quot;why&quot;}); // {name: &quot;why&quot;}
foo.call(123); // Number对象,存放时123
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-3-2-bind-函数" tabindex="-1"><a class="header-anchor" href="#_2-3-2-bind-函数" aria-hidden="true">#</a> 2.3.2. bind 函数</h4>
<p><strong>如果我们希望一个函数总是显示的绑定到一个对象上，可以怎么做呢？</strong></p>
<p>方案一：自己手写一个辅助函数（了解）</p>
<ul>
<li>我们手动写了一个 bind 的辅助函数</li>
<li>这个辅助函数的目的是在执行 foo 时，总是让它的 this 绑定到 obj 对象上</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>function foo() {
  console.log(this);
}

var obj = {
  name: &quot;why&quot;
}

function bind(func, obj) {
  return function() {
    return func.apply(obj, arguments);
  }
}

var bar = bind(foo, obj);

bar(); // obj对象
bar(); // obj对象
bar(); // obj对象
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>方案二：使用 Function.prototype.bind</p>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>function foo() {
  console.log(this);
}

var obj = {
  name: &quot;why&quot;
}

var bar = foo.bind(obj);

bar(); // obj对象
bar(); // obj对象
bar(); // obj对象
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-3-3-内置函数" tabindex="-1"><a class="header-anchor" href="#_2-3-3-内置函数" aria-hidden="true">#</a> 2.3.3. 内置函数</h4>
<p>有些时候，我们会调用一些 JavaScript 的内置函数，或者一些第三方库中的内置函数。</p>
<ul>
<li>这些内置函数会要求我们传入另外一个函数；</li>
<li>我们自己并不会显示的调用这些函数，而且 JavaScript 内部或者第三方库内部会帮助我们执行；</li>
<li>这些函数中的 this 又是如何绑定的呢？</li>
</ul>
<p><strong>案例一：setTimeout</strong></p>
<ul>
<li>setTimeout 中会传入一个函数，这个函数中的 this 通常是 window</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>setTimeout(function() {
  console.log(this); // window
}, 1000);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为什么这里是 window 呢？</p>
<ul>
<li>这个和 setTimeout 源码的内部调用有关；</li>
<li>setTimeout 内部是通过 apply 进行绑定的 this 对象，并且绑定的是全局对象；</li>
</ul>
<p><strong>案例二：数组的 forEach</strong></p>
<p>数组有一个高阶函数 forEach，用于函数的遍历：</p>
<ul>
<li>在 forEach 中传入的函数打印的也是 Window 对象；</li>
<li>这是因为默认情况下传入的函数是自动调用函数（默认绑定）；</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>var names = [&quot;abc&quot;, &quot;cba&quot;, &quot;nba&quot;];
names.forEach(function(item) {
  console.log(this); // 三次window
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们是否可以改变该函数的 this 指向呢？</p>
<p><img src="https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuudtInnD9wxRhHgxcvDTBiawz3JpiceQnDbwbxib2xgcWCicmtt8BccIXdZ22wKp7p8DZOhOv3KrxTvZw/640?wx_fmt=jpeg&amp;tp=webp&amp;wxfrom=5&amp;wx_lazy=1&amp;wx_co=1" alt="图片" loading="lazy">forEach 参数</p>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>var names = [&quot;abc&quot;, &quot;cba&quot;, &quot;nba&quot;];
var obj = {name: &quot;why&quot;};
names.forEach(function(item) {
  console.log(this); // 三次obj对象
}, obj);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>案例三：div 的点击</strong></p>
<p>如果我们有一个 div 元素：</p>
<ul>
<li>注意：省略了部分代码</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>  &lt;style&gt;
    .box {
      width: 200px;
      height: 200px;
      background-color: red;
    }
  &lt;/style&gt;

  &lt;div class=&quot;box&quot;&gt;&lt;/div&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>获取元素节点，并且监听点击：</p>
<ul>
<li>在点击事件的回调中，this 指向谁呢？box 对象；</li>
<li>这是因为在发生点击时，执行传入的回调函数被调用时，会将 box 对象绑定到该函数中；</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>var box = document.querySelector(&quot;.box&quot;);
box.onclick = function() {
  console.log(this); // box对象
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以传入到内置函数的回调函数 this 如何确定呢？</p>
<ul>
<li>某些内置的函数，我们很难确定它内部是如何调用传入的回调函数；</li>
<li>一方面可以通过分析源码来确定，另一方面我们可以通过经验（见多识广）来确定；</li>
<li>但是无论如何，通常都是我们之前讲过的规则来确定的；</li>
</ul>
<h3 id="_2-4-new-绑定" tabindex="-1"><a class="header-anchor" href="#_2-4-new-绑定" aria-hidden="true">#</a> 2.4. new 绑定</h3>
<p>JavaScript 中的函数可以当做一个类的构造函数来使用，也就是使用 new 关键字。</p>
<p>使用 new 关键字来调用函数时，会执行如下的操作：</p>
<ul>
<li>1.创建一个全新的对象；</li>
<li>2.这个新对象会被执行 Prototype 连接；</li>
<li>3.这个新对象会绑定到函数调用的 this 上（this 的绑定在这个步骤完成）；</li>
<li>4.如果函数没有返回其他对象，表达式会返回这个新对象；</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>// 创建Person
function Person(name) {
  console.log(this); // Person {}
  this.name = name; // Person {name: &quot;why&quot;}
}

var p = new Person(&quot;why&quot;);
console.log(p);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-5-规则优先级" tabindex="-1"><a class="header-anchor" href="#_2-5-规则优先级" aria-hidden="true">#</a> 2.5. 规则优先级</h3>
<p>学习了四条规则，接下来开发中我们只需要去查找函数的调用应用了哪条规则即可，但是如果一个函数调用位置应用了多条规则，优先级谁更高呢？</p>
<p><strong>1.默认规则的优先级最低</strong></p>
<p>毫无疑问，默认规则的优先级是最低的，因为存在其他规则时，就会通过其他规则的方式来绑定 this</p>
<p><strong>2.显示绑定优先级高于隐式绑定</strong></p>
<p>显示绑定和隐式绑定哪一个优先级更高呢？这个我们可以测试一下：</p>
<ul>
<li>结果是 obj2，说明是显示绑定生效了</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>function foo() {
  console.log(this);
}

var obj1 = {
  name: &quot;obj1&quot;,
  foo: foo
}

var obj2 = {
  name: &quot;obj2&quot;,
  foo: foo
}

// 隐式绑定
obj1.foo(); // obj1
obj2.foo(); // obj2

// 隐式绑定和显示绑定同时存在
obj1.foo.call(obj2); // obj2, 说明显式绑定优先级更高
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>3.new 绑定优先级高于隐式绑定</strong></p>
<ul>
<li>结果是 foo，说明是 new 绑定生效了</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>function foo() {
  console.log(this);
}

var obj = {
  name: &quot;why&quot;,
  foo: foo
}

new obj.foo(); // foo对象, 说明new绑定优先级更高
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>4.new 绑定优先级高于 bind</strong></p>
<p>new 绑定和 call、apply 是不允许同时使用的，所以不存在谁的优先级更高</p>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>function foo() {
  console.log(this);
}

var obj = {
  name: &quot;obj&quot;
}

var foo = new foo.call(obj);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuudtInnD9wxRhHgxcvDTBiawqMVqDcUCicycrB19VfsAgV4FWLL4vsBDcbkaG4V0FDD0iaEZW3PKGwfQ/640?wx_fmt=jpeg&amp;tp=webp&amp;wxfrom=5&amp;wx_lazy=1&amp;wx_co=1" alt="图片" loading="lazy">new 和 call 同时使用</p>
<p>但是 new 绑定是否可以和 bind 后的函数同时使用呢？可以</p>
<ul>
<li>结果显示为 foo，那么说明是 new 绑定生效了</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>function foo() {
  console.log(this);
}

var obj = {
  name: &quot;obj&quot;
}

// var foo = new foo.call(obj);
var bar = foo.bind(obj);
var foo = new bar(); // 打印foo, 说明使用的是new绑定
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>优先级总结：</p>
<ul>
<li>new 绑定 &gt; 显示绑定（bind）&gt; 隐式绑定 &gt; 默认绑定</li>
</ul>
<h2 id="三-this-规则之外" tabindex="-1"><a class="header-anchor" href="#三-this-规则之外" aria-hidden="true">#</a> 三. this 规则之外</h2>
<blockquote>
<p>我们讲到的规则已经足以应付平时的开发，但是总有一些语法，超出了我们的规则之外。（神话故事和动漫中总是有类似这样的人物）</p>
</blockquote>
<h3 id="_3-1-忽略显示绑定" tabindex="-1"><a class="header-anchor" href="#_3-1-忽略显示绑定" aria-hidden="true">#</a> 3.1. 忽略显示绑定</h3>
<p>如果在显示绑定中，我们传入一个 null 或者 undefined，那么这个显示绑定会被忽略，使用默认规则：</p>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>function foo() {
  console.log(this);
}

var obj = {
  name: &quot;why&quot;
}

foo.call(obj); // obj对象
foo.call(null); // window
foo.call(undefined); // window

var bar = foo.bind(null);
bar(); // window
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-间接函数引用" tabindex="-1"><a class="header-anchor" href="#_3-2-间接函数引用" aria-hidden="true">#</a> 3.2. 间接函数引用</h3>
<p>另外一种情况，创建一个函数的 <code v-pre>间接引用</code>，这种情况使用默认绑定规则。</p>
<p>我们先来看下面的案例结果是什么？</p>
<ul>
<li>(num2 = num1)的结果是 num1 的值；</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>var num1 = 100;
var num2 = 0;
var result = (num2 = num1);
console.log(result); // 100
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们来下面的函数赋值结果：</p>
<ul>
<li>赋值(obj2.foo = obj1.foo)的结果是 foo 函数；</li>
<li>foo 函数被直接调用，那么是默认绑定；</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>function foo() {
  console.log(this);
}

var obj1 = {
  name: &quot;obj1&quot;,
  foo: foo
};

var obj2 = {
  name: &quot;obj2&quot;
}

obj1.foo(); // obj1对象
(obj2.foo = obj1.foo)();  // window
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-es6-箭头函数" tabindex="-1"><a class="header-anchor" href="#_3-3-es6-箭头函数" aria-hidden="true">#</a> 3.3. ES6 箭头函数</h3>
<p>在 ES6 中新增一个非常好用的函数类型：箭头函数</p>
<ul>
<li>这里不再具体介绍箭头函数的用法，可以自行学习。</li>
</ul>
<p>箭头函数不使用 this 的四种标准规则（也就是不绑定 this），而是根据外层作用域来决定 this。</p>
<p>我们来看一个模拟网络请求的案例：</p>
<ul>
<li>这里我使用 setTimeout 来模拟网络请求，请求到数据后如何可以存放到 data 中呢？</li>
<li>我们需要拿到 obj 对象，设置 data；</li>
<li>但是直接拿到的 this 是 window，我们需要在外层定义：<code v-pre>var _this = this</code></li>
<li>在 setTimeout 的回调函数中使用_this 就代表了 obj 对象</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>var obj = {
  data: [],
  getData: function() {
    var _this = this;
    setTimeout(function() {
      // 模拟获取到的数据
      var res = [&quot;abc&quot;, &quot;cba&quot;, &quot;nba&quot;];
      _this.data.push(...res);
    }, 1000);
  }
}

obj.getData();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的代码在 ES6 之前是我们最常用的方式，从 ES6 开始，我们会使用箭头函数：</p>
<ul>
<li>为什么在 setTimeout 的回调函数中可以直接使用 this 呢？</li>
<li>因为箭头函数并不绑定 this 对象，那么 this 引用就会从上层作用域中找到对应的 this</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>var obj = {
  data: [],
  getData: function() {
    setTimeout(() =&gt; {
      // 模拟获取到的数据
      var res = [&quot;abc&quot;, &quot;cba&quot;, &quot;nba&quot;];
      this.data.push(...res);
    }, 1000);
  }
}

obj.getData();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>思考：如果 getData 也是一个箭头函数，那么 setTimeout 中的回调函数中的 this 指向谁呢？</p>
<ul>
<li>答案是 window；</li>
<li>依然是不断的从上层作用域找，那么找到了全局作用域；</li>
<li>在全局作用域内，this 代表的就是 window</li>
</ul>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>var obj = {
  data: [],
  getData: () =&gt; {
    setTimeout(() =&gt; {
      console.log(this); // window
    }, 1000);
  }
}

obj.getData();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四-this-面试题" tabindex="-1"><a class="header-anchor" href="#四-this-面试题" aria-hidden="true">#</a> 四. this 面试题</h2>
<h3 id="_4-1-面试题一" tabindex="-1"><a class="header-anchor" href="#_4-1-面试题一" aria-hidden="true">#</a> 4.1. 面试题一：</h3>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>var name = &quot;window&quot;;
var person = {
  name: &quot;person&quot;,
  sayName: function () {
    console.log(this.name);
  }
};
function sayName() {
  var sss = person.sayName;
  sss();
  person.sayName();
  (person.sayName)();
  (b = person.sayName)();
}
sayName();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这道面试题非常简单，无非就是绕一下，希望把面试者绕晕：</p>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>function sayName() {
  var sss = person.sayName;
  // 独立函数调用，没有和任何对象关联
  sss(); // window
  // 关联
  person.sayName(); // person
  (person.sayName)(); // person
  (b = person.sayName)(); // window
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-面试题二" tabindex="-1"><a class="header-anchor" href="#_4-2-面试题二" aria-hidden="true">#</a> 4.2. 面试题二：</h3>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>var name = 'window'
var person1 = {
  name: 'person1',
  foo1: function () {
    console.log(this.name)
  },
  foo2: () =&gt; console.log(this.name),
  foo3: function () {
    return function () {
      console.log(this.name)
    }
  },
  foo4: function () {
    return () =&gt; {
      console.log(this.name)
    }
  }
}

var person2 = { name: 'person2' }

person1.foo1();
person1.foo1.call(person2);

person1.foo2();
person1.foo2.call(person2);

person1.foo3()();
person1.foo3.call(person2)();
person1.foo3().call(person2);

person1.foo4()();
person1.foo4.call(person2)();
person1.foo4().call(person2);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面是代码解析：</p>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>// 隐式绑定，肯定是person1
person1.foo1(); // person1
// 隐式绑定和显示绑定的结合，显示绑定生效，所以是person2
person1.foo1.call(person2); // person2

// foo2()是一个箭头函数，不适用所有的规则
person1.foo2() // window
// foo2依然是箭头函数，不适用于显示绑定的规则
person1.foo2.call(person2) // window

// 获取到foo3，但是调用位置是全局作用于下，所以是默认绑定window
person1.foo3()() // window
// foo3显示绑定到person2中
// 但是拿到的返回函数依然是在全局下调用，所以依然是window
person1.foo3.call(person2)() // window
// 拿到foo3返回的函数，通过显示绑定到person2中，所以是person2
person1.foo3().call(person2) // person2

// foo4()的函数返回的是一个箭头函数
// 箭头函数的执行找上层作用域，是person1
person1.foo4()() // person1
// foo4()显示绑定到person2中，并且返回一个箭头函数
// 箭头函数找上层作用域，是person2
person1.foo4.call(person2)() // person2
// foo4返回的是箭头函数，箭头函数只看上层作用域
person1.foo4().call(person2) // person1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-面试题三" tabindex="-1"><a class="header-anchor" href="#_4-3-面试题三" aria-hidden="true">#</a> 4.3. 面试题三:</h3>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>var name = 'window'
function Person (name) {
  this.name = name
  this.foo1 = function () {
    console.log(this.name)
  },
  this.foo2 = () =&gt; console.log(this.name),
  this.foo3 = function () {
    return function () {
      console.log(this.name)
    }
  },
  this.foo4 = function () {
    return () =&gt; {
      console.log(this.name)
    }
  }
}
var person1 = new Person('person1')
var person2 = new Person('person2')

person1.foo1()
person1.foo1.call(person2)

person1.foo2()
person1.foo2.call(person2)

person1.foo3()()
person1.foo3.call(person2)()
person1.foo3().call(person2)

person1.foo4()()
person1.foo4.call(person2)()
person1.foo4().call(person2)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面是代码解析：</p>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>// 隐式绑定
person1.foo1() // peron1
// 显示绑定优先级大于隐式绑定
person1.foo1.call(person2) // person2

// foo是一个箭头函数，会找上层作用域中的this，那么就是person1
person1.foo2() // person1
// foo是一个箭头函数，使用call调用不会影响this的绑定，和上面一样向上层查找
person1.foo2.call(person2) // person1

// 调用位置是全局直接调用，所以依然是window（默认绑定）
person1.foo3()() // window
// 最终还是拿到了foo3返回的函数，在全局直接调用（默认绑定）
person1.foo3.call(person2)() // window
// 拿到foo3返回的函数后，通过call绑定到person2中进行了调用
person1.foo3().call(person2) // person2

// foo4返回了箭头函数，和自身绑定没有关系，上层找到person1
person1.foo4()() // person1
// foo4调用时绑定了person2，返回的函数是箭头函数，调用时，找到了上层绑定的person2
person1.foo4.call(person2)() // person2
// foo4调用返回的箭头函数，和call调用没有关系，找到上层的person1
person1.foo4().call(person2) // person1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-4-面试题四" tabindex="-1"><a class="header-anchor" href="#_4-4-面试题四" aria-hidden="true">#</a> 4.4. 面试题四：</h3>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>var name = 'window'
function Person (name) {
  this.name = name
  this.obj = {
    name: 'obj',
    foo1: function () {
      return function () {
        console.log(this.name)
      }
    },
    foo2: function () {
      return () =&gt; {
        console.log(this.name)
      }
    }
  }
}
var person1 = new Person('person1')
var person2 = new Person('person2')

person1.obj.foo1()()
person1.obj.foo1.call(person2)()
person1.obj.foo1().call(person2)

person1.obj.foo2()()
person1.obj.foo2.call(person2)()
person1.obj.foo2().call(person2)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面是代码解析：</p>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>// obj.foo1()返回一个函数
// 这个函数在全局作用于下直接执行（默认绑定）
person1.obj.foo1()() // window
// 最终还是拿到一个返回的函数（虽然多了一步call的绑定）
// 这个函数在全局作用于下直接执行（默认绑定）
person1.obj.foo1.call(person2)() // window
person1.obj.foo1().call(person2) // person2

// 拿到foo2()的返回值，是一个箭头函数
// 箭头函数在执行时找上层作用域下的this，就是obj
person1.obj.foo2()() // obj
// foo2()的返回值，依然是箭头函数，但是在执行foo2时绑定了person2
// 箭头函数在执行时找上层作用域下的this，找到的是person2
person1.obj.foo2.call(person2)() // person2
// foo2()的返回值，依然是箭头函数
// 箭头函数通过call调用是不会绑定this，所以找上层作用域下的this是obj
person1.obj.foo2().call(person2) // obj
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


