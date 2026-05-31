import { GoogleGenerativeAI } from "@google/generative-ai";

type ChatRole = "user" | "model";

type ChatHistoryItem = {
  role: ChatRole;
  parts: { text: string }[];
};

type ChatRequestBody = {
  message?: string;
  history?: ChatHistoryItem[];
  topicContext?: string;
};

type ApiRequest = {
  method?: string;
  body?: unknown;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

const SYSTEM_INSTRUCTION = `Bạn là một người phỏng vấn IT (IT Interviewer) chuyên nghiệp, có nhiều năm kinh nghiệm trong ngành công nghệ phần mềm.
Nhiệm vụ của bạn là giúp ứng viên ôn tập và chuẩn bị cho các buổi phỏng vấn IT.

Bạn có thể hỏi các câu hỏi về:
1. Kiến thức chuyên môn: Frontend, Backend, Database, System Design, DevOps, AI, Robotics.
2. Kinh nghiệm làm việc thực tế và các dự án cá nhân.
3. Cách giải quyết vấn đề, trade-off kỹ thuật và xử lý tình huống trong công việc.

Quy tắc:
- Đóng vai như một người phỏng vấn thực sự. Đặt câu hỏi mở, sâu sắc và sát thực tế.
- Nếu ứng viên trả lời chưa đúng hoặc chưa đủ, hãy gợi ý nhẹ nhàng hoặc giải thích ngắn gọn, rồi hỏi tiếp để kiểm tra độ hiểu.
- Nếu ứng viên cung cấp thông tin về dự án, hãy hỏi xoáy sâu vào công nghệ, khó khăn, quyết định thiết kế và cách họ giải quyết.
- Luôn chuyên nghiệp, khuyến khích và thân thiện.
- Sử dụng tiếng Việt, trừ khi người dùng yêu cầu tiếng Anh.
- Format câu trả lời bằng Markdown khi cần.`;

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";
const DEFAULT_GEMINI_MODEL = "gemini-1.5-flash";

function parseBody(body: unknown): ChatRequestBody {
  if (typeof body === "string") {
    return JSON.parse(body) as ChatRequestBody;
  }

  if (body && typeof body === "object") {
    return body as ChatRequestBody;
  }

  return {};
}

function getTextFromHistoryItem(item: ChatHistoryItem) {
  return item.parts.map((part) => part.text).join("\n").trim();
}

function buildPrompt(
  message: string,
  history: ChatHistoryItem[],
  topicContext?: string
) {
  if (topicContext && history.length === 0) {
    return `[Ngữ cảnh chủ đề hiện tại: ${topicContext}]\n${message}`;
  }

  return message;
}

async function sendWithGroq(
  message: string,
  history: ChatHistoryItem[],
  topicContext?: string
) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const prompt = buildPrompt(message, history, topicContext);
  const messages = [
    { role: "system", content: SYSTEM_INSTRUCTION },
    ...history
      .map((item) => ({
        role: item.role === "model" ? "assistant" : "user",
        content: getTextFromHistoryItem(item),
      }))
      .filter((item) => item.content.length > 0),
    { role: "user", content: prompt },
  ];

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL,
      messages,
      temperature: 0.4,
      max_tokens: 900,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq request failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error("Groq returned an empty response");
  }

  return text;
}

async function sendWithGemini(
  message: string,
  history: ChatHistoryItem[],
  topicContext?: string
) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL,
    systemInstruction: SYSTEM_INSTRUCTION,
  });
  const chat = model.startChat({ history });
  const result = await chat.sendMessage(
    buildPrompt(message, history, topicContext)
  );
  const response = await result.response;
  const text = response.text().trim();

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return text;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = parseBody(req.body);
  const message = body.message?.trim();
  const history = body.history || [];

  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  try {
    const text = await sendWithGroq(message, history, body.topicContext);
    return res.status(200).json({ provider: "groq", text });
  } catch (groqError) {
    console.warn("Groq failed, falling back to Gemini:", groqError);
  }

  try {
    const text = await sendWithGemini(message, history, body.topicContext);
    return res.status(200).json({ provider: "gemini", text });
  } catch (geminiError) {
    console.error("Gemini fallback failed:", geminiError);
    return res.status(500).json({
      error:
        "Không gọi được AI. Hãy kiểm tra GROQ_API_KEY hoặc GEMINI_API_KEY trong cấu hình môi trường.",
    });
  }
}
