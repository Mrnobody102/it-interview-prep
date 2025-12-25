import { Category } from "./types";

export const systemDesign: Category = {
  id: "system-design",
  name: { vi: "Thiết kế hệ thống", en: "System Design" },
  description: {
    vi: "Chủ đề mid → senior → lead",
    en: "Topic for mid → senior → lead",
  },
  icon: "🏗️",
  topics: [
    // ===== I. OVERVIEW =====
    {
      id: "overview",
      name: { vi: "I. Overview", en: "I. Overview" },
      expanded: true,
      subtopics: [
        {
          id: "computer-architecture",
          name: { vi: "Computer Architecture", en: "Computer Architecture" },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Computer Architecture (disk, storage, RAM, Cache, CPU)</span>

<br>

- **Khi khởi động chương trình:** Dữ liệu và mã lệnh được tải từ **Storage** lên **RAM**.

- **CPU xử lý:** Kiểm tra **Cache** trước, nếu **cache hit** thì lấy ngay, nếu **cache miss** thì lấy từ **RAM**, nếu không có trong **RAM**, nạp từ **storage (SSD/HDD)**

- **Kết quả xử lý:** Có thể ghi vào **RAM** (tạm thời), sau đó lưu lại vào **Storage** nếu cần lâu dài.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Computer Architecture (disk, storage, RAM, Cache, CPU)</span>

<br>

- **When starting program:** Data and code are loaded from **Storage** to **RAM**.

- **CPU processing:** Check **Cache** first, if **cache hit** then take immediately, if **cache miss** then take from **RAM**, if not in **RAM**, load from **storage (SSD/HDD)**

- **Processing result:** Can write to **RAM** (temporary), then save to **Storage** if long-term storage needed.`,
          },
        },
        {
          id: "production-app-architecture",
          name: {
            vi: "Production App Architecture",
            en: "Production App Architecture",
          },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Production App Architecture</span>

<br>

## a. **Frontend**

- Triển khai trên CDN để tăng tốc độ tải và giảm tải cho backend (React.js, Next.js build thành static file).

- Sử dụng HTTPS, CSP (Content Security Policy - chống XSS, clickjacking, data injection) để bảo vệ người dùng.

## b. **Backend**

- Xây dựng dạng microservices (Spring Boot, Node.js), mỗi service đảm nhận một chức năng riêng biệt.

- API Gateway: định tuyến, xác thực (authentication), giới hạn rate (rate limiting).

## c. **Database**

- Sử dụng RDBMS (PostgreSQL, MySQL) hoặc NoSQL (MongoDB, Redis) tùy trường hợp.

- Cấu hình replication, backup và restore thường xuyên.

- Đảm bảo phân quyền truy cập, mã hóa dữ liệu nhạy cảm.

## d. **Caching Layer**

- Redis/Memcached để giảm tải cho database, tăng tốc độ đáp ứng cho các truy vấn phổ biến.

## e. **Message Queue/Event Streaming**

- Kafka, RabbitMQ để xử lý các tác vụ nền (background jobs), truyền tải sự kiện giữa các service.

## f. **File Storage & Static Assets**

- Sử dụng dịch vụ cloud storage (AWS S3, Google Cloud Storage) cho ảnh, video, file lớn.

## g. **DevOps & CI/CD**

- Docker container hóa ứng dụng, Kubernetes orchestration.

- CI/CD pipeline (Jenkins, GitHub Actions) tự động build/test/deploy.

- Infrastructure as Code (Terraform, Ansible).

## h. **Monitoring & Logging**

- Sử dụng các tool như Prometheus, Grafana, ELK Stack để giám sát, cảnh báo, phân tích lỗi.

## i. **Security**

- HTTPS, JWT/OAuth2 cho authentication/authorization.

- Quản lý secret (AWS Secret Manager, Githubs Secret Repo).

- Thường xuyên kiểm tra OWASP Top 10.

## j. **High Availability & Scalability**

- Load balancer (Nginx, HAProxy), auto-scaling group.

- Multi-region deployment (nếu cần).`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Production App Architecture</span>

<br>

## a. **Frontend**

- Deploy on CDN to increase loading speed and reduce backend load (React.js, Next.js build as static file).

- Use HTTPS, CSP (Content Security Policy - prevent XSS, clickjacking, data injection) to protect users.

## b. **Backend**

- Build microservices (Spring Boot, Node.js), each service handles specific function.

- API Gateway: routing, authentication, rate limiting.

## c. **Database**

- Use RDBMS (PostgreSQL, MySQL) or NoSQL (MongoDB, Redis) as needed.

- Configure replication, backup and restore regularly.

- Ensure access control, encrypt sensitive data.

## d. **Caching Layer**

- Redis/Memcached to reduce database load, increase response speed for common queries.

## e. **Message Queue/Event Streaming**

- Kafka, RabbitMQ to handle background jobs, event streaming between services.

## f. **File Storage & Static Assets**

- Use cloud storage services (AWS S3, Google Cloud Storage) for images, videos, large files.

## g. **DevOps & CI/CD**

- Docker containerization, Kubernetes orchestration.

- CI/CD pipeline (Jenkins, GitHub Actions) auto build/test/deploy.

- Infrastructure as Code (Terraform, Ansible).

## h. **Monitoring & Logging**

- Use tools like Prometheus, Grafana, ELK Stack to monitor, alert, analyze errors.

## i. **Security**

- HTTPS, JWT/OAuth2 for authentication/authorization.

- Secret management (AWS Secret Manager, GitHub Secret Repo).

- Regularly check OWASP Top 10.

## j. **High Availability & Scalability**

- Load balancer (Nginx, HAProxy), auto-scaling group.

- Multi-region deployment (if needed).`,
          },
        },
        {
          id: "design-requirements",
          name: { vi: "Design Requirements", en: "Design Requirements" },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Design Requirements</span>

<br>

## a. **Xác định yêu cầu của khách hàng thế nào?**

Xác định rõ yêu cầu chức năng và phi chức năng:

- **Scalability:** Có thể mở rộng để phục vụ nhiều user.

- **Performance:** Đáp ứng nhanh, latency thấp.

- **Availability:** Đảm bảo uptime cao, ít downtime.

- **Security:** Bảo mật dữ liệu, xác thực, phân quyền.

- **Maintainability:** Dễ sửa, dễ nâng cấp.

- **Reliability:** Hoạt động ổn định, ít lỗi.

- **Cost:** Giới hạn chi phí triển khai/vận hành.

- **Compliance:** Tuân thủ quy định pháp luật.

Xác định các ràng buộc quan trọng về nghiệp vụ - business (giảm chi phí, tăng số lượng user...), ràng buộc kĩ thuật (dùng công nghệ nào) và ràng buộc về tích hợp với các hệ thống khác.

Đề xuất giải pháp, hướng tiếp cận dựa trên yêu cầu đó.

## b. **Nguyên lý CAP**

Là nguyên lý quan trọng trong thiết kế hệ thống phân tán.

CAP stands for:

- **Consistency** tức là mọi node trong hệ thống đều nhất quán về dữ liệu tại một thời điểm.

- **Availability** là hệ thống luôn sẵn sàng đáp ứng mọi request.

- **Partition Tolerance** là khả năng chịu phân mảnh mạng, tức là hệ thống vẫn hoạt động (không bị sập toàn bộ) khi có sự cố các node không liên lạc được với nhau do chia cắt mạng.

Một hệ thống phân tán chỉ có thể đảm bảo 2 trong 3 yếu tố trên cùng một lúc.

Trong thực tế luôn phải đảm bảo Partition Tolerance do sự cố mạng là không thể tránh khỏi.

Còn việc ưu tiên CP hay AP tùy thuộc vào tính chất của hệ thống phân tán, ví dụ ngân hàng ưu tiên tính nhất quán chọn CP, mạng xã hội ưu tiên tính sẵn sàng (dữ liệu cập nhật chậm một chút cũng không sao) chọn AP.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Design Requirements</span>

<br>

## a. **How to understand customer requirements?**

Identify functional and non-functional requirements clearly:

- **Scalability:** Can expand to serve many users.

- **Performance:** Fast response, low latency.

- **Availability:** High uptime, minimal downtime.

- **Security:** Data security, authentication, authorization.

- **Maintainability:** Easy to fix, easy to upgrade.

- **Reliability:** Stable operation, few errors.

- **Cost:** Limited deployment/operation costs.

- **Compliance:** Legal compliance.

Identify important constraints about business (reduce costs, increase users...), technical constraints (what technology to use), and constraints about integration with other systems.

Propose solutions, approach based on requirements.

## b. **CAP Theorem**

Important principle in distributed system design.

CAP stands for:

- **Consistency** means all nodes in the system have consistent data at any point in time.

- **Availability** means the system is always ready to respond to requests.

- **Partition Tolerance** is the ability to withstand network partitions, meaning the system still operates (not completely down) when nodes cannot communicate due to network partition.

A distributed system can only guarantee 2 out of 3 factors at the same time.

In practice, must always ensure Partition Tolerance because network failures are unavoidable.

Whether to prioritize CP or AP depends on the nature of the distributed system.

For example, banks prioritize consistency and choose CP, social media prioritizes availability (slight data update delay is acceptable) and choose AP.`,
          },
        },
        {
          id: "networking",
          name: { vi: "Networking", en: "Networking" },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Networking</span>

<br>

## a. **Các khái niệm cần nhớ**

- **Firewall:** Kiểm soát, cho phép hoặc chặn luồng dữ liệu vào ra hệ thống hoặc thiết bị.

- **NAT - network address translation:** Kỹ thuật chuyển đổi địa chỉ IP trong mạng private sang IP công cộng (có thể dùng chung cho các thiết bị trong mạng nội bộ để tiết kiệm IP) và ngược lại.

- **CORS:** Cross-Origin Resource Sharing là cơ chế trình duyệt chặn truy cập tài nguyên từ domain khác. Nếu frontend và backend API ở hai domain, backend cần bật CORS để frontend gọi API và lấy dữ liệu.

## b. **Giao thức mạng theo tầng**

Có 7 tầng OSI nhưng thực tế developer chủ yếu quan tâm Application, Transport, Network.

Application Layer: Xử lý logic, giao tiếp user và app/service.

Giao thức:

- **HTTP/HTTPS:** Nền tảng web và API, cơ chế request/response, phương thức GET/POST/PUT/PATCH/DELETE, nhóm status code: 2xx thành công, 3xx chuyển hướng, 4xx lỗi client, 5xx lỗi server, HTTPS là HTTP kết hợp SSL/TLS để mã hóa.

- **FTP:** Truyền file.

- **SSH:** Truy cập server qua command.

- **SMTP:** Gửi email.

- **WebSocket:** Kết nối hai chiều real-time sau handshake.

- **RPC:** Giao tiếp microservices do latency thấp.

Transport Layer: Đảm bảo truyền dữ liệu từ nơi gửi đến nơi nhận.

Giao thức: TCP (kết nối tin cậy, thường dùng cho web/API), UDP (nhanh nhưng không tin cậy, dùng cho streaming, game).

Network Layer: Định tuyến dữ liệu qua các mạng.

Giao thức: IP (định danh địa chỉ thiết bị), ICMP (ping, kiểm tra kết nối), ARP (tìm MAC từ IP).`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Networking</span>

<br>

## a. **Key concepts to remember**

- **Firewall:** Control, allow, or block data flow in/out of a system or device.

- **NAT - network address translation:** Technique to convert private IP addresses to public IP (can be shared across internal devices to save IP space) and vice versa.

- **CORS:** Browser mechanism that blocks resource access from another domain. If frontend and backend APIs are on different domains, backend must enable CORS so frontend can call APIs and fetch data.

## b. **Network protocols by layer**

There are 7 OSI layers, but developers mostly care about Application, Transport, Network.

Application Layer: Handles logic and user ↔ app/service communication.

Protocols:

- **HTTP/HTTPS:** Foundation for web and APIs, request/response model, methods GET/POST/PUT/PATCH/DELETE, status code groups: 2xx success, 3xx redirect, 4xx client errors, 5xx server errors, HTTPS is HTTP plus SSL/TLS for encryption.

- **FTP:** File transfer.

- **SSH:** Server access via command.

- **SMTP:** Email.

- **WebSocket:** Real-time two-way connection between client and server after handshake.

- **RPC:** Service-to-service communication with low latency.

Transport Layer: Ensures data delivery from sender to receiver.

Protocols: TCP (reliable, common for web/APIs), UDP (fast but unreliable, used for streaming, gaming).

Network Layer: Routes data across networks.

Protocols: IP (device addressing), ICMP (ping, connectivity check), ARP (find MAC from IP).`,
          },
        },
        {
          id: "api-design",
          name: { vi: "API Design", en: "API Design" },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">API Design</span>

<br>

- Một thiết kế API tốt đảm bảo:

+ Đơn giản và nhất quán: Tất cả các endpoint đều có cấu trúc rõ ràng, đặt tên nhất quán, ví dụ như /users/{id}/orders để dễ dàng hiểu được chức năng và resource mà API cung cấp.

+ Tuân thủ chuẩn giao tiếp như RESTful, GraphQL, gRPC... Ví dụ đối với RESTful API: Sử dụng đúng các phương thức HTTP (GET, POST, PUT, DELETE…), Trả về đúng mã trạng thái HTTP (200, 201, 400, 404, 500…)

+ Dễ mở rộng, bảo trì: Versioning để dễ quản lý các phiên bản API: /v1/users, /v2/users

+ Tài liệu rõ ràng: Sử dụng Swagger/OpenAPI để tự động hóa và cập nhật tài liệu, giúp dev và đối tác dễ tích hợp, test API.

+ Bảo mật: Sử dụng HTTPS, xác thực qua JWT hoặc OAuth2, và kiểm soát quyền truy cập, hạn chế rate limit để bảo vệ API khỏi tấn công.

- Các mô hình API:

+ **REST:**

Stateless (không lưu trạng thái giữa các request, mỗi request là độc lập)

Sử dụng các HTTP method chuẩn như GET, POST, PUT, DELETE

Dễ bị over-fetching (lấy dư dữ liệu) hoặc under-fetching (lấy thiếu dữ liệu)

Trao đổi dữ liệu chủ yếu bằng JSON, dễ đọc cho con người

+ **GraphQL:**

Tránh được vấn đề over-fetching và under-fetching (client chỉ lấy đúng dữ liệu cần)

Tuy nhiên khó trong caching

Query dựa trên schema xác định kiểu dữ liệu rõ ràng

Query phức tạp có thể ảnh hưởng hiệu năng server

Chỉ dùng phương thức POST

Luôn trả về HTTP 200, nếu có lỗi sẽ nằm trong payload gửi về kèm

+ **gRPC:**

Xây dựng trên HTTP/2, hỗ trợ multiplexing và server push

Dùng Protocol Buffers để truyền dữ liệu, rất hiệu quả và tiết kiệm băng thông

Hiệu năng cao, phù hợp cho hệ thống lớn hoặc microservices

Dữ liệu ít thân thiện với con người, khó đọc trực tiếp

Yêu cầu môi trường/phần mềm hỗ trợ HTTP/2`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">API Design</span>

<br>

- Good API design ensures:

+ Simple and Consistent: All endpoints have clear structure, consistent naming, for example /users/{id}/orders to easily understand the function and resource the API provides.

+ Follow communication standards like RESTful, GraphQL, gRPC... For example, for RESTful API: Use correct HTTP methods (GET, POST, PUT, DELETE…), Return correct HTTP status codes (200, 201, 400, 404, 500…)

+ Easy to expand and maintain: Versioning to easily manage API versions: /v1/users, /v2/users

+ Clear documentation: Use Swagger/OpenAPI to automate and update documentation, help developers and partners easily integrate and test API.

+ Security: Use HTTPS, authenticate via JWT or OAuth2, and control access, limit rate limit to protect API from attacks.

- API Models:

+ **REST:**

Stateless (don't store state between requests, each request is independent)

Use standard HTTP methods like GET, POST, PUT, DELETE

Easy to over-fetch (get excess data) or under-fetch (get insufficient data)

Exchange data mainly via JSON, easy to read for humans

+ **GraphQL:**

Avoid over-fetching and under-fetching issues (client only gets needed data)

But hard to cache

Query based on schema that defines data types clearly

Complex queries can affect server performance

Only use POST method

Always return HTTP 200, if there are errors they will be in the payload sent back

+ **gRPC:**

Built on HTTP/2, supports multiplexing and server push

Use Protocol Buffers to transmit data, very efficient and save bandwidth

High performance, suitable for large systems or microservices

Data not human-friendly, hard to read directly

Requires environment/software that supports HTTP/2`,
          },
        },
        {
          id: "caching-cdn",
          name: { vi: "Caching & CDN", en: "Caching & CDN" },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Caching & CDNs</span>

<br>

- **Caching:**

Là việc lưu trữ tạm thời dữ liệu ở các tầng gần với người dùng hơn như trình duyệt, proxy hoặc server (redis) để phục vụ nhanh các request hay sử dụng.

Giảm truy vấn tới backend và db, tiết kiệm tài nguyên và tăng hiệu năng.

Áp dụng tốt cho REST vì dữ liệu thường ít thay đổi (không phù hợp GraphQL).

- **CDN:**

Là mạng lưới phân phối các máy chủ đặt ở nhiều nơi trên thế giới.

Lưu các file tĩnh như HTML, CSS, JS, ảnh để người dùng tải nhanh từ server gần nhất.

Giúp tăng tính high availability, giảm độ trễ khi yêu cầu tài nguyên và tăng bảo mật.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Caching & CDNs</span>

<br>

- **Caching:**

Temporarily store data in layers closer to users such as browser, proxy, or server (redis) to quickly serve frequently used requests.

Reduce queries to backend and db, save resources and increase performance.

Works well with REST because data usually changes infrequently (not suitable for GraphQL).

- **CDN:**

Network of distributed servers located in many places worldwide.

Stores files like HTML, CSS, JS, images so users load from nearest server.

Helps increase high availability, reduce latency, and increase security.`,
          },
        },
        {
          id: "proxy-server",
          name: { vi: "Proxy Server", en: "Proxy Server" },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Proxy Server</span>

<br>

Là thành phần trung gian giữa client và server, có vai trò chuyển tiếp request và response.

Chức năng chính:

- Ẩn IP thực của client hoặc server, tăng bảo mật.

- Lọc, kiểm soát, ghi log các truy cập.

- Cache dữ liệu tăng tốc truy cập cho client.

Hai loại chính:

- **Forward proxy:**

Đứng trước client (giữa client và internet).

Giúp ẩn IP của client khỏi các server ngoài, server chỉ thấy IP của proxy.

Thường dùng để kiểm soát truy cập web (chặn Facebook, Youtube) trong nội bộ công ty.

- **Reverse proxy:**

Đứng trước server (giữa server và internet).

Ẩn IP của server backend, client chỉ thấy IP của proxy.

Thường dùng để load balancing - phân phối đều request cho các server phía sau, xử lý mã hóa SSL giảm tải cho backend, caching hoặc nén dữ liệu trả về.

Các load balancer như Nginx, AWS ELB hay CDN như Cloudflare, AWS CloudFront cũng được coi là reverse proxy.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Proxy Server</span>

<br>

It is an intermediate component between client and server, with the role of forwarding requests and responses.

Main functions:

- Hide real IP of client or server, increase security.

- Filter, control, log access.

- Cache data to speed up access for client.

Two main types:

- **Forward proxy:**

Stands in front of client (between client and internet).

Helps hide client IP from outside servers, server only sees proxy IP.

Often used to control web access (block Facebook, Youtube) within company.

- **Reverse proxy:**

Stands in front of server (between server and internet).

Hides backend server IP, client only sees proxy IP.

Often used for load balancing - distribute requests evenly to backend servers, handle SSL encryption to reduce backend load, caching or compress returned data.

Load balancers like Nginx, AWS ELB or CDN like Cloudflare, AWS CloudFront are also considered reverse proxy.`,
          },
        },
        {
          id: "load-balancer-main",
          name: { vi: "Load Balancer", en: "Load Balancer" },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Load Balancer</span>

<br>

Là thành phần trung gian giúp phân phối đều lưu lượng request từ client đến nhiều server backend phía sau.

Ví dụ AWS Elastic Load Balancer, Nginx.

Mục tiêu là tối ưu hiệu năng, tăng tính chịu tải và đảm bảo hệ thống hoạt động ổn định.

Các loại LB:

- **Layer 4 (Transport):** Phân phối dựa trên địa chỉ IP, port (ví dụ: TCP, UDP). Nhanh hơn, phù hợp các dịch vụ không cần xử lý sâu về nội dung như cân bằng tải cho database, các ứng dụng TCP.

- **Layer 7 (Application):** Phân phối dựa trên nội dung HTTP/HTTPS, URL, cookie… (ví dụ: Nginx, HAProxy). Phù hợp cho web và API.

Các thuật toán LB chính:

- **Round Robin:** Chia đều theo lượt từng server.

- **Least Connection:** Ưu tiên server rảnh nhất (ít kết nối nhất).

- **IP Hash:** Dựa vào IP client, giữ session đảm bảo client luôn được chuyển đến 1 server cố định.

- **Weighted:** Chia theo sức mạnh từng server (gán trọng số cho từng server).

- **Sticky session:** Đối với hệ thống có cân bằng tải, nếu không dùng thuật toán IP hash nhưng vẫn muốn gắn 1 client với 1 server (ví dụ như lưu giỏ hàng, ứng dụng chat hoặc trạng thái đăng nhập trên các hệ thống cũ) thì dùng sticky session (được hỗ trợ trong hầu hết các LB như Nginx, HAProxy, AWS ELB). Nếu backend stateless, không lưu session trên backend mà lưu ở client hoặc lưu tập trung tại Redis/Memcached thì không cần dùng sticky session. Ví dụ như hiện nay các ứng dụng web đều dùng JWT, session được xác nhận thông qua token (lưu phía client), server không cần nhớ trạng thái của user, hay hệ thống microservices, session lưu trên Redis, mọi server đều truy cập được.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Load Balancer</span>

<br>

It is an intermediate component that helps distribute request traffic evenly from clients to multiple backend servers.

Examples: AWS Elastic Load Balancer, Nginx.

Objective is to optimize performance, increase load capacity and ensure system operates stably.

Main types of LB:

- **Layer 4 (Transport):** Distribute based on IP address, port (example: TCP, UDP). Faster, suitable for services that don't need deep content processing like database load balancing, TCP applications.

- **Layer 7 (Application):** Distribute based on HTTP/HTTPS content, URL, cookies (example: Nginx, HAProxy). Suitable for web and API.

Main LB algorithms:

- **Round Robin:** Distribute evenly in sequence to each server.

- **Least Connection:** Prioritize server with least connections.

- **IP Hash:** Based on client IP, keep session to ensure client always goes to one fixed server.

- **Weighted:** Distribute based on server power (assign weight to each server).

- **Sticky session:** For systems with load balancing, if not using IP hash algorithm but still want to bind one client to one server (for example saving cart, chat application or login status on old systems) then use sticky session (supported in most LBs like Nginx, HAProxy, AWS ELB). If backend is stateless, don't store session on backend but store on client or centrally on Redis/Memcached then don't need sticky session. For example, nowadays all web applications use JWT, session is verified through token (stored on client side), server doesn't need to remember user state, or microservices system, session stored on Redis, all servers can access it.`,
          },
        },
        {
          id: "message-queue-main",
          name: {
            vi: "Message Queue (Kafka, RabbitMQ, ActiveMQ)",
            en: "Message Queue (Kafka, RabbitMQ, ActiveMQ)",
          },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Message Queue (Kafka, RabbitMQ, ActiveMQ)</span>

<br>

Là thành phần trung gian giúp các hệ thống hoặc microservices giao tiếp bất đồng bộ với nhau, thông qua việc gửi và nhận thông điệp (message).

- **Giao tiếp bất đồng bộ:** Ví dụ khi người dùng đăng ký xong, hệ thống trả về thông báo thành công ngay. Việc gửi email xác nhận được gửi như một message vào MQ (Kafka, RabbitMQ...). Service chuyên gửi mail sẽ nhận message này và xử lý sau. Do vậy người dùng không cần chờ email gửi xong mới được đăng ký thành công.

- **Kafka:**

Có thể xử lý dữ liệu với thông lượng (throughput) lớn, tốc độ cao, lưu trữ message lâu dài (có thể đọc lại nhiều lần, replay lại message), được thiết kế để scale tốt phù hợp với hệ thống phân tán.

Phù hợp cho hệ thống cần nhiều sự kiện liên tục, như streaming log, phân tích dữ liệu realtime, hoặc nhận dữ liệu từ hàng ngàn thiết bị IoT.

- **RabbitMQ:**

Dễ dùng, triển khai nhanh, hỗ trợ nhiều giao thức, mạnh về hàng đợi nghiệp vụ. Message không được lưu trữ lâu dài như Kafka.

Phù hợp cho các ứng dụng cần xử lý bất đồng bộ như e-commerce, gửi email, thanh toán, nhập đơn hàng.

- **ActiveMQ:**

Tích hợp với hệ sinh thái Java.

Hỗ trợ nhiều kiểu giao tiếp như point-to-point, pub-sub.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Message Queue (Kafka, RabbitMQ, ActiveMQ)</span>

<br>

It is an intermediate component that helps systems or microservices communicate asynchronously with each other, through sending and receiving messages.

- **Asynchronous communication:** For example when user finishes registration, system returns success message immediately. The confirmation email sending is sent as a message to MQ (Kafka, RabbitMQ...). Email service will receive this message and process later. So user doesn't need to wait for email to be sent to complete registration.

- **Kafka:**

Can handle data with large throughput, fast speed, store messages long-term (can read multiple times, replay messages), designed to scale well suitable for distributed systems.

Suitable for systems that need continuous events, like streaming logs, real-time data analysis, or receive data from thousands of IoT devices.

- **RabbitMQ:**

Easy to use, quick deployment, support multiple protocols, strong in business queues. Messages are not stored long-term like Kafka.

Suitable for applications that need asynchronous processing like e-commerce, send email, payment, enter orders.

- **ActiveMQ:**

Integrated with Java ecosystem.

Support multiple communication types like point-to-point, pub-sub.`,
          },
        },
      ],
    },
    // ===== II. SCENARIO =====
    {
      id: "scenario",
      name: { vi: "II. Scenario", en: "II. Scenario" },
      expanded: true,
      subtopics: [
        {
          id: "design-millions-users",
          name: {
            vi: "Một hệ thống hàng triệu người dùng thiết kế thế nào? Những điểm quan trọng để tối ưu hệ thống đó.",
            en: "Design for millions of users? Key optimization points.",
          },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Một hệ thống hàng triệu người dùng thiết kế thế nào?</span>

<br>

- **Scale Horizontally:**

Triển khai nhiều instance backend (EC2, container, server vật lý) phía sau LB.

Stateless server: không lưu trạng thái trên server (JWT), session lưu ở cache ngoài (Redis).

- **Load Balancer:**

AWS ALB, Nginx, HAProxy.

Sử dụng health check để tự động loại instance lỗi khỏi hệ thống.

- **Database Scalability:**

Read Replica: ghi vào master/primary, đọc dữ liệu từ slave/replica database.

Sharding/Partitioning: chia dữ liệu thành nhiều phần nhỏ theo user, khu vực... tránh quá tải trên một node.

Connection Pooling: Hạn chế số lượng kết nối (tránh quá tải), tái sử dụng được kết nối nên tăng hiệu năng, tiết kiệm tài nguyên.

- **Caching:**

Cache tầng ứng dụng: Dùng Redis.

Cache tầng CDN (AWS CloudFront).

- **Xử lý bất đồng bộ (Asynchronous Processing):**

Queue/ Message Broker: Kafka, RabbitMQ, SQS, ActiveMQ.

Worker pool: tăng số thread để xử lý song song.

- **High Availability & Fault Tolerance:**

Triển khai đa vùng (multi-zone, multi-region): nếu 1 vùng gặp sự cố, các vùng khác vẫn hoạt động.

Auto-Scaling: Tự động tăng giảm số lượng instance dựa vào tải thực tế.

Replica, backup: Đảm bảo dữ liệu không mất khi server/db có sự cố.

- **Connection Management:**

Hạn chế timeout, tối ưu giữ kết nối lâu (keep-alive), dùng connection pool, áp dụng cho cả backend và database.

Rate limiting: hạn chế số request của mỗi user/IP trên một đơn vị thời gian để bảo vệ hệ thống.

- **Monitoring, Logging, Alerting:**

Realtime monitoring: Theo dõi chỉ số CPU, RAM, IOPS (số lượng thao tác đọc ghi IO trên giây), số lượng request, response time.

Alerting: cảnh báo khi có dấu hiệu quá tải, lỗi dịch vụ.

Log tập trung: thu thập log để phân tích và xử lý sự cố nhanh.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">How to design a system for millions of users?</span>

<br>

Scale Horizontally:

Deploy multiple backend instances (EC2, containers, physical servers) behind LB.

Stateless server: don't store state on server (JWT), session stored in external cache (Redis).

Load Balancer:

AWS ALB, Nginx, HAProxy.

Use health checks to automatically remove failed instances from system.

Database Scalability:

Read Replica: write to master/primary, read from slave/replica database.

Sharding/Partitioning: divide data into small parts by user, region... avoid overloading one node.

Connection Pooling: Limit number of connections (avoid overload), reuse connections to improve performance, save resources.

Caching:

Application-layer cache: Use Redis.

CDN-layer cache (AWS CloudFront).

Asynchronous Processing:

Queue/Message Broker: Kafka, RabbitMQ, SQS, ActiveMQ.

Worker pool: increase number of threads to process in parallel.

High Availability & Fault Tolerance:

Multi-zone, multi-region deployment: if one zone fails, other zones still operate.

Auto-Scaling: automatically increase/decrease number of instances based on actual load.

Replica, backup: ensure data not lost when server/db fails.

Connection Management:

Limit timeout, optimize keep-alive, use connection pool, apply for both backend and database.

Rate limiting: limit number of requests per user/IP per unit time to protect system.

Monitoring, Logging, Alerting:

Realtime monitoring: monitor CPU, RAM, IOPS (number of IO read/write operations per second), request count, response time.

Alerting: alert when signs of overload, service errors.

Centralized logging: collect logs for quick analysis and issue resolution.`,
          },
        },
        {
          id: "request-response-flow",
          name: {
            vi: "Một luồng request-response client đi qua các thành phần của một hệ thống web application hiện đại thế nào",
            en: "Request-response flow in modern web application",
          },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Một luồng request-response client đi qua các thành phần của một hệ thống web application hiện đại thế nào</span>

<br>

## a. **Sơ đồ (ví dụ triển khai với React.js, Spring Boot, AWS)**

\`\`\`
User Browser
    ↓
1. DNS Resolution (Route 53)
    ↓
2. CDN / CloudFront (static assets: HTML, CSS, JS)
    ↓
3. Load Balancer (AWS ALB)
    ↓
4. WAF / Security Layer
    ↓
5. API Gateway (optional)
    ↓
6. Backend Instances (Spring Boot in EC2/ECS)
    ↓
7. Cache Layer (Redis/ElastiCache) - check cache
    ↓ (if cache miss)
8. Database (RDS PostgreSQL/MySQL)
    ↓ (response)
9. Message Queue (SQS/Kafka) - async tasks
    ↓
Backend → API Gateway → ALB → CDN → Browser
\`\`\`

## b. **Chi tiết các bước**

### 1. DNS Resolution
User nhập URL: https://myapp.com
- Route 53: Resolve domain → IP address
- DNS load balancing (multi-region)

### 2. CDN / CloudFront
Static Assets: HTML, CSS, JS (React build), Images, Fonts, Videos
- Cached at edge locations
- Benefits: Faster loading, reduce origin load, global distribution

### 3. Load Balancer (AWS ALB)
- Layer 7 (HTTP/HTTPS)
- Route based on URL path
- Distribute to healthy instances
- SSL termination

### 4. WAF / Security Layer
AWS WAF: Block malicious requests, rate limiting, SQL injection protection, XSS prevention
Security Groups: Allow/deny traffic, port restrictions

### 5. API Gateway (optional)
AWS API Gateway or custom gateway:
- Authentication (JWT verification)
- Authorization
- Request validation
- Rate limiting

### 6. Backend Instances
Spring Boot application (EC2/ECS/Fargate):
- Request Processing: Controller → Service → Repository
- Security: Spring Security filter chain, JWT validation, RBAC

### 7. Cache Layer
Redis / AWS ElastiCache:
- Check Cache: cache hit / cache miss
- Cache Strategy: Session storage, API response caching

### 8. Database
AWS RDS (PostgreSQL/MySQL):
- Read Replicas: Write → Master, Read → Replicas
- Connection Pooling: HikariCP, limit connections, reuse connections
- Queries: Indexed, optimized, transaction management

### 9. Message Queue
Async Processing (SQS, Kafka):
- Background Tasks: Email notifications, report generation, data processing
- Benefits: Don't block main response, retry mechanism, scalable workers

## Response Flow

Backend → Cache Update → API Gateway → Load Balancer → CDN → Browser

1. Backend: Generate response JSON, set HTTP status, headers
2. Cache: Cache new data, set TTL, invalidate old cache
3. API Gateway: Transform response, add headers, logging
4. Load Balancer: Forward response, connection management, compression
5. CDN: Cache response (if cacheable), set cache headers
6. Browser: Parse JSON, update React components, display to user

## Monitoring Points

### Application Performance Monitoring
- Response time
- Error rate
- Request count

### Infrastructure Monitoring
- CPU, Memory usage
- Network I/O
- Disk I/O

### Logging
- Request/Response logs
- Error logs
- Audit logs

### Distributed Tracing
AWS X-Ray:
- Trace request through services
- Identify bottlenecks`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Request-response flow in modern web application</span>

<br>

## a. **Diagram (example deployment with React.js, Spring Boot, AWS)**

\`\`\`
User Browser
    ↓
1. DNS Resolution (Route 53)
    ↓
2. CDN / CloudFront (static assets: HTML, CSS, JS)
    ↓
3. Load Balancer (AWS ALB)
    ↓
4. WAF / Security Layer
    ↓
5. API Gateway (optional)
    ↓
6. Backend Instances (Spring Boot in EC2/ECS)
    ↓
7. Cache Layer (Redis/ElastiCache) - check cache
    ↓ (if cache miss)
8. Database (RDS PostgreSQL/MySQL)
    ↓ (response)
9. Message Queue (SQS/Kafka) - async tasks
    ↓
Backend → API Gateway → ALB → CDN → Browser
\`\`\`

## Details of each step

### 1. DNS Resolution
User enters URL: https://myapp.com
- Route 53: Resolve domain → IP address
- DNS load balancing (multi-region)

### 2. CDN / CloudFront
Static Assets: HTML, CSS, JS (React build), Images, Fonts, Videos
- Cached at edge locations
- Benefits: Faster loading, reduce origin load, global distribution

### 3. Load Balancer (AWS ALB)
- Layer 7 (HTTP/HTTPS)
- Route based on URL path
- Distribute to healthy instances
- SSL termination

### 4. WAF / Security Layer
AWS WAF: Block malicious requests, rate limiting, SQL injection protection, XSS prevention
Security Groups: Allow/deny traffic, port restrictions

### 5. API Gateway (optional)
AWS API Gateway or custom gateway:
- Authentication (JWT verification)
- Authorization
- Request validation
- Rate limiting

### 6. Backend Instances
Spring Boot application (EC2/ECS/Fargate):
- Request Processing: Controller → Service → Repository
- Security: Spring Security filter chain, JWT validation, RBAC

### 7. Cache Layer
Redis / AWS ElastiCache:
- Check Cache: cache hit / cache miss
- Cache Strategy: Session storage, API response caching

### 8. Database
AWS RDS (PostgreSQL/MySQL):
- Read Replicas: Write → Master, Read → Replicas
- Connection Pooling: HikariCP, limit connections, reuse connections
- Queries: Indexed, optimized, transaction management

### 9. Message Queue
Async Processing (SQS, Kafka):
- Background Tasks: Email notifications, report generation, data processing
- Benefits: Don't block main response, retry mechanism, scalable workers

## Response Flow

Backend → Cache Update → API Gateway → Load Balancer → CDN → Browser

1. Backend: Generate response JSON, set HTTP status, headers
2. Cache: Cache new data, set TTL, invalidate old cache
3. API Gateway: Transform response, add headers, logging
4. Load Balancer: Forward response, connection management, compression
5. CDN: Cache response (if cacheable), set cache headers
6. Browser: Parse JSON, update React components, display to user

## Monitoring Points

### Application Performance Monitoring
- Response time
- Error rate
- Request count

### Infrastructure Monitoring
- CPU, Memory usage
- Network I/O
- Disk I/O

### Logging
- Request/Response logs
- Error logs
- Audit logs

### Distributed Tracing
AWS X-Ray:
- Trace request through services
- Identify bottlenecks`,
          },
        },
      ],
    },
  ],
};
