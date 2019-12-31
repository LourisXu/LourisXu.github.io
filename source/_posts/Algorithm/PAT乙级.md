---
title: PAT乙级
tags:
  - Algorithm
  - Java
  - C++
reward: true
toc: true
translate_title: pat-class-b
date: 2017-09-22 16:35:04
---
## 1001. 害死人不偿命的(3n+1)猜想 (15)
卡拉兹(Callatz)猜想：
对任何一个自然数n，如果它是偶数，那么把它砍掉一半；如果它是奇数，那么把(3n+1)砍掉一半。这样一直反复砍下去，最后一定在某一步得到n=1。卡拉兹在1950年的世界数学家大会上公布了这个猜想，传说当时耶鲁大学师生齐动员，拼命想证明这个貌似很傻很天真的命题，结果闹得学生们无心学业，一心只证(3n+1)，以至于有人说这是一个阴谋，卡拉兹是在蓄意延缓美国数学界教学与科研的进展……
我们今天的题目不是证明卡拉兹猜想，而是对给定的任一不超过1000的正整数n，简单地数一下，需要多少步（砍几下）才能得到n=1？
**输入格式**
每个测试输入包含1个测试用例，即给出自然数n的值。
**输出格式**
输出从n计算到1需要的步数。
**输入样例**
3
**输出样例**
5
**程序**
```cpp
#include<iostream>
using namespace std;
int main()
{
	int n, record=0;
	while(cin>>n)
	{
	//for(int i=1;i<=100;i++){
		//n=i;
		record=0;
		while (n != 1) {
			if (n & 1 != 0) {
				n /= 2;
				record++;
			}
			else {
				n = (3 * n + 1) / 2;
				record++;
			}
		}
		cout<<record<<endl;
	}
	return 0;
}
```
```Java
import java.util.Scanner;

public class Main {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		int n, record = 0;
		Scanner input = new Scanner(System.in);
		n = input.nextInt();
		record = 0;
		while (n != 1) {
			if ((n & 1) != 0) {
				n /= 2;
			} else {
				n = (3 * n + 1) / 2;
			}
			record++;
		}
		System.out.println(record);//自带回车
	}
}
```
## 1002. 写出这个数 (20)
读入一个自然数n，计算其各位数字之和，用汉语拼音写出和的每一位数字。
**输入格式**
每个测试输入包含1个测试用例，即给出自然数n的值。这里保证n小于10100。
**输出格式**
在一行内输出n的各位数字之和的每一位，拼音数字间有1 空格，但一行中最后一个拼音数字后没有空格。
**输入样例**
1234567890987654321123456789
**输出样例**
yi san wu
**程序**
```cpp
#include<iostream>
#include<cmath>
#include<cstring>
#include<string>
#include<vector>
using namespace std;
const string Data[] = { "ling", "yi", "er", "san", "si", "wu", "liu", "qi", "ba", "jiu" };
int main()
{
	string s;
	cin >> s;
	int sum = 0;
	int result[3] = { -1,-1,-1 }; //恩，忽然不想用STL...
	for (unsigned int i = 0; i < s.length(); i++)
	{
		sum += s[i] - '0';
	}
	int index = 2;
	while (sum != 0)
	{
		result[index--] = sum % 10;
		sum /= 10;
	}
	for (int i = index+1; i < 3; i++)
	{
		if (result[i] != -1)
		{
			cout << Data[result[i]];
		}
		if (i != 2)
		{
			cout << " ";
		}
	}
	cout << endl;

	return 0;
}
```
```Java
import java.util.Scanner;
public class Main {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		final String Data[]= {"ling", "yi", "er", "san", "si", "wu", "liu", "qi", "ba", "jiu"};
		String s;
		Scanner input=new Scanner(System.in);
		s=input.next();
		int sum = 0;
		int[] result = { -1,-1,-1 };
		for (int i = 0; i < s.length(); i++)
		{
			sum += s.charAt(i) - '0';
		}
		int index = 2;
		while (sum != 0)
		{
			result[index--] = sum % 10;
			sum /= 10;
		}
		for (int i = index+1; i < 3; i++)
		{
			if (result[i] != -1)
			{
				System.out.print(Data[result[i]]);
			}
			if (i != 2)
			{
				System.out.print(" ");
			}
		}
	}
}
```
## 1003. 我要通过！(20)
“答案正确”是自动判题系统给出的最令人欢喜的回复。本题属于PAT的“答案正确”大派送 —— 只要读入的字符串满足下列条件，系统就输出“答案正确”，否则输出“答案错误”。
得到“答案正确”的条件是：
1. 字符串中必须仅有P, A, T这三种字符，不可以包含其它字符；
2. 任意形如 xPATx 的字符串都可以获得“答案正确”，其中 x 或者是空字符串，或者是仅由字母 A 组成的字符串；
3. 如果 aPbTc 是正确的，那么 aPbATca 也是正确的，其中 a, b, c 均或者是空字符串，或者是仅由字母 A 组成的字符串。
现在就请你为PAT写一个自动裁判程序，判定哪些字符串是可以获得“答案正确”的。
**输入格式**
每个测试输入包含1个测试用例。第1行给出一个自然数n (<10)，是需要检测的字符串个数。接下来每个字符串占一行，字符串长度不超过100，且不包含空格。
**输出格式**
每个字符串的检测结果占一行，如果该字符串可以获得“答案正确”，则输出YES，否则输出NO。
**输入样例**
8
PAT
PAAT
AAPATAA
AAPAATAAAA
xPATx
PT
Whatever
APAAATAA
**输出样例**
YES
YES
YES
YES
NO
NO
NO
NO
**程序**
```cpp
/*
解题思路：
由题意：
以下等号后面的都表示A的数目
M=x,N=1,Z=X
M=a,N=b,Z=c
M=a,N=b+1,Z=c+a
M=a,N=b+2,Z=c+2a
...
∴MN=Z
满足上式即成立

*/
#include<iostream>
#include<cstring>
#include<string>
#include<vector>
using namespace std;
int main()
{
	int number_strings;
	vector<string> v;
	cin >> number_strings;
	for (int i = 0; i < number_strings; i++)
	{
		string s;
		cin >> s;
		int p = s.find_first_not_of("A");
		if (p == string::npos || s[p] != 'P')
		{
			v.push_back("NO");
			continue;
		}
		int t = s.find_first_not_of("A", p + 1);
		if (t == string::npos || s[t] != 'T'||t==p+1)
		{
			v.push_back("NO");
			continue;
		}
		int a = s.find_first_not_of("A", t + 1);
		if (a != string::npos)
		{
			v.push_back("NO");
			continue;
		}
		if ((s.length() - t - 1) == p*(t - p - 1))
		{
			v.push_back("YES");
		}
		else
		{
			v.push_back("NO");
		}
	}
	for (int i = 0; i < number_strings; i++)
	{
		cout << v[i] << endl;
	}
	return 0;
}

```
```Java
import java.util.Scanner;
import java.lang.String;
public class Main {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		int number_string;

		Scanner input=new Scanner(System.in);
		number_string=input.nextInt();
		for(int i=0;i<number_string;i++)
		{
			String s;
			s=input.next();
			int p=s.indexOf("P");
			if(p==-1)
			{
				System.out.println("NO");
				continue;
			}
			int t=s.indexOf("T",p+1);
			if(t==-1||t==p+1)
			{
				System.out.println("NO");
				continue;
			}
			int j;
			for(j=0;j<s.length();j++)
			{
				if(j!=p&&j!=t)
				{
					if(s.charAt(j)!='A')
					{
						System.out.println("NO");
						break;
					}
				}
			}
			if(j==s.length())
			{
				if((s.length()-t-1)==p*(t-p-1))
				{
					System.out.println("YES");
				}
				else
				{
					System.out.println("NO");
				}
			}
		}
	}
}
```
## 1004. 成绩排名 (20)
读入n名学生的姓名、学号、成绩，分别输出成绩最高和成绩最低学生的姓名和学号。
**输入格式**
每个测试输入包含1个测试用例，格式为
  第1行：正整数n
  第2行：第1个学生的姓名 学号 成绩
  第3行：第2个学生的姓名 学号 成绩
  ... ... ...
  第n+1行：第n个学生的姓名 学号 成绩
