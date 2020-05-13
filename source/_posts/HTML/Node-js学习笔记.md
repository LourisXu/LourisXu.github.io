---
title: Node.js学习笔记
tags:
  - js
  - html
translate_title: nodejs-study-notes
date: 2020-04-05 23:06:31
toc: true
---
> # Node.js基础

## 异步
```js
var fs = require('fs');
fs.readFile('data/dpc-covid19-ita-province.csv', function(er, data){
  console.log(data);
});
console.log('aaaa');
```
## HTTP服务器
```js
var http = require('http');
var server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(3000);
console.log('Server running at http://localhost:3000');

var http = require('http');
var server = http.createServer();
server.on('request', function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
});
server.listen(3000);
console.log('Server running at http://localhost:3000');

```
## 数据流
```js
var stream = fs.createReadStream();
stream.on('data', chunk => {
  console.log(chunk);
});
stream.on('end', () => {
  console.log('finished');
});
```
**读取图片流到客户端**
```js
var fs = require('fs');
var http = require('http')
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'image/png'});
  fs.createReadStream('./data/userpic.jpg').pipe(res);
}).listen(3000);
console.log('Server running at http://localhost:3000');
```
> # 聊天室

[Github仓库](https://github.com/LourisXu/ChatRoom)

> # Node编程基础

## Node功能的组织及重用
注意`module.exports`与`exports`的区别
- Node模块允许你从被引入文件中选择要暴露给程序的函数和变量。如果模块返回的函数或变量不止一个，那它可以通过设定exports对象的属性来指明它们。但如果模块只返回一个函数或变量，则可以设定module.exports属性
- Node的模块系统避免了对全局作用域的污染，从而也就避免了命名冲突，并简化了代码的重用。
- 如果你创建了一个既有exports又有module.exports的模块，那它会返回module.exports，而exports会被忽略。
- 最终在程序里导出的是module.exports。exports只是对module.exports的一个全局引用，最初被定义为一个可以添加属性的空对象。所以 exports.myFunc 只 是module.exports.myFunc的简写。
- 第一，如果模块是目录，在模块目录中定义模块的文件必须被命名为index.js，除非你在这个目录下一个叫package.json的文件里特别指明。要指定一个取代index.js的文件，package.json文件里必须有一个用JavaScript对象表示法（JSON）数据定义的对象，其中有一个名为main的键，指明模块目录内主文件的路径。
- 还有一点需要注意的是，Node能把模块作为对象缓存起来。如果程序中的两个文件引入了相同的模块，第一个文件会把模块返回的数据存到程序的内存中，这样第二个文件就不用再去访问和计算模块的源文件了。实际上第二个引入有机会修改缓存的数据。这种“猴子补丁”（monkey patching）让一个模块可以改变另一个模块的行为，开发人员可以不用创建它的新版本。
## 异步编程技术
### HTTP服务器
**template.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>模板</title>
</head>
<body>
  <h1>Latest Posts</h1>
  <ul><li>%</li></ul>
</body>
</html>

```
**blog_recent.js**
```js
var http = require('http');
var fs = require('fs');

// http.createSerever((req, res) => {
//   if(req.url == '/'){
//     fs.readFile('./titles.json', (err, data) => {
//       if(err){
//         console.error(err);
//         res.end('Server Error');
//       }else{
//         var titles = JSON.parse(data.toString());
//         fs.readFile('./template.html', (err, data) => {
//           if(err){
//             console.error(err);
//             res.end('Server Error');
//           }else{
//             var tmpl = data.toString();
//             var html = tmpl.replace('%', titles.join('</li><li>'));
//             res.writeHead(200, {'Content-Type': 'text/html'});
//             res.end(html);
//           }
//         });
//       }
//     });
//   }
// }).listen(8000, '127.0.0.1');

http.createServer((req, res) => {
  getTitles(res);
}).listen(5000,function(){
  console.log('Server listening on port 5000.');
});

function getTitles(res){
  fs.readFile('./titles.json', (err, data) => {
    if(err) return hadError(err, res);
    getTemplate(JSON.parse(data.toString()), res);
  });
}

function getTemplate(titles, res){
  console.log(titles);
  fs.readFile('./template.html', (err, data) => {
    if(err) return hadError(err, res);
    formatHtml(titles, data.toString(), res);
  })
}

function formatHtml(titles, tmpl, res){
  var html = tmpl.replace('%', titles.join('</li><li>'));
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(html);
}

function hadError(err, res){
  console.error(err);
  res.end('Server Error');
}

```
**titles.json**
```JSON
["Kazakhstan is a huge country... what goes on there?",
  "This weather is making me craaazy",
  "My neighbor sort of howls at night"
]

```
### ECHO服务器
**echo_server.js**
`telnet 127.0.0.1 8888`后输入传输的数据
```js
var net = require('net');

var server = net.createServer((socket) => {
  //一次响应
  // socket.once('data', (data) => {
  //   console.log(data);
  //   socket.write(data);
  // });
  //重复响应
  socket.data('data', (data) => {
    console.log(data);
    socket.write(data);
  });
});

server.listen(8888, () => {
  console.log('Server listening on port 8888.');
});

```
### 错误处理
- 在错误处理上有个常规做法，你可以创建发出error类型事件的事件发射器，而不是直接
抛出错误。这样就可以为这一事件类型设置一个或多个监听器，从而定义定制的事件响应逻辑。
- 如果这个error事件类型被发出时没有该事件类型的监听器，事件发射器会输出一个堆栈
跟踪（到错误发生时所执行过的程序指令列表）并停止执行。堆栈跟踪会用emit调用的第二
个参数指明错误类型。这是只有错误类型事件才能享受的特殊待遇，在发出没有监听器的其他
事件类型时，什么也不会发生。
```js
var events = require('events');
var myEmitter = new events.EventEmitter();
myEmitter.on('error', function(errr){
  console.log('ERROR: ' + err.message);
});
myEmitter.emit('error', new Error('Something is wrong.'));
```
- 如果发出的error类型事件没有作为第二个参数的error对象，堆栈跟踪会指出一个“未
捕获、未指明的‘错误’事件”错误，并且程序会停止执行。你可以用一个已经被废除的方法处
理这个错误，用下面的代码定义一个全局处理器实现响应逻辑：
```js
process.on('uncaughtException', function(err){
 console.error(err.stack);
 process.exit(1);
});
```
- 除了这个，还有像domain（http://nodejs.org/api/domain.html）这样正在开发的方案，但它
们是实验性质的。
### 简易聊天室
`telnet 127.0.0.1 3000`进入，windows无法输入字符串，单个字符就发送了，linux不会，所以要输入字符串，按`Ctrl+]`进入命令行，`send xxx`发送命令/消息。
```js
var events = require('events');
var net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};
channel.setMaxListeners(50); //设置最大监听器的数量，防止超过10个监听器出现警告
channel.on('join', function(id, client){
  this.clients[id] = client;
  this.subscriptions[id] = function(senderId, message){
    if(id != senderId){
      this.clients[id].write(message);
    }
  }
  this.on('broadcast', this.subscriptions[id]);
  //让连接上来的用户看到当前有几个已连接的聊天用户，可以用下面这个监听器方法，它能根据给定的事件类型返回一个监听器数组
  var welcome = 'Welcome!\nGuests online: '+ this.listeners('broadcast').length;
  client.write(welcome + '\n');
});

