import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ContentArea } from "./components/ContentArea";
import { SearchModal } from "./components/SearchModal";
import { categories, type Category, type Topic } from "./data/categories";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    setIsSidebarOpen(true);
  };

  useEffect(() => {
    if (selectedCategory) {
      setIsSidebarOpen(true);
    }
  }, [selectedCategory]);

  const handleTopicSelect = (topic: Topic) => {
    if (selectedCategory) {
      navigate(`/${selectedCategory.id}/${topic.id}`);
      setIsSidebarOpen(false);
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
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />

      <div className="flex relative">
        {selectedCategory && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-background/70 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {selectedCategory && (
          <Sidebar
            category={selectedCategory}
            selectedTopic={selectedTopic}
            onTopicSelect={handleTopicSelect}
            language={language}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        <ContentArea
          selectedCategory={selectedCategory}
          selectedTopic={selectedTopic}
          language={language}
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
