---
title: '(2) Deep Learning: Computation'
tags:
  - ML
  - DL
toc: true
translate_title: 2-deep-learning-computation
date: 2019-07-15 10:55:20
---
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
