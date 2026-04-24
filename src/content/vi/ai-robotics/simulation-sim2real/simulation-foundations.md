# Simulation Foundations & Physics Fidelity

## Tổng quan

Simulation cho phép team thử nghiệm nhanh và an toàn hơn, nhưng không phải simulator nào cũng hữu ích cho mọi mục tiêu.

Câu hỏi cốt lõi là: mức fidelity nào thực sự cần cho bài toán đang giải?

---

## Simulation giỏi ở đâu

Simulation đặc biệt hữu ích cho:

- algorithm prototyping
- controller testing
- scenario regression
- policy pretraining
- operator training và rehearsal

Nó kém hữu ích hơn khi team kỳ vọng nó thay thế hoàn toàn hardware validation.

---

## Các tradeoff về Fidelity

Các chiều fidelity quan trọng:

- rigid-body dynamics
- contact realism
- sensor noise modeling
- visual realism
- environment variability

Bạn không cần fidelity tối đa ở mọi chỗ. Bạn cần đúng mức fidelity cho các failure modes mình quan tâm.

---

## Ràng buộc thực dụng

Fidelity cao hơn thường kéo theo:

- iterate chậm hơn
- tốn công tuning hơn
- setup mong manh hơn

Team nên tối ưu learning value trên mỗi vòng lặp, không chỉ tối ưu realism.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao simulation hữu ích trong robotics?

Vì nó giảm chi phí và rủi ro trong khi cho phép thử nghiệm nhanh hơn và bao phủ nhiều scenario hơn.

### 2) Vì sao realism tối đa không phải lúc nào cũng tốt nhất?

Vì nó có thể làm iterate chậm đi và tăng độ phức tạp mà không cải thiện transfer cho task mục tiêu.

### 3) Fidelity trong simulation nghĩa là gì?

Nó là mức độ mà physics, sensing, và hành vi môi trường trong mô phỏng khớp với các thuộc tính liên quan của hệ thật.
