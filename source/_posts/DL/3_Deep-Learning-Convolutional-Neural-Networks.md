---
title: '(3) Deep Learning: Convolutional Neural Networks'
tags:
  - ML
  - DL
toc: true
translate_title: 3-deep-learning-convolutional-neural-networks
date: 2019-07-25 10:55:20
---
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
