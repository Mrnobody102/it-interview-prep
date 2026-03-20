# IT Interview Prep — Development Guidelines

## Local Dev

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build locally
npm run lint     # Lint code
```

## Tech Stack

- **React 18 + TypeScript + Vite 6** — build tooling
- **shadcn/ui + Radix UI + Tailwind CSS** — component library
- **react-markdown + remark-gfm + rehype-raw** — markdown rendering

## Architecture

### Content Storage (Markdown Files per Topic)

Nội dung được lưu trong các file `.md` riêng biệt theo cấu trúc cây thư mục.

```
src/content/
├── vi/
│   ├── backend/
│   │   ├── dotnet/dotnet-backend.md
│   │   ├── golang/golang-backend.md
│   │   ├── java/java-core/
│   │   │   ├── oop.md
│   │   │   ├── collections.md
│   │   │   └── ... (8 files)
│   │   ├── spring-boot/
│   │   │   ├── spring-core.md
│   │   │   ├── spring-mvc.md
│   │   │   └── ... (9 files)
│   │   ├── nodejs/
│   │   └── python/
│   ├── database/ (12 files)
│   ├── frontend/ (6 files)
│   ├── system-design/ (12 files)
│   ├── software-architecture-design/ (14 files)
│   ├── devops/ (5 files)
│   └── other-skills/ (5 files)
└── en/
    └── (same structure, ~144 files total)
```

**Cache key = filename** (last segment of the path). Topic IDs uniquely identify content, so the filename alone is sufficient.

### File Naming Convention

**CRITICAL: Filename must match the topic ID.**

- Topic `java-core-oop` (parent=`java-core`) → file `oop.md`
- Topic `spring-mvc` (parent=`spring-boot`) → file `spring-mvc.md`
- Topic `dotnet-backend` (flat) → file `dotnet-backend.md`
- Topic `react` (flat) → file `react.md`
- Topic `spring-boot-basics` (parent=`spring-boot`) → file `spring-boot-basics.md` (topic ID already has full prefix)

Rule: Strip parent prefix from topic ID to get filename. If topic ID already matches the full name, use topic ID as-is.

### Category Structure (`src/data/categories/`)

Chỉ chứa cấu trúc navigation (id, name, subtopics). Không chứa content.

### Content Loader (`src/lib/content.ts`)

```typescript
import { getContentForTopicAsync } from '../lib/content';

// Inside a React component:
const content = await getContentForTopicAsync(language, category.id, topic.id, category.topics);
```

Hàm tự động resolve hierarchy và tìm content trong cache.

## Adding New Content

1. **Tạo file .md** trong `src/content/{lang}/{category}/{...}/{filename}.md`
   - Filename phải khớp với topic ID (sau khi strip parent prefix)
2. **Thêm topic** vào `src/data/categories/{category}.ts` (id, name, subtopics)
3. **Build** để verify — Vite glob tự động nhặt file mới

## Content Format

Markdown thuần — không inline HTML.

```markdown
# Topic Title

## Section 1

### Code Example

\`\`\`javascript
const example = "hello";
\`\`\`

- List item 1
- List item 2
```

## Migration từ RFG.docx

1. Copy nội dung từng section trong RFG.docx
2. Paste vào file .md tương ứng trong `src/content/vi/`
3. Translate → file tương ứng trong `src/content/en/`
