let carrito = [];
let total = 0;

// Esta función simula agregar un producto al carrito
function agregarAlCarrito(id, nombre, precio) {
    // Buscar si ya existe en el carrito
    const item = carrito.find(p => p.id === id);
    if (item) {
        item.cantidad += 1;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1 });
    }
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    const tbody = document.getElementById('carrito-body');
    tbody.innerHTML = '';
    total = 0;

    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        tbody.innerHTML += `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.cantidad} x $${item.precio}</td>
                <td class="text-end">$${subtotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm text-danger" onclick="quitarDelCarrito(${index})">
                        <i class="bi bi-x-circle"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById('total-venta').innerText = `$${total.toFixed(2)}`;
}

function quitarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarritoUI();
}

async function procesarVenta() {
    if (carrito.length === 0) {
        showAlert('El carrito está vacío', 'warning');
        return;
    }

    const payload = {
        items: carrito,
        totalAmount: total,
        paymentMethod: "CASH" // Esto luego puede venir de un select
    };

    try {
        await api.post('/sales', payload);
        showAlert('Venta procesada exitosamente', 'success');
        carrito = []; // Limpiar carrito
        actualizarCarritoUI();
    } catch (error) {
        showAlert('Error al procesar la venta', 'danger');
    }
}