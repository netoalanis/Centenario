// Dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    loadMetrics();
    loadCharts();
    loadTodayRequests();
});

function loadMetrics() {
    const requests = Storage.get('serviceRequests') || [];
    
    // Calculate metrics
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'Pendiente').length;
    const completed = requests.filter(r => r.status === 'Completado').length;
    const cancelled = requests.filter(r => r.status === 'Cancelado').length;

    // Update DOM
    document.getElementById('totalRequests').textContent = total;
    document.getElementById('pendingRequests').textContent = pending;
    document.getElementById('completedRequests').textContent = completed;
    document.getElementById('cancelledRequests').textContent = cancelled;
}

function loadCharts() {
    const requests = Storage.get('serviceRequests') || [];
    
    // Services per weekday
    loadWeekdayChart(requests);
    
    // Services per car
    loadCarChart(requests);
    
    // Services per chauffeur
    loadChauffeurChart(requests);
}

function loadWeekdayChart(requests) {
    const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    
    requests.forEach(request => {
        const date = new Date(request.serviceDate + 'T00:00:00');
        const day = date.getDay();
        counts[day]++;
    });

    const ctx = document.getElementById('weekdayChart');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weekdays,
            datasets: [{
                label: 'Servicios',
                data: counts,
                backgroundColor: 'rgba(13, 110, 253, 0.8)',
                borderColor: 'rgba(13, 110, 253, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function loadCarChart(requests) {
    const carCounts = {};
    
    requests.forEach(request => {
        if (request.car) {
            carCounts[request.car] = (carCounts[request.car] || 0) + 1;
        }
    });

    const labels = Object.keys(carCounts);
    const data = Object.values(carCounts);
    const backgroundColors = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)'
    ];

    const ctx = document.getElementById('carChart');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
}

function loadChauffeurChart(requests) {
    const chauffeurCounts = {};
    
    requests.forEach(request => {
        if (request.chauffeur) {
            chauffeurCounts[request.chauffeur] = (chauffeurCounts[request.chauffeur] || 0) + 1;
        }
    });

    const labels = Object.keys(chauffeurCounts);
    const data = Object.values(chauffeurCounts);
    const backgroundColors = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)'
    ];

    const ctx = document.getElementById('chauffeurChart');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
}

function loadTodayRequests() {
    const requests = Storage.get('serviceRequests') || [];
    const today = new Date().toISOString().split('T')[0];
    const todayRequests = requests.filter(r => r.serviceDate === today);
    
    const container = document.getElementById('todayRequests');
    
    if (todayRequests.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="bi bi-calendar-x" style="font-size: 3rem;"></i>
                <p class="mt-2">No hay servicios programados para hoy.</p>
            </div>
        `;
        return;
    }

    let html = `
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Hora</th>
                    <th>Cliente</th>
                    <th>Tipo de Servicio</th>
                    <th>Origen</th>
                    <th>Destino</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    todayRequests.forEach(request => {
        html += `
            <tr>
                <td><strong>${request.serviceTime}</strong></td>
                <td>${request.clientName || request.clientEmail}</td>
                <td>${getServiceTypeName(request.serviceType)}</td>
                <td>${request.originLocation}</td>
                <td>${request.destinationLocation}</td>
                <td>
                    <span class="badge bg-${getStatusBadgeClass(request.status)}">
                        ${request.status}
                    </span>
                </td>
                <td class="table-actions">
                    <button class="btn btn-sm btn-primary" onclick="viewRequest(${request.id})">
                        <i class="bi bi-eye"></i>
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
}

function viewRequest(id) {
    window.location.href = `service-requests.html?id=${id}`;
}
