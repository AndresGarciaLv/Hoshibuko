<template>
  <!-- Contenedor flotante con transición y blur -->
  <div
    :class="[
      'fixed top-0 w-full z-50 transition-transform duration-300 ',
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
        <span class="text-[#03045E] font-bold text-xl">
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

      <!-- Botones de acción -->
      <div class="hidden md:flex-1 md:flex items-center justify-end space-x-3 pr-5">
        <button
          class="px-4 py-2 rounded-full text-[#03045E]
                 hover:bg-gray-300 transition-colors cursor-pointer text-lg"
        >
          Únete →
        </button>
        <button
          class="px-4 py-2 rounded-full bg-[#0096C7] text-white
                 hover:bg-[#0077B6] transition-colors cursor-pointer text-lg"
        >
          Contáctanos →
        </button>

        <!-- Checkbutton para modo claro/oscuro -->
        <label class="relative inline-flex items-center cursor-pointer">
          <!-- Checkbox oculto -->
          <input
            type="checkbox"
            class="sr-only peer"
            :checked="isDark"
            @change="toggleDarkMode"
          />
          <!-- Fondo del switch -->
          <div
            class="w-14 h-7 bg-white peer-focus:outline-none
                   rounded-full border border-gray-300 peer
                   peer-checked:bg-gray-600 transition-colors relative"
          >
            <!-- Ícono de sol (modo claro) -->
            <SunIcon
              v-if="!isDark"
              class="absolute left-1 top-1 w-5 h-5 text-gray-600"
            />
            <!-- Ícono de luna (modo oscuro) -->
            <MoonIcon
              v-else
              class="absolute right-1 top-1 w-5 h-5 text-white"
            />
          </div>
        </label>
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
        <!-- Botones de acción en móvil -->
        <div class="grid grid-cols-2 gap-2 p-4 mt-2">
          <button
            class="px-4 py-2 rounded-full bg-[#023E8A] text-white
                   hover:bg-[#0077B6] transition-all p-2 cursor-pointer"
          >
            Únete →
          </button>
          <button
            class="px-4 py-2 rounded-full bg-[#0096C7] text-white
                   hover:bg-[#0077B6] transition-all p-2 cursor-pointer"
          >
            Contáctanos →
          </button>

          <!-- Versión móvil del checkbutton -->
          <label class="col-span-2 relative inline-flex items-center justify-center mt-3 cursor-pointer">
            <input
              type="checkbox"
              class="sr-only peer"
              :checked="isDark"
              @change="toggleDarkMode"
            />
            <div
            class="w-14 h-7 bg-white peer-focus:outline-none
                   rounded-full border border-gray-300 peer
                   peer-checked:bg-gray-600 transition-colors relative"
          >
            <!-- Ícono de sol (modo claro) -->
            <SunIcon
              v-if="!isDark"
              class="absolute left-1 top-1 w-5 h-5 text-gray-600"
            />
            <!-- Ícono de luna (modo oscuro) -->
            <MoonIcon
              v-else
              class="absolute right-1 top-1 w-5 h-5 text-white"
            />
          </div>
          </label>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
// Importamos los iconos de Heroicons
import { SunIcon, MoonIcon } from '@heroicons/vue/24/solid'

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

// Control del modo oscuro
const isDark = ref(false)
function toggleDarkMode() {
  isDark.value = !isDark.value
  // Alterna la clase .app-dark en <html> para tu modo oscuro/claro
  document.documentElement.classList.toggle('app-dark', isDark.value)
}
</script>

<style scoped>
/* Ajusta los estilos si lo deseas */
</style>
