---
title: '(1) Deep Learning: Foundation'
tags:
  - DL
  - ML
toc: true
translate_title: 1-deep-learning-foundation
date: 2019-07-05 10:55:20
---
> # 深度学习基础

[Deep Learning](/assets/files/Deep_Learning.pdf)

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
