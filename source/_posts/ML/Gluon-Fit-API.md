---
title: 'Gluon:Fit API'
tags:
  - ML
toc: true
translate_title: gluon-fit-api
date: 2019-12-08 15:13:33
---
> # MXNet Gluon Fit API

In this tutorial, you will learn how to use the Gluon Fit API which is the easiest way to train deep learning models using the Gluon API in Apache MXNet.

With the Fit API, you can train a deep learning model with a minimal amount of code. Just specify the network, loss function and the data you want to train on. You don’t need to worry about the boiler plate code to loop through the dataset in batches (often called as ‘training loop’). Advanced users can train with bespoke training loops, and many of these use cases will be covered by the Fit API.

To demonstrate the Fit API, you will train an image classification model using the ResNet-18 neural network architecture. The model will be trained using the Fashion-MNIST dataset.

## Basic Usage
```Python
import mxnet as mx
from mxnet import gluon
from mxnet.gluon.model_zoo import vision
from mxnet.gluon.contrib.estimator import estimator
from mxnet.gluon.contrib.estimator.event_handler import TrainBegin, TrainEnd, EpochEnd, CheckpointHandler
import sys
import os

# Prerequisites
gpu_count = mx.context.num_gpus()
ctx = [mx.gpu(i) for i in range(gpu_count)] if gpu_count > 0 else mx.cpu()

# Dataset
fashion_mnist_train = gluon.data.vision.FashionMNIST(root=os.path.join('mxnet', 'datasets', 'fashion-mnist'), train=True)
fashion_mnist_val = gluon.data.vision.FashionMNIST(root=os.path.join('mxnet', 'datasets', 'fashion-mnist'), train=False)

transforms = [gluon.data.vision.transforms.Resize(224),
              gluon.data.vision.transforms.ToTensor()]

transforms = gluon.data.vision.transforms.Compose(transforms)

# Apply the transformations
fashion_mnist_train = fashion_mnist_train.transform_first(transforms)
fashion_mnist_val = fashion_mnist_val.transform_first(transforms)

batch_size = 256
num_workers = 0 if sys.platform.startswith('win') else 4

train_iter = gluon.data.DataLoader(fashion_mnist_train,
                                   batch_size=batch_size,
                                   shuffle=True,
                                   num_workers=num_workers)
val_iter = gluon.data.DataLoader(fashion_mnist_val,
                                 batch_size=batch_size,
                                 shuffle=False,
                                 num_workers=num_workers)

# Model and Optimizers
# net = vision.resnet18_v1(root=os.path.join('mxnet', 'models'), pretrained=False, classes=10)
net = vision.alexnet(root=os.path.join('mxnet', 'models'), pretrained=False, classes=10)
net.initialize(init=mx.init.Xavier(), ctx=ctx)

loss = gluon.loss.SoftmaxCrossEntropyLoss()
learning_rate = 0.04
num_epochs = 10
trainer = gluon.Trainer(net.collect_params(),
                        'sgd',
                        {'learning_rate': learning_rate})
# Train using Fit API
train_acc = mx.metric.Accuracy()

est = estimator.Estimator(net=net,
                          loss=loss,
                          metrics=train_acc,
                          trainer=trainer,
                          context=ctx)
est.fit(train_data=train_iter,
        epochs=num_epochs)

```
## Advanced Usage
The Fit API is also customizable with several Event Handlers which give a fine grained control over the steps in training and exposes callback methods that provide control over the stages involved in training. Available callback methods are: train_begin, train_end, batch_begin, batch_end, epoch_begin and epoch_end.

You can use built-in event handlers such as LoggingHandler, CheckpointHandler or EarlyStoppingHandler to log and save the model at certain time-steps during training. You can also stop the training when the model’s performance plateaus. There are also some default utility handlers that will be added to your estimator by default. For example, StoppingHandler is used to control when the training ends, based on number of epochs or number of batches trained. MetricHandler is used to calculate training metrics at end of each batch and epoch. ValidationHandler is used to validate your model on test data at each epoch’s end and then calculate validation metrics. You can create these utility handlers with different configurations and pass to estimator. This will override the default handler configuration. You can create a custom handler by inheriting one or multiple base event handlers including: TrainBegin, TrainEnd, EpochBegin, EpochEnd, BatchBegin, BatchEnd.

