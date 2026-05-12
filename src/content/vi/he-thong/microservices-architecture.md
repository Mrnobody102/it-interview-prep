# Kiến trúc Microservices (Kiến trúc vi dịch vụ)

## Tổng quan

Khác với Monolithic (nhét mọi thứ vào 1 cục), **Microservices** là việc chẻ nhỏ hệ thống lớn thành hàng chục, hàng trăm các **Dịch vụ siêu nhỏ (Service)**. Mỗi Service tự lo một việc duy nhất, có Database riêng, có thể dùng ngôn ngữ lập trình riêng và tự sống sót độc lập.

**Ví dụ thực tế:**
Giống như một **Khu Food Court (Khu ẩm thực) trong siêu thị**. 
Thay vì 1 cái bếp khổng lồ, ta tách ra thành: Quầy trà sữa, Quầy phở, Quầy gà rán...
- Quầy phở có tủ lạnh riêng (Database riêng), thợ nấu riêng (Ngôn ngữ lập trình riêng).
- Khách hàng đến quầy nào mua quầy đó, hoặc có người đi mua hộ (API Gateway).

---

### Điểm mạnh (Tại sao công ty lớn thích dùng?)

- **Mở rộng cục bộ (Independent Scaling):** 
  - Khách kéo đến mua trà sữa quá đông. Bạn chỉ việc thuê thêm 5 nhân viên pha trà sữa (Scale up service Trà sữa), còn quầy phở vẫn giữ nguyên 1 người bán. Tiết kiệm tài nguyên!
- **Cô lập lỗi (Fault Isolation):** 
  - Quầy phở lỡ làm cháy bếp. Quầy phở đóng cửa. Cả khu Food Court vẫn bình yên vô sự, khách vẫn mua trà sữa uống bình thường. (Nếu là Monolith thì cháy bếp là cả nhà hàng nghỉ bán).
- **Tự do công nghệ (Polyglot):** 
  - Quầy phở dùng bếp gas (Java), quầy trà sữa dùng máy lạnh (NodeJS), quầy data dùng Python. Chẳng ai ép ai, miễn là nấu ra đồ ăn.
- **Tự chủ nhóm (Team Autonomy):** 
  - Team 5 người code Service Thanh Toán cứ việc tự do Deploy bất cứ lúc nào, không cần chờ Team Đặt Hàng xin phép.

---

### Điểm yếu (Mặt tối của Microservices)

Chớ thấy Netflix dùng mà ham. Microservices đem lại những cơn ác mộng về vận hành:

- **Chi phí quản lý khổng lồ (DevOps Complexity):**
  - Giờ bạn có 50 cái services chạy trên 50 cái máy chủ (hoặc Docker Container). Bạn cần có đội ngũ DevOps xịn để quản lý Kubernetes, chứ code xong không biết cách cho lên mạng.
- **Độ trễ mạng (Network Latency):**
  - Khách mua 1 tô phở và 1 ly trà sữa. Thay vì đầu bếp quay sang lấy nước đưa luôn (In-memory của Monolith), khách phải chạy bộ từ quầy phở sang quầy trà sữa (Gọi API qua mạng). Tốn thời gian!
- **Rắc rối với Dữ liệu phân tán (Distributed Data):**
  - Quầy phở có sổ nợ riêng, quầy trà sữa có sổ nợ riêng. Làm sao để tổng kết nợ của 1 khách hàng? (Đòi hỏi các pattern khó như Saga, Eventual Consistency).

---

### Làm sao để các Service nói chuyện với nhau?

Khi tách ra, chúng phải "giao tiếp" qua mạng lưới. Có 2 cách chính:

| Mô hình | Cơ chế hoạt động | Ví dụ |
|---|---|---|
| **Đồng bộ (Synchronous)** | **Gọi điện thoại trực tiếp:** Gọi điện bắt bên kia phải trả lời ngay. Nếu bên kia bận máy (chết) thì lỗi luôn. Thường dùng REST API hoặc gRPC. | Service Giỏ hàng gọi REST API sang Service Thanh Toán để lấy số dư. Phải lấy được số dư mới cho mua tiếp. |
| **Bất đồng bộ (Asynchronous)** | **Gửi tin nhắn (Message Queue):** Gửi giấy note vào một cái bảng chung rồi đi làm việc khác. Bên kia lúc nào rảnh thì ra bảng lấy giấy note về làm. | Khách đặt hàng xong, bắn 1 Event "ĐƠN_MỚI" vào Kafka. Service Gửi Email tự bắt Event đó để đi gửi thư, Service Đặt Hàng không cần quan tâm. |

---

### Các "bảo bối" bắt buộc phải có khi chơi Microservices

Để vận hành được Food Court, ban quản lý siêu thị cần lắp đặt các hệ thống:

1. **API Gateway (Cổng bảo vệ):** Khách không được tự ý xông thẳng vào các quầy, mà phải qua cổng chính. Cổng này kiểm tra vé (Authentication), chống spam (Rate Limiting) rồi mới chỉ đường cho khách vào đúng quầy.
2. **Service Discovery (Danh bạ):** Khu vực quá rộng, các quầy thường xuyên đổi chỗ (Server đổi IP). Phải có 1 cái bảng chỉ dẫn điện tử để báo "Quầy trà sữa đang ở số mấy" cho mọi người biết.
3. **Message Broker:** Hệ thống loa phát thanh (Kafka, RabbitMQ) để các quầy liên lạc với nhau.
4. **Distributed Tracing (Máy quay theo dõi):** Gắn mã số (Trace ID) vào tay khách hàng từ lúc vào cửa. Để nếu khách phàn nàn "Đồ ăn lâu quá", bảo vệ check camera (Zipkin, Jaeger) xem khách bị kẹt ở quầy phở hay quầy trà sữa.

---

### Khi nào thì NÊN chọn Microservices?

> **💡 Mẹo phỏng vấn:** Đừng bao giờ khuyên công ty dùng Microservices nếu:
> - Team chỉ có 3 người.
> - Dự án mới khởi nghiệp (Startup), chưa biết sống chết ra sao.
> - Nghiệp vụ quá đơn giản, lượng truy cập vài trăm người.

**Hãy dùng nó khi:**
- Công ty có 50+ kỹ sư, họ giẫm chân lên code của nhau liên tục.
- Hệ thống bị quá tải ở một tính năng cụ thể (Ví dụ tính năng Export PDF) và cần scale riêng tính năng đó.
- Cần áp dụng nhiều ngôn ngữ lập trình cho nhiều bài toán đặc thù khác nhau.
