---
title: 自定义 Cli
icon: nodeJS
category:
  - javascript
tag:
  - node


---

# 自定义 Cli 01 之 commander

问题：当我们在用脚手架时，究竟发生了什么？当我们在 terminal 中键入 `create-react-app project-name` 时，究竟发生了什么？

## 初始化 npm init

脚手架实际上也是一个工具包，只不过它替我们自动化完成了很多初始任务。我们先 `npm init` 初始化一个项目。

最终会生成一个 `package.json` 包，在这个包中，我们还需要新建一个 “ bin ” 字段，它可以指定一些可以作为命令行工具使用的 JavaScript 脚本文件。当用户全局安装时，这些脚本文件会被添加到系统的可执行路径中，从而可以在任何地方通过命令行来执行这些脚本。

`bin` 字段接收一个对象作为参数，对象的属性名表示命令的名称，属性值表示对应的 JavaScript 脚本文件。在这里，我们便能设定如“ create-react-app ”这样的脚手架名称了！如下，我们设定一个名为 `huy-cli`的命令行工具：

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "description": "My cli package",
  "bin": {
    "huy-cli": "./lib/index.js"
  }
}
```

 `huy-cli`命令行指向了`"./lib/index.js"`，因此我们再创建一下这个文件。

```js
// ./lib/index.js
#!/usr/bin/env node

console.log("Hello my cli");
```

在文件头我们设置了一行`#!/usr/bin/env node` 指定当前脚本由 node.js 进行解析。

这个时候初始准备工作就完成了，但是还是无法在 terminal 中直接运行 `huy-cli`，原因在于 node 并没有获取到我们这个包的地址，它现在还查询不到。如果我们把这个包引入到我们的项目中，它可以运行，但是现在还没有，这里我们还要用到 `npm link` 进行软连接。

`npm link` 是一个 Node.js 工具，它允许你在本地开发时使用本地的 npm 模块，而不是从远程 npm 仓库中下载依赖。通常情况下，`npm link` 的使用场景是在开发一个 npm 模块或一个应用程序时，需要将本地修改后的模块或包与应用程序进行关联，并在开发过程中实时测试和调试。

使用 `npm link` 命令链接本地模块到全局命令行环境下：

```bash
$: npm link
```

这个时候，我们就可以在 terminal 中直接执行 `huy-cli`了，它会有 node 解析我们自定义的 `index.js`。

```bash
$:  huy-cli

# 打印如下结果:
Hello my cli
```

> 如果想要取消 `npm link`，直接在当前项目中执行：
>
> ```bash
> $: npm unlink <package_name>
> ```

## 初探 commander

