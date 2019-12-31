---
title: 'U-Net: Convolutional Networks for Biomedical Image Segmentation'
tags:
  - papers
translate_title: unet-convolutional-networks-for-biomedical-image-segmentation
date: 2019-09-23 20:04:25
---

|类型|说明|
|:--:|:--:|
|论文信息|<font size=4>U-Net: Convolutional Networks for Biomedical Image Segmentation</font><br><font size=2>Olaf Ronneberger, Philipp Fischer, and Thomas Brox</font>|
|会议期刊|MICCAI 2015|
|作者所在机构|德国弗莱堡大学|
|解决的问题|生物医学分割任务|
|模型名|U-Net|
|模型结构|![图示](/assets/img/papers/U-Net_01.png)|
|**模型特点**|1.U字型结构，上采样需要用到前四个Block生成的特征图<br>2.注意到卷积层No-padding，所以下采样Block产生的特征图大小与上采样后的特征图大小不一致，需要裁减|
|**数据集**|ISBI 2012 挑战赛数据集（注册页面404，无法获取）|
|数据增强|使用3×3的随机替换的平滑变换<br>每个像素的替换使用双三次差值进行计算|
|相关参数|SGD优化算法，momentum=0.99，batchsize=1，框架caffe<br>初始化：标准差为$\sqrt{\frac{2}{N}}$的高斯分布初始化权重, $N$为输入节点个数|
|Softmax|$$p\_k\left(x\right) = \frac{e^{a\_{k}\left(x\right)}}{\sum\_{k^{\prime} = 1}^{K} e^{a\_{k}^{\prime}\left(x\right)}}$$<br>1.$x\in\Omega, \Omega\subset Z^{2}$：x为每个像素<br>2.$a\_{k}\left(x\right)$：每个像素点x在对应特征通道k的得分<br>3.$K$为特征通道数<br>$p\_{k}为对于特征通道即类K的预测分类结果$|
|交叉熵函数|$$E = \sum\_{x\in\Omega}w\left(x\right)log\left(p\_{\ell\left(x\right)}\left(x\right)\right)$$<br>1.$\ell: \Omega \rightarrow \lbrace 1,...,K \rbrace$：每个像素的真是标签<br>2.$\omega:\Omega\rightarrow R$：权重图|
|权重图|$$w\left(x\right) = w\_{c}\left(x\right)+w\_0\cdot exp\left(-\frac{\left(d\_{1}\left(x\right)+d\_{2}\left(x\right)^{2}\right)}{2\sigma^{2}}\right)$$<br>1.$w\_{c}$:平衡每个类频率的权重图<br>2.$d\_{1}:\Omega\rightarrow R$：距离最近细胞边界的距离<br>3.$d\_{2}:\Omega\rightarrow R$：距离次近细胞边界的距离<br>4.$w\_{0}=10, \sigma \approx 5$|
|实验|---|
|1|电子显微镜图像的神经元分割|
|2|胶质母细胞瘤与海拉细胞分割实验|
|结论|1.实现了不同生物医学分割应用上的非常好的性能<br>2.仅仅需要少量标注图像以及可接受的合理训练时间。|
|思考|1.卷积层No-padding导致输出图像与原图不一致，故在其他应用是可以考虑加上padding=1以获得与输入相同大小图像<br>2.数据集全来自ISBI，需要进一步在不同机构采集的图像上实验<br>3.可以考虑将此模型应用于其他任务，例如分类，和目标检测等的实验|

|Achitecture|Specification|
|:--:|:--|
|**Model Component**|
|**BaseConvBlock**|**1.Convolutional Layer**：channels=output_channels, kernel_size=3, padding=0, strides=1<br>**2.ReLu Activation Layer**<br>**3.Convolutional Layer:** channels=output_channels, kernel_size=3, padding=0, strides=1<br>**4.ReLu Activation Layer**(Note: no-padding)|
|**DownSampleBlock**|**1.Max Pooling Layer**：pool_size=2, strides=2<br>**2.BaseConvBlock**(output_channels)|
|**UpSampleBlock**|**1.Deconvolutional Layer**(or Upsampling Layer)：channels=output_channels, kernel_size=2, strides=2<br>**2.BaseConvBlock**(output_channels)
|**Model**|
|**Contracting Path**|
|InputBlock|BaseConvBlock(output_channels)，Output: Feature Map X1|
|1-th DownSampleBlock|output_channels=128, Output: Feature Map X2|
|2-th DownSampleBlock|output_channels=256, Output: Feature Map X3|
|3-th DownSampleBlock|output_channels=512，Output: Feature Map X4|
|4-th DownSampleBlock|output_channels=1024，Output: Feature Map X5|
|**Expanding Path**|
|1-th UpSampleBlock|output_channels=512<br>A new feature map is obtained by connecting Feature Map from deconvolutional layer and Feature Map X4(need to crop) according to the channel dimension, which is used as the input of its BaseConvBlock|
|2-th UpSampleBlock|output_channels=256<br>A new feature map is obtained by connecting Feature Map from deconvolutional layer and Feature Map X3(need to crop) according to the channel dimension, which is used as the input of the BaseConvBlock|
|3-th UpSampleBlock|output_channels=128<br>A new feature map is obtained by connecting Feature Map from deconvolutional layer and Feature Map X2(need to crop) according to the channel dimension, which is used as the input of the BaseConvBlock|
|4-th UpSampleBlock|output_channels=64<br>A new feature map is obtained by connecting Feature Map from deconvolutional layer and Feature Map X1(need to crop) according to the channel dimension, which is used as the input of the BaseConvBlock|
|OutputBlock|1×1 Convolutional Layer：output_channels=num_classes|

