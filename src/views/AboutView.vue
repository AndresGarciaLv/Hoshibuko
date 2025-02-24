<script setup lang="ts">
import Footer from '@/components/Footer.vue'
</script>

<template>
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
    <section class="relative pb-30">
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
