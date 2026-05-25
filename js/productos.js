// js/productos.js

// Base de datos simulada de productos
let productosDB = [
    { id: 1, nombre: 'Laptop Dell Inspiron', precio: 850.00, stock: 15, categoria: 'Electrónica' },
    { id: 2, nombre: 'Mouse Inalámbrico Logitech', precio: 25.50, stock: 50, categoria: 'Accesorios' },
    { id: 3, nombre: 'Monitor Samsung 24"', precio: 180.00, stock: 8, categoria: 'Electrónica' }
];

let modalProducto; // Variable para controlar el modal de Bootstrap

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la instancia del Modal de Bootstrap
    const modalElement = document.getElementById('modalProducto');
    if (modalElement) {
        modalProducto = new bootstrap.Modal(modalElement);
    }
    
    renderizarTablaProductos();
});

// 1. LEER: Mostrar productos en la tabla
function renderizarTablaProductos() {
    const tbody = document.getElementById('tabla-productos');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (productosDB.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No hay productos registrados.</td></tr>`;
        return;
    }

    productosDB.forEach(prod => {
        // Lógica visual para el stock
        let badgeStockClass = 'bg-success';
        if (prod.stock === 0) badgeStockClass = 'bg-danger';
        else if (prod.stock <= 10) badgeStockClass = 'bg-warning text-dark';

        tbody.innerHTML += `
            <tr>
                <td>PROD-${prod.id.toString().padStart(4, '0')}</td>
                <td class="fw-bold">${prod.nombre}</td>
                <td>$${prod.precio.toFixed(2)}</td>
                <td><span class="badge ${badgeStockClass}">${prod.stock}</span></td>
                <td>${prod.categoria || 'General'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" title="Editar" onclick="abrirModalEditarProducto(${prod.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" title="Eliminar" onclick="eliminarProducto(${prod.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// 2. PREPARAR CREACIÓN
// Reemplaza el onclick de tu botón "Nuevo Producto" en el HTML para llamar a esta función
function abrirModalCrearProducto() {
    document.getElementById('form-producto').reset();
    
    // Si no tienes este input oculto en tu HTML, lo crearemos dinámicamente o lo ignoramos
    const idInput = document.getElementById('prod-id');
    if(idInput) idInput.value = ''; 
    
    document.querySelector('#modalProducto .modal-title').innerText = 'Registrar Nuevo Producto';
    modalProducto.show();
}

// 3. PREPARAR EDICIÓN
function abrirModalEditarProducto(id) {
    const producto = productosDB.find(p => p.id === id);
    if (!producto) return;

    // Llenar el formulario con los datos actuales
    // Nota: Asegúrate de tener un <input type="hidden" id="prod-id"> en tu HTML de productos
    let idInput = document.getElementById('prod-id');
    if (!idInput) {
        // Lo inyectamos si no existe
        document.getElementById('form-producto').insertAdjacentHTML('afterbegin', '<input type="hidden" id="prod-id">');
        idInput = document.getElementById('prod-id');
    }
    
    idInput.value = producto.id;
    document.getElementById('prod-nombre').value = producto.nombre;
    document.getElementById('prod-precio').value = producto.precio;
    document.getElementById('prod-stock').value = producto.stock;
    
    document.querySelector('#modalProducto .modal-title').innerText = 'Editar Producto';
    modalProducto.show();
}

// 4. GUARDAR (Crear o Editar)
function guardarProducto() {
    const idInput = document.getElementById('prod-id');
    const id = idInput ? idInput.value : '';
    const nombre = document.getElementById('prod-nombre').value.trim();
    const precio = parseFloat(document.getElementById('prod-precio').value);
    const stock = parseInt(document.getElementById('prod-stock').value);

    if (!nombre || isNaN(precio) || isNaN(stock)) {
        showAlert('Por favor, completa todos los campos correctamente.', 'warning');
        return;
    }

    if (id === '') {
        // CREAR NUEVO
        const nuevoId = productosDB.length > 0 ? Math.max(...productosDB.map(p => p.id)) + 1 : 1;
        productosDB.push({
            id: nuevoId,
            nombre: nombre,
            precio: precio,
            stock: stock,
            categoria: 'General'
        });
        showAlert('Producto registrado exitosamente.', 'success');
    } else {
        // EDITAR EXISTENTE
        const index = productosDB.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            productosDB[index].nombre = nombre;
            productosDB[index].precio = precio;
            productosDB[index].stock = stock;
            showAlert('Producto actualizado correctamente.', 'info');
        }
    }

    renderizarTablaProductos();
    modalProducto.hide();
}

// 5. ELIMINAR
function eliminarProducto(id) {
    const producto = productosDB.find(p => p.id === id);
    if (confirm(`¿Estás seguro de eliminar el producto "${producto.nombre}"? Esta acción no se puede deshacer.`)) {
        productosDB = productosDB.filter(p => p.id !== id);
        renderizarTablaProductos();
        showAlert('Producto eliminado del inventario.', 'success');
    }
}