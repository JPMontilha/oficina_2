const express = require("express");
const router = express.Router();
const alunoController = require("../controllers/alunoController");

// Rota de criação de aluno
router.post("/", alunoController.criarAluno);
// Rota de listagem de alunos
router.get("/", alunoController.listarAlunos);
// Rota de busca de aluno por ID
router.get("/:id", alunoController.buscarAlunoPorId);
//Rota de atualização de aluno
router.put("/:id", alunoController.atualizarAluno);
//Rota de deleção de aluno
router.delete("/:id", alunoController.deletarAluno);

module.exports = router;
