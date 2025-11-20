// Client area functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!Auth.checkAuth('client')) {
        return;
    }

    const user = Auth.getCurrentUser();
    
    // Display user information
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('welcomeMessage').textContent = `Estamos encantados de tenerle con nosotros, ${user.email}`;

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('serviceDate').setAttribute('min', today);

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('¿Está seguro que desea cerrar sesión?')) {
            Auth.logout();
        }
    });

    // Service request form submission
    const serviceRequestForm = document.getElementById('serviceRequestForm');
    const requestSuccess = document.getElementById('requestSuccess');

    serviceRequestForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!serviceRequestForm.checkValidity()) {
            e.stopPropagation();
            serviceRequestForm.classList.add('was-validated');
            return;
        }

        // Collect additional contacts data
        const additionalContacts = [];
        const contactFields = document.querySelectorAll('.additional-contact-field');
        contactFields.forEach(group => {
            const name = group.querySelector('.additional-contact-name').value.trim();
            const phone = group.querySelector('.additional-contact-phone').value.trim();
            const address = group.querySelector('.additional-contact-address').value.trim();
            if (name || phone || address) {
                additionalContacts.push({ name, phone, address });
            }
        });

        // Get form data
        const formData = {
            id: Date.now(),
            clientEmail: user.email,
            serviceDate: document.getElementById('serviceDate').value,
            serviceTime: document.getElementById('serviceTime').value,
            serviceType: document.getElementById('serviceType').value,
            passengers: document.getElementById('passengers').value,
            originLocation: document.getElementById('originLocation').value,
            destinationLocation: document.getElementById('destinationLocation').value,
            contactName: document.getElementById('contactName').value,
            contactPhone: document.getElementById('contactPhone').value,
            additionalContacts: additionalContacts,
            notes: document.getElementById('notes').value,
            status: 'Pendiente',
            createdAt: new Date().toISOString()
        };

        // Save to localStorage
        saveServiceRequest(formData);

        // Show success message
        requestSuccess.classList.remove('d-none');
        requestSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Reset form
        serviceRequestForm.reset();
        serviceRequestForm.classList.remove('was-validated');
        
        // Clear additional contacts
        document.getElementById('additionalContactsContainer').innerHTML = '';

        // Reload requests list
        loadServiceRequests();

        // Hide success message after 5 seconds
        setTimeout(() => {
            requestSuccess.classList.add('d-none');
        }, 5000);
    });

    // Add contact button event listener
    document.getElementById('addContactBtn').addEventListener('click', addContactField);

    // Load initial requests
    loadServiceRequests();
});

function saveServiceRequest(request) {
    // Get existing requests
    let requests = Storage.get('serviceRequests') || [];
    
    // Add new request
    requests.push(request);
    
    // Save back to storage
    Storage.set('serviceRequests', requests);
}

function loadServiceRequests() {
    const user = Auth.getCurrentUser();
    const requestsList = document.getElementById('requestsList');
    
    // Get all requests for this user
    let allRequests = Storage.get('serviceRequests') || [];
    const userRequests = allRequests.filter(req => req.clientEmail === user.email);

    if (userRequests.length === 0) {
        requestsList.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                <p class="mt-2">No tiene solicitudes de servicio aún.</p>
            </div>
        `;
        return;
    }

    // Sort by date (newest first)
    userRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Create table
    let html = `
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Tipo de Servicio</th>
                    <th>Origen</th>
                    <th>Destino</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
    `;

    userRequests.forEach(request => {
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

        html += `
            <tr>
                <td>${formatDate(request.serviceDate)}</td>
                <td>${request.serviceTime}</td>
                <td>${serviceTypeNames[request.serviceType] || request.serviceType}</td>
                <td>${request.originLocation}</td>
                <td>${request.destinationLocation}</td>
                <td>
                    <span class="badge bg-${statusBadges[request.status] || 'secondary'}">
                        ${request.status}
                    </span>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    requestsList.innerHTML = html;
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('es-MX', options);
}

function addContactField() {
    const container = document.getElementById('additionalContactsContainer');
    
    const contactDiv = document.createElement('div');
    contactDiv.className = 'additional-contact-field card mb-2 p-3';
    contactDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="mb-0"><i class="bi bi-person me-1"></i>Contacto Adicional</h6>
            <button type="button" class="btn btn-sm btn-outline-danger remove-contact-btn">
                <i class="bi bi-trash"></i> Eliminar
            </button>
        </div>
        <div class="row g-2">
            <div class="col-md-4">
                <input type="text" class="form-control form-control-sm additional-contact-name" placeholder="Nombre del contacto">
            </div>
            <div class="col-md-4">
                <input type="tel" class="form-control form-control-sm additional-contact-phone" placeholder="Teléfono" pattern="[+]?[0-9\\s\\-()]+">
            </div>
            <div class="col-md-4">
                <input type="text" class="form-control form-control-sm additional-contact-address" placeholder="Dirección">
            </div>
        </div>
    `;
    
    container.appendChild(contactDiv);
    
    // Add event listener to the remove button
    const removeBtn = contactDiv.querySelector('.remove-contact-btn');
    removeBtn.addEventListener('click', function() {
        contactDiv.remove();
    });
}
