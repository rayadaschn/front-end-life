---
title: 批量修复 git 分支问题
icon: git
date: 2024-11-16
category:
  - javascript
tag:
  - javascript
---

最新需要批量修复 git 分支问题，记录一下。

需求是有很多项目分支存在一些共性 bug，需要批量修复这些分支。每个分支都 `cherry-pick` 或者 `merge` 的话又太费时间。因此有了这个脚本实现，顺便也学习一下 bash 的一些语法。

最终效果如下,有合并进度条、状态表格等提示输出：

```bash
=========================================
        🌿 Starting the Merge Process
=========================================
[#############                           ]  33% ➜ Switching to feature/branch1...
[#############                           ]  33% ➜ Merging fix/common-issue into feature/branch1...
 ✔ Successfully merged into feature/branch1.
 ➜ Attempting to push feature/branch1 to remote...
 ✘ Failed to push feature/branch1 to remote.
[##########################              ]  66% ➜ Switching to feature/branch2...
[##########################              ]  66% ➜ Merging fix/common-issue into feature/branch2...
 ✘ Merge conflict detected in feature/branch2!
 ➜ Aborting merge and restoring clean working directory...
[########################################] 100% ➜ Switching to feature/branch3...
[########################################] 100% ➜ Merging fix/common-issue into feature/branch3...
 ✔ Successfully merged into feature/branch3.
 ➜ Attempting to push feature/branch3 to remote...
 ✘ Failed to push feature/branch3 to remote.
=========================================
Merge Summary:
=========================================
Branch                    | Status
=========================================
feature/branch1           | ✘ PushFailed
feature/branch2           | ✘ Conflict
feature/branch3           | ✘ PushFailed
=========================================
 ➜ Returning to the fix branch...
=========================================
Merge process completed.
```

## 实现依据

1. 建立一个 `fix/common-issue` 修复分支，用于修复所有项目的共性 bug。
2. 将 `fix/common-issue` 分支的修复内容批量 `merge` 到待修复的项目分支上。

## 实现脚本

> 在文末还有指令化脚本，方便直接使用

