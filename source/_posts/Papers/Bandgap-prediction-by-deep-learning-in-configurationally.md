---
title: Bandgap prediction by deep learning in configurationally hybridized graphene and boron nitride
translate_title: bandgap-prediction-by-deep-learning-in-configurationally
date: 2020-02-26 17:28:50
tags:
  - papers
---
|类型|说明|
|:--:|:--:|
|论文信息|<font size=4>Bandgap prediction by deep learning in configurationally hybridized graphene and boron nitride</font><br><font size=2>Yuan Dong, Chuhan Wu, Chi Zhang, Yingda Liu, Jianlin Cheng and Jian Lin</font>|
|会议期刊|npj Computational Materials 2019|
|创新点|①结合石墨烯(掺杂了H型氮化硼)的蜂窝结构制成了三类不同尺寸超晶孢的数据集，引入了结构特征;<br>②结合当前流行的CNN模型进行Band gap预测|

|介绍|说明|
|:--:|:--|
|Band gap|禁带宽度(Band gap)是半导体的一个重要特征参量，其大小主要决定于半导体的能带结构，即与晶体结构和原子的键合性质等有关|
|结构成分的影响|石墨烯的性质不仅与掺杂剂的浓度和种类有关，也与掺杂剂在石墨烯中的结构有关|
|2D与3D结构|2D结构相比于3D结构复杂度更低，对于模型计算开销较小|
|石墨烯与H-氮化硼|石墨烯与H型氮化硼都有相似的蜂窝型结构，石墨烯是Bandgap为零的半金属材料，而H型氮化硼则是宽Bandgap的半导体材料，很自然的想法是掺杂了H-氮化硼的是模型有适中的Bandgap值|

|数据集|说明|
|:--:|:--|
|①数据结构|由于石墨烯的蜂窝型（六边形）结构的规则性，可以使用矩阵进行结构刻画，只考虑B-N硼氮的一种顺序(黑色：C，蓝色：N，红色：硼)![image](/assets/img/papers/Bandgap_prediction_01.png)|
|②数据集构成|三种不同结构数据：①4×4超晶孢约14000,②5×5超晶孢约49000,③6×6超晶孢约7200，三类中分别取1000作为各自的测试集|

|模型|
|:--:|
|①修改版残差网络RCN|
|②修改版VGG16的VCN|
|③结合GoogleNet和DenseNet的CCN|
|④SVM支持向量机|
|⑤激活函数:三个模型的激活函数不是传统的ReLu、Sigmoid等，而是类似于ReLu的exponential linear units(ELU)![image](/assets/img/papers/Bandgap_prediction_02.png)|


|评价指标|
|:--:|
|解释方差$R^2$|
|平均绝对误差$MAE$|
|均方根误差$RMAE$|
|相对误差${MAE}_F$, ${RMAE}_F$|
|其中$MAE$和${MAE}_F$应该是少了求和符号|
|![image](/assets/img/papers/Bandgap_prediction_03.png)|

|实验|说明|
|:--:|:--|
|①三种不同结构数据集在四种模型上的实验|总体而言，SVM性能最差，VCN性能最好，但是随着超晶孢编程5×5，CCN降低较大，应该与数据集大小有关|
|②迁移学习|由于6×6超晶孢的数据较少，scratch训练结果较差，故通过微调，在4×4以及5×5数据集上训练后迁移到6×6超晶孢的数据集上训练，预测精度大幅上升|
|③不同浓度H-氮化硼的实验||

|结论|
|:--:|
|①CNN模型预测在5×5以及6×6超晶孢数据集上精度超过90%，性能超过传统ML方法|
|②迁移学习能够在小系统上训练的模型迁移到大系统提高预测精度|

|其他|
|:--|
|论文中的不同浓度的实验数据未知，不知道是不是重新采集了不同浓度掺杂剂下的数据|

[^1]: [Bandgap prediction by deep learning in configurationally hybridized graphene and boron nitride](/assets/files/Bandgap_prediction_by_deep_learning_in_configurationally_hybridized_graphene_and_boron_nitride.pdf)
[^2]: [Supplementary](/assets/files/Supplementary_Bandgap_Prediction.pdf)
