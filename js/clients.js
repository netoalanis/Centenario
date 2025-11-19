// Clients management

let currentPage = 1;
const itemsPerPage = 10;
let filteredClients = [];

document.addEventListener('DOMContentLoaded', function() {
    loadClients();
    document.getElementById('searchInput').addEventListener('input', filterClients);
    document.getElementById('clearSearch').addEventListener('click', clearSearch);
    document.getElementById('saveEdit').addEventListener('click', saveEdit);
});

function loadClients() {
    const clients = Storage.get('clients') || [];
    filteredClients = [...clients];
    currentPage = 1;
    renderTable();
}

function filterClients() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const allClients = Storage.get('clients') || [];
    
    filteredClients = allClients.filter(client => 
        client.name.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        client.phone.includes(searchTerm)
    );
    
    currentPage = 1;
    renderTable();
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    loadClients();
}

function renderTable() {
    const container = document.getElementById('clientsTable');
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);
    
    if (pageClients.length === 0) {
        container.innerHTML = '<div class="text-center text-muted py-4"><i class="bi bi-inbox" style="font-size: 3rem;"></i><p class="mt-2">No se encontraron clientes.</p></div>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    let html = `
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Empresa</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    pageClients.forEach(client => {
        html += `
            <tr>
                <td>${client.id}</td>
                <td>${client.name}</td>
                <td>${client.email}</td>
                <td>${client.phone}</td>
                <td>${client.company || '-'}</td>
                <td class="table-actions">
                    <button class="btn btn-sm btn-primary" onclick="viewClient(${client.id})"><i class="bi bi-eye"></i></button>
                    <button class="btn btn-sm btn-warning" onclick="editClient(${client.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteClient(${client.id})"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;"><i class="bi bi-chevron-left"></i></a>
        </li>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a></li>`;
    }
    
    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;"><i class="bi bi-chevron-right"></i></a>
        </li>
    `;
    
    pagination.innerHTML = html;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderTable();
    }
}

function addClient() {
    document.getElementById('modalTitle').textContent = 'Agregar Cliente';
    document.getElementById('editId').value = '';
    document.getElementById('editForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

function viewClient(id) {
    const clients = Storage.get('clients') || [];
    const client = clients.find(c => c.id === id);
    if (!client) return;
    
    alert(`Nombre: ${client.name}\nEmail: ${client.email}\nTeléfono: ${client.phone}\nEmpresa: ${client.company || 'N/A'}\nDirección: ${client.address || 'N/A'}`);
}

function editClient(id) {
    const clients = Storage.get('clients') || [];
    const client = clients.find(c => c.id === id);
    if (!client) return;
    
    document.getElementById('modalTitle').textContent = 'Editar Cliente';
    document.getElementById('editId').value = client.id;
    document.getElementById('editName').value = client.name;
    document.getElementById('editEmail').value = client.email;
    document.getElementById('editPhone').value = client.phone;
    document.getElementById('editCompany').value = client.company || '';
    document.getElementById('editAddress').value = client.address || '';
    
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

function saveEdit() {
    const clients = Storage.get('clients') || [];
    const id = document.getElementById('editId').value;
    const clientData = {
        name: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        company: document.getElementById('editCompany').value,
        address: document.getElementById('editAddress').value
    };
    
    if (id) {
        const index = clients.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            clients[index] = { ...clients[index], ...clientData };
        }
    } else {
        const newClient = {
            id: Date.now(),
            ...clientData,
            createdAt: new Date().toISOString()
        };
        clients.push(newClient);
    }
    
    Storage.set('clients', clients);
    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    modal.hide();
    showAlert(id ? 'Cliente actualizado' : 'Cliente agregado', 'success');
    loadClients();
}

function deleteClient(id) {
    if (!confirm('¿Eliminar este cliente?')) return;
    const clients = Storage.get('clients') || [];
    Storage.set('clients', clients.filter(c => c.id !== id));
    showAlert('Cliente eliminado', 'success');
    loadClients();
}