```bash
#!/bin/bash

# 已修复分支
fix_branch="fix/common-issue"

# 目标分支列表
target_branches=("feature/branch1" "feature/branch2" "feature/branch3")


# --------------- 以下为脚本内容, 无需变更 ---------------

# 分支状态记录，替代关联数组
branch_status_file=$(mktemp)

# 图标和符号定义
CHECK_MARK="✔"
CROSS_MARK="✘"
ARROW="➜"
SEPARATOR="========================================="
PROGRESS_BAR_WIDTH=40

# 动态进度条
progress_bar() {
  local progress=$1
  local total=$2

  # 避免除以零
  if [ "$total" -le 0 ]; then
    printf "\r[%-${PROGRESS_BAR_WIDTH}s] %3d%%" "$(printf "%0.s " $(seq 1 $PROGRESS_BAR_WIDTH))" 0
    return
  fi

  local percentage=$(( progress * 100 / total ))
  local num_hashes=$(( progress * PROGRESS_BAR_WIDTH / total ))
  local num_spaces=$(( PROGRESS_BAR_WIDTH - num_hashes ))

  printf "\r[%-${PROGRESS_BAR_WIDTH}s] %3d%%" "$(printf "%0.s#" $(seq 1 $num_hashes))" $percentage
}

# 打印分隔线
print_separator() {
  echo "$SEPARATOR"
}

# 打印标题
print_title() {
  echo "$SEPARATOR"
  echo "        🌿 Starting the Merge Process"
  echo "$SEPARATOR"
}

# 确保修复分支已存在
if ! git checkout $fix_branch >/dev/null 2>&1; then
  echo " ${CROSS_MARK} Failed to switch to $fix_branch. Please ensure the branch exists."
  exit 1
fi

# 打印开始信息
print_title

# 总分支数量
total_branches=${#target_branches[@]}

# 防止 total_branches 为 0
if [ "$total_branches" -eq 0 ]; then
  echo " ${CROSS_MARK} No target branches specified. Exiting."
  exit 1
fi

current_branch_index=0

# 遍历目标分支，逐一合并修复
for branch in "${target_branches[@]}"; do
  current_branch_index=$((current_branch_index + 1))

  # 更新动态进度条
  progress_bar $current_branch_index $total_branches
  echo " ${ARROW} Switching to $branch..."

  if git checkout $branch >/dev/null 2>&1; then
    echo " ${ARROW} Updating $branch to the latest from remote..."
    git pull --rebase origin $branch >/dev/null 2>&1 || {
      echo " ${CROSS_MARK} Failed to update $branch. Skipping merge."
      echo "$branch:UpdateFailed" >> "$branch_status_file"
      continue
    }
  else
    echo " ${CROSS_MARK} Failed to switch to $branch."
    echo "$branch:CheckoutFailed" >> "$branch_status_file"
    continue
  fi

  progress_bar $current_branch_index $total_branches
  echo " ${ARROW} Merging $fix_branch into $branch..."

  if git merge $fix_branch --no-ff -m "Merge $fix_branch into $branch" >/dev/null 2>&1; then
    echo " ${CHECK_MARK} Successfully merged into $branch."
    echo " ${ARROW} Attempting to push $branch to remote..."
    if git push origin $branch >/dev/null 2>&1; then
      echo " ${CHECK_MARK} Successfully pushed $branch to remote."
      echo "$branch:Merged" >> "$branch_status_file"
    else
      echo " ${CROSS_MARK} Failed to push $branch to remote."
      echo "$branch:PushFailed" >> "$branch_status_file"
    fi
  else
    echo " ${CROSS_MARK} Merge conflict detected in $branch!"
    echo "$branch:Conflict" >> "$branch_status_file"
    echo " ${ARROW} Aborting merge and restoring clean working directory..."
    git merge --abort >/dev/null 2>&1
  fi
done

# 打印汇总表格
print_separator
echo "Merge Summary:"
print_separator
printf "%-25s | %-15s\n" "Branch" "Status"
print_separator

while IFS=: read -r branch status; do
  case "$status" in
    Merged)
      printf "%-25s | %-15s\n" "$branch" "$CHECK_MARK Merged"
      ;;
    Conflict)
      printf "%-25s | %-15s\n" "$branch" "$CROSS_MARK Conflict"
      ;;
    CheckoutFailed)
      printf "%-25s | %-15s\n" "$branch" "$CROSS_MARK CheckoutFailed"
      ;;
    UpdateFailed)
      printf "%-25s | %-15s\n" "$branch" "$CROSS_MARK UpdateFailed"
      ;;
    PushFailed)
      printf "%-25s | %-15s\n" "$branch" "$CROSS_MARK PushFailed"
      ;;
    *)
      printf "%-25s | %-15s\n" "$branch" "$CROSS_MARK Unknown"
      ;;
  esac
done < "$branch_status_file"

print_separator

# 清理修复分支
echo " ${ARROW} Returning to the fix branch..."
git checkout $fix_branch >/dev/null 2>&1

# 删除临时文件
rm -f "$branch_status_file"

print_separator
echo "Merge process completed."
```

## 脚本解释

### **变量定义**

```bash
fix_branch="fix/common-issue"
target_branches=("feature/branch1" "feature/branch2" "feature/branch3")
```

- **`fix_branch`**：修复分支名称，源分支。
- **`target_branches`**：目标分支列表，修复分支需要合并到这些分支中。

### **脚本工具和常量**

```bash
branch_status_file=$(mktemp)
CHECK_MARK="✔"
CROSS_MARK="✘"
ARROW="➜"
SEPARATOR="========================================="
PROGRESS_BAR_WIDTH=40
```

- **`mktemp`**：创建一个临时文件，用于记录分支状态。
- **图标和符号**：用于美化输出，便于快速识别操作结果。
- **`PROGRESS_BAR_WIDTH`**：动态进度条宽度。

### **函数定义**

#### **动态进度条**

```bash
progress_bar() {
  local progress=$1
  local total=$2

  if [ "$total" -le 0 ]; then
    printf "\r[%-${PROGRESS_BAR_WIDTH}s] %3d%%" "$(printf "%0.s " $(seq 1 $PROGRESS_BAR_WIDTH))" 0
    return
  fi

  local percentage=$(( progress * 100 / total ))
  local num_hashes=$(( progress * PROGRESS_BAR_WIDTH / total ))
  local num_spaces=$(( PROGRESS_BAR_WIDTH - num_hashes ))

  printf "\r[%-${PROGRESS_BAR_WIDTH}s] %3d%%" "$(printf "%0.s#" $(seq 1 $num_hashes))" $percentage
}
```

