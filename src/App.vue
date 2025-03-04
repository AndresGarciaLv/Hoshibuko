<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { onMounted, watch } from 'vue';
import { useThemeStore } from '@/stores/themeStore';

const themeStore = useThemeStore();

// Cargar preferencia del localStorage al montar la app
onMounted(() => {
  themeStore.loadThemePreference();
  // Aplica o quita la clase 'app-dark' según isDark
  document.documentElement.classList.toggle('app-dark', themeStore.isDark);
});

// Escuchar cambios en isDark y actualizar la clase CSS
watch(
  () => themeStore.isDark,
  (newVal) => {
    document.documentElement.classList.toggle('app-dark', newVal);
  }
);

const authStore = useAuthStore()
const router = useRouter()

watch(
  () => authStore.isAuthenticated,
  (isAuth) => {
    if (!isAuth) {
      router.push({ name: 'login' })
    }
  }
)
</script>


<template>
  <header>

    <div class="wrapper">



    </div>
  </header>
  <PrimeToast />
  <RouterView />
</template>
