const mongoose = require('../db');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  senha: { type: String, required: true }
}, { _id: false });

module.exports = userSchema;