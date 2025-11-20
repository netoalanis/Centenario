// Catalogs management

const catalogDefaults = {
    serviceTypes: ['Renta de Auto', 'Servicio de Chofer', 'Transporte Ejecutivo'],
    requestStatus: ['Pendiente', 'Confirmado', 'En Proceso', 'Completado', 'Cancelado'],
    carTypes: ['Compacto', 'Sedán', 'SUV', 'Ejecutivo', 'Van', 'Lujo'],
    chauffeurStatus: ['Disponible', 'En Servicio', 'Descanso', 'Vacaciones'],
    countries: ['México', 'Estados Unidos', 'Canadá'],
    cities: ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Querétaro', 'Cancún'],
    users: ['admin@rentalcar.com', 'client@rentalcar.com'],
    roles: ['Administrador', 'Cliente', 'Chofer', 'Supervisor'],
    eventLogTypes: [
        'Pasajero Recogido',
        'Pasajero Dejado',
        'Frontera Cruzada',
        'Tráfico Alto',
        'Accidente en el Camino',
        'Emergencia del Servicio',
        'Otro'
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    initializeCatalogs();
    loadAllCatalogs();
    
    document.getElementById('saveCatalog').addEventListener('click', saveCatalogItem);
});

function initializeCatalogs() {
    // Initialize catalogs if they don't exist
    Object.keys(catalogDefaults).forEach(catalogType => {
        if (!Storage.get(catalogType)) {
            Storage.set(catalogType, catalogDefaults[catalogType]);
        }
    });
}

function loadAllCatalogs() {
    loadCatalog('serviceTypes', 'serviceTypesList');
    loadCatalog('requestStatus', 'requestStatusList');
    loadCatalog('carTypes', 'carTypesList');
    loadCatalog('chauffeurStatus', 'chauffeurStatusList');
    loadCatalog('countries', 'countriesList');
    loadCatalog('cities', 'citiesList');
    loadCatalog('users', 'usersList');
    loadCatalog('roles', 'rolesList');
    loadCatalog('eventLogTypes', 'eventLogTypesList');
}

function loadCatalog(catalogType, listId) {
    const items = Storage.get(catalogType) || [];
    const list = document.getElementById(listId);
    
    if (items.length === 0) {
        list.innerHTML = '<li class="list-group-item text-muted">No hay elementos</li>';
        return;
    }
    
    let html = '';
    items.forEach((item, index) => {
        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${item}</span>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="editCatalogItem('${catalogType}', ${index})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteCatalogItem('${catalogType}', ${index})" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </li>
        `;
    });
    
    list.innerHTML = html;
}

function addCatalogItem(catalogType) {
    const titles = {
        serviceTypes: 'Agregar Tipo de Servicio',
        requestStatus: 'Agregar Estado de Solicitud',
        carTypes: 'Agregar Tipo de Vehículo',
        chauffeurStatus: 'Agregar Estado de Chofer',
        countries: 'Agregar País',
        cities: 'Agregar Ciudad',
        users: 'Agregar Usuario',
        roles: 'Agregar Rol'
    };
    
    document.getElementById('catalogModalTitle').textContent = titles[catalogType];
    document.getElementById('catalogType').value = catalogType;
    document.getElementById('catalogIndex').value = '';
    document.getElementById('catalogValue').value = '';
    
    const modal = new bootstrap.Modal(document.getElementById('catalogModal'));
    modal.show();
}

function editCatalogItem(catalogType, index) {
    const items = Storage.get(catalogType) || [];
    
    const titles = {
        serviceTypes: 'Editar Tipo de Servicio',
        requestStatus: 'Editar Estado de Solicitud',
        carTypes: 'Editar Tipo de Vehículo',
        chauffeurStatus: 'Editar Estado de Chofer',
        countries: 'Editar País',
        cities: 'Editar Ciudad',
        users: 'Editar Usuario',
        roles: 'Editar Rol'
    };
    
    document.getElementById('catalogModalTitle').textContent = titles[catalogType];
    document.getElementById('catalogType').value = catalogType;
    document.getElementById('catalogIndex').value = index;
    document.getElementById('catalogValue').value = items[index];
    
    const modal = new bootstrap.Modal(document.getElementById('catalogModal'));
    modal.show();
}

function saveCatalogItem() {
    const catalogType = document.getElementById('catalogType').value;
    const index = document.getElementById('catalogIndex').value;
    const value = document.getElementById('catalogValue').value.trim();
    
    if (!value) {
        showAlert('El valor no puede estar vacío', 'danger');
        return;
    }
    
    const items = Storage.get(catalogType) || [];
    
    if (index === '') {
        // Add new item
        items.push(value);
    } else {
        // Edit existing item
        items[parseInt(index)] = value;
    }
    
    Storage.set(catalogType, items);
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('catalogModal'));
    modal.hide();
    
    showAlert(index === '' ? 'Elemento agregado' : 'Elemento actualizado', 'success');
    loadAllCatalogs();
}

function deleteCatalogItem(catalogType, index) {
    if (!confirm('¿Está seguro de eliminar este elemento?')) {
        return;
    }
    
    const items = Storage.get(catalogType) || [];
    items.splice(index, 1);
    Storage.set(catalogType, items);
    
    showAlert('Elemento eliminado', 'success');
    loadAllCatalogs();
}
