const mongoose = require('../db');

const oficinaSchema = new mongoose.Schema({
  id: Number,
  nome: String,
  alunos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Aluno' }]
});

const Oficina = mongoose.model('Oficina', oficinaSchema);
module.exports = Oficina;