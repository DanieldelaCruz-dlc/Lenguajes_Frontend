// js/app.js

// 1. GUARDIÁN DE RUTAS (Sin esperar al DOM para evitar parpadeos)
const token = localStorage.getItem('minerva_token');
if (!token && !window.location.pathname.includes('login.html')) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    // 2. Cargar el menú lateral dinámicamente
    await cargarMenuLateral();

    // 3. Ejecutar eventos globales del menú
    inicializarEventosGlobales();
});

async function cargarMenuLateral() {
    try {
        const response = await fetch('menu.html');
        if (!response.ok) throw new Error('No se pudo cargar el menú');
        
        const html = await response.text();
        document.getElementById('menu-container').innerHTML = html;

        resaltarMenuActivo();
    } catch (error) {
        console.error('Error cargando el menú:', error);
    }
}

function resaltarMenuActivo() {
    let paginaActual = window.location.pathname.split('/').pop();
    if (paginaActual === '') paginaActual = 'index.html';

    const links = document.querySelectorAll('#nav-links .nav-link');
    links.forEach(link => {
        if (link.getAttribute('href') === paginaActual) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
        }
    });
}

function inicializarEventosGlobales() {
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');

    if (toggleSidebarBtn && sidebar) {
        toggleSidebarBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }
}

// 4. LÓGICA DE "CERRAR SESIÓN" (Delegación de eventos)
// Escuchamos los clics en todo el documento para asegurar que detecte el botón inyectado
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'btn-cerrar-sesion') {
        e.preventDefault();
        if (confirm("¿Estás seguro de que deseas salir del Sistema Minerva?")) {
            localStorage.removeItem('minerva_token');
            localStorage.removeItem('minerva_usuario');
            window.location.href = 'login.html';
        }
    }
});

// Funciones de Alertas
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alert-container') || crearContenedorAlertas();
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show shadow-sm" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    alertContainer.insertAdjacentHTML('beforeend', alertHtml);
    setTimeout(() => {
        const alertElement = alertContainer.lastElementChild;
        if (alertElement) {
            const bsAlert = new bootstrap.Alert(alertElement);
            bsAlert.close();
        }
    }, 4000);
}

function crearContenedorAlertas() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '1050';
    document.body.appendChild(container);
    return container;
}