channel.on('leave', function(id){
  channel.removeListener('broadcast', this.subscriptions[id]);
  channel.emit('broadcast', id, id + ' has left the chat.\n');
});

//停止提供聊天服务，但又不想关掉服务器
channel.on('shutdown', function(){
  console.log('remove listeners');
  channel.emit('broadcast', '', 'Chat has shut down.\n');
  channel.removeAllListeners('broadcast');
});

var server = net.createServer(function(client){
  var id = client.remoteAddress + ':' + client.remotePort;
  console.log('id:',id);
  channel.emit('join', id, client);
  // client.on('connect', function(){
  //   console.log('connect');
  //   channel.emit('join', id, client);
  // });
  client.on('data', function(data){
    data = data.toString();
    console.log(data);
    if(data == 'shutdown') channel.emit('shutdown');  //只要有人输入shutdown命令，所有参与聊天的人都会被踢出去。
    channel.emit('broadcast', id, data);
  });
  client.on('close', function(){
    channel.emit('leave', id);
  });
});
server.listen(3000, function(){
  console.log('Server listening on port 3000.');
});

```
### 文件监听器
监听`./wathc`目录下的文件，并将文件名改成小写，放入`./done`。
```js
function Watcher(watchDir, processedDir){
  this.watchDir = watchDir;
  this.processedDir = processedDir;
}

var events = require('events');
var util = require('util');

util.inherits(Watcher, events.EventEmitter); //Watcher继承事件发射器
//等同于Watcher.propotype = new events.EventEmitter();


var fs = require('fs');
var watchDir = './watch';
var processedDir = './done';

Watcher.prototype.watch = function(){
  var watcher = this;  //引用，使得能够在回调函数readdir中使用
  fs.readdir(this.watchDir, function(err, files){
    if(err) throw err;
    for(var index in files){
      watcher.emit('process', files[index]);
    }
  });
}

Watcher.prototype.start = function(){
  var watcher = this;
  fs.watchFile(this.watchDir, function(){
    watcher.watch();
  });
}

var watcher = new Watcher(watchDir, processedDir);

watcher.on('process', function process(file){
  var watchFile = this.watchDir + '/' + file;
  var processedFile = this.processedDir + '/' + file.toLowerCase();
  fs.rename(watchFile, processedFile, function(err){
    if(err) throw err;
  });
})

watcher.start();

```
### 异步开发的难题
代码是一段可能因为执行顺序而导致混乱的异步代码。如果例子中的代码能够同步执行，你可以肯定输出应该是“The color is blue”。可这个例子是异步的，在console.log执行之前color的值还在变化，所以输出是“The color is green”。
```js
function asyncFunction(callback){
  setTimeout(callback, 200);
}

var color = 'blue';

asyncFunction(function(){
  console.log('The color is ' + color);
});

color = 'green';

```
用JavaScript闭包可以“冻结”color的值。在以下代码中，对asyncFunction的调用被封装到了一个以color为参数的匿名函数里。这样你就可以马上执行这个匿名函数，把当前的color的值传给它。而color变成了匿名函数的参数，也就是这个匿名函数内部的本地变量，当匿名函数外面的color值发生变化时，本地版的color不会受影响。
```js
function asyncFunction(callback){
  setTimeout(callback, 200);
}

