import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { categories, type Category, type Topic } from '../data/categories/index';
import { searchContent, initSearchIndex, type ContentSearchResult } from '../lib/content';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'vi' | 'en';
  onTopicSelect: (topic: Topic, category: Category) => void;
}

interface SearchResult {
  type: 'topic' | 'content';
  topic: Topic;
  category: Category;
  path: string[];
  snippet?: string;
}

function buildTopicMap() {
  const topicMap = new Map<string, { topicId: string; topicName: string; categoryId: string; categoryName: string }>();

  function resolveFilename(topicId: string, parentId?: string): string[] {
    const candidates: string[] = [topicId];
    if (parentId) {
      const prefix = parentId + '-';
      if (topicId.startsWith(prefix)) {
        candidates.push(topicId.slice(prefix.length));
      }
    }
    if (topicId.includes('-') && !candidates.includes(topicId.split('-').pop()!)) {
      candidates.push(topicId.split('-').pop()!);
    }
    return candidates;
  }

  function processTopics(topics: Topic[], catId: string, lang: 'vi' | 'en', parentId?: string) {
    for (const t of topics) {
      const filenames = resolveFilename(t.id, parentId);
      // Register all candidate filenames pointing to this topic
      for (const filename of filenames) {
        if (!topicMap.has(`${lang}:${filename}`)) {
          topicMap.set(`${lang}:${filename}`, {
            topicId: t.id,
            topicName: t.name[lang],
            categoryId: catId,
            categoryName: categories.find((c) => c.id === catId)?.name[lang] || catId,
          });
        }
      }
      if (t.subtopics) processTopics(t.subtopics, catId, lang, t.id);
    }
  }

  for (const cat of categories) {
    processTopics(cat.topics, cat.id, 'vi');
    processTopics(cat.topics, cat.id, 'en');
  }

  return topicMap;
}

export function SearchModal({ isOpen, onClose, language, onTopicSelect }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize search index once
  const searchIndexRef = useRef<ReturnType<typeof initSearchIndex> | null>(null);
  if (!searchIndexRef.current) {
    searchIndexRef.current = initSearchIndex(buildTopicMap());
  }

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const combinedResults: SearchResult[] = [];
    const seen = new Set<string>();
    const lowerQuery = query.toLowerCase();

    // 1. Search by topic name
    const searchTopic = (topic: Topic, category: Category, path: string[]) => {
      const topicName = topic.name[language].toLowerCase();
      if (topicName.includes(lowerQuery)) {
        const key = `${category.id}:${topic.id}`;
        if (!seen.has(key)) {
          seen.add(key);
          combinedResults.push({ type: 'topic', topic, category, path: [...path, topic.name[language]] });
        }
      }
      if (topic.subtopics) {
        topic.subtopics.forEach((subtopic) =>
          searchTopic(subtopic, category, [...path, topic.name[language]])
        );
      }
    };

    for (const category of categories) {
      for (const topic of category.topics) {
        searchTopic(topic, category, [category.name[language]]);
      }
    }

    // 2. Search by content
    const contentResults: ContentSearchResult[] = searchContent(query, language, 10);
    for (const cr of contentResults) {
      const key = `${cr.categoryId}:${cr.topicId}`;
      if (!seen.has(key)) {
        seen.add(key);
        const cat = categories.find((c) => c.id === cr.categoryId);
        if (!cat) continue;
        const topic = findTopicById(cat.topics, cr.topicId);
        if (!topic) continue;
        combinedResults.push({
          type: 'content',
          topic,
          category: cat,
          path: [cat.name[language]],
          snippet: cr.snippet,
        });
      }
    }

    setResults(combinedResults.slice(0, 15));
  }, [query, language]);

  function findTopicById(topics: Topic[], id: string): Topic | null {
    for (const t of topics) {
      if (t.id === id) return t;
      if (t.subtopics) {
        const found = findTopicById(t.subtopics, id);
        if (found) return found;
      }
    }
    return null;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={language === 'vi' ? 'Tìm kiếm chủ đề...' : 'Search topics...'}
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {query && results.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              {language === 'vi' ? 'Không tìm thấy kết quả' : 'No results found'}
            </div>
          )}

          {results.map((result, index) => (
            <button
              key={`${result.category.id}-${result.topic.id}-${index}`}
              onClick={() => {
                onTopicSelect(result.topic, result.category);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors"
            >
              <div className="flex items-center gap-2 mb-0.5">
                {result.type === 'content' && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium">
                    {language === 'vi' ? 'ND' : 'CONTENT'}
                  </span>
                )}
                <div className="text-gray-900 dark:text-white font-medium">{result.topic.name[language]}</div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{result.path.join(' > ')}</div>
              {result.snippet && (
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                  ...{result.snippet}...
                </div>
              )}
            </button>
          ))}
        </div>

        {!query && (
          <div className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-700">
            {language === 'vi'
              ? 'Nhập từ khóa để tìm kiếm trong tất cả chủ đề'
              : 'Enter keywords to search across all topics'}
          </div>
        )}
      </div>
    </div>
  );
}
