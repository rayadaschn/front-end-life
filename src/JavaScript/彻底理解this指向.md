---
title: 彻底理解 this 指向
icon: javascript
order: 4
category:
  - javascript
tag:
  - javascript

star: true
sticky: false
# navbar: false
# sidebar: false
# breadcrumb: false
# pageInfo: false
# contributors: false
# editLink: false
# lastUpdated: false
# prev: false
# next: false
# comment: false
# footer: false

# backtotop: false
---

# 彻底理解 this 指向

|`this` 指向纷繁复杂，笔者也是学习了多遍才算搞懂。常学常新，不同阶段看都有收获。

## 1. 什么是 `this`

在常见的面向对象语言（如 java、C++）中，`this` 通常只出现在 **类方法中** 。this 也是用于指代当前调用的对象，但是 JavaScript 中的 this 则更加灵活，因此，也是一大难点。

**一句话总结 this 的指向**： **“谁调用它， this 就指向谁”**。

**总结规律**：

- 在函数体中，非显性或隐式的简单调用函数时，在严格模式下，函数内的 this 会被绑定到 undefined 上，在非严格模式下则会被绑定到全局对象 window（浏览器）/global（node 环境） 上。
- 一般使用 new 方法调用构造函数时，构造函数内的 this 会被绑定到新创建的对象上。
- 一般通过 call/apply/bind 方法显示地调用函数时,函数体内的 this 会被绑定到指定参数的对象上。
- 一般通过上下文对象调用函数时，函数体内的 this 会被绑定到该对象上。
- 在箭头函数中，this 的指向是由外层（函数或全局）作用域来决定的。

_【注】本文接下来的运行环境均以 浏览器、 非严格模式进行说明。_

## 2. 绑定规则详谈

### 2.1 默认绑定

**默认绑定，即独立函数调用。** 也就是函数没有被绑定到具体某个对象上进行调用。

**情况一：** **普通直接调用**， 没有进行任何的对象关联，函数中的 this 指向 window。

```JavaScript
function foo() {
  console.log(this); // 没做任何关联
}
foo(); // window
```

**情况二：** **函数调用链（一个函数又调用另外一个函数）**， 但是**所有的函数调用 都没有被绑定到某个对象上**，函数中的 this **依旧指向 window**。

```javascript
function test1() {
  console.log(this); // window
  test2();
}
function test2() {
  console.log(this); // window
  test3();
}
function test3() {
  console.log(this); // window
}
test1();
```

**情况三【重点】：** **将函数作为参数，传入到另一个函数中**，此时仍然是独立调用，this 指向 window。**原因是在函数真正调用的位置，并没有进行任何的对象绑定，仍是一个独立函数的调用**。（你可以把它想象成，返回了一个独立函数的运行结果）

```javascript
function foo(func) {
  func(); // 独立调用
}

var obj = {
  name: "Job",
  bar: function () {
    console.log(this); // window
  },
};
foo(obj.bar);
```

如果你不是很理解，我们把上面的调用改造一下。

```javascript
const foo1 = {
  text: "foo1",
  fn: function () {
    console.log(this); // 1. 被foo2 调用时，此时是独立函数 this 指向 window
    return this.text;
  },
};

const foo2 = {
  text: "foo2",
  fn: function () {
    var fn = foo1.fn; // 此处是2.2节中的隐式丢失，下面会介绍到
    return fn(); // 此处返回的是 foo1.fn() 独立函数的调用结果
  },
};
console.log(foo2.fn()); // 2. undefined
```

_【注】上面的 `foo1`_ 内部的 this 注释是 解释整个运行时的状态。

### 2.2 隐式绑定

**隐式绑定的调用方式是通过某个具体的对象进行调用，也就是它的调用位置，是通过某个对象发起的函数调用，此时，this 会被隐式绑定到该对象上**。

**使用前提**：

