# Design Patterns (Mẫu Thiết kế)

## Tổng quan
**Design Patterns** không phải là công thức nấu ăn mà bạn phải thuộc lòng từng bước. Chúng là **những giải pháp đã được chứng minh** cho các vấn đề phổ biến trong lập trình. 

Đừng cố "nhét" Design Pattern vào code chỉ để khoe trình độ. Hãy dùng chúng khi thực sự cần giải quyết một bài toán về sự linh hoạt hoặc mở rộng.

---

## 1. Nhóm Creational (Khởi tạo) - "Tạo Object sao cho khéo?"

### 1.1. Singleton
**Ý tưởng:** Đảm bảo một Class chỉ có duy nhất 1 bản thể (instance).
- **Ví dụ:** Connection Pool kết nối Database. Bạn không muốn mỗi request lại tạo một connection mới làm sập server.
- **Phỏng vấn:** Spring Beans mặc định là Singleton để tiết kiệm tài nguyên.

### 1.2. Builder
**Ý tưởng:** Xây dựng đối tượng phức tạp theo từng bước.
- **Ví dụ:** Order một ly trà sữa. `Trà sữa + Trân châu + 50% đường + 100% đá`. 
- **Lợi ích:** Tránh tình trạng Constructor có 20 tham số, nhìn vào không biết cái nào là cái nào.

---

## 2. Nhóm Structural (Cấu trúc) - "Lắp ghép các Object thế nào?"

### 2.1. Adapter
**Ý tưởng:** Biến interface này thành interface kia để dùng được với nhau.
- **Ví dụ:** Tích hợp thư viện thanh toán PayPal vào web của bạn. Interface của PayPal không khớp với code cũ, bạn viết một cái "đầu chuyển" (Adapter) ở giữa.

### 2.2. Proxy (Rất hay hỏi)
**Ý tưởng:** Một đối tượng đứng ra làm "đại diện" để kiểm soát quyền truy cập.
- **Ví dụ:** Giám đốc (Object thật) bận, Thư ký (Proxy) đứng ra nhận lịch hẹn, kiểm tra xem khách có lịch chưa (Security/Validation).
- **Ứng dụng:** `@Transactional` trong Spring. Spring tạo một Proxy bao quanh hàm của bạn để tự động mở/đóng transaction mà bạn không cần viết code thủ công.

---

## 3. Nhóm Behavioral (Hành vi) - "Giao tiếp với nhau sao cho mượt?"

### 3.1. Observer
**Ý tưởng:** Một đối tượng thay đổi, tất cả các đối tượng "đăng ký" theo dõi nó đều được cập nhật.
- **Ví dụ:** Nút Follow trên Facebook. Khi tôi đăng bài, tất cả bạn bè (Observer) đều nhận được thông báo.

### 3.2. Strategy
**Ý tưởng:** Tách rời phần thuật toán ra khỏi đối tượng, giúp bạn thay đổi "chiêu thức" linh hoạt lúc đang chạy.
- **Ví dụ:** Hệ thống tính phí vận chuyển. Nông thôn tính một kiểu, Thành phố tính một kiểu, Giao hỏa tốc tính một kiểu. Bạn chỉ cần lắp "chiến lược" tương ứng vào là xong.

---

## Câu hỏi phỏng vấn "Chốt hạ"

> **Q: "Tại sao người ta nói Design Patterns có thể làm hại code?"**
>
> **Trả lời:** 
> "Đó là khi lập trình viên lạm dụng chúng (Over-engineering). Thay vì viết một đoạn code đơn giản, họ cố nhồi nhét Factory, Strategy, Decorator vào khiến code trở nên 'vụn vặt' và khó đọc một cách không cần thiết. Design Pattern sinh ra để giải quyết sự phức tạp, chứ không phải để tạo thêm sự phức tạp."

---

## Tóm tắt đi phỏng vấn
- **Singleton:** Duy nhất.
- **Builder:** Xây từng bước.
- **Adapter:** Đầu chuyển.
- **Proxy:** Đại diện / Ăn chặn.
- **Observer:** Đăng ký nhận tin.
- **Strategy:** Thay đổi chiến thuật linh hoạt.
