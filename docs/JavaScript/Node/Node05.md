---
title: MySql 基础
icon: nodeJS
date: 2023-06-01
category:
  - javascript
tag:
  - node
---

# MySql 基础

关系模型把数据看作是一个二维表格，任何数据都可以通过行号+列号来唯一确定，它的数据模型看起来就是一个 Excel 表：

```markdown
# Excel 表形式

┌─────┬─────┬─────┬─────┬─────┐
│ │ │ │ │ │
├─────┼─────┼─────┼─────┼─────┤
│ │ │ │ │ │
├─────┼─────┼─────┼─────┼─────┤
│ │ │ │ │ │
├─────┼─────┼─────┼─────┼─────┤
│ │ │ │ │ │
└─────┴─────┴─────┴─────┴─────┘
```

### 数据类型

对于一个关系表，除了定义每一列的名称外，还需要定义每一列的数据类型。关系数据库支持的标准数据类型包括数值、字符串、时间等：

| 名称           | 类型           | 说明                                                                                       |
| :------------- | :------------- | :----------------------------------------------------------------------------------------- |
| INT            | 整型           | 4 字节整数类型，范围约+/-21 亿                                                             |
| **BIGINT**     | 长整型         | 常用作主键，8 字节整数类型，范围约+/-922 亿亿                                              |
| REAL           | 浮点型         | 4 字节浮点数，范围约+/-1038                                                                |
| DOUBLE         | 浮点型         | 8 字节浮点数，范围约+/-10308                                                               |
| DECIMAL(M,N)   | 高精度小数     | 由用户指定精度的小数，例如，DECIMAL(20,10)表示一共 20 位，其中小数 10 位，通常用于财务计算 |
| CHAR(N)        | 定长字符串     | 存储指定长度的字符串，例如，CHAR(100)总是存储 100 个字符的字符串                           |
| **VARCHAR(N)** | 变长字符串     | 存储可变长度的字符串，例如，VARCHAR(100)可以存储 0~100 个字符的字符串                      |
| **BOOLEAN**    | 布尔类型       | 存储 True 或者 False                                                                       |
| DATE           | 日期类型       | 存储日期，例如，2018-06-22                                                                 |
| TIME           | 时间类型       | 存储时间，例如，12:20:59                                                                   |
| DATETIME       | 日期和时间类型 | 存储日期+时间，例如，2018-06-22 12:20:59                                                   |

上面的表中列举了最常用的数据类型。很多数据类型还有别名，例如，`REAL`又可以写成`FLOAT(24)`。还有一些不常用的数据类型，例如，`TINYINT`（范围在 0~255）。各数据库厂商还会支持特定的数据类型，例如`JSON`。

选择数据类型的时候，要根据业务规则选择合适的类型。通常来说，`BIGINT`能满足整数存储的需求，`VARCHAR(N)`能满足字符串存储的需求，这两种类型是使用最广泛的。

## 什么是 SQL?

**SQL**是**Structured Query Language**，称之为结构化查询语言，简称 SQL。

使用 SQL 编写出来的语句，就称之为 SQL 语句，SQL 语句可以用于对数据库进行操作。

> **SQL 语言关键字不区分大小写！！！**但是，针对不同的数据库，对于表名和列名，有的数据库区分大小写，有的数据库不区分大小写。同一个数据库，有的在 Linux 上区分大小写，有的在 Windows 上不区分大小写。
>
> 因此，最好统一标准：
>
> - SQL 关键字（如 CREATE、TABLE、SHOW 等等）总是大写，以示突出，表名和列名均使用小写。
> - 一条语句结束后，需要以 **`;`** 结尾;
> - 如果遇到关键字作为表明或者字段名称，可以使用 **` `` `** 包裹。

## 主键

对于关系表，有个很重要的约束，就是任意两条记录不能重复。不能重复不是指两条记录不完全相同，而是指能够通过某个字段唯一区分出不同的记录，这个字段被称为*主键*。

**选取主键的一个基本原则是：不使用任何业务相关的字段作为主键。**

作为主键最好是完全业务无关的字段，我们一般把这个字段命名为`id`。常见的可作为`id`字段的类型有：

