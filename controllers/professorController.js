const Professor = require('../models/professor');

// Criar professor
async function criarProfessor(req, res) {
    try {
        const novoProfessor = await Professor.create(req.body);
        res.status(201).json(novoProfessor);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
}

// Listar professores
async function listarProfessores(req, res) {
    try {
        const professores = await Professor.find().populate('oficinas');
        res.json(professores);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

module.exports = {
    criarProfessor,
    listarProfessores
};