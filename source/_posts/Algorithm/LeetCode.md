---
title: LeetCode
translate_title: leetcode
date: 2019-11-12 21:19:42
tags:
  - Algorithm
  - C++
reward: true
toc: true
---
|题目|难度|算法|
|:--|:--:|:--:|
|1. 两数之和|Easy|Hash|
|7. 整数反转|Easy|限制判断|
|9. 回文数|Easy|字符串，Two points|
|13. 罗马数字转整数|Easy|字符串，技巧|
|14. 最长公共前缀|Easy|字符串比较|
|20. 有效的括号|Easy|栈|
|21. 合并两个有序链表|Easy|单链表|
|26. 删除排序数组中的重复项|Easy|数组去重|
|27. 移除元素|Easy|数组去重|
|28. 实现strStr|Easy|KMP算法|
|35. 搜索插入位置|Easy|二分查找|
|38. 报数|Easy|字符串|
|53. 最大子序和|Easy|动态规划|
|58. 最后一个单词的长度|Easy|字符串|
|66. 加一|Easy|加法进位|
|67. 二进制求和|Easy|加法进位|
|69. x 的平方根|Easy|二分法|
|70. 爬楼梯|Easy|动态规划|
|83. 删除排序链表中的重复元素|Easy|单链表|
|88. 合并两个有序数组|Easy|数组合并|
|98. 验证二叉搜索树|Medium|二叉搜索树|
|100. 相同的树|Easy|二叉树|
|101. 对称二叉树|Easy|二叉树|
|104. 二叉树的最大深度|Easy|二叉树|
|105. 从前序与中序遍历序列构造二叉树|Medium|二叉树|
|106. 从中序与后序遍历序列构造二叉树|Medium|二叉树|
|107. 二叉树的层次遍历 II|Easy|二叉树|
|108. 将有序数组转换为二叉搜索|Easy|二叉树|
|109. 有序链表转换二叉搜索树|Medium|平衡二叉树|
|110. 平衡二叉树|Easy|二叉树|
|111. 二叉树的最小深度|Easy|二叉树|
|112. 路径总和|Easy|二叉树|
|113. 路径总和 II|Medium|二叉树|
|118. 杨辉三角|Easy|简单模拟|
|119. 杨辉三角 II|Easy|动态规划|
|121. 买卖股票的最佳时机|Easy|动态规划|
|122. 买卖股票的最佳时机 II|Easy|动态规划|
|125. 验证回文串|Easy|字符串|
|130. 被围绕的区域|Medium|并查集|
|136. 只出现一次的数字|Easy|逻辑|
|141. 环形链表|Easy|单链表，快慢指针|
|155. 最小栈|Easy|栈|
|160. 相交链表|Easy|双指针|
|167. 两数之和 II - 输入有序数组|Easy|Hash|
|168. Excel表列名称|Easy|字符串hash|
|169. 多数元素|Easy|逻辑|
|171. Excel表列序号|Easy|字符串hash|
|189. 旋转数组|Easy|数组移动|
|190. 颠倒二进制位|Easy|二进制|
|191. 位1的个数|Easy|二进制|
|198. 打家劫舍|Easy|动态规划|
|200. 岛屿数量|Medium|并查集|
|202. 快乐数|Easy|快慢指针|
|203. 移除链表元素|Easy|单链表|
|204. 计数质数|Easy|素数Euler|
|205. 同构字符串|Easy|Hash|
|206. 反转链表|Easy|单链表|
|207. 课程表|Medium|拓扑排序|
|210. 课程表 II|Medium|拓扑排序|
|217. 存在重复元素|Easy|Hash|
|219. 存在重复元素 II|Easy|Hash|
|225. 用队列实现栈|Easy|队列|
|226. 翻转二叉树|Easy|二叉树|
|231. 2的幂|Easy|快速幂|
|307. 区域和检索 - 数组可修改|Medium|树状数组|
|315. 计算右侧小于当前元素的个数|Hard|树状数组|
|399. 除法求值|Medium|并查集|
|547. 朋友圈|Medium|并查集|
|684. 冗余连接|Medium|并查集|

## 1.两数之和
**Description**
给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。
你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。
**Example**
给定 nums = [2, 7, 11, 15], target = 9
因为 nums[0] + nums[1] = 2 + 7 = 9
所以返回 [0, 1]
**Program**
Hash只记录最后一次nums[i]出现的位置，之后判断即可。
```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        map<int, int> m;
        for(int i=0;i<nums.size();i++){
            m[nums[i]] = i;
        }
        vector<int> result;
        for(int i=0;i<nums.size();i++){
            if(m.find(target-nums[i])!=m.end()){
                if(nums[i]!=target-nums[i]||(nums[i]==target-nums[i]&&m[nums[i]]!=i)){
                    result.push_back(i);
                    result.push_back(m[target-nums[i]]);
                    break;
                }
            }
        }
        return result;
    }
};
```
## 7.整数反转
**Description**
给出一个 32 位的有符号整数，你需要将这个整数中每位上的数字进行反转。
**Example**
示例 1:
输入: 123
输出: 321
示例 2:
输入: -123
输出: -321
示例 3:
输入: 120
输出: 21
**Program**
```cpp
class Solution {
public:
    int reverse(int x) {
        long result=0;
        while(x!=0){
            result = result*10+x%10;
            if(result<INT_MIN||result>INT_MAX) return 0;
            x/=10;
        }
        return result;
    }
};
```
## 9.回文数
**Description**
判断一个整数是否是回文数。回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。
**Example**
示例 1:
输入: 121
输出: true
示例 2:
输入: -121
输出: false
解释: 从左向右读, 为 -121 。 从右向左读, 为 121- 。因此它不是一个回文数。
示例 3:
输入: 10
输出: false
解释: 从右向左读, 为 01 。因此它不是一个回文数。
**Program**
```cpp
class Solution {
public:
    bool isPalindrome(int x) {
        if(x<0) return false;
        string str;
        while(x!=0){
            str+=(x%10)+'0';
            x/=10;
        }
        int left=0, right=str.length()-1;
        while(left<right){
            if(str[left]!=str[right]) return false;
            else{
                left++;
                right--;
            }
        }
        return true;
    }
};
```
**方法：反转一半数字
思路**
映入脑海的第一个想法是将数字转换为字符串，并检查字符串是否为回文。但是，这需要额外的非常量空间来创建问题描述中所不允许的字符串。
第二个想法是将数字本身反转，然后将反转后的数字与原始数字进行比较，如果它们是相同的，那么这个数字就是回文。
但是，如果反转后的数字大于 \text{int.MAX}int.MAX，我们将遇到整数溢出问题。
按照第二个想法，为了避免数字反转可能导致的溢出问题，为什么不考虑只反转 \text{int}int 数字的一半？毕竟，如果该数字是回文，其后半部分反转后应该与原始数字的前半部分相同。
例如，输入 1221，我们可以将数字 “1221” 的后半部分从 “21” 反转为 “12”，并将其与前半部分 “12” 进行比较，因为二者相同，我们得知数字 1221 是回文。
让我们看看如何将这个想法转化为一个算法。
**算法**
首先，我们应该处理一些临界情况。所有负数都不可能是回文，例如：-123 不是回文，因为 - 不等于 3。所以我们可以对所有负数返回 false。
现在，让我们来考虑如何反转后半部分的数字。
对于数字 1221，如果执行 1221 % 10，我们将得到最后一位数字 1，要得到倒数第二位数字，我们可以先通过除以 10 把最后一位数字从 1221 中移除，1221 / 10 = 122，再求出上一步结果除以 10 的余数，122 % 10 = 2，就可以得到倒数第二位数字。如果我们把最后一位数字乘以 10，再加上倒数第二位数字，1 * 10 + 2 = 12，就得到了我们想要的反转后的数字。如果继续这个过程，我们将得到更多位数的反转数字。
现在的问题是，我们如何知道反转数字的位数已经达到原始数字位数的一半？
我们将原始数字除以 10，然后给反转后的数字乘上 10，所以，当原始数字小于反转后的数字时，就意味着我们已经处理了一半位数的数字。
**时间复杂度：**对于每次迭代，我们会将输入除以10，因此时间复杂度为$O\left(\log_{10}{n}\right)$
**空间复杂度：**$O\left(1\right)$
```cpp
class Solution {
public:
    bool isPalindrome(int x) {
        if(x<0||(x%10==0&&x!=0)) return false;
        int reverseNum=0;
        while(x>reverseNum){
            reverseNum=reverseNum*10+x%10;
            x/=10;
        }
        return x==reverseNum || x==reverseNum/10;
    }
};
```
## 13.罗马数字转整数
**Description**
罗马数字包含以下七种字符: I， V， X， L，C，D 和 M。
字符          数值
I             1
V             5
X             10
L             50
C             100
D             500
M             1000
例如， 罗马数字 2 写做 II ，即为两个并列的 1。12 写做 XII ，即为 X + II 。 27 写做  XXVII, 即为 XX + V + II 。
通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如 4 不写做 IIII，而是 IV。数字 1 在数字 5 的左边，所表示的数等于大数 5 减小数 1 得到的数值 4 。同样地，数字 9 表示为 IX。这个特殊的规则只适用于以下六种情况：
- I 可以放在 V (5) 和 X (10) 的左边，来表示 4 和 9。
- X 可以放在 L (50) 和 C (100) 的左边，来表示 40 和 90。 
- C 可以放在 D (500) 和 M (1000) 的左边，来表示 400 和 900。
给定一个罗马数字，将其转换成整数。输入确保在 1 到 3999 的范围内。
**Example**
示例 1:
输入: "III"
输出: 3

示例 2:
输入: "IV"
输出: 4

示例 3:
输入: "IX"
输出: 9

示例 4:
输入: "LVIII"
输出: 58
解释: L = 50, V= 5, III = 3.

示例 5:
输入: "MCMXCIV"
输出: 1994
解释: M = 1000, CM = 900, XC = 90, IV = 4.
**Program**
代码行数：解析
构建一个字典记录所有罗马数字子串，注意长度为2的子串记录的值是（实际值 - 子串内左边罗马数字代表的数值）
这样一来，遍历整个 ss 的时候判断当前位置和后一个位置的两个字符组成的字符串是否在字典内，如果在就记录值，不在就说明当前位置不存在小数字在前面的情况，直接记录当前位置字符对应值

```cpp
class Solution {
public:
    int romanToInt(string s) {
        map<string, int> m={
            {"I", 1},
            {"IV", 4},
            {"IX", 9},
            {"V", 5},
            {"X", 10},
            {"XL", 40},
            {"XC", 90},
            {"L", 50},
            {"C", 100},
            {"CD", 400},
            {"CM", 900},
            {"D", 500},
            {"M", 1000}
        };
        int result=0;
        for(int i=0;i<s.length();){
            string s1=s.substr(i, 1);
            if(i<s.length()-1){
                string s2 = s.substr(i, 2);
                if(m.find(s2)!=m.end()){
                    result+=m[s2];
                    i+=2;
                }else{
                    result+=m[s1];
                    i++;
                }
            }else{
                result+=m[s1];
                i++;
            }
        }
        return result;
    }
};
```
## 14. 最长公共前缀
**Description**
编写一个函数来查找字符串数组中的最长公共前缀。
如果不存在公共前缀，返回空字符串 ""。
**Example**
示例 1:
输入: ["flower","flow","flight"]
输出: "fl"

