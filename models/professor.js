const mongoose = require('../db');
const userSchema = require('./user');

const professorSchema = new mongoose.Schema({
  idP: Number,
  matricula: { 
    type: String,
    required: true,
    unique: true,
    default: () => `PROF${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`
  },
  user: userSchema,
  oficinas: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Oficina',
    default: [] 
  }]
});

const Professor = mongoose.model('Professor', professorSchema);
module.exports = Professor;