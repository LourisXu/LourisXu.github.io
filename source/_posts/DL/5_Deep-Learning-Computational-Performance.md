---
title: '(5) Deep Learning: Computional Performance'
tags:
  - ML
  - DL
toc: true
translate_title: 5-deep-learning-computional-performance
date: 2019-08-15 10:55:20
---
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
