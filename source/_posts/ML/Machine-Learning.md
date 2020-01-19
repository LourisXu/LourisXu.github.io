---
title: Machine Learning
tags:
  - ML
toc: true
translate_title: machinelearning
date: 2019-10-25 16:28:36
---
> # 分类

## k-近邻算法（KNN）

|k-近邻算法||
|:--:|:--|
|优点|精度高、对异常值不敏感，无数据输入假定。|
|缺点|计算复杂度高、空间复杂度高|
|适用数据范围|数值型和标称型

### 原理
1.假设有一个带有标签的样本数据集（训练样本集），其中包含每条数据与所属分类的对应关系。
2.输入没有标签的新数据后，将新数据的每个特征与样本集中数据对应的特征进行比较。
　I.  计算新数据与样本数据集中每条数据的距离。
　II. 对求得的所有距离进行排序（从小到大，越小表示越相似）。
　III.取前 k （k 一般小于等于 20 ）个样本数据对应的分类标签。
3.求 k 个数据中出现次数最多的分类标签作为新数据的分类
### 模型
```Python
from numpy import *
import operator


def createDataSet():
    group = array([[1.0, 1.1], [1.0, 1.0], [0, 0], [0, 0.1]])
    labels = ['A', 'A', 'B', 'B']
    return group, labels


def classify0(inX, dataSet, labels, k):
    # Calculate the distances
    dataSetSize = dataSet.shape[0]
    diffMat = tile(inX, (dataSetSize, 1)) - dataSet
    sqDiffMat = diffMat ** 2
    print(sqDiffMat.shape)
    sqDistances = sqDiffMat.sum(axis=1)
    print(sqDistances)
    distances = sqDistances ** 0.5
    # Sort the indicies
    sortedDistIndicies = distances.argsort()
    print(sortedDistIndicies)
    # Select the k points
    classCount = {}
    for i in range(k):
        voteIlabel = labels[sortedDistIndicies[i]]
        classCount[voteIlabel] = classCount.get(voteIlabel, 0) + 1
    sortedClassCount = sorted(classCount.items(),
                              key=operator.itemgetter(1),
                              reverse=True)
    print(sortedClassCount)
    return sortedClassCount[0][0]


group, labels = createDataSet()
result = classify0([0, 0], group, labels, 3)
print(result)

```
```Python
(4, 2)
[2.21 2.   0.   0.01]
[2 3 1 0]
[('B', 2), ('A', 1)]
B
```
## 示例：改进约会网站匹配效果
### 处理数据
```Python
from numpy import *
import matplotlib
import matplotlib.pyplot as plt

def file2matrix(filename):
    fr = open(filename)
    arrayOLines = fr.readlines()
    numberOfLines = len(arrayOLines)
    returnMat = zeros((numberOfLines, 3))
    classLabelVector = []
    index = 0
    for line in arrayOLines:
        line = line.strip()
        listFromLine = line.split('\t')
        returnMat[index, :] = listFromLine[0:3]
        classLabelVector.append(int(listFromLine[-1]))
        index += 1
    return returnMat, classLabelVector

datingDataMat, datingLabels = file2matrix('datingTestSet2.txt')
print(datingDataMat)
print(datingLabels)
fig = plt.figure()
ax = fig.add_subplot(111)
# ax.scatter(datingDataMat[:, 1], datingDataMat[:, 2])
# plt.show()
ax.scatter(datingDataMat[:, 1], datingDataMat[:, 2],
           15.0*array(datingLabels), 15.0*array(datingLabels))
plt.show()

```
### Min-Max归一化
```Python
def autoNorm(dataSet):
    minVals = dataSet.min(0)
    maxVals = dataSet.max(0)
    ranges = maxVals - minVals
    normDataSet = zeros(shape(dataSet))
    m = dataSet.shape[0]
    normDataSet = dataSet - tile(minVals, (m, 1))
    normDataSet = normDataSet / tile(ranges, (m, 1))
    return normDataSet, ranges, minVals
```
### 测试算法
```Python
from numpy import *
import operator

def classify0(inX, dataSet, labels, k):
    # Calculate the distances
    dataSetSize = dataSet.shape[0]
    diffMat = tile(inX, (dataSetSize, 1)) - dataSet
    sqDiffMat = diffMat ** 2
    # print(sqDiffMat.shape)
    sqDistances = sqDiffMat.sum(axis=1)
    # print(sqDistances)
    distances = sqDistances ** 0.5
    # Sort the indicies
    sortedDistIndicies = distances.argsort()
    # print(sortedDistIndicies)
    # Select the k points
    classCount = {}
    for i in range(k):
        voteIlabel = labels[sortedDistIndicies[i]]
        classCount[voteIlabel] = classCount.get(voteIlabel, 0) + 1
    sortedClassCount = sorted(classCount.items(),
                              key=operator.itemgetter(1),
                              reverse=True)
    # print(sortedClassCount)
    return sortedClassCount[0][0]

def file2matrix(filename):
    fr = open(filename)
    arrayOLines = fr.readlines()
    numberOfLines = len(arrayOLines)
    returnMat = zeros((numberOfLines, 3))
    classLabelVector = []
    index = 0
    for line in arrayOLines:
        line = line.strip()
        listFromLine = line.split('\t')
        returnMat[index, :] = listFromLine[0:3]
        classLabelVector.append(int(listFromLine[-1]))
        index += 1
    return returnMat, classLabelVector

def autoNorm(dataSet):
    # 列最小值
    minVals = dataSet.min(0)
    # 列最大值
    maxVals = dataSet.max(0)
    ranges = maxVals - minVals
    normDataSet = zeros(shape(dataSet))
    m = dataSet.shape[0]
    # tile使minVal展成与输入大小相同
    normDataSet = dataSet - tile(minVals, (m, 1))
    # print(tile(minVals, (m,1 )).shape)
    normDataSet = normDataSet / tile(ranges, (m, 1))
    return normDataSet, ranges, minVals

def datingClassTest():
    hoRatio = 0.10
    datingDataMat, datingLabels = file2matrix('datingTestSet2.txt')
    normMat, ranges, minVals = autoNorm(datingDataMat)
    m = normMat.shape[0]
    numTestVecs = int(m*hoRatio)
    errorCount = 0.0
    for i in range(numTestVecs):
        classifierResult = classify0(normMat[i, :], normMat[numTestVecs:m, :], datingLabels[numTestVecs:m], 3)
        print("The classifier came back with: %d, the real answer is: %d" % (classifierResult, datingLabels[i]))
        if classifierResult != datingLabels[i]:
            errorCount += 1.0
    print("The total error rate is: %f" % (errorCount/float(numTestVecs)))


datingClassTest()

```
```Python
The classifier came back with: 3, the real answer is: 3
The classifier came back with: 2, the real answer is: 2
The classifier came back with: 1, the real answer is: 1
The classifier came back with: 1, the real answer is: 1
The classifier came back with: 1, the real answer is: 1
The classifier came back with: 1, the real answer is: 1
The classifier came back with: 3, the real answer is: 3
......
The classifier came back with: 3, the real answer is: 3
The classifier came back with: 1, the real answer is: 1
The classifier came back with: 2, the real answer is: 2
The classifier came back with: 2, the real answer is: 2
The classifier came back with: 1, the real answer is: 1
The classifier came back with: 1, the real answer is: 1
The classifier came back with: 3, the real answer is: 3
The classifier came back with: 2, the real answer is: 3
The classifier came back with: 1, the real answer is: 1
The classifier came back with: 2, the real answer is: 2
The classifier came back with: 1, the real answer is: 1
The classifier came back with: 3, the real answer is: 3
The classifier came back with: 3, the real answer is: 3
The classifier came back with: 2, the real answer is: 2
The classifier came back with: 1, the real answer is: 1
The classifier came back with: 3, the real answer is: 1
The total error rate is: 0.050000
```
### 构建完整系统
```Python
from numpy import *
import operator

def classify0(inX, dataSet, labels, k):
    # Calculate the distances
    dataSetSize = dataSet.shape[0]
    diffMat = tile(inX, (dataSetSize, 1)) - dataSet
    sqDiffMat = diffMat ** 2
    # print(sqDiffMat.shape)
    sqDistances = sqDiffMat.sum(axis=1)
    # print(sqDistances)
    distances = sqDistances ** 0.5
    # Sort the indicies
    sortedDistIndicies = distances.argsort()
    # print(sortedDistIndicies)
    # Select the k points
    classCount = {}
    for i in range(k):
        voteIlabel = labels[sortedDistIndicies[i]]
        classCount[voteIlabel] = classCount.get(voteIlabel, 0) + 1
    sortedClassCount = sorted(classCount.items(),
                              key=operator.itemgetter(1),
                              reverse=True)
    # print(sortedClassCount)
    return sortedClassCount[0][0]

def file2matrix(filename):
    fr = open(filename)
    arrayOLines = fr.readlines()
    numberOfLines = len(arrayOLines)
    returnMat = zeros((numberOfLines, 3))
    classLabelVector = []
    index = 0
    for line in arrayOLines:
        line = line.strip()
        listFromLine = line.split('\t')
        returnMat[index, :] = listFromLine[0:3]
        classLabelVector.append(int(listFromLine[-1]))
        index += 1
    return returnMat, classLabelVector

def autoNorm(dataSet):
    # 列最小值
    minVals = dataSet.min(0)
    # 列最大值
    maxVals = dataSet.max(0)
    ranges = maxVals - minVals
    normDataSet = zeros(shape(dataSet))
    m = dataSet.shape[0]
    # tile使minVal展成与输入大小相同
    normDataSet = dataSet - tile(minVals, (m, 1))
    # print(tile(minVals, (m,1 )).shape)
    normDataSet = normDataSet / tile(ranges, (m, 1))
    return normDataSet, ranges, minVals

def datingClassTest():
    hoRatio = 0.10
    datingDataMat, datingLabels = file2matrix('datingTestSet2.txt')
    normMat, ranges, minVals = autoNorm(datingDataMat)
    m = normMat.shape[0]
    numTestVecs = int(m*hoRatio)
    errorCount = 0.0
    for i in range(numTestVecs):
        classifierResult = classify0(normMat[i, :], normMat[numTestVecs:m, :], datingLabels[numTestVecs:m], 3)
        print("The classifier came back with: %d, the real answer is: %d" % (classifierResult, datingLabels[i]))
        if classifierResult != datingLabels[i]:
            errorCount += 1.0
    print("The total error rate is: %f" % (errorCount/float(numTestVecs)))


def classifyPerson():
    resultList = ['not at all', 'in small doses', 'in large doses']
    percentTats = float(input("percentage of time spent playing video games?"))
    ffMiles = float(input("frequent flier miles earned per year?"))
    iceCream = float(input("liters of ice cream consumed per year?"))
    datingDataMat, datingLabels = file2matrix('datingTestSet2.txt')
    normMat, ranges, minVals = autoNorm(datingDataMat)
    inArr = array([ffMiles, percentTats, iceCream])
    classifierResult = classify0((inArr-minVals) / ranges, normMat, datingLabels, 3)
    print("You will probably like this person: ", resultList[classifierResult - 1])


classifyPerson()

```
```Python
percentage of time spent playing video games?10
frequent flier miles earned per year?10000
liters of ice cream consumed per year?0.5
You will probably like this person:  in small doses
```
## 示例：手写识别系统
### 图像转向量
```Python
import numpy as np
import operator


def img2Vector(filename):
    returnVect = np.zeros((1, 1024))
    fr = open(filename)
    for i in range(32):
        lineStr = fr.readline()
        for j in range(32):
            returnVect[0, 32 * i + j] = int(lineStr[j])
    return returnVect


testVector = img2Vector('digits/testDigits/0_13.txt')
print(testVector[0, 0:31])
print(testVector[0, 32:63])

```
```Python
[0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1. 1. 1. 1. 0. 0. 0. 0. 0. 0.
 0. 0. 0. 0. 0. 0. 0.]
[0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1. 1. 1. 1. 1. 1. 1. 0. 0. 0. 0. 0.
 0. 0. 0. 0. 0. 0. 0.]
```
### 手写数字识别系统
```Python
import numpy as np
import operator
import os


def classify0(inX, dataSet, labels, k):
    # Calculate the distances
    dataSetSize = dataSet.shape[0]
    diffMat = np.tile(inX, (dataSetSize, 1)) - dataSet
    sqDiffMat = diffMat ** 2
    sqDistances = sqDiffMat.sum(axis=1)
    distances = sqDistances ** 0.5
    # Sort the indicies
    sortedDistIndicies = distances.argsort()
    # Select the k points
    classCount = {}
    for i in range(k):
        voteIlabel = labels[sortedDistIndicies[i]]
        classCount[voteIlabel] = classCount.get(voteIlabel, 0) + 1
    sortedClassCount = sorted(classCount.items(),
                              key=operator.itemgetter(1),
                              reverse=True)
    return sortedClassCount[0][0]

def img2Vector(filename):
    returnVect = np.zeros((1, 1024))
    fr = open(filename)
    for i in range(32):
        lineStr = fr.readline()
        for j in range(32):
            returnVect[0, 32 * i + j] = int(lineStr[j])
    return returnVect


def handWritingClassTest():
    hwLabels = []
    trainingFileList = os.listdir('digits/trainingDigits')
    m = len(trainingFileList)
    trainingMat = np.zeros((m, 1024))
    for i in range(m):
        fileNameStr = trainingFileList[i]
        fileStr = fileNameStr.split('.')[0]
        classNumStr = int(fileStr.split('_')[0])
        hwLabels.append(classNumStr)
        trainingMat[i,:] = img2Vector('digits/trainingDigits/%s' % fileNameStr)
    testFileList = os.listdir('digits/testDigits')
    errorCount = 0.0
    mTest = len(testFileList)
    for i in range(mTest):
        fileNameStr = testFileList[i]
        fileStr = fileNameStr.split('.')[0]
        classNumStr = int(fileStr.split('_')[0])
        vectorUnderTest = img2Vector('digits/testDigits/%s' % fileNameStr)
        classifierResult = classify0(vectorUnderTest, trainingMat, hwLabels, 3)
        print("the classifier came back with: %d, the real answer is : %d" % (classifierResult, classNumStr))
        if classifierResult != classNumStr:
            errorCount += 1.0
    print("\nthe total number of errors is: %d" % errorCount)
    print("\nthe total error rate is: %f" % (errorCount/float(mTest)))


handWritingClassTest()
```
```Python
the classifier came back with: 0, the real answer is : 0
the classifier came back with: 0, the real answer is : 0
the classifier came back with: 0, the real answer is : 0
the classifier came back with: 0, the real answer is : 0
the classifier came back with: 0, the real answer is : 0
the classifier came back with: 0, the real answer is : 0
the classifier came back with: 0, the real answer is : 0
......
the classifier came back with: 9, the real answer is : 9
the classifier came back with: 9, the real answer is : 9
the classifier came back with: 9, the real answer is : 9
the classifier came back with: 9, the real answer is : 9
the classifier came back with: 9, the real answer is : 9

the total number of errors is: 10

the total error rate is: 0.010571
```

