const mongoose = require('../db');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  senha: { type: String, required: true }
}, { _id: false });

//Criptografar a senha
userSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = userSchema;