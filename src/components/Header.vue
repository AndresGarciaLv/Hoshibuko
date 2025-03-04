<template>
  <!-- Contenedor flotante con transición y blur -->
  <div
    :class="[
      'fixed top-0 w-full z-50 transition-transform duration-300 rouded rounded-full',
      isHeaderHidden ? '-translate-y-full' : 'translate-y-0'
    ]"
  >
    <!-- Contenedor hijo con el borde y fondo blanco (modo claro por defecto) -->
    <div
      class="max-w-[1500px] mt-5 mx-auto px-5 py-4
             flex items-center justify-between
             border border-gray-300 rounded-full
             bg-white"
    >
      <!-- Logo e Identidad -->
      <div class="flex-1 flex items-center justify-start space-x-2 pl-5 cursor-pointer">
        <img
          src="@/assets/Logo.svg"
          alt="HoshiBunko Logo"
          class="w-10 h-10 rounded-full"
        />
        <span class="text-[var(--c-accent)] pl-2 font-bold text-xl">
          HoshiBunko
        </span>
      </div>

      <!-- Botón hamburguesa (visible en móvil) -->
      <button
        @click="toggleMenu"
        class="md:hidden text-[#03045E] hover:text-[#0077B6] transition-colors cursor-pointer"
      >
        <!-- Ícono hamburguesa (cuando isMenuOpen es false) -->
        <template v-if="!isMenuOpen">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </template>
        <!-- Ícono de 'X' (cuando isMenuOpen es true) -->
        <template v-else>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </template>
      </button>

      <!-- Navegación (oculta en móvil, visible en escritorio) -->
      <nav class="hidden md:flex items-center justify-center space-x-10 text-[#03045E] bg-white/90">
        <RouterLink
          class="hover:text-[#0077B6] transition-colors text-lg"
          :to="{ name: 'home' }"
        >
          Inicio
        </RouterLink>
        <RouterLink
          class="hover:text-[#0077B6] transition-colors text-lg"
          :to="{ name: 'catalogue' }"
        >
          Catálogo
        </RouterLink>

        <RouterLink
          class="hover:text-[#0077B6] transition-colors text-lg"
          :to="{ name: 'about' }"
        >
          Sobre Nosotros
        </RouterLink>
      </nav>

      <!-- Botones de acción (versión escritorio) -->
      <div class="hidden md:flex-1 md:flex items-center justify-end space-x-3 pr-5">
        <!-- Dropdown condicional según autenticación -->
        <template v-if="!isAuthenticated">
          <!-- Botón "Únete" para usuarios no autenticados -->
          <div class="relative" ref="dropdownRef">
            <button
              @click="toggleDropdown"
              class="flex px-4 py-2 rounded-full bg-[#0096C7] text-white
                     hover:bg-[#0077B6] transition-colors cursor-pointer text-lg"
            >
              Únete
              <svg
                class="w-[20px] h-[20px] ml-2 transition-transform"
                :class="{ 'rotate-180': isDropdownOpen }"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0
                     111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                />
              </svg>
            </button>

            <transition
              enter-active-class="transition-opacity duration-200 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-opacity duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div
                v-if="isDropdownOpen"
                class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 border border-gray-200"
              >
                <RouterLink
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition"
                  :to="{ name: 'login' }"
                >
                  Iniciar Sesión
                </RouterLink>
                <RouterLink
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition"
                  :to="{ name: 'register' }"
                >
                  Registrarse
                </RouterLink>
              </div>
            </transition>
          </div>
        </template>

        <template v-else>
          <!-- Dropdown para usuario autenticado -->
          <div class="relative" ref="dropdownRef">
            <button
              @click="toggleDropdown"
              class="flex items-center px-2 py-2 rounded-full bg-white hover:bg-gray-300 transition-colors cursor-pointer"
            >
              <!-- Placeholder de Avatar (puedes reemplazar con una imagen real) -->
              <img
                src="../assets/avatar.png"
                alt="Avatar"
                class="w-8 h-8 rounded-full"
              />
              <svg
                class="w-5 h-5 ml-2 transition-transform text-[var(--c-primary)]"
                :class="{ 'rotate-180': isDropdownOpen }"
                fill="text-[var(--c-primary)]"
                viewBox="0 0 20 20"
              >
                <path
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0
                     111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                />
              </svg>
            </button>

            <transition
              enter-active-class="transition-opacity duration-200 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-opacity duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div
                v-if="isDropdownOpen"
                class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 border border-gray-200"
              >
                <!-- Nombre del usuario -->
                <div class="block px-4 py-2 text-gray-700 font-semibold">
                  {{ userName }}
                </div>
                <ProfileUser
      :visible="isProfileModalVisible"
      @update:visible="isProfileModalVisible = $event"
    />
                <div
                  class="text-gray-700 flex p-3 items-center cursor-pointer hover:bg-gray-200"
                  @click="goToLikes"
                >
                <BookOpenIcon class="w-5 h-5 mr-2 text-[var(--c-accent)]" />
                  Mis Libros
                </div>
                <div
                  class="text-gray-700 flex p-3 items-center cursor-pointer hover:bg-gray-200"
                  @click="handleLogout"
                >
                <ArrowRightEndOnRectangleIcon class="w-5 h-5 mr-2 text-[var(--c-accent)]" />
                  Cerrar Sesión
                </div>
              </div>
            </transition>
          </div>
        </template>

        <!-- Checkbutton para modo claro/oscuro -->
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
    </div>

    <!-- Menú desplegable en móvil con animación -->
    <transition
      enter-active-class="transition transform duration-300"
      enter-from-class="opacity-0 translate-y-5"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition transform duration-300"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-5"
    >
      <div
        v-if="isMenuOpen"
        class="md:hidden px-4 pb-4 bg-white/90 backdrop-blur-md"
      >
        <nav class="flex flex-col space-y-3 items-center text-[#03045E]">
          <RouterLink
            class="hover:text-[#0077B6] transition-all mt-2 p-2 cursor-pointer text-lg hover:text-xl"
            :to="{ name: 'home' }"
          >
            Inicio
          </RouterLink>
          <RouterLink
            class="hover:text-[#0077B6] transition-all mt-2 p-2 cursor-pointer text-lg hover:text-xl"
            :to="{ name: 'catalogue' }"
          >
            Catálogo
          </RouterLink>
          <RouterLink
            class="hover:text-[#0077B6] transition-all mt-2 p-2 cursor-pointer text-lg hover:text-xl"
            :to="{ name: 'about' }"
          >
            Sobre Nosotros
          </RouterLink>
        </nav>

        <!-- Versión móvil del dropdown / botones de acción -->
        <div class="grid grid-cols-2 gap-2 p-4 mt-2">
          <template v-if="!isAuthenticated">
            <!-- Botón "Únete" en móvil -->
            <div class="relative" ref="dropdownRefMobile">
              <button
                @click="toggleDropdownMobile"
                class="px-4 py-2 rounded-full text-[#03045E] hover:bg-gray-300 transition-colors cursor-pointer text-lg flex items-center gap-2"
              >
                Únete
                <svg
                  class="w-4 h-4 transition-transform"
                  :class="{ 'rotate-180': isDropdownOpenMobile }"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0
                       111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0
                       010-1.414z"
                  />
                </svg>
              </button>

              <transition
                enter-active-class="transition-opacity duration-200 ease-out"
                enter-from-class="opacity-0 translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-opacity duration-150 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-2"
              >
                <div
                  v-if="isDropdownOpenMobile"
                  class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 border border-gray-200"
                >
                  <RouterLink
                    class="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition"
                    :to="{ name: 'login' }"
                  >
                    Iniciar Sesión
                  </RouterLink>
                  <RouterLink
                    class="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition"
                    :to="{ name: 'register' }"
                  >
                    Registrarse
                  </RouterLink>
                </div>
              </transition>
            </div>
          </template>
          <template v-else>
            <!-- Avatar en móvil -->
            <div class="relative" ref="dropdownRefMobile">
              <button
                @click="toggleDropdownMobile"
                class="flex items-center px-2 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"
              >
                <img
                  src="../assets/avatar.png"
                  alt="tss"
                  class="w-[20px] rounded-full"
                />
                <svg
                  class="w-4 h-4 ml-2 transition-transform"
                  :class="{ 'rotate-180': isDropdownOpenMobile }"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1
                       0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1
                       1 0 010-1.414z"
                  />
                </svg>
              </button>
              <transition
                enter-active-class="transition-opacity duration-200 ease-out"
                enter-from-class="opacity-0 translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-opacity duration-150 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-2"
              >
                <div
                  v-if="isDropdownOpenMobile"
                  class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 border border-gray-200"
                >
                  <div class="block px-4 py-2 text-gray-700 font-semibold">
                    {{ userName }}
                  </div>
                  <div
                    class="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                    @click="goToProfile"
                  >
                    Perfil
                  </div>
                  <div
                    class="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                    @click="goToLikes"
                  >
                    Me Gustas
                  </div>
                  <div
                    class="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                    @click="handleLogout"
                  >
                    Cerrar Sesión
                  </div>
                </div>
              </transition>
            </div>
          </template>

          <!-- Versión móvil del checkbutton -->
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
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { SunIcon, MoonIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/vue/24/solid'
import {
  BookOpenIcon,
} from '@heroicons/vue/24/outline';
import ProfileUser from '@/components/ProfileUser.vue';
import { useThemeStore } from '@/stores/themeStore';

const themeStore = useThemeStore();

const isProfileModalVisible = ref(false);

// Función que se llama cuando se hace click en "Perfil" del sidebar
function showProfileModal() {
  isProfileModalVisible.value = true;
}

// Importamos nuestro authStore
import { useAuthStore } from '@/stores/authStore'

// Estado para mostrar/ocultar el menú hamburguesa
const isMenuOpen = ref(false)
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

// Control de visibilidad del header al hacer scroll
const isHeaderHidden = ref(false)
const lastScrollTop = ref(0)
function handleScroll() {
  const st = window.pageYOffset || document.documentElement.scrollTop
  if (st > lastScrollTop.value && st > 300) {
    isHeaderHidden.value = true
  } else {
    isHeaderHidden.value = false
  }
  lastScrollTop.value = st <= 0 ? 0 : st
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// --- LÓGICA PARA EL DROPDOWN EN ESCRITORIO ---
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// --- LÓGICA PARA EL DROPDOWN EN MÓVIL ---
const isDropdownOpenMobile = ref(false)
const dropdownRefMobile = ref<HTMLElement | null>(null)

// Manejo del click para abrir/cerrar
function toggleDropdown() {
  // Abrimos/cerramos solo al hacer click
  isDropdownOpen.value = !isDropdownOpen.value
}
function toggleDropdownMobile() {
  isDropdownOpenMobile.value = !isDropdownOpenMobile.value
}

// Cerrar dropdown si se hace click fuera
function handleClickOutside(event: MouseEvent) {
  // Para escritorio
  /* if (
    isDropdownOpen.value &&
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target as Node)
  ) {
    isDropdownOpen.value = false
  }
  // Para móvil
  if (
    isDropdownOpenMobile.value &&
    dropdownRefMobile.value &&
    !dropdownRefMobile.value.contains(event.target as Node)
  ) {
    isDropdownOpenMobile.value = false
  } */
}

// Agregamos listener global para detectar clicks fuera
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// --- LÓGICA DE AUTENTICACIÓN (Pinia) ---
const authStore = useAuthStore()

// Computed que determina si hay token y user => usuario autenticado
const isAuthenticated = computed(() => !!authStore.token && !!authStore.user)

// Nombre del usuario guardado en el store (se sincroniza con localStorage)
const userName = computed(() => authStore.user?.nombre || '')

// Funciones de navegación
const router = useRouter()
function goToProfile() {
  router.push({ name: 'profile' })
}
function goToLikes() {
  router.push({ name: 'likes' })
}

// Logout llamando a authStore
  function handleLogout() {
  authStore.logout();
  router.push({ name: 'home' });
}


// Opcional: Escuchar cambios en el store para reactividad inmediata
watch(
  () => authStore.user,
  (newVal) => {
    // Si user cambia, actualizamos algo si se requiere
  }
)
</script>

<style scoped>
/* Ajusta los estilos si lo deseas */
</style>