**模型实现**
```Python
# U-Net Model
# Note: I modify the U-Net to get the ouput of the same shape as input

from mxnet.gluon import nn, loss as gloss, data as gdata
from mxnet import autograd, nd, init, image
import numpy as np
import logging

logging.basicConfig(level=logging.CRITICAL)


class BaseConvBlock(nn.HybridBlock):
    def __init__(self, channels, **kwargs):
        super(BaseConvBlock, self).__init__(**kwargs)
        # no-padding in the paper
        # here, I use padding to get the output of the same shape as input
        self.conv1 = nn.Conv2D(channels, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2D(channels, kernel_size=3, padding=1)

    def hybrid_forward(self, F, x, *args, **kwargs):
        x = F.relu(self.conv1(x))
        logging.info(x.shape)
        return F.relu(self.conv2(x))


class DownSampleBlock(nn.HybridBlock):
    def __init__(self, channels, **kwargs):
        super(DownSampleBlock, self).__init__(**kwargs)
        self.maxPool = nn.MaxPool2D(pool_size=2, strides=2)
        self.conv = BaseConvBlock(channels)

    def hybrid_forward(self, F, x, *args, **kwargs):
        x = self.maxPool(x)
        logging.info(x.shape)
        return self.conv(x)


class UpSampleBlock(nn.HybridSequential):
    def __init__(self, channels, **kwargs):
        super(UpSampleBlock, self).__init__(**kwargs)
        self.channels = channels
        self.up = nn.Conv2DTranspose(channels, kernel_size=4, padding=1, strides=2)
        self.conv = BaseConvBlock(channels)

    def hybrid_forward(self, F, x1, *args, **kwargs):
        x2 = args[0]
        x1 = self.up(x1)

        # The same as paper
        # x2 = x2[:, :, :x1.shape[2], : x1.shape[3]]

        # Fill in x1 shape to be the same as the x2
        diffY = x2.shape[2] - x1.shape[2]
        diffX = x2.shape[3] - x1.shape[3]
        x1 = nd.pad(x1,
                    mode='constant',
                    constant_value=0,
                    pad_width=(0, 0, 0, 0,
                               diffY // 2, diffY - diffY // 2,
                               diffX // 2, diffX - diffX // 2))
        x = nd.concat(x1, x2, dim=1)
        logging.info(x.shape)
        return self.conv(x)


class UNet(nn.HybridSequential):
    def __init__(self, channels, num_class, **kwargs):
        super(UNet, self).__init__(**kwargs)

        # contracting path
        self.input_conv = BaseConvBlock(64)
        for i in range(4):
            setattr(self, 'down_conv_%d' % i, DownSampleBlock(channels * 2 ** (i + 1)))
        # expanding path
        for i in range(4):
            setattr(self, 'up_conv_%d' % i, UpSampleBlock(channels * 16 // (2 ** (i + 1))))
        self.output_conv = nn.Conv2D(num_class, kernel_size=1)

    def hybrid_forward(self, F, x, *args, **kwargs):
        logging.info('Contracting Path:')
        x1 = self.input_conv(x)
        logging.info(x1.shape)
        x2 = getattr(self, 'down_conv_0')(x1)
        logging.info(x2.shape)
        x3 = getattr(self, 'down_conv_1')(x2)
        logging.info(x3.shape)
        x4 = getattr(self, 'down_conv_2')(x3)
        logging.info(x4.shape)
        x5 = getattr(self, 'down_conv_3')(x4)
        logging.info(x5.shape)
        logging.info('Expansive Path:')
        x = getattr(self, 'up_conv_0')(x5, x4)
        logging.info(x.shape)
        x = getattr(self, 'up_conv_1')(x, x3)
        logging.info(x.shape)
        x = getattr(self, 'up_conv_2')(x, x2)
        logging.info(x.shape)
        x = getattr(self, 'up_conv_3')(x, x1)
        logging.info(x.shape)
        return self.output_conv(x)


# def bilinear_kernel(in_channels, out_channels, kernel_size):
#     factor = (kernel_size + 1) // 2
#     if kernel_size % 2 == 1:
#         center = factor - 1
#     else:
#         center = factor - 0.5
#     og = np.ogrid[:kernel_size, :kernel_size]
#     filt = (1 - abs(og[0] - center) / factor) * (1 - abs(og[1] - center) / factor)
#     weight = np.zeros((in_channels, out_channels, kernel_size, kernel_size), dtype='float32')
#     weight[range(in_channels), range(out_channels), :, :] = filt
#     # 类似对角矩阵
#     return nd.array(weight)

# valid the output shape of all layers
# if __name__ == '__main__':
#     x = nd.random.uniform(0, 1, shape=(1, 3, 1918, 1280))
#     net = UNet(64, 2)
#     net.initialize()
#     logging.info(net(x).shape)

    # x = nd.random.uniform(0, 1, shape=(1, 3, 4, 4))
    # y = nd.random.uniform(0, 1, shape=(1, 3, 5, 6))
    #
    #
    # diffY = y.shape[2] - x.shape[2]
    # diffX = y.shape[3] - x.shape[3]
    # print(diffY)
    # print(diffX)
    # x = nd.pad(x, mode='edge', pad_width=(0, 0, 0, 0,
    #                                       diffY // 2, diffY - diffY // 2,
    #                                       diffX // 2, diffX - diffX // 2))
    # print(x.shape)

    # net = nn.Conv2DTranspose(3, kernel_size=4, strides=2, padding=1)
    # net.initialize(init=init.Constant(bilinear_kernel(3, 3, 4)))
    # img = image.imread('test.jpg')
    # plt.imshow(img.asnumpy())
    # plt.show()
    # X = img.astype('float32').transpose((2, 0, 1)).expand_dims(axis=0) / 255
    # Y = net(X)
    # print('Y shape:', Y.shape)
    # out_img = Y[0].transpose((1, 2, 0))
    # plt.imshow(out_img.asnumpy())
    # plt.show()

```
**模型各层输出形状（B×C×H×W）**
```Python
Contracting Path:
(1, 64, 570, 570)
(1, 64, 568, 568)
(1, 64, 284, 284)
(1, 128, 282, 282)
(1, 128, 280, 280)
(1, 128, 140, 140)
(1, 256, 138, 138)
(1, 256, 136, 136)
(1, 256, 68, 68)
(1, 512, 66, 66)
(1, 512, 64, 64)
(1, 512, 32, 32)
(1, 1024, 30, 30)
(1, 1024, 28, 28)
Expansive Path:
(1, 1024, 56, 56)
(1, 512, 54, 54)
(1, 512, 52, 52)
(1, 512, 104, 104)
(1, 256, 102, 102)
(1, 256, 100, 100)
(1, 256, 200, 200)
(1, 128, 198, 198)
(1, 128, 196, 196)
(1, 128, 392, 392)
(1, 64, 390, 390)
(1, 64, 388, 388)
(1, 2, 388, 388)
```
```Python
Contracting Path:
(1, 64, 572, 572)
(1, 64, 572, 572)
(1, 64, 286, 286)
(1, 128, 286, 286)
(1, 128, 286, 286)
(1, 128, 143, 143)
(1, 256, 143, 143)
(1, 256, 143, 143)
(1, 256, 71, 71)
(1, 512, 71, 71)
(1, 512, 71, 71)
(1, 512, 35, 35)
(1, 1024, 35, 35)
(1, 1024, 35, 35)
Expansive Path:
(1, 1024, 71, 71)
(1, 512, 71, 71)
(1, 512, 71, 71)
(1, 512, 143, 143)
(1, 256, 143, 143)
(1, 256, 143, 143)
(1, 256, 286, 286)
(1, 128, 286, 286)
(1, 128, 286, 286)
(1, 128, 572, 572)
(1, 64, 572, 572)
(1, 64, 572, 572)
(1, 2, 572, 572)
```

[^1]: [U-Net: Convolutional Networks for Biomedical Image Segmentation](/assets/files/U-Net.pdf)
[^2]: [项目地址](https://github.com/LourisXu/MXNet-Unet)
