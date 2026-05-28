import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { ChatMessage, type Message } from "./ChatMessage";
import { sendChatMessage } from "../../lib/gemini";

interface ChatWindowProps {
  onClose: () => void;
  topicContext?: string;
}

export function ChatWindow({ onClose, topicContext }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      text: "Chào bạn, mình là trợ lý phỏng vấn IT. Bạn muốn ôn luyện chủ đề gì hôm nay? Bạn có thể yêu cầu mình hỏi về kiến thức chuyên môn hoặc chia sẻ về một dự án (portfolio) của bạn để mình phỏng vấn nhé!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Convert messages to history format expected by Gemini
      const history = messages
        .filter((m) => m.id !== "welcome") // optionally exclude welcome message
        .map((m) => ({
          role: m.role,
          parts: [{ text: m.text }],
        }));

      const responseText = await sendChatMessage(
        userMessage.text,
        history,
        topicContext
      );

      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: responseText,
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: `**Lỗi:** ${error instanceof Error ? error.message : "Đã xảy ra lỗi khi kết nối tới AI."}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-20 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] bg-background border rounded-2xl shadow-xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <div>
          <h3 className="font-semibold">IT Interviewer</h3>
          <p className="text-xs text-muted-foreground">Sẵn sàng phỏng vấn</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-muted text-foreground rounded-2xl rounded-tl-sm px-4 py-2">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-background">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập câu trả lời hoặc yêu cầu..."
            className="flex-1 px-4 py-2 bg-muted/50 focus:bg-muted border-transparent focus:border-primary rounded-full outline-none transition-colors text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-primary text-primary-foreground rounded-full disabled:opacity-50 transition-opacity"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
