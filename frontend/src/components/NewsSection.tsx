'use client';

export default function NewsSection() {
  const newsItems = [
    {
      id: 1,
      title: 'BTS anuncia retorno em 2025',
      excerpt: 'O grupo confirmou planos para reunir-se após o serviço militar obrigatório.',
      image: '🎤',
      date: '15 Jan 2024',
      category: 'Notícia'
    },
    {
      id: 2,
      title: 'BLACKPINK quebra recorde de streaming',
      excerpt: 'Nova música ultrapassa 100 milhões de streams em primeira semana.',
      image: '💖',
      date: '12 Jan 2024',
      category: 'Música'
    },
    {
      id: 3,
      title: 'Nova geração domina charts',
      excerpt: 'Grupos como NewJeans e IVE lideram paradas coreanas.',
      image: '🌟',
      date: '10 Jan 2024',
      category: 'Charts'
    },
    {
      id: 4,
      title: 'Festival K-Pop na Coreia',
      excerpt: 'Evento internacional confirmado para Julho de 2024.',
      image: '🎪',
      date: '08 Jan 2024',
      category: 'Evento'
    },
    {
      id: 5,
      title: 'Collab internacional surpreende',
      excerpt: 'Artista coreano anuncia parceria com estrela global.',
      image: '🌎',
      date: '05 Jan 2024',
      category: 'Colaboração'
    },
    {
      id: 6,
      title: 'Documentário sobre K-Pop',
      excerpt: 'Série exclusiva revela bastidores da indústria.',
      image: '🎬',
      date: '03 Jan 2024',
      category: 'Mídia'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">📰 Últimas Notícias do K-Pop</h2>
        <p className="text-white/70">Fique por dentro de tudo que acontece no mundo Hallyu</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsItems.map((news) => (
          <div key={news.id} className="bg-white/10 backdrop-blur-md rounded-xl p-5 hover:bg-white/15 transition-all duration-300 hover:scale-105 border border-white/10">
            <div className="text-4xl mb-3">{news.image}</div>
            <span className="inline-block bg-pink-600 text-xs px-2 py-1 rounded-full mb-2">
              {news.category}
            </span>
            <h3 className="font-bold text-lg mb-2 leading-tight">{news.title}</h3>
            <p className="text-sm text-white/80 mb-3">{news.excerpt}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-pink-300">{news.date}</span>
              <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition">
                Ler mais →
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 inline-flex items-center gap-2">
          📖 Carregar Mais Notícias
        </button>
      </div>
    </div>
  );
}