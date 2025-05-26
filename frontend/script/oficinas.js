// oficinas.js - Funcionalidades para a página de oficinas

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-oficinas');
    const oficinasTable = document.getElementById('oficinas-table');
    
    // Função de pesquisa
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = oficinasTable.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
});