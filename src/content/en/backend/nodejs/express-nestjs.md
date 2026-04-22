# Node.js Backend

## 1. Express & NestJS

### 1.1. Express.js

#### 1.1.1. Overview

Express.js is a **minimal and flexible** Node.js web framework that provides a thin layer of fundamental web application features without obscuring Node.js capabilities.

| Property | Description |
|---|---|
| **Philosophy** | Minimal, unopinionated |
| **Learning curve** | Low |
| **Structure** | You decide (middleware-based) |
| **Middleware** | Huge ecosystem (passport, cors, helmet, morgan) |
| **Best for** | APIs, prototypes, small-to-medium apps |

#### 1.1.2. Basic Express Setup

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: ['https://example.com'],
  credentials: true,
}));

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/v1/users', async (req, res) => {
  try {
    const users = await userService.findAll();
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/v1/users/:id', async (req, res) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/v1/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await userService.create({ name, email });
    res.status(201).json({ data: user });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### 1.1.3. Express Router (Modular Routes)

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');

// GET /users
router.get('/', async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const users = await User.findAll({
    offset: (page - 1) * limit,
    limit: Number(limit),
  });
  res.json({ data: users, page: Number(page), limit: Number(limit) });
});

// GET /users/:id
router.get('/:id',
  param('id').isUUID(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await User.findById(req.params.id);
    res.json({ data: user });
  }
);

// POST /users
router.post('/',
  body('name').isString().notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json({ data: user });
  }
);

module.exports = router;

// In server.js:
// app.use('/api/v1/users', require('./routes/users'));
```

---

### 1.2. NestJS

#### 1.2.1. Overview

NestJS is a **progressive Node.js framework** for building efficient, reliable, and scalable server-side applications. It uses TypeScript and is heavily inspired by Angular's architecture.

| Property | Description |
|---|---|
| **Architecture** | Modular, layered (Controllers → Services → Repositories) |
| **Dependency Injection** | Built-in IoC container |
| **Language** | TypeScript (strongly typed) |
| **Decorators** | Heavy use of decorators for routing, validation, etc. |
| **Best for** | Enterprise-grade, large-scale applications |

#### 1.2.2. Project Structure

```
src/
├── main.ts                    # Application bootstrap
├── app.module.ts              # Root module
├── users/
│   ├── users.module.ts        # Feature module
│   ├── users.controller.ts    # HTTP endpoints
│   ├── users.service.ts       # Business logic
│   ├── users.repository.ts   # Data access
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   └── entities/
│       └── user.entity.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── strategies/
│       └── jwt.strategy.ts
└── common/
    ├── decorators/
    ├── filters/
    ├── guards/
    └── interceptors/
```

#### 1.2.3. NestJS Code Examples

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api/v1');

  await app.listen(3000);
}
bootstrap();
```

```typescript
// user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

```typescript
// create-user.dto.ts
import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;
}
```

```typescript
// users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.usersService.findAll({ page, limit });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

```typescript
// users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll({ page = 1, limit = 20 }) {
    const [data, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }
}
```

### 1.3. Express vs. NestJS Comparison

| Aspect | Express | NestJS |
|---|---|---|
| **Architecture** | DIY (middleware chain) | Convention-based (modules) |
| **TypeScript** | Optional | First-class |
| **Dependency Injection** | Manual (e.g., `awilix`) | Built-in |
| **Testing** | Manual setup | Built-in testing utilities |
| **Validation** | Manual or `express-validator` | `class-validator` + `class-transformer` |
| **ORM integration** | Manual | TypeORM, Prisma adapters |
| **API documentation** | Manual or `swagger-ui-express` | `@nestjs/swagger` |
| **Performance** | Slightly faster (less overhead) | Slightly slower (more abstractions) |
| **Flexibility** | High (you control everything) | Medium (conventions guide you) |

> **Tip:** Use **Express** for lightweight APIs, microservices, or when you need full control. Use **NestJS** for large enterprise applications where conventions, dependency injection, and structured architecture provide long-term maintainability benefits.
