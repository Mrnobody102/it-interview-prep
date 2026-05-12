# Message Queue (Hàng đợi tin nhắn)

### Tổng quan

**Message Queue (MQ)** giống hệt như **Hòm thư trước nhà** hoặc **Khay đựng hồ sơ ở bưu điện**. 
Thay vì bạn (Người gửi) phải đứng chờ đưa tận tay bức thư cho người nhận, bạn chỉ việc vứt thư vào hòm rồi đi làm việc khác. Người nhận khi nào rảnh sẽ ra hòm lấy thư về đọc và xử lý. Hai bên hoàn toàn **tách biệt (decoupled)** và không cần chờ đợi nhau.

**Ví dụ thực tế kinh điển:** 
Khi User bấm nút "Đăng ký tài khoản", hệ thống cần làm 2 việc: Lưu User vào Database (mất 0.1 giây) và Gửi Email chào mừng (mất tới 3 giây).
Nếu bắt User đứng đợi 3.1 giây mới hiện thông báo thành công thì rất chậm.
👉 **Giải pháp:** API chỉ lưu User vào DB, sau đó ném một tờ giấy (Message) có ghi *"Gửi email cho bạn A nhé"* vào Message Queue. Xong! Báo thành công cho User luôn. Ở phía sau, một hệ thống khác sẽ từ từ thò tay vào Queue lấy tờ giấy đó ra và đi gửi email.

```text
User -> Bấm Đăng ký -> (0.1s) -> Trả về "Thành công"
                           |
                           v
                     Message Queue (Chứa thư) -> Worker (3s) -> Gửi Email
```

### Tại sao hệ thống lớn bắt buộc phải có Message Queue?

- **Hấp thụ tải (Traffic Burst):** Ngày Black Friday có 1 triệu đơn hàng ùa vào cùng lúc. Nếu nhét hết vào Database thì DB sập ngay. Thay vì thế, ta nhét 1 triệu đơn vào Queue (rất nhanh và trâu). Sau đó Backend cứ túc tắc lôi từng đơn ra xử lý, xử lý đến đâu DB lưu đến đó. Hệ thống sẽ sống khỏe!
- **Tách rời hệ thống (Decoupling):** Dịch vụ gửi Email bị sập mạng? Không sao, các yêu cầu gửi email vẫn nằm im trong Queue. Chờ khi mạng có lại, hệ thống sẽ tiếp tục gửi, không bị mất dữ liệu.

---

### Khái niệm cốt lõi

| Thuật ngữ | Ý nghĩa dễ hiểu |
|---|---|
| **Producer (Publisher)** | Người viết thư và nhét vào hòm. (Bên tạo việc). |
| **Consumer (Subscriber)**| Người lấy thư ra để đọc và làm theo. (Bên xử lý việc). |
| **Message** | Tờ giấy/bức thư ghi công việc cần làm (Dữ liệu). |
| **Broker** | Cái bưu điện (Phần mềm quản lý Queue như RabbitMQ, Kafka). |

---

### 2 Mô hình gửi tin chính: Point-to-point vs. Pub/Sub

| Mô hình | Cách hoạt động & Ví dụ |
|---|---|
| **Point-to-Point (Queue truyền thống)** | **Giống như gửi tin nhắn Zalo 1-1.** Tờ giấy ném vào Queue chỉ được lấy ra bởi **1 Consumer duy nhất**. Lấy xong là mất. Dùng để chia đều công việc: Có 100 đơn hàng, 5 nhân viên cứ chia nhau mỗi người lôi ra vài đơn để xử lý. |
| **Pub/Sub (Publish/Subscribe)** | **Giống như Đài phát thanh.** Người nói (Publisher) nói trên đài 1 lần, nhưng có cả triệu cái Radio (Consumer) mở đúng kênh đó (Topic) để nghe cùng 1 thông tin. Dùng khi 1 sự kiện xảy ra nhưng cần báo cho nhiều nơi. (VD: Có đơn hàng mới -> Vừa báo cho kho, vừa báo cho kế toán, vừa báo cho hệ thống điểm thưởng). |

---

