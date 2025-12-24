import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { type Category, type Topic } from '../data/categories';

interface SidebarProps {
  category: Category;
  selectedTopic: Topic | null;
  onTopicSelect: (topic: Topic) => void;
  language: 'vi' | 'en';
}

export function Sidebar({ category, selectedTopic, onTopicSelect, language }: SidebarProps) {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const toggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const renderTopic = (topic: Topic, level: number = 0) => {
    const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;
    const isExpanded = expandedTopics.has(topic.id);
    const isSelected = selectedTopic?.id === topic.id;

    return (
      <div key={topic.id}>
        <button
          onClick={() => {
            if (hasSubtopics) {
              toggleTopic(topic.id);
            } else {
              onTopicSelect(topic);
            }
          }}
          className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
            isSelected
              ? 'bg-accent text-primary font-medium'
              : 'text-foreground hover:bg-muted'
          }`}
          style={{ paddingLeft: `${1 + level * 1}rem` }}
        >
          <span className="flex-1">{topic.name[language]}</span>
          {hasSubtopics && (
            <span className="ml-2">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
        </button>

        {hasSubtopics && isExpanded && (
          <div>
            {topic.subtopics!.map((subtopic) => renderTopic(subtopic, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-64 bg-card border-r border-border h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="sticky top-0 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{category.icon}</span>
          <div>
            <h2 className="text-foreground">{category.name[language]}</h2>
            <p className="text-sm text-muted-foreground">{category.description[language]}</p>
          </div>
        </div>
      </div>

      <nav className="py-2">
        {category.topics.map((topic) => renderTopic(topic))}
      </nav>
    </aside>
  );
}
