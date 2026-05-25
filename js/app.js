// js/app.js

document.addEventListener('DOMContentLoaded', async () => {
    await cargarMenuLateral();
    inicializarEventosGlobales();
});

async function cargarMenuLateral() {
    try {
        const response = await fetch('menu.html');
        if (!response.ok) throw new Error('No se pudo cargar el menú');
        
        document.getElementById('menu-container').innerHTML = await response.text();

        resaltarMenuActivo();
        aplicarPermisosPorRol(); 
    } catch (error) {
        console.error('Error cargando el menú:', error);
    }
}

function aplicarPermisosPorRol() {
    const rol = localStorage.getItem('minerva_rol');
    
    // Si NO es admin, removemos los elementos restringidos del HTML
    if (rol !== 'ADMIN') {
        const elementosPrivados = document.querySelectorAll('.auth-admin');
        elementosPrivados.forEach(elemento => elemento.remove());
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

// Delegación de eventos para Cerrar Sesión
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'btn-cerrar-sesion') {
        e.preventDefault();
        if (confirm("¿Estás seguro de que deseas salir del Sistema Minerva?")) {
            localStorage.removeItem('minerva_token');
            localStorage.removeItem('minerva_usuario');
            localStorage.removeItem('minerva_rol');
            window.location.replace('login.html');
        }
    }
});

// Utilidad global para alertas
function showAlert(message, type = 'success') {
    let alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alert-container';
        alertContainer.style.position = 'fixed';
        alertContainer.style.top = '20px';
        alertContainer.style.right = '20px';
        alertContainer.style.zIndex = '1050';
        document.body.appendChild(alertContainer);
    }

    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show shadow-sm" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
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