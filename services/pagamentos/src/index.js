const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'pagamentos' }));

app.post('/pagamentos', (req, res) => {
  const aprovado = Math.random() > 0.15;
  res.json({
    id: Date.now().toString(),
    ...req.body,
    status: aprovado ? 'aprovado' : 'recusado',
    processadoEm: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`✅ Pagamentos rodando na porta ${PORT}`));
