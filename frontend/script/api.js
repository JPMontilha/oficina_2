const API_BASE_URL = "http://localhost:3000/api";

async function makeRequest(url, options = {}) {
  const userData = userSession.get();
  const token = userData ? userData.token : null;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Se houver token e ainda não foi enviado no headers, adiciona
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = "Bearer " + token;
  }

  try {
    console.log("Fazendo requisição para:", url, "com opções:", options);
    console.log("Headers:", headers);
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || "Erro na requisição");
    }

    return data;
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
}

const authAPI = {
  async login(email, senha, tipo) {
    return makeRequest(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, senha, tipo }),
    });
  },

  async verificarEmail(email, tipo) {
    return makeRequest(
      `${API_BASE_URL}/auth/verificar-email?email=${encodeURIComponent(
        email
      )}&tipo=${tipo}`
    );
  },
};

const alunosAPI = {
  async listar() {
    return makeRequest(`${API_BASE_URL}/alunos`);
  },

  async buscarPorId(id) {
    return makeRequest(`${API_BASE_URL}/alunos/${id}`);
  },

  async buscarPorEmail(email) {
    const alunos = await this.listar();
    return alunos.find((aluno) => aluno.user.email === email);
  },

  async criar(dadosAluno) {
    return makeRequest(`${API_BASE_URL}/alunos`, {
      method: "POST",
      body: JSON.stringify(dadosAluno),
    });
  },

  async atualizar(id, dadosAluno) {
    return makeRequest(`${API_BASE_URL}/alunos/${id}`, {
      method: "PUT",
      body: JSON.stringify(dadosAluno),
    });
  },

  async deletar(id) {
    return makeRequest(`${API_BASE_URL}/alunos/${id}`, {
      method: "DELETE",
    });
  },
};

const oficinasAPI = {
  async listar() {
    return makeRequest(`${API_BASE_URL}/oficinas`);
  },

  async buscarPorId(id) {
    return makeRequest(`${API_BASE_URL}/oficinas/${id}`);
  },

  async criar(dadosOficina) {
    return makeRequest(`${API_BASE_URL}/oficinas`, {
      method: "POST",
      body: JSON.stringify(dadosOficina),
    });
  },

  async atualizar(id, dadosOficina) {
    return makeRequest(`${API_BASE_URL}/oficinas/${id}`, {
      method: "PUT",
      body: JSON.stringify(dadosOficina),
    });
  },

  async deletar(id) {
    return makeRequest(`${API_BASE_URL}/oficinas/${id}`, {
      method: "DELETE",
    });
  },
};

const professoresAPI = {
  async listar() {
    return makeRequest(`${API_BASE_URL}/professores`);
  },

  async buscarPorId(id) {
    return makeRequest(`${API_BASE_URL}/professores/${id}`);
  },

  async buscarPorEmail(email) {
    const professores = await this.listar();
    return professores.find((professor) => professor.user.email === email);
  },

  async buscarPorOficina(oficinaId) {
    const professores = await this.listar();

    const professor = professores.find((professor) =>
      professor.oficinas?.some((oficinaIdObj) => {
        const idComparar =
          typeof oficinaIdObj === "string"
            ? oficinaIdObj
            : oficinaIdObj.toString();
        return idComparar === oficinaId.toString();
      })
    );

    return professor ? professor.user.email : null;
  },

  async criar(dadosProfessor) {
    return makeRequest(`${API_BASE_URL}/professores`, {
      method: "POST",
      body: JSON.stringify(dadosProfessor),
    });
  },

  async atualizar(id, dadosProfessor) {
    return makeRequest(`${API_BASE_URL}/professores/${id}`, {
      method: "PUT",
      body: JSON.stringify(dadosProfessor),
    });
  },

  async deletar(id) {
    return makeRequest(`${API_BASE_URL}/professores/${id}`, {
      method: "DELETE",
    });
  },

  async adicionarOficina(professorId, oficinaId) {
    // 1. Buscar o professor atual
    const professor = await professoresAPI.buscarPorId(professorId);

    if (!professor) throw new Error("Professor não encontrado");

    // 2. Pegar as oficinas atuais, adicionar a nova se não estiver lá
    const oficinasAtuais = professor.oficinas || [];
    if (!oficinasAtuais.includes(oficinaId)) {
      oficinasAtuais.push(oficinaId);
    }

    // 3. Enviar atualização com o array atualizado
    const professorAtualizado = await professoresAPI.atualizar(professorId, {
      oficinas: oficinasAtuais,
    });

    return professorAtualizado;
  },

  async removerOficina(professorId, oficinaId) {
    // 1. Buscar o professor atual
    const professor = await professoresAPI.buscarPorId(professorId);

    if (!professor) throw new Error("Professor não encontrado");

    // 2. Pegar as oficinas atuais, remover a especificada
    const oficinasAtuais = professor.oficinas || [];
    const index = oficinasAtuais.indexOf(oficinaId);
    if (index > -1) {
      oficinasAtuais.splice(index, 1);
    }

    // 3. Enviar atualização com o array atualizado
    const professorAtualizado = await professoresAPI.atualizar(professorId, {
      oficinas: oficinasAtuais,
    });

    return professorAtualizado;
  },
};