var color = 'blue';

(function(color){
  asyncFunction(function(){
    console.log('The color is ' + color);
  });
})(color);

color = 'green';

```
## 异步逻辑的顺序化
- 让一组异步任务顺序执行的概念被Node社区称为流程控制。这种控制分为两类：串行和并行。
- 需要一个接着一个做的任务叫做串行任务。创建一个目录并往里放一个文件的任务就是串行的。你不能在创建目录前往里放文件。
- 不需要一个接着一个做的任务叫做并行任务。这些任务彼此之间开始和结束的时间并不重要，但在后续逻辑执行之前它们应该全部做完。下载几个文件然后把它们压缩到一个zip归档文件中就是并行任务。这些文件的下载可以同时进行，但在创建归档文件之前应该全部下载完。
### 串行流程控制
#### 回调实现任务顺序执行
```js
setTimeout(function(){
  console.log('I execute first.');
  setTimeout(function(){
    console.log('I execute next.');
    setTimeout(function(){
      console.log('I execute last.');
    }, 100);
  }, 500);
},1000);
```
```js
$ node serial_process.js
I execute first.
I execute next.
I execute last.
```
#### Nimble流程控制工具实现串行
```js
var flow = require('nimble');
flow.series([
  function(callback){
    setTimeout(function(){
      console.log('I execute first');
      callback();
    }, 1000);
  },
  function(callback){
    setTimeout(function(){
      console.log('I execute next.');
      callback();
    }, 500);
  },
  function(callback){
    setTimeout(function(){
      console.log('I execute last.');
      callback();
    }, 100);
  }
]);
```
```js
$ node serial_process.js
I execute first
I execute next.
I execute last.
```
#### Nimble流程控制工具实现并行
```js
var flow = require('nimble')
var exec = require('child_process').exec;

function downloadNodeVersion(version ,destination, callback){
  var url = 'http://nodejs.org/dist/node-v' + version + '.tar.gz';
  var filePath = destination + '/' + version + '.tgz';
  exec('curl ' + url +' >' + filePath, callback);
}

flow.series([
  function(callback){
    flow.parallel([
      function(callback){
        console.log('Downloading Node v0.4.6...');
        downloadNodeVersion('0.4.6', './tmp', callback);
      },
      function(callback){
        console.log('Downloading Node v0.4.7...');
        downloadNodeVersion('0.4.7', './tmp', callback);
      }
    ], callback);
  },
  function(callback){
    console.log('Creating archive of downloaded files...');
    exec(
      'tar cvf node_distros.tar ./tmp/0.4.6.tgz ./tmp/0.4.7.tgz',
      function(error, stdout, stderr){
        if(error) throw error;
        if(stderr) throw stderr;
        console.log('All done!');
        callback();
      }
    );
  }
])

```
### 实现串行化流程控制
为了演示如何实现串行化流程控制，我们准备做个小程序，让它从一个随机选择的[RSS](https://www.runoob.com/rss/rss-tutorial.html)预订
源中获取一篇文章的标题和URL，并显示出来。
```js
var fs = require('fs');
var request = require('request');
var htmlparser = require('htmlparser');
var configFilename = './rss_feeds.txt';

//任务1：确保包含RSS预订源URL列表的文件存在
function checkForRSSFile(){
  fs.exists(configFilename, function(exists){
    if(!exists){
      return next(new Error('Missing RSS file: ' + configFilename));
    }
    next(null, configFilename);
  })
}

//任务2：读取并解析包含预定URL的文件
function readRSSFile(configFilename){
  fs.readFile(configFilename, function(err, feedList){
    if(err) return next(err);
    //将预订源URL列表转换成字符串，然后分隔成一个数组
    feedList = feedList.toString()
                       .replace(/^\s+|\s+$/g, '')
                       .split("\n");
    console.log(feedList);
    //从预订源URL数组中随机选择一个预订源
    var random = Math.floor(Math.random()*feedList.length);
    next(null, feedList[random]);
  });
}

//任务3：向选定的预订源发送HTTP请求以获取数据
function downloadRSSFeed(feedUrl){
  request({uri: feedUrl}, function(err, res, body){
    if(err) return next(err);
    if(res.statusCode != 200){
      return next(new Error('Abnormal response status code'));
    }
    next(null, body);
  });
}

//任务4：将预订源数据解析到一个条目数组中
function parseRSSFeed(rss){
  var handler = new htmlparser.RssHandler();
  var parser = new htmlparser.Parser(handler);
  parser.parseComplete(rss);
  //console.log(handler.dom.items);
  if(!handler.dom.items.length){
    return next(new Error('No RSS items found'));
  }
  var item = handler.dom.items.shift();
  console.log(item.title);
  console.log(item.link);
}

//将所有要做的任务按执行顺序添加到一个数组中
var tasks = [checkForRSSFile,
             readRSSFile,
             downloadRSSFeed,
             parseRSSFeed];

//负责执行任务的next函数
function next(err, result){
  if(err) throw err;

  var currentTask = tasks.shift(); //从任务数组中取出下一个任务
  if(currentTask) currentTask(result); //执行当前任务
}

next(); //开始任务的串行化执行

