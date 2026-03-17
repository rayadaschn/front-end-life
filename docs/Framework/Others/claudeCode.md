---
title: Claude Code 原理
icon: AI
date: 2026-03-17

category:
  - 框架
tag:
  - AI
star: false
sticky: false
---

从零开始构建一个 Claude Code，旨在梳理 Agent 的核心原理。

## 智能体循环

智能体循环其实就是 ReAct Agent 模式。

核心结构：

```md
用户 → LLM → 工具执行 → 结果 → 回到 LLM → ...（循环）
```

直到：`stop_reason != "tool_use"`，才结束循环。

![ReAct Agent 模式](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202603172058430.png)

### 工作原理

1. 初始化消息

   ```js
   const messages = [{ role: 'user', content: query }]
   ```

2. 调用 LLM

   ```js
   const response = client.messages.create({
     model,
     system,
     message,
     tools,
     max_tokens,
   })
   ```

3. 追加响应结果，检查 `stop_reason` 判断是否结束

   ```js
   messages.push({ role: 'assistant', content: response.content })

   if (response.stop_reason != 'tool_use') return
   ```

4. 执行每个工具调用, 收集结果, 作为 user 消息追加。回到第 2 步。

   ```js
   const results = []

   for (const block of response.content) {
     if (block.type === 'tool_use') {
       const output = runBash(block.input.command)

       results.push({
         type: 'tool_result',
         tool_use_id: block.id,
         content: output,
       })
     }
   }

   messages.push({
     role: 'user',
     content: results,
   })
   ```

### 最终代码

```js
import { execSync } from 'child_process'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const MODEL = 'gpt-4.1' // 或你用的模型

// 一个最简单的 bash 工具
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'run_bash',
      description: 'Execute a shell command',
      parameters: {
        type: 'object',
        properties: {
          command: {
            type: 'string',
            description: 'Shell command to run',
          },
        },
        required: ['command'],
      },
    },
  },
]

// 执行 bash
function runBash(command) {
  try {
    const result = execSync(command, { encoding: 'utf-8' })
    return result
  } catch (err) {
    return err.message
  }
}

// Agent Loop
export async function agentLoop(query) {
  const messages = [{ role: 'user', content: query }]

  while (true) {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages,
      tools: TOOLS,
    })

    const msg = response.choices[0].message

    // 追加 assistant 回复
    messages.push(msg)

    // 没有工具调用则直接结束
    if (!msg.tool_calls) {
      return msg.content
    }

    // 执行工具
    const toolResults = []

    for (const toolCall of msg.tool_calls) {
      if (toolCall.function.name === 'run_bash') {
        const args = JSON.parse(toolCall.function.arguments)

        const output = runBash(args.command)

        toolResults.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: output,
        })
      }
    }

    // 把工具结果喂回模型
    messages.push(...toolResults)
  }
}
```

### 测试

```js
import { agentLoop } from './agent.js'

const result = await agentLoop(
  'Create a file called hello.py that prints "Hello, World!"'
)

console.log(result)
```

## 工具使用 Tool Use

工具调用会有一个问题，就是不能保证 bash 工具执行是否成功，并且 shell 命令的调用并不可控，所以需要对工具进行一些改造。

![tool 工具调用](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202603172113455.png)

dispatch map 本质是一个对象：`{ toolName: handlerFunction }`。

### dispatch 工作原理

1. 每个工具有一个处理函数。路径沙箱防止逃逸工作区。

   ```js
   import path from 'path'
   import fs from 'fs/promises'

   const WORKDIR = path.resolve(process.cwd())

   // 防止路径逃逸
   function safePath(p) {
     const resolved = path.resolve(WORKDIR, p)

     if (!resolved.startsWith(WORKDIR)) {
       throw new Error(`Path escapes workspace: ${p}`)
     }

     return resolved
   }

   // 读取文件
   export async function runRead(filePath, limit = null) {
     const fullPath = safePath(filePath)

     const text = await fs.readFile(fullPath, 'utf-8')
     let lines = text.split('\n')

     if (limit && limit < lines.length) {
       lines = lines.slice(0, limit)
     }

     return lines.join('\n').slice(0, 50000)
   }
   ```

