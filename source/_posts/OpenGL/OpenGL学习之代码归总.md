---
title: OpenGL学习之代码归总
tags:
  - Essay
toc: true
reward: true
translate_title: opengl-learning-code-is-total
date: 2018-01-29 15:11:40
---
> # 前言

　　专业课，花了两三周看掉的吧，不过也就看到模板测试没看了，到底啥才是兴趣点呢。
　　那本蓝宝书还是没有Github网站教学好啊，这里添上[链接](https://learnopengl-cn.github.io/intro/)，这是最新链接，之前有个老版本的网站，别走错了。
　　详细教程网站都有，这里只是类似于备份下之前努力手敲的代码吧，毕竟我的片段着色器、顶点着色器文件是综合的，而且着色器头文件、摄像机头文件、网格头文件和模型头文件都是手打，修改了下的，不过大体都一样，只不过自己傻傻吧，手打，记忆深刻些罢了，想必不用还是会忘得一干二净吧。
> # 环境搭建

## 本地新建OpenGL文件夹
①子目录：include——用于放置.h文件
②子目录：libs——用于放置.lib文件
## 配置GLEW库
①官网下载地址：http://glew.sourceforge.net/
![OpenGL图示1](/assets/img/openGL/OpenGL_One.png)
②解压Glew压缩包，进入build目录，用本机Visual Studio打开vs12目录下的工程
![OpenGL图示2](/assets/img/openGL/OpenGL_Two.png)
③用Visual Studio打开glew.sln，编译此项目（生成解决方案）
![OpenGL图示3](/assets/img/openGL/OpenGL_Three.png)
④打开glew-2.1.0\lib\Debug\Win32，将glew32sd.lib拷贝至OpenGL\libs文件夹下
![OpenGL图示4](/assets/img/openGL/OpenGL_Four.png)
⑤打开glew-2.1.0\include\GL，将所有文件（elew.h，glew.h，glxew.h，wglew.h）拷贝至OpenGL\include文件夹下
![OpenGL图示5](/assets/img/openGL/OpenGL_Five.png)
## 配置GLFW库
①安装CMake工具和下载GLFW库：
官方下载地址：https://cmake.org/
![OpenGL图示6](/assets/img/openGL/OpenGL_Six.png)
官网下载地址：http://www.glfw.org/
![OpenGL图示7](/assets/img/openGL/OpenGL_Seven.png)
③安装好CMake后，打开cmake-gui.exe，点击Browse Source将目录设置为glfw-3.2.1目录
④点击Browse Build，将目录设置为glfw-3.2.1\build文件夹（build自己新建）
![OpenGL图示8](/assets/img/openGL/OpenGL_Eight.png)
⑤点击Configure，选择目标平台，例如本机的Visual Studio 2017，所以选择Visual Studio 12 2017，点击确定
⑥再次Configure，然后Generate生成项目：
![OpenGL图示9](/assets/img/openGL/OpenGL_Nine.png)
⑦关闭CMake，进入build，用Visual Studio打开GLFW.sln，并编译
![OpenGL图示10](/assets/img/openGL/OpenGL_Ten.png)
![OpenGL图示11](/assets/img/openGL/OpenGL_Eleven.png)
⑧build\src\Debug目录下有刚才编译项目生成的glfw3.lib库，将次库拷贝到OpenGL\libs目录下。将glfw-3.2.1\include下的GLFW中的文件拷贝到OpenGL\include文件夹下
## 配置GLAD库
GLAD是一个开源的库，它能解决我们上面提到的那个繁琐的问题。GLAD的配置与大多数的开源库有些许的不同，GLAD使用了一个在线服务。在这里我们能够告诉GLAD需要定义的OpenGL版本，并且根据这个版本加载所有相关的OpenGL函数。
打开GLAD的在线服务（http://glad.dav1d.de/），将语言(Language)设置为C/C++，在API选项中，选择3.3以上的OpenGL(gl)版本（我们的教程中将使用3.3版本，但更新的版本也能正常工作）。之后将模式(Profile)设置为Core，并且保证生成加载器(Generate a loader)的选项是选中的。现在可以先（暂时）忽略拓展(Extensions)中的内容。都选择完之后，点击生成(Generate)按钮来生成库文件。
![OpenGL图示12](/assets/img/openGL/OpenGL_Twelve.png)
GLAD现在应该提供给你了一个zip压缩文件，包含两个头文件目录，和一个glad.c文件。将两个头文件目录（glad和KHR）复制到你的Include文件夹中（或者增加一个额外的项目指向这些目录），并添加glad.c文件到你的工程中。
至此，已经配置好OpenGL库：
![OpenGL图示13](/assets/img/openGL/OpenGL_Thirteen.png)
![OpenGL图示14](/assets/img/openGL/OpenGL_Fourteen.png)
![OpenGL图示15](/assets/img/openGL/OpenGL_Fifteen.png)
## 项目添加库目录和链接依赖项
①新建空项目（C++项目）
②右击项目-属性-VC++目录
包含目录选择定位到OpenGL\include
库目录选择定位到OpenGL\libs
![OpenGL图示16(/assets/img/openGL/OpenGL_Sixteen.png)]
③进入链接器输入-附加依赖项：
加入以下库目录：
opengl32.Lib
glfw3.lib
glew32sd.lib
![OpenGL图示17](/assets/img/openGL/OpenGL_Seventeen.png)
> # OpenGL_Learn_ElementaryCourse

## OpenGL_Learn_ElementaryCourse_One_Geometric_Primitives.cpp
```cpp
#include<glad.h>
#include<glfw3.h>
#include<iostream>

const unsigned int SCR_WIDTH = 800;
const unsigned int SCR_HEIGHT = 600;

//窗口改变函数
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	glViewport(0, 0, width, height);
}

//GLFW的输入控制，返回这个按键是否被按下
void processInput(GLFWwindow* window)
{
	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
	{
		glfwSetWindowShouldClose(window, true);
	}
}

//点的属性
/*void display(void)
{
	glClear(GL_COLOR_BUFFER_BIT);
	glColor3f(1.0, 1.0, 1.0);
	glPointSize(25);
	glLineWidth(25);
	glBegin(GL_POINTS);
	glVertex3f(0.5, 0.5, 0.0);
	glVertex3f(-0.5, 0.5, 0.0);
	glVertex3f(-0.5, -0.5, 0.0);
	glVertex3f(0.5, -0.5, 0.0);
	glEnd();

	glFlush();
}*/

//多组双顶点线段
/*void display(void)
{
	glClear(GL_COLOR_BUFFER_BIT);
	glColor3f(1.0, 1.0, 1.0);
	glPointSize(25);
	glLineWidth(25);
	//glLineStipple(1, 0xFF00);
	//glEnable(GL_LINE_STIPPLE);
	glBegin(GL_LINES);//GL_LINES GL_LOOP
	glVertex3f(0.5, 0.5, 0.0);
	glVertex3f(-0.5, 0.5, 0.0);
	glVertex3f(-0.5, -0.5, 0.0);
	glVertex3f(0.5, -0.5, 0.0);
	glEnd();
	glFlush();
}*/
//闭合折线
/*void display(void)
{
	glClear(GL_COLOR_BUFFER_BIT);
	glColor3f(1.0, 1.0, 1.0);
	glPointSize(25);
	glLineWidth(25);
	glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
	//glLineStipple(1, 0xFF00);
	glEnable(GL_FILL);
	glBegin(GL_LINE_LOOP);
	glVertex3f(-0.5, 0.5, 0.0);
	glVertex3f(0.5, -0.5, 0.0);

	glVertex3f(0.5, 0.5, 0.0);

	glVertex3f(-0.5, -0.5, 0.0);

	glEnd();
	glFlush();
}*/
//不闭合折线
/*void display(void)
{
	glClear(GL_COLOR_BUFFER_BIT);
	glColor3f(1.0, 1.0, 1.0);
	glPointSize(25);
	glLineWidth(25);
	//glLineStipple(1, 0xFF00);
	//glEnable(GL_LINE_STIPPLE);
	glBegin(GL_LINE_STRIP);
	glVertex3f(0.5, 0.5, 0.0);
	glVertex3f(-0.5, 0.5, 0.0);
	glVertex3f(-0.5, -0.5, 0.0);
	glVertex3f(0.5, -0.5, 0.0);
	glEnd();
	glFlush();
}*/

//凸多边形
void display(void)
{
	glClear(GL_COLOR_BUFFER_BIT);
	glColor3f(1.0, 1.0, 1.0);
	glPointSize(10);
	glLineWidth(25);
	//glEnable(GL_LINE);
	glPolygonMode(GL_FRONT, GL_LINE); // 设置正面为填充模式
	glPolygonMode(GL_BACK, GL_LINE);   // 设置反面为线形模式
	//glFrontFace(GL_CCW);   // 设置逆时针方向为正面
	glFrontFace(GL_CW);
	//glBegin(GL_QUADS);
	glBegin(GL_POLYGON);
	glVertex2f(-0.5f, 0.0f);
	glVertex2f(-0.5f, -0.5f);
	glVertex2f(0.0f, -0.5f);
	glVertex2f(0.0f, 0.0f);
	//glVertex2f(-0.25f, -0.25f);



	glEnd();
	glFlush();
}
//连续填充四边形串
/*void display(void)
{
	glClear(GL_COLOR_BUFFER_BIT);
	glColor3f(1.0, 1.0, 1.0);
	//glPointSize(50);
	glLineWidth(25);
	glPolygonMode(GL_FRONT, GL_LINE); // 设置正面为填充模式
	glPolygonMode(GL_BACK, GL_LINE);   // 设置反面为线形模式
	glFrontFace(GL_CCW);               // 设置逆时针方向为正面
	glBegin(GL_QUAD_STRIP);

	glVertex2f(-0.5f, -0.5f);
	glVertex2f(-0.5f, 0.0f);
	glVertex2f(0.0f, -0.5f);
	glVertex2f(0.0f, 0.0f);
	glVertex2f(0.5f, -0.5f);
	glVertex2f(0.5f, 0.0f);
	//glVertex2f(0.7f, -0.5f);
	//glVertex2f(0.7f, 0.0f);
	glEnd();
	glFlush();
}*/

//多组独立填充三角形
/*void display(void)
{
	glClear(GL_COLOR_BUFFER_BIT);
	glColor3f(1.0, 1.0, 1.0);
	glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);//线框模式
	glLineWidth(25);
	glBegin(GL_TRIANGLES);
	glVertex3f(0.4f, 0.5f, 0.0f);
	glVertex3f(-0.4f, 0.5f, 0.0f);
	glVertex3f(0.0f, -0.5f, 0.0f);

	glVertex3f(-0.5f,0.5f,0.0f);
	glVertex3f(-0.2f,-0.5f,0.0f);
	glVertex3f(-0.7f,-0.5f,0.0f);

	glEnd();

	glFlush();
}*/

//线型连续填充三角形串
/*void display(void)
{
	glClear(GL_COLOR_BUFFER_BIT);
	glColor3f(1.0, 1.0, 1.0);
	glLineWidth(25);
	glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
	glBegin(GL_TRIANGLE_STRIP);
		glVertex3f(-0.9f, -0.5f, 0.0f);
		glVertex3f(-0.5f, 0.5f, 0.0f);
		glVertex3f(0.0f, -0.5f, 0.0f);
		glVertex3f(0.4f, 0.5f, 0.0f);
		//glVertex3f(0.9f, -0.5f, 0.0f);
	glEnd();

	glFlush();
}*/
//扇形连续填充三角形串
/*void display(void)
{
glClear(GL_COLOR_BUFFER_BIT);
glColor3f(1.0, 0.0, 0.0);
glLineWidth(5);
glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
glBegin(GL_TRIANGLE_FAN);
glVertex2f(0.0f, 0.0f);
glVertex2f(0.25f, -0.25f);
glVertex2f(0.25f, 0.25f);

glVertex2f(-0.25f, 0.25f);
glVertex2f(-0.25f, -0.3f);
glEnd();

glFlush();
}*/
//圆的逼近表示
/*#include <math.h>
#define PI 3.1415926535
GLint circle_points = 128;
void display(void)
{
	glClear(GL_COLOR_BUFFER_BIT);
	glColor3f(1.0, 1.0, 1.0);
	glLineWidth(25);
	glBegin(GL_LINE_LOOP);
	for (int i = 0; i < circle_points; ++i){
		float angle = (float)(2 * PI / circle_points)*i;
		glVertex2f(cos(angle), sin(angle));
	}
	glEnd();
	glFlush();
}*/
int main()
{
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_COMPAT_PROFILE);

	//创建一个窗口对象
	GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);

	//初始化GLAD
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}

	//视口
	//glViewport函数前两个参数控制窗口左下角的位置。
	//第三个和第四个参数控制渲染窗口的宽度和高度（像素）。
	glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);

	//注册函数，当窗口调整大小时调用
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);

	while (!glfwWindowShouldClose(window))
	{
		//输入
		processInput(window);

		//图元函数
		display();
		//检查并调用事件，交换缓冲
		glfwSwapBuffers(window);
		glfwPollEvents();
	}

	glfwTerminate();

	return 0;
}
```
## OpenGL_Learn_ElementaryCourse_Two_Shader_Complicated.cpp
```cpp
#include<glad.h>
#include<glfw3.h>
#include<iostream>
#include"Shader.h"
const unsigned int SCR_WIDTH = 800;
const unsigned int SCR_HEIGHT = 600;


//"	vertexColor=vec4(0.0f, 1.0f, 0.0f, 1.0f);\n"
//"out vec4 vertexColor;\n" //为顶点着色器指定一个颜色输出
//顶点着色器
const char *vertexShaderSource =
"#version 330 core\n"
"layout(location = 0) in vec3 aPos;\n" // 位置变量的属性位置值为 0
"layout(location = 1) in vec3 aColor;\n" // 颜色变量的属性位置值为 1
"out vec3 ourColor;\n"
"void main()\n"
"{\n"
"	gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);\n"
"	ourColor=aColor;\n"  // 将ourColor设置为我们从顶点数据那里得到的输入颜色
"}\0";


//"   FragColor = vertexColor;\n"
//"	FragColor = ourColor;\n"
//"uniform vec4 ourColor;\n"
//片段着色器
const char *fragmentShaderSource = "#version 330 core\n"
//"in vec4 vertexColor;\n" //从顶点着色器传来的输入变量（名称相同、类型相同）
"out vec4 FragColor;\n"
"in vec3 ourColor;\n"
"void main()\n"
"{\n"
"	FragColor = vec4(ourColor,1.0f);\n"
"}\n\0";

/*
//着色器语言——GLSL类C语言
#version version_number	//声明版本
in type in_variable_name; //输入变量
out type out_variable_name; //输出变量

uniform type uniform_name;

int main()
{
// 处理输入并进行一些图形操作
...
// 输出处理过的结果到输出变量
out_variable_name = weird_stuff_we_processed;
}
*/

/*
我们在片段着色器中声明了一个uniform vec4的ourColor，
并把片段着色器的输出颜色设置为uniform值的内容。
因为uniform是全局变量，我们可以在任何着色器中定义它们，
而无需通过顶点着色器作为中介。顶点着色器中不需要这个uniform，
所以我们不用在那里定义它。
*/

/*
#version 330 core
out vec4 FragColor;
uniform vec4 ourColor;//在OpenGL程序代码中设定这个变量
void man()
{
	FragColor=ourColor;
}
*/
//窗口改变函数
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	glViewport(0, 0, width, height);
}

//GLFW的输入控制，返回这个按键是否被按下
void processInput(GLFWwindow* window)
{
	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
	{
		glfwSetWindowShouldClose(window, true);
	}
}

int main()
{
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	//创建一个窗口对象
	GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);

	//初始化GLAD
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}

	//视口
	//glViewport函数前两个参数控制窗口左下角的位置。
	//第三个和第四个参数控制渲染窗口的宽度和高度（像素）。
	glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);

	//注册函数，当窗口调整大小时调用
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);

	///////////////////////////////////////////////////////////////////////////
	/*
	//循环渲染
	//glfwWindowShouldClose函数在我们每次循环的开始前检查一次GLFW是否被要求退出，如果是的话该函数返回true然后渲染循环便结束了，之后为我们就可以关闭应用程序了。
	//glfwPollEvents函数检查有没有触发什么事件（比如键盘输入、鼠标移动等）、更新窗口状态，并调用对应的回调函数（可以通过回调方法手动设置）。
	//glfwSwapBuffers函数会交换颜色缓冲（它是一个储存着GLFW窗口每一个像素颜色值的大缓冲），它在这一迭代中被用来绘制，并且将会作为输出显示在屏幕上。
	while (!glfwWindowShouldClose(window))
	{
	glfwSwapBuffers(window);
	glfwPollEvents();
	}

	glfwTerminate();*/

	//循环渲染
	/*while (!glfwWindowShouldClose(window))
	{
	//输入
	processInput(window);

	//渲染指令
	//调用glClear函数来清空屏幕的颜色缓冲，它接受一个缓冲位(Buffer Bit)来指定要清空的缓冲，可能的缓冲位有GL_COLOR_BUFFER_BIT，GL_DEPTH_BUFFER_BIT和GL_STENCIL_BUFFER_BIT。由于现在我们只关心颜色值，所以我们只清空颜色缓冲。
	//我们还调用了glClearColor来设置清空屏幕所用的颜色。当调用glClear函数，清除颜色缓冲之后，整个颜色缓冲都会被填充为glClearColor里所设置的颜色。
	glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
	glClear(GL_COLOR_BUFFER_BIT);


	//

	//检查并调用事件，交换缓冲
	glfwSwapBuffers(window);
	glfwPollEvents();
	}*/
	///////////////////////////////////////////////////////////////////////////////


	//////////////////////////////////////////////////////////////////////////
	//编译着色器
	//创建一个着色器对象，注意还是用ID来引用的。所以我们储存这个顶点着色器为unsigned int，然后用glCreateShader创建这个着色器
	/*unsigned int vertexShader;
	vertexShader = glCreateShader(GL_VERTEX_SHADER);

	//把需要创建的着色器类型以参数形式提供给glCreateShader。由于我们正在创建一个顶点着色器，传递的参数是GL_VERTEX_SHADER。

	//下一步我们把这个着色器源码附加到着色器对象上，然后编译它

	//glShaderSource函数把要编译的着色器对象作为第一个参数。第二参数指定了传递的源码字符串数量，这里只有一个。第三个参数是顶点着色器真正的源码，第四个参数我们先设置为NULL。

	glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
	glCompileShader(vertexShader);

	//检测调用CompileShader后编译是否成功
	int success;
	char infoLog[512];
	glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &success);
	if (!success)
	{
		glGetShaderInfoLog(vertexShader, 512, NULL, infoLog);
		std::cout << "ERROR::SHADER::VERTEX::COMPILATION_FAILED\n" << infoLog << std::endl;
	}

	//片段着色器

	//片段着色器只需要一个输出变量，这个变量是一个4分量向量，它表示的是最终的输出颜色，我们应该自己将其计算出来。我们可以用out关键字声明输出变量，这里我们命名为FragColor。下面，我们将一个alpha值为1.0(1.0代表完全不透明)的橘黄色的vec4赋值给颜色输出。

	unsigned int fragmentShader;
	fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
	glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
	glCompileShader(fragmentShader);
	glGetShaderiv(fragmentShader, GL_COMPILE_STATUS, &success);
	if (!success)
	{
		glGetShaderInfoLog(fragmentShader, 512, NULL, infoLog);
		std::cout << "ERROR::SHADER::FRAGMENT::COMPILATION_FAILED\n" << infoLog << std::endl;
	}
	//两个着色器现在都编译了，剩下的事情是把两个着色器对象链接到一个用来渲染的着色器程序(Shader Program)中。

	//着色器程序
	//色器程序对象(Shader Program Object)是多个着色器合并之后并最终链接完成的版本。如果要使用刚才编译的着色器我们必须把它们链接(Link)为一个着色器程序对象，然后在渲染对象的时候激活这个着色器程序。已激活着色器程序的着色器将在我们发送渲染调用的时候被使用。
	//当链接着色器至一个程序的时候，它会把每个着色器的输出链接到下个着色器的输入。当输出和输入不匹配的时候，你会得到一个连接错误。

	//创建一个程序对象
	unsigned int shaderProgram;
	shaderProgram = glCreateProgram();
	//glCreateProgram函数创建一个程序，并返回新创建程序对象的ID引用。



	//现在我们需要把之前编译的着色器附加到程序对象上，然后用glLinkProgram链接它们：
	glAttachShader(shaderProgram, vertexShader);
	glAttachShader(shaderProgram, fragmentShader);
	glLinkProgram(shaderProgram);

	//检测链接着色器程序是否失败
	glGetProgramiv(shaderProgram, GL_LINK_STATUS, &success);
	if (!success)
	{
		glGetProgramInfoLog(shaderProgram, 512, NULL, infoLog);
		std::cout << "ERROR::SHADER::PROGRAM::LINKING_FAILED\n" << infoLog << std::endl;
	}

	//激活程序对象
	glUseProgram(shaderProgram);

	//把着色器对象链接到程序对象以后，记得删除着色器对象，我们不再需要它们了
	glDeleteShader(vertexShader);
	glDeleteShader(fragmentShader);*/


	//链接顶点属性
	//使用glVertexAttribPointer函数告诉OpenGL该如何解析顶点数据（应用到逐个顶点属性上）了
	//位置属性
	//glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(float), (void*)0);
	//glEnableVertexAttribArray(0);
	/*
	glVertexAttribPointer函数的参数非常多，所以我会逐一介绍它们：

	第一个参数指定我们要配置的顶点属性。还记得我们在顶点着色器中使用layout(location = 0)定义了position顶点属性的位置值(Location)吗？它可以把顶点属性的位置值设置为0。因为我们希望把数据传递到这一个顶点属性中，所以这里我们传入0。
	第二个参数指定顶点属性的大小。顶点属性是一个vec3，它由3个值组成，所以大小是3。
	第三个参数指定数据的类型，这里是GL_FLOAT(GLSL中vec*都是由浮点数值组成的)。
	下个参数定义我们是否希望数据被标准化(Normalize)。如果我们设置为GL_TRUE，所有数据都会被映射到0（对于有符号型signed数据是-1）到1之间。我们把它设置为GL_FALSE。
	第五个参数叫做步长(Stride)，它告诉我们在连续的顶点属性组之间的间隔。由于下个组位置数据在3个float之后，我们把步长设置为3 * sizeof(float)。要注意的是由于我们知道这个数组是紧密排列的（在两个顶点属性之间没有空隙）我们也可以设置为0来让OpenGL决定具体步长是多少（只有当数值是紧密排列时才可用）。一旦我们有更多的顶点属性，我们就必须更小心地定义每个顶点属性之间的间隔，我们在后面会看到更多的例子（译注: 这个参数的意思简单说就是从这个属性第二次出现的地方到整个数组0位置之间有多少字节）。
	最后一个参数的类型是void*，所以需要我们进行这个奇怪的强制类型转换。它表示位置数据在缓冲中起始位置的偏移量(Offset)。由于位置数据在数组的开头，所以这里是0。我们会在后面详细解释这个参数。
	*/
	////////////////////////////////////////////////////////////////////////

	//索引缓冲对象、顶点数组对象、顶点缓冲对象
	//////////////////////////////////////////////////////////
	//顶点数组
	/*float vertices[] = {
	-0.5f,-0.5f, 0.0f,
	0.5f,-0.5f, 0.0f,
	0.0f, 0.5f, 0.0f
	};*/
	float vertices[] = {

		0.5f, 0.5f, 0.0f, 1.0f,0.0f,0.0f,  // 右上角
		0.5f, -0.5f, 0.0f, 0.0f,1.0f,0.0f,  // 右下角
		-0.5f, -0.5f, 0.0f, 0.0f,0.0f,1.0f,// 左下角
		-0.5f, 0.5f, 0.0f , 0.5f,0.5f,0.5f  // 左上角
	};


	//索引缓冲对象
	unsigned int indices[] = {
		0,1,2, //第一个三角形
		2,3,0  //第二个三角形
	};

	unsigned int EBO;
	glGenBuffers(1, &EBO);
	//绑定EBO到GL_ELEMENT_ARRAY_BUFFER


	//顶点缓冲对象（Vertex Buffer Objects)
	//使用glGenBuffers函数和一个缓冲ID生成一个VBO对象
	unsigned int VBO;
	glGenBuffers(1, &VBO);

	//glBindBuffer函数把新创建的缓冲绑定到GL_ARRAY_BUFFER目标上

	//顶点数组对象：Vertex Array Object，VAO
	//顶点缓冲对象：Vertex Buffer Object，VBO
	//索引缓冲对象：Element Buffer Object，EBO或Index Buffer Object，IBO

	//OpenGL有很多缓冲对象类型，顶点缓冲对象的缓冲类型是GL_ARRAY_BUFFER
	//glBindBuffer(GL_ARRAY_BUFFER, VBO);

	//调用glBufferData函数，它会把之前定义的顶点数据复制到缓冲的内存中
	//glBufferData是一个专门用来把用户定义的数据复制到当前绑定缓冲的函数。它的第一个参数是目标缓冲的类型：顶点缓冲对象当前绑定到GL_ARRAY_BUFFER目标上。第二个参数指定传输数据的大小(以字节为单位)；用一个简单的sizeof计算出顶点数据大小就行。第三个参数是我们希望发送的实际数据。
	//第四个参数指定了我们希望显卡如何管理给定的数据。它有三种形式：
	//GL_STATIC_DRAW ：数据不会或几乎不会改变。
	//GL_DYNAMIC_DRAW：数据会被改变很多。
	//GL_STREAM_DRAW ：数据每次绘制时都会改变。
	//三角形的位置数据不会改变，每次渲染调用时都保持原样，所以它的使用类型最好是GL_STATIC_DRAW。如果，比如说一个缓冲中的数据将频繁被改变，那么使用的类型就是GL_DYNAMIC_DRAW或GL_STREAM_DRAW，这样就能确保显卡把数据放在能够高速写入的内存部分。
	//glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

	//顶点着色其器
	/*
	GLSL着色器语言
	#version 330 core
	layout (location = 0) in vec3 aPos;

	void main()
	{
	gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);
	}
	*/
	//顶点数组对象

	//创建一个VAO
	unsigned int VAO;
	glGenVertexArrays(1, &VAO);
	//绑定VAO
	glBindVertexArray(VAO);
	//把顶点数组复制到缓冲中供OpenGL使用
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
	glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

	//设置顶点属性指针
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	//颜色属性
	glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(float), (void*)(3 * sizeof(float)));
	glEnableVertexAttribArray(1);
	/////////////////////////////////////////////////////////////////////////////


	Shader ourShader("shader.vs", "shader.fs");
	//循环渲染
	////////////////////////////////////////////
	while (!glfwWindowShouldClose(window))
	{
		//输入
		processInput(window);

		//渲染指令
		//调用glClear函数来清空屏幕的颜色缓冲，它接受一个缓冲位(Buffer Bit)来指定要清空的缓冲，可能的缓冲位有GL_COLOR_BUFFER_BIT，GL_DEPTH_BUFFER_BIT和GL_STENCIL_BUFFER_BIT。由于现在我们只关心颜色值，所以我们只清空颜色缓冲。
		//我们还调用了glClearColor来设置清空屏幕所用的颜色。当调用glClear函数，清除颜色缓冲之后，整个颜色缓冲都会被填充为glClearColor里所设置的颜色。
		glClearColor(0.1f, 0.2f, 0.3f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT);

		//画三角形
		//glUseProgram(shaderProgram);
		ourShader.use();
		//ourShader.setFloat("ourColor", 1.0);
		glBindVertexArray(VAO);
		//线框模式
		//第一个参数表示我们打算将其应用到所有的三角形的正面和背面，第二个参数告诉我们用线来绘制
		//glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
		//填充模式
		glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

		/////////////////////////////////////////////////////////////////////
		//随着时间改变颜色
		//注意，查询uniform地址不要求你之前使用过着色器程序，但是更新一个uniform之前你必须先使用程序（调用glUseProgram)，
		//因为它是在当前激活的着色器程序中设置uniform的。
		/*float timeValue = (float)glfwGetTime();
		float greenValue = (sin(timeValue) / 2.0f) + 0.5f;
		int vertexColorLocation = glGetUniformLocation(shaderProgram, "ourColor");
		glUniform4f(vertexColorLocation, 0.0f, greenValue, 0.0f, 1.0f);*/
		///////////////////////////////////////////////////////////////////////

		//三角形非索引缓冲对象设置
		//glDrawArrays(GL_TRIANGLES, 0, 3);

		//索引缓冲对象设置缓冲渲染
		//第一个参数指定了我们绘制的模式，这个和glDrawArrays的一样。第二个参数是我们打算绘制顶点的个数，这里填6，也就是说我们一共需要绘制6个顶点。第三个参数是索引的类型，这里是GL_UNSIGNED_INT。最后一个参数里我们可以指定EBO中的偏移量（或者传递一个索引数组，但是这是当你不在使用索引缓冲对象的时候），但是我们会在这里填写0。
		glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
		//glDrawElements(GL_POINT, 6, GL_UNSIGNED_INT, 0);
		//检查并调用事件，交换缓冲
		glfwSwapBuffers(window);
		glfwPollEvents();
	}
	/////////////////////////////////////////////

	//Sleep(2000);
	glfwTerminate();
	return 0;
}

```
## OpenGL_Learn_ElementaryCourse_Two_Shader_Reduced.cpp
```cpp
#include<glad.h>
#include<glfw3.h>
#include<iostream>
#include"Shader.h"
const unsigned int SCR_WIDTH = 800;
const unsigned int SCR_HEIGHT = 600;

//窗口改变函数
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	glViewport(0, 0, width, height);
}

//GLFW的输入控制，返回这个按键是否被按下
void processInput(GLFWwindow* window)
{
	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
	{
		glfwSetWindowShouldClose(window, true);
	}
}

int main()
{
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	//创建一个窗口对象
	GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);

	//初始化GLAD
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}

	//视口
	//glViewport函数前两个参数控制窗口左下角的位置。
	//第三个和第四个参数控制渲染窗口的宽度和高度（像素）。
	glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);

	//注册函数，当窗口调整大小时调用
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);


	//索引缓冲对象、顶点数组对象、顶点缓冲对象
	//////////////////////////////////////////////////////////

	float vertices[] = {
		//位置              //颜色
		0.5f, 0.5f, 0.0f, 1.0f,0.0f,0.0f,  // 右上角
		0.5f, -0.5f, 0.0f, 0.0f,1.0f,0.0f,  // 右下角
		-0.5f, -0.5f, 0.0f, 0.0f,0.0f,1.0f,// 左下角
		-0.5f, 0.5f, 0.0f , 0.5f,0.5f,0.5f  // 左上角
	};

	//索引缓冲对象
	unsigned int indices[] = {
		0,1,2, //第一个三角形
		2,3,0  //第二个三角形
	};

	unsigned int EBO;
	glGenBuffers(1, &EBO);
	//绑定EBO到GL_ELEMENT_ARRAY_BUFFER

	//顶点缓冲对象（Vertex Buffer Objects)
	//使用glGenBuffers函数和一个缓冲ID生成一个VBO对象
	unsigned int VBO;
	glGenBuffers(1, &VBO);

	//顶点数组对象
	unsigned int VAO;
	glGenVertexArrays(1, &VAO);
	//绑定VAO
	glBindVertexArray(VAO);
	//把顶点数组复制到缓冲中供OpenGL使用
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
	glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

	//设置顶点属性指针
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	//颜色属性
	glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(float), (void*)(3 * sizeof(float)));
	glEnableVertexAttribArray(1);
	/////////////////////////////////////////////////////////////////////////////

	//着色器类变量
	//已经封装了顶点着色器、片段着色器
	Shader ourShader("shader.vs", "shader.fs");
	//循环渲染
	////////////////////////////////////////////
	while (!glfwWindowShouldClose(window))
	{
		//输入
		processInput(window);

		//渲染指令
		//调用glClear函数来清空屏幕的颜色缓冲，它接受一个缓冲位(Buffer Bit)来指定要清空的缓冲，可能的缓冲位有GL_COLOR_BUFFER_BIT，GL_DEPTH_BUFFER_BIT和GL_STENCIL_BUFFER_BIT。由于现在我们只关心颜色值，所以我们只清空颜色缓冲。
		//我们还调用了glClearColor来设置清空屏幕所用的颜色。当调用glClear函数，清除颜色缓冲之后，整个颜色缓冲都会被填充为glClearColor里所设置的颜色。
		glClearColor(0.1f, 0.2f, 0.3f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT);

		//画三角形
		//glUseProgram(shaderProgram);
		ourShader.use();//激活着色器程序
		//ourShader.setFloat("ourColor", 1.0);
		glBindVertexArray(VAO);
		//线框模式
		//第一个参数表示我们打算将其应用到所有的三角形的正面和背面，第二个参数告诉我们用线来绘制
		//glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
		//填充模式
		glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

		//索引缓冲对象设置缓冲渲染
		//第一个参数指定了我们绘制的模式，这个和glDrawArrays的一样。第二个参数是我们打算绘制顶点的个数，这里填6，也就是说我们一共需要绘制6个顶点。第三个参数是索引的类型，这里是GL_UNSIGNED_INT。最后一个参数里我们可以指定EBO中的偏移量（或者传递一个索引数组，但是这是当你不在使用索引缓冲对象的时候），但是我们会在这里填写0。
		glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
		//glDrawElements(GL_POINT, 6, GL_UNSIGNED_INT, 0);
		//检查并调用事件，交换缓冲
		glfwSwapBuffers(window);
		glfwPollEvents();
	}
	/////////////////////////////////////////////


	glfwTerminate();
	return 0;
}

```
## OpenGL_Learn_ElementaryCourse_Three_Texture.cpp
```cpp
#define STB_IMAGE_IMPLEMENTATION
#include<glad.h>
#include<glfw3.h>
#include<iostream>
#include"Shader.h"
#include"stb_image.h"

const unsigned int SCR_WIDTH = 800;
const unsigned int SCR_HEIGHT = 600;

//窗口改变函数
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	glViewport(0, 0, width, height);
}

//GLFW的输入控制，返回这个按键是否被按下
void processInput(GLFWwindow* window)
{
	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
	{
		glfwSetWindowShouldClose(window, true);
	}
}

int main()
{
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	////////////////////////////////////////////////////////////////////////////////
	//创建一个窗口对象
	GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);

	//初始化GLAD
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}

	//视口
	//glViewport函数前两个参数控制窗口左下角的位置。
	//第三个和第四个参数控制渲染窗口的宽度和高度（像素）。
	glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);

	//注册函数，当窗口调整大小时调用
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
	///////////////////////////////////////////////////////////////////////////

	//索引缓冲对象、顶点数组对象、顶点缓冲对象
	///////////////////////////////////////////////////////////////////////////
	//LearnOpenGL CN 教程中对于纹理坐标有误
	//左上角(0,0),右下角(1,1)
	float vertices[] = {
		   //位置              //颜色RGBA             //纹理
		 0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 0.0f, 1.0f, 2.0f,0.0f,  // 右上角
		 0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 0.0f, 1.0f, 2.0f,2.0f,  // 右下角
		-0.5f, -0.5f, 0.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,2.0f,  // 左下角
		-0.5f,  0.5f, 0.0f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f,0.0f   // 左上角
	};

	//索引缓冲对象
	unsigned int indices[] = {
		0,1,2, //第一个三角形
		2,3,0  //第二个三角形
	};

	unsigned int EBO;
	glGenBuffers(1, &EBO);
	//绑定EBO到GL_ELEMENT_ARRAY_BUFFER

	//顶点缓冲对象（Vertex Buffer Objects)
	//使用glGenBuffers函数和一个缓冲ID生成一个VBO对象
	unsigned int VBO;
	glGenBuffers(1, &VBO);

	//顶点数组对象
	unsigned int VAO;
	glGenVertexArrays(1, &VAO);
	//绑定VAO
	glBindVertexArray(VAO);

	//把顶点数组复制到缓冲中供OpenGL使用
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
	glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

	//设置顶点属性指针
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 9 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	//颜色属性
	glVertexAttribPointer(1, 4, GL_FLOAT, GL_FALSE, 9 * sizeof(float), (void*)(3 * sizeof(float)));
	glEnableVertexAttribArray(1);
	//纹理属性
	glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 9 * sizeof(float), (void*)(7 * sizeof(float)));
	glEnableVertexAttribArray(2);
	/////////////////////////////////////////////////////////////////////////////


	///////////////////////////////////////////////////////////////
	//着色器类变量
	//已经封装了顶点着色器、片段着色器
	Shader ourShader("shader.vs", "shader.fs");
	/////////////////////////////////////////////////////////////////////////

	///////////////////////////////////////////////////////////////////
	//图片纹理
	unsigned int ourTexture;
	glGenTextures(1, &ourTexture);
	// 在绑定纹理之前先激活纹理单元
	//glActiveTexture(GL_TEXTURE0);
	//绑定纹理
	glBindTexture(GL_TEXTURE_2D, ourTexture);

	//纹理环绕
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
	//第一个参数指定了纹理目标；我们使用的是2D纹理，因此纹理目标是GL_TEXTURE_2D。第二个参数需要我们指定设置的选项与应用的纹理轴。我们打算配置的是WRAP选项，并且指定S和T轴。最后一个参数需要我们传递一个环绕方式(Wrapping)，在这个例子中OpenGL会给当前激活的纹理设定纹理环绕方式为GL_MIRRORED_REPEAT。

	//如果我们选择GL_CLAMP_TO_BORDER选项，我们还需要指定一个边缘的颜色。这需要使用glTexParameter函数的fv后缀形式，用GL_TEXTURE_BORDER_COLOR作为它的选项，并且传递一个float数组作为边缘的颜色值：
	float borderColor[] = { 1.0f,1.0f,0.0f,1.0f };
	glTexParameterfv(GL_TEXTURE_2D, GL_TEXTURE_BORDER_COLOR, borderColor);

	//纹理过滤
	//缩小Minify
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
	//放大Magnify
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//多级渐远纹理
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//加载纹理图片
	int width, height, nrChannels;
	//用图像的宽度、高度和颜色通道的个数填充这三个变量。
	unsigned char* data = stbi_load("001.jpg", &width, &height, &nrChannels, 0);

	if (data)
	{
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);
	}
	else
	{
		std::cout << "Failed to load texture" << std::endl;
	}
	stbi_image_free(data);

	//int width, height, nrChannels;
	//unsigned char* data;
	/*unsigned int faceTexture;
	glGenTextures(1, &faceTexture);
	glActiveTexture(GL_TEXTURE1);
	glBindTexture(GL_TEXTURE_2D, faceTexture);
	//纹理环绕
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_BORDER);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_BORDER);
	//第一个参数指定了纹理目标；我们使用的是2D纹理，因此纹理目标是GL_TEXTURE_2D。第二个参数需要我们指定设置的选项与应用的纹理轴。我们打算配置的是WRAP选项，并且指定S和T轴。最后一个参数需要我们传递一个环绕方式(Wrapping)，在这个例子中OpenGL会给当前激活的纹理设定纹理环绕方式为GL_MIRRORED_REPEAT。

	//如果我们选择GL_CLAMP_TO_BORDER选项，我们还需要指定一个边缘的颜色。这需要使用glTexParameter函数的fv后缀形式，用GL_TEXTURE_BORDER_COLOR作为它的选项，并且传递一个float数组作为边缘的颜色值：
	//float borderColor[] = { 1.0f,1.0f,0.0f,1.0f };
	//glTexParameterfv(GL_TEXTURE_2D, GL_TEXTURE_BORDER_COLOR, borderColor);

	//纹理过滤
	//缩小Minify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	//放大Magnify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//多级渐远纹理
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//加载纹理图片
	//用图像的宽度、高度和颜色通道的个数填充这三个变量。
	data = stbi_load("test2.jpg", &width, &height, &nrChannels, 0);

	if (data)
	{
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);
	}
	else
	{
		std::cout << "Failed to load texture" << std::endl;
	}
	stbi_image_free(data);*/

	ourShader.use();
	ourShader.setInt("ourTexture", 0);
	//ourShader.setInt("faceTexture", 1);

	//////////////////////////////////////////////////////////////////////////////

	//循环渲染
	////////////////////////////////////////////
	while (!glfwWindowShouldClose(window))
	{
		//输入
		processInput(window);

		//渲染指令
		//调用glClear函数来清空屏幕的颜色缓冲，它接受一个缓冲位(Buffer Bit)来指定要清空的缓冲，可能的缓冲位有GL_COLOR_BUFFER_BIT，GL_DEPTH_BUFFER_BIT和GL_STENCIL_BUFFER_BIT。由于现在我们只关心颜色值，所以我们只清空颜色缓冲。
		//我们还调用了glClearColor来设置清空屏幕所用的颜色。当调用glClear函数，清除颜色缓冲之后，整个颜色缓冲都会被填充为glClearColor里所设置的颜色。
		float timeValue = (float)glfwGetTime();
		float redValue = (cos(timeValue) / 2.0f) + 0.5f;
		float greenValue = (sin(timeValue) / 2.0f) + 0.5f;
		float blueValue = (cos(timeValue) / 2.0f) + 0.5f;
		float alphaValue = (sin(timeValue) / 2.0f) + 0.5f;
		float proportionValue = (cos(timeValue) / 2.0f) + 0.5f;
		glClearColor(0.1f, 0.2f, 0.3f, 1.0f);
		//glClearColor(redValue+0.1f, greenValue+0.2f, blueValue+0.3f, alphaValue);
		glClear(GL_COLOR_BUFFER_BIT);

		//画三角形
		//glUseProgram(shaderProgram);
		//ourShader.use();//激活着色器程序

		//设置uniform值
		//ourShader.setFloat("ourColor", greenValue);
		ourShader.setVec4("ourColor", redValue, greenValue, blueValue, alphaValue);
		//glBindVertexArray(VAO);
		//纹理
		/*glActiveTexture(GL_TEXTURE0);
		glBindTexture(GL_TEXTURE_2D, ourTexture);
		glActiveTexture(GL_TEXTURE1);
		glBindTexture(GL_TEXTURE_2D, faceTexture);*/
		ourShader.setFloat("proportion", proportionValue);
		//线框模式
		//第一个参数表示我们打算将其应用到所有的三角形的正面和背面，第二个参数告诉我们用线来绘制
		//glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
		//填充模式
		glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

		//索引缓冲对象设置缓冲渲染
		//第一个参数指定了我们绘制的模式，这个和glDrawArrays的一样。第二个参数是我们打算绘制顶点的个数，这里填6，也就是说我们一共需要绘制6个顶点。第三个参数是索引的类型，这里是GL_UNSIGNED_INT。最后一个参数里我们可以指定EBO中的偏移量（或者传递一个索引数组，但是这是当你不在使用索引缓冲对象的时候），但是我们会在这里填写0。
		glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
		//glDrawElements(GL_POINT, 6, GL_UNSIGNED_INT, 0);
		//检查并调用事件，交换缓冲
		glfwSwapBuffers(window);
		glfwPollEvents();
	}
	/////////////////////////////////////////////

	glfwTerminate();
	return 0;
}

```
## OpenGL_Learn_ElementaryCourse_Four_Geometric_Translate.cpp
```cpp
#define STB_IMAGE_IMPLEMENTATION
#include<glad.h>
#include<glfw3.h>
#include<iostream>
#include<Shader.h>
#include<stb_image.h>
#define GLM_FORCE_RADIANS  //Bug，居然glm里面没有定义radians的宏
#include<glm/glm.hpp>
#include<glm/gtc/matrix_transform.hpp>
#include<glm/gtc/type_ptr.hpp>

const unsigned int SCR_WIDTH = 800;
const unsigned int SCR_HEIGHT = 600;

//窗口改变函数
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	glViewport(0, 0, width, height);
}

//GLFW的输入控制，返回这个按键是否被按下
void processInput(GLFWwindow* window)
{
	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
	{
		glfwSetWindowShouldClose(window, true);
	}
}

int main()
{
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	////////////////////////////////////////////////////////////////////////////////
	//创建一个窗口对象
	GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);

	//初始化GLAD
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}

	//视口
	//glViewport函数前两个参数控制窗口左下角的位置。
	//第三个和第四个参数控制渲染窗口的宽度和高度（像素）。
	glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);

	//注册函数，当窗口调整大小时调用
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
	///////////////////////////////////////////////////////////////////////////

	//索引缓冲对象、顶点数组对象、顶点缓冲对象
	///////////////////////////////////////////////////////////////////////////
	//LearnOpenGL CN 教程中对于纹理坐标有误
	//左上角(0,0),右下角(1,1)
	float vertices[] = {
		   //位置              //颜色RGBA             //纹理
		 0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f,0.0f,  // 右上角
		 0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f,1.0f,  // 右下角
		-0.5f, -0.5f, 0.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,1.0f,  // 左下角
		-0.5f,  0.5f, 0.0f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f,0.0f   // 左上角
	};

	//索引缓冲对象
	unsigned int indices[] = {
		0,1,2, //第一个三角形
		2,3,0  //第二个三角形
	};

	unsigned int EBO;
	glGenBuffers(1, &EBO);
	//绑定EBO到GL_ELEMENT_ARRAY_BUFFER

	//顶点缓冲对象（Vertex Buffer Objects)
	//使用glGenBuffers函数和一个缓冲ID生成一个VBO对象
	unsigned int VBO;
	glGenBuffers(1, &VBO);

	//顶点数组对象
	unsigned int VAO;
	glGenVertexArrays(1, &VAO);
	//绑定VAO
	glBindVertexArray(VAO);

	//把顶点数组复制到缓冲中供OpenGL使用
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
	glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

	//设置顶点属性指针
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 9 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	//颜色属性
	glVertexAttribPointer(1, 4, GL_FLOAT, GL_FALSE, 9 * sizeof(float), (void*)(3 * sizeof(float)));
	glEnableVertexAttribArray(1);
	//纹理属性
	glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 9 * sizeof(float), (void*)(7 * sizeof(float)));
	glEnableVertexAttribArray(2);
	/////////////////////////////////////////////////////////////////////////////


	///////////////////////////////////////////////////////////////
	//着色器类变量
	//已经封装了顶点着色器、片段着色器
	Shader ourShader("shader.vs", "shader.fs");
	/////////////////////////////////////////////////////////////////////////

	///////////////////////////////////////////////////////////////////
	//图片纹理
	unsigned int ourTexture;
	glGenTextures(1, &ourTexture);
	// 在绑定纹理之前先激活纹理单元
	glActiveTexture(GL_TEXTURE0);
	//绑定纹理
	glBindTexture(GL_TEXTURE_2D, ourTexture);

	//纹理环绕
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	//第一个参数指定了纹理目标；我们使用的是2D纹理，因此纹理目标是GL_TEXTURE_2D。第二个参数需要我们指定设置的选项与应用的纹理轴。我们打算配置的是WRAP选项，并且指定S和T轴。最后一个参数需要我们传递一个环绕方式(Wrapping)，在这个例子中OpenGL会给当前激活的纹理设定纹理环绕方式为GL_MIRRORED_REPEAT。

	//如果我们选择GL_CLAMP_TO_BORDER选项，我们还需要指定一个边缘的颜色。这需要使用glTexParameter函数的fv后缀形式，用GL_TEXTURE_BORDER_COLOR作为它的选项，并且传递一个float数组作为边缘的颜色值：
	//float borderColor[] = { 1.0f,1.0f,0.0f,1.0f };
	//glTexParameterfv(GL_TEXTURE_2D, GL_TEXTURE_BORDER_COLOR, borderColor);

	//纹理过滤
	//缩小Minify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
	//放大Magnify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//多级渐远纹理
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//加载纹理图片
	int width, height, nrChannels;
	//用图像的宽度、高度和颜色通道的个数填充这三个变量。
	unsigned char* data = stbi_load("001.jpg", &width, &height, &nrChannels, 0);

	if (data)
	{
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);
	}
	else
	{
		std::cout << "Failed to load texture" << std::endl;
	}
	stbi_image_free(data);

	//int width, height, nrChannels;
	//unsigned char* data;
	unsigned int faceTexture;
	glGenTextures(1, &faceTexture);
	glActiveTexture(GL_TEXTURE1);
	glBindTexture(GL_TEXTURE_2D, faceTexture);
	//纹理环绕
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_BORDER);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_BORDER);
	//第一个参数指定了纹理目标；我们使用的是2D纹理，因此纹理目标是GL_TEXTURE_2D。第二个参数需要我们指定设置的选项与应用的纹理轴。我们打算配置的是WRAP选项，并且指定S和T轴。最后一个参数需要我们传递一个环绕方式(Wrapping)，在这个例子中OpenGL会给当前激活的纹理设定纹理环绕方式为GL_MIRRORED_REPEAT。

	//如果我们选择GL_CLAMP_TO_BORDER选项，我们还需要指定一个边缘的颜色。这需要使用glTexParameter函数的fv后缀形式，用GL_TEXTURE_BORDER_COLOR作为它的选项，并且传递一个float数组作为边缘的颜色值：
	//float borderColor[] = { 1.0f,1.0f,0.0f,1.0f };
	//glTexParameterfv(GL_TEXTURE_2D, GL_TEXTURE_BORDER_COLOR, borderColor);

	//纹理过滤
	//缩小Minify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	//放大Magnify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//多级渐远纹理
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//加载纹理图片
	//用图像的宽度、高度和颜色通道的个数填充这三个变量。
	data = stbi_load("test2.jpg", &width, &height, &nrChannels, 0);

	if (data)
	{
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);
	}
	else
	{
		std::cout << "Failed to load texture" << std::endl;
	}
	stbi_image_free(data);

	ourShader.use();
	ourShader.setInt("ourTexture", 0);
	ourShader.setInt("faceTexture", 1);

	//////////////////////////////////////////////////////////////////////////////

	//循环渲染
	////////////////////////////////////////////
	while (!glfwWindowShouldClose(window))
	{
		//输入
		processInput(window);

		//渲染指令
		//调用glClear函数来清空屏幕的颜色缓冲，它接受一个缓冲位(Buffer Bit)来指定要清空的缓冲，可能的缓冲位有GL_COLOR_BUFFER_BIT，GL_DEPTH_BUFFER_BIT和GL_STENCIL_BUFFER_BIT。由于现在我们只关心颜色值，所以我们只清空颜色缓冲。
		//我们还调用了glClearColor来设置清空屏幕所用的颜色。当调用glClear函数，清除颜色缓冲之后，整个颜色缓冲都会被填充为glClearColor里所设置的颜色。
		float timeValue = (float)glfwGetTime();
		float redValue = (cos(timeValue) / 2.0f) + 0.5f;
		float greenValue = (sin(timeValue) / 2.0f) + 0.5f;
		float blueValue = (cos(timeValue) / 2.0f) + 0.5f;
		float alphaValue = (sin(timeValue) / 2.0f) + 0.5f;
		float proportionValue= (cos(timeValue) / 2.0f) + 0.5f;
		float translateValue_x = sin(timeValue)/2.0f;
		float translateValue_y = cos(timeValue)/2.0f;
		float rotateValue = 0.05f*timeValue;
		float scaleValue= (cos(timeValue) / 2.0f) + 1.0f;
		glClearColor(0.1f, 0.2f, 0.3f, 1.0f);
		//glClearColor(redValue+0.1f, greenValue+0.2f, blueValue+0.3f, alphaValue);
		glClear(GL_COLOR_BUFFER_BIT);

		//画三角形
		//glUseProgram(shaderProgram);
		//ourShader.use();//激活着色器程序

		//设置uniform值
		//ourShader.setFloat("ourColor", greenValue);
		ourShader.setVec4("ourColor", redValue, greenValue, blueValue, alphaValue);
		ourShader.setFloat("proportion", proportionValue);
		//glBindVertexArray(VAO);
		//纹理
		/*glActiveTexture(GL_TEXTURE0);
		glBindTexture(GL_TEXTURE_2D, ourTexture);
		glActiveTexture(GL_TEXTURE1);
		glBindTexture(GL_TEXTURE_2D, faceTexture);*/

		//线框模式
		//第一个参数表示我们打算将其应用到所有的三角形的正面和背面，第二个参数告诉我们用线来绘制
		//glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
		//填充模式
		glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

		//////////////////////////////////////////////////////////////////////
		//几何变换
		glm::mat4 trans;
		//位移
		trans = glm::translate(trans, glm::vec3(translateValue_x, translateValue_y, 0.0f));
		//vec = trans*vec;
		//旋转
		trans = glm::rotate(trans, glm::degrees(rotateValue), glm::vec3(0.0, 0.0, 1.0));
		//trans = glm::rotate(trans, glm::radians(rotateValue), glm::vec3(0.0, 0.0, 1.0));
		//均匀缩放
		trans = glm::scale(trans, glm::vec3(scaleValue, scaleValue, 0.0));
		unsigned int transformLoc = glGetUniformLocation(ourShader.ID, "transform");
		glUniformMatrix4fv(transformLoc, 1, GL_FALSE, glm::value_ptr(trans));
		/////////////////////////////////////////////////////////////////////////

		//索引缓冲对象设置缓冲渲染
		//第一个参数指定了我们绘制的模式，这个和glDrawArrays的一样。第二个参数是我们打算绘制顶点的个数，这里填6，也就是说我们一共需要绘制6个顶点。第三个参数是索引的类型，这里是GL_UNSIGNED_INT。最后一个参数里我们可以指定EBO中的偏移量（或者传递一个索引数组，但是这是当你不在使用索引缓冲对象的时候），但是我们会在这里填写0。
		glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
		//glDrawElements(GL_POINT, 6, GL_UNSIGNED_INT, 0);
		//检查并调用事件，交换缓冲
		glfwSwapBuffers(window);
		glfwPollEvents();
	}
	/////////////////////////////////////////////

	glfwTerminate();
	return 0;
}

```
## OpenGL_Learn_ElementaryCourse_Five_3DModel.cpp
```cpp
#define STB_IMAGE_IMPLEMENTATION
#include<glad.h>
#include<glfw3.h>
#include<iostream>
#include<Shader.h>
#include<stb_image.h>
#define GLM_FORCE_RADIANS  //Bug，居然glm里面没有定义radians的宏
#include<glm/glm.hpp>
#include<glm/gtc/matrix_transform.hpp>
#include<glm/gtc/type_ptr.hpp>

const unsigned int SCR_WIDTH = 800;
const unsigned int SCR_HEIGHT = 600;

//窗口改变函数
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	glViewport(0, 0, width, height);
}

//GLFW的输入控制，返回这个按键是否被按下
void processInput(GLFWwindow* window)
{
	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
	{
		glfwSetWindowShouldClose(window, true);
	}
}

int main()
{
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	////////////////////////////////////////////////////////////////////////////////
	//创建一个窗口对象
	GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);

	//初始化GLAD
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}

	//视口
	//glViewport函数前两个参数控制窗口左下角的位置。
	//第三个和第四个参数控制渲染窗口的宽度和高度（像素）。
	glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);

	//注册函数，当窗口调整大小时调用
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
	///////////////////////////////////////////////////////////////////////////

	//索引缓冲对象、顶点数组对象、顶点缓冲对象
	///////////////////////////////////////////////////////////////////////////
	//LearnOpenGL CN 教程中对于纹理坐标有误
	//左上角(0,0),右下角(1,1)
	/*float vertices[] = {
		   //位置              //颜色RGBA             //纹理
		 0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f,0.0f,  // 右上角
		 0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f,1.0f,  // 右下角
		-0.5f, -0.5f, 0.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,1.0f,  // 左下角
		-0.5f,  0.5f, 0.0f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f,0.0f   // 左上角
	};*/
	//不作死就不会死！
	float vertices[] = {
		      //位置              //颜色RGBA          //纹理
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,

		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,

		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 0.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 1.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 0.0f,

		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 1.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 1.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,

		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,

		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 0.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f
	};
	//位移向量
	glm::vec3 cubePositions[] = {
		glm::vec3( 0.0f,  0.0f,   0.0f),
		glm::vec3( 2.0f,  5.0f, -15.0f),
		glm::vec3(-1.5f, -2.2f,  -2.5f),
		glm::vec3(-3.8f, -2.0f, -12.3f),
		glm::vec3( 2.4f, -0.4f,  -3.5f),
		glm::vec3(-1.7f,  3.0f,  -7.5f),
		glm::vec3( 1.3f, -2.0f,  -2.5f),
		glm::vec3( 1.5f,  2.0f,  -2.5f),
		glm::vec3( 1.5f,  0.2f,  -1.5f),
		glm::vec3(-1.3f,  1.0f,  -1.5f)
	};
	//索引缓冲对象
	/*unsigned int indices[] = {
		0,1,2, //第一个三角形
		2,3,0  //第二个三角形
	};

	unsigned int EBO;
	glGenBuffers(1, &EBO);*/
	//绑定EBO到GL_ELEMENT_ARRAY_BUFFER

	//顶点缓冲对象（Vertex Buffer Objects)
	//使用glGenBuffers函数和一个缓冲ID生成一个VBO对象
	unsigned int VBO;
	glGenBuffers(1, &VBO);

	//顶点数组对象
	unsigned int VAO;
	glGenVertexArrays(1, &VAO);
	//绑定VAO
	glBindVertexArray(VAO);

	//把顶点数组复制到缓冲中供OpenGL使用
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

	//glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
	//glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

	//设置顶点属性指针
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 9 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	//颜色属性
	glVertexAttribPointer(1, 4, GL_FLOAT, GL_FALSE, 9 * sizeof(float), (void*)(3 * sizeof(float)));
	glEnableVertexAttribArray(1);
	//纹理属性
	glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 9 * sizeof(float), (void*)(7 * sizeof(float)));
	glEnableVertexAttribArray(2);
	/////////////////////////////////////////////////////////////////////////////


	///////////////////////////////////////////////////////////////
	//着色器类变量
	//已经封装了顶点着色器、片段着色器
	Shader ourShader("shader.vs", "shader.fs");
	/////////////////////////////////////////////////////////////////////////

	///////////////////////////////////////////////////////////////////
	//图片纹理
	unsigned int ourTexture;
	glGenTextures(1, &ourTexture);
	// 在绑定纹理之前先激活纹理单元
	glActiveTexture(GL_TEXTURE0);
	//绑定纹理
	glBindTexture(GL_TEXTURE_2D, ourTexture);

	//纹理环绕
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	//第一个参数指定了纹理目标；我们使用的是2D纹理，因此纹理目标是GL_TEXTURE_2D。第二个参数需要我们指定设置的选项与应用的纹理轴。我们打算配置的是WRAP选项，并且指定S和T轴。最后一个参数需要我们传递一个环绕方式(Wrapping)，在这个例子中OpenGL会给当前激活的纹理设定纹理环绕方式为GL_MIRRORED_REPEAT。

	//如果我们选择GL_CLAMP_TO_BORDER选项，我们还需要指定一个边缘的颜色。这需要使用glTexParameter函数的fv后缀形式，用GL_TEXTURE_BORDER_COLOR作为它的选项，并且传递一个float数组作为边缘的颜色值：
	//float borderColor[] = { 1.0f,1.0f,0.0f,1.0f };
	//glTexParameterfv(GL_TEXTURE_2D, GL_TEXTURE_BORDER_COLOR, borderColor);

	//纹理过滤
	//缩小Minify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
	//放大Magnify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//多级渐远纹理
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//加载纹理图片
	int width, height, nrChannels;
	//用图像的宽度、高度和颜色通道的个数填充这三个变量。
	unsigned char* data = stbi_load("test.jpg", &width, &height, &nrChannels, 0);

	if (data)
	{
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);
	}
	else
	{
		std::cout << "Failed to load texture" << std::endl;
	}
	stbi_image_free(data);

	//int width, height, nrChannels;
	//unsigned char* data;
	unsigned int faceTexture;
	glGenTextures(1, &faceTexture);
	glActiveTexture(GL_TEXTURE1);
	glBindTexture(GL_TEXTURE_2D, faceTexture);
	//纹理环绕
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_BORDER);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_BORDER);
	//第一个参数指定了纹理目标；我们使用的是2D纹理，因此纹理目标是GL_TEXTURE_2D。第二个参数需要我们指定设置的选项与应用的纹理轴。我们打算配置的是WRAP选项，并且指定S和T轴。最后一个参数需要我们传递一个环绕方式(Wrapping)，在这个例子中OpenGL会给当前激活的纹理设定纹理环绕方式为GL_MIRRORED_REPEAT。

	//如果我们选择GL_CLAMP_TO_BORDER选项，我们还需要指定一个边缘的颜色。这需要使用glTexParameter函数的fv后缀形式，用GL_TEXTURE_BORDER_COLOR作为它的选项，并且传递一个float数组作为边缘的颜色值：
	//float borderColor[] = { 1.0f,1.0f,0.0f,1.0f };
	//glTexParameterfv(GL_TEXTURE_2D, GL_TEXTURE_BORDER_COLOR, borderColor);

	//纹理过滤
	//缩小Minify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	//放大Magnify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//多级渐远纹理
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//加载纹理图片
	//用图像的宽度、高度和颜色通道的个数填充这三个变量。
	data = stbi_load("test2.jpg", &width, &height, &nrChannels, 0);

	if (data)
	{
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);
	}
	else
	{
		std::cout << "Failed to load texture" << std::endl;
	}
	stbi_image_free(data);

	ourShader.use();
	ourShader.setInt("ourTexture", 0);
	ourShader.setInt("faceTexture", 1);

	//////////////////////////////////////////////////////////////////////////////


	//////////////////////////////////////////////////////////////////////
	//几何变换
	/*glm::mat4 trans;
	//位移
	trans = glm::translate(trans, glm::vec3(0.12f, 0.12f, 0.0f));
	//vec = trans*vec;
	//旋转
	trans = glm::rotate(trans, glm::degrees(1.2f), glm::vec3(0.0, 0.0, 1.0));
	//trans = glm::rotate(trans, glm::radians(rotateValue), glm::vec3(0.0, 0.0, 1.0));
	//均匀缩放
	trans = glm::scale(trans, glm::vec3(0.5, 0.5, 0.0));
	unsigned int transformLoc = glGetUniformLocation(ourShader.ID, "transform");
	glUniformMatrix4fv(transformLoc, 1, GL_FALSE, glm::value_ptr(trans));*/
	/////////////////////////////////////////////////////////////////////////


	//循环渲染
	////////////////////////////////////////////
	while (!glfwWindowShouldClose(window))
	{
		//输入
		processInput(window);

		//渲染指令
		//调用glClear函数来清空屏幕的颜色缓冲，它接受一个缓冲位(Buffer Bit)来指定要清空的缓冲，可能的缓冲位有GL_COLOR_BUFFER_BIT，GL_DEPTH_BUFFER_BIT和GL_STENCIL_BUFFER_BIT。由于现在我们只关心颜色值，所以我们只清空颜色缓冲。
		//我们还调用了glClearColor来设置清空屏幕所用的颜色。当调用glClear函数，清除颜色缓冲之后，整个颜色缓冲都会被填充为glClearColor里所设置的颜色。
		float timeValue = (float)glfwGetTime();
		float redValue = (cos(timeValue) / 2.0f) + 0.5f;
		float greenValue = (sin(timeValue) / 2.0f) + 0.5f;
		float blueValue = (cos(timeValue) / 2.0f) + 0.5f;
		float alphaValue = (sin(timeValue) / 2.0f) + 0.5f;
		float proportionValue= (cos(timeValue) / 2.0f) + 0.5f;
		float translateValue_x = sin(timeValue)/2.0f;
		float translateValue_y = cos(timeValue)/2.0f;
		float rotateValue = 0.05f*timeValue;
		float scaleValue= (cos(timeValue) / 2.0f) + 1.0f;
		glClearColor(0.1f, 0.2f, 0.3f, 1.0f);
		//glClearColor(redValue+0.1f, greenValue+0.2f, blueValue+0.3f, alphaValue);
		glClear(GL_COLOR_BUFFER_BIT);
		//glUseProgram(shaderProgram);
		//ourShader.use();//激活着色器程序

		//设置uniform值
		//ourShader.setFloat("ourColor", greenValue);
		ourShader.setVec4("ourColor", redValue, greenValue, blueValue, alphaValue);
		ourShader.setFloat("proportion", proportionValue);
		//glBindVertexArray(VAO);
		//纹理
		/*glActiveTexture(GL_TEXTURE0);
		glBindTexture(GL_TEXTURE_2D, ourTexture);
		glActiveTexture(GL_TEXTURE1);
		glBindTexture(GL_TEXTURE_2D, faceTexture);*/
		/////////////////////////////////////////////////////////////////////////

		//线框模式
		//第一个参数表示我们打算将其应用到所有的三角形的正面和背面，第二个参数告诉我们用线来绘制
		//glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
		//填充模式
		glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
		//开启深度测试
		glEnable(GL_DEPTH_TEST);
		//清楚深度缓冲
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

		//进入3D
		//建立一个模型矩阵 从局部空间进入世界空间
		//glm::mat4 model;
		//以x为轴旋转
		//model = glm::rotate(model,(float)glfwGetTime()* glm::radians(-55.0f), glm::vec3(0.5f, 1.0f, 0.0f));


		//建立一个观察矩阵 从世界空间的原点上方观察进入观察空间
		glm::mat4 view;
		//向后移动
		view = glm::translate(view, glm::vec3(0.0f, 0.0f, -3.0f));

		//建立一个投影矩阵，从观察空间进入裁剪空间
		glm::mat4 projection;
		projection = glm::perspective(glm::radians(45.0f), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.001f, 100.0f);

		//////////////////////////////
		//正射投影矩阵,左右 底顶 前后
		//glm::ortho(0.0f, 800.0f, 0.0f, 600.0f, 0.1f, 100.0f);
		//透视投影矩阵 视野(角度/弧度) 宽高比(视口宽与高之比) 近、远平面
		//glm::mat4 proj = glm::perspective(glm::radians(45.0f), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.1f, 100.0f);
		/////////////////////////////

		//将矩阵传入着色器
		//恩，又内置了！
		//ourShader.setMat4("model", model);
		ourShader.setMat4("view", view);
		ourShader.setMat4("projection", projection);
		/*int modelLoc = glGetUniformLocation(ourShader.ID, "model");
		glUniformMatrix4fv(modelLoc, 1, GL_FALSE, glm::value_ptr(model));
		int viewLoc = glGetUniformLocation(ourShader.ID, "view");
		glUniformMatrix4fv(viewLoc, 1, GL_FALSE, glm::value_ptr(view));
		int proLoc = glGetUniformLocation(ourShader.ID, "projection");
		glUniformMatrix4fv(proLoc, 1, GL_FALSE, glm::value_ptr(projection));*/

		//////////////////////////////////////////////////////////////////////////

		//////////////////////////////////////////////////////////////////////
		//几何变换
		/*glm::mat4 trans;
		//位移
		trans = glm::translate(trans, glm::vec3(translateValue_x, translateValue_y, 0.0f));
		//vec = trans*vec;
		//旋转
		trans = glm::rotate(trans, glm::degrees(rotateValue), glm::vec3(0.0, 0.0, 1.0));
		//trans = glm::rotate(trans, glm::radians(rotateValue), glm::vec3(0.0, 0.0, 1.0));
		//均匀缩放
		trans = glm::scale(trans, glm::vec3(scaleValue, scaleValue, 0.0));
		unsigned int transformLoc = glGetUniformLocation(ourShader.ID, "transform");
		glUniformMatrix4fv(transformLoc, 1, GL_FALSE, glm::value_ptr(trans));*/
		/////////////////////////////////////////////////////////////////////////



		for (unsigned int i = 0; i < 10; i++)
		{
			glm::mat4 model;
			model = glm::translate(model, cubePositions[i]);
			float angle = 20.0f*i+180.0f;
			if (i!=0)
			{
				model = glm::rotate(model, (float)glfwGetTime()* glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
			}
			else
			{
				model = glm::rotate(model, glm::radians(angle), glm::vec3(0.2f, 0.3f, 1.0f));
			}
			ourShader.setMat4("model", model);
			glDrawArrays(GL_TRIANGLES, 0, 36);
		}
		//glDrawArrays(GL_TRIANGLES, 0, 36);
		//索引缓冲对象设置缓冲渲染
		//第一个参数指定了我们绘制的模式，这个和glDrawArrays的一样。第二个参数是我们打算绘制顶点的个数，这里填6，也就是说我们一共需要绘制6个顶点。第三个参数是索引的类型，这里是GL_UNSIGNED_INT。最后一个参数里我们可以指定EBO中的偏移量（或者传递一个索引数组，但是这是当你不在使用索引缓冲对象的时候），但是我们会在这里填写0。
		//glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
		//检查并调用事件，交换缓冲
		glfwSwapBuffers(window);
		glfwPollEvents();
	}
	/////////////////////////////////////////////

	glfwTerminate();
	return 0;
}
```
## OpenGL_Learn_ElementaryCourse_Six_Camera_Origin.cpp
```cpp
#define STB_IMAGE_IMPLEMENTATION
#include<glad.h>
#include<glfw3.h>
#include<iostream>
#include<Shader.h>
#include<stb_image.h>
#define GLM_FORCE_RADIANS  //Bug，居然glm里面没有定义radians的宏
#include<glm/glm.hpp>
#include<glm/gtc/matrix_transform.hpp>
#include<glm/gtc/type_ptr.hpp>

const unsigned int SCR_WIDTH = 800;
const unsigned int SCR_HEIGHT = 600;

///////////////////////////////////////////////////////////////////
//摄像机
//1.摄像机位置
glm::vec3 cameraPos = glm::vec3(0.0f, 0.0f, 3.0f);

//2.摄像机方向
glm::vec3 cameraTarget = glm::vec3(0.0f, 0.0f, 0.0f);
//与摄像机实际指向的方向是正好相反的,方向向量
glm::vec3 cameraDirection = glm::normalize(cameraPos - cameraTarget);//这个向量减法很牵强，除非cameraTarget不是原点才有意义吧？

																	 //3.右轴
glm::vec3 up = glm::vec3(0.0f, 1.0f, 0.0f);//这不就是直接定义了上轴吗！！！！
										   //计算叉乘
glm::vec3 cameraRight = glm::normalize(glm::cross(up, cameraDirection));
//std::cout << cameraRight.x <<std::endl<< cameraRight.y <<std::endl<< cameraRight.z <<std:: endl;

//4.上轴
glm::vec3 cameraUp = glm::normalize(glm::cross(cameraDirection, cameraRight));
//std::cout << cameraUp.x << std::endl << cameraUp.y << std::endl << cameraUp.z << std::endl;

glm::vec3 cameraFront = glm::vec3(0.0f, 0.0f, -1.0f);
////////////////////////////////////////////////////////////////




//窗口改变函数
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	glViewport(0, 0, width, height);
}


float deltaTime = 0.0f;//当前帧与上一帧的时间差
float lastFrame = 0.0f;//上一帧的时间

//GLFW的输入控制，返回这个按键是否被按下
void processInput(GLFWwindow* window)
{
	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
	{
		glfwSetWindowShouldClose(window, true);
	}

	float cameraSpeed = 2.5f*deltaTime;
	if (glfwGetKey(window, GLFW_KEY_UP) == GLFW_PRESS)
	{
		cameraPos += cameraSpeed*cameraFront;
	}
	if (glfwGetKey(window, GLFW_KEY_DOWN) == GLFW_PRESS)
	{
		cameraPos -= cameraSpeed*cameraFront;
	}
	if (glfwGetKey(window, GLFW_KEY_LEFT) == GLFW_PRESS)
	{
		cameraPos -= cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
	}
	if (glfwGetKey(window, GLFW_KEY_RIGHT) == GLFW_PRESS)
	{
		cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
	}
}

float lastX = 400, lastY = 300;
float yaw = 0.0f;
float pitch = 0.0f;
bool firstMouse = true;
void mouse_callback(GLFWwindow* window, double xpos, double ypos)
{
	if (firstMouse)
	{
		lastX = (float)xpos;
		lastY = (float)ypos;
		firstMouse = false;
	}
	float xoffset = (float)xpos - lastX;
	float yoffset = lastY - (float)ypos; //Pitch俯瞰

	lastX = (float)xpos;
	lastY = (float)ypos;
	float sensitivity = 0.05f;
	xoffset *= sensitivity;
	yoffset *= sensitivity;

	yaw += xoffset;
	pitch += yoffset;

	if (pitch > 89.0f)
	{
		pitch = 89.0f;
	}
	if (pitch < -89.0f)
	{
		pitch = -89.0f;
	}
	glm::vec3 front;
	front.x = cos(glm::radians(pitch))*cos(glm::radians(yaw));
	front.y = sin(glm::radians(pitch));
	front.z = cos(glm::radians(pitch))*sin(glm::radians(yaw));
	cameraFront = glm::normalize(front);
}

float fov = 45.0f;
void scroll_callback(GLFWwindow* window, double xoffset, double yoffset)
{
	if (fov >= 0.1&&fov <= 45.0f)
	{
		fov -= (float)yoffset;
	}
	if (fov <= 0.1f)
	{
		fov = 0.1f;
	}
	if (fov >= 45.0f)
	{
		fov = 45.0f;
	}
}

int main()
{
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	////////////////////////////////////////////////////////////////////////////////
	//创建一个窗口对象
	GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);

	//初始化GLAD
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}

	//视口
	//glViewport函数前两个参数控制窗口左下角的位置。
	//第三个和第四个参数控制渲染窗口的宽度和高度（像素）。
	glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);

	//注册函数，当窗口调整大小时调用
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
	///////////////////////////////////////////////////////////////////////////

	//隐藏光标
	glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);

	//监听鼠标移动事件
	glfwSetCursorPosCallback(window, mouse_callback);

	//鼠标滚轮
	glfwSetScrollCallback(window, scroll_callback);

	//索引缓冲对象、顶点数组对象、顶点缓冲对象
	///////////////////////////////////////////////////////////////////////////
	//LearnOpenGL CN 教程中对于纹理坐标有误
	//左上角(0,0),右下角(1,1)
	/*float vertices[] = {
	//位置              //颜色RGBA             //纹理
	0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f,0.0f,  // 右上角
	0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f,1.0f,  // 右下角
	-0.5f, -0.5f, 0.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,1.0f,  // 左下角
	-0.5f,  0.5f, 0.0f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f,0.0f   // 左上角
	};*/
	//不作死就不会死！
	float vertices[] = {
		//位置              //颜色RGBA          //纹理
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,

		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,

		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 0.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 1.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 0.0f,

		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 1.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 1.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,

		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,

		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 0.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f
	};
	//位移向量
	glm::vec3 cubePositions[] = {
		glm::vec3(0.0f,  0.0f,   0.0f),
		glm::vec3(2.0f,  5.0f, -15.0f),
		glm::vec3(-1.5f, -2.2f,  -2.5f),
		glm::vec3(-3.8f, -2.0f, -12.3f),
		glm::vec3(2.4f, -0.4f,  -3.5f),
		glm::vec3(-1.7f,  3.0f,  -7.5f),
		glm::vec3(1.3f, -2.0f,  -2.5f),
		glm::vec3(1.5f,  2.0f,  -2.5f),
		glm::vec3(1.5f,  0.2f,  -1.5f),
		glm::vec3(-1.3f,  1.0f,  -1.5f)
	};
	//索引缓冲对象
	/*unsigned int indices[] = {
	0,1,2, //第一个三角形
	2,3,0  //第二个三角形
	};

	unsigned int EBO;
	glGenBuffers(1, &EBO);*/
	//绑定EBO到GL_ELEMENT_ARRAY_BUFFER

	//顶点缓冲对象（Vertex Buffer Objects)
	//使用glGenBuffers函数和一个缓冲ID生成一个VBO对象
	unsigned int VBO;
	glGenBuffers(1, &VBO);

	//顶点数组对象
	unsigned int VAO;
	glGenVertexArrays(1, &VAO);
	//绑定VAO
	glBindVertexArray(VAO);

	//把顶点数组复制到缓冲中供OpenGL使用
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

	//glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
	//glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

	//设置顶点属性指针
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 9 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	//颜色属性
	glVertexAttribPointer(1, 4, GL_FLOAT, GL_FALSE, 9 * sizeof(float), (void*)(3 * sizeof(float)));
	glEnableVertexAttribArray(1);
	//纹理属性
	glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 9 * sizeof(float), (void*)(7 * sizeof(float)));
	glEnableVertexAttribArray(2);
	/////////////////////////////////////////////////////////////////////////////


	///////////////////////////////////////////////////////////////
	//着色器类变量
	//已经封装了顶点着色器、片段着色器
	Shader ourShader("shader.vs", "shader.fs");
	/////////////////////////////////////////////////////////////////////////

	///////////////////////////////////////////////////////////////////
	//图片纹理
	unsigned int ourTexture;
	glGenTextures(1, &ourTexture);
	// 在绑定纹理之前先激活纹理单元
	glActiveTexture(GL_TEXTURE0);
	//绑定纹理
	glBindTexture(GL_TEXTURE_2D, ourTexture);

	//纹理环绕
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	//第一个参数指定了纹理目标；我们使用的是2D纹理，因此纹理目标是GL_TEXTURE_2D。第二个参数需要我们指定设置的选项与应用的纹理轴。我们打算配置的是WRAP选项，并且指定S和T轴。最后一个参数需要我们传递一个环绕方式(Wrapping)，在这个例子中OpenGL会给当前激活的纹理设定纹理环绕方式为GL_MIRRORED_REPEAT。

	//如果我们选择GL_CLAMP_TO_BORDER选项，我们还需要指定一个边缘的颜色。这需要使用glTexParameter函数的fv后缀形式，用GL_TEXTURE_BORDER_COLOR作为它的选项，并且传递一个float数组作为边缘的颜色值：
	//float borderColor[] = { 1.0f,1.0f,0.0f,1.0f };
	//glTexParameterfv(GL_TEXTURE_2D, GL_TEXTURE_BORDER_COLOR, borderColor);

	//纹理过滤
	//缩小Minify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
	//放大Magnify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//多级渐远纹理
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//加载纹理图片
	int width, height, nrChannels;
	//用图像的宽度、高度和颜色通道的个数填充这三个变量。
	unsigned char* data = stbi_load("test.jpg", &width, &height, &nrChannels, 0);

	if (data)
	{
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);
	}
	else
	{
		std::cout << "Failed to load texture" << std::endl;
	}
	stbi_image_free(data);

	//int width, height, nrChannels;
	//unsigned char* data;
	unsigned int faceTexture;
	glGenTextures(1, &faceTexture);
	glActiveTexture(GL_TEXTURE1);
	glBindTexture(GL_TEXTURE_2D, faceTexture);
	//纹理环绕
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_BORDER);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_BORDER);
	//第一个参数指定了纹理目标；我们使用的是2D纹理，因此纹理目标是GL_TEXTURE_2D。第二个参数需要我们指定设置的选项与应用的纹理轴。我们打算配置的是WRAP选项，并且指定S和T轴。最后一个参数需要我们传递一个环绕方式(Wrapping)，在这个例子中OpenGL会给当前激活的纹理设定纹理环绕方式为GL_MIRRORED_REPEAT。

	//如果我们选择GL_CLAMP_TO_BORDER选项，我们还需要指定一个边缘的颜色。这需要使用glTexParameter函数的fv后缀形式，用GL_TEXTURE_BORDER_COLOR作为它的选项，并且传递一个float数组作为边缘的颜色值：
	//float borderColor[] = { 1.0f,1.0f,0.0f,1.0f };
	//glTexParameterfv(GL_TEXTURE_2D, GL_TEXTURE_BORDER_COLOR, borderColor);

	//纹理过滤
	//缩小Minify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	//放大Magnify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//多级渐远纹理
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//加载纹理图片
	//用图像的宽度、高度和颜色通道的个数填充这三个变量。
	data = stbi_load("test2.jpg", &width, &height, &nrChannels, 0);

	if (data)
	{
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);
	}
	else
	{
		std::cout << "Failed to load texture" << std::endl;
	}
	stbi_image_free(data);

	ourShader.use();
	ourShader.setInt("ourTexture", 0);
	ourShader.setInt("faceTexture", 1);

	//////////////////////////////////////////////////////////////////////////////


	//////////////////////////////////////////////////////////////////////
	//几何变换
	/*glm::mat4 trans;
	//位移
	trans = glm::translate(trans, glm::vec3(0.12f, 0.12f, 0.0f));
	//vec = trans*vec;
	//旋转
	trans = glm::rotate(trans, glm::degrees(1.2f), glm::vec3(0.0, 0.0, 1.0));
	//trans = glm::rotate(trans, glm::radians(rotateValue), glm::vec3(0.0, 0.0, 1.0));
	//均匀缩放
	trans = glm::scale(trans, glm::vec3(0.5, 0.5, 0.0));
	unsigned int transformLoc = glGetUniformLocation(ourShader.ID, "transform");
	glUniformMatrix4fv(transformLoc, 1, GL_FALSE, glm::value_ptr(trans));*/
	/////////////////////////////////////////////////////////////////////////




	//循环渲染
	////////////////////////////////////////////
	while (!glfwWindowShouldClose(window))
	{
		//输入
		processInput(window);

		//渲染指令
		//调用glClear函数来清空屏幕的颜色缓冲，它接受一个缓冲位(Buffer Bit)来指定要清空的缓冲，可能的缓冲位有GL_COLOR_BUFFER_BIT，GL_DEPTH_BUFFER_BIT和GL_STENCIL_BUFFER_BIT。由于现在我们只关心颜色值，所以我们只清空颜色缓冲。
		//我们还调用了glClearColor来设置清空屏幕所用的颜色。当调用glClear函数，清除颜色缓冲之后，整个颜色缓冲都会被填充为glClearColor里所设置的颜色。
		float timeValue = (float)glfwGetTime();
		float redValue = (cos(timeValue) / 2.0f) + 0.5f;
		float greenValue = (sin(timeValue) / 2.0f) + 0.5f;
		float blueValue = (cos(timeValue) / 2.0f) + 0.5f;
		float alphaValue = (sin(timeValue) / 2.0f) + 0.5f;
		float proportionValue = (cos(timeValue) / 2.0f) + 0.5f;
		float translateValue_x = sin(timeValue) / 2.0f;
		float translateValue_y = cos(timeValue) / 2.0f;
		float rotateValue = 0.05f*timeValue;
		float scaleValue = (cos(timeValue) / 2.0f) + 1.0f;

		float currentFrame = (float)glfwGetTime();
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;

		glClearColor(0.1f, 0.2f, 0.3f, 1.0f);
		//glClearColor(redValue+0.1f, greenValue+0.2f, blueValue+0.3f, alphaValue);
		glClear(GL_COLOR_BUFFER_BIT);
		//glUseProgram(shaderProgram);
		//ourShader.use();//激活着色器程序

		//设置uniform值
		//ourShader.setFloat("ourColor", greenValue);
		ourShader.setVec4("ourColor", redValue, greenValue, blueValue, alphaValue);
		ourShader.setFloat("proportion", proportionValue);

		/////////////////////////////////////////////////////////////////////////
		//线框模式
		//第一个参数表示我们打算将其应用到所有的三角形的正面和背面，第二个参数告诉我们用线来绘制
		//glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
		//填充模式
		glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
		//开启深度测试
		glEnable(GL_DEPTH_TEST);
		//清楚深度缓冲
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

		//进入3D
		//建立一个模型矩阵 从局部空间进入世界空间
		//glm::mat4 model;
		//以x为轴旋转
		//model = glm::rotate(model,(float)glfwGetTime()* glm::radians(-55.0f), glm::vec3(0.5f, 1.0f, 0.0f));


		//建立一个观察矩阵 从世界空间的原点上方观察进入观察空间
		//glm::mat4 view;
		//向后移动
		//view = glm::translate(view, glm::vec3(0.0f, 0.0f, -3.0f));
		//LookAt
		//glm::mat4 view;
		//view = glm::lookAt(cameraPos, cameraTarget, cameraUp);

		float radius = 10.0f;
		float camX = (float)sin(glfwGetTime())*radius;
		float camZ = (float)cos(glfwGetTime())*radius;
		glm::mat4 view;
		view = glm::lookAt(cameraPos, cameraPos+cameraFront, cameraUp);
		//建立一个投影矩阵，从观察空间进入裁剪空间
		glm::mat4 projection;
		projection = glm::perspective(glm::radians(fov), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.001f, 100.0f);

		//////////////////////////////
		//正射投影矩阵,左右 底顶 前后
		//glm::ortho(0.0f, 800.0f, 0.0f, 600.0f, 0.1f, 100.0f);
		//透视投影矩阵 视野(角度/弧度) 宽高比(视口宽与高之比) 近、远平面
		//glm::mat4 proj = glm::perspective(glm::radians(45.0f), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.1f, 100.0f);
		/////////////////////////////

		//将矩阵传入着色器
		//恩，又内置了！
		//ourShader.setMat4("model", model);
		ourShader.setMat4("view", view);
		ourShader.setMat4("projection", projection);
		/*int modelLoc = glGetUniformLocation(ourShader.ID, "model");
		glUniformMatrix4fv(modelLoc, 1, GL_FALSE, glm::value_ptr(model));
		int viewLoc = glGetUniformLocation(ourShader.ID, "view");
		glUniformMatrix4fv(viewLoc, 1, GL_FALSE, glm::value_ptr(view));
		int proLoc = glGetUniformLocation(ourShader.ID, "projection");
		glUniformMatrix4fv(proLoc, 1, GL_FALSE, glm::value_ptr(projection));*/

		//////////////////////////////////////////////////////////////////////////

		//////////////////////////////////////////////////////////////////////
		//几何变换
		/*glm::mat4 trans;
		//位移
		trans = glm::translate(trans, glm::vec3(translateValue_x, translateValue_y, 0.0f));
		//vec = trans*vec;
		//旋转
		trans = glm::rotate(trans, glm::degrees(rotateValue), glm::vec3(0.0, 0.0, 1.0));
		//trans = glm::rotate(trans, glm::radians(rotateValue), glm::vec3(0.0, 0.0, 1.0));
		//均匀缩放
		trans = glm::scale(trans, glm::vec3(scaleValue, scaleValue, 0.0));
		unsigned int transformLoc = glGetUniformLocation(ourShader.ID, "transform");
		glUniformMatrix4fv(transformLoc, 1, GL_FALSE, glm::value_ptr(trans));*/
		/////////////////////////////////////////////////////////////////////////



		for (unsigned int i = 0; i < 10; i++)
		{
			glm::mat4 model;
			model = glm::translate(model, cubePositions[i]);
			float angle =(float)pow(-1,i)* (20.0f*i + 180.0f);
			/*if (i != 0)
			{
				model = glm::rotate(model, (float)glfwGetTime()* glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
			}
			else
			{
				model = glm::rotate(model, glm::radians(angle), glm::vec3(0.2f, 0.3f, 1.0f));
			}*/
			model = glm::rotate(model, /*(float)glfwGetTime()**/ glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
			ourShader.setMat4("model", model);
			glDrawArrays(GL_TRIANGLES, 0, 36);
		}
		//glDrawArrays(GL_TRIANGLES, 0, 36);
		//索引缓冲对象设置缓冲渲染
		//第一个参数指定了我们绘制的模式，这个和glDrawArrays的一样。第二个参数是我们打算绘制顶点的个数，这里填6，也就是说我们一共需要绘制6个顶点。第三个参数是索引的类型，这里是GL_UNSIGNED_INT。最后一个参数里我们可以指定EBO中的偏移量（或者传递一个索引数组，但是这是当你不在使用索引缓冲对象的时候），但是我们会在这里填写0。
		//glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
		//检查并调用事件，交换缓冲
		glfwSwapBuffers(window);
		glfwPollEvents();
	}
	/////////////////////////////////////////////

	glfwTerminate();
	return 0;
}
```
## OpenGL_Learn_ElementaryCourse_Six_Camera_Class.cpp
```cpp
#define STB_IMAGE_IMPLEMENTATION
#include<glad.h>
#include<glfw3.h>
#include<iostream>
#include<Shader.h>
#include<Camera.h>
#include<stb_image.h>
#define GLM_FORCE_RADIANS  //Bug，居然glm里面没有定义radians的宏
#include<glm/glm.hpp>
#include<glm/gtc/matrix_transform.hpp>
#include<glm/gtc/type_ptr.hpp>

const unsigned int SCR_WIDTH = 800;
const unsigned int SCR_HEIGHT = 600;

Camera camera(glm::vec3(0.0f, 0.0f, 3.0f));

float lastX = 400, lastY = 300;
float yaw = 0.0f;
float pitch = 0.0f;
bool firstMouse = true;

float deltaTime = 0.0f;//当前帧与上一帧的时间差
float lastFrame = 0.0f;//上一帧的时间

//窗口改变函数
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	glViewport(0, 0, width, height);
}

//GLFW的输入控制，返回这个按键是否被按下
void processInput(GLFWwindow* window)
{
	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
	{
		glfwSetWindowShouldClose(window, true);
	}

	//float cameraSpeed = 2.5f*deltaTime;
	if (glfwGetKey(window, GLFW_KEY_UP) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*cameraFront;
		camera.ProcessKeyboard(FORWARD, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_DOWN) == GLFW_PRESS)
	{
		//cameraPos -= cameraSpeed*cameraFront;
		camera.ProcessKeyboard(BACKWARD, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_LEFT) == GLFW_PRESS)
	{
		//cameraPos -= cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(LEFT, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_RIGHT) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(RIGHT, deltaTime);
	}
}


void mouse_callback(GLFWwindow* window, double xpos, double ypos)
{
	if (firstMouse)
	{
		lastX = (float)xpos;
		lastY = (float)ypos;
		firstMouse = false;
	}
	float xoffset = (float)xpos - lastX;
	float yoffset = lastY - (float)ypos; //Pitch俯瞰

	lastX = (float)xpos;
	lastY = (float)ypos;

	camera.ProcessMouseMovement(xoffset,yoffset,true);

}

//float fov = 45.0f;
void scroll_callback(GLFWwindow* window, double xoffset, double yoffset)
{
	camera.ProcessMouseScroll((float)yoffset);
}

int main()
{
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	////////////////////////////////////////////////////////////////////////////////
	//创建一个窗口对象
	GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);

	//初始化GLAD
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}

	//视口
	//glViewport函数前两个参数控制窗口左下角的位置。
	//第三个和第四个参数控制渲染窗口的宽度和高度（像素）。
	glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);

	//注册函数，当窗口调整大小时调用
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
	///////////////////////////////////////////////////////////////////////////

	//隐藏光标
	glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);

	//监听鼠标移动事件
	glfwSetCursorPosCallback(window, mouse_callback);

	//鼠标滚轮
	glfwSetScrollCallback(window, scroll_callback);

	//索引缓冲对象、顶点数组对象、顶点缓冲对象
	///////////////////////////////////////////////////////////////////////////
	float vertices[] = {
		//位置              //颜色RGBA          //纹理
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,

		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,

		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 0.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 1.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 0.0f,

		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 1.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 1.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,

		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,

		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 0.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f
	};
	//位移向量
	glm::vec3 cubePositions[] = {
		glm::vec3(0.0f,  0.0f,   0.0f),
		glm::vec3(2.0f,  5.0f, -15.0f),
		glm::vec3(-1.5f, -2.2f,  -2.5f),
		glm::vec3(-3.8f, -2.0f, -12.3f),
		glm::vec3(2.4f, -0.4f,  -3.5f),
		glm::vec3(-1.7f,  3.0f,  -7.5f),
		glm::vec3(1.3f, -2.0f,  -2.5f),
		glm::vec3(1.5f,  2.0f,  -2.5f),
		glm::vec3(1.5f,  0.2f,  -1.5f),
		glm::vec3(-1.3f,  1.0f,  -1.5f)
	};


	unsigned int EBO;
	glGenBuffers(1, &EBO);
	//绑定EBO到GL_ELEMENT_ARRAY_BUFFER

	//顶点缓冲对象（Vertex Buffer Objects)
	//使用glGenBuffers函数和一个缓冲ID生成一个VBO对象
	unsigned int VBO;
	glGenBuffers(1, &VBO);

	//顶点数组对象
	unsigned int VAO;
	glGenVertexArrays(1, &VAO);
	//绑定VAO
	glBindVertexArray(VAO);

	//把顶点数组复制到缓冲中供OpenGL使用
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

	//glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
	//glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

	//设置顶点属性指针
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 9 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	//颜色属性
	glVertexAttribPointer(1, 4, GL_FLOAT, GL_FALSE, 9 * sizeof(float), (void*)(3 * sizeof(float)));
	glEnableVertexAttribArray(1);
	//纹理属性
	glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 9 * sizeof(float), (void*)(7 * sizeof(float)));
	glEnableVertexAttribArray(2);
	/////////////////////////////////////////////////////////////////////////////


	///////////////////////////////////////////////////////////////
	//着色器类变量
	//已经封装了顶点着色器、片段着色器
	Shader ourShader("shader.vs", "shader.fs");
	/////////////////////////////////////////////////////////////////////////

	///////////////////////////////////////////////////////////////////
	//图片纹理
	unsigned int ourTexture;
	glGenTextures(1, &ourTexture);
	// 在绑定纹理之前先激活纹理单元
	glActiveTexture(GL_TEXTURE0);
	//绑定纹理
	glBindTexture(GL_TEXTURE_2D, ourTexture);

	//纹理环绕
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	//第一个参数指定了纹理目标；我们使用的是2D纹理，因此纹理目标是GL_TEXTURE_2D。第二个参数需要我们指定设置的选项与应用的纹理轴。我们打算配置的是WRAP选项，并且指定S和T轴。最后一个参数需要我们传递一个环绕方式(Wrapping)，在这个例子中OpenGL会给当前激活的纹理设定纹理环绕方式为GL_MIRRORED_REPEAT。

	//如果我们选择GL_CLAMP_TO_BORDER选项，我们还需要指定一个边缘的颜色。这需要使用glTexParameter函数的fv后缀形式，用GL_TEXTURE_BORDER_COLOR作为它的选项，并且传递一个float数组作为边缘的颜色值：
	//float borderColor[] = { 1.0f,1.0f,0.0f,1.0f };
	//glTexParameterfv(GL_TEXTURE_2D, GL_TEXTURE_BORDER_COLOR, borderColor);

	//纹理过滤
	//缩小Minify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
	//放大Magnify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//多级渐远纹理
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//加载纹理图片
	int width, height, nrChannels;
	//用图像的宽度、高度和颜色通道的个数填充这三个变量。
	unsigned char* data = stbi_load("test.jpg", &width, &height, &nrChannels, 0);

	if (data)
	{
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);
	}
	else
	{
		std::cout << "Failed to load texture" << std::endl;
	}
	stbi_image_free(data);

	//int width, height, nrChannels;
	//unsigned char* data;
	unsigned int faceTexture;
	glGenTextures(1, &faceTexture);
	glActiveTexture(GL_TEXTURE1);
	glBindTexture(GL_TEXTURE_2D, faceTexture);
	//纹理环绕
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_BORDER);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_BORDER);
	//第一个参数指定了纹理目标；我们使用的是2D纹理，因此纹理目标是GL_TEXTURE_2D。第二个参数需要我们指定设置的选项与应用的纹理轴。我们打算配置的是WRAP选项，并且指定S和T轴。最后一个参数需要我们传递一个环绕方式(Wrapping)，在这个例子中OpenGL会给当前激活的纹理设定纹理环绕方式为GL_MIRRORED_REPEAT。

	//纹理过滤
	//缩小Minify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	//放大Magnify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//多级渐远纹理
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//加载纹理图片
	//用图像的宽度、高度和颜色通道的个数填充这三个变量。
	data = stbi_load("test2.jpg", &width, &height, &nrChannels, 0);

	if (data)
	{
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);
	}
	else
	{
		std::cout << "Failed to load texture" << std::endl;
	}
	stbi_image_free(data);

	ourShader.use();
	ourShader.setInt("ourTexture", 0);
	ourShader.setInt("faceTexture", 1);

	//////////////////////////////////////////////////////////////////////////////

	//循环渲染
	////////////////////////////////////////////
	while (!glfwWindowShouldClose(window))
	{
		//输入
		processInput(window);

		//渲染指令
		//调用glClear函数来清空屏幕的颜色缓冲，它接受一个缓冲位(Buffer Bit)来指定要清空的缓冲，可能的缓冲位有GL_COLOR_BUFFER_BIT，GL_DEPTH_BUFFER_BIT和GL_STENCIL_BUFFER_BIT。由于现在我们只关心颜色值，所以我们只清空颜色缓冲。
		//我们还调用了glClearColor来设置清空屏幕所用的颜色。当调用glClear函数，清除颜色缓冲之后，整个颜色缓冲都会被填充为glClearColor里所设置的颜色。
		float timeValue = (float)glfwGetTime();
		float redValue = (cos(timeValue) / 2.0f) + 0.5f;
		float greenValue = (sin(timeValue) / 2.0f) + 0.5f;
		float blueValue = (cos(timeValue) / 2.0f) + 0.5f;
		float alphaValue = (sin(timeValue) / 2.0f) + 0.5f;
		float proportionValue = (cos(timeValue) / 2.0f) + 0.5f;
		float translateValue_x = sin(timeValue) / 2.0f;
		float translateValue_y = cos(timeValue) / 2.0f;
		float rotateValue = 0.05f*timeValue;
		float scaleValue = (cos(timeValue) / 2.0f) + 1.0f;

		float currentFrame = (float)glfwGetTime();
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;

		glClearColor(0.1f, 0.2f, 0.3f, 1.0f);
		//glClearColor(redValue+0.1f, greenValue+0.2f, blueValue+0.3f, alphaValue);
		glClear(GL_COLOR_BUFFER_BIT);
		//glUseProgram(shaderProgram);
		//ourShader.use();//激活着色器程序

		//设置uniform值
		//ourShader.setFloat("ourColor", greenValue);
		ourShader.setVec4("ourColor", redValue, greenValue, blueValue, alphaValue);
		ourShader.setFloat("proportion", proportionValue);

		/////////////////////////////////////////////////////////////////////////
		//线框模式
		//第一个参数表示我们打算将其应用到所有的三角形的正面和背面，第二个参数告诉我们用线来绘制
		//glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
		//填充模式
		glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
		//开启深度测试
		glEnable(GL_DEPTH_TEST);
		//清楚深度缓冲
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

		//进入3D
		float radius = 10.0f;
		float camX = (float)sin(glfwGetTime())*radius;
		float camZ = (float)cos(glfwGetTime())*radius;
		glm::mat4 view;
		//view = glm::lookAt(cameraPos, cameraPos+cameraFront, cameraUp);
		view = camera.GetViewMatrix();
		//建立一个投影矩阵，从观察空间进入裁剪空间
		glm::mat4 projection;
		//projection = glm::perspective(glm::radians(fov), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.001f, 100.0f);
		projection= glm::perspective(glm::radians(camera.GetZoom()), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.001f, 100.0f);


		//将矩阵传入着色器
		//恩，又内置了！
		//ourShader.setMat4("model", model);
		ourShader.setMat4("view", view);
		ourShader.setMat4("projection", projection);

		//////////////////////////////////////////////////////////////////////////

		for (unsigned int i = 0; i < 10; i++)
		{
			glm::mat4 model;
			model = glm::translate(model, cubePositions[i]);
			float angle =(float)pow(-1,i)* (20.0f*i + 180.0f);
			/*if (i != 0)
			{
				model = glm::rotate(model, (float)glfwGetTime()* glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
			}
			else
			{
				model = glm::rotate(model, glm::radians(angle), glm::vec3(0.2f, 0.3f, 1.0f));
			}*/
			model = glm::rotate(model, (float)glfwGetTime()* glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
			ourShader.setMat4("model", model);
			glDrawArrays(GL_TRIANGLES, 0, 36);
		}
		//glDrawArrays(GL_TRIANGLES, 0, 36);
		//索引缓冲对象设置缓冲渲染
		//第一个参数指定了我们绘制的模式，这个和glDrawArrays的一样。第二个参数是我们打算绘制顶点的个数，这里填6，也就是说我们一共需要绘制6个顶点。第三个参数是索引的类型，这里是GL_UNSIGNED_INT。最后一个参数里我们可以指定EBO中的偏移量（或者传递一个索引数组，但是这是当你不在使用索引缓冲对象的时候），但是我们会在这里填写0。
		//glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
		//检查并调用事件，交换缓冲
		glfwSwapBuffers(window);
		glfwPollEvents();
	}
	/////////////////////////////////////////////

	glfwTerminate();
	return 0;
}
```
## OpenGL_Learn_ElementaryCourse_Combined.cpp
```cpp
#define STB_IMAGE_IMPLEMENTATION
#include<glad.h>
#include<glfw3.h>
#include<iostream>
#include<Shader.h>
#include<Camera.h>
#include<stb_image.h>
#define GLM_FORCE_RADIANS  //Bug，居然glm里面没有定义radians的宏
#include<glm/glm.hpp>
#include<glm/gtc/matrix_transform.hpp>
#include<glm/gtc/type_ptr.hpp>

const unsigned int SCR_WIDTH = 800;
const unsigned int SCR_HEIGHT = 600;

/*///////////////////////////////////////////////////////////////////
//摄像机
//1.摄像机位置
glm::vec3 cameraPos = glm::vec3(0.0f, 0.0f, 3.0f);

//2.摄像机方向
glm::vec3 cameraTarget = glm::vec3(0.0f, 0.0f, 0.0f);
//与摄像机实际指向的方向是正好相反的,方向向量
glm::vec3 cameraDirection = glm::normalize(cameraPos - cameraTarget);//这个向量减法很牵强，除非cameraTarget不是原点才有意义吧？

																	 //3.右轴
glm::vec3 up = glm::vec3(0.0f, 1.0f, 0.0f);//这不就是直接定义了上轴吗！！！！
										   //计算叉乘
glm::vec3 cameraRight = glm::normalize(glm::cross(up, cameraDirection));
//std::cout << cameraRight.x <<std::endl<< cameraRight.y <<std::endl<< cameraRight.z <<std:: endl;

//4.上轴
glm::vec3 cameraUp = glm::normalize(glm::cross(cameraDirection, cameraRight));
//std::cout << cameraUp.x << std::endl << cameraUp.y << std::endl << cameraUp.z << std::endl;

glm::vec3 cameraFront = glm::vec3(0.0f, 0.0f, -1.0f);*/
////////////////////////////////////////////////////////////////

Camera camera(glm::vec3(0.0f, 0.0f, 3.0f));

float lastX = 400, lastY = 300;
float yaw = 0.0f;
float pitch = 0.0f;
bool firstMouse = true;

float deltaTime = 0.0f;//当前帧与上一帧的时间差
float lastFrame = 0.0f;//上一帧的时间

//窗口改变函数
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	glViewport(0, 0, width, height);
}

//GLFW的输入控制，返回这个按键是否被按下
void processInput(GLFWwindow* window)
{
	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
	{
		glfwSetWindowShouldClose(window, true);
	}

	//float cameraSpeed = 2.5f*deltaTime;
	if (glfwGetKey(window, GLFW_KEY_UP) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*cameraFront;
		camera.ProcessKeyboard(FORWARD, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_DOWN) == GLFW_PRESS)
	{
		//cameraPos -= cameraSpeed*cameraFront;
		camera.ProcessKeyboard(BACKWARD, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_LEFT) == GLFW_PRESS)
	{
		//cameraPos -= cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(LEFT, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_RIGHT) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(RIGHT, deltaTime);
	}

	//Camera Roll
	if (glfwGetKey(window, GLFW_KEY_KP_ADD) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(ROLL_ADD, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_KP_SUBTRACT) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(ROLL_REDUCE, deltaTime);
	}
}


void mouse_callback(GLFWwindow* window, double xpos, double ypos)
{
	if (firstMouse)
	{
		lastX = (float)xpos;
		lastY = (float)ypos;
		firstMouse = false;
	}
	float xoffset = (float)xpos - lastX;
	float yoffset = lastY - (float)ypos; //Pitch俯瞰

	lastX = (float)xpos;
	lastY = (float)ypos;

	/*float sensitivity = 0.05f;
	xoffset *= sensitivity;
	yoffset *= sensitivity;

	yaw += xoffset;
	pitch += yoffset;

	if (pitch > 89.0f)
	{
		pitch = 89.0f;
	}
	if (pitch < -89.0f)
	{
		pitch = -89.0f;
	}
	glm::vec3 front;
	front.x = cos(glm::radians(pitch))*cos(glm::radians(yaw));
	front.y = sin(glm::radians(pitch));
	front.z = cos(glm::radians(pitch))*sin(glm::radians(yaw));
	cameraFront = glm::normalize(front);*/
	camera.ProcessMouseMovement(xoffset,yoffset,true);

}

//float fov = 45.0f;
void scroll_callback(GLFWwindow* window, double xoffset, double yoffset)
{
	/*if (fov >= 0.1&&fov <= 45.0f)
	{
		fov -= (float)yoffset;
	}
	if (fov <= 0.1f)
	{
		fov = 0.1f;
	}
	if (fov >= 45.0f)
	{
		fov = 45.0f;
	}*/
	camera.ProcessMouseScroll((float)yoffset);
}

int main()
{
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	////////////////////////////////////////////////////////////////////////////////
	//创建一个窗口对象
	GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);

	//初始化GLAD
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}

	//视口
	//glViewport函数前两个参数控制窗口左下角的位置。
	//第三个和第四个参数控制渲染窗口的宽度和高度（像素）。
	glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);

	//注册函数，当窗口调整大小时调用
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
	///////////////////////////////////////////////////////////////////////////

	//隐藏光标
	glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);

	//监听鼠标移动事件
	glfwSetCursorPosCallback(window, mouse_callback);

	//鼠标滚轮
	glfwSetScrollCallback(window, scroll_callback);

	//索引缓冲对象、顶点数组对象、顶点缓冲对象
	///////////////////////////////////////////////////////////////////////////
	//LearnOpenGL CN 教程中对于纹理坐标有误
	//左上角(0,0),右下角(1,1)
	/*float vertices[] = {
	//位置              //颜色RGBA             //纹理
	0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f,0.0f,  // 右上角
	0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f,1.0f,  // 右下角
	-0.5f, -0.5f, 0.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,1.0f,  // 左下角
	-0.5f,  0.5f, 0.0f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f,0.0f   // 左上角
	};*/
	//不作死就不会死！
	float vertices[] = {
		//位置              //颜色RGBA          //纹理
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,

		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,

		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 0.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 1.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 0.0f,

		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 1.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 1.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,

		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,

		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 0.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f
	};
	//位移向量
	glm::vec3 cubePositions[] = {
		glm::vec3(0.0f,  0.0f,   0.0f),
		glm::vec3(2.0f,  5.0f, -15.0f),
		glm::vec3(-1.5f, -2.2f,  -2.5f),
		glm::vec3(-3.8f, -2.0f, -12.3f),
		glm::vec3(2.4f, -0.4f,  -3.5f),
		glm::vec3(-1.7f,  3.0f,  -7.5f),
		glm::vec3(1.3f, -2.0f,  -2.5f),
		glm::vec3(1.5f,  2.0f,  -2.5f),
		glm::vec3(1.5f,  0.2f,  -1.5f),
		glm::vec3(-1.3f,  1.0f,  -1.5f)
	};
	//索引缓冲对象
	/*unsigned int indices[] = {
	0,1,2, //第一个三角形
	2,3,0  //第二个三角形
	};


	unsigned int EBO;
	glGenBuffers(1, &EBO);*/
	//绑定EBO到GL_ELEMENT_ARRAY_BUFFER

	//顶点缓冲对象（Vertex Buffer Objects)
	//使用glGenBuffers函数和一个缓冲ID生成一个VBO对象
	unsigned int VBO;
	glGenBuffers(1, &VBO);

	//顶点数组对象
	unsigned int VAO;
	glGenVertexArrays(1, &VAO);
	//绑定VAO
	glBindVertexArray(VAO);

	//把顶点数组复制到缓冲中供OpenGL使用
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

	//glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
	//glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

	//设置顶点属性指针
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 9 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	//颜色属性
	glVertexAttribPointer(1, 4, GL_FLOAT, GL_FALSE, 9 * sizeof(float), (void*)(3 * sizeof(float)));
	glEnableVertexAttribArray(1);
	//纹理属性
	glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 9 * sizeof(float), (void*)(7 * sizeof(float)));
	glEnableVertexAttribArray(2);
	/////////////////////////////////////////////////////////////////////////////


	///////////////////////////////////////////////////////////////
	//着色器类变量
	//已经封装了顶点着色器、片段着色器
	Shader ourShader("shader.vs", "shader.fs");
	/////////////////////////////////////////////////////////////////////////

	///////////////////////////////////////////////////////////////////
	//图片纹理
	unsigned int ourTexture;
	glGenTextures(1, &ourTexture);
	// 在绑定纹理之前先激活纹理单元
	glActiveTexture(GL_TEXTURE0);
	//绑定纹理
	glBindTexture(GL_TEXTURE_2D, ourTexture);

	//纹理环绕
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	//第一个参数指定了纹理目标；我们使用的是2D纹理，因此纹理目标是GL_TEXTURE_2D。第二个参数需要我们指定设置的选项与应用的纹理轴。我们打算配置的是WRAP选项，并且指定S和T轴。最后一个参数需要我们传递一个环绕方式(Wrapping)，在这个例子中OpenGL会给当前激活的纹理设定纹理环绕方式为GL_MIRRORED_REPEAT。

	//如果我们选择GL_CLAMP_TO_BORDER选项，我们还需要指定一个边缘的颜色。这需要使用glTexParameter函数的fv后缀形式，用GL_TEXTURE_BORDER_COLOR作为它的选项，并且传递一个float数组作为边缘的颜色值：
	//float borderColor[] = { 1.0f,1.0f,0.0f,1.0f };
	//glTexParameterfv(GL_TEXTURE_2D, GL_TEXTURE_BORDER_COLOR, borderColor);

	//纹理过滤
	//缩小Minify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
	//放大Magnify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//多级渐远纹理
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//加载纹理图片
	int width, height, nrChannels;
	//用图像的宽度、高度和颜色通道的个数填充这三个变量。
	unsigned char* data = stbi_load("001.jpg", &width, &height, &nrChannels, 0);

	if (data)
	{
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);
	}
	else
	{
		std::cout << "Failed to load texture" << std::endl;
	}
	stbi_image_free(data);

	//int width, height, nrChannels;
	//unsigned char* data;
	unsigned int faceTexture;
	glGenTextures(1, &faceTexture);
	glActiveTexture(GL_TEXTURE1);
	glBindTexture(GL_TEXTURE_2D, faceTexture);

	//加载纹理图片
	//用图像的宽度、高度和颜色通道的个数填充这三个变量。
	data = stbi_load("002.jpg", &width, &height, &nrChannels, 0);

	if (data)
	{
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);
	}
	else
	{
		std::cout << "Failed to load texture" << std::endl;
	}
	stbi_image_free(data);


	ourShader.use();
	ourShader.setInt("ourTexture", 0);
	ourShader.setInt("faceTexture", 1);

	//////////////////////////////////////////////////////////////////////////////


	//////////////////////////////////////////////////////////////////////
	//几何变换
	/*glm::mat4 trans;
	//位移
	trans = glm::translate(trans, glm::vec3(0.12f, 0.12f, 0.0f));
	//vec = trans*vec;
	//旋转
	trans = glm::rotate(trans, glm::degrees(1.2f), glm::vec3(0.0, 0.0, 1.0));
	//trans = glm::rotate(trans, glm::radians(rotateValue), glm::vec3(0.0, 0.0, 1.0));
	//均匀缩放
	trans = glm::scale(trans, glm::vec3(0.5, 0.5, 0.0));
	unsigned int transformLoc = glGetUniformLocation(ourShader.ID, "transform");
	glUniformMatrix4fv(transformLoc, 1, GL_FALSE, glm::value_ptr(trans));*/
	/////////////////////////////////////////////////////////////////////////




	//循环渲染
	////////////////////////////////////////////
	while (!glfwWindowShouldClose(window))
	{
		//输入
		processInput(window);

		//渲染指令
		//调用glClear函数来清空屏幕的颜色缓冲，它接受一个缓冲位(Buffer Bit)来指定要清空的缓冲，可能的缓冲位有GL_COLOR_BUFFER_BIT，GL_DEPTH_BUFFER_BIT和GL_STENCIL_BUFFER_BIT。由于现在我们只关心颜色值，所以我们只清空颜色缓冲。
		//我们还调用了glClearColor来设置清空屏幕所用的颜色。当调用glClear函数，清除颜色缓冲之后，整个颜色缓冲都会被填充为glClearColor里所设置的颜色。
		float timeValue = (float)glfwGetTime();
		float redValue = (cos(timeValue) / 2.0f) + 0.5f;
		float greenValue = (sin(timeValue) / 2.0f) + 0.5f;
		float blueValue = (cos(timeValue) / 2.0f) + 0.5f;
		float alphaValue = (sin(timeValue) / 2.0f) + 0.5f;
		float proportionValue = (cos(timeValue) / 2.0f) + 0.5f;
		float translateValue_x = sin(timeValue) / 2.0f;
		float translateValue_y = cos(timeValue) / 2.0f;
		float rotateValue = 0.05f*timeValue;
		float scaleValue = (cos(timeValue) / 2.0f) + 1.0f;

		float currentFrame = (float)glfwGetTime();
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;

		glClearColor(0.1f, 0.2f, 0.3f, 1.0f);
		//glClearColor(redValue+0.1f, greenValue+0.2f, blueValue+0.3f, alphaValue);
		glClear(GL_COLOR_BUFFER_BIT);
		//glUseProgram(shaderProgram);
		//ourShader.use();//激活着色器程序

		//设置uniform值
		//ourShader.setFloat("ourColor", greenValue);
		ourShader.setVec4("ourColor", redValue, greenValue, blueValue, alphaValue);
		ourShader.setFloat("proportion", proportionValue);

		/////////////////////////////////////////////////////////////////////////
		//线框模式
		//第一个参数表示我们打算将其应用到所有的三角形的正面和背面，第二个参数告诉我们用线来绘制
		//glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
		//填充模式
		glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
		//开启深度测试
		glEnable(GL_DEPTH_TEST);
		//清楚深度缓冲
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

		//进入3D
		//建立一个模型矩阵 从局部空间进入世界空间
		//glm::mat4 model;
		//以x为轴旋转
		//model = glm::rotate(model,(float)glfwGetTime()* glm::radians(-55.0f), glm::vec3(0.5f, 1.0f, 0.0f));


		//建立一个观察矩阵 从世界空间的原点上方观察进入观察空间
		//glm::mat4 view;
		//向后移动
		//view = glm::translate(view, glm::vec3(0.0f, 0.0f, -3.0f));
		//LookAt
		//glm::mat4 view;
		//view = glm::lookAt(cameraPos, cameraTarget, cameraUp);

		float radius = 10.0f;
		float camX = (float)sin(glfwGetTime())*radius;
		float camZ = (float)cos(glfwGetTime())*radius;
		glm::mat4 view;
		//view = glm::lookAt(cameraPos, cameraPos+cameraFront, cameraUp);
		view = camera.GetViewMatrix();
		//建立一个投影矩阵，从观察空间进入裁剪空间
		glm::mat4 projection;
		//projection = glm::perspective(glm::radians(fov), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.001f, 100.0f);
		projection= glm::perspective(glm::radians(camera.GetZoom()), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.001f, 100.0f);

		//////////////////////////////
		//正射投影矩阵,左右 底顶 前后
		//glm::ortho(0.0f, 800.0f, 0.0f, 600.0f, 0.1f, 100.0f);
		//透视投影矩阵 视野(角度/弧度) 宽高比(视口宽与高之比) 近、远平面
		//glm::mat4 proj = glm::perspective(glm::radians(45.0f), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.1f, 100.0f);
		/////////////////////////////

		//将矩阵传入着色器
		//恩，又内置了！
		//ourShader.setMat4("model", model);
		ourShader.setMat4("view", view);
		ourShader.setMat4("projection", projection);
		/*int modelLoc = glGetUniformLocation(ourShader.ID, "model");
		glUniformMatrix4fv(modelLoc, 1, GL_FALSE, glm::value_ptr(model));
		int viewLoc = glGetUniformLocation(ourShader.ID, "view");
		glUniformMatrix4fv(viewLoc, 1, GL_FALSE, glm::value_ptr(view));
		int proLoc = glGetUniformLocation(ourShader.ID, "projection");
		glUniformMatrix4fv(proLoc, 1, GL_FALSE, glm::value_ptr(projection));*/

		//////////////////////////////////////////////////////////////////////////

		//////////////////////////////////////////////////////////////////////
		//几何变换
		/*glm::mat4 trans;
		//位移
		trans = glm::translate(trans, glm::vec3(translateValue_x, translateValue_y, 0.0f));
		//vec = trans*vec;
		//旋转
		trans = glm::rotate(trans, glm::degrees(rotateValue), glm::vec3(0.0, 0.0, 1.0));
		//trans = glm::rotate(trans, glm::radians(rotateValue), glm::vec3(0.0, 0.0, 1.0));
		//均匀缩放
		trans = glm::scale(trans, glm::vec3(scaleValue, scaleValue, 0.0));
		unsigned int transformLoc = glGetUniformLocation(ourShader.ID, "transform");
		glUniformMatrix4fv(transformLoc, 1, GL_FALSE, glm::value_ptr(trans));*/
		/////////////////////////////////////////////////////////////////////////



		for (unsigned int i = 0; i < 10; i++)
		{
			glm::mat4 model;
			model = glm::translate(model, cubePositions[i]);
			float angle =(float)pow(-1,i)* (20.0f*i + 180.0f);
			/*if (i != 0)
			{
				model = glm::rotate(model, (float)glfwGetTime()* glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
			}
			else
			{
				model = glm::rotate(model, glm::radians(angle), glm::vec3(0.2f, 0.3f, 1.0f));
			}*/
			model = glm::rotate(model, /*(float)glfwGetTime()**/ glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
			ourShader.setMat4("model", model);
			glDrawArrays(GL_TRIANGLES, 0, 36);
		}
		//glDrawArrays(GL_TRIANGLES, 0, 36);
		//索引缓冲对象设置缓冲渲染
		//第一个参数指定了我们绘制的模式，这个和glDrawArrays的一样。第二个参数是我们打算绘制顶点的个数，这里填6，也就是说我们一共需要绘制6个顶点。第三个参数是索引的类型，这里是GL_UNSIGNED_INT。最后一个参数里我们可以指定EBO中的偏移量（或者传递一个索引数组，但是这是当你不在使用索引缓冲对象的时候），但是我们会在这里填写0。
		//glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
		//检查并调用事件，交换缓冲
		glfwSwapBuffers(window);
		glfwPollEvents();
	}
	/////////////////////////////////////////////

	glfwTerminate();
	return 0;
}
```
> # OpenGL_Learn_Lighting

## OpenGL_Learn_Lighting_One_BasicLighting.cpp
```cpp
#define STB_IMAGE_IMPLEMENTATION
#include<glad.h>
#include<glfw3.h>
#include<iostream>
#include<Shader.h>
#include<Camera.h>
#include<stb_image.h>
//#define GLM_FORCE_RADIANS  //Bug，居然glm里面没有定义radians的宏
#include<glm/glm.hpp>
#include<glm/gtc/matrix_transform.hpp>
#include<glm/gtc/type_ptr.hpp>

const unsigned int SCR_WIDTH = 800;
const unsigned int SCR_HEIGHT = 600;

Camera camera(glm::vec3(0.0f, 0.0f, 3.0f));

float lastX = 400, lastY = 300;
float yaw = 0.0f;
float pitch = 0.0f;
bool firstMouse = true;

float deltaTime = 0.0f;//当前帧与上一帧的时间差
float lastFrame = 0.0f;//上一帧的时间

//窗口改变函数
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	glViewport(0, 0, width, height);
}
bool once = false;
//GLFW的输入控制，返回这个按键是否被按下
void processInput(GLFWwindow* window)
{

	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
	{
		glfwSetWindowShouldClose(window, true);
	}

	//float cameraSpeed = 2.5f*deltaTime;
	if (glfwGetKey(window, GLFW_KEY_UP) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*cameraFront;
		camera.ProcessKeyboard(FORWARD, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_DOWN) == GLFW_PRESS)
	{
		//cameraPos -= cameraSpeed*cameraFront;
		camera.ProcessKeyboard(BACKWARD, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_LEFT) == GLFW_PRESS)
	{
		//cameraPos -= cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(LEFT, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_RIGHT) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(RIGHT, deltaTime);
	}

	//Camera Roll
	if (glfwGetKey(window, GLFW_KEY_KP_ADD) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(ROLL_ADD, deltaTime);
		//once = false;
	}
	if (glfwGetKey(window, GLFW_KEY_KP_SUBTRACT) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(ROLL_REDUCE, deltaTime);
		//once = false;
	}
	/*if ((glfwGetKey(window, GLFW_KEY_KP_ADD) == GLFW_RELEASE && glfwGetKey(window, GLFW_KEY_KP_SUBTRACT) == GLFW_RELEASE)&&!once)
	{
		camera.changeWorldUp_CameraUp();
		//once = true;
	}*/
}


void mouse_callback(GLFWwindow* window, double xpos, double ypos)
{
	if (firstMouse)
	{
		lastX = (float)xpos;
		lastY = (float)ypos;
		firstMouse = false;
	}
	float xoffset = (float)xpos - lastX;
	float yoffset = lastY - (float)ypos; //Pitch俯瞰

	lastX = (float)xpos;
	lastY = (float)ypos;

	camera.ProcessMouseMovement(xoffset,yoffset,true);

}

//float fov = 45.0f;
void scroll_callback(GLFWwindow* window, double xoffset, double yoffset)
{
	camera.ProcessMouseScroll((float)yoffset);
}

int main()
{
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	////////////////////////////////////////////////////////////////////////////////
	//创建一个窗口对象
	GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);

	//初始化GLAD
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}

	//视口
	//glViewport函数前两个参数控制窗口左下角的位置。
	//第三个和第四个参数控制渲染窗口的宽度和高度（像素）。
	glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);

	//注册函数，当窗口调整大小时调用
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
	///////////////////////////////////////////////////////////////////////////

	//隐藏光标
	glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);

	//监听鼠标移动事件
	glfwSetCursorPosCallback(window, mouse_callback);

	//鼠标滚轮
	glfwSetScrollCallback(window, scroll_callback);

	//索引缓冲对象、顶点数组对象、顶点缓冲对象
	///////////////////////////////////////////////////////////////////////////

	//不作死就不会死！
	float vertices[] = {
		       //位置              //颜色RGBA          //纹理       //法向量，继续作
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f, -1.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  0.0f, -1.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f, -1.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f, -1.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  0.0f, -1.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f, -1.0f,

		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f,  1.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  0.0f,  1.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f,  1.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f,  1.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  0.0f,  1.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f,  1.0f,

		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 0.0f, -1.0f,  0.0f,  0.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 1.0f, -1.0f,  0.0f,  0.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f, -1.0f,  0.0f,  0.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f, -1.0f,  0.0f,  0.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f, -1.0f,  0.0f,  0.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 0.0f, -1.0f,  0.0f,  0.0f,

		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  1.0f,  0.0f,  0.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 1.0f,  1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 1.0f,  1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 0.0f,  1.0f,  0.0f,  0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  1.0f,  0.0f,  0.0f,

		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,  0.0f, -1.0f,  0.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f, -1.0f,  0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f, -1.0f,  0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f, -1.0f,  0.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f, -1.0f,  0.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,  0.0f, -1.0f,  0.0f,


		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  1.0f,  0.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 0.0f,  0.0f,  1.0f,  0.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  1.0f,  0.0f
	};


	//顶点缓冲对象（Vertex Buffer Objects)
	//使用glGenBuffers函数和一个缓冲ID生成一个VBO对象
	unsigned int VBO;
	glGenBuffers(1, &VBO);

	//顶点数组对象
	unsigned int VAO;
	glGenVertexArrays(1, &VAO);
	//绑定VAO
	glBindVertexArray(VAO);

	//把顶点数组复制到缓冲中供OpenGL使用
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

	//glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
	//glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

	//设置顶点属性指针
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	//颜色属性
	glVertexAttribPointer(1, 4, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)(3 * sizeof(float)));
	glEnableVertexAttribArray(1);
	//纹理属性
	glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)(7 * sizeof(float)));
	glEnableVertexAttribArray(2);
	//法向量哦~~
	glVertexAttribPointer(3, 3, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)(9 * sizeof(float)));
	glEnableVertexAttribArray(3);

	//灯源立方体VAO
	unsigned int lightVAO;
	glGenVertexArrays(1, &lightVAO);
	glBindVertexArray(lightVAO);
	//只需要绑定VBO不用再次设置VBO的数据，因为VBO数据中已经包含了正确地立方体顶点数据
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	//设置ID那个ID暗属性
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	/////////////////////////////////////////////////////////////////////////////

	///////////////////////////////////////////////////////////////
	//着色器类变量
	//已经封装了顶点着色器、片段着色器
	Shader objectShader("shader.vs", "shader.fs");
	objectShader.use();
	objectShader.setVec4("objectColor", 1.0f, 0.5f, 0.31f,1.0f);
	objectShader.setVec4("lightColor", 1.0f, 1.0f, 1.0f,1.0f);

	Shader lightShader("lightShader.vs", "lightShader.fs");
	lightShader.use();
	//light
	glm::vec3 lightPos(1.2f, 1.0f, 2.0f);
	/////////////////////////////////////////////////////////////////////////

	//循环渲染
	////////////////////////////////////////////
	while (!glfwWindowShouldClose(window))
	{
		//输入
		processInput(window);

		//渲染指令
		float currentFrame = (float)glfwGetTime();
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;
		lightPos.x = 5*sin(glfwGetTime());
		lightPos.y = 5*cos(glfwGetTime());

		glClearColor(0.1f, 0.2f, 0.3f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT);

		/////////////////////////////////////////////////////////////////////////
		//线框模式
		//第一个参数表示我们打算将其应用到所有的三角形的正面和背面，第二个参数告诉我们用线来绘制
		//glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
		//填充模式
		glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
		//开启深度测试
		glEnable(GL_DEPTH_TEST);
		//清楚深度缓冲
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

		//进入3D
		//建立一个模型矩阵 从局部空间进入世界空间
		glm::mat4 model;
		//以x为轴旋转
		model = glm::rotate(model,(float)glfwGetTime()* glm::radians(-55.0f), glm::vec3(1.0f, 0.0f, 0.0f));

		glm::mat4 view;
		//view = glm::lookAt(cameraPos, cameraPos+cameraFront, cameraUp);
		view = camera.GetViewMatrix();
		//建立一个投影矩阵，从观察空间进入裁剪空间
		glm::mat4 projection;
		//projection = glm::perspective(glm::radians(fov), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.001f, 100.0f);
		projection= glm::perspective(glm::radians(camera.GetZoom()), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.001f, 100.0f);


		//被光照物体
		objectShader.use();
		objectShader.setVec4("objectColor", 1.0f, 0.5f, 0.31f,1.0f);

		objectShader.setVec4("lightColor", 1.0f, 1.0f, 1.0f,1.0f);

		objectShader.setVec3("lightPos", lightPos);
		objectShader.setMat4("model", model);
		objectShader.setMat4("view", view);
		objectShader.setMat4("projection", projection);
		objectShader.setVec3("viewPos", camera.GetPosition());
		//model左上角逆矩阵的转置矩阵得到法线矩阵
		glm::mat3 Normal_Matrix = glm::transpose(glm::inverse(glm::mat3(model)));
		objectShader.setMat3("Normal_Matrix", Normal_Matrix);
		glBindVertexArray(VAO);
		glDrawArrays(GL_TRIANGLES, 0, 36);

		//灯
		lightShader.use();
		model = glm::mat4();

		model = glm::translate(model, lightPos);
		model = glm::scale(model, glm::vec3(0.2f));

		lightShader.setMat4("model", model);
		lightShader.setMat4("view", view);
		lightShader.setMat4("projection", projection);
		glBindVertexArray(lightVAO);
		glDrawArrays(GL_TRIANGLES, 0, 36);
		//////////////////////////////////////////////////////////////////////////

		//检查并调用事件，交换缓冲
		glfwSwapBuffers(window);
		glfwPollEvents();
	}
	/////////////////////////////////////////////

	glfwTerminate();
	return 0;
}
```

## OpenGL_Learn_Lighting_Two_Material.cpp
```cpp
#define STB_IMAGE_IMPLEMENTATION
#include<glad.h>
#include<glfw3.h>
#include<iostream>
#include<Shader.h>
#include<Camera.h>
#include<stb_image.h>
//#define GLM_FORCE_RADIANS  //Bug，居然glm里面没有定义radians的宏
#include<glm/glm.hpp>
#include<glm/gtc/matrix_transform.hpp>
#include<glm/gtc/type_ptr.hpp>

const unsigned int SCR_WIDTH = 800;
const unsigned int SCR_HEIGHT = 600;

Camera camera(glm::vec3(0.0f, 0.0f, 3.0f));

float lastX = 400, lastY = 300;
float yaw = 0.0f;
float pitch = 0.0f;
bool firstMouse = true;

float deltaTime = 0.0f;//当前帧与上一帧的时间差
float lastFrame = 0.0f;//上一帧的时间

//窗口改变函数
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	glViewport(0, 0, width, height);
}

//GLFW的输入控制，返回这个按键是否被按下
void processInput(GLFWwindow* window)
{

	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
	{
		glfwSetWindowShouldClose(window, true);
	}

	//float cameraSpeed = 2.5f*deltaTime;
	if (glfwGetKey(window, GLFW_KEY_UP) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*cameraFront;
		camera.ProcessKeyboard(FORWARD, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_DOWN) == GLFW_PRESS)
	{
		//cameraPos -= cameraSpeed*cameraFront;
		camera.ProcessKeyboard(BACKWARD, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_LEFT) == GLFW_PRESS)
	{
		//cameraPos -= cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(LEFT, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_RIGHT) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(RIGHT, deltaTime);
	}

	//Camera Roll
	if (glfwGetKey(window,GLFW_KEY_KP_ADD) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(ROLL_ADD, deltaTime);

	}
	if (glfwGetKey(window, GLFW_KEY_KP_SUBTRACT) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(ROLL_REDUCE, deltaTime);

	}

}


void mouse_callback(GLFWwindow* window, double xpos, double ypos)
{
	if (firstMouse)
	{
		lastX = (float)xpos;
		lastY = (float)ypos;
		firstMouse = false;
	}
	float xoffset = (float)xpos - lastX;
	float yoffset = lastY - (float)ypos; //Pitch俯瞰

	lastX = (float)xpos;
	lastY = (float)ypos;

	camera.ProcessMouseMovement(xoffset, yoffset, true);

}


void scroll_callback(GLFWwindow* window, double xoffset, double yoffset)
{
	camera.ProcessMouseScroll((float)yoffset);
}

int main()
{
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	////////////////////////////////////////////////////////////////////////////////
	//创建一个窗口对象
	GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);

	//初始化GLAD
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}

	//视口
	//glViewport函数前两个参数控制窗口左下角的位置。
	//第三个和第四个参数控制渲染窗口的宽度和高度（像素）。
	glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);

	//注册函数，当窗口调整大小时调用
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
	///////////////////////////////////////////////////////////////////////////

	//隐藏光标
	glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);

	//监听鼠标移动事件
	glfwSetCursorPosCallback(window, mouse_callback);

	//鼠标滚轮
	glfwSetScrollCallback(window, scroll_callback);

	//索引缓冲对象、顶点数组对象、顶点缓冲对象
	///////////////////////////////////////////////////////////////////////////

	//不作死就不会死！
	float vertices[] = {
		   //位置              //颜色RGBA          //纹理       //法向量，继续作
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f, -1.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  0.0f, -1.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f, -1.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f, -1.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  0.0f, -1.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f, -1.0f,

		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f,  1.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  0.0f,  1.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f,  1.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f,  1.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  0.0f,  1.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f,  1.0f,

		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 0.0f, -1.0f,  0.0f,  0.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 1.0f, -1.0f,  0.0f,  0.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f, -1.0f,  0.0f,  0.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f, -1.0f,  0.0f,  0.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f, -1.0f,  0.0f,  0.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 0.0f, -1.0f,  0.0f,  0.0f,

		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  1.0f,  0.0f,  0.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 1.0f,  1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 1.0f,  1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 0.0f,  1.0f,  0.0f,  0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  1.0f,  0.0f,  0.0f,

		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,  0.0f, -1.0f,  0.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f, -1.0f,  0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f, -1.0f,  0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f, -1.0f,  0.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f, -1.0f,  0.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,  0.0f, -1.0f,  0.0f,


		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  1.0f,  0.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 0.0f,  0.0f,  1.0f,  0.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  1.0f,  0.0f
	};


	//顶点缓冲对象（Vertex Buffer Objects)
	//使用glGenBuffers函数和一个缓冲ID生成一个VBO对象
	unsigned int VBO;
	glGenBuffers(1, &VBO);

	//顶点数组对象
	unsigned int VAO;
	glGenVertexArrays(1, &VAO);
	//绑定VAO
	glBindVertexArray(VAO);

	//把顶点数组复制到缓冲中供OpenGL使用
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

	//glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
	//glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

	//设置顶点属性指针
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	//颜色属性
	glVertexAttribPointer(1, 4, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)(3 * sizeof(float)));
	glEnableVertexAttribArray(1);
	//纹理属性
	glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)(7 * sizeof(float)));
	glEnableVertexAttribArray(2);
	//法向量哦~~
	glVertexAttribPointer(3, 3, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)(9 * sizeof(float)));
	glEnableVertexAttribArray(3);

	//灯源立方体VAO
	unsigned int lightVAO;
	glGenVertexArrays(1, &lightVAO);
	glBindVertexArray(lightVAO);
	//只需要绑定VBO不用再次设置VBO的数据，因为VBO数据中已经包含了正确地立方体顶点数据
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	//设置ID那个ID暗属性
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	/////////////////////////////////////////////////////////////////////////////

	///////////////////////////////////////////////////////////////
	//着色器类变量
	//已经封装了顶点着色器、片段着色器
	Shader objectShader("shader.vs", "shader.fs");
	objectShader.use();
	objectShader.setVec4("objectColor", 1.0f, 0.5f, 0.31f, 1.0f);
	objectShader.setVec4("lightColor", 1.0f, 1.0f, 1.0f, 1.0f);

	Shader lightShader("lightShader.vs", "lightShader.fs");
	lightShader.use();
	//light
	glm::vec3 lightPos(1.2f, 1.0f, 2.0f);
	/////////////////////////////////////////////////////////////////////////

	//循环渲染
	////////////////////////////////////////////
	while (!glfwWindowShouldClose(window))
	{
		//输入
		processInput(window);

		//渲染指令
		float currentFrame = (float)glfwGetTime();
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;


		lightPos.x = 5 * (float)sin(glfwGetTime());
		lightPos.y = 5 * (float)cos(glfwGetTime());

		glClearColor(0.1f, 0.2f, 0.3f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT);

		/////////////////////////////////////////////////////////////////////////
		//线框模式
		//第一个参数表示我们打算将其应用到所有的三角形的正面和背面，第二个参数告诉我们用线来绘制
		//glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
		//填充模式
		glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
		//开启深度测试
		glEnable(GL_DEPTH_TEST);
		//清楚深度缓冲
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

		//进入3D
		//建立一个模型矩阵 从局部空间进入世界空间
		glm::mat4 model;
		//以x为轴旋转
		model = glm::rotate(model, (float)glfwGetTime()* glm::radians(-55.0f), glm::vec3(1.0f, 0.0f, 0.0f));

		glm::mat4 view;
		//view = glm::lookAt(cameraPos, cameraPos+cameraFront, cameraUp);
		view = camera.GetViewMatrix();
		//建立一个投影矩阵，从观察空间进入裁剪空间
		glm::mat4 projection;
		//projection = glm::perspective(glm::radians(fov), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.001f, 100.0f);
		projection = glm::perspective(glm::radians(camera.GetZoom()), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.001f, 100.0f);


		//被光照物体
		objectShader.use();
		objectShader.setVec4("objectColor", 1.0f, 0.5f, 0.31f, 1.0f);
		objectShader.setVec4("material.ambient", 1.0f, 0.5f, 0.31f,1.0f);
		objectShader.setVec4("material.diffuse", 1.0f, 0.5f, 0.31f,1.0f);
		objectShader.setVec4("material.specular", 0.5f, 0.5f, 0.5f,1.0f);
		objectShader.setFloat("material.shininess", 32.0f);

		glm::vec4 lightColor;
		lightColor.x = (float)sin(glfwGetTime()*2.0f);
		lightColor.y = (float)sin(glfwGetTime()*0.7f);
		lightColor.z = (float)sin(glfwGetTime()*1.0f);
		lightColor.w = 1.0f;
		glm::vec4 diffuseColor = lightColor*glm::vec4(0.5f, 0.5f, 0.5f, 1.0f);
		glm::vec4 ambientColor = diffuseColor*glm::vec4(0.2f, 0.2f, 0.2f, 1.0f);

		objectShader.setVec4("light.ambient", ambientColor);
		objectShader.setVec4("light.diffuse", diffuseColor);
		//objectShader.setVec4("light.ambient", 0.2f, 0.2f, 0.2f,1.0f);
		//objectShader.setVec4("light.diffuse", 0.5f, 0.5f, 0.5f,1.0f); // 将光照调暗了一些以搭配场景
		objectShader.setVec4("light.specular", 1.0f, 1.0f, 1.0f,1.0);
		//objectShader.setVec4("lightColor", 1.0f, 1.0f, 1.0f, 1.0f);
		//objectShader.setVec4("lightColor", lightColor);
		objectShader.setVec3("light.position",lightPos);
		//objectShader.setVec3("lightPos", lightPos);
		objectShader.setMat4("model", model);
		objectShader.setMat4("view", view);
		objectShader.setMat4("projection", projection);
		objectShader.setVec3("viewPos", camera.GetPosition());
		//model左上角逆矩阵的转置矩阵得到法线矩阵
		glm::mat3 Normal_Matrix = glm::transpose(glm::inverse(glm::mat3(model)));
		objectShader.setMat3("Normal_Matrix", Normal_Matrix);
		glBindVertexArray(VAO);
		glDrawArrays(GL_TRIANGLES, 0, 36);

		//灯
		lightShader.use();
		model = glm::mat4();

		model = glm::translate(model, lightPos);
		model = glm::scale(model, glm::vec3(0.2f));

		lightShader.setVec4("lightColor", lightColor);

		lightShader.setMat4("model", model);
		lightShader.setMat4("view", view);
		lightShader.setMat4("projection", projection);
		glBindVertexArray(lightVAO);
		glDrawArrays(GL_TRIANGLES, 0, 36);
		//////////////////////////////////////////////////////////////////////////

		//检查并调用事件，交换缓冲
		glfwSwapBuffers(window);
		glfwPollEvents();
	}
	/////////////////////////////////////////////

	glfwTerminate();
	return 0;
}
```

## OpenGL_Learn_Lighting_Three_LightingMap.cpp
```cpp
#define STB_IMAGE_IMPLEMENTATION
#include<glad.h>
#include<glfw3.h>
#include<iostream>
#include<Shader.h>
#include<Camera.h>
#include<stb_image.h>
//#define GLM_FORCE_RADIANS  //Bug，居然glm里面没有定义radians的宏
#include<glm/glm.hpp>
#include<glm/gtc/matrix_transform.hpp>
#include<glm/gtc/type_ptr.hpp>

const unsigned int SCR_WIDTH = 800;
const unsigned int SCR_HEIGHT = 600;

Camera camera(glm::vec3(0.0f, 0.0f, 3.0f));

float lastX = 400, lastY = 300;
float yaw = 0.0f;
float pitch = 0.0f;
bool firstMouse = true;

float deltaTime = 0.0f;//当前帧与上一帧的时间差
float lastFrame = 0.0f;//上一帧的时间

					   //窗口改变函数
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	glViewport(0, 0, width, height);
}

//GLFW的输入控制，返回这个按键是否被按下
void processInput(GLFWwindow* window)
{

	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
	{
		glfwSetWindowShouldClose(window, true);
	}

	//float cameraSpeed = 2.5f*deltaTime;
	if (glfwGetKey(window, GLFW_KEY_UP) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*cameraFront;
		camera.ProcessKeyboard(FORWARD, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_DOWN) == GLFW_PRESS)
	{
		//cameraPos -= cameraSpeed*cameraFront;
		camera.ProcessKeyboard(BACKWARD, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_LEFT) == GLFW_PRESS)
	{
		//cameraPos -= cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(LEFT, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_RIGHT) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(RIGHT, deltaTime);
	}

	//Camera Roll
	if (glfwGetKey(window, GLFW_KEY_KP_ADD) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(ROLL_ADD, deltaTime);

	}
	if (glfwGetKey(window, GLFW_KEY_KP_SUBTRACT) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(ROLL_REDUCE, deltaTime);

	}

}


void mouse_callback(GLFWwindow* window, double xpos, double ypos)
{
	if (firstMouse)
	{
		lastX = (float)xpos;
		lastY = (float)ypos;
		firstMouse = false;
	}
	float xoffset = (float)xpos - lastX;
	float yoffset = lastY - (float)ypos; //Pitch俯瞰

	lastX = (float)xpos;
	lastY = (float)ypos;

	camera.ProcessMouseMovement(xoffset, yoffset, true);

}


void scroll_callback(GLFWwindow* window, double xoffset, double yoffset)
{
	camera.ProcessMouseScroll((float)yoffset);
}

int main()
{
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	////////////////////////////////////////////////////////////////////////////////
	//创建一个窗口对象
	GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);

	//初始化GLAD
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}

	//视口
	//glViewport函数前两个参数控制窗口左下角的位置。
	//第三个和第四个参数控制渲染窗口的宽度和高度（像素）。
	glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);

	//注册函数，当窗口调整大小时调用
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
	///////////////////////////////////////////////////////////////////////////

	//隐藏光标
	glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);

	//监听鼠标移动事件
	glfwSetCursorPosCallback(window, mouse_callback);

	//鼠标滚轮
	glfwSetScrollCallback(window, scroll_callback);

	//索引缓冲对象、顶点数组对象、顶点缓冲对象
	///////////////////////////////////////////////////////////////////////////

	//不作死就不会死！
	float vertices[] = {
		        //位置              //颜色RGBA          //纹理       //法向量，继续作
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f, -1.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  0.0f, -1.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f, -1.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f, -1.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  0.0f, -1.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f, -1.0f,

		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f,  1.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  0.0f,  1.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f,  1.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f,  1.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  0.0f,  1.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f,  1.0f,

		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 0.0f, -1.0f,  0.0f,  0.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 1.0f, -1.0f,  0.0f,  0.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f, -1.0f,  0.0f,  0.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f, -1.0f,  0.0f,  0.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f, -1.0f,  0.0f,  0.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 0.0f, -1.0f,  0.0f,  0.0f,

		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  1.0f,  0.0f,  0.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 1.0f,  1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 1.0f,  1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 0.0f,  1.0f,  0.0f,  0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  1.0f,  0.0f,  0.0f,

		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,  0.0f, -1.0f,  0.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f, -1.0f,  0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f, -1.0f,  0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f, -1.0f,  0.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f, -1.0f,  0.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,  0.0f, -1.0f,  0.0f,


		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  1.0f,  0.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 0.0f,  0.0f,  1.0f,  0.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  1.0f,  0.0f
	};


	//顶点缓冲对象（Vertex Buffer Objects)
	//使用glGenBuffers函数和一个缓冲ID生成一个VBO对象
	unsigned int VBO;
	glGenBuffers(1, &VBO);

	//顶点数组对象
	unsigned int VAO;
	glGenVertexArrays(1, &VAO);
	//绑定VAO
	glBindVertexArray(VAO);

	//把顶点数组复制到缓冲中供OpenGL使用
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

	//glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
	//glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

	//设置顶点属性指针
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	//颜色属性
	glVertexAttribPointer(1, 4, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)(3 * sizeof(float)));
	glEnableVertexAttribArray(1);
	//纹理属性
	glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)(7 * sizeof(float)));
	glEnableVertexAttribArray(2);
	//法向量哦~~
	glVertexAttribPointer(3, 3, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)(9 * sizeof(float)));
	glEnableVertexAttribArray(3);

	//灯源立方体VAO
	unsigned int lightVAO;
	glGenVertexArrays(1, &lightVAO);
	glBindVertexArray(lightVAO);
	//只需要绑定VBO不用再次设置VBO的数据，因为VBO数据中已经包含了正确地立方体顶点数据
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	//设置ID那个ID暗属性
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	/////////////////////////////////////////////////////////////////////////////


	///////////////////////////////////////////////////////////////////
	//图片纹理
	unsigned int diffuseMap;
	glGenTextures(1, &diffuseMap);
	// 在绑定纹理之前先激活纹理单元
	glActiveTexture(GL_TEXTURE0);
	//绑定纹理
	glBindTexture(GL_TEXTURE_2D, diffuseMap);

	//纹理环绕
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	//第一个参数指定了纹理目标；我们使用的是2D纹理，因此纹理目标是GL_TEXTURE_2D。第二个参数需要我们指定设置的选项与应用的纹理轴。我们打算配置的是WRAP选项，并且指定S和T轴。最后一个参数需要我们传递一个环绕方式(Wrapping)，在这个例子中OpenGL会给当前激活的纹理设定纹理环绕方式为GL_MIRRORED_REPEAT。

	//如果我们选择GL_CLAMP_TO_BORDER选项，我们还需要指定一个边缘的颜色。这需要使用glTexParameter函数的fv后缀形式，用GL_TEXTURE_BORDER_COLOR作为它的选项，并且传递一个float数组作为边缘的颜色值：
	//float borderColor[] = { 1.0f,1.0f,0.0f,1.0f };
	//glTexParameterfv(GL_TEXTURE_2D, GL_TEXTURE_BORDER_COLOR, borderColor);

	//纹理过滤
	//缩小Minify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	//放大Magnify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//多级渐远纹理
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//加载纹理图片
	int width, height, nrChannels;
	//用图像的宽度、高度和颜色通道的个数填充这三个变量。
	unsigned char* data = stbi_load("container2.jpg", &width, &height, &nrChannels, 0);

	if (data)
	{
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);
	}
	else
	{
		std::cout << "Failed to load texture" << std::endl;
	}
	stbi_image_free(data);


	unsigned int specularMap;
	glGenTextures(1, &specularMap);
	// 在绑定纹理之前先激活纹理单元
	glActiveTexture(GL_TEXTURE1);
	//绑定纹理
	glBindTexture(GL_TEXTURE_2D, specularMap);
	data = stbi_load("container2_specular.jpg", &width, &height, &nrChannels, 0);

	if (data)
	{
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);
	}
	else
	{
		std::cout << "Failed to load texture" << std::endl;
	}
	stbi_image_free(data);
	//stbi_set_flip_vertically_on_load(true);

	///////////////////////////////////////////////////////////////
	//着色器类变量
	//已经封装了顶点着色器、片段着色器
	Shader objectShader("shader.vs", "shader.fs");
	objectShader.use();
	//objectShader.setInt("material.diffuse", 0);
	//objectShader.setInt("material.specular", 1);
	//objectShader.setInt("material.diffuse", 0);
	//objectShader.setVec4("objectColor", 1.0f, 0.5f, 0.31f, 1.0f);
	//objectShader.setVec4("lightColor", 1.0f, 1.0f, 1.0f, 1.0f);

	Shader lightShader("lightShader.vs", "lightShader.fs");
	lightShader.use();

	//light
	glm::vec3 lightPos(1.2f, 1.0f, 2.0f);
	/////////////////////////////////////////////////////////////////////////


	//循环渲染
	////////////////////////////////////////////
	while (!glfwWindowShouldClose(window))
	{
		//输入
		processInput(window);

		//渲染指令
		float currentFrame = (float)glfwGetTime();
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;


		//lightPos.x = 5 * (float)sin(glfwGetTime());
		//lightPos.y = 5 * (float)cos(glfwGetTime());

		glClearColor(0.1f, 0.2f, 0.3f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT);

		/////////////////////////////////////////////////////////////////////////
		//线框模式
		//第一个参数表示我们打算将其应用到所有的三角形的正面和背面，第二个参数告诉我们用线来绘制
		//glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
		//填充模式
		glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
		//开启深度测试
		glEnable(GL_DEPTH_TEST);
		//清楚深度缓冲
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

		//进入3D
		//建立一个模型矩阵 从局部空间进入世界空间
		glm::mat4 model;
		//以x为轴旋转
		model = glm::rotate(model, (float)glfwGetTime()* glm::radians(-55.0f), glm::vec3(1.0f, 0.0f, 0.0f));

		glm::mat4 view;
		//view = glm::lookAt(cameraPos, cameraPos+cameraFront, cameraUp);
		view = camera.GetViewMatrix();
		//建立一个投影矩阵，从观察空间进入裁剪空间
		glm::mat4 projection;
		//projection = glm::perspective(glm::radians(fov), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.001f, 100.0f);
		projection = glm::perspective(glm::radians(camera.GetZoom()), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.001f, 100.0f);


		//被光照物体
		objectShader.use();
		//objectShader.setVec4("objectColor", 1.0f, 0.5f, 0.31f, 1.0f);
		//objectShader.setVec4("material.ambient", 1.0f, 0.5f, 0.31f, 1.0f);
		//objectShader.setVec4("material.diffuse", 1.0f, 0.5f, 0.31f, 1.0f);
		objectShader.setVec4("material.specular", 0.5f, 0.5f, 0.5f, 1.0f);
		objectShader.setFloat("material.shininess", 64.0f);
		objectShader.setInt("material.diffuse", 0);
		objectShader.setInt("material.specular", 1);

		glm::vec4 lightColor=glm::vec4(1.0f,1.0f,1.0f,1.0f);
		//lightColor.x = (float)sin(glfwGetTime()*2.0f);
		//lightColor.y = (float)sin(glfwGetTime()*0.7f);
		//lightColor.z = (float)sin(glfwGetTime()*1.0f);
		//lightColor.w = 1.0f;
		//glm::vec4 diffuseColor = lightColor*glm::vec4(0.5f, 0.5f, 0.5f, 1.0f);
		//glm::vec4 ambientColor = diffuseColor*glm::vec4(0.2f, 0.2f, 0.2f, 1.0f);

		//objectShader.setVec4("light.ambient", ambientColor);
		//objectShader.setVec4("light.diffuse", diffuseColor);
		objectShader.setVec4("light.ambient", 0.2f, 0.2f, 0.2f,1.0f);
		objectShader.setVec4("light.diffuse", 0.5f, 0.5f, 0.5f,1.0f); // 将光照调暗了一些以搭配场景
		objectShader.setVec4("light.specular", 1.0f, 1.0f, 1.0f, 1.0);
		//objectShader.setVec4("lightColor", 1.0f, 1.0f, 1.0f, 1.0f);
		//objectShader.setVec4("lightColor", lightColor);
		objectShader.setVec3("light.position", lightPos);
		//objectShader.setVec3("lightPos", lightPos);
		objectShader.setMat4("model", model);
		objectShader.setMat4("view", view);
		objectShader.setMat4("projection", projection);
		objectShader.setVec3("viewPos", camera.GetPosition());
		//model左上角逆矩阵的转置矩阵得到法线矩阵
		glm::mat3 Normal_Matrix = glm::transpose(glm::inverse(glm::mat3(model)));
		objectShader.setMat3("Normal_Matrix", Normal_Matrix);
		glBindVertexArray(VAO);
		glDrawArrays(GL_TRIANGLES, 0, 36);

		//灯
		lightShader.use();
		model = glm::mat4();

		model = glm::translate(model, lightPos);
		model = glm::scale(model, glm::vec3(0.2f));

		lightShader.setVec4("lightColor", lightColor);

		lightShader.setMat4("model", model);
		lightShader.setMat4("view", view);
		lightShader.setMat4("projection", projection);
		glBindVertexArray(lightVAO);
		glDrawArrays(GL_TRIANGLES, 0, 36);
		//////////////////////////////////////////////////////////////////////////

		//检查并调用事件，交换缓冲
		glfwSwapBuffers(window);
		glfwPollEvents();
	}
	/////////////////////////////////////////////

	glfwTerminate();
	return 0;
}
```

## OpenGL_Learn_Lighting_Four_LightingCasters.cpp
```cpp
#define STB_IMAGE_IMPLEMENTATION
#include<glad.h>
#include<glfw3.h>
#include<iostream>
#include<Shader.h>
#include<Camera.h>
#include<stb_image.h>
//#define GLM_FORCE_RADIANS  //Bug，居然glm里面没有定义radians的宏
#include<glm/glm.hpp>
#include<glm/gtc/matrix_transform.hpp>
#include<glm/gtc/type_ptr.hpp>

const unsigned int SCR_WIDTH = 800;
const unsigned int SCR_HEIGHT = 600;

Camera camera(glm::vec3(0.0f, 0.0f, 3.0f));

float lastX = 400, lastY = 300;
float yaw = 0.0f;
float pitch = 0.0f;
bool firstMouse = true;

float deltaTime = 0.0f;//当前帧与上一帧的时间差
float lastFrame = 0.0f;//上一帧的时间

					   //窗口改变函数
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	glViewport(0, 0, width, height);
}

//GLFW的输入控制，返回这个按键是否被按下
void processInput(GLFWwindow* window)
{

	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
	{
		glfwSetWindowShouldClose(window, true);
	}

	//float cameraSpeed = 2.5f*deltaTime;
	if (glfwGetKey(window, GLFW_KEY_UP) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*cameraFront;
		camera.ProcessKeyboard(FORWARD, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_DOWN) == GLFW_PRESS)
	{
		//cameraPos -= cameraSpeed*cameraFront;
		camera.ProcessKeyboard(BACKWARD, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_LEFT) == GLFW_PRESS)
	{
		//cameraPos -= cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(LEFT, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_RIGHT) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(RIGHT, deltaTime);
	}

	//Camera Roll
	if (glfwGetKey(window, GLFW_KEY_KP_ADD) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(ROLL_ADD, deltaTime);

	}
	if (glfwGetKey(window, GLFW_KEY_KP_SUBTRACT) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(ROLL_REDUCE, deltaTime);

	}

}


void mouse_callback(GLFWwindow* window, double xpos, double ypos)
{
	if (firstMouse)
	{
		lastX = (float)xpos;
		lastY = (float)ypos;
		firstMouse = false;
	}
	float xoffset = (float)xpos - lastX;
	float yoffset = lastY - (float)ypos; //Pitch俯瞰

	lastX = (float)xpos;
	lastY = (float)ypos;

	camera.ProcessMouseMovement(xoffset, yoffset, true);

}


void scroll_callback(GLFWwindow* window, double xoffset, double yoffset)
{
	camera.ProcessMouseScroll((float)yoffset);
}

int main()
{
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	////////////////////////////////////////////////////////////////////////////////
	//创建一个窗口对象
	GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);

	//初始化GLAD
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}

	//视口
	//glViewport函数前两个参数控制窗口左下角的位置。
	//第三个和第四个参数控制渲染窗口的宽度和高度（像素）。
	glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);

	//注册函数，当窗口调整大小时调用
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
	///////////////////////////////////////////////////////////////////////////

	//隐藏光标
	//glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);

	//监听鼠标移动事件
	glfwSetCursorPosCallback(window, mouse_callback);

	//鼠标滚轮
	glfwSetScrollCallback(window, scroll_callback);

	//索引缓冲对象、顶点数组对象、顶点缓冲对象
	///////////////////////////////////////////////////////////////////////////

	//不作死就不会死！
	float vertices[] = {
		//位置              //颜色RGBA          //纹理       //法向量，继续作
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f, -1.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  0.0f, -1.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f, -1.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f, -1.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  0.0f, -1.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f, -1.0f,

		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f,  1.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  0.0f,  1.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f,  1.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f,  1.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  0.0f,  1.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f,  1.0f,

		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 0.0f, -1.0f,  0.0f,  0.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 1.0f, -1.0f,  0.0f,  0.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f, -1.0f,  0.0f,  0.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f, -1.0f,  0.0f,  0.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f, -1.0f,  0.0f,  0.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 0.0f, -1.0f,  0.0f,  0.0f,

		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  1.0f,  0.0f,  0.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 1.0f,  1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 1.0f,  1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 0.0f,  1.0f,  0.0f,  0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  1.0f,  0.0f,  0.0f,

		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,  0.0f, -1.0f,  0.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f, -1.0f,  0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f, -1.0f,  0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f, -1.0f,  0.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f, -1.0f,  0.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,  0.0f, -1.0f,  0.0f,


		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  1.0f,  0.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 0.0f,  0.0f,  1.0f,  0.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  1.0f,  0.0f
	};
	//位移向量
	glm::vec3 cubePositions[] = {
		glm::vec3( 0.0f,  0.0f,   0.0f),
		glm::vec3( 2.0f,  5.0f, -15.0f),
		glm::vec3(-1.5f, -2.2f,  -2.5f),
		glm::vec3(-3.8f, -2.0f, -12.3f),
		glm::vec3( 2.4f, -0.4f,  -3.5f),
		glm::vec3(-1.7f,  3.0f,  -7.5f),
		glm::vec3( 1.3f, -2.0f,  -2.5f),
		glm::vec3( 1.5f,  2.0f,  -2.5f),
		glm::vec3( 1.5f,  0.2f,  -1.5f),
		glm::vec3(-1.3f,  1.0f,  -1.5f)
	};

	//顶点缓冲对象（Vertex Buffer Objects)
	//使用glGenBuffers函数和一个缓冲ID生成一个VBO对象
	unsigned int VBO;
	glGenBuffers(1, &VBO);

	//顶点数组对象
	unsigned int VAO;
	glGenVertexArrays(1, &VAO);
	//绑定VAO
	glBindVertexArray(VAO);

	//把顶点数组复制到缓冲中供OpenGL使用
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

	//glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
	//glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

	//设置顶点属性指针
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	//颜色属性
	glVertexAttribPointer(1, 4, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)(3 * sizeof(float)));
	glEnableVertexAttribArray(1);
	//纹理属性
	glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)(7 * sizeof(float)));
	glEnableVertexAttribArray(2);
	//法向量哦~~
	glVertexAttribPointer(3, 3, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)(9 * sizeof(float)));
	glEnableVertexAttribArray(3);

	//灯源立方体VAO
	unsigned int lightVAO;
	glGenVertexArrays(1, &lightVAO);
	glBindVertexArray(lightVAO);
	//只需要绑定VBO不用再次设置VBO的数据，因为VBO数据中已经包含了正确地立方体顶点数据
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	//设置ID那个ID暗属性
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	/////////////////////////////////////////////////////////////////////////////


	///////////////////////////////////////////////////////////////////
	//图片纹理
	unsigned int diffuseMap;
	glGenTextures(1, &diffuseMap);
	// 在绑定纹理之前先激活纹理单元
	glActiveTexture(GL_TEXTURE0);
	//绑定纹理
	glBindTexture(GL_TEXTURE_2D, diffuseMap);

	//纹理环绕
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	//第一个参数指定了纹理目标；我们使用的是2D纹理，因此纹理目标是GL_TEXTURE_2D。第二个参数需要我们指定设置的选项与应用的纹理轴。我们打算配置的是WRAP选项，并且指定S和T轴。最后一个参数需要我们传递一个环绕方式(Wrapping)，在这个例子中OpenGL会给当前激活的纹理设定纹理环绕方式为GL_MIRRORED_REPEAT。

	//如果我们选择GL_CLAMP_TO_BORDER选项，我们还需要指定一个边缘的颜色。这需要使用glTexParameter函数的fv后缀形式，用GL_TEXTURE_BORDER_COLOR作为它的选项，并且传递一个float数组作为边缘的颜色值：
	//float borderColor[] = { 1.0f,1.0f,0.0f,1.0f };
	//glTexParameterfv(GL_TEXTURE_2D, GL_TEXTURE_BORDER_COLOR, borderColor);

	//纹理过滤
	//缩小Minify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	//放大Magnify
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//多级渐远纹理
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	//加载纹理图片
	int width, height, nrChannels;
	//用图像的宽度、高度和颜色通道的个数填充这三个变量。
	unsigned char* data = stbi_load("container2.jpg", &width, &height, &nrChannels, 0);

	if (data)
	{
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);
	}
	else
	{
		std::cout << "Failed to load texture" << std::endl;
	}
	stbi_image_free(data);


	unsigned int specularMap;
	glGenTextures(1, &specularMap);
	// 在绑定纹理之前先激活纹理单元
	glActiveTexture(GL_TEXTURE1);
	//绑定纹理
	glBindTexture(GL_TEXTURE_2D, specularMap);
	data = stbi_load("container2_specular.jpg", &width, &height, &nrChannels, 0);

	if (data)
	{
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);
	}
	else
	{
		std::cout << "Failed to load texture" << std::endl;
	}
	stbi_image_free(data);
	//stbi_set_flip_vertically_on_load(true);

	///////////////////////////////////////////////////////////////
	//着色器类变量
	//已经封装了顶点着色器、片段着色器
	Shader objectShader("shader.vs", "shader.fs");
	objectShader.use();
	//objectShader.setInt("material.diffuse", 0);
	//objectShader.setInt("material.specular", 1);
	//objectShader.setInt("material.diffuse", 0);
	//objectShader.setVec4("objectColor", 1.0f, 0.5f, 0.31f, 1.0f);
	//objectShader.setVec4("lightColor", 1.0f, 1.0f, 1.0f, 1.0f);

	Shader lightShader("lightShader.vs", "lightShader.fs");
	lightShader.use();

	//light
	glm::vec3 lightPos(1.2f, 1.0f, 2.0f);
	glm::vec4 lightColor = glm::vec4(1.0f, 1.0f, 1.0f, 1.0f);
	/////////////////////////////////////////////////////////////////////////


	//循环渲染
	////////////////////////////////////////////
	while (!glfwWindowShouldClose(window))
	{
		//输入
		processInput(window);

		//渲染指令
		float currentFrame = (float)glfwGetTime();
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;


		//lightPos.x = 5 * (float)sin(glfwGetTime());
		//lightPos.y = 5 * (float)cos(glfwGetTime());

		glClearColor(0.1f, 0.2f, 0.3f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT);

		/////////////////////////////////////////////////////////////////////////
		//线框模式
		//第一个参数表示我们打算将其应用到所有的三角形的正面和背面，第二个参数告诉我们用线来绘制
		//glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
		//填充模式
		glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
		//开启深度测试
		glEnable(GL_DEPTH_TEST);
		//清楚深度缓冲
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

		//进入3D
		//建立一个模型矩阵 从局部空间进入世界空间
		glm::mat4 model;
		//以x为轴旋转
		//model = glm::rotate(model, (float)glfwGetTime()* glm::radians(-55.0f), glm::vec3(1.0f, 0.0f, 0.0f));

		glm::mat4 view;
		//view = glm::lookAt(cameraPos, cameraPos+cameraFront, cameraUp);
		view = camera.GetViewMatrix();
		//建立一个投影矩阵，从观察空间进入裁剪空间
		glm::mat4 projection;
		//projection = glm::perspective(glm::radians(fov), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.001f, 100.0f);
		projection = glm::perspective(glm::radians(camera.GetZoom()), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.001f, 100.0f);

		for (unsigned int i = 0; i < 10; i++)
		{
			glm::mat4 model;
			model = glm::translate(model, cubePositions[i]);
			float angle = 20.0f * i;
			model = glm::rotate(model, /*(float)glfwGetTime()**/ glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));

			//被光照物体
			objectShader.use();
			//objectShader.setVec4("objectColor", 1.0f, 0.5f, 0.31f, 1.0f);
			//objectShader.setVec4("material.ambient", 1.0f, 0.5f, 0.31f, 1.0f);
			//objectShader.setVec4("material.diffuse", 1.0f, 0.5f, 0.31f, 1.0f);
			objectShader.setVec4("material.specular", 0.5f, 0.5f, 0.5f, 1.0f);
			objectShader.setFloat("material.shininess", 64.0f);
			objectShader.setInt("material.diffuse", 0);
			objectShader.setInt("material.specular", 1);


			//lightColor.x = (float)sin(glfwGetTime()*2.0f);
			//lightColor.y = (float)sin(glfwGetTime()*0.7f);
			//lightColor.z = (float)sin(glfwGetTime()*1.0f);
			//lightColor.w = 1.0f;
			//glm::vec4 diffuseColor = lightColor*glm::vec4(0.5f, 0.5f, 0.5f, 1.0f);
			//glm::vec4 ambientColor = diffuseColor*glm::vec4(0.2f, 0.2f, 0.2f, 1.0f);

			//objectShader.setVec3("light.position", lightPos);//mmp，找了半天，我说怎么一个物体被挡住了还能被照射到，后来发现，根本就没有进行到那一步！啥都没有控制！继续学习！
			objectShader.setVec3("light.direction", camera.GetCameraFront());
			objectShader.setVec3("light.position", camera.GetPosition());
			objectShader.setFloat("light.cutOff", glm::cos(glm::radians(12.5f)));
			objectShader.setFloat("light.outerCutOff", glm::cos(glm::radians(17.5f)));
			//objectShader.setVec4("light.ambient", ambientColor);
			//objectShader.setVec4("light.diffuse", diffuseColor);
			objectShader.setVec4("light.ambient", 0.2f, 0.2f, 0.2f, 1.0f);
			objectShader.setVec4("light.diffuse", 0.5f, 0.5f, 0.5f, 1.0f); // 将光照调暗了一些以搭配场景
			objectShader.setVec4("light.specular", 1.0f, 1.0f, 1.0f, 1.0);
			objectShader.setFloat("light.constant", 1.0f);
			objectShader.setFloat("light.linear", 0.09f);
			objectShader.setFloat("light.quadratic", 0.032f);
			//objectShader.setVec4("lightColor", 1.0f, 1.0f, 1.0f, 1.0f);
			//objectShader.setVec4("lightColor", lightColor);
			//objectShader.setVec3("light.position", lightPos);
			//objectShader.setVec3("lightPos", lightPos);
			objectShader.setMat4("model", model);
			objectShader.setMat4("view", view);
			objectShader.setMat4("projection", projection);
			objectShader.setVec3("viewPos", camera.GetPosition());
			//model左上角逆矩阵的转置矩阵得到法线矩阵
			glm::mat3 Normal_Matrix = glm::transpose(glm::inverse(glm::mat3(model)));
			objectShader.setMat3("Normal_Matrix", Normal_Matrix);
			glBindVertexArray(VAO);
			glDrawArrays(GL_TRIANGLES, 0, 36);
		}


		//灯
		/*lightShader.use();
		model = glm::mat4();

		model = glm::translate(model, lightPos);
		model = glm::scale(model, glm::vec3(0.2f));

		lightShader.setVec4("lightColor", lightColor);

		lightShader.setMat4("model", model);
		lightShader.setMat4("view", view);
		lightShader.setMat4("projection", projection);
		glBindVertexArray(lightVAO);
		glDrawArrays(GL_TRIANGLES, 0, 36);*/
		//////////////////////////////////////////////////////////////////////////

		//检查并调用事件，交换缓冲
		glfwSwapBuffers(window);
		glfwPollEvents();
	}
	/////////////////////////////////////////////

	glfwTerminate();
	return 0;
}
```

## OpenGL_Learn_Lighting_Five_MultipleLights.cpp
```cpp
#define STB_IMAGE_IMPLEMENTATION
#include<glad.h>
#include<glfw3.h>
#include<iostream>
#include<Shader.h>
#include<Camera.h>
#include<stb_image.h>
//#define GLM_FORCE_RADIANS  //Bug，居然glm里面没有定义radians的宏
#include<glm/glm.hpp>
#include<glm/gtc/matrix_transform.hpp>
#include<glm/gtc/type_ptr.hpp>
#include<cstring>


const unsigned int SCR_WIDTH = 800;
const unsigned int SCR_HEIGHT = 600;

Camera camera(glm::vec3(0.0f, 0.0f, 3.0f));

float lastX = 400, lastY = 300;
float yaw = 0.0f;
float pitch = 0.0f;
bool firstMouse = true;

float deltaTime = 0.0f;//当前帧与上一帧的时间差
float lastFrame = 0.0f;//上一帧的时间

					   //窗口改变函数
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	glViewport(0, 0, width, height);
}

//GLFW的输入控制，返回这个按键是否被按下
void processInput(GLFWwindow* window)
{

	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
	{
		glfwSetWindowShouldClose(window, true);
	}

	//float cameraSpeed = 2.5f*deltaTime;
	if (glfwGetKey(window, GLFW_KEY_UP) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*cameraFront;
		camera.ProcessKeyboard(FORWARD, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_DOWN) == GLFW_PRESS)
	{
		//cameraPos -= cameraSpeed*cameraFront;
		camera.ProcessKeyboard(BACKWARD, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_LEFT) == GLFW_PRESS)
	{
		//cameraPos -= cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(LEFT, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_RIGHT) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(RIGHT, deltaTime);
	}

	//Camera Roll
	if (glfwGetKey(window, GLFW_KEY_KP_ADD) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(ROLL_ADD, deltaTime);

	}
	if (glfwGetKey(window, GLFW_KEY_KP_SUBTRACT) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(ROLL_REDUCE, deltaTime);

	}

}


void mouse_callback(GLFWwindow* window, double xpos, double ypos)
{
	if (firstMouse)
	{
		lastX = (float)xpos;
		lastY = (float)ypos;
		firstMouse = false;
	}
	float xoffset = (float)xpos - lastX;
	float yoffset = lastY - (float)ypos; //Pitch俯瞰

	lastX = (float)xpos;
	lastY = (float)ypos;

	camera.ProcessMouseMovement(xoffset, yoffset, true);

}


void scroll_callback(GLFWwindow* window, double xoffset, double yoffset)
{
	camera.ProcessMouseScroll((float)yoffset);
}

unsigned int loadTexture(char const * path)
{
	unsigned int textureID;
	glGenTextures(1, &textureID);

	int width, height, nrComponents;
	unsigned char *data = stbi_load(path, &width, &height, &nrComponents, 0);
	if (data)
	{
		GLenum format;
		if (nrComponents == 1)
			format = GL_RED;
		else if (nrComponents == 3)
			format = GL_RGB;
		else if (nrComponents == 4)
			format = GL_RGBA;

		glBindTexture(GL_TEXTURE_2D, textureID);
		glTexImage2D(GL_TEXTURE_2D, 0, format, width, height, 0, format, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);

		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

		stbi_image_free(data);
	}
	else
	{
		std::cout << "Texture failed to load at path: " << path << std::endl;
		stbi_image_free(data);
	}

	return textureID;
}

int main()
{
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	////////////////////////////////////////////////////////////////////////////////
	//创建一个窗口对象
	GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);

	//初始化GLAD
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}

	//视口
	//glViewport函数前两个参数控制窗口左下角的位置。
	//第三个和第四个参数控制渲染窗口的宽度和高度（像素）。
	glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);

	//注册函数，当窗口调整大小时调用
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
	///////////////////////////////////////////////////////////////////////////

	//隐藏光标
	glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);

	//监听鼠标移动事件
	glfwSetCursorPosCallback(window, mouse_callback);

	//鼠标滚轮
	glfwSetScrollCallback(window, scroll_callback);

	//索引缓冲对象、顶点数组对象、顶点缓冲对象
	///////////////////////////////////////////////////////////////////////////

	//不作死就不会死！
	float vertices[] =
	{
		//位置              //颜色RGBA          //纹理       //法向量，继续作
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f, -1.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  0.0f, -1.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f, -1.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f, -1.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  0.0f, -1.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f, -1.0f,

		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f,  1.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  0.0f,  1.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f,  1.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  0.0f,  1.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  0.0f,  1.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f,  0.0f,  1.0f,

		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 0.0f, -1.0f,  0.0f,  0.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 1.0f, -1.0f,  0.0f,  0.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f, -1.0f,  0.0f,  0.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f, -1.0f,  0.0f,  0.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f, -1.0f,  0.0f,  0.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 1.0f, 0.0f, -1.0f,  0.0f,  0.0f,

		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  1.0f,  0.0f,  0.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 1.0f,  1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 1.0f,  1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 0.0f,  1.0f,  0.0f,  0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  1.0f,  0.0f,  0.0f,

		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,  0.0f, -1.0f,  0.0f,
		 0.5f, -0.5f, -0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f, -1.0f,  0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f, -1.0f,  0.0f,
		 0.5f, -0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f, -1.0f,  0.0f,
		-0.5f, -0.5f,  0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f,  0.0f, -1.0f,  0.0f,
		-0.5f, -0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f,  0.0f, -1.0f,  0.0f,


		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f, -0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,  0.0f,  1.0f,  0.0f,
		-0.5f,  0.5f,  0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 0.0f,  0.0f,  1.0f,  0.0f,
		-0.5f,  0.5f, -0.5f, 0.5f, 0.5f, 0.5f, 1.0f, 0.0f, 1.0f,  0.0f,  1.0f,  0.0f
	};
	//十个正方体位移向量
	glm::vec3 cubePositions[] =
	{
		glm::vec3( 0.0f,  0.0f,   0.0f),
		glm::vec3( 2.0f,  5.0f, -15.0f),
		glm::vec3(-1.5f, -2.2f,  -2.5f),
		glm::vec3(-3.8f, -2.0f, -12.3f),
		glm::vec3( 2.4f, -0.4f,  -3.5f),
		glm::vec3(-1.7f,  3.0f,  -7.5f),
		glm::vec3( 1.3f, -2.0f,  -2.5f),
		glm::vec3( 1.5f,  2.0f,  -2.5f),
		glm::vec3( 1.5f,  0.2f,  -1.5f),
		glm::vec3(-1.3f,  1.0f,  -1.5f)
	};
	//点光源位移向量
	glm::vec3 pointLightPositions[] =
	{
		glm::vec3( 0.7f,  0.2f,   2.0f),
		glm::vec3( 2.3f, -3.3f,  -4.0f),
		glm::vec3(-4.0f,  2.0f, -12.0f),
		glm::vec3( 0.0f,  0.0f,  -3.0f)
	};
	//顶点缓冲对象（Vertex Buffer Objects)
	//使用glGenBuffers函数和一个缓冲ID生成一个VBO对象
	unsigned int VBO;
	glGenBuffers(1, &VBO);

	//顶点数组对象
	unsigned int VAO;
	glGenVertexArrays(1, &VAO);
	//绑定VAO
	glBindVertexArray(VAO);

	//把顶点数组复制到缓冲中供OpenGL使用
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

	//glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
	//glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

	//设置顶点属性指针
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	//颜色属性
	glVertexAttribPointer(1, 4, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)(3 * sizeof(float)));
	glEnableVertexAttribArray(1);
	//纹理属性
	glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)(7 * sizeof(float)));
	glEnableVertexAttribArray(2);
	//法向量哦~~
	glVertexAttribPointer(3, 3, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)(9 * sizeof(float)));
	glEnableVertexAttribArray(3);

	//灯源立方体VAO
	unsigned int lightVAO;
	glGenVertexArrays(1, &lightVAO);
	glBindVertexArray(lightVAO);
	//只需要绑定VBO不用再次设置VBO的数据，因为VBO数据中已经包含了正确地立方体顶点数据
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	//设置ID那个ID暗属性
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 12 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	/////////////////////////////////////////////////////////////////////////////


	///////////////////////////////////////////////////////////////////
	//图片纹理
	unsigned int diffuseMap = loadTexture(std::string("container2.jpg").c_str());


	unsigned int specularMap = loadTexture(std::string("container2_specular.jpg").c_str());
	//stbi_set_flip_vertically_on_load(true);

	///////////////////////////////////////////////////////////////
	//着色器类变量
	//已经封装了顶点着色器、片段着色器
	Shader objectShader("shader.vs", "shader.fs");
	objectShader.use();
	//objectShader.setInt("material.diffuse", 0);
	//objectShader.setInt("material.specular", 1);
	//objectShader.setInt("material.diffuse", 0);
	//objectShader.setVec4("objectColor", 1.0f, 0.5f, 0.31f, 1.0f);
	//objectShader.setVec4("lightColor", 1.0f, 1.0f, 1.0f, 1.0f);


	Shader lightShader("lightShader.vs", "lightShader.fs");
	lightShader.use();

	//light
	glm::vec3 lightPos(1.2f, 1.0f, 2.0f);
	glm::vec4 lightColor = glm::vec4(1.0f, 1.0f, 1.0f, 1.0f);
	/////////////////////////////////////////////////////////////////////////


	//循环渲染
	////////////////////////////////////////////
	while (!glfwWindowShouldClose(window))
	{
		//输入
		processInput(window);

		//渲染指令
		float currentFrame = (float)glfwGetTime();
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;

		glActiveTexture(GL_TEXTURE0);
		glBindTexture(GL_TEXTURE_2D, diffuseMap);
		// bind specular map
		glActiveTexture(GL_TEXTURE1);
		glBindTexture(GL_TEXTURE_2D, specularMap);

		//lightPos.x = 5 * (float)sin(glfwGetTime());
		//lightPos.y = 5 * (float)cos(glfwGetTime());

		glClearColor(0.1f, 0.2f, 0.3f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT);

		/////////////////////////////////////////////////////////////////////////
		//线框模式
		//第一个参数表示我们打算将其应用到所有的三角形的正面和背面，第二个参数告诉我们用线来绘制
		//glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
		//填充模式
		glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
		//开启深度测试
		glEnable(GL_DEPTH_TEST);
		//清楚深度缓冲
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

		//进入3D
		//建立一个模型矩阵 从局部空间进入世界空间
		glm::mat4 model;
		//以x为轴旋转
		//model = glm::rotate(model, (float)glfwGetTime()* glm::radians(-55.0f), glm::vec3(1.0f, 0.0f, 0.0f));

		glm::mat4 view;
		//view = glm::lookAt(cameraPos, cameraPos+cameraFront, cameraUp);
		view = camera.GetViewMatrix();
		//建立一个投影矩阵，从观察空间进入裁剪空间
		glm::mat4 projection;
		//projection = glm::perspective(glm::radians(fov), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.001f, 100.0f);
		projection = glm::perspective(glm::radians(camera.GetZoom()), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.001f, 100.0f);

		//被光照物体
		objectShader.use();
		objectShader.setVec3("viewPos", camera.GetPosition());
		//objectShader.setVec4("objectColor", 1.0f, 0.5f, 0.31f, 1.0f);
		//objectShader.setVec3("material.ambient", 1.0f, 0.5f, 0.31f);
		//objectShader.setVec3("material.diffuse", 1.0f, 0.5f, 0.31f);
		//objectShader.setVec3("material.specular", 0.5f, 0.5f, 0.5f);
		objectShader.setFloat("material.shininess", 64.0f);
		objectShader.setInt("material.texture_diffuse1", 0);
		objectShader.setInt("material.texture_specular1", 1);

		// directional light
		objectShader.setVec3("dirLight.direction", -0.2f, -1.0f, -0.3f);
		objectShader.setVec3("dirLight.ambient", 0.05f, 0.05f, 0.05f);
		objectShader.setVec3("dirLight.diffuse", 0.4f, 0.4f, 0.4f);
		objectShader.setVec3("dirLight.specular", 0.5f, 0.5f, 0.5f);
		// point light 1
		objectShader.setVec3("pointLights[0].position", pointLightPositions[0]);
		objectShader.setVec3("pointLights[0].ambient", 0.05f, 0.05f, 0.05f);
		objectShader.setVec3("pointLights[0].diffuse", 0.8f, 0.8f, 0.8f);
		objectShader.setVec3("pointLights[0].specular", 1.0f, 1.0f, 1.0f);
		objectShader.setFloat("pointLights[0].constant", 1.0f);
		objectShader.setFloat("pointLights[0].linear", 0.09f);
		objectShader.setFloat("pointLights[0].quadratic", 0.032f);
		// point light 2
		objectShader.setVec3("pointLights[1].position", pointLightPositions[1]);
		objectShader.setVec3("pointLights[1].ambient", 0.05f, 0.05f, 0.05f);
		objectShader.setVec3("pointLights[1].diffuse", 0.8f, 0.8f, 0.8f);
		objectShader.setVec3("pointLights[1].specular", 1.0f, 1.0f, 1.0f);
		objectShader.setFloat("pointLights[1].constant", 1.0f);
		objectShader.setFloat("pointLights[1].linear", 0.09f);
		objectShader.setFloat("pointLights[1].quadratic", 0.032f);
		// point light 3
		objectShader.setVec3("pointLights[2].position", pointLightPositions[2]);
		objectShader.setVec3("pointLights[2].ambient", 0.05f, 0.05f, 0.05f);
		objectShader.setVec3("pointLights[2].diffuse", 0.8f, 0.8f, 0.8f);
		objectShader.setVec3("pointLights[2].specular", 1.0f, 1.0f, 1.0f);
		objectShader.setFloat("pointLights[2].constant", 1.0f);
		objectShader.setFloat("pointLights[2].linear", 0.09f);
		objectShader.setFloat("pointLights[2].quadratic", 0.032f);
		// point light 4
		objectShader.setVec3("pointLights[3].position", pointLightPositions[3]);
		objectShader.setVec3("pointLights[3].ambient", 0.05f, 0.05f, 0.05f);
		objectShader.setVec3("pointLights[3].diffuse", 0.8f, 0.8f, 0.8f);
		objectShader.setVec3("pointLights[3].specular", 1.0f, 1.0f, 1.0f);
		objectShader.setFloat("pointLights[3].constant", 1.0f);
		objectShader.setFloat("pointLights[3].linear", 0.09f);
		objectShader.setFloat("pointLights[3].quadratic", 0.032f);
		// spotLight
		objectShader.setVec3("spotLight.position", camera.GetPosition());
		objectShader.setVec3("spotLight.direction", camera.GetCameraFront());
		objectShader.setVec3("spotLight.ambient", 0.0f, 0.0f, 0.0f);
		objectShader.setVec3("spotLight.diffuse", 1.0f, 1.0f, 1.0f);
		objectShader.setVec3("spotLight.specular", 1.0f, 1.0f, 1.0f);
		objectShader.setFloat("spotLight.constant", 1.0f);
		objectShader.setFloat("spotLight.linear", 0.09f);
		objectShader.setFloat("spotLight.quadratic", 0.032f);
		objectShader.setFloat("spotLight.cutOff", glm::cos(glm::radians(12.5f)));
		objectShader.setFloat("spotLight.outerCutOff", glm::cos(glm::radians(15.0f)));


		//lightColor.x = (float)sin(glfwGetTime()*2.0f);
		//lightColor.y = (float)sin(glfwGetTime()*0.7f);
		//lightColor.z = (float)sin(glfwGetTime()*1.0f);
		//lightColor.w = 1.0f;
		//glm::vec4 diffuseColor = lightColor*glm::vec4(0.5f, 0.5f, 0.5f, 1.0f);
		//glm::vec4 ambientColor = diffuseColor*glm::vec4(0.2f, 0.2f, 0.2f, 1.0f);

		//objectShader.setVec3("light.position", lightPos);//mmp，找了半天，我说怎么一个物体被挡住了还能被照射到，后来发现，根本就没有进行到那一步！啥都没有控制！继续学习！
		/*objectShader.setVec3("light.direction", camera.GetCameraFront());
		objectShader.setVec3("light.position", camera.GetPosition());
		objectShader.setFloat("light.cutOff", glm::cos(glm::radians(12.5f)));
		objectShader.setFloat("light.outerCutOff", glm::cos(glm::radians(17.5f)));
		//objectShader.setVec4("light.ambient", ambientColor);
		//objectShader.setVec4("light.diffuse", diffuseColor);
		objectShader.setVec4("light.ambient", 0.2f, 0.2f, 0.2f, 1.0f);
		objectShader.setVec4("light.diffuse", 0.5f, 0.5f, 0.5f, 1.0f); // 将光照调暗了一些以搭配场景
		objectShader.setVec4("light.specular", 1.0f, 1.0f, 1.0f, 1.0);
		objectShader.setFloat("light.constant", 1.0f);
		objectShader.setFloat("light.linear", 0.09f);
		objectShader.setFloat("light.quadratic", 0.032f);*/
		//objectShader.setVec4("lightColor", 1.0f, 1.0f, 1.0f, 1.0f);
		//objectShader.setVec4("lightColor", lightColor);
		//objectShader.setVec3("light.position", lightPos);
		//objectShader.setVec3("lightPos", lightPos);

		objectShader.setMat4("view", view);
		objectShader.setMat4("projection", projection);
		objectShader.setVec3("viewPos", camera.GetPosition());


		for (unsigned int i = 0; i < 10; i++)
		{
			glm::mat4 model;
			model = glm::translate(model, cubePositions[i]);
			float angle = 20.0f * i;
			model = glm::rotate(model, /*(float)glfwGetTime()**/ glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
			objectShader.setMat4("model", model);

			//model左上角逆矩阵的转置矩阵得到法线矩阵
			glm::mat3 Normal_Matrix = glm::transpose(glm::inverse(glm::mat3(model)));
			objectShader.setMat3("Normal_Matrix", Normal_Matrix);
			glBindVertexArray(VAO);
			glDrawArrays(GL_TRIANGLES, 0, 36);
		}


		//灯
		/*lightShader.use();
		model = glm::mat4();

		model = glm::translate(model, lightPos);
		model = glm::scale(model, glm::vec3(0.2f));

		lightShader.setVec4("lightColor", lightColor);

		lightShader.setMat4("model", model);
		lightShader.setMat4("view", view);
		lightShader.setMat4("projection", projection);
		glBindVertexArray(lightVAO);
		glDrawArrays(GL_TRIANGLES, 0, 36);
		glBindVertexArray(lightVAO);*/


		lightShader.use();
		lightShader.setVec4("lightColor", lightColor);
		lightShader.setMat4("model", model);
		lightShader.setMat4("view", view);
		lightShader.setMat4("projection", projection);
		glBindVertexArray(lightVAO);
		for (unsigned int i = 0; i < 4; i++)
		{
			model = glm::mat4();
			model = glm::translate(model, pointLightPositions[i]);
			model = glm::scale(model, glm::vec3(0.2f)); // Make it a smaller cube
			lightShader.setMat4("model", model);
			glDrawArrays(GL_TRIANGLES, 0, 36);
		}
		//////////////////////////////////////////////////////////////////////////

		//检查并调用事件，交换缓冲
		glfwSwapBuffers(window);
		glfwPollEvents();
	}
	/////////////////////////////////////////////

	glfwTerminate();
	return 0;
}
```
> # OpenGL_Learn_LoadModel

## OpenGL_Learn_LoadModel.cpp
```cpp
#define STB_IMAGE_IMPLEMENTATION
#include<glad.h>
#include<glfw3.h>
#include<iostream>
#include<Shader.h>
#include<Camera.h>
#include<Model.h>
#define GLM_FORCE_RADIANS  //Bug，居然glm里面没有定义radians的宏
#include<glm/glm.hpp>
#include<glm/gtc/matrix_transform.hpp>
#include<glm/gtc/type_ptr.hpp>

const unsigned int SCR_WIDTH = 800;
const unsigned int SCR_HEIGHT = 600;

Camera camera(glm::vec3(0.0f, 0.0f, 3.0f));

float lastX = SCR_WIDTH/2.0f, lastY = SCR_HEIGHT/2.0f;
float yaw = 0.0f;
float pitch = 0.0f;
bool firstMouse = true;

float deltaTime = 0.0f;//当前帧与上一帧的时间差
float lastFrame = 0.0f;//上一帧的时间

					   //窗口改变函数
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	glViewport(0, 0, width, height);
}

//GLFW的输入控制，返回这个按键是否被按下
void processInput(GLFWwindow* window)
{

	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
	{
		glfwSetWindowShouldClose(window, true);
	}

	//float cameraSpeed = 2.5f*deltaTime;
	if (glfwGetKey(window, GLFW_KEY_UP) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*cameraFront;
		camera.ProcessKeyboard(FORWARD, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_DOWN) == GLFW_PRESS)
	{
		//cameraPos -= cameraSpeed*cameraFront;
		camera.ProcessKeyboard(BACKWARD, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_LEFT) == GLFW_PRESS)
	{
		//cameraPos -= cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(LEFT, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_RIGHT) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(RIGHT, deltaTime);
	}

	//Camera Roll
	if (glfwGetKey(window, GLFW_KEY_KP_ADD) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(ROLL_ADD, deltaTime);

	}
	if (glfwGetKey(window, GLFW_KEY_KP_SUBTRACT) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(ROLL_REDUCE, deltaTime);

	}

}


void mouse_callback(GLFWwindow* window, double xpos, double ypos)
{
	if (firstMouse)
	{
		lastX = (float)xpos;
		lastY = (float)ypos;
		firstMouse = false;
	}
	float xoffset = (float)xpos - lastX;
	float yoffset = lastY - (float)ypos; //Pitch俯瞰

	lastX = (float)xpos;
	lastY = (float)ypos;

	camera.ProcessMouseMovement(xoffset, yoffset, true);

}


void scroll_callback(GLFWwindow* window, double xoffset, double yoffset)
{
	camera.ProcessMouseScroll((float)yoffset);
}

int main()
{
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	////////////////////////////////////////////////////////////////////////////////
	//创建一个窗口对象
	GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);

	//初始化GLAD
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}
	glEnable(GL_DEPTH_TEST);
	//视口
	//glViewport函数前两个参数控制窗口左下角的位置。
	//第三个和第四个参数控制渲染窗口的宽度和高度（像素）。
	glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);

	//注册函数，当窗口调整大小时调用
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
	///////////////////////////////////////////////////////////////////////////

	//隐藏光标
	//glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);

	//监听鼠标移动事件
	glfwSetCursorPosCallback(window, mouse_callback);

	//鼠标滚轮
	glfwSetScrollCallback(window, scroll_callback);

	//索引缓冲对象、顶点数组对象、顶点缓冲对象
	///////////////////////////////////////////////////////////////////////////

	Shader ourShader("shader.vs", "shader.fs");
	Model ourModel("nanosuit/nanosuit.obj");

	//循环渲染
	////////////////////////////////////////////
	while (!glfwWindowShouldClose(window))
	{
		//输入
		processInput(window);

		//渲染指令
		float currentFrame = (float)glfwGetTime();
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;

		glClearColor(0.1f, 0.2f, 0.3f, 1.0f);
		//glClear(GL_COLOR_BUFFER_BIT);

		/////////////////////////////////////////////////////////////////////////
		//开启深度测试
		glEnable(GL_DEPTH_TEST);
		//清楚深度缓冲
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

		ourShader.use();
		ourShader.setVec3("dirLight.direction", -0.2f, -1.0f, -0.3f);
		ourShader.setVec3("dirLight.ambient", 0.05f, 0.05f, 0.05f);
		ourShader.setVec3("dirLight.diffuse", 1.0f,1.0f, 1.0f);
		ourShader.setVec3("dirLight.specular", 1.0f, 1.0f, 1.0f);

		ourShader.setVec3("spotLight.position", camera.GetPosition());
		ourShader.setVec3("spotLight.direction", camera.GetCameraFront());
		ourShader.setVec3("spotLight.ambient", 0.0f, 0.0f, 0.0f);
		ourShader.setVec3("spotLight.diffuse", 1.0f, 1.0f, 1.0f);
		ourShader.setVec3("spotLight.specular", 1.0f, 1.0f, 1.0f);
		ourShader.setFloat("spotLight.constant", 1.0f);
		ourShader.setFloat("spotLight.linear", 0.09f);
		ourShader.setFloat("spotLight.quadratic", 0.032f);
		ourShader.setFloat("spotLight.cutOff", glm::cos(glm::radians(12.5f)));
		ourShader.setFloat("spotLight.outerCutOff", glm::cos(glm::radians(15.0f)));

		//进入3D
		//建立一个模型矩阵 从局部空间进入世界空间
		glm::mat4 model;
		//以x为轴旋转
		model = glm::rotate(model, (float)glfwGetTime()* glm::radians(-55.0f), glm::vec3(0.0f, 1.0f, 0.0f));
		model = glm::translate(model, glm::vec3(0.0f, -1.75f, 0.0f));
		model = glm::scale(model, glm::vec3(0.2f, 0.2f, 0.2f));
		glm::mat4 view;
		view = camera.GetViewMatrix();
		//建立一个投影矩阵，从观察空间进入裁剪空间
		glm::mat4 projection;
		projection = glm::perspective(glm::radians(camera.GetZoom()), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.001f, 100.0f);
		ourShader.setMat4("model", model);
		ourShader.setMat4("view", view);
		ourShader.setMat4("projection", projection);
		ourModel.Draw(ourShader);

		//检查并调用事件，交换缓冲
		glfwSwapBuffers(window);
		glfwPollEvents();
	}
	/////////////////////////////////////////////

	glfwTerminate();
	return 0;
}
```
> # OpenGL_Learn_AdvancedOpenGL

## OpenGL_Learn_AdvancedOpenGL_One_DepthTesting.cpp
```cpp
#define STB_IMAGE_IMPLEMENTATION
#include<glad.h>
#include<glfw3.h>
#include<iostream>
#include<Shader.h>
#include<Camera.h>
#include<Model.h>
#include<cstring>
#define GLM_FORCE_RADIANS  //Bug，居然glm里面没有定义radians的宏
#include<glm/glm.hpp>
#include<glm/gtc/matrix_transform.hpp>
#include<glm/gtc/type_ptr.hpp>

const unsigned int SCR_WIDTH = 800;
const unsigned int SCR_HEIGHT = 600;

Camera camera(glm::vec3(0.0f, 0.0f, 3.0f));

float lastX = SCR_WIDTH / 2.0f, lastY = SCR_HEIGHT / 2.0f;
float yaw = 0.0f;
float pitch = 0.0f;
bool firstMouse = true;

float deltaTime = 0.0f;//当前帧与上一帧的时间差
float lastFrame = 0.0f;//上一帧的时间

					   //窗口改变函数
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	glViewport(0, 0, width, height);
}

//GLFW的输入控制，返回这个按键是否被按下
void processInput(GLFWwindow* window)
{

	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
	{
		glfwSetWindowShouldClose(window, true);
	}

	//float cameraSpeed = 2.5f*deltaTime;
	if (glfwGetKey(window, GLFW_KEY_UP) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*cameraFront;
		camera.ProcessKeyboard(FORWARD, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_DOWN) == GLFW_PRESS)
	{
		//cameraPos -= cameraSpeed*cameraFront;
		camera.ProcessKeyboard(BACKWARD, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_LEFT) == GLFW_PRESS)
	{
		//cameraPos -= cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(LEFT, deltaTime);
	}
	if (glfwGetKey(window, GLFW_KEY_RIGHT) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(RIGHT, deltaTime);
	}

	//Camera Roll
	if (glfwGetKey(window, GLFW_KEY_KP_ADD) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(ROLL_ADD, deltaTime);

	}
	if (glfwGetKey(window, GLFW_KEY_KP_SUBTRACT) == GLFW_PRESS)
	{
		//cameraPos += cameraSpeed*glm::normalize(glm::cross(cameraFront, cameraUp));
		camera.ProcessKeyboard(ROLL_REDUCE, deltaTime);

	}

}


void mouse_callback(GLFWwindow* window, double xpos, double ypos)
{
	if (firstMouse)
	{
		lastX = (float)xpos;
		lastY = (float)ypos;
		firstMouse = false;
	}
	float xoffset = (float)xpos - lastX;
	float yoffset = lastY - (float)ypos; //Pitch俯瞰

	lastX = (float)xpos;
	lastY = (float)ypos;

	camera.ProcessMouseMovement(xoffset, yoffset, true);

}


void scroll_callback(GLFWwindow* window, double xoffset, double yoffset)
{
	camera.ProcessMouseScroll((float)yoffset);
}

unsigned int loadTexture(char const *path)
{
	unsigned int textureID;
	glGenTextures(1, &textureID);

	int width, height, nrComponents;
	unsigned char *data = stbi_load(path, &width, &height, &nrComponents, 0);
	if (data)
	{
		GLenum format;
		if (nrComponents == 1)
			format = GL_RED;
		else if (nrComponents == 3)
			format = GL_RGB;
		else if (nrComponents == 4)
			format = GL_RGBA;

		glBindTexture(GL_TEXTURE_2D, textureID);
		glTexImage2D(GL_TEXTURE_2D, 0, format, width, height, 0, format, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);

		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

		stbi_image_free(data);
	}
	else
	{
		std::cout << "Texture failed to load at path: " << path << std::endl;
		stbi_image_free(data);
	}

	return textureID;
}

int main()
{
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	////////////////////////////////////////////////////////////////////////////////
	//创建一个窗口对象
	GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);

	//初始化GLAD
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}
	glEnable(GL_DEPTH_TEST);
	//视口
	//glViewport函数前两个参数控制窗口左下角的位置。
	//第三个和第四个参数控制渲染窗口的宽度和高度（像素）。
	glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);

	//注册函数，当窗口调整大小时调用
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
	///////////////////////////////////////////////////////////////////////////

	//隐藏光标
	glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);

	//监听鼠标移动事件
	glfwSetCursorPosCallback(window, mouse_callback);

	//鼠标滚轮
	glfwSetScrollCallback(window, scroll_callback);

	//索引缓冲对象、顶点数组对象、顶点缓冲对象
	///////////////////////////////////////////////////////////////////////////

	Shader shader("shader.vs", "shader.fs");
	Shader ourShader("lightShader.vs", "lightShader.fs");
	float cubeVertices[] = {
		// positions          // texture Coords
		-0.5f, -0.5f, -0.5f,  0.0f, 0.0f,
		0.5f, -0.5f, -0.5f,  1.0f, 0.0f,
		0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
		0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
		-0.5f,  0.5f, -0.5f,  0.0f, 1.0f,
		-0.5f, -0.5f, -0.5f,  0.0f, 0.0f,

		-0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
		0.5f, -0.5f,  0.5f,  1.0f, 0.0f,
		0.5f,  0.5f,  0.5f,  1.0f, 1.0f,
		0.5f,  0.5f,  0.5f,  1.0f, 1.0f,
		-0.5f,  0.5f,  0.5f,  0.0f, 1.0f,
		-0.5f, -0.5f,  0.5f,  0.0f, 0.0f,

		-0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
		-0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
		-0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
		-0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
		-0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
		-0.5f,  0.5f,  0.5f,  1.0f, 0.0f,

		0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
		0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
		0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
		0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
		0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
		0.5f,  0.5f,  0.5f,  1.0f, 0.0f,

		-0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
		0.5f, -0.5f, -0.5f,  1.0f, 1.0f,
		0.5f, -0.5f,  0.5f,  1.0f, 0.0f,
		0.5f, -0.5f,  0.5f,  1.0f, 0.0f,
		-0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
		-0.5f, -0.5f, -0.5f,  0.0f, 1.0f,

		-0.5f,  0.5f, -0.5f,  0.0f, 1.0f,
		0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
		0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
		0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
		-0.5f,  0.5f,  0.5f,  0.0f, 0.0f,
		-0.5f,  0.5f, -0.5f,  0.0f, 1.0f
	};
	float planeVertices[] = {
		// positions          // texture Coords (note we set these higher than 1 (together with GL_REPEAT as texture wrapping mode). this will cause the floor texture to repeat)
		5.0f, -0.5f,  5.0f,  2.0f, 0.0f,
		-5.0f, -0.5f,  5.0f,  0.0f, 0.0f,
		-5.0f, -0.5f, -5.0f,  0.0f, 2.0f,

		5.0f, -0.5f,  5.0f,  2.0f, 0.0f,
		-5.0f, -0.5f, -5.0f,  0.0f, 2.0f,
		5.0f, -0.5f, -5.0f,  2.0f, 2.0f
	};
	// cube VAO
	unsigned int cubeVAO, cubeVBO;
	glGenVertexArrays(1, &cubeVAO);
	glGenBuffers(1, &cubeVBO);
	glBindVertexArray(cubeVAO);
	glBindBuffer(GL_ARRAY_BUFFER, cubeVBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(cubeVertices), &cubeVertices, GL_STATIC_DRAW);
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(1);
	glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)(3 * sizeof(float)));
	glBindVertexArray(0);
	// plane VAO
	unsigned int planeVAO, planeVBO;
	glGenVertexArrays(1, &planeVAO);
	glGenBuffers(1, &planeVBO);
	glBindVertexArray(planeVAO);
	glBindBuffer(GL_ARRAY_BUFFER, planeVBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(planeVertices), &planeVertices, GL_STATIC_DRAW);
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(1);
	glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)(3 * sizeof(float)));
	glBindVertexArray(0);

	// load textures
	// -------------
	unsigned int cubeTexture = loadTexture(std::string("wenli3.jpg").c_str());
	unsigned int floorTexture = loadTexture(std::string("002.jpg").c_str());

	// shader configuration
	// --------------------
	shader.use();
	shader.setInt("texture_diffuse1", 0);
	//ourShader.use();
	//ourShader.setInt("texture_diffuse1", 0);
	// render loop
	// -----------
	while (!glfwWindowShouldClose(window))
	{
		// per-frame time logic
		// --------------------
		float currentFrame =(float) glfwGetTime();
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;

		// input
		// -----
		processInput(window);

		// render
		// ------
		glClearColor(0.1f, 0.1f, 0.1f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
		glEnable(GL_DEPTH_TEST);
		//glDepthFunc(GL_ALWAYS);
		shader.use();
		glm::mat4 model;
		glm::mat4 view = camera.GetViewMatrix();
		glm::mat4 projection = glm::perspective(glm::radians(camera.GetZoom()), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.1f, 100.0f);
		shader.setMat4("view", view);
		shader.setMat4("projection", projection);
		// cubes
		glBindVertexArray(cubeVAO);
		glActiveTexture(GL_TEXTURE0);
		glBindTexture(GL_TEXTURE_2D, cubeTexture);
		model = glm::translate(model, glm::vec3(-1.0f, 0.0f, -1.0f));
		shader.setMat4("model", model);
		glDrawArrays(GL_TRIANGLES, 0, 36);
		model = glm::mat4();
		model = glm::translate(model, glm::vec3(2.0f, 0.0f, 0.0f));
		shader.setMat4("model", model);
		glDrawArrays(GL_TRIANGLES, 0, 36);
		// floor
		glBindVertexArray(planeVAO);
		glBindTexture(GL_TEXTURE_2D, floorTexture);
		shader.setMat4("model", glm::mat4());
		glDrawArrays(GL_TRIANGLES, 0, 6);
		glBindVertexArray(0);

		// glfw: swap buffers and poll IO events (keys pressed/released, mouse moved etc.)
		// -------------------------------------------------------------------------------
		glfwSwapBuffers(window);
		glfwPollEvents();
	}

	// optional: de-allocate all resources once they've outlived their purpose:
	// ------------------------------------------------------------------------
	glDeleteVertexArrays(1, &cubeVAO);
	glDeleteVertexArrays(1, &planeVAO);
	glDeleteBuffers(1, &cubeVBO);
	glDeleteBuffers(1, &planeVBO);

	glfwTerminate();
	return 0;
}
```

## OpenGL_Learn_AdvancedOpenGL_Two_StencilTesting.cpp
```cpp
#define STB_IMAGE_IMPLEMENTATION
#include<glad.h>
#include<glfw3.h>
#include<iostream>
#include<Shader.h>
#include<Camera.h>
#include<Model.h>
#include<cstring>
#define GLM_FORCE_RADIANS  //Bug，居然glm里面没有定义radians的宏
#include<glm/glm.hpp>
#include<glm/gtc/matrix_transform.hpp>
#include<glm/gtc/type_ptr.hpp>



// settings
const unsigned int SCR_WIDTH = 1280;
const unsigned int SCR_HEIGHT = 720;

// camera
Camera camera(glm::vec3(0.0f, 0.0f, 3.0f));
float lastX = (float)(SCR_WIDTH / 2.0);
float lastY = (float)(SCR_HEIGHT / 2.0);
bool firstMouse = true;

// timing
float deltaTime = 0.0f;
float lastFrame = 0.0f;

void processInput(GLFWwindow *window)
{
	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
		glfwSetWindowShouldClose(window, true);

	if (glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS)
		camera.ProcessKeyboard(FORWARD, deltaTime);
	if (glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS)
		camera.ProcessKeyboard(BACKWARD, deltaTime);
	if (glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS)
		camera.ProcessKeyboard(LEFT, deltaTime);
	if (glfwGetKey(window, GLFW_KEY_D) == GLFW_PRESS)
		camera.ProcessKeyboard(RIGHT, deltaTime);
}

// glfw: whenever the window size changed (by OS or user resize) this callback function executes
// ---------------------------------------------------------------------------------------------
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	// make sure the viewport matches the new window dimensions; note that width and
	// height will be significantly larger than specified on retina displays.
	glViewport(0, 0, width, height);
}

// glfw: whenever the mouse moves, this callback is called
// -------------------------------------------------------
void mouse_callback(GLFWwindow* window, double xpos, double ypos)
{
	if (firstMouse)
	{
		lastX = (float)xpos;
		lastY = (float)ypos;
		firstMouse = false;
	}

	float xoffset = (float)(xpos - lastX);
	float yoffset = (float)(lastY - ypos); // reversed since y-coordinates go from bottom to top

	lastX = (float)xpos;
	lastY = (float)ypos;

	camera.ProcessMouseMovement(xoffset, yoffset);
}

// glfw: whenever the mouse scroll wheel scrolls, this callback is called
// ----------------------------------------------------------------------
void scroll_callback(GLFWwindow* window, double xoffset, double yoffset)
{
	camera.ProcessMouseScroll((float)yoffset);
}

// utility function for loading a 2D texture from file
// ---------------------------------------------------
unsigned int loadTexture(char const *path)
{
	unsigned int textureID;
	glGenTextures(1, &textureID);

	int width, height, nrComponents;
	unsigned char *data = stbi_load(path, &width, &height, &nrComponents, 0);
	if (data)
	{
		GLenum format;
		if (nrComponents == 1)
			format = GL_RED;
		else if (nrComponents == 3)
			format = GL_RGB;
		else if (nrComponents == 4)
			format = GL_RGBA;

		glBindTexture(GL_TEXTURE_2D, textureID);
		glTexImage2D(GL_TEXTURE_2D, 0, format, width, height, 0, format, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);

		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

		stbi_image_free(data);
	}
	else
	{
		std::cout << "Texture failed to load at path: " << path << std::endl;
		stbi_image_free(data);
	}

	return textureID;
}

int main()
{
	// glfw: initialize and configure
	// ------------------------------
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);



														 // glfw window creation
														 // --------------------
	GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
	glfwSetCursorPosCallback(window, mouse_callback);
	glfwSetScrollCallback(window, scroll_callback);

	// tell GLFW to capture our mouse
	glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);

	// glad: load all OpenGL function pointers
	// ---------------------------------------
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}

	// configure global opengl state
	// -----------------------------
	glEnable(GL_DEPTH_TEST);
	glDepthFunc(GL_LESS);
	glEnable(GL_STENCIL_TEST);
	glStencilFunc(GL_NOTEQUAL, 1, 0xFF);
	glStencilOp(GL_KEEP, GL_KEEP, GL_REPLACE);

	// build and compile shaders
	// -------------------------
	Shader shader("shader.vs", "shader.fs");
	Shader shaderSingleColor("lightShader.vs", "lightShader.fs");

	// set up vertex data (and buffer(s)) and configure vertex attributes
	// ------------------------------------------------------------------
	float cubeVertices[] = {
		// positions          // texture Coords
		-0.5f, -0.5f, -0.5f,  0.0f, 0.0f,
		0.5f, -0.5f, -0.5f,  1.0f, 0.0f,
		0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
		0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
		-0.5f,  0.5f, -0.5f,  0.0f, 1.0f,
		-0.5f, -0.5f, -0.5f,  0.0f, 0.0f,

		-0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
		0.5f, -0.5f,  0.5f,  1.0f, 0.0f,
		0.5f,  0.5f,  0.5f,  1.0f, 1.0f,
		0.5f,  0.5f,  0.5f,  1.0f, 1.0f,
		-0.5f,  0.5f,  0.5f,  0.0f, 1.0f,
		-0.5f, -0.5f,  0.5f,  0.0f, 0.0f,

		-0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
		-0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
		-0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
		-0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
		-0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
		-0.5f,  0.5f,  0.5f,  1.0f, 0.0f,

		0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
		0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
		0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
		0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
		0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
		0.5f,  0.5f,  0.5f,  1.0f, 0.0f,

		-0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
		0.5f, -0.5f, -0.5f,  1.0f, 1.0f,
		0.5f, -0.5f,  0.5f,  1.0f, 0.0f,
		0.5f, -0.5f,  0.5f,  1.0f, 0.0f,
		-0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
		-0.5f, -0.5f, -0.5f,  0.0f, 1.0f,

		-0.5f,  0.5f, -0.5f,  0.0f, 1.0f,
		0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
		0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
		0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
		-0.5f,  0.5f,  0.5f,  0.0f, 0.0f,
		-0.5f,  0.5f, -0.5f,  0.0f, 1.0f
	};
	float planeVertices[] = {
		// positions          // texture Coords (note we set these higher than 1 (together with GL_REPEAT as texture wrapping mode). this will cause the floor texture to repeat)
		5.0f, -0.5f,  5.0f,  2.0f, 0.0f,
		-5.0f, -0.5f,  5.0f,  0.0f, 0.0f,
		-5.0f, -0.5f, -5.0f,  0.0f, 2.0f,

		5.0f, -0.5f,  5.0f,  2.0f, 0.0f,
		-5.0f, -0.5f, -5.0f,  0.0f, 2.0f,
		5.0f, -0.5f, -5.0f,  2.0f, 2.0f
	};
	// cube VAO
	unsigned int cubeVAO, cubeVBO;
	glGenVertexArrays(1, &cubeVAO);
	glGenBuffers(1, &cubeVBO);
	glBindVertexArray(cubeVAO);
	glBindBuffer(GL_ARRAY_BUFFER, cubeVBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(cubeVertices), &cubeVertices, GL_STATIC_DRAW);
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(1);
	glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)(3 * sizeof(float)));
	glBindVertexArray(0);
	// plane VAO
	unsigned int planeVAO, planeVBO;
	glGenVertexArrays(1, &planeVAO);
	glGenBuffers(1, &planeVBO);
	glBindVertexArray(planeVAO);
	glBindBuffer(GL_ARRAY_BUFFER, planeVBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(planeVertices), &planeVertices, GL_STATIC_DRAW);
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(1);
	glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)(3 * sizeof(float)));
	glBindVertexArray(0);

	// load textures
	// -------------
	unsigned int cubeTexture = loadTexture(std::string("001.jpg").c_str());
	unsigned int floorTexture = loadTexture(std::string("002.jpg").c_str());

	// shader configuration
	// --------------------
	shader.use();
	shader.setInt("texture1", 0);

	// render loop
	// -----------
	while (!glfwWindowShouldClose(window))
	{
		// per-frame time logic
		// --------------------
		float currentFrame = (float)glfwGetTime();
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;

		// input
		// -----
		processInput(window);

		// render
		// ------
		glClearColor(0.1f, 0.1f, 0.1f, 1.0f);
		glEnable(GL_STENCIL_TEST);
		glStencilOp(GL_KEEP, GL_KEEP, GL_REPLACE);
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT | GL_STENCIL_BUFFER_BIT); // don't forget to clear the stencil buffer!

																					// set uniforms
		shaderSingleColor.use();
		glm::mat4 model;
		glm::mat4 view = camera.GetViewMatrix();
		glm::mat4 projection = glm::perspective(glm::radians(camera.GetZoom()), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.1f, 100.0f);
		shaderSingleColor.setMat4("view", view);
		shaderSingleColor.setMat4("projection", projection);

		shader.use();
		shader.setMat4("view", view);
		shader.setMat4("projection", projection);

		// draw floor as normal, but don't write the floor to the stencil buffer, we only care about the containers. We set its mask to 0x00 to not write to the stencil buffer.
	//	glStencilMask(0x00);
		// floor
		/*glBindVertexArray(planeVAO);
		glBindTexture(GL_TEXTURE_2D, floorTexture);
		shader.setMat4("model", glm::mat4());
		glDrawArrays(GL_TRIANGLES, 0, 6);
		glBindVertexArray(0);*/

		// 1st. render pass, draw objects as normal, writing to the stencil buffer
		// --------------------------------------------------------------------
		glStencilFunc(GL_ALWAYS, 1, 0xFF);
		glStencilMask(0xFF);
		// cubes
		glBindVertexArray(cubeVAO);
		glActiveTexture(GL_TEXTURE0);
		glBindTexture(GL_TEXTURE_2D, cubeTexture);
		model = glm::translate(model, glm::vec3(-1.0f, 0.0f, -1.0f));
		shader.setMat4("model", model);
		glDrawArrays(GL_TRIANGLES, 0, 36);
		model = glm::mat4();
		model = glm::translate(model, glm::vec3(2.0f, 0.0f, 0.0f));
		shader.setMat4("model", model);
		glDrawArrays(GL_TRIANGLES, 0, 36);

		// 2nd. render pass: now draw slightly scaled versions of the objects, this time disabling stencil writing.
		// Because the stencil buffer is now filled with several 1s. The parts of the buffer that are 1 are not drawn, thus only drawing
		// the objects' size differences, making it look like borders.
		// -----------------------------------------------------------------------------------------------------------------------------
		glStencilFunc(GL_NOTEQUAL, 1, 0xFF);
		glStencilMask(0x00);
		glDisable(GL_DEPTH_TEST);
		shaderSingleColor.use();
		float scale = (float) 1.1;
		// cubes
		glBindVertexArray(cubeVAO);
		glBindTexture(GL_TEXTURE_2D, cubeTexture);
		model = glm::mat4();
		model = glm::translate(model, glm::vec3(-1.0f, 0.0f, -1.0f));
		model = glm::scale(model, glm::vec3(scale, scale, scale));
		shaderSingleColor.setMat4("model", model);
		glDrawArrays(GL_TRIANGLES, 0, 36);
		model = glm::mat4();
		model = glm::translate(model, glm::vec3(2.0f, 0.0f, 0.0f));
		model = glm::scale(model, glm::vec3(scale, scale, scale));
		shaderSingleColor.setMat4("model", model);
		glDrawArrays(GL_TRIANGLES, 0, 36);
		glBindVertexArray(0);
		glStencilMask(0xFF);
		glEnable(GL_DEPTH_TEST);

		// glfw: swap buffers and poll IO events (keys pressed/released, mouse moved etc.)
		// -------------------------------------------------------------------------------
		glfwSwapBuffers(window);
		glfwPollEvents();
	}

	// optional: de-allocate all resources once they've outlived their purpose:
	// ------------------------------------------------------------------------
	glDeleteVertexArrays(1, &cubeVAO);
	glDeleteVertexArrays(1, &planeVAO);
	glDeleteBuffers(1, &cubeVBO);
	glDeleteBuffers(1, &planeVBO);

	glfwTerminate();
	return 0;
}

```
> # Components

## Shader.h
```cpp
#pragma once

#ifndef SHADER_H
#define SHADER_H

#include<glad.h> //包含glad来获取所有的必须OpenGL的头文件

#include<cstring>
#include<string>
#include<ostream>
#include<fstream>
#include<sstream>
#include<iostream>
#include <glm/glm.hpp>

class Shader
{
public:
	//程序ID
	unsigned int ID;

	//构造器读取并构建着色器
	Shader(const GLchar* vertexPath, const GLchar* fragmentPath, const GLchar* geometryPath = nullptr);

	//使用/激活程序
	void use();
	//uniform工具函数
	void  setBool(const std::string &name, const  bool &value)const;
	void   setInt(const std::string &name, const   int &value)const;
	void setFloat(const std::string &name, const float &value)const;
	void  setVec2(const std::string &name, const float &x, const float &y)const;
	void  setVec3(const std::string &name, const float &x, const float &y, const float &z)const;
	void  setVec4(const std::string &name, const float &x, const float &y, const float &z, const float &w)const;

	void  setVec2(const std::string &name, const glm::vec2 &value)const;
	void  setVec3(const std::string &name, const glm::vec3 &value)const;
	void  setVec4(const std::string &name, const glm::vec4 &value)const;

	void  setMat2(const std::string &name, const glm::mat2 &value)const;
	void  setMat3(const std::string &name, const glm::mat3 &value)const;
	void  setMat4(const std::string &name, const glm::mat4 &value)const;


private:
	void checkCompileErrors(unsigned int shader, std::string type);
};


Shader::Shader(const GLchar* vertexPath, const GLchar* fragmentPath, const GLchar* geometryPath)
{
	//1.从文件路径中获取顶点/片段着色器
	std::string vertexCode;
	std::string fragmentCode;
	std::string geometryCode;
	std::ifstream vShaderFile;
	std::ifstream fShaderFile;
	std::ifstream gShaderFile;
	//保证ifstream对象可以抛出异常
	vShaderFile.exceptions(std::ifstream::failbit | std::ifstream::badbit);
	fShaderFile.exceptions(std::ifstream::failbit | std::ifstream::badbit);
	gShaderFile.exceptions(std::ifstream::failbit | std::ifstream::badbit);
	try
	{
		//打开文件
		vShaderFile.open(vertexPath);
		fShaderFile.open(fragmentPath);
		std::stringstream vShaderStream, fShaderStream;
		//读取文件的缓冲内容到数据流中
		vShaderStream << vShaderFile.rdbuf();
		fShaderStream << fShaderFile.rdbuf();
		//关闭文件处理器
		vShaderFile.close();
		fShaderFile.close();
		//转换数据流到string
		vertexCode = vShaderStream.str();
		fragmentCode = fShaderStream.str();
		if (geometryPath != nullptr)
		{
			gShaderFile.open(geometryPath);
			std::stringstream gShaderStream;
			gShaderStream << gShaderFile.rdbuf();
			gShaderFile.close();
			geometryCode = gShaderStream.str();
		}
	}
	catch (std::ifstream::failure e)
	{
		std::cout << "ERROR::SHADER::FILE_NOT_SUCCESSFULLY_READ" << std::endl;
	}
	const char* vShaderCode = vertexCode.c_str();
	const char* fShaderCode = fragmentCode.c_str();
	//2.编译着色器
	//顶点着色器
	unsigned int vertexShader;
	vertexShader = glCreateShader(GL_VERTEX_SHADER);
	glShaderSource(vertexShader, 1, &vShaderCode, NULL);
	glCompileShader(vertexShader);
	checkCompileErrors(vertexShader, "VERTEX");
	/*//检测调用CompileShader后编译是否成功
	int success;
	char infoLog[512];
	glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &success);
	if (!success)
	{
	glGetShaderInfoLog(vertexShader, 512, NULL, infoLog);
	std::cout << "ERROR::SHADER::VERTEX::COMPILATION_FAILED\n" << infoLog << std::endl;
	}*/
	//片段着色器
	unsigned int fragmentShader;
	fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
	glShaderSource(fragmentShader, 1, &fShaderCode, NULL);
	glCompileShader(fragmentShader);
	checkCompileErrors(fragmentShader, "FRAGMENT");
	/*glGetShaderiv(fragmentShader, GL_COMPILE_STATUS, &success);
	if (!success)
	{
	glGetShaderInfoLog(fragmentShader, 512, NULL, infoLog);
	std::cout << "ERROR::SHADER::FRAGMENT::COMPILATION_FAILED\n" << infoLog << std::endl;
	}*/

	//着色器程序
	ID = glCreateProgram();
	glAttachShader(ID, vertexShader);
	glAttachShader(ID, fragmentShader);
	glLinkProgram(ID);
	checkCompileErrors(ID, "PROGRAM");
	/*//检测链接着色器程序是否失败
	glGetProgramiv(ID, GL_LINK_STATUS, &success);
	if (!success)
	{
	glGetProgramInfoLog(ID, 512, NULL, infoLog);
	std::cout << "ERROR::SHADER::PROGRAM::LINKING_FAILED\n" << infoLog << std::endl;
	}*/
	//把着色器对象链接到程序对象以后，记得删除着色器对象，我们不再需要它们了
	glDeleteShader(vertexShader);
	glDeleteShader(fragmentShader);
}
void Shader::use()
{
	glUseProgram(ID);
}

void Shader::setBool(const std::string &name,const bool &value)const
{
	glUniform1i(glGetUniformLocation(ID, name.c_str()), (int)value);
}

void Shader::setInt(const std::string &name,const int &value)const
{
	glUniform1i(glGetUniformLocation(ID, name.c_str()), value);
}

void Shader::setFloat(const std::string &name,const float &value)const
{
	glUniform1f(glGetUniformLocation(ID, name.c_str()), value);
}

void Shader::setVec2(const std::string &name, const float &x, const float &y)const
{
	glUniform2f(glGetUniformLocation(ID, name.c_str()), x, y);
}

void Shader::setVec3(const std::string &name, const float &x, const float &y, const float &z)const
{
	glUniform3f(glGetUniformLocation(ID, name.c_str()), x, y, z);
}

void Shader::setVec4(const std::string &name,const float &x,const float &y,const float &z,const float &w)const
{
	glUniform4f(glGetUniformLocation(ID, name.c_str()), x, y, z, w);
}

void Shader::setVec2(const std::string &name, const glm::vec2 &value)const
{
	glUniform2fv(glGetUniformLocation(ID, name.c_str()),1, &value[0]);
}

void Shader::setVec3(const std::string &name, const glm::vec3 &value)const
{
	glUniform3fv(glGetUniformLocation(ID, name.c_str()), 1, &value[0]);
}

void Shader::setVec4(const std::string &name, const glm::vec4 &value)const
{
	glUniform4fv(glGetUniformLocation(ID, name.c_str()), 1, &value[0]);
}

void Shader::setMat2(const std::string &name, const glm::mat2 &value)const
{
	glUniformMatrix2fv(glGetUniformLocation(ID, name.c_str()), 1, GL_FALSE, &value[0][0]);
}

void Shader::setMat3(const std::string &name, const glm::mat3 &value)const
{
	glUniformMatrix3fv(glGetUniformLocation(ID, name.c_str()), 1, GL_FALSE, &value[0][0]);
}

void Shader::setMat4(const std::string &name,const glm::mat4 &value)const
{
	glUniformMatrix4fv(glGetUniformLocation(ID, name.c_str()), 1, GL_FALSE, &value[0][0]);
}

void Shader::checkCompileErrors(unsigned int shader, std::string type)
{
	int success;
	char infoLog[1024];
	if (type != "PROGRAM")
	{
		glGetShaderiv(shader, GL_COMPILE_STATUS, &success);
		if (!success)
		{
			glGetShaderInfoLog(shader, 1024, NULL, infoLog);
			std::cout << "ERROR::SHADER_COMPILATION_ERROR of type: " << type << "\n" << infoLog << "\n -- --------------------------------------------------- -- " << std::endl;
		}
	}
	else
	{
		glGetProgramiv(shader, GL_LINK_STATUS, &success);
		if (!success)
		{
			glGetProgramInfoLog(shader, 1024, NULL, infoLog);
			std::cout << "ERROR::PROGRAM_LINKING_ERROR of type: " << type << "\n" << infoLog << "\n -- --------------------------------------------------- -- " << std::endl;
		}
	}
}
#endif
```

## Camera.h
```cpp
#pragma once
#ifndef CAMERA_H
#define CAMERA_H
#define GLM_FORCE_RADIANS
#include<glad.h>
#include<glm/glm.hpp>
#include<glm/gtc/matrix_transform.hpp>
#include<vector>

enum Camera_Movement
{
	FORWARD,
	BACKWARD,
	LEFT,
	RIGHT,
	ROLL_ADD,
	ROLL_REDUCE
};

//Pitch 俯仰角，绕x轴
//Yaw 偏航角，绕y轴
//Roll 滚转角，绕z轴

//Default camera values
const float YAW = -90.0f;
const float PITCH = 0.0f;
const float ROLL = 0.0f;

const float SPEED = 2.5f;
const float SENSITIVITY = 0.05f;
const float ZOOM = 45.0f;
const glm::vec3 CAMERAFRONT = glm::vec3(0.0f, 0.0f, -1.0f);

////////////////
//以右手笛卡尔坐标为基准
//摄像机假定在x正半轴、z负半轴、y正半轴的空间内
//刚开始摄像机视线位置与z轴正半轴平行,上向量与y轴平行，右向量与x轴平行
//当摄像机视线对准源点时
//相当于视线先Yaw旋转至于y轴相交
//再将视线Pitch旋转至于源点相交
//那么此时Yaw就是视线对准原点后，在x-z轴平面的投影与z负半轴的夹角
//而Pitch就是视线与x-z轴平面的夹角

//direction.y = sin(glm::radians(pitch)); // 注意我们先把角度转为弧度
//direction.x = cos(glm::radians(pitch));
//direction.z = cos(glm::radians(pitch));

//direction.x = cos(glm::radians(pitch)) * cos(glm::radians(yaw)); // 译注：direction代表摄像机的前轴(Front)，这个前轴是和本文第一幅图片的第二个摄像机的方向向量是相反的
//direction.y = sin(glm::radians(pitch));
//direction.z = cos(glm::radians(pitch)) * sin(glm::radians(yaw));
/////////
class Camera
{
public:
	//Constructor with vectors
	Camera(glm::vec3 position = glm::vec3(0.0f, 0.0f, -3.0f), glm::vec3 cameraup = glm::vec3(0.0f, 1.0f, 0.0f), float yaw = YAW, float pitch = PITCH,float roll=ROLL);

	// Constructor with scalar values
	Camera(float posX, float posY, float posZ, float upX, float upY, float upZ, float yaw=YAW, float pitch=PITCH,float roll=ROLL);

	//Returns the view matrix calculated using Eular Angles and the LookAt Matrix
	glm::mat4 GetViewMatrix()const;

	// Processes input received from any keyboard-like input system. Accepts input parameter in the form of camera defined ENUM (to abstract it from windowing systems)
	void ProcessKeyboard(Camera_Movement direction, float deltaTime);

	// Processes input received from a mouse input system. Expects the offset value in both the x and y direction.
	void ProcessMouseMovement(float xoffset, float yoffset, GLboolean constrainPitch = true);

	// Processes input received from a mouse scroll-wheel event. Only requires input on the vertical wheel-axis
	void ProcessMouseScroll(float yoffset);

	void SetYaw(float yaw);
	void SetPitch(float pitch);
	void SetRoll(float roll);
	void SetMovementSpeed(float movementSpeed);
	void SetMouseSensitivity(float mouseSensitivity);
	void SetZoom(float zoom);

	float GetYaw()const;
	float GetPitch()const;
	float GetRoll()const;
	float GetMovementSpeed()const;
	float GetMouseSensitivity()const;
	float GetZoom()const;

	glm::vec3 GetPosition()const;
	glm::vec3 GetCameraFront()const;
private:
	//Calculates teh front vector from the Camera's (updated) Eular Angles
	void updateCameraVectors();


	//Camera Attributes
	glm::vec3 cameraPosition;
	glm::vec3 cameraFront;//这里的方向与摄像机视线方向一致而不是相反
	glm::vec3 cameraUp;
	glm::vec3 cameraRight;
	glm::vec3 WorldUp;

	//Camera angles
	float Yaw;
	float Pitch;
	float Roll;

	//Camera options
	float MovementSpeed;
	float MouseSensitivity;
	float Zoom;
};

Camera::Camera(glm::vec3 position, glm::vec3 cameraup, float yaw , float pitch,float roll) :cameraFront(CAMERAFRONT), MovementSpeed(SPEED), MouseSensitivity(SENSITIVITY), Zoom(ZOOM)
{
	cameraPosition = position;
	WorldUp = cameraup;
	cameraUp = cameraup;
	Yaw = yaw;
	Pitch = pitch;
	Roll = roll;
	updateCameraVectors();
}

Camera::Camera(float posX, float posY, float posZ, float upX, float upY, float upZ, float yaw, float pitch,float roll) : cameraFront(glm::vec3(0.0f, 0.0f, -1.0f)), MovementSpeed(SPEED), MouseSensitivity(SENSITIVITY), Zoom(ZOOM)
{
	cameraPosition = glm::vec3(posX, posY, posZ);
	WorldUp = glm::vec3(upX, upY, upZ);
	cameraUp = glm::vec3(upX, upY, upZ);
	Yaw = yaw;
	Pitch = pitch;
	Roll = roll;
	updateCameraVectors();
}

void Camera::ProcessKeyboard(Camera_Movement direction, float deltaTime)
{
	float velocity = MovementSpeed * deltaTime;
	if (direction == FORWARD)
		cameraPosition += cameraFront * velocity;

	if (direction == BACKWARD)
		cameraPosition -= cameraFront * velocity;

	if (direction == LEFT)
		cameraPosition -= cameraRight * velocity;

	if (direction == RIGHT)
		cameraPosition += cameraRight * velocity;



	if (direction == ROLL_ADD)
	{
		//Roll +=(float)0.05*deltaTime;
		Roll += 10 * velocity;

	}

	if (direction == ROLL_REDUCE)
	{
		Roll -= 10 * velocity;
	}

}

void Camera::ProcessMouseMovement(float xoffset, float yoffset, GLboolean constrainPitch)
{
	xoffset *= MouseSensitivity;
	yoffset *= MouseSensitivity;

	Yaw += xoffset;
	Pitch += yoffset;

	// Make sure that when pitch is out of bounds, screen doesn't get flipped
	if (constrainPitch)
	{
		if (Pitch > 89.0f)
			Pitch = 89.0f;
		if (Pitch < -89.0f)
			Pitch = -89.0f;
	}

	// Update Front, Right and Up Vectors using the updated Eular angles
	updateCameraVectors();
}

void Camera::ProcessMouseScroll(float yoffset)
{
	if (Zoom >= 1.0f && Zoom <= 45.0f)
		Zoom -= yoffset;
	if (Zoom <= 1.0f)
		Zoom = 1.0f;
	if (Zoom >= 45.0f)
		Zoom = 45.0f;
}

glm::mat4 Camera::GetViewMatrix()const
{
	/*// Rotate the cameraUp
	glm::mat4 temp;
	glm::vec4 rotateUp = glm::vec4(cameraUp.x, cameraUp.y, cameraUp.z, 0.0f);
	temp = glm::rotate(temp, glm::radians(Roll), cameraFront);
	rotateUp = temp*rotateUp;//嘻嘻
	cameraUp = glm::normalize(glm::vec3(rotateUp.x, rotateUp.y, rotateUp.z));*/

	glm::mat4 view = glm::lookAt(cameraPosition, cameraPosition + cameraFront, WorldUp);

	return glm::rotate(view, glm::radians(Roll), cameraFront);
	//return view;
}

void Camera::updateCameraVectors()
{
	//Calculate the new Front vector
	glm::vec3 front;
	//std::cout << Yaw << " " << Pitch << std::endl;
	front.x = cos(glm::radians(Yaw))*cos(glm::radians(Pitch));
	front.y = sin(glm::radians(Pitch));
	front.z = sin(glm::radians(Yaw))*cos(glm::radians(Pitch));
	//front=glm::vec3(0.0f, 0.0f, 0.0f);
	cameraFront = glm::normalize(front);

	/*if (bRoll)
	{
		// Rotate the cameraUp
		glm::mat4 temp;
		glm::vec4 rotateUp = glm::vec4(cameraUp.x, cameraUp.y, cameraUp.z, 0.0f);
		temp = glm::rotate(temp, glm::radians(Roll), cameraFront);
		rotateUp = temp*rotateUp;//嘻嘻
		cameraUp = glm::normalize(glm::vec3(rotateUp.x, rotateUp.y, rotateUp.z));
	}*/

	/*std::cout << "cameraRight: " << cameraRight.x << " " << cameraRight.y << " " << cameraRight.z << std::endl;
	std::cout << "cameraUp: " << cameraUp.x << " " << cameraUp.y << " " << cameraUp.z << std::endl;
	std::cout << "cameraFront: " << cameraFront.x << " " << cameraFront.y << " " << cameraFront.z << std::endl;
	std::cout << std::endl << "=========================================================" << std::endl << std::endl;
	std::cout << "cameraPosition: " << cameraPosition.x << " " << cameraPosition.y << " " << cameraPosition.z << std::endl;
	std::cout << "(cameraPosition + cameraFront): " << (cameraPosition + cameraFront).x << " " << (cameraPosition + cameraFront).y << " " << (cameraPosition + cameraFront).z << std::endl;*/

	//Also re-calculate the Right and Up vector;
	cameraRight = glm::normalize(glm::cross(cameraFront, cameraUp));//那个view旋转怎么感觉是旋转了世界空间的物体，而保持了摄像机不变啊！！！


	//WorldUp = cameraUp;
	//cameraUp = glm::normalize(glm::cross(cameraRight, cameraFront));
}


void Camera::SetYaw(float yaw)
{
	Yaw = yaw;
}

void Camera::SetPitch(float pitch)
{
	Pitch = pitch;
}

void Camera::SetRoll(float roll)
{
	Roll = roll;
}

void Camera::SetMovementSpeed(float movementSpeed)
{
	MovementSpeed = movementSpeed;
}

void Camera::SetMouseSensitivity(float mouseSensitivity)
{
	MouseSensitivity = mouseSensitivity;
}

void Camera::SetZoom(float zoom)
{
	Zoom = zoom;
}

float Camera::GetYaw()const
{
	return Yaw;
}

float Camera::GetPitch()const
{
	return Pitch;
}

float Camera::GetRoll()const
{
	return Roll;
}

float Camera::GetMovementSpeed()const
{
	return MovementSpeed;
}

float Camera::GetMouseSensitivity()const
{
	return MouseSensitivity;
}

float Camera::GetZoom()const
{
	return Zoom;
}

glm::vec3 Camera::GetPosition()const
{
	return cameraPosition;
}

glm::vec3 Camera::GetCameraFront()const
{
	return cameraFront;
}

#endif
```

## Mesh.h
```cpp
#pragma once

#ifndef MESH_H
#define MESH_H

#include<glad.h>
#define GLM_FORCE_RADIANS
#include<glm/glm.hpp>
#include<glm/gtc/matrix_transform.hpp>
#include<Shader.h>

#include<string>
#include<cstring>
#include<fstream>
#include<sstream>
#include<iostream>
#include<vector>

struct Vertex
{
	glm::vec3 Position; //顶点位置向量
	glm::vec3 Normal; //法向量
	glm::vec2 TexCoords; //纹理坐标
	glm::vec3 Tangent;//切线
	glm::vec3 Bitangent; //双切线
};

struct Texture
{
	unsigned int id; //纹理id
	std::string type; //纹理类型，比如漫反射贴图或者镜面光贴图
	std::string path;
	//aiString path;
};

class Mesh
{
public:
	//函数
	Mesh(std::vector<Vertex> vertices, std::vector<unsigned int> indices, std::vector<Texture> textures);//带参构造函数
	void Draw(Shader shader);//绘制网格
private:
	//网格数据
	std::vector<Vertex> vertices; //顶点
	std::vector<unsigned int> indices; //索引
	std::vector<Texture> textures; //纹理

	//渲染数据
	unsigned int VAO, VBO, EBO;//顶点数组对象，顶点缓冲对象，索引缓冲对象

	//函数
	void setupMesh(); //设置初始化缓冲
};

Mesh::Mesh(std::vector<Vertex> vertices, std::vector<unsigned int> indices, std::vector<Texture> textures)
{
	this->vertices = vertices;
	this->indices = indices;
	this->textures = textures;
	setupMesh();
}
void Mesh::setupMesh()
{
	glGenVertexArrays(1, &VAO);//生成顶点数组对象
	glGenBuffers(1, &VBO);//生成顶点缓冲对象
	glGenBuffers(1, &EBO);//生成索引缓冲对象

	glBindVertexArray(VAO);//绑定顶点数组对象

	glBindBuffer(GL_ARRAY_BUFFER, VBO);//绑定顶点缓冲对象
	glBufferData(GL_ARRAY_BUFFER, vertices.size() * sizeof(Vertex), &vertices[0], GL_STATIC_DRAW);


	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);//绑定索引缓冲对象
	glBufferData(GL_ELEMENT_ARRAY_BUFFER, indices.size() * sizeof(unsigned int), &indices[0], GL_STATIC_DRAW);

	//顶点位置

	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)0);
	glEnableVertexAttribArray(0);
	//法向量

	glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, Normal));
	glEnableVertexAttribArray(1);
	//顶点纹理坐标

	glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, TexCoords));
	glEnableVertexAttribArray(2);
	//切线

	glVertexAttribPointer(3, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, Tangent));
	glEnableVertexAttribArray(3);
	//反切线

	glVertexAttribPointer(4, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, Bitangent));
	glEnableVertexAttribArray(4);

	glBindVertexArray(0);//恢复默认值

}

void Mesh::Draw(Shader shader)
{
	//纹理命名标准
	//漫反射纹理texture_diffuseN，镜面光反射纹理texture.specularN
	//uniform sampler2D texture_diffuse1;
	//uniform sampler2D texture_diffuse2;
	//uniform sampler2D texture_diffuse3;
	//uniform sampler2D texture_specular1;
	//uniform sampler2D texture_specular2;
	unsigned int diffuseNr = 1;
	unsigned int specularNr = 1;
	unsigned int normalNr = 1;
	unsigned int heightNr = 1;
	for (unsigned int i = 0; i < textures.size(); i++)
	{
		glActiveTexture(GL_TEXTURE0 + i);//在绑定之前激活相应的纹理单元

		//获取纹理序号(texture_diffuseN中的N)
		//std::stringstream ss;
		std::string number;
		std::string name = textures[i].type;

		if (name == "texture_diffuse")
		{
			//ss << diffuseNr++;//将usigned int 插入到流中
			number = std::to_string(diffuseNr++);
		}
		else if (name == "texture_specular")
		{
			//ss << specularNr++;//将unsigned int插入到流中
			number = std::to_string(specularNr++);
		}
		else if (name == "texture_normal")
		{
			//ss << normalNr++;
			number = std::to_string(normalNr++);
		}
		else if (name == "texture_height")
		{
			//ss << heightNr++;
			number = std::to_string(heightNr++);
		}
		//number = ss.str();
		//glUniform1i(glGetUniformLocation(shader.ID, ("material." + name + number).c_str()), i);
		shader.setInt(("material." + name + number).c_str(), i);//设置纹理uniform
		glBindTexture(GL_TEXTURE_2D, textures[i].id);//绑定纹理
	}

	//绘制网格
	glBindVertexArray(VAO);
	glDrawElements(GL_TRIANGLES, indices.size(), GL_UNSIGNED_INT, 0);

	glBindVertexArray(0);//恢复默认值，教程说这是一个好习惯
	glActiveTexture(GL_TEXTURE0);

}
#endif
```

## Model.h
```cpp
#pragma once
#ifndef MODEL_H
#define MODEL_H

#include<glad.h>
#define GLM_FORCE_RADIANS

#include<glm/glm.hpp>
#include<glm/gtc/matrix_transform.hpp>
#include<stb_image.h>
#include<assimp/Importer.hpp>
#include<assimp/scene.h>
#include<assimp/postprocess.h>

#include<Mesh.h>
#include<Shader.h>

#include<string>
#include<cstring>
#include<sstream>
#include<iostream>
#include<vector>

class Model
{
public:
	//函数
	Model(std::string const &path);//带参构造函数
	void Draw(Shader shader);

private:
	//模型数据
	std::vector<Texture> textures_loaded; //希望不重复加载纹理
	std::vector<Mesh> meshes;//模型包含多个网格
	std::string directory;
	//函数
	void loadModel(std::string const &path);//加载模型场景
	void processNode(aiNode *node, const aiScene *scene); //加载场景中的所有节点获取所有网格
	Mesh processMesh(aiMesh *mesh, const aiScene *scene);//处理Assimp网格数据转换成自己的Mesh
	std::vector<Texture> loadMaterialTextures(aiMaterial *mat, aiTextureType type, std::string typeName);//加载纹理
	unsigned int TextureFromFile(const char *path, const std::string &directory);//加载纹理贴图并返回纹理ID
};

Model::Model(std::string const &path)
{
	loadModel(path);
}

void Model::Draw(Shader shader)
{
	for (unsigned int i = 0; i < meshes.size(); i++)
	{
		meshes[i].Draw(shader);//遍历模型网格并绘制
	}
}

//加载模型场景
void Model::loadModel(std::string const &path)
{
	//加载模型场景
	Assimp::Importer import;
	const aiScene *scene = import.ReadFile(path, aiProcess_Triangulate | aiProcess_FlipUVs | aiProcess_CalcTangentSpace);
	//加载模型后，检查场景和其根节点不为null，并且检查了它的一个标记(Flag)，一次查看返回的数据是否不完整
	//如果遇到任何错误，我们都会通过导入期的GetErrorString函数来报告错误并返回
	if (!scene || scene->mFlags & AI_SCENE_FLAGS_INCOMPLETE || !scene->mRootNode)
	{
		std::cout << "ERROR::ASSIMP::" << import.GetErrorString() << std::endl;
		return;
	}
	directory = path.substr(0, path.find_last_of('/'));
	processNode(scene->mRootNode,scene);

}

//从Assimp的节点对象中遍历所有节点的网格并载入我们的网格对象
void Model::processNode(aiNode *node, const aiScene *scene)
{
	//处理节点所有的网格（如果有的话）
	for (unsigned int i = 0; i < node->mNumMeshes; i++)
	{
		aiMesh *mesh = scene->mMeshes[node->mMeshes[i]];
		meshes.push_back(processMesh(mesh, scene));
	}
	//接下来对它的子节点重复这一过程
	for (unsigned int i = 0; i < node->mNumChildren; i++)
	{
		processNode(node->mChildren[i],scene);
	}

}

//将Assimp的aiMesh对象转化为我们自己的网格对象
Mesh Model::processMesh(aiMesh *mesh, const aiScene *scene)
{
	std::vector<Vertex> vertices;
	std::vector<unsigned int > indices;
	std::vector<Texture> textures;

	for (unsigned int i = 0; i < mesh->mNumVertices; i++)
	{
		Vertex vertex;
		//处理顶点位置
		glm::vec3 vector;
		vector.x = mesh->mVertices[i].x;
		vector.y = mesh->mVertices[i].y;
		vector.z = mesh->mVertices[i].z;
		vertex.Position = vector;
		//处理法线
		vector.x = mesh->mNormals[i].x;
		vector.y = mesh->mNormals[i].y;
		vector.z = mesh->mNormals[i].z;
		vertex.Normal = vector;
		//处理纹理坐标
		if (mesh->mTextureCoords[0])//网格是否有纹理坐标
		{
			glm::vec2 vec;
			vec.x = mesh->mTextureCoords[0][i].x;
			vec.y = mesh->mTextureCoords[0][i].y;
			vertex.TexCoords = vec;
		}
		else
		{
			vertex.TexCoords = glm::vec2(0.0f, 0.0f);
		}
		//切线
		vector.x = mesh->mTangents[i].x;
		vector.y = mesh->mTangents[i].y;
		vector.z = mesh->mTangents[i].z;
		vertex.Tangent = vector;
		//反切线
		vector.x = mesh->mBitangents[i].x;
		vector.y = mesh->mBitangents[i].y;
		vector.z = mesh->mBitangents[i].z;
		vertex.Bitangent = vector;
		vertices.push_back(vertex);
	}
	//处理索引
	for (unsigned int i = 0; i < mesh->mNumFaces; i++)
	{
		aiFace face = mesh->mFaces[i];
		for (unsigned int j = 0; j < face.mNumIndices; j++)
		{
			indices.push_back(face.mIndices[j]);
		}
	}
	//处理材质
	if (mesh->mMaterialIndex >= 0)
	{
		aiMaterial *material = scene->mMaterials[mesh->mMaterialIndex];
		//漫反射纹理
		std::vector<Texture> diffuseMaps = loadMaterialTextures(material, aiTextureType_DIFFUSE, "texture_diffuse");
		textures.insert(textures.end(), diffuseMaps.begin(), diffuseMaps.end());
		//镜面反射纹理
		std::vector<Texture> specularMaps = loadMaterialTextures(material, aiTextureType_SPECULAR, "texture_specular");
		textures.insert(textures.end(), specularMaps.begin(), specularMaps.end());

		std::vector<Texture> normalMaps = loadMaterialTextures(material, aiTextureType_HEIGHT, "texture_normal");
		textures.insert(textures.end(), normalMaps.begin(), normalMaps.end());

		std::vector<Texture> heightMaps = loadMaterialTextures(material, aiTextureType_AMBIENT, "texture_height");
		textures.insert(textures.end(), heightMaps.begin(), heightMaps.end());
	}
	return Mesh(vertices, indices, textures);
}

std::vector<Texture> Model::loadMaterialTextures(aiMaterial *mat, aiTextureType type, std::string typeName)
{
	std::vector<Texture> textures;

	for (unsigned int i = 0; i < mat->GetTextureCount(type); i++)
	{
		aiString str;
		mat->GetTexture(type, i, &str);
		bool skip = false;
		for (unsigned int j = 0; j < textures_loaded.size(); j++)
		{
			if (std::strcmp(textures_loaded[j].path.c_str(), str.C_Str())==0)
			{
				textures.push_back(textures_loaded[j]);
				skip = true;
				break;
			}
		}
		//如果纹理还没有被加载，则加载它
		if (!skip)
		{
			Texture texture;
			texture.id = TextureFromFile(str.C_Str(), this->directory);
			texture.type = typeName;
			texture.path = str.C_Str();
			textures.push_back(texture);
			textures_loaded.push_back(texture);
		}
	}
	return textures;
}

unsigned int Model::TextureFromFile(const char *path, const std::string &directory)
{
	std::string filename = std::string(path);
	filename = directory + '/' + filename;

	unsigned int textureID;
	glGenTextures(1, &textureID);

	int width, height, nrComponents;
	unsigned char *data = stbi_load(filename.c_str(), &width, &height, &nrComponents, 0);
	if (data)
	{
		GLenum format;
		if (nrComponents == 1)
		{
			format = GL_RED;
		}
		else if (nrComponents == 3)
		{
			format = GL_RGB;
		}
		else if (nrComponents == 4)
		{
			format = GL_RGBA;
		}
		glBindTexture(GL_TEXTURE_2D, textureID);
		glTexImage2D(GL_TEXTURE_2D, 0, format, width, height, 0, format, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);

		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
		stbi_image_free(data);

	}
	else
	{
		std::cout << "Texture failed to load at path: " << path << std::endl;
		stbi_image_free(data);
	}

	return textureID;
}
#endif
```

## Shader.vs

```cpp
#version 330 core
//模型加载
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aTexCoord;
layout(location = 3) in vec3 Tangent;
layout(location = 4) in vec3 Bitangent;

//光照
//layout(location = 0) in vec3 aPos;
//layout(location = 1) in vec4 aColor;
//layout(location = 2) in vec2 aTexCoord;
//layout(location = 3) in vec3 aNormal;

//深度测试
//layout(location = 0) in vec3 aPos;
//layout(location = 1) in vec4 aColor;
//layout(location = 2) in vec2 aTexCoord;
//layout(location = 3) in vec3 aNormal;

//out vec4 ourColor;
out vec2 TexCoord;
out vec3 Normal;
out vec3 FragPos;

uniform mat4 transform;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform mat3 Normal_Matrix;

void main()
{
    // gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);
    //gl_Position = transform*vec4(aPos.x, aPos.y, aPos.z, 1.0);

    //V_clip=M_projection*M_view*M_model*V_local
    gl_Position = projection*view*model*vec4(aPos,1.0);
    //ourColor=aColor;

	////////////////////////////////////////////////////
   TexCoord=aTexCoord;

	//////////////////////////////////////////////////////////////////
	//原理未知...
	FragPos=vec3(model*vec4(aPos,1.0));

	//Normal=aNormal;
	//法线矩阵修复model旋转和缩放带来的影响，当然model位移并不影响法向量
	//法线矩阵为模型矩阵左上角的逆矩阵的转置矩阵
	//具体原理暂且过，现在会用就成
	//线性代数好奇妙啊！！！~~~有木有！！！！
	//逆矩阵(Inverse Matrix)和转置矩阵(Transpose Matrix)
	//Normal=mat3(transpose(inverse(model)))*aNormal;
	Normal=transpose(inverse(mat3(model)))*aNormal;//与上述等价，哦，我就试试，果然啊，线性代数真奇妙！

	//即使是对于着色器来说，逆矩阵也是一个开销比较大的运算，
	//因此，只要可能就应该避免在着色器中进行逆矩阵运算，
	//它们必须为你场景中的每个顶点都进行这样的处理。用作学习目这样做是可以的，
	//但是对于一个对效率有要求的应用来说，在绘制之前你最好用CPU计算出法线矩阵，
	//然后通过uniform把值传递给着色器（像模型矩阵一样）。
	//mmp，那就用cpu和uniform传一个咯，真的是
	/////////////////////////////////////////////////////////////
	//Normal=Normal_Matrix*aNormal;



	//////////////////////////////////////////////////////////////////////////////

}

```

## Shader.fs
```cpp
#version 330 core
out vec4 FragColor;
//in vec4 ourColor;
in vec2 TexCoord;
in vec3 Normal;
in vec3 FragPos;
uniform sampler2D texture_diffuse1;
uniform sampler2D texture_diffuse2;
uniform sampler2D texture_diffuse3;
uniform sampler2D texture_diffuse4;
uniform sampler2D texture_diffuse5;
uniform sampler2D texture_diffuse6;
uniform sampler2D texture_diffuse7;
uniform sampler2D texture_specular1;
uniform sampler2D texture_specular2;
uniform sampler2D texture_specular3;
uniform sampler2D texture_specular4;
uniform sampler2D texture_specular5;
uniform sampler2D texture_specular6;
uniform sampler2D texture_specular7;
uniform sampler2D texture_normal1;
uniform sampler2D texture_normal2;
uniform sampler2D texture_normal3;
uniform sampler2D texture_normal4;
uniform sampler2D texture_normal5;
uniform sampler2D texture_normal6;
uniform sampler2D texture_normal7;
uniform sampler2D texture_height1;
uniform sampler2D texture_height2;
uniform sampler2D texture_height3;
uniform sampler2D texture_height4;
uniform sampler2D texture_height5;
uniform sampler2D texture_height6;
uniform sampler2D texture_height7;
uniform sampler2D ourTexture;
//uniform sampler2D faceTexture;
//uniform vec4 ourColor;
uniform float proportion;

uniform vec4 objectColor;
uniform vec4 lightColor;
uniform vec3 lightPos;
uniform vec3 viewPos;

struct Material
{
	//vec3 ambient; //环境光照下物体反射的颜色
	//vec3 diffuse; //漫反射光照下物体的颜色
	//sampler2D diffuse;
	sampler2D texture_diffuse1;
	//vec3 specular; //镜面放射光照对物体颜色的影响
	//sampler2D specular;
	sampler2D texture_specular1;
	float shininess; //镜面高光的散射/半径
};
uniform Material material;


struct Light
{
	vec3 position; //光源位置
	vec3 direction;//光线方向

	vec3 ambient;
	vec3 diffuse;
	vec3 specular;

	//光的衰减
	float constant;//常数项
	float linear;//一次项
	float quadratic;//二次项

	//聚光
	float cutOff;//内光角
	float outerCutOff;//外光角
};
uniform Light light;

struct DirLight
{
	vec3 direction;

	vec3 ambient;
	vec3 diffuse;
	vec3 specular;

};//定向光
uniform DirLight dirLight;

struct PointLight
{
	vec3 position;

	//衰减参数
	float constant;//常数项
	float linear;//一次项
	float quadratic;//二次项

	vec3 ambient;
	vec3 diffuse;
	vec3 specular;


};//点光源
#define NR_POINT_LIGHTS 4
uniform PointLight pointLights[NR_POINT_LIGHTS];

struct SpotLight
{

	vec3 position; //光源位置
	vec3 direction;//光线方向

	vec3 ambient;
	vec3 diffuse;
	vec3 specular;


	//光的衰减
	float constant;//常数项
	float linear;//一次项
	float quadratic;//二次项

	//聚光
	float cutOff;//内光角
	float outerCutOff;//外光角
};
uniform SpotLight spotLight;

vec4 CalcDirLight(DirLight light,vec3 normal,vec3 viewDir);
vec4 CalcPointLight(PointLight light,vec3 normal,vec3 fragPos,vec3 viewDir);
vec4 CalcSpotLight(SpotLight light,vec3 normal,vec3 fragPos,vec3 viewDir);

void main()
{
	//FragColor = texture(texture_diffuse1,TexCoord).rgba;
	//FragColor=texture(ourTexture,TexCoord);
	//FragColor=vec4(vec3(gl_FragCoord.z), 1.0);
	//FragColor = vec4(0.04, 0.28, 0.26, 1.0);
	//return;
	///////////////////////////////////////////////////////////////////////////
    //基本颜色和纹理加载
	//FragColor = ourColor;
    //FragColor = vec4(0.0f,ourColor,0.0f,1.0f);
    //FragColor = vec4(ourColor,1.0f);
    //第一个参数是纹理采样器，第二个参数是对应的纹理坐标。
    //FragColor = texture(ourTexture,TexCoord);
    //FragColor = texture(faceTexture,TexCoord);
    //FragColor = texture(ourTexture,TexCoord)+ourColor;
    //FragColor = mix(texture(ourTexture,TexCoord),texture(faceTexture,TexCoord),0.5);
    //FragColor = mix(texture(ourTexture,TexCoord),texture(faceTexture,TexCoord),0.5)+ourColor;
    //FragColor = mix(texture(ourTexture,TexCoord),texture(faceTexture,TexCoord),proportion);
    //FragColor = mix(texture(ourTexture,TexCoord),texture(faceTexture,TexCoord),proportion)+ourColor;
	/////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////
	//多光源合并结果
	//属性
	vec3 norm=normalize(Normal);
	vec3 viewDir=normalize(viewPos-FragPos);
	vec4 result;
	//定向光照
	result=CalcDirLight(dirLight,norm,viewDir);
	//点光源
	/*for(int i=0;i<NR_POINT_LIGHTS;i++)
	{
		result+=CalcPointLight(pointLights[i],norm,FragPos,viewDir);
	}*/
	//聚光
	//result+=CalcSpotLight(spotLight,norm,FragPos,viewDir);

	FragColor=vec4(result.x,result.y,result.z,1.0f);
	return;
	////////////////////////////////////////////////////////////////////

	//以下内容保留，学习过程历证，嘻嘻嘻~~~
	///////////////////////////////////////////////////
	//基础光照
	//环境因子
	/*float ambientStrength=0.1f;
	//环境光照(Ambient Lighting)
	vec4 ambient=ambientStrength*lightColor;
	//FragColor=ambient*objectColor;

	//漫反射光照(Diffuse Lighting)
	//计算光线的方向向量
	vec3 norm=normalize(Normal);
	//与光线方向相反，方便后面计算
	//为了与和法向量点乘为正（0-90°），当然也可以在设置法向量的时候
	//法向量方向指向物体中心，无所谓了，就酱
	vec3 lightDir=normalize(lightPos-FragPos);
	//个人认为光的方向向量是从光源到片段，终点为止向量减去起点位置向量
	//得到的才是从起点到终点的向量啊！什么鬼东西！那个谜一样的摄像机翻滚
	//测试后发现感觉是整个事件物体都在翻转，而不是摄像机的翻转了，上向量什么的都不变的！
	//也是摄像机观察矩阵旋转要有个基准...但是...下次问问老师
	//vec3 lightDir=normalize(FragPos-lightPos);
	//漫反射对于片段的实际影响结果
	//两个向量夹角不能大于90度，否则无意义
	float diff=max(dot(norm,lightDir),0.0);
	//漫反射分量
	//漫反射相当于光照对于物体颜色的影响，在法向量方向上的影响
	vec4 diffuse=diff*lightColor;
	//vec4 result=(ambientStrength+diffuse)*objectColor;
	//FragColor=vec4(result.x,result.y,result.z,1.0f);

	//镜面光照
	//镜面强度(Specular Intensity)
	float specularStrength=0.5;
	//从物体到人眼的视线方向向量
	vec3 viewDir=normalize(viewPos-FragPos);
	//还记得前面说的lightDir是与光线方向相反的吗
	//reflect函数就是求-lightDir关于法向量norm的反射向量
	vec3 reflectDir=reflect(-lightDir,norm);

	//镜面分量
	float spec=pow(max(dot(viewDir,reflectDir),0.0),32);
	vec4 specular=specularStrength*spec*lightColor;

	vec4 result=(ambient+diffuse+specular)*objectColor;
	FragColor=vec4(result.x,result.y,result.z,1.0f);*/
	///////////////////////////////////////////////

	///////////////////////////////////////////////////////
	//材质
	//环境光照
	/*float ambientStrength=0.1;
	vec4 ambient=material.ambient*ambientStrength*lightColor;

	//漫反射光照
	vec3 norm=normalize(Normal);
	vec3 lightDir=normalize(lightPos-FragPos);
	float diff=max(dot(norm,lightDir),0.0);
	vec4 diffuse=diff*material.diffuse*lightColor;

	//镜面光照
	vec3 viewDir=normalize(viewPos-FragPos);
	vec3 reflectDir=reflect(-lightDir,norm);
	float spec=pow(max(dot(viewDir,reflectDir),0.0f),material.shininess);
	vec4 specular=spec*material.specular*lightColor;

	vec4 result=ambient+diffuse+specular;
	FragColor=vec4(result.x,result.y,result.z,1.0f);*/
	///////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////
	//光的属性+材质
	//环境光照
	/*float ambientStrength=0.1;
	vec4 ambient=material.ambient*ambientStrength*light.ambient;

	//漫反射光照
	vec3 norm=normalize(Normal);
	vec3 lightDir=normalize(light.position-FragPos);
	float diff=max(dot(norm,lightDir),0.0);
	vec4 diffuse=diff*material.diffuse*light.diffuse;

	//镜面光照
	vec3 viewDir=normalize(viewPos-FragPos);
	vec3 reflectDir=reflect(-lightDir,norm);
	float spec=pow(max(dot(viewDir,reflectDir),0.0f),material.shininess);
	vec4 specular=spec*material.specular*light.specular;

	vec4 result=ambient+diffuse+specular;
	FragColor=vec4(result.x,result.y,result.z,1.0f);*/
	///////////////////////////////////////////////////////////

	///////////////////////////////////////////////////////////
	//光照贴图
	/*float ambientStrength=0.1;
	//vec4 ambient=vec4(texture(material.diffuse,TexCoord))*ambientStrength*light.ambient;
	vec4 ambient=texture(material.diffuse,TexCoord).rgba*ambientStrength*light.ambient;

	//漫反射光照
	vec3 norm=normalize(Normal);
	vec3 lightDir=normalize(light.position-FragPos);
	float diff=max(dot(norm,lightDir),0.0);
	//vec4 diffuse=diff*vec4(texture(material.diffuse,TexCoord))*light.diffuse;
	vec4 diffuse=diff*texture(material.diffuse,TexCoord).rgba*light.diffuse;

	//镜面光照
	vec3 viewDir=normalize(viewPos-FragPos);
	vec3 reflectDir=reflect(-lightDir,norm);
	float spec=pow(max(dot(viewDir,reflectDir),0.0f),material.shininess);
	//vec4 specular=spec*texture(material.specular,TexCoord).rgba*light.specular;
	//由于木头也有镜面反光，为了更加真实
	vec4 specular=spec*mix(texture(material.diffuse,TexCoord),texture(material.specular,TexCoord),0.8).rgba*light.specular;

	vec4 result=ambient+diffuse+specular;
	FragColor=vec4(result.x,result.y,result.z,1.0f);*/
	///////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////
	//投光物
	/*float ambientStrength=0.1;
	//vec4 ambient=vec4(texture(material.diffuse,TexCoord))*ambientStrength*light.ambient;
	//vec4 ambient=texture(material.diffuse,TexCoord).rgba*ambientStrength*light.ambient;
	vec3 ambient=texture(material.diffuse,TexCoord).rgba*ambientStrength*light.ambient;

	//漫反射光照
	vec3 norm=normalize(Normal);
	vec3 lightDir=normalize(light.position-FragPos);

	float diff=max(dot(norm,lightDir),0.0);
	//vec4 diffuse=diff*vec4(texture(material.diffuse,TexCoord))*light.diffuse;
	//vec4 diffuse=diff*texture(material.diffuse,TexCoord).rgba*light.diffuse;
	vec3 diffuse=diff*texture(material.diffuse,TexCoord).rgba*light.diffuse;

	//镜面光照
	vec3 viewDir=normalize(viewPos-FragPos);
	vec3 reflectDir=reflect(-lightDir,norm);
	float spec=pow(max(dot(viewDir,reflectDir),0.0f),material.shininess);
	//vec4 specular=spec*texture(material.specular,TexCoord).rgba*light.specular;
	//由于木头也有镜面反光，为了更加真实
	//vec4 specular=spec*mix(texture(material.diffuse,TexCoord),texture(material.specular,TexCoord),0.6).rgba*light.specular;
	vec3 specular=spec*mix(texture(material.diffuse,TexCoord),texture(material.specular,TexCoord),0.6).rgba*light.specular;

	//衰减
	float distance=length(light.position-FragPos);
	float attenuation=1.0/(light.constant+light.linear*distance+light.quadratic*distance*distance);
	ambient*=attenuation;
	diffuse*=attenuation;
	specular*=attenuation;

	//聚光
	//vec4 result;
	vec3 result;
	float theta=dot(-lightDir,normalize(light.direction));
	//平滑/软化边缘
	float epsilon=light.cutOff-light.outerCutOff;
	float intensity=clamp((theta-light.outerCutOff)/epsilon,0.0,1.0);//约束在0-1之间
	ambient*=intensity;
	diffuse*=intensity;
	specular*=intensity;
	//if(theta>light.cutOff)//注意这里的切光角和两向量的夹角都采用余弦表示
	//{
	//	result=ambient+diffuse+specular;
	//}
	//else //使用环境光
	//{
	//	result=ambient;
	//}
	result=ambient+diffuse+specular;
	FragColor=vec4(result.x,result.y,result.z,1.0f);*/

	/////////////////////////////////////////////////////////////////////
}

vec4 CalcDirLight(DirLight light,vec3 normal,vec3 viewDir)
{
	float ambientStrength=0.1;
	//vec3 ambient=vec3(texture(material.diffuse,TexCoord))*ambientStrength*light.ambient;
	vec3 ambient=texture(material.texture_diffuse1,TexCoord).rgb*light.ambient;

	//漫反射光照
	vec3 lightDir=normalize(-light.direction);

	float diff=max(dot(normal,lightDir),0.0);
	//vec4 diffuse=diff*vec4(texture(material.diffuse,TexCoord))*light.diffuse;
	//vec3 diffuse=diff*texture(material.diffuse,TexCoord).rgb*light.diffuse;
	vec3 diffuse=diff*texture(material.texture_diffuse1,TexCoord).rgb*light.diffuse;

	//镜面光照
	vec3 reflectDir=reflect(-lightDir,normal);
	float spec=pow(max(dot(viewDir,reflectDir),0.0f),/*material.shininess*/64.0f);
	//vec4 specular=spec*texture(material.specular,TexCoord).rgba*light.specular;
	//由于木头也有镜面反光，为了更加真实
	//vec3 specular=spec*mix(texture(material.diffuse,TexCoord),texture(material.specular,TexCoord),0.6).rgb*light.specular;
	vec3 specular=spec*mix(texture(material.texture_diffuse1,TexCoord),texture(material.texture_specular1,TexCoord),0.8).rgb*light.specular;

	//合并结果
	vec3 result=ambient+diffuse+specular;
	return vec4(result.x,result.y,result.z,1.0f);
}

vec4 CalcPointLight(PointLight light,vec3 normal,vec3 fragPos,vec3 viewDir)
{
	//float ambientStrength=0.1;
	//vec4 ambient=vec4(texture(material.diffuse,TexCoord))*ambientStrength*light.ambient;
	//vec3 ambient=texture(material.diffuse,TexCoord).rgb*light.ambient;
	vec3 ambient=texture(material.texture_diffuse1,TexCoord).rgb*light.ambient;

	//漫反射光照
	vec3 lightDir=normalize(light.position-fragPos);

	float diff=max(dot(normal,lightDir),0.0);
	//vec4 diffuse=diff*vec4(texture(material.diffuse,TexCoord))*light.diffuse;
	//vec3 diffuse=diff*texture(material.diffuse,TexCoord).rgb*light.diffuse;
	vec3 diffuse=diff*texture(material.texture_diffuse1,TexCoord).rgb*light.diffuse;

	//镜面光照
	vec3 reflectDir=reflect(-lightDir,normal);
	float spec=pow(max(dot(viewDir,reflectDir),0.0f),material.shininess);
	//vec4 specular=spec*texture(material.specular,TexCoord).rgba*light.specular;
	//由于木头也有镜面反光，为了更加真实
	//vec3 specular=spec*mix(texture(material.diffuse,TexCoord),texture(material.specular,TexCoord),0.6).rgb*light.specular;
	vec3 specular=spec*mix(texture(material.texture_diffuse1,TexCoord),texture(material.texture_specular1,TexCoord),0.6).rgb*light.specular;

	//衰减
	float distance=length(light.position-FragPos);
	float attenuation=1.0/(light.constant+light.linear*distance+light.quadratic*distance*distance);
	ambient*=attenuation;
	diffuse*=attenuation;
	specular*=attenuation;

	vec3 result=ambient+diffuse+specular;
	return vec4(result.x,result.y,result.z,1.0f);
}

vec4 CalcSpotLight(SpotLight light,vec3 normal,vec3 fragPos,vec3 viewDir)
{
	//float ambientStrength=0.1;
	//vec4 ambient=vec4(texture(material.diffuse,TexCoord))*ambientStrength*light.ambient;
	//vec3 ambient=texture(material.diffuse,TexCoord).rgb*light.ambient;
	vec3 ambient=texture(material.texture_diffuse1,TexCoord).rgb*light.ambient;

	//漫反射光照
	vec3 lightDir=normalize(light.position-fragPos);

	float diff=max(dot(normal,lightDir),0.0);
	//vec4 diffuse=diff*vec4(texture(material.diffuse,TexCoord))*light.diffuse;
	//vec3 diffuse=diff*texture(material.diffuse,TexCoord).rgb*light.diffuse;
	vec3 diffuse=diff*texture(material.texture_diffuse1,TexCoord).rgb*light.diffuse;

	//镜面光照
	vec3 reflectDir=reflect(-lightDir,normal);
	float spec=pow(max(dot(viewDir,reflectDir),0.0f),material.shininess);
	//vec4 specular=spec*texture(material.specular,TexCoord).rgba*light.specular;
	//由于木头也有镜面反光，为了更加真实
	//vec3 specular=spec*mix(texture(material.diffuse,TexCoord),texture(material.specular,TexCoord),0.6).rgb*light.specular;
	vec3 specular=spec*mix(texture(material.texture_diffuse1,TexCoord),texture(material.texture_specular1,TexCoord),0.6).rgb*light.specular;

	//衰减
	float distance=length(light.position-FragPos);
	float attenuation=1.0/(light.constant+light.linear*distance+light.quadratic*distance*distance);
	ambient*=attenuation;
	diffuse*=attenuation;
	specular*=attenuation;

	//聚光
	vec3 result;
	float theta=dot(-lightDir,normalize(light.direction));
	//平滑/软化边缘
	float epsilon=light.cutOff-light.outerCutOff;
	float intensity=clamp((theta-light.outerCutOff)/epsilon,0.0,1.0);//约束在0-1之间
	ambient*=intensity;
	diffuse*=intensity;
	specular*=intensity;
	/*if(theta>light.cutOff)//注意这里的切光角和两向量的夹角都采用余弦表示
	{
		result=ambient+diffuse+specular;
	}
	else //使用环境光
	{
		result=ambient;
	}*/
	result=ambient+diffuse+specular;
	return vec4(result.x,result.y,result.z,1.0f);
}
```