```
```js
$ node random_story.js
[ 'http://dave.smallpict.com/rss.xml' ]
undefined
http://scripting.com/2020/04/15.html#a201829
```
### 实现并行化流程控制
```js
var fs = require('fs');
var completedTasks = 0;
var tasks = [];
var wordCounts = {};
var filesDir = './text';

function checkIfComplete(){
  completedTasks++;
  if(completedTasks == tasks.length){
    for(var index in wordCounts){
      console.log(index + ': ' + wordCounts[index]);
    }
  }
}

function countWordsInText(text){
  var words = text
    .toString()
    .toLowerCase()
    .split(/\W+/)
    .sort();
  //console.log('words', words);
  for(var index in words){
    var word = words[index];
    //console.log('word', word);
    if(word){
      wordCounts[word] = (wordCounts[word])?wordCounts[word] + 1 : 1;
    }
  }
}

fs.readdir(filesDir, function(err, files){
  if(err) throw err;
  for(var index in files){
    var task = (function(file){
      return function(){
        fs.readFile(file, function(err, text){
          if(err) throw err;
          countWordsInText(text);
          checkIfComplete();
        });
      }
    })(filesDir + '/' + files[index]);
    tasks.push(task);
  }
  for(var task in tasks){
    tasks[task]();
  }
});

