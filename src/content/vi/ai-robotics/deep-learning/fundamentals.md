# Deep Learning Fundamentals & Optimization

## Tổng quan

Trước khi nói về transformers hay world models, bạn cần hiểu chắc cách mạng neural học và vì sao quá trình train thường bị bất ổn.

Mục này tập trung vào các phần xuất hiện gần như ở mọi nơi:

- representation learning với layered networks
- backpropagation và gradient-based optimization
- regularization và normalization
- thói quen debug training một cách có hệ thống

---

## Các khối nền tảng của mạng neural

### Perceptron và MLP

Một neuron tính tổng có trọng số cộng bias rồi đưa qua activation:

`y = activation(Wx + b)`

Một perceptron đơn chỉ mô hình hóa được ranh giới tuyến tính. Khi stack nhiều layers, ta có MLP và khả năng học biểu diễn phi tuyến theo phân cấp.

### Các activation function phổ biến

| Hàm | Ý nghĩa thực tế | Dùng khi nào |
|---|---|---|
| **ReLU** | Rẻ, sparse activations, mặc định tốt | Hidden layers |
| **Leaky ReLU / GELU / SiLU** | Gradient flow quanh zero tốt hơn | MLP hiện đại, transformers |
| **Sigmoid** | Cho đầu ra giống xác suất | Output head nhị phân |
| **Softmax** | Chuyển logits thành phân phối lớp | Output head multi-class |

Trong thực tế, chọn activation ảnh hưởng mạnh tới độ ổn định khi tối ưu chứ không chỉ khả năng biểu diễn.

### Initialization và Normalization

Khởi tạo tốt giúp activations không bị nổ hoặc xẹp ngay từ đầu quá trình train.

- **Xavier/Glorot** hợp với các activation kiểu tanh
- **He initialization** hợp với ReLU-like activations
- **BatchNorm / LayerNorm / RMSNorm** giúp ổn định scale của features

Normalization đặc biệt quan trọng khi train mạng sâu hoặc dùng learning rate lớn.

---

## Backpropagation và Gradient Flow

Backpropagation áp dụng chain rule từ output về input để tính `dL/dW` cho mọi tham số.

Các failure mode điển hình:

- **vanishing gradients** trong mạng sâu hoặc activation dễ saturate
- **exploding gradients** trong recurrent systems hoặc hệ có scale xấu
- **noisy gradients** do batch nhỏ hoặc data quality kém

Cách giảm rủi ro thường gặp:

- residual connections
- khởi tạo cẩn thận
- normalization layers
- gradient clipping
- mixed precision với loss scaling khi cần

Nếu không hiểu gradient flow, bạn sẽ rất khó debug hầu hết hệ deep learning.

---

## Optimizer và chiến lược learning rate

### Các optimizer phổ biến

| Optimizer | Điểm mạnh | Tình huống hay dùng |
|---|---|---|
| **SGD + momentum** | Generalization tốt, động học đơn giản | Vision training quy mô lớn |
| **Adam** | Hội tụ nhanh, mặc định ổn | Thử nghiệm chung |
| **AdamW** | Weight decay đúng hơn | Transformers và foundation models |
| **RMSProp** | Hữu ích cho bài toán không ổn định theo thời gian | Một số sequence / RL workloads |

### Learning-rate schedule

Schedule nhiều khi quan trọng không kém optimizer.

- **warmup** giúp tránh bất ổn ở đầu training
- **cosine decay** là mặc định khá tốt
- **OneCycle** phù hợp khi cần thử nghiệm nhanh
- **ReduceLROnPlateau** hữu ích khi metric validation nhiễu

Khi training diverge, việc kiểm tra learning rate thường đáng làm trước khi đổi kiến trúc.

---

## Losses, Regularization, và Generalization

### Loss Functions

- **CrossEntropyLoss** cho multi-class classification
- **BCEWithLogitsLoss** cho binary hoặc multilabel
- **MSE / L1 / SmoothL1** cho regression
- **Dice / focal losses** cho detection hoặc segmentation mất cân bằng lớp

### Các công cụ regularization

- dropout
- weight decay
- early stopping
- label smoothing
- data augmentation
- stochastic depth cho mạng rất sâu

Các kỹ thuật này giúp giảm memorization và làm model bớt giòn khi input distribution thay đổi ở inference.

---

## Quy trình training thực dụng

Một deep-learning engineer tốt thường debug theo thứ tự này:

1. cố tình overfit một batch rất nhỏ trước
2. kiểm tra labels, shapes, normalization, và metric calculation
3. theo dõi training loss, validation loss, và gradient norms
4. chỉ thêm regularization sau khi pipeline cơ bản đã đúng
5. luôn so với baseline đơn giản trước khi scale model

Những lỗi dự án rất hay gặp:

- target encoding sai
- preprocessing train và validation không đồng nhất
- quên gọi `model.eval()` lúc inference
- chỉ báo cáo loss mà không báo metric business hoặc metric robotics

---

## Vì sao phần này đặc biệt quan trọng trong Physical AI

Trong robotics, chất lượng training bị giới hạn bởi nhiều thứ hơn benchmark loss:

- dữ liệu ít, lệch, và đắt để thu thập
- sensor streams có thể không đồng bộ
- labels cho failure và recovery thường hiếm
- inference phải đi vừa latency và power budget

Vì thế optimization fundamentals còn quan trọng hơn trong physical AI so với các benchmark offline thuần túy.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao mạng sâu hay bị vanishing gradients?

Vì gradients bị nhân lặp lại qua nhiều layers. Nếu đạo hàm thường nhỏ hơn 1 thì tín hiệu gradient sẽ co lại theo cấp số nhân khi lan ngược.

### 2) Vì sao AdamW thường được ưu tiên hơn Adam?

Vì AdamW tách weight decay ra khỏi adaptive update nên regularization dễ kiểm soát hơn và thường cho training tốt hơn.

### 3) Gradient clipping có ích gì trong thực tế?

Nó giới hạn update quá lớn, đặc biệt trong recurrent hoặc training bất ổn, để một batch xấu không phá hỏng cả quá trình tối ưu.

### 4) Làm sao debug một model không học được gì?

Bắt đầu bằng việc cố overfit một batch rất nhỏ, kiểm tra labels và preprocessing, xem gradients, rồi giảm độ phức tạp bài toán cho đến khi training loop cơ bản hoạt động đúng.
