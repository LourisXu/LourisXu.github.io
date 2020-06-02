---
title: Java设计模式
tags:
  - java
translate_title: java-design-pattern
date: 2020-05-17 11:31:13
toc: true
---

**Java初始化顺序:**
先进行类(先父类再子类)静态变量和静态初始化块(二者根据定义先后顺序进行)，而后类（先父类再子类）变量和初始化块(二者根据定义顺序进行)以及构造器，不考虑重载和覆盖的情况下。

**C++与Java的异同点:**
- C++的数值型字节与机器字长有关，Java无关
- C++允许默认参数，Java没有
- C++允许多继承，Java单继承但可以多个接口
- C++允许按值调用和按引用调用，Java只有按值调用(Java的对象变量皆引用)
- Java中所有继承都为公有继承，而没有C++的私有和保护继承。java的`super`调用父类方法，C++`父类名::method`调用
- 关键字 this 有两个用途： 一是引用隐式参数，二是调用该类其他的构造器 ， 同样，super 关键字也有两个用途：一是调用超类的方法，二是调用超类的构造器。
- C++重写，即多态的实现需要父类相应**虚函数**，而Java不需要设置为虚函数。多态都通过运行时的动态**绑定实现**。Java中如果不希望让一个方法具有虚拟特征， 可以将它标记为 final。
- C++多态实现需要基类指针或引用指向子类(正常类类型只能调用子类的父类方法，即没有多态性)，Java对象就是引用基类指向子类即可。
- **协变返回类型：**<span style="border-bottom:1px solid">①在C++中，只要原来的返回类型是指向基类的指针或引用，新的返回类型是指向派生类的指针或引用，覆盖的方法就可以改变返回类型；</span>②java中，方法的名字和参数列表称为方法的签名。例如， f(int) 和 f(String)是两个具有相同名字， 不同签名的方法。**如果在子类中定义了一个与超类签名相同的方法，那么子类中的这个方法就覆盖了超类中的这个相同签名的方法。** 不过，返回类型不是签名的一部分， 因此，<span style="border-bottom:1px solid">在覆盖方法时， 一定要保证返回类型的兼容性。 允许子类将覆盖方法的返回类型定义为原返回类型的子类型。</span>
- **在覆盖一个方法的时候，子类方法不能低于超类方法的可见性。** 特别是， 如果超类方法是 public, 子类方法一定要声明为 public。经常会发生这类错误：在声明子类方法的时候，遗漏了 public 修饰符。此时，编译器将会把它解释为试图提供更严格的访问权限。
- 如果是 <span style="border-bottom:1px solid">private 方法、 static 方法、 final 方法或者构造器</span>， 那么编译器将可以准确地知道应该调用哪个方法， 我们将这种调用方式称为**静态绑定(static binding)** 。 与此对应的是，调用的方法依赖于隐式参数的实际类型，并且在运行时实现 **动态绑定** 。
- **①不允许扩展的类被称为 final 类；** ②类中的特定方法也可以被声明为 final。如果这样做，子类就不能覆盖这个方法。final类的所有方法自动地成为final方法；③域也可以被声明为 final。 对于 final 域来说，构造对象之后就不允许改变它们的值了。<span style="border-bottom:1px solid">不过， 如果将一个类声明为 final， 只有其中的方法自动地成为 final,而不包括域。</span>**例如， Calendar类中的 getTime 和 setTime 方法都声明为 final。同样地， String 类也是 final 类**
- C++内联函数需要加inline关键字，而Java中虚拟机会自动判断，如果一个方法没有被覆盖并且很短， 编译器就能够对它进行优化处理， 这个过程为称为内联
( inlining )。然而，如果 getName 在另外一个类中被覆盖， 那么编译器就无法知道覆盖的代码将会做什么操作，因此也就不能对它进行内联处理了。
- 多态时，父类只能调用子类重写的函数，其他函数不能调用。
- Java除了抽象方法之外，抽象类还可以包含具体数据和具体方法。抽象方法充当着占位的角色，它们的具体实现在子类中。扩展抽象类可以有两种选择。**一种是在抽象类中定义部分抽象类方法或不定义抽象类方法，<span style="border-bottom:1px solid">这样就必须将子类也标记为抽象类（即，子类没有将基类的所有抽象方法定义，就需要将子类标记为抽象类）；另一种是定义全部的抽象方法，这样一来，子类就不是抽象的了。</span>**。类即使不含抽象方法，也可以将类声明为抽象类。抽象类不能被实例化，但可以定义一个抽象类的对象变量， 但是它只能引用非抽象子类的对象。在C++中， 有一种在方法尾部用`=0`标记的抽象方法，称为**纯虚函数**，类只要有一个纯虚函数，就为抽象类。<span style="border-bottom:1px solid">在 C++ 中， 没有提供用于表示抽象类的特殊关键字。</span>
- 1)仅对本类可见 private。2)对所有类可见 public：3)对本包和所有子类可见 protected。4)对本包可见—默认（很遗憾，) 不需要修饰符。
- 类的成员变量默认值：数值型为0，布尔型为false，String为NULL，对象为NULL，字符型为空字符。
- 类的euqals方法：**①如果子类能够拥有自己的相等概念， 则对称性需求将强制采用 getClass 进行检测；②如果由超类决定相等的概念，那么就可以使用 instanceof进行检测**， 这样可以在不同子类的对象之间进行相等的比较。
- @Override 对覆盖超类的方法进行标记避免重写时参数类型不同报错。
- 在接口中**不能包含实例域或静态方法**，但却可以包含常量。接口的方法默认为公有，不必写出public。在 Java SE 8 中，允许在接口中增加静态方法。理论上讲，没有任何理由认为这是不合法的。只是这有违于将接口作为抽象规范的初衷。静态方法通常放在伴随类中。
- 只有内部类可以是私有类，而常规类只可以具有包可见性，或公有可见性。
- 与其他内部类相比较，局部类还有一个优点。它们不仅能够访问包含它们的外部类， 还可以访问局部变量。**<span style="border-bottom:1px solid">不过，那些局部变量必须事实上为 final。有些情况需要更新变量，补救的方法是使用一个长度为 1 的数组，然后更新数组元素值即可！</span>**
```
©Override public boolean equals(Object other)
//写另一个equals方法
public boolean equa1s(Employee other){}
```
- equals特性：
1 ) 自反性：对于任何非空引用 x, x.equals(?0 应该返回 truec
2 ) 对称性: 对于任何引用 x 和 y, 当且仅当 y.equals(x) 返回 true , x.equals(y) 也应该返回 true。
3 ) 传递性： 对于任何引用 x、 y 和 z, 如果 x.equals(y) 返 N true， y.equals(z) 返回 true, x.equals(z) 也应该返回 true。 4 ) 一致性： 如果 x 和 y 引用的对象没有发生变化，反复调用 x.eqimIS(y) 应该返回同样的结果。
5 ) 对于任意非空引用 x, x.equals(null) 应该返回 false

