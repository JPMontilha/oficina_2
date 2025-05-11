const bcrypt = require('bcrypt');
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

//Atualizar aluno
async function atualizarAluno(req, res) {
    try {
        const atualizacoes = { ...req.body };

        // Se estiver atualizando a senha, criptografa
        if (atualizacoes.user && atualizacoes.user.senha) {
            const senhaHash = await bcrypt.hash(atualizacoes.user.senha, 10);
            atualizacoes.user.senha = senhaHash;
        }

        const alunoAtualizado = await Aluno.findByIdAndUpdate(req.params.id, atualizacoes, { new: true });
        if (!alunoAtualizado) {
            return res.status(404).json({ erro: 'Aluno não encontrado' });
        }

        res.json(alunoAtualizado);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
}

module.exports = {
    criarAluno,
    listarAlunos,
    atualizarAluno
};