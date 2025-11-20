// Chauffeur service details functionality

let currentServiceId = null;

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!Auth.checkAuth('chauffeur')) {
        return;
    }

    const user = Auth.getCurrentUser();
    
    // Display user information
    document.getElementById('userEmail').textContent = user.email;

    // Get service ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    currentServiceId = parseInt(urlParams.get('id'));

    if (!currentServiceId) {
        alert('Servicio no encontrado');
        window.location.href = 'area.html';
        return;
    }

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('¿Está seguro que desea cerrar sesión?')) {
            Auth.logout();
        }
    });

    // Add event button
    document.getElementById('addEventBtn').addEventListener('click', function() {
        const modal = new bootstrap.Modal(document.getElementById('eventLogModal'));
        modal.show();
    });

    // Save event button
    document.getElementById('saveEventBtn').addEventListener('click', saveEventLog);

    // Call contact button
    document.getElementById('callContactBtn').addEventListener('click', function() {
        const service = getService();
        if (service) {
            window.location.href = `tel:${service.contactPhone}`;
        }
    });

    // Navigate button
    document.getElementById('navigateBtn').addEventListener('click', function() {
        const service = getService();
        if (service) {
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.originLocation)}`, '_blank');
        }
    });

    // Load service details and event logs
    loadServiceDetails();
    loadEventLogs();
});

function getService() {
    const allRequests = Storage.get('serviceRequests') || [];
    return allRequests.find(req => req.id === currentServiceId);
}

function loadServiceDetails() {
    const service = getService();
    
    if (!service) {
        alert('Servicio no encontrado');
        window.location.href = 'area.html';
        return;
    }

    const serviceTypeNames = {
        'car-rental': 'Renta de Auto',
        'chauffeur-service': 'Servicio de Chofer',
        'executive-transport': 'Transporte Ejecutivo'
    };

    const statusBadges = {
        'Pendiente': 'warning',
        'Confirmado': 'success',
        'En Proceso': 'info',
        'Completado': 'primary',
        'Cancelado': 'danger'
    };

    const detailsHtml = `
        <div class="row g-3">
            <div class="col-md-6">
                <p class="mb-2"><strong>ID del Servicio:</strong></p>
                <p class="text-muted">${service.id}</p>
            </div>
            <div class="col-md-6">
                <p class="mb-2"><strong>Estado:</strong></p>
                <span class="badge bg-${statusBadges[service.status] || 'secondary'}">${service.status}</span>
            </div>
            <div class="col-md-6">
                <p class="mb-2"><strong>Fecha del Servicio:</strong></p>
                <p class="text-muted"><i class="bi bi-calendar3 me-2"></i>${formatServiceDate(service.serviceDate)}</p>
            </div>
            <div class="col-md-6">
                <p class="mb-2"><strong>Hora:</strong></p>
                <p class="text-muted"><i class="bi bi-clock me-2"></i>${service.serviceTime}</p>
            </div>
            <div class="col-md-6">
                <p class="mb-2"><strong>Tipo de Servicio:</strong></p>
                <p class="text-muted">${serviceTypeNames[service.serviceType] || service.serviceType}</p>
            </div>
            <div class="col-md-6">
                <p class="mb-2"><strong>Número de Pasajeros:</strong></p>
                <p class="text-muted"><i class="bi bi-people me-2"></i>${service.passengers}</p>
            </div>
            <div class="col-12">
                <hr>
            </div>
            <div class="col-md-6">
                <p class="mb-2"><strong>Ubicación de Origen:</strong></p>
                <p class="text-muted"><i class="bi bi-geo-alt me-2 text-danger"></i>${service.originLocation}</p>
            </div>
            <div class="col-md-6">
                <p class="mb-2"><strong>Ubicación de Destino:</strong></p>
                <p class="text-muted"><i class="bi bi-pin-map me-2 text-success"></i>${service.destinationLocation}</p>
            </div>
            <div class="col-12">
                <hr>
            </div>
            <div class="col-md-6">
                <p class="mb-2"><strong>Contacto Principal:</strong></p>
                <p class="text-muted"><i class="bi bi-person me-2"></i>${service.contactName}</p>
            </div>
            <div class="col-md-6">
                <p class="mb-2"><strong>Teléfono:</strong></p>
                <p class="text-muted"><i class="bi bi-telephone me-2"></i>${service.contactPhone}</p>
            </div>
            ${service.notes ? `
            <div class="col-12">
                <p class="mb-2"><strong>Notas Adicionales:</strong></p>
                <p class="text-muted">${service.notes}</p>
            </div>
            ` : ''}
        </div>
    `;

    document.getElementById('serviceDetails').innerHTML = detailsHtml;

    // Load additional contacts
    if (service.additionalContacts && service.additionalContacts.length > 0) {
        let contactsHtml = '<ul class="list-unstyled mb-0">';
        service.additionalContacts.forEach(contact => {
            contactsHtml += `
                <li class="mb-2">
                    <strong>${contact.name}</strong><br>
                    <small class="text-muted">
                        <i class="bi bi-telephone me-1"></i>${contact.phone || 'N/A'}<br>
                        ${contact.address ? `<i class="bi bi-geo-alt me-1"></i>${contact.address}` : ''}
                    </small>
                </li>
            `;
        });
        contactsHtml += '</ul>';
        document.getElementById('additionalContactsList').innerHTML = contactsHtml;
    } else {
        document.getElementById('additionalContactsCard').classList.add('d-none');
    }
}

function loadEventLogs() {
    const eventLogs = Storage.get('eventLogs') || [];
    const serviceLogs = eventLogs.filter(log => log.serviceId === currentServiceId);

    if (serviceLogs.length === 0) {
        document.getElementById('eventLogsList').innerHTML = `
            <div class="text-center text-muted py-3">
                <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                <p class="mt-2">No hay eventos registrados para este servicio.</p>
            </div>
        `;
        return;
    }

    // Sort by timestamp (newest first)
    serviceLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

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

    let html = '<div class="timeline">';
    serviceLogs.forEach(log => {
        html += `
            <div class="card mb-3 border-start border-3 border-${getEventColor(log.eventType)}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="mb-0">
                            <i class="bi ${eventIcons[log.eventType] || 'bi-circle-fill'} me-2"></i>
                            ${eventTypeNames[log.eventType] || log.eventType}
                        </h6>
                        <small class="text-muted">${formatDateTime(log.timestamp)}</small>
                    </div>
                    <p class="mb-0 text-muted">${log.notes}</p>
                </div>
            </div>
        `;
    });
    html += '</div>';

    document.getElementById('eventLogsList').innerHTML = html;
}

function saveEventLog() {
    const eventType = document.getElementById('eventType').value;
    const eventNotes = document.getElementById('eventNotes').value;

    if (!eventType || !eventNotes) {
        alert('Por favor complete todos los campos');
        return;
    }

    const eventLog = {
        id: Date.now(),
        serviceId: currentServiceId,
        eventType: eventType,
        notes: eventNotes,
        timestamp: new Date().toISOString(),
        chauffeurEmail: Auth.getCurrentUser().email
    };

    // Get existing event logs
    let eventLogs = Storage.get('eventLogs') || [];
    eventLogs.push(eventLog);
    Storage.set('eventLogs', eventLogs);

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('eventLogModal'));
    modal.hide();

    // Reset form
    document.getElementById('eventLogForm').reset();

    // Reload event logs
    loadEventLogs();

    // Show success message
    showAlert('Evento registrado exitosamente', 'success');
}

function formatServiceDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-MX', options);
}

function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('es-MX', options);
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
