// Função para carregar dados do aluno
async function loadStudentData() {
  if (!requireLogin()) return;

  try {
    if (!userSession.isLoggedIn()) {
      showMessage("Sessão expirada. Faça login novamente.", "error");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    const user = userSession.get();
    if (!user || !user.email) {
      showMessage("Dados de usuário inválidos", "error");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    const aluno = await alunosAPI.buscarPorEmail(user.email);
    if (!aluno) {
      showMessage("Aluno não encontrado", "error");
      return;
    }

    // Preencher dados pessoais
    document.getElementById("user-name").textContent = user.email.split("@")[0];
    document.getElementById("user-ra").textContent = aluno.ra || "N/A";
    document.getElementById("user-email").textContent = user.email;
    document.getElementById("user-periodo").textContent = `${aluno.periodo || 1}º Período`;

    // Carregar oficinas do aluno
    loadStudentWorkshops(aluno.oficinas || []);
  } catch (error) {
    console.error("Erro ao carregar dados do aluno:", error);
    showMessage("Erro ao carregar dados do aluno", "error");
  }
}

// Função para carregar oficinas do aluno
function loadStudentWorkshops(oficinas) {
  const tbody = document.getElementById("oficinas-tbody");
  tbody.innerHTML = "";

  if (!oficinas || oficinas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">Nenhuma oficina encontrada</td></tr>';
    return;
  }

  oficinas.forEach((oficina) => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${oficina.nome}</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    `;
  });
}

// Função para abrir modal de edição
function openEditModal() {
  document.getElementById("edit-modal").classList.remove("hidden");
}

// Função para fechar modal de edição
function closeEditModal() {
  document.getElementById("edit-modal").classList.add("hidden");
}

// Função de logout
function logout() {
  if (confirm("Tem certeza que deseja sair?")) {
    userSession.clear();
    showMessage("Logout realizado com sucesso!", "success");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  }
}

// Função para mostrar mensagens
function showMessage(message, type) {
  const messageDiv = type === "error"
    ? document.getElementById("edit-error-message")
    : document.getElementById("edit-success-message");

  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.style.display = "block";
    setTimeout(() => {
      messageDiv.style.display = "none";
    }, 3000);
  }
}

// Fechar modal ao clicar no X
document.querySelector(".close-modal").addEventListener("click", closeEditModal);

// Carregar dados quando a página carregar
document.addEventListener("DOMContentLoaded", loadStudentData);