// Service requests management

let currentPage = 1;
const itemsPerPage = 10;
let filteredRequests = [];

document.addEventListener('DOMContentLoaded', function() {
    loadRequests();
    
    // Search and filter event listeners
    document.getElementById('searchInput').addEventListener('input', filterRequests);
    document.getElementById('statusFilter').addEventListener('change', filterRequests);
    document.getElementById('typeFilter').addEventListener('change', filterRequests);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    
    // Edit form save button
    document.getElementById('saveEdit').addEventListener('click', saveEdit);
    
    // Load cars and chauffeurs for dropdowns
    loadCarOptions();
    loadChauffeurOptions();
});

function loadRequests() {
    const requests = Storage.get('serviceRequests') || [];
    filteredRequests = [...requests];
    currentPage = 1;
    renderTable();
}

function filterRequests() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    
    const allRequests = Storage.get('serviceRequests') || [];
    
    filteredRequests = allRequests.filter(request => {
        const matchesSearch = !searchTerm || 
            (request.clientName && request.clientName.toLowerCase().includes(searchTerm)) ||
            request.clientEmail.toLowerCase().includes(searchTerm) ||
            request.originLocation.toLowerCase().includes(searchTerm) ||
            request.destinationLocation.toLowerCase().includes(searchTerm);
        
        const matchesStatus = !statusFilter || request.status === statusFilter;
        const matchesType = !typeFilter || request.serviceType === typeFilter;
        
        return matchesSearch && matchesStatus && matchesType;
    });
    
    currentPage = 1;
    renderTable();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('typeFilter').value = '';
    loadRequests();
}

