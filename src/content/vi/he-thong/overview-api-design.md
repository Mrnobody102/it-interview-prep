# Thiết kế API (API Design)

## Tổng quan

**API (Application Programming Interface)** là "cây cầu" để phần mềm này nói chuyện với phần mềm khác. Một thiết kế API tốt giống như một bản hợp đồng rõ ràng, giúp:

- **Dễ dùng** cho developer (nhìn là biết cách gọi).
- **Không phá client cũ** khi bạn mở rộng hoặc nâng cấp tính năng.
- **Bảo mật tốt** hơn.
- **Phản hồi nhanh** và dễ dàng scale (mở rộng hệ thống).

### Đọc nhanh 3 kiểu API phổ biến

- **REST**: Chuẩn mực phổ biến nhất. Phù hợp cho các thao tác CRUD (Tạo, Đọc, Sửa, Xóa).
- **GraphQL**: Giống như bạn đi ăn buffet, muốn gắp món nào thì gắp, gắp bao nhiêu thì gắp. Client chỉ lấy đúng dữ liệu mình cần, không thừa không thiếu.
- **gRPC**: Giống như hai nhân viên mật vụ nói chuyện bằng bộ đàm mật mã nội bộ, cực kỳ nhanh và gọn, nhưng người ngoài (như trình duyệt web) nghe sẽ không hiểu. Chuyên dùng cho các service nội bộ giao tiếp với nhau.

### So sánh các kiểu API

| Khía cạnh | REST | GraphQL | gRPC |
|---|---|---|---|
| **Kiến trúc** | Dựa trên tài nguyên (Resource-based). | Dựa trên truy vấn (Query-based). | Dựa trên hợp đồng (Contract-based). |
| **Định dạng dữ liệu** | Thường là JSON. | JSON | Nhị phân (Protocol Buffers). |
| **HTTP method** | Dùng chuẩn GET, POST, PUT, PATCH, DELETE | Thường chỉ dùng một endpoint POST duy nhất | HTTP/2 POST |
| **Over-fetching (Dư thừa)** | Có thể bị (Gọi lấy danh sách nhưng trả về cả nội dung dài ngoằng) | Không (Bạn chỉ định cái gì, nó trả về cái đó) | Không |
| **Under-fetching (Thiếu)** | Có thể bị (Gọi lấy danh sách bài viết xong phải gọi tiếp 10 lần API để lấy avatar tác giả) | Không (Gộp vào 1 query) | Không |
| **Đọc bằng mắt** | Rất dễ (JSON) | Rất dễ (JSON) | Khó (Binary) |
| **Hiệu năng** | Tốt | Tốt | Cực kì nhanh nhẹ |
| **Phù hợp cho** | Public API, Web thông thường | Mobile App, Frontend phức tạp | Microservices gọi nhau nội bộ |

---

## REST (Representational State Transfer)

REST là lựa chọn "quốc dân" hiện nay.

#### Các nguyên tắc (Constraints) của REST:
1. **Client-server**: Giao diện và dữ liệu hoàn toàn tách biệt.
2. **Stateless**: Server không nhớ trạng thái của client. Mỗi request gửi lên phải kèm đủ vé (token/context) để server biết bạn là ai. (Giống như mua vé xe bus từng chặng).
3. **Cacheable**: Dữ liệu trả về có thể được lưu cache.
4. **Uniform interface**: Cấu trúc URL đồng nhất và theo quy chuẩn.

#### Ví dụ REST:
```http
GET    /api/users          -- Lấy danh sách users
GET    /api/users/123      -- Lấy user có ID 123
POST   /api/users          -- Tạo user mới
PUT    /api/users/123      -- Thay thế toàn bộ thông tin user 123
PATCH  /api/users/123      -- Chỉ cập nhật một phần (ví dụ đổi mật khẩu)
DELETE /api/users/123      -- Xóa user 123
```

---

## GraphQL

Ra đời từ Facebook để giải quyết vấn đề nghẽn mạng trên thiết bị di động do REST trả về quá nhiều dữ liệu dư thừa.

#### Ví dụ dễ hiểu:
Frontend chỉ cần hiển thị `name` và `email` của User. Nếu gọi REST `/api/users/123`, nó có thể trả về cả tuổi, địa chỉ, lịch sử mua hàng (rất nặng). Với GraphQL, bạn tự viết "đơn đặt hàng":

```graphql
# Gửi cái này lên Server: "Cho tôi xin name và email của user 123"
query {
  user(id: "123") {
    name
    email
  }
}
```

```json
// Server trả về đúng 2 trường đó:
{
  "data": {
    "user": {
      "name": "Alice",
      "email": "alice@example.com"
    }
  }
}
```

---

## gRPC (Google Remote Procedure Call)

