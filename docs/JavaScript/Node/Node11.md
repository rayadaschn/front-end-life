---
title: 检查多语言重复
icon: nodeJS
date: 2024-11-14
category:
  - javascript
tag:
  - node
---

最近需要检查多语言文件中是否有重复的 key，于是写了一个 Node.js 脚本来实现这个功能。

这个脚本会在 git 提交代码时，对提交的多语言文件进行校验。通过遍历指定目录下的所有 JSON 文件，检查每个文件中的 key 是否有重复，并将结果输出到控制台。同时，脚本还会将所有 key 存入一个缓存文件中，以便下次运行时可以快速查询。

## 实现逻辑

理论依据：由于 `lint-staged` 会将**暂存区中被修改的文件路径**作为参数传入定义的脚本。这意味着可以在 `lint-staged` 中配置的命令中直接访问提交的文件列表，而不需要手动指定文件路径。

因此 `const files = process.argv.slice(2);` 就是获取提交的文件列表，然后通过 `fs.readFileSync` 读取文件内容，最后通过 `getLastLevelKeys` 获取文件中的所有 key，并检查是否有重复的 key。

### 1. **基本路径和目录初始化**

```js
const cacheFilePath = path.join(__dirname, 'temp/i18n_keys_cache.json')
const cacheDirPath = path.join(__dirname, '../src/i18n/zh') // 指定中文目录
```

- `cacheFilePath` 定义缓存文件路径（用于保存之前检查过的键）。
- `cacheDirPath` 指定 `zh` 文件夹路径，作为多语言 JSON 文件的存储目录，用于初始化缓存文件。

### 2. **创建缓存目录（如果不存在）**

```js
const cacheDir = path.dirname(cacheFilePath)
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true })
}
```

- 检查并创建存储缓存文件的 `temp` 目录，以确保缓存文件的存放位置存在。

### 3. **加载传入的文件路径列表**

```js
const files = process.argv.slice(2)
console.info('🚀 ~ Starting file check:', files)
```

- `process.argv.slice(2)` 用于获取命令行传入的文件路径列表，排除 Node 和脚本本身的路径。`files` 数组将被传入后续检查函数。

### 4. **加载缓存并生成所有键的 Set 集合**

```js
function loadCache() {
  if (fs.existsSync(cacheFilePath)) {
    const cacheContent = fs.readFileSync(cacheFilePath, 'utf8')
    const cache = JSON.parse(cacheContent)
    return {
      cache,
      allKeysSet: new Set(Object.values(cache).flat()), // 将缓存的键存入 Set
    }
  }
  const cache = initializeCache()
  saveCache(cache)
  return { cache, allKeysSet: new Set(Object.values(cache).flat()) }
}
```

- 检查缓存文件是否存在，如果存在则读取并解析 JSON 内容。
- `allKeysSet` 是一个 Set 对象，用于高效存储并查询所有键，避免重复。
- 若缓存不存在，通过 `initializeCache()` 初始化，并将所有的键添加到 `allKeysSet`。

### 5. **从指定目录初始化缓存**

```js
function initializeCache() {
  const cache = {}
  const files = fs
    .readdirSync(cacheDirPath)
    .filter((file) => file.endsWith('.json'))

  files.forEach((file) => {
    const fileName = path.basename(file, '.json')
    const filePath = path.join(cacheDirPath, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const jsonData = JSON.parse(content)

    cache[fileName] = getLastLevelKeys(jsonData) // 获取 JSON 的最后一级键
  })

  console.info('🚀 ~ Initialized cache from zh directory with files:', files)
  return cache
}
```

- `initializeCache()` 遍历 `zh` 目录下的所有 JSON 文件。
- 对每个文件提取最后一级的键（用 `getLastLevelKeys()` 获取），并以文件名作为缓存中的键，便于定位和更新。

### 6. **获取 JSON 对象的最后一级键**

```js
function getLastLevelKeys(obj) {
  const keys = []
  function recurse(o) {
    if (typeof o !== 'object' || o === null) return
    for (const key in o) {
      if (typeof o[key] === 'object') {
        recurse(o[key])
      } else {
        keys.push(key)
      }
    }
  }
  recurse(obj)
  return keys
}
```

- `getLastLevelKeys` 是递归函数，遍历对象并提取其最底层的键，用于避免嵌套对象影响。

### 7. **检查重复键并更新缓存**

```js
function checkForDuplicateKeys(files) {
  const { cache, allKeysSet } = loadCache()
  const duplicateKeys = new Set()

  files.forEach((file) => {
    const fileName = path.basename(file, '.json')
    const filePath = path.resolve(file)
    const content = fs.readFileSync(filePath, 'utf8')
    const jsonData = JSON.parse(content)

    const keys = getLastLevelKeys(jsonData)

    if (cache[fileName]) {
      cache[fileName].forEach((key) => allKeysSet.delete(key))
      delete cache[fileName]
    }

    let hasDuplicate = false
    keys.forEach((key) => {
      if (allKeysSet.has(key)) {
        duplicateKeys.add(key)
        hasDuplicate = true
      }
    })

    if (!hasDuplicate) {
      cache[fileName] = keys
      keys.forEach((key) => allKeysSet.add(key))
    }
  })

  saveCache(cache)
  return [...duplicateKeys]
}
```

