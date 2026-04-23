# CNNs, RNNs & Core Deep Learning Architectures

## Tổng quan

Không phải bài toán nào cũng cần transformer.

Các kiến trúc deep learning cốt lõi vẫn quan trọng vì mỗi loại mang theo một inductive bias hữu ích:

- CNN giả định tính locality và cấu trúc dịch chuyển trong không gian
- recurrent models giả định tính lặp theo thời gian
- residual architectures giúp gradient đi xuyên qua mạng sâu dễ hơn

Hiểu các bias này giúp bạn chọn model đơn giản hơn, nhanh hơn, và nhiều khi ổn định hơn.

---

## Convolutional Neural Networks

CNN dùng các filter chia sẻ tham số trên những vùng lân cận cục bộ. Điều này mang lại hai lợi ích lớn:

- ít tham số hơn nhiều so với mạng fully connected cho ảnh
- bias mạnh cho việc tái sử dụng pattern không gian

Các thành phần quan trọng:

- convolution layers
- stride và padding
- pooling hoặc strided downsampling
- normalization
- residual hoặc skip connections

CNN vẫn rất mạnh cho:

- embedded vision
- real-time detection
- industrial inspection với ít dữ liệu
- segmentation có prior không gian mạnh

### Vì sao ResNet quan trọng

Residual connections học `F(x) + x` thay vì buộc block phải học toàn bộ ánh xạ từ đầu. Điều này giúp tối ưu mạng sâu dễ hơn nhiều.

Ý tưởng đó sau này ảnh hưởng tới rất nhiều họ model khác, không chỉ CNN.

---

## U-Net, FPN, và các backbone theo tác vụ

Trong dự án thật, bạn hiếm khi dùng một backbone classifier thuần túy.

Các pattern rất quan trọng gồm:

- **U-Net** cho dense prediction và segmentation
- **Feature Pyramid Networks (FPN)** cho multi-scale detection
- **encoder-decoder** cho depth estimation và restoration
- **lightweight CNNs** như MobileNet cho edge deployment

Việc chọn kiến trúc thường bị chi phối bởi độ phân giải, latency budget, và cấu trúc đầu ra.

---

## Recurrent Models: RNN, LSTM, và GRU

Trước khi transformers thống trị sequence modeling, recurrent networks là lựa chọn tiêu chuẩn cho dữ liệu có thứ tự.

### Vì sao vanilla RNN yếu

Chúng khó học phụ thuộc dài hạn vì backpropagation through time làm gradient dễ biến mất hoặc bùng nổ.

### Vì sao LSTM và GRU giúp được

Chúng thêm các gate để quyết định:

- giữ thông tin nào trong memory
- quên cái gì
- xuất phần nào ra ngoài

Các model này vẫn phù hợp khi:

- sequence không quá dài
- latency quan trọng
- phần cứng hạn chế
- bài toán cần cập nhật state online thay vì attention toàn chuỗi

---

## Inductive Bias và cách chọn model

Bạn nên chọn kiến trúc bằng cách ghép giả định của model với dữ liệu:

| Dạng bài toán | Ứng viên mạnh |
|---|---|
| Ảnh với texture cục bộ | CNN |
| Dense pixel prediction | U-Net / encoder-decoder |
| Sensor streams online ngắn | GRU / LSTM / temporal CNN |
| Suy luận phụ thuộc rất xa | Transformer |
| Thiết bị edge nhỏ, task cố định | Compact CNN hoặc hybrid model |

Model đang thịnh hành chưa chắc đã là model production tốt nhất.

---

## Kiến trúc trong AI-Robotics

Với robotics, các kiến trúc cổ điển vẫn rất hữu ích vì:

- control loop không phải lúc nào cũng chịu được attention stack nặng
- edge devices có power budget chặt
- perception thường hưởng lợi từ locality hình học
- recurrence hoặc temporal filtering giúp output mượt hơn theo thời gian

Ví dụ:

- CNN backbone + transformer head nhỏ
- GRU trên proprioception + vision encoder cho policy ngắn hạn
- U-Net style segmentation để dự đoán vùng grasp

Hybrid systems xuất hiện nhiều vì cân bằng được accuracy và real-time behavior.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao CNN vẫn còn quan trọng trong 2026?

Vì chúng hiệu quả, cần ít dữ liệu hơn, và thường dễ deploy cho real-time perception hoặc embedded systems hơn model transformer-only lớn.

### 2) Residual connection giải quyết vấn đề gì?

Nó cải thiện gradient flow và giúp tối ưu mạng sâu dễ hơn bằng cách học residual transformation thay vì full mapping.

### 3) Khi nào nên chọn LSTM hoặc GRU thay vì transformer?

Khi bạn cần cập nhật online với độ trễ thấp, sequence vừa phải, memory footprint nhỏ hơn, hoặc state recurrent đơn giản trên edge hardware.

### 4) Inductive bias trong deep learning là gì?

Đó là giả định cấu trúc mà model đặt lên dữ liệu. Inductive bias phù hợp có thể giúp giảm nhu cầu dữ liệu và tăng độ bền của model.
