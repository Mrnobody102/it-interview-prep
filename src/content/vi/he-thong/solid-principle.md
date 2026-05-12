# SOLID Principles (5 Nguyên Tắc Vàng)

## 1. Tổng quan

**SOLID** là 5 nguyên tắc thiết kế hướng đối tượng được sáng lập bởi **"Uncle Bob"** (Robert C. Martin). Thuộc nằm lòng SOLID không chỉ giúp bạn qua vòng phỏng vấn mà còn giúp bạn viết ra những dòng code **Dễ đọc, dễ bảo trì, dễ mở rộng và ít lỗi**.

Hãy nhớ mẹo này: SOLID giống như **Luật giao thông**. Không tuân thủ thì xe vẫn chạy được, nhưng sớm muộn gì cũng gây tai nạn liên hoàn!

| Chữ cái | Tên Nguyên tắc | Ý nghĩa dân dã |
|-----|-----------|---------|
| **S** | Single Responsibility | 🔪 **Con dao Thái**: Chỉ dùng để thái thịt, đừng lấy ra gọt bưởi hay chặt xương. Một class chỉ làm duy nhất 1 việc. |
| **O** | Open/Closed | 🧩 **Đồ chơi Lego**: Muốn xây thêm cái mái nhà, chỉ việc đắp thêm khối Lego mới (Mở rộng), không cần đập cả móng nhà đi xây lại (Sửa đổi). |
| **L** | Liskov Substitution | 🐧 **Chim cánh cụt**: Lớp con (Cánh cụt) thay thế Lớp cha (Chim) thì không được gây lỗi (Cánh cụt không biết bay!). |
| **I** | Interface Segregation | 🖨️ **Máy in**: Máy in thì chỉ có nút IN, đừng bắt khách hàng phải xem cả nút FAX nếu họ không cần. |
| **D** | Dependency Inversion | 🔌 **Ổ cắm điện**: Cắm sạc điện thoại qua ổ cắm tường (Interface), đừng có dại mà nối dây điện trực tiếp vào lõi đồng của điện thoại (Concrete Class). |

---

## 2. S - Single Responsibility Principle (SRP)
**Nguyên tắc Đơn Trách Nhiệm**

> Một class chỉ nên có **một lý do duy nhất** để thay đổi.

**❌ Ví dụ sai (Thập cẩm):**
Class `UserManager` vừa làm nhiệm vụ _Lưu User vào DB_, vừa _Validate Email_, vừa _Gửi Email chào mừng_.
👉 Lỗi: Nếu sếp đổi nhà cung cấp gửi Email, bạn phải vào hàm quản lý User để sửa? Vô lý!

**✅ Ví dụ đúng (Tách bạch):**
Chia thành 3 class: `UserRepository` (chỉ chuyên lưu DB), `UserValidator` (chỉ chuyên check lỗi), `EmailService` (chỉ chuyên gửi mail). Ai làm việc nấy!

---

## 3. O - Open/Closed Principle (OCP)
**Nguyên tắc Đóng / Mở**

> Code phải **MỞ để mở rộng** (thêm tính năng mới), nhưng **ĐÓNG để sửa đổi** (không sửa code cũ đã chạy ngon).

**❌ Ví dụ sai (Sửa hoài):**
Hàm `ThanhToan(loại_thẻ)`. Nếu là thẻ VISA thì gọi code Visa. Sếp yêu cầu thêm thanh toán MoMo, bạn phải chui vào hàm này thêm một lệnh `if (loại_thẻ == MoMo)`. Mai mốt thêm ZaloPay, VNPay lại phải chui vào sửa tiếp. Càng sửa càng dễ gây bug cho code cũ!

**✅ Ví dụ đúng (Dùng Interface/Strategy):**
Tạo một Interface `IPaymentMethod` có hàm `pay()`.
Viết class `VisaPayment` và `MoMoPayment` implement Interface đó. 
Hệ thống chính chỉ cần gọi `paymentMethod.pay()`. Lần sau muốn thêm VNPay? Cứ tạo class `VNPayPayment` mới, hệ thống chính **không cần sửa một dấu phẩy nào**!

