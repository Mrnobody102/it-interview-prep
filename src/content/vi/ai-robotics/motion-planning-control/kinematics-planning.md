# Kinematics, Feasibility & Planning Layers

## Tổng quan

Motion planning bắt đầu trước cả bước tối ưu. Nó bắt đầu từ việc hỏi xem chuyển động đó có khả thi hay không.

Mục này tập trung vào:

- reachability
- kinematic constraints
- planning hierarchy
- định nghĩa search space

---

## Planning Hierarchy

Một hierarchy thực dụng thường là:

1. task planning
2. motion planning
3. trajectory generation
4. control execution

Trộn lẫn các tầng này sẽ làm việc debug khó hơn rất nhiều.

---

## Feasibility quan trọng hơn Optimality lúc đầu

Các kiểm tra feasibility quan trọng:

- joint và workspace limits
- collision constraints
- dynamic feasibility
- contact hoặc support constraints

Một optimizer đẹp là vô nghĩa nếu bài toán gốc vốn đã không khả thi.

---

## Tư duy Kinematic

Các ý chính:

- inverse kinematics có thể có nhiều nghiệm hoặc không có nghiệm nào
- singularities tạo ra hành vi cục bộ bất ổn
- redundancy có thể giúp tránh vật cản hoặc giữ posture tốt hơn

Chất lượng planning phụ thuộc mạnh vào việc hiểu các tính chất cấu trúc này.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao feasibility quan trọng hơn optimality ở giai đoạn đầu?

Vì một nghiệm có vẻ tối ưu về toán học nhưng không thể thực thi ngoài đời thì không có giá trị.

### 2) Vì sao planners cần hierarchy?

Vì task choice, geometric feasibility, trajectory timing, và control execution là những bài toán khác nhau với giả định khác nhau.

### 3) Vì sao singularities quan trọng với planning?

Vì chúng có thể làm chuyển động lân cận trở nên bất ổn, nhạy số, hoặc khó thực thi về mặt vật lý.
