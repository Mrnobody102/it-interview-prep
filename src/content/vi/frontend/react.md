# React.js

## Tổng quan

React là thư viện JavaScript mã nguồn mở để xây dựng giao diện người dùng (UI) theo cách **declarative** và **component-based**, được phát triển bởi Facebook (Meta).

## Các chủ đề con

| Chủ đề | Mô tả |
|---------|-------|
| **React Core** | JSX, Virtual DOM, Components, Props, State, Rendering Optimization, Immutable Updates |
| **Hooks** | useState, useEffect, useRef, useContext, Custom Hooks, useMemo, useCallback, useReducer |
| **Advanced Patterns** | Code Splitting, Compound Components, Render Props, Error Boundaries, Portals, Suspense, Forward Refs |

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

### 3. Props drilling là gì? Giải pháp?

Props drilling là việc truyền props qua nhiều cấp component không cần thiết. Giải pháp: **Context API** hoặc **State Management** (Redux, Zustand) để truy cập state ở bất kỳ đâu mà không cần prop drilling.

### 4. Server Components là gì (Next.js/App Router)?

Server Components cho phép render component ở phía server, giảm bundle size và cho phép truy cập trực tiếp vào server resources (database, file system) mà không cần API layer riêng.
