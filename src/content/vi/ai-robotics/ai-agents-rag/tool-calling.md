# Tool Calling, APIs & Structured Actions

## Tổng quan

Tool use biến language model từ một text generator thuần thành một thành phần có thể tác động lên hệ thống bên ngoài.

Điều đó có nghĩa hệ phải định nghĩa rõ:

- tools được phép dùng
- argument schema
- validation rules
- execution boundaries

---

## Vì sao Tool Calling quan trọng

Tool calling phù hợp hơn free-form output khi hệ cần:

- truy vấn dữ liệu có cấu trúc
- gọi APIs
- kích hoạt planners hoặc controllers
- thực hiện tính toán xác định
- phát ra machine-readable actions

Nó giảm ambiguity và tạo contract rõ hơn giữa reasoning với execution.

---

## Thiết kế Tool tốt

Các nguyên tắc hữu ích:

- tool hẹp, scope rõ
- typed arguments tường minh
- preconditions rõ ràng
- safe defaults và validation
- idempotent behavior nếu có thể

Tool tệ là tool mơ hồ, quá mạnh, và khó validate.

---

## Tool Failure Modes

Các vấn đề phổ biến:

- argument hallucination
- chọn sai tool
- chain quá nhiều call mong manh
- thiếu retry hoặc fallback logic
- tool có side effects nguy hiểm

Đó là lý do tool use phải được xem như systems engineering chứ không phải prompt trick.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao tool calling an toàn hơn free-form generation?

Vì nó ép model vào structured actions có thể validate trước khi thực thi.

### 2) Tool schema tốt cần gì?

Mục đích rõ ràng, typed arguments, fields dễ validate, và hành vi có thể dự đoán.

### 3) Vì sao nên giới hạn tool permissions?

Vì tool quá mạnh làm tăng hậu quả của model mistakes, prompt injection, hoặc quyết định orchestration sai.
