const Oficina = require("../models/oficina");

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
    const oficinas = await Oficina.find().populate(
      "alunos",
      "user.email periodo ra"
    );
    res.json(oficinas);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

// Buscar oficina por ID
async function buscarOficinaPorId(req, res) {
  try {
    const oficina = await Oficina.findById(req.params.id).populate(
      "alunos",
      "user.email periodo ra"
    );
    if (!oficina) {
      return res.status(404).json({ erro: "Oficina não encontrada" });
    }
    res.json(oficina);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

//Atualizar oficina
async function atualizarOficina(req, res) {
  try {
    const atualizacoes = { ...req.body };
    const oficinaAtualizada = await Oficina.findByIdAndUpdate(
      req.params.id,
      atualizacoes,
      { new: true }
    );
    if (!oficinaAtualizada) {
      return res.status(404).json({ erro: "Oficina não encontrada" });
    }
    res.json(oficinaAtualizada);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

//Deletar oficina
async function deletarOficina(req, res) {
  try {
    const oficinaDeletada = await Oficina.findByIdAndDelete(req.params.id);
    if (!oficinaDeletada) {
      return res.status(404).json({ erro: "Oficina não encontrada" });
    }
    res.status(200).json({ mensagem: "Oficina deletada com sucesso" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

module.exports = {
  criarOficina,
  listarOficinas,
  buscarOficinaPorId,
  atualizarOficina,
  deletarOficina,
};
