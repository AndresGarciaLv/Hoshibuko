import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
// Importa el CSS base de PrimeVue y los PrimeIcons
const app = createApp(App)

app.use(createPinia());
app.use(router);
import Lara from '@primeuix/themes/lara';



app.use(router)
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: Lara,
    options: {
      // Usa una clase personalizada para activar el modo oscuro.
      // Cuando el elemento raíz tenga la clase .app-dark, PrimeVue aplicará los tokens de dark mode.
      darkModeSelector: '.app-dark'
    }
  }
})

app.mount('#app')
