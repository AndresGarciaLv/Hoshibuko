<script setup lang="ts">
import Footer from '@/components/Footer.vue'
import { BookOpenIcon } from '@heroicons/vue/24/solid'
import Header from '@/components/Header.vue'

</script>

<template>
   <Header />
  <!-- Aplica los colores de fondo y texto según las variables -->
  <main class="bg-[var(--body-bg)] text-[var(--body-text)] transition-colors">
    <div class="max-w-[1400px]  px-5 mx-auto p-40">
      <!-- Contenedor principal con layout responsivo -->
      <div class="flex flex-col md:flex-row items-center md:items-start">
        <!-- Sección de texto -->
        <div class="md:w-1/2">
          <!-- Título con efecto typewriter -->
          <h1 class="text-6xl font-semibold mb-4">
            <span class="block typewriter">Bienvenido a</span>
            <span class="block typewriter delay">HoshiBunko tu,</span>
            <span class="block typewriter delay2">biblioteca estelar</span>
          </h1>

          <!-- Párrafo -->
          <p class="text-base sm:text-xl mt-10 mb-10"
          :style="{ color: 'var(--text-subtle)' }">
            Explora un universo de libros gratuitos y descubre nuevas historias que iluminarán tu imaginación.
          </p>

          <!-- Botón con variables -->
          <button
  class="flex gap-2 px-6 py-3 rounded-full transition-colors cursor-pointer
         bg-[var(--btn-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover)]"
>
  Explorar la Biblioteca
  <BookOpenIcon class="w-6 h-6" />
</button>
        </div>

        <!-- Sección para la imagen (con transición) -->
        <transition
          appear
          enter-active-class="transition transform duration-900"
          enter-from-class="opacity-0 translate-y-5"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition transform duration-900"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-5"
        >
          <div class="md:w-1/2 md:ml-8 mt-8 md:mt-0">
            <div class="w-full bg-gray-200 dark:bg-[var(--c-bg-3)] rounded-lg flex items-center justify-center">
              <img
                src="../assets/img/home-hero.jpg"
                alt="Imagen de portada"
                class="rounded-lg max-w-full h-auto"
              />
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Sección Catálogo -->
    <div class="mt-10" :style="{ backgroundColor: 'var(--c-bg-4)' }">
      <div
        class="max-w-[1400px] mx-auto px-4 py-6
               flex flex-col md:flex-row items-center md:items-start"
      >
        <!-- Sección de texto -->
        <div class="md:w-1/2 md:pr-8 pt-6 md:pt-10">
          <h1
            class="font-monserrat text-5xl sm:text-4xl md:text-6xl mb-4"
            :style="{ color: 'var(--c-primary)' }"
          >
            Explora Nuestro Catálogo Completo
          </h1>

          <p
  class="text-base sm:text-xl mt-10 mb-10"
  :style="{ color: 'var(--text-subtle)' }"
>
  Sumérgete en nuestra amplia colección de títulos y encuentra tu próxima gran lectura.
</p>

          <!-- Lista de beneficios -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 mb-10">
            <div class="flex items-center">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="check"
                class="w-5 h-5 mr-2"
                :style="{ color: 'var(--c-highlight)' }"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256
                     256c-12.5 12.5-32.8 12.5-45.3 0l-128-128
                     c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5
                     45.3 0L160 338.7 393.4 105.4c12.5-12.5
                     32.8-12.5 45.3 0z"
                ></path>
              </svg>
              <p class="font-bold">Acceso Gratuito</p>
            </div>

            <div class="flex items-center">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="check"
                class="w-5 h-5 mr-2"
                :style="{ color: 'var(--c-highlight)' }"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256
                     256c-12.5 12.5-32.8 12.5-45.3 0l-128-128
                     c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5
                     45.3 0L160 338.7 393.4 105.4c12.5-12.5
                     32.8-12.5 45.3 0z"
                ></path>
              </svg>
              <p class="font-bold">Sin Registro Necesario</p>
            </div>

            <div class="flex items-center">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="check"
                class="w-5 h-5 mr-2"
                :style="{ color: 'var(--c-highlight)' }"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256
                     256c-12.5 12.5-32.8 12.5-45.3 0l-128-128
                     c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5
                     45.3 0L160 338.7 393.4 105.4c12.5-12.5
                     32.8-12.5 45.3 0z"
                ></path>
              </svg>
              <p class="font-bold">Disponible 24/7</p>
            </div>

            <div class="flex items-center">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="check"
                class="w-5 h-5 mr-2"
                :style="{ color: 'var(--c-highlight)' }"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256
                     256c-12.5 12.5-32.8 12.5-45.3 0l-128-128
                     c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5
                     45.3 0L160 338.7 393.4 105.4c12.5-12.5
                     32.8-12.5 45.3 0z"
                ></path>
              </svg>
              <p class="font-bold">Para Todos los Gustos</p>
            </div>
          </div>

          <!-- Botón -->
          <button
  class="flex gap-2 px-6 py-3 rounded-full transition-colors cursor-pointer
         bg-[var(--btn-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover)]"
>
  Explorar la Biblioteca
  <BookOpenIcon class="w-6 h-6" />
</button>

        </div>

        <!-- Sección para la imagen -->
        <transition
          appear
          enter-active-class="transition transform duration-300"
          enter-from-class="opacity-0 translate-y-5"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition transform duration-300"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-5"
        >
          <div class="md:w-1/2 md:ml-8 mt-8 md:mt-0">
            <div class="w-full bg-gray-200 dark:bg-[var(--c-bg-3)] rounded-lg flex items-center justify-center">
              <img
                class="rounded-lg max-w-full h-auto"
                src="../assets/img/home-biblioteca.jpg"
                alt="Biblioteca"
              />
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Tu componente Footer -->
    <Footer />
  </main>
</template>



<style scoped>
/* Efecto typewriter */
.typewriter {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  width: 0;
  animation: typing 0.2s steps(30, end) forwards;
}
.delay {
  animation-delay: 0.4s;
}
.delay2 {
  animation-delay: 0.8s;
}
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
</style>
