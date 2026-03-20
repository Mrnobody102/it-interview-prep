# Chủ đề Express.js vs NestJS

## 1. Tổng quan

### 1.1. Express.js

**Express.js** là web framework nhẹ, linh hoạt cho Node.js. Ra đời năm 2010, là framework phổ biến nhất cho Node.js backend development. Express cung cấp minimal routing và middleware system, để developer tự do kiến trúc ứng dụng.

### 1.2. NestJS

**NestJS** là framework Node.js mã nguồn mở, xây dựng trên Express (hoặc Fastify), sử dụng TypeScript. Ra đời năm 2017, NestJS mang phong cách Angular vào backend với dependency injection, decorators, modules system, và opinionated architecture.

### 1.3. So sánh tổng quan

| Tiêu chí | Express.js | NestJS |
|---|---|---|
| **Ngôn ngữ** | JavaScript (chủ yếu) | TypeScript (bắt buộc) |
| **Architecture** | Unopinionated, tự do | Opinionated, structure rõ ràng |
| **Learning curve** | Thấp | Cao hơn |
| **Scalability** | Tự thiết kế | Có sẵn patterns |
| **Dependency Injection** | Không có native | Có (IoC container) |
| **Modularity** | Thủ công | Modules system |
| **Decorators** | Không | Có (TypeScript) |
| **Performance** | Rất nhanh (less overhead) | Tốt (thêm overhead nhỏ) |
| **Testing** | Tự set up | Built-in testing tools |
| **Ecosystem** | Rất lớn | Growing |
| **Use case tốt nhất** | Microservices, prototypes, simple APIs | Enterprise, large applications |

---

## 2. Express.js

### 2.1. Cài đặt và Setup

```bash
npm init -y
npm install express
npm install --save-dev typescript @types/express ts-node nodemon
npx tsc --init
```

```typescript
// src/app.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();

// Middleware
app.use(express.json());  // Parse JSON body
app.use(express.urlencoded({ extended: true }));

// Types
interface User {
  id: number;
  name: string;
  email: string;
}

// In-memory data store
const users: User[] = [];
let nextId = 1;

// Routes
app.get('/users', (req: Request, res: Response) => {
  res.json(users);
});

app.get('/users/:id', (req: Request, res: Response) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

app.post('/users', (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }
  const user: User = { id: nextId++, name, email };
  users.push(user);
  res.status(201).json(user);
});

app.put('/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  users[index] = { ...users[index], ...req.body, id };
  res.json(users[index]);
});

app.delete('/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  users.splice(index, 1);
  res.status(204).send();
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
```

```typescript
// src/index.ts
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 2.2. Express Router

```typescript
// src/routes/users.ts
import { Router, Request, Response } from 'express';

const router = Router();

// GET /users
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'List users' });
});

// GET /users/:id
router.get('/:id', (req: Request, res: Response) => {
  res.json({ message: `Get user ${req.params.id}` });
});

// POST /users
router.post('/', (req: Request, res: Response) => {
  res.status(201).json({ message: 'Create user' });
});

export default router;
```

```typescript
// src/app.ts
import usersRouter from './routes/users';

app.use('/api/users', usersRouter);
```

### 2.3. Express Middleware

```typescript
// Authentication middleware
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Logging middleware
const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
};

// Rate limiting middleware
const rateLimitMiddleware = (limit: number, windowMs: number) => {
  const requests = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const timestamps = requests.get(key) || [];

    // Filter out old timestamps
    const recent = timestamps.filter(t => now - t < windowMs);

    if (recent.length >= limit) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    recent.push(now);
    requests.set(key, recent);
    next();
  };
};

// Apply middleware
app.use(loggingMiddleware);
app.use('/api', rateLimitMiddleware(100, 60000)); // 100 requests/minute
app.use('/api/users', authMiddleware, usersRouter);
```

### 2.4. Express Error Handling

```typescript
// Custom error class
class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Not found handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Async error handler wrapper
const asyncHandler = (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Sử dụng async handler
app.get('/users/:id', asyncHandler(async (req: Request, res: Response) => {
  const user = await UserService.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.json(user);
}));

// Global error handler
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message,
    statusCode,
  });
});
```

---

## 3. NestJS

### 3.1. Cài đặt và Setup

```bash
npm i -g @nestjs/cli
nest new project-name
cd project-name
npm install
```

### 3.2. Module Structure

```
src/
├── app.module.ts
├── main.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   └── entities/
│       └── user.entity.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   └── guards/
│       └── jwt-auth.guard.ts
└── common/
    ├── decorators/
    │   └── current-user.decorator.ts
    └── filters/
        └── http-exception.filter.ts
