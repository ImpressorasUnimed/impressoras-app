require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// 🌐 Conexão com MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
  console.log("🟢 Conectado ao MongoDB Atlas");
}).catch(err => {
  console.error("🔴 Erro ao conectar ao MongoDB:", err);
});

// 🧱 Schema da Impressora
const ImpressoraSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  setor: { type: String, required: true },
  ip: { type: String, required: true },
  modelo: { type: String, required: true }
});

const Impressora = mongoose.model('Impressora', ImpressoraSchema);

// 🔧 Middlewares
app.use(express.json());
app.use(express.static('public'));

// 🔍 Consultar impressoras
app.get('/api/impressoras', async (req, res) => {
  try {
    const impressoras = await Impressora.find();
    res.json(impressoras);
  } catch (err) {
    res.status(500).send("Erro ao buscar impressoras");
  }
});

// ➕ Adicionar impressora
app.post('/api/impressoras', async (req, res) => {
  try {
    const { id } = req.body;
    const existente = await Impressora.findOne({ id });
    if (existente) return res.status(409).send("ID já cadastrado");

    const nova = new Impressora(req.body);
    await nova.save();
    res.status(201).json(nova);
  } catch (err) {
    res.status(500).send("Erro ao adicionar impressora");
  }
});

// ✏️ Editar impressora
app.put('/api/impressoras/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const atualizada = await Impressora.findOneAndUpdate({ id }, req.body, { new: true });
    if (!atualizada) return res.status(404).send("Impressora não encontrada");
    res.json(atualizada);
  } catch (err) {
    res.status(500).send("Erro ao editar impressora");
  }
});

// ❌ Apagar impressora
app.delete('/api/impressoras/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Impressora.deleteOne({ id });
    res.status(204).send();
  } catch (err) {
    res.status(500).send("Erro ao apagar impressora");
  }
})

// 🚀 Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