- 必须在调用的 **`对象内部`** 有一个对函数的引用（比如一个属性）；
- 如果没有这样的引用，在进行调用时，会报找不到该函数的错误；
- 正是通过这个引用，间接的将 this 绑定到了这个对象上；

```javascript
function foo() {
  console.log(this); // 被obj对象调用，指向该对象
}

var obj1 = {
  name: "obj1",
  foo: foo,
};

obj1.foo(); // obj1， 由obj1调用，this指向 obj1

var obj2 = {
  name: "obj2",
  obj1: obj1,
};

obj2.obj1.foo(); // onj1， foo 的调用位置 依旧是 obj1，因此this还是指向 obj1
```

不要被上面的连续链式调用迷惑了！记住**谁调用，指向谁！**

我们利用隐式绑定再对上文 2.1 中的函数调用进行改造一下，使得 `foo2.fn` 的结果指向 foo 本身(不使用 bind 等绑定)。

```javascript
const foo1 = {
  text: "foo1",
  fn: function () {
    return this.text;
  },
};

const foo2 = {
  text: "foo2",
  fn: foo1.fn,
};
console.log(foo2.fn()); // foo2
```

**特殊情况： 隐式丢失**

在上文中，其实我们已经用到了隐式丢失这种方法，我们来简化一下：

```javascript
function foo() {
  console.log(this);
}

var obj1 = {
  name: "obj1",
  foo: foo,
};

var bar = obj1.foo; // 将obj1的foo 赋值给bar
bar(); // 输出 window：此时的bar 等价于该 foo独立函数
obj1.foo(); // 输出obj1： 区别于 bar 函数，此处是由 obj1进行位置调用foo函数，此处做了隐式绑定
```

**在上面的函数中， `foo` 最终被调用的位置是 `bar`，而 `bar` 在进行调用时没有绑定任何的对象，也就没有形成隐式绑定，相当于是一种默认绑定。**

### 2.3 显示绑定 bind、call、apply

在上文中的隐式绑定中，我们需要在调用对象内部包含被调用函数的引用，如果没有该引用，也需要改变 this 指向，我们此时就要用到显示绑定了，即 **bind** 、 **call** 和 **apply**：

三者的第一个参数都是显性的 **this 所指向的对象** <u>（若没有第一个参数，则传 **undefined** 或 **null**，此时默认指向全局 window）</u>，区别在于**后续需要传入的参数**，因此是称为显示绑定。

1. **bind**：第一个参数是 this 指向，后续为 参数列表，但是该参数列表可以分多次传入，且它改变 this 指向后不会立即执行，而是返回一个**永久改变 this 指向的函数**。

   ```javascript
   var arr = [9, 8, 5, 10, 2];
   var minArr = Math.min.bind(null, arr[0], arr[1], arr[2], arr[3]); // 不会立即执行
   console.log(minArr(arr[4])); // 输出结果为 2 ，分两次传参
   ```

2. **call**：第一个参数也是 this 指向，后续同 **bind** 一样传入一个参数列表，但是区别在于 **call 方法是 临时性改变一次原函数的 this 指向，并且会立即执行！**：

   ```javascript
   var arr = [9, 8, 5, 10, 2];
   console.log(Math.min.call(null, arr[0], arr[1], arr[2], arr[3], arr[4])); // 2
   ```

3. **apply**：第一个参数也是 this 指向，**第二个参数为函数接收的参数，以数组形式传入**。**apply 方法和 call 方法类似，只是临时性改变一次原函数的 this 指向，且立即执行**。

   ```javascript
   var arr = [9, 8, 5, 10, 2];
   console.log(Math.min.call(null, arr)); // 2
   ```

三者都在 **`Function.prototype`** 有原型函数，因此都可以直接进行调用。我们也可以利用 apply 手写一个简易的 bind 辅助函数：

```javascript
function foo() {
  console.log(this);
}
const obj = { name: "Job" };

function bind(func, obj) {
  return function () {
    return func.apply(obj, arguments);
  };
}

const bar = bind(foo, obj); // 永久性改变this指向 obj 对象

bar(); // obj对象
bar(); // obj对象
bar(); // obj对象
```