示例 2:
输入: ["dog","racecar","car"]
输出: ""
解释: 输入不存在公共前缀。
说明:
所有输入只包含小写字母 a-z 。
**Program**
```cpp
class Solution {
public:
    string cmp(const string & s1, const string & s2){
        string result="";
        for(int i=0;i<s1.length()&&i<s2.length();i++){
            if(s1[i]!=s2[i]) break;
            else result+=s1[i];
        }
        return result;
    }
    string longestCommonPrefix(vector<string>& strs) {
        if(strs.size()==0) return "";
        string result=strs[0];
        for(int i=1;i<strs.size();i++){
            result=cmp(result, strs[i]);
            if(result.length()==0) break;
        }
        return result;
    }
};
```
## 20. 有效的括号
**Description**
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。
有效字符串需满足：
左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。
注意空字符串可被认为是有效字符串。
**Example**
示例 1:
输入: "()"
输出: true

示例 2:
输入: "()[]{}"
输出: true

示例 3:
输入: "(]"
输出: false

示例 4:
输入: "([)]"
输出: false

示例 5:
输入: "{[]}"
输出: true
**Program**
```cpp
class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        map<char,char> sToe={
            {'(', ')'},
            {'{', '}'},
            {'[', ']'}
        };
        for(int i=0;i<s.length();i++){
            if(s[i]!=']'
            &&s[i]!=')'
            &&s[i]!='\}') {
                st.push(s[i]);
            }else{
                if(st.empty()) return false;
                else{
                    char ch=st.top();
                    st.pop();
                    if(sToe[ch]!=s[i]) return false;
                }
            }
        }
        if(!st.empty()) return false;
        return true;
    }
};
```
## 21. 合并两个有序链表
**Description**
将两个有序链表合并为一个新的有序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 
**Example**
示例：
输入：1->2->4, 1->3->4
输出：1->1->2->3->4->4
**Program**
```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode* newNode(int val){
        ListNode* node=new ListNode(val);
        return node;
    }
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode* result=new ListNode(0);
        ListNode* tmp=result;
        while(l1!=NULL&&l2!=NULL){
            if(l1->val<=l2->val){
                tmp->next=newNode(l1->val);
                tmp=tmp->next;
                l1=l1->next;
            }else{
                tmp->next=newNode(l2->val);
                tmp=tmp->next;
                l2=l2->next;
            }
        }
        while(l1!=NULL){
            tmp->next=newNode(l1->val);
            tmp=tmp->next;
            l1=l1->next;
        }
        while(l2!=NULL){
            tmp->next=newNode(l2->val);
            tmp=tmp->next;
            l2=l2->next;
        }
        if(result->next!=NULL) result=result->next;
        else result=NULL;
        return result;
    }
};
```
## 26. 删除排序数组中的重复项
**Description**
给定一个排序数组，你需要在原地删除重复出现的元素，使得每个元素只出现一次，返回移除后数组的新长度。
不要使用额外的数组空间，你必须在原地修改输入数组并在使用 O(1) 额外空间的条件下完成。
**Example**
示例 1:
给定数组 nums = [1,1,2],
函数应该返回新的长度 2, 并且原数组 nums 的前两个元素被修改为 1, 2。
你不需要考虑数组中超出新长度后面的元素。

示例 2:
给定 nums = [0,0,1,1,1,2,2,3,3,4],
函数应该返回新的长度 5, 并且原数组 nums 的前五个元素被修改为 0, 1, 2, 3, 4。
你不需要考虑数组中超出新长度后面的元素。
**Program**
```cpp
class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        if(nums.size()==0) return 0;
        int idx=0;
        for(int i=1;i<nums.size();i++){
            if(nums[i]!=nums[i-1]){
                nums[++idx]=nums[i];
            }
        }
        return idx+1;
    }
};
```
## 27. 移除元素
**Description**
给定一个数组 nums 和一个值 val，你需要原地移除所有数值等于 val 的元素，返回移除后数组的新长度。
不要使用额外的数组空间，你必须在原地修改输入数组并在使用 O(1) 额外空间的条件下完成。
元素的顺序可以改变。你不需要考虑数组中超出新长度后面的元素。
**Example**
示例 1:
给定 nums = [3,2,2,3], val = 3,
函数应该返回新的长度 2, 并且 nums 中的前两个元素均为 2。
你不需要考虑数组中超出新长度后面的元素。

示例 2:
给定 nums = [0,1,2,2,3,0,4,2], val = 2,
函数应该返回新的长度 5, 并且 nums 中的前五个元素为 0, 1, 3, 0, 4。
注意这五个元素可为任意顺序。
你不需要考虑数组中超出新长度后面的元素。
**Program**
```cpp
class Solution {
public:
    int removeElement(vector<int>& nums, int val) {
        if(nums.size()==0) return 0;
        int idx=-1;
        for(int i=0;i<nums.size();i++){
            if(nums[i]!=val){
                nums[++idx]=nums[i];
            }
        }
        return idx+1;
    }
};
```
## 28. 实现strStr
**Description**
现 strStr() 函数。

给定一个 haystack 字符串和一个 needle 字符串，在 haystack 字符串中找出 needle 字符串出现的第一个位置 (从0开始)。如果不存在，则返回  -1。
**Example**
示例 1:
输入: haystack = "hello", needle = "ll"
输出: 2

示例 2:
输入: haystack = "aaaaa", needle = "bba"
输出: -1
**Program**
```cpp
class Solution {
public:
    int* getNextval(const string &str){
        int* nextval=new int[str.length()];
        nextval[0]=-1;
        int j=nextval[0];
        for(int i=1;i<str.length();i++){
            while(j!=-1&&str[i]!=str[j+1]){
                j=nextval[j];
            }
            if(str[i]==str[j+1]){
                j++;
            }
            if(j==-1||str[i+1]!=str[j+1]){
                nextval[i]=j;
            }else nextval[i]=nextval[j];
        }
        return nextval;
    }
    int strStr(string haystack, string needle) {
        if(needle.length()==0) return 0;
        int* nextval=getNextval(needle);
        int j=-1;
        for(int i=0;i<haystack.length();i++){
            while(j!=-1&&haystack[i]!=needle[j+1]){
                j=nextval[j];
            }
            if(haystack[i]==needle[j+1]){
                j++;
            }
            if(j==needle.length()-1){
                return i - needle.length() + 1;
            }
        }
        return -1;
    }
};
```
## 35. 搜索插入位置
**Description**
给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
你可以假设数组中无重复元素。
**Example**
示例 1:
输入: [1,3,5,6], 5
输出: 2

示例 2:
输入: [1,3,5,6], 2
输出: 1

示例 3:
输入: [1,3,5,6], 7
输出: 4

示例 4:
输入: [1,3,5,6], 0
输出: 0
**Program**
```cpp
class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        int left=0,right=nums.size()-1;
        int mid;
        while(left<right){
            mid = (left+right)/2;
            if(nums[mid]==target) return mid;
            else if(nums[mid]>target) right=mid;
            else left=mid+1;
        }
        if(right==nums.size()-1&&nums[right]<target) right++;
        return right;
    }
};
```
## 38. 报数
**Description**
报数序列是一个整数序列，按照其中的整数的顺序进行报数，得到下一个数。其前五项如下：
```
1.     1
2.     11
3.     21
4.     1211
5.     111221
```
1 被读作  "one 1"  ("一个一") , 即 11。
11 被读作 "two 1s" ("两个一"）, 即 21。
21 被读作 "one 2",  "one 1" （"一个二" ,  "一个一") , 即 1211。
给定一个正整数 n（1 ≤ n ≤ 30），输出报数序列的第 n 项。
注意：整数顺序将表示为一个字符串。
**Example**
示例 1:
输入: 1
输出: "1"

示例 2:
输入: 4
输出: "1211"
**Program**
```cpp
#include<iostream>
#include<algorithm>
#include<cstring>
using namespace std;
string countAndSay(int n) {
    string strs[30];
    strs[0]="1";
    for(int i=1;i<30;i++){
        int ans=1;
        cout<<strs[i-1]<<endl;
        strs[i]="";
        for(int j=1;j<strs[i-1].length();j++){
            if(strs[i-1][j]==strs[i-1][j-1]) ans++;
            else{
                strs[i]+=ans+'0';
                strs[i]+=strs[i-1][j-1];
                ans=1;
            }
        }
        strs[i]+=ans+'0';
        cout<<strs[i-1].length()<<"last:"<<strs[i-1][strs[i-1].length()-1]<<endl;
        strs[i]+=strs[i-1][strs[i-1].length()-1];
        cout<<strs[i]<<endl;
    }

    return strs[n-1];
}
int main(){
	cout<<countAndSay(2)<<endl;
	return 0;
}
```
## 53. 最大子序和
**Description**
给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
**Example**
示例:
输入: [-2,1,-3,4,-1,2,1,-5,4],
输出: 6
解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。
**Program**
```cpp
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int* DP=new int[nums.size()];
        fill(DP,DP+nums.size(), INT_MIN);
        DP[0]=nums[0];
        for(int i=1;i<nums.size();i++){
            DP[i]=max(nums[i],DP[i-1]+nums[i]);
        }
        int MAX=INT_MIN;
        for(int i=0;i<nums.size();i++){
            if(DP[i]>MAX) MAX=DP[i];
        }
        return MAX;
    }
};
```
## 58. 最后一个单词的长度
**Description**
给定一个仅包含大小写字母和空格 ' ' 的字符串，返回其最后一个单词的长度。
如果不存在最后一个单词，请返回 0 。
说明：一个单词是指由字母组成，但不包含任何空格的字符串。
**Example**
示例:
输入: "Hello World"
输出: 5
**Program**
```cpp
#include<iostream>
#include<algorithm>
#include<cstring>
#include<vector>
using namespace std;
int maxSubArray(vector<int>& nums) {
        int* DP=new int[nums.size()];
        memset(DP,0,sizeof(DP));
        DP[0]=max(DP[0], nums[0]);
        for(int i=1;i<nums.size();i++){
            DP[i]=max(nums[i],DP[i-1]+nums[i]);
        }
        int Max=0;
        for(int i=0;i<nums.size();i++){
            if(DP[i]>Max) Max=DP[i];
        }
        return Max;
    }
int main(){
	string str="a";
	int idx=str.find_last_of(' ');
	if(idx!=string::npos) cout<<str.length()-idx-1;
	else cout<<str.length()<<endl;
	return 0;
}
```
## 66. 加一
**Description**
给定一个由整数组成的非空数组所表示的非负整数，在该数的基础上加一。
最高位数字存放在数组的首位， 数组中每个元素只存储单个数字。
你可以假设除了整数 0 之外，这个整数不会以零开头。
**Example**
示例 1:
输入: [1,2,3]
输出: [1,2,4]
解释: 输入数组表示数字 123。

