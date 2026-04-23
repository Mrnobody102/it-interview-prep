# VLMs, Grounding & Open-Vocabulary Vision

## Tổng quan

Hệ vision hiện đại ngày càng làm việc trực tiếp với ngôn ngữ.

Thay vì chỉ dự đoán closed-set label, hệ thống có thể phải:

- detect category chưa từng có trong label set cố định từ text prompt
- localize object từ natural language
- segment region theo mô tả
- nối ngôn ngữ với thực thể liên quan tới robot

Điều này rất mạnh, nhưng cũng rất dễ bị dùng quá mức.

---

## Open-vocabulary perception

Hệ open-vocabulary cố gắng nhận ra category vượt ra ngoài một nhãn cố định lúc train.

Các khả năng hữu ích:

- text-conditioned detection
- text-image retrieval
- region-text alignment
- phrase grounding

Điều này hấp dẫn trong robotics vì môi trường thực tế là open-ended:

- người dùng mô tả object bất kỳ
- object mới xuất hiện sau khi deploy
- label trong benchmark dataset luôn thiếu

Nhưng open-vocabulary không đồng nghĩa với open-reliability.

---

## Grounding ngôn ngữ thành target thị giác

Grounding là ánh xạ ngôn ngữ như:

- "cái cốc xanh gần bàn phím"
- "ngăn kéo đang mở ở bên trái"
- "nút dừng khẩn cấp màu đỏ"

thành thực thể thị giác mà hệ có thể tác động đúng.

Điều này thường cần kết hợp:

- language parsing
- visual region proposal
- context reasoning
- spatial relations
- xử lý ambiguity

Grounding không được giải quyết chỉ bằng một similarity score.

---

## Promptable segmentation và interactive vision

Các hệ segmentation có thể prompt hữu ích vì chúng có thể:

- segment object bất kỳ từ point, box, hoặc text
- tăng tốc annotation
- hỗ trợ giao diện tương tác cho robotics
- tạo candidate mask cho geometry downstream

Nhưng segmentation theo prompt vẫn cần:

- calibration nhất quán
- kiểm soát latency
- kiểm tra chất lượng mask
- validate downstream trước khi action

Promptable perception là một module hữu ích, không phải một autonomy stack hoàn chỉnh.

---

## Failure modes của VLM

Các lỗi thường gặp:

- confidence về semantics nhưng không có geometric grounding
- nhạy với cách diễn đạt
- fail trong scene cluttered
- khó với object nhỏ hoặc bị che khuất một phần
- temporal consistency yếu
- hallucinate quan hệ giữa các object

Điều này nguy hiểm trong robotics vì một quyết định grounding trôi chảy nhưng sai có thể dẫn tới hành động không an toàn hoặc tốn kém.

---

## Pattern thực dụng cho robot

Một pattern an toàn hơn thường là:

1. dùng ngôn ngữ để thu hẹp vùng tìm kiếm
2. dùng vision model để đề xuất candidate
3. dùng geometry hoặc task constraint để validate kết quả
4. ước lượng confidence
5. fallback hoặc hỏi lại nếu ambiguity quá cao

Thiết kế hybrid như vậy thường bền hơn việc tin trực tiếp vào một output duy nhất của VLM.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao VLM hữu ích cho robotics?

Vì chúng giúp nối instruction ngôn ngữ tự nhiên với thực thể thị giác và hỗ trợ tương tác linh hoạt hơn trong môi trường mở.

### 2) Vì sao VLM không tự nó đủ cho robot perception?

Vì robot vẫn cần geometry, calibration, temporal consistency, và validation an toàn trước khi hành động, không chỉ semantic fluency.

### 3) Grounding trong nghĩa thực tế là gì?

Đó là quá trình nối ngôn ngữ với thực thể, vùng ảnh, và quan hệ không gian cụ thể trong scene hiện tại để hệ thống hành động đúng.
