/// <reference types="vite/client" />

type TopicTree = {
  id: string;
  subtopics?: TopicTree[];
};

export type Language = "vi" | "en";

interface ContentFileRecord {
  key: string;
  lang: Language;
  categoryId: string;
  filename: string;
  filepath: string;
  load: () => Promise<string>;
}

export interface ContentSearchEntry {
  filename: string;
  filepath: string;
  contentKey: string;
  topicId: string;
  topicName: string;
  categoryId: string;
  categoryName: string;
}

export interface SearchIndex {
  vi: ContentSearchEntry[];
  en: ContentSearchEntry[];
}

export interface ContentSearchResult {
  topicId: string;
  topicName: string;
  categoryId: string;
  categoryName: string;
  snippet: string;
  matchedText: string;
}

const contentModules = import.meta.glob("/src/content/**/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

const contentCache: Record<Language, Record<string, string>> = {
  vi: {},
  en: {},
};

const filesByLang: Record<Language, ContentFileRecord[]> = {
  vi: [],
  en: [],
};

const filesByKey: Record<Language, Map<string, ContentFileRecord>> = {
  vi: new Map(),
  en: new Map(),
};

const keysByCategoryAndFilename: Record<Language, Map<string, string[]>> = {
  vi: new Map(),
  en: new Map(),
};

const keysByFilename: Record<Language, Map<string, string[]>> = {
  vi: new Map(),
  en: new Map(),
};

let manifestLoaded = false;
let searchIndex: SearchIndex | null = null;

function pushMapValue(map: Map<string, string[]>, key: string, value: string) {
  const current = map.get(key);
  if (current) {
    current.push(value);
    return;
  }
  map.set(key, [value]);
}

function loadManifest() {
  if (manifestLoaded) return;

  for (const [absolutePath, load] of Object.entries(contentModules)) {
    const relativePath = absolutePath
      .replace("/src/content/", "")
      .replace(/\.md$/, "");
    const parts = relativePath.split("/");
    const [lang, categoryId, ...rest] = parts;

    if (lang !== "vi" && lang !== "en") continue;
    if (!categoryId || rest.length === 0) continue;

    const filename = rest[rest.length - 1];
    const key = [categoryId, ...rest].join("/");
    const record: ContentFileRecord = {
      key,
      lang,
      categoryId,
      filename,
      filepath: `/src/content/${lang}/${key}.md`,
      load,
    };

    filesByLang[lang].push(record);
    filesByKey[lang].set(key, record);
    pushMapValue(
      keysByCategoryAndFilename[lang],
      `${categoryId}:${filename}`,
      key
    );
    pushMapValue(keysByFilename[lang], filename, key);
  }

  manifestLoaded = true;
}

async function loadContent(lang: Language, key: string): Promise<string> {
  loadManifest();

  if (contentCache[lang][key]) {
    return contentCache[lang][key];
  }

  const record = filesByKey[lang].get(key);
  if (!record) return "";

  const content = await record.load();
  contentCache[lang][key] = content;
  return content;
}

function getLoadedContent(lang: Language, key: string): string {
  return contentCache[lang][key] ?? "";
}

/**
 * Strategy:
 *   1. Try exact topicId match
 *   2. Try parentId + "-" prefix stripped version
 *   3. Try the last hyphenated segment
 */
function resolveFilenameCandidates(topicId: string, parentId?: string): string[] {
  const candidates = [topicId];

  if (parentId) {
    const prefix = `${parentId}-`;
    if (topicId.startsWith(prefix)) {
      candidates.push(topicId.slice(prefix.length));
    }
  }

  if (topicId.includes("-")) {
    const lastSegment = topicId.split("-").pop();
    if (lastSegment && !candidates.includes(lastSegment)) {
      candidates.push(lastSegment);
    }
  }

  return candidates;
}

function findParentId(
  topics: TopicTree[],
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

function resolveContentKey(
  lang: Language,
  topicId: string,
  categoryId?: string,
  parentId?: string
): string | undefined {
  loadManifest();

  const candidates = resolveFilenameCandidates(topicId, parentId);

  if (categoryId) {
    for (const candidate of candidates) {
      const categoryMatches = keysByCategoryAndFilename[lang].get(
        `${categoryId}:${candidate}`
      );
      if (categoryMatches?.length === 1) {
        return categoryMatches[0];
      }
    }
  }

  for (const candidate of candidates) {
    const globalMatches = keysByFilename[lang].get(candidate);
    if (globalMatches?.length === 1) {
      return globalMatches[0];
    }
  }

  return undefined;
}

export async function getContentForTopicAsync(
  lang: Language,
  categoryId: string,
  topicId: string,
  topics: TopicTree[]
): Promise<string> {
  const parentId = findParentId(topics, topicId);
  const key = resolveContentKey(lang, topicId, categoryId, parentId);
  return key ? loadContent(lang, key) : "";
}

export function getContentForTopic(
  lang: Language,
  categoryId: string,
  topicId: string,
  topics: TopicTree[]
): string {
  const parentId = findParentId(topics, topicId);
  const key = resolveContentKey(lang, topicId, categoryId, parentId);
  return key ? getLoadedContent(lang, key) : "";
}

export async function getTopicContentAsync(
  lang: Language,
  topicId: string,
  parentId?: string
): Promise<string> {
  const key = resolveContentKey(lang, topicId, undefined, parentId);
  return key ? loadContent(lang, key) : "";
}

export function getTopicContent(
  lang: Language,
  topicId: string,
  parentId?: string
): string {
  const key = resolveContentKey(lang, topicId, undefined, parentId);
  return key ? getLoadedContent(lang, key) : "";
}

export async function getAllContentKeys(lang: Language): Promise<string[]> {
  loadManifest();
  return filesByLang[lang].map((file) => file.key);
}

export async function initContent() {
  loadManifest();
}

export function buildSearchIndex(
  topicMap: Map<
    string,
    {
      topicId: string;
      topicName: string;
      categoryId: string;
      categoryName: string;
    }
  >
): SearchIndex {
  loadManifest();

  const index: SearchIndex = { vi: [], en: [] };

  for (const lang of ["vi", "en"] as const) {
    for (const file of filesByLang[lang]) {
      const info = topicMap.get(
        `${lang}:${file.categoryId}:${file.filename}`
      );
      if (!info) continue;

      index[lang].push({
        filename: file.filename,
        filepath: file.filepath,
        contentKey: file.key,
        topicId: info.topicId,
        topicName: info.topicName,
        categoryId: info.categoryId,
        categoryName: info.categoryName,
      });
    }
  }

  return index;
}

export function initSearchIndex(
  topicMap: Map<
    string,
    {
      topicId: string;
      topicName: string;
      categoryId: string;
      categoryName: string;
    }
  >
): SearchIndex {
  loadManifest();

  if (!searchIndex) {
    searchIndex = buildSearchIndex(topicMap);
  }

  return searchIndex;
}

export async function searchContent(
  query: string,
  lang: Language,
  limit = 10
): Promise<ContentSearchResult[]> {
  if (!searchIndex) return [];
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const entriesWithContent = await Promise.all(
    searchIndex[lang].map(async (entry) => ({
      entry,
      content: await loadContent(lang, entry.contentKey),
    }))
  );

  const results: ContentSearchResult[] = [];

  for (const { entry, content } of entriesWithContent) {
    const lowerContent = content.toLowerCase();
    const matchIdx = lowerContent.indexOf(lowerQuery);
    if (matchIdx === -1) continue;

    const start = Math.max(0, matchIdx - 40);
    const end = Math.min(content.length, matchIdx + query.length + 60);
    let snippet = content
      .slice(start, end)
      .replace(/[[\]#*`]/g, "")
      .trim();

    if (start > 0) snippet = `...${snippet}`;
    if (end < content.length) snippet = `${snippet}...`;

    results.push({
      topicId: entry.topicId,
      topicName: entry.topicName,
      categoryId: entry.categoryId,
      categoryName: entry.categoryName,
      snippet,
      matchedText: content.slice(matchIdx, matchIdx + query.length),
    });

    if (results.length >= limit) break;
  }

  return results;
}
