export const data = JSON.parse("{\"key\":\"v-d27007b4\",\"path\":\"/JavaScript/Google%E6%B5%8F%E8%A7%88%E5%99%A8console.log%E3%80%8C%E5%BC%82%E6%AD%A5%E6%89%93%E5%8D%B0%E7%8E%B0%E8%B1%A1%E3%80%8D.html\",\"title\":\"Google浏览器console.log「异步打印现象」\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"Google浏览器console.log「异步打印现象」\",\"icon\":\"javascript\",\"order\":2,\"category\":[\"javascript\"],\"tag\":[\"javascript\"]},\"headers\":[{\"level\":2,\"title\":\"结论\",\"slug\":\"结论\",\"link\":\"#结论\",\"children\":[]},{\"level\":2,\"title\":\"正文\",\"slug\":\"正文\",\"link\":\"#正文\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"readingTime\":{\"minutes\":3.65,\"words\":1094},\"filePathRelative\":\"JavaScript/Google浏览器console.log「异步打印现象」.md\",\"excerpt\":\"<h1> Google 浏览器 console.log「异步打印现象」</h1>\\n<h2> 结论</h2>\\n<blockquote>\\n<p>针对在浏览器控制台出现打印结果和代码执行顺序不一致这种「异步现象」。网上主要有两种说法，笔者这里更喜欢第一种，好理解且符合笔者的测试</p>\\n<ul>\\n<li>浏览器出于优化的目地，默认不会展开所有对象，只有当手动点击展开时才去”读取对应的值“来进行展示。「点击」是一个代码执行完成之后的行为，所以对深层对象的打印总是最后时刻的快照。</li>\\n<li>不同的浏览器可能有自己的 console.log 实现机制，受限于 I/O 性能可能打印的时机会与代码执行的时机不匹配。也就是说如果打印的时机如果较为靠后，那么打印时因为引用型的数据发生了修改，所以出现改变前后打印结果都一致的现象</li>\\n</ul>\\n</blockquote>\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