2. dispatch map 将工具名映射到处理函数。

   ```js
   // toolHandlers.js
   import { runRead } from './tools/read.js'
   import { runWrite } from './tools/write.js'
   import { runEdit } from './tools/edit.js'
   import { runBash } from './tools/bash.js'

   export const TOOL_HANDLERS = {
     bash: async ({ command }) => runBash(command),

     read_file: async ({ path, limit }) => runRead(path, limit),

     write_file: async ({ path, content }) => runWrite(path, content),

     edit_file: async ({ path, old_text, new_text }) =>
       runEdit(path, old_text, new_text),
   }
   ```

3. 加入到 Agent 循环体中(完全不变):

   ```js
   import { TOOL_HANDLERS } from './toolHandlers.js'

   async function handleResponse(response) {
     const results = []

     for (const block of response.content) {
       if (block.type === 'tool_use') {
         const handler = TOOL_HANDLERS[block.name]

         let output
         if (handler) {
           output = await handler(block.input)
         } else {
           output = `Unknown tool: ${block.name}`
         }

         results.push({
           type: 'tool_result',
           tool_use_id: block.id,
           content: output,
         })
       }
     }

     return results
   }
   ```

## 增加 ToDoWrite 提醒系统

虽然基本的循环调用已经实现了，但是在多步骤任务中，大模型很容易丢失进度：

1. 重复已经完成的步骤
2. 跳过关键步骤
3. 越做越偏

尤其是对话变长之后：

1. 工具返回结果不断堆积
2. 上下文被挤满
3. 系统提示逐渐失效

因此需要引入一个带状态的 **Todo 管理器（TodoManager）**，强制模型按步骤执行。

```sql
User → LLM → Tools（包含 todo）
             ↑       ↓
         tool_result（含 todo 状态）
                ↓
        TodoManager（状态机）
```

核心机制：

- 任务有状态（`pending` / `in_progress` / `done`）
- 同一时间只能有一个 `in_progress`
- 如果模型太久不更新 `todo`，则自动提醒

### ToDoWrite 实现原理

1. TodoManager 存储带状态的项目。同一时间只允许一个 in_progress。

   ```js
   class TodoManager {
     constructor() {
       // 存储当前所有任务
       this.items = []
     }

     /**
      * 更新 todo 列表
      * @param {Array} items - LLM 传入的任务数组
      * @returns {string} 渲染后的文本（返回给 LLM）
      */
     update(items) {
       // 存放“清洗后的任务”
       const validated = []

       // 统计当前有多少个任务是 in_progress
       let inProgressCount = 0

       // 遍历 LLM 传入的任务
       for (const item of items) {
         // 如果没写 status，默认是 pending
         const status = item.status || 'pending'

         // 统计正在进行的任务数量
         if (status === 'in_progress') {
           inProgressCount++
         }

         // 只保留我们允许的字段（防止 LLM 乱传）
         validated.push({
           id: item.id, // 任务 id
           text: item.text, // 任务描述
           status: status, // 状态
         })
       }

       // 核心约束：只能有一个任务在进行中
       if (inProgressCount > 1) {
         throw new Error('Only one task can be in_progress')
       }

       // 保存当前状态
       this.items = validated

       // 返回渲染后的文本（给 LLM 看）
       return this.render()
     }

     /**
      * 把任务渲染成文本
      * 例如：
      * [ ] task A
      * [>] task B
      * [x] task C
      */
     render() {
       return this.items
         .map((item) => {
           let mark

           // 根据状态选择标记
           switch (item.status) {
             case 'done':
               mark = '[x]'
               break
             case 'in_progress':
               mark = '[>]'
               break
             default:
               mark = '[ ]'
           }

           return `${mark} ${item.text}`
         })
         .join('\n')
     }
   }
   ```

2. TODO 的工具注册

   ```js
   const TODO = new TodoManager()

   const TOOL_HANDLERS = {
     // ...其他工具

     todo: async ({ items }) => {
       return TODO.update(items)
     },
   }
   ```

