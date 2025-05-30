document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("passwordResetForm");
  const emailInput = document.getElementById("email");
  const codeGroup = document.getElementById("codeGroup");
  const passwordGroup = document.getElementById("passwordGroup");
  const submitBtn = document.getElementById("submitBtn");
  const messageDiv = document.getElementById("message");
  const resendLink = document.getElementById("resendCode");
  const backToLogin = document.getElementById("backToLogin");

  let currentStep = 1;
  let userEmail = "";
  let verificationCode = "";

  function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  function showMessage(text, isSuccess) {
    messageDiv.textContent = text;
    messageDiv.className = isSuccess ? "message success" : "message error";
    messageDiv.classList.remove("hidden");
  }

  async function checkEmailExists(email) {
    try {
      await fetch("/api/auth/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  function sendVerificationCode(email) {
    return new Promise((resolve) => {
      setTimeout(() => {
        verificationCode = generateCode();
        console.log(`Código enviado para ${email}: ${verificationCode}`);
        resolve();
      }, 1000);
    });
  }

  async function updatePassword(email, newPassword) {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar senha");
      }

      return true;
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      return false;
    }
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (currentStep === 1) {
      userEmail = emailInput.value;

      if (!userEmail.includes("@")) {
        showMessage("Por favor, insira um e-mail válido", false);
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Verificando...";

      const emailExists = await checkEmailExists(userEmail);
      if (!emailExists) {
        showMessage("E-mail não encontrado no sistema", false);
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar Código";
        return;
      }

      submitBtn.textContent = "Enviando...";

      try {
        await sendVerificationCode(userEmail);
        showMessage(`Código enviado para ${userEmail}`, true);
        codeGroup.classList.remove("hidden");
        submitBtn.textContent = "Verificar Código";
        currentStep = 2;
        resendLink.classList.remove("hidden");
      } catch (error) {
        showMessage("Erro ao enviar código. Tente novamente.", false);
      } finally {
        submitBtn.disabled = false;
      }
    } else if (currentStep === 2) {
      const enteredCode = document.getElementById("code").value;

      if (enteredCode !== verificationCode) {
        showMessage("Código inválido. Tente novamente.", false);
        return;
      }

      showMessage("Código verificado com sucesso!", true);
      codeGroup.classList.add("hidden");
      passwordGroup.classList.remove("hidden");
      submitBtn.textContent = "Redefinir Senha";
      currentStep = 3;
    } else if (currentStep === 3) {
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (newPassword.length < 8) {
        showMessage("A senha deve ter pelo menos 8 caracteres", false);
        return;
      }

      if (newPassword !== confirmPassword) {
        showMessage("As senhas não coincidem", false);
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Atualizando...";

      const success = await updatePassword(userEmail, newPassword);

      if (success) {
        showMessage("Senha redefinida com sucesso! Redirecionando...", true);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        showMessage("Erro ao redefinir senha. Tente novamente.", false);
        submitBtn.disabled = false;
        submitBtn.textContent = "Redefinir Senha";
      }
    }
  });

  resendLink.addEventListener("click", function (e) {
    e.preventDefault();
    sendVerificationCode(userEmail).then(() => {
      showMessage("Novo código enviado!", true);
    });
  });

  backToLogin.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/login";
  });
});
