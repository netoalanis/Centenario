// Cars management
let filteredCars = [];

document.addEventListener('DOMContentLoaded', function() {
    loadCars();
    document.getElementById('searchInput').addEventListener('input', filterCars);
    document.getElementById('statusFilter').addEventListener('change', filterCars);
    document.getElementById('saveEdit').addEventListener('click', saveEdit);
});

function loadCars() {
    const cars = Storage.get('cars') || [];
    filteredCars = [...cars];
    renderTable();
}

function filterCars() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const allCars = Storage.get('cars') || [];
    
    filteredCars = allCars.filter(car => {
        const matchesSearch = !searchTerm || 
            car.make.toLowerCase().includes(searchTerm) ||
            car.model.toLowerCase().includes(searchTerm) ||
            car.plate.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || car.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    renderTable();
}

function renderTable() {
    const container = document.getElementById('carsTable');
    
    if (filteredCars.length === 0) {
        container.innerHTML = '<div class="text-center text-muted py-4"><i class="bi bi-inbox" style="font-size: 3rem;"></i><p class="mt-2">No se encontraron vehículos.</p></div>';
        return;
    }

    let html = `
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Año</th>
                    <th>Tipo</th>
                    <th>Placa</th>
                    <th>Color</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    filteredCars.forEach(car => {
        const statusBadge = car.status === 'Disponible' ? 'success' : (car.status === 'En Servicio' ? 'info' : 'warning');
        html += `
            <tr>
                <td>${car.id}</td>
                <td>${car.make}</td>
                <td>${car.model}</td>
                <td>${car.year}</td>
                <td>${car.type}</td>
                <td>${car.plate}</td>
                <td>${car.color}</td>
                <td><span class="badge bg-${statusBadge}">${car.status}</span></td>
                <td class="table-actions">
                    <button class="btn btn-sm btn-warning" onclick="editCar(${car.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCar(${car.id})"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

function addCar() {
    document.getElementById('modalTitle').textContent = 'Agregar Vehículo';
    document.getElementById('editId').value = '';
    document.getElementById('editForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

function editCar(id) {
    const cars = Storage.get('cars') || [];
    const car = cars.find(c => c.id === id);
    if (!car) return;
    
    document.getElementById('modalTitle').textContent = 'Editar Vehículo';
    document.getElementById('editId').value = car.id;
    document.getElementById('editMake').value = car.make;
    document.getElementById('editModel').value = car.model;
    document.getElementById('editYear').value = car.year;
    document.getElementById('editType').value = car.type;
    document.getElementById('editPlate').value = car.plate;
    document.getElementById('editColor').value = car.color;
    document.getElementById('editStatus').value = car.status;
    
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

function saveEdit() {
    const cars = Storage.get('cars') || [];
    const id = document.getElementById('editId').value;
    const carData = {
        make: document.getElementById('editMake').value,
        model: document.getElementById('editModel').value,
        year: parseInt(document.getElementById('editYear').value),
        type: document.getElementById('editType').value,
        plate: document.getElementById('editPlate').value,
        color: document.getElementById('editColor').value,
        status: document.getElementById('editStatus').value
    };
    
    if (id) {
        const index = cars.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            cars[index] = { ...cars[index], ...carData };
        }
    } else {
        cars.push({ id: Date.now(), ...carData });
    }
    
    Storage.set('cars', cars);
    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    modal.hide();
    showAlert(id ? 'Vehículo actualizado' : 'Vehículo agregado', 'success');
    loadCars();
}

function deleteCar(id) {
    if (!confirm('¿Eliminar este vehículo?')) return;
    const cars = Storage.get('cars') || [];
    Storage.set('cars', cars.filter(c => c.id !== id));
    showAlert('Vehículo eliminado', 'success');
    loadCars();
}
