require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexão com o banco de dados PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Teste de conexão
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao conectar ao PostgreSQL', err.stack);
  }
  console.log('Conectado ao PostgreSQL!');
  release();
});

// Rota para acessar um usuário

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar se o usuário existe
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const user = userResult.rows[0];

    // Comparar a senha fornecida com a senha armazenada
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }
    // gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.mail },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // tempo no qual o token expira "1 hora"
    )

    // Autenticação bem-sucedida
    res.json({ message: 'Login realizado com sucesso!', user: token });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});


// Rota para registrar um usuário
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verificar se o e-mail já existe
    const emailCheckQuery = 'SELECT * FROM users WHERE email = $1';
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ error: 'Este E-mail já está em uso. Tente outro.' });
    }

    // Criptografar a senha
    const hash = await bcrypt.hash(password, 10);

    // Inserir o novo usuário
    const sql = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';
    await pool.query(sql, [username, email, hash]);

    res.send('Usuário registrado com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
