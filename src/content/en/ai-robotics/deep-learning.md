# Deep Learning

## Overview

Deep Learning builds on classical neural network theory but achieves extraordinary results through scale: deep architectures (many layers), large datasets, and massive compute. While traditional ML models require careful feature engineering, deep networks learn hierarchical representations automatically.

Key enabling factors:

1. **Activation functions** that avoid vanishing gradients (ReLU and variants)
2. **Backpropagation** with gradient-based optimization at scale
3. **Regularization techniques** (dropout, batch norm, weight decay)
4. **Hardware acceleration** (GPUs, TPUs)
5. **Pretrained models and transfer learning**

---

## Neural Network Fundamentals

## The Perceptron

A single artificial neuron computes a weighted sum of inputs plus bias, then passes it through an activation function.

```
output = activation(dot(W, x) + b)
```

A single perceptron can only solve linearly separable problems. Stacking multiple layers (a multi-layer perceptron / MLP) enables learning non-linear decision boundaries.

## Activation Functions

Activation functions introduce non-linearity, enabling networks to approximate complex functions.

| Function | Formula | Range | When to Use |
|---|---|---|---|
| **ReLU** | `max(0, x)` | `[0, +inf)` | Default choice for hidden layers |
| **Leaky ReLU** | `0.01x if x<0 else x` | `(-inf, +inf)` | When dying ReLU is a problem |
| **ELU** | `x if x>0 else alpha*(exp(x)-1)` | `(-alpha, +inf)` | Smooth negative values, slightly more expensive |
| **Sigmoid** | `1 / (1 + exp(-x))` | `(0, 1)` | Binary classification output layer |
| **Tanh** | `(exp(x) - exp(-x)) / (exp(x) + exp(-x))` | `(-1, 1)` | Hidden layers when zero-centered needed |
| **Softmax** | `exp(x_i) / sum(exp(x_j))` | `(0, 1)` sum=1 | Multi-class classification output layer |

ReLU is preferred in most hidden layers because it is computationally cheap and does not saturate for positive values (unlike sigmoid/tanh). However, it can "die" when a large gradient updates weights such that all inputs are negative; Leaky ReLU and ELU address this.

## Building a Neural Network in PyTorch

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

# Example: 784 -> 512 -> 256 -> 128 -> 10 (e.g., MNIST classification)
model = MLP(input_size=784, hidden_sizes=[512, 256, 128], output_size=10)

# Loss and optimizer
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

## Backpropagation and Gradient Descent

## How Backpropagation Works

Backpropagation computes the gradient of the loss with respect to every weight by applying the chain rule of calculus, propagating error signals backward from output to input. It consists of two passes:

1. **Forward pass:** compute activations layer by layer, store intermediate values
2. **Backward pass:** compute gradients using the chain rule, starting from the loss

The effective gradient `∂L/∂w` for a weight `w` is the product of all partial derivatives along the computation path.

## Gradient Descent Variants

| Algorithm | Update Rule | Characteristics |
|---|---|---|
| **SGD** | `w = w - lr * grad` | Simple, noisy, can escape local minima |
| **SGD + Momentum** | `v = momentum*v - lr*grad; w += v` | Accelerates convergence, dampens oscillation |
| **AdaGrad** | Adapts lr per parameter based on gradient history | Good for sparse features |
| **RMSProp** | Uses exponential moving average of squared gradients | Good for non-stationary problems |
| **Adam** | Combines momentum + RMSProp adaptive lr | Default optimizer for most DL tasks |
| **AdamW** | Adam with proper weight decay implementation | Preferred for transformer training |

Adam (Adaptive Moment Estimation) maintains per-parameter learning rates estimated from first and second moments of gradients:

```
m_t = beta1 * m_{t-1} + (1 - beta1) * g_t     # first moment (momentum)
v_t = beta2 * v_{t-1} + (1 - beta2) * g_t^2   # second moment
m_hat = m_t / (1 - beta1^t)                     # bias correction
v_hat = v_t / (1 - beta2^t)
w = w - lr * m_hat / (sqrt(v_hat) + epsilon)
```

## Learning Rate Schedules

- **Step decay:** reduce lr by factor every N epochs
- **Cosine annealing:** smooth cyclical decrease
- **OneCycleLR:** warm up then anneal (often best for transformers)
- **ReduceLROnPlateau:** reduce when metric stops improving

---

## Convolutional Neural Networks (CNN)

