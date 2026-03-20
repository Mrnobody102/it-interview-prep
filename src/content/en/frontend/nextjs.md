# Frontend — Next.js

## 1. Overview

**Next.js** is a full React framework that provides structure, tools, and rendering strategies for building production-ready web applications.

---

## 2. Next.js vs Plain React

| Criteria | React (CRA/Vite) | Next.js |
|----------|-----------------|---------|
| **Rendering** | CSR only | SSR, SSG, ISR, CSR |
| **SEO** | Poor (content from JS) | Excellent (content in HTML) |
| **Routing** | Manual (React Router) | File-system based |
| **API** | Requires separate backend | Built-in API Routes |
| **Code Splitting** | Manual (`React.lazy`) | Automatic per page |
| **Image Optimization** | Manual | Built-in `<Image>` |

---

## 3. Rendering Strategies

### 3.1. Server Components (Default — Next.js 13+ App Router)

All components in `app/` are **Server Components** by default. They render on the server and send HTML to the client.

### 3.2. SSR — Server-Side Rendering

Render page to **HTML on the server for each request**.

```tsx
// app/posts/page.tsx
async function PostsPage() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  return <PostList posts={posts} />;
}
```

| When to use | Benefits |
|-------------|----------|
| Dynamic data per user | Good SEO |
| Personalized content | Fast on low-end devices |
| Real-time data | Fresh content on every request |

### 3.3. SSG — Static Site Generation

Render to **static HTML at build time**.

```tsx
// app/about/page.tsx
export default function About() {
  return <div>About Us</div>;
}
```

| When to use | Benefits |
|-------------|----------|
| Static pages (About, Policy, Landing) | Extremely fast |
| Blog posts | Just serve static files from CDN |
| Documentation | No server processing needed |

### 3.4. ISR — Incremental Static Regeneration

Re-generate static pages **periodically** without full rebuild.

```tsx
// Revalidate every 60 seconds
export const revalidate = 60;

async function ProductPage({ params }) {
  const product = await fetchProduct(params.id);
  return <ProductDetail product={product} />;
}
```

| When to use | Benefits |
|-------------|----------|
| E-commerce product pages | Fresh data without full rebuild |
| Content that changes periodically | Scale to millions of pages |

### 3.5. CSR — Client-Side Rendering

Use client-side rendering for interactive, personalized content.

```tsx
'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(setData);
  }, []);
  return <div>{data ? <Metrics data={data} /> : <Loading />}</div>;
}
```

### 3.6. Rendering Strategy Summary

| Strategy | Pre-rendered | When it renders | Use case |
|----------|------------|-----------------|---------|
| **SSG** | HTML | Build time | Static content |
| **ISR** | HTML | Build + periodic | Semi-dynamic content |
| **SSR** | HTML | Every request | Personalized, dynamic |
| **CSR** | Empty shell | Client | User-specific, interactive |

---

## 4. File-system Routing

| File | Route |
|------|-------|
| `app/page.tsx` | `/` |
| `app/about.tsx` | `/about` |
| `app/products/page.tsx` | `/products` |
| `app/products/[id]/page.tsx` | `/products/:id` |
| `app/blog/[...slug]/page.tsx` | `/blog/*` (catch-all) |
| `app/(auth)/login/page.tsx` | `/login` (route group) |

### 4.1. Dynamic Routes

```tsx
// app/products/[id]/page.tsx
export default async function ProductPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { color?: string };
}) {
  const product = await getProduct(params.id);
  return (
    <div>
      <h1>{product.name}</h1>
      {searchParams.color && <p>Color: {searchParams.color}</p>}
    </div>
  );
}
```

### 4.2. Route Groups

```tsx
// app/(marketing)/about/page.tsx  →  /about
// app/(marketing)/pricing/page.tsx → /pricing
// (marketing) is a route group — no URL impact
```

### 4.3. Nested Layouts

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

---

## 5. API Routes

### 5.1. REST API

```tsx
// app/api/products/route.ts
export async function GET() {
  const products = await db.product.findMany();
  return Response.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const product = await db.product.create({ data: body });
  return Response.json(product, { status: 201 });
}
```

### 5.2. Dynamic API Routes

```tsx
// app/api/products/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const product = await db.product.findUnique({ where: { id: params.id } });
  if (!product) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(product);
}
```

> **Note**: For medium-to-large applications, consider building a separate backend instead of relying solely on Next.js API Routes.

---

## 6. Built-in Optimizations

| Feature | Description |
|---------|-------------|
| `next/image` | Auto compression, resize, WebP, lazy loading, CLS prevention |
| `next/font` | Auto font optimization, zero layout shift, self-hosted fonts |
| `next/script` | Lazy load third-party scripts with strategy control |
| Fast Refresh | Instant updates with state preserved during development |

### 6.1. Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/product.jpg"
  alt="Product"
  width={400}
  height={300}
  priority              // Preload above-the-fold images
  placeholder="blur"
  blurDataURL="..."     // Base64 blur placeholder
/>
```

### 6.2. Script Optimization

```tsx
import Script from 'next/script';

<Script
  src="https://analytics.com/script.js"
  strategy="lazyOnload"    // 'lazyOnload' | 'afterInteractive' | 'beforeInteractive'
  onLoad={() => console.log('Script loaded')}
/>
```

---

## 7. Data Fetching

### 7.1. Server-Side Data Fetching

```tsx
// Fetch with caching
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 }  // ISR: revalidate every 60s
  });
  return res.json();
}

// Fetch without caching (SSR)
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store'    // SSR: fetch on every request
  });
  return res.json();
}
```

### 7.2. Parallel & Sequential Fetching

```tsx
// Parallel — faster (both requests simultaneously)
async function Page() {
  const [user, posts] = await Promise.all([
    fetchUser(userId),
    fetchPosts(userId)
  ]);
}

// Sequential — when second depends on first
async function Page() {
  const user = await fetchUser(userId);
  const posts = await fetchPosts(user.id);  // Depends on user.id
}
```

---

## 8. Middleware

Execute code before a request is completed.

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  // Protect routes
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*']
};
```

---

## 9. Deployment

### 9.1. Vercel (Recommended)

Zero-config deployment with automatic CI/CD, edge network, and built-in Next.js optimizations.

### 9.2. Self-hosted

```bash
# Build
npm run build

# Start production server
npm start

# Environment variable
PORT=3000 npm start
```

---

## 10. Interview Questions

**Q: When should you use SSG vs SSR?**

> Use **SSG** for pages that don't change frequently (documentation, blog posts, marketing pages) — it offers the best performance. Use **SSR** when content is personalized or changes on every request (dashboards, user profiles, live data).

**Q: What is the difference between the Pages Router and App Router?**

> **Pages Router** (`pages/`) uses SSR/SSG via `getServerSideProps`/`getStaticProps`. **App Router** (`app/`) is the newer approach (Next.js 13+) that uses React Server Components, nested layouts, and simplified data fetching with `async` server components. App Router is now the recommended approach.

**Q: How do you handle authentication in Next.js?**

> Use middleware to protect routes (redirect unauthenticated users to login). Store the session token in an **HttpOnly cookie** (not localStorage). On the server, verify the token in middleware or in server components. Consider using NextAuth.js for a complete solution.