#### 特殊情况：内置函数的调用

在一些 JavaScript 的内置函数或者第三方库中的内置函数中，函数会要求我们传入另一个调用函数，且并不需要我们后续手动指执行，内置函数会自动帮助我们执行，这些函数里，其实也是显性绑定。以下举例一些常见案例。

1. **setTimeout**

   以 setTimeout 为例，这个函数中的 this 通常指向 window。其内部是利用 apply 将 this 绑定为全局对象。

   ```javascript
   setTimeout(function () {
     console.log(this); // window
   }, 1000);
   ```

2. 数组的 **forEach**

   数组中的 forEach 中传入的函数，打印也是 window 对象。与 setTimeout 区别在于：**默认情况下传入的函数是自动调用的（默认绑定），待传参后为显性绑定**：

   ```javascript
   var names = ["abc", "cba", "nba"];
   names.forEach(function (item) {
     console.log(this); // 未传参：默认绑定，三次均为 window
   });

   var obj = { name: "obj" };
   names.forEach(function (item) {
     console.log(this); // 传obj参数：显性绑定，三次均为 obj对象
   }, obj);
   ```

3. **div 元素的点击事件**

   在点击事件的回调中，this 的指向调用函数本身。如下所示，div 元素 在发生点击时，执行传入的回调函数在被调用时，会将 box 对象绑定到该函数中：

   ```vue
   <template>
     <div class="box"></div>
   </template>
   <script>
   var box = document.querySelector(".box");
   box.onclick = function () {
     console.log(this); // box对象
   };
   </script>
   ```

### 2.4 new 绑定

JavaScript 中的函数可以当做一个类的构造函数来使用，也就是使用 new 关键字。

使用 new 关键字来调用函数时，会执行如下的操作：

- 1.创建一个全新的对象；
- 2.这个新对象会被执行 Prototype 连接；
- 3.这个新对象会绑定到函数调用的 this 上（将构造函数的 this 指向这个新的对象）；
- 4.**如果函数没有返回其他对象**，表达式会返回这个新对象。比如在 construct 构造函数里返回一个常量，则结果仍然为指向该实例。

也可以用如下代码表示：

```javascript
var obj = {};
obj.__proto__ = Foo.prototype;
Foo.call(obj);
```

### 2.5 this 优先级

基本上 this 的调用为以上四种情况，优先级排序为： `new 绑定 > 显示绑定（bind）> 隐式绑定 > 默认绑定`

默认情况下， 默认的规则最低，有其它规则存在则调用其它规则。

1. 显示绑定（bind）> 隐式绑定

   ```javascript
   function foo() {
     console.log(this);
   }

   var obj1 = {
     name: "obj1",
     foo: foo,
   };

   var obj2 = {
     name: "obj2",
     foo: foo,
   };

   // 隐式绑定
   obj1.foo(); // obj1
   obj2.foo(); // obj2

   // 隐式绑定和显示绑定同时存在
   obj1.foo.call(obj2); // obj2, 说明显式绑定优先级更高
   ```

2. new 绑定 > 显示绑定（bind）

   注意，new 绑定和 call、apply 是不允许同时使用的！它们是立即执行。

   ```javascript
   function foo() {
     console.log(this);
   }
   
   var obj = {
     name: "obj",
   };
   
   // var foo = new foo.call(obj);
   var bar = foo.bind(obj);
   var foo = new bar(); // 打印foo, 说明使用的是new绑定
   ```

## 3. 特殊规则

### 3.1 间接函数引用

```javascript
function foo() {
  console.log(this);
}

var obj1 = {
  name: "obj1",
  foo: foo,
};

var obj2 = { name: "obj2" };

obj1.foo(); // obj1对象
(obj2.foo = obj1.foo)(); // window
```

