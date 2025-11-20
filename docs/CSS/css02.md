---
title: css 技巧
date: 2024-07-02
icon: style
category:
  - CSS
tag:
  - CSS
---

今天来实现一个微信聊天框的最小 demo。发现实际开发起来后，比没有想象的那么复杂。最终效果如下：

![微信聊天框](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202507022313903.png)

## 基本思想

设计上，主要分为聊天框主体、输入框以及消息追加模块。

- **核心流程**：用户输入消息 → 显示在聊天框 → 机器人延迟回复 → 回复显示在聊天框
- **交互方式**：点击发送按钮或按回车键都能发送消息
- **体验优化**：每次有新消息时，聊天框自动滚动到底部

1. 获取 DOM 元素

   ```js
   const chatBox = document.getElementById('chat-box')
   const chatInput = document.getElementById('chat-input')
   const sendBtn = document.getElementById('send-btn')
   ```

   获取聊天框、输入框和发送按钮的 DOM 元素，方便后续操作。

2. 消息追加函数

   ```js
   function appendMessage(text, sender) {
     const msgDiv = document.createElement('div')
     msgDiv.className = 'message ' + sender
     msgDiv.textContent = text
     chatBox.appendChild(msgDiv)
     chatBox.scrollTop = chatBox.scrollHeight
   }
   ```

   - 创建一个消息 `div`，设置内容和样式（区分用户和机器人）。
   - 把消息添加到聊天框。
   - 滚动条自动滑到底部（可改为平滑滚动）。

3. 机器人回复函数

   ```js
   function botReply(userMsg) {
     // 简单模拟机器人回复
     const replies = [ ... ];
     const reply = replies[Math.floor(Math.random() * replies.length)];
     setTimeout(() => appendMessage(reply, "bot"), 700);
   }
   ```

   - 随机选择一条预设回复，模拟机器人思考延迟后显示。

4. 发送按钮点击事件

   ```js
   sendBtn.onclick = () => {
     const text = chatInput.value.trim()
     if (!text) return
     appendMessage(text, 'user')
     chatInput.value = ''
     botReply(text)
   }
   ```

   - 获取输入框内容，非空时追加到聊天框（用户消息）。
   - 清空输入框。
   - 触发机器人回复。

5. 输入框回车事件

   ```js
   chatInput.addEventListener('keydown', (e) => {
     if (e.key === 'Enter') {
       sendBtn.onclick()
     }
   })
   ```

   - 监听输入框的回车键，按下时触发发送按钮的点击事件，实现“回车发送”。

## 最终代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>微信聊天模拟</title>
  </head>
  <body>
    <div class="chat-container">
      <div id="chat-box" class="chat-box"></div>
      <div class="input-area">
        <input type="text" id="chat-input" placeholder="请输入消息..." />
        <button id="send-btn">发送</button>
      </div>
    </div>
    <script>
      const chatBox = document.getElementById('chat-box')
      const chatInput = document.getElementById('chat-input')
      const sendBtn = document.getElementById('send-btn')

      function appendMessage(text, sender) {
        const msgDiv = document.createElement('div')
        msgDiv.className = 'message ' + sender
        msgDiv.textContent = text
        chatBox.appendChild(msgDiv)
        chatBox.scrollTop = chatBox.scrollHeight
      }

      function botReply(userMsg) {
        // 简单模拟机器人回复
        const replies = [
          '你好！有什么可以帮你的吗？',
          '你说得很有意思！',
          '请继续说~',
          '我在听哦~',
          '哈哈，这个问题我也想知道！',
        ]
        const reply = replies[Math.floor(Math.random() * replies.length)]
        setTimeout(() => appendMessage(reply, 'bot'), 700)
      }

      sendBtn.onclick = () => {
        const text = chatInput.value.trim()
        if (!text) return
        appendMessage(text, 'user')
        chatInput.value = ''
        botReply(text)
      }

      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          sendBtn.onclick()
        }
      })
    </script>
    <style>
      .chat-container {
        width: 360px;
        margin: 40px auto;
        border: 1px solid #e5e5e5;
        border-radius: 10px;
        background: #f7f7f7;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        display: flex;
        flex-direction: column;
        height: 600px;
      }

      .chat-box {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
      }

      .chat-box::-webkit-scrollbar {
        width: 0;
        background: transparent;
      }

      .message {
        max-width: 70%;
        padding: 10px 16px;
        border-radius: 18px;
        font-size: 15px;
        line-height: 1.5;
        word-break: break-all;
        display: inline-block;
      }

      .message.user {
        align-self: flex-end;
        background: #95ec69;
        color: #222;
        border-bottom-right-radius: 4px;
      }

      .message.bot {
        align-self: flex-start;
        background: #fff;
        color: #222;
        border-bottom-left-radius: 4px;
        border: 1px solid #e5e5e5;
      }

      .input-area {
        display: flex;
        padding: 12px;
        border-top: 1px solid #e5e5e5;
        background: #fff;
      }

      #chat-input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #e5e5e5;
        border-radius: 18px;
        outline: none;
        font-size: 15px;
      }

      #send-btn {
        margin-left: 8px;
        padding: 8px 18px;
        border: none;
        border-radius: 18px;
        background: #07c160;
        color: #fff;
        font-size: 15px;
        cursor: pointer;
        transition: background 0.2s;
      }

      #send-btn:hover {
        background: #06ad56;
      }
    </style>
  </body>
</html>
```
