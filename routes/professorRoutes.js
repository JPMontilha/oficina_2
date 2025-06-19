const express = require("express");
const router = express.Router();
const professorController = require("../controllers/professorController");
const autorizaTipoUsuario = require('../middlewares/autorizaTipoUsuario');
const autenticar = require('../middlewares/autenticar');

// Rota de criação de professor
router.post("/", professorController.criarProfessor);
// Rota de listagem de professores
router.get("/", professorController.listarProfessores);
// Rota de busca de professor por ID
router.get("/:id", professorController.buscarProfessorPorId);
// Rota de atualização de professor
router.put("/:id", autenticar, autorizaTipoUsuario('professor'), professorController.atualizarProfessor);
// Rota de deleção de professor
router.delete("/:id", autenticar, autorizaTipoUsuario('professor'), professorController.deletarProfessor);

module.exports = router;
