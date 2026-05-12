# Nguyên lý DRY (Don't Repeat Yourself)

## 1. Khái niệm cốt lõi

**DRY - "Đừng lặp lại chính mình"**. 
Nguyên lý này phát biểu rằng: **Mọi mảng kiến thức, logic nghiệp vụ chỉ nên có ĐÚNG MỘT nguồn chân lý duy nhất trong toàn bộ hệ thống.**

**Ví dụ thực tế:** 
Giống như số điện thoại Hotline của công ty bạn. Đừng in số Hotline lên 100 trang web khác nhau bằng tay. Hãy lưu số đó vào 1 biến tên là `COMPANY_HOTLINE`. 
Tại sao? Vì lỡ ngày mai công ty đổi số điện thoại, bạn chỉ cần sửa ở 1 chỗ duy nhất, thay vì phải đi tìm 100 trang web kia để sửa từng cái (và chắc chắn bạn sẽ bỏ sót).

---

## 2. Các "Tội ác" vi phạm DRY phổ biến

### 2.1. Copy-Paste Code (Tội ác tày trời)

Khi bạn thấy 2 đoạn code giống hệt nhau ở 2 file khác nhau, 99% là bạn đã vi phạm DRY.

```typescript
// ❌ Vi phạm DRY: Copy-paste công thức tính thuế VAT
function calculateLaptopPrice(price: number) {
    return price + (price * 0.1); // VAT 10%
}

function calculateMousePrice(price: number) {
    return price + (price * 0.1); // VAT 10%
}
```
👉 **Hậu quả:** Nhà nước tăng thuế VAT lên 12%. Bạn sửa hàm Laptop nhưng quên sửa hàm Mouse. Gây thiệt hại tài chính!

**✅ Cách sửa:**
```typescript
const VAT_RATE = 0.1;

function applyTax(price: number) {
    return price + (price * VAT_RATE);
}

function calculateLaptopPrice(price: number) { return applyTax(price); }
```

### 2.2. Viết cứng "Magic Number / Magic String"

```typescript
// ❌ Vi phạm DRY: Hardcode chuỗi
if (user.role === 'SUPER_ADMIN') { ... }
if (role === 'SUPER_ADMIN') { ... } // Viết rải rác khắp nơi

// ✅ Sửa lại: Dùng Hằng số (Constant) hoặc Enum
export const ROLES = { SUPER_ADMIN: 'SUPER_ADMIN' };
if (user.role === ROLES.SUPER_ADMIN) { ... }
```

---

## 3. Lời nguyền WET (Write Everything Twice / We Enjoy Typing)

Trái ngược với DRY là **WET** (Tự chép lại mọi thứ). Code WET làm tăng gấp đôi chi phí bảo trì và dễ sinh ra Bug ẩn.

| Tiêu chí | DRY | WET |
|---|---|---|
| **Sửa Bug** | Sửa 1 nơi, fix toàn hệ thống | Sửa 1 nơi, lòi ra lỗi ở 3 nơi khác |
| **Bảo trì** | Nhẹ nhàng | Ác mộng |
| **Dung lượng code** | Ngắn gọn | Dài thòng lòng |

---

## 4. Chống chỉ định (Khi nào KHÔNG nên DRY?)

Đi phỏng vấn mà nói "Lúc nào em cũng xài DRY" là rớt đài! **Lạm dụng DRY (Over-DRYing) là một thảm họa.**

> **Quy tắc Vàng:** Nếu 2 đoạn code TRÔNG CÓ VẺ giống nhau, nhưng tương lai chúng sẽ THAY ĐỔI VÌ 2 LÝ DO KHÁC NHAU, thì KHÔNG ĐƯỢC GỘP CHÚNG LẠI!

**Ví dụ:**
Hàm tính `Lương cho Giám đốc` và hàm tính `Lương cho Bảo vệ` hiện tại vô tình giống y chang nhau là `Lương Cơ Bản * 1.5`. 
Đừng vì thấy giống nhau mà gộp thành 1 hàm `TinhLuongChung()`. Vì tháng sau sếp buồn buồn đổi cách tính lương Giám đốc, bạn vào sửa hàm chung đó sẽ làm lương Bảo vệ bị sai theo. Hãy để nguyên 2 hàm WET trong trường hợp này!

> **💡 Mẹo:** Chấp nhận WET ở lần đầu tiên. Lần thứ 2 vẫn có thể châm chước. Nhưng đến lần thứ 3 copy-paste, hãy nghiêm túc suy nghĩ đến việc Refactor thành hàm dùng chung. (Quy tắc Rule of Three).
