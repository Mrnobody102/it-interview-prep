# Python Backend

## Django & FastAPI

### Overview

Python has two major web frameworks: Django and FastAPI. Django is a full-stack framework with batteries included, while FastAPI is a modern, async-first framework for building APIs.

### Django

**Django** is a high-level, batteries-included Python web framework released in 2005. Django follows the "batteries included" philosophy - it provides almost everything you need to build a web application: ORM, authentication, admin panel, forms, caching, and internationalization. It is well-suited for large, enterprise applications.

### FastAPI

**FastAPI** is a modern Python web framework released in 2018. Built on top of Starlette (ASGI framework) and Pydantic (data validation), FastAPI stands out with async support, automatic API documentation (Swagger/OpenAPI), and native type hints support. It is ideal for microservices, REST APIs, and data-intensive applications.

### High-Level Comparison

| Criteria | Django | FastAPI |
|---|---|---|
| **Philosophy** | Batteries included | Minimalist, async-first |
| **ORM** | Django ORM (built-in) | SQLAlchemy / others |
| **Async support** | Limited (Django 3.1+) | Full async support |
| **Data validation** | Forms, DRF serializers | Pydantic (native) |
| **Documentation** | Manual | Auto Swagger/OpenAPI |
| **Learning curve** | Higher (more conventions) | Lower (Pythonic) |
| **Performance** | Good | Very good (async) |
| **Database** | Built-in ORM | External (SQLAlchemy, Tortoise) |
| **Admin panel** | Yes (built-in) | No |
| **Authentication** | Yes (built-in) | OAuth, JWT (manual) |
| **Best use case** | Full-stack apps, CMS, social | APIs, microservices, ML |
| **Type hints** | Optional | Native |

---

## Django

### Project Setup

```bash
# Install Django
pip install django
django-admin startproject myproject
cd myproject
python manage.py startapp myapp

# Create models, views, urls
# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver
```

### MVT Pattern

**MVT (Model-View-Template)** is Django's architectural pattern:

```
Request
  │
  ▼
URL Dispatcher (urls.py)
  │
  ▼
View (views.py) ──────► Model (models.py)
  │                            │
  │                            │
  │ (Template + Context) ◄──────┘
  │
  ▼
Template (HTML)
  │
  ▼
Response
```

> **Note:** Django's "View" is closer to a "Controller" in traditional MVC terminology.

### Django Models

```python
# models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'
        ARCHIVED = 'archived', 'Archived'

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200)
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products'
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    description = models.TextField()
    image = models.ImageField(
        upload_to='products/',
        null=True,
        blank=True
    )
    stock = models.PositiveIntegerField(default=0)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status', 'created_at']),
        ]

    def __str__(self):
        return self.name

    @property
    def current_price(self):
        return self.discount_price or self.price


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        SHIPPED = 'shipped', 'Shipped'
        DELIVERED = 'delivered', 'Delivered'
        CANCELLED = 'cancelled', 'Cancelled'

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    shipping_address = models.TextField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.id} - {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT
    )
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    @property
    def subtotal(self):
        return self.quantity * self.price
```

### Django ORM Queries

```python
# views.py
from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.db.models import Q, Count, Sum, Avg, F
from django.core.paginator import Paginator
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Product, Order, Category


# Function-Based View
def product_list(request, category_slug=None):
    products = Product.objects.filter(status='published')
    categories = Category.objects.all()

    if category_slug:
        category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=category)

    # Filter by search
    search = request.GET.get('search')
    if search:
        products = products.filter(
            Q(name__icontains=search) |
            Q(description__icontains=search)
        )

    # Sorting
    sort = request.GET.get('sort', '-created_at')
    products = products.order_by(sort)

    # Pagination
    paginator = Paginator(products, 20)
    page = request.GET.get('page')
    products = paginator.get_page(page)

    return render(request, 'myapp/product_list.html', {
        'products': products,
        'categories': categories,
        'current_category': category_slug,
    })


# Class-Based View
class ProductDetailView(DetailView):
    model = Product
    template_name = 'myapp/product_detail.html'
    context_object_name = 'product'
    slug_field = 'slug'
    slug_url_kwarg = 'slug'


# Complex Query Examples
def analytics(request):
    # Top selling products
    top_products = Product.objects.annotate(
        order_count=Count('orderitem')
    ).order_by('-order_count')[:10]

    # Revenue by category
    revenue_by_category = Category.objects.annotate(
        total_revenue=Sum(
            F('products__orderitem__price') *
            F('products__orderitem__quantity')
        )
    ).order_by('-total_revenue')

    # Average order value
    avg_order_value = Order.objects.aggregate(
        avg_value=Avg('total_amount')
    )

    return render(request, 'myapp/analytics.html', {
        'top_products': top_products,
        'revenue_by_category': revenue_by_category,
        'avg_order_value': avg_order_value,
    })


# Create/Update/Delete Views
class OrderCreateView(LoginRequiredMixin, CreateView):
    model = Order
    fields = ['shipping_address', 'notes']
    template_name = 'myapp/order_form.html'
    success_url = reverse_lazy('order_list')

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)
```

