// Variables de entorno para el frontend
// Este archivo detecta automáticamente el entorno y configura la URL del API
(function(window) {
  window.env = window.env || {};

  // Detectar si estamos en localhost o en producción
  const isLocalhost = window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname === '';

  // Configurar URL del API según el entorno
  if (isLocalhost) {
    // Desarrollo local
    window.env.API_URL = 'http://localhost:3000/api';
    console.log('🔧 Modo Desarrollo: Conectando a', window.env.API_URL);
  } else {
    // Producción
    window.env.API_URL = 'https://momentos-con-amor.onrender.com/api';
    console.log('🚀 Modo Producción: Conectando a', window.env.API_URL);
  }
})(this);
