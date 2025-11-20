// Chauffeur area functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!Auth.checkAuth('chauffeur')) {
        return;
    }

    const user = Auth.getCurrentUser();
    
    // Display user information
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('welcomeMessage').textContent = `Bienvenido, ${user.name}`;

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('¿Está seguro que desea cerrar sesión?')) {
            Auth.logout();
        }
    });

    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', function() {
        loadServices();
    });

    // Load initial services
    loadServices();
});

function loadServices() {
    const user = Auth.getCurrentUser();
    const servicesContainer = document.getElementById('servicesContainer');
    const noServices = document.getElementById('noServices');
    
    // Get all service requests
    let allRequests = Storage.get('serviceRequests') || [];
    
    // Filter services assigned to this chauffeur
    const chauffeurServices = allRequests.filter(req => 
        req.assignedChauffeur === user.chauffeurId && 
        req.status !== 'Completado' && 
        req.status !== 'Cancelado'
    );

    if (chauffeurServices.length === 0) {
        servicesContainer.innerHTML = '';
        noServices.classList.remove('d-none');
        return;
    }

    noServices.classList.add('d-none');

    // Sort by scheduled time (ascending)
    chauffeurServices.sort((a, b) => {
        const dateA = new Date(a.serviceDate + 'T' + a.serviceTime);
        const dateB = new Date(b.serviceDate + 'T' + b.serviceTime);
        return dateA - dateB;
    });

    // Render service cards
    let html = '';
    chauffeurServices.forEach(service => {
        html += createServiceCard(service);
    });

    servicesContainer.innerHTML = html;
}

function createServiceCard(service) {
    const statusColors = {
        'Pendiente': 'warning',
        'Confirmado': 'success',
        'En Proceso': 'info'
    };

    const serviceDate = formatServiceDate(service.serviceDate);
    
    return `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100 shadow-sm">
                <div class="card-header bg-${statusColors[service.status] || 'secondary'} text-white">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-bold">ID: ${service.id}</span>
                        <span class="badge bg-white text-dark">${service.status}</span>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">
                        <i class="bi bi-clock me-2"></i>${serviceDate}
                    </h5>
                    <p class="card-text mb-2">
                        <i class="bi bi-calendar3 me-2 text-primary"></i>
                        <strong>Hora:</strong> ${service.serviceTime}
                    </p>
                    <p class="card-text mb-2">
                        <i class="bi bi-geo-alt me-2 text-danger"></i>
                        <strong>Origen:</strong> ${service.originLocation}
                    </p>
                    <p class="card-text mb-2">
                        <i class="bi bi-pin-map me-2 text-success"></i>
                        <strong>Destino:</strong> ${service.destinationLocation}
                    </p>
                    <p class="card-text mb-2">
                        <i class="bi bi-people me-2 text-info"></i>
                        <strong>Pasajeros:</strong> ${service.passengers}
                    </p>
                    <hr>
                    <p class="card-text mb-1">
                        <i class="bi bi-person me-2"></i>
                        <strong>Contacto:</strong> ${service.contactName}
                    </p>
                    <p class="card-text mb-0">
                        <i class="bi bi-telephone me-2"></i>
                        <strong>Teléfono:</strong> ${service.contactPhone}
                    </p>
                </div>
                <div class="card-footer bg-transparent">
                    <a href="service-details.html?id=${service.id}" class="btn btn-primary w-100">
                        <i class="bi bi-eye me-2"></i>Ver Detalles
                    </a>
                </div>
            </div>
        </div>
    `;
}

function formatServiceDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-MX', options);
}