function renderTable() {
    const container = document.getElementById('requestsTable');
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageRequests = filteredRequests.slice(startIndex, endIndex);
    
    if (pageRequests.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                <p class="mt-2">No se encontraron solicitudes.</p>
            </div>
        `;
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    let html = `
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Tipo</th>
                    <th>Origen</th>
                    <th>Destino</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    pageRequests.forEach(request => {
        html += `
            <tr>
                <td>${request.id}</td>
                <td>${request.clientName || request.clientEmail}</td>
                <td>${formatRequestDate(request.serviceDate)}</td>
                <td>${request.serviceTime}</td>
                <td>${getServiceTypeName(request.serviceType)}</td>
                <td>${request.originLocation}</td>
                <td>${request.destinationLocation}</td>
                <td>
                    <span class="badge bg-${getStatusBadgeClass(request.status)}">
                        ${request.status}
                    </span>
                </td>
                <td class="table-actions">
                    <button class="btn btn-sm btn-info" onclick="viewEventLogs(${request.id})" title="Ver eventos">
                        <i class="bi bi-clock-history"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="viewRequest(${request.id})" title="Ver detalles">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="editRequest(${request.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteRequest(${request.id})" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '';
    
    // Previous button
    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">
                <i class="bi bi-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    // Next button
    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">
                <i class="bi bi-chevron-right"></i>
            </a>
        </li>
    `;
    
    pagination.innerHTML = html;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderTable();
    }
}

function viewRequest(id) {
    const requests = Storage.get('serviceRequests') || [];
    const request = requests.find(r => r.id === id);
    
    if (!request) return;
    
    const details = `
        <strong>ID:</strong> ${request.id}<br>
        <strong>Cliente:</strong> ${request.clientName || request.clientEmail}<br>
        <strong>Email:</strong> ${request.clientEmail}<br>
        <strong>Fecha:</strong> ${formatRequestDate(request.serviceDate)}<br>
        <strong>Hora:</strong> ${request.serviceTime}<br>
        <strong>Tipo de Servicio:</strong> ${getServiceTypeName(request.serviceType)}<br>
        <strong>Pasajeros:</strong> ${request.passengers}<br>
        <strong>Origen:</strong> ${request.originLocation}<br>
        <strong>Destino:</strong> ${request.destinationLocation}<br>
        <strong>Contacto:</strong> ${request.contactName}<br>
        <strong>Teléfono:</strong> ${request.contactPhone}<br>
        <strong>Vehículo:</strong> ${request.car || 'No asignado'}<br>
        <strong>Chofer:</strong> ${request.chauffeur || 'No asignado'}<br>
        <strong>Estado:</strong> <span class="badge bg-${getStatusBadgeClass(request.status)}">${request.status}</span><br>
        ${request.notes ? `<strong>Notas:</strong> ${request.notes}<br>` : ''}
    `;
    
    const modal = new bootstrap.Modal(document.createElement('div'));
    const modalHtml = `
        <div class="modal fade" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Detalles de la Solicitud</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${details}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHtml;
    const modalElement = tempDiv.firstElementChild;
    document.body.appendChild(modalElement);
    const bsModal = new bootstrap.Modal(modalElement);
    bsModal.show();
    
    modalElement.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modalElement);
    });
}

function editRequest(id) {
    const requests = Storage.get('serviceRequests') || [];
    const request = requests.find(r => r.id === id);
    
    if (!request) return;
    
    document.getElementById('editId').value = request.id;
    document.getElementById('editClientName').value = request.clientName || request.clientEmail;
    document.getElementById('editStatus').value = request.status;
    document.getElementById('editDate').value = request.serviceDate;
    document.getElementById('editTime').value = request.serviceTime;
    document.getElementById('editCar').value = request.car || '';
    document.getElementById('editChauffeur').value = request.chauffeur || '';
    
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

function saveEdit() {
    const id = parseInt(document.getElementById('editId').value);
    const requests = Storage.get('serviceRequests') || [];
    const index = requests.findIndex(r => r.id === id);
    
    if (index === -1) return;
    
    const chauffeurValue = document.getElementById('editChauffeur').value;
    
    requests[index].status = document.getElementById('editStatus').value;
    requests[index].serviceDate = document.getElementById('editDate').value;
    requests[index].serviceTime = document.getElementById('editTime').value;
    requests[index].car = document.getElementById('editCar').value;
    requests[index].chauffeur = chauffeurValue;
    
    // Assign chauffeur ID for filtering in chauffeur area
    if (chauffeurValue) {
        const chauffeurs = Storage.get('chauffeurs') || [];
        const chauffeur = chauffeurs.find(c => c.name === chauffeurValue);
        if (chauffeur) {
            requests[index].assignedChauffeur = chauffeur.id;
        }
    } else {
        requests[index].assignedChauffeur = null;
    }
    
    Storage.set('serviceRequests', requests);
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    modal.hide();
    
    showAlert('Solicitud actualizada exitosamente', 'success');
    loadRequests();
}

function deleteRequest(id) {
    if (!confirm('¿Está seguro de que desea eliminar esta solicitud?')) {
        return;
    }
    
    const requests = Storage.get('serviceRequests') || [];
    const filtered = requests.filter(r => r.id !== id);
    Storage.set('serviceRequests', filtered);
    
    showAlert('Solicitud eliminada exitosamente', 'success');
    loadRequests();
}

function loadCarOptions() {
    const cars = Storage.get('cars') || [];
    const select = document.getElementById('editCar');
    
    let html = '<option value="">Sin asignar</option>';
    cars.forEach(car => {
        html += `<option value="${car.make} ${car.model} ${car.year}">${car.make} ${car.model} ${car.year} (${car.plate})</option>`;
    });
    
    select.innerHTML = html;
}

function loadChauffeurOptions() {
    const chauffeurs = Storage.get('chauffeurs') || [];
    const select = document.getElementById('editChauffeur');
    
    let html = '<option value="">Sin asignar</option>';
    chauffeurs.forEach(chauffeur => {
        html += `<option value="${chauffeur.name}">${chauffeur.name}</option>`;
    });
    
    select.innerHTML = html;
}

function formatRequestDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('es-MX', options);
}

function getServiceTypeName(type) {
    const types = {
        'car-rental': 'Renta de Auto',
        'chauffeur-service': 'Servicio de Chofer',
        'executive-transport': 'Transporte Ejecutivo'
    };
    return types[type] || type;
}

function getStatusBadgeClass(status) {
    const classes = {
        'Pendiente': 'warning',
        'Confirmado': 'success',
        'En Proceso': 'info',
        'Completado': 'primary',
        'Cancelado': 'danger'
    };
    return classes[status] || 'secondary';
}

function viewEventLogs(serviceId) {
    const eventLogs = Storage.get('eventLogs') || [];
    const serviceLogs = eventLogs.filter(log => log.serviceId === serviceId);

    const eventTypeNames = {
        'picked-up': 'Pasajero Recogido',
        'dropped-off': 'Pasajero Dejado',
        'border-cleared': 'Frontera Cruzada',
        'high-traffic': 'Tráfico Alto',
        'road-accident': 'Accidente en el Camino',
        'service-emergency': 'Emergencia del Servicio',
        'other': 'Otro'
    };

    const eventIcons = {
        'picked-up': 'bi-person-check-fill text-success',
        'dropped-off': 'bi-person-dash-fill text-info',
        'border-cleared': 'bi-flag-fill text-primary',
        'high-traffic': 'bi-exclamation-triangle-fill text-warning',
        'road-accident': 'bi-exclamation-octagon-fill text-danger',
        'service-emergency': 'bi-lightning-fill text-danger',
        'other': 'bi-info-circle-fill text-secondary'
    };

    let content = '';
    
    if (serviceLogs.length === 0) {
        content = `
            <div class="text-center text-muted py-4">
                <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                <p class="mt-2">No hay eventos registrados para este servicio.</p>
            </div>
        `;
    } else {
        // Sort by timestamp (newest first)
        serviceLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        serviceLogs.forEach(log => {
            const logDate = new Date(log.timestamp);
            const formattedDate = logDate.toLocaleDateString('es-MX', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            content += `
                <div class="card mb-3 border-start border-3 border-${getEventColor(log.eventType)}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="mb-0">
                                <i class="bi ${eventIcons[log.eventType] || 'bi-circle-fill'} me-2"></i>
                                ${eventTypeNames[log.eventType] || log.eventType}
                            </h6>
                            <small class="text-muted">${formattedDate}</small>
                        </div>
                        <p class="mb-1 text-muted">${log.notes}</p>
                        <small class="text-muted">
                            <i class="bi bi-person me-1"></i>Registrado por: ${log.chauffeurEmail || 'Sistema'}
                        </small>
                    </div>
                </div>
            `;
        });
    }

    document.getElementById('eventLogsContent').innerHTML = content;
    const modal = new bootstrap.Modal(document.getElementById('eventLogsModal'));
    modal.show();
}

function getEventColor(eventType) {
    const colors = {
        'picked-up': 'success',
        'dropped-off': 'info',
        'border-cleared': 'primary',
        'high-traffic': 'warning',
        'road-accident': 'danger',
        'service-emergency': 'danger',
        'other': 'secondary'
    };
    return colors[eventType] || 'secondary';
}