示例 2:
输入: [4,3,2,1]
输出: [4,3,2,2]
解释: 输入数组表示数字 4321。
**Program**
```cpp
class Solution {
public:
    vector<int> plusOne(vector<int>& digits) {
        int carry_bit=1;
        for(int i=digits.size()-1;i>=0;i--){
            int tmp=(digits[i]+carry_bit)%10;
            carry_bit=(digits[i]+carry_bit)/10;
            digits[i]=tmp;
        }
        if(carry_bit!=0){
            vector<int> result;
            result.push_back(carry_bit);
            for(int i=0;i<digits.size();i++){
                result.push_back(digits[i]);
            }
            return result;
        }
        return digits;
    }
};
```
## 67. 二进制求和
**Description**
给定两个二进制字符串，返回他们的和（用二进制表示）。
输入为非空字符串且只包含数字 1 和 0。
**Example**
示例 1:
输入: a = "11", b = "1"
输出: "100"

示例 2:
输入: a = "1010", b = "1011"
输出: "10101"
**Program**
```cpp
class Solution {
public:
    string addBinary(string a, string b) {
        int carry_bit = 0;
        if(a.length()<b.length()) swap(a, b);
        reverse(a.begin(),a.end());
        reverse(b.begin(),b.end());
        for(int i=0;i<b.length();i++){
            int tmp=a[i]-'0'+b[i]-'0'+carry_bit;
            a[i]=tmp%2+'0';
            carry_bit=tmp/2;
        }
        int idx=b.length();
        while(carry_bit!=0&&idx<a.length()){
            int tmp=a[idx]-'0'+carry_bit;
            a[idx]=tmp%2+'0';
            carry_bit=tmp/2;
            idx++;
        }
        if(carry_bit!=0) a+=carry_bit+'0';
        reverse(a.begin(),a.end());
        return a;
    }
};
```
## 69. x 的平方根
**Description**
实现 int sqrt(int x) 函数。
计算并返回 x 的平方根，其中 x 是非负整数。
由于返回类型是整数，结果只保留整数的部分，小数部分将被舍去。
**Example**
示例 1:
输入: 4
输出: 2

示例 2:
输入: 8
输出: 2
说明: 8 的平方根是 2.82842...,
     由于返回类型是整数，小数部分将被舍去。
**Program**
注意二分法，left+right+1防止死循环
```cpp
class Solution {
public:
    int mySqrt(int x) {
        long long left=0, right=x;
        while(left<right){
            //加1防止死循环
            long long mid=(left+right+1)/2;
            if(mid*mid<=(long long)x) left=mid;
            else right=mid-1;
        }
        return left;
    }
};
```
## 70. 爬楼梯
**Description**
假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
注意：给定 n 是一个正整数。
**Example**
示例 1：
输入： 2
输出： 2
解释： 有两种方法可以爬到楼顶。
1.  1 阶 + 1 阶
2.  2 阶

示例 2：
输入： 3
输出： 3
解释： 有三种方法可以爬到楼顶。
1.  1 阶 + 1 阶 + 1 阶
2.  1 阶 + 2 阶
3.  2 阶 + 1 阶
**Program**
```cpp
class Solution {
public:
    int climbStairs(int n) {
        vector<int> DP;
        DP.resize(n+1);
        DP[0]=DP[1]=1;
        for(int i=2;i<=n;i++){
            DP[i]=DP[i-1]+DP[i-2];
        }
        return DP[n];
    }
};
```
## 83. 删除排序链表中的重复元素
**Description**
给定一个排序链表，删除所有重复的元素，使得每个元素只出现一次。
**Example**
示例 1:
输入: 1->1->2
输出: 1->2

示例 2:
输入: 1->1->2->3->3
输出: 1->2->3
**Program**
```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode* deleteDuplicates(ListNode* head) {
        if(head==NULL) return head;
        ListNode* tmp=head;
        ListNode* pre=tmp;
        tmp=tmp->next;
        while(tmp!=NULL){
            if(tmp->val==pre->val){
                pre->next=tmp->next;
                tmp=pre->next;
            }else{
                pre=tmp;
                tmp=tmp->next;
            }
        }
        return head;
    }
};
```
## 88. 合并两个有序数组
**Description**
给定两个有序整数数组 nums1 和 nums2，将 nums2 合并到 nums1 中，使得 num1 成为一个有序数组。
说明:
初始化 nums1 和 nums2 的元素数量分别为 m 和 n。
你可以假设 nums1 有足够的空间（空间大小大于或等于 m + n）来保存 nums2 中的元素。
**Example**
示例:
输入:
nums1 = [1,2,3,0,0,0], m = 3
nums2 = [2,5,6],       n = 3
输出: [1,2,2,3,5,6]
**Program**
```cpp
class Solution {
public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        int idx1=0, idx2=0;
        vector<int> result;
        while(idx1<m&&idx2<n){
            if(nums1[idx1]<=nums2[idx2]){
                result.push_back(nums1[idx1++]);
            }else{
                result.push_back(nums2[idx2++]);
            }
        }
        while(idx1<m){
            result.push_back(nums1[idx1++]);
        }
        while(idx2<n){
            result.push_back(nums2[idx2++]);
        }
        for(int i=0;i<result.size();i++) nums1[i]=result[i];
    }
};
```
## 100. 相同的树
**Description**
给定两个二叉树，编写一个函数来检验它们是否相同。
如果两个树在结构上相同，并且节点具有相同的值，则认为它们是相同的。
**Example**
示例 1:
```
输入:       1         1
          / \       / \
         2   3     2   3

        [1,2,3],   [1,2,3]
输出: true
```
示例 2:
```
输入:      1          1
          /           \
         2             2

        [1,2],     [1,null,2]

输出: false
```
示例 3:
```
输入:       1         1
          / \       / \
         2   1     1   2

        [1,2,1],   [1,1,2]

输出: false
```
**Program**
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        if(p==NULL&&q==NULL) return true;
        else if(p!=NULL&&q!=NULL&&p->val==q->val){
            if(isSameTree(p->left,q->left)){
                return isSameTree(p->right, q->right);
            }else return false;
        }else return false;
    }
};
```
## 101. 对称二叉树
**Description**
给定一个二叉树，检查它是否是镜像对称的。
**Example**
```
例如，二叉树 [1,2,2,3,4,4,3] 是对称的。

    1
   / \
  2   2
 / \ / \
3  4 4  3
但是下面这个 [1,2,2,null,3,null,3] 则不是镜像对称的:

    1
   / \
  2   2
   \   \
   3    3
说明:
```
**Program**
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    bool isMirror(TreeNode* r1, TreeNode* r2){
        if(r1==NULL&&r2==NULL) return true;
        else if(r1!=NULL&&r2!=NULL&&r1->val==r2->val){
            if(isMirror(r1->left, r2->right)) return isMirror(r1->right, r2->left);
            else return false;
        }else return false;
    }
    bool isSymmetric(TreeNode* root) {
        return isMirror(root, root);
    }

};
```
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    bool isSymmetric(TreeNode* root) {
        queue<TreeNode*> q1, q2;
        q1.push(root);
        q2.push(root);
        while(!q1.empty()){
            TreeNode* t1=q1.front();
            TreeNode* t2=q2.front();
            q1.pop();q2.pop();
            if(t1!=NULL&&t2!=NULL&&t1->val!=t2->val) return false;
            else if((t1==NULL&&t2!=NULL)||(t1!=NULL&&t2==NULL)) return false;
            if(t1!=NULL){
                q1.push(t1->left);
                q1.push(t1->right);
            }
            if(t2!=NULL){
                q2.push(t2->right);
                q2.push(t2->left);
            }

        }
        return true;
    }

};
```
## 104. 二叉树的最大深度
**Description**
给定一个二叉树，找出其最大深度。
二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。
说明: 叶子节点是指没有子节点的节点。
**Example**
示例：
给定二叉树 [3,9,20,null,null,15,7]，
```
    3
   / \
  9  20
    /  \
   15   7
```
返回它的最大深度 3 。
**Program**
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if(root==NULL) return 0;
        else return max(maxDepth(root->left), maxDepth(root->right))+1;
    }
};
```
## 107. 二叉树的层次遍历 II
**Description
给定一个二叉树，返回其节点值自底向上的层次遍历。 （即按从叶子节点所在层到根节点所在的层，逐层从左向右遍历）
**Example**
例如：
给定二叉树 [3,9,20,null,null,15,7],
```
    3
   / \
  9  20
    /  \
   15   7
返回其自底向上的层次遍历为：
```
```
[
  [15,7],
  [9,20],
  [3]
]
```
**Program**
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    struct Node{
        int val;
        int height;
        Node* left;
        Node* right;
    };
    Node* newRoot;
    vector<vector<int>> levelOrderBottom(TreeNode* root) {
        deque<vector<int>> dq;
        queue<Node*> q;
        vector<vector<int> > result;
        if(root==NULL) return result;
        getHeight(root, 0, newRoot);
        q.push(newRoot);
        vector<int> tmp;
        int pre=1;
        while(!q.empty()){
            Node* top=q.front();
            if(top->height!=pre){
                pre=top->height;
                dq.push_front(tmp);
                tmp.clear();        
            }
            tmp.push_back(top->val);
            q.pop();
            if(top->left!=NULL) q.push(top->left);
            if(top->right!=NULL) q.push(top->right);
        }
        dq.push_front(tmp);
        while(!dq.empty()){
            vector<int> top=dq.front();
            dq.pop_front();
            result.push_back(top);
        }
        return result;
    }
    void getHeight(TreeNode* root, int height, Node* &newRoot){
        if(root==NULL) return;
        else{
            newRoot = new Node;
            newRoot->val=root->val;
            newRoot->left=newRoot->right=NULL;
            newRoot->height=height+1;
            getHeight(root->left, height+1, newRoot->left);
            getHeight(root->right, height+1, newRoot->right);
        }
    }
};
```
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    vector<vector<int>> levelOrderBottom(TreeNode* root) {
        vector<vector<int>> res;
        levelorder(root,0,res);
        return vector<vector<int>>(res.rbegin(),res.rend());
    }

    void levelorder(TreeNode* node, int level, vector<vector<int>>& res)
    {
        if(!node) return ;
        if(res.size()==level) res.push_back({});
        res[level].push_back(node->val);
        if(node->left) levelorder(node->left,level+1, res);
        if(node->right) levelorder(node->right,level+1,res);
    }

};
```
## 108. 将有序数组转换为二叉搜索树
**Description**
将一个按照升序排列的有序数组，转换为一棵高度平衡二叉搜索树。
本题中，一个高度平衡二叉树是指一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过 1。
**Example**
示例:
给定有序数组: [-10,-3,0,5,9],
一个可能的答案是：[0,-3,9,-10,null,5]，它可以表示下面这个高度平衡二叉搜索树：
```
      0
     / \
   -3   9
   /   /
 -10  5
```
**Program**
一开始还想直接上平衡二叉树模板....
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    TreeNode* sortedArrayToBST(vector<int>& nums) {
        if(nums.size()==0) return NULL;
        TreeNode* root;
        tree(root, nums, 0, nums.size()-1);
        return root;
    }
    void tree(TreeNode* &root,const vector<int> &nums, int left, int right){
        if(left>right){
            root=NULL;
            return;
        }
        int mid=(left+right+1)/2;
        root=new TreeNode(nums[mid]);
        root->left=root->right=NULL;
        tree(root->left, nums, left, mid-1);
        tree(root->right, nums, mid+1, right);
    }
};
```
## 110. 平衡二叉树
**Description**
给定一个二叉树，判断它是否是高度平衡的二叉树。
本题中，一棵高度平衡二叉树定义为：
一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过1。
**Example**
示例 1:
给定二叉树 [3,9,20,null,null,15,7]
```
    3
   / \
  9  20
    /  \
   15   7
