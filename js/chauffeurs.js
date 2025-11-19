// Chauffeurs management
let filteredChauffeurs = [];

document.addEventListener('DOMContentLoaded', function() {
    loadChauffeurs();
    document.getElementById('searchInput').addEventListener('input', filterChauffeurs);
    document.getElementById('statusFilter').addEventListener('change', filterChauffeurs);
    document.getElementById('saveEdit').addEventListener('click', saveEdit);
});

function loadChauffeurs() {
    const chauffeurs = Storage.get('chauffeurs') || [];
    filteredChauffeurs = [...chauffeurs];
    renderTable();
}

function filterChauffeurs() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const allChauffeurs = Storage.get('chauffeurs') || [];
    
    filteredChauffeurs = allChauffeurs.filter(chauffeur => {
        const matchesSearch = !searchTerm || 
            chauffeur.name.toLowerCase().includes(searchTerm) ||
            chauffeur.phone.includes(searchTerm);
        const matchesStatus = !statusFilter || chauffeur.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    renderTable();
}

function renderTable() {
    const container = document.getElementById('chauffeursTable');
    
    if (filteredChauffeurs.length === 0) {
        container.innerHTML = '<div class="text-center text-muted py-4"><i class="bi bi-inbox" style="font-size: 3rem;"></i><p class="mt-2">No se encontraron choferes.</p></div>';
        return;
    }

    let html = `
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Licencia</th>
                    <th>Experiencia</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    filteredChauffeurs.forEach(chauffeur => {
        const statusBadge = chauffeur.status === 'Disponible' ? 'success' : (chauffeur.status === 'En Servicio' ? 'info' : 'secondary');
        html += `
            <tr>
                <td>${chauffeur.id}</td>
                <td>${chauffeur.name}</td>
                <td>${chauffeur.phone}</td>
                <td>${chauffeur.license}</td>
                <td>${chauffeur.experience}</td>
                <td><span class="badge bg-${statusBadge}">${chauffeur.status}</span></td>
                <td class="table-actions">
                    <button class="btn btn-sm btn-warning" onclick="editChauffeur(${chauffeur.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteChauffeur(${chauffeur.id})"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

function addChauffeur() {
    document.getElementById('modalTitle').textContent = 'Agregar Chofer';
    document.getElementById('editId').value = '';
    document.getElementById('editForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

function editChauffeur(id) {
    const chauffeurs = Storage.get('chauffeurs') || [];
    const chauffeur = chauffeurs.find(c => c.id === id);
    if (!chauffeur) return;
    
    document.getElementById('modalTitle').textContent = 'Editar Chofer';
    document.getElementById('editId').value = chauffeur.id;
    document.getElementById('editName').value = chauffeur.name;
    document.getElementById('editPhone').value = chauffeur.phone;
    document.getElementById('editLicense').value = chauffeur.license;
    document.getElementById('editExperience').value = chauffeur.experience;
    document.getElementById('editStatus').value = chauffeur.status;
    
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

function saveEdit() {
    const chauffeurs = Storage.get('chauffeurs') || [];
    const id = document.getElementById('editId').value;
    const chauffeurData = {
        name: document.getElementById('editName').value,
        phone: document.getElementById('editPhone').value,
        license: document.getElementById('editLicense').value,
        experience: document.getElementById('editExperience').value,
        status: document.getElementById('editStatus').value
    };
    
    if (id) {
        const index = chauffeurs.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            chauffeurs[index] = { ...chauffeurs[index], ...chauffeurData };
        }
    } else {
        chauffeurs.push({ id: Date.now(), ...chauffeurData });
    }
    
    Storage.set('chauffeurs', chauffeurs);
    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    modal.hide();
    showAlert(id ? 'Chofer actualizado' : 'Chofer agregado', 'success');
    loadChauffeurs();
}

function deleteChauffeur(id) {
    if (!confirm('¿Eliminar este chofer?')) return;
    const chauffeurs = Storage.get('chauffeurs') || [];
    Storage.set('chauffeurs', chauffeurs.filter(c => c.id !== id));
    showAlert('Chofer eliminado', 'success');
    loadChauffeurs();
}
