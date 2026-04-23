# Multimodal, World Models & Embodied Deep Learning

## Tổng quan

Các hệ AI hiện đại ngày càng kết hợp nhiều modality thay vì tách perception, language, và action thành những khối riêng.

Trong embodied AI và robotics, một model hữu ích có thể phải xử lý đồng thời:

- camera frames
- depth hoặc point clouds
- proprioception
- force hoặc tactile signals
- chỉ dẫn bằng natural language
- actions trước đó và history gần nhất của hệ

Điều này đẩy deep learning vượt xa bài toán classification một modality để sang học biểu diễn đa phương thức và model định hướng hành động.

---

## Các pattern multimodal fusion

Các chiến lược fusion phổ biến:

- **early fusion**: ghép modalities gần đầu vào
- **late fusion**: ghép dự đoán từ từng modality
- **cross-attention**: cho modality này attend sang modality khác
- **shared latent space**: căn chỉnh nhiều modalities vào cùng một biểu diễn

Lựa chọn đúng phụ thuộc vào độ đồng bộ thời gian, băng thông, và việc bài toán chỉ là perception hay là closed-loop control.

---

## Diffusion, World Models, và Action Models

### Diffusion Models

Diffusion giờ không chỉ dành cho image generation. Nó còn được dùng cho:

- trajectory generation
- phân phối đề xuất hành động
- tạo synthetic data
- motion priors cho manipulation

### World Models

World model học latent dynamics của môi trường:

- trạng thái tiếp theo có thể là gì
- hành động nào dẫn đến kết quả nào
- plan nào có khả năng khả thi về mặt vật lý

Điều này hỗ trợ planning, imagination rollouts, và policy learning.

### Action Models

Trong robotics, output nhiều khi không phải caption hay class label mà là cả một chuỗi hành động. Vì vậy policy model ngày càng dự đoán:

- action chunks
- future waypoints
- tham số skill trong môi trường tiếp xúc
- latent plans rồi được lower-level controller tinh chỉnh

---

## Chiến lược dữ liệu cho Physical AI

Model lớn hơn không cứu được dữ liệu robotics kém.

Team vẫn cần:

- log đa cảm biến được đồng bộ đúng
- dữ liệu intervention và recovery
- failure cases chứ không chỉ demo thành công
- môi trường đa dạng và nhiều biến thể phần cứng
- dữ liệu simulation với noise model đủ thực tế

Model chỉ học được những gì pipeline thật sự ghi lại. Thiếu contact events, lệch thời gian, hoặc labels xấu sẽ chi phối hiệu năng cuối cùng.

---

## Ràng buộc triển khai

Embodied deep learning phải tôn trọng các giới hạn đời thực:

- latency inference nằm trong perception hoặc control loop
- giới hạn memory và power trên edge devices
- uncertainty và fallback behavior
- degraded mode khi một sensor bị mất

Các kỹ thuật triển khai thường gặp:

- distillation sang model nhỏ hơn, chuyên biệt hơn
- quantization
- cascaded inference
- tách policy ra khỏi safety filter

Trong robotics, một model nhỏ nhưng timing ổn định thường hữu ích hơn model lớn nhưng độ trễ thất thường.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao multimodal learning khó hơn single-modality learning?

Vì các modalities khác nhau về scale, timing, noise, và cách căn chỉnh semantics. Chất lượng fusion phụ thuộc rất mạnh vào synchronization và thiết kế representation.

### 2) World model trong thực tế là gì?

Đó là một mô hình học động lực môi trường để dự đoán trạng thái hoặc latent outcome tương lai, từ đó hỗ trợ planning và policy learning.

### 3) Vì sao action chunks hữu ích trong embodied AI?

Vì chúng cho hệ lập kế hoạch trên một horizon ngắn, giảm overhead mỗi bước, và thường tạo hành vi mượt hơn so với dự đoán từng action rất nhỏ.

### 4) Vì sao kỷ luật triển khai lại quan trọng như vậy trong robotics?

Vì latency spikes, calibration drift, hoặc uncertainty handling kém có thể chuyển thẳng thành hành vi vật lý không an toàn hoặc vô dụng.
