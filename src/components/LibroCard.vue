<template>
  <!-- Contenedor principal con grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
    <!-- Iteramos sobre la lista de libros -->
    <div
      v-for="libro in libros"
      :key="libro.id"
      class="bg-white group rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
      :style="{ backgroundColor: 'var(--body-bg)', color: 'var(--body-text)' }"
    >
      <!-- Contenedor de la imagen con botón de 'like' y overlay de descripción -->
      <div class="relative w-full h-52 overflow-hidden">
        <!-- Imagen de portada -->
        <img
          :src="libro.urlImagen ? baseUrl + libro.urlImagen : defaultBookCover"
          alt="Portada del libro"
          class="w-full h-full object-cover rounded-md"
        />

        <!-- Overlay con blur y descripción (oculto por defecto, se muestra al hover) -->
        <div
          class="absolute inset-0 flex items-center justify-center
                 bg-black bg-opacity-50 backdrop-blur-sm text-white
                 opacity-0 group-hover:opacity-80 transition duration-300 z-10"
        >
          <p class="p-4 text-center">{{ libro.descripcion }}</p>
        </div>



        <!-- Ícono de corazón (like), sobre la overlay (z-20) -->
       <button
    class="absolute top-2 right-2 bg-white rounded-full p-2 shadow transition z-20 cursor-pointer hover:bg-gray-200"
    @click="toggleLike(libro)"
  >
    <HeartIcon :class="heartClass(libro)" />
  </button>

      </div>

      <!-- Sección de detalles (nombre, autor, categorías) -->
      <div class="mt-3">
        <!-- Nombre del libro y autor -->
        <div class="mt-1 text-xl font-semibold">{{ libro.nombre }}</div>
        <div class="text-sm text-gray-500">{{ libro.autorNombre }}</div>

        <!-- Categorías -->
        <div class="mt-3 flex flex-wrap gap-2">
          <span
            v-for="(cat, index) in libro.categorias"
            :key="cat"
            class="px-2 py-1 rounded text-sm"
            :style="getCategoryStyle(index)"
          >
            {{ cat }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { GetLibroDTO } from '@/interfaces/LibroDTO';
import { HeartIcon } from '@heroicons/vue/24/solid'; // Ícono de corazón
import defaultBookCover from '@/assets/libro-hoshibunko.webp';

function toggleLike(libro: any) {
  // Si no existe la propiedad, la inicializamos en false
  if (libro.liked === undefined) {
    libro.liked = false;
  }
  libro.liked = !libro.liked;
}
function heartClass(libro: GetLibroDTO & { liked?: boolean }) {
  return libro.liked
    ? 'w-5 h-5 text-red-600 '
    : 'w-5 h-5 text-gray-500 hover:text-gray-700';
}


/**
 * Recibe como prop la lista de libros que deseas mostrar.
 */
const props = defineProps<{
  libros: GetLibroDTO[];
}>();

/**
 * Evitamos parsear import.meta.env directamente en el template
 */
const baseUrl = import.meta.env.VITE_IMAGE_BASE || '';

/**
 * Paleta de colores para las categorías.
 */
const categoryColors = [
  { bg: '#03045E', text: '#FFFFFF' },
  { bg: '#023E8A', text: '#FFFFFF' },
  { bg: '#0077B6', text: '#FFFFFF' },
  { bg: '#0096C7', text: '#FFFFFF' },
  { bg: '#00B4D8', text: '#03045E' },
  { bg: '#48CAE4', text: '#03045E' },
  { bg: '#90E0EF', text: '#03045E' },
  { bg: '#ADE8F4', text: '#03045E' },
  { bg: '#CAF0F8', text: '#03045E' },
];

/**
 * Retorna un objeto de estilo para la categoría según el índice.
 */
function getCategoryStyle(index: number) {
  const color = categoryColors[index % categoryColors.length];
  return {
    backgroundColor: color.bg,
    color: color.text,
  };
}

/**
 * Función para manejar el "like".
 */
</script>

<style scoped>
/* Ajusta los estilos si lo deseas, aquí se usan clases de Tailwind. */

/* Modo oscuro adicional (si usas .app-dark u otra clase) */
.dark .bg-white {
  background-color: var(--c-bg-3) !important;
}
.dark .text-gray-800 {
  color: var(--body-text) !important;
}
</style>
