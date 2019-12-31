---
title: Learning Rates
tags:
  - ML
toc: true
translate_title: learning-rates
date: 2019-12-12 22:06:24
---
> # Learning Rate Finder

Setting the learning rate for stochastic gradient descent (SGD) is crucially important when training neural network because it controls both the speed of convergence and the ultimate performance of the network. Set the learning too low and you could be twiddling your thumbs for quite some time as the parameters update very slowly. Set it too high and the updates will skip over optimal solutions, or worse the optimizer might not converge at all!

Leslie Smith from the U.S. Naval Research Laboratory presented a method for finding a good learning rate in a paper called “Cyclical Learning Rates for Training Neural Networks”. We implement this method in MXNet (with the Gluon API) and create a ‘Learning Rate Finder’ which you can use while training your own networks. We take a look at the central idea of the paper, cyclical learning rate schedules, in the ‘Advanced Learning Rate Schedules’ tutorial.

## Simple Idea
Given an initialized network, a defined loss and a training dataset we take the following steps:

- Train one batch at a time (a.k.a. an iteration)
- Start with a very small learning rate (e.g. 0.000001) and slowly increase it every iteration
- Record the training loss and continue until we see the training loss diverge

We then analyse the results by plotting a graph of the learning rate against the training loss as seen below (taking note of the log scales).

As expected, for very small learning rates we don’t see much change in the loss as the parameter updates are negligible. At a learning rate of 0.001, we start to see the loss fall. Setting the initial learning rate here is reasonable, but we still have the potential to learn faster. We observe a drop in the loss up until 0.1 where the loss appears to diverge. We want to set the initial learning rate as high as possible before the loss becomes unstable, so we choose a learning rate of 0.

