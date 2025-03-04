<script setup lang="ts">
import { watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

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
