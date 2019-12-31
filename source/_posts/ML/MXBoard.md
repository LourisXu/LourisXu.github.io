---
title: MXBoard
translate_title: mxboard
date: 2019-11-23 15:23:53
tags:
  - ML
toc: true
---
> # 写在前面

MXBoard与Pytorch的可视化工具[TensorBoardX](https://github.com/lanpa/tensorboardX)一样，得益于TeamHG-Memx组织奖TensorFlow中写数据到事件文件（event files）的提取出来的算法，开发者们只需要将这个算法嵌入到深度学习的框架中，就可以使用TensorBoard来可视化框架特有的数据结构。

> # 快速上手

MXBoard API 的设计参考了TensorBoardX，所有的记录 API 都定义在一个叫 `SummaryWriter` 的类当中，这个类含有诸如记录的文件地址、写文件的频率、写文件的队列大小等等信息，用户可以根据需求设置。当需要把当前数据记录成 TensorBoard 中某种数据类型时，用户只要调用相应的 API 即可。
## 正态分布图
**用MXNet画一个正态分布标准差逐渐减小的数据分布图**
```python
from mxnet import nd
from mxboard import SummaryWriter

with SummaryWriter(logdir='./logs') as sw:
    for i in range(100):
        # create a normal distribution with fixed mean and decreasing std
        data = nd.random.normal(loc=0, scale=10.0 / (i + 1), shape=(100, 3, 8, 8))
        sw.add_histogram(tag='normal_dist', values=data, bins=200, global_step=i)

```
**可视化**
`tensorboard --logdir=./logs --host=127.0.0.1 --port=8888`
![图示](/assets/img/deep_learning/normal_distribution_01.png)
![图示](/assets/img/deep_learning/normal_distribution_02.png)
## 训练可视化
注意：HybridSequential才能可视化网络图
```python
import mxnet as mx
from mxnet import autograd, gluon, init, nd
from mxnet.gluon import loss as gloss, data as gdata, nn
import time
import sys
from mxboard import SummaryWriter

# 定义模型
net = nn.HybridSequential()
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
    step = 0
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n, start = 0.0, 0.0, 0, time.time()

        for X, y in train_iter:
            X, y = X.as_in_context(ctx), y.as_in_context(ctx)
            with autograd.record():
                y_hat = net(X)
                l = loss(y_hat, y).sum()
            l.backward()

            # 记录交叉熵
            sw.add_scalar(tag='cross_entropy', value=l.mean().asscalar(), global_step=step)
            step += 1

            trainer.step(batch_size)
            y = y.astype('float32')
            train_l_sum += l.asscalar()
            train_acc_sum += (y_hat.argmax(axis=1) == y).sum().asscalar()
            n += y.size
        test_acc = evaluate_accuracy(test_iter, net, ctx)
        print('epoch %d, loss %.4f, train acc %.3f, test acc %.3f, time %.1f sec'
              % (epoch + 1, train_l_sum / n, train_acc_sum / n, test_acc, time.time() - start))
        # 记录梯度
        for i, layer in enumerate(net):
            if isinstance(layer, nn.MaxPool2D) is False:
                sw.add_histogram(tag='gradient_%d' % i, values=layer.weight.grad(), global_step=epoch, bins=1000)
        sw.add_scalar(tag='train_acc', value=train_acc_sum / n, global_step=epoch)
        sw.add_scalar(tag='valid_acc', value=test_acc, global_step=epoch)
        # 记录网络图
        if epoch == 0:
            sw.add_graph(net)


lr, num_epochs = 0.9, 5
net.initialize(force_reinit=True, ctx=ctx, init=init.Xavier())
trainer = gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': lr})
net.hybridize()
sw = SummaryWriter(logdir='./logs', flush_secs=5)
train_ch5(net, train_iter, test_iter, batch_size, trainer, ctx, num_epochs)
sw.close()

```
![图示](/assets/img/deep_learning/cross_entropy_train_acc.png)
![图示](/assets/img/deep_learning/net_graph_flow.png)
![图示](/assets/img/deep_learning/gradient_graph.png)
![图示](/assets/img/deep_learning/gradient_histogram.png)
## 可视化卷积层的filters以及feature maps
将卷积层的filters和feature maps当成图片可视化有两个意义：
1.特征平滑规律地filters是模型训练良好的标志之一，未收敛或过拟合模型的卷积层filters会出现很多noise。
2.观察filters和feature maps的图片，特别是第一层卷积的图片可以总结出该层所关注的图片特征，这有助于我们理解卷积神经网络的工作原理。
这里根据LeNet第一个卷积层进行可视化：
```python
from mxnet.gluon import nn, data as gdata
import os
from mxboard import SummaryWriter


def rescale(x, x_min=None, x_max=None):
    if x_min is None:
        x_min = x.min().asscalar()
    if x_max is None:
        x_max = m.max().asscalar()
    return (x-x_min) / (x_max - x_min)


def rescale_per_image(x):
    assert x.ndim == 4
    x = x.copy()
    for i in range(x.shape[0]):
        min_val = x[i].min().asscalar()
        max_val = x[i].max().asscalar()
        x[i] = rescale(x[i], min_val, max_val)
    return x


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
net.load_parameters('LeNet.params')
print(net)
mnist_test = gdata.vision.FashionMNIST(root=os.path.join('.', 'data'), train=False)
feature, _ = mnist_test[0]
print(feature.shape)

feature = feature.transpose((2, 0, 1)).expand_dims(axis=0).astype('float32')
print(feature.shape)
feature /= 255.0

sw = SummaryWriter(logdir='./logs')
sw.add_image(tag='origin_image', image=feature)

# plot conv filter and output
conv1 = net[0]
print(conv1)
print(conv1.weight.data().shape)
out1 = conv1(feature)
out1 = out1.transpose((1, 0, 2, 3))
print(out1.shape)
sw.add_image(tag='conv1_weight', image=rescale_per_image(conv1.weight.data()))
sw.add_image(tag='conv1_output', image=rescale_per_image(out1))
sw.close()

```
## 图片embedding
展示的时候有些问题，代码运行没问题，估计是不同tensorflow版本的问题，目前试了1.13.r1, 1.15.1, 2.0.0都不成功
```Python
from mxnet.gluon import nn, data as gdata
import os
from mxboard import SummaryWriter
from mxnet import nd
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
net.load_parameters('LeNet.params')

mnist_test = gdata.vision.FashionMNIST(root=os.path.join('.', 'data'), train=False)
print(len(mnist_test))
print(type(mnist_test))
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
batch_size = 100

test_iter = gdata.DataLoader(mnist_test.transform_first(transformer),
                             batch_size,
                             shuffle=True,
                             num_workers=num_workers)
convnet_codes = None
resized_images = None
labels = None
for X, y in test_iter:
    fc_output = net(X)
    if convnet_codes is None:
        convnet_codes = fc_output
    else:
        convnet_codes = nd.concat(convnet_codes, fc_output, dim=0)
    if labels is None:
        labels = y
    else:
        labels = nd.concat(labels, y, dim=0)

    if resized_images is None:
        resized_images = X
    else:
        resized_images = nd.concat(resized_images, X, dim=0)

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

labels = labels.asnumpy()
print(resized_images[1, :, 10:20, 10:20])
print(convnet_codes)
print(labels)
with SummaryWriter(logdir=os.path.join('.', 'logs')) as sw:
    sw.add_image(tag='images', image=resized_images[:100])
    sw.add_embedding(tag='image_codes', embedding=convnet_codes[:100], images=resized_images[:100],
                     labels=[text_labels[idx] for idx in labels[:100]])

```

![图示](/assets/img/deep_learning/origin_image.png)
![图示](/assets/img/deep_learning/conv_weight_output.png)


[^1]: [MXNet Blog](https://zh.mxnet.io/blog)
[^1]: [TensorBoardX](https://github.com/lanpa/tensorboardX)
[^2]: [MXBoard](https://github.com/awslabs/mxboard)
