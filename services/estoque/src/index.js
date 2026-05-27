const express = require('express');
const app = express();
app.use(express.json());

const estoque = { camiseta: 100, calca: 50, tenis: 30 };

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'estoque' }));

app.get('/estoque/:produto', (req, res) => {
  const qtd = estoque[req.params.produto] || 0;
  res.json({ produto: req.params.produto, quantidade: qtd });
});

app.post('/estoque/reservar', (req, res) => {
  const { produto, quantidade } = req.body;
  if (!estoque[produto] || estoque[produto] < quantidade) {
    return res.status(400).json({ erro: 'Estoque insuficiente' });
  }
  estoque[produto] -= quantidade;
  res.json({ produto, reservado: quantidade, restante: estoque[produto] });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`✅ Estoque rodando na porta ${PORT}`));