### Django Views and Templates

```python
# Class-Based Views (CBVs)
from django.views.generic import TemplateView, RedirectView

class HomeView(TemplateView):
    template_name = 'home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['featured_products'] = Product.objects.filter(
            status='published'
        )[:8]
        context['categories'] = Category.objects.all()
        return context


# Mixins
class ProductListView(LoginRequiredMixin, ListView):
    model = Product
    template_name = 'products.html'
    context_object_name = 'products'
    paginate_by = 20

    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.GET.get('status')
        if status:
            queryset = queryset.filter(status=status)
        return queryset.filter(user=self.request.user)
```

```html
<!-- templates/myapp/product_list.html -->
{% extends 'base.html' %}
{% load static %}

{% block content %}
<div class="container">
  <div class="row">
    <!-- Sidebar -->
    <div class="col-md-3">
      <h5>Categories</h5>
      <ul class="list-group">
        <li class="list-group-item {% if not current_category %}active{% endif %}">
          <a href="{% url 'product_list' %}">All Products</a>
        </li>
        {% for category in categories %}
        <li class="list-group-item {% if current_category == category.slug %}active{% endif %}">
          <a href="{% url 'product_list' category.slug %}">
            {{ category.name }}
          </a>
        </li>
        {% endfor %}
      </ul>
    </div>

    <!-- Product Grid -->
    <div class="col-md-9">
      <div class="row">
        {% for product in products %}
        <div class="col-md-4 mb-4">
          <div class="card">
            {% if product.image %}
            <img src="{{ product.image.url }}" class="card-img-top"
                 alt="{{ product.name }}">
            {% endif %}
            <div class="card-body">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="card-text">
                <span class="text-muted">
                  <s>${{ product.price }}</s>
                </span>
                <strong>${{ product.current_price }}</strong>
              </p>
              <a href="{% url 'product_detail' product.slug %}"
                 class="btn btn-primary">View Details</a>
            </div>
          </div>
        </div>
        {% empty %}
        <p>No products found.</p>
        {% endfor %}
      </div>

      <!-- Pagination -->
      {% if products.has_other_pages %}
      <nav>
        <ul class="pagination">
          {% if products.has_previous %}
          <li class="page-item">
            <a class="page-link" href="?page=1">First</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="?page={{ products.previous_page_number }}">
              Previous
            </a>
          </li>
          {% endif %}
        </ul>
      </nav>
      {% endif %}
    </div>
  </div>
</div>
{% endblock %}
```

### Django Forms

```python
# forms.py
from django import forms
from django.core.exceptions import ValidationError
from .models import Product, Order


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = [
            'name', 'category', 'price', 'discount_price',
            'description', 'image', 'stock', 'status'
        ]
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
            'status': forms.Select(),
        }

    def clean_price(self):
        price = self.cleaned_data.get('price')
        if price and price < 0:
            raise ValidationError('Price must be positive')
        return price

    def clean(self):
        cleaned_data = super().clean()
        discount = cleaned_data.get('discount_price')
        price = cleaned_data.get('price')

        if discount and price and discount >= price:
            raise ValidationError(
                'Discount price must be less than regular price'
            )
        return cleaned_data


class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ['shipping_address', 'notes']
        widgets = {
            'notes': forms.Textarea(attrs={'rows': 3}),
        }
```

### Django Admin