Được Google tạo ra. Nó không dùng JSON dạng văn bản (text) cồng kềnh, mà dùng **Protocol Buffers (Protobuf)** để nén dữ liệu thành chuỗi nhị phân (binary) cực kỳ nhỏ gọn.

- Nó chạy trên **HTTP/2**, cho phép gửi nhiều dữ liệu song song cực nhanh.
- Bạn phải định nghĩa một "hợp đồng" (file `.proto`) mà cả client và server đều biết để có thể giải mã đoạn nhị phân kia thành dữ liệu.

```protobuf
// Định nghĩa hợp đồng user.proto
syntax = "proto3";

service UserService {
  rpc GetUser(GetUserRequest) returns (User);
}

message User {
  string id = 1;
  string name = 2;
}

message GetUserRequest {
  string id = 1;
}
```

---

## Thực hành tốt (Best Practices) cho REST API

Khi đi làm hoặc phỏng vấn, tuân thủ các quy tắc này sẽ cho thấy bạn là một kỹ sư "cứng tay".

### 1. Quy ước đặt tên URL

| Quy tắc | Cứng (Tốt) | Non (Xấu) |
|---|---|---|
| **Dùng danh từ, không dùng động từ** | `GET /users`, `POST /orders` | `GET /getUsers`, `POST /createOrder` |
| **Dùng số nhiều** | `GET /users/123` | `GET /user/123` |
| **Cấu trúc cha con rõ ràng** | `/users/{id}/orders` | `/getUserOrders?id=` |
| **Dùng chữ thường và gạch ngang** | `/user-profiles` | `/userProfiles` |

### 2. Sử dụng HTTP Status Code chuẩn

| Code | Ý nghĩa | Khi nào dùng |
|---|---|---|
| **200 OK** | Mọi thứ ổn | Lấy dữ liệu thành công. |
| **201 Created** | Tạo xong | Vừa POST thành công một dữ liệu mới. |
| **204 No Content** | Thành công nhưng không có gì để trả về | Xóa (DELETE) thành công. |
| **400 Bad Request** | Lỗi dữ liệu gửi lên | Khách gửi thiếu email, sai định dạng. |
| **401 Unauthorized** | Lỗi đăng nhập | Chưa gửi token, hoặc token hết hạn. |
| **403 Forbidden** | Lỗi quyền hạn | Đã đăng nhập nhưng cố vào vùng của Admin. |
| **404 Not Found** | Không tìm thấy | ID không tồn tại trên hệ thống. |
| **500 Internal Error**| Lỗi hệ thống | Code bị bug (NullPointerException...). |

### 3. Versioning (Đánh phiên bản)
Hệ thống lớn luôn có lúc phải nâng cấp API mà không làm chết các app cũ chưa kịp update.
- **Cách tốt nhất:** Gắn version vào thẳng URL (`/api/v1/users` và `/api/v2/users`). Rất dễ nhìn và dễ debug.

### 4. Cấu trúc trả về lỗi (Error Format) chuẩn mực
Đừng bao giờ chỉ trả về chữ "Lỗi". Hãy trả về cục JSON rõ ràng để frontend biết đường hiển thị cho khách:
```json
{
  "error": {
    "code": "INVALID_EMAIL",
    "message": "Email sai định dạng.",
    "details": "Bạn bị thiếu chữ @ trong email.",
    "timestamp": "2026-03-20T10:30:00Z"
  }
}
```

---

## Phân trang (Pagination)

Nếu hệ thống có hàng triệu User, bạn không thể GET trả về 1 triệu user một lúc. Phải phân trang!

1. **Offset-based (Truyền thống):** `?page=2&limit=20`. Rất dễ làm, nhưng nhược điểm là khi dữ liệu quá lớn (ví dụ trang 100000), database quét sẽ bị chậm.
2. **Cursor-based (Tiên tiến):** Trả về `nextCursor`. Lần sau client gửi cái cursor đó lên để lấy tiếp. Tốc độ cực kì nhanh dù dữ liệu lên tới hàng tỷ dòng (Facebook, Twitter đều dùng cách này cho newfeed).

---

## Tài liệu API (API Documentation)
Làm API xong phải có tài liệu cho Front-end đọc. Đừng dùng Excel/Word. Hãy dùng **Swagger (OpenAPI)** để tự động sinh ra trang giao diện test API cực xịn xò.

> **💡 Mẹo phỏng vấn:** Thiết kế API không chỉ là code cho chạy được. Người phỏng vấn sẽ để ý xem bạn có tuân thủ quy tắc đặt tên không, có xài đúng chuẩn mã 200/400/500 không. Hãy luôn nhớ thiết kế sao cho "thằng Frontend" dễ tích hợp nhất!
