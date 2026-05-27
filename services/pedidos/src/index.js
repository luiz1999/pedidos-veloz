const express = require('express');
const { Client } = require('pg');
const app = express();
app.use(express.json());

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'pvuser',
  password: process.env.DB_PASSWORD || 'pvsenha',
  database: process.env.DB_NAME || 'pedidosveloz',
  port: process.env.DB_PORT || 5432
});

client.connect()
  .then(() => console.log('✅ Conectado ao PostgreSQL'))
  .catch(err => console.error('Erro ao conectar no banco:', err));

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'pedidos' }));

// Criar Pedido
app.post('/pedidos', async (req, res) => {
  try {
    const { produto, quantidade } = req.body;
    const result = await client.query(
      'INSERT INTO pedidos (produto, quantidade, status, criado_em) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [produto, quantidade, 'criado']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Listar Pedidos
app.get('/pedidos', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM pedidos ORDER BY criado_em DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Pedidos rodando na porta ${PORT}`));