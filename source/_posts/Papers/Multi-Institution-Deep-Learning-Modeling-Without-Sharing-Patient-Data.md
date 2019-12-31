---
title: Multi Institution Deep Learning Modeling Without Sharing Patient Data
date: 2019-09-15 18:56:15
tags:
  - papers
translate_title: Multi-Institution-Deep-Learning-Modeling-Without-Sharing-Patient-Data
---

|类型|说明|
|:--:|:--:|
|论文信息|<font size=4>Multi-Institutional Deep Learning Modeling Without Sharing Patient Data:<br> A Feasibility Study on Brain Tumor Segmentation</font><br><font size=2>Micah J Sheller, G Anthony Reina1, Brandon Edwards, Jason Martin, and Spyridon Bakas</font>|
|解决的问题|隐私保护下非数据共享的分布式深度学习系统|
|系统结构|![图示](/assets/img/papers/Multi-Institutional_Deep_Learning_Modeling_Without_Sharing_Patient_Data_01.png)|
|方法名称|Federated Learning (FL)|
|方法说明|1.owner不用分享数据，仅仅本地训练得到model，进而将得到的modell更新给中心服务器<br>2.**中心服务器将各站点上传的更新权重取平均进行聚合**<br>3.中心服务器分发聚合更新后的权重给各个站点|
|超参数|1.每轮训练的周期(Epochs per round, EpR)<br>2.每轮训练的参与者数量<br>3.模型更新压缩/剪枝方法|
|对比现在方法|1.Cyclic Institutional Incremental Learning (CIIL)<br>2.Institutional Incremental Learning (IIL)|
|Model|U-Net<br>![图示](/assets/img/papers/Multi-Institutional_Deep_Learning_Modeling_Without_Sharing_Patient_Data_02.png)|
|数据|BraTS多模态数据，取FLAIR单模态训练|
|实验|单站点Data-sharing分布，模拟多站点分布，现实的BraTs分布<br>|
|1|BraTs分布上的实验结果|
|2|基准测试--Dice Coefficient：$DC=\frac{2\mid P\bigcap T\mid}{\mid P\mid+\mid T\mid}$, P为预测值，T为真实标签|
|3|$loss=log(\mid P\mid+\mid T\mid+1)-log(2\mid P\bigcap T\mid+1)$|
|4|4-32模型站点分布实验|
|5|基础U-Net实验|
|6|单站点CIIL灾难性遗忘实验|
|参数设置|batchsize=64, learning rate=5e-4, Adam Optimizer|
|未来工作|1.不同站的不同的私有机器学习模型<br>2.不同批量、学习率、优化算法的实验<br>3.异源数据实验<br>4.训练过程中，某些站点接入/移出实验<br>5.语义分割的差异性隐私训练研究|
|结论|1.达到了基于数据分享的集中式性能的99%，甚至在分布不平衡的数据上<br>2.CIIL存在灾难性遗忘问题，且完整的验证必须在每次循环后进行，同步和聚合的花销比FL大<br>3.CIIL和IIL不能很好地应用于多站点，而FL在多站点上保持了其优秀性能|
|疑问与思考|1.没有对比不同参数更新聚合方法--文中解释说不同方法对比通常只是用于缓解与医学领域不相关的参与者限制(What？？？)<br>2.没有对比多个模型<br>3.没有对比多种数据集|

**数据集修改**
```Python
import nibabel as nib
import os
import re
import numpy as np


def find_file(root, img_pattern, label_pattern):
    ls = os.listdir(root)
    img, label = '', ''
    for index in ls:
        sub_path = os.path.join(root, index)
        sub_path = os.path.expanduser(sub_path)
        if os.path.isdir(sub_path):
            find_file(sub_path, img_pattern, label_pattern)
        else:
            match = re.match(img_pattern, sub_path)
            if match is not None:
                img = match.group(0)
            match = re.match(label_pattern, sub_path)
            if match is not None:
                label = match.group(0)
    if img != '' and label != '':
        img_list.append(img)
        label_list.append(label)


def save_files(img_paths, label_paths, train_or_test):
    for img_path, label_path in zip(img_paths, label_paths):
        img_name = img_path[img_path.rfind(os.sep) + 1:]
        label_name = label_path[label_path.rfind(os.sep) + 1:]

        print(img_path, label_path)
        print(img_name, label_name)

        img = nib.load(img_path).get_data()
        label = nib.load(label_path).get_data()

        np.save(save_path + os.sep + str(img_name).split('.')[0] + train_or_test + '.npy', np.array(img))
        np.save(save_path + os.sep + str(label_name).split('.')[0] + train_or_test + '.npy', np.array(label))


data_path = os.path.join('D:', 'dataset', 'MICCAI_BraTS_2018_Data_Training')
data_path = os.path.expanduser(data_path)
save_path = os.path.join('D:', 'dataset', 'Results')
save_path = os.path.expanduser(save_path)
print(save_path)
img_pattern = '(.+)flair.nii.gz'
label_pattern = '(.+)seg.nii.gz'

img_list, label_list = [], []

find_file(data_path, img_pattern, label_pattern)
save_files(img_list[:-30], label_list[:-30], '_train')
save_files(img_list[-30:], label_list[-30:], '_test')

print('Everything is done!')

```

[^1]:[Multi-Institutional Deep Learning Without Sharing Patient Data](/assets/files/Muli-Institutional_Deep_Learning_Modeling_Without_Sharing_Data.pdf)