```
返回 true 。

示例 2:
给定二叉树 [1,2,2,3,3,null,null,4,4]
```
       1
      / \
     2   2
    / \
   3   3
  / \
 4   4
```
返回 false 。
**Program**
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    bool isBalanced(TreeNode* root) {
        int num=0;
        return judge(root, num);
    }
    bool judge(TreeNode* root, int &num){
        if(root==NULL){
            num=0;
            return true;
        }
        if(judge(root->left, num)){
            int l=num;
            if(judge(root->right, num)){
                int r=num;
                if(abs(l-r)<=1){
                    num=max(l, r)+1;
                    return true;
                }else return false;
            }else return false;
        }
        return false;
    }
};
```
## 111. 二叉树的最小深度
**Description**
给定一个二叉树，找出其最小深度。
最小深度是从根节点到最近叶子节点的最短路径上的节点数量。
说明: 叶子节点是指没有子节点的节点。
**Example**
示例:
给定二叉树 [3,9,20,null,null,15,7],
```
    3
   / \
  9  20
    /  \
   15   7
```
返回它的最小深度  2.
**Program**
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    const int INF=0x3f3f3f3f;
    int minD=INF;
    int minDepth(TreeNode* root) {
        if(root==NULL) return 0;
        depth(root, 0);
        return minD;
    }
    void depth(TreeNode* root, int num){
        if(root==NULL) return;
        if(root->left==NULL&&root->right==NULL){
            minD=min(minD, num+1);
        }
        depth(root->left, num+1);
        depth(root->right, num+1);
    }
};
```
## 112. 路径总和
**Description**
给定一个二叉树和一个目标和，判断该树中是否存在根节点到叶子节点的路径，这条路径上所有节点值相加等于目标和。
说明: 叶子节点是指没有子节点的节点。
**Example**
示例: 
给定如下二叉树，以及目标和 sum = 22，
```
              5
             / \
            4   8
           /   / \
          11  13  4
         /  \      \
        7    2      1
````
返回 true, 因为存在目标和为 22 的根节点到叶子节点的路径 `5->4->11->2`。
**Program**
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    bool hasPathSum(TreeNode* root, int sum) {
        if(root==NULL) return false;
        sum-=root->val;
        if(sum==0&&root->left==NULL&&root->right==NULL) return true;
        return hasPathSum(root->left, sum) || hasPathSum(root->right, sum);
    }

};
```
## 118. 杨辉三角
**Description**
给定一个非负整数 numRows，生成杨辉三角的前 numRows 行。
![图示](/assets/img/algorithm/PascalTriangleAnimated2.gif)
在杨辉三角中，每个数是它左上方和右上方的数的和。
**Example**
示例:
输入: 5
输出:
```
[
     [1],
    [1,1],
   [1,2,1],
  [1,3,3,1],
 [1,4,6,4,1]
]
```
**Program**
```cpp
class Solution {
public:
    vector<vector<int>> generate(int numRows) {
        vector<vector<int>> vec;
        vector<int> tmp;
        for(int row=0;row<numRows;row++){
            for(int i=0;i<=row;i++){
                if(i==0||i==row) tmp.push_back(1);
                else{
                    int sum=vec[row-1][i-1]+vec[row-1][i];
                    tmp.push_back(sum);
                }
            }
            vec.push_back(tmp);
            tmp.clear();
        }
        return vec;
    }
};
```
## 119. 杨辉三角 II
**Description**
给定一个非负索引 k，其中 k ≤ 33，返回杨辉三角的第 k 行。
![图示](/assets/img/algorithm/PascalTriangleAnimated2.gif)
在杨辉三角中，每个数是它左上方和右上方的数的和。
**Example**
示例:
输入: 3
输出: [1,3,3,1]
**Program**
```cpp
class Solution {
public:
    vector<int> getRow(int rowIndex) {
        vector<int> vec;
        vec.resize(rowIndex+1);
        fill(vec.begin(), vec.end(), 0);
        vec[0]=1;
        for(int row=1;row<=rowIndex;row++){
            for(int i=rowIndex;i>=0;i--){
                if(i!=0) vec[i]=vec[i-1]+vec[i];
            }
        }
        return vec;
    }
};
```
## 121. 买卖股票的最佳时机
**Description**
给定一个数组，它的第 i 个元素是一支给定股票第 i 天的价格。
如果你最多只允许完成一笔交易（即买入和卖出一支股票），设计一个算法来计算你所能获取的最大利润。
注意你不能在买入股票前卖出股票。
**Example**
示例 1:
输入: [7,1,5,3,6,4]
输出: 5
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
     注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格。

示例 2:
输入: [7,6,4,3,1]
输出: 0
解释: 在这种情况下, 没有交易完成, 所以最大利润为 0。
**Program**
```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice=INT_MAX;
        int maxProfit=0;
        for(int i=0;i<prices.size();i++){
            if(prices[i]<minPrice){
                minPrice=prices[i];
            }
            maxProfit=max(maxProfit, prices[i]-minPrice);
        }
        return maxProfit;
    }
};
```
## 122. 买卖股票的最佳时机 II
**Description**
给定一个数组，它的第 i 个元素是一支给定股票第 i 天的价格。
设计一个算法来计算你所能获取的最大利润。你可以尽可能地完成更多的交易（多次买卖一支股票）。
注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
**Example**
示例 1:
输入: [7,1,5,3,6,4]
输出: 7
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 3 天（股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4 。
     随后，在第 4 天（股票价格 = 3）的时候买入，在第 5 天（股票价格 = 6）的时候卖出, 这笔交易所能获得利润 = 6-3 = 3 。

示例 2:
输入: [1,2,3,4,5]
输出: 4
解释: 在第 1 天（股票价格 = 1）的时候买入，在第 5 天 （股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4 。
     注意你不能在第 1 天和第 2 天接连购买股票，之后再将它们卖出。
     因为这样属于同时参与了多笔交易，你必须在再次购买前出售掉之前的股票。

示例 3:
输入: [7,6,4,3,1]
输出: 0
解释: 在这种情况下, 没有交易完成, 所以最大利润为 0。
**Program**
```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int result=0;
        for(int i=1;i<prices.size();i++){
            result+=max(0, prices[i]-prices[i-1]);
        }
        return result;
    }
};
```
## 125. 验证回文串
**Description**
给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。
说明：本题中，我们将空字符串定义为有效的回文串。
**Example**
示例 1:
输入: "A man, a plan, a canal: Panama"
输出: true

示例 2:
输入: "race a car"
输出: false
**Program**
```cpp
class Solution {
public:
    bool isPalindrome(string s) {
        string result;
        for(int i=0;i<s.length();i++){
            if((s[i]>='0'&&s[i]<='9')||
                (s[i]>='a'&&s[i]<='z')){
                result+=s[i];
            }else if(s[i]>='A'&&s[i]<='Z'){
                result+=s[i]+'a'-'A';
            }
        }
        cout<<result<<endl;
        int left=0;
        int right=result.length()-1;
        while(left<=right){
            if(result[left++]!=result[right--]) return false;
        }
        return true;
    }
};
```
## 136. 只出现一次的数字
**Description**
给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。
说明：
你的算法应该具有线性时间复杂度。 你可以不使用额外空间来实现吗？
**Example**
示例 1:
输入: [2,2,1]
输出: 1

示例 2:
输入: [4,1,2,1,2]
输出: 4
**Program**
```cpp
class Solution {
public:
    int singleNumber(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        for(int i=0;i<nums.size();i+=2){
            if(i+1<nums.size()&&nums[i]!=nums[i+1]){
                return nums[i];
            }
        }
        return nums[nums.size()-1];
    }
};
```
## 141. 环形链表
**Description**
给定一个链表，判断链表中是否有环。
为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。
**Example**
示例 1：
输入：head = [3,2,0,-4], pos = 1
输出：true
解释：链表中有一个环，其尾部连接到第二个节点。
![图示](/assets/img/algorithm/circularlinkedlist.png)
示例 2：
输入：head = [1,2], pos = 0
输出：true
解释：链表中有一个环，其尾部连接到第一个节点。
![图示](/assets/img/algorithm/circularlinkedlist_test2.png)
示例 3：
输入：head = [1], pos = -1
输出：false
解释：链表中没有环。
![图示](/assets/img/algorithm/circularlinkedlist_test3.png)
**Program**
```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    bool hasCycle(ListNode *head) {
        if(head==NULL||head->next==NULL) return false;
        ListNode* first=head->next->next;
        ListNode* second=head->next;
        while(first!=NULL&&first->next!=NULL&&second!=NULL){
            if(first==second) return true;
            first=first->next->next;
            second=second->next;
        }
        return false;
    }
};
```
## 155. 最小栈
**Description**
设计一个支持 push，pop，top 操作，并能在常数时间内检索到最小元素的栈。
push(x) -- 将元素 x 推入栈中。
pop() -- 删除栈顶的元素。
top() -- 获取栈顶元素。
getMin() -- 检索栈中的最小元素。
**Example**
示例:
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin();   --> 返回 -3.
minStack.pop();
minStack.top();      --> 返回 0.
minStack.getMin();   --> 返回 -2.
**Program**
```cpp
class MinStack {
public:
    /** initialize your data structure here. * /
    stack<int> st;
    stack<int> min_st;
    MinStack() {

    }

    void push(int x) {
        st.push(x);
        if(!min_st.empty()){
            if(x<=min_st.top()) min_st.push(x);
        }else min_st.push(x);
    }

    void pop() {
        if(st.top()==min_st.top()) min_st.pop();
        st.pop();
    }

    int top() {
        return st.top();
    }

    int getMin() {
        return min_st.top();
    }
};

/**
 * Your MinStack object will be instantiated and called as such:
 * MinStack* obj = new MinStack();
 * obj->push(x);
 * obj->pop();
 * int param_3 = obj->top();
 * int param_4 = obj->getMin();
 */
```
## 160. 相交链表
**Description**
编写一个程序，找到两个单链表相交的起始节点。
如下面的两个链表：
![图示](/assets/img/algorithm/160_statement.png)
在节点 c1 开始相交。
**Example**
示例 1：
![图示](/assets/img/algorithm/160_example_1.png)
输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,0,1,8,4,5], skipA = 2, skipB = 3
输出：Reference of the node with value = 8
输入解释：相交节点的值为 8 （注意，如果两个列表相交则不能为 0）。从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,0,1,8,4,5]。在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。
 
示例 2：
![图示](/assets/img/algorithm/160_example_2.png)
输入：intersectVal = 2, listA = [0,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
输出：Reference of the node with value = 2
输入解释：相交节点的值为 2 （注意，如果两个列表相交则不能为 0）。从各自的表头开始算起，链表 A 为 [0,9,1,2,4]，链表 B 为 [3,2,4]。在 A 中，相交节点前有 3 个节点；在 B 中，相交节点前有 1 个节点。
 
示例 3：
![图示](/assets/img/algorithm/160_example_3.png)
输入：intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
输出：null
输入解释：从各自的表头开始算起，链表 A 为 [2,6,4]，链表 B 为 [1,5]。由于这两个链表不相交，所以 intersectVal 必须为 0，而 skipA 和 skipB 可以是任意值。
解释：这两个链表不相交，因此返回 null。
```
注意:
如果两个链表没有交点，返回 null.
在返回结果后，两个链表仍须保持原有的结构。
可假定整个链表结构中没有循环。
程序尽量满足 O(n) 时间复杂度，且仅用 O(1) 内存。
```
**Program**
```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        if(headA==NULL||headB==NULL) return NULL;
        vector<ListNode*> vecA,vecB;
        while(headA!=NULL){
            vecA.push_back(headA);
            headA=headA->next;
        }
        while(headB!=NULL){
            vecB.push_back(headB);
            headB=headB->next;
        }
        reverse(vecA.begin(),vecA.end());
        reverse(vecB.begin(), vecB.end());
        ListNode* result=NULL;
        for(int i=0;i<vecA.size()&&i<vecB.size();i++){
            if(vecA[i]==vecB[i]) result=vecA[i];
            else break;
        }
        return result;
    }
};
```
```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        if(headA==NULL||headB==NULL) return NULL;
        ListNode *pA, *pB;
        pA=headA;
        pB=headB;
        ListNode *lastA=NULL, *lastB=NULL;
        while(pA!=pB){
            if(pA->next==NULL){
                lastA=pA;
                pA=headB;
            }else pA=pA->next;
            if(pB->next==NULL){
                lastB=pB;
                pB=headA;
            }else pB=pB->next;
            if(lastA!=NULL&&lastB!=NULL&&lastA!=lastB) return NULL;
        }
        return pA;
    }
};
```
## 167. 两数之和 II - 输入有序数组
**Destription**
给定一个已按照升序排列 的有序数组，找到两个数使得它们相加之和等于目标数。
函数应该返回这两个下标值 index1 和 index2，其中 index1 必须小于 index2。
说明:
返回的下标值（index1 和 index2）不是从零开始的。
你可以假设每个输入只对应唯一的答案，而且你不可以重复使用相同的元素。
**Example**
示例:
输入: numbers = [2, 7, 11, 15], target = 9
输出: [1,2]
解释: 2 与 7 之和等于目标数 9 。因此 index1 = 1, index2 = 2 。
**Program**
```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        map<int, int> m;
        for(int i=0;i<numbers.size();i++){
            m[numbers[i]] = i;
        }
        vector<int> vec;
        for(int i=0;i<numbers.size();i++){
            if(m.find(target-numbers[i])!=m.end()){
                if(numbers[i]!=target-numbers[i]||(numbers[i]==target-numbers[i]&&m[numbers[i]]!=i)){
                    vec.push_back(i+1);
                    vec.push_back(m[target-numbers[i]]+1);
                    break;
                }
            }
        }
        return vec;
    }
};
```
## 168. Excel表列名称
**Description**
给定一个正整数，返回它在 Excel 表中相对应的列名称。
例如，
```
    1 -> A
    2 -> B
    3 -> C
    ...
    26 -> Z
    27 -> AA
    28 -> AB
    ...
