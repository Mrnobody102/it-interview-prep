import type { Category } from "./types";

export const softwareArchitectureDesign: Category = {
  id: "software-architecture-design",
  name: {
    vi: "Software Architecture & Design",
    en: "Software Architecture & Design",
  },
  description: {
    vi: "Kiến trúc phần mềm và thiết kế hệ thống",
    en: "Software architecture and system design",
  },
  icon: "📐",
  topics: [
    // ===== I. KIẾN TRÚC TỔNG QUAN HỆ THỐNG =====
    {
      id: "system-architecture-overview",
      name: {
        vi: "I. Kiến trúc tổng quan hệ thống",
        en: "I. System Architecture Overview",
      },
      expanded: true,
      subtopics: [
        {
          id: "monolithic-architecture",
          name: {
            vi: "Monolithic Architecture",
            en: "Monolithic Architecture",
          },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Monolithic Architecture</span>

<br>

Kiến trúc đơn khối - toàn bộ ứng dụng được xây dựng thành một khối duy nhất.

Tất cả các thành phần (UI, business logic, database access) nằm trong một code base và được deploy cùng nhau.

**Ưu điểm:**

- Đơn giản khi bắt đầu dự án mới, phát triển nhanh.

- Dễ test và debug vì tất cả code ở một nơi.

- Deploy đơn giản - chỉ cần deploy một file.

**Nhược điểm:**

- Khó mở rộng khi dự án lớn lên.

- Một lỗi nhỏ có thể làm sập cả hệ thống.

- Khó áp dụng công nghệ mới vào từng phần riêng lẻ.

**Khi nào nên dùng:**

- Dự án nhỏ, đội ngũ nhỏ.

- Yêu cầu nghiệp vụ đơn giản, ít thay đổi.

- Khi cần phát triển và ra mắt sản phẩm nhanh.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Monolithic Architecture</span>

<br>

Single block architecture - entire application built as one unit.

All components (UI, business logic, database access) in one code base and deployed together.

**Advantages:**

- Simple when starting new project, fast development.

- Easy to test and debug because all code in one place.

- Simple deployment - just deploy one file.

**Disadvantages:**

- Hard to scale when project grows.

- One small error can crash entire system.

- Hard to apply new technology to individual parts.

**When to use:**

- Small project, small team.

- Simple business requirements, few changes.

- When need to develop and launch product quickly.`,
          },
        },
        {
          id: "modular-monolith",
          name: { vi: "Modular Monolith", en: "Modular Monolith" },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Modular Monolith / Domain-based Monolith</span>

<br>

Vẫn là monolithic nhưng được chia thành các module độc lập theo domain hoặc chức năng.

Mỗi module có ranh giới rõ ràng, tương tác với nhau qua interface được định nghĩa.

**Ưu điểm:**

- Dễ quản lý code hơn monolith thuần.

- Có thể tách module thành microservice nếu cần.

- Giữ được sự đơn giản của monolith nhưng có cấu trúc tốt hơn.

**Nhược điểm:**

- Vẫn deploy toàn bộ ứng dụng, không deploy riêng từng module.

- Cần kỷ luật cao trong team để giữ ranh giới module rõ ràng.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Modular Monolith / Domain-based Monolith</span>

<br>

Still monolithic but divided into independent modules by domain or function.

Each module has clear boundaries, interacts with others through defined interfaces.

**Advantages:**

- Easier to manage code than pure monolith.

- Can separate module into microservice if needed.

- Keep monolith simplicity but better structure.

**Disadvantages:**

- Still deploy entire application, can't deploy individual modules.

- Requires high discipline in team to keep module boundaries clear.`,
          },
        },
        {
          id: "microservices-architecture",
          name: {
            vi: "Microservices Architecture",
            en: "Microservices Architecture",
          },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Microservices Architecture</span>

<br>

Kiến trúc vi dịch vụ - mỗi chức năng (service) được tách ra thành một dịch vụ nhỏ, độc lập, giao tiếp qua API (thường là REST, gRPC, hoặc GraphQL).

**Ưu điểm:**

- Độc lập: Mỗi service triển khai riêng biệt nên không ảnh hưởng tới service khác nếu có lỗi.

- Dễ mở rộng: Có thể scale theo từng service, ví dụ service thanh toán có thể mở rộng riêng nếu lưu lượng tăng cao, không cần scale toàn hệ thống.

- Dễ triển khai: Chỉ cần build/test và deploy từng service độc lập, thay vì với cả khối lớn như monolith.

- Linh hoạt công nghệ: Mỗi service có thể chọn ngôn ngữ, DB, framework phù hợp.

- Khả năng phục hồi: Nếu 1 service có sự cố, các service khác vẫn hoạt động ổn định. Khó sập hơn monolith.

**Nhược điểm:**

- Quản lý phức tạp, yêu cầu DevOps mạnh: Cần hệ thống CI/CD, monitoring, logging, container orchestration (Kubernetes, Docker…) chuyên nghiệp để vận hành trơn tru.

- Do giao tiếp qua mạng nên có vấn đề về độ trễ (network latency), lỗi truyền thông tin hoặc bảo mật mạng.

- Dữ liệu phân tán nên khó đảm bảo nhất quán hơn monolith.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Microservices Architecture</span>

<br>

Microservices architecture - each function (service) separated into small, independent service, communicating via API (usually REST, gRPC, or GraphQL).

**Advantages:**

- Independent: Each service deploys separately so doesn't affect other services if error occurs.

- Easy to scale: Can scale by individual service, for example payment service can scale separately if traffic increases, no need to scale entire system.

- Easy to deploy: Just build/test and deploy each service independently, instead of large monolith block.

- Technology flexibility: Each service can choose suitable language, DB, framework.

- Resilience: If 1 service has issue, other services still operate stably. Harder to crash than monolith.

**Disadvantages:**

- Complex management, requires strong DevOps: Need professional CI/CD system, monitoring, logging, container orchestration (Kubernetes, Docker…) to operate smoothly.

- Communication over network has issues with latency, transmission errors or network security.

- Distributed data so harder to ensure consistency than monolith.`,
          },
        },
        {
          id: "soa-architecture",
          name: {
            vi: "SOA (Service-Oriented Architecture)",
            en: "SOA (Service-Oriented Architecture)",
          },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Service-Oriented Architecture (SOA)</span>

<br>

Kiến trúc hướng dịch vụ - ứng dụng được chia thành các service có thể tái sử dụng.

Các service giao tiếp qua Enterprise Service Bus (ESB).

**Đặc điểm:**

- Service lớn hơn microservice, có thể chứa nhiều chức năng liên quan.

- Tập trung vào việc tái sử dụng service cho nhiều ứng dụng khác nhau.

- Thường dùng SOAP, XML để giao tiếp.

**So với Microservices:**

- SOA: Service lớn hơn, ESB trung tâm, focus vào tái sử dụng.

- Microservices: Service nhỏ hơn, độc lập hoàn toàn, focus vào business capability riêng biệt.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Service-Oriented Architecture (SOA)</span>

<br>

Service-oriented architecture - application divided into reusable services.

Services communicate through Enterprise Service Bus (ESB).

**Characteristics:**

- Services larger than microservices, can contain multiple related functions.

- Focus on reusing services for different applications.

- Usually use SOAP, XML for communication.

**Compared to Microservices:**

- SOA: Larger services, central ESB, focus on reuse.

- Microservices: Smaller services, completely independent, focus on separate business capability.`,
          },
        },
        {
          id: "serverless-architecture",
          name: {
            vi: "Serverless/Cloud Architecture",
            en: "Serverless/Cloud Architecture",
          },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Serverless/Cloud Architecture</span>

<br>

Kiến trúc không máy chủ - không cần quản lý server, chỉ tập trung vào code.

Cloud provider (AWS Lambda, Azure Functions, Google Cloud Functions) tự động quản lý infrastructure.

**Đặc điểm:**

- Function as a Service (FaaS): Chạy code dựa trên events, chỉ trả tiền khi function được execute.

- Auto-scaling tự động theo traffic.

- Stateless: Mỗi function call độc lập, không lưu state giữa các lần gọi.

**Ưu điểm:**

- Không cần quản lý server, giảm chi phí vận hành.

- Chỉ trả tiền khi function chạy.

- Scale tự động, không cần lo lắng về capacity planning.

**Nhược điểm:**

- Cold start: Lần đầu gọi function có thể chậm.

- Vendor lock-in: Khó chuyển sang cloud provider khác.

- Khó debug và monitor.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Serverless/Cloud Architecture</span>

<br>

Serverless architecture - no need to manage servers, just focus on code.

Cloud provider (AWS Lambda, Azure Functions, Google Cloud Functions) automatically manages infrastructure.

**Characteristics:**

- Function as a Service (FaaS): Run code based on events, only pay when function executes.

- Auto-scaling automatically by traffic.

- Stateless: Each function call independent, doesn't store state between calls.

**Advantages:**

- No need to manage servers, reduce operational costs.

- Only pay when function runs.

- Auto scale, no worry about capacity planning.

**Disadvantages:**

- Cold start: First function call can be slow.

- Vendor lock-in: Hard to switch to another cloud provider.

- Hard to debug and monitor.`,
          },
        },
      ],
    },
    // ===== II. DESIGN PRINCIPLES =====
    {
      id: "design-principles",
      name: { vi: "II. Design Principles", en: "II. Design Principles" },
      expanded: true,
      subtopics: [
        {
          id: "solid-principles",
          name: { vi: "SOLID Principles", en: "SOLID Principles" },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">SOLID Principles</span>

<br>

5 nguyên tắc thiết kế hướng đối tượng giúp code dễ maintain, mở rộng và test.

**S - Single Responsibility Principle (SRP):**

- Một class chỉ nên có một lý do để thay đổi.

- Mỗi class chỉ làm một việc duy nhất.

- Ví dụ: Class User chỉ quản lý thông tin user, không nên có logic gửi email hay lưu database.

**O - Open/Closed Principle (OCP):**

- Open for extension, closed for modification.

- Có thể mở rộng chức năng mà không sửa code cũ.

- Ví dụ: Dùng interface/abstract class, khi cần thêm chức năng mới chỉ cần tạo class mới implement interface.

**L - Liskov Substitution Principle (LSP):**

- Subclass phải có thể thay thế được superclass mà không làm hỏng chương trình.

- Child class không được vi phạm hợp đồng của parent class.

**I - Interface Segregation Principle (ISP):**

- Không nên ép class implement interface có method không dùng đến.

- Nên chia interface lớn thành nhiều interface nhỏ cụ thể.

**D - Dependency Inversion Principle (DIP):**

- High-level modules không nên phụ thuộc vào low-level modules. Cả hai nên phụ thuộc vào abstraction (interface/abstract class).

- Abstraction không nên phụ thuộc vào details. Details nên phụ thuộc vào abstraction.

- Ví dụ: Service không nên phụ thuộc trực tiếp vào Repository class, mà nên phụ thuộc vào Repository interface.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">SOLID Principles</span>

<br>

5 object-oriented design principles to make code easy to maintain, extend and test.

**S - Single Responsibility Principle (SRP):**

- A class should have only one reason to change.

- Each class does only one thing.

- Example: User class only manages user information, shouldn't have email sending logic or database saving.

**O - Open/Closed Principle (OCP):**

- Open for extension, closed for modification.

- Can extend functionality without modifying old code.

- Example: Use interface/abstract class, when need new function just create new class implementing interface.

**L - Liskov Substitution Principle (LSP):**

- Subclass must be able to replace superclass without breaking program.

- Child class must not violate parent class contract.

**I - Interface Segregation Principle (ISP):**

- Should not force class to implement interface with unused methods.

- Should split large interface into multiple specific small interfaces.

**D - Dependency Inversion Principle (DIP):**

- High-level modules should not depend on low-level modules. Both should depend on abstraction (interface/abstract class).

- Abstraction should not depend on details. Details should depend on abstraction.

- Example: Service should not depend directly on Repository class, but should depend on Repository interface.`,
          },
        },
        {
          id: "dry-principle",
          name: {
            vi: "DRY (Don't Repeat Yourself)",
            en: "DRY (Don't Repeat Yourself)",
          },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">DRY (Don't Repeat Yourself)</span>

<br>

Không lặp lại code - mỗi phần logic chỉ nên xuất hiện một lần trong hệ thống.

**Mục đích:**

- Tránh duplicate code, giảm khả năng bug.

- Khi cần sửa logic, chỉ sửa ở một chỗ.

- Code dễ maintain hơn.

**Cách áp dụng:**

- Tạo function/method cho logic được dùng nhiều lần.

- Sử dụng inheritance hoặc composition.

- Extract constants, configuration ra file riêng.

**Lưu ý:**

- Không nên áp dụng quá đà, đôi khi duplicate code tốt hơn wrong abstraction.

- Chỉ nên DRY khi logic thực sự giống nhau và có khả năng thay đổi cùng nhau.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">DRY (Don't Repeat Yourself)</span>

<br>

Don't repeat code - each piece of logic should appear only once in system.

**Purpose:**

- Avoid duplicate code, reduce bug possibility.

- When need to fix logic, only fix in one place.

- Code easier to maintain.

**How to apply:**

- Create function/method for logic used multiple times.

- Use inheritance or composition.

- Extract constants, configuration to separate file.

**Note:**

- Should not over-apply, sometimes duplicate code better than wrong abstraction.

- Should only DRY when logic really same and likely to change together.`,
          },
        },
        {
          id: "kiss-principle",
          name: {
            vi: "KISS (Keep It Simple, Stupid)",
            en: "KISS (Keep It Simple, Stupid)",
          },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">KISS (Keep It Simple, Stupid)</span>

<br>

Giữ mọi thứ đơn giản nhất có thể.

**Mục đích:**

- Code đơn giản dễ đọc, dễ hiểu, dễ maintain.

- Tránh over-engineering - làm phức tạp không cần thiết.

- Simple solution thường reliable hơn complex solution.

**Cách áp dụng:**

- Ưu tiên giải pháp đơn giản nhất solve được problem.

- Không dùng design pattern nếu không thực sự cần.

- Tránh premature optimization.

- Code phải clear, không quá clever.

**Ví dụ:**

- Thay vì viết một dòng code phức tạp với nhiều toán tử, nested ternary... hãy chia thành nhiều dòng rõ ràng.

- Không cần microservices nếu monolith đơn giản đã đủ.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">KISS (Keep It Simple, Stupid)</span>

<br>

Keep everything as simple as possible.

**Purpose:**

- Simple code easy to read, understand, maintain.

- Avoid over-engineering - unnecessary complexity.

- Simple solution usually more reliable than complex solution.

**How to apply:**

- Prioritize simplest solution that solves problem.

- Don't use design pattern if not really needed.

- Avoid premature optimization.

- Code must be clear, not too clever.

**Example:**

- Instead of writing one complex line with many operators, nested ternary... split into multiple clear lines.

- Don't need microservices if simple monolith is enough.`,
          },
        },
        {
          id: "yagni-principle",
          name: {
            vi: "YAGNI (You Aren't Gonna Need It)",
            en: "YAGNI (You Aren't Gonna Need It)",
          },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">YAGNI (You Aren't Gonna Need It)</span>

<br>

Đừng implement feature mà bạn chưa thực sự cần.

**Mục đích:**

- Tránh lãng phí thời gian code feature không dùng.

- Code base nhỏ gọn hơn, ít bug hơn.

- Focus vào requirement hiện tại.

**Cách áp dụng:**

- Chỉ implement những gì requirement yêu cầu bây giờ.

- Đừng code cho "future use" nếu chưa có yêu cầu cụ thể.

- Refactor khi có requirement mới, đừng anticipate từ trước.

**Ví dụ:**

- Đừng tạo sẵn abstract layer cho multi-database nếu hiện tại chỉ dùng một database.

- Đừng làm configuration phức tạp nếu chưa có requirement deploy nhiều environment.

**Balance với SOLID:**

- YAGNI không có nghĩa là viết code không mở rộng được.

- Vẫn nên follow SOLID để code dễ extend sau này.

- Nhưng chỉ implement abstraction khi thực sự cần, không phải "phòng xa".`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">YAGNI (You Aren't Gonna Need It)</span>

<br>

Don't implement features you don't actually need yet.

**Purpose:**

- Avoid wasting time coding unused features.

- Smaller code base, fewer bugs.

- Focus on current requirements.

**How to apply:**

- Only implement what requirements ask for now.

- Don't code for "future use" if no specific requirement.

- Refactor when new requirement comes, don't anticipate beforehand.

**Example:**

- Don't create abstract layer for multi-database if currently only use one database.

- Don't make complex configuration if no requirement to deploy multiple environments.

**Balance with SOLID:**

- YAGNI doesn't mean write non-extensible code.

- Should still follow SOLID to make code easy to extend later.

- But only implement abstraction when really needed, not "just in case".`,
          },
        },
      ],
    },
    // ===== III. DESIGN PATTERNS =====
    {
      id: "design-patterns",
      name: { vi: "III. Design Patterns", en: "III. Design Patterns" },
      expanded: true,
      subtopics: [
        {
          id: "creational-patterns",
          name: { vi: "Creational Patterns", en: "Creational Patterns" },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Creational Patterns</span>

<br>

Các mẫu khởi tạo - giải quyết vấn đề tạo object.

**Builder:**

- Dùng để tạo object phức tạp theo từng bước mà không cần constructor có nhiều tham số.

- Thường dùng khi object có nhiều field, đặc biệt optional field.

- Lợi ích: Tránh constructor dài, code rõ ràng, hỗ trợ immutable object.

- Ví dụ: DTO với Lombok @Builder.

**Singleton:**

- Đảm bảo chỉ có một instance duy nhất trong toàn bộ ứng dụng.

- Lợi ích: Quản lý tài nguyên hiệu quả, tránh tạo nhiều object không cần thiết.

- Trong Spring Boot, mặc định mọi bean đều là singleton.

**Factory Method:**

- Cung cấp cách khởi tạo đối tượng mà không chỉ rõ lớp cụ thể.

- Thay vì gọi trực tiếp new, để subclass quyết định tạo đối tượng nào.

- Lợi ích: Tăng tính linh hoạt, dễ mở rộng (Open/Closed principle).

**Abstract Factory:**

- Tạo nhiều đối tượng liên quan mà không chỉ rõ lớp cụ thể.

- Ví dụ: GUIFactory tạo Button và Checkbox cho Windows/Mac.

**Prototype:**

- Tạo object mới bằng cách sao chép từ prototype object.

- Tiết kiệm chi phí khởi tạo object phức tạp.

- Trong Java: clone() method.

- Trong Spring: bean scope "prototype" luôn tạo mới object.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Creational Patterns</span>

<br>

Creation patterns - solve object creation problems.

**Builder:**

- Create complex object step by step without multi-parameter constructor.

- Used when object has many fields, especially optional fields.

- Benefits: Avoid long constructor, clear code, support immutable object.

- Example: DTO with Lombok @Builder.

**Singleton:**

- Ensure only one instance exists in entire application.

- Benefits: Efficient resource management, avoid unnecessary object creation.

- In Spring Boot, all beans are singleton by default.

**Factory Method:**

- Provide way to create object without specifying concrete class.

- Instead of calling new directly, let subclass decide which object to create.

- Benefits: Increase flexibility, easy to extend (Open/Closed principle).

**Abstract Factory:**

- Create multiple related objects without specifying concrete classes.

- Example: GUIFactory creates Button and Checkbox for Windows/Mac.

**Prototype:**

- Create new object by copying from prototype object.

- Save cost of creating complex object.

- In Java: clone() method.

- In Spring: bean scope "prototype" always creates new object.`,
          },
        },
        {
          id: "structural-patterns",
          name: { vi: "Structural Patterns", en: "Structural Patterns" },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Structural Patterns</span>

<br>

Các mẫu cấu trúc - giải quyết vấn đề tổ chức class và object.

**Adapter:**

- Chuyển đổi interface của class này thành interface client mong muốn.

- Giúp hai class không tương thích làm việc với nhau.

- Ví dụ: Mapping DTO ↔ Entity.

**Decorator:**

- Thêm chức năng mới cho object mà không thay đổi cấu trúc.

- Wrap object trong decorator object.

- Ví dụ: Java InputStream decorators (BufferedInputStream, DataInputStream).

**Facade:**

- Cung cấp interface đơn giản cho subsystem phức tạp.

- Che giấu complexity, dễ sử dụng hơn.

- Ví dụ: Service layer che giấu logic phức tạp của nhiều repositories.

**Proxy:**

- Tạo object đại diện (proxy) cho object khác.

- Kiểm soát access, lazy loading, caching.

- Ví dụ: Spring AOP proxy cho transaction management.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Structural Patterns</span>

<br>

Structural patterns - solve class and object organization problems.

**Adapter:**

- Convert interface of one class to interface client expects.

- Help incompatible classes work together.

- Example: Mapping DTO ↔ Entity.

**Decorator:**

- Add new functionality to object without changing structure.

- Wrap object in decorator object.

- Example: Java InputStream decorators (BufferedInputStream, DataInputStream).

**Facade:**

- Provide simple interface for complex subsystem.

- Hide complexity, easier to use.

- Example: Service layer hides complex logic of multiple repositories.

**Proxy:**

- Create representative object (proxy) for another object.

- Control access, lazy loading, caching.

- Example: Spring AOP proxy for transaction management.`,
          },
        },
        {
          id: "behavioral-patterns",
          name: { vi: "Behavioral Patterns", en: "Behavioral Patterns" },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Behavioral Patterns</span>

<br>

Các mẫu hành vi - giải quyết vấn đề giao tiếp giữa các object.

**Observer:**

- Định nghĩa one-to-many dependency giữa objects.

- Khi object thay đổi, tất cả dependents được notify tự động.

- Ví dụ: Event listeners, Spring ApplicationEvent.

**Strategy:**

- Định nghĩa family of algorithms, đóng gói từng algorithm, cho phép chúng interchangeable.

- Client chọn algorithm runtime.

- Ví dụ: Payment methods (Credit Card, PayPal, Bank Transfer).

**Template Method:**

- Định nghĩa skeleton của algorithm trong method, để subclasses override từng bước.

- Giữ cấu trúc algorithm nhưng cho phép customize chi tiết.

- Ví dụ: AbstractController trong Spring.

**Chain of Responsibility:**

- Chuỗi các object xử lý request.

- Mỗi object quyết định xử lý hoặc pass sang object tiếp theo.

- Ví dụ: Servlet Filters, Spring Security Filter Chain.

**Command:**

- Đóng gói request thành object.

- Cho phép parameterize clients với different requests, queue requests, log requests.

- Ví dụ: Undo/Redo operations.

**State:**

- Cho phép object thay đổi behavior khi internal state thay đổi.

- Ví dụ: Order states (New, Processing, Shipped, Delivered).

**Mediator:**

- Định nghĩa object đóng gói cách nhiều objects giao tiếp.

- Giảm coupling giữa các objects.

- Ví dụ: MVC Controller là mediator giữa Model và View.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Behavioral Patterns</span>

<br>

Behavioral patterns - solve communication problems between objects.

**Observer:**

- Define one-to-many dependency between objects.

- When object changes, all dependents notified automatically.

- Example: Event listeners, Spring ApplicationEvent.

**Strategy:**

- Define family of algorithms, encapsulate each algorithm, make them interchangeable.

- Client chooses algorithm at runtime.

- Example: Payment methods (Credit Card, PayPal, Bank Transfer).

**Template Method:**

- Define skeleton of algorithm in method, let subclasses override steps.

- Keep algorithm structure but allow customizing details.

- Example: AbstractController in Spring.

**Chain of Responsibility:**

- Chain of objects handling request.

- Each object decides to handle or pass to next object.

- Example: Servlet Filters, Spring Security Filter Chain.

**Command:**

- Encapsulate request as object.

- Allow parameterizing clients with different requests, queue requests, log requests.

- Example: Undo/Redo operations.

**State:**

- Allow object to change behavior when internal state changes.

- Example: Order states (New, Processing, Shipped, Delivered).

**Mediator:**

- Define object that encapsulates how multiple objects communicate.

- Reduce coupling between objects.

- Example: MVC Controller is mediator between Model and View.`,
          },
        },
      ],
    },
  ],
};
