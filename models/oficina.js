const mongoose = require('../db');

const oficinaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  local: {
    type: String,
    required: true
  },
  descricao: String,
  alunos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aluno',
    default: []
  }]
});

const Oficina = mongoose.model('Oficina', oficinaSchema);
module.exports = Oficina;