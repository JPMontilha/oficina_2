document.addEventListener('DOMContentLoaded', function() {
    // ==============================================
    // Modal de Edição de Oficina
    // ==============================================
    const editModal = document.createElement('div');
    editModal.id = 'edit-oficina-modal';
    editModal.className = 'modal hidden';
    editModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 style="text-align: center;">Editar Oficina</h2>
            <form id="edit-oficina-form">
                <div class="form-group">
                    <label class="form-label" for="edit-oficina-nome">Nome da Oficina</label>
                    <input type="text" class="form-control" id="edit-oficina-nome" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="edit-oficina-tipo">Tipo de Oficina</label>
                    <select class="form-control" id="edit-oficina-tipo" required>
                        <option value="">Selecione um tipo</option>
                        <option value="palestra">Palestra</option>
                        <option value="workshop">Workshop</option>
                        <option value="seminario">Seminário</option>
                        <option value="curso">Curso</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label" for="edit-oficina-data">Data</label>
                    <input type="date" class="form-control" id="edit-oficina-data" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="edit-oficina-local">Local</label>
                    <input type="text" class="form-control" id="edit-oficina-local" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="edit-oficina-descricao">Descrição</label>
                    <textarea class="form-control" id="edit-oficina-descricao" rows="4"></textarea>
                </div>
                
                <div class="message-container">
                    <div id="edit-error-message" class="error-message" style="display: none;"></div>
                    <div id="edit-success-message" class="success-message" style="display: none;"></div>
                </div>
                
                <div class="actions">
                    <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                    <button type="button" class="btn btn-secondary close-modal-btn">Cancelar</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(editModal);

    // ==============================================
    // Funções Auxiliares
    // ==============================================
    function formatDateToInput(dateString) {
        if (!dateString) return '';
        const parts = dateString.split('/');
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }

    function formatDateToDisplay(dateString) {
        if (!dateString) return 'Não especificada';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch {
            return dateString;
        }
    }

    function capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function showEditError(message) {
        const errorElement = document.getElementById('edit-error-message');
        errorElement.innerHTML = message;
        errorElement.style.display = 'block';
        document.getElementById('edit-success-message').style.display = 'none';
        
        setTimeout(() => {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }

    function showEditSuccess(message) {
        const successElement = document.getElementById('edit-success-message');
        successElement.innerHTML = message;
        successElement.style.display = 'block';
        document.getElementById('edit-error-message').style.display = 'none';
        
        setTimeout(() => {
            successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }

    function hideEditMessages() {
        document.getElementById('edit-error-message').style.display = 'none';
        document.getElementById('edit-success-message').style.display = 'none';
    }

    // ==============================================
    // Event Listeners
    // ==============================================

    // Abrir modal de edição
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-editar')) {
            e.preventDefault();
            const row = e.target.closest('tr');
            const oficinaId = row.dataset.id;
            
            // Carregar dados completos da oficina
            oficinasAPI.buscarPorId(oficinaId).then(oficina => {
                // Preencher formulário
                document.getElementById('edit-oficina-nome').value = oficina.nome || '';
                document.getElementById('edit-oficina-tipo').value = oficina.tipo || '';
                // Corrigir o formato da data para o input type="date"
                const dataParts = oficina.data ? oficina.data.split('T')[0] : '';
                document.getElementById('edit-oficina-data').value = dataParts;
                document.getElementById('edit-oficina-local').value = oficina.local || '';
                document.getElementById('edit-oficina-descricao').value = oficina.descricao || '';
                
                // Armazenar IDs para referência (CORRIGIDO)
                editModal.dataset.oficinaId = oficinaId;
                editModal.dataset.rowId = oficinaId; // Usando o ID para encontrar a linha depois
                
                // Mostrar modal
                editModal.classList.remove('hidden');
                hideEditMessages();
            }).catch(error => {
                console.error('Erro ao carregar oficina:', error);
                showMessage('Erro ao carregar dados da oficina', 'error');
            });
        }
    });

    // Fechar modal
    editModal.querySelector('.close-modal').addEventListener('click', function() {
        editModal.classList.add('hidden');
    });

    // Botão Cancelar
    editModal.querySelector('.close-modal-btn').addEventListener('click', function() {
        editModal.classList.add('hidden');
    });

    // Fechar modal ao clicar fora
    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) {
            editModal.classList.add('hidden');
        }
    });

    // Validação do formulário de edição
    document.getElementById('edit-oficina-form').addEventListener('submit', function(e) {
        e.preventDefault();
        hideEditMessages();
        
        // Validar campos
        const nome = document.getElementById('edit-oficina-nome').value.trim();
        const tipo = document.getElementById('edit-oficina-tipo').value;
        const data = document.getElementById('edit-oficina-data').value;
        const local = document.getElementById('edit-oficina-local').value.trim();
        
        if (!nome || !tipo || !data || !local) {
            showEditError('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Obter ID da oficina do modal
        const oficinaId = editModal.dataset.oficinaId;
        if (!oficinaId) {
            showEditError('Erro: Oficina não identificada.');
            return;
        }
        
        const oficinaAtualizada = {
            nome,
            tipo,
            data,
            local,
            descricao: document.getElementById('edit-oficina-descricao').value.trim()
        };
        
        oficinasAPI.atualizar(oficinaId, oficinaAtualizada)
            .then(() => {
                // Encontrar a linha na tabela usando o ID armazenado
                const row = document.querySelector(`tr[data-id="${oficinaId}"]`);
                if (row) {
                    row.cells[0].textContent = nome;
                    row.cells[1].textContent = capitalizeFirstLetter(tipo);
                    row.cells[2].textContent = formatDateToDisplay(data);
                    row.cells[3].textContent = local;
                }
                
                showEditSuccess('Oficina atualizada com sucesso!');
                
                // Fechar o modal após 2 segundos
                setTimeout(() => {
                    editModal.classList.add('hidden');
                }, 2000);
            })
            .catch(error => {
                console.error('Erro ao atualizar oficina:', error);
                showEditError('Erro ao atualizar oficina. Tente novamente.');
            });
    });

    // Exclusão de oficinas
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-excluir')) {
            e.preventDefault();
            if (confirm('Tem certeza que deseja excluir esta oficina?')) {
                const row = e.target.closest('tr');
                const oficinaId = row.dataset.id;
                const professorId = userSession.get()._id; // Obter ID do professor logado
                
                // Chamar API para remover oficina
                Promise.all([
                    oficinasAPI.deletar(oficinaId),
                    professoresAPI.removerOficina(professorId, oficinaId)
                ])
                    .then(() => {
                        row.remove();
                        
                        // Atualizar contador
                        const totalOficinas = document.querySelector('.card-count');
                        totalOficinas.textContent = parseInt(totalOficinas.textContent) - 1;
                        
                        // Mostrar mensagem de sucesso
                        showMessage('Oficina removida com sucesso!', 'success');
                    })
                    .catch(error => {
                        console.error('Erro ao remover oficina:', error);
                        showMessage('Erro ao remover oficina', 'error');
                    });
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", async function() {
    // Verificar login e tipo de usuário
    if (!requireLogin()) return;
    
    const userData = userSession.get();
    
    if (userData.tipo !== "professor") {
        showMessage("Acesso negado. Esta página é apenas para professores.", "error");
        setTimeout(() => {
            window.location.href = "/login";
        }, 2000);
        return;
    }

    // Configurar logout
    const logoutButton = document.getElementById("logout-btn");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }

    try {
        // Carregar dados do professor e oficinas
        const professor = await professoresAPI.buscarPorId(userData._id);
        console.log("Dados do professor:", professor);
        const todasOficinas = await oficinasAPI.listar();
        
        // Filtrar apenas as oficinas deste professor
        const minhasOficinas = professor.oficinas || [];

        // Atualizar dashboard
        updateDashboard(todasOficinas, minhasOficinas);
        
        // Atualizar tabela de oficinas
        updateOficinasTable(minhasOficinas);
        
        // Configurar formulário de cadastro
        setupCadastroForm(professor);
        
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        showMessage("Erro ao carregar dados do sistema", "error");
    }
});

