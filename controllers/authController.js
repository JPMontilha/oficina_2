const bcrypt = require("bcrypt");
const Aluno = require("../models/aluno");
const Professor = require("../models/professor");

// Login de usuário (aluno ou professor)
async function login(req, res) {
  try {
    const { email, senha, tipo } = req.body;

    console.log(`Tentativa de login - Email: ${email}, Tipo: ${tipo}`);

    if (!email || !senha || !tipo) {
      return res
        .status(400)
        .json({ erro: "Email, senha e tipo são obrigatórios" });
    }

    let usuario = null;

    if (tipo === "aluno") {
      console.log("Buscando aluno...");
      usuario = await Aluno.findOne({ "user.email": email });
    } else if (tipo === "professor") {
      console.log("Buscando professor...");
      usuario = await Professor.findOne({ "user.email": email }).populate(
        "oficinas"
      );
    } else {
      return res.status(400).json({ erro: "Tipo de usuário inválido" });
    }

    if (!usuario) {
      console.log("Usuário não encontrado");
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    console.log("Usuário encontrado, verificando senha...");
    console.log("Senha do banco:", usuario.user.senha);
    console.log("Senha digitada:", senha);

    // Verificar senha - primeiro tentar comparação direta (texto plano)
    let senhaValida = false;

    if (usuario.user.senha === senha) {
      senhaValida = true;
      console.log("Senha válida (texto plano)");
    } else {
      // Se não for texto plano, tentar bcrypt
      try {
        senhaValida = await bcrypt.compare(senha, usuario.user.senha);
        console.log("Senha válida (bcrypt)");
      } catch (error) {
        console.log("Erro ao verificar senha com bcrypt:", error.message);
        senhaValida = false;
      }
    }

    if (!senhaValida) {
      console.log("Senha inválida");
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    console.log("Login bem-sucedido");

    // Retornar dados do usuário (sem a senha)
    const usuarioResponse = {
      _id: usuario._id,
      email: usuario.user.email,
      tipo: tipo,
    };

    if (tipo === "aluno") {
      usuarioResponse.periodo = usuario.periodo;
      usuarioResponse.ra = usuario.ra;
    } else if (tipo === "professor") {
      usuarioResponse.idP = usuario.idP;
      usuarioResponse.oficinas = usuario.oficinas;
    }

    res.json({
      sucesso: true,
      usuario: usuarioResponse,
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ erro: err.message });
  }
}

// Verificar se email já existe
async function verificarEmail(req, res) {
  try {
    const { email, tipo } = req.query;

    if (!email || !tipo) {
      return res.status(400).json({ erro: "Email e tipo são obrigatórios" });
    }

    let usuario = null;

    if (tipo === "aluno") {
      usuario = await Aluno.findOne({ "user.email": email });
    } else if (tipo === "professor") {
      usuario = await Professor.findOne({ "user.email": email });
    }

    res.json({ existe: !!usuario });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

module.exports = {
  login,
  verificarEmail,
};