## Epoch to iteration
Usually, our unit of work is an epoch (a full pass through the dataset) and the learning rate would typically be held constant throughout the epoch. With the Learning Rate Finder (and cyclical learning rate schedules) we are required to vary the learning rate every iteration. As such we structure our training code so that a single iteration can be run with a given learning rate. You can implement Learner as you wish. Just initialize the network, define the loss and trainer in **__init__** and keep your training logic for a single batch in **iteration**.
```Python
import mxnet as mx

# Set seed for reproducibility
mx.random.seed(42)

class Learner():
    def __init__(self, net, data_loader, ctx):
        """
        :param net: network (mx.gluon.Block)
        :param data_loader: training data loader (mx.gluon.data.DataLoader)
        :param ctx: context (mx.gpu or mx.cpu)
        """
        self.net = net
        self.data_loader = data_loader
        self.ctx = ctx
        # So we don't need to be in `for batch in data_loader` scope
        # and can call for next batch in `iteration`
        self.data_loader_iter = iter(self.data_loader)
        self.net.initialize(mx.init.Xavier(), ctx=self.ctx)
        self.loss_fn = mx.gluon.loss.SoftmaxCrossEntropyLoss()
        self.trainer = mx.gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': .001})

    def iteration(self, lr=None, take_step=True):
        """
        :param lr: learning rate to use for iteration (float)
        :param take_step: take trainer step to update weights (boolean)
        :return: iteration loss (float)
        """
        # Update learning rate if different this iteration
        if lr and (lr != self.trainer.learning_rate):
            self.trainer.set_learning_rate(lr)
        # Get next batch, and move context (e.g. to GPU if set)
        data, label = next(self.data_loader_iter)
        data = data.as_in_context(self.ctx)
        label = label.as_in_context(self.ctx)
        # Standard forward and backward pass
        with mx.autograd.record():
            output = self.net(data)
            loss = self.loss_fn(output, label)
        loss.backward()
        # Update parameters
        if take_step: self.trainer.step(data.shape[0])
        # Set and return loss.
        self.iteration_loss = mx.nd.mean(loss).asscalar()
        return self.iteration_loss

    def close(self):
        # Close open iterator and associated workers
        self.data_loader_iter.shutdown()
```
We also adjust our **DataLoader** so that it continuously provides batches of data and doesn’t stop after a single epoch. We can then call **iteration** as many times as required for the loss to diverge as part of the Learning Rate Finder process. We implement a custom **BatchSampler** for this, that keeps returning random indices of samples to be included in the next batch. We use the **CIFAR-10** dataset for image classification to test our Learning Rate Finder.
```Python
from mxnet.gluon.data.vision import transforms

transform = transforms.Compose([
    # Switches HWC to CHW, and converts to `float32`
    transforms.ToTensor(),
    # Channel-wise, using pre-computed means and stds
    transforms.Normalize(mean=[0.4914, 0.4822, 0.4465],
                         std=[0.2023, 0.1994, 0.2010])
])

dataset = mx.gluon.data.vision.datasets.CIFAR10(train=True).transform_first(transform)

class ContinuousBatchSampler():
    def __init__(self, sampler, batch_size):
        self._sampler = sampler
        self._batch_size = batch_size

    def __iter__(self):
        batch = []
        while True:
            for i in self._sampler:
                batch.append(i)
                if len(batch) == self._batch_size:
                    yield batch
                    batch = []

sampler = mx.gluon.data.RandomSampler(len(dataset))
batch_sampler = ContinuousBatchSampler(sampler, batch_size=128)
data_loader = mx.gluon.data.DataLoader(dataset, batch_sampler=batch_sampler)
```
## Implementation
With preparation complete, we’re ready to write our Learning Rate Finder that wraps the **Learner** we defined above. We implement a **find** method for the procedure, and **plot** for the visualization. Starting with a very low learning rate as defined by **lr_start** we train one iteration at a time and keep multiplying the learning rate by **lr_multiplier**. We analyse the loss and continue until it diverges according to **LRFinderStoppingCriteria** (which is defined later on). You may also notice that we save the parameters and state of the optimizer before the process and restore afterwards. This is so the Learning Rate Finder process doesn’t impact the state of the model, and can be used at any point during training.
```Python
from matplotlib import pyplot as plt

class LRFinder():
    def __init__(self, learner):
        """
        :param learner: able to take single iteration with given learning rate and return loss
           and save and load parameters of the network (Learner)
        """
        self.learner = learner

    def find(self, lr_start=1e-6, lr_multiplier=1.1, smoothing=0.3):
        """
        :param lr_start: learning rate to start search (float)
        :param lr_multiplier: factor the learning rate is multiplied by at each step of search (float)
        :param smoothing: amount of smoothing applied to loss for stopping criteria (float)
        :return: learning rate and loss pairs (list of (float, float) tuples)
        """
        # Used to initialize weights; pass data, but don't take step.
        # Would expect for new model with lazy weight initialization
        self.learner.iteration(take_step=False)
        # Used to initialize trainer (if no step has been taken)
        if not self.learner.trainer._kv_initialized:
            self.learner.trainer._init_kvstore()
        # Store params and optimizer state for restore after lr_finder procedure
        # Useful for applying the method partway through training, not just for initialization of lr.
        self.learner.net.save_parameters("lr_finder.params")
        self.learner.trainer.save_states("lr_finder.state")
        lr = lr_start
        self.results = [] # List of (lr, loss) tuples
        stopping_criteria = LRFinderStoppingCriteria(smoothing)
        while True:
            # Run iteration, and block until loss is calculated.
            loss = self.learner.iteration(lr)
            self.results.append((lr, loss))
            if stopping_criteria(loss):
                break
            lr = lr * lr_multiplier
        # Restore params (as finder changed them)
        self.learner.net.load_parameters("lr_finder.params", ctx=self.learner.ctx)
        self.learner.trainer.load_states("lr_finder.state")
        return self.results

    def plot(self):
        lrs = [e[0] for e in self.results]
        losses = [e[1] for e in self.results]
        plt.figure(figsize=(6,8))
        plt.scatter(lrs, losses)
        plt.xlabel("Learning Rate")
        plt.ylabel("Loss")
        plt.xscale('log')
        plt.yscale('log')
        axes = plt.gca()
        axes.set_xlim([lrs[0], lrs[-1]])
        y_lower = min(losses) * 0.8
        y_upper = losses[0] * 4
        axes.set_ylim([y_lower, y_upper])
        plt.show()
```
You can define the **LRFinderStoppingCriteria** as you wish, but empirical testing suggests using a smoothed average gives a more consistent stopping rule (see **smoothing**). We stop when the smoothed average of the loss exceeds twice the initial loss, assuming there have been a minimum number of iterations (see **min_iter**).
```Python
class LRFinderStoppingCriteria():
    def __init__(self, smoothing=0.3, min_iter=20):
        """
        :param smoothing: applied to running mean which is used for thresholding (float)
        :param min_iter: minimum number of iterations before early stopping can occur (int)
        """
        self.smoothing = smoothing
        self.min_iter = min_iter
        self.first_loss = None
        self.running_mean = None
        self.counter = 0

    def __call__(self, loss):
        """
        :param loss: from single iteration (float)
        :return: indicator to stop (boolean)
        """
        self.counter += 1
        if self.first_loss is None:
            self.first_loss = loss
        if self.running_mean is None:
            self.running_mean = loss
        else:
            self.running_mean = ((1 - self.smoothing) * loss) + (self.smoothing * self.running_mean)
        return (self.running_mean > self.first_loss * 2) and (self.counter >= self.min_iter)
```
## Usage
Using a Pre-activation ResNet-18 from the Gluon model zoo, we instantiate our Learner and fire up our Learning Rate Finder!
```Python
ctx = mx.gpu() if mx.context.num_gpus() else mx.cpu()
net = mx.gluon.model_zoo.vision.resnet18_v2(classes=10)
learner = Learner(net=net, data_loader=data_loader, ctx=ctx)
lr_finder = LRFinder(learner)
lr_finder.find(lr_start=1e-6)
lr_finder.plot()
```
As discussed before, we should select a learning rate where the loss is falling (i.e. from 0.001 to 0.05) but before the loss starts to diverge (i.e. 0.1). We prefer higher learning rates where possible, so we select an initial learning rate of 0.05. Just as a test, we will run 500 epochs using this learning rate and evaluate the loss on the final batch. As we’re working with a single batch of 128 samples, the variance of the loss estimates will be reasonably high, but it will give us a general idea. We save the initialized parameters for a later comparison with other learning rates.
```Python
learner.net.save_parameters("net.params")
lr = 0.05

for iter_idx in range(300):
    learner.iteration(lr=lr)
    if ((iter_idx % 100) == 0):
        print("Iteration: {}, Loss: {:.5g}".format(iter_idx, learner.iteration_loss))
print("Final Loss: {:.5g}".format(learner.iteration_loss))
```
Iteration: 0, Loss: 2.785
Iteration: 100, Loss: 1.6653
Iteration: 200, Loss: 1.4891
Final Loss: 1.1812
We see a sizable drop in the loss from approx. 2.7 to 1.2.
And now we have a baseline, let’s see what happens when we train with a learning rate that’s higher than advisable at 0.5.
```Python
net = mx.gluon.model_zoo.vision.resnet18_v2(classes=10)
learner = Learner(net=net, data_loader=data_loader, ctx=ctx)
learner.net.load_parameters("net.params", ctx=ctx)
lr = 0.5

for iter_idx in range(300):
    learner.iteration(lr=lr)
    if ((iter_idx % 100) == 0):
        print("Iteration: {}, Loss: {:.5g}".format(iter_idx, learner.iteration_loss))
print("Final Loss: {:.5g}".format(learner.iteration_loss))
```
Iteration: 0, Loss: 2.6469
Iteration: 100, Loss: 1.9666
Iteration: 200, Loss: 1.6919
Final Loss: 1.366
We still observe a fall in the loss but aren’t able to reach as low as before.
And lastly, we see how the model trains with a more conservative learning rate of 0.005.
```Python
net = mx.gluon.model_zoo.vision.resnet18_v2(classes=10)
learner = Learner(net=net, data_loader=data_loader, ctx=ctx)
learner.net.load_parameters("net.params", ctx=ctx)
lr = 0.005

for iter_idx in range(300):
    learner.iteration(lr=lr)
    if ((iter_idx % 100) == 0):
        print("Iteration: {}, Loss: {:.5g}".format(iter_idx, learner.iteration_loss))
print("Final Loss: {:.5g}".format(learner.iteration_loss))
```
Iteration: 0, Loss: 2.605
Iteration: 100, Loss: 1.8621
Iteration: 200, Loss: 1.6316
Final Loss: 1.2919
Although we get quite similar results to when we set the learning rate at 0.05 (because we’re still in the region of falling loss on the Learning Rate Finder plot), we can still optimize our network faster using a slightly higher rate.
## Program
```Python
import mxnet as mx
from mxnet import autograd, init
from mxnet.gluon.data.vision import transforms
import os
from mxnet.gluon import nn
from matplotlib import pyplot as plt

# Set seed for reproducibility
mx.random.seed(42)


class Learner(object):
    def __init__(self, net, data_loader, ctx):
        """
        :param net: network (mx.gluon.Block)
        :param data_loader: training data loader (mx.gluon.data.DataLoader)
        :param ctx: context (mx.gpu or mx.cpu)
        """

        self.net = net
        self.data_loader = data_loader
        self.ctx = ctx

        # So we don't need to be in 'for batch in data_loader' scope
        # and can call for next batch in 'iteration'
        self.data_loader_iter = iter(self.data_loader)
        self.net.initialize(mx.init.Xavier(), ctx=self.ctx)
        self.loss_fn = mx.gluon.loss.SoftmaxCrossEntropyLoss()
        self.trainer = mx.gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': 0.001})

    def iteration(self, lr=None, take_step=True):
        """
        :param lr: learning rate to use for iteration (float)
        :param take_step: take trainer step to update weights (boolean)
        :return: iteration loss (float)
        """

        # Update learning rate if different this iteration
        if lr and (lr != self.trainer.learning_rate):
            self.trainer.set_learning_rate(lr)
        # Get next batch, and move context (e.g. to GPU if set)
        data, label = next(self.data_loader_iter)
        data = data.as_in_context(self.ctx)
        label = label.as_in_context(self.ctx)
        # Standard forward and backward pass
        with autograd.record():
            output = self.net(data)
            loss = self.loss_fn(output, label)
        loss.backward()
        # Update parameters
        if take_step:
            self.trainer.step(data.shape[0])
        # Set and return loss.
        self.iteration_loss = mx.nd.mean(loss).asscalar()
        return self.iteration_loss

    def close(self):
        # Close open iterator and associated workers
        self.data_loader_iter.shutdown()


transforms = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean=(0.4914, 0.4822, 0.4465),
                         std=(0.2023, 0.1994, 0.2010))
])

dataset = mx.gluon.data.vision.datasets.CIFAR10(root=os.path.join('mxnet', 'datasets', 'cifar10'), train=True)\
    .transform_first(transforms)


class ContinuousBatchSampler(object):
    def __init__(self, sampler, batch_size):
        self._sampler = sampler
        self._batch_size = batch_size

    def __iter__(self):
        batch = []
        while True:
            for i in self._sampler:
                batch.append(i)
                if len(batch) == self._batch_size:
                    yield batch
                    batch = []


sampelr = mx.gluon.data.RandomSampler(len(dataset))
batch_sampler = ContinuousBatchSampler(sampelr, batch_size=128)
data_loader = mx.gluon.data.DataLoader(dataset, batch_sampler=batch_sampler)


class LRFinder(object):
    def __init__(self, learner):
        """
        :param learner: able to take single iteration with given learning rate and return loss
            and save and load parameters of the network (Learner)
        """
        self.learner = learner

    def find(self, lr_start=1e-6, lr_multiplier=1.1, smoothing=0.3):
        """
        :param lr_start: learning rate to start search (float)
        :param lr_multiplier: factor the learning rate is multiplied by at each step of search (float)
        :param smoothing: amount of smoothing applied to loss for stopping criteria (float)
        :return: learning rate and loss pairs (list of (float, float) tuples)
        """
        # Used to initialize weights: pass data, but don't take step.
        # Would expect for new model with lazy weight initialization
        self.learner.iteration(take_step=False)
        # Used to initialize trainer (if no step has been taken)
        if not self.learner.trainer._kv_initialized:
            self.learner.trainer._init_kvstore()
        # Store params and optimizer state for restore after lr_finder procedure
        # Useful for applying the method partway through training, not just for initialization if lr.
        self.learner.net.save_parameters("lr_finder.params")
        self.learner.trainer.save_states("lr_finder.state")

        lr = lr_start
        self.results = []  # List of (lr, loss) tuples
        stopping_criteria = LRFinderStoppingCriteria(smoothing)
        while True:
            # Run iteration, and block until loss is calculated
            loss = self.learner.iteration(lr)
            self.results.append((lr, loss))
            if stopping_criteria(loss):
                break
            lr = lr * lr_multiplier

        # Restore params (as finder changed them)
        self.learner.net.load_parameters("lr_finder.params", ctx=self.learner.ctx)
        self.learner.trainer.load_states("lr_finder.state")

        return self.results

    def plot(self):
        lrs = [e[0] for e in self.results]
        losses = [e[1] for e in self.results]
        plt.figure(figsize=(6, 8))
        plt.scatter(lrs, losses)
        plt.xlabel("Learning Rate")
        plt.ylabel("Loss")
        plt.xscale('log')
        plt.yscale('log')
        axes = plt.gca()
        axes.set_xlim([lrs[0], lrs[-1]])
        y_lower = min(losses) * 0.8
        y_upper = losses[0] * 4
        axes.set_ylim([y_lower, y_upper])
        plt.show()


class LRFinderStoppingCriteria(object):
    def __init__(self, smoothing=0.3, min_iter=20):
        """
        :param smoothing: applied to running mean which is used for thresholding (float)
        :param min_iter: minimum number of iterations before early stopping can occur (int)
        """
        self.smoothing = smoothing
        self.min_iter = min_iter
        self.first_loss = None
        self.running_mean = None
        self.counter = 0

    def __call__(self, loss):
        """
        :param loss: from single iteration (float)
        :return: indicator to stop (boolean)
        """
        self.counter += 1
        if self.first_loss is None:
            self.first_loss = loss
        if self.running_mean is None:
            self.running_mean = loss
        else:
            self.running_mean = ((1 - self.smoothing) * loss) + (self.smoothing * self.running_mean)
        return (self.running_mean > self.first_loss * 2) and (self.counter >= self.min_iter)


ctx = mx.gpu() if mx.context.num_gpus() else mx.cpu()


def get_net():
    # net = mx.gluon.model_zoo.vision.resnet18_v2(classes=10)
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
    return net


net = get_net()
learner = Learner(net=net, data_loader=data_loader, ctx=ctx)
# lr_finder = LRFinder(learner)
# lr_finder.find(lr_start=1e-7)
# lr_finder.plot()


def learning_iter(learning_rate=0.01):
    for iter_idx in range(300):
        learner.iteration(lr=learning_rate)
        if (iter_idx % 100) == 0:
            print("Iteration: {}, Loss: {:.5g}".format(iter_idx, learner.iteration_loss))
    print("Final Loss: {:.5g}".format(learner.iteration_loss))


lr = 0.05
learning_iter(learning_rate=lr)

learner.net.load_parameters("lr_finder.params")
lr = 0.9
learning_iter(learning_rate=lr)

learner.net.load_parameters("lr_finder.params")
lr = 0.5
learning_iter(learning_rate=lr)

```
> # Learning Rate Schedules