```
**Example**
示例 1:
输入: 1
输出: "A"

示例 2:
输入: 28
输出: "AB"

示例 3:
输入: 701
输出: "ZY"
**Program**
```cpp
class Solution {
public:
    string convertToTitle(int n) {
        string result;
        do{
            n--;
            result+='A'+n%26;
            n/=26;
        }while(n!=0);
        reverse(result.begin(), result.end());
        return result;
    }
};
```
## 169. 多数元素
**Description**
给定一个大小为 n 的数组，找到其中的多数元素。多数元素是指在数组中出现次数大于 ⌊ n/2 ⌋ 的元素。
你可以假设数组是非空的，并且给定的数组总是存在多数元素。
**Example**
示例 1:
输入: [3,2,3]
输出: 3

示例 2:
输入: [2,2,1,1,1,2,2]
输出: 2
**Program**
```cpp
class Solution {
public:
    int majorityElement(vector<int>& nums) {
        int result=nums[0];
        int ans=1;
        for(int i=1;i<nums.size();i++){
            if(result==nums[i]) ans++;
            else ans--;
            if(ans==0){
                result=nums[i];
                ans=1;
            }
        }
        return result;
    }
};
```
## 171. Excel表列序号
**Description**
给定一个Excel表格中的列名称，返回其相应的列序号。
例如，
```
    A -> 1
    B -> 2
    C -> 3
    ...
    Z -> 26
    AA -> 27
    AB -> 28
    ...
