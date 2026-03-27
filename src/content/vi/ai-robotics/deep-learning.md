# Deep Learning

## Tổng quan

Deep Learning xây dựng trên lý thuyết mạng neural cổ điển nhưng đạt được kết quả phi thường nhờ scale: các kiến trúc sâu (nhiều layers), datasets lớn, và compute khổng lồ. Trong khi các mô hình ML truyền thống cần feature engineering cẩn thận, mạng sâu học các biểu diễn phân cấp tự động.

Các yếu tố cho phép chính:

1. **Activation functions** tránh vanishing gradients (ReLU và các biến thể)
2. **Backpropagation** với tối ưu gradient ở quy mô lớn
3. **Kỹ thuật regularization** (dropout, batch norm, weight decay)
4. **Phần cứng tăng tốc** (GPUs, TPUs)
5. **Pretrained models và transfer learning**

---

## Neural Network Fundamentals

## The Perceptron

Một neuron nhân tạo đơn lẻ tính tổng có trọng số của các đầu vào cộng bias, sau đó đưa qua activation function.

```
output = activation(dot(W, x) + b)
```

Một perceptron đơn lẻ chỉ giải được các bài toán linearly separable. Stack nhiều layers (multi-layer perceptron / MLP) cho phép học các ranh giới quyết định phi tuyến.

## Activation Functions

Activation functions đưa vào tính phi tuyến, cho phép networks xấp xỉ các hàm phức tạp.

| Hàm | Công thức | Miền giá trị | Khi nào dùng |
|---|---|---|---|
| **ReLU** | `max(0, x)` | `[0, +inf)` | Lựa chọn mặc định cho hidden layers |
| **Leaky ReLU** | `0.01x if x<0 else x` | `(-inf, +inf)` | Khi dying ReLU là vấn đề |
| **ELU** | `x if x>0 else alpha*(exp(x)-1)` | `(-alpha, +inf)` | Giá trị âm mượt, tốn chi phí tính toán hơn một chút |
| **Sigmoid** | `1 / (1 + exp(-x))` | `(0, 1)` | Output layer cho binary classification |
| **Tanh** | `(exp(x) - exp(-x)) / (exp(x) + exp(-x))` | `(-1, 1)` | Hidden layers khi cần zero-centered |
| **Softmax** | `exp(x_i) / sum(exp(x_j))` | `(0, 1)` sum=1 | Output layer cho multi-class classification |

ReLU được ưu tiên trong hầu hết hidden layers vì tính toán rẻ, không saturate với giá trị dương (khác sigmoid/tanh). Tuy nhiên, nó có thể "chết" khi gradient lớn cập nhật weights sao cho tất cả inputs đều âm; Leaky ReLU và ELU giải quyết vấn đề này.

## Xây dựng Neural Network trong PyTorch

```python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset

class MLP(nn.Module):
    def __init__(self, input_size, hidden_sizes, output_size, dropout=0.3):
        super().__init__()
        layers = []
        prev_size = input_size

        for hidden_size in hidden_sizes:
            layers.append(nn.Linear(prev_size, hidden_size))
            layers.append(nn.BatchNorm1d(hidden_size))
            layers.append(nn.ReLU())
            layers.append(nn.Dropout(dropout))
            prev_size = hidden_size

        layers.append(nn.Linear(prev_size, output_size))
        self.network = nn.Sequential(*layers)

    def forward(self, x):
        return self.network(x)

# Ví dụ: 784 -> 512 -> 256 -> 128 -> 10 (ví dụ: phân loại MNIST)
model = MLP(input_size=784, hidden_sizes=[512, 256, 128], output_size=10)

# Loss và optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(model.parameters(), lr=0.001, weight_decay=0.01)

# Training loop
for epoch in range(10):
    model.train()
    total_loss = 0
    for batch_x, batch_y in train_loader:
        optimizer.zero_grad()
        outputs = model(batch_x)
        loss = criterion(outputs, batch_y)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    print(f"Epoch {epoch+1}: Loss={total_loss / len(train_loader):.4f}")
```