Setting the learning rate for stochastic gradient descent (SGD) is crucially important when training neural networks because it controls both the speed of convergence and the ultimate performance of the network. One of the simplest learning rate strategies is to have a fixed learning rate throughout the training process. Choosing a small learning rate allows the optimizer find good solutions, but this comes at the expense of limiting the initial speed of convergence. Changing the learning rate over time can overcome this tradeoff.
Schedules define how the learning rate changes over time and are typically specified for each epoch or iteration (i.e. batch) of training. Schedules differ from adaptive methods (such as AdaDelta and Adam) because they:
- change the global learning rate for the optimizer, rather than parameter-wise learning rates
- don’t take feedback from the training process and are specified beforehand
In this tutorial, we visualize the schedules defined in **mx.lr_scheduler**, show how to implement custom schedules and see an example of using a schedule while training models. Since schedules are passed to **mx.optimizer.Optimizer** classes, these methods work with both Module and Gluon APIs.
```Python
from __future__ import print_function
import math
import matplotlib.pyplot as plt
import mxnet as mx
from mxnet.gluon import nn
from mxnet.gluon.data.vision import transforms
import numpy as np
```
```Python
def plot_schedule(schedule_fn, iterations=1500):
    # Iteration count starting at 1
    iterations = [i+1 for i in range(iterations)]
    lrs = [schedule_fn(i) for i in iterations]
    plt.scatter(iterations, lrs)
    plt.xlabel("Iteration")
    plt.ylabel("Learning Rate")
    plt.show()
```
## Schedules
In this section, we take a look at the schedules in **mx.lr_scheduler**. All of these schedules define the learning rate for a given iteration, and it is expected that iterations start at 1 rather than 0. So to find the learning rate for the 100th iteration, you can call **schedule(100)**.
## Stepwise Decay Schedule
One of the most commonly used learning rate schedules is called stepwise decay, where the learning rate is reduced by a factor at certain intervals. MXNet implements a **FactorScheduler** for equally spaced intervals, and **MultiFactorScheduler** for greater control. We start with an example of halving the learning rate every 250 iterations. More precisely, the learning rate will be multiplied by **factor** after the **step** index and multiples thereafter. So in the example below the learning rate of the 250th iteration will be 1 and the 251st iteration will be 0.5.
```Python
schedule = mx.lr_scheduler.FactorScheduler(step=250, factor=0.5)
schedule.base_lr = 1
plot_schedule(schedule)
```
![image](/assets/img/deep_learning/learning_rate_schedule_01.png)
Note: the **base_lr** is used to determine the initial learning rate. It takes a default value of 0.01 since we inherit from **mx.lr_scheduler.LRScheduler**, but it can be set as a property of the schedule. We will see later in this tutorial that **base_lr** is set automatically when providing the **lr_schedule** to **Optimizer**. Also be aware that the schedules in **mx.lr_scheduler** have state (i.e. counters, etc) so calling the schedule out of order may give unexpected results.

