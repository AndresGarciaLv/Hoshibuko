<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "primevue/usetoast";
import { AxiosError } from "axios"; // Para manejar errores de Axios correctamente

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

const username = ref(""); // Permite usuario o correo
const password = ref("");
const errorMessage = ref("");

// ✅ Manejo del login
const onSubmit = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = "Por favor, complete todos los campos.";
    return;
  }

  try {
    await authStore.login(username.value, password.value);

    // ✅ Mostrar mensaje de éxito
    toast.add({
      severity: "success",
      summary: "Inicio de sesión exitoso",
      detail: "Has iniciado sesión correctamente.",
      life: 3000,
    });

    // ✅ Redirigir al dashboard después de 1.5 segundos
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);

    let errorMessage = "Credenciales incorrectas.";

    // ✅ Manejo de errores específicos de Axios
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || errorMessage;
    }

    // ❌ Mostrar mensaje de error con PrimeVue Toast
    toast.add({
      severity: "error",
      summary: "Error en inicio de sesión",
      detail: errorMessage,
      life: 3000,
    });
  }
};
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center transition-colors"
    :style="{
      background: 'linear-gradient(90deg, var(--c-accent) 0%, var(--c-highlight) 16%, var(--body-bg) 55%, var(--body-bg) 100%)',
    }"
  >
    <!-- ✅ Componente para mostrar notificaciones -->
    <PrimeToast />

    <div class="flex w-full max-w-7xl justify-center rounded-lg overflow-hidden gap-x-20">
      <!-- Imagen lateral -->
      <div
        class="hidden lg:flex items-center justify-center shadow-lg backdrop-blur-md"
        style="width: 580px; height: 535px; border-radius: 8px"
      >
        <img
          src="../assets/img/Login.jpg"
          alt="Imagen de registro"
          class="w-[500px] h-[500px] object-cover"
        />
      </div>

      <!-- Formulario de inicio de sesión -->
      <div class="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
        <!-- Logo y título -->
        <RouterLink :to="{ name: 'home' }" class="flex gap-2 justify-center items-center">
          <img src="../assets/Logo.svg" alt="Logo" class="w-12 h-12" />
          <span class="font-medium text-2xl text-[var(--body-text)]">HOSHIBUNKO</span>
        </RouterLink>
        <div class="text-center mb-6">
          <h2 class="text-3xl font-bold text-[var(--c-primary)] mt-4">Iniciar Sesión</h2>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="onSubmit" class="space-y-6">
          <div v-if="errorMessage" class="text-red-500 text-center">
            {{ errorMessage }}
          </div>

          <!-- Campo de Usuario o Correo -->
          <div>
            <label for="username" class="block text-sm font-medium text-[var(--text-subtle)]">
              Usuario o Correo <span class="text-red-500">*</span>
            </label>
            <input
              id="username"
              type="text"
              v-model="username"
              class="w-full mt-1 px-4 py-2 border border-[var(--c-bg-2)] rounded-lg focus:ring-2 focus:ring-[var(--c-info)] outline-none bg-[var(--body-bg)] text-[var(--body-text)]"
              placeholder="Nombre de usuario o correo electrónico"
              required
            />
          </div>

          <!-- Campo de Contraseña -->
          <div>
            <label for="password" class="block text-sm font-medium text-[var(--text-subtle)]">
              Contraseña <span class="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              v-model="password"
              class="w-full mt-1 px-4 py-2 border border-[var(--c-bg-2)] rounded-lg focus:ring-2 focus:ring-[var(--c-info)] outline-none bg-[var(--body-bg)] text-[var(--body-text)]"
              placeholder="Contraseña"
              required
            />
          </div>

          <!-- Botón de inicio de sesión -->
          <button
            type="submit"
            class="w-full py-2 bg-[var(--btn-bg)] text-[var(--btn-text)] font-semibold rounded-lg hover:bg-[var(--btn-hover)] transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>

        <!-- Enlace para registrarse -->
        <div class="text-center mt-6 text-[var(--text-subtle)]">
          ¿Aún no tienes cuenta?
          <router-link :to="{ name: 'register' }" class="text-[var(--c-info)] font-semibold hover:underline">
            Registrarse
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