// Atualiza os cards do dashboard
function updateDashboard(todasOficinas, minhasOficinas) {
    // Total de oficinas no sistema
    const totalOficinasElement = document.querySelector(".card:nth-child(1) .card-count");
    if (totalOficinasElement) {
        totalOficinasElement.textContent = todasOficinas.length;
    }

    // Total de alunos participantes (em todas as oficinas)
    const totalAlunos = todasOficinas.reduce((total, oficina) => 
        total + (oficina.alunos ? oficina.alunos.length : 0), 0);
    
    const alunosElement = document.querySelector(".card:nth-child(2) .card-count");
    if (alunosElement) {
        alunosElement.textContent = totalAlunos;
    }

    // Total de professores envolvidos
    const professoresElement = document.querySelector(".card:nth-child(3) .card-count");

    professoresAPI.listar().then(professores => {
        // Filtra professores que possuem oficinas não vazias
        const professoresComOficinas = professores.filter(professor => {
            return professor.oficinas && Array.isArray(professor.oficinas) && professor.oficinas.length > 0;
        });

        const quantidade = professoresComOficinas.length;
        console.log("Quantidade de professores com oficinas:", quantidade);

        if (professoresElement) {
            professoresElement.textContent = quantidade;
        }
    });
}

// Atualiza a tabela de oficinas
function updateOficinasTable(oficinas) {
    const tableBody = document.querySelector(".table tbody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (oficinas.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center;">
                    Você não possui oficinas cadastradas
                </td>
            </tr>
        `;
        return;
    }

    // Preencher tabela com as oficinas do professor
    tableBody.innerHTML = oficinas.map(oficina => `
        <tr data-id="${oficina._id}">
            <td>${oficina.nome || "Sem nome"}</td>
            <td>${oficina.tipo || "Não especificado"}</td>
            <td>${formatarData(oficina.data)}</td>
            <td>${oficina.local || "Não especificado"}</td>
            <td>${oficina.responsavel?.nome || "Você"}</td>
            <td>${oficina.alunos?.length || 0}</td>
            <td class="actions">
                <button class="btn btn-primary btn-editar">Editar</button>
                <button class="btn btn-danger btn-excluir">Excluir</button>
            </td>
        </tr>
    `).join("");
}

// Configura o formulário de cadastro
function setupCadastroForm(professor) {
    const form = document.querySelector(".card form");
    if (!form) return;

    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const btnSubmit = form.querySelector("button[type='submit']");
        const btnOriginalText = btnSubmit.textContent;
        btnSubmit.textContent = "Salvando...";
        btnSubmit.disabled = true;

        try {
            const novaOficina = {
                nome: document.getElementById("oficina-nome").value.trim(),
                tipo: document.getElementById("oficina-tipo").value,
                data: document.getElementById("oficina-data").value,
                local: document.getElementById("oficina-local").value.trim(),
                descricao: document.getElementById("oficina-descricao").value.trim(),
                responsavel: professor._id,
                alunos: []
            };

            // Validar campos obrigatórios
            if (!novaOficina.nome || !novaOficina.tipo || !novaOficina.data || !novaOficina.local) {
                throw new Error("Preencha todos os campos obrigatórios");
            }

            // Chamar API para criar oficina
            const oficinaCriada = await oficinasAPI.criar(novaOficina);
            
            // Associar oficina ao professor
            await professoresAPI.adicionarOficina(professor._id, oficinaCriada._id);
            
            // Atualizar a tabela
            const tableBody = document.querySelector(".table tbody");
            const row = document.createElement("tr");
            row.dataset.id = oficinaCriada._id;
            row.innerHTML = `
                <td>${oficinaCriada.nome}</td>
                <td>${oficinaCriada.tipo}</td>
                <td>${formatarData(oficinaCriada.data)}</td>
                <td>${oficinaCriada.local}</td>
                <td>Você</td>
                <td>0</td>
                <td class="actions">
                    <button class="btn btn-primary btn-editar">Editar</button>
                    <button class="btn btn-danger btn-excluir">Excluir</button>
                </td>
            `;
            tableBody.appendChild(row);

            // Atualizar contadores
            const todasOficinas = await oficinasAPI.listar();
            updateDashboard(todasOficinas, [...document.querySelectorAll(".table tbody tr")]);
            
            // Resetar formulário
            form.reset();
            
            showMessage("Oficina cadastrada com sucesso!", "success");
            
        } catch (error) {
            console.error("Erro ao cadastrar oficina:", error);
            showMessage(error.message || "Erro ao cadastrar oficina", "error");
        } finally {
            btnSubmit.textContent = btnOriginalText;
            btnSubmit.disabled = false;
        }
    });
}

// Funções auxiliares
function formatarData(dataString) {
    if (!dataString) return "Não especificada";
    
    try {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    } catch {
        return dataString;
    }
}

function formatDateToDisplay(dateString) {
    if (!dateString) return 'Não especificada';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    } catch {
        return dateString;
    }
}

function showMessage(message, type) {
    const container = document.createElement("div");
    container.className = `${type}-message`;
    container.textContent = message;
    container.style.margin = "1rem 0";
    container.style.textAlign = "center";
    
    const main = document.querySelector("main.container");
    if (main) {
        main.insertBefore(container, main.firstChild);
        setTimeout(() => container.remove(), 5000);
    }
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