---

## Backpropagation và Gradient Descent

## Backpropagation Hoạt động Như Thế Nào

Backpropagation tính gradient của loss đối với mọi weight bằng cách áp dụng chain rule của giải tích, truyền ngược tín hiệu lỗi từ output về input. Nó gồm hai lượt:

1. **Forward pass:** tính activations layer theo layer, lưu các giá trị trung gian
2. **Backward pass:** tính gradients sử dụng chain rule, bắt đầu từ loss

Gradient hiệu quả `∂L/∂w` cho weight `w` là tích của tất cả các partial derivatives dọc theo đường dẫn tính toán.

## Các Biến thể Gradient Descent

| Thuật toán | Công thức Update | Đặc điểm |
|---|---|---|
| **SGD** | `w = w - lr * grad` | Đơn giản, nhiễu, có thể thoát local minima |
| **SGD + Momentum** | `v = momentum*v - lr*grad; w += v` | Tăng tốc hội tụ, giảm dao động |
| **AdaGrad** | Adapts lr cho từng tham số dựa trên gradient history | Tốt cho sparse features |
| **RMSProp** | Dùng exponential moving average của squared gradients | Tốt cho non-stationary problems |
| **Adam** | Kết hợp momentum + RMSProp adaptive lr | Optimizer mặc định cho hầu hết DL tasks |
| **AdamW** | Adam với weight decay đúng cách | Được ưu tiên cho transformer training |

Adam (Adaptive Moment Estimation) duy trì learning rate riêng cho từng tham số từ first và second moments của gradients:

```
m_t = beta1 * m_{t-1} + (1 - beta1) * g_t     # first moment (momentum)
v_t = beta2 * v_{t-1} + (1 - beta2) * g_t^2   # second moment
m_hat = m_t / (1 - beta1^t)                     # bias correction
v_hat = v_t / (1 - beta2^t)
w = w - lr * m_hat / (sqrt(v_hat) + epsilon)
```

## Learning Rate Schedules

- **Step decay:** giảm lr theo hệ số mỗi N epochs
- **Cosine annealing:** giảm mượt theo chu kỳ
- **OneCycleLR:** warm up rồi anneal (thường tốt nhất cho transformers)
- **ReduceLROnPlateau:** giảm khi metric ngừng cải thiện

---

## Convolutional Neural Networks (CNN)

CNNs khai thác cấu trúc không gian trong ảnh thông qua local connectivity và parameter sharing (convolution kernels).

## Phép Convolution

Một convolution trượt kernel (filter) trên input, tính dot products tại mỗi vị trí:

- Input: `(H, W, C_in)`
- Kernel: `(K_h, K_w, C_in, C_out)`
- Output: `(H', W', C_out)`

Kích thước output: `H' = floor((H - K_h + 2*pad) / stride) + 1`

## Pooling

- **MaxPooling:** trích xuất feature được kích hoạt mạnh nhất trong mỗi cửa sổ
- **AveragePooling:** tính trung bình các giá trị trong mỗi cửa sổ
- Cả hai giảm kích thước không gian và cung cấp translation invariance

## Các Kiến trúc Cổ điển

| Kiến trúc | Năm | Đổi mới chính | Top-1 ImageNet |
|---|---|---|---|
| **LeNet-5** | 1998 | Conv + pooling cho nhận diện chữ số | — |
| **AlexNet** | 2012 | ReLU, dropout, GPU training, data augmentation | 62.5% |
| **VGG-16** | 2014 | Stack sâu các conv 3x3 (16 weight layers) | 71.5% |
| **GoogLeNet** | 2014 | Inception modules, global average pooling | 69.8% |
| **ResNet-50** | 2015 | Skip connections (residual learning) | 76.1% |

### ResNet: Skip Connections

ResNet giới thiệu skip (shortcut) connections cộng trực tiếp input của một block với output của nó:

