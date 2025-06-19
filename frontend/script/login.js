document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (userSession.isLoggedIn()) {
    const userData = userSession.get();
    redirectBasedOnUserType(userData.tipo);
  }
});

async function handleLogin(event) {
  console.log("Login form submitted");
  event.preventDefault();

  const formData = new FormData(event.target);
  const email = document.getElementById("login-id").value; // Assumindo que o ID do campo é login-id
  const senha = document.getElementById("login-senha").value;
  const tipo = document.querySelector('input[name="tipo"]:checked')?.value;

  // Validação básica
  if (!email || !senha || !tipo) {
    showMessage("Por favor, preencha todos os campos", "error");
    return;
  }

  // Obter referências do botão fora do try
  const submitButton = event.target.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  try {
    // Mostrar loading
    submitButton.textContent = "Entrando...";
    submitButton.disabled = true;

    // Fazer login
    const response = await authAPI.login(email, senha, tipo);

    if (response.sucesso) {
      // Salvar dados do usuário
      userSession.save({
        ...response.usuario,
        token: response.token,
      });

      showMessage("Login realizado com sucesso!", "success");

      // Redirecionar baseado no tipo de usuário
      setTimeout(() => {
        redirectBasedOnUserType(tipo);
      }, 1000);
    } else {
      showMessage("Erro no login", "error");
    }
  } catch (error) {
    showMessage(error.message || "Erro ao fazer login", "error");
  } finally {
    // Restaurar botão
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

// Função para logout (pode ser usada em outras páginas)
function logout() {
  userSession.clear();
  showMessage("Logout realizado com sucesso!", "success");
  setTimeout(() => {
    window.location.href = "/login";
  }, 1000);
}
