# Evaluation Ladders, Replay & Benchmarking

## Tổng quan

Simulation có giá trị nhất khi nó hỗ trợ evaluation có kỷ luật trước khi deploy thật.

Mục này tập trung vào:

- staged validation
- replay
- regression testing
- benchmark design

---

## Evaluation Ladder

Một evaluation ladder hữu ích thường là:

1. unit và subsystem checks
2. simulator scenario tests
3. log replay
4. limited hardware validation
5. staged deployment

Bỏ qua các tầng này thường làm tăng rủi ro vận hành.

---

## Replay và Regression

Replay giúp team:

- so sánh các phiên bản trên cùng input
- điều tra incidents
- test fix trên historical failures
- đo xem thay đổi có thực sự cải thiện hành vi không

Điều này đặc biệt quan trọng với các hệ phụ thuộc timing.

---

## Benchmark Design

Benchmark hữu ích nên có:

- normal scenarios
- edge cases
- rare failures
- metrics có ý nghĩa gắn với task success và safety

Benchmark chỉ thưởng cho một metric duy nhất thường làm lệch hướng phát triển hệ.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao replay có giá trị?

Vì nó cho so sánh lặp lại được và giúp team test trên historical failures mà không phải tái hiện vật lý mỗi lần.

### 2) Evaluation ladder là gì?

Đó là quy trình validation theo tầng, đi từ test cô lập tới các điều kiện deployment ngày càng thực hơn.

### 3) Vì sao benchmark có thể gây hiểu nhầm?

Vì nó có thể bỏ sót safety-critical scenarios, biến thiên thực tế, hoặc các metric thật sự quan trọng ở production.
