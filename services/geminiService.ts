
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const aiService = {
  // Generate a detailed visual prompt based on the article's context
  async generateVisualPrompt(articleTitle: string, articleContent: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `分析以下众筹项目并生成一个详细的AI绘图提示词（英文），用于描述该项目的视觉核心。
      项目标题: ${articleTitle}
      项目内容: ${articleContent.substring(0, 500)}
      
      提示词应包含：艺术风格、光影、材质、核心物件描述。
      请仅返回一段英文提示词。`,
      config: {
        systemInstruction: "你是一个专业的AI艺术提示词工程师，擅长将文字创意转化为高质量的视觉生成指令。",
      }
    });
    return response.text?.trim() || "";
  },

  // Explore trending titles using Google Search
  async exploreTrendingTitles(topic: string = "科技与AI") {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `搜索关于"${topic}"的最新热门话题和新闻，并根据这些信息推荐5个吸引人的文章标题。要求标题具有深度且符合Apple风格的极简美感。请以 JSON 数组格式返回结果，包含 title 和 source 字段。`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });
    
    try {
      const text = response.text || '[]';
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']') + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = text.substring(jsonStart, jsonEnd);
        return JSON.parse(jsonStr);
      }
      return [];
    } catch (e) {
      console.error("Parse error", e);
      return [];
    }
  },

  // One-click generate full content based on title
  async generateFullArticle(title: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `请为标题为"${title}"的文章撰写一篇深度、专业且具有人文关怀的科技文章。
      要求：使用 Markdown 格式，包含引言、核心观点、未来展望。`,
      config: {
        systemInstruction: "你是一个世界级的科技专栏作家，擅长撰写具有深度洞察力和极简主义风格的行业分析文章。",
      }
    });
    return response.text;
  },

  // Generate metadata (tags, summary)
  async generateMetadata(content: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: content,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            suggestedTitle: { type: Type.STRING }
          },
          required: ["summary", "tags", "suggestedTitle"]
        }
      }
    });
    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      return {};
    }
  },

  // Generate a cover image based on prompt
  async generateCover(prompt: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });
    
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  }
};