We can define non-uniform intervals with **MultiFactorScheduler** and in the example below we halve the learning rate after the 250th, 750th (i.e. a step length of 500 iterations) and 900th (a step length of 150 iterations). As before, the learning rate of the 250th iteration will be 1 and the 251th iteration will be 0.5.
```Python
schedule = mx.lr_scheduler.MultiFactorScheduler(step=[250, 750, 900], factor=0.5)
schedule.base_lr = 1
plot_schedule(schedule)
```
![image](/assets/img/deep_learning/learning_rate_schedule_02.png)
## Polynomial Schedule
Stepwise schedules and the discontinuities they introduce may sometimes lead to instability in the optimization, so in some cases smoother schedules are preferred. **PolyScheduler** gives a smooth decay using a polynomial function and reaches a learning rate of 0 after **max_update** iterations. In the example below, we have a quadratic function (**pwr=2**) that falls from 0.998 at iteration 1 to 0 at iteration 1000. After this the learning rate stays at 0, so nothing will be learnt from **max_update** iterations onwards.
```Python
schedule = mx.lr_scheduler.PolyScheduler(max_update=1000, base_lr=1, pwr=2)
plot_schedule(schedule)
```
![image](/assets/img/deep_learning/learning_rate_schedule_03.png)
Note: unlike **FactorScheduler**, the **base_lr** is set as an argument when instantiating the schedule.
And we don’t evaluate at **iteration=0** (to get **base_lr**) since we are working with schedules starting at **iteration=1**.

