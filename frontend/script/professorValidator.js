document.addEventListener("DOMContentLoaded", function () {
  const editForm = document.getElementById("edit-form");
  const editModal = document.getElementById("edit-modal");
  const editButton = document.querySelector(".btn-primary.btn-small");
  const editError = document.getElementById("edit-error-message");
  const editSuccess = document.getElementById("edit-success-message");

  if (editButton) {
    editButton.addEventListener("click", function (e) {
      e.preventDefault();
      const currentEmail =
        document.querySelectorAll(".info-value")[2].textContent;
      document.getElementById("edit-email").value = currentEmail;

      editModal.classList.remove("hidden");
    });
  }

  if (editModal) {
    document
      .querySelector("#edit-modal .close-modal")
      .addEventListener("click", function () {
        editModal.classList.add("hidden");
        hideEditMessages();
      });
  }

  if (editForm) {
    editForm.addEventListener("submit", function (e) {
      e.preventDefault();
      hideEditMessages();

      const email = document.getElementById("edit-email").value.trim();
      const senha = document.getElementById("edit-senha").value.trim();
      const confirmSenha = document
        .getElementById("edit-confirm-senha")
        .value.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

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

      if (senha && senha !== confirmSenha) {
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
  }

  const manageModal = document.getElementById("manage-modal");
  const manageButtons = document.querySelectorAll(".actions .btn-primary");

  // Abrir modal de gerenciamento
  manageButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const row = this.closest("tr");
      const workshopName = row.cells[0].textContent;

      document.getElementById("workshop-name").textContent = workshopName;

      loadWorkshopStudents(workshopName);
      loadAvailableStudents(workshopName);

      switchTab("alunos-inscritos");

      manageModal.classList.remove("hidden");
    });
  });

  // Fechar modal de gerenciamento
  if (manageModal) {
    document
      .querySelector("#manage-modal .close-modal")
      .addEventListener("click", function () {
        manageModal.classList.add("hidden");
      });

    manageModal.addEventListener("click", function (e) {
      if (e.target === manageModal) {
        manageModal.classList.add("hidden");
      }
    });
  }

  const tabButtons = document.querySelectorAll(".tab-btn");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      switchTab(tabId);
    });
  });

  function switchTab(tabId) {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((content) => content.classList.remove("active"));

    document
      .querySelector(`.tab-btn[data-tab="${tabId}"]`)
      .classList.add("active");
    document.getElementById(tabId).classList.add("active");
  }

  function loadWorkshopStudents(workshopName) {
    const students = [
      { nome: "Ana Silva", codigo: "AL2025001", email: "ana.silva@escola.edu" },
      {
        nome: "Pedro Santos",
        codigo: "AL2025002",
        email: "pedro.santos@escola.edu",
      },
    ];

    const studentsList = document.getElementById("students-list");
    studentsList.innerHTML = "";

    students.forEach((student) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${student.nome}</td>
                <td>${student.codigo}</td>
                <td>${student.email}</td>
                <td class="actions">
                    <button class="btn btn-danger btn-small">Remover</button>
                </td>
            `;
      studentsList.appendChild(row);
    });

    document.querySelectorAll("#students-list .btn-danger").forEach((btn) => {
      btn.addEventListener("click", function () {
        const studentName = this.closest("tr").cells[0].textContent;
        if (
          confirm(`Tem certeza que deseja remover ${studentName} da oficina?`)
        ) {
          this.closest("tr").remove();
          showManageSuccess(`Aluno ${studentName} removido com sucesso!`);
        }
      });
    });
  }

  function loadAvailableStudents(workshopName) {
    const students = [
      {
        nome: "Marina Oliveira",
        codigo: "AL2025003",
        email: "marina.oliveira@escola.edu",
      },
      {
        nome: "Carlos Mendes",
        codigo: "AL2025004",
        email: "carlos.mendes@escola.edu",
      },
      {
        nome: "Juliana Costa",
        codigo: "AL2025005",
        email: "juliana.costa@escola.edu",
      },
    ];

    const availableStudents = document.getElementById("available-students");
    availableStudents.innerHTML = "";

    students.forEach((student) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${student.nome}</td>
                <td>${student.codigo}</td>
                <td>${student.email}</td>
                <td class="actions">
                    <button class="btn btn-success btn-small">Adicionar</button>
                </td>
            `;
      availableStudents.appendChild(row);
    });

    document
      .querySelectorAll("#available-students .btn-success")
      .forEach((btn) => {
        btn.addEventListener("click", function () {
          const row = this.closest("tr");
          const studentName = row.cells[0].textContent;
          const studentCode = row.cells[1].textContent;
          const studentEmail = row.cells[2].textContent;

          if (confirm(`Adicionar ${studentName} à oficina?`)) {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                        <td>${studentName}</td>
                        <td>${studentCode}</td>
                        <td>${studentEmail}</td>
                        <td class="actions">
                            <button class="btn btn-danger btn-small">Remover</button>
                        </td>
                    `;
            document.getElementById("students-list").appendChild(newRow);

            newRow
              .querySelector(".btn-danger")
              .addEventListener("click", function () {
                if (confirm(`Remover ${studentName} da oficina?`)) {
                  this.closest("tr").remove();
                }
              });

            showManageSuccess(`${studentName} foi adicionado à oficina!`);
          }
        });
      });

    document
      .getElementById("add-student-search")
      .addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll("#available-students tr");

        rows.forEach((row) => {
          const name = row.cells[0].textContent.toLowerCase();
          const code = row.cells[1].textContent.toLowerCase();
          if (name.includes(searchTerm) || code.includes(searchTerm)) {
            row.style.display = "";
          } else {
            row.style.display = "none";
          }
        });
      });
  }

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

  function showManageSuccess(message) {
    const successMsg = document.createElement("div");
    successMsg.className = "success-message";
    successMsg.textContent = message;
    successMsg.style.marginBottom = "1rem";

    const form = document.querySelector("#manage-modal .modal-content");
    if (form) {
      form.insertBefore(successMsg, form.firstChild);

      setTimeout(() => {
        successMsg.remove();
      }, 3000);
    }
  }
});