- **参数说明**：
  - `progress`：当前进度（完成数）。
  - `total`：总进度。
- **作用**：根据当前进度和总进度，动态生成进度条。
- **实现逻辑**：
  1. 计算完成的百分比 `percentage`。
  2. 生成相应数量的 `#` 和空格来填充进度条。

`printf` 这里的语法解释：

```bash
printf "\r[%-${PROGRESS_BAR_WIDTH}s] %3d%%" "$(printf "%0.s#" $(seq 1 $num_hashes))" $percentage
```

**功能**：在同一行动态更新进度条。  
**核心逻辑**：

1. `\r`：回到当前行的起始位置，覆盖之前的输出。
2. `[%-${PROGRESS_BAR_WIDTH}s]`：用于格式化进度条，占用固定宽度。
3. `%3d%%`：显示当前完成的百分比（右对齐，宽度为 3）。
4. `$(...)`：子命令替换，用于生成进度条的内容。

对于 **`%-${PROGRESS_BAR_WIDTH}s`** 的拆分理解：

- **`%-...s`**：字符串左对齐，宽度由 `${PROGRESS_BAR_WIDTH}` 决定。
- **填充内容**：

  ```bash
  "$(printf "%0.s#" $(seq 1 $num_hashes))"
  ```

  这一部分生成了进度条中的 `#`。

  1. **`seq 1 $num_hashes`**：
     - 生成从 `1` 到 `$num_hashes` 的序列。例如，如果 `$num_hashes=10`，则生成 `1 2 3 4 5 6 7 8 9 10`。
  2. **`printf "%0.s#"`**：
     - 对每个数字，输出一个 `#`。
     - **`%0.s`** 的作用：忽略传入值，只输出固定内容 `#`。
  3. **最终结果**：
     - 若 `$num_hashes=10`，生成字符串 `##########`。

- **剩余空格**：总宽度为 `PROGRESS_BAR_WIDTH`，`#` 的数量为 `$num_hashes`，剩余部分用空格填充。
- `%-${PROGRESS_BAR_WIDTH}s` 会自动填充不足的部分为空格。
- **显示百分比**

  ```bash
  %3d%%
  ```

  - `%3d`：整数，宽度为 3（不足时左侧补空格）。
  - `%%`：输出百分号。

  例如：

  1. 如果 `$percentage=42`，输出 `42%`。
  2. 如果 `$percentage=100`，输出 `100%`。

此外，因为开头有 `\r`，每次打印时会覆盖之前的内容，显示动态进度条。

#### **打印分隔线和标题**

```bash
print_separator() {
  echo "$SEPARATOR"
}

print_title() {
  echo "$SEPARATOR"
  echo "        🌿 Starting the Merge Process"
  echo "$SEPARATOR"
}
```

### **核心逻辑**

#### **切换到修复分支**

```bash
if ! git checkout $fix_branch >/dev/null 2>&1; then
  echo " ${CROSS_MARK} Failed to switch to $fix_branch. Please ensure the branch exists."
  exit 1
fi
```

- 使用 `git checkout` 切换到修复分支。如果失败，打印错误并退出脚本。

#### **合并循环**

```bash
for branch in "${target_branches[@]}"; do
  ...
done
```

**步骤**：

1. **动态更新进度条**：

   ```bash
   progress_bar $current_branch_index $total_branches
   ```

   显示当前分支的处理进度。

2. **切换分支**：

   ```bash
   if ! git checkout $branch >/dev/null 2>&1; then
     echo "$branch:CheckoutFailed" >> "$branch_status_file"
     continue
   fi
   ```

   如果切换失败，记录状态并跳过。

3. **合并修复分支**：

   ```bash
   if git merge $fix_branch --no-ff -m "Merge $fix_branch into $branch" >/dev/null 2>&1; then
     ...
   else
     git merge --abort >/dev/null 2>&1
   fi
   ```

   - 成功时：
     - 记录状态为 `Merged`。
     - 推送到远程，记录推送结果。
   - 失败时：
     - 记录状态为 `Conflict`。
     - 执行 `git merge --abort` 恢复工作目录。

#### **打印汇总表格**

```bash
while IFS=: read -r branch status; do
  case "$status" in
    ...
  esac
done < "$branch_status_file"
```