---

## equals方法
**下面给出编写一个完美的 equals 方法的建议：**
1 ) 显式参数命名为 otherObject, 稍后需要将它转换成另一个叫做 other 的变量。
```java
public boolean euqals(Object otherObject){}
```
2 ) 检测 this 与 otherObject 是否引用同一个对象：
```java
if (this = otherObject) return true;
```
这条语句只是一个优化。实际上，这是一种经常采用的形式。因为计算这个等式要比一个一个地比较类中的域所付出的代价小得多。
3 ) 检测 otherObject 是否为 null, 如 果 为 null, 返 回 false。这项检测是很必要的。
```java
if (otherObject = null) return false;
```
4 ) 比较 this 与 otherObject 是否属于同一个类。如果 equals 的语义在每个子类中有所改变，就使用 getClass 检测：
```java
if (getClass() != otherObject.getCIassO) return false;
```
如果所有的子类都拥有统一的语义，就使用 instanceof 检测：
```java
if (!(otherObject instanceof ClassName)) return false;
```
5 ) 将 otherObject 转换为相应的类类型变量：
```java
ClassName other = (ClassName) otherObject
```
6 ) 现在开始对所有需要比较的域进行比较了。使用 =比较基本类型域，使用 equals 比较对象域。如果所有的域都匹配， 就返回 true; 否则返回 false。
```java
return fieldl == other.field
&& Objects.equa1s(fie1d2, other.field2)
```
如果在子类中重新定义 equals, 就要在其中包含调用 `super.equals(other)`。

