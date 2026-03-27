# Deep Learning

## Tổng quan

Deep Learning dùng neural networks với nhiều layers để học hierarchical representations từ dữ liệu.

## Neural Network Fundamentals

### Perceptron

```python
import torch
import torch.nn as nn

class SimpleNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.layer1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.layer2 = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        x = self.relu(self.layer1(x))
        return self.layer2(x)

model = SimpleNN(784, 256, 10)
```

### Activation Functions

| Function | Formula | Đặc điểm |
|----------|---------|-----------|
| **ReLU** | max(0, x) | Phổ biến nhất, tránh vanishing gradient |
| **Sigmoid** | 1/(1+e^-x) | Binary classification output |
| **Tanh** | (e^x - e^-x)/(e^x + e^-x) | Zero-centered, faster convergence |
| **Softmax** | e^x_i / Σe^x | Multi-class classification |
| **Leaky ReLU** | 0.01x if x<0 else x | Tránh dying ReLU |

## Convolutional Neural Networks (CNN)

```python
class CNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d(1)
        )

        self.classifier = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(128, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)
        return self.classifier(x)
```

## Recurrent Neural Networks (RNN/LSTM)

```python
class LSTMClassifier(nn.Module):
    def __init__(self, vocab_size, embed_size, hidden_size, num_layers=2):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_size)
        self.lstm = nn.LSTM(embed_size, hidden_size,
                           num_layers, batch_first=True,
                           dropout=0.3)
        self.fc = nn.Linear(hidden_size, 1)

    def forward(self, x):
        # x: (batch, seq_len)
        embedded = self.embedding(x)  # (batch, seq_len, embed)
        lstm_out, (h_n, _) = self.lstm(embedded)
        # h_n: (num_layers, batch, hidden)
        last_hidden = h_n[-1]  # Last layer hidden state
        return self.fc(last_hidden)
```

## Transformers

```python
class TransformerClassifier(nn.Module):
    def __init__(self, vocab_size, d_model=256, nhead=8,
                 num_layers=4, dropout=0.1):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.pos_encoding = PositionalEncoding(d_model, dropout)
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model, nhead=nhead, dropout=dropout
        )
        self.transformer = nn.TransformerEncoder(
            encoder_layer, num_layers=num_layers
        )
        self.classifier = nn.Linear(d_model, 1)

    def forward(self, x):
        # x: (batch, seq_len)
        embedded = self.embedding(x) * math.sqrt(self.d_model)
        embedded = self.pos_encoding(embedded)
        encoded = self.transformer(embedded)
        # CLS token representation (first position)
        return self.classifier(encoded[:, 0])
```

## Training Techniques

### Optimizers

```python
# Adam - adaptive learning rate
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# AdamW - Adam với weight decay đúng cách
optimizer = torch.optim.AdamW(model.parameters(),
                              lr=0.001, weight_decay=0.01)

# Learning rate scheduler
scheduler = torch.optim.lr_scheduler.OneCycleLR(
    optimizer, max_lr=0.01,
    steps_per_epoch=len(train_loader),
    epochs=10
)
```

### Regularization

```python
# 1. Dropout
model = nn.Sequential(
    nn.Linear(256, 128),
    nn.Dropout(0.3),  # 30% neurons bị tắt ngẫu nhiên
    nn.ReLU(),
    nn.Linear(128, 10)
)

# 2. Batch Normalization
model = nn.Sequential(
    nn.Conv2d(3, 64, 3),
    nn.BatchNorm2d(64),  # Normalize activations
    nn.ReLU()
)

# 3. Early Stopping
early_stop = EarlyStopping(patience=5, restore_best_weights=True)
```

## Loss Functions

| Task | Loss Function |
|------|---------------|
| Binary Classification | `BCEWithLogitsLoss` |
| Multi-class | `CrossEntropyLoss` |
| Regression | `MSELoss` / `L1Loss` |
| Object Detection | `FocalLoss` |

## Câu hỏi phỏng vấn

### 1. Vanishing Gradient là gì?

Khi networks sâu, gradient từ output truyền ngược về input bị nhân tích lũy nhiều giá trị < 1 (hoặc > 1), trở nên cực nhỏ (hoặc cực lớn). LSTM/GRU và skip connections (ResNet) giải quyết vấn đề này.

### 2. Batch Normalization hoạt động thế nào?

Normalize mỗi batch về mean=0, variance=1, sau đó scale và shift bằng learnable parameters. Cho phép higher learning rate, faster convergence, và regularizing effect.

### 3. Attention mechanism giải quyết vấn đề gì?

RNN/LSTM khó handle long-range dependencies. Attention cho phép model tập trung vào relevant parts của input khi generate output — không phụ thuộc khoảng cách.

### 4. Sự khác nhau giữa CNN và Transformer cho Vision?

CNN dùng local receptive fields và parameter sharing qua convolution filters. Transformer dùng self-attention trên toàn bộ image, thường tốt hơn với large datasets nhưng đắt hơn về computation.
