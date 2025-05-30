document.addEventListener("DOMContentLoaded", function () {
  const editForm = document.getElementById("edit-form");
  const editModal = document.getElementById("edit-modal");
  const closeModal = document.querySelector(".close-modal");
  const editError = document.getElementById("edit-error-message");
  const editSuccess = document.getElementById("edit-success-message");
  const editButton = document.querySelector(".btn-primary.btn-small");

  if (editModal && editForm) {
    editButton.addEventListener("click", function (e) {
      e.preventDefault();
      const currentEmail =
        document.querySelectorAll(".info-value")[2].textContent;
      document.getElementById("edit-email").value = currentEmail;

      editModal.classList.remove("hidden");
    });

    closeModal.addEventListener("click", function () {
      editModal.classList.add("hidden");
      hideEditMessages();
      editForm.reset();
    });

    editModal.addEventListener("click", function (event) {
      if (event.target === editModal) {
        editModal.classList.add("hidden");
        hideEditMessages();
        editForm.reset();
      }
    });

    editForm.addEventListener("submit", function (event) {
      event.preventDefault();
      hideEditMessages();

      const email = document.getElementById("edit-email").value.trim();
      const senha = document.getElementById("edit-senha").value.trim();
      const confirmSenha = document
        .getElementById("edit-confirm-senha")
        .value.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

      if (!email && !senha && !confirmSenha) {
        showEditError(
          "Por favor, preencha pelo menos um campo para alteração."
        );
        return;
      }

      if (email && !emailRegex.test(email)) {
        showEditError("Por favor, insira um email válido.");
        return;
      }

      if (senha && !senhaRegex.test(senha)) {
        showEditError(
          "A senha deve conter no mínimo 8 caracteres, com pelo menos uma letra maiúscula, uma minúscula e um número."
        );
        return;
      }

      if ((senha || confirmSenha) && senha !== confirmSenha) {
        showEditError("As senhas não coincidem.");
        return;
      }

      showEditSuccess("Dados atualizados com sucesso!");

      setTimeout(() => {
        if (email) {
          document.querySelectorAll(".info-value")[2].textContent = email;
        }

        editModal.classList.add("hidden");
        hideEditMessages();
        editForm.reset();
      }, 1500);
    });

    function showEditError(message) {
      if (editError) {
        editError.textContent = message;
        editError.style.display = "block";
        if (editSuccess) editSuccess.style.display = "none";
      }
    }

    function showEditSuccess(message) {
      if (editSuccess) {
        editSuccess.textContent = message;
        editSuccess.style.display = "block";
        if (editError) editError.style.display = "none";
      }
    }

    function hideEditMessages() {
      if (editSuccess) editSuccess.style.display = "none";
      if (editError) editError.style.display = "none";
    }
  }
});