CNNs exploit spatial structure in images through local connectivity and parameter sharing (convolution kernels).

## Convolution Operation

A convolution slides a kernel (filter) over the input, computing dot products at each position:

- Input: `(H, W, C_in)`
- Kernel: `(K_h, K_w, C_in, C_out)`
- Output: `(H', W', C_out)`

Output spatial size: `H' = floor((H - K_h + 2*pad) / stride) + 1`

## Pooling

- **MaxPooling:** extracts the most activated feature in each window
- **AveragePooling:** averages values in each window
- Both reduce spatial size and provide translation invariance

## Classic Architectures

| Architecture | Year | Key Innovations | Top-1 ImageNet |
|---|---|---|---|
| **LeNet-5** | 1998 | Conv + pooling for digit recognition | — |
| **AlexNet** | 2012 | ReLU, dropout, GPU training, data augmentation | 62.5% |
| **VGG-16** | 2014 | Deep stack of 3x3 convs (16 weight layers) | 71.5% |
| **GoogLeNet** | 2014 | Inception modules, global average pooling | 69.8% |
| **ResNet-50** | 2015 | Skip connections (residual learning) | 76.1% |

### ResNet: Skip Connections

ResNet introduced skip (shortcut) connections that add the input of a block directly to its output:

`output = F(x) + x`

This eases gradient flow through the network, allowing training of very deep architectures (100+ layers) without degradation.

### CNN Implementation in PyTorch

```python
import torch
import torch.nn as nn

class CNN(nn.Module):
    """A CNN for image classification with residual blocks."""

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

RNNs process sequential data by maintaining a hidden state that accumulates information over time.

## The Problem: Long-Term Dependencies

Vanilla RNNs struggle to learn long-range dependencies because gradients either vanish (most activations) or explode (when eigenvalues > 1) during backpropagation through time (BPTT).

## LSTM (Long Short-Term Memory)

LSTM introduces memory cells with gating mechanisms:

- **Forget gate:** decides what to discard from cell state
- **Input gate:** decides what new information to store
- **Output gate:** decides what to output from cell state

Cell state update: `C_t = f_t * C_{t-1} + i_t * C'_t`

## GRU (Gated Recurrent Unit)

GRU simplifies LSTM with 2 gates (update, reset), fewer parameters, and often comparable performance.

## Sequence Classification with LSTM

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
        # Bidirectional doubles hidden_dim
        self.fc = nn.Linear(hidden_dim * 2 if bidirectional else hidden_dim, 1)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        # x: (batch, seq_len)
        embedded = self.embedding(x)           # (batch, seq_len, embed_dim)
        lstm_out, (h_n, c_n) = self.lstm(embedded)
        # lstm_out: (batch, seq_len, hidden*2) - all timesteps
        # h_n: (num_layers*2, batch, hidden) - last hidden state

        # Use last hidden state from both directions
        last_hidden = h_n[-2:]                 # (2, batch, hidden) for bidirectional
        last_hidden = torch.cat([last_hidden[0], last_hidden[1]], dim=1)
        last_hidden = self.dropout(last_hidden)

        return self.fc(last_hidden)            # (batch, 1)