> # 主成分分析（PCA）

## PCA

|主成分分析||
|:--:|:--|
|优点|降低数据的复杂性、识别最重要的多个特征|
|缺点|不一定需要，且可能损失有用信息|
|使用数据类型|数值型数据|

### 原理
1.找出第一个主成分的方向，也就是数据'方差最大'的方向。
2.找出第二个主成分的方向，也就是数据'方差次大'的方向，并且该方向与第一个主成分方向'正交(orthogonal 如果是二维空间就叫垂直)'。
3.通过这种方式计算出所有的主成分方向。
4.通过数据集的协方差矩阵及其特征值分析，我们就可以得到这些主成分的值。
5.一旦得到了协方差矩阵的特征值和特征向量，我们就可以保留最大的 N 个特征。这些特征向量也给出了 N 个最重要特征的真实结构，我们就可以通过将数据乘上这 N 个特征向量 从而将它转换到新的空间上。

为什么正交？
1.正交是为了数据有效性损失最小
2.正交的一个原因是特征值的特征向量是正交的
### 实现
```Python
import numpy as np


def loadDataSet(fileName, delim='\t'):
    fr = open(fileName)
    stringArr = [line.strip().split(delim) for line in fr.readlines()]
    print(stringArr)
    datArr = [list(map(np.float, line)) for line in stringArr]
    print(datArr)
    return np.mat(datArr)


def pca(dataMat, topNfeat=9999999):
    # 按列求均值
    meanVals = np.mean(dataMat, axis=0)
    # 每个向量同时减均值
    meanRemoved = dataMat - meanVals
    print(meanRemoved.shape)
    # cov协方差=[(x1-x均值)*(y1-y均值)+(x2-x均值)*(y2-y均值)+...+(xn-x均值)*(yn-y均值)+]/(n-1)
    # 方差：（一维）度量两个随机变量关系的统计量
    # 协方差： （二维）度量各个维度偏离其均值的程度
    # 协方差矩阵：（多维）度量各个维度偏离其均值的程度

    # 当 cov(X, Y)>0时，表明X与Y正相关；(X越大，Y也越大；X越小Y，也越小。这种情况，我们称为“正相关”。)
    # 当 cov(X, Y)<0时，表明X与Y负相关；
    # 当 cov(X, Y)=0时，表明X与Y不相关。
    covMat = np.cov(meanRemoved, rowvar=0)
    # eigVals为特征值， eigVects为特征向量
    eigVals, eigVects = np.linalg.eig(np.mat(covMat))
    print(eigVals.shape)
    print(eigVects.shape)
    # 对特征值进行排序，返回index序号
    eigValInd = np.argsort(eigVals)
    # 倒序，[-1,-(topNfeat+1)]不包括-(topNfeat+1)本身
    eigValInd = eigValInd[:-(topNfeat+1):-1]
    # 重组eigVects最大道最小
    redEigVects = eigVects[:,eigValInd]
    # 将数据转换到新空间
    lowDDataMat = meanRemoved * redEigVects
    reconMat = (lowDDataMat * redEigVects.T) + meanVals
    return lowDDataMat, reconMat


dataMat = loadDataSet('testSet.txt')

lowDDataMat, reconMat = pca(dataMat, 1)
print(lowDDataMat.shape)

```
```Python
[['10.235186', '11.321997'], ... , ['10.334899', '8.543604']]
[[10.235186, 11.321997], ... , [10.334899, 8.543604]]
(1000, 2)
(2,)
(2, 2)
(1000, 1)
```
### 可视化
```Python
import numpy as np
import matplotlib.pyplot as plt


def loadDataSet(fileName, delim='\t'):
    fr = open(fileName)
    stringArr = [line.strip().split(delim) for line in fr.readlines()]
    # datArr = [[float(line[0]), float(line[1])]for line in stringArr]
    datArr = [list(map(np.float, line)) for line in stringArr]
    return np.mat(datArr)


def pca(dataMat, topNfeat=9999999):
    # 按列求均值
    meanVals = np.mean(dataMat, axis=0)
    # 每个向量同时减均值
    meanRemoved = dataMat - meanVals
    print(meanRemoved.shape)
    # cov协方差=[(x1-x均值)*(y1-y均值)+(x2-x均值)*(y2-y均值)+...+(xn-x均值)*(yn-y均值)+]/(n-1)
    # 方差：（一维）度量两个随机变量关系的统计量
    # 协方差： （二维）度量各个维度偏离其均值的程度
    # 协方差矩阵：（多维）度量各个维度偏离其均值的程度

    # 当 cov(X, Y)>0时，表明X与Y正相关；(X越大，Y也越大；X越小Y，也越小。这种情况，我们称为“正相关”。)
    # 当 cov(X, Y)<0时，表明X与Y负相关；
    # 当 cov(X, Y)=0时，表明X与Y不相关。
    covMat = np.cov(meanRemoved, rowvar=0)
    # eigVals为特征值， eigVects为特征向量
    eigVals, eigVects = np.linalg.eig(np.mat(covMat))
    print(eigVals.shape)
    print(eigVects.shape)
    # 对特征值进行排序，返回index序号
    eigValInd = np.argsort(eigVals)
    # 倒序，[-1,-(topNfeat+1)]不包括-(topNfeat+1)本身
    eigValInd = eigValInd[:-(topNfeat+1):-1]
    # 重组eigVects最大道最小
    redEigVects = eigVects[:,eigValInd]
    # 将数据转换到新空间
    lowDDataMat = meanRemoved * redEigVects
    reconMat = (lowDDataMat * redEigVects.T) + meanVals
    # 原始数据被重构后返回用于调试，同时降维之后的数据集也被返回了
    return lowDDataMat, reconMat


dataMat = loadDataSet('testSet.txt')
print(dataMat[:, 0].shape)
print(dataMat[:, 0].flatten().shape)
print(dataMat[:, 0].flatten().A[0].shape)
lowDDataMat, reconMat = pca(dataMat, 1)

fig = plt.figure()
ax = fig.add_subplot(111)
ax.scatter(dataMat[:, 0].flatten().A[0], dataMat[:, 1].flatten().A[0], marker='^', s=90)
ax.scatter(reconMat[:,0].flatten().A[0], reconMat[:,1].flatten().A[0], marker='o', s=50, c='red')

plt.show()

```
```Python
(1000, 1)
(1, 1000)
(1000,)
(1000, 2)
(2,)
(2, 2)
```
![PCA图示](/assets/img/machine_learning/PCA_01.png)
## 示例：利用PCA对半导体制造数据降维
```Python
import numpy as np


def loadDataSet(fileName, delim='\t'):
    fr = open(fileName)
    stringArr = [line.strip().split(delim) for line in fr.readlines()]
    datArr = [list(map(float, line)) for line in stringArr]
    return np.mat(datArr)


def replaceNanWithMean():
    datMat = loadDataSet('secom.data', ' ')
    print(datMat[0,72])
    numFeat = np.shape(datMat)[1]
    for i in range(numFeat):
        # 求非nan值的均值
        meanVal = np.mean(datMat[np.nonzero(~np.isnan(datMat[:,i]))[0], i])
        # nan值元素用均值进行赋值
        datMat[np.nonzero(np.isnan(datMat[:,i]))[0], i] = meanVal
    return datMat


datMat = replaceNanWithMean()
print(datMat[0, 72])
x = np.mat([[np.nan,2,3],[4,5,6],[7,8,9]])
print(x)
mask = ~np.isnan(x[:, 0])
print(mask)
nzero = np.nonzero(mask)
print(nzero[0])
meanVal = np.mean(x[nzero[0], 0])
print(meanVal)
x[np.nonzero(np.isnan(x[:, 0]))[0], 0] = meanVal
print(x)

```
```Python
nan
150.36155213454074
[[nan  2.  3.]
 [ 4.  5.  6.]
 [ 7.  8.  9.]]
[[False]
 [ True]
 [ True]]
[1 2]
5.5
[[5.5 2.  3. ]
 [4.  5.  6. ]
 [7.  8.  9. ]]
```
### 主成分分析得到主成分数目
```Python
import numpy as np


def loadDataSet(fileName, delim='\t'):
    fr = open(fileName)
    stringArr = [line.strip().split(delim) for line in fr.readlines()]
    datArr = [list(map(float, line)) for line in stringArr]
    return np.mat(datArr)


def replaceNanWithMean():
    datMat = loadDataSet('secom.data', ' ')
    numFeat = np.shape(datMat)[1]
    for i in range(numFeat):
        # 求非nan值的均值
        meanVal = np.mean(datMat[np.nonzero(~np.isnan(datMat[:,i]))[0], i])
        # nan值元素用均值进行赋值
        datMat[np.nonzero(np.isnan(datMat[:,i]))[0], i] = meanVal
    return datMat


dataMat = replaceNanWithMean()

meanVals = np.mean(dataMat, axis=0)
meanRemoved = dataMat - meanVals
# 计算协方差矩阵
covMat = np.cov(meanRemoved, rowvar=0)
# 求特征值以及特征向量
eigVals, eigVects = np.linalg.eig(np.mat(covMat))
print(eigVals)

```
可以看到前面15个值的数量级大于$10^{5}$，实际上以后的值都非常小，所以重要特征的数目很快下降。
实际上，有超过20%的特征值是0，意味着这些特征都是其他特征的副本，也就是说，它们可以通过其他特征来表示，而本身并没有提供额外的信息。
```Python
[ 5.34151979e+07  2.17466719e+07  8.24837662e+06  2.07388086e+06
  1.31540439e+06  4.67693557e+05  2.90863555e+05  2.83668601e+05
  2.37155830e+05  2.08513836e+05  1.96098849e+05  1.86856549e+05
  1.52422354e+05  1.13215032e+05  1.08493848e+05  1.02849533e+05
  1.00166164e+05  8.33473762e+04  8.15850591e+04  7.76560524e+04
  6.66060410e+04  6.52620058e+04  5.96776503e+04  5.16269933e+04
  5.03324580e+04  4.54661746e+04  4.41914029e+04  4.15532551e+04
  3.55294040e+04  3.31436743e+04  2.67385181e+04  1.47123429e+04
  1.44089194e+04  1.09321187e+04  1.04841308e+04  9.48876548e+03
  8.34665462e+03  7.22765535e+03  5.34196392e+03  4.95614671e+03
  4.23060022e+03  4.10673182e+03  3.41199406e+03  3.24193522e+03
  2.74523635e+03  2.35027999e+03  2.16835314e+03  1.86414157e+03
  1.76741826e+03  1.70492093e+03  1.66199683e+03  1.53948465e+03
  1.33096008e+03  1.25591691e+03  1.15509389e+03  1.12410108e+03
  1.03213798e+03  1.00972093e+03  9.50542179e+02  9.09791361e+02
  8.32001551e+02  8.08898242e+02  7.37343627e+02  6.87596830e+02
  5.64452104e+02  5.51812250e+02  5.37209115e+02  4.93029995e+02
  4.13720573e+02  3.90222119e+02  3.37288784e+02  3.27558605e+02
  3.08869553e+02  2.46285839e+02  2.28893093e+02  1.96447852e+02
  1.75559820e+02  1.65795169e+02  1.56428052e+02  1.39671194e+02
  1.28662864e+02  1.15624070e+02  1.10318239e+02  1.08663541e+02
  1.00695416e+02  9.80687852e+01  8.34968275e+01  7.53025397e+01
  6.89260158e+01  6.67786503e+01  6.09412873e+01  5.30974002e+01
  4.71797825e+01  4.50701108e+01  4.41349593e+01  4.03313416e+01
  3.95741636e+01  3.74000035e+01  3.44211326e+01  3.30031584e+01
  3.03317756e+01  2.88994580e+01  2.76478754e+01  2.57708695e+01
  2.44506430e+01  2.31640106e+01  2.26956957e+01  2.16925102e+01
  2.10114869e+01  2.00984697e+01  1.86489543e+01  1.83733216e+01
  1.72517802e+01  1.60481189e+01  1.54406997e+01  1.48356499e+01
  1.44273357e+01  1.42318192e+01  1.35592064e+01  1.30696836e+01
  1.28193512e+01  1.22093626e+01  1.15228376e+01  1.12141738e+01
  1.02585936e+01  9.86906139e+00  9.58794460e+00  9.41686288e+00
  9.20276340e+00  8.63791398e+00  8.20622561e+00  8.01020114e+00
  7.53391290e+00  7.33168361e+00  7.09960245e+00  7.02149364e+00
  6.76557324e+00  6.34504733e+00  6.01919292e+00  5.81680918e+00
  5.44653788e+00  5.12338463e+00  4.79593185e+00  4.47851795e+00
  4.50369987e+00  4.27479386e+00  3.89124198e+00  3.56466892e+00
  3.32248982e+00  2.97665360e+00  2.61425544e+00  2.31802829e+00
  2.17171124e+00  1.99239284e+00  1.96616566e+00  1.88149281e+00
  1.79228288e+00  1.71378363e+00  1.68028783e+00  1.60686268e+00
  1.47158244e+00  1.40656712e+00  1.37808906e+00  1.27967672e+00
  1.22803716e+00  1.18531109e+00  9.38857180e-01  9.18222054e-01
  8.26265393e-01  7.96585842e-01  7.74597255e-01  7.14002770e-01
  6.79457797e-01  6.37928310e-01  6.24646758e-01  5.34605353e-01
  4.60658687e-01  4.24265893e-01  4.08634622e-01  3.70321764e-01
  3.67016386e-01  3.35858033e-01  3.29780397e-01  2.94348753e-01
  2.84154176e-01  2.72703994e-01  2.63265991e-01  2.45227786e-01
  2.25805135e-01  2.22331919e-01  2.13514673e-01  1.93961935e-01
  1.91647269e-01  1.83668491e-01  1.82518017e-01  1.65310922e-01
  1.57447909e-01  1.51263974e-01  1.39427297e-01  1.32638882e-01
  1.28000027e-01  1.13559952e-01  1.12576237e-01  1.08809771e-01
  1.07136355e-01  8.60839655e-02  8.50467792e-02  8.29254355e-02
  7.03701660e-02  6.44475619e-02  6.09866327e-02  6.05709478e-02
  5.93963958e-02  5.22163549e-02  4.92729703e-02  4.80022983e-02
  4.51487439e-02  4.30180504e-02  4.13368324e-02  4.03281604e-02
  3.91576587e-02  3.54198873e-02  3.31199510e-02  3.13547234e-02
  3.07226509e-02  2.98354196e-02  2.81949091e-02  2.49158051e-02
  2.36374781e-02  2.28360210e-02  2.19602047e-02  2.00166957e-02
  1.86597535e-02  1.80415918e-02  1.72261012e-02  1.60703860e-02
  1.49566735e-02  1.40165444e-02  1.31296856e-02  1.21358005e-02
  1.07166503e-02  1.01045695e-02  9.76055340e-03  9.16740926e-03
  8.78108857e-03  8.67465278e-03  8.30918514e-03  8.05104488e-03
  7.56152126e-03  7.31508852e-03  7.26347037e-03  6.65728354e-03
  6.50769617e-03  6.28009879e-03  6.19160730e-03  5.64130272e-03
  5.30195373e-03  5.07453702e-03  4.47372286e-03  4.32543895e-03
  4.22006582e-03  3.97065729e-03  3.75292740e-03  3.64861290e-03
  3.38915810e-03  3.27965962e-03  3.06633825e-03  2.99206786e-03
  2.83586784e-03  2.74987243e-03  2.31066313e-03  2.26782346e-03
  1.82206662e-03  1.74955624e-03  1.69305161e-03  1.66624597e-03
  1.55346749e-03  1.51278404e-03  1.47296800e-03  1.33617458e-03
  1.30517592e-03  1.24056353e-03  1.19823961e-03  1.14381059e-03
  1.13027458e-03  1.11081803e-03  1.08359152e-03  1.03517496e-03
  1.00164593e-03  9.50024604e-04  8.94981182e-04  8.74363843e-04
  7.98497544e-04  7.51612219e-04  6.63964301e-04  6.21097643e-04
  6.18098604e-04  5.72611402e-04  5.57509230e-04  5.47002381e-04
  5.27195076e-04  5.11487997e-04  4.87787872e-04  4.74249071e-04
  4.52367688e-04  4.24431100e-04  4.19119024e-04  3.72489906e-04
  3.38125455e-04  3.34002143e-04  2.97951371e-04  2.84845901e-04
  2.79038287e-04  2.77054476e-04  2.67962796e-04  2.54815125e-04
  2.29230595e-04  1.99245436e-04  1.90381389e-04  1.84497913e-04
  1.77415682e-04  1.68160613e-04  1.63992030e-04  1.58025552e-04
  1.54226003e-04  1.35736724e-04  1.40079892e-04  1.46097433e-04
  1.46890640e-04  1.22704034e-04  1.16752515e-04  1.14080847e-04
  1.04252870e-04  9.90265099e-05  9.66039063e-05  9.60766570e-05
  9.16166346e-05  9.07003476e-05  8.60212633e-05  8.32654023e-05
  7.70526076e-05  7.36470021e-05  7.24998306e-05  6.80209909e-05
  6.68682701e-05  6.14500430e-05  5.99843180e-05  5.49918002e-05
  5.24646951e-05  5.13403843e-05  5.02336254e-05  4.89288504e-05
  4.51104474e-05  4.29823765e-05  4.18869715e-05  4.14341561e-05
  3.94822845e-05  3.80307292e-05  3.57776535e-05  3.43901591e-05
  2.98089203e-05  2.72388358e-05  1.46846459e-05  2.42608885e-05
  1.66549051e-05  2.30962279e-05  2.27807559e-05  2.14440814e-05
  1.96208174e-05  1.88276186e-05  1.91217363e-05  1.43753346e-05
  1.39779892e-05  7.36188593e-06  1.21760519e-05  1.20295835e-05
  8.34248007e-06  1.13426750e-05  1.09258905e-05  8.93991858e-06
  9.23630207e-06  1.02782992e-05  1.01021810e-05  9.64538300e-06
  9.72678797e-06  7.20354828e-06  6.69282813e-06  6.49477814e-06
  5.91044556e-06  6.00244889e-06  5.67034893e-06  5.31392220e-06
  5.09342484e-06  4.65422046e-06  4.45482134e-06  4.11265577e-06
  3.48065951e-06  3.65202836e-06  3.77558985e-06  2.78847699e-06
  2.57492503e-06  2.66299628e-06  2.39210232e-06  2.06298821e-06
  2.00824521e-06  1.76373602e-06  1.58273269e-06  1.32211395e-06
  1.44003524e-06  1.49813697e-06  1.10002716e-06  1.42489429e-06
  9.01008864e-07  8.49881106e-07  7.62521870e-07  6.57641102e-07
  5.85636641e-07  5.33937361e-07  4.16077216e-07  3.33765858e-07
  2.95575265e-07  2.54744632e-07  2.20144574e-07  1.86314528e-07
  1.77370970e-07  1.54794345e-07  1.39738552e-07  1.47331688e-07
  1.04110968e-07  1.00786519e-07  9.38635091e-08  9.10853310e-08
  8.71546326e-08  7.48338889e-08  6.06817435e-08  5.66479201e-08
  5.24576912e-08  4.57020646e-08  2.89942624e-08  2.60449426e-08
  2.10987990e-08  2.17618741e-08  1.75542294e-08  1.34637029e-08
  1.27167437e-08  1.23258200e-08  1.04987513e-08  9.86367964e-09
  8.49422040e-09  9.33428124e-09  7.42189761e-09  6.46870680e-09
  6.84633797e-09  5.76455749e-09  5.01138012e-09  3.48686431e-09
  2.77880627e-09  2.91267178e-09  1.73093441e-09  1.42391225e-09
  1.80003583e-10  6.95073560e-10  6.13337791e-10  9.24977136e-10
  1.16455057e-09  1.11815869e-09  1.97062440e-10  2.61925018e-10
  5.27517926e-10  1.94882420e-15 -1.35801994e-15  5.42081315e-16
 -1.07767511e-17  1.47709396e-18  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00  0.00000000e+00  0.00000000e+00
  0.00000000e+00  0.00000000e+00]
```
### 主成分分析
```Python
import numpy as np
import matplotlib.pyplot as plt


def loadDataSet(fileName, delim='\t'):
    fr = open(fileName)
    stringArr = [line.strip().split(delim) for line in fr.readlines()]
    datArr = [list(map(float, line)) for line in stringArr]
    return np.mat(datArr)


def replaceNanWithMean():
    datMat = loadDataSet('secom.data', ' ')
    numFeat = np.shape(datMat)[1]
    for i in range(numFeat):
        # 求非nan值的均值
        meanVal = np.mean(datMat[np.nonzero(~np.isnan(datMat[:, i]))[0], i])
        # nan值元素用均值进行赋值
        datMat[np.nonzero(np.isnan(datMat[:, i]))[0], i] = meanVal
    return datMat


dataMat = replaceNanWithMean()

meanVals = np.mean(dataMat, axis=0)
meanRemoved = dataMat - meanVals
# 计算协方差矩阵
covMat = np.cov(meanRemoved, rowvar=0)
# 求特征值以及特征向量
eigVals, eigVects = np.linalg.eig(np.mat(covMat))
print(len(eigVals))
print(eigVals[0])
# 求特征值的方差
meanEigVals = np.mean(eigVals)
stdEigVals = (eigVals - meanEigVals) ** 2 / len(eigVals)
print(stdEigVals[0])
sumStd = sum(stdEigVals)
print(sumStd)
perStd = stdEigVals / sumStd
num = []
for i in range(len(perStd)):
    num.append(i+1)
plt.plot(num[:20], perStd[:20], '^',num[:20], perStd[:20])
plt.ylabel("Std percentage")
plt.xlabel('Main Components Num')
plt.show()

```
![PCA图示](/assets/img/machine_learning/PCA_02.png)
可以看到前几个特征占百分比很高了。

