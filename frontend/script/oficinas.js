let oficinasTable;
let searchInput;

document.addEventListener("DOMContentLoaded", function () {
  if (!requireLogin()) return;

  // Configurar navegação baseada no tipo de usuário
  setupNavigation();

  searchInput = document.getElementById("search-oficinas");
  oficinasTable = document.getElementById("oficinas-table");

  if (!searchInput || !oficinasTable) {
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

  loadOficinas();

  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const rows = oficinasTable.querySelectorAll("tbody tr");

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

function setupNavigation() {
  const userData = userSession.get();
  if (!userData) return;

  // Configurar link de início baseado no tipo de usuário
  const inicioLink = document.getElementById("inicio-link");
  if (inicioLink) {
    if (userData.tipo === "aluno") {
      inicioLink.href = "/aluno";
    } else if (userData.tipo === "professor") {
      inicioLink.href = "/professor";
    }
  }

  // Ocultar links que alunos não devem ver
  hideMenuLinksForUser();
}

async function loadOficinas() {
  try {
    if (!oficinasTable) {
      console.error("Tabela de oficinas não inicializada");
      showMessage("Erro: Tabela não encontrada", "error");
      return;
    }

    showMessage("Carregando lista de oficinas...", "info");
    const oficinas = await oficinasAPI.listar();
    const tbody = oficinasTable.querySelector("tbody");

    if (!tbody) {
      console.error("Tbody da tabela de oficinas não encontrado");
      showMessage("Erro: Estrutura da tabela não encontrada", "error");
      return;
    }

    tbody.innerHTML = "";

    if (!oficinas || oficinas.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="4" style="text-align: center;">Nenhuma oficina encontrada</td></tr>';
      showMessage("Nenhuma oficina encontrada", "warning");
      return;
    }

    for (const oficina of oficinas) {
      const row = tbody.insertRow();

      row.innerHTML = `
        <td>${oficina.nome || "Sem nome"}</td>
        <td>${oficina.tipo || "Não especificado"}</td>
        <td>${formatarData(oficina.data)}</td>
        <td>${oficina.local || "Não especificado"}</td>
        <td>${oficina.alunos?.length || 0}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="verDetalhes('${
              oficina._id
            }')">
                Ver Detalhes
            </button>
        </td>
      `;
    }

    showMessage(
      `${oficinas.length} oficina(s) carregada(s) com sucesso`,
      "success"
    );
  } catch (error) {
    console.error("Erro ao carregar oficinas:", error);
    showMessage(
      "Erro ao carregar lista de oficinas: " + error.message,
      "error"
    );
  }
}

async function verDetalhes(oficinaId) {
  try {
    const oficina = await oficinasAPI.buscarPorId(oficinaId);

    let alunosInfo = "Nenhum aluno inscrito";
    if (oficina.alunos && oficina.alunos.length > 0) {
      alunosInfo = oficina.alunos
        .map(
          (aluno) =>
            `${aluno.user.email} (RA: ${aluno.ra}, Período: ${aluno.periodo})`
        )
        .join("\n");
    }

    alert(
      `Oficina: ${oficina.nome}\nID: ${oficina.id}\nAlunos inscritos:\n${alunosInfo}`
    );
  } catch (error) {
    console.error("Erro ao carregar detalhes da oficina:", error);
    showMessage("Erro ao carregar detalhes da oficina", "error");
  }
}

async function handleEditSubmit(event) {
  event.preventDefault();

  const oficinaId = document.getElementById("editOficinaId").value;
  const nome = document.getElementById("editNome").value.trim();
  const id = document.getElementById("editId").value.trim();

  if (!nome || !id) {
    showMessage("Por favor, preencha todos os campos", "warning");
    return;
  }

  if (isNaN(id) || parseInt(id) <= 0) {
    showMessage("ID deve ser um número positivo", "warning");
    return;
  }

  try {
    const oficinas = await oficinasAPI.listar();
    const idExists = oficinas.some(
      (oficina) => oficina.id == id && oficina._id !== oficinaId
    );

    if (idExists) {
      showMessage(
        "ID já existe em outra oficina! Escolha outro ID.",
        "warning"
      );
      return;
    }

    await oficinasAPI.atualizar(oficinaId, { nome, id: parseInt(id) });
    showMessage("Oficina atualizada com sucesso!", "success");
    closeEditModal();
    await loadOficinas();
  } catch (error) {
    console.error("Erro ao atualizar oficina:", error);
    showMessage("Erro ao atualizar oficina: " + error.message, "error");
  }
}

async function handleAddSubmit(event) {
  event.preventDefault();

  const nome = document.getElementById("addNome").value.trim();
  const id = document.getElementById("addId").value.trim();

  if (!nome || !id) {
    showMessage("Por favor, preencha todos os campos", "warning");
    return;
  }

  if (isNaN(id) || parseInt(id) <= 0) {
    showMessage("ID deve ser um número positivo", "warning");
    return;
  }

  try {
    const oficinas = await oficinasAPI.listar();
    const idExists = oficinas.some((oficina) => oficina.id == id);

    if (idExists) {
      showMessage("ID já existe! Escolha outro ID.", "warning");
      return;
    }

    await oficinasAPI.criar({ nome, id: parseInt(id) });
    showMessage("Oficina criada com sucesso!", "success");
    closeAddModal();
    await loadOficinas();
  } catch (error) {
    console.error("Erro ao criar oficina:", error);
    showMessage("Erro ao criar oficina: " + error.message, "error");
  }
}

function logout() {
  if (confirm("Tem certeza que deseja sair?")) {
    userSession.clear();
    showMessage("Logout realizado com sucesso!", "success");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  }
}

async function deletarOficina(oficinaId) {
  if (!confirm("Tem certeza que deseja excluir esta oficina?")) {
    return;
  }

  try {
    await oficinasAPI.deletar(oficinaId);
    showMessage("Oficina excluída com sucesso!", "success");
    await loadOficinas(); // Recarregar a lista
  } catch (error) {
    console.error("Erro ao excluir oficina:", error);
    showMessage("Erro ao excluir oficina. Tente novamente.", "error");
  }
}

// Funções auxiliares
function formatarData(dataString) {
  if (!dataString) return "Não especificada";

  try {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  } catch {
    return dataString;
  }
}