### Chọn loại Message Queue nào? (Câu hỏi phỏng vấn kinh điển)

Thị trường có rất nhiều MQ, nhưng nổi bật nhất là cuộc chiến giữa **RabbitMQ** và **Apache Kafka**.

| Khía cạnh | RabbitMQ (Message Broker) | Apache Kafka (Event Streaming) |
|---|---|---|
| **Ví dụ vui** | Giống **Bưu điện truyền thống**. Thư giao xong, xác nhận đã nhận là **xé bỏ thư luôn**. | Giống **Cuốn băng ghi âm**. Ai nghe xong thì thôi, cuốn băng vẫn nằm đó không mất đi. |
| **Khả năng "Nghe lại" (Replay)** | Không thể. Xử lý xong là xóa. | Rất mạnh. Dữ liệu lưu lại nhiều ngày. Một hệ thống mới xây có thể kết nối vào và đọc lại toàn bộ dữ liệu từ tháng trước. |
| **Tốc độ (Throughput)** | Vài chục ngàn tin/giây. | Khủng khiếp (Hàng triệu tin/giây). Sinh ra để hứng Big Data. |
| **Ứng dụng phù hợp nhất** | Làm hàng đợi công việc (Task Queue) như: Xử lý hóa đơn, gửi SMS, gửi Email. | Xử lý luồng dữ liệu thời gian thực (Log của web, theo dõi click chuột, đồng bộ DB). |

Ngoài ra còn có:
- **AWS SQS:** Đẩy lên AWS dùng luôn, khỏi phải cài đặt bảo trì. Cực kì phổ biến nếu công ty xài hạ tầng Amazon.
- **Redis (Pub/Sub hoặc Streams):** Rất nhẹ, dùng tạm cho hệ thống nhỏ hoặc ứng dụng chat, nhưng độ tin cậy không cao bằng 2 ông lớn kia.

---

### Các vấn đề "Đau đầu" khi dùng Message Queue

Khi đi phỏng vấn, người ta không hỏi bạn cài đặt Queue thế nào, mà hỏi cách bạn xử lý sự cố.

#### 1. Xử lý tin nhắn rác: Dead Letter Queue (DLQ)
Nếu hệ thống gửi email bị lỗi code, nó đọc tờ giấy ra, xử lý lỗi, lại ném ngược vào Queue, rồi lại lôi ra xử lý lỗi... tạo thành vòng lặp vô tận.
👉 **Giải pháp:** Nếu tờ giấy xử lý lỗi quá 3 lần, ném nó vào một thùng rác đặc biệt gọi là **Dead Letter Queue (DLQ)**. Kỹ sư sẽ vào DLQ đó xem tay để fix bug.

#### 2. Tính Idempotent (Chống làm đúp)
Hệ thống mạng bị chập chờn, khiến một tờ giấy "Trừ tiền" bị kẹt và gửi lại 2 lần. Làm sao để không trừ tiền khách 2 lần?
👉 **Giải pháp (Idempotency):** Trong tờ giấy luôn có ID của giao dịch (VD: `tx_123`). Trước khi trừ tiền, phải tra DB xem `tx_123` đã được xử lý chưa. Nếu có rồi thì vứt tờ giấy đó đi, không trừ nữa!

#### 3. Mức độ cam kết gửi tin (Delivery Semantics)
- **At-most-once (Chỉ gửi 1 lần):** Gửi xong là kệ, mất cũng chịu. (Dành cho việc ko quan trọng như log hệ thống).
- **At-least-once (Ít nhất 1 lần):** Cứ gửi lại liên tục cho đến khi bên kia "Dạ em nhận được rồi" mới thôi. Chắc chắn không mất tin, nhưng nguy cơ bị trùng lặp (Duplicate). Đa số các hệ thống chọn cách này và dùng kỹ thuật Idempotent ở trên để chống trùng.

> **💡 Mẹo chốt:** Nếu phỏng vấn hỏi *"Dùng MQ để làm gì?"*, hãy dùng từ khóa **Bất đồng bộ (Asynchronous)** và **Hấp thụ tải (Traffic Burst)**. Đó là 2 vũ khí mạnh nhất của MQ.