## Custom Schedules
You can implement your own custom schedule with a function or callable class, that takes an integer denoting the iteration index (starting at 1) and returns a float representing the learning rate to be used for that iteration. We implement the Cosine Annealing Schedule in the example below as a callable class (see **__call__** method).
```Python
class CosineAnnealingSchedule():
    def __init__(self, min_lr, max_lr, cycle_length):
        self.min_lr = min_lr
        self.max_lr = max_lr
        self.cycle_length = cycle_length

    def __call__(self, iteration):
        if iteration <= self.cycle_length:
            unit_cycle = (1 + math.cos(iteration * math.pi / self.cycle_length)) / 2
            adjusted_cycle = (unit_cycle * (self.max_lr - self.min_lr)) + self.min_lr
            return adjusted_cycle
        else:
            return self.min_lr


schedule = CosineAnnealingSchedule(min_lr=0, max_lr=1, cycle_length=1000)
plot_schedule(schedule)
```
![image](/assets/img/deep_learning/learning_rate_schedule_04.png)
## Using schedules
While training a simple handwritten digit classifier on the MNIST dataset, we take a look at how to use a learning rate schedule during training. Our demonstration model is a basic convolutional neural network. We start by preparing our **DataLoader** and defining the network.

As discussed above, the schedule should return a learning rate given an (1-based) iteration index.
```Python
# Use GPU if one exists, else use CPU
ctx = mx.gpu() if mx.context.num_gpus() else mx.cpu()

# MNIST images are 28x28. Total pixels in input layer is 28x28 = 784
num_inputs = 784
# Clasify the images into one of the 10 digits
num_outputs = 10
# 64 images in a batch
batch_size = 64

# Load the training data
train_dataset = mx.gluon.data.vision.MNIST(train=True).transform_first(transforms.ToTensor())
train_dataloader = mx.gluon.data.DataLoader(train_dataset, batch_size, shuffle=True, num_workers=5)

# Build a simple convolutional network
def build_cnn():
    net = nn.HybridSequential()
    with net.name_scope():
        # First convolution
        net.add(nn.Conv2D(channels=10, kernel_size=5, activation='relu'))
        net.add(nn.MaxPool2D(pool_size=2, strides=2))
        # Second convolution
        net.add(nn.Conv2D(channels=20, kernel_size=5, activation='relu'))
        net.add(nn.MaxPool2D(pool_size=2, strides=2))
        # Flatten the output before the fully connected layers
        net.add(nn.Flatten())
        # First fully connected layers with 512 neurons
        net.add(nn.Dense(512, activation="relu"))
        # Second fully connected layer with as many neurons as the number of classes
        net.add(nn.Dense(num_outputs))
        return net

net = build_cnn()
```
We then initialize our network (technically deferred until we pass the first batch) and define the loss.
```Python
# Initialize the parameters with Xavier initializer
net.collect_params().initialize(mx.init.Xavier(), ctx=ctx)
# Use cross entropy loss
softmax_cross_entropy = mx.gluon.loss.SoftmaxCrossEntropyLoss()
```
We’re now ready to create our schedule, and in this example we opt for a stepwise decay schedule using **MultiFactorScheduler**. Since we’re only training a demonstration model for a limited number of epochs (10 in total) we will exaggerate the schedule and drop the learning rate by 90% after the 4th, 7th and 9th epochs. We call these steps, and the drop occurs after the step index. Schedules are defined for iterations (i.e. training batches), so we must represent our steps in iterations too.
```Python
steps_epochs = [4, 7, 9]
# assuming we keep partial batches, see `last_batch` parameter of DataLoader
iterations_per_epoch = math.ceil(len(train_dataset) / batch_size)
# iterations just before starts of epochs (iterations are 1-indexed)
steps_iterations = [s*iterations_per_epoch for s in steps_epochs]
print("Learning rate drops after iterations: {}".format(steps_iterations))
Learning rate drops after iterations: [3752, 6566, 8442]
schedule = mx.lr_scheduler.MultiFactorScheduler(step=steps_iterations, factor=0.1)
```
**We create our ``Optimizer`` and pass the schedule via the ``lr_scheduler`` parameter.** In this example we’re using Stochastic Gradient Descent.
```Python
sgd_optimizer = mx.optimizer.SGD(learning_rate=0.03, lr_scheduler=schedule)
```
And we use this optimizer (with schedule) in our **Trainer** and train for 10 epochs. Alternatively, we could have set the **optimizer** to the string **sgd**, and pass a dictionary of the optimizer parameters directly to the trainer using **optimizer_params**.
```Python
trainer = mx.gluon.Trainer(params=net.collect_params(), optimizer=sgd_optimizer)
num_epochs = 10
# epoch and batch counts starting at 1
for epoch in range(1, num_epochs+1):
    # Iterate through the images and labels in the training data
    for batch_num, (data, label) in enumerate(train_dataloader, start=1):
        # get the images and labels
        data = data.as_in_context(ctx)
        label = label.as_in_context(ctx)
        # Ask autograd to record the forward pass
        with mx.autograd.record():
            # Run the forward pass
            output = net(data)
            # Compute the loss
            loss = softmax_cross_entropy(output, label)
        # Compute gradients
        loss.backward()
        # Update parameters
        trainer.step(data.shape[0])

        # Show loss and learning rate after first iteration of epoch
        if batch_num == 1:
            curr_loss = mx.nd.mean(loss).asscalar()
            curr_lr = trainer.learning_rate
            print("Epoch: %d; Batch %d; Loss %f; LR %f" % (epoch, batch_num, curr_loss, curr_lr))
```
Epoch: 1; Batch 1; Loss 2.304071; LR 0.030000

