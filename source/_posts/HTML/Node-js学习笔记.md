---
title: Node.js学习笔记
tags:
  - js
  - html
translate_title: nodejs-study-notes
date: 2020-04-05 23:06:31
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

## HTTP服务器
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
## ECHO服务器
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
## 错误处理
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
## 简易聊天室
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
