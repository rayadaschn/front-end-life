---
title: 在 JS 中优雅地实现继承
icon: javascript
order: 8
category:
  - javascript
tag:
  - javascript
star: true
sticky: true
---

# 在 JS 中优雅地实现继承

在 [原型\_原型链\_new 的二三事](原型_原型链_new的二三事.md) 中，我们讨论了原型和原型链的实现关系。在本文，我们再来看看如何去实现继承。

## 1. 是什么?

继承是面向对象中的一个重点，笔者也是反复学习了多次（时而懂，时而不懂，其实就是不懂，哈哈哈）。

我们还是先来看原型的这张神图：

![JavaScript Object Layout](http://www.mollypages.org/tutorials/jsobj.jpg)

原理咱们不再过多讨论，我们现在想说的是通过原型链，我们的 `Foo()` 函数可以继承 `Object()` 的一些实例属性和方法。所以，其实继承就干了俩件事：

- 把子类构造函数(`Child`)的原型(`__proto__`)指向了父类构造函数(`Parent`) ：

  `Child.__proto__ = Parent`

- 把子类实例`child`的原型对象(`Child.prototype`) 的原型(`__proto__`)指向了父类`parent`的原型对象(`Parent.prototype`)：

  `Child.prototype.__proto__ = Parent.prototype `

![继承的实际关系](https://chinese.freecodecamp.org/news/content/images/2021/09/3.png)

对照这张图，我们看的很清楚，这俩步骤：

- `Child.__proto__ = Parent`
- `Child.prototype.__proto__ = Parent.prototype `

那么我们如何来实现这俩个操作呢？关键点在于修改 `__proto__` 属性。能够修改这个的其实一共就 3 个:

1. **`new`** 操作符，内部会创建修改 `__proto__` 属性；

2. `Object.create(proto, [propertiesObject])` 方法创建一个新对象，使用现有的对象来提供新创建的对象的 `__proto__` 。 它接收两个参数，不过第二个可选参数是属性描述符（不常用，默认是`undefined`）。(ES5 新增)

   ```JavaScript
   // 内部简易实现, 实际上原理就是 原型式继承
   if(typeof Object.create !== 'function'){
       Object.create = function(proto){
           function F() {}
           F.prototype = proto;
           return new F();
       }
   }

   ```

3. `Object.setPrototypeOf(obj, prototype)` 方法设置一个指定的对象的原型 ( 即, 内部`[[Prototype]]`属性）到另一个对象或 `null`。(ES6 提供)

以上方案，咱先按下不表。未能理解，可以继续往下看，而后再回来理解。

## 2. 继承方案实现

明白上述的方法前提后，我们可以进行具体实现了。

### 2.1 原型链实现继承

关键点： 子类型的原型为父类型的一个实例对象。即 `Child.prototype = new Parent()`

缺点：

1. 不同的 `Child` 实例的 `__proto__` 会引用同一 `Parent` 的实例。
2. 子构造函数在实例化的时候，不能给父构造函数传参数。

```js
function Patent() {
  this.colors = ["red", "blue", "green"];
}

Patent.prototype.sing = () => console.log("唱歌"); // Parent 的原型方法

function Son() {}
// 让Son继承Patent 的关键点
Son.prototype = new Patent();

let instance1 = new Son();
instance1.colors.push("black");
console.log(instance1.colors); //[ 'red', 'blue', 'green', 'black' ]
instance1.sing(); // 能够调用 Parent 的原型方法

let instance2 = new Son();
// 新创建的 Son 保留了上一 Son 的修改结果
console.log(instance2.colors); //[ 'red', 'blue', 'green', 'black' ]
```

### 2.2 构造函数继承(盗用构造函数)

构造函数继承有很多别名: 盗用构造函数、构造函数绑定、经典继承等等。实现的关键点其实很简单，就是**通过 `call` 或者 `apply` 在子构造函数内<u>执行</u>父构造函数**：

```js
function Child(args) {
  // .....
  Parent.call(this, args);
}
```

优点: 解决了原型链中，每个 `Son` 实例共用同一 `Parent` 实例属性的问题，以及 子构造函数在实例化的时候，不能给父构造函数传参数的问题。

缺点：只是实现了实例属性继承，**`Parent` 原型的方法在 `Child` 实例中并不可用。**

```js
function Patent(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
Patent.prototype.sing = () => console.log("唱歌"); // 原型方法

function Son(name) {
  // 继承Patent
  Patent.call(this, name);
  // Son实例属性
  this.age = 15;
}

let instance1 = new Son("张三");
instance1.colors.push("black");
console.log(instance1);

let instance2 = new Son("李四");
console.log(instance2);

// 不足点
let instance3 = new Patent("parent");
instance3.sing();

// instance1.sing(); // 报错: 无 Parent 的原型方法
```

### 2.3 组合继承（盗用构造函数）

**组合继承**结合了**原型链继承**和**盗用构造函数**，将两者的优点结合到了一起。基本思路是使用原型链继承原型上的属性和方法，通过**盗用构造函数**继承实例属性。

实现关键点:

```js
function Child(args1, args2) {
  // ...
  this.args1 = args2;
  Parent.call(this, args1); // 在 Child 的构造函数中执行 Parent 的构造函数
}
// Child.__proto__ 也会存在同样的 Parent 的实例属性,且所有的 Child 实例的 __proto__ 都指向同一内存地址
Child.prototype = new Parent();
Child.prototype.constrcutor = Child; // // 指回自身, 修复constructor
```

具体实现：

```js
function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
Parent.prototype.sayName = function () {
  console.log(this.name);
};

function Son(name, age) {
  Parent.call(this, name); // 继承Patent, 调用一次
  this.age = age;
}
Son.prototype = new Patent(); // 调用第二次
Son.prototype.constructor = Son; // 指回自身, 修复constructor

Son.prototype.sayAge = function () {
  console.log(this.age);
};

let instance1 = new Son("张三", 19);
instance1.colors.push("black");
console.log(instance1.colors); //[ 'red', 'blue', 'green', 'black' ]
instance1.sayName(); // 张三 => Parent 的原型方法
instance1.sayAge(); // 19   => 自身原型方法

let instance2 = new Son("李四", 18);
console.log(instance2.colors); // [ 'red', 'blue', 'green' ] => 未改变
```

从上面可以看出，组合式继承已经解决了绝大部分问题，但是还有有一点点不足之处：

1. **父构造函数的实例属性依然会存在于 子构造函数 的原型上**，虽然访问时会被子构造函数的同名实例属性所覆盖；
2. 继承过程中执行了两次 `Parent` ,第一次 `call` 和第二次 `new` 。

关于**第一点**有一点点绕，我们回看代码：

```js
Child.prototype = new Parent(); // Child.__proto__ 继承 Parent 的实例属性
```

在关键步骤中，我们将子构造函数 `Child` 的原型 指向了 `new Parent()`，我们再回顾一下 `new` 创建 对象/实例 的过程，在 [原型\_原型链\_new 的二三事](原型_原型链_new的二三事.md) 中我们说过，这个过程一共分为四步：

- 首先创建一个空对象，这个空对象将会作为执行构造函数(`constructor`)之后的返回的对象实例。
- 对创建的空对象的原型(`newObj.__proto__`)指向构造函数的原型属性(`Function.prototype`)。
- 将这个空对象赋值给构造函数内部的 this，并执行构造函数逻辑。
- 依据构造函数执行逻辑，返回第一步所创建的对象或构造函数的显示返回值（必须是对象）。

也就是说，`new` 关键字创建出来的对象会保存原构造函数的属性。回看第一节，我们再这步的过程实际上仅仅只是需要将 **`Child.prototype.__proto__`** 指向 构造函数的原型对象 **`Parent.prototype`** ！！！（请好好理解一下这句话，对照第一节中第二张指向图）

对照第一节第一张神图的简单的解释:

```js
function Foo() {} // 父构造函数
let f1 = new Foo();
f1.__proto__ === Foo.prototype; // 此时有该对应关系
```

```js
Child.prototype = new Parent();
Child.prototype.__proto__ === Parent.prototype;
```

以上可以自行验证。

回归正题，我们现在仅仅需要 `Child.prototype.__proto__ = Parent.prototype` 这样的的转变，这步在 `new` 构造函数中在第二步完成，但是 `new` 还会继续执行 第三步：**将这个空对象赋值给构造函数内部的 this，并执行构造函数逻辑。** 所以，这一步其实是多余的。

所以，我们可以用 第一节中提到的，ES5 新规中的 `Object.create(proto, [propertiesObject])` 来解决。它的效果如下:

```js
Object.create(Parent);
// 核心原理如下:
let obj = {};
Object.setPrototypeOf(obj, Parent);
// 此方法等效于 obj.__proto__ = Parent
```

`Object.setPrototypeOf` 后面还会出场，咱继续按下不表，只需知道里面有这个就行。

直接就完成了原型的转变，没有了 `new` 过程中的“副作用”。

### 2.4 较为完善的组合继承

通过上面的理解，我们可以得到最终的组合继承方案，将 **盗用构造函数** 中的 `new` 构造函数这一步用 ES5 中的 `Object.create(proto, [propertiesObject])` 进行代替。不仅解决了 父构造函数的实例属性存在于 子构造函数 的原型上的问题，还无需 执行 `Parent` 构造函数两遍。

```js
function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
Parent.prototype.sayName = function () {
  console.log(this.name);
};

function Son(name, age) {
  Parent.call(this, name); // 继承Patent
  this.age = age;
}
// Son.prototype = new Patent(); // 用 Object.create() 代替
Son.prototype = Object.create(Parent.prototype); // 继承Parent原型上的属性
Son.prototype.constructor = Son; // 指回自身, 修复constructor

Son.prototype.sayAge = function () {
  console.log(this.age);
};
```

这种继承方式，已经很完美了，但是还是有一些小问题，但是都在现在的 `class` 中给修复了。

如静态属性和静态方法，在此时仍旧没能实现。看效果：

```js
// es5 中
function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
Parent.prototype.sayName = function () {
  console.log(this.name);
};

// 定义静态属性
Parent.age = 50;
// 定义静态方法
Parent.sayWord = function (word) {
  return word;
};

function Son(name, age) {
  Parent.call(this, name); // 继承Parent
  this.age = age;
}
// 继承父类的原型方法+原型属性
Son.prototype = Object.create(Parent.prototype); // 继承Parent原型上的属性
Son.prototype.constructor = Son; // 指回自身

Son.prototype.sayAge = function () {
  console.log(this.age);
};

let instance = new Son("张三", 19);
instance.colors.push("black");

console.log(Parent.sayWord("hello world"));
// print hello world

console.log(Son.sayWord("hello world")); // 未获取到静态方法
// print TypeError: Son.sayWord is not a function

console.log(instance.sayWord("hello world")); //  实例 更 无法获取到静态方法
// print TypeError: instance.sayWord is not a function
```

### 2.5 最终的组合式继承

那如何继承构造函数 `Parent` 中的静态方法呢? 其实很简单嘛，直接 `Child.__proto__ = Parent` 就行了。需要注意的是 `__proto__` 是最先在浏览器上支持，现在已在 ES6 中被引入。

或者使用 ES6 的另一语法，即第一节中提到的 `Object.setPrototypeOf(obj, prototype)` 方法设置一个指定的对象的原型 ( 即, 内部`[[Prototype]]`属性）到另一个对象或 `null`。即： `Object.setPrototypeOf(Child, Parent)` ，就完成了静态属性/方法 继承。

没看明白对不对? 一句话 `Object.setPrototypeOf(Child, Parent)` 等效于 `Child.__proto__ = Parent` 。

另外，希望你还能清楚的捋清楚 原型(`__proto__`) 和 构造函数原型对象(`Foo.Prototype`)的关系区别。没能明白，就再看看 [原型\_原型链\_new 的二三事](原型_原型链_new的二三事.md) 。没关系的，多看几次就会了。

你看，我给绕回来了吧 ψ(｀ ∇´)ψ ，看最后的封装代码：

```js
function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
Parent.prototype.sayName = function () {
  console.log(this.name);
};

// 定义静态属性
Parent.age = 50;
// 定义静态方法
Parent.sayWord = function (word) {
  return word;
};

function Son(name, age) {
  Parent.call(this, name); // 1. 继承Parent
  this.age = age;
}
// 继承父类的原型方法+原型属性
Son.prototype = Object.create(Parent.prototype); // 2. 继承Parent原型上的属性
Son.prototype.constructor = Son; // 3. 指回自身

// 4. 静态属性/方法 继承
if (Object.setPrototypeOf) {
  // es6 中支持
  Object.setPrototypeOf(Son, Parent);
} else if (Son.__proto__) {
  // 浏览器中支持
  Object.__proto__ = Parent;
}

Son.prototype.sayAge = function () {
  console.log(this.age);
};

let instance = new Son("张三", 19);

console.log(Parent.sayWord("hello world"));
// print hello world

console.log(Son.sayWord("hello world"));
// print hello world
```

希望，你看完能够有所收获。谢谢你的时间。

## 引用资料

[一文看懂 JS 的继承](https://www.freecodecamp.org/chinese/news/inheritance-in-js/)
