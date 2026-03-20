import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ContentArea } from "./components/ContentArea";
import { SearchModal } from "./components/SearchModal";
import { categories, type Category, type Topic } from "./data/categories/index";

export default function App() {
  const navigate = useNavigate();
  const { categoryId, topicId } = useParams<{
    categoryId?: string;
    topicId?: string;
  }>();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  // Mobile sidebar open state (desktop sidebar is always visible)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync dark mode with localStorage and DOM
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setIsDarkMode(savedDarkMode === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Sync URL params with state
  useEffect(() => {
    if (categoryId) {
      const category = categories.find((c) => c.id === categoryId);
      if (category) {
        setSelectedCategory(category);

        if (topicId) {
          const findTopic = (topics: Topic[]): Topic | null => {
            for (const topic of topics) {
              if (topic.id === topicId) return topic;
              if (topic.subtopics) {
                const found = findTopic(topic.subtopics);
                if (found) return found;
              }
            }
            return null;
          };
          const topic = findTopic(category.topics);
          setSelectedTopic(topic);
        } else {
          setSelectedTopic(null);
        }
      }
    } else {
      setSelectedCategory(null);
      setSelectedTopic(null);
    }
  }, [categoryId, topicId]);

  const handleCategorySelect = (category: Category) => {
    navigate(`/${category.id}`);
    setIsMobileSidebarOpen(true);
  };

  const handleTopicSelect = (topic: Topic) => {
    if (selectedCategory) {
      navigate(`/${selectedCategory.id}/${topic.id}`);
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Header
        onSearchClick={() => setIsSearchOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        language={language}
        onLanguageChange={setLanguage}
        onCategorySelect={handleCategorySelect}
        categories={categories}
        selectedCategoryId={selectedCategory?.id}
        isSidebarOpen={isMobileSidebarOpen}
        onToggleSidebar={() => setIsMobileSidebarOpen((v) => !v)}
      />

      <div className="flex">
        {/* Mobile overlay */}
        {selectedCategory && isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Desktop sidebar: always visible when category selected */}
        {selectedCategory && (
          <div className="hidden lg:block shrink-0">
            <Sidebar
              category={selectedCategory}
              selectedTopic={selectedTopic}
              onTopicSelect={handleTopicSelect}
              language={language}
              selectedCategoryId={selectedCategory.id}
            />
          </div>
        )}

        {/* Mobile sidebar: overlay drawer */}
        {selectedCategory && (
          <div
            className={`lg:hidden shrink-0 fixed left-0 top-16 bottom-0 z-50 transition-transform duration-300 ease-in-out ${
              isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar
              category={selectedCategory}
              selectedTopic={selectedTopic}
              onTopicSelect={handleTopicSelect}
              language={language}
              selectedCategoryId={selectedCategory.id}
            />
          </div>
        )}

        <ContentArea
          selectedCategory={selectedCategory}
          selectedTopic={selectedTopic}
          language={language}
          onTopicSelect={handleTopicSelect}
        />
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        language={language}
        onTopicSelect={(topic, category) => {
          navigate(`/${category.id}/${topic.id}`);
          setIsSearchOpen(false);
        }}
      />
    </div>
  );
}
