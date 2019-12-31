---
title: A Review of Atutomated Methods for the Detection of Sickle Cell Disease
tags:
  - papers
translate_title: a-review-of-atutomated-methods-for-the-detection-sickle-cell-disease
date: 2019-11-08 09:17:10
---

|类型|说明|
|:--:|:--:|
|论文信息|<font size=4>A Review of Atutomated Methods for the Detection of Sickle Cell Disease</font><br><font size=2>Pradeep Kumar Das, Student Member, IEEE, Sukadev Meher, Member, IEEE, Rutuparna Panda, and Ajith Abraham, Senior Member, IEEE</font>|
|会议期刊|IEEE 2019|


|介绍||
|:--:|:--|
|第一部分|①红细胞（Red Blood Cell, RBC）是组织与外界环境的气体交换的关键角色<br>②血红蛋白（Haemoglobin）为红细胞中氧气携带者。<br>③一般来说血红蛋白生命周期为六周，其包含两个alpha和两个beta链。<br>④镰刀型红细胞疾病（Sickle Cell Disease）源自于双亲的两个血红蛋白基因的非正常表达。<br>⑤正常的红细胞可存活120天，而镰刀型红细胞只能存活10至20天。<br>⑥镰刀型源于血红蛋白S与脱氧分子的聚合过程。<br>⑦细胞形态学是临床上分类的关键<br>⑧由于细胞复杂的本质，如何从背景中分割出细胞以及精确计数是一项富有挑战性的工作。<br>⑨不均匀的像素值、噪声、多元化的损伤细胞的信号强度又是影响医学图像分割的因素。<br>⑩定位、形状、尺寸、形成因子、延伸率、圆度、细胞纹理、椭圆度等都是决定分割效率的特征因素。|
|第二部分||
|镰刀型红细胞检测结构图|![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_01.png)|
|说明|**①预处理**：提高图像质量，限制噪声以及抑制图像失真。<br>**②分割**：分离重叠的细胞，注重周围血液成分（血浆、白细胞）的分离以及诸如血小板等的更小分子的剔除<br>- 分为手动与自动两类细胞分离技术<br>- 不清晰的边界、不完美的手眼协作以及低对比度都会降低手工方法的性能<br>- 自动分割技术能够从高维以及多模态图像中提取信息|
|第三部分||
|综述总体结构|**Section I: Introduction<br>Section II: Segmentaion techniques<br>Section III: feature extraction methods<br>Section IV: detailed analysis of classification techniques<br>Section V: Techniques for both feature extraction and classification purposes<br>Section VI: validation metrics<br> Section VII: detailed analysis of results<br> Section VIII future scope of the research<br>Section IX: Conclusion**|


|镰刀型红细胞分割方法||
|:--:|:--|
|图示|![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_02.png)|


