/// <reference types="vite/client" />

/**
 * Content loader - loads topic content from .md files using Vite's import.meta.glob.
 * With eager: true, content is bundled at build time.
 * Cache key = filename (last segment of the path).
 *
 * Build a topicId -> filename map directly from the filesystem path so we don't
 * rely on fragile prefix-stripping heuristics.
 */

// Cache: lang -> filename -> markdown
const cache: Record<string, Record<string, string>> = {
  vi: {},
  en: {},
};

// Map: lang -> filename -> true (built from filesystem at load time)
const filenameSet: Record<string, Set<string>> = {
  vi: new Set(),
  en: new Set(),
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
    filenameSet[lang as "vi" | "en"].add(filename);
  }
}

export type Language = "vi" | "en";

/**
 * Given a topicId and its parentId, figure out the best filename to look up.
 * Strategy:
 *   1. Try exact topicId match
 *   2. Try parentId + "-" prefix stripped version
 *   3. Try last segment of topicId (for multi-hyphenated IDs like topic-subtopic-specific)
 *   4. Try topicId with most suffixes stripped (max 2 levels deep)
 */
function resolveFilename(topicId: string, parentId?: string): string[] {
  const candidates: string[] = [topicId];
  if (parentId) {
    const prefix = parentId + "-";
    if (topicId.startsWith(prefix)) {
      candidates.push(topicId.slice(prefix.length));
    }
  }
  // For heavily hyphenated IDs, try the last segment
  if (topicId.includes("-") && !candidates.includes(topicId.split("-").pop()!)) {
    candidates.push(topicId.split("-").pop()!);
  }
  return candidates;
}

function findContent(lang: Language, candidates: string[]): string {
  for (const c of candidates) {
    if (cache[lang][c]) return cache[lang][c];
  }
  return "";
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
  const candidates = resolveFilename(topicId, parentId);
  return findContent(lang, candidates);
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
  const candidates = resolveFilename(topicId, parentId);
  return findContent(lang, candidates);
}

export async function getTopicContentAsync(
  lang: Language,
  topicId: string,
  parentId?: string,
  _grandParentId?: string
): Promise<string> {
  loadCache();
  const candidates = resolveFilename(topicId, parentId);
  return findContent(lang, candidates);
}

export function getTopicContent(
  lang: Language,
  topicId: string,
  parentId?: string,
  _grandParentId?: string
): string {
  loadCache();
  const candidates = resolveFilename(topicId, parentId);
  return findContent(lang, candidates);
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
  loadCache();
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
