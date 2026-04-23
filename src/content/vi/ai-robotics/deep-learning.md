# Deep Learning

## Tổng quan

Deep Learning quá rộng để giữ trong một trang duy nhất mà vẫn dễ học và dễ tra cứu.

Trong thực tế, khi ôn phỏng vấn và khi làm hệ thống AI production, người ta thường phải tư duy theo bốn lớp khác nhau:

1. nền tảng mạng neural và tối ưu hóa
2. các kiến trúc cốt lõi như CNN và recurrent models
3. transformers, foundation models, và fine-tuning
4. multimodal và embodied deep learning cho physical AI

Đó là lý do chủ đề này được tách thành các mục con rõ ràng.

---

## Vì sao nó quan trọng với AI-Robotics

Deep learning là xương sống mô hình hóa phía sau:

- perception models cho ảnh, video, và depth
- language models và multimodal systems
- world models và action models
- policy learning cho robot
- synthetic data generation và training dựa trên simulation

Nếu chỉ học "deep learning" như một danh sách tên kiến trúc, bạn sẽ bỏ lỡ các tradeoff hệ thống thực sự quan trọng trong AI và robotics.

---

## Bản đồ các mục con

### 1. DL Fundamentals & Optimization

Trọng tâm:

- perceptron, MLP, activations, và normalization
- backpropagation và gradient descent
- optimizers, learning-rate schedules, và loss functions
- regularization và cách debug training bị bất ổn

Dùng mục này khi bạn muốn nắm nền tảng toán học và thực hành cho mọi họ model phía sau.

### 2. CNNs, RNNs & Core Architectures

Trọng tâm:

- convolution, pooling, residual connections
- recurrent models, LSTM, và GRU
- inductive bias và cách chọn kiến trúc
- khi nào các kiến trúc cổ điển vẫn tốt hơn foundation model lớn

Dùng mục này khi câu hỏi chính là về cấu trúc model chứ không chỉ mẹo train.

### 3. Transformers, Foundation Models & Fine-tuning

Trọng tâm:

- self-attention, positional encoding, và encoder/decoder designs
- BERT, GPT, encoder-decoder models, và các family foundation model hiện đại
- transfer learning, parameter-efficient tuning, và giới hạn long context
- cost inference, batching, và tradeoff triển khai

Dùng mục này khi bài toán liên quan NLP hiện đại, multimodal model, hoặc backbone pretrained lớn.

### 4. Multimodal, World Models & Embodied DL

Trọng tâm:

- multimodal fusion giữa vision, language, audio, và proprioception
- diffusion models, latent world models, và action models
- policy tokenization và action chunking
- data scaling và các ràng buộc triển khai cho physical AI

Dùng mục này khi model phải nối perception với action trong thế giới thật.

---

## Thứ tự học gợi ý

Với đa số engineers, thứ tự thực dụng là:

1. fundamentals và optimization
2. CNNs và recurrent architectures
3. transformers và fine-tuning
4. multimodal và embodied deep learning

Thứ tự này giúp bạn hiểu vì sao các model mới hoạt động, chứ không chỉ nhớ tên của chúng.

---

## Liên hệ với các topic AI-Robotics khác

Phần Deep Learning này có giao nhau, nhưng không thay thế:

- **Machine Learning** cho các phương pháp supervised và unsupervised cổ điển
- **Computer Vision** cho các bài toán perception và metrics chuyên biệt
- **NLP, LLMs & Transformers** cho mô hình ngôn ngữ
- **Robot Learning & Embodied AI** cho policy learning, control, và tương tác

Deep learning là một bộ công cụ modeling, không phải toàn bộ AI stack.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao nên tách Deep Learning thành nhiều mục nhỏ?

Vì optimization, thiết kế kiến trúc, transformers, và embodied modeling đòi hỏi các mental model khác nhau. Dồn hết vào một trang sẽ làm mờ cấu trúc thật của lĩnh vực này.

### 2) Vì sao optimization là chủ đề hạng nhất trong deep learning?

Vì rất nhiều lỗi đến từ gradient bất ổn, schedule kém, dữ liệu xấu, hoặc regularization sai chứ không phải do tên kiến trúc.

### 3) Vì sao Deep Learning lại quan trọng đặc biệt trong robotics?

Vì robotics ngày càng phụ thuộc vào learned perception, multimodal representations, policy priors, và khả năng suy luận về chuỗi hành động tương lai.