|**A. Region based Segmentaion**||
|:--||
|**1) Contour and Shape based Technique**|**首先定义一个与目标边界相似的轮廓，然后通过某种规则进行修改轮廓，使其接近满足预先定义标准的期望边界**<br><br>**①Deformable Model (DM)**：开始于任意曲线或平面，通过内外力更新<br>- 内力：负责在变形期间维持模型平滑性<br>- 外力：修改模型实现预期形状或边界<br>- 图像特征通过变形模板（Deforming template）提取<br>**②Active Contour**: parametric active contour (PAC)，or geometric active contour (GAC)<br>**③PAC**: 在拉格朗日公式（Kagrangian Formulatioon）中，PAC被表示成参数化曲线<br>**④GAC**: 基于欧拉公式（Euler Formula）的二维距离函数水平集<br>**⑤Snake**：一种流行的能够提取诸如线和边的能量优化主动轮廓(Energy optimizing active contour)技术<br>- 多运用于运动跟踪与立体匹配<br>- 不能处理曲线演变中的拓扑变化<br>**⑥Level Set**：强调形状和平面的数值分析，适用于追踪修改拓扑的形状，而传统主动轮廓方法不能处理曲线拓扑变化<br><br>**由于GAC更少的计算复杂度以及曲线拓扑自适应本质就，其比PAC更优，Level Set能够有效监测镰刀型红细胞轮廓，不仅有效找出重叠的细胞和细胞簇，还能最大限度降低噪声并消除内部空洞**<br><br>**⑦混合集合变形技术（Hybrid geometric deformable technique）**：以结构化的方式利用基于边缘和基于区域信息有效分割医学图像<br>**⑧主动外观模型（Active Appearance Model, AAM）**：其包含纹理信息和形状信息，成功将红细胞从背景中分割出来。|
|**2) Region Growing**|其将满足预先增长标准的像素或子区域整合形成更大的区域。由一组种子点开始，每个种子点整合邻近相似属性的像素。为了有效地进行图像分割，区域增长技术常与边缘检测（Edge Detection Process）处理相结合|
|**3) Region based Level Set Technique**|基于水平集方法得到有效地轮廓，其能够处理轮廓的拓扑变化<br>通过K-means聚类、Fuzzy c means聚类以及高斯混合模型计算能量函数|
|**4) Graph based technique**|同时使用前景以及背景种子点检测医学图像目标对象<br>- 最小割与最大流算法（Min Cut and Max Flow）<br>- Region based statistical model: 能够优化统计区域能量以解决噪声以及非均匀强度变化降低基于图的相关方法性能的问题|


|**B. Thresholding Based Segmentaion**||
|:--||
|**1) Global Thresholding**|**即Fixed threshold technique**<br>①Entropy based fixed threshold<br>②Ostu's threshold|
|**2) Local Thresholding**|①Manual Thresholding: 根据先验知识以或少许简单实验选择阈值，不能准确分割目标对象<br>②Adaptive thresholding: 根据图像信息自动评估阈值，因此更为准确，具体分为以下三类<br>- Edge based thresholding: Canny, Sobel, Laplacian edge detections<br>- Region based thresholding<br>- hybird thresholding|


|**C. Clustering Based Segmentaion**||
|:--||
|**1) Hard Clustering**|目标对象或者像素要么完全属于一个类，要么就不属于该类<br>- K-means<br>- Cluster seperation technique：使用椭圆调整技术（Ellipse Adjustment Technique）<br>|
|**2) Soft Clustering**|目标对象或像素有对应每个聚类的概率<br>- Fuzzy c-means(FCM)：允许像素或对象属于多个类，依据相似性标准，因此由于像素值不均匀以及噪声的存在不能有效分割医学图像，带有基于空间信息的成员函数的修改版FCM能够解决这一问题<br>- Statistical Mixture Model：基于最大可能性（Maximum likelihood, ML）或最大后验（Maximum a posterior）标准评估分布可能性<br>- Gaussian mixture model(GMM): 基于高斯分布评估像素值|


|特征提取方法||
|:--:|:--|
|形态学特征（Morphological Features）|用于镰刀型红细胞分类|
|纵横比（Aspect Ratio）| the ratio of major axis length (M) to the minor axis length (L) of a cell. $$Aspect \, Ratio = \frac{M}{L}$$|
|效率因子（Effect Factor）| a measure of a cells roundness. $$Effect \, factor = \frac{4\pi\times Area}{Perimeter^{2}}$$Effect factor of healthy RBC is approximately 0.9 whereas that of sickle cell is smaller than 0.4.|
|球度（Sphericity）| the closeness between a cell and the perfect sphere.$$Sphericity = \frac{Inscribed \, circle \, radious}{Enclosing \, circle \, radious}$$|
|RFactor|$$RFactor = \frac{Convex\\_Hull}{\pi\times M}$$$Convex\\_Hull$ represents the smallest polygon with fitted-region.|
|Solidity|the ratio of area to the convex area of a cell.$$Solidity = \frac{Area}{Convex\\_Area}$$|
|说明|特征提取的主要目标是为了提取感兴趣区域（Region of interests）纹理特征|
|经典特征提取技术|Gabor滤波（Gabor filter）<br>离散小波变换（Discrete wavelet transform, DWT）<br>灰度游程矩阵（Gray Level Run Length Matrix）<br>线性鉴别分析 （Linear Discriminant Analysis, LDA）<br>主成分分析 （Principal Component Analysis, PCA）|