在上述实例中，赋值 `(obj2.foo = obj1.foo)` 的结果是 foo 函数，而后相当于 **foo 函数被直接调用**，因此是默认绑定，且未被其它对象所调用，因此结果是 window。

### 3.2 箭头函数

在 ES6 出来之前，在古早的项目里，当我们调用一些第三方内置函数时，我们经常能看到一些 var \_this = this 的代码。实际上，就是为了保存外层 this 指向，等到后续内部改变了 this 指向后，依旧能照常拿到外层的对象。我们看下面案例。

```javascript
var obj = {
  data: [],
  getData: function () {
    var _this = this; // 1. 保存外部 obj 的指向
    setTimeout(function () {
      // 模拟获取到的数据
      var res = ["abc", "cba", "nba"];
      _this.data.push(...res); // 2. 此时this为window, 但依旧要访问外部 obj 对象
    }, 1000);
  },
};

obj.getData();
```

但是有了 箭头函数 之后，就不用这一步操作了，**因为箭头函数并不绑定 this 对象，那么 this 引用就会从上层作用域中找到对应的 this** ！！！所以箭头函数不适用上述所有规则。

```javascript
var obj = {
  data: [],
  getData: function () {
    setTimeout(() => {
      // 模拟获取到的数据
      var res = ["abc", "cba", "nba"];
      this.data.push(...res); // 未绑定this，因此this 的引用向上查找，得到上层作用域 obj 的指向
    }, 1000);
  },
};

obj.getData();
```

当然，我们可以继续俄罗斯套娃，将上述中的 **getData 也改成一个箭头函数**，那么 setTimeout 中的回调函数中的 this 指向则继续向上查找，此处找到了全局作用域为 window 了。

```javascript
var obj = {
  data: [],
  getData: () => {
    setTimeout(() => {
      console.log(this); // window
    }, 1000);
  },
};

obj.getData();
```

## 4. 测试练习

好了，基本上 this 的指向就是以上这些，笔者也是反反复复学习了很多次。常学常新，忘记了也没事，把规范翻出来看看，就是了，没什么问题~

#### 4.1 **间接函数引用**

```javascript
var name = "window";
var person = {
  name: "person",
  sayName: function () {
    console.log(this.name);
  },
};
function sayName() {
  var sss = person.sayName;
  sss();
  person.sayName();
  person.sayName();
  (b = person.sayName)();
}
sayName();
```

```javascript
// -- 答案 --
function sayName() {
  var sss = person.sayName; // window 隐式绑定
  sss(); // window 隐式绑定,但是是独立函数调用
  person.sayName(); // person, 隐式绑定
  person.sayName(); // person, 隐式绑定，和上述等同，带小括号不带小括号没区别
  (b = person.sayName)(); // window, 间接引用，独立函数调用
}
```

#### 4.2 **定义对象，不产生作用域**

```javascript
var name = "window";
var person1 = {
  name: "person1",
  foo1: function () {
    console.log(this.name);
  },
  foo2: () => console.log(this.name),
  foo3: function () {
    return function () {
      console.log(this.name);
    };
  },
  foo4: function () {
    return () => {
      console.log(this.name);
    };
  },
};

var person2 = { name: "person2" };

person1.foo1();
person1.foo1.call(person2);

person1.foo2();
person1.foo2.call(person2);

person1.foo3()();
person1.foo3.call(person2)();
person1.foo3().call(person2);

person1.foo4()();
person1.foo4.call(person2)();
person1.foo4().call(person2);
```

