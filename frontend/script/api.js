const API_BASE_URL = "/api";

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
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
