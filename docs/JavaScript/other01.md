---
title: 代码规范和自动格式化
icon: javascript
date: 2023-02-26
category:
  - javascript
tag:
  - javascript
---

# 代码规范和自动格式化

 在团队开发中，统一代码规范是必不可少的。[**ESlint**](https://cn.eslint.org/docs/user-guide/configuring) 是我们前端工程化中代码检测的一款常用工具。它不仅可以检测 `JS` 还支持 `Vue` 和 `JSX` 。

> 前置知识——最佳实践：
>
> - ESlint 检测不合规的代码，npm 包也有修复功能，但是没有 Prettier 强大。
> - Prettier 修复不合规的代码
> - Editorconfig 统一不同操作系统下的编码格式
>
> 三者都有对应的 VScode 插件。但需要明白的是，VScode 插件是通过本地的配置，在编写代码时就帮开发者 检测、修复代码！而通过 npm 安装的包，是通过指令的方式检测、修复。俩者的功能和用途是不一样的！

## 安装和使用

环境要求: [Node.js](https://nodejs.org/zh-cn/) (>=6.14), npm version 3+。

可以使用 **npm** 安装 ESlint（开发时依赖） : `npm install ESlint -d`

其次，你需要为 ESlint 设置配置文件: `npx eslint --init`

采用 `init` 初始化指令时，可以依据你的需求，为 ESlint 设置配置文件，最后会在当前文件夹下生成 `.eslintre.js` 的配置文件。并且我们可以在配置文件中看到许多 **rules** 配置规则。

此时，我们可以**通过指令: `npx eslint . --fix` 修复全部代码**。

### ESlint 配合 VScode 插件使用

虽然通过指令，可以做到统一修复代码，但是如果想在编写代码的时候立即发现不合规的地方，我们还是需要通过 **VScode** 插件 **“ESLint”** 来完成。

但我们安装完 **“ESLint”** 插件后，便会在编辑文件中，看到报错提示信息。当然，我们可以更进一步，利用 **ESLint** 进行自动修复（更流行的是用 **Prettier** 进行修复，下文会介绍），通过 `设置`打开 `setting.json` , 在其中编辑改写:

```json
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
}
```

即，保存文件时执行——”ESLint 自动修复文件“。

但是，由于自带的代码格式化功能并不彻底，所以目前社区更流行将 **ESlint** 作为单一的语法检测工具，代码自动修复交由更专业的 **Prettier** 工具实现。

### 设置 Prettier

如上文所述，**Prettier** 的代码格式化功能更加强大，但是其语法和 **ESLint ** 却并不相同，所以还需要额外再设置一番。

1. 在`VScode` 中安装 `Prettier` 插件，并在项目中局部安装: `npm install -d prettier`

2. 由于目的是配合 **ESLint** 使用，因此，我们在根目录创建 `.eslintrc.js` 配置文件，以下列出部分通用设置：

   ```JavaScript
   {
     "useTabs": false,
     "tabWidth": 2,
     "printWidth": 100,
     "singleQuote": true,
     "trailingComma": "none",
     "bracketSpacing": true,
     "semi": false
   }
   ```

3. 这个时候，我们就可以对项目进行初步格式化操作了： `npx prettier --write .`

但是这并不是我们想要的。我们需要让 `ESLint` 检测代码，`Prettier` 修复这部分问题代码。而俩者的语法并不相同，因此，我们接下来解决这部分的冲突。

- 使用 `eslint-config-prettier` 这个插件，用来关闭所有和 **Prettier** 冲突的 **ESLint** 规则。

  安装插件: `npm i eslint-config-prettier -d`

- a. 在 `.eslintrc.js` 配置文件中的`extends` 处加入 `prettier` 的扩展：

  ```JavaScript
  // .eslintrc.js
  module.exports = {
    ......
    extends: [..., 'prettier'], // 现在是以 prettier 为主,覆盖eslint格式配置。写在最后面，”...“代表其它插件
    ......
  }
  ```

- b. 继续修改:

  ```JavaScript
  // .eslintrc.js
  module.exports = {
    ......
    extends: [..., 'plugin:prettier/recommended'], // 现在是以 prettier/recommend 为主, 解决了与 eslint 的冲突
    ......
  }
  ```

### 配合 Typescript

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    "eslint-config-airbnb-base",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    // 不在 import 其它 moudle时，填写文件后缀名
    "import/extensions": "off", 
    
     // typescript 中的 interface 以及 type 不存在变量提升的问题
    "no-use-before-define": "off",
    
    // 保证eslint见到 interface 或者 type 在声明前使用时不会报错
    "@typescript-eslint/no-use-before-define": [
      "error",
      { ignoreTypeReferences: true },
    ], 
    
    // 如果单文件中只有一个导出项，则eslint会告诉你使用export default的方式导出, 关闭次功能
    "import/prefer-default-export": "off", 
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"],
        moduleDirectory: ["node_modules", "./src"],
      },
    },
  },
  parserOptions: {
    project: "./tsconfig.json",
  },
};
```

当然，我们还需要为 VScode 进行本地设置，来更好的配置我们的插件（告诉 VScode，对这些文件进行敲代码时，你要给我干活ヽ(^o^)丿）：

```json
// VScode 的 setting.json
  /* ESlint 设置 */
  "eslint.alwaysShowStatus": true,
  "eslint.format.enable": true, // 开启eslint自动修复js/ts/jsx/tsx功能
  "eslint.trace.server": "verbose", //在输出中看到更多日志
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "javascriptreact",
    "typescriptreact"
  ], // eslint 作用范围
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.formatOnSave": true, // 保存时格式化
  // 设置js的formatter为eslint
  "[javascript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[typescript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[json]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  // jsonc是有注释的json
  "[jsonc]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "eslint.codeActionsOnSave.mode": "problems",
  "editor.defaultFormatter": "esbenp.prettier-vscode", // 默认格式化 用 Prettier
  // 将json文件识别为jsonc格式
  "files.associations": {
    "*.json": "jsonc",
  },
