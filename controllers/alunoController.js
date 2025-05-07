const Aluno = require('../models/aluno');

// Criar aluno
async function criarAluno(req, res) {
    try {
        const novoAluno = await Aluno.create(req.body);
        res.status(201).json(novoAluno);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
}

// Listar alunos
async function listarAlunos(req, res) {
    try {
        const alunos = await Aluno.find();
        res.json(alunos);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

module.exports = {
    criarAluno,
    listarAlunos
};