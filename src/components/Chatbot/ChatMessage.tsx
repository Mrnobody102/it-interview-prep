import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User } from "lucide-react";

export type MessageRole = "user" | "model";

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`flex max-w-[85%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-start gap-2`}
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
          }`}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        
        <div
          className={`rounded-2xl px-4 py-2 ${
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground rounded-tl-sm"
          }`}
        >
          <div className="prose prose-sm dark:prose-invert max-w-none break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.text}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
