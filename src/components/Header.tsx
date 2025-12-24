import { Search, Sun, Moon, LogIn } from "lucide-react";
import { type Category } from "../data/categories";

interface HeaderProps {
  onSearchClick: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  language: "vi" | "en";
  onLanguageChange: (lang: "vi" | "en") => void;
  onCategorySelect: (category: Category) => void;
  categories: Category[];
  selectedCategoryId?: string;
}

export function Header({
  onSearchClick,
  isDarkMode,
  onToggleDarkMode,
  language,
  onLanguageChange,
  onCategorySelect,
  categories,
  selectedCategoryId,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-foreground">💻</span>
              </div>
              <span className="text-xl font-medium text-foreground">
                IT Interview Prep
              </span>
            </a>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {categories.map((category) => {
              const isActive = selectedCategoryId === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(category)}
                  className={`px-3 py-2 rounded-full transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground hover:bg-accent hover:text-primary"
                  }`}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name[language]}
                </button>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSearchClick}
              className="p-2 rounded-lg text-foreground hover:bg-accent transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-foreground hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <div className="flex items-center bg-muted rounded-lg p-1">
              <button
                onClick={() => onLanguageChange("vi")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  language === "vi"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                VI
              </button>
              <button
                onClick={() => onLanguageChange("en")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  language === "en"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </button>
            </div>

            <button className="flex items-center justify-center gap-2 w-36 px-4 py-2 bg-primary hover:bg-secondary text-primary-foreground rounded-lg transition-colors text-sm whitespace-nowrap">
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">
                {language === "vi" ? "Đăng nhập" : "Login"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex overflow-x-auto gap-2 pb-3">
          {categories.map((category) => {
            const isActive = selectedCategoryId === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-input-background text-foreground hover:bg-accent hover:text-primary"
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name[language]}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
