let professoresTable;
let searchInput;

document.addEventListener("DOMContentLoaded", function () {
  if (!requireLogin()) return;

  searchInput = document.getElementById("search-professores");
  professoresTable = document.getElementById("professores-table");

  if (!searchInput || !professoresTable) {
    console.error("Elementos essenciais não encontrados na página");
    showMessage("Erro: Elementos da página não encontrados", "error");
    return;
  }

  const logoutButton = document.querySelector('a[onclick="logout()"]');
  if (logoutButton) {
    logoutButton.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }

  loadProfessores();

  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const rows = professoresTable.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? "" : "none";
    });
  });

  const editForm = document.getElementById("editForm");
  const addForm = document.getElementById("addForm");

  if (editForm) {
    editForm.addEventListener("submit", handleEditSubmit);
  }

  if (addForm) {
    addForm.addEventListener("submit", handleAddSubmit);
  }
});

async function loadProfessores() {
  try {
    if (!professoresTable) {
      console.error("Tabela de professores não inicializada");
      showMessage("Erro: Tabela não encontrada", "error");
      return;
    }

    showMessage("Carregando lista de professores...", "info");
    const professores = await professoresAPI.listar();
    const tbody = professoresTable.querySelector("tbody");

    if (!tbody) {
      console.error("Tbody da tabela de professores não encontrado");
      showMessage("Erro: Estrutura da tabela não encontrada", "error");
      return;
    }

    tbody.innerHTML = "";

    if (!professores || professores.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align: center;">Nenhum professor encontrado</td></tr>';
      showMessage("Nenhum professor encontrado", "warning");
      return;
    }

    professores.forEach((professor) => {
      const row = tbody.insertRow();
      const oficinasCount = professor.oficinas ? professor.oficinas.length : 0;

      row.innerHTML = `
                <td>${professor.idP || "N/A"}</td>
                <td>${professor.user?.email || "N/A"}</td>
                <td>${professor.user?.email || "N/A"}</td>
                <td>${professor.area || "Não especificada"}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="verDetalhes('${
                      professor._id
                    }')">
                        Ver Detalhes
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="editarProfessor('${
                      professor._id
                    }')">
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deletarProfessor('${
                      professor._id
                    }')">
                        Excluir
                    </button>
                </td>
            `;
    });

    showMessage(
      `${professores.length} professor(es) carregado(s) com sucesso`,
      "success"
    );
  } catch (error) {
    console.error("Erro ao carregar professores:", error);
    showMessage(
      "Erro ao carregar lista de professores: " + error.message,
      "error"
    );
  }
}

async function verDetalhes(professorId) {
  try {
    const professor = await professoresAPI.buscarPorId(professorId);

    let oficinasInfo = "Nenhuma oficina atribuída";
    if (professor.oficinas && professor.oficinas.length > 0) {
      oficinasInfo = professor.oficinas
        .map((oficina) => `${oficina.nome} (ID: ${oficina.id})`)
        .join("\n");
    }

    alert(
      `Professor: ${professor.user.email}\nID: ${professor.idP}\nOficinas:\n${oficinasInfo}`
    );
  } catch (error) {
    console.error("Erro ao carregar detalhes do professor:", error);
    showMessage("Erro ao carregar detalhes do professor", "error");
  }
}

async function editarProfessor(professorId) {
  try {
    const professor = await professoresAPI.buscarPorId(professorId);

    // Preencher o formulário de edição
    document.getElementById("editProfessorId").value = professor._id;
    document.getElementById("editCodigo").value = professor.idP;
    document.getElementById("editNome").value = professor.user.email; // Usando email como nome por enquanto
    document.getElementById("editEmail").value = professor.user.email;
    document.getElementById("editArea").value = professor.area || "";

    document.getElementById("editModal").style.display = "block";
  } catch (error) {
    console.error("Erro ao carregar dados do professor:", error);
    showMessage("Erro ao carregar dados do professor", "error");
  }
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

function openAddModal() {
  document.getElementById("addModal").style.display = "block";
}

function closeAddModal() {
  document.getElementById("addModal").style.display = "none";
  document.getElementById("addForm").reset();
}

async function handleEditSubmit(event) {
  event.preventDefault();

  const professorId = document.getElementById("editProfessorId").value;
  const idP = document.getElementById("editCodigo").value;
  const email = document.getElementById("editEmail").value;
  const area = document.getElementById("editArea").value;

  try {
    await professoresAPI.atualizar(professorId, { idP, email, area });
    showMessage("Professor atualizado com sucesso!", "success");
    closeEditModal();
    await loadProfessores();
  } catch (error) {
    console.error("Erro ao atualizar professor:", error);
    showMessage("Erro ao atualizar professor. Tente novamente.", "error");
  }
}

async function handleAddSubmit(event) {
  event.preventDefault();

  const idP = document.getElementById("addCodigo").value;
  const email = document.getElementById("addEmail").value;
  const area = document.getElementById("addArea").value;

  try {
    await professoresAPI.criar({ idP, email, area });
    showMessage("Professor criado com sucesso!", "success");
    closeAddModal();
    await loadProfessores();
  } catch (error) {
    console.error("Erro ao criar professor:", error);
    showMessage("Erro ao criar professor. Tente novamente.", "error");
  }
}

function logout() {
  if (confirm("Tem certeza que deseja sair?")) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
}

async function deletarProfessor(professorId) {
  if (!confirm("Tem certeza que deseja excluir este professor?")) {
    return;
  }

  try {
    await professoresAPI.deletar(professorId);
    showMessage("Professor excluído com sucesso!", "success");
    await loadProfessores();
  } catch (error) {
    console.error("Erro ao excluir professor:", error);
    showMessage("Erro ao excluir professor. Tente novamente.", "error");
  }
}
