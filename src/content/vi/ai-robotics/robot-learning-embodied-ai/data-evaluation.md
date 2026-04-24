# Data Scaling, Evaluation & Real-World Constraints

## Tổng quan

Tiến bộ trong embodied AI phụ thuộc rất mạnh vào dữ liệu và kỷ luật evaluation.

Mục này tập trung vào:

- dataset quality
- failure coverage
- evaluation realism
- deployment constraints

---

## Data là Bottleneck thật sự

Robotics data khó vì nó thường phải:

- được đồng bộ đa cảm biến
- có nhãn theo task outcome hoặc failure context
- đa dạng qua nhiều môi trường
- giàu recovery behavior

Model lớn không thể bù cho thông tin mà dataset chưa từng ghi lại tốt.

---

## Evaluation vượt khỏi Demo

Evaluation hữu ích nên bao gồm:

- task success rate
- recovery behavior
- robustness trước perturbation
- latency và throughput
- phân tích safety-relevant failures

Các demo clip ngắn không đủ làm bằng chứng cho readiness ở production.

---

## Các ràng buộc Real-World

Embodied models phải tôn trọng:

- compute onboard hạn chế
- sensing không hoàn hảo
- môi trường thay đổi
- nhu cầu bảo trì và recalibration

Các ràng buộc này thường chi phối kiến trúc còn mạnh hơn sở thích về model family.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao dataset quality quan trọng hơn model size trong nhiều setup robot learning?

Vì thiếu failure cases, đồng bộ yếu, và coverage kém sẽ giới hạn thứ model có thể học được dù nó lớn đến đâu.

### 2) Vì sao demos là bằng chứng yếu?

Vì chúng thường chỉ cho best-case behavior và che đi failure frequency, recovery quality, cũng như operating constraints.

### 3) Vì sao evaluation trong robotics khó hơn pure software?

Vì hiệu năng phụ thuộc vào execution vật lý, biến thiên môi trường, và safety chứ không chỉ chất lượng output ở dạng tách biệt.
