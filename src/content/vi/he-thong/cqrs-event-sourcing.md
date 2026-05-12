# CQRS & Event Sourcing (Kiến trúc Nâng cao)

## 1. Tổng quan

**CQRS** (Tách biệt Trách nhiệm Đọc - Ghi) và **Event Sourcing** (Lưu vết sự kiện) là "cặp bài trùng" đắc lực trong các hệ thống phân tán siêu lớn (Microservices, Ngân hàng, Sàn thương mại điện tử). Chúng sinh ra để giải quyết bài toán: **Khi dữ liệu quá khổng lồ, làm sao đọc cho lẹ mà ghi vẫn an toàn?**

---

## 2. CQRS (Command Query Responsibility Segregation)

### Vấn đề của mô hình truyền thống (CRUD)
Bình thường, chúng ta hay dùng duy nhất **1 Database** và **1 Model** cho cả việc Đọc (SELECT) và Ghi (INSERT, UPDATE).
Nhưng thực tế: **Lượng Đọc luôn gấp 100 lần lượng Ghi.**
- Khách hàng lướt xem hàng chục món đồ (Đọc), nhưng chỉ bấm Mua (Ghi) 1 lần.
- Nếu bạn lấy cái Database đang bận rộn tính toán tiền nong (Ghi) ra để phục vụ việc search text (Đọc) thì hệ thống sẽ chậm rì!

### Giải pháp của CQRS
CQRS chia đôi hệ thống thành 2 nửa hoàn toàn biệt lập:
- **Nửa Ghi (Command):** Chỉ làm nhiệm vụ Insert/Update. Thường dùng SQL Database (MySQL, PostgreSQL) để đảm bảo tính toàn vẹn dữ liệu (ACID).
- **Nửa Đọc (Query):** Chỉ làm nhiệm vụ Select. Dữ liệu từ nửa Ghi sẽ được đồng bộ (đồng bộ ngầm) sang một Database riêng chuyên để đọc. Thường dùng NoSQL (MongoDB) hoặc Search Engine (Elasticsearch) để tìm kiếm cực nhanh.

**Ví dụ thực tế:** 
Giống như quy trình làm việc của một Toà soạn báo.
- **Nửa Ghi:** Các nhà báo viết bài, chỉnh sửa, kiểm duyệt trên một phần mềm quản lý nội bộ rất nghiêm ngặt (Command).
- **Nửa Đọc:** Khi bài viết được xuất bản, nó được đẩy ra một trang web tĩnh đọc siêu nhanh cho hàng triệu độc giả xem (Query). Độc giả không thọc tay vào hệ thống nội bộ của tòa soạn!

### Câu hỏi phỏng vấn CQRS
> **Hỏi: Nhược điểm lớn nhất của CQRS là gì?**
> **Đáp:** Là sự "Chậm tiêu" (Eventual Consistency). Vì Database Ghi và Đọc là 2 cái máy khác nhau, khi bạn vừa đổi Avatar (Ghi xong), hệ thống cần tốn vài giây để đồng bộ sang DB Đọc. Nếu bạn F5 ngay lập tức, bạn có thể vẫn thấy Avatar cũ. Khách hàng phải chấp nhận sự "Chậm tiêu" này.

---

## 3. Event Sourcing (Nguồn gốc Sự kiện)

### Vấn đề của cách lưu trữ truyền thống (State-based)
Bình thường, ta chỉ lưu **Trạng thái hiện tại (Current State)** của dữ liệu.
Ví dụ: Đơn hàng ORD-123 có `status = "ĐÃ HỦY"`.
Hỏi: "Thế trước khi bị hủy nó là gì? Ai hủy? Hủy lúc nào?" -> Chịu! Mất dấu lịch sử!

### Giải pháp của Event Sourcing
Thay vì lưu trạng thái cuối cùng, **ta lưu toàn bộ lịch sử các hành động (Sự kiện - Events)**. Từ các sự kiện này, ta có thể "cộng dồn" lại để suy ra trạng thái hiện tại.

**Ví dụ thực tế kinh điển:** 
**Sổ tiết kiệm Ngân hàng**.
Ngân hàng KHÔNG BAO GIỜ chỉ lưu con số: "Tài khoản A có 1 tỷ". 
Ngân hàng lưu sổ cái:
1. Giao dịch 1: Nạp 500 triệu.
2. Giao dịch 2: Chuyển khoản cho bạn B đi 100 triệu.
3. Giao dịch 3: Nhận lương 600 triệu.
-> Nếu muốn biết số dư hiện tại, hệ thống lấy `500 - 100 + 600 = 1000` (1 tỷ).

### Lợi ích to lớn
- **Không bao giờ mất dữ liệu:** Bạn có 100% bằng chứng lịch sử để kiểm toán (Audit Trail). Rất quan trọng cho ngành tài chính, y tế.
- **Du hành thời gian (Time Travel):** Sếp hỏi "Báo cáo doanh thu lúc 3 giờ chiều hôm qua", bạn chỉ việc "Tua lại" (Replay) cuốn băng ghi sự kiện đến đúng 3h chiều và xuất báo cáo.
- **Fix Bug thần thánh:** Lỡ code bị lỗi tính sai tiền cả tháng nay? Không sao! Cập nhật lại công thức tính, rồi bấm Replay lại toàn bộ Sự kiện từ đầu tháng, số tiền sẽ được tính lại chuẩn xác!

---

## 4. Khi CQRS kết hợp với Event Sourcing (CQRS + ES)

Đây là cặp bài trùng mạnh nhất nhưng cũng phức tạp nhất.

1. **Người dùng bấm Mua Hàng (Command).**
2. Hệ thống Ghi không lưu trạng thái đơn hàng, mà ném 1 sự kiện `OrderCreated` vào **Event Store (Kho sự kiện)**. (Đây là Event Sourcing).
3. Kho sự kiện báo tin cho hệ thống Đọc qua Message Queue (Kafka).
4. Hệ thống Đọc (Query) nhận được tin, lập tức cập nhật bảng "Danh sách đơn hàng" trong MongoDB để chuẩn bị cho người dùng xem. (Đây là CQRS).

---

## 5. Chốt hạ cho Phỏng vấn

> **Hỏi: Khi nào thì KHÔNG NÊN xài CQRS/Event Sourcing?**
> **Đáp:** Tránh xa CQRS và Event Sourcing nếu hệ thống chỉ là dạng **CRUD cơ bản** (Thêm, sửa, xóa bài viết/sản phẩm đơn giản) và chưa gặp vấn đề nghẽn cổ chai về hiệu năng. Áp dụng chúng sẽ làm đội chi phí DevOps, làm code phức tạp lên gấp chục lần và gây nhức đầu vì lỗi "Chậm tiêu" (Eventual Consistency) mà không đem lại giá trị thực tế nào.
