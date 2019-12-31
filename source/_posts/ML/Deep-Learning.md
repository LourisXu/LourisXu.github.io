---
title: Deep Learning
tags:
  - ML
translate_title: deep-learning
date: 2019-07-05 10:55:20
toc: true
---
> # 深度学习基础

WPS标注模式打开[深度学习](/assets/files/Deep_Learning.pdf)
## 线性回归

|类型|描述|适用|
|:--:|:--:|:--:|
|线性回归|线性回归输出是一个连续值：预测放假、气温、销售额等连续值问题|回归问题|
|Softmax回归|Softmax回归输出是一个离散值：图像分类、垃圾邮件识别、疾病监测等离散值问题|分类问题|

### 基本要素
以一个简单房屋价格预测为例，仅考虑两个因素（特征），即面积和房龄

**1.模型(Model)**
$$\hat{y} = x_1w_1+x_2w_2+b$$
- 其中$w_1$和$w_2$是权重(weight)，b是偏差(bias)，且均为标量。
- 它们是线性回归模型的参数(parameter)。
- 模型输出$\hat{y}$是线性回归对真是价格$y$的预测或估计，通常允许它们之间有一定误差。

**2.模型训练(Model training)**
通过数据来寻找特定的模型参数值，使模型在数据上的误差尽可能小。
(1)训练数据
- 通常收集一系列真实数据，希望在这个数据上面寻找模型参数来使模型的预测价格与真实价格的误差最小。
- 在机器学习术语里，该数据集被称为训练数据集(training data set)或训练集(training set)，移动房屋被称为一个样本(sample)，其真实出售价格叫作标签(label)，用来预测标签的两个因素叫作特征(feature)。特征表示样本的特点。

假设采集的样本数为$n$，索引为$i$的样本的特征为$x_1^{(i)}$和$x_2^{(i)}$。对于索引为$i$的房屋，线性回归模型的房屋价格预测表达式为：
$$\hat{y}^{(i)}=x_1^{(i)}w_1+x_2^{(i)}w_2+b.$$

(2)损失函数
- 衡量价格预测值与真实值之间的误差。
- 通常选取一个非负数作为误差，且数值越小表示误差越小。

一个常用的选择是平方函数，其在评估索引为$i$的样本误差的表达式为：
$$\\ell^{(i)}(w_1,w_2,b)=\frac{1}{2}(\hat{y}^{(i)}-y^{(i)})^2.$$
其中常数$\frac{1}{2}$使对平方项求导后的常数系数为1。

- 给定训练数据及，这个误差只与模型参数相关，因此我们将它记为以模型参数为参数的函数。
- 在机器学习里，将衡量误差的函数称为损失函数(loss function)。
- 这里使用的平方误差函数也称为平方损失(square loss)

通常，用训练数据集中所有样本误差的平均来衡量模型预测的质量：
$$\ell(w_1,w_2,b)=\frac{1}{n}\sum_{i=1}^n l^{(i)}(w_1,w_2,b)=\frac{1}{n}\sum_{i=1}^n \frac{1}{2} (x_1^{(i)}w_1+x_2^{(i)}w_2+b-y^{(i)})^2.$$

在模型训练中，我们希望找出一组模型参数，记为$w_1^{\*},w_2^{\*},b^{\*}$，来使训练样本平均损失最小：

$$
w_1^{\*},w_2^{\*},b=
\begin{gathered}
\operatorname*{arg\,min}_{w_1,w_2,b} \ell(w_1,w_2,b)
\end{gathered}.
$$

(3)优化算法
- 解析解(analytical solution)：当模型和损失函数较为简单时，上面的误差最小化问题的解可以直接用公式表达出来。
- 数值解：大多数深度学习模型并没有解析解，只能通过优化算法有限次迭代模型参数来尽可能降低损失函数的值。
- 小批量随机梯度下降(mini-batch stochastic gradient descent)：
①先选取一组模型参数的初始值，如随机选取；
②接下来对参数进行多次迭代，使每次迭代都可能降低损失函数的值。
③在每次迭代中，先随机均匀采样一个由固定数目训练样本所组成的小批量(mini-batch)$\mathcal{B}$，然后求小批量中数据样本的平均损失有关模型参数的导数（梯度），最后用此结果与预先设定的一个正数的乘积作为模型参数在本次迭代的减小量。

模型的每个参数将作如下迭代：
$$
w_1\leftarrow w_1 - \frac{\eta}{|\mathcal{B}|} \sum_{i\in\mathcal{B}}\frac{\partial\ell^{(i)}(w_1,w_2,b)}{\partial w_1} = w_1 - \frac{\eta}{|\mathcal{B}|}\sum_{i\in\mathcal{B}} x_1^{(i)}(x_1^{(i)}w_1+x_2^{(i)}w_2+b-y^{(i)}),
$$
$$
w_2\leftarrow w_2 - \frac{\eta}{|\mathcal{B}|} \sum_{i\in\mathcal{B}}\frac{\partial\ell^{(i)}(w_1,w_2,b)}{\partial w_2} = w_2 - \frac{\eta}{|\mathcal{B}|}\sum_{i\in\mathcal{B}} x_2^{(i)}(x_1^{(i)}w_1+x_2^{(i)}w_2+b-y^{(i)}),
$$
$$
b\leftarrow b - \frac{\eta}{|\mathcal{B}|} \sum_{i\in\mathcal{B}}\frac{\partial\ell^{(i)}(w_1,w_2,b)}{\partial b} = b - \frac{\eta}{|\mathcal{B}|}\sum_{i\in\mathcal{B}}(x_1^{(i)}w_1+x_2^{(i)}w_2+b-y^{(i)}).
$$

- $|\mathcal{B}|$代表每个小批量中的样本个数(批量大小，batch_size)，$\eta$称作学习率(learning rate)并取正数
- 批量大小和学习率是人为设定的，并不是通过模型训练学出的，因此称作超参数(hyperparameter)。
- 通常所说的“调参”指的正是调节超参数。
- 极少数情况下，超参数也可以通过模型训练学出。

**3.模型预测**
- 模型训练完成后，将模型参数$w_1,w_2,b$在优化算法停止时的值分别记作$\hat{w}_1,\hat{w}_2,\hat{b}$。
- 这里得到的并不一定是最小化损失函数的最优解$w_1^{\*},w_2^{\*},b^{\*}$，而是对最优解的一个近似。
- 训练后的线性回归模型$x_1\hat{w}_1+x_2\hat{w}_2+\hat{b}$来估算训练数据集以外任意一栋房屋面积（平方米）为$x_1$、房龄（年）为$x_2$的房屋的价格了。
### 表示方法

**1.神经网络图**

```flow
st=>start: Start|past:>http://www.google.com[blank]
e=>end: End:>http://www.google.com
op1=>operation: My Operation|past
op2=>operation: Stuff|current
sub1=>subroutine: My Subroutine|invalid
cond=>condition: Yes or No?|approved:>http://www.google.com
c2=>condition: Good idea|rejected
io=>inputoutput: Catch something...|request

st->op1(right)->cond
cond(yes, right)->c2
cond(no)->sub1(left)->op1
c2(yes)->io->e
c2(no)->op2->e
```
```flow
x1=>operation: x1|past
x2=>operation: x2|current
end=>end: o
x1->end
x2->end
```

**2.矢量计算表达式**

当数据样本数为$n$，特征数为$d$时，线性回归的矢量计算表达式为：
$$\hat{\pmb{y}}=\pmb{Xw}+b.$$

$$\hat{\pmb{y}}=
\begin{bmatrix}
\hat{y}^{(1)} \\\
\hat{y}^{(2)} \\\
\cdots \\\
\hat{y}^{(n)} \\\
\end{bmatrix},
\pmb{X}=
\begin{bmatrix}
x_1^{(1)} & x_2^{(1)} \\\
x_1^{(2)} & x_2^{(2)} \\\
\cdots & \cdots \\\\
x_1^{(n)} & x_2^{(n)} \\\
\end{bmatrix},
\pmb{w}=
\begin{bmatrix}
w_1 \\\
w_2 \\\
\end{bmatrix}.
$$

- 模型输出$\hat{y}\in\mathbb{R}^{n\times 1}$，批量数据样本特征$\pmb{X}\in\mathbb{R}^{n\times d}$，权重$\pmb{w}\in\mathbb{R}^{d\times 1}$，偏差$b\in\mathbb{R}$，批量样本数据标签$\pmb{y}\in\mathbb{R}^{n\times 1}$。

设模型参数$\theta={w_1,w_2,b}^{\top}$，重写损失函数：
$$\ell(\theta)=\frac{1}{2n}(\hat{y}-y)^{\top}(\hat{y}-y).$$
小批量随机梯度下降的迭代步骤将相应改写为：
$$\theta\leftarrow\theta-\frac{\eta}{|\mathcal{B}|}\sum_{i\in\mathcal{B}}\nabla_{\theta}(\theta)$$
其中梯度是损失有关3个标量的模型参数的偏导数组成的向量：
$$
\require{enclose}
\nabla_{\theta}\ell^{(i)}(\theta)=
\begin{bmatrix}
\frac{\partial\ell^{(i)}(w_1,w_2,b)}{\partial w_1} \\\
\frac{\partial\ell^{(i)}(w_1,w_2,b)}{\partial w_2} \\\
\frac{\partial\ell^{(i)}(w_1,w_2,b)}{\partial b}   \\\
\end{bmatrix}=
\enclose{horizontalstrike,updiagonalstrike}{
\begin{bmatrix}
x_1^{(i)}(x_1^{(i)}w_1+x_2^{(i)}w_2+b-y^{(i)}) \\\
x_2^{(i)}(x_1^{(i)}w_1+x_2^{(i)}w_2+b-y^{(i)}) \\\
x_1^{(i)}w_1+x_2^{(i)}w_2+b-y^{(i)}
\end{bmatrix}}=
\enclose{horizontalstrike,updiagonalstrike}{
\begin{bmatrix}
x_1^{(i)} \\\
x_2^{(i)} \\\
1         \\\
\end{bmatrix}
(\hat{y}^{(i)}-y^{(i)})
}.
$$

<font color=red>**上述等号后两个公式并非不正确，而是代码中自动求梯度实现非常简洁**</font>

**自动求梯度**
如下代码所示的模型$\pmb{y}=2\pmb{x}^{\top}\pmb{x}$，梯度结果为$\pmb{y}=4\pmb{x}$，在给关于$\pmb{x}$各分量求偏导（梯度）时，自动求梯度需要保存每个分量的偏导数（梯度），那么需要给各分量的偏导数分配空间，`x.attach_grad()`，而后自动求梯度`y.backward()`，$\pmb{y}$这里是模型函数计算结果，而各分量梯度的向量为`x.grad`，非常方便！！！
```Python
from mxnet import autograd, nd

x = [1, 2, 3, 4]
x = nd.array(x)
x = x.reshape((4, 1))
x.attach_grad()
with autograd.record():
    y = 2 * nd.dot(x.T, x)
y.backward()
print(x.grad)
```
```Python
Output:
[[ 4.]
 [ 8.]
 [12.]
 [16.]]
<NDArray 4x1 @cpu(0)>
```
注意，多维情况下，自动求和
```Python
from mxnet import autograd, nd

x = [[1, 2, 3, 4], [2, 3, 4, 5]]
w = [2, 3, 4, 5]
x = nd.array(x)
w = nd.array(w)
w = w.reshape((4, 1))
print(w)

w.attach_grad()
with autograd.record():
    y = nd.dot(x, w)
y.backward()
print(w.grad)
```
```Python
[[3.]
 [5.]
 [7.]
 [9.]]
<NDArray 4x1 @cpu(0)>
```
### 原生实现
```Python
from IPython import display
from matplotlib import pyplot as plt
from mxnet import autograd, nd
import random

# 生成数据集
# Generate dataset
num_inputs = 2
num_examples = 1000
true_w = [2, -3.4]
true_b = 4.2

features = nd.random.normal(scale=1, shape=(num_examples, num_inputs))
labels = true_w[0] * features[:, 0] + true_w[1] * features[:, 1] + true_b
labels += nd.random.normal(scale=0.01, shape=labels.shape)

# print("features", features)
# print("labels", labels)


# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


set_figsize()
plt.scatter(features[:, 1].asnumpy(), labels.asnumpy(), 1)
plt.show()


# 读取数据
# Read data iteratively
def data_iter(batch_size, features, labels):
    num_examples = len(features)
    indices = list(range(num_examples))
    random.shuffle(indices)
    for i in range(0, num_examples, batch_size):
        j = nd.array(indices[i: min(i + batch_size, num_examples)])
        # print(j)
        yield features.take(j), labels.take(j)


batch_size = 10
# for x, y in data_iter(batch_size, features, labels):
#     print(x, y)
#     break

# 初始化模型参数
# Initialize parameters of model
w = nd.random.normal(scale=0.01, shape=(num_inputs, 1))
b = nd.zeros(shape=(1,))

# print(w)
# print(b)

# 分配梯度空间
# Allocate gradient spaces
w.attach_grad()
b.attach_grad()


# 定义模型
# Define model
def linreg(x, w, b):
    result = nd.dot(x, w) + b
    # print("net:", result)
    return result


# 定义损失函数
# Define square loss function
def sqaured_loss(y_hat, y):
    result = (y_hat - y.reshape(y_hat.shape)) ** 2 / 2
    # print("loss:", result)
    return result


# 定义优化算法
# Define optimization algorithm
def sgd(params, lr, batch_size):
    for param in params:
        # print("param:", param)
        param[:] = param - lr * param.grad / batch_size


# 训练模型
# Train model
lr = 0.03  # Learning Rate
num_epochs = 3  # Iteration Epoch
net = linreg
loss = sqaured_loss

for epoch in range(num_epochs):
    for x, y in data_iter(batch_size, features, labels):
        with autograd.record():
            l = loss(net(x, w, b), y)   # 小批量损失 mini-batch loss
            # print("l:", l)
        l.backward()   # 小批量损失梯度   mini-batch loss gradient
        sgd([w, b], lr, batch_size)  # 小批量损失迭代参数 mini-batch loss iterative operation of parameters

    # 每个训练周期的损失 loss value per training epoch
    train_l = loss(net(features, w, b), labels)
    print("Epoch %d, loss %f" % (epoch + 1, train_l.mean().asnumpy()))


```
```Python
Output:
Epoch 1, loss 0.035008
Epoch 2, loss 0.000125
Epoch 3, loss 0.000049

Process finished with exit code 0
```
### MXNet简洁实现
```Python
from mxnet import autograd, nd
from mxnet.gluon import data as gdata
from mxnet.gluon import nn
from mxnet import init
from mxnet.gluon import loss as gloss
from mxnet import gluon

# 生成数据集
# Generate dataset
num_inputs = 2
num_examples = 1000
true_w = [2, 3.4]
true_b = 4.2
features = nd.random.normal(scale=1, shape=(num_examples, num_inputs))
labels = true_w[0] + features[:, 0] + true_w[1] * features[:, 1] + true_b
labels += nd.random.normal(scale=0.01, shape=labels.shape)

# 读取数据
# Read data
batch_size = 10
# 将训练数据的特征和标签组合
# Combine the features and labels of training data
dataset = gdata.ArrayDataset(features, labels)
print(dataset)
# 随机读取小批量
# Read randomly small bach data
data_iter = gdata.DataLoader(dataset, batch_size, shuffle=True)

# 定义模型
# Define model

# 模型变量
# Model variable
net = nn.Sequential()
# 定义输出层输出个数
# Define the number of outputs from the output layer
net.add(nn.Dense(1))

# 初始化模型参数
# Initailize moderl's parameters
# 通过init.Normal(sigma=0.01)指定权重参数每个元素将在初始化时随机采样于均值为0、标准差为0.01的正态分布。偏差参数默认会初始化为零。

net.initialize(init.Normal(sigma=0.01))

# 定义损失函数
# Define loss function
loss = gloss.L2Loss()  # 平方损失又称L2范数损失

# 定义优化算法
# Define optimization algorithm
trainer = gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': 0.03})

# 训练模型
# Train model
num_epochs = 3
for epoch in range(1, num_epochs + 1):
    for x, y in data_iter:
        with autograd.record():
            l = loss(net(x), y)
        l.backward()
        trainer.step(batch_size)
    l = loss(net(features), labels)
    print('epoch %d, loss: %f' % (epoch, l.mean().asnumpy()))

```
## 图像分类数据集(Fashion-MNIST)

### 获取数据集并显示
```Python
import d2lzh as d2l
from mxnet.gluon import data as gdata
import matplotlib.pyplot as plt
import sys
import time

# 获取训练集和测试集
# Get training set and test set
mnist_train = gdata.vision.FashionMNIST(train=True)
mnist_test = gdata.vision.FashionMNIST(train=False)

print(len(mnist_train), len(mnist_test))

# 获取单张图片特征以及标签
# Get the features and lable of one image
feature, label = mnist_train[0]
print(feature.shape, type(feature), feature.dtype)
print(label, type(label), label.dtype)


def get_fashion_mnist_labels(labels):
    text_labels = ['t-shirt',
                   'trouser',
                   'pullover',
                   'dress',
                   'coat',
                   'sandal',
                   'shirt',
                   'sneaker',
                   'bag',
                   'ankle boot']
    return [text_labels[int(i)] for i in labels]


def show_fashion_mnist(images, labels):
    d2l.use_svg_display()

    _, figs = plt.subplots(1, len(images), figsize=(12, 12))
    for f, img, lbl in zip(figs, images, labels):
        f.imshow(img.reshape((28, 28)).asnumpy())
        f.set_title(lbl)
        f.axes.get_xaxis().set_visible(False)
        f.axes.get_yaxis().set_visible(False)
    plt.show()


x, y = mnist_train[0:9]
show_fashion_mnist(x, get_fashion_mnist_labels(y))
```
### 读取小批量数据
```Python
from mxnet.gluon import data as gdata
import sys
import time

mnist_train = gdata.vision.FashionMNIST(train=True)
mnist_test = gdata.vision.FashionMNIST(train=False)

batch_size = 256
# ToTensor将图像数据从unit8格式变换成32位浮点数格式，并除以255使得所有像素的数值均在0到1之间。
# ToTensor还将图像通道的最后一维移动到最前一维来方便后面卷积神经网络计算
transformer = gdata.vision.transforms.ToTensor()
# Gluon的DataLoader中一个很方便的共鞥是允许使用多进程来加速数据读取
# 暂不支持Windows操作系统
# 通过参数num_workers来设置4个进程读取数据
if sys.platform.startswith('win'):
    num_workers = 0
else:
    num_workers = 4

train_iter = gdata.DataLoader(mnist_train.transform_first(transformer),
                              batch_size,
                              shuffle=True,
                              num_workers=num_workers)
test_iter = gdata.DataLoader(mnist_test.transform_first(transformer),
                             batch_size,
                             shuffle=True,
                             num_workers=num_workers)

# 查看读取一遍训练数据需要的时间
start = time.time()
for x, y in train_iter:
    continue

print("%.2f sec" % (time.time()-start))

```
## Softmax回归
### 原生实现
```Python
import d2lzh as d2l
from mxnet import autograd, nd
from mxnet.gluon import data as gdata
import sys

# 获取数据
mnist_train = gdata.vision.FashionMNIST(train=True)
mnist_test = gdata.vision.FashionMNIST(train=False)

batch_size = 256
# ToTensor将图像数据从unit8格式变换成32位浮点数格式，并除以255使得所有像素的数值均在0到1之间。
# ToTensor还将图像通道的最后一维移动到最前一维来方便后面卷积神经网络计算
transformer = gdata.vision.transforms.ToTensor()
# Gluon的DataLoader中一个很方便的共鞥是允许使用多进程来加速数据读取
# 暂不支持Windows操作系统
# 通过参数num_workers来设置4个进程读取数据
if sys.platform.startswith('win'):
    num_workers = 0
else:
    num_workers = 4

train_iter = gdata.DataLoader(mnist_train.transform_first(transformer),
                              batch_size,
                              shuffle=True,
                              num_workers=num_workers)
test_iter = gdata.DataLoader(mnist_test.transform_first(transformer),
                             batch_size,
                             shuffle=True,
                             num_workers=num_workers)

# 初始化模型参数
# 每个样本高宽均为28像素，模型特征向量长度28×28=784
# 图像有10个类别（标签），所以输出个数为10
num_inputs = 784
num_outputs = 10

W = nd.random.normal(scale=0.01, shape=(num_inputs, num_outputs))
b = nd.zeros(num_outputs)

W.attach_grad()
b.attach_grad()


# 定义模型
def softmax(X):
    X_exp = X.exp()
    partition = X_exp.sum(axis=1, keepdims=True)
    return X_exp / partition  # 广播机制


def net(X):
    return softmax(nd.dot(X.reshape((-1, num_inputs)), W) + b)


# 定义损失函数
def cross_entropy(y_hat, y):
    return -nd.pick(y_hat, y).log()


def accuracy(y_hat, y):
    return (y_hat.argmax(axis=1) == y.astype('float32')).mean().asscalar()


def evaluate_accuracy(data_iter, net):
    acc_sum, n = 0.0, 0
    for X, y in data_iter:
        y = y.astype('float32')
        acc_sum += (net(X).argmax(axis=1) == y).sum().asscalar()
        n += y.size
    return acc_sum / n


print(evaluate_accuracy(test_iter, net))

# 训练模型
num_epochs, lr = 5, 0.1


def train_ch3(net, train_iter, test_iter, loss, num_epochs, batch_size, params=None, lr=None, trainer=None):
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n = 0.0, 0.0, 0
        for X, y in train_iter:
            with autograd.record():
                y_hat = net(X)
                l = loss(y_hat, y).sum()
            l.backward()
            # 模型训练
            # 参数迭代
            if trainer is None:
                d2l.sgd(params, lr, batch_size)
            else:
                trainer.step(batch_size)
            y = y.astype('float32')
            train_l_sum += l.asscalar()
            train_acc_sum += (y_hat.argmax(axis=1) == y).sum().asscalar()
            n += y.size
            test_acc = evaluate_accuracy(test_iter, net)
            print('epoch %d, loss %.4f, train acc %.3f, test acc %.3f'
                  % (epoch + 1, train_l_sum / n, train_acc_sum / n, test_acc))


train_ch3(net, train_iter, test_iter, cross_entropy, num_epochs, batch_size, [W, b], lr)

```
```Python
Output:
...
epoch 5, loss 0.4891, train acc 0.834, test acc 0.843
epoch 5, loss 0.4893, train acc 0.834, test acc 0.832
epoch 5, loss 0.4894, train acc 0.834, test acc 0.836

Process finished with exit code 0
```
### 简洁实现
**注意：简洁实现中，并没有对y_hat进行softmax处理，仅在loss里进行了softmax处理**
```Python
import d2lzh as d2l
from mxnet import autograd, nd
from mxnet import gluon, init
from mxnet.gluon import data as gdata
from mxnet.gluon import loss as gloss, nn
import sys

# 获取数据
mnist_train = gdata.vision.FashionMNIST(train=True)
mnist_test = gdata.vision.FashionMNIST(train=False)

batch_size = 256
# ToTensor将图像数据从unit8格式变换成32位浮点数格式，并除以255使得所有像素的数值均在0到1之间。
# ToTensor还将图像通道的最后一维移动到最前一维来方便后面卷积神经网络计算
transformer = gdata.vision.transforms.ToTensor()
# Gluon的DataLoader中一个很方便的共鞥是允许使用多进程来加速数据读取
# 暂不支持Windows操作系统
# 通过参数num_workers来设置4个进程读取数据
if sys.platform.startswith('win'):
    num_workers = 0
else:
    num_workers = 4

train_iter = gdata.DataLoader(mnist_train.transform_first(transformer),
                              batch_size,
                              shuffle=True,
                              num_workers=num_workers)
test_iter = gdata.DataLoader(mnist_test.transform_first(transformer),
                             batch_size,
                             shuffle=True,
                             num_workers=num_workers)

# 定义和初始化模型
net = nn.Sequential()
net.add(nn.Dense(10))
net.initialize(init.Normal(sigma=0.01))

# Softmax和交叉熵损失函数
loss = gloss.SoftmaxCrossEntropyLoss()

# 定义优化算法
trainer = gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': 0.1})


# 训练模型
num_epochs = 5


def evaluate_accuracy(data_iter, net):
    acc_sum, n = 0.0, 0
    for X, y in data_iter:
        y = y.astype('float32')
        acc_sum += (net(X).argmax(axis=1) == y).sum().asscalar()
        n += y.size
    return acc_sum / n


def train_ch3(net, train_iter, test_iter, loss, num_epochs, batch_size, params=None, lr=None, trainer=None):
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n = 0.0, 0.0, 0
        for X, y in train_iter:
            with autograd.record():
                y_hat = net(X)
                l = loss(y_hat, y).sum()
            l.backward()
            # 模型训练
            # 参数迭代
            if trainer is None:
                d2l.sgd(params, lr, batch_size)
            else:
                trainer.step(batch_size)
            y = y.astype('float32')
            train_l_sum += l.asscalar()
            train_acc_sum += (y_hat.argmax(axis=1) == y).sum().asscalar()
            n += y.size
            test_acc = evaluate_accuracy(test_iter, net)
            print('epoch %d, loss %.4f, train acc %.3f, test acc %.3f'
                  % (epoch + 1, train_l_sum / n, train_acc_sum / n, test_acc))


train_ch3(net, train_iter, test_iter, loss, num_epochs, batch_size, None, None, trainer)

```

## 多层感知机

### 激活函数
```Python
from IPython import display
import matplotlib.pyplot as plt
from mxnet import autograd, nd


# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def xyplot(x_vals, y_vals, name):
    set_figsize(figsize=(5, 2.5))
    plt.plot(x_vals.asnumpy(), y_vals.asnumpy())
    plt.xlabel('x')
    plt.ylabel(name + '(x)')


x = nd.arange(-8.0, 8.0, 0.1)
x.attach_grad()

# ReLU函数
# with autograd.record():
#     y = x.relu()
# xyplot(x, y, 'relu')
# plt.show()
# y.backward()
# xyplot(x, x.grad, 'grad of relu')
# plt.show()

# Sigmoid函数
# with autograd.record():
#     y = x.sigmoid()
# xyplot(x, y, 'Sigmoid')
# plt.show()
# y.backward()
# xyplot(x, x.grad, 'grad of sigmoid')
# plt.show()

# tanh函数
with autograd.record():
    y = x.tanh()
xyplot(x, y, 'tanh')
y.backward()
xyplot(x, x.grad, 'grad of tanh')
plt.show()

```
### 原生实现
```Python
from mxnet import autograd, nd
from mxnet.gluon import loss as gloss, data as gdata
import sys

# 获取数据
mnist_train = gdata.vision.FashionMNIST(train=True)
mnist_test = gdata.vision.FashionMNIST(train=False)

batch_size = 256
# ToTensor将图像数据从unit8格式变换成32位浮点数格式，并除以255使得所有像素的数值均在0到1之间。
# ToTensor还将图像通道的最后一维移动到最前一维来方便后面卷积神经网络计算
transformer = gdata.vision.transforms.ToTensor()
# Gluon的DataLoader中一个很方便的共鞥是允许使用多进程来加速数据读取
# 暂不支持Windows操作系统
# 通过参数num_workers来设置4个进程读取数据
if sys.platform.startswith('win'):
    num_workers = 0
else:
    num_workers = 4

train_iter = gdata.DataLoader(mnist_train.transform_first(transformer),
                              batch_size,
                              shuffle=True,
                              num_workers=num_workers)
test_iter = gdata.DataLoader(mnist_test.transform_first(transformer),
                             batch_size,
                             shuffle=True,
                             num_workers=num_workers)

# 定义模型参数

num_inputs, num_outputs, num_hiddens = 784, 10, 256

W1 = nd.random.normal(scale=0.01, shape=(num_inputs, num_hiddens))
b1 = nd.zeros(num_hiddens)

W2 = nd.random.normal(scale=0.01, shape=(num_hiddens, num_outputs))
b2 = nd.zeros(num_outputs)

params = [W1, b1, W2, b2]
for param in params:
    param.attach_grad()


# 定义激活函数
def relu(X):
    return nd.maximum(X, 0)


# 定义模型
def net(X):
    X = X.reshape((-1, num_inputs))
    H = relu(nd.dot(X, W1) + b1)
    return nd.dot(H, W2) + b2


# 定义损失函数
loss = gloss.SoftmaxCrossEntropyLoss()


# 定义优化算法
# Define optimization algorithm
def sgd(params, lr, batch_size):
    for param in params:
        # print("param:", param)
        param[:] = param - lr * param.grad / batch_size


def evaluate_accuracy(data_iter, net):
    acc_sum, n = 0.0, 0
    for X, y in data_iter:
        y = y.astype('float32')
        acc_sum += (net(X).argmax(axis=1) == y).sum().asscalar()
        n += y.size
    return acc_sum / n


# 训练模型
num_epochs, lr = 5, 0.5


def train_ch3(net, train_iter, test_iter, loss, num_epochs, batch_size, params=None, lr=None, trainer=None):
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n = 0.0, 0.0, 0
        for X, y in train_iter:
            with autograd.record():
                y_hat = net(X)
                l = loss(y_hat, y).sum()
            l.backward()
            # 模型训练
            # 参数迭代
            if trainer is None:
                sgd(params, lr, batch_size)
            else:
                trainer.step(batch_size)
            y = y.astype('float32')
            train_l_sum += l.asscalar()
            train_acc_sum += (y_hat.argmax(axis=1) == y).sum().asscalar()
            n += y.size
            test_acc = evaluate_accuracy(test_iter, net)
            print('epoch %d, loss %.4f, train acc %.3f, test acc %.3f'
                  % (epoch + 1, train_l_sum / n, train_acc_sum / n, test_acc))


train_ch3(net, train_iter, test_iter, loss, num_epochs, batch_size, params, lr)

```
```Python
Output:
...
epoch 5, loss 0.3795, train acc 0.860, test acc 0.861
epoch 5, loss 0.3795, train acc 0.860, test acc 0.870
epoch 5, loss 0.3792, train acc 0.860, test acc 0.859
epoch 5, loss 0.3792, train acc 0.860, test acc 0.862
epoch 5, loss 0.3794, train acc 0.860, test acc 0.865

Process finished with exit code 0
```
### 简洁实现
```Python
from mxnet import autograd, nd, gluon, init
from mxnet.gluon import loss as gloss, data as gdata, nn
import sys

# 获取数据
mnist_train = gdata.vision.FashionMNIST(train=True)
mnist_test = gdata.vision.FashionMNIST(train=False)

batch_size = 256
# ToTensor将图像数据从unit8格式变换成32位浮点数格式，并除以255使得所有像素的数值均在0到1之间。
# ToTensor还将图像通道的最后一维移动到最前一维来方便后面卷积神经网络计算
transformer = gdata.vision.transforms.ToTensor()
# Gluon的DataLoader中一个很方便的共鞥是允许使用多进程来加速数据读取
# 暂不支持Windows操作系统
# 通过参数num_workers来设置4个进程读取数据
if sys.platform.startswith('win'):
    num_workers = 0
else:
    num_workers = 4

train_iter = gdata.DataLoader(mnist_train.transform_first(transformer),
                              batch_size,
                              shuffle=True,
                              num_workers=num_workers)
test_iter = gdata.DataLoader(mnist_test.transform_first(transformer),
                             batch_size,
                             shuffle=True,
                             num_workers=num_workers)

# 定义模型
net = nn.Sequential()
net.add(nn.Dense(256, activation='relu'), nn.Dense(10))
net.initialize(init.Normal(sigma=0.01))

# 定义损失函数
loss = gloss.SoftmaxCrossEntropyLoss()

trainer = gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': 0.5})

num_epochs = 5


# 定义优化算法
# Define optimization algorithm
def sgd(params, lr, batch_size):
    for param in params:
        # print("param:", param)
        param[:] = param - lr * param.grad / batch_size


def evaluate_accuracy(data_iter, net):
    acc_sum, n = 0.0, 0
    for X, y in data_iter:
        y = y.astype('float32')
        acc_sum += (net(X).argmax(axis=1) == y).sum().asscalar()
        n += y.size
    return acc_sum / n


def train_ch3(net, train_iter, test_iter, loss, num_epochs, batch_size, params=None, lr=None, trainer=None):
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n = 0.0, 0.0, 0
        for X, y in train_iter:
            with autograd.record():
                y_hat = net(X)
                l = loss(y_hat, y).sum()
            l.backward()
            # 模型训练
            # 参数迭代
            if trainer is None:
                sgd(params, lr, batch_size)
            else:
                trainer.step(batch_size)
            y = y.astype('float32')
            train_l_sum += l.asscalar()
            train_acc_sum += (y_hat.argmax(axis=1) == y).sum().asscalar()
            n += y.size
            test_acc = evaluate_accuracy(test_iter, net)
            print('epoch %d, loss %.4f, train acc %.3f, test acc %.3f'
                  % (epoch + 1, train_l_sum / n, train_acc_sum / n, test_acc))


train_ch3(net, train_iter, test_iter, loss, num_epochs, batch_size, None, None, trainer)
```
## 模型选择、欠拟合和过拟合

|类型|说明|
|:--:|:--:|
|训练集（train set）|用于模型模拟的数据样本|
|验证集（validation set）|模型训练过程中单独留出的样本集，它可以用于调整模型的超参数和用于对模型的能力进行初步评估|
|测试集（test set）|用来评估最终模型的泛化能力。但不能作为调参、选择特征等算法相关的选择依据|

```Python
from mxnet import autograd, gluon, nd
from mxnet.gluon import data as gdata, loss as gloss, nn
from IPython import display
import d2lzh as d2l
from matplotlib import pyplot as plt

# 生成数据集
n_train, n_test, true_w, true_b = 100, 100, [1.2, -3.4, 5.6], 5
features = nd.random.normal(shape=(n_train + n_test, 1))

# 交换数据集
train_features = features[n_train:]
test_features = features[:n_train]
features = nd.concatenate([train_features, test_features], axis=0)

poly_features = nd.concat(features,
                          nd.power(features, 2),
                          nd.power(features, 3))

labels = (true_w[0] * poly_features[:, 0]
          + true_w[1] * poly_features[:, 1]
          + true_w[2] * poly_features[:, 2]
          + true_b)

labels += nd.random.normal(scale=0.1, shape=labels.shape)

print(features)


# 定义、训练和测试模型
# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def semilogy(x_vals, y_vals, x_label, y_label, x2_vals=None, y2_vals=None,
             legend=None, figsize=(3.5, 2.5)):
    set_figsize(figsize)
    plt.xlabel(x_label)
    plt.ylabel(y_label)
    plt.semilogy(x_vals, y_vals)
    if x2_vals and y2_vals:
        plt.semilogy(x2_vals, y2_vals, linestyle=':')
        plt.legend(legend)
    plt.show()


num_epochs, loss = 100, gloss.L2Loss()


def fit_and_plot(train_features, test_features, train_labels, test_labels):
    net = nn.Sequential()
    net.add(nn.Dense(1))
    net.initialize()
    batch_size = min(10, train_labels.shape[0])
    train_iter = gdata.DataLoader(gdata.ArrayDataset(train_features, train_labels),
                                  batch_size,
                                  shuffle=True)
    trainer = gluon.Trainer(net.collect_params(),
                            'sgd',
                            {'learning_rate': 0.01})
    train_ls, test_ls = [], []

    for _ in range(num_epochs):
        for X, y in train_iter:
            with autograd.record():
                l = loss(net(X), y)
            l.backward()
            trainer.step(batch_size)
        train_ls.append(loss(net(train_features),
                             train_labels).mean().asscalar())
        test_ls.append(loss(net(test_features),
                            test_labels).mean().asscalar())
    print('final epoch: train loss', train_ls[-1], 'test loss', test_ls[-1])
    semilogy(range(1, num_epochs + 1), train_ls, 'epochs', 'loss',
             range(1, num_epochs + 1), test_ls, ['train', 'test'])
    print('weight', net[0].weight.data().asnumpy(),
          '\nbias:', net[0].bias.data().asnumpy())


# 正常
# fit_and_plot(poly_features[:n_train, :],
#              poly_features[n_train:, :],
#              labels[:n_train],
#              labels[n_train:])
# # 欠拟合
# fit_and_plot(features[:n_train, :],
#              features[n_train:, :],
#              labels[:n_train],
#              labels[n_train:])
# 过拟合
fit_and_plot(poly_features[:2, :],
             poly_features[:n_train, :],
             labels[:2],
             labels[:n_train])
```
## 权重衰减
### 原生实现
```Python
from IPython import display
from mxnet import autograd, gluon, init, nd
from mxnet.gluon import data as gdata, loss as gloss, nn
from matplotlib import pyplot as plt

n_train, n_test, num_inputs = 20, 100, 200
true_w, true_b = nd.ones((num_inputs, 1)) * 0.01, 0.05

features = nd.random.normal(shape=(n_train + n_test, num_inputs))
labels = nd.dot(features, true_w) + true_b
labels = nd.random.normal(scale=0.01, shape=labels.shape)
train_features, test_features = features[:n_train, :], features[n_train:, :]
train_labels, test_labels = labels[:n_train], labels[n_train:]


# 定义随机初始化模型参数的函数
# 为函数每个参数附上梯度
def init_params():
    w = nd.random.normal(scale=1, shape=(num_inputs, 1))
    b = nd.zeros(shape=(1,))
    w.attach_grad()
    b.attach_grad()
    return [w, b]


# 定义L2范数惩罚项
def l2_penalty(w):
    return (w ** 2).sum() / 2


# 定义模型
# Define model
def linreg(x, w, b):
    return nd.dot(x, w) + b


# 定义损失函数
# Define square loss function
def sqaured_loss(y_hat, y):
    return (y_hat - y.reshape(y_hat.shape)) ** 2 / 2


# 定义优化算法
# Define optimization algorithm
def sgd(params, lr, batch_size):
    for param in params:
        # print("param:", param)
        param[:] = param - lr * param.grad / batch_size


# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def semilogy(x_vals, y_vals, x_label, y_label, x2_vals=None, y2_vals=None,
             legend=None, figsize=(3.5, 2.5)):
    set_figsize(figsize)
    plt.xlabel(x_label)
    plt.ylabel(y_label)
    plt.semilogy(x_vals, y_vals)
    if x2_vals and y2_vals:
        plt.semilogy(x2_vals, y2_vals, linestyle=':')
        plt.legend(legend)
    plt.show()


# 定义训练和测试
batch_size, num_epochs, lr = 1, 100, 0.003
net, loss = linreg, sqaured_loss
train_iter = gdata.DataLoader(gdata.ArrayDataset(train_features,
                                                 train_labels),
                              batch_size,
                              shuffle=True)


def fit_and_plot(lambd):
    w, b = init_params()
    train_ls, test_ls = [], []
    for _ in range(num_epochs):
        for X, y in train_iter:
            with autograd.record():
                l = loss(net(X, w, b), y) + lambd * l2_penalty(w)
            l.backward()
            sgd([w, b], lr, batch_size)
        train_ls.append(loss(net(train_features, w, b),
                             train_labels).mean().asscalar())
        test_ls.append(loss(net(test_features, w, b),
                            test_labels).mean().asscalar())
    semilogy(range(1, num_epochs + 1), train_ls, 'epochs', 'loss',
             range(1, num_epochs + 1), test_ls, ['train', 'test'])
    print('L2 norm of w:', w.norm().asscalar())


# 过拟合
fit_and_plot(lambd=0)
# 权重衰减
fit_and_plot(lambd=3)

```
### 简洁实现
```Python
from IPython import display
from mxnet import autograd, gluon, init, nd
from mxnet.gluon import data as gdata, loss as gloss, nn
from matplotlib import pyplot as plt

n_train, n_test, num_inputs = 20, 100, 200
true_w, true_b = nd.ones((num_inputs, 1)) * 0.01, 0.05

features = nd.random.normal(shape=(n_train + n_test, num_inputs))
labels = nd.dot(features, true_w) + true_b
labels = nd.random.normal(scale=0.01, shape=labels.shape)
train_features, test_features = features[:n_train, :], features[n_train:, :]
train_labels, test_labels = labels[:n_train], labels[n_train:]


# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def semilogy(x_vals, y_vals, x_label, y_label, x2_vals=None, y2_vals=None,
             legend=None, figsize=(3.5, 2.5)):
    set_figsize(figsize)
    plt.xlabel(x_label)
    plt.ylabel(y_label)
    plt.semilogy(x_vals, y_vals)
    if x2_vals and y2_vals:
        plt.semilogy(x2_vals, y2_vals, linestyle=':')
        plt.legend(legend)
    plt.show()


# 定义训练和测试
batch_size, num_epochs, lr = 1, 100, 0.003
loss = gloss.L2Loss()
train_iter = gdata.DataLoader(gdata.ArrayDataset(train_features,
                                                 train_labels),
                              batch_size,
                              shuffle=True)


def fit_and_plot_gluon(wd):
    net = nn.Sequential()
    net.add(nn.Dense(1))
    net.initialize(init.Normal(sigma=1))
    # 对权重参数衰减。
    # 权重名称一般是以weight结尾
    trainer_w = gluon.Trainer(net.collect_params('.*weight'),
                              'sgd',
                              {'learning_rate': lr,
                               'wd': wd})
    # 不对偏差参数进行衰减。
    # 偏差名称一般是以bias结尾
    trainer_b = gluon.Trainer(net.collect_params('.*bias'),
                              'sgd',
                              {'learning_rate': lr})
    train_ls, test_ls = [], []
    for _ in range(num_epochs):
        for X, y in train_iter:
            with autograd.record():
                l = loss(net(X), y)
            l.backward()
            # 对两个Trainer实例分别调用step函数，从而分别更新权重和偏差
            trainer_w.step(batch_size)
            trainer_b.step(batch_size)
        train_ls.append(loss(net(train_features),
                             train_labels).mean().asscalar())
        test_ls.append(loss(net(test_features),
                            test_labels).mean().asscalar())
    semilogy(range(1, num_epochs + 1), train_ls, 'epochs', 'loss',
             range(1, num_epochs + 1), test_ls, ['train', 'test'])
    print('L2 norm of w:', net[0].weight.data().norm().asscalar())


# 过拟合
fit_and_plot_gluon(wd=0)
# 权重衰减
fit_and_plot_gluon(wd=3)

```
## 丢弃法
**疑问：
关于练习那题的疑问，如果改变输入形状就报错的话，那么之前的丢弃法岂不是丢弃只发生一次？即首次前向计算时，各层参数形状就定了，之后的每次小批量训练时参数形状就不变了，此时丢弃的隐藏单元就固定了。。。对吗？
哦，知道了，丢弃只是特征置0，而非改变输入形状**
### 原生实现
```Python
from mxnet import autograd, gluon, init, nd
from mxnet.gluon import data as gdata
from mxnet.gluon import loss as gloss, nn
import sys


def load_data_fashion_mnist(batch_size):
    mnist_train = gdata.vision.FashionMNIST(train=True)
    mnist_test = gdata.vision.FashionMNIST(train=False)

    # ToTensor将图像数据从unit8格式变换成32位浮点数格式，并除以255使得所有像素的数值均在0到1之间。
    # ToTensor还将图像通道的最后一维移动到最前一维来方便后面卷积神经网络计算
    transformer = gdata.vision.transforms.ToTensor()
    # Gluon的DataLoader中一个很方便的共鞥是允许使用多进程来加速数据读取
    # 暂不支持Windows操作系统
    # 通过参数num_workers来设置4个进程读取数据
    if sys.platform.startswith('win'):
        num_workers = 0
    else:
        num_workers = 4

    train_iter = gdata.DataLoader(mnist_train.transform_first(transformer),
                                  batch_size,
                                  shuffle=True,
                                  num_workers=num_workers)
    test_iter = gdata.DataLoader(mnist_test.transform_first(transformer),
                                 batch_size,
                                 shuffle=True,
                                 num_workers=num_workers)
    return train_iter, test_iter


def net(X):
    X = X.reshape((-1, num_inputs))
    H1 = (nd.dot(X, W1) + b1).relu()
    if autograd.is_training():      # 只在训练模型时使用丢弃发
        H1 = dropout(H1, drop_prob1)    # 在第一层全连接后添加丢弃层
    H2 = (nd.dot(H1, W2) + b2).relu()
    if autograd.is_training():
        H2 = dropout(H2, drop_prob2)    # 在第二层全连接后添加丢弃层
    return nd.dot(H2, W3) + b3


def dropout(X, drop_prob):
    assert 0 <= drop_prob <= 1
    keep_prob = 1 - drop_prob
    # 这种情况下把全部元素都丢弃
    if keep_prob == 0:
        return X.zeros_like()
    mask = nd.random.uniform(0, 1, X.shape) < keep_prob
    return mask * X / keep_prob


# 定义优化算法
# Define optimization algorithm
def sgd(params, lr, batch_size):
    for param in params:
        param[:] = param - lr * param.grad / batch_size


def evaluate_accuracy(data_iter, net):
    acc_sum, n = 0.0, 0
    for X, y in data_iter:
        y = y.astype('float32')
        acc_sum += (net(X).argmax(axis=1) == y).sum().asscalar()
        n += y.size
    return acc_sum / n


def train_ch3(net, train_iter, test_iter, loss, num_epochs, batch_size, params=None, lr=None, trainer=None):
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n = 0.0, 0.0, 0
        for X, y in train_iter:
            with autograd.record():
                y_hat = net(X)
                l = loss(y_hat, y).sum()
            l.backward()
            # 模型训练
            # 参数迭代
            if trainer is None:
                sgd(params, lr, batch_size)
            else:
                trainer.step(batch_size)
            y = y.astype('float32')
            train_l_sum += l.asscalar()
            train_acc_sum += (y_hat.argmax(axis=1) == y).sum().asscalar()
            n += y.size
            test_acc = evaluate_accuracy(test_iter, net)
            print('epoch %d, loss %.4f, train acc %.3f, test acc %.3f'
                  % (epoch + 1, train_l_sum / n, train_acc_sum / n, test_acc))


# 定义模型参数
num_inputs, num_outputs, num_hiddens1, num_hiddens2 = 784, 10, 256, 256

W1 = nd.random.normal(scale=0.01, shape=(num_inputs, num_hiddens1))
b1 = nd.zeros(num_hiddens1)
W2 = nd.random.normal(scale=0.01, shape=(num_hiddens1,num_hiddens2))
b2 = nd.zeros(num_hiddens2)
W3 = nd.random.normal(scale=0.01, shape=(num_hiddens2, num_outputs))
b3 = nd.zeros(num_outputs)

params = [W1, b1, W2, b2, W3, b3]
for param in params:
    param.attach_grad()
drop_prob1, drop_prob2 = 0.2, 0.5

num_epochs, lr, batch_size = 5, 0.5, 256
loss = gloss.SoftmaxCrossEntropyLoss()
train_iter, test_iter = load_data_fashion_mnist(batch_size)
train_ch3(net, train_iter, test_iter, loss, num_epochs, batch_size, params, lr)

```
```Python
Outputs with dropout:
epoch 1, loss 1.1794, train acc 0.541, test acc 0.762
epoch 2, loss 0.5942, train acc 0.777, test acc 0.837
epoch 3, loss 0.4970, train acc 0.819, test acc 0.846
epoch 4, loss 0.4566, train acc 0.834, test acc 0.863
epoch 5, loss 0.4271, train acc 0.842, test acc 0.859
Outputs without dropout:
epoch 1, loss 1.1357, train acc 0.558, test acc 0.727
epoch 2, loss 0.5527, train acc 0.792, test acc 0.820
epoch 3, loss 0.4517, train acc 0.832, test acc 0.830
epoch 4, loss 0.4156, train acc 0.846, test acc 0.868
epoch 5, loss 0.3835, train acc 0.858, test acc 0.870
Outputs by exchanging the rates:
epoch 1, loss 1.1832, train acc 0.531, test acc 0.760
epoch 2, loss 0.5571, train acc 0.789, test acc 0.824
epoch 3, loss 0.4640, train acc 0.828, test acc 0.856
epoch 4, loss 0.4158, train acc 0.845, test acc 0.864
epoch 5, loss 0.3902, train acc 0.855, test acc 0.867
```
### 简洁实现
```Python
from mxnet import autograd, gluon, init, nd
from mxnet.gluon import data as gdata
from mxnet.gluon import loss as gloss, nn
import sys


def load_data_fashion_mnist(batch_size):
    mnist_train = gdata.vision.FashionMNIST(train=True)
    mnist_test = gdata.vision.FashionMNIST(train=False)

    # ToTensor将图像数据从unit8格式变换成32位浮点数格式，并除以255使得所有像素的数值均在0到1之间。
    # ToTensor还将图像通道的最后一维移动到最前一维来方便后面卷积神经网络计算
    transformer = gdata.vision.transforms.ToTensor()
    # Gluon的DataLoader中一个很方便的共鞥是允许使用多进程来加速数据读取
    # 暂不支持Windows操作系统
    # 通过参数num_workers来设置4个进程读取数据
    if sys.platform.startswith('win'):
        num_workers = 0
    else:
        num_workers = 4

    train_iter = gdata.DataLoader(mnist_train.transform_first(transformer),
                                  batch_size,
                                  shuffle=True,
                                  num_workers=num_workers)
    test_iter = gdata.DataLoader(mnist_test.transform_first(transformer),
                                 batch_size,
                                 shuffle=True,
                                 num_workers=num_workers)
    return train_iter, test_iter


# 定义优化算法
# Define optimization algorithm
def sgd(params, lr, batch_size):
    for param in params:
        param[:] = param - lr * param.grad / batch_size


def evaluate_accuracy(data_iter, net):
    acc_sum, n = 0.0, 0
    for X, y in data_iter:
        y = y.astype('float32')
        acc_sum += (net(X).argmax(axis=1) == y).sum().asscalar()
        n += y.size
    return acc_sum / n


def train_ch3(net, train_iter, test_iter, loss, num_epochs, batch_size, params=None, lr=None, trainer=None):
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n = 0.0, 0.0, 0
        for X, y in train_iter:
            with autograd.record():
                y_hat = net(X)
                l = loss(y_hat, y).sum()
            l.backward()
            # 模型训练
            # 参数迭代
            if trainer is None:
                sgd(params, lr, batch_size)
            else:
                trainer.step(batch_size)
            y = y.astype('float32')
            train_l_sum += l.asscalar()
            train_acc_sum += (y_hat.argmax(axis=1) == y).sum().asscalar()
            n += y.size
            test_acc = evaluate_accuracy(test_iter, net)
            print('epoch %d, loss %.4f, train acc %.3f, test acc %.3f'
                  % (epoch + 1, train_l_sum / n, train_acc_sum / n, test_acc))


# 定义模型参数
drop_prob1, drop_prob2 = 0.2, 0.5

num_epochs, lr, batch_size = 5, 0.5, 256
loss = gloss.SoftmaxCrossEntropyLoss()
train_iter, test_iter = load_data_fashion_mnist(batch_size)

net = nn.Sequential()
net.add(nn.Dense(256, activation='relu'),
        nn.Dropout(drop_prob1),
        nn.Dense(256, activation='relu'),
        nn.Dropout(drop_prob2),
        nn.Dense(10))
net.initialize(init.Normal(sigma=0.01))
trainer = gluon.Trainer(net.collect_params(),
                        'sgd',
                        {'learning_rate': lr})
train_ch3(net, train_iter, test_iter, loss, num_epochs, batch_size, None, None, trainer)

```
## 正向传播、反向传播和计算图

|类型|说明|
|:--:|:--:|
|正向传播<br>(forward propagation)|对神经网络沿着从输入层到输出层的顺序，<br>依次计算并存储模型中的中间变量（包括输出）|
|反向传播<br>(back propagation)|计算神经网络参数梯度的方法。<br>依据微积分中的链式法则，沿着从输出层到输入层的顺序，<br>依次计算并存储目标函数有骨感神经网络各层的中间变量以及参数的梯度。|
## 数值稳定性和模型初始化

- 当神经网络的层数较多时，模型的数值稳定性容易变差。**典型问题是衰减(vanishing)和爆炸(explosion)**
## 实战：房价预测
```Python
from mxnet import autograd, gluon, init, nd
from mxnet.gluon import data as gdata, loss as gloss, nn
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from IPython import display

train_data = pd.read_csv('C:/Users/Louris/Desktop/d2l-zh/data/train.csv')
test_data = pd.read_csv('C:/Users/Louris/Desktop/d2l-zh/data/test.csv')

all_features = pd.concat((train_data.iloc[:, 1:-1], test_data.iloc[:, 1:]))

numeric_features = all_features.dtypes[all_features.dtypes != 'object'].index
all_features[numeric_features] = all_features[numeric_features].apply(
    lambda x: (x - x.mean()) / (x.std())
)

all_features[numeric_features] = all_features[numeric_features].fillna(0)

# dummpy_na=True将缺失值也当作合法的特征值并为其创建指示特征
all_features = pd.get_dummies(all_features, dummy_na=True)

n_train = train_data.shape[0]
train_features = nd.array(all_features[:n_train].values)
test_features = nd.array(all_features[n_train:].values)
train_labels = nd.array(train_data.SalePrice.values).reshape((-1, 1))

loss = gloss.L2Loss()


def get_net():
    net = nn.Sequential()
    net.add(nn.Dense(1))
    net.initialize()
    return net


def log_rmse(net, features, labels):
    # 将小于1的值设立成1，使得取对数时数值更稳定
    clipped_preds = nd.clip(net(features), 1, float('inf'))
    rmse = nd.sqrt(2 * loss(clipped_preds.log(), labels.log()).mean())
    return rmse.asscalar()


def train(net, train_features, train_labels, test_features, test_labels,
          num_epochs, learning_rate, weight_decay, batch_size):
    train_ls, test_ls = [], []
    train_iter = gdata.DataLoader(gdata.ArrayDataset(train_features, train_labels),
                                  batch_size,
                                  shuffle=True)
    # 使用Adam优化算法
    trainer = gluon.Trainer(net.collect_params(),
                            'adam',
                            {'learning_rate': learning_rate,
                             'wd': weight_decay})
    for epoch in range(num_epochs):
        for X, y in train_iter:
            with autograd.record():
                l = loss(net(X), y)
            l.backward()
            trainer.step(batch_size)
        train_ls.append(log_rmse(net, train_features, train_labels))
        if test_labels is not None:
            test_ls.append(log_rmse(net, test_features, test_labels))
    return train_ls, test_ls


def get_k_fold_date(k, i, X, y):
    assert k > 1
    fold_size = X.shape[0] // k
    X_train, y_train = None, None
    for j in range(k):
        idx = slice(j * fold_size, (j + 1) * fold_size)
        X_part, y_part = X[idx, :], y[idx]
        if j == i:
            X_valid, y_valid = X_part, y_part
        elif X_train is None:
            X_train, y_train = X_part, y_part
        else:
            X_train = nd.concat(X_train, X_part, dim=0)
            y_train = nd.concat(y_train, y_part, dim=0)
    return X_train, y_train, X_valid, y_valid


# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def semilogy(x_vals, y_vals, x_label, y_label, x2_vals=None, y2_vals=None,
             legend=None, figsize=(3.5, 2.5)):
    set_figsize(figsize)
    plt.xlabel(x_label)
    plt.ylabel(y_label)
    plt.semilogy(x_vals, y_vals)
    if x2_vals and y2_vals:
        plt.semilogy(x2_vals, y2_vals, linestyle=':')
        plt.legend(legend)
    plt.show()


def k_fold(k, X_train, y_train, num_epochs, learning_rate, weight_decay, batch_size):
    train_l_sum, valid_l_sum = 0, 0
    for i in range(k):
        data = get_k_fold_date(k, i, X_train, y_train)
        net = get_net()
        train_ls, valid_ls = train(net, *data, num_epochs, learning_rate, weight_decay, batch_size)
        train_l_sum += train_ls[-1]
        valid_l_sum += valid_ls[-1]
        if i == 0:
            semilogy(range(1, num_epochs + 1), train_ls, 'epochs', 'rmse',
                     range(1, num_epochs + 1), valid_ls,
                     ['train', 'valid'])
        print('fold %d, train rmse %f, valid rmse %f' % (i, train_ls[-1], valid_ls[-1]))
    return train_l_sum / k, valid_l_sum / k


k, num_epochs, lr, weight_decay, batch_size = 5, 100, 5, 0, 64
train_l, valid_l = k_fold(k, train_features, train_labels, num_epochs, lr, weight_decay, batch_size)
print('%d-fold validation: avg train rmse %f, avg valid rmse %f' % (k, train_l, valid_l))


def train_and_pred(train_features, test_features, train_labels, test_data,
                   num_epochs, lr, weight_decay, batch_size):
    net = get_net()
    train_ls, _ = train(net, train_features, train_labels, None, None,
                        num_epochs, lr, weight_decay, batch_size)
    semilogy(range(1, num_epochs + 1), train_ls, 'epochs', 'rmse')
    print('train rmse %f' % train_ls[-1])
    preds = net(test_features).asnumpy()
    test_data['SalePrice'] = pd.Series(preds.reshape(1, -1)[0])
    submission = pd.concat([test_data['Id'], test_data['SalePrice']], axis=1)
    submission.to_csv('submission.csv', index=False)


train_and_pred(train_features, test_features, train_labels, test_data,
               num_epochs, lr, weight_decay, batch_size)

```
```Python
Outputs:
fold 0, train rmse 0.169721, valid rmse 0.156991
fold 1, train rmse 0.162148, valid rmse 0.189789
fold 2, train rmse 0.163688, valid rmse 0.168196
fold 3, train rmse 0.167601, valid rmse 0.154646
fold 4, train rmse 0.162926, valid rmse 0.183022
5-fold validation: avg train rmse 0.165217, avg valid rmse 0.170529
train rmse 0.162530
```
> # 深度学习计算

## 模型构造
### 继承自Block类构造多层感知机
```Python
from mxnet import nd
from mxnet.gluon import nn


class MLP(nn.Block):
    # 声明带有模型参数的层，这里声明了两个全连接层
    def __init__(self, **kwargs):
        # 调用MLP父类Block的构造函数来进行必要的初始化。
        # 这样在构造实例时，还可以指定其他函数参数。
        super(MLP, self).__init__(**kwargs)
        # 隐藏层
        self.hidden = nn.Dense(256, activation='relu')
        # 输出层
        self.output = nn.Dense(10)

    # 定义模型的前向计算，即如何根据输入x计算返回所需要的模型输出
    def forward(self, x):
        return self.output(self.hidden(x))


X = nd.random.uniform(shape=(2, 20))
net = MLP()
net.initialize()
# 调用MLP继承的Block类的__call__函数，其会调用forward函数进行计算
print(net(X))

```
### Sequential类继承自Block类
```Python
from mxnet import nd
from mxnet.gluon import nn


class MySequential(nn.Block):
    def __init__(self, **kwargs):
        super(MySequential,self).__init__(**kwargs)

    def add(self, block):
        # block是一个Block子类实例，假设它由一个独一无二的名字。
        # 将它保存在Block类的成员变量_children里，其类型是OrderedDict。
        # 当MySeuential实例调用initialize函数时，系统自动对_children里所有成员初始化
        self._children[block.name] = block

    def forward(self, x):
        # OrderedDict保证会按照成员添加时的顺序遍历成员
        for block in self._children.values():
            x = block(x)
        return x


X = nd.random.uniform(shape=(2, 20))
net = MySequential()
net.add(nn.Dense(256, activation='relu'))
net.add(nn.Dense(10))
net.initialize()
print(net(X))

```
### 复杂模型
```Python
from mxnet import nd
from mxnet.gluon import nn


class FancyMLP(nn.Block):
    def __init__(self, **kwargs):
        super(FancyMLP, self).__init__(**kwargs)
        # 使用get_constant创建的随机权重参数不会在训练中被迭代（即常数参数）
        self.rand_weight = self.params.get_constant(
            'rand_weight',
            nd.random.uniform(shape=(20, 20)))
        self.dense = nn.Dense(20, activation='relu')

    def forward(self, x):
        x = self.dense(x)
        # 使用创建的常数参数，以及NDArray的relu函数和dot函数
        x = nd.relu(nd.dot(x, self.rand_weight.data()) + 1)
        # 复用全连接层，等价于两个全连接层共享参数
        x = self.dense(x)
        # 控制流，需要调用asscalar函数返回标量进行比较
        while x.norm().asscalar() > 1:
            x /= 2
        if x.norm().asscalar() < 0.8:
            x *= 10
        return x.sum()


X = nd.random.uniform(shape=(2, 20))
net = FancyMLP()
net.initialize()
print(net(X))

```
```Python
from mxnet import nd
from mxnet.gluon import nn


class FancyMLP(nn.Block):
    def __init__(self, **kwargs):
        super(FancyMLP, self).__init__(**kwargs)
        # 使用get_constant创建的随机权重参数不会在训练中被迭代（即常数参数）
        self.rand_weight = self.params.get_constant(
            'rand_weight',
            nd.random.uniform(shape=(20, 20)))
        self.dense = nn.Dense(20, activation='relu')

    def forward(self, x):
        x = self.dense(x)
        # 使用创建的常数参数，以及NDArray的relu函数和dot函数
        x = nd.relu(nd.dot(x, self.rand_weight.data()) + 1)
        # 复用全连接层，等价于两个全连接层共享参数
        x = self.dense(x)
        # 控制流，需要调用asscalar函数返回标量进行比较
        while x.norm().asscalar() > 1:
            x /= 2
        if x.norm().asscalar() < 0.8:
            x *= 10
        return x.sum()


class NestMLP(nn.Block):
    def __init__(self, **kwargs):
        super(NestMLP, self).__init__(**kwargs)
        self.net = nn.Sequential()
        self.net.add(nn.Dense(64, activation='relu'),
                     nn.Dense(32, activation='relu'))
        self.dense = nn.Dense(16, activation='relu')

    def forward(self, x):
        return self.dense(self.net(x))


X = nd.random.uniform(shape=(2, 20))
net = nn.Sequential()
net.add(NestMLP(), nn.Dense(20), FancyMLP())
net.initialize()
print(net(X))

```
## 模型参数的访问、初始化和共享
### 访问模型参数
```Python
from mxnet import nd
from mxnet.gluon import nn

net = nn.Sequential()
net.add(nn.Dense(256, activation='relu'))
net.add(nn.Dense(10))
net.initialize()

X = nd.random.uniform(shape=(2, 20))
Y = net(X)

print('net0 (0 layer): \n params:\n', net[0].params, '\n params type:\n', type(net[0].params))

print('dense0_weight:\n', net[0].params['dense0_weight'], '\n weight:\n', net[0].weight)

print('weight data:\n', net[0].weight.data())

print('weight grad:\n', net[0].weight.grad())

print('dense0:\n', net[0])

print('net1 (1 layer): \n params:\n', net[1].params)

print('bias data:\n', net[1].bias.data())

print('net all params:\n', net.collect_params())

print('Normalization:\n', net.collect_params('.*weight'))

```
```Python
Output:
net0 (0 layer):
params:
 dense0_ (
  Parameter dense0_weight (shape=(256, 20), dtype=float32)
  Parameter dense0_bias (shape=(256,), dtype=float32)
)

params type:
 <class 'mxnet.gluon.parameter.ParameterDict'>

dense0_weight:
 Parameter dense0_weight (shape=(256, 20), dtype=float32)

weight:
 Parameter dense0_weight (shape=(256, 20), dtype=float32)

weight data:
[[ 0.06700657 -0.00369488  0.0418822  ... -0.05517294 -0.01194733
  -0.00369594]
 [-0.03296221 -0.04391347  0.03839272 ...  0.05636378  0.02545484
  -0.007007  ]
 [-0.0196689   0.01582889 -0.00881553 ...  0.01509629 -0.01908049
  -0.02449339]
 ...
 [ 0.00010955  0.0439323  -0.04911506 ...  0.06975312  0.0449558
  -0.03283203]
 [ 0.04106557  0.05671307 -0.00066976 ...  0.06387014 -0.01292654
   0.00974177]
 [ 0.00297424 -0.0281784  -0.06881659 ... -0.04047417  0.00457048
   0.05696651]]
<NDArray 256x20 @cpu(0)>

weight grad:
[[0. 0. 0. ... 0. 0. 0.]
 [0. 0. 0. ... 0. 0. 0.]
 [0. 0. 0. ... 0. 0. 0.]
 ...
 [0. 0. 0. ... 0. 0. 0.]
 [0. 0. 0. ... 0. 0. 0.]
 [0. 0. 0. ... 0. 0. 0.]]
<NDArray 256x20 @cpu(0)>

dense0:
 Dense(20 -> 256, Activation(relu))

net1 (1 layer):
params:
 dense1_ (
  Parameter dense1_weight (shape=(10, 256), dtype=float32)
  Parameter dense1_bias (shape=(10,), dtype=float32)
)

bias data:
[0. 0. 0. 0. 0. 0. 0. 0. 0. 0.]
<NDArray 10 @cpu(0)>

net all params:
sequential0_ (
  Parameter dense0_weight (shape=(256, 20), dtype=float32)
  Parameter dense0_bias (shape=(256,), dtype=float32)
  Parameter dense1_weight (shape=(10, 256), dtype=float32)
  Parameter dense1_bias (shape=(10,), dtype=float32)
)

Normalization:
 sequential0_ (
  Parameter dense0_weight (shape=(256, 20), dtype=float32)
  Parameter dense1_weight (shape=(10, 256), dtype=float32)
)
```
### 参数初始化
```Python
from mxnet import nd,init
from mxnet.gluon import nn

net = nn.Sequential()
net.add(nn.Dense(256, activation='relu'))
net.add(nn.Dense(10))
net.initialize()

X = nd.random.uniform(shape=(2, 20))
Y = net(X)

print(net[0].weight.data()[0])

# 非首次对模型初始化需要制定force_init为真
net.initialize(init=init.Normal(sigma=0.01), force_reinit=True)
print(net[0].weight.data()[0])

# 常数初始化权重参数
net.initialize(init=init.Constant(1), force_reinit=True)
print(net[0].weight.data()[0])

# 对权重参数进行Xavier随机初始化
net[0].weight.initialize(init=init.Xavier(), force_reinit=True)
print(net[0].weight.data()[0])

```
```Python
[ 0.06700657 -0.00369488  0.0418822   0.0421275  -0.00539289  0.00286685
  0.03927409  0.02504314 -0.05344158  0.03088857  0.01958894  0.01148278
 -0.04993054  0.00523225  0.06225365  0.03620619  0.00305876 -0.05517294
 -0.01194733 -0.00369594]
<NDArray 20 @cpu(0)>

[ 0.00195949 -0.0173764   0.00047347  0.00145809  0.00326049  0.00457878
 -0.00894258  0.00493839 -0.00904343 -0.01214079  0.02156406  0.01093822
  0.01827143 -0.0104467   0.01006219  0.0051742  -0.00806932  0.01376901
  0.00205885  0.00994352]
<NDArray 20 @cpu(0)>

[1. 1. 1. 1. 1. 1. 1. 1. 1. 1. 1. 1. 1. 1. 1. 1. 1. 1. 1. 1.]
<NDArray 20 @cpu(0)>

[ 0.00512482 -0.06579044 -0.10849719 -0.09586414  0.06394844  0.06029618
 -0.03065033 -0.01086642  0.01929168  0.1003869  -0.09339568 -0.08703034
 -0.10472868 -0.09879824 -0.00352201 -0.11063069 -0.04257748  0.06548801
  0.12987629 -0.13846186]
<NDArray 20 @cpu(0)>
```
### 自定义初始化方法
```Python
from mxnet import nd, init
from mxnet.gluon import nn

net = nn.Sequential()
net.add(nn.Dense(256, activation='relu'))
net.add(nn.Dense(10))
net.initialize()

X = nd.random.uniform(shape=(2, 20))
Y = net(X)


class MyInit(init.Initializer):
    def _init_weight(self, name, arr):
        print('Init:', name, arr.shape)
        arr[:] = nd.random.uniform(low=-10, high=10, shape=arr.shape)
        arr *= arr.abs() >= 5


net.initialize(init=MyInit(), force_reinit=True)
print(net[0].weight.data()[0])

net[0].weight.set_data(net[0].weight.data() + 1)
print(net[0].weight.data()[0])

```
```Python
Outputs:
Init: dense0_weight (256, 20)
Init: dense1_weight (10, 256)

[ 0.         7.3020515 -0.         0.         0.         8.334459
 -8.12119    8.423153   0.        -8.33775    8.585924  -0.
 -0.        -9.812866   0.         6.846842  -7.3640428  0.
  0.         6.8277225]
<NDArray 20 @cpu(0)>

[ 1.         8.302052   1.         1.         1.         9.334459
 -7.12119    9.423153   1.        -7.3377504  9.585924   1.
  1.        -8.812866   1.         7.846842  -6.3640428  1.
  1.         7.8277225]
<NDArray 20 @cpu(0)>
```
### 共享模型参数
```Python
from mxnet import nd, init
from mxnet.gluon import nn

net = nn.Sequential()
shared = nn.Dense(8, activation='relu')
net.add(nn.Dense(8, activation='relu'),
        shared,
        nn.Dense(8, activation='relu', params=shared.params),
        nn.Dense(10))
net.initialize()
X = nd.random.uniform(shape=(2, 20))
net(X)

print(net[1].weight.data() == net[2].weight.data())
print(net[1].bias.data() == net[2].bias.data())

```
```Python
[[1. 1. 1. 1. 1. 1. 1. 1.]
 [1. 1. 1. 1. 1. 1. 1. 1.]
 [1. 1. 1. 1. 1. 1. 1. 1.]
 [1. 1. 1. 1. 1. 1. 1. 1.]
 [1. 1. 1. 1. 1. 1. 1. 1.]
 [1. 1. 1. 1. 1. 1. 1. 1.]
 [1. 1. 1. 1. 1. 1. 1. 1.]
 [1. 1. 1. 1. 1. 1. 1. 1.]]
<NDArray 8x8 @cpu(0)>

[1. 1. 1. 1. 1. 1. 1. 1.]
<NDArray 8 @cpu(0)>
```
## 模型参数的延后初始化
```Python
from mxnet import nd, init
from mxnet.gluon import nn


class MyInit(init.Initializer):
    def _init_weight(self, name, arr):
        print('Init:', name, arr.shape)


net = nn.Sequential()
net.add(nn.Dense(256, activation='relu'),
        nn.Dense(10))
net.initialize(init=MyInit())
# 未进行前向计算的模型参数
print(net.collect_params())
X = nd.random.uniform(shape=(2, 20))
Y = net(X)
# 进行前向计算后的模型参数
print(net.collect_params())
# 前向计算后，再次初始化则已知模型参数形状，避免延后初始化
net.initialize(init=MyInit(), force_reinit=True)

```
```Python
from mxnet import nd, init
from mxnet.gluon import nn


class MyInit(init.Initializer):
    def _init_weight(self, name, arr):
        print('Init:', name, arr.shape)


net = nn.Sequential()
# 创建层时，指定输入个数，避免延后初始化
net. add(nn.Dense(256, in_units=20, activation='relu'),
         nn.Dense(10, in_units=256))
net.initialize(init=MyInit())

```
## 自定义层
### 不含模型参数的自定义层
```Python
from mxnet import nd, init
from mxnet.gluon import nn


class CenteredLayer(nn.Block):
    def __init__(self, **kwargs):
        super(CenteredLayer, self).__init__(**kwargs)

    def forward(self, x):
        return x - x.mean()


layer = CenteredLayer()
X = layer(nd.array([1, 2, 3, 4, 5]))
print(X)

net = nn.Sequential()
net.add(nn.Dense(128),
        CenteredLayer())
net.initialize()
y = net(nd.random.uniform(shape=(4, 8)))
print(y.mean().asscalar())

```
```Python
Outputs:
[-2. -1.  0.  1.  2.]
<NDArray 5 @cpu(0)>
-9.367795e-10
```
### 含模型参数的自定义层
```Python
from mxnet import nd, init, gluon
from mxnet.gluon import nn


# params = gluon.ParameterDict()
# params.get('param2', shape=(2, 3))
# print(params)


class MyDense(nn.Block):
    # units为该层的输出个数，in_units为该层的输入个数
    def __init__(self, units, in_units, **kwargs):
        super(MyDense, self).__init__(**kwargs)
        self.weight = self.params.get('weight', shape=(in_units, units))
        self.bias = self.params.get('bias', shape=(units,))

    def forward(self, x):

        linear = nd.dot(x, self.weight.data()) + self.bias.data()
        print(linear)
        return nd.relu(linear)


dense = MyDense(units=3, in_units=5)
print(dense.params)
# 自定义层直接前向计算
dense.initialize()
y = dense(nd.random.uniform(shape=(2, 5)))
print(y)

net = nn.Sequential()
net.add(MyDense(8, in_units=64),
        MyDense(1, in_units=8))
net.initialize()
z = net(nd.random.uniform(shape=(2, 64)))
print(z)

```
## 读取与存储
### 读取NDArray
```Python
from mxnet import nd, init, gluon
from mxnet.gluon import nn

x = nd.ones(3)
nd.save('x', x)

x2 = nd.load('x')
print(x2)

y = nd.zeros(4)
nd.save('xy', [x, y])
x2, y2 = nd.load('xy')
print(x2, y2)

myDict = {'x': x, 'y': y}
nd.save('myDict', myDict)
myDict2 = nd.load('myDict')
print(myDict2)

```
### 读写Gluon模型的参数
```Python
from mxnet import nd, init, gluon
from mxnet.gluon import nn


class MLP(nn.Block):
    def __init__(self, **kwargs):
        super(MLP, self).__init__(**kwargs)
        self.hidden = nn.Dense(256, activation='relu')
        self.output = nn.Dense(10)

    def forward(self, x):
        return self.output(self.hidden(x))


net = MLP()
net.initialize()
X = nd.random.uniform(shape=(2, 20))
Y = net(X)

filename = 'mlp.params'
net.save_parameters(filename)

net2 = MLP()
net2.load_parameters(filename)

Y2 = net2(X)
print(Y2 == Y)

```
```Python
Outputs:
[[1. 1. 1. 1. 1. 1. 1. 1. 1. 1.]
 [1. 1. 1. 1. 1. 1. 1. 1. 1. 1.]]
<NDArray 2x10 @cpu(0)>
```
## GPU计算
```Python
from mxnet import nd, init, gluon
from mxnet.gluon import nn
import mxnet as mx

# 计算设备
print(mx.cpu(), mx.gpu(), mx.gpu(1))

# NDArray的GPU计算
x = nd.array([1, 2, 3])
print(x)
print(x.context)

a = nd.array([1, 2, 3], ctx=mx.gpu())
print(a)

# cpu传输至GPU
y = x.copyto(mx.gpu())
print(y)

z = x.as_in_context(mx.gpu())
print(z)

# 数据都在GPU上时
# 两种方法方式不同
# copyto是深度复制，重新开辟空间
# as_in_context是浅复制，相当于引用
print(y.as_in_context(mx.gpu()) is y)

print(y.copyto(mx.gpu()) is y)

# Gluon的GPU计算
net = nn.Sequential()
net.add(nn.Dense(1))
net.initialize(ctx=mx.gpu())

net(y)

print(net[0].weight.data())

```

> # 卷积神经网络

## 二维卷积层
### 二维互相关计算
```Python
from mxnet import autograd, nd
from mxnet.gluon import nn


def corr2d(X, K):
    h, w = K.shape
    Y = nd.zeros((X.shape[0] - h + 1, X.shape[1] - w + 1))
    for i in range(Y.shape[0]):
        for j in range(Y.shape[1]):
            Y[i, j] = (X[i:i + h, j:j + w] * K).sum()
    return Y


X = nd.array([[0, 1, 2], [3, 4, 5], [6, 7, 8]])
K = nd.array([[0, 1], [2, 3]])
print(corr2d(X, K))

```
```Python
Outputs:
[[19. 25.]
 [37. 43.]]
<NDArray 2x2 @cpu(0)>
```
### 二维卷积层
```Python
class Conv2D(nn.Block):
    def __init__(self, kernel_size, **kwargs):
        super(Conv2D, self).__init__(**kwargs)
        self.weight = self.params.get('weight', shape=kernel_size)
        self.bias = self.params.get('bias', shape=(1,))

    def forward(self, x):
        return corr2d(x, self.weight.data()) + self.bias.data()
```
### 边缘检测
```Python
from mxnet import autograd, nd
from mxnet.gluon import nn


def corr2d(X, K):
    h, w = K.shape
    Y = nd.zeros((X.shape[0] - h + 1, X.shape[1] - w + 1))
    for i in range(Y.shape[0]):
        for j in range(Y.shape[1]):
            Y[i, j] = (X[i:i + h, j:j + w] * K).sum()
    return Y

X = nd.ones((6, 8))
X[:, 2:6] = 0
print(X)

K = nd.array([[1, -1]])
Y = corr2d(X, K)
print(Y)

```
```Python
Outputs:
[[1. 1. 0. 0. 0. 0. 1. 1.]
 [1. 1. 0. 0. 0. 0. 1. 1.]
 [1. 1. 0. 0. 0. 0. 1. 1.]
 [1. 1. 0. 0. 0. 0. 1. 1.]
 [1. 1. 0. 0. 0. 0. 1. 1.]
 [1. 1. 0. 0. 0. 0. 1. 1.]]
<NDArray 6x8 @cpu(0)>

[[ 0.  1.  0.  0.  0. -1.  0.]
 [ 0.  1.  0.  0.  0. -1.  0.]
 [ 0.  1.  0.  0.  0. -1.  0.]
 [ 0.  1.  0.  0.  0. -1.  0.]
 [ 0.  1.  0.  0.  0. -1.  0.]
 [ 0.  1.  0.  0.  0. -1.  0.]]
<NDArray 6x7 @cpu(0)>
```
### 通过数据学习核数组
```Python
from mxnet import autograd, nd
from mxnet.gluon import nn


def corr2d(X, K):
    h, w = K.shape
    Y = nd.zeros((X.shape[0] - h + 1, X.shape[1] - w + 1))
    for i in range(Y.shape[0]):
        for j in range(Y.shape[1]):
            Y[i, j] = (X[i:i + h, j:j + w] * K).sum()
    return Y


X = nd.ones((6, 8))
X[:, 2:6] = 0

K = nd.array([[1, -1]])
Y = corr2d(X, K)


# 构造一个输出输出通道数为1，核数组形状是(1,2)的二维卷积层
conv2d = nn.Conv2D(1, kernel_size=(1, 2))
conv2d.initialize()

# 二维卷积层使用4维输入输出，格式为（样本，通道，高，宽），这里批量大小和通道数均为1
X = X.reshape((1, 1, 6, 8))
Y = Y.reshape((1, 1, 6, 7))


for i in range(10):
    with autograd.record():
        Y_hat = conv2d(X)
        l = (Y_hat - Y) ** 2
    l.backward()
    conv2d.weight.data()[:] -= 3e-2 * conv2d.weight.grad()
    # conv2d.bias.data()[:] -= 3e-2 * conv2d.bias.grad()
    if (i + 1) % 2 == 0:
        print('batch %d, loss %.3f' % (i + 1, l.sum().asscalar()))

print(conv2d.weight.data().reshape((1, 2)))

```
```Python
batch 2, loss 4.949
batch 4, loss 0.831
batch 6, loss 0.140
batch 8, loss 0.024
batch 10, loss 0.004

[[ 0.9895    -0.9873705]]
<NDArray 1x2 @cpu(0)>
```
### 互相关运算和卷积运算
- 二者类似。为了得到卷积运算的输出，只需将核数组左右翻转并上下翻转，再与输入数组做互相关运算。
- 深度学习中核数组都是学出来的：卷积层使用互相关运算或卷积运算都不影响模型预测时的输出。
### 特征图和感受野
- 二维卷积层输出的二维数组可以看作是输入在空间维度（宽和高）上某一级的表征，也叫特征图（feature map）
- 影响元素x的前向计算的所有输入区域（可能大于输入的实际尺寸）叫做x的感受野（receptive field）
- 可以通过更深的卷积神经网络使特征图中单个元素的感受野变得更加广阔，从而捕捉输入上更大尺寸的特征。

### 练习：自定义互相关计算类的自动求梯度
```Python
from mxnet import autograd, nd
from mxnet.gluon import nn


def corr2d(X, K):
    h, w = K.shape
    Y = nd.zeros((X.shape[0] - h + 1, X.shape[1] - w + 1))
    for i in range(Y.shape[0]):
        for j in range(Y.shape[1]):
            Y[i, j] = (X[i:i + h, j:j + w] * K).sum()
    return Y


class Conv2D(nn.Block):
    def __init__(self, batch_size, channels, kernel_size, **kwargs):
        super(Conv2D, self).__init__(**kwargs)
        self.num_filter = channels
        self.kernel_size = kernel_size
        self.weight = self.params.get('weight', shape=(batch_size, channels, kernel_size[0], kernel_size[1]))
        self.bias = self.params.get('bias', shape=(channels,))

    def forward(self, x):
        # result = corr2d(x, self.weight.data()) + self.bias.data()
        result = nd.Convolution(x, self.weight.data(), self.bias.data(), num_filter=self.num_filter,
                                kernel=self.kernel_size)
        return result


conv2d = Conv2D(1, 1, kernel_size=(2, 2))
X = nd.ones((6, 8))
conv2d.initialize()
X = X.reshape((1, 1, 6, 8))
with autograd.record():
    Y = conv2d(X)

Y.backward()
print(Y)
print(conv2d.weight.grad())

```
```Python
Outputs:
[[[[0.11254273 0.11254273 0.11254273 0.11254273 0.11254273 0.11254273
    0.11254273]
   [0.11254273 0.11254273 0.11254273 0.11254273 0.11254273 0.11254273
    0.11254273]
   [0.11254273 0.11254273 0.11254273 0.11254273 0.11254273 0.11254273
    0.11254273]
   [0.11254273 0.11254273 0.11254273 0.11254273 0.11254273 0.11254273
    0.11254273]
   [0.11254273 0.11254273 0.11254273 0.11254273 0.11254273 0.11254273
    0.11254273]]]]
<NDArray 1x1x5x7 @cpu(0)>

[[[[35. 35.]
   [35. 35.]]]]
<NDArray 1x1x2x2 @cpu(0)>
```
## 填充和步幅
```Python
from mxnet import nd
from mxnet.gluon import nn


# 定义一个函数来计算卷积层
# 初始化卷积层权重，并对输入和输出做相应的升维和降维
def comp_conv2d(conv2d, X):
    conv2d.initialize()
    # (1,1)代表批量大小和通道数
    X = X.reshape((1, 1) + X.shape)
    Y = conv2d(X)
    return Y.reshape(Y.shape[2:])  # 剔除前两维：批量和通道


# padding决定两侧各填充1行或列
conv2d = nn.Conv2D(1, kernel_size=3, padding=1)
X = nd.random.uniform(shape=(8, 8))
print(comp_conv2d(conv2d, X).shape)

conv2d = nn.Conv2D(1, kernel_size=(5, 3), padding=(2, 1))
print(comp_conv2d(conv2d, X).shape)

conv2d = nn.Conv2D(1, kernel_size=3, padding=1, strides=2)
print(comp_conv2d(conv2d, X).shape)

conv2d = nn.Conv2D(1, kernel_size=(3, 5), padding=(0, 1), strides=(3, 4))
print(comp_conv2d(conv2d, X).shape)

```
```Python
Outputs:
(8, 8)
(8, 8)
(4, 4)
(2, 2)
```
## 多输入通道和多输出通道
### 多输入和多输出通道
```Python
from mxnet import nd
from mxnet.gluon import nn


def corr2d(X, K):
    h, w = K.shape
    Y = nd.zeros((X.shape[0] - h + 1, X.shape[1] - w + 1))
    for i in range(Y.shape[0]):
        for j in range(Y.shape[1]):
            Y[i, j] = (X[i:i + h, j:j + w] * K).sum()
    return Y


def corr2d_multi_in(X, K):
    return nd.add_n(*[corr2d(x, k) for x, k in zip(X, K)])


def corr2d_multi_in_out(X, K):
    return nd.stack(*[corr2d_multi_in(X, k) for k in K])


X = nd.array([[[0, 1, 2],
               [3, 4, 5],
               [6, 7, 8]],
              [[1, 2, 3],
               [4, 5, 6],
               [7, 8, 9]]])
print(X.shape)
K = nd.array([[[0, 1],
               [2, 3]],
              [[1, 2],
               [3, 4]]])
print(corr2d_multi_in(X, K))

K = nd.stack(K, K + 1, K + 2)
print(K.shape)

print(corr2d_multi_in_out(X, K))

```
```Python
Outputs:
(2, 3, 3)

[[ 56.  72.]
 [104. 120.]]
<NDArray 2x2 @cpu(0)>
(3, 2, 2, 2)

[[[ 56.  72.]
  [104. 120.]]

 [[ 76. 100.]
  [148. 172.]]

 [[ 96. 128.]
  [192. 224.]]]
<NDArray 3x2x2 @cpu(0)>
```
### 1×1卷积层
```Python
from mxnet import nd
from mxnet.gluon import nn


def corr2d(X, K):
    h, w = K.shape
    Y = nd.zeros((X.shape[0] - h + 1, X.shape[1] - w + 1))
    for i in range(Y.shape[0]):
        for j in range(Y.shape[1]):
            Y[i, j] = (X[i:i + h, j:j + w] * K).sum()
    return Y


def corr2d_multi_in(X, K):
    return nd.add_n(*[corr2d(x, k) for x, k in zip(X, K)])


def corr2d_multi_in_out(X, K):
    return nd.stack(*[corr2d_multi_in(X, k) for k in K])


def corr2d_multi_in_out_1x1(X, K):
    c_i, h, w = X.shape
    c_o = K.shape[0]
    X = X.reshape((c_i, h * w))
    K = K.reshape((c_o, c_i))
    Y = nd.dot(K, X)
    return Y.reshape((c_o, h, w))


X = nd.random.uniform(shape=(3, 3, 3))
K = nd.random.uniform(shape=(2, 3, 1, 1))

Y1 = corr2d_multi_in_out_1x1(X, K)
Y2 = corr2d_multi_in_out(X, K)
Z = (Y1 - Y2).norm().asscalar() < 1e-6
print(Z)

```
```Python
Outputs:
True
```
## 池化层
### 二维最大池化和平均池化
```Python
from mxnet import nd
from mxnet.gluon import nn


def pool2d(X, pool_size, mode='max'):
    p_h, p_w = pool_size
    Y = nd.zeros((X.shape[0] - p_h + 1, X.shape[1] - p_w + 1))
    for i in range(Y.shape[0]):
        for j in range(Y.shape[1]):
            if mode == 'max':
                Y[i, j] = X[i:i + p_h, j:j + p_w].max()
            elif mode == 'avg':
                Y[i, j] = X[i:i + p_h, j:j + p_w].mean()
    return Y


X = nd.array([[0, 1, 2], [3, 4, 5], [6, 7, 8]])
print(pool2d(X, (2, 2)))
print(pool2d(X, (2, 2), 'avg'))

```
```Python
Output:
[[4. 5.]
 [7. 8.]]
<NDArray 2x2 @cpu(0)>

[[2. 3.]
 [5. 6.]]
<NDArray 2x2 @cpu(0)>
```
### 填充和步幅、多通道
```Python
from mxnet import nd
from mxnet.gluon import nn

X = nd.arange(16).reshape((1, 1, 4, 4))
print(X)

pool2d = nn.MaxPool2D(pool_size=3)
# 池化层没有模型参数，故不需要初始化
print(pool2d(X))

# 指定填充和步幅
pool2d = nn.MaxPool2D(pool_size=3, padding=1, strides=2)
print(pool2d(X))

# 指定非正方形的池化窗口，并分别指定高和宽上的填充和步幅
pool2d = nn.MaxPool2D(pool_size=(2, 3), padding=(1, 2), strides=(2, 3))
print(pool2d(X))

# 多通道计算
# 构造通道数为2的输入
X = nd.concat(X, X + 1, dim=1)
print(X)

pool2d = nn.MaxPool2D(pool_size=3, padding=1, strides=2)
print(pool2d(X))

```
```Python
Outputs:
[[[[ 0.  1.  2.  3.]
   [ 4.  5.  6.  7.]
   [ 8.  9. 10. 11.]
   [12. 13. 14. 15.]]]]
<NDArray 1x1x4x4 @cpu(0)>

[[[[10.]]]]
<NDArray 1x1x1x1 @cpu(0)>

[[[[ 5.  7.]
   [13. 15.]]]]
<NDArray 1x1x2x2 @cpu(0)>

[[[[ 0.  3.]
   [ 8. 11.]
   [12. 15.]]]]
<NDArray 1x1x3x2 @cpu(0)>

[[[[ 0.  1.  2.  3.]
   [ 4.  5.  6.  7.]
   [ 8.  9. 10. 11.]
   [12. 13. 14. 15.]]

  [[ 1.  2.  3.  4.]
   [ 5.  6.  7.  8.]
   [ 9. 10. 11. 12.]
   [13. 14. 15. 16.]]]]
<NDArray 1x2x4x4 @cpu(0)>

[[[[ 5.  7.]
   [13. 15.]]

  [[ 6.  8.]
   [14. 16.]]]]
<NDArray 1x2x2x2 @cpu(0)>
```
### 卷积层和池化层

|类型|特点|
|:--:|:--|
|卷积层|①互相关运算<br>②对应通道的卷积核与对应的输入互相关运算，结果累加成单通道<br>③躲通道输出需要多输出卷积核，1×1卷积可以通过调整网络层之间的通道数控制模型复杂度<br>④每个通道的卷积核大小一致(不一致行不行？)，参数可不同，需要初始化|
|池化层|①最大池化和平均池化<br>②对应通道的输入与池化窗口做池化运算，结果不累加，与输入通道数相同<br>③每个通道的池化窗口一致，没有参数，也不需要初始化<br>④池化步幅默认与窗口大小相同|


## 卷积神经网络（LeNet）

|名称|结构|
|:--:|:--|
|LeNet|①卷积层：通道数6，核大小5，激活函数sigmoid<br>②最大池化层：窗口大小2，步幅2<br>③卷积层：通道数16，核大小5，激活函数sigmoid<br>④最大池化层：窗口大小2，步幅2<br>⑤全连接层：输出个数120，激活函数sigmoid<br>⑥全连接层：输出个数84，激活函数sigmoid<br>⑦全连接层：输出个数10|


```Python
import mxnet as mx
from mxnet import autograd, gluon, init, nd
from mxnet.gluon import loss as gloss, data as gdata, nn
import time
import sys

# 定义模型
net = nn.Sequential()
net.add(
    # LeNet包含卷积层块和全连接层块
    # 卷积层块：
    # 卷积层块包含两个基本单位：每个基本单位包含一个卷积层和一个最大池化层
    # 第一个卷积层输出通道数为6，第二个为16
    # 池化层窗口大小2×2，步幅均为2
    nn.Conv2D(channels=6, kernel_size=5, activation='sigmoid'),
    nn.MaxPool2D(pool_size=2, strides=2),
    nn.Conv2D(channels=16, kernel_size=5, activation='sigmoid'),
    nn.MaxPool2D(pool_size=2, strides=2),
    # 全连接层块：
    # 全连接层块包含三个全连接层
    # 输出分别是120，84,10(此10为类别个数)
    # 卷积层输出形状为(batch_size, channels, height, width)，
    # 全连接层输入将卷积层输出flatten为形状(batch_size, channels*height*width)
    nn.Dense(120, activation='sigmoid'),
    nn.Dense(84, activation='sigmoid'),
    nn.Dense(10)
)

# # 样例输出
# X = nd.random.uniform(shape=(1, 1, 28, 26))
# net.initialize()
# for layer in net:
#     X = layer(X)
#     print(layer.name, 'output shape:\t', X.shape)


# 获取数据
def load_data_fashion_mnist(batch_size):
    mnist_train = gdata.vision.FashionMNIST(train=True)
    mnist_test = gdata.vision.FashionMNIST(train=False)

    # ToTensor将图像数据从unit8格式变换成32位浮点数格式，并除以255使得所有像素的数值均在0到1之间。
    # ToTensor还将图像通道的最后一维移动到最前一维来方便后面卷积神经网络计算
    transformer = gdata.vision.transforms.ToTensor()
    # Gluon的DataLoader中一个很方便的共鞥是允许使用多进程来加速数据读取
    # 暂不支持Windows操作系统
    # 通过参数num_workers来设置4个进程读取数据
    if sys.platform.startswith('win'):
        num_workers = 0
    else:
        num_workers = 4

    train_iter = gdata.DataLoader(mnist_train.transform_first(transformer),
                                  batch_size,
                                  shuffle=True,
                                  num_workers=num_workers)
    test_iter = gdata.DataLoader(mnist_test.transform_first(transformer),
                                 batch_size,
                                 shuffle=True,
                                 num_workers=num_workers)
    return train_iter, test_iter


# 训练模型
batch_size = 256
train_iter, test_iter = load_data_fashion_mnist(batch_size=batch_size)



# 尝试使用gpu(0)计算，否则仍然使用CPU
def try_gpu():
    try:
        ctx = mx.gpu()
        _ = nd.zeros((1,), ctx=ctx)
    except mx.base.MXNetError:
        ctx = mx.cpu()
    return ctx


ctx = try_gpu()
print(ctx)


def evaluate_accuracy(data_iter, net, ctx):
    acc_sum, n = nd.array([0], ctx=ctx), 0
    for X, y in data_iter:
        X, y = X.as_in_context(ctx), y.as_in_context(ctx).astype('float32')
        acc_sum += (net(X).argmax(axis=1) == y).sum()
        n += y.size
    return acc_sum.asscalar() / n


def train_ch5(net, train_iter, test_iter, batch_size, trainer, ctx, num_epochs):
    print('training on', ctx)
    loss = gloss.SoftmaxCrossEntropyLoss()
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n, start = 0.0, 0.0, 0, time.time()
        for X, y in train_iter:
            X, y = X.as_in_context(ctx), y.as_in_context(ctx)
            with autograd.record():
                y_hat = net(X)
                l = loss(y_hat, y).sum()
            l.backward()
            trainer.step(batch_size)
            y = y.astype('float32')
            train_l_sum += l.asscalar()
            train_acc_sum += (y_hat.argmax(axis=1) == y).sum().asscalar()
            n += y.size
        test_acc = evaluate_accuracy(test_iter, net, ctx)
        print('epoch %d, loss %.4f, train acc %.3f, test acc %.3f, time %.1f sec'
              % (epoch + 1, train_l_sum / n, train_acc_sum / n, test_acc, time.time() - start))


lr, num_epochs = 0.9, 5
net.initialize(force_reinit=True, ctx=ctx, init=init.Xavier())
trainer = gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': lr})
train_ch5(net, train_iter, test_iter, batch_size, trainer, ctx, num_epochs)

```
```Python
# 各层输出形状：
conv0 output shape: (1, 6, 24, 24)
pool0 output shape: (1, 6, 12, 12)
conv1 output shape: (1, 16, 8, 8)
pool1 output shape: (1, 16, 4, 4)
dense0 output shape: (1, 120)
dense1 output shape: (1, 84)
dense2 output shape: (1, 10)
```
```Python
Outputs:
cpu(0)
[16:29:43] c:\jenkins\workspace\mxnet-tag\mxnet\src\imperative\./imperative_utils.h:90: GPU support is disabled. Compile MXNet with USE_CUDA=1 to enable GPU support.
training on cpu(0)
epoch 1, loss 2.3188, train acc 0.104, test acc 0.157, time 27.5 sec
epoch 2, loss 1.4223, train acc 0.444, test acc 0.650, time 27.6 sec
epoch 3, loss 0.8582, train acc 0.667, test acc 0.717, time 28.0 sec
epoch 4, loss 0.7174, train acc 0.718, test acc 0.737, time 27.9 sec
epoch 5, loss 0.6413, train acc 0.746, test acc 0.766, time 28.2 sec
# epochs = 5
# batch_size = 256
training on gpu(3)
epoch 1, loss 2.3165, train acc 0.106, test acc 0.167, time 2.9 sec
epoch 2, loss 1.3538, train acc 0.474, test acc 0.645, time 2.3 sec
epoch 3, loss 0.8535, train acc 0.670, test acc 0.712, time 2.2 sec
epoch 4, loss 0.7151, train acc 0.719, test acc 0.745, time 2.3 sec
epoch 5, loss 0.6347, train acc 0.750, test acc 0.740, time 2.7 sec
# batch_size = 512
epoch 1, loss 2.3295, train acc 0.102, test acc 0.100, time 2.2 sec
epoch 2, loss 2.2298, train acc 0.146, test acc 0.401, time 1.7 sec
epoch 3, loss 1.2869, train acc 0.488, test acc 0.614, time 1.8 sec
epoch 4, loss 0.9708, train acc 0.615, test acc 0.680, time 1.8 sec
epoch 5, loss 0.8490, train acc 0.671, test acc 0.693, time 1.8 sec
# batch_size = 1024
epoch 1, loss 2.3391, train acc 0.102, test acc 0.100, time 2.1 sec
epoch 2, loss 2.3078, train acc 0.105, test acc 0.100, time 1.7 sec
epoch 3, loss 2.2920, train acc 0.120, test acc 0.243, time 1.6 sec
epoch 4, loss 1.9696, train acc 0.246, test acc 0.446, time 1.7 sec
epoch 5, loss 1.2872, train acc 0.489, test acc 0.620, time 1.7 sec
# epochs = 10
# batch_size = 256
epoch  1, loss 2.3176, train acc 0.106, test acc 0.149, time 2.9 sec
epoch  2, loss 1.3815, train acc 0.460, test acc 0.675, time 2.4 sec
epoch  3, loss 0.8556, train acc 0.668, test acc 0.716, time 2.3 sec
epoch  4, loss 0.7171, train acc 0.717, test acc 0.742, time 2.1 sec
epoch  5, loss 0.6438, train acc 0.745, test acc 0.764, time 2.5 sec
epoch  6, loss 0.5867, train acc 0.768, test acc 0.784, time 2.2 sec
epoch  7, loss 0.5418, train acc 0.788, test acc 0.791, time 2.2 sec
epoch  8, loss 0.5050, train acc 0.803, test acc 0.825, time 2.3 sec
epoch  9, loss 0.4802, train acc 0.816, test acc 0.818, time 2.2 sec
epoch 10, loss 0.4574, train acc 0.827, test acc 0.841, time 2.4 sec
# batch_size = 512
epoch  1, loss 2.3272, train acc 0.102, test acc 0.100, time 2.2 sec
epoch  2, loss 2.2300, train acc 0.163, test acc 0.401, time 1.7 sec
epoch  3, loss 1.2864, train acc 0.488, test acc 0.588, time 1.6 sec
epoch  4, loss 0.9699, train acc 0.619, test acc 0.648, time 1.7 sec
epoch  5, loss 0.8427, train acc 0.673, test acc 0.689, time 1.9 sec
epoch  6, loss 0.7629, train acc 0.702, test acc 0.726, time 1.8 sec
epoch  7, loss 0.7022, train acc 0.722, test acc 0.743, time 1.7 sec
epoch  8, loss 0.6629, train acc 0.737, test acc 0.754, time 1.7 sec
epoch  9, loss 0.6332, train acc 0.747, test acc 0.764, time 1.8 sec
epoch 10, loss 0.6008, train acc 0.762, test acc 0.784, time 1.8 sec
# batch_size = 1024
epoch  1, loss 2.3383, train acc 0.097, test acc 0.100, time 2.3 sec
epoch  2, loss 2.3079, train acc 0.103, test acc 0.100, time 1.7 sec
epoch  3, loss 2.2941, train acc 0.117, test acc 0.184, time 1.8 sec
epoch  4, loss 1.9952, train acc 0.246, test acc 0.527, time 1.8 sec
epoch  5, loss 1.3037, train acc 0.486, test acc 0.578, time 1.8 sec
epoch  6, loss 1.0575, train acc 0.576, test acc 0.626, time 1.8 sec
epoch  7, loss 0.9905, train acc 0.609, test acc 0.653, time 1.7 sec
epoch  8, loss 0.9006, train acc 0.647, test acc 0.685, time 1.7 sec
epoch  9, loss 0.8429, train acc 0.674, test acc 0.699, time 1.8 sec
epoch 10, loss 0.7996, train acc 0.689, test acc 0.714, time 1.7 sec
# epochs = 20
# batch_size = 256
epoch  1, loss 2.3147, train acc 0.110, test acc 0.264, time 2.8 sec
epoch  2, loss 1.3204, train acc 0.484, test acc 0.644, time 2.6 sec
epoch  3, loss 0.8441, train acc 0.671, test acc 0.720, time 2.6 sec
epoch  4, loss 0.7153, train acc 0.721, test acc 0.741, time 2.5 sec
epoch  5, loss 0.6394, train acc 0.746, test acc 0.770, time 2.5 sec
epoch  6, loss 0.5798, train acc 0.772, test acc 0.793, time 2.3 sec
epoch  7, loss 0.5389, train acc 0.789, test acc 0.811, time 2.3 sec
epoch  8, loss 0.5021, train acc 0.805, test acc 0.818, time 2.2 sec
epoch  9, loss 0.4809, train acc 0.815, test acc 0.831, time 2.2 sec
epoch 10, loss 0.4605, train acc 0.825, test acc 0.835, time 2.5 sec
epoch 11, loss 0.4407, train acc 0.835, test acc 0.838, time 2.5 sec
epoch 12, loss 0.4235, train acc 0.841, test acc 0.853, time 2.5 sec
epoch 13, loss 0.4078, train acc 0.849, test acc 0.856, time 2.2 sec
epoch 14, loss 0.3919, train acc 0.855, test acc 0.860, time 2.2 sec
epoch 15, loss 0.3824, train acc 0.859, test acc 0.866, time 2.4 sec
epoch 16, loss 0.3705, train acc 0.863, test acc 0.866, time 2.3 sec
epoch 17, loss 0.3645, train acc 0.865, test acc 0.867, time 2.2 sec
epoch 18, loss 0.3579, train acc 0.868, test acc 0.867, time 2.3 sec
epoch 19, loss 0.3495, train acc 0.871, test acc 0.874, time 2.3 sec
epoch 20, loss 0.3418, train acc 0.873, test acc 0.876, time 2.1 sec
# batch_size = 512
epoch  1, loss 2.3305, train acc 0.101, test acc 0.100, time 2.2 sec
epoch  2, loss 2.2568, train acc 0.136, test acc 0.381, time 1.8 sec
epoch  3, loss 1.3262, train acc 0.484, test acc 0.587, time 1.7 sec
epoch  4, loss 0.9825, train acc 0.614, test acc 0.625, time 1.8 sec
epoch  5, loss 0.8471, train acc 0.670, test acc 0.702, time 1.9 sec
epoch  6, loss 0.7621, train acc 0.703, test acc 0.725, time 1.8 sec
epoch  7, loss 0.7077, train acc 0.720, test acc 0.732, time 1.8 sec
epoch  8, loss 0.6625, train acc 0.736, test acc 0.750, time 1.7 sec
epoch  9, loss 0.6435, train acc 0.745, test acc 0.757, time 1.7 sec
epoch 10, loss 0.6052, train acc 0.760, test acc 0.765, time 1.8 sec
epoch 11, loss 0.5793, train acc 0.770, test acc 0.784, time 1.7 sec
epoch 12, loss 0.5517, train acc 0.783, test acc 0.770, time 1.8 sec
epoch 13, loss 0.5368, train acc 0.790, test acc 0.806, time 1.7 sec
epoch 14, loss 0.5189, train acc 0.798, test acc 0.816, time 1.8 sec
epoch 15, loss 0.4984, train acc 0.809, test acc 0.820, time 1.8 sec
epoch 16, loss 0.4854, train acc 0.815, test acc 0.829, time 1.7 sec
epoch 17, loss 0.4692, train acc 0.821, test acc 0.821, time 1.7 sec
epoch 18, loss 0.4575, train acc 0.828, test acc 0.829, time 1.7 sec
epoch 19, loss 0.4466, train acc 0.833, test acc 0.846, time 1.6 sec
epoch 20, loss 0.4357, train acc 0.838, test acc 0.849, time 1.7 sec
# batch_size = 1024
epoch  1, loss 2.3384, train acc 0.100, test acc 0.100, time 2.2 sec
epoch  2, loss 2.3075, train acc 0.105, test acc 0.100, time 1.7 sec
epoch  3, loss 2.2947, train acc 0.120, test acc 0.122, time 1.8 sec
epoch  4, loss 1.9894, train acc 0.244, test acc 0.497, time 1.7 sec
epoch  5, loss 1.3034, train acc 0.490, test acc 0.578, time 1.8 sec
epoch  6, loss 1.0575, train acc 0.575, test acc 0.626, time 1.7 sec
epoch  7, loss 0.9918, train acc 0.608, test acc 0.650, time 1.7 sec
epoch  8, loss 0.9057, train acc 0.646, test acc 0.692, time 1.7 sec
epoch  9, loss 0.8458, train acc 0.672, test acc 0.703, time 1.6 sec
epoch 10, loss 0.7975, train acc 0.688, test acc 0.716, time 1.7 sec
epoch 11, loss 0.7521, train acc 0.704, test acc 0.725, time 1.8 sec
epoch 12, loss 0.7178, train acc 0.716, test acc 0.734, time 1.7 sec
epoch 13, loss 0.7151, train acc 0.718, test acc 0.725, time 1.6 sec
epoch 14, loss 0.6748, train acc 0.732, test acc 0.744, time 1.6 sec
epoch 15, loss 0.6631, train acc 0.736, test acc 0.746, time 1.7 sec
epoch 16, loss 0.6458, train acc 0.745, test acc 0.758, time 1.6 sec
epoch 17, loss 0.6266, train acc 0.753, test acc 0.766, time 1.7 sec
epoch 18, loss 0.6254, train acc 0.750, test acc 0.767, time 1.7 sec
epoch 19, loss 0.5947, train acc 0.765, test acc 0.776, time 1.7 sec
epoch 20, loss 0.5896, train acc 0.769, test acc 0.781, time 1.7 sec
# epochs = 40
# batch_size = 256
epoch  1, loss 2.3149, train acc 0.110, test acc 0.171, time 2.8 sec
epoch  2, loss 1.3295, train acc 0.478, test acc 0.649, time 2.4 sec
epoch  3, loss 0.8467, train acc 0.671, test acc 0.717, time 2.5 sec
epoch  4, loss 0.7095, train acc 0.719, test acc 0.745, time 2.5 sec
epoch  5, loss 0.6438, train acc 0.744, test acc 0.769, time 2.6 sec
epoch  6, loss 0.5793, train acc 0.772, test acc 0.789, time 2.3 sec
epoch  7, loss 0.5436, train acc 0.787, test acc 0.804, time 2.5 sec
epoch  8, loss 0.5068, train acc 0.804, test acc 0.818, time 2.4 sec
epoch  9, loss 0.4820, train acc 0.815, test acc 0.832, time 2.4 sec
epoch 10, loss 0.4575, train acc 0.828, test acc 0.835, time 2.3 sec
epoch 11, loss 0.4414, train acc 0.836, test acc 0.849, time 2.3 sec
epoch 12, loss 0.4188, train acc 0.844, test acc 0.848, time 2.5 sec
epoch 13, loss 0.4047, train acc 0.850, test acc 0.861, time 2.5 sec
epoch 14, loss 0.3909, train acc 0.857, test acc 0.860, time 2.4 sec
epoch 15, loss 0.3811, train acc 0.860, test acc 0.864, time 2.3 sec
epoch 16, loss 0.3710, train acc 0.863, test acc 0.864, time 2.3 sec
epoch 17, loss 0.3644, train acc 0.864, test acc 0.863, time 2.2 sec
epoch 18, loss 0.3553, train acc 0.869, test acc 0.866, time 2.3 sec
epoch 19, loss 0.3480, train acc 0.871, test acc 0.871, time 2.3 sec
epoch 20, loss 0.3414, train acc 0.874, test acc 0.872, time 2.4 sec
epoch 21, loss 0.3373, train acc 0.875, test acc 0.874, time 2.5 sec
epoch 22, loss 0.3331, train acc 0.877, test acc 0.878, time 2.4 sec
epoch 23, loss 0.3271, train acc 0.879, test acc 0.878, time 2.4 sec
epoch 24, loss 0.3232, train acc 0.880, test acc 0.883, time 2.5 sec
epoch 25, loss 0.3195, train acc 0.882, test acc 0.884, time 2.4 sec
epoch 26, loss 0.3138, train acc 0.885, test acc 0.876, time 2.3 sec
epoch 27, loss 0.3103, train acc 0.886, test acc 0.883, time 2.3 sec
epoch 28, loss 0.3086, train acc 0.886, test acc 0.889, time 2.2 sec
epoch 29, loss 0.3034, train acc 0.889, test acc 0.884, time 2.4 sec
epoch 30, loss 0.3006, train acc 0.888, test acc 0.884, time 2.2 sec
epoch 31, loss 0.2970, train acc 0.890, test acc 0.888, time 2.2 sec
epoch 32, loss 0.2948, train acc 0.891, test acc 0.886, time 2.3 sec
epoch 33, loss 0.2901, train acc 0.893, test acc 0.889, time 2.3 sec
epoch 34, loss 0.2929, train acc 0.891, test acc 0.886, time 2.2 sec
epoch 35, loss 0.2832, train acc 0.895, test acc 0.891, time 2.4 sec
epoch 36, loss 0.2823, train acc 0.896, test acc 0.892, time 2.4 sec
epoch 37, loss 0.2813, train acc 0.896, test acc 0.891, time 2.4 sec
epoch 38, loss 0.2790, train acc 0.897, test acc 0.892, time 2.4 sec
epoch 39, loss 0.2780, train acc 0.897, test acc 0.894, time 2.3 sec
epoch 40, loss 0.2747, train acc 0.898, test acc 0.892, time 2.5 sec
# batch_size = 512
epoch  1, loss 2.3291, train acc 0.099, test acc 0.100, time 2.2 sec
epoch  2, loss 2.2411, train acc 0.150, test acc 0.330, time 1.7 sec
epoch  3, loss 1.3067, train acc 0.483, test acc 0.583, time 1.7 sec
epoch  4, loss 0.9740, train acc 0.617, test acc 0.667, time 1.9 sec
epoch  5, loss 0.8470, train acc 0.673, test acc 0.689, time 1.8 sec
epoch  6, loss 0.7576, train acc 0.704, test acc 0.729, time 1.8 sec
epoch  7, loss 0.7027, train acc 0.722, test acc 0.741, time 1.8 sec
epoch  8, loss 0.6632, train acc 0.735, test acc 0.752, time 1.7 sec
epoch  9, loss 0.6385, train acc 0.747, test acc 0.765, time 1.8 sec
epoch 10, loss 0.6045, train acc 0.759, test acc 0.778, time 1.7 sec
epoch 11, loss 0.5783, train acc 0.773, test acc 0.795, time 1.7 sec
epoch 12, loss 0.5545, train acc 0.783, test acc 0.790, time 1.7 sec
epoch 13, loss 0.5340, train acc 0.791, test acc 0.813, time 1.8 sec
epoch 14, loss 0.5177, train acc 0.800, test acc 0.821, time 1.7 sec
epoch 15, loss 0.4989, train acc 0.808, test acc 0.823, time 1.7 sec
epoch 16, loss 0.4881, train acc 0.813, test acc 0.834, time 1.7 sec
epoch 17, loss 0.4726, train acc 0.820, test acc 0.834, time 1.7 sec
epoch 18, loss 0.4563, train acc 0.829, test acc 0.827, time 1.7 sec
epoch 19, loss 0.4477, train acc 0.831, test acc 0.843, time 1.8 sec
epoch 20, loss 0.4345, train acc 0.837, test acc 0.824, time 1.6 sec
epoch 21, loss 0.4364, train acc 0.839, test acc 0.852, time 1.7 sec
epoch 22, loss 0.4186, train acc 0.845, test acc 0.855, time 1.7 sec
epoch 23, loss 0.4088, train acc 0.848, test acc 0.852, time 1.7 sec
epoch 24, loss 0.3993, train acc 0.854, test acc 0.855, time 1.8 sec
epoch 25, loss 0.3914, train acc 0.856, test acc 0.863, time 1.7 sec
epoch 26, loss 0.3887, train acc 0.857, test acc 0.858, time 1.7 sec
epoch 27, loss 0.3837, train acc 0.859, test acc 0.865, time 1.7 sec
epoch 28, loss 0.3756, train acc 0.862, test acc 0.865, time 1.6 sec
epoch 29, loss 0.3738, train acc 0.862, test acc 0.869, time 1.7 sec
epoch 30, loss 0.3656, train acc 0.866, test acc 0.869, time 1.6 sec
epoch 31, loss 0.3608, train acc 0.867, test acc 0.864, time 1.8 sec
epoch 32, loss 0.3571, train acc 0.867, test acc 0.869, time 1.8 sec
epoch 33, loss 0.3538, train acc 0.869, test acc 0.875, time 1.7 sec
epoch 34, loss 0.3485, train acc 0.871, test acc 0.876, time 1.7 sec
epoch 35, loss 0.3461, train acc 0.873, test acc 0.873, time 1.7 sec
epoch 36, loss 0.3478, train acc 0.871, test acc 0.869, time 1.7 sec
epoch 37, loss 0.3358, train acc 0.876, test acc 0.876, time 1.8 sec
epoch 38, loss 0.3395, train acc 0.874, test acc 0.874, time 1.8 sec
epoch 39, loss 0.3320, train acc 0.878, test acc 0.877, time 1.7 sec
epoch 40, loss 0.3325, train acc 0.878, test acc 0.880, time 1.6 sec
# batch_size = 1024
epoch  1, loss 2.3394, train acc 0.100, test acc 0.100, time 2.2 sec
epoch  2, loss 2.3087, train acc 0.102, test acc 0.100, time 1.7 sec
epoch  3, loss 2.2945, train acc 0.127, test acc 0.213, time 1.7 sec
epoch  4, loss 2.0130, train acc 0.241, test acc 0.472, time 1.7 sec
epoch  5, loss 1.3173, train acc 0.474, test acc 0.586, time 1.8 sec
epoch  6, loss 1.0651, train acc 0.577, test acc 0.639, time 1.7 sec
epoch  7, loss 0.9873, train acc 0.608, test acc 0.676, time 1.7 sec
epoch  8, loss 0.9044, train acc 0.645, test acc 0.670, time 1.7 sec
epoch  9, loss 0.8432, train acc 0.671, test acc 0.706, time 1.6 sec
epoch 10, loss 0.7979, train acc 0.689, test acc 0.711, time 1.7 sec
epoch 11, loss 0.7482, train acc 0.707, test acc 0.722, time 1.6 sec
epoch 12, loss 0.7326, train acc 0.710, test acc 0.726, time 1.5 sec
epoch 13, loss 0.6976, train acc 0.721, test acc 0.738, time 1.6 sec
epoch 14, loss 0.6774, train acc 0.730, test acc 0.741, time 1.6 sec
epoch 15, loss 0.6664, train acc 0.735, test acc 0.749, time 1.6 sec
epoch 16, loss 0.6353, train acc 0.748, test acc 0.754, time 1.5 sec
epoch 17, loss 0.6288, train acc 0.748, test acc 0.770, time 1.6 sec
epoch 18, loss 0.5929, train acc 0.765, test acc 0.774, time 1.6 sec
epoch 19, loss 0.6011, train acc 0.761, test acc 0.778, time 1.6 sec
epoch 20, loss 0.5695, train acc 0.776, test acc 0.791, time 1.6 sec
epoch 21, loss 0.5669, train acc 0.777, test acc 0.795, time 1.7 sec
epoch 22, loss 0.5462, train acc 0.786, test acc 0.802, time 1.6 sec
epoch 23, loss 0.5312, train acc 0.793, test acc 0.810, time 1.6 sec
epoch 24, loss 0.5282, train acc 0.792, test acc 0.815, time 1.6 sec
epoch 25, loss 0.5105, train acc 0.801, test acc 0.808, time 1.8 sec
epoch 26, loss 0.5104, train acc 0.802, test acc 0.820, time 1.8 sec
epoch 27, loss 0.4950, train acc 0.809, test acc 0.826, time 1.7 sec
epoch 28, loss 0.4860, train acc 0.812, test acc 0.828, time 1.6 sec
epoch 29, loss 0.4832, train acc 0.816, test acc 0.832, time 1.6 sec
epoch 30, loss 0.4737, train acc 0.817, test acc 0.836, time 1.7 sec
epoch 31, loss 0.4655, train acc 0.824, test acc 0.838, time 1.7 sec
epoch 32, loss 0.4579, train acc 0.828, test acc 0.845, time 1.7 sec
epoch 33, loss 0.4535, train acc 0.828, test acc 0.843, time 1.8 sec
epoch 34, loss 0.4400, train acc 0.834, test acc 0.848, time 1.7 sec
epoch 35, loss 0.4346, train acc 0.838, test acc 0.847, time 1.6 sec
epoch 36, loss 0.4364, train acc 0.836, test acc 0.851, time 1.7 sec
epoch 37, loss 0.4240, train acc 0.844, test acc 0.853, time 1.6 sec
epoch 38, loss 0.4236, train acc 0.842, test acc 0.854, time 1.6 sec
epoch 39, loss 0.4159, train acc 0.848, test acc 0.853, time 1.7 sec
epoch 40, loss 0.4125, train acc 0.848, test acc 0.856, time 1.8 sec
# epochs = 100
# batch_size = 256
epoch   1, loss 2.3139, train acc 0.111, test acc 0.190, time 2.9 sec
epoch   2, loss 1.3241, train acc 0.484, test acc 0.660, time 2.4 sec
epoch   3, loss 0.8509, train acc 0.671, test acc 0.695, time 2.5 sec
epoch   4, loss 0.7113, train acc 0.719, test acc 0.731, time 2.2 sec
epoch   5, loss 0.6368, train acc 0.748, test acc 0.759, time 2.7 sec
epoch   6, loss 0.5802, train acc 0.770, test acc 0.794, time 2.2 sec
epoch   7, loss 0.5416, train acc 0.786, test acc 0.802, time 2.4 sec
epoch   8, loss 0.5086, train acc 0.803, test acc 0.815, time 2.4 sec
epoch   9, loss 0.4788, train acc 0.815, test acc 0.830, time 2.1 sec
epoch  10, loss 0.4565, train acc 0.828, test acc 0.844, time 2.2 sec
epoch  11, loss 0.4373, train acc 0.836, test acc 0.840, time 2.3 sec
epoch  12, loss 0.4221, train acc 0.842, test acc 0.854, time 2.2 sec
epoch  13, loss 0.4052, train acc 0.848, test acc 0.856, time 2.3 sec
epoch  14, loss 0.3922, train acc 0.855, test acc 0.861, time 2.2 sec
epoch  15, loss 0.3788, train acc 0.861, test acc 0.863, time 2.4 sec
epoch  16, loss 0.3720, train acc 0.863, test acc 0.864, time 2.2 sec
epoch  17, loss 0.3634, train acc 0.866, test acc 0.865, time 2.1 sec
epoch  18, loss 0.3560, train acc 0.870, test acc 0.866, time 2.2 sec
epoch  19, loss 0.3486, train acc 0.871, test acc 0.873, time 2.2 sec
epoch  20, loss 0.3446, train acc 0.873, test acc 0.873, time 2.2 sec
epoch  21, loss 0.3357, train acc 0.876, test acc 0.879, time 2.4 sec
epoch  22, loss 0.3321, train acc 0.878, test acc 0.877, time 2.3 sec
epoch  23, loss 0.3285, train acc 0.879, test acc 0.882, time 2.1 sec
epoch  24, loss 0.3220, train acc 0.880, test acc 0.883, time 2.2 sec
epoch  25, loss 0.3202, train acc 0.882, test acc 0.874, time 2.2 sec
epoch  26, loss 0.3130, train acc 0.885, test acc 0.883, time 2.2 sec
epoch  27, loss 0.3119, train acc 0.886, test acc 0.885, time 2.1 sec
epoch  28, loss 0.3069, train acc 0.886, test acc 0.881, time 2.2 sec
epoch  29, loss 0.3026, train acc 0.887, test acc 0.883, time 2.3 sec
epoch  30, loss 0.3002, train acc 0.888, test acc 0.889, time 2.3 sec
epoch  31, loss 0.2979, train acc 0.891, test acc 0.890, time 2.3 sec
epoch  32, loss 0.2943, train acc 0.891, test acc 0.882, time 2.2 sec
epoch  33, loss 0.2922, train acc 0.892, test acc 0.893, time 2.2 sec
epoch  34, loss 0.2896, train acc 0.893, test acc 0.893, time 2.1 sec
epoch  35, loss 0.2838, train acc 0.895, test acc 0.892, time 2.2 sec
epoch  36, loss 0.2832, train acc 0.895, test acc 0.892, time 2.2 sec
epoch  37, loss 0.2825, train acc 0.896, test acc 0.891, time 2.1 sec
epoch  38, loss 0.2774, train acc 0.896, test acc 0.888, time 2.3 sec
epoch  39, loss 0.2758, train acc 0.897, test acc 0.894, time 2.1 sec
epoch  40, loss 0.2732, train acc 0.898, test acc 0.894, time 2.2 sec
epoch  41, loss 0.2714, train acc 0.899, test acc 0.892, time 2.2 sec
epoch  42, loss 0.2676, train acc 0.901, test acc 0.892, time 2.3 sec
epoch  43, loss 0.2670, train acc 0.901, test acc 0.896, time 2.2 sec
epoch  44, loss 0.2650, train acc 0.901, test acc 0.896, time 2.3 sec
epoch  45, loss 0.2643, train acc 0.900, test acc 0.894, time 2.0 sec
epoch  46, loss 0.2613, train acc 0.903, test acc 0.896, time 2.1 sec
epoch  47, loss 0.2587, train acc 0.903, test acc 0.897, time 2.1 sec
epoch  48, loss 0.2592, train acc 0.904, test acc 0.888, time 2.1 sec
epoch  49, loss 0.2544, train acc 0.906, test acc 0.895, time 2.3 sec
epoch  50, loss 0.2567, train acc 0.904, test acc 0.897, time 2.1 sec
epoch  51, loss 0.2531, train acc 0.905, test acc 0.897, time 2.3 sec
epoch  52, loss 0.2507, train acc 0.907, test acc 0.896, time 2.3 sec
epoch  53, loss 0.2495, train acc 0.907, test acc 0.896, time 2.2 sec
epoch  54, loss 0.2480, train acc 0.908, test acc 0.899, time 2.3 sec
epoch  55, loss 0.2473, train acc 0.907, test acc 0.899, time 2.3 sec
epoch  56, loss 0.2458, train acc 0.909, test acc 0.897, time 2.3 sec
epoch  57, loss 0.2430, train acc 0.909, test acc 0.899, time 2.3 sec
epoch  58, loss 0.2413, train acc 0.910, test acc 0.895, time 2.4 sec
epoch  59, loss 0.2386, train acc 0.911, test acc 0.901, time 2.3 sec
epoch  60, loss 0.2375, train acc 0.911, test acc 0.901, time 2.4 sec
epoch  61, loss 0.2358, train acc 0.912, test acc 0.901, time 2.2 sec
epoch  62, loss 0.2346, train acc 0.912, test acc 0.901, time 2.2 sec
epoch  63, loss 0.2344, train acc 0.912, test acc 0.896, time 2.2 sec
epoch  64, loss 0.2328, train acc 0.913, test acc 0.903, time 2.3 sec
epoch  65, loss 0.2303, train acc 0.913, test acc 0.903, time 2.3 sec
epoch  66, loss 0.2286, train acc 0.914, test acc 0.902, time 2.2 sec
epoch  67, loss 0.2273, train acc 0.914, test acc 0.902, time 2.2 sec
epoch  68, loss 0.2263, train acc 0.916, test acc 0.904, time 2.3 sec
epoch  69, loss 0.2244, train acc 0.916, test acc 0.903, time 2.2 sec
epoch  70, loss 0.2233, train acc 0.916, test acc 0.904, time 2.1 sec
epoch  71, loss 0.2229, train acc 0.917, test acc 0.900, time 2.2 sec
epoch  72, loss 0.2206, train acc 0.917, test acc 0.901, time 2.2 sec
epoch  73, loss 0.2183, train acc 0.918, test acc 0.905, time 2.1 sec
epoch  74, loss 0.2200, train acc 0.919, test acc 0.903, time 2.1 sec
epoch  75, loss 0.2173, train acc 0.919, test acc 0.895, time 2.2 sec
epoch  76, loss 0.2166, train acc 0.918, test acc 0.903, time 2.1 sec
epoch  77, loss 0.2141, train acc 0.920, test acc 0.904, time 2.1 sec
epoch  78, loss 0.2134, train acc 0.919, test acc 0.905, time 2.1 sec
epoch  79, loss 0.2116, train acc 0.920, test acc 0.906, time 2.1 sec
epoch  80, loss 0.2084, train acc 0.922, test acc 0.906, time 2.1 sec
epoch  81, loss 0.2095, train acc 0.921, test acc 0.903, time 2.2 sec
epoch  82, loss 0.2069, train acc 0.922, test acc 0.903, time 2.1 sec
epoch  83, loss 0.2074, train acc 0.922, test acc 0.902, time 2.1 sec
epoch  84, loss 0.2041, train acc 0.924, test acc 0.907, time 2.2 sec
epoch  85, loss 0.2058, train acc 0.922, test acc 0.903, time 2.3 sec
epoch  86, loss 0.2034, train acc 0.923, test acc 0.901, time 2.2 sec
epoch  87, loss 0.2018, train acc 0.923, test acc 0.899, time 2.2 sec
epoch  88, loss 0.1987, train acc 0.926, test acc 0.902, time 2.2 sec
epoch  89, loss 0.1997, train acc 0.925, test acc 0.902, time 2.2 sec
epoch  90, loss 0.1987, train acc 0.925, test acc 0.904, time 2.1 sec
epoch  91, loss 0.1981, train acc 0.925, test acc 0.904, time 2.1 sec
epoch  92, loss 0.1982, train acc 0.926, test acc 0.904, time 2.3 sec
epoch  93, loss 0.1954, train acc 0.926, test acc 0.905, time 2.1 sec
epoch  94, loss 0.1931, train acc 0.927, test acc 0.903, time 2.2 sec
epoch  95, loss 0.1932, train acc 0.928, test acc 0.902, time 2.1 sec
epoch  96, loss 0.1911, train acc 0.928, test acc 0.903, time 2.1 sec
epoch  97, loss 0.1901, train acc 0.929, test acc 0.894, time 2.2 sec
epoch  98, loss 0.1885, train acc 0.930, test acc 0.900, time 2.1 sec
epoch  99, loss 0.1883, train acc 0.930, test acc 0.899, time 2.1 sec
epoch 100, loss 0.1876, train acc 0.929, test acc 0.906, time 2.1 sec
# batch_size = 512
epoch   1, loss 2.3279, train acc 0.100, test acc 0.100, time 2.2 sec
epoch   2, loss 2.2510, train acc 0.138, test acc 0.325, time 1.7 sec
epoch   3, loss 1.3155, train acc 0.480, test acc 0.540, time 1.7 sec
epoch   4, loss 0.9752, train acc 0.613, test acc 0.665, time 1.6 sec
epoch   5, loss 0.8506, train acc 0.670, test acc 0.710, time 1.8 sec
epoch   6, loss 0.7536, train acc 0.707, test acc 0.729, time 1.8 sec
epoch   7, loss 0.6988, train acc 0.723, test acc 0.741, time 1.8 sec
epoch   8, loss 0.6548, train acc 0.738, test acc 0.752, time 1.8 sec
epoch   9, loss 0.6272, train acc 0.752, test acc 0.772, time 1.8 sec
epoch  10, loss 0.5857, train acc 0.767, test acc 0.777, time 1.8 sec
epoch  11, loss 0.5685, train acc 0.775, test acc 0.790, time 1.7 sec
epoch  12, loss 0.5419, train acc 0.786, test acc 0.792, time 1.7 sec
epoch  13, loss 0.5149, train acc 0.800, test acc 0.810, time 1.7 sec
epoch  14, loss 0.4998, train acc 0.807, test acc 0.823, time 1.6 sec
epoch  15, loss 0.4857, train acc 0.813, test acc 0.833, time 1.7 sec
epoch  16, loss 0.4787, train acc 0.816, test acc 0.816, time 1.8 sec
epoch  17, loss 0.4559, train acc 0.828, test acc 0.840, time 1.7 sec
epoch  18, loss 0.4437, train acc 0.834, test acc 0.843, time 1.8 sec
epoch  19, loss 0.4368, train acc 0.836, test acc 0.836, time 1.8 sec
epoch  20, loss 0.4254, train acc 0.843, test acc 0.857, time 1.9 sec
epoch  21, loss 0.4097, train acc 0.849, test acc 0.848, time 1.8 sec
epoch  22, loss 0.4058, train acc 0.850, test acc 0.863, time 1.7 sec
epoch  23, loss 0.3972, train acc 0.854, test acc 0.857, time 1.8 sec
epoch  24, loss 0.3909, train acc 0.857, test acc 0.862, time 1.7 sec
epoch  25, loss 0.3825, train acc 0.860, test acc 0.863, time 1.6 sec
epoch  26, loss 0.3772, train acc 0.860, test acc 0.859, time 1.7 sec
epoch  27, loss 0.3758, train acc 0.861, test acc 0.867, time 1.8 sec
epoch  28, loss 0.3680, train acc 0.865, test acc 0.867, time 1.6 sec
epoch  29, loss 0.3627, train acc 0.867, test acc 0.869, time 1.8 sec
epoch  30, loss 0.3592, train acc 0.868, test acc 0.874, time 1.8 sec
epoch  31, loss 0.3561, train acc 0.869, test acc 0.871, time 1.7 sec
epoch  32, loss 0.3526, train acc 0.870, test acc 0.871, time 1.7 sec
epoch  33, loss 0.3475, train acc 0.872, test acc 0.875, time 1.6 sec
epoch  34, loss 0.3486, train acc 0.871, test acc 0.876, time 1.7 sec
epoch  35, loss 0.3385, train acc 0.876, test acc 0.875, time 1.7 sec
epoch  36, loss 0.3418, train acc 0.874, test acc 0.877, time 1.8 sec
epoch  37, loss 0.3364, train acc 0.876, test acc 0.869, time 1.8 sec
epoch  38, loss 0.3316, train acc 0.878, test acc 0.878, time 1.7 sec
epoch  39, loss 0.3313, train acc 0.878, test acc 0.877, time 1.7 sec
epoch  40, loss 0.3280, train acc 0.878, test acc 0.873, time 1.7 sec
epoch  41, loss 0.3261, train acc 0.879, test acc 0.883, time 1.6 sec
epoch  42, loss 0.3213, train acc 0.883, test acc 0.877, time 1.7 sec
epoch  43, loss 0.3203, train acc 0.882, test acc 0.885, time 1.7 sec
epoch  44, loss 0.3173, train acc 0.883, test acc 0.867, time 1.7 sec
epoch  45, loss 0.3145, train acc 0.884, test acc 0.879, time 1.6 sec
epoch  46, loss 0.3141, train acc 0.883, test acc 0.880, time 1.7 sec
epoch  47, loss 0.3110, train acc 0.886, test acc 0.880, time 1.7 sec
epoch  48, loss 0.3085, train acc 0.886, test acc 0.881, time 1.7 sec
epoch  49, loss 0.3054, train acc 0.888, test acc 0.882, time 1.7 sec
epoch  50, loss 0.3058, train acc 0.886, test acc 0.887, time 1.6 sec
epoch  51, loss 0.3023, train acc 0.888, test acc 0.883, time 1.7 sec
epoch  52, loss 0.3015, train acc 0.889, test acc 0.887, time 1.7 sec
epoch  53, loss 0.3005, train acc 0.890, test acc 0.887, time 1.6 sec
epoch  54, loss 0.2979, train acc 0.890, test acc 0.886, time 1.8 sec
epoch  55, loss 0.2988, train acc 0.889, test acc 0.887, time 1.7 sec
epoch  56, loss 0.2939, train acc 0.892, test acc 0.887, time 1.7 sec
epoch  57, loss 0.2929, train acc 0.892, test acc 0.881, time 1.6 sec
epoch  58, loss 0.2940, train acc 0.892, test acc 0.887, time 1.6 sec
epoch  59, loss 0.2891, train acc 0.893, test acc 0.890, time 1.7 sec
epoch  60, loss 0.2904, train acc 0.892, test acc 0.892, time 1.8 sec
epoch  61, loss 0.2859, train acc 0.895, test acc 0.890, time 1.7 sec
epoch  62, loss 0.2870, train acc 0.893, test acc 0.891, time 1.7 sec
epoch  63, loss 0.2851, train acc 0.894, test acc 0.893, time 1.7 sec
epoch  64, loss 0.2813, train acc 0.896, test acc 0.894, time 1.7 sec
epoch  65, loss 0.2842, train acc 0.896, test acc 0.892, time 1.6 sec
epoch  66, loss 0.2797, train acc 0.896, test acc 0.883, time 1.5 sec
epoch  67, loss 0.2745, train acc 0.899, test acc 0.893, time 1.7 sec
epoch  68, loss 0.2766, train acc 0.897, test acc 0.894, time 1.8 sec
epoch  69, loss 0.2766, train acc 0.898, test acc 0.893, time 1.8 sec
epoch  70, loss 0.2731, train acc 0.899, test acc 0.896, time 1.8 sec
epoch  71, loss 0.2737, train acc 0.899, test acc 0.894, time 1.7 sec
epoch  72, loss 0.2692, train acc 0.900, test acc 0.897, time 1.6 sec
epoch  73, loss 0.2724, train acc 0.899, test acc 0.894, time 1.7 sec
epoch  74, loss 0.2686, train acc 0.900, test acc 0.896, time 1.7 sec
epoch  75, loss 0.2698, train acc 0.901, test acc 0.881, time 1.6 sec
epoch  76, loss 0.2676, train acc 0.902, test acc 0.895, time 1.6 sec
epoch  77, loss 0.2678, train acc 0.901, test acc 0.895, time 1.6 sec
epoch  78, loss 0.2659, train acc 0.902, test acc 0.897, time 1.6 sec
epoch  79, loss 0.2625, train acc 0.903, test acc 0.899, time 1.7 sec
epoch  80, loss 0.2628, train acc 0.903, test acc 0.888, time 1.6 sec
epoch  81, loss 0.2610, train acc 0.903, test acc 0.897, time 1.6 sec
epoch  82, loss 0.2613, train acc 0.902, test acc 0.888, time 1.6 sec
epoch  83, loss 0.2579, train acc 0.905, test acc 0.892, time 1.5 sec
epoch  84, loss 0.2578, train acc 0.905, test acc 0.896, time 1.6 sec
epoch  85, loss 0.2553, train acc 0.905, test acc 0.898, time 1.6 sec
epoch  86, loss 0.2569, train acc 0.906, test acc 0.894, time 1.7 sec
epoch  87, loss 0.2536, train acc 0.906, test acc 0.899, time 1.7 sec
epoch  88, loss 0.2552, train acc 0.905, test acc 0.896, time 1.6 sec
epoch  89, loss 0.2528, train acc 0.906, test acc 0.898, time 1.6 sec
epoch  90, loss 0.2515, train acc 0.906, test acc 0.899, time 1.6 sec
epoch  91, loss 0.2510, train acc 0.907, test acc 0.898, time 1.6 sec
epoch  92, loss 0.2507, train acc 0.907, test acc 0.897, time 1.6 sec
epoch  93, loss 0.2487, train acc 0.908, test acc 0.896, time 1.6 sec
epoch  94, loss 0.2459, train acc 0.909, test acc 0.893, time 1.6 sec
epoch  95, loss 0.2466, train acc 0.907, test acc 0.894, time 1.7 sec
epoch  96, loss 0.2463, train acc 0.908, test acc 0.898, time 1.6 sec
epoch  97, loss 0.2444, train acc 0.910, test acc 0.897, time 1.7 sec
epoch  98, loss 0.2431, train acc 0.908, test acc 0.899, time 1.8 sec
epoch  99, loss 0.2448, train acc 0.909, test acc 0.899, time 1.7 sec
epoch 100, loss 0.2451, train acc 0.908, test acc 0.901, time 1.6 sec
# batch_size = 1024
epoch   1, loss 2.3388, train acc 0.102, test acc 0.100, time 2.3 sec
epoch   2, loss 2.3074, train acc 0.102, test acc 0.100, time 1.7 sec
epoch   3, loss 2.2954, train acc 0.117, test acc 0.186, time 1.8 sec
epoch   4, loss 2.0140, train acc 0.236, test acc 0.492, time 1.8 sec
epoch   5, loss 1.3084, train acc 0.487, test acc 0.572, time 1.8 sec
epoch   6, loss 1.0673, train acc 0.577, test acc 0.655, time 1.8 sec
epoch   7, loss 0.9726, train acc 0.610, test acc 0.671, time 1.8 sec
epoch   8, loss 0.9058, train acc 0.644, test acc 0.691, time 1.8 sec
epoch   9, loss 0.8334, train acc 0.679, test acc 0.706, time 1.7 sec
epoch  10, loss 0.7990, train acc 0.688, test acc 0.710, time 1.8 sec
epoch  11, loss 0.7526, train acc 0.706, test acc 0.729, time 1.8 sec
epoch  12, loss 0.7190, train acc 0.716, test acc 0.737, time 1.7 sec
epoch  13, loss 0.7077, train acc 0.719, test acc 0.736, time 1.8 sec
epoch  14, loss 0.6746, train acc 0.730, test acc 0.739, time 1.8 sec
epoch  15, loss 0.6566, train acc 0.739, test acc 0.744, time 1.8 sec
epoch  16, loss 0.6449, train acc 0.743, test acc 0.754, time 1.8 sec
epoch  17, loss 0.6136, train acc 0.756, test acc 0.768, time 1.8 sec
epoch  18, loss 0.6059, train acc 0.759, test acc 0.773, time 1.7 sec
epoch  19, loss 0.5866, train acc 0.767, test acc 0.777, time 1.8 sec
epoch  20, loss 0.5743, train acc 0.773, test acc 0.785, time 1.8 sec
epoch  21, loss 0.5619, train acc 0.778, test acc 0.799, time 1.8 sec
epoch  22, loss 0.5425, train acc 0.789, test acc 0.801, time 1.8 sec
epoch  23, loss 0.5313, train acc 0.793, test acc 0.803, time 1.7 sec
epoch  24, loss 0.5206, train acc 0.797, test acc 0.805, time 1.7 sec
epoch  25, loss 0.5181, train acc 0.796, test acc 0.815, time 1.8 sec
epoch  26, loss 0.5035, train acc 0.805, test acc 0.819, time 1.8 sec
epoch  27, loss 0.4959, train acc 0.808, test acc 0.822, time 1.6 sec
epoch  28, loss 0.4895, train acc 0.812, test acc 0.828, time 1.8 sec
epoch  29, loss 0.4759, train acc 0.818, test acc 0.830, time 1.7 sec
epoch  30, loss 0.4777, train acc 0.817, test acc 0.833, time 1.8 sec
epoch  31, loss 0.4664, train acc 0.823, test acc 0.840, time 1.8 sec
epoch  32, loss 0.4556, train acc 0.829, test acc 0.841, time 1.8 sec
epoch  33, loss 0.4521, train acc 0.829, test acc 0.844, time 1.7 sec
epoch  34, loss 0.4439, train acc 0.833, test acc 0.846, time 1.8 sec
epoch  35, loss 0.4362, train acc 0.837, test acc 0.852, time 1.7 sec
epoch  36, loss 0.4341, train acc 0.838, test acc 0.853, time 1.8 sec
epoch  37, loss 0.4217, train acc 0.844, test acc 0.852, time 1.7 sec
epoch  38, loss 0.4198, train acc 0.845, test acc 0.855, time 1.7 sec
epoch  39, loss 0.4129, train acc 0.847, test acc 0.847, time 1.8 sec
epoch  40, loss 0.4105, train acc 0.849, test acc 0.859, time 1.7 sec
epoch  41, loss 0.4044, train acc 0.851, test acc 0.859, time 1.7 sec
epoch  42, loss 0.4080, train acc 0.850, test acc 0.856, time 1.7 sec
epoch  43, loss 0.3935, train acc 0.855, test acc 0.859, time 1.7 sec
epoch  44, loss 0.3964, train acc 0.854, test acc 0.862, time 1.8 sec
epoch  45, loss 0.3944, train acc 0.855, test acc 0.864, time 1.7 sec
epoch  46, loss 0.3809, train acc 0.860, test acc 0.861, time 1.7 sec
epoch  47, loss 0.3863, train acc 0.858, test acc 0.867, time 1.7 sec
epoch  48, loss 0.3814, train acc 0.860, test acc 0.866, time 1.7 sec
epoch  49, loss 0.3713, train acc 0.864, test acc 0.868, time 1.7 sec
epoch  50, loss 0.3725, train acc 0.862, test acc 0.869, time 1.7 sec
epoch  51, loss 0.3724, train acc 0.863, test acc 0.870, time 1.7 sec
epoch  52, loss 0.3660, train acc 0.866, test acc 0.868, time 1.8 sec
epoch  53, loss 0.3639, train acc 0.865, test acc 0.868, time 1.7 sec
epoch  54, loss 0.3662, train acc 0.865, test acc 0.867, time 1.7 sec
epoch  55, loss 0.3595, train acc 0.869, test acc 0.871, time 1.8 sec
epoch  56, loss 0.3604, train acc 0.867, test acc 0.870, time 1.7 sec
epoch  57, loss 0.3602, train acc 0.867, test acc 0.873, time 1.8 sec
epoch  58, loss 0.3534, train acc 0.871, test acc 0.870, time 1.8 sec
epoch  59, loss 0.3519, train acc 0.871, test acc 0.873, time 1.8 sec
epoch  60, loss 0.3499, train acc 0.871, test acc 0.875, time 1.8 sec
epoch  61, loss 0.3444, train acc 0.874, test acc 0.869, time 1.8 sec
epoch  62, loss 0.3483, train acc 0.873, test acc 0.876, time 1.7 sec
epoch  63, loss 0.3436, train acc 0.873, test acc 0.876, time 1.7 sec
epoch  64, loss 0.3428, train acc 0.875, test acc 0.876, time 1.8 sec
epoch  65, loss 0.3452, train acc 0.873, test acc 0.877, time 1.7 sec
epoch  66, loss 0.3373, train acc 0.876, test acc 0.879, time 1.8 sec
epoch  67, loss 0.3377, train acc 0.876, test acc 0.878, time 1.8 sec
epoch  68, loss 0.3362, train acc 0.877, test acc 0.874, time 1.8 sec
epoch  69, loss 0.3338, train acc 0.877, test acc 0.876, time 1.7 sec
epoch  70, loss 0.3320, train acc 0.879, test acc 0.880, time 1.8 sec
epoch  71, loss 0.3363, train acc 0.876, test acc 0.875, time 1.8 sec
epoch  72, loss 0.3333, train acc 0.878, test acc 0.880, time 1.8 sec
epoch  73, loss 0.3251, train acc 0.881, test acc 0.881, time 1.8 sec
epoch  74, loss 0.3289, train acc 0.879, test acc 0.883, time 1.7 sec
epoch  75, loss 0.3252, train acc 0.881, test acc 0.883, time 1.7 sec
epoch  76, loss 0.3224, train acc 0.882, test acc 0.883, time 1.7 sec
epoch  77, loss 0.3228, train acc 0.881, test acc 0.884, time 1.7 sec
epoch  78, loss 0.3251, train acc 0.879, test acc 0.882, time 1.7 sec
epoch  79, loss 0.3244, train acc 0.880, test acc 0.884, time 1.7 sec
epoch  80, loss 0.3187, train acc 0.882, test acc 0.880, time 1.7 sec
epoch  81, loss 0.3166, train acc 0.883, test acc 0.884, time 1.7 sec
epoch  82, loss 0.3147, train acc 0.884, test acc 0.884, time 1.7 sec
epoch  83, loss 0.3137, train acc 0.884, test acc 0.880, time 1.7 sec
epoch  84, loss 0.3144, train acc 0.884, test acc 0.881, time 1.7 sec
epoch  85, loss 0.3132, train acc 0.884, test acc 0.882, time 1.6 sec
epoch  86, loss 0.3144, train acc 0.884, test acc 0.882, time 1.7 sec
epoch  87, loss 0.3113, train acc 0.884, test acc 0.884, time 1.6 sec
epoch  88, loss 0.3085, train acc 0.887, test acc 0.884, time 1.7 sec
epoch  89, loss 0.3065, train acc 0.887, test acc 0.886, time 1.7 sec
epoch  90, loss 0.3063, train acc 0.887, test acc 0.885, time 1.7 sec
epoch  91, loss 0.3051, train acc 0.887, test acc 0.888, time 1.8 sec
epoch  92, loss 0.3016, train acc 0.889, test acc 0.891, time 1.7 sec
epoch  93, loss 0.3039, train acc 0.888, test acc 0.887, time 1.7 sec
epoch  94, loss 0.3037, train acc 0.888, test acc 0.888, time 1.7 sec
epoch  95, loss 0.3038, train acc 0.888, test acc 0.888, time 1.6 sec
epoch  96, loss 0.3000, train acc 0.890, test acc 0.883, time 1.7 sec
epoch  97, loss 0.3032, train acc 0.888, test acc 0.886, time 1.7 sec
epoch  98, loss 0.2968, train acc 0.891, test acc 0.885, time 1.8 sec
epoch  99, loss 0.2991, train acc 0.890, test acc 0.891, time 1.7 sec
epoch 100, loss 0.2949, train acc 0.892, test acc 0.890, time 1.6 sec
```
**注意：
这里发现一个问题：
获取的数据集mnist_train是(height,width,channel)的形状，LoadData后是(batch_size, channels, height, width)，而Dense计算后的是(batch_size，channels\*height\*width)，之前的Softmax回归等的原生实现和简洁实现注意数据的形状转换。**
MXNet API中的Conv2D的输入说明
`Inputs:
data: 4D input tensor with shape (batch_size, in_channels, height, width) when layout is NCHW. For other layouts shape is permuted accordingly.`
## 深度卷积神经网络（AlexNet）

|名称|结构|
|:--:|:--|
|AlexNet|①卷积层：通道数96，核大小11，步幅4，激活函数ReLU<br>②最大池化层：窗口大小3，步幅2<br>③卷积层：通道数256，核大小5，填充2，激活函数ReLU<br>④最大池化层：窗口大小3，步幅2<br>⑤卷积层：通道数384， 核大小3，填充1，激活函数ReLU<br>⑥卷积层：通道数384， 核大小3，填充1，激活函数ReLU<br>⑦卷积层：通道数256，核大小3，填充1，激活函数ReLU<br>⑧最大池化层：窗口大小3，步幅2<br>⑨全连接层：输出个数4096，激活函数ReLU<br>⑩丢弃层：丢弃概率0.5<br>⑪全连接层：输出个数4096，激活函数ReLU<br>⑫丢弃层：丢弃概率0.5<br>⑬全连接层：输出个数10|


```Python
from mxnet import gluon, init, nd, autograd
from mxnet.gluon import data as gdata, loss as gloss, nn
import os
import sys
import time
import mxnet as mx

net = nn.Sequential()
net.add(
    nn.Conv2D(96, kernel_size=11, strides=4, activation='relu'),
    nn.MaxPool2D(pool_size=3, strides=2),
    # 减小卷积窗口，使用填充为2来使得输入与输出的高和宽一致，且增大输出通道数
    nn.Conv2D(256, kernel_size=5, padding=2, activation='relu'),
    nn.MaxPool2D(pool_size=3, strides=2),
    # 连续3个卷积层，且使用更小的卷积窗口。除了最后的卷积层外，进一步增大了输出通道数
    # 前两个卷积层后不使用池化层来减小输入的高和宽
    nn.Conv2D(384, kernel_size=3, padding=1, activation='relu'),
    nn.Conv2D(384, kernel_size=3, padding=1, activation='relu'),
    nn.Conv2D(256, kernel_size=3, padding=1, activation='relu'),
    nn.MaxPool2D(pool_size=3, strides=2),
    # 使用丢弃层缓解过拟合
    nn.Dense(4096, activation='relu'),
    nn.Dropout(0.5),
    nn.Dense(4096, activation='relu'),
    nn.Dropout(0.5),
    # 输出层。由于这里使用Fashion-MNIST数据集，所以类别数为10，而非论文中的1000
    nn.Dense(10)
)

X = nd.random.uniform(shape=(1, 1, 224, 224))
net.initialize()
for layer in net:
    X = layer(X)
    print(layer.name, 'output shape:\t', X.shape)


def load_data_fashion_mnist(batch_size, resize=None, root=os.path.join('-', 'mxnet', 'datasets', 'fashion-mnist')):
    root = os.path.expanduser(root)  # 展开用户路径
    transformer = []
    if resize:
        transformer += [gdata.vision.transforms.Resize(resize)]
    transformer += [gdata.vision.transforms.ToTensor()]
    transformer = gdata.vision.transforms.Compose(transformer)

    mnist_train = gdata.vision.FashionMNIST(root=root, train=True)
    mnist_test = gdata.vision.FashionMNIST(root=root, train=False)

    num_workers = 0 if sys.platform.startswith('win') else 4

    train_iter = gdata.DataLoader(mnist_train.transform_first(transformer),
                                  batch_size=batch_size,
                                  shuffle=True,
                                  num_workers=num_workers)
    test_iter = gdata.DataLoader(mnist_test.transform_first(transformer),
                                 batch_size=batch_size,
                                 shuffle=True,
                                 num_workers=num_workers)
    return train_iter, test_iter


# 尝试使用gpu(0)计算，否则仍然使用CPU
def try_gpu():
    try:
        ctx = mx.gpu(1)
        _ = nd.zeros((1,), ctx=ctx)
    except mx.base.MXNetError:
        ctx = mx.cpu()
    return ctx


def evaluate_accuracy(data_iter, net, ctx):
    acc_sum, n = nd.array([0], ctx=ctx), 0
    for X, y in data_iter:
        X, y = X.as_in_context(ctx), y.as_in_context(ctx).astype('float32')
        acc_sum += (net(X).argmax(axis=1) == y).sum()
        n += y.size
    return acc_sum.asscalar() / n


def train_ch5(net, train_iter, test_iter, batch_size, trainer, ctx, num_epochs):
    print('training on', ctx)
    loss = gloss.SoftmaxCrossEntropyLoss()
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n, start = 0.0, 0.0, 0, time.time()
        for X, y in train_iter:
            X, y = X.as_in_context(ctx), y.as_in_context(ctx)
            with autograd.record():
                y_hat = net(X)
                l = loss(y_hat, y).sum()
            l.backward()
            trainer.step(batch_size)
            y = y.astype('float32')
            train_l_sum += l.asscalar()
            train_acc_sum += (y_hat.argmax(axis=1) == y).sum().asscalar()
            n += y.size
        test_acc = evaluate_accuracy(test_iter, net, ctx)
        print('epoch %d, loss %.4f, train acc %.3f, test acc %.3f, time %.1f sec'
              % (epoch + 1, train_l_sum / n, train_acc_sum / n, test_acc, time.time() - start))


batch_size = 256
train_iter, test_iter = load_data_fashion_mnist(batch_size, resize=224)

lr, num_epochs, ctx = 0.01, 5, try_gpu()
net.initialize(force_reinit=True, ctx=ctx, init=init.Xavier())
trainer = gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': lr})
train_ch5(net, train_iter, test_iter, batch_size, trainer, ctx, num_epochs)

```
```Python
# 各输出层形状：
conv0 output shape:	 (1, 96, 54, 54)
pool0 output shape:	 (1, 96, 26, 26)
conv1 output shape:	 (1, 256, 26, 26)
pool1 output shape:	 (1, 256, 12, 12)
conv2 output shape:	 (1, 384, 12, 12)
conv3 output shape:	 (1, 384, 12, 12)
conv4 output shape:	 (1, 256, 12, 12)
pool2 output shape:	 (1, 256, 5, 5)
dense0 output shape:	 (1, 4096)
dropout0 output shape:	 (1, 4096)
dense1 output shape:	 (1, 4096)
dropout1 output shape:	 (1, 4096)
dense2 output shape:	 (1, 10)
```
```Python
Outputs:
# epochs = 5
# batch_size = 128
training on gpu(1)
epoch 1, loss 1.2973, train acc 0.513, test acc 0.751, time 167.6 sec
epoch 2, loss 0.6495, train acc 0.756, test acc 0.809, time 166.3 sec
epoch 3, loss 0.5321, train acc 0.801, test acc 0.837, time 166.4 sec
epoch 4, loss 0.4692, train acc 0.828, test acc 0.855, time 166.9 sec
epoch 5, loss 0.4257, train acc 0.845, test acc 0.870, time 167.1 sec
# batch_size = 256
training on gpu(1)
epoch 1, loss 1.7323, train acc 0.357, test acc 0.690, time 92.6 sec
epoch 2, loss 0.8324, train acc 0.687, test acc 0.765, time 92.3 sec
epoch 3, loss 0.6641, train acc 0.751, test acc 0.798, time 92.6 sec
epoch 4, loss 0.5804, train acc 0.784, test acc 0.814, time 92.7 sec
epoch 5, loss 0.5285, train acc 0.804, test acc 0.835, time 92.6 sec
# batch_size = 512
training on gpu(1)
epoch 1, loss 2.2216, train acc 0.183, test acc 0.505, time 61.7 sec
epoch 2, loss 1.1832, train acc 0.545, test acc 0.678, time 61.6 sec
epoch 3, loss 0.8663, train acc 0.669, test acc 0.743, time 61.6 sec
epoch 4, loss 0.7485, train acc 0.718, test acc 0.769, time 61.5 sec
epoch 5, loss 0.6768, train acc 0.747, test acc 0.787, time 61.6 sec
# epochs = 10
# batch_size = 128
training on gpu(3)
epoch  1, loss 1.3067, train acc 0.511, test acc 0.728, time 169.7 sec
epoch  2, loss 0.6504, train acc 0.758, test acc 0.807, time 165.9 sec
epoch  3, loss 0.5331, train acc 0.801, test acc 0.841, time 165.2 sec
epoch  4, loss 0.4644, train acc 0.829, test acc 0.860, time 166.3 sec
epoch  5, loss 0.4256, train acc 0.844, test acc 0.864, time 166.2 sec
epoch  6, loss 0.3937, train acc 0.856, test acc 0.876, time 166.8 sec
epoch  7, loss 0.3722, train acc 0.865, test acc 0.878, time 167.0 sec
epoch  8, loss 0.3540, train acc 0.871, test acc 0.885, time 166.8 sec
epoch  9, loss 0.3396, train acc 0.877, test acc 0.886, time 166.1 sec
epoch 10, loss 0.3251, train acc 0.881, test acc 0.891, time 165.6 sec
# batch_size =256
epoch  1, loss 1.7256, train acc 0.356, test acc 0.667, time 100.7 sec
epoch  2, loss 0.8327, train acc 0.687, test acc 0.760, time 98.0 sec
epoch  3, loss 0.6660, train acc 0.750, test acc 0.803, time 98.2 sec
epoch  4, loss 0.5800, train acc 0.785, test acc 0.818, time 97.8 sec
epoch  5, loss 0.5286, train acc 0.803, test acc 0.830, time 97.8 sec
epoch  6, loss 0.4896, train acc 0.820, test acc 0.850, time 97.0 sec
epoch  7, loss 0.4584, train acc 0.832, test acc 0.858, time 97.9 sec
epoch  8, loss 0.4357, train acc 0.841, test acc 0.861, time 98.0 sec
epoch  9, loss 0.4162, train acc 0.847, test acc 0.869, time 99.0 sec
epoch 10, loss 0.3980, train acc 0.855, test acc 0.873, time 96.7 sec
# batch_size = 512
epoch  1, loss 2.2264, train acc 0.186, test acc 0.499, time 67.4 sec
epoch  2, loss 1.1839, train acc 0.547, test acc 0.688, time 60.6 sec
epoch  3, loss 0.8716, train acc 0.670, test acc 0.723, time 59.7 sec
epoch  4, loss 0.7464, train acc 0.722, test acc 0.763, time 60.1 sec
epoch  5, loss 0.6740, train acc 0.748, test acc 0.792, time 60.1 sec
epoch  6, loss 0.6182, train acc 0.770, test acc 0.802, time 60.1 sec
epoch  7, loss 0.5781, train acc 0.786, test acc 0.818, time 59.8 sec
epoch  8, loss 0.5479, train acc 0.796, test acc 0.824, time 60.5 sec
epoch  9, loss 0.5188, train acc 0.808, test acc 0.835, time 60.0 sec
epoch 10, loss 0.4988, train acc 0.816, test acc 0.845, time 60.1 sec
# epochs = 20
# batch_size = 128
epoch  1, loss 1.3055, train acc 0.510, test acc 0.734, time 173.0 sec
epoch  2, loss 0.6487, train acc 0.757, test acc 0.811, time 170.5 sec
epoch  3, loss 0.5282, train acc 0.802, test acc 0.840, time 167.3 sec
epoch  4, loss 0.4642, train acc 0.829, test acc 0.860, time 165.2 sec
epoch  5, loss 0.4230, train acc 0.844, test acc 0.863, time 165.3 sec
epoch  6, loss 0.3946, train acc 0.856, test acc 0.873, time 166.0 sec
epoch  7, loss 0.3714, train acc 0.865, test acc 0.881, time 166.1 sec
epoch  8, loss 0.3557, train acc 0.870, test acc 0.887, time 164.8 sec
epoch  9, loss 0.3408, train acc 0.876, test acc 0.892, time 165.5 sec
epoch 10, loss 0.3260, train acc 0.881, test acc 0.890, time 166.8 sec
epoch 11, loss 0.3177, train acc 0.885, test acc 0.896, time 166.8 sec
epoch 12, loss 0.3061, train acc 0.887, test acc 0.895, time 165.8 sec
epoch 13, loss 0.2969, train acc 0.891, test acc 0.896, time 166.2 sec
epoch 14, loss 0.2897, train acc 0.894, test acc 0.900, time 163.5 sec
epoch 15, loss 0.2823, train acc 0.897, test acc 0.902, time 161.8 sec
epoch 16, loss 0.2754, train acc 0.899, test acc 0.902, time 161.8 sec
epoch 17, loss 0.2689, train acc 0.901, test acc 0.908, time 161.8 sec
epoch 18, loss 0.2614, train acc 0.904, test acc 0.907, time 162.1 sec
epoch 19, loss 0.2552, train acc 0.906, test acc 0.910, time 162.3 sec
epoch 20, loss 0.2499, train acc 0.908, test acc 0.908, time 162.2 sec
# batch_size = 256
epoch  1, loss 1.7151, train acc 0.362, test acc 0.679, time 95.2 sec
epoch  2, loss 0.8305, train acc 0.687, test acc 0.764, time 92.3 sec
epoch  3, loss 0.6627, train acc 0.753, test acc 0.803, time 92.4 sec
epoch  4, loss 0.5785, train acc 0.784, test acc 0.821, time 92.7 sec
epoch  5, loss 0.5272, train acc 0.803, test acc 0.831, time 92.5 sec
epoch  6, loss 0.4880, train acc 0.821, test acc 0.852, time 92.4 sec
epoch  7, loss 0.4583, train acc 0.832, test acc 0.858, time 92.5 sec
epoch  8, loss 0.4338, train acc 0.841, test acc 0.863, time 92.4 sec
epoch  9, loss 0.4149, train acc 0.848, test acc 0.871, time 92.3 sec
epoch 10, loss 0.3982, train acc 0.854, test acc 0.873, time 92.2 sec
epoch 11, loss 0.3838, train acc 0.858, test acc 0.877, time 92.2 sec
epoch 12, loss 0.3721, train acc 0.863, test acc 0.878, time 92.5 sec
epoch 13, loss 0.3598, train acc 0.869, test acc 0.882, time 92.2 sec
epoch 14, loss 0.3506, train acc 0.872, test acc 0.885, time 92.3 sec
epoch 15, loss 0.3412, train acc 0.875, test acc 0.887, time 92.7 sec
epoch 16, loss 0.3340, train acc 0.878, test acc 0.886, time 92.4 sec
epoch 17, loss 0.3278, train acc 0.881, test acc 0.892, time 92.3 sec
epoch 18, loss 0.3181, train acc 0.884, test acc 0.892, time 92.4 sec
epoch 19, loss 0.3146, train acc 0.887, test acc 0.893, time 92.4 sec
epoch 20, loss 0.3091, train acc 0.888, test acc 0.895, time 92.4 sec
# batch_size = 512
epoch 1, loss 2.2167, train acc 0.188, test acc 0.516, time 64.0 sec
epoch 2, loss 1.1710, train acc 0.552, test acc 0.704, time 58.7 sec
epoch 3, loss 0.8665, train acc 0.672, test acc 0.732, time 59.5 sec
epoch 4, loss 0.7495, train acc 0.717, test acc 0.769, time 59.7 sec
epoch 5, loss 0.6709, train acc 0.752, test acc 0.791, time 59.5 sec
epoch 6, loss 0.6196, train acc 0.769, test acc 0.801, time 59.6 sec
epoch 7, loss 0.5763, train acc 0.786, test acc 0.812, time 59.8 sec
epoch 8, loss 0.5459, train acc 0.797, test acc 0.819, time 59.7 sec
epoch 9, loss 0.5198, train acc 0.805, test acc 0.834, time 59.3 sec
epoch 10, loss 0.5006, train acc 0.815, test acc 0.846, time 59.5 sec
epoch 11, loss 0.4800, train acc 0.821, test acc 0.849, time 59.7 sec
epoch 12, loss 0.4649, train acc 0.829, test acc 0.852, time 59.4 sec
epoch 13, loss 0.4513, train acc 0.833, test acc 0.860, time 60.3 sec
epoch 14, loss 0.4383, train acc 0.838, test acc 0.860, time 59.7 sec
epoch 15, loss 0.4259, train acc 0.844, test acc 0.862, time 59.2 sec
epoch 16, loss 0.4174, train acc 0.846, test acc 0.869, time 59.3 sec
epoch 17, loss 0.4057, train acc 0.852, test acc 0.870, time 59.5 sec
epoch 18, loss 0.3984, train acc 0.854, test acc 0.874, time 59.7 sec
epoch 19, loss 0.3893, train acc 0.857, test acc 0.873, time 59.7 sec
epoch 20, loss 0.3844, train acc 0.860, test acc 0.875, time 59.5 sec
# epoch = 100
# batch_size = 656
epoch  1, loss 2.2770, train acc 0.149, test acc 0.373, time 56.5 sec
epoch  2, loss 1.5185, train acc 0.444, test acc 0.618, time 51.4 sec
epoch  3, loss 0.9619, train acc 0.632, test acc 0.712, time 51.0 sec
epoch  4, loss 0.8345, train acc 0.684, test acc 0.741, time 51.0 sec
epoch  5, loss 0.7410, train acc 0.722, test acc 0.770, time 51.2 sec
epoch  6, loss 0.6810, train acc 0.747, test acc 0.780, time 51.4 sec
epoch  7, loss 0.6360, train acc 0.762, test acc 0.794, time 51.6 sec
epoch  8, loss 0.5969, train acc 0.778, test acc 0.810, time 51.2 sec
epoch  9, loss 0.5677, train acc 0.788, test acc 0.819, time 51.3 sec
epoch 10, loss 0.5440, train acc 0.796, test acc 0.821, time 51.3 sec
epoch 11, loss 0.5219, train acc 0.806, test acc 0.833, time 51.4 sec
epoch 12, loss 0.5035, train acc 0.814, test acc 0.836, time 51.8 sec
epoch 13, loss 0.4903, train acc 0.819, test acc 0.848, time 51.4 sec
epoch 14, loss 0.4736, train acc 0.826, test acc 0.852, time 51.3 sec
epoch 15, loss 0.4621, train acc 0.830, test acc 0.855, time 51.2 sec
epoch 16, loss 0.4509, train acc 0.832, test acc 0.855, time 51.6 sec
epoch 17, loss 0.4432, train acc 0.838, test acc 0.858, time 51.6 sec
epoch 18, loss 0.4297, train acc 0.843, test acc 0.860, time 51.4 sec
epoch 19, loss 0.4213, train acc 0.846, test acc 0.867, time 51.9 sec
epoch 20, loss 0.4171, train acc 0.847, test acc 0.869, time 51.8 sec
epoch 21, loss 0.4068, train acc 0.851, test acc 0.868, time 51.7 sec
epoch 22, loss 0.3996, train acc 0.855, test acc 0.874, time 51.5 sec
epoch 23, loss 0.3922, train acc 0.858, test acc 0.872, time 51.7 sec
epoch 24, loss 0.3855, train acc 0.860, test acc 0.877, time 51.7 sec
epoch 25, loss 0.3808, train acc 0.861, test acc 0.877, time 51.3 sec
epoch 26, loss 0.3771, train acc 0.862, test acc 0.881, time 51.7 sec
epoch 27, loss 0.3714, train acc 0.866, test acc 0.880, time 51.9 sec
epoch 28, loss 0.3651, train acc 0.867, test acc 0.879, time 51.2 sec
epoch 29, loss 0.3590, train acc 0.869, test acc 0.883, time 51.6 sec
epoch 30, loss 0.3544, train acc 0.872, test acc 0.882, time 51.5 sec
epoch 31, loss 0.3512, train acc 0.872, test acc 0.886, time 51.7 sec
epoch 32, loss 0.3456, train acc 0.874, test acc 0.888, time 51.8 sec
epoch 33, loss 0.3411, train acc 0.875, test acc 0.889, time 52.0 sec
epoch 34, loss 0.3402, train acc 0.876, test acc 0.883, time 51.7 sec
epoch 35, loss 0.3354, train acc 0.878, test acc 0.890, time 51.6 sec
epoch 36, loss 0.3315, train acc 0.879, test acc 0.889, time 51.6 sec
epoch 37, loss 0.3284, train acc 0.880, test acc 0.892, time 51.5 sec
epoch 38, loss 0.3253, train acc 0.881, test acc 0.892, time 51.6 sec
epoch 39, loss 0.3213, train acc 0.883, test acc 0.892, time 51.5 sec
epoch 40, loss 0.3172, train acc 0.885, test acc 0.892, time 51.5 sec
epoch 41, loss 0.3156, train acc 0.884, test acc 0.892, time 51.6 sec
epoch 42, loss 0.3107, train acc 0.886, test acc 0.895, time 51.4 sec
epoch 43, loss 0.3069, train acc 0.889, test acc 0.898, time 51.7 sec
epoch 44, loss 0.3081, train acc 0.887, test acc 0.894, time 51.7 sec
epoch 45, loss 0.3044, train acc 0.889, test acc 0.896, time 51.4 sec
epoch 46, loss 0.2996, train acc 0.890, test acc 0.899, time 51.7 sec
epoch 47, loss 0.2984, train acc 0.891, test acc 0.894, time 51.8 sec
epoch 48, loss 0.2971, train acc 0.892, test acc 0.899, time 51.5 sec
epoch 49, loss 0.2942, train acc 0.892, test acc 0.899, time 51.7 sec
epoch 50, loss 0.2909, train acc 0.894, test acc 0.902, time 52.0 sec
epoch 51, loss 0.2883, train acc 0.894, test acc 0.900, time 51.8 sec
epoch 52, loss 0.2862, train acc 0.895, test acc 0.899, time 52.0 sec
epoch 53, loss 0.2852, train acc 0.896, test acc 0.899, time 51.5 sec
epoch 54, loss 0.2825, train acc 0.897, test acc 0.903, time 52.5 sec
epoch 55, loss 0.2811, train acc 0.897, test acc 0.903, time 51.7 sec
epoch 56, loss 0.2787, train acc 0.897, test acc 0.903, time 52.1 sec
epoch 57, loss 0.2760, train acc 0.899, test acc 0.903, time 52.1 sec
epoch 58, loss 0.2735, train acc 0.899, test acc 0.903, time 51.7 sec
epoch 59, loss 0.2705, train acc 0.901, test acc 0.904, time 51.9 sec
epoch 60, loss 0.2714, train acc 0.900, test acc 0.902, time 51.6 sec
epoch 61, loss 0.2701, train acc 0.901, test acc 0.906, time 51.9 sec
epoch 62, loss 0.2658, train acc 0.904, test acc 0.901, time 51.9 sec
epoch 63, loss 0.2628, train acc 0.903, test acc 0.905, time 52.0 sec
epoch 64, loss 0.2610, train acc 0.904, test acc 0.906, time 51.6 sec
epoch 65, loss 0.2625, train acc 0.903, test acc 0.906, time 51.4 sec
epoch 66, loss 0.2574, train acc 0.906, test acc 0.905, time 51.0 sec
epoch 67, loss 0.2568, train acc 0.906, test acc 0.908, time 51.4 sec
epoch 68, loss 0.2565, train acc 0.905, test acc 0.905, time 51.2 sec
epoch 69, loss 0.2528, train acc 0.907, test acc 0.909, time 51.3 sec
epoch 70, loss 0.2516, train acc 0.908, test acc 0.906, time 51.4 sec
epoch 71, loss 0.2505, train acc 0.909, test acc 0.909, time 52.1 sec
epoch 72, loss 0.2474, train acc 0.909, test acc 0.909, time 51.4 sec
epoch 73, loss 0.2454, train acc 0.909, test acc 0.909, time 51.3 sec
epoch 74, loss 0.2459, train acc 0.909, test acc 0.910, time 51.4 sec
epoch 75, loss 0.2425, train acc 0.910, test acc 0.909, time 52.0 sec
epoch 76, loss 0.2401, train acc 0.911, test acc 0.906, time 51.8 sec
epoch 77, loss 0.2393, train acc 0.912, test acc 0.911, time 51.4 sec
epoch 78, loss 0.2365, train acc 0.913, test acc 0.911, time 51.4 sec
epoch 79, loss 0.2363, train acc 0.913, test acc 0.910, time 51.9 sec
epoch 80, loss 0.2341, train acc 0.914, test acc 0.911, time 51.2 sec
epoch 81, loss 0.2322, train acc 0.914, test acc 0.910, time 51.6 sec
epoch 82, loss 0.2304, train acc 0.915, test acc 0.913, time 51.6 sec
epoch 83, loss 0.2297, train acc 0.915, test acc 0.911, time 51.6 sec
epoch 84, loss 0.2270, train acc 0.916, test acc 0.912, time 51.6 sec
epoch 85, loss 0.2252, train acc 0.916, test acc 0.912, time 51.6 sec
epoch 86, loss 0.2280, train acc 0.915, test acc 0.913, time 51.6 sec
epoch 87, loss 0.2238, train acc 0.916, test acc 0.915, time 51.6 sec
epoch 88, loss 0.2219, train acc 0.917, test acc 0.915, time 51.9 sec
epoch 89, loss 0.2203, train acc 0.919, test acc 0.915, time 51.5 sec
epoch 90, loss 0.2178, train acc 0.920, test acc 0.912, time 51.7 sec
epoch 91, loss 0.2184, train acc 0.919, test acc 0.915, time 51.6 sec
epoch 92, loss 0.2155, train acc 0.920, test acc 0.915, time 51.8 sec
epoch 93, loss 0.2128, train acc 0.922, test acc 0.914, time 51.4 sec
epoch 94, loss 0.2136, train acc 0.920, test acc 0.917, time 51.7 sec
epoch 95, loss 0.2112, train acc 0.921, test acc 0.916, time 51.6 sec
epoch 96, loss 0.2119, train acc 0.922, test acc 0.914, time 51.7 sec
epoch 97, loss 0.2094, train acc 0.923, test acc 0.914, time 51.7 sec
epoch 98, loss 0.2057, train acc 0.922, test acc 0.915, time 51.4 sec
epoch 99, loss 0.2026, train acc 0.925, test acc 0.917, time 51.2 sec
epoch 100, loss 0.2039, train acc 0.923, test acc 0.917, time 51.5 sec
```
## 使用重复元素的网络（VGG）

|名称|结构|说明|
|:--:|:--|:--|
|VGG块|①连续数个卷积层：channels=num_channels, padding=1，kernel_size=3<br>②最大池化层：strides=2, pool_size=2|卷积层保持输入的高和宽不变<br>池化层对其减半|
|VGG网络|①VGG块：单卷积层（通道64）<br>②VGG块：单卷积层（通道128）<br>③VGG块：双卷积层（通道256）<br>④VGG块：双卷积层（通道256）<br>⑤VGG块：双卷积层（通道512）<br>⑥全输出层：通道4096，激活函数ReLU<br>⑦丢弃层：丢弃概率0.5<br>⑧全输出层：通道4096，激活函数ReLU<br>⑨丢弃层：丢弃概率0.5<br>⑩全输出层：通道10|卷积层+全输出层|


```Python
import mxnet as mx
from mxnet import gluon, init, autograd, nd
from mxnet.gluon import data as gdata, loss as gloss, nn
import sys, os, time


# VGG块
def vgg_block(num_convs, num_channels):
    blk = nn.Sequential()
    for _ in range(num_convs):
        blk.add(nn.Conv2D(channels=num_channels,
                          kernel_size=3,
                          padding=1,
                          activation='relu'))
    blk.add(nn.MaxPool2D(pool_size=2, strides=2))
    return blk


# VGG模型
def vgg(conv_arch):
    net = nn.Sequential()
    # 卷积层部分
    for (num_convs, num_channels) in conv_arch:
        net.add(vgg_block(num_convs, num_channels))
    # 全连接层部分
    net.add(nn.Dense(4096, activation='relu'),
            nn.Dropout(0.5),
            nn.Dense(4096, activation='relu'),
            nn.Dropout(0.5),
            nn.Dense(10))
    return net


def load_data_fashion_mnist(batch_size, resize=None, root=os.path.join('-', 'mxnet', 'datasets', 'fashion-mnist')):
    root = os.path.expanduser(root)  # 展开用户路径
    transformer = []
    if resize:
        transformer += [gdata.vision.transforms.Resize(resize)]
    transformer += [gdata.vision.transforms.ToTensor()]
    transformer = gdata.vision.transforms.Compose(transformer)

    mnist_train = gdata.vision.FashionMNIST(root=root, train=True)
    mnist_test = gdata.vision.FashionMNIST(root=root, train=False)

    num_workers = 0 if sys.platform.startswith('win') else 4

    train_iter = gdata.DataLoader(mnist_train.transform_first(transformer),
                                  batch_size=batch_size,
                                  shuffle=True,
                                  num_workers=num_workers)
    test_iter = gdata.DataLoader(mnist_test.transform_first(transformer),
                                 batch_size=batch_size,
                                 shuffle=True,
                                 num_workers=num_workers)
    return train_iter, test_iter


def try_gpu():
    try:
        ctx = mx.gpu()
        _ = nd.array((1,), ctx=ctx)
    except mx.base.MXNetError:
        ctx = mx.cpu()
    return ctx


def evaluate_accuracy(data_iter, net, ctx):
    acc_sum, n = nd.array([0], ctx=ctx), 0
    for X, y in data_iter:
        X, y = X.as_in_context(ctx), y.as_in_context(ctx).astype('float32')
        acc_sum += (net(X).argmax(axis=1) == y).sum()
        n += y.size
    return acc_sum.asscalar() / n


def train(net, train_iter, test_iter, batch_size, trainer, ctx, num_epochs):
    print('training on', ctx)
    loss = gloss.SoftmaxCrossEntropyLoss()
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n, start = 0.0, 0.0, 0, time.time()
        for X, y in train_iter:
            X, y = X.as_in_context(ctx), y.as_in_context(ctx)
            with autograd.record():
                y_hat = net(X)
                l = loss(y_hat, y).sum()
            l.backward()
            trainer.step(batch_size)
            y = y.astype('float32')
            train_l_sum += l.asscalar()
            train_acc_sum += (y_hat.argmax(axis=1) == y).sum().asscalar()
            n += y.size
        test_acc = evaluate_accuracy(test_iter, net, ctx)
        print('epoch %3d, loss %.4f, train acc %.3f, test acc %.3f, time %.1f sec'
              % (epoch + 1, train_l_sum / n, train_acc_sum / n, test_acc, time.time() - start))


# VGG超参数
conv_arch = ((1, 64), (1, 128), (2, 256), (2, 512), (2, 512))

# 模型
net = vgg(conv_arch)
net.initialize()
X = nd.random.uniform(shape=(1, 1, 224, 224))
for blk in net:
    X = blk(X)
    print(blk.name, "output shape:\t", X.shape)

ratio = 4
small_conv_arch = [(pair[0], pair[1] // ratio) for pair in conv_arch]
lr, num_epochs, batch_size, ctx = 0.05, 5, 128, try_gpu()
net = vgg(small_conv_arch)
net.initialize(ctx=ctx, init=init.Xavier())
trainer = gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': lr})
train_iter, test_iter = load_data_fashion_mnist(batch_size, resize=224)
train(net, train_iter, test_iter, batch_size, trainer, ctx, num_epochs)

```
```Python
# 各层输出形状：
sequential1 output shape:	 (1, 64, 112, 112)
sequential2 output shape:	 (1, 128, 56, 56)
sequential3 output shape:	 (1, 256, 28, 28)
sequential4 output shape:	 (1, 512, 14, 14)
sequential5 output shape:	 (1, 512, 7, 7)
dense0 output shape:	 (1, 4096)
dropout0 output shape:	 (1, 4096)
dense1 output shape:	 (1, 4096)
dropout1 output shape:	 (1, 4096)
dense2 output shape:	 (1, 10)
```
```Python
# resize = 224
training on gpu(3):
epoch   1, loss 1.2946, train acc 0.539, test acc 0.807, time 90.9 sec
epoch   2, loss 0.5078, train acc 0.811, test acc 0.864, time 89.9 sec
epoch   3, loss 0.4057, train acc 0.851, test acc 0.880, time 90.4 sec
epoch   4, loss 0.3542, train acc 0.871, test acc 0.891, time 90.7 sec
epoch   5, loss 0.3230, train acc 0.883, test acc 0.897, time 91.1 sec
epoch   6, loss 0.2969, train acc 0.891, test acc 0.907, time 90.3 sec
epoch   7, loss 0.2727, train acc 0.900, test acc 0.905, time 91.3 sec
epoch   8, loss 0.2591, train acc 0.904, test acc 0.910, time 90.9 sec
epoch   9, loss 0.2417, train acc 0.911, test acc 0.915, time 90.5 sec
epoch  10, loss 0.2295, train acc 0.916, test acc 0.917, time 90.7 sec
epoch  11, loss 0.2159, train acc 0.920, test acc 0.920, time 91.2 sec
epoch  12, loss 0.2051, train acc 0.925, test acc 0.919, time 91.0 sec
epoch  13, loss 0.1918, train acc 0.929, test acc 0.925, time 91.4 sec
epoch  14, loss 0.1814, train acc 0.933, test acc 0.924, time 90.3 sec
epoch  15, loss 0.1695, train acc 0.937, test acc 0.929, time 91.0 sec
epoch  16, loss 0.1625, train acc 0.941, test acc 0.931, time 91.1 sec
epoch  17, loss 0.1535, train acc 0.944, test acc 0.928, time 91.4 sec
epoch  18, loss 0.1418, train acc 0.948, test acc 0.928, time 91.0 sec
epoch  19, loss 0.1328, train acc 0.950, test acc 0.931, time 90.6 sec
epoch  20, loss 0.1222, train acc 0.955, test acc 0.929, time 89.9 sec
epoch  21, loss 0.1165, train acc 0.957, test acc 0.932, time 89.7 sec
epoch  22, loss 0.1051, train acc 0.960, test acc 0.931, time 89.5 sec
epoch  23, loss 0.0990, train acc 0.963, test acc 0.935, time 89.1 sec
epoch  24, loss 0.0904, train acc 0.967, test acc 0.935, time 89.3 sec
epoch  25, loss 0.0836, train acc 0.969, test acc 0.933, time 89.2 sec
epoch  26, loss 0.0796, train acc 0.971, test acc 0.932, time 89.5 sec
epoch  27, loss 0.0721, train acc 0.973, test acc 0.932, time 89.2 sec
epoch  28, loss 0.0663, train acc 0.975, test acc 0.932, time 88.9 sec
epoch  29, loss 0.0602, train acc 0.978, test acc 0.930, time 89.1 sec
epoch  30, loss 0.0541, train acc 0.980, test acc 0.933, time 89.4 sec
epoch  31, loss 0.0514, train acc 0.981, test acc 0.930, time 89.1 sec
epoch  32, loss 0.0472, train acc 0.982, test acc 0.932, time 89.1 sec
epoch  33, loss 0.0425, train acc 0.984, test acc 0.935, time 88.8 sec
epoch  34, loss 0.0394, train acc 0.985, test acc 0.930, time 88.8 sec
epoch  35, loss 0.0374, train acc 0.986, test acc 0.931, time 89.2 sec
epoch  36, loss 0.0330, train acc 0.988, test acc 0.933, time 89.3 sec
epoch  37, loss 0.0334, train acc 0.988, test acc 0.934, time 89.3 sec
epoch  38, loss 0.0313, train acc 0.989, test acc 0.935, time 89.8 sec
epoch  39, loss 0.0263, train acc 0.991, test acc 0.936, time 88.7 sec
epoch  40, loss 0.0257, train acc 0.991, test acc 0.933, time 88.5 sec
epoch  41, loss 0.0259, train acc 0.990, test acc 0.934, time 88.9 sec
epoch  42, loss 0.0216, train acc 0.992, test acc 0.934, time 88.8 sec
epoch  43, loss 0.0216, train acc 0.993, test acc 0.935, time 89.2 sec
epoch  44, loss 0.0208, train acc 0.992, test acc 0.938, time 89.0 sec
epoch  45, loss 0.0196, train acc 0.993, test acc 0.935, time 89.1 sec
epoch  46, loss 0.0164, train acc 0.994, test acc 0.939, time 88.1 sec
epoch  47, loss 0.0153, train acc 0.995, test acc 0.936, time 88.3 sec
epoch  48, loss 0.0163, train acc 0.994, test acc 0.936, time 88.5 sec
epoch  49, loss 0.0150, train acc 0.995, test acc 0.934, time 89.3 sec
epoch  50, loss 0.0147, train acc 0.995, test acc 0.938, time 89.6 sec
epoch  51, loss 0.0172, train acc 0.994, test acc 0.935, time 89.5 sec
epoch  52, loss 0.0134, train acc 0.995, test acc 0.935, time 89.1 sec
epoch  53, loss 0.0127, train acc 0.995, test acc 0.937, time 89.4 sec
epoch  54, loss 0.0124, train acc 0.996, test acc 0.934, time 89.6 sec
epoch  55, loss 0.0093, train acc 0.997, test acc 0.935, time 89.8 sec
epoch  56, loss 0.0117, train acc 0.996, test acc 0.933, time 89.4 sec
epoch  57, loss 0.0112, train acc 0.996, test acc 0.938, time 89.7 sec
epoch  58, loss 0.0102, train acc 0.996, test acc 0.934, time 89.5 sec
epoch  59, loss 0.0104, train acc 0.996, test acc 0.936, time 89.4 sec
epoch  60, loss 0.0100, train acc 0.997, test acc 0.935, time 89.2 sec
epoch  61, loss 0.0087, train acc 0.997, test acc 0.936, time 89.8 sec
epoch  62, loss 0.0081, train acc 0.997, test acc 0.937, time 90.6 sec
epoch  63, loss 0.0086, train acc 0.997, test acc 0.935, time 90.0 sec
epoch  64, loss 0.0080, train acc 0.998, test acc 0.935, time 90.1 sec
epoch  65, loss 0.0076, train acc 0.997, test acc 0.936, time 89.6 sec
epoch  66, loss 0.0084, train acc 0.997, test acc 0.937, time 90.1 sec
epoch  67, loss 0.0075, train acc 0.997, test acc 0.934, time 90.3 sec
epoch  68, loss 0.0083, train acc 0.997, test acc 0.935, time 89.8 sec
epoch  69, loss 0.0086, train acc 0.997, test acc 0.931, time 89.8 sec
epoch  70, loss 0.0077, train acc 0.997, test acc 0.935, time 89.4 sec
epoch  71, loss 0.0069, train acc 0.998, test acc 0.937, time 89.6 sec
epoch  72, loss 0.0065, train acc 0.998, test acc 0.935, time 89.9 sec
epoch  73, loss 0.0064, train acc 0.998, test acc 0.938, time 89.6 sec
epoch  74, loss 0.0054, train acc 0.998, test acc 0.937, time 89.6 sec
epoch  75, loss 0.0068, train acc 0.998, test acc 0.936, time 89.9 sec
epoch  76, loss 0.0067, train acc 0.998, test acc 0.935, time 89.6 sec
epoch  77, loss 0.0053, train acc 0.998, test acc 0.933, time 89.3 sec
epoch  78, loss 0.0060, train acc 0.998, test acc 0.937, time 89.8 sec
epoch  79, loss 0.0062, train acc 0.998, test acc 0.936, time 89.1 sec
epoch  80, loss 0.0064, train acc 0.998, test acc 0.935, time 87.5 sec
epoch  81, loss 0.0056, train acc 0.998, test acc 0.937, time 87.3 sec
epoch  82, loss 0.0053, train acc 0.998, test acc 0.936, time 87.4 sec
epoch  83, loss 0.0060, train acc 0.998, test acc 0.936, time 87.5 sec
epoch  84, loss 0.0056, train acc 0.998, test acc 0.936, time 87.4 sec
epoch  85, loss 0.0045, train acc 0.998, test acc 0.937, time 87.3 sec
epoch  86, loss 0.0038, train acc 0.999, test acc 0.934, time 87.8 sec
epoch  87, loss 0.0047, train acc 0.998, test acc 0.937, time 88.0 sec
epoch  88, loss 0.0040, train acc 0.999, test acc 0.935, time 87.7 sec
epoch  89, loss 0.0048, train acc 0.998, test acc 0.936, time 88.0 sec
epoch  90, loss 0.0040, train acc 0.999, test acc 0.936, time 87.8 sec
epoch  91, loss 0.0040, train acc 0.999, test acc 0.934, time 87.4 sec
epoch  92, loss 0.0039, train acc 0.999, test acc 0.934, time 87.1 sec
epoch  93, loss 0.0042, train acc 0.999, test acc 0.936, time 87.3 sec
epoch  94, loss 0.0046, train acc 0.998, test acc 0.938, time 87.8 sec
epoch  95, loss 0.0029, train acc 0.999, test acc 0.936, time 87.7 sec
epoch  96, loss 0.0027, train acc 0.999, test acc 0.936, time 87.8 sec
epoch  97, loss 0.0040, train acc 0.999, test acc 0.936, time 87.2 sec
epoch  98, loss 0.0046, train acc 0.998, test acc 0.938, time 87.2 sec
epoch  99, loss 0.0031, train acc 0.999, test acc 0.937, time 87.2 sec
epoch 100, loss 0.0035, train acc 0.999, test acc 0.937, time 87.7 sec
# resize = 96
epoch   1, loss 1.7834, train acc 0.372, test acc 0.724, time 46.8 sec
epoch   2, loss 0.6941, train acc 0.739, test acc 0.804, time 45.4 sec
epoch   3, loss 0.5067, train acc 0.814, test acc 0.846, time 45.6 sec
epoch   4, loss 0.4310, train acc 0.841, test acc 0.864, time 45.8 sec
epoch   5, loss 0.3872, train acc 0.859, test acc 0.872, time 45.8 sec
epoch   6, loss 0.3586, train acc 0.870, test acc 0.872, time 45.7 sec
epoch   7, loss 0.3350, train acc 0.877, test acc 0.885, time 45.7 sec
epoch   8, loss 0.3170, train acc 0.884, test acc 0.888, time 45.6 sec
epoch   9, loss 0.3008, train acc 0.889, test acc 0.891, time 45.7 sec
epoch  10, loss 0.2846, train acc 0.896, test acc 0.897, time 45.7 sec
epoch  11, loss 0.2729, train acc 0.899, test acc 0.900, time 45.8 sec
epoch  12, loss 0.2606, train acc 0.904, test acc 0.903, time 45.6 sec
epoch  13, loss 0.2486, train acc 0.908, test acc 0.910, time 45.7 sec
epoch  14, loss 0.2406, train acc 0.911, test acc 0.909, time 45.7 sec
epoch  15, loss 0.2319, train acc 0.914, test acc 0.911, time 45.5 sec
epoch  16, loss 0.2223, train acc 0.917, test acc 0.908, time 45.8 sec
epoch  17, loss 0.2144, train acc 0.920, test acc 0.916, time 45.6 sec
epoch  18, loss 0.2042, train acc 0.924, test acc 0.912, time 45.6 sec
epoch  19, loss 0.1964, train acc 0.927, test acc 0.912, time 45.6 sec
epoch  20, loss 0.1870, train acc 0.930, test acc 0.914, time 45.6 sec
epoch  21, loss 0.1796, train acc 0.933, test acc 0.916, time 45.6 sec
epoch  22, loss 0.1733, train acc 0.936, test acc 0.917, time 45.6 sec
epoch  23, loss 0.1619, train acc 0.940, test acc 0.920, time 45.5 sec
epoch  24, loss 0.1566, train acc 0.942, test acc 0.918, time 45.6 sec
epoch  25, loss 0.1495, train acc 0.944, test acc 0.922, time 45.5 sec
epoch  26, loss 0.1418, train acc 0.947, test acc 0.920, time 45.5 sec
epoch  27, loss 0.1364, train acc 0.948, test acc 0.920, time 45.6 sec
epoch  28, loss 0.1276, train acc 0.952, test acc 0.923, time 45.4 sec
epoch  29, loss 0.1218, train acc 0.954, test acc 0.919, time 45.6 sec
epoch  30, loss 0.1164, train acc 0.957, test acc 0.924, time 45.6 sec
epoch  31, loss 0.1098, train acc 0.958, test acc 0.922, time 45.6 sec
epoch  32, loss 0.1035, train acc 0.960, test acc 0.921, time 45.5 sec
epoch  33, loss 0.0977, train acc 0.963, test acc 0.921, time 45.4 sec
epoch  34, loss 0.0948, train acc 0.965, test acc 0.921, time 45.5 sec
epoch  35, loss 0.0866, train acc 0.968, test acc 0.923, time 45.4 sec
epoch  36, loss 0.0831, train acc 0.968, test acc 0.924, time 45.3 sec
epoch  37, loss 0.0777, train acc 0.971, test acc 0.922, time 45.5 sec
epoch  38, loss 0.0750, train acc 0.972, test acc 0.922, time 45.4 sec
epoch  39, loss 0.0682, train acc 0.974, test acc 0.925, time 45.4 sec
epoch  40, loss 0.0636, train acc 0.976, test acc 0.925, time 45.4 sec
epoch  41, loss 0.0640, train acc 0.976, test acc 0.922, time 45.3 sec
epoch  42, loss 0.0549, train acc 0.980, test acc 0.923, time 45.5 sec
epoch  43, loss 0.0535, train acc 0.980, test acc 0.922, time 45.5 sec
epoch  44, loss 0.0527, train acc 0.980, test acc 0.920, time 45.6 sec
epoch  45, loss 0.0470, train acc 0.983, test acc 0.921, time 45.4 sec
epoch  46, loss 0.0458, train acc 0.983, test acc 0.925, time 45.4 sec
epoch  47, loss 0.0433, train acc 0.984, test acc 0.923, time 45.3 sec
epoch  48, loss 0.0396, train acc 0.985, test acc 0.920, time 45.4 sec
epoch  49, loss 0.0397, train acc 0.985, test acc 0.924, time 45.6 sec
epoch  50, loss 0.0347, train acc 0.987, test acc 0.923, time 45.4 sec
epoch  51, loss 0.0358, train acc 0.987, test acc 0.922, time 45.5 sec
epoch  52, loss 0.0314, train acc 0.989, test acc 0.921, time 45.7 sec
epoch  53, loss 0.0323, train acc 0.988, test acc 0.924, time 45.4 sec
epoch  54, loss 0.0313, train acc 0.989, test acc 0.922, time 45.4 sec
epoch  55, loss 0.0306, train acc 0.989, test acc 0.925, time 45.4 sec
epoch  56, loss 0.0260, train acc 0.991, test acc 0.924, time 45.4 sec
epoch  57, loss 0.0260, train acc 0.991, test acc 0.924, time 45.4 sec
epoch  58, loss 0.0290, train acc 0.989, test acc 0.924, time 45.6 sec
epoch  59, loss 0.0223, train acc 0.992, test acc 0.927, time 45.4 sec
epoch  60, loss 0.0218, train acc 0.992, test acc 0.926, time 45.4 sec
epoch  61, loss 0.0221, train acc 0.992, test acc 0.924, time 45.5 sec
epoch  62, loss 0.0189, train acc 0.993, test acc 0.927, time 45.5 sec
epoch  63, loss 0.0195, train acc 0.993, test acc 0.923, time 45.4 sec
epoch  64, loss 0.0178, train acc 0.994, test acc 0.923, time 45.5 sec
epoch  65, loss 0.0201, train acc 0.993, test acc 0.924, time 45.4 sec
epoch  66, loss 0.0192, train acc 0.993, test acc 0.923, time 45.3 sec
epoch  67, loss 0.0176, train acc 0.994, test acc 0.926, time 45.5 sec
epoch  68, loss 0.0155, train acc 0.994, test acc 0.924, time 45.5 sec
epoch  69, loss 0.0163, train acc 0.994, test acc 0.922, time 45.6 sec
epoch  70, loss 0.0139, train acc 0.995, test acc 0.922, time 45.4 sec
epoch  71, loss 0.0158, train acc 0.994, test acc 0.923, time 45.5 sec
epoch  72, loss 0.0164, train acc 0.994, test acc 0.926, time 45.5 sec
epoch  73, loss 0.0117, train acc 0.996, test acc 0.926, time 45.5 sec
epoch  74, loss 0.0141, train acc 0.995, test acc 0.926, time 45.5 sec
epoch  75, loss 0.0125, train acc 0.995, test acc 0.923, time 45.5 sec
epoch  76, loss 0.0139, train acc 0.995, test acc 0.925, time 45.5 sec
epoch  77, loss 0.0134, train acc 0.995, test acc 0.926, time 45.4 sec
epoch  78, loss 0.0090, train acc 0.997, test acc 0.922, time 45.5 sec
epoch  79, loss 0.0106, train acc 0.996, test acc 0.925, time 45.5 sec
epoch  80, loss 0.0117, train acc 0.996, test acc 0.925, time 45.5 sec
epoch  81, loss 0.0107, train acc 0.996, test acc 0.925, time 45.4 sec
epoch  82, loss 0.0106, train acc 0.996, test acc 0.922, time 45.4 sec
epoch  83, loss 0.0100, train acc 0.997, test acc 0.923, time 45.5 sec
epoch  84, loss 0.0097, train acc 0.997, test acc 0.926, time 45.5 sec
epoch  85, loss 0.0104, train acc 0.996, test acc 0.923, time 45.5 sec
epoch  86, loss 0.0110, train acc 0.996, test acc 0.925, time 45.4 sec
epoch  87, loss 0.0087, train acc 0.997, test acc 0.924, time 45.6 sec
epoch  88, loss 0.0114, train acc 0.996, test acc 0.927, time 45.5 sec
epoch  89, loss 0.0078, train acc 0.997, test acc 0.923, time 45.6 sec
epoch  90, loss 0.0081, train acc 0.997, test acc 0.925, time 45.5 sec
epoch  91, loss 0.0084, train acc 0.997, test acc 0.925, time 45.4 sec
epoch  92, loss 0.0068, train acc 0.998, test acc 0.926, time 45.4 sec
epoch  93, loss 0.0066, train acc 0.998, test acc 0.924, time 45.5 sec
epoch  94, loss 0.0104, train acc 0.997, test acc 0.926, time 45.4 sec
epoch  95, loss 0.0062, train acc 0.998, test acc 0.927, time 45.4 sec
epoch  96, loss 0.0065, train acc 0.998, test acc 0.925, time 45.5 sec
epoch  97, loss 0.0069, train acc 0.997, test acc 0.925, time 45.4 sec
epoch  98, loss 0.0075, train acc 0.997, test acc 0.926, time 45.5 sec
epoch  99, loss 0.0066, train acc 0.998, test acc 0.925, time 45.4 sec
epoch 100, loss 0.0074, train acc 0.998, test acc 0.925, time 45.4 sec
```
## 网络中的网络（NiN）

|名称|结构|说明|
|:--:|:--|:--|
|NiN块|①卷积层：num_channels, kernel_size, strides, padding<br>②1×1卷积层：num_channels, kernel_size=1, activation='relu'<br>③1×1卷积层：num_channels, kernel_size=1, activation='relu'|无|
|NiN网络|①NiN块：channels=96, kernel_size=11, strides=4, padding=0<br>②最大池化层：pool_size=3, strides=2<br>③NiN块：channels=256, kernel_size=5, strides=1, padding=2<br>④最大池化层：pool_size=3, strides=2<br>⑤NiN块：channels=384, kernel_size=3, strides=1, padding=1<br>⑥最大池化层：pool_size=3, strides=2<br>⑦丢弃层：丢弃概率0.5<br>⑧NiN块：channels=10, kernel_size=3, strides=1, padding=1<br>⑨全局平均池化层<br>⑩平整层：将四维转成二维，(批量大小，10)|无|


```Python
import mxnet as mx
from mxnet import gluon, init, autograd, nd
from mxnet.gluon import data as gdata, loss as gloss, nn
import sys, os, time


def nin_block(num_channels, kernel_size, strides, padding):
    blk = nn.Sequential()
    blk.add(nn.Conv2D(num_channels, kernel_size, strides, padding, activation='relu'),
            nn.Conv2D(num_channels, kernel_size=1, activation='relu'),
            nn.Conv2D(num_channels, kernel_size=1, activation='relu'))
    return blk


net = nn.Sequential()
net.add(nin_block(96, kernel_size=11, strides=4, padding=0),
        nn.MaxPool2D(pool_size=3, strides=2),

        nin_block(256, kernel_size=5, strides=1, padding=2),
        nn.MaxPool2D(pool_size=3, strides=2),

        nin_block(384, kernel_size=3, strides=1, padding=1),
        nn.MaxPool2D(pool_size=3, strides=2),

        nn.Dropout(0.5),
        # 标签类别10
        nin_block(10, kernel_size=3, strides=1, padding=1),
        # 全局平均池化层将窗口形状自动设置成输入的高河宽
        nn.GlobalAvgPool2D(),
        # 将四维的输出转成二维的输出，其形状为（批量大小，10)
        nn.Flatten())

X = nd.random.uniform(shape=(1, 1, 224, 224))
net.initialize()
for layer in net:
    X = layer(X)
    print(layer.name, 'output shape:\t', X.shape)


def load_data_fashion_mnist(batch_size, resize=None, root=os.path.join('mxnet', 'datasets', 'fashion-mnist')):
    root = os.path.expanduser(root)
    transformer = []
    if resize:
        transformer += [gdata.vision.transforms.Resize(resize)]
    transformer += [gdata.vision.transforms.ToTensor()]
    transformer = gdata.vision.transforms.Compose(transformer)

    mnist_train = gdata.vision.FashionMNIST(root=root, train=True)
    mnist_test = gdata.vision.FashionMNIST(root=root, train=False)

    num_workers = 0 if sys.platform.startswith('win') else 4
    train_iter = gdata.DataLoader(mnist_train.transform_first(transformer),
                                  batch_size=batch_size,
                                  shuffle=True,
                                  num_workers=num_workers)
    test_iter = gdata.DataLoader(mnist_test.transform_first(transformer),
                                 batch_size=batch_size,
                                 shuffle=True,
                                 num_workers=num_workers)
    return train_iter, test_iter


def evaluate_accuracy(net, data_iter, ctx):
    acc_sum, n = nd.array([0], ctx=ctx), 0
    for X, y in data_iter:
        X, y = X.as_in_context(ctx), y.as_in_context(ctx).astype('float32')
        y_hat = net(X)
        acc_sum += (y_hat.argmax(axis=1) == y).sum()
        n += y.size
    return acc_sum.asscalar() / n


def train(net, train_iter, test_iter, batch_size, trainer, ctx, num_epochs):
    print("training on ", ctx)
    loss = gloss.SoftmaxCrossEntropyLoss()
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n, start = 0.0, 0.0, 0, time.time()
        for X, y in train_iter:
            X, y = X.as_in_context(ctx), y.as_in_context(ctx)
            with autograd.record():
                y_hat = net(X)
                l = loss(y_hat, y).sum()
            l.backward()
            trainer.step(batch_size)
            train_l_sum += l.asscalar()
            train_acc_sum += (y_hat.argmax(axis=1) == y.astype('float32')).sum().asscalar()
            n += y.size
        test_acc = evaluate_accuracy(net, test_iter, ctx)
        print('epoch %3d, loss %.4f, train acc %.3f, test acc %.3f, time %.1f sec'
              % (epoch + 1, train_l_sum / n, train_acc_sum / n, test_acc, time.time() - start))


def try_gpu():
    try:
        ctx = mx.gpu()
        _ = nd.array((1,), ctx=ctx)
    except mx.base.MXNetError:
        ctx = mx.cpu()
    return ctx


lr, num_epochs, batch_size, ctx = 0.1, 5, 128, try_gpu()
net.initialize(force_reinit=True, init=init.Xavier(), ctx=ctx)
trainer = gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': lr})
train_iter, test_iter = load_data_fashion_mnist(batch_size, resize=224)
train(net, train_iter, test_iter, batch_size, trainer, ctx, num_epochs)

```
```Python
# 各层输出的形状：
sequential1 output shape:	 (1, 96, 54, 54)
pool0 output shape:	 (1, 96, 26, 26)
sequential2 output shape:	 (1, 256, 26, 26)
pool1 output shape:	 (1, 256, 12, 12)
sequential3 output shape:	 (1, 384, 12, 12)
pool2 output shape:	 (1, 384, 5, 5)
dropout0 output shape:	 (1, 384, 5, 5)
sequential4 output shape:	 (1, 10, 5, 5)
pool3 output shape:	 (1, 10, 1, 1)
flatten0 output shape:	 (1, 10)
```
```Python
training on gpu(1):
# NiN块两个1×1卷积层
epoch   1, loss 2.2408, train acc 0.187, test acc 0.418, time 45.0 sec
epoch   2, loss 1.1892, train acc 0.565, test acc 0.731, time 42.6 sec
epoch   3, loss 0.6967, train acc 0.746, test acc 0.801, time 46.4 sec
epoch   4, loss 0.5585, train acc 0.796, test acc 0.833, time 43.1 sec
epoch   5, loss 0.4827, train acc 0.822, test acc 0.851, time 42.9 sec
epoch   6, loss 0.4360, train acc 0.840, test acc 0.859, time 42.9 sec
epoch   7, loss 0.3934, train acc 0.854, test acc 0.866, time 43.2 sec
epoch   8, loss 0.3693, train acc 0.863, test acc 0.880, time 43.3 sec
epoch   9, loss 0.3500, train acc 0.870, test acc 0.883, time 43.0 sec
epoch  10, loss 0.3332, train acc 0.878, test acc 0.861, time 42.8 sec
epoch  11, loss 0.3225, train acc 0.882, test acc 0.883, time 42.8 sec
epoch  12, loss 0.3071, train acc 0.887, test acc 0.898, time 42.7 sec
epoch  13, loss 0.2971, train acc 0.890, test acc 0.902, time 42.7 sec
epoch  14, loss 0.2880, train acc 0.894, test acc 0.897, time 42.7 sec
epoch  15, loss 0.2780, train acc 0.899, test acc 0.905, time 42.8 sec
epoch  16, loss 0.2715, train acc 0.900, test acc 0.911, time 42.9 sec
epoch  17, loss 0.2629, train acc 0.904, test acc 0.907, time 42.6 sec
epoch  18, loss 0.2538, train acc 0.906, test acc 0.909, time 42.7 sec
epoch  19, loss 0.2494, train acc 0.910, test acc 0.916, time 42.8 sec
epoch  20, loss 0.2445, train acc 0.910, test acc 0.916, time 42.9 sec
epoch  21, loss 0.2396, train acc 0.911, test acc 0.914, time 42.8 sec
epoch  22, loss 0.2326, train acc 0.914, test acc 0.902, time 42.7 sec
epoch  23, loss 0.2276, train acc 0.917, test acc 0.919, time 42.7 sec
epoch  24, loss 0.2253, train acc 0.918, test acc 0.899, time 42.7 sec
epoch  25, loss 0.2184, train acc 0.920, test acc 0.919, time 42.8 sec
epoch  26, loss 0.2161, train acc 0.920, test acc 0.916, time 42.6 sec
epoch  27, loss 0.2114, train acc 0.923, test acc 0.923, time 42.7 sec
epoch  28, loss 0.2054, train acc 0.924, test acc 0.918, time 42.6 sec
epoch  29, loss 0.2014, train acc 0.926, test acc 0.921, time 42.7 sec
epoch  30, loss 0.2008, train acc 0.926, test acc 0.923, time 42.8 sec
epoch  31, loss 0.1953, train acc 0.929, test acc 0.924, time 42.9 sec
epoch  32, loss 0.1915, train acc 0.929, test acc 0.924, time 42.8 sec
epoch  33, loss 0.1866, train acc 0.931, test acc 0.922, time 42.7 sec
epoch  34, loss 0.1861, train acc 0.931, test acc 0.921, time 42.7 sec
epoch  35, loss 0.1797, train acc 0.934, test acc 0.927, time 42.6 sec
epoch  36, loss 0.1761, train acc 0.935, test acc 0.927, time 42.8 sec
epoch  37, loss 0.1727, train acc 0.937, test acc 0.929, time 42.8 sec
epoch  38, loss 0.1716, train acc 0.935, test acc 0.927, time 42.9 sec
epoch  39, loss 0.1683, train acc 0.938, test acc 0.922, time 42.8 sec
epoch  40, loss 0.1645, train acc 0.940, test acc 0.928, time 42.6 sec
epoch  41, loss 0.1598, train acc 0.941, test acc 0.919, time 42.7 sec
epoch  42, loss 0.1558, train acc 0.943, test acc 0.920, time 42.9 sec
epoch  43, loss 0.1542, train acc 0.943, test acc 0.924, time 42.6 sec
epoch  44, loss 0.1527, train acc 0.945, test acc 0.932, time 42.7 sec
epoch  45, loss 0.1491, train acc 0.945, test acc 0.924, time 42.8 sec
epoch  46, loss 0.1474, train acc 0.945, test acc 0.932, time 42.8 sec
epoch  47, loss 0.1419, train acc 0.947, test acc 0.926, time 42.8 sec
epoch  48, loss 0.1406, train acc 0.948, test acc 0.926, time 42.7 sec
epoch  49, loss 0.1377, train acc 0.949, test acc 0.931, time 42.6 sec
epoch  50, loss 0.1338, train acc 0.951, test acc 0.929, time 42.8 sec
# # NiN块一个1×1卷积层
epoch   1, loss 1.8875, train acc 0.342, test acc 0.612, time 32.8 sec
epoch   2, loss 0.7512, train acc 0.718, test acc 0.805, time 31.0 sec
epoch   3, loss 0.5529, train acc 0.800, test acc 0.835, time 30.6 sec
epoch   4, loss 0.4634, train acc 0.831, test acc 0.854, time 30.3 sec
epoch   5, loss 0.4178, train acc 0.849, test acc 0.873, time 30.4 sec
epoch   6, loss 0.3921, train acc 0.855, test acc 0.876, time 30.5 sec
epoch   7, loss 0.3671, train acc 0.866, test acc 0.881, time 30.7 sec
epoch   8, loss 0.3498, train acc 0.871, test acc 0.884, time 30.2 sec
epoch   9, loss 0.3386, train acc 0.875, test acc 0.886, time 30.2 sec
epoch  10, loss 0.3226, train acc 0.881, test acc 0.891, time 30.2 sec
epoch  11, loss 0.3117, train acc 0.885, test acc 0.898, time 30.1 sec
epoch  12, loss 0.3012, train acc 0.889, test acc 0.897, time 30.0 sec
epoch  13, loss 0.2919, train acc 0.892, test acc 0.902, time 29.9 sec
epoch  14, loss 0.2818, train acc 0.897, test acc 0.907, time 29.8 sec
epoch  15, loss 0.2746, train acc 0.898, test acc 0.907, time 29.8 sec
epoch  16, loss 0.2669, train acc 0.902, test acc 0.907, time 29.6 sec
epoch  17, loss 0.2620, train acc 0.904, test acc 0.900, time 29.7 sec
epoch  18, loss 0.2528, train acc 0.907, test acc 0.885, time 29.7 sec
epoch  19, loss 0.2488, train acc 0.909, test acc 0.908, time 29.7 sec
epoch  20, loss 0.2415, train acc 0.911, test acc 0.896, time 29.6 sec
epoch  21, loss 0.2374, train acc 0.912, test acc 0.912, time 30.2 sec
epoch  22, loss 0.2326, train acc 0.915, test acc 0.914, time 29.8 sec
epoch  23, loss 0.2263, train acc 0.916, test acc 0.921, time 29.7 sec
epoch  24, loss 0.2257, train acc 0.918, test acc 0.920, time 29.7 sec
epoch  25, loss 0.2208, train acc 0.919, test acc 0.916, time 29.7 sec
epoch  26, loss 0.2166, train acc 0.921, test acc 0.917, time 29.7 sec
epoch  27, loss 0.2122, train acc 0.922, test acc 0.917, time 29.8 sec
epoch  28, loss 0.2081, train acc 0.924, test acc 0.919, time 30.0 sec
epoch  29, loss 0.2053, train acc 0.926, test acc 0.919, time 30.0 sec
epoch  30, loss 0.2023, train acc 0.925, test acc 0.917, time 29.8 sec
epoch  31, loss 0.1973, train acc 0.927, test acc 0.923, time 29.8 sec
epoch  32, loss 0.1965, train acc 0.929, test acc 0.919, time 29.9 sec
epoch  33, loss 0.1946, train acc 0.929, test acc 0.927, time 29.7 sec
epoch  34, loss 0.1862, train acc 0.931, test acc 0.927, time 29.8 sec
epoch  35, loss 0.1859, train acc 0.932, test acc 0.926, time 29.6 sec
epoch  36, loss 0.1811, train acc 0.934, test acc 0.923, time 29.8 sec
epoch  37, loss 0.1791, train acc 0.934, test acc 0.925, time 30.0 sec
epoch  38, loss 0.1783, train acc 0.934, test acc 0.918, time 29.7 sec
epoch  39, loss 0.1748, train acc 0.936, test acc 0.923, time 29.8 sec
epoch  40, loss 0.1693, train acc 0.938, test acc 0.926, time 29.9 sec
epoch  41, loss 0.1690, train acc 0.937, test acc 0.926, time 29.9 sec
epoch  42, loss 0.1653, train acc 0.939, test acc 0.929, time 29.8 sec
epoch  43, loss 0.1615, train acc 0.940, test acc 0.922, time 30.0 sec
epoch  44, loss 0.1596, train acc 0.942, test acc 0.928, time 29.8 sec
epoch  45, loss 0.1538, train acc 0.943, test acc 0.926, time 29.7 sec
epoch  46, loss 0.1530, train acc 0.942, test acc 0.926, time 29.7 sec
epoch  47, loss 0.1498, train acc 0.944, test acc 0.930, time 29.7 sec
epoch  48, loss 0.1507, train acc 0.944, test acc 0.924, time 29.9 sec
epoch  49, loss 0.1469, train acc 0.944, test acc 0.924, time 29.8 sec
epoch  50, loss 0.1438, train acc 0.948, test acc 0.928, time 30.1 sec
```
## 含并行连结的网络（GoogLeNet）

|名称|结构|
|:--:|:--|
|Inception Block<br>(c1, c2, c3, c4)|①线路1：<br>　　1×1卷积层：channels=c1, kernel_size=1, activation='relu'<br>②线路2：<br>　　1×1卷积层：channels=c2[0], kernel_size=1, activation='relu'<br>　　3×3卷积层：channels=c2[1], kernel_size=3, padding=1, activatio='relu'<br>③线路3：<br>　　1×1卷积层：channels=c3[0], kernel_size=1, activation='relu'<br>　　5×5卷积层：channels=c3[1],kernel_size=5, padding=2, activation='relu'<br>④线路4：<br>　　3×3最大池化层：pool_size=3, strides=1. padding=1<br>　　1×1卷积层：channels=c4, kernel_size=1, activation='relu'|


![Inception块图示](/assets/img/deep_learning/deep_learning_01.png)

|名称|结构|
|:--:|:--|
|GoogLeNet|①Block 1：<br>　　7×7卷积层：channels=64, kernel_size=7, strides=2, padding=3, activation='relu'<br>　　3×3最大池化层：pool_size=3, strides=2, padding=1<br>②Block 2：<br>　　1×1卷积层：channels=64, kernel_size=1, activation='relu'<br>　　3×3卷积层：channels=192, kernel_size=3, padding=1, activation='relu'<br>　　3×3最大池化层：pool_size=3, strides=2, padding=1<br>③Block 3：<br>　　Inception(64, (96, 128), (16, 32), 32)<br>　　Inception(128, (128, 192), (32, 96), 64)<br>　　3×3最大池化层：pool_size=3, strides=2, padding=1<br>④Block 4：<br>　　Inception(192, (96, 208), (16, 48), 64)<br>　　Inception(160, (112, 224), (24, 64), 64)<br>　　Inception(128, (128, 256), (24, 64), 64)<br>　　Inception(112, (144, 288), (32, 64), 64)<br>　　Inception(256, (160, 320), (32, 128), 128)<br>　　3×3最大池化层：pool_size=3, strides=2, padding=1<br>⑤Block 5：<br>　　Inception(256, (160, 320), (32, 128), 128)<br>　　Inception(384, (192, 384), (48, 128), 128)<br>　　全局平均池化层<br>⑥全连接层：channels=10|


```Python
from mxnet import gluon, init, nd, autograd
from mxnet.gluon import data as gdata, loss as gloss, nn
import mxnet as mx
import sys
import os
import time


class Log(object):
    def __init__(self):
        self.NONE = 0
        self.INFO = 1
        self.level = self.NONE

    def set_level(self, level):
        self.level = level

    def info(self, arg):
        if self.level != self.NONE:
            print(arg)


class Inception(nn.Block, Log):
    # c1 - c4为每条线路里的层的输出通道数
    def __init__(self, c1, c2, c3, c4, **kwargs):
        nn.Block.__init__(self, **kwargs)
        Log.__init__(self)
        # 线路1，单1×1卷积层
        self.p1_1 = nn.Conv2D(c1, kernel_size=1, activation='relu')
        # 线路2，1×1卷积层后接3×3卷积层
        self.p2_1 = nn.Conv2D(c2[0], kernel_size=1, activation='relu')
        self.p2_2 = nn.Conv2D(c2[1], kernel_size=3, padding=1, activation='relu')
        # 线路3，1×1卷积层后接5×5卷积层
        self.p3_1 = nn.Conv2D(c3[0], kernel_size=1, activation='relu')
        self.p3_2 = nn.Conv2D(c3[1], kernel_size=5, padding=2, activation='relu')
        # 线路4，3×3池化层后接1×1卷积层
        self.p4_1 = nn.MaxPool2D(pool_size=3, strides=1, padding=1)
        self.p4_2 = nn.Conv2D(c4, kernel_size=1, activation='relu')

    def forward(self, x):
        p1 = self.p1_1(x)
        self.info('Path 1:\t output shpae:\t' + p1.shape.__str__())
        p2 = self.p2_2(self.p2_1(x))
        self.info('Path 2:\t output shape:\t' + p2.shape.__str__())
        p3 = self.p3_2(self.p3_1(x))
        self.info('Path 3:\t output shape:\t' + p3.shape.__str__())
        p4 = self.p4_2(self.p4_1(x))
        self.info('Path 4:\t output shape:\t' + p4.shape.__str__())
        return nd.concat(p1, p2, p3, p4, dim=1)  # 在通道维上连接输出


f = open('GoogLeNet_Log.txt', 'w')

b1 = nn.Sequential()
b1.add(nn.Conv2D(64, kernel_size=7, strides=2, padding=3, activation='relu'),
       nn.MaxPool2D(pool_size=3, strides=2, padding=1))

b2 = nn.Sequential()
b2.add(nn.Conv2D(64, kernel_size=1, activation='relu'),
       nn.Conv2D(192, kernel_size=3, padding=1, activation='relu'),
       nn.MaxPool2D(pool_size=3, strides=2, padding=1))

b3 = nn.Sequential()
b3.add(Inception(64, (96, 128), (16, 32), 32),
       Inception(128, (128, 192), (32, 96), 64),
       nn.MaxPool2D(pool_size=3, strides=2, padding=1))

b4 = nn.Sequential()
b4.add(Inception(192, (96, 208), (16, 48), 64),
       Inception(160, (112, 224), (24, 64), 64),
       Inception(128, (128, 256), (24, 64), 64),
       Inception(112, (144, 288), (32, 64), 64),
       Inception(256, (160, 320), (32, 128), 128),
       nn.MaxPool2D(pool_size=3, strides=2, padding=1))

b5 = nn.Sequential()
b5.add(Inception(256, (160, 320), (32, 128), 128),
       Inception(384, (192, 384), (48, 128), 128),
       nn.GlobalAvgPool2D())

net = nn.Sequential()
net.add(b1, b2, b3, b4, b5, nn.Dense(10))

X = nd.random.uniform(shape=(1, 1, 96, 96))
net.initialize()
for layer in net:
    X = layer(X)
    print(layer.name, 'output shape:\t', X.shape)


def try_gpu():
    try:
        ctx = mx.gpu(0)
        _ = nd.array((1,), ctx=ctx)
    except mx.base.MXNetError:
        ctx = mx.cpu()
    return ctx


def load_data_fashion_mnist(batch_size, resize=None, root=os.path.join('mxnet', 'datasets', 'fashion-mnist')):
    root = os.path.expanduser(root)
    transformer = []
    if resize:
        transformer += [gdata.vision.transforms.Resize(resize)]
    transformer += [gdata.vision.transforms.ToTensor()]
    transformer = gdata.vision.transforms.Compose(transformer)

    mnist_train = gdata.vision.FashionMNIST(root=root, train=True)
    mnist_test = gdata.vision.FashionMNIST(root=root, train=False)

    num_workers = 0 if sys.platform.startswith('win') else 4
    train_iter = gdata.DataLoader(mnist_train.transform_first(transformer),
                                  batch_size=batch_size,
                                  shuffle=True,
                                  num_workers=num_workers)
    test_iter = gdata.DataLoader(mnist_test.transform_first(transformer),
                                 batch_size=batch_size,
                                 shuffle=True,
                                 num_workers=num_workers)
    return train_iter, test_iter


def evaluate_accuracy(net, data_iter, ctx):
    acc_sum, n = nd.array([0], ctx=ctx), 0
    for X, y in data_iter:
        X, y = X.as_in_context(ctx), y.as_in_context(ctx).astype('float32')
        y_hat = net(X)
        acc_sum += (y_hat.argmax(axis=1) == y).sum()
        n += y.size
    return acc_sum.asscalar() / n


def train(net, train_iter, test_iter, batch_size, trainer, ctx, num_epochs):
    print("training on ", ctx)
    print("training on", ctx, file=f):
    loss = gloss.SoftmaxCrossEntropyLoss()
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n, start = 0.0, 0.0, 0, time.time()
        for X, y in train_iter:
            X, y = X.as_in_context(ctx), y.as_in_context(ctx)
            with autograd.record():
                y_hat = net(X)
                l = loss(y_hat, y).sum()
            l.backward()
            trainer.step(batch_size)
            train_l_sum += l.asscalar()
            train_acc_sum += (y_hat.argmax(axis=1) == y.astype('float32')).sum().asscalar()
            n += y.size
        test_acc = evaluate_accuracy(net, test_iter, ctx)
        print('epoch %3d, loss %.4f, train acc %.3f, test acc %.3f, time %.1f sec'
              % (epoch + 1, train_l_sum / n, train_acc_sum / n, test_acc, time.time() - start), file=f)
        print('epoch %3d, loss %.4f, train acc %.3f, test acc %.3f, time %.1f sec'
              % (epoch + 1, train_l_sum / n, train_acc_sum / n, test_acc, time.time() - start))


lr, num_epochs, batch_size, ctx = 0.1, 200, 640, try_gpu()
net.initialize(force_reinit=True, ctx=ctx, init=init.Xavier())
trainer = gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': lr})
train_iter, test_iter = load_data_fashion_mnist(batch_size, resize=96)
train(net, train_iter, test_iter, batch_size, trainer, ctx, num_epochs)
f.close()

```
```Python
# 各层输出形状：
sequential0 output shape:	 (1, 64, 24, 24)
sequential1 output shape:	 (1, 192, 12, 12)
sequential2 output shape:	 (1, 480, 6, 6)
sequential3 output shape:	 (1, 832, 3, 3)
sequential4 output shape:	 (1, 1024, 1, 1)
dense0 output shape:	 (1, 10)
```
```Python
# lr = 0.1
# 学习率太大，迭代条件无法继续收敛，逼近局部最优解
training on gpu(0)
epoch   1, loss 2.2956, train acc 0.202, test acc 0.287, time 29.6 sec
epoch   2, loss 2.2502, train acc 0.196, test acc 0.100, time 29.6 sec
epoch   3, loss 2.2327, train acc 0.195, test acc 0.112, time 29.8 sec
epoch   4, loss 1.9764, train acc 0.238, test acc 0.438, time 29.9 sec
epoch   5, loss 1.2506, train acc 0.491, test acc 0.585, time 30.2 sec
epoch   6, loss 0.9741, train acc 0.597, test acc 0.644, time 30.1 sec
epoch   7, loss 0.8311, train acc 0.673, test acc 0.732, time 30.3 sec
epoch   8, loss 0.7428, train acc 0.717, test acc 0.716, time 30.6 sec
epoch   9, loss 0.6305, train acc 0.762, test acc 0.801, time 30.2 sec
epoch  10, loss 0.5576, train acc 0.792, test acc 0.811, time 30.3 sec
epoch  11, loss 0.5094, train acc 0.807, test acc 0.789, time 30.5 sec
epoch  12, loss 0.4768, train acc 0.819, test acc 0.830, time 30.7 sec
epoch  13, loss 0.4396, train acc 0.833, test acc 0.847, time 30.5 sec
epoch  14, loss 0.4206, train acc 0.842, test acc 0.858, time 30.7 sec
epoch  15, loss 0.8486, train acc 0.694, test acc 0.662, time 30.4 sec
epoch  16, loss 0.6279, train acc 0.767, test acc 0.849, time 30.6 sec
epoch  17, loss 0.5334, train acc 0.806, test acc 0.855, time 30.4 sec
epoch  18, loss 0.3896, train acc 0.854, test acc 0.866, time 30.6 sec
epoch  19, loss 0.3684, train acc 0.862, test acc 0.864, time 30.6 sec
epoch  20, loss 0.3499, train acc 0.867, test acc 0.873, time 30.1 sec
epoch  21, loss 0.3360, train acc 0.873, test acc 0.877, time 30.5 sec
epoch  22, loss 0.3333, train acc 0.874, test acc 0.884, time 30.6 sec
epoch  23, loss 0.3102, train acc 0.883, test acc 0.887, time 31.0 sec
epoch  24, loss 0.3080, train acc 0.883, test acc 0.886, time 30.5 sec
epoch  25, loss 0.2979, train acc 0.887, test acc 0.886, time 30.6 sec
epoch  26, loss 0.2865, train acc 0.891, test acc 0.894, time 30.6 sec
epoch  27, loss 0.2806, train acc 0.893, test acc 0.889, time 30.7 sec
epoch  28, loss 0.2754, train acc 0.896, test acc 0.891, time 30.5 sec
epoch  29, loss 0.2661, train acc 0.899, test acc 0.892, time 30.5 sec
epoch  30, loss 0.2614, train acc 0.900, test acc 0.895, time 30.3 sec
epoch  31, loss 0.2662, train acc 0.899, test acc 0.891, time 30.6 sec
epoch  32, loss 0.2514, train acc 0.904, test acc 0.897, time 30.5 sec
epoch  33, loss 0.2514, train acc 0.904, test acc 0.900, time 30.4 sec
epoch  34, loss 0.2327, train acc 0.911, test acc 0.901, time 30.6 sec
epoch  35, loss 0.2309, train acc 0.912, test acc 0.903, time 30.3 sec
epoch  36, loss 0.2287, train acc 0.912, test acc 0.898, time 30.3 sec
epoch  37, loss 0.2253, train acc 0.914, test acc 0.900, time 30.7 sec
epoch  38, loss nan, train acc 0.597, test acc 0.100, time 29.8 sec
epoch  39, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch  40, loss nan, train acc 0.100, test acc 0.100, time 29.9 sec
epoch  41, loss nan, train acc 0.100, test acc 0.100, time 29.7 sec
epoch  42, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch  43, loss nan, train acc 0.100, test acc 0.100, time 29.8 sec
epoch  44, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch  45, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch  46, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch  47, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch  48, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch  49, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch  50, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch  51, loss nan, train acc 0.100, test acc 0.100, time 29.7 sec
epoch  52, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch  53, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch  54, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch  55, loss nan, train acc 0.100, test acc 0.100, time 30.1 sec
epoch  56, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch  57, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch  58, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch  59, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch  60, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch  61, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch  62, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch  63, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch  64, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch  65, loss nan, train acc 0.100, test acc 0.100, time 29.7 sec
epoch  66, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch  67, loss nan, train acc 0.100, test acc 0.100, time 29.6 sec
epoch  68, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch  69, loss nan, train acc 0.100, test acc 0.100, time 29.7 sec
epoch  70, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch  71, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch  72, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch  73, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch  74, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch  75, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch  76, loss nan, train acc 0.100, test acc 0.100, time 29.8 sec
epoch  77, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch  78, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch  79, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch  80, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch  81, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch  82, loss nan, train acc 0.100, test acc 0.100, time 29.0 sec
epoch  83, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch  84, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch  85, loss nan, train acc 0.100, test acc 0.100, time 29.0 sec
epoch  86, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch  87, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch  88, loss nan, train acc 0.100, test acc 0.100, time 29.7 sec
epoch  89, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch  90, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch  91, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch  92, loss nan, train acc 0.100, test acc 0.100, time 29.6 sec
epoch  93, loss nan, train acc 0.100, test acc 0.100, time 29.6 sec
epoch  94, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch  95, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch  96, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch  97, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch  98, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch  99, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch 100, loss nan, train acc 0.100, test acc 0.100, time 29.6 sec
epoch 101, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch 102, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch 103, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch 104, loss nan, train acc 0.100, test acc 0.100, time 29.0 sec
epoch 105, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch 106, loss nan, train acc 0.100, test acc 0.100, time 29.0 sec
epoch 107, loss nan, train acc 0.100, test acc 0.100, time 29.7 sec
epoch 108, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch 109, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch 110, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch 111, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch 112, loss nan, train acc 0.100, test acc 0.100, time 29.7 sec
epoch 113, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch 114, loss nan, train acc 0.100, test acc 0.100, time 30.3 sec
epoch 115, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch 116, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch 117, loss nan, train acc 0.100, test acc 0.100, time 29.6 sec
epoch 118, loss nan, train acc 0.100, test acc 0.100, time 29.6 sec
epoch 119, loss nan, train acc 0.100, test acc 0.100, time 29.7 sec
epoch 120, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch 121, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch 122, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch 123, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch 124, loss nan, train acc 0.100, test acc 0.100, time 29.8 sec
epoch 125, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch 126, loss nan, train acc 0.100, test acc 0.100, time 29.7 sec
epoch 127, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch 128, loss nan, train acc 0.100, test acc 0.100, time 29.9 sec
epoch 129, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch 130, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch 131, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch 132, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch 133, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch 134, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch 135, loss nan, train acc 0.100, test acc 0.100, time 29.0 sec
epoch 136, loss nan, train acc 0.100, test acc 0.100, time 29.9 sec
epoch 137, loss nan, train acc 0.100, test acc 0.100, time 29.6 sec
epoch 138, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch 139, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch 140, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch 141, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch 142, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch 143, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch 144, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch 145, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch 146, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch 147, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch 148, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch 149, loss nan, train acc 0.100, test acc 0.100, time 29.9 sec
epoch 150, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch 151, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch 152, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch 153, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch 154, loss nan, train acc 0.100, test acc 0.100, time 30.3 sec
epoch 155, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch 156, loss nan, train acc 0.100, test acc 0.100, time 29.8 sec
epoch 157, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch 158, loss nan, train acc 0.100, test acc 0.100, time 29.6 sec
epoch 159, loss nan, train acc 0.100, test acc 0.100, time 29.7 sec
epoch 160, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch 161, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch 162, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch 163, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch 164, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch 165, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch 166, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch 167, loss nan, train acc 0.100, test acc 0.100, time 29.0 sec
epoch 168, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch 169, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch 170, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch 171, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch 172, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch 173, loss nan, train acc 0.100, test acc 0.100, time 29.8 sec
epoch 174, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch 175, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch 176, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch 177, loss nan, train acc 0.100, test acc 0.100, time 29.7 sec
epoch 178, loss nan, train acc 0.100, test acc 0.100, time 29.6 sec
epoch 179, loss nan, train acc 0.100, test acc 0.100, time 29.2 sec
epoch 180, loss nan, train acc 0.100, test acc 0.100, time 29.7 sec
epoch 181, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch 182, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch 183, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch 184, loss nan, train acc 0.100, test acc 0.100, time 29.9 sec
epoch 185, loss nan, train acc 0.100, test acc 0.100, time 29.7 sec
epoch 186, loss nan, train acc 0.100, test acc 0.100, time 29.4 sec
epoch 187, loss nan, train acc 0.100, test acc 0.100, time 29.7 sec
epoch 188, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch 189, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch 190, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch 191, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch 192, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
epoch 193, loss nan, train acc 0.100, test acc 0.100, time 29.1 sec
epoch 194, loss nan, train acc 0.100, test acc 0.100, time 30.1 sec
epoch 195, loss nan, train acc 0.100, test acc 0.100, time 29.6 sec
epoch 196, loss nan, train acc 0.100, test acc 0.100, time 29.9 sec
epoch 197, loss nan, train acc 0.100, test acc 0.100, time 29.8 sec
epoch 198, loss nan, train acc 0.100, test acc 0.100, time 29.3 sec
epoch 199, loss nan, train acc 0.100, test acc 0.100, time 30.0 sec
epoch 200, loss nan, train acc 0.100, test acc 0.100, time 29.5 sec
# lr = 0.05
# 学习率适中，然而由实验数据可得，出现循环收敛情况
# 但是每次循环，可以发现，训练误差越来越小
# 可理解为但次循环逼近局部最优解，突变不收敛增大，但之后继续继续收敛, 但每次循环更加逼近局部最优解
# 这一现象与学习率大小有关，学习率越小，逼近程度更高
training on gpu(0):
epoch   1, loss 2.3003, train acc 0.186, test acc 0.290, time 29.4 sec
epoch   2, loss 2.2902, train acc 0.303, test acc 0.366, time 29.4 sec
epoch   3, loss 2.2375, train acc 0.272, test acc 0.269, time 29.5 sec
epoch   4, loss 2.1884, train acc 0.221, test acc 0.306, time 29.5 sec
epoch   5, loss 1.6043, train acc 0.381, test acc 0.557, time 29.7 sec
epoch   6, loss 1.0165, train acc 0.584, test acc 0.690, time 29.8 sec
epoch   7, loss 0.8938, train acc 0.645, test acc 0.679, time 29.9 sec
epoch   8, loss 0.7415, train acc 0.712, test acc 0.759, time 30.0 sec
epoch   9, loss 0.6586, train acc 0.748, test acc 0.775, time 29.9 sec
epoch  10, loss 0.6061, train acc 0.770, test acc 0.776, time 30.3 sec
epoch  11, loss 0.5721, train acc 0.785, test acc 0.807, time 30.3 sec
epoch  12, loss 0.5282, train acc 0.799, test acc 0.812, time 30.3 sec
epoch  13, loss 0.8901, train acc 0.721, test acc 0.187, time 30.3 sec
epoch  14, loss 1.9727, train acc 0.324, test acc 0.307, time 30.0 sec
epoch  15, loss 0.9870, train acc 0.629, test acc 0.752, time 30.1 sec
epoch  16, loss 0.6531, train acc 0.752, test acc 0.794, time 30.1 sec
epoch  17, loss 0.5645, train acc 0.788, test acc 0.816, time 30.1 sec
epoch  18, loss 0.5092, train acc 0.809, test acc 0.833, time 30.1 sec
epoch  19, loss 0.4741, train acc 0.823, test acc 0.844, time 30.1 sec
epoch  20, loss 0.4490, train acc 0.832, test acc 0.849, time 30.0 sec
epoch  21, loss 0.4191, train acc 0.843, test acc 0.854, time 30.2 sec
epoch  22, loss 0.4022, train acc 0.849, test acc 0.861, time 30.1 sec
epoch  23, loss 0.3884, train acc 0.856, test acc 0.851, time 30.1 sec
epoch  24, loss 0.3807, train acc 0.859, test acc 0.863, time 30.1 sec
epoch  25, loss 0.3618, train acc 0.864, test acc 0.870, time 30.0 sec
epoch  26, loss 0.3511, train acc 0.868, test acc 0.857, time 30.1 sec
epoch  27, loss 0.3423, train acc 0.871, test acc 0.876, time 30.1 sec
epoch  28, loss 0.3302, train acc 0.877, test acc 0.878, time 30.1 sec
epoch  29, loss 0.3270, train acc 0.877, test acc 0.877, time 30.5 sec
epoch  30, loss 0.3198, train acc 0.879, test acc 0.875, time 30.1 sec
epoch  31, loss 0.3094, train acc 0.883, test acc 0.882, time 30.1 sec
epoch  32, loss 0.2998, train acc 0.886, test acc 0.883, time 30.1 sec
epoch  33, loss 0.2976, train acc 0.887, test acc 0.879, time 30.2 sec
epoch  34, loss 0.2883, train acc 0.891, test acc 0.886, time 30.0 sec
epoch  35, loss 0.2865, train acc 0.890, test acc 0.886, time 30.2 sec
epoch  36, loss 0.2759, train acc 0.896, test acc 0.883, time 30.0 sec
epoch  37, loss 0.2776, train acc 0.894, test acc 0.890, time 30.2 sec
epoch  38, loss 0.2702, train acc 0.898, test acc 0.885, time 30.3 sec
epoch  39, loss 0.6599, train acc 0.769, test acc 0.853, time 30.4 sec
epoch  40, loss 0.3453, train acc 0.871, test acc 0.887, time 30.3 sec
epoch  41, loss 0.2877, train acc 0.892, test acc 0.884, time 30.2 sec
epoch  42, loss 0.2640, train acc 0.901, test acc 0.891, time 30.0 sec
epoch  43, loss 0.2652, train acc 0.900, test acc 0.896, time 30.3 sec
epoch  44, loss 1.0945, train acc 0.625, test acc 0.771, time 30.1 sec
epoch  45, loss 0.4668, train acc 0.824, test acc 0.865, time 29.9 sec
epoch  46, loss 0.3392, train acc 0.873, test acc 0.876, time 30.3 sec
epoch  47, loss 0.3065, train acc 0.885, test acc 0.886, time 30.2 sec
epoch  48, loss 0.2955, train acc 0.889, test acc 0.879, time 29.9 sec
epoch  49, loss 0.2719, train acc 0.897, test acc 0.884, time 30.2 sec
epoch  50, loss 0.2648, train acc 0.900, test acc 0.889, time 30.1 sec
epoch  51, loss 0.2611, train acc 0.901, test acc 0.894, time 30.3 sec
epoch  52, loss 0.2479, train acc 0.906, test acc 0.893, time 30.0 sec
epoch  53, loss 0.2422, train acc 0.908, test acc 0.893, time 30.1 sec
epoch  54, loss 0.2358, train acc 0.911, test acc 0.893, time 30.1 sec
epoch  55, loss 0.2271, train acc 0.913, test acc 0.897, time 30.0 sec
epoch  56, loss 0.2275, train acc 0.913, test acc 0.896, time 30.2 sec
epoch  57, loss 0.2155, train acc 0.918, test acc 0.890, time 29.9 sec
epoch  58, loss 0.2200, train acc 0.917, test acc 0.896, time 30.0 sec
epoch  59, loss 0.2058, train acc 0.921, test acc 0.892, time 30.1 sec
epoch  60, loss 0.2058, train acc 0.922, test acc 0.900, time 30.0 sec
epoch  61, loss 0.1935, train acc 0.927, test acc 0.893, time 30.1 sec
epoch  62, loss 0.2005, train acc 0.925, test acc 0.893, time 30.1 sec
epoch  63, loss 0.1846, train acc 0.929, test acc 0.901, time 30.0 sec
epoch  64, loss 0.1840, train acc 0.931, test acc 0.899, time 30.3 sec
epoch  65, loss 0.1749, train acc 0.933, test acc 0.898, time 30.2 sec
epoch  66, loss 0.2420, train acc 0.914, test acc 0.897, time 30.0 sec
epoch  67, loss 0.1775, train acc 0.933, test acc 0.891, time 30.2 sec
epoch  68, loss 0.1617, train acc 0.938, test acc 0.900, time 30.1 sec
epoch  69, loss 0.1630, train acc 0.937, test acc 0.897, time 30.2 sec
epoch  70, loss 0.1605, train acc 0.939, test acc 0.900, time 30.1 sec
epoch  71, loss 0.1569, train acc 0.939, test acc 0.897, time 30.1 sec
epoch  72, loss 0.1481, train acc 0.942, test acc 0.900, time 30.0 sec
epoch  73, loss 0.2770, train acc 0.904, test acc 0.898, time 30.0 sec
epoch  74, loss 0.1559, train acc 0.940, test acc 0.902, time 30.2 sec
epoch  75, loss 0.1339, train acc 0.948, test acc 0.899, time 30.1 sec
epoch  76, loss 0.1275, train acc 0.952, test acc 0.899, time 30.3 sec
epoch  77, loss 0.8637, train acc 0.750, test acc 0.288, time 30.3 sec
epoch  78, loss 1.5166, train acc 0.407, test acc 0.680, time 29.8 sec
epoch  79, loss 0.7373, train acc 0.713, test acc 0.771, time 30.0 sec
epoch  80, loss 0.5596, train acc 0.787, test acc 0.801, time 29.9 sec
epoch  81, loss 0.4604, train acc 0.826, test acc 0.849, time 29.9 sec
epoch  82, loss 0.4002, train acc 0.849, test acc 0.862, time 30.2 sec
epoch  83, loss 0.3632, train acc 0.861, test acc 0.866, time 30.2 sec
epoch  84, loss 0.3530, train acc 0.866, test acc 0.868, time 29.9 sec
epoch  85, loss 0.3164, train acc 0.880, test acc 0.875, time 29.8 sec
epoch  86, loss 0.2966, train acc 0.887, test acc 0.880, time 30.0 sec
epoch  87, loss 0.2817, train acc 0.894, test acc 0.883, time 30.0 sec
epoch  88, loss 0.2684, train acc 0.899, test acc 0.876, time 30.2 sec
epoch  89, loss 0.2589, train acc 0.901, test acc 0.886, time 29.7 sec
epoch  90, loss 0.2498, train acc 0.904, test acc 0.888, time 30.1 sec
epoch  91, loss 0.2329, train acc 0.911, test acc 0.889, time 30.2 sec
epoch  92, loss 0.2262, train acc 0.913, test acc 0.885, time 30.0 sec
epoch  93, loss 0.2192, train acc 0.916, test acc 0.889, time 30.1 sec
epoch  94, loss 0.2065, train acc 0.920, test acc 0.888, time 29.9 sec
epoch  95, loss 0.1980, train acc 0.924, test acc 0.888, time 29.9 sec
epoch  96, loss 0.3008, train acc 0.893, test acc 0.885, time 30.1 sec
epoch  97, loss 0.2022, train acc 0.922, test acc 0.890, time 29.9 sec
epoch  98, loss 0.1815, train acc 0.930, test acc 0.891, time 30.1 sec
epoch  99, loss 0.1708, train acc 0.934, test acc 0.885, time 30.1 sec
epoch 100, loss 0.1677, train acc 0.935, test acc 0.887, time 30.0 sec
epoch 101, loss 0.1568, train acc 0.939, test acc 0.893, time 30.3 sec
epoch 102, loss 0.1474, train acc 0.944, test acc 0.884, time 30.2 sec
epoch 103, loss 1.7684, train acc 0.468, test acc 0.274, time 30.2 sec
epoch 104, loss 1.9524, train acc 0.255, test acc 0.424, time 30.0 sec
epoch 105, loss 1.1871, train acc 0.536, test acc 0.676, time 29.9 sec
epoch 106, loss 0.8104, train acc 0.683, test acc 0.721, time 29.9 sec
epoch 107, loss 0.6903, train acc 0.735, test acc 0.780, time 30.0 sec
epoch 108, loss 0.5807, train acc 0.779, test acc 0.803, time 30.0 sec
epoch 109, loss 0.5175, train acc 0.803, test acc 0.839, time 30.3 sec
epoch 110, loss 0.4664, train acc 0.824, test acc 0.847, time 30.2 sec
epoch 111, loss 0.4257, train acc 0.839, test acc 0.853, time 29.9 sec
epoch 112, loss 0.3951, train acc 0.852, test acc 0.863, time 30.0 sec
epoch 113, loss 0.3752, train acc 0.859, test acc 0.867, time 29.9 sec
epoch 114, loss 0.3572, train acc 0.865, test acc 0.869, time 30.3 sec
epoch 115, loss 0.3391, train acc 0.871, test acc 0.878, time 29.9 sec
epoch 116, loss 0.3298, train acc 0.875, test acc 0.878, time 30.0 sec
epoch 117, loss 0.3201, train acc 0.879, test acc 0.881, time 30.0 sec
epoch 118, loss 0.3082, train acc 0.884, test acc 0.877, time 30.3 sec
epoch 119, loss 0.2994, train acc 0.887, test acc 0.884, time 30.1 sec
epoch 120, loss 0.2915, train acc 0.890, test acc 0.887, time 30.1 sec
epoch 121, loss 0.2861, train acc 0.892, test acc 0.888, time 30.2 sec
epoch 122, loss 0.2766, train acc 0.896, test acc 0.889, time 30.0 sec
epoch 123, loss 0.2759, train acc 0.895, test acc 0.887, time 30.0 sec
epoch 124, loss 0.2654, train acc 0.899, test acc 0.889, time 30.0 sec
epoch 125, loss 0.2549, train acc 0.903, test acc 0.889, time 30.0 sec
epoch 126, loss 0.2557, train acc 0.903, test acc 0.888, time 30.2 sec
epoch 127, loss 0.2459, train acc 0.905, test acc 0.890, time 30.0 sec
epoch 128, loss 0.2405, train acc 0.908, test acc 0.893, time 30.1 sec
epoch 129, loss 0.9341, train acc 0.683, test acc 0.859, time 30.1 sec
epoch 130, loss 0.3582, train acc 0.866, test acc 0.872, time 30.1 sec
epoch 131, loss 0.3120, train acc 0.883, test acc 0.879, time 30.0 sec
epoch 132, loss 0.2901, train acc 0.889, test acc 0.889, time 30.0 sec
epoch 133, loss 0.2712, train acc 0.897, test acc 0.889, time 30.0 sec
epoch 134, loss 0.2628, train acc 0.901, test acc 0.891, time 29.9 sec
epoch 135, loss 0.2497, train acc 0.905, test acc 0.891, time 30.4 sec
epoch 136, loss 0.2393, train acc 0.909, test acc 0.894, time 30.2 sec
epoch 137, loss 0.2339, train acc 0.912, test acc 0.899, time 30.2 sec
epoch 138, loss 0.2277, train acc 0.913, test acc 0.893, time 30.0 sec
epoch 139, loss 0.2179, train acc 0.918, test acc 0.897, time 30.0 sec
epoch 140, loss 0.2136, train acc 0.918, test acc 0.901, time 30.1 sec
epoch 141, loss 0.2068, train acc 0.922, test acc 0.902, time 30.0 sec
epoch 142, loss 0.1987, train acc 0.925, test acc 0.900, time 30.1 sec
epoch 143, loss 0.1910, train acc 0.927, test acc 0.900, time 30.0 sec
epoch 144, loss 0.2195, train acc 0.920, test acc 0.308, time 30.0 sec
epoch 145, loss 0.6532, train acc 0.775, test acc 0.879, time 30.0 sec
epoch 146, loss 0.2677, train acc 0.898, test acc 0.890, time 30.0 sec
epoch 147, loss 0.2322, train acc 0.911, test acc 0.887, time 30.0 sec
epoch 148, loss 0.2168, train acc 0.917, test acc 0.898, time 30.0 sec
epoch 149, loss 0.2022, train acc 0.924, test acc 0.901, time 30.2 sec
epoch 150, loss 0.1907, train acc 0.927, test acc 0.903, time 30.0 sec
epoch 151, loss 0.1824, train acc 0.929, test acc 0.904, time 30.2 sec
epoch 152, loss 0.1769, train acc 0.932, test acc 0.901, time 30.0 sec
epoch 153, loss 0.1690, train acc 0.935, test acc 0.905, time 30.0 sec
epoch 154, loss 0.1654, train acc 0.937, test acc 0.903, time 29.9 sec
epoch 155, loss 0.1585, train acc 0.939, test acc 0.905, time 30.1 sec
epoch 156, loss 0.1480, train acc 0.943, test acc 0.898, time 30.0 sec
epoch 157, loss 0.1466, train acc 0.943, test acc 0.905, time 29.9 sec
epoch 158, loss 0.1392, train acc 0.946, test acc 0.900, time 29.9 sec
epoch 159, loss 0.1303, train acc 0.950, test acc 0.902, time 30.1 sec
epoch 160, loss 0.1284, train acc 0.951, test acc 0.897, time 29.9 sec
epoch 161, loss 0.1290, train acc 0.950, test acc 0.900, time 30.0 sec
epoch 162, loss 0.1558, train acc 0.944, test acc 0.907, time 30.1 sec
epoch 163, loss 0.1078, train acc 0.959, test acc 0.906, time 30.1 sec
epoch 164, loss 0.1217, train acc 0.953, test acc 0.904, time 30.0 sec
epoch 165, loss 0.0972, train acc 0.962, test acc 0.901, time 30.0 sec
epoch 166, loss 0.0936, train acc 0.964, test acc 0.895, time 30.3 sec
epoch 167, loss 0.1055, train acc 0.961, test acc 0.895, time 30.1 sec
epoch 168, loss 0.0889, train acc 0.966, test acc 0.901, time 30.1 sec
epoch 169, loss 0.0915, train acc 0.967, test acc 0.904, time 30.0 sec
epoch 170, loss 1.2126, train acc 0.586, test acc 0.698, time 30.1 sec
epoch 171, loss 0.5554, train acc 0.791, test acc 0.846, time 30.0 sec
epoch 172, loss 0.3570, train acc 0.864, test acc 0.878, time 30.2 sec
epoch 173, loss 0.3000, train acc 0.885, test acc 0.887, time 30.0 sec
epoch 174, loss 0.2677, train acc 0.898, test acc 0.890, time 30.4 sec
epoch 175, loss 0.2418, train acc 0.908, test acc 0.894, time 30.1 sec
epoch 176, loss 0.2261, train acc 0.913, test acc 0.893, time 29.9 sec
epoch 177, loss 0.2012, train acc 0.922, test acc 0.897, time 30.0 sec
epoch 178, loss 0.1879, train acc 0.928, test acc 0.900, time 29.8 sec
epoch 179, loss 0.1736, train acc 0.933, test acc 0.901, time 30.0 sec
epoch 180, loss 0.1667, train acc 0.935, test acc 0.892, time 29.8 sec
epoch 181, loss 0.1527, train acc 0.942, test acc 0.903, time 30.0 sec
epoch 182, loss 0.1445, train acc 0.944, test acc 0.899, time 30.1 sec
epoch 183, loss 0.1343, train acc 0.948, test acc 0.897, time 30.0 sec
epoch 184, loss 0.1201, train acc 0.953, test acc 0.898, time 29.9 sec
epoch 185, loss 0.1206, train acc 0.954, test acc 0.899, time 30.0 sec
epoch 186, loss 0.1038, train acc 0.960, test acc 0.898, time 30.2 sec
epoch 187, loss 0.1244, train acc 0.954, test acc 0.903, time 30.0 sec
epoch 188, loss 0.0979, train acc 0.962, test acc 0.898, time 30.0 sec
epoch 189, loss 0.0980, train acc 0.963, test acc 0.901, time 30.2 sec
epoch 190, loss 0.1009, train acc 0.964, test acc 0.903, time 30.0 sec
epoch 191, loss 0.0732, train acc 0.972, test acc 0.901, time 30.0 sec
epoch 192, loss 0.0732, train acc 0.973, test acc 0.899, time 29.9 sec
epoch 193, loss 0.0720, train acc 0.973, test acc 0.894, time 30.0 sec
epoch 194, loss 0.0822, train acc 0.970, test acc 0.901, time 30.0 sec
epoch 195, loss 0.1778, train acc 0.942, test acc 0.874, time 30.0 sec
epoch 196, loss 0.1346, train acc 0.948, test acc 0.901, time 30.0 sec
epoch 197, loss 0.0698, train acc 0.975, test acc 0.897, time 30.0 sec
epoch 198, loss 0.0584, train acc 0.979, test acc 0.898, time 29.8 sec
epoch 199, loss 0.0522, train acc 0.983, test acc 0.903, time 30.1 sec
epoch 200, loss 0.0472, train acc 0.983, test acc 0.902, time 30.0 sec

```
## 批量归一化（Batch Normalization）

|类型|说明|
|:--:|:--|
|数据标准化|适用于浅层模型，模型训练时，当每层中参数更新时，靠近输出层的输出较难出现剧烈变化|
|批量归一化|适用于深层模型，即使输入数据已做标准化，训练中模型参数的更新依然很容易造成靠近输出层输出的剧烈变化。<br>模型训练时，利用小批量上的均值和标准差，不断调整神经网络中间输出，从而使整个神经网络在各层的中间输出的数值更稳定|


### 原生实现
```Python
from mxnet import autograd, gluon, init, nd
from mxnet.gluon import nn, data as gdata, loss as gloss
import mxnet as mx
import sys
import os
import time


def batch_norm(X, gamma, beta, moving_mean, moving_var, eps, momentum):
    # 通过autograd来判断当前模式是训练模式还是预测模式
    if not autograd.is_training():
        # 如果在预测模式下，直接使用转入的移动平均所得的均值和方差
        X_hat = (X - moving_mean) / nd.sqrt(moving_var + eps)
    else:
        assert len(X.shape) in (2, 4)
        if len(X.shape) == 2:
            # 使用全连接层的情况， 计算特征维上的均值和方差
            mean = X.mean(axis=0)
            var = ((X - mean) ** 2).mean(axis=0)
        else:
            # 使用二维卷积层的情况，计算通道维上（axis=1）的均值和方差。
            # 这里我们需要保持X的形状以便后面可以做广播运算
            mean = X.mean(axis=(0, 2, 3), keepdims=True)
            var = ((X - mean) ** 2).mean(axis=(0, 2, 3), keepdims=True)
        # 训练模式下用当前的均值和方差做标准化
        X_hat = (X - mean) / nd.sqrt(var + eps)
        # 更新移动平均的均值和方差
        moving_mean = momentum * moving_mean + (1.0 - momentum) * mean
        moving_var = momentum * moving_var + (1.0 - momentum) * var
    Y = gamma * X_hat + beta  # 拉伸和偏移
    return Y, moving_mean, moving_var


# 测试
# Y = nd.random.uniform(shape=(2, 2, 3, 3))
# print(Y.shape)
# print(Y)
# print(Y.mean(axis=(0, 2, 3), keepdims=True))


class BatchNorm(nn.Block):
    def __init__(self, num_features, num_dims, **kwargs):
        super(BatchNorm, self).__init__(**kwargs)
        if num_dims == 2:
            shape = (1, num_features)
        else:
            shape = (1, num_features, 1, 1)
        # 参与求梯度和迭代的拉伸和偏移参数，分别初始化为0和1
        self.gamma = self.params.get('gamma', shape=shape, init=init.One())
        self.beta = self.params.get('beta', shape=shape, init=init.Zero())
        # 不参与求梯度和迭代的变量，全在内存上初始化为0
        self.moving_mean = nd.zeros(shape)
        self.moving_var = nd.zeros(shape)

    def forward(self, X):
        # 如果X不在内存上，将moving_mean和moving_var复制到X所在显存上
        if self.moving_mean.context != X.context:
            self.moving_mean = self.moving_mean.copyto(X.context)
            self.moving_var = self.moving_var.copyto(X.context)
        # 保存更新过的moving_mean和moving_var
        print('X shape:', X.shape)
        print('X:', X)
        Y, self.moving_mean, self.moving_var = batch_norm(
            X, self.gamma.data(), self.beta.data(), self.moving_mean,
            self.moving_var, eps=1e - 5, momentum=0.5)
        return Y


net = nn.Sequential()
net.add(nn.Conv2D(6, kernel_size=5),
        BatchNorm(6, num_dims=4),
        nn.Activation('sigmoid'),
        nn.MaxPool2D(pool_size=2, strides=2),

        nn.Conv2D(16, kernel_size=5),
        BatchNorm(16, num_dims=4),
        nn.Activation('sigmoid'),
        nn.MaxPool2D(pool_size=2, strides=2),

        nn.Dense(120),
        BatchNorm(120, num_dims=2),
        nn.Activation('sigmoid'),

        nn.Dense(84),
        BatchNorm(84, num_dims=2),
        nn.Activation('sigmoid'),

        nn.Dense(10))


def try_gpu():
    try:
        ctx = mx.gpu(3)
        _ = nd.array((1,), ctx=ctx)
    except mx.base.MXNetError:
        ctx = mx.cpu()
    return ctx


def load_data_fashion_mnist(batch_size, resize=None, root=os.path.join('-', 'mxnet', 'datasets', 'fashion-mnist')):
    root = os.path.expanduser(root)
    transformer = []
    if resize:
        transformer += [gdata.vision.transforms.Resize(resize)]
    transformer += [gdata.vision.transforms.ToTensor()]
    transformer = gdata.vision.transforms.Compose(transformer)

    mnist_train = gdata.vision.FashionMNIST(root=root, train=True)
    mnist_test = gdata.vision.FashionMNIST(root=root, train=False)

    num_workers = 0 if sys.platform.startswith('win') else 4
    train_iter = gdata.DataLoader(mnist_train.transform_first(transformer),
                                  batch_size=batch_size,
                                  shuffle=True,
                                  num_workers=num_workers)
    test_iter = gdata.DataLoader(mnist_test.transform_first(transformer),
                                 batch_size=batch_size,
                                 shuffle=True,
                                 num_workers=num_workers)
    return train_iter, test_iter


def evaluate_accuracy(net, data_iter, ctx):
    acc_sum, n = nd.array([0], ctx=ctx), 0
    for X, y in data_iter:
        X, y = X.as_in_context(ctx), y.as_in_context(ctx).astype('float32')
        y_hat = net(X)
        acc_sum += (y_hat.argmax(axis=1) == y).sum()
        n += y.size
    return acc_sum.asscalar() / n


def train(net, train_iter, test_iter, batch_size, trainer, ctx, num_epochs):
    print("training on ", ctx)
    loss = gloss.SoftmaxCrossEntropyLoss()
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n, start = 0.0, 0.0, 0, time.time()
        for X, y in train_iter:
            X, y = X.as_in_context(ctx), y.as_in_context(ctx)
            with autograd.record():
                y_hat = net(X)
                l = loss(y_hat, y).sum()
            l.backward()
            trainer.step(batch_size)
            train_l_sum += l.asscalar()
            train_acc_sum += (y_hat.argmax(axis=1) == y.astype('float32')).sum().asscalar()
            n += y.size
        test_acc = evaluate_accuracy(net, test_iter, ctx)
        print('epoch %3d, loss %.4f, train acc %.3f, test acc %.3f, time %.1f sec'
              % (epoch + 1, train_l_sum / n, train_acc_sum / n, test_acc, time.time() - start))


lr, num_epochs, batch_size, ctx = 1.0, 5, 256, try_gpu()
net.initialize(ctx=ctx, init=init.Xavier())
trainer = gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': lr})
train_iter, test_iter = load_data_fashion_mnist(batch_size)
train(net, train_iter, test_iter, batch_size, trainer, ctx, num_epochs)

# x = nd.random.uniform(shape=(4, 2, 28, 28))
# for layer in net:
#     with autograd.record():
#         x = layer(x)
#         print(x.shape)

```
### 简洁实现
```Python
from mxnet import autograd, gluon, init, nd
from mxnet.gluon import nn, data as gdata, loss as gloss
import mxnet as mx
import sys
import os
import time

net = nn.Sequential()
net.add(nn.Conv2D(6, kernel_size=5),
        nn.BatchNorm(),
        nn.Activation('sigmoid'),
        nn.MaxPool2D(pool_size=2, strides=2),

        nn.Conv2D(16, kernel_size=5),
        nn.BatchNorm(),
        nn.Activation('sigmoid'),
        nn.MaxPool2D(pool_size=2, strides=2),

        nn.Dense(120),
        nn.BatchNorm(),
        nn.Activation('sigmoid'),

        nn.Dense(84),
        nn.BatchNorm(),
        nn.Activation('sigmoid'),

        nn.Dense(10))


def try_gpu():
    try:
        ctx = mx.gpu(3)
        _ = nd.array((1,), ctx=ctx)
    except mx.base.MXNetError:
        ctx = mx.cpu()
    return ctx


def load_data_fashion_mnist(batch_size, resize=None, root=os.path.join('-', 'mxnet', 'datasets', 'fashion-mnist')):
    root = os.path.expanduser(root)
    transformer = []
    if resize:
        transformer += [gdata.vision.transforms.Resize(resize)]
    transformer += [gdata.vision.transforms.ToTensor()]
    transformer = gdata.vision.transforms.Compose(transformer)

    mnist_train = gdata.vision.FashionMNIST(root=root, train=True)
    mnist_test = gdata.vision.FashionMNIST(root=root, train=False)

    num_workers = 0 if sys.platform.startswith('win') else 4
    train_iter = gdata.DataLoader(mnist_train.transform_first(transformer),
                                  batch_size=batch_size,
                                  shuffle=True,
                                  num_workers=num_workers)
    test_iter = gdata.DataLoader(mnist_test.transform_first(transformer),
                                 batch_size=batch_size,
                                 shuffle=True,
                                 num_workers=num_workers)
    return train_iter, test_iter


def evaluate_accuracy(net, data_iter, ctx):
    acc_sum, n = nd.array([0], ctx=ctx), 0
    for X, y in data_iter:
        X, y = X.as_in_context(ctx), y.as_in_context(ctx).astype('float32')
        y_hat = net(X)
        acc_sum += (y_hat.argmax(axis=1) == y).sum()
        n += y.size
    return acc_sum.asscalar() / n


def train(net, train_iter, test_iter, batch_size, trainer, ctx, num_epochs):
    print("training on ", ctx)
    loss = gloss.SoftmaxCrossEntropyLoss()
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n, start = 0.0, 0.0, 0, time.time()
        for X, y in train_iter:
            X, y = X.as_in_context(ctx), y.as_in_context(ctx)
            with autograd.record():
                y_hat = net(X)
                l = loss(y_hat, y).sum()
            l.backward()
            trainer.step(batch_size)
            train_l_sum += l.asscalar()
            train_acc_sum += (y_hat.argmax(axis=1) == y.astype('float32')).sum().asscalar()
            n += y.size
        test_acc = evaluate_accuracy(net, test_iter, ctx)
        print('epoch %3d, loss %.4f, train acc %.3f, test acc %.3f, time %.1f sec'
              % (epoch + 1, train_l_sum / n, train_acc_sum / n, test_acc, time.time() - start))


lr, num_epochs, batch_size, ctx = 1.0, 5, 256, try_gpu()
net.initialize(ctx=ctx, init=init.Xavier())
trainer = gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': lr})
train_iter, test_iter = load_data_fashion_mnist(batch_size)
train(net, train_iter, test_iter, batch_size, trainer, ctx, num_epochs)

```
## 残差网络（ResNet）

|名称|结构|
|:--:|:--|
|Residual Block|①3×3卷积层：channels=num_channels, kernel_size=3, padding=1, strides=strides<br>②批量归一化层<br>③激活函数层<br>④3×3卷积层：channels=num_channels, kernel_size=3, padding=1, strides=strides<br>⑤批量归一化层<br>⑥（可选）1×1卷积层：channels=num_channels, kernel_size=1, strides=strides<br>⑦激活函数层|


![Resnet图示](/assets/img/deep_learning/deep_learning_02.png)

```Python
from mxnet import autograd, gluon, init, nd
from mxnet.gluon import nn, data as gdata, loss as gloss
import mxnet as mx
import sys
import os
import time


class Residual(nn.Block):
    def __init__(self, num_channels, user_1x1conv=False, strides=1, **kwargs):
        super(Residual, self).__init__(**kwargs)
        self.conv1 = nn.Conv2D(num_channels, kernel_size=3, padding=1, strides=strides)
        self.conv2 = nn.Conv2D(num_channels, kernel_size=3, padding=1)
        if user_1x1conv:
            self.conv3 = nn.Conv2D(num_channels, kernel_size=1, strides=strides)
        else:
            self.conv3 = None
        self.bn1 = nn.BatchNorm()
        self.bn2 = nn.BatchNorm()

    def forward(self, X):
        Y = nd.relu(self.bn1(self.conv1(X)))
        Y = self.bn2(self.conv2(Y))
        if self.conv3:
            X = self.conv3(X)
        return nd.relu(Y + X)


# blk = Residual(3)
# blk.initialize()
# X = nd.random.uniform(shape=(4, 3, 6, 6))
# print(blk(X).shape)

net = nn.Sequential()
net.add(nn.Conv2D(64, kernel_size=7, strides=2, padding=3),
        nn.BatchNorm(),
        nn.Activation('relu'),
        nn.MaxPool2D(pool_size=3, strides=2, padding=1))


def resnet_block(num_channels, num_residuals, first_block=False):
    blk = nn.Sequential()
    for i in range(num_residuals):
        if i == 0 and not first_block:
            blk.add(Residual(num_channels, user_1x1conv=True, strides=2))
        else:
            blk.add(Residual(num_channels))
    return blk


net.add(resnet_block(64, 2, first_block=True),
        resnet_block(128, 2),
        resnet_block(256, 2),
        resnet_block(512, 2))

net.add(nn.GlobalAvgPool2D(),
        nn.Dense(10))

# X = nd.random.uniform(shape=(1, 1, 224, 224))
# net.initialize()
# for layer in net:
#     X = layer(X)
#     print(layer.name, 'output shape:\t', X.shape)

def try_gpu():
    try:
        ctx = mx.gpu(3)
        _ = nd.array((1,), ctx=ctx)
    except mx.base.MXNetError:
        ctx = mx.cpu()
    return ctx


def load_data_fashion_mnist(batch_size, resize=None, root=os.path.join('-', 'mxnet', 'datasets', 'fashion-mnist')):
    root = os.path.expanduser(root)
    transformer = []
    if resize:
        transformer += [gdata.vision.transforms.Resize(resize)]
    transformer += [gdata.vision.transforms.ToTensor()]
    transformer = gdata.vision.transforms.Compose(transformer)

    mnist_train = gdata.vision.FashionMNIST(root=root, train=True)
    mnist_test = gdata.vision.FashionMNIST(root=root, train=False)

    num_workers = 0 if sys.platform.startswith('win') else 4
    train_iter = gdata.DataLoader(mnist_train.transform_first(transformer),
                                  batch_size=batch_size,
                                  shuffle=True,
                                  num_workers=num_workers)
    test_iter = gdata.DataLoader(mnist_test.transform_first(transformer),
                                 batch_size=batch_size,
                                 shuffle=True,
                                 num_workers=num_workers)
    return train_iter, test_iter


def evaluate_accuracy(net, data_iter, ctx):
    acc_sum, n = nd.array([0], ctx=ctx), 0
    for X, y in data_iter:
        X, y = X.as_in_context(ctx), y.as_in_context(ctx).astype('float32')
        y_hat = net(X)
        acc_sum += (y_hat.argmax(axis=1) == y).sum()
        n += y.size
    return acc_sum.asscalar() / n


def train(net, train_iter, test_iter, batch_size, trainer, ctx, num_epochs):
    print("training on ", ctx)
    loss = gloss.SoftmaxCrossEntropyLoss()
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n, start = 0.0, 0.0, 0, time.time()
        for X, y in train_iter:
            X, y = X.as_in_context(ctx), y.as_in_context(ctx)
            with autograd.record():
                y_hat = net(X)
                l = loss(y_hat, y).sum()
            l.backward()
            trainer.step(batch_size)
            train_l_sum += l.asscalar()
            train_acc_sum += (y_hat.argmax(axis=1) == y.astype('float32')).sum().asscalar()
            n += y.size
        test_acc = evaluate_accuracy(net, test_iter, ctx)
        print('epoch %3d, loss %.4f, train acc %.3f, test acc %.3f, time %.1f sec'
              % (epoch + 1, train_l_sum / n, train_acc_sum / n, test_acc, time.time() - start))


lr, num_epochs, batch_size, ctx = 0.05, 200, 672, try_gpu()
net.initialize(force_reinit=True, ctx=ctx, init=init.Xavier())
trainer = gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': lr})
train_iter, test_iter = load_data_fashion_mnist(batch_size, resize=96)
train(net, train_iter, test_iter, batch_size, trainer, ctx, num_epochs)

```
```Python
# 各层输出形状：
conv0 output shape:	 (1, 64, 112, 112)
batchnorm0 output shape:	 (1, 64, 112, 112)
relu0 output shape:	 (1, 64, 112, 112)
pool0 output shape:	 (1, 64, 56, 56)
sequential1 output shape:	 (1, 64, 56, 56)
sequential2 output shape:	 (1, 128, 28, 28)
sequential3 output shape:	 (1, 256, 14, 14)
sequential4 output shape:	 (1, 512, 7, 7)
pool1 output shape:	 (1, 512, 1, 1)
dense0 output shape:	 (1, 10)
```
```Python
training on gpu(0):
epoch   1, loss 0.6444, train acc 0.781, test acc 0.876, time 31.4 sec
epoch   2, loss 0.2992, train acc 0.891, test acc 0.891, time 27.0 sec
epoch   3, loss 0.2351, train acc 0.915, test acc 0.898, time 27.6 sec
epoch   4, loss 0.1896, train acc 0.932, test acc 0.901, time 27.6 sec
epoch   5, loss 0.1576, train acc 0.944, test acc 0.907, time 27.4 sec
epoch   6, loss 0.1128, train acc 0.962, test acc 0.904, time 27.4 sec
epoch   7, loss 0.0908, train acc 0.970, test acc 0.914, time 27.4 sec
epoch   8, loss 0.0590, train acc 0.983, test acc 0.912, time 27.9 sec
epoch   9, loss 0.0388, train acc 0.990, test acc 0.915, time 27.3 sec
epoch  10, loss 0.0187, train acc 0.997, test acc 0.918, time 27.8 sec
epoch  11, loss 0.0080, train acc 1.000, test acc 0.923, time 27.6 sec
epoch  12, loss 0.0037, train acc 1.000, test acc 0.922, time 27.7 sec
epoch  13, loss 0.0025, train acc 1.000, test acc 0.922, time 27.7 sec
epoch  14, loss 0.0020, train acc 1.000, test acc 0.922, time 27.4 sec
epoch  15, loss 0.0017, train acc 1.000, test acc 0.922, time 27.6 sec
epoch  16, loss 0.0014, train acc 1.000, test acc 0.921, time 27.5 sec
epoch  17, loss 0.0012, train acc 1.000, test acc 0.922, time 27.6 sec
epoch  18, loss 0.0011, train acc 1.000, test acc 0.922, time 28.0 sec
epoch  19, loss 0.0010, train acc 1.000, test acc 0.922, time 27.5 sec
epoch  20, loss 0.0009, train acc 1.000, test acc 0.922, time 27.7 sec
epoch  21, loss 0.0008, train acc 1.000, test acc 0.921, time 27.5 sec
epoch  22, loss 0.0008, train acc 1.000, test acc 0.922, time 27.6 sec
epoch  23, loss 0.0007, train acc 1.000, test acc 0.922, time 27.8 sec
epoch  24, loss 0.0007, train acc 1.000, test acc 0.922, time 27.6 sec
epoch  25, loss 0.0006, train acc 1.000, test acc 0.923, time 27.8 sec
epoch  26, loss 0.0006, train acc 1.000, test acc 0.922, time 27.6 sec
epoch  27, loss 0.0005, train acc 1.000, test acc 0.922, time 27.7 sec
epoch  28, loss 0.0005, train acc 1.000, test acc 0.922, time 27.7 sec
epoch  29, loss 0.0005, train acc 1.000, test acc 0.922, time 27.5 sec
epoch  30, loss 0.0004, train acc 1.000, test acc 0.922, time 27.6 sec
epoch  31, loss 0.0004, train acc 1.000, test acc 0.923, time 27.5 sec
epoch  32, loss 0.0004, train acc 1.000, test acc 0.922, time 27.4 sec
epoch  33, loss 0.0004, train acc 1.000, test acc 0.923, time 27.4 sec
epoch  34, loss 0.0004, train acc 1.000, test acc 0.922, time 27.5 sec
epoch  35, loss 0.0004, train acc 1.000, test acc 0.922, time 27.4 sec
epoch  36, loss 0.0003, train acc 1.000, test acc 0.923, time 27.7 sec
epoch  37, loss 0.0003, train acc 1.000, test acc 0.922, time 27.5 sec
epoch  38, loss 0.0003, train acc 1.000, test acc 0.922, time 27.4 sec
epoch  39, loss 0.0003, train acc 1.000, test acc 0.923, time 27.3 sec
epoch  40, loss 0.0003, train acc 1.000, test acc 0.922, time 28.0 sec
epoch  41, loss 0.0003, train acc 1.000, test acc 0.923, time 27.2 sec
epoch  42, loss 0.0003, train acc 1.000, test acc 0.923, time 27.4 sec
epoch  43, loss 0.0003, train acc 1.000, test acc 0.922, time 27.8 sec
epoch  44, loss 0.0003, train acc 1.000, test acc 0.922, time 27.5 sec
epoch  45, loss 0.0003, train acc 1.000, test acc 0.922, time 27.7 sec
epoch  46, loss 0.0002, train acc 1.000, test acc 0.922, time 27.5 sec
epoch  47, loss 0.0002, train acc 1.000, test acc 0.922, time 27.4 sec
epoch  48, loss 0.0002, train acc 1.000, test acc 0.922, time 27.4 sec
epoch  49, loss 0.0002, train acc 1.000, test acc 0.922, time 27.4 sec
epoch  50, loss 0.0002, train acc 1.000, test acc 0.922, time 27.8 sec
epoch  51, loss 0.0002, train acc 1.000, test acc 0.922, time 27.5 sec
epoch  52, loss 0.0002, train acc 1.000, test acc 0.922, time 27.7 sec
epoch  53, loss 0.0002, train acc 1.000, test acc 0.923, time 27.8 sec
epoch  54, loss 0.0002, train acc 1.000, test acc 0.922, time 27.5 sec
epoch  55, loss 0.0002, train acc 1.000, test acc 0.922, time 27.9 sec
epoch  56, loss 0.0002, train acc 1.000, test acc 0.922, time 27.6 sec
epoch  57, loss 0.0002, train acc 1.000, test acc 0.922, time 27.5 sec
epoch  58, loss 0.0002, train acc 1.000, test acc 0.922, time 27.6 sec
epoch  59, loss 0.0002, train acc 1.000, test acc 0.923, time 27.6 sec
epoch  60, loss 0.0002, train acc 1.000, test acc 0.922, time 27.8 sec
epoch  61, loss 0.0002, train acc 1.000, test acc 0.923, time 27.4 sec
epoch  62, loss 0.0002, train acc 1.000, test acc 0.922, time 27.5 sec
epoch  63, loss 0.0002, train acc 1.000, test acc 0.922, time 27.5 sec
epoch  64, loss 0.0002, train acc 1.000, test acc 0.922, time 27.4 sec
epoch  65, loss 0.0002, train acc 1.000, test acc 0.922, time 27.4 sec
epoch  66, loss 0.0001, train acc 1.000, test acc 0.922, time 27.4 sec
epoch  67, loss 0.0001, train acc 1.000, test acc 0.922, time 27.2 sec
epoch  68, loss 0.0001, train acc 1.000, test acc 0.922, time 27.4 sec
epoch  69, loss 0.0001, train acc 1.000, test acc 0.922, time 27.3 sec
epoch  70, loss 0.0001, train acc 1.000, test acc 0.923, time 27.5 sec
epoch  71, loss 0.0001, train acc 1.000, test acc 0.922, time 27.4 sec
epoch  72, loss 0.0001, train acc 1.000, test acc 0.922, time 27.3 sec
epoch  73, loss 0.0001, train acc 1.000, test acc 0.922, time 27.7 sec
epoch  74, loss 0.0001, train acc 1.000, test acc 0.922, time 27.4 sec
epoch  75, loss 0.0001, train acc 1.000, test acc 0.923, time 27.4 sec
epoch  76, loss 0.0001, train acc 1.000, test acc 0.922, time 27.4 sec
epoch  77, loss 0.0001, train acc 1.000, test acc 0.922, time 27.6 sec
epoch  78, loss 0.0001, train acc 1.000, test acc 0.922, time 27.8 sec
epoch  79, loss 0.0001, train acc 1.000, test acc 0.922, time 27.5 sec
epoch  80, loss 0.0001, train acc 1.000, test acc 0.922, time 27.8 sec
epoch  81, loss 0.0001, train acc 1.000, test acc 0.923, time 27.3 sec
epoch  82, loss 0.0001, train acc 1.000, test acc 0.922, time 27.7 sec
epoch  83, loss 0.0001, train acc 1.000, test acc 0.922, time 27.6 sec
epoch  84, loss 0.0001, train acc 1.000, test acc 0.923, time 27.5 sec
epoch  85, loss 0.0001, train acc 1.000, test acc 0.921, time 27.8 sec
epoch  86, loss 0.0001, train acc 1.000, test acc 0.922, time 27.4 sec
epoch  87, loss 0.0001, train acc 1.000, test acc 0.922, time 27.6 sec
epoch  88, loss 0.0001, train acc 1.000, test acc 0.922, time 27.6 sec
epoch  89, loss 0.0001, train acc 1.000, test acc 0.922, time 27.6 sec
epoch  90, loss 0.0001, train acc 1.000, test acc 0.922, time 27.5 sec
epoch  91, loss 0.0001, train acc 1.000, test acc 0.923, time 27.4 sec
epoch  92, loss 0.0001, train acc 1.000, test acc 0.922, time 27.4 sec
epoch  93, loss 0.0001, train acc 1.000, test acc 0.922, time 27.5 sec
epoch  94, loss 0.0001, train acc 1.000, test acc 0.923, time 27.2 sec
epoch  95, loss 0.0001, train acc 1.000, test acc 0.922, time 27.6 sec
epoch  96, loss 0.0001, train acc 1.000, test acc 0.922, time 27.3 sec
epoch  97, loss 0.0001, train acc 1.000, test acc 0.923, time 27.4 sec
epoch  98, loss 0.0001, train acc 1.000, test acc 0.922, time 27.5 sec
epoch  99, loss 0.0001, train acc 1.000, test acc 0.922, time 27.4 sec
epoch 100, loss 0.0001, train acc 1.000, test acc 0.923, time 27.5 sec
epoch 101, loss 0.0001, train acc 1.000, test acc 0.922, time 27.4 sec
epoch 102, loss 0.0001, train acc 1.000, test acc 0.922, time 27.6 sec
epoch 103, loss 0.0001, train acc 1.000, test acc 0.922, time 27.3 sec
epoch 104, loss 0.0001, train acc 1.000, test acc 0.922, time 27.3 sec
epoch 105, loss 0.0001, train acc 1.000, test acc 0.922, time 27.6 sec
epoch 106, loss 0.0001, train acc 1.000, test acc 0.923, time 27.4 sec
epoch 107, loss 0.0001, train acc 1.000, test acc 0.923, time 27.5 sec
epoch 108, loss 0.0001, train acc 1.000, test acc 0.922, time 27.4 sec
epoch 109, loss 0.0001, train acc 1.000, test acc 0.923, time 27.8 sec
epoch 110, loss 0.0001, train acc 1.000, test acc 0.922, time 27.6 sec
epoch 111, loss 0.0001, train acc 1.000, test acc 0.922, time 27.4 sec
epoch 112, loss 0.0001, train acc 1.000, test acc 0.923, time 27.4 sec
epoch 113, loss 0.0001, train acc 1.000, test acc 0.923, time 27.3 sec
epoch 114, loss 0.0001, train acc 1.000, test acc 0.922, time 27.7 sec
epoch 115, loss 0.0001, train acc 1.000, test acc 0.923, time 27.6 sec
epoch 116, loss 0.0001, train acc 1.000, test acc 0.922, time 27.5 sec
epoch 117, loss 0.0001, train acc 1.000, test acc 0.922, time 27.5 sec
epoch 118, loss 0.0001, train acc 1.000, test acc 0.922, time 27.3 sec
epoch 119, loss 0.0001, train acc 1.000, test acc 0.922, time 27.7 sec
epoch 120, loss 0.0001, train acc 1.000, test acc 0.922, time 27.5 sec
epoch 121, loss 0.0001, train acc 1.000, test acc 0.922, time 27.3 sec
epoch 122, loss 0.0001, train acc 1.000, test acc 0.922, time 27.6 sec
epoch 123, loss 0.0001, train acc 1.000, test acc 0.922, time 27.5 sec
epoch 124, loss 0.0001, train acc 1.000, test acc 0.922, time 27.6 sec
epoch 125, loss 0.0001, train acc 1.000, test acc 0.923, time 28.0 sec
epoch 126, loss 0.0001, train acc 1.000, test acc 0.922, time 27.5 sec
epoch 127, loss 0.0001, train acc 1.000, test acc 0.923, time 27.4 sec
epoch 128, loss 0.0001, train acc 1.000, test acc 0.922, time 27.3 sec
epoch 129, loss 0.0001, train acc 1.000, test acc 0.922, time 27.5 sec
epoch 130, loss 0.0001, train acc 1.000, test acc 0.922, time 27.6 sec
epoch 131, loss 0.0001, train acc 1.000, test acc 0.922, time 27.5 sec
epoch 132, loss 0.0001, train acc 1.000, test acc 0.922, time 27.5 sec
epoch 133, loss 0.0001, train acc 1.000, test acc 0.923, time 27.5 sec
epoch 134, loss 0.0001, train acc 1.000, test acc 0.922, time 27.5 sec
epoch 135, loss 0.0001, train acc 1.000, test acc 0.922, time 27.5 sec
epoch 136, loss 0.0001, train acc 1.000, test acc 0.923, time 27.4 sec
epoch 137, loss 0.0001, train acc 1.000, test acc 0.923, time 27.4 sec
epoch 138, loss 0.0001, train acc 1.000, test acc 0.922, time 27.6 sec
epoch 139, loss 0.0001, train acc 1.000, test acc 0.923, time 27.5 sec
epoch 140, loss 0.0001, train acc 1.000, test acc 0.922, time 27.2 sec
epoch 141, loss 0.0001, train acc 1.000, test acc 0.923, time 27.7 sec
epoch 142, loss 0.0001, train acc 1.000, test acc 0.923, time 27.4 sec
epoch 143, loss 0.0001, train acc 1.000, test acc 0.923, time 27.4 sec
epoch 144, loss 0.0001, train acc 1.000, test acc 0.922, time 27.7 sec
epoch 145, loss 0.0001, train acc 1.000, test acc 0.923, time 27.3 sec
epoch 146, loss 0.0001, train acc 1.000, test acc 0.922, time 27.5 sec
epoch 147, loss 0.0001, train acc 1.000, test acc 0.922, time 27.5 sec
epoch 148, loss 0.0001, train acc 1.000, test acc 0.922, time 27.3 sec
epoch 149, loss 0.0001, train acc 1.000, test acc 0.922, time 27.6 sec
epoch 150, loss 0.0001, train acc 1.000, test acc 0.922, time 27.3 sec
epoch 151, loss 0.0001, train acc 1.000, test acc 0.922, time 27.6 sec
epoch 152, loss 0.0001, train acc 1.000, test acc 0.922, time 27.2 sec
epoch 153, loss 0.0001, train acc 1.000, test acc 0.922, time 27.4 sec
epoch 154, loss 0.0001, train acc 1.000, test acc 0.922, time 27.8 sec
epoch 155, loss 0.0001, train acc 1.000, test acc 0.922, time 27.4 sec
epoch 156, loss 0.0001, train acc 1.000, test acc 0.923, time 27.7 sec
epoch 157, loss 0.0001, train acc 1.000, test acc 0.922, time 27.3 sec
epoch 158, loss 0.0001, train acc 1.000, test acc 0.923, time 27.4 sec
epoch 159, loss 0.0001, train acc 1.000, test acc 0.923, time 27.6 sec
epoch 160, loss 0.0001, train acc 1.000, test acc 0.923, time 27.4 sec
epoch 161, loss 0.0001, train acc 1.000, test acc 0.923, time 27.4 sec
epoch 162, loss 0.0001, train acc 1.000, test acc 0.922, time 27.5 sec
epoch 163, loss 0.0000, train acc 1.000, test acc 0.922, time 27.4 sec
epoch 164, loss 0.0001, train acc 1.000, test acc 0.923, time 27.5 sec
epoch 165, loss 0.0000, train acc 1.000, test acc 0.922, time 27.5 sec
epoch 166, loss 0.0000, train acc 1.000, test acc 0.923, time 27.5 sec
epoch 167, loss 0.0000, train acc 1.000, test acc 0.923, time 27.6 sec
epoch 168, loss 0.0000, train acc 1.000, test acc 0.922, time 27.3 sec
epoch 169, loss 0.0000, train acc 1.000, test acc 0.922, time 27.8 sec
epoch 170, loss 0.0000, train acc 1.000, test acc 0.922, time 27.3 sec
epoch 171, loss 0.0000, train acc 1.000, test acc 0.922, time 27.5 sec
epoch 172, loss 0.0000, train acc 1.000, test acc 0.923, time 27.7 sec
epoch 173, loss 0.0000, train acc 1.000, test acc 0.922, time 27.4 sec
epoch 174, loss 0.0000, train acc 1.000, test acc 0.922, time 27.7 sec
epoch 175, loss 0.0000, train acc 1.000, test acc 0.922, time 27.5 sec
epoch 176, loss 0.0000, train acc 1.000, test acc 0.923, time 27.2 sec
epoch 177, loss 0.0000, train acc 1.000, test acc 0.923, time 27.7 sec
epoch 178, loss 0.0000, train acc 1.000, test acc 0.922, time 27.4 sec
epoch 179, loss 0.0000, train acc 1.000, test acc 0.923, time 27.6 sec
epoch 180, loss 0.0000, train acc 1.000, test acc 0.922, time 27.3 sec
epoch 181, loss 0.0000, train acc 1.000, test acc 0.923, time 27.3 sec
epoch 182, loss 0.0000, train acc 1.000, test acc 0.923, time 27.8 sec
epoch 183, loss 0.0000, train acc 1.000, test acc 0.923, time 27.4 sec
epoch 184, loss 0.0000, train acc 1.000, test acc 0.922, time 27.7 sec
epoch 185, loss 0.0000, train acc 1.000, test acc 0.922, time 27.4 sec
epoch 186, loss 0.0000, train acc 1.000, test acc 0.923, time 27.4 sec
epoch 187, loss 0.0000, train acc 1.000, test acc 0.923, time 27.7 sec
epoch 188, loss 0.0000, train acc 1.000, test acc 0.922, time 27.3 sec
epoch 189, loss 0.0000, train acc 1.000, test acc 0.923, time 27.7 sec
epoch 190, loss 0.0000, train acc 1.000, test acc 0.923, time 27.3 sec
epoch 191, loss 0.0000, train acc 1.000, test acc 0.921, time 27.3 sec
epoch 192, loss 0.0000, train acc 1.000, test acc 0.922, time 27.6 sec
epoch 193, loss 0.0000, train acc 1.000, test acc 0.923, time 27.5 sec
epoch 194, loss 0.0000, train acc 1.000, test acc 0.922, time 27.5 sec
epoch 195, loss 0.0000, train acc 1.000, test acc 0.923, time 27.4 sec
epoch 196, loss 0.0000, train acc 1.000, test acc 0.922, time 27.4 sec
epoch 197, loss 0.0000, train acc 1.000, test acc 0.922, time 27.5 sec
epoch 198, loss 0.0000, train acc 1.000, test acc 0.923, time 27.4 sec
epoch 199, loss 0.0000, train acc 1.000, test acc 0.922, time 27.4 sec
epoch 200, loss 0.0000, train acc 1.000, test acc 0.923, time 27.3 sec
```
## 稠密连结网络（DenseNet）

```Python
from mxnet import autograd, gluon, init, nd
from mxnet.gluon import nn, data as gdata, loss as gloss
import mxnet as mx
import sys
import os
import time


def conv_block(num_channels):
    blk = nn.Sequential()
    blk.add(nn.BatchNorm(),
            nn.Activation('relu'),
            nn.Conv2D(num_channels, kernel_size=3, padding=1))
    return blk


class DenseBlock(nn.Block):
    def __init__(self, num_convs, num_channels, **kwargs):
        super(DenseBlock, self).__init__(**kwargs)
        self.net = nn.Sequential()
        for _ in range(num_convs):
            self.net.add(conv_block(num_channels))

    def forward(self, X):
        for blk in self.net:
            Y = blk(X)
            X = nd.concat(X, Y, dim=1)  # 在通道维上将输入和输出连结
        return X


def transition_block(num_channels):
    blk = nn.Sequential()
    blk.add(nn.BatchNorm(),
            nn.Activation('relu'),
            nn.Conv2D(num_channels, kernel_size=1),
            nn.AvgPool2D(pool_size=2, strides=2))
    return blk


# # 测试
# X = nd.random.uniform(shape=(1, 2, 4, 4))
# Y = nd.random.uniform(shape=(1, 3, 4, 4))
# Z = nd.concat(X, Y, dim=1)
# print(Z.shape)
#
# blk = DenseBlock(2, 10)
# blk.initialize()
# X = nd.random.uniform(shape=(4, 3, 8, 8))
# Y = blk(X)
# print(Y.shape)
#
# blk = transition_block(10)
# blk.initialize()
# print(blk(Y).shape)
# # 测试输出
# # (1, 5, 4, 4)
# # (4, 23, 8, 8)
# # (4, 10, 4, 4)

def try_gpu():
    try:
        ctx = mx.gpu(3)
        _ = nd.array((1,), ctx=ctx)
    except mx.base.MXNetError:
        ctx = mx.cpu()
    return ctx


def load_data_fashion_mnist(batch_size, resize=None, root=os.path.join('-', 'mxnet', 'datasets', 'fashion-mnist')):
    root = os.path.expanduser(root)
    transformer = []
    if resize:
        transformer += [gdata.vision.transforms.Resize(resize)]
    transformer += [gdata.vision.transforms.ToTensor()]
    transformer = gdata.vision.transforms.Compose(transformer)

    mnist_train = gdata.vision.FashionMNIST(root=root, train=True)
    mnist_test = gdata.vision.FashionMNIST(root=root, train=False)

    num_workers = 0 if sys.platform.startswith('win') else 4
    train_iter = gdata.DataLoader(mnist_train.transform_first(transformer),
                                  batch_size=batch_size,
                                  shuffle=True,
                                  num_workers=num_workers)
    test_iter = gdata.DataLoader(mnist_test.transform_first(transformer),
                                 batch_size=batch_size,
                                 shuffle=True,
                                 num_workers=num_workers)
    return train_iter, test_iter


def evaluate_accuracy(net, data_iter, ctx):
    acc_sum, n = nd.array([0], ctx=ctx), 0
    for X, y in data_iter:
        X, y = X.as_in_context(ctx), y.as_in_context(ctx).astype('float32')
        y_hat = net(X)
        acc_sum += (y_hat.argmax(axis=1) == y).sum()
        n += y.size
    return acc_sum.asscalar() / n


def train(net, train_iter, test_iter, batch_size, trainer, ctx, num_epochs):
    print("training on ", ctx)
    loss = gloss.SoftmaxCrossEntropyLoss()
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n, start = 0.0, 0.0, 0, time.time()
        for X, y in train_iter:
            X, y = X.as_in_context(ctx), y.as_in_context(ctx)
            with autograd.record():
                y_hat = net(X)
                l = loss(y_hat, y).sum()
            l.backward()
            trainer.step(batch_size)
            train_l_sum += l.asscalar()
            train_acc_sum += (y_hat.argmax(axis=1) == y.astype('float32')).sum().asscalar()
            n += y.size
        test_acc = evaluate_accuracy(net, test_iter, ctx)
        print('epoch %3d, loss %.4f, train acc %.3f, test acc %.3f, time %.1f sec'
              % (epoch + 1, train_l_sum / n, train_acc_sum / n, test_acc, time.time() - start))


net = nn.Sequential()
net.add(nn.Conv2D(64, kernel_size=7, strides=2, padding=3),
        nn.BatchNorm(),
        nn.Activation('relu'),
        nn.MaxPool2D(pool_size=3, strides=2, padding=1))

num_channels, groth_rate = 64, 43  # num_channels为当前的通道数
num_convs_in_dense_blocks = [4, 4, 4, 4]

for i, num_convs in enumerate(num_convs_in_dense_blocks):
    net.add(DenseBlock(num_convs, groth_rate))
    # 上一个稠密块的输出通道数
    num_channels += num_convs * groth_rate
    # 在稠密块之间加入通道数减半的过渡层
    if i != len(num_convs_in_dense_blocks) - 1:
        num_channels //= 2
        net.add(transition_block(num_channels))

net.add(nn.BatchNorm(),
        nn.Activation('relu'),
        nn.GlobalAvgPool2D(),
        nn.Dense(10))

lr, num_epochs, batch_size, ctx = 0.1, 200, 640, try_gpu()
net.initialize(force_reinit=True, ctx=ctx, init=init.Xavier())
trainer = gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': lr})
train_iter, test_iter = load_data_fashion_mnist(batch_size, resize=96)
train(net, train_iter, test_iter, batch_size, trainer, ctx, num_epochs)

```
```Python
training on  gpu(0)
epoch   1, loss 0.6599, train acc 0.771, test acc 0.849, time 65.5 sec
epoch   2, loss 0.3640, train acc 0.869, test acc 0.881, time 57.1 sec
epoch   3, loss 0.3030, train acc 0.890, test acc 0.893, time 57.0 sec
epoch   4, loss 0.2646, train acc 0.903, test acc 0.904, time 57.2 sec
epoch   5, loss 0.2404, train acc 0.913, test acc 0.907, time 57.2 sec
epoch   6, loss 0.2225, train acc 0.919, test acc 0.903, time 57.1 sec
epoch   7, loss 0.2074, train acc 0.924, test acc 0.920, time 57.3 sec
epoch   8, loss 0.1889, train acc 0.931, test acc 0.909, time 57.4 sec
epoch   9, loss 0.1790, train acc 0.936, test acc 0.912, time 57.3 sec
epoch  10, loss 0.1657, train acc 0.939, test acc 0.892, time 57.4 sec
epoch  11, loss 0.1596, train acc 0.943, test acc 0.911, time 57.1 sec
epoch  12, loss 0.1484, train acc 0.946, test acc 0.915, time 57.3 sec
epoch  13, loss 0.1381, train acc 0.950, test acc 0.915, time 57.3 sec
epoch  14, loss 0.1308, train acc 0.953, test acc 0.926, time 57.3 sec
epoch  15, loss 0.1207, train acc 0.957, test acc 0.921, time 57.1 sec
epoch  16, loss 0.1113, train acc 0.960, test acc 0.928, time 57.4 sec
epoch  17, loss 0.1085, train acc 0.962, test acc 0.836, time 57.2 sec
epoch  18, loss 0.0990, train acc 0.964, test acc 0.911, time 57.0 sec
epoch  19, loss 0.0892, train acc 0.968, test acc 0.917, time 57.1 sec
epoch  20, loss 0.0824, train acc 0.971, test acc 0.904, time 57.2 sec
epoch  21, loss 0.0759, train acc 0.974, test acc 0.919, time 57.3 sec
epoch  22, loss 0.0669, train acc 0.976, test acc 0.921, time 57.1 sec
epoch  23, loss 0.0648, train acc 0.978, test acc 0.922, time 57.2 sec
epoch  24, loss 0.0595, train acc 0.980, test acc 0.925, time 57.3 sec
epoch  25, loss 0.0588, train acc 0.981, test acc 0.932, time 57.1 sec
epoch  26, loss 0.0404, train acc 0.988, test acc 0.909, time 57.3 sec
epoch  27, loss 0.0530, train acc 0.983, test acc 0.917, time 57.2 sec
epoch  28, loss 0.0372, train acc 0.988, test acc 0.932, time 57.2 sec
epoch  29, loss 0.0245, train acc 0.993, test acc 0.925, time 57.1 sec
epoch  30, loss 0.0227, train acc 0.994, test acc 0.928, time 56.7 sec
epoch  31, loss 0.0178, train acc 0.996, test acc 0.925, time 57.2 sec
epoch  32, loss 0.0077, train acc 0.999, test acc 0.934, time 57.0 sec
epoch  33, loss 0.0040, train acc 1.000, test acc 0.933, time 57.2 sec
epoch  34, loss 0.0025, train acc 1.000, test acc 0.939, time 57.3 sec
epoch  35, loss 0.0019, train acc 1.000, test acc 0.941, time 57.1 sec
epoch  36, loss 0.0015, train acc 1.000, test acc 0.941, time 57.3 sec
epoch  37, loss 0.0013, train acc 1.000, test acc 0.940, time 57.0 sec
epoch  38, loss 0.0012, train acc 1.000, test acc 0.941, time 57.2 sec
epoch  39, loss 0.0011, train acc 1.000, test acc 0.941, time 56.9 sec
epoch  40, loss 0.0010, train acc 1.000, test acc 0.940, time 57.5 sec
epoch  41, loss 0.0009, train acc 1.000, test acc 0.941, time 57.1 sec
epoch  42, loss 0.0008, train acc 1.000, test acc 0.941, time 57.1 sec
epoch  43, loss 0.0008, train acc 1.000, test acc 0.941, time 57.1 sec
epoch  44, loss 0.0007, train acc 1.000, test acc 0.942, time 57.2 sec
epoch  45, loss 0.0007, train acc 1.000, test acc 0.941, time 56.9 sec
epoch  46, loss 0.0007, train acc 1.000, test acc 0.941, time 57.0 sec
epoch  47, loss 0.0006, train acc 1.000, test acc 0.941, time 57.3 sec
epoch  48, loss 0.0006, train acc 1.000, test acc 0.941, time 57.2 sec
epoch  49, loss 0.0006, train acc 1.000, test acc 0.941, time 56.9 sec
epoch  50, loss 0.0006, train acc 1.000, test acc 0.940, time 57.2 sec
epoch  51, loss 0.0005, train acc 1.000, test acc 0.941, time 57.0 sec
epoch  52, loss 0.0005, train acc 1.000, test acc 0.940, time 57.1 sec
epoch  53, loss 0.0005, train acc 1.000, test acc 0.941, time 57.1 sec
epoch  54, loss 0.0005, train acc 1.000, test acc 0.940, time 57.0 sec
epoch  55, loss 0.0004, train acc 1.000, test acc 0.940, time 57.3 sec
epoch  56, loss 0.0004, train acc 1.000, test acc 0.941, time 57.2 sec
epoch  57, loss 0.0004, train acc 1.000, test acc 0.941, time 57.1 sec
epoch  58, loss 0.0004, train acc 1.000, test acc 0.941, time 57.0 sec
epoch  59, loss 0.0004, train acc 1.000, test acc 0.940, time 57.2 sec
epoch  60, loss 0.0004, train acc 1.000, test acc 0.940, time 57.2 sec
epoch  61, loss 0.0004, train acc 1.000, test acc 0.941, time 57.1 sec
epoch  62, loss 0.0004, train acc 1.000, test acc 0.942, time 57.4 sec
epoch  63, loss 0.0004, train acc 1.000, test acc 0.942, time 57.3 sec
epoch  64, loss 0.0003, train acc 1.000, test acc 0.941, time 57.3 sec
epoch  65, loss 0.0003, train acc 1.000, test acc 0.941, time 57.0 sec
epoch  66, loss 0.0003, train acc 1.000, test acc 0.942, time 57.3 sec
epoch  67, loss 0.0003, train acc 1.000, test acc 0.941, time 57.0 sec
epoch  68, loss 0.0003, train acc 1.000, test acc 0.941, time 57.2 sec
epoch  69, loss 0.0003, train acc 1.000, test acc 0.941, time 57.1 sec
epoch  70, loss 0.0003, train acc 1.000, test acc 0.941, time 57.1 sec
epoch  71, loss 0.0003, train acc 1.000, test acc 0.942, time 57.2 sec
epoch  72, loss 0.0003, train acc 1.000, test acc 0.941, time 57.2 sec
epoch  73, loss 0.0003, train acc 1.000, test acc 0.941, time 57.3 sec
epoch  74, loss 0.0003, train acc 1.000, test acc 0.941, time 57.3 sec
epoch  75, loss 0.0003, train acc 1.000, test acc 0.941, time 57.3 sec
epoch  76, loss 0.0003, train acc 1.000, test acc 0.941, time 57.0 sec
epoch  77, loss 0.0003, train acc 1.000, test acc 0.941, time 57.3 sec
epoch  78, loss 0.0002, train acc 1.000, test acc 0.942, time 57.3 sec
epoch  79, loss 0.0002, train acc 1.000, test acc 0.941, time 57.2 sec
epoch  80, loss 0.0002, train acc 1.000, test acc 0.941, time 56.9 sec
epoch  81, loss 0.0002, train acc 1.000, test acc 0.941, time 57.1 sec
epoch  82, loss 0.0002, train acc 1.000, test acc 0.941, time 56.9 sec
epoch  83, loss 0.0002, train acc 1.000, test acc 0.941, time 57.0 sec
epoch  84, loss 0.0002, train acc 1.000, test acc 0.940, time 57.1 sec
epoch  85, loss 0.0002, train acc 1.000, test acc 0.940, time 57.3 sec
epoch  86, loss 0.0002, train acc 1.000, test acc 0.941, time 57.0 sec
epoch  87, loss 0.0002, train acc 1.000, test acc 0.940, time 57.1 sec
epoch  88, loss 0.0002, train acc 1.000, test acc 0.941, time 57.2 sec
epoch  89, loss 0.0002, train acc 1.000, test acc 0.940, time 57.2 sec
epoch  90, loss 0.0002, train acc 1.000, test acc 0.941, time 56.9 sec
epoch  91, loss 0.0002, train acc 1.000, test acc 0.941, time 57.1 sec
epoch  92, loss 0.0002, train acc 1.000, test acc 0.941, time 57.0 sec
epoch  93, loss 0.0002, train acc 1.000, test acc 0.941, time 57.3 sec
epoch  94, loss 0.0002, train acc 1.000, test acc 0.941, time 57.1 sec
epoch  95, loss 0.0002, train acc 1.000, test acc 0.941, time 57.1 sec
epoch  96, loss 0.0002, train acc 1.000, test acc 0.941, time 57.4 sec
epoch  97, loss 0.0002, train acc 1.000, test acc 0.941, time 57.0 sec
epoch  98, loss 0.0002, train acc 1.000, test acc 0.940, time 57.0 sec
epoch  99, loss 0.0002, train acc 1.000, test acc 0.941, time 56.8 sec
epoch 100, loss 0.0002, train acc 1.000, test acc 0.941, time 56.9 sec
epoch 101, loss 0.0002, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 102, loss 0.0002, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 103, loss 0.0002, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 104, loss 0.0002, train acc 1.000, test acc 0.940, time 57.1 sec
epoch 105, loss 0.0002, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 106, loss 0.0002, train acc 1.000, test acc 0.941, time 57.2 sec
epoch 107, loss 0.0002, train acc 1.000, test acc 0.941, time 57.0 sec
epoch 108, loss 0.0002, train acc 1.000, test acc 0.940, time 57.1 sec
epoch 109, loss 0.0002, train acc 1.000, test acc 0.941, time 57.2 sec
epoch 110, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 111, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 112, loss 0.0001, train acc 1.000, test acc 0.940, time 57.1 sec
epoch 113, loss 0.0002, train acc 1.000, test acc 0.941, time 57.0 sec
epoch 114, loss 0.0001, train acc 1.000, test acc 0.941, time 57.3 sec
epoch 115, loss 0.0001, train acc 1.000, test acc 0.941, time 57.2 sec
epoch 116, loss 0.0001, train acc 1.000, test acc 0.941, time 57.0 sec
epoch 117, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 118, loss 0.0001, train acc 1.000, test acc 0.940, time 57.0 sec
epoch 119, loss 0.0001, train acc 1.000, test acc 0.941, time 57.0 sec
epoch 120, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 121, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 122, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 123, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 124, loss 0.0001, train acc 1.000, test acc 0.941, time 56.8 sec
epoch 125, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 126, loss 0.0001, train acc 1.000, test acc 0.941, time 57.2 sec
epoch 127, loss 0.0001, train acc 1.000, test acc 0.940, time 57.0 sec
epoch 128, loss 0.0001, train acc 1.000, test acc 0.941, time 56.9 sec
epoch 129, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 130, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 131, loss 0.0001, train acc 1.000, test acc 0.941, time 56.8 sec
epoch 132, loss 0.0001, train acc 1.000, test acc 0.941, time 57.0 sec
epoch 133, loss 0.0001, train acc 1.000, test acc 0.940, time 57.0 sec
epoch 134, loss 0.0001, train acc 1.000, test acc 0.941, time 57.2 sec
epoch 135, loss 0.0001, train acc 1.000, test acc 0.940, time 57.2 sec
epoch 136, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 137, loss 0.0001, train acc 1.000, test acc 0.941, time 57.0 sec
epoch 138, loss 0.0001, train acc 1.000, test acc 0.941, time 57.2 sec
epoch 139, loss 0.0001, train acc 1.000, test acc 0.941, time 57.0 sec
epoch 140, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 141, loss 0.0001, train acc 1.000, test acc 0.940, time 57.1 sec
epoch 142, loss 0.0001, train acc 1.000, test acc 0.940, time 57.0 sec
epoch 143, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 144, loss 0.0001, train acc 1.000, test acc 0.940, time 57.2 sec
epoch 145, loss 0.0001, train acc 1.000, test acc 0.940, time 57.3 sec
epoch 146, loss 0.0001, train acc 1.000, test acc 0.940, time 57.1 sec
epoch 147, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 148, loss 0.0001, train acc 1.000, test acc 0.941, time 57.0 sec
epoch 149, loss 0.0001, train acc 1.000, test acc 0.940, time 57.3 sec
epoch 150, loss 0.0001, train acc 1.000, test acc 0.940, time 57.3 sec
epoch 151, loss 0.0001, train acc 1.000, test acc 0.941, time 57.2 sec
epoch 152, loss 0.0001, train acc 1.000, test acc 0.941, time 57.2 sec
epoch 153, loss 0.0001, train acc 1.000, test acc 0.940, time 57.2 sec
epoch 154, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 155, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 156, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 157, loss 0.0001, train acc 1.000, test acc 0.941, time 57.2 sec
epoch 158, loss 0.0001, train acc 1.000, test acc 0.941, time 57.0 sec
epoch 159, loss 0.0001, train acc 1.000, test acc 0.940, time 57.2 sec
epoch 160, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 161, loss 0.0001, train acc 1.000, test acc 0.940, time 57.2 sec
epoch 162, loss 0.0001, train acc 1.000, test acc 0.941, time 57.3 sec
epoch 163, loss 0.0001, train acc 1.000, test acc 0.940, time 57.0 sec
epoch 164, loss 0.0001, train acc 1.000, test acc 0.941, time 57.0 sec
epoch 165, loss 0.0001, train acc 1.000, test acc 0.940, time 57.1 sec
epoch 166, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 167, loss 0.0001, train acc 1.000, test acc 0.941, time 57.0 sec
epoch 168, loss 0.0001, train acc 1.000, test acc 0.940, time 57.3 sec
epoch 169, loss 0.0001, train acc 1.000, test acc 0.940, time 57.2 sec
epoch 170, loss 0.0001, train acc 1.000, test acc 0.941, time 57.0 sec
epoch 171, loss 0.0001, train acc 1.000, test acc 0.941, time 57.0 sec
epoch 172, loss 0.0001, train acc 1.000, test acc 0.941, time 57.3 sec
epoch 173, loss 0.0001, train acc 1.000, test acc 0.941, time 57.3 sec
epoch 174, loss 0.0001, train acc 1.000, test acc 0.941, time 57.3 sec
epoch 175, loss 0.0001, train acc 1.000, test acc 0.941, time 56.9 sec
epoch 176, loss 0.0001, train acc 1.000, test acc 0.940, time 57.0 sec
epoch 177, loss 0.0001, train acc 1.000, test acc 0.941, time 57.2 sec
epoch 178, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 179, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 180, loss 0.0001, train acc 1.000, test acc 0.941, time 57.2 sec
epoch 181, loss 0.0001, train acc 1.000, test acc 0.941, time 57.4 sec
epoch 182, loss 0.0001, train acc 1.000, test acc 0.941, time 57.4 sec
epoch 183, loss 0.0001, train acc 1.000, test acc 0.941, time 57.0 sec
epoch 184, loss 0.0001, train acc 1.000, test acc 0.941, time 57.2 sec
epoch 185, loss 0.0001, train acc 1.000, test acc 0.940, time 57.2 sec
epoch 186, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 187, loss 0.0001, train acc 1.000, test acc 0.941, time 57.3 sec
epoch 188, loss 0.0001, train acc 1.000, test acc 0.940, time 57.1 sec
epoch 189, loss 0.0001, train acc 1.000, test acc 0.941, time 57.2 sec
epoch 190, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 191, loss 0.0001, train acc 1.000, test acc 0.941, time 57.0 sec
epoch 192, loss 0.0001, train acc 1.000, test acc 0.940, time 57.1 sec
epoch 193, loss 0.0001, train acc 1.000, test acc 0.940, time 57.1 sec
epoch 194, loss 0.0001, train acc 1.000, test acc 0.941, time 57.2 sec
epoch 195, loss 0.0001, train acc 1.000, test acc 0.941, time 57.1 sec
epoch 196, loss 0.0001, train acc 1.000, test acc 0.941, time 57.0 sec
epoch 197, loss 0.0001, train acc 1.000, test acc 0.940, time 57.1 sec
epoch 198, loss 0.0001, train acc 1.000, test acc 0.941, time 57.0 sec
epoch 199, loss 0.0001, train acc 1.000, test acc 0.941, time 57.2 sec
epoch 200, loss 0.0001, train acc 1.000, test acc 0.940, time 57.2 sec
```
> # 优化算法

|类型|公式|
|:--:|:--:|
|梯度下降（Gradient descent）|$\pmb{g}\_{t} \leftarrow\nabla f\_{\mathcal{B}\_{t}}\left(\pmb{x}\_{t-1}\right)=\frac{1}{\mid\mathcal{B}\mid}\sum_{i\in\mathcal{B}\_{t}}\nabla f\_i\left(\pmb{x}\_{t-1}\right),$<br> $\pmb{x}\_t\leftarrow\pmb{x}\_{t-1}-\eta\_t\pmb{g}\_t,$<br> $\mid\mathcal{B}\mid=\mid\mathcal{B}\_t\mid=n.$|
|随机梯度下降（Stochastic gradient descent, SGD）|$\pmb{x}\leftarrow \pmb{x}-\eta\nabla f\_i\left(\pmb{x}\right),$<br>$i=\pmb{random}\lbrace 1,...,n\rbrace$|
|小批量随机梯度下降（Mini-batch stochastic gradient descent）|$\pmb{g}\_{t} \leftarrow\nabla f\_{\mathcal{B}\_{t}}\left(\pmb{x}\_{t-1}\right)=\frac{1}{\mid\mathcal{B}\mid}\sum_{i\in\mathcal{B}\_{t}}\nabla f\_i\left(\pmb{x}\_{t-1}\right),$<br> $\pmb{x}\_t\leftarrow\pmb{x}\_{t-1}-\eta\_t\pmb{g}\_t,$<br> $\mid\mathcal{B}\mid=\mid\mathcal{B}\_t\mid<n.$|
|<font color=red>以上三个注意看小批量随机梯度下降的代码实现</font>|<font color=red>会发现三者代码编写一样，区别仅仅在于批量大小值，这与前面已经随机获取$\mid\mathcal{B}\mid$批量数据有关！！！</font>|
|动量法（Momentum）|$\pmb{v}\_t\leftarrow\gamma\pmb{v}\_{t-1}+\eta\_t\pmb{g}\_t=\gamma\pmb{v}\_{t-1}+\left(1-\gamma\right)\left(\frac{\eta\_t\pmb{g}\_t}{1-\gamma}\right),$<br> $\pmb{x}\_t\leftarrow\pmb{x}\_{t-1}-\pmb{v}\_t,\\\ 1\leq\gamma<1.$|
|AdaGrad算法|$\pmb{s}\_t\leftarrow\pmb{s}\_{t-1}+\pmb{g}\_t\bigodot\pmb{g}\_t,$<br>$\pmb{x}\_t\leftarrow\pmb{x}\_{t-1}-\frac{\eta}{\sqrt{\pmb{s}\_t+\epsilon}}\bigodot\pmb{g}\_t.$|
|RMSProp算法|$\pmb{s}\_t\leftarrow\gamma\pmb{s}\_{t-1}+\left(1-\gamma\right)\pmb{g}\_t\bigodot\pmb{g}\_t,$<br>$\pmb{x}\_t\leftarrow\pmb{x}\_{t-1}-\frac{\eta}{\sqrt{\pmb{s}\_t+\epsilon}}\bigodot\pmb{g}\_t,$<br>$0\leq\gamma<1.$|
|AdaDelta算法|$\pmb{s}\_t\leftarrow\rho\pmb{s}\_{t-1}+\left(1-\rho\right)\pmb{g}\_t\bigodot\pmb{g}\_t,$<br>$\pmb{g}\_t^{\prime}\leftarrow\sqrt{\frac{\Delta\pmb{x}\_{t-1}+\epsilon}{\pmb{s}\_t+\epsilon}}\bigodot\pmb{g}\_t,$<br>$\pmb{x}\_t\leftarrow\pmb{x}\_{t-1}-\pmb{g}\_t^{\prime},$<br>$\Delta\pmb{x}\_t\leftarrow\Delta\pmb{x}\_{t-1}+\left(1-\rho\right)\pmb{g}\_t^{\prime}\bigodot\pmb{g}\_t^{\prime},$<br>$0\leq\rho<1.$|
|Adam算法|$\pmb{v\_t}\_t\leftarrow\beta\_1\pmb{v}\_{t-1}+\left(1-\beta\_1\right)\pmb{g}\_t,$<br>$\pmb{s}\leftarrow\beta\_{2}\pmb{s}\_{t-1}+\left(1-\beta\_{2}\right)\pmb{g}\_t\bigodot\pmb{g}\_t,$<br>$\hat{\pmb{v}\_t}\leftarrow\frac{\pmb{v}\_t}{1-\beta\_1^t},$<br>$\hat{\pmb{s}\_t}\leftarrow\frac{\pmb{s}\_t}{1-\beta\_2^t},$<br>$\pmb{g}\_t^{\prime}\leftarrow\frac{\eta\hat{\pmb{v}\_t}}{\sqrt{\hat{\pmb{s}\_t}+\epsilon}},$<br>$\pmb{x}\_t\leftarrow\pmb{x}\_{t-1}-\pmb{g}\_t^{\prime},$<br>$0\leq\beta\_1,\beta\_2<1(recommend:\beta\_1=0.9,\beta\_2=0.999).$|


## 优化与深度学习
```Python
from mpl_toolkits import mplot3d
import numpy as np
from matplotlib import pyplot as plt
from IPython import display


def f(x):
    return x * np.cos(np.pi * x)


# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


set_figsize((4.5, 2.5))
x = np.arange(-1.0, 2.0, 0.1)
fig, = plt.plot(x, f(x))  # 逗号表示只取返回列表中的第一个元素
fig.axes.annotate('local minimum', xy=(-0.3, -0.25), xytext=(-0.77, -1.0),
                  arrowprops=dict(arrowstyle='->'))
fig.axes.annotate('global minimum', xy=(1.1, -0.95), xytext=(0.6, 0.8),
                  arrowprops=dict(arrowstyle='->'))
plt.xlabel('x')
plt.ylabel('f(x')
plt.show()

x = np.arange(-2.0, 2.0, 0.1)
fig, = plt.plot(x, x ** 3)
fig.axes.annotate('saddle point', xy=(0, -0.2), xytext=(-0.52, -5.0),
                  arrowprops=dict(arrowstyle='->'))
plt.xlabel('x')
plt.ylabel('f(x')
plt.show()

x, y = np.mgrid[-1: 1:31j, -1: 1: 31j]
z = x ** 2 - y ** 2
ax = plt.figure().add_subplot(111, projection='3d')
ax.plot_wireframe(x, y, z, **{'rstride': 2, 'cstride': 2})
ax.plot([0], [0], [0], 'rx')
ticks = [-1, 0, 1]
plt.xticks(ticks)
plt.yticks(ticks)
ax.set_zticks(ticks)
plt.xlabel('x')
plt.ylabel('y')
plt.show()

```
## 梯度下降和随机梯度下降
### 一维梯度下降
```Python
from mpl_toolkits import mplot3d
import numpy as np
from matplotlib import pyplot as plt
from IPython import display


# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def gd(eta):
    x = 10
    results = [x]
    for i in range(10):
        x -= eta * 2 * x  # f(x) = x * x的导数为f'(x) = 2 * x
        results.append(x)
    print('epoch 10, x:', x)
    return results


res = gd(0.2)


def show_trace(res):
    n = max(abs(min(res)), abs(max(res)), 10)
    f_line = np.arange(-n, n, 0.1)
    set_figsize()
    plt.plot(f_line, [x * x for x in f_line])
    plt.plot(res, [x * x for x in res], '-o')
    plt.xlabel('x')
    plt.ylabel('f(x)')
    plt.show()


# 正常下降
show_trace(res)
# 学习率太小，下降太慢
show_trace(gd(0.05))
# 学习率太大，无法收敛，无法保证迭代x会降低f(x)的值
show_trace(gd(1.1))

```
```Python
Ouputs:
epoch 10, x: 0.06046617599999997
epoch 10, x: 3.4867844009999995
epoch 10, x: 61.917364224000096
```
### 多维梯度下降
```Python
from mpl_toolkits import mplot3d
import numpy as np
from matplotlib import pyplot as plt
from IPython import display
from mxnet import nd


def train_2d(trainer):
    x1, x2, s1, s2 = -5, -2, 0, 0
    results = [(x1, x2)]
    for i in range(20):
        x1, x2, s1, s2 = trainer(x1, x2, s1, s2)
        results.append((x1, x2))
        print('epoch %2d, x1 %f, x2 %f' % (i + 1, x1, x2))
    return results


def show_trace_2d(f, results):
    # print(*results)
    # print(*zip(*results))
    plt.plot(*zip(*results), '-o', color='#ff7f02')
    x1, x2 = np.meshgrid(np.arange(-5.5, 1.0, 0.1), np.arange(-3.0, 1.0, 0.1))
    plt.contour(x1, x2, f(x1, x2), colors='#1f77b4')
    plt.xlabel('x1')
    plt.ylabel('x2')
    plt.show()


eta = 0.1


def f_2d(x1, x2):
    return x1 ** 2 + 2 * x2 ** 2


def gd_2d(x1, x2, s1, s2):
    return x1 - eta * 2 * x1, x2 - eta * 4 * x2, 0, 0


show_trace_2d(f_2d, train_2d(gd_2d))

```
```Python
Outputs:
epoch  1, x1 -4.000000, x2 -1.200000
epoch  2, x1 -3.200000, x2 -0.720000
epoch  3, x1 -2.560000, x2 -0.432000
epoch  4, x1 -2.048000, x2 -0.259200
epoch  5, x1 -1.638400, x2 -0.155520
epoch  6, x1 -1.310720, x2 -0.093312
epoch  7, x1 -1.048576, x2 -0.055987
epoch  8, x1 -0.838861, x2 -0.033592
epoch  9, x1 -0.671089, x2 -0.020155
epoch 10, x1 -0.536871, x2 -0.012093
epoch 11, x1 -0.429497, x2 -0.007256
epoch 12, x1 -0.343597, x2 -0.004354
epoch 13, x1 -0.274878, x2 -0.002612
epoch 14, x1 -0.219902, x2 -0.001567
epoch 15, x1 -0.175922, x2 -0.000940
epoch 16, x1 -0.140737, x2 -0.000564
epoch 17, x1 -0.112590, x2 -0.000339
epoch 18, x1 -0.090072, x2 -0.000203
epoch 19, x1 -0.072058, x2 -0.000122
epoch 20, x1 -0.057646, x2 -0.000073
```
### 随机梯度下降
```Python
from mpl_toolkits import mplot3d
import numpy as np
from matplotlib import pyplot as plt
from IPython import display
from mxnet import nd


def train_2d(trainer):
    x1, x2, s1, s2 = -5, -2, 0, 0
    results = [(x1, x2)]
    for i in range(20):
        x1, x2, s1, s2 = trainer(x1, x2, s1, s2)
        results.append((x1, x2))
        print('epoch %2d, x1 %f, x2 %f' % (i + 1, x1, x2))
    return results


def show_trace_2d(f, results):
    # print(*results)
    # print(*zip(*results))
    plt.plot(*zip(*results), '-o', color='#ff7f02')
    x1, x2 = np.meshgrid(np.arange(-5.5, 1.0, 0.1), np.arange(-3.0, 1.0, 0.1))
    plt.contour(x1, x2, f(x1, x2), colors='#1f77b4')
    plt.xlabel('x1')
    plt.ylabel('x2')
    plt.show()


eta = 0.1


def gd_2d(x1, x2, s1, s2):
    return x1 - eta * 2 * x1, x2 - eta * 4 * x2, 0, 0


def sgd_2d(x1, x2, s1, s2):
    return x1 - eta * (2 * x1 + np.random.normal(0.1)), x2 - eta * (4 * x2 + np.random.normal(0.1)), 0, 0


show_trace_2d(f_2d, train_2d(sgd_2d))

```
```Python
epoch  1, x1 -4.063163, x2 -1.156916
epoch  2, x1 -3.192331, x2 -0.679059
epoch  3, x1 -2.592534, x2 -0.417813
epoch  4, x1 -2.147614, x2 -0.295555
epoch  5, x1 -1.694823, x2 -0.127867
epoch  6, x1 -1.328579, x2 -0.078377
epoch  7, x1 -0.940294, x2 0.029740
epoch  8, x1 -0.864500, x2 -0.169021
epoch  9, x1 -0.656943, x2 -0.166025
epoch 10, x1 -0.706104, x2 -0.244736
epoch 11, x1 -0.554380, x2 -0.294595
epoch 12, x1 -0.528366, x2 -0.147541
epoch 13, x1 -0.446908, x2 -0.157002
epoch 14, x1 -0.193828, x2 -0.153164
epoch 15, x1 -0.054490, x2 -0.211016
epoch 16, x1 -0.125445, x2 -0.246685
epoch 17, x1 -0.184876, x2 -0.213838
epoch 18, x1 -0.061043, x2 -0.074384
epoch 19, x1 -0.020094, x2 0.019678
epoch 20, x1 0.078296, x2 0.057125
```
## 小批量随机梯度下降
### 原生实现
```Python
from mxnet import autograd, gluon, init, nd
from mxnet.gluon import nn, data as gdata, loss as gloss
import numpy as np
import time
import matplotlib.pyplot as plt
from IPython import display


# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def get_data_ch7():
    data = np.genfromtxt('data/airfoil_self_noise.dat', delimiter='\t')
    data = (data - data.mean(axis=0)) / data.std(axis=0)
    return nd.array(data[:1500, :-1]), nd.array(data[:1500, -1])


features, labels = get_data_ch7()
print(features.shape)


def sgd(params, states, hyperparams):
    for param in params:
        param[:] -= hyperparams['lr'] * param.grad


# 定义模型
# Define model
def linreg(x, w, b):
    result = nd.dot(x, w) + b
    # print("net:", result)
    return result


# 定义损失函数
# Define square loss function
def sqaured_loss(y_hat, y):
    result = (y_hat - y.reshape(y_hat.shape)) ** 2 / 2
    # print("loss:", result)
    return result


def train_ch7(trainer_fn, states, hyperparams, features, labels, batch_size=10, num_epochs=2):
    print('training:')
    # 初始化模型
    net, loss = linreg, sqaured_loss
    w = nd.random.normal(scale=0.01, shape=(features.shape[1], 1))
    b = nd.zeros(1)
    w.attach_grad()
    b.attach_grad()

    def eval_loss():
        return loss(net(features, w, b), labels).mean().asscalar()

    ls = [eval_loss()]
    data_iter = gdata.DataLoader(gdata.ArrayDataset(features, labels), batch_size, shuffle=True)
    for _ in range(num_epochs):
        start = time.time()
        for batch_i, (X, y) in enumerate(data_iter):
            # print(batch_i)
            with autograd.record():
                l = loss(net(X, w, b), y).mean()  # 使用平均损失
            l.backward()
            trainer_fn([w, b], states, hyperparams)  # 迭代模型参数
            if (batch_i + 1) * batch_size % 100 == 0:
                ls.append(eval_loss())  # 每100个样本记录下当前训练误差
        # 打印结果
        print('loss: %f, %f sec per epoch' % (ls[-1], time.time() - start))
    # 作图
    set_figsize()
    plt.plot(np.linspace(0, num_epochs, len(ls)), ls)
    plt.xlabel('epoch')
    plt.ylabel('loss')
    plt.show()


def train_sgd(lr, batch_size, num_epochs=2):
    train_ch7(sgd, None, {'lr': lr}, features, labels, batch_size, num_epochs)


# 梯度下降
train_sgd(1, 1500, 6)
# 随机梯度下降
train_sgd(0.005, 1)
# 小批量随机梯度下降
train_sgd(0.05, 10)

```
```Python
Outputs:
(1500, 5)
training:
loss: 0.275878, 0.024464 sec per epoch
loss: 0.250094, 0.025542 sec per epoch
loss: 0.246036, 0.021464 sec per epoch
loss: 0.244822, 0.027595 sec per epoch
loss: 0.244232, 0.029921 sec per epoch
loss: 0.243936, 0.025249 sec per epoch
training:
loss: 0.244941, 1.860000 sec per epoch
loss: 0.243287, 1.673077 sec per epoch
training:
loss: 0.245864, 0.193910 sec per epoch
loss: 0.242682, 0.202676 sec per epoch
```
### 简洁实现
```Python
from mxnet import autograd, gluon, init, nd
from mxnet.gluon import nn, data as gdata, loss as gloss
import numpy as np
import time
import matplotlib.pyplot as plt
from IPython import display


# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def get_data_ch7():
    data = np.genfromtxt('data/airfoil_self_noise.dat', delimiter='\t')
    data = (data - data.mean(axis=0)) / data.std(axis=0)
    return nd.array(data[:1500, :-1]), nd.array(data[:1500, -1])


features, labels = get_data_ch7()
print(features.shape)


def train_gluon_ch7(trainer_name, trainer_hyperparams, features, labels, batch_size=10, num_epochs=2):
    print('training:')
    # 初试话模型
    net = nn.Sequential()
    net.add(nn.Dense(1))
    net.initialize(init.Normal(sigma=0.01))
    loss = gloss.L2Loss()

    def eval_loss():
        return loss(net(features), labels).mean().asscalar()

    ls = [eval_loss()]
    data_iter = gdata.DataLoader(gdata.ArrayDataset(features, labels), batch_size, shuffle=True)
    # 创建Trainer实例来迭代模型参数
    trainer = gluon.Trainer(net.collect_params(), trainer_name, trainer_hyperparams)
    for _ in range(num_epochs):
        start = time.time()
        for batch_i, (X, y) in enumerate(data_iter):
            with autograd.record():
                l = loss(net(X), y)
            l.backward()
            trainer.step(batch_size)
            if (batch_i + 1) * batch_size % 100 == 0:
                ls.append(eval_loss())
        # 打印结果
        print('loss: %f, %f sec per epoch' % (ls[-1], time.time() - start))
    set_figsize()
    plt.plot(np.linspace(0, num_epochs, len(ls)), ls)
    plt.xlabel('epoch')
    plt.ylabel('loss')
    plt.show()


train_gluon_ch7('sgd', {'learning_rate': 1}, features, labels, batch_size=1500, num_epochs=6)
train_gluon_ch7('sgd', {'learning_rate': 0.005}, features, labels, batch_size=1)
train_gluon_ch7('sgd', {'learning_rate': 0.05}, features, labels, batch_size=10)

```
```Python
Outputs:
(1500, 5)
training:
loss: 0.275878, 0.015960 sec per epoch
loss: 0.250094, 0.020942 sec per epoch
loss: 0.246036, 0.013962 sec per epoch
loss: 0.244822, 0.020944 sec per epoch
loss: 0.244232, 0.038895 sec per epoch
loss: 0.243936, 0.015959 sec per epoch
training:
loss: 0.246803, 1.659488 sec per epoch
loss: 0.243377, 1.377568 sec per epoch
training:
loss: 0.245642, 0.209440 sec per epoch
loss: 0.242616, 0.177525 sec per epoch
```
## 动量法
### 梯度下降的问题
```Python
from mxnet import nd
from matplotlib import pyplot as plt
import numpy as np


def train_2d(trainer):
    print('training:')
    x1, x2, s1, s2 = -5, -2, 0, 0
    results = [(x1, x2)]
    for i in range(20):
        x1, x2, s1, s2 = trainer(x1, x2, s1, s2)
        results.append((x1, x2))
        print('epoch %2d, x1 %f, x2 %f' % (i + 1, x1, x2))
    return results


def show_trace_2d(f, results):
    # print(*results)
    # print(*zip(*results))
    plt.plot(*zip(*results), '-o', color='#ff7f02')
    x1, x2 = np.meshgrid(np.arange(-5.5, 1.0, 0.1), np.arange(-3.0, 2.0, 0.1))
    plt.contour(x1, x2, f(x1, x2), colors='#1f77b4')
    plt.xlabel('x1')
    plt.ylabel('x2')
    plt.show()


def f_2d(x1, x2):
    return 0.1 * x1 ** 2 + 2 * x2 ** 2


def gd_2d(x1, x2, s1, s2):
    return x1 - eta * 0.2 * x1, x2 - eta * 4 * x2, 0, 0


# 学习率小水平方向上朝最优解移动变慢
eta = 0.2
show_trace_2d(f_2d, train_2d(gd_2d))
# 学习率适当，垂直方各项斜率绝对值更大，垂直方向比水平方向移动幅度更大
eta = 0.4
show_trace_2d(f_2d, train_2d(gd_2d))
# 学习率过大，垂直方向不断越过最优解并逐渐发散
eta = 0.6
show_trace_2d(f_2d, train_2d(gd_2d))

```
```Python
Outputs:
training:
epoch  1, x1 -4.800000, x2 -0.400000
epoch  2, x1 -4.608000, x2 -0.080000
epoch  3, x1 -4.423680, x2 -0.016000
epoch  4, x1 -4.246733, x2 -0.003200
epoch  5, x1 -4.076863, x2 -0.000640
epoch  6, x1 -3.913789, x2 -0.000128
epoch  7, x1 -3.757237, x2 -0.000026
epoch  8, x1 -3.606948, x2 -0.000005
epoch  9, x1 -3.462670, x2 -0.000001
epoch 10, x1 -3.324163, x2 -0.000000
epoch 11, x1 -3.191197, x2 -0.000000
epoch 12, x1 -3.063549, x2 -0.000000
epoch 13, x1 -2.941007, x2 -0.000000
epoch 14, x1 -2.823367, x2 -0.000000
epoch 15, x1 -2.710432, x2 -0.000000
epoch 16, x1 -2.602015, x2 -0.000000
epoch 17, x1 -2.497934, x2 -0.000000
epoch 18, x1 -2.398017, x2 -0.000000
epoch 19, x1 -2.302096, x2 -0.000000
epoch 20, x1 -2.210012, x2 -0.000000
training:
epoch  1, x1 -4.600000, x2 1.200000
epoch  2, x1 -4.232000, x2 -0.720000
epoch  3, x1 -3.893440, x2 0.432000
epoch  4, x1 -3.581965, x2 -0.259200
epoch  5, x1 -3.295408, x2 0.155520
epoch  6, x1 -3.031775, x2 -0.093312
epoch  7, x1 -2.789233, x2 0.055987
epoch  8, x1 -2.566094, x2 -0.033592
epoch  9, x1 -2.360807, x2 0.020155
epoch 10, x1 -2.171942, x2 -0.012093
epoch 11, x1 -1.998187, x2 0.007256
epoch 12, x1 -1.838332, x2 -0.004354
epoch 13, x1 -1.691265, x2 0.002612
epoch 14, x1 -1.555964, x2 -0.001567
epoch 15, x1 -1.431487, x2 0.000940
epoch 16, x1 -1.316968, x2 -0.000564
epoch 17, x1 -1.211611, x2 0.000339
epoch 18, x1 -1.114682, x2 -0.000203
epoch 19, x1 -1.025507, x2 0.000122
epoch 20, x1 -0.943467, x2 -0.000073
training:
epoch  1, x1 -4.400000, x2 2.800000
epoch  2, x1 -3.872000, x2 -3.920000
epoch  3, x1 -3.407360, x2 5.488000
epoch  4, x1 -2.998477, x2 -7.683200
epoch  5, x1 -2.638660, x2 10.756480
epoch  6, x1 -2.322020, x2 -15.059072
epoch  7, x1 -2.043378, x2 21.082701
epoch  8, x1 -1.798173, x2 -29.515781
epoch  9, x1 -1.582392, x2 41.322094
epoch 10, x1 -1.392505, x2 -57.850931
epoch 11, x1 -1.225404, x2 80.991303
epoch 12, x1 -1.078356, x2 -113.387825
epoch 13, x1 -0.948953, x2 158.742955
epoch 14, x1 -0.835079, x2 -222.240137
epoch 15, x1 -0.734869, x2 311.136191
epoch 16, x1 -0.646685, x2 -435.590668
epoch 17, x1 -0.569083, x2 609.826935
epoch 18, x1 -0.500793, x2 -853.757708
epoch 19, x1 -0.440698, x2 1195.260792
epoch 20, x1 -0.387814, x2 -1673.365109
```
### 测试
```Python
from mxnet import nd
from matplotlib import pyplot as plt
import numpy as np


def train_2d(trainer):
    print('training:')
    x1, x2, s1, s2 = -5, -2, 0, 0
    results = [(x1, x2)]
    for i in range(20):
        x1, x2, s1, s2 = trainer(x1, x2, s1, s2)
        results.append((x1, x2))
        print('epoch %2d, x1 %f, x2 %f' % (i + 1, x1, x2))
    return results


def show_trace_2d(f, results):
    # print(*results)
    # print(*zip(*results))
    plt.plot(*zip(*results), '-o', color='#ff7f02')
    x1, x2 = np.meshgrid(np.arange(-5.5, 1.0, 0.1), np.arange(-3.0, 2.0, 0.1))
    plt.contour(x1, x2, f(x1, x2), colors='#1f77b4')
    plt.xlabel('x1')
    plt.ylabel('x2')
    plt.show()


def f_2d(x1, x2):
    return 0.1 * x1 ** 2 + 2 * x2 ** 2


def momentum_2d(x1, x2, v1, v2):
    v1 = gamma * v1 + eta * 0.2 * x1
    v2 = gamma * v2 + eta * 4 * x2
    return x1 - v1, x2 - v2, v1, v2


# 垂直方向移动更平滑，水平方向上更快逼近最优解
eta, gamma = 0.4, 0.5
show_trace_2d(f_2d, train_2d(momentum_2d))
# 不再发散
eta = 0.6
show_trace_2d(f_2d, train_2d(momentum_2d))

```
```Python
training:
epoch  1, x1 -4.600000, x2 1.200000
epoch  2, x1 -4.032000, x2 0.880000
epoch  3, x1 -3.425440, x2 -0.688000
epoch  4, x1 -2.848125, x2 -0.371200
epoch  5, x1 -2.331617, x2 0.381120
epoch  6, x1 -1.886834, x2 0.147488
epoch  7, x1 -1.513496, x2 -0.205309
epoch  8, x1 -1.205747, x2 -0.053213
epoch  9, x1 -0.955413, x2 0.107976
epoch 10, x1 -0.753813, x2 0.015809
epoch 11, x1 -0.592708, x2 -0.055569
epoch 12, x1 -0.464738, x2 -0.002348
epoch 13, x1 -0.363575, x2 0.028019
epoch 14, x1 -0.283907, x2 -0.001628
epoch 15, x1 -0.221361, x2 -0.013847
epoch 16, x1 -0.172378, x2 0.002199
epoch 17, x1 -0.134097, x2 0.006704
epoch 18, x1 -0.104229, x2 -0.001770
epoch 19, x1 -0.080956, x2 -0.003175
epoch 20, x1 -0.062843, x2 0.001202
training:
epoch  1, x1 -4.400000, x2 2.800000
epoch  2, x1 -3.572000, x2 -1.520000
epoch  3, x1 -2.729360, x2 -0.032000
epoch  4, x1 -1.980517, x2 0.788800
epoch  5, x1 -1.368433, x2 -0.693920
epoch  6, x1 -0.898179, x2 0.230128
epoch  7, x1 -0.555271, x2 0.139845
epoch  8, x1 -0.317184, x2 -0.240924
epoch  9, x1 -0.160079, x2 0.146909
epoch 10, x1 -0.062317, x2 -0.011756
epoch 11, x1 -0.005957, x2 -0.062874
epoch 12, x1 0.022937, x2 0.062465
epoch 13, x1 0.034632, x2 -0.024781
epoch 14, x1 0.036323, x2 -0.008929
epoch 15, x1 0.032810, x2 0.020427
epoch 16, x1 0.027117, x2 -0.013920
epoch 17, x1 0.021016, x2 0.002314
epoch 18, x1 0.015443, x2 0.004877
epoch 19, x1 0.010804, x2 -0.005546
epoch 20, x1 0.007188, x2 0.002553
```
### 线性回归原生实现（动量法）
```Python
from mxnet import nd, autograd
from matplotlib import pyplot as plt
from IPython import display
import numpy as np
from mxnet.gluon import loss as gloss, data as gdata
import time


# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def get_data_ch7():
    data = np.genfromtxt('data/airfoil_self_noise.dat', delimiter='\t')
    data = (data - data.mean(axis=0)) / data.std(axis=0)
    return nd.array(data[:1500, :-1]), nd.array(data[:1500, -1])


# 定义模型
# Define model
def linreg(x, w, b):
    result = nd.dot(x, w) + b
    # print("net:", result)
    return result


# 定义损失函数
# Define square loss function
def sqaured_loss(y_hat, y):
    result = (y_hat - y.reshape(y_hat.shape)) ** 2 / 2
    # print("loss:", result)
    return result


def init_momentum_states():
    v_w = nd.zeros((features.shape[1], 1))
    v_b = nd.zeros(1)
    return v_w, v_b


def sgd_momentum(params, states, hyperparams):
    for p, v in zip(params, states):
        v[:] = hyperparams['momentum'] * v + hyperparams['lr'] * p.grad
        p[:] -= v


def train_ch7(trainer_fn, states, hyperparams, features, labels, batch_size=10, num_epochs=2):
    print('training:')
    # 初始化模型
    net, loss = linreg, sqaured_loss
    w = nd.random.normal(scale=0.01, shape=(features.shape[1], 1))
    b = nd.zeros(1)
    w.attach_grad()
    b.attach_grad()

    def eval_loss():
        return loss(net(features, w, b), labels).mean().asscalar()

    ls = [eval_loss()]
    data_iter = gdata.DataLoader(gdata.ArrayDataset(features, labels), batch_size, shuffle=True)
    for _ in range(num_epochs):
        start = time.time()
        for batch_i, (X, y) in enumerate(data_iter):
            # print(batch_i)
            with autograd.record():
                l = loss(net(X, w, b), y).mean()  # 使用平均损失
            l.backward()
            trainer_fn([w, b], states, hyperparams)  # 迭代模型参数
            if (batch_i + 1) * batch_size % 100 == 0:
                ls.append(eval_loss())  # 每100个样本记录下当前训练误差
        # 打印结果
        print('loss: %f, %f sec per epoch' % (ls[-1], time.time() - start))
    # 作图
    set_figsize()
    plt.plot(np.linspace(0, num_epochs, len(ls)), ls)
    plt.xlabel('epoch')
    plt.ylabel('loss')
    plt.show()


features, labels = get_data_ch7()
train_ch7(sgd_momentum, init_momentum_states(), {'lr': 0.02, 'momentum': 0.5}, features, labels)
train_ch7(sgd_momentum, init_momentum_states(), {'lr': 0.02, 'momentum': 0.9}, features, labels)

```
```Python
training:
loss: 0.245023, 0.223418 sec per epoch
loss: 0.243064, 0.228896 sec per epoch
training:
loss: 0.269220, 0.204453 sec per epoch
loss: 0.243238, 0.201461 sec per epoch
training:
loss: 0.263835, 0.227166 sec per epoch
loss: 0.275400, 0.179520 sec per epoch
```
### 线性回归简洁实现（动量法）
```Python
from mxnet import nd, autograd, init, gluon
from matplotlib import pyplot as plt
from IPython import display
import numpy as np
from mxnet.gluon import loss as gloss, data as gdata, nn
import time


# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def get_data_ch7():
    data = np.genfromtxt('data/airfoil_self_noise.dat', delimiter='\t')
    data = (data - data.mean(axis=0)) / data.std(axis=0)
    return nd.array(data[:1500, :-1]), nd.array(data[:1500, -1])


def train_gluon_ch7(trainer_name, trainer_hyperparams, features, labels, batch_size=10, num_epochs=2):
    print('training:')
    # 初试化模型
    net = nn.Sequential()
    net.add(nn.Dense(1))
    net.initialize(init.Normal(sigma=0.01))
    loss = gloss.L2Loss()

    def eval_loss():
        return loss(net(features), labels).mean().asscalar()

    ls = [eval_loss()]
    data_iter = gdata.DataLoader(gdata.ArrayDataset(features, labels), batch_size, shuffle=True)
    # 创建Trainer实例来迭代模型参数
    trainer = gluon.Trainer(net.collect_params(), trainer_name, trainer_hyperparams)
    for _ in range(num_epochs):
        start = time.time()
        for batch_i, (X, y) in enumerate(data_iter):
            with autograd.record():
                l = loss(net(X), y)
            l.backward()
            trainer.step(batch_size)
            if (batch_i + 1) * batch_size % 100 == 0:
                ls.append(eval_loss())
        # 打印结果
        print('loss: %f, %f sec per epoch' % (ls[-1], time.time() - start))
    set_figsize()
    plt.plot(np.linspace(0, num_epochs, len(ls)), ls)
    plt.xlabel('epoch')
    plt.ylabel('loss')
    plt.show()


features, labels = get_data_ch7()
train_gluon_ch7('sgd', {'learning_rate': 0.02, 'momentum': 0.5}, features, labels)
train_gluon_ch7('sgd', {'learning_rate': 0.02, 'momentum': 0.9}, features, labels)
train_gluon_ch7('sgd', {'learning_rate': 0.004, 'momentum': 0.9}, features, labels)

```
```Python
training:
loss: 0.248209, 0.151595 sec per epoch
loss: 0.245408, 0.213429 sec per epoch
training:
loss: 0.249528, 0.200464 sec per epoch
loss: 0.254631, 0.190489 sec per epoch
training:
loss: 0.243106, 0.215929 sec per epoch
loss: 0.246549, 0.198470 sec per epoch
```
## Adagrad算法
### 测试
```Python
from mxnet import nd
from matplotlib import pyplot as plt
import numpy as np
import math


def train_2d(trainer):
    print('training:')
    x1, x2, s1, s2 = -5, -2, 0, 0
    results = [(x1, x2)]
    for i in range(20):
        x1, x2, s1, s2 = trainer(x1, x2, s1, s2)
        results.append((x1, x2))
        print('epoch %2d, x1 %f, x2 %f' % (i + 1, x1, x2))
    return results


def show_trace_2d(f, results):
    # print(*results)
    # print(*zip(*results))
    plt.plot(*zip(*results), '-o', color='#ff7f02')
    x1, x2 = np.meshgrid(np.arange(-5.5, 1.0, 0.1), np.arange(-3.0, 2.0, 0.1))
    plt.contour(x1, x2, f(x1, x2), colors='#1f77b4')
    plt.xlabel('x1')
    plt.ylabel('x2')
    plt.show()


def f_2d(x1, x2):
    return 0.1 * x1 ** 2 + 2 * x2 ** 2


def adagrad_2d(x1, x2, s1, s2):
    g1, g2, eps = 0.2 * x1, 4 * x2, 1e-6
    s1 += g1 ** 2
    s2 += g2 ** 2
    x1 -= eta / math.sqrt(s1 + eps) * g1
    x2 -= eta / math.sqrt(s2 + eps) * g2
    return x1, x2, s1, s2


eta = 0.4
show_trace_2d(f_2d, train_2d(adagrad_2d))

eta = 2
show_trace_2d(f_2d, train_2d(adagrad_2d))

```
```Python
training:
epoch  1, x1 -4.600000, x2 -1.600000
epoch  2, x1 -4.329178, x2 -1.350122
epoch  3, x1 -4.114228, x2 -1.163597
epoch  4, x1 -3.932302, x2 -1.014436
epoch  5, x1 -3.772835, x2 -0.890767
epoch  6, x1 -3.629933, x2 -0.785968
epoch  7, x1 -3.499909, x2 -0.695875
epoch  8, x1 -3.380281, x2 -0.617648
epoch  9, x1 -3.269280, x2 -0.549239
epoch 10, x1 -3.165593, x2 -0.489098
epoch 11, x1 -3.068216, x2 -0.436016
epoch 12, x1 -2.976356, x2 -0.389023
epoch 13, x1 -2.889378, x2 -0.347323
epoch 14, x1 -2.806763, x2 -0.310253
epoch 15, x1 -2.728078, x2 -0.277253
epoch 16, x1 -2.652960, x2 -0.247842
epoch 17, x1 -2.581099, x2 -0.221608
epoch 18, x1 -2.512228, x2 -0.198191
epoch 19, x1 -2.446117, x2 -0.177277
epoch 20, x1 -2.382563, x2 -0.158591
training:
epoch  1, x1 -3.000001, x2 -0.000000
epoch  2, x1 -1.971010, x2 -0.000000
epoch  3, x1 -1.330559, x2 -0.000000
epoch  4, x1 -0.907975, x2 -0.000000
epoch  5, x1 -0.622554, x2 -0.000000
epoch  6, x1 -0.427785, x2 -0.000000
epoch  7, x1 -0.294250, x2 -0.000000
epoch  8, x1 -0.202494, x2 -0.000000
epoch  9, x1 -0.139383, x2 -0.000000
epoch 10, x1 -0.095951, x2 -0.000000
epoch 11, x1 -0.066056, x2 -0.000000
epoch 12, x1 -0.045477, x2 -0.000000
epoch 13, x1 -0.031309, x2 -0.000000
epoch 14, x1 -0.021555, x2 -0.000000
epoch 15, x1 -0.014840, x2 -0.000000
epoch 16, x1 -0.010217, x2 -0.000000
epoch 17, x1 -0.007034, x2 -0.000000
epoch 18, x1 -0.004843, x2 -0.000000
epoch 19, x1 -0.003334, x2 -0.000000
epoch 20, x1 -0.002295, x2 -0.000000
```
### 线性回归原生实现（Adagrad算法）
```Python
from mxnet import nd, autograd
from matplotlib import pyplot as plt
from IPython import display
import numpy as np
from mxnet.gluon import loss as gloss, data as gdata
import time


# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def get_data_ch7():
    data = np.genfromtxt('data/airfoil_self_noise.dat', delimiter='\t')
    data = (data - data.mean(axis=0)) / data.std(axis=0)
    return nd.array(data[:1500, :-1]), nd.array(data[:1500, -1])


# 定义模型
# Define model
def linreg(x, w, b):
    result = nd.dot(x, w) + b
    # print("net:", result)
    return result


# 定义损失函数
# Define square loss function
def sqaured_loss(y_hat, y):
    result = (y_hat - y.reshape(y_hat.shape)) ** 2 / 2
    # print("loss:", result)
    return result


def init_momentum_states():
    s_w = nd.zeros((features.shape[1], 1))
    s_b = nd.zeros(1)
    return s_w, s_b


def adagrad(params, states, hyperparams):
    eps = 1e-6
    for p, s in zip(params, states):
        s[:] += p.grad.square()
        p[:] -= hyperparams['lr'] * p.grad / (s + eps).sqrt()


def train_ch7(trainer_fn, states, hyperparams, features, labels, batch_size=10, num_epochs=2):
    print('training:')
    # 初始化模型
    net, loss = linreg, sqaured_loss
    w = nd.random.normal(scale=0.01, shape=(features.shape[1], 1))
    b = nd.zeros(1)
    w.attach_grad()
    b.attach_grad()

    def eval_loss():
        return loss(net(features, w, b), labels).mean().asscalar()

    ls = [eval_loss()]
    data_iter = gdata.DataLoader(gdata.ArrayDataset(features, labels), batch_size, shuffle=True)
    for _ in range(num_epochs):
        start = time.time()
        for batch_i, (X, y) in enumerate(data_iter):
            # print(batch_i)
            with autograd.record():
                l = loss(net(X, w, b), y).mean()  # 使用平均损失
            l.backward()
            trainer_fn([w, b], states, hyperparams)  # 迭代模型参数
            if (batch_i + 1) * batch_size % 100 == 0:
                ls.append(eval_loss())  # 每100个样本记录下当前训练误差
        # 打印结果
        print('loss: %f, %f sec per epoch' % (ls[-1], time.time() - start))
    # 作图
    set_figsize()
    plt.plot(np.linspace(0, num_epochs, len(ls)), ls)
    plt.xlabel('epoch')
    plt.ylabel('loss')
    plt.show()


features, labels = get_data_ch7()
train_ch7(adagrad, init_momentum_states(), {'lr': 0.1}, features, labels)

```
```Python
training:
loss: 0.242857, 0.283241 sec per epoch
loss: 0.242897, 0.194543 sec per epoch
```
### 线性回归简洁实现（Adagrad算法）
```Python
from mxnet import nd, autograd, init, gluon
from matplotlib import pyplot as plt
from IPython import display
import numpy as np
from mxnet.gluon import loss as gloss, data as gdata, nn
import time


# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def get_data_ch7():
    data = np.genfromtxt('data/airfoil_self_noise.dat', delimiter='\t')
    data = (data - data.mean(axis=0)) / data.std(axis=0)
    return nd.array(data[:1500, :-1]), nd.array(data[:1500, -1])


def train_gluon_ch7(trainer_name, trainer_hyperparams, features, labels, batch_size=10, num_epochs=2):
    print('training:')
    # 初试化模型
    net = nn.Sequential()
    net.add(nn.Dense(1))
    net.initialize(init.Normal(sigma=0.01))
    loss = gloss.L2Loss()

    def eval_loss():
        return loss(net(features), labels).mean().asscalar()

    ls = [eval_loss()]
    data_iter = gdata.DataLoader(gdata.ArrayDataset(features, labels), batch_size, shuffle=True)
    # 创建Trainer实例来迭代模型参数
    trainer = gluon.Trainer(net.collect_params(), trainer_name, trainer_hyperparams)
    for _ in range(num_epochs):
        start = time.time()
        for batch_i, (X, y) in enumerate(data_iter):
            with autograd.record():
                l = loss(net(X), y)
            l.backward()
            trainer.step(batch_size)
            if (batch_i + 1) * batch_size % 100 == 0:
                ls.append(eval_loss())
        # 打印结果
        print('loss: %f, %f sec per epoch' % (ls[-1], time.time() - start))
    set_figsize()
    plt.plot(np.linspace(0, num_epochs, len(ls)), ls)
    plt.xlabel('epoch')
    plt.ylabel('loss')
    plt.show()


features, labels = get_data_ch7()
train_gluon_ch7('adagrad', {'learning_rate': 0.1}, features, labels)

```
```Python
training:
loss: 0.243328, 0.281150 sec per epoch
loss: 0.242081, 0.296806 sec per epoch
```
## RMSProp算法
### 测试
```Python
from mxnet import nd
from matplotlib import pyplot as plt
import numpy as np
import math


def train_2d(trainer):
    print('training:')
    x1, x2, s1, s2 = -5, -2, 0, 0
    results = [(x1, x2)]
    for i in range(20):
        x1, x2, s1, s2 = trainer(x1, x2, s1, s2)
        results.append((x1, x2))
        print('epoch %2d, x1 %f, x2 %f' % (i + 1, x1, x2))
    return results


def show_trace_2d(f, results):
    # print(*results)
    # print(*zip(*results))
    plt.plot(*zip(*results), '-o', color='#ff7f02')
    x1, x2 = np.meshgrid(np.arange(-5.5, 1.0, 0.1), np.arange(-3.0, 2.0, 0.1))
    plt.contour(x1, x2, f(x1, x2), colors='#1f77b4')
    plt.xlabel('x1')
    plt.ylabel('x2')
    plt.show()


def f_2d(x1, x2):
    return 0.1 * x1 ** 2 + 2 * x2 ** 2


def rmsprop_2d(x1, x2, s1, s2):
    g1, g2, eps = 0.2 * x1, 4 * x2, 1e-6
    s1 = gamma * s1 + (1 - gamma) * g1 ** 2
    s2 = gamma * s2 + (1 - gamma) * g2 ** 2
    x1 -= eta / math.sqrt(s1 + eps) * g1
    x2 -= eta / math.sqrt(s2 + eps) * g2
    return x1, x2, s1, s2


eta, gamma = 0.4, 0.9
show_trace_2d(f_2d, train_2d(rmsprop_2d))

```
```Python
training:
epoch  1, x1 -3.735095, x2 -0.735089
epoch  2, x1 -2.952557, x2 -0.278126
epoch  3, x1 -2.372981, x2 -0.097741
epoch  4, x1 -1.915252, x2 -0.031013
epoch  5, x1 -1.543071, x2 -0.008699
epoch  6, x1 -1.236422, x2 -0.002101
epoch  7, x1 -0.982686, x2 -0.000421
epoch  8, x1 -0.773052, x2 -0.000066
epoch  9, x1 -0.600837, x2 -0.000007
epoch 10, x1 -0.460616, x2 -0.000000
epoch 11, x1 -0.347757, x2 -0.000000
epoch 12, x1 -0.258167, x2 0.000000
epoch 13, x1 -0.188167, x2 -0.000000
epoch 14, x1 -0.134436, x2 0.000000
epoch 15, x1 -0.093992, x2 -0.000000
epoch 16, x1 -0.064194, x2 0.000000
epoch 17, x1 -0.042745, x2 -0.000000
epoch 18, x1 -0.027691, x2 0.000000
epoch 19, x1 -0.017412, x2 -0.000000
epoch 20, x1 -0.010599, x2 0.000000
```
### 线性回归原生实现（RMSProp算法）
```Python
from mxnet import nd, autograd
from matplotlib import pyplot as plt
from IPython import display
import numpy as np
from mxnet.gluon import loss as gloss, data as gdata
import time


# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def get_data_ch7():
    data = np.genfromtxt('data/airfoil_self_noise.dat', delimiter='\t')
    data = (data - data.mean(axis=0)) / data.std(axis=0)
    return nd.array(data[:1500, :-1]), nd.array(data[:1500, -1])


# 定义模型
# Define model
def linreg(x, w, b):
    result = nd.dot(x, w) + b
    # print("net:", result)
    return result


# 定义损失函数
# Define square loss function
def sqaured_loss(y_hat, y):
    result = (y_hat - y.reshape(y_hat.shape)) ** 2 / 2
    # print("loss:", result)
    return result


def init_momentum_states():
    s_w = nd.zeros((features.shape[1], 1))
    s_b = nd.zeros(1)
    return s_w, s_b


def rmsprop(params, states, hyperparams):
    gamma, eps = hyperparams['gamma'], 1e-6
    for p, s in zip(params, states):
        s[:] = gamma * s + (1 - gamma) * p.grad.square()
        p[:] -= hyperparams['lr'] * p.grad / (s + eps).sqrt()


def train_ch7(trainer_fn, states, hyperparams, features, labels, batch_size=10, num_epochs=2):
    print('training:')
    # 初始化模型
    net, loss = linreg, sqaured_loss
    w = nd.random.normal(scale=0.01, shape=(features.shape[1], 1))
    b = nd.zeros(1)
    w.attach_grad()
    b.attach_grad()

    def eval_loss():
        return loss(net(features, w, b), labels).mean().asscalar()

    ls = [eval_loss()]
    data_iter = gdata.DataLoader(gdata.ArrayDataset(features, labels), batch_size, shuffle=True)
    for _ in range(num_epochs):
        start = time.time()
        for batch_i, (X, y) in enumerate(data_iter):
            # print(batch_i)
            with autograd.record():
                l = loss(net(X, w, b), y).mean()  # 使用平均损失
            l.backward()
            trainer_fn([w, b], states, hyperparams)  # 迭代模型参数
            if (batch_i + 1) * batch_size % 100 == 0:
                ls.append(eval_loss())  # 每100个样本记录下当前训练误差
        # 打印结果
        print('loss: %f, %f sec per epoch' % (ls[-1], time.time() - start))
    # 作图
    set_figsize()
    plt.plot(np.linspace(0, num_epochs, len(ls)), ls)
    plt.xlabel('epoch')
    plt.ylabel('loss')
    plt.show()


features, labels = get_data_ch7()
train_ch7(rmsprop, init_momentum_states(), {'lr': 0.01, 'gamma': 0.9}, features, labels)

```
```Python
training:
loss: 0.246346, 0.266003 sec per epoch
loss: 0.244812, 0.246020 sec per epoch
```
### 线性回归简洁实现（RMSProp算法）
```Python
from mxnet import nd, autograd, init, gluon
from matplotlib import pyplot as plt
from IPython import display
import numpy as np
from mxnet.gluon import loss as gloss, data as gdata, nn
import time


# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def get_data_ch7():
    data = np.genfromtxt('data/airfoil_self_noise.dat', delimiter='\t')
    data = (data - data.mean(axis=0)) / data.std(axis=0)
    return nd.array(data[:1500, :-1]), nd.array(data[:1500, -1])


def train_gluon_ch7(trainer_name, trainer_hyperparams, features, labels, batch_size=10, num_epochs=2):
    print('training:')
    # 初试化模型
    net = nn.Sequential()
    net.add(nn.Dense(1))
    net.initialize(init.Normal(sigma=0.01))
    loss = gloss.L2Loss()

    def eval_loss():
        return loss(net(features), labels).mean().asscalar()

    ls = [eval_loss()]
    data_iter = gdata.DataLoader(gdata.ArrayDataset(features, labels), batch_size, shuffle=True)
    # 创建Trainer实例来迭代模型参数
    trainer = gluon.Trainer(net.collect_params(), trainer_name, trainer_hyperparams)
    for _ in range(num_epochs):
        start = time.time()
        for batch_i, (X, y) in enumerate(data_iter):
            with autograd.record():
                l = loss(net(X), y)
            l.backward()
            trainer.step(batch_size)
            if (batch_i + 1) * batch_size % 100 == 0:
                ls.append(eval_loss())
        # 打印结果
        print('loss: %f, %f sec per epoch' % (ls[-1], time.time() - start))
    set_figsize()
    plt.plot(np.linspace(0, num_epochs, len(ls)), ls)
    plt.xlabel('epoch')
    plt.ylabel('loss')
    plt.show()


features, labels = get_data_ch7()
train_gluon_ch7('rmsprop', {'learning_rate': 0.01, 'gamma1': 0.9}, features, labels)

```
```Python
training:
loss: 0.244800, 0.218663 sec per epoch
loss: 0.249446, 0.205859 sec per epoch
```
## AdaDelta算法
### 线性回归原生实现（AdaDelta算法）
```Python
from mxnet import nd, autograd
from matplotlib import pyplot as plt
from IPython import display
import numpy as np
from mxnet.gluon import loss as gloss, data as gdata
import time


# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def get_data_ch7():
    data = np.genfromtxt('data/airfoil_self_noise.dat', delimiter='\t')
    data = (data - data.mean(axis=0)) / data.std(axis=0)
    return nd.array(data[:1500, :-1]), nd.array(data[:1500, -1])


# 定义模型
# Define model
def linreg(x, w, b):
    result = nd.dot(x, w) + b
    # print("net:", result)
    return result


# 定义损失函数
# Define square loss function
def sqaured_loss(y_hat, y):
    result = (y_hat - y.reshape(y_hat.shape)) ** 2 / 2
    # print("loss:", result)
    return result


def init_adadelta_states():
    s_w, s_b = nd.zeros((features.shape[1], 1)), nd.zeros(1)
    delta_w, delta_b = nd.zeros((features.shape[1], 1)), nd.zeros(1)
    return (s_w, delta_w), (s_b, delta_b)


def adadelta(params, states, hyperparams):
    rho, eps = hyperparams['rho'], 1e-5
    for p, (s, delta) in zip(params, states):
        s[:] = rho * s + (1 - rho) * p.grad.square()
        g = ((delta + eps).sqrt() / (s + eps).sqrt()) * p.grad
        p[:] -= g
        delta[:] = rho * delta + (1 - rho) * g * g


def train_ch7(trainer_fn, states, hyperparams, features, labels, batch_size=10, num_epochs=2):
    print('training:')
    # 初始化模型
    net, loss = linreg, sqaured_loss
    w = nd.random.normal(scale=0.01, shape=(features.shape[1], 1))
    b = nd.zeros(1)
    w.attach_grad()
    b.attach_grad()

    def eval_loss():
        return loss(net(features, w, b), labels).mean().asscalar()

    ls = [eval_loss()]
    data_iter = gdata.DataLoader(gdata.ArrayDataset(features, labels), batch_size, shuffle=True)
    for _ in range(num_epochs):
        start = time.time()
        for batch_i, (X, y) in enumerate(data_iter):
            # print(batch_i)
            with autograd.record():
                l = loss(net(X, w, b), y).mean()  # 使用平均损失
            l.backward()
            trainer_fn([w, b], states, hyperparams)  # 迭代模型参数
            if (batch_i + 1) * batch_size % 100 == 0:
                ls.append(eval_loss())  # 每100个样本记录下当前训练误差
        # 打印结果
        print('loss: %f, %f sec per epoch' % (ls[-1], time.time() - start))
    # 作图
    set_figsize()
    plt.plot(np.linspace(0, num_epochs, len(ls)), ls)
    plt.xlabel('epoch')
    plt.ylabel('loss')
    plt.show()


features, labels = get_data_ch7()
train_ch7(adadelta, init_adadelta_states(), {'rho': 0.9}, features, labels)

```
```Python
training:
loss: 0.247489, 0.398763 sec per epoch
loss: 0.243337, 0.363029 sec per epoch
```
### 线性回归简洁实现（AdaDelta算法）
```Python
from mxnet import nd, autograd, init, gluon
from matplotlib import pyplot as plt
from IPython import display
import numpy as np
from mxnet.gluon import loss as gloss, data as gdata, nn
import time


# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def get_data_ch7():
    data = np.genfromtxt('data/airfoil_self_noise.dat', delimiter='\t')
    data = (data - data.mean(axis=0)) / data.std(axis=0)
    return nd.array(data[:1500, :-1]), nd.array(data[:1500, -1])


def train_gluon_ch7(trainer_name, trainer_hyperparams, features, labels, batch_size=10, num_epochs=2):
    print('training:')
    # 初试化模型
    net = nn.Sequential()
    net.add(nn.Dense(1))
    net.initialize(init.Normal(sigma=0.01))
    loss = gloss.L2Loss()

    def eval_loss():
        return loss(net(features), labels).mean().asscalar()

    ls = [eval_loss()]
    data_iter = gdata.DataLoader(gdata.ArrayDataset(features, labels), batch_size, shuffle=True)
    # 创建Trainer实例来迭代模型参数
    trainer = gluon.Trainer(net.collect_params(), trainer_name, trainer_hyperparams)
    for _ in range(num_epochs):
        start = time.time()
        for batch_i, (X, y) in enumerate(data_iter):
            with autograd.record():
                l = loss(net(X), y)
            l.backward()
            trainer.step(batch_size)
            if (batch_i + 1) * batch_size % 100 == 0:
                ls.append(eval_loss())
        # 打印结果
        print('loss: %f, %f sec per epoch' % (ls[-1], time.time() - start))
    set_figsize()
    plt.plot(np.linspace(0, num_epochs, len(ls)), ls)
    plt.xlabel('epoch')
    plt.ylabel('loss')
    plt.show()


features, labels = get_data_ch7()
train_gluon_ch7('adadelta', {'rho': 0.9}, features, labels)

```
```Python
training:
loss: 0.245809, 0.372921 sec per epoch
loss: 0.243993, 0.359324 sec per epoch
```
## Adam算法
### 线性回归原生实现（Adam算法）
```Python
from mxnet import nd, autograd
from matplotlib import pyplot as plt
from IPython import display
import numpy as np
from mxnet.gluon import loss as gloss, data as gdata
import time


# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def get_data_ch7():
    data = np.genfromtxt('data/airfoil_self_noise.dat', delimiter='\t')
    data = (data - data.mean(axis=0)) / data.std(axis=0)
    return nd.array(data[:1500, :-1]), nd.array(data[:1500, -1])


# 定义模型
# Define model
def linreg(x, w, b):
    result = nd.dot(x, w) + b
    # print("net:", result)
    return result


# 定义损失函数
# Define square loss function
def sqaured_loss(y_hat, y):
    result = (y_hat - y.reshape(y_hat.shape)) ** 2 / 2
    # print("loss:", result)
    return result


def init_adam_states():
    v_w, v_b = nd.zeros((features.shape[1], 1)), nd.zeros(1)
    s_w, s_b = nd.zeros((features.shape[1], 1)), nd.zeros(1)
    return (v_w, s_w), (v_b, s_b)


def adam(params, states, hyperparams):
    beta1, beta2, eps = 0.9, 0.999, 1e-6
    for p, (v, s) in zip(params, states):
        v[:] = beta1 * v + (1 - beta1) * p.grad
        s[:] = beta2 * s + (1 - beta2) * p.grad.square()
        v_bias_corr = v / (1 - beta1 ** hyperparams['t'])
        s_bias_corr = s / (1 - beta2 ** hyperparams['t'])
        p[:] -= hyperparams['lr'] * v_bias_corr / (s_bias_corr.sqrt() + eps)
    hyperparams['t'] += 1


def train_ch7(trainer_fn, states, hyperparams, features, labels, batch_size=10, num_epochs=2):
    print('training:')
    # 初始化模型
    net, loss = linreg, sqaured_loss
    w = nd.random.normal(scale=0.01, shape=(features.shape[1], 1))
    b = nd.zeros(1)
    w.attach_grad()
    b.attach_grad()

    def eval_loss():
        return loss(net(features, w, b), labels).mean().asscalar()

    ls = [eval_loss()]
    data_iter = gdata.DataLoader(gdata.ArrayDataset(features, labels), batch_size, shuffle=True)
    for _ in range(num_epochs):
        start = time.time()
        for batch_i, (X, y) in enumerate(data_iter):
            # print(batch_i)
            with autograd.record():
                l = loss(net(X, w, b), y).mean()  # 使用平均损失
            l.backward()
            trainer_fn([w, b], states, hyperparams)  # 迭代模型参数
            if (batch_i + 1) * batch_size % 100 == 0:
                ls.append(eval_loss())  # 每100个样本记录下当前训练误差
        # 打印结果
        print('loss: %f, %f sec per epoch' % (ls[-1], time.time() - start))
    # 作图
    set_figsize()
    plt.plot(np.linspace(0, num_epochs, len(ls)), ls)
    plt.xlabel('epoch')
    plt.ylabel('loss')
    plt.show()


features, labels = get_data_ch7()
train_ch7(adam, init_adam_states(), {'lr': 0.01, 't': 1}, features, labels)

```
```Python
training:
loss: 0.244096, 0.312429 sec per epoch
loss: 0.242450, 0.421774 sec per epoch
```
### 线性回归简洁实现（Adam算法）
```Python
from mxnet import nd, autograd, init, gluon
from matplotlib import pyplot as plt
from IPython import display
import numpy as np
from mxnet.gluon import loss as gloss, data as gdata, nn
import time


# 矢量图显示
# SVG Display
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
# Set size
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def get_data_ch7():
    data = np.genfromtxt('data/airfoil_self_noise.dat', delimiter='\t')
    data = (data - data.mean(axis=0)) / data.std(axis=0)
    return nd.array(data[:1500, :-1]), nd.array(data[:1500, -1])


def train_gluon_ch7(trainer_name, trainer_hyperparams, features, labels, batch_size=10, num_epochs=2):
    print('training:')
    # 初试化模型
    net = nn.Sequential()
    net.add(nn.Dense(1))
    net.initialize(init.Normal(sigma=0.01))
    loss = gloss.L2Loss()

    def eval_loss():
        return loss(net(features), labels).mean().asscalar()

    ls = [eval_loss()]
    data_iter = gdata.DataLoader(gdata.ArrayDataset(features, labels), batch_size, shuffle=True)
    # 创建Trainer实例来迭代模型参数
    trainer = gluon.Trainer(net.collect_params(), trainer_name, trainer_hyperparams)
    for _ in range(num_epochs):
        start = time.time()
        for batch_i, (X, y) in enumerate(data_iter):
            with autograd.record():
                l = loss(net(X), y)
            l.backward()
            trainer.step(batch_size)
            if (batch_i + 1) * batch_size % 100 == 0:
                ls.append(eval_loss())
        # 打印结果
        print('loss: %f, %f sec per epoch' % (ls[-1], time.time() - start))
    set_figsize()
    plt.plot(np.linspace(0, num_epochs, len(ls)), ls)
    plt.xlabel('epoch')
    plt.ylabel('loss')
    plt.show()


features, labels = get_data_ch7()
train_gluon_ch7('adam', {'learning_rate': 0.01}, features, labels)

```
```Python
training:
loss: 0.244517, 0.203076 sec per epoch
loss: 0.244551, 0.218697 sec per epoch
```
> # 计算性能

## 命令式和符号式混合编程
### 测试
```Python
def add_str():
    return '''
def add(a, b):
    return a + b
'''


def fancy_func_str():
    return '''
def fancy_func(a, b, c, d):
    e = add(a, b)
    f = add(c, d)
    g = add(e, f)
    return g
'''


def evoke_str():
    return add_str() + fancy_func_str() + '''
print(fancy_func(1, 2, 3, 4))
'''
##

prog = evoke_str()
print(prog)
y = compile(prog, '', 'exec')
exec(y)

```
### 使用HybridSequential类构造模型
```Python
from mxnet import nd, sym
from mxnet.gluon import nn
import time


def get_net():
    net = nn.HybridSequential()
    net.add(nn.Dense(256, activation='relu'),
            nn.Dense(128, activation='relu'),
            nn.Dense(2))
    net.initialize()
    return net


x = nd.random.uniform(shape=(1, 512))
net = get_net()
print(net(x))

net.hybridize()
print(net(x))


# 比较hybridize函数优化前后1000次net模型计算时间
def benchmark(net, x):
    start = time.time()
    for i in range(1000):
        _ = net(x)
    nd.waitall()  # 等待所有计算完成方便计时
    return time.time() - start


net = get_net()
print('Before hybridizing: %.4f sec' % (benchmark(net, x)))
net.hybridize()
print('After hybridizing: %.4f sec' % (benchmark(net, x)))

net.export('my_mlp')

x = sym.var('data')
print(net(x))

```
```Python
[[-0.1137567  -0.05474834]]
<NDArray 1x2 @cpu(0)>

[[-0.1137567  -0.05474834]]
<NDArray 1x2 @cpu(0)>
Before hybridizing: 0.4270 sec
After hybridizing: 0.2341 sec
<Symbol dense5_fwd>
```
### 使用HybridBlock类构造模型
```Python
from mxnet import nd, sym
from mxnet.gluon import nn
import time


class HybridNet(nn.HybridBlock):
    def __init__(self, **kwargs):
        super(HybridNet, self).__init__(**kwargs)
        self.hidden = nn.Dense(10)
        self.output = nn.Dense(2)

    def hybrid_forward(self, F, x):
        print('F:', F)
        print('x:', x)
        x = F.relu(self.hidden(x))
        print('hidden:', x)
        return self.output(x)


net = HybridNet()
net.initialize()
x = nd.random.uniform(shape=(1, 4))
print(net(x))
print(net(x))

net.hybridize()
print(net(x))
print(net(x))

```
```Python
F: <module 'mxnet.ndarray' from 'D:\\Anaconda3\\lib\\site-packages\\mxnet\\ndarray\\__init__.py'>
x:
[[0.5488135  0.5928446  0.71518934 0.84426576]]
<NDArray 1x4 @cpu(0)>
hidden:
[[0.08314275 0.00533178 0.         0.00244537 0.04885033 0.07866654
  0.         0.03953931 0.07231292 0.10010414]]
<NDArray 1x10 @cpu(0)>

[[-0.00318543  0.00871998]]
<NDArray 1x2 @cpu(0)>
F: <module 'mxnet.ndarray' from 'D:\\Anaconda3\\lib\\site-packages\\mxnet\\ndarray\\__init__.py'>
x:
[[0.5488135  0.5928446  0.71518934 0.84426576]]
<NDArray 1x4 @cpu(0)>
hidden:
[[0.08314275 0.00533178 0.         0.00244537 0.04885033 0.07866654
  0.         0.03953931 0.07231292 0.10010414]]
<NDArray 1x10 @cpu(0)>

[[-0.00318543  0.00871998]]
<NDArray 1x2 @cpu(0)>
F: <module 'mxnet.symbol' from 'D:\\Anaconda3\\lib\\site-packages\\mxnet\\symbol\\__init__.py'>
x: <Symbol data>
hidden: <Symbol hybridnet0_relu0>

[[-0.00318543  0.00871998]]
<NDArray 1x2 @cpu(0)>

[[-0.00318543  0.00871998]]
<NDArray 1x2 @cpu(0)>
```
## 异步计算
### MXNet中的异步计算
```Python
from mxnet import autograd, gluon, nd
from mxnet.gluon import loss as gloss, nn
import os
import subprocess
import time


class Benchmark(object):
    def __init__(self, prefix=None):
        self.prefix = prefix + ' ' if prefix else ''

    def __enter__(self):
        self.start = time.time()

    def __exit__(self, *args):
        print('%stime: %.4f sec' % (self.prefix, time.time() - self.start))


with Benchmark('Workloads are queued.'):
    x = nd.random.uniform(shape=(2000, 2000))
    y = nd.dot(x, x).sum()
with Benchmark('Workloads are finished.'):
    print('sum =', y)

```
```Python
Workloads are queued. time: 0.0504 sec
sum =
[2.0003661e+09]
<NDArray 1 @cpu(0)>
Workloads are finished. time: 0.4571 sec
```
### 使用同步函数让前端等待计算结果

|同步函数|
|:--:|
|wati_to_read|
|waitall|
|asnumpy|
|asscalar|
|print|
|其他任何NDArray转换成其他不支持异步计算的数据结构的操作|

```Python
from mxnet import autograd, gluon, nd
from mxnet.gluon import loss as gloss, nn
import os
import subprocess
import time


class Benchmark(object):
    def __init__(self, prefix=None):
        self.prefix = prefix + ' ' if prefix else ''

    def __enter__(self):
        self.start = time.time()

    def __exit__(self, *args):
        print('%stime: %.4f sec' % (self.prefix, time.time() - self.start))


with Benchmark():
    x = nd.random.uniform(shape=(2000, 2000))
    y = nd.dot(x, x)

with Benchmark():
    x = nd.random.uniform(shape=(2000, 2000))
    y = nd.dot(x, x)
    y.wait_to_read()

with Benchmark():
    x = nd.random.uniform(shape=(2000, 2000))
    y = nd.dot(x, x)
    z = nd.dot(x, x)
    nd.waitall()

with Benchmark():
    y = nd.dot(x, x)
    y.norm().asscalar()

```
```Python
time: 0.0020 sec
time: 0.5835 sec
time: 0.5356 sec
```
### 使用异步计算提升计算机性能
```Python
from mxnet import autograd, gluon, nd
from mxnet.gluon import loss as gloss, nn
import os
import subprocess
import time


class Benchmark(object):
    def __init__(self, prefix=None):
        self.prefix = prefix + ' ' if prefix else ''

    def __enter__(self):
        self.start = time.time()

    def __exit__(self, *args):
        print('%stime: %.4f sec' % (self.prefix, time.time() - self.start))


x = nd.random.uniform(shape=(2000, 2000))
with Benchmark('synchronous.'):
    for _ in range(1000):
        y = x + 1
        y.wait_to_read()

x = nd.random.uniform(shape=(2000, 2000))
with Benchmark('asynchronous.'):
    for _ in range(1000):
        y = x + 1
    nd.waitall()

```
<font color=red>注意异步优化是针对Linux的，测试发现。</font>
```Python
# Windows 10
synchronous. time: 3.3646 sec
asynchronous. time: 4.8031 sec
```
```Python
# Linux
synchronous. time: 4.0054 sec
asynchronous. time: 3.3183 sec
```
## 异步计算对内存的影响
```Python
from mxnet import autograd, gluon, nd
from mxnet.gluon import loss as gloss, nn
import os
import subprocess
import time


def data_iter():
    start = time.time()
    num_batches, batch_size = 100, 1024
    for i in range(num_batches):
        X = nd.random.normal(shape=(batch_size, 512))
        y = nd.ones((batch_size,))
        yield X, y
        if (i + 1) % 50 == 0:
            print('batch %d, time %f sec' % (i + 1, time.time() - start))


net = nn.Sequential()
net.add(nn.Dense(2048, activation='relu'),
        nn.Dense(512, activation='relu'),
        nn.Dense(1))
net.initialize()
trainer = gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': 0.005})
loss = gloss.L2Loss()


def get_mem():
    res = subprocess.check_output(['ps', 'u', '-p', str(os.getpid())])
    return int(str(res).split()[15]) / 1e3


# for X, y in data_iter():
#     break
# loss(y, net(X)).wait_to_read()

# 使用同步函数，内存占用少，每批次计算长
l_sum, mem = 0, get_mem()
for X, y in data_iter():
    with autograd.record():
        l = loss(y, net(X))
    l_sum += l.mean().asscalar()  #使用同步函数asscalar
    l.backward()
    trainer.step(X.shape[0])
nd.waitall()
print('increased memory: %f MB' % (get_mem() - mem))

# 不使用同步函数，内存占用多，每批次计算短
# mem = get_mem()
# for X, y in data_iter():
#     with autograd.record():
#         l = loss(y, net(X))
#     l.backward()
#     trainer.step(X.shape[0])
# nd.waitall()
# print('increased memory: %f MB' % (get_mem() - mem))

```
```Python
# 使用同步函数
batch 50, time 7.797709 sec
batch 100, time 15.865698 sec
increased memory: 31.816000 MB
# 不适用同步函数
batch 50, time 0.093173 sec
batch 100, time 0.191536 sec
increased memory: 37.980000 MB
```
## CPU和GPU的并行计算
```Python
from mxnet import autograd, gluon, nd
import mxnet as mx
from mxnet.gluon import loss as gloss, nn
import os
import subprocess
import time


class Benchmark(object):
    def __init__(self, prefix=None):
        self.prefix = prefix + ' ' if prefix else ''

    def __enter__(self):
        self.start = time.time()

    def __exit__(self, *args):
        print('%stime: %.4f sec' % (self.prefix, time.time() - self.start))


def run(x):
    return [nd.dot(x, x) for _ in range(10)]


x_cpu = nd.random.uniform(shape=(2000, 2000))
x_gpu = nd.random.uniform(shape=(6000, 6000), ctx=mx.gpu(0))

run(x_cpu)  # 预热开始
run(x_gpu)
nd.waitall()  # 预热结束

with Benchmark('Run on CPU.'):
    run(x_cpu)
    nd.waitall()

with Benchmark('Then run on GPU.'):
    run(x_gpu)
    nd.waitall()

with Benchmark('Run on both CPU and GPU in parallel.'):
    run(x_cpu)
    run(x_gpu)
    nd.waitall()

```
```Python
Run on CPU. time: 0.8423 sec
Then run on GPU. time: 0.5268 sec
Run on both CPU and GPU in parallel. time: 0.8524 sec
```
## 计算和通信的并行计算
```Python
from mxnet import autograd, gluon, nd
import mxnet as mx
from mxnet.gluon import loss as gloss, nn
import os
import subprocess
import time


class Benchmark(object):
    def __init__(self, prefix=None):
        self.prefix = prefix + ' ' if prefix else ''

    def __enter__(self):
        self.start = time.time()

    def __exit__(self, *args):
        print('%stime: %.4f sec' % (self.prefix, time.time() - self.start))


def run(x):
    return [nd.dot(x, x) for _ in range(10)]


def copy_to_cpu(x):
    return [y.copyto(mx.cpu()) for y in x]


x_cpu = nd.random.uniform(shape=(2000, 2000))
x_gpu = nd.random.uniform(shape=(6000, 6000), ctx=mx.gpu(0))

run(x_cpu)  # 预热开始
run(x_gpu)
nd.waitall()  # 预热结束

with Benchmark('Run on GPU.'):
    y = run(x_gpu)
    nd.waitall()

with Benchmark('Then copy to CPU..'):
    copy_to_cpu(y)
    nd.waitall()

with Benchmark('Run and copy in parallel.'):
    y = run(x_gpu)
    copy_to_cpu(y)
    nd.waitall()

```
```Python
Run on GPU. time: 0.5432 sec
Then copy to CPU.. time: 1.3464 sec
Run and copy in parallel. time: 1.5638 sec
```
## 简单计算量小，并行计算
```Python
from mxnet import nd
import time


class Benchmark(object):
    def __init__(self, prefix=None):
        self.prefix = prefix + ' ' if prefix else ''

    def __enter__(self):
        self.start = time.time()

    def __exit__(self, *args):
        print('%stime: %.4f sec' % (self.prefix, time.time() - self.start))


with Benchmark('Generate X..'):
    x = nd.random.uniform(shape=(2000, 2000))
    nd.waitall()

with Benchmark('Then generate Y.'):
    y = nd.random.uniform(shape=(2000, 2000))
    nd.waitall()

with Benchmark('Generate X and Y in parallel..'):
    x = nd.random.uniform(shape=(2000, 2000))
    y = nd.random.uniform(shape=(2000, 2000))
    nd.waitall()

```
```Python
Generate X.. time: 0.0628 sec
Then generate Y. time: 0.0628 sec
Generate X and Y in parallel.. time: 0.1302 sec
```
## 多GPU并行计算
```Python
import mxnet as mx
from mxnet import autograd, nd
from mxnet.gluon import loss as gloss, data as gdata
import time
import sys

# 定义模型
# 初始化模型参数
scale = 0.01
W1 = nd.random.normal(scale=scale, shape=(20, 1, 3, 3))
b1 = nd.zeros(shape=20)
W2 = nd.random.normal(scale=scale, shape=(50, 20, 5, 5))
b2 = nd.zeros(shape=50)
W3 = nd.random.normal(scale=scale, shape=(800, 128))
b3 = nd.zeros(shape=128)
W4 = nd.random.normal(scale=scale, shape=(128, 10))
b4 = nd.zeros(shape=10)
params = [W1, b1, W2, b2, W3, b3, W4, b4]


# 定义模型
def lenet(X, params):
    h1_conv = nd.Convolution(data=X, weight=params[0], bias=params[1], kernel=(3, 3), num_filter=20)
    h1_activation = nd.relu(h1_conv)
    h1 = nd.Pooling(data=h1_activation, pool_type='avg', kernel=(2, 2), stride=(2, 2))

    h2_conv = nd.Convolution(data=h1, weight=params[2], bias=params[3], kernel=(5, 5), num_filter=50)
    h2_activation = nd.relu(h2_conv)
    h2 = nd.Pooling(data=h2_activation, pool_type='avg', kernel=(2, 2), stride=(2, 2))

    h2 = nd.flatten(h2)
    h3_linear = nd.dot(h2, params[4]) + params[5]
    h3 = nd.relu(h3_linear)

    y_hat = nd.dot(h3, params[6]) + params[7]

    return y_hat


# 交叉熵损失函数
loss = gloss.SoftmaxCrossEntropyLoss()


# 复制到GPU上
def get_params(params, ctx):
    new_params = [p.copyto(ctx) for p in params]
    for p in new_params:
        p.attach_grad()
    return new_params


new_params = get_params(params, mx.cpu(0))
print('b1 weight:', new_params[1])
print('b1 grad:', new_params[1].grad)


# 将各块GPU的显存上的数据加起来，然后再广播到所有的显存上
def allreduce(data):
    for i in range(1, len(data)):
        data[0][:] += data[i].copyto(data[0].context)
    for i in range(1, len(data)):
        data[0].copyto(data[i])


data = [nd.ones((1, 2), ctx=mx.cpu(i)) * (i + 1) for i in range(2)]
print('Before allreduce:', data)
allreduce(data)
print('After allreduce:', data)


# 给定一个批量的数据，将其划分并复制到各块显卡的显存上
def split_and_load(data, ctx):
    n, k = data.shape[0], len(ctx)
    m = n // k  # 简单起见，假设可以整除
    assert m * k == n, '# examples is not divided by # devices.'
    return [data[i * m: (i + 1) * m].as_in_context(ctx[i]) for i in range(k)]


batch = nd.arange(24).reshape((6, 4))
ctx = [mx.cpu(0), mx.cpu(1)]
splitted = split_and_load(batch, ctx)
print('input:', batch)
print('load into', ctx)
print('output:', splitted)


# 定义优化算法
def sgd(params, lr, batch_size):
    for param in params:
        # print("param:", param)
        param[:] = param - lr * param.grad / batch_size


def train_batch(X, y, gpu_params, ctx, lr):
    # 当ctx包含多块GPU及相应的显存时，将小批量数据样本划分并复制到各个显存上
    gpu_Xs, gpu_ys = split_and_load(X, ctx), split_and_load(y, ctx)
    with autograd.record():
        ls = [loss(lenet(gpu_X, gpu_W), gpu_y)
              for gpu_X, gpu_y, gpu_W in zip(gpu_Xs, gpu_ys, gpu_params)]
    for l in ls:  # 在各块GPU上分别反向传播
        l.backward()
    # 把各块显卡上的梯度加起来，然后广播到所有显存上
    for i in range(len(gpu_params[0])):
        allreduce([gpu_params[c][i].grad for c in range(len(ctx))])
    for param in gpu_params:  # 在各块显卡的显存上分别更新模型参数
        sgd(param, lr, X.shape[0])


# 获取数据
def load_data_fashion_mnist(batch_size):
    mnist_train = gdata.vision.FashionMNIST(train=True)
    mnist_test = gdata.vision.FashionMNIST(train=False)

    # ToTensor将图像数据从unit8格式变换成32位浮点数格式，并除以255使得所有像素的数值均在0到1之间。
    # ToTensor还将图像通道的最后一维移动到最前一维来方便后面卷积神经网络计算
    transformer = gdata.vision.transforms.ToTensor()
    # Gluon的DataLoader中一个很方便的共鞥是允许使用多进程来加速数据读取
    # 暂不支持Windows操作系统
    # 通过参数num_workers来设置4个进程读取数据
    if sys.platform.startswith('win'):
        num_workers = 0
    else:
        num_workers = 4

    train_iter = gdata.DataLoader(mnist_train.transform_first(transformer),
                                  batch_size,
                                  shuffle=True,
                                  num_workers=num_workers)
    test_iter = gdata.DataLoader(mnist_test.transform_first(transformer),
                                 batch_size,
                                 shuffle=True,
                                 num_workers=num_workers)
    return train_iter, test_iter


def evaluate_accuracy(net, data_iter, ctx):
    acc_sum, n = nd.array([0], ctx=ctx), 0
    for X, y in data_iter:
        X, y = X.as_in_context(ctx), y.as_in_context(ctx).astype('float32')
        y_hat = net(X)
        acc_sum += (y_hat.argmax(axis=1) == y).sum()
        n += y.size
    return acc_sum.asscalar() / n


def train(num_gpus, batch_size, lr):
    train_iter, test_iter = load_data_fashion_mnist(batch_size)
    ctx = [mx.cpu(i) for i in range(num_gpus)]
    print('running on:', ctx)
    # 将模型参数复制到num_gpus块显卡的显存上
    gpu_params = [get_params(params, c) for c in ctx]
    for epoch in range(4):
        start = time.time()
        for X, y in train_iter:
            # 对单个小批量进行多GPU训练
            train_batch(X, y, gpu_params, ctx, lr)
            nd.waitall()
        train_time = time.time() - start

        def net(x):  # 在gpu(0)上验证模型
            return lenet(x, gpu_params[0])
        test_acc = evaluate_accuracy(net, test_iter, ctx[0])
        print('epoch %d, time %.1f sec, test acc %.2f'
              % (epoch + 1, train_time, test_acc))


train(num_gpus=1, batch_size=256, lr=0.2)
train(num_gpus=2, batch_size=256, lr=0.2)

```
```Python
# 多CPU测试
b1 weight:
[0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0.]
<NDArray 20 @cpu(0)>
b1 grad:
[0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0.]
<NDArray 20 @cpu(0)>
Before allreduce: [
[[1. 1.]]
<NDArray 1x2 @cpu(0)>,
[[2. 2.]]
<NDArray 1x2 @cpu(1)>]
After allreduce: [
[[3. 3.]]
<NDArray 1x2 @cpu(0)>,
[[3. 3.]]
<NDArray 1x2 @cpu(1)>]
input:
[[ 0.  1.  2.  3.]
 [ 4.  5.  6.  7.]
 [ 8.  9. 10. 11.]
 [12. 13. 14. 15.]
 [16. 17. 18. 19.]
 [20. 21. 22. 23.]]
<NDArray 6x4 @cpu(0)>
load into [cpu(0), cpu(1)]
output: [
[[ 0.  1.  2.  3.]
 [ 4.  5.  6.  7.]
 [ 8.  9. 10. 11.]]
<NDArray 3x4 @cpu(0)>,
[[12. 13. 14. 15.]
 [16. 17. 18. 19.]
 [20. 21. 22. 23.]]
<NDArray 3x4 @cpu(1)>]
running on: [cpu(0)]
epoch 1, time 112.6 sec, test acc 0.10
epoch 2, time 98.7 sec, test acc 0.54
epoch 3, time 90.5 sec, test acc 0.74
epoch 4, time 98.0 sec, test acc 0.76
running on: [cpu(0), cpu(1)]
epoch 1, time 103.4 sec, test acc 0.10
epoch 2, time 103.2 sec, test acc 0.62
epoch 3, time 92.3 sec, test acc 0.72
epoch 4, time 103.8 sec, test acc 0.72
```
## 多GPU简洁实现
```Python
import mxnet as mx
from mxnet import autograd, gluon, init, nd
from mxnet.gluon import loss as gloss, data as gdata, nn, utils as gutils
import time
import sys
import os


class Residual(nn.Block):
    def __init__(self, num_channels, user_1x1conv=False, strides=1, **kwargs):
        super(Residual, self).__init__(**kwargs)
        self.conv1 = nn.Conv2D(num_channels, kernel_size=3, padding=1, strides=strides)
        self.conv2 = nn.Conv2D(num_channels, kernel_size=3, padding=1)
        if user_1x1conv:
            self.conv3 = nn.Conv2D(num_channels, kernel_size=1, strides=strides)
        else:
            self.conv3 = None
        self.bn1 = nn.BatchNorm()
        self.bn2 = nn.BatchNorm()

    def forward(self, X):
        Y = nd.relu(self.bn1(self.conv1(X)))
        Y = self.bn2(self.conv2(Y))
        if self.conv3:
            X = self.conv3(X)
        return nd.relu(Y + X)


def resnet_18(num_classes):
    def resnet_block(num_channels, num_residuals, first_block=False):
        blk = nn.Sequential()
        for i in range(num_residuals):
            if i == 0 and not first_block:
                blk.add(Residual(num_channels, user_1x1conv=True, strides=2))
            else:
                blk.add(Residual(num_channels))
        return blk

    net = nn.Sequential()
    # 这里使用了较小的卷积核、步幅和填充，并去掉了最大池化层
    net.add(nn.Conv2D(64, kernel_size=3, strides=1, padding=1),
            nn.BatchNorm(),
            nn.Activation('relu'))
    net.add(resnet_block(64, 2, first_block=True),
            resnet_block(128, 2),
            resnet_block(256, 2),
            resnet_block(512, 2))
    net.add(nn.GlobalAvgPool2D(),
            nn.Dense(num_classes))
    return net


net = resnet_18(10)

ctx = [mx.gpu(0), mx.gpu(1)]
net.initialize(init=init.Normal(sigma=0.01), ctx=ctx)

x = nd.random.uniform(shape=(4, 1, 28, 28))
gpu_x = gutils.split_and_load(x, ctx)
print(net(gpu_x[0]), net(gpu_x[1]))

weight = net[0].params.get('weight')
try:
    weight.data()
except RuntimeError:
    print('not initialized on', mx.cpu())
print(weight.data(ctx[0])[0], weight.data(ctx[1])[0])


def load_data_fashion_mnist(batch_size, resize=None, root=os.path.join('mxnet', 'datasets', 'fashion-mnist')):
    root = os.path.expanduser(root)
    transformer = []
    if resize:
        transformer += [gdata.vision.transforms.Resize(resize)]
    transformer += [gdata.vision.transforms.ToTensor()]
    transformer = gdata.vision.transforms.Compose(transformer)

    mnist_train = gdata.vision.FashionMNIST(root=root, train=True)
    mnist_test = gdata.vision.FashionMNIST(root=root, train=False)

    num_workers = 0 if sys.platform.startswith('win') else 4
    train_iter = gdata.DataLoader(mnist_train.transform_first(transformer),
                                  batch_size=batch_size,
                                  shuffle=True,
                                  num_workers=num_workers)
    test_iter = gdata.DataLoader(mnist_test.transform_first(transformer),
                                 batch_size=batch_size,
                                 shuffle=True,
                                 num_workers=num_workers)
    return train_iter, test_iter


def evaluate_accuracy(data_iter, net, ctx):
    acc_sum, n = nd.array([0], ctx=ctx), 0
    for X, y in data_iter:
        X, y = X.as_in_context(ctx), y.as_in_context(ctx).astype('float32')
        y_hat = net(X)
        acc_sum += (y_hat.argmax(axis=1) == y).sum()
        n += y.size
    return acc_sum.asscalar() / n


def train(num_gpus, batch_size, lr):
    train_iter, test_iter = load_data_fashion_mnist(batch_size=batch_size)
    ctx = [mx.gpu(i) for i in range(num_gpus)]
    print('running on:', ctx)
    net.initialize(init=init.Normal(sigma=0.01), ctx=ctx, force_reinit=True)
    trainer = gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': lr})
    loss = gloss.SoftmaxCrossEntropyLoss()
    for epoch in range(4):
        start = time.time()
        for X, y in train_iter:
            gpu_Xs = gutils.split_and_load(X, ctx)
            gpu_ys = gutils.split_and_load(y, ctx)
            with autograd.record():
                ls = [loss(net(gpu_X), gpu_y) for gpu_X, gpu_y in zip(gpu_Xs, gpu_ys)]
            for l in ls:
                l.backward()
            trainer.step(batch_size)
        nd.waitall()
        train_time = time.time() - start
        test_acc = evaluate_accuracy(test_iter, net, ctx[0])
        print('epoch %d, time %.1f sec, test acc %.2f' % (epoch + 1, train_time, test_acc))


train(num_gpus=1, batch_size=256, lr=0.1)
train(num_gpus=2, batch_size=512, lr=0.2)

```
```Python
running on: [gpu(0)]
epoch 1, time 30.3 sec, test acc 0.84
epoch 2, time 26.9 sec, test acc 0.89
epoch 3, time 27.1 sec, test acc 0.91
epoch 4, time 27.1 sec, test acc 0.91
epoch 5, time 27.0 sec, test acc 0.90
epoch 6, time 27.1 sec, test acc 0.92
epoch 7, time 27.1 sec, test acc 0.93
epoch 8, time 27.1 sec, test acc 0.93
epoch 9, time 27.0 sec, test acc 0.92
epoch 10, time 27.0 sec, test acc 0.92

```
> # 计算机视觉

## 图像增广
### 增广类型
```Python
import mxnet as mx
from mxnet import autograd, gluon, image, init, nd
from mxnet.gluon import data as gdata, loss as gloss, utils as gutils
import sys
import time
import os
from matplotlib import pyplot as plt
from IPython import display


# 矢量图显示
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


set_figsize()
img_path = os.path.join('img', 'cat1.png')
img_path = os.path.expanduser(img_path)
img = image.imread(img_path)
plt.imshow(img.asnumpy())
plt.show()


def show_images(imgs, num_rows, num_cols, scale=2.0):
    figsize = (num_cols * scale, num_rows * scale)
    _, axes = plt.subplots(num_rows, num_cols, figsize=figsize)
    for i in range(num_rows):
        for j in range(num_cols):
            axes[i][j].imshow(imgs[i * num_cols + j].asnumpy())
            axes[i][j].axes.get_xaxis().set_visible(False)
            axes[i][j].axes.get_yaxis().set_visible(False)
    return axes


def apply(img, aug, num_rows=2, num_cols=4, scale=1.5):
    Y = [aug(img) for _ in range(num_rows * num_cols)]
    show_images(Y, num_rows, num_cols, scale)
    plt.show()


# 翻转
apply(img, gdata.vision.transforms.RandomFlipLeftRight())
apply(img, gdata.vision.transforms.RandomFlipTopBottom())
# 裁剪
shape_aug = gdata.vision.transforms.RandomResizedCrop(size=200, scale=(0.1, 1), ratio=(0.5, 2))
apply(img, shape_aug)
# 亮度、色调、饱和度、对比度
apply(img, gdata.vision.transforms.RandomBrightness(0.5))
apply(img, gdata.vision.transforms.RandomHue(0.5))

color_aug = gdata.vision.transforms.RandomColorJitter(brightness=0.5, contrast=0.5, saturation=0.5, hue=0.5)
apply(img, color_aug)

# 叠加
augs = gdata.vision.transforms.Compose([gdata.vision.transforms.RandomFlipLeftRight(), color_aug, shape_aug])
apply(img, augs)

```
### 使用图像增广进行多GPU训练
```Python
import mxnet as mx
from mxnet import autograd, gluon, image, init, nd
from mxnet.gluon import data as gdata, loss as gloss, utils as gutils, nn
import sys
import time
import os
from matplotlib import pyplot as plt
from IPython import display


# 矢量图显示
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


set_figsize()
img_path = os.path.join('img', 'cat1.png')
img_path = os.path.expanduser(img_path)
img = image.imread(img_path)
plt.imshow(img.asnumpy())
plt.show()


def show_images(imgs, num_rows, num_cols, scale=2.0):
    figsize = (num_cols * scale, num_rows * scale)
    _, axes = plt.subplots(num_rows, num_cols, figsize=figsize)
    for i in range(num_rows):
        for j in range(num_cols):
            axes[i][j].imshow(imgs[i * num_cols + j].asnumpy())
            axes[i][j].axes.get_xaxis().set_visible(False)
            axes[i][j].axes.get_yaxis().set_visible(False)
    return axes


show_images(gdata.vision.CIFAR10(train=True)[0:32][0], 4, 8, scale=0.8)
plt.show()

flip_aug = gdata.vision.transforms.Compose([
    gdata.vision.transforms.RandomFlipLeftRight(),
    gdata.vision.transforms.ToTensor()])
no_aug = gdata.vision.transforms.Compose([
    gdata.vision.transforms.ToTensor()])


class Residual(nn.Block):
    def __init__(self, num_channels, user_1x1conv=False, strides=1, **kwargs):
        super(Residual, self).__init__(**kwargs)
        self.conv1 = nn.Conv2D(num_channels, kernel_size=3, padding=1, strides=strides)
        self.conv2 = nn.Conv2D(num_channels, kernel_size=3, padding=1)
        if user_1x1conv:
            self.conv3 = nn.Conv2D(num_channels, kernel_size=1, strides=strides)
        else:
            self.conv3 = None
        self.bn1 = nn.BatchNorm()
        self.bn2 = nn.BatchNorm()

    def forward(self, X):
        Y = nd.relu(self.bn1(self.conv1(X)))
        Y = self.bn2(self.conv2(Y))
        if self.conv3:
            X = self.conv3(X)
        return nd.relu(Y + X)


def resnet_18(num_classes):
    def resnet_block(num_channels, num_residuals, first_block=False):
        blk = nn.Sequential()
        for i in range(num_residuals):
            if i == 0 and not first_block:
                blk.add(Residual(num_channels, user_1x1conv=True, strides=2))
            else:
                blk.add(Residual(num_channels))
        return blk

    net = nn.Sequential()
    # 这里使用了较小的卷积核、步幅和填充，并去掉了最大池化层
    net.add(nn.Conv2D(64, kernel_size=3, strides=1, padding=1),
            nn.BatchNorm(),
            nn.Activation('relu'))
    net.add(resnet_block(64, 2, first_block=True),
            resnet_block(128, 2),
            resnet_block(256, 2),
            resnet_block(512, 2))
    net.add(nn.GlobalAvgPool2D(),
            nn.Dense(num_classes))
    return net


def load_cifar10(is_train, augs, batch_size):
    num_workers = 0 if sys.platform.startswith('win32') else 4
    return gdata.DataLoader(
        gdata.vision.CIFAR10(train=is_train).transform_first(augs),
        batch_size=batch_size,
        shuffle=is_train,
        num_workers=num_workers)


def try_all_gpus():
    ctxes = []
    try:
        for i in range(16):  # 假设一台机器上GPU的数量不超过16
            ctx = mx.gpu(i)
            _ = nd.array([0], ctx=ctx)
            ctxes.append(ctx)
    except mx.base.MXNetError:
        pass
    if not ctxes:
        ctxes = [mx.cpu()]
    return ctxes


def _get_batch(batch, ctx):
    features, labels = batch
    if labels.dtype != features.dtype:
        labels = labels.astype(features.dtype)
    return gutils.split_and_load(features, ctx), gutils.split_and_load(labels, ctx), features.shape[0]


def evaluate_accuracy(data_iter, net, ctx=[mx.cpu()]):
    if isinstance(ctx, mx.Context):
        ctx = [ctx]
    acc_sum, n = nd.array([0]), 0
    for batch in data_iter:
        features, labels, _ = _get_batch(batch, ctx)
        for X, y in zip(features, labels):
            y = y.astype('float32')
            acc_sum += (net(X).argmax(axis=1) == y).sum().copyto(mx.cpu())
            n += y.size
        acc_sum.wait_to_read()
    return acc_sum.asscalar() / n


def train(train_iter, test_iter, net, loss, trainer, ctx, num_epochs):
    print('training on', ctx)
    if isinstance(ctx, mx.Context):
        ctx = [ctx]
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n, m, start = 0.0, 0.0, 0, 0, time.time()
        for i, batch in enumerate(train_iter):
            Xs, ys, batch_size = _get_batch(batch, ctx)
            ls = []
            with autograd.record():
                y_hats = [net(X) for X in Xs]
                ls = [loss(y_hat, y) for y_hat, y in zip(y_hats, ys)]
            for l in ls:
                l.backward()
            trainer.step(batch_size)
            train_l_sum += sum([l.sum().asscalar() for l in ls])
            # n += sum([l.size for l in ls])
            n += batch_size
            train_acc_sum += sum([(y_hat.argmax(axis=1) == y).sum().asscalar() for y_hat, y in zip(y_hats, ys)])
            # m += sum([y.size for y in ys])
            m += batch_size
        test_acc = evaluate_accuracy(test_iter, net, ctx)
        print('epoch %d, loss %.4f, train acc %.3f, test acc %.3f, time %.1f sec'
              % (epoch + 1, train_l_sum / n, train_acc_sum / m, test_acc, time.time() - start))


def train_with_data_aug(train_augs, test_augs, lr=0.001):
    batch_size, ctx, net = 256, try_all_gpus(), resnet_18(10)
    net.initialize(ctx=ctx, init=init.Xavier())
    trainer = gluon.Trainer(net.collect_params(), 'adam', {'learning_rate': lr})
    loss = gloss.SoftmaxCrossEntropyLoss()
    train_iter = load_cifar10(True, train_augs, batch_size)
    test_iter = load_cifar10(False, test_augs, batch_size)
    train(train_iter, test_iter, net, loss, trainer, ctx, num_epochs=10)


train_with_data_aug(flip_aug, no_aug)

```
```Python
training on [gpu(1)]
epoch 1, loss 1.3890, train acc 0.506, test acc 0.441, time 30.2 sec
epoch 2, loss 0.8200, train acc 0.709, test acc 0.674, time 26.3 sec
epoch 3, loss 0.5999, train acc 0.790, test acc 0.768, time 28.4 sec
epoch 4, loss 0.4771, train acc 0.834, test acc 0.792, time 30.5 sec
epoch 5, loss 0.3907, train acc 0.865, test acc 0.799, time 31.1 sec
epoch 6, loss 0.3241, train acc 0.888, test acc 0.799, time 30.5 sec
epoch 7, loss 0.2739, train acc 0.905, test acc 0.835, time 29.1 sec
epoch 8, loss 0.2267, train acc 0.921, test acc 0.816, time 29.9 sec
epoch 9, loss 0.1905, train acc 0.935, test acc 0.852, time 29.6 sec
epoch 10, loss 0.1648, train acc 0.943, test acc 0.840, time 30.1 sec

```
## 微调（fine-tuning）
```Python
from mxnet import gluon, init, nd, autograd
from mxnet.gluon import data as gdata, loss as gloss, model_zoo, nn
from mxnet.gluon import utils as gutils
import os
import mxnet as mx
import zipfile
# from matplotlib import pyplot as plt
import time

data_dir = os.path.join('mxnet', 'datasets', 'data_hotdog')
data_dir = os.path.expanduser(data_dir)
# base_url = 'https://apache-mxnet.s3-accelerate.amazonaws.com/'
# fname = gutils.download(base_url + 'gluon/dataset/hotdog.zip',
# path=data_dir, sha1_hash='fba480ffa8aa7e0febbb511d181409f899b9baa5')


train_imgs = gdata.vision.ImageFolderDataset(os.path.join(data_dir, 'hotdog/train'))
test_imgs = gdata.vision.ImageFolderDataset(os.path.join(data_dir, 'hotdog/test'))


# def show_images(imgs, num_rows, num_cols, scale=2.0):
#     figsize = (num_cols * scale, num_rows * scale)
#     _, axes = plt.subplots(num_rows, num_cols, figsize=figsize)
#     for i in range(num_rows):
#         for j in range(num_cols):
#             axes[i][j].imshow(imgs[i * num_cols + j].asnumpy())
#             axes[i][j].axes.get_xaxis().set_visible(False)
#             axes[i][j].axes.get_yaxis().set_visible(False)
#     return axes


# hotdogs = [train_imgs[i][0] for i in range(8)]
# not_dogs = [train_imgs[-i-1][0] for i in range(8)]
# show_images(hotdogs+not_dogs, 2, 8, scale=1.4)
# plt.show()

# 指定RGB三通道的均值和方差来将图像通道归一化
normalize = gdata.vision.transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225))
train_augs = gdata.vision.transforms.Compose([
    gdata.vision.transforms.RandomResizedCrop(224),
    gdata.vision.transforms.RandomFlipLeftRight(),
    gdata.vision.transforms.ToTensor(),
    normalize
])
test_augs = gdata.vision.transforms.Compose([
    gdata.vision.transforms.Resize(256),
    gdata.vision.transforms.CenterCrop(224),
    gdata.vision.transforms.ToTensor(),
    normalize])

# pretrained=True会自动下载并加载模型参数，然而实验室网速太慢，so先下载好模型参数，然后手动加载o(╥﹏╥)o！！！
model_path = os.path.join('mxnet', 'models', 'resnet18_v2-a81db45f', 'resnet18_v2-a81db45f.params')
model_path = os.path.expanduser(model_path)
pretrained_net = model_zoo.vision.resnet18_v2(pretrained=False)
# 加载前
print(pretrained_net.features[1].weight)
try:
    print(pretrained_net.features[1].weight.data()[:1, :1])
except RuntimeError as error:
    print('Parameter has not been initialized')
    pass
# 加载后
pretrained_net.load_parameters(filename=model_path)
print(pretrained_net.features[1].weight)
print(pretrained_net.features[1].weight.data()[:1, :1])

finetune_net = model_zoo.vision.resnet18_v2(classes=2)
finetune_net.features = pretrained_net.features
finetune_net.output.initialize(init.Xavier())
# output中的模型参数将在迭代中使用10倍大的学习率
finetune_net.output.collect_params().setattr('lr_mult', 10)


def _get_batch(batch, ctx):
    features, labels = batch
    if labels.dtype != features.dtype:
        labels = labels.astype(features.dtype)
    return gutils.split_and_load(features, ctx), gutils.split_and_load(labels, ctx), features.shape[0]


def evaluate_accuracy(data_iter, net, ctx=[mx.cpu()]):
    if isinstance(ctx, mx.Context):
        ctx = [ctx]
    acc_sum, n = nd.array([0]), 0
    for batch in data_iter:
        features, labels, _ = _get_batch(batch, ctx)
        for X, y in zip(features, labels):
            y = y.astype('float32')
            acc_sum += (net(X).argmax(axis=1) == y).sum().copyto(mx.cpu())
            n += y.size
        acc_sum.wait_to_read()
    return acc_sum.asscalar() / n


def train(train_iter, test_iter, net, loss, trainer, ctx, num_epochs):
    f = open('log.txt', 'a')
    print('training on', ctx, file=f)
    print('training on', ctx)
    if isinstance(ctx, mx.Context):
        ctx = [ctx]
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n, m, start = 0.0, 0.0, 0, 0, time.time()
        for i, batch in enumerate(train_iter):
            Xs, ys, batch_size = _get_batch(batch, ctx)
            ls = []
            with autograd.record():
                y_hats = [net(X) for X in Xs]
                ls = [loss(y_hat, y) for y_hat, y in zip(y_hats, ys)]
            for l in ls:
                l.backward()
            trainer.step(batch_size)
            train_l_sum += sum([l.sum().asscalar() for l in ls])
            # n += sum([l.size for l in ls])
            n += batch_size
            train_acc_sum += sum([(y_hat.argmax(axis=1) == y).sum().asscalar() for y_hat, y in zip(y_hats, ys)])
            # m += sum([y.size for y in ys])
            m += batch_size
        test_acc = evaluate_accuracy(test_iter, net, ctx)
        print('epoch %d, loss %.4f, train acc %.3f, test acc %.3f, time %.1f sec'
              % (epoch + 1, train_l_sum / n, train_acc_sum / m, test_acc, time.time() - start))
        print('epoch %d, loss %.4f, train acc %.3f, test acc %.3f, time %.1f sec'
              % (epoch + 1, train_l_sum / n, train_acc_sum / m, test_acc, time.time() - start), file=f)


def train_fine_tuning(net, learning_rate, batch_size=128, num_epochs=5):
    train_iter = gdata.DataLoader(
        train_imgs.transform_first(train_augs),
        batch_size=batch_size,
        shuffle=True)
    test_iter = gdata.DataLoader(
        test_imgs.transform_first(test_augs),
        batch_size=batch_size,
        shuffle=False)
    ctx = [mx.gpu(0)]
    net.collect_params().reset_ctx(ctx)
    net.hybridize()
    loss = gloss.SoftmaxCrossEntropyLoss()
    trainer = gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': learning_rate, 'wd': 0.001})
    train(train_iter, test_iter, net, loss, trainer, ctx, num_epochs)


train_fine_tuning(finetune_net, 0.01)

scratch_net = model_zoo.vision.resnet18_v2(classes=2)
scratch_net.initialize(init=init.Xavier())
train_fine_tuning(scratch_net, 0.1)

```
```Python
2019-08-26 20:34:27---The training is finished, and output file is producing .........
2019-08-26 20:34:26---epoch 20, loss 0.2716, train acc 0.885, test acc 0.860, time 9.0 sec
2019-08-26 20:34:17---epoch 19, loss 0.2990, train acc 0.876, test acc 0.875, time 9.0 sec
2019-08-26 20:34:08---epoch 18, loss 0.2884, train acc 0.878, test acc 0.859, time 9.0 sec
2019-08-26 20:33:59---epoch 17, loss 0.2847, train acc 0.876, test acc 0.859, time 9.0 sec
2019-08-26 20:33:50---epoch 16, loss 0.2943, train acc 0.874, test acc 0.843, time 9.0 sec
2019-08-26 20:33:41---epoch 15, loss 0.2998, train acc 0.878, test acc 0.876, time 9.0 sec
2019-08-26 20:33:32---epoch 14, loss 0.3023, train acc 0.873, test acc 0.863, time 9.0 sec
2019-08-26 20:33:23---epoch 13, loss 0.3076, train acc 0.862, test acc 0.786, time 9.0 sec
2019-08-26 20:33:14---epoch 12, loss 0.3363, train acc 0.852, test acc 0.811, time 9.0 sec
2019-08-26 20:33:05---epoch 11, loss 0.3257, train acc 0.859, test acc 0.866, time 9.0 sec
2019-08-26 20:32:56---epoch 10, loss 0.3142, train acc 0.865, test acc 0.851, time 9.0 sec
2019-08-26 20:32:47---epoch 9, loss 0.3258, train acc 0.854, test acc 0.875, time 9.0 sec
2019-08-26 20:32:38---epoch 8, loss 0.3342, train acc 0.861, test acc 0.856, time 9.0 sec
2019-08-26 20:32:29---epoch 7, loss 0.3499, train acc 0.852, test acc 0.845, time 9.0 sec
2019-08-26 20:32:20---epoch 6, loss 0.3624, train acc 0.846, test acc 0.881, time 9.0 sec
2019-08-26 20:32:11---epoch 5, loss 0.3859, train acc 0.826, test acc 0.829, time 8.9 sec
2019-08-26 20:32:03---epoch 4, loss 0.3927, train acc 0.820, test acc 0.840, time 9.0 sec
2019-08-26 20:31:53---epoch 3, loss 0.3795, train acc 0.839, test acc 0.836, time 9.0 sec
2019-08-26 20:31:44---epoch 2, loss 0.4344, train acc 0.801, test acc 0.860, time 9.0 sec
2019-08-26 20:31:35---epoch 1, loss 0.7175, train acc 0.696, test acc 0.556, time 9.2 sec
2019-08-26 20:31:26---training on [gpu(0), gpu(1)]
2019-08-26 20:31:26---epoch 20, loss 0.0879, train acc 0.973, test acc 0.950, time 9.1 sec
2019-08-26 20:31:17---epoch 19, loss 0.1020, train acc 0.965, test acc 0.943, time 9.0 sec
2019-08-26 20:31:08---epoch 18, loss 0.0812, train acc 0.968, test acc 0.953, time 9.0 sec
2019-08-26 20:30:59---epoch 17, loss 0.0996, train acc 0.962, test acc 0.951, time 9.0 sec
2019-08-26 20:30:50---epoch 16, loss 0.1208, train acc 0.956, test acc 0.941, time 9.0 sec
2019-08-26 20:30:41---epoch 15, loss 0.1119, train acc 0.958, test acc 0.939, time 9.0 sec
2019-08-26 20:30:32---epoch 14, loss 0.1319, train acc 0.949, test acc 0.935, time 9.0 sec
2019-08-26 20:30:23---epoch 13, loss 0.1146, train acc 0.953, test acc 0.943, time 9.0 sec
2019-08-26 20:30:14---epoch 12, loss 0.1395, train acc 0.952, test acc 0.949, time 9.0 sec
2019-08-26 20:30:05---epoch 11, loss 0.2082, train acc 0.927, test acc 0.944, time 9.0 sec
2019-08-26 20:29:56---epoch 10, loss 0.1437, train acc 0.948, test acc 0.941, time 9.0 sec
2019-08-26 20:29:47---epoch 9, loss 0.2256, train acc 0.916, test acc 0.931, time 9.0 sec
2019-08-26 20:29:38---epoch 8, loss 0.1677, train acc 0.941, test acc 0.911, time 9.0 sec
2019-08-26 20:29:29---epoch 7, loss 0.1357, train acc 0.949, test acc 0.907, time 9.0 sec
2019-08-26 20:29:20---epoch 6, loss 0.1896, train acc 0.936, test acc 0.899, time 9.1 sec
2019-08-26 20:29:11---epoch 5, loss 0.3606, train acc 0.899, test acc 0.858, time 8.9 sec
2019-08-26 20:29:02---epoch 4, loss 0.2525, train acc 0.929, test acc 0.916, time 9.0 sec
2019-08-26 20:28:53---epoch 3, loss 0.4706, train acc 0.881, test acc 0.935, time 9.1 sec
2019-08-26 20:28:44---epoch 2, loss 0.3532, train acc 0.901, test acc 0.805, time 9.0 sec
2019-08-26 20:28:35---epoch 1, loss 3.4683, train acc 0.675, test acc 0.906, time 11.3 sec
2019-08-26 20:28:24---[12:28:24] src/operator/nn/./cudnn/./cudnn_algoreg-inl.h:97: Running performance tests to find the best convolution algorithm, this can take a while... (setting env variable MXNET_CUDNN_AUTOTUNE_DEFAULT to 0 to disable)
2019-08-26 20:28:24---training on [gpu(0), gpu(1)]
2019-08-26 20:28:19---Parameter resnetv20_conv0_weight (shape=(64, 3, 7, 7), dtype=<class 'numpy.float32'>)
2019-08-26 20:28:19---
2019-08-26 20:28:19---[[[[-1.64019989e-16 -1.64107318e-15  1.15900094e-14 -1.45087223e-14
2019-08-26 20:28:19---6.13736823e-15  9.31420553e-15 -4.96812310e-15]
2019-08-26 20:28:19---[-5.24587960e-15 -6.12600231e-15  2.52703958e-15 -1.26492343e-14
2019-08-26 20:28:19----8.80555886e-15 -9.94531707e-15  3.19777765e-15]
2019-08-26 20:28:19---[ 6.95685058e-15  1.30257726e-14 -9.37785412e-15 -2.26256455e-15
2019-08-26 20:28:19----1.28336622e-14 -1.03294219e-14  2.46130834e-15]
2019-08-26 20:28:19---[ 1.46163040e-14 -1.04503681e-14 -1.71437571e-14 -8.13254205e-15
2019-08-26 20:28:19----4.71141028e-15  8.24006865e-15  3.25102235e-15]
2019-08-26 20:28:19---[ 1.74203032e-14 -1.88471827e-14 -2.52042954e-14 -3.48773736e-15
2019-08-26 20:28:19---2.85282793e-15  2.09951079e-16  6.23012214e-16]
2019-08-26 20:28:19---[-3.97822237e-15  2.91143075e-15  1.07994753e-15 -6.06272895e-15
2019-08-26 20:28:19----8.24556759e-15  7.16038963e-15  2.21876333e-14]
2019-08-26 20:28:19---[-4.45479614e-15 -1.42962814e-15  4.07669588e-15 -9.37792633e-16
2019-08-26 20:28:19----9.36154578e-16 -2.20163980e-15  1.13034124e-14]]]]
2019-08-26 20:28:19---<NDArray 1x1x7x7 @cpu(0)>
2019-08-26 20:28:19---Parameter resnetv20_conv0_weight (shape=(64, 0, 7, 7), dtype=<class 'numpy.float32'>)
2019-08-26 20:28:19---Parameter has not been initialized
```
## 目标检测与边界框
```Python
from mxnet import image
from matplotlib import pyplot as plt
from IPython import display


# 矢量图显示
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


set_figsize()
img = image.imread('./img/catdog.jpg').asnumpy()
plt.imshow(img)
plt.show()

dog_bbox, cat_bbox = [60, 45, 378, 516], [400, 112, 655, 493]


def bbox_to_rect(bbox, color):
    # 将边界框（左上x，左上y，右下x，右下y）格式转换成matplotlib
    # ((左上x，左上y), 宽，高)
    return plt.Rectangle(
        xy=(bbox[0], bbox[1]), width=bbox[2]-bbox[0], height=bbox[3]-bbox[1],
        fill=False, edgecolor=color, linewidth=2)


fig = plt.imshow(img)
fig.axes.add_patch(bbox_to_rect(dog_bbox, 'blue'))
fig.axes.add_patch(bbox_to_rect(cat_bbox, 'red'))
plt.show()

```
## 锚框

|相关函数|参数|作用|返回值|
|:--:|:--|:--|:--|
|MultiBoxPrior()|1.图像<br>2.尺寸<br>3.宽高比|返回w\*h\*(m+n-1)个锚框|形状为(批量大小，锚框个数，4)|
|MultiBoxTarget()|1.锚框<br>2.真实锚框<br>3.偏移量|为锚框标注类别和偏移量,<br>该函数将背景类别设为0，<br>并令从零开始的目标类别的整数索引自增1|返回三项：<br>1.(批量大小，锚框个数\*4)的各锚框偏移值，其中负类偏移值为0；<br>2.掩码（mask）变量，形状(批量大小，锚框个数\*4)，负类锚框置为0，正类锚框置为1；<br>3.各锚框的标注类别，形状(批量大小，锚框个数)|
|MultiBoxDetection()|1.各锚框预测概率(批量大小，含背景类别\*锚框数)<br>2.预测锚框偏移值(锚框数\*4)<br>3.锚框(批量大小，锚框数\*4)<br>4.阈值|构造预测结果|返回形状(批量大小，锚框个数，6)，<br>6为(从0开始的预测类别，预测边界框的置信度，坐标)|
### 生成多个锚框
```Python
from mxnet import image, contrib, gluon, nd
from matplotlib import pyplot as plt
import numpy as np
from IPython import display


# 矢量图显示
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


set_figsize()
img = image.imread('./img/catdog.jpg').asnumpy()
plt.imshow(img)
plt.show()

dog_bbox, cat_bbox = [60, 45, 378, 516], [400, 112, 655, 493]


def bbox_to_rect(bbox, color):
    # 将边界框（左上x，左上y，右下x，右下y）格式转换成matplotlib
    # ((左上x，左上y), 宽，高)
    return plt.Rectangle(
        xy=(bbox[0], bbox[1]), width=bbox[2] - bbox[0], height=bbox[3] - bbox[1],
        fill=False, edgecolor=color, linewidth=2)


fig = plt.imshow(img)
fig.axes.add_patch(bbox_to_rect(dog_bbox, 'blue'))
fig.axes.add_patch(bbox_to_rect(cat_bbox, 'red'))
plt.show()

np.set_printoptions(2)
h, w = img.shape[0:2]
print(h, w)
X = nd.random.uniform(shape=(1, 3, h, w))
Y = contrib.nd.MultiBoxPrior(X, sizes=[0.75, 0.5, 0.25], ratios=[1, 2, 0.5])
print(Y.shape)

boxes = Y.reshape((h, w, 5, 4))
print(boxes[250, 250, 0, :])


def show_bboxes(axes, bboxes, labels=None, colors=None):
    def _make_list(obj, default_values=None):
        if obj is None:
            obj = default_values
        elif not isinstance(obj, (list, tuple)):
            obj = [obj]
        return obj

    labels = _make_list(labels)
    colors = _make_list(colors, ['b', 'g', 'r', 'm', 'c'])
    for i, bbox in enumerate(bboxes):
        color = colors[i % len(colors)]
        rect = bbox_to_rect(bbox.asnumpy(), color)
        axes.add_patch(rect)
        if labels and len(labels) > i:
            text_color = 'k' if color == 'w' else 'w'
            axes.text(rect.xy[0], rect.xy[1], labels[i],
                      va='center', ha='center', fontsize=9, color=text_color,
                      bbox=dict(facecolor=color, lw=0))
    plt.show()


bbox_scale = nd.array((w, h, w, h))
fig = plt.imshow(img)
show_bboxes(fig.axes, boxes[250, 250, :, :] * bbox_scale,
            ['s=0.75, r=1', 's=0.5, r=1', 's=0.25, r=1', 's=0.75, r=2', 's=0.75, r=0.5'])

```
```Python
561 728
(1, 2042040, 4)

[0.06 0.07 0.63 0.82]
<NDArray 4 @cpu(0)>
```
### 标注训练集的锚框
```Python
from mxnet import image, contrib, gluon, nd
from matplotlib import pyplot as plt
import numpy as np
from IPython import display


# 矢量图显示
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def bbox_to_rect(bbox, color):
    # 将边界框（左上x，左上y，右下x，右下y）格式转换成matplotlib
    # ((左上x，左上y), 宽，高)
    return plt.Rectangle(
        xy=(bbox[0], bbox[1]), width=bbox[2] - bbox[0], height=bbox[3] - bbox[1],
        fill=False, edgecolor=color, linewidth=2)


def show_bboxes(axes, bboxes, labels=None, colors=None):
    def _make_list(obj, default_values=None):
        if obj is None:
            obj = default_values
        elif not isinstance(obj, (list, tuple)):
            obj = [obj]
        return obj

    labels = _make_list(labels)
    colors = _make_list(colors, ['b', 'g', 'r', 'm', 'c'])
    for i, bbox in enumerate(bboxes):
        color = colors[i % len(colors)]
        rect = bbox_to_rect(bbox.asnumpy(), color)
        axes.add_patch(rect)
        if labels and len(labels) > i:
            text_color = 'k' if color == 'w' else 'w'
            axes.text(rect.xy[0], rect.xy[1], labels[i],
                      va='center', ha='center', fontsize=9, color=text_color,
                      bbox=dict(facecolor=color, lw=0))


ground_truth = nd.array([[0, 0.1, 0.08, 0.52, 0.92],
                         [1, 0.55, 0.2, 0.9, 0.88]])
anchors = nd.array([[0, 0.1, 0.2, 0.3],
                    [0.15, 0.2, 0.4, 0.4],
                    [0.63, 0.05, 0.88, 0.98],
                    [0.66, 0.45, 0.8, 0.8],
                    [0.57, 0.3, 0.92, 0.9]])
set_figsize()
img = image.imread('./img/catdog.jpg').asnumpy()
fig = plt.imshow(img)
np.set_printoptions(2)
h, w = img.shape[0:2]
bbox_scale = nd.array((w, h, w, h))
show_bboxes(fig.axes, ground_truth[:, 1:] * bbox_scale, ['dog', 'cat'], 'k')
show_bboxes(fig.axes, anchors * bbox_scale, ['0', '1', '2', '3', '4'])
plt.show()
labels = contrib.nd.MultiBoxTarget(anchors.expand_dims(axis=0),
                                   ground_truth.expand_dims(axis=0),
                                   nd.zeros((1, 3, 5)))
print(labels[0], labels[1], labels[2])
```
```Python
[[ 0.00e+00  0.00e+00  0.00e+00  0.00e+00  1.40e+00  1.00e+01  2.59e+00
   7.18e+00 -1.20e+00  2.69e-01  1.68e+00 -1.57e+00  0.00e+00  0.00e+00
   0.00e+00  0.00e+00 -5.71e-01 -1.00e+00 -8.94e-07  6.26e-01]]
<NDArray 1x20 @cpu(0)>
[[0. 0. 0. 0. 1. 1. 1. 1. 1. 1. 1. 1. 0. 0. 0. 0. 1. 1. 1. 1.]]
<NDArray 1x20 @cpu(0)>
[[0. 1. 2. 0. 2.]]
<NDArray 1x5 @cpu(0)>
```
### 输出预测边界框
```Python
from mxnet import image, contrib, gluon, nd
from matplotlib import pyplot as plt
import numpy as np
from IPython import display


# 矢量图显示
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def bbox_to_rect(bbox, color):
    # 将边界框（左上x，左上y，右下x，右下y）格式转换成matplotlib
    # ((左上x，左上y), 宽，高)
    return plt.Rectangle(
        xy=(bbox[0], bbox[1]), width=bbox[2] - bbox[0], height=bbox[3] - bbox[1],
        fill=False, edgecolor=color, linewidth=2)


def show_bboxes(axes, bboxes, labels=None, colors=None):
    def _make_list(obj, default_values=None):
        if obj is None:
            obj = default_values
        elif not isinstance(obj, (list, tuple)):
            obj = [obj]
        return obj

    labels = _make_list(labels)
    colors = _make_list(colors, ['b', 'g', 'r', 'm', 'c'])
    for i, bbox in enumerate(bboxes):
        color = colors[i % len(colors)]
        rect = bbox_to_rect(bbox.asnumpy(), color)
        axes.add_patch(rect)
        if labels and len(labels) > i:
            text_color = 'k' if color == 'w' else 'w'
            axes.text(rect.xy[0], rect.xy[1], labels[i],
                      va='center', ha='center', fontsize=9, color=text_color,
                      bbox=dict(facecolor=color, lw=0))


ground_truth = nd.array([[0, 0.1, 0.08, 0.52, 0.92],
                         [1, 0.55, 0.2, 0.9, 0.88]])
anchors = nd.array([[0, 0.1, 0.2, 0.3],
                    [0.15, 0.2, 0.4, 0.4],
                    [0.63, 0.05, 0.88, 0.98],
                    [0.66, 0.45, 0.8, 0.8],
                    [0.57, 0.3, 0.92, 0.9]])
set_figsize()
img = image.imread('./img/catdog.jpg').asnumpy()
fig = plt.imshow(img)
np.set_printoptions(2)
h, w = img.shape[0:2]
bbox_scale = nd.array((w, h, w, h))

anchors = nd.array([[0.1, 0.08, 0.52, 0.92],
                    [0.08, 0.2, 0.56, 0.95],
                    [0.15, 0.3, 0.62, 0.91],
                    [0.55, 0.2, 0.9, 0.88]])
offset_preds = nd.array([0] * anchors.size)
cls_probs = nd.array([[0] * 4,   # 背景的预测概率
                     [0.9, 0.8, 0.7, 0.1],  # 狗的预测概率
                     [0.1, 0.2, 0.3, 0.9]])  # 猫的预测概率

show_bboxes(fig.axes, anchors * bbox_scale, ['dog=0.9', 'dog=0.8', 'dog=0.7', 'cat=0.9'])
plt.show()

output = contrib.nd.MultiBoxDetection(
    cls_probs.expand_dims(axis=0),
    offset_preds.expand_dims(axis=0),
    anchors.expand_dims(axis=0),
    nms_threshold=0.5)
print(output)
fig = plt.imshow(img)
for i in output[0].asnumpy():
    if i[0] == -1:
        continue
    label = ('dog=', 'cat=')[int(i[0])] + str(i[1])
    show_bboxes(fig.axes, [nd.array(i[2:]) * bbox_scale], label)

plt.show()

```
```Python
[[[ 0.    0.9   0.1   0.08  0.52  0.92]
  [ 1.    0.9   0.55  0.2   0.9   0.88]
  [-1.    0.8   0.08  0.2   0.56  0.95]
  [-1.    0.7   0.15  0.3   0.62  0.91]]]
<NDArray 1x4x6 @cpu(0)>
```
## 多尺度目标检测
```Python
from mxnet import image, contrib, gluon, nd
from matplotlib import pyplot as plt
import numpy as np
from IPython import display


# 矢量图显示
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def bbox_to_rect(bbox, color):
    # 将边界框（左上x，左上y，右下x，右下y）格式转换成matplotlib
    # ((左上x，左上y), 宽，高)
    return plt.Rectangle(
        xy=(bbox[0], bbox[1]), width=bbox[2] - bbox[0], height=bbox[3] - bbox[1],
        fill=False, edgecolor=color, linewidth=2)


def show_bboxes(axes, bboxes, labels=None, colors=None):
    def _make_list(obj, default_values=None):
        if obj is None:
            obj = default_values
        elif not isinstance(obj, (list, tuple)):
            obj = [obj]
        return obj

    labels = _make_list(labels)
    colors = _make_list(colors, ['b', 'g', 'r', 'm', 'c'])
    for i, bbox in enumerate(bboxes):
        color = colors[i % len(colors)]
        rect = bbox_to_rect(bbox.asnumpy(), color)
        axes.add_patch(rect)
        if labels and len(labels) > i:
            text_color = 'k' if color == 'w' else 'w'
            axes.text(rect.xy[0], rect.xy[1], labels[i],
                      va='center', ha='center', fontsize=9, color=text_color,
                      bbox=dict(facecolor=color, lw=0))
    plt.show()


set_figsize()
img = image.imread('./img/catdog.jpg')
h, w = img.shape[0:2]
print(h, w)


def display_anchors(fmap_w, fmap_h, s):
    fmap = nd.zeros((1, 10, fmap_w, fmap_h))
    anchors = contrib.nd.MultiBoxPrior(fmap, sizes=s, ratios=[1, 2, 0.5])
    bbox_scale = nd.array((w, h, w, h))
    show_bboxes(plt.imshow(img.asnumpy()).axes, anchors[0] * bbox_scale)


display_anchors(fmap_w=4, fmap_h=4, s=[0.15])
display_anchors(fmap_w=2, fmap_h=2, s=[0.4])
display_anchors(fmap_w=1, fmap_h=1, s=[0.8])

```
## 目标检测数据集（皮卡丘）

**疑问**
有个疑问：
标签形状为(批量，m，5），5的第一个元素代表类别，而文中提到-1代表填充非法边界框
而我在测试MultiBoxTarget是否会自动忽略这种非法边界框的时候报错:
```
Traceback (most recent call last):
  File "D:/PythonProject/test.py", line 67, in <module>
    print(labels[0], labels[1], labels[2])
  File "D:\Anaconda3\lib\site-packages\mxnet\ndarray\ndarray.py", line 194, in __repr__
    return '\n%s\n<%s %s @%s>' % (str(self.asnumpy()),
  File "D:\Anaconda3\lib\site-packages\mxnet\ndarray\ndarray.py", line 1996, in asnumpy
    ctypes.c_size_t(data.size)))
  File "D:\Anaconda3\lib\site-packages\mxnet\base.py", line 253, in check_call
    raise MXNetError(py_str(_LIB.MXGetLastError()))
mxnet.base.MXNetError: [15:51:31] C:\Jenkins\workspace\mxnet-tag\mxnet\src\operator\contrib\multibox_target.cc:97: Check failed: static_cast<float>(*(p_label + i * label_width + 1)) == -1.0f (0.35 vs. -1) :
```
完整代码（之前那个标注边界框小改动的得到的）：
```python
from mxnet import image, contrib, gluon, nd
from matplotlib import pyplot as plt
import numpy as np
from IPython import display


# 矢量图显示
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def bbox_to_rect(bbox, color):
    # 将边界框（左上x，左上y，右下x，右下y）格式转换成matplotlib
    # ((左上x，左上y), 宽，高)
    return plt.Rectangle(
        xy=(bbox[0], bbox[1]), width=bbox[2] - bbox[0], height=bbox[3] - bbox[1],
        fill=False, edgecolor=color, linewidth=2)


def show_bboxes(axes, bboxes, labels=None, colors=None):
    def _make_list(obj, default_values=None):
        if obj is None:
            obj = default_values
        elif not isinstance(obj, (list, tuple)):
            obj = [obj]
        return obj

    labels = _make_list(labels)
    colors = _make_list(colors, ['b', 'g', 'r', 'm', 'c'])
    for i, bbox in enumerate(bboxes):
        color = colors[i % len(colors)]
        rect = bbox_to_rect(bbox.asnumpy(), color)
        axes.add_patch(rect)
        if labels and len(labels) > i:
            text_color = 'k' if color == 'w' else 'w'
            axes.text(rect.xy[0], rect.xy[1], labels[i],
                      va='center', ha='center', fontsize=9, color=text_color,
                      bbox=dict(facecolor=color, lw=0))


ground_truth = nd.array([[0, 0.1, 0.08, 0.52, 0.92],
                         [-1, 0.35, 0.4, 0.7, 0.78],
                         [1, 0.55, 0.2, 0.9, 0.88]])
anchors = nd.array([[0, 0.1, 0.2, 0.3],
                    [0.15, 0.2, 0.4, 0.4],
                    [0.63, 0.05, 0.88, 0.98],
                    [0.66, 0.45, 0.8, 0.8],
                    [0.57, 0.3, 0.92, 0.9]])
set_figsize()
img = image.imread('./img/catdog.jpg').asnumpy()
fig = plt.imshow(img)
np.set_printoptions(2)
h, w = img.shape[0:2]
bbox_scale = nd.array((w, h, w, h))
show_bboxes(fig.axes, ground_truth[:, 1:] * bbox_scale, ['dog', 'illegal', 'cat'], 'k')
show_bboxes(fig.axes, anchors * bbox_scale, ['0', '1', '2', '3', '4'])
plt.show()
labels = contrib.nd.MultiBoxTarget(anchors.expand_dims(axis=0),
                                   ground_truth.expand_dims(axis=0),
                                   nd.zeros((1, 4, 5))，
                                   ignore_label=-1)
print(labels[0], labels[1], labels[2])

```
所以想知道这里如何处理真实边框数组中的非法边界框
正在等待回复
```Python
from mxnet import image, contrib, gluon, nd
from matplotlib import pyplot as plt
import numpy as np
from mxnet.gluon import utils as gutils
from IPython import display
import os


# 矢量图显示
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


def bbox_to_rect(bbox, color):
    # 将边界框（左上x，左上y，右下x，右下y）格式转换成matplotlib
    # ((左上x，左上y), 宽，高)
    return plt.Rectangle(
        xy=(bbox[0], bbox[1]), width=bbox[2] - bbox[0], height=bbox[3] - bbox[1],
        fill=False, edgecolor=color, linewidth=2)


def show_bboxes(axes, bboxes, labels=None, colors=None):
    def _make_list(obj, default_values=None):
        if obj is None:
            obj = default_values
        elif not isinstance(obj, (list, tuple)):
            obj = [obj]
        return obj

    labels = _make_list(labels)
    colors = _make_list(colors, ['b', 'g', 'r', 'm', 'c'])
    for i, bbox in enumerate(bboxes):
        color = colors[i % len(colors)]
        rect = bbox_to_rect(bbox.asnumpy(), color)
        axes.add_patch(rect)
        if labels and len(labels) > i:
            text_color = 'k' if color == 'w' else 'w'
            axes.text(rect.xy[0], rect.xy[1], labels[i],
                      va='center', ha='center', fontsize=9, color=text_color,
                      bbox=dict(facecolor=color, lw=0))


def show_images(imgs, num_rows, num_cols, scale=2.0):
    figsize = (num_cols * scale, num_rows * scale)
    _, axes = plt.subplots(num_rows, num_cols, figsize=figsize)
    for i in range(num_rows):
        for j in range(num_cols):
            axes[i][j].imshow(imgs[i * num_cols + j].asnumpy())
            axes[i][j].axes.get_xaxis().set_visible(False)
            axes[i][j].axes.get_yaxis().set_visible(False)
    return axes


def _download_pickachu(data_dir):
    root_url = ('https://apache-mxnet.s3-accelerate.amazonaws.com/'
                'gluon/dataset/pikachu/')
    dataset = {'train.rec': 'e6bcb6ffba1ac04ff8a9b1115e650af56ee969c8',
               'train.idx': 'dcf7318b2602c06428b9988470c731621716c393',
               'val.rec': 'd6c33f799b4d058e82f2cb5bd9a976f69d72d520'}
    for k, v in dataset.items():
        gutils.download(root_url + k, os.path.join(data_dir, k), sha1_hash=v)


def load_data_pikachu(batch_size, edge_size=256):   # edge_size: 输出图像的宽和高
    data_dir = './mxnet/datasets/pikachu'
    _download_pickachu(data_dir)
    train_iter = image.ImageDetIter(
        path_imgrec=os.path.join(data_dir, 'train.rec'),
        path_imgidx=os.path.join(data_dir, 'train.idx'),
        batch_size=batch_size,
        data_shape=(3, edge_size, edge_size),
        shuffle=True,
        rand_crop=1,   # 随机裁剪概率为1
        min_object_covered=0.95,
        max_attempts=200
    )
    val_iter = image.ImageDetIter(
        path_imgrec=os.path.join(data_dir, 'val.rec'),
        batch_size=batch_size,
        data_shape=(3, edge_size, edge_size),
        shuffle=False
    )
    return train_iter, val_iter


batch_size, edge_size = 32, 256
train_iter, _ = load_data_pikachu(batch_size, edge_size)
batch = train_iter.next()
print(batch.data[0].shape, batch.label[0].shape)

imgs = (batch.data[0][0:10].transpose((0, 2, 3, 1))) / 255
axes = show_images(imgs, 2, 5).flatten()
print(axes)
for ax, label in zip(axes, batch.label[0][0:10]):
    show_bboxes(ax, [label[0][1:5] * edge_size], colors=['w'])

plt.show()

```
## 单发多框检测（SSD)
### 模型训练
```Python
from mxnet import image, contrib, gluon, nd, autograd, init
from mxnet.gluon import loss as gloss, nn, utils as gutils
import mxnet as mx
import time
import os


# 类别预测层
def cls_predictor(num_anchors, num_classes):
    return nn.Conv2D(num_anchors * (num_classes + 1), kernel_size=3, padding=1)


# 边界框预测层
def bbox_predictor(num_anchors):
    return nn.Conv2D(num_anchors * 4, kernel_size=3, padding=1)


def forward(x, block):
    block.initialize()
    return block(x)


Y1 = forward(nd.zeros((2, 8, 20, 20)), cls_predictor(5, 10))
Y2 = forward(nd.zeros((2, 16, 10, 10)), cls_predictor(3, 10))
print(Y1.shape, Y2.shape)


def flatten_pred(pred):
    # 将通道维转到最后，即(0,1,2,3)转到(0,2,3,1)
    # 最后转成二维
    return pred.transpose((0, 2, 3, 1)).flatten()


def concat_preds(preds):
    return nd.concat(*[flatten_pred(p) for p in preds], dim=1)


print(concat_preds([Y1, Y2]).shape)


def down_sample_blk(num_channels):
    blk = nn.Sequential()
    for _ in range(2):
        blk.add(nn.Conv2D(num_channels, kernel_size=3, padding=1),
                nn.BatchNorm(in_channels=num_channels),
                nn.Activation('relu'))
    blk.add(nn.MaxPool2D(2))
    return blk


def base_net():
    blk = nn.Sequential()
    for num_filters in [16, 32, 64]:
        blk.add(down_sample_blk(num_filters))
    return blk


X = forward(nd.zeros((2, 3, 256, 256)), base_net())
print(X.shape)


def get_blk(i):
    if i == 0:
        blk = base_net()
    elif i == 4:
        blk = nn.GlobalAvgPool2D()
    else:
        blk = down_sample_blk(128)
    return blk


def blk_forward(X, blk, size, ratio, cls_predictor, bbox_predictor):
    Y = blk(X)
    anchors = contrib.nd.MultiBoxPrior(Y, sizes=size, ratios=ratio)
    cls_preds = cls_predictor(Y)
    bbox_preds = bbox_predictor(Y)
    return Y, anchors, cls_preds, bbox_preds


sizes = [[0.2, 0.272], [0.37, 0.447], [0.54, 0.619], [0.71, 0.79], [0.88, 0.961]]
ratios = [[1, 2, 0.5]] * 5
num_anchors = len(sizes[0]) + len(ratios[0]) - 1


class TinySSD(nn.Block):
    def __init__(self, num_classes, **kwargs):
        super(TinySSD, self).__init__(**kwargs)
        self.num_classes = num_classes
        for i in range(5):
            # 即赋值语句self.blk_i = get_blk(i)
            setattr(self, 'blk_%d' % i, get_blk(i))
            setattr(self, 'cls_%d' % i, cls_predictor(num_anchors, num_classes))
            setattr(self, 'bbox_%d' % i, bbox_predictor(num_anchors))

    def forward(self, X):
        anchors, cls_preds, bbox_preds = [None] * 5, [None] * 5, [None] * 5
        for i in range(5):
            # getattr(self, 'blk_%d' % i) 即访问self.blk_i
            X, anchors[i], cls_preds[i], bbox_preds[i] = blk_forward(
                X,
                getattr(self, 'blk_%d' % i),
                sizes[i],
                ratios[i],
                getattr(self, 'cls_%d' % i),
                getattr(self, 'bbox_%d' % i))
        # reshape函数中的θ表示保持批量大小不变
        return nd.concat(*anchors, dim=1), \
               concat_preds(cls_preds).reshape((0, -1, self.num_classes + 1)), \
               concat_preds(bbox_preds)


net = TinySSD(num_classes=1)
net.initialize()
X = nd.zeros((32, 3, 256, 256))
anchors, cls_preds, bbox_preds = net(X)

print('output anchors:', anchors.shape)
print('output class preds:', cls_preds.shape)
print('output bbox preds:', bbox_preds.shape)


def _download_pickachu(data_dir):
    root_url = ('https://apache-mxnet.s3-accelerate.amazonaws.com/'
                'gluon/dataset/pikachu/')
    dataset = {'train.rec': 'e6bcb6ffba1ac04ff8a9b1115e650af56ee969c8',
               'train.idx': 'dcf7318b2602c06428b9988470c731621716c393',
               'val.rec': 'd6c33f799b4d058e82f2cb5bd9a976f69d72d520'}
    for k, v in dataset.items():
        gutils.download(root_url + k, os.path.join(data_dir, k), sha1_hash=v)


def load_data_pikachu(batch_size, edge_size=256):  # edge_size: 输出图像的宽和高
    data_dir = './mxnet/datasets/pikachu'
    _download_pickachu(data_dir)
    train_iter = image.ImageDetIter(
        path_imgrec=os.path.join(data_dir, 'train.rec'),
        path_imgidx=os.path.join(data_dir, 'train.idx'),
        batch_size=batch_size,
        data_shape=(3, edge_size, edge_size),
        shuffle=True,
        rand_crop=1,  # 随机裁剪概率为1
        min_object_covered=0.95,
        max_attempts=200
    )
    val_iter = image.ImageDetIter(
        path_imgrec=os.path.join(data_dir, 'val.rec'),
        batch_size=batch_size,
        data_shape=(3, edge_size, edge_size),
        shuffle=False
    )
    return train_iter, val_iter


def try_gpu():
    try:
        ctx = mx.gpu()
        _ = nd.zeros((1,), ctx=ctx)
    except mx.base.MXNetError:
        ctx = mx.cpu()
    return ctx


# 训练模型
batch_size = 32
train_iter, _ = load_data_pikachu(batch_size)
ctx, net = try_gpu(), TinySSD(num_classes=1)
net.initialize(init=init.Xavier(), ctx=ctx)
trainer = gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': 0.2, 'wd': 5e-4})
cls_loss = gloss.SoftmaxCrossEntropyLoss()
bbox_loss = gloss.L1Loss()


def calc_loss(cls_preds, cls_labels, bbox_preds, bbox_labels, bbox_masks):
    cls = cls_loss(cls_preds, cls_labels)
    bbox = bbox_loss(bbox_preds, bbox_labels)
    return cls + bbox


def cls_eval(cls_preds, cls_labels):
    # 由于类别预测结果放在最后一维，argmax需要指定最后一维
    return (cls_preds.argmax(axis=-1) == cls_labels).sum().asscalar()


def bbox_eval(bbox_preds, bbox_labels, bbox_masks):
    return ((bbox_labels - bbox_preds) * bbox_masks).abs().sum().asscalar()


for epoch in range(200):
    acc_sum, mae_sum, n, m = 0.0, 0.0, 0, 0
    train_iter.reset()  # 从头读取数据
    start = time.time()
    for i, batch in enumerate(train_iter):
        X = batch.data[0].as_in_context(ctx)
        Y = batch.label[0].as_in_context(ctx)
        with autograd.record():
            # 生成多尺度的锚框，为每个锚框预测类别和偏移量
            anchors, cls_preds, bbox_preds = net(X)
            # 为每个锚框标注类别和偏移量
            bbox_labels, bbox_masks, cls_labels = \
                contrib.nd.MultiBoxTarget(anchors, Y, cls_preds.transpose((0, 2, 1)))
            if epoch == 0 and i == 0:
                print('anchors shape:', anchors.shape)
                print('cls_preds shape:', cls_preds.shape)
                print('bbox_preds shape:', bbox_preds.shape)
                print('bbox_labels shape:', bbox_labels.shape)
                print('bbox_masks shape:', bbox_masks.shape)
                print('cls_labels shape:', cls_labels.shape)
            # 根据类别和偏移量的预测和标注值计算损失函数
            l = calc_loss(cls_preds, cls_labels, bbox_preds, bbox_labels, bbox_masks)
        l.backward()
        trainer.step(batch_size)
        acc_sum += cls_eval(cls_preds, cls_labels)
        n += cls_labels.size
        mae_sum += bbox_eval(bbox_preds, bbox_labels, bbox_masks)
        m += bbox_labels.size
    if (epoch + 1) % 5 == 0:
        print('epoch %2d, class err %.2e, bbox mae %.2e, time %.1f sec'
              % (epoch + 1, 1 - acc_sum / n, mae_sum / m, time.time() - start))

filename = 'object_detection.params'
net.save_parameters(filename)

```
```Python
(2, 55, 20, 20) (2, 33, 10, 10)
(2, 25300)
(2, 64, 32, 32)
output anchors: (1, 5444, 4)
output class preds: (32, 5444, 2)
output bbox preds: (32, 21776)

anchors shape: (1, 5444, 4)
cls_preds shape: (128, 5444, 2)
bbox_preds shape: (128, 21776)
bbox_labels shape: (128, 21776)
bbox_masks shape: (128, 21776)
cls_labels shape: (128, 5444)

epoch  5, class err 3.65e-03, bbox mae 3.46e-03, time 18.1 sec
epoch 10, class err 3.48e-03, bbox mae 3.41e-03, time 18.0 sec
epoch 15, class err 3.33e-03, bbox mae 3.35e-03, time 21.8 sec
epoch 20, class err 3.36e-03, bbox mae 3.44e-03, time 17.4 sec
epoch 25, class err 3.32e-03, bbox mae 3.50e-03, time 17.2 sec
epoch 30, class err 3.20e-03, bbox mae 3.41e-03, time 19.1 sec
epoch 35, class err 3.23e-03, bbox mae 3.44e-03, time 11.6 sec
epoch 40, class err 3.13e-03, bbox mae 3.36e-03, time 12.1 sec
epoch 45, class err 3.25e-03, bbox mae 3.48e-03, time 11.6 sec
epoch 50, class err 3.14e-03, bbox mae 3.37e-03, time 11.7 sec
epoch 55, class err 3.25e-03, bbox mae 3.51e-03, time 11.7 sec
epoch 60, class err 3.17e-03, bbox mae 3.40e-03, time 11.9 sec
epoch 65, class err 3.20e-03, bbox mae 3.47e-03, time 11.3 sec
epoch 70, class err 3.30e-03, bbox mae 3.58e-03, time 11.7 sec
epoch 75, class err 3.08e-03, bbox mae 3.31e-03, time 11.8 sec
epoch 80, class err 3.10e-03, bbox mae 3.33e-03, time 11.9 sec
epoch 85, class err 3.19e-03, bbox mae 3.44e-03, time 11.7 sec
epoch 90, class err 3.24e-03, bbox mae 3.48e-03, time 11.7 sec
epoch 95, class err 3.30e-03, bbox mae 3.58e-03, time 11.7 sec
epoch 100, class err 3.23e-03, bbox mae 3.49e-03, time 11.6 sec
epoch 105, class err 3.23e-03, bbox mae 3.49e-03, time 11.7 sec
epoch 110, class err 3.12e-03, bbox mae 3.38e-03, time 11.5 sec
epoch 115, class err 3.18e-03, bbox mae 3.43e-03, time 11.6 sec
epoch 120, class err 3.16e-03, bbox mae 3.41e-03, time 11.7 sec
epoch 125, class err 3.10e-03, bbox mae 3.36e-03, time 11.4 sec
epoch 130, class err 3.25e-03, bbox mae 3.52e-03, time 11.3 sec
epoch 135, class err 3.19e-03, bbox mae 3.43e-03, time 11.6 sec
epoch 140, class err 3.14e-03, bbox mae 3.39e-03, time 11.8 sec
epoch 145, class err 3.18e-03, bbox mae 3.43e-03, time 11.5 sec
epoch 150, class err 3.15e-03, bbox mae 3.40e-03, time 11.5 sec
epoch 155, class err 3.18e-03, bbox mae 3.45e-03, time 11.8 sec
epoch 160, class err 3.17e-03, bbox mae 3.43e-03, time 11.9 sec
epoch 165, class err 3.26e-03, bbox mae 3.52e-03, time 11.8 sec
epoch 170, class err 3.21e-03, bbox mae 3.47e-03, time 11.8 sec
epoch 175, class err 3.30e-03, bbox mae 3.57e-03, time 11.7 sec
epoch 180, class err 3.21e-03, bbox mae 3.47e-03, time 11.7 sec
epoch 185, class err 3.24e-03, bbox mae 3.50e-03, time 11.8 sec
epoch 190, class err 3.22e-03, bbox mae 3.49e-03, time 11.4 sec
epoch 195, class err 3.15e-03, bbox mae 3.40e-03, time 11.5 sec
epoch 200, class err 3.17e-03, bbox mae 3.42e-03, time 11.8 sec

```
### 预测
```Python
from mxnet import image, contrib, gluon, nd, autograd, init
from mxnet.gluon import loss as gloss, nn, utils as gutils
from matplotlib import pyplot as plt
import mxnet as mx
from IPython import display
import time
import os


# 类别预测层
def cls_predictor(num_anchors, num_classes):
    return nn.Conv2D(num_anchors * (num_classes + 1), kernel_size=3, padding=1)


# 边界框预测层
def bbox_predictor(num_anchors):
    return nn.Conv2D(num_anchors * 4, kernel_size=3, padding=1)


def flatten_pred(pred):
    return pred.transpose((0, 2, 3, 1)).flatten()


def concat_preds(preds):
    return nd.concat(*[flatten_pred(p) for p in preds], dim=1)


def down_sample_blk(num_channels):
    blk = nn.Sequential()
    for _ in range(2):
        blk.add(nn.Conv2D(num_channels, kernel_size=3, padding=1),
                nn.BatchNorm(in_channels=num_channels),
                nn.Activation('relu'))
    blk.add(nn.MaxPool2D(2))
    return blk


def base_net():
    blk = nn.Sequential()
    for num_filters in [16, 32, 64]:
        blk.add(down_sample_blk(num_filters))
    return blk


def get_blk(i):
    if i == 0:
        blk = base_net()
    elif i == 4:
        blk = nn.GlobalAvgPool2D()
    else:
        blk = down_sample_blk(128)
    return blk


def blk_forward(X, blk, size, ratio, cls_predictor, bbox_predictor):
    Y = blk(X)
    anchors = contrib.nd.MultiBoxPrior(Y, sizes=size, ratios=ratio)
    cls_preds = cls_predictor(Y)
    bbox_preds = bbox_predictor(Y)
    return Y, anchors, cls_preds, bbox_preds


sizes = [[0.2, 0.272], [0.37, 0.447], [0.54, 0.619], [0.71, 0.79], [0.88, 0.961]]
ratios = [[1, 2, 0.5]] * 5
num_anchors = len(sizes[0]) + len(ratios[0]) - 1


class TinySSD(nn.Block):
    def __init__(self, num_classes, **kwargs):
        super(TinySSD, self).__init__(**kwargs)
        self.num_classes = num_classes
        for i in range(5):
            # 即赋值语句self.blk_i = get_blk(i)
            setattr(self, 'blk_%d' % i, get_blk(i))
            setattr(self, 'cls_%d' % i, cls_predictor(num_anchors, num_classes))
            setattr(self, 'bbox_%d' % i, bbox_predictor(num_anchors))

    def forward(self, X):
        anchors, cls_preds, bbox_preds = [None] * 5, [None] * 5, [None] * 5
        for i in range(5):
            # getattr(self, 'blk_%d' % i) 即访问self.blk_i
            X, anchors[i], cls_preds[i], bbox_preds[i] = blk_forward(
                X,
                getattr(self, 'blk_%d' % i),
                sizes[i],
                ratios[i],
                getattr(self, 'cls_%d' % i),
                getattr(self, 'bbox_%d' % i))
        # reshape函数中的θ表示保持批量大小不变
        return nd.concat(*anchors, dim=1), \
               concat_preds(cls_preds).reshape((0, -1, self.num_classes + 1)), \
               concat_preds(bbox_preds)


net = TinySSD(num_classes=1)
net.load_parameters('object_detection.params')
img = image.imread('./img/pikachu.jpg')
feature = image.imresize(img, 256, 256).astype('float32')
X = feature.transpose((2, 0, 1)).expand_dims(axis=0)


def predict(X):
    anchors, cls_preds, bbox_preds = net(X.as_in_context(mx.cpu()))
    cls_probs = cls_preds.softmax().transpose((0, 2, 1))
    output = contrib.nd.MultiBoxDetection(cls_probs, bbox_preds, anchors)
    print(output)
    idx = [i for i, row in enumerate(output[0]) if row[0].asscalar() != -1]
    return output[0, idx]


output = predict(X)


# 矢量图显示
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


set_figsize((5, 5))


def bbox_to_rect(bbox, color):
    # 将边界框（左上x，左上y，右下x，右下y）格式转换成matplotlib
    # ((左上x，左上y), 宽，高)
    return plt.Rectangle(
        xy=(bbox[0], bbox[1]), width=bbox[2] - bbox[0], height=bbox[3] - bbox[1],
        fill=False, edgecolor=color, linewidth=2)


def show_bboxes(axes, bboxes, labels=None, colors=None):
    def _make_list(obj, default_values=None):
        if obj is None:
            obj = default_values
        elif not isinstance(obj, (list, tuple)):
            obj = [obj]
        return obj

    labels = _make_list(labels)
    colors = _make_list(colors, ['b', 'g', 'r', 'm', 'c'])
    for i, bbox in enumerate(bboxes):
        color = colors[i % len(colors)]
        rect = bbox_to_rect(bbox.asnumpy(), color)
        axes.add_patch(rect)
        if labels and len(labels) > i:
            text_color = 'k' if color == 'w' else 'w'
            axes.text(rect.xy[0], rect.xy[1], labels[i],
                      va='center', ha='center', fontsize=9, color=text_color,
                      bbox=dict(facecolor=color, lw=0))


def display_img(img, output, threshold):
    fig = plt.imshow(img.asnumpy())
    for row in output:
        score = row[1].asscalar()
        if score < threshold:
            continue
        h, w = img.shape[0:2]
        bbox = [row[2:6] * nd.array((w, h, w, h), ctx=row.context)]
        show_bboxes(fig.axes, bbox, '%.2f' % score, 'w')
    plt.show()


display_img(img, output, threshold=0.3)

```
### 平滑L1范数损失（Smooth_l1)和焦点损失（Focal loss）
```Python
from mxnet import image, contrib, gluon, nd, autograd, init
from mxnet.gluon import loss as gloss, nn, utils as gutils
from matplotlib import pyplot as plt
import mxnet as mx
from IPython import display
import time
import os


# 矢量图显示
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


set_figsize()

sigmas = [10, 1, 0.5]
lines = ['-', '--', '-.']
x = nd.arange(-2, 2, 0.1)
for l, s in zip(lines, sigmas):
    y = nd.smooth_l1(x, scalar=s)
    plt.plot(x.asnumpy(), y.asnumpy(), l, label='sigma=%.1f' % s)
plt.legend()
plt.show()


def focal_loss(gamma, x):
    return -(1 - x) ** gamma * x.log()


x = nd.arange(0.01, 1, 0.01)
for l, gamma in zip(lines, [0, 1, 5]):
    y = plt.plot(x.asnumpy(), focal_loss(gamma, x).asnumpy(), l, label='gamma=%.1f' % gamma)
plt.legend()
plt.show()

```
## 区域卷积神经网络（R-CNN）系列
## R-CNN
## Fast R-CNN
```Python
from mxnet import nd

X = nd.arange(16).reshape((1, 1, 4, 4))
print(X)

# 注意横为x，纵为y
rois = nd.array([[0, 0, 0, 20, 20], [0, 0, 10, 30, 30]])
Y = nd.ROIPooling(X, rois, pooled_size=(2, 2), spatial_scale=0.1)
print(Y)

```
## Faster R-CNN

## 语义分割和数据集
```Python
from mxnet import gluon, image, nd
from mxnet.gluon import data as gdata, utils as gutils
import os
import sys
import tarfile
from matplotlib import pyplot as plt


def download_voc_pascal(data_dir='./mxnet/datasets/Pascal_VOC_2012'):
    voc_dir = os.path.join(data_dir, 'VOCdevkit/VOC2012')
    url = 'http://host.robots.ox.ac.uk/pascal/VOC/voc2012' \
          '/VOCtrainval_11-May-2012.tar'
    sha1 = '4e443f8a2eca6b1dac8a6c57641b67dd40621a49'
    fname = gutils.download(url, data_dir, sha1_hash=sha1)
    with tarfile.open(fname, 'r') as f:
        f.extractall(data_dir)
    return voc_dir


voc_dir = download_voc_pascal()


def read_voc_images(root=voc_dir, is_train=True):
    txt_fname = '%s/ImageSets/Segmentation/%s' % (root, 'train.txt' if is_train else 'val.txt')
    with open(txt_fname, 'r') as f:
        images = f.read().split()
    features, labels = [None] * len(images), [None] * len(images)
    for i, fname in enumerate(images):
        features[i] = image.imread('%s/JPEGImages/%s.jpg' % (root, fname))
        labels[i] = image.imread('%s/SegmentationClass/%s.png' % (root, fname))
    return features, labels


def show_images(imgs, num_rows, num_cols, scale=2.0):
    figsize = (num_cols * scale, num_rows * scale)
    _, axes = plt.subplots(num_rows, num_cols, figsize=figsize)
    for i in range(num_rows):
        for j in range(num_cols):
            axes[i][j].imshow(imgs[i * num_cols + j].asnumpy())
            axes[i][j].axes.get_xaxis().set_visible(False)
            axes[i][j].axes.get_yaxis().set_visible(False)
    return axes


train_features, train_labels = read_voc_images()

n = 5
imgs = train_features[0:n] + train_labels[0:n]
show_images(imgs, 2, n)
plt.show()
VOC_COLORMAP = [[0, 0, 0], [128, 0, 0], [0, 128, 0], [128, 128, 0],
                [0, 0, 128], [128, 0, 128], [0, 128, 128], [128, 128, 128],
                [64, 0, 0], [192, 0, 0], [64, 128, 0], [192, 128, 0],
                [64, 0, 128], [192, 0, 128], [64, 128, 128], [192, 128, 128],
                [0, 64, 0], [128, 64, 0], [0, 192, 0], [128, 192, 0],
                [0, 64, 128]]
VOC_CLASSES = ['background', 'aeroplane', 'bicycle', 'bird', 'boat',
               'bottle', 'bus', 'car', 'cat', 'chair', 'cow',
               'diningtable', 'dog', 'horse', 'motorbike', 'person',
               'potted plant', 'sheep', 'sofa', 'train', 'tv/monitor']

colormap2label = nd.zeros(256 ** 3)
for i, colormap in enumerate(VOC_COLORMAP):
    colormap2label[(colormap[0] * 256 + colormap[1]) * 256 + colormap[2]] = i


def voc_label_indices(colormap, colormap2label):
    colormap = colormap.astype('int32')
    # print('colormap', colormap.shape)
    idx = ((colormap[:, :, 0] * 256 + colormap[:, :, 1]) * 256 + colormap[:, :, 2])
    # print('idx:', idx)
    return colormap2label[idx]


y = voc_label_indices(train_labels[0], colormap2label)
print('y.shape:', y.shape)
print(y[105:115, 130:140], VOC_CLASSES[1])


def voc_rand_crop(feature, label, height, width):
    feature, rect = image.random_crop(feature, (width, height))
    label = image.fixed_crop(label, *rect)
    return feature, label


imgs = []
for _ in range(n):
    imgs += voc_rand_crop(train_features[0], train_labels[0], 200, 300)
show_images(imgs[::2] + imgs[1::2], 2, n)
plt.show()


class VOCSegDataset(gdata.Dataset):
    def __init__(self, is_train, crop_size, voc_dir, colormap2label):
        self.rgb_mean = nd.array([0.485, 0.456, 0.406])
        self.rgb_std = nd.array([0.229, 0.224, 0.225])
        self.crop_size = crop_size
        features, labels = read_voc_images(root=voc_dir, is_train=is_train)
        self.features = [self.normalize_image(feature) for feature in self.filter(features)]
        self.labels = self.filter(labels)
        self.colormap2label = colormap2label
        print('read ' + str(len(self.features)) + ' examples')

    def normalize_image(self, img):
        return (img.astype('float32') / 255 - self.rgb_mean) / self.rgb_std

    def filter(self, imgs):
        return [img for img in imgs if (
            img.shape[0] >= self.crop_size[0] and
            img.shape[1] >= self.crop_size[1])]

    def __getitem__(self, idx):
        feature, label = voc_rand_crop(self.features[idx], self.labels[idx], * self.crop_size)
        return feature.transpose((2, 0 ,1)), voc_label_indices(label, self.colormap2label)

    def __len__(self):
        return len(self.features)


crop_size = (320, 480)
voc_train = VOCSegDataset(True, crop_size, voc_dir, colormap2label)
voc_test = VOCSegDataset(False, crop_size, voc_dir, colormap2label)

batch_size = 64
num_workers = 0 if sys.platform.startswith('win') else 4
train_iter = gdata.DataLoader(voc_train, batch_size, shuffle=True, last_batch='discard', num_workers=num_workers)
test_iter = gdata.DataLoader(voc_test, batch_size, last_batch='discard', num_workers=num_workers)

for X, Y in train_iter:
    print(X.shape)
    print(Y.shape)
    break

```
```Python
y.shape: (281, 500)

[[0. 0. 0. 0. 0. 0. 0. 0. 0. 1.]
 [0. 0. 0. 0. 0. 0. 0. 1. 1. 1.]
 [0. 0. 0. 0. 0. 0. 1. 1. 1. 1.]
 [0. 0. 0. 0. 0. 1. 1. 1. 1. 1.]
 [0. 0. 0. 0. 0. 1. 1. 1. 1. 1.]
 [0. 0. 0. 0. 1. 1. 1. 1. 1. 1.]
 [0. 0. 0. 0. 0. 1. 1. 1. 1. 1.]
 [0. 0. 0. 0. 0. 1. 1. 1. 1. 1.]
 [0. 0. 0. 0. 0. 0. 1. 1. 1. 1.]
 [0. 0. 0. 0. 0. 0. 0. 0. 1. 1.]]
<NDArray 10x10 @cpu(0)> aeroplane
read 1114 examples
read 1078 examples
(64, 3, 320, 480)
(64, 320, 480)
```
## 全卷积层网络（FCN）
### 转置卷积层
```Python
from mxnet import gluon, image, init, nd
from mxnet.gluon import data as gdata, loss as gloss, model_zoo, nn
import numpy as np
import sys

X = nd.arange(1, 17).reshape((1, 1, 4, 4))
K = nd.arange(1, 10).reshape((1, 1, 3, 3))
print(X)
print(K)
conv = nn.Conv2D(channels=1, kernel_size=3)
conv.initialize(init.Constant(K))
print(conv(X), K)

W, k = nd.zeros((4, 16)), nd.zeros(11)
k[:3], k[4:7], k[8:] = K[0, 0, 0, :], K[0, 0, 1, :], K[0, 0, 2, :]
W[0, 0:11], W[1, 1:12], W[2, 4:15], W[3, 5:16] = k, k, k, k
print(nd.dot(W, X.reshape(16)).reshape((1, 1, 2, 2)), W)

conv = nn.Conv2D(10, kernel_size=4, padding=1, strides=2)
conv.initialize()
X = nd.random.uniform(shape=(1, 3, 64, 64))
Y = conv(X)
print(Y.shape)

conv_trans = nn.Conv2DTranspose(3, kernel_size=4, padding=1, strides=2)
conv_trans.initialize()
Z = conv_trans(Y)
print(Z.shape)

```
```Python
[[[[ 1.  2.  3.  4.]
   [ 5.  6.  7.  8.]
   [ 9. 10. 11. 12.]
   [13. 14. 15. 16.]]]]
<NDArray 1x1x4x4 @cpu(0)>

[[[[1. 2. 3.]
   [4. 5. 6.]
   [7. 8. 9.]]]]
<NDArray 1x1x3x3 @cpu(0)>

[[[[348. 393.]
   [528. 573.]]]]
<NDArray 1x1x2x2 @cpu(0)>
[[[[1. 2. 3.]
   [4. 5. 6.]
   [7. 8. 9.]]]]
<NDArray 1x1x3x3 @cpu(0)>

[[[[348. 393.]
   [528. 573.]]]]
<NDArray 1x1x2x2 @cpu(0)>
[[1. 2. 3. 0. 4. 5. 6. 0. 7. 8. 9. 0. 0. 0. 0. 0.]
 [0. 1. 2. 3. 0. 4. 5. 6. 0. 7. 8. 9. 0. 0. 0. 0.]
 [0. 0. 0. 0. 1. 2. 3. 0. 4. 5. 6. 0. 7. 8. 9. 0.]
 [0. 0. 0. 0. 0. 1. 2. 3. 0. 4. 5. 6. 0. 7. 8. 9.]]
<NDArray 4x16 @cpu(0)>
(1, 10, 32, 32)
(1, 3, 64, 64)
```
### 构造模型
```Python
from mxnet import gluon, image, init, nd
from mxnet.gluon import data as gdata, loss as gloss, model_zoo, nn
import numpy as np
from IPython import display
from matplotlib import pyplot as plt
import sys
import os

root = os.path.join('mxnet', 'models', 'resnet18_v2-a81db45f')
pretrained_net = model_zoo.vision.resnet18_v2(root=root, pretrained=True)
print(pretrained_net.features[-4:], pretrained_net.output)

net = nn.HybridSequential()
for layer in pretrained_net.features[:-2]:
    net.add(layer)

X = nd.random.uniform(shape=(1, 3, 320, 480))
print(net(X).shape)

num_classes = 21
net.add(nn.Conv2D(num_classes, kernel_size=1),
        nn.Conv2DTranspose(num_classes, kernel_size=64, padding=16, strides=32))


def bilinear_kernel(in_channels, out_channels, kernel_size):
    factor = (kernel_size + 1) // 2
    if kernel_size % 2 == 1:
        center = factor - 1
    else:
        center = factor - 0.5
    og = np.ogrid[:kernel_size, :kernel_size]
    print('og:', og)
    filt = (1 - abs(og[0] - center) / factor) * (1 - abs(og[1] - center) / factor)
    print('filt:', filt)
    weight = np.zeros((in_channels, out_channels, kernel_size, kernel_size), dtype='float32')
    weight[range(in_channels), range(out_channels), :, :] = filt
    # 类似对角矩阵
    print('weight:', nd.array(weight))
    return nd.array(weight)


conv_trans = nn.Conv2DTranspose(3, kernel_size=4, padding=1, strides=2)
conv_trans.initialize(init.Constant(bilinear_kernel(3, 3, 4)))

img = image.imread('./img/catdog.jpg')
X = img.astype('float32').transpose((2, 0, 1)).expand_dims(axis=0) / 255
Y = conv_trans(X)
print('Y shape:', Y.shape)
out_img = Y[0].transpose((1, 2, 0))


# 矢量图显示
def user_svg_display():
    display.set_matplotlib_formats('svg')


# 设置图的尺寸
def set_figsize(figsize=(3.5, 2.5)):
    user_svg_display()
    plt.rcParams['figure.figsize'] = figsize


set_figsize()
print('input image shape:', img.shape)
plt.imshow(img.asnumpy())
plt.show()
print('output image shape:', out_img.shape)
plt.imshow(out_img.asnumpy())
plt.show()

```
```Python
HybridSequential(
  (0): BatchNorm(axis=1, eps=1e-05, momentum=0.9, fix_gamma=False, use_global_stats=False, in_channels=512)
  (1): Activation(relu)
  (2): GlobalAvgPool2D(size=(1, 1), stride=(1, 1), padding=(0, 0), ceil_mode=True, global_pool=True, pool_type=avg, layout=NCHW)
  (3): Flatten
) Dense(512 -> 1000, linear)
(1, 512, 10, 15)
og: [array([[0],
       [1],
       [2],
       [3]]), array([[0, 1, 2, 3]])]
filt: [[0.0625 0.1875 0.1875 0.0625]
 [0.1875 0.5625 0.5625 0.1875]
 [0.1875 0.5625 0.5625 0.1875]
 [0.0625 0.1875 0.1875 0.0625]]
weight:
[[[[0.0625 0.1875 0.1875 0.0625]
   [0.1875 0.5625 0.5625 0.1875]
   [0.1875 0.5625 0.5625 0.1875]
   [0.0625 0.1875 0.1875 0.0625]]

  [[0.     0.     0.     0.    ]
   [0.     0.     0.     0.    ]
   [0.     0.     0.     0.    ]
   [0.     0.     0.     0.    ]]

  [[0.     0.     0.     0.    ]
   [0.     0.     0.     0.    ]
   [0.     0.     0.     0.    ]
   [0.     0.     0.     0.    ]]]


 [[[0.     0.     0.     0.    ]
   [0.     0.     0.     0.    ]
   [0.     0.     0.     0.    ]
   [0.     0.     0.     0.    ]]

  [[0.0625 0.1875 0.1875 0.0625]
   [0.1875 0.5625 0.5625 0.1875]
   [0.1875 0.5625 0.5625 0.1875]
   [0.0625 0.1875 0.1875 0.0625]]

  [[0.     0.     0.     0.    ]
   [0.     0.     0.     0.    ]
   [0.     0.     0.     0.    ]
   [0.     0.     0.     0.    ]]]


 [[[0.     0.     0.     0.    ]
   [0.     0.     0.     0.    ]
   [0.     0.     0.     0.    ]
   [0.     0.     0.     0.    ]]

  [[0.     0.     0.     0.    ]
   [0.     0.     0.     0.    ]
   [0.     0.     0.     0.    ]
   [0.     0.     0.     0.    ]]

  [[0.0625 0.1875 0.1875 0.0625]
   [0.1875 0.5625 0.5625 0.1875]
   [0.1875 0.5625 0.5625 0.1875]
   [0.0625 0.1875 0.1875 0.0625]]]]
<NDArray 3x3x4x4 @cpu(0)>
Y shape: (1, 3, 1122, 1456)
input image shape: (561, 728, 3)
output image shape: (1122, 1456, 3)
```
### 模型数据测试
```Python
from mxnet import gluon, image, init, nd, autograd
from mxnet.gluon import data as gdata, loss as gloss, model_zoo, nn, utils as gutils
import numpy as np
import mxnet as mx
import sys
import os
import tarfile
import time

root = os.path.join('mxnet', 'models', 'resnet18_v2-a81db45f')
pretrained_net = model_zoo.vision.resnet18_v2(root=root, pretrained=True)

net = nn.HybridSequential()
for layer in pretrained_net.features[:-2]:
    net.add(layer)

num_classes = 21
net.add(nn.Conv2D(num_classes, kernel_size=1),
        nn.Conv2DTranspose(num_classes, kernel_size=64, padding=16, strides=32))


def bilinear_kernel(in_channels, out_channels, kernel_size):
    factor = (kernel_size + 1) // 2
    if kernel_size % 2 == 1:
        center = factor - 1
    else:
        center = factor - 0.5
    og = np.ogrid[:kernel_size, :kernel_size]
    filt = (1 - abs(og[0] - center) / factor) * (1 - abs(og[1] - center) / factor)
    weight = np.zeros((in_channels, out_channels, kernel_size, kernel_size), dtype='float32')
    weight[range(in_channels), range(out_channels), :, :] = filt
    # 类似对角矩阵
    return nd.array(weight)


net[-1].initialize(init.Constant(bilinear_kernel(num_classes, num_classes, 64)))
net[-2].initialize(init=init.Xavier())

X = nd.random.uniform(shape=(1, 3, 320, 480))
for layer in net:
    X = layer(X)
    print(X.shape)

# 通道维预测像素类别！！！
loss = gloss.SoftmaxCrossEntropyLoss(axis=1)
Y = nd.ones(shape=(1, 320, 480))
l = loss(X, Y)
print(l)

```
```Python
(1, 3, 320, 480)
(1, 64, 160, 240)
(1, 64, 160, 240)
(1, 64, 160, 240)
(1, 64, 80, 120)
(1, 64, 80, 120)
(1, 128, 40, 60)
(1, 256, 20, 30)
(1, 512, 10, 15)
(1, 512, 10, 15)
(1, 512, 10, 15)
(1, 21, 10, 15)
(1, 21, 320, 480)

[5.6114907]
<NDArray 1 @cpu(0)>
```
### 训练
```Python
from mxnet import gluon, image, init, nd, autograd
from mxnet.gluon import data as gdata, loss as gloss, model_zoo, nn, utils as gutils
import numpy as np
import mxnet as mx
import sys
import os
import tarfile
import time

root = os.path.join('mxnet', 'models', 'resnet18_v2-a81db45f')
pretrained_net = model_zoo.vision.resnet18_v2(root=root, pretrained=True)

net = nn.HybridSequential()
for layer in pretrained_net.features[:-2]:
    net.add(layer)

num_classes = 21
net.add(nn.Conv2D(num_classes, kernel_size=1),
        nn.Conv2DTranspose(num_classes, kernel_size=64, padding=16, strides=32))


def bilinear_kernel(in_channels, out_channels, kernel_size):
    factor = (kernel_size + 1) // 2
    if kernel_size % 2 == 1:
        center = factor - 1
    else:
        center = factor - 0.5
    og = np.ogrid[:kernel_size, :kernel_size]
    filt = (1 - abs(og[0] - center) / factor) * (1 - abs(og[1] - center) / factor)
    weight = np.zeros((in_channels, out_channels, kernel_size, kernel_size), dtype='float32')
    weight[range(in_channels), range(out_channels), :, :] = filt
    # 类似对角矩阵
    return nd.array(weight)


net[-1].initialize(init.Constant(bilinear_kernel(num_classes, num_classes, 64)))
net[-2].initialize(init=init.Xavier())


def download_voc_pascal(data_dir='./mxnet/datasets/Pascal_VOC_2012'):
    voc_dir = os.path.join(data_dir, 'VOCdevkit/VOC2012')
    url = 'http://host.robots.ox.ac.uk/pascal/VOC/voc2012' \
          '/VOCtrainval_11-May-2012.tar'
    sha1 = '4e443f8a2eca6b1dac8a6c57641b67dd40621a49'
    fname = gutils.download(url, data_dir, sha1_hash=sha1)
    with tarfile.open(fname, 'r') as f:
        f.extractall(data_dir)
    return voc_dir


voc_dir = download_voc_pascal()


def read_voc_images(root=voc_dir, is_train=True):
    txt_fname = '%s/ImageSets/Segmentation/%s' % (root, 'train.txt' if is_train else 'val.txt')
    with open(txt_fname, 'r') as f:
        images = f.read().split()
    features, labels = [None] * len(images), [None] * len(images)
    for i, fname in enumerate(images):
        features[i] = image.imread('%s/JPEGImages/%s.jpg' % (root, fname))
        labels[i] = image.imread('%s/SegmentationClass/%s.png' % (root, fname))
    return features, labels


VOC_COLORMAP = [[0, 0, 0], [128, 0, 0], [0, 128, 0], [128, 128, 0],
                [0, 0, 128], [128, 0, 128], [0, 128, 128], [128, 128, 128],
                [64, 0, 0], [192, 0, 0], [64, 128, 0], [192, 128, 0],
                [64, 0, 128], [192, 0, 128], [64, 128, 128], [192, 128, 128],
                [0, 64, 0], [128, 64, 0], [0, 192, 0], [128, 192, 0],
                [0, 64, 128]]
VOC_CLASSES = ['background', 'aeroplane', 'bicycle', 'bird', 'boat',
               'bottle', 'bus', 'car', 'cat', 'chair', 'cow',
               'diningtable', 'dog', 'horse', 'motorbike', 'person',
               'potted plant', 'sheep', 'sofa', 'train', 'tv/monitor']


def voc_label_indices(colormap, colormap2label):
    colormap = colormap.astype('int32')
    # print('colormap', colormap.shape)
    idx = ((colormap[:, :, 0] * 256 + colormap[:, :, 1]) * 256 + colormap[:, :, 2])
    # print('idx:', idx)
    return colormap2label[idx]


def voc_rand_crop(feature, label, height, width):
    feature, rect = image.random_crop(feature, (width, height))
    label = image.fixed_crop(label, *rect)
    return feature, label


class VOCSegDataset(gdata.Dataset):
    def __init__(self, is_train, crop_size, voc_dir, colormap2label):
        self.rgb_mean = nd.array([0.485, 0.456, 0.406])
        self.rgb_std = nd.array([0.229, 0.224, 0.225])
        self.crop_size = crop_size
        features, labels = read_voc_images(root=voc_dir, is_train=is_train)
        self.features = [self.normalize_image(feature) for feature in self.filter(features)]
        self.labels = self.filter(labels)
        self.colormap2label = colormap2label
        print('read ' + str(len(self.features)) + ' examples')

    def normalize_image(self, img):
        return (img.astype('float32') / 255 - self.rgb_mean) / self.rgb_std

    def filter(self, imgs):
        return [img for img in imgs if (
                img.shape[0] >= self.crop_size[0] and
                img.shape[1] >= self.crop_size[1])]

    def __getitem__(self, idx):
        feature, label = voc_rand_crop(self.features[idx], self.labels[idx], *self.crop_size)
        return feature.transpose((2, 0, 1)), voc_label_indices(label, self.colormap2label)

    def __len__(self):
        return len(self.features)


def _get_batch(batch, ctx):
    features, labels = batch
    if labels.dtype != features.dtype:
        labels = labels.astype(features.dtype)
    return gutils.split_and_load(features, ctx), gutils.split_and_load(labels, ctx), features.shape[0]


def evaluate_accuracy(data_iter, net, ctx=[mx.cpu()]):
    if isinstance(ctx, mx.Context):
        ctx = [ctx]
    acc_sum, n = nd.array([0]), 0
    for batch in data_iter:
        features, labels, _ = _get_batch(batch, ctx)
        for X, y in zip(features, labels):
            y = y.astype('float32')
            acc_sum += (net(X).argmax(axis=1) == y).sum().copyto(mx.cpu())
            n += y.size
        acc_sum.wait_to_read()
    return acc_sum.asscalar() / n


def train(train_iter, test_iter, net, loss, trainer, ctx, num_epochs):
    print('training on', ctx)
    if isinstance(ctx, mx.Context):
        ctx = [ctx]
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n, m, start = 0.0, 0.0, 0, 0, time.time()
        for i, batch in enumerate(train_iter):
            Xs, ys, batch_size = _get_batch(batch, ctx)
            ls = []
            with autograd.record():
                y_hats = [net(X) for X in Xs]
                ls = [loss(y_hat, y) for y_hat, y in zip(y_hats, ys)]
            for l in ls:
                l.backward()
            trainer.step(batch_size)
            train_l_sum += sum([l.sum().asscalar() for l in ls])
            # n += sum([l.size for l in ls])
            n += batch_size
            train_acc_sum += sum([(y_hat.argmax(axis=1) == y).sum().asscalar() for y_hat, y in zip(y_hats, ys)])
            # m += sum([y.size for y in ys])
            m += batch_size
        test_acc = evaluate_accuracy(test_iter, net, ctx)
        print('epoch %d, loss %.4f, train acc %.3f, test acc %.3f, time %.1f sec'
              % (epoch + 1, train_l_sum / n, train_acc_sum / m, test_acc, time.time() - start))


crop_size, batch_size, colormap2label = (320, 480), 32, nd.zeros(256 ** 3)
for i, colormap in enumerate(VOC_COLORMAP):
    colormap2label[(colormap[0] * 256 + colormap[1]) * 256 + colormap[2]] = i

num_workers = 0 if sys.platform.startswith('win') else 4
train_iter = gdata.DataLoader(
    VOCSegDataset(True, crop_size, voc_dir, colormap2label),
    batch_size,
    shuffle=True,
    last_batch='discard',
    num_workers=num_workers)
test_iter = gdata.DataLoader(
    VOCSegDataset(False, crop_size, voc_dir, colormap2label),
    batch_size,
    last_batch='discard',
    num_workers=num_workers)

ctx = [mx.gpu(0)]
loss = gloss.SoftmaxCrossEntropyLoss(axis=1)
# 预训练权重默认在原先的ctx上训练，这里设置成当前使用的ctx
net.collect_params().reset_ctx(ctx)
trainer = gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': 0.1, 'wd': 1e-3})
train(train_iter, test_iter, net, loss, trainer, ctx, num_epochs=5)

```
```python
epoch 1, loss 1.3595, train acc 0.737, test acc 0.821, time 23.9 sec
epoch 2, loss 0.5276, train acc 0.842, test acc 0.828, time 21.4 sec
epoch 3, loss 0.4044, train acc 0.870, test acc 0.827, time 21.1 sec
epoch 4, loss 0.3481, train acc 0.886, test acc 0.849, time 20.9 sec
epoch 5, loss 0.3097, train acc 0.896, test acc 0.852, time 21.2 sec

```
### 预测
```Python
from mxnet import gluon, image, init, nd, autograd
from mxnet.gluon import data as gdata, loss as gloss, model_zoo, nn, utils as gutils
import numpy as np
import mxnet as mx
import sys
import os
import tarfile
from matplotlib import pyplot as plt
import time

root = os.path.join('mxnet', 'models', 'resnet18_v2-a81db45f')
pretrained_net = model_zoo.vision.resnet18_v2(root=root, pretrained=True)

net = nn.HybridSequential()
for layer in pretrained_net.features[:-2]:
    net.add(layer)

num_classes = 21
net.add(nn.Conv2D(num_classes, kernel_size=1),
        nn.Conv2DTranspose(num_classes, kernel_size=64, padding=16, strides=32))


def bilinear_kernel(in_channels, out_channels, kernel_size):
    factor = (kernel_size + 1) // 2
    if kernel_size % 2 == 1:
        center = factor - 1
    else:
        center = factor - 0.5
    og = np.ogrid[:kernel_size, :kernel_size]
    filt = (1 - abs(og[0] - center) / factor) * (1 - abs(og[1] - center) / factor)
    weight = np.zeros((in_channels, out_channels, kernel_size, kernel_size), dtype='float32')
    weight[range(in_channels), range(out_channels), :, :] = filt
    # 类似对角矩阵
    return nd.array(weight)


net[-1].initialize(init.Constant(bilinear_kernel(num_classes, num_classes, 64)))
net[-2].initialize(init=init.Xavier())


def download_voc_pascal(data_dir='./mxnet/datasets/Pascal_VOC_2012'):
    voc_dir = os.path.join(data_dir, 'VOCdevkit/VOC2012')
    url = 'http://host.robots.ox.ac.uk/pascal/VOC/voc2012' \
          '/VOCtrainval_11-May-2012.tar'
    sha1 = '4e443f8a2eca6b1dac8a6c57641b67dd40621a49'
    fname = gutils.download(url, data_dir, sha1_hash=sha1)
    with tarfile.open(fname, 'r') as f:
        f.extractall(data_dir)
    return voc_dir


voc_dir = download_voc_pascal()


def read_voc_images(root=voc_dir, is_train=True):
    txt_fname = '%s/ImageSets/Segmentation/%s' % (root, 'train.txt' if is_train else 'val.txt')
    with open(txt_fname, 'r') as f:
        images = f.read().split()
    features, labels = [None] * len(images), [None] * len(images)
    for i, fname in enumerate(images):
        features[i] = image.imread('%s/JPEGImages/%s.jpg' % (root, fname))
        labels[i] = image.imread('%s/SegmentationClass/%s.png' % (root, fname))
    return features, labels


VOC_COLORMAP = [[0, 0, 0], [128, 0, 0], [0, 128, 0], [128, 128, 0],
                [0, 0, 128], [128, 0, 128], [0, 128, 128], [128, 128, 128],
                [64, 0, 0], [192, 0, 0], [64, 128, 0], [192, 128, 0],
                [64, 0, 128], [192, 0, 128], [64, 128, 128], [192, 128, 128],
                [0, 64, 0], [128, 64, 0], [0, 192, 0], [128, 192, 0],
                [0, 64, 128]]
VOC_CLASSES = ['background', 'aeroplane', 'bicycle', 'bird', 'boat',
               'bottle', 'bus', 'car', 'cat', 'chair', 'cow',
               'diningtable', 'dog', 'horse', 'motorbike', 'person',
               'potted plant', 'sheep', 'sofa', 'train', 'tv/monitor']


def voc_label_indices(colormap, colormap2label):
    colormap = colormap.astype('int32')
    # print('colormap', colormap.shape)
    idx = ((colormap[:, :, 0] * 256 + colormap[:, :, 1]) * 256 + colormap[:, :, 2])
    # print('idx:', idx)
    return colormap2label[idx]


def voc_rand_crop(feature, label, height, width):
    feature, rect = image.random_crop(feature, (width, height))
    label = image.fixed_crop(label, *rect)
    return feature, label


class VOCSegDataset(gdata.Dataset):
    def __init__(self, is_train, crop_size, voc_dir, colormap2label):
        self.rgb_mean = nd.array([0.485, 0.456, 0.406])
        self.rgb_std = nd.array([0.229, 0.224, 0.225])
        self.crop_size = crop_size
        features, labels = read_voc_images(root=voc_dir, is_train=is_train)
        self.features = [self.normalize_image(feature) for feature in self.filter(features)]
        self.labels = self.filter(labels)
        self.colormap2label = colormap2label
        print('read ' + str(len(self.features)) + ' examples')

    def normalize_image(self, img):
        return (img.astype('float32') / 255 - self.rgb_mean) / self.rgb_std

    def filter(self, imgs):
        return [img for img in imgs if (
                img.shape[0] >= self.crop_size[0] and
                img.shape[1] >= self.crop_size[1])]

    def __getitem__(self, idx):
        feature, label = voc_rand_crop(self.features[idx], self.labels[idx], *self.crop_size)
        return feature.transpose((2, 0, 1)), voc_label_indices(label, self.colormap2label)

    def __len__(self):
        return len(self.features)


crop_size, batch_size, colormap2label = (320, 480), 32, nd.zeros(256 ** 3)
for i, colormap in enumerate(VOC_COLORMAP):
    colormap2label[(colormap[0] * 256 + colormap[1]) * 256 + colormap[2]] = i

num_workers = 0 if sys.platform.startswith('win') else 4
train_iter = gdata.DataLoader(
    VOCSegDataset(True, crop_size, voc_dir, colormap2label),
    batch_size,
    shuffle=True,
    last_batch='discard',
    num_workers=num_workers)
test_iter = gdata.DataLoader(
    VOCSegDataset(False, crop_size, voc_dir, colormap2label),
    batch_size,
    last_batch='discard',
    num_workers=num_workers)

ctx = [mx.cpu(0)]
loss = gloss.SoftmaxCrossEntropyLoss(axis=1)
# 预训练权重默认在原先的ctx上训练，这里设置成当前使用的ctx
net.load_parameters('semseg_epoch_600.params')
net.collect_params().reset_ctx(ctx)


def predict(img):
    X = test_iter._dataset.normalize_image(img)
    X = X.transpose((2, 0, 1)).expand_dims(axis=0)
    print(X.shape)
    pred = nd.argmax(net(X.as_in_context(ctx[0])), axis=1)
    print('pred shape(pre):', pred.shape)
    return pred.reshape((pred.shape[1], pred.shape[2]))


def label2image(pred):
    print('pred shape:',pred.shape)
    colormap = nd.array(VOC_COLORMAP, ctx=ctx[0], dtype='uint8')
    print('colormap shape:', colormap.shape)
    X = pred.astype('int32')
    return colormap[X, :]


def show_images(imgs, num_rows, num_cols, scale=2.0):
    figsize = (num_cols * scale, num_rows * scale)
    _, axes = plt.subplots(num_rows, num_cols, figsize=figsize)
    for i in range(num_rows):
        for j in range(num_cols):
            axes[i][j].imshow(imgs[i * num_cols + j].asnumpy())
            axes[i][j].axes.get_xaxis().set_visible(False)
            axes[i][j].axes.get_yaxis().set_visible(False)
    return axes


test_images, test_labels = read_voc_images(is_train=False)
n, imgs = 4, []
for i in range(n):
    crop_rect = (0, 0, 480, 320)
    X = image.fixed_crop(test_images[i], *crop_rect)
    pred = label2image(predict(X))
    print('pred label shape:', pred.shape)
    imgs += [X, pred, image.fixed_crop(test_labels[i], *crop_rect)]
show_images(imgs[::3] + imgs[1::3] + imgs[2::3], 3, n)
plt.show()

```
```Python
read 1114 examples
read 1078 examples
(1, 3, 320, 480)
pred shape(pre): (1, 320, 480)
pred shape: (320, 480)
colormap shape: (21, 3)
pred label shape: (320, 480, 3)
(1, 3, 320, 480)
pred shape(pre): (1, 320, 480)
pred shape: (320, 480)
colormap shape: (21, 3)
pred label shape: (320, 480, 3)
(1, 3, 320, 480)
pred shape(pre): (1, 320, 480)
pred shape: (320, 480)
colormap shape: (21, 3)
pred label shape: (320, 480, 3)
(1, 3, 320, 480)
pred shape(pre): (1, 320, 480)
pred shape: (320, 480)
colormap shape: (21, 3)
pred label shape: (320, 480, 3)
```
## 样式迁移
```Python
from mxnet import autograd, gluon, image, init, nd
from mxnet.gluon import model_zoo, nn
import time
from IPython import display
from matplotlib import pyplot as plt
import os
import sys
import mxnet as mx

os.environ['CUDA_VISIBLE_DEVICES'] = '2'
os.environ['MXNET_CUDNN_AUTOTUNE_DEFAULT'] = '0'
# # 矢量图显示
# def user_svg_display():
#     display.set_matplotlib_formats('svg')
#
#
# # 设置图的尺寸
# def set_figsize(figsize=(3.5, 2.5)):
#     user_svg_display()
#     plt.rcParams['figure.figsize'] = figsize
#
#
# set_figsize()
content_path = os.path.join('mxnet', 'img', 'rainier.jpg')
content_path = os.path.expanduser(content_path)
content_img = image.imread(content_path)
# plt.imshow(content_img.asnumpy())
# plt.show()
style_path = os.path.join('mxnet', 'img', 'autumn_oak.jpg')
style_path = os.path.expanduser(style_path)
style_img = image.imread(style_path)
# plt.imshow(style_img.asnumpy())
# plt.show()

# 预处理和后处理图像
rgb_mean = nd.array([0.485, 0.456, 0.406])
rgb_std = nd.array([0.229, 0.224, 0.225])


def preprocess(img, image_shape):
    img = image.imresize(img, *image_shape)
    img = (img.astype('float32') / 255 - rgb_mean) / rgb_std
    return img.transpose((2, 0, 1)).expand_dims(axis=0)


def postprocess(img):
    img = img[0].as_in_context(rgb_std.context)
    return (img.transpose((1, 2, 0)) * rgb_std + rgb_mean).clip(0, 1)


root = os.path.join('mxnet', 'models', 'vgg19-ad2f660d')
root = os.path.expanduser(root)
pretrained_net = model_zoo.vision.vgg19(root=root, pretrained=True)

style_layers, content_layers = [0, 5, 10, 19, 28], [25]

net = nn.Sequential()
for i in range(max(content_layers + style_layers) + 1):
    net.add(pretrained_net.features[i])


def extract_features(X, content_layers, style_layers):
    contents = []
    styles = []
    for i in range(len(net)):
        X = net[i](X)
        if i in style_layers:
            styles.append(X)
        if i in content_layers:
            contents.append(X)
    return contents, styles


def get_content(image_shape, ctx):
    content_X = preprocess(content_img, image_shape).copyto(ctx)
    contents_Y, _ = extract_features(content_X, content_layers, style_layers)
    return content_X, contents_Y


def get_styles(image_shape, ctx):
    style_X = preprocess(style_img, image_shape).copyto(ctx)
    _, style_Y = extract_features(style_X, content_layers, style_layers)
    return style_X, style_Y


def content_loss(Y_hat, Y):
    return (Y_hat - Y).square().mean()


def gram(X):
    num_channels, n = X.shape[1], X.size // X.shape[1]
    X = X.reshape((num_channels, n))
    return nd.dot(X, X.T) / (num_channels * n)


def style_loss(Y_hat, gram_Y):
    return (gram(Y_hat) - gram_Y).square().mean()


def tv_loss(Y_hat):
    return 0.5 * ((Y_hat[:, :, 1:, :] - Y_hat[:, :, :-1,:]).abs().mean() +
                  (Y_hat[:, :, :, 1:] - Y_hat[:, :, :, :-1]).abs().mean())


content_weight, style_weight, tv_weight = 1, 1e3, 10


def compute_loss(X, contents_Y_hat, styles_Y_hat, contents_Y, style_Y_gram):
    contents_l = [content_loss(Y_hat, Y) * content_weight for Y_hat, Y in zip(contents_Y_hat, contents_Y)]
    styles_l = [style_loss(Y_hat, Y) * style_weight for Y_hat, Y in zip(styles_Y_hat, style_Y_gram)]
    tv_l = tv_loss(X) * tv_weight
    l = nd.add_n(*styles_l) + nd.add_n(*contents_l) + tv_l
    return contents_l, styles_l, tv_l, l


class GeneratedImage(nn.Block):
    def __init__(self, img_shape, **kwargs):
        super(GeneratedImage, self).__init__(**kwargs)
        self.weight = self.params.get('weight', shape=img_shape)

    def forward(self):
        return self.weight.data()


def get_inits(X, ctx, lr, styles_Y):
    gen_img = GeneratedImage(X.shape)
    gen_img.initialize(init.Constant(X), ctx=ctx, force_reinit=True)
    trainer = gluon.Trainer(gen_img.collect_params(), 'adam', {'learning_rate': lr})
    styles_Y_gram = [gram(Y) for Y in styles_Y]
    return gen_img(), styles_Y_gram, trainer


def train(X, contents_Y, styles_Y, ctx, lr, max_epochs, lr_decay_epoch):
    print('training on:', ctx)
    print('training on:', ctx, file=f)
    X, styles_Y_gram, trainer = get_inits(X, ctx, lr, styles_Y)
    for i in range(max_epochs):
        start = time.time()
        with autograd.record():
            contents_Y_hat, styles_Y_hat = extract_features(
                X, content_layers, style_layers)
            contents_l, styles_l, tv_l, l = compute_loss(
                X, contents_Y_hat, styles_Y_hat, contents_Y, styles_Y_gram)
        l.backward()
        trainer.step(1)
        nd.waitall()
        if i % 50 and i != 0:
            print('epoch %3d, content loss %.2f, style loss %.2f, TV loss %.2f, %.2f sec'
                  % (i, nd.add_n(*contents_l).asscalar(), nd.add_n(*styles_l).asscalar(), tv_l.asscalar(), time.time() - start))
            print('epoch %3d, content loss %.2f, style loss %.2f, TV loss %.2f, %.2f sec'
                  % (i, nd.add_n(*contents_l).asscalar(), nd.add_n(*styles_l).asscalar(), tv_l.asscalar(),
                     time.time() - start), file=f)
        if i % lr_decay_epoch == 0 and i != 0:
            trainer.set_learning_rate(trainer.learning_rate * 0.1)
            print('change lr to %.1e' % trainer.learning_rate)
            print('change lr to %.1e' % trainer.learning_rate, file=f)
    return X


ctx, image_shape = mx.gpu(), (900, 600)
net.collect_params().reset_ctx(ctx)
content_X, contents_Y = get_content(image_shape, ctx)
_, styles_Y = get_styles(image_shape, ctx)
f = open('style_transfer_log.txt', 'w')
output = train(content_X, contents_Y, styles_Y, ctx, 0.01, 500, 200)

plt.imsave('neural-style-1.png', postprocess(output).asnumpy())
print('generate neural-style-1.png')
print('generate neural-style-1.png', file=f)
f.close()

```
```Python
training on: gpu(0)
epoch   1, content loss 2.55, style loss 140.17, TV loss 1.32, 0.14 sec
epoch   2, content loss 6.18, style loss 119.68, TV loss 1.34, 0.13 sec
epoch   3, content loss 10.28, style loss 100.95, TV loss 1.36, 0.13 sec
epoch   4, content loss 13.66, style loss 85.74, TV loss 1.37, 0.13 sec
epoch   5, content loss 15.80, style loss 74.33, TV loss 1.39, 0.13 sec
epoch   6, content loss 16.76, style loss 66.05, TV loss 1.41, 0.43 sec
epoch   7, content loss 16.72, style loss 59.97, TV loss 1.43, 0.13 sec
epoch   8, content loss 16.09, style loss 55.29, TV loss 1.45, 0.13 sec
epoch   9, content loss 15.25, style loss 51.47, TV loss 1.46, 0.13 sec
epoch  10, content loss 14.43, style loss 48.24, TV loss 1.48, 0.13 sec
epoch  11, content loss 13.75, style loss 45.42, TV loss 1.50, 0.13 sec
epoch  12, content loss 13.22, style loss 42.87, TV loss 1.51, 0.13 sec
epoch  13, content loss 12.83, style loss 40.51, TV loss 1.53, 0.13 sec
epoch  14, content loss 12.54, style loss 38.32, TV loss 1.54, 0.13 sec
epoch  15, content loss 12.31, style loss 36.30, TV loss 1.56, 0.30 sec
epoch  16, content loss 12.11, style loss 34.47, TV loss 1.57, 0.13 sec
epoch  17, content loss 11.90, style loss 32.82, TV loss 1.59, 0.13 sec
epoch  18, content loss 11.68, style loss 31.34, TV loss 1.60, 0.13 sec
epoch  19, content loss 11.46, style loss 29.99, TV loss 1.62, 0.13 sec
epoch  20, content loss 11.24, style loss 28.77, TV loss 1.63, 0.13 sec
epoch  21, content loss 11.03, style loss 27.64, TV loss 1.64, 0.13 sec
epoch  22, content loss 10.83, style loss 26.59, TV loss 1.65, 0.13 sec
epoch  23, content loss 10.65, style loss 25.61, TV loss 1.66, 0.13 sec
epoch  24, content loss 10.48, style loss 24.69, TV loss 1.67, 0.13 sec
epoch  25, content loss 10.32, style loss 23.83, TV loss 1.68, 0.13 sec
epoch  26, content loss 10.17, style loss 23.02, TV loss 1.70, 0.14 sec
epoch  27, content loss 10.03, style loss 22.27, TV loss 1.71, 0.13 sec
epoch  28, content loss 9.88, style loss 21.57, TV loss 1.71, 0.13 sec
epoch  29, content loss 9.74, style loss 20.91, TV loss 1.72, 0.13 sec
epoch  30, content loss 9.61, style loss 20.29, TV loss 1.73, 0.13 sec
epoch  31, content loss 9.48, style loss 19.71, TV loss 1.74, 0.13 sec
epoch  32, content loss 9.36, style loss 19.16, TV loss 1.75, 0.13 sec
epoch  33, content loss 9.24, style loss 18.65, TV loss 1.76, 0.13 sec
epoch  34, content loss 9.13, style loss 18.16, TV loss 1.76, 0.13 sec
epoch  35, content loss 9.02, style loss 17.70, TV loss 1.77, 0.13 sec
epoch  36, content loss 8.92, style loss 17.27, TV loss 1.78, 0.13 sec
epoch  37, content loss 8.82, style loss 16.86, TV loss 1.78, 0.13 sec
epoch  38, content loss 8.72, style loss 16.48, TV loss 1.79, 0.13 sec
epoch  39, content loss 8.62, style loss 16.12, TV loss 1.80, 0.13 sec
epoch  40, content loss 8.53, style loss 15.78, TV loss 1.80, 0.13 sec
epoch  41, content loss 8.44, style loss 15.45, TV loss 1.81, 0.13 sec
epoch  42, content loss 8.36, style loss 15.15, TV loss 1.81, 0.13 sec
epoch  43, content loss 8.28, style loss 14.85, TV loss 1.82, 0.13 sec
epoch  44, content loss 8.20, style loss 14.57, TV loss 1.82, 0.13 sec
epoch  45, content loss 8.12, style loss 14.31, TV loss 1.83, 0.13 sec
epoch  46, content loss 8.05, style loss 14.06, TV loss 1.83, 0.13 sec
epoch  47, content loss 7.97, style loss 13.82, TV loss 1.84, 0.13 sec
epoch  48, content loss 7.90, style loss 13.59, TV loss 1.84, 0.14 sec
epoch  49, content loss 7.83, style loss 13.38, TV loss 1.84, 0.13 sec
epoch  51, content loss 7.70, style loss 12.96, TV loss 1.85, 0.13 sec
epoch  52, content loss 7.64, style loss 12.77, TV loss 1.86, 0.13 sec
epoch  53, content loss 7.58, style loss 12.58, TV loss 1.86, 0.13 sec
epoch  54, content loss 7.52, style loss 12.40, TV loss 1.86, 0.13 sec
epoch  55, content loss 7.47, style loss 12.23, TV loss 1.86, 0.13 sec
epoch  56, content loss 7.41, style loss 12.06, TV loss 1.87, 0.13 sec
epoch  57, content loss 7.36, style loss 11.90, TV loss 1.87, 0.13 sec
epoch  58, content loss 7.30, style loss 11.75, TV loss 1.87, 0.13 sec
epoch  59, content loss 7.25, style loss 11.59, TV loss 1.87, 0.13 sec
epoch  60, content loss 7.21, style loss 11.45, TV loss 1.88, 0.13 sec
epoch  61, content loss 7.16, style loss 11.31, TV loss 1.88, 0.13 sec
epoch  62, content loss 7.11, style loss 11.17, TV loss 1.88, 0.13 sec
epoch  63, content loss 7.06, style loss 11.04, TV loss 1.88, 0.13 sec
epoch  64, content loss 7.02, style loss 10.91, TV loss 1.89, 0.13 sec
epoch  65, content loss 6.97, style loss 10.78, TV loss 1.89, 0.13 sec
epoch  66, content loss 6.93, style loss 10.66, TV loss 1.89, 0.13 sec
epoch  67, content loss 6.89, style loss 10.55, TV loss 1.89, 0.13 sec
epoch  68, content loss 6.85, style loss 10.43, TV loss 1.89, 0.13 sec
epoch  69, content loss 6.81, style loss 10.32, TV loss 1.89, 0.13 sec
epoch  70, content loss 6.77, style loss 10.21, TV loss 1.90, 0.13 sec
epoch  71, content loss 6.73, style loss 10.11, TV loss 1.90, 0.13 sec
epoch  72, content loss 6.69, style loss 10.01, TV loss 1.90, 0.13 sec
epoch  73, content loss 6.65, style loss 9.91, TV loss 1.90, 0.14 sec
epoch  74, content loss 6.62, style loss 9.81, TV loss 1.90, 0.13 sec
epoch  75, content loss 6.58, style loss 9.72, TV loss 1.90, 0.13 sec
epoch  76, content loss 6.55, style loss 9.63, TV loss 1.91, 0.13 sec
epoch  77, content loss 6.51, style loss 9.54, TV loss 1.91, 0.13 sec
epoch  78, content loss 6.48, style loss 9.46, TV loss 1.91, 0.13 sec
epoch  79, content loss 6.44, style loss 9.37, TV loss 1.91, 0.13 sec
epoch  80, content loss 6.41, style loss 9.29, TV loss 1.91, 0.13 sec
epoch  81, content loss 6.38, style loss 9.21, TV loss 1.91, 0.13 sec
epoch  82, content loss 6.35, style loss 9.13, TV loss 1.92, 0.13 sec
epoch  83, content loss 6.32, style loss 9.06, TV loss 1.92, 0.13 sec
epoch  84, content loss 6.29, style loss 8.98, TV loss 1.92, 0.13 sec
epoch  85, content loss 6.26, style loss 8.91, TV loss 1.92, 0.13 sec
epoch  86, content loss 6.23, style loss 8.84, TV loss 1.92, 0.13 sec
epoch  87, content loss 6.20, style loss 8.77, TV loss 1.92, 0.13 sec
epoch  88, content loss 6.17, style loss 8.70, TV loss 1.92, 0.13 sec
epoch  89, content loss 6.14, style loss 8.63, TV loss 1.92, 0.13 sec
epoch  90, content loss 6.12, style loss 8.57, TV loss 1.93, 0.13 sec
epoch  91, content loss 6.09, style loss 8.50, TV loss 1.93, 0.13 sec
epoch  92, content loss 6.06, style loss 8.44, TV loss 1.93, 0.13 sec
epoch  93, content loss 6.04, style loss 8.38, TV loss 1.93, 0.13 sec
epoch  94, content loss 6.01, style loss 8.32, TV loss 1.93, 0.14 sec
epoch  95, content loss 5.99, style loss 8.26, TV loss 1.93, 0.13 sec
epoch  96, content loss 5.96, style loss 8.21, TV loss 1.93, 0.13 sec
epoch  97, content loss 5.94, style loss 8.15, TV loss 1.93, 0.13 sec
epoch  98, content loss 5.91, style loss 8.10, TV loss 1.94, 0.13 sec
epoch  99, content loss 5.89, style loss 8.04, TV loss 1.94, 0.13 sec
epoch 101, content loss 5.85, style loss 7.94, TV loss 1.94, 0.13 sec
epoch 102, content loss 5.82, style loss 7.89, TV loss 1.94, 0.13 sec
epoch 103, content loss 5.80, style loss 7.84, TV loss 1.94, 0.13 sec
epoch 104, content loss 5.78, style loss 7.79, TV loss 1.94, 0.13 sec
epoch 105, content loss 5.76, style loss 7.74, TV loss 1.94, 0.13 sec
epoch 106, content loss 5.73, style loss 7.69, TV loss 1.95, 0.13 sec
epoch 107, content loss 5.71, style loss 7.65, TV loss 1.95, 0.13 sec
epoch 108, content loss 5.69, style loss 7.60, TV loss 1.95, 0.13 sec
epoch 109, content loss 5.67, style loss 7.56, TV loss 1.95, 0.13 sec
epoch 110, content loss 5.65, style loss 7.52, TV loss 1.95, 0.13 sec
epoch 111, content loss 5.63, style loss 7.47, TV loss 1.95, 0.13 sec
epoch 112, content loss 5.61, style loss 7.43, TV loss 1.95, 0.13 sec
epoch 113, content loss 5.59, style loss 7.39, TV loss 1.95, 0.13 sec
epoch 114, content loss 5.57, style loss 7.35, TV loss 1.95, 0.13 sec
epoch 115, content loss 5.55, style loss 7.31, TV loss 1.95, 0.13 sec
epoch 116, content loss 5.53, style loss 7.27, TV loss 1.96, 0.13 sec
epoch 117, content loss 5.52, style loss 7.23, TV loss 1.96, 0.13 sec
epoch 118, content loss 5.50, style loss 7.20, TV loss 1.96, 0.14 sec
epoch 119, content loss 5.48, style loss 7.16, TV loss 1.96, 0.13 sec
epoch 120, content loss 5.46, style loss 7.12, TV loss 1.96, 0.13 sec
epoch 121, content loss 5.44, style loss 7.09, TV loss 1.96, 0.13 sec
epoch 122, content loss 5.43, style loss 7.05, TV loss 1.96, 0.13 sec
epoch 123, content loss 5.41, style loss 7.01, TV loss 1.96, 0.13 sec
epoch 124, content loss 5.39, style loss 6.98, TV loss 1.96, 0.13 sec
epoch 125, content loss 5.38, style loss 6.95, TV loss 1.96, 0.13 sec
epoch 126, content loss 5.36, style loss 6.91, TV loss 1.97, 0.13 sec
epoch 127, content loss 5.34, style loss 6.88, TV loss 1.97, 0.13 sec
epoch 128, content loss 5.33, style loss 6.85, TV loss 1.97, 0.13 sec
epoch 129, content loss 5.31, style loss 6.82, TV loss 1.97, 0.13 sec
epoch 130, content loss 5.30, style loss 6.78, TV loss 1.97, 0.13 sec
epoch 131, content loss 5.28, style loss 6.75, TV loss 1.97, 0.13 sec
epoch 132, content loss 5.26, style loss 6.72, TV loss 1.97, 0.13 sec
epoch 133, content loss 5.25, style loss 6.69, TV loss 1.97, 0.13 sec
epoch 134, content loss 5.23, style loss 6.66, TV loss 1.97, 0.13 sec
epoch 135, content loss 5.22, style loss 6.63, TV loss 1.97, 0.13 sec
epoch 136, content loss 5.20, style loss 6.61, TV loss 1.97, 0.15 sec
epoch 137, content loss 5.19, style loss 6.58, TV loss 1.98, 0.13 sec
epoch 138, content loss 5.18, style loss 6.55, TV loss 1.98, 0.13 sec
epoch 139, content loss 5.16, style loss 6.52, TV loss 1.98, 0.13 sec
epoch 140, content loss 5.15, style loss 6.49, TV loss 1.98, 0.13 sec
epoch 141, content loss 5.13, style loss 6.47, TV loss 1.98, 0.13 sec
epoch 142, content loss 5.12, style loss 6.44, TV loss 1.98, 0.13 sec
epoch 143, content loss 5.11, style loss 6.41, TV loss 1.98, 0.13 sec
epoch 144, content loss 5.09, style loss 6.39, TV loss 1.98, 0.13 sec
epoch 145, content loss 5.08, style loss 6.36, TV loss 1.98, 0.13 sec
epoch 146, content loss 5.07, style loss 6.34, TV loss 1.98, 0.13 sec
epoch 147, content loss 5.05, style loss 6.31, TV loss 1.98, 0.13 sec
epoch 148, content loss 5.04, style loss 6.29, TV loss 1.98, 0.13 sec
epoch 149, content loss 5.03, style loss 6.27, TV loss 1.99, 0.13 sec
epoch 151, content loss 5.00, style loss 6.22, TV loss 1.99, 0.13 sec
epoch 152, content loss 4.99, style loss 6.20, TV loss 1.99, 0.13 sec
epoch 153, content loss 4.98, style loss 6.17, TV loss 1.99, 0.14 sec
epoch 154, content loss 4.96, style loss 6.15, TV loss 1.99, 0.13 sec
epoch 155, content loss 4.95, style loss 6.13, TV loss 1.99, 0.13 sec
epoch 156, content loss 4.94, style loss 6.10, TV loss 1.99, 0.13 sec
epoch 157, content loss 4.93, style loss 6.08, TV loss 1.99, 0.13 sec
epoch 158, content loss 4.92, style loss 6.06, TV loss 1.99, 0.13 sec
epoch 159, content loss 4.90, style loss 6.04, TV loss 1.99, 0.13 sec
epoch 160, content loss 4.89, style loss 6.02, TV loss 1.99, 0.13 sec
epoch 161, content loss 4.88, style loss 6.00, TV loss 1.99, 0.13 sec
epoch 162, content loss 4.87, style loss 5.98, TV loss 2.00, 0.13 sec
epoch 163, content loss 4.86, style loss 5.96, TV loss 2.00, 0.13 sec
epoch 164, content loss 4.85, style loss 5.94, TV loss 2.00, 0.13 sec
epoch 165, content loss 4.84, style loss 5.92, TV loss 2.00, 0.13 sec
epoch 166, content loss 4.82, style loss 5.90, TV loss 2.00, 0.13 sec
epoch 167, content loss 4.81, style loss 5.88, TV loss 2.00, 0.13 sec
epoch 168, content loss 4.80, style loss 5.86, TV loss 2.00, 0.13 sec
epoch 169, content loss 4.79, style loss 5.84, TV loss 2.00, 0.13 sec
epoch 170, content loss 4.78, style loss 5.82, TV loss 2.00, 0.13 sec
epoch 171, content loss 4.77, style loss 5.80, TV loss 2.00, 0.13 sec
epoch 172, content loss 4.76, style loss 5.78, TV loss 2.00, 0.13 sec
epoch 173, content loss 4.75, style loss 5.76, TV loss 2.00, 0.13 sec
epoch 174, content loss 4.74, style loss 5.75, TV loss 2.00, 0.13 sec
epoch 175, content loss 4.73, style loss 5.73, TV loss 2.00, 0.13 sec
epoch 176, content loss 4.72, style loss 5.71, TV loss 2.00, 0.13 sec
epoch 177, content loss 4.71, style loss 5.69, TV loss 2.01, 0.13 sec
epoch 178, content loss 4.70, style loss 5.68, TV loss 2.01, 0.13 sec
epoch 179, content loss 4.69, style loss 5.66, TV loss 2.01, 0.13 sec
epoch 180, content loss 4.68, style loss 5.64, TV loss 2.01, 0.13 sec
epoch 181, content loss 4.67, style loss 5.63, TV loss 2.01, 0.14 sec
epoch 182, content loss 4.66, style loss 5.61, TV loss 2.01, 0.13 sec
epoch 183, content loss 4.65, style loss 5.59, TV loss 2.01, 0.13 sec
epoch 184, content loss 4.64, style loss 5.58, TV loss 2.01, 0.13 sec
epoch 185, content loss 4.63, style loss 5.56, TV loss 2.01, 0.13 sec
epoch 186, content loss 4.62, style loss 5.54, TV loss 2.01, 0.13 sec
epoch 187, content loss 4.61, style loss 5.53, TV loss 2.01, 0.13 sec
epoch 188, content loss 4.60, style loss 5.51, TV loss 2.01, 0.13 sec
epoch 189, content loss 4.59, style loss 5.50, TV loss 2.01, 0.13 sec
epoch 190, content loss 4.58, style loss 5.48, TV loss 2.01, 0.13 sec
epoch 191, content loss 4.57, style loss 5.47, TV loss 2.01, 0.13 sec
epoch 192, content loss 4.57, style loss 5.45, TV loss 2.01, 0.13 sec
epoch 193, content loss 4.56, style loss 5.44, TV loss 2.02, 0.13 sec
epoch 194, content loss 4.55, style loss 5.42, TV loss 2.02, 0.13 sec
epoch 195, content loss 4.54, style loss 5.41, TV loss 2.02, 0.13 sec
epoch 196, content loss 4.53, style loss 5.39, TV loss 2.02, 0.13 sec
epoch 197, content loss 4.52, style loss 5.38, TV loss 2.02, 0.13 sec
epoch 198, content loss 4.51, style loss 5.36, TV loss 2.02, 0.13 sec
epoch 199, content loss 4.51, style loss 5.35, TV loss 2.02, 0.13 sec
change lr to 1.0e-03
epoch 201, content loss 4.49, style loss 5.32, TV loss 2.02, 0.13 sec
epoch 202, content loss 4.49, style loss 5.32, TV loss 2.02, 0.13 sec
epoch 203, content loss 4.49, style loss 5.32, TV loss 2.02, 0.13 sec
epoch 204, content loss 4.49, style loss 5.32, TV loss 2.02, 0.13 sec
epoch 205, content loss 4.49, style loss 5.31, TV loss 2.02, 0.13 sec
epoch 206, content loss 4.48, style loss 5.31, TV loss 2.02, 0.13 sec
epoch 207, content loss 4.48, style loss 5.31, TV loss 2.02, 0.13 sec
epoch 208, content loss 4.48, style loss 5.31, TV loss 2.02, 0.13 sec
epoch 209, content loss 4.48, style loss 5.31, TV loss 2.02, 0.13 sec
epoch 210, content loss 4.48, style loss 5.31, TV loss 2.02, 0.13 sec
epoch 211, content loss 4.48, style loss 5.30, TV loss 2.02, 0.13 sec
epoch 212, content loss 4.48, style loss 5.30, TV loss 2.02, 0.13 sec
epoch 213, content loss 4.48, style loss 5.30, TV loss 2.02, 0.13 sec
epoch 214, content loss 4.48, style loss 5.30, TV loss 2.02, 0.13 sec
epoch 215, content loss 4.48, style loss 5.30, TV loss 2.02, 0.13 sec
epoch 216, content loss 4.48, style loss 5.30, TV loss 2.02, 0.13 sec
epoch 217, content loss 4.47, style loss 5.30, TV loss 2.02, 0.13 sec
epoch 218, content loss 4.47, style loss 5.29, TV loss 2.02, 0.13 sec
epoch 219, content loss 4.47, style loss 5.29, TV loss 2.02, 0.13 sec
epoch 220, content loss 4.47, style loss 5.29, TV loss 2.02, 0.13 sec
epoch 221, content loss 4.47, style loss 5.29, TV loss 2.02, 0.13 sec
epoch 222, content loss 4.47, style loss 5.29, TV loss 2.02, 0.13 sec
epoch 223, content loss 4.47, style loss 5.29, TV loss 2.02, 0.13 sec
epoch 224, content loss 4.47, style loss 5.29, TV loss 2.02, 0.13 sec
epoch 225, content loss 4.47, style loss 5.28, TV loss 2.02, 0.13 sec
epoch 226, content loss 4.47, style loss 5.28, TV loss 2.02, 0.13 sec
epoch 227, content loss 4.46, style loss 5.28, TV loss 2.02, 0.13 sec
epoch 228, content loss 4.46, style loss 5.28, TV loss 2.02, 0.13 sec
epoch 229, content loss 4.46, style loss 5.28, TV loss 2.02, 0.13 sec
epoch 230, content loss 4.46, style loss 5.28, TV loss 2.02, 0.13 sec
epoch 231, content loss 4.46, style loss 5.28, TV loss 2.02, 0.15 sec
epoch 232, content loss 4.46, style loss 5.27, TV loss 2.02, 0.13 sec
epoch 233, content loss 4.46, style loss 5.27, TV loss 2.02, 0.13 sec
epoch 234, content loss 4.46, style loss 5.27, TV loss 2.02, 0.13 sec
epoch 235, content loss 4.46, style loss 5.27, TV loss 2.02, 0.13 sec
epoch 236, content loss 4.46, style loss 5.27, TV loss 2.02, 0.13 sec
epoch 237, content loss 4.46, style loss 5.27, TV loss 2.02, 0.13 sec
epoch 238, content loss 4.45, style loss 5.27, TV loss 2.02, 0.13 sec
epoch 239, content loss 4.45, style loss 5.26, TV loss 2.02, 0.13 sec
epoch 240, content loss 4.45, style loss 5.26, TV loss 2.02, 0.13 sec
epoch 241, content loss 4.45, style loss 5.26, TV loss 2.02, 0.13 sec
epoch 242, content loss 4.45, style loss 5.26, TV loss 2.02, 0.13 sec
epoch 243, content loss 4.45, style loss 5.26, TV loss 2.02, 0.13 sec
epoch 244, content loss 4.45, style loss 5.26, TV loss 2.02, 0.13 sec
epoch 245, content loss 4.45, style loss 5.26, TV loss 2.02, 0.13 sec
epoch 246, content loss 4.45, style loss 5.25, TV loss 2.02, 0.13 sec
epoch 247, content loss 4.45, style loss 5.25, TV loss 2.02, 0.13 sec
epoch 248, content loss 4.45, style loss 5.25, TV loss 2.02, 0.13 sec
epoch 249, content loss 4.44, style loss 5.25, TV loss 2.02, 0.13 sec
epoch 251, content loss 4.44, style loss 5.25, TV loss 2.02, 0.13 sec
epoch 252, content loss 4.44, style loss 5.24, TV loss 2.02, 0.13 sec
epoch 253, content loss 4.44, style loss 5.24, TV loss 2.02, 0.13 sec
epoch 254, content loss 4.44, style loss 5.24, TV loss 2.02, 0.13 sec
epoch 255, content loss 4.44, style loss 5.24, TV loss 2.02, 0.13 sec
epoch 256, content loss 4.44, style loss 5.24, TV loss 2.02, 0.13 sec
epoch 257, content loss 4.44, style loss 5.24, TV loss 2.02, 0.13 sec
epoch 258, content loss 4.44, style loss 5.24, TV loss 2.02, 0.13 sec
epoch 259, content loss 4.43, style loss 5.23, TV loss 2.02, 0.13 sec
epoch 260, content loss 4.43, style loss 5.23, TV loss 2.02, 0.13 sec
epoch 261, content loss 4.43, style loss 5.23, TV loss 2.02, 0.13 sec
epoch 262, content loss 4.43, style loss 5.23, TV loss 2.02, 0.13 sec
epoch 263, content loss 4.43, style loss 5.23, TV loss 2.02, 0.13 sec
epoch 264, content loss 4.43, style loss 5.23, TV loss 2.02, 0.13 sec
epoch 265, content loss 4.43, style loss 5.23, TV loss 2.02, 0.13 sec
epoch 266, content loss 4.43, style loss 5.22, TV loss 2.02, 0.13 sec
epoch 267, content loss 4.43, style loss 5.22, TV loss 2.02, 0.13 sec
epoch 268, content loss 4.43, style loss 5.22, TV loss 2.02, 0.13 sec
epoch 269, content loss 4.43, style loss 5.22, TV loss 2.02, 0.13 sec
epoch 270, content loss 4.42, style loss 5.22, TV loss 2.02, 0.13 sec
epoch 271, content loss 4.42, style loss 5.22, TV loss 2.02, 0.13 sec
epoch 272, content loss 4.42, style loss 5.22, TV loss 2.02, 0.13 sec
epoch 273, content loss 4.42, style loss 5.21, TV loss 2.02, 0.13 sec
epoch 274, content loss 4.42, style loss 5.21, TV loss 2.02, 0.13 sec
epoch 275, content loss 4.42, style loss 5.21, TV loss 2.02, 0.14 sec
epoch 276, content loss 4.42, style loss 5.21, TV loss 2.02, 0.13 sec
epoch 277, content loss 4.42, style loss 5.21, TV loss 2.02, 0.13 sec
epoch 278, content loss 4.42, style loss 5.21, TV loss 2.02, 0.13 sec
epoch 279, content loss 4.42, style loss 5.20, TV loss 2.02, 0.13 sec
epoch 280, content loss 4.42, style loss 5.20, TV loss 2.02, 0.13 sec
epoch 281, content loss 4.41, style loss 5.20, TV loss 2.02, 0.13 sec
epoch 282, content loss 4.41, style loss 5.20, TV loss 2.02, 0.13 sec
epoch 283, content loss 4.41, style loss 5.20, TV loss 2.02, 0.13 sec
epoch 284, content loss 4.41, style loss 5.20, TV loss 2.02, 0.13 sec
epoch 285, content loss 4.41, style loss 5.20, TV loss 2.02, 0.13 sec
epoch 286, content loss 4.41, style loss 5.19, TV loss 2.02, 0.13 sec
epoch 287, content loss 4.41, style loss 5.19, TV loss 2.02, 0.13 sec
epoch 288, content loss 4.41, style loss 5.19, TV loss 2.02, 0.13 sec
epoch 289, content loss 4.41, style loss 5.19, TV loss 2.02, 0.13 sec
epoch 290, content loss 4.41, style loss 5.19, TV loss 2.02, 0.13 sec
epoch 291, content loss 4.41, style loss 5.19, TV loss 2.02, 0.14 sec
epoch 292, content loss 4.40, style loss 5.19, TV loss 2.02, 0.13 sec
epoch 293, content loss 4.40, style loss 5.18, TV loss 2.02, 0.13 sec
epoch 294, content loss 4.40, style loss 5.18, TV loss 2.02, 0.13 sec
epoch 295, content loss 4.40, style loss 5.18, TV loss 2.02, 0.13 sec
epoch 296, content loss 4.40, style loss 5.18, TV loss 2.02, 0.13 sec
epoch 297, content loss 4.40, style loss 5.18, TV loss 2.02, 0.13 sec
epoch 298, content loss 4.40, style loss 5.18, TV loss 2.02, 0.13 sec
epoch 299, content loss 4.40, style loss 5.18, TV loss 2.02, 0.13 sec
epoch 301, content loss 4.40, style loss 5.17, TV loss 2.02, 0.13 sec
epoch 302, content loss 4.40, style loss 5.17, TV loss 2.02, 0.13 sec
epoch 303, content loss 4.39, style loss 5.17, TV loss 2.02, 0.13 sec
epoch 304, content loss 4.39, style loss 5.17, TV loss 2.02, 0.13 sec
epoch 305, content loss 4.39, style loss 5.17, TV loss 2.02, 0.13 sec
epoch 306, content loss 4.39, style loss 5.16, TV loss 2.02, 0.13 sec
epoch 307, content loss 4.39, style loss 5.16, TV loss 2.02, 0.13 sec
epoch 308, content loss 4.39, style loss 5.16, TV loss 2.02, 0.13 sec
epoch 309, content loss 4.39, style loss 5.16, TV loss 2.02, 0.13 sec
epoch 310, content loss 4.39, style loss 5.16, TV loss 2.02, 0.13 sec
epoch 311, content loss 4.39, style loss 5.16, TV loss 2.02, 0.13 sec
epoch 312, content loss 4.39, style loss 5.16, TV loss 2.02, 0.13 sec
epoch 313, content loss 4.39, style loss 5.15, TV loss 2.02, 0.13 sec
epoch 314, content loss 4.38, style loss 5.15, TV loss 2.02, 0.13 sec
epoch 315, content loss 4.38, style loss 5.15, TV loss 2.02, 0.13 sec
epoch 316, content loss 4.38, style loss 5.15, TV loss 2.02, 0.13 sec
epoch 317, content loss 4.38, style loss 5.15, TV loss 2.02, 0.13 sec
epoch 318, content loss 4.38, style loss 5.15, TV loss 2.02, 0.86 sec
epoch 319, content loss 4.38, style loss 5.14, TV loss 2.02, 0.13 sec
epoch 320, content loss 4.38, style loss 5.14, TV loss 2.02, 0.13 sec
epoch 321, content loss 4.38, style loss 5.14, TV loss 2.02, 0.13 sec
epoch 322, content loss 4.38, style loss 5.14, TV loss 2.02, 0.13 sec
epoch 323, content loss 4.38, style loss 5.14, TV loss 2.02, 0.13 sec
epoch 324, content loss 4.38, style loss 5.14, TV loss 2.02, 0.13 sec
epoch 325, content loss 4.37, style loss 5.14, TV loss 2.02, 0.13 sec
epoch 326, content loss 4.37, style loss 5.13, TV loss 2.02, 0.13 sec
epoch 327, content loss 4.37, style loss 5.13, TV loss 2.02, 0.13 sec
epoch 328, content loss 4.37, style loss 5.13, TV loss 2.02, 0.13 sec
epoch 329, content loss 4.37, style loss 5.13, TV loss 2.02, 0.13 sec
epoch 330, content loss 4.37, style loss 5.13, TV loss 2.02, 0.13 sec
epoch 331, content loss 4.37, style loss 5.13, TV loss 2.02, 0.13 sec
epoch 332, content loss 4.37, style loss 5.12, TV loss 2.02, 0.13 sec
epoch 333, content loss 4.37, style loss 5.12, TV loss 2.02, 0.13 sec
epoch 334, content loss 4.37, style loss 5.12, TV loss 2.02, 0.13 sec
epoch 335, content loss 4.37, style loss 5.12, TV loss 2.02, 0.13 sec
epoch 336, content loss 4.36, style loss 5.12, TV loss 2.02, 0.13 sec
epoch 337, content loss 4.36, style loss 5.12, TV loss 2.02, 0.13 sec
epoch 338, content loss 4.36, style loss 5.12, TV loss 2.02, 0.13 sec
epoch 339, content loss 4.36, style loss 5.11, TV loss 2.02, 0.13 sec
epoch 340, content loss 4.36, style loss 5.11, TV loss 2.02, 0.13 sec
epoch 341, content loss 4.36, style loss 5.11, TV loss 2.02, 0.13 sec
epoch 342, content loss 4.36, style loss 5.11, TV loss 2.02, 0.13 sec
epoch 343, content loss 4.36, style loss 5.11, TV loss 2.02, 0.13 sec
epoch 344, content loss 4.36, style loss 5.11, TV loss 2.02, 0.13 sec
epoch 345, content loss 4.36, style loss 5.10, TV loss 2.02, 0.13 sec
epoch 346, content loss 4.36, style loss 5.10, TV loss 2.02, 0.13 sec
epoch 347, content loss 4.35, style loss 5.10, TV loss 2.02, 0.13 sec
epoch 348, content loss 4.35, style loss 5.10, TV loss 2.02, 0.13 sec
epoch 349, content loss 4.35, style loss 5.10, TV loss 2.02, 0.13 sec
epoch 351, content loss 4.35, style loss 5.10, TV loss 2.02, 0.13 sec
epoch 352, content loss 4.35, style loss 5.09, TV loss 2.02, 0.13 sec
epoch 353, content loss 4.35, style loss 5.09, TV loss 2.02, 0.13 sec
epoch 354, content loss 4.35, style loss 5.09, TV loss 2.02, 0.13 sec
epoch 355, content loss 4.35, style loss 5.09, TV loss 2.02, 0.13 sec
epoch 356, content loss 4.35, style loss 5.09, TV loss 2.02, 0.13 sec
epoch 357, content loss 4.35, style loss 5.09, TV loss 2.02, 0.13 sec
epoch 358, content loss 4.34, style loss 5.08, TV loss 2.02, 0.14 sec
epoch 359, content loss 4.34, style loss 5.08, TV loss 2.02, 0.13 sec
epoch 360, content loss 4.34, style loss 5.08, TV loss 2.02, 0.13 sec
epoch 361, content loss 4.34, style loss 5.08, TV loss 2.02, 0.13 sec
epoch 362, content loss 4.34, style loss 5.08, TV loss 2.03, 0.13 sec
epoch 363, content loss 4.34, style loss 5.08, TV loss 2.03, 0.13 sec
epoch 364, content loss 4.34, style loss 5.08, TV loss 2.03, 0.13 sec
epoch 365, content loss 4.34, style loss 5.07, TV loss 2.03, 0.13 sec
epoch 366, content loss 4.34, style loss 5.07, TV loss 2.03, 0.13 sec
epoch 367, content loss 4.34, style loss 5.07, TV loss 2.03, 0.13 sec
epoch 368, content loss 4.33, style loss 5.07, TV loss 2.03, 0.13 sec
epoch 369, content loss 4.33, style loss 5.07, TV loss 2.03, 0.13 sec
epoch 370, content loss 4.33, style loss 5.07, TV loss 2.03, 0.13 sec
epoch 371, content loss 4.33, style loss 5.06, TV loss 2.03, 0.13 sec
epoch 372, content loss 4.33, style loss 5.06, TV loss 2.03, 0.13 sec
epoch 373, content loss 4.33, style loss 5.06, TV loss 2.03, 0.13 sec
epoch 374, content loss 4.33, style loss 5.06, TV loss 2.03, 0.20 sec
epoch 375, content loss 4.33, style loss 5.06, TV loss 2.03, 0.13 sec
epoch 376, content loss 4.33, style loss 5.06, TV loss 2.03, 0.13 sec
epoch 377, content loss 4.33, style loss 5.06, TV loss 2.03, 0.13 sec
epoch 378, content loss 4.33, style loss 5.05, TV loss 2.03, 0.13 sec
epoch 379, content loss 4.32, style loss 5.05, TV loss 2.03, 0.13 sec
epoch 380, content loss 4.32, style loss 5.05, TV loss 2.03, 0.13 sec
epoch 381, content loss 4.32, style loss 5.05, TV loss 2.03, 0.13 sec
epoch 382, content loss 4.32, style loss 5.05, TV loss 2.03, 0.13 sec
epoch 383, content loss 4.32, style loss 5.05, TV loss 2.03, 0.13 sec
epoch 384, content loss 4.32, style loss 5.04, TV loss 2.03, 0.13 sec
epoch 385, content loss 4.32, style loss 5.04, TV loss 2.03, 0.13 sec
epoch 386, content loss 4.32, style loss 5.04, TV loss 2.03, 0.13 sec
epoch 387, content loss 4.32, style loss 5.04, TV loss 2.03, 0.13 sec
epoch 388, content loss 4.32, style loss 5.04, TV loss 2.03, 0.13 sec
epoch 389, content loss 4.31, style loss 5.04, TV loss 2.03, 0.13 sec
epoch 390, content loss 4.31, style loss 5.04, TV loss 2.03, 0.13 sec
epoch 391, content loss 4.31, style loss 5.03, TV loss 2.03, 0.13 sec
epoch 392, content loss 4.31, style loss 5.03, TV loss 2.03, 0.13 sec
epoch 393, content loss 4.31, style loss 5.03, TV loss 2.03, 0.15 sec
epoch 394, content loss 4.31, style loss 5.03, TV loss 2.03, 0.13 sec
epoch 395, content loss 4.31, style loss 5.03, TV loss 2.03, 0.13 sec
epoch 396, content loss 4.31, style loss 5.03, TV loss 2.03, 0.13 sec
epoch 397, content loss 4.31, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 398, content loss 4.31, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 399, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
change lr to 1.0e-04
epoch 401, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 402, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 403, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 404, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 405, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 406, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 407, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 408, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 409, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 410, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 411, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 412, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 413, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 414, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 415, content loss 4.30, style loss 5.02, TV loss 2.03, 0.25 sec
epoch 416, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 417, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 418, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 419, content loss 4.30, style loss 5.02, TV loss 2.03, 0.14 sec
epoch 420, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 421, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 422, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 423, content loss 4.30, style loss 5.02, TV loss 2.03, 0.13 sec
epoch 424, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 425, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 426, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 427, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 428, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 429, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 430, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 431, content loss 4.30, style loss 5.01, TV loss 2.03, 0.85 sec
epoch 432, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 433, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 434, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 435, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 436, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 437, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 438, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 439, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 440, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 441, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 442, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 443, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 444, content loss 4.30, style loss 5.01, TV loss 2.03, 0.15 sec
epoch 445, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 446, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 447, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 448, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 449, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 451, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 452, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 453, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 454, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 455, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 456, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 457, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 458, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 459, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 460, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 461, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 462, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 463, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 464, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 465, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 466, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 467, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 468, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 469, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 470, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 471, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 472, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 473, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 474, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 475, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 476, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 477, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 478, content loss 4.30, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 479, content loss 4.29, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 480, content loss 4.29, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 481, content loss 4.29, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 482, content loss 4.29, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 483, content loss 4.29, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 484, content loss 4.29, style loss 5.01, TV loss 2.03, 0.13 sec
epoch 485, content loss 4.29, style loss 5.00, TV loss 2.03, 0.13 sec
epoch 486, content loss 4.29, style loss 5.00, TV loss 2.03, 0.13 sec
epoch 487, content loss 4.29, style loss 5.00, TV loss 2.03, 0.13 sec
epoch 488, content loss 4.29, style loss 5.00, TV loss 2.03, 0.13 sec
epoch 489, content loss 4.29, style loss 5.00, TV loss 2.03, 0.13 sec
epoch 490, content loss 4.29, style loss 5.00, TV loss 2.03, 0.13 sec
epoch 491, content loss 4.29, style loss 5.00, TV loss 2.03, 0.14 sec
epoch 492, content loss 4.29, style loss 5.00, TV loss 2.03, 0.13 sec
epoch 493, content loss 4.29, style loss 5.00, TV loss 2.03, 0.13 sec
epoch 494, content loss 4.29, style loss 5.00, TV loss 2.03, 0.13 sec
epoch 495, content loss 4.29, style loss 5.00, TV loss 2.03, 0.13 sec
epoch 496, content loss 4.29, style loss 5.00, TV loss 2.03, 0.13 sec
epoch 497, content loss 4.29, style loss 5.00, TV loss 2.03, 0.13 sec
epoch 498, content loss 4.29, style loss 5.00, TV loss 2.03, 0.13 sec
epoch 499, content loss 4.29, style loss 5.00, TV loss 2.03, 0.13 sec
generate neural-style-1.png

```
