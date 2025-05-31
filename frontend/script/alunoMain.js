document.addEventListener("DOMContentLoaded", function () {
  if (!requireLogin()) return;

  const userData = userSession.get();

  if (userData.tipo !== "aluno") {
    showMessage("Acesso negado. Esta página é apenas para alunos.", "error");
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
    return;
  }

  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }

  loadAlunoData();
  loadOficinasDoAluno();
});

async function loadAlunoData() {
  try {
    const userData = userSession.get();
    const aluno = await alunosAPI.buscarPorId(userData._id);

    updateAlunoInfo(aluno);
  } catch (error) {
    console.error("Erro ao carregar dados do aluno:", error);
    showMessage("Erro ao carregar seus dados", "error");
  }
}

function updateAlunoInfo(aluno) {
  const userNameElement = document.querySelector(".user-name");
  if (userNameElement) {
    userNameElement.textContent = aluno.user.email;
  }

  const periodoElement = document.querySelector(".card-count");
  if (periodoElement) {
    periodoElement.textContent = aluno.periodo;
  }

  const raElement = document.querySelector(".aluno-ra");
  if (raElement) {
    raElement.textContent = `RA: ${aluno.ra}`;
  }
}

async function loadOficinasDoAluno() {
  try {
    const userData = userSession.get();
    const oficinas = await oficinasAPI.listar();

    const oficinasDoAluno = oficinas.filter((oficina) =>
      oficina.alunos.some((aluno) => aluno._id === userData._id)
    );

    const oficinaCountElement = document.querySelector(
      ".card:first-child .card-count"
    );
    if (oficinaCountElement) {
      oficinaCountElement.textContent = oficinasDoAluno.length;
    }

    updateOficinasTable(oficinasDoAluno);
  } catch (error) {
    console.error("Erro ao carregar oficinas:", error);
    showMessage("Erro ao carregar oficinas", "error");
  }
}

function updateOficinasTable(oficinas) {
  const tableBody = document.querySelector(".table tbody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (oficinas.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML =
      '<td colspan="3" style="text-align: center;">Nenhuma oficina encontrada</td>';
    tableBody.appendChild(row);
    return;
  }

  oficinas.forEach((oficina) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${oficina.nome}</td>
            <td>${oficina.alunos.length} participantes</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="verDetalhesOficina('${oficina._id}')">
                    Ver Detalhes
                </button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}

async function verDetalhesOficina(oficinaId) {
  try {
    const oficina = await oficinasAPI.buscarPorId(oficinaId);

    showOficinaDetails(oficina);
  } catch (error) {
    console.error("Erro ao carregar detalhes da oficina:", error);
    showMessage("Erro ao carregar detalhes da oficina", "error");
  }
}

function showOficinaDetails(oficina) {
  const modal = document.createElement("div");
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

  modal.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px; max-width: 500px; width: 90%;">
            <h3>Detalhes da Oficina</h3>
            <p><strong>Nome:</strong> ${oficina.nome}</p>
            <p><strong>ID:</strong> ${oficina.id}</p>
            <p><strong>Total de Participantes:</strong> ${
              oficina.alunos.length
            }</p>
            <h4>Participantes:</h4>
            <ul>
                ${oficina.alunos
                  .map(
                    (aluno) => `
                    <li>${aluno.user?.email || "Email não disponível"} - RA: ${
                      aluno.ra
                    } - Período: ${aluno.periodo}</li>
                `
                  )
                  .join("")}
            </ul>
            <button onclick="this.parentElement.parentElement.remove()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
                Fechar
            </button>
        </div>
    `;

  document.body.appendChild(modal);

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
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

document.addEventListener("DOMContentLoaded", async function () {
  if (!requireLogin()) return;

  const userData = userSession.get();

  if (userData.tipo !== "aluno") {
    showMessage("Acesso negado. Esta página é apenas para alunos.", "error");
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
    return;
  }

  // Configurar logout
  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }

  try {
    // Carregar dados completos do aluno
    const aluno = await alunosAPI.buscarPorId(userData._id);
    
    // Atualizar interface com os dados do aluno
    updateDashboard(aluno);
    updateDadosPessoais(aluno);
    updateOficinas(aluno);
    
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    showMessage("Erro ao carregar dados do sistema", "error");
  }
});

// Atualiza o dashboard (cards superiores)
function updateDashboard(aluno) {
  // Período do aluno
  const periodoElement = document.querySelector(".card:nth-child(2) .card-count");
  if (periodoElement) {
    periodoElement.textContent = aluno.periodo || "Não informado";
  }

  // Total de oficinas (será atualizado depois)
  const oficinaCountElement = document.querySelector(".card:first-child .card-count");
  if (oficinaCountElement) {
    oficinaCountElement.textContent = "Carregando...";
  }
}

// Atualiza a seção de dados pessoais
function updateDadosPessoais(aluno) {
  const dadosSection = document.querySelector(".card:nth-child(3)");
  if (!dadosSection) return;

  dadosSection.innerHTML = `
    <h2 class="card-title">Meus Dados</h2>
    <div class="user-info">
      <div class="info-group">
        <span class="info-label">Nome:</span>
        <span class="info-value">${aluno.user?.email || "Não informado"}</span>
      </div>
      <div class="info-group">
        <span class="info-label">RA:</span>
        <span class="info-value">${aluno.ra || "Não informado"}</span>
      </div>
      <div class="info-group">
        <span class="info-label">Período:</span>
        <span class="info-value">${aluno.periodo || "Não informado"}</span>
      </div>
    </div>
  `;
}

// Atualiza a lista de oficinas
async function updateOficinas(aluno) {
  try {
    const tableBody = document.querySelector(".table tbody");
    if (!tableBody) return;

    // Mostrar loading
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center;">
          Carregando oficinas...
        </td>
      </tr>
    `;

    // Buscar todas as oficinas
    const todasOficinas = await oficinasAPI.listar();
    
    // Filtrar apenas as oficinas do aluno
    const oficinasDoAluno = todasOficinas.filter(oficina => 
      oficina.alunos.some(a => a._id === aluno._id)
    );

    // Atualizar contagem no dashboard
    const oficinaCountElement = document.querySelector(".card:first-child .card-count");
    if (oficinaCountElement) {
      oficinaCountElement.textContent = oficinasDoAluno.length;
    }

    // Preencher tabela
    if (oficinasDoAluno.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center;">
            Você não está inscrito em nenhuma oficina
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = oficinasDoAluno.map(oficina => `
      <tr>
        <td>${oficina.nome || "Sem nome"}</td>
        <td>${oficina.tipo || "Não especificado"}</td>
        <td>${formatarData(oficina.data)}</td>
        <td>${oficina.local || "Não especificado"}</td>
        <td>${oficina.responsavel?.nome || "Não especificado"}</td>
        <td>${oficina.alunos?.length || 0}</td>
      </tr>
    `).join("");
    
  } catch (error) {
    console.error("Erro ao carregar oficinas:", error);
    showMessage("Erro ao carregar suas oficinas", "error");
    
    const tableBody = document.querySelector(".table tbody");
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--danger-color);">
            Erro ao carregar oficinas
          </td>
        </tr>
      `;
    }
  }
}

// Função auxiliar para formatar data
function formatarData(dataString) {
  if (!dataString) return "Não especificada";
  
  try {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  } catch {
    return dataString; // Retorna o valor original se não puder formatar
  }
}

// Função de logout (mantida da versão anterior)
function logout() {
  if (confirm("Tem certeza que deseja sair?")) {
    userSession.clear();
    showMessage("Logout realizado com sucesso!", "success");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  }
}