```
> # 构建Node Web程序

## HTTP服务器基础知识
### HTTP请求
```js
var url = 'http://google.com'
var body = '<p>Redirecting to <a href="' + url + '">' + url + '</a></p>';
res.setHeader('Location', url);
res.setHeader('Content-Length', body.length);
res.setHeader('Content-Type', 'text/html');
res.statusCode = 302;
res.end(body);ar http = require('http');
var server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');  //结束响应
}).listen(3000);
console.log('Server running at http://localhost:3000');
```
### 读取请求头及设定响应头
添加和移除响应头的顺序可以随意，但一定要在调用res.write()或 res.end()之前。
```js
res.setHeader(filed, value);
res.getHeader(field);
res.removeHeader(field);
```
```js
var body = 'Hello World';
res.setHeader('Content-Length', body.length);
res.setHeader('Content-Type', 'text/plain');
res.end(body);
```
这要设定res.statusCode属性。在程序响应期间可以随时给这个属性赋值，只要是在第一次调用res.write()或res.end()之前就行。
```js
var url = 'http://google.com'
var body = '<p>Redirecting to <a href="' + url + '">' + url + '</a></p>';
res.setHeader('Location', url);
res.setHeader('Content-Length', body.length);
res.setHeader('Content-Type', 'text/html');
res.statusCode = 302;
res.end(body);
```
## 构建RESTful Web服务
**HTTP谓词**
- POST 向待办事项清单中添加事项
- GET 显示当前事项列表、或者显示某一事项的详情
- DELETE 从待办事项清单中移出事项
- PUT 修改已有事项
```js
var http = require('http');
var server = http.createServer(function(req, res){
  req.setEncoding('utf8');        //对于文本格式的待办事项而言，不需要二进制数据，所以最好将流编码设定为ascii或utf8
  req.on('data', function(chunk){ //只要读入新的数据块，就出发data事件
    console.log('parsed', chunk); //数据块默认是个Buffer读想（字节数组）
  });
  req.on('end', function(){    //数据全部读完之后出发end事件
    console.log('done parsing');
    res.end();
  });
});
```
**POST**
`curl -d 'buy groceries' http://localhost:3000`
`curl -d 'buy node in action' http://localhost:3000`
```
OK
OK
```
**GET**
`curl http://localhost:3000`
```
0) buy groceries
1) buy node in action
```
```
$ node
Welcome to Node.js v12.14.0.
Type ".help" for more information.
SyntaxError: missing ) after argument list
> require('url').parse('http://localhost:3000/1?api-key=foobar')
Url {
  protocol: 'http:',
  slashes: true,
  auth: null,
  host: 'localhost:3000',
  port: '3000',
  hostname: 'localhost',
  hash: null,
  search: '?api-key=foobar',
  query: 'api-key=foobar',
  pathname: '/1',
  path: '/1?api-key=foobar',
  href: 'http://localhost:3000/1?api-key=foobar'
}
```
**DELETE**
`curl -X DELETE http://localhost:3000/0`删除第0个元素
```
0) buy node in action
```
**PUT**
`curl -X PUT -d 'ddd' http://localhost:3000/0`更新第0个元素
```
0) ddd
```
```js
var http = require('http');
var url = require('url');
var items = [];

var server = http.createServer(function(req, res){
  switch(req.method){
    case 'POST':{
      var item = '';
      req.setEncoding('utf8');
      req.on('data', function(chunk){
        item += chunk;
      });
      req.on('end', function(){
        items.push(item);
        res.end('\nOK\n');
      });
      break;
    }
    case 'GET':{
      // items.forEach(function(item, i){
      //   res.write('\n' + i + ')' + item + '\n');
      // });
      // res.end();
      var body = items.map(function(item, i){
        return i + ')' + item;
      }).join('\n');
      body = '\n' + body;
      res.setHeader('Content-Length', Buffer.byteLength(body));
      res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
      res.end(body);
      break;
    }
    case 'DELETE':{
      var path = url.parse(req.url).pathname;
      var i = parseInt(path.slice(1), 10);

      if(isNaN(i)){
        res.statusCode = 400;
        res.end('\nInvalid item id');
      }else if(!items[i]){
        res.statusCode = 404;
        res.end('\nItem not found');
      }else{
        items.splice(i, 1);
        res.end('\nOK\n');
      }
      break;
    }
    case 'PUT':{
      var path = url.parse(req.url).pathname;
      var i = parseInt(path.slice(1), 10);

      if(isNaN(i)){
        res.statusCode = 400;
        res.end('\nInvalid item id');
      }else if(!items[i]){
        res.statusCode = 404;
        res.end('\nItem not found');
      }else{
        var item = '';
        req.setEncoding('utf8');
        req.on('data', function(chunk){
          item += chunk;
        });
        req.on('end', function(){
          items.push(item);
          items[i] = item;
          res.end('\nOK\n');
        });
      }
      break;
    }
  }
});
server.listen(3000);

```
## 提供静态文件服务
- `__dirname` 在Node中是一个神奇的变量，它的值是该文件所在目录的路径。`__dirname`的神奇之处就在于，它在同一个程序中可以有不同的值，如果你有分散在不同目录中的文件的话。在这个例子中，服务器会将这个脚本所在的目录作为静态文件的根目录，但实际上你可以将根目录配置为任意的目录路径。
- 下一步是得到URL的pathname，以确定被请求文件的路径。如果URL的pathname是`/index.html`，并且你的根目录是`/var/www/example.com/public`，用path模块的.join()方法把这些联接起来就能得到绝对路径/`var/www/example.com/public/index.html`。
- 因为传输的文件是静态的，所以我们可以用stat()系统调用获取文件的相关信息，比如修改时间、字节数等。在提供条件式GET支持时，这些信息特别重要，浏览器可以发起请求检查它的缓存是否过期了。
- **fs.stat()实现先发之人的错误处理**：以下代码调用了fs.stat()用于得到文件的相关信息，比如它的大小，或者得到错误码。如果文件不存在，`fs.stat()`会在`err.code`中放入`ENOENT`作为响应，然后你可以返回错误码404，向客户端表明文件未找到。如果fs.stat()返回了其他错误码，你可以返回通用的错误码500。
`curl http://localhost:3000/index.html`
```js
var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');

var root = __dirname;    //本代码文件所在路径

var server = http.createServer(function(req, res){
  var url = parse(req.url);
  var path = join(root, url.pathname);  //联结完整静态文件路径

  fs.stat(path, function(err, stat){
    if(err){
      if('ENOENT' == err.code){
        res.statusCode = 404;
        res.end('Not Found');
      }else{
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }else{
      res.setHeader('Content-Length', stat.size);
      var stream = fs.createReadStream(path);
      // stream.on('data', function(chunk){
      //   res.write(chunk); //将文件数据写到响应中
      // });
      // stream.on('end', function(){
      //   res.end();
      // });
      stream.pipe(res);  //res.end()会在stream.pipe()内部调用
      stream.on('error', function(err){  //访问不存在或不允许访问的文件或其他与文件I/O有关的错误
        res.statusCode = 500;
        res.end('Internal Server Error');
      });
    }
  });

});

server.listen(3000);

```
## 从表单中接受用户输入
表单提交请求带的Content-Type值通常有两种：
- application/x-www-form-urlencoded：这是HTML表单的默认值；
- multipart/form-data：在表单中含有文件或非ASCII或二进制数据时使用.
### 处理提交的表单域
**QueryString**
```
$ node
Welcome to Node.js v12.14.0.
Type ".help" for more information.
> var qs = require('querystring');
> qs.parse('item=xxx');
[Object: null prototype] { item: 'xxx' }
>
```
```js
var http = require('http');
var items = [];
var qs = require('querystring');
var server = http.createServer(function(req, res){
  if('/' == req.url){
    switch(req.method){
      case 'GET':
        show(res);
        break;
      case 'POST':
        add(req, res);
        break;
      default:
        badRequest(res);
    }
  }else{
      notFound(res);
  }
});
server.listen(3000);
console.log('Server listening on port 3000.');

function show(res){
  var html = '<html><head><title>Todo List</title></head><body>'
    + '<h1>Todo List</h1>'
    + '<ul>'
    + items.map(function(item){
        return '<li>' + item + '</li>';
      }).join('')
    + '</ul>'
    + '<form method="post" action="/"'
    + '<p><input type="text" name="item" /></p>'
    + '<p><input type="submit" value="Add Item" /></p>'
    + '</form></body></html>';
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end(html);
}

function notFound(res){
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Not Found');
}

function badRequest(res){
  res.statusCode = 400;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Bad Request');
}

function add(req, res){
  var body = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk){
    body += chunk;
  });
  req.on('end', function(){
    var obj = qs.parse(body);
    items.push(obj.item);
    show(res);
  });
}

```
### 用formidable处理上传的文件
```js
var http = require('http');
var formidable = require('formidable');
var server = http.createServer(function(req, res){
  switch(req.method){
    case 'GET':
      show(req, res);
      break;
    case 'POST':
      upload(req, res);
      break;
  }
});
server.listen(3000);
function show(req, res){
  var html = ''
    + '<form method="post" action="/" enctype="multipart/form-data">'
    + '<p><input type="text" name="name" /></p>'
    + '<p><input type="file" name="file" /></p>'
    + '<p><input type="submit" value="Upload" /></p>'
    + '</form>';
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end(html);
}

function upload(req, res){
  if(!isFormData(req)){
    res.statusCode = 400;
    res.end('Bad Request: expecting multipart/form-data');
    return;
  }
  var form = new formidable.IncomingForm(); //默认上传文件流到/tmp目录下
  form.uploadDir = './dir';  //设置上传目录
  form.keepExtensions = true; //在文件上传目录中写入文件，并保存原始文件的拓展名
  // form.on('field', function(field, value){ //formidable收完输入域后悔发出field事件
  //   console.log(field);
  //   console.log(value);
  // });
  // form.on('file', function(name, file){ //formidable在收到文件并处理好后悔发出file事件
  //   console.log(name);
  //   console.log(file);
  // });
  // form.on('end', function(){
  //   res.end('upload complete!');
  // });
  // form.parse(req);
  form.on('progress', function(bytesReceived, bytesExpected){ //计算上传进度。
    var percent = Math.floor(bytesReceived / bytesExpected * 100);
    console.log('Recevied ' + percent + '%');
  });
  form.parse(req, function(err, fields, files){
    console.log(fields);
    console.log(files);
    res.end('upload complete!');
  });

}

function isFormData(req){
  var type = req.headers['content-type'] || '';
  return 0 == type.indexOf('multipart/form-data');
}

```
## 用HTTPS加强程序的安全性
- 对于电子商务网站，以及那些会涉及到敏感数据的网站来说，一般都要求能够保证跟服务器往来的数据是私密的。在标准的HTTP会话中，客户端跟服务器端用未经加密的文本交换信息。这使得HTTP通信很容易被窃听。
- 安全的超文本传输协议（HTTPS）提供了一种保证Web会话私密性的方法。HTTPS将HTTP和TLS/SSL传输层结合到一起。用HTTPS发送的数据是经过加密的，因此更难窃听。本节会介绍一些用HTTPS加强程序安全性的基础知识。
- 如果你想在你的Node程序里使用HTTPS，第一件事就是取得一个私钥和一份证书。私钥本质上是个“秘钥”，可以用它来解密客户端发给服务器的数据。私钥保存在服务器上的一个文件里，放在一个不可信用户无法轻易访问到的地方。本节会教你如何生成一个自签发的证书。这种SSL证书不能用在正式网站上，因为当用户访问带有不可信证书的页面时，浏览器会显示警告信息，但对于开发和测试经过加密的通信而言，它很实用。
密匙：`openssl genrsa 1024 > key.pem`
证书：`openssl req -x509 -new -key.pem > key-cert.pem`
**秘钥已经生成了，把它们放到一个安全的地方。在下面的代码清单中，我们引用的秘钥跟服务器脚本放在同一个目录下，但秘钥通常都是放在别处，一般是 ~/.ssh。**
```js
var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./key-cert.pem')
};

https.createServer(options, function(req, res){
  res.writeHead(200);
  res.end('Hello World\n');
}).listen(3000);

```
> # 存储Node程序中的数据