const userSession = {
  save(userData) {
    localStorage.setItem("userData", JSON.stringify(userData));
  },

  get() {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  },

  clear() {
    localStorage.removeItem("userData");
  },

  isLoggedIn() {
    return !!this.get();
  },
};

function showMessage(message, type = "info") {
  const existingMessages = document.querySelectorAll(".alert");
  existingMessages.forEach((msg) => {
    if (msg.parentNode) {
      msg.parentNode.removeChild(msg);
    }
  });

  const messageDiv = document.createElement("div");
  messageDiv.className = `alert alert-${type}`;
  messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        border-radius: 5px;
        z-index: 1000;
        max-width: 300px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;

  switch (type) {
    case "success":
      messageDiv.style.backgroundColor = "#d4edda";
      messageDiv.style.color = "#155724";
      messageDiv.style.border = "1px solid #c3e6cb";
      break;
    case "error":
      messageDiv.style.backgroundColor = "#f8d7da";
      messageDiv.style.color = "#721c24";
      messageDiv.style.border = "1px solid #f5c6cb";
      break;
    case "warning":
      messageDiv.style.backgroundColor = "#fff3cd";
      messageDiv.style.color = "#856404";
      messageDiv.style.border = "1px solid #ffeaa7";
      break;
    default:
      messageDiv.style.backgroundColor = "#d1ecf1";
      messageDiv.style.color = "#0c5460";
      messageDiv.style.border = "1px solid #bee5eb";
  }

  messageDiv.textContent = message;

  document.body.appendChild(messageDiv);

  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.parentNode.removeChild(messageDiv);
    }
  }, 5000);
}

function requireLogin() {
  if (!userSession.isLoggedIn()) {
    window.location.href = "/login";
    return false;
  }
  return true;
}

// Função para verificar acesso a páginas específicas
function checkPageAccess(allowedTypes = []) {
  if (!requireLogin()) return false;

  const userData = userSession.get();
  if (!userData || !userData.tipo) {
    showMessage("Sessão inválida. Faça login novamente.", "error");
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
    return false;
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(userData.tipo)) {
    const redirectMap = {
      aluno: "/aluno",
      professor: "/professor",
    };

    showMessage(
      "Acesso negado. Você não tem permissão para acessar esta página.",
      "error"
    );
    setTimeout(() => {
      window.location.href = redirectMap[userData.tipo] || "/login";
    }, 2000);
    return false;
  }

  return true;
}

// Função para ocultar links do menu baseado no tipo de usuário
function hideMenuLinksForUser() {
  const userData = userSession.get();
  if (!userData) return;

  if (userData.tipo === "aluno") {
    // Ocultar apenas o link "Alunos" - manter "Professores" visível
    const alunosLink =
      document.getElementById("alunos-link") ||
      document.querySelector('a[href="/alunos"]');

    if (alunosLink && alunosLink.parentElement) {
      alunosLink.parentElement.style.display = "none";
    }
  }
}

// Função para verificar se usuário pode editar período
function canEditPeriod() {
  const userData = userSession.get();
  return userData && userData.tipo === "professor";
}
