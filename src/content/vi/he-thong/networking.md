# Networking

### Các khái niệm Networking quan trọng

| Khái niệm | Mô tả |
|---|---|
| **Firewall** | Kiểm soát lưu lượng mạng vào và ra dựa trên security rules |
| **NAT (Network Address Translation)** | Chuyển đổi địa chỉ IP private sang public (và ngược lại) |
| **CORS (Cross-Origin Resource Sharing)** | Cơ chế bảo mật browser; backend phải cho phép rõ ràng cross-origin requests |
| **DNS (Domain Name System)** | Dịch domain names (google.com) sang IP addresses |
| **CDN (Content Delivery Network)** | Mạng lưới server phân bố để phân phối nội dung tĩnh (static content) |

---

### OSI Model

| Layer | Số | Protocols | Chức năng |
|---|---|---|---|
| **Application** | 7 | HTTP, HTTPS, WebSocket, FTP, DNS, SMTP | Giao diện end-user |
| **Presentation** | 6 | TLS/SSL, JPEG, PNG, JSON | Định dạng data, mã hóa |
| **Session** | 5 | NetBIOS, RPC, PPTP | Quản lý session |
| **Transport** | 4 | TCP, UDP | Truyền data đáng tin cậy |
| **Network** | 3 | IP, ICMP, OSPF, BGP | Routing, định địa chỉ logic |
| **Data Link** | 2 | Ethernet, Wi-Fi, ARP | Địa chỉ vật lý (MAC) |
| **Physical** | 1 | Cables, hubs, signals | Truyền vật lý |

---

### Application Layer Protocols

#### HTTP / HTTPS

```
HTTP Methods:
  GET     - Lấy resource
  POST    - Tạo resource
  PUT     - Thay thế resource
  PATCH   - Cập nhật một phần
  DELETE  - Xóa resource
```

| Status Code | Ý nghĩa | Ví dụ |
|---|---|---|
| **2xx** | Thành công | 200 OK, 201 Created, 204 No Content |
| **3xx** | Redirection | 301 Moved Permanently, 304 Not Modified |
| **4xx** | Client Error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests |
| **5xx** | Server Error | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout |

#### WebSocket

- **Full-duplex:** Giao tiếp hai chiều realtime qua một TCP connection duy nhất
- **Persistent:** Connection giữ open cho đến khi client hoặc server đóng
- **Use cases:** Ứng dụng chat, dashboard realtime, gaming, công cụ cộng tác

```javascript
const ws = new WebSocket('wss://api.example.com/live');

ws.onopen = () => {
  console.log('Connected to WebSocket server');
  ws.send(JSON.stringify({ type: 'subscribe', channel: 'price_updates' }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

ws.onclose = () => {
  console.log('Connection closed');
};
```

#### RPC (Remote Procedure Call)

- **Mục đích:** Giao tiếp service-to-service với latency thấp
- **Khái niệm:** Gọi một function trên remote server như thể nó là local
- **Formats:** gRPC (binary, dùng Protocol Buffers), Thrift, JSON-RPC

---

### Transport Layer Protocols

| Protocol | Đặc điểm | Trường hợp sử dụng |
|---|---|---|
| **TCP** | Connection-oriented, đáng tin cậy, ordered delivery, flow control | Web, APIs, email, file transfer, databases |
| **UDP** | Connectionless, nhanh, không đảm bảo delivery, không ordering | Streaming, gaming, VoIP, DNS queries, video calls |

#### TCP vs. UDP

| Khía cạnh | TCP | UDP |
|---|---|---|
| **Kết nối** | Hướng kết nối (3-way handshake) | Không kết nối |
| **Độ tin cậy** | Đảm bảo delivery | Best-effort, không đảm bảo |
| **Thứ tự** | Gói tin đến đúng thứ tự | Không đảm bảo thứ tự |
| **Tốc độ** | Chậm hơn (overhead) | Nhanh hơn (minimal overhead) |
| **Flow Control** | Có | Không |
| **Congestion Control** | Có | Không |
| **Header Size** | 20+ bytes | 8 bytes |

---

### Network Layer Protocols

| Protocol | Mục đích |
|---|---|
| **IP (IPv4/IPv6)** | Định địa chỉ thiết bị và routing packet |
| **ICMP** | Diagnostic và error reporting (ping, traceroute) |
| **ARP** | Ánh xạ IP addresses sang MAC addresses trong mạng local |
| **OSPF** | Interior gateway protocol cho routing trong autonomous system |
| **BGP** | Border Gateway Protocol — routing giữa các autonomous systems |

---

### DNS (Domain Name System)

#### DNS Record Types

| Record Type | Mục đích | Ví dụ |
|---|---|---|
| **A** | IPv4 address mapping | `example.com -> 93.184.216.34` |
| **AAAA** | IPv6 address mapping | `example.com -> 2606:2800:220:1::` |
| **CNAME** | Alias đến domain khác | `www.example.com -> example.com` |
| **MX** | Mail server | `example.com -> mail.example.com` |
| **TXT** | SPF, DKIM, verification | `v=spf1 include:_spf.example.com ~all` |
| **NS** | Name server delegation | `example.com -> ns1.example.com` |

#### DNS Resolution Flow

```
Client → Resolver (ISP/8.8.8.8)
       → Root DNS Server (.)
       → TLD Server (.com)
       → Authoritative NS (example.com)
       → A Record returned
```

> **Lưu ý:** DNS records có **TTL (Time To Live)** kiểm soát thời gian resolvers cache kết quả. TTL thấp = lookups thường xuyên hơn nhưng propagation thay đổi nhanh hơn.

---

### HTTP/1.1 vs. HTTP/2 vs. HTTP/3

| Tính năng | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|---|
| **Transport** | TCP | TCP | UDP (QUIC) |
| **Multiplexing** | Không (head-of-line blocking) | Có | Có |
| **Nén Header** | Không | HPACK | QPACK |
| **Server Push** | Không | Có | Có |
| **Mã hóa** | Tùy chọn | TLS bắt buộc | TLS bắt buộc |
| **Tái sử dụng kết nối** | Một request mỗi kết nối | Multiplexed streams | Stream-based |

---

### CIDR (Classless Inter-Domain Routing)

| Ký hiệu | Dải địa chỉ | Số lượng IP |
|---|---|---|
| `/32` | Một IP duy nhất | 1 |
| `/24` | Mạng nhỏ | 256 |
| `/16` | Mạng trung bình | 65,536 |
| `/8` | Mạng lớn | 16,777,216 |
| `10.0.0.0/8` | Private (RFC 1918) | 16,777,216 |
| `172.16.0.0/12` | Private (RFC 1918) | 1,048,576 |
| `192.168.0.0/16` | Private (RFC 1918) | 65,536 |

> **Tip:** Trong phỏng vấn system design, hiểu HTTP status codes, sự khác nhau giữa TCP và UDP, và cách DNS hoạt động là những chủ đề thường được hỏi.