光完成上述操作还不够，我们在用脚手架的时候，可能还会给它传递一些参数，这个时候就要用的 TJ 大神的 [commander](https://github.com/tj/commander.js) 包了。`commander` 是一个 Node.js 的命令行框架，可以帮助我们轻松地构建命令行工具。下面是 `commander` 的基本使用方法（概述，具体用法看下文）：

1. 安装 `commander` 模块

使用以下命令在项目中安装 `commander` 模块：

```bash
npm install -D commander
```

2. 引入 `commander` 模块

在 JavaScript 文件中引入 `commander` 模块：

```javascript
const { program } = require('commander');
```

3. 配置命令和选项

使用 `program` 对象来配置命令和选项：

```javascript
program
  .version('0.1.0')
  .option('-p, --port <number>', 'set server port', parseInt)
  .option('-e, --env <name>', 'set environment name')
  .option('-d, --debug', 'output extra debugging')
  .command('start [name]', 'start server')
  .action((name, options) => {
    console.log(`Starting server ${name} on port ${options.port}`);
  });
```

其中，`.version()` 方法用于指定程序的版本号，`.option()` 方法用于定义选项，`.command()` 方法用于定义命令，`.action()` 方法用于指定命令执行的动作。

4. 解析命令行参数

使用 `program.parse()` 方法解析命令行参数：

```javascript
program.parse(process.argv);
```

5. 运行命令行工具

使用以下命令运行命令行工具：

```bash
node my-program.js start my-server --port 8080 --env production --debug
```

其中，`my-program.js` 是你的程序入口文件，`start` 是命令名，`my-server` 是命令参数，`--port`、`--env` 和 `--debug` 是选项名，`8080`、`production` 和 `true` 是选项值。

以上就是 `commander` 的基本使用方法。除此之外，`commander` 还提供了很多其他的功能，例如自动生成帮助信息、支持子命令、自定义选项解析器等等，可以根据实际需求进行相应的配置和使用。

### program 命令行的主/子命令

在 `commander` 中，`program` 是一个核心对象，用于定义命令行工具的主命令和子命令，并处理命令行参数。

`program` 对象是通过调用 `require('commander').program` 得到的，而 `require('commander')` 则是引入 `commander` 模块并返回其中的 `Command` 类。因此，可以将 `program` 视为 `Command` 类的一个实例，用于设置和处理命令行参数。

例如，在以下代码中，我们使用 `program` 定义了一个名为 `my-tool` 的主命令：

```javascript
const { program } = require('commander');

program
  .version('1.0.0')
  .description('My command line tool')
  .action(() => {
    console.log('My command line tool');
  });

program.parse(process.argv);
```

其中，`.version()` 方法用于指定命令行工具的版本号，`.description()` 方法用于指定命令行工具的描述信息，`.action()` 方法用于指定主命令被执行时的回调函数。

在最后一行的 `.parse()` 方法中，`process.argv` 表示当前进程的命令行参数数组。通过调用 `.parse()` 方法，程序会解析这个参数数组，并根据不同的命令和选项执行相应的操作。

### version 包版本

1. 配置命令和选项

使用 `program.version()` 方法来定义程序的版本号：

```javascript
program.version('1.0.0');
```

2. 解析命令行参数并查看版本

在代码中调用 `.parse()` 方法解析命令行参数，当用户在命令行中输入 `-V` 或 `--version` 时，会自动输出程序的版本号：

```javascript
program.parse(process.argv);

if (program.version) {
  console.log(program.version);
}
```

完整代码样例如下：

```javascript
#!/usr/bin/env node

const { program } = require('commander');

program.version('1.0.0');
program.parse(process.argv);

if (program.version) {
  console.log(program.version);
}
```

在终端中执行以下命令即可查看程序版本：

```bash
node my-program.js --version
```

其中，`my-program.js` 是你的程序文件名。

### option 命令行选项方法

在 `commander` 中，`option` 是用来定义命令行选项的方法。选项是指命令行中可选的参数，以单破折号或双破折号开头，例如 `-p`、`--port` 等。选项可以带有值或不带值，可以是布尔型、字符串型、数字型等类型。

`option` 方法接收三个参数：

1. 选项名：一个字符串，表示选项的名称，可以是单破折号形式（例如 `-p`），也可以是双破折号形式（例如 `--port`）。

2. 描述信息：一个字符串，用于描述选项的作用和用法。

3. 处理函数：一个函数，用于处理选项的值，该函数接收一个参数，即选项的值，可以对其进行转换、验证等操作，然后返回处理后的结果。

例如，在以下代码中，`.option()` 方法定义了三个选项：`-p, --port <number>`、`-e, --env <name>` 和 `-d, --debug`：

```javascript
const { program } = require('commander');

program
  .option('-p, --port <number>', 'set server port', parseInt)
  .option('-e, --env <name>', 'set environment name')
  .option('-d, --debug', 'output extra debugging');
```

其中，`<number>` 表示该选项要求输入一个数字类型的值，并使用 `parseInt` 方法将其转换成整数类型；`<name>` 表示该选项要求输入一个字符串类型的值；`-d, --debug` 表示该选项是一个布尔型选项，不需要输入值。

在程序运行时，可以通过 `program.opts()` 方法获取所有选项的值。例如，在以下代码中，`.opts()` 方法获取了 `-p` 和 `-e` 选项的值，并打印到控制台上：

```javascript
const { program } = require('commander');

program
  .option('-p, --port <number>', 'set server port', parseInt)
  .option('-e, --env <name>', 'set environment name');

program.parse(process.argv);

console.log(program.opts());
```

在终端中执行以下命令会输出选项的值：

```bash
node my-program.js -p 8080 --env production
```

输出结果为：

```json
{ "port": 8080, "env": "production" }
```

### command 定义子命令

在 `commander` 中，`command` 方法用于定义子命令。子命令是指在一个主命令下的子命令，例如 `git commit` 命令中的 `commit` 就是一个子命令。

`command` 方法接收两个参数：

1. 命令名称：一个字符串，表示子命令的名称。

2. 命令描述：一个字符串，用于描述子命令的作用和用法。

例如，在以下代码中，`.command()` 方法定义了一个名为 `start` 的子命令：

```javascript
const { program } = require('commander');

program
  .command('start <name>')
  .description('start server')
  .action((name) => {
    console.log(`Starting server ${name}...`);
  });
```

其中，`<name>` 表示该子命令需要输入一个参数，这个参数的值会被传递给 `.action()` 中的回调函数。

在程序运行时，可以通过 `program.parse()` 方法解析命令行参数，并根据不同的命令执行不同的操作。例如，在以下代码中，如果用户输入了 `start` 子命令，则会执行 `.action()` 中的回调函数：

```javascript
const { program } = require('commander');

program
  .command('start <name>')
  .description('start server')
  .action((name) => {
    console.log(`Starting server ${name}...`);
  });

program.parse(process.argv);
```

在终端中执行以下命令可以启动子命令：

```bash
node my-program.js start my-server
```

输出结果为：

```bash
Starting server my-server...
```

因此，`command` 方法使得我们能够更加清晰和灵活地组织命令行工具的功能，将不同的操作分别封装成子命令，并通过 `.parse()` 方法来解析命令行参数并执行相应的操作。

### 定义多个子命令

在 `commander` 中，可以使用多个 `.command()` 方法来定义不同的子命令。例如，在以下代码中，我们定义了两个名为 `start` 和 `stop` 的子命令：

```javascript
const { program } = require('commander');

program
  .command('start <name>')
  .description('start server')
  .action((name) => {
    console.log(`Starting server ${name}...`);
  });

program
  .command('stop <name>')
  .description('stop server')
  .action((name) => {
    console.log(`Stopping server ${name}...`);
  });

program.parse(process.argv);
```

其中，`.command('start <name>')` 定义了一个名为 `start` 的子命令，并指定了一个命令参数 `<name>`；`.command('stop <name>')` 定义了一个名为 `stop` 的子命令，并指定了一个命令参数 `<name>`。

在程序运行时，根据传递的参数不同，会执行不同的子命令。例如，在终端中执行以下命令会启动 `start` 子命令：

```bash
node my-program.js start my-server
```

输出结果为：

```bash
Starting server my-server...
```

执行以下命令会启动 `stop` 子命令：

```bash
node my-program.js stop my-server
```

输出结果为：

```bash
Stopping server my-server...
```

### action 指定回调函数

在 `commander` 中，`.action()` 方法用于指定命令或子命令被调用时的回调函数。该方法接收一个回调函数作为参数，这个回调函数会在命令或子命令被执行时被调用。

例如，在以下代码中，我们使用 `.action()` 方法指定了一个回调函数，该回调函数会在 `start` 子命令被执行时被调用，并输出一条日志信息：

```javascript
const { program } = require('commander');

program
  .command('start <name>')
  .description('start server')
  .action((name) => {
    console.log(`Starting server ${name}...`);
  });

program.parse(process.argv);
```

在终端中执行以下命令可以启动子命令：

```bash
node my-program.js start my-server
```

输出结果为：

```bash
Starting server my-server...
```

可以看到，在执行 `start` 子命令时，`.action()` 方法指定的回调函数被自动调用，并输出了一条日志信息。

除了在子命令中使用外，`.action()` 方法也可以在主命令中使用，用于指定主命令被执行时的回调函数。例如，在以下代码中，我们使用 `.action()` 方法指定了一个回调函数，该回调函数会在主命令被执行时被调用，并输出一条日志信息：

```javascript
const { program } = require('commander');

program
  .version('1.0.0')
  .description('My command line tool')
  .action(() => {
    console.log('My command line tool');
  });

program.parse(process.argv);
```

在终端中执行以下命令可以执行主命令：

```bash
node my-program.js
```

输出结果为：

```bash
My command line tool
```

