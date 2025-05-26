document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("cadastro-form");
    const successMessage = document.getElementById("success-message");
    const errorMessage = document.getElementById("error-message");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); 

        // Limpar mensagens anteriores
        hideMessages();

        // Capturar valores dos campos
        const email = document.getElementById("user-email").value.trim();
        const senha = document.getElementById("user-senha").value.trim();
        const confirmSenha = document.getElementById("user-confirm-senha").value.trim();
        const codigo = document.getElementById("user-id").value.trim();
        const tipoUsuario = document.getElementById("user-tipo").value;

        // Regex para validações
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

        // Verificações de validação
        if (!email || !senha || !confirmSenha || !codigo || !tipoUsuario) {
            showError("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        if (!emailRegex.test(email)) {
            showError("Por favor, insira um email válido.");
            return;
        }

        if (!senhaRegex.test(senha)) {
            showError("A senha deve conter no mínimo 8 caracteres, com pelo menos uma letra maiúscula, uma minúscula e um número.");
            return;
        }

        if (senha !== confirmSenha) {
            showError("As senhas não coincidem.");
            return;
        }

        if (!codigo || isNaN(codigo) || codigo <= 0) {
            showError("Por favor, insira um código válido.");
            return;
        }

        // Validação bem-sucedida
        showSuccess("Usuário cadastrado com sucesso!");
        
        // Limpar formulário após 3 segundos
        setTimeout(() => {
            form.reset();
            hideMessages();
        }, 3000);
    });

    // Funções auxiliares para mostrar/esconder mensagens
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
    }

    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
    }

    function hideMessages() {
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
    }
});