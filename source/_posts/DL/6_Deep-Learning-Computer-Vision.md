---
title: '(6) Deep Learning: Computer Vision'
tags:
  - ML
  - DL
toc: true
translate_title: 6-deep-learning-computer-vision
date: 2019-09-05 10:55:20
---
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
