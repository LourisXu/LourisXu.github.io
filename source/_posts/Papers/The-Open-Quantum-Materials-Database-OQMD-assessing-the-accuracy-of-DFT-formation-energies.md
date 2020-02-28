---
title: >-
  The Open Quantum Materials Database (OQMD): assessing the accuracy of DFT formation energies
tags:
  - papers
translate_title: >-
  the-open-quantum-materials-database-oqmd-assessing-accuracy-of-dft-formation-energies
date: 2020-02-20 20:53:59
---
|类型|说明|
|:--:|:--:|
|论文信息|<font size=4>The Open Quantum Materials Database (OQMD):assessing the accuracy of DFT formation energies</font><br><font size=2>Jonathan Long, Evan Shelhamer, Trevor Darrell<br>UC Berkeley</font>|
|会议期刊|npj Computational Materials 2015|
|解决的问题|密度泛函理论计算的材料信息数据库|

|概述|说明|
|:--:|:--|
|来源|①Inorganic Crystal Structure Database (ICSD)无机晶体结构数据库（剔除了不完整、不合适以及重复的结构）<br>②常见晶体结构变种|
|规模|来自ICSD的32559种化合物，以及另外的259511种假设化合物，还包括约5000种额外的结构用于结构合金和能原材料发现，总计297099种化合物（截止2015）|

|实验|说明|
|:--:|:--|
|①Elemental Ground-State Prediction 元素基态预测及评估|我们发现，在OQMD的设置下，在VASP中实现的89种元素中，有77种元素的DFT能够正确地预测所观察到的基态结构在20种可能的结构中能量最低，误差最大的分别是磷和汞（0.036eV/atom, 0.074 eV/atom)|
|②Formation Energies of Compounds 化合物形成焓预测及评估|![image](/assets/img/papers/OQMD_01.png)<br><br>与实验得到的1670项数据对比，发现平均绝对误差MAE为0.096 eV/atom，为了估计DFT计算的误差，我们还检查了不同实验测量值之间的偏差，发现了绝对误差为0.082 eV/atom，因此DFT和实验形成焓之间的很大一部分误差可能是由于实验的不确定性造成的|
|③与其他DFT数据库以及Miedema Model对比|在820种化合物的形成焓结果中，OQMD的MAE为0.09eV/atom，而Miedema模型的MAE为0.199eV/atom，而在1386种化合无得实验中，OQMD的误差为0.108eV/atom， Material Project则为0.108eV/atom|

|其他|
|:--|
|由于不懂论文涉及的材料计算的专业知识，所以论文只看了个大概|

[^1]: [The Open Quantum Materials Database (OQMD): assessing the accuracy of DFT formation energies](/assets/files/npjcompumats201510.pdf)
