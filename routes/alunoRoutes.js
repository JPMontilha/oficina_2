const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');

// Rota de criação de aluno
router.post('/', alunoController.criarAluno);
// Rota de listagem de alunos
router.get('/', alunoController.listarAlunos);
//Rota de atualização de aluno
router.put('/:id', alunoController.atualizarAluno);

module.exports = router;