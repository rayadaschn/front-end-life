const e=JSON.parse('{"key":"v-230f3e94","path":"/Framework/Webpack/webpack04.html","title":"Webpack 性能优化之文件压缩","lang":"zh-CN","frontmatter":{"title":"Webpack 性能优化之文件压缩","icon":"build","date":"2023-04-20T00:00:00.000Z","category":["框架"],"tag":["webpack"],"star":false,"sticky":false},"headers":[{"level":2,"title":"Terser JS 压缩","slug":"terser-js-压缩","link":"#terser-js-压缩","children":[]},{"level":2,"title":"CSS 压缩","slug":"css-压缩","link":"#css-压缩","children":[{"level":3,"title":"usedExportd 配置","slug":"usedexportd-配置","link":"#usedexportd-配置","children":[]},{"level":3,"title":"sideEffects 副作用配置","slug":"sideeffects-副作用配置","link":"#sideeffects-副作用配置","children":[]},{"level":3,"title":"CSS 实现 Tree Shaking","slug":"css-实现-tree-shaking","link":"#css-实现-tree-shaking","children":[]}]},{"level":2,"title":"HTML 压缩","slug":"html-压缩","link":"#html-压缩","children":[]}],"git":{"createdTime":1703991106000,"updatedTime":1703991106000,"contributors":[{"name":"rayadaschn","email":"115447518+rayadaschn@users.noreply.github.com","commits":1}]},"readingTime":{"minutes":8.78,"words":2634},"filePathRelative":"Framework/Webpack/webpack04.md","localizedDate":"2023年4月20日","excerpt":"<h1> Webpack 性能优化之文件压缩</h1>\\n<h2> Terser JS 压缩</h2>\\n<p>在 webpack 的优化(Optimization)选项中，还有俩个选择：</p>\\n<ul>\\n<li><code>optimization.minimize</code>: Boolean，告知 webpack 是否使用 <a href=\\"https://webpack.docschina.org/plugins/terser-webpack-plugin/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">TerserPlugin</a> 或其它在 <a href=\\"https://webpack.docschina.org/configuration/optimization/#optimizationminimizer\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"><code>optimization.minimizer</code></a>定义的插件压缩 bundle。</li>\\n<li><code>optimization.minimizer</code>: <code>[TerserPlugin]</code> 或 <code>[function (compiler)]</code>，允许你通过提供一个或多个定制过的 <a href=\\"https://webpack.docschina.org/plugins/terser-webpack-plugin/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">TerserPlugin</a> 实例，覆盖默认压缩工具(minimizer)。</li>\\n</ul>"}');export{e as data};