- 遍历状态文件 `branch_status_file`，根据状态打印结果，提供直观的汇总信息。
- `IFS`（Internal Field Separator）用于指定字段分隔符，这里设置为冒号（`:`）。因为笔者此前用 `declare -A branch_status` 来记录状态时发现总是失败，所以改用文件记录状态。
- 在这里，如果有一行内容为 `feature/branch1:Merged`，则 `read` 命令会将 `feature/branch1` 分配给变量 `branch`，`Merged` 分配给变量 `status`。
- `< "$branch_status_file"` 将文件 `$branch_status_file` 的内容逐行输入到 `while` 循环中。文件的每一行都会被传递给 `read` 命令。

### **清理与结束**

```bash
git checkout $fix_branch >/dev/null 2>&1
rm -f "$branch_status_file"
```

- 切换回修复分支。
- 删除临时文件，清理运行环境。

### **关键技术和语法**

1. **动态进度条**：通过 `printf` 和 `seq` 构建动态、实时更新的输出。
2. **错误处理**：利用 `if` 和 `continue` 等语法捕获错误，保证脚本的健壮性。
3. **临时文件**：通过 `mktemp` 创建临时文件，避免变量冲突。
4. **状态汇总**：通过文件记录和 `while` 循环实现批量结果分析。

## 指令化脚本

