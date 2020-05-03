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
    }
  });

});

server.listen(3000);

```