```

---

## Transformers

The Transformer architecture, introduced in "Attention Is All You Need" (2017), replaces recurrence with self-attention, enabling parallel training and capturing long-range dependencies more effectively.

## Self-Attention

Self-attention allows every position in a sequence to attend to all other positions:

```
Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V
```

- **Q (Query):** what am I looking for?
- **K (Key):** what do I contain?
- **V (Value):** actual information to aggregate

The `1/sqrt(d_k)` scaling prevents softmax saturation when `d_k` is large.

## Multi-Head Attention

Running attention in parallel with multiple heads allows the model to attend to different representation subspaces:

```
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) * W_O
where head_i = Attention(QW_i^Q, KW_i^K, VW_i^V)
```

## Positional Encoding

Since self-attention is permutation-invariant, positional information must be injected:

```
PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
```

Modern alternatives: Rotary Position Embedding (RoPE), ALiBi

## Transformer Architecture

The standard Transformer consists of an encoder and decoder, each composed of stacked layers:

- **Encoder layer:** multi-head self-attention + feed-forward network + residual connections + layer norm
- **Decoder layer:** masked multi-head self-attention + cross-attention to encoder + feed-forward network

## BERT vs GPT

| | **BERT** | **GPT** |
|---|---|---|
| Architecture | Encoder-only | Decoder-only |
| Training objective | Masked Language Modeling (MLM) | Next Token Prediction |
| Attention | Bidirectional (sees context both ways) | Causal (only left context) |
| Typical use | Understanding (classification, NER, QA) | Generation (text gen, chat) |
| Representative size | Base: 110M params | GPT-3: 175B params |

## Fine-tuning a Transformer for Classification

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

## Training Techniques and Regularization

## Dropout

During training, randomly zero out activations with probability `p`. At inference, all weights are scaled by `p`. This prevents co-adaptation of neurons and acts as an ensemble of sub-networks.

```python
model = nn.Sequential(
    nn.Linear(512, 256),
    nn.ReLU(),
    nn.Dropout(0.3),
    nn.Linear(256, 10),
)
```

## Batch Normalization

Normalizes activations to `mean=0, variance=1` per batch, then applies learnable scale (`γ`) and shift (`β`) parameters:

```
y = γ * (x - μ_B / sqrt(σ_B² + ε)) + β
```

Benefits:

- Enables higher learning rates
- Reduces internal covariate shift
- Has a mild regularization effect
- Makes networks less sensitive to initialization

Moving averages of batch statistics are maintained during training and used at inference.

## Weight Decay

Adds `λ * ||W||²` to the loss, penalizing large weights. In AdamW, weight decay is decoupled from the adaptive learning rate, leading to better regularization.

## Early Stopping

Monitor validation loss and restore the model weights from the best epoch when validation loss stops improving. Prevents overfitting without requiring manual epoch selection.

## Label Smoothing

Replace hard labels `y=1` with `y=1-ε` and `y=0` with `ε/k`. Prevents the model from becoming overconfident and improves calibration.

---

## Loss Functions

| Task | Loss Function | Notes |
|---|---|---|
| Binary classification | `BCEWithLogitsLoss` | Combines sigmoid + BCE in numerically stable way |
| Multi-class | `CrossEntropyLoss` | Combines log_softmax + NLLLoss |
| Regression | `MSELoss` / `L1Loss` / `SmoothL1Loss` | SmoothL1 is less sensitive to outliers |
| Object detection | `FocalLoss` | Down-weights easy negatives |
| Generative models | `GANLoss`, `WassersteinLoss` | Task-specific |
| Segmentation | `CrossEntropyLoss`, `DiceLoss` | Dice handles class imbalance |

---

## Transfer Learning and Fine-tuning

Transfer learning leverages knowledge from pretrained models:

1. **Feature extraction:** freeze backbone, train only a new classifier head
2. **Fine-tuning:** unfreeze some/all layers and train with a small learning rate
3. **Full fine-tuning:** train entire network (usually with lower LR)

Best practice: unfreeze progressively (last layers first) with lower learning rates for earlier layers.

---

## Interview Q&A

### 1) What causes vanishing/exploding gradients?

During backpropagation, gradients are multiplied by the derivative of each activation at each layer. With sigmoid/tanh, derivatives are < 1, so repeated multiplication causes gradients to shrink exponentially (vanishing). With poorly scaled weights, they can grow exponentially (exploding). Solutions: ReLU activation, residual connections, LSTM/GRU gates, proper weight initialization (He/Xavier), gradient clipping.

### 2) How does batch normalization affect inference?

During training, it normalizes using batch statistics (μ_B, σ_B). During inference, it uses exponentially moving averages of these statistics accumulated during training. The learned γ, β parameters are always used.

### 3) Why do transformers generally outperform RNNs?

Transformers process all tokens in parallel (no sequential dependency), use self-attention to directly model any pairwise relationship regardless of distance, and scale better with data and compute. RNNs must compress information into a fixed-size hidden state.

### 4) What is the difference between pre-training and fine-tuning objectives?

Pre-training is unsupervised on large corpora (MLM for BERT, NTP for GPT). Fine-tuning is supervised on a downstream task with labeled data, using a task-specific head.

### 5) How do you choose between CNN and Transformer for a vision task?

CNNs are efficient, inductive bias (locality + translation equivariance) reduces data needs, great for real-time/small data. Vision Transformers (ViT) need large datasets to excel but often achieve higher accuracy on large-scale benchmarks; they are more expensive computationally.

### 6) What is the role of the CLS token in BERT?

The `[CLS]` token is prepended to every input sequence. Its final hidden state is used as the aggregate sequence representation for classification tasks. Because BERT is bidirectional, the `[CLS]` representation captures context from both directions.
