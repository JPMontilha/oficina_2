async function loadProfessorData() {
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

    const professor = await professoresAPI.buscarPorEmail(user.email);
    if (!professor) {
      showMessage("Professor não encontrado", "error");
      return;
    }

    // Preencher dados pessoais
    document.getElementById("professor-name").textContent = user.email.split("@")[0];
    document.getElementById("professor-codigo").textContent = professor.idP || "N/A";
    document.getElementById("professor-email").textContent = user.email;

    // Carregar oficinas do professor
    loadProfessorWorkshops(professor.oficinas || []);
  } catch (error) {
    console.error("Erro ao carregar dados do professor:", error);
    showMessage("Erro ao carregar dados do professor", "error");
  }
}

// Função para carregar alunos disponíveis
async function carregarAlunosDisponiveis() {
  try {
    const response = await fetch('/api/alunos'); // Ajuste o caminho da API conforme seu backend
    if (!response.ok) throw new Error('Falha ao carregar alunos');

    const alunos = await response.json();

    const tbody = document.getElementById('available-students');
    tbody.innerHTML = ''; // limpa o conteúdo atual

    if (alunos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">Nenhum aluno disponível</td></tr>';
      return;
    }

    alunos.forEach(aluno => {
      const nome = aluno.nome || aluno.user?.email?.split('@')[0] || 'Sem nome';
      const codigo = aluno.codigo || aluno.ra || 'Sem código';
      const email = aluno.email || aluno.user?.email || 'Sem e-mail';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${nome}</td>
        <td>${codigo}</td>
        <td>${email}</td>
        <td class="actions">
          <button class="btn btn-success btn-small" onclick="adicionarAluno('${aluno._id}', '${nome}')">Adicionar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Erro ao carregar alunos disponíveis:', error);
    const tbody = document.getElementById('available-students');
    tbody.innerHTML = '<tr><td colspan="4">Erro ao carregar alunos</td></tr>';
  }
}

// Função para carregar oficinas do professor
function loadProfessorWorkshops(oficinas) {
  const tbody = document.getElementById("professor-oficinas");
  tbody.innerHTML = "";

  if (!oficinas || oficinas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">Nenhuma oficina encontrada</td></tr>';
    return;
  }

  oficinas.forEach((oficina) => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${oficina.nome}</td>
      <td>Oficina</td>
      <td>-</td>
      <td>-</td>
      <td class="actions">
          <button class="btn btn-primary btn-small" onclick="gerenciarAlunos('${oficina._id}', '${oficina.nome}')">
              Gerenciar Alunos
          </button>
      </td>
    `;
  });
}

// Função para gerenciar alunos de uma oficina
async function gerenciarAlunos(oficinaId, oficinaName) {
  try {
    const oficina = await oficinasAPI.buscarPorId(oficinaId);
    document.getElementById("workshop-name").textContent = oficinaName;

    loadEnrolledStudents(oficina.alunos || []);
    await carregarAlunosDisponiveis();  // Carrega os alunos do backend para adicionar

    document.getElementById("manage-modal").classList.remove("hidden");

    // Salve o oficinaId em uma variável global para usar na função adicionarAluno()
    currentOficinaId = oficinaId;
  } catch (error) {
    console.error("Erro ao carregar dados da oficina:", error);
    showMessage("Erro ao carregar dados da oficina", "error");
  }
}

// Função para carregar alunos inscritos
function loadEnrolledStudents(alunos) {
  const tbody = document.getElementById("students-list");
  tbody.innerHTML = "";

  if (!alunos || alunos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">Nenhum aluno inscrito</td></tr>';
    return;
  }

  alunos.forEach((aluno) => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${aluno.user?.email?.split("@")[0] || "Sem nome"}</td>
      <td>${aluno.ra || "Sem RA"}</td>
      <td>${aluno.user?.email || "Sem e-mail"}</td>
      <td class="actions">
          <button class="btn btn-danger btn-small" onclick="removerAluno('${aluno._id}', '${aluno.user?.email}')">
              Remover
          </button>
      </td>
    `;
  });
}

// Função para buscar alunos do backend (rota GET /alunos)
async function fetchAvailableStudents() {
  try {
    const response = await fetch('/api/alunos'); // ajuste a URL conforme seu backend
    if (!response.ok) throw new Error('Falha ao carregar alunos');
    const alunos = await response.json();
    return alunos;
  } catch (error) {
    console.error(error);
    showMessage('Erro ao buscar alunos disponíveis', 'error');
    return [];
  }
}

// Função para renderizar alunos na aba "Adicionar Alunos"
function renderAvailableStudents(alunos) {
  const tbody = document.getElementById('available-students');
  tbody.innerHTML = ''; // limpa a lista

  if (!alunos.length) {
    tbody.innerHTML = '<tr><td colspan="4">Nenhum aluno encontrado</td></tr>';
    return;
  }

  alunos.forEach(aluno => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${aluno.nome || aluno.user?.email?.split('@')[0] || 'Sem nome'}</td>
      <td>${aluno.codigo || aluno.ra || 'Sem código'}</td>
      <td>${aluno.email || aluno.user?.email || 'Sem e-mail'}</td>
      <td class="actions">
        <button class="btn btn-success btn-small" onclick="adicionarAluno('${aluno._id}', '${aluno.nome || aluno.user?.email}')">Adicionar</button>
      </td>
    `;
  });
}

// Função para filtrar alunos com base no input da busca
async function buscarAlunos() {
  const filtro = document.getElementById('add-student-search').value.toLowerCase();

  const alunos = await fetchAvailableStudents();

  const alunosFiltrados = alunos.filter(aluno => {
    const nome = (aluno.nome || aluno.user?.email?.split('@')[0] || '').toLowerCase();
    const codigo = (aluno.codigo || aluno.ra || '');
    return nome.includes(filtro) || codigo.includes(filtro);
  });

  renderAvailableStudents(alunosFiltrados);
}

// Função para adicionar aluno (implemente a API de adicionar na oficina)
async function adicionarAluno(alunoId, alunoNome) {
  if (!confirm(`Deseja adicionar o aluno ${alunoNome}?`)) return;

  try {
    const responseOficina = await fetch(`/api/oficinas/${currentOficinaId}`);
    if (!responseOficina.ok) throw new Error('Erro ao buscar oficina');
    const oficina = await responseOficina.json();

    if (oficina.alunos && oficina.alunos.includes(alunoId)) {
      showMessage('Aluno já está inscrito nesta oficina', 'error');
      return;
    }

    const novosAlunos = oficina.alunos ? [...oficina.alunos, alunoId] : [alunoId];

    const responseUpdate = await fetch(`/api/oficinas/${currentOficinaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userSession.get().token}`
      },
      body: JSON.stringify({ alunos: novosAlunos }),
    });

    if (!responseUpdate.ok) {
      const erroData = await responseUpdate.json();
      throw new Error(erroData.erro || 'Erro ao atualizar oficina');
    }

    // ⚠️ Buscar novamente a oficina atualizada (com dados completos)
    const responseAtualizada = await fetch(`/api/oficinas/${currentOficinaId}`);
    if (!responseAtualizada.ok) throw new Error('Erro ao buscar oficina atualizada');
    const oficinaAtualizada = await responseAtualizada.json();

    loadEnrolledStudents(oficinaAtualizada.alunos || []);
    await buscarAlunos(); // Atualiza lista de disponíveis
    showMessage('Aluno adicionado com sucesso!', 'success');

  } catch (error) {
    console.error(error);
    showMessage(error.message, 'error');
  }
}

// Função para remover aluno
async function removerAluno(alunoId, alunoEmail) {
  if (!confirm(`Deseja remover o aluno ${alunoEmail}?`)) return;

  console.log(`Removendo aluno ${alunoEmail} (${alunoId}) da oficina ${currentOficinaId}`);

  try {
    const responseOficina = await fetch(`/api/oficinas/${currentOficinaId}`);
    if (!responseOficina.ok) throw new Error('Erro ao buscar oficina');
    const oficina = await responseOficina.json();

    const alunosIds = (oficina.alunos || []).map(aluno => aluno._id.toString());

    if (!alunosIds.includes(alunoId)) {
      showMessage('Aluno não encontrado nesta oficina', 'error');
      return;
    }

    console.log(`Alunos antes da remoção: ${alunosIds.join(', ')}`);

    const novosAlunos = alunosIds.filter(id => id !== alunoId);

    const responseUpdate = await fetch(`/api/oficinas/${currentOficinaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userSession.get().token}`
      },
      body: JSON.stringify({ alunos: novosAlunos }),
    });

    console.log(`Alunos após a remoção: ${novosAlunos.join(', ')}`);

    if (!responseUpdate.ok) {
      const erroData = await responseUpdate.json();
      throw new Error(erroData.erro || 'Erro ao atualizar oficina');
    }

    const responseAtualizada = await fetch(`/api/oficinas/${currentOficinaId}`);
    if (!responseAtualizada.ok) throw new Error('Erro ao buscar oficina atualizada');
    const oficinaAtualizada = await responseAtualizada.json();

    loadEnrolledStudents(oficinaAtualizada.alunos || []);
    await buscarAlunos();
    showMessage('Aluno removido com sucesso!', 'success');

    console.log(`Aluno ${alunoEmail} removido com sucesso da oficina ${oficina.nome}`);

  } catch (error) {
    console.error(error);
    showMessage(error.message, 'error');
  }
}

// Evento do botão buscar
document.querySelector('#add-student-search + button').addEventListener('click', buscarAlunos);

// Opcional: busca automática ao digitar (com debounce)
document.getElementById('add-student-search').addEventListener('input', () => {
  clearTimeout(this.delay);
  this.delay = setTimeout(buscarAlunos, 300);
});

// Atualizar a lista disponível sempre que abrir o modal
async function abrirModalGerenciarAlunos(oficinaId, oficinaNome) {
  currentOficinaId = oficinaId;
  document.getElementById('workshop-name').textContent = oficinaNome;

  const oficina = await oficinasAPI.buscarPorId(oficinaId);
  loadEnrolledStudents(oficina.alunos || []);

  await buscarAlunos(); // carregar lista completa disponível

  document.getElementById('manage-modal').classList.remove('hidden');
}

// Função para abrir modal de edição
function openEditModal() {
  document.getElementById("edit-modal").classList.remove("hidden");
}

// Função para fechar modais
function closeModal(modalId) {
  document.getElementById(modalId).classList.add("hidden");
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

// Event listeners para abas
document.addEventListener("DOMContentLoaded", function () {
  loadProfessorData();

  // Abas do modal
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");

      // Remover classe active de todas as abas
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      // Adicionar classe active na aba clicada
      this.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // Fechar modais
  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", function () {
      this.closest(".modal").classList.add("hidden");
    });
  });
});