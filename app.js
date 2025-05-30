require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("./db");
const app = express();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

// Rotas das APIs
const alunoRoutes = require("./routes/alunoRoutes");
const oficinaRoutes = require("./routes/oficinaRoutes");
const professorRoutes = require("./routes/professorRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/alunos", alunoRoutes);
app.use("/api/oficinas", oficinaRoutes);
app.use("/api/professores", professorRoutes);
app.use("/api/auth", authRoutes);

// Rota para servir a página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "html", "login.html"));
});

// Rotas para páginas específicas
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "html", "login.html"));
});

// Rota de redirecionamento para compatibilidade
app.get("/login.html", (req, res) => {
  res.redirect("/login");
});

app.get("/cadastro.html", (req, res) => {
  res.redirect("/cadastro");
});

app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "html", "cadastro.html"));
});

app.get("/aluno", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "html", "alunoMain.html"));
});

app.get("/professor", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "html", "professorMain.html"));
});

app.get("/alunos", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "html", "listaAluno.html"));
});

app.get("/oficinas", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "html", "listaOficina.html"));
});

app.get("/professores", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "html", "listaProfessor.html"));
});

app.get("/dados-aluno", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "html", "alunosDados.html"));
});

app.get("/dados-professor", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "html", "professorDados.html"));
});

app.get("/esqueci-senha", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "html", "esqueciSenha.html"));
});

// Middleware para tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

// Middleware para tratamento de erros gerais
app.use((error, req, res, next) => {
  console.error("Erro no servidor:", error);
  res.status(500).json({ erro: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 Acesse: http://localhost:${PORT}`);
  console.log(`🔗 Login: http://localhost:${PORT}/login`);
});
