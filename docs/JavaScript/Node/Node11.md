---
title: 检查多语言重复
icon: nodeJS
date: 2024-11-14
category:
  - javascript
tag:
  - node
---

最近需要检查多语言文件中是否有重复的 key，于是写了一个 Node.js 脚本来实现这个功能。这个脚本会遍历指定目录下的所有 JSON 文件，检查每个文件中的 key 是否有重复，并将结果输出到控制台。同时，脚本还会将所有 key 存入一个缓存文件中，以便下次运行时可以快速查询。

```js
const fs = require('fs')
const path = require('path')

const cacheFilePath = path.join(__dirname, 'temp/i18n_keys_cache.json')

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
  return { cache: {}, allKeysSet: new Set() }
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
