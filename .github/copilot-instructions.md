## Vite + React Project

### Thông Tin Dự Án

- **Tên**: IT Interview Prep
- **Framework**: Vite + React
- **Ngôn Ngữ**: TypeScript
- **Build Tool**: Vite (SWC compiler)
- **Package Manager**: npm
- **UI Libraries**: Radix UI, Tailwind CSS

### Cấu Trúc Dự Án

```
itinterviewprep/
├── .github/
├── .vscode/
│   └── tasks.json
├── src/
│   ├── components/
│   ├── data/
│   ├── styles/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── eslint.config.js
```

### Đã Hoàn Thành

- [x] Cấu hình package.json với dependencies đầy đủ
- [x] Cấu hình TypeScript (tsconfig.json, tsconfig.app.json, tsconfig.node.json)
- [x] Cấu hình Vite với SWC và path alias (@)
- [x] Cấu hình ESLint cho React
- [x] Cấu hình Tailwind CSS + PostCSS
- [x] Cài đặt tất cả dependencies
- [x] Tạo VS Code tasks để chạy dev server và build

### Hướng Dẫn Sử Dụng

#### Chạy Development Server

```bash
npm run dev
```

Hoặc sử dụng VS Code Task: `Terminal > Run Task > dev`

#### Build cho Production

```bash
npm run build
```

#### Preview Production Build

```bash
npm run preview
```

#### Kiểm Tra Lỗi ESLint

```bash
npm run lint
```

### Công Nghệ Sử Dụng

- **React 18.3.1**: UI library
- **Vite 6.3.5**: Build tool với HMR nhanh
- **TypeScript 5.6**: Type safety
- **SWC**: Fast compiler thay cho Babel
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **ESLint**: Code linting
- **Lucide React**: Icon library

### Cấu Hình Quan Trọng

- **Port**: 3000 (tự động mở browser khi chạy dev)
- **Path Alias**: `@` trỏ đến `./src`
- **TypeScript**: Strict mode enabled
- **Hot Module Replacement**: Enabled mặc định
