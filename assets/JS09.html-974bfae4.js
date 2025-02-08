const e=JSON.parse('{"key":"v-18ce106c","path":"/JavaScript/JS/JS09.html","title":"简单手写 Promise","lang":"zh-CN","frontmatter":{"title":"简单手写 Promise","icon":"javascript","date":"2023-07-28T00:00:00.000Z","category":["javascript"],"tag":["javascript"],"sticky":false},"headers":[{"level":2,"title":"技术要点","slug":"技术要点","link":"#技术要点","children":[]},{"level":2,"title":"测试用例","slug":"测试用例","link":"#测试用例","children":[]},{"level":2,"title":"正式手写 Promise","slug":"正式手写-promise","link":"#正式手写-promise","children":[{"level":3,"title":"1. 手写基础构造函数","slug":"_1-手写基础构造函数","link":"#_1-手写基础构造函数","children":[]},{"level":3,"title":"2. 实现 then 和 catch 的链式调用","slug":"_2-实现-then-和-catch-的链式调用","link":"#_2-实现-then-和-catch-的链式调用","children":[]},{"level":3,"title":"3. 完善 Promise 的静态方法","slug":"_3-完善-promise-的静态方法","link":"#_3-完善-promise-的静态方法","children":[]}]},{"level":2,"title":"完整 Promise 代码","slug":"完整-promise-代码","link":"#完整-promise-代码","children":[]},{"level":2,"title":"Promise 的应用","slug":"promise-的应用","link":"#promise-的应用","children":[{"level":3,"title":"Promise.allSettled 的实现","slug":"promise-allsettled-的实现","link":"#promise-allsettled-的实现","children":[]},{"level":3,"title":"Promise 变同步","slug":"promise-变同步","link":"#promise-变同步","children":[]},{"level":3,"title":"Promise.race 应用","slug":"promise-race-应用","link":"#promise-race-应用","children":[]}]}],"git":{"createdTime":1711950553000,"updatedTime":1739029752000,"contributors":[{"name":"rayadaschn","email":"115447518+rayadaschn@users.noreply.github.com","commits":2}]},"readingTime":{"minutes":8.23,"words":2468},"filePathRelative":"JavaScript/JS/JS09.md","localizedDate":"2023年7月28日","excerpt":"<blockquote>\\n<p>在刚学 JS 的时候有尝试手写过完整的 Promise，但是代码量太过于庞大了，过了半年就忘记了。\\n这一次，手写一个简易版的 Promise，以加强理解。</p>\\n</blockquote>\\n<h2> 技术要点</h2>\\n<ul>\\n<li>能够初始化和异步调用</li>\\n<li>能够实现 then 和 catch 的链式调用</li>\\n<li>静态方法: resolve、reject、all 和 race</li>\\n</ul>\\n<div class=\\"hint-container tip\\">\\n<p class=\\"hint-container-title\\">提示</p>\\n<p>值得注意的是, 本文实现的 Promise, 并非规范版 Promise。区别在于: 规范中不论 promise 被 reject 还是被 resolve 时, 结果 都会被 resolve，<strong>只有出现异常时才会被<code>rejected</code></strong>。</p>\\n</div>"}');export{e as data};
