---
title: D3.js
translate_title: d3js
date: 2020-03-03 00:08:17
toc: true
tags:
  - HTML
---
研究生可视化课程期末项目，只得学习一下[D3.js](https://d3js.org/)了，参考[精通D3.js交互式数据可视化高级编程](/assets/files/D3_js_programming.pdf)。

> # SVG基础

## SVG基础
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>

    <style type="text/css">
        .linestyle{
            stroke: red;
            stroke-width: 2;
        }

    </style>
</head>
<body>
<svg width="1000" height="1000" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="20" width="200" height="100"
          style="fill:steelblue; stroke:blue; stroke-width:4; opacity:0.5"></rect>
    <rect x="250" y="20" rx="20" ry="30" width="200" height="100"
          style="fill:yellow; stroke:black; stroke-width:4; opacity:0.5"></rect>

    <circle cx="150" cy="150" r="80" style="fill:yellow; stroke:black; stroke-width:4; opacity:0.5"></circle>
    <ellipse cx="350" cy="150" rx="110" ry="80"
             style="fill:yellow; stroke:black; stroke-width:4; opacity:0.5"></ellipse>

    <line x1="20" y1="20" x2="300" y2="100" style="stroke:black; stroke-width:4; opacity:0.5"></line>

    <polygon points="100,20 20,90 60,160 140,160 150,160 180,90"
             style="fill:yellow; stroke:black; stroke-width:4; opacity:0.5"></polygon>
    <polyline points="100,20 20,90 60,160 140,160 150,160 180,90"
              style="fill:yellow; stroke:black; stroke-width:4; opacity:0.5"></polyline>

    <path d="M30,100 L270,300 M30,100 H270 M30,100 V300"
          style="fill:yellow; stroke:black; stroke-width:4; opacity:0.5"></path>
    <path d="M30,100 C100,30 190,20 270,100 S400,180 450,100" fill="yellow" stroke="blue" stroke-width="4"></path>
    <path d="M30,100 Q190,20 270,100 T450,100" fill="yellow" stroke="blue" stroke-width="4"></path>
    <path d="M100,200 a200,150 0 1,0 150,-150 Z" fill="yellow" stroke="blue" stroke-width="4"></path>

    <text x="200" y="150" dx="-5" dy="5" rotate="180" textLength="90">I love D3</text>

    <line class="linestyle" x1="10" y1="10" x2="100" y2="100"></line>

    <defs>
        <marker id="arrow" markerUnits="strokeWidth" markerWidth="12" markerHeight="12" viewBox="0 0 12 12"
                refX="6" refY="6" orient="auto">
            <path d="M2,2 L10,6 L2,10 L6,6 L2,2" style="fill:#000000; stroke:black;"></path>
        </marker>
    </defs>
    <line x1="0" y1="0" x2="200" y2="50" stroke="red" stroke-width="2" marker-end="url(#arrow"></line>
    <path d="M20,70 T80,100 T160,80 T200,90" fill="white" stroke-width="2" stroke="red"
          marker-start="url(#arrow)"
          marker-mid="url(#arrow)"
          marker-end="url(#arrow)"></path>

    <defs>
        <filter id="GaussianBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2"></feGaussianBlur>
        </filter>
    </defs>
    <rect x="100" y="100" width="150" height="100" fill="blue"></rect>
    <rect x="300" y="100" width="150" height="100" fill="blue" filter="url(#GaussianBlur)"></rect>

    <defs>
        <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#F00"></stop>
            <stop offset="100%" stop-color="#0FF"></stop>
        </linearGradient>
    </defs>
    <rect fill="url(#myGradient)" x="10" y="10" width="300" height="100"></rect>
</svg>
</body>
</html>
```
## 初探D3
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="d3/d3.js" charset="utf-8"></script>

    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
</head>
<body>
<p>Cat</p>
<p>Dog</p>

<!--<script>-->
<!--    var paragraphs = document.getElementsByTagName('p');-->
<!--    for (var i=0;i < paragraphs.length; i++){-->
<!--        var paragraph = paragraphs.item(i);-->
<!--        paragraph.innerHTML = 'Hello, World';-->
<!--    }-->
<!--</script>-->

<!--<script>-->
<!--    var p = d3.select('body')-->
<!--              .selectAll('p')-->
<!--              .text('Hello, World');-->
<!--     p.style('color', 'red');-->
<!--     p.style('font-size', '72px');-->
<!--</script>-->

<script>
    var width = 400;
    var height = 400;
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height);
    svg.append('circle')
       .attr('cx', '50px')
       .attr('cy', '50px')
       .attr('r', '50px')
       .attr('fill', 'blue');
    console.log('error test');
</script>

</body>
</html>
```
> # 选择集与数据

## 选择元素
select和selectAll返回的都是对象**选择集**
```HTML
<script>
    /*
        select: 选择匹配选择器的第一个元素
        selectAll: 返回匹配选择器的所有元素
     */
    d3.select('body');
    d3.select('#important');
    d3.select('.content');

    d3.selectAll('p);
    d3.selectAll('.content');
    d3.selectAll('ul li');

    var important = document.getElementById('important');
    d3.select(important);

    var content = document.getElementByClassName('content');
    d3.select(content); // 达不到选择第一个元素的效果
    d3.selectAll(content);  //正确

    d3.select('body').selectAll('p');
</script>
```
### 状态
```HTML
<p>Paragraph 1</p>
<p>Paragraph 2</p>
<p>Paragraph 3</p>
<script>
    var paragraphs = d3.selectAll('p');
    console.log(paragraphs.empty()); //false
    console.log(paragraphs.node()); //<p>Paragraph 1</p>
    console.log(paragraphs.size()); //3
</script>
```
### 设定和获取属性
```html
selection.attr(name[, value])  //设置属性
selection.classed(name[, value]) //设置CSS类，value为布尔值
selection.style(name[, value[, priority]]) //设置样式
selection.property(name[, value]) //设置属性，value省略使返回属性名
selection.text([value])  //设定或获取选择集的文本内容，忽略value时，返回当前文本的内容
selection.html([value])  //设定或获取选择集内部的HTML内容，相当于DOM的innerHTML，包括元素内部的标签！
```
```html
<script>
    <p id="para">This is a paragraph</p>
    d3.select('p')
      .attr('id', 'para');  //设置

    d3.select('p')
      .attr('id'); //获取
    //设置多个类
    d3.select('p').attr('class', 'red bigsize'); //类名间用空格隔开，但无法获取状态

    //设置
    d3.select('p').
      .classed('red', true)    //开启
      .classed('bigsize', false);  //关闭
    d3.select('p')
      classed({'red':true, 'bigsize':true});
    d3.select('p')
      .classed('red bigsize', true);
    //获取状态
    d3.select('p')
      .classed('red');

    <p style='color:red; font-size: 30px'></p>
    d3.select('p')
      .style('color', 'red')
      .style('font-size', '30px');

    d3.select('p')
      .style({'color':'red', 'font-size':'30px'}):

    <input id='fname' type='text' name='fullname'/>
    d3.select('#fname')
      .property('value'); //获取输入框文本，不能用attr
    d3.select('#fname')
      .property('value','LiSi');

    d3.select('p')
      .text();
    d3.select('p')
      .html();
</script>
```
## 添加、插入和删除
```html
selection.append(name) //在选择集末尾添加一个元素，name为元素名称
selection.insert(name[, before]); //在选择集中的指定元素之前插入一个元素，name是被插入的元素名称，before是CSS选择器名称
selection.remove() //删除选择集中的元素
```
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="d3/d3.js" charset="utf-8"></script>

    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
</head>
<body>
<p>Car</p>
<p id="plane">Plane</p>
<p>Ship</p>
<script>
    var body = d3.select('body');
    body.append('p')
        .text('Train')
    body.insert('p', '#plane')
        .text('Bike');

    var plane = d3.select('#plane');
    plane.remove();

</script>
</body>
</html>
```
## 数据绑定
```html
selection.datum([value])  //选择集中的每一个元素都绑定相同的数据value
selection.data([values[, key]]) //选择集中的每一个元素分别绑定数组values的每一项。key是一个键函数，用于指定绑定数组时的对应规则。
//value可以是number, string, boolean, object，但如果是undefined和null的话，则不回创建__data__属性
```
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="d3/d3.js" charset="utf-8"></script>

    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
</head>
<body>
<p>Fire</p>
<p>Water</p>
<p>Wind</p>
<script>
    var p = d3.select('body').selectAll('p');
    //p.datum(7);

    //p.datum('Thunder')
    // .text(function(d, i){
    //    return d + ' ' + i;
    // });

    //在被绑定数据的选择集中添加元素后，新元素会继承该数据。
    //p.datum('Thunder')
    // .append('span')
    // .text(function(d, i){
    //    return ' ' + d;
    // });
    //console.log(p);
    //console.log(p.datum());

    //var dataset = [3, 6, 9];
    //var update = p.data(dataset);
    //console.log(update);

    //var dataset = [3, 6, 9, 12, 15];
    //var update = p.data(dataset);
    //console.log(update);
    //console.log(update.enter());
    //console.log(update.exit());

    //var dataset = [3];
    //var update = p.data(dataset);
    //console.log(update);
    //console.log(update.enter());
    //console.log(update.exit());

    var persons = [{id:3, name:'张三'},
                   {id:6, name:'李四'},
                   {id:9, name:'王五'}];
    p.data(persons)
     .text(function(d){
        return d.id + ' : ' + d.name;
     });

     var persons_update = [{id:6, name:'张三'},
                           {id:9, name:'李四'},
                           {id:3, name:'王五'}];
     p.data(persons_update, function(d){return d.id;})
      .text(function(d){
        return d.id + ' : ' + d.name;
      });
</script>
</body>
</html>
```
## 选择集的处理
通常，从服务器读取数据后，网页中是没有与之对应的元素的。因此，有一个很常见的用法：选择一个空集，然后使用enter().appen()来添加足够数量的元素。
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="d3/d3.js" charset="utf-8"></script>

    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
</head>
<body>
<p></p>
<script>
    var dataset = [3, 6, 9];
    var p = d3.select('body').selectAll('p');

    //绑定数据后，分别获取update和enter部分
    var update = p.data(dataset);
    var enter = update.enter();

    //update部分的处理方法是直接修改内容
    update.text(function(d){return d;});

    //enter部分的处理方法是添加元素后再修改内容
    enter.append('p').text(function(d){return d});
    console.log(update);
    console.log(enter);
</script>
</body>
</html>
```
```html
3
6
9
```
如果存在多余的元素，没有数据与之对应，那么就需要删除元素。使用remove()即可删除元素。
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="d3/d3.js" charset="utf-8"></script>

    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
</head>
<body>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
<script>
    var dataset = [3, 6, 9];
    var p = d3.select('body').selectAll('p');

    //绑定数据后，分别获取update和部分
    var update = p.data(dataset);
    var exit = update.exit();

    //update部分的处理方法是修改内容
    update.text(function(d){return d;});

    //exit部分的处理方法是删除
    exit.remove();
    console.log(update);
</script>
</body>
</html>
```
```html
3
6
9
```
### 处理模板
无需考虑元素个数是否与数据长度匹配
```html
<script>
    var dataset = [3, 6, 9];
    var p = d3.select('body').selectAll('p');

    //绑定数据后，分别获取update、enter、exit部分
    var update = p.data(dataset);
    var enter = update.enter();
    var exit = update.exit();

    //1.update部分的处理方法
    update.text(function(d){return d;});

    //2.enter部分的处理方法
    enter.append('p')
         .text(function(d){return d;});

    //3.exit部分的处理方法
    exit.remove();
</script>
```
### 过滤器以及选择集的顺序
```html
selection.filter(function(d, i)){
  if(d>20) return true;
  else return false;
}
selection.sort(function(a, b){ //升序
  if(a<b) return -1;  
  else if(a>b) return 1;
  else return 0;
  //return a-b; //升序
  //return b-a; //降序
});
```
### each()应用
```html
<body>
<p></p>
<p></p>
<p></p>

<script>
    var dataset = [{id:1001, name:'ZhangSan'},
                   {id:1002, name:'LiSi'}];
    var p = d3.select('body').selectAll('p');

    p.data(dataset)
     .each(function(d, i){
        d.age = 20;
     })
     .text(function(d, i){
        return d.id + ' ' + d.name + ' ' + d.age;
     });

</script>
</body>
```
```html
1001 ZhangSan 20

1002 LiSi 20
```
### call()的应用
call()允许将选择集自身作为参数，传递给某一函数
```html
d3.selectAll('p').call(myfun);
等同于：
function myfun(selection){
  //在这里进行相关操作
  selection.attr('name', 'value');
}
myfun(d3.selectAll('p'));
```
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="d3/d3.js" charset="utf-8"></script>

    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
</head>
<body>
<p></p>
<p></p>
<p></p>

<script>
    var dataset = [{id:1001, name:'ZhangSan'},
                   {id:1002, name:'LiSi'}];
    var p = d3.select('body').selectAll('p');

    p.data(dataset);
    function myfun(selection){
        //在这里进行相关操作
        selection.text(function(d, i){
            return 'asasa';
        })
    }
    p.call(myfun);
</script>
</body>
</html>
```
## 数组的处理
内置函数
### 排序
```html
d3.ascending(a, b)
d3.descending(a, b)
```
```html
<script>
    var dataset = [3, 6, 9];
    var p = d3.select('body').selectAll('p');
    var update = p.data(dataset);
    update.text(function(d, i){
        return d
    })
    .sort(d3.descending);
</script>
```
```
[9, 6, 3]
```
### 求值
```html
d3.function(array[, accessor]);
第一个参数array是数组，第二个参数accessor是可选参数。
accessor是一个函数，指定之后，数组各项首先会调用accessor，然后再使用原函数function进行处理。

d3.min(array[, accessor])     //返回数组最小值
d3.max(array[, accessor])     //返回数组最大值
d3.extend(array[, accessor])  //返回数组最小值和最大值
d3.sum(array[, accessor])     //返回数组的总和，如果数组为空，则返回0
d3.mean(array[, accessor])    //返回数组的总和，如果数组为空，则返回0
//上面两个函数参数的array中无效的undefined以及Nan，mean计算的长度为实际有效长度
d3.median(array[, accessor])  //求数组的中间值，如果数组为空，则返回undefined
d3.quantile(numbers, p)  //求取p分位点的值，p的范围为[0,1]。数组需先递增排序。同样湖绿无效的undefined和NaN
d3.variance(arrayp[, accessor])  //求方差
d3.deviation(array[, accessor])  //求标准差
d3.bisectLeft()  //获取某数组项左边的位置
d3.bisect()      //获取某数组项右边的位置
d3.bisectRight()  //和bisect()一样
d3.slice(insert_idx, remove_idx, data) //插入、删除数据
```
```html
<script>
    var numbers = [30, 20, 10, 50, 40];

    var min = d3.min(numbers);
    var max = d3.max(numbers);
    var extent = d3.extent(numbers);

    console.log(min);
    console.log(max);
    console.log(extent);

    var minAcc = d3.min(numbers, function(d){return d*3});
    var maxAcc = d3.max(numbers, function(d){return d-5});
    var extentAcc = d3.extent(numbers, function(d){return d%7});

    console.log(minAcc);
    console.log(maxAcc);
    console.log(extentAcc);
</script>
```
```html
10
50
[10, 50]

30
45
[1, 6]
```
```html
<script>
    var numbers = [69, 11, undefined, 53, 27, 82, 65, 34, NaN];

    var sum = d3.sum(numbers, function(d){return d/3;});
    var mean = d3.mean(numbers);

    console.log(sum);
    console.log(mean);
</script>
```
```html
113.66666666666667
48.714285714285715
```
```html
<script>
    var numbers = [3, 1, 10];
    numbers.sort(d3.ascending);
    console.log(d3.quantile(numbers, 0));
    console.log(d3.quantile(numbers, 0.25));
    console.log(d3.quantile(numbers, 0.5));
    console.log(d3.quantile(numbers, 0.75));
    console.log(d3.quantile(numbers, 0.9));
    console.log(d3.quantile(numbers, 1.0));
</script>
```
```html
1
2
3
6.5
8.600000000000001
10
```
```html
<script>
    var countries = ['China', 'America', 'Japan', 'France'];

    //在数组索引为1的位置处，删除0个项后，插入字符串Germany
    countries.splice(1, 0, 'Germany');

    //输出['China', 'Germany', 'America', 'Japan', 'France']
    console.log(countries);

    //在数组索引为3的位置处，删除一个项后，插入两个字符串Britain和Russia
    countries.splice(3, 1, 'Britain', 'Russia');

    //输出['China', 'Germany', 'America', 'Britain', 'Russia', 'France']
    console.log(countries);
</script>
```
```html
<script>
    var numbers = [10, 13, 16, 19, 22, 25];

    //iLeft的值为2，若该项不存在，则返回第一个大于此项的值的左边
    var iLeft = d3.bisectLeft(numbers.sort(d3.ascending), 16);

    //在iLeft位置处，删除0个项后，插入77
    numbers.splice(iLeft, 0, 77);

    //输出[10, 13, 77, 16, 19, 22, 25]
    console.log(numbers);
</script>
```
### 操作数组
```html
d3.shuffle(array[, lo[, hi]])  //随机排列数组
d3.merge(arrays)  //合并两个数组
d3.pairs(array)  //返回邻接的数组对，以第i项和第i-1项为对返回。
d3.range([start, ]stop[,step]) //返回等差数列
d3.permute(array, indexes) //根据指定的索引号数组返回排列后的数组
d3.zip(arrays...) //用多个数组来制作数组的数组
d3.transpose(matrix) //求转置矩阵
```
```html
var x = [1, 2, 3]
var y = [4, 5, 6]
var z = d3.merge([x, y])
console.log(z)  //[1,2,3,4,5,6]

var colors = ['red', 'blue', 'green']
var pairs = d3.pairs(colors)
console.log(pairs) //[['red', 'blue'], ['blue', 'green']]

var a = d3.range(10)
console.log(a) //[0,1,2,3,4,5,6,7,8,9]

var b = d3.range(2, 10)
console.log(b) //[2,3,4,5,6,7,8,9]

var c=d3.range(2, 10, 2)
console.log(c) //[2,4,6,8]

var animals = ['car', 'dog', 'bird']
var newAnimals = d3.permute(animals, [2, 1, 0])
console.log(newAnimals)  //['bird', 'dog', 'cat']

var zip = d3.zip([1000,1001,1002],
                 ['Zhangsan', 'Lisi', 'Wangwu'],
                 [true, false, true])
console.log(zip)
//[[1000,'Zhangsan', true],[1001, 'Lisi', false], [1002,'Wangwu', true]]

var a = [10, 20, 5]
var b = [-5, 10, 3]
//d3.zip(a,b) == [[10,-5], [20,10], [5,3]]
var ab = d3.sum(d3.zip(a,b)， function(d){return d[0]*d[1];})
console.log(ab); //165

var a = [[1,2,3], [4,5,6]];
var t = d3.transpose(a);
console.log(t); //[[1,4], [2, 5], [3, 6]]
```
### 映射（Map）
```html
d3.map([object][,key]) //构造映射。第一个参数是源数组，第二个参数用于指定映射的key。
map.has(key) //如果指定的key存在，则返回true；反之，则返回false。
map.get(key) //如果指定key存在，则返回该key的value；否则，返回undefined。
map.set(key, value) //对指定的key设定value，如果key已存在，则新value值覆盖旧value；如果该key不存在，则会添加一个新的value。
map.remove(key) //如果指定的key存在，则将此key和value删除，并返回true；如果不存在，则返回false。
map.keys() //以数组形式返回该map所有的key。
map.values() //以数组形式返回该map所有的value。
map.entries() //以数组形式返回该map所有的key和value。
map.forEach(function) //分别对该映射中的每一项调用function函数，function函数传入两个参数：key和value。分别代表每一项的key和value。
//v5版本已经改为了map.each()
map.empty() //如果该映射为空，则返回true；否则，返回false。
map.size() //返回该映射的大小。
```
```html
<script>
    var dataset = [{id:1000, color:'red'},
                   {id:1001, color:'green'},
                   {id:1002, color:'blue'}];
    var map = d3.map(dataset, function(d){return d.id;});

    console.log(map.has(1001));
    console.log(map.has(1003));

    console.log(map.get(1001));
    console.log(map.get(1003));

    map.set(1001, {id:1001, color:'yellow'});
    map.set(1003, {id:1003, color:'white'});

    map.remove(1001);

    console.log(map.keys());
    console.log(map.values());
    console.log(map.entries());


    map.each(function(key, value){
        console.log(key);
        console.log(value);
    });

    console.log(map.empty());
    console.log(map.size());
</script>
```
```html
true
false
{id: 1001, color: "green"}
undefined
(3) ["1000", "1002", "1003"]
(3) [{…}, {…}, {…}]
(3) [{…}, {…}, {…}]
{id: 1000, color: "red"}
1000
{id: 1002, color: "blue"}
1002
{id: 1003, color: "white"}
1003
false
3
```
### 集合(Set)
```html
d3.set([array])  //使用数组来构建集合，如果数组里有重复的元素，则只添加其中一项
set.has(value) //如果集合中有指定元素，则返回true；如果没有，返回false。
set.add(value) //如果该集合中没有指定元素，则将其添加到集合中，并返回该元素；如果有，则不添加。
set.remove(value) //如果该集合中有指定元素，则将其删除并返回true；否则，返回false。
set.forEach(function) //对每一个元素都调用function函数，函数里传入一个参数，即该元素的值。
//v5版本中已修改为set.each(function)
set.empty() //如果该集合为空，则返回true; 否则，返回false。
set.size()  //返回该集合的大小
```
```html
<script>
    var dataset = ['tiger', 'dragon', 'snake', 'horse', 'sheep'];
    var set = d3.set(dataset);

    console.log(set.has('tiger'));
    set.add('monkey');

    set.remove('snake');
    console.log(set.values());

    set.each(function(value){
        console.log(value);
    });

    console.log(set.empty());
    console.log(set.size());
</script>
```
```html
true
(5) ["tiger", "dragon", "horse", "sheep", "monkey"]
tiger
dragon
horse
sheep
monkey
false
5
```
### 嵌套结构
```html
d3.nest() //该函数没有任何参数，表示接下来将会构建一个新的嵌套结构。其他函数需要跟在此函数之后一起使用。
nest.key(function) //指定嵌套结构的键。
nest.entries(array) //指定数组array将被用于构建嵌套结构。
nest.sortKeys(comparator) //按照键对嵌套结构进行排序，接在nest.key()后使用。
nest.sortValues(comparator) //按照值对嵌套结构进行排序
nest.rollup(function) //对每一组叶子节点调用指定的函数function，该函数含有一个参数values，是当前叶子节点的数组。
nest.map(array[, mapType]) //以映射的形式输出数组。
```
```html
<script>
    var persons = [{id:100, name:'张某某', year:1989, hometown:'北京'},
                   {id:101, name:'李某某', year:1989, hometown:'北京'},
                   {id:102, name:'王某某', year:1988, hometown:'上海'},
                   {id:103, name:'赵某某', year:1987, hometown:'广州'},
                   {id:104, name:'孙某某', year:1989, hometown:'上海'}];

    var nest = d3.nest()
                 .key(function(d){return d.year;}) //将year作为第一个键
                 .sortKeys(d3.ascending)
                 .key(function(d){return d.hometown}) //将hometown作为第二个键
                 .sortKeys(d3.descending)
                 .sortValues(function(a, b){
                    return d3.ascending(a.id, b.id);
                 })
                 //.rollup(function(values){return values.length;})
                 //.map(persons, d3.map)
                 .entries(persons) //指定将应用嵌套结构的数组为persons
    console.log(nest);
</script>
```
## 绘制柱形图
### 矩形和文字
```html
<script>
    var dataset = [50, 43, 120, 87, 99, 167, 142];
    var width = 400;
    var height = 400;
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
    var padding = {top:20, right:20, bottom:20, left:20};
    var rectStep = 35; //矩形所占的宽度（包括空白），单位为像素
    var rectWidth = 30; //矩形所占的宽度（不包括空白），单位为像素

    var rect = svg.selectAll('.myrect')
                  .data(dataset)
                  .enter()
                  .append('rect')
                  .attr('fill', 'steelblue')
                  .attr('x', function(d, i){
                    return padding.left + i * rectStep;
                  })
                  .attr('y', function(d){
                    return height-padding.bottom -d;
                  })
                  .attr('width', rectWidth)
                  .attr('height', function(d){
                    return d;
                  });

    var text = svg.selectAll('.mytext')
                  .data(dataset)
                  .enter()
                  .append('text')
                  .attr('fill', 'blue')
                  .attr('font-size', '14px')
                  .attr('text-anchor', 'middle')
                  .attr('x', function(d, i){
                    return padding.left + i*rectStep;
                  })
                  .attr('y', function(d, i){
                    return height - padding.bottom - d;
                  })
                  .attr('dx', rectWidth/2)
                  .attr('dy', '-1em')
                  .text(function(d){
                    return d;
                  });
</script>
```
### 更新数据
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="d3/d3.js" charset="utf-8"></script>

    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
</head>
<body>
<script>
    var dataset = [50, 43, 120, 87, 99, 167, 142];
    var width = 400;
    var height = 400;
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
    var padding = {top:20, right:20, bottom:20, left:20};
    var rectStep = 35; //矩形所占的宽度（包括空白），单位为像素
    var rectWidth = 30; //矩形所占的宽度（不包括空白），单位为像素

    function draw(){
        var updateRect = svg.selectAll('.myrect')
                            .data(dataset);
        var enterRect = updateRect.enter();
        var exitRect = updateRect.exit();

        updateRect.attr('fill', 'steelblue')
                  .attr('x', function(d, i){
                    return padding.left + i*rectStep;
                  })
                  .attr('y', function(d){
                    return height-padding.bottom-d;
                  })
                  .attr('width', rectWidth)
                  .attr('height', function(d){
                    return d;
                  });
        enterRect.append('rect')
                 .attr('fill', 'steelblue')
                 .attr('x', function(d, i){
                    return padding.left + i*rectStep;
                  })
                  .attr('y', function(d){
                    return height-padding.bottom-d;
                  })
                  .attr('width', rectWidth)
                  .attr('height', function(d){
                    return d;
                  });
        exitRect.remove();

        var updateText = svg.selectAll('.mytext')
                            .data(dataset);
        var enterText = updateText.enter();
        var exitText = updateText.exit();

        updateText.attr('fill', 'blue')
                  .attr('font-size', '14px')
                  .attr('text-anchor', 'middle')
                  .attr('x', function(d, i){
                    return padding.left + i*rectStep;
                  })
                  .attr('y', function(d, i){
                    return height - padding.bottom - d;
                  })
                  .attr('dx', rectWidth/2)
                  .attr('dy', '-1em')
                  .text(function(d){
                    return d;
                  });
        enterText.append('text')
                 .attr('fill', 'blue')
                  .attr('font-size', '14px')
                  .attr('text-anchor', 'middle')
                  .attr('x', function(d, i){
                    return padding.left + i*rectStep;
                  })
                  .attr('y', function(d, i){
                    return height - padding.bottom - d;
                  })
                  .attr('dx', rectWidth/2)
                  .attr('dy', '-1em')
                  .text(function(d){
                    return d;
                  });
        exitText.remove();

    }
    function clear(){
        var updateRect = svg.selectAll('rect')
        var updateText = svg.selectAll('text')
        updateRect.remove();
        updateText.remove();
    }
    function mysort(){
        clear();
        dataset.sort(d3.ascending);
        draw();
    }
    function myadd(){
        clear();
        dataset.push(Math.floor(Math.random()*100));
        draw();
    }
</script>
<button type="button" onclick="mysort()">排序</button>
<button type="button" onclick="myadd()">增加数据</button>
</body>
</html>
```
![image](/assets/img/D3js/Cylindrical_graph_01.png)
![image](/assets/img/D3js/Cylindrical_graph_02.png)
> # 比例尺和坐标轴
## 定量比例尺
```html
var linear = d3.scale.linear()    //创建一个线性比例尺
               .domain([0, 500])  //定义域
               .range([0, 100])   //值域
console.log(linear(50));
console.log(linear(250));
console.log(linear(450));               
```
### 线性比例尺
```html
d3.scale.linear()  //创建一个线性比例尺
//v5版本是d3.scaleLinear()
linear(x)          //输入一个定义域内的值x，返回值域内对应的值
linear.invert(y)   //输入一个在值域内的值，返回定义域内对应的值
linear.domain([numbers]) //设定或获取定义域
linear.range([values]) //设定或获取值域。
linear.rangeRound([values])  //代替range()使用的话，比例尺的输出值会进行四舍五入的运算，结果为整数
linear.clamp([boolean])  //默认被设置为false，当该比例尺接收一个超出定义域范围内的值时，依然能够按照同样的计算方法计算得到一个值，这个值可能是超出值域范围的。如果设置为true，则任何超出值域范围的值，都会被收缩到值域范围内。
```
```html
<script>
    var linear = d3.scaleLinear()
                   .domain([0,20])
                   .range([0,100]);
    console.log(linear(10));  //输出50
    console.log(linear(30));  //输出150
    console.log(linear.invert(80));  //输出16

    linear.clamp(true); //设置输出值不超过值域范围
    console.log(linear(30)); //输出100

    linear.rangeRound([0, 100]); //值域四舍五入
    console.log(linear(13.33)); //输出67

    linear.domain([0.12300000, 0.4888888888]).nice();
    console.log(linear.domain()); //输出{0,。1， 0.5]

    linear.domain([33.611111,45.97745]).nice()
    console.log(linear.domain()); //输出[33,46],并不是四舍五入

    linear.domain([-20, 20])
    var ticks = linear.ticks(5);
    console.log(ticks); //输出{-20， -10， 0， 10， 20]

    var tickFormat = linear.tickFormat(5, '+');
    for(var i=0;i<ticks.length;i++){
        ticks[i] = tickFormat(ticks[i]);
    }
    console.log(ticks); //["-2e+1", "-1e+1", "+0", "+1e+1", "+2e+1"]

    //两段线性函数
    var scale = d3.scaleLienar()
                  .domain([0,20,40])
                  .range([0,100,150]);
    var result = scale(30); //125
</script>
```
### 指数和对数比例尺
```html
<script>
    //设置指数比例尺的指数为3
    var pow = d3.scalePow().exponent(3)
    console.log(pow(2)); //8
    console.log(pow(3)); //27

    //设置指数比例尺的指数为0.5，即平方根
    pow.exponent(0.5);
    console.log(pow(2)); //1.414
    console.log(pow(3)); //1.732

    //定义域[0,3]对应指数运算得到线性比例尺定义域[0,27]，值域[0,90],之后应用线性比例尺
    var pow = d3.scalePow()
                .exponent(3)
                .domain([0,3])
                .range([0,90])
    console.log(pow(1.5)); //11.25
</script>
```
### 量子比例尺
```html
<script>
    var quantize = d3.scaleQuantize()
                     .domain([0,10])
                     .range(['red', 'green', 'blue', 'yellow', 'black']);
    console.log(quantize(1)); //red
    console.log(quantize(3)); //green
    console.log(quantize(5.9999)); //blue
    console.log(quantize(6)); //yellow

    //半径越小，颜色越深
    var quantize = d3.scaleQuantize()
                     .domain([0,50])
                     .range(["#000", "#222","#444","#666","#888"]);
    var r = [45, 35, 25, 15, 5];
    var svg = d3.select('body')
                .append('svg')
                .attr('width', 400)
                .attr('height', 400);

    svg.selectAll('circle')
       .data(r)
       .enter()
       .append('circle')
       .attr('cx', function(d, i){
            return 50 + i*30;
       })
       .attr('cy', 50)
       .attr('r', function(d){ return d;})
       .attr('fill', function(d){
            console.log(d);
            console.log(quantize(d));
            return quantize(d);});
</script>
```
### 分位比例尺
分位比例尺与量子比例尺类似，只不过分段不同
```html
<script>
    var quantize = d3.scaleQuantize()
                     .domain([0,2,4,10])
                     .range([1, 100]);
    var quantile = d3.scaleQuantile()
                     .domain([0,2,4,10])
                     .range([1, 100]);
    console.log(quantize(3)); //1
    console.log(quantile(3)); //100

    console.log(quantize(4.99)); //1
    console.log(quantize(5)); //100
    console.log(quantile(2.99)); //1
    console.log(quantile(3)); //100
    //量子比例尺分段值只与定义域起始值和结束值有关，分段值取其算数平均值
    //分位比例尺的分段值与定义域中存在的数值都相关。
    console.log(quantile.quantiles()); //3
</script>
```
### 阈值比例尺
```html
<script>
    //[-R,R]被10,20,30分成四部分
    var threshold = d3.scaleThreshold()
                      .domain([10,20,30])
                      .range(['red','green', 'blue', 'black']);
    console.log(threshold(5)); //red
    console.log(threshold(15)); //green
    console.log(threshold(25)); //blue
    console.log(threshold(35)); //black

    console.log(threshold.invertExtent('red')); //[undefined, 10)
    console.log(threshold.invertExtent('green')); //[10, 20)
    console.log(threshold.invertExtent('blue')); //[20,30)
    console.log(threshold.invertExtent('black')); //[30, undefined)

</script>
```
## 序数比例尺
v5版本与v3版本有些差异，具体见官网API
```html
<script>
    var ordinal = d3.scaleOrdinal()
                    .domain([1,2,3,4,5])
                    .range([10,20,30,40,50]);

    console.log(ordinal(1)); //10
    console.log(ordinal(3)); //30
    console.log(ordinal(5)); //50
    console.log(ordinal(8)); //输入值不在定义域内，输出10
    console.log(ordinal.range()); //[10,20,30,40,50]

    var point = d3.scalePoint()
                    .domain([1,2,3,4,5])
                    .range([0, 100]);
    console.log(point.range()); //[0,25,50,75,100]
    console.log(point(1)); //0
    console.log(point(3)); //50
    console.log(point(5)); //100
    console.log(point(6)); //undefined
    console.log(point.step()); //25

    point.padding(5);
    console.log(point(1)); //35.714285
    console.log(point.step()); //7.14285

    //与points类似，但是分段不同
    var bands = d3.scaleBand()
                  .domain([1,2,3,4,5])
                  .range([0, 100]);
    //返回每个band的起点
    console.log(bands(1)); //0
    console.log(bands(3)); //40
    console.log(bands(5)); //80
    console.log(bands(6)); //undefined
    console.log(bands.bandwidth()); //20

    //颜色序列
    var color = d3.schemeCategory10;
    for(var i=0;i<color.length;i++){
        console.log(color[i]);
    }

    var width = 600;
    var height = 600;
    var dataset = d3.range(5);
    console.log(dataset); //[0,1,2,3,4]

    var svg = d3.select('body').append('svg')
                .attr('width', width)
                .attr('height', height);
    var circle = svg.selectAll('circle')
                    .data(dataset)
                    .enter()
                    .append('circle')
                    .attr('cx', function(d, i){
                        return 30+i*80;
                    })
                    .attr('cy', 100)
                    .attr('r', 30)
                    .attr('fill', function(d, i){
                        return color[i];
                    });
</script>
```
## 坐标轴
```html
<script>
    var width = 600;
    var height = 600;

    var svg = d3.select('body').append('svg')
                .attr('width', width)
                .attr('height', height);
    var scale = d3.scaleLinear()
                   .domain([0, 10])
                   .range([0, 300]);
    var scale = d3.scalePow()
                  .exponent(2)
                  .domain([0, 1])
                  .range(0, 50);
    var scale = d3.scaleLog()
                  .domain([0.01, 1])
                  .range([0, 500]);

    var axis =  d3.axisTop(scale);

    var gAxis = svg.append('g')
                   .attr('transform', 'translate(80,80)') //平移到(80,80)
                   .attr('class', 'axis')
                   .call(axis); //绘制
    //在gAxis中绘制坐标轴
    //axis(gAxis);

    var axisLeft = d3.axisLeft(scale)
                     .ticks(5);
    var lAxis = svg.append('g')
                   .attr('transform', 'translate(20,10)') //平移到(80,80)
                   .attr('class', 'axis')
                   .call(axisLeft); //绘制

    var axisRight =  d3.axisRight(scale)
                       .tickSizeInner(6)
                       .tickSizeOuter(10)
                       .tickFormat(d3.format('$0.1f'))
                       .tickValues([3, 4, 5, 6, 7]);

    var rAxis = svg.append('g')
                   .attr('transform', 'translate(40,10)') //平移到(80,80)
                   .attr('class', 'axis')
                   .call(axisRight); //绘制
</script>
```
## 柱形图的坐标轴
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="d3/d3.js" charset="utf-8"></script>

    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
    <script type="text/css">
        .axis path,
        .axis line{
            fill: none;
            stroke: black;
            shape-rendering: crispEdges;
        }
        .axis text{
            font-family: sans-serif;
            font-size: 11px;
        }

    </script>
</head>
<body>
<script>
    var dataset = [50, 43, 120, 87, 99, 167, 142];
    var width = 400;
    var height = 400;
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
    var padding = {top:20, right:20, bottom:20, left:30};

    var xAxisWidth = 300;
    var yAxisWidth = 300;

    var xScale = d3.scaleBand()
                   .domain(d3.range(dataset.length))
                   .rangeRound([0, xAxisWidth])
                   .paddingInner(0.2);
    console.log(xScale.range());

    var yScale = d3.scaleLinear()
                   .domain([0, d3.max(dataset)])
                   .range([0, yAxisWidth]);


    function draw(){
        var updateRect = svg.selectAll('.myrect')
                            .data(dataset);
        var enterRect = updateRect.enter();
        var exitRect = updateRect.exit();

        updateRect.attr('fill', 'steelblue')
                  .attr('x', function(d, i){
                    return padding.left + xScale(i);
                  })
                  .attr('y', function(d){
                    return height-padding.bottom-yScale(d);
                  })
                  .attr('width', xScale.bandwidth())
                  .attr('height', function(d){
                    return yScale(d);
                  });
        enterRect.append('rect')
                 .attr('fill', 'steelblue')
                 .attr('x', function(d, i){
                    return padding.left + xScale(i);
                  })
                  .attr('y', function(d){
                    return height-padding.bottom-yScale(d);
                  })
                  .attr('width', xScale.bandwidth())
                  .attr('height', function(d){
                    return yScale(d);
                  });
        exitRect.remove();

        var updateText = svg.selectAll('.mytext')
                            .data(dataset);
        var enterText = updateText.enter();
        var exitText = updateText.exit();

        updateText.attr('fill', 'blue')
                  .attr('font-size', '14px')
                  .attr('text-anchor', 'middle')
                  .attr('x', function(d, i){
                    return padding.left + xScale(i);
                  })
                  .attr('y', function(d, i){
                    return height - padding.bottom - yScale(d);
                  })
                  .attr('dx', xScale.bandwidth()/2)
                  .attr('dy', '-1em')
                  .text(function(d){
                    return yScale(d);
                  });
        enterText.append('text')
                 .attr('fill', 'blue')
                  .attr('font-size', '14px')
                  .attr('text-anchor', 'middle')
                  .attr('x', function(d, i){
                    return padding.left + xScale(i);
                  })
                  .attr('y', function(d, i){
                    return height - padding.bottom - yScale(d);
                  })
                  .attr('dx', xScale.bandwidth()/2)
                  .attr('dy', '-1em')
                  .text(function(d){
                    return d;
                  });
        exitText.remove();

    }
    function clear(){
        var updateRect = svg.selectAll('rect')
        var updateText = svg.selectAll('text')
        updateRect.remove();
        updateText.remove();
    }
    function mysort(){
        clear();
        dataset.sort(d3.ascending);
        draw();
    }
    function myadd(){
        clear();
        dataset.push(Math.floor(Math.random()*100));
        draw();
    }
     draw();

    var xAxis = d3.axisBottom(xScale);
    var ryScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset)])
                    .range([yAxisWidth, 0]);

    var yAxis = d3.axisLeft(ryScale);
    svg.append('g')
       .attr('class', 'axis')
       .attr('transform', 'translate('+padding.left+','+(height-padding.bottom)+')')
       .call(xAxis);
    svg.append('g')
       .attr('class', 'axis')
       .attr('transform', 'translate('+padding.left+','+(height-padding.bottom-yAxisWidth)+')')
       .call(yAxis);
    console.log(xScale.bandwidth());
    console.log(xScale.step());
