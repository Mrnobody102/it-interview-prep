import {
  useState,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { type Category, type Topic } from "../data/categories/index";
import { getContentForTopicAsync } from "../lib/content";
import { Footer } from "./Footer";


interface SyntaxModule {
  Highlighter: typeof import("react-syntax-highlighter")["Prism"];
  darkStyle: Record<string, CSSProperties>;
  lightStyle: Record<string, CSSProperties>;
}

// Mermaid diagram component
function MermaidDiagram({ code, id, isDark }: { code: string; id: string; isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const renderDiagram = async () => {
      if (!ref.current) return;

      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "inherit",
        });

        const { svg } = await mermaid.render(id, code);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = `<pre>${code}</pre>`;
        }
      }
    };

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [code, id, isDark]);

  return (
    <div className="mermaid" ref={ref} />
  );
}

function CodeBlock({
  className,
  children,
  isDarkMode,
  ...props
}: {
  className?: string;
  children?: ReactNode;
  isDarkMode: boolean;
}) {
  const [syntaxModule, setSyntaxModule] = useState<SyntaxModule | null>(null);
  const match = /language-(\w+)/.exec(className || "");

  useEffect(() => {
    if (!match || match[1] === "mermaid" || syntaxModule) return;

    let cancelled = false;

    const loadSyntaxModule = async () => {
      const [syntaxHighlighterModule, prismStyleModule] = await Promise.all([
        import("react-syntax-highlighter"),
        import("react-syntax-highlighter/dist/esm/styles/prism"),
      ]);

      if (cancelled) return;

      setSyntaxModule({
        Highlighter: syntaxHighlighterModule.Prism,
        darkStyle: prismStyleModule.vscDarkPlus,
        lightStyle: prismStyleModule.solarizedlight,
      });
    };

    loadSyntaxModule();

    return () => {
      cancelled = true;
    };
  }, [match, syntaxModule]);

  if (match && match[1] === "mermaid") {
    const code = String(children).replace(/\n$/, "");
    const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    return <MermaidDiagram code={code} id={id} isDark={isDarkMode} />;
  }

  if (match && syntaxModule) {
    const code = String(children).replace(/\n$/, "");
    const Highlighter = syntaxModule.Highlighter;

    return (
      <Highlighter
        language={match[1]}
        style={isDarkMode ? syntaxModule.darkStyle : syntaxModule.lightStyle}
        customStyle={{
          margin: "1em 0",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          padding: "1rem 1.25rem",
          background: isDarkMode ? "#1e1e1e" : "#fdf6e3",
        }}
        codeTagProps={{
          style: { fontFamily: "inherit" },
        }}
      >
        {code}
      </Highlighter>
    );
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

interface ContentAreaProps {
  selectedCategory: Category | null;
  selectedTopic: Topic | null;
  language: "vi" | "en";
  isDarkMode: boolean;
  onTopicSelect?: (topic: Topic) => void;
}

function countNestedTopics(topic: Topic): number {
  if (!topic.subtopics?.length) {
    return 0;
  }

  return topic.subtopics.reduce(
    (total, subtopic) => total + 1 + countNestedTopics(subtopic),
    0
  );
}

function collectTopicPreview(topic: Topic, language: "vi" | "en", limit = 4): string[] {
  if (!topic.subtopics?.length) {
    return [];
  }

  const preview: string[] = [];
  const queue = [...topic.subtopics];

  while (queue.length > 0 && preview.length < limit) {
    const current = queue.shift()!;
    preview.push(current.name[language]);

    if (current.subtopics?.length) {
      queue.push(...current.subtopics);
    }
  }

  return preview;
}

function TopicTreeList({
  topics,
  language,
  onTopicSelect,
  depth = 0,
}: {
  topics: Topic[];
  language: "vi" | "en";
  onTopicSelect?: (topic: Topic) => void;
  depth?: number;
}) {
  return (
    <div className="space-y-3">
      {topics.map((topic) => {
        const hasSubtopics = Boolean(topic.subtopics?.length);

        return (
          <div key={topic.id}>
            <button
              type="button"
              onClick={() => onTopicSelect?.(topic)}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-left transition-colors hover:border-primary hover:bg-accent"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-foreground">{topic.name[language]}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {hasSubtopics
                      ? `${countNestedTopics(topic)} ${
                          language === "vi" ? "chủ đề bên trong" : "topics inside"
                        }`
                      : language === "vi"
                        ? "Chủ đề độc lập"
                        : "Standalone topic"}
                  </p>
                </div>
                {hasSubtopics && (
                  <span className="text-xs text-muted-foreground">
                    {language === "vi" ? "Nhóm chủ đề" : "Topic group"}
                  </span>
                )}
              </div>

              {hasSubtopics && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {collectTopicPreview(topic, language, 6).map((name) => (
                    <span
                      key={`${topic.id}-${name}`}
                      className="inline-flex items-center rounded-full bg-accent px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </button>

            {hasSubtopics && (
              <div
                className="mt-3 border-l border-border/70 pl-4"
                style={{ marginLeft: `${depth * 0.5}rem` }}
              >
                <TopicTreeList
                  topics={topic.subtopics!}
                  language={language}
                  onTopicSelect={onTopicSelect}
                  depth={depth + 1}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ContentArea({
  selectedCategory,
  selectedTopic,
  language,
  isDarkMode,
  onTopicSelect,
}: ContentAreaProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!selectedCategory || !selectedTopic) {
      setContent("");
      setIsLoading(false);
      return;
    }

    setContent("");
    setIsLoading(true);

    getContentForTopicAsync(
      language,
      selectedCategory.id,
      selectedTopic.id,
      selectedCategory.topics
    ).then((c) => {
      if (!cancelled) {
        setContent(c);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [selectedCategory, selectedTopic, language]);

  if (!selectedCategory) {
    return (
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="text-center max-w-2xl space-y-4">
          <div className="text-5xl sm:text-6xl mb-2">🎯</div>
          <h1 className="text-2xl sm:text-3xl text-foreground">
            {language === "vi"
              ? "Chào mừng đến IT Interview Prep"
              : "Welcome to IT Interview Prep"}
          </h1>
          <p className="text-muted-foreground">
            {language === "vi"
              ? "Chọn một chủ đề từ menu phía trên để bắt đầu học và ôn tập cho phỏng vấn IT"
              : "Select a topic from the menu above to start learning and preparing for IT interviews"}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 text-left">
            <div className="p-4 bg-accent rounded-lg">
              <div className="text-2xl mb-2">📚</div>
              <h3 className="text-foreground mb-1">
                {language === "vi" ? "7 Chủ đề chính" : "7 Main Topics"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "vi"
                  ? "Từ Backend đến DevOps"
                  : "From Backend to DevOps"}
              </p>
            </div>
            <div className="p-4 bg-accent rounded-lg">
              <div className="text-2xl mb-2">💡</div>
              <h3 className="text-foreground mb-1">
                {language === "vi" ? "Nội dung chất lượng" : "Quality Content"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "vi"
                  ? "Tài liệu được biên soạn kỹ"
                  : "Carefully curated materials"}
              </p>
            </div>
            <div className="p-4 bg-accent rounded-lg">
              <div className="text-2xl mb-2">🌐</div>
              <h3 className="text-foreground mb-1">
                {language === "vi" ? "2 Ngôn ngữ" : "2 Languages"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "vi"
                  ? "Tiếng Việt & English"
                  : "Vietnamese & English"}
              </p>
            </div>
          </div>
          <Footer />
        </div>
      </main>

    );
  }

  if (!selectedTopic) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl sm:text-4xl">
              {selectedCategory.icon}
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl text-foreground">
                {selectedCategory.name[language]}
              </h1>
              <p className="text-muted-foreground">
                {selectedCategory.description[language]}
              </p>
            </div>
          </div>

          <div className="bg-accent border border-border rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <p className="text-foreground">
              {language === "vi"
                ? "👈 Chọn một chủ đề từ sidebar bên trái để xem nội dung chi tiết"
                : "👈 Select a topic from the left sidebar to view detailed content"}
            </p>
          </div>

          <TopicTreeList
            topics={selectedCategory.topics}
            language={language}
            onTopicSelect={onTopicSelect}
          />
          <Footer />
        </div>
      </main>

    );
  }

  if (!isLoading && !content && selectedTopic.subtopics?.length) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl text-foreground">
              {selectedTopic.name[language]}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {language === "vi"
                ? "Đây là trang tổng quan cho một nhóm chủ đề. Chọn trực tiếp một mục con bên dưới để đi vào nội dung chi tiết, hoặc mở trang overview của topic cha nếu topic đó có tài liệu riêng."
                : "This is an overview for a topic group. Pick a child topic below for detailed content, or open the parent overview when that parent has its own document."}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-accent p-4 sm:p-6">
            <p className="text-sm text-muted-foreground">
              {countNestedTopics(selectedTopic)}{" "}
              {language === "vi"
                ? "chủ đề đang nằm trong nhóm này"
                : "topics are included in this group"}
            </p>
          </div>

          <TopicTreeList
            topics={selectedTopic.subtopics}
            language={language}
            onTopicSelect={onTopicSelect}
          />
          <Footer />
        </div>
      </main>

    );
  }

  if (!isLoading && !content) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-3xl mx-auto rounded-lg border border-border bg-card p-6">
          <h1 className="text-2xl text-foreground">{selectedTopic.name[language]}</h1>
          <p className="mt-3 text-muted-foreground">
            {language === "vi"
              ? "Chưa tìm thấy nội dung markdown cho chủ đề này. Cần bổ sung tài liệu hoặc kiểm tra lại mapping topic id -> filename."
              : "No markdown content was found for this topic. Add the document or verify the topic id -> filename mapping."}
          </p>
          <Footer />
        </div>
      </main>

    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <article className="content-prose prose prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ className, children, ...props }) {
                return (
                  <CodeBlock
                    className={className}
                    isDarkMode={isDarkMode}
                    {...props}
                  >
                    {children}
                  </CodeBlock>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
        <Footer />
      </div>
    </main>

  );
}
