---
title: librosa--音频处理库学习
tags:
  - ML
toc: true
translate_title: librosaaudio-processing-library-learning
date: 2020-03-21 22:46:46
---
初步使用，具体特征的意思，运算过程还有待跟进...感觉一堆知识要补。

> # 基本操作

正常人听觉的频率范围大约在20Hz~20kHz之间。

采样频率是指将模拟声音波形进行数字化时，每秒钟抽取声波幅度样本的次数。
根据奈奎斯特采样理论，为了保证声音不失真，采样频率应该在40kHz左右。
常用的音频采样频率有8kHz、11.025kHz、22.05kHz、16kHz、37.8kHz、44.1kHz、48kHz等，
如果采用更高的采样频率，还可以达到DVD的音质。

对采样率为44.1kHz的AAC音频进行解码时，一帧的解码时间须控制在23.22毫秒内。
通常是按1024个采样点一帧


分析：
1. AAC
一个AAC原始帧包含某段时间内1024个采样点相关数据。
用1024主要是因为AAC是用的1024点的mdct。

音频帧的播放时间 = 一个AAC帧对应的采样样本的个数 / 采样频率(单位为s)。

采样率(samplerate)为 44100Hz，表示每秒 44100个采样点,
所以，根据公式,   
音频帧的播放时长 = 一个AAC帧对应的采样点个数 / 采样频率
则，当前一帧的播放时间 = 1024 * 1000000/44100= 22.32ms(单位为ms)

48kHz采样率，
则，当前一帧的播放时间 = 1024 * 1000000/48000= 21.32ms(单位为ms)

22.05kHz采样率，
则，当前一帧的播放时间 = 1024 * 1000000/22050= 46.43ms(单位为ms)

