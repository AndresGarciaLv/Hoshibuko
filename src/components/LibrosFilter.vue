<template>
  <aside
    class="flex flex-col w-64 p-4"
    :style="{
      backgroundColor: 'var(--body-bg)',
      color: 'var(--body-text)',
      borderRight: '1px solid var(--text-subtle)'
    }"
  >
  <div class="flex items-center gap-4 mb-8 mt-5">
        <img src="@/assets/Logo.svg" alt="Hoshibunko Logo" class="w-10 h-10 rounded-full" />
        <div>
          <h3 class="font-bold text-[var(--c-accent)]">Hoshibunko</h3>
          <p class="text-xs" :style="{ color: 'var(--text-subtle)' }">Filtro de Libros</p>
        </div>
        <!-- Botón para modo oscuro -->

      </div>
    <!-- Título principal -->
     <hr>
    <h2 class="flex pl-3 text-xl  font-bold mb-3 mt-3"><FunnelIcon class="w-8 h-8 text-[var(--c-accent)] mr-3 " />Filtrar Libros</h2>
    <hr>

    <!-- Filtro por nombre de libro -->
    <div class="mb-6">
      <h3 class="flex font-semibold text-lg mb-2 mt-5"><BookOpenIcon class="w-6 h-6  text-[var(--c-accent)] mr-3" /> Nombre</h3>
      <input
        type="text"
        v-model="bookNameSearch"
        class="w-full px-3 py-2 border rounded text-sm
               outline-none focus:ring-1 focus:ring-[var(--c-accent)]
               transition-colors"
        placeholder="Buscar título..."
        @input="onFilterChange"
      />
    </div>

    <!-- Filtro por autor -->
    <div class="mb-6">
      <h3 class="flex font-semibold text-lg mb-2"> <UserIcon class="w-6 h-6 text-[var(--c-accent)] mr-3" /> Autor</h3>
      <input
        type="text"
        v-model="authorSearch"
        class="w-full px-3 py-2 border rounded text-sm
               outline-none focus:ring-1 focus:ring-[var(--c-accent)]
               transition-colors"
        placeholder="Buscar autor..."
        @input="onFilterChange"
      />
    </div>

    <!-- Filtro por Categoría -->
    <div class="mb-6">
      <h3 class="flex font-semibold text-lg mb-2"> <TagIcon class="w-6 h-6 text-[var(--c-accent)] mr-3" />Categorías</h3>
      <ul class="space-y-1">
        <li
          v-for="cat in categories"
          :key="cat.id"
          class="flex items-center gap-2 text-md"
        >
          <input
            type="checkbox"
            :value="cat.id"
            v-model="selectedCategories"
            class="accent-[var(--c-accent)] transform scale-130"
            @change="onFilterChange"
          />
          <span>{{ cat.nombre }}</span>
        </li>
      </ul>
    </div>



  </aside>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import {
  FunnelIcon, UserIcon, BookOpenIcon, TagIcon
} from '@heroicons/vue/24/outline';

/**
 * Props: lista de categorías, por ejemplo [{id:1,nombre:"Novela"},{...}].
 */
const props = defineProps<{
  categories: { id: number; nombre: string }[];
}>();

/**
 * Emitimos 'filterChange' cuando cambian los filtros.
 */
const emits = defineEmits(['filterChange']);

/**
 * Variables reactivas para almacenar los filtros seleccionados.
 */
const selectedCategories = ref<number[]>([]);
const authorSearch = ref('');
const bookNameSearch = ref('');

/**
 * Cada vez que cambie algún filtro, emitimos un objeto
 * con toda la información actual de los filtros.
 */
function onFilterChange() {
  emits('filterChange', {
    categories: selectedCategories.value,
    author: authorSearch.value,
    bookName: bookNameSearch.value,
  });
}
</script>

<style scoped>
/* Puedes ajustar estos estilos o usar Tailwind para darles coherencia con tu sidebar */

/* Ejemplo: estilo para inputs en modo oscuro/claro */
</style>
