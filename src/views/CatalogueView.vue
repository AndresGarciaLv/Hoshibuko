<script setup lang="ts">
import { ref } from 'vue'
import Footer from '@/components/Footer.vue'
import GalleriaComponent from '@/components/Catalogue/GalleriaComponent.vue'
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
  <main class="bg-[var(--body-bg)] text-[var(--body-text)] transition-colors">
    <div class="max-w-[1400px] px-5 mx-auto p-30">
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

    <!-- Componente Footer -->
    <Footer />
  </main>
</template>

<style scoped>
/* Efecto typewriter para el título */
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
  from { width: 0; }
  to { width: 100%; }
}
</style>