其中姓名和学号均为不超过10个字符的字符串，成绩为0到100之间的一个整数，这里保证在一组测试用例中没有两个学生的成绩是相同的。
**输出格式**
对每个测试用例输出2行，第1行是成绩最高学生的姓名和学号，第2行是成绩最低学生的姓名和学号，字符串间有1空格。
**输入样例**
3
Joe Math990112 89
Mike CS991301 100
Mary EE990830 95
**输出样例**
Mike CS991301
Joe Math990112
**程序**
```cpp
#include<iostream>
#include<cstring>
#include<string>
#include<algorithm>
using namespace std;
struct test {
	string name, ID;
	int score;
	bool operator <(test &x) const
	{
		return x.score < score; //为真，则排前面
	}
};
int main()
{
	int n;
	cin >> n;
	struct test* students = new test[n];
	for (int i = 0; i < n; i++)
	{
		cin >> students[i].name >> students[i].ID >> students[i].score;
	}
	sort(students, students + n);
	cout << students[0].name << " " << students[0].ID << endl
		<< students[n - 1].name << " " << students[n - 1].ID << endl;
	delete[] students;
	return 0;
}
```
```Java
/*
 * 我他妈不写了，什么鬼，没有C++的结构体方便，排序还要什么Comparable，
 * 教材不敢恭维，麻烦死，让我先继续学习...
 * 呵呵，我他妈还AC了！！！呜哇呜哇呜哇的，换本教材吧，阿杜尅~~~
 */
package PAT;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;
import java.util.ArrayList;
class Student implements Comparable
{
	public String Name,ID;
	public int Score;
	Student(String name,String id,int score)
	{
		this.Name=name;
		this.ID=id;
		this.Score=score;
	}
	@Override
	public int compareTo(Object o) {
		Student s=(Student)o;
		if(this.Score<s.Score)
		{
			return 1;
		}
		else if(this.Score==s.Score)
		{
			return 0;
		}
		else
		{
			return -1;
		}
	}
}
public class Main {

	@SuppressWarnings("unchecked")
	public static void main(String[] args) {

		Scanner input=new Scanner(System.in);
		int num=input.nextInt();

		List<Student>list=new ArrayList<Student>();
		for(int i=0;i<num;i++)
		{
			String Name,ID;
			int Score;
			Name=input.next();
			ID=input.next();
			Score=input.nextInt();
			Student stu=new Student(Name,ID,Score);
			list.add(stu);
		}
		Collections.sort(list);
		/*for(Student s:list)
		{
			System.out.println(s.Score);
		}*/
		System.out.println(list.get(0).Name+" "+list.get(0).ID);
		System.out.println(list.get(list.size()-1).Name+" "+list.get(list.size()-1).ID);
	}
}
```
## 1005. 继续(3n+1)猜想 (25)
卡拉兹(Callatz)猜想已经在1001中给出了描述。在这个题目里，情况稍微有些复杂。
当我们验证卡拉兹猜想的时候，为了避免重复计算，可以记录下递推过程中遇到的每一个数。例如对n=3进行验证的时候，我们需要计算3、5、8、4、2、1，则当我们对n=5、8、4、2进行验证的时候，就可以直接判定卡拉兹猜想的真伪，而不需要重复计算，因为这4个数已经在验证3的时候遇到过了，我们称5、8、4、2是被3“覆盖”的数。我们称一个数列中的某个数n为“关键数”，如果n不能被数列中的其他数字所覆盖。
现在给定一系列待验证的数字，我们只需要验证其中的几个关键数，就可以不必再重复验证余下的数字。你的任务就是找出这些关键数字，并按从大到小的顺序输出它们。
**输入格式**
每个测试输入包含1个测试用例，第1行给出一个正整数K(&lt;100)，第2行给出K个互不相同的待验证的正整数n(1&lt;n&lt;=100)的值，数字间用空格隔开。
**输出格式**
每个测试用例的输出占一行，按从大到小的顺序输出关键数字。数字间用1个空格隔开，但一行中最后一个数字后没有空格。
**输入样例**
6
3 5 6 7 8 11
**输出样例**
7 6
**程序**
```cpp
#include<iostream>
#include<algorithm>
#include<functional>
using namespace std;
int compare(int MID, int flag, int pre_save[])//判断是否已覆盖
{
	for (int i = 0; i < flag; i++)
	{
		if (MID == pre_save[i])
		{
			return 0;
		}
	}
	return 1;
}
int main()
{
	int n, flag = 0, flagl = 0, MID;
	cin >> n;
	int *numbers = new int[n];
	int *last_save = new int[n]; //关键数
	int *pre_save = new int[80 * n]; //已覆盖序列
	for (int i = 0; i < n; i++)
	{
		cin >> numbers[i];
		MID = numbers[i];
		while (MID != 1)
		{
			if ((MID & 1) == 0)
			{
				MID /= 2;
			}
			else
			{
				MID = (3 * MID + 1) / 2;
			}

			if (compare(numbers[i], flag, pre_save) == 1)//自身不在覆盖中
			{
				if (compare(MID, flag, pre_save) == 1) //子序列不在覆盖中
				{
					pre_save[flag++] = MID; //子序列入覆盖
				}
			}
		}
	}

	for (int k = 0; k < n; k++)
	{
		if (compare(numbers[k], flag, pre_save) == 1)
		{
			last_save[flagl++] = numbers[k];
		}
	}
	sort(last_save, last_save + flagl, greater<int>());
	for (int i = 0; i < flagl; i++)
	{
		cout << last_save[i];
		if (i != flagl - 1)
		{
			cout << " ";
		}		
	}
	cout << endl;
	delete[] numbers;
	delete[] pre_save;
	delete[] last_save;
	return 0;
}
```
```Java
package PAT;
import java.util.Scanner;
import java.util.Arrays;
public class Main {

	public static void main(String[] args) {
		int n;
		Scanner input=new Scanner(System.in);
		n=input.nextInt();
		int pre_number=0;
		int last_number=0;
		int[] number=new int [100];
		int[] pre_save=new int[10000];
		int[] last_save=new int[100];

		for(int i=0;i<n;i++)
		{
			number[i]=input.nextInt();
			int mid=number[i];
			while(mid!=1)
			{
				if((mid&1)==0)
				{
					mid/=2;
				}
				else
				{
					mid=(3*mid+1)/2;
				}
				if(Judge(number[i],pre_number,pre_save))
				{
					if(Judge(mid,pre_number,pre_save))
					{
						pre_save[pre_number++]=mid;
					}
				}
			}
		}

		for(int i=0;i<n;i++)
		{
			if(Judge(number[i],pre_number,pre_save))
			{
				last_save[last_number++]=number[i];
			}
		}
		Arrays.sort(last_save,0,last_number);
		//起始下标，终止下标+1！！！！！！！！！！！！！
		//和C++的sort一样！妈的猪一样！浪费时间！！！！！
		for(int i=last_number-1;i>=0;i--)
		{
			System.out.print(last_save[i]);
			if(i!=0)
			{
				System.out.print(" ");
			}
		}
		//System.out.print("\n");
	}
	public static boolean Judge(int mid,int flag,int number[])
	{
		for(int i=0;i<flag;i++)
		{
			if(mid==number[i])
			{
				return false;
			}
		}
		return true;
	}
}
```
## 1006. 换个格式输出整数 (15)
让我们用字母B来表示“百”、字母S表示“十”，用“12...n”来表示个位数字n（&lt;10），换个格式来输出任一个不超过3位的正整数。例如234应该被输出为BBSSS1234，因为它有2个“百”、3个“十”、以及个位的4。
**输入格式**
每个测试输入包含1个测试用例，给出正整数n（&lt;1000）。
**输出格式**
每个测试用例的输出占一行，用规定的格式输出n。
**输入样例1**
234
**输出样例1**
BBSSS1234
**输入样例2**
23
**输出样例2**
SS123
**程序**
```cpp
#include<iostream>
using namespace std;
int main()
{
	int n, flag = 0;
	cin >> n;
	int *save = new int[3];
	do {
		save[flag++] = n % 10;
		n /= 10;
	} while (n != 0);
	for (int i = flag - 1; i >= 0; i--) {
		for (int x = 0; x < save[i]; x++) {
			if (i == 0)
				cout << x + 1;
			else if (i == 1)
				cout << "S";
			else
				cout << "B";
		}
	}
	delete[] save;
	return 0;
}
```
```Java
import java.util.Scanner;
public class Main {
	@SuppressWarnings("resource")
	public static void main(String[] args) {
		int n;
		Scanner input=new Scanner(System.in);
		n=input.nextInt();
		int[] save=new int[3];
		int flag=0;
		do {
			save[flag++]=n%10;
			n/=10;
		}while(n!=0);
		for(int i=flag-1;i>=0;i--)
		{
			for(int j=0;j<save[i];j++)
			{
				if(i==0)
				{
					System.out.print(j+1);
				}
				else if(i==1)
				{
					System.out.print("S");
				}
				else
				{
					System.out.print("B");
				}
			}
		}
	}
}
```
## 1007. 素数对猜想 (20)
让我们定义 dn 为：dn = pn+1 - pn，其中 pi 是第i个素数。显然有 d1=1 且对于n>1有 dn 是偶数。“素数对猜想”认为“存在无穷多对相邻且差为2的素数”。
现给定任意正整数N (&lt; 105)，请计算不超过N的满足猜想的素数对的个数。
**输入格式**
每个测试输入包含1个测试用例，给出正整数N。
**输出格式**
每个测试用例的输出占一行，不超过N的满足猜想的素数对的个数。
**输入样例**
20
**输出样例**
4
```cpp
#include<iostream>
using namespace std;
bool isPrime(int n){
	if(n<2) return false;
	if(n==2) return true;
	//若n不为素数，则存在1~根号n之间的因子
	for(int i=2;i*i<=n;i++)
		if(n%i==0) return false;
	return true;
}
int main()
{
	int n,flag=0;
	cin>>n;
	int *prime=new int [n];
	for(int i=1;i<=n;i++)
	{
		if (isPrime(i) == true)
		{
			prime[flag++] = i;
		}
	}
	n=0;
	for(int i=0;i<flag-1;i++)
	{
		if(prime[i]+2==prime[i+1])
		{
			n++;
		}
	}
	cout<<n;
	delete [] prime;
	return 0;
}
```
```Java
import java.util.Scanner;
public class Main {

	public static void main(String[] args) {
		int n;
		Scanner input=new Scanner(System.in);
		n=input.nextInt();
		int[] Prime=new int[n];
		int Prime_number=0;
		int result=0;
		for(int i=2;i<=n;i++)
		{
			if(isPrime(i))
			{
				Prime[Prime_number++]=i;
			}
		}
		for(int i=0;i<Prime_number-1;i++)
		{
			if(Prime[i]+2==Prime[i+1])
			{
				result++;
			}
		}
		System.out.println(result);
	}
	public static boolean isPrime(int n)
	{
		if(n<2)
		{
			return false;
		}
		if(n==2)
		{
			return true;
		}
		for(int i=2;i*i<=n;i++)
		{
			if(n%i==0)
			{
				return false;
			}
		}
		return true;
	}
}
```
## 1008. 数组元素循环右移问题 (20)
一个数组A中存有N（N>0）个整数，在不允许使用另外数组的前提下，将每个整数循环向右移M（M>=0）个位置，即将A中的数据由（A0 A1……AN-1）变换为（AN-M …… AN-1 A0 A1……AN-M-1）（最后M个数循环移至最前面的M个位置）。如果需要考虑程序移动数据的次数尽量少，要如何设计移动的方法？
输入格式
每个输入包含一个测试用例，第1行输入N ( 1<=N<=100)、M（M>=0）；第2行输入N个整数，之间用空格分隔。
输出格式
在一行中输出循环右移M位以后的整数序列，之间用空格分隔，序列结尾不能有多余空格。
输入样例
6 2
1 2 3 4 5 6
输出样例：
5 6 1 2 3 4
```cpp
#include<iostream>
using namespace std;
int main()
{
	int n, m, T, flag = 0;
	cin >> n >> m;
	m %= n;
	T = n;
	int *circle = new int[n];
	for (int i = m; i < T; i++)
	{
		cin >> circle[i];
		if ((i == T - 1) && flag == 0)
		{
			i = -1;
			T = m;
			flag++;
		}
	}
	for (int i = 0; i < n; i++)
	{
		cout << circle[i];
		if (i != n - 1)
		{
			cout << " ";
		}
	}
	delete[] circle;
	return 0;
}
```
```Java
import java.util.Scanner;
public class Main {

	public static void main(String[] args) {
		int n,m;
		Scanner input=new Scanner(System.in);
		n=input.nextInt();
		m=input.nextInt();
		m%=n;
		int T=n;
		boolean flag=true;
		int[] number=new int[n];
		for(int i=m;i<T;i++)
		{
			number[i]=input.nextInt();
			if(i==T-1&&flag)
			{
				flag=!flag;
				i=-1;
				T=m;
			}
		}
		for(int i=0;i<n;i++)
		{
			System.out.print(number[i]);
			if(i!=n-1)
			{
				System.out.print(" ");
			}
		}
	}
}
```
## 1009. 说反话 (20)
给定一句英语，要求你编写程序，将句中所有单词的顺序颠倒输出。
输入格式：测试输入包含一个测试用例，在一行内给出总长度不超过80的字符串。字符串由若干单词和若干空格组成，其中单词是由英文字母（大小写有区分）组成的字符串，单词之间用1个空格分开，输入保证句子末尾没有多余的空格。
**输出格式**
每个测试用例的输出占一行，输出倒序后的句子。
**输入样例**
Hello World Here I Come
**输出样例**
Come I Here World Hello
**程序**
```cpp
#include<iostream>
#include<cstring>
#include<vector>
using namespace std;

string str;
vector<string> vec;
int main(){
	while(getline(cin,str)){
		int src=0;
		while(str.find(' ',src)!=string::npos){ //以空格为界分割字符串
			int dst=str.find(' ',src);  //空格所在位置
			string ss=str.substr(src,dst-src); //获得从src到dst-1的字串即为单词
			vec.push_back(ss); //加入向量
			src=dst+1;		 //str从src开始找，str.find()两个参数时，第一个参数char ch待查找字符，第二个参数查找起始位置
		}
		if(src<str.length()){ //最后一个单词
			string ss=str.substr(src);
			vec.push_back(ss);
		}
		for(vector<string>::reverse_iterator rit=vec.rbegin();rit!=vec.rend();rit++){ //反向迭代器遍历
			if(rit!=vec.rbegin()) cout<<" ";
			cout<<*rit;
		}
		cout<<endl;
	}
	return 0;
}
```
```cpp
#include<iostream>
#include<cstring>
#include<string>
using namespace std;
int main()
{
	int number = 0, a = 0, b = 0, n = 1, locate[40] = { -1 };
	char strings[81];
	cin.getline(strings, 81);
	for (int i = 0; i < strlen(strings); i++)
	{
		if (strings[i] == ' ')
		{
			number++;
			locate[n++] = i;
		}
	}
	locate[n] = strlen(strings);
	string strs = strings;
	string *words = new string[number + 1];
	for (int i = 0; i < n; i++)
	{
		words[a++] = strs.substr(locate[i] + 1, locate[i + 1] - locate[i] - 1);
	}

	while (--a >= 0)
	{
		cout << words[a];
		if (a != 0)
			cout << " ";
	}
	delete[] words;
	return 0;
}
```
```Java
import java.util.Scanner;
import java.lang.String;
public class Main {

	public static void main(String[] args) {

		Scanner input=new Scanner(System.in);
		String[] str=input.nextLine().split(" ");
		for(int i=str.length-1;i>=0;i--)
		{
			System.out.print(str[i]);
			if(i!=0)
			{
				System.out.print(" ");
			}
		}
	}
}
```
## 1010. 一元多项式求导 (25)
设计函数求一元多项式的导数。（注：xn（n为整数）的一阶导数为n×xn-1。）
**输入格式**
以指数递降方式输入多项式非零项系数和指数（绝对值均为不超过1000的整数）。数字间以空格分隔。
**输出格式**
以与输入相同的格式输出导数多项式非零项的系数和指数。数字间以空格分隔，但结尾不能有多余空格。注意“零多项式”的指数和系数都是0，但是表示为“0 0”。
**输入样例**
3 4 -5 2 6 1 -2 0
**输出样例**
12 3 -10 1 6 0
**程序**
```cpp
#include<iostream>
using namespace std;
int main()
{
	long long i = 0, T, formula[4002];
	do {
		cin >> formula[i];
		if (i % 2 != 0 && i > 0)
		{
			T = formula[i];
			formula[i - 1] *= formula[i];
			if (formula[i] != 0)
			{
				formula[i] -= 1;
			}
		}
		i++;
	} while (cin.get() != '\n');

	for (int k = 0; k < i;)
	{
		if (k % 2 == 0 && formula[k] == 0)
		{
			k += 2;
			continue;
		}
		cout << formula[k];
		if (formula[i - 2] != 0)
		{
			if (k != i - 1)
				cout << " ";
		}
		else
		{
			if (k != i - 3)
				cout << " ";
		}
		k++;
	}
	if (i == 2 && formula[0] == 0)
	{
		cout << formula[0] << " " << formula[1];
	}
	return 0;
}
```
```cpp
#include<iostream>
using namespace std;
int main()
{
	int x, y;
	bool first = true;
	while (cin >> x >> y)
	{
		if (x*y != 0)
		{
			if (!first)
			{
				cout << " ";
			}
			first = false;
			cout << x*y << " " << y - 1;
		}
	}
	if (first)
	{
		cout << "0 0";
	}
	//cout << endl;
	return 0;
}
```
```Java
import java.util.Scanner;
import java.lang.String;
public class Main {

	public static void main(String[] args) {

		Scanner input=new Scanner(System.in);
		boolean first=true;
		while(input.hasNext())
		{
			int x=input.nextInt();
			int y=input.nextInt();
			if(x*y!=0)
			{
				if(!first)
				{
					System.out.print(" ");
				}
				first=false;
				System.out.print(x*y+" "+(y-1));
			}
		}
		if(first)//零多项式
		{
			System.out.print("0 0");
		}
	}
}
```
## 1011. A+B和C (15)
给定区间[-231, 231]内的3个整数A、B和C，请判断A+B是否大于C。
**输入格式**
输入第1行给出正整数T(<=10)，是测试用例的个数。随后给出T组测试用例，每组占一行，顺序给出A、B和C。整数间以空格分隔。
**输出格式**
对每组测试用例，在一行中输出“Case #X: true”如果A+B>C，否则输出“Case #X: false”，其中X是测试用例的编号（从1开始）。
**输入样例**
4
1 2 3
2 3 4
2147483647 0 2147483646
0 -2147483648 -2147483647
**输出样例**
Case #1: false
Case #2: true
Case #3: true
Case #4: false
**程序**
```cpp
#include<iostream>
#include<cmath>
#include<cstring>
using namespace std;
int main()
{
	int n;
	cin >> n;
	for (int i = 1; i <= n; i++)
	{
		long a, b, c;
		cin >> a >> b>>c;
		a += b;
		cout << "Case #" << i << ": ";
		if (a > c)
		{
			cout << "true" << endl;
		}
		else
		{
			cout << "false" << endl;
		}
	}
	return 0;
}
```
```Java
import java.util.Scanner;
import java.lang.String;
public class Main {

	public static void main(String[] args) {

		Scanner input=new Scanner(System.in);
		long a,b,c;
		int n;
		n=input.nextInt();
		for(int i=1;i<=n;i++)
		{
			a=input.nextLong();
			b=input.nextLong();
			c=input.nextLong();
			a+=b;
			System.out.print("Case #"+i+": ");
			if(a>c)
			{
				System.out.print("true\n");
			}
			else
			{
				System.out.print("false\n");
			}
		}

	}
}
```
## 1012. 数字分类 (20)
给定一系列正整数，请按要求对数字进行分类，并输出以下5个数字：
A1 = 能被5整除的数字中所有偶数的和；
A2 = 将被5除后余1的数字按给出顺序进行交错求和，即计算n1-n2+n3-n4...；
A3 = 被5除后余2的数字的个数；
A4 = 被5除后余3的数字的平均数，精确到小数点后1位；
A5 = 被5除后余4的数字中最大数字。
**输入格式**
每个输入包含1个测试用例。每个测试用例先给出一个不超过1000的正整数N，随后给出N个不超过1000的待分类的正整数。数字间以空格分隔。
**输出格式**
对给定的N个正整数，按题目要求计算A1~A5并在一行中顺序输出。数字间以空格分隔，但行末不得有多余空格。
若其中某一类数字不存在，则在相应位置输出“N”。
**输入样例1**
13 1 2 3 4 5 6 7 8 9 10 20 16 18
**输出样例1**
30 11 2 9.7 9
**输入样例2**
8 1 2 4 5 6 7 9 16
**输出样例2**
N 11 2 N 9
**程序**
```cpp
#include<iostream>
#include<cmath>
#include<iomanip>
using namespace std;
int main()
{
	int n,A1=0,A2=0,flag2=0,A3=0,flag4=0,A5=0;
	float A4=0;
	cin>>n;
	//int number[n];
	int* number = new int[n];
	for(int i=0;i<n;i++){
		cin>>number[i];
		if(number[i]%10==0)
			A1+=number[i];
		if(number[i]%5==1){
			A2+=pow(-1,flag2)*number[i];
			flag2++;
		}

		if(number[i]%5==2)
			A3++;
		if(number[i]%5==3){
			A4+=number[i];
			flag4++;
		}
		if(number[i]%5==4&&number[i]>A5)
			A5=number[i];
	}
	if(A1==0)
		cout<<"N ";
	else
		cout<<A1<<" ";
	if(flag2==0)
		cout<<"N ";
	else
		cout<<A2<<" ";
	if(A3==0)
		cout<<"N ";
	else
		cout<<A3<<" ";
	if(flag4==0)
		cout<<"N ";
	else{
		A4/=flag4;
		cout<<setiosflags(ios::fixed)<<setprecision(1)<<A4<<" ";
	}

	if(A5==0)
		cout<<"N";
	else
		cout<<A5;
	delete[] number;
	return 0;
 }
```
```Java
//超时！过！不管了
import java.util.Scanner;
import java.lang.String;
public class Main {

	public static void main(String[] args) {

		Scanner input=new Scanner(System.in);
		int n=input.nextInt();
		int A1,A2,A3,A5;
		double A4=0;
		A1=A2=A3=A5=0;
		int flag2=0;
		int flag4=0;
		for(int i=1;i<=n;i++)
		{
			int x;
			x=input.nextInt();
			if(x%10==0)
			{
				A1+=x;
			}
			if(x%5==1)
			{
				A2+=Math.pow(-1, flag2++)*x;
			}
			if(x%5==2)
			{
				A3++;
			}
			if(x%5==3)
			{
				A4+=x;
				flag4++;
			}
			if(x%5==4)
			{
				A5=Math.max(A5, x);
			}
		}
		if(A1==0)
		{
			System.out.print("N ");
		}
		else
		{
			System.out.print(A1+" ");
		}
		if(A2==0)
		{
			System.out.print("N ");
		}
		else
		{
			System.out.print(A2+" ");
		}
		if(A3==0)
		{
			System.out.print("N ");
		}
		else
		{
			System.out.print(A3+" ");
		}
		if(A4==0)
		{
			System.out.print("N ");
		}
		else
		{
			A4=A4/flag4;
			System.out.format("%.1f ",A4);
		}
		if(A5==0)
		{
			System.out.print("N ");
		}
		else
		{
			System.out.print(A5+" ");
		}
	}
}
```
## 1013. 数素数 (20)
令Pi表示第i个素数。现任给两个正整数M <= N <= 104，请输出PM到PN的所有素数。
**输入格式**
输入在一行中给出M和N，其间以空格分隔。
**输出格式**
输出从PM到PN的所有素数，每10个数字占1行，其间以空格分隔，但行末不得有多余空格。
**输入样例**
5 27
**输出样例**
11 13 17 19 23 29 31 37 41 43
47 53 59 61 67 71 73 79 83 89
97 101 103
**程序**
```cpp
#include<iostream>
using namespace std;
bool isPrime(int n){
	if(n<2) return false;
	if(n==2) return true;
	//若n不为素数，则存在1~根号n之间的因子
	for(int i=2;i*i<=n;i++)
		if(n%i==0) return false;
	return true;
}
int main()
{
	int M,N,flag=0,T=0;
	cin>>M>>N;
	int* prime=new int[N-M+1];
	for(int i=1;;i++){
		if(isPrime(i)){
			flag++;
			if(flag>=M)
				prime[T++]=i;
			if(flag==N)
				break;
		}
	}
	for(int i=0;i<T;i++){
		cout<<prime[i];
		if((i+1)%10==0)
			cout<<endl;
		else if(i!=T-1)
			cout<<" ";
	}
	delete[]prime;
	return 0;
}
```
```Java
//超时！！！你妹，破java，速度真慢
import java.util.Scanner;
import java.lang.String;
public class Main {

	public static void main(String[] args) {

		Scanner input=new Scanner(System.in);
		int m,n;
		m=input.nextInt();
		n=input.nextInt();
		int flag=0;
		int t=0;
		int[] Prime=new int[n-m+1];
		for(int i=0;;i++)
		{
			if(isPrime(i))
			{
				flag++;
				if(flag>=m)
				{
					Prime[t++]=i;
				}
				if(flag==n)
				{
					break;
				}
			}
		}
		for(int i=0;i<t;i++)
		{
			System.out.print(Prime[i]);
			if((i+1)%10==0)
			{
				System.out.print("\n");
			}
			else
			{
				System.out.print(" ");
			}
		}
	}
	public static boolean isPrime(int n)
	{
		if(n<2)
		{
			return false;
		}
		if(n==2)
		{
			return true;
		}
		for(int i=2;i*i<=n;i++)
		{
			if(n%i==0)
			{
				return false;
			}
		}
		return true;
	}
}
```
## 1014. 福尔摩斯的约会 (20)
大侦探福尔摩斯接到一张奇怪的字条：“我们约会吧！ 3485djDkxh4hhGE 2984akDfkkkkggEdsb s&hgsfdk d&Hyscvnm”。大侦探很快就明白了，字条上奇怪的乱码实际上就是约会的时间“星期四 14:04”，因为前面两字符串中第1对相同的大写英文字母（大小写有区分）是第4个字母'D'，代表星期四；第2对相同的字符是'E'，那是第5个英文字母，代表一天里的第14个钟头（于是一天的0点到23点由数字0到9、以及大写字母A到N表示）；后面两字符串第1对相同的英文字母's'出现在第4个位置（从0开始计数）上，代表第4分钟。现给定两对字符串，请帮助福尔摩斯解码得到约会的时间。
**输入格式**
输入在4行中分别给出4个非空、不包含空格、且长度不超过60的字符串。
**输出格式**
在一行中输出约会的时间，格式为“DAY HH:MM”，其中“DAY”是某星期的3字符缩写，即MON表示星期一，TUE表示星期二，WED表示星期三，THU表示星期四，FRI表示星期五，SAT表示星期六，SUN表示星期日。题目输入保证每个测试存在唯一解。
**输入样例**
3485djDkxh4hhGE
2984akDfkkkkggEdsb
s&hgsfdk
d&Hyscvnm
**输出样例**
THU 14:04
**程序**
```cpp
#include<iostream>
#include<cctype>
#include<cstring>
#include<cmath>
#include<iomanip>
#include<string>
using namespace std;
const char *Data[]={"MON","TUE","WED","THU","FRI","SAT","SUN"};
int main()
{
	//cout<<Data[1];
	int flag=0,n,l;
	string strings[4];
	int save;
	for(int i=0;i<4;i++){
		cin>>strings[i];

	}
	for(int i=0;i<(strings[0].length()<=strings[1].length()?strings[0].length():strings[1].length());i++){
		if(strings[0][i]==strings[1][i]&&isupper(strings[0][i])&&flag==0&&strings[0][i]<'H'){
			n=strings[0][i]-'A';
			flag++;
		}else if(strings[0][i]==strings[1][i]&&flag==1&&isalnum(strings[0][i])){
			if(isdigit(strings[0][i])){
				save=strings[0][i]-'0';
				flag++;
				break;
			}else if(isupper(strings[0][i])&&strings[0][i]<'O'){
				save=strings[0][i]-'7';
				flag++;
				break;
			}
		}
	}
	flag=0;
	for(int i=0;i<(strings[2].length()<=strings[3].length()?strings[2].length():strings[3].length());i++){
		if(strings[2][i]==strings[3][i]&&isalpha(strings[2][i])){
			l=i;
			flag++;
			break;
		}
	}

	cout<<Data[n]<<" "<<setw(2)<<setfill('0')<<save<<":"<<setw(2)<<setfill('0')<<l;
	return 0;
}
```
```Java
//超时！！！
import java.util.Scanner;
import java.lang.String;
import java.lang.Character;
public class Main {

	public static void main(String[] args) {

		Scanner input=new Scanner(System.in);
		final String Data[]= {"MON","TUE","WED","THU","FRI","SAT","SUN"};
		String[] str=new String[4];
		for(int i=0;i<4;i++)
		{
			str[i]=input.next();
		}
		int flag=0;
		for(int i=0;i<str[0].length()&&i<str[1].length();i++)
		{
			if(str[0].charAt(i)==str[1].charAt(i)
					&&Character.isUpperCase(str[0].charAt(i))
					&&Character.isUpperCase(str[1].charAt(i))
					&&str[0].charAt(i)<'H'
					&&flag==0)
			{
				flag++;
				System.out.print(Data[(str[0].charAt(i)-'A')]+" ");
			}
			else if(str[0].charAt(i)==str[1].charAt(i)
					&&flag==1
					&&Character.isLetterOrDigit(str[0].charAt(i)))
			{
				if(Character.isDigit(str[0].charAt(i)))
				{
					flag++;
					System.out.format("%02d:",(str[0].charAt(i)-'0'));
					break;
				}
				else if(Character.isUpperCase(str[0].charAt(i))&&str[0].charAt(i)<'O')
				{
					flag++;
					System.out.format("%02d:", (str[0].charAt(i)-'A'+10));
					break;
				}
			}
		}
		for(int i=0;i<str[2].length()&&i<str[3].length();i++)
		{
			if(str[2].charAt(i)==str[3].charAt(i)&&Character.isLetter(str[2].charAt(i)))
			{
				System.out.format("%02d",i);
				break;
			}
		}
	}
}
```
```Java
//微笑！还是超时！你妹啊！就最后一个数据超时了！不管了，再见！
import java.util.Scanner;
import java.lang.String;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.Character;

public class Main {

	public static void main(String[] args) throws IOException {

		//Scanner input=new Scanner(System.in);
		BufferedReader input=new BufferedReader(new InputStreamReader(System.in));
		//Reader input=new Reader(System.in);
		final String Data[]= {"MON","TUE","WED","THU","FRI","SAT","SUN"};
		String[] str=new String[4];
		for(int i=0;i<4;i++)
		{
			//str[i]=input.next();
			str[i]=input.readLine();
		}
		int flag=0;
		for(int i=0;i<str[0].length()&&i<str[1].length();i++)
		{
			if(str[0].charAt(i)==str[1].charAt(i)
					&&Character.isUpperCase(str[0].charAt(i))
					&&Character.isUpperCase(str[1].charAt(i))
					&&str[0].charAt(i)<'H'
					&&flag==0)
			{
				flag++;
				System.out.print(Data[(str[0].charAt(i)-'A')]+" ");
			}
			else if(str[0].charAt(i)==str[1].charAt(i)
					&&flag==1
					&&Character.isLetterOrDigit(str[0].charAt(i)))
			{
				if(Character.isDigit(str[0].charAt(i)))
				{
					flag++;
					System.out.format("%02d:",(str[0].charAt(i)-'0'));
					break;
				}
				else if(Character.isUpperCase(str[0].charAt(i))&&str[0].charAt(i)<'O')
				{
					flag++;
					System.out.format("%02d:", (str[0].charAt(i)-'A'+10));
					break;
				}
			}
		}
		for(int i=0;i<str[2].length()&&i<str[3].length();i++)
		{
			if(str[2].charAt(i)==str[3].charAt(i)&&Character.isLetter(str[2].charAt(i)))
			{
				System.out.format("%02d",i);
				break;
			}
		}
	}
}
```
## 1015. 德才论 (25)
宋代史学家司马光在《资治通鉴》中有一段著名的“德才论”：“是故才德全尽谓之圣人，才德兼亡谓之愚人，德胜才谓之君子，才胜德谓之小人。凡取人之术，苟不得圣人，君子而与之，与其得小人，不若得愚人。”
现给出一批考生的德才分数，请根据司马光的理论给出录取排名。
**输入格式**
输入第1行给出3个正整数，分别为：N（<=105），即考生总数；L（>=60），为录取最低分数线，即德分和才分均不低于L的考生才有资格被考虑录取；H（&lt;100），为优先录取线——德分和才分均不低于此线的被定义为“才德全尽”，此类考生按德才总分从高到低排序；才分不到但德分到线的一类考生属于“德胜才”，也按总分排序，但排在第一类考生之后；德才分均低于H，但是德分不低于才分的考生属于“才德兼亡”但尚有“德胜才”者，按总分排序，但排在第二类考生之后；其他达到最低线L的考生也按总分排序，但排在第三类考生之后。
随后N行，每行给出一位考生的信息，包括：准考证号、德分、才分，其中准考证号为8位整数，德才分为区间[0, 100]内的整数。数字间以空格分隔。
**输出格式**
输出第1行首先给出达到最低分数线的考生人数M，随后M行，每行按照输入格式输出一位考生的信息，考生按输入中说明的规则从高到低排序。当某类考生中有多人总分相同时，按其德分降序排列；若德分也并列，则按准考证号的升序输出。
**输入样例**
14 60 80
10000001 64 90
10000002 90 60
10000011 85 80
10000003 85 80
10000004 80 85
10000005 82 77
10000006 83 76
10000007 90 78
10000008 75 79
10000009 59 90
10000010 88 45
10000012 80 100
10000013 90 99
10000014 66 60
**输出样例**
12
10000013 90 99
10000012 80 100
10000003 85 80
10000011 85 80
10000004 80 85
10000007 90 78
10000006 83 76
10000005 82 77
10000002 90 60
10000014 66 60
10000008 75 79
10000001 64 90
**程序**
```cpp
#include <stdio.h>  
#include <iostream>  
#include <vector>  
#include <algorithm>  
using namespace std;
struct Student {
	int num;
	int d;
	int c;
	bool operator < (const Student &A) const {
		if (d + c != A.d + A.c)
			return d + c > A.d + A.c;
		else {
			if (d != A.d)
				return d > A.d;
			else
				return num < A.num;
		}
	}
};

int main() {
	int n, l, h, count = 0;
	Student tmp;
	vector<Student> v1, v2, v3, v4;
	scanf("%d%d%d", &n, &l, &h);
	int x, y, z;
	for (int i = 0; i < n; i++) {
		scanf("%d%d%d", &x, &y, &z);
		tmp.num = x;
		tmp.d = y;
		tmp.c = z;
		if (y >= l && z >= l) {
			count++;
			if (y >= h && z >= h) {
				v1.push_back(tmp);
			}
			else if (y >= h && z < h) {
				v2.push_back(tmp);
			}
			else if (y < h && z < h && y >= z) {
				v3.push_back(tmp);
			}
			else {
				v4.push_back(tmp);
			}
		}
	}
	sort(v1.begin(), v1.end());
	sort(v2.begin(), v2.end());
	sort(v3.begin(), v3.end());
	sort(v4.begin(), v4.end());
	cout << count << endl;
	vector<Student>::iterator itr;
	for (itr = v1.begin(); itr != v1.end(); ++itr)
		printf("%d %d %d\n", itr->num, itr->d, itr->c);
	for (itr = v2.begin(); itr != v2.end(); ++itr)
		printf("%d %d %d\n", itr->num, itr->d, itr->c);
	for (itr = v3.begin(); itr != v3.end(); ++itr)
		printf("%d %d %d\n", itr->num, itr->d, itr->c);
	for (itr = v4.begin(); itr != v4.end(); ++itr)
		printf("%d %d %d\n", itr->num, itr->d, itr->c);
	return 0;
}
```
```Java
//不出所料的超时！恩，PAT不分Java/Other，偶都尅~
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;
public class Main {

	@SuppressWarnings("unchecked")
	public static void main(String[] args) {
		@SuppressWarnings("resource")
		Scanner input=new Scanner(System.in);
		int N,L,H;
		N=input.nextInt();
		L=input.nextInt();
		H=input.nextInt();
		List<Student> v1=new ArrayList<Student>();
		List<Student> v2=new ArrayList<Student>();
		List<Student> v3=new ArrayList<Student>();
		List<Student> v4=new ArrayList<Student>();
		int Count=0;
		for(int i=0;i<N;i++)
		{
			Student temp=new Student();
			temp.num=input.nextInt();
			temp.d=input.nextInt();
			temp.c=input.nextInt();
			if(temp.d>=L&&temp.c>=L)
			{
				Count++;
				if(temp.d>=H&&temp.c>=H)
				{
					v1.add(temp);
				}
				else if(temp.d>H&&temp.c<H)
				{
					v2.add(temp);
				}
				else if(temp.d<H&&temp.c<H&&temp.d>=temp.c)
				{
					v3.add(temp);
				}
				else
				{
					v4.add(temp);
				}
			}
		}
		Collections.sort(v1);
		Collections.sort(v2);
		Collections.sort(v3);
		Collections.sort(v4);
		System.out.println(Count);
		for(int i=0;i<v1.size();i++)
		{
			System.out.println(v1.get(i).num+" "+v1.get(i).d+" "+v1.get(i).c);
		}
		for(int i=0;i<v2.size();i++)
		{
			System.out.println(v2.get(i).num+" "+v2.get(i).d+" "+v2.get(i).c);
		}
		for(int i=0;i<v3.size();i++)
		{
			System.out.println(v3.get(i).num+" "+v3.get(i).d+" "+v3.get(i).c);
		}
		for(int i=0;i<v4.size();i++)
		{
			System.out.println(v4.get(i).num+" "+v4.get(i).d+" "+v4.get(i).c);
		}
	}
}
class Student implements Comparable
{
	public int num;
	public int d;
	public int c;
	Student(){}
	Student(int n,int dd,int cc)
	{
		this.num=n;
		this.d=dd;
		this.c=cc;
	}
	public int compareTo(Object o)
	{
		Student s=(Student)o;
		if(this.d+this.c!=s.d+s.c)
		{
			if(this.d+this.c>s.d+s.c)
			{
				return -1;
			}
			else
			{
				return 1;
			}
		}
		else
		{
			if(this.d!=s.d)
			{
				if(this.d>s.d)
				{
					return -1;
				}
				else
				{
					return 1;
				}
			}
			else
			{
				if(this.num<s.num)
				{
					return -1;
				}
				else
				{
					return 1;
				}
			}
		}
	}
}
```
## 1016. 部分A+B (15)
正整数A的“DA（为1位整数）部分”定义为由A中所有DA组成的新整数PA。例如：给定A = 3862767，DA = 6，则A的“6部分”PA是66，因为A中有2个6。
现给定A、DA、B、DB，请编写程序计算PA + PB。
**输入格式**
输入在一行中依次给出A、DA、B、DB，中间以空格分隔，其中0 &lt; A, B &lt; 1010。
**输出格式**
在一行中输出PA + PB的值。
**输入样例1：**
3862767 6 13530293 3
**输出样例1：**
399
**输入样例2：**
3862767 1 13530293 8
**输出样例2：**
0
**程序**
```cpp
#include<iostream>
#include<cmath>
using namespace std;
inline int Output(int a, int da) {
	int result = 0, flag = 0;
	while (a != 0) {
		if (a % 10 == da) {
			result += da*(int)pow(10, flag++);
		}

		a /= 10;

	}
	return result;
}
int main()
{
	int A, DA, B, DB, sum = 0;
	cin >> A >> DA >> B >> DB;
	sum = Output(A, DA) + Output(B, DB);
	cout << sum << endl;
	return 0;
}
```
```Java
//哟，居然没超时，出乎意料
import java.util.Scanner;

public class Main {

	public static void main(String[] args) {

		Scanner input=new Scanner(System.in);
		int[] x=new int[4];
		for(int i=0;i<4;i++)
		{
			x[i]=input.nextInt();
		}
		System.out.println(Output(x[0],x[1])+Output(x[2],x[3]));

	}
	public static int Output(int a,int da)
	{
		int flag=0;
		int sum=0;
		while(a!=0)
		{
			if(a%10==da)
			{
				sum+=da*Math.pow(10, flag++);
			}
			a/=10;
		}
		return sum;
	}

}
```
## 1017. A除以B (20)
本题要求计算A/B，其中A是不超过1000位的正整数，B是1位正整数。你需要输出商数Q和余数R，使得A = B \* Q + R成立。
**输入格式**
输入在1行中依次给出A和B，中间以1空格分隔。
**输出格式**
在1行中依次输出Q和R，中间以1空格分隔。
**输入样例**
123456789050987654321 7
**输出样例**
17636684150141093474 3
**程序**
```cpp
#include<iostream>
#include<string>
#include<cctype>
using namespace std;
int main()
{
	string A, Q = "0";
	int B, R = 0;
	cin >> A >> B;

	for (int i = 0; i < A.length(); i++)
	{

		Q += (char)((R * 10 + A[i] - '0') / B + '0'); //模拟除法
		R = (R * 10 + A[i] - '0') % B;
	}
	if (Q.length() > 2 && Q[1] == '0')
	{
		Q.erase(0, 2);
	}
	else
	{
		Q.erase(0, 1);
	}
	cout << Q << " " << R;
	return 0;
}
```
```Java
//超时~
import java.util.Scanner;

public class Main {

	public static void main(String[] args) {

		Scanner input = new Scanner(System.in);

		String A, Q = "0";
		int B, R = 0;
		A = input.next();
		B = input.nextInt();
		for (int i = 0; i < A.length(); i++) {
			Q += (char) ((R * 10 + (A.charAt(i) - '0')) / B + '0');
			R = (R * 10 + (A.charAt(i) - '0')) % B;
		}
		if (Q.length() > 2 && Q.charAt(1) == '0') {
			Q = Q.substring(2);
		} else {
			Q = Q.substring(1);
		}

		System.out.println(Q + " " + R);
	}

}
```
## 1018. 锤子剪刀布 (20)
大家应该都会玩“锤子剪刀布”的游戏：两人同时给出手势，胜负规则如图所示：
现给出两人的交锋记录，请统计双方的胜、平、负次数，并且给出双方分别出什么手势的胜算最大。
**输入格式**
输入第1行给出正整数N（<=105），即双方交锋的次数。随后N行，每行给出一次交锋的信息，即甲、乙双方同时给出的的手势。C代表“锤子”、J代表“剪刀”、B代表“布”，第1个字母代表甲方，第2个代表乙方，中间有1个空格。
**输出格式**
输出第1、2行分别给出甲、乙的胜、平、负次数，数字间以1个空格分隔。第3行给出两个字母，分别代表甲、乙获胜次数最多的手势，中间有1个空格。如果解不唯一，则输出按字母序最小的解。
**输入样例**
10
C J
J B
C B
B B
B C
C C
C B
J B
B C
J J
**输出样例**
5 3 2
2 3 5
B B
**程序**
```cpp
#include<iostream>
using namespace std;
struct word {
	int number;
	char str;
};
int main()
{
	int N, equal = 0;
	word a[3], b[3];
	b[0].number = a[0].number = 0;
	b[1].number = a[1].number = 0;
	b[2].number = a[2].number = 0;
	b[0].str = a[0].str = 'C';
	b[1].str = a[1].str = 'B';
	b[2].str = a[2].str = 'J';
	cin >> N;
	char *A = new char[N];
	char *B = new char[N];
	for (int i = 0; i < N; i++) {
		cin >> A[i] >> B[i];
		if (A[i] == B[i])
		{
			equal++;
		}
		else if (A[i] == 'C'&&B[i] == 'J')
		{
			a[0].number++;
		}
		else if (A[i] == 'C'&&B[i] == 'B')
		{
			b[1].number++;
		}
		else if (A[i] == 'B'&&B[i] == 'C')
		{
			a[1].number++;
		}
		else if (A[i] == 'B'&&B[i] == 'J')
		{
			b[2].number++;
		}
		else if (A[i] == 'J'&&B[i] == 'C')
		{
			b[0].number++;
		}
		else if (A[i] == 'J'&&B[i] == 'B')
		{
			a[2].number++;
		}
	}
	cout << a[0].number + a[1].number + a[2].number << " " << equal << " " << N - a[0].number - a[1].number - a[2].number - equal << endl;
	cout << b[0].number + b[1].number + b[2].number << " " << equal << " " << N - b[0].number - b[1].number - b[2].number - equal << endl;
	word max = a[0], mas = b[0];
	for (int i = 0; i < 3; i++)
	{
		if (max.number < a[i].number)
		{
			max = a[i];
		}
		else if (max.number == a[i].number&&max.str > a[i].str)
		{
			max = a[i];
		}
	}
	for (int i = 0; i < 3; i++)
	{
		if (mas.number < b[i].number)
		{
			mas = b[i];
		}
		else if (mas.number == b[i].number&&mas.str > b[i].str)
		{
			mas = b[i];
		}
	}
	cout << max.str << " " << mas.str;
	return 0;
}
```
```cpp
#include<iostream>
#include<algorithm>
using namespace std;
struct Node {
	int number;
	char str;
	Node(int n, char s) :number(n), str(s) {}
	bool operator < (const Node &o) const
	{
		if (number != o.number)
		{
			return number > o.number;
		}
		else
		{
			return str < o.str;
		}
	}
};
Node A[3] = { Node(0,'C'),Node(0,'J'),Node(0,'B') };
Node B[3] = { Node(0,'C'),Node(0,'J'),Node(0,'B') };
int Sum_A = 0;
int Sum_B = 0;
void Judge(char a, char b)
{
	if (a == 'C'&&b == 'J')
	{
		A[0].number++;
		Sum_A++;
	}
	else if (a == 'C'&&b == 'B')
	{
		B[2].number++;
		Sum_B++;
	}
	else if (a == 'J'&&b == 'C')
	{
		B[0].number++;
		Sum_B++;
	}
	else if (a == 'J'&&b == 'B')
	{
		A[1].number++;
		Sum_A++;
	}
	else if (a == 'B'&&b == 'C')
	{
		A[2].number++;
		Sum_A++;
	}
	else if (a == 'B'&&b == 'J')
	{
		B[1].number++;
		Sum_B++;
	}
}
int main()
{
	int n;
	cin >> n;
	for (int i = 0; i < n; i++)
	{
		char a, b;
		cin >> a >> b;
		Judge(a, b);
	}
	cout << Sum_A << " " << n - Sum_A - Sum_B << " " << Sum_B << endl;
	cout << Sum_B << " " << n - Sum_A - Sum_B << " " << Sum_A << endl;
	sort(A, A + 3);
	sort(B, B + 3);
	cout << A[0].str << " " << B[0].str << endl;
	return 0;
}
```
```Java
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

public class Main {

	public static int Sum_A=0;
	public static int Sum_B=0;
	public static Node[] A= {new Node(0,'C'),new Node(0,'J'),new Node(0,'B')};
	public static Node[] B= {new Node(0,'C'),new Node(0,'J'),new Node(0,'B')};
	public static void main(String[] args) throws IOException {

		Scanner input = new Scanner(System.in);
		int n;
		n=input.nextInt();
		input.nextLine();//除去换行符
		for(int i=0;i<n;i++)
		{
			char a,b;
			String str=input.nextLine();//上面那個nextInt保留換行符在輸入流中，nextline舍弃
			a=str.charAt(0);
			b=str.charAt(2);
			//System.out.println(a+" "+b);
			Judge(a,b);
		}
		System.out.println(Sum_A+" "+(n-Sum_A-Sum_B)+" "+Sum_B);
		System.out.println(Sum_B+" "+(n-Sum_A-Sum_B)+" "+Sum_A);
		List<Node> listA=new ArrayList<Node>();
		List<Node> listB=new ArrayList<Node>();
		listA.add(A[0]);
		listA.add(A[1]);
		listA.add(A[2]);
		listB.add(B[0]);
		listB.add(B[1]);
		listB.add(B[2]);
		Collections.sort(listA);
		Collections.sort(listB);
		System.out.println(listA.get(0).str+" "+listB.get(0).str);
	}

	public static void Judge(char a,char b)
	{
		if (a == 'C'&&b == 'J')
		{
			A[0].number++;
			Sum_A++;
		}
		else if (a == 'C'&&b == 'B')
		{
			B[2].number++;
			Sum_B++;
		}
		else if (a == 'J'&&b == 'C')
		{
			B[0].number++;
			Sum_B++;
		}
		else if (a == 'J'&&b == 'B')
		{
			A[1].number++;
			Sum_A++;
		}
		else if (a == 'B'&&b == 'C')
		{
			A[2].number++;
			Sum_A++;
		}
		else if (a == 'B'&&b == 'J')
		{
			B[1].number++;
			Sum_B++;
		}
	}
}
class Node implements Comparable<Node>
{
	public int number;
	public char str;
	Node(int n,char s)
	{
		this.number=n;
		this.str=s;
	}
	public int compareTo(Node S)
	{
		//Node S=(Node)O;
		if(this.number!=S.number)
		{
			if(this.number>S.number)
			{
				return -1;
			}
			else
			{
				return 1;
			}
		}
		else
		{
			if(this.str>S.str)
			{
				return 1;
			}
			else if(this.str==S.str)
			{
				return 0;
			}
			else
			{
				return -1;
			}
		}
	}
}
```
## 1019. 数字黑洞 (20)
给定任一个各位数字不完全相同的4位正整数，如果我们先把4个数字按非递增排序，再按非递减排序，然后用第1个数字减第2个数字，将得到一个新的数字。一直重复这样做，我们很快会停在有“数字黑洞”之称的6174，这个神奇的数字也叫Kaprekar常数。
例如，我们从6767开始，将得到
7766 - 6677 = 1089
9810 - 0189 = 9621
9621 - 1269 = 8352
8532 - 2358 = 6174
7641 - 1467 = 6174
... ...
现给定任意4位正整数，请编写程序演示到达黑洞的过程。
**输入格式**
输入给出一个(0, 10000)区间内的正整数N。
**输出格式**
如果N的4位数字全相等，则在一行内输出“N - N = 0000”；否则将计算的每一步在一行内输出，直到6174作为差出现，输出格式见样例。注意每个数字按4位数格式输出。
**输入样例1**
6767
**输出样例1**
7766 - 6677 = 1089
9810 - 0189 = 9621
9621 - 1269 = 8352
8532 - 2358 = 6174
**输入样例2**
2222
**输出样例2**
2222 - 2222 = 0000

