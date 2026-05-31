type ChatHistoryItem = {
  role: "user" | "model";
  parts: { text: string }[];
};

export async function sendChatMessage(
  message: string,
  history: ChatHistoryItem[],
  topicContext?: string
) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      history,
      topicContext,
    }),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(error?.error || "Không gọi được API chat");
  }

  const data = (await response.json()) as { text?: string };
  if (!data.text) {
    throw new Error("API chat trả về rỗng");
  }

  return data.text;
}
