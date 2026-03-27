# React.js

React is a JavaScript library for building user interfaces, maintained by Meta. It uses a component-based architecture and a Virtual DOM for efficient UI updates.

## Subtopics

| Subtopic | Description |
|----------|-------------|
| **React Core** | JSX, Virtual DOM, Components, Props & TypeScript, Rendering Optimization, Immutable Updates |
| **Hooks** | useState, useEffect, useRef, useContext, Custom Hooks, useReducer, Rules of Hooks |
| **Advanced Patterns** | Code Splitting, Compound Components, Render Props, Error Boundaries, Portals, Suspense, Forward Refs |

## Key Topics Overview

### Component Model

React applications are built from components — independent, reusable pieces of UI. Components can be **function components** (modern, hook-based) or **class components** (legacy lifecycle-based).

### State Management

React provides multiple approaches for managing state:
- **Local state**: `useState`, `useReducer` hooks
- **Shared state**: Context API, state management libraries (Redux, Zustand)
- **Server state**: TanStack Query for caching and synchronizing server data

### Rendering Flow

1. State/props change triggers re-render
2. React creates a new Virtual DOM tree
3. Diffing algorithm compares old vs new Virtual DOM
4. Minimal changes are applied to the real DOM

### Ecosystem

| Area | Library/Pattern |
|------|-----------------|
| Routing | React Router |
| State Management | Redux Toolkit, Zustand, Jotai |
| Data Fetching | TanStack Query (React Query) |
| Styling | CSS Modules, Styled Components, Tailwind CSS |
| Testing | Jest, React Testing Library, Vitest |
| Framework | Next.js (React framework with SSR/SSG) |
| Build | Vite, Webpack |

## Related Topics

- **Next.js** — React framework with server-side rendering and file-based routing
- **State Management** — Redux Toolkit, Context API, and other state management patterns
- **JavaScript ES6+** — Modern JavaScript features used throughout React
