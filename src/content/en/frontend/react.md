# React.js

React is a JavaScript library for building user interfaces, maintained by Meta. It uses a component-based architecture and a Virtual DOM for efficient UI updates.

## Subtopics

| Subtopic | Description |
|----------|-------------|
| **React Core** | JSX, Virtual DOM, Components, Props, State, Rendering Optimization, Immutable Updates |
| **Hooks** | useState, useEffect, useRef, useContext, Custom Hooks, useMemo, useCallback, useReducer |
| **Advanced Patterns** | Code Splitting, Compound Components, Render Props, Error Boundaries, Portals, Suspense, Forward Refs |

## Ecosystem

| Area | Library/Pattern |
|------|-----------------|
| Routing | React Router |
| State Management | Redux Toolkit, Zustand, Jotai |
| Data Fetching | TanStack Query (React Query) |
| Styling | CSS Modules, Styled Components, Tailwind CSS |
| Testing | Jest, React Testing Library, Vitest |
| Framework | Next.js (React framework with SSR/SSG) |
| Build | Vite, Webpack |

## Common Interview Questions

### 1. How does React differ from Vanilla JS?

- **Vanilla JS**: Direct DOM manipulation, imperative (tell exactly what to do)
- **React**: Uses Virtual DOM + declarative (declare UI from state)

### 2. When to use Class Component vs Function Component?

Function Component is the modern choice and recommended. Class Component is a legacy pattern. Function Component with Hooks provides full features with less code.

### 3. What is props drilling? Solutions?

Props drilling is passing props through many component levels unnecessarily. Solutions: **Context API** or **State Management** (Redux, Zustand) to access state anywhere without prop drilling.

### 4. What are Server Components (Next.js/App Router)?

Server Components allow rendering components on the server, reducing bundle size and enabling direct access to server resources (database, file system) without a separate API layer.
