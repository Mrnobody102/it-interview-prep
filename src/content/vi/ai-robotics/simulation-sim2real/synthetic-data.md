# Synthetic Data, Rendering & Scenario Generation

## Tổng quan

Synthetic data là một trong những đầu ra có khả năng scale mạnh nhất của hạ tầng simulation.

Nó đặc biệt hữu ích cho các hệ perception-heavy khi gán nhãn dữ liệu thật quá đắt.

---

## Synthetic Data giúp mạnh nhất ở đâu

Synthetic data rất mạnh cho:

- detection và segmentation pretraining
- depth và pose tasks
- tạo rare scenes
- mở rộng coverage cho corner cases
- tạo labels có cấu trúc mà annotate tay rất mệt

Nó kém đáng tin hơn khi realism gap chi phối task mục tiêu.

---

## Thiết kế Scenario

Scenario generation tốt nên thay đổi:

- object identity và arrangement
- lighting và material properties
- camera placement
- motion patterns
- mức độ khó của task

Giá trị nằm ở coverage, không chỉ ở số lượng.

---

## Các tradeoff khi Rendering

Những tradeoff quan trọng:

- photorealism vs generation speed
- clean labels vs noisy realism
- fidelity hẹp theo một domain vs diversity rộng

Synthetic-data pipelines nên được đánh giá bằng downstream improvement, không chỉ bằng độ đẹp của hình.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao synthetic data hấp dẫn?

Vì nó có thể tạo lượng lớn dữ liệu có nhãn với chi phí thấp và bao phủ các tình huống khó thu thập hoặc khó annotate ngoài đời thật.

### 2) Vì sao nhiều synthetic data hơn chưa chắc tốt hơn?

Vì diversity kém hoặc realism assumptions sai có thể củng cố đúng những bias mà bạn không muốn.

### 3) Điều gì làm một synthetic dataset trở nên tốt?

Coverage tốt cho các scenario liên quan, labels hữu ích, và đủ realism ở những khía cạnh thật sự quan trọng cho downstream model.
