// js/ventas.js

// Simulamos la base de datos de productos
const inventarioPOS = [
    { id: 1, nombre: 'Laptop Dell Inspiron', precio: 850.00, stock: 15 },
    { id: 2, nombre: 'Mouse Inalámbrico Logitech', precio: 25.50, stock: 50 },
    { id: 3, nombre: 'Monitor Samsung 24"', precio: 180.00, stock: 8 },
    { id: 4, nombre: 'Teclado Mecánico RGB', precio: 65.00, stock: 12 },
    { id: 5, nombre: 'Cable HDMI 2m', precio: 8.00, stock: 30 },
    { id: 6, nombre: 'Hub USB-C Multipuerto', precio: 35.00, stock: 0 } // Producto sin stock de prueba
];

let carrito = [];
let totales = { subtotal: 0, igv: 0, total: 0 };
let modalBoleta;

document.addEventListener('DOMContentLoaded', () => {
    modalBoleta = new bootstrap.Modal(document.getElementById('modalBoleta'));
    
    // Renderizar catálogo completo al iniciar
    renderizarCatálogoPOS('');

    // Escuchar la barra de búsqueda para filtrar
    const inputBusqueda = document.getElementById('buscar-prod');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', (e) => {
            renderizarCatálogoPOS(e.target.value);
        });
    }
});

// 1. RENDERIZAR Y FILTRAR CATÁLOGO
function renderizarCatálogoPOS(filtro) {
    const contenedor = document.getElementById('lista-busqueda');
    contenedor.innerHTML = '';

    const termino = filtro.trim().toLowerCase();
    
    // Filtrar inventario si hay texto, si no, mostrarlos todos
    const resultados = inventarioPOS.filter(prod => 
        prod.nombre.toLowerCase().includes(termino)
    );

    if (resultados.length === 0) {
        contenedor.innerHTML = `<div class="p-4 text-center text-muted">No se encontraron productos coincidentes.</div>`;
        return;
    }

    resultados.forEach(prod => {
        const sinStock = prod.stock <= 0;
        const opacidad = sinStock ? 'opacity-50' : '';
        const badgeColor = sinStock ? 'bg-danger' : 'bg-primary';

        contenedor.innerHTML += `
            <div class="list-group-item d-flex justify-content-between align-items-center py-3 ${opacidad}">
                <div>
                    <h6 class="mb-1 fw-bold">${prod.nombre}</h6>
                    <div class="text-success fw-medium">$${prod.precio.toFixed(2)} <span class="badge ${badgeColor} ms-2">Stock: ${prod.stock}</span></div>
                </div>
                
                <div class="d-flex align-items-center gap-2">
                    <input type="number" id="qty-prod-${prod.id}" class="form-control text-center" 
                           value="1" min="1" max="${prod.stock}" style="width: 70px;" ${sinStock ? 'disabled' : ''}>
                    
                    <button class="btn btn-primary" onclick="agregarAlCarritoDesdeCatalogo(${prod.id})" 
                            ${sinStock ? 'disabled' : ''} title="Agregar al carrito">
                        <i class="bi bi-cart-plus"></i>
                    </button>
                </div>
            </div>
        `;
    });
}

// 2. AGREGAR AL CARRITO (Con cantidad específica)
function agregarAlCarritoDesdeCatalogo(idProducto) {
    const producto = inventarioPOS.find(p => p.id === idProducto);
    if (!producto) return;

    // Leer la cantidad seleccionada en el input
    const inputQty = document.getElementById(`qty-prod-${idProducto}`);
    const cantidadA_Agregar = parseInt(inputQty.value);

    if (isNaN(cantidadA_Agregar) || cantidadA_Agregar <= 0) {
        showAlert('Ingresa una cantidad válida.', 'warning');
        return;
    }

    // Verificar si el producto ya está en el carrito
    const itemEnCarrito = carrito.find(item => item.id === idProducto);
    const cantidadActualEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
    const nuevaCantidadTotal = cantidadActualEnCarrito + cantidadA_Agregar;

    if (nuevaCantidadTotal > producto.stock) {
        showAlert(`Stock insuficiente. Solo quedan ${producto.stock - cantidadActualEnCarrito} unidades disponibles para agregar.`, 'danger');
        return;
    }

    if (itemEnCarrito) {
        itemEnCarrito.cantidad = nuevaCantidadTotal;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: cantidadA_Agregar,
            stockMaximo: producto.stock
        });
    }

    // Restablecer el input a 1 por comodidad
    inputQty.value = 1;
    
    actualizarTicketUI();
}

