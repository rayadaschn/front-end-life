---
title: MCP 落地实录
icon: javascript
date: 2026-01-24
category:
  - javascript
tag:
  - javascript

sticky: false
---

距离项目上线已经过去数月，回头看当时的一些技术选型，现在已经出现了更成熟、更优雅的解决方案。本文记录一次 MCP（Model Context Protocol）在真实项目中的落地实践，不涉及具体业务细节，主要是对当时的设计思路与工程经验做一次复盘总结。

## 一、明确目标：AI 在业务中的真实价值

虽然现在有大量 KOL 在宣传 AI Coding、AI Agent 的生产力提升，但在真实业务中，很多时候的感受是：

> 工具很强，但不知道该用来干什么。

根本原因其实不在于模型能力，而在于**目标不清晰**。

AI 在业务中的核心价值并不是“替代人类决策”，而是：

> **提炼重复性工作、结构化隐性知识、降低协作成本。**

如果一个业务流程本身就不清楚、不稳定、不标准化，那么即使引入再强的模型，也只能得到一个“看起来很聪明，但并不可靠”的系统。

在我们项目中，AI 的目标非常明确：

- 有大量重复但规则明确的操作
- 数据来源分散，需要统一调度
- 人工执行成本高，但逻辑可程序化

这类场景，本质上非常适合 Agent + Tool 的模式。

## 二、为什么选择 ReAct 工作流

在 Agent 设计上，我们最终选择了 ReAct（Reason + Act）模式，而不是一次性生成结果。

ReAct 的核心思想很简单：

> 模型不是一步到位给答案，而是：
> 思考 → 调用工具 → 观察结果 → 再思考 → 再行动

这和真实人类解决复杂问题的方式非常接近。

### 为什么不直接让模型输出最终结果？

因为在工程实践中，你很快会发现几个问题：

1. 模型不知道系统真实状态（数据在哪、接口返回什么）
2. 大量的任务，一步生成很容易产生幻觉
3. 无法中途插入校验、审计、日志

而 ReAct 模式天然具备：

- 可观测性（每一步都有 Thought / Action / Observation）
- 可调试性（出错知道是模型问题还是工具问题）
- 可控性（每一步都在你掌控之下）

这也是后来大部分 Agent 框架，最终都走向类似结构的原因。

## 三、MCP 在架构中的角色

如果说 ReAct 是“思维模式”，那 MCP 就是“工程协议”。

在我们的设计中：

- LLM 负责推理（Reason）
- MCP Server 负责能力暴露
- MCP Client 负责能力调用与调度

也就是一句话总结：

> **模型负责想，系统负责做。**

MCP 把这两件事通过一个标准协议解耦开来。

### MCP 的两个核心概念

- **MCP Server**：提供能力

  - Tool（可执行函数）
  - Resource（结构化数据）
  - Prompt（模板上下文）

- **MCP Client**：消费能力

  - 连接 Server
  - 列出工具
  - 调用工具
  - 把结果喂回模型

这层抽象的价值在于：
**模型完全不需要知道真实系统的存在，只需要知道“我有哪些工具可以用”。**

## 四、MCP Client 实际实现

首先初始化 MCP Client，并配置好模型连接。

我们这里使用 OpenAI SDK 来连接大语言模型，主要原因是：

- 接口成熟
- 工具调用协议清晰
- 和 MCP 的 function schema 非常贴合

> 实际经验：
> 如果你本地部署的是 Qwen 这类模型，往往需要额外做一层 adapter，把它们的 function call 格式转成 OpenAI 风格。

### 基础连接示例

```js
import OpenAI from 'openai'
import { Client } from '@modelcontextprotocol/sdk/client'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio'

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY })

// 连接 MCP Server
const transport = new StdioClientTransport({
  command: 'node',
  args: ['./my-mcp-server.js'],
})

const mcp = new Client({ name: 'my-client', version: '1.0.0' })
await mcp.connect(transport)

// 获取工具
const tools = await mcp.listTools()

// 注入给模型
const completion = await openai.chat.completions.create({
  model: 'gpt-4.1',
  messages: [{ role: 'user', content: '帮我查一下天气' }],
  tools: tools.map((t) => ({
    type: 'function',
    function: {
      name: t.name,
      description: t.description,
      parameters: t.inputSchema,
    },
  })),
})
```

这一步本质上做了三件事：

1. MCP Client 连接 MCP Server
2. 拉取工具元信息
3. 转成 LLM 可理解的 function schema

从模型视角看，它根本不知道 MCP 的存在，只觉得自己“突然多了一些函数可以调用”。

## 五、ReAct 在真实工程中的执行循环

理论上的 ReAct 流程是：

```md
User
↓
LLM (Thought)
↓
选择 Tool
↓
执行 Tool
↓
Observation
↓
LLM (下一步 Thought)
```

工程上，我们需要做的是：

- 维护 message history
- 解析 tool_calls
- 执行 MCP tool
- 把结果继续塞回 messages

### 一个最小可运行版本

```js
const systemPrompt = `
You are a ReAct agent.

Use format:
Thought:
Action:
Action Input:
Observation:
Final:
`

let messages = [
  { role: 'system', content: systemPrompt },
  { role: 'user', content: '现在几点？' },
]

// ReAct Loop
for (let i = 0; i < 5; i++) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4.1',
    messages,
    tools,
  })

  const msg = res.choices[0].message

  // 最终结果
  if (msg.content?.includes('Final:')) {
    console.log(msg.content)
    break
  }

  // 调用工具
  if (msg.tool_calls) {
    const call = msg.tool_calls[0]
    const args = JSON.parse(call.function.arguments)

    const result = await mcp.callTool(call.function.name, args)

    messages.push(msg)
    messages.push({
      role: 'tool',
      tool_call_id: call.id,
      content: result.content[0].text,
    })
  }
}
```

这一段代码本质上就是一个最原始的 **Agent Runtime**。

类似的产品，底层做的事情也无非就是：

- 更复杂的状态机
- 更精细的 memory 管理
- 更多类型的 tool / node

## 六、真实项目中的几个关键经验

真正把 MCP + Agent 跑进真实项目之后，会发现很多问题都不是“模型能力问题”，而是如何工程化落地，如何推广团队使用。

1. 开源 MCP Server 远远不够用，必须自定义工具。

   目前社区里现成的 MCP Server 提供的工具并不完备，无法直接支撑真实业务。在实际项目中，几乎不可避免地需要自定义一些业务工具。这块比较考验统筹能力。

2. Agent 需要结构化的提示词

   一开始是自己定结构化提示词的规范，后面发现这是其实 AI 自己做的更好。但是规范还是要有，就例如现在流行的 Skill。

3. 不要一开始就追求完美 Agent，先跑起来再说

   在工程化落地过程中，一个非常重要的心态转变是：**先做出最小可用 Agent（MVP），而不是设计一个完美系统。**
