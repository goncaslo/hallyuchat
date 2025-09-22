'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simular resposta do bot
    setTimeout(() => {
      const botResponses = [
        `Interessante! Você quer saber mais sobre ${inputText} no mundo do K-pop? 🎵`,
        `Hmm, ${inputText}... Temos várias notícias sobre isso! Quer que eu busque? 📰`,
        `Ótimo tópico! Muitos fãs estão discutindo sobre ${inputText} atualmente. 💬`,
        `Sobre ${inputText}, posso te conectar com outros fãs que compartilham esse interesse! 👥`
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">💬 Chat com HallyuBot</h2>
      
      <div className="h-96 overflow-y-auto mb-4 p-4 bg-black/20 rounded-lg">
        {messages.map((message) => (
          <div key={message.id} className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md rounded-2xl p-4 ${
              message.sender === 'user' ? 'bg-pink-600 rounded-br-none' : 'bg-purple-600 rounded-bl-none'
            }`}>
              <p className="text-white">{message.text}</p>
              <p className="text-xs text-white/70 mt-1">
                {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
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
        />
        <button
          onClick={handleSendMessage}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}