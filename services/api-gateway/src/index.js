const express = require('express');
const app = express();
app.use(express.json());

const PEDIDOS_URL    = process.env.PEDIDOS_URL    || 'http://pedidos:3001';
const PAGAMENTOS_URL = process.env.PAGAMENTOS_URL || 'http://pagamentos:3002';
const ESTOQUE_URL    = process.env.ESTOQUE_URL    || 'http://estoque:3003';

// Rota raiz — resolve a tela em branco
app.get('/', (req, res) => {
  res.json({
    app: 'Pedidos Veloz API',
    versao: '1.0.0',
    status: 'online',
    rotas: [
      'GET  /health',
      'GET  /api/pedidos',
      'POST /api/pedidos',
      'POST /api/pagamentos',
      'GET  /api/estoque/:produto',
      'POST /api/estoque/reservar'
    ]
  });
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'api-gateway' }));

app.use('/api/pedidos', async (req, res) => {
  try {
    const resp = await fetch(`${PEDIDOS_URL}/pedidos` + req.url, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined
    });
    const data = await resp.json().catch(() => ({}));
    res.status(resp.status).json(data);
  } catch (e) {
    res.status(502).json({ erro: 'Serviço de pedidos indisponível' });
  }
});

app.use('/api/pagamentos', async (req, res) => {
  try {
    const resp = await fetch(`${PAGAMENTOS_URL}/pagamentos`, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await resp.json().catch(() => ({}));
    res.status(resp.status).json(data);
  } catch (e) {
    res.status(502).json({ erro: 'Serviço de pagamentos indisponível' });
  }
});

app.use('/api/estoque', async (req, res) => {
  try {
    const resp = await fetch(`${ESTOQUE_URL}/estoque` + req.url, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined
    });
    const data = await resp.json().catch(() => ({}));
    res.status(resp.status).json(data);
  } catch (e) {
    res.status(502).json({ erro: 'Serviço de estoque indisponível' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API Gateway rodando na porta ${PORT}`));