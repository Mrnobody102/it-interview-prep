import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { type Category, type Topic } from "../data/categories/types";

interface SidebarProps {
  category: Category;
  selectedTopic: Topic | null;
  onTopicSelect: (topic: Topic) => void;
  language: "vi" | "en";
  isOpen?: boolean;
  onClose?: () => void;
  selectedCategoryId?: string;
}

export function Sidebar({
  category,
  selectedTopic,
  onTopicSelect,
  language,
  selectedCategoryId,
}: SidebarProps) {
  // expandedKeys: Set of "parentId--topicId" strings.
  // Root level: key = topicId. Nested level: key = "parentId--topicId".
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    category.topics.forEach((topic) => {
      if (topic.expanded) {
        initial.add(topic.id);
      }
    });
    return initial;
  });

  // Initialize expanded keys when category changes (not when topic changes)
  // Use selectedCategoryId as dep so this only runs on category switch
  useEffect(() => {
    if (!selectedTopic) {
      setExpandedKeys(new Set());
      return;
    }

    const findPath = (
      topics: Topic[],
      targetId: string,
      parentKey: string
    ): string[] | null => {
      for (const topic of topics) {
        const key = parentKey ? `${parentKey}--${topic.id}` : topic.id;
        if (topic.id === targetId) return [key];
        if (topic.subtopics) {
          const found = findPath(topic.subtopics, targetId, key);
          if (found) return found;
        }
      }
      return null;
    };

    const path = findPath(category.topics, selectedTopic.id, "");
    const next = new Set<string>();
    if (path) {
      path.forEach((k) => next.add(k));
    }
    setExpandedKeys(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId]);

  const toggleTopic = (topicId: string, parentKey: string) => {
    const key = parentKey ? `${parentKey}--${topicId}` : topicId;
    const isOpening = !expandedKeys.has(key);

    setExpandedKeys((prev) => {
      const next = new Set(prev);

      if (isOpening) {
        // Accordion: collapse only siblings at the SAME parent level (not the parent itself)
        // siblings = same direct parent, i.e. keys that share the same prefix and have exactly one "--" segment after parentKey
        const parentPrefix = parentKey ? `${parentKey}--` : "";
        const toClose: string[] = [];
        next.forEach((k) => {
          if (!parentPrefix) {
            // Root level: close other root topics (but not children of root topics)
            // sibling = same level (no "--" at all), different id
            if (k !== key && !k.includes("--")) {
              toClose.push(k);
            }
          } else {
            // Nested level: sibling = same parent, one level deep
            // e.g. parentKey="backend--java", siblings are "backend--java--core", "backend--java--spring"
            // parentPrefix = "backend--java--"
            if (k.startsWith(parentPrefix)) {
              const after = k.slice(parentPrefix.length);
              // Only close direct children (one segment), not grandchildren
              if (!after.includes("--")) {
                toClose.push(k);
              }
            }
          }
        });
        toClose.forEach((k) => next.delete(k));
        next.add(key);
      } else {
        // Closing: remove this key and all its descendants
        const removePrefix = `${key}--`;
        const toRemove: string[] = [];
        next.forEach((k) => {
          if (k === key || k.startsWith(removePrefix)) {
            toRemove.push(k);
          }
        });
        toRemove.forEach((k) => next.delete(k));
      }

      return next;
    });
  };

  const renderTopic = (topic: Topic, level: number = 0, parentKey: string = "") => {
    const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;
    const key = parentKey ? `${parentKey}--${topic.id}` : topic.id;
    const isExpanded = expandedKeys.has(key);
    const isSelected = selectedTopic?.id === topic.id;

    return (
      <div key={topic.id}>
        <button
          onClick={() => {
            if (hasSubtopics) {
              toggleTopic(topic.id, parentKey);
            } else {
              onTopicSelect(topic);
            }
          }}
          className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
            isSelected
              ? "bg-accent text-primary font-medium"
              : "text-foreground hover:bg-muted"
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
            {topic.subtopics!.map((subtopic) =>
              renderTopic(subtopic, level + 1, key)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className="sticky top-16 shrink-0 w-64 h-[calc(100vh-4rem)] bg-card border-r border-border flex flex-col"
    >
      <div className="shrink-0 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{category.icon}</span>
          <div>
            <h2 className="text-foreground">{category.name[language]}</h2>
            <p className="text-sm text-muted-foreground">
              {category.description[language]}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {category.topics.map((topic) => renderTopic(topic))}
      </nav>
    </aside>
  );
}
