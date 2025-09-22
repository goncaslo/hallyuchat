const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do banco de dados
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hallyuchat_db'
};

// Criar conexão com MySQL
const db = mysql.createConnection(dbConfig);

// Conectar ao banco de dados
db.connect(async (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
    console.log('📋 Verifique:');
    console.log('1. XAMPP MySQL está rodando?');
    console.log('2. Banco hallyuchat_db existe?');
    console.log('3. Configurações no .env estão corretas?');
    return;
  }
  
  console.log('✅ Conectado ao banco de dados MySQL');
  
  // Verificar e criar tabelas se necessário
  await verifyAndCreateTables();
});

// Função para verificar e criar tabelas
async function verifyAndCreateTables() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      avatar VARCHAR(10) DEFAULT '👤',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      content TEXT NOT NULL,
      room VARCHAR(50) DEFAULT 'general',
      message_type ENUM('text', 'system') DEFAULT 'text',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )`,
    
    `CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      content TEXT NOT NULL,
      likes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )`
  ];

  try {
    for (const tableQuery of tables) {
      await new Promise((resolve, reject) => {
        db.query(tableQuery, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
    }
    console.log('✅ Tabelas verificadas/criadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
  }
}

// Rotas da API
app.get('/api', (req, res) => {
  res.json({ 
    message: '🚀 HallyuChat API está funcionando!',
    version: '1.0.0',
    database: '✅ Conectado',
    timestamp: new Date().toISOString()
  });
});

// Health check da database
app.get('/api/health', (req, res) => {
  db.query('SELECT 1 as connected', (err, results) => {
    if (err) {
      res.status(500).json({ 
        status: '❌ Erro no banco de dados',
        error: err.message 
      });
    } else {
      res.json({ 
        status: '✅ Online',
        database: '✅ Conectado',
        timestamp: new Date().toISOString()
      });
    }
  });
});

// Rota para testar a database
app.get('/api/test-db', (req, res) => {
  const testQueries = [
    'SHOW TABLES',
    'SELECT COUNT(*) as user_count FROM users',
    'SELECT COUNT(*) as message_count FROM messages',
    'SELECT COUNT(*) as post_count FROM posts'
  ];

  const results = {};
  let completed = 0;

  testQueries.forEach((query, index) => {
    db.query(query, (err, result) => {
      if (err) {
        results[query] = { error: err.message };
      } else {
        results[query] = { success: result };
      }
      
      completed++;
      
      if (completed === testQueries.length) {
        res.json({
          database_status: 'Teste completado',
          results: results
        });
      }
    });
  });
});

// Socket.io para chat em tempo real
io.on('connection', (socket) => {
  console.log('🔌 Novo usuário conectado:', socket.id);

  socket.on('join-chat', (data) => {
    const room = data.room || 'general';
    socket.join(room);
    console.log(`👥 Usuário ${socket.id} entrou na sala: ${room}`);
    
    // Mensagem de boas-vindas
    const welcomeMessage = {
      id: Date.now(),
      user: 'Sistema',
      content: `Bem-vindo(a) à sala ${room}! 🎉`,
      timestamp: new Date(),
      type: 'system'
    };
    
    socket.emit('chat-message', welcomeMessage);

    // Salvar no banco de dados
    const query = 'INSERT INTO messages (content, room, message_type) VALUES (?, ?, ?)';
    db.query(query, [welcomeMessage.content, room, 'system'], (err, result) => {
      if (err) console.error('Erro ao salvar mensagem:', err);
    });
  });

  socket.on('send-message', (data) => {
    try {
      console.log('💬 Nova mensagem:', data);
      
      const message = {
        id: Date.now(),
        user: data.user || 'Anônimo',
        content: data.content,
        timestamp: new Date(),
        type: 'text',
        room: data.room || 'general'
      };

      // Salvar no banco de dados
      const query = 'INSERT INTO messages (user_id, content, room, message_type) VALUES (?, ?, ?, ?)';
      db.query(query, [1, message.content, message.room, 'text'], (err, result) => {
        if (err) {
          console.error('❌ Erro ao salvar mensagem:', err);
        } else {
          console.log('✅ Mensagem salva no banco, ID:', result.insertId);
          
          // Broadcast para todos na sala
          io.to(message.room).emit('chat-message', {
            ...message,
            id: result.insertId
          });
        }
      });
      
    } catch (error) {
      console.error('❌ Erro ao processar mensagem:', error);
      socket.emit('chat-error', { error: 'Erro ao enviar mensagem' });
    }
  });

  // Buscar histórico de mensagens
  socket.on('get-message-history', (data) => {
    const room = data.room || 'general';
    const limit = data.limit || 50;
    
    const query = `
      SELECT m.*, u.username 
      FROM messages m 
      LEFT JOIN users u ON m.user_id = u.id 
      WHERE m.room = ? 
      ORDER BY m.created_at DESC 
      LIMIT ?
    `;
    
    db.query(query, [room, limit], (err, results) => {
      if (err) {
        socket.emit('message-history-error', { error: err.message });
      } else {
        socket.emit('message-history', {
          room: room,
          messages: results.reverse() // Ordenar do mais antigo para o mais recente
        });
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('🔌 Usuário desconectado:', socket.id);
  });
});

// Rota para obter mensagens via HTTP
app.get('/api/messages/:room', (req, res) => {
  const room = req.params.room;
  const limit = parseInt(req.query.limit) || 50;
  
  const query = `
    SELECT m.*, u.username 
    FROM messages m 
    LEFT JOIN users u ON m.user_id = u.id 
    WHERE m.room = ? 
    ORDER BY m.created_at DESC 
    LIMIT ?
  `;
  
  db.query(query, [room, limit], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({
        room: room,
        message_count: results.length,
        messages: results.reverse()
      });
    }
  });
});

// Inicializar servidor
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
🎉 SERVIDOR HALLYUCHAT INICIADO!
📍 URL: http://localhost:${PORT}
📊 API: http://localhost:${PORT}/api
❤️  Health: http://localhost:${PORT}/api/health
🗄️  DB Test: http://localhost:${PORT}/api/test-db
⏰ Iniciado em: ${new Date().toLocaleString('pt-BR')}
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Desligando servidor...');
  db.end((err) => {
    if (err) console.error('Erro ao fechar conexão DB:', err);
    else console.log('✅ Conexão DB fechada.');
    process.exit(0);
  });
});