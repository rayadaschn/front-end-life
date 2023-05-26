const t=JSON.parse('{"key":"v-55e1fb64","path":"/JavaScript/other04.html","title":"利用 husky 进行 git 提交前检查","lang":"zh-CN","frontmatter":{"title":"利用 husky 进行 git 提交前检查","icon":"javascript","date":"2023-05-24T00:00:00.000Z","category":["javascript"],"tag":["工程化"]},"headers":[{"level":2,"title":"工具介绍","slug":"工具介绍","link":"#工具介绍","children":[]},{"level":2,"title":"配置过程","slug":"配置过程","link":"#配置过程","children":[]},{"level":2,"title":"Husky 配置实战","slug":"husky-配置实战","link":"#husky-配置实战","children":[]}],"git":{"createdTime":1684889370000,"updatedTime":1685080607000,"contributors":[{"name":"rayadaschn","email":"115447518+rayadaschn@users.noreply.github.com","commits":3}]},"readingTime":{"minutes":7.73,"words":2320},"filePathRelative":"JavaScript/other04.md","localizedDate":"2023年5月24日","excerpt":"<h1> 利用 husky 进行 git 提交前检查</h1>\\n<p>本文将系统梳理一遍，在新项目中配置 Husky 对 git 进行检查的过程。在最后实战几个场景。</p>\\n<h2> 工具介绍</h2>\\n<ul>\\n<li>\\n<p>Husky 是 git hook 工具，<strong>它允许我们轻松地处理 Git Hooks 并在提交代码时运行我们想要的脚本</strong>。 它的工作原理是在我们的 package.json 文件中加入一个对象，配置 Husky 来运行我们指定的脚本。 之后，Husky 会管理我们的脚本将在 Git 生命周期的哪个阶段运行。</p>\\n</li>\\n<li>\\n<p>lint-staged：<strong>是一个前端文件过滤的工具</strong>。 是一个仅仅过滤出 Git 代码暂存区文件（被 committed 的文件）的工具。 Lint-staged 仅仅是文件过滤器，不会帮你格式化任何东西。</p>\\n</li>\\n</ul>"}');export{t as data};
