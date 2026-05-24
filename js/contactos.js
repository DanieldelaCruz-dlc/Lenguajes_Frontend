document.addEventListener('DOMContentLoaded', () => {
    cargarClientes();
    cargarProveedores();
});

async function cargarClientes() {
    try {
        const clientes = await api.get('/customers'); // URL base ajustada según tu backend
        const tbody = document.getElementById('tabla-clientes');
        tbody.innerHTML = '';
        
        clientes.forEach(cliente => {
            tbody.innerHTML += `
                <tr>
                    <td>${cliente.customerNameId}</td>
                    <td>${cliente.phoneNumber}</td>
                    <td>${new Date(cliente.registrationDate).toLocaleDateString()}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error cargando clientes", error);
    }
}

async function cargarProveedores() {
    try {
        const proveedores = await api.get('/suppliers'); 
        const tbody = document.getElementById('tabla-proveedores');
        tbody.innerHTML = '';
        
        proveedores.forEach(prov => {
            tbody.innerHTML += `
                <tr>
                    <td>${prov.supplierNameId}</td>
                    <td>${prov.ruc}</td>
                    <td>${prov.phoneNumber}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error cargando proveedores", error);
    }
}