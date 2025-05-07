const mongoose = require('../db');
const userSchema = require('./user');

const alunoSchema = new mongoose.Schema({
  user: userSchema,
  periodo: Number,
  ra: Number
});

const Aluno = mongoose.model('Aluno', alunoSchema);
module.exports = Aluno;