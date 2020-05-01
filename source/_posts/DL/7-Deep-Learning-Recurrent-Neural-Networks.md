---
title: '(7) Deep Learning: Recurrent Neural Networks'
tags:
  - ML
  - DL
toc: true
translate_title: 7-deep-learning-recurrent-neural-networks
date: 2020-03-25 15:01:37
---
> # 循环神经网络

## 含隐藏状态的循环神经网络
```python
from mxnet import nd

X, W_xh = nd.random.normal(shape=(3, 1)), nd.random.normal(shape=(1, 4))
H, W_hh = nd.random.normal(shape=(3, 4)), nd.random.normal(shape=(4, 4))

print(nd.dot(X, W_xh)+nd.dot(H, W_hh))
print(nd.dot(nd.concat(X, H, dim=1), nd.concat(W_xh, W_hh, dim=0)))

```
```python
[[ 3.1951556  -7.028843    6.2385654   3.5568767 ]
 [ 2.809851   -1.8081225   0.6729961  -0.23211202]
 [-0.14438549 -2.5961134  -1.1423202  -4.142916  ]]
<NDArray 3x4 @cpu(0)>

[[ 3.1951556  -7.0288424   6.2385654   3.556877  ]
 [ 2.8098507  -1.8081226   0.67299604 -0.23211199]
 [-0.14438534 -2.5961134  -1.14232    -4.142916  ]]
<NDArray 3x4 @cpu(0)>
```
## 语言模型数据集（周杰伦专辑歌词）
```python
from mxnet import nd
import random
import zipfile


def load_data_jay_lyrics():
    with zipfile.ZipFile('./data/jaychou_lyrics.txt.zip') as zin:
        with zin.open('jaychou_lyrics.txt') as f:
            corpus_chars = f.read().decode('utf-8')
    print(corpus_chars[:40])

    corpus_chars = corpus_chars.replace('\n', ' ').replace('\r', ' ')
    # 仅使用前1万个字符训练模型
    corpus_chars = corpus_chars[0:10000]

    idx_to_char = list(set(corpus_chars))
    char_to_idx = dict([(char, i) for i, char in enumerate(idx_to_char)])
    vocab_size = len(char_to_idx)
    print(vocab_size)
    print(char_to_idx)

    x = [(char, i) for i, char in enumerate(idx_to_char)]
    print(x)

    # 训练集中的每个字符转化成索引
    corpus_indices = [char_to_idx[char] for char in corpus_chars]
    # 打印前20个字符机器对应的索引
    sample = corpus_indices[:20]
    print('chars:', ''.join([idx_to_char[idx] for idx in sample]))
    print('indices:', sample)


load_data_jay_lyrics()
```
```python
想要有直升机
想要和你飞到宇宙去
想要和你融化在一起
融化在宇宙里
我每天每天每
1027
{'变': 0, '甘': 1, '排': 2, '人': 3, '诗': 4, '将': 5, '晚': 6, '话': 7, '雨': 8, '熟': 9, '向': 10, '彻': 11, '黄': 12, ...}
[('变', 0), ('甘', 1), ('排', 2), ('人', 3), ('诗', 4), ('将', 5), ('晚', 6), ('话', 7), ('雨', 8), ('熟', 9), ('向', 10), ('彻', 11), ('黄', 12), ('丽', 13), ('怎', 14), ('世', 15), ('升', 16), ('妥', 17), ('怕', 18), ('碌', 19)]
chars: 想要有直升机 想要和你飞到宇宙去 想要和
indices: [634, 189, 133, 768, 16, 530, 157, 634, 189, 925, 1020, 308, 735, 467, 473, 282, 157, 634, 189, 925]
```

|采样类型|说明
|:--:|:--|
|随机采样|相邻两次迭代采样序列不相邻！随机！循环神经网络隐藏状态需要每次初始化|
|相邻采样|相邻两次迭代采样序列相邻！循环神经网络隐藏状态只需要第一次初始化|

### 随机采样
```python
from mxnet import nd
import random
import zipfile


def load_data_jay_lyrics():
    with zipfile.ZipFile('./data/jaychou_lyrics.txt.zip') as zin:
        with zin.open('jaychou_lyrics.txt') as f:
            corpus_chars = f.read().decode('utf-8')
    print(corpus_chars[:40])

    corpus_chars = corpus_chars.replace('\n', ' ').replace('\r', ' ')
    # 仅使用前1万个字符训练模型
    corpus_chars = corpus_chars[0:10000]

    idx_to_char = list(set(corpus_chars))
    char_to_idx = dict([(char, i) for i, char in enumerate(idx_to_char)])
    vocab_size = len(char_to_idx)
    print(vocab_size)
    print(char_to_idx)

    x = [(char, i) for i, char in enumerate(idx_to_char)]
    print(x[:20])

    # 训练集中的每个字符转化成索引
    corpus_indices = [char_to_idx[char] for char in corpus_chars]
    # 打印前20个字符机器对应的索引
    sample = corpus_indices[:20]
    print('chars:', ''.join([idx_to_char[idx] for idx in sample]))
    print('indices:', sample)
    return idx_to_char, char_to_idx, corpus_indices


# num_steps: 6
# corpus_indices:
# [0,1,2,...,29]
# [[0,...,5],[6,..,11],[12,...,17],[18,...,23],[24,...,29]]
# example_indices: [0,1,2,3,4]
# shuffle example_indices: [...]
def data_iter_random(corpus_indices, batch_size, num_steps, ctx=None):
    # 减1是因为输出的索引是相应输入的索引加1
    # [0,1,2,3]输出标签应为[1,2,3,4]
    # 为了防止溢出
    num_examples = (len(corpus_indices) - 1) // num_steps
    print(num_examples)
    epoch_size = num_examples // batch_size
    example_indices = list(range(num_examples))
    random.shuffle(example_indices)

    # 返回从pos开始的长为num_steps的序列
    def _data(pos):
        return corpus_indices[pos: pos + num_steps]

    for i in range(epoch_size):
        # 每次读取batch_size个随机样本
        i = i * batch_size
        batch_indices = example_indices[i:i + batch_size]
        X = [_data(j * num_steps) for j in batch_indices]
        Y = [_data(j * num_steps + 1) for j in batch_indices]
        yield nd.array(X, ctx), nd.array(Y, ctx)


my_seq = list(range(30))
for X, Y in data_iter_random(my_seq, batch_size=2, num_steps=6):
    print('X:', X, '\nY:', Y, '\n')

```
```python
X:
[[ 6.  7.  8.  9. 10. 11.]
 [18. 19. 20. 21. 22. 23.]]
<NDArray 2x6 @cpu(0)>
Y:
[[ 7.  8.  9. 10. 11. 12.]
 [19. 20. 21. 22. 23. 24.]]
<NDArray 2x6 @cpu(0)>

X:
[[ 0.  1.  2.  3.  4.  5.]
 [12. 13. 14. 15. 16. 17.]]
<NDArray 2x6 @cpu(0)>
Y:
[[ 1.  2.  3.  4.  5.  6.]
 [13. 14. 15. 16. 17. 18.]]
<NDArray 2x6 @cpu(0)>
```
### 相邻采样
```python
from mxnet import nd
import random
import zipfile


def load_data_jay_lyrics():
    with zipfile.ZipFile('./data/jaychou_lyrics.txt.zip') as zin:
        with zin.open('jaychou_lyrics.txt') as f:
            corpus_chars = f.read().decode('utf-8')
    print(corpus_chars[:40])

    corpus_chars = corpus_chars.replace('\n', ' ').replace('\r', ' ')
    # 仅使用前1万个字符训练模型
    corpus_chars = corpus_chars[0:10000]

    idx_to_char = list(set(corpus_chars))
    char_to_idx = dict([(char, i) for i, char in enumerate(idx_to_char)])
    vocab_size = len(char_to_idx)
    print(vocab_size)
    print(char_to_idx)

    x = [(char, i) for i, char in enumerate(idx_to_char)]
    print(x[:20])

    # 训练集中的每个字符转化成索引
    corpus_indices = [char_to_idx[char] for char in corpus_chars]
    # 打印前20个字符机器对应的索引
    sample = corpus_indices[:20]
    print('chars:', ''.join([idx_to_char[idx] for idx in sample]))
    print('indices:', sample)
    return idx_to_char, char_to_idx, corpus_indices


# num_steps: 6
# corpus_indices:
# [0,1,2,...,29]
# [[0,...,5],[6,..,11],[12,...,17],[18,...,23],[24,...,29]]
# example_indices: [0,1,2,3,4]
# shuffle example_indices: [...]
def data_iter_random(corpus_indices, batch_size, num_steps, ctx=None):
    # 减1是因为输出的索引是相应输入的索引加1
    # [0,1,2,3]输出标签应为[1,2,3,4]
    # 为了防止溢出
    num_examples = (len(corpus_indices) - 1) // num_steps
    print(num_examples)
    epoch_size = num_examples // batch_size
    example_indices = list(range(num_examples))
    random.shuffle(example_indices)

    # 返回从pos开始的长为num_steps的序列
    def _data(pos):
        return corpus_indices[pos: pos + num_steps]

    for i in range(epoch_size):
        # 每次读取batch_size个随机样本
        i = i * batch_size
        batch_indices = example_indices[i:i + batch_size]
        X = [_data(j * num_steps) for j in batch_indices]
        Y = [_data(j * num_steps + 1) for j in batch_indices]
        yield nd.array(X, ctx), nd.array(Y, ctx)


def data_iter_consecutive(corpus_indices, batch_size, num_steps, ctx=None):
    corpus_indices = nd.array(corpus_indices, ctx=ctx)
    data_len = len(corpus_indices)
    batch_len = data_len // batch_size
    indices = corpus_indices[0:batch_size * batch_len].reshape((batch_size, batch_len))
    print(indices)
    epoch_size = (batch_len - 1) // num_steps
    for i in range(epoch_size):
        i = i * num_steps
        X = indices[:, i:i + num_steps]
        Y = indices[:, i + 1:i + num_steps + 1]
        yield X, Y


my_seq = range(30)
for X, Y in data_iter_consecutive(my_seq, batch_size=2, num_steps=6):
    print('X: ', X, '\nY:', Y, '\n')

```
```python
[[ 0.  1.  2.  3.  4.  5.  6.  7.  8.  9. 10. 11. 12. 13. 14.]
 [15. 16. 17. 18. 19. 20. 21. 22. 23. 24. 25. 26. 27. 28. 29.]]
<NDArray 2x15 @cpu(0)>
X:  
[[ 0.  1.  2.  3.  4.  5.]
 [15. 16. 17. 18. 19. 20.]]
<NDArray 2x6 @cpu(0)>
Y:
[[ 1.  2.  3.  4.  5.  6.]
 [16. 17. 18. 19. 20. 21.]]
<NDArray 2x6 @cpu(0)>

X:  
[[ 6.  7.  8.  9. 10. 11.]
 [21. 22. 23. 24. 25. 26.]]
<NDArray 2x6 @cpu(0)>
Y:
[[ 7.  8.  9. 10. 11. 12.]
 [22. 23. 24. 25. 26. 27.]]
<NDArray 2x6 @cpu(0)>
```