```
**Example**
示例 1:
输入: "A"
输出: 1

示例 2:
输入: "AB"
输出: 28

示例 3:
输入: "ZY"
输出: 701
**Program**
```cpp
class Solution {
public:
    int titleToNumber(string s) {
        long long result=0;
        for(int i=0;i<s.length();i++){
            result=result*26+s[i]-'A'+1;
        }
        return result;
    }
};
```
## 172. 阶乘后的零
**Description**
给定一个整数 n，返回 n! 结果尾数中零的数量。
**Example**
示例 1:
输入: 3
输出: 0
解释: 3! = 6, 尾数中没有零。

示例 2:
输入: 5
输出: 1
解释: 5! = 120, 尾数中有 1 个零.
**Program**
0的数量与10有关，10与因子2和5有关，2的个数一定比5多。
5出现次数为每5个出现一次，每25出现两次，每125出现三次....
```cpp
class Solution {
public:
    int trailingZeroes(int n) {
        int result=0;
        while(n!=0){
            result+=n/5;
            n/=5;
        }
        return result;
    }
};
```
## 189. 旋转数组
**Description**
给定一个数组，将数组中的元素向右移动 k 个位置，其中 k 是非负数。
**Example**
示例 1:
输入: [1,2,3,4,5,6,7] 和 k = 3
输出: [5,6,7,1,2,3,4]
解释:
向右旋转 1 步: [7,1,2,3,4,5,6]
向右旋转 2 步: [6,7,1,2,3,4,5]
向右旋转 3 步: [5,6,7,1,2,3,4]

示例 2:
输入: [-1,-100,3,99] 和 k = 2
输出: [3,99,-1,-100]
解释:
向右旋转 1 步: [99,-1,-100,3]
向右旋转 2 步: [3,99,-1,-100]
**Progam**
```cpp
class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        int n=nums.size();
        k%=n;
        reverse(nums, 0, n-k-1);
        reverse(nums,n-k, n-1);
        reverse(nums, 0, n-1);
    }
    void reverse(vector<int>& nums, int l, int r){
        while(l<r){
            swap(nums[l], nums[r]);
            l++;
            r--;
        }
    }
};
```
## 190. 颠倒二进制位
**Description**
颠倒给定的 32 位无符号整数的二进制位。
**Example**
示例 1：
输入: 00000010100101000001111010011100
输出: 00111001011110000010100101000000
解释: 输入的二进制串 00000010100101000001111010011100 表示无符号整数 43261596，
      因此返回 964176192，其二进制表示形式为 00111001011110000010100101000000。
示例 2：
输入：11111111111111111111111111111101
输出：10111111111111111111111111111111
解释：输入的二进制串 11111111111111111111111111111101 表示无符号整数 4294967293，
      因此返回 3221225471 其二进制表示形式为 10101111110010110010011101101001。
**Program**
```cpp
class Solution {
public:
    uint32_t reverseBits(uint32_t n) {
        uint32_t result=0;
        int i=0;
        while(i!=32){
            result=result*2+n%2;
            n/=2;
            i++;
        }
        return result;
    }
};
```
## 191. 位1的个数
**Description**
编写一个函数，输入是一个无符号整数，返回其二进制表达式中数字位数为 ‘1’ 的个数（也被称为汉明重量）。
**Example**
示例 1：
输入：00000000000000000000000000001011
输出：3
解释：输入的二进制串 00000000000000000000000000001011 中，共有三位为 '1'。

示例 2：
输入：00000000000000000000000010000000
输出：1
解释：输入的二进制串 00000000000000000000000010000000 中，共有一位为 '1'。

示例 3：
输入：11111111111111111111111111111101
输出：31
解释：输入的二进制串 11111111111111111111111111111101 中，共有 31 位为 '1'。
**Program**
```cpp
class Solution {
public:
    int hammingWeight(uint32_t n) {
        int ans=0;
        uint32_t one=1;
        for(int i=0;i<32;i++){
            ans+=((n%2)&one);
            n/=2;
        }
        return ans;
    }
};
```
计算末尾1的个数即可，$n&(n-1)$会将最后一位置0
```cpp
class Solution {
public:
    int hammingWeight(uint32_t n) {
        int ans=0;
        while(n!=0){
            n&=n-1;
            ans++;
        }
        return ans;
    }
};
```
## 198. 打家劫舍
**Description**
你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。
给定一个代表每个房屋存放金额的非负整数数组，计算你在不触动警报装置的情况下，能够偷窃到的最高金额。
**Example**
示例 1:
输入: [1,2,3,1]
输出: 4
解释: 偷窃 1 号房屋 (金额 = 1) ，然后偷窃 3 号房屋 (金额 = 3)。
     偷窃到的最高金额 = 1 + 3 = 4 。

示例 2:
输入: [2,7,9,3,1]
输出: 12
解释: 偷窃 1 号房屋 (金额 = 2), 偷窃 3 号房屋 (金额 = 9)，接着偷窃 5 号房屋 (金额 = 1)。
     偷窃到的最高金额 = 2 + 9 + 1 = 12 。
**Program**
```cpp
class Solution {
public:
    int rob(vector<int>& nums) {
        vector<int> DP;
        DP.resize(nums.size());
        for(int i=0;i<nums.size();i++) DP[i]=nums[i];

        for(int i=2;i<nums.size();i++){
            if(i-3<0){
                DP[i]+=DP[i-2];
            }else{
                DP[i] += max(DP[i-2], DP[i-3]);
            }
        }

        int maxN=0;
        for(int i=0;i<nums.size();i++){
            if(maxN<DP[i]) maxN=DP[i];
        }
        return maxN;
    }
};
```
## 202. 快乐数
**Description**
编写一个算法来判断一个数是不是“快乐数”。
一个“快乐数”定义为：对于一个正整数，每一次将该数替换为它每个位置上的数字的平方和，然后重复这个过程直到这个数变为 1，也可能是无限循环但始终变不到 1。如果可以变为 1，那么这个数就是快乐数。
**Example**
示例: 
输入: 19
输出: true
解释:
12 + 92 = 82
82 + 22 = 68
62 + 82 = 100
12 + 02 + 02 = 1
**Program**
```cpp
class Solution {
public:
    int calSum(int x){
        int sum=0;
        while(x!=0){
            int bit =x%10;
            sum+=bit*bit;
            x/=10;
        }
        return sum;
    }
    bool isHappy(int n) {
        int low=n, fast=n;
        do{
            low=calSum(low);
            fast=calSum(fast);
            fast=calSum(fast);
        }while(fast!=low);
        return low == 1;
    }
};
```
## 203. 移除链表元素
**Description**
删除链表中等于给定值 val 的所有节点。
**Example**
示例:
输入: 1->2->6->3->4->5->6, val = 6
输出: 1->2->3->4->5
**Program**
```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode* removeElements(ListNode* head, int val) {
        ListNode* node=new ListNode(-1);
        node->next=head;
        ListNode* pre=node;
        while(head!=NULL){
            if(head->val==val){
                pre->next=head->next;
            }else{
                pre=head;
            }
            head=head->next;
        }
        return node->next;
    }
};
```
## 204. 计数质数
**Description**
统计所有小于非负整数 n 的质数的数量。
**Example**
示例:
输入: 10
输出: 4
解释: 小于 10 的质数一共有 4 个, 它们是 2, 3, 5, 7 。
**Program**
```cpp
class Solution {
public:
    int countPrimes(int n) {
        int count=0;
        vector<int> prime;
        vector<bool> bMarked;
        bMarked.resize(n);
        prime.resize(n);
        fill(bMarked.begin(), bMarked.end(), false);
        for(int i=2;i<n;i++){
            if(!bMarked[i]){
                bMarked[i]=true;
                prime[count++]=i;
            }
            for(int j=0;j<count&&i*prime[j]<n;j++){
                bMarked[i*prime[j]]=true;
                if(i%prime[j]==0) break;
            }
        }
        return count;
    }
};
```
## 205. 同构字符串
**Description**
给定两个字符串 s 和 t，判断它们是否是同构的。
如果 s 中的字符可以被替换得到 t ，那么这两个字符串是同构的。
所有出现的字符都必须用另一个字符替换，同时保留字符的顺序。两个字符不能映射到同一个字符上，但字符可以映射自己本身。
**Example**
示例 1:
输入: s = "egg", t = "add"
输出: true

示例 2:
输入: s = "foo", t = "bar"
输出: false

示例 3:
输入: s = "paper", t = "title"
输出: true
**Program**
1.Hash
```cpp
class Solution {
public:
    bool isIsomorphic(string s, string t) {
        if(s.length()!=t.length()) return false;
        vector<int> vec1, vec2;
        vec1.resize(s.length());
        vec2.resize(s.length());
        fill(vec1.begin(), vec1.end(), 0);
        fill(vec2.begin(), vec2.end(), 0);
        map<char, int> m1, m2;
        int idx=0;
        for(int i=0;i<s.length();i++){
            if(m1.find(s[i])==m1.end()){
                m1[s[i]]=idx;
                vec1[i]=idx++;
            }else{
                vec1[i]=m1[s[i]];
            }
        }
        idx=0;
        for(int i=0;i<t.length();i++){
            if(m2.find(t[i])==m2.end()){
                m2[t[i]]=idx;
                vec2[i]=idx++;
            }else{
                vec2[i]=m2[t[i]];
            }
        }
        for(int i=0;i<s.length();i++){
            if(vec1[i]!=vec2[i]) return false;
        }
        return true;
    }
};
```
2.比较字母首次出现位置
```cpp
class Solution {
public:
    bool isIsomorphic(string s, string t) {
        if(s.length()!=t.length()) return false;
        for(int i=0;i<s.length();i++){
            if(s.find(s[i])!=t.find(t[i])) return false;
        }
        return true;
    }
};
```
## 206. 反转链表
**Description**
反转一个单链表。
**Example**
示例:
输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL
**Program**
```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* pre, *p, *tmp;
        pre=NULL;
        p=head;
        while(head!=NULL){
            tmp=head->next;
            head->next=pre;
            pre=head;
            head=tmp;
        }
        return pre;
    }
};
```
## 217. 存在重复元素
**Description**
给定一个整数数组，判断是否存在重复元素。
如果任何值在数组中出现至少两次，函数返回 true。如果数组中每个元素都不相同，则返回 false。
**Example**
示例 1:
输入: [1,2,3,1]
输出: true

示例 2:
输入: [1,2,3,4]
输出: false

示例 3:
输入: [1,1,1,3,3,4,3,2,4,2]
输出: true
**Program**
```cpp
class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        map<int, int> m;
        for(int i=0;i<nums.size();i++){
            if(m.find(nums[i])==m.end()){
                m[nums[i]] = 1;
            }else{
                m[nums[i]]++;
            }
        }
        for(map<int, int>::iterator it=m.begin();it!=m.end();it++){
            if(it->second>=2) return true;
        }
        return false;
    }
};
```
## 219. 存在重复元素 II
**Description**
给定一个整数数组和一个整数 k，判断数组中是否存在两个不同的索引 i 和 j，使得 nums [i] = nums [j]，并且 i 和 j 的差的绝对值最大为 k。
**Example**
示例 1:
输入: nums = [1,2,3,1], k = 3
输出: true

示例 2:
输入: nums = [1,0,1,1], k = 1
输出: true

示例 3:
输入: nums = [1,2,3,1,2,3], k = 2
输出: false
**Progam**
```cpp
class Solution {
public:
    bool containsNearbyDuplicate(vector<int>& nums, int k) {
        map<int, vector<int>> m;
        for(int i=0;i<nums.size();i++){
            if(m.find(nums[i])==m.end()){
                vector<int> vec;
                m[nums[i]]=vec;
                m[nums[i]].push_back(i);
            }else {
                for(int j=0;j<m[nums[i]].size();j++){
                    if(i-m[nums[i]][j]<=k) return true;
                }
                m[nums[i]].push_back(i);
            }
        }
        return false;
    }
};
```
```cpp
class Solution {
public:
    bool containsNearbyDuplicate(vector<int>& nums, int k) {
        map<int, int> m;
        for(int i=0;i<nums.size();i++){
            if(m.find(nums[i])==m.end()){
                m[nums[i]]=i;
            }else if(i-m[nums[i]]<=k) return true;
            else m[nums[i]]=i;
        }
        return false;
    }
};
```
## 225. 用队列实现栈
**Description**
使用队列实现栈的下列操作：
push(x) -- 元素 x 入栈
pop() -- 移除栈顶元素
top() -- 获取栈顶元素
empty() -- 返回栈是否为空
注意:
你只能使用队列的基本操作-- 也就是 push to back, peek/pop from front, size, 和 is empty 这些操作是合法的。
你所使用的语言也许不支持队列。 你可以使用 list 或者 deque（双端队列）来模拟一个队列 , 只要是标准的队列操作即可。
你可以假设所有操作都是有效的（例如, 对一个空的栈不会调用 pop 或者 top 操作）。
**Program**
```cpp
class MyStack {
public:
    queue<int> q;
    /** Initialize your data structure here. */
    MyStack() {
    }

    /** Push element x onto stack. */
    void push(int x) {
        q.push(x);
        int sz=q.size();
        while(sz>1){
            q.push(q.front());
            q.pop();
            sz--;
        }
    }

    /** Removes the element on top of the stack and returns that element. */
    int pop() {
        if(q.empty()) return -1;
        int front = q.front();
        q.pop();
        return front;
    }

    /** Get the top element. */
    int top() {
        if(q.empty()) return -1;
        return q.front();
    }

    /** Returns whether the stack is empty. */
    bool empty() {
        return q.empty();
    }
};

/**
 * Your MyStack object will be instantiated and called as such:
 * MyStack* obj = new MyStack();
 * obj->push(x);
 * int param_2 = obj->pop();
 * int param_3 = obj->top();
 * bool param_4 = obj->empty();
 */
```
## 226. 翻转二叉树
**Description**
翻转一棵二叉树。
**Example**
示例：
输入：

     4
   /   \
  2     7
 / \   / \
1   3 6   9
输出：

     4
   /   \
  7     2
 / \   / \
9   6 3   1
**Program**
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if(root==NULL) return root;
        TreeNode* tmp=root->left;
        root->left=root->right;
        root->right=tmp;
        invertTree(root->left);
        invertTree(root->right);
        return root;
    }
};
```
## 231. 2的幂
**Description**
给定一个整数，编写一个函数来判断它是否是 2 的幂次方。
**Example**
示例 1:
输入: 1
输出: true
解释: 20 = 1

示例 2:
输入: 16
输出: true
解释: 24 = 16

示例 3:
输入: 218
输出: false
**Program**
```cpp
class Solution {
public:
    bool isPowerOfTwo(int n) {
        long long tmp=1;
        while(tmp<=n){
            if(tmp==n) return true;
            tmp*=2;
        }
        return false;
    }
};
```
## 207. 课程表
**Description**
现在你总共有 n 门课需要选，记为 0 到 n-1。
在选修某些课程之前需要一些先修课程。 例如，想要学习课程 0 ，你需要先完成课程 1 ，我们用一个匹配来表示他们: [0,1]
给定课程总量以及它们的先决条件，判断是否可能完成所有课程的学习？
**Example**
示例 1:
输入: 2, [[1,0]]
输出: true
解释: 总共有 2 门课程。学习课程 1 之前，你需要完成课程 0。所以这是可能的。

示例 2:
输入: 2, [[1,0],[0,1]]
输出: false
解释: 总共有 2 门课程。学习课程 1 之前，你需要先完成​课程 0；并且学习课程 0 之前，你还应先完成课程 1。这是不可能的。

**说明:**
输入的先决条件是由边缘列表表示的图形，而不是邻接矩阵。详情请参见图的表示法。
你可以假定输入的先决条件中没有重复的边。
**Program**
```cpp
class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> Adj;
        Adj.resize(numCourses);
        vector<int> inDegree;
        inDegree.resize(numCourses);
        fill(inDegree.begin(), inDegree.end(), 0);
        for(int i=0;i<prerequisites.size();i++){
            int v=prerequisites[i][0];
            int u=prerequisites[i][1];
            inDegree[v]++;
            Adj[u].push_back(v);
        }
        queue<int> q;
        for(int i=0;i<numCourses;i++){
            if(inDegree[i]==0) q.push(i);
        }
        int num=0;
        while(!q.empty()){
            int u=q.front();
            q.pop();
            for(int i=0;i<Adj[u].size();i++){
                int v=Adj[u][i];
                inDegree[v]--;
                if(inDegree[v]==0) q.push(v);
            }
            num++;
        }
        if(num!=numCourses) return false;
        return true;
    }
};
```
## 210. 课程表 II
**Description**
现在你总共有 n 门课需要选，记为 0 到 n-1。
在选修某些课程之前需要一些先修课程。 例如，想要学习课程 0 ，你需要先完成课程 1 ，我们用一个匹配来表示他们: [0,1]
给定课程总量以及它们的先决条件，返回你为了学完所有课程所安排的学习顺序。
可能会有多个正确的顺序，你只要返回一种就可以了。如果不可能完成所有课程，返回一个空数组。
**Example**
示例 1:
输入: 2, [[1,0]]
输出: [0,1]
解释: 总共有 2 门课程。要学习课程 1，你需要先完成课程 0。因此，正确的课程顺序为 [0,1] 。

