# React.js

## Tổng quan

React là thư viện JavaScript mã nguồn mở để xây dựng giao diện người dùng (UI) theo cách **declarative** và **component-based**, được phát triển bởi Facebook.

## Các chủ đề con

### 1. React Core

Các khái niệm nền tảng của React bao gồm JSX, Virtual DOM, Components, Props, State và các kỹ thuật tối ưu rendering cơ bản.

### 2. React Hooks

Hệ thống Hooks cho phép sử dụng state và các tính năng React trong function components: useState, useEffect, useRef, useContext, useMemo, useCallback, useReducer và cách viết Custom Hooks.

### 3. Advanced Patterns

Các pattern nâ cao trong React: Code Splitting, Compound Components, Render Props, Error Boundaries, Portals, Suspense, và Forward Refs.

## Ecosystem

| Thư viện | Mục đích |
|-----------|----------|
| **React Router** | Điều hướng / Routing |
| **Redux Toolkit** | Quản lý state toàn cục |
| **TanStack Query** | Quản lý server state, caching |
| **Next.js** | Server-side rendering, Static site generation |
| **Vite / Create React App** | Build tool, Development server |

## Câu hỏi tổng hợp

### 1. React khác gì so với Vanilla JS?

- **Vanilla JS**: Thao tác DOM trực tiếp, imperative (nói rõ "làm gì")
- **React**: Dùng Virtual DOM + declarative (khai báo UI từ state)

### 2. Khi nào dùng Class Component vs Function Component?

Function Component là lựa chọn hiện đại và khuyến khích. Class Component là legacy pattern. Function Component với Hooks cung cấp đầy đủ tính năng và code ngắn gọn hơn.

### 3. React vs Angular vs Vue?

| | React | Angular | Vue |
|--|-------|---------|-----|
| Loại | Thư viện UI | Framework đầy đủ | Framework nhẹ |
| Ngôn ngữ template | JSX | HTML + TypeScript | Single-file (HTML/CSS/JS) |
| Data binding | One-way | Two-way | Two-way (opt-in one-way) |
| Học curve | Trung bình | Cao | Thấp |
| Ecosystem | Linh hoạt | Opinionated | Cân bằng |

### 4. Props drilling là gì? Giải pháp?

Props drilling là việc truyền props qua nhiều cấp component không cần thiết. Giải pháp: **Context API** hoặc **State Management** (Redux, Zustand) để truy cập state ở bất kỳ đâu mà không cần prop drilling.

### 5. Server Components là gì (Next.js/App Router)?

Server Components cho phép render component ở phía server, giảm bundle size và cho phép truy cập trực tiếp vào server resources (database, file system) mà không cần API layer riêng.
