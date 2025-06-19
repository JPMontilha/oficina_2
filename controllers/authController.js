const bcrypt = require("bcrypt");
const Aluno = require("../models/aluno");
const Professor = require("../models/professor");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Login de usuário (aluno ou professor)
async function login(req, res) {
  try {
    const { email, senha, tipo } = req.body;

    if (!email || !senha || !tipo) {
      return res
        .status(400)
        .json({ erro: "Email, senha e tipo são obrigatórios" });
    }

    let usuario = null;

    if (tipo === "aluno") {
      usuario = await Aluno.findOne({ "user.email": email });
    } else if (tipo === "professor") {
      usuario = await Professor.findOne({ "user.email": email }).populate("oficinas");
    } else {
      return res.status(400).json({ erro: "Tipo de usuário inválido" });
    }

    if (!usuario) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.user.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: usuario._id, tipo: tipo }, // payload
      JWT_SECRET,
      { expiresIn: '2h' }
    );

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

    return res.json({
      sucesso: true,
      usuario: usuarioResponse,
      token: token, // Aqui você retorna o token para o frontend guardar
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
