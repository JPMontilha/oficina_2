const mongoose = require('../db');
const userSchema = require('./user');

const professorSchema = new mongoose.Schema({
  idP: Number,
  user: userSchema,
  oficinas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Oficina' }]
});

const Professor = mongoose.model('Professor', professorSchema);
module.exports = Professor;