|分类方法||
|:--:|:--|
|K-Nearest Neighbour (KNN)|- 最简单的非参数机器学习方法之一<br>- Instance-based learing technique: 只需本地更新函数|
|Support Vector Machine (SVM)|
|Artificial Neural Network (ANN)|- 监督学习方法<br>- 通过更新权重优化cost function|
|Self Organising Feature Mapping|
|Levenberg-Marquardt Algorithm|采用均方差作为cost function训练特征向量|
|Random Oracle Model (ROM)|- 一种集成分类器<br>- 由一堆分类器以及随机预言机发展而来<br>- 基于随机预言将训练数据分为两组<br>- 预测时，应用随机预言在两个分类器之间选择一个分类器，然后用分类器对数据进行分类|
|Levenberg-Marquardt Neural Network (LEVNN)|- 利用Levenberg-Marquardt (LM) 算法训练数据<br>- 基于高斯牛顿法(Gauss-Newton)以及最陡下降法(steepest-descent)<br>- 比高斯牛顿法更稳定，比最陡下降法更快<br>- 能够有效地训练中小尺寸的神经网络，但是由于求逆矩阵(Matrix inversion)以及雅各比矩阵(Jacobian Matrix)需要大量计算，所以不适合大的神经网络|
|Trainable decision Tree Classifier (TREEC)|- 包括生长与修剪阶段(Growing and pruning stage)<br>- 生长阶段强调依据局部优化条件迭代分割训练集<br>- 修剪阶段侧重限制异常值以及噪声，能够解决过拟合问题从而提高准确度<br>- 修剪阶段相比生长阶段更快|
|Random Forest Classifier (RFC)|- 监督学习技术<br>- 为训练集的每一个算机选择的子组（subgroup）生成一组决策树（Decision-trees）<br>- 通过中国多决策树有效地对小粒子进行分类|
|Functional Link Neural Network (FLNN)|- 不含隐藏层，单层前馈网络<br>- 有效地运用于函数近似以及分类目的<br>- 功能扩展能够提高输入向量的维度，因此通过FLNN得到一个超平面（Hyperplane）有更优越的鉴别能力<br>- 比多层感知机更快、更具可计算效率|
|Linear Combiner Network (LNN)||
|Hybrid classifier H1|LEVNN与RFC以及Levenberg Nerual Network结合产生H1模型|
|Hybrid classifier H2|基于Fischer鉴别分析的Levenberg-Marquardt learning Nerual Network与RFC结合得到H2模型|
|Extreme learning Machine （ELM）|- 前馈神经网络<br>- 能够限制过拟合问题|
|对比|ROM用于随机猜测基准，LEVNN,TREEC以及RFC是非线性比较模型，而LNN是线性比较模型,<br>H1与H2作为测试模型，H2的性能优于文献[59]中任何其他分类器<br>KNN,SVM,ELM分类器都能够成功将健康红细胞与镰刀型红细胞进行分类<br> Ensemble-learning（一种整合不同分类器的学习技术）能够进一步提高分类性能|


|特征提取以及分类方法||
|:--:|:--|
|Deep Convolutional Neural Networks (CNNs)|- 监督学习方法<br>- 需要大量数据<br>- 医学图像的模式能够有效地识别以及高精度地分类<br>- 能够保留图像的空间关系，使其在医学图像分析领域更加流行|
|Recurrent Neural Networks (RNNs)|①Jordan Neural Network Classifier (JNNC)<br>②Elman Neural Network Classifier (ENNC)<br>③ hybrid Elman-Jordan Neural Network Classifer (EJNNC)<br>这些RNN模型都能够准确可靠的分类镰刀型红细胞（Sickle Cell）<br>- 监督学习方法<br>- 需要大量数据<br>|