- 如果重新定义 equals方法，就必须重新定义 hashCode 方法。Equals 与 hashCode 的定义必须一致：如果 x.equals(y) 返回 true, 那么 x.hashCode( ) 就必
须与 y.hashCode( ) 具有相同的值。
```java
public int hashCode()
{
  return Objects,hash(name, salary, hireDay);
}
```
- ArrayList 类似于 C++ 的 vector 模板。ArrayList 与 vector 都是泛型类型。 但 是 C++ 的 vector 模板为了便于访问元素重栽了 [ ] 运算符。由于 Java 没有运算符重栽，所以必须调用显式的方法。此外，C++ 向量是值拷贝。如果 a 和 b 是两个向量， 賦值操作 a = b 将会构造一个与 b 长度相同的新向量 a, 并将所有的元素由 b 拷贝到 a, 而在Java 中， 这条赋值语句的操作结果是让 a 和 b 引用同一个数组列表。

---

## ArrayList数组列表
**警告：** 只有 i 小于或等于数组列表的大小时， 才能够调用 list.set(，i x。) 例如， 下面这段代码是错误的：
```java
ArrayList<Employee> list = new ArrayListo(100); // capacity 100，size 0
list.set(0, x); // no element 0 yet
```
使用 add 方法为数组添加新元素， 而不要使用 set 方法， 它只能替换数组中已经存在的元素内容。
**警告：**： 没有泛型类时，原始的 ArrayList 类提供的 get 方法别无选择只能返回 Object, 因此， get 方法的调用者必须对返回值进行类型转换：
```java
Employee e = (Eiployee) staff.get(i);
```
原始的 ArrayList 存在一定的危险性。它的 add 和 set 方法允许接受任意类型的对象。对于下面这个调用
```java
staff.set(i , "Harry Hacker");
```
编译不会给出任何警告， 只有在检索对象并试图对它进行类型转换时， 才会发现有问题。如果使用 ArrayList<Employee>, 编译器就会检测到这个错误。

**警告：** 原始数组列表赋值给类型化的数组列表会报异常，而反过来则仅仅报警告，需要加以检查。
```java
@SuppressWarnings("unchecked") ArrayList<Employee> result = (ArrayList<Employee>) employeeDB.find(query);
```

---

## 反射类
- Integer、Long、Float、Double、Short、Byte、Character 、Void 和 Boolean (前 6 个类派生于公共的超类 Number)。对象包装器类是不可变的，即一旦构造了包装器，就不允许更改包装在其中的值。同时， 对象包装器类还是 final , 因此不能定义它们的子类。
- 反射类： Class类
```java
Class dl = Random,cl ass; // if you import java.util
Gass cl 2 = int.class;
Class cl 3 = Doublet],cl ass;
e.getClass().newlnstance();
String s = "java.util .Random";
Object m = Class.forName(s).newlnstance();
```

---

## 通用方法将Employee[ ]数组转换为Object[ ]数组
```java
EmployeeQ a = new Employee[100]: // array is full
a = Arrays.copyOf(a, 2 * a.length);
```
```java
//应该将 goodCopyOf 的参数声明为 Object 类型，.而不要声明为对象型数组（Object[])
public static Object goodCopyOf(Object a, int newLength) {  
  Class cl = a.getClassO；
  if (!cl .isArrayO) return null ;  //a不是数组
  Class componentType = cl .getComponentType(); //获得数组类型，比如ArrayList<?>/int[]数组返回ArrayList/int等
  int length = Array.getLength(a);
  Object newArray = Array.newlnstance(componentType, newLength): //注意此处声明的是Object指代数组类型，例如ArrayList
  System.arraycopy(a, 0, newArray, 0, Math.min(length, newLength));
  return newArray;
}
```
**这个 CopyOf 方法可以用来扩展任意类型的数组， 而不仅是对象数组。**
```java
int[] a = { 1，2, 3, 4, 5 };
a = (int[]) goodCopyOf(a, 10);
```

