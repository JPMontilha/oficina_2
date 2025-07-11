const bcrypt = require("bcrypt");
const Aluno = require("../models/aluno");

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
    const alunos = await Aluno.find().select("-user.senha");
    res.json(alunos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

// Buscar aluno por ID
async function buscarAlunoPorId(req, res) {
  try {
    const aluno = await Aluno.findById(req.params.id).select("-user.senha");
    if (!aluno) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }
    res.json(aluno);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

//Atualizar aluno
async function atualizarAluno(req, res) {
  try {
    const atualizacoes = { ...req.body };

    // Se estiver atualizando a senha usando dot notation, criptografa
    if (atualizacoes["user.senha"]) {
      const senhaHash = await bcrypt.hash(atualizacoes["user.senha"], 10);
      atualizacoes["user.senha"] = senhaHash;
    }

    // Se estiver atualizando a senha usando objeto user, criptografa
    if (atualizacoes.user && atualizacoes.user.senha) {
      const senhaHash = await bcrypt.hash(atualizacoes.user.senha, 10);
      atualizacoes.user.senha = senhaHash;
    }

    const alunoAtualizado = await Aluno.findByIdAndUpdate(
      req.params.id,
      atualizacoes,
      { new: true }
    );
    if (!alunoAtualizado) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    res.json(alunoAtualizado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

//Deletar aluno
async function deletarAluno(req, res) {
  try {
    const alunoDeletado = await Aluno.findByIdAndDelete(req.params.id);
    if (!alunoDeletado) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }
    res.status(200).json({ mensagem: "Aluno deletado com sucesso" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

module.exports = {
  criarAluno,
  listarAlunos,
  buscarAlunoPorId,
  atualizarAluno,
  deletarAluno,
};