`output = F(x) + x`

Điều này giúp gradient truyền qua network dễ dàng hơn, cho phép huấn luyện các kiến trúc rất sâu (100+ layers) mà không bị degradation.

### CNN Implementation trong PyTorch

```python
import torch
import torch.nn as nn

class CNN(nn.Module):
    """CNN cho phân loại ảnh với các residual blocks."""

    def __init__(self, num_classes=1000):
        super().__init__()

        self.conv1 = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2, padding=1),
        )

        # Residual blocks
        self.layer1 = self._make_layer(64, 64, blocks=3, stride=1)
        self.layer2 = self._make_layer(64, 128, blocks=4, stride=2)
        self.layer3 = self._make_layer(128, 256, blocks=6, stride=2)
        self.layer4 = self._make_layer(256, 512, blocks=3, stride=2)

        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))
        self.fc = nn.Linear(512, num_classes)

    def _make_layer(self, in_ch, out_ch, blocks, stride):
        layers = [ResidualBlock(in_ch, out_ch, stride)]
        for _ in range(1, blocks):
            layers.append(ResidualBlock(out_ch, out_ch, 1))
        return nn.Sequential(*layers)

    def forward(self, x):
        x = self.conv1(x)
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        return self.fc(x)


class ResidualBlock(nn.Module):
    def __init__(self, in_ch, out_ch, stride=1):
        super().__init__()
        self.conv1 = nn.Conv2d(in_ch, out_ch, 3, stride, 1, bias=False)
        self.bn1 = nn.BatchNorm2d(out_ch)
        self.conv2 = nn.Conv2d(out_ch, out_ch, 3, 1, 1, bias=False)
        self.bn2 = nn.BatchNorm2d(out_ch)
        self.relu = nn.ReLU(inplace=True)

        self.shortcut = nn.Sequential()
        if stride != 1 or in_ch != out_ch:
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_ch, out_ch, 1, stride, bias=False),
                nn.BatchNorm2d(out_ch),
            )

    def forward(self, x):
        out = self.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += self.shortcut(x)
        return self.relu(out)
```

---

## Recurrent Neural Networks (RNN/LSTM/GRU)

RNNs xử lý sequential data bằng cách duy trì hidden state tích lũy thông tin theo thời gian.

## Vấn đề: Long-Term Dependencies

Vanilla RNNs gặp khó khăn khi học các dependencies xa vì gradients hoặc vanish (hầu hết activations) hoặc explode (khi eigenvalues > 1) trong quá trình backpropagation through time (BPTT).

## LSTM (Long Short-Term Memory)

LSTM giới thiệu các memory cells với cơ chế gating:

- **Forget gate:** quyết định discard gì từ cell state
- **Input gate:** quyết định thông tin mới nào cần lưu
- **Output gate:** quyết định output gì từ cell state

Cell state update: `C_t = f_t * C_{t-1} + i_t * C'_t`

## GRU (Gated Recurrent Unit)

GRU đơn giản hóa LSTM với 2 gates (update, reset), ít parameters hơn, và thường cho hiệu suất tương đương.

## Sequence Classification với LSTM

```python
import torch
import torch.nn as nn

class LSTMClassifier(nn.Module):
    def __init__(self, vocab_size, embed_dim=128, hidden_dim=256,
                 num_layers=2, dropout=0.3, bidirectional=True):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.lstm = nn.LSTM(
            input_size=embed_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0,
            bidirectional=bidirectional,
        )
        # Bidirectional nhân đôi hidden_dim
        self.fc = nn.Linear(hidden_dim * 2 if bidirectional else hidden_dim, 1)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        # x: (batch, seq_len)
        embedded = self.embedding(x)           # (batch, seq_len, embed_dim)
        lstm_out, (h_n, c_n) = self.lstm(embedded)
        # lstm_out: (batch, seq_len, hidden*2) - tất cả timesteps
        # h_n: (num_layers*2, batch, hidden) - last hidden state

        # Dùng last hidden state từ cả hai hướng
        last_hidden = h_n[-2:]                  # (2, batch, hidden) cho bidirectional
        last_hidden = torch.cat([last_hidden[0], last_hidden[1]], dim=1)
        last_hidden = self.dropout(last_hidden)

        return self.fc(last_hidden)            # (batch, 1)
```

