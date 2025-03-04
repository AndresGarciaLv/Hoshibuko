<script setup lang="ts">
import { ref } from 'vue'
import Footer from '@/components/Footer.vue'
import GalleriaComponent from '@/components/Catalogue/GalleriaComponent.vue'
import Header from '@/components/Header.vue'
import {
  BookOpenIcon,
  BeakerIcon,
  BuildingLibraryIcon,
  PaintBrushIcon,
  CpuChipIcon,
  QuestionMarkCircleIcon
} from '@heroicons/vue/24/solid'

const categories = ref([
  { id: 1, name: 'Ficción', icon: BookOpenIcon, count: 1500 },
  { id: 2, name: 'Ciencia', icon: BeakerIcon, count: 1200 },
  { id: 3, name: 'Historia', icon: BuildingLibraryIcon, count: 900 },
  { id: 4, name: 'Arte', icon: PaintBrushIcon, count: 700 },
  { id: 5, name: 'Tecnología', icon: CpuChipIcon, count: 600 },
  { id: 6, name: 'Misterio', icon: QuestionMarkCircleIcon, count: 500 }
])
</script>

<template>
  <Header />
  <!-- Contenedor principal con la imagen de fondo y overlay -->
  <main class="relative bg-[var(--body-bg)] text-[var(--body-text)] transition-colors">


    <!-- Sección principal: "Conoce Nuestra Historia" -->
    <section class="relative max-w-[1400px] mx-auto px-5 pt-40 text-center">
      <h1

        class="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
      >
        Conoce Nuestra Historia
      </h1>
      <p
        :style="{ color: 'var(--text-subtle)' }"
        class="text-base sm:text-xl max-w-3xl mx-auto pb-20"
      >
        Acompáñanos en un viaje a través del tiempo para descubrir cómo
        HoshiBunko se ha convertido en la biblioteca estelar que es hoy.
      </p>
    </section>

    <!-- Sección de estadísticas (mismo fondo) -->
    <section class="relative pb-10">
      <div class="max-w-[1400px] mx-auto px-5">
        <div class="flex flex-wrap justify-center gap-10 text-center">
          <!-- Tarjeta de estadísticas 1 -->
          <div class="w-40">
            <h2 class="text-4xl font-bold" :style="{ color: 'var(--c-primary)' }">
              10+
            </h2>
            <p class="mt-1" :style="{ color: 'var(--text-subtle)' }">
              Años al Servicio
            </p>
          </div>

          <!-- Tarjeta de estadísticas 2 -->
          <div class="w-40">
            <h2 class="text-4xl font-bold" :style="{ color: 'var(--c-primary)' }">
              5000+
            </h2>
            <p class="mt-1" :style="{ color: 'var(--text-subtle)' }">
              Libros Disponibles
            </p>
          </div>

          <!-- Tarjeta de estadísticas 3 -->
          <div class="w-40">
            <h2 class="text-4xl font-bold" :style="{ color: 'var(--c-primary)' }">
              2000+
            </h2>
            <p class="mt-1" :style="{ color: 'var(--text-subtle)' }">
              Usuarios Activos
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-[1400px] px-5 mx-auto">
      <!-- Sección de Categorías -->
      <transition
          appear
          enter-active-class="transition transform duration-900"
          enter-from-class="opacity-0 translate-y-5"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition transform duration-900"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-5"
        >
      <div class="max-w-7xl mx-auto px-4 py-12 ">
        <h2 class="text-center text-3xl md:text-4xl font-bold mb-8"
            :style="{ color: 'var(--c-primary)' }">
          Explora Nuestras Categorías
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="cat in categories" :key="cat.id"
               class="p-6 rounded-lg flex flex-col items-center bg-[var(--c-bg-2)]">
            <!-- Ícono dinámico -->
            <component :is="cat.icon"
                       class="w-12 h-12 mb-4"
                       :style="{ color: 'var(--c-info)' }" />
            <h3 class="text-2xl font-semibold mb-2"
                :style="{ color: 'var(--c-primary)' }">
              {{ cat.name }}
            </h3>
            <p class="text-lg"
               :style="{ color: 'var(--text-subtle)' }">
              {{ cat.count }}
            </p>
          </div>
        </div>
      </div>
    </transition>

      <!-- Galería de Imágenes con PrimeVue -->
      <!-- Asegúrate de que GalleriaComponent esté correctamente implementado y exportado -->
      <transition
          appear
          enter-active-class="transition transform duration-900"
          enter-from-class="opacity-0 translate-y-5"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition transform duration-900"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-5"
        >
      <GalleriaComponent class="flex justify-center" />
    </transition>
    </div>



    <!-- Footer (mismo estilo global) -->

  </main>


  <Footer />
</template>

<style scoped>
/*
  Si necesitas un efecto typewriter o estilos adicionales, puedes incluirlos aquí.
  Asegúrate de no usar :deep(section:first-of-type) ya que
  estamos usando un approach con overlay + background en la capa absoluta.
*/
</style>
