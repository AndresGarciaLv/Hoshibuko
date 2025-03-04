import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false, // Estado inicial por defecto
  }),

  actions: {
    // Carga la preferencia del localStorage si existe
    loadThemePreference() {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') {
        this.isDark = true;
      } else {
        this.isDark = false;
      }
    },

    // Alterna el modo oscuro/claro y lo guarda en localStorage
    toggleTheme() {
      this.isDark = !this.isDark;
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    },

    // Configura explícitamente el modo oscuro o claro
    setTheme(isDark: boolean) {
      this.isDark = isDark;
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    },
  },
});
