<template>
  <aside class="flex flex-col h-screen w-80 bg-white border-r border-gray-200">
    <!-- Contenido scrollable: Logo, buscador y menú de opciones -->
    <div class="overflow-y-auto flex-1 p-4">
      <!-- Logo y título -->
      <div class="flex items-center gap-4 mb-8">
        <img src="@/assets/Logo.svg" alt="Hoshibunko Logo" class="w-10 h-10" />
        <div>
          <h3 class="font-bold text-[var(--c-accent)]">Hoshibunko</h3>
          <p class="text-xs text-gray-500">Gestión de Libros</p>
        </div>
      </div>
      <div class="p-4 border-t border-gray-300">

    </div>

      <!-- Menú principal (Gestión) -->
      <h5 class="uppercase font-semibold text-xs text-[var(--c-accent)] tracking-wider mb-4 ">
        Gestión
      </h5>
      <ul class="space-y-2">
        <li>
          <RouterLink
            :to="{ name: 'dashboard' }"
            class="flex items-center gap-4 p-2 hover:bg-gray-100 transition-colors rounded-lg"
          >
            <ChartPieIcon class="w-5 h-5 text-[var(--c-accent)]" />
            <span>Dashboard</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'libros' }"
            class="flex items-center gap-4 p-2 hover:bg-gray-100 transition-colors rounded-lg"
          >
            <BookOpenIcon class="w-5 h-5 text-[var(--c-accent)]" />
            <span>Libros</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/admin/usuario"
            class="flex items-center gap-4 p-2 hover:bg-gray-100 transition-colors rounded-lg"
          >
            <UserIcon class="w-5 h-5 text-[var(--c-accent)]" />
            <span>Usuarios</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'categorias' }"
            class="flex items-center gap-4 p-2 hover:bg-gray-100 transition-colors rounded-lg"
          >
            <TagIcon class="w-5 h-5 text-[var(--c-accent)]" />
            <span>Categorías</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'autores' }"
            class="flex items-center gap-4 p-2 hover:bg-gray-100 transition-colors rounded-lg"
          >
            <PencilSquareIcon class="w-5 h-5 text-[var(--c-accent)]" />
            <span>Autores</span>
          </RouterLink>
        </li>

      </ul>
      <!-- Se pueden agregar más secciones si es necesario -->
    </div>

    <!-- Sección inferior fija: Ajustes, Ayuda y perfil + botón de logout -->
    <div class="p-4 border-t border-gray-300">
      <ul class="mb-4 space-y-2">
        <li>
          <RouterLink
            to="#"
            class="flex items-center gap-4 p-2 hover:bg-gray-100 transition-colors rounded-lg"
          >
            <Cog6ToothIcon class="w-5 h-5 text-[var(--c-accent)]" />
            <span>Perfil</span>
          </RouterLink>
        </li>
      </ul>
      <!-- Información de usuario -->
      <div class="flex items-center gap-4 pt-4 border-t border-gray-300">
        <div class="w-10 h-10">
          <img
            src="../assets/avatar-admin.webp"
            alt="Perfil"
            class="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div>
          <h3 class="font-bold">{{ adminName }}</h3>
          <p class="text-xs text-gray-500">{{ adminRole }}</p>
        </div>
      </div>
      <!-- Botón de cerrar sesión -->
      <button
        @click="handleLogout"
        class="flex items-center gap-2 mt-3 w-full px-3 py-2 bg-[var(--c-accent)] text-white rounded-md hover:bg-[var(--c-info)] transition-colors cursor-pointer"
      >
        <ArrowRightEndOnRectangleIcon class="w-5 h-5" />
        Cerrar Sesión
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, RouterLink } from 'vue-router';

// Importar iconos de heroicons (outline)
import {
  PencilSquareIcon,
  TagIcon,
  BookOpenIcon,
  PhotoIcon,
  UserIcon,
  Cog6ToothIcon,
  ChartPieIcon,
} from '@heroicons/vue/24/outline';
// Importar icono de logout (solid)
import { ArrowRightEndOnRectangleIcon, ChartBarIcon, ChartBarSquareIcon } from '@heroicons/vue/24/solid';

// Importamos el authStore para acceder a los datos del usuario autenticado
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();

// Computed que retorna el nombre del administrador o un valor por defecto
const adminName = computed(() => authStore.user?.nombre || 'Administrador');

// Computed que verifica el rol y retorna "Administrador" si es ADMIN
const adminRole = computed(() => {
  // Verifica que exista el usuario y su array de roles
  if (!authStore.user || !authStore.user.roles) return ''

  // Si el array de roles incluye "ADMIN", retornamos "Administrador"
  if (authStore.user.roles.includes('ADMIN')) {
    return 'Administrador'
  }

  // Si quisieras manejar otros roles, podrías usar la misma lógica o simplemente
  // retornar los roles en un formato de texto:
  return authStore.user.roles.join(', ')
})


// Función para cerrar sesión y redirigir al login
function handleLogout() {
  authStore.logout();
  router.push({ name: 'login' });
}

</script>

<style scoped>
/* Puedes agregar estilos adicionales si lo requieres */
</style>