|验证方法||
|:--:|:--|
|说明|验证措施（Validation Measure）对于模型定量分析以及找出模型的限制至关重要|
|A. Image|1) Real Image: 应当预处理以提高图像质量，应当关注白细胞、血小板以及噪声的限制<br>2) Artificial Image: 以人工方式使用计算机代码形成完美的真实图像是不可能的<br>3) Synthetic Image：由许多孤立的细胞组成<br>人工图像以及合成图像仅仅用于验证方法的有效性，绝大多数研究者强调使用真实图像进行分割和分类|
|B. Database|ErythrocytesIDB标准数据集：196全景图像，629张个体细胞图像（圆形、细长型以及其他形状）|
|C. Performance Measure|
|True Positive (TP)|准确检测的非健康红细胞数量|
|False Positive (FP)|健康红细胞被错误检测成非健康红细胞的数量|
|True Negative (TN)|准确检测的健康红细胞数量|
|False Negative (FN)|非健康红细胞错误地识别成健康红细胞的数量|
|1) Sensitivity|即真正类率（True Positive Rate, TPR）$$Sensitivity = \frac{TP}{TP+FN}$$|
|2) Specificity|即真负类率（True Negative Rate)$$Specificity = \frac{TN}{TN+FP}$$|
|3) Accuracy|$$Accuracy = \frac{TP+TN}{TP+TN+FP+FN}$$|
|4) Precision|即正预测值(Positive Predictive Value)$$Precision = \frac{TP}{TP+FP}$$|
|5) F1 Score|Sensitivity与Precision的调和平均数（Harmonic Mean）$$F1\, Score = \frac{2\times \left(Sensitivity\times Precision\right)}{\left(Sensitivity + Precision\right)}$$|
|6) J Score|即Youdens J statistic$$J\, Score = Sensitivity + Specificity - 1$$|
|7) False Positive Rate(FPR)|$$FPR = 1 - Specificity$$|
|8) AUC(Area Under the curve)|Recevier Operating Characteristic(ROC)接受者操作特征曲线：<br>TPR与FPR在不同阈值下的曲线，代表二分类器的正确检测能力<br> $$AUC \in [0,1] \\\\Ideal: 1$$|


|技术讨论||
|:--:|:--|
|图示|![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_03.png)![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_04.png)![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_05.png)|
|讨论1|- 基于阈值的分割技术常用于预处理阶段<br>- 然而仅仅使用阈值方法极难实现镰刀型红细胞疾病的检测分割任务，因为其不包含图像的空间信息<br>- 阈值方法仅仅取决于像素值，因此对于非均匀像素值以及噪声特别敏感|
|讨论2|- 许多研究者使用分水岭算法(Watershed Algorithm)进行分割，然而圆霍夫变换(Circular Hough Transform)、主动轮廓(Active Contour)，特别是水平集方法(Level Set method)性能更优<br>- 因为CHT强调圆形边缘，更适合重叠细胞的分离<br>- 基于区域的技术，特别是水平集方法，基于轮廓的方法广泛运用于红细胞分割任务<br> - 水平集方法对于轮廓拓扑变化具有鲁棒性，能够有效高准确度地分割重叠图像|
|讨论3|- 聚类方法例如K-means以及FCM（Fuzzy c-mean）广泛运用于将红细胞从背景分离的任务<br>- 为了有效分割，图像预处理是必要的|
|讨论4|- 机器学习与深度学习如今广泛运用于特征提取和分类<br>- KNN、ANN等能够大幅度提高SCD（Sickle Cell Detection）检测的性能|


