import axios from "axios";

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

// Manejo de respuestas
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error("Sesión expirada. Redirigiendo a login...");
      localStorage.removeItem("token");

    }
    return Promise.reject(error);
  }
);

export default api;
