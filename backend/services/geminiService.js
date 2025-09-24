const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
    
    // Histórico de conversas por usuário
    this.conversationHistory = new Map();
  }

  // Limitar histórico para evitar excesso de tokens
  truncateHistory(history, maxMessages = 10) {
    return history.slice(-maxMessages);
  }

  // Sistema de personalidade K-Pop para o chatbot
  getSystemPrompt() {
    return `
      Você é o HallyuBot, um assistente especializado em K-Pop muito animado e entusiasta. 
      Sua personalidade é: fã dedicado de K-Pop, conhece todos os grupos, notícias e curiosidades.
      
      REGRAS IMPORTANTES:
      - Use emojis relacionados a K-Pop (💃, 🎤, 💖, 🇰🇷, 🎵)
      - Seja entusiástico e amigável
      - Forneça informações precisas sobre grupos, músicas, notícias
      - Se não souber algo, seja honesto mas mantenha o entusiasmo
      - Use occasionalmente palavras em coreano como "오빠" (oppa), "언니" (unnie), "대박" (daebak)
      - Mantenha respostas entre 1-3 parágrafos
      
      Foco em: BTS, BLACKPINK, TWICE, Stray Kids, NewJeans, e outros grupos populares.
    `;
  }

  async generateResponse(userMessage, userId = 'default') {
    try {
      // Obter ou inicializar histórico do usuário
      if (!this.conversationHistory.has(userId)) {
        this.conversationHistory.set(userId, []);
      }
      
      const userHistory = this.conversationHistory.get(userId);
      
      // Adicionar mensagem do usuário ao histórico
      userHistory.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });
      
      // Manter apenas as últimas mensagens
      const truncatedHistory = this.truncateHistory(userHistory);
      this.conversationHistory.set(userId, truncatedHistory);
      
      // Preparar prompt com histórico e personalidade
      const prompt = `
        ${this.getSystemPrompt()}
        
        Histórico da conversa:
        ${truncatedHistory.slice(0, -1).map(msg => 
          `${msg.role === 'user' ? 'Usuário' : 'HallyuBot'}: ${msg.parts[0].text}`
        ).join('\n')}
        
        Nova mensagem do usuário: ${userMessage}
        
        HallyuBot (responda com entusiasmo K-Pop):
      `;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Adicionar resposta ao histórico
      userHistory.push({
        role: 'model',
        parts: [{ text: text }]
      });
      
      return {
        success: true,
        message: text,
        timestamp: new Date()
      };
      
    } catch (error) {
      console.error('❌ Erro no Gemini:', error);
      
      // Fallback para respostas pré-definidas
      const fallbackResponses = [
        "🎵 Ainda estou aprendendo sobre isso! Mas posso te contar sobre os últimos comeback dos grupos!",
        "💖 Opa! Tive um probleminha técnico. Que tal falarmos sobre sua música K-Pop favorita?",
        "🇰🇷 대박! Algo deu errado, mas estou aqui para falar de K-Pop! Qual seu grupo favorito?",
        "🎤 Estou um pouco ocupado organizando meu playlist K-Pop! Pergunte-me outra coisa sobre seus grupos favoritos!"
      ];
      
      return {
        success: false,
        message: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        timestamp: new Date(),
        isFallback: true
      };
    }
  }

  // Limpar histórico de usuário específico
  clearUserHistory(userId) {
    this.conversationHistory.delete(userId);
  }
}

module.exports = new GeminiService();