# Next.js

## 1. Next.js là gì?

**Next.js** là một React Framework hoàn chỉnh, không chỉ là thư viện. Cung cấp cấu trúc và bộ công cụ để xây dựng ứng dụng web.

### 1.1. Đặc điểm chính

| Tính năng | Mô tả |
|-----------|--------|
| **SSR, SSG, ISR** | Tối ưu SEO nhờ render phía server |
| **API Routes** | Xây dựng backend API ngay trong project |
| **File-system Routing** | Tạo route tự động từ cấu trúc file |
| **Tự động Code Splitting** | Mỗi trang chỉ tải JS cần thiết |
| **TypeScript, CSS Modules** | Hỗ trợ sẵn |
| **Fast Refresh** | Cập nhật code tức thì |

## 2. So sánh Next.js vs React thuần

| Tiêu chí | React (CRA) | Next.js |
|----------|-------------|---------|
| Render | CSR (Client-Side Rendering) | SSR, SSG, ISR, CSR |
| SEO | Kém (vì content load từ JS) | Tốt (vì content có sẵn trong HTML) |
| Routing | Thủ công (React Router) | Tự động (file-system) |
| API | Cần backend riêng | Có API Routes tích hợp |
| Code Splitting | Thủ công (React.lazy) | Tự động |

## 3. Chiến lược Render

### 3.1. Server Components (Mặc định — Next.js 13+ App Router)

Mặc định, tất cả component trong thư mục `app/` là **Server Components**. Server Components tự động quyết định cách render dựa trên dữ liệu cần thiết.

### 3.2. SSR — Server-Side Rendering

Trang được render hoàn chỉnh thành **HTML trên server** cho mỗi request.

```tsx
// app/page.tsx (SSR)
async function Page() {
  const data = await fetch('https://api.example.com/posts').then(r => r.json());
  return <PostList posts={data} />;
}
```

- **Dùng khi**: Cần dữ liệu động (danh sách sản phẩm, thông tin user...).
- **Lợi ích**: Tốt cho SEO, tải nhanh trên thiết bị yếu.

### 3.3. SSG — Static Site Generation

Trang được render thành **HTML tĩnh** tại thời điểm **build**.

```tsx
// app/about/page.tsx (SSG — mặc định cho trang tĩnh)
export default function About() {
  return <div>About Us</div>;
}
```

- **Dùng khi**: Trang không cần dữ liệu động (About Us, Policy, Blog...).
- **Lợi ích**: Tốc độ cực nhanh, chỉ cần serve file tĩnh từ CDN.

### 3.4. ISR — Incremental Static Regeneration

Kết hợp SSG với khả năng **cập nhật lại trang tĩnh** sau một khoảng thời gian mà không cần rebuild toàn bộ.

```tsx
// Cập nhật lại mỗi 60 giây
export const revalidate = 60;
async function Page() {
  const data = await fetchData();
  return <ProductList products={data} />;
}
```

### 3.5. CSR — Client-Side Rendering

Next.js vẫn hỗ trợ CSR qua `useEffect` hoặc TanStack Query.

```tsx
'use client';
import { useEffect, useState } from 'react';
export default function ClientComponent() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);
  return <div>{data ? data.name : 'Loading...'}</div>;
}
```

## 4. File-system Routing

| File | Route |
|------|-------|
| `app/page.tsx` | `/` |
| `app/about.tsx` | `/about` |
| `app/products/[id]/page.tsx` | `/products/:id` |
| `app/blog/[...slug]/page.tsx` | `/blog/*` |

```tsx
// app/products/[id]/page.tsx
export default function ProductPage({ params }: { params: { id: string } }) {
  return <div>Product ID: {params.id}</div>;
}
```

## 5. API Routes

Tạo endpoint API backend ngay trong project.

```tsx
// app/api/products/route.ts
export async function GET() {
  const products = await db.product.findMany();
  return Response.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const product = await db.product.create({ data: body });
  return Response.json(product);
}
```

> **Lưu ý**: Trong hệ thống vừa và lớn, Next.js nên chỉ là frontend, backend nên xây dựng riêng.

## 6. Tối ưu hóa tích hợp

| Tính năng | Mô tả |
|-----------|--------|
| `next/image` | Tự động nén, resize, WebP, lazy load |
| `next/font` | Tự động tối ưu font chữ |
| `next/script` | Lazy load script bên thứ ba |
| Fast Refresh | Cập nhật tức thì, giữ nguyên state |
