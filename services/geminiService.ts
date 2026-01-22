
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const extractTranscriptViaAI = async (videoUrl: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Phân tích nội dung video từ đường dẫn sau và cung cấp bản kịch bản (transcript) chi tiết nhất có thể. Nếu không thể lấy trực tiếp do giới hạn kỹ thuật, hãy tìm kiếm thông tin về video này dựa trên tiêu đề hoặc metadata và mô tả nội dung chính xác. 
      URL: ${videoUrl}
      Ngôn ngữ ưu tiên: Tiếng Việt.`,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    return response.text || "Không thể trích xuất nội dung từ liên kết này. Vui lòng kiểm tra lại URL hoặc thử video khác.";
  } catch (error) {
    console.error("Gemini Transcription Error:", error);
    return "Có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.";
  }
};

export const getMetadataViaAI = async (videoUrl: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Lấy thông tin metadata cơ bản (Tiêu đề, Tác giả, Nền tảng) của video này: ${videoUrl}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            author: { type: Type.STRING },
            platform: { type: Type.STRING },
            thumbnail: { type: Type.STRING }
          },
          required: ["title", "author", "platform"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    return {
      title: "Video không xác định",
      author: "N/A",
      platform: "Unknown",
      thumbnail: "https://picsum.photos/400/225"
    };
  }
};
