# IT Interview Prep Development Guidelines

## Local Development

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Stack

- React 18 + TypeScript + Vite 6
- Tailwind CSS + shadcn/ui + Radix UI
- `react-markdown` + `remark-gfm` + `rehype-raw`
- Markdown content stored under `src/content/{lang}/...`

## Content Architecture

Each topic lives in a standalone Markdown file under `src/content/vi/` or `src/content/en/`.

Examples:

```text
src/content/vi/backend/java/java-core/oop.md
src/content/en/backend/spring-boot/security.md
src/content/vi/he-thong/load-balancer.md
src/content/en/other-skills/testing.md
```

The content loader resolves files by:

1. Language
2. Category
3. Topic id plus parent-aware filename fallback

Important: the loader no longer treats the bare filename as globally unique. Identical filenames in different categories are allowed, but duplicate filenames inside the same category should be avoided.

## Naming Convention

- Flat topic: topic id `react` -> file `react.md`
- Nested topic with stripped parent prefix: topic id `java-core-oop` under parent `java-core` -> file `oop.md`
- Nested topic that already uses the full id: keep the full id as filename

Examples:

- `java-core-oop` -> `oop.md`
- `spring-boot-intro` -> `intro.md`
- `dotnet-backend` -> `dotnet-backend.md`
- `cqrs-event-sourcing` -> `cqrs-event-sourcing.md`

## Adding New Content

1. Create the Markdown file under the correct language and category path.
2. Add or update the topic entry in `src/data/categories/*.ts`.
3. Run `npm run lint` and `npm run build`.
4. Verify the topic renders correctly and is searchable.

## Markdown Rules

- Start with exactly one `#` H1 title.
- Use fenced code blocks with a language tag when possible.
- Prefer Markdown tables/lists over inline HTML.
- Keep EN and VI topic coverage aligned unless there is a clear reason not to.
- Do not leave orphan files that are not referenced by category metadata.

## Search Index

Search results are built from category metadata plus the content manifest.

- Topic-name search uses `src/data/categories/*.ts`
- Content search loads Markdown on demand from `src/content/**`

If a topic is not appearing in search, check both the category metadata and the Markdown file path.
