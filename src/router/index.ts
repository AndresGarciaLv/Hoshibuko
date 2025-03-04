import { useAuthStore } from '@/stores/authStore'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import LoginView from '@/views/LoginView.vue'
import AboutView from '@/views/AboutView.vue'
import RegisterView from '@/views/RegisterView.vue'
import Dashboard from '@/views/Dashboard.vue'
import LibrosView from '@/views/LibrosView.vue'
import CategoriasView from '@/views/CategoriasView.vue'
import AutoresView from '@/views/AutoresView.vue'
import UsuariosView from '@/views/UsuariosView.vue'
import LibrosCategorias from '@/views/LibrosCategorias.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/catalogue', name: 'catalogue', component: LibrosCategorias },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },

    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
        requiredRoles: ['ADMIN'],
      },
    },
    {
      path: '/libros',
      name: 'libros',
      component: LibrosView,
      meta: {
        requiresAuth: true,
        requiredRoles: ['ADMIN'],
      },
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: CategoriasView,
      meta: {
        requiresAuth: true,
        requiredRoles: ['ADMIN'],
      },
    },
    {
      path: '/autores',
      name: 'autores',
      component: AutoresView,
      meta: {
        requiresAuth: true,
        requiredRoles: ['ADMIN'],
      },
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: UsuariosView,
      meta: {
        requiresAuth: true,
        requiredRoles: ['ADMIN'],
      },
    },
  ],
})

// Array de rutas públicas
const publicRoutes = ['home', 'catalogue', 'about', 'login', 'register']

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Si la ruta es pública:
  if (publicRoutes.includes(to.name as string)) {
    // Si el usuario está autenticado y es ADMIN, redirige a dashboard
    if (authStore.isAuthenticated && authStore.user?.roles.includes('ADMIN')) {
      return next({ name: 'dashboard' })
    }
    // Si el usuario está autenticado (y rol USER) y trata de acceder a login o register, redirige a home
    if (
      authStore.isAuthenticated &&
      (to.name === 'login' || to.name === 'register') &&
      !authStore.user?.roles.includes('ADMIN')
    ) {
      return next({ name: 'home' })
    }
    return next()
  }

  // Para rutas protegidas (no públicas):
  // Si no está autenticado, redirige a login
  if (!authStore.isAuthenticated) {
    return next({ name: 'login' })
  }

  // Si la ruta requiere roles específicos, verifica que el usuario tenga alguno
  if (to.meta.requiresAuth && to.meta.requiredRoles && Array.isArray(to.meta.requiredRoles)) {
    const userRoles = authStore.user?.roles ?? []
    const hasRequiredRole = to.meta.requiredRoles.some((role: string) => userRoles.includes(role))
    if (!hasRequiredRole) {
      return next({ name: 'home' })
    }
  }

  next()
})

export default router
