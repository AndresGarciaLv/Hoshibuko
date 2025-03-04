import { defineStore } from "pinia";
import api from "../service/apiService";
import { useRouter } from "vue-router";

interface User {
  id: string;
  username: string;
  email: string;
  nombre: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: localStorage.getItem("token") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
  }),

  getters: {
    // Retorna true si existe token y user
    isAuthenticated(state): boolean {
      return !!state.token && !!state.user;
    },
    // Retorna true si el usuario autenticado tiene el rol solicitado
    hasRole: (state) => (role: string): boolean => {
      return state.user?.roles.includes(role) ?? false;
    },
  },

  actions: {
    async register(nombre: string, username: string, email: string, password: string) {
      try {
        const { data } = await api.post("/Auth/register", {
          nombre,
          username,
          email,
          password,
        });
        this.setAuthData(data.accessToken, data.refreshToken, data.user);
        await this.fetchUserData();
      } catch (error) {
        console.error("Error en el registro:", error);
        throw error;
      }
    },

    async login(username: string, password: string) {
      try {
        const { data } = await api.post("/Auth/login", {
          username,
          password,
        });
        this.setAuthData(data.accessToken, data.refreshToken, data.user);
        await this.fetchUserData();
      } catch (error) {
        console.error("Error en el login:", error);
        throw error;
      }
    },

    async fetchUserData() {
      try {
        if (!this.token) throw new Error("No hay token disponible");
        const { data } = await api.get("/Usuario/me");
        this.user = data;
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    },

    setAuthData(token: string, refreshToken: string, user: User) {
      this.token = token;
      this.refreshToken = refreshToken;
      this.user = user;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      api.defaults.headers.Authorization = `Bearer ${token}`;
    },

    async refreshToken() {
      try {
        if (!this.refreshToken) {
          this.logout();
          return;
        }
        const { data } = await api.post("/Auth/refresh", {
          refreshToken: this.refreshToken,
        });
        this.setAuthData(data.accessToken, data.refreshToken, this.user!);
      } catch (error) {
        console.error("Error en la renovación del token:", error);
        this.logout();
      }
    },

    logout() {

      this.token = null
      this.refreshToken = null
      this.user = null

      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")

      delete api.defaults.headers.Authorization

    },

  },
});