</script>
</body>
</html>
```
![image](/assets/img/D3js/Cylindrical_graph.png)
## 散点图
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="d3/d3.js" charset="utf-8"></script>

    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
    <script type="text/css">
        .axis path,
        .axis line{
            fill: none;
            stroke: black;
            shape-rendering: crispEdges;
        }
        .axis text{
            font-family: sans-serif;
            font-size: 11px;
        }

    </script>
</head>
<body>
<script>
    var width = 400;
    var height = 400;
    var xAxisWidth = 300;
    var yAxisWidth = 300;

    var center = [[0.5, 0.5], [0.7,0.8], [0.4, 0.9],
                  [0.11,0.32], [0.88, 0.25], [0.75, 0.12],
                  [0.5, 0.1], [0.2, 0.3], [0.4, 0.1], [0.6, 0.7]];

    var color = d3.schemeCategory10;
    var xScale = d3.scaleLinear()
                   .domain([0, 1.2*d3.max(center,function(d){ return d[0];})])  //避免散点位于坐标轴边缘
                   .range([0, xAxisWidth]);

    var yScale = d3.scaleLinear()
                   .domain([0, 1.2*d3.max(center, function(d){ return d[1];})])
                   .range([0, yAxisWidth]);
    var padding = {top:30, right:30, bottom:30, left:30};

    var svg = d3.select('body').append('svg')
                .attr('width', width)
                .attr('height', height);
    var circle = svg.selectAll('circle')
                    .data(center)
                    .enter()
                    .append('circle')
                    .attr('fill', function(d, i){
                        return color[i];
                    })
                    .attr('cx', function(d){
                        return padding.left + xScale(d[0]);
                    })
                    .attr('cy', function(d){
                        return height - padding.bottom-yScale(d[1]);
                    })
                    .attr('r', 10);
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale.range([yAxisWidth, 0]));
    svg.append('g')
       .attr('class', 'axis')
       .attr('transform', 'translate('+padding.left+','+(height-padding.bottom)+')')
       .call(xAxis)
    svg.append('g')
       .attr('class', 'axis')
       .attr('transform', 'translate('+padding.left+','+(height-padding.bottom-yAxisWidth)+')')
       .call(yAxis);

</script>
</body>
</html>
```
![image](/assets/img/D3js/Scatter_graph.png)

