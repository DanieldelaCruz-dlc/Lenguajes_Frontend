// js/contactos.js

// 1. BASES DE DATOS SIMULADAS
let clientesDB = [
    { nombreId: 'CLI-Juan Pérez', telefono: '987654321', fecha: '2023-10-15' },
    { nombreId: 'CLI-María Gómez', telefono: '912345678', fecha: '2023-11-02' }
];

let proveedoresDB = [
    { nombreId: 'Tech Supplies SAC', ruc: '20123456789', telefono: '999111222', fecha: '2023-01-10' },
    { nombreId: 'Distribuidora Global', ruc: '20987654321', telefono: '999333444', fecha: '2023-05-20' }
];

let modalClienteInstance;
let modalProveedorInstance;

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar modales
    modalClienteInstance = new bootstrap.Modal(document.getElementById('modalCliente'));
    modalProveedorInstance = new bootstrap.Modal(document.getElementById('modalProveedor'));

    // Renderizar tablas
    renderizarClientes();
    renderizarProveedores();
});

/* ==========================================
   SECCIÓN: CLIENTES
   ========================================== */

function renderizarClientes() {
    const tbody = document.getElementById('tabla-clientes');
    tbody.innerHTML = '';

    if (clientesDB.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">No hay clientes registrados.</td></tr>`;
        return;
    }

    clientesDB.forEach(cli => {
        tbody.innerHTML += `
            <tr>
                <td class="fw-medium ps-4"><i class="bi bi-person-circle text-primary me-2"></i> ${cli.nombreId}</td>
                <td>${cli.telefono}</td>
                <td>${cli.fecha}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="abrirModalCliente('${cli.nombreId}')"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarCliente('${cli.nombreId}')"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function abrirModalCliente(nombreIdViejo = '') {
    document.getElementById('form-cliente').reset();
    document.getElementById('cli-idViejo').value = nombreIdViejo;

    if (nombreIdViejo) {
        const cliente = clientesDB.find(c => c.nombreId === nombreIdViejo);
        if (cliente) {
            document.getElementById('tituloModalCliente').innerText = 'Editar Cliente';
            document.getElementById('cli-nombre').value = cliente.nombreId;
            document.getElementById('cli-telefono').value = cliente.telefono;
        }
    } else {
        document.getElementById('tituloModalCliente').innerText = 'Registrar Nuevo Cliente';
    }

    modalClienteInstance.show();
}

function guardarCliente() {
    const idViejo = document.getElementById('cli-idViejo').value;
    const nombreId = document.getElementById('cli-nombre').value.trim();
    const telefono = document.getElementById('cli-telefono').value.trim();

    if (!nombreId || !telefono) {
        showAlert('Completa todos los campos obligatorios.', 'warning');
        return;
    }

    if (idViejo) {
        // Editar
        const index = clientesDB.findIndex(c => c.nombreId === idViejo);
        if (index !== -1) {
            // Validar si cambiaron el nombre y ya existe otro igual
            if (idViejo !== nombreId && clientesDB.some(c => c.nombreId === nombreId)) {
                showAlert('Ya existe un cliente con ese nombre/ID.', 'danger');
                return;
            }
            clientesDB[index].nombreId = nombreId;
            clientesDB[index].telefono = telefono;
            showAlert('Cliente actualizado correctamente.', 'info');
        }
    } else {
        // Crear
        if (clientesDB.some(c => c.nombreId === nombreId)) {
            showAlert('Ya existe un cliente con ese nombre/ID.', 'danger');
            return;
        }
        
        const fechaActual = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
        clientesDB.push({ nombreId, telefono, fecha: fechaActual });
        showAlert('Cliente registrado con éxito.', 'success');
    }

    renderizarClientes();
    modalClienteInstance.hide();
}

function eliminarCliente(nombreId) {
    if (confirm(`¿Estás seguro de eliminar al cliente "${nombreId}"?`)) {
        clientesDB = clientesDB.filter(c => c.nombreId !== nombreId);
        renderizarClientes();
        showAlert('Cliente eliminado.', 'success');
    }
}

/* ==========================================
   SECCIÓN: PROVEEDORES
   ========================================== */

function renderizarProveedores() {
    const tbody = document.getElementById('tabla-proveedores');
    tbody.innerHTML = '';

    if (proveedoresDB.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">No hay proveedores registrados.</td></tr>`;
        return;
    }

    proveedoresDB.forEach(prov => {
        tbody.innerHTML += `
            <tr>
                <td class="fw-medium ps-4"><i class="bi bi-building text-info me-2"></i> ${prov.nombreId}</td>
                <td><span class="badge bg-secondary">${prov.ruc}</span></td>
                <td>${prov.telefono}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="abrirModalProveedor('${prov.nombreId}')"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarProveedor('${prov.nombreId}')"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function abrirModalProveedor(nombreIdViejo = '') {
    document.getElementById('form-proveedor').reset();
    document.getElementById('prov-idViejo').value = nombreIdViejo;

    if (nombreIdViejo) {
        const prov = proveedoresDB.find(p => p.nombreId === nombreIdViejo);
        if (prov) {
            document.getElementById('tituloModalProveedor').innerText = 'Editar Proveedor';
            document.getElementById('prov-nombre').value = prov.nombreId;
            document.getElementById('prov-ruc').value = prov.ruc;
            document.getElementById('prov-telefono').value = prov.telefono;
        }
    } else {
        document.getElementById('tituloModalProveedor').innerText = 'Registrar Nuevo Proveedor';
    }

    modalProveedorInstance.show();
}

function guardarProveedor() {
    const idViejo = document.getElementById('prov-idViejo').value;
    const nombreId = document.getElementById('prov-nombre').value.trim();
    const ruc = document.getElementById('prov-ruc').value.trim();
    const telefono = document.getElementById('prov-telefono').value.trim();

    if (!nombreId || !ruc || !telefono) {
        showAlert('Completa todos los campos obligatorios.', 'warning');
        return;
    }

    if (idViejo) {
        // Editar
        const index = proveedoresDB.findIndex(p => p.nombreId === idViejo);
        if (index !== -1) {
            if (idViejo !== nombreId && proveedoresDB.some(p => p.nombreId === nombreId)) {
                showAlert('Ya existe un proveedor con esa Razón Social.', 'danger');
                return;
            }
            proveedoresDB[index].nombreId = nombreId;
            proveedoresDB[index].ruc = ruc;
            proveedoresDB[index].telefono = telefono;
            showAlert('Proveedor actualizado correctamente.', 'info');
        }
    } else {
        // Crear
        if (proveedoresDB.some(p => p.nombreId === nombreId)) {
            showAlert('Ya existe un proveedor con esa Razón Social.', 'danger');
            return;
        }
        
        const fechaActual = new Date().toISOString().split('T')[0];
        proveedoresDB.push({ nombreId, ruc, telefono, fecha: fechaActual });
        showAlert('Proveedor registrado con éxito.', 'success');
    }

    renderizarProveedores();
    modalProveedorInstance.hide();
}

function eliminarProveedor(nombreId) {
    if (confirm(`¿Estás seguro de eliminar al proveedor "${nombreId}"?`)) {
        proveedoresDB = proveedoresDB.filter(p => p.nombreId !== nombreId);
        renderizarProveedores();
        showAlert('Proveedor eliminado.', 'success');
    }
}