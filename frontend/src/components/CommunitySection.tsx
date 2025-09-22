'use client';

import { useState } from 'react';

interface Post {
  id: number;
  user: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  userColor: string;
}

export default function CommunitySection() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      user: 'KPopLover2024',
      avatar: '💖',
      content: 'Acabei de comprar ingresso para o show do TWICE! Alguém mais vai? Vamos nos encontrar! 🎫',
      likes: 24,
      comments: 8,
      time: '2 horas atrás',
      userColor: 'bg-pink-500'
    },
    {
      id: 2,
      user: 'SeoulDreamer',
      avatar: '🇰🇷',
      content: 'Estou aprendendo coreano e descobri que a música do Stray Kids tem letras incríveis! Recomendo prestar atenção nas letras. 📝',
      likes: 18,
      comments: 12,
      time: '5 horas atrás',
      userColor: 'bg-purple-500'
    },
    {
      id: 3,
      user: 'K-DramaFan',
      avatar: '🎬',
      content: 'Alguém mais acompanha os reality shows dos grupos? Estou maratonando o conteúdo do BTS no YouTube! 🎥',
      likes: 32,
      comments: 15,
      time: '1 dia atrás',
      userColor: 'bg-blue-500'
    }
  ]);

  const [newPost, setNewPost] = useState('');

  const handleAddPost = () => {
    if (newPost.trim() === '') return;

    const userColors = ['bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];
    const randomColor = userColors[Math.floor(Math.random() * userColors.length)];

    const newPostObj: Post = {
      id: posts.length + 1,
      user: `User${Math.floor(Math.random() * 1000)}`,
      avatar: '👤',
      content: newPost,
      likes: 0,
      comments: 0,
      time: 'Agora mesmo',
      userColor: randomColor
    };

    setPosts([newPostObj, ...posts]);
    setNewPost('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">👥 Comunidade HallyuChat</h2>
        <p className="text-white/70">Conecte-se com fãs de K-Pop do mundo inteiro</p>
      </div>

      {/* Criar novo post */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/10">
        <textarea 
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Compartilhe algo com a comunidade K-Pop... 🎵"
          className="w-full bg-black/20 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
          rows={3}
        />
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2 text-2xl">
            <button>😊</button>
            <button>🎉</button>
            <button>❤️</button>
            <button>🔥</button>
          </div>
          <button 
            onClick={handleAddPost}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Publicar
          </button>
        </div>
      </div>

      {/* Lista de posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${post.userColor}`}>
                {post.avatar}
              </div>
              <div>
                <div className="font-bold">{post.user}</div>
                <div className="text-xs text-white/60">{post.time}</div>
              </div>
            </div>
            
            <p className="mb-4 leading-relaxed">{post.content}</p>
            
            <div className="flex items-center gap-6 text-white/70">
              <button className="flex items-center gap-2 hover:text-pink-400 transition">
                ❤️ {post.likes}
              </button>
              <button className="flex items-center gap-2 hover:text-pink-400 transition">
                💬 {post.comments} comentários
              </button>
              <button className="flex items-center gap-2 hover:text-pink-400 transition">
                🔄 Partilhar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}