```javascript
// -- 答案 --
person1.foo1(); // 隐式绑定, person1
person1.foo1.call(person2); // 显示绑定, person2

person1.foo2(); // 箭头函数,向上层查找,找到全局 window
person1.foo2.call(person2); // 箭头函数，不改变this指向，向上查找依旧为 window

// 获取到foo3，但是调用位置是全局作用于下，所以是默认绑定window
person1.foo3()(); // 独立调用, window
// foo3显示绑定到person2中， 但是拿到的返回函数依然是在全局下调用，所以依然是window
person1.foo3.call(person2)(); // 默认绑定,但是外加显示绑定,将默认绑定内的this改为 person2，但是返回结果为独立函数调用，结果为 window
// 拿到foo3返回的函数，通过显示绑定到person2中，所以是person2
person1.foo3().call(person2); // 独立函数调用，但是外加显示绑定，因此结果为显示绑定 person2

person1.foo4()(); // person1, 独立函数返回箭头函数,向上作用域查找到 person1
person1.foo4.call(person2)(); // 独立函数显性绑定person2,而后返回箭头函数,向上查找, 此时this在 person2作用域内， 结果为 person2
person1.foo4().call(person2); // 独立函数返回的箭头函数,不对this进行改变,结果依旧为 person1
```

#### 4.3 **构造函数中定义函数，该函数的上级作用域是构造函数**

```javascript
var name = "window";
function Person(name) {
  this.name = name;
  (this.foo1 = function () {
    console.log(this.name);
  }),
    (this.foo2 = () => console.log(this.name)),
    (this.foo3 = function () {
      return function () {
        console.log(this.name);
      };
    }),
    (this.foo4 = function () {
      return () => {
        console.log(this.name);
      };
    });
}
var person1 = new Person("person1");
var person2 = new Person("person2");

person1.foo1();
person1.foo1.call(person2);

person1.foo2();
person1.foo2.call(person2);

person1.foo3()();
person1.foo3.call(person2)();
person1.foo3().call(person2);

person1.foo4()();
person1.foo4.call(person2)();
person1.foo4().call(person2);
```

```javascript
// -- 答案 --
person1.foo1(); // 隐式绑定, person1
person1.foo1.call(person2); // 显示绑定 person2

person1.foo2(); // 箭头函数, 向上查找 person1
person1.foo2.call(person2); // 箭头函数,不改变this指向,向上查找 为 person1

person1.foo3()(); // 独立函数调用, 返回结果为 window
person1.foo3.call(person2)(); // 独立函数调用,显示绑定 foo3内this为person2, 但返回独立函数结果为 window
person1.foo3().call(person2); // 独立函数调用,放回结果显示绑定 person2, 结果为 person2

person1.foo4()(); // 独立函数 返回箭头函数, 向上查找为person1
person1.foo4.call(person2)(); // 独立函数, 显示绑定foo4为person2, 返回箭头函数向上查找到 person2
person1.foo4().call(person2); // 独立函数,返回箭头函数, 箭头函数不改变 this 指向,结果为person1
```

#### 4.4 **区分作用域**

```javascript
var name = "window";
function Person(name) {
  this.name = name;
  this.obj = {
    name: "obj",
    foo1: function () {
      return function () {
        console.log(this.name);
      };
    },
    foo2: function () {
      return () => {
        console.log(this.name);
      };
    },
  };
}
var person1 = new Person("person1");
var person2 = new Person("person2");

person1.obj.foo1()();
person1.obj.foo1.call(person2)();
person1.obj.foo1().call(person2);

person1.obj.foo2()();
person1.obj.foo2.call(person2)();
person1.obj.foo2().call(person2);
```

```javascript
// -- 答案 --
person1.obj.foo1()(); // 默认绑定下的独立函数调用 window
person1.obj.foo1.call(person2)(); // 默认绑定的foo1 显性绑定为person2,但返回的是独立函数调用结果依旧为 window
person1.obj.foo1().call(person2); // 默认绑定下返回的独立函数调用,被显性绑定为person2,所以结果为 person2

person1.obj.foo2()(); // 默认绑定下的 箭头函数,向上查找结果为 obj
person1.obj.foo2.call(person2)(); // 默认绑定的 foo1 显示绑定为 person2, 因此箭头函数向上查找到 person2
person1.obj.foo2().call(person2); // 默认绑定返回的箭头函数,但是箭头函数不改变this,因此结果为 obj
```
