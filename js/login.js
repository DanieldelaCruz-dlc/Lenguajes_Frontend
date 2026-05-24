// js/login.js

document.addEventListener('DOMContentLoaded', () => {
    // Si el usuario ya está logueado y entra a login.html por error, lo mandamos al dashboard
    if (localStorage.getItem('minerva_token')) {
        window.location.href = 'index.html';
    }
});

document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');

    try {
        // AQUÍ ES DONDE TE CONECTARÁS AL BACKEND EN EL FUTURO:
        // const respuesta = await api.post('/auth/login', { username: user, password: pass });
        
        // POR AHORA: Simulación de validación (borra esto cuando conectes la API real)
        if (user === 'admin' && pass === '1234') {
            
            // 1. Guardamos un "token" o llave en el navegador del usuario
            localStorage.setItem('minerva_token', 'token-simulado-aprobado');
            localStorage.setItem('minerva_usuario', user);
            
            // 2. Redirigimos al Dashboard Principal
            window.location.href = 'index.html';
            
        } else {
            // Mostrar error
            errorMsg.classList.remove('d-none');
        }
    } catch (error) {
        console.error("Error en autenticación:", error);
        errorMsg.textContent = "Error al intentar conectar con el servidor.";
        errorMsg.classList.remove('d-none');
    }
});