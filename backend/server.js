const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1793',
  database: 'login_database'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado ao MySQL!');
});

// Rota para registrar um usuário
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Criptografar a senha
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).send(err);

    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, hash], (err, result) => {
      if (err) return res.status(500).send(err);
      res.send('Usuário registrado com sucesso!');
    });
  });
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