Epoch: 2; Batch 1; Loss 0.059640; LR 0.030000

Epoch: 3; Batch 1; Loss 0.072601; LR 0.030000

Epoch: 4; Batch 1; Loss 0.042228; LR 0.030000

Epoch: 5; Batch 1; Loss 0.025745; LR 0.003000

Epoch: 6; Batch 1; Loss 0.027391; LR 0.003000

Epoch: 7; Batch 1; Loss 0.048237; LR 0.003000

Epoch: 8; Batch 1; Loss 0.024213; LR 0.000300

Epoch: 9; Batch 1; Loss 0.008892; LR 0.000300

Epoch: 10; Batch 1; Loss 0.006875; LR 0.000030

We see that the learning rate starts at 0.03, and falls to 0.00003 by the end of training as per the schedule we defined.
## Manually setting the learning rate: Gluon API only
When using the method above you don’t need to manually keep track of iteration count and set the learning rate, so this is the recommended approach for most cases. Sometimes you might want more fine-grained control over setting the learning rate though, so Gluon’s **Trainer** provides the **set_learning_rate** method for this.

We replicate the example above, but now keep track of the **iteration_idx**, call the schedule and set the learning rate appropriately using **set_learning_rate**. We also use **schedule.base_lr** to set the initial learning rate for the schedule since we are calling the schedule directly and not using it as part of the **Optimizer**.
```Python
net = build_cnn()
net.collect_params().initialize(mx.init.Xavier(), ctx=ctx)

schedule = mx.lr_scheduler.MultiFactorScheduler(step=steps_iterations, factor=0.1)
schedule.base_lr = 0.03
sgd_optimizer = mx.optimizer.SGD()
trainer = mx.gluon.Trainer(params=net.collect_params(), optimizer=sgd_optimizer)

iteration_idx = 1
num_epochs = 10
# epoch and batch counts starting at 1
for epoch in range(1, num_epochs + 1):
    # Iterate through the images and labels in the training data
    for batch_num, (data, label) in enumerate(train_dataloader, start=1):
        # get the images and labels
        data = data.as_in_context(ctx)
        label = label.as_in_context(ctx)
        # Ask autograd to record the forward pass
        with mx.autograd.record():
            # Run the forward pass
            output = net(data)
            # Compute the loss
            loss = softmax_cross_entropy(output, label)
        # Compute gradients
        loss.backward()
        # Update the learning rate
        lr = schedule(iteration_idx)
        trainer.set_learning_rate(lr)
        # Update parameters
        trainer.step(data.shape[0])
        # Show loss and learning rate after first iteration of epoch
        if batch_num == 1:
            curr_loss = mx.nd.mean(loss).asscalar()
            curr_lr = trainer.learning_rate
            print("Epoch: %d; Batch %d; Loss %f; LR %f" % (epoch, batch_num, curr_loss, curr_lr))
        iteration_idx += 1
```
Epoch: 1; Batch 1; Loss 2.334119; LR 0.030000