---

## 4. L - Liskov Substitution Principle (LSP)
**Nguyên tắc Thay thế Liskov**

> Lớp con phải **thay thế hoàn toàn** được lớp cha mà **không làm chết chương trình**.

**❌ Ví dụ kinh điển (Chim Cánh Cụt):**
Bạn có class cha là `Chim` có hàm `bay()`.
Bạn tạo class `ChimCanhCut` kế thừa từ `Chim`. Vì cánh cụt không biết bay, nên hàm `bay()` của nó bạn throw ra lỗi `NotSupportedException`.
Hậu quả: Một hàm khác yêu cầu truyền vào 1 con `Chim` rồi gọi hàm `bay()`. Nếu vô tình truyền `ChimCanhCut` vào, chương trình văng lỗi sập ngay!

**✅ Cách sửa:**
Tách ra. Class cha là `Chim` (chỉ có hàm ăn, ngủ). Interface `LoaiBayDuoc` (có hàm bay). Chim Đại Bàng thì kế thừa `Chim` + implement `LoaiBayDuoc`. Cánh Cụt thì chỉ kế thừa `Chim`.

---

## 5. I - Interface Segregation Principle (ISP)
**Nguyên tắc Phân tách Interface**

> Đừng ép một class phải implement những hàm mà nó **không bao giờ dùng tới**.

**❌ Ví dụ sai (Bắt ép):**
Bạn tạo 1 Interface `MayDaNang` có 3 hàm: `in()`, `scan()`, `fax()`.
Một công ty mua cái máy in rẻ tiền (chỉ biết in) về, class `MayInGiaRe` bị ép implement `MayDaNang`. Vậy 2 hàm `scan()` và `fax()` nó phải bỏ trống hoặc văng lỗi.

**✅ Ví dụ đúng (Chia nhỏ):**
Tách thành 3 Interface nhỏ xíu: `IPrinter`, `IScanner`, `IFax`. 
Máy in xịn thì implement cả 3. Máy in rẻ tiền thì chỉ implement `IPrinter`. Gọn gàng sạch sẽ!

---

## 6. D - Dependency Inversion Principle (DIP)
**Nguyên tắc Đảo ngược Phụ thuộc**

> Module cấp cao không được phụ thuộc vào Module cấp thấp. Cả hai phải phụ thuộc vào **Abstraction (Interface)**.

**❌ Ví dụ sai (Hàn chết dây điện):**
Class `OrderService` (cấp cao) khai báo thẳng `MySQLDatabase db = new MySQLDatabase()` (cấp thấp) để lưu đơn hàng.
👉 Lỗi: Nếu ngày mai công ty chuyển sang dùng MongoDB, bạn phải đập bỏ `OrderService` viết lại toàn bộ.

**✅ Ví dụ đúng (Dùng Ổ cắm điện):**
`OrderService` chỉ khai báo 1 cái ổ cắm (Interface) là `IDatabase`. Nó không cần biết đằng sau ổ cắm là điện gió hay điện hạt nhân.
Lúc khởi chạy, ta "cắm" `MySQLDatabase` (class đã implement `IDatabase`) vào `OrderService`. Mai mốt đổi sang `MongoDB`, chỉ việc "rút phích cắm" đổi sang class khác. Khái niệm này chính là cốt lõi của **Dependency Injection (DI)** trong Spring Boot hay NestJS!

---

## 7. Lời khuyên phỏng vấn (Bonus)

> **Hỏi: Việc vi phạm SOLID có làm chết dự án không?**
>
> **Đáp:** Dự án nhỏ (vài ngàn dòng code) viết kiểu gì cũng chạy được. Nhưng khi dự án lớn lên (hàng triệu dòng code, chục team cùng làm), nếu không có SOLID: 
> 1. Fix 1 bug ở module A sẽ làm lòi ra 3 bug ở module B (vì dính lùm xùm vi phạm SRP và DIP).
> 2. Muốn thêm 1 tính năng mới phải đi sửa 10 file cũ (vì vi phạm OCP).
> SOLID chính là loại "vắc xin" phòng bệnh ung thư code!