## 继承设计技巧
**1. 将公共操作和域放在超类**
　　这就是为什么将姓名域放在 Person类中，而没有将它放在 Employee 和 Student 类中的原因。
**2. 不要使用受保护的域**
　　有些程序员认为，将大多数的实例域定义为 protected 是一个不错的主意，只有这样，子类才能够在需要的时候直接访问它们。然而， protected 机制并不能够带来更好的保护，其原因主要有两点。
- 第一，子类集合是无限制的， 任何一个人都能够由某个类派生一个子类，并编写代码以直接访问 protected 的实例域， 从而破坏了封装性。
- 第二， 在 Java 程序设计语言中，在同一个包中的所有类都可以访问 proteced 域，而不管它是否为这个类的子类。不过，protected 方法对于指示那些不提供一般用途而应在子类中重新定义的方法很有用。
**3. 使用继承实现“ is-a” 关系**
　　使用继承很容易达到节省代码的目的，但有时候也被人们滥用了。例如， 假设需要定义一个钟点工类。钟点工的信息包含姓名和雇佣日期，但是没有薪水。他们按小时计薪，并且不会因为拖延时间而获得加薪- 这似乎在诱导人们由 Employee 派生出子类 Contractor, 然后再增加一个 hourlyWage 域。
```java
public class Contractor extends Employee
{
  private double hourlyWage;
}
```
　　这并不是一个好主意。因为这样一来， 每个钟点;o橡中都包含了薪水和计时工资这两个域。在实现打印支票或税单方法耐候， 会带来诞的麻烦， 并且与不采用继承，会多写很制戈码。钟点工与雇员之间不属于“ is-a” 关系。钟点工不是特殊的雇员。
**4. 除非所有继承的方法都有意义，否则不要使用继承**
　　假设想编写一个 Holiday 类3 毫无疑问，每个假日也是一日，并且一日可以用 GregorianCalendar 类的实例表示，因此可以使用继承。
```java
class Holiday extends CregorianCalendar { . . , }
```
　　很遗憾， 在继承的操作中， 假日集不是封闭的。 在 GregorianCalendar 中有一个公有方法add, 可以将假日转换成非假日：
```java
  Holiday Christmas;
  Christmas.add(Calendar.DAY_OF_MONTH , 12);
```
　　因此，继承对于这个例子来说并不太适宜。
　　需要指出， 如果扩展 LocalDate 就不会出现这个问题。由于这个类是不可变的，所以没有任何方法会把假日变成非假日。
**5. 在覆盖方法时，不要改变预期的行为**
　　置换原则不仅应用于语法， 而且也可以应用于行为，这似乎更加重要。在覆盖一个方法的时候，不应该毫无原由地改变行为的内涵。就这一点而言，编译器不会提供任何帮助，即
　　编译器不会检查重新定义的方法是否有意义。例如，可以重定义 Holiday 类中 add方法“ 修 正” 原方法的问题，或什么也不做， 或抛出一个异常， 或继续到下一个假日。然而这些都违反了置换原则。
语句序列
```java
int dl = x.get(Calendar.DAY_OF_MONTH); x.add(Calendar.DAY_OF_MONTH , 1);
int d2 = x.get(Calendar.DAY_OF_HONTH);
System.out.println(d2 - dl);
```
　　不管 x 属于 GregorianCalendar 类， 还是属于 Holiday 类，执行上述语句后都应该得到预期的行为。当然， 这样可能会引起某些争议。人们可能就预期行为的含义争论不休。例如， 有些人争论说， 置换原则要求 Manager.equals 不处理 bonus 域，因为 Employee.equals 没有它。实际上，凭空讨论这些问题毫无意义。关键在于，在覆盖子类中的方法时，不要偏离最初的设计想法。
**6. 使用多态， 而非类型信息**
　　无论什么时候，对于下面这种形式的代码
```java
if (x is oftype1)
  action_1(x);
else if (x is oftype 2)
  action_2(x);
```
　　都应该考虑使用多态性。action, 与 3如0112 表示的是相同的概念吗？ 如果是相同的概念，就应该为这个概念定义一个方法， 并将其放置在两个类的超类或接口中，然后， 就可以调用`X.action()`以便使用多态性提供的动态分派机制执行相应的动作。使用多态方法或接口编写的代码比使用对多种类型进行检测的代码更加易于维护和扩展。
**7. 不要过多地使用反射**
　　反射机制使得人们可以通过在运行时查看域和方法， 让人们编写出更具有通用性的程序。这种功能对于编写系统程序来说极其实用，但是通常不适于编写应用程序。反射是很脆弱的，即编译器很难帮助人们发现程序中的错误， 因此只有在运行时才发现错误并导致异常。