**Handler**
```Python
import mxnet as mx
from mxnet.gluon.contrib.estimator import TrainBegin, TrainEnd, EpochEnd


class LossRecordHandler(TrainBegin, TrainEnd, EpochEnd):
    def __init__(self):
        super(LossRecordHandler, self).__init__()
        self.loss_history = {}

    def train_begin(self, estimator, *args, **kwargs):
        print('Training begin')

    def train_end(self, estimator, *args, **kwargs):
        print('Training ended')
        for loss_name in self.loss_history:
            for i, loss_val in enumerate(self.loss_history[loss_name]):
                print('Epoch: {}, Loss name: {}, Loss value: {}'.format(i, loss_name, loss_val))

    def epoch_end(self, estimator, *args, **kwargs):
        for metric in estimator.train_metrics:
            if isinstance(metric, mx.metric.Loss):
                loss_name, loss_val = metric.get()
                self.loss_history.setdefault(loss_name, []).append(loss_val)
```
**Train**
```Python
import mxnet as mx
from mxnet.gluon import nn
from mxnet import gluon
from mxnet.gluon.model_zoo import vision
from mxnet.gluon.contrib.estimator import estimator
from mxnet.gluon.contrib.estimator.event_handler import TrainBegin, TrainEnd, EpochEnd, CheckpointHandler
import sys
import os
import warnings
from LossRecordHandler import LossRecordHandler

# Prerequisites
gpu_count = mx.context.num_gpus()
ctx = [mx.gpu(i) for i in range(gpu_count)] if gpu_count > 0 else mx.cpu()

# Dataset
fashion_mnist_train = gluon.data.vision.FashionMNIST(root=os.path.join('mxnet', 'datasets', 'fashion-mnist'),
                                                     train=True)
fashion_mnist_val = gluon.data.vision.FashionMNIST(root=os.path.join('mxnet', 'datasets', 'fashion-mnist'), train=False)

transforms = [gluon.data.vision.transforms.Resize(28),
              gluon.data.vision.transforms.ToTensor()]

transforms = gluon.data.vision.transforms.Compose(transforms)

# Apply the transformations
fashion_mnist_train = fashion_mnist_train.transform_first(transforms)
fashion_mnist_val = fashion_mnist_val.transform_first(transforms)

batch_size = 256
num_workers = 0 if sys.platform.startswith('win') else 4

train_iter = gluon.data.DataLoader(fashion_mnist_train,
                                   batch_size=batch_size,
                                   shuffle=True,
                                   num_workers=num_workers)
val_iter = gluon.data.DataLoader(fashion_mnist_val,
                                 batch_size=batch_size,
                                 shuffle=False,
                                 num_workers=num_workers)

# Model and Optimizers
# net = vision.resnet18_v2(root=os.path.join('mxnet', 'models'), pretrained=False, classes=10)
# net = vision.alexnet(root=os.path.join('mxnet', 'models'), pretrained=False, classes=10)
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
net.hybridize()
net.initialize(init=mx.init.Xavier(), ctx=ctx)

loss = gluon.loss.SoftmaxCrossEntropyLoss()
learning_rate = 0.9
num_epochs = 10
trainer = gluon.Trainer(net.collect_params(),
                        'sgd',
                        {'learning_rate': learning_rate})
# Train using Fit API
train_acc = mx.metric.Accuracy()

est = estimator.Estimator(net=net,
                          loss=loss,
                          metrics=train_acc,
                          trainer=trainer,
                          context=ctx)
checkpoint_handler = CheckpointHandler(model_dir='./',
                                       model_prefix='my_model',
                                       monitor=train_acc,
                                       save_best=True)
loss_record_handler = LossRecordHandler()
with warnings.catch_warnings():
    warnings.simplefilter('ignore')
    est.fit(train_data=train_iter,
            val_data=val_iter,
            epochs=num_epochs,
            event_handlers=[checkpoint_handler, loss_record_handler])

```

[^1]: [Gluon:Fit API](http://mxnet.incubator.apache.org/api/python/docs/tutorials/packages/gluon/training/fit_api_tutorial.html)