示例 2:
输入: 4, [[1,0],[2,0],[3,1],[3,2]]
输出: [0,1,2,3] or [0,2,1,3]
解释: 总共有 4 门课程。要学习课程 3，你应该先完成课程 1 和课程 2。并且课程 1 和课程 2 都应该排在课程 0 之后。
     因此，一个正确的课程顺序是 [0,1,2,3] 。另一个正确的排序是 [0,2,1,3] 。
**Program**
```cpp
class Solution {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> Adj;
        Adj.resize(numCourses);
        vector<int> inDegree;
        inDegree.resize(numCourses);
        fill(inDegree.begin(), inDegree.end(), 0);
        for(int i=0;i<prerequisites.size();i++){
            int v=prerequisites[i][0];
            int u=prerequisites[i][1];
            inDegree[v]++;
            Adj[u].push_back(v);
        }
        queue<int> q;
        vector<int> result;
        int num=0;
        for(int i=0;i<numCourses;i++){
            if(inDegree[i]==0) q.push(i);
        }
        while(!q.empty()){
            int u=q.front();
            q.pop();
            result.push_back(u);
            for(int i=0;i<Adj[u].size();i++){
                int v=Adj[u][i];
                inDegree[v]--;
                if(inDegree[v]==0) q.push(v);
            }
            num++;
        }
        if(num!=numCourses) return {};
        return result;
    }
};
```
## 130. 被围绕的区域
**Description**
给定一个二维的矩阵，包含 'X' 和 'O'（字母 O）。
找到所有被 'X' 围绕的区域，并将这些区域里所有的 'O' 用 'X' 填充。
**Example**
示例:
X X X X
X O O X
X X O X
X O X X
运行你的函数后，矩阵变为：
X X X X
X X X X
X X X X
X O X X
**Program**
```cpp
class Solution {
public:
    vector<int> father;
    int step[4][2]={
        -1, 0,
        1, 0,
        0, -1,
        0, 1
    };
    int findFather(int x){
        if(x!=father[x]){
            father[x]=findFather(father[x]);
        }
        return father[x];
    }
    void unionSet(int x, int y){
        int fa=findFather(x);
        int fb=findFather(y);
        if(fa!=fb){
            father[fa]=fb;
        }
    }
    int index(int i, int j, int cols){
        return i*cols + j;
    }
    void solve(vector<vector<char>>& board) {
        if(board.size()==0)return;
        int rows=board.size();
        int cols=board[0].size();
        int nCount=rows*cols;
        father.resize(nCount+1);
        for(int i=0;i<nCount+1;i++) father[i]=i;
        for(int i=0;i<rows;i++){
            for(int j=0;j<cols;j++){
                if(board[i][j]=='O'){
                    if(i==0||i==rows-1||j==0||j==cols-1){
                        unionSet(index(i, j, cols), nCount);
                    }else{
                        for(int k=0;k<4;k++){
                            int x=i+step[k][0];
                            int y=j+step[k][1];
                            if(x>=0&&x<rows&&y>=0&&y<cols&&board[x][y]=='O') unionSet(index(i, j, cols), index(x, y, cols));
                        }
                    }
                }
            }
        }
        for(int i=0;i<rows;i++){
            for(int j=0;j<cols;j++){
                if(board[i][j]=='O'){
                    int fa=findFather(index(i, j, cols));
                    int fb=findFather(nCount);
                    if(fa!=fb){
                        board[i][j]='X';
                    }
                }
            }
        }
    }
};
```
## 200. 岛屿数量
**Description**
给定一个由 '1'（陆地）和 '0'（水）组成的的二维网格，计算岛屿的数量。一个岛被水包围，并且它是通过水平方向或垂直方向上相邻的陆地连接而成的。你可以假设网格的四个边均被水包围。
**Example**
示例 1:
输入:
11110
11010
11000
00000
输出: 1

示例 2:
输入:
11000
11000
00100
00011
输出: 3
**Program**
```cpp
class Solution {
public:
    vector<int> father;
    int rows, cols;
    int nCount;
    int step[4][2]={
        -1,  0,
         1,  0,
         0, -1,
         0,  1
    };
    int toIndex(int i, int j){
        return i*cols+j;
    }
    int findFather(int x){
        if(x!=father[x]){
            father[x]=findFather(father[x]);
        }
        return father[x];
    }
    void unionSet(int x, int y){
        int fa=findFather(x);
        int fb=findFather(y);
        if(fa!=fb){
            father[fa]=fb;
        }
    }
    int numIslands(vector<vector<char>>& grid) {
        if(grid.size()==0) return 0;
        rows=grid.size();
        cols=grid[0].size();
        nCount=rows*cols;
        father.resize(nCount);
        for(int i=0;i<nCount;i++) father[i]=i;
        for(int i=0;i<rows;i++){
            for(int j=0;j<cols;j++){
                if(grid[i][j]=='1'){
                    int idx1=toIndex(i, j);
                    for(int k=0;k<4;k++){
                        int x=i+step[k][0];
                        int y=j+step[k][1];
                        int idx2=toIndex(x, y);
                        if(x>=0&&x<rows&&y>=0&&y<cols&&grid[x][y]=='1') unionSet(idx1, idx2);
                    }
                }
            }
        }
        set<int> s;
        for(int i=0;i<rows;i++){
            for(int j=0;j<cols;j++){
                if(grid[i][j]=='1'){
                    s.insert(findFather(toIndex(i, j)));
                }
            }
        }
        return s.size();
    }
};
```
## 399. 除法求值
**Description**
给出方程式 $A / B = k$, 其中 $A$ 和 $B$ 均为代表字符串的变量， $k$ 是一个浮点型数字。根据已知方程式求解问题，并返回计算结果。如果结果不存在，则返回 -1.0。
**Example**
示例 :
```
给定 a / b = 2.0, b / c = 3.0
问题: a / c = ?, b / a = ?, a / e = ?, a / a = ?, x / x = ? 
返回 [6.0, 0.5, -1.0, 1.0, -1.0 ]
```
```
输入为: vector<pair<string, string>> equations, vector<double>& values, vector<pair<string, string>> queries(方程式，方程式结果，问题方程式)， 其中 equations.size() == values.size()，即方程式的长度与方程式结果长度相等（程式与结果一一对应），并且结果值均为正数。以上为方程式的描述。 返回vector<double>类型。
```
基于上述例子，输入如下：
equations(方程式) = [ ["a", "b"], ["b", "c"] ],
values(方程式结果) = [2.0, 3.0],
queries(问题方程式) = [ ["a", "c"], ["b", "a"], ["a", "e"], ["a", "a"], ["x", "x"] ].
输入总是有效的。你可以假设除法运算中不会出现除数为0的情况，且不存在任何矛盾的结果。
**Program**
- father 记录的是每个节点的父节点是谁。
- val 记录的是每个节点到其**父节点**的权值
```cpp
class Solution {
public:
    map<string, int> sToi;
    map<int, string> iTos;
    vector<int> father;
    vector<double> val;
    int nCount=0;
    void convert(string str){
        if(sToi.find(str)==sToi.end()){
            sToi[str]=nCount;
            iTos[nCount++]=str;
        }
        // return nCount++:
    }
    int findFather(int x){
        if(x!=father[x]){
            int fa=findFather(father[x]);
            val[x]=val[x]*val[father[x]];
            father[x]=fa;
        }
        return father[x];
    }
    void merge(int x, int y, double v){
        int fa=findFather(x);
        int fb=findFather(y);
        if(fa!=fb){
            father[fa]=fb;
            val[fa]=v*val[y]/val[x];
        }
    }
    double getResult(string s1, string s2){
        if(sToi.find(s1)==sToi.end()||sToi.find(s2)==sToi.end()) return -1.0;
        int a=sToi[s1];
        int b=sToi[s2];
        int fa=findFather(a);
        int fb=findFather(b);
        if(fa!=fb) return -1.0;
        return val[a]/val[b];
    }
    vector<double> calcEquation(vector<vector<string>>& equations, vector<double>& values, vector<vector<string>>& queries) {
        for(int i=0;i<equations.size();i++){
            convert(equations[i][0]);
            convert(equations[i][1]);
        }
        father.resize(nCount);
        val.resize(nCount);
        for(int i=0;i<nCount;i++){
            father[i]=i;
            val[i]=1;
        }
        for(int i=0;i<equations.size();i++){
            merge(sToi[equations[i][0]], sToi[equations[i][1]], values[i]);
        }
        vector<double> result;
        for(int i=0;i<queries.size();i++){
            result.push_back(getResult(queries[i][0], queries[i][1]));
        }
        return result;
    }
};
```
## 547. 朋友圈
**Description**
班上有 N 名学生。其中有些人是朋友，有些则不是。他们的友谊具有是传递性。如果已知 A 是 B 的朋友，B 是 C 的朋友，那么我们可以认为 A 也是 C 的朋友。所谓的朋友圈，是指所有朋友的集合。

给定一个 N * N 的矩阵 M，表示班级中学生之间的朋友关系。如果M[i][j] = 1，表示已知第 i 个和 j 个学生互为朋友关系，否则为不知道。你必须输出所有学生中的已知的朋友圈总数。
**Example**
示例 1:
输入:
[[1,1,0],
 [1,1,0],
 [0,0,1]]
输出: 2
说明：已知学生0和学生1互为朋友，他们在一个朋友圈。
第2个学生自己在一个朋友圈。所以返回2。

示例 2:
输入:
[[1,1,0],
 [1,1,1],
 [0,1,1]]