**程序**
```cpp
#include<iostream>
#include<algorithm>
#include<iomanip>
using namespace std;
int A, B;
void Respond(int number)
{
	int i = 0, a[4];
	a[0] = number / 1000;
	a[1] = number / 100 % 10;
	a[2] = number / 10 % 10;
	a[3] = number % 10;
	sort(a, a + 4);
	A = a[0] * 1000 + a[1] * 100 + a[2] * 10 + a[3];
	B = a[3] * 1000 + a[2] * 100 + a[1] * 10 + a[0];
}
int main()
{
	int number;
	cin >> number;

	if ((number / 1000 == number / 100 % 10) && (number / 1000 == number / 10 % 10) && (number / 1000 == number % 10))
	{
		cout << setw(4) << setfill('0') << number << " - " << setw(4) << setfill('0') << number << " = 0000" << endl;
		return 0;
	}

	do {
		Respond(number);
		cout << setw(4) << setfill('0') << B << " - " << setw(4) << setfill('0') << A << " = " << setw(4) << setfill('0') << B - A << endl;
		number = B - A;
	} while (number != 6174);
	return 0;
}
```
```cpp
//果然必须用上面那种方法，不然超时....容器类虽然好用，但是速度会慢一点，题目压缩了时间...
#include<iostream>
#include<algorithm>
#include<iomanip>
#include<string>
#include<cstdlib>
#include<stdlib.h>
#include<cstdio>
#include<cstring>
#include<functional>
using namespace std;

int main()
{
	string str;
	cin >> str;
	if (str.find_first_not_of(str[0]) == string::npos)
	{
		cout << str << " - " << str << " = 0000" << endl;
		return 0;
	}
	int max, min;
	/*char ch[5];
	_itoa(atoi(str.c_str()), ch, 10);*/
	do
	{
		//貌似PAT不支持_itoa
		/*sort(ch, ch + str.length(), greater<char>());//降序排列
		cout << ch << " - ";
		max = atoi(ch);
		sort(ch, ch + str.length(), less<char>());//升序排列
		cout << ch << " = ";
		min = atoi(ch);
		cout << max - min << endl;
		_itoa(max - min, ch, 10);*/

		sort(str.begin(), str.end(), greater<char>());
		cout << str << " - ";
		max = stoi(str);

		sort(str.begin(),str.end(), less<char>());
		cout << str << " = ";

		min = stoi(str);
		cout << max - min << endl;
		str = to_string(max - min);

	} while (max - min != 6174);
	return 0;
}
```
```Java
//华丽地超时了~~~
import java.util.Arrays;
import java.util.Scanner;

public class Main {

	public static void main(String[] args) {
		Scanner input=new Scanner(System.in);
		int number;
		number=input.nextInt();
		if((number/1000==number/100%10)
				&&(number/1000==number/10%10)
				&&(number/1000==number%10))
		{
			System.out.println(number+" - "+number+" = 0000");
			return;
		}
		do {
			int[] a=new int[4];
			a[0]=number/1000;
			a[1]=number/100%10;
			a[2]=number/10%10;
			a[3]=number%10;
			Arrays.sort(a,0,4);

			int Min=a[0]*1000+a[1]*100+a[2]*10+a[3];
			int Max=a[3]*1000+a[2]*100+a[1]*10+a[0];
			System.out.println(Max+" - "+Min+" = "+(Max-Min));
			number=Max-Min;
		}while(number!=6174);
	}

}
```
## 1020. 月饼 (25)
月饼是中国人在中秋佳节时吃的一种传统食品，不同地区有许多不同风味的月饼。现给定所有种类月饼的库存量、总售价、以及市场的最大需求量，请你计算可以获得的最大收益是多少。
注意：销售时允许取出一部分库存。样例给出的情形是这样的：假如我们有3种月饼，其库存量分别为18、15、10万吨，总售价分别为75、72、45亿元。如果市场的最大需求量只有20万吨，那么我们最大收益策略应该是卖出全部15万吨第2种月饼、以及5万吨第3种月饼，获得 72 + 45/2 = 94.5（亿元）。
**输入格式**
每个输入包含1个测试用例。每个测试用例先给出一个不超过1000的正整数N表示月饼的种类数、以及不超过500（以万吨为单位）的正整数D表示市场最大需求量。随后一行给出N个正数表示每种月饼的库存量（以万吨为单位）；最后一行给出N个正数表示每种月饼的总售价（以亿元为单位）。数字间以空格分隔。
**输出格式**
对每组测试用例，在一行中输出最大收益，以亿元为单位并精确到小数点后2位。
**输入样例**
3 20
18 15 10
75 72 45
**输出样例**
94.50
**程序**
```cpp
#include<iostream>
#include<vector>
#include<algorithm>
#include<iomanip>
using namespace std;
struct Moon {
	double stock;
	double value;
	double price;
};
bool cmp(Moon a, Moon b) {
	return a.price > b.price;
}
int main()
{
	int N, MAX, index = 0;
	double sum = 0;
	cin >> N >> MAX;

	Moon y;
	vector<Moon> x;
	for (int i = 0; i < N; i++)
	{
		cin >> y.stock;

		x.push_back(y);
	}
	for (int i = 0; i < N; i++)
	{
		cin >> x[i].value;

		x[i].price = x[i].value / x[i].stock;
	}
	sort(x.begin(), x.end(), cmp);
	while (MAX != 0 && index != N)
	{
		if (MAX >= x[index].stock)
		{
			MAX -= x[index].stock;
			sum += x[index].value;
		}
		else
		{
			sum += x[index].price*MAX;
			MAX = 0;
		}
		index++;
	}

	cout << setiosflags(ios::fixed) << setprecision(2) << sum;
	return 0;
}
```
```Java
//还是依旧华丽地超时了！PAT部分java和other，很心累！
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

public class Main {

	public static void main(String[] args) {
		Scanner input=new Scanner(System.in);
		int N,MAX;
		N=input.nextInt();
		MAX=input.nextInt();
		List<Moon>list=new ArrayList<Moon>();
		for(int i=0;i<N;i++)
		{
			Moon y=new Moon();
			y.stock=input.nextDouble();
			list.add(y);
		}
		for(int i=0;i<N;i++)
		{
			list.get(i).value=input.nextDouble();
			list.get(i).price=list.get(i).value/list.get(i).stock;
		}
		Collections.sort(list);
		int index=0;
		double sum=0;
		while(MAX!=0&&index!=N)
		{
			if(MAX>=list.get(index).stock)
			{
				MAX-=list.get(index).stock;
				sum+=list.get(index).value;
			}
			else
			{
				sum+=list.get(index).price*MAX;
				MAX=0;
			}
			index++;
		}
		System.out.format("%.2f",sum);
	}

}
class Moon implements Comparable<Moon>
{
	public double stock;
	public double value;
	public double price;
	Moon(){}
	public int compareTo(Moon O)
	{
		if(this.price>O.price)
		{
			return -1;
		}
		else if(this.price==O.price)
		{
			return 0;
		}
		else
		{
			return 1;
		}

	}
}
```
## 1021. 个位数统计 (15)
给定一个k位整数N = dk-1*10k-1 + ... + d1*101 + d0 (0<=di<=9, i=0,...,k-1, dk-1>0)，请编写程序统计每种不同的个位数字出现的次数。例如：给定N = 100311，则有2个0，3个1，和1个3。
**输入格式**
每个输入包含1个测试用例，即一个不超过1000位的正整数N。
**输出格式**
对N中每一种不同的个位数字，以D:M的格式在一行中输出该位数字D及其在N中出现的次数M。要求按D的升序输出。
**输入样例**
100311
**输出样例**
0:2
1:3
3:1
**程序**
```cpp
#include<iostream>
#include<vector>
#include<algorithm>
#include<string>
#include<cctype>
using namespace std;
struct number {
	int num;
	int sum;
};

int main()
{
	string N;
	int X;
	vector<int> x;
	number n[10];
	for (int i = 0; i < 10; i++)
	{
		n[i].num = i;
		n[i].sum = 0;
	}

	cin >> N;

	for (int i = 0; i < N.length(); i++)
	{

		x.push_back(N[i] - '0');
	}
	for (int i = 0; i < x.size(); i++)
	{
		for (int k = 0; k < 10; k++)
		{
			if (x[i] == n[k].num)
			{
				n[k].sum++;
			}
		}
	}
	for (int i = 0; i < 10; i++)
	{
		if (n[i].sum != 0)
		{
			cout << n[i].num << ":" << n[i].sum << endl;
		}
	}
	return 0;
}
```
```cpp
#include<iostream>
#include<vector>
#include<algorithm>
#include<string>
#include<cctype>
#include<map>
using namespace std;


int main()
{
	string N;
	map<int,int> m;
	for (int i = 0; i < 10; i++)
	{
		m[i] = 0;
	}
	cin >> N;
	for (unsigned int i = 0; i < N.length(); i++)
	{
		m[N[i]-'0']++;
	}
	for (map<int, int>::iterator it = m.begin(); it != m.end(); it++)
	{
		if (it->second > 0)
		{
			cout << it->first << ":" << it->second << endl;
		}
	}
	return 0;
}
```
```Java
//百年难得一见不超时
//好像找本书，学学java的STL，各种容器怎么用啊！！！奇葩的用法。
import java.util.Scanner;
import java.lang.String;
import java.util.Map;
import java.util.HashMap;

public class Main {

	public static void main(String[] args) {
		Scanner input=new Scanner(System.in);
		String str=input.next();
		Map<Integer,Integer> map=new HashMap<Integer,Integer>();
		for(int i=0;i<10;i++)
		{
			map.put(i, 0);
		}
		for(int i=0;i<str.length();i++)
		{
			int temp=map.get(str.charAt(i)-'0');
			map.put((str.charAt(i)-'0'), ++temp);
		}
		for(Map.Entry<Integer, Integer> entry:map.entrySet())
		{
			if(entry.getValue()>0)
			{
				System.out.println(entry.getKey()+":"+entry.getValue());
			}
		}
	}

}
```
## 1022. D进制的A+B (20)
输入两个非负10进制整数A和B(<=230-1)，输出A+B的D (1 &lt; D <= 10)进制数。
**输入格式**
输入在一行中依次给出3个整数A、B和D。
**输出格式**
输出A+B的D进制数。
**输入样例**
123 456 8
**输出样例**
1103
**程序**
```cpp
#include<iostream>
#include<cmath>
#include<algorithm>
using namespace std;
#include<stack>
int main()
{
	long a, b, d;
	cin >> a >> b >> d;
	long sum = a + b;
	if (sum == 0)
	{
		cout << 0 << endl;
		return 0;
	}
	stack<long> s;
	while (sum != 0)
	{
		long temp = sum%d;
		s.push(temp);
		sum /= d;
	}
	while (!s.empty())
	{
		long temp = s.top();
		cout << temp;
		s.pop();
	}
	cout << endl;
	return 0;
}
```
```Java
//华丽地超时了~
import java.util.Scanner;
import java.util.Stack;
import java.lang.Long;
public class Main {

	public static void main(String[] args) {
		Scanner input=new Scanner(System.in);
		long a,b,d;
		a=input.nextLong();
		b=input.nextLong();
		d=input.nextLong();
		long sum=a+b;
		if(sum==0)
		{
			System.out.println(0);
			return;
		}
		Stack<Long> s=new  Stack<Long>();
		while(sum!=0)
		{
			long temp=sum%d;
			s.push(temp);
			sum/=d;
		}
		while(!s.empty())
		{
			System.out.print(s.peek());
			s.pop();
		}
	}
}
```
## 1023. 组个最小数 (20)
给定数字0-9各若干个。你可以以任意顺序排列这些数字，但必须全部使用。目标是使得最后得到的数尽可能小（注意0不能做首位）。例如：给定两个0，两个1，三个5，一个8，我们得到的最小的数就是10015558。
现给定数字，请编写程序输出能够组成的最小的数。
**输入格式**
每个输入包含1个测试用例。每个测试用例在一行中给出10个非负整数，顺序表示我们拥有数字0、数字1、……数字9的个数。整数间用一个空格分隔。10个数字的总个数不超过50，且至少拥有1个非0的数字。
**输出格式**
在一行中输出能够组成的最小的数。
**输入样例**
2 2 0 0 0 3 0 0 1 0
**输出样例**
10015558
**程序**
```cpp
#include<iostream>
using namespace std;
struct number{
	int num;
	int sum;
};
int main()
{
	number x[10];
	int sums=0,flag=0;
	for(int i=0;i<10;i++){
		x[i].num=i;
		cin>>x[i].sum;
		sums+=x[i].sum;
		if(x[i].sum==0)
		flag++;
	}
	flag=0;
	for(int i=1;i<10;i++){
		for(int k=0;k<x[i].sum;k++){
			cout<<x[i].num;
			if(flag==0){
				for(int j=0;j<x[0].sum;j++){
				cout<<x[0].num;
				}
				flag++;
			}

		}
	}
	return 0;
}
```
```cpp
#include<iostream>
#include<queue>
#include<functional>
#include<vector>
using namespace std;

int main()
{
	priority_queue<int,vector<int>,greater<int> > q;//小的排前面
	for (int i = 0; i < 10; i++)
	{
		int temp;
		cin >> temp;
		while (temp != 0)
		{
			q.push(i);
			temp--;
		}
	}
	int flag = 0;
	bool first = true;
	while (!q.empty())
	{
		if (q.top() == 0&&first)
		{
			flag++;
			q.pop();
		}
		else
		{
			first = false;
			cout << q.top();
			q.pop();
			while (flag != 0)
			{
				q.push(0);
				flag--;
			}
		}

	}
	cout << endl;
	return 0;
}
```
```Java
//不用想，都是超时~
import java.util.Scanner;
import java.util.PriorityQueue;
public class Main {

	public static void main(String[] args) {
		Scanner input=new Scanner(System.in);
		PriorityQueue<Integer> q=new PriorityQueue<Integer>();
		for(int i=0;i<10;i++)
		{
			int temp=input.nextInt();
			while(temp!=0)
			{
				q.add(i);
				temp--;
			}
		}
		int flag=0;
		boolean first=true;
		while(!q.isEmpty())
		{
			if(q.peek()==0&&first)
			{
				flag++;
				q.poll();
			}
			else
			{
				first=false;
				System.out.print(q.peek());
				q.poll();
				while(flag!=0)
				{
					flag--;
					q.add(0);
				}
			}
		}
	}
}
```
## 1024. 科学计数法 (20)
科学计数法是科学家用来表示很大或很小的数字的一种方便的方法，其满足正则表达式[+-][1-9]"."[0-9]+E[+-][0-9]+，即数字的整数部分只有1位，小数部分至少有1位，该数字及其指数部分的正负号即使对正数也必定明确给出。
现以科学计数法的格式给出实数A，请编写程序按普通数字表示法输出A，并保证所有有效位都被保留。
**输入格式**
每个输入包含1个测试用例，即一个以科学计数法表示的实数A。该数字的存储长度不超过9999字节，且其指数的绝对值不超过9999。
**输出格式**
对每个测试用例，在一行中按普通数字表示法输出A，并保证所有有效位都被保留，包括末尾的0。
**输入样例1**
+1.23400E-03
**输出样例1**
0.00123400
**输入样例2**
-1.2E+10
**输出样例2**
-12000000000
**程序**
```cpp
#include<iostream>
#include<string>
#include<cmath>
using namespace std;
int main(){
	string str,str1,str2;
	cin>>str;
	char save1,save2;
	str.erase(2,1);//删除小数点 	
	save1=str[0]; //获取符号位
	str.erase(0,1);//删除符号位
	str1=str.substr(0,str.find('E'));//获取E前字符串
	str2=str.substr(str.find('E')+1,str.length()-1-str.find('E'));//获取E后字符串

	save2=str2[0];//获取符号位
	str2.erase(0,1);//删除符号位

	int sum=0;
	for(int i=0;i<str2.length();i++)
	{
		sum = 10 * sum + str2[i] - '0';
	}

	if(save2=='+'){
		if(sum>=str1.length()-1){
			str1.insert(str1.length(),sum-str1.length()+1,'0');
		}
		else{
			str1.insert(sum+1,1,'.');
		}
	}
	else{
		str1.insert(0,sum,'0');
		str1.insert(1,1,'.');
	}
	if(save1=='-')
		str1.insert(0,1,'-');
	cout<<str1;
	return 0;
}
```
```Java
//超时还是要坚持下去....有病吧我！
import java.util.Scanner;

public class Main {

	public static void main(String[] args) {
		Scanner input=new Scanner(System.in);
		String s;
		StringBuilder str,str1,str2;
		s=input.next();
		char sign1,sign2;
		sign1=s.charAt(0);
		str=new StringBuilder(s);
		str.deleteCharAt(0);//删除符号
		str.deleteCharAt(1);//删除小数点
		str1=new StringBuilder(str.substring(0, str.indexOf("E")));
		str2=new StringBuilder(str.substring(str.indexOf("E")+1,str.length()));
		sign2=str2.charAt(0);
		str2.deleteCharAt(0);
		int sum=0;
		for(int i=0;i<str2.length();i++)
		{
			sum=10*sum+str2.charAt(i)-'0';
		}
		if(sign2=='+')
		{
			if(sum>=str1.length()-1)
			{
				int len=str1.length();
				while(sum-len+1!=0)
				{
					str1.append("0");
					sum--;
				}
			}
			else
			{
				str1.insert(sum+1, '.');
			}
		}
		else
		{
			while(sum!=0)
			{
				str1.insert(0, '0');
				sum--;
			}
			str1.insert(1, '.');
		}
		if(sign1=='-')
		{
			str1.insert(0, '-');
		}
		System.out.println(str1);
	}
}
```
## 1025. 反转链表 (25)
给定一个常数K以及一个单链表L，请编写程序将L中每K个结点反转。例如：给定L为1→2→3→4→5→6，K为3，则输出应该为3→2→1→6→5→4；如果K为4，则输出应该为4→3→2→1→5→6，即最后不到K个元素不反转。
**输入格式**
每个输入包含1个测试用例。每个测试用例第1行给出第1个结点的地址、结点总个数正整数N(<= 105)、以及正整数K(<=N)，即要求反转的子链结点的个数。结点的地址是5位非负整数，NULL地址用-1表示。
接下来有N行，每行格式为：
Address Data Next
其中Address是结点地址，Data是该结点保存的整数数据，Next是下一结点的地址。
**输出格式**
对每个测试用例，顺序输出反转后的链表，其上每个结点占一行，格式与输入相同。
**输入样例**
00100 6 4
00000 4 99999
00100 1 12309
68237 6 -1
33218 3 00000
99999 5 68237
12309 2 33218
**输出样例**
00000 4 33218
33218 3 12309
12309 2 00100
00100 1 99999
99999 5 68237
68237 6 -1
**程序**
```cpp
#include<iostream>
#include<vector>
#include<iomanip>
using namespace std;
struct node {
	int add;
	int data;
	int next;
};
int main()
{
	int first, N, K;
	//cin>>first>>N>>K;
	scanf("%d%d%d", &first, &N, &K);
	vector<node> x(100000);
	vector<node> sorted;
	vector<node> result;
	node y;
	for (int i = 0; i < N; i++)
	{
		//cin>>y.add>>y.data>>y.next;
		scanf("%d%d%d", &y.add, &y.data, &y.next);
		x[y.add] = y;
	}

	int nextadd = first;
	while (nextadd != -1)
	{
		sorted.push_back(x[nextadd]);
		nextadd = x[nextadd].next;
	}//排序完成
	int newN = sorted.size();
	int flag = K - 1;
	while (flag < newN)
	{
		for (int i = flag; i > flag - K; i--)
		{
			result.push_back(sorted[i]);
		}
		flag += K;
	}//所有K个段落全部逆置
	for (int i = flag - K + 1; i < newN; i++)
	{
		result.push_back(sorted[i]);
	}
	for (int i = 0; i < newN - 1; i++)
	{
		result[i].next = result[i + 1].add;
		//cout<<setw(5)<<setfill('0')<<result[i].add<<" "<<result[i].data<<" "<<setw(5)<<setfill('0')<<result[i].next<<endl;
		printf("%05d %d %05d\n", result[i].add, result[i].data, result[i].next);
	}
	//cout<<setw(5)<<setfill('0')<<result[newN-1].add<<" "<<result[newN-1].data<<" -1"<<endl;
	printf("%05d %d -1\n", result[newN - 1].add, result[newN - 1].data);

	return 0;
}
```
## 1026. 程序运行时间(15)
要获得一个C语言程序的运行时间，常用的方法是调用头文件time.h，其中提供了clock()函数，可以捕捉从程序开始运行到clock()被调用时所耗费的时间。这个时间单位是clock tick，即“时钟打点”。同时还有一个常数CLK_TCK，给出了机器时钟每秒所走的时钟打点数。于是为了获得一个函数f的运行时间，我们只要在调用f之前先调用clock()，获得一个时钟打点数C1；在f执行完成后再调用clock()，获得另一个时钟打点数C2；两次获得的时钟打点数之差(C2-C1)就是f运行所消耗的时钟打点数，再除以常数CLK_TCK，就得到了以秒为单位的运行时间。
这里不妨简单假设常数CLK_TCK为100。现给定被测函数前后两次获得的时钟打点数，请你给出被测函数运行的时间。
**输入格式**
输入在一行中顺序给出2个整数C1和C2。注意两次获得的时钟打点数肯定不相同，即C1 &lt; C2，并且取值在[0, 107]。
**输出格式**
在一行中输出被测函数运行的时间。运行时间必须按照“hh:mm:ss”（即2位的“时:分:秒”）格式输出；不足1秒的时间四舍五入到秒。
**输入样例**
123 4577973
**输出样例**
12:42:59
**程序**
```cpp
#include<iostream>
#include<iomanip>
#include<cmath>
using namespace std;
int main()
{
	long long C1,C2,t1,t2,t3;
	long long d;
	cin>>C1>>C2;
	d=floor((C2-C1)/100.0+0.5);
	t1=d/3600;
	t2=d/60%60;
	t3=d%3600%60;
	cout<<setw(2)<<setfill('0')<<t1<<":"<<setw(2)<<setfill('0')<<t2<<":"<<setw(2)<<setfill('0')<<t3;
	return 0;
}
```
```Java
import java.util.Scanner;

public class Main {

	public static void main(String[] args) {
		Scanner input=new Scanner(System.in);
		int C1,C2;
		C1=input.nextInt();
		C2=input.nextInt();
		int frac=(int)Math.floor((C2-C1)/100.0+0.5);
		int s=frac%60;
		int m=frac/60%60;
		int h=frac/3600;
		System.out.format("%02d:%02d:%02d", h,m,s);
	}
}
```
## 1027. 打印沙漏(20)
本题要求你写个程序把给定的符号打印成沙漏的形状。例如给定17个“\*”，要求按下列格式打印
```
*****
 ***
  *
 ***
*****
```
所谓“沙漏形状”，是指每行输出奇数个符号；各行符号中心对齐；相邻两行符号数差2；符号数先从大到小顺序递减到1，再从小到大顺序递增；首尾符号数相等。
给定任意N个符号，不一定能正好组成一个沙漏。要求打印出的沙漏能用掉尽可能多的符号。
输入格式
输入在一行给出1个正整数N（<=1000）和一个符号，中间以空格分隔。
输出格式
首先打印出由给定符号组成的最大的沙漏形状，最后在一行中输出剩下没用掉的符号数。
输入样例
```
19 *
```
输出样例
```
*****
 ***
  *
 ***
*****
2
```
```cpp
#include<iostream>
using namespace std;
int main() {
	int i = 1, n, sum = 0, row = 0;
	char s;
	cin >> n >> s;
	while (sum <= n)
	{
		if (i == 1)
		{
			sum += i;
			row++;
		}
		else if (i % 2 == 1)
		{
			sum += 2 * i;
			row++;
		}
		i++;
	}

	sum -= 2 * (--i);
	row--;
	row = (row - 1) * 2 + 1;
	int middle = (row - 1) / 2 + 1;
	for (int j = 1; j <= row; j++)
	{
		if (j <= middle)
		{
			for (int h = 1; h <= j - 1; h++)
				cout << " ";
			for (int h = 1; h <= (middle - j) * 2 + 1; h++)
				cout << s;
			cout << endl;
		}
		else
		{
			for (int h = 1; h <= 2 * middle - 1 - j; h++)
				cout << " ";
			for (int h = 1; h <= (j - middle) * 2 + 1; h++)
				cout << s;
			cout << endl;
		}
	}
	cout << n - sum;
	return 0;
}
```
```Java
import java.util.Scanner;

public class Main {

	public static void main(String[] args) {
		Scanner input=new Scanner(System.in);
		int n=input.nextInt();
		String s=input.next();
		char ch=s.charAt(0);
		int sum = 0;
		int row = 0;
		int h;
		for(h=1;sum<=n;h+=2)
		{
			if(h==1)
			{
				sum+=h;
			}
			else
			{
				sum+=2*h;
			}
			row++;
		}
		h-=2;
		sum-=2*h;
		row--;
		row=(row-1)*2+1;
		int mid=(row-1)/2+1;
		for(int i=1;i<=row;i++)
		{
			if(i<=mid)
			{
				for(int j=1;j<=i-1;j++)
				{
					System.out.print(" ");
				}
				for(int j=1;j<=(mid-i)*2+1;j++)
				{
					System.out.print(ch);
				}
				System.out.print("\n");
			}
			else
			{
				for(int j=1;j<=2*mid-i-1;j++)
				{
					System.out.print(" ");
				}
				for(int j=1;j<=(i-mid)*2+1;j++)
				{
					System.out.print(ch);
				}
				System.out.print("\n");
			}
		}
		System.out.println(n-sum);
	}
}
```
## 1028. 人口普查(20)
某城镇进行人口普查，得到了全体居民的生日。现请你写个程序，找出镇上最年长和最年轻的人。
这里确保每个输入的日期都是合法的，但不一定是合理的——假设已知镇上没有超过200岁的老人，而今天是2014年9月6日，所以超过200岁的生日和未出生的生日都是不合理的，应该被过滤掉。
**输入格式**
输入在第一行给出正整数N，取值在(0, 105]；随后N行，每行给出1个人的姓名（由不超过5个英文字母组成的字符串）、以及按“yyyy/mm/dd”（即年/月/日）格式给出的生日。题目保证最年长和最年轻的人没有并列。
**输出格式**
在一行中顺序输出有效生日的个数、最年长人和最年轻人的姓名，其间以空格分隔。
**输入样例**
5
John 2001/05/12
Tom 1814/09/06
Ann 2121/01/30
James 1814/09/05
Steve 1967/11/20
**输出样例**
3 Tom John
**程序**
```cpp
#include<iostream>
#include<vector>
#include<string>
#include<algorithm>
using namespace std;
struct people{
	char name[6];
	int year;
	int month;
	int day;
};
const int year0=2014;
const int month0=9;
const int day0=6;
bool cmp(people a,people b){
	if(a.year==b.year){
		if(a.month==b.month){
			return a.day<b.day;
		}
		else{
			return a.month<b.month;
		}
	}
	else{
		return a.year<b.year;
	}
}
int main()
{
	int n;
	cin>>n;
	vector<people> man;
	people x;
	for(int i=0;i<n;i++){
		cin>>x.name;
		scanf("%d/%d/%d",&x.year,&x.month,&x.day);
		if(x.year==year0){
			if(x.month==month0&&x.day<=day0){
				man.push_back(x);
			}
			else if(x.month<month0){
				man.push_back(x);
			}
		}
		else if(x.year<year0){
			if(year0-x.year==200){
				if(x.month==month0&&x.day>=day0){
					man.push_back(x);
				}
				else if(x.month>month0){
					man.push_back(x);
				}
			}
			else if(year0-x.year<200){
				man.push_back(x);
			}
		}
	}
	sort(man.begin(),man.end(),cmp);
	if(man.size()!=0)
		cout<<man.size()<<" "<<man[0].name<<" "<<man[man.size()-1].name;
	else
		cout<<"0";
	return 0;
}
```
## 1029. 旧键盘(20)
旧键盘上坏了几个键，于是在敲一段文字的时候，对应的字符就不会出现。现在给出应该输入的一段文字、以及实际被输入的文字，请你列出肯定坏掉的那些键。
**输入格式**
输入在2行中分别给出应该输入的文字、以及实际被输入的文字。每段文字是不超过80个字符的串，由字母A-Z（包括大、小写）、数字0-9、以及下划线“\_”（代表空格）组成。题目保证2个字符串均非空。
**输出格式**
按照发现顺序，在一行中输出坏掉的键。其中英文字母只输出大写，每个坏键只输出一次。题目保证至少有1个坏键。
**输入样例**
7\_This\_is\_a\_test
\_hs_s\_a\_es
**输出样例**
7TI
**程序**
```cpp
#include<iostream>
#include<vector>
#include<string>
using namespace std;
int main() {
	string s1, s2;
	cin >> s1 >> s2;
	for (int i = 0; i < s1.length(); i++)
	{
		if (islower(s1[i]))
		{
			s1[i] = toupper(s1[i]);
		}
	}
	for (int i = 0; i < s2.length(); i++) {
		if (islower(s2[i]))
		{
			s2[i] = toupper(s2[i]);
		}

	}
	vector<char> s3;
	vector<char> s4;
	s3.push_back(s1[0]);
	for (int j = 0; j < s1.length(); j++)
	{
		for (int i = 0; i < s3.size(); i++)
		{
			if (s1[j] == s3[i])
			{
				break;
			}
			else if (i == s3.size() - 1)
			{
				s3.push_back(s1[j]);
			}
		}
	}//剔除重复字母
	for (int j = 0; j < s3.size(); j++)
	{
		for (int i = 0; i < s2.length(); i++)
		{
			if (s3[j] == s2[i])
				break;
			else if (i == s2.length() - 1)
				s4.push_back(s3[j]);
		}
	}//寻找缺省元素
	for (int i = 0; i < s4.size(); i++)
		cout << s4[i];
	return 0;
}
```
```cpp
#include<iostream>
#include<vector>
#include<string>
#include<cctype>
using namespace std;
int main() {
	string s1, s2;
	cin >> s1 >> s2;
	for (int i = 0; i < s1.length(); i++)
	{
		if (islower(s1[i]))
		{
			char temp = s1[i];
			s1[i] = toupper(temp);
		}
	}

	for (int i = 0; i < s2.length(); i++)
	{
		if (islower(s2[i]))
		{
			s2[i] = toupper(s2[i]);
		}
	}
	string temp;
	vector<char> result;
	for (int i = 0; i < s1.length(); i++)
	{
		if (temp.find(s1[i]) == string::npos/*&&s1[i]!='_'*/)//空格也算
		{
			temp += s1[i];
		}

	}
	/*cout << s1 << endl << s2 << endl<<temp<<endl;
	system("pause");*/
	for (int i = 0; i < temp.length(); i++)
	{
		if (s2.find(temp[i]) == string::npos)
		{
			result.push_back(temp[i]);
		}
	}
	for (vector<char>::iterator it = result.begin(); it != result.end(); it++)
	{
		cout << *it;
	}

	cout << endl;
	return 0;
}
```
## 1030. 完美数列(25)
给定一个正整数数列，和正整数p，设这个数列中的最大值是M，最小值是m，如果M <= m \* p，则称这个数列是完美数列。
现在给定参数p和一些正整数，请你从中选择尽可能多的数构成一个完美数列。
**输入格式**
输入第一行给出两个正整数N和p，其中N（<= 105）是输入的正整数的个数，p（<= 109）是给定的参数。第二行给出N个正整数，每个数不超过109。
**输出格式**
在一行中输出最多可以选择多少个数可以用它们组成一个完美数列。
**输入样例**
10 8
2 3 20 4 5 1 6 7 8 9
**输出样例**
8
**程序**
```cpp
#include<iostream>
#include<set>
#include<vector>
#include<algorithm>
using namespace std;
int main() {
	long n, p;
	vector<long>b;
	long a[100010];
	// cin >> n >> p;
	scanf("%ld %ld", &n, &p);
	for (long i = 0; i < n; i++)
	{

		scanf("%ld", &a[i]);

	}

	sort(a, a + n);
	//有一个测试点超时
	/*for (int i = 0; i < a.size(); i++)
	{
		for (int j = a.size()-1; j >=0; j--) //从右往左找到第一个满足条件的就是当前最小值满足的最大长度，进入下一个最小值
		{
			if (a[j] <= a[i] * p)
			{
				b.push_back(j + 1 - i);
				break;
			}
		}
	}
	sort(b.begin(),b.end());
	cout << b[b.size() - 1]<<endl;
	*/
	int Maxlen = 0;
	for (int i = 0; i < n; i++)
	{
		//for (int j = n - 1; j >= i + Maxlen; j--)//还是超了，呵呵，正向循环反而更快,可想而知这个测试点后面的数字多大，
		for (int j = i + Maxlen; j < n; j++)
		{
			if (a[j] > a[i] * p)
			{
				break;
			}
			Maxlen = max(Maxlen, j - i + 1);
		}
	}
	//cout << Maxlen << endl;
	printf("%ld\n", Maxlen);
	return 0;
}
```
## 1031. 查验身份证(15)
一个合法的身份证号码由17位地区、日期编号和顺序编号加1位校验码组成。校验码的计算规则如下：
首先对前17位数字加权求和，权重分配为：{7，9，10，5，8，4，2，1，6，3，7，9，10，5，8，4，2}；然后将计算的和对11取模得到值Z；最后按照以下关系对应Z值与校验码M的值：
Z：0 1 2 3 4 5 6 7 8 9 10
M：1 0 X 9 8 7 6 5 4 3 2
现在给定一些身份证号码，请你验证校验码的有效性，并输出有问题的号码。
**输入格式**
输入第一行给出正整数N（<= 100）是输入的身份证号码的个数。随后N行，每行给出1个18位身份证号码。
**输出格式**
按照输入的顺序每行输出1个有问题的身份证号码。这里并不检验前17位是否合理，只检查前17位是否全为数字且最后1位校验码计算准确。如果所有号码都正常，则输出“All passed”。
**输入样例1**
4
320124198808240056
12010X198901011234
110108196711301866
37070419881216001X
**输出样例1**
12010X198901011234
110108196711301866
37070419881216001X
**输入样例2**
2
320124198808240056
110108196711301862
**输出样例2**
All passed
**程序**
```cpp
#include<iostream>
#include<string>
#include<vector>
#include<algorithm>
using namespace std;
const int x[17]={7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2};
const char c[11]={'1','0','X','9','8','7','6','5','4','3','2'};
int main(){
   int n,sum;
   string s;
   vector<string> a;
   cin>>n;
   for(int i=0;i<n;i++)
   {
      sum=0;
      cin>>s;
      for(int j=0;j<17;j++)
	  {
      	if(!isdigit(s[j]))
		{
      		a.push_back(s);
      		break;
		}
		else
		{
			sum += (s[j] - '0')*x[j];
		}
      	if(j==16&&c[sum%11]!=s[17])
      		a.push_back(s);
	  }        
   }
   if (a.size() == 0)
   {
	   cout << "All passed";
   }
   else
   {
      for(int i=0;i<a.size();i++)
	  {
          cout<<a[i]<<endl;
      }
   }
   return 0;
}
```
```cpp
#include<iostream>
#include<string>
using namespace std;
const int info[18] = { 7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2 };
const char lag[11] = { '1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2' };
int main()
{
	int n;
	bool flag = true;
	cin >> n;
	while (n--)
	{
		string str;
		cin >> str;
		int sum = 0;
		for (int i = 0; i < 17; i++)
		{
			if (!isdigit(str[i]))
			{
				cout << str << endl;
				flag = false;
				break;
			}
			else
			{
				sum += (str[i] - '0')*info[i];
			}
			if (i == 16 && lag[sum % 11] != str[17])
			{
				cout << str << endl;
				flag = false;
			}
		}
	}
	if (flag)
	{
		cout << "All passed" << endl;
	}
	return 0;
}
```
## 1032. 挖掘机技术哪家强(20)
为了用事实说明挖掘机技术到底哪家强，PAT组织了一场挖掘机技能大赛。现请你根据比赛结果统计出技术最强的那个学校。
**输入格式**
输入在第1行给出不超过105的正整数N，即参赛人数。随后N行，每行给出一位参赛者的信息和成绩，包括其所代表的学校的编号（从1开始连续编号）、及其比赛成绩（百分制），中间以空格分隔。
**输出格式**
在一行中给出总得分最高的学校的编号、及其总分，中间以空格分隔。题目保证答案唯一，没有并列。
**输入样例**
6
3 65
2 80
1 100
2 70
3 40
3 0
**输出样例**
2 150
**程序**
```cpp
#include<iostream>
#include<string.h>
#include<algorithm>
using namespace std;
int main() {
	int n,index,value;
	cin >> n;
	int *arr = new int[n];
	memset(arr, 0, sizeof(arr));
	for (int i = 0;i < n;i++) {
		cin >> index>>value;
		arr[index-1]+=value;
	}
	int max = 0, ind;
	for (int i = 0;i < n;i++) {
		if (max < arr[i]) {
			max = arr[i];
			ind = i+1;
		}
	}
	cout << ind << " " << max<<endl;
	delete [] arr;
	return 0;
}
```
## 1033. 旧键盘打字(20)
旧键盘上坏了几个键，于是在敲一段文字的时候，对应的字符就不会出现。现在给出应该输入的一段文字、以及坏掉的那些键，打出的结果文字会是怎样？
**输入格式**
输入在2行中分别给出坏掉的那些键、以及应该输入的文字。其中对应英文字母的坏键以大写给出；每段文字是不超过105个字符的串。可用的字符包括字母[a-z, A-Z]、数字0-9、以及下划线“\_”（代表空格）、“,”、“.”、“-”、“+”（代表上档键）。题目保证第2行输入的文字串非空。
注意：如果上档键坏掉了，那么大写的英文字母无法被打出。
**输出格式**
在一行中输出能够被打出的结果文字。如果没有一个字符能被打出，则输出空行。
**输入样例**
7+IE.
7\_This\_is\_a\_test.
**输出样例**
\_hs\_s\_a\_tst
**程序**
```cpp
#include<iostream>
#include<string>
using namespace std;
int main() {
	string s1, s2;
	getline(cin, s1);
	getline(cin, s2);
	for (int i = 0; i < s2.length(); i++)
	{
		bool flag = true;//不是坏键
		for (int j = 0; j < s1.length(); j++)
		{
			if (s2[i] == s1[j]
				|| (s1[j] == '+'&&isupper(s2[i]))
				||(islower(s2[i])&&toupper(s2[i])==s1[j]))
			{
				flag = false;
				break;
			}
		}
		if (flag)
		{
			cout << s2[i];
		}
	}
	cout << endl;
	return 0;
}
```
## 1034. 有理数四则运算(20)
本题要求编写程序，计算2个有理数的和、差、积、商。
**输入格式**
输入在一行中按照“a1/b1 a2/b2”的格式给出两个分数形式的有理数，其中分子和分母全是整型范围内的整数，负号只可能出现在分子前，分母不为0。
**输出格式**
分别在4行中按照“有理数1 运算符 有理数2 = 结果”的格式顺序输出2个有理数的和、差、积、商。注意输出的每个有理数必须是该有理数的最简形式“k a/b”，其中k是整数部分，a/b是最简分数部分；若为负数，则须加括号；若除法分母为0，则输出“Inf”。题目保证正确的输出中没有超过整型范围的整数。
**输入样例1**
2/3 -4/2
**输出样例1**
2/3 + (-2) = (-1 1/3)
2/3 - (-2) = 2 2/3
2/3 * (-2) = (-1 1/3)
2/3 / (-2) = (-1/3)
**输入样例2**
5/3 0/6
**输出样例2**
1 2/3 + 0 = 1 2/3
1 2/3 - 0 = 1 2/3
1 2/3 * 0 = 0
1 2/3 / 0 = Inf
**程序**
```cpp
#include<iostream>
#include<cmath>
using namespace std;
long long alter(long long a,long long b) {
	//求两数的最大公因数
	long long x=a%b;
	while (x) {
		a = b;
		b = x;
		x = a%b;
	}
	return b;
}
void Print(long long a, long long b ) {
	//打印函数
	long long k = 1;
	if (b == 0) {
		cout << "Inf";
		return;
	}//作商分母为零的情况
	if (a < 0) {
		a = -a;
		k = -1;
	}//对a为负数的情况做判断
	long long a_b = alter(a, b);//最大公约数
	a /= a_b;
	b /= a_b;
	if (a < b && a != 0) {//约去最大公约数后如果a<b
		if (k > 0)
			cout << a << "/" << b;
		else
			cout << "(-" << a << "/" << b << ")";
		return;
	}
	//约去最大公约数后如果a>b
	k = k*a / b;//得到整数部分,或0
	a %= b;//得到分子
	if (b == 1 && k < 0) //得到负整数
		cout << "(" << k << ")";
	else if (b == 1 && k >= 0)//得到正整数，整除情况或者是a为0的情况
		cout << k;
	else if (k < 0)
		cout << "(" << k <<  " " << a << "/" << b << ")";
	else
		cout << k << " " << a << "/" << b;

}
void Calculate(long long a1, long long b1, long long a2, long long b2, char ch) {
	//判断类型并计算
	long long c1, c2;

	Print(a1, b1);
	cout << " " << ch << " ";
	Print(a2, b2);
	cout << " = ";

	switch (ch) {
	case '+':
		c1 = a1*b2 + a2*b1;
		c2 = b1*b2;
		Print(c1, c2);
		cout << endl;
		break;
	case '-':
		c1 = a1*b2 - a2*b1;
		c2 = b1*b2;
		Print(c1, c2);
		cout << endl;
		break;
	case '*':
		c1 = a1*a2;
		c2 = b1*b2;
		Print(c1, c2);
		cout << endl;
		break;
	case '/':
		c1 = a1*b2;
		c2 = a2*b1;
		if (c2 < 0) {//确保分母是正数
			c2 = -c2;
			c1 = -c1;
		}
		Print(c1, c2);
		cout << endl;
		break;
	}
}
int main() {
	//虽然每个输入不超过整型范围，但是在进行运算时特别是乘法的时候会溢出
	long long a1, a2, b1, b2;
	scanf("%lld/%lld %lld/%lld", &a1, &b1, &a2, &b2);
	Calculate(a1, b1, a2, b2, '+');
	Calculate(a1, b1, a2, b2, '-');
	Calculate(a1, b1, a2, b2, '*');
	Calculate(a1, b1, a2, b2, '/');
	system("pause");
	return 0;
}
```
## 1035. 插入与归并(25)
根据维基百科的定义：
插入排序是迭代算法，逐一获得输入数据，逐步产生有序的输出序列。每步迭代中，算法从输入序列中取出一元素，将之插入有序序列中正确的位置。如此迭代直到全部元素有序。
归并排序进行如下迭代操作：首先将原始序列看成N个只包含1个元素的有序子序列，然后每次迭代归并两个相邻的有序子序列，直到最后只剩下1个有序的序列。
现给定原始序列和由某排序算法产生的中间序列，请你判断该算法究竟是哪种排序算法？
**输入格式**
输入在第一行给出正整数N (<=100)；随后一行给出原始序列的N个整数；最后一行给出由某排序算法产生的中间序列。这里假设排序的目标序列是升序。数字间以空格分隔。
**输出格式**
首先在第1行中输出“Insertion Sort”表示插入排序、或“Merge Sort”表示归并排序；然后在第2行中输出用该排序算法再迭代一轮的结果序列。题目保证每组测试的结果是唯一的。数字间以空格分隔，且行末不得有多余空格。
**输入样例1**
10
3 1 2 8 7 5 9 4 6 0
1 2 3 7 8 5 9 4 6 0
**输出样例1**
Insertion Sort
1 2 3 5 7 8 9 4 6 0
**输入样例2**
10
3 1 2 8 7 5 9 4 0 6
1 3 2 8 5 7 4 9 0 6
**输出样例2**
Merge Sort
1 2 3 8 4 5 7 9 0 6
**程序**
```cpp
#include <iostream>
#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstring>
#include <cctype>
using namespace std;

int N;
int A[100], T[100];

//判断B数组是否等于T数组
bool IsEqual(int B[])
{
	for (int i = 0; i < N; i++) {
		if (B[i] != T[i])
			return false;
	}
	return true;
}

void Print(int B[])
{
	for (int i = 0; i < N; i++) {
		cout << B[i];
		if (i + 1 < N)
			cout << " ";
	}
}

//将a的[low, mid), [mid, high) 两部分归并
void Merge(int a[], int low, int mid, int high)
{
	int* t=new int[high - low];
	int i = low, j = mid, k = 0;

	while (i < mid && j < high) {
		if (a[i] <= a[j])
			t[k++] = a[i++];
		else
			t[k++] = a[j++];
	}

	while (i < mid)
		t[k++] = a[i++];
	while (j < high)
		t[k++] = a[j++];

	for (i = low, k = 0; i < high; i++) {
		a[i] = t[k++];
	}
  delete [] t;
}


void solve()
{
	int B[100];
	for (int i = 0; i < N; i++) {
		B[i] = A[i];
	}

	//归并排序检测
	bool isMerge = false;
	for (int k = 1; k < N; k *= 2) {
		for (int i = 0; i < N; i += k * 2) {
			if (i + k * 2 <= N)
				Merge(B, i, i + k, i + 2 * k);
			else if (i + k <= N)
				Merge(B, i, i + k, N);
		}

		if (isMerge) {
			cout << "Merge Sort" << endl;
			Print(B);
			return;
		}
		else if (IsEqual(B)) {
			isMerge = true;
		}

	}

	for (int i = 0; i < N; i++) {
		B[i] = A[i];
	}

	//插入排序检测
	bool isInsert = false;
	for (int i = 1; i < N; i++) {
		int j, key = B[i];
		for (j = i - 1; B[j] > key && j >= 0; j--) {
			B[j + 1] = B[j];
		}
		B[j + 1] = key;

		if (isInsert) {
			cout << "Insertion Sort" << endl;
			Print(B);
			return;
		}
		else if (IsEqual(B)) {
			isInsert = true;
		}

	}
}

int main()
{
	cin >> N;
	for (int i = 0; i < N; i++) {
		cin >> A[i];
	}
	for (int i = 0; i < N; i++) {
		cin >> T[i];
	}
	solve();
	return 0;
}
```
```cpp
#include <algorithm>
#include<iostream>
using namespace std;
int main() {
	int n;
	cin >> n;
	int *a = new int[n];
	int *b = new int[n];
	for (int i = 0; i < n; i++)
		cin >> a[i];
	for (int i = 0; i < n; i++)
		cin >> b[i];
	int i, j;
	for (i = 0; i < n - 1 && b[i] <= b[i + 1]; i++);
	for (j = i + 1; j < n&&a[j] == b[j]; j++);
	if (j == n)
	{
		cout << "Insertion Sort" << endl;
		sort(a, a + i + 2);
		for (int i = 0; i < n; i++)
		{
			cout << a[i];
			if (i != n - 1)
			{
				cout << " ";
			}
		}
		cout << endl;
		return 0;
	}
	else
	{
		cout << "Merge Sort" << endl;
		bool isEqual = false;
		int k = 1;
		while (!isEqual)
		{
			int i;
			for (i = 0; i < n; i++)
			{
				if (a[i] != b[i])
				{
					break;
				}
			}
			if (i == n)
			{
				isEqual = true;
			}
			k *= 2;
			for (int j = 0; j < n / k; j++)
			{
				sort(a + j*k, a + (j + 1)*k);
			}
			sort(a + n / k*k, a + n);
		}
	}

	for (int i = 0; i < n; i++)
	{
		cout << a[i];
		if (i != n - 1)
		{
			cout << " ";
		}
	}
	cout << endl;
	delete[] a;
	delete[] b;
	return 0;
}
```
## 1036. 跟奥巴马一起编程(15)
美国总统奥巴马不仅呼吁所有人都学习编程，甚至以身作则编写代码，成为美国历史上首位编写计算机代码的总统。2014年底，为庆祝“计算机科学教育周”正式启动，奥巴马编写了很简单的计算机代码：在屏幕上画一个正方形。现在你也跟他一起画吧！
**输入格式**
输入在一行中给出正方形边长N（3<=N<=20）和组成正方形边的某种字符C，间隔一个空格。
**输出格式**
输出由给定字符C画出的正方形。但是注意到行间距比列间距大，所以为了让结果看上去更像正方形，我们输出的行数实际上是列数的50%（四舍五入取整）。
**输入样例**
10 a
**输出样例**
aaaaaaaaaa
a        a
a        a
a        a
aaaaaaaaaa
**程序**
```cpp
#include<iostream>
#include<cmath>
using namespace std;
int main() {
	int n;
	char ch;
	cin >> n >> ch;
	int row = (int)floor(n / 2.0 + 0.5);
	int col = n;
	for (int i = 0; i < row; i++)
	{
		for (int j = 0; j < col; j++)
		{
			if (i == 0 || i == row - 1)
			{
				cout << ch;
			}
			else
			{
				if (j == 0 || j == col - 1)
				{
					cout << ch;
				}
				else
				{
					cout << " ";
				}
			}
		}
		cout << endl;
	}
	return 0;
}
```
## 1037. 在霍格沃茨找零钱（20）
如果你是哈利·波特迷，你会知道魔法世界有它自己的货币系统 —— 就如海格告诉哈利的：“十七个银西可(Sickle)兑一个加隆(Galleon)，二十九个纳特(Knut)兑一个西可，很容易。”现在，给定哈利应付的价钱P和他实付的钱A，你的任务是写一个程序来计算他应该被找的零钱。
**输入格式**
输入在1行中分别给出P和A，格式为“Galleon.Sickle.Knut”，其间用1个空格分隔。这里Galleon是[0, 107]区间内的整数，Sickle是[0, 17)区间内的整数，Knut是[0, 29)区间内的整数。
**输出格式**
在一行中用与输入同样的格式输出哈利应该被找的零钱。如果他没带够钱，那么输出的应该是负数。
**输入样例1**
10.16.27 14.1.28
**输出样例1**
3.2.1
**输入样例2**
14.1.28 10.16.27
**输出样例2**
-3.2.1
**程序**
```cpp
/*Galleon=17 Sickle
  Sickle=19 Knut
  */
#include<iostream>
using namespace std;
struct money {
	int Galleon, Sickle, Knut;
};
int main() {
	money x, y;
	scanf("%d.%d.%d %d.%d.%d", &x.Galleon, &x.Sickle, &x.Knut, &y.Galleon, &y.Sickle, &y.Knut);
	x.Galleon -= y.Galleon;
	x.Sickle -= y.Sickle;
	x.Knut -= y.Knut;
	int sum;
	sum = x.Galleon * 17 * 29 + x.Sickle * 29 + x.Knut;
	int flag = 1;
	if (sum < 0) {
		flag = -1;
		sum = -sum;
	}
	x.Knut = sum % 29;
	x.Sickle = sum / 29 % 17;
	x.Galleon = sum / 29 / 17;
	if (flag == 1 && sum != 0)
		cout << "-";
	cout << x.Galleon << "." << x.Sickle << "." << x.Knut;
	//system("pause");
	return 0;
}
```
## 1038. 统计同成绩学生(20)
本题要求读入N名学生的成绩，将获得某一给定分数的学生人数输出。
**输入格式**
输入在第1行给出不超过105的正整数N，即学生总人数。随后1行给出N名学生的百分制整数成绩，中间以空格分隔。最后1行给出要查询的分数个数K（不超过N的正整数），随后是K个分数，中间以空格分隔。
**输出格式**
在一行中按查询顺序给出得分等于指定分数的学生人数，中间以空格分隔，但行末不得有多余空格。
**输入样例**
10
60 75 90 55 75 99 82 90 75 50
3 75 90 88
**输出样例**
3 2 0
**程序**
```cpp
#include<iostream>
using namespace std;
int main() {
	int n;
	cin >> n;
	int temp;
	static int records[100001];
	for (int i = 0; i < n; i++)
	{

		cin >> temp;
		records[temp]++;
	}
	int k;
	cin >> k;
	for (int i = 0; i < k; i++)
	{

		cin >> temp;
		cout << records[temp];
		if (i != k - 1)
		{
			cout << " ";
		}
	}
	cout << endl;
	return 0;
}
```
## 1039. 到底买不买（20）
小红想买些珠子做一串自己喜欢的珠串。卖珠子的摊主有很多串五颜六色的珠串，但是不肯把任何一串拆散了卖。于是小红要你帮忙判断一下，某串珠子里是否包含了全部自己想要的珠子？如果是，那么告诉她有多少多余的珠子；如果不是，那么告诉她缺了多少珠子。
为方便起见，我们用[0-9]、[a-z]、[A-Z]范围内的字符来表示颜色。例如在图1中，第3串是小红想做的珠串；那么第1串可以买，因为包含了全部她想要的珠子，还多了8颗不需要的珠子；第2串不能买，因为没有黑色珠子，并且少了一颗红色的珠子。
**输入格式**
每个输入包含1个测试用例。每个测试用例分别在2行中先后给出摊主的珠串和小红想做的珠串，两串都不超过1000个珠子。
**输出格式**
如果可以买，则在一行中输出“Yes”以及有多少多余的珠子；如果不可以买，则在一行中输出“No”以及缺了多少珠子。其间以1个空格分隔。
**输入样例1**
ppRYYGrrYBR2258
YrR8RrY
**输出样例1**
Yes 8
**输入样例2**
ppRYYGrrYB225
YrR8RrY
**输出样例2**
No 2
**程序**
```cpp
#include<iostream>
#include<string>
using namespace std;
int main() {
	string inputs1, inputs2;
	cin >> inputs1;
	cin >> inputs2;
	int s1[256] = { 0 };
	int s2[256] = { 0 };
	for (int i = 0; i < inputs1.length(); i++)
	{
		s1[inputs1[i]]++;
	}
	for (int i = 0; i < inputs2.length(); i++)
	{
		s2[inputs2[i]]++;
	}
	int sum = 0;
	for (int i = 0; i < 256; i++)
	{
		if (s2[i] > s1[i])
		{
			sum += s2[i] - s1[i];
		}

	}
	if (sum == 0)
	{
		cout << "Yes " << inputs1.length() - inputs2.length() << endl;
	}
	else
	{
		cout << "No " << sum << endl;
	}
	return 0;
}
```
## 1040. 有几个PAT（25）
字符串APPAPT中包含了两个单词“PAT”，其中第一个PAT是第2位(P),第4位(A),第6位(T)；第二个PAT是第3位(P),第4位(A),第6位(T)。
现给定字符串，问一共可以形成多少个PAT？
**输入格式**
输入只有一行，包含一个字符串，长度不超过105，只包含P、A、T三种字母。
**输出格式**
在一行中输出给定字符串中包含多少个PAT。由于结果可能比较大，只输出对1000000007取余数的结果。
**输入样例**
APPAPT
**输出样例**
2
**程序**
```cpp
#include<iostream>
#include<string>
using namespace std;
int main() {
	string str;
	cin >> str;
	int numT = 0;
	int numAT = 0;
	int numPAT = 0;
	for (int i = str.length() - 1; i >= 0; i--)
	{
		if (str[i] == 'T')
		{
			numT++;//最大100000
		}
		if (str[i] == 'A')
		{
			numAT += numT; //最大2.5*10^9
		}
		if (str[i] == 'P')
		{
			numPAT = (numPAT + numAT) % 1000000007;
		}
	}
	cout << numPAT << endl;
	return 0;
}
```
## 1041. 考试座位号(15)
每个PAT考生在参加考试时都会被分配两个座位号，一个是试机座位，一个是考试座位。正常情况下，考生在入场时先得到试机座位号码，入座进入试机状态后，系统会显示该考生的考试座位号码，考试时考生需要换到考试座位就座。但有些考生迟到了，试机已经结束，他们只能拿着领到的试机座位号码求助于你，从后台查出他们的考试座位号码。
**输入格式**
输入第一行给出一个正整数N（<=1000），随后N行，每行给出一个考生的信息：“准考证号 试机座位号 考试座位号”。其中准考证号由14位数字组成，座位从1到N编号。输入保证每个人的准考证号都不同，并且任何时候都不会把两个人分配到同一个座位上。
考生信息之后，给出一个正整数M（<=N），随后一行中给出M个待查询的试机座位号码，以空格分隔。
**输出格式**
对应每个需要查询的试机座位号码，在一行中输出对应考生的准考证号和考试座位号码，中间用1个空格分隔。
**输入样例**
4
10120150912233 2 4
10120150912119 4 1
10120150912126 1 3
10120150912002 3 2
2
3 4
**输出样例**
10120150912002 2
10120150912119 1
**程序**
```cpp
#include<iostream>
#include<string>
using namespace std;
struct information {
	string str;
	int exam;
	int number;
};
int main() {
	int n;
	cin >> n;
	information *save = new information[n];
	for (int i = 0; i < n; i++) {
		cin >> save[i].str >> save[i].exam >> save[i].number;
	}
	int m;
	cin >> m;
	int *sa = new int[m];
	for (int i = 0; i < m; i++) {
		cin >> sa[i];
	}

	for (int j = 0; j < m; j++)
		for (int i = 0; i < n; i++) {
			if (sa[j] == save[i].exam)
			{
				cout << save[i].str << " " << save[i].number << endl;
				break;
			}
		}
	delete[]save;
	delete[]sa;
	return 0;
}
```
```cpp
#include<iostream>
#include<string>
#include<algorithm>
using namespace std;
struct Node
{
	string num;
	int seat;
}Data[1001];

int main()
{
	int n;
	cin >> n;
	string x;
	int y, z;
	for (int i = 0; i < n; i++)
	{
		cin >> x >> y >> z;
		Data[y].num = x;
		Data[y].seat = z;
	}
	cin >> n;
	for (int i = 0; i < n; i++)
	{
		cin >> y;
		cout << Data[y].num << " " << Data[y].seat << endl;
	}
	return 0;
}
```
## 1042. 字符统计(20)
请编写程序，找出一段给定文字中出现最频繁的那个英文字母。
**输入格式**
输入在一行中给出一个长度不超过1000的字符串。字符串由ASCII码表中任意可见字符及空格组成，至少包含1个英文字母，以回车结束（回车不算在内）。
**输出格式**
在一行中输出出现频率最高的那个英文字母及其出现次数，其间以空格分隔。如果有并列，则输出按字母序最小的那个字母。统计时不区分大小写，输出小写字母。
**输入样例**
This is a simple TEST.  There ARE numbers and other symbols 1&2&3...........
**输出样例**
e 7
**程序**
```cpp
#include<iostream>
#include<string>
using namespace std;
int main() {
	string str;
	int number[26] = { 0 };
	getline(cin,str);
	for (int i = 0;i<str.length();i++) {
		if (isupper(str[i]))
			number[tolower(str[i])-'a']++;
		else if (isalpha(str[i]))
			number[str[i]-'a']++;
	}

	int max = number[0];
	int flag=0;
	for (int i=0;i<26;i++) {
		if (max < number[i]) {
			max = number[i];
			flag = i;
		}

	}
	char ch = flag+ 'a';
	cout << ch<<" "<<max;
	return 0;
}
```
```cpp
#include<iostream>
#include<algorithm>
#include<string>
using namespace std;
int main()
{
	string str;
	getline(cin, str);
	char result='z';
	int Max = 0;
	int count[26];
	fill(count, count + 26, 0);
	for (int i = 0; i < str.length(); i++)
	{
		if (isalpha(str[i]))
		{
			count[tolower(str[i]) - 'a']++;
			if (count[tolower(str[i]) - 'a'] > Max)
			{

				Max = count[tolower(str[i]) - 'a'];
				result = tolower(str[i]);
			}
			if (count[tolower(str[i]) - 'a'] == Max&&tolower(str[i])<result)
			{
				result = tolower(str[i]);
			}
		}
	}
	cout << result << " " << Max << endl;
	return 0;
}
```
## 1043. 输出PATest(20)
给定一个长度不超过10000的、仅由英文字母构成的字符串。请将字符重新调整顺序，按“PATestPATest....”这样的顺序输出，并忽略其它字符。当然，六种字符的个数不一定是一样多的，若某种字符已经输出完，则余下的字符仍按PATest的顺序打印，直到所有字符都被输出。
**输入格式**
输入在一行中给出一个长度不超过10000的、仅由英文字母构成的非空字符串。
**输出格式**
在一行中按题目要求输出排序后的字符串。题目保证输出非空。
**输入样例**
redlesPayBestPATTopTeePHPereatitAPPT
**输出样例**
PATestPATestPTetPTePePee
**程序**
```cpp
#include<iostream>
#include<string>
using namespace std;
int main() {
	int num[6] = { 0 };
	int sum = 0;
	string str;
	string label = "PATest";
	cin >> str;
	for (int i = 0;i < str.length();i++) {
		if (str[i] == 'P') {
			num[0]++;
			sum++;
		}
		else if (str[i] == 'A') {
			num[1]++;
			sum++;
		}
		else if (str[i] == 'T') {
			num[2]++;
			sum++;
		}
		else if (str[i] == 'e') {
			num[3]++;
			sum++;
		}
		else if (str[i] == 's') {
			num[4]++;
			sum++;
		}
		else if (str[i] == 't') {
			num[5]++;
			sum++;
		}

	}
	while (sum > 0) {
		for (int i = 0;i < 6;i++) {
			if (num[i] != 0) {
				cout << label[i];
				num[i]--;
				sum--;
			}
		}
	}
	//system("pause");
	return 0;
}
```
## 1044. 火星数字(20)
火星人是以13进制计数的：
    地球人的0被火星人称为tret。
    地球人数字1到12的火星文分别为：jan, feb, mar, apr, may, jun, jly, aug, sep, oct, nov, dec。
    火星人将进位以后的12个高位数字分别称为：tam, hel, maa, huh, tou, kes, hei, elo, syy, lok, mer, jou。
