<template>
  <!-- Layout para pantallas grandes (md y superiores) -->
  <div
    class="hidden md:flex"
    :style="{ backgroundColor: 'var(--body-bg)', color: 'var(--body-text)' }"
  >
    <!-- Panel lateral de filtros -->
    <BooksFilter
      class="min-w-[16rem]"
      :categories="categories"
      @filterChange="handleFilterChange"
    />

    <!-- Contenido principal: contenedor con scroll interno -->
    <div ref="mainContentRef" class="flex-1 relative overflow-y-auto p-6" style="height: 100vh;">
      <!-- Header fijo con transición y comportamiento de ocultar/mostrar -->
      <transition name="fade" mode="out-in">
        <Header
          v-show="headerVisible"
          class="sticky top-0 z-10 bg-[var(--body-bg)] shadow transition-all"
        />
      </transition>
      <!-- Espacio para compensar el header fijo -->
      <div class="pt-10">
        <h1 class="text-2xl font-bold mb-2">Catálogo de Libros</h1>
        <p class="text-gray-600 mb-4" :style="{ color: 'var(--text-subtle)' }">
          Filtra por categorías, autor o nombre de libro.
        </p>
        <!-- Si no hay resultados, mostramos "SIN RESULTADOS", sino las tarjetas -->
        <div v-if="filteredBooks.length === 0" class="flex items-center justify-center h-64">
          <span class="text-4xl font-bold text-gray-500">SIN RESULTADOS</span>
        </div>
        <div v-else>
          <LibroCard :libros="filteredBooks" />
        </div>
      </div>
    </div>
  </div>

  <!-- Layout para dispositivos móviles -->
  <div
    class="flex flex-col md:hidden"
    :style="{ backgroundColor: 'var(--body-bg)', color: 'var(--body-text)' }"
  >
    <!-- Header siempre visible en la parte superior -->
    <Header class="w-full z-10 bg-[var(--body-bg)] shadow mb-4" />

    <!-- Panel de filtros (ocupa toda la anchura) -->
    <BooksFilter
      class="w-full p-4 border-b border-gray-200"
      :categories="categories"
      @filterChange="handleFilterChange"
    />

    <!-- Contenido principal con scroll interno -->
    <div ref="mainContentRef" class="flex-1 overflow-y-auto p-6" style="height: calc(100vh - 200px);">
      <h1 class="text-2xl font-bold mb-2">Catálogo de Libros</h1>
      <p class="text-gray-600 mb-4">
        Filtra por categorías, autor o nombre de libro.
      </p>
      <div v-if="filteredBooks.length === 0" class="flex items-center justify-center h-64">
        <span class="text-4xl font-bold text-gray-500">SIN RESULTADOS</span>
      </div>
      <div v-else>
        <LibroCard :libros="filteredBooks" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Header from '@/components/Header.vue';
import BooksFilter from '@/components/LibrosFilter.vue';
import LibroCard from '@/components/LibroCard.vue';
import type { GetLibroDTO } from '@/interfaces/LibroDTO';
import type { CategoriaDTO } from '@/interfaces/CategoriaDTO';
import LibroService from '@/service/libroService';
import CategoriaService from '@/service/categoriaService';

/**
 * Estado reactivo donde guardamos la lista completa de libros y categorías.
 */
const allBooks = ref<GetLibroDTO[]>([]);
const filteredBooks = ref<GetLibroDTO[]>([]);
const categories = ref<CategoriaDTO[]>([]);

/**
 * Objeto reactivo para almacenar los filtros actuales.
 */
const currentFilters = ref({
  categories: [] as number[],
  author: '',
  bookName: '',
  price: [0, 200],
});

/**
 * Variable para controlar la visibilidad del header (solo en desktop).
 */
const headerVisible = ref(true);
let lastScrollTop = 0;

/**
 * Referencia al contenedor principal que tiene scroll (solo en desktop).
 */
const mainContentRef = ref<HTMLDivElement | null>(null);

/**
 * Función para manejar el scroll (solo en desktop):
 * - Si se desplaza hacia abajo > 200px, se oculta el header.
 * - Si se desplaza hacia arriba, se muestra el header.
 */
function handleScroll() {
  if (!mainContentRef.value) return;
  const st = mainContentRef.value.scrollTop;

  if (st > lastScrollTop && st > 200) {
    headerVisible.value = false;
  }
  if (st < lastScrollTop) {
    headerVisible.value = true;
  }
  lastScrollTop = st;
}

onMounted(async () => {
  try {
    allBooks.value = await LibroService.getAll();
    categories.value = await CategoriaService.getAll();
    filteredBooks.value = allBooks.value;
  } catch (error) {
    console.error('Error cargando datos:', error);
  }
  // Solo en desktop, agregamos el listener de scroll
  if (mainContentRef.value) {
    mainContentRef.value.addEventListener('scroll', handleScroll);
  }
});

onBeforeUnmount(() => {
  if (mainContentRef.value) {
    mainContentRef.value.removeEventListener('scroll', handleScroll);
  }
});

/**
 * Maneja el evento 'filterChange' emitido desde BooksFilter.
 */
function handleFilterChange(newFilters: {
  categories: number[];
  author: string;
  bookName: string;
  price: number[];
}) {
  currentFilters.value = newFilters;
  applyFilters();
}

/**
 * Aplica los filtros a la lista de libros y actualiza 'filteredBooks'.
 */
function applyFilters() {
  let temp = [...allBooks.value];

  // Filtro por categorías
  if (currentFilters.value.categories.length > 0) {
    temp = temp.filter((libro) =>
      libro.categoriaIds.some((catId) =>
        currentFilters.value.categories.includes(catId)
      )
    );
  }

  // Filtro por autor
  if (currentFilters.value.author.trim()) {
    temp = temp.filter((libro) =>
      libro.autorNombre.toLowerCase().includes(currentFilters.value.author.toLowerCase())
    );
  }

  // Filtro por nombre del libro
  if (currentFilters.value.bookName.trim()) {
    temp = temp.filter((libro) =>
      libro.nombre.toLowerCase().includes(currentFilters.value.bookName.toLowerCase())
    );
  }

  // Filtro por rango de precios (si se implementa)
  // const [minPrice, maxPrice] = currentFilters.value.price;
  // temp = temp.filter((libro) => libro.precio >= minPrice && libro.precio <= maxPrice);

  filteredBooks.value = temp;
}
</script>

<style scoped>
/* Transición para el header en desktop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
