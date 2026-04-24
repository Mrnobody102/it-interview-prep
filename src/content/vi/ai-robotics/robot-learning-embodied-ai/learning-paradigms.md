# Robot Learning Paradigms & Policy Learning

## Tổng quan

Robot learning bao gồm nhiều paradigm khác nhau, mỗi loại mang theo giả định dữ liệu và chi phí vận hành riêng.

Các family quan trọng:

- imitation learning
- reinforcement learning
- offline RL
- hybrid learning từ demos cộng interaction

---

## Imitation khác Reinforcement thế nào

Imitation learning hấp dẫn khi:

- có expert demonstrations
- exploration trên hardware là rủi ro
- task được biểu diễn khá tốt qua hành vi quan sát được

Reinforcement learning hữu ích khi:

- có thể định nghĩa reward
- exploration làm được trong simulation hoặc setting an toàn
- task đòi hỏi khám phá hành vi vượt khỏi demonstrations

---

## Offline RL và tái sử dụng Dataset

Offline RL cố học policy từ logged data mà không cần online exploration lớn.

Điều này hấp dẫn trong robotics vì:

- hardware time đắt
- exploration không an toàn
- dữ liệu vận hành đã có sẵn

Nhưng nó dễ giòn nếu data coverage yếu.

---

## Các concern của Policy Learning

Các concern quan trọng:

- reward design
- distribution shift
- exploration safety
- sample efficiency

Đó là lý do nhiều hệ robot thật vẫn chỉ dùng learning ở những phần chọn lọc chứ không áp dụng mọi nơi.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao imitation learning hấp dẫn trong robotics?

Vì nó có thể học từ demonstrations mà không cần exploration nguy hiểm trực tiếp trên hardware.

### 2) Thách thức chính của reinforcement learning trong robotics là gì?

Sample efficiency và safe exploration là hai nút thắt lớn, đặc biệt trên robot thật.

### 3) Vì sao offline RL có thể fail?

Vì policy có thể phải hành động ngoài support của logged dataset, nơi value estimates học được trở nên thiếu tin cậy.