输出: 1
说明：已知学生0和学生1互为朋友，学生1和学生2互为朋友，所以学生0和学生2也是朋友，所以他们三个在一个朋友圈，返回1。
注意：
N 在[1,200]的范围内。
对于所有学生，有M[i][i] = 1。
如果有M[i][j] = 1，则有M[j][i] = 1。
**Program**
```cpp
class Solution {
public:
    vector<int> father;
    int nCount;
    int rows, cols;
    int findFather(int x){
        if(x!=father[x]){
            father[x]=findFather(father[x]);
        }
        return father[x];
    }
    void unionSet(int x, int y){
        int fa=findFather(x);
        int fb=findFather(y);
        if(fa!=fb){
            father[fa]=fb;
        }
    }
    int findCircleNum(vector<vector<int>>& M) {
        if(M.size()==0) return 0;
        int nCount=rows=M.size();
        int cols=M[0].size();
        father.resize(nCount);
        for(int i=0;i<nCount;i++) father[i]=i;
        for(int i=0;i<rows;i++){
            for(int j=0;j<i;j++){
                if(M[i][j]==1) unionSet(i, j);
            }
        }
        set<int> s;
        for(int i=0;i<nCount;i++){
            s.insert(findFather(i));
        }
        return s.size();
    }
};
```
## 684. 冗余连接
**Description**
在本问题中, 树指的是一个连通且无环的无向图。
输入一个图，该图由一个有着N个节点 (节点值不重复1, 2, ..., N) 的树及一条附加的边构成。附加的边的两个顶点包含在1到N中间，这条附加的边不属于树中已存在的边。
结果图是一个以边组成的二维数组。每一个边的元素是一对[u, v] ，满足 u < v，表示连接顶点u 和v的无向图的边。
返回一条可以删去的边，使得结果图是一个有着N个节点的树。如果有多个答案，则返回二维数组中最后出现的边。答案边 [u, v] 应满足相同的格式 u < v。
**Example**
示例 1：
输入: [[1,2], [1,3], [2,3]]
输出: [2,3]
解释: 给定的无向图为:
```
  1
 / \
2 - 3
```
示例 2：
输入: [[1,2], [2,3], [3,4], [1,4], [1,5]]
输出: [1,4]
解释: 给定的无向图为:
```
5 - 1 - 2
    |   |
    4 - 3
```
注意:
输入的二维数组大小在 3 到 1000。
二维数组中的整数在1到N之间，其中N是输入数组的大小。
**Program**
```cpp
class Solution {
public:
    vector<int> father;
    int nCount;
    set<int>s;
    int findFather(int x){
        if(x!=father[x]){
            father[x]=findFather(father[x]);
        }
        return father[x];
    }
    bool unionSet(int x ,int y){
        int fa=findFather(x);
        int fb=findFather(y);
        if(fa!=fb){
            father[fa]=fb;
            return false;
        }
        return true;
    }
    vector<int> findRedundantConnection(vector<vector<int>>& edges) {
        for(int i=0;i<edges.size();i++){
            if(s.find(edges[i][0])==s.end()) nCount++;
            if(s.find(edges[i][1])==s.end()) nCount++;
        }
        father.resize(nCount+1);
        for(int i=0;i<nCount;i++) father[i]=i;
        vector<int> result;
        for(int i=0;i<edges.size();i++){
            if(unionSet(edges[i][0], edges[i][1])){
                result.push_back(edges[i][0]);
                result.push_back(edges[i][1]);
                break;
            }
        }
        return result;
    }
};
```
## 307. 区域和检索 - 数组可修改
**Description**
给定一个整数数组  nums，求出数组从索引 i 到 j  (i ≤ j) 范围内元素的总和，包含 i,  j 两点。
update(i, val) 函数可以通过将下标为 i 的数值更新为 val，从而对数列进行修改。
**Example**
示例:
Given nums = [1, 3, 5]
sumRange(0, 2) -> 9
update(1, 2)
sumRange(0, 2) -> 8
说明:
数组仅可以在 update 函数下进行修改。
你可以假设 update 函数与 sumRange 函数的调用次数是均匀分布的。
**Program**
```cpp
class NumArray {
public:
    vector<int> C;
    int nCount;
    vector<int> nums;
    int lowbit(int x){
        return x&(-x);
    }

    NumArray(vector<int>& nums) {
        this->nCount=nums.size();
        this->C.resize(nCount+1);
        this->nums.resize(nCount);

        fill(this->C.begin(), this->C.end(), 0);
        fill(this->nums.begin(), this->nums.end(), 0);

        for(int i=0;i<this->nCount;i++){
            update(i, nums[i]);
        }
    }

    void update(int i, int val) {
        int tmp=val;
        val=val-this->nums[i];
        this->nums[i]=tmp;
        i++;
        for(int x=i;x<=nCount;x+=lowbit(x)){
            C[x]+=val;
        }
    }
    int getSum(int x){
        int sum=0;
        for(int i=x;i>0;i-=lowbit(i)){
            sum+=C[i];
        }
        return sum;
    }
    int sumRange(int i, int j) {
        j++;
        return getSum(j)-getSum(i);
    }
};

/**
 * Your NumArray object will be instantiated and called as such:
 * NumArray* obj = new NumArray(nums);
 * obj->update(i,val);
 * int param_2 = obj->sumRange(i,j);
 */
```
## 315. 计算右侧小于当前元素的个数
**Description**
给定一个整数数组 nums，按要求返回一个新数组 counts。数组 counts 有该性质： counts[i] 的值是  nums[i] 右侧小于 nums[i] 的元素的数量。
**Example**
示例:
输入: [5,2,6,1]
输出: [2,1,1,0]
解释:
5 的右侧有 2 个更小的元素 (2 和 1).
2 的右侧仅有 1 个更小的元素 (1).
6 的右侧有 1 个更小的元素 (1).
1 的右侧有 0 个更小的元素.
**Prgoram**
```cpp
class Solution {
public:
    vector<int> C, A;
    int nCount;
    struct Node{
        int val;
        int idx;
        Node(){}
        Node(int v, int i):val(v), idx(i){}
        bool operator < (const Node &tmp) const{
            return val<tmp.val;
        }
    };
    vector<Node> vec;
    int lowbit(int x){
        return x&(-x);
    }
    int getSum(int x){
        int sum=0;
        for(int i=x;i>0;i-=lowbit(i)){
            sum+=C[i];
        }
        return sum;
    }
    void update(int x, int val){
        for(int i=x;i<=nCount;i+=lowbit(i)){
            C[i]+=val;
        }
    }
    vector<int> countSmaller(vector<int>& nums) {
        if(nums.size()==0) return {};
        nCount=nums.size();
        C.resize(nCount+1);
        A.resize(nCount);
        fill(C.begin(), C.end(), 0);
        reverse(nums.begin(), nums.end());
        for(int i=0;i<nCount;i++){
            vec.push_back(Node(nums[i], i));
        }
        //离散化
        sort(vec.begin(), vec.end());
        for(int i=0;i<nCount;i++){
            if(i==0||vec[i-1].val!=vec[i].val){
                A[vec[i].idx]=i+1;
            }else{
                A[vec[i].idx]=A[vec[i-1].idx];
            }
        }
        vector<int> result;
        for(int i=0;i<nCount;i++){
            update(A[i], 1);
            result.push_back(getSum(A[i]-1));
        }
        reverse(result.begin(),result.end());
        return result;
    }
};
```
## 98. 验证二叉搜索树
**Description**
给定一个二叉树，判断其是否是一个有效的二叉搜索树。

假设一个二叉搜索树具有如下特征：

节点的左子树只包含小于当前节点的数。
节点的右子树只包含大于当前节点的数。
所有左子树和右子树自身必须也是二叉搜索树。
**Example**
示例 1:
输入:
    2
   / \
  1   3
输出: true

示例 2:
输入:
    5
   / \
  1   4
     / \
    3   6
输出: false
解释: 输入为: [5,1,4,null,null,3,6]。
     根节点的值为 5 ，但是其右子节点值为 4 。
**Program**
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    vector<int> vec;
    bool isValidBST(TreeNode* root) {
        if(root==NULL) return true;
        DFS(root);
        for(int i=1;i<vec.size();i++){
            if(vec[i-1]>=vec[i]) return false;
        }
        return true;
    }
    void DFS(TreeNode* root){
        if(root==NULL) return;
        DFS(root->left);
        vec.push_back(root->val);
        DFS(root->right);
    }
};
```
## 105. 从前序与中序遍历序列构造二叉树
**Description**
根据一棵树的前序遍历与中序遍历构造二叉树。
注意:
你可以假设树中没有重复的元素。
**Example**
例如，给出
前序遍历 preorder = [3,9,20,15,7]
中序遍历 inorder = [9,3,15,20,7]
返回如下的二叉树：
```
    3
   / \
  9  20
    /  \
   15   7
```
**Program**
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        return create(preorder, inorder, 0, preorder.size()-1, 0, inorder.size()-1);
    }
    TreeNode* create(vector<int>& preOrder, vector<int>& inOrder, int pL,int pR, int iL,int iR){
        if(pL>pR||iL>iR) return NULL;
        TreeNode* root=new TreeNode(preOrder[pL]);
        int pos=0;
        for(int i=iL;i<=iR;i++){
            if(inOrder[i]==preOrder[pL]){
                pos=i;
                break;
            }
        }
        int numLeft=pos-iL;
        root->left=create(preOrder, inOrder, pL+1,pL+numLeft, iL, pos-1);
        root->right=create(preOrder, inOrder, pL+numLeft+1, pR, pos+1, iR);
        return root;
    }
};
```
## 106. 从中序与后序遍历序列构造二叉树
**Description**
根据一棵树的中序遍历与后序遍历构造二叉树。

注意:
你可以假设树中没有重复的元素。
**Example**
例如，给出
中序遍历 inorder = [9,3,15,20,7]
后序遍历 postorder = [9,15,7,20,3]
返回如下的二叉树：
```
    3
   / \
  9  20
    /  \
   15   7
```
**Program**
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {
        return create(inorder, postorder, 0, inorder.size()-1, 0, postorder.size()-1);
    }
    TreeNode* create(vector<int>& inOrder, vector<int>& postOrder, int iL,int iR, int pL,int pR){
        if(iL>iR||pL>pR) return NULL;
        TreeNode* root=new TreeNode(postOrder[pR]);
        int pos=0;
        for(int i=iL;i<=iR;i++){
            if(inOrder[i]==postOrder[pR]){
                pos=i;
                break;
            }
        }
        int numLeft=pos-iL;
        root->left=create(inOrder, postOrder, iL, pos-1, pL, pL+numLeft-1);
        root->right=create(inOrder, postOrder, pos+1, iR, pL+numLeft, pR-1);
        return root;
    }
};
```
## 109. 有序链表转换二叉搜索树
**Description**
给定一个单链表，其中的元素按升序排序，将其转换为高度平衡的二叉搜索树。
本题中，一个高度平衡二叉树是指一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过 1。
**Example**
示例:
给定的有序链表： [-10, -3, 0, 5, 9],
一个可能的答案是：[0, -3, 9, -10, null, 5], 它可以表示下面这个高度平衡二叉搜索树：
```
      0
     / \
   -3   9
   /   /
 -10  5
```
**Program**
```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    vector<int> vec;
    TreeNode* sortedListToBST(ListNode* head) {
        if(head==NULL) return NULL;
        while(head!=NULL){
            vec.push_back(head->val);
            head=head->next;
        }
        return create(0, vec.size()-1);
    }
    TreeNode* create(int l, int r){
        if(l>r) return NULL;
        int mid=(l+r+1)/2;
        TreeNode* root= new TreeNode(vec[mid]);
        root->left=create(l, mid-1);
        root->right=create(mid+1, r);
        return root;
    }
};
```
## 113. 路径总和 II
**Description**
给定一个二叉树和一个目标和，找到所有从根节点到叶子节点路径总和等于给定目标和的路径。
说明: 叶子节点是指没有子节点的节点。
**Example**
示例:
给定如下二叉树，以及目标和 sum = 22，
```
              5
             / \
            4   8
           /   / \
          11  13  4
         /  \    / \
        7    2  5   1
```
返回:
```
[
   [5,4,11,2],
   [5,8,4,5]
]
```
**Program**
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    vector<vector<int>> result;
    int total;
    vector<vector<int>> pathSum(TreeNode* root, int sum) {
        if(root==NULL) return result;
        total=sum;
        vector<int> vec;
        sum=0;
        findPath(root, vec, sum);
        return result;
    }
    void findPath(TreeNode* root, vector<int> vec, int sum){
        sum+=root->val;
        vec.push_back(root->val);
        if(root->left==NULL&&root->right==NULL&&sum==total){
            result.push_back(vec);
            return;
        }
        if(root->left!=NULL) findPath(root->left, vec, sum);
        if(root->right!=NULL) findPath(root->right, vec, sum);
        vec.pop_back();
    }
};
```