> # 绘制

## 颜色
```html
<script>
    var color1 = d3.rgb(40, 80, 0);
    var color2 = d3.rgb('red');
    var color3 = d3.rgb('rgb(0,255,255)');

    console.log(color1.brighter(2)); // [81, 163, 0]
    console.log(color1); //[40,80,0]

    console.log(color2.darker(2)); //[124, 0, 0]
    console.log(color2); //[255,0,0]

    console.log(color3.formatHsl()); //[180,100%, 50%]
    console.log(color3.toString()); //[0,255,255], formatRgb()的别名
    console.log(color3.formatRgb());//[0,255,255]
    console.log(color3.formatHex());//#00ffff


    var hsl = d3.hsl(120, 1, 0.5);

    console.log(hsl.brighter());//[120,1,0.714]
    console.log(hsl.darker());//[120,1,0.35]
    console.log(hsl.rgb());//[0,255,0]
    console.log(hsl.formatHex());//#00ff00
    console.log(hsl.formatRgb());//[0,255,0]

    //插值
    var a = d3.rgb(255,0,0); //红色
    var b = d3.rgb(0,255,0); //绿色

    var compute = d3.interpolate(a,b);
    console.log(compute(0)); //[255,0,0]
    console.log(compute(1)); //[0,255,0]
    console.log(compute(0.5));//[128,128,0]
    console.log(compute(2)); //[0,255,0]
    console.log(compute(-1));//[255,0,0]
</script>
```
## 线段生成器
```html
<script>
    var width = 400;
    var height = 400;
    //var lines = [[80,80], [200, 100], [200,200], [100,200]];
    var lines = [80, 120,160,200,240,280]
    var linePath = d3.line()
                     .curve(d3.curveCardinalClosed.tension(0.5))  //曲线方式
                     //.defined(function(d){ return !isNaN(d[0]) && !isNaN(d[1]);}) //是否绘制该线段点
                     .defined(function(d){return d<200})
                     .x(function(d){return d;})
                     .y(function(d, i){return (i%2==0)?40:120;});
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height);
    svg.append('path')
       .attr('d', linePath(lines))
       .attr('stroke', 'black')
       .attr('stroke-width', '3px')
       .attr('fill', 'none');
</script>
```
## 区域生成器
```html
<script>
    var width = 500;
    var height = 500;
    var dataset = [80, 120,130,70,60,90]
    var areaPath = d3.area()
                     //.curve(d3.curveStep)  //曲线方式
                     .curve(d3.curveBasis)
                     //.defined(function(d){ return !isNaN(d[0]) && !isNaN(d[1]);}) //是否绘制该线段点
                     //.defined(function(d){return d<200;})
                     .x(function(d, i){return 50+i*80;})
                     .y0(function(d, i){return height/2;})
                     .y1(function(d, i){return height/2-d;});
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height);
    svg.append('path')
       .attr('d', areaPath(dataset))
       .attr('stroke', 'black')
       .attr('stroke-width', '3px')
       .attr('fill', 'none');
</script>
```
## 弧生成器
```html
<script>
    var width = 500;
    var height = 500;
    var dataset = {startAngle:0, endAngle:Math.PI*0.75};
    var arcPath = d3.arc()
                    .innerRadius(0)
                    .outerRadius(100);
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height);
    svg.append('path')
       .attr('d', arcPath(dataset))
       .attr('transform', 'translate(250, 250)')
       .attr('stroke', 'black')
       .attr('stroke-width', '3px')
       .attr('fill', 'none');
</script>
```
```html
<script>
    var width = 500;
    var height = 500;
    var dataset = [{startAngle:0, endAngle:Math.PI*0.6},
                   {startAngle:Math.PI*0.6, endAngle:Math.PI},
                   {startAngle:Math.PI, endAngle:Math.PI*1.7},
                   {startAngle:Math.PI*1.7, endAngle:Math.PI*2}];
    var color = d3.schemeCategory10;
    var arcPath = d3.arc()
                    .innerRadius(0)
                    .outerRadius(100);
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height);
    svg.selectAll('path')
       .data(dataset)
       .enter()
       .append('path')
       .attr('d', d =>{return arcPath(d);})
       .attr('transform', 'translate(250, 250)')
       .attr('stroke', 'black')
       .attr('stroke-width', '3px')
       .attr('fill', (d, i) => {return color[i];});
    svg.selectAll('text')
       .data(dataset)
       .enter()
       .append('text')
       .attr('transform', d => {return 'translate(250,250)'+'translate('+arcPath.centroid(d)+')'; })
       .attr('text-anchor', 'middle')
       .attr('fill', 'white')
       .text(d => {return Math.floor((d.endAngle -d.startAngle)*180/Math.PI)+'°';});

</script>
```
![image](/assets/img/D3js/Pie_chart.png)
## 符号生成器
```html
<script>
    var width = 500;
    var height = 500;

    var n = 30;

    var dataset = [];
    for(var i=0;i<n;i++){
        dataset.push({
            size: Math.random()*30 + 200,
            type: d3.symbols[Math.floor(Math.random()*d3.symbols.length)]
        });
    }
    var symbol = d3.symbol()
                   .size(d => {return d.size;})
                   .type(d => {return d.type;});
    var color = d3.schemeCategory10;
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height);
    svg.selectAll('path')
       .data(dataset)
       .enter()
       .append('path')
       .attr('d', d => {return symbol(d);})
       .attr('transform', (d, i) => {
            var x = 100+i%5*20;
            var y = 100+Math.floor(i/5)*20;
            return 'translate('+x+','+y+')';
       })
       .attr('fill', (d, i) => {return color[i%10];})
</script>
```
![image](/assets/img/D3js/Symbols_chart.png)
## 弦生成器
```html
<script>
    var width = 500;
    var height = 500;

    var dataset = {
        source:{
            startAngle:0.2,
            endAngle:Math.PI*0.3,
            radius:100
        },
        target:{
            startAngle:Math.PI*1.0,
            endAngle:Math.PI*1.6,
            radius:100
        }
    };

    var ribbon = d3.ribbon()
                  .source(d => {return d.source;})
                  .target(d => {return d.target;})
                  .startAngle(d => {return d.startAngle;})
                  .endAngle(d => {return d.endAngle})
                  .radius(d => {return d.radius;});


    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

    svg.append('path')
       .attr('d', d => {return ribbon(dataset);})
       .attr('transform', 'translate(200,200)')
       .attr('fill', 'yellow')
       .attr('stroke', 'black')
       .attr('stroke-width', 3);
</script>
```
![image](/assets/img/D3js/Ribbon_chart.png)
## 对角生成器
```html
<script>
    var width = 500;
    var height = 500;

    var dataset = {
        source:[100,100],
        target:[300,200]
    };

    //var link = d3.linkHorizontal();
    var link = d3.linkVertical()
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

    svg.append('path')
       .attr('d', link(dataset))
       .attr('fill', 'none')
       .attr('stroke', 'black')
       .attr('stroke-width', 3);

</script>
```
![image](/assets/img/D3js/Link_chart.png)
## 折线图
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="d3/d3.js" charset="utf-8"></script>

    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
    <script type="text/css">
        .axis path,
        .axis line{
            fill: none;
            stroke: black;
            shape-rendering: crispEdges;
        }
        .axis text{
            font-family: sans-serif;
            font-size: 11px;
        }

    </script>
