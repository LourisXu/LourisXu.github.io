---
title: '(4) Deep Learning: Optimizor'
tags:
  - ML
  - DL
toc: true
translate_title: 4-deep-learning-optimizor
date: 2019-08-05 10:55:20
---
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