---

## 继承的Comparable接口设计
这 是 因 为 Manager ，展了 Employee , 而 Employee 实 现 的 是 Comparable<Employee>,而 不 是 Comparable<Manager> 如 果 Manager 覆 盖 了 compareTo, 就 必 须 要 有 经 理 与 雇
员 进 行 比 较 的 思 想 准 备， 绝 不 能 仅 仅 将 雇 员 转 换 成 经 理
```java
class Manager extends Employee{
  public int compareTo(Employee other){
    Manager otherManager = (Manager) other; // NO
  }
}
```
这 不 符 合 **“ 反 对 称”** 的 规 则。如 果 x 是 一 个 Employee 对 象，y 是 一 个 Manager 对 象，调 用 x.compareTo(y) 不 会 抛 出 异 常， 它 只 是 将 x 和 y 都 作 为 雇 员 进 行 比 较。 但 是 反 过 来， y.compareTo(x) 将 会 抛 出 一 个 ClassCastException:
- 如 果 子 类 之 间 的 比 较 含 义 不 一 样， 那 就 属 于 不 同 类 对 象 的 非 法 比 较。 每 个compareTo 方 法 都 应 该 在 开 始 时 进 行 下 列 检 测：
`if (getClas() != other.getClass()) throw new ClassCastException();`
- 如 果 存 在 这 样 一 种 通 用 算 法， 它 能 够 对 两 个 不 同 的 子 类 对 象 进 行 比 较， 则 应 该 在 超类 中 提 供 一 个 compareTo 方 法，并 将 这 个 方 法 声 明 为 final ,

## 接口默认方法冲突
- 1 ) 超类优先。如果超类提供了一个具体方法，同名而且有相同参数类型的默认方法会被忽略。
- 2 ) 接口冲突。 如果一个超接口提供了一个默认方法，另一个接口提供了一个同名而且参数类型（不论是否是默认参数）相同的方法， 必须覆盖这个方法来解决冲突。
- 如果实现的多个接口都有同签名的默认方法实现，就必须手动实现，可以选择其中一个接口的实现`SuperClass.super.method()`
- 如果继承的接口与超类冲突，类优先
- 如果实现的多个接口都有同签名方法，但没有默认实现，则随意，实现，不实现就代表此类为抽象类（接口中的抽象方法）

## 函数式接口
对于只有一个抽象方法的接口， 需要这种接口的对象时， 就可以提供一个 lambda 表达式。这种接口称为函数式接口 （ functional interface )。lambda表达式可以转换为函数式接口。
```java
Arrays.sort (words, (first, second) -> first.length() - second.length()) ;
Comparator<String> comp
= (first, second) // Same as (String first, String second) -> first.length() - second.length();
```

## 数组的clone方法
**一维深复制，二维浅复制(引用)**
所有数组类型都有一个 public 的 clone 方法， 而不是 protected: 可以用这个方法建立一个新数组， 包含原数组所有元素的副本。例如：
```java
int[] luckyNumbers = { 2, 3, 5, 7, 11, 13 };
int[] cloned = luckyNumbers.clone();
cloned[5] = 12; // doesn't change luckyNumbers[5]
```