```python
# admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Product, Order, OrderItem, Category


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price']
    can_delete = False


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock', 'status', 'created_at']
    list_filter = ['status', 'category', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_per_page = 50
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'slug', 'category', 'status')
        }),
        ('Pricing', {
            'fields': ('price', 'discount_price')
        }),
        ('Inventory', {
            'fields': ('stock', 'image')
        }),
        ('Details', {
            'fields': ('description',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__username', 'shipping_address']
    readonly_fields = ['created_at', 'updated_at', 'total_amount']
    inlines = [OrderItemInline]

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        # Calculate total
        order = form.instance
        total = sum(
            item.subtotal for item in order.items.all()
        )
        Order.objects.filter(pk=order.pk).update(total_amount=total)
```

---

## FastAPI

### Project Setup

```bash
# Install FastAPI
pip install fastapi uvicorn[standard] pydantic
# Or with all dependencies
pip install fastapi[all]

# Run server
uvicorn main:app --reload
# Or
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### FastAPI Basics

```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="My API",
    description="FastAPI-powered REST API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://example.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello, World!"}
```

### Pydantic Models

Pydantic provides powerful data validation and serialization using Python type annotations.

```python
# schemas.py
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from pydantic.functional_validators import model_validator
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from enum import Enum


class ProductStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


# Base schema
class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    price: Decimal = Field(..., gt=0, decimal_places=2)
    discount_price: Optional[Decimal] = Field(None, gt=0)
    stock: int = Field(0, ge=0)


# Create schema
class ProductCreate(ProductBase):
    category_id: int


# Update schema
class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    price: Optional[Decimal] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)


# Response schema
class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    status: ProductStatus
    category_id: int
    created_at: datetime
    updated_at: datetime

    @property
    def current_price(self) -> Decimal:
        return self.discount_price or self.price


# Nested schemas
class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=100)


class CategoryResponse(CategoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_count: int = 0


class ProductWithCategory(ProductResponse):
    category: CategoryResponse


# Pagination
class PaginatedResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    limit: int
    total_pages: int


# Pydantic validators
class OrderCreate(BaseModel):
    shipping_address: str = Field(..., min_length=10)
    notes: Optional[str] = None

    @model_validator(mode='after')
    def validate_order(self):
        if len(self.shipping_address.strip()) < 10:
            raise ValueError(
                'Shipping address must be at least 10 characters'
            )
        return self
```

### FastAPI Routes

```python
# main.py (continued)
from fastapi import FastAPI, Depends, HTTPException, Query, Path, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List
from decimal import Decimal
from datetime import datetime

from .database import get_db
from . import models, schemas


# GET with pagination
@app.get("/products", response_model=PaginatedResponse)
async def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    category_id: Optional[int] = None,
    min_price: Optional[Decimal] = Query(None, ge=0),
    max_price: Optional[Decimal] = Query(None, ge=0),
    status: Optional[ProductStatus] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Product)

    # Filters
    if search:
        query = query.filter(
            models.Product.name.ilike(f"%{search}%")
        )
    if category_id:
        query = query.filter(
            models.Product.category_id == category_id
        )
    if min_price:
        query = query.filter(models.Product.price >= min_price)
    if max_price:
        query = query.filter(models.Product.price <= max_price)
    if status:
        query = query.filter(models.Product.status == status)

    # Count total
    total = query.count()

    # Pagination
    skip = (page - 1) * limit
    products = query.order_by(
        models.Product.created_at.desc()
    ).offset(skip).limit(limit).all()

    return {
        "items": products,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit,
    }


