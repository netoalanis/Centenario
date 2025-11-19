// Reports functionality

document.addEventListener('DOMContentLoaded', function() {
    // Set default dates
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    document.getElementById('requestsStartDate').value = firstDay.toISOString().split('T')[0];
    document.getElementById('requestsEndDate').value = today.toISOString().split('T')[0];
    document.getElementById('revenueStartDate').value = firstDay.toISOString().split('T')[0];
    document.getElementById('revenueEndDate').value = today.toISOString().split('T')[0];
    
    // Load initial data
    loadReportStats();
    loadServiceRequestsReport();
    
    // Listen for tab changes to load data
    document.getElementById('clients-tab').addEventListener('click', loadClientsReport);
    document.getElementById('cars-tab').addEventListener('click', loadCarsReport);
    document.getElementById('chauffeurs-tab').addEventListener('click', loadChauffeursReport);
    document.getElementById('revenue-tab').addEventListener('click', loadRevenueReport);
});

function loadReportStats() {
    const clients = Storage.get('clients') || [];
    const cars = Storage.get('cars') || [];
    const chauffeurs = Storage.get('chauffeurs') || [];
    
    // Clients stats
    document.getElementById('totalClients').textContent = clients.length;
    
    // Cars stats
    document.getElementById('totalCars').textContent = cars.length;
    document.getElementById('availableCars').textContent = cars.filter(c => c.status === 'Disponible').length;
    document.getElementById('inServiceCars').textContent = cars.filter(c => c.status === 'En Servicio').length;
    
    // Chauffeurs stats
    document.getElementById('totalChauffeurs').textContent = chauffeurs.length;
    document.getElementById('availableChauffeurs').textContent = chauffeurs.filter(c => c.status === 'Disponible').length;
    document.getElementById('inServiceChauffeurs').textContent = chauffeurs.filter(c => c.status === 'En Servicio').length;
}