例如地球人的数字“29”翻译成火星文就是“hel mar”；而火星文“elo nov”对应地球数字“115”。为了方便交流，请你编写程序实现地球和火星数字之间的互译。
**输入格式**
输入第一行给出一个正整数N（&lt;100），随后N行，每行给出一个[0, 169)区间内的数字 —— 或者是地球文，或者是火星文。
**输出格式**
对应输入的每一行，在一行中输出翻译后的另一种语言的数字。
**输入样例**
4
29
5
elo nov
tam
**输出样例**
hel mar
may
115
13
**程序**
```cpp
#include<iostream>
#include<cstdio>
#include<string>
using namespace std;
int main()
{
	int N;
	cin >> N;
	string mess;
	string three = "";
	string fire[13] = { "tret", "jan", "feb", "mar", "apr", "may", "jun", "jly", "aug", "sep", "oct", "nov", "dec" };
	string jinzhi[13] = { " ","tam", "hel", "maa", "huh", "tou", "kes", "hei", "elo", "syy", "lok", "mer", "jou" };
	int number = 0;
	getchar();          //使用getline时他会将第一次cin>>N的时候回车记录在内，从而少一次循环所以用getchar()捕捉那个回车
	for (int i = 0; i < N; i++)
	{
		getline(cin, mess);
		if (isdigit(mess[0]))
		{
			int x = stoi(mess);
			if (x < 13)
			{
				cout << fire[x] << endl;
			}
			else
			{
				if (x % 13==0)
				{
					cout << jinzhi[x / 13] << endl;
				}
				else
				{
					cout << jinzhi[x / 13] << " " << fire[x % 13] << endl;
				}
			}
		}
		else
		{
			number = 0;
			for (int i = 0; i < mess.length(); i += 4)
			{
				string str = mess.substr(i, 3);
				for (int j = 0; j < 13; j++)
				{
					if (str == fire[j])
					{
						number += j;
					}
					else if(str==jinzhi[j])
					{
						number += j * 13;
					}
				}
			}
			cout << number << endl;
		}
	}
	return 0;
}
```
## 1045. 快速排序(25)
著名的快速排序算法里有一个经典的划分过程：我们通常采用某种方法取一个元素作为主元，通过交换，把比主元小的元素放到它的左边，比主元大的元素放到它的右边。 给定划分后的N个互不相同的正整数的排列，请问有多少个元素可能是划分前选取的主元？
例如给定N = 5, 排列是1、3、2、4、5。则：
1的左边没有元素，右边的元素都比它大，所以它可能是主元；
尽管3的左边元素都比它小，但是它右边的2它小，所以它不能是主元；
尽管2的右边元素都比它大，但其左边的3比它大，所以它不能是主元；
类似原因，4和5都可能是主元。
因此，有3个元素可能是主元。
**输入格式**
输入在第1行中给出一个正整数N（<= 105）； 第2行是空格分隔的N个不同的正整数，每个数不超过109。
**输出格式**
在第1行中输出有可能是主元的元素个数；在第2行中按递增顺序输出这些元素，其间以1个空格分隔，行末不得有多余空格。
**输入样例**
5
1 3 2 4 5
**输出样例**
3
1 4 5
**程序**
```cpp
#include<iostream>
#include<vector>
#include<algorithm>
using namespace std;
int main() {
	vector<int> a, b, c;
	int x;
	cin >> x;
	for (int i = 0; i < x; i++)
	{
		int temp;
		cin >> temp;
		a.push_back(temp);
		b.push_back(temp);
	}
	sort(b.begin(), b.end());
	//主元左边都比主元小，主元右边都比主元大。
	//leftMax<=A[i]
	//A[i]==B[i]
	int leftMax = 0;
	for (int i = 0; i < x; i++)
	{
		if (leftMax < a[i])
		{
			leftMax = a[i];
		}
		if (a[i] == b[i]&&a[i]==leftMax)
		{
			c.push_back(a[i]);
		}
	}
	cout << c.size() << endl;
	for (int i = 0; i < c.size(); i++)
	{
		cout << c[i];
		if (i != c.size() - 1)
		{
			cout << " ";
		}
	}
	cout << endl;
	return 0;
}
```
## 1046. 划拳(15)
划拳是古老中国酒文化的一个有趣的组成部分。酒桌上两人划拳的方法为：每人口中喊出一个数字，同时用手比划出一个数字。如果谁比划出的数字正好等于两人喊出的数字之和，谁就赢了，输家罚一杯酒。两人同赢或两人同输则继续下一轮，直到唯一的赢家出现。
下面给出甲、乙两人的划拳记录，请你统计他们最后分别喝了多少杯酒。
**输入格式**
输入第一行先给出一个正整数N（<=100），随后N行，每行给出一轮划拳的记录，格式为：
甲喊 甲划 乙喊 乙划
其中“喊”是喊出的数字，“划”是划出的数字，均为不超过100的正整数（两只手一起划）。
**输出格式**
在一行中先后输出甲、乙两人喝酒的杯数，其间以一个空格分隔。
**输入样例**
5
8 10 9 12
5 10 5 10
3 8 5 12
12 18 1 13
4 16 12 15
**输出样例**
1 2
**程序**
```cpp
#include<iostream>
using namespace std;
struct save {
	int a1, a2, b1, b2;
};
int main() {
	int n, sum,a,b;
	a = b = 0;
	cin >> n;
	save *record = new save[n];
	for (int i = 0;i < n;i++) {
		cin >> record[i].a1 >> record[i].a2 >> record[i].b1 >> record[i].b2;
		sum = record[i].a1 + record[i].b1;
		if (sum == record[i].a2&&sum != record[i].b2) b++;
		if (sum != record[i].a2&&sum == record[i].b2) a++;

	}
	cout << a << " " << b<<endl;
	delete[] record;
	return 0;
}
```
## 1047. 编程团体赛(20)
编程团体赛的规则为：每个参赛队由若干队员组成；所有队员独立比赛；参赛队的成绩为所有队员的成绩和；成绩最高的队获胜。
现给定所有队员的比赛成绩，请你编写程序找出冠军队。
**输入格式**
输入第一行给出一个正整数N（<=10000），即所有参赛队员总数。随后N行，每行给出一位队员的成绩，格式为：“队伍编号-队员编号 成绩”，其中“队伍编号”为1到1000的正整数，“队员编号”为1到10的正整数，“成绩”为0到100的整数。
**输出格式**
在一行中输出冠军队的编号和总成绩，其间以一个空格分隔。注意：题目保证冠军队是唯一的。
**输入样例**
6
3-10 99
11-5 87
102-1 0
102-3 100
11-9 89
3-2 61
**输出样例**
11 176
**程序**
```cpp
#include<iostream>
#include<algorithm>
using namespace std;
struct team {
	int teamname;
	int records=0;
};
bool cmp(team a,team b) {
	return a.records < b.records;
}
int main() {
	team teams[1001];

	int n,a, b, c;
	cin >> n;
	for (int i = 0;i < n;i++) {
		scanf("%d-%d %d", &a, &b, &c);
		teams[a].records  += c;
		teams[a].teamname = a;
	}
	sort(teams, teams + 1001,cmp);
	cout << teams[1000].teamname << " " << teams[1000].records << endl;
	return 0;
}
```
## 1048. 数字加密(20)
本题要求实现一种数字加密方法。首先固定一个加密用正整数A，对任一正整数B，将其每1位数字与A的对应位置上的数字进行以下运算：对奇数位，对应位的数字相加后对13取余——这里用J代表10、Q代表11、K代表12；对偶数位，用B的数字减去A的数字，若结果为负数，则再加10。这里令个位为第1位。
**输入格式**
输入在一行中依次给出A和B，均为不超过100位的正整数，其间以空格分隔。
**输出格式**
在一行中输出加密后的结果。
**输入样例**
1234567 368782971
**输出样例**
3695Q8118
**程序**
```cpp
#include<iostream>
#include<string>
using namespace std;
int main() {
	string A, B;
	cin >> A >> B;
	int a, b;
	a = A.length();
	b = B.length();
	for (int i = 0;i < a-b;i++) //B比A短，前补0
		B = '0' + B;
	char flag;
	int judge = 1;
	for (int i = A.length() - 1, j = B.length() - 1;i >= 0 && j >= 0;--i, --j) {
		if (judge % 2 == 1) { //奇数位
			flag = (A[i] - '0' + B[j] - '0') % 13;
			if (flag < 10) flag += '0';
			if (flag == 10) flag = 'J';
			if (flag == 11)flag = 'Q';
			if (flag == 12)flag = 'K';
			B[j] = flag;
		}
		else {  //偶数位
			flag = (B[j] - '0') - (A[i] - '0');
			if (flag < 0) flag += 10;
			flag += '0';
			B[j] = flag;
		}
		judge++;
	}
	cout << B << endl;
	return 0;
}
```
## 1049. 数列的片段和(20)
给定一个正数数列，我们可以从中截取任意的连续的几个数，称为片段。例如，给定数列{0.1, 0.2, 0.3, 0.4}，我们有(0.1) (0.1, 0.2) (0.1, 0.2, 0.3) (0.1, 0.2, 0.3, 0.4) (0.2) (0.2, 0.3) (0.2, 0.3, 0.4) (0.3) (0.3, 0.4) (0.4) 这10个片段。
给定正整数数列，求出全部片段包含的所有的数之和。如本例中10个片段总和是0.1 + 0.3 + 0.6 + 1.0 + 0.2 + 0.5 + 0.9 + 0.3 + 0.7 + 0.4 = 5.0。
**输入格式**
输入第一行给出一个不超过105的正整数N，表示数列中数的个数，第二行给出N个不超过1.0的正数，是数列中的数，其间以空格分隔。
**输出格式**
在一行中输出该序列所有片段包含的数之和，精确到小数点后2位。
**输入样例**
4
0.1 0.2 0.3 0.4
**输出样例**
5.00
**程序**
```cpp
#include<iostream>
#include<iomanip>
using namespace std;
/*
可以这么看，对于i（i从0开始），
左边共加了（n-i）*i次
右边共加了n-i次
*/
int main() {
	int n;
	cin >> n;
	double sum = 0,x;
	for (int i = 0;i < n;i++) {

			cin >> x;
		sum += x*(n - i)*(i + 1);
	}
	cout << setiosflags(ios::fixed)<<setprecision(2)<<sum;
	return 0;
}
```
## 1050. 螺旋矩阵(25)
本题要求将给定的N个正整数按非递增的顺序，填入“螺旋矩阵”。所谓“螺旋矩阵”，是指从左上角第1个格子开始，按顺时针螺旋方向填充。要求矩阵的规模为m行n列，
满足条件：m * n等于N；m>=n；且m-n取所有可能值中的最小值。
**输入格式**
输入在第1行中给出一个正整数N，第2行给出N个待填充的正整数。所有数字不超过104，相邻数字以空格分隔。
**输出格式**
输出螺旋矩阵。每行n个数字，共m行。相邻数字以1个空格分隔，行末不得有多余空格。
**输入样例**
12
37 76 20 98 76 42 53 95 60 81 58 93
**输出样例**
98 95 93
42 37 81
53 20 76
58 60 76
**程序**
```cpp
#include<iostream>
#include<cmath>
#include<string>
#include<cstring>
#include<functional>
#include<algorithm>
using namespace std;
int main()
{
	int N;
	cin>>N;
	int *Data=new int[N];
	for(int i=0;i<N;i++)
	{
		cin>>Data[i];
	}
	int m,n=sqrt(N);
	while(N%n!=0)
	{
		n--;
	}
	m=N/n;
	int* *Matrix=new int*[m];
	for(int i=0;i<m;i++)
	{
		Matrix[i]=new int[n];
	}
	sort(Data,Data+N);
	for(int i=0,num=N-1;i<m&&num>=0;i++)
	{
		for(int col=i;col<n-i&&num>=0;col++)
		{
			Matrix[i][col]=Data[num--];
		}
		for(int row=i+1;row<m-i&&num>=0;row++)
		{
			Matrix[row][n-i-1]=Data[num--];
		}
		for(int col=n-i-2;col>=i&&num>=0;col--)
		{
			Matrix[m-i-1][col]=Data[num--];
		}
		for(int row=m-i-2;row>=i+1&&num>=0;row--)
		{
			Matrix[row][i]=Data[num--];
		}
	}
	for(int i=0;i<m;i++)
	{
		for(int j=0;j<n;j++)
		{
			cout<<Matrix[i][j];
			if(j+1<n)
			{
				cout<<" ";
			}
		}
		cout<<endl;
	}
	for(int i=0;i<m;i++)
	{
		delete[] Matrix[i];
	}
	delete[] Matrix;
	return 0;
}
```
## 1051. 复数乘法 (15)
复数可以写成(A + Bi)的常规形式，其中A是实部，B是虚部，i是虚数单位，满足i2 = -1；也可以写成极坐标下的指数形式(R * e(Pi))，其中R是复数模，P是辐角，i是虚数单位，其等价于三角形式 R(cos(P) + isin(P))。
现给定两个复数的R和P，要求输出两数乘积的常规形式。
**输入格式**
输入在一行中依次给出两个复数的R1, P1, R2, P2，数字间以空格分隔。
**输出格式**
在一行中按照“A+Bi”的格式输出两数乘积的常规形式，实部和虚部均保留2位小数。注意：如果B是负数，则应该写成“A-|B|i”的形式。
**输入样例**
2.3 3.5 5.2 0.4
**输出样例**
-8.68-8.23i
**程序**
```cpp
#include<iostream>
#include<algorithm>
#include<cstring>
#include<string>
#include<cmath>
#include<iomanip>
using namespace std;
int main()
{
	double R1, P1, R2, P2;
	cin >> R1 >> P1 >> R2 >> P2;
	double A = R1*R2*cos(P1 + P2);
	double B = R1*R2*sin(P1 + P2);
	/*double A = -0.004;
	double B = -0.004;*/
	//注意四舍五入-0.00的情况
	if (A > -0.005&&A < 0)
	{
		A = 0.00;
	}
	cout << setiosflags(ios::fixed) << setprecision(2) << A;
	if (B > -0.005 && B < 0)
	{
		B = 0.00;
	}
	if (B >= 0)
	{
		cout << "+";
	}
	cout << B << "i" << endl;
	return 0;
}
```
## 1052. 卖个萌 (20)
萌萌哒表情符号通常由“手”、“眼”、“口”三个主要部分组成。简单起见，我们假设一个表情符号是按下列格式输出的：
\[左手\](\[左眼\]\[口\]\[右眼\])\[右手\]
现给出可选用的符号集合，请你按用户的要求输出表情。
**输入格式**
输入首先在前三行顺序对应给出手、眼、口的可选符号集。每个符号括在一对方括号[]内。题目保证每个集合都至少有一个符号，并不超过10个符号；每个符号包含1到4个非空字符。
之后一行给出一个正整数K，为用户请求的个数。随后K行，每行给出一个用户的符号选择，顺序为左手、左眼、口、右眼、右手——这里只给出符号在相应集合中的序号（从1开始），数字间以空格分隔。
**输出格式**
对每个用户请求，在一行中输出生成的表情。若用户选择的序号不存在，则输出“Are you kidding me? @\/@”。
**输入样例**
```
[╮][╭][o][~\][/~]  [<][>]
 [╯][╰][^][-][=][>][<][@][⊙]
[Д][▽][_][ε][^]  ...
4
1 1 2 2 2
6 8 1 5 5
3 3 4 3 3
2 10 3 9 3
```
**输出样例**
```
╮(╯▽╰)╭
<(@Д=)/~
o(^ε^)o
Are you kidding me? @\/@
```
**程序**
```cpp
#include<iostream>
#include<cstring>
#include<string>
#include<algorithm>
#include<cmath>
#include<functional>
#include<vector>
typedef int Status;
const int OK = 1;
const int ERROR = 0;
using namespace std;
string s1, s2, s3;
vector<string> v1, v2, v3;
int a[5];
Status Deal(vector<string> &v,const string &s)
{
	int i = 0;
	string temp="";
	bool flag = false;
	for (int i = 0; i < s.length();i++)
	{
		if (s[i] == '[')
		{
			flag = true;
			continue;
		}
		if (s[i] != '['&&s[i] != ']'&&flag)
		{
			temp += s[i];
			continue;
		}
		if (s[i] == ']')
		{
			v.push_back(temp);
			temp = "";
			flag = false;
		}
	}
	return OK;
}
int main()
{
	getline(cin, s1);
	getline(cin, s2);
	getline(cin, s3);
	Deal(v1, s1);
	Deal(v2, s2);
	Deal(v3, s3);
	int k;
	cin >> k;
	bool flag;
	for (int i = 0; i < k; i++)
	{
		flag = true;
		for (int j = 0; j < 5; j++)
		{
			cin >> a[j];
			if (j == 0 || j == 4)
			{
				if (a[j]-1 > v1.size() - 1)
				{
					flag = false;
				}
			}
			if (j == 1 || j == 3)
			{
				if (a[j]-1 > v2.size() - 1)
				{
					flag = false;
				}
			}
			if (j == 2)
			{
				if (a[j]-1 > v3.size() - 1)
				{
					flag = false;
				}
			}
		}
		if (!flag)
		{
			cout << "Are you kidding me? @\\/@" << endl;
		}
		else
		{
			cout << v1[a[0]-1] << "(" << v2[a[1]-1] << v3[a[2]-1] << v2[a[3]-1] << ")" << v1[a[4]-1] << endl;
		}
	}
	return 0;
}
```
## 1053. 住房空置率 (20)
在不打扰居民的前提下，统计住房空置率的一种方法是根据每户用电量的连续变化规律进行判断。判断方法如下：
    在观察期内，若存在超过一半的日子用电量低于某给定的阈值e，则该住房为“可能空置”；
    若观察期超过某给定阈值D天，且满足上一个条件，则该住房为“空置”。
