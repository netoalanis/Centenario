# Centenario - Sistema de Renta de Autos y Transporte

Sistema web completo para gestión de servicios de renta de autos, choferes y transporte ejecutivo.

## 📋 Descripción

Centenario es una aplicación web desarrollada con HTML, CSS (Bootstrap 5) y JavaScript que permite gestionar servicios de transporte, desde la solicitud de servicios por parte de clientes hasta la administración completa del sistema por parte de administradores.

## 🌟 Características Principales

### Página de Inicio (Landing Page)
- **Hero Section**: Sección principal con imagen de fondo y llamado a la acción
- **Servicios**: 
  - Renta de Autos
  - Servicio de Chofer
  - Transporte Ejecutivo
- **Nosotros**: Historia y misión de la empresa
- **Formulario de Contacto**: Con validación completa
- **Footer**: Enlaces a redes sociales e información de contacto
- **Navegación suave**: Scroll animado entre secciones
- **Totalmente accesible**: Implementa roles ARIA y navegación por teclado

### Sistema de Autenticación
- Login con email y contraseña
- Validación de formularios
- Redirección automática según rol de usuario
- Usuarios de prueba:
  - **Cliente**: `client@rentalcar.com` / `client123`
  - **Administrador**: `admin@rentalcar.com` / `admin123`

### Área de Cliente
- Mensaje de bienvenida personalizado
- **Formulario de Solicitud de Servicio**:
  - Selector de fecha y hora
  - Tipo de servicio (dropdown)
  - Número de pasajeros
  - Ubicación de origen y destino
  - Información de contacto
  - Notas adicionales opcionales
- Visualización de solicitudes propias
- Estado de solicitudes en tiempo real

### Panel de Administración

#### 1. Dashboard
- **Métricas principales**:
  - Total de solicitudes
  - Solicitudes pendientes
  - Solicitudes completadas
  - Solicitudes canceladas
- **Gráficas con Chart.js**:
  - Gráfico de barras: Servicios por día de la semana
  - Gráfico circular: Servicios por vehículo
  - Gráfico circular: Servicios por chofer
- **Tabla**: Servicios programados para hoy

#### 2. Gestión de Solicitudes de Servicio
- Tabla completa con todas las solicitudes
- **Filtros**:
  - Búsqueda por texto
  - Filtro por estado
  - Filtro por tipo de servicio
- **Paginación**: 10 registros por página
- **Acciones CRUD**:
  - Ver detalles completos
  - Editar solicitud
  - Eliminar solicitud
- Asignación de vehículos y choferes

#### 3. Calendario de Servicios
- Vista de calendario mensual
- Navegación entre meses
- Indicadores visuales de días con servicios
- Click en fecha para ver servicios del día
- Vista detallada de servicios por día

#### 4. Gestión de Clientes
- Tabla de todos los clientes
- Búsqueda por nombre, email o teléfono
- Paginación
- **Operaciones CRUD**:
  - Agregar nuevo cliente
  - Ver detalles
  - Editar información
  - Eliminar cliente

#### 5. Gestión de Vehículos
- Tabla de toda la flota
- Búsqueda por marca, modelo o placa
- Filtro por estado (Disponible, En Servicio, Mantenimiento)
- **Información de vehículos**:
  - Marca, modelo, año
  - Tipo de vehículo
  - Placa
  - Color
  - Estado de disponibilidad
- Operaciones CRUD completas

#### 6. Gestión de Choferes
- Tabla de todos los choferes
- Búsqueda y filtro por estado
- **Información de choferes**:
  - Nombre y teléfono
  - Número de licencia
  - Años de experiencia
  - Estado (Disponible, En Servicio, Descanso)
- Operaciones CRUD completas

#### 7. Reportes
- **Reporte de Solicitudes de Servicio**:
  - Filtro por rango de fechas
  - Exportación a CSV
  - Exportación a PDF (demo)
  
- **Reporte de Clientes**:
  - Lista completa de clientes
  - Exportación a CSV y PDF
  
- **Reporte de Vehículos**:
  - Estadísticas de flota
  - Estados de vehículos
  - Exportación a CSV y PDF
  
- **Reporte de Choferes**:
  - Estadísticas de personal
  - Disponibilidad
  - Exportación a CSV y PDF

#### 8. Catálogos
Gestión de valores del sistema:
- Tipos de servicio
- Estados de solicitud
- Tipos de vehículo
- Estados de chofer
- Países y ciudades
- Usuarios
- Roles

Cada catálogo permite:
- Agregar nuevos elementos
- Editar elementos existentes
- Eliminar elementos

## 🗂️ Estructura de Archivos

