const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');

// Rota de criação de professor
router.post('/', professorController.criarProfessor);
// Rota de listagem de professores
router.get('/', professorController.listarProfessores);
// Rota de atualização de professor
router.put('/:id', professorController.atualizarProfessor);
// Rota de deleção de professor
router.delete('/:id', professorController.deletarProfessor);

module.exports = router;