// Calendar functionality

let currentDate = new Date();

document.addEventListener('DOMContentLoaded', function() {
    renderCalendar();
    
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
});

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month title
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get requests for this month
    const requests = Storage.get('serviceRequests') || [];
    const monthRequests = {};
    
    requests.forEach(request => {
        const date = new Date(request.serviceDate + 'T00:00:00');
        if (date.getMonth() === month && date.getFullYear() === year) {
            const day = date.getDate();
            if (!monthRequests[day]) {
                monthRequests[day] = [];
            }
            monthRequests[day].push(request);
        }
    });
    
    // Build calendar HTML
    let html = `
        <table class="table table-bordered mb-0">
            <thead>
                <tr class="bg-light">
                    <th class="text-center">Dom</th>
                    <th class="text-center">Lun</th>
                    <th class="text-center">Mar</th>
                    <th class="text-center">Mié</th>
                    <th class="text-center">Jue</th>
                    <th class="text-center">Vie</th>
                    <th class="text-center">Sáb</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    let day = 1;
    for (let week = 0; week < 6; week++) {
        html += '<tr>';
        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
            if ((week === 0 && dayOfWeek < firstDay) || day > daysInMonth) {
                html += '<td class="calendar-day"></td>';
            } else {
                const hasEvents = monthRequests[day] && monthRequests[day].length > 0;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isToday = new Date().toISOString().split('T')[0] === dateStr;
                
                html += `
                    <td class="calendar-day ${hasEvents ? 'has-events' : ''} ${isToday ? 'bg-info bg-opacity-10' : ''}" 
                        onclick="showDayDetails('${dateStr}')">
                        <div class="fw-bold mb-1">${day}</div>
                `;
                
                if (hasEvents) {
                    monthRequests[day].slice(0, 3).forEach(request => {
                        html += `
                            <div class="calendar-event text-truncate" title="${request.clientName || request.clientEmail} - ${request.serviceTime}">
                                ${request.serviceTime} - ${request.clientName || request.clientEmail}
                            </div>
                        `;
                    });
                    if (monthRequests[day].length > 3) {
                        html += `<small class="text-muted">+${monthRequests[day].length - 3} más</small>`;
                    }
                }
                
                html += '</td>';
                day++;
            }
        }
        html += '</tr>';
        if (day > daysInMonth) break;
    }
    
    html += '</tbody></table>';
    document.getElementById('calendar').innerHTML = html;
}

function showDayDetails(dateStr) {
    const requests = Storage.get('serviceRequests') || [];
    const dayRequests = requests.filter(r => r.serviceDate === dateStr);
    
    const date = new Date(dateStr + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('selectedDate').textContent = date.toLocaleDateString('es-MX', options);
    
    const card = document.getElementById('dayDetailsCard');
    const details = document.getElementById('dayDetails');
    
    if (dayRequests.length === 0) {
        details.innerHTML = '<p class="text-muted">No hay servicios programados para este día.</p>';
    } else {
        // Sort by time
        dayRequests.sort((a, b) => a.serviceTime.localeCompare(b.serviceTime));
        
        let html = '<div class="list-group">';
        dayRequests.forEach(request => {
            html += `
                <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1"><i class="bi bi-clock me-2"></i>${request.serviceTime}</h6>
                            <p class="mb-1"><strong>Cliente:</strong> ${request.clientName || request.clientEmail}</p>
                            <p class="mb-1"><strong>Servicio:</strong> ${getServiceTypeName(request.serviceType)}</p>
                            <p class="mb-1"><strong>Ruta:</strong> ${request.originLocation} → ${request.destinationLocation}</p>
                            <p class="mb-0"><strong>Vehículo:</strong> ${request.car || 'No asignado'} | <strong>Chofer:</strong> ${request.chauffeur || 'No asignado'}</p>
                        </div>
                        <span class="badge bg-${getStatusBadgeClass(request.status)}">${request.status}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        details.innerHTML = html;
    }
    
    card.style.display = 'block';
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
