# Domain Randomization & Sim2Real Strategies

## Tổng quan

Sim2Real là bài toán làm cho hành vi học hoặc kiểm thử trong simulation vẫn còn hữu ích ngoài đời thật.

Điều này thường sẽ fail nếu team không xử lý mismatch một cách tường minh.

---

## Các chiến lược phổ biến

Những chiến lược Sim2Real quan trọng:

- domain randomization
- system identification
- residual adaptation
- online calibration và adaptation

Mỗi chiến lược xử lý một loại simulator mismatch khác nhau.

---

## Domain Randomization

Randomization có thể áp lên:

- textures và lighting
- friction và mass
- sensor noise
- actuator delay
- object placement

Mục tiêu không phải realism trong một cấu hình duy nhất, mà là robustness qua nhiều thực tại khả dĩ.

---

## Điều gì vẫn làm Transfer gãy

Transfer fail khi:

- simulator bỏ sót phần physics quan trọng
- giả định calibration sai
- policy khai thác simulator artifacts
- reality có contacts hoặc delays không được mô hình hóa

Đó là lý do transfer phải được đo, chứ không được mặc định.

---

## Câu hỏi Phỏng vấn

### 1) Domain randomization là gì?

Đó là việc cố tình thay đổi các thuộc tính của simulator để policy học được bền hơn trước chênh lệch giữa simulation và reality.

### 2) Vì sao Sim2Real khó?

Vì chỉ một mismatch nhỏ ở sensing, timing, contact, hoặc dynamics cũng có thể tạo ra khác biệt hành vi lớn trên hardware thật.

### 3) Vì sao system identification hữu ích?

Vì ước lượng tốt hơn về dynamics thật của robot giúp thu hẹp khoảng cách giữa hành vi mô phỏng và hành vi thực.
