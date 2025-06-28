document.addEventListener("DOMContentLoaded", function () {
  const editForm = document.getElementById("edit-form");
  const editModal = document.getElementById("edit-modal");
  const editButton = document.querySelector(".btn-primary.btn-small");
  const editError = document.getElementById("edit-error-message");
  const editSuccess = document.getElementById("edit-success-message");

  // Função para mostrar mensagens de erro
  function showEditError(message) {
    if (editError) {
      editError.textContent = message;
      editError.style.display = "block";
      if (editSuccess) editSuccess.style.display = "none";
    }
  }

  // Função para mostrar mensagens de sucesso
  function showEditSuccess(message) {
    if (editSuccess) {
      editSuccess.textContent = message;
      editSuccess.style.display = "block";
      if (editError) editError.style.display = "none";
    }
  }

  // Função para esconder mensagens
  function hideEditMessages() {
    if (editSuccess) editSuccess.style.display = "none";
    if (editError) editError.style.display = "none";
  }

  // Função para validar email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Função para validar senha
  function isValidPassword(password) {
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return senhaRegex.test(password);
  }

  // Função para alterar dados do aluno no backend
  async function alterarDadosAluno(novoEmail, novaSenha) {
    try {
      console.log("=== Iniciando alteração de dados do aluno ===");
      
      const userData = userSession.get();
      console.log("UserData da sessão:", userData);
      
      if (!userData || !userData.email) {
        throw new Error("Sessão inválida. Faça login novamente.");
      }

      // Buscar o aluno atual
      console.log("Buscando aluno por email:", userData.email);
      const aluno = await alunosAPI.buscarPorEmail(userData.email);
      console.log("Aluno encontrado:", aluno);
      
      if (!aluno) {
        throw new Error("Aluno não encontrado.");
      }

      // Preparar dados para atualização
      const dadosAtualizacao = {};
      console.log("Novo email:", novoEmail);
      console.log("Nova senha:", novaSenha ? "***fornecida***" : "não fornecida");
      
      // Se há novo email, atualiza o email do usuário
      if (novoEmail && novoEmail !== userData.email) {
        dadosAtualizacao.user = {
          ...aluno.user,
          email: novoEmail
        };
      }

      // Se há nova senha, adiciona aos dados de atualização
      if (novaSenha) {
        if (!dadosAtualizacao.user) {
          dadosAtualizacao.user = { ...aluno.user };
        }
        dadosAtualizacao.user.senha = novaSenha;
      }

      console.log("Dados para atualização:", {
        id: aluno._id,
        dados: dadosAtualizacao
      });

      // Fazer a requisição de atualização
      const alunoAtualizado = await alunosAPI.atualizar(aluno._id, dadosAtualizacao);
      console.log("Aluno atualizado com sucesso:", alunoAtualizado);

      // Atualizar sessão se o email foi alterado
      if (novoEmail && novoEmail !== userData.email) {
        const newUserData = {
          ...userData,
          email: novoEmail
        };
        userSession.save(newUserData);
        console.log("Sessão atualizada com novo email");
      }

      return alunoAtualizado;
    } catch (error) {
      console.error("=== Erro detalhado ao alterar dados do aluno ===");
      console.error("Tipo do erro:", typeof error);
      console.error("Mensagem:", error.message);
      console.error("Stack:", error.stack);
      console.error("Erro completo:", error);
      throw error;
    }
  }

  // Event listener para abrir o modal
  if (editButton) {
    editButton.addEventListener("click", function (e) {
      e.preventDefault();
      hideEditMessages();
      
      // Preencher o campo de email com o email atual
      const currentEmail = document.getElementById("user-email").textContent;
      document.getElementById("edit-email").value = currentEmail;
      
      // Limpar campos de senha
      document.getElementById("edit-senha").value = "";
      document.getElementById("edit-confirm-senha").value = "";

      editModal.classList.remove("hidden");
    });
  }

  // Event listener para fechar o modal (apenas pelo botão X)
  if (editModal) {
    document
      .querySelector("#edit-modal .close-modal")
      .addEventListener("click", function () {
        editModal.classList.add("hidden");
        hideEditMessages();
        editForm.reset();
      });

    // REMOVIDO: Event listener para fechar modal clicando fora dele
    // O modal agora só pode ser fechado pelo botão X
  }

  // Event listener para o formulário de edição
  if (editForm) {
    editForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      hideEditMessages();

      const email = document.getElementById("edit-email").value.trim();
      const senha = document.getElementById("edit-senha").value.trim();
      const confirmSenha = document.getElementById("edit-confirm-senha").value.trim();
      const currentEmail = document.getElementById("user-email").textContent;

      // Validações
      if (!email) {
        showEditError("O campo de email é obrigatório.");
        return;
      }

      if (!isValidEmail(email)) {
        showEditError("Por favor, insira um email válido.");
        return;
      }

      // Se a senha foi preenchida, validar
      if (senha) {
        if (!isValidPassword(senha)) {
          showEditError(
            "A senha deve conter no mínimo 8 caracteres, com pelo menos uma letra maiúscula, uma minúscula e um número."
          );
          return;
        }

        if (senha !== confirmSenha) {
          showEditError("As senhas não coincidem.");
          return;
        }
      }

      // Verificar se houve mudanças
      const emailMudou = email !== currentEmail;
      const senhaMudou = senha.length > 0;

      if (!emailMudou && !senhaMudou) {
        showEditError("Nenhuma alteração foi feita.");
        return;
      }

      // Desabilitar botão de envio durante o processo
      const submitButton = editForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = "Salvando...";

      try {
        // Verificar se o novo email já está em uso por outro usuário (apenas se o email foi alterado)
        if (emailMudou) {
          try {
            // Buscar se existe algum aluno com este email
            const alunoExistente = await alunosAPI.buscarPorEmail(email);
            
            // Se encontrou um aluno e não é o próprio usuário atual
            const alunoAtual = await alunosAPI.buscarPorEmail(currentEmail);
            if (alunoExistente && alunoExistente._id !== alunoAtual._id) {
              showEditError("Este email já está em uso por outro usuário.");
              return;
            }
          } catch (error) {
            console.error("Erro ao verificar email:", error);
            // Em caso de erro na verificação, não bloquear a operação
            // O backend também fará essa validação
          }
        }

        // Alterar dados no backend
        await alterarDadosAluno(
          emailMudou ? email : null,
          senhaMudou ? senha : null
        );

        // Atualizar interface
        if (emailMudou) {
          document.getElementById("user-email").textContent = email;
        }

        showEditSuccess("Dados alterados com sucesso!");

        // Fechar modal após 2 segundos
        setTimeout(() => {
          editModal.classList.add("hidden");
          hideEditMessages();
          editForm.reset();
        }, 2000);

      } catch (error) {
        console.error("=== Erro no formulário de edição ===");
        console.error("Erro capturado:", error);
        console.error("Mensagem do erro:", error.message);
        
        let errorMessage = "Erro ao alterar dados. Tente novamente.";
        
        if (error.message) {
          if (error.message.includes("não encontrado")) {
            errorMessage = "Aluno não encontrado.";
          } else if (error.message.includes("Sessão")) {
            errorMessage = "Sessão expirada. Faça login novamente.";
            setTimeout(() => {
              userSession.clear();
              window.location.href = "/login";
            }, 2000);
          } else if (error.message.includes("já está em uso")) {
            errorMessage = "Este email já está em uso por outro usuário.";
          } else if (error.message.includes("Acesso negado") || error.message.includes("403")) {
            errorMessage = "Você não tem permissão para alterar estes dados. Verifique com o administrador.";
          } else if (error.message.includes("fetch")) {
            errorMessage = "Erro de conexão. Verifique sua internet.";
          } else if (error.message.includes("400") || error.message.includes("Bad Request")) {
            errorMessage = "Dados inválidos. Verifique as informações.";
          } else if (error.message.includes("401") || error.message.includes("Unauthorized")) {
            errorMessage = "Sessão expirada. Faça login novamente.";
            setTimeout(() => {
              userSession.clear();
              window.location.href = "/login";
            }, 2000);
          } else if (error.message.includes("500") || error.message.includes("Internal Server Error")) {
            errorMessage = "Erro interno do servidor. Tente novamente mais tarde.";
          } else {
            // Mostrar mensagem do erro se não for sensível
            errorMessage = `Erro: ${error.message}`;
          }
        }
        
        console.error("Mensagem de erro final:", errorMessage);
        showEditError(errorMessage);
      } finally {
        // Reabilitar botão
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    });
  }

  // Função para validação em tempo real do email
  const emailInput = document.getElementById("edit-email");
  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      const email = this.value.trim();
      if (email && !isValidEmail(email)) {
        showEditError("Formato de email inválido.");
      } else {
        hideEditMessages();
      }
    });
  }

  // Função para validação em tempo real da senha
  const senhaInput = document.getElementById("edit-senha");
  if (senhaInput) {
    senhaInput.addEventListener("input", function () {
      const senha = this.value.trim();
      if (senha && !isValidPassword(senha)) {
        showEditError(
          "A senha deve conter no mínimo 8 caracteres, com pelo menos uma letra maiúscula, uma minúscula e um número."
        );
      } else {
        hideEditMessages();
      }
    });
  }

  // Função para validação da confirmação de senha
  const confirmSenhaInput = document.getElementById("edit-confirm-senha");
  if (confirmSenhaInput) {
    confirmSenhaInput.addEventListener("input", function () {
      const senha = document.getElementById("edit-senha").value.trim();
      const confirmSenha = this.value.trim();
      
      if (senha && confirmSenha && senha !== confirmSenha) {
        showEditError("As senhas não coincidem.");
      } else {
        hideEditMessages();
      }
    });
  }
});