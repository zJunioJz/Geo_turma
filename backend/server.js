const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Configuração do CORS
const corsOptions = {
  origin: 'https://geo-mobile-app.onrender.com', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Conexão com o banco de dados PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Teste de conexão
pool.connect((err) => {
  if (err) {
    return console.error('Erro ao conectar ao PostgreSQL', err.stack);
  }
  console.log('Conectado ao PostgreSQL!');
});

// Rota para registrar um usuário
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const emailCheckQuery = 'SELECT * FROM users WHERE email = $1';
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ error: 'Este E-mail já está em uso. Tente outro.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';
    await pool.query(insertUserQuery, [username, email, hash]);
    
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