1. 自增整数类型：数据库会在插入数据时自动为每一条记录分配一个自增整数，这样我们就完全不用担心主键重复，也不用自己预先生成主键；
2. 全局唯一 GUID 类型：使用一种全局唯一的字符串作为主键，类似`8f55d96b-8acc-4636-8cb8-76bf8abc2f57`。GUID 算法通过网卡 MAC 地址、时间戳和随机数保证任意计算机在任意时间生成的字符串都是不同的，大部分编程语言都内置了 GUID 算法，可以自己预算出主键。

对于大部分应用来说，通常自增类型的主键就能满足需求。我们在`students`表中定义的主键也是`BIGINT NOT NULL AUTO_INCREMENT`类型。

## 索引

**在关系数据库中，如果有上万甚至上亿条记录，在查找记录的时候，想要获得非常快的速度，就需要使用索引。**

索引是关系数据库中对某一列或多个列的值进行预排序的数据结构。通过使用索引，可以让数据库系统不必扫描整个表，而是直接定位到符合条件的记录，这样就大大加快了查询速度。

### 创建索引

对于`students`表：

| id  | class_id | name | gender | score |
| :-- | :------- | :--- | :----- | :---- |
| 1   | 1        | 小明 | M      | 90    |
| 2   | 1        | 小红 | F      | 95    |
| 3   | 1        | 小军 | M      | 88    |

如果要经常根据`score`列进行查询，就可以对`score`列创建索引：

```sql
ALTER TABLE students
ADD INDEX idx_score (score);
```

使用`ADD INDEX idx_score (score)`就创建了一个名称为`idx_score`，使用列`score`的索引。索引名称是任意的，索引如果有多列，可以在括号里依次写上，例如：

```sql
ALTER TABLE students
ADD INDEX idx_name_score (name, score);
```

索引的效率取决于索引列的值是否散列，即该列的值如果越互不相同，那么索引效率越高。反过来，如果记录的列存在大量相同的值，例如`gender`列，大约一半的记录值是`M`，另一半是`F`，因此，对该列创建索引就没有意义。

可以对一张表创建多个索引。索引的优点是提高了查询效率，缺点是在插入、更新和删除记录时，需要同时修改索引，因此，索引越多，插入、更新和删除记录的速度就越慢。

**对于主键，关系数据库会自动对其创建主键索引。使用主键索引的效率是最高的，因为主键会保证绝对唯一。**

## CRUD 增删改查

CRUD：Create、Retrieve、Update、Delete。

### 查 SELECT

1. 基本查询: `SELECT * FROM <表名>`

使用 SELECT 查询的基本语句`SELECT * FROM <表名>`可以查询一个表的所有行和所有列的数据。

SELECT 查询的结果是一个二维表。

2. 条件查询: `SELECT * FROM <表名> WHERE <条件表达式>`

- `AND`: 条件表达式可以用`<条件1> AND <条件2>`表达满足条件 1 并且满足条件 2。

- `OR`: 第二种条件是`<条件1> OR <条件2>`，表示满足条件 1 或者满足条件 2。
- `NOT`: 第三种条件是`NOT <条件>`，表示“不符合该条件”的记录。
- 如果不加括号，条件运算按照`NOT`、`AND`、`OR`的优先级进行，即`NOT`优先级最高，其次是`AND`，最后是`OR`。加上括号可以改变优先级。

### 常用的条件表达式

| 条件                 | 表达式举例 1    | 表达式举例 2     | 说明                                                |
| :------------------- | :-------------- | :--------------- | :-------------------------------------------------- |
| 使用=判断相等        | score = 80      | name = 'abc'     | 字符串需要用单引号括起来                            |
| 使用>判断大于        | score > 80      | name > 'abc'     | 字符串比较根据 ASCII 码，中文字符比较根据数据库设置 |
| 使用>=判断大于或相等 | score >= 80     | name >= 'abc'    |                                                     |
| 使用<判断小于        | score < 80      | name <= 'abc'    |                                                     |
| 使用<=判断小于或相等 | score <= 80     | name <= 'abc'    |                                                     |
| 使用<>判断不相等     | score <> 80     | name <> 'abc'    |                                                     |
| 使用 LIKE 判断相似   | name LIKE 'ab%' | name LIKE '%bc%' | %表示任意字符，例如'ab%'将匹配'ab'，'abc'，'abcd'   |

