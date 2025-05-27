document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('passwordResetForm');
    const emailInput = document.getElementById('email');
    const codeGroup = document.getElementById('codeGroup');
    const passwordGroup = document.getElementById('passwordGroup');
    const submitBtn = document.getElementById('submitBtn');
    const messageDiv = document.getElementById('message');
    const resendLink = document.getElementById('resendCode');
    const backToLogin = document.getElementById('backToLogin');
    
    let currentStep = 1;
    let userEmail = '';
    let verificationCode = '';

    // Gerar um código aleatório de 6 dígitos
    function generateCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Mostrar mensagem
    function showMessage(text, isSuccess) {
        messageDiv.textContent = text;
        messageDiv.className = isSuccess ? 'message success' : 'message error';
        messageDiv.classList.remove('hidden');
    }

    // Enviar código por e-mail (simulado)
    function sendVerificationCode(email) {
        return new Promise((resolve) => {
            // Simular envio de e-mail
            setTimeout(() => {
                verificationCode = generateCode();
                console.log(`Código enviado para ${email}: ${verificationCode}`); // Apenas para teste
                resolve();
            }, 1000);
        });
    }

    // Manipular envio do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (currentStep === 1) {
            // Passo 1: Solicitar código
            userEmail = emailInput.value;
            
            if (!userEmail.includes('@')) {
                showMessage('Por favor, insira um e-mail válido', false);
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            sendVerificationCode(userEmail)
                .then(() => {
                    showMessage(`Código enviado para ${userEmail}`, true);
                    codeGroup.classList.remove('hidden');
                    submitBtn.textContent = 'Verificar Código';
                    currentStep = 2;
                    resendLink.classList.remove('hidden');
                })
                .catch(() => {
                    showMessage('Erro ao enviar código. Tente novamente.', false);
                })
                .finally(() => {
                    submitBtn.disabled = false;
                });
                
        } else if (currentStep === 2) {
            // Passo 2: Verificar código
            const enteredCode = document.getElementById('code').value;
            
            if (enteredCode !== verificationCode) {
                showMessage('Código inválido. Tente novamente.', false);
                return;
            }
            
            showMessage('Código verificado com sucesso!', true);
            codeGroup.classList.add('hidden');
            passwordGroup.classList.remove('hidden');
            submitBtn.textContent = 'Redefinir Senha';
            currentStep = 3;
            
        } else if (currentStep === 3) {
            // Passo 3: Redefinir senha
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (newPassword.length < 8) {
                showMessage('A senha deve ter pelo menos 8 caracteres', false);
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showMessage('As senhas não coincidem', false);
                return;
            }
            
            // Aqui você faria a chamada para o backend para atualizar a senha
            console.log(`Senha atualizada para ${userEmail}`);
            showMessage('Senha redefinida com sucesso! Redirecionando...', true);
            
            // Simular redirecionamento após 2 segundos
            setTimeout(() => {
                window.location.href = '../html/login.html'; // Altere para sua página de login
            }, 2000);
        }
    });
    
    // Reenviar código
    resendLink.addEventListener('click', function(e) {
        e.preventDefault();
        sendVerificationCode(userEmail)
            .then(() => {
                showMessage('Novo código enviado!', true);
            });
    });
    
    // Voltar para login
    backToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '../html/login.html'; // Altere para sua página de login
    });
});