```bash
# 帮助信息
print_usage() {
  echo "Usage: $0 [-f <fix_branch> -t <target_branches>] [-c <commit_hash> -t <target_branches>]"
  echo "  -f  Specify the fix branch to merge from (merge mode)."
  echo "  -c  Specify a commit hash to cherry-pick (cherry-pick mode)."
  echo "  -t  Specify the target branches to operate on (comma-separated)."
  echo "Examples:"
  echo "  $0 -f fix/common-issue -t feature/branch1,feature/branch2"
  echo "  $0 -c abc123 -t feature/branch1,feature/branch2"
  exit 1
}

# 参数初始化
fix_branch=""
commit_hash=""
target_branches=()

# 解析命令行参数
while getopts "f:c:t:" opt; do
  case "$opt" in
    f)
      fix_branch="$OPTARG"
      ;;
    c)
      commit_hash="$OPTARG"
      ;;
    t)
      IFS=',' read -r -a target_branches <<< "$OPTARG"
      ;;
    *)
      print_usage
      ;;
  esac
done

# 检查参数互斥性
if [[ -n "$fix_branch" && -n "$commit_hash" ]]; then
  echo "Error: -f and -c options cannot be used together."
  print_usage
fi

# 检查必要参数
if [[ -z "$fix_branch" && -z "$commit_hash" ]]; then
  echo "Error: Either -f or -c must be specified."
  print_usage
fi

if [[ ${#target_branches[@]} -eq 0 ]]; then
  echo "Error: No target branches specified."
  print_usage
fi

# --------------- 核心代码 ---------------

# 分支状态记录
branch_status_file=$(mktemp)
# 记录当前所在的分支
original_branch=$(git rev-parse --abbrev-ref HEAD)

# 图标和符号定义
CHECK_MARK="✔"
CROSS_MARK="✘"
ARROW="➜"
SEPARATOR="==================================================="
PROGRESS_BAR_WIDTH=40

# 动态进度条
progress_bar() {
  local progress=$1
  local total=$2

  # 避免除以零
  if [ "$total" -le 0 ]; then
    printf "\r[%-${PROGRESS_BAR_WIDTH}s] %3d%%" "$(printf "%0.s " $(seq 1 $PROGRESS_BAR_WIDTH))" 0
    return
  fi

  local percentage=$(( progress * 100 / total ))
  local num_hashes=$(( progress * PROGRESS_BAR_WIDTH / total ))
  printf "\r[%-${PROGRESS_BAR_WIDTH}s] %3d%%" "$(printf "%0.s#" $(seq 1 $num_hashes))" $percentage
}

# 打印分隔线
print_separator() {
  echo "$SEPARATOR"
}

# 打印标题
print_title() {
  echo "$SEPARATOR"
  echo "             🌿 Starting the Process"
  echo "$SEPARATOR"
}

# 打印开始信息
print_title

# 总分支数量
total_branches=${#target_branches[@]}

# 防止 total_branches 为 0
if [ "$total_branches" -eq 0 ]; then
  echo " ${CROSS_MARK} No target branches specified. Exiting."
  exit 1
fi

current_branch_index=0

# 操作分支
for branch in "${target_branches[@]}"; do
  current_branch_index=$((current_branch_index + 1))

  # 更新动态进度条
  progress_bar $current_branch_index $total_branches
  echo " ${ARROW} Switching to $branch..."

  if git checkout "$branch" >/dev/null 2>&1; then
    echo " ${ARROW} Updating $branch to the latest from remote..."
    git pull --rebase origin $branch >/dev/null 2>&1 || {
      echo " ${CROSS_MARK} Failed to update $branch. Skipping."
      echo "$branch:UpdateFailed" >> "$branch_status_file"
      continue
    }
  else
    echo " ${CROSS_MARK} Failed to switch to $branch."
    echo "$branch:CheckoutFailed" >> "$branch_status_file"
    continue
  fi

  if [[ -n "$fix_branch" ]]; then
    echo " ${ARROW} Merging $fix_branch into $branch..."
    if git merge $fix_branch --no-ff -m "Merge $fix_branch into $branch" >/dev/null 2>&1; then
      echo " ${CHECK_MARK} Successfully merged into $branch."
    else
      echo " ${CROSS_MARK} Merge conflict detected in $branch!"
      git merge --abort >/dev/null 2>&1
      echo "$branch:Conflict" >> "$branch_status_file"
      continue
    fi
  elif [[ -n "$commit_hash" ]]; then
    echo " ${ARROW} Cherry-picking commit $commit_hash into $branch..."
    if git cherry-pick $commit_hash >/dev/null 2>&1; then
      echo " ${CHECK_MARK} Successfully cherry-picked into $branch."
    else
      echo " ${CROSS_MARK} Cherry-pick failed in $branch. Resolving conflict..."
      git cherry-pick --abort >/dev/null 2>&1
      echo "$branch:Conflict" >> "$branch_status_file"
      continue
    fi
  fi

  echo " ${ARROW} Attempting to push $branch to remote..."
  if git push origin $branch >/dev/null 2>&1; then
    echo " ${CHECK_MARK} Successfully pushed $branch to remote."
    echo "$branch:OperationSucceeded" >> "$branch_status_file"
  else
    echo " ${CROSS_MARK} Failed to push $branch to remote."
    echo "$branch:PushFailed" >> "$branch_status_file"
  fi
done

# 尝试切回最初的分支
if ! git checkout "$original_branch" >/dev/null 2>&1; then
  echo " ${CROSS_MARK} Failed to return to the original branch: $original_branch"
  echo "   Please manually switch back to your desired branch."
fi

# 打印汇总表格
print_separator
echo "Process Summary:"
print_separator
printf "%-35s | %-15s\n" "Branch" "Status"
print_separator

while IFS=: read -r branch status; do
  case "$status" in
    OperationSucceeded)
      printf "%-35s | %-15s\n" "$branch" "$CHECK_MARK Succeeded"
      ;;
    Conflict)
      printf "%-35s | %-15s\n" "$branch" "$CROSS_MARK Conflict"
      ;;
    CheckoutFailed)
      printf "%-35s | %-15s\n" "$branch" "$CROSS_MARK CheckoutFailed"
      ;;
    UpdateFailed)
      printf "%-35s | %-15s\n" "$branch" "$CROSS_MARK UpdateFailed"
      ;;
    PushFailed)
      printf "%-35s | %-15s\n" "$branch" "$CROSS_MARK PushFailed"
      ;;
    *)
      printf "%-35s | %-15s\n" "$branch" "$CROSS_MARK Unknown"
      ;;
  esac
done < "$branch_status_file"

print_separator

# 删除临时文件
rm -f "$branch_status_file"

echo "             💫 Process completed."
print_separator
```

此时可以通过 node 脚本来指令化调用啦~ 不用额外安装依赖：

```js
const { exec } = require('child_process')
const path = require('path')

// 构造指令
const fixBranch = 'fix/common-issue'
const targetBranches = [
  'feature/branch1',
  'feature/branch2',
  'feature/branch3',
].join(',')

// 脚本路径-这里的 `mergeGit.sh` 为上述脚本保存名称
const scriptPath = path.resolve(__dirname, './mergeGit.sh')
const command = `bash ${scriptPath} -f ${fixBranch} -t ${targetBranches}`

// 执行脚本
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`)
    return
  }
  console.info(`Output:\n${stdout}`)
})
```
