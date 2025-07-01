const express = require("express");
const router = express.Router();
const alunoController = require("../controllers/alunoController");
const autorizaTipoUsuario = require("../middlewares/autorizaTipoUsuario");
const autenticar = require("../middlewares/autenticar");

// Rota de criação de aluno
router.post("/", alunoController.criarAluno);
// Rota de listagem de alunos
router.get("/", alunoController.listarAlunos);
// Rota de busca de aluno por ID
router.get("/:id", alunoController.buscarAlunoPorId);
//Rota de atualização de aluno
router.put(
  "/:id",
  autenticar,
  async (req, res, next) => {
    const usuarioId = req.usuario.id;
    const alunoId = req.params.id;
    const tipoUsuario = req.usuario.tipo;
    const dadosAtualizacao = req.body;

    // Aluno pode alterar apenas seus próprios dados (exceto período)
    if (tipoUsuario === "aluno" && usuarioId === alunoId) {
      // Verificar se o aluno está tentando alterar o período
      if (dadosAtualizacao.periodo !== undefined) {
        return res.status(403).json({
          erro: "Acesso negado: alunos não podem alterar o período",
        });
      }
      return next();
    }
    // Professor pode alterar dados de qualquer aluno
    else if (tipoUsuario === "professor") {
      return next();
    }
    // Aluno tentando alterar dados de outro aluno
    else if (tipoUsuario === "aluno" && usuarioId !== alunoId) {
      return res.status(403).json({
        erro: "Acesso negado: você só pode alterar seus próprios dados",
      });
    }
    // Outros tipos de usuário não têm permissão
    else {
      return res.status(403).json({
        erro: "Acesso negado: tipo de usuário não autorizado",
      });
    }
  },
  alunoController.atualizarAluno
);
//Rota de atualização de aluno (sem autenticação, para testes)
router.put("/teste/:id", alunoController.atualizarAluno);
//Rota de deleção de aluno
router.delete("/:id", alunoController.deletarAluno);

module.exports = router;