</head>
<body>
<script>
    var width = 500;
    var height = 500;
    var padding = {top:50, right:50, bottom:50, left:50};
    var dataset =[
        {
            Country:'China',
            GDP:[[2000, 11920], [2001, 13170], [2002, 14550],
                 [2003, 16500], [2004, 19440], [2005, 22870],
                 [2006, 27930], [2007, 35040], [2008, 45470],
                 [2009, 51050], [2010, 59490], [2011, 73140],
                 [2012, 83860], [2013, 103550]]
        },
        {
            Country:'Japan',
            GDP:[[2000, 47310], [2001, 41590], [2002, 39800],
                 [2003, 43020], [2004, 46550], [2005, 45710],
                 [2006, 43560], [2007, 43560], [2008, 48490],
                 [2009, 50350], [2010, 54950], [2011, 59050],
                 [2012, 59370], [2013, 48980]]
        }
    ];

    var gdpmax=0;
    for(var i=0;i<dataset.length;i++){
        var currGdp = d3.max(dataset[i].GDP, d => {return d[1]});
        gdpmax = d3.max([gdpmax, currGdp]);
    }

    var xScale = d3.scaleLinear()
                   .domain([2000, 2013])
                   .range([0, width - padding.left - padding.right]);
    var yScale = d3.scaleLinear()
                   .domain([0, gdpmax*1.1])
                   .range([height - padding.top-padding.bottom, 0]);

    var linePath = d3.line()
                     .x(d => {return xScale(d[0])})
                     .y(d => {return yScale(d[1])});

    var colors = [d3.rgb(0,255,0), d3.rgb(0,0,255)];

    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height);


    svg.selectAll('path')
       .data(dataset)
       .enter()
       .append('path')
       .attr('transform', 'translate('+padding.left+','+padding.top+')')
       .attr('d', d => {return linePath(d.GDP)})
       .attr('fill', 'none')
       .attr('stroke-width', 3)
       .attr('stroke', (d, i) => {return colors[i];});

    var xAxis = d3.axisBottom()
                  .scale(xScale)
                  .ticks(5)
                  .tickFormat(d3.format('d'));
    var yAxis = d3.axisLeft()
                  .scale(yScale);

    svg.append('g')
       .attr('class', 'axis')
       .attr('transform', 'translate('+padding.left+','+(height-padding.bottom)+')')
       .call(xAxis);
    svg.append('g')
       .attr('class', 'axis')
        .attr('transform', 'translate('+padding.left+','+padding.top+')')
        .call(yAxis);
    var symbols = [{
        size: 144,
        type: d3.symbolSquare
    },{
        size: 144,
        type: d3.symbolSquare
    }];
    var symbol = d3.symbol()
                   .size(d => {return d.size;})
                   .type(d => {return d.type;});


    svg.selectAll('.symbolPath')
       .data(symbols)
       .enter()
       .append('path')
       .attr('d', d => {return symbol(d);})
       .attr('transform', (d, i) => {return 'translate('+(padding.left+i*50)+','+(height - padding.bottom/3)+')'})
       .attr('fill', (d, i) => {return colors[i];});
    console.log(dataset[0].Country);

    svg.selectAll('.mytext')
       .data(dataset)
       .enter()
       .append('text')
       .attr('text-anchor', 'middle')
       .attr('font-size', '12px')
       .attr('dy', '0.4em')
       .attr('transform', (d, i) => {return 'translate('+(padding.left+i*50+25)+','+(height - padding.bottom/3)+')'})
       .attr('fill', 'black')
       .text(d => {console.log(d.Country); return d.Country;});


