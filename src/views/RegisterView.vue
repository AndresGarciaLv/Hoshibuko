<script setup lang="ts">
import { EyeSlashIcon } from "@heroicons/vue/24/outline";
import { CheckIcon } from "@heroicons/vue/24/solid";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "primevue/usetoast";
import { AxiosError } from "axios"; // Para manejar errores de Axios correctamente

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

const name = ref("");
const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);
const errorMessage = ref("");

const passwordCriteria = ref({
  length: false,
  uppercase: false,
  special: false,
  number: false,
  match: false,
});

// ✅ Validar la contraseña en tiempo real
const validatePassword = () => {
  passwordCriteria.value = {
    length: password.value.length >= 8,
    uppercase: /[A-Z]/.test(password.value),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password.value),
    number: /\d/.test(password.value),
    match: password.value !== "" && confirmPassword.value !== "" && password.value === confirmPassword.value,
  };
};

// ✅ Manejar el registro
const onSubmit = async () => {
  if (!name.value || !username.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = "Por favor, complete todos los campos.";
    return;
  }

  if (!passwordCriteria.value.match) {
    errorMessage.value = "Las contraseñas no coinciden.";
    return;
  }

  try {
    await authStore.register(name.value, username.value, email.value, password.value);

    // ✅ Mostrar mensaje de éxito con PrimeVue Toast
    toast.add({
      severity: "success",
      summary: "Registro exitoso",
      detail: "Tu cuenta ha sido creada correctamente.",
      life: 3000,
    });

    // ✅ Redirigir al Home después de 1.5 segundos
    setTimeout(() => {
      router.push("/");
    }, 1500);
  } catch (error) {
    console.error("Error en el registro:", error);

    let errorMessage = "Hubo un problema al crear la cuenta. Inténtalo de nuevo.";

    // ✅ Manejo de errores específicos de Axios
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || errorMessage;
    }

    // ❌ Mostrar mensaje de error con PrimeVue Toast
    toast.add({
      severity: "error",
      summary: "Error en el registro",
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
      background: 'linear-gradient(-90deg, var(--c-accent) 0%, var(--c-highlight) 16%, var(--body-bg) 55%, var(--body-bg) 100%)',
    }"
  >
  <PrimeToast />
     <!-- ✅ Componente para notificaciones -->
    <div class="flex w-full max-w-7xl justify-center rounded-lg overflow-hidden gap-x-20">
      <!-- Imagen lateral -->


      <!-- Formulario de registro -->
      <div class="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
        <RouterLink :to="{ name: 'home' }" class="flex gap-2 justify-center items-center">
          <img src="../assets/Logo.svg" alt="Logo" class="w-12 h-12" />
          <span class="font-medium text-2xl text-[var(--body-text)]">HOSHIBUNKO</span>
        </RouterLink>
        <div class="text-center mb-4">
          <h2 class="text-3xl font-bold text-[var(--c-primary)] mt-2">Crear Cuenta</h2>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div v-if="errorMessage" class="text-red-500 text-center">
            {{ errorMessage }}
          </div>

          <!-- Campo de Nombre -->
          <div>
            <label for="name" class="block text-sm font-medium text-[var(--text-subtle)]">
              Nombre Completo <span class="text-red-500">*</span>
            </label>
            <input id="name" type="text" v-model="name" class="input-field" placeholder="Tu nombre completo" required />
          </div>

          <!-- Campo de Nombre de Usuario -->
          <div>
            <label for="username" class="block text-sm font-medium text-[var(--text-subtle)]">
              Nombre de Usuario <span class="text-red-500">*</span>
            </label>
            <input id="username" type="text" v-model="username" class="input-field" placeholder="Elige un nombre de usuario" required />
          </div>

          <!-- Campo de Correo -->
          <div>
            <label for="email" class="block text-sm font-medium text-[var(--text-subtle)]">
              Correo Electrónico <span class="text-red-500">*</span>
            </label>
            <input id="email" type="email" v-model="email" class="input-field" placeholder="ejemplo@correo.com" required />
          </div>

          <div class="space-y-2">
            <div class="grid grid-cols-2 gap-4">
              <!-- Campo de Contraseña -->
              <div class="relative">
                <label for="password" class="block text-sm font-medium text-[var(--text-subtle)]">
                  Contraseña <span class="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  :type="passwordVisible ? 'text' : 'password'"
                  v-model="password"
                  @input="validatePassword"
                  class="input-field pr-10"
                  placeholder="Crea una contraseña"
                  required
                />
                <button type="button" @click="passwordVisible = !passwordVisible" class="absolute right-3 top-9 text-gray-500">
        <svg v-if="passwordVisible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <EyeSlashIcon/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5C7.305 4.5 3.64 7.855 2.295 12c1.345 4.145 5.01 7.5 9.705 7.5s8.36-3.355 9.705-7.5c-1.345-4.145-5.01-7.5-9.705-7.5zM12 15.5c-1.933 0-3.5-1.567-3.5-3.5S10.067 8.5 12 8.5s3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z" />
        </svg>
      </button>
              </div>

              <!-- Campo de Confirmación de Contraseña -->
              <div class="relative">
                <label for="confirmPassword" class="block text-sm font-medium text-[var(--text-subtle)]">
                  Confirmar Contraseña <span class="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  :type="confirmPasswordVisible ? 'text' : 'password'"
                  v-model="confirmPassword"
                  @input="validatePassword"
                  class="input-field pr-10"
                  placeholder="Repite tu contraseña"
                  required
                />

                <button type="button" @click="confirmPasswordVisible = !confirmPasswordVisible" class="absolute right-3 top-9 text-gray-500">
        <svg v-if="confirmPasswordVisible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <EyeSlashIcon/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5C7.305 4.5 3.64 7.855 2.295 12c1.345 4.145 5.01 7.5 9.705 7.5s8.36-3.355 9.705-7.5c-1.345-4.145-5.01-7.5-9.705-7.5zM12 15.5c-1.933 0-3.5-1.567-3.5-3.5S10.067 8.5 12 8.5s3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z" />
        </svg>
      </button>
              </div>
            </div>
          </div>

          <div class="text-sm mt-2 grid grid-cols-2 gap-2">
    <p class="flex items-center gap-2" :class="{ 'text-green-500': passwordCriteria.length, 'text-red-500': !passwordCriteria.length }">
      <CheckIcon class="text-[#0096C7] font-bold w-[20px]"/> Mínimo 8 caracteres
    </p>
    <p class="flex items-center gap-2" :class="{ 'text-green-500': passwordCriteria.uppercase, 'text-red-500': !passwordCriteria.uppercase }">
      <CheckIcon class="text-[#0096C7] font-bold w-[20px]"/>  Al menos una mayúscula
    </p>
    <p class="flex items-center gap-2" :class="{ 'text-green-500': passwordCriteria.special, 'text-red-500': !passwordCriteria.special }">
      <CheckIcon class="text-[#0096C7] font-bold w-[20px]"/>  Un carácter especial (&%$#!@)
    </p>
    <p class="flex items-center gap-2" :class="{ 'text-green-500': passwordCriteria.number, 'text-red-500': !passwordCriteria.number }">
      <CheckIcon class="text-[#0096C7] font-bold w-[20px]"/>  Un número
    </p>
    <p class="flex items-center gap-2" :class="{ 'text-green-500': passwordCriteria.match, 'text-red-500': !passwordCriteria.match }">
      <CheckIcon class="text-[#0096C7] font-bold w-[20px]"/>  Las contraseñas coinciden
    </p>
  </div>

          <!-- Botón de registro -->
          <button type="button" @click="onSubmit" class="btn-primary">
            Registrarse
          </button>
        </form>

        <div class="text-center mt-6 text-[var(--text-subtle)]">
          ¿Ya tienes cuenta?
          <router-link :to="{ name: 'login' }" class="text-[var(--c-info)] font-semibold hover:underline">
            Iniciar Sesión
          </router-link>
        </div>
      </div>

      <div
        class="hidden lg:flex items-center justify-center shadow-lg backdrop-blur-lg mt-20"
        style="width: 580px; height: 500px; border-radius: 8px"
      >
        <img
          src="../assets/img/Login.jpg"
          alt="Imagen de registro"
          class="w-[500px] h-[450px] object-cover"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-field {
  width: 100%;
  margin-top: 0.25rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--c-bg-2);
  border-radius: 0.5rem;
  outline: none;
  background: var(--body-bg);
  color: var(--body-text);
  transition: border-color 0.2s;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background: var(--btn-bg);
  color: var(--btn-text);
  font-weight: bold;
  border-radius: 0.5rem;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background: var(--btn-hover);
}
</style>
