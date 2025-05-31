const bcrypt = require("bcrypt");
const Professor = require("../models/professor");

// Criar professor
async function criarProfessor(req, res) {
  try {
    const novoProfessor = await Professor.create(req.body);
    res.status(201).json(novoProfessor);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

// Listar professores
async function listarProfessores(req, res) {
  try {
    const professores = await Professor.find()
      .populate("oficinas")
      .select("-user.senha");
    res.json(professores);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

// Buscar professor por ID
async function buscarProfessorPorId(req, res) {
  try {
    const professor = await Professor.findById(req.params.id)
      .populate("oficinas")
      .select("-user.senha");
    if (!professor) {
      return res.status(404).json({ erro: "Professor não encontrado" });
    }
    res.json(professor);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

//Atualizar professor
async function atualizarProfessor(req, res) {
  try {
    const atualizacoes = { ...req.body };

    // Se estiver atualizando a senha, criptografa
    if (atualizacoes.user && atualizacoes.user.senha) {
      const senhaHash = await bcrypt.hash(atualizacoes.user.senha, 10);
      atualizacoes.user.senha = senhaHash;
    }

    const professorAtualizado = await Professor.findByIdAndUpdate(
      req.params.id,
      atualizacoes,
      { new: true }
    );
    if (!professorAtualizado) {
      return res.status(404).json({ erro: "Professor não encontrado" });
    }

    res.json(professorAtualizado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

//Deletar professor
async function deletarProfessor(req, res) {
  try {
    const professorDeletado = await Professor.findByIdAndDelete(req.params.id);
    if (!professorDeletado) {
      return res.status(404).json({ erro: "Professor não encontrado" });
    }
    res.status(200).json({ mensagem: "Professor deletado com sucesso" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

async function adicionarOficina(req, res) {
  try {
    const { professorId, oficinaId } = req.params;
    
    // Verificar se o professor existe
    const professor = await Professor.findById(professorId);
    if (!professor) {
      return res.status(404).json({ erro: "Professor não encontrado" });
    }

    // Adicionar oficina ao professor (evitando duplicatas)
    if (!professor.oficinas.includes(oficinaId)) {
      professor.oficinas.push(oficinaId);
      await professor.save();
    }

    res.json({
      success: true,
      professor: await Professor.findById(professorId)
        .populate("oficinas")
        .select("-user.senha")
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

// Adicione ao exports no final do arquivo:
module.exports = {
  criarProfessor,
  listarProfessores,
  buscarProfessorPorId,
  atualizarProfessor,
  deletarProfessor,
  adicionarOficina 
};
