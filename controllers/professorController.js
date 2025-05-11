const bcrypt = require('bcrypt');
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

//Atualizar professor
async function atualizarProfessor(req, res) {
    try {
        const atualizacoes = { ...req.body };

        // Se estiver atualizando a senha, criptografa
        if (atualizacoes.user && atualizacoes.user.senha) {
            const senhaHash = await bcrypt.hash(atualizacoes.user.senha, 10);
            atualizacoes.user.senha = senhaHash;
        }

        const professorAtualizado = await Professor.findByIdAndUpdate(req.params.id, atualizacoes, { new: true });
        if (!professorAtualizado) {
            return res.status(404).json({ erro: 'Professor não encontrado' });
        }

        res.json(professorAtualizado);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
}

module.exports = {
    criarProfessor,
    listarProfessores,
    atualizarProfessor
};