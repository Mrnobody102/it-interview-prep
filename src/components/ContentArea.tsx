import { type Category, type Topic } from "../data/categories";

interface ContentAreaProps {
  selectedCategory: Category | null;
  selectedTopic: Topic | null;
  language: "vi" | "en";
}

function parseMarkdown(markdown: string) {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Code blocks
  html = html.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    "<pre><code>$2</code></pre>"
  );

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Lists
  html = html.replace(/^\- (.*$)/gim, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

  // Line breaks
  html = html.replace(/\n\n/g, "</p><p>");
  html = "<p>" + html + "</p>";

  // Clean up
  html = html.replace(/<p><h/g, "<h");
  html = html.replace(/<\/h([1-6])><\/p>/g, "</h$1>");
  html = html.replace(/<p><pre>/g, "<pre>");
  html = html.replace(/<\/pre><\/p>/g, "</pre>");
  html = html.replace(/<p><ul>/g, "<ul>");
  html = html.replace(/<\/ul><\/p>/g, "</ul>");
  html = html.replace(/<p><\/p>/g, "");

  return html;
}

export function ContentArea({
  selectedCategory,
  selectedTopic,
  language,
}: ContentAreaProps) {
  if (!selectedCategory) {
    return (
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-3xl text-foreground mb-4">
            {language === "vi"
              ? "Chào mừng đến IT Interview Prep"
              : "Welcome to IT Interview Prep"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {language === "vi"
              ? "Chọn một chủ đề từ menu phía trên để bắt đầu học và ôn tập cho phỏng vấn IT"
              : "Select a topic from the menu above to start learning and preparing for IT interviews"}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
            <div className="p-4 bg-accent rounded-lg">
              <div className="text-2xl mb-2">📚</div>
              <h3 className="text-foreground mb-1">
                {language === "vi" ? "7 Chủ đề chính" : "7 Main Topics"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "vi"
                  ? "Từ Fundamentals đến DevOps"
                  : "From Fundamentals to DevOps"}
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
        </div>
      </main>
    );
  }

  if (!selectedTopic) {
    return (
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{selectedCategory.icon}</span>
            <div>
              <h1 className="text-3xl text-foreground">
                {selectedCategory.name[language]}
              </h1>
              <p className="text-muted-foreground">
                {selectedCategory.description[language]}
              </p>
            </div>
          </div>

          <div className="bg-accent border border-border rounded-lg p-6 mb-8">
            <p className="text-foreground">
              {language === "vi"
                ? "👈 Chọn một chủ đề từ sidebar bên trái để xem nội dung chi tiết"
                : "👈 Select a topic from the left sidebar to view detailed content"}
            </p>
          </div>

          <div className="grid gap-4">
            {selectedCategory.topics.map((topic) => (
              <div
                key={topic.id}
                className="p-4 bg-card border border-border rounded-lg hover:border-primary transition-colors"
              >
                <h3 className="text-foreground mb-1">{topic.name[language]}</h3>
                {topic.subtopics && (
                  <p className="text-sm text-muted-foreground">
                    {topic.subtopics.length}{" "}
                    {language === "vi" ? "chủ đề con" : "subtopics"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <article className="max-w-4xl mx-auto prose prose-lg prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-primary prose-pre:bg-muted prose-a:text-primary prose-li:text-foreground">
        <div
          dangerouslySetInnerHTML={{
            __html: parseMarkdown(selectedTopic.content?.[language] || ""),
          }}
        />
      </article>
    </main>
  );
}
