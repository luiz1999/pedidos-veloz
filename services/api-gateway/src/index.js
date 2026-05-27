const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'api-gateway' }));

// Proxy simples e direto para Kubernetes
app.use('/api/pedidos', async (req, res) => {
  try {
    const resp = await fetch('http://pedidos-svc:3001/pedidos' + req.url, {
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
    const resp = await fetch('http://pagamentos-svc:3002/pagamentos', {
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
    const resp = await fetch('http://estoque-svc:3003/estoque' + req.url, {
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
