document.addEventListener("DOMContentLoaded", function () {
  const cadastroForm = document.getElementById("cadastroForm");

  if (cadastroForm) {
    cadastroForm.addEventListener("submit", handleCadastro);
  }

  document.addEventListener("change", function (event) {
    if (event.target.name === "tipo") {
      toggleUserTypeFields();
    }
  });

  if (userSession.isLoggedIn()) {
    const userData = userSession.get();
    redirectBasedOnUserType(userData.tipo);
  }
});

async function handleCadastro(event) {
  event.preventDefault();

  const email = document.getElementById("cadastro-email").value;
  const senha = document.getElementById("cadastro-senha").value;
  const confirmarSenha = document.getElementById("confirmar-senha").value;
  const tipo = document.querySelector('input[name="tipo"]:checked')?.value;

  if (!email || !senha || !confirmarSenha || !tipo) {
    showMessage("Por favor, preencha todos os campos", "error");
    return;
  }

  if (senha !== confirmarSenha) {
    showMessage("As senhas não coincidem", "error");
    return;
  }

  if (senha.length < 6) {
    showMessage("A senha deve ter pelo menos 6 caracteres", "error");
    return;
  }

  try {
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = "Cadastrando...";
    submitButton.disabled = true;

    const emailExiste = await authAPI.verificarEmail(email, tipo);
    if (emailExiste.existe) {
      throw new Error("Este email já está cadastrado");
    }

    let dadosUsuario = {
      user: {
        email: email,
        senha: senha,
      },
    };

    if (tipo === "aluno") {
      const ra = document.getElementById("ra")?.value;
      const periodo = document.getElementById("periodo")?.value;

      if (!ra || !periodo) {
        throw new Error("RA e período são obrigatórios para alunos");
      }

      dadosUsuario.ra = parseInt(ra);
      dadosUsuario.periodo = parseInt(periodo);

      const response = await alunosAPI.criar(dadosUsuario);
      showMessage("Aluno cadastrado com sucesso!", "success");
    } else if (tipo === "professor") {
      const idP = document.getElementById("idP")?.value;

      if (!idP) {
        throw new Error("ID do professor é obrigatório");
      }

      dadosUsuario.idP = parseInt(idP);
      dadosUsuario.oficinas = [];

      const response = await professoresAPI.criar(dadosUsuario);
      showMessage("Professor cadastrado com sucesso!", "success");
    }

    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  } catch (error) {
    showMessage(error.message || "Erro ao realizar cadastro", "error");
  } finally {
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

function redirectBasedOnUserType(tipo) {
  switch (tipo) {
    case "aluno":
      window.location.href = "/aluno";
      break;
    case "professor":
      window.location.href = "/professor";
      break;
    default:
      showMessage("Tipo de usuário inválido", "error");
  }
}

function toggleUserTypeFields() {
  const tipoSelecionado = document.querySelector(
    'input[name="tipo"]:checked'
  )?.value;
  const camposAluno = document.getElementById("campos-aluno");
  const camposProfessor = document.getElementById("campos-professor");

  if (camposAluno && camposProfessor) {
    if (tipoSelecionado === "aluno") {
      camposAluno.style.display = "block";
      camposProfessor.style.display = "none";
    } else if (tipoSelecionado === "professor") {
      camposAluno.style.display = "none";
      camposProfessor.style.display = "block";
    } else {
      camposAluno.style.display = "none";
      camposProfessor.style.display = "none";
    }
  }
}
