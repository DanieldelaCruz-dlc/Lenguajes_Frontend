// js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Establecer la fecha actual en la cabecera
    const fechaElement = document.getElementById('fecha-actual');
    if (fechaElement) {
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        fechaElement.innerText = new Date().toLocaleDateString('es-ES', opciones);
    }

    // 2. Renderizar el gráfico principal (Chart.js)
    renderizarGraficoPrincipal();

    // 3. Llenar la tabla de Top Productos
    renderizarTopProductos();
});

function renderizarGraficoPrincipal() {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;

    // Configuración para que el gráfico se adapte bien si estás en modo oscuro
    const textColor = document.body.classList.contains('dark-mode') ? '#94a3b8' : '#64748b';
    const gridColor = document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

    new Chart(ctx, {
        type: 'line', // Tipo de gráfico: Línea
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'], // Eje X
            datasets: [
                {
                    label: 'Ingresos ($)',
                    data: [15000, 22000, 18000, 29000, 25000, 32000, 35210],
                    borderColor: '#2563eb', // Azul primario
                    backgroundColor: 'rgba(37, 99, 235, 0.1)', // Fondo semi transparente bajo la línea
                    borderWidth: 3,
                    tension: 0.4, // Suaviza las curvas de la línea
                    fill: true,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#2563eb',
                    pointRadius: 4
                },
                {
                    label: 'Egresos ($)',
                    data: [8000, 9500, 8200, 12000, 10000, 11500, 10390],
                    borderColor: '#ef4444', // Rojo peligro
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#ef4444',
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: textColor, font: { family: 'Inter' } }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleFont: { family: 'Inter' },
                    bodyFont: { family: 'Inter' },
                    padding: 10,
                    cornerRadius: 8
                }
            },
            scales: {
                x: {
                    grid: { color: gridColor, drawBorder: false },
                    ticks: { color: textColor, font: { family: 'Inter' } }
                },
                y: {
                    grid: { color: gridColor, drawBorder: false },
                    ticks: { 
                        color: textColor, 
                        font: { family: 'Inter' },
                        callback: function(value) { return '$' + value; } // Agregar símbolo de dólar al eje Y
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

function renderizarTopProductos() {
    const tbody = document.getElementById('top-productos');
    if (!tbody) return;

    // Datos simulados de los productos más vendidos
    const topProductos = [
        { nombre: 'Laptop Dell Inspiron', precio: 850.00, ventas: 12000, tendencia: 'up', color: 'success' },
        { nombre: 'Monitor Samsung 24"', precio: 180.00, ventas: 8400, tendencia: 'up', color: 'success' },
        { nombre: 'Teclado Mecánico RGB', precio: 65.00, ventas: 3200, tendencia: 'down', color: 'danger' },
        { nombre: 'Mouse Inalámbrico Logitech', precio: 25.50, ventas: 1500, tendencia: 'up', color: 'success' }
    ];

    topProductos.forEach(prod => {
        const iconoTendencia = prod.tendencia === 'up' ? 'bi-graph-up-arrow' : 'bi-graph-down-arrow';
        
        tbody.innerHTML += `
            <tr>
                <td class="ps-4 fw-medium">
                    <div class="d-flex align-items-center">
                        <div class="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                            <i class="bi bi-box-seam text-primary"></i>
                        </div>
                        ${prod.nombre}
                    </div>
                </td>
                <td class="fw-medium">$${prod.precio.toFixed(2)}</td>
                <td><span class="badge bg-secondary bg-opacity-10 text-dark border">${prod.ventas.toLocaleString()} unidades</span></td>
                <td class="text-end pe-4">
                    <i class="bi ${iconoTendencia} text-${prod.color} fs-5"></i>
                </td>
            </tr>
        `;
    });
}