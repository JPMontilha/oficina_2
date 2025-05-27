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
        const parts = dateString.split('/');
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }

    function formatDateToDisplay(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function showEditError(message) {
        const errorElement = document.getElementById('edit-error-message');
        errorElement.innerHTML = message;
        errorElement.style.display = 'block';
        document.getElementById('edit-success-message').style.display = 'none';
        
        // Rolagem suave para a mensagem de erro
        setTimeout(() => {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }

    function showEditSuccess(message) {
        const successElement = document.getElementById('edit-success-message');
        successElement.innerHTML = message;
        successElement.style.display = 'block';
        document.getElementById('edit-error-message').style.display = 'none';
        
        // Rolagem suave para a mensagem de sucesso
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
        if (e.target.classList.contains('btn-primary') && e.target.textContent.trim() === 'Editar') {
            e.preventDefault();
            const row = e.target.closest('tr');
            const oficinaData = {
                nome: row.cells[0].textContent,
                tipo: row.cells[1].textContent.toLowerCase(),
                data: formatDateToInput(row.cells[2].textContent),
                local: row.cells[3].textContent,
                responsavel: row.cells[4].textContent,
                participantes: row.cells[5].textContent
            };

            // Preencher o formulário
            document.getElementById('edit-oficina-nome').value = oficinaData.nome;
            document.getElementById('edit-oficina-tipo').value = oficinaData.tipo;
            document.getElementById('edit-oficina-data').value = oficinaData.data;
            document.getElementById('edit-oficina-local').value = oficinaData.local;
            
            // Armazenar o índice da linha para atualização
            editModal.dataset.rowIndex = Array.from(row.parentNode.children).indexOf(row);
            
            // Mostrar o modal e esconder mensagens
            editModal.classList.remove('hidden');
            hideEditMessages();
            
            // Foco no primeiro campo
            document.getElementById('edit-oficina-nome').focus();
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
        
        // Atualizar a tabela
        const rowIndex = editModal.dataset.rowIndex;
        const rows = document.querySelectorAll('.table tbody tr');
        const row = rows[rowIndex];
        
        row.cells[0].textContent = nome;
        row.cells[1].textContent = capitalizeFirstLetter(tipo);
        row.cells[2].textContent = formatDateToDisplay(data);
        row.cells[3].textContent = local;
        
        showEditSuccess('Oficina atualizada com sucesso!');
        
        // Fechar o modal após 2 segundos
        setTimeout(() => {
            editModal.classList.add('hidden');
        }, 2000);
    });

    // Exclusão de oficinas
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-danger') && e.target.textContent.trim() === 'Excluir') {
            e.preventDefault();
            if (confirm('Tem certeza que deseja excluir esta oficina?')) {
                const row = e.target.closest('tr');
                row.remove();
                
                // Atualizar contador
                const totalOficinas = document.querySelector('.card-count');
                totalOficinas.textContent = parseInt(totalOficinas.textContent) - 1;
                
                // Mostrar mensagem de sucesso
                const tempSuccess = document.createElement('div');
                tempSuccess.className = 'success-message';
                tempSuccess.textContent = 'Oficina removida com sucesso!';
                tempSuccess.style.margin = '1rem 0';
                tempSuccess.style.textAlign = 'center';
                
                const tableContainer = document.querySelector('.table-container');
                tableContainer.parentNode.insertBefore(tempSuccess, tableContainer);
                
                setTimeout(() => {
                    tempSuccess.remove();
                }, 3000);
            }
        }
    });

    // Validação do formulário de cadastro
    document.querySelector('.card form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('oficina-nome').value.trim();
        const tipo = document.getElementById('oficina-tipo').value;
        const data = document.getElementById('oficina-data').value;
        const local = document.getElementById('oficina-local').value.trim();
        const descricao = document.getElementById('oficina-descricao').value.trim();
        
        if (!nome || !tipo || !data || !local) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Adicionar nova oficina à tabela
        const tbody = document.querySelector('.table tbody');
        const newRow = document.createElement('tr');
        
        newRow.innerHTML = `
            <td>${nome}</td>
            <td>${capitalizeFirstLetter(tipo)}</td>
            <td>${formatDateToDisplay(data)}</td>
            <td>${local}</td>
            <td>Carlos Oliveira</td>
            <td>0</td>
            <td class="actions">
                <a href="#" class="btn btn-primary">Editar</a>
                <a href="#" class="btn btn-danger">Excluir</a>
            </td>
        `;
        
        tbody.appendChild(newRow);
        
        // Atualizar contadores
        document.querySelector('.card-count').textContent = 
            parseInt(document.querySelector('.card-count').textContent) + 1;
        
        // Resetar formulário
        this.reset();
        
        // Mostrar mensagem de sucesso
        const tempSuccess = document.createElement('div');
        tempSuccess.className = 'success-message';
        tempSuccess.textContent = 'Oficina cadastrada com sucesso!';
        tempSuccess.style.margin = '1rem 0';
        tempSuccess.style.textAlign = 'center';
        
        const tableContainer = document.querySelector('.table-container');
        tableContainer.parentNode.insertBefore(tempSuccess, tableContainer);
        
        setTimeout(() => {
            tempSuccess.remove();
        }, 3000);
    });
});