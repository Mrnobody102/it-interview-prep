/// <reference types="vite/client" />

/**
 * Content loader - loads topic content from .md files using Vite's import.meta.glob.
 * With eager: true, content is bundled at build time.
 * Cache key = filename (last segment of the path).
 *
 * Examples:
 *   vi/backend/java/java-core/oop.md  → key: "oop"
 *   vi/backend/spring-boot/spring-mvc.md → key: "spring-mvc"
 *   vi/frontend/react.md             → key: "react"
 *   vi/database/db-types.md          → key: "db-types"
 *   vi/backend/dotnet/dotnet-backend.md → key: "dotnet-backend"
 */

// Cache: lang -> filename -> markdown
const cache: Record<string, Record<string, string>> = {
  vi: {},
  en: {},
};

function loadCache() {
  if (cache.vi && Object.keys(cache.vi).length > 0) return;

  // eager: true means content is inlined at build time
  const all = import.meta.glob("/src/content/**/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }) as Record<string, string>;

  for (const [fp, content] of Object.entries(all)) {
    const rel = fp.replace("/src/content/", "").replace(/\.md$/, "");
    const parts = rel.split("/");
    const [lang, , ...rest] = parts;
    const filename = rest[rest.length - 1];
    cache[lang as "vi" | "en"][filename] = content;
  }
}

export type Language = "vi" | "en";

function topicIdToFilename(topicId: string, parentId?: string): string {
  if (!parentId) return topicId;
  const prefix = parentId + "-";
  if (topicId.startsWith(prefix)) {
    return topicId.slice(prefix.length);
  }
  return topicId;
}

function findParentId(
  topics: {
    id: string;
    subtopics?: {
      id: string;
      subtopics?: {
        id: string;
        subtopics?: { id: string }[];
      }[];
    }[];
  }[],
  targetId: string,
  parentId?: string
): string | undefined {
  for (const topic of topics) {
    if (topic.id === targetId) return parentId;
    if (topic.subtopics) {
      const found = findParentId(topic.subtopics, targetId, topic.id);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

// --- Public API ---

export async function getContentForTopicAsync(
  lang: Language,
  _categoryId: string,
  topicId: string,
  topics: {
    id: string;
    subtopics?: {
      id: string;
      subtopics?: {
        id: string;
        subtopics?: { id: string }[];
      }[];
    }[];
  }[]
): Promise<string> {
  loadCache();
  const parentId = findParentId(topics, topicId);
  if (cache[lang][topicId]) return cache[lang][topicId];
  const stripped = topicIdToFilename(topicId, parentId);
  if (stripped !== topicId && cache[lang][stripped]) return cache[lang][stripped];
  return "";
}

export function getContentForTopic(
  lang: Language,
  _categoryId: string,
  topicId: string,
  topics: {
    id: string;
    subtopics?: {
      id: string;
      subtopics?: {
        id: string;
        subtopics?: { id: string }[];
      }[];
    }[];
  }[]
): string {
  loadCache();
  const parentId = findParentId(topics, topicId);
  if (cache[lang][topicId]) return cache[lang][topicId];
  const stripped = topicIdToFilename(topicId, parentId);
  if (stripped !== topicId && cache[lang][stripped]) return cache[lang][stripped];
  return "";
}

export async function getTopicContentAsync(
  lang: Language,
  topicId: string,
  parentId?: string,
  _grandParentId?: string
): Promise<string> {
  loadCache();
  const filename = topicIdToFilename(topicId, parentId);
  return cache[lang][filename] || "";
}

export function getTopicContent(
  lang: Language,
  topicId: string,
  parentId?: string,
  _grandParentId?: string
): string {
  loadCache();
  const filename = topicIdToFilename(topicId, parentId);
  return cache[lang][filename] || "";
}

export async function getAllContentKeys(lang: Language): Promise<string[]> {
  loadCache();
  return Object.keys(cache[lang]);
}

export async function initContent() {
  loadCache();
}

// --- Content Search Index ---

export interface ContentSearchEntry {
  filename: string;
  filepath: string;
  topicId: string;
  topicName: string;
  categoryId: string;
  categoryName: string;
  content: string;
}

export interface SearchIndex {
  vi: ContentSearchEntry[];
  en: ContentSearchEntry[];
}

let searchIndex: SearchIndex | null = null;

export function buildSearchIndex(
  topicMap: Map<string, { topicId: string; topicName: string; categoryId: string; categoryName: string }>
): SearchIndex {
  const idx: SearchIndex = { vi: [], en: [] };

  for (const lang of ["vi", "en"] as const) {
    for (const [filename, content] of Object.entries(cache[lang])) {
      const info = topicMap.get(`${lang}:${filename}`);
      if (!info) continue;

      idx[lang].push({
        filename,
        filepath: `/src/content/${lang}/${info.categoryId}/${filename}.md`,
        topicId: info.topicId,
        topicName: info.topicName,
        categoryId: info.categoryId,
        categoryName: info.categoryName,
        content: content.slice(0, 5000), // limit for search performance
      });
    }
  }

  return idx;
}

export function initSearchIndex(
  topicMap: Map<string, { topicId: string; topicName: string; categoryId: string; categoryName: string }>
): SearchIndex {
  if (!searchIndex) {
    searchIndex = buildSearchIndex(topicMap);
  }
  return searchIndex;
}

export interface ContentSearchResult {
  topicId: string;
  topicName: string;
  categoryId: string;
  categoryName: string;
  snippet: string;
  matchedText: string;
}

export function searchContent(
  query: string,
  lang: Language,
  limit = 10
): ContentSearchResult[] {
  if (!searchIndex) return [];
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const results: ContentSearchResult[] = [];

  for (const entry of searchIndex[lang]) {
    const lowerContent = entry.content.toLowerCase();
    const matchIdx = lowerContent.indexOf(lowerQuery);
    if (matchIdx === -1) continue;

    // Extract snippet around match
    const start = Math.max(0, matchIdx - 40);
    const end = Math.min(entry.content.length, matchIdx + query.length + 60);
    let snippet = entry.content.slice(start, end).replace(/[#*`\[\]]/g, "").trim();
    if (start > 0) snippet = "..." + snippet;
    if (end < entry.content.length) snippet = snippet + "...";

    results.push({
      topicId: entry.topicId,
      topicName: entry.topicName,
      categoryId: entry.categoryId,
      categoryName: entry.categoryName,
      snippet,
      matchedText: entry.content.slice(matchIdx, matchIdx + query.length),
    });

    if (results.length >= limit) break;
  }

  return results;
}
