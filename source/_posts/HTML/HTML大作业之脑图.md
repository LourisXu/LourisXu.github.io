---
title: HTML大作业之脑图
tags:
  - Essay
  - HTML
  - Javascript
  - CSS
reward: true
toc: true
translate_title: the-brain-map-of-html-big-homework
date: 2017-09-19 12:51:22
---
## 概况
```
脑图.html
  __ CSS.css
  __ 事件处理程序.js
  __ 功能.js
```
## 脑图.html
```HTML
<!doctype html>
<html>
<head>
<meta charset="gb2312">
<title>脑图</title>
<link type="text/css" rel="stylesheet" href="CSS.css">
</head>
<body>
<div class="Main-menu">
	<table><tr><td>
    		<input class="input" type="button" value="创建同级元素"></td><td><input class="input" type="button" value="删除元素"></td><td>
      	    </td>
      	  </tr>
    	  <tr><td><input class="input" type="button" value="创建次级元素"></td><td><input class="input" type="button" value="编辑元素"></td>
          <td><input class="input" type="file" accept="image/*"></td></tr>
    </table>
</div>
<div class="canvas">
	<div class="topic">中心主题</div>
</div>
<script type="text/javascript" src="事件处理程序.js"></script>
<script type="text/javascript" src="功能JS.js"></script>
</body>
</html>
```
## CSS.css
```CSS
@charset "gb2312";
/* CSS Document */
img{
		margin:0px;
		padding:0px;
		position:relative;
		left:0px;
		top:0px;
	}
	.Main-menu{
		width:1500px;
		height:70px;
		border-radius:5px;
		background-color:#09C;
		-moz-user-select: none;
		-khtml-user-select: none;
		-user-select:none;
		z-index:2;
	}
	.input{
		white-space:nowrap;
		overflow:hidden;
		text-overflow:ellipsis;
		color:#CCC;
		border-style:none;
		border-radius:5px;
		cursor:pointer;
		font-size:16px;
	}

	.canvas{

		width:1500px;
		height:640px;
		background-color:#CCC;
		z-index:1;
	}
	div{
		width:100px;
		height:40px;
		background-color:#06F;
		text-align:center;
		border-radius:5px;
		-moz-user-select: none;
		-khtml-user-select: none;
		-user-select: none;
		z-index:2;
	}
	.topic{
		background-size:100% 100%;
		white-space:nowrap;
		overflow:hidden;
		text-overflow:ellipsis;
		width:100px;
		height:40px;
		background-color:#06F;
		line-height:40px;
		position:absolute;
		border-color:#09F;
		border-style:solid;
		border-width:0px;
		left:700px;
		top:200px;
		cursor:pointer;
		-moz-user-select: none;
		-khtml-user-select: none;
		-user-select:none;
		z-index:2;
	}
	.childrenNode{
		background-size:100% 100%;
		white-space:nowrap;
		overflow:hidden;
		text-overflow:ellipsis;
		width:80px;
		height:30px;
		line-height:30px;
		background-color:#FFF;
		position:absolute;
		cursor:pointer;
		border-color:#09F;
		border-style:solid;
		border-width:0px;
		-moz-user-select: none;
		-khtml-user-select: none;
		-user-select:none;
		z-index:2;
	}
	table{
		background-color:#09C;
		position:relative;
	}
	td{
		padding:3px;
		margin:1px;
	}
	.lines{
		color:#00F;
		border:solid;
		border-width:1px;
		position:absolute;
		z-index:1;
	}
	.newinput{
		position:absolute;
		border-style:solid;
		border:0px;
		background-color:#0CF;
		-moz-user-select:text;
		-khtml-user-select:text;
		-user-select:text;
		z-index:3;
	}
```
## 事件处理程序.js
```JS
// JavaScript Document

	//跨浏览器事件处理程序
	var event_select={
		//添加句柄
		addHandler:function(element,type,handler){
			if(element.addEventListener){
				element.addEventListener(type,handler,false); //DOM2级事件处理程序
				}
			else if(element.attachEvent){
				element.attachEvent("on"+type,handler);
				}
			else{
				element["on"+type]=handler;	       //DOM1级事件处理程序
				}
			},

		//删除句柄
		removeHandler:function(element,type,handler){
			if(element.removeEventListener){
				element.removeEventListener(type,handler,false);   //DOM2级事件处理程序
				}
			else if(element.detachEvent){
				element.detachEvent("on"+type,handler);
				}
			else{
				element["on"+type]=null;	     //DOM1级事件处理程序
				}
			},
			getEvent:function(event){
				return event?event:window.event;	//获取事件
			},
			getEventType:function(event){
				return event.type;
			},
			getElement:function(event){
				return event.target||event.srcElement;
			},
			//阻止事件默认行为
			precentDefault:function(event){
				if(event.preventDefault){
					event.preventDefault();
				}else{
					event.returnValue=false; //IE false阻止时间的默认行为,true不阻止
				}
			},
			//阻止事件冒泡
			stopPropagation:function(event){
				if(event.stopPropagation){
					event.stopPropagation();
				}else{
					event.cancelBubble=true; //IEtrue阻止冒泡,false不阻止冒泡
				}
			}
		}

		//event_select.addHandler(events,'click',function(){alert(events.type);})
```
## 功能.js
```JS
function $(id){return document.getElementsByTagName(id);}
function clicks(event){
  event=event||window.event;
  //阻止冒泡
  event_select.stopPropagation(event);
   //传入被点击的单元
  var This = this;
  var Allnodes=getChildrenNodes($('div')[2]);

    for(var i=0;i<Allnodes.length;i++){
      Allnodes[i].style.borderWidth=0+'px';
    }
    This.style.borderWidth=2+'px';


    for(var i=0;i<5;i++){
      $('input')[i].style.color='#000';
    }

    if(This==$('div')[2]&&Allnodes.length==1)
      $('input')[1].style.color='#CCC';

    //创建同级元素按钮
    $('input')[0].onclick=function (event){
      //阻止事件冒泡
      event_select.stopPropagation(event);
      creatNode(event,This);
    }

    //删除元素按钮
    $('input')[1].onclick=function(event){
      //阻止事件冒泡
      event_select.stopPropagation(event);
      deleteNodes(This);
      //防止多次删除同一个元素，导致已删除元素的undefined控制台报警
      $('input')[1].onclick=function(event){
        //阻止冒泡
        event_select.stopPropagation(event);
      }
      $('input')[1].style.color='#CCC';
    }
    //创建次级元素按钮
    $('input')[2].onclick=function (event){
      //阻止事件冒泡
      event_select.stopPropagation(event);
      console.log(This);
      console.log(This.nextElement);
      //console.log(This.nextElement.length);
      if(This.nextElement!=undefined){
        This=This.nextElement[This.nextElement.length-1];
      }
      creatNode(event,This);
      console.log(This.nextElement);
    }
    //编辑按钮
    $('input')[3].onclick=function (event){
      var event=event?event:window.event;
      //阻止事件冒泡
      event_select.stopPropagation(event);
      //调用编辑函数
      edit(event);		
    }
    //插入图片背景
    $('input')[4].onchange=function(){
      var pic=$('input')[4].value;
      var type=pic.substring(pic.lastIndexOf('.')+1,pic.length).toLowerCase();
      if(type!='jpg'&&type!='bmp'&&type!='gif'&&type!='png'){
        alert('请上传正确的图片格式');
      }else{
        var imgPath;//图片路径
        //获取文件地址
        imgPath=window.URL.createObjectURL(this.files[0]);
        var Allnodes=getChildrenNodes($('div')[2]);
        Allnodes[Allnodes.length-1].style.backgroundImage="url("+imgPath+")";
      }

    }

    document.onclick=function(event){
      var event=event?event:window.event;
      //阻止事件冒泡
      event_select.stopPropagation(event);
      This.style.borderWidth=0+'px';
      for(var i=0;i<5;i++){
        $('input')[i].style.color='#CCC';
        if(i!=4)
          $('input')[i].onclick=null;
        /*else
          $('input')[i].onchange=null;*/
    }
}
}

//元素内容编辑
function edit(event){

  var event=event||window.event;
  //阻止事件冒泡
  event_select.stopPropagation(event);
  //console.log(element);
  var Allnodes=getChildrenNodes($('div')[2]);
  var This=Allnodes[Allnodes.length-1];
  //var This=this;
  //var This=$('div')[2];
  var newinput=document.createElement('input');
    newinput.type='text';
    newinput.className='newinput';
    newinput.style.left=This.offsetLeft+3+'px';
    newinput.style.top=This.offsetTop+This.offsetHeight/4+'px';
    newinput.style.width=This.offsetWidth*0.9+'px';
    newinput.style.height=This.offsetHeight/2+'px';
    newinput.value=This.innerHTML;
    $('div')[1].appendChild(newinput);
    newinput.focus();
    newinput.onkeydown=function(event){
      var event=event||window.event;
      event_select.stopPropagation(event);
      //当键位为Enter，赋值并删除编辑节点
      if(event.keyCode==13){
        This.innerHTML=newinput.value;
        $('div')[1].removeChild(newinput);
      }
    }
    //当未输入时且失则删除编辑节点
    newinput.onblur=function(event){
      This.innerHTML=newinput.value;
      var event=event?event:window.event;
      event_select.stopPropagation(event);
      $('div')[1].removeChild(newinput);
      //console.log($('div')[2].removeChild(newinput));
    }

}
function creatNode(event,Lastelements){
  //阻止事件冒泡
  event_select.stopPropagation(event);

  var Nodes=document.createElement('div');
    Nodes.preElement=Lastelements;//获取上个元素节点
    Nodes.nextElement=new Array(); //创建新建元素的子级元素数组,但当Nodes.preElement为$('div')[2]则其Nodes.preElement.nextElement数组不存在！！

    if(Nodes.preElement.nextElement==undefined)
      Nodes.preElement.nextElement=new Array(); //当上级元素为中心主元素时创建父级元素的子级元素数组*/

    Nodes.className='childrenNode';
    var s=20,w=80;

  //父级元素的子级同类元素新建时以父级元素为准居中分布，且保证前一个元素被拖动后在后一个元素新建时位置相对移动
  var x=Nodes.preElement.offsetLeft+Nodes.preElement.offsetWidth/2;
    Nodes.style.top=$('div')[0].offsetHeight+Nodes.preElement.offsetTop+'px';

  if(Nodes.preElement.nextElement.length==0){
    Nodes.style.left=x-(Nodes.preElement.nextElement.length+1)/2*w-Nodes.preElement.nextElement.length/2*s+'px';
  }else{
    for(var i=0;i<=Nodes.preElement.nextElement.length;i++){
      if(i==Nodes.preElement.nextElement.length){
         x=Nodes.preElement.offsetLeft+Nodes.preElement.offsetWidth/2;
         Nodes.style.left=x-(Nodes.preElement.nextElement.length+1-2*i)/2*w-(Nodes.preElement.nextElement.length-2*i)/2*s+'px';
      }else{
        //alert(Nodes.offsetLeft);
        //保证元素被拖动后再次新建同级元素时之前元素平移
        x=Nodes.preElement.nextElement[i].offsetLeft;
        //alert(Nodes.preElement.nextElement[0].offsetLeft);
        Nodes.preElement.nextElement[i].style.left=x-1/2*w-1/2*s+'px';

      }
    }
  }
  //新建元素时，之前同级元素相对左移（w+s）/2个单位，故之前元素的所有子类也必须全部左移相应单位长度
  for(var i=0;i<Nodes.preElement.nextElement.length;i++){
    //分别获取每个同级元素的所有子类元素（含自身）
    var AllParChinodes=getChildrenNodes(Nodes.preElement.nextElement[i]);
    for(var k=0;k<AllParChinodes.length;k++){
      //新建元素时之前同级元素移动
      if(k!=0)
      AllParChinodes[k].style.left=AllParChinodes[k].offsetLeft-(w+s)/2+'px';
      //新建元素时之前同级元素移动的同时，相应的牵引线的设置改变
      LineSet(AllParChinodes[k]);
    }

  }
    Nodes.preElement.nextElement.push(Nodes); //将上一个元素的下一个子集元素设置为本身
    Nodes.innerHTML='分支主题';
    $('div')[1].appendChild(Nodes);

    //区域检测,创建新元素发现获取子集所有元素的函数返回的长度不正确，表示新增的元素未被检测
    Region_detection(Nodes.preElement);
    //创建每个单元对应的牵引线
        var line=document.createElement('hr');
        line.className='lines';
        Nodes.preline=line;
        Nodes.nextline=new Array(); //创建子级牵引线数组
        Nodes.nextline.push(line);
        $('div')[1].appendChild(line);
        LineSet(Nodes);
    Nodes.onmousedown=move_stop;
    Nodes.onclick=clicks;
    Nodes.ondblclick=edit;
    //点中的边框效果转移至新创建的元素
    var Allnodes=getChildrenNodes($('div')[2]);
      for(var i=0;i<Allnodes.length;i++){
        Allnodes[i].style.borderWidth=0+'px';
      }
      Nodes.style.borderWidth=2+'px';
}

//获取该节点的所有子代元素（包含该节点元素）
function getChildrenNodes(parentElements){
  var AllChildrenNodes=new Array(), //包含该节点的所有子节点
    ParentNodes=new Array(), //存储下一代的上一代父级元素个数（例：统计当前一级元素的子代二级元素的子代三级元素的父级元素（二级元素）的个数）

    AllNodes=document.getElementsByClassName('childrenNode');//存储所有节点

    ParentNodes.push(parentElements);

    ChildrenNodes=new Array();//临时存储子代节点元素
    AllChildrenNodes.push(parentElements);
  do{
    ChildrenNodes=new Array();//临时存储子代节点元素
    //遍历所有子代节点元素
    for(var i=0;i<AllNodes.length;i++){
      //访问所有父级节点的子代元素
      for(var k=0;k<ParentNodes.length;k++){
        if(AllNodes[i].preElement==ParentNodes[k]){
          AllChildrenNodes.push(AllNodes[i]);
          //同级子代节点临时存储
          ChildrenNodes.push(AllNodes[i]);
          break;
        }
      }
    }
    ParentNodes=ChildrenNodes;
  }while(ChildrenNodes.length!=0)
  return AllChildrenNodes;
}
//区域范围检测
function Region_detection(element){

  var AllChildrennodes=getChildrenNodes(element);
  //alert(AllChildrennodes.length);

  var winWidth=$("div")[1].offsetWidth,

    winHeight=$("div")[1].offsetHeight;

  //设置元素的最大移动宽度和最大移动高度，防止块状元素超出窗口范围
  for(var i=0;i<AllChildrennodes.length;i++){
    var	maxWidth=winWidth-AllChildrennodes[i].offsetWidth,

      maxHeight=winHeight+$('div')[0].offsetHeight-AllChildrennodes[i].offsetHeight;

    if(AllChildrennodes[i].offsetLeft<=10){
      AllChildrennodes[i].style.left='10px';

    }else if(AllChildrennodes[i].offsetLeft>=maxWidth+5){
      AllChildrennodes[i].style.left=maxWidth+5+'px';
    }
    if(AllChildrennodes[i].offsetTop<=$("div")[0].offsetHeight+10){
      AllChildrennodes[i].style.top=$("div")[0].offsetHeight+10+'px';
    }else if(AllChildrennodes[i].offsetTop>=maxHeight+3){
      AllChildrennodes[i].style.top=maxHeight+3+'px';
    }
  }
}
$('div')[2].onmousedown=move_stop;
$('div')[2].onclick=clicks;
$('div')[2].ondblclick=edit;

//移动属性函数
function move_stop(event,element){
      var element=element?element:this;
    event=event||window.event;
    //阻止冒泡

    event_select.stopPropagation(event);

    var AllParChinodes=getChildrenNodes(element);//获取父元素的子元素集以及本身节点

    //光标按下时光标和面板之间的距离
    var	X=event.clientX-this.offsetLeft,
      Y=event.clientY-this.offsetTop;
    //获取鼠标按下时的坐标
    var setX=event.clientX,
      setY=event.clientY;
    //备份所有子类元素的坐标位置
    var nodesX=new Array(),
      nodesY=new Array();
    for(var i=1;i<AllParChinodes.length;i++)
    {
      nodesX[i]=AllParChinodes[i].offsetLeft;
      nodesY[i]=AllParChinodes[i].offsetTop;
    }
    //移动
    document.onmousemove=function(event){
      event=event||window.event;
      //光标移动事件触发的内调函数
      var left=event.clientX-X,
        top=event.clientY-Y;
      //脑图区域各临界值
      var winWidth=$("div")[1].offsetWidth,
        winHeight=$("div")[1].offsetHeight;
      //设置块状元素的最大移动宽度和最大移动高度，防止块状元素超出窗口范围
      var	maxWidth=winWidth-element.offsetWidth,
        maxHeight=winHeight+$('div')[0].offsetHeight-element.offsetHeight;
      if(left<10){
        left=10;
      }else if(left>maxWidth+5){
        left=maxWidth+5;
      }
      if(top<$("div")[0].offsetHeight+10){
        top=$("div")[0].offsetHeight+10;
      }else if(top>maxHeight+3){
        top=maxHeight+3;
      }
      element.style.left=left+"px";
      element.style.top=top+"px";

      //计算移动时鼠标的坐标与鼠标按下当时的坐标的相对位置
      var moveX=event.clientX-setX,
        moveY=event.clientY-setY;
      //父元素与其所有子级的牵引线的移动
      for(var i=0;i<AllParChinodes.length;i++){
        if(i!=0){
          AllParChinodes[i].style.left=nodesX[i]+moveX+'px';
          AllParChinodes[i].style.top=nodesY[i]+moveY+'px';
        }
      }
      //区域检测
      Region_detection($('div')[2]);
      for(var i=0;i<AllParChinodes.length;i++)
        LineSet(AllParChinodes[i]);

    }

    document.onmouseup=function(event){
       var	event=event||window.event;
        document.onmousemove=null;
        document.onmouseup=null;
        //阻止冒泡
        event_select.stopPropagation(event);
    }
}

//牵引线设置函数
function LineSet(node){
  if(node.preElement==undefined)
    node.preElement=$('div')[2];
  if(node.preElement.nextElement!=undefined){
    for(var i=0;i<node.preElement.nextElement.length;i++){
      //单元素牵引线保留代码段
      /*var Left=node.offsetLeft,
        Width=node.offsetWidth,
        Top=node.offsetTop,
        Height=node.offsetHeight,
        preLeft=node.preElement.offsetLeft,
        preWidth=node.preElement.offsetWidth,
        preTop=node.preElement.offsetTop,
        preHeight=node.preElement.offsetHeight;
      var lineCenterX=(Left+Width/2+preLeft+preWidth/2)/2,
        lineCenterY=(Top+Height/2+preTop+preHeight/2)/2;
      var lineCosL=Left+Width/2-preLeft-preWidth/2,
        lineSinL=Top+Height/2-preTop-preHeight/2;
      var L=Math.sqrt(lineCosL*lineCosL+lineSinL*lineSinL);
        Angle=Math.atan(lineSinL/lineCosL);
      node.preline.width=L;
      node.preline.style.left=lineCenterX-L/2+'px';
      node.preline.style.top=lineCenterY+'px';
      node.preline.style.transform='rotate('+Angle+'rad)';
      */
      var Left=node.preElement.nextElement[i].offsetLeft,
        Width=node.preElement.nextElement[i].offsetWidth,
        Top=node.preElement.nextElement[i].offsetTop,
        Height=node.preElement.nextElement[i].offsetHeight,
        preLeft=node.preElement.offsetLeft,
        preWidth=node.preElement.offsetWidth,
        preTop=node.preElement.offsetTop,
        preHeight=node.preElement.offsetHeight;
      var lineCenterX=(Left+Width/2+preLeft+preWidth/2)/2,
        lineCenterY=(Top+Height/2+preTop+preHeight/2)/2;
      var lineCosL=Left+Width/2-preLeft-preWidth/2,
        lineSinL=Top+Height/2-preTop-preHeight/2;
      var L=Math.sqrt(lineCosL*lineCosL+lineSinL*lineSinL);
        Angle=Math.atan(lineSinL/lineCosL);
      node.preElement.nextElement[i].preline.width=L;
      node.preElement.nextElement[i].preline.style.left=lineCenterX-L/2+'px';
      node.preElement.nextElement[i].preline.style.top=lineCenterY+'px';
      node.preElement.nextElement[i].preline.style.transform='rotate('+Angle+'rad)';

  /*	A   AC=line.width
    *
    * *
    *   *
    *     *
    *       *
    ***L/2*****  	Center(lineCenterX,lineCenterY)
    *           *
    *             *
    *               *
    ********L**********
    B				   C
  */

    }
  }
}
//所有子节点包括其牵引线的删除函数
function deleteNodes(node){
  var AllChildrenNodes=getChildrenNodes(node);
  //alert(AllChildrenNodes.length);
  for(var i=0;i<AllChildrenNodes.length;i++){
    if(AllChildrenNodes[i]==$('div')[2]){
      continue; //禁止删除选中的元素
    }else{
      $('div')[1].removeChild(AllChildrenNodes[i].preline); //删除线节点
      $('div')[1].removeChild(AllChildrenNodes[i]);  //删除单元节点
      node.nextElement=new Array(); //设置当父元素的子元素全部清除时，父元素的子元素数组为空
    }
  }
}
```