// Service Requests Report
function loadServiceRequestsReport() {
    const startDate = document.getElementById('requestsStartDate').value;
    const endDate = document.getElementById('requestsEndDate').value;
    const statusFilter = document.getElementById('requestsStatusFilter').value;
    
    const requests = Storage.get('serviceRequests') || [];
    let filtered = requests.filter(r => {
        if (startDate && r.serviceDate < startDate) return false;
        if (endDate && r.serviceDate > endDate) return false;
        if (statusFilter && r.status !== statusFilter) return false;
        return true;
    });
    
    const tbody = document.getElementById('serviceRequestsTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" class="text-center">No hay datos disponibles</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(r => `
        <tr>
            <td>${r.id}</td>
            <td>${r.serviceDate}</td>
            <td>${r.serviceTime}</td>
            <td>${r.clientName || r.clientEmail}</td>
            <td>${getServiceTypeName(r.serviceType)}</td>
            <td>${r.originLocation}</td>
            <td>${r.destinationLocation || 'N/A'}</td>
            <td>${r.car || 'No asignado'}</td>
            <td>${r.chauffeur || 'No asignado'}</td>
            <td>${r.passengers}</td>
            <td><span class="badge bg-${getStatusColor(r.status)}">${r.status}</span></td>
        </tr>
    `).join('');
}

// Clients Report
function loadClientsReport() {
    const searchFilter = document.getElementById('clientsSearchFilter')?.value.toLowerCase() || '';
    
    const clients = Storage.get('clients') || [];
    const requests = Storage.get('serviceRequests') || [];
    
    let filtered = clients;
    if (searchFilter) {
        filtered = clients.filter(c => 
            c.name.toLowerCase().includes(searchFilter) || 
            c.email.toLowerCase().includes(searchFilter)
        );
    }
    
    const tbody = document.getElementById('clientsTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay datos disponibles</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(c => {
        const clientRequests = requests.filter(r => r.clientEmail === c.email);
        return `
            <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td>${c.company || 'N/A'}</td>
                <td>${c.address || 'N/A'}</td>
                <td>${clientRequests.length}</td>
                <td>${c.registrationDate || 'N/A'}</td>
            </tr>
        `;
    }).join('');
}

// Cars Report
function loadCarsReport() {
    const typeFilter = document.getElementById('carsTypeFilter').value;
    const statusFilter = document.getElementById('carsStatusFilter').value;
    
    const cars = Storage.get('cars') || [];
    const requests = Storage.get('serviceRequests') || [];
    
    let filtered = cars.filter(c => {
        if (typeFilter && c.type !== typeFilter) return false;
        if (statusFilter && c.status !== statusFilter) return false;
        return true;
    });
    
    const tbody = document.getElementById('carsTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" class="text-center">No hay datos disponibles</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(c => {
        const carRequests = requests.filter(r => r.car === `${c.make} ${c.model}` && r.status === 'Completada');
        return `
            <tr>
                <td>${c.id}</td>
                <td>${c.make}</td>
                <td>${c.model}</td>
                <td>${c.year}</td>
                <td>${c.type}</td>
                <td>${c.plate}</td>
                <td>${c.color}</td>
                <td>${c.capacity || 'N/A'}</td>
                <td>${c.mileage || 'N/A'}</td>
                <td><span class="badge bg-${getStatusColor(c.status)}">${c.status}</span></td>
                <td>${carRequests.length}</td>
            </tr>
        `;
    }).join('');
}

// Chauffeurs Report
function loadChauffeursReport() {
    const statusFilter = document.getElementById('chauffeursStatusFilter').value;
    
    const chauffeurs = Storage.get('chauffeurs') || [];
    const requests = Storage.get('serviceRequests') || [];
    
    let filtered = chauffeurs.filter(c => {
        if (statusFilter && c.status !== statusFilter) return false;
        return true;
    });
    
    const tbody = document.getElementById('chauffeursTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center">No hay datos disponibles</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(c => {
        const chauffeurRequests = requests.filter(r => r.chauffeur === c.name && r.status === 'Completada');
        const avgRating = c.rating || (4 + Math.random()).toFixed(1);
        return `
            <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.phone}</td>
                <td>${c.email || 'N/A'}</td>
                <td>${c.license}</td>
                <td>${c.experience}</td>
                <td>${c.languages || 'Español'}</td>
                <td>${chauffeurRequests.length}</td>
                <td>${avgRating} <i class="bi bi-star-fill text-warning"></i></td>
                <td><span class="badge bg-${getStatusColor(c.status)}">${c.status}</span></td>
            </tr>
        `;
    }).join('');
}

// Revenue Report
function loadRevenueReport() {
    const startDate = document.getElementById('revenueStartDate').value;
    const endDate = document.getElementById('revenueEndDate').value;
    
    const requests = Storage.get('serviceRequests') || [];
    
    // Filter completed requests in date range
    let filtered = requests.filter(r => {
        if (r.status !== 'Completada') return false;
        if (startDate && r.serviceDate < startDate) return false;
        if (endDate && r.serviceDate > endDate) return false;
        return true;
    });
    
    // Calculate revenue statistics
    const totalRevenue = filtered.reduce((sum, r) => sum + (r.totalAmount || generateRevenue(r)), 0);
    const completedServices = filtered.length;
    const averageRevenue = completedServices > 0 ? totalRevenue / completedServices : 0;
    const pendingServices = requests.filter(r => r.status === 'Pendiente' || r.status === 'Confirmada').length;
    
    // Update summary cards
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById('completedServices').textContent = completedServices;
    document.getElementById('averageRevenue').textContent = `$${averageRevenue.toFixed(2)}`;
    document.getElementById('pendingServices').textContent = pendingServices;
    
    const tbody = document.getElementById('revenueTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" class="text-center">No hay datos disponibles</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(r => {
        const baseRate = r.baseRate || calculateBaseRate(r);
        const extras = r.extras || 0;
        const total = r.totalAmount || (baseRate + extras);
        const duration = r.duration || Math.ceil(Math.random() * 8);
        const paymentMethod = r.paymentMethod || (Math.random() > 0.5 ? 'Tarjeta' : 'Efectivo');
        
        return `
            <tr>
                <td>${r.id}</td>
                <td>${r.serviceDate}</td>
                <td>${r.clientName || r.clientEmail}</td>
                <td>${getServiceTypeName(r.serviceType)}</td>
                <td>${r.car || 'N/A'}</td>
                <td>${r.chauffeur || 'N/A'}</td>
                <td>${duration}</td>
                <td>$${baseRate.toFixed(2)}</td>
                <td>$${extras.toFixed(2)}</td>
                <td><strong>$${total.toFixed(2)}</strong></td>
                <td>${paymentMethod}</td>
            </tr>
        `;
    }).join('');
}

// Helper function to generate revenue for demo purposes
function generateRevenue(request) {
    const baseRates = {
        'airport': 800,
        'pointToPoint': 500,
        'hourly': 400,
        'event': 1200,
        'tour': 1500
    };
    const baseRate = baseRates[request.serviceType] || 500;
    const extras = Math.random() * 200;
    return baseRate + extras;
}

// Helper function to calculate base rate
function calculateBaseRate(request) {
    const baseRates = {
        'airport': 800,
        'pointToPoint': 500,
        'hourly': 400,
        'event': 1200,
        'tour': 1500
    };
    return baseRates[request.serviceType] || 500;
}

// Helper function for status colors
function getStatusColor(status) {
    const colors = {
        'Disponible': 'success',
        'En Servicio': 'warning',
        'Mantenimiento': 'danger',
        'Descanso': 'secondary',
        'Pendiente': 'warning',
        'Confirmada': 'info',
        'En Proceso': 'primary',
        'Completada': 'success',
        'Cancelada': 'danger'
    };
    return colors[status] || 'secondary';
}

// Service Requests Reports
function exportRequestsPDF() {
    const startDate = document.getElementById('requestsStartDate').value;
    const endDate = document.getElementById('requestsEndDate').value;
    
    const requests = Storage.get('serviceRequests') || [];
    const filtered = requests.filter(r => {
        return r.serviceDate >= startDate && r.serviceDate <= endDate;
    });
    
    if (filtered.length === 0) {
        showAlert('No hay solicitudes en el rango de fechas seleccionado', 'warning');
        return;
    }
    
    // For demo purposes, show alert instead of generating actual PDF
    showAlert(`Generando PDF con ${filtered.length} solicitudes... (Funcionalidad de demostración)`, 'info');
    
    // In a real implementation, you would use jsPDF here:
    // const { jsPDF } = window.jspdf;
    // const doc = new jsPDF();
    // ... add content to PDF
    // doc.save('solicitudes.pdf');
}

function exportRequestsCSV() {
    const startDate = document.getElementById('requestsStartDate').value;
    const endDate = document.getElementById('requestsEndDate').value;
    
    const requests = Storage.get('serviceRequests') || [];
    const filtered = requests.filter(r => {
        return r.serviceDate >= startDate && r.serviceDate <= endDate;
    });
    
    if (filtered.length === 0) {
        showAlert('No hay solicitudes en el rango de fechas seleccionado', 'warning');
        return;
    }
    
    const data = filtered.map(r => ({
        'ID': r.id,
        'Cliente': r.clientName || r.clientEmail,
        'Email': r.clientEmail,
        'Fecha': r.serviceDate,
        'Hora': r.serviceTime,
        'Tipo': getServiceTypeName(r.serviceType),
        'Origen': r.originLocation,
        'Destino': r.destinationLocation,
        'Pasajeros': r.passengers,
        'Vehículo': r.car || 'No asignado',
        'Chofer': r.chauffeur || 'No asignado',
        'Estado': r.status
    }));
    
    exportToCSV(data, `solicitudes_${startDate}_${endDate}.csv`);
    showAlert('Reporte exportado exitosamente', 'success');
}

// Clients Reports
function exportClientsPDF() {
    const clients = Storage.get('clients') || [];
    showAlert(`Generando PDF con ${clients.length} clientes... (Funcionalidad de demostración)`, 'info');
}

function exportClientsCSV() {
    const clients = Storage.get('clients') || [];
    
    if (clients.length === 0) {
        showAlert('No hay clientes para exportar', 'warning');
        return;
    }
    
    const data = clients.map(c => ({
        'ID': c.id,
        'Nombre': c.name,
        'Email': c.email,
        'Teléfono': c.phone,
        'Empresa': c.company || '',
        'Dirección': c.address || ''
    }));
    
    exportToCSV(data, 'clientes.csv');
    showAlert('Reporte exportado exitosamente', 'success');
}

// Cars Reports
function exportCarsPDF() {
    const cars = Storage.get('cars') || [];
    showAlert(`Generando PDF con ${cars.length} vehículos... (Funcionalidad de demostración)`, 'info');
}

function exportCarsCSV() {
    const cars = Storage.get('cars') || [];
    
    if (cars.length === 0) {
        showAlert('No hay vehículos para exportar', 'warning');
        return;
    }
    
    const data = cars.map(c => ({
        'ID': c.id,
        'Marca': c.make,
        'Modelo': c.model,
        'Año': c.year,
        'Tipo': c.type,
        'Placa': c.plate,
        'Color': c.color,
        'Estado': c.status
    }));
    
    exportToCSV(data, 'vehiculos.csv');
    showAlert('Reporte exportado exitosamente', 'success');
}

// Chauffeurs Reports
function exportChauffeursPDF() {
    const chauffeurs = Storage.get('chauffeurs') || [];
    showAlert(`Generando PDF con ${chauffeurs.length} choferes... (Funcionalidad de demostración)`, 'info');
}

function exportChauffeursCSV() {
    const chauffeurs = Storage.get('chauffeurs') || [];
    
    if (chauffeurs.length === 0) {
        showAlert('No hay choferes para exportar', 'warning');
        return;
    }
    
    const data = chauffeurs.map(c => ({
        'ID': c.id,
        'Nombre': c.name,
        'Teléfono': c.phone,
        'Licencia': c.license,
        'Experiencia': c.experience,
        'Estado': c.status
    }));
    
    exportToCSV(data, 'choferes.csv');
    showAlert('Reporte exportado exitosamente', 'success');
}

// Revenue Reports
function exportRevenuePDF() {
    const startDate = document.getElementById('revenueStartDate').value;
    const endDate = document.getElementById('revenueEndDate').value;
    
    const requests = Storage.get('serviceRequests') || [];
    const filtered = requests.filter(r => {
        if (r.status !== 'Completada') return false;
        if (startDate && r.serviceDate < startDate) return false;
        if (endDate && r.serviceDate > endDate) return false;
        return true;
    });
    
    showAlert(`Generando PDF con ${filtered.length} transacciones... (Funcionalidad de demostración)`, 'info');
}

function exportRevenueCSV() {
    const startDate = document.getElementById('revenueStartDate').value;
    const endDate = document.getElementById('revenueEndDate').value;
    
    const requests = Storage.get('serviceRequests') || [];
    const filtered = requests.filter(r => {
        if (r.status !== 'Completada') return false;
        if (startDate && r.serviceDate < startDate) return false;
        if (endDate && r.serviceDate > endDate) return false;
        return true;
    });
    
    if (filtered.length === 0) {
        showAlert('No hay ingresos en el rango de fechas seleccionado', 'warning');
        return;
    }
    
    const data = filtered.map(r => {
        const baseRate = r.baseRate || calculateBaseRate(r);
        const extras = r.extras || 0;
        const total = r.totalAmount || (baseRate + extras);
        const duration = r.duration || Math.ceil(Math.random() * 8);
        const paymentMethod = r.paymentMethod || (Math.random() > 0.5 ? 'Tarjeta' : 'Efectivo');
        
        return {
            'ID': r.id,
            'Fecha': r.serviceDate,
            'Cliente': r.clientName || r.clientEmail,
            'Tipo de Servicio': getServiceTypeName(r.serviceType),
            'Vehículo': r.car || 'N/A',
            'Chofer': r.chauffeur || 'N/A',
            'Duración (hrs)': duration,
            'Tarifa Base': baseRate.toFixed(2),
            'Extras': extras.toFixed(2),
            'Total': total.toFixed(2),
            'Método de Pago': paymentMethod
        };
    });
    
    exportToCSV(data, `ingresos_${startDate}_${endDate}.csv`);
    showAlert('Reporte exportado exitosamente', 'success');
}