|A. Performance Comparison||
|:--:|:--|
|基于人工图像的对比|
|基于圆周调整技术的对比<br>(Circumference Adjustment Technique)|![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_06.png)<br>- 文献[2][8][106]通过圆调整（Circular Adjustment）使用凹点检测（Concave Point Detection）的方法<br>- 使用三目标聚类的人工图像（Artificial Image）<br>- 文献[8]提出的k-curvature techinique（k-曲率技术）由于不准确的局部最大值可能导致了不正确的检测，因为其强调曲率仅仅在一个方向变化，K-曲率汇总检测到的似是而非的局部最大值导致识别了更多的凹点。<br>- 文献[2]中关注k-曲率在水平和垂直方向上的估计，乘以这些曲率的绝对值，然后基于阈值识别凹点，成功移除了假的凹点，因此文献[2]的性能更高|
|基于椭圆调整技术的对比<br>(Ellipse Adjustment Technique)|![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_07.png)<br>- 使用而目标聚类以及三目标聚类的人工图像|
|基于真实图像的对比|
|讨论1|![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_08.png)<br> - 文献[7]总使用了Ellipse Fitting椭圆拟合技术，其依据直线分割（Line Segmentation）技术<br>- 文献[2]不受轮廓噪声的影响，保持了其卓越的性能|
|讨论2|![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_09.png)<br>- 基于椭圆调整技术|
|讨论3|![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_10.png)<br>- 文献[2]的性能优于文献[106][7]|
|讨论4|![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_11.png)<br>- 文献[1]的对比|
|讨论5|![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_12.png)<br>- CHT更具鲁棒性，相比较于分水岭算法，并且速度更快|
|讨论6：KNN分类器|![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_13.png)![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_14.png)<br>|
|讨论7：CNN|![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_15.png)![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_16.png)<br>- k折交叉验证的训练样本有重复，所以输出有可能有或多或少的偏差<br>- 所以文献[125]提出的嵌套交叉验证（Nested Cross Validation）能够解决这一问题，其更可靠，也能避免过拟合和欠拟合问题![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_17.png)<br>- 粗糙的标签（5类）的实验<br>![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_18.png)<br>- 细致的标签（8类）的实验![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_19.png)|
|讨论8：其他参考文献的对比|![图示](/assets/img/papers/A_Review_of_Automated_Methods_for_the_Detection_20.png)|


|B. Clinical Uses||
|:--:|:--|
|1|对于红歌细胞增强、重塑、分类、分割的研究不断进步，SCD检测精度不断提高且更具鲁棒性|
|2|噪声、不均匀像素值、重叠红细胞以及缺少标准数据集，都会影响上述技术的性能|
|3|然而，没有方法关注SCD的严重程度，即根据SCD疾病的程度进行分类的方法|


|C. Hardware Implementation||
|:--:|:--|
|1|检验医学设备的设计需要特变关注技术的高计算复杂度|
|2|水平集方法需要在实时应用的硬件中实施空间域的并行处理，因为其需要大量插值计算，但其较之于主动轮廓方法的优点在于能够应对拓扑变化|
|3|- 区域生长技术(Region growing Technique)能够通过并行计算以及共享内存的方法高效实施<br>- 共享内存能够是分割更快，因为其限制了耳聪全局内存中读取种子点的时间<br>- 另一方面，应当关注特定区域索取邻近元素的时间|
|4|- FCM不适用于实时应用，因为其高计算复杂度（成员函数基于Euclidean distance，以及大数据集时需要大量时间<br>- 因此可以使用修改版的FCM优化计算时间以满足实时应用|
|5|阈值技术更适用于并行处理，因为其仅仅关注像素值以及阈值，对内存需求相对较小以及不需要同步|
|6|- 特征提取以及分类技术适合于医学检测设备的实时应用<br>- 图像变换期间，硬件支持插值能够是系统更加有效。<br>- KNN简单依赖于线性计算，更适合于并行处理<br>- 而ANN需要硬件支持前向网络<br>- 近来，深度学习是一种医学图像分割分类等实时应用的首选方法|
|7|混合CNN-SVM分类器使用Zync-Soc-FPGA架构的硬件，其是性价比高的实时系统|


[^1]: [A Review of Atutomated Methods for the Detection of Sickle Cell Disease](/assets/files/A_Review_of_Automated_Methods_for_the_Detection_of_Sickle_Cell_Disease.pdf)
