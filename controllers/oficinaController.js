const Oficina = require("../models/oficina");
const Professor = require("../models/professor");
const Aluno = require("../models/aluno");

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
        const oficinaAtualizada = await Oficina.findByIdAndUpdate(req.params.id, atualizacoes, { new: true });
        if (!oficinaAtualizada) {
            return res.status(404).json({ erro: 'Oficina não encontrada' });
        }
        res.json(oficinaAtualizada);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
}

//Deletar oficinaAdd commentMore actions
async function deletarOficina(req, res) {
    try {
        const oficinaDeletada = await Oficina.findByIdAndDelete(req.params.id);
        if (!oficinaDeletada) {
            return res.status(404).json({ erro: 'Oficina não encontrada' });
        }
        res.status(200).json({ mensagem: 'Oficina deletada com sucesso' });
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
}

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
  adicionarAluno,
  removerAluno,
};