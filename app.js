const express = require('express');
const mongoose = require('./db');
const app = express();
app.use(express.json());
const alunoRoutes = require('./routes/alunoRoutes');
const oficinaRoutes = require('./routes/oficinaRoutes');
const professorRoutes = require('./routes/professorRoutes');

app.use('/alunos', alunoRoutes);
app.use('/oficinas', oficinaRoutes);
app.use('/professores', professorRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));