3. 投影查询: `SELECT 列1 别名1, 列2 别名2, 列3 别名3 FROM ...`

   使用`SELECT *`表示查询表的所有列，使用`SELECT 列1, 列2, 列3`则可以仅返回指定列，这种操作称为投影。

   `SELECT`语句可以对结果集的列进行重命名。

4. 排序:

   - 升序 `ORDER BY`，默认升序，效果等同后面加上 `ASC`

     score 按照升序排序: `SELECT id, name, gender, score FROM students ORDER BY score;`

   - 倒序（Descending） 末尾加上 `DESC`

     按 score 从高到低: `SELECT id, name, gender, score FROM students ORDER BY score DESC;`

   - 若还有第二键名则继续在 `ORDER BY` 后面添加

5. 分页查询: `LIMIT <N-M> OFFSET <M>`

   分页实际上就是从结果集中“截取”出第 M~N 条记录。这个查询可以通过`LIMIT <N-M> OFFSET <M>`子句实现。

   分页查询的关键在于，首先要确定每页需要显示的结果数量`pageSize`，然后根据当前页的索引`pageIndex`（从 1 开始），确定`LIMIT`和`OFFSET`应该设定的值：

   - `LIMIT`总是设定为`pageSize`；
   - `OFFSET`计算公式为`pageSize * (pageIndex - 1)`。

6. 聚合查询: 对于统计总数、平均数这类计算，SQL 提供了专门的聚合函数，使用聚合函数进行查询，就是聚合查询，它可以快速获得结果。

   - `COUNT(*)`表示查询所有列的行数，要注意聚合的计算结果虽然是一个数字，但查询的结果仍然是一个二维表，只是这个二维表只有一行一列，并且列名是`COUNT(*)`。

     使用聚合查询时，我们应该给列名设置一个别名，便于处理结果：`SELECT COUNT(*) as num FROM students;`

   除了`COUNT()`函数外，SQL 还提供了如下聚合函数：

   | 函数 | 说明                                   |
   | :--- | :------------------------------------- |
   | SUM  | 计算某一列的合计值，该列必须为数值类型 |
   | AVG  | 计算某一列的平均值，该列必须为数值类型 |
   | MAX  | 计算某一列的最大值                     |
   | MIN  | 计算某一列的最小值                     |

   注意，`MAX()`和`MIN()`函数并不限于数值类型。如果是字符类型，`MAX()`和`MIN()`会返回排序最后和排序最前的字符。

7. 多表查询: `SELECT * FROM <表1> <表2>`。查询的结果是一个二维表。

   为避免俩张表有相同的列名，应当适当的利用投影查询的设置列的别名给来自俩个表的不同列添加别名。

   多表查询时，要使用`表名.列名`这样的方式来引用列和设置别名，这样就避免了结果集的列名重复问题。但是，用`表名.列名`这种方式列举两个表的所有列实在是很麻烦，所以 SQL 还允许给表设置一个别名，让我们在投影查询中引用起来稍微简洁一点：

   ```sql
   SELECT
       s.id sid,
       s.name,
       s.gender,
       s.score,
       c.id cid,
       c.name cname
   FROM students s, classes c;
   ```

8. 连接查询: `INNER JOIN`。连接查询是另一种类型的多表查询。连接查询对多个表进行 JOIN 运算，简单地说，就是先确定一个主表作为结果集，然后，把其他表的行有选择性地“连接”在主表结果集上。

   NNER JOIN 查询的写法是：

   1. 先确定主表，仍然使用`FROM <表1>`的语法；
   2. 再确定需要连接的表，使用`INNER JOIN <表2>`的语法；
   3. 然后确定连接条件，使用`ON <条件...>`，这里的条件是`s.class_id = c.id`，表示`students`表的`class_id`列与`classes`表的`id`列相同的行需要连接；
   4. 可选：加上`WHERE`子句、`ORDER BY`等子句。

   使用别名不是必须的，但可以更好地简化查询语句。

   ```sql
   SELECT s.id, s.name, s.class_id, c.name class_name, s.gender, s.score
   FROM students s
   INNER JOIN classes c
   ON s.class_id = c.id;
   ```