> # 决策树

**决策树的定义：**
分类决策树模型是一种描述对实例进行分类的树形结构。决策树由结点（node）和有向边（directed edge）组成。结点有两种类型：内部结点（internal node）和叶结点（leaf node）。内部结点表示一个特征或属性(features)，叶结点表示一个类(labels)。
用决策树对需要测试的实例进行分类：从根节点开始，对实例的某一特征进行测试，根据测试结果，将实例分配到其子结点；这时，每一个子结点对应着该特征的一个取值。如此递归地对实例进行测试并分配，直至达到叶结点。最后将实例分配到叶结点的类中。

## 决策树的构造

|决策树||
|:--:|:--|
|优点|计算复杂度不高，输出结果易于理解，对中间值的缺失不敏感，可以处理不想管特征数据|
|缺点|可能会产生过度匹配的问题|
|适用数据类型|数值型和标称型|

### 原理
**熵 & 信息增益**
**熵（entropy）**： 熵指的是体系的混乱的程度，在不同的学科中也有引申出的更为具体的定义，是各领域十分重要的参量。
**信息论（information theory）中的熵（香农熵）**： 是一种信息的度量方式，表示信息的混乱程度，也就是说：信息越有序，信息熵越低。例如：火柴有序放在火柴盒里，熵值很低，相反，熵值很高。
**信息增益（information gain）**： 在划分数据集前后信息发生的变化称为信息增益。
```python
def createBranch():
    检测数据集中的所有数据的分类标签是否相同:
        If so return 类标签
        Else:
            寻找划分数据集的最好特征（划分之后信息熵最小，也就是信息增益最大的特征）
            划分数据集
            创建分支节点
                for 每个划分的子集
                    调用函数 createBranch （创建分支的函数）并增加返回结果到分支节点中
            return 分支节点
```
### 信息增益
熵越高，则混合的数据也越多
**注意：这里对数的底数是2，而深度学习中测试过，对数取自然对数e**
```Python
import math

def calcShannonEnt(dataSet):
    numEntries = len(dataSet)
    labelCounts = {}
    for featVec in dataSet:
        currentLabel = featVec[-1]

        # if currentLabel not in labelCounts.keys():
        #     labelCounts[currentLabel] = 0
        # labelCounts[currentLabel] += 1
        # 以上注释用以下一行代码搞定
        labelCounts[currentLabel] = labelCounts.get(currentLabel, 0) + 1

    shannonEnt = 0.0
    for key in labelCounts:
        prob = float(labelCounts[key]) / numEntries
        shannonEnt -= prob * math.log(prob, 2)
    return shannonEnt


def createDataSet():
    dataSet = [[1, 1, 'yes'],
               [1, 1, 'yes'],
               [1, 0, 'no'],
               [0, 1, 'no'],
               [0, 1, 'no']]
    labels = ['no surfacing', 'flippers']
    return dataSet, labels


dataSet, label = createDataSet()
print(dataSet, label)
print(calcShannonEnt(dataSet))
dataSet[0][-1] = 'maybe'
print(calcShannonEnt(dataSet))

```
```cpp
[[1, 1, 'yes'], [1, 1, 'yes'], [1, 0, 'no'], [0, 1, 'no'], [0, 1, 'no']] ['no surfacing', 'flippers']
0.9709505944546686
1.3709505944546687
```
### 划分数据集
**注意extend()与append()方法的区别，前者是将列表内容加入到之前的列表还是单个列表，后者是将列表加入形成多个列表**
**按照给定特征划分数据集**
```Python
def createDataSet():
    dataSet = [[1, 1, 'yes'],
               [1, 1, 'yes'],
               [1, 0, 'no'],
               [0, 1, 'no'],
               [0, 1, 'no']]
    labels = ['no surfacing', 'flippers']
    return dataSet, labels


def splitDataSet(dataSet, axis, value):
    retDataSet = []
    for featVec in dataSet:
        if featVec[axis] == value:
            reducedFeatVec = featVec[:axis]
            reducedFeatVec.extend(featVec[axis+1:])
            retDataSet.append(reducedFeatVec)
    return retDataSet


dataSet, label = createDataSet()
print(dataSet)
print(splitDataSet(dataSet, 0, 1))
print(splitDataSet(dataSet, 0, 0))

```
```Python
[[1, 1, 'yes'], [1, 1, 'yes'], [1, 0, 'no'], [0, 1, 'no'], [0, 1, 'no']]
[[1, 'yes'], [1, 'yes'], [0, 'no']]
[[1, 'no'], [1, 'no']]
```
**选择最好的数据集划分方式**
```Python
import math


def calcShannonEnt(dataSet):
    numEntries = len(dataSet)
    labelCounts = {}
    for featVec in dataSet:
        currentLabel = featVec[-1]

        # if currentLabel not in labelCounts.keys():
        #     labelCounts[currentLabel] = 0
        # labelCounts[currentLabel] += 1
        # 以上注释用以下一行代码搞定
        labelCounts[currentLabel] = labelCounts.get(currentLabel, 0) + 1

    shannonEnt = 0.0
    for key in labelCounts:
        prob = float(labelCounts[key]) / numEntries
        shannonEnt -= prob * math.log(prob, 2)
    return shannonEnt


def createDataSet():
    dataSet = [[1, 1, 'yes'],
               [1, 1, 'yes'],
               [1, 0, 'no'],
               [0, 1, 'no'],
               [0, 1, 'no']]
    labels = ['no surfacing', 'flippers']
    return dataSet, labels


def splitDataSet(dataSet, axis, value):
    retDataSet = []
    for featVec in dataSet:
        if featVec[axis] == value:
            reducedFeatVec = featVec[:axis]
            reducedFeatVec.extend(featVec[axis + 1:])
            retDataSet.append(reducedFeatVec)
    return retDataSet


def chooseBestFeatureToSplit(dataSet):
    numFeatures = len(dataSet[0]) - 1
    baseEntropy = calcShannonEnt(dataSet)
    bestInfoGain = 0.0;
    bestFeature = -1
    for i in range(numFeatures):
        featList = [example[i] for example in dataSet]
        uniqueVals = set(featList)
        newEntropy = 0.0
        for value in uniqueVals:
            subDataSet = splitDataSet(dataSet, i, value)
            prob = len(subDataSet) / float(len(dataSet))
            newEntropy += prob * calcShannonEnt(subDataSet)
        infoGain = baseEntropy - newEntropy
        if infoGain > bestInfoGain:
            bestInfoGain = infoGain
            bestFeature = i
    return bestFeature


dataSet, label = createDataSet()
bestFeature = chooseBestFeatureToSplit(dataSet)
print(bestFeature)
print(dataSet)
```
```Python
0
[[1, 1, 'yes'], [1, 1, 'yes'], [1, 0, 'no'], [0, 1, 'no'], [0, 1, 'no']]
```
### 递归构建决策树
```Python
import math
import operator


def calcShannonEnt(dataSet):
    numEntries = len(dataSet)
    labelCounts = {}
    for featVec in dataSet:
        currentLabel = featVec[-1]

        # if currentLabel not in labelCounts.keys():
        #     labelCounts[currentLabel] = 0
        # labelCounts[currentLabel] += 1
        # 以上注释用以下一行代码搞定
        labelCounts[currentLabel] = labelCounts.get(currentLabel, 0) + 1

    shannonEnt = 0.0
    for key in labelCounts:
        prob = float(labelCounts[key]) / numEntries
        shannonEnt -= prob * math.log(prob, 2)
    return shannonEnt


def createDataSet():
    dataSet = [[1, 1, 'yes'],
               [1, 1, 'yes'],
               [1, 0, 'no'],
               [0, 1, 'no'],
               [0, 1, 'no']]
    labels = ['no surfacing', 'flippers']
    return dataSet, labels


def splitDataSet(dataSet, axis, value):
    retDataSet = []
    for featVec in dataSet:
        if featVec[axis] == value:
            reducedFeatVec = featVec[:axis]
            reducedFeatVec.extend(featVec[axis + 1:])
            retDataSet.append(reducedFeatVec)
    return retDataSet


def chooseBestFeatureToSplit(dataSet):
    numFeatures = len(dataSet[0]) - 1
    baseEntropy = calcShannonEnt(dataSet)
    bestInfoGain = 0.0;
    bestFeature = -1
    for i in range(numFeatures):
        featList = [example[i] for example in dataSet]
        uniqueVals = set(featList)
        newEntropy = 0.0
        for value in uniqueVals:
            subDataSet = splitDataSet(dataSet, i, value)
            prob = len(subDataSet) / float(len(dataSet))
            newEntropy += prob * calcShannonEnt(subDataSet)
        infoGain = baseEntropy - newEntropy
        if infoGain > bestInfoGain:
            bestInfoGain = infoGain
            bestFeature = i
    return bestFeature


def majorityCnt(classList):
    classCount = {}
    for vote in classList:
        classCount[vote] = classCount.get(vote, 0) + 1
    sortedClassCount = sorted(classCount.items(),
                              key=operator.itemgetter(1),
                              reverse=True)
    return sortedClassCount[0][0]


def createTree(dataSet, labels):
    classList = [example[-1] for example in dataSet]
    if classList.count(classList[0]) == len(classList):
        return classList[0]
    # 遍历完所有特征时返回出现次数最多的，多数表决
    if len(dataSet[0]) == 1:
        return majorityCnt(classList)
    bestFeat = chooseBestFeatureToSplit(dataSet)
    bestFeatLabel = labels[bestFeat]
    myTree = {bestFeatLabel:{}}
    del(labels[bestFeat])
    featValues = [example[bestFeat] for example in dataSet]
    uniqueVals = set(featValues)
    for value in uniqueVals:
        subLabels = labels[:]
        myTree[bestFeatLabel][value] = createTree(splitDataSet(dataSet, bestFeat, value), subLabels)
    return myTree


dataSet, labels = createDataSet()
myTree = createTree(dataSet, labels)
print(myTree)

```
```Python
{'no surfacing': {0: 'no', 1: {'flippers': {0: 'no', 1: 'yes'}}}}
```
## 注解绘制树形图
### Matplotlib注解
```Python
import matplotlib.pyplot as plt
import matplotlib as mpl

decisionNode = dict(boxstyle='sawtooth', fc='0.8')
leafNode = dict(boxstyle='round4', fc='0.8')
arrow_args = dict(arrowstyle='<-')


def plotNode(nodeTxt, centerPt, parentPt, nodeType):
    createPlot.ax.annotate(nodeTxt,
                xy=parentPt,
                xycoords='axes fraction',
                xytext=centerPt,
                textcoords='axes fraction',
                va='center',
                ha='center',
                bbox=nodeType,
                arrowprops=arrow_args)


def createPlot():

    fig = plt.figure(1, facecolor='white')
    fig.clf()
    createPlot.ax = plt.subplot(111, frameon=False)
    plotNode('Decision Node', (0.5, 0.1), (0.1, 0.5), decisionNode)
    plotNode('Leaf Node', (0.8, 0.1), (0.3, 0.8), leafNode)
    plt.show()


createPlot()

```
![图示](/assets/img/machine_learning/DT_01.png)
### 构造注解树
```Python
import matplotlib.pyplot as plt
import matplotlib as mpl

decisionNode = dict(boxstyle='sawtooth', fc='0.8')
leafNode = dict(boxstyle='round4', fc='0.8')
arrow_args = dict(arrowstyle='<-')


def plotNode(ax, nodeTxt, centerPt, parentPt, nodeType):
    ax.annotate(nodeTxt,
                xy=parentPt,
                xycoords='axes fraction',
                xytext=centerPt,
                textcoords='axes fraction',
                va='center',
                ha='center',
                bbox=nodeType,
                arrowprops=arrow_args)


def createPlot():

    fig = plt.figure(1, facecolor='white')
    fig.clf()
    ax = plt.subplot(111, frameon=False)
    plotNode(ax, 'Decision Node', (0.5, 0.1), (0.1, 0.5), decisionNode)
    plotNode(ax, 'Leaf Node', (0.8, 0.1), (0.3, 0.8), leafNode)
    plt.show()


def getNumLeafs(myTree):
    numLeafs = 0
    firstStr = list(myTree.keys())[0]
    secondDict = myTree[firstStr]
    for key in secondDict.keys():
        if type(secondDict[key]).__name__ == 'dict':
            numLeafs += getNumLeafs(secondDict[key])
        else:
            numLeafs += 1
    return numLeafs


def getTreeDepth(myTree):
    maxDepth = 0
    firstStr = list(myTree.keys())[0]
    secondDict = myTree[firstStr]
    for key in secondDict.keys():
        if type(secondDict[key]).__name__ == 'dict':
            thisDepth = 1 + getTreeDepth(secondDict[key])
        else:
            thisDepth = 1
        if thisDepth > maxDepth:
            maxDepth = thisDepth
    return maxDepth


def retrieveTree(i):
    listOfTrees = [{'no surfacing': {0: 'no', 1: {'flippers': {0: 'no', 1: 'yes'}}}},
                   {'no surfacing': {0: 'no', 1: {'flippers': {0: {'head': {0: 'no', 1: 'yes'}}, 1: 'no'}}}}]
    return listOfTrees[i]


myTree = retrieveTree(0)
print(list(myTree.keys()))
print(getNumLeafs(myTree))
print(getTreeDepth(myTree))

```
```Python
['no surfacing']
3
2
```
### 打印注解树
```Python
import matplotlib.pyplot as plt
import matplotlib as mpl

decisionNode = dict(boxstyle='sawtooth', fc='0.8')
leafNode = dict(boxstyle='round4', fc='0.8')
arrow_args = dict(arrowstyle='<-')


def plotNode(nodeTxt, centerPt, parentPt, nodeType):
    createPlot.ax.annotate(nodeTxt,
                xy=parentPt,
                xycoords='axes fraction',
                xytext=centerPt,
                textcoords='axes fraction',
                va='center',
                ha='center',
                bbox=nodeType,
                arrowprops=arrow_args)


def createPlot(inTree):
    fig = plt.figure(1, facecolor='white')
    fig.clf()
    axprops = dict(xticks=[], yticks=[])
    createPlot.ax = plt.subplot(111, frameon=False, **axprops)
    plotTree.totalW = float(getNumLeafs(inTree))
    plotTree.totalD = float(getTreeDepth(inTree))
    plotTree.xOff = -0.5/plotTree.totalW
    plotTree.yOff = 1.0
    plotTree(inTree, (0.5, 1.0), '')
    # plotNode('Decision Node', (0.5, 0.1), (0.1, 0.5), decisionNode)
    # plotNode('Leaf Node', (0.8, 0.1), (0.3, 0.8), leafNode)
    plt.show()


def getNumLeafs(myTree):
    numLeafs = 0
    firstStr = list(myTree.keys())[0]
    secondDict = myTree[firstStr]
    for key in secondDict.keys():
        if type(secondDict[key]).__name__ == 'dict':
            numLeafs += getNumLeafs(secondDict[key])
        else:
            numLeafs += 1
    return numLeafs


def getTreeDepth(myTree):
    maxDepth = 0
    firstStr = list(myTree.keys())[0]
    secondDict = myTree[firstStr]
    for key in secondDict.keys():
        if type(secondDict[key]).__name__ == 'dict':
            thisDepth = 1 + getTreeDepth(secondDict[key])
        else:
            thisDepth = 1
        if thisDepth > maxDepth:
            maxDepth = thisDepth
    return maxDepth


def retrieveTree(i):
    listOfTrees = [{'no surfacing': {0: 'no', 1: {'flippers': {0: 'no', 1: 'yes'}}}},
                   {'no surfacing': {0: 'no', 1: {'flippers': {0: {'head': {0: 'no', 1: 'yes'}}, 1: 'no'}}}}]
    return listOfTrees[i]


def plotMidText(cntrPt, parentPt, txtString):
    xMid = (parentPt[0] - cntrPt[0]) /2.0 + cntrPt[0]
    yMid = (parentPt[1] - cntrPt[1]) /2.0 + cntrPt[1]
    createPlot.ax.text(xMid, yMid, txtString)


def plotTree(myTree, parentPt, nodeTxt):
    numLeafs = getNumLeafs(myTree)
    depth = getTreeDepth(myTree)
    firstStr = list(myTree.keys())[0]
    cntrPt = (plotTree.xOff + (1.0 + float(numLeafs)) / 2.0/plotTree.totalW, plotTree.yOff)

    plotMidText(cntrPt, parentPt, nodeTxt)
    plotNode(firstStr, cntrPt, parentPt, decisionNode)
    secondDict = myTree[firstStr]
    plotTree.yOff = plotTree.yOff - 1.0/plotTree.totalD
    for key in secondDict.keys():
        if type(secondDict[key]).__name__ == 'dict':
            plotTree(secondDict[key], cntrPt, str(key))
        else:
            plotTree.xOff = plotTree.xOff + 1.0/plotTree.totalW
            plotNode(secondDict[key], (plotTree.xOff, plotTree.yOff), cntrPt, leafNode)
            plotMidText((plotTree.xOff, plotTree.yOff), cntrPt, str(key))
    plotTree.yOff = plotTree.yOff + 1.0/plotTree.totalD


myTree = retrieveTree(0)
createPlot(myTree)
myTree['no surfacing'][2] = 'maybe'
createPlot(myTree)

```
![图示](/assets/img/machine_learning/DT_02.png)
![图示](/assets/img/machine_learning/DT_03.png)
## 测试和存储分类器
### 测试算法
```Python
import math
import operator


def calcShannonEnt(dataSet):
    numEntries = len(dataSet)
    labelCounts = {}
    for featVec in dataSet:
        currentLabel = featVec[-1]

        # if currentLabel not in labelCounts.keys():
        #     labelCounts[currentLabel] = 0
        # labelCounts[currentLabel] += 1
        # 以上注释用以下一行代码搞定

        labelCounts[currentLabel] = labelCounts.get(currentLabel, 0) + 1

    shannonEnt = 0.0
    for key in labelCounts:
        prob = float(labelCounts[key]) / numEntries
        shannonEnt -= prob * math.log(prob, 2)
    return shannonEnt


def createDataSet():
    dataSet = [[1, 1, 'yes'],
               [1, 1, 'yes'],
               [1, 0, 'no'],
               [0, 1, 'no'],
               [0, 1, 'no']]
    labels = ['no surfacing', 'flippers']
    return dataSet, labels


def splitDataSet(dataSet, axis, value):
    retDataSet = []
    for featVec in dataSet:
        if featVec[axis] == value:
            reducedFeatVec = featVec[:axis]
            reducedFeatVec.extend(featVec[axis + 1:])
            retDataSet.append(reducedFeatVec)
    return retDataSet


def chooseBestFeatureToSplit(dataSet):
    numFeatures = len(dataSet[0]) - 1
    baseEntropy = calcShannonEnt(dataSet)
    bestInfoGain = 0.0;
    bestFeature = -1
    for i in range(numFeatures):
        featList = [example[i] for example in dataSet]
        uniqueVals = set(featList)
        newEntropy = 0.0
        for value in uniqueVals:
            subDataSet = splitDataSet(dataSet, i, value)
            prob = len(subDataSet) / float(len(dataSet))
            newEntropy += prob * calcShannonEnt(subDataSet)
        infoGain = baseEntropy - newEntropy
        if infoGain > bestInfoGain:
            bestInfoGain = infoGain
            bestFeature = i
    return bestFeature


def majorityCnt(classList):
    classCount = {}
    for vote in classList:
        classCount[vote] = classCount.get(vote, 0) + 1
    sortedClassCount = sorted(classCount.items(),
                              key=operator.itemgetter(1),
                              reverse=True)
    return sortedClassCount[0][0]


def createTree(dataSet, labels):
    classList = [example[-1] for example in dataSet]
    if classList.count(classList[0]) == len(classList):
        return classList[0]
    # 遍历完所有特征时返回出现次数最多的，多数表决
    if len(dataSet[0]) == 1:
        return majorityCnt(classList)
    bestFeat = chooseBestFeatureToSplit(dataSet)
    bestFeatLabel = labels[bestFeat]
    myTree = {bestFeatLabel:{}}
    del(labels[bestFeat])
    featValues = [example[bestFeat] for example in dataSet]
    uniqueVals = set(featValues)
    for value in uniqueVals:
        subLabels = labels[:]
        myTree[bestFeatLabel][value] = createTree(splitDataSet(dataSet, bestFeat, value), subLabels)
    return myTree


def retrieveTree(i):
    listOfTrees = [{'no surfacing': {0: 'no', 1: {'flippers': {0: 'no', 1: 'yes'}}}},
                   {'no surfacing': {0: 'no', 1: {'flippers': {0: {'head': {0: 'no', 1: 'yes'}}, 1: 'no'}}}}]
    return listOfTrees[i]


def classify(inputTree, featLabels, testVec):
    firstStr = list(inputTree.keys())[0]
    secondDict = inputTree[firstStr]
    featIndex = featLabels.index(firstStr)
    for key in secondDict.keys():
        if testVec[featIndex] == key:
            if type(secondDict[key]).__name__ == 'dict':
                classLabel = classify(secondDict[key], featLabels, testVec)
            else:
                classLabel = secondDict[key]
    return classLabel


dataSet, labels = createDataSet()
print(labels)
myTree = retrieveTree(0)
print(myTree)
print(classify(myTree, labels ,[1, 0]))
print(classify(myTree, labels, [1, 1]))

```
```Python
['no surfacing', 'flippers']
{'no surfacing': {0: 'no', 1: {'flippers': {0: 'no', 1: 'yes'}}}}
no
yes
```
### 存储
```Python
def storeTree(inputTree, filename):
    import pickle
    fw = open(filename, 'w')
    pickle.dump(inputTree, fw)
    fw.close()


def grabTree(filename):
    import pickle
    fr = open(filename)
    return pickle.load(fr)


def retrieveTree(i):
    listOfTrees = [{'no surfacing': {0: 'no', 1: {'flippers': {0: 'no', 1: 'yes'}}}},
                   {'no surfacing': {0: 'no', 1: {'flippers': {0: {'head': {0: 'no', 1: 'yes'}}, 1: 'no'}}}}]
    return listOfTrees[i]

myTree = retrieveTree(0)
print(myTree)
myTree = 'sasafa'
storeTree(myTree, 'classifierStorage.txt')
loadTree = grabTree('classifierStorage.txt')
print(loadTree)
```
## 使用决策树预测隐形眼镜类型
```Python
import math
import operator
import matplotlib.pyplot as plt
import matplotlib as mpl


def calcShannonEnt(dataSet):
    numEntries = len(dataSet)
    labelCounts = {}
    for featVec in dataSet:
        currentLabel = featVec[-1]

        # if currentLabel not in labelCounts.keys():
        #     labelCounts[currentLabel] = 0
        # labelCounts[currentLabel] += 1
        # 以上注释用以下一行代码搞定

        labelCounts[currentLabel] = labelCounts.get(currentLabel, 0) + 1

    shannonEnt = 0.0
    for key in labelCounts:
        prob = float(labelCounts[key]) / numEntries
        shannonEnt -= prob * math.log(prob, 2)
    return shannonEnt


def createDataSet():
    dataSet = [[1, 1, 'yes'],
               [1, 1, 'yes'],
               [1, 0, 'no'],
               [0, 1, 'no'],
               [0, 1, 'no']]
    labels = ['no surfacing', 'flippers']
    return dataSet, labels


def splitDataSet(dataSet, axis, value):
    retDataSet = []
    for featVec in dataSet:
        if featVec[axis] == value:
            reducedFeatVec = featVec[:axis]
            reducedFeatVec.extend(featVec[axis + 1:])
            retDataSet.append(reducedFeatVec)
    return retDataSet


def chooseBestFeatureToSplit(dataSet):
    numFeatures = len(dataSet[0]) - 1
    baseEntropy = calcShannonEnt(dataSet)
    bestInfoGain = 0.0;
    bestFeature = -1
    for i in range(numFeatures):
        featList = [example[i] for example in dataSet]
        uniqueVals = set(featList)
        newEntropy = 0.0
        for value in uniqueVals:
            subDataSet = splitDataSet(dataSet, i, value)
            prob = len(subDataSet) / float(len(dataSet))
            newEntropy += prob * calcShannonEnt(subDataSet)
        infoGain = baseEntropy - newEntropy
        if infoGain > bestInfoGain:
            bestInfoGain = infoGain
            bestFeature = i
    return bestFeature


def majorityCnt(classList):
    classCount = {}
    for vote in classList:
        classCount[vote] = classCount.get(vote, 0) + 1
    sortedClassCount = sorted(classCount.items(),
                              key=operator.itemgetter(1),
                              reverse=True)
    return sortedClassCount[0][0]


def createTree(dataSet, labels):
    classList = [example[-1] for example in dataSet]
    if classList.count(classList[0]) == len(classList):
        return classList[0]
    # 遍历完所有特征时返回出现次数最多的，多数表决
    if len(dataSet[0]) == 1:
        return majorityCnt(classList)
    bestFeat = chooseBestFeatureToSplit(dataSet)
    bestFeatLabel = labels[bestFeat]
    myTree = {bestFeatLabel:{}}
    del(labels[bestFeat])
    featValues = [example[bestFeat] for example in dataSet]
    uniqueVals = set(featValues)
    for value in uniqueVals:
        subLabels = labels[:]
        myTree[bestFeatLabel][value] = createTree(splitDataSet(dataSet, bestFeat, value), subLabels)
    return myTree


decisionNode = dict(boxstyle='sawtooth', fc='0.8')
leafNode = dict(boxstyle='round4', fc='0.8')
arrow_args = dict(arrowstyle='<-')


def plotNode(nodeTxt, centerPt, parentPt, nodeType):
    createPlot.ax.annotate(nodeTxt,
                xy=parentPt,
                xycoords='axes fraction',
                xytext=centerPt,
                textcoords='axes fraction',
                va='center',
                ha='center',
                bbox=nodeType,
                arrowprops=arrow_args)


def createPlot(inTree):
    fig = plt.figure(1, facecolor='white')
    fig.clf()
    axprops = dict(xticks=[], yticks=[])
    createPlot.ax = plt.subplot(111, frameon=False, **axprops)
    plotTree.totalW = float(getNumLeafs(inTree))
    plotTree.totalD = float(getTreeDepth(inTree))
    plotTree.xOff = -0.5/plotTree.totalW
    plotTree.yOff = 1.0
    plotTree(inTree, (0.5, 1.0), '')
    # plotNode('Decision Node', (0.5, 0.1), (0.1, 0.5), decisionNode)
    # plotNode('Leaf Node', (0.8, 0.1), (0.3, 0.8), leafNode)
    plt.show()


def getNumLeafs(myTree):
    numLeafs = 0
    firstStr = list(myTree.keys())[0]
    secondDict = myTree[firstStr]
    for key in secondDict.keys():
        if type(secondDict[key]).__name__ == 'dict':
            numLeafs += getNumLeafs(secondDict[key])
        else:
            numLeafs += 1
    return numLeafs


def getTreeDepth(myTree):
    maxDepth = 0
    firstStr = list(myTree.keys())[0]
    secondDict = myTree[firstStr]
    for key in secondDict.keys():
        if type(secondDict[key]).__name__ == 'dict':
            thisDepth = 1 + getTreeDepth(secondDict[key])
        else:
            thisDepth = 1
        if thisDepth > maxDepth:
            maxDepth = thisDepth
    return maxDepth


def retrieveTree(i):
    listOfTrees = [{'no surfacing': {0: 'no', 1: {'flippers': {0: 'no', 1: 'yes'}}}},
                   {'no surfacing': {0: 'no', 1: {'flippers': {0: {'head': {0: 'no', 1: 'yes'}}, 1: 'no'}}}}]
    return listOfTrees[i]


def plotMidText(cntrPt, parentPt, txtString):
    xMid = (parentPt[0] - cntrPt[0]) /2.0 + cntrPt[0]
    yMid = (parentPt[1] - cntrPt[1]) /2.0 + cntrPt[1]
    createPlot.ax.text(xMid, yMid, txtString)


def plotTree(myTree, parentPt, nodeTxt):
    numLeafs = getNumLeafs(myTree)
    depth = getTreeDepth(myTree)
    firstStr = list(myTree.keys())[0]
    cntrPt = (plotTree.xOff + (1.0 + float(numLeafs)) / 2.0/plotTree.totalW, plotTree.yOff)

    plotMidText(cntrPt, parentPt, nodeTxt)
    plotNode(firstStr, cntrPt, parentPt, decisionNode)
    secondDict = myTree[firstStr]
    plotTree.yOff = plotTree.yOff - 1.0/plotTree.totalD
    for key in secondDict.keys():
        if type(secondDict[key]).__name__ == 'dict':
            plotTree(secondDict[key], cntrPt, str(key))
        else:
            plotTree.xOff = plotTree.xOff + 1.0/plotTree.totalW
            plotNode(secondDict[key], (plotTree.xOff, plotTree.yOff), cntrPt, leafNode)
            plotMidText((plotTree.xOff, plotTree.yOff), cntrPt, str(key))
    plotTree.yOff = plotTree.yOff + 1.0/plotTree.totalD


fr = open('lenses.txt')
lenses = [inst.strip().split('\t') for inst in fr.readlines()]
lensesLabels = ['age', 'prescript', 'astigmatic', 'tearRate']
lensesTree = createTree(lenses, lensesLabels)
print(lensesTree)

createPlot(lensesTree)

```
```Python
{'tearRate': {'reduced': 'no lenses', 'normal': {'astigmatic': {'yes': {'prescript': {'myope': 'hard', 'hyper': {'age': {'pre': 'no lenses', 'presbyopic': 'no lenses', 'young': 'hard'}}}}, 'no': {'age': {'pre': 'soft', 'presbyopic': {'prescript': {'myope': 'no lenses', 'hyper': 'soft'}}, 'young': 'soft'}}}}}}

```
![图示](/assets/img/machine_learning/DT_04.png)
