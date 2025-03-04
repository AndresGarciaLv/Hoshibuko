<template>
  <div>
    <!-- Componente que muestra las tarjetas de libros -->
    <LibrosCard :libros="misLibros" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import LibrosCard from '@/components/LibroCard.vue';
import LibroService from '@/service/libroService';
import type { GetLibroDTO } from '@/interfaces/LibroDTO';

const misLibros = ref<GetLibroDTO[]>([]);

onMounted(async () => {
  try {
    misLibros.value = await LibroService.getAll();
  } catch (error) {
    console.error('Error cargando libros:', error);
  }
});
</script>