// 3. ACTUALIZAR INTERFAZ DEL TICKET Y CÁLCULOS
function actualizarTicketUI() {
    const tbody = document.getElementById('carrito-body');
    tbody.innerHTML = '';
    
    let subtotalPuro = 0;

    if (carrito.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-5"><i class="bi bi-cart-x fs-2 d-block mb-2"></i>El carrito está vacío</td></tr>`;
        document.getElementById('subtotal-venta').innerText = `$0.00`;
        document.getElementById('igv-venta').innerText = `$0.00`;
        document.getElementById('total-venta').innerText = `$0.00`;
        return;
    }

    carrito.forEach((item, index) => {
        const subtotalItem = item.precio * item.cantidad;
        subtotalPuro += subtotalItem;

        tbody.innerHTML += `
            <tr>
                <td class="fw-medium" style="width: 50%; font-size: 0.9rem;">${item.nombre}</td>
                <td style="width: 25%;">
                    <div class="input-group input-group-sm">
                        <button class="btn btn-outline-secondary px-2" type="button" onclick="cambiarCantidadCarrito(${index}, -1)">-</button>
                        <input type="text" class="form-control text-center px-0 bg-transparent" value="${item.cantidad}" readonly>
                        <button class="btn btn-outline-secondary px-2" type="button" onclick="cambiarCantidadCarrito(${index}, 1)">+</button>
                    </div>
                </td>
                <td class="text-end fw-medium" style="width: 20%; font-size: 0.9rem;">$${subtotalItem.toFixed(2)}</td>
                <td class="text-end" style="width: 5%;">
                    <button class="btn btn-sm text-danger px-1" onclick="quitarDelCarrito(${index})"><i class="bi bi-x-lg"></i></button>
                </td>
            </tr>
        `;
    });

    // Calcular totales (Simulando IGV del 18%)
    totales.subtotal = subtotalPuro / 1.18;
    totales.igv = subtotalPuro - totales.subtotal;
    totales.total = subtotalPuro;

    document.getElementById('subtotal-venta').innerText = `$${totales.subtotal.toFixed(2)}`;
    document.getElementById('igv-venta').innerText = `$${totales.igv.toFixed(2)}`;
    document.getElementById('total-venta').innerText = `$${totales.total.toFixed(2)}`;
}

// 4. MODIFICAR CANTIDADES DENTRO DEL CARRITO
function cambiarCantidadCarrito(index, cambio) {
    const item = carrito[index];
    const nuevaCantidad = item.cantidad + cambio;

    if (nuevaCantidad <= 0) {
        quitarDelCarrito(index);
    } else if (nuevaCantidad > item.stockMaximo) {
        showAlert(`Stock máximo alcanzado (${item.stockMaximo} unid.)`, 'warning');
    } else {
        item.cantidad = nuevaCantidad;
        actualizarTicketUI();
    }
}

function quitarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarTicketUI();
}

function vaciarCarrito() {
    if (carrito.length > 0 && confirm('¿Estás seguro de vaciar todo el carrito?')) {
        carrito = [];
        actualizarTicketUI();
    }
}

// 5. PROCESAR VENTA Y GENERAR BOLETA
function procesarVenta() {
    if (carrito.length === 0) {
        showAlert('No hay productos en el carrito.', 'danger');
        return;
    }

    const btnPago = document.getElementById('btn-procesar');
    const textoOriginal = btnPago.innerHTML;
    btnPago.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Procesando pago...';
    btnPago.disabled = true;

    // Simulamos el tiempo de respuesta del servidor (Backend)
    setTimeout(() => {
        // Reducir stock lógico
        carrito.forEach(item => {
            const prod = inventarioPOS.find(p => p.id === item.id);
            if(prod) prod.stock -= item.cantidad;
        });

        // Generar el HTML de la Boleta
        generarBoletaHTML();

        // Mostrar Modal de la boleta
        modalBoleta.show();

        // Limpiar carrito y resetear vista
        carrito = [];
        actualizarTicketUI();
        renderizarCatálogoPOS(document.getElementById('buscar-prod').value); // Refresca los badges de stock
        
        btnPago.innerHTML = textoOriginal;
        btnPago.disabled = false;
        
    }, 1000);
}

// 6. DIBUJAR LA BOLETA (Formato Ticket)
function generarBoletaHTML() {
    const contenedor = document.getElementById('contenido-boleta');
    const fecha = new Date();
    const numeroBoleta = Math.floor(Math.random() * 900000) + 100000; // Número aleatorio de 6 dígitos
    const cajero = localStorage.getItem('minerva_usuario') || 'Cajero 1';

    let htmlItems = '';
    carrito.forEach(item => {
        const sub = (item.precio * item.cantidad).toFixed(2);
        htmlItems += `
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 2px;">
                <span style="text-align: left; width: 60%;">${item.cantidad}x ${item.nombre.substring(0, 15)}</span>
                <span style="width: 20%;">$${item.precio.toFixed(2)}</span>
                <span style="text-align: right; width: 20%;">$${sub}</span>
            </div>
        `;
    });

    contenedor.innerHTML = `
        <div style="color: black;">
            <h4 class="fw-bold mb-0">MINERVA S.A.C.</h4>
            <small>Av. Principal 123, Ciudad</small><br>
            <small>RUC: 20123456789</small>
            <div style="border-bottom: 1px dashed black; margin: 10px 0;"></div>
            
            <div style="text-align: left; font-size: 0.85rem;">
                <strong>BOLETA ELECTRÓNICA</strong><br>
                Nro: B001-${numeroBoleta}<br>
                Fecha: ${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}<br>
                Cajero: ${cajero.toUpperCase()}
            </div>
            
            <div style="border-bottom: 1px dashed black; margin: 10px 0;"></div>
            
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: bold; margin-bottom: 5px;">
                <span style="text-align: left; width: 60%;">DESCRIPCIÓN</span>
                <span style="width: 20%;">P.U</span>
                <span style="text-align: right; width: 20%;">IMP.</span>
            </div>
            
            ${htmlItems}
            
            <div style="border-bottom: 1px dashed black; margin: 10px 0;"></div>
            
            <div style="text-align: right; font-size: 0.9rem;">
                Subtotal: $${totales.subtotal.toFixed(2)}<br>
                IGV (18%): $${totales.igv.toFixed(2)}<br>
                <strong style="font-size: 1.1rem;">TOTAL: $${totales.total.toFixed(2)}</strong>
            </div>
            
            <div style="border-bottom: 1px dashed black; margin: 10px 0;"></div>
            <small>¡Gracias por su compra!</small>
        </div>
    `;
}