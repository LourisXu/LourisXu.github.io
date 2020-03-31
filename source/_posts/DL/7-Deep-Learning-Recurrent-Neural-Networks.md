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