- 几乎所有的程序，不管是不是基于Web的，都需要某种类型的数据存储机制，用Node构的程序也不例外。选择合适的存储机制取决于以下五个因素：
   存储什么数据；
   为了保证性能，要有多快的数据读取和写入速度；
   有多少数据；
   要怎么查询数据；
   数据要保存多久，对可靠性有什么要求。
- 存储数据的方法很多，从放在服务器内存中到连接一个完备的数据库管理系统（DBMS）不
一而足，但所有的方法都有利有弊。
- 有些机制支持结构复杂的数据的长期持久化，并且有强大的搜索功能，但要承担昂贵的性能成本，所以有时并不是最好的选择。同样，把数据放在服务器内存中能得到最好的性能，但可靠性不强，如果程序重启，或服务器断电，数据就会丢失。
- 所以怎么为程序选择恰当的存储机制？在Node程序开发的世界中，经常会为不同的应用场景使用不同的存储机制。本章会讨论三种不同的选择：
   存储数据而无需安装和配置DBMS；
   用关系型数据库存储数据，具体说就是MySQL和PostgreSQL；
   用NoSQL数据库存储数据，具体说就是Redis、MongoDB和Mongoose。
## 无服务器的数据存储
### 内存存储
- 内存存储的理想用途是存放少量经常使用的数据。用来跟踪记录最近一次重启服务器后页面
访问次数的计数器就是这样的应用场景。比如下面这段代码，它在8888端口启动了一个服务器，并对所有请求进行计数：
```js
var http = require('http');
var counter = 0;
var server = http.createServer(function(req, res){
    counter++;
    res.write('I have been accessed ' + counter + ' times.');
    res.end();
}).listen(3000);

```
### 基于文件的存储
- 基于文件的存储，用文件系统存放数据。开发人员经常用这种存储方式保存程序的配置信息，但你也可以用它做数据的持久化保存，这些数据在程序和服务器重启后依然有效。
`node cli_tasks.js list|add [taskDescription]`
```js
var fs = require('fs');
var path = require('path');
var args = process.argv.splice(2); //去掉'node cli_tasks.js'，只留下参数
var command = args.shift();        //取出第一个参数(命令)
var taskDescription = args.join(' '); //合并剩余的参数
var file = path.join(process.cwd(), '/.tasks'); //根据当前的工作目录解析数据库的相对路径

switch(command){
  case 'list':
    listTasks(file);
    break;
  case 'add':
    addTask(file, taskDescription);
    break;
  default:
    console.log('Usage: node cli_tasks.js list|add [taskDescription]'); //其他任何参数都会显示帮助
}

function loadOrInitializeTaskArray(file, cb){
  fs.exists(file, function(exists){ //检查.tasks文件是否已经存在
    var tasks = [];
    if(exists){
      fs.readFile(file, 'utf8', function(err, data){ //从.tasks文件中读取待办事项数据
        if(err) throw err;
        var data = data.toString();
        var tasks = JSON.parse(data || '[]'); //把用JSON编码的待办事项数据解析到任务数组中。
        cb(tasks);
      })
    }else{
      cb([]); //如果.tasks文件不存在，则创建空的任务数组
    }
  });
}

function listTasks(file){
  loadOrInitializeTaskArray(file, function(tasks){
    for(var i in tasks){
      console.log(tasks[i]);
    }
  });
}

function storeTasks(file, tasks){
  fs.writeFile(file, JSON.stringify(tasks), 'utf8', function(err){
    if(err) throw err;
    console.log('Saved.');
  });
}

function addTask(file, taskDescription){
  loadOrInitializeTaskArray(file, function(tasks){
    tasks.push(taskDescription);
    storeTasks(file, tasks);
  });
}

```
## 关系型数据库管理系统
### MySQL
`npm install mysql`
**timetrack_server.js**
```js
var http = require('http');
var work = require('./lib/timetrack');
var mysql = require('mysql');
var qs = require('querystring');

var db = mysql.createConnection({  //链接MySQL
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'timetrack'
});

var server = http.createServer(function(req, res){
  switch (req.method) {
    case 'POST':
        switch (req.url) {
          case '/':
            work.add(db, req, res);
            break;
          case '/archive':
            work.archive(db, req, res);
            break;
          case '/delete':
          work.delete(db, req, res);
        }
      break;
    case 'GET':
      switch (req.url) {
        case '/':
          work.show(db, res);
          break;
        case '/archived':
          work.showArchived(db, res);
          break;
      }
      break;
  }
})

db.query(
  "CREATE TABLE IF NOT EXISTS work ("   //建表SQL
  +  "id INT(10) NOT NULL AUTO_INCREMENT, "
  +  "hours DECIMAL(5,2) DEFAULT 0, "
  +  "date DATE, "
  +  "archived INT(1) DEFAULT 0, "
  +  "description LONGTEXT,"
  +  "PRIMARY KEY(id))",
  function(err){
    if(err) throw err;
    console.log('Server started...');
    server.listen(3000, '127.0.0.1');
  }
);

exports.sendHtml = function(res, html){   //发送HTML相应
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end(html);
};

exports.parseReceivedData = function(req, cb){  //解析HTTP POST数据
  var body = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk){body += chunk});
  req.on('end', function(){
    var data = qs.parse(body);
    cb(data);
  });
};

exports.actionForm = function(id, path, label){  //渲染简单的表单
  var html = '<form method="POST" action="' + path + '">' +
    '<input type="hidden" name="id" value="' + id +'">' +
    '<input type="submit" value="' + label +'"/>' +
    '</form>';
  return html;
};
```
**./lib/timetrack.js**
```js
exports.add = function(db, req, res){
  exports.parseReceivedData(req, function(work){  //解析HTTP POST数据
    db.query(
      "INSERT INTO work (hours, date, description) " +  //添加工作记录的SQL
      " VALUES (?, ?, ?)",
      [work.hours, work.date, work.description],  //工作记录数据
      function(err){
        if(err) throw err;
        exports.show(db, res);   //给用户显示工作记录表单
      }
    );
  });
};

exports.delete = function(db, req, res){
  exports.parseReceivedData(req, function(work){  //解析HTTP POST数据
    db.query(
        "DELETE FROM work WHERE id=?",  //删除工作记录的SQL
        [work.id],      //工作记录ID
        function(err){
          if(err) throw err;
          exports.show(db, res);  //给用户显示工作记录清单
        }
    );
  });
};

exports.archive = function(db, req, res){
  exports.parseReceivedData(req, function(work){
    db.query(
      "UPDATE work SET archived=1 WHERE id=?",
      [work.id],
      function(err){
        if(err) throw err;
        exports.show(db, res);
      }
    );
  });
};

exports.show = function(db, res, showArchived){
  var query = "SELECT * FROM work " +
    "WHERE archived=? " +
    "ORDER BY date DESC";
  var archiveValue = (showArchived) ? 1 : 0;
  db.query(
    query,
    [archiveValue],
    function(err, rows){
      if(err) throw err;
      html = (showArchived)
        ? ''
        : '<a href="/archived">Archived Work</a><br/>';
      html += exports.workHitlistHtml(rows);
      html += exports.workFormHtml();
      exports.sendHtml(res, html);
    }
  );
};

exports.showArchived = function(db, res){
  exports.show(db, res, true);
};

exports.workHitlistHtml = function(rows){
  var html = '<table>';
  for(var i in rows){
    html += '<tr>';
    html += '<td>' + rows[i].date + '</td>';
    html += '<td>' + rows[i].hours + '</td>';
    html += '<td>' + rows[i].description +'</td>';
    if(!rows[i].archived){
      html += '<td>' + exports.workArchiveForm(rows[i].id) + '</td>';
    }
    html += '<td>' + exports.workDeleteForm(rows[i].id) + '</td>';
    html += '</tr>';
  }
  html += '</table>';
  return html;
};

exports.workFormHtml = function(){
  var html = '<form method="POST" action="/">' +
    '<p>Date (YYYY-MM-DD):</br><input name="date" type="text"></p>' +
    '<p>Hours worked:</br><input name="hours" type="text"></p>' +
    '<p>Description</br>' +
    '<textarea name="description"></textarea></p>' +
    '<input type="submit" value="Add" />'+
    '</form>';
  return html;
};

exports.workArchiveForm = function(id){
  return exports.actionForm(id, '/archive', 'Archive');
};

exports.workDeleteForm = function(id){
  return exports.actionForm(id, '/delete', 'Delete');
};

```
### PostgreSQL
`npm install pg`
```js
var pg = require('pg');
var conString = "tcp://myuser:mypassword@localhost:5432/mydatabase";
var client = new pg.Client(conString);
client.connect();

//插入记录
client.query(
  'INSERT INTO users ' +
  "(name) VALUES ('Mike')"
);
client.query(
  "INSERT INTO users " +
  "(name, age) VALUES ($1, $2)",
  ['Mike', 39]
);
client.query(
  "INSERT INTO users " +
  "(name, age) VALUES ($1, $2)",
  "RETURNING id",  //插入一条记录后得到它的主键值, RETURNING 后加上列名返回对应列的值
  ['Mike', 39],
  function(err, result){
    if(err) throw err;
    console.log('Insert ID is ' + result.rows[0].id);
  }
);

//创建返回结果的查询
var query = client.query(
  "SELECT * FROM users WHERE age > $1",
  [40]
);
query.on('row', function(row){
  console.log(row.name);
});
query.end('end'm function(){
  client.end();  //关闭数据库或
});
```
## NoSQL数据库
### Redis
`npm install redis`
```js
//连接Redis服务器
var redis = require('redis');
var client = redis.createClient(8000, 'localhost');

client.on('error', function(err){
  console.log('Error' + err);
});
//操作Redis中的数据，存储和获取键/值对
client.set('color', 'red', redis.print);  //print函数输出操作的结果，或在出错时输出错误
client.get('color', function(err, value){
  if(err) throw err;
  console.log('Got: ' + value);
});
//用哈希表存储和获取数据
client.hmset('camping', { //设定哈希表元素
  'shelter': '2-person tent',
  'cooking': 'campstove'
}, redis.print);
client.hget('camping', 'cooking', function(err, value){
  if(err) throw err;
  console.log('Will be cooking with: ' + value);
});
client.hkeys('camping', function(err, keys){
  if(err) throw err;
  keys.forEach(function(key, i){
    console.log(' ' + key);
  });
});
//用链表存储和获取数据
client.lpush('tasks', 'Paint the bikeshed red.', redis.print);
client.lpush('tasks', 'Paint the bikeshed green.', redis.print);
client.lrange('tasks', 0, -1, function(err, items){  //获取参数start和end范围内的链表元素，end=-1表示到链表中最后一个元素
  if(err) throw err;
  items.forEach(function(item, i){
    console.log('  ' + item);
  });
});
//用集合存储和获取数据,集合无序性、唯一性
client.sadd('ip_addresses', '204.10.37.96', redis.print);
client.sadd('ip_addresses', '204.10.37.96', redis.print);
client.sadd('ip_addresses', '72.32.231.8', redis.print);
client.smembers('ip_addresses', function(err, members){
  if(err) throw err;
  console.log(members);
});
```
**用信道传递数据**
```js
var net = require('net');
var redis = require('redis');

var server = net.createServer(function(socket){ //为每个连接到聊天服务器上的用户定义设置逻辑
  var subscriber;
  var publisher;

  socket.on('connect', function(){
    subscriber = redis.createClient();   //为用户创建预定客户端
    subscriber.subscribe('main_chat_room'); //预定信道

    subscriber.on('message', function(channel, message){  //信道收到消息后把它发给用户
      socket.write('Channel' + channel + ': ' + message);
    });
    publisher = redis.createClient();  //为用户创建发布客户端
  });

  socket.on('data', function(data){
    publisher.publish('main_chat_room', data); //用户输入消息后发布它
  });

  socket.on('end', function(){
    subscriber.unsubscribe('main_chat_room'); //如果用户断开连接，终止客户端连接
    subscriber.end();
    publisher.end();
  });
});

```
**NODE_REDIS性能最大化**
在你准备把使用了node_redis API的Node.js程序部署到生产环境中时，可能要考虑下是否使用Pieter Noordhuis的hiredis模块（https://github.com/pietern/hiredis-node）。这个模块会显著提升Redis的性能，因为它充分利用了官方的hiredis C语言库。如果你装了hiredis，node_redis API会自动使用hiredis替代它的JavaScript实现。
`npm install hiredis`
注意，因为hiredis库是用C代码编译而成的，而Node的内部API偶尔会修改，所以在升级了Node.js后，你可能要重新编译hiredis。用下面的npm命令可以重建hiredis：
`npm rebuild hiredis`
