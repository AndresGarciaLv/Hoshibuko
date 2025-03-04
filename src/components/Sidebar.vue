<template>
  <aside
    class="flex flex-col h-screen w-80"
    :style="{
      backgroundColor: 'var(--body-bg)',
      color: 'var(--body-text)',
      borderRight: '1px solid var(--text-subtle)'
    }"
  >
    <!-- Contenido scrollable: Logo, buscador y menú de opciones -->
    <div class="overflow-y-auto flex-1 p-4">
      <!-- Logo y título -->
      <div class="flex items-center gap-4 mb-8">
        <img src="@/assets/Logo.svg" alt="Hoshibunko Logo" class="w-10 h-10 rounded-full" />
        <div>
          <h3 class="font-bold text-[var(--c-accent)]">Hoshibunko</h3>
          <p class="text-xs" :style="{ color: 'var(--text-subtle)' }">Gestión de Libros</p>
        </div>
        <!-- Botón para modo oscuro -->
        <div class="pl-2 flex justify-center">
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              class="sr-only peer"
               :checked="themeStore.isDark"
      @change="themeStore.toggleTheme()"
            />
            <div
              class="w-14 h-7 bg-white rounded-full border transition-colors relative"
              :style="{ borderColor: 'var(--text-subtle)', backgroundColor: themeStore.isDark ? 'var(--c-bg-3)' : 'var(--body-bg)' }"
            >
              <SunIcon
                v-if="!themeStore.isDark"
                class="absolute left-1 top-1 w-5 h-5 text-gray-600"
              />
              <MoonIcon
                v-else
                class="absolute right-1 top-1 w-5 h-5 text-white"
              />
            </div>
          </label>
        </div>
      </div>

      <!-- Sección del menú principal -->
      <div
        class="p-4"
        :style="{ borderTop: '1px solid var(--text-subtle)' }"
      >
        <h5
          class="uppercase font-semibold text-xs tracking-wider mb-4"
          :style="{ color: 'var(--c-accent)' }"
        >
          Gestión
        </h5>
        <ul class="space-y-2">
          <li>
            <RouterLink
              :to="{ name: 'dashboard' }"
              class="sidebar-link"
            >
              <ChartPieIcon class="w-5 h-5 text-[var(--c-accent)]" />
              <span>Dashboard</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink
              :to="{ name: 'libros' }"
             class="sidebar-link"
            >
              <BookOpenIcon class="w-5 h-5 text-[var(--c-accent)]" />
              <span>Libros</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink
              :to="{ name: 'usuarios' }"
              class="sidebar-link"
            >
              <UserIcon class="w-5 h-5 text-[var(--c-accent)]" />
              <span>Usuarios</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink
              :to="{ name: 'categorias' }"
              class="sidebar-link"
            >
              <TagIcon class="w-5 h-5 text-[var(--c-accent)]" />
              <span>Categorías</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink
              :to="{ name: 'autores' }"
              class="sidebar-link"
            >
              <PencilSquareIcon class="w-5 h-5 text-[var(--c-accent)]" />
              <span>Autores</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- Sección inferior fija: Ajustes, Ayuda y perfil + botón de logout -->
    <div
      class="p-4"
      :style="{ borderTop: '1px solid var(--text-subtle)' }"
    >
      <ul class="mb-4 space-y-2">
        <li>
          <!-- Inserción del componente Profile -->
          <Profile
            :visible="isProfileModalVisible"
            @update:visible="isProfileModalVisible = $event"
          />
        </li>
      </ul>

      <!-- Información de usuario -->
      <div
        class="flex items-center gap-4 pt-4"
        :style="{ borderTop: '1px solid var(--text-subtle)' }"
      >
        <div class="w-10 h-10">
          <img
            src="../assets/avatar-admin.webp"
            alt="Perfil"
            class="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div>
          <h3 class="font-bold">{{ adminName }}</h3>
          <p class="text-xs" :style="{ color: 'var(--text-subtle)' }">{{ adminRole }}</p>
        </div>
      </div>

      <!-- Botón de cerrar sesión -->
      <button
        @click="handleLogout"
        class="flex items-center gap-2 mt-3 w-full px-3 py-2 rounded-md transition-colors cursor-pointer"
        :style="{
          backgroundColor: 'var(--c-accent)',
          color: 'var(--c-white)',
          hover: 'var(--c-info)'
        }"
      >
        <ArrowRightEndOnRectangleIcon class="w-5 h-5" />
        Cerrar Sesión
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, RouterLink } from 'vue-router';

// Importar iconos de Heroicons
import {
  PencilSquareIcon,
  TagIcon,
  BookOpenIcon,
  UserIcon,
  ChartPieIcon,
} from '@heroicons/vue/24/outline';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/vue/24/solid';
import { SunIcon, MoonIcon } from '@heroicons/vue/24/solid';

// Importar componente de perfil y authStore
import Profile from '@/components/Profile.vue';
import { useAuthStore } from '@/stores/authStore';

import { useThemeStore } from '@/stores/themeStore';

const themeStore = useThemeStore();

const isProfileModalVisible = ref(false);

function showProfileModal() {
  isProfileModalVisible.value = true;
}

const authStore = useAuthStore();
const router = useRouter();

const adminName = computed(() => authStore.user?.nombre || 'Administrador');
const adminRole = computed(() => {
  if (!authStore.user || !authStore.user.roles) return '';
  return authStore.user.roles.includes('ADMIN')
    ? 'Administrador'
    : authStore.user.roles.join(', ');
});

function handleLogout() {
  authStore.logout();
  router.push({ name: 'login' });
}

// --- Lógica para dropdowns y otros (si es necesario) ---
const isDropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const isDropdownOpenMobile = ref(false);
const dropdownRefMobile = ref<HTMLElement | null>(null);

function handleClickOutside(event: MouseEvent) {
  if (
    isDropdownOpen.value &&
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target as Node)
  ) {
    isDropdownOpen.value = false;
  }
  if (
    isDropdownOpenMobile.value &&
    dropdownRefMobile.value &&
    !dropdownRefMobile.value.contains(event.target as Node)
  ) {
    isDropdownOpenMobile.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// --- Lógica de autenticación ---
const isAuthenticated = computed(() => !!authStore.token && !!authStore.user);
const userName = computed(() => authStore.user?.nombre || '');
</script>

<style scoped>

</style>