Epoch: 2; Batch 1; Loss 0.178930; LR 0.030000

Epoch: 3; Batch 1; Loss 0.142640; LR 0.030000

Epoch: 4; Batch 1; Loss 0.041116; LR 0.030000

Epoch: 5; Batch 1; Loss 0.051049; LR 0.003000

Epoch: 6; Batch 1; Loss 0.027170; LR 0.003000

Epoch: 7; Batch 1; Loss 0.083776; LR 0.003000

Epoch: 8; Batch 1; Loss 0.082553; LR 0.000300

Epoch: 9; Batch 1; Loss 0.027984; LR 0.000300

Epoch: 10; Batch 1; Loss 0.030896; LR 0.000030

Once again, we see the learning rate start at 0.03, and fall to 0.00003 by the end of training as per the schedule we defined.
## Program
```Python
from __future__ import print_function
import math
from matplotlib import pyplot as plt
import mxnet as mx
from mxnet import autograd
from mxnet.gluon import nn
from mxnet.gluon.data.vision import transforms
import numpy as np
import os
import sys


def plot_schedule(schedule_fn, iterations=1500):
    # Iteration count starting at 1
    iterations = [i + 1 for i in range(iterations)]
    lrs = [schedule_fn(i) for i in iterations]
    plt.scatter(iterations, lrs)
    plt.xlabel('Iteration')
    plt.ylabel('Learning Rate')
    plt.show()


# schedule = mx.lr_scheduler.FactorScheduler(step=250, base_lr=1, factor=0.5)
# plot_schedule(schedule)
#
# schedule = mx.lr_scheduler.MultiFactorScheduler(step=[250, 750, 900], base_lr=1, factor=0.5)
# plot_schedule(schedule)
#
# schedule = mx.lr_scheduler.PolyScheduler(max_update=1000, base_lr=1, pwr=2)
# plot_schedule(schedule)
#
# schedule = mx.lr_scheduler.CosineScheduler(max_update=1000, base_lr=1)
# plot_schedule(schedule)

# Use GPU if one exists, else, use CPU
ctx = mx.gpu() if mx.context.num_gpus() else mx.cpu()
# MNIST images are 28×28,. Total pixels in input layer is 28×28 = 784
num_inputs = 784
# Classify the images into one of the 10 digits
num_outputs = 10
# 64 images in a batch
batch_size = 64

num_workers = 0 if sys.platform.startswith('win') else 4

# load the training data
train_dataset = mx.gluon.data.vision.MNIST(root=os.path.join('mexnt', 'datasets', 'mnist'), train=True)\
    .transform_first(transforms.ToTensor())
train_dataloader = mx.gluon.data.DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=num_workers)


# Build a simple convolutional network
def build_cnn():
    net = nn.HybridSequential()
    with net.name_scope():
        net.add(nn.Conv2D(channels=10, kernel_size=5, activation='relu'),
                nn.MaxPool2D(pool_size=2, strides=2),
                nn.Conv2D(channels=20, kernel_size=5, activation='relu'),
                nn.MaxPool2D(pool_size=2, strides=2),
                nn.Flatten(),
                nn.Dense(512, activation='relu'),
                nn.Dense(num_outputs))
        return net


net = build_cnn()
net.initialize(init=mx.init.Xavier(), ctx=ctx)
softmax_cross_entropy = mx.gluon.loss.SoftmaxCrossEntropyLoss()

steps_epochs = [4, 7, 9]
# assuming we keep partial batches, see 'last_batch' parameter of DataLoader
iterations_per_epoch = math.ceil(len(train_dataset) / batch_size)
# iterations just before starts of epochs (iterations are 1-indexed)
steps_iterations = [s*iterations_per_epoch for s in steps_epochs]
print('Learning rate drops after iterations: {}'.format(steps_iterations))

# schedule = mx.lr_scheduler.MultiFactorScheduler(step=steps_iterations, factor=0.1)
# sgd_optimizer = mx.optimizer.SGD(learning_rate=0.03, lr_scheduler=schedule)
# trainer = mx.gluon.Trainer(params=net.collect_params(), optimizer=sgd_optimizer)
#
# num_epochs = 10
# # epoch and batch counts starting at 1
# for epoch in range(1, num_epochs + 1):
#     # Iterate through the images and labels in the training data
#     for batch_num, (data, label) in enumerate(train_dataloader, start=1):
#         # get the images and labels
#         data = data.as_in_context(ctx)
#         label = label.as_in_context(ctx)
#         # Ask autograd to record the forward pass
#         with autograd.record():
#             # Run the forward pass
#             output = net(data)
#             # Compute the loss
#             loss = softmax_cross_entropy(output, label)
#         # Compute gradients
#         loss.backward()
#         # Update parameters
#         trainer.step(data.shape[0])
#
#         # Show loss and learning rate after first iteration of epoch
#         if batch_num == 1:
#             curr_loss = mx.nd.mean(loss).asscalar()
#             curr_lr = trainer.learning_rate
#             print('Epoch: %d: Batch %d: Loss %f: LR %f'
#                   % (epoch, batch_num, curr_loss, curr_lr))


schedule = mx.lr_scheduler.MultiFactorScheduler(step=steps_iterations, base_lr=0.03, factor=0.1)
sgd_optimizer = mx.optimizer.SGD()
trainer = mx.gluon.Trainer(params=net.collect_params(), optimizer=sgd_optimizer)

iteration_idx = 1
num_epochs = 10
# epoch and batch counts starting at 1
for epoch in range(1, num_epochs + 1):
    # Iterate through the images and labels in the training data
    for batch_num, (data, label) in enumerate(train_dataloader, start=1):
        # get the images and labels
        data = data.as_in_context(ctx)
        label = label.as_in_context(ctx)
        # Ask autograd to record the forward pass
        with autograd.record():
            # Run the forward pass
            output = net(data)
            # Compute the loss
            loss = softmax_cross_entropy(output, label)
        # Compute gradients
        loss.backward()
        # Update the learning rate
        lr = schedule(iteration_idx)
        trainer.set_learning_rate(lr)
        # Update parameters
        trainer.step(data.shape[0])

        # Show loss and learning rate after first iteration of epoch
        if batch_num == 1:
            curr_loss = mx.nd.mean(loss).asscalar()
            curr_lr = trainer.learning_rate
            print('Epoch: %d: Batch %d: Loss %f: LR %f'
                  % (epoch, batch_num, curr_loss, curr_lr))
        iteration_idx += 1

```
[^1]: [Learning Rate Finder](http://mxnet.incubator.apache.org/api/python/docs/tutorials/packages/gluon/training/learning_rates/learning_rate_finder.html)
[^2]: [Learning Rate Schedule](http://mxnet.incubator.apache.org/api/python/docs/tutorials/packages/gluon/training/learning_rates/learning_rate_schedules.html)