- `checkForDuplicateKeys` 遍历每个文件，检查其键是否在 `allKeysSet` 中存在。
- 如果发现重复键，记录到 `duplicateKeys`。
- 没有重复键时，将文件的新键更新至 `cache` 并添加到 `allKeysSet`。

### 8. **检查文件并输出结果**

```js
const duplicates = checkForDuplicateKeys(files)
if (duplicates.length) {
  console.error('Duplicate keys found:', duplicates)
  process.exit(1) // 阻止提交
} else {
  console.info('🚀 ~ i18n key check complete, no duplicates found')
}
```

- 检查完毕后，若发现重复键，将输出错误信息并阻止提交（通过 `process.exit(1)` 退出）。
- 若无重复键，输出成功信息并结束。

## 代码展示

以下是脚本的代码：

```js
const fs = require('fs')
const path = require('path')

const cacheFilePath = path.join(__dirname, 'temp/i18n_keys_cache.json')
const cacheDirPath = path.join(__dirname, '../src/i18n/zh') // 指定中文目录, 主要维护多语言基础版本

// 检查并创建缓存目录（如果不存在）
const cacheDir = path.dirname(cacheFilePath)
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true })
}

// 获取传入的文件路径列表
const files = process.argv.slice(2)
console.info('🚀 ~ Starting file check:', files)

// 加载缓存并将所有 key 存入 Set 以提高查询效率
function loadCache() {
  if (fs.existsSync(cacheFilePath)) {
    const cacheContent = fs.readFileSync(cacheFilePath, 'utf8')
    const cache = JSON.parse(cacheContent)
    return {
      cache,
      allKeysSet: new Set(Object.values(cache).flat()), // 用 Set 存储所有 key
    }
  }
  // 初始化缓存文件
  const cache = initializeCache()
  saveCache(cache)
  return { cache, allKeysSet: new Set(Object.values(cache).flat()) }
}

// 通过加载维护目录中的所有 JSON 文件来初始化缓存
function initializeCache() {
  const cache = {}
  const files = fs
    .readdirSync(cacheDirPath)
    .filter((file) => file.endsWith('.json'))

  files.forEach((file) => {
    const fileName = path.basename(file, '.json')
    const filePath = path.join(cacheDirPath, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const jsonData = JSON.parse(content)

    // 将文件的最后一级键添加到缓存中
    cache[fileName] = getLastLevelKeys(jsonData)
  })

  console.info('🚀 ~ Initialized cache from zh directory with files:', files)
  return cache
}

// 保存共享缓存
function saveCache(cache) {
  fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2), 'utf8')
}

// 获取 JSON 对象的最后一级 key
function getLastLevelKeys(obj) {
  const keys = []
  function recurse(o) {
    if (typeof o !== 'object' || o === null) return
    for (const key in o) {
      if (typeof o[key] === 'object') {
        recurse(o[key])
      } else {
        keys.push(key)
      }
    }
  }
  recurse(obj)
  return keys
}

// 检查重复 key 并更新缓存
function checkForDuplicateKeys(files) {
  const { cache, allKeysSet } = loadCache()
  const duplicateKeys = new Set()

  files.forEach((file) => {
    const fileName = path.basename(file, '.json') // 使用文件名作为键
    const filePath = path.resolve(file)
    const content = fs.readFileSync(filePath, 'utf8')
    const jsonData = JSON.parse(content)

    const keys = getLastLevelKeys(jsonData)

    // 从缓存中删除旧的 key
    if (cache[fileName]) {
      cache[fileName].forEach((key) => allKeysSet.delete(key)) // 从 Set 中删除
      delete cache[fileName]
    }

    // 检查重复 key，并记录
    let hasDuplicate = false
    keys.forEach((key) => {
      if (allKeysSet.has(key)) {
        duplicateKeys.add(key)
        hasDuplicate = true
      }
    })

    // 更新缓存：仅在没有重复时保存新 key
    if (!hasDuplicate) {
      cache[fileName] = keys
      keys.forEach((key) => allKeysSet.add(key)) // 添加新 key 到 Set
    }
  })

  saveCache(cache) // 保存更新后的共享缓存
  return [...duplicateKeys]
}

// 检查文件
const duplicates = checkForDuplicateKeys(files)
if (duplicates.length) {
  console.error('Duplicate keys found:', duplicates)
  process.exit(1) // 退出并阻止提交
} else {
  console.info('🚀 ~ i18n key check complete, no duplicates found')
}
```
