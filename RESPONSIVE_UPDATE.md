# Responsive Design Updates

Cập nhật các file sau để hỗ trợ mobile responsive:

## 1. App.tsx
Thêm state `isSidebarOpen` và overlay cho mobile sidebar:
```tsx
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
```

Trong return, thay đổi:
```tsx
<div className="flex relative">
  {/* Mobile Sidebar Overlay */}
  {selectedCategory && isSidebarOpen && (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
      onClick={() => setIsSidebarOpen(false)}
    />
  )}

  {selectedCategory && (
    <Sidebar
      category={selectedCategory}
      selectedTopic={selectedTopic}
      onTopicSelect={handleTopicSelect}
      language={language}
      isOpen={isSidebarOpen}
      onClose={() => setIsSidebarOpen(false)}
    />
  )}
```

## 2. Sidebar.tsx
Thêm props `isOpen` và `onClose`:
```tsx
interface SidebarProps {
  category: Category;
  selectedTopic: Topic | null;
  onTopicSelect: (topic: Topic) => void;
  language: "vi" | "en";
  isOpen: boolean;
  onClose: () => void;
}
```

Cập nhật aside className:
```tsx
<aside className={`
  fixed md:static top-16 left-0 z-50
  w-64 bg-card border-r border-border 
  h-[calc(100vh-4rem)] overflow-y-auto
  transition-transform duration-300 ease-in-out
  ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
`}>
```

Thêm onClose khi chọn topic:
```tsx
} else {
  onTopicSelect(topic);
  onClose(); // Close sidebar on mobile
}
```

## 3. ContentArea.tsx
Responsive padding:
- `className="flex-1 p-4 sm:p-6 lg:p-8"`
- `className="text-2xl sm:text-3xl"`  
- `className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3"`
- `className="prose prose-sm sm:prose-base lg:prose-lg"`

## 4. Header.tsx  
Ẩn text logo trên mobile nhỏ:
```tsx
<span className="hidden sm:inline text-xl font-medium text-foreground">
  IT Interview Prep
</span>
```

Mobile nav đã có sẵn với `overflow-x-auto` để scroll ngang.
