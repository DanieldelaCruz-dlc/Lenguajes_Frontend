// js/usuarios.js

// Base de datos simulada en memoria (hasta que se conecte con el backend)
let usuariosDB = [
    { id: 1, username: 'admin', role: 'ADMIN', status: 'Activo' },
    { id: 2, username: 'operador', role: 'OPERADOR', status: 'Activo' }
];

document.addEventListener('DOMContentLoaded', () => {
    // Verificación adicional de seguridad: Solo ADMIN puede ver esta vista
    if (localStorage.getItem('minerva_rol') !== 'ADMIN') {
        window.location.href = 'index.html';
        return;
    }
    renderizarTablaUsuarios();
});

function renderizarTablaUsuarios() {
    const tbody = document.getElementById('tabla-usuarios');
    tbody.innerHTML = '';

    usuariosDB.forEach(user => {
        const badgeRole = user.role === 'ADMIN' ? 'bg-danger' : 'bg-secondary';
        const badgeStatus = user.status === 'Activo' ? 'bg-success' : 'bg-warning';

        tbody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td class="fw-bold">${user.username}</td>
                <td><span class="badge ${badgeRole}">${user.role}</span></td>
                <td><span class="badge ${badgeStatus}">${user.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editarUsuario(${user.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarUsuario(${user.id})"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function guardarNuevoUsuario() {
    // En el futuro, aquí recogerás los datos de un modal (formulario)
    // const newUser = document.getElementById('nuevo-usuario').value;
    
    const nuevoId = usuariosDB.length ? usuariosDB[usuariosDB.length - 1].id + 1 : 1;
    usuariosDB.push({
        id: nuevoId,
        username: `nuevo_usuario_${nuevoId}`,
        role: 'OPERADOR',
        status: 'Activo'
    });
    
    renderizarTablaUsuarios();
    showAlert('Usuario creado exitosamente', 'success');
}

function eliminarUsuario(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        usuariosDB = usuariosDB.filter(u => u.id !== id);
        renderizarTablaUsuarios();
        showAlert('Usuario eliminado', 'info');
    }
}

function editarUsuario(id) {
    showAlert(`Funcionalidad para editar usuario ${id} en desarrollo`, 'warning');
}