```

### 3.3. Controllers

```typescript
// users.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.usersService.findAll({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
```

### 3.4. Services (Provider)

```typescript
// users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(params: { page: number; limit: number }) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
```

### 3.5. Dependency Injection

```typescript
// config.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly env: Record<string, string>;

  constructor() {
    this.env = process.env as Record<string, string>;
  }

  get(key: string, defaultValue?: string): string {
    return this.env[key] || defaultValue;
  }

  get port(): number {
    return parseInt(this.env.PORT || '3000', 10);
  }

  get databaseUrl(): string {
    return this.env.DATABASE_URL;
  }
}

// users.service.ts - DI tự động
@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: Repository<User>,      // Auto-injected
    private readonly configService: ConfigService,           // Auto-injected
    private readonly emailService: EmailService,             // Auto-injected
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    await this.emailService.sendWelcome(user.email);  // Easy to test with mocks
    return this.userRepository.save(user);
  }
}
```

### 3.6. Modules

```typescript
// users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],  // Export service for other modules
})
export class UsersModule {}

// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Order, Product],
      synchronize: true,  // Only for dev!
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
```

### 3.7. Decorators

```typescript
// Custom decorators
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

// Usage in controller
@Get('profile')
getProfile(@CurrentUser('id') userId: number) {
  return this.usersService.findOne(userId);
}

// Built-in decorators
@Get()
@UseGuards(JwtAuthGuard)
@Roles('admin')
async findAll() {}

// Custom role decorator
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

### 3.8. Guards (Authorization)

```typescript
// jwt-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

// Roles guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

// Usage
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class UsersController {}
```

### 3.9. Interceptors (Cross-cutting concerns)

```typescript
// logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() => {
          const response = context.switchToHttp().getResponse();
          console.log(`${method} ${url} - ${response.statusCode} (${Date.now() - now}ms)`);
        }),
      );
  }
}

// transform.interceptor.ts - Wrap response
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, { success: boolean; data: T }>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ success: boolean; data: T }> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}

// cache.interceptor.ts
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map<string, { data: any; expiry: number }>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const key = `${request.method}:${request.url}`;
    const cached = this.cache.get(key);

    if (cached && cached.expiry > Date.now()) {
      return of(cached.data);
    }

    return next.handle().pipe(
      tap((data) => {
        this.cache.set(key, { data, expiry: Date.now() + 60000 });
      }),
    );
  }
}
```

### 3.10. Pipes và DTOs

```typescript
// create-user.dto.ts
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsEnum(['user', 'admin'])
  role?: string;
}

// update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

// Validation pipe (main.ts)
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule.create());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // Strip non-decorated fields
      forbidNonWhitelisted: true, // Throw error for extra fields
      transform: true,           // Auto-transform types
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(3000);
}
```

### 3.11. Exception Filters

```typescript
// http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}

// all-exceptions.filter.ts - Handle all exceptions including non-HTTP
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Handle database errors, etc.
  }
}
```

---

## 4. So sánh chi tiết

### 4.1. Routing

```typescript
// Express
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  res.json({ id });
});

// NestJS - Declarative
@Get(':id')
findOne(@Param('id') id: string) {
  return { id };
}
```

### 4.2. Middleware vs Guards/Interceptors

| Express | NestJS | Mô tả |
|---|---|---|
| `app.use()` | **Guard** (`canActivate`) | Xác thực/authorization trước handler |
| `app.use()` | **Interceptor** (`intercept`) | Xử lý trước/sau handler (logging, cache, transform) |
| `app.use()` | **Middleware** | Tương tự Express middleware |
| `app.use(err, ...)` | **Exception Filter** (`catch`) | Xử lý errors |
| - | **Pipe** (`transform`) | Validate và transform data |

### 4.3. DI Container

```typescript
// Express: Manual DI
class UserService {
  constructor(private db: DatabaseService) {}
}

const dbService = new DatabaseService(config);
const userService = new UserService(dbService);
const userController = new UserController(userService);

// NestJS: Auto DI
// Chỉ cần declare trong constructor
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
```

### 4.4. Microservices Support

