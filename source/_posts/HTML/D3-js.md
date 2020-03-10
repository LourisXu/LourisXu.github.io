---
title: D3.js
translate_title: d3js
date: 2020-03-03 00:08:17
toc: true
tags:
  - HTML
---
研究生可视化课程期末项目，只得学习一下[D3.js](https://d3js.org/)了，玩一下，参考[精通D3.js交互式数据可视化高级编程](/assets/files/D3_js_programming.pdf)。

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
linear(x)          //输入一个定义域内的值x，返回值域内对应的值
linear.invert(y)   //输入一个在值域内的值，返回定义域内对应的值
linear.domain([numbers]) //设定或获取定义域
linear.range([values]) //设定或获取值域。
linear.rangeRound([values])  //代替range()使用的话，比例尺的输出值会进行四舍五入的运算，结果为整数
linear.clamp([boolean])  //默认被设置为false，当该比例尺接收一个超出定义域范围内的值时，依然能够按照同样的计算方法计算得到一个值，这个值可能是超出值域范围的。如果设置为true，则任何超出值域范围的值，都会被收缩到值域范围内。
```