---

## Transformers

Kiến trúc Transformer, được giới thiệu trong "Attention Is All You Need" (2017), thay thế recurrence bằng self-attention, cho phép training song song và nắm bắt long-range dependencies hiệu quả hơn.

## Self-Attention

Self-attention cho phép mọi vị trí trong sequence attend đến tất cả các vị trí khác:

```
Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V
```

- **Q (Query):** tôi đang tìm gì?
- **K (Key):** tôi chứa thông tin gì?
- **V (Value):** thông tin thực sự cần tổng hợp

`1/sqrt(d_k)` scaling ngăn softmax saturation khi `d_k` lớn.

## Multi-Head Attention

Chạy attention song song với nhiều heads cho phép model attend đến các subspace biểu diễn khác nhau:

```
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) * W_O
where head_i = Attention(QW_i^Q, KW_i^K, VW_i^V)
```

## Positional Encoding

Vì self-attention là permutation-invariant, thông tin vị trí phải được inject:

```
PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
```

Các alternatives hiện đại: Rotary Position Embedding (RoPE), ALiBi

## Kiến trúc Transformer

Transformer tiêu chuẩn gồm encoder và decoder, mỗi cái composed của các layers xếp chồng:

- **Encoder layer:** multi-head self-attention + feed-forward network + residual connections + layer norm
- **Decoder layer:** masked multi-head self-attention + cross-attention đến encoder + feed-forward network

## BERT vs GPT

| | **BERT** | **GPT** |
|---|---|---|
| Kiến trúc | Encoder-only | Decoder-only |
| Training objective | Masked Language Modeling (MLM) | Next Token Prediction |
| Attention | Bidirectional (thấy context cả hai hướng) | Causal (chỉ left context) |
| Sử dụng điển hình | Understanding (classification, NER, QA) | Generation (text gen, chat) |
| Kích thước đại diện | Base: 110M params | GPT-3: 175B params |

## Fine-tuning Transformer cho Classification

```python
import torch
import torch.nn as nn
from transformers import (
    AutoTokenizer,
    AutoModel,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
)

model_name = "bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(
    model_name, num_labels=2
)

# Tokenize
def tokenize(batch):
    return tokenizer(
        batch["text"],
        padding=True,
        truncation=True,
        max_length=512,
        return_tensors="pt",
    )

# Training arguments
training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=32,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir="./logs",
    logging_steps=50,
    eval_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="f1",
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    compute_metrics=lambda p: {
        "accuracy": (p.predictions[0] > 0).mean(),
    },
)
trainer.train()
```

---

## Training Techniques và Regularization

## Dropout

Trong training, ngẫu nhiên zero out activations với xác suất `p`. Tại inference, tất cả weights được scale bởi `p`. Điều này ngăn co-adaptation của neurons và hoạt động như ensemble của các sub-networks.

```python
model = nn.Sequential(
    nn.Linear(512, 256),
    nn.ReLU(),
    nn.Dropout(0.3),
    nn.Linear(256, 10),
)
```

## Batch Normalization

Normalizes activations thành `mean=0, variance=1` cho mỗi batch, sau đó áp dụng các learnable scale (`γ`) và shift (`β`) parameters:

```
y = γ * (x - μ_B / sqrt(σ_B² + ε)) + β
```

Lợi ích:

- Cho phép learning rates cao hơn
- Giảm internal covariate shift
- Có tá dụng regularization nhẹ
- Làm networks ít nhạy cảm hơn với initialization

Moving averages của batch statistics được duy trì trong training và dùng tại inference.

## Weight Decay

