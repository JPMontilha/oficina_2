let alunosTable;
let searchInput;

document.addEventListener("DOMContentLoaded", function () {
  if (!requireLogin()) return;

  searchInput = document.getElementById("search-alunos");
  alunosTable = document.getElementById("alunos-table");
  const toggleModeBtn = document.getElementById("toggle-mode");

  const saveButton = document.createElement("button");
  saveButton.textContent = "Salvar Períodos";
  saveButton.className = "btn btn-success";
  saveButton.style.marginTop = "1rem";
  saveButton.style.display = "none";
  document.querySelector(".card").appendChild(saveButton);

  if (!searchInput || !alunosTable || !toggleModeBtn) {
    console.error("Elementos essenciais não encontrados na página");
    showMessage("Erro: Elementos da página não encontrados", "error");
    return;
  }

  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }

  let modoEdicao = false; // ✅ variável para controlar o estado de edição

  toggleModeBtn.addEventListener("click", function () {
    modoEdicao = !modoEdicao; // ✅ alterna o estado corretamente
    const editPeriodColumns = document.querySelectorAll(".edit-period");
    editPeriodColumns.forEach((col) => {
      col.classList.toggle("hidden", !modoEdicao);
    });

    if (modoEdicao) {
      toggleModeBtn.textContent = "Sair do Modo Edição";
      toggleModeBtn.classList.remove("btn-primary");
      toggleModeBtn.classList.add("btn-success");
      saveButton.style.display = "block";
    } else {
      toggleModeBtn.textContent = "Modo Edição Período";
      toggleModeBtn.classList.remove("btn-success");
      toggleModeBtn.classList.add("btn-primary");
      saveButton.style.display = "none";
    }
  });

  saveButton.addEventListener("click", salvarPeriodos);

  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const rows = alunosTable.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? "" : "none";
    });
  });

  loadAlunos();
});

function logout() {
  if (confirm("Tem certeza que deseja sair?")) {
    userSession.clear();
    showMessage("Logout realizado com sucesso!", "success");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  }
}

async function loadAlunos() {
  try {
    showMessage("Carregando lista de alunos...", "info");
    const alunos = await alunosAPI.listar();
    const tbody = alunosTable.querySelector("tbody");

    if (!tbody) {
      console.error("Tabela de alunos não encontrada");
      showMessage("Erro: Tabela não encontrada", "error");
      return;
    }

    tbody.innerHTML = "";

    if (!alunos || alunos.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align: center;">Nenhum aluno encontrado</td></tr>';
      showMessage("Nenhum aluno encontrado", "warning");
      return;
    }

    alunos.forEach((aluno) => {
      const row = tbody.insertRow();
      row.innerHTML = `
        <td>${aluno.ra || "N/A"}</td>
        <td>${aluno.user?.email || "N/A"}</td>
        <td>Ativo</td>
        <td>${aluno.periodo}º Período</td>
        <td class="edit-period hidden">
          <select class="period-select form-control" data-id="${aluno._id}">
            ${Array.from({ length: 8 }, (_, i) => i + 1)
              .map(
                (num) => `
              <option value="${num}" ${
                  aluno.periodo === num ? "selected" : ""
                }>${num}º Período</option>
            `
              )
              .join("")}
          </select>
        </td>
      `;
    });

    showMessage(`${alunos.length} aluno(s) carregado(s) com sucesso`, "success");
  } catch (error) {
    console.error("Erro ao carregar alunos:", error);
    showMessage("Erro ao carregar lista de alunos: " + error.message, "error");
  }
}

async function salvarPeriodos() {
  try {
    const rows = alunosTable.querySelectorAll("tbody tr");
    const alunosAtualizados = [];

    for (const row of rows) {
      const periodoSelect = row.querySelector(".period-select");
      if (periodoSelect) {
        const alunoId = periodoSelect.dataset.id;
        const novoPeriodo = parseInt(periodoSelect.value);
        const periodoAtualText = row.cells[3].textContent;
        const periodoAnterior = parseInt(periodoAtualText.replace("º Período", ""));

        if (novoPeriodo !== periodoAnterior) {
          alunosAtualizados.push({ id: alunoId, periodo: novoPeriodo });
        }
      }
    }

    if (alunosAtualizados.length > 0) {
      for (const aluno of alunosAtualizados) {
        await alunosAPI.atualizar(aluno.id, { periodo: aluno.periodo });
      }

      showMessage("Períodos atualizados com sucesso!", "success");
      await loadAlunos();

      document.getElementById("toggle-mode").click(); // Sai do modo edição automaticamente
    } else {
      showMessage("Nenhum período foi alterado.", "warning");
    }
  } catch (error) {
    console.error("Erro ao salvar períodos:", error);
    showMessage("Erro ao salvar períodos. Tente novamente.", "error");
  }
}
