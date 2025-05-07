const express = require('express');
const router = express.Router();
const oficinaController = require('../controllers/oficinaController');

//Rota de criação de oficina
router.post('/', oficinaController.criarOficina);
//Rota de listagem de oficinas
router.get('/', oficinaController.listarOficinas);

module.exports = router;