</script>
</body>
</html>
```
![image](/assets/img/D3js/Broken_line_chart.png)

> # 动画

## 过渡效果
### 过渡的启动和属性
```html
<script>
    var width = 500;
    var height = 500;
    var padding = {top:50, right:50, bottom:50, left:50};

    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

    var rect = svg.append('rect')
                  .attr('fill', 'steelblue')
                  .attr('x', 10)
                  .attr('y', 10)
                  .attr('width', 20)
                  .attr('height', 30);
    console.log(rect);
    console.log(rect.attr('height'));
    var rectTran = rect.transition()
                       //.delay(1000)        //过渡延迟
                       .duration(2000)     //过渡时长
                       .ease(d3.easeBounce)      //过渡样式
                       .attr('width', 300);  //目标值
<!--                       .transition()-->
<!--                       .attr('height', 300)-->
<!--                       .transition()-->
<!--                       .attr('width', 100)-->
<!--                       .transition()-->
<!--                       .attrTween('height', (d,i,a) => {-->
<!--                            console.log(a[0].height.baseVal.value); //a为元素数组，这里为[rect], 此处获取rect的高-->
<!--                            var height = a[0].height.baseVal.value;-->
<!--                            return (t) => {return height - t * (height - 100);}; //自定义插值函数-->
<!--                       })-->
<!--                       .transition()-->
<!--                       .style('fill', 'red');  //过渡style-->

    var text = svg.append('text')
                  .attr('fill', 'red')
                  .attr('x', 40)
                  .attr('y', 10)
                  .attr('dx', '-1em')
                  .attr('dy', '1.2em')
                  .attr('text-anchor', 'end')
                  .text(40);
    var textTran = text.transition()
                       .delay(1000)
                       .duration(2000)
                       //textTween与text的区别在于textTween内的函数需要返回text数据，而tween则不需要
                       //同时注意textTween过渡时间内会根据返回值更新text文本，那么及时select.text()设置了，由于没有返回值只会为空
                       //.textTween(function(){
                       //     console.log(this);
                       //     return function(t){
                       //         d3.select(this)
                       //           .attr('x', 40+t*260)
                       //           .text('aaa'); //没用了，return后又重新赋了值！
                       //         return Math.floor(40+t*260);
                       //    };
                       //     //return d3.interpolateRound(20, 300);
                       //});
                       //.tween("attr.fill", function() {
                       //     var i = d3.interpolateRgb(this.getAttribute("fill"), "blue");
                       //     return function(t) {
                       //         this.setAttribute("fill", i(t));
                       //     };
                       // });
                       .tween('text', function(){
                            //注意箭头没有this！！！！注意啊！要用this的话千万不要用箭头函数
                            console.log(d3.select(this));
                            return function(t){
                                console.log(d3.select(this));
                                d3.select(this)
                                  .attr('x', 40+t*260)
                                  .text(Math.floor(40+t*260));
                            }
                       });


    console.log(rectTran);


</script>
```
### 子元素以及on、each
```html
<script>
    var width = 500;
    var height = 500;
    var padding = {top:50, right:50, bottom:50, left:50};
    var dataset = [100,100,100];
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

    var g = svg.append('g')
    var rect = g.selectAll('rect')
                .data(dataset)
                .enter()
                .append('rect')
                .attr('fill', 'steelblue')
                .attr('id', (d, i) => {return 'rect' + i;})
                .attr('x', 10)
                .attr('y', (d, i) => {return 10+i*35;})
                .attr('width', (d) => {return d;})
                .attr('height', 30);
    g.transition() //与select交换顺序也可以
     .duration(2000)
     .select('#rect1')
     .on('start', (d, i) => {
        console.log('start');
     })
     .on('end', (d, i) => {
        console.log('end');
     })
     .each((d, i) =>{
        console.log(d);
     })
     .attr('width', 300);

<!--    g.transition()-->
<!--     .delay(2000)  //两个过渡同时进行，如果delay值更小，上一个过渡end中断，不输出end-->
<!--     .duration(2000)-->
<!--     .selectAll('rect')-->
<!--     .attr('width', 400);-->
</script>
```
### call()
```html
<script>
    var width = 500;
    var height = 500;
    var padding = {top:50, right:50, bottom:50, left:50};
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

    var xScale = d3.scaleLinear()
                   .domain([0,10])
                   .range([0,300]);
    var xAxis = d3.axisBottom()
                  .scale(xScale);
    var g = svg.append('g')
               .attr('calss', 'axis')
               .attr('transform', 'translate(50, 200)')
               .call(xAxis);
    xScale.domain([0,50])
    g.transition()
     .duration(2000)
     .call(xAxis);
