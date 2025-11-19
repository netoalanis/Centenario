// Common admin functionality

// Initialize demo data if not exists
function initializeDemoData() {
    // Initialize service requests if empty
    if (!Storage.get('serviceRequests') || Storage.get('serviceRequests').length === 0) {
        const demoRequests = [
            {
                id: 1,
                clientEmail: 'client@centenario.com',
                clientName: 'Juan Pérez',
                serviceDate: '2024-12-15',
                serviceTime: '09:00',
                serviceType: 'car-rental',
                passengers: 2,
                originLocation: 'Aeropuerto Internacional',
                destinationLocation: 'Hotel Centro',
                contactName: 'Juan Pérez',
                contactPhone: '+52 55 1234 5678',
                notes: 'Requiero vehículo SUV',
                status: 'Pendiente',
                car: 'Toyota RAV4 2023',
                chauffeur: 'Carlos Gómez',
                createdAt: '2024-12-10T10:30:00'
            },
            {
                id: 2,
                clientEmail: 'maria@ejemplo.com',
                clientName: 'María García',
                serviceDate: '2024-12-14',
                serviceTime: '14:00',
                serviceType: 'executive-transport',
                passengers: 3,
                originLocation: 'Oficina Reforma',
                destinationLocation: 'Santa Fe',
                contactName: 'María García',
                contactPhone: '+52 55 9876 5432',
                notes: 'Junta ejecutiva',
                status: 'Confirmado',
                car: 'Mercedes-Benz Clase E 2024',
                chauffeur: 'Roberto Silva',
                createdAt: '2024-12-08T15:20:00'
            },
            {
                id: 3,
                clientEmail: 'pedro@ejemplo.com',
                clientName: 'Pedro Martínez',
                serviceDate: new Date().toISOString().split('T')[0],
                serviceTime: '10:30',
                serviceType: 'chauffeur-service',
                passengers: 1,
                originLocation: 'Hotel Polanco',
                destinationLocation: 'Centro de Convenciones',
                contactName: 'Pedro Martínez',
                contactPhone: '+52 55 5555 1234',
                notes: '',
                status: 'En Proceso',
                car: 'BMW Serie 5 2023',
                chauffeur: 'Luis Hernández',
                createdAt: '2024-12-12T08:00:00'
            },
            {
                id: 4,
                clientEmail: 'ana@ejemplo.com',
                clientName: 'Ana López',
                serviceDate: new Date().toISOString().split('T')[0],
                serviceTime: '16:00',
                serviceType: 'car-rental',
                passengers: 4,
                originLocation: 'Sucursal Centro',
                destinationLocation: 'Coyoacán',
                contactName: 'Ana López',
                contactPhone: '+52 55 4444 8888',
                notes: 'Renta por 3 días',
                status: 'Pendiente',
                car: 'Honda CR-V 2023',
                chauffeur: 'Miguel Ángel Ramírez',
                createdAt: '2024-12-13T11:45:00'
            },
            {
                id: 5,
                clientEmail: 'client@centenario.com',
                clientName: 'Juan Pérez',
                serviceDate: '2024-12-05',
                serviceTime: '11:00',
                serviceType: 'executive-transport',
                passengers: 2,
                originLocation: 'Aeropuerto',
                destinationLocation: 'Oficina',
                contactName: 'Juan Pérez',
                contactPhone: '+52 55 1234 5678',
                notes: '',
                status: 'Completado',
                car: 'Audi A6 2024',
                chauffeur: 'Carlos Gómez',
                createdAt: '2024-12-01T09:00:00'
            }
        ];
        Storage.set('serviceRequests', demoRequests);
    }

    // Initialize clients
    if (!Storage.get('clients')) {
        const demoClients = [
            {
                id: 1,
                name: 'Juan Pérez',
                email: 'client@centenario.com',
                phone: '+52 55 1234 5678',
                company: 'Empresa ABC',
                address: 'Av. Reforma 123, CDMX',
                createdAt: '2024-01-15T10:00:00'
            },
            {
                id: 2,
                name: 'María García',
                email: 'maria@ejemplo.com',
                phone: '+52 55 9876 5432',
                company: 'Corporativo XYZ',
                address: 'Insurgentes 456, CDMX',
                createdAt: '2024-02-20T14:30:00'
            },
            {
                id: 3,
                name: 'Pedro Martínez',
                email: 'pedro@ejemplo.com',
                phone: '+52 55 5555 1234',
                company: 'Tech Solutions',
                address: 'Polanco 789, CDMX',
                createdAt: '2024-03-10T09:15:00'
            },
            {
                id: 4,
                name: 'Ana López',
                email: 'ana@ejemplo.com',
                phone: '+52 55 4444 8888',
                company: 'Consultores SA',
                address: 'Santa Fe 321, CDMX',
                createdAt: '2024-04-05T16:45:00'
            }
        ];
        Storage.set('clients', demoClients);
    }

    // Initialize cars
    if (!Storage.get('cars')) {
        const demoCars = [
            { id: 1, make: 'Toyota', model: 'RAV4', year: 2023, type: 'SUV', plate: 'ABC-123-D', status: 'Disponible', color: 'Blanco' },
            { id: 2, make: 'Mercedes-Benz', model: 'Clase E', year: 2024, type: 'Ejecutivo', plate: 'XYZ-456-E', status: 'En Servicio', color: 'Negro' },
            { id: 3, make: 'BMW', model: 'Serie 5', year: 2023, type: 'Ejecutivo', plate: 'DEF-789-G', status: 'En Servicio', color: 'Gris' },
            { id: 4, make: 'Honda', model: 'CR-V', year: 2023, type: 'SUV', plate: 'GHI-012-H', status: 'Disponible', color: 'Azul' },
            { id: 5, make: 'Audi', model: 'A6', year: 2024, type: 'Ejecutivo', plate: 'JKL-345-I', status: 'Disponible', color: 'Negro' },
            { id: 6, make: 'Chevrolet', model: 'Suburban', year: 2023, type: 'SUV', plate: 'MNO-678-J', status: 'Mantenimiento', color: 'Blanco' }
        ];
        Storage.set('cars', demoCars);
    }

    // Initialize chauffeurs
    if (!Storage.get('chauffeurs')) {
        const demoChauffeurs = [
            { id: 1, name: 'Carlos Gómez', phone: '+52 55 1111 2222', license: 'LIC-001', status: 'Disponible', experience: '10 años' },
            { id: 2, name: 'Roberto Silva', phone: '+52 55 3333 4444', license: 'LIC-002', status: 'En Servicio', experience: '8 años' },
            { id: 3, name: 'Luis Hernández', phone: '+52 55 5555 6666', license: 'LIC-003', status: 'En Servicio', experience: '12 años' },
            { id: 4, name: 'Miguel Ángel Ramírez', phone: '+52 55 7777 8888', license: 'LIC-004', status: 'Disponible', experience: '5 años' },
            { id: 5, name: 'Jorge Fernández', phone: '+52 55 9999 0000', license: 'LIC-005', status: 'Descanso', experience: '15 años' }
        ];
        Storage.set('chauffeurs', demoChauffeurs);
    }
}

// Sidebar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!Auth.checkAuth('admin')) {
        return;
    }

    // Initialize demo data
    initializeDemoData();

    const user = Auth.getCurrentUser();
    const adminEmailElement = document.getElementById('adminEmail');
    if (adminEmailElement) {
        adminEmailElement.textContent = user.email;
    }

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('¿Está seguro que desea cerrar sesión?')) {
                Auth.logout();
            }
        });
    }

    // Highlight active menu item
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Helper function to get service type name
function getServiceTypeName(type) {
    const names = {
        'car-rental': 'Renta de Auto',
        'chauffeur-service': 'Servicio de Chofer',
        'executive-transport': 'Transporte Ejecutivo'
    };
    return names[type] || type;
}

// Helper function to get status badge class
function getStatusBadgeClass(status) {
    const badges = {
        'Pendiente': 'warning',
        'Confirmado': 'success',
        'En Proceso': 'info',
        'Completado': 'primary',
        'Cancelado': 'danger'
    };
    return badges[status] || 'secondary';
}