```

## 统一代码风格实战

> 问题：项目中遇到 ESLint 报错：“Expected linebreaks to be 'CRLF' but found 'LF'.”

查阅官方文档后，了解到由于不同的操作系统的换行符不同，因此存在兼容性问题。

**报错原因**：

1. 这个问题是用户的操作系统可能为 Mac/Linux 等系统；
2. 手动配置过 VScode 换行编码风格为 "\n"；
3. 安装过 Editorconfig 插件，并且设置了换行规则 "`end_of_line = lf`"

并且，配置了 ESlint 规则：`'linebreak-style': ['error', 'windows']`。

因此先看 ESlint 用于控制代码换行符的兼容性和格式的配置规则：`'linebreak-style': ['error', 'windows']`。该规则可设置为以下三个值之一：

- `"unix"`：表示 Unix/Linux/Mac 等系统中通用的换行符风格（即 "\n"）；
- `"windows"`：表示 Windows 系统默认的换行符风格（即 "\r\n"）；
- `"auto"`：根据当前平台自动选择上述两种风格之一。

在这里，配置为 `['error', 'windows']` 表示强制使用 windows 风格的换行符，并且如果检测到代码文件中存在不兼容 windows 换行符的内容，就会报错并提示更正。其中 `"error"` 用来指定该规则是一个错误类型的告警，并将由其影响停止进程执行。

**解决办法**：

统一 “`.editorconfig`” 和 “`.eslintrc.js`” 俩个配置文件。

`.editorconfig`：

```.editorconfig
[*]
charset = utf-8
indent_style = tab
end_of_line = lf # 统一换行符
```

`.eslintrc.js`：

```js
module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
	parserOptions: {
		parser: 'babel-eslint'
	},
	rules: {
		// ...
    // 统一换行符检测规则
		'linebreak-style': ['error', 'unix']
	}
}
```

当然，只是这样还不够，我们还应当配置“`.prettierrc`” 帮助我们修复不合规的代码。配置规则为：

```json
{
	// ...
	"endOfLine": "lf",
}
```

通过如上三个设置，就能统一换行编码风格为 “ \n ”。
