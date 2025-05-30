const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Rota de login
router.post("/login", authController.login);

// Rota para verificar se email existe
router.get("/verificar-email", authController.verificarEmail);

module.exports = router;
