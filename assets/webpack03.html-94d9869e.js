const e=JSON.parse('{"key":"v-e2bf261a","path":"/Framework/webpack03.html","title":"Webpack 性能优化之分包","lang":"zh-CN","frontmatter":{"title":"Webpack 性能优化之分包","icon":"build","date":"2023-04-05T00:00:00.000Z","article":false,"category":["框架"],"tag":["webpack"],"star":false,"sticky":false},"headers":[{"level":2,"title":"代码分离","slug":"代码分离","link":"#代码分离","children":[{"level":3,"title":"多入口起点","slug":"多入口起点","link":"#多入口起点","children":[]},{"level":3,"title":"SplitChunks","slug":"splitchunks","link":"#splitchunks","children":[]},{"level":3,"title":"动态导入","slug":"动态导入","link":"#动态导入","children":[]}]},{"level":2,"title":"OneMoreThing","slug":"onemorething","link":"#onemorething","children":[]}],"git":{"createdTime":1683516320000,"updatedTime":1683871684000,"contributors":[{"name":"rayadaschn","email":"115447518+rayadaschn@users.noreply.github.com","commits":2}]},"readingTime":{"minutes":6.49,"words":1947},"filePathRelative":"Framework/webpack03.md","localizedDate":"2023年4月5日","excerpt":"<h1> Webpack 性能优化之分包</h1>\\n<p>Webpack 性能优化可分为俩方面：</p>\\n<ul>\\n<li>优化一：打包后的结果，上线时的性能优化。(比如分包处理、减小包体积、CDN 服务器等)</li>\\n<li>优化二：优化打包速度，开发或者构建时优化打包速度。(比如 exclude、cache-loader 等)</li>\\n</ul>\\n<p>实际上，Webpack 在配置 mode 时，已经自动为项目做了很多优化了。但是，也可以定制一些相关配置。</p>\\n<h2> 代码分离</h2>\\n<p>代码分离的主要目的是将代码分离到不同的 bundle 中，之后我们可以按需加载，或者并行加载这些文件。如默认情况下，所有的 JavaScrip t 代码（业务代码、第三方依赖、暂时没有用到的模块）在首页全部都加载，就会影响首页 的加载速度。代码分离可以分出更小的 bundle，以及控制资源加载优先级，提供代码的加载性能。</p>"}');export{e as data};
