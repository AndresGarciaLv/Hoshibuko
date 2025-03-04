<template>
  <div>
    <!-- Botón (estilo Tailwind) para abrir el diálogo del perfil -->
    <div
      class="sidebar-link cursor-pointer"
      @click="openDialog"
    >
      <Cog6ToothIcon class="w-5 h-5 text-[var(--c-accent)]" />
      Mi Perfil
    </div>

    <!-- Diálogo modal para ver y editar el perfil del usuario -->
    <Dialog
      v-model:visible="isDialogOpen"
      header="Perfil de Usuario"
      :modal="true"
      :closable="true"
      style="width: 500px"
      :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    >
      <div class="p-4">
        <div class="flex flex-col gap-4">
          <!-- Formulario para editar datos del usuario -->
          <form @submit.prevent="saveProfile">
            <!-- Nombre -->
            <div>
              <label class=" mt-2 block font-medium mb-1">Nombre <span class="text-red-500">*</span></label>
              <InputText
                v-model="user.nombre"
                class="w-full"
                :class="{ 'p-invalid': submitted && !user.nombre }"
              />
              <small v-if="submitted && !user.nombre" class="text-red-500">
                El nombre es requerido.
              </small>
            </div>

            <!-- Username -->
            <div>
              <label class=" mt-2 block font-medium mb-1">Username <span class="text-red-500">*</span></label>
              <InputText
                v-model.trim="user.username"
                class="w-full"
                :class="{ 'p-invalid': submitted && !user.username }"
              />
              <small v-if="submitted && !user.username" class="text-red-500">
                El username es requerido.
              </small>
            </div>

            <!-- Contraseña (opcional si el usuario ya existe) -->
            <div>
              <label class=" mt-2 block font-medium mb-1">
                Contraseña <span v-if="!user.id" class="text-red-500">*</span>
              </label>
              <InputText
                type="password"
                v-model.trim="user.password"
                class="w-full"
                :placeholder="user.id ? 'Dejar en blanco para mantener la contraseña' : ''"
              />
              <!-- Validación: si se está creando (no hay ID) y no hay password -->
              <small v-if="submitted && !user.password && !user.id" class="text-red-500">
                La contraseña es requerida.
              </small>
              <!-- Validación discreta de la contraseña (solo si se ingresa algo) -->
              <small v-if="user.password && !isPasswordValid" class="text-red-500">
                La contraseña debe tener al menos 8 caracteres, incluyendo minúsculas, mayúsculas, números y caracteres especiales.
              </small>
            </div>

            <!-- Email -->
            <div>
              <label class="mt-2 block font-medium mb-1">Correo electrónico <span class="text-red-500">*</span></label>
              <InputText
                v-model="user.email"
                class="w-full"
                :class="{ 'p-invalid': submitted && !user.email }"
              />
              <small v-if="submitted && !user.email" class="text-red-500">
                El email es requerido.
              </small>
            </div>

            <!-- Botones -->
            <div class="flex justify-end gap-2 mt-4">
              <Button label="Cancelar" class="p-button-text" @click="closeDialog" />
              <Button label="Guardar" type="submit" />
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast';

import type { UsuarioDTO } from '@/interfaces/UsuarioDTO';
import type { UpdateUsuarioDTO } from '@/interfaces/UsuarioDTO';

import UsuarioService from '@/service/usuarioService';
import { Cog6ToothIcon } from '@heroicons/vue/24/outline';

// Controla la visibilidad del diálogo
const isDialogOpen = ref(false);

// El objeto "user" contiene los datos del usuario a editar/crear
// Permite almacenar password opcionalmente
const user = ref<Partial<UsuarioDTO & { password?: string }>>({});

// Control de validación de campos
const submitted = ref(false);
const toast = useToast();

// Validación de la contraseña
const isPasswordValid = computed(() => {
  // Si el usuario ya existe (tiene ID) y no ingresa contraseña => consideramos válida (no se modifica)
  if (user.value.id && !user.value.password) return true;
  // Si no hay contraseña => no es válida (para creación)
  if (!user.value.password) return false;
  // Verifica el patrón: mínimo 8 caracteres, 1 minúscula, 1 mayúscula, 1 número y 1 caracter especial
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(user.value.password);
});

// Carga los datos del usuario autenticado (sin password)
async function loadUser() {
  try {
    const data = await UsuarioService.getAuthenticatedUser();
    // Asignamos solo los campos que deseamos mostrar
    user.value = {
      id: data.id,
      nombre: data.nombre,
      username: data.username,
      email: data.email,
      roles: data.roles,
    };
  } catch (error) {
    console.error('Error al cargar los datos del usuario:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cargar los datos del usuario',
    });
  }
}

// Abre el diálogo y carga los datos
function openDialog() {
  isDialogOpen.value = true;
  loadUser();
}

// Cierra el diálogo
function closeDialog() {
  isDialogOpen.value = false;
  submitted.value = false;
}

// Guarda (crea o actualiza) el perfil del usuario
async function saveProfile() {
  submitted.value = true;

  // Validaciones mínimas
  if (!user.value.nombre || !user.value.username || !user.value.email) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Los campos Nombre, Username y Email son requeridos',
    });
    return;
  }

  // Si es nuevo usuario (no hay ID) y la contraseña no es válida
  if (!user.value.id && !isPasswordValid.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'La contraseña es requerida o no cumple los requisitos de seguridad.',
    });
    return;
  }

  try {
    if (user.value.id) {
      // ACTUALIZAR USUARIO
      const updatedUser: UpdateUsuarioDTO = {
        id: user.value.id,
        nombre: user.value.nombre!,
        username: user.value.username!,
        email: user.value.email!,
        // Si la contraseña está vacía, no se envía y no se modifica
        password: user.value.password && user.value.password.trim() !== '' ? user.value.password : undefined,
        roles: user.value.roles || [],
      };
      const updated = await UsuarioService.update(String(user.value.id), updatedUser);
      if (updated) {
        toast.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'Perfil actualizado exitosamente',
        });
      }
    } else {
    }
    // Cierra el modal
    closeDialog();
  } catch (error) {
    console.error('Error guardando usuario:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo guardar el usuario',
    });
  }
}
</script>

<style scoped>
/* Estilos personalizados */
</style>
