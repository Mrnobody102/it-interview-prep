import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { ChatWindow } from "./ChatWindow";

interface ChatbotWidgetProps {
  topicContext?: string;
}

export function ChatbotWidget({ topicContext }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <ChatWindow
          onClose={() => setIsOpen(false)}
          topicContext={topicContext}
        />
      )}
      
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-primary text-primary-foreground rounded-full shadow-xl hover:scale-105 transition-transform z-50 flex items-center justify-center group"
          aria-label="Mở trợ lý phỏng vấn"
        >
          <MessageCircle size={28} className="group-hover:animate-pulse" />
          <span className="absolute -top-10 right-0 bg-popover text-popover-foreground text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md border pointer-events-none">
            Phỏng vấn thử
          </span>
        </button>
      )}
    </>
  );
}
