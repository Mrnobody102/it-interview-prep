# Production CV for Robotics

## Tổng quan

Model nhìn đẹp trong notebook không tự động trở thành perception system có thể deploy.

Production computer vision cho robotics phải xử lý:

- calibration drift
- sensor synchronization
- latency có giới hạn
- uncertainty
- degraded mode
- observability sau failure

Đây là nơi rất nhiều demo ấn tượng bị gãy.

---

## Calibration và synchronization

Robotics vision phụ thuộc vào nhiều thứ hơn model weights.

Các giả định hệ thống quan trọng:

- camera intrinsics còn đúng
- extrinsics tương đối với robot còn đúng
- timestamps được align giữa các sensor
- frame được ghép với đúng robot state

Nếu synchronization sai, ngay cả model mạnh cũng có thể sinh ra output vô nghĩa về mặt vật lý.

---

## Latency budget và action loop

Trong robotics, perception nằm trong một vòng lặp.

Điều đó có nghĩa latency không chỉ là độ trễ người dùng nhìn thấy. Nó thay đổi chất lượng control.

Các câu hỏi hữu ích:

- camera capture latency là bao nhiêu?
- preprocessing latency là bao nhiêu?
- model inference latency là bao nhiêu?
- postprocessing latency là bao nhiêu?
- output đã cũ bao nhiêu khi robot thật sự hành động?

Kết quả perception có thể "đúng" nhưng vẫn quá muộn để hữu ích.

---

## Confidence, gating và fallback

Production system cần xử lý confidence một cách tường minh.

Ví dụ:

- không grasp nếu pose confidence quá thấp
- giảm tốc navigation nếu confidence của obstacle trở nên không ổn định
- quan sát lại trước khi act khi có ambiguity
- fallback sang sensing đơn giản hơn hoặc scripted behavior

Hệ bền không phải là hệ không bao giờ fail. Nó là hệ fail trong giới hạn và quan sát được.

---

## Observability và data flywheel

Để cải thiện hệ vision đã deploy, team cần:

- synchronized logs
- raw frames và metadata
- calibration version
- model version
- downstream action outcome
- pipeline annotation và incident review

Nếu thiếu các thứ này, việc "cải thiện model" sẽ chỉ là đoán mò.

Production CV được cải thiện nhờ data flywheel có kỷ luật, không phải nhờ chase benchmark rời rạc.

---

## Failure modes vision điển hình trong robotics

Các vấn đề production thường gặp:

- camera bị lệch nhưng extrinsics không được cập nhật
- ánh sáng thay đổi khỏi regime lúc train
- tần suất object chuyển sang long-tail case
- vật phản chiếu làm depth hỏng
- inference chậm đi sau khi nâng cấp model
- detector confidence nhìn cao nhưng temporal stability sụp

Những failure này thường là failure đa yếu tố của cả hệ thống, không chỉ của model.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao latency là metric hạng nhất trong robotics vision?

Vì output perception đi vào vòng lặp hành động vật lý. Nếu output quá cũ, robot có thể hành động trên world state đã lỗi thời.

### 2) Điều gì làm một vision system deploy được?

Không chỉ accuracy mà còn là calibration, synchronization, confidence handling, observability, và fallback behavior an toàn.

### 3) Vì sao nhiều failure của robotics CV thực ra là system failure?

Vì calibration, timestamp, phần cứng bị xê dịch, và environment shift thường phá deploy ngay cả khi model bản thân nó vẫn mạnh.
