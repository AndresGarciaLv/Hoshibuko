<template>
  <div class="card w-full mx-auto my-8">
    <Galleria
      :value="images"
      :responsiveOptions="responsiveOptions"
      :numVisible="5"
      containerStyle="max-width: 1000px"
      circular
      autoPlay
      :transitionInterval="3000"
      showThumbnails
      showItemNavigators
    >
      <!-- Template para la imagen principal -->
      <template #item="slotProps">
        <img
          :src="slotProps.item.itemImageSrc"
          :alt="slotProps.item.alt"
          class="w-[800px] h-[700px] object-cover"
          style="display: block;"
        />
      </template>
      <!-- Template para la miniatura -->
      <template #thumbnail="slotProps">
        <img
          :src="slotProps.item.thumbnailImageSrc"
          :alt="slotProps.item.alt"
          class="w-20 h-20 object-cover"
          style="display: block;"
        />
      </template>
      <!-- Template para el caption -->
      <template #caption="slotProps">
        <div class="text-xl mb-2 font-bold">{{ slotProps.item.title }}</div>
        <p class="text-white">{{ slotProps.item.alt }}</p>
      </template>
    </Galleria>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Galleria from 'primevue/galleria'

// Usamos importaciones ES para que Vite gestione las imágenes correctamente
import slide1 from '@/assets/img/Catalogue/img1.jpg'
import slide1Thumb from '@/assets/img/Catalogue/img1.jpg'
import slide2 from '@/assets/img/Catalogue/img2.jpg'
import slide2Thumb from '@/assets/img/Catalogue/img2.jpg'
import slide3 from '@/assets/img/Catalogue/img3.jpg'
import slide3Thumb from '@/assets/img/Catalogue/img3.jpg'

const images = ref([
  {
    itemImageSrc: slide1,
    thumbnailImageSrc: slide1Thumb,
    alt: 'Descubre historias asombrosas',
    title: 'Sumérgete en la Lectura'
  },
  {
    itemImageSrc: slide2,
    thumbnailImageSrc: slide2Thumb,
    alt: 'Explora nuevos horizontes literarios',
    title: 'Explora Nuestra Colección'
  },
  {
    itemImageSrc: slide3,
    thumbnailImageSrc: slide3Thumb,
    alt: 'Encuentra tu próxima gran aventura',
    title: 'Lee sin Límites'
  }
])

const responsiveOptions = ref([
  { breakpoint: '1024px', numVisible: 3 },
  { breakpoint: '768px', numVisible: 2 },
  { breakpoint: '560px', numVisible: 1 }
])
</script>

<style scoped>
.card {
  /* Puedes agregar estilos adicionales para el contenedor de la galería */
}
</style>