2.MP3
mp3 每帧均为1152个字节，
则：
每帧播放时长 = 1152 * 1000000 / sample_rate
例如：sample_rate = 44100HZ时，
计算出的时长为26.122ms，
这就是经常听到的mp3每帧播放时间固定为26ms的由来
## 加载音频
这会将音频时间序列作为numpy数组返回，默认采样率（sr）为22KHZ mono。我们可以通过以下方式更改此行为：
```python
import librosa
from librosa import display as rosa_display
import os
from matplotlib import pyplot as plt
import IPython.display as ipd

audio_path = os.path.join('.', 'data', '1-137-A-32.wav')
img_path = os.path.join('.', 'img')
# 音频序列，采样率默认为22KHZ
series, sr = librosa.load(audio_path)
print(type(series), type(sr))
print(series.shape, sr)
```
## 波形图
横坐标时间，纵坐标振幅
```python
import librosa
from librosa import display as rosa_display
import os
from matplotlib import pyplot as plt
import IPython.display as ipd

audio_path = os.path.join('.', 'data', '1-137-A-32.wav')
img_path = os.path.join('.', 'img')
# 音频序列，采样率默认为22KHZ
series, sr = librosa.load(audio_path)
print(type(series), type(sr))
print(series.shape, sr)
# 波形
plt.figure(figsize=(14, 5))
rosa_display.waveplot(series, sr=sr)
# plt.savefig(os.path.join(img_path, 'waveplot.png'))
plt.show()
```
![image](/assets/img/librosa/waveplot.png)
## 谱图
谱图是通过视觉表示频谱的频率、声音或其他信号，因为它们随时间变化。频谱图有时被称为超声波仪，声纹或语音图。当数据在3D图中表示时，它们可以称为waterfalls。在二维阵列中，第一轴是频率，而第二轴是时间。
```python
import librosa
from librosa import display as rosa_display
import os
from matplotlib import pyplot as plt
import IPython.display as ipd

audio_path = os.path.join('.', 'data', '1-137-A-32.wav')
img_path = os.path.join('.', 'img')
# 音频序列，采样率默认为22KHZ
series, sr = librosa.load(audio_path)
print(type(series), type(sr))
print(series.shape, sr)


# 谱图
# Short-time Fourier transform
x = librosa.stft(series)
# Convert an amplitude spectrogram to dB-scaled spectrogram
xdb = librosa.amplitude_to_db(abs(x))
rosa_display.specshow(xdb, sr=sr, x_axis='time', y_axis='hz')
# 对数轴
# rosa_display.specshow(xdb, sr=sr, x_axis='time', y_axis='log')
plt.colorbar()
# plt.savefig(os.path.join(img_path, 'db-scaled_spectrogrm.png'))
plt.show()
```
![image](/assets/img/librosa/db-scaled_spectrogram.png)
```python
import librosa
from librosa import display as rosa_display
import os
from matplotlib import pyplot as plt
import numpy as np

audio_path = os.path.join('.', 'data', '1-137-A-32.wav')
img_path = os.path.join('.', 'img')
# 音频序列，采样率默认为22KHZ
series, sr = librosa.load(audio_path)
print(type(series), type(sr))
print(series.shape, sr)

plt.figure(figsize=(14, 10))
# 谱图
# Short-time Fourier transform
x = librosa.stft(series)
print(x.shape)
# Convert an amplitude spectrogram to dB-scaled spectrogram
xdb = librosa.amplitude_to_db(abs(x), ref=np.max)
plt.subplot(2, 1, 1)
rosa_display.specshow(xdb, x_axis='time', y_axis='linear')
plt.colorbar(format='%+2.0f dB')
plt.title('Linear-frequency spectrogram')

plt.subplot(2, 1, 2)
rosa_display.specshow(xdb, x_axis='time', y_axis='log')
plt.colorbar(format='%+2.0f dB')
plt.title('Log-frequency spectrogram')
plt.savefig(os.path.join('', 'img', 'frequency_spectrogram.png'))
plt.show()

```
```python
<class 'numpy.ndarray'> <class 'int'>
(110250,) 22050
(1025, 216)
```
![image](/assets/img/librosa/frequency_spectrogram.png)
## 功率谱
将功率谱（幅度平方）转换为分贝（dB）单位.
```python
import librosa
from librosa import display as rosa_display
import os
from matplotlib import pyplot as plt
import numpy as np
import sklearn
import warnings

warnings.filterwarnings("ignore", message="Numerical issues were encountered ")
audio_path = os.path.join('.', 'data', '1-137-A-32.wav')
img_path = os.path.join('.', 'img')
# 音频序列，采样率默认为22KHZ
series, sr = librosa.load(audio_path)
print(type(series), type(sr))
print(series.shape, sr)
# 短时傅里叶变换
x = librosa.stft(series)
print(x.shape)

plt.figure(figsize=(14, 15))
plt.subplot(3, 1, 1)
rosa_display.specshow(np.abs(x) ** 2, sr=sr, y_axis='log')  # 从波形获取功率谱
plt.colorbar()
plt.title('Power spectrogram')

plt.subplot(3, 1, 2)
pdb = librosa.power_to_db(np.abs(x) ** 2)
print(pdb.shape)
# 默认相对于ref=1.0的功率谱
rosa_display.specshow(pdb, sr=sr, y_axis='log')
plt.colorbar(format='%+2.0f dB')
plt.title('Log-Power spectrogram')

plt.subplot(3, 1, 3)
# 相对于峰值计算dB，那么其他的dB都是负的，注意看后边的cmp值
pdb_ref = librosa.power_to_db(np.abs(x) ** 2, ref=np.max)
rosa_display.specshow(pdb_ref, sr=sr, y_axis='log', x_axis='time')
plt.title('Log_ref-Power spectrogram')
plt.set_cmap('autumn')
plt.colorbar(format='%+2.0f dB')

plt.savefig(os.path.join('', 'img', 'power_spectrogram.png'))
plt.show()

```
```python
<class 'numpy.ndarray'> <class 'int'>
(110250,) 22050
(1025, 216)
(1025, 216)
```
![image](/assets/img/librosa/power_spectrogram.png)
## 播放音频/写音频
```python
import librosa
from librosa import display as rosa_display
import os
from matplotlib import pyplot as plt
import IPython.display as ipd

audio_path = os.path.join('.', 'data', '1-137-A-32.wav')
img_path = os.path.join('.', 'img')
# 音频序列，采样率默认为22KHZ
series, sr = librosa.load(audio_path)
print(type(series), type(sr))
print(series.shape, sr)

# 播放音频,jupter组件，这里不行
ipd.Audio(audio_path)

librosa.output.write_wav('example.wav', series, sr)
```
```python
import librosa
from librosa import display as rosa_display
import os
import numpy as np
import IPython.display as ipd
from matplotlib import pyplot as plt


sr = 22050  # sample rate
T = 5.0  # seconds
t = np.linspace(0, T, int(T * sr), endpoint=False)  # time variable
series = 0.5*np.sin(2*np.pi*220*t)
print(series)
ipd.Audio(series, rate=sr)
# 波形
plt.figure(figsize=(14, 5))
rosa_display.waveplot(series, sr=sr)
# plt.savefig(os.path.join(img_path, 'waveplot.png'))
plt.show()
librosa.output.write_wav('tone_220.wav', series, sr)
```