## 循环神经网络从零开始实现
### one_hot向量
```python
from mxnet import nd
import random
import zipfile
from mxnet import autograd, nd
from mxnet.gluon import loss as gloss
import time


def to_onehot(X, size):
    return [nd.one_hot(x, size) for x in X.T]


# my_seq = range(30)
# for X, Y in data_iter_consecutive(my_seq, batch_size=2, num_steps=6):
#     print('X: ', X, '\nY:', Y, '\n')

idx_to_char, char_to_idx, corpus_indices, vocab_size = load_data_jay_lyrics()

X = nd.arange(10).reshape((2, 5))
print(X)
inputs = to_onehot(X, vocab_size)
print(len(inputs), inputs[0].shape)
```
```python
[[0. 1. 2. 3. 4.]
 [5. 6. 7. 8. 9.]]
<NDArray 2x5 @cpu(0)>
5 (2, 1027)
```
### 模型训练以及预测
```python
from mxnet import nd
import random
import zipfile
from mxnet import autograd, nd
from mxnet.gluon import loss as gloss
import time
import mxnet as mx
import math


def load_data_jay_lyrics():
    with zipfile.ZipFile('./data/jaychou_lyrics.txt.zip') as zin:
        with zin.open('jaychou_lyrics.txt') as f:
            corpus_chars = f.read().decode('utf-8')
    print(corpus_chars[:40])

    corpus_chars = corpus_chars.replace('\n', ' ').replace('\r', ' ')
    # 仅使用前1万个字符训练模型
    corpus_chars = corpus_chars[0:10000]

    idx_to_char = list(set(corpus_chars))
    char_to_idx = dict([(char, i) for i, char in enumerate(idx_to_char)])
    vocab_size = len(char_to_idx)
    print(vocab_size)
    print(char_to_idx)

    x = [(char, i) for i, char in enumerate(idx_to_char)]
    print(x[:20])

    # 训练集中的每个字符转化成索引
    corpus_indices = [char_to_idx[char] for char in corpus_chars]
    # 打印前20个字符机器对应的索引
    sample = corpus_indices[:20]
    print('chars:', ''.join([idx_to_char[idx] for idx in sample]))
    print('indices:', sample)
    return idx_to_char, char_to_idx, corpus_indices, vocab_size


# num_steps: 6
# corpus_indices:
# [0,1,2,...,29]
# [[0,...,5],[6,..,11],[12,...,17],[18,...,23],[24,...,29]]
# example_indices: [0,1,2,3,4]
# shuffle example_indices: [...]
def data_iter_random(corpus_indices, batch_size, num_steps, ctx=None):
    # 减1是因为输出的索引是相应输入的索引加1
    # [0,1,2,3]输出标签应为[1,2,3,4]
    # 为了防止溢出
    num_examples = (len(corpus_indices) - 1) // num_steps
    print(num_examples)
    epoch_size = num_examples // batch_size
    example_indices = list(range(num_examples))
    random.shuffle(example_indices)

    # 返回从pos开始的长为num_steps的序列
    def _data(pos):
        return corpus_indices[pos: pos + num_steps]

    for i in range(epoch_size):
        # 每次读取batch_size个随机样本
        i = i * batch_size
        batch_indices = example_indices[i:i + batch_size]
        X = [_data(j * num_steps) for j in batch_indices]
        Y = [_data(j * num_steps + 1) for j in batch_indices]
        yield nd.array(X, ctx), nd.array(Y, ctx)


def data_iter_consecutive(corpus_indices, batch_size, num_steps, ctx=None):
    corpus_indices = nd.array(corpus_indices, ctx=ctx)
    data_len = len(corpus_indices)
    batch_len = data_len // batch_size
    indices = corpus_indices[0:batch_size * batch_len].reshape((batch_size, batch_len))
    print(indices)
    epoch_size = (batch_len - 1) // num_steps
    for i in range(epoch_size):
        i = i * num_steps
        X = indices[:, i:i + num_steps]
        Y = indices[:, i + 1:i + num_steps + 1]
        yield X, Y


def to_onehot(X, size):
    return [nd.one_hot(x, size) for x in X.T]


def try_gpu():
    try:
        ctx = mx.gpu()
        _ = nd.zeros((1,), ctx=ctx)
    except mx.base.MXNetError:
        ctx = mx.cpu()
    return ctx


# my_seq = range(30)
# for X, Y in data_iter_consecutive(my_seq, batch_size=2, num_steps=6):
#     print('X: ', X, '\nY:', Y, '\n')


def get_params():
    def _one(shape):
        return nd.random.normal(scale=0.01, shape=shape, ctx=ctx)

    # 隐藏层参数
    W_xh = _one((num_inputs, num_hiddens))
    W_hh = _one((num_hiddens, num_hiddens))
    b_h = nd.zeros(num_hiddens, ctx=ctx)

    # 输出层参数
    W_hq = _one((num_hiddens, num_outputs))
    b_q = nd.zeros(num_outputs, ctx=ctx)
    # 附上梯度
    params = [W_xh, W_hh, b_h, W_hq, b_q]
    for param in params:
        param.attach_grad()
    return params


def init_rnn_state(batch_size, num_hiddens, ctx):
    return nd.zeros(shape=(batch_size, num_hiddens), ctx=ctx),


def rnn(inputs, state, params):
    # inputs和outputs皆为num_steps个形状为(batch_size, vocab_size)的矩阵
    W_xh, W_hh, b_h, W_hq, b_q = params
    H, = state
    outputs = []
    for X in inputs:
        H = nd.tanh(nd.dot(X, W_xh) + nd.dot(H, W_hh) + b_h)
        Y = nd.dot(H, W_hq) + b_q
        outputs.append(Y)
    return outputs, (H, )


def predict_rnn(prefix, num_chars, rnn, params, init_rnn_state,
                num_hiddens, vocab_size, ctx, idx_to_char, char_to_idx):
    state = init_rnn_state(1, num_hiddens, ctx)
    output = [char_to_idx[prefix[0]]]
    for t in range(num_chars+len(prefix) - 1):
        # 将上一实践步的输出作为当前时间步的输入
        X = to_onehot(nd.array([output[-1]], ctx=ctx), vocab_size)
        # 计算输出和更新隐藏状态
        Y, state = rnn(X, state, params)
        # 下一个时间步的输入是prefix里的字符或者当前的最佳预测字符
        if t < len(prefix)-1:
            output.append(char_to_idx[prefix[t+1]])
        else:
            output.append(int(Y[0].argmax(axis=1).asscalar()))
    return ''.join([idx_to_char[i] for i in output])


def grad_clipping(params, theta, ctx):
    norm = nd.array(0, ctx)
    for param in params:
        norm += (param.grad**2).sum()
    norm = norm.sqrt().asscalar()
    if norm > theta:
        for param in params:
            param.grad[:] *= theta / norm


def sgd(params, lr, batch_size):
    for param in params:
        # print("param:", param)
        param[:] = param - lr * param.grad / batch_size


def train_and_predict_rnn(rnn, get_params, init_rnn_state, num_hiddens,
                          vocab_size, ctx, corpus_indices, idx_to_char,
                          char_to_idx, is_random_iter, num_epochs, num_steps,
                          lr, clipping_theta, batch_size, pred_peroid,
                          pred_len, prefixes):
    if is_random_iter:
        data_iter_fn = data_iter_random
    else:
        data_iter_fn = data_iter_consecutive

    params = get_params
    loss = gloss.SoftmaxCrossEntropyLoss()

    for epoch in range(num_epochs):
        if not is_random_iter:
            state = init_rnn_state(batch_size, num_hiddens, ctx)
        l_sum, n, start = 0.0, 0, time.time()
        data_iter = data_iter_fn(corpus_indices, batch_size, num_steps, ctx)
        for X, Y in data_iter:
            if is_random_iter:
                state = init_rnn_state(batch_size, num_hiddens, ctx)
            else:  # 否则需要使用detach函数从计算图分离隐藏状态
                for s in state:
                    s.detach()

            with autograd.record():
                inputs = to_onehot(X, vocab_size)
                # outputs有num_steps个形状为(batch_size, vocab_size)的矩阵
                outputs, state = rnn(inputs, state, params)
                # 拼接之后形状为(num_steps*batch_size, vocab_size)
                outputs = nd.concat(*outputs, dim=0)
                # Y的形状是(batch_size, num_steps)，转置后再变成长度为
                # batch * num_steps的向量，这样跟输出的行一一对应
                y = Y.T.reshape((-1,))
                # 使用交叉熵损失计算平均分类误差
                l = loss(outputs, y).mean()
            l.backward()
            grad_clipping(params, clipping_theta, ctx)  # 裁剪梯度
            sgd(params, lr, 1)  # 因为误差已经去过均值，梯度不用再做平均，所以这里为1
            l_sum += l.asscalar() * y.size
            n += y.size

        if (epoch + 1) % pred_peroid == 0:
            print('epoch %d, perplexity %f, time %.2f sec' % (
                epoch + 1, math.exp(l_sum/n), time.time()-start))
            for prefix in prefixes:
                print(' -', predict_rnn(
                    prefix, pred_len, rnn, params, init_rnn_state,
                    num_hiddens, vocab_size, ctx, idx_to_char, char_to_idx))


idx_to_char, char_to_idx, corpus_indices, vocab_size = load_data_jay_lyrics()
num_inputs, num_hiddens, num_outputs = vocab_size, 256, vocab_size
ctx = try_gpu()
print('will use', ctx)
X = nd.arange(10).reshape((2, 5))
state = init_rnn_state(X.shape[0], num_hiddens, ctx)
inputs = to_onehot(X.as_in_context(ctx), vocab_size)
print(inputs)

params = get_params()
outputs, state_new = rnn(inputs, state, params)
print(len(outputs), outputs[0].shape, state_new[0].shape)


predict_txt = predict_rnn('分开', 10, rnn, params, init_rnn_state, num_hiddens, vocab_size,
            ctx, idx_to_char, char_to_idx)

print(predict_txt)

```
**测试**
```python
will use cpu(0)
[22:52:44] c:\jenkins\workspace\mxnet-tag\mxnet\src\imperative\./imperative_utils.h:91: GPU support is disabled. Compile MXNet with USE_CUDA=1 to enable GPU support.
[
[[1. 0. 0. ... 0. 0. 0.]
 [0. 0. 0. ... 0. 0. 0.]]
<NDArray 2x1027 @cpu(0)>,
[[0. 1. 0. ... 0. 0. 0.]
 [0. 0. 0. ... 0. 0. 0.]]
<NDArray 2x1027 @cpu(0)>,
[[0. 0. 1. ... 0. 0. 0.]
 [0. 0. 0. ... 0. 0. 0.]]
<NDArray 2x1027 @cpu(0)>,
[[0. 0. 0. ... 0. 0. 0.]
 [0. 0. 0. ... 0. 0. 0.]]
<NDArray 2x1027 @cpu(0)>,
[[0. 0. 0. ... 0. 0. 0.]
 [0. 0. 0. ... 0. 0. 0.]]
<NDArray 2x1027 @cpu(0)>]
5 (2, 1027) (2, 256)
分开缝武干运欢选文峡颁铜
```
```python
from mxnet import nd
import random
import zipfile
from mxnet import autograd, nd
from mxnet.gluon import loss as gloss
import time
import mxnet as mx
import math


def load_data_jay_lyrics():
    with zipfile.ZipFile('./data/jaychou_lyrics.txt.zip') as zin:
        with zin.open('jaychou_lyrics.txt') as f:
            corpus_chars = f.read().decode('utf-8')
    print(corpus_chars[:40])

    corpus_chars = corpus_chars.replace('\n', ' ').replace('\r', ' ')
    # 仅使用前1万个字符训练模型
    corpus_chars = corpus_chars[0:10000]

    idx_to_char = list(set(corpus_chars))
    char_to_idx = dict([(char, i) for i, char in enumerate(idx_to_char)])
    vocab_size = len(char_to_idx)
    print(vocab_size)
    print(char_to_idx)

    x = [(char, i) for i, char in enumerate(idx_to_char)]
    print(x[:20])

    # 训练集中的每个字符转化成索引
    corpus_indices = [char_to_idx[char] for char in corpus_chars]
    # 打印前20个字符机器对应的索引
    sample = corpus_indices[:20]
    print('chars:', ''.join([idx_to_char[idx] for idx in sample]))
    print('indices:', sample)
    return idx_to_char, char_to_idx, corpus_indices, vocab_size


# num_steps: 6
# corpus_indices:
# [0,1,2,...,29]
# [[0,...,5],[6,..,11],[12,...,17],[18,...,23],[24,...,29]]
# example_indices: [0,1,2,3,4]
# shuffle example_indices: [...]
def data_iter_random(corpus_indices, batch_size, num_steps, ctx=None):
    # 减1是因为输出的索引是相应输入的索引加1
    # [0,1,2,3]输出标签应为[1,2,3,4]
    # 为了防止溢出
    num_examples = (len(corpus_indices) - 1) // num_steps
    # print(num_examples)
    epoch_size = num_examples // batch_size
    example_indices = list(range(num_examples))
    random.shuffle(example_indices)

    # 返回从pos开始的长为num_steps的序列
    def _data(pos):
        return corpus_indices[pos: pos + num_steps]

    for i in range(epoch_size):
        # 每次读取batch_size个随机样本
        i = i * batch_size
        batch_indices = example_indices[i:i + batch_size]
        X = [_data(j * num_steps) for j in batch_indices]
        Y = [_data(j * num_steps + 1) for j in batch_indices]
        yield nd.array(X, ctx), nd.array(Y, ctx)


def data_iter_consecutive(corpus_indices, batch_size, num_steps, ctx=None):
    corpus_indices = nd.array(corpus_indices, ctx=ctx)
    data_len = len(corpus_indices)
    batch_len = data_len // batch_size
    indices = corpus_indices[0:batch_size * batch_len].reshape((batch_size, batch_len))
    # print(indices)
    epoch_size = (batch_len - 1) // num_steps
    for i in range(epoch_size):
        i = i * num_steps
        X = indices[:, i:i + num_steps]
        Y = indices[:, i + 1:i + num_steps + 1]
        yield X, Y


def to_onehot(X, size):
    return [nd.one_hot(x, size) for x in X.T]


def try_gpu():
    try:
        ctx = mx.gpu()
        _ = nd.zeros((1,), ctx=ctx)
    except mx.base.MXNetError:
        ctx = mx.cpu()
    return ctx


# my_seq = range(30)
# for X, Y in data_iter_consecutive(my_seq, batch_size=2, num_steps=6):
#     print('X: ', X, '\nY:', Y, '\n')


def get_params():
    def _one(shape):
        return nd.random.normal(scale=0.01, shape=shape, ctx=ctx)

    # 隐藏层参数
    W_xh = _one((num_inputs, num_hiddens))
    W_hh = _one((num_hiddens, num_hiddens))
    b_h = nd.zeros(num_hiddens, ctx=ctx)

    # 输出层参数
    W_hq = _one((num_hiddens, num_outputs))
    b_q = nd.zeros(num_outputs, ctx=ctx)
    # 附上梯度
    params = [W_xh, W_hh, b_h, W_hq, b_q]
    for param in params:
        param.attach_grad()
    return params


def init_rnn_state(batch_size, num_hiddens, ctx):
    return nd.zeros(shape=(batch_size, num_hiddens), ctx=ctx),


def rnn(inputs, state, params):
    # inputs和outputs皆为num_steps个形状为(batch_size, vocab_size)的矩阵
    W_xh, W_hh, b_h, W_hq, b_q = params
    H, = state
    outputs = []
    for X in inputs:
        H = nd.tanh(nd.dot(X, W_xh) + nd.dot(H, W_hh) + b_h)
        Y = nd.dot(H, W_hq) + b_q
        outputs.append(Y)
    return outputs, (H,)


def predict_rnn(prefix, num_chars, rnn, params, init_rnn_state,
                num_hiddens, vocab_size, ctx, idx_to_char, char_to_idx):
    state = init_rnn_state(1, num_hiddens, ctx)
    output = [char_to_idx[prefix[0]]]
    for t in range(num_chars + len(prefix) - 1):
        # 将上一实践步的输出作为当前时间步的输入
        X = to_onehot(nd.array([output[-1]], ctx=ctx), vocab_size)
        # 计算输出和更新隐藏状态
        Y, state = rnn(X, state, params)
        # 下一个时间步的输入是prefix里的字符或者当前的最佳预测字符
        if t < len(prefix) - 1:
            output.append(char_to_idx[prefix[t + 1]])
        else:
            output.append(int(Y[0].argmax(axis=1).asscalar()))
    return ''.join([idx_to_char[i] for i in output])


def grad_clipping(params, theta, ctx):
    norm = nd.array([0], ctx)
    for param in params:
        norm += (param.grad ** 2).sum()
    norm = norm.sqrt().asscalar()
    if norm > theta:
        for param in params:
            param.grad[:] *= theta / norm


def sgd(params, lr, batch_size):
    for param in params:
        # print("param:", param)
        param[:] = param - lr * param.grad / batch_size


def train_and_predict_rnn(rnn, get_params, init_rnn_state, num_hiddens,
                          vocab_size, ctx, corpus_indices, idx_to_char,
                          char_to_idx, is_random_iter, num_epochs, num_steps,
                          lr, clipping_theta, batch_size, pred_peroid,
                          pred_len, prefixes):
    if is_random_iter:
        data_iter_fn = data_iter_random
    else:
        data_iter_fn = data_iter_consecutive

    params = get_params()
    loss = gloss.SoftmaxCrossEntropyLoss()

    for epoch in range(num_epochs):
        if not is_random_iter:
            state = init_rnn_state(batch_size, num_hiddens, ctx)
        l_sum, n, start = 0.0, 0, time.time()
        data_iter = data_iter_fn(corpus_indices, batch_size, num_steps, ctx)
        for X, Y in data_iter:
            if is_random_iter:
                state = init_rnn_state(batch_size, num_hiddens, ctx)
            else:  # 否则需要使用detach函数从计算图分离隐藏状态
                for s in state:
                    s.detach()

            with autograd.record():
                inputs = to_onehot(X, vocab_size)
                # outputs有num_steps个形状为(batch_size, vocab_size)的矩阵
                outputs, state = rnn(inputs, state, params)
                # 拼接之后形状为(num_steps*batch_size, vocab_size)
                outputs = nd.concat(*outputs, dim=0)
                # Y的形状是(batch_size, num_steps)，转置后再变成长度为
                # batch * num_steps的向量，这样跟输出的行一一对应
                y = Y.T.reshape((-1,))
                # 使用交叉熵损失计算平均分类误差
                l = loss(outputs, y).mean()
            l.backward()
            grad_clipping(params, clipping_theta, ctx)  # 裁剪梯度
            sgd(params, lr, 1)  # 因为误差已经去过均值，梯度不用再做平均
            l_sum += l.asscalar() * y.size
            n += y.size

        if (epoch + 1) % pred_peroid == 0:
            print('epoch %d, perplexity %f, time %.2f sec' % (
                epoch + 1, math.exp(l_sum / n), time.time() - start))
            for prefix in prefixes:
                print(' -', predict_rnn(
                    prefix, pred_len, rnn, params, init_rnn_state,
                    num_hiddens, vocab_size, ctx, idx_to_char, char_to_idx))


idx_to_char, char_to_idx, corpus_indices, vocab_size = load_data_jay_lyrics()
num_inputs, num_hiddens, num_outputs = vocab_size, 256, vocab_size
ctx = try_gpu()
print('will use', ctx)

# X = nd.arange(10).reshape((2, 5))
# state = init_rnn_state(X.shape[0], num_hiddens, ctx)
# inputs = to_onehot(X.as_in_context(ctx), vocab_size)
# print(inputs)
#
# params = get_params()
# outputs, state_new = rnn(inputs, state, params)
# print(len(outputs), outputs[0].shape, state_new[0].shape)
#
#
# predict_txt = predict_rnn('分开', 10, rnn, params, init_rnn_state, num_hiddens, vocab_size,
#             ctx, idx_to_char, char_to_idx)
#
# print(predict_txt)

num_epochs, num_steps, batch_size, lr, clipping_theta = 250, 35, 32, 1e2, 1e-2
pred_peroid, pred_len, prefixes = 50, 50, ['分开', '不分开']
train_and_predict_rnn(rnn, get_params, init_rnn_state, num_hiddens,
                      vocab_size, ctx, corpus_indices, idx_to_char,
                      char_to_idx, False, num_epochs, num_steps, lr,
                      clipping_theta, batch_size, pred_peroid, pred_len, prefixes)

```
**随机采样训练**
```python
epoch 50, perplexity 72.632877, time 3.05 sec
 - 分开 我不么 一颗两 三颗四 三颗四 三颗四 三颗四 三颗四 三颗四 三颗四 三颗四 三颗四 三颗四 三
 - 不分开 我有就 一颗两 三颗四 三颗四 三颗四 三颗四 三颗四 三颗四 三颗四 三颗四 三颗四 三颗四 三
epoch 100, perplexity 10.219814, time 3.04 sec
 - 分开 一只用 一步两步三步四步望著天 看星星 一颗两颗三步四步望著天 看星星 一颗两颗三步四步望著天 看
 - 不分开吗 我不能再生你 世知不觉 你已经离开棍 哼哼哈兮 快使用双截棍 哼哼哈兮 快使用双截棍 哼哼哈兮
epoch 150, perplexity 2.869053, time 4.22 sec
 - 分开 一只两颗 沙碎上 在数我抬起 一定看停留义 为 随底开都防边 我这想这担我 选你这种队 一样过人
 - 不分开吗 我后能爸 你打我早 这样透 痛数我抬起头 有话去对医药箱说 别怪我 别怪我 说你怎么 每实伦中的
epoch 200, perplexity 1.593117, time 3.06 sec
 - 分开不会见因悲  却过云层坦堡 但只了你和汉堡 我想要你的微笑每天都能看到  我知道这里很美但家乡的你更
 - 不分开吗把的胖女巫 用拉丁文念咒语啦啦呜 她养的黑猫笑起来像哭 啦啦啦呜 再来的外屋前红 茶说就我妈绕事
epoch 250, perplexity 1.309647, time 3.67 sec
 - 分开球 不因在这样的寻瓣酱 我对著黑白照片开始想像 爸和妈当年的模样 说著一口吴侬软语的姑娘缓缓走了外滩
 - 不分开吗 然后将过去 慢慢温习 让我爱上你 那场悲剧 是你完美演出的一场戏 宁愿心碎哭泣 再狠狠忘记 你爱
```
**相邻采样训练**
```python
epoch 50, perplexity 63.569066, time 3.13 sec
 - 分开 我想要这爱 有不的美 全人了双截  哼知你 别子我有 我想要这想 有不的美 全人了人 我有多的可写
 - 不分开 我想要这爱 有不的美 全人了双截  哼知你 别子我有 我想要这想 有不的美 全人了人 我有多的可写
epoch 100, perplexity 7.389908, time 3.13 sec
 - 分开 一颗我 别怪我 别你怎么都对我 甩开球我满腔的怒火 我想揍你已经很久 别想躲 说你眼睛看着我 别发
 - 不分开觉 你成我 别怪么 它什好睛的片 还地 老子再久了吧? 败不你的黑色幽默 不要 这什么我 戒小说动防
epoch 150, perplexity 2.130088, time 3.54 sec
 - 分开 一颗我 印打我 三过怎人面对的怒盒里藏 一场承受年我 一场线最队 除非它乌鸦抢了它的窝 它在灌木丛
 - 不分开觉 你真经很开我 不知不觉 我跟了这节奏 后知后觉 又过了一个秋 后知后觉 我该好好生活 我该好好生
epoch 200, perplexity 1.327236, time 3.40 sec
 - 分开 一候我 谁打我 别你怎么面对我 甩开球我满腔的怒火 我想揍你已经很久 别想躲 说你眼睛看着我 别发
 - 不分开觉 你真经很开我 不知不觉 我跟了这节奏 后知后觉 又过了一个秋 后知后觉 我该好好生活 我该好好生
epoch 250, perplexity 1.188282, time 3.09 sec
 - 分开 一候我 谁怪神枪手 巫师 他念念 有词的 对酋长下诅咒 还我骷髅头 这故事 告诉我 印地安的传说
 - 不分开觉 你想经离开我 不知不觉 我跟了这节奏 后知后觉 又过了觉 迷迷蒙蒙 你给的梦 出现裂缝 隐隐作痛
```
## 循环神经网络的简洁实现
### 测试
```python
import math
from mxnet.gluon import loss as gloss, nn, rnn
from mxnet import autograd, init, nd
import time
import zipfile


def load_data_jay_lyrics():
    with zipfile.ZipFile('./data/jaychou_lyrics.txt.zip') as zin:
        with zin.open('jaychou_lyrics.txt') as f:
            corpus_chars = f.read().decode('utf-8')
    print(corpus_chars[:40])

    corpus_chars = corpus_chars.replace('\n', ' ').replace('\r', ' ')
    # 仅使用前1万个字符训练模型
    corpus_chars = corpus_chars[0:10000]

    idx_to_char = list(set(corpus_chars))
    char_to_idx = dict([(char, i) for i, char in enumerate(idx_to_char)])
    vocab_size = len(char_to_idx)
    print(vocab_size)
    print(char_to_idx)

    x = [(char, i) for i, char in enumerate(idx_to_char)]
    print(x[:20])

    # 训练集中的每个字符转化成索引
    corpus_indices = [char_to_idx[char] for char in corpus_chars]
    # 打印前20个字符机器对应的索引
    sample = corpus_indices[:20]
    print('chars:', ''.join([idx_to_char[idx] for idx in sample]))
    print('indices:', sample)
    return idx_to_char, char_to_idx, corpus_indices, vocab_size


corpus_indices, char_to_idx, idx_to_char, vocab_size = load_data_jay_lyrics()
num_hiddens = 256
rnn_layer = rnn.RNN(num_hiddens)
rnn_layer.initialize()

batch_size = 2
# (隐藏层个数，批量大小，隐藏单元个数)
state = rnn_layer.begin_state(batch_size=batch_size)
print(state[0].shape)

num_steps = 35
# (时间步数，批量大小，输入个数)
X = nd.random.uniform(shape=(num_steps, batch_size, vocab_size))
# (时间步数，批量大小，隐藏单元个数)
Y, state_new = rnn_layer(X, state)
print(Y.shape, len(state_new), state_new[0].shape)

```
```Python
(1, 2, 256)
(35, 2, 256) 1 (1, 2, 256)
```
### 训练
```python
import math
from mxnet.gluon import loss as gloss, nn, rnn
from mxnet import autograd, init, nd, gluon
import time
import zipfile
import mxnet as mx


def load_data_jay_lyrics():
    with zipfile.ZipFile('./data/jaychou_lyrics.txt.zip') as zin:
        with zin.open('jaychou_lyrics.txt') as f:
            corpus_chars = f.read().decode('utf-8')
    print(corpus_chars[:40])

    corpus_chars = corpus_chars.replace('\n', ' ').replace('\r', ' ')
    # 仅使用前1万个字符训练模型
    corpus_chars = corpus_chars[0:10000]

    idx_to_char = list(set(corpus_chars))
    char_to_idx = dict([(char, i) for i, char in enumerate(idx_to_char)])
    vocab_size = len(char_to_idx)
    print(vocab_size)
    print(char_to_idx)

    x = [(char, i) for i, char in enumerate(idx_to_char)]
    print(x[:20])

    # 训练集中的每个字符转化成索引
    corpus_indices = [char_to_idx[char] for char in corpus_chars]
    # 打印前20个字符机器对应的索引
    sample = corpus_indices[:20]
    print('chars:', ''.join([idx_to_char[idx] for idx in sample]))
    print('indices:', sample)
    return idx_to_char, char_to_idx, corpus_indices, vocab_size


class RNNModel(nn.Block):
    def __init__(self, rnn_layer, vocab_size, **kwargs):
        super(RNNModel, self).__init__(**kwargs)
        self.rnn = rnn_layer
        self.vocab_size = vocab_size
        self.dense = nn.Dense(vocab_size)

    def forward(self, inputs, state):
        # 将输入转置成(num_steps, batch_size)后获取one-hot向量表示
        # print(inputs.shape)
        X = nd.one_hot(inputs.T, self.vocab_size)
        # print(X.shape)
        Y, state = self.rnn(X, state)
        # 全连接层会首先将Y的形状编程(num_steps*batch_size, num_hiddens)，
        # 它的输出为(num_steps*batch_size, vocab_size)
        output = self.dense(Y.reshape((-1, Y.shape[-1])))
        return output, state

    def begin_state(self, *args, **kwargs):
        return self.rnn.begin_state(*args, **kwargs)


def predict_rnn_gluon(prefix, num_chars, model, vocab_size, ctx, idx_to_char, char_to_idx):
    # 使用model的成员函数来初始化隐藏状态
    state = model.begin_state(batch_size=1, ctx=ctx)
    output = [char_to_idx[prefix[0]]]
    for t in range(num_chars + len(prefix) - 1):
        # 将上一实践步的输出作为当前时间步的输入
        X = nd.array([output[-1]], ctx=ctx).reshape((1, 1))
        # print(X.shape)
        # 计算输出和更新隐藏状态
        Y, state = model(X, state)
        # print(Y.shape)
        # 下一个时间步的输入是prefix里的字符或者当前的最佳预测字符
        if t < len(prefix) - 1:
            output.append(char_to_idx[prefix[t + 1]])
        else:
            output.append(int(Y.argmax(axis=1).asscalar()))
    return ''.join([idx_to_char[i] for i in output])


def try_gpu():
    try:
        ctx = mx.gpu()
        _ = nd.zeros((1,), ctx=ctx)
    except mx.base.MXNetError:
        ctx = mx.cpu()
    return ctx


# num_steps: 6
# corpus_indices:
# [0,1,2,...,29]
# [[0,...,5],[6,..,11],[12,...,17],[18,...,23],[24,...,29]]
# example_indices: [0,1,2,3,4]
# shuffle example_indices: [...]
def data_iter_random(corpus_indices, batch_size, num_steps, ctx=None):
    # 减1是因为输出的索引是相应输入的索引加1
    # [0,1,2,3]输出标签应为[1,2,3,4]
    # 为了防止溢出
    num_examples = (len(corpus_indices) - 1) // num_steps
    # print(num_examples)
    epoch_size = num_examples // batch_size
    example_indices = list(range(num_examples))
    random.shuffle(example_indices)

    # 返回从pos开始的长为num_steps的序列
    def _data(pos):
        return corpus_indices[pos: pos + num_steps]

    for i in range(epoch_size):
        # 每次读取batch_size个随机样本
        i = i * batch_size
        batch_indices = example_indices[i:i + batch_size]
        X = [_data(j * num_steps) for j in batch_indices]
        Y = [_data(j * num_steps + 1) for j in batch_indices]
        yield nd.array(X, ctx), nd.array(Y, ctx)


def data_iter_consecutive(corpus_indices, batch_size, num_steps, ctx=None):
    corpus_indices = nd.array(corpus_indices, ctx=ctx)
    data_len = len(corpus_indices)
    batch_len = data_len // batch_size
    indices = corpus_indices[0:batch_size * batch_len].reshape((batch_size, batch_len))
    # print(indices)
    epoch_size = (batch_len - 1) // num_steps
    for i in range(epoch_size):
        i = i * num_steps
        X = indices[:, i:i + num_steps]
        Y = indices[:, i + 1:i + num_steps + 1]
        yield X, Y


def grad_clipping(params, theta, ctx):
    norm = nd.array([0], ctx)
    for param in params:
        norm += (param.grad ** 2).sum()
    norm = norm.sqrt().asscalar()
    if norm > theta:
        for param in params:
            param.grad[:] *= theta / norm


def train_and_predict_rnn_gluon(model, num_hiddens, vocab_size, ctx,
                                corpus_indices, idx_to_char, char_to_idx,
                                num_epochs, num_steps, lr, clipping_theta,
                                batch_size, pred_peroid, pred_len, prefixes):
    loss = gloss.SoftmaxCrossEntropyLoss()
    model.initialize(ctx=ctx, force_reinit=True, init=init.Normal(0.01))
    trainer = gluon.Trainer(model.collect_params(), 'sgd',
                            {'learning_rate': lr, 'momentum': 0, 'wd': 0})
    for epoch in range(num_epochs):
        l_sum, n, start = 0.0, 0, time.time()
        data_iter = data_iter_consecutive(corpus_indices, batch_size, num_steps, ctx)
        state = model.begin_state(batch_size=batch_size, ctx=ctx)
        for X, Y in data_iter:
            for s in state:
                s.detach()
            with autograd.record():
                output, state = model(X, state)
                y = Y.T.reshape((-1,))
                l = loss(output, y).mean()
            l.backward()
            # 梯度裁剪
            params = [p.data() for p in model.collect_params().values()]
            grad_clipping(params, clipping_theta, ctx)
            trainer.step(1)  # 因为已经误差取过均值，梯度不用再做平均
            l_sum += l.asscalar() * y.size
            n += y.size
        if (epoch + 1) % pred_peroid == 0:
            print('epoch %d, perplexity %f, time %.2f sec' % (
                epoch + 1, math.exp(l_sum / n), time.time() - start))
            for prefix in prefixes:
                print('-', predict_rnn_gluon(prefix, pred_len,
                                             model, vocab_size, idx_to_char, char_to_idx))


ctx = try_gpu()
idx_to_char, char_to_idx, corpus_indices, vocab_size = load_data_jay_lyrics()
num_hiddens = 256
num_steps = 35
rnn_layer = rnn.RNN(num_hiddens)
rnn_layer.initialize()
model = RNNModel(rnn_layer, vocab_size)
model.initialize(force_reinit=True, ctx=ctx)

num_epochs, batch_size, lr, clipping_theta = 250, 32, 1e2, 1e-2
pred_period, pred_len, prefixes = 50, 50, ['分开', '不分开']
train_and_predict_rnn_gluon(model, num_hiddens, vocab_size, ctx,
                            corpus_indices, idx_to_char, char_to_idx,
                            num_epochs, num_steps, lr, clipping_theta,
                            batch_size, pred_period, pred_len, prefixes)


```
## 门控循环神经网络GRU
### 从零开始实现
```Python
from mxnet import nd, autograd
from mxnet.gluon import rnn, loss as gloss
import time
import zipfile
import mxnet as mx
import math
import random


def load_data_jay_lyrics():
    with zipfile.ZipFile('./data/jaychou_lyrics.txt.zip') as zin:
        with zin.open('jaychou_lyrics.txt') as f:
            corpus_chars = f.read().decode('utf-8')
    print(corpus_chars[:40])

    corpus_chars = corpus_chars.replace('\n', ' ').replace('\r', ' ')
    # 仅使用前1万个字符训练模型
    corpus_chars = corpus_chars[0:10000]

    idx_to_char = list(set(corpus_chars))
    char_to_idx = dict([(char, i) for i, char in enumerate(idx_to_char)])
    vocab_size = len(char_to_idx)
    print(vocab_size)
    print(char_to_idx)

    x = [(char, i) for i, char in enumerate(idx_to_char)]
    print(x[:20])

    # 训练集中的每个字符转化成索引
    corpus_indices = [char_to_idx[char] for char in corpus_chars]
    # 打印前20个字符机器对应的索引
    sample = corpus_indices[:20]
    print('chars:', ''.join([idx_to_char[idx] for idx in sample]))
    print('indices:', sample)
    return idx_to_char, char_to_idx, corpus_indices, vocab_size


def try_gpu():
    try:
        ctx = mx.gpu()
        _ = nd.zeros((1,), ctx=ctx)
    except mx.base.MXNetError:
        ctx = mx.cpu()
    return ctx


def get_params():
    def _one(shape):
        return nd.random.normal(scale=0.01, shape=shape, ctx=ctx)

    def _three():
        return _one((num_inputs, num_hiddens)), _one((num_hiddens, num_hiddens)), nd.zeros(num_hiddens, ctx=ctx)

    W_xz, W_hz, b_z = _three()  # 更新门参数
    W_xr, W_hr, b_r = _three()  # 重置门参数
    W_xh, W_hh, b_h = _three()  # 候选隐藏状态参数

    # 输出层参数
    W_hq = _one((num_hiddens, num_outputs))
    b_q = nd.zeros(num_outputs, ctx=ctx)
    # 附上梯度
    params = [W_xz, W_hz, b_z, W_xr, W_hr, b_r, W_xh, W_hh, b_h, W_hq, b_q]
    for param in params:
        param.attach_grad()
    return params


def init_gru_state(batch_size, num_hiddens, ctx):
    return nd.zeros(shape=(batch_size, num_hiddens), ctx=ctx),


def gru(inputs, state, params):
    W_xz, W_hz, b_z, W_xr, W_hr, b_r, W_xh, W_hh, b_h, W_hq, b_q = params
    H, = state
    outputs = []
    for X in inputs:
        Z = nd.sigmoid(nd.dot(X, W_xz) + nd.dot(H, W_hz) + b_z)
        R = nd.sigmoid(nd.dot(X, W_xr) + nd.dot(H, W_hr) + b_r)
        H_tilda = nd.tanh(nd.dot(X, W_xh) + nd.dot(R * H, W_hh) + b_h)
        H = Z * H + (1 - Z) * H_tilda
        Y = nd.dot(H, W_hq) + b_q
        outputs.append(Y)
    return outputs, (H,)


def to_onehot(X, size):
    return [nd.one_hot(x, size) for x in X.T]


def grad_clipping(params, theta, ctx):
    norm = nd.array([0], ctx)
    for param in params:
        norm += (param.grad ** 2).sum()
    norm = norm.sqrt().asscalar()
    if norm > theta:
        for param in params:
            param.grad[:] *= theta / norm


def sgd(params, lr, batch_size):
    for param in params:
        # print("param:", param)
        param[:] = param - lr * param.grad / batch_size


# num_steps: 6
# corpus_indices:
# [0,1,2,...,29]
# [[0,...,5],[6,..,11],[12,...,17],[18,...,23],[24,...,29]]
# example_indices: [0,1,2,3,4]
# shuffle example_indices: [...]
def data_iter_random(corpus_indices, batch_size, num_steps, ctx=None):
    # 减1是因为输出的索引是相应输入的索引加1
    # [0,1,2,3]输出标签应为[1,2,3,4]
    # 为了防止溢出
    num_examples = (len(corpus_indices) - 1) // num_steps
    # print(num_examples)
    epoch_size = num_examples // batch_size
    example_indices = list(range(num_examples))
    random.shuffle(example_indices)

    # 返回从pos开始的长为num_steps的序列
    def _data(pos):
        return corpus_indices[pos: pos + num_steps]

    for i in range(epoch_size):
        # 每次读取batch_size个随机样本
        i = i * batch_size
        batch_indices = example_indices[i:i + batch_size]
        X = [_data(j * num_steps) for j in batch_indices]
        Y = [_data(j * num_steps + 1) for j in batch_indices]
        yield nd.array(X, ctx), nd.array(Y, ctx)


def data_iter_consecutive(corpus_indices, batch_size, num_steps, ctx=None):
    corpus_indices = nd.array(corpus_indices, ctx=ctx)
    data_len = len(corpus_indices)
    batch_len = data_len // batch_size
    indices = corpus_indices[0:batch_size * batch_len].reshape((batch_size, batch_len))
    # print(indices)
    epoch_size = (batch_len - 1) // num_steps
    for i in range(epoch_size):
        i = i * num_steps
        X = indices[:, i:i + num_steps]
        Y = indices[:, i + 1:i + num_steps + 1]
        yield X, Y


def predict_rnn(prefix, num_chars, rnn, params, init_rnn_state,
                num_hiddens, vocab_size, ctx, idx_to_char, char_to_idx):
    state = init_rnn_state(1, num_hiddens, ctx)
    output = [char_to_idx[prefix[0]]]
    for t in range(num_chars + len(prefix) - 1):
        # 将上一实践步的输出作为当前时间步的输入
        X = to_onehot(nd.array([output[-1]], ctx=ctx), vocab_size)
        # 计算输出和更新隐藏状态
        Y, state = rnn(X, state, params)
        # 下一个时间步的输入是prefix里的字符或者当前的最佳预测字符
        if t < len(prefix) - 1:
            output.append(char_to_idx[prefix[t + 1]])
        else:
            output.append(int(Y[0].argmax(axis=1).asscalar()))
    return ''.join([idx_to_char[i] for i in output])


def train_and_predict_rnn(rnn, get_params, init_rnn_state, num_hiddens,
                          vocab_size, ctx, corpus_indices, idx_to_char,
                          char_to_idx, is_random_iter, num_epochs, num_steps,
                          lr, clipping_theta, batch_size, pred_peroid,
                          pred_len, prefixes):
    if is_random_iter:
        data_iter_fn = data_iter_random
    else:
        data_iter_fn = data_iter_consecutive

    params = get_params()
    loss = gloss.SoftmaxCrossEntropyLoss()

    for epoch in range(num_epochs):
        if not is_random_iter:
            state = init_rnn_state(batch_size, num_hiddens, ctx)
        l_sum, n, start = 0.0, 0, time.time()
        data_iter = data_iter_fn(corpus_indices, batch_size, num_steps, ctx)
        for X, Y in data_iter:
            if is_random_iter:
                state = init_rnn_state(batch_size, num_hiddens, ctx)
            else:  # 否则需要使用detach函数从计算图分离隐藏状态
                for s in state:
                    s.detach()

            with autograd.record():
                inputs = to_onehot(X, vocab_size)
                # outputs有num_steps个形状为(batch_size, vocab_size)的矩阵
                outputs, state = rnn(inputs, state, params)
                # 拼接之后形状为(num_steps*batch_size, vocab_size)
                outputs = nd.concat(*outputs, dim=0)
                # Y的形状是(batch_size, num_steps)，转置后再变成长度为
                # batch * num_steps的向量，这样跟输出的行一一对应
                y = Y.T.reshape((-1,))
                # 使用交叉熵损失计算平均分类误差
                l = loss(outputs, y).mean()
            l.backward()
            grad_clipping(params, clipping_theta, ctx)  # 裁剪梯度
            sgd(params, lr, 1)  # 因为误差已经去过均值，梯度不用再做平均
            l_sum += l.asscalar() * y.size
            n += y.size

        if (epoch + 1) % pred_peroid == 0:
            print('epoch %d, perplexity %f, time %.2f sec' % (
                epoch + 1, math.exp(l_sum / n), time.time() - start))
            for prefix in prefixes:
                print(' -', predict_rnn(
                    prefix, pred_len, rnn, params, init_rnn_state,
                    num_hiddens, vocab_size, ctx, idx_to_char, char_to_idx))


idx_to_char, char_to_idx, corpus_indices, vocab_size = load_data_jay_lyrics()
num_inputs, num_hiddens, num_outputs = vocab_size, 256, vocab_size
ctx = try_gpu()

num_epochs, num_steps, batch_size, lr, clipping_theta = 160, 35, 32, 1e2, 1e-2
pred_period, pred_len, prefixes = 40, 50, ['分开', '不分开']
train_and_predict_rnn(gru, get_params, init_gru_state, num_hiddens,
                      vocab_size, ctx, corpus_indices, idx_to_char,
                      char_to_idx, False, num_epochs, num_steps, lr,
                      clipping_theta, batch_size, pred_period, pred_len, prefixes)
```
```Python
epoch 40, perplexity 152.503488, time 3.45 sec
 - 分开 我想你的让我不想想想想想你想你想想想想你想你想想想想你想你想想想想你想你想想想想你想你想想想想你想
 - 不分开 我想你的让我不想想想想想你想你想想想想你想你想想想想你想你想想想想你想你想想想想你想你想想想想你想
epoch 80, perplexity 32.785765, time 3.46 sec
 - 分开 一直我 别子我 别你的手 快果我有 你不了 我不要觉 我不要再想 我不要再想 我不要再想 我不要再
 - 不分开 我想要这样 我不要再想 我不能再想 我不要再想 我不要再想 我不要再想 我不要再想 我不要再想 我
epoch 120, perplexity 5.800570, time 3.85 sec
 - 分开 我想要这样牵着你的手不放开 爱可不可以简简单单没有伤害 你 靠着我的肩膀 你 在我胸口睡著 像这样
 - 不分开 你是我怕开睡是不知不想多  我知道这里很美但像乡的你更美剧过我想要你 我想我的睡有 你 在我胸口睡
epoch 160, perplexity 1.822375, time 3.63 sec
 - 分开 我想要你的微笑每天都能看到  我知道这里很美但家乡的你更美走过我只想要你 陪我去吃汉堡  说穿了其
 - 不分开 整个过离开离我不开 我不能受力 我不要再想 我不 我不 我不能 爱情走的太快就像龙卷风 不能承受我
```
### 简洁实现
```Python
import math
from mxnet.gluon import loss as gloss, nn, rnn
from mxnet import autograd, init, nd, gluon
import time
import zipfile
import mxnet as mx


def load_data_jay_lyrics():
    with zipfile.ZipFile('./data/jaychou_lyrics.txt.zip') as zin:
        with zin.open('jaychou_lyrics.txt') as f:
            corpus_chars = f.read().decode('utf-8')
    # print(corpus_chars[:40])

    corpus_chars = corpus_chars.replace('\n', ' ').replace('\r', ' ')
    # 仅使用前1万个字符训练模型
    corpus_chars = corpus_chars[0:10000]

    idx_to_char = list(set(corpus_chars))
    char_to_idx = dict([(char, i) for i, char in enumerate(idx_to_char)])
    vocab_size = len(char_to_idx)
    # print(vocab_size)
    # print(char_to_idx)

    x = [(char, i) for i, char in enumerate(idx_to_char)]
    # print(x[:20])

    # 训练集中的每个字符转化成索引
    corpus_indices = [char_to_idx[char] for char in corpus_chars]
    # 打印前20个字符机器对应的索引
    sample = corpus_indices[:20]
    print('chars:', ''.join([idx_to_char[idx] for idx in sample]))
    print('indices:', sample)
    return idx_to_char, char_to_idx, corpus_indices, vocab_size


class RNNModel(nn.Block):
    def __init__(self, rnn_layer, vocab_size, **kwargs):
        super(RNNModel, self).__init__(**kwargs)
        self.rnn = rnn_layer
        self.vocab_size = vocab_size
        self.dense = nn.Dense(vocab_size)

    def forward(self, inputs, state):
        # 将输入转置成(num_steps, batch_size)后获取one-hot向量表示
        # print(inputs.shape)
        X = nd.one_hot(inputs.T, self.vocab_size)
        # print(X.shape)
        Y, state = self.rnn(X, state)
        # 全连接层会首先将Y的形状编程(num_steps*batch_size, num_hiddens)，
        # 它的输出为(num_steps*batch_size, vocab_size)
        output = self.dense(Y.reshape((-1, Y.shape[-1])))
        return output, state

    def begin_state(self, *args, **kwargs):
        return self.rnn.begin_state(*args, **kwargs)


def predict_rnn_gluon(prefix, num_chars, model, vocab_size, ctx, idx_to_char, char_to_idx):
    # 使用model的成员函数来初始化隐藏状态
    state = model.begin_state(batch_size=1, ctx=ctx)
    output = [char_to_idx[prefix[0]]]
    for t in range(num_chars + len(prefix) - 1):
        # 将上一实践步的输出作为当前时间步的输入
        X = nd.array([output[-1]], ctx=ctx).reshape((1, 1))
        # print(X.shape)
        # 计算输出和更新隐藏状态
        Y, state = model(X, state)
        # print(Y.shape)
        # 下一个时间步的输入是prefix里的字符或者当前的最佳预测字符
        if t < len(prefix) - 1:
            output.append(char_to_idx[prefix[t + 1]])
        else:
            output.append(int(Y.argmax(axis=1).asscalar()))
    return ''.join([idx_to_char[i] for i in output])


def try_gpu():
    try:
        ctx = mx.gpu()
        _ = nd.zeros((1,), ctx=ctx)
    except mx.base.MXNetError:
        ctx = mx.cpu()
    return ctx


# num_steps: 6
# corpus_indices:
# [0,1,2,...,29]
# [[0,...,5],[6,..,11],[12,...,17],[18,...,23],[24,...,29]]
# example_indices: [0,1,2,3,4]
# shuffle example_indices: [...]
def data_iter_random(corpus_indices, batch_size, num_steps, ctx=None):
    # 减1是因为输出的索引是相应输入的索引加1
    # [0,1,2,3]输出标签应为[1,2,3,4]
    # 为了防止溢出
    num_examples = (len(corpus_indices) - 1) // num_steps
    # print(num_examples)
    epoch_size = num_examples // batch_size
    example_indices = list(range(num_examples))
    random.shuffle(example_indices)

    # 返回从pos开始的长为num_steps的序列
    def _data(pos):
        return corpus_indices[pos: pos + num_steps]

    for i in range(epoch_size):
        # 每次读取batch_size个随机样本
        i = i * batch_size
        batch_indices = example_indices[i:i + batch_size]
        X = [_data(j * num_steps) for j in batch_indices]
        Y = [_data(j * num_steps + 1) for j in batch_indices]
        yield nd.array(X, ctx), nd.array(Y, ctx)


def data_iter_consecutive(corpus_indices, batch_size, num_steps, ctx=None):
    corpus_indices = nd.array(corpus_indices, ctx=ctx)
    data_len = len(corpus_indices)
    batch_len = data_len // batch_size
    indices = corpus_indices[0:batch_size * batch_len].reshape((batch_size, batch_len))
    # print(indices)
    epoch_size = (batch_len - 1) // num_steps
    for i in range(epoch_size):
        i = i * num_steps
        X = indices[:, i:i + num_steps]
        Y = indices[:, i + 1:i + num_steps + 1]
        yield X, Y


def grad_clipping(params, theta, ctx):
    norm = nd.array([0], ctx)
    for param in params:
        norm += (param.grad ** 2).sum()
    norm = norm.sqrt().asscalar()
    if norm > theta:
        for param in params:
            param.grad[:] *= theta / norm


def train_and_predict_rnn_gluon(model, num_hiddens, vocab_size, ctx,
                                corpus_indices, idx_to_char, char_to_idx,
                                num_epochs, num_steps, lr, clipping_theta,
                                batch_size, pred_peroid, pred_len, prefixes):
    loss = gloss.SoftmaxCrossEntropyLoss()
    model.initialize(ctx=ctx, force_reinit=True, init=init.Normal(0.01))
    trainer = gluon.Trainer(model.collect_params(), 'sgd',
                            {'learning_rate': lr, 'momentum': 0, 'wd': 0})
    for epoch in range(num_epochs):
        l_sum, n, start = 0.0, 0, time.time()
        data_iter = data_iter_consecutive(corpus_indices, batch_size, num_steps, ctx)
        state = model.begin_state(batch_size=batch_size, ctx=ctx)
        for X, Y in data_iter:
            for s in state:
                s.detach()
            with autograd.record():
                output, state = model(X, state)
                y = Y.T.reshape((-1,))
                l = loss(output, y).mean()
            l.backward()
            # 梯度裁剪
            params = [p.data() for p in model.collect_params().values()]
            grad_clipping(params, clipping_theta, ctx)
            trainer.step(1)  # 因为已经误差取过均值，梯度不用再做平均
            l_sum += l.asscalar() * y.size
            n += y.size
        if (epoch + 1) % pred_peroid == 0:
            print('epoch %d, perplexity %f, time %.2f sec' % (
                epoch + 1, math.exp(l_sum / n), time.time() - start))
            for prefix in prefixes:
                print('-', predict_rnn_gluon(prefix, pred_len,
                                             model, vocab_size, ctx, idx_to_char, char_to_idx))


ctx = try_gpu()
idx_to_char, char_to_idx, corpus_indices, vocab_size = load_data_jay_lyrics()
num_hiddens = 256
num_steps = 35
gru_layer = rnn.GRU(num_hiddens)
gru_layer.initialize()
model = RNNModel(gru_layer, vocab_size)
model.initialize(force_reinit=True, ctx=ctx)

num_epochs, batch_size, lr, clipping_theta = 250, 32, 1e2, 1e-2
pred_period, pred_len, prefixes = 50, 50, ['分开', '不分开']
train_and_predict_rnn_gluon(model, num_hiddens, vocab_size, ctx,
                            corpus_indices, idx_to_char, char_to_idx,
                            num_epochs, num_steps, lr, clipping_theta,
                            batch_size, pred_period, pred_len, prefixes)

```
```Python
想要有直升机
想要和你飞到宇宙去
想要和你融化在一起
融化在宇宙里
我每天每天每
chars: 想要有直升机 想要和你飞到宇宙去 想要和
indices: [977, 410, 954, 551, 770, 182, 305, 977, 410, 52, 928, 419, 360, 950, 804, 705, 305, 977, 410, 52]
epoch 50, perplexity 112.876464, time 3.66 sec
- 分开 我想你 我不要 我不要 我不要 我不要 我不要 我不要 我不要 我不要 我不要 我不要 我不要 我
- 不分开 我想你 我不要 我不要 我不要 我不要 我不要 我不要 我不要 我不要 我不要 我不要 我不要 我
epoch 100, perplexity 12.570226, time 3.29 sec
- 分开 我想就这样里堡 但你在我满腔的怒火 我想揍你已经很久 想想想你的微笑 让你在我遇见 让没有没有 我
- 不分开 我爱你的爱写在西元前 深埋在美索不达米亚平原 用楔形文年的世斑鸠 我感的让我疯狂的可爱女人 坏坏的
epoch 150, perplexity 1.831173, time 3.69 sec
- 分开 我想带你已经很久 别想躲 说你眼睛看着我 别发抖 快给我抬起头 有话去对医药箱说 别怪我 别怪我
- 不分开 你已经离开我 不知不觉 我跟了这节奏 后知后觉 又过了一个秋 后知后觉 我该好好生活 我该好好生活
epoch 200, perplexity 1.067530, time 3.59 sec
- 分开 我想轻的话模笑样没在看到 你给我 这里我一起 悲化我都做得到 但那个人已经不是我 上海一九四三 泛
- 不分开 平过我怕你泪痛 我想要你的微笑每天都能看到  我知道这里很美但家乡的你更美原来我只想要你 陪我去吃
epoch 250, perplexity 1.030577, time 3.22 sec
- 分开 我想轻声斯嵩山 想要是你笑到宇宙去 想要和你融化在一起 融化在宇宙里 我每天每天每天在想想想想著你
- 不分开觉  杵过云层 我试著努力向你奔跑 爱才送到 你却已在别人怀抱 就是开不了口让她知道 我一定会呵护著
```
## 长短期记忆循环神经网络LSTM
### LSTM原生实现
```Python
from mxnet import nd, autograd
from mxnet.gluon import rnn, loss as gloss
import time
import zipfile
import mxnet as mx
import math
import random


def load_data_jay_lyrics():
    with zipfile.ZipFile('./data/jaychou_lyrics.txt.zip') as zin:
        with zin.open('jaychou_lyrics.txt') as f:
            corpus_chars = f.read().decode('utf-8')
    print(corpus_chars[:40])

    corpus_chars = corpus_chars.replace('\n', ' ').replace('\r', ' ')
    # 仅使用前1万个字符训练模型
    corpus_chars = corpus_chars[0:10000]

    idx_to_char = list(set(corpus_chars))
    char_to_idx = dict([(char, i) for i, char in enumerate(idx_to_char)])
    vocab_size = len(char_to_idx)
    print(vocab_size)
    print(char_to_idx)

    x = [(char, i) for i, char in enumerate(idx_to_char)]
    print(x[:20])

    # 训练集中的每个字符转化成索引
    corpus_indices = [char_to_idx[char] for char in corpus_chars]
    # 打印前20个字符机器对应的索引
    sample = corpus_indices[:20]
    print('chars:', ''.join([idx_to_char[idx] for idx in sample]))
    print('indices:', sample)
    return idx_to_char, char_to_idx, corpus_indices, vocab_size


def try_gpu():
    try:
        ctx = mx.gpu()
        _ = nd.zeros((1,), ctx=ctx)
    except mx.base.MXNetError:
        ctx = mx.cpu()
    return ctx


def get_params():
    def _one(shape):
        return nd.random.normal(scale=0.01, shape=shape, ctx=ctx)

    def _three():
        return _one((num_inputs, num_hiddens)), _one((num_hiddens, num_hiddens)), nd.zeros(num_hiddens, ctx=ctx)

    W_xi, W_hi, b_i = _three()  # 输入门参数
    W_xf, W_hf, b_f = _three()  # 遗忘门参数
    W_xo, W_ho, b_o = _three()  # 输出门参数
    W_xc, W_hc, b_c = _three()  # 候选记忆细胞参数

    # 输出层参数
    W_hq = _one((num_hiddens, num_outputs))
    b_q = nd.zeros(num_outputs, ctx=ctx)
    # 附上梯度
    params = [W_xi, W_hi, b_i, W_xf, W_hf, b_f, W_xo, W_ho, b_o, W_xc, W_hc, b_c,
              W_hq, b_q]
    for param in params:
        param.attach_grad()
    return params


def init_gru_state(batch_size, num_hiddens, ctx):
    return nd.zeros(shape=(batch_size, num_hiddens), ctx=ctx), nd.zeros(shape=(batch_size, num_hiddens), ctx=ctx)


def lstm(inputs, state, params):
    W_xi, W_hi, b_i, W_xf, W_hf, b_f, W_xo, W_ho, b_o, W_xc, W_hc, b_c, W_hq, b_q = params
    H, C = state
    outputs = []
    for X in inputs:
        I = nd.sigmoid(nd.dot(X, W_xi) + nd.dot(H, W_hi) + b_i)
        F = nd.sigmoid(nd.dot(X, W_xf) + nd.dot(H, W_hf) + b_f)
        O = nd.sigmoid(nd.dot(X, W_xo) + nd.dot(H, W_ho) + b_o)
        C_tilda = nd.tanh(nd.dot(X, W_xc) + nd.dot(H, W_hc) + b_c)
        C = F * C + I * C_tilda
        H = O * C.tanh()
        Y = nd.dot(H, W_hq) + b_q
        outputs.append(Y)
    return outputs, (H, C)


def to_onehot(X, size):
    return [nd.one_hot(x, size) for x in X.T]


def grad_clipping(params, theta, ctx):
    norm = nd.array([0], ctx)
    for param in params:
        norm += (param.grad ** 2).sum()
    norm = norm.sqrt().asscalar()
    if norm > theta:
        for param in params:
            param.grad[:] *= theta / norm


def sgd(params, lr, batch_size):
    for param in params:
        # print("param:", param)
        param[:] = param - lr * param.grad / batch_size


# num_steps: 6
# corpus_indices:
# [0,1,2,...,29]
# [[0,...,5],[6,..,11],[12,...,17],[18,...,23],[24,...,29]]
# example_indices: [0,1,2,3,4]
# shuffle example_indices: [...]
def data_iter_random(corpus_indices, batch_size, num_steps, ctx=None):
    # 减1是因为输出的索引是相应输入的索引加1
    # [0,1,2,3]输出标签应为[1,2,3,4]
    # 为了防止溢出
    num_examples = (len(corpus_indices) - 1) // num_steps
    # print(num_examples)
    epoch_size = num_examples // batch_size
    example_indices = list(range(num_examples))
    random.shuffle(example_indices)

    # 返回从pos开始的长为num_steps的序列
    def _data(pos):
        return corpus_indices[pos: pos + num_steps]

    for i in range(epoch_size):
        # 每次读取batch_size个随机样本
        i = i * batch_size
        batch_indices = example_indices[i:i + batch_size]
        X = [_data(j * num_steps) for j in batch_indices]
        Y = [_data(j * num_steps + 1) for j in batch_indices]
        yield nd.array(X, ctx), nd.array(Y, ctx)


def data_iter_consecutive(corpus_indices, batch_size, num_steps, ctx=None):
    corpus_indices = nd.array(corpus_indices, ctx=ctx)
    data_len = len(corpus_indices)
    batch_len = data_len // batch_size
    indices = corpus_indices[0:batch_size * batch_len].reshape((batch_size, batch_len))
    # print(indices)
    epoch_size = (batch_len - 1) // num_steps
    for i in range(epoch_size):
        i = i * num_steps
        X = indices[:, i:i + num_steps]
        Y = indices[:, i + 1:i + num_steps + 1]
        yield X, Y


def predict_rnn(prefix, num_chars, rnn, params, init_rnn_state,
                num_hiddens, vocab_size, ctx, idx_to_char, char_to_idx):
    state = init_rnn_state(1, num_hiddens, ctx)
    output = [char_to_idx[prefix[0]]]
    for t in range(num_chars + len(prefix) - 1):
        # 将上一实践步的输出作为当前时间步的输入
        X = to_onehot(nd.array([output[-1]], ctx=ctx), vocab_size)
        # 计算输出和更新隐藏状态
        Y, state = rnn(X, state, params)
        # 下一个时间步的输入是prefix里的字符或者当前的最佳预测字符
        if t < len(prefix) - 1:
            output.append(char_to_idx[prefix[t + 1]])
        else:
            output.append(int(Y[0].argmax(axis=1).asscalar()))
    return ''.join([idx_to_char[i] for i in output])


def train_and_predict_rnn(rnn, get_params, init_rnn_state, num_hiddens,
                          vocab_size, ctx, corpus_indices, idx_to_char,
                          char_to_idx, is_random_iter, num_epochs, num_steps,
                          lr, clipping_theta, batch_size, pred_peroid,
                          pred_len, prefixes):
    if is_random_iter:
        data_iter_fn = data_iter_random
    else:
        data_iter_fn = data_iter_consecutive

    params = get_params()
    loss = gloss.SoftmaxCrossEntropyLoss()

    for epoch in range(num_epochs):
        if not is_random_iter:
            state = init_rnn_state(batch_size, num_hiddens, ctx)
        l_sum, n, start = 0.0, 0, time.time()
        data_iter = data_iter_fn(corpus_indices, batch_size, num_steps, ctx)
        for X, Y in data_iter:
            if is_random_iter:
                state = init_rnn_state(batch_size, num_hiddens, ctx)
            else:  # 否则需要使用detach函数从计算图分离隐藏状态
                for s in state:
                    s.detach()

            with autograd.record():
                inputs = to_onehot(X, vocab_size)
                # outputs有num_steps个形状为(batch_size, vocab_size)的矩阵
                outputs, state = rnn(inputs, state, params)
                # 拼接之后形状为(num_steps*batch_size, vocab_size)
                outputs = nd.concat(*outputs, dim=0)
                # Y的形状是(batch_size, num_steps)，转置后再变成长度为
                # batch * num_steps的向量，这样跟输出的行一一对应
                y = Y.T.reshape((-1,))
                # 使用交叉熵损失计算平均分类误差
                l = loss(outputs, y).mean()
            l.backward()
            grad_clipping(params, clipping_theta, ctx)  # 裁剪梯度
            sgd(params, lr, 1)  # 因为误差已经去过均值，梯度不用再做平均
            l_sum += l.asscalar() * y.size
            n += y.size

        if (epoch + 1) % pred_peroid == 0:
            print('epoch %d, perplexity %f, time %.2f sec' % (
                epoch + 1, math.exp(l_sum / n), time.time() - start))
            for prefix in prefixes:
                print(' -', predict_rnn(
                    prefix, pred_len, rnn, params, init_rnn_state,
                    num_hiddens, vocab_size, ctx, idx_to_char, char_to_idx))


idx_to_char, char_to_idx, corpus_indices, vocab_size = load_data_jay_lyrics()
num_inputs, num_hiddens, num_outputs = vocab_size, 256, vocab_size
ctx = try_gpu()

num_epochs, num_steps, batch_size, lr, clipping_theta = 160, 35, 32, 1e2, 1e-2
pred_period, pred_len, prefixes = 40, 50, ['分开', '不分开']
train_and_predict_rnn(lstm, get_params, init_gru_state, num_hiddens,
                      vocab_size, ctx, corpus_indices, idx_to_char,
                      char_to_idx, False, num_epochs, num_steps, lr,
                      clipping_theta, batch_size, pred_period, pred_len, prefixes)
```
### LSTM简洁实现
```Python
import math
from mxnet.gluon import loss as gloss, nn, rnn
from mxnet import autograd, init, nd, gluon
import time
import zipfile
import mxnet as mx


def load_data_jay_lyrics():
    with zipfile.ZipFile('./data/jaychou_lyrics.txt.zip') as zin:
        with zin.open('jaychou_lyrics.txt') as f:
            corpus_chars = f.read().decode('utf-8')
    # print(corpus_chars[:40])

    corpus_chars = corpus_chars.replace('\n', ' ').replace('\r', ' ')
    # 仅使用前1万个字符训练模型
    corpus_chars = corpus_chars[0:10000]

    idx_to_char = list(set(corpus_chars))
    char_to_idx = dict([(char, i) for i, char in enumerate(idx_to_char)])
    vocab_size = len(char_to_idx)
    # print(vocab_size)
    # print(char_to_idx)

    x = [(char, i) for i, char in enumerate(idx_to_char)]
    # print(x[:20])

    # 训练集中的每个字符转化成索引
    corpus_indices = [char_to_idx[char] for char in corpus_chars]
    # 打印前20个字符机器对应的索引
    sample = corpus_indices[:20]
    print('chars:', ''.join([idx_to_char[idx] for idx in sample]))
    print('indices:', sample)
    return idx_to_char, char_to_idx, corpus_indices, vocab_size


class RNNModel(nn.Block):
    def __init__(self, rnn_layer, vocab_size, **kwargs):
        super(RNNModel, self).__init__(**kwargs)
        self.rnn = rnn_layer
        self.vocab_size = vocab_size
        self.dense = nn.Dense(vocab_size)

    def forward(self, inputs, state):
        # 将输入转置成(num_steps, batch_size)后获取one-hot向量表示
        # print(inputs.shape)
        X = nd.one_hot(inputs.T, self.vocab_size)
        # print(X.shape)
        Y, state = self.rnn(X, state)
        # 全连接层会首先将Y的形状编程(num_steps*batch_size, num_hiddens)，
        # 它的输出为(num_steps*batch_size, vocab_size)
        output = self.dense(Y.reshape((-1, Y.shape[-1])))
        return output, state

    def begin_state(self, *args, **kwargs):
        return self.rnn.begin_state(*args, **kwargs)


def predict_rnn_gluon(prefix, num_chars, model, vocab_size, ctx, idx_to_char, char_to_idx):
    # 使用model的成员函数来初始化隐藏状态
    state = model.begin_state(batch_size=1, ctx=ctx)
    output = [char_to_idx[prefix[0]]]
    for t in range(num_chars + len(prefix) - 1):
        # 将上一实践步的输出作为当前时间步的输入
        X = nd.array([output[-1]], ctx=ctx).reshape((1, 1))
        # print(X.shape)
        # 计算输出和更新隐藏状态
        Y, state = model(X, state)
        # print(Y.shape)
        # 下一个时间步的输入是prefix里的字符或者当前的最佳预测字符
        if t < len(prefix) - 1:
            output.append(char_to_idx[prefix[t + 1]])
        else:
            output.append(int(Y.argmax(axis=1).asscalar()))
    return ''.join([idx_to_char[i] for i in output])


def try_gpu():
    try:
        ctx = mx.gpu()
        _ = nd.zeros((1,), ctx=ctx)
    except mx.base.MXNetError:
        ctx = mx.cpu()
    return ctx


# num_steps: 6
# corpus_indices:
# [0,1,2,...,29]
# [[0,...,5],[6,..,11],[12,...,17],[18,...,23],[24,...,29]]
# example_indices: [0,1,2,3,4]
# shuffle example_indices: [...]
def data_iter_random(corpus_indices, batch_size, num_steps, ctx=None):
    # 减1是因为输出的索引是相应输入的索引加1
    # [0,1,2,3]输出标签应为[1,2,3,4]
    # 为了防止溢出
    num_examples = (len(corpus_indices) - 1) // num_steps
    # print(num_examples)
    epoch_size = num_examples // batch_size
    example_indices = list(range(num_examples))
    random.shuffle(example_indices)

    # 返回从pos开始的长为num_steps的序列
    def _data(pos):
        return corpus_indices[pos: pos + num_steps]

    for i in range(epoch_size):
        # 每次读取batch_size个随机样本
        i = i * batch_size
        batch_indices = example_indices[i:i + batch_size]
        X = [_data(j * num_steps) for j in batch_indices]
        Y = [_data(j * num_steps + 1) for j in batch_indices]
        yield nd.array(X, ctx), nd.array(Y, ctx)


def data_iter_consecutive(corpus_indices, batch_size, num_steps, ctx=None):
    corpus_indices = nd.array(corpus_indices, ctx=ctx)
    data_len = len(corpus_indices)
    batch_len = data_len // batch_size
    indices = corpus_indices[0:batch_size * batch_len].reshape((batch_size, batch_len))
    # print(indices)
    epoch_size = (batch_len - 1) // num_steps
    for i in range(epoch_size):
        i = i * num_steps
        X = indices[:, i:i + num_steps]
        Y = indices[:, i + 1:i + num_steps + 1]
        yield X, Y


def grad_clipping(params, theta, ctx):
    norm = nd.array([0], ctx)
    for param in params:
        norm += (param.grad ** 2).sum()
    norm = norm.sqrt().asscalar()
    if norm > theta:
        for param in params:
            param.grad[:] *= theta / norm


def train_and_predict_rnn_gluon(model, num_hiddens, vocab_size, ctx,
                                corpus_indices, idx_to_char, char_to_idx,
                                num_epochs, num_steps, lr, clipping_theta,
                                batch_size, pred_peroid, pred_len, prefixes):
    loss = gloss.SoftmaxCrossEntropyLoss()
    model.initialize(ctx=ctx, force_reinit=True, init=init.Normal(0.01))
    trainer = gluon.Trainer(model.collect_params(), 'sgd',
                            {'learning_rate': lr, 'momentum': 0, 'wd': 0})
    for epoch in range(num_epochs):
        l_sum, n, start = 0.0, 0, time.time()
        data_iter = data_iter_consecutive(corpus_indices, batch_size, num_steps, ctx)
        state = model.begin_state(batch_size=batch_size, ctx=ctx)
        for X, Y in data_iter:
            for s in state:
                s.detach()
            with autograd.record():
                output, state = model(X, state)
                y = Y.T.reshape((-1,))
                l = loss(output, y).mean()
            l.backward()
            # 梯度裁剪
            params = [p.data() for p in model.collect_params().values()]
            grad_clipping(params, clipping_theta, ctx)
            trainer.step(1)  # 因为已经误差取过均值，梯度不用再做平均
            l_sum += l.asscalar() * y.size
            n += y.size
        if (epoch + 1) % pred_peroid == 0:
            print('epoch %d, perplexity %f, time %.2f sec' % (
                epoch + 1, math.exp(l_sum / n), time.time() - start))
            for prefix in prefixes:
                print('-', predict_rnn_gluon(prefix, pred_len,
                                             model, vocab_size, ctx, idx_to_char, char_to_idx))


ctx = try_gpu()
idx_to_char, char_to_idx, corpus_indices, vocab_size = load_data_jay_lyrics()
num_hiddens = 256
num_steps = 35
lstm_layer = rnn.LSTM(num_hiddens)
lstm_layer.initialize()
model = RNNModel(lstm_layer, vocab_size)
model.initialize(force_reinit=True, ctx=ctx)

num_epochs, batch_size, lr, clipping_theta = 250, 32, 1e2, 1e-2
pred_period, pred_len, prefixes = 50, 50, ['分开', '不分开']
train_and_predict_rnn_gluon(model, num_hiddens, vocab_size, ctx,
                            corpus_indices, idx_to_char, char_to_idx,
                            num_epochs, num_steps, lr, clipping_theta,
                            batch_size, pred_period, pred_len, prefixes)

```
## 深度循环神经网络DRNN
### DRNN原生实现
```Python
from mxnet import nd
import random
import zipfile
from mxnet import autograd, nd
from mxnet.gluon import loss as gloss
import time
import mxnet as mx
import math


def load_data_jay_lyrics():
    with zipfile.ZipFile('./data/jaychou_lyrics.txt.zip') as zin:
        with zin.open('jaychou_lyrics.txt') as f:
            corpus_chars = f.read().decode('utf-8')
    print(corpus_chars[:40])

    corpus_chars = corpus_chars.replace('\n', ' ').replace('\r', ' ')
    # 仅使用前1万个字符训练模型
    corpus_chars = corpus_chars[0:10000]

    idx_to_char = list(set(corpus_chars))
    char_to_idx = dict([(char, i) for i, char in enumerate(idx_to_char)])
    vocab_size = len(char_to_idx)
    print(vocab_size)
    print(char_to_idx)

    x = [(char, i) for i, char in enumerate(idx_to_char)]
    print(x[:20])

    # 训练集中的每个字符转化成索引
    corpus_indices = [char_to_idx[char] for char in corpus_chars]
    # 打印前20个字符机器对应的索引
    sample = corpus_indices[:20]
    print('chars:', ''.join([idx_to_char[idx] for idx in sample]))
    print('indices:', sample)
    return idx_to_char, char_to_idx, corpus_indices, vocab_size


# num_steps: 6
# corpus_indices:
# [0,1,2,...,29]
# [[0,...,5],[6,..,11],[12,...,17],[18,...,23],[24,...,29]]
# example_indices: [0,1,2,3,4]
# shuffle example_indices: [...]
def data_iter_random(corpus_indices, batch_size, num_steps, ctx=None):
    # 减1是因为输出的索引是相应输入的索引加1
    # [0,1,2,3]输出标签应为[1,2,3,4]
    # 为了防止溢出
    num_examples = (len(corpus_indices) - 1) // num_steps
    # print(num_examples)
    epoch_size = num_examples // batch_size
    example_indices = list(range(num_examples))
    random.shuffle(example_indices)

    # 返回从pos开始的长为num_steps的序列
    def _data(pos):
        return corpus_indices[pos: pos + num_steps]

    for i in range(epoch_size):
        # 每次读取batch_size个随机样本
        i = i * batch_size
        batch_indices = example_indices[i:i + batch_size]
        X = [_data(j * num_steps) for j in batch_indices]
        Y = [_data(j * num_steps + 1) for j in batch_indices]
        yield nd.array(X, ctx), nd.array(Y, ctx)


def data_iter_consecutive(corpus_indices, batch_size, num_steps, ctx=None):
    corpus_indices = nd.array(corpus_indices, ctx=ctx)
    data_len = len(corpus_indices)
    batch_len = data_len // batch_size
    indices = corpus_indices[0:batch_size * batch_len].reshape((batch_size, batch_len))
    # print(indices)
    epoch_size = (batch_len - 1) // num_steps
    for i in range(epoch_size):
        i = i * num_steps
        X = indices[:, i:i + num_steps]
        Y = indices[:, i + 1:i + num_steps + 1]
        yield X, Y


def to_onehot(X, size):
    return [nd.one_hot(x, size) for x in X.T]


def try_gpu():
    try:
        ctx = mx.gpu()
        _ = nd.zeros((1,), ctx=ctx)
    except mx.base.MXNetError:
        ctx = mx.cpu()
    return ctx


# my_seq = range(30)
# for X, Y in data_iter_consecutive(my_seq, batch_size=2, num_steps=6):
#     print('X: ', X, '\nY:', Y, '\n')


def get_params(ith_layer, num_layers):
    def _one(shape):
        return nd.random.normal(scale=0.01, shape=shape, ctx=ctx)

    # 隐藏层参数
    if ith_layer == 0:
        W_xh = _one((num_inputs, num_hiddens))
    else:
        W_xh = _one((num_hiddens, num_hiddens))
    W_hh = _one((num_hiddens, num_hiddens))
    b_h = nd.zeros(num_hiddens, ctx=ctx)
    if ith_layer == num_layers - 1:
        # 输出层参数
        W_hq = _one((num_hiddens, num_outputs))
        b_q = nd.zeros(num_outputs, ctx=ctx)
        # 附上梯度
        params = [W_xh, W_hh, b_h, W_hq, b_q]
    else:
        params = [W_xh, W_hh, b_h]

    for param in params:
        param.attach_grad()
    return params


def init_rnn_state(batch_size, num_hiddens, ctx):
    return nd.zeros(shape=(batch_size, num_hiddens), ctx=ctx),


def rnn(inputs, states, params):
    # inputs和outputs皆为num_steps个形状为(batch_size, vocab_size)的矩阵
    outputs = []
    for X in inputs:
        for i in range(len(params)):
            # W_xh, W_hh, b_h, W_hq, b_q = None, None, None, None, None
            if i != len(params) - 1:
                W_xh, W_hh, b_h = params[i]
            else:
                W_xh, W_hh, b_h, W_hq, b_q = params[i]
            H, = states[i]
            # preH = None
            if i == 0:
                H = nd.tanh(nd.dot(X, W_xh) + nd.dot(H, W_hh) + b_h)
            else:
                preH, = states[i - 1]
                H = nd.tanh(nd.dot(preH, W_xh) + nd.dot(H, W_hh) + b_h)
            states[i] = (H,)
            if i == len(params) - 1:
                Y = nd.dot(H, W_hq) + b_q
                outputs.append(Y)
    return outputs, states


def predict_rnn(prefix, num_chars, rnn, params, init_rnn_state,
                num_hiddens, vocab_size, ctx, idx_to_char, char_to_idx):
    states = []
    for i in range(len(params)):
        states.append(init_rnn_state(1, num_hiddens, ctx))
    output = [char_to_idx[prefix[0]]]
    for t in range(num_chars + len(prefix) - 1):
        # 将上一实践步的输出作为当前时间步的输入
        X = to_onehot(nd.array([output[-1]], ctx=ctx), vocab_size)
        # 计算输出和更新隐藏状态
        Y, states = rnn(X, states, params)
        # 下一个时间步的输入是prefix里的字符或者当前的最佳预测字符
        if t < len(prefix) - 1:
            output.append(char_to_idx[prefix[t + 1]])
        else:
            output.append(int(Y[0].argmax(axis=1).asscalar()))
    return ''.join([idx_to_char[i] for i in output])


def grad_clipping(params, theta, ctx):
    norm = nd.array([0], ctx)
    for param in params:
        norm += (param.grad ** 2).sum()
    norm = norm.sqrt().asscalar()
    if norm > theta:
        for param in params:
            param.grad[:] *= theta / norm


def sgd(params, lr, batch_size):
    for param in params:
        # print("param:", param)
        param[:] = param - lr * param.grad / batch_size


def train_and_predict_rnn(rnn, num_layers, get_params, init_rnn_state, num_hiddens,
                          vocab_size, ctx, corpus_indices, idx_to_char,
                          char_to_idx, is_random_iter, num_epochs, num_steps,
                          lr, clipping_theta, batch_size, pred_peroid,
                          pred_len, prefixes):
    if is_random_iter:
        data_iter_fn = data_iter_random
    else:
        data_iter_fn = data_iter_consecutive

    params = []
    for i in range(num_layers):
        params.append(get_params(i, num_layers))
    loss = gloss.SoftmaxCrossEntropyLoss()

    for epoch in range(num_epochs):
        if not is_random_iter:
            states = []
            for i in range(num_layers):
                states.append(init_rnn_state(batch_size, num_hiddens, ctx))
        l_sum, n, start = 0.0, 0, time.time()
        data_iter = data_iter_fn(corpus_indices, batch_size, num_steps, ctx)
        for X, Y in data_iter:
            if is_random_iter:
                states = []
                for i in range(num_layers):
                    states.append(init_rnn_state(batch_size, num_hiddens, ctx))
            else:  # 否则需要使用detach函数从计算图分离隐藏状态
                for i in range(len(states)):
                    for s in states[i]:
                        s.detach()

            with autograd.record():
                inputs = to_onehot(X, vocab_size)
                # outputs有num_steps个形状为(batch_size, vocab_size)的矩阵
                outputs, states = rnn(inputs, states, params)
                # 拼接之后形状为(num_steps*batch_size, vocab_size)
                outputs = nd.concat(*outputs, dim=0)
                # Y的形状是(batch_size, num_steps)，转置后再变成长度为
                # batch * num_steps的向量，这样跟输出的行一一对应
                y = Y.T.reshape((-1,))
                # 使用交叉熵损失计算平均分类误差
                l = loss(outputs, y).mean()
            l.backward()
            for i in range(num_layers):
                grad_clipping(params[i], clipping_theta, ctx)  # 裁剪梯度
                sgd(params[i], lr, 1)  # 因为误差已经去过均值，梯度不用再做平均
            l_sum += l.asscalar() * y.size
            n += y.size

        if (epoch + 1) % pred_peroid == 0:
            print('epoch %d, perplexity %f, time %.2f sec' % (
                epoch + 1, math.exp(l_sum / n), time.time() - start))
            for prefix in prefixes:
                print(' -', predict_rnn(
                    prefix, pred_len, rnn, params, init_rnn_state,
                    num_hiddens, vocab_size, ctx, idx_to_char, char_to_idx))


idx_to_char, char_to_idx, corpus_indices, vocab_size = load_data_jay_lyrics()
num_inputs, num_hiddens, num_outputs = vocab_size, 256, vocab_size
ctx = try_gpu()
print('will use', ctx)

# X = nd.arange(10).reshape((2, 5))
# state = init_rnn_state(X.shape[0], num_hiddens, ctx)
# inputs = to_onehot(X.as_in_context(ctx), vocab_size)
# print(inputs)
#
# params = get_params()
# outputs, state_new = rnn(inputs, state, params)
# print(len(outputs), outputs[0].shape, state_new[0].shape)
#
#
# predict_txt = predict_rnn('分开', 10, rnn, params, init_rnn_state, num_hiddens, vocab_size,
#             ctx, idx_to_char, char_to_idx)
#
# print(predict_txt)

num_epochs, num_steps, batch_size, lr, clipping_theta = 250, 35, 32, 1e2, 1e-2
pred_peroid, pred_len, prefixes = 50, 50, ['分开', '不分开']
num_layers = 3
train_and_predict_rnn(rnn, num_layers, get_params, init_rnn_state, num_hiddens,
                      vocab_size, ctx, corpus_indices, idx_to_char,
                      char_to_idx, False, num_epochs, num_steps, lr,
                      clipping_theta, batch_size, pred_peroid, pred_len, prefixes)
# params = []
# for i in range(num_layers):
#     params.append(get_params(i, num_layers))
# predict_rnn(prefixes[0], pred_len, rnn, params, init_rnn_state,
# num_hiddens, vocab_size, ctx, idx_to_char, char_to_idx)

```
### DRNN简洁实现
```Python
import math
from mxnet.gluon import loss as gloss, nn, rnn
from mxnet import autograd, init, nd, gluon
import time
import zipfile
import mxnet as mx


def load_data_jay_lyrics():
    with zipfile.ZipFile('./data/jaychou_lyrics.txt.zip') as zin:
        with zin.open('jaychou_lyrics.txt') as f:
            corpus_chars = f.read().decode('utf-8')
    print(corpus_chars[:40])

    corpus_chars = corpus_chars.replace('\n', ' ').replace('\r', ' ')
    # 仅使用前1万个字符训练模型
    corpus_chars = corpus_chars[0:10000]

    idx_to_char = list(set(corpus_chars))
    char_to_idx = dict([(char, i) for i, char in enumerate(idx_to_char)])
    vocab_size = len(char_to_idx)
    print(vocab_size)
    print(char_to_idx)

    x = [(char, i) for i, char in enumerate(idx_to_char)]
    print(x[:20])

    # 训练集中的每个字符转化成索引
    corpus_indices = [char_to_idx[char] for char in corpus_chars]
    # 打印前20个字符机器对应的索引
    sample = corpus_indices[:20]
    print('chars:', ''.join([idx_to_char[idx] for idx in sample]))
    print('indices:', sample)
    return idx_to_char, char_to_idx, corpus_indices, vocab_size


class RNNModel(nn.Block):
    def __init__(self, rnn_layer, vocab_size, **kwargs):
        super(RNNModel, self).__init__(**kwargs)
        self.rnn = rnn_layer
        self.vocab_size = vocab_size
        self.dense = nn.Dense(vocab_size)

    def forward(self, inputs, state):
        # 将输入转置成(num_steps, batch_size)后获取one-hot向量表示
        # print(inputs.shape)
        X = nd.one_hot(inputs.T, self.vocab_size)
        # print(X.shape)
        Y, state = self.rnn(X, state)
        # 全连接层会首先将Y的形状编程(num_steps*batch_size, num_hiddens)，
        # 它的输出为(num_steps*batch_size, vocab_size)
        output = self.dense(Y.reshape((-1, Y.shape[-1])))
        return output, state

    def begin_state(self, *args, **kwargs):
        return self.rnn.begin_state(*args, **kwargs)


def predict_rnn_gluon(prefix, num_chars, model, vocab_size, ctx, idx_to_char, char_to_idx):
    # 使用model的成员函数来初始化隐藏状态
    state = model.begin_state(batch_size=1, ctx=ctx)
    output = [char_to_idx[prefix[0]]]
    for t in range(num_chars + len(prefix) - 1):
        # 将上一实践步的输出作为当前时间步的输入
        X = nd.array([output[-1]], ctx=ctx).reshape((1, 1))
        # print(X.shape)
        # 计算输出和更新隐藏状态
        Y, state = model(X, state)
        # print(Y.shape)
        # 下一个时间步的输入是prefix里的字符或者当前的最佳预测字符
        if t < len(prefix) - 1:
            output.append(char_to_idx[prefix[t + 1]])
        else:
            output.append(int(Y.argmax(axis=1).asscalar()))
    return ''.join([idx_to_char[i] for i in output])


def try_gpu():
    try:
        ctx = mx.gpu()
        _ = nd.zeros((1,), ctx=ctx)
    except mx.base.MXNetError:
        ctx = mx.cpu()
    return ctx


# num_steps: 6
# corpus_indices:
# [0,1,2,...,29]
# [[0,...,5],[6,..,11],[12,...,17],[18,...,23],[24,...,29]]
# example_indices: [0,1,2,3,4]
# shuffle example_indices: [...]
def data_iter_random(corpus_indices, batch_size, num_steps, ctx=None):
    # 减1是因为输出的索引是相应输入的索引加1
    # [0,1,2,3]输出标签应为[1,2,3,4]
    # 为了防止溢出
    num_examples = (len(corpus_indices) - 1) // num_steps
    # print(num_examples)
    epoch_size = num_examples // batch_size
    example_indices = list(range(num_examples))
    random.shuffle(example_indices)

    # 返回从pos开始的长为num_steps的序列
    def _data(pos):
        return corpus_indices[pos: pos + num_steps]

    for i in range(epoch_size):
        # 每次读取batch_size个随机样本
        i = i * batch_size
        batch_indices = example_indices[i:i + batch_size]
        X = [_data(j * num_steps) for j in batch_indices]
        Y = [_data(j * num_steps + 1) for j in batch_indices]
        yield nd.array(X, ctx), nd.array(Y, ctx)


def data_iter_consecutive(corpus_indices, batch_size, num_steps, ctx=None):
    corpus_indices = nd.array(corpus_indices, ctx=ctx)
    data_len = len(corpus_indices)
    batch_len = data_len // batch_size
    indices = corpus_indices[0:batch_size * batch_len].reshape((batch_size, batch_len))
    # print(indices)
    epoch_size = (batch_len - 1) // num_steps
    for i in range(epoch_size):
        i = i * num_steps
        X = indices[:, i:i + num_steps]
        Y = indices[:, i + 1:i + num_steps + 1]
        yield X, Y


def grad_clipping(params, theta, ctx):
    norm = nd.array([0], ctx)
    for param in params:
        norm += (param.grad ** 2).sum()
    norm = norm.sqrt().asscalar()
    if norm > theta:
        for param in params:
            param.grad[:] *= theta / norm


def train_and_predict_rnn_gluon(model, num_hiddens, vocab_size, ctx,
                                corpus_indices, idx_to_char, char_to_idx,
                                num_epochs, num_steps, lr, clipping_theta,
                                batch_size, pred_peroid, pred_len, prefixes):
    loss = gloss.SoftmaxCrossEntropyLoss()
    model.initialize(ctx=ctx, force_reinit=True, init=init.Normal(0.01))
    trainer = gluon.Trainer(model.collect_params(), 'sgd',
                            {'learning_rate': lr, 'momentum': 0, 'wd': 0})
    for epoch in range(num_epochs):
        l_sum, n, start = 0.0, 0, time.time()
        data_iter = data_iter_consecutive(corpus_indices, batch_size, num_steps, ctx)
        state = model.begin_state(batch_size=batch_size, ctx=ctx)
        for X, Y in data_iter:
            for s in state:
                s.detach()
            with autograd.record():
                output, state = model(X, state)
                y = Y.T.reshape((-1,))
                l = loss(output, y).mean()
            l.backward()
            # 梯度裁剪
            params = [p.data() for p in model.collect_params().values()]
            grad_clipping(params, clipping_theta, ctx)
            trainer.step(1)  # 因为已经误差取过均值，梯度不用再做平均
            l_sum += l.asscalar() * y.size
            n += y.size
        if (epoch + 1) % pred_peroid == 0:
            print('epoch %d, perplexity %f, time %.2f sec' % (
                epoch + 1, math.exp(l_sum / n), time.time() - start))
            for prefix in prefixes:
                print('-', predict_rnn_gluon(prefix, pred_len,
                                             model, vocab_size, ctx, idx_to_char, char_to_idx))


ctx = try_gpu()
idx_to_char, char_to_idx, corpus_indices, vocab_size = load_data_jay_lyrics()
num_hiddens = 256
num_steps = 35
# rnn_layer = rnn.RNN(num_hiddens)
# rnn_layer.initialize()
rnn_layers = rnn.SequentialRNNCell()
rnn_layers.add(rnn.RNN(num_hiddens))
rnn_layers.add(rnn.RNN(num_hiddens))
model = RNNModel(rnn_layers, vocab_size)
model.initialize(force_reinit=True, ctx=ctx)

num_epochs, batch_size, lr, clipping_theta = 250, 32, 1e2, 1e-2
pred_period, pred_len, prefixes = 50, 50, ['分开', '不分开']
train_and_predict_rnn_gluon(model, num_hiddens, vocab_size, ctx,
                            corpus_indices, idx_to_char, char_to_idx,
                            num_epochs, num_steps, lr, clipping_theta,
                            batch_size, pred_period, pred_len, prefixes)

# x = nd.arange(20).reshape((2, 2, 5))
# print(x.shape)
# print(x)
# print(x.reshape((-1, 5)))

```
