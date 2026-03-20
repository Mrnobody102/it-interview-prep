# Python Backend

## 19. Django & FastAPI

### 19.1. Django

#### 19.1.1. Overview

Django is a **high-level, batteries-included** Python web framework that encourages rapid development and clean, pragmatic design.

| Property | Description |
|---|---|
| **Architecture** | MVT (Model-View-Template) |
| **ORM** | Built-in Django ORM (Active Record style) |
| **Admin Panel** | Auto-generated admin interface |
| **Authentication** | Built-in user auth system |
| **Migrations** | Built-in migration system |
| **Learning curve** | Medium |
| **Best for** | Full-stack apps, content sites, admin-heavy apps |

#### 19.1.2. MVT Architecture

| Component | Responsibility | Django Term |
|---|---|---|
| **Model** | Database schema and operations | `models.py` |
| **View** | Business logic and request handling | `views.py` |
| **Template** | HTML rendering | `templates/*.html` |

> **Note:** Django's "View" is closer to a "Controller" in MVC terminology.

#### 19.1.3. Django Code Examples

```python
# models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class User(AbstractUser):
    """Custom user model extending Django's AbstractUser."""
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']


class Post(models.Model):
    """Blog post model."""
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='posts'
    )
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    status = models.CharField(
        max_length=10,
        choices=[
            ('draft', 'Draft'),
            ('published', 'Published'),
        ],
        default='draft'
    )
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField('Tag', related_name='posts', blank=True)

    class Meta:
        ordering = ['-published_at']
        indexes = [
            models.Index(fields=['-published_at']),
            models.Index(fields=['slug']),
        ]

    def __str__(self):
        return self.title

    def publish(self):
        """Publish the post."""
        self.status = 'published'
        self.published_at = timezone.now()
        self.save()
```

```python
# views.py
from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, DetailView, CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from .models import Post
from .forms import PostForm


# Function-based view
def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug, status='published')
    return render(request, 'blog/post_detail.html', {'post': post})


# Class-based view: List all posts
class PostListView(ListView):
    model = Post
    context_object_name = 'posts'
    paginate_by = 20
    template_name = 'blog/post_list.html'

    def get_queryset(self):
        return Post.objects.filter(status='published').select_related('author')


# Class-based view: Create a post
class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    form_class = PostForm
    template_name = 'blog/post_form.html'
    success_url = reverse_lazy('post-list')

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)
```

```python
# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostListView.as_view(), name='post-list'),
    path('<slug:slug>/', views.post_detail, name='post-detail'),
    path('create/', views.PostCreateView.as_view(), name='post-create'),
]
```

```python
# forms.py
from django import forms
from .models import Post


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'slug', 'content', 'status', 'tags']
        widgets = {
            'content': forms.Textarea(attrs={'rows': 10}),
        }

    def clean_slug(self):
        slug = self.cleaned_data['slug']
        if Post.objects.filter(slug=slug).exclude(pk=self.instance.pk).exists():
            raise forms.ValidationError('A post with this slug already exists.')
        return slug
```

```python
# serializers.py (using Django REST Framework)
from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'content', 'status',
                  'author_name', 'published_at', 'created_at']
        read_only_fields = ['author']

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)
```

---

### 19.2. FastAPI

#### 19.2.1. Overview

FastAPI is a **modern, fast (high-performance)** Python web framework for building APIs with Python 3.7+ type hints, powered by Starlette and Pydantic.

| Property | Description |
|---|---|
| **Performance** | One of the fastest Python frameworks (async by default) |
| **Type validation** | Automatic via Pydantic |
| **Documentation** | Auto-generated OpenAPI/Swagger UI |
| **Async** | Native async/await support |
| **Learning curve** | Low (Pythonic) |
| **Best for** | REST APIs, microservices, data-intensive APIs |

#### 19.2.2. FastAPI Code Examples

```python
# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
import uvicorn

app = FastAPI(
    title="My API",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc",  # ReDoc
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://example.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models
class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserResponse(UserBase):
    id: int
    is_active: bool = True

    class Config:
        from_attributes = True


class PostBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str


class PostCreate(PostBase):
    pass


class PostResponse(PostBase):
    id: int
    author_id: int
    created_at: str

    class Config:
        from_attributes = True


# In-memory database for demo
db_users = {}
db_posts = {}


# Routes
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "my-api"}


@app.post("/api/v1/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate):
    for u in db_users.values():
        if u.email == user.email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )

    user_id = len(db_users) + 1
    new_user = UserResponse(id=user_id, name=user.name, email=user.email)
    db_users[user_id] = {"name": user.name, "email": user.email, "password": user.password}
    return new_user


@app.get("/api/v1/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int):
    if user_id not in db_users:
        raise HTTPException(status_code=404, detail="User not found")
    user_data = db_users[user_id]
    return UserResponse(id=user_id, name=user_data["name"], email=user_data["email"])


@app.post("/api/v1/posts", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(post: PostCreate, author_id: int = 1):
    post_id = len(db_posts) + 1
    db_posts[post_id] = {
        "id": post_id,
        "title": post.title,
        "content": post.content,
        "author_id": author_id,
    }
    return PostResponse(**db_posts[post_id], created_at="2024-01-01T00:00:00Z")


# Run with: uvicorn main:app --reload
```

```python
# Using dependency injection
from fastapi import Depends, Header

def get_current_user(authorization: str = Header(...)):
    """Extract and validate JWT token."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization.replace("Bearer ", "")
    # Verify JWT and return user
    return {"user_id": 1, "email": "alice@example.com"}


@app.get("/api/v1/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    """Protected endpoint using dependency injection."""
    user_data = db_users[current_user["user_id"]]
    return UserResponse(id=current_user["user_id"], name=user_data["name"], email=user_data["email"])
```

### 19.3. Django vs. FastAPI Comparison

| Aspect | Django | FastAPI |
|---|---|---|
| **Architecture** | MVT, batteries-included | Minimal, async-first |
| **ORM** | Django ORM (built-in) | SQLAlchemy or Tortoise (separate) |
| **Admin panel** | Built-in | Not included |
| **Async support** | Limited (async views) | Full async/await |
| **Performance** | Good | Excellent (async) |
| **API support** | REST (DRF) | Native REST (built-in) |
| **WebSocket** | Yes (channels) | Yes (native) |
| **Type validation** | Manual or DRF serializers | Automatic via Pydantic |
| **Documentation** | Manual | Auto-generated |
| **Learning curve** | Medium | Low |

> **Tip:** Use **Django** when you need a full-stack framework with admin panels, user authentication, and database management built in. Use **FastAPI** for high-performance REST APIs, microservices, or when async/await is a priority.
