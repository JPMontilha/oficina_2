document.addEventListener('DOMContentLoaded', function() {
    // ==============================================
    // Validação do Formulário de Edição
    // ==============================================
    const editForm = document.getElementById("edit-form");
    const editModal = document.getElementById("edit-modal");
    const closeModal = document.querySelector(".close-modal");
    const editError = document.getElementById("edit-error-message");
    const editSuccess = document.getElementById("edit-success-message");
    const editButton = document.querySelector(".btn-primary.btn-small"); // Alterado para pegar apenas um botão

    // Verifica se os elementos existem
    if (editModal && editForm) {
        // Abrir modal ao clicar no botão de editar
        editButton.addEventListener("click", function(e) {
            e.preventDefault();
            // Preencher campo de email com valor atual
            const currentEmail = document.querySelectorAll(".info-value")[2].textContent;
            document.getElementById("edit-email").value = currentEmail;
            
            editModal.classList.remove("hidden");
        });

        // Fechar modal
        closeModal.addEventListener("click", function() {
            editModal.classList.add("hidden");
            hideEditMessages();
            editForm.reset();
        });

        // Fechar modal ao clicar fora
        editModal.addEventListener("click", function(event) {
            if (event.target === editModal) {
                editModal.classList.add("hidden");
                hideEditMessages();
                editForm.reset();
            }
        });

        // Validação do formulário de edição
        editForm.addEventListener("submit", function(event) {
            event.preventDefault();
            hideEditMessages();

            const email = document.getElementById("edit-email").value.trim();
            const senha = document.getElementById("edit-senha").value.trim();
            const confirmSenha = document.getElementById("edit-confirm-senha").value.trim();

            // Regex para validações
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

            // Verificar se pelo menos um campo foi preenchido
            if (!email && !senha && !confirmSenha) {
                showEditError("Por favor, preencha pelo menos um campo para alteração.");
                return;
            }

            // Verificações específicas para cada campo preenchido
            if (email && !emailRegex.test(email)) {
                showEditError("Por favor, insira um email válido.");
                return;
            }

            if (senha && !senhaRegex.test(senha)) {
                showEditError("A senha deve conter no mínimo 8 caracteres, com pelo menos uma letra maiúscula, uma minúscula e um número.");
                return;
            }

            if ((senha || confirmSenha) && senha !== confirmSenha) {
                showEditError("As senhas não coincidem.");
                return;
            }

            // Validação bem-sucedida
            showEditSuccess("Dados atualizados com sucesso!");
            
            // Simular envio para o servidor e atualizar a interface
            setTimeout(() => {
                // Atualizar dados na página
                if (email) {
                    document.querySelectorAll(".info-value")[2].textContent = email;
                }
                
                // Fechar modal e limpar formulário
                editModal.classList.add("hidden");
                hideEditMessages();
                editForm.reset();
            }, 1500);
        });

        // Funções auxiliares para o modal de edição
        function showEditError(message) {
            if (editError) {
                editError.textContent = message;
                editError.style.display = 'block';
                if (editSuccess) editSuccess.style.display = 'none';
            }
        }

        function showEditSuccess(message) {
            if (editSuccess) {
                editSuccess.textContent = message;
                editSuccess.style.display = 'block';
                if (editError) editError.style.display = 'none';
            }
        }

        function hideEditMessages() {
            if (editSuccess) editSuccess.style.display = 'none';
            if (editError) editError.style.display = 'none';
        }
    }
});