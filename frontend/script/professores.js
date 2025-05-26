// professores.js - Funcionalidades para a página de professores

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-professores');
    const professoresTable = document.getElementById('professores-table');
    
    // Função de pesquisa
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = professoresTable.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
});