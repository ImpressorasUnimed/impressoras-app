const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const FILE_PATH = path.join(__dirname, 'impressoras.json');

app.use(express.json());
app.use(express.static('public'));

// 🔍 Consultar impressoras
app.get('/api/impressoras', (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE_PATH));
  res.json(data);
});

// ➕ Adicionar impressora
app.post('/api/impressoras', (req, res) => {
  const nova = req.body;
  const data = JSON.parse(fs.readFileSync(FILE_PATH));
  data.push(nova);
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  res.status(201).json(nova);
});

// ✏️ Editar impressora
app.put('/api/impressoras/:id', (req, res) => {
  const { id } = req.params;
  const atualizada = req.body;
  let data = JSON.parse(fs.readFileSync(FILE_PATH));
  const index = data.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).send("Impressora não encontrada");
  data[index] = atualizada;
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  res.json(atualizada);
});

// ❌ Apagar impressora
app.delete('/api/impressoras/:id', (req, res) => {
  const { id } = req.params;
  let data = JSON.parse(fs.readFileSync(FILE_PATH));
  data = data.filter(p => p.id !== id);
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});