现给定某居民区的住户用电量数据，请你统计“可能空置”的比率和“空置”比率，即以上两种状态的住房占居民区住房总套数的百分比。
**输入格式**
输入第一行给出正整数N（<=1000），为居民区住房总套数；正实数e，即低电量阈值；正整数D，即观察期阈值。随后N行，每行按以下格式给出一套住房的用电量数据：
K E1 E2 ... EK
其中K为观察的天数，Ei为第i天的用电量。
**输出格式**
在一行中输出“可能空置”的比率和“空置”比率的百分比值，其间以一个空格分隔，保留小数点后1位。
**输入样例**
5 0.5 10
6 0.3 0.4 0.5 0.2 0.8 0.6
10 0.0 0.1 0.2 0.3 0.0 0.8 0.6 0.7 0.0 0.5
5 0.4 0.3 0.5 0.1 0.7
11 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1
11 2 2 2 1 1 0.1 1 0.1 0.1 0.1 0.1
**输出样例**
40.0% 20.0%
（样例解释：第2、3户为“可能空置”，第4户为“空置”，其他户不是空置。）
**程序**
```cpp
#include<iostream>
#include<cmath>
#include<algorithm>
#include<cstring>
#include<string>
#include<iomanip>
using namespace std;
int main()
{
	int n, D;
	double e;
	cin >> n >> e >> D;
	int d;
	double x;
	int num;
	int sum_e = 0;
	int sum_d = 0;
	for (int i = 0; i < n; i++)
	{
		cin >> d;
		num = 0;
		for (int j = 0; j < d; j++)
		{
			cin >> x;
			if (x < e)
			{
				num++;
			}
		}
		if (num > d / 2)
		{
			sum_e++;
			if (d > D)
			{
				sum_d++;
				sum_e--;
			}
		}
	}
	cout << setiosflags(ios::fixed) << setprecision(1)
		<< (double)sum_e / n * 100 << "% "
		<< (double)sum_d / n * 100 << "%" << endl;
	return 0;
}
```
## 1054. 求平均值 (20)
本题的基本要求非常简单：给定N个实数，计算它们的平均值。但复杂的是有些输入数据可能是非法的。一个“合法”的输入是[-1000，1000]区间内的实数，并且最多精确到小数点后2位。当你计算平均值的时候，不能把那些非法的数据算在内。
**输入格式**
输入第一行给出正整数N（<=100）。随后一行给出N个实数，数字间以一个空格分隔。
**输出格式**
对每个非法输入，在一行中输出“ERROR: X is not a legal number”，其中X是输入。最后在一行中输出结果：“The average of K numbers is Y”，其中K是合法输入的个数，Y是它们的平均值，精确到小数点后2位。如果平均值无法计算，则用“Undefined”替换Y。如果K为1，则输出“The average of 1 number is Y”。
**输入样例1**
7
5 -3.2 aaa 9999 2.3.4 7.123 2.35
**输出样例1**
ERROR: aaa is not a legal number
ERROR: 9999 is not a legal number
ERROR: 2.3.4 is not a legal number
ERROR: 7.123 is not a legal number
The average of 3 numbers is 1.38
**输入样例2**
2
aaa -9999
**输出样例2**
ERROR: aaa is not a legal number
ERROR: -9999 is not a legal number
The average of 0 numbers is Undefined
**程序**
```cpp
#include<iostream>
#include<stdlib.h>
#include<string>
#include<iomanip>
using namespace std;
int Check(char *str){
	int i=0,flag=0,inte=0,flo=0;
	if(str[i]=='-') i++; //跳过负号
	//if(str[i]=='.') return 0; //负号不能出现在首或者负号后面
	for(;str[i]!='\0';i++){
		if((str[i]>'9'||str[i]<'0')&&str[i]!='.') return 0; //只有数字和小数点为正确字符
		if(flag==1&&str[i]=='.') return 0;  //'.'重复出现
	    if(flag>0) flo++; //小数部位
	    if(str[i]=='.') flag=1;
	    if(flag==0)  inte++; //整数部位
	}
	if(flo>2) return 0;
	if(atof(str)<-1000.0||atof(str)>1000.0) return 0;
	return 1;
}

int main(){
	int n,counter=0;
	double sum=0;
	cin>>n;
	char str[101]={0};
	for(int i=0;i<n;i++){
		scanf("%s",str);

		if(Check(str)) {
			sum+=atof(str);
			counter++;
		}
		else
		cout<<"ERROR: "<<str<<" is not a legal number"<<endl;
	}
	sum/=counter;
	cout<<"The average of "<<counter<<" number";
	if(counter==0) cout<<"s is Undefined"<<endl;
	if(counter==1) cout<<" is "<<setiosflags(ios::fixed)<<setprecision(2)<<sum<<endl;
	if(counter>=2) cout<<"s is "<<setiosflags(ios::fixed)<<setprecision(2)<<sum<<endl;
	return 0;
}
```
## 1055. 集体照 (25)
拍集体照时队形很重要，这里对给定的N个人K排的队形设计排队规则如下：
    每排人数为N/K（向下取整），多出来的人全部站在最后一排；
    后排所有人的个子都不比前排任何人矮；
    每排中最高者站中间（中间位置为m/2+1，其中m为该排人数，除法向下取整）；
    每排其他人以中间人为轴，按身高非增序，先右后左交替入队站在中间人的两侧（例如5人身高为190、188、186、175、170，则队形为175、188、190、186、170。这里假设你面对拍照者，所以你的左边是中间人的右边）；
    若多人身高相同，则按名字的字典序升序排列。这里保证无重名。