# GET single item
@app.get("/products/{product_id}", response_model=schemas.ProductResponse)
async def get_product(
    product_id: int = Path(..., ge=1),
    db: Session = Depends(get_db),
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    return product


# POST (Create)
@app.post("/products", response_model=schemas.ProductResponse, status_code=201)
async def create_product(
    product_data: schemas.ProductCreate,
    db: Session = Depends(get_db),
):
    # Check category exists
    category = db.query(models.Category).filter(
        models.Category.id == product_data.category_id
    ).first()

    if not category:
        raise HTTPException(
            status_code=400,
            detail="Category not found"
        )

    # Create product
    product = models.Product(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)

    return product


# PUT (Update)
@app.put("/products/{product_id}", response_model=schemas.ProductResponse)
async def update_product(
    product_id: int,
    product_data: schemas.ProductUpdate,
    db: Session = Depends(get_db),
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # Update only provided fields
    update_data = product_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)

    return product


# DELETE
@app.delete("/products/{product_id}", status_code=204)
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()

    return None
```

### Async FastAPI with SQLAlchemy

```python
# database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

DATABASE_URL = "postgresql+asyncpg://user:pass@localhost/mydb"

engine = create_async_engine(DATABASE_URL, echo=True)
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()


async def get_db():
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()
```

```python
# models.py (SQLAlchemy)
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship, Mapped
from sqlalchemy.sql import func
from .database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)

    products: Mapped[List["Product"]] = relationship(
        "Product", back_populates="category"
    )


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True)
    description = Column(Text, nullable=True)
    price = Column(Integer)  # Store as cents to avoid float issues
    discount_price = Column(Integer, nullable=True)
    stock = Column(Integer, default=0)
    status = Column(String(20), default="draft")
    category_id = Column(Integer, ForeignKey("categories.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    category: Mapped["Category"] = relationship("Category", back_populates="products")
```

```python
# Async routes
@app.get("/products/async")
async def get_products_async(
    page: int = 1,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    # Async query
    result = await db.execute(
        select(Product)
        .order_by(Product.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
    )
    products = result.scalars().all()

    return products


@app.post("/products/async", status_code=201)
async def create_product_async(
    product_data: schemas.ProductCreate,
    db: AsyncSession = Depends(get_db),
):
    product = Product(**product_data.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)

    return product
```

---

## ORM: Django ORM vs SQLAlchemy

### Django ORM

```python
# Django ORM - Query Examples

# Basic CRUD
product = Product.objects.create(name="Laptop", price=999.99)
product = Product.objects.get(id=1)
products = Product.objects.filter(status="published")
Product.objects.filter(id=1).update(stock=10)
Product.objects.filter(id=1).delete()

# Related queries
category = Category.objects.get(slug="electronics")
products = category.products.filter(status="published")

# Annotations
from django.db.models import Count, Avg, F, Q, Subquery, OuterRef

# Product with order count
products = Product.objects.annotate(
    order_count=Count('orderitem')
).order_by('-order_count')

# Subquery
latest_order = Order.objects.filter(
    user=OuterRef('user_id')
).order_by('-created_at').values('total_amount')[:1]

users = User.objects.annotate(
    last_order_amount=Subquery(latest_order)
)

# Aggregation
from django.db.models import Sum, Count, Avg

revenue = Order.objects.aggregate(
    total=Sum('total_amount'),
    avg_order=Avg('total_amount'),
    order_count=Count('id')
)

# Prefetch related (avoid N+1)
products = Product.objects.prefetch_related(
    'category',
    'orderitem_set'
).select_related('category')

# Raw SQL
products = Product.objects.raw(
    "SELECT * FROM products WHERE price > %s",
    [100]
)
```

### SQLAlchemy

```python
# SQLAlchemy - Query Examples

from sqlalchemy import select, update, delete, func, and_, or_
from sqlalchemy.orm import selectinload, joinedload

# Basic CRUD
product = Product(name="Laptop", price=999.99)
db.add(product)
db.commit()

product = db.execute(select(Product).where(Product.id == 1)).scalar_one()
products = db.execute(select(Product).where(Product.status == "published")).scalars().all()

db.execute(update(Product).where(Product.id == 1).values(stock=10))
db.execute(delete(Product).where(Product.id == 1))
db.commit()

# Related queries
products = db.execute(
    select(Product)
    .join(Category)
    .where(Category.slug == "electronics")
).scalars().all()

# Complex queries
from sqlalchemy import desc

result = db.execute(
    select(Product)
    .where(
        and_(
            Product.status == "published",
            or_(
                Product.price < 100,
                Product.discount_price.isnot(None)
            )
        )
    )
    .order_by(desc(Product.created_at))
    .limit(20)
).scalars().all()

# Aggregation
from sqlalchemy import func, count

stats = db.execute(
    select(
        Category.name,
        func.count(Product.id).label('product_count'),
        func.avg(Product.price).label('avg_price')
    )
    .join(Product)
    .group_by(Category.id, Category.name)
    .having(func.count(Product.id) > 5)
).all()

# Eager loading (avoid N+1)
products = db.execute(
    select(Product)
    .options(
        selectinload(Product.category),
        selectinload(Product.order_items)
    )
    .where(Product.status == "published")
).scalars().unique().all()
```

---

## FastAPI with Django ORM

```python
# Combining FastAPI + Django ORM
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from fastapi import FastAPI, Depends, HTTPException
from django.contrib.auth.models import User
from django.db.models import Count
from myapp.models import Product

app = FastAPI()


@app.get("/products")
async def get_products():
    products = Product.objects.annotate(
        order_count=Count('orderitem')
    ).order_by('-created_at')[:20]

    return [
        {
            "id": p.id,
            "name": p.name,
            "price": float(p.price),
            "order_count": p.order_count,
        }
        for p in products
    ]
```

---

## Authentication

### Django Authentication

```python
# Django built-in authentication
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView, PasswordChangeView

# Login view (built-in)
# urls.py
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('password_change/', auth_views.PasswordChangeView.as_view(), name='password_change'),
    path('password_change/done/', auth_views.PasswordChangeDoneView.as_view(), name='password_change_done'),
]

# Custom login
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            return render(request, 'login.html', {'error': 'Invalid credentials'})

    return render(request, 'login.html')


# Protect views
@login_required
def profile(request):
    return render(request, 'profile.html', {'user': request.user})
```

### FastAPI Authentication

```python
# FastAPI JWT authentication
# auth.py
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception

    return {"username": token_data.username}


# Login endpoint
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate(username=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# Protected route
@app.get("/users/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return {"username": current_user['username']}
```

---

## REST API Examples

### Django REST Framework

```python
# Django REST Framework
# serializers.py
from rest_framework import serializers
from .models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'product_count']

    def get_product_count(self, obj):
        return obj.products.count()


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'category_name',
            'price', 'discount_price', 'stock',
            'description', 'status', 'created_at', 'updated_at'
        ]


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list view"""
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'price', 'discount_price', 'status']


# views.py
from rest_framework import viewsets, filters, pagination
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer


class ProductPagination(pagination.PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = ProductPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset.select_related('category').prefetch_related('orderitem_set')

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured = self.get_queryset().filter(status='published')[:8]
        serializer = ProductListSerializer(featured, many=True)
        return Response(serializer.data)
```

### FastAPI REST API

```python
# FastAPI REST API pattern
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

router = APIRouter(prefix="/api/v1", tags=["Products"])


@router.get("/products", response_model=PaginatedResponse)
async def list_products(
    page: int = 1,
    limit: int = 20,
    search: str = None,
    db: AsyncSession = Depends(get_db),
):
    # Implementation
    pass


@router.post("/products", status_code=201, response_model=schemas.ProductResponse)
@router.put("/products/{id}", response_model=schemas.ProductResponse)
@router.delete("/products/{id}", status_code=204)
```

---

## Best Practices

### When to Choose Django

| Use Case | Django |
|---|---|
| Full-stack web app | Recommended |
| CMS, blog, content site | Recommended |
| Social network | Recommended |
| E-commerce platform | Recommended |
| Admin panel needed | Recommended |
| Built-in authentication | Recommended |
| Rapid development | Recommended |
| Complex forms | Recommended |

### When to Choose FastAPI

| Use Case | FastAPI |
|---|---|
| REST API / Microservice | Recommended |
| ML model serving | Recommended |
| Data pipeline APIs | Recommended |
| High-performance APIs | Recommended |
| Async operations | Recommended |
| Simple CRUD API | Recommended |
| Team familiar with types | Recommended |
| Auto documentation important | Recommended |

### Performance Tips

```python
# Django: Database optimization
# 1. select_related for FK, prefetch_related for M2M
products = Product.objects.select_related('category').prefetch_related('tags')

# 2. Only() and defer()
products = Product.objects.only('id', 'name', 'price')

# 3. bulk_create for batch insert
Product.objects.bulk_create([
    Product(name=f"Product {i}", price=i*10) for i in range(100)
])

# FastAPI: Performance
# 1. Use async database drivers
# pip install asyncpg  # PostgreSQL
# pip install aiomysql  # MySQL

# 2. Background tasks
from fastapi import BackgroundTasks

def send_email(email: str):
    # Send email in background
    pass

@app.post("/users")
async def create_user(user: UserCreate, background_tasks: BackgroundTasks):
    # Create user
    background_tasks.add_task(send_email, user.email)
    return {"message": "User created"}
```

---

## Interview Questions

### 1. What is the difference between Django ORM and SQLAlchemy?

Django ORM is tightly integrated into Django and uses an Active Record-style pattern where model classes directly correspond to database tables. It provides automatic migrations, admin integration, and a high-level query API. SQLAlchemy is a standalone ORM that can work with any Python framework. It supports both Active Record (declarative base) and Data Mapper patterns, offering more flexibility and fine-grained control. SQLAlchemy is more explicit about sessions and transactions.

### 2. What are the main differences between Django and FastAPI?

Django is a full-stack framework with built-in ORM, admin panel, authentication, templating, and forms. It follows "batteries included" philosophy. FastAPI is a lightweight, async-first API framework focused on REST APIs. It uses Pydantic for data validation (automatic with type hints) and generates OpenAPI/Swagger documentation automatically. Django has limited async support while FastAPI is built for async from the ground up.

### 3. How does Django's MVT architecture work?

MVT (Model-View-Template) separates concerns in Django. The **Model** defines the data structure and database schema. The **View** (which is closer to a Controller in MVC) handles HTTP request processing and business logic. The **Template** renders the response, typically as HTML. The URL dispatcher maps incoming URLs to views, which interact with models and render templates.

### 4. What is Pydantic and why is it used in FastAPI?

Pydantic is a data validation library that uses Python type annotations. In FastAPI, Pydantic models define request/response schemas with automatic validation, serialization, and deserialization. It provides type coercion, custom validators, nested models, and handles complex validation rules declaratively. FastAPI uses Pydantic models to generate OpenAPI documentation automatically.

### 5. How do you handle database migrations in Django?

Django's migration system tracks model changes and applies them to the database schema. Use `python manage.py makemigrations` to create migration files from model changes, and `python manage.py migrate` to apply them. Migrations are stored as Python files in the `migrations/` directory. You can also use `showmigrations` to check status, `sqlmigrate` to see generated SQL, and `squashmigrations` to combine multiple migrations.

### 6. What is the N+1 query problem and how do you solve it?

The N+1 problem occurs when loading a list of objects then accessing their related objects, causing one additional query per object. In Django, solve it with `select_related()` (for ForeignKey/OneToOne) and `prefetch_related()` (for ManyToMany/reverse ForeignKey). In SQLAlchemy, use `joinedload()` or `selectinload()`.

### 7. How does FastAPI's dependency injection work?

FastAPI uses `Depends()` to declare dependencies in route handler parameters. Dependencies can be functions, classes, or async functions that return values. They are executed for each request, support caching, and can override behavior for testing. This pattern enables clean separation of concerns for database sessions, authentication, validation, and other cross-cutting concerns.

### 8. What are Django class-based views (CBVs)?

Django CBVs use Python classes instead of functions for views. They provide reusable structure via mixins and inheritance. Common CBVs include `ListView`, `DetailView`, `CreateView`, `UpdateView`, and `DeleteView`. Each CBV maps HTTP methods (GET, POST) to class methods (`get()`, `post()`). They reduce boilerplate for common patterns like displaying lists and forms.

### 9. How does async/await work in FastAPI?

FastAPI routes can be defined with `async def` or regular `def`. Async routes handle I/O-bound operations (database queries, HTTP calls) without blocking the event loop. Use regular `def` when calling synchronous code that doesn't have async versions. FastAPI automatically runs sync handlers in a thread pool to prevent blocking.

### 10. What is the purpose of Django REST Framework?

Django REST Framework (DRF) extends Django with RESTful API capabilities. It provides serializers (similar to Django forms), view sets with automatic CRUD endpoints, authentication classes (Token, Session, JWT), pagination, filtering, and throttling. DRF integrates with Django's ORM to expose data through a RESTful interface.

> **Tip:** Use **Django** when you need a full-stack framework with admin panels, user authentication, and database management built in. Use **FastAPI** for high-performance REST APIs, microservices, or when async/await is a priority.