### 修改数据

- `INSERT`：插入新记录；

  ```sql
  INSERT INTO <表名> (字段1, 字段2, ...) VALUES (值1, 值2, ...);
  ```

  注意，主键如`id`字段是一个自增主键，它的值可以由数据库自己推算出来。此外，如果一个字段有默认值，那么在`INSERT`语句中也可以不出现。

- `REPLACE`: 插入或**替换**记录;

  如果我们希望插入一条新记录（INSERT），但如果记录已经存在，就先删除原记录，再插入新记录。此时，可以使用`REPLACE`语句，这样就不必先查询，再决定是否先删除再插入：

  ```sql
  REPLACE INTO students (id, class_id, name, gender, score) VALUES (1, 1, '小明', 'F', 99);
  ```

- `INSERT INTO`: 插入或更新;

  如果我们希望插入一条新记录（INSERT），但如果记录已经存在，就更新该记录，此时，可以使用`INSERT INTO ... ON DUPLICATE KEY UPDATE ...`语句：

  ```sql
  INSERT INTO students (id, class_id, name, gender, score) VALUES (1, 1, '小明', 'F', 99) ON DUPLICATE KEY UPDATE name='小明', gender='F', score=99;
  ```

- `INSERT IGNORE INTO`: 插入或忽略;

  如果我们希望插入一条新记录（INSERT），但如果记录已经存在，就啥事也不干直接忽略，此时，可以使用`INSERT IGNORE INTO ...`语句：

  ```sql
  INSERT IGNORE INTO students (id, class_id, name, gender, score) VALUES (1, 1, '小明', 'F', 99);
  ```

- `UPDATE`：更新已有记录；

  ```sql
  UPDATE <表名> SET 字段1=值1, 字段2=值2, ... WHERE ...;
  ```

  `UPDATE`语句的`WHERE`条件和`SELECT`语句的`WHERE`条件其实是一样的，因此完全可以一次更新多条记录。

- `DELETE`：删除已有记录。

  ```sql
  DELETE FROM <表名> WHERE ...;
  ```

  注意`DELETE`语句的`WHERE`条件也是用来筛选需要删除的行，因此和`UPDATE`类似，`DELETE`语句也可以一次删除多条记录：

  ```sql
  DELETE FROM students WHERE id>=5 AND id<=7;
  -- 查询并观察结果:
  SELECT * FROM students;
  ```

  要特别小心的是，和`UPDATE`类似，不带`WHERE`条件的`DELETE`语句会删除整个表的数据：

  ```sql
  DELETE FROM students;
  ```

  这时，整个表的所有记录都会被删除。所以，在执行`DELETE`语句时也要非常小心，最好先用`SELECT`语句来测试`WHERE`条件是否筛选出了期望的记录集，然后再用`DELETE`删除。

## 数据库管理

查看所有数据库:

```sql
mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| shici              |
| sys                |
| test               |
| school             |
+--------------------+
```

其中，`information_schema`、`mysql`、`performance_schema`和`sys`是系统库，不要去改动它们。其他的是用户创建的数据库。

要创建一个新数据库，使用命令：

```sql
mysql> CREATE DATABASE test;
Query OK, 1 row affected (0.01 sec)
```

要删除一个数据库，使用命令：

```sql
mysql> DROP DATABASE test;
Query OK, 0 rows affected (0.01 sec)
```

注意：删除一个数据库将导致该数据库的所有表全部被删除。

对一个数据库进行操作时，要首先将其切换为当前数据库：

```sql
mysql> USE test;
Database changed
```

修改表就比较复杂。如果要给`students`表新增一列`birth`，使用：

```sql
ALTER TABLE students ADD COLUMN birth VARCHAR(10) NOT NULL;
```

要修改`birth`列，例如把列名改为`birthday`，类型改为`VARCHAR(20)`：

```sql
ALTER TABLE students CHANGE COLUMN birth birthday VARCHAR(20) NOT NULL;
```

要删除列，使用：

```sql
ALTER TABLE students DROP COLUMN birthday;
```

### 退出

`EXIT` 退出 Mysql。
