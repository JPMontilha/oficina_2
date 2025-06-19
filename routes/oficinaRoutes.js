const express = require("express");
const router = express.Router();
const autenticar = require('../middlewares/autenticar');
const autorizaTipoUsuario = require('../middlewares/autorizaTipoUsuario');
const oficinaController = require("../controllers/oficinaController");

//Rota de criação de oficina
router.post("/", autenticar, autorizaTipoUsuario('professor'), oficinaController.criarOficina);
//Rota de criação de oficina (sem autenticação, para testes)
router.post("/teste", oficinaController.criarOficina);
//Rota de listagem de oficinas
router.get("/", oficinaController.listarOficinas);
//Rota de busca de oficina por ID
router.get("/:id", oficinaController.buscarOficinaPorId);
//Rota de atualização de oficina
router.put("/:id", autenticar, autorizaTipoUsuario('professor'), oficinaController.atualizarOficina);
//Rota de atualização de oficina (sem autenticação, para testes)
router.put("/teste/:id", oficinaController.atualizarOficina);
//Rota de deleção de oficina
router.delete("/:id", autenticar, autorizaTipoUsuario('professor'), oficinaController.deletarOficina);
//Rota de deleção de oficina (sem autenticação, para testes)
router.delete("/teste/:id", oficinaController.deletarOficina);

module.exports = router;
