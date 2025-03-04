import axios from "axios";

// Lee la URL base de las variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_BASE;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    // Puedes procesar la respuesta antes de retornarla, si lo deseas
    return response;
  },
  async (error) => {
    // Si el servidor responde con un código de estado
    if (error.response) {
      // Ejemplo: Manejo de errores por estado
      switch (error.response.status) {
        case 401:
          console.error("Sesión expirada o credenciales inválidas. Redirigiendo a login...");
          // Remueve el token del almacenamiento local
          localStorage.removeItem("token");
          // Opcional: Redirigir a la página de login
          // window.location.href = "/login";
          break;

        case 403:
          console.error("Acceso denegado. No tienes permisos para esta acción.");
          // Aquí podrías mostrar un mensaje al usuario o redirigir a una página de error
          break;

        case 404:
          console.error("Recurso no encontrado (404).");
          // Manejo de error 404, si corresponde
          break;

        case 500:
          console.error("Error interno del servidor (500).");
          // Manejo de error 500
          break;

        default:
          // Manejo de otros códigos de error
          console.error(`Error no manejado: ${error.response.status}`);
          break;
      }
    } else {
      // Si el error no tiene respuesta (por ejemplo, no hay conexión)
      console.error("No se pudo conectar con el servidor o error de red.");
    }

    // Rechaza la promesa para que el servicio (o componente) que llamó a la API
    // maneje el error con un catch o un throw.
    return Promise.reject(error);
  }
);

export default api;
