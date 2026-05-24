// js/api.js

// URL base de la API de tus compañeros (cámbiala según lo que ellos te indiquen)
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Función genérica para hacer peticiones al backend de forma limpia.
 * Usamos async/await para que el código sea más legible.
 */
async function apiFetch(endpoint, method = 'GET', body = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            // Aquí luego puedes agregar el token de autorización si hay login
            // 'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }
        
        // Si la respuesta no tiene contenido (ej. un DELETE exitoso), devolvemos null
        if (response.status === 204) return null;
        
        return await response.json();
    } catch (error) {
        console.error("🔥 Error en la API:", error);
        throw error; // Lanzamos el error para manejarlo en la vista correspondiente
    }
}

// Exportamos un objeto con métodos fáciles de usar
const api = {
    get: (endpoint) => apiFetch(endpoint, 'GET'),
    post: (endpoint, body) => apiFetch(endpoint, 'POST', body),
    put: (endpoint, body) => apiFetch(endpoint, 'PUT', body),
    delete: (endpoint) => apiFetch(endpoint, 'DELETE')
};