import { useEffect, useRef, useState } from "react";
import { Search, Sun, Moon, LogIn, Menu } from "lucide-react";
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
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
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
  isSidebarOpen,
  onToggleSidebar,
}: HeaderProps) {
  const [isCompactOpen, setIsCompactOpen] = useState(false);
  const [isMobileSelectOpen, setIsMobileSelectOpen] = useState(false);
  const compactRef = useRef<HTMLDivElement>(null);
  const mobileSelectRef = useRef<HTMLDivElement>(null);

  const selectedCategory =
    categories.find((c) => c.id === selectedCategoryId) ?? categories[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (compactRef.current && !compactRef.current.contains(target)) {
        setIsCompactOpen(false);
      }
      if (
        mobileSelectRef.current &&
        !mobileSelectRef.current.contains(target)
      ) {
        setIsMobileSelectOpen(false);
      }
    };
    const handleResize = () => {
      setIsCompactOpen(false);
      setIsMobileSelectOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCompactOpen(false);
        setIsMobileSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => {
    setIsCompactOpen(false);
    setIsMobileSelectOpen(false);
  }, [selectedCategoryId]);
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
              <span className="hidden sm:inline xl:hidden min-[1700px]:inline text-xl font-medium text-foreground">
                IT Interview Prep
              </span>
            </a>
          </div>

          {/* Center: Navigation */}
          {/* Full nav on large desktop and above */}
          <nav className="hidden xl:flex items-center gap-3">
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
                  title={category.name[language]}
                >
                  <span className="mr-2 text-lg">{category.icon}</span>
                  <span>{category.name[language]}</span>
                </button>
              );
            })}
          </nav>

          {/* Compact dropdown nav for tablet (md to <lg) */}
          <div className="relative hidden md:flex lg:hidden" ref={compactRef}>
            <button
              onClick={() => setIsCompactOpen((v) => !v)}
              className="flex items-center justify-between gap-2 px-3 py-2 min-w-[220px] rounded-full border border-border bg-card/70 text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <span className="text-lg">{selectedCategory.icon}</span>
              <span className="truncate max-w-[160px] sm:max-w-[220px]">
                {selectedCategory.name[language]}
              </span>
              <span className="text-muted-foreground text-sm">▾</span>
            </button>
            {isCompactOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 max-w-[90vw] rounded-xl border border-border bg-card shadow-lg p-2 flex flex-col gap-1 z-50 max-h-80 overflow-y-auto">
                {categories.map((category) => {
                  const isActive = selectedCategoryId === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        onCategorySelect(category);
                        setIsCompactOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="truncate">
                        {category.name[language]}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Icon-only nav for narrow desktop (lg to <xl) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-3">
            {categories.map((category) => {
              const isActive = selectedCategoryId === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(category)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground hover:bg-accent hover:text-primary"
                  }`}
                  aria-label={category.name[language]}
                  title={category.name[language]}
                >
                  <span className="text-lg">{category.icon}</span>
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

            <button className="hidden sm:flex items-center justify-center gap-2 w-36 px-4 py-2 bg-primary hover:bg-secondary text-primary-foreground rounded-lg transition-colors text-sm whitespace-nowrap">
              <LogIn className="w-4 h-4" />
              <span>{language === "vi" ? "Đăng nhập" : "Login"}</span>
            </button>

            {/* Mobile login */}
            <button className="sm:hidden flex items-center justify-center gap-2 px-3 py-2 bg-primary hover:bg-secondary text-primary-foreground rounded-lg transition-colors text-sm">
              <LogIn className="w-4 h-4" />
              <span>{language === "vi" ? "Đăng nhập" : "Login"}</span>
            </button>

            {/* Mobile sidebar toggle */}
            <button
              onClick={onToggleSidebar}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isSidebarOpen
                  ? "bg-accent text-primary"
                  : "text-foreground hover:bg-accent"
              }`}
              aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation - single dropdown select */}
        <nav className="md:hidden -mx-4 px-4 pb-3" ref={mobileSelectRef}>
          <label className="block text-sm text-muted-foreground mb-2">
            {language === "vi" ? "Chọn mục" : "Select category"}
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMobileSelectOpen((v) => !v)}
              className="w-full h-11 px-3 pr-10 rounded-xl border border-border bg-card text-foreground text-base font-medium flex items-center justify-between shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span className="flex items-center gap-2 truncate">
                <span className="text-lg">{selectedCategory.icon}</span>
                <span className="truncate">
                  {selectedCategory.name[language]}
                </span>
              </span>
              <span className="text-muted-foreground text-xs">▾</span>
            </button>
            {isMobileSelectOpen && (
              <div className="absolute z-50 mt-2 w-full max-h-64 overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
                <ul className="py-1">
                  {categories.map((category) => {
                    const isActive = selectedCategoryId === category.id;
                    return (
                      <li key={category.id}>
                        <button
                          className={`w-full flex items-center gap-3 px-3 py-2 text-left text-base rounded-lg transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent"
                          }`}
                          onClick={() => {
                            onCategorySelect(category);
                            setIsMobileSelectOpen(false);
                          }}
                        >
                          <span className="text-lg">{category.icon}</span>
                          <span className="truncate">
                            {category.name[language]}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
