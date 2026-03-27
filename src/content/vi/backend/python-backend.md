# Python Backend

## Tổng quan

Python backend frameworks phổ biến: FastAPI (hiện đại, async), Django (full-stack), Flask (lightweight). Python nổi tiếng về readability, productivity, và ecosystem phong phú cho ML/data.

### Đặc điểm cốt lõi

| Đặc điểm | Mô tả |
|-----------|--------|
| **Async/await** | Async I/O với asyncio, FastAPI |
| **Type hints** | Static typing với mypy |
| **Rich ecosystem** | Django, FastAPI, SQLAlchemy, Pydantic |
| **Productivity** | Syntax đơn giản, nhanh phát triển |

## FastAPI (Hiện đại)

### Basic API

```python
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
import asyncio

app = FastAPI()

# Pydantic models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    age: Optional[int] = None

class User(BaseModel):
    id: int
    name: str
    email: str
    age: Optional[int]

# In-memory DB
users_db: dict[int, User] = {}
next_id = 1

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/users/{user_id}", response_model=User)
def get_user(user_id: int):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return users_db[user_id]

@app.post("/users", response_model=User, status_code=201)
def create_user(user: UserCreate):
    global next_id
    new_user = User(id=next_id, **user.model_dump())
    users_db[next_id] = new_user
    next_id += 1
    return new_user

@app.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: int):
    if user_id not in users_db:
        raise HTTPException(status_code=404)
    del users_db[user_id]
```

### Async Endpoints

```python
@app.get("/users/{user_id}/posts")
async def get_user_posts(user_id: int):
    # Async database query
    posts = await db.fetch(
        "SELECT * FROM posts WHERE user_id = $1", user_id
    )
    return posts

@app.post("/process")
async def process_data(data: DataModel):
    # Chạy CPU-bound trong thread pool
    result = await asyncio.to_thread(heavy_processing, data)
    return {"result": result}
```

### Dependency Injection

```python
from fastapi import Depends

async def get_db():
    async with Database("connection_string") as db:
        yield db

@app.get("/posts")
async def list_posts(
    db: Database = Depends(get_db),
    limit: int = 10,
    offset: int = 0
):
    posts = await db.fetch(
        "SELECT * FROM posts LIMIT $1 OFFSET $2",
        limit, offset
    )
    return posts

# Multiple dependencies
async def verify_token(token: str = Depends(get_current_user)):
    return token
```

## SQLAlchemy (ORM)

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# Setup
engine = create_engine("postgresql://user:pass@localhost/db")
SessionLocal = sessionmaker(bind=engine)

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True)

# Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Usage in FastAPI
@app.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Query
users = db.query(User).filter(User.email == email).first()
posts = db.query(Post).join(User).filter(User.name == "Alice").all()
```

## Pydantic (Validation)

```python
from pydantic import BaseModel, Field, validator, ConfigDict

class User(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    id: int
    name: str = Field(..., min_length=1, max_length=100)
    email: str
    age: int = Field(ge=0, le=150)
    created_at: datetime = Field(default_factory=datetime.now)

    @validator("email")
    def validate_email(cls, v):
        if "@" not in v:
            raise ValueError("Invalid email")
        return v.lower()

    @validator("name")
    def validate_name(cls, v):
        if v.strip() == "":
            raise ValueError("Name cannot be empty")
        return v.title()
```

## Câu hỏi phỏng vấn

### 1. FastAPI vs Flask vs Django?

**Flask**: lightweight, flexible, manual routing — tốt cho microservices nhỏ. **Django**: full-stack, admin panel, ORM — tốt cho large apps truyền thống. **FastAPI**: async native, auto OpenAPI docs, Pydantic validation — tốt nhất cho modern APIs.

### 2. Async/await trong Python?

`async` định nghĩa coroutine. `await` tạm dừng coroutine để đợi kết quả từ I/O operation. Chỉ dùng async cho I/O-bound tasks. CPU-bound tasks nên dùng `asyncio.to_thread()` hoặc `ProcessPoolExecutor`.

### 3. SQLAlchemy Session vs Engine?

**Engine**: connection pool quản lý connection tới database. **Session**: unit of work quản lý ORM operations. Session → SQLAlchemy ORM queries. Engine → Raw SQL queries.

### 4. Pydantic BaseModel vs TypedDict?

`BaseModel` tạo class với validation, serialization. `TypedDict` chỉ type hint, không validation. Dùng BaseModel cho API input/output, TypedDict cho internal data structures.
