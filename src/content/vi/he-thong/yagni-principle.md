# Nguyên lý YAGNI (You Aren't Gonna Need It)

## 1. Khái niệm cốt lõi

**YAGNI - "Bạn sẽ chẳng bao giờ cần tới nó đâu!"**
Đây là nguyên tắc vàng khuyên bạn: **Tuyệt đối KHÔNG viết code, KHÔNG thiết kế thêm tính năng cho những dự định "phòng hờ tương lai" trừ khi nó thực sự cần thiết NGAY BÂY GIỜ.**

**Ví dụ thực tế:** 
Khách hàng thuê bạn làm một trang web nhỏ bán áo thun cho người trong xóm. Bạn tự nhủ: *"Lỡ sau này web nổi tiếng toàn thế giới thì sao?"*. Thế là bạn bỏ ra 2 tháng trời để thiết kế Database chịu tải 1 triệu người/giây, hỗ trợ đa ngôn ngữ Anh, Pháp, Tây Ban Nha, và tích hợp thanh toán bằng Bitcoin "cho tương lai". 
👉 **Kết quả:** Web ế sưng mỏ, chả ai thèm vào. Tính năng Bitcoin và Đa ngôn ngữ rỉ sét không bao giờ được xài. Bạn vừa lãng phí 2 tháng cuộc đời một cách vô ích!

---

## 2. Vì sao "Thiết kế phòng hờ" lại là một thảm họa?

- **Lãng phí thời gian và tiền bạc:** Xây dựng tính năng không ai dùng là đốt tiền của công ty.
- **Tăng độ phức tạp:** Thêm code nghĩa là thêm rác. Rác làm hệ thống cồng kềnh, khó đọc và khó bảo trì.
- **Thử nghiệm không được:** Code viết ra "cho tương lai" thường không được test tử tế ở hiện tại, khi tương lai đến (nếu có), nó chắc chắn sẽ chứa đầy Bug.
- **Dự đoán thường sai:** Khách hàng đổi ý nhanh như người yêu cũ lật mặt. Thứ bạn nghĩ "sau này sẽ cần" thường khác xa 180 độ so với thực tế phát sinh.

---

## 3. Các "Dấu hiệu đỏ" vi phạm YAGNI

Hãy giật mình tỉnh ngộ nếu bạn đang viết những dòng code có mùi sau:

### 3.1. Code bị Comment lại "Để dành"
```typescript
// function sendFax() {
//    Đoạn này tạm khóa lại, lỡ sếp yêu cầu chức năng Fax thì mở ra xài.
// }
```
👉 **Sửa ngay:** Xóa mẹ nó đi! Đã có Git lưu trữ lịch sử rồi, cần thì lục lại Commit cũ. Đừng để rác chướng mắt trong file code.

### 3.2. Cấu trúc quá rườm rà (Over-engineering)
Chỉ để in ra dòng chữ "Hello", bạn tạo ra 1 Interface, 1 Factory, 1 Dependency Injector... vì nghĩ "Lỡ sau này cần in thêm nhiều chữ khác".
👉 **Sửa ngay:** Viết đúng lệnh `console.log("Hello")` và đi uống cà phê.

### 3.3. Các tham số ma (Ghost Parameters)
```typescript
// Thêm biến useBitcoin dù hiện tại chỉ hỗ trợ Credit Card
function processPayment(amount: number, useBitcoin: boolean = false) { ... }
```

---

## 4. Sự Xung Đột Giữa SOLID và YAGNI?

Nhiều người nói SOLID bắt phải tạo Interface để dễ mở rộng (Open/Closed), còn YAGNI lại bảo đừng làm. Vậy nghe ai?

> **Bí kíp phỏng vấn:** Bí quyết nằm ở **Thời điểm (Timing)**.
> - **YAGNI** khuyên bạn: Đừng vội tạo Interface NGAY BÂY GIỜ nếu bạn chỉ có đúng 1 loại thanh toán (Ví dụ: Thẻ Tín Dụng). Cứ viết thẳng class cho nhanh.
> - **SOLID** xuất hiện khi TƯƠNG LAI ĐÃ ĐẾN: Ngày mai sếp bắt thêm thanh toán MoMo. Lúc này sự kiện mở rộng đã CHẮC CHẮN xảy ra. Bây giờ bạn mới Refactor code, rút Interface ra để tuân thủ SOLID.
> 
> **Kết luận:** Hãy code đơn giản (YAGNI) cho đến khi sự thay đổi ập đến mặt bạn, lúc đó hãy dùng kiến trúc (SOLID) để giải quyết!

---

## 5. Tóm tắt nhanh bộ ba: DRY - KISS - YAGNI

Để trả lời lưu loát trong phỏng vấn, hãy nhớ 3 câu ngắn này:

| Nguyên lý | Tóm tắt | Câu hỏi để tự kiểm tra bản thân khi code |
|---|---|---|
| **DRY** | Không chép phạt. | *"Đoạn code này mình đã copy paste ở đâu chưa?"* |
| **KISS** | Đừng làm quá lên. | *"Đứa thực tập sinh đọc hàm này có hiểu không?"* |
| **YAGNI** | Không lo xa vô ích. | *"Sếp có bắt buộc làm tính năng này NGAY BÂY GIỜ không?"* |