Thêm `λ * ||W||²` vào loss, phạt các weights lớn. Trong AdamW, weight decay được tách rời khỏi adaptive learning rate, dẫn đến regularization tốt hơn.

## Early Stopping

Theo dõi validation loss và restore model weights từ best epoch khi validation loss ngừng cải thiện. Ngăn overfitting mà không cần chọn số epochs thủ công.

## Label Smoothing

Thay hard labels `y=1` bằng `y=1-ε` và `y=0` bằng `ε/k`. Ngăn model quá tự tin và cải thiện calibration.

---

## Loss Functions

| Bài toán | Loss Function | Ghi chú |
|---|---|---|
| Binary classification | `BCEWithLogitsLoss` | Kết hợp sigmoid + BCE một cách numerically stable |
| Multi-class | `CrossEntropyLoss` | Kết hợp log_softmax + NLLLoss |
| Regression | `MSELoss` / `L1Loss` / `SmoothL1Loss` | SmoothL1 ít nhạy cảm với outliers |
| Object detection | `FocalLoss` | Down-weights easy negatives |
| Generative models | `GANLoss`, `WassersteinLoss` | Task-specific |
| Segmentation | `CrossEntropyLoss`, `DiceLoss` | Dice xử lý class imbalance |

---

## Transfer Learning và Fine-tuning

Transfer learning tận dụng kiến thức từ pretrained models:

1. **Feature extraction:** freeze backbone, train chỉ classifier head mới
2. **Fine-tuning:** unfreeze một số/tất cả layers và train với learning rate nhỏ
3. **Full fine-tuning:** train toàn bộ network (thường với LR thấp hơn)

Best practice: unfreeze từ từ (last layers trước) với learning rates thấp hơn cho các layers trước đó.

---

## Câu hỏi Phỏng vấn

### 1) Nguyên nhân nào gây ra vanishing/exploding gradients?

Trong quá trình backpropagation, gradients được nhân với derivative của mỗi activation tại mỗi layer. Với sigmoid/tanh, derivatives < 1, nên nhân lặp lại khiến gradients co lại exponential (vanishing). Với poorly scaled weights, chúng có thể phát triển exponential (exploding). Giải pháp: ReLU activation, residual connections, LSTM/GRU gates, proper weight initialization (He/Xavier), gradient clipping.

### 2) Batch normalization ảnh hưởng đến inference như thế nào?

Trong training, nó normalize dùng batch statistics (μ_B, σ_B). Tại inference, nó dùng exponentially moving averages của các statistics này đã tích lũy trong quá trình training. Các learnable γ, β parameters luôn được sử dụng.

### 3) Tại sao transformers thường vượt trội hơn RNNs?

Transformers xử lý tất cả tokens song song (không có sequential dependency), dùng self-attention để trực tiếp mô hình hóa bất kỳ pairwise relationship nào bất kể khoảng cách, và scale tốt hơn với data và compute. RNNs phải nén thông tin vào một fixed-size hidden state.

### 4) Khác biệt giữa pre-training và fine-tuning objectives là gì?

Pre-training là unsupervised trên large corpora (MLM cho BERT, NTP cho GPT). Fine-tuning là supervised trên downstream task với labeled data, dùng task-specific head.

### 5) Làm sao chọn giữa CNN và Transformer cho một vision task?

CNNs hiệu quả, inductive bias (locality + translation equivariance) giảm nhu cầu dữ liệu, tốt cho real-time/small data. Vision Transformers (ViT) cần datasets lớn để vượt trội nhưng thường đạt accuracy cao hơn trên large-scale benchmarks; chúng tốn compute hơn.

### 6) Vai trò của CLS token trong BERT là gì?

Token `[CLS]` được thêm vào đầu mỗi input sequence. Hidden state cuối cùng của nó được dùng như aggregate sequence representation cho các classification tasks. Vì BERT là bidirectional, representation của `[CLS]` nắm bắt context từ cả hai hướng.