> # 特征提取

## 过零率
该特征在语音识别和音乐信息检索中都被大量使用。对于像金属和岩石那样的高冲击声，它通常具有更高的值。让我们计算示例音频片段的过零率。
```python
import librosa
from librosa import display as rosa_display
import os
from matplotlib import pyplot as plt
import IPython.display as ipd

audio_path = os.path.join('.', 'data', '1-137-A-32.wav')
img_path = os.path.join('.', 'img')
# 音频序列，采样率默认为22KHZ
series, sr = librosa.load(audio_path)
print(type(series), type(sr))
print(series.shape, sr)

plt.figure(figsize=(14, 5))
# rosa_display.waveplot(series, sr=sr)
plt.plot(series)
plt.show()

# 过零数
zero_crossings = librosa.zero_crossings(series, pad=False)
print(zero_crossings)
print(sum(zero_crossings))

#  过零率
# 返回每帧的过零率，音频帧
zero_crossing_rate = librosa.feature.zero_crossing_rate(series)
print(zero_crossing_rate.shape)
print(zero_crossing_rate)

```
```python
<class 'numpy.ndarray'> <class 'int'>
(110250,) 22050
[False False False ... False False False]
7382
(1, 216)
[[0.00146484 0.03515625 0.06640625 0.07666016 0.07714844 0.04638672
  0.01513672 0.01025391 0.00830078 0.00537109 0.01171875 0.04345703
  0.04345703 0.04443359 0.03808594 0.00146484 0.00146484 0.00097656
  0.00097656 0.00097656 0.00097656 0.00244141 0.00244141 0.01123047
  0.01123047 0.00927734 0.00976562 0.00634766 0.00634766 0.00634766
  0.01220703 0.00927734 0.00927734 0.01123047 0.00830078 0.00537109
  0.00537109 0.03320312 0.04541016 0.05126953 0.06054688 0.06005859
  0.07666016 0.09472656 0.09912109 0.09179688 0.07666016 0.05322266
  0.0703125  0.07324219 0.06152344 0.08203125 0.08642578 0.06201172
  0.11865234 0.11816406 0.10400391 0.13867188 0.08154297 0.06152344
  0.04003906 0.01904297 0.0546875  0.09765625 0.12548828 0.12841797
  0.14648438 0.11279297 0.12255859 0.11523438 0.06005859 0.05517578
  0.05908203 0.07080078 0.07568359 0.09521484 0.06396484 0.05371094
  0.07080078 0.06542969 0.07714844 0.07080078 0.07763672 0.08935547
  0.1171875  0.11914062 0.08642578 0.06298828 0.01367188 0.05615234
  0.07568359 0.07958984 0.08300781 0.04394531 0.04736328 0.07470703
  0.11328125 0.11767578 0.09570312 0.05957031 0.06640625 0.07568359
  0.13183594 0.15332031 0.11474609 0.11474609 0.10546875 0.09814453
  0.09326172 0.06982422 0.04150391 0.05175781 0.08154297 0.09375
  0.07421875 0.08154297 0.06787109 0.07666016 0.07910156 0.04785156
  0.02783203 0.02392578 0.02148438 0.02587891 0.07128906 0.10888672
  0.13720703 0.12988281 0.0859375  0.04980469 0.05712891 0.07177734
  0.09228516 0.10302734 0.10058594 0.10009766 0.09082031 0.10058594
  0.08056641 0.11083984 0.10595703 0.07177734 0.06396484 0.02050781
  0.03027344 0.06347656 0.06103516 0.06298828 0.04785156 0.02001953
  0.02148438 0.05078125 0.06591797 0.07763672 0.08349609 0.09033203
  0.08496094 0.06835938 0.06591797 0.02734375 0.03027344 0.06445312
  0.08935547 0.10009766 0.10644531 0.08544922 0.08154297 0.08251953
  0.0859375  0.10058594 0.08154297 0.07568359 0.06591797 0.08203125
  0.08740234 0.08691406 0.08056641 0.04052734 0.04980469 0.05908203
  0.07373047 0.0859375  0.07519531 0.07568359 0.05126953 0.06494141
  0.07080078 0.06201172 0.06591797 0.03564453 0.04345703 0.03808594
  0.08251953 0.10009766 0.08642578 0.08886719 0.07128906 0.09228516
  0.1171875  0.12988281 0.10205078 0.06982422 0.0390625  0.02685547
  0.02294922 0.06103516 0.06103516 0.05908203 0.06494141 0.03076172
  0.05322266 0.08642578 0.12548828 0.14599609 0.12597656 0.09082031]]
```
## 光谱质心
它指示声音的“质心”位于何处，并计算为声音中存在的频率的加权平均值。如果有两首歌曲，一首来自布鲁斯类型，另一首属于金属。与长度相同的布鲁斯流派歌曲相比，金属歌曲在最后有更多的频率。因此，布鲁斯歌曲的光谱质心将位于其光谱中间附近，而金属歌曲的光谱质心将朝向它的末端。
```python
import librosa
from librosa import display as rosa_display
import os
from matplotlib import pyplot as plt
import numpy as np
import sklearn

audio_path = os.path.join('.', 'data', '1-137-A-32.wav')
img_path = os.path.join('.', 'img')
# 音频序列，采样率默认为22KHZ
series, sr = librosa.load(audio_path)
print(type(series), type(sr))
print(series.shape, sr)

# plt.figure(figsize=(14, 5))
# rosa_display.waveplot(series, sr=sr)
# # plt.plot(series)
# plt.show()

spectral_centroids = librosa.feature.spectral_centroid(series, sr=sr)
print(spectral_centroids.shape)

# Computing the time variable for visualization
frames = range(len(spectral_centroids[0]))
t = librosa.frames_to_time(frames, sr=sr)


# Normalizing the spectral centroid for visualization
def normalize(x, axis=0):
    return sklearn.preprocessing.minmax_scale(x, axis=axis)


# Plotting the Spectral Centroid along the waveform
rosa_display.waveplot(series, sr=sr)
plt.plot(t, normalize(spectral_centroids[0]), color='r')
plt.savefig(os.path.join('', 'img', 'spectral_centroid.png'))
plt.show()

```
![image](/assets/img/librosa/spectral_centroid.png)
## 光谱衰减
它是信号形状的度量。librosa.feature.spectral_rolloff 计算信号中每帧的滚降系数：
```python
import librosa
from librosa import display as rosa_display
import os
from matplotlib import pyplot as plt
import numpy as np
import sklearn

audio_path = os.path.join('.', 'data', '1-137-A-32.wav')
img_path = os.path.join('.', 'img')
# 音频序列，采样率默认为22KHZ
series, sr = librosa.load(audio_path)
print(type(series), type(sr))
print(series.shape, sr)

# plt.figure(figsize=(14, 5))
# rosa_display.waveplot(series, sr=sr)
# # plt.plot(series)
# plt.show()

spectral_rolloff = librosa.feature.spectral_rolloff(series + 0.01, sr=sr)
print(spectral_rolloff.shape)

# Computing the time variable for visualization
frames = range(len(spectral_rolloff[0]))
t = librosa.frames_to_time(frames, sr=sr)
print(t)


# Normalizing the spectral centroid for visualization
def normalize(x, axis=0):
    return sklearn.preprocessing.minmax_scale(x, axis=axis)


rosa_display.waveplot(series, sr=sr)
plt.plot(t, normalize(spectral_rolloff[0]), color='r')
plt.savefig(os.path.join('', 'img', 'spectral_rolloff.png'))
plt.show()

```
```python
<class 'numpy.ndarray'> <class 'int'>
(110250,) 22050
(1, 216)
[0.         0.02321995 0.04643991 0.06965986 0.09287982 0.11609977
 0.13931973 0.16253968 0.18575964 0.20897959 0.23219955 0.2554195
 0.27863946 0.30185941 0.32507937 0.34829932 0.37151927 0.39473923
 0.41795918 0.44117914 0.46439909 0.48761905 0.510839   0.53405896
 0.55727891 0.58049887 0.60371882 0.62693878 0.65015873 0.67337868
 0.69659864 0.71981859 0.74303855 0.7662585  0.78947846 0.81269841
 0.83591837 0.85913832 0.88235828 0.90557823 0.92879819 0.95201814
 0.9752381  0.99845805 1.021678   1.04489796 1.06811791 1.09133787
 1.11455782 1.13777778 1.16099773 1.18421769 1.20743764 1.2306576
 1.25387755 1.27709751 1.30031746 1.32353741 1.34675737 1.36997732
 1.39319728 1.41641723 1.43963719 1.46285714 1.4860771  1.50929705
 1.53251701 1.55573696 1.57895692 1.60217687 1.62539683 1.64861678
 1.67183673 1.69505669 1.71827664 1.7414966  1.76471655 1.78793651
 1.81115646 1.83437642 1.85759637 1.88081633 1.90403628 1.92725624
 1.95047619 1.97369615 1.9969161  2.02013605 2.04335601 2.06657596
 2.08979592 2.11301587 2.13623583 2.15945578 2.18267574 2.20589569
 2.22911565 2.2523356  2.27555556 2.29877551 2.32199546 2.34521542
 2.36843537 2.39165533 2.41487528 2.43809524 2.46131519 2.48453515
 2.5077551  2.53097506 2.55419501 2.57741497 2.60063492 2.62385488
 2.64707483 2.67029478 2.69351474 2.71673469 2.73995465 2.7631746
 2.78639456 2.80961451 2.83283447 2.85605442 2.87927438 2.90249433
 2.92571429 2.94893424 2.9721542  2.99537415 3.0185941  3.04181406
 3.06503401 3.08825397 3.11147392 3.13469388 3.15791383 3.18113379
 3.20435374 3.2275737  3.25079365 3.27401361 3.29723356 3.32045351
 3.34367347 3.36689342 3.39011338 3.41333333 3.43655329 3.45977324
 3.4829932  3.50621315 3.52943311 3.55265306 3.57587302 3.59909297
 3.62231293 3.64553288 3.66875283 3.69197279 3.71519274 3.7384127
 3.76163265 3.78485261 3.80807256 3.83129252 3.85451247 3.87773243
 3.90095238 3.92417234 3.94739229 3.97061224 3.9938322  4.01705215
 4.04027211 4.06349206 4.08671202 4.10993197 4.13315193 4.15637188
 4.17959184 4.20281179 4.22603175 4.2492517  4.27247166 4.29569161
 4.31891156 4.34213152 4.36535147 4.38857143 4.41179138 4.43501134
 4.45823129 4.48145125 4.5046712  4.52789116 4.55111111 4.57433107
 4.59755102 4.62077098 4.64399093 4.66721088 4.69043084 4.71365079
 4.73687075 4.7600907  4.78331066 4.80653061 4.82975057 4.85297052
 4.87619048 4.89941043 4.92263039 4.94585034 4.96907029 4.99229025]
```
![image](/assets/img/librosa/spectral_rolloff.png)
## 梅尔频率倒谱系数
信号的Mel频率倒谱系数（MFCC）是一小组特征（通常约10-20），其简明地描述了频谱包络的整体形状，它模拟了人声的特征。让我们这次用一个简单的循环波。MFCC特征是一种在自动语音识别和说话人识别中广泛使用的特征。
```python
import librosa
from librosa import display as rosa_display
import os
from matplotlib import pyplot as plt
import numpy as np
import sklearn
import warnings

warnings.filterwarnings("ignore", message="Numerical issues were encountered ")
audio_path = os.path.join('.', 'data', '1-137-A-32.wav')
img_path = os.path.join('.', 'img')
# 音频序列，采样率默认为22KHZ
series, sr = librosa.load(audio_path)
print(type(series), type(sr))
print(series.shape, sr)

rosa_display.waveplot(series, sr=sr)
plt.show()
mfccs = librosa.feature.mfcc(series, sr=sr)
print(mfccs.shape)

# Displaying the MFCCs
rosa_display.specshow(mfccs, sr=sr, x_axis='time')
plt.savefig(os.path.join('', 'img', 'mfccs.png'))
plt.show()

# 上述mfcc计算了216帧的20个MFCC。这里进行特征缩放，使得每个系数维度具有零均值和单位方差：
mfccs = sklearn.preprocessing.scale(mfccs,  axis=1)
print(mfccs.shape)
# print(mfccs.mean(axis=1))
print(mfccs.var(axis=1))
rosa_display.specshow(mfccs, sr=sr, x_axis='time')
plt.savefig(os.path.join('', 'img', 'mfccs_scale.png'))
plt.show()

```
```python
<class 'numpy.ndarray'> <class 'int'>
(110250,) 22050
(20, 216)
(20, 216)
[1.0000001  0.99999946 1.0000002  0.9999999  1.0000002  0.9999997
 0.9999992  1.0000001  1.         1.0000001  1.0000001  1.0000002
 0.99999946 1.0000004  1.0000002  0.9999996  0.9999996  0.9999997
 1.0000001  0.9999995 ]
```
![image](/assets/img/librosa/waveplot.png)
![image](/assets/img/librosa/mfccs.png)
![image](/assets/img/librosa/mfccs_scale.png)
## 色度频率
色度频率是音乐音频有趣且强大的表示，其中整个频谱被投影到12个区间，代表音乐八度音的12个不同的半音（或色度），librosa.feature.chroma_stft 用于计算。
```python
import librosa
from librosa import display as rosa_display
import os
from matplotlib import pyplot as plt
import numpy as np
import sklearn
import warnings

warnings.filterwarnings("ignore", message="Numerical issues were encountered ")
audio_path = os.path.join('.', 'data', '1-137-A-32.wav')
img_path = os.path.join('.', 'img')
# 音频序列，采样率默认为22KHZ
series, sr = librosa.load(audio_path)
print(type(series), type(sr))
print(series.shape, sr)

hop_length = 512
chromagram = librosa.feature.chroma_stft(series, sr=sr, hop_length=hop_length)
plt.figure(figsize=(15, 5))
rosa_display.specshow(chromagram, x_axis='time', y_axis='chroma', hop_length=hop_length, cmap='coolwarm')
plt.savefig(os.path.join('', 'img', 'chroma_stft.png'))
plt.show()
```
![image](/assets/img/librosa/chroma_stft.png)
## Mel滤波器组
```python
import librosa
from librosa import display as rosa_display
import os
from matplotlib import pyplot as plt
import numpy as np

melfb = librosa.filters.mel(sr=22050, n_fft=2048)
print(melfb.shape)

rosa_display.specshow(melfb, x_axis='linear')
plt.ylabel('Mel filter')
plt.title('Mel filter bank')
plt.colorbar()
plt.tight_layout()
plt.savefig(os.path.join('', 'img', 'Mel_filters.png'))
plt.show()

```
![image](/assets/img/librosa/Mel_filters.png)
## Mel scaled频谱
```python
import librosa
from librosa import display as rosa_display
import os
from matplotlib import pyplot as plt
import numpy as np
import sklearn
import warnings

warnings.filterwarnings("ignore", message="Numerical issues were encountered ")
audio_path = os.path.join('.', 'data', '1-137-A-32.wav')
img_path = os.path.join('.', 'img')
# 音频序列，采样率默认为22KHZ
series, sr = librosa.load(audio_path)
print(type(series), type(sr))
print(series.shape, sr)

# 第一中学方法直接用声音序列计算
melspec = librosa.feature.melspectrogram(series, sr=sr)
print(melspec.shape)

#第二种方法使用功率谱计算
x = np.abs(librosa.stft(series)) ** 2
melspec_stft = librosa.feature.melspectrogram(S=x, sr=sr)
print(melspec_stft.shape)

plt.figure(figsize=(10, 4))
pdb = librosa.power_to_db(melspec_stft, ref=np.max)
rosa_display.specshow(pdb, sr=sr, x_axis='time', y_axis='mel', fmax=8000)
plt.colorbar(format='%+2.0f dB')
plt.title('Mel-frequency spectrogram')
plt.tight_layout()
plt.savefig(os.path.join('', 'img', 'Mel_frequency_sprectrogram.png'))
plt.show()

```
```python
<class 'numpy.ndarray'> <class 'int'>
(110250,) 22050
(128, 216)
(128, 216)
```
![image](/assets/img/librosa/Mel_frequency_sprectrogram.png)
## Log-Mel Spectrogram特征
　Log-Mel Spectrogram特征是目前在语音识别和环境声音识别中很常用的一个特征，由于CNN在处理图像上展现了强大的能力，使得音频信号的频谱图特征的使用愈加广泛，甚至比MFCC使用的更多。在librosa中，Log-Mel Spectrogram特征的提取只需几行代码：
```python
import librosa
from librosa import display as rosa_display
import os
from matplotlib import pyplot as plt
import numpy as np
import sklearn
import warnings

warnings.filterwarnings("ignore", message="Numerical issues were encountered ")
audio_path = os.path.join('.', 'data', '1-137-A-32.wav')
img_path = os.path.join('.', 'img')
# 音频序列，采样率默认为22KHZ
series, sr = librosa.load(audio_path)
print(type(series), type(sr))
print(series.shape, sr)

melspec = librosa.feature.melspectrogram(series, sr, n_fft=1024, hop_length=512, n_mels=128)
logmelspec = librosa.amplitude_to_db(melspec)
print(logmelspec.shape)

```
```python
<class 'numpy.ndarray'> <class 'int'>
(110250,) 22050
(128, 216)
```
可见，Log-Mel Spectrogram特征是二维数组的形式，128表示Mel频率的维度（频域），216为时间帧长度（时域），所以Log-Mel Spectrogram特征是音频信号的时频表示特征。其中，n_fft指的是窗的大小，这里为1024；hop_length表示相邻窗之间的距离，这里为512，也就是相邻窗之间有50%的overlap；n_mels为mel bands的数量，这里设为128。

[^1]: [LibROSA](http://librosa.github.io/librosa/index.html)
