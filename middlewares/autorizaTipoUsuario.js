function autorizaTipoUsuario(tipoPermitido) {
  return (req, res, next) => {
    if (req.usuario.tipo !== tipoPermitido) {
      return res.status(403).json({ erro: 'Acesso negado' });
    }
    next();
  };
}

module.exports = autorizaTipoUsuario;