```
Centenario/
├── index.html                 # Página de inicio
├── login.html                 # Página de login
├── README.md                  # Este archivo
│
├── admin/                     # Área de administración
│   ├── dashboard.html         # Panel principal
│   ├── service-requests.html  # Gestión de solicitudes
│   ├── calendar.html          # Calendario
│   ├── clients.html           # Gestión de clientes
│   ├── cars.html              # Gestión de vehículos
│   ├── chauffeurs.html        # Gestión de choferes
│   ├── reports.html           # Reportes
│   └── catalogs.html          # Catálogos
│
├── client/                    # Área de cliente
│   └── area.html              # Dashboard del cliente
│
├── css/
│   └── styles.css             # Estilos personalizados
│
└── js/                        # Scripts JavaScript
    ├── main.js                # Funciones principales y utilidades
    ├── login.js               # Lógica de login
    ├── client.js              # Funcionalidad del área de cliente
    ├── admin-common.js        # Funciones comunes del admin
    ├── dashboard.js           # Dashboard y gráficas
    ├── service-requests.js    # Gestión de solicitudes
    ├── calendar.js            # Funcionalidad del calendario
    ├── clients.js             # Gestión de clientes
    ├── cars.js                # Gestión de vehículos
    ├── chauffeurs.js          # Gestión de choferes
    ├── reports.js             # Generación de reportes
    └── catalogs.js            # Gestión de catálogos
```

## 🚀 Cómo Usar

### Instalación
No requiere instalación. Simplemente abra `index.html` en un navegador web moderno.

### Acceso al Sistema

1. **Página Principal**: Abra `index.html`
2. **Iniciar Sesión**: Click en "Iniciar Sesión" en la navegación o hero section
3. **Usar Credenciales**:
   - **Como Cliente**: 
     - Email: `client@rentalcar.com`
     - Contraseña: `client123`
   - **Como Administrador**: 
     - Email: `admin@rentalcar.com`
     - Contraseña: `admin123`

### Flujo de Trabajo del Cliente

1. Iniciar sesión con credenciales de cliente
2. Completar el formulario de solicitud de servicio
3. Ver el estado de solicitudes previas
4. Cerrar sesión cuando termine

### Flujo de Trabajo del Administrador

1. Iniciar sesión con credenciales de administrador
2. Ver métricas y gráficas en el dashboard
3. Gestionar solicitudes desde el módulo correspondiente
4. Asignar vehículos y choferes a solicitudes
5. Revisar el calendario de servicios
6. Gestionar clientes, vehículos y choferes
7. Generar reportes según sea necesario
8. Configurar catálogos del sistema

## 💾 Almacenamiento de Datos

El sistema utiliza **LocalStorage** del navegador para persistir datos:
- Solicitudes de servicio
- Clientes
- Vehículos
- Choferes
- Catálogos del sistema
- Información de usuario actual

**Nota**: Los datos se almacenan localmente en el navegador. Para implementar en producción, se recomienda integrar con un backend y base de datos.

## 🎨 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos personalizados
- **Bootstrap 5.3**: Framework CSS para diseño responsive
- **Bootstrap Icons**: Iconografía
- **JavaScript (ES6+)**: Lógica de la aplicación
- **Chart.js 4.4**: Gráficas y visualización de datos
- **LocalStorage API**: Persistencia de datos en el cliente

## ✨ Características Técnicas

### Responsive Design
- Totalmente adaptable a dispositivos móviles, tablets y escritorio
- Menú hamburguesa en dispositivos móviles
- Sidebar colapsable en panel de administración
- Tablas con scroll horizontal en pantallas pequeñas

### Accesibilidad (WCAG)
- Roles ARIA apropiados
- Navegación por teclado
- Etiquetas descriptivas en formularios
- Alto contraste de colores
- Textos alternativos en iconos

### Validación de Formularios
- Validación HTML5 nativa
- Validación JavaScript personalizada
- Mensajes de error descriptivos
- Feedback visual inmediato

### Características UX
- Animaciones suaves
- Feedback visual en acciones
- Mensajes de confirmación
- Estados de carga
- Ordenamiento y filtrado de datos
- Paginación inteligente

## 📊 Datos de Demostración

El sistema incluye datos de demostración pre-cargados:
- 5 solicitudes de servicio de ejemplo
- 4 clientes
- 6 vehículos
- 5 choferes
- Catálogos completos del sistema

## 🔮 Mejoras Futuras (Recomendadas)

1. **Backend Integration**
   - API RESTful con Node.js/Express o similar
   - Base de datos (MySQL, PostgreSQL, MongoDB)
   - Autenticación JWT

2. **Funcionalidades Adicionales**
   - Sistema de notificaciones en tiempo real
   - Chat entre cliente y administrador
   - Sistema de pagos en línea
   - Generación real de PDFs con jsPDF
   - Envío de emails automáticos
   - Sistema de calificaciones y reseñas

3. **Mejoras de Seguridad**
   - Encriptación de contraseñas
   - HTTPS obligatorio
   - Protección contra CSRF y XSS
   - Rate limiting en autenticación

4. **Optimizaciones**
   - Lazy loading de imágenes
   - Minificación de CSS y JS
   - Service Workers para PWA
   - Caché de datos

## 📝 Notas

- **Idioma**: Todo el sistema está en español
- **Navegadores compatibles**: Chrome, Firefox, Safari, Edge (últimas versiones)
- **Resolución mínima recomendada**: 320px (móvil)

## 👨‍💻 Desarrollo

El código está organizado de manera modular y comentado para facilitar el mantenimiento y extensión.

### Convenciones de Código
- Nombres de variables en camelCase
- Nombres de funciones descriptivos
- Comentarios en español
- Código limpio y legible
- Separación de responsabilidades

## 📄 Licencia

Este proyecto es una demostración/mock-up para fines educativos y de presentación.

---

**Desarrollado con ❤️ usando HTML, Bootstrap 5 y JavaScript**

*Última actualización: Noviembre 2024*