</script>
```
## 定时器
```html
<script>
    //注意d3.interval与之区别在于interval是每delay调用一次回调函数，而d3.timer仅调用一次
    //二者参数(callback[delay,[time]])
    var t = d3.timer(function(elapsed){
        console.log(elapsed);
        if (elapsed > 2200) t.stop();
    },1000);

    var date = new Date(2020,1,1,15,30,29);
    console.log(date); //Sat Feb 01 2020 15:30:29
    console.log(+date); //158054229000,与getTime()等同,毫秒级
    console.log(date.getTime());
</script>
```
## 应用过渡的场合：更新、添加、删除
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="d3/d3.js" charset="utf-8"></script>

    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
    <script type="text/css">
        .axis path,
        .axis line{
            fill: none;
            stroke: black;
            shape-rendering: crispEdges;
        }
        .axis text{
            font-family: sans-serif;
            font-size: 11px;
        }

    </script>
</head>
<body>
<script>
    var center = [[0.5,0.5],[0.7,0.8],[0.4,0.9],[0.11,0.32],
                  [0.88,0.25],[0.75,0.12],[0.5,0.1],[0.2,0.3],
                  [0.4,0.1],[0.6,0.7]];

    var width = 500;
    var height = 500;
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height);
    var padding = {top:30,right:30,bottom:30, left:30};

    var xAxisWidth = 300;
    var yAxisWidth = 300;
    var xScale = d3.scaleLinear()
                   .domain([0,1.2])
                   .range([0,xAxisWidth]);
    var yScale = d3.scaleLinear()
                   .domain([0,1.2])
                   .range([0,yAxisWidth]);

    function drawCircle(){
        var circleUpdate = svg.selectAll('circle')
                              .data(center);
        var circleEnter = circleUpdate.enter();
        var circleExit = circleUpdate.exit();
        var colors = d3.schemeCategory10;
        circleUpdate.transition()
                    .duration(500)
                    .attr('cx', d => {
                        return padding.left + xScale(d[0]);
                    })
                    .attr('cy', d => {return height - padding.bottom - yScale(d[1])});
        circleEnter.append('circle')
                   .attr('fill', (d, i) => {return colors[i%10];})
                   .attr('cx', padding.left)
                   .attr('cy', height-padding.bottom)
                   .attr('r', 7)
                   .transition()
                   .duration(500)
                   .attr('cx', d => {return padding.left + xScale(d[0]);})
                   .attr('cy', d => {
                        //console.log(d[1]+' '+yScale(d[1]))
                        return height-padding.bottom-yScale(d[1]);
                   });
        circleExit.transition()
                  .duration(500)
                  .attr('fill', 'white')
                  .remove();
    }

    function drawAxis(){
        var xAxis = d3.axisBottom()
                      .scale(xScale)
                      .ticks(5);
        yScale.range([yAxisWidth, 0]);
        var yAxis = d3.axisLeft()
                      .scale(yScale)
                      .ticks(5);
        svg.append('g')
           .attr('class', 'axis')
           .attr('transform', 'translate('+padding.left+','+(height-padding.bottom)+')')
           .call(xAxis);
        svg.append('g')
           .attr('class', 'axis')
           .attr('transform', 'translate('+padding.left+','+(height-padding.bottom-yAxisWidth)+')')
           .call(yAxis);
        yScale.range([0, yAxisWidth]);
    }

    function update(){
        for(var i=0;i<center.length;i++){
            center[i][0]=Math.random();
            center[i][1]=Math.random();
        }
        drawCircle();
    }
    function add(){
        center.push([Math.random(), Math.random()])
        drawCircle();
    }
    function sub(){
        center.pop(); //删除center数组汇总最后一个点
        drawCircle();
    }
    drawAxis();
</script>
<button type="button" onclick="update()">更新</button>
<button type="button" onclick="add()">添加</button>
<button type="button" onclick="sub()">减少</button>
</body>
</html>
```
![image](/assets/img/D3js/Animation_01.png)
![image](/assets/img/D3js/Animation_02.png)
![image](/assets/img/D3js/Animation_03.png)
## 时钟
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="d3/d3.js" charset="utf-8"></script>

    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
    <script type="text/css">
        .axis path,
        .axis line{
            fill: none;
            stroke: black;
            shape-rendering: crispEdges;
        }
        .axis text{
            font-family: sans-serif;
            font-size: 11px;
        }
        .time{
            font-family: Cursive;
            font-size: 40px;
            stroke: black;
            stroke-width: 2;
        }
    </script>
</head>
<body>
<script>
    var width = 500;
    var height = 500;
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height);
    var padding = {top:30,right:30,bottom:30, left:30};

    function getTimeString(){
        var time = new Date();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();

        hours = hours < 10 ? '0'+hours:hours;
        minutes = minutes < 10 ? '0'+minutes:minutes;
        seconds = seconds < 10 ? '0'+seconds:seconds;

        return hours+':'+minutes+':'+seconds;
    }

    var timeText = svg.append('text')
                      .attr('x', 100)
                      .attr('y', 100)
                      .attr('class', 'time')
                      .text(getTimeString());

    var timer = d3.interval(function updateTime(e){
        timeText.text(getTimeString());
    }, 1000);


</script>
</body>
</html>
```
## 小球运动
```html
<script>
    var width = 500;
    var height = 500;
    var padding = {top:30, bottom:30, left:30, right:30};
    var center = {x:100, y:100};
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height);
    var ball = svg.append('circle')
                  .datum(center)
                  .transition()
                  .duration(1000)
                  .attr('cx', function(d){return d.x;})
                  .attr('cy', function(d){return d.y;})
                  .attr('r', 10)
                  .attr('fill', 'red');

    var preTime = Date.now();
    var nowTime = Date.now();
    var interval = (nowTime - preTime)*0.000001;

    var colors = d3.schemeCategory10;
    d3.interval(function updateBall(e){
        nowTime = Date.now();
        interval = (nowTime - preTime) * 0.000001;

        svg.select('circle')
           .transition()
           .duration(1000)
           .attr('cx', function(d){return Math.floor(Math.random()*(width-padding.left-padding.right))+padding.left;})
           .attr('cy', function(d){return Math.floor(Math.random()*(width-padding.left-padding.right))+padding.left;})
           .attr('r', 10)
           .attr('fill', d => {return colors[Math.floor(Math.random()*10)];});
    },1000);

</script>
```
> # 交互

## 交互式入门
```html
<body>
<p id="mypara">Click Here</p>
<script>
    d3.select('#mypara')
      .on('click.first', function() {
            console.log(this);
            d3.select(this).text('Thank you');
      })
      .on('click.second', function(){
            console.log('Second');
      });
      //.on('click', null); //删除监听器

    //过渡对象没有On(),所以注意顺序
    svg.select('circle')
       .on()
       .transition();
</script>

</body>
```
### 鼠标
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="d3/d3.js" charset="utf-8"></script>

    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
</head>
<body>
<script>
    var dataset = [50, 43, 120, 87, 99, 167, 142];
    var width = 400;
    var height = 400;
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
    var padding = {top:20, right:20, bottom:20, left:20};
    var rectStep = 35; //矩形所占的宽度（包括空白），单位为像素
    var rectWidth = 30; //矩形所占的宽度（不包括空白），单位为像素

    var xAxisWidth = 300;
    var yAxisWidth = 300;

    function draw(){
        var updateRect = svg.selectAll('.myrect')
                            .data(dataset);
        var enterRect = updateRect.enter();
        var exitRect = updateRect.exit();

        updateRect.attr('fill', 'steelblue')
                  .attr('x', function(d, i){
                    return padding.left + i*rectStep;
                  })
                  .attr('y', function(d){
                    return height-padding.bottom-d;
                  })
                  .attr('width', rectWidth)
                  .attr('height', function(d){
                    return d;
                  })
                  .on('mouseover', function(d,i){
                        d3.select(this)
                          .attr('fill', 'yellow')
                  })
                  .on('mouseout', function(d, i){
                        d3.select(this)
                          .transition()
                          .duration(500)
                          .attr('fill', 'steelblue');
                  });
        enterRect.append('rect')
                 .attr('fill', 'steelblue')
                 .attr('x', function(d, i){
                    return padding.left + i*rectStep;
                  })
                  .attr('y', function(d){
                    return height-padding.bottom-d;
                  })
                  .attr('width', rectWidth)
                  .attr('height', function(d){
                    return d;
                  })
                  .on('mouseover', function(d,i){
                        d3.select(this)
                          .attr('fill', 'yellow')
                  })
                  .on('mouseout', function(d, i){
                        d3.select(this)
                          .transition()
                          .duration(500)
                          .attr('fill', 'steelblue');
                  });
        exitRect.remove();

        var updateText = svg.selectAll('.mytext')
                            .data(dataset);
        var enterText = updateText.enter();
        var exitText = updateText.exit();

        updateText.attr('fill', 'blue')
                  .attr('font-size', '14px')
                  .attr('text-anchor', 'middle')
                  .attr('x', function(d, i){
                    return padding.left + i*rectStep;
                  })
                  .attr('y', function(d, i){
                    return height - padding.bottom - d;
                  })
                  .attr('dx', rectWidth/2)
                  .attr('dy', '-1em')
                  .text(function(d){
                    return d;
                  });
        enterText.append('text')
                 .attr('fill', 'blue')
                  .attr('font-size', '14px')
                  .attr('text-anchor', 'middle')
                  .attr('x', function(d, i){
                    return padding.left + i*rectStep;
                  })
                  .attr('y', function(d, i){
                    return height - padding.bottom - d;
                  })
                  .attr('dx', rectWidth/2)
                  .attr('dy', '-1em')
                  .text(function(d){
                    return d;
                  });
        exitText.remove();

    }
    function clear(){
        var updateRect = svg.selectAll('rect')
        var updateText = svg.selectAll('text')
        updateRect.remove();
        updateText.remove();
    }
    function mysort(){
        clear();
        dataset.sort(d3.ascending);
        draw();
    }
    function myadd(){
        clear();
        dataset.push(Math.floor(Math.random()*100));
        draw();
    }


</script>
<button type="button" onclick="mysort()">排序</button>
<button type="button" onclick="myadd()">增加数据</button>
</body>
</html>
```
### 键盘
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
<!--    <script src="d3/d3.js" charset="utf-8"></script>-->
    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>
    <script type="text/css">
        .axis path,
        .axis line{
            fill: none;
            stroke: black;
            shape-rendering: crispEdges;
        }
        .axis text{
            font-family: sans-serif;
            font-size: 11px;
        }
        .time{
            font-family: Cursive;
            font-size: 40px;
            stroke: black;
            stroke-width: 2;
        }

    </script>
</head>
<body>
<script>
    var width = 500;
    var height = 500;
    var characters = ['A','S','D','F'];
    var svg = d3.select('body')
                .append('svg')
                .attr('width' ,width)
                .attr('height', height);
    var rects = svg.selectAll('rect')
                   .data(characters)
                   .enter()
                   .append('rect')
                   .attr('x', (d,i)=>{return 10+i*60;})
                   .attr('y', 150)
                   .attr('width', 55)
                   .attr('height', 55)
                   .attr('rx', 5)
                   .attr('ry', 5)
                   .attr('fill', 'black');

    var texts = svg.selectAll('text')
                   .data(characters)
                   .enter()
                   .append('text')
                   .attr('x', (d,i)=>{return 10+i*60;})
                   .attr('y', 150)
                   .attr('dx', 10)
                   .attr('dy', 25)
                   .attr('fill', 'white')
                   .attr('font-size', 24)
                   .text(d => {return d;});

    d3.select('body')
      .on('keydown', function(){
            rects.attr('fill', function(d){
                console.log(d3.event);
                if(d==String.fromCharCode(d3.event.keyCode)){
                    return 'yellow';
                }else{
                    return 'black';
                }
            })
      })
      .on('keyup', function(){
            rects.attr('fill', 'black');
      });
</script>