```typescript
// NestJS Microservices - Built-in
// main.ts
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'users_queue',
    },
  });
  await app.listen();
}

// NestJS Gateway
@WebSocketGateway({ cors: true })
export class EventsGateway {
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string) {
    return { event: 'message', data };
  }
}
```

---

## 5. Best Practices

### 5.1. Khi nào chọn Express?

- **Prototype / MVP**: Cần tốc độ phát triển nhanh.
- **Simple APIs**: Ít endpoints, ít business logic phức tạp.
- **Microservices nhẹ**: Mỗi service đơn giản, không cần DI.
- **Learning Node.js**: Dễ hiểu, ít abstraction.
- **Custom architecture**: Cần kiểm soát hoàn toàn cấu trúc.

### 5.2. Khi nào chọn NestJS?

- **Enterprise applications**: Cần structure rõ ràng, scalable.
- **Large team**: Cần convention, dễ onboard.
- **Complex domain logic**: Cần DI, modular architecture.
- **TypeScript-first**: Muốn type safety toàn bộ codebase.
- **Real-time apps**: WebSocket, microservices built-in.
- **Long-term project**: Cần maintainability và testability.

### 5.3. Express Security Best Practices

```typescript
// Security middleware
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

app.use(helmet());  // Security headers
app.use(cors({ origin: 'https://example.com' }));
app.use(compression());

// Rate limiting
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // limit each IP to 100 requests per windowMs
  message: 'Too many requests',
}));

// Input validation
import Joi from 'joi';

const schema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(100).required(),
});

app.post('/users', (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
});
```

### 5.4. NestJS Security Best Practices

```typescript
// Security module
// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

// Global guards
app.useGlobalGuards(new JwtAuthGuard(new JwtService()));
app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
app.useGlobalFilters(new HttpExceptionFilter());

// CORS
app.enableCors({
  origin: ['https://example.com'],
  credentials: true,
});
```

---

## 6. Performance Comparison

### 6.1. Benchmark (Requests/Second)

| Framework | Req/sec (simple) | Req/sec (JSON API) |
|---|---|---|
| Express | ~15,000-30,000 | ~10,000-20,000 |
| NestJS (Express) | ~10,000-20,000 | ~8,000-15,000 |
| Fastify | ~50,000-70,000 | ~30,000-50,000 |
| raw Node.js | ~60,000+ | ~40,000+ |

> **Lưu ý:** Performance khác nhau tuỳ workload, hardware, và configuration. NestJS có overhead nhỏ so với Express, nhưng difference thường không đáng kể trong production.

### 6.2. Reducing NestJS Overhead

```typescript
// Sử dụng Fastify adapter thay vì Express
async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );
  // Performance improvement ~2-3x
}

// Lazy loading modules
@Module({
  imports: [
    // Heavy module - lazy loaded
    HeavyModule.registerAsync({
      useFactory: () => import('./heavy/heavy.module').then(m => m.HeavyModule),
    }),
  ],
})
```

---

## 7. Testing

### 7.1. Express Testing

```typescript
// users.test.ts
import request from 'supertest';
import app from '../app';
import { User } from '../models/user';

describe('Users API', () => {
  beforeEach(() => {
    users = [];  // Reset data
  });

  describe('GET /users', () => {
    it('should return empty array', async () => {
      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return users', async () => {
      await User.create({ name: 'Test', email: 'test@example.com' });
      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe('POST /users', () => {
    it('should create user', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 'Test', email: 'test@example.com' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
    });
  });
});
```

### 7.2. NestJS Testing

```typescript
// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: 1, name: 'Test', email: 'test@example.com' }];
      mockRepository.findAndCount.mockResolvedValue([users, 1]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual(users);
      expect(result.meta.total).toBe(1);
    });
  });
});
```

```typescript
// users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let mockService;

  beforeEach(async () => {
    mockService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
```

---

## 8. Summary Decision Matrix

| Tiêu chí | Express | NestJS |
|---|---|---|
| Team nhỏ, deadline ngắn | Vot | |
| Team lớn, dự án dài hạn | | Vot |
| Cần DI và testing infrastructure | | Vot |
| Microservices phức tạp | | Vot |
| Prototype nhanh | Vot | |
| Cần full control kiến trúc | Vot | |
| Real-time apps (WebSockets) | | Vot |
| Simple CRUD API | Vot | |
| TypeScript mandatory | | Vot |
| Low overhead critical | Vot | |
| Enterprise pattern compliance | | Vot |
| Learning Node.js | Vot | |
