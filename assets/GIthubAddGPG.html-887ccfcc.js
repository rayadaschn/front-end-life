const e=JSON.parse('{"key":"v-77fd187c","path":"/SystemRequirements/GIthubAddGPG.html","title":"GIthub添加GPG 签名","lang":"zh-CN","frontmatter":{"title":"GIthub添加GPG 签名","icon":"linux","date":"2023-03-09T00:00:00.000Z","article":false,"category":["linux"],"tag":["linux"],"star":true,"sticky":false},"headers":[{"level":2,"title":"安装 GPG 生成秘钥","slug":"安装-gpg-生成秘钥","link":"#安装-gpg-生成秘钥","children":[]},{"level":2,"title":"其它常用指令","slug":"其它常用指令","link":"#其它常用指令","children":[]},{"level":2,"title":"参考文档","slug":"参考文档","link":"#参考文档","children":[]}],"git":{"createdTime":1683516320000,"updatedTime":1683871684000,"contributors":[{"name":"rayadaschn","email":"115447518+rayadaschn@users.noreply.github.com","commits":2}]},"readingTime":{"minutes":6.76,"words":2027},"filePathRelative":"SystemRequirements/GIthubAddGPG.md","localizedDate":"2023年3月9日","excerpt":"<h1> GIthub 添加 GPG 签名</h1>\\n<p>出于参与开源项目或是保护自身开源项目的安全考虑，在 GIthub 分支保护中，有一项 GPG 签名的设置。</p>\\n<p>当然，这不是它诞生的主要目的。我们可以看看提交的 Commit 记录，发现就算是不一个账号，如果在本地的 <code>git config</code> 中设置相同的 user 信息，最终提交的用户就是一样的。这个在网上有一个很形象的比喻：你的同事获取到了你的 <code>git config</code> ，便可以假装你删库跑路了。哈哈哈哈</p>\\n<p>而签名就是可以证明，你是不是真正的代码提交者，所以可以用于可靠的代码审计和追踪了。（删库跑路也不行了）</p>"}');export{e as data};
