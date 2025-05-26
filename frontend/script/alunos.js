// alunos.js - Funcionalidades para a página de alunos

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-alunos');
    const alunosTable = document.getElementById('alunos-table');
    const toggleModeBtn = document.getElementById('toggle-mode');
    const editPeriodColumns = document.querySelectorAll('.edit-period');
    const periodSelects = document.querySelectorAll('.period-select');
    const saveButton = document.createElement('button');
    
    // Configuração do botão de salvar
    saveButton.textContent = 'Salvar Períodos';
    saveButton.className = 'btn btn-success';
    saveButton.style.marginTop = '1rem';
    saveButton.style.display = 'none';
    document.querySelector('.card').appendChild(saveButton);

    // Função de pesquisa
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = alunosTable.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
    
    // Botão para alternar modo de edição de período
    toggleModeBtn.addEventListener('click', function() {
        editPeriodColumns.forEach(col => {
            col.classList.toggle('hidden');
        });
        
        // Atualiza o texto do botão e mostra/oculta o botão de salvar
        if (toggleModeBtn.textContent === 'Modo Edição Período') {
            toggleModeBtn.textContent = 'Sair do Modo Edição';
            toggleModeBtn.classList.remove('btn-primary');
            toggleModeBtn.classList.add('btn-success');
            saveButton.style.display = 'block';
        } else {
            toggleModeBtn.textContent = 'Modo Edição Período';
            toggleModeBtn.classList.remove('btn-success');
            toggleModeBtn.classList.add('btn-primary');
            saveButton.style.display = 'none';
        }
    });
    
    // Função para salvar os períodos alterados
    saveButton.addEventListener('click', function() {
        const alunosAtualizados = [];
        const rows = alunosTable.querySelectorAll('tbody tr');
        
        rows.forEach((row, index) => {
            const codigo = row.cells[0].textContent;
            const nome = row.cells[1].textContent;
            const periodoSelect = row.querySelector('.period-select');
            const novoPeriodo = periodoSelect.value;
            const periodoAnterior = row.cells[3].textContent;
            
            if (novoPeriodo !== periodoAnterior) {
                alunosAtualizados.push({
                    codigo,
                    nome,
                    periodoAnterior,
                    novoPeriodo
                });
                
                // Atualiza visualmente o período na tabela
                row.cells[3].textContent = novoPeriodo;
            }
        });
        
        if (alunosAtualizados.length > 0) {
            // Aqui você faria a chamada para o backend para salvar as alterações
            console.log('Alunos com períodos alterados:', alunosAtualizados);
            
            // Simulação de envio para o backend (substitua por chamada real)
            simularEnvioBackend(alunosAtualizados)
                .then(response => {
                    alert('Períodos atualizados com sucesso!');
                    // Opcional: recarregar os dados ou atualizar a interface
                })
                .catch(error => {
                    console.error('Erro ao salvar períodos:', error);
                    alert('Ocorreu um erro ao salvar os períodos. Por favor, tente novamente.');
                });
        } else {
            alert('Nenhum período foi alterado.');
        }
    });
    
    // Função para simular envio ao backend (substitua pela sua implementação real)
    function simularEnvioBackend(dados) {
        return new Promise((resolve) => {
            // Simula um delay de rede
            setTimeout(() => {
                console.log('Dados enviados para o backend:', dados);
                resolve({ status: 'success' });
            }, 1000);
        });
    }
});