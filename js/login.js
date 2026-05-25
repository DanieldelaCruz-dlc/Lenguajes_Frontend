// js/login.js

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('minerva_token')) {
        window.location.replace('index.html');
    }
});

document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault();

    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');

    // Validación basada en roles simulada
    if (user === 'admin' && pass === '1234') {
        localStorage.setItem('minerva_token', 'token-valido');
        localStorage.setItem('minerva_usuario', user);
        localStorage.setItem('minerva_rol', 'ADMIN');
        window.location.replace('index.html');
    } else if (user === 'operador' && pass === '1234') {
        localStorage.setItem('minerva_token', 'token-valido');
        localStorage.setItem('minerva_usuario', user);
        localStorage.setItem('minerva_rol', 'OPERADOR');
        window.location.replace('index.html');
    } else {
        errorMsg.classList.remove('d-none');
    }
});