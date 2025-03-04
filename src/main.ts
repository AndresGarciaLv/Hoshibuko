import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/main.css'

// PrimeVue Config
import PrimeVue from 'primevue/config'

// Servicios de Toast y otros
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'

// IMPORTA AQUÍ TODOS LOS COMPONENTES QUE USES
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect';
import Select from 'primevue/select';


import AutoComplete from 'primevue/autocomplete';

import 'primeicons/primeicons.css';

// Si usas el nuevo sistema de theming con Lara, importas y configuras
import Lara from '@primeuix/themes/lara'

// Creación de la app
const app = createApp(App)

app.use(createPinia())
app.use(router)

// Config de PrimeVue
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: Lara,
    options: {
      darkModeSelector: '.app-dark'
    }
  }
})

// Usar ToastService
app.use(ToastService)

// REGISTRO GLOBAL DE COMPONENTES
app.component('Dialog', Dialog)
app.component('Textarea', Textarea)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Toolbar', Toolbar)
app.component('Button', Button)
app.component('FileUpload', FileUpload)
app.component('InputText', InputText)
app.component('PrimeToast', Toast)
app.component('AutoComplete', AutoComplete)
app.component('MultiSelect', MultiSelect)
app.component('Select', Select)

// Montar la app
app.mount('#app')
