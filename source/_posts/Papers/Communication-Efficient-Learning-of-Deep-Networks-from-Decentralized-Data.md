---
title: Communication-Efficient Learning of Deep Networks from Decentralized Data
translate_title: communication-efficient-learning-of-deep-networks-from-decentralized-data
date: 2019-10-05 21:33:53
tags:
  - papers
---

|类型|说明|
|:--:|:--:|
|论文信息|<font size=4>Communication-Efficient Learning of Deep Networks from Decentralized Data</font><br><font size=2>H.Brendan McMahan, Eider Moore, Daniel Ramage, Seth Hampson, Blaise Agüera y Arcas</font>|
|研究的问题|移动设备的去中心化数据的高效率通信的分布式联合平均算法|
|算法名称|FederatedAveraging Algorithm(FedAVG)|
|前景知识|--|
|有限和形式|$$\min\_{\omega\in\mathbb{R}^{d}} f\left(\omega\right)　　where　　f\left(\omega\right) \stackrel{\text{def}}{=}\frac{1}{n}\sum^{n}\_{i=1}f\_{i}\left(\omega\right).$$For a machine learning problem:$f\_{i}\left(\omega\right)=\ell\left(x\_{i},y\_{i};\omega\right)$|
|分布式形式|$$f\left(\omega\right)=\sum^{K}\_{k=1}\frac{n\_{k}}{n}F\_{k}\left(\omega\right)　　where　　F\_{k}\left(\omega\right)=\frac{1}{n\_{k}}\sum\_{i\in\mathcal{P}\_{k}}f\_{i}\left(\omega\right).$$$K$ clients over which the data is partitioned<br>$\mathcal{P}\_{k}$ the set of indexes of data points on client $k$, $n\_{k}=\mid\mathcal{P}\_{k}\mid$<br>由下文推断$n$为所有client的数据总数（论文没给出），即：$$\sum^{K}\_{k=1}\frac{n\_{k}}{n}=1.$$|
|预期期望|$$\mathbb{E}\_{\mathcal{P}\_{k}}[F\_{k}\left(\omega\right)]=f\left(\omega\right)$$(典型IID假设，而non-IID则不会发生)|
|--|--|
|参考基准|FederatedSGD(FedSGD)|
|典型实现|$\omega\_{t+1}\leftarrow\omega\_{t}-\eta\sum^{K}\_{k=1}\frac{n\_{k}}{n}g\_{k}$.<br>其中，$\sum^{K}\_{k=1}\frac{n\_{k}}{n}g\_{k}=\nabla f\left(\omega\right).$<br>$C=1$，固定学习率$\eta$下计算的$g\_{k}=\nabla F\_{k}\left(\omega\_{t}\right)$<br>等价形式：$\forall k, \omega^{k}\_{t+1}\leftarrow\omega\_{t}-\eta g\_{k},\omega\_{t+1}\leftarrow\sum^{K}\_{k=1}\frac{n\_{k}}{n}\omega^{k}\_{t+1}.$|
|--|--|
|本文算法核心|通过以下迭代,对每个client增加计算：$$\omega^{k}\leftarrow\omega^{k}-\eta\nabla F\_{k}\left(\omega^{k}\right).$$|
|超参数|1.$C$:表示client数量的分数，$C=0.0$表示1个client<br>2.$B$:每个client的本地小批量大小($B=\infty$时，表示本地full-batch)<br>3.$E$:每一轮本地迭代周期数|
|<font color=red size=3>注意</font>|<font color=red size=3>当$B=\infty, E=1$时，FedAVG与FedSGD等价</font><br>本地更新次数：$u\_{k}=E\frac{n\_{k}}{B}.$|
|伪代码|![图示](/assets/img/papers/Communication-Efficient_Learning_of_Deep_Networks_from_Decentralized_Data.png)|

|实验相关|--|
|:--:|:--|
|对比数据集分布|独立同分布IID(Independently Identically Distribution)与非独立同分布non-IID|
|数据集|①MNIST数据集（CV, IID vs. non-IID, both balanced）<br>②The Complete Works of William Shakespeare（NLP, IID vs. non-IID, balanced vs. unbalanced）<br>③CIFAR-10数据集（CV, IID, balanced）<br>④社交网络的提交数据（谷歌内部数据集，NLP, non-IID, unbalanced）|
|模型|1.2NN的多层感知机（数据集①）<br>2.带两个5×5卷积层的CNN（数据集①）<br>3.两层带256个节点的LSTM语言模型（数据集②自然语言处理）<br>4.来自TensoFlow turorial上的模型结构（数据集③）<br>5.256个节点的单LSTM模型|
|实验|--|
|①|超参数$C$增加并行实验|
|②|每个client增加计算实验|
|③|过度优化实验→需要权重衰减|
|④|其他数据集实验（CIFAR)|
|⑤|大范围LSTM模型实验|
|结论|①本文提出的FedAVG算法，即通过增加本地计算量的方法对于非平衡non-IID数据，能够有效减少通信轮次<br>②通过对比增加并行数量和增加单client计算量，发现后者对于训练提升较大！
|思考|1.对于CV的实验全部都会balanced数据集，缺少比对unbalanced数据集上的测试，即每个client的本地数据集大小种类不一致时的实验<br>2.大范围语言模型实验仅仅对于其他条件不变下不同学习率的实验，缺少文中所说增加本地计算量能提高速度在大范围上的说服力（文中解释说大范围测试需要的大量计算资源的限制）<br>3.无法得知实验设备情况|

[^1]: [Communication-Efficient Learning of Deep Networks from Decentralized Data](/assets/files/Communication-Efficient_Learning_of_Deep_Networks.pdf)
