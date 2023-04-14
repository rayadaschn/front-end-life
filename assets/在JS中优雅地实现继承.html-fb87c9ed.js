const e=JSON.parse(`{"key":"v-1a99e9da","path":"/JavaScript/%E5%9C%A8JS%E4%B8%AD%E4%BC%98%E9%9B%85%E5%9C%B0%E5%AE%9E%E7%8E%B0%E7%BB%A7%E6%89%BF.html","title":"在 JS 中优雅地实现继承","lang":"zh-CN","frontmatter":{"title":"在 JS 中优雅地实现继承","icon":"javascript","order":8,"category":["javascript"],"tag":["javascript"],"star":true,"sticky":false,"description":"在 JS 中优雅地实现继承 在 原型_原型链_new 的二三事 中，我们讨论了原型和原型链的实现关系。在本文，我们再来看看如何去实现继承。 1. 是什么? 我们还是先来看原型的这张神图： Developer settings","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/front-end-life/JavaScript/%E5%9C%A8JS%E4%B8%AD%E4%BC%98%E9%9B%85%E5%9C%B0%E5%AE%9E%E7%8E%B0%E7%BB%A7%E6%89%BF.html"}],["meta",{"property":"og:site_name","content":"Huy's Blog"}],["meta",{"property":"og:title","content":"在 JS 中优雅地实现继承"}],["meta",{"property":"og:description","content":"在 JS 中优雅地实现继承 在 原型_原型链_new 的二三事 中，我们讨论了原型和原型链的实现关系。在本文，我们再来看看如何去实现继承。 1. 是什么? 我们还是先来看原型的这张神图： Developer settings"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-04-14T07:06:46.000Z"}],["meta",{"property":"article:tag","content":"javascript"}],["meta",{"property":"article:modified_time","content":"2023-04-14T07:06:46.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"在 JS 中优雅地实现继承\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2023-04-14T07:06:46.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":2,"title":"1. 是什么?","slug":"_1-是什么","link":"#_1-是什么","children":[]},{"level":2,"title":"2. 继承方案实现","slug":"_2-继承方案实现","link":"#_2-继承方案实现","children":[{"level":3,"title":"2.1 原型链实现继承","slug":"_2-1-原型链实现继承","link":"#_2-1-原型链实现继承","children":[]},{"level":3,"title":"2.2 构造函数继承(盗用构造函数)","slug":"_2-2-构造函数继承-盗用构造函数","link":"#_2-2-构造函数继承-盗用构造函数","children":[]},{"level":3,"title":"2.3 组合继承（盗用构造函数）","slug":"_2-3-组合继承-盗用构造函数","link":"#_2-3-组合继承-盗用构造函数","children":[]},{"level":3,"title":"2.4 较为完善的组合继承","slug":"_2-4-较为完善的组合继承","link":"#_2-4-较为完善的组合继承","children":[]},{"level":3,"title":"2.5 最终的组合式继承","slug":"_2-5-最终的组合式继承","link":"#_2-5-最终的组合式继承","children":[]}]},{"level":2,"title":"引用资料","slug":"引用资料","link":"#引用资料","children":[]}],"git":{"createdTime":1676363950000,"updatedTime":1681456006000,"contributors":[{"name":"rayadaschn","email":"rayadaschn@gmail.com","commits":4},{"name":"Huy","email":"rayadaschn@gmail.com","commits":2},{"name":"rayadaschn","email":"115447518+rayadaschn@users.noreply.github.com","commits":2}]},"readingTime":{"minutes":8.78,"words":2633},"filePathRelative":"JavaScript/在JS中优雅地实现继承.md","localizedDate":"2023年2月14日","excerpt":"<h1> 在 JS 中优雅地实现继承</h1>\\n<p>在 <a href=\\"/front-end-life/JavaScript/%E5%8E%9F%E5%9E%8B_%E5%8E%9F%E5%9E%8B%E9%93%BE_new%E7%9A%84%E4%BA%8C%E4%B8%89%E4%BA%8B.html\\" target=\\"blank\\">原型_原型链_new 的二三事</a> 中，我们讨论了原型和原型链的实现关系。在本文，我们再来看看如何去实现继承。</p>\\n<h2> 1. 是什么?</h2>\\n<p>我们还是先来看原型的这张神图：</p>\\n<figure><img src=\\"https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@main/img/jsobj.jpg\\" alt=\\"Developer settings\\" tabindex=\\"0\\" loading=\\"lazy\\"><figcaption>Developer settings</figcaption></figure>","autoDesc":true}`);export{e as data};