现给定一组拍照人，请编写程序输出他们的队形。
**输入格式**
每个输入包含1个测试用例。每个测试用例第1行给出两个正整数N（<=10000，总人数）和K（<=10，总排数）。随后N行，每行给出一个人的名字（不包含空格、长度不超过8个英文字母）和身高（[30, 300]区间内的整数）。
**输出格式**
输出拍照的队形。即K排人名，其间以空格分隔，行末不得有多余空格。注意：假设你面对拍照者，后排的人输出在上方，前排输出在下方。
**输入样例**
10 3
Tom 188
Mike 170
Eva 168
Tim 160
Joe 190
Ann 168
Bob 175
Nick 186
Amy 160
John 159
**输出样例**
Bob Tom Joe Nick
Ann Mike Eva
Tim Amy John
**程序**
```cpp
#include<iostream>
#include<algorithm>
#include<cstring>
#include<string>
#include<cmath>
using namespace std;
struct Node {
	string name;
	int height;
}Data[10001];

bool cmp(const Node &a,const  Node &b)
{
	if (a.height == b.height)
	{
		return a.name < b.name;
	}
	return a.height > b.height;
}
void Print(int &index, int n)
{
	int mid = n / 2 + 1-1;
	string *save = new string[n];
	int left = mid - 1;
	int right = mid + 1;
	save[mid] = Data[index++].name;
	while (left >= 0 || right < n)
	{
		if (left >= 0)
		{
			save[left--] = Data[index++].name;
		}
		if (right < n)
		{
			save[right++] = Data[index++].name;
		}
	}
	for (int i = 0; i < n; i++)
	{
		cout << save[i];
		if (i != n - 1)
		{
			cout << " ";
		}
	}
	cout << endl;
}
int main()
{
	int n, row;
	cin >> n >> row;
	for (int i = 0; i < n; i++)
	{
		cin >> Data[i].name >> Data[i].height;
	}
	sort(Data, Data + n, cmp);
	int index = 0;
	int rNode = n / row + n % row;
	Print(index, rNode);
	for (int i = 1; i < row; i++)
	{
		Print(index, n / row);
	}
	return 0;
}
```
## 1056. 组合数的和(15)
给定N个非0的个位数字，用其中任意2个数字都可以组合成1个2位的数字。要求所有可能组合出来的2位数字的和。例如给定2、5、8，则可以组合出：25、28、52、58、82、85，它们的和为330。
**输入格式**
输入在一行中先给出N（1&lt;N&lt;10），随后是N个不同的非0个位数字。数字间以空格分隔。
**输出格式**
输出所有可能组合出来的2位数字的和。
**输入样例**
3 2 8 5
**输出样例**
330
**程序**
```cpp
#include<iostream>  
using namespace std;

int main() {
	int n;
	cin >> n;
	int* array = new int[n];
	for (int i = 0; i < n; i++)
		cin >> array[i];
	int sum = 0;
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < n; j++) {
			if (i != j)
				sum += array[i] * 10 + array[j];
		}
	}
	cout << sum << endl;
	return 0;
}
```
## 1057. 数零壹(20)
给定一串长度不超过105的字符串，本题要求你将其中所有英文字母的序号（字母a-z对应序号1-26，不分大小写）相加，得到整数N，然后再分析一下N的二进制表示中有多少0、多少1。例如给定字符串“PAT (Basic)”，其字母序号之和为：16+1+20+2+1+19+9+3=71，而71的二进制是1000111，即有3个0、4个1。
**输入格式**
输入在一行中给出长度不超过105、以回车结束的字符串。
**输出格式**
在一行中先后输出0的个数和1的个数，其间以空格分隔。
**输入样例**
PAT (Basic)
**输出样例**
3 4
**程序**
```cpp
#include<iostream>
#include<algorithm>
#include<cstring>
#include<string>
#include<functional>
#include<vector>
#include<bitset>
using namespace std;
int main()
{
	string str;
	getline(cin, str);
	int sum = 0;
	for (unsigned int i = 0; i < str.length(); i++)
	{
		if (isalpha(str[i]))
		{
			sum += toupper(str[i]) - 'A'+1;
		}
	}
	int sum = 0;
	int one = 0;
	int zero = 0;
	while (sum != 0)
	{
		if ((sum & 1) == 1)
		{
			one++;
		}
		else
		{
			zero++;
		}
		sum = sum >> 1;
	}
	cout << zero << " " << one << endl;
	return 0;
}
```
## 1058. 选择题(20)
批改多选题是比较麻烦的事情，本题就请你写个程序帮助老师批改多选题，并且指出哪道题错的人最多。
**输入格式**
输入在第一行给出两个正整数N（<=1000）和M（<=100），分别是学生人数和多选题的个数。随后M行，每行顺次给出一道题的满分值（不超过5的正整数）、选项个数（不少于2且不超过5的正整数）、正确选项个数（不超过选项个数的正整数）、所有正确选项。注意每题的选项从小写英文字母a开始顺次排列。各项间以1个空格分隔。最后N行，每行给出一个学生的答题情况，其每题答案格式为“(选中的选项个数 选项1 ……)”，按题目顺序给出。注意：题目保证学生的答题情况是合法的，即不存在选中的选项数超过实际选项数的情况。
**输出格式**
按照输入的顺序给出每个学生的得分，每个分数占一行。注意判题时只有选择全部正确才能得到该题的分数。最后一行输出错得最多的题目的错误次数和编号（题目按照输入的顺序从1开始编号）。如果有并列，则按编号递增顺序输出。数字间用空格分隔，行首尾不得有多余空格。如果所有题目都没有人错，则在最后一行输出“Too simple”。
**输入样例**
3 4
3 4 2 a c
2 5 1 b
5 3 2 b c
1 5 4 a b d e
(2 a c) (2 b d) (2 a c) (3 a b e)
(2 a c) (1 b) (2 a b) (4 a b d e)
(2 b d) (1 e) (2 b c) (4 a b c d)
**输出样例**
3
6
5
2 2 3 4
**程序**
```cpp
#include<iostream>
#include<algorithm>
#include<cstring>
#include<string>
using namespace std;
struct Problem
{
	int value;
	int number;
	char ch[5];
	int answer;
	int wrong;
}Data[101];
int main()
{
	int N, M;
	cin >> N >> M;
	for (int i = 0; i < M; i++)
	{
		cin >> Data[i].value >> Data[i].number >> Data[i].answer;
		for (int j = 0; j < Data[i].answer; j++)
		{
			cin.get();//干掉空格
			Data[i].ch[j] = cin.get();
			//注意这里使用cin.get()而不是cin，因为这里需要保留回车，为了下面读取答题数据方便
		}
		Data[i].wrong = 0;
	}
	int *score = new int[N];
	int Max = 0;
	fill(score, score + N, 0);
	for (int i = 0; i < N; i++)
	{
		for (int j = 0; j < M; j++)
		{

			cin.get();//左括号前的空格或回车

			cin.get();//干掉左括号
			int t=cin.get()-'0';
			//cin >> t;
			char ch;
			if (t != Data[j].answer)
			{
				Data[j].wrong++;
				Max = max(Data[j].wrong, Max);
				while ((ch = cin.get()) != ')') {}
			}
			else
			{
				int k;
				for (k = 0; k < t; k++)
				{
					cin.get();//干掉空格
					ch = cin.get();
					if (ch != Data[j].ch[k])
					{
						Data[j].wrong++;
						Max = max(Data[j].wrong, Max);//妈个鸡，经常干这种事情，j打成i，抓狂！！！！快疯了！！！
						while ((ch = cin.get()) != ')') {}
						break;
					}
				}
				if (k == t)
				{
					cin.get();//干掉右括号
					score[i] += Data[j].value;
				}
			}
		}
	}
	for (int i = 0; i < N; i++)
	{
		cout << score[i] << endl;
	}
	if (Max== 0)
	{
		cout << "Too simple" << endl;
		return 0;
	}
	cout << Max;
	for (int i = 0; i < M; i++)
	{
		if (Max == Data[i].wrong)
		{
			cout << " "<<i+1;
		}
	}
	cout << endl;
	delete[] score;
	return 0;
}
```
## 1059. C语言竞赛(20)
C语言竞赛是浙江大学计算机学院主持的一个欢乐的竞赛。既然竞赛主旨是为了好玩，颁奖规则也就制定得很滑稽：
0. 冠军将赢得一份“神秘大奖”（比如很巨大的一本学生研究论文集……）。
1. 排名为素数的学生将赢得最好的奖品 —— 小黄人玩偶！
2. 其他人将得到巧克力。
给定比赛的最终排名以及一系列参赛者的ID，你要给出这些参赛者应该获得的奖品。
**输入格式**
输入第一行给出一个正整数N（<=10000），是参赛者人数。随后N行给出最终排名，每行按排名顺序给出一位参赛者的ID（4位数字组成）。接下来给出一个正整数K以及K个需要查询的ID。
**输出格式**
对每个要查询的ID，在一行中输出“ID: 奖品”，其中奖品或者是“Mystery Award”（神秘大奖）、或者是“Minion”（小黄人）、或者是“Chocolate”（巧克力）。如果所查ID根本不在排名里，打印“Are you kidding?”（耍我呢？）。如果该ID已经查过了（即奖品已经领过了），打印“ID: Checked”（不能多吃多占）。
**输入样例**
6
1111
6666
8888
1234
5555
0001
6
8888
0001
1111
2222
8888
2222
**输出样例**
8888: Minion
0001: Chocolate
1111: Mystery Award
2222: Are you kidding?
8888: Checked
2222: Are you kidding?
**程序**
```cpp
#include <stdio.h>  
#include <stdlib.h>  
#include <math.h>  

#define MAX 10000  

int a[MAX];  

int isPrime(int n)  
{  
    int i;  
    if (n == 1)  
    {  
        return 0;  
    }  
    for (i = 2; i <= sqrt(n); i++)  
    {  
        if (n%i == 0)  
        {  
            return 0;  
        }  
    }  
    return 1;  
}  

int main()  
{  
    int N, i, id;  
    int k;  
    //freopen("d:\\input.txt", "r", stdin);  
    scanf("%d", &N);  
    for (i = 1; i <= N; i++)  
    {  
        scanf("%d", &id);  
        a[id] = i;  
    }  
    scanf("%d", &k);  
    for (i = 0; i < k; i++)  
    {  
        scanf("%d", &id);  
        if (a[id] == 0)  
        {  
            printf("%04d: Are you kidding?\n", id);  
            continue;  
        }  
        else if (a[id] == -1)  
        {  
            printf("%04d: Checked\n", id);  
        }  
        else  
        {  
            if (a[id] == 1)  
            {  
                printf("%04d: Mystery Award\n", id);  
            }  
            else  
            {  
                if (isPrime(a[id]))  
                {  
                    printf("%04d: Minion\n", id);  
                }  
                else  
                {  
                    printf("%04d: Chocolate\n", id);  
                }  
            }  
            a[id] = -1;  
        }  
    }  
    return 0;  
}  
```
```cpp
#include<iostream>
#include<algorithm>
#include<cstring>
#include<string>
#include<functional>
#include<set>
#include<iomanip>
using namespace std;
bool isPrime(int x)
{
	if (x < 2)
	{
		return false;
	}
	if (x == 2)
	{
		return true;
	}
	for (int i = 2; i*i <= x; i++)
	{
		if (x%i == 0)
		{
			return false;
		}
	}
	return true;
}
int main()
{
	int list[10001];
	bool visited[10001];
	set<int> s;
	int n;
	cin >> n;
	int temp;
	for (int i = 0; i < n; i++)
	{
		cin >> temp;
		s.insert(temp);
		list[temp] = i + 1;
		visited[temp] = false;
	}
	cin >> n;
	for (int i = 0; i < n; i++)
	{
		cin >> temp;
		cout <<setiosflags(ios::fixed)<<setw(4)<<setfill('0')<< temp << ": ";
		if (s.find(temp)==s.end())
		{
			cout << "Are you kidding?" << endl;
		}
		else if (visited[temp])
		{
			cout << "Checked" << endl;
		}
		else if (list[temp] == 1)
		{
			cout <<"Mystery Award" << endl;
			visited[temp] = true;
		}
		else if (isPrime(list[temp]))
		{
			cout << "Minion" << endl;
			visited[temp] = true;
		}
		else
		{
			cout << "Chocolate" << endl;
			visited[temp] = true;
		}
	}
	return 0;
}
```
## 1060. 爱丁顿数(25)
英国天文学家爱丁顿很喜欢骑车。据说他为了炫耀自己的骑车功力，还定义了一个“爱丁顿数”E，即满足有E天骑车超过E英里的最大整数E。据说爱丁顿自己的E等于87。
现给定某人N天的骑车距离，请你算出对应的爱丁顿数E（<=N）。
**输入格式**
输入第一行给出一个正整数N（<=105），即连续骑车的天数；第二行给出N个非负整数，代表每天的骑车距离。
**输出格式**
在一行中给出N天的爱丁顿数。
**输入样例**
10
6 7 6 9 3 10 8 2 7 8
**输出样例**
6
**程序**
```cpp
#include <iostream>  
#include <cstdio>  
#include <string>  
#include<vector>  
#include<algorithm>  
#include<functional>
using namespace std;
int main()
{
	int N;
	cin >> N;
	vector<int> v;
	while (N--)
	{
		int x;
		cin >> x;
		v.push_back(x);
	}
	sort(v.begin(), v.end(), greater<int>());
	int E;
	for (int i = 0; i <v.size(); i++)
	{
		if ((v.size() - i) < v[v.size() - i - 1])
		{
			E = v.size() - i;
			break;
		}
	}
	cout << E << endl;
	return 0;
}
```
## 1061. 判断题(15)
判断题的评判很简单，本题就要求你写个简单的程序帮助老师判题并统计学生们判断题的得分。
**输入格式**
输入在第一行给出两个不超过100的正整数N和M，分别是学生人数和判断题数量。第二行给出M个不超过5的正整数，是每道题的满分值。第三行给出每道题对应的正确答案，0代表“非”，1代表“是”。随后N行，每行给出一个学生的解答。数字间均以空格分隔。
**输出格式**
按照输入的顺序输出每个学生的得分，每个分数占一行。
**输入样例**
3 6
2 1 3 3 4 5
0 0 1 0 1 1
0 1 1 0 0 1
1 0 1 0 1 0
1 1 0 0 1 1
**输出样例**
13
11
12
**程序**
```cpp
#include<iostream>
#include<algorithm>
#include<string>
#include<cstring>
using namespace std;
struct Node
{
	int score;
	int answer;
};
int main()
{
	int N, M;
	cin >> N >> M;
	Node *Data = new Node[M];
	for (int i = 0; i < M; i++)
	{
		cin >> Data[i].score;
	}
	for (int i = 0; i < M; i++)
	{
		cin >> Data[i].answer;
	}
	int temp;
	int result;
	for (int i = 0; i < N; i++)
	{
		result = 0;
		for (int j = 0; j < M; j++)
		{
			cin >> temp;
			if (temp == Data[j].answer)
			{
				result += Data[j].score;
			}
		}
		cout << result << endl;
	}
	delete[] Data;
	return 0;
}
```
## 1062. 最简分数(20)
一个分数一般写成两个整数相除的形式：N/M，其中M不为0。最简分数是指分子和分母没有公约数的分数表示形式。
现给定两个不相等的正分数 N1/M1 和 N2/M2，要求你按从小到大的顺序列出它们之间分母为K的最简分数。
**输入格式**
输入在一行中按N/M的格式给出两个正分数，随后是一个正整数分母K，其间以空格分隔。题目保证给出的所有整数都不超过1000。
**输出格式**
在一行中按N/M的格式列出两个给定分数之间分母为K的所有最简分数，按从小到大的顺序，其间以1个空格分隔。行首尾不得有多余空格。题目保证至少有1个输出。
**输入样例**
7/18 13/20 12
**输出样例**
5/12 7/12
**程序**
```cpp
#include<iostream>
#include<vector>
#include<cstring>
#include<string>
#include<algorithm>
using namespace std;
int gcd(int x, int y)
{
	int z = x%y;
	while (z)
	{
		x = y;
		y = z;
		z = x%y;
	}
	return y;
}
int main()
{
	int N1, M1, N2, M2;
	int K;
	scanf("%d/%d %d/%d %d", &N1, &M1, &N2, &M2, &K);
	if (N1*M2 > N2*M1)
	{
		swap(N1, N2);
		swap(M1, M2);
	}
	int temp = 0;
	vector<int>v;
	while (temp*M1 <= N1*K)
	{
		temp++;
	}
	while (temp*M1 > N1*K&&temp*M2 < N2*K)
	{
		if (gcd(temp, K) == 1)
		{
			v.push_back(temp);
		}
		temp++;
	}
	for (unsigned int i = 0; i < v.size(); i++)
	{
		cout << v[i] << "/" << K;
		if (i != v.size() - 1)
		{
			cout << " ";
		}
	}
	cout << endl;
	return 0;
}
```
```cpp
#include<iostream>
#include<cmath>
#include<algorithm>
using namespace std;

struct Fraction{
	int up;    //Numerator
	int down;  //Denominator
  Fraction(){} //Default Constructor
	Fraction(int Up,int Down):up(Up),down(Down){} //
};

//Return the least common mutiple of x and y
int gcd(int x,int y){
	return !y? x:gcd(y,x%y);
}

//Reduce the fraction
//1.Denominator is non-negative: if the fraction is negative, just make the numerator negative
//2.if the fraction is zero, just up=0, down=1
//3.The greatest common divisor of numerator and denominator must be '1'.
Fraction reduction(Fraction fraction){
	if(fraction.down<0){
		fraction.up=-fraction.up;
		fraction.down=-fraction.down;
	}
	if(fraction.up==0){
		fraction.down=1;
	}else{
		int d=gcd(abs(fraction.up),abs(fraction.down));
		fraction.up/=d;
		fraction.down/=d;
	}
	return fraction;
}

//Addition
Fraction addition(Fraction f1,Fraction f2){
	Fraction fraction;
	fraction.up=f1.up*f2.down+f2.up*f1.down;
	fraction.down=f1.down*f2.down;
	return reduction(fraction);
}

//Subtraction
Fraction subtraction(Fraction f1,Fraction f2){
	Fraction fraction;
	fraction.up=f1.up*f2.down-f2.up*f1.down;
	fraction.down=f1.down*f2.down;
	return reduction(fraction);
}

//Multiplication
Fraction multiplication(Fraction f1,Fraction f2){
	Fraction fraction;
	fraction.up=f1.up*f2.up;
	fraction.down=f1.down*f2.down;
	return reduction(fraction);
}

//Division
Fraction division(Fraction f1,Fraction f2){
	Fraction fraction;
	fraction.up=f1.up*f2.down;
	fraction.down=f1.down*f2.up;
	return reduction(fraction);
}

//f1<f2
bool cmp(Fraction f1,Fraction f2){
	int d=gcd(f1.down,f2.down);
	int lcm=f1.down*f2.down/d;
	f1.up*=lcm/f1.down;
	f2.up*=lcm/f2.down;
	if(f1.up<f2.up) return true;
	else return false;
}
int main(){
	Fraction f1,f2;
	int k;
	while(scanf("%d/%d %d/%d %d",&f1.up,&f1.down,&f2.up,&f2.down,&k)!=EOF){
		if(!cmp(f1,f2)) swap(f1,f2);
		bool bFirst=true;
		for(int i=1;i<k;i++){
			Fraction fraction(i,k);
			if(cmp(f1,fraction)&&cmp(fraction,f2)){
				fraction=reduction(fraction);
				if(fraction.down==k){
					if(bFirst){
						bFirst=false;
					}else{
						printf(" ");
					}
					printf("%d/%d",fraction.up,fraction.down);
				}
			}
		}
		printf("\n");
	}
	return 0;
}
```
## 1063. 计算谱半径(20)
在数学中，矩阵的“谱半径”是指其特征值的模集合的上确界。换言之，对于给定的n个复数空间的特征值{a1+b1i, ..., an+bni}，它们的模为实部与虚部的平方和的开方，而“谱半径”就是最大模。
现在给定一些复数空间的特征值，请你计算并输出这些特征值的谱半径。
**输入格式**
输入第一行给出正整数N（<= 10000）是输入的特征值的个数。随后N行，每行给出1个特征值的实部和虚部，其间以空格分隔。注意：题目保证实部和虚部均为绝对值不超过1000的整数。
**输出格式**
在一行中输出谱半径，四舍五入保留小数点后2位。
**输入样例**
5
0 1
2 0
-1 0
3 3
0 -3
**输出样例**
4.24
**程序**
```cpp
#include<iostream>
#include<cmath>
#include<algorithm>
#include<iomanip>
using namespace std;

int main() {

	double Max = 0;
	int n;
	cin >> n;
	while (n--) {
		int a, b;
		cin >> a >> b;
		Max = max(Max, sqrt(a*a + b*b));
	}
	cout << setiosflags(ios::fixed) << setprecision(2) << Max ;
	return 0;
}
```
## 1064. 朋友数(20)
如果两个整数各位数字的和是一样的，则被称为是“朋友数”，而那个公共的和就是它们的“朋友证号”。例如123和51就是朋友数，因为1+2+3 = 5+1 = 6，而6就是它们的朋友证号。给定一些整数，要求你统计一下它们中有多少个不同的朋友证号。注意：我们默认一个整数自己是自己的朋友。
**输入格式**
输入第一行给出正整数N。随后一行给出N个正整数，数字间以空格分隔。题目保证所有数字小于104。
**输出格式**
首先第一行输出给定数字中不同的朋友证号的个数；随后一行按递增顺序输出这些朋友证号，数字间隔一个空格，且行末不得有多余空格。
**输入样例**
8
123 899 51 998 27 33 36 12
**输出样例**
4
3 6 9 26
**程序**
```cpp
#include<iostream>
#include<vector>
#include<algorithm>
using namespace std;
int Calculate(int x) {
	int sum = 0;
	while (x) {
		sum += x % 10;
		x /= 10;
	}
	return sum;
}
int main() {
	int n;
	cin >> n;
	vector<int> x;
	vector<int> y;
	for (int i = 0; i < n; i++) {
		int a;
		cin >> a;
		x.push_back(a);
		unsigned j = 0;
		for (; j < y.size(); j++) {
			if (Calculate(a) == y[j])
				break;
		}
		if (j == y.size())
			y.push_back(Calculate(a));
	}
	sort(y.begin(), y.end());
	cout << y.size() << endl;
	for (unsigned i = 0; i < y.size(); i++) {
		cout << y[i];
		if (i != y.size() - 1)
			cout << " ";
	}
	cout << endl;
	return 0;
}
```
```cpp
#include<iostream>
#include<algorithm>
#include<set>
#include<string>
#include<cstring>
#include<functional>
using namespace std;
int main()
{
	int N;
	cin >> N;
	string str;
	set<int> s;
	int sum;
	for (int i = 0; i < N; i++)
	{
		cin >> str;
		sum = 0;
		for (unsigned int j = 0; j < str.length(); j++)
		{
			sum += str[j]-'0';
		}
		s.insert(sum);
	}
	cout << s.size() << endl;
	for (set<int>::iterator it = s.begin(); it != s.end(); it++)
	{
		cout << *it;
		if (it != --s.end())
		{
			cout << " ";
		}
	}
	cout << endl;
	return 0;
}
```
## 1065. 单身狗(25)
“单身狗”是中文对于单身人士的一种爱称。本题请你从上万人的大型派对中找出落单的客人，以便给予特殊关爱。
**输入格式**
输入第一行给出一个正整数N（<=50000），是已知夫妻/伴侣的对数；随后N行，每行给出一对夫妻/伴侣——为方便起见，每人对应一个ID号，为5位数字（从00000到99999），ID间以空格分隔；之后给出一个正整数M（<=10000），为参加派对的总人数；随后一行给出这M位客人的ID，以空格分隔。题目保证无人重婚或脚踩两条船。
**输出格式**
首先第一行输出落单客人的总人数；随后第二行按ID递增顺序列出落单的客人。ID间用1个空格分隔，行的首尾不得有多余空格。
**输入样例**
3
11111 22222
33333 44444
55555 66666
7
55555 44444 10000 88888 22222 11111 23333
**输出样例**
5
10000 23333 44444 55555 88888
**程序**
```cpp
#include<iostream>
#include<algorithm>
#include<cstring>
#include<string>
#include<vector>
#include<functional>
#include<set>
#include<iomanip>
#include<map>
using namespace std;
map<int,int> m;//Couple映射
int main()
{
	int N;
	int a,b;
	set<int>v;//待访问集合
	set<int> save;//已婚集合
	cin >> N;
	for (int i = 0; i < N; i++)
	{
		cin >> a >> b;
		m[a] = b;
		m[b] = a;
		save.insert(a);
		save.insert(b);
	}
	cin >> N;
	for (int i = 0; i < N; i++)
	{
		cin >> a;
		v.insert(a);
	}
	set<int>s;//结果结合
	for (set<int>::iterator it = v.begin(); it != v.end(); it++)
	{
		if (save.find(*it)==save.end()||v.find(m[ *it ])==v.end())
		{
			s.insert(*it);
		}
	}
	cout << s.size()<<endl;
	for (set<int>::iterator it = s.begin(); it != s.end(); it++)
	{
		cout <<setw(5)<<setfill('0')<< *it;//注意输出格式
		if (it != --s.end())
		{
			cout <<" ";
		}
	}
	if (s.size() != 0)//注意空
	{
		cout << endl;
	}
	return 0;
}
```
## 1066. 图像过滤(15)
图像过滤是把图像中不重要的像素都染成背景色，使得重要部分被凸显出来。现给定一幅黑白图像，要求你将灰度值位于某指定区间内的所有像素颜色都用一种指定的颜色替换。
**输入格式**
输入在第一行给出一幅图像的分辨率，即两个正整数M和N（0 < M, N <= 500），另外是待过滤的灰度值区间端点A和B（0 <= A &lt; B <= 255）、以及指定的替换灰度值。随后M行，每行给出N个像素点的灰度值，其间以空格分隔。所有灰度值都在[0, 255]区间内。
**输出格式**
输出按要求过滤后的图像。即输出M行，每行N个像素灰度值，每个灰度值占3位（例如黑色要显示为000），其间以一个空格分隔。行首尾不得有多余空格。
**输入样例**
3 5 100 150 0
3 189 254 101 119
150 233 151 99 100
88 123 149 0 255
**输出样例**
003 189 254 000 000
000 233 151 099 000
088 000 000 000 255
**程序**
```cpp
#include<cstdio>  
int M, N, A, B, C;
const int maxn = 510;
int a[maxn][maxn];
int main()
{
	scanf("%d%d%d%d%d", &M, &N, &A, &B, &C);
	for (int i = 0; i < M; i++)
	{
		for (int j = 0; j < N; j++)
		{
			if (j > 0)printf(" ");
			scanf("%d", &a[i][j]);
			if (a[i][j] >= A&&a[i][j] <= B)
			{
				a[i][j] = C;
			}
			printf("%03d", a[i][j]);
		}
		printf("\n");
	}
	return 0;
}
```
```cpp
#include<iostream>
#include<algorithm>
#include<cstring>
#include<string>
#include<functional>
#include<iomanip>
using namespace std;
int main()
{
	std::ios::sync_with_stdio(false);
	int N, M;
	int A, B, G;
	cin >> M >> N >> A >> B >> G;
	int temp;
	for (int i = 0; i < M; i++)
	{
		for (int j = 0; j < N; j++)
		{
			cin >> temp;
			if (temp >= A&&temp <= B)
			{
				cout << setw(3) << setfill('0')<<G;
			}
			else
			{
				cout << setw(3) << setfill('0') << temp;
			}
			if (j != N - 1)
			{
				cout << " ";
			}
		}
		cout << endl;
	}
	return 0;
}
```
## 1067. 试密码(20)
当你试图登录某个系统却忘了密码时，系统一般只会允许你尝试有限多次，当超出允许次数时，账号就会被锁死。本题就请你实现这个小功能。
**输入格式**
输入在第一行给出一个密码（长度不超过20的、不包含空格、Tab、回车的非空字符串）和一个正整数N（<= 10），分别是正确的密码和系统允许尝试的次数。随后每行给出一个以回车结束的非空字符串，是用户尝试输入的密码。输入保证至少有一次尝试。当读到一行只有单个#字符时，输入结束，并且这一行不是用户的输入。
**输出格式**
对用户的每个输入，如果是正确的密码且尝试次数不超过N，则在一行中输出“Welcome in”，并结束程序；如果是错误的，则在一行中按格式输出“Wrong password: 用户输入的错误密码”；当错误尝试达到N次时，再输出一行“Account locked”，并结束程序。
**输入样例1**
Correct%pw 3
correct%pw
Correct@PW
whatisthepassword!
Correct%pw
\#
**输出样例1**
Wrong password: correct%pw
Wrong password: Correct@PW
Wrong password: whatisthepassword!
Account locked
**输入样例2**
cool@gplt 3
coolman@gplt
coollady@gplt
cool@gplt
try again
\#
**输出样例2**
Wrong password: coolman@gplt
Wrong password: coollady@gplt
Welcome in
**程序**
```cpp
#include<iostream>
#include<algorithm>
#include<algorithm>
#include<cstring>
#include<string>
using namespace std;
int main()
{
	std::ios::sync_with_stdio(false);
	string str;
	int count;
	cin >> str >> count;
	string temp;
	cin.get();//干掉换行符
	while (getline(cin,temp)&&temp != "#")//注意输入的待验证密码可能含有空行，题目的陷阱！
	{

		if (temp == str)
		{
			cout << "Welcome in" << endl;
			return 0;
		}
		else
		{
			cout << "Wrong password: " << temp << endl;
			count--;
			if (count == 0)
			{
				cout << "Account locked" << endl;
				return 0;
			}
		}

	}
	return 0;
}
```
## 1068. 万绿丛中一点红(20)
对于计算机而言，颜色不过是像素点对应的一个24位的数值。现给定一幅分辨率为MxN的画，要求你找出万绿丛中的一点红，即有独一无二颜色的那个像素点，并且该点的颜色与其周围8个相邻像素的颜色差充分大。
**输入格式**
输入第一行给出三个正整数，分别是M和N（<= 1000），即图像的分辨率；以及TOL，是所求像素点与相邻点的颜色差阈值，色差超过TOL的点才被考虑。随后N行，每行给出M个像素的颜色值，范围在[0, 224)内。所有同行数字间用空格或TAB分开。
**输出格式**
在一行中按照“(x, y): color”的格式输出所求像素点的位置以及颜色值，其中位置x和y分别是该像素在图像矩阵中的列、行编号（从1开始编号）。如果这样的点不唯一，则输出“Not Unique”；如果这样的点不存在，则输出“Not Exist”。
**输入样例1**
8 6 200
0 	 0 	  0 	   0	    0 	     0 	      0        0
65280 	 65280    65280    16711479 65280    65280    65280    65280
16711479 65280    65280    65280    16711680 65280    65280    65280
65280 	 65280    65280    65280    65280    65280    165280   165280
65280 	 65280 	  16777015 65280    65280    165280   65480    165280
16777215 16777215 16777215 16777215 16777215 16777215 16777215 16777215
**输出样例1**
(5, 3): 16711680
**输入样例2**
4 5 2
0 0 0 0
0 0 3 0
0 0 0 0
0 5 0 0
0 0 0 0
**输出样例2**
Not Unique
**输入样例3**
3 3 5
1 2 3
3 4 5
5 6 7
**输出样例3**
Not Exist
**程序**
```cpp
#include<iostream>
#include<algorithm>
#include<string>
#include<cstring>
using namespace std;
const int MAXN = 1001;
int map[MAXN][MAXN];
int M, N, TOL;
int UniqueColor[1 << 24] = { 0 };
int Steps[8][2] =
{
	-1, 0,
	-1,-1,
	-1, 1,
	 1, 0,
	 1,-1,
	 1, 1,
	 0,-1,
	 0, 1,
};
int main()
{
	std::ios::sync_with_stdio(false);
	int x = 1 << 24;
	//初始化数组居然还会导致内存超限？.....
	//fill(UniqueColor, UniqueColor + x, 0);
	//memset(UniqueColor, 0,sizeof(UniqueColor));
	cin >> M >> N >> TOL;
	for (int i = 0; i < N; i++)
	{
		for (int j = 0; j < M; j++)
		{
			cin >> map[i][j];
			UniqueColor[map[i][j]]++;
		}
	}
	int count = 0;
	int Unique = 0;
	int result_x = -1, result_y = -1, result = -1;
	int temp_x, temp_y;
	int num;
	for (int i = 0; i < N; i++)
	{
		for (int j = 0; j < M; j++)
		{
			count = 0;
			num = 0;//每个点相邻点个数
			if (UniqueColor[map[i][j]] == 1)//独一无二
			{
				for (int k = 0; k < 8; k++)
				{

					temp_x = i + Steps[k][0];
					temp_y = j + Steps[k][1];
					if (temp_x >= 0 && temp_x < N&&temp_y >= 0 && temp_y < M)
					{
						num++;
						if (abs(map[i][j] - map[temp_x][temp_y]) > TOL)
						{
							count++;
						}
					}
				}
				if (count == num)
				{
					result_x = i + 1;
					result_y = j + 1;
					result = map[i][j];
					Unique++;
				}
				if (Unique > 1)
				{
					cout << "Not Unique" << endl;
					return 0;
				}
			}
		}
	}
	if (Unique!=0)
	{
		cout << "(" << result_y << ", " << result_x << "): " << result << endl;
	}
	else
	{
		cout << "Not Exist" << endl;
	}
	return 0;
}
```
## 1069. 微博转发抽奖(20)
小明PAT考了满分，高兴之余决定发起微博转发抽奖活动，从转发的网友中按顺序每隔N个人就发出一个红包。请你编写程序帮助他确定中奖名单。
**输入格式**
输入第一行给出三个正整数M（<= 1000）、N和S，分别是转发的总量、小明决定的中奖间隔、以及第一位中奖者的序号（编号从1开始）。随后M行，顺序给出转发微博的网友的昵称（不超过20个字符、不包含空格回车的非空字符串）。
注意：可能有人转发多次，但不能中奖多次。所以如果处于当前中奖位置的网友已经中过奖，则跳过他顺次取下一位。
**输出格式**
按照输入的顺序输出中奖名单，每个昵称占一行。如果没有人中奖，则输出“Keep going...”。
**输入样例1**
9 3 2
Imgonnawin!
PickMe
PickMeMeMeee
LookHere
Imgonnawin!
TryAgainAgain
TryAgainAgain
Imgonnawin!
TryAgainAgain
**输出样例1**
PickMe
Imgonnawin!
TryAgainAgain
**输入样例2**
2 3 5
Imgonnawin!
PickMe
**输出样例2**
Keep going...
**程序**
```cpp
#include<iostream>
#include<vector>
#include<string>
#include<map>
using namespace std;
int main() {
	map<string, bool> save;
	vector<string>strs;
	string x;
	unsigned int m, n, s;
	cin >> m >> n >> s;
	for (unsigned int i = 0; i < m; i++) {
		cin >>x;
		strs.push_back(x);
		save[x] = false;
	}
	if (strs.size() < s) {
		cout << "Keep going..." << endl;
		return 0;
	}

	for (unsigned int i = s-1; i < strs.size(); ) {
		if (save[strs[i]]==false) {
			cout << strs[i] << endl;
			save[strs[i]] = true;
			i += n;
		}
		else
			i++;

	}
	return 0;
}
```
```cpp
#include<iostream>
#include<algorithm>
#include<cstring>
#include<string>
#include<functional>
#include<set>
using namespace std;
int M, N, S;
string str;
int k=0;
set<string>s;
int main()
{
	cin >> M >> N >> S;
	for (int i = 1; i <= M; i++)
	{
		cin >> str;
		if (i == S + k&&s.find(str) != s.end())
		{
			k += 1;
		}
		if (i == S+k&&s.find(str)==s.end())
		{
			cout << str << endl;
			s.insert(str);//判重
			k += N;
		}
	}
	if (k == 0)
	{
		cout << "Keep going..." << endl;
	}
	return 0;
}
```
## 1070. 结绳(25)
给定一段一段的绳子，你需要把它们串成一条绳。每次串连的时候，是把两段绳子对折，再如下图所示套接在一起。这样得到的绳子又被当成是另一段绳子，可以再次对折去跟另一段绳子串连。每次串连后，原来两段绳子的长度就会减半。
给定N段绳子的长度，你需要找出它们能串成的绳子的最大长度。
**输入格式**
每个输入包含1个测试用例。每个测试用例第1行给出正整数N (2 <= N <= 104)；第2行给出N个正整数，即原始绳段的长度，数字间以空格分隔。所有整数都不超过104。
**输出格式**
在一行中输出能够串成的绳子的最大长度。结果向下取整，即取为不超过最大长度的最近整数。
**输入样例**
8
10 15 12 3 4 13 1 15
**输出样例**
14
**程序**
```cpp
#include<iostream>
#include <queue>  
#include <functional>  
#include <vector>  
using namespace std;
/*
仔细想想就行，差点还傻乎乎想暴力DFS
直接每次取最小的两个合并就行了
*/
int main() {
	int n = 0;
	cin >> n;
	priority_queue<int, vector<int>, greater<int> > q;
	for (int i = 0; i < n; i++) {
		int temp = 0;
		cin >> temp;
		q.push(temp);
	}
	while (q.size() > 1) {
		int a = q.top();
		q.pop();
		int b = q.top();
		q.pop();

		q.push((a + b) / 2);
	}
	cout << q.top() << endl;
}
```
## 1071. 小赌怡情(15)
常言道“小赌怡情”。这是一个很简单的小游戏：首先由计算机给出第一个整数；然后玩家下注赌第二个整数将会比第一个数大还是小；玩家下注t个筹码后，计算机给出第二个数。若玩家猜对了，则系统奖励玩家t个筹码；否则扣除玩家t个筹码。
注意：玩家下注的筹码数不能超过自己帐户上拥有的筹码数。当玩家输光了全部筹码后，游戏就结束。
**输入格式**
输入在第一行给出2个正整数T和K（<=100），分别是系统在初始状态下赠送给玩家的筹码数、以及需要处理的游戏次数。随后K行，每行对应一次游戏，顺序给出4个数字：
n1 b t n2
其中n1和n2是计算机先后给出的两个[0, 9]内的整数，保证两个数字不相等。b为0表示玩家赌“小”，为1表示玩家赌“大”。t表示玩家下注的筹码数，保证在整型范围内。
**输出格式**
对每一次游戏，根据下列情况对应输出（其中t是玩家下注量，x是玩家当前持有的筹码量）：
    玩家赢，输出“Win t! Total = x.”；
    玩家输，输出“Lose t. Total = x.”；
    玩家下注超过持有的筹码量，输出“Not enough tokens. Total = x.”；
    玩家输光后，输出“Game Over.”并结束程序。
