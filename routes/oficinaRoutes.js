const express = require('express');
const router = express.Router();
const oficinaController = require('../controllers/oficinaController');

//Rota de criação de oficina
router.post('/', oficinaController.criarOficina);
//Rota de listagem de oficinas
router.get('/', oficinaController.listarOficinas);
//Rota de atualização de oficina
router.put('/:id', oficinaController.atualizarOficina);
//Rota de deleção de oficina
router.delete('/:id', oficinaController.deletarOficina);

module.exports = router;