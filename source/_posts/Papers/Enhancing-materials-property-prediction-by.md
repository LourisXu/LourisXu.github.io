---
title: Enhancing materials property prediction by leveraging computational and experimental data using deep transfer learning
translate_title: enhancing-materials-property-prediction-by-leveraging-computational-and-experimental-data-using-deep-transfer-learning
date: 2020-01-19 10:42:52
tags:
  - papers
---

|类型|说明|
|:--:|:--:|
|论文信息|<font size=4>Enhancing materials property prediction by leveraging computational and experimental data using deep transfer learning</font><br><font size=2>Dipendra Jha, Kamal Choudhary, Francesca Tavazza, Wei-keng Liao, Alok Choudhary, Carelyn Campbell & Ankit Agrawal</font>|
|会议期刊|Nature Communications|
|时间|2019|
|解决的问题|利用迁移学习提高材料属性预测的性能|

|数据集||
|:--|:--|
|①OQMD(Open Quantum Materials Discovery Library)|Density Function Theory (DFT)密度泛函理论计算得到的六十多万材料热力学以及结构属性数据库|
|②Materials Project|DFT计算得到材料数据库|
|③Joint Automated Repository for Various Integrated Simulations (JARVIS)|用于各种集成模拟的联合自动化存储库(JARVIS)是一个使用密度泛函理论、经典力场/分子动力学和机器学习的计算科学的集成框架|
|④Experimental Observations|2090种化合物测量值|
|数据库类型|主要分为两类，一类是DFT计算得到的各类材料化合物属性，另一类是实验观测的相应材料的属性值。论文希望通过DFT计算的大型数据库上训练的模型，迁移到实验观测的数据集后能够提高预测精度，加快新材料的发现。<br>论文只选取了JARVIS的11050种以及Materials Project的23641种满足凸包性质的稳定的材料，而主要选取了OQMD逾34万材料化合物的数据，通过元素成分预测形成焓。|
|数据集划分|9:1划分训练集和测试集，同时也做了8:2的相应实验|
|训练方式|OQMD不做10折交叉验证，由于丢弃层的影响，预测十次取其一，而其他数据集上均做10折交叉验证取其最优结果。|
|数据清洗|1.移出形成焓为0以及标准差超过$±5\sigma$的材料<br>2.没有出现在训练集的元素移出输入向量，周期表总共118种元素，处理后只剩下86种元素|

|分析||
|:--:|:--|
|①DFT计算与实验观测值的差异|平均差异为0.1 eV/atom|
|②Training from scratch(SC)|四个数据库各自数据独立初始化训练与OQMD训练得到的模型对比|
|③OQMD-SC模型对于四个数据集的预测|实验发现,OQMD-SC训练得到的模型相比于各自数据库训练得到的模型在各数据库测试集上的预测性能很差，大约是迁移学习预测的误差的2~3倍|
|④迁移学习|OQMD-SC训练得到的模型在通过各个数据库自身数据进行再次训练和微调，预测误差明显降低<br>**注意：论文中这里的CDF累计分布图下标Legend有误，两个都是TL，应该一个TL一个SC**|
|⑤数据集大小的实验|相同精度下，迁移学习需要的数据集是100数量级的，而其他SC训练下的则需要1000数量级的数据|
|⑥预测误差分析|通过各数据集上SC与TL迁移训练的散点图以及累计分布函数（CDF)图发现，EXP（实验观测数据集）的TL预测更聚集与对角线，CDF图也发现其精度更高，在其他数据集上也有相同趋势。|
|⑦预测EXP数据的性能|训练集分别是四个数据库的数据，而测试集是EXP数据，实验发现OQMD-SC与EXP-SC在EXP测试集上的预测结果最接近。然而，各数据集SC训练的误差仍然很大，而OQMD迁移学习对EXP测试集的预测精度提升很大，而另几个数据库的迁移学习预测性能提升微乎其微，再次证实了大数据集对于训练的影响。|
|⑧模型分析|①分析一：模型各层输出PCA降维取第1、2主成分，归一化后可视化为散点图**注意：论文提到了，然而没有图，上篇论文有！**<br>②分析二：利用模型各层输出做二元逻辑回归（金属与非金属、绝缘与导体、磁性与非磁性，论文中只给了第一层的相应实验图，发现SC与TL虽然都不能得到明显二元边界，然而TL能够使得磁性材料更聚集与散点图下方|

|补充材料分析||
|:--|:--|
|①高误差元素的分析：主要分析误差前10的元素，四个数据及上均发现，氧元素均在误差大几类元素的前列，这与其组成的材料在数据集上数量较少有关<br>②与传统机器学习方法的对比<br>③OQMD-SC模型在其他三个数据集上的预测实验|

[^1]: [Enhancing materials property prediction by leveraging computational and experimental data using deep transfer learning](/assets/files/Enhancing_materials_property_prediction_by_leveraging_computational_and_experimental_data_using_deep_transfer_learning.pdf)
[^2]: [Supplementary information](/assets/files/Supplyment_Enhancing_Materials_Property_Prediction_by_Leveraging_Computational.pdf)
[^3]: [Github Repository](https://github.com/LourisXu/MaterialCompound)