</body>
</html>
```
### 触摸
```html
<script>
    var width = 500;
    var height = 500;
    var svg = d3.select('body')
                .append('svg')
                .attr('width' ,width)
                .attr('height', height);
    var circle = svg.append('circle')
                    .attr('cx', 200)
                    .attr('cy', 200)
                    .attr('r', 50)
                    .attr('fill', 'blue')
                    .on('touchstart', function(){
                        d3.select(this)
                          .attr('fill', 'yellow');
                    })
                    .on('touchmove', function(){
                        var pos = d3.touches(this)[0];
                        d3.select(this)
                          .attr('cx', pos[0])
                          .attr('cy', pos[1]);
                    })
                    .on('touchend', function(){
                        d3.select(this).attr('fill', 'blue');
                    });
</script>
```
## 事件
```html
<div style="padding:50px; background-color: gray;"></div>
<script>
    var width = 400;
    var height = 400;
    var svg = d3.select('div')
                .append('svg')
                .style('background-color', 'yellow')
                .attr('width' ,width)
                .attr('height', height);
    svg.append('rect')
       .attr('x', 200)
       .attr('y', 100)
       .attr('width', 100)
       .attr('height', 100)
       .on('click', function(){
            console.log(d3.mouse(this)); //左上角[200,100]，说明相对于svg的坐标
            console.log(d3.event.pageX); //左上角横坐标260，10+250,10为页面相对于浏览器内容的padding
       });
</script>

</body>
```
![image](/assets/img/D3js/Event_01.png)
## 拖拽
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
<!--    <script src="d3/d3.js" charset="utf-8"></script>-->
    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>
    <script type="text/css">
        .axis path,
        .axis line{
            fill: none;
            stroke: black;
            shape-rendering: crispEdges;
        }
        .axis text{
            font-family: sans-serif;
            font-size: 11px;
        }
        .time{
            font-family: Cursive;
            font-size: 40px;
            stroke: black;
            stroke-width: 2;
        }

    </script>
</head>
<body>
<script>
    var width = 400;
    var height = 400;
    var svg = d3.select('body')
                .append('svg')
                .attr('width' ,width)
                .attr('height', height);
    var circles = [{cx:150, cy:200, r:30},{cx:250, cy:200, r:30}];

    var drag = d3.drag()
                 .on('start', d => {
                      console.log('拖拽开始');
                 })
                 .on('end', d => {
                      console.log('拖拽结束');
                 })
                 .on('drag', function(d){
                      d3.select(this)
                        .attr('cx', d.cx = d3.event.x)
                        .attr('cy', d.cy = d3.event.y);
                 });
    svg.selectAll('circle')
       .data(circles)
       .enter()
       .append('circle')
       .attr('cx', d => {return d.cx;})
       .attr('cy', d => {return d.cy;})
       .attr('r', d => {return d.r;})
       .attr('fill', 'black')
       .call(drag);
</script>

</body>
</html>
```
## 缩放
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
<!--    <script src="d3/d3.js" charset="utf-8"></script>-->
    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>
    <script type="text/css">
        .axis path,
        .axis line{
            fill: none;
            stroke: black;
            shape-rendering: crispEdges;
        }
        .axis text{
            font-family: sans-serif;
            font-size: 11px;
        }
        .time{
            font-family: Cursive;
            font-size: 40px;
            stroke: black;
            stroke-width: 2;
        }

    </script>
</head>
<body>
<script>
    var width = 500;
    var height = 500;
    var svg = d3.select('body')
                .append('svg')
                .style('background-color', 'yellow')
                .attr('width', width)
                .attr('height',height);
                //.attr('viewBox', [0,0,width,height]);
    var circles = [{cx:150, cy:200, r:30},
                   {cx:220, cy:200, r:30},
                   {cx:150, cy:270, r:30},
                   {cx:220, cy:270, r:30}];
    var zoom = d3.zoom()
                 .extent([[0,0],[200, 200]])
                 .scaleExtent([1,10])  //设置缩放的方位1至10倍
                 .on('zoom', function(d){
                      d3.select(this)
                        .attr('transform', d3.event.transform);//缩放
                        //.transition()
                        //.duration(200)
                        //.attr('transform','translate('+d3.event.transform.x+','+d3.event.transform.y+')'+'scale('+d3.event.transform.k+')');
                      console.log(d3.event.transform);
                 });

    var g = svg.append('g');
    g.selectAll('circle')
       .data(circles)
       .enter()
       .append('circle')
       .attr('cx', d => {return d.cx;})
       .attr('cy', d => {return d.cy;})
       .attr('r', d => {return d.r;})
       .attr('fill', 'black');
    g.call(zoom); //g一个整体缩放
</script>

</body>
</html>

```
> # 导入和导出

## 导入
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="./d3/d3.js" charset="utf-8"></script>
    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
    <script type="text/css">
        .axis path,
        .axis line{
            fill: none;
            stroke: black;
            shape-rendering: crispEdges;
        }
        .axis text{
            font-family: sans-serif;
            font-size: 11px;
        }
        .time{
            font-family: Cursive;
            font-size: 40px;
            stroke: black;
            stroke-width: 2;
        }


    </script>
</head>
<body>
<script>
    d3.json('./data/example_data.json')
      .then(function(data){
        console.log(data);
      });
    d3.csv('./data/example_data.csv', function(d){ //对每项数据进行操作
        return {
            name: d.name,
            age: Number(d.age)+10,
            sex: d.sex
        };
      })
      .then(function(data){
        console.log(data);
        console.log(data[0]);
        console.log(data[1]);
      });
    d3.xml('./data/example_data.xml')
      .then(function(data){
        console.log(data);
        console.log(data.getElementsByTagName('title')[0].innerHTML);
        console.log(data.getElementsByTagName('date')[0].innerHTML);
        console.log(data.getElementsByTagName('body')[0].innerHTML);
      });
    d3.text('./data/example_data.text')
      .then(function(data){
        console.log(data);
      });
</script>

</body>
</html>

```
```html
index.html:33 {name: "中国", children: Array(2)}
index.html:43 (2) [{…}, {…}, columns: Array(3)]
index.html:44 {name: "张三", age: 32, sex: "男"}
index.html:45 {name: "Lily", age: 32, sex: "Female"}
index.html:49 #document
index.html:50 XML Text
index.html:51 2020.03.23
index.html:52 Hello, XML
index.html:56 This is a text file.
```

> # 布局

## 饼图
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="./d3/d3.js" charset="utf-8"></script>
    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
    <script type="text/css">
        .axis path,
        .axis line{
            fill: none;
            stroke: black;
            shape-rendering: crispEdges;
        }
        .axis text{
            font-family: sans-serif;
            font-size: 11px;
        }
        .time{
            font-family: Cursive;
            font-size: 40px;
            stroke: black;
            stroke-width: 2;
        }


    </script>
</head>
<body>
<script>
    var width = 500;
    var height = 500;
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

    var dataset = [['小米', 60.8], ['三星', 58.4],  ['联想', 47.3],
                   ['苹果', 46.6], ['华为', 41.3], ['酷派', 40.1], ['其他', 111.5]];
    var pie = d3.pie()
                .startAngle(Math.PI*0.2)
                .endAngle(Math.PI*1.5)
                .value(function(d){return d[1];});
    var piedata = pie(dataset);
    console.log(piedata);

    var outerRadius = width / 3;
    var innerRadius = 0;


    var arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

    var colors = d3.schemeCategory10;
    var arcs = svg.selectAll('g')
                  .data(piedata)
                  .enter()
                  .append('g')
                  .attr('transform', 'translate('+(width/2)+','+(height/2)+')');
    // 绘制
    arcs.append('path')
        .attr('fill', function(d, i){
            return colors[i%10];
        })
        .attr('d', function(d){
            return arc(d);
        });
    // 文字
    arcs.append('text')
        .attr('transform', function(d){
            var x = arc.centroid(d)[0] * 1.4; //文字横坐标
            var y = arc.centroid(d)[1] * 1.4; //文字纵坐标，相对于圆心
            console.log(x)
            return 'translate('+x+','+y+')';
        })
        .attr('text-anchor', 'middle')
        .text(function(d){
            var percent = Number(d.value)/d3.sum(dataset, function(d){return d[1];})*100;

            return percent.toFixed(1) +'%';
        });
    //添加链接弧外文字的直线元素
    arcs.append('line')
        .attr('stroke', 'black')
        .attr('x1', d => {return arc.centroid(d)[0]*2})
        .attr('y1', d => {return arc.centroid(d)[1]*2})
        .attr('x2', d => {return arc.centroid(d)[0]*2.2;})
        .attr('y2', d => {return arc.centroid(d)[1]*2.2});
    //添加弧外的文字元素
    arcs.append('text')
        .attr('transform', d => {
            var x = arc.centroid(d)[0]*2.5;
            var y = arc.centroid(d)[1]*2.5;
            return 'translate('+x+','+y+')';
        })
        .attr('text-anchor', 'middle')
        .text(d => {return d.data[0];});
</script>

</body>
</html>

```
![image](/assets/img/D3js/layout_pie_01.png)
![image](/assets/img/D3js/layout_pie_02.png)

## 力向导图
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="./d3/d3.js" charset="utf-8"></script>
    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
    <script type="text/css">
        .axis path,
        .axis line{
            fill: none;
            stroke: black;
            shape-rendering: crispEdges;
        }
        .axis text{
            font-family: sans-serif;
            font-size: 11px;
        }
        .time{
            font-family: Cursive;
            font-size: 40px;
            stroke: black;
            stroke-width: 2;
        }


    </script>
</head>
<body>
<script>
    var width = 500;
    var height = 500;
    var padding = {top:60,bottom:60,left:60,right:60};
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height);
    var g = svg.append('g')
               .attr('transform', 'translate('+padding.top+','+padding.left+')');
    var nodes = [{name: '0'}, {name: '1'}, {name: '2'}, {name: '3'}, {name: '4'},
                 {name: '5'}, {name: '6'}];
    var edges = [{source: 0, target: 1, relation: 'x', value:1.3},
                 {source: 0, target: 2, relation: 'x', value:1},
                 {source: 0, target: 3, relation: 'x', value:1},
                 {source: 1, target: 4, relation: 'x', value:1.4},
                 {source: 1, target: 5, relation: 'x', value:0.7},
                 {source: 1, target: 6, relation: 'x', value:0.8}];
    var forceSimulation = d3.forceSimulation()
                  .force('link', d3.forceLink())
                  .force('charge', d3.forceManyBody())
                  .force('center', d3.forceCenter());
    //计算节点、边数据、设置图形中心位置
    forceSimulation.nodes(nodes)
                   .on('tick', ticked); //非常重要，更新元素
    forceSimulation.force('link')
                   .links(edges)
                   .distance(d => d.value*100);
    forceSimulation.force('center')
                   .x(width/2)
                   .y(height/2);
    console.log(nodes);
    console.log(edges);
    var colors = d3.schemeCategory10;
    //绘制边
    var links = g.append('g')
                 .selectAll('line')
                 .data(edges)
                 .enter()
                 .append('line')
                 .attr('stroke', (d, i) => colors[i%10])
                 .attr('stroke-width', 1);
    //边上的文字
    var linksText = g.append('g')
                     .selectAll('text')
                     .data(edges)
                     .enter()
                     .append('text')
                     .text(d => d.relation);
    //节点
    var gs = g.selectAll('.circleText')
              .data(nodes)
              .enter()
              .append('g')
              .attr('transform', function(d, i){
                    var x = d.x;
                    var y = d.y;
                    return 'translate('+x+','+y+')';
              })
              .call(d3.drag()
                      .on('start', started)
                      .on('drag', dragged)
                      .on('end', ended)
              );

    gs.append('circle')
      .attr('r', 10)
      .attr('fill', (d, i) => colors[i%10]);
    gs.append('text')
      .attr('x', -10)
      .attr('y', -20)
      .attr('dy', 10)
      .text(d => d.name);

    function ticked(){
        links.attr('x1', d => d.source.x)
             .attr('y1', d => d.source.y)
             .attr('x2', d => d.target.x)
             .attr('y2', d => d.target.y)
        linksText.attr('x', d => (d.source.x+d.target.x)/2)
                 .attr('y', d => (d.source.y+d.target.y)/2);
        gs.attr('transform', d => 'translate('+d.x+','+d.y+')');
    }

    function started(d){
        if(!d3.event.active){
            //设置衰减系数，对节点位置移动过程的模拟，数值越高移动越快，数值范围[0，1]
            forceSimulation.alphaTarget(0.8).restart();
        }
        d.fx = d.x; //fx,fy为节点固定位置
        d.fy = d.y;
    }
    function dragged(d){
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    function ended(d){
        if(!d3.event.active){
            forceSimulation.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
    }
</script>

</body>
</html>

```
![image](/assets/img/D3js/force_graph.png)
## 弦图
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="./d3/d3.js" charset="utf-8"></script>
    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
    <script type="text/css">
        .axis path,
        .axis line{
            fill: none;
            stroke: black;
            shape-rendering: crispEdges;
        }
        .axis text{
            font-family: sans-serif;
            font-size: 11px;
        }
        .time{
            font-family: Cursive;
            font-size: 40px;
            stroke: black;
            stroke-width: 2;
        }


    </script>
