const Oficina = require("../models/oficina");
const Professor = require("../models/professor");
const Aluno = require("../models/aluno");

// ... (outras funções existentes permanecem iguais) ...

// Adicionar aluno a uma oficina
async function adicionarAluno(req, res) {
  try {
    const { oficinaId } = req.params;
    const { alunoId } = req.body;

    // Verificar se a oficina existe
    const oficina = await Oficina.findById(oficinaId);
    if (!oficina) {
      return res.status(404).json({ erro: "Oficina não encontrada" });
    }

    // Verificar se o aluno existe
    const aluno = await Aluno.findById(alunoId);
    if (!aluno) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    // Verificar se o aluno já está na oficina
    if (oficina.alunos.includes(alunoId)) {
      return res.status(400).json({ erro: "Aluno já está inscrito nesta oficina" });
    }

    // Adicionar aluno à oficina
    oficina.alunos.push(alunoId);
    await oficina.save();

    res.json({
      success: true,
      oficina: await Oficina.findById(oficinaId).populate("alunos", "user.email periodo ra")
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

// Remover aluno de uma oficina
async function removerAluno(req, res) {
  try {
    const { oficinaId, alunoId } = req.params;

    // Verificar se a oficina existe
    const oficina = await Oficina.findById(oficinaId);
    if (!oficina) {
      return res.status(404).json({ erro: "Oficina não encontrada" });
    }

    // Verificar se o aluno está na oficina
    const alunoIndex = oficina.alunos.indexOf(alunoId);
    if (alunoIndex === -1) {
      return res.status(400).json({ erro: "Aluno não está inscrito nesta oficina" });
    }

    // Remover aluno da oficina
    oficina.alunos.splice(alunoIndex, 1);
    await oficina.save();

    res.json({
      success: true,
      oficina: await Oficina.findById(oficinaId).populate("alunos", "user.email periodo ra")
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

module.exports = {
  criarOficina,
  listarOficinas,
  buscarOficinaPorId,
  atualizarOficina,
  deletarOficina,
  adicionarAluno, // Adicionando as novas funções ao exports
  removerAluno,
};