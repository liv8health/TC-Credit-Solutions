import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface AIResponse {
  message: string;
  type: 'automated' | 'escalate';
  confidence: number;
}

export class CreditRepairAI {
  private systemPrompt = `You are a professional credit repair assistant for TC Credit Solutions. You help members with:
- Understanding credit scores and reports
- Explaining the credit repair process
- Providing guidance on credit improvement strategies
- Answering questions about negative items, disputes, and timelines
- Offering personalized advice based on their situation

Guidelines:
- Be professional, empathetic, and encouraging
- Provide accurate, helpful information about credit repair
- If asked about specific legal advice, billing, or complex situations, recommend speaking with a live agent
- Keep responses concise but informative
- Always maintain a positive, solution-focused tone
- Reference TC Credit Solutions' expertise and track record

If the question requires human intervention (billing issues, complex disputes, personal account details), respond with type 'escalate'.
Otherwise, provide helpful automated responses with type 'automated'.`;

  async generateResponse(userMessage: string, userContext?: any): Promise<AIResponse> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: `User message: "${userMessage}"${userContext ? `\nUser context: ${JSON.stringify(userContext)}` : ''}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 500
      });

      const response = JSON.parse(completion.choices[0].message.content || '{}');
      
      return {
        message: response.message || "I'm here to help with your credit repair questions. Could you please provide more details?",
        type: response.type || 'automated',
        confidence: response.confidence || 0.8
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        message: "I'm having trouble processing your request right now. Let me connect you with a live agent who can assist you better.",
        type: 'escalate',
        confidence: 0.0
      };
    }
  }

  async analyzeUserSentiment(message: string): Promise<{ sentiment: 'positive' | 'neutral' | 'negative', score: number }> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "Analyze the sentiment of the user's message. Return JSON with 'sentiment' (positive/neutral/negative) and 'score' (0-1)."
          },
          { role: "user", content: message }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 100
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return {
        sentiment: result.sentiment || 'neutral',
        score: result.score || 0.5
      };
    } catch (error) {
      console.error('Sentiment Analysis Error:', error);
      return { sentiment: 'neutral', score: 0.5 };
    }
  }
}

export const creditRepairAI = new CreditRepairAI();