</head>
<body>
<script>
    var width = 500;
    var height = 500;
    var padding = {top:60,bottom:60,left:60,right:60};
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height);
    var continent = ['亚洲', '欧洲', '非洲', '美洲', '大洋洲'];
    /*
          亚洲  美洲
    亚洲  9000  1000
    美洲  7000  500

    亚洲人口，有9000本地，1000来自美洲的移民，总人口9000+1000
    美洲人口，有500本地人，7000来自亚洲的移民，总人口500+7000
    */
    var population = [
        [9000, 870, 3000, 1000, 5200],
        [3400, 8000, 7700, 4881, 1050],
        [2000, 2000, 7700, 4881, 1050],
        [3000, 8012, 5531, 500, 400],
        [3540, 4310, 1500, 1900, 300]
    ];
    var chords = d3.chord()
                  .padAngle(0.03)
                  .sortSubgroups(d3.ascending);
    var chords = chords(population);

    console.log(chords.groups);
    console.log(chords);

    var gChord = svg.append('g')
                    .attr('transform', 'translate('+width/2+','+height/2+')');
    var gInner = gChord.append('g')
                       .attr('fill-opacity', 0.67);
    var gOuter = gChord.append('g');

    var colors = d3.schemeCategory10;
    var innerRadius = width/2*0.7;
    var outerRadius = innerRadius * 1.1;

    //绘制外层弧图
    var arcOuter = d3.arc()
                     .innerRadius(innerRadius)
                     .outerRadius(outerRadius);

    gOuter.selectAll('.outerPath')
          .data(chords.groups)
          .enter()
          .append('path')
          .attr('class', 'outerPath')
          .style('fill', d => colors[d.index%10])
          .attr('d', arcOuter);
    gOuter.selectAll('.outerText')
          .data(chords.groups)
          .enter()
          .append('text')
          .attr('class', 'outerText')
          .each((d,i) => {
                d.angle = (d.startAngle+d.endAngle)/2;
                d.name = continent[i];
          })
          .attr('dy', '.35em')
          .attr('transform', d =>{
                //先旋转d.angle
                var result = 'rotate('+(d.angle*180/Math.PI)+')';
                //平移到外半径之外
                result += 'translate(0,'+ -1.0 *(outerRadius + 10)+')';
                //对位于弦图下方的文字，翻转180°，为了防止其是倒着的
                //if(d.angle>Math.PI*3/4&&d.angle<Math.PI*5/4)
                //    result += 'rotate(180)';
                return result;
          })
          .text(d => d.name);

    //绘制内部弦图
    var ribbonInner = d3.ribbon()
                     .radius(innerRadius);
    gInner.selectAll('.innerPath')
          .data(chords)
          .enter()
          .append('path')
          .attr('class', 'innerPath')
          .attr('d', ribbonInner)
          .style('fill', d => colors[d.source.index%10]);


    //交互式
    gOuter.selectAll('.outerPath')
          .on('mouseover', fade(0.0))
          .on('mouseout', fade(1.0));

    function fade(opacity){
        return function(g, i){
            gInner.selectAll('.innerPath')
                  .filter(d => { //过滤器
                        //没有连接到鼠标所在节点的弦才能通过
                        return d.source.index != i && d.target.index != i;
                  })
                  .transition()
                  .style('opacity', opacity);
        }
    }
</script>
</body>
</html>

```
![image](/assets/img/D3js/chord_graph_01.png)
![image](/assets/img/D3js/chord_graph_02.png)
## 树状图
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="./d3/d3.js" charset="utf-8"></script>
    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
    <script type="text/css">
        .axis path,
        .axis line{
            fill: none;
            stroke: black;
            shape-rendering: crispEdges;
        }
        .axis text{
            font-family: sans-serif;
            font-size: 11px;
        }
        .time{
            font-family: Cursive;
            font-size: 40px;
            stroke: black;
            stroke-width: 2;
        }


    </script>
</head>
<body>
<script>
    var width = 700;
    var height = 500;
    var padding = {top:60,bottom:60,left:60,right:60};
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', 'translate('+padding.left+','+0+')');
    var tree = d3.tree()
                 .size([width-200, height-200])
                 .separation((a,b) => {
                   return (a.parent == b.parent?1:2);
                 });

    d3.json('data/city.json')
      .then(function(data){
        // var nodes = tree.nodes(data);
        // var links = tree.links(nodes);
        var hierarchyData = d3.hierarchy(data)
                              .sum(d => d.value);
        //console.log(hierarchyData);

        var treeData = tree(hierarchyData);
        var nodes = treeData.descendants();
        var links = treeData.links();
        //console.log(nodes);
        //console.log(links);

        // 绘制边
        svg.append('g')
           .selectAll('path')
           .data(links)
           .enter()
           .append('path')
           .attr('d',  d3.linkHorizontal().x(d =>d.y).y(d => d.x))
           .attr('fill', 'none')
           .attr('stroke', 'grey')
           .attr('stroke-width', 1);
        //绘制节点
        var gNodes = svg.append('g')
                        .attr('stroke-linejoin', 'round')
                        .attr('stroke-width', 3)
                        .selectAll('g')
                        .data(nodes)
                        .enter()
                        .append('g')
                        .attr('transform', d => 'translate('+d.y+','+d.x+')');
        //绘制节点文字
        gNodes.append('circle')
              .attr('fill', d => d.children?'#555':'#999')
              .attr('r', 2.5);
        gNodes.append('text')
              .attr('dy', '0.31em')
              .attr('x', d => d.children?-6:6)
              .attr('text-anchor', d => d.children?'end':'start')
              .text(d => d.data.name)
              .clone(true)
              .lower()
              .attr('stroke', 'white');
      });


</script>
</body>
</html>

```
![image](/assets/img/D3js/tree_graph.png)

## 集群图
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="./d3/d3.js" charset="utf-8"></script>
    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
    <script type="text/css">
        .axis path,
        .axis line{
            fill: none;
            stroke: black;
            shape-rendering: crispEdges;
        }
        .axis text{
            font-family: sans-serif;
            font-size: 11px;
        }
        .time{
            font-family: Cursive;
            font-size: 40px;
            stroke: black;
            stroke-width: 2;
        }


    </script>
</head>
<body>
<script>
    var width = 800;
    var height = 800;
    var radius = 400
    var padding = {top:60,bottom:60,left:60,right:60};
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', 'translate('+radius+','+radius+')');
    var cluster = d3.cluster()
                 .size([2*Math.PI, radius - 200])
                 .separation((a,b) => {
                   return (a.parent == b.parent?1:2) / a.depth; //成比例减少
                 });

    d3.json('data/city.json')
      .then(function(data){
        // var nodes = tree.nodes(data);
        // var links = tree.links(nodes);
        var hierarchyData = d3.hierarchy(data)
                              .sort((a,b) => d3.ascending(a.data.name, b.data.name));
        //console.log(hierarchyData);

        var clusterData = cluster(hierarchyData);
        var nodes = clusterData.descendants();
        var links = clusterData.links();
        //console.log(nodes);
        //console.log(links);

        // 绘制边
        svg.append('g')
           .selectAll('path')
           .data(links)
           .enter()
           .append('path')
           .attr('d',  d3.linkRadial().angle(d =>d.x).radius(d => d.y))
           .attr('fill', 'none')
           .attr('stroke', 'grey')
           .attr('stroke-width', 1);
        //绘制节点
        var gNodes = svg.append('g')
                        .attr('stroke-linejoin', 'round')
                        .attr('stroke-width', 3)
                        .selectAll('g')
                        .data(nodes)
                        .enter()
                        .append('g')
                        .attr('transform', d => {
                          var result='rotate('+(d.x*180/Math.PI-90)+')';
                          result+='translate('+d.y+','+0+')';
                          return result;
                        });
        //绘制节点文字
        gNodes.append('circle')
              .attr('fill', d => d.children?'#555':'#999')
              .attr('r', 2.5);
        gNodes.append('text')
              // .attr('transform', d => {
              //   var result = 'rotate('+(d.x >= Math.PI?180:0)+')';
              //   return result;
              // })
              .attr('dy', '0.31em')
              .attr('x', d => d.children?-6:6)
              .attr('text-anchor', d => d.children?'end':'start')
              .text(d => d.data.name)
              .clone(true)
              .lower()
              .attr('stroke', 'white');
      });


</script>
</body>
</html>

```
![image](/assets/img/D3js/cluster_tree_graph.png)
## 打包图
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="./d3/d3.js" charset="utf-8"></script>
    <!--    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>-->
    <script type="text/css">
        .axis path,
        .axis line{
            fill: none;
            stroke: black;
            shape-rendering: crispEdges;
        }
        .axis text{
            font-family: sans-serif;
            font-size: 11px;
        }
        .time{
            font-family: Cursive;
            font-size: 40px;
            stroke: black;
            stroke-width: 2;
        }


    </script>
</head>
<body>
<script>
    var width = 800;
    var height = 800;
    var radius = 400
    var padding = {top:60,bottom:60,left:60,right:60};
    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', 'translate('+radius/2+','+radius/2+')');
    var pack = d3.pack()
                 .size([width/2, height/2])
                 .padding(5);

    var colors = d3.schemeCategory10;
    d3.json('data/city.json')
      .then(function(data){

        var hierarchyData = d3.hierarchy(data)
                              .sum(d => d.value);
                              //.sort((a,b) => b.value - a.value);
        console.log(hierarchyData);

        var clusterData = pack(hierarchyData);
        var nodes = clusterData.descendants();
        var links = clusterData.links();
        console.log(nodes);
        // console.log(links);

        //绘制节点
        svg.selectAll('circle')
           .data(nodes)
           .enter()
           .append('circle')
           .attr('class', d => d.children?'node':'leafNode')
           .attr('cx', d => d.x)
           .attr('cy', d => d.y)
           .attr('r', d => d.r)
           .attr('fill', d => colors[d.height%10]);
        svg.selectAll('text')
           .data(nodes)
           .enter()
           .append('text')
           .attr('class', 'nodeText')
           .style('fill-opacity', d => d.children?0:1)
           .attr('x', d => d.x - 14)
           .attr('y', d => d.y)
           .attr('dy', '.3em')
           .attr('fill', '#fff')
           .text(d => d.data.name);
      });

</script>
</body>
</html>

```
![image](/assets/img/D3js/pack_graph.png)
