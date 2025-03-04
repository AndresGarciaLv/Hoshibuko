<template>
  <!-- Contenedor principal en flex para Sidebar y contenido -->
  <div
    class="flex min-h-screen"
    :style="{ backgroundColor: 'var(--body-bg)', color: 'var(--body-text)' }"
  >
    <!-- Sidebar a la izquierda -->
    <AdminSidebar />

    <!-- Contenido principal -->
    <div class="flex-1 p-6">
      <Card :style="{ backgroundColor: 'var(--c-bg-4)' }">
        <!-- Título del Card -->
        <template #title>
          <span class="text-xl font-bold">Gestión de Libros</span>
        </template>


      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">


// Importamos los componentes de PrimeVue
import Card from 'primevue/card';


// Nuestro Sidebar personalizado
import AdminSidebar from '@/components/Sidebar.vue';


</script>

<style scoped>
/* Ajustes adicionales si lo deseas */
</style>
