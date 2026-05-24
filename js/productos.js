// Se ejecuta cuando el HTML ha cargado completamente
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
});

// Función para obtener productos del backend
async function cargarProductos() {
    try {
        // Usa la función 'api.get' que creamos en api.js
        const productos = await api.get('/products');
        const tbody = document.getElementById('tabla-productos');
        tbody.innerHTML = ''; // Limpiar tabla

        if (productos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center">No hay productos registrados.</td></tr>`;
            return;
        }

        // Iterar sobre los productos y crear filas
        productos.forEach(prod => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${prod.productNameId}</td>
                <td><strong>${prod.name || 'Sin nombre'}</strong></td>
                <td>$${prod.price}</td>
                <td>
                    <span class="badge ${prod.stock < prod.reorderLevel ? 'bg-danger' : 'bg-success'}">
                        ${prod.stock}
                    </span>
                </td>
                <td>${prod.category || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto('${prod.productNameId}')"><i class="bi bi-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        showAlert('Error al cargar los productos', 'danger');
    }
}

// Función para guardar un nuevo producto
async function guardarProducto() {
    const nombre = document.getElementById('prod-nombre').value;
    const precio = document.getElementById('prod-precio').value;
    const stock = document.getElementById('prod-stock').value;

    const nuevoProducto = {
        name: nombre,
        price: parseFloat(precio),
        stock: parseFloat(stock)
    };

    try {
        await api.post('/products', nuevoProducto);
        showAlert('Producto guardado correctamente', 'success');
        
        // Cerrar el modal usando la API de Bootstrap
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalProducto'));
        modal.hide();
        
        // Recargar la tabla
        cargarProductos();
    } catch (error) {
        showAlert('Error al guardar el producto', 'danger');
    }
}