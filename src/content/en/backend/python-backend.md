# Python Backend

## Overview

Python backend frameworks: FastAPI (modern, async), Django (full-stack), Flask (lightweight). Python famous for readability, productivity, and rich ML/data ecosystem.

### Key Features

| Feature | Description |
|---------|-------------|
| **Async/await** | Async I/O with asyncio, FastAPI |
| **Type hints** | Static typing with mypy |
| **Rich ecosystem** | Django, FastAPI, SQLAlchemy, Pydantic |
| **Productivity** | Simple syntax, fast development |

## FastAPI (Modern)

### Basic API

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr

app = FastAPI()

class UserCreate(BaseModel):
    name: str
    email: EmailStr

class User(UserCreate):
    id: int

users_db: dict[int, User] = {}

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
    return new_user
```

### Async Endpoints

```python
@app.get("/users/{user_id}/posts")
async def get_user_posts(user_id: int):
    posts = await db.fetch(
        "SELECT * FROM posts WHERE user_id = $1", user_id
    )
    return posts

@app.post("/process")
async def process_data(data: DataModel):
    result = await asyncio.to_thread(heavy_processing, data)
    return {"result": result}
```

### Dependency Injection

```python
async def get_db():
    async with Database("connection_string") as db:
        yield db

@app.get("/posts")
async def list_posts(
    db: Database = Depends(get_db),
    limit: int = 10
):
    return await db.fetch("SELECT * FROM posts LIMIT $1", limit)
```

## SQLAlchemy (ORM)

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

engine = create_engine("postgresql://user:pass@localhost/db")
SessionLocal = sessionmaker(bind=engine)

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    return db_user
```

## Pydantic (Validation)

```python
from pydantic import BaseModel, Field, field_validator
from datetime import datetime

class User(BaseModel):
    id: int
    name: str = Field(..., min_length=1, max_length=100)
    email: str
    age: int = Field(ge=0, le=150)

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        if "@" not in v:
            raise ValueError("Invalid email")
        return v.lower()
```

## Common Interview Questions

### 1. FastAPI vs Flask vs Django?

**Flask**: lightweight, flexible, manual routing — good for small microservices. **Django**: full-stack, admin panel, ORM — good for large traditional apps. **FastAPI**: async native, auto OpenAPI docs, Pydantic validation — best for modern APIs.

### 2. Async/await in Python?

`async` defines a coroutine. `await` suspends the coroutine to wait for I/O. Only use async for I/O-bound tasks. CPU-bound tasks should use `asyncio.to_thread()` or `ProcessPoolExecutor`.

### 3. SQLAlchemy Session vs Engine?

**Engine**: connection pool managing database connections. **Session**: unit of work managing ORM operations. Session -> SQLAlchemy ORM queries. Engine -> raw SQL queries.

### 4. Pydantic BaseModel vs TypedDict?

`BaseModel` creates classes with validation and serialization. `TypedDict` is only type hints, no validation. Use BaseModel for API input/output, TypedDict for internal data structures.
