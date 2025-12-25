import { Category } from "./types";

export const backend: Category = {
  id: "backend",
  name: { vi: "Backend", en: "Backend" },
  description: { vi: "Kiến thức Backend", en: "Backend Knowledge" },
  icon: "🛠️",
  topics: [
    {
      id: "java-backend",
      name: { vi: "Java Backend", en: "Java Backend" },
      subtopics: [
        {
          id: "java-core",
          name: { vi: "Java Core", en: "Java Core" },
          subtopics: [
            {
              id: "java-core-oop",
              name: { vi: "OOP", en: "OOP" },
              content: {
                vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Java Core → OOP</span>

<br>

## a. **Overview**

Mô hình lập trình dựa trên object và class, mỗi object là một thực thể gồm các thuộc tính và hành vi.

Encapsulation: Che giấu dữ liệu, dùng getter/setter

Inheritance: Tái sử dụng code từ class cha

Polymophism: Hành động giống nhau nhưng cách thực hiện khác nhau (overloading, overiding)

Abstraction: Ẩn chi tiết cài đặt, chỉ cho biết interface/abstract method

## b. **Sự khác nhau Abstract Class và Interface?**

• Abstract Class:

Có thể có những method có thân hàm

Có constructor, biến instance

Đơn kế thừa, một class chỉ extends được một class cha

• Interface:

Không có method có thân hàm (từ Java 8 có default&static method cho phép khai báo thân hàm)

Không có constructor

Đa kế thừa, một interface cho phép implement nhiều interface

• Trường hợp sử dụng:

AC sử dụng khi muốn chia sẻ logic code chung. Ví dụ Dog, Cat extend từ lớp abstract Animal, có thể có những đặc điểm chung như tên hoặc method eat(), nhưng ngoài ra cũng có những method abstract như makeSound() để có thể cài đặt riêng.  

Interface sử dụng khi cần định nghĩa một bản hợp đồng hành vi. Đó là khi ta muốn các class khác nhau nhưng vẫn phải có chung một hành vi, chức năng

## c. **Overloading và overiding**

• Overloading:

Xảy ra trong cùng class hoặc class con kế thừa

Khác signature (cùng tên, khác tham số)

Đa hình compile-time

• Overiding

Xảy ra giữa class cha và class con, subclass định nghĩa lại method superclass

Signature giống y hệt class cha

Đa hình runtime

## d. **Composition vs Inheritance – khi nào nên dùng**

• Inheritance (IS-A): Cat extends Animal

• Composition (HAS-A): Car has Engine

Nên ưu tiên Composition vì:

Linh hoạt hơn - có thể nhiều thành phần, giải quyết phần nào vấn đề đa kế thừa của inheritance, dễ kiểm thử unit test

Giảm coupling - không bị ràng buộc bởi mối quan hệ cha con

## e. **Multiple Inheritance qua Interface & Diamond Problem trong Java**

Java không hỗ trợ multiple inheritance qua class

Nhưng hỗ trợ qua interface

Nếu 2 interface có default method trùng nhau, class implements phải override để giải quyết xung đột. Ví dụ class implement 2 interface A, B cùng default defaultMethod() mà dùng của interface A thì A.super.defaultMethod()

## f. **Overiding và Hiding**

Overriding là khi lớp con thay đổi hành vi của một phương thức instance đã có ở lớp cha, và quyết định phương thức nào được gọi dựa vào đối tượng thực tế tại thời điểm chạy (runtime).

Hiding là khi lớp con che khuất một phương thức static hoặc biến đã có ở lớp cha, và quyết định phương thức hoặc biến nào được sử dụng dựa vào kiểu khai báo tại thời điểm biên dịch (compile time).

## g. **Dynamic Dispatch & Virtual Method Table (VMT)**
• Dynamic Dispatch: cơ chế giúp JVM chọn method gọi tại runtime dựa trên object thực tế.

• VMT:  

JVM lưu bảng ánh xạ method override

Khi gọi obj.method(), JVM tra cứu vtable để xác định method đúng

Đây là cách Java thực hiện runtime polymorphism`,
                en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Java Core → OOP</span>

<br>

- **Core concepts:** Object/Class, Encapsulation, Inheritance, Polymorphism, Abstraction.

- **Abstract Class vs Interface:** AC has constructor/state, single inheritance; Interface supports multiple inheritance, default/static (Java 8+).

- **Overloading vs Overriding:** Overloading (compile-time, param changes) vs Overriding (runtime, same signature).

- **Prefer Composition over Inheritance:** HAS-A reduces coupling and eases change.

- **Multiple inheritance via interfaces:** Resolve diamond by overriding; can call A.super.defaultMethod().

- **Overriding vs Hiding:** Overriding for instance methods (runtime); Hiding for static (compile-time).

- **Dynamic Dispatch (VMT):** JVM picks method via vtable based on actual object.`,
              },
            },
            {
              id: "java-core-collections",
              name: { vi: "Collections", en: "Collections" },
              content: {
                vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Java Core → Collections</span>

<br>

## a. **Overview**

• Collection Framework là tập hợp các class và interface hỗ trợ thao tác với tập dữ liệu ĐỘNG (List, Set, Map, Queue), nó khác với Arrays (có kích thước cố định) và cung cấp nhiều thuật toán như sort, search, shuffle

• Collection là INTERFACE, Collections là CLASS tiện ích

• Iterator: dùng để duyệt 1 CHIỀU các phần tử của Collection, chỉ có next(), hasNext(), remove()

ListIterator: nâng cấp của Iterator, chỉ dùng cho List, duyệt 2 chiều, có cả next và previous, hỗ trợ thêm sửa xóa phần tử trong khi duyệt

• Tại sao Collection là interface gốc thay vì Class?  

Để cho phép nhiều cấu trúc dữ liệu khác nhau (ArrayList, HashSet, LinkedList) implement linh hoạt.

• fail-fast iterator: ném ConcurrentModificationException nếu collection bị thay đổi cấu trúc khi đang duyệt

Ví dụ ArrayList, HashMap

• fail-safe iterator: cho phép duyệt mà không lỗi, nhưng có thể không thấy cập nhật mới

Ví dụ ConcurrentHashMap, CopyOnWriteArrayList

## b. **Collection (lưu trữ theo phần tử rời rạc)**

• List: có thứ tự, cho phép phần tử trùng lặp (cả kể null)

 - ArrayList: truy cập theo chỉ số, thêm và xóa cuối nhanh O(1), xóa index O(n), thích hợp cho đọc nhiều (truy cập theo chỉ số, O(1))

 - LinkedList: linked list trong Java là double-linked list (2 chiều)  

   Thao tác thêm/xóa ở đầu/cuối nhanh, truy cập ngẫu nhiên chậm (do phải duyệt từ đầu hoặc cuối O(n)), thích hợp lưu dữ liệu thao tác thêm/xóa nhiều

   Đa năng, có thể dùng như List, Queue, Deque, Stack

 - Vector/Stack: cũ, ít dùng; Vector thread-safe, Stack LIFO

  • Set: không cho phép phần tử trùng lặp, thường không thứ tự (LinkHashSet, TreeSet có thể có thứ tự)

 - HashSet: không thứ tự, không trùng lặp, thao tác nhanh

   Dựa trên HashMap - chỉ lưu key, value là dummy object

   Check 2 phần tử bằng nhau: so sánh hashCode() trước, sau đó equals()

 - LinkedHashSet: giữ thứ tự thêm, không trùng lặp

 - TreeSet: sắp xếp tự nhiên hoặc theo Comparator/Comparable, thích hợp khi cần duyệt có thứ tự, không cho phép null (vì không so sánh được)

  • Queue/Deque (Double end queue): Lưu trữ theo hàng đợi, FIFO hoặc LIFO, cho phép trùng lặp

 - PriorityQueue: hàng đợi ưu tiên theo Comparator/Comparable, không cho phép null, nếu 2 phần tử cùng độ ưu tiên thì không đảm bảo thứ tự ổn định

 - ArrayDeque: hàng đợi 2 đầu, không giới hạn kích thước, thao tác đầu cuối đều nhanh O(1), không cho phép null

   Có thể dùng như queue FIFO hoặc stack LIFO

## c. **Map (nhóm ánh xạ key-value, không thuộc Collection Interface)**

Key-value, key không trùng lặp (1 null duy nhất), value trùng được.

• HashMap: lưu trữ key-value dựa trên mảng bucket, mỗi bucket chứa linked list hoặc red-black tree của các key-value

HashMap trong Java 8+ dùng red-black tree thay cho linked list để giảm độ phức tạp O(n) xuống O(logn) khi nhiều hash key vào cùng 1 bucket

Hiệu năng truy xuất O(1)

• LinkedHashMap: duy trì thứ tự thêm vào, nhanh ~HashMap, truy xuất O(1)

• TreeMap: sắp xếp tự nhiên theo Comparator/Comparable, không cho phép null, hiệu năng truy xuất O(logn)

• ConcurrentHashMap: dùng cho đa luồng, hiệu năng cao, không cho key hoặc value null`,
                en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Java Core → Collections</span>

<br>

## a. **Collection Framework & Iterator**

- Includes Collection interface and implementations (List, Set, Queue).

- Iterator/ListIterator traverse elements, fail-fast (throws exception on modify) vs fail-safe (snapshot, no exception).

## b. **List, Set, Queue**

- **List:** ArrayList (fast access), LinkedList (fast insert/delete), Vector (old thread-safe), CopyOnWriteArrayList (thread-safe).

- **Set:** HashSet (no order), LinkedHashSet (insertion order), TreeSet (sorted, O(log n)).

- **Queue/Deque:** PriorityQueue (heap), ArrayDeque (doubly-ended).

## c. **Map**

- HashMap (tree bins from Java 8+), LinkedHashMap (insertion order), TreeMap (O(log n), no null), ConcurrentHashMap (thread-safe, no null).`,
              },
            },
            {
              id: "java-core-concurrency",
              name: { vi: "Concurrency", en: "Concurrency" },
              content: {
                vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Java Core → Concurrency</span>

<br>

## a. **Thread và process**
• Process là một chương trình đang chạy, có bộ nhớ, tài nguyên riêng.

• Thread là luồng thực thi nhỏ hơn trong một process, các thread cùng chia sẻ bộ nhớ. Ví dụ bật chrome (1 process), mỗi tab có thể là 1 thread

## b. **Runable và Thread**
• Runable: một interface chỉ có phương thức run(), dùng để ĐỊNH NGHĨA task

• Thread: class có phương thức run(), start()

• Cả 2 đều không trả về giá trị  

• Nếu extends Thread thì không extend được class khác

Dùng Runable linh hoạt hơn, implement được nhiều interface, tách riêng logic chạy và quản lý thread

## c. **Chu kì của Thread**
• New: thread được tạo ra nhưng chưa chạy do chưa gọi start()

• Runable: đã gọi start(), sẵn sàng được CPU thực thi

• Running: CPU thực sự thực thi code

• Blocked / Waiting / Timed Waiting (Chờ hoặc bị chặn): thread tạm dừng, chờ 1 sự kiện, chờ vào lock, chờ kết thúc thread khác, chờ do sleep()

• Terminated: Kết thúc, thoát khỏi phương thức run()

## d. **synchronized và volatile**
• synchronized: khóa đối tượng hoặc method, đảm bảo chỉ có 1 thread truy cập được vào vùng code đó tại một thời điểm.

synchronized method khóa toàn bộ method, sychronized block chỉ khóa một đoạn code nhỏ nên hiệu năng tốt hơn

• volatile: dùng cho biến, đảm bảo khi 1 thread thay đổi giá trị của biến đó, các thread sẽ ngay lập tức nhìn thấy giá trị mới đó  

• volatile chỉ đảm bảo visibility, synchronized đảm bảo cả visibility và mutual exclusion (không có race condition) / cả khối code đó là atomicity

Tức, đối với thao tác nguyên tử, chỉ có 1 bước duy nhất (như thay đổi status từ true thành false) chỉ cần dùng volatile để đảm bảo thêm visibility.

Đối với thao tác gồm nhiều bước (một luồng khác có thể chen vào trong khi đang thực thi), ví dụ counter++ (gồm 3 bước đọc, tăng, ghi). Nếu chỉ dùng volatile, 2 thread có thể cùng đọc giá trị cũ, dẫn đến race condition. Khi đó dùng synchronized, đảm bảo cả tính atomicity của chuỗi thao tác trên.

• volatile phù hợp với biến có thao tác nguyên tử - boolean, flag, status...

synchronize dùng với các thao tác phức tạp hơn như tăng biến số nguyên

## e. **wait(), notify(), notifyAll()**
Phải gọi trong khối synchronized (thread phải giữ lock của object đó)

• wait() làm thread hiện tại dừng lại để chờ 1 thread khác gọi notify() hoặc notifyAll()

• notify() đánh thức một thread khác trên cùng 1 object, nếu có nhiều thread, đánh thức MỘT thread bất kì

• notifyAll(): đánh thức tất cả thread đang wait() trên cùng 1 object

3 method trên giải quết vấn đề phối hợp giữ nhiều thread khi truy cập hoặc thao tác trên các tài nguyên dùng chung

Ví dụ: Trong một chương trình phát nhạc, thread chuyên phát nhạc phải wait thread chuyên tải dữ liệu tải xong, khi xong sẽ notify đến thread phát nhạc

## f. **Thread Pools và Executor Framwork**
• Thread Pool là một bể chứa các thread được tạo sẵn để sẵn sàng thực thi task, giúp tái sử dụng thread không cần tạo mới mỗi lần cần xử lý

• Executor Framework cung cấp bộ API quản lý và sử dụng thread pool

ExecutorService thường dùng trong các dự án thực tế. Cung cấp các phương thức như submit() để nộp task, có thể là Runnable hoặc Callable.

Nó quản lý việc tạo, tái sử dụng và hủy thread (với phương thức shutDown()), giúp tối ưu tài nguyên hệ thống.

## g. **Callable và Future**
• Callable: Giống Runable, dùng để định nghĩa task nhưng có kết quả trả về sau khi task chạy xong, có thể ném checked exception (Runable không)

• Future: Một interface đại diện cho kết quả của một task sẽ hoàn thành trong tương lai.  

Có thể dùng nó để kiểm tra task đã xong chưa, lấy kết quả hoặc hủy task.

## h. **Concurrent Collections**
• ConcurrentHashMap: map an toàn cho nhiều thread đọc/ghi đồng thời mà không cần tự đồng bộ hóa (synchronized)

Hiệu năng cao hơn Hashtable, synchronizedMap. Thay vì khóa toàn bộ Map để cho 1 luồng truy cập như 2 thằng trên thì nó chia nhỏ lock, cho phép nhiều thread truy cập đồng thời.

• CopyOnWriteArrayList: list tối ưu cho trường hợp đọc nhiều, ghi ít vì mỗi lần ghi sẽ copy ra một mảng mới.

• ConcurrentLinkedQueue: queue an toàn, không khóa cho các thao tác đồng thời

• BlockingQueue (ví dụ ArrayBlockingQueue, LinkedBlockingQueue):

Hàng đợi hỗ trợ cơ chế chờ (wait) và đánh thức (notify) khi thêm, lấy phần tử

Hữu ích cho các bài toán producer-consumer

## i. **Atomic Variables**
• Là các biến đặc biệt được thiết kế hỗ trợ các thao tác đọc, ghi, tăng, giảm, cập nhật... một cách an toàn trong môi trường đa luồng mà không cần dùng synchronize. Nó biến các thao tác trên với biến trở nên duy nhất (atomicity), do đó tránh được race-condition.

AtomicInteger, AtomicLong, AtomicBoolean...

• Hiệu năng cao hơn synchronized do dùng cơ chế CAS – compare and swap (một câu lệnh gốc CPU nên nhanh)

Ví dụ khi thực hiện thao tác tăng trên một biến đang có giá trị 10, nếu dùng synchronized, phải khóa biến đó lại, cho luồng chính (được phép truy cập) tăng lên 11 rồi mới nhả khóa cho các luồng khác chạy tiếp, rất mất thời gian.

Nếu dùng atomic variable, nó sẽ lưu lại giá trị ban đầu là 10. Giả sử trong lúc luồng chính đang tăng biến lên 11 mà có 1 luồng khác đã tăng nó lên 11 trước. CPU sẽ so sánh giá trị hiện tại (11) với giá trị ban đầu đã lưu (10). Do khác nhau nên nó sẽ cập nhật giá trị ban đầu thành 11 và tiếp tục quy trình trên.

## j. **Synchronizers**
• CountDownLatch: cho phép 1 hoặc nhiều thread chờ cho đến khi một số tác vụ hoàn thành (mới tiếp tục).

• CyclicBarrier: cho phép 1 nhóm thread chờ nhau tại một “điểm barrier” và cùng tiếp tục khi tất cả đã đến.

## k. **Fork/Join Framework**
ForkJoinPool: dùng cho lập trình parallelism.

Chia task lớn thành các task nhỏ (fork), sau đó ghép lại (join).  

Tối ưu trên CPU đa nhân. Khi khởi tạo ForkJoinPool, Java sẽ tự động tạo số luồng bằng số core CPU và xử lý tác vụ trên tất cả các core.

## l. **Deadlock & Livelock**
• Deadlock: là hiện tượng xảy ra khi 2 hoặc nhiều luồng chờ lẫn nhau giải phóng tài nguyên dẫn đến tất cả bị treo vô thời hạn.
Ví dụ có 2 object lock A và B. Luồng 1 lock A trước rồi cố lock B. Luồng 2 lock B trước rồi cố lock A. Cả 2 bị treo vì không chịu nhả tải nguyên.
Cách phòng tránh:

- Đảm bảo lock tài nguyên đúng thứ tự, ví dụ luôn lấy A rồi mới lấy B.
- Dùng tryLock() của lớp ReentranLock thay vì lock với synchronized.
  tryLock(): luồng không bị chặn, thay vì chờ khóa mãi như synchronized, tryLock() chỉ thử lấy khóa, nếu không lấy được, giải phóng các tài nguyên đã giữ và thử lại hoặc xử lý logic khác.
- Sử dụng tryLock(long timeout, TimeUnit unit) set timeout để đặt thời gian giữ lock của một luồng, tránh bị lock vô thời hạn.
- Hạn chế lock nhiều tài nguyên đồng thời
  • Livelock: các thread vẫn chạy và thay đổi trạng thái, nhưng công việc không tiến triển. Hiếm gặp hơn deadlock.
  Ví dụ mình và ny mình cùng ăn tối nhưng chỉ có 1 chiếc thìa. Mình cầm thìa chuẩn bị ăn nhưng mình biết ny mình đói nên nhường thìa cho ẻm, ẻm cầm thìa xong lại nghĩ mình đói nên lại nhường thìa cho mình. Cuối cùng cả hai cùng đói mà không thực hiện được việc ăn.
  Giải pháp:
- Quy định rõ ai được ăn trước
- Giới hạn số lần nhường
- Thêm thời gian chờ ngẫu hiên khi nhường, tăng khả năng 1 người ăn trước

## m. **Note and best practices**
• Trong các dự án Web Application dùng Spring Boot, thường không cần quản lý đa luồng vì SB đã tự quản lý đa luồng ở tầng server, chỉ khi cần xử lý song song hoặc một số tác vụ bất đồng bộ đặt biệt như xử lý nền (gửi notification, email mà người dùng không cần đợi), gọi nhiều API cùng lúc, xử lý dữ liệu lớn theo batch, phân nhỏ ra nhiều luồng
• Nên dùng Thread Pool thay vì tự tạo Thread: Thay vì tạo mới từng thread, mình dùng ExecutorService để quản lý và tái sử dụng thread
• Để tránh race condition khi nhiều luồng cùng truy cập, thay đổi một dữ liệu, dùng synchronized hoặc các class thread-safe như ConcurrentHashMap
• Nên thiết kế các object bất biến immutable khi có thể, như dùng final, trạng thái không thay đổi sau khi khởi tạo nên không lo lắng về đồng bộ trong đa luồng
• Luôn bắt và xử lý exception trong từng luồng, hoặc dùng UncaughtExceptionHandler, đảm bảo lỗi không bị bỏ qua và dễ kiểm soát sự cố
• Sau khi luồng sử dụng tài nguyên như file, kết nối, socket thì phải đóng tại, tốt nhất là dùng try-with-resources hoặc đóng trong khối finally
• Nên đặt tên cho các thread (dùng AtomicInteger) và ghi log đầy đủ`,
                en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Java Core → Concurrency</span>

<br>

- **Thread vs Process:** Thread lightweight, shared memory; Process heavy, independent.

- **Runnable vs Thread:** Runnable (interface) flexible; Thread (class) simple.

- **Lifecycle:** New → Runnable → Running → Blocked/Waiting/Timed Waiting → Terminated.

- **synchronized vs volatile:** synchronized (mutual exclusion + visibility) vs volatile (visibility for atomic ops).

- **wait/notify/notifyAll:** Coordinate threads in synchronized; producer-consumer pattern.

- **Thread Pools (ExecutorService):** Manage thread pool, reduce overhead creating/destroying threads.

- **Callable/Future:** Callable returns result, Future gets result async.

- **Concurrent Collections:** ConcurrentHashMap, CopyOnWriteArrayList, BlockingQueue.

- **Atomic Variables:** AtomicInteger, AtomicLong (CAS).

- **Synchronizers:** CountDownLatch, CyclicBarrier, Semaphore, Phaser.

- **Fork/Join Framework:** Split tasks, parallel processing (RecursiveTask/RecursiveAction).

- **Deadlock/Livelock:** Lock ordering, tryLock/timeout, avoid many locks.

- **Best practices:** Prefer immutability, use pools, handle exceptions/logging, close resources.`,
              },
            },
            {
              id: "java-core-lambda-stream",
              name: { vi: "Lambda & Stream", en: "Lambda & Stream" },
              content: {
                vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Java Core → Lambda & Stream API (Java 8+)</span>

<br>

4. **Lambdas, Functional interfaces, Stream API (Java 8+)**
   a. **Lambdas**
  • Cách viết ngắn gọn cho các implementation của functional interface, giúp code dễ đọc và giảm boilerplate

<pre><code class="language-java">
// không sử dụng từ khóa return
Addable ad1 = (a, b) -> (a + b);
System.out.println(ad1.add(10, 20));

// sử dụng từ khóa return
Addable ad2 = (int a, int b) -> {
  return (a + b);
};

// ví dụ Thread sử dụng biểu thức lambda
Runnable r2 = () -> {
  System.out.println("Thread2 is running...");
};
Thread t2 = new Thread(r2);
t2.start();
${"</code></pre>"}

  • Sử dụng khi cần truyền function như một đối số cho method

  Ví dụ thường thấy nhất là dùng với stream API

  ở đây filter nhận vào một function (lambda) để xác định điều kiện lọc toán tử

  • Ngắn gọn hơn, không cần tạo class mới như anonymous class
  b. **Functional Interface**
  • Là gì? một interface chỉ có một abstract method duy nhất (có thể có default/static method nữa), được đánh dấu @FunctionalInterface  

  • Vì sao functional interface chỉ có một abstract method? Cú pháp lambda chính là các viết ngắn gọn cho implement của method duy nhất đó, nếu có trên 2 method trừu tượng trong FI, biểu thức lambda sẽ bế tắc vì nó không biết cấp thân hàm cho phương thức nào
   • Functional Interfaces Toolbox: tập hợp các functional interface có sẵn trong java - 4 main categories:

   - Supplier<T>: T get() - không nhận vào tham số nhưng trả về một đối tượng (không ăn cơm mẹ nấu, đi làm và đem tiền về cho mẹ)
   - Comsumer<T>: void accept(T t) - nhận tham số là một đối tượng nhưng không trả về gì (ăn cơm mẹ nấu, đi làm nhưng không đem tiền về cho mẹ)
   - Function<T,R>: R apply (T t) - nhận tham số là đối tượng, trả về đối tượng (ăn cơm mẹ nấu, đi làm và đem tiền về cho mẹ)
   - Predictable<T>: boolean test(T t) - nhận tham số là một đối tượng và trả về một dự đoán boolean (một trường hợp cụ thể của function)
   - Để nối tiếp các functional interface và trả về một FI mới, sử dụng andThen

  • Method references là cú pháp ngắn gọn hơn của lambda expression(::)
  c. **Stream API**
  • Là chuỗi các phần tử tử được hỗ trợ thao tác xử lí như một dòng chảy

  • Stream khác với Collection:

   - Collection lưu dữ liệu
   - Stream KHÔNG lưu dữ liệu, chỉ xử lí luồng dữ liệu
    • Tính chất của Stream API:
   - Không thay đổi dữ liệu gốc - các thao tác trên Stream không thay đổi Collection ban đầu
   - Không lưu dữ liệu - chỉ xử lý khi cần
   - Lazy Execution - các thao tác trung gian chỉ chạy khi có terminal operation
   - Hỗ trợ xử lý song song với parallelStream()
    • Các thao tác chính với Stream:
   - Tạo Stream:
     Từ Collection: list.stream() hoặc list.parallelStream()
     Từ array: Arrays.stream(array)
     Từ giá trị: Stream.of(1,2,3)
   - Intermediate Operations (thao tác trung gian): trả về một Stream mới, không thực thi ngay (lazy execution)
     filter(Predicate) — Lọc theo điều kiện
     map(Function) — Biến đổi từng phần tử
     sorted() — Sắp xếp
     distinct() — Loại bỏ trùng
     limit(n), skip(n) — Giới hạn, bỏ qua
   - Terminal Operation: thực thi pipeline, trả về kết quả
     forEach(Consumer) — Xử lý từng phần tử
     collect(Collector) — Thu thập thành List, Set, Map,...
     reduce(BinaryOperator) — Tổng hợp thành một giá trị
     count(), min(), max(), anyMatch(), allMatch(), v.v.
  d. **Notes and best practice**

  • Chỉ sử dụng hoặc tự tạo FI khi cần thiết, tận dụng các FI chuẩn của Java.

  • Không nên dùng Stream cho thao tác đơn giản, loop nhỏ — for-each sẽ nhanh hơn

  • Không nên thay đổi (modify) phần tử bên trong Stream, không làm thay đổi giá trị gốc của collection.

  KHÔNG nên:

  Nên:

  • Cẩn thận khi dùng song song với dữ liệu không thread-safe

  Ví dụ NGUY HIỂM:

  Giải quyết:

  - Dùng collect(): tốt nhất

  - Thay List thành Collections.synchronizedList hoặc CopyOnWriteArrayList`,
                en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Java Core → Lambda & Stream API (Java 8+)</span>

<br>

- **Lambda:** Concise syntax for functional interfaces.

- **Functional Interface:** @FunctionalInterface; Supplier/Consumer/Function/Predicate; method references (::).

- **Stream API:** Non-mutating, lazy; sources: collection/array/of.

- **Intermediate ops:** filter, map, sorted, distinct, limit/skip.

- **Terminal ops:** forEach, collect, reduce, count, min/max, anyMatch/allMatch.

- **parallelStream:** Be careful with thread-safety.

- **Best practices:** Use stream for large data, avoid side-effects in lambda.`,
              },
            },
            {
              id: "java-core-generics",
              name: { vi: "Generics", en: "Generics" },
              content: {
                vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Java Core → Generics</span>

<br>

5. Generics
  • Mục đích? Cho phép khai báo lớp, interface, method với kiểu dữ liệu tổng quát

  • Cách sử dụng:

   - Với class và interface:
   - Với method:
   - Với collection:  
    • Lợi ích:
  - Code tường minh hơn, phát hiện lỗi kiểu dữ liệu ngay khi biên dịch

  - Giảm ép kiểu thủ công, code rõ ràng, dễ đọc hơn
     Nếu không dùng Generics : ít tường minh hơn so với khai báo có generics, báo lỗi nếu dữ liệu đưa vào List không phải String. Và phải ép kiểu thủ công:

  Dùng generics thì không cần:

   - Tái sử dụng code: ví dụ class Box<T> có thể thay thế IntBox hoặc StringBox, tùy trường hợp sử dụng

     • Wildcard: ? (chấp nhận mọi kiểu), ? extends T (chấp nhận T hoặc kiểu con của nó), ? super T (chấp nhận T hoặc lớp cha của nó).  

     Hỗ trợ truyền kiểu linh hoạt hơn.

  • Bound: T extends Number để giới hạn kiểu (chấp nhận kiểu đó hoặc kiểu con của nó)`,
                en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Java Core → Generics</span>

<br>

- **Goal:** Type safety; reusable classes/methods.

- **Wildcard:** ?, extends, super; bounds like T extends Number.

- **Benefit:** Reduce casting; clearer code, compile-time error detection.`,
              },
            },
            {
              id: "java-core-io",
              name: { vi: "Java I/O", en: "Java I/O" },
              content: {
                vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Java Core → I/O</span>

<br>

6. Java I/O
  • Java cung cấp các APU để đọc dữ liệu từ nguồn và ghi dữ liệu ra đích

  Nguồn và đích có thể là: console (bàn phím, màn hình), file, mạng, bộ nhớ...

  • Có 2 gói IO chính:

  java.io: hỗ trợ IO dựa trên stream (luồng byte và ký tự)

  java.nio (New IO): hỗ trợ Non-blocking IO, tối ưu xử lý dữ liệu lớn và ứng dụng mạng.

  Non-blocking IO là kỹ thuật giúp chương trình không bị dừng lại khi thao tác I/O.

  • Các lớp chính:

   - Byte Streams: đọc ghi dữ liệu dạng nhị phân

   - Character Streams: đọc ghi dữ liệu dạng ký tự (Unicode)

   - Buffer Streams: tăng hiệu suất đọc ghi cho dữ liệu dạng nhị phân hoặc ký tự

   - Data Streams: đọc ghi dữ liệu nguyên thủy (int, double, boolean...)

   - Object Streams: đọc ghi đối tượng (serialization)

     • Serialization và Deserialization:

   - Serialization là quá trình biến một đối tượng Java thành dãy byte để có thể lưu vào file, truyền qua mạng hoặc ghi vào db

   - Deserialization là quá trình ngược lại, biến dãy byte thành object

   - Java hỗ trợ serialization qua các lớp: ObjectOutputStream (ghi), ObjectInputStream (đọc)

   - Đối tượng muốn được serialize phải implements interface Serializable.

     serialVersionUID: Nên định nghĩa để tránh lỗi khi thay đổi class.

     Không serialize các trường không cần thiết: Dùng từ khóa transient.

   - Trường hợp sử dụng: chủ yếu là dùng trong ứng dụng game,  

     • try-with-resources: tự động đóng tài nguyên như file, stream, socket, kết nối database... mà không cần tự tay gọi close() trong finally.

     Các resource này phải implements interface AutoCloseable.`,
                en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Java Core → I/O</span>

<br>

- **java.io vs java.nio:** java.io (byte/char streams, blocking) vs java.nio (non-blocking, buffer-oriented).

- **Stream types:** Byte/Character/Buffer/Data/Object streams.

- **Serialization:** Convert object to bytes for save/transfer; serialVersionUID, transient fields.

- **try-with-resources:** Auto close resources (AutoCloseable).`,
              },
            },
            {
              id: "java-core-jvm-gc",
              name: { vi: "JVM & GC", en: "JVM & GC" },
              content: {
                vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Java Core → JVM Tuning & Garbage Collection</span>

<br>

7. JVM Turning, Garbage Collection
   a. Heap & Stack
  • Heap:

  Là vùng nhớ lớn trong JVM để lưu trữ các instance của object được tạo ra trong quá trình chạy chương trình (share giữa tất cả các thread).

  Được Garbage Collector (GC) tự động quản lý: thu hồi bộ nhớ các object không còn sử dụng.

  Nếu heap đầy, có thể gặp lỗi OutOfMemoryError.

  • Stack:  

  Mỗi thread có một stack riêng.

  Lưu các biến cục bộ, tham số của hàm, thông tin hàm đang thực thi (call stack).

  Khi hàm gọi lồng nhau quá sâu hoặc đệ quy vô hạn, sẽ gặp StackOverflowError.

  • Vậy những dữ liệu như thông tin class, hằng số, biến static... lưu ở đâu? Metaspace (Java 8+), sử dụng trực tiếp bộ nhớ của OS (native memory)
   b. Các tham số JVM hay dùng (chỉnh command hoặc setup trên IDE ngay lúc run)
  -Xms và -Xmx: Đặt dung lượng heap ban đầu (-Xms) và tối đa (-Xmx).

  -XX:+UseG1GC: Chọn loại GC (nên dùng G1GC cho app hiện đại).

  -Xss: Đặt dung lượng stack mỗi thread.

  Các tham số log GC: -Xlog:gc* (Java 9+).

   c. Các loại GC phổ biến
  • G1 GC (Java 9+, mặc định ở Java 17, 21): Cân bằng tốt giữa throughput và độ trễ (latency), phù hợp đa số app web, hệ thống microservices hiện nay.

  • Parallel GC (mặc định ở Java 8): Ưu tiên throughput, dùng cho batch processing.

  • ZGC (Java 11+): Heap lớn (hàng trăm GB), latency rất thấp, cho hệ thống lớn.
   d. Cách phát hiện và xử lý vấn đề về bộ nhớ
  • OutOfMemoryError: Do heap đầy, Metaspace đầy, hoặc memory leak quá lâu.

  • Memory leak: hiện tượng các đối tượng trong heap không còn được sử dụng nhưng vẫn còn tham chiếu nên GC không thể thu hồi.

  • StackOverflowError: Đệ quy vô hạn, stack quá sâu.

  • Dùng GC log và các công cụ như VisualVM/JMC để theo dõi heap và GC.
   e. Các thao tác thực tế hay làm
  • Điều chỉnh heap (-Xms, -Xmx) khi app thiếu/tốn nhiều bộ nhớ.

  • Đổi loại GC khi app lag, pause lâu, hoặc throughput thấp.

  • Theo dõi log GC để phát hiện full GC, pause time cao, memory leak.

  • Tạo heap dump khi cần phân tích kỹ memory leak.
   f. Notes
  • Đừng để heap quá lớn mà không kiểm soát (full GC sẽ lâu).

  • Ưu tiên G1GC cho đa số ứng dụng web/server hiện đại.

  • Theo dõi GC pause time: Nếu pause lâu, thử tối ưu heap, đổi GC, hoặc phân tích code gây leak.

  • Hạn chế gọi System.gc() trong code thực tế.`,
                en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Java Core → JVM Tuning & Garbage Collection</span>

<br>

- **Memory regions:** Heap (object, shared across threads), Stack (per-thread locals), Metaspace (class/static, native memory).

- **JVM flags:** -Xms/-Xmx (heap size), -Xss (stack size), -XX:+UseG1GC, -Xlog:gc*.

- **GC options:** G1 (default 17/21, balanced), Parallel (high throughput), ZGC (large heap, low latency).

- **Memory issues:** OutOfMemoryError, StackOverflowError, memory leak.

- **Diagnostics:** Heap dump (VisualVM/JMC), GC log; avoid System.gc().

- **Best practices:** Don't set heap too large, prefer G1GC, monitor pause time.`,
              },
            },
            {
              id: "java-core-versions",
              name: { vi: "Java Versions", en: "Java Versions" },
              content: {
                vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Java Core → Các phiên bản chính</span>

<br>

## a. **Java 8**

- Lambda, Functional Interfaces, Method Reference.

- Stream API, Default methods trong interface.

- Optional (xử lý null), Date/Time API mới (java.time).

## b. **Java 17 (LTS)**

- Sealed Classes (giới hạn kế thừa).

- Pattern Matching for instanceof.

- Records (immutable data class).

- Text Blocks (chuỗi nhiều dòng).

## c. **Java 21 (LTS)**

- Pattern Matching for switch.

- Record Patterns (decompose record).`,
                en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Java Core → Key versions</span>

<br>

## a. **Java 8**

- Lambda, Functional Interfaces, Method Reference.

- Stream API, Default methods in interface.

- Optional (null handling), new Date/Time API (java.time).

## b. **Java 17 (LTS)**

- Sealed Classes (restrict inheritance).

- Pattern Matching for instanceof.

- Records (immutable data class).

- Text Blocks (multi-line strings).

## c. **Java 21 (LTS)**

- Pattern Matching for switch.

- Record Patterns (decompose record).`,
              },
            },
          ],
        },
        {
          id: "spring-boot",
          name: { vi: "Spring / Spring Boot", en: "Spring / Spring Boot" },
          subtopics: [
            {
              id: "spring-core",
              name: { vi: "Spring Core", en: "Spring Core" },
              content: {
                vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Spring → Core</span>

<br>

## a. **Inversion of Control (IoC)**
• Đảo ngược quyền điều khiển là thay vì lập trình viên chịu trách nhiệm quả lý vòng đời và sự phụ thuộc của các đối tượng, framework sẽ làm việc đó. Cụ thể trong Spring, IoC container sẽ xử lý khởi tạo, liên kết các đối tượng (chứ không do chính các class đó tự thực hiện)

## b. **Dependency Injection (DI)**
• Là một cách cụ thể để thực hiện IoC. DI nghĩa là các phụ thuộc của một object sẽ được tiêm (inject) nhờ Ioc Container, thay vì object phải tự tạo ra chúng bằng từ khóa new.  
• Lợi ích: giúp code dễ kiểm thử, dễ bảo trì, giảm sự phụ thuộc chặt chẽ giữa các module.

## c. **Bean Lifecycle, Bean Scope**
• Vòng đời của bean:

- Khởi tạp: Spring tạo instance của bean

- Spring inject các dependency vào bean (bằng constructor – best practice)

- Có thể có các phương thức can thiệp trước và sau khi bean được khởi tạo

- Bean được sử dụng

- Khi container shutdown, gọi phương thức hủy (destroy)
  • Bean scope: Xác định phạm vi tồn tại và số lượng instance của bean
- Singleton: chỉ có một instance duy nhất được tạo ra trong toàn bộ ứng dụng

- Prototype: mỗi lần bean được yêu cầu, Spring sẽ tạo ra một instance mới

- Request (chỉ dùng trong web): mỗi HTTP request, một instance bean riêng được tạo

- Session: mỗi HTTP session, một instance bean riêng được tạo

- Application: một instance bean cho toàn bộ web application (ServerContext) - chỉ dụng cho ứng dụng web

- Web socket: một instance cho mỗi WebSocket

## d. **ApplicationContext vs BeanFactory**
• BeanFactory:
- Là interface gốc (cơ bản) nhất của Spring Container

- Chỉ cung cấp các chức năng cơ bản về quản lý bean, như khởi tạo, cung cấp bean, tiêm phụ thuộc

- Chỉ khởi tạo bean khi bean được yêu cầu (lazy loading)

- Ít tính năng, nhẹ, chủ yếu dùng cho ứng dụng đơn giản, tài nguyên hạn chế

• ApplicationContext:
- Là interface mở rộng của Spring Container

- Cung cấp đầy đủ các tính năng nâng cao cho enterprise application như:
  Hỗ trợ internationalization (i18n), AOP, tích hợp với các framework khác như JDBC, ORM...

- Khởi tạo tất cả singleton bean ngay khi context khởi động (eager loading)

- Trong Spring Boot, ApplicationContext luôn là mặc định

## e. **AOP – Aspect Oriented Programming**
• AOP là kĩ thuật lập trình hướng khía cạnh, giúp tách các phần logic phụ trợ ra khỏi code chính, giúp các method tập trung vào business logic. Các logic phụ trợ thường gặp là logging, quản lý transaction, kiểm tra quyền (lúc truy cập vào method)...
• AOP không thay thế OOP mà nó bổ trợ cho OOP. Ví dụ OOP đáng lẽ nên tập trung vào logic nghiệp vụ chính thì lại có những đoạn logic không liên quan như ghi log, kiểm tra quyền..., và điều này khiến code lặp lại ở nhiều nơi. AOP giúp tách biệt hoàn toàn các logic này ra khỏi các class business chính.
• Các thành trong AOP:
- Aspect: nơi chứa logic phụ trợ (ví dụ logging logic)

- Advice (Lời khuyên/hành động): Đoạn code sẽ thực thi ở một điểm cụ thể (trước, sau, quanh method)
  Ví dụ trước khi bất cứ hàm nào trong service chạy, hãy in: ‘Bắt đầu method!’
  → Đoạn code System.out.println(“Bắt đầu method!”); là advice.
- Join Point (Điểm kết nối): Là điểm cụ thể trong quá trình thực thi chương trình, nơi advice có thể được áp dụng (thường là khi gọi method).
  Ví dụ khi bạn gọi userService.login() hoặc orderService.createOrder(), mỗi lần gọi method này là một join point.
- Pointcut (Điểm cắt): Điều kiện/biểu thức xác định những join point nào sẽ áp dụng advice (chọn những method nào để “gắn” advice).
  Bạn muốn ghi log cho mọi method trong package service:
  → Pointcut là: execution(* com.example.service.*.*(..))
- Weaving (Kết hợp): Quá trình “gắn” aspect vào đúng chỗ trong code (các join point) khi ứng dụng chạy, biên dịch hoặc load class.
  Khi bạn chạy app, Spring hoặc AspectJ sẽ tự động “chèn” code log của bạn vào đúng các method đã định nghĩa trong pointcut.
• Cách sử dụng:
- Thêm dependency spring-boot-starter-aop hoặc aspectjweaver (nếu dùng AspectJ)

- Sử dụng @Aspect để định nghĩa class chứa logic phụ trợ

- Một số annotation thường gặp trong AOP:`,
                en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Spring → Core</span>

<br>

## a. **IoC (Inversion of Control)**

- Inverts control: Framework manages object lifecycle and dependencies instead of programmer.

- IoC Container handles initialization and wiring.

## b. **DI (Dependency Injection)**

- Concrete way to implement IoC: dependencies are injected by IoC Container.

- Benefits: testable, maintainable, reduces coupling.

- Prefer constructor injection.

## c. **Bean Lifecycle & Scope**

- **Lifecycle:** create → inject → hooks → use → destroy.

- **Scope:** Singleton (default), Prototype, Request, Session, Application, WebSocket.

## d. **ApplicationContext vs BeanFactory**

- **BeanFactory:** Base interface, lazy loading, lightweight, minimal features.

- **ApplicationContext:** Extends BeanFactory, eager loads singletons, rich features (i18n, AOP, events).

## e. **AOP (Aspect Oriented Programming)**

- Separates cross-cutting concerns (logging, transaction, security) from business logic.

- **Components:** Aspect, Advice, JoinPoint, Pointcut, Weaving.`,
              },
            },
            {
              id: "spring-boot-basics",
              name: { vi: "Spring Boot", en: "Spring Boot" },
              content: {
                vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Spring → Boot Basics</span>

<br>

## a. **Overview**
• Spring Boot là framework được xây dựng dựa trên nền tảng Spring Framewrok, giúp tạo ứng dụng Spring nhanh nhất, đơn giản, tự động hóa cấu hình, giảm thiểu tối đa code cấu hình. Ví dụ trước đây phải cấu hình thủ công từng bean trong XML thì Spring Boot hỗ trợ cấu hình ngay trong code với các annotation.

• **Khác biệt chính với Spring:**

- Spring Boot tự động cấu hình nhiều thành phần dựa trên các dependency đã thêm vào, giúp tiết kiệm thời gian và giảm lỗi cấu hình so với Spring thường

- Spring thường phải tự cấu hình server như Tomcat, Spring Boot thì có sẵn embedded server để chạy

- Hỗ trợ cấu hình ứng dụng qua file properties, YAML, biến môi trường, command line,... giúp linh động khi chuyển đổi môi trường (dev, test, prod).

## b. **Cơ chế autoconfiguration**  
• Spring Boot tự động cấu hình ứng dụng dựa trên các dependency đã thêm vào project.  

 Không cần cấu hình thủ công các bean, datasource, security, MVC... nữa.

 **Ví dụ:**

 Nếu bạn thêm dependency spring-boot-starter-web, Spring Boot tự động cấu hình Tomcat, DispatcherServlet, các bean web, v.v.

 Nếu thêm spring-boot-starter-data-jpa, Spring Boot tự động cấu hình JPA, DataSource...

 • **Starter dependencies**

 Starter là các gói dependency được đóng gói sẵn, giúp bạn thêm tất cả thư viện cần thiết cho một tính năng chỉ với 1 dòng khai báo.


## c. **Cho phép cấu hình hóa bên ngoài (Externalized Configuration)**
 Chính là các file application.properties hoặc application.yml, cho phép cài đặt cấu hình các ứng dụng bên ngoài như database, AWS, Kafka... Ngoài ra, còn có thể cài đặt cấu hình thông qua biến môi trường và tham số dòng lệnh.

Ví dụ với tham số dòng lệnh:

Ngoài ra SB còn hỗ trợ cấu hình riêng biệt cho từng môi trường dev, test, prod:
`,
                en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Spring → Boot Basics</span>

<br>

## a. **Overview**

- Framework built on Spring, fast app creation, auto-configuration.

- Minimal config code, embedded server.

## b. **Auto-configuration**

- Auto-configures based on dependencies.

- **@SpringBootApplication** = @Configuration + @EnableAutoConfiguration + @ComponentScan.

## c. **Starter Dependencies**

- Pre-packaged dependency bundles: spring-boot-starter-web, spring-boot-starter-data-jpa, etc.

## d. **Externalized Configuration**

- application.properties/yml, env variables, command line.

- Profiles for environments (dev, test, prod).`,
              },
            },
            {
              id: "spring-mvc",
              name: { vi: "Spring MVC (REST)", en: "Spring MVC (REST)" },
              content: {
                vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Spring → MVC (REST API)</span>

<br>

3. Spring MVC  
   Là module của Spring Framework hỗ trợ phát triển ứng dụng web theo mô hình MVC (Model-View-Controller).  
   Giúp tách rõ Controller (xử lý request), Service (xử lý logic), Repository (database), View (giao diện).
   Thực tế hiện nay khi phát triển REST API, thường không dùng View, phần view chỉ dùng cho ứng dụng web truyền thống (JSP, Thymeleaf...)
   Để sử dụng Spring MVC, thêm dependency spring-boot-starter-web (nếu dùng Spring Boot) hoặc spring-webmvc (nếu dùng Spring thuần)
   a. REST API development
  • Dùng annotation như @RestController, @RequestMapping (cho class), @GetMapping, @PostMapping (cho method)...

  • Trả về dữ liệu JSON/XML thay vì trang HTML

   
b. **Content negotiation (JSON/XML)**
   • Tự động chọn định dạng trả về dựa trên header Accept trong HTTP request

   Nếu client gửi header Accept:  

   application/json → trả JSON, Accept: application/xml → trả XML.
 
  • Spring Boot hỗ trợ sẵn trả về định dạng JSON, nếu muốn hỗ trợ XML chỉ cần thêm dependency jackson-dataformat-xml
   
  c. **Exception Handling**
  • Để xử lý lỗi tập trung, trả về thông tin lỗi rõ ràng, chuẩn REST (ví dụ: HTTP 400, 404, 500...)

  • **Dùng annotation:**

  - @RestControllerAdvice (cho dự án REST API) @ControllerAdvice cho class

  - @ExceptionHandler cho method handle exception

   
  d. **Validation**
  • Đảm bảo dữ liệu gửi lên API hợp lệ trước khi xử lý. Ví dụ không thiếu trường, đúng định dạng email, số điện thoại...

   • Dùng annotation validation như **@NotNull**, **@Email**, **@Size**,... trên DTO.

   Kết hợp **@Valid** trong method controller. Annotation này sẽ tự động kiểm tra các ràng buộc đã khai báo trên các trường của DTO.  
   Spring sẽ tự động trả về lỗi (bad request 400) hoặc chuyển thông tin lỗi vào đối tượng BindingResult để xử lý.`,
                en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Spring → MVC (REST API)</span>

<br>

## a. **REST API Development**

- **@RestController**, @RequestMapping/@GetMapping/@PostMapping.

- Returns JSON/XML instead of HTML.

## b. **Content Negotiation**

- Auto-selects format (JSON/XML) based on Accept header.

- Add jackson-dataformat-xml for XML support.

## c. **Exception Handling**

- **@RestControllerAdvice** + @ExceptionHandler for centralized error handling.

- Returns standard REST HTTP 400/404/500.

## d. **Validation**

- @Valid + constraints (@NotNull, @Email, @Size) on DTO.

- BindingResult handles error info.`,
              },
            },
            {
              id: "spring-security",
              name: { vi: "Spring Security 6", en: "Spring Security 6" },
              content: {
                vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Spring → Security 6</span>

<br>

4. **Spring Security**
   Là framework bảo mật tích hợp cho Spring Boot. Nó giống như một người gác cổng cho ứng dụng của chúng ta.

  a. **Authentication, Authorization**

  **Authentication:** Xác thực danh tính user (ai là người đang truy cập?).

  **Authorization:** Phân quyền (người dùng này được phép làm gì?).

  b. **Spring Security 6**

  Spring Security 6 là phiên bản hiện đại, loại bỏ hoàn toàn cấu hình cũ, đồng bộ với Spring Framework 6 và Java 17+.

  Cấu hình bảo mật phải dùng Bean SecurityFilterChain, không dùng kế thừa class nữa.

  Annotation, method security cũng thay đổi tên, nhiều API cũ bị loại bỏ.

  Việc migrate từ 5 lên 6 cần chú ý xóa bỏ toàn bộ WebSecurityConfigurerAdapter, đổi sang Bean, cập nhật các annotation và dùng Java 17 trở lên.
   c. Cấu hình cơ bản

  d. **JWT (JSON Web Token)**

  Là token được mã hóa từ một JSON object, dùng trong xác thực stateless giữa client và server.

  • **Cấu trúc:** gồm 3 phần, ngăn cách bởi dấu chấm

  - **Header:** thông tin loại token và loại thuật toán được sử dụng cho sử dụng như HS256 và RS256

  - Payload: chứa thông tin user và token như userId, roles, thời gian hết hạn... không nên lưu các thông tin nhạy cảm ở Payload.

  - Signature: được mã hóa bằng Header + Payload và một secret key chỉ server mới biết. Do đó dù Header và Payload được mã hóa Base64, tức là nếu có token, có thể giải mã ngược và thấy được thông tin Header và Payload, nhưng nếu thay đổi chúng, signature không đồng nhất, secret key ở server sẽ không thể xác thực và token trở nên không hợp lệ.
 
      • **Ưu điểm:**

     Đối với các web application sử dụng phương thức xác thực truyền thống qua cookie/session lưu ở trên server, client sẽ phải luôn gọi đúng về server đó để xác thực. Giả sử ứng dụng của chúng ta cần mở rộng thêm nhiều server hoặc triển khai microservices, client sẽ không biết gọi về server nào để xác thực, điều này có thể được giải quyết bằng sticky session (gắn 1 client với 1 server) nhưng nhược điểm vẫn kém rất nhiều trong việc dùng JWT trong trường hợp này.  
    Việc dùng JWT khiến cho ứng dụng stateless thực sự, tức là không cần lưu bất kì user session nào trên server, chỉ cần lưu token trên client và gửi kèm thông tin xác thực trong mỗi request. Nó cũng giúp khả năng mở rộng, auto-scaling, tích hợp đa vùng tốt hơn. Rất phù hợp cho các hệ thống phân tán, microservices, yêu cầu mở rộng linh hoạt, high availability.

    • **Nhược điểm:** Tuy nhiên cũng có một nhược điểm lớn đó là một khi đã phát hành token cho client, nó sẽ hợp lệ đến khi hết hạn, dù người dùng có đăng xuất hay bị khóa. Dẫn đến rủi ro bảo mật nếu lộ token.

     Các ứng dụng lớn hiện nay thường kết hợp dùng **access token** và **refresh token** để giải quyết phần nào bài toán trên. Khi người dùng đăng nhập thành công, hệ thống sẽ trả về access token và refresh token. Access token để đính kèm header trong mỗi request người dùng phục vụ việc xác thực, còn refresh token để lấy access token mới khi nó hết hạn.
   
  - **Access token** được đặt thời hạn ngắn khoảng 5 - 15 phút, nên lưu trên localStorage.
   
  - Refresh token có thời hạn dài hơn, thường là 7 – 30 ngày, nên lưu trên Cookie được gắn cờ Http Only hoặc trên Redis (với hệ thống phân tán)

   Do access token có thời gian sống ngắn, nên nếu bị lộ access token cũng giảm thiểu thời gian khai thác hệ thống.  
   Với hệ thống cần bảo mật cao, muốn thu hồi token ngay lập tức khi đăng xuất có thể triển khai một Blacklist access token trên server (thường là trên Redis với hệ thống phân tán, phản hồi nhanh), mỗi lần API nhận request, kiểm tra access token đó có nằm trong blacklist không.
   Ngoài ra các hệ thống đa nền tảng như Facebook, Google... hệ thống sẽ cấp riêng refresh token cho từng thiết bị để ví dụ đăng xuất trên máy tính nhưng trên điện thoại vẫn ở trạng thái đăng nhập. Hoặc khi mất điện thoại, nghi ngờ có thiết bị lạ vào tài khoản, có thể chọn đăng xuất khỏi tất cả các thiết bị.
  Để cải thiện trải nghiệm người dùng, không phải đăng nhập lại khi hết hạn refresh token, mỗi lần làm mới access token, server đồng thời cấp luôn refresh token mới, nếu người dùng hoạt động thường xuyên, refresh token sẽ luôn được làm mới.

  • Cấu hình trong Spring Boot:

  e. **OAuth2**

  • Là phương thức xác thực ủy quyền cho bên thứ ba ví dụ Google, Facebook mà không cần nhập user name, password.

  • **Quy trình cơ bản:**

  Ứng dụng hỏi có đồng ý cấp quyền đăng nhập với Google, Facebook không.

  Nếu đồng ý, dịch vụ bên thứ ba sẽ cấp cấp cho ứng dụng một access token dùng để gọi API từ ứng dụng.

  Access token có thời gian sử dụng ngắn, khi hết hạn sẽ dùng refresh token để lấy một access token mới.

  • Như vậy, thay vì ứng dụng gửi token cho client, dịch vụ bên thứ 3 sẽ được ủy quyền làm việc đó, thường dùng JWT làm chuẩn token xác thực

  • **Cấu hình OAuth2 với Spring Boot:**

  Cần cấu hình thêm về issuer-uri, public key hoặc jwk-set-uri trong file application.properties.

   f. **Method-level security (@PreAuthorize, @Secured)**

  • Để bật bảo mật method-level, sử dụng annotation sau trong class cấu hình bảo mật (có @Configuration):

  @EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)

   - **prePostEnabled = true:**
     Bật @PreAuthorize, @PostAuthorize.

   - **securedEnabled = true:**
     Bật @Secured.

    • **Các annotation sử dụng cho method-level sucurity:**

    **@PreAuthorize:** Kiểm tra điều kiện quyền trước khi thực thi method. Có thể dùng Spring Expression Language (SpEL) để kiểm tra role, quyền, điều kiện...

    **@PostAuthorize:** Kiểm tra điều kiện sau khi thực thi method.

    **@Secured:** Chỉ kiểm tra role được truy cập method, không thể kiểm tra điều kiện phức tạp.

    **@RolesAllowed:** Tương tự @Secured, dùng chuẩn Java EE. Ít dùng.

    **Ví dụ:**

  hasRole(‘ADMIN’) trong @PreAuthorize tự động hiểu là ROLE_ADMIN

  Nếu sử dụng @Secured thì phải viết đầy đủ ROLE_ADMIN

   • Nên dùng method-level security khi cần bảo vệ nghiệp vụ ở tầng service, kiểm tra quyền phức tạp, hoặc đảm bảo mọi luồng truy cập đều phải qua kiểm tra bảo mật, không chỉ ở endpoint.

   • Trong các hệ thống microservice, các method nghiệp vụ có thể được gọi qua nhiều API khác nhau. Method-level security giúp bảo vệ chặt chẽ ở tầng nghiệp vụ, dù gọi từ đâu.
   g. **Tổng quan luồng xử lý**

  • Request HTTP tới server ngay từ đầu sẽ gặp phải một chuỗi các filter của Spring Security gọi là **Security Filter Chain.**

  Mỗi filter có một nhiệm vụ riêng như authentication, authorization, bảo vệ CSRF, xử lý đăng xuất...

  • **Filter bảo vệ CSRF:**

   CSRF (Cross-Site Request Forgery) là tấn công dựa trên việc kẻ xấu lợi dụng trình duyệt của người dùng đã đăng nhập sẵn (có session/cookie) để thực hiện các hành động không mong muốn trên một website khác.

   Với web application dùng session thì luôn nên bật bảo vệ CSRF.

   Với REST API stateless dùng JWT, OAuth2, không dùng session: nếu token ở client được lưu vào localStorage/sessionStorage (như access token) và được đính kèm vào header Authorization trong mỗi request thì không cần bật bảo vệ CRSF. Nếu token ở client được lưu vào cookie (như refresh token) thì nên bật bảo vệ CSRF.
   
  • **Xác thực (authentication):**

   Đầu tiên, hệ thống kiểm tra request đã được xác thực hay chưa.

   Nếu chưa, các filter liên quan (như UsernamePasswordAuthenticationFilter đối với form login, hoặc một custom filter cho JWT) sẽ chịu trách nhiệm lấy thông tin xác thực từ request (username/password, token)

   Thông tin này sẽ được kiểm tra thông qua AuthenticationManager và các AuthenticationProvider. Nếu xác thực thành công, thông tin người dùng được lưu vào SecurityContext
   
  • **Phân quyền (authorization):**

   Sau khi xác thực, Spring Security tiếp tục kiểm tra quyền truy cập của user với endpoint đang gọi. Điều này dựa trên các rule cấu hình (ví dụ role, authority...)

   Nếu không đủ quyền, hệ thống trả về lỗi 403 Forbidden.
   
  • Nếu cả xác thực và phân quyền đều hợp lệ, request sẽ được chuyển tới controller, service để xử lý logic nghiệp vụ

  • Các filter cuối cùng có thể xử lý thêm các vấn đề như logout, exception handling, hoặc ghi log nếu cần.
   h. **Notes**

  • Luôn sử dụng các thuật toán mã hóa password mạnh như **BCrypt**

  • **Kiểm soát CORS:** Nếu ứng dụng là API phục vụ frontend khác domain (ví dụ frontend dùng cổng 3000, backend dùng cổng 8000), cần cấu hình CORS.

  • **Custom Exception Handling:**

   Vấn đề của xử lý exception khi sử dụng Spring Security là nó chặn trước request trước khi nó có thể gọi đến lớp xử lý exception nếu xảy ra lỗi xác thực. Ví dụ người dùng gửi về một JWT không hợp lệ, nó sẽ không thể trả về một thông báo lỗi theo format mà lớp xử lý exception của hệ thống tạo ra.

   Cách tốt nhất là sử dụng **AuthenticationEntryPoint** để trả về 401 (lỗi xác thực, token không hợp lệ) và **AccessDeniedHandler** để trả về 403 (không đủ quyền). Khi trả lỗi có thể tùy chỉnh cho giống format của lớp exception chung.`,
                en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Spring → Security 6</span>

<br>

## a. **Authentication vs Authorization**

- **Authentication:** Verify identity (who is accessing?).

- **Authorization:** Permission control (what can they do?).

## b. **Configuration (Spring Security 6)**

- Use Bean SecurityFilterChain, no WebSecurityConfigurerAdapter.

- Configure CORS for cross-domain FE/BE.

## c. **JWT (JSON Web Token)**

- **Structure:** Header + Payload + Signature.

- **Access token:** Short-lived (5-15 min), store in localStorage.

- **Refresh token:** Long-lived (7-30 days), store in HttpOnly cookie or Redis.

- **Blacklist:** Optional, use Redis to revoke tokens immediately.

## d. **CSRF Protection**

- Enable for session-based apps.

- Disable for stateless JWT (unless refresh token in cookie).

## e. **Method-level Security**

- @EnableMethodSecurity; @PreAuthorize/@PostAuthorize/@Secured/@RolesAllowed.

## f. **Error Handlers**

- AuthenticationEntryPoint (401), AccessDeniedHandler (403).`,
              },
            },
            {
              id: "spring-data-transaction",
              name: { vi: "Data & Transaction", en: "Data & Transaction" },
              content: {
                vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Spring → Data & Transaction (JPA)</span>

<br>

## a. **Entity Mapping**

- Quan hệ OneToOne/OneToMany/ManyToMany.

- Lazy vs Eager loading.

## b. **Tránh N+1 Problem**

- JOIN FETCH, @EntityGraph, batch fetching.

- Pagination/Sorting.

## c. **@Transactional**

- **Isolation:** READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE.

- **Propagation:** REQUIRED, REQUIRES_NEW.

## d. **Hiện tượng**

- Dirty read, Non-repeatable read, Phantom read.`,
                en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Spring → Data & Transaction (JPA)</span>

<br>

## a. **Entity Mapping**

- Relationships OneToOne/OneToMany/ManyToMany.

- Lazy vs Eager loading.

## b. **Avoid N+1 Problem**

- JOIN FETCH, @EntityGraph, batch fetching.

- Pagination/Sorting.

## c. **@Transactional**

- **Isolation:** READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE.

- **Propagation:** REQUIRED, REQUIRES_NEW.

## d. **Phenomena**

- Dirty read, Non-repeatable read, Phantom read.`,
              },
            },
            {
              id: "spring-async-scheduler",
              name: { vi: "Async & Scheduler", en: "Async & Scheduler" },
              content: {
                vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Spring → Async & Scheduler</span>

<br>

- **@EnableAsync + @Async:** CompletableFuture cho tác vụ nền.

- **@EnableScheduling + @Scheduled:** fixedRate/cron cho job định kỳ.`,
                en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Spring → Async & Scheduler</span>

<br>

- **@EnableAsync + @Async:** CompletableFuture for background tasks.

- **@EnableScheduling + @Scheduled:** fixedRate/cron for periodic jobs.`,
              },
            },
            {
              id: "spring-testing",
              name: { vi: "Testing", en: "Testing" },
              content: {
                vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Spring → Testing</span>

<br>

- **Unit:** JUnit, Mockito (mock/stub/verify).

- **Integration (slices):** @SpringBootTest, @WebMvcTest, @DataJpaTest, @RestClientTest.

- **REST API:** MockMvc cho kiểm thử controller.`,
                en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Spring → Testing</span>

<br>

- **Unit:** JUnit, Mockito (mock/stub/verify).

- **Integration (slices):** @SpringBootTest, @WebMvcTest, @DataJpaTest, @RestClientTest.

- **REST API:** MockMvc for controller tests.`,
              },
            },
            {
              id: "spring-actuator-monitoring",
              name: {
                vi: "Actuator & Monitoring",
                en: "Actuator & Monitoring",
              },
              content: {
                vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Spring → Actuator & Monitoring</span>

<br>

- **Endpoints:** Health, metrics, info.

- **Giám sát:** Logging, alerting (Prometheus, Grafana, ELK).`,
                en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Spring → Actuator & Monitoring</span>

<br>

- **Endpoints:** Health, metrics, info.

- **Monitoring:** Logging, alerting (Prometheus, Grafana, ELK).`,
              },
            },
            {
              id: "spring-cloud",
              name: { vi: "Spring Cloud", en: "Spring Cloud" },
              content: {
                vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Spring → Cloud</span>

<br>

- **Tổng quan:** Config, Discovery, Gateway, Circuit Breaker.

- Dùng cho microservices architecture.`,
                en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Spring → Cloud (reference)</span>

<br>

- **Overview:** Config, Discovery, Gateway, Circuit Breaker.

- Used for microservices architecture.`,
              },
            },
          ],
        },
      ],
    },
    {
      id: "python-backend",
      name: { vi: "Python Backend", en: "Python Backend" },
      subtopics: [
        {
          id: "django-fastapi",
          name: { vi: "Django / FastAPI", en: "Django / FastAPI" },
          content: {
            vi: `# Django / FastAPI

## Django

### MVT Pattern
- **Model:** Database layer
- **View:** Business logic
- **Template:** Presentation layer

### ORM
<pre><code>class User(models.Model):
  name = models.CharField(max_length=100)
  email = models.EmailField(unique=True)
</code></pre>

### Admin Panel
Built-in admin interface for CRUD operations

## FastAPI

### Modern Python Framework
- Type hints
- Auto documentation (Swagger/OpenAPI)
- High performance (async support)

### Example
<pre><code>from fastapi import FastAPI

app = FastAPI()

@app.get("/users/{user_id}")
async def get_user(user_id: int):
  return {"user_id": user_id}
</code></pre>

### Pydantic Models
Data validation using Python type hints

### Dependency Injection
Similar to Spring, clean and testable

## Django vs FastAPI
- **Django:** Full-featured, batteries included
- **FastAPI:** Modern, async, API-focused`,
            en: `# Django / FastAPI

## Django

### MVT Pattern
- **Model:** Database layer
- **View:** Business logic
- **Template:** Presentation layer

### ORM
<pre><code>class User(models.Model):
  name = models.CharField(max_length=100)
  email = models.EmailField(unique=True)
</code></pre>

### Admin Panel
Built-in admin interface for CRUD operations

## FastAPI

### Modern Python Framework
- Type hints
- Auto documentation (Swagger/OpenAPI)
- High performance (async support)

### Example
<pre><code>from fastapi import FastAPI

app = FastAPI()

@app.get("/users/{user_id}")
async def get_user(user_id: int):
  return {"user_id": user_id}
</code></pre>

### Pydantic Models
Data validation using Python type hints

### Dependency Injection
Similar to Spring, clean and testable

## Django vs FastAPI
- **Django:** Full-featured, batteries included
- **FastAPI:** Modern, async, API-focused`,
          },
        },
      ],
    },
    {
      id: "nodejs-backend",
      name: { vi: "Node.js Backend", en: "Node.js Backend" },
      subtopics: [
        {
          id: "express-nestjs",
          name: { vi: "Express / NestJS", en: "Express / NestJS" },
          content: {
            vi: `# Express / NestJS

## Express.js

### Minimal & Flexible
<pre><code>const express = require('express');
const app = express();

app.get('/users/:id', (req, res) => {
  res.json({ userId: req.params.id });
});
</code></pre>

### Middleware
<pre><code>app.use(express.json());
app.use(cors());
app.use(authMiddleware);
</code></pre>

## NestJS

### Enterprise Framework
- TypeScript-first
- Angular-like architecture
- Dependency Injection
- Decorator-based

### Example
<pre><code>@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
</code></pre>

### Modules
Organize code into cohesive blocks

### Guards, Interceptors, Pipes
Built-in request lifecycle hooks`,
            en: `# Express / NestJS

## Express.js

### Minimal & Flexible
<pre><code>const express = require('express');
const app = express();

app.get('/users/:id', (req, res) => {
  res.json({ userId: req.params.id });
});
</code></pre>

### Middleware
<pre><code>app.use(express.json());
app.use(cors());
app.use(authMiddleware);
</code></pre>

## NestJS

### Enterprise Framework
- TypeScript-first
- Angular-like architecture
- Dependency Injection
- Decorator-based

### Example
<pre><code>@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
</code></pre>

### Modules
Organize code into cohesive blocks

### Guards, Interceptors, Pipes
Built-in request lifecycle hooks`,
          },
        },
        {
          id: "event-loop",
          name: { vi: "Event Loop", en: "Event Loop" },
          content: {
            vi: `# Node.js Event Loop

## Single-threaded, Non-blocking

Node.js chạy trên single thread nhưng có thể handle nhiều concurrent operations nhờ event loop.

## Event Loop Phases

1. **Timers:** Execute setTimeout, setInterval callbacks
2. **Pending Callbacks:** I/O callbacks deferred to next iteration
3. **Idle, Prepare:** Internal use
4. **Poll:** Retrieve new I/O events
5. **Check:** Execute setImmediate callbacks
6. **Close Callbacks:** socket.on('close', ...)

## Microtasks vs Macrotasks

### Microtasks (Higher priority)
- process.nextTick()
- Promise callbacks

### Macrotasks
- setTimeout, setInterval
- setImmediate
- I/O operations

## Common Pitfalls

### Blocking the Event Loop
Avoid CPU-intensive tasks on main thread
-> Use Worker Threads

### Memory Leaks
Không cleanup event listeners, timers`,
            en: `# Node.js Event Loop

## Single-threaded, Non-blocking

Node.js runs on single thread but can handle multiple concurrent operations thanks to event loop.

## Event Loop Phases

1. **Timers:** Execute setTimeout, setInterval callbacks
2. **Pending Callbacks:** I/O callbacks deferred to next iteration
3. **Idle, Prepare:** Internal use
4. **Poll:** Retrieve new I/O events
5. **Check:** Execute setImmediate callbacks
6. **Close Callbacks:** socket.on('close', ...)

## Microtasks vs Macrotasks

### Microtasks (Higher priority)
- process.nextTick()
- Promise callbacks

### Macrotasks
- setTimeout, setInterval
- setImmediate
- I/O operations

## Common Pitfalls

### Blocking the Event Loop
Avoid CPU-intensive tasks on main thread
-> Use Worker Threads

### Memory Leaks
Not cleaning up event listeners, timers`,
          },
        },
      ],
    },
    {
      id: "dotnet-backend",
      name: { vi: ".NET Backend", en: ".NET Backend" },
      content: {
        vi: `# .NET Backend

## ASP.NET Core

### Cross-platform
Chạy trên Windows, Linux, macOS

### High Performance
One of the fastest web frameworks

### Built-in DI
<pre><code>services.AddScoped<IUserService, UserService>();
</code></pre>

## MVC Pattern

### Controller
<pre><code>[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
  [HttpGet("{id}")]
  public ActionResult<User> GetUser(int id)
  {
    return Ok(user);
  }
}
</code></pre>

## Entity Framework Core

### Code-First Approach
Define models in C#, generate database

### Migrations
Track database schema changes

## Middleware Pipeline
Configure request processing pipeline`,
        en: `# .NET Backend

## ASP.NET Core

### Cross-platform
Runs on Windows, Linux, macOS

### High Performance
One of the fastest web frameworks

### Built-in DI
<pre><code>services.AddScoped<IUserService, UserService>();
</code></pre>

## MVC Pattern

### Controller
<pre><code>[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
  [HttpGet("{id}")]
  public ActionResult<User> GetUser(int id)
  {
    return Ok(user);
  }
}
</code></pre>

## Entity Framework Core

### Code-First Approach
Define models in C#, generate database

### Migrations
Track database schema changes

## Middleware Pipeline
Configure request processing pipeline`,
      },
    },
    {
      id: "golang-backend",
      name: { vi: "Golang Backend", en: "Golang Backend" },
      content: {
        vi: `# Golang Backend

## Why Go for Backend?

### Performance
Compiled language, fast execution

### Concurrency
Goroutines & channels for concurrent tasks

### Simple & Productive
Clean syntax, fast compilation

## Goroutines

<pre><code>go func() {
  // Runs concurrently
}()
</code></pre>

Lightweight threads managed by Go runtime

## Channels

<pre><code>ch := make(chan int)
go func() { ch <- 42 }()
value := <-ch
</code></pre>

Communication between goroutines

## Popular Frameworks

### Gin
Fast HTTP framework

### Echo
Minimalist, high performance

### Fiber
Express-like API

## Standard Library
Rich standard library for web development`,
        en: `# Golang Backend

## Why Go for Backend?

### Performance
Compiled language, fast execution

### Concurrency
Goroutines & channels for concurrent tasks

### Simple & Productive
Clean syntax, fast compilation

## Goroutines

<pre><code>go func() {
  // Runs concurrently
}()
</code></pre>

Lightweight threads managed by Go runtime

## Channels

<pre><code>ch := make(chan int)
go func() { ch <- 42 }()
value := <-ch
</code></pre>

Communication between goroutines

## Popular Frameworks

### Gin
Fast HTTP framework

### Echo
Minimalist, high performance

### Fiber
Express-like API

## Standard Library
Rich standard library for web development`,
      },
    },
  ],
};