**输入样例1**
100 4
8 0 100 2
3 1 50 1
5 1 200 6
7 0 200 8
**输出样例1**
Win 100!  Total = 200.
Lose 50.  Total = 150.
Not enough tokens.  Total = 150.
Not enough tokens.  Total = 150.
**输入样例2**
100 4
8 0 100 2
3 1 200 1
5 1 200 6
7 0 200 8
**输出样例2**
Win 100!  Total = 200.
Lose 200.  Total = 0.
Game Over.
**程序**
```cpp
#include<iostream>
#include<algorithm>
#include<cstring>
#include<string>
#include<functional>
using namespace std;
struct Node
{
	int n1;
	int b;
	int t;
	int n2;
};
int main()
{
	int T, K;
	cin >> T >> K;
	int Total = T;
	Node *Data = new Node[K];
	for (int i = 0; i < K; i++)
	{
		cin >> Data[i].n1 >> Data[i].b >> Data[i].t >> Data[i].n2;
	}
	for (int i = 0; i < K; i++)
	{
		if (Total == 0)
		{
			cout << "Game Over." << endl;
			return 0;
		}
		if (Total < Data[i].t)
		{
			cout << "Not enough tokens.  Total = " << Total << "." << endl;
			continue;
		}
		if (Data[i].n1 > Data[i].n2)
		{
			if (Data[i].b == 0)
			{
				Total += Data[i].t;
				cout << "Win " << Data[i].t << "!  Total = " << Total << "." << endl;
			}
			else
			{
				Total -= Data[i].t;
				cout << "Lose " << Data[i].t << ".  Total = " << Total << "." << endl;
			}
		}
		else
		{
			if (Data[i].b == 1)
			{
				Total += Data[i].t;
				cout << "Win " << Data[i].t << "!  Total = " << Total << "." << endl;
			}
			else
			{
				Total -= Data[i].t;
				cout << "Lose " << Data[i].t << ".  Total = " << Total << "." << endl;
			}
		}
	}
	delete[] Data;
	return 0;
}
```
## 1072. 开学寄语(20)
下图是上海某校的新学期开学寄语：天将降大任于斯人也，必先删其微博，卸其QQ，封其电脑，夺其手机，收其ipad，断其wifi，使其百无聊赖，然后，净面、理发、整衣，然后思过、读书、锻炼、明智、开悟、精进。而后必成大器也！
本题要求你写个程序帮助这所学校的老师检查所有学生的物品，以助其成大器。
**输入格式**
输入第一行给出两个正整数N（<= 1000）和M（<= 6），分别是学生人数和需要被查缴的物品种类数。第二行给出M个需要被查缴的物品编号，其中编号为4位数字。随后N行，每行给出一位学生的姓名缩写（由1-4个大写英文字母组成）、个人物品数量K（0 <= K <= 10）、以及K个物品的编号。
**输出格式**
顺次检查每个学生携带的物品，如果有需要被查缴的物品存在，则按以下格式输出该生的信息和其需要被查缴的物品的信息（注意行末不得有多余空格）：
姓名缩写: 物品编号1 物品编号2 ……
最后一行输出存在问题的学生的总人数和被查缴物品的总数。
**输入样例**
4 2
2333 6666
CYLL 3 1234 2345 3456
U 4 9966 6666 8888 6666
GG 2 2333 7777
JJ 3 0012 6666 2333
**输出样例**
U: 6666 6666
GG: 2333
JJ: 6666 2333
3 5
**程序**
```cpp
#include<iostream>
#include<algorithm>
#include<cstring>
#include<string>
#include<functional>
#include<iomanip>
using namespace std;
int main()
{
	int N, M;
	cin >> N >> M;
	int *Check = new int[M];
	for (int i = 0; i < M; i++)
	{
		cin >> Check[i];
	}
	int Total_Student = 0, Total_things = 0;
	string str;
	int k;
	int thing;
	bool first = true;
	for (int i = 0; i < N; i++)
	{
		cin >> str >> k;
		first = true;
		for (int j = 0; j < k; j++)
		{
			cin >> thing;
			for (int h = 0; h < M; h++)
			{
				if (Check[h] == thing)
				{
					Total_things++;
					if (first)
					{
						first = false;
						cout << str << ":";
					}
					cout << " " <<setw(4)<<setfill('0')<< thing;
				}
			}
		}
		if (!first)
		{
			Total_Student++;
			cout << endl;
		}
	}
	cout << Total_Student << " " << Total_things << endl;
	delete[] Check;
	return 0;
}
```
## 1073. 多选题常见计分法(20)
批改多选题是比较麻烦的事情，有很多不同的计分方法。有一种最常见的计分方法是：如果考生选择了部分正确选项，并且没有选择任何错误选项，则得到50%分数；如果考生选择了任何一个错误的选项，则不能得分。本题就请你写个程序帮助老师批改多选题，并且指出哪道题的哪个选项错的人最多。
**输入格式**
输入在第一行给出两个正整数N（<=1000）和M（<=100），分别是学生人数和多选题的个数。随后M行，每行顺次给出一道题的满分值（不超过5的正整数）、选项个数（不少于2且不超过5的正整数）、正确选项个数（不超过选项个数的正整数）、所有正确选项。注意每题的选项从小写英文字母a开始顺次排列。各项间以1个空格分隔。最后N行，每行给出一个学生的答题情况，其每题答案格式为“(选中的选项个数 选项1 ……)”，按题目顺序给出。注意：题目保证学生的答题情况是合法的，即不存在选中的选项数超过实际选项数的情况。
**输出格式**
按照输入的顺序给出每个学生的得分，每个分数占一行，输出小数点后1位。最后输出错得最多的题目选项的信息，格式为：“错误次数 题目编号（题目按照输入的顺序从1开始编号）-选项号”。如果有并列，则每行一个选项，按题目编号递增顺序输出；再并列则按选项号递增顺序输出。行首尾不得有多余空格。如果所有题目都没有人错，则在最后一行输出“Too simple”。
**输入样例1**
3 4
3 4 2 a c
2 5 1 b
5 3 2 b c
1 5 4 a b d e
(2 a c) (3 b d e) (2 a c) (3 a b e)
(2 a c) (1 b) (2 a b) (4 a b d e)
(2 b d) (1 e) (1 c) (4 a b c d)
**输出样例1**
3.5
6.0
2.5
2 2-e
2 3-a
2 3-b
**输入样例2**
2 2
3 4 2 a c
2 5 1 b
(2 a c) (1 b)
(2 a c) (1 b)
**输出样例2**
5.0
5.0
Too simple
**程序**
```cpp
#include<iostream>
#include<algorithm>
#include<cstring>
#include<string>
#include<functional>
#include<vector>
#include<iomanip>
#include<set>
using namespace std;
struct Node
{
	int value;
	int num;
	int answer;
	set<char>s;
	int wrong;
};
int main()
{
	int N, M;
	cin >> N >> M;
	Node *Question = new Node[M];
	for (int i = 0; i < M; i++)
	{
		cin >> Question[i].value >> Question[i].num >> Question[i].answer;
		for (int j = 0; j < Question[i].answer; j++)
		{
			cin.get();//干掉空格
			char ch = cin.get();
			Question[i].s.insert(ch);
		}
		Question[i].wrong = 0;
	}
	double score = 0.;
	int temp;
	int ch;
	int Max = 0;
	int* *Set = new int *[M];
	for (int i = 0; i < M; i++)
	{
		Set[i] = new int[256];
		fill(Set[i], Set[i] + 256, 0);
	}
	set<char> s;//结果集

	bool flag;
	for (int i = 0; i < N; i++)
	{
		score = 0;
		for (int j = 0; j < M; j++)
		{
			s.clear();
			cin.get();//干掉空格或回车
			cin.get();//干掉左括号
			temp = cin.get() - '0';
			flag = true;
			for (int k = 0; k < temp; k++)
			{
				cin.get();//干掉空格
				ch = cin.get();
				s.insert(ch);
			}
			cin.get();//干掉右括号
			if (s == Question[j].s)//全对
			{
				score += Question[j].value;
			}
			else
			{
				for (set<char>::iterator it = s.begin(); it != s.end(); it++)//找出错误选项
				{
					if (Question[j].s.find(*it) == Question[j].s.end())
					{
						flag = false;//有错误选项
						Set[j][*it]++;
						if (Set[j][*it] > Max)
						{
							Max = Set[j][*it];
						}
					}
				}
				for (set<char>::iterator it = Question[j].s.begin(); it != Question[j].s.end(); it++)//找出漏选错误选项
				{
					if (s.find(*it) == s.end())
					{
						Set[j][*it]++;
						if (Set[j][*it] > Max)
						{
							Max = Set[j][*it];
						}
					}
				}
				if (flag)
				{
					score += Question[j].value / 2.0;
				}
			}

		}
		cout <<setiosflags(ios::fixed)<<setprecision(1)<< score << endl;
	}
	if (Max == 0)
	{
		cout << "Too simple" << endl;
		return 0;
	}
	for (int i = 0; i < M; i++)
	{
		for (int j = 0; j < 256; j++)
		{
			if (Set[i][j] == Max)
			{
				cout << Max << " " << i+1 << "-" << (char)(j) << endl;
			}
		}
	}
	for (int i = 0; i < M; i++)
	{
		delete[] Set[i];
	}
	delete[] Set;
	return 0;
}
```
## 1074. 宇宙无敌加法器(20)
地球人习惯使用十进制数，并且默认一个数字的每一位都是十进制的。而在PAT星人开挂的世界里，每个数字的每一位都是不同进制的，这种神奇的数字称为“PAT数”。每个PAT星人都必须熟记各位数字的进制表，例如“……0527”就表示最低位是7进制数、第2位是2进制数、第3位是5进制数、第4位是10进制数，等等。每一位的进制d或者是0（表示十进制）、或者是[2，9]区间内的整数。理论上这个进制表应该包含无穷多位数字，但从实际应用出发，PAT星人通常只需要记住前20位就够用了，以后各位默认为10进制。
在这样的数字系统中，即使是简单的加法运算也变得不简单。例如对应进制表“0527”，该如何计算“6203+415”呢？我们得首先计算最低位：3+5=8；因为最低位是7进制的，所以我们得到1和1个进位。第2位是：0+1+1（进位）=2；因为此位是2进制的，所以我们得到0和1个进位。第3位是：2+4+1（进位）=7；因为此位是5进制的，所以我们得到2和1个进位。第4位是：6+1（进位）=7；因为此位是10进制的，所以我们就得到7。最后我们得到：6203+415=7201。
**输入格式**
输入首先在第一行给出一个N位的进制表（0 &lt; N <=20），以回车结束。 随后两行，每行给出一个不超过N位的正的PAT数。
**输出格式**
在一行中输出两个PAT数之和。
**输入样例**
30527
06203
415
**输出样例**
7201
**程序**
```cpp
#include<iostream>
#include<algorithm>
#include<cstring>
#include<string>
#include<functional>
#include<vector>
using namespace std;
int main()
{
	string str;
	cin >> str;
	string a, b;
	string result = "";
	cin >> a >> b;

	int sum;
	int g = 0;//进位
	int i, j, k;
	i = j = k = 0;
	while (a[0] == '0'&&a.length()!=1)//剔除开头0位，下同
	{
		a.erase(0, 1);
	}
	while (b[0] == '0'&&b.length()!=1)//刚开始煞笔用i，j还j++我想打我自己
	{
		b.erase(0, 1);
	}
	int x;
	for (i = a.length() - 1, j = b.length() - 1, k = str.length() - 1; i >= 0 && j >= 0 && k >= 0; i--, j--, k--)
	{
		sum = (a[i] - '0') + (b[j] - '0') + g;
		(str[k] - '0' != 0) ? (x = str[k] - '0') : (x = 10);
		g = sum / x;
		sum %= x;
		result = (char)(sum + '0') + result;
	}

	while (i >= 0)
	{
		if (k < 0)
		{
			x = 10;
		}
		else
		{
			(str[k] - '0' != 0) ? (x = str[k] - '0') : (x = 10);
		}
		sum = a[i] - '0' + g;
		g = sum / x;
		sum %= x;
		result = (char)(sum + '0') + result;
		k--;
		i--;
	}
	while (j >= 0)
	{
		if (k < 0)
		{
			x = 10;
		}
		else
		{
			(str[k] - '0' != 0) ? (x = str[k] - '0') : (x = 10);
		}
		sum = b[j] - '0' + g;
		g = sum / x;
		sum %= x;
		result = (char)(sum + '0') + result;
		k--;
		j--;
	}
	if(g != 0)//进制2-10，不包括1,进位只有0或1，别无他值
	{
		result = '1' + result;
	}
	cout << result << endl;
	return 0;
}
```
```cpp
#include<iostream>
#include<algorithm>
#include<string>
#include<vector>
using namespace std;
int main()
{
	string norm;
	string a,b;
	cin>>norm>>a>>b;
	string Max;
	string Min;
	if(a.length()>=b.length())
	{
		Max=a;
		Min=b;
	}
	else
	{
		Max=b;
		Min=a;
	}
	reverse(norm.begin(),norm.end());
	reverse(Max.begin(),Max.end());
	reverse(Min.begin(),Min.end());
	//cout<<norm<<":"<<Max<<":"<<Min<<endl;

	int flag=0;//进位
	int i;
	for(i=0;i<Max.length();i++)
	{
		int x;
		if((norm[i]-'0')==0)
		{
			x=10;
		}
		else
		{
			x=norm[i]-'0';
		}
		if(i<Min.length())
		{
			int temp=(Max[i]-'0')+(Min[i]-'0');
			Max[i]=(char)((temp+flag)%x+'0');
			flag=( temp + flag)/x;
			//cout<<"flag:"<<flag<<endl;
		}
		else
		{
			int temp=(Max[i]-'0');
			Max[i]=(char)( (temp+flag)%x+'0');
			flag=(temp+flag)/x;
			//cout<<"flag:"<<flag<<endl;
		}		
	}
	if(flag!=0)
	{
		Max+=(char)(flag+'0');
	}
	reverse(Max.begin(),Max.end());
	/*if(Max[0]=='0'&&Max.length()>1)
	{
		Max.erase(0,1);
	}*/
	while(Max[0]=='0')
	{
		Max.erase(0,1);
	}
	if(Max.length()==0)
	{
		Max="0";
	}
    cout<<Max<<endl;
	return 0;
}
```
## 1075. 链表元素分类(25)
给定一个单链表，请编写程序将链表元素进行分类排列，使得所有负值元素都排在非负值元素的前面，而[0, K]区间内的元素都排在大于K的元素前面。但每一类内部元素的顺序是不能改变的。例如：给定链表为 18→7→-4→0→5→-6→10→11→-2，K为10，则输出应该为 -4→-6→-2→7→0→5→10→18→11。
**输入格式**
每个输入包含1个测试用例。每个测试用例第1行给出：第1个结点的地址；结点总个数，即正整数N (<= 105)；以及正整数K (<=1000)。结点的地址是5位非负整数，NULL地址用-1表示。
接下来有N行，每行格式为：
Address Data Next
其中Address是结点地址；Data是该结点保存的数据，为[-105, 105]区间内的整数；Next是下一结点的地址。题目保证给出的链表不为空。
**输出格式**
对每个测试用例，按链表从头到尾的顺序输出重排后的结果链表，其上每个结点占一行，格式与输入相同。
**输入样例**
00100 9 10
23333 10 27777
00000 0 99999
00100 18 12309
68237 -6 23333
33218 -4 00000
48652 -2 -1
99999 5 68237
27777 11 48652
12309 7 33218
**输出样例**
33218 -4 68237
68237 -6 48652
48652 -2 12309
12309 7 00000
00000 0 99999
99999 5 23333
23333 10 00100
00100 18 27777
27777 11 -1
**程序**
```cpp
#include<iostream>
#include<algorithm>
#include<cstring>
#include<string>
#include<vector>
#include<iomanip>
using namespace std;
struct Node
{
	int add;
	int data;
	int next;
};
int main()
{
	std::ios::sync_with_stdio(false);
	int Address, N, K;
	cin >> Address >> N >> K;
	vector<Node> preData(100001);
	vector<Node> Sort;
	vector<Node> result;
	Node temp;
	for (int i = 0; i < N; i++)
	{
		cin >> temp.add >> temp.data >> temp.next;
		preData[temp.add] = temp;
	}
	int first = Address;
	while (first != -1)//排序
	{
		Sort.push_back(preData[first]);
		first = preData[first].next;
	}
	for (vector<Node>::iterator it = Sort.begin(); it != Sort.end(); it++)//负数向前迁移
	{
		if (it->data < 0)
		{
			result.push_back(*it);
		}
	}
	for (vector<Node>::iterator it = Sort.begin(); it != Sort.end(); it++)
	{
		if (it->data >= 0 && it->data <= K)
		{
			result.push_back(*it);
		}
	}
	for (vector<Node>::iterator it = Sort.begin(); it != Sort.end(); it++)
	{
		if (it->data > K)
		{
			result.push_back(*it);
		}
	}
	for (unsigned int i = 0; i < result.size()-1; i++)
	{
		result[i].next = result[i + 1].add;
		cout <<setw(5)<<setfill('0')<< result[i].add << " " << result[i].data << " " <<setw(5)<<setfill('0')<< result[i].next << endl;
	}
	cout << setw(5) << setfill('0') << result[result.size()-1].add << " " << result[result.size() - 1].data << " " << -1 << endl;
	return 0;
}
```
