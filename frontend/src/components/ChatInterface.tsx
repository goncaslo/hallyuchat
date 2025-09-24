'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean; // ✅ Propriedade opcional
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: 'Olá! Sou o HallyuBot. Como posso ajudar você com o mundo do K-pop hoje? 🎤', 
      sender: 'bot', 
      timestamp: new Date() 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false); // ✅ Estado para controle de envio
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputText.trim() === '' || isSending) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsSending(true);

    // Mensagem de carregamento
    const loadingMessages = [
      "💖 Consultando meus arquivos K-Pop...",
      "🎵 Procurando a melhor informação para você...",
      "🇰🇷 대박! Analisando sua pergunta...",
      "🎤 Checando os últimos comeback...",
      "💃 Dançando enquanto penso na resposta..."
    ];

    const loadingMessage: Message = {
      id: Date.now() + 1,
      text: loadingMessages[Math.floor(Math.random() * loadingMessages.length)],
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true
    };

    // Adicione este componente para loading animado
    const LoadingDots = () => (
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
    );

    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Simulação de resposta do Gemini
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Remover mensagem de carregamento e adicionar resposta
      setMessages(prev => 
        prev.filter(msg => msg.id !== loadingMessage.id) // Remove loading
      );

      const botResponse: Message = {
        id: Date.now() + 2,
        text: getGeminiResponse(inputText), // Função simulada
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      // Remover mensagem de carregamento em caso de erro
      setMessages(prev => 
        prev.filter(msg => msg.id !== loadingMessage.id)
      );

      const errorMessage: Message = {
        id: Date.now() + 3,
        text: "💔 Opa! Algo deu errado. Vamos tentar novamente?",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  // Função simulada para respostas do Gemini
  const getGeminiResponse = (userInput: string): string => {
    const responses = [
      `🎵 대박! Você perguntou sobre "${userInput}"! Em breve terei respostas inteligentes com Gemini AI! 💃`,
      `💖 Que pergunta interessante sobre "${userInput}"! Estou ansioso para te ajudar com K-Pop! 🇰🇷`,
      `🎤 오빠/언니! "${userInput}" é um ótimo tópico! Vamos conversar mais sobre K-Pop! ✨`,
      `🇰🇷 아싸! "${userInput}"! Quando o Gemini estiver integrado, terei respostas incríveis! 🎵`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">💬 Chat com HallyuBot</h2>
      
      <div className="h-96 overflow-y-auto mb-4 p-4 bg-black/20 rounded-lg">
        {messages.map((message) => (
          <div key={message.id} className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md rounded-2xl p-4 relative ${
              message.sender === 'user' 
                ? 'bg-pink-600 rounded-br-none' 
                : 'bg-purple-600 rounded-bl-none'
            } ${message.isLoading ? 'opacity-80' : ''}`}>
              
              {message.isLoading && (
                <div className="absolute -top-2 -right-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
              
              <p className="text-white">{message.text}</p>
              <p className="text-xs text-white/70 mt-1">
                {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                {message.isLoading && ' ⏳'}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Pergunte sobre K-pop, grupos, notícias..."
          className="flex-1 bg-white/90 text-gray-800 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
          disabled={isSending}
        />
        <button
          onClick={handleSendMessage}
          disabled={isSending}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Enviando...
            </div>
          ) : (
            'Enviar'
          )}
        </button>
      </div>
    </div>
  );
}