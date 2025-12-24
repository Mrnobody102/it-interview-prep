import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { categories, type Category, type Topic } from '../data/categories';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'vi' | 'en';
  onTopicSelect: (topic: Topic, category: Category) => void;
}

interface SearchResult {
  topic: Topic;
  category: Category;
  path: string[];
}

export function SearchModal({ isOpen, onClose, language, onTopicSelect }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

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

    const searchResults: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    const searchTopic = (topic: Topic, category: Category, path: string[]) => {
      const topicName = topic.name[language].toLowerCase();
      const topicContent = topic.content?.[language]?.toLowerCase() || '';

      if (topicName.includes(lowerQuery) || topicContent.includes(lowerQuery)) {
        searchResults.push({ topic, category, path: [...path, topic.name[language]] });
      }

      if (topic.subtopics) {
        topic.subtopics.forEach((subtopic) =>
          searchTopic(subtopic, category, [...path, topic.name[language]])
        );
      }
    };

    categories.forEach((category) => {
      category.topics.forEach((topic) => {
        searchTopic(topic, category, [category.name[language]]);
      });
    });

    setResults(searchResults.slice(0, 10));
  }, [query, language]);

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
              <div className="text-gray-900 dark:text-white mb-1">{result.topic.name[language]}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{result.path.join(' > ')}</div>
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
