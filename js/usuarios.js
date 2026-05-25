// js/usuarios.js

// Base de datos simulada en memoria
let usuariosDB = [
    { id: 1, username: 'admin', password: '123', role: 'ADMIN', status: 'Activo' },
    { id: 2, username: 'operador', password: '123', role: 'OPERADOR', status: 'Activo' },
    { id: 3, username: 'cajero_bloqueado', password: '123', role: 'OPERADOR', status: 'Bloqueado' }
];

let modalUsuario; // Variable para controlar el modal de Bootstrap

document.addEventListener('DOMContentLoaded', () => {
    // Verificación de seguridad: Solo ADMIN puede ver esta vista y usar este JS
    if (localStorage.getItem('minerva_rol') !== 'ADMIN') {
        window.location.replace('index.html');
        return;
    }
    
    // Inicializar la instancia del Modal de Bootstrap
    modalUsuario = new bootstrap.Modal(document.getElementById('modalUsuario'));
    
    renderizarTablaUsuarios();
});

// 1. LEER (Mostrar en tabla)
function renderizarTablaUsuarios() {
    const tbody = document.getElementById('tabla-usuarios');
    tbody.innerHTML = '';

    usuariosDB.forEach(user => {
        const badgeRole = user.role === 'ADMIN' ? 'bg-danger' : 'bg-secondary';
        const badgeStatus = user.status === 'Activo' ? 'bg-success' : 'bg-dark';
        
        // Determinar icono y clase para el botón de bloquear/desbloquear
        const btnBlockIcon = user.status === 'Activo' ? 'bi-ban' : 'bi-check-circle';
        const btnBlockClass = user.status === 'Activo' ? 'btn-outline-warning' : 'btn-outline-success';
        const btnBlockTitle = user.status === 'Activo' ? 'Bloquear Acceso' : 'Desbloquear Acceso';

        tbody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td class="fw-bold">${user.username}</td>
                <td><span class="badge ${badgeRole}">${user.role}</span></td>
                <td><span class="badge ${badgeStatus}">${user.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" title="Editar" onclick="abrirModalEditar(${user.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm ${btnBlockClass} me-1" title="${btnBlockTitle}" onclick="cambiarEstadoUsuario(${user.id})">
                        <i class="bi ${btnBlockIcon}"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" title="Eliminar" onclick="eliminarUsuario(${user.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// 2. PREPARAR CREACIÓN
function abrirModalCrear() {
    document.getElementById('form-usuario').reset();
    document.getElementById('user-id').value = ''; // ID vacío indica que es un nuevo registro
    document.getElementById('modalUsuarioTitle').innerText = 'Crear Nuevo Usuario';
    document.getElementById('password-help').innerText = 'La contraseña es obligatoria para usuarios nuevos.';
    modalUsuario.show();
}

// 3. PREPARAR EDICIÓN
function abrirModalEditar(id) {
    const user = usuariosDB.find(u => u.id === id);
    if (!user) return;

    document.getElementById('user-id').value = user.id;
    document.getElementById('user-username').value = user.username;
    document.getElementById('user-password').value = ''; // No mostramos la contraseña actual por seguridad
    document.getElementById('user-rol').value = user.role;
    document.getElementById('user-estado').value = user.status;
    
    document.getElementById('modalUsuarioTitle').innerText = 'Editar Usuario';
    document.getElementById('password-help').innerText = 'Déjalo en blanco si no deseas cambiar la contraseña.';
    
    modalUsuario.show();
}

// 4. GUARDAR (Crear o Actualizar)
function guardarUsuario() {
    const id = document.getElementById('user-id').value;
    const username = document.getElementById('user-username').value.trim();
    const password = document.getElementById('user-password').value.trim();
    const role = document.getElementById('user-rol').value;
    const status = document.getElementById('user-estado').value;

    if (!username) {
        showAlert('El nombre de usuario es obligatorio.', 'warning');
        return;
    }

    if (id === '') {
        // MODO CREAR
        if (!password) {
            showAlert('Debes asignar una contraseña al nuevo usuario.', 'warning');
            return;
        }
        
        // Validar que el usuario no exista ya
        if(usuariosDB.some(u => u.username === username)) {
            showAlert('Ese nombre de usuario ya está en uso.', 'danger');
            return;
        }

        const nuevoId = usuariosDB.length > 0 ? Math.max(...usuariosDB.map(u => u.id)) + 1 : 1;
        usuariosDB.push({ id: nuevoId, username, password, role, status });
        showAlert('Usuario creado exitosamente.', 'success');

    } else {
        // MODO EDITAR
        const index = usuariosDB.findIndex(u => u.id === parseInt(id));
        if (index !== -1) {
            // Validar que no le pongamos el mismo nombre de otro usuario
            const usernameExiste = usuariosDB.some(u => u.username === username && u.id !== parseInt(id));
            if(usernameExiste) {
                showAlert('Ese nombre de usuario ya está en uso.', 'danger');
                return;
            }

            usuariosDB[index].username = username;
            usuariosDB[index].role = role;
            usuariosDB[index].status = status;
            
            // Solo actualizamos la contraseña si el admin escribió algo nuevo
            if (password !== '') {
                usuariosDB[index].password = password;
            }
            showAlert('Usuario actualizado correctamente.', 'info');
        }
    }

    renderizarTablaUsuarios();
    modalUsuario.hide(); // Cerramos el modal
}

// 5. BORRAR
function eliminarUsuario(id) {
    // Protección para no auto-eliminarse
    const usuarioLogueado = localStorage.getItem('minerva_usuario');
    const userToDel = usuariosDB.find(u => u.id === id);
    
    if (userToDel && userToDel.username === usuarioLogueado) {
        showAlert('No puedes eliminar tu propia cuenta mientras estás en sesión.', 'danger');
        return;
    }

    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente al usuario "${userToDel.username}"?`)) {
        usuariosDB = usuariosDB.filter(u => u.id !== id);
        renderizarTablaUsuarios();
        showAlert('Usuario eliminado del sistema.', 'success');
    }
}

// 6. BLOQUEAR/DESBLOQUEAR ESTADO RAPIDO
function cambiarEstadoUsuario(id) {
    const usuarioLogueado = localStorage.getItem('minerva_usuario');
    const index = usuariosDB.findIndex(u => u.id === id);
    
    if (index !== -1) {
        if (usuariosDB[index].username === usuarioLogueado) {
            showAlert('No puedes bloquear tu propia cuenta.', 'danger');
            return;
        }

        const estadoActual = usuariosDB[index].status;
        usuariosDB[index].status = estadoActual === 'Activo' ? 'Bloqueado' : 'Activo';
        
        renderizarTablaUsuarios();
        
        const msj = usuariosDB[index].status === 'Bloqueado' 
            ? `El acceso para ${usuariosDB[index].username} ha sido bloqueado.` 
            : `El usuario ${usuariosDB[index].username} ahora está Activo.`;
            
        showAlert(msj, usuariosDB[index].status === 'Bloqueado' ? 'warning' : 'success');
    }
}