title: React 之 Fiber 算法
icon: react
date: 2024-03-16
category:

- 框架
  tag:
- React
  sticky: false

Fiber 是 React 16 引入的，是 React 内部为了解决 异步可中断渲染 而设计的 核心架构和算法。

简单理解：Fiber 是 React 重新设计的虚拟 DOM 树结构，将一次复杂的更新任务拆成小块，每一块都是一个 Fiber 节点，允许中断和恢复，提高流畅性和优先级控制。

出现原因:

React 以前的 Reconciliation 是 递归调用，从父到子同步遍历、比对和更新。缺点：

1. 一次更新任务全部做完，中途不能打断
2. 如果组件树很深、节点很多，更新时间太长 ➔ 页面卡顿
3. 无法优先渲染高优先级任务

## Fiber 的实现机制

### 1. Fiber 节点结构

每个 **Fiber 节点** 都是 JS 对象，描述一个虚拟 DOM 节点。

关键属性：

```js
{
  type,            // 组件类型 (函数组件/类组件/div)
  key,             // diff 过程中用于识别
  child,           // 第一个子 Fiber
  sibling,         // 下一个兄弟 Fiber
  return,          // 父 Fiber
  stateNode,       // 对应的真实 DOM 或组件实例
  pendingProps,    // 新传入的 props
  memoizedState,   // state
  alternate,       // 上一次的 Fiber (用于 diff)
  flags,           // 标记需要做什么操作 (新增、删除等)
}
```

**特点：**

- 采用 **单链表结构**，可以灵活暂停、恢复。
- 每个 Fiber 对应一个虚拟 DOM 节点。

### 2. 工作流程核心 — **两个阶段**

#### 1) **Render Phase（协调阶段，可中断）**

**目标**：构建和比较 Fiber 树，找出需要更新的地方。

过程：

- 从根节点开始，深度优先遍历，创建新的 Fiber 节点。
- 每处理完一个 Fiber，浏览器有空闲时间就执行下一个。
- 使用 `requestIdleCallback` 或 `scheduler` 做时间切片。

**特点**：

- **可以中断**
- 产生“EffectList” ➔ 记录副作用（如需要插入、删除哪些 DOM）

#### 2) **Commit Phase（提交阶段，不可中断）**

**目标**：根据 EffectList 操作真实 DOM。

过程：

- 执行 DOM 插入、删除、更新
- 执行生命周期 hooks（比如 `componentDidMount`）

**特点**：

- **同步执行，快速完成，避免页面闪烁**

### 3. 时间切片机制

利用浏览器 **requestIdleCallback / MessageChannel / Scheduler** 判断是否需要让出主线程。

React 会给每个更新分配一个 **优先级（Lane）**，例如：

- 用户输入 ➔ 高优先级
- 动画 ➔ 高优先级
- 数据请求渲染 ➔ 低优先级

这样可以**先处理高优先级任务**，空闲再渲染低优先级任务。

## 流程总结图

```plaintext
    更新开始
       ↓
   Render Phase (可中断)
       ↓
   构建 Fiber 树 + EffectList
       ↓
   Commit Phase (同步)
       ↓
   更新真实 DOM
```

## 具体示例理解

假设你有一个页面：

```jsx
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>Add</button>
      <BigList /> // 渲染一个大列表
    </div>
  )
}
```

`BigList` 里面有几千个 `<li>`。

1. 点击按钮后，触发 `setCount`，更新开始。
2. React 会：

   - 从根节点开始，创建新的 Fiber 树。
   - 先走到 `<h1>` 和 `<button>`，快速更新。
   - **遇到 BigList，Fiber 会一行一行拆分小任务**，如果当前帧时间不够，停下来，下一帧再继续。

3. 浏览器空闲 ➔ Fiber 继续处理 BigList。
