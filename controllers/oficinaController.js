const Oficina = require('../models/oficina');

// Criar oficina
async function criarOficina(req, res) {
    try {
        const novaOficina = await Oficina.create(req.body);
        res.status(201).json(novaOficina);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
}

// Listar oficinas
async function listarOficinas(req, res) {
    try {
        const oficinas = await Oficina.find();
        res.json(oficinas);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

module.exports = {
    criarOficina,
    listarOficinas
};