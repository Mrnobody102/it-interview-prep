import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

const SYSTEM_INSTRUCTION = `Bạn là một người phỏng vấn IT (IT Interviewer) chuyên nghiệp, có nhiều năm kinh nghiệm trong ngành công nghệ phần mềm.
Nhiệm vụ của bạn là giúp ứng viên (người dùng) ôn tập và chuẩn bị cho các buổi phỏng vấn IT.
Bạn có thể hỏi các câu hỏi về:
1. Kiến thức chuyên môn (Frontend, Backend, Database, System Design, etc.) theo từng chủ đề ứng viên quan tâm.
2. Kinh nghiệm làm việc thực tế, các dự án cá nhân (portfolio).
3. Cách giải quyết vấn đề, xử lý tình huống khó trong công việc.

Quy tắc:
- Hãy đóng vai như một người phỏng vấn thực sự. Đặt ra các câu hỏi mở, sâu sắc và sát với thực tế.
- Nếu ứng viên trả lời chưa đúng hoặc chưa đủ, hãy gợi ý nhẹ nhàng hoặc giải thích ngắn gọn, sau đó có thể hỏi tiếp để kiểm tra độ hiểu biết.
- Nếu ứng viên cung cấp thông tin về dự án (portfolio), hãy đặt câu hỏi xoáy sâu vào công nghệ họ đã dùng, những khó khăn đã gặp và cách họ giải quyết.
- Luôn giữ thái độ chuyên nghiệp, khuyến khích và thân thiện.
- Sử dụng tiếng Việt (hoặc tiếng Anh nếu ứng viên yêu cầu).
- Format câu trả lời bằng Markdown (in đậm từ khóa, dùng code block nếu cần).
`;

export async function sendChatMessage(
  message: string,
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  topicContext?: string
) {
  if (!genAI) {
    throw new Error(
      "API Key chưa được cấu hình. Vui lòng thiết lập VITE_GEMINI_API_KEY trong file .env.local"
    );
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const chat = model.startChat({
    history: history,
  });

  let prompt = message;
  if (topicContext && history.length === 0) {
    prompt = `[Ngữ cảnh chủ đề hiện tại: ${topicContext}]\n${message}`;
  }

  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  return response.text();
}