3. Nag Reminder（自动提醒机制）。如果模型连续 3 轮没有调用 todo，系统自动插入提醒：

   ```js
   function injectReminder({ roundsSinceTodo, messages }) {
     if (roundsSinceTodo >= 3 && messages.length > 0) {
       const last = messages[messages.length - 1]

       if (last.role === 'user' && Array.isArray(last.content)) {
         last.content.unshift({
           type: 'text',
           text: '<reminder>Update your todos.</reminder>',
         })
       }
     }
   }
   ```

### ToDoWrite 基本实现

```js
let roundsSinceTodo = 0

async function agentLoop(messages) {
  while (true) {
    injectReminder({ roundsSinceTodo, messages })

    const response = await callLLM(messages)

    if (response.tool_call) {
      const { name, args } = response.tool_call

      const result = await TOOL_HANDLERS[name](args)

      messages.push({
        role: 'tool',
        content: result,
      })

      if (name === 'todo') {
        // 当前轮执行了 todo，重置计数
        roundsSinceTodo = 0
      } else {
        // 没有执行 todo，增加计数
        roundsSinceTodo++
      }
    } else {
      break
    }
  }
}
```

## 子智能体 Subagents

当智能体运行时间越长，messages 数组会越来越大。这时可以考虑引入子智能体（Subagent）来分担任务。

```sql
Parent agent                     Subagent
+------------------+             +------------------+
| messages=[...]   |             | messages=[]      | ← 全新上下文
|                  |  dispatch   |                  |
| tool: task       | ----------> | while tool_use:  |
|   prompt="..."   |             |   call tools     |
|                  |  summary    |   append results |
|   result="..."   | <---------- | return last text |
+------------------+             +------------------+
```

核心原理是:

- 父智能体：保持干净上下文
- 子智能体：负责“脏活累活”
- 子智能体结束后：上下文直接丢弃

### 子智能体实现

1. 工具定义: 父智能体拥有一个额外的 `task` 工具，子智能体不能再生成子任务（防止递归）。

   ```js
   const CHILD_TOOLS = [
      { name: "read_file", ... },
      { name: "run_command", ... }
    ];

   const PARENT_TOOLS = [
     ...CHILD_TOOLS,
     {
       name: 'task',
       description: '生成一个具有全新上下文的 Subagent 来完成一个子任务',
       input_schema: {
         type: 'object',
         properties: {
           prompt: { type: 'string' },
         },
         required: ['prompt'],
       },
     },
   ]

    // 设计上：父智能体不能主动使用这些工具，存在是为了复用工具
   if (agentType === "parent" && tool !== "task") {
      throw new Error("Parent cannot call this tool");
    }

   ```

2. 子智能体执行逻辑: 子智能体以 `messages=[]` 启动, 运行自己的循环。只有最终文本返回给父智能体。

   ```js
   async function runSubagent(prompt) {
     let subMessages = [{ role: 'user', content: prompt }]

     let finalResponse = null

     for (let i = 0; i < 30; i++) {
       // safety limit
       const response = await client.messages.create({
         model: MODEL,
         system: SUBAGENT_SYSTEM,
         messages: subMessages,
         tools: CHILD_TOOLS,
         max_tokens: 8000,
       })

       finalResponse = response

       // 保存 assistant 输出
       subMessages.push({
         role: 'assistant',
         content: response.content,
       })

       // 如果没有工具调用，结束
       if (response.stop_reason !== 'tool_use') {
         break
       }

       let results = []

       for (const block of response.content) {
         if (block.type === 'tool_use') {
           const handler = TOOL_HANDLERS[block.name]

           if (!handler) continue

           const output = await handler(block.input)

           results.push({
             type: 'tool_result',
             tool_use_id: block.id,
             content: String(output).slice(0, 50000),
           })
         }
       }

       // 把工具结果喂回模型
       subMessages.push({
         role: 'user',
         content: results,
       })
     }

     // 提取最终文本
     const text = (finalResponse.content || [])
       .filter((b) => b.type === 'text')
       .map((b) => b.text)
       .join('')

     return text || '(no summary)'
   }
   ```
