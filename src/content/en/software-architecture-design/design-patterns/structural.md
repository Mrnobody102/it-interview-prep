# Design Patterns

## 6. Structural Patterns

Structural patterns explain how to compose classes and objects to form larger structures. They focus on simplifying relationships between entities.

### 6.1. Adapter Pattern

#### 6.1.1. Concept

Convert the interface of one class into another interface that the client expects. Allows incompatible interfaces to work together.

#### 6.1.2. Real-World Analogy

A power adapter converts plug types (e.g., US to EU) without changing the underlying device.

#### 6.1.3. When to Use

- Integrating third-party libraries with different interfaces
- Converting between DTOs and domain entities
- Wrapping legacy code with a modern interface

#### 6.1.4. Code Example

```typescript
// Third-party library with incompatible interface
class ExternalUserService {
  getUserData(): { user_name: string; user_age: number } {
    return { user_name: 'Alice', user_age: 30 };
  }
}

// Target interface our app expects
interface User {
  name: string;
  age: number;
}

// Adapter
class UserServiceAdapter implements User {
  constructor(private externalService: ExternalUserService) {}

  get name(): string {
    return this.externalService.getUserData().user_name;
  }

  get age(): number {
    return this.externalService.getUserData().user_age;
  }
}

// Usage
const adapter = new UserServiceAdapter(new ExternalUserService());
console.log(adapter.name); // "Alice"
console.log(adapter.age);  // 30
```

---

### 6.2. Decorator Pattern

#### 6.2.1. Concept

Attach additional responsibilities to an object dynamically. Subclassing is replaced by wrapping objects in decorator objects.

#### 6.2.2. When to Use

- Adding features to objects without modifying their class
- Combining behaviors at runtime
- Extending closed classes (from Open/Closed principle)

#### 6.2.3. Code Example

```typescript
// Base component
interface DataSource {
  writeData(data: string): void;
  readData(): string;
}

// Concrete component
class FileDataSource implements DataSource {
  constructor(private filename: string) {}

  writeData(data: string): void {
    console.log(`Writing to file: ${this.filename}`);
  }

  readData(): string {
    return 'file contents';
  }
}

// Decorator base
abstract class DataSourceDecorator implements DataSource {
  constructor(protected wrappee: DataSource) {}

  writeData(data: string): void {
    this.wrappee.writeData(data);
  }

  readData(): string {
    return this.wrappee.readData();
  }
}

// Concrete decorator: Encryption
class EncryptionDecorator extends DataSourceDecorator {
  writeData(data: string): void {
    const encrypted = `[ENCRYPTED:${data}]`;
    super.writeData(encrypted);
  }
}

// Concrete decorator: Compression
class CompressionDecorator extends DataSourceDecorator {
  writeData(data: string): void {
    const compressed = `[COMPRESSED:${data}]`;
    super.writeData(compressed);
  }
}

// Usage — can stack decorators
const source = new FileDataSource('data.txt');
const encrypted = new EncryptionDecorator(source);
const compressed = new CompressionDecorator(encrypted);

compressed.writeData('sensitive data');
// Output: Writing to file: data.txt
// Data flows: "sensitive data" → compressed → encrypted → file
```

#### 6.2.4. Real-World Examples

- Java I/O streams: `BufferedInputStream(InputStream)`
- Node.js middleware: `app.use()` chain
- NestJS interceptors and guards

---

### 6.3. Facade Pattern

#### 6.3.1. Concept

Provide a simplified, unified interface to a complex subsystem. Hide the complexity behind a single entry point.

#### 6.3.2. When to Use

- Simplifying complex libraries or frameworks
- Creating a simple API over a multi-step process
- Reducing dependencies between clients and subsystem classes

#### 6.3.3. Code Example

```typescript
// Complex subsystem classes
class CPU {
  freeze(): void { console.log('CPU: Freezing...'); }
  jump(position: number): void { console.log(`CPU: Jumping to ${position}`); }
  execute(): void { console.log('CPU: Executing...'); }
}

class Memory {
  load(position: number, data: string): void {
    console.log(`Memory: Loading "${data}" at ${position}`);
  }
}

class HardDrive {
  read(sector: number, size: number): string {
    console.log(`HardDrive: Reading sector ${sector}`);
    return 'boot data';
  }
}

// Facade
class ComputerFacade {
  private cpu = new CPU();
  private memory = new Memory();
  private hardDrive = new HardDrive();

  start(): void {
    console.log('--- Computer Starting ---');
    this.cpu.freeze();
    const bootData = this.hardDrive.read(0, 1024);
    this.memory.load(0, bootData);
    this.cpu.jump(0);
    this.cpu.execute();
    console.log('--- Computer Ready ---');
  }
}

// Client code — simple and clean
const computer = new ComputerFacade();
computer.start();
```

#### 6.3.4. Real-World Examples

- Service layer hiding multiple repository calls
- `console.log` hiding complex browser APIs
- ORM libraries as facades over raw SQL

---

### 6.4. Proxy Pattern

#### 6.4.1. Concept

Create a representative object that controls access to another object. Acts as a surrogate or placeholder.

#### 6.4.2. Types of Proxy

| Type | Purpose |
|---|---|
| **Virtual Proxy** | Lazy initialization — create expensive objects on demand |
| **Protection Proxy** | Access control — verify permissions before operation |
| **Remote Proxy** | Local representative for remote object (e.g., gRPC stub) |
| **Cache Proxy** | Store results to avoid repeated expensive operations |
| **Logging Proxy** | Log method calls and arguments |

#### 6.4.3. Code Example

```typescript
// Subject interface
interface Image {
  display(): void;
  getFileName(): string;
}

// Real object — expensive to create
class RealImage implements Image {
  constructor(private filename: string) {
    // Simulate heavy loading
    console.log(`Loading image from disk: ${filename}`);
  }

  display(): void {
    console.log(`Displaying image: ${this.filename}`);
  }

  getFileName(): string {
    return this.filename;
  }
}

// Virtual Proxy — lazy loading
class ImageProxy implements Image {
  private realImage: RealImage | null = null;

  constructor(private filename: string) {}

  display(): void {
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename);
    }
    this.realImage.display();
  }

  getFileName(): string {
    return this.filename;
  }
}

// Usage
const images = [
  new ImageProxy('photo1.jpg'),
  new ImageProxy('photo2.jpg'),
  new ImageProxy('photo3.jpg'),
];

// No images loaded yet — only proxies created
images[0].display(); // Loads and displays photo1.jpg
images[1].display(); // Loads and displays photo2.jpg
// photo3.jpg never loaded — memory saved
```

#### 6.4.4. Real-World Examples

- **Spring AOP proxy:** Transaction management, security annotations
- **Hibernate proxy:** Lazy-loading entity relationships
- **CDN proxy:** Serving cached content instead of origin server
- **API rate limiting:** Proxy counting and throttling requests

> **Summary:** Adapter changes an interface, Decorator adds behavior, Facade simplifies a subsystem, and Proxy controls access to an object. All four patterns wrap objects — the intent is what distinguishes them.
