# Manipulation Perception & Semantic Grounding

## Tổng quan

Manipulation perception khắt khe hơn navigation perception.

Một mobile robot có thể chịu được sai số localization nhỏ. Một manipulator đang căn grasp hay insertion thì thường không thể.

Mục này tập trung vào perception cho tương tác chính xác.

---

## Hand-Eye và Object-Centric Perception

Các building blocks quan trọng:

- hand-eye calibration
- độ đúng của end-effector frame
- object detection và tracking
- 6D pose estimation

Câu hỏi then chốt không chỉ là "đây là vật gì?" mà còn là "nó ở đâu so với action frame của robot?"

---

## Affordances và Contact-Aware Perception

Manipulation thường cần nhiều hơn identity của object.

Các output hữu ích gồm:

- grasp affordance regions
- contact points
- cues để căn insertion
- surface normal estimates
- gợi ý về deformation hoặc compliance

Đó là lý do manipulation perception thường pha trộn geometry, semantics, và task context.

---

## Semantic Grounding và Foundation Models

Foundation models có thể giúp ở:

- open-vocabulary object grounding
- language-guided object search
- hiểu scene ở mức thô
- region proposal cho task logic phía sau

Nhưng chúng vẫn cần deterministic scaffolding quanh:

- final grasp pose
- frame consistency
- contact safety
- low-latency execution

Trong physical interaction, semantic understanding thôi là chưa đủ.

---

## Failure Modes trong thực tế

Manipulation perception thường hỏng vì:

- clutter và occlusion
- vật thể phản xạ hoặc ít texture
- calibration drift
- grasp predictions không đi kèm kiểm tra tính khả thi vật lý
- language grounding tìm đúng object nhưng sai interaction point

Đoạn đường cuối từ perception sang action thường là nơi độ khó robotics lộ rõ nhất.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao manipulation perception khó hơn object detection đơn thuần?

Vì robot cần thông tin không gian chính xác và gắn với hành động, chứ không chỉ là semantic labels hay bounding boxes.

### 2) Hand-eye calibration là gì?

Đó là calibration quan hệ không gian giữa manipulator của robot và camera hoặc sensing system của nó.

### 3) Vì sao affordances quan trọng?

Vì biết category của object là chưa đủ; robot còn phải biết tương tác ở đâu và theo cách nào là khả thi.

### 4) Vì sao foundation models không đủ một mình cho manipulation?

Vì tương tác vật lý đòi hỏi geometry chính xác, latency thấp, và safety constraints mà semantic reasoning tự do không đảm bảo được.
