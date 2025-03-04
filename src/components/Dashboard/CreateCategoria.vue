<template>

  <Dialog
  :visible="props.visible"
  @update:visible="(val) => emit('update:visible', val)"
  :modal="true"
  :style="{ width: '400px' }"
  header="Nueva Categoría"
  >
    <div class="flex flex-col gap-4">
      <div>
        <label for="nombre" class="block font-bold mb-1">
          Nombre <span class="text-red-500">*</span>
        </label>
        <InputText
          id="nombre"
          v-model.trim="nombre"
          required
          autofocus
          :invalid="submitted && !nombre"
          fluid
        />
        <small v-if="submitted && !nombre" class="text-red-500">
          El nombre es obligatorio.
        </small>
      </div>
    </div>

    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" text @click="closeModal" />
      <Button label="Guardar" icon="pi pi-check" @click="saveCategory" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import CategoriaService from '@/service/categoriaService'
import type { CreateCategoriaDTO } from '@/interfaces/CategoriaDTO'

// defineProps para la prop "visible"
// defineProps
const props = defineProps<{ visible: boolean }>()
// defineEmits
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'category-created'): void
}>()


// Estado local para el campo de la nueva categoría y validación
const nombre = ref('')
const submitted = ref(false)
const toast = useToast()

function closeModal() {
  emit('update:visible', false)
  resetForm()
}

function resetForm() {
  nombre.value = ''
  submitted.value = false
}

async function saveCategory() {
  submitted.value = true
  if (!nombre.value.trim()) return

  const createDto: CreateCategoriaDTO = { nombre: nombre.value.trim() }
  try {
    // Se asume que CategoriaService.create retorna un booleano de éxito
    const success = await CategoriaService.create(createDto)
    if (success) {
      toast.add({
        severity: 'success',
        summary: 'Creada',
        detail: 'Categoría creada exitosamente',
        life: 3000,
      })
      emit('category-created')
      closeModal()
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo crear la categoría',
        life: 3000,
      })
    }
  } catch (error) {
    console.error('Error creando categoría:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo guardar la categoría',
      life: 3000,
    })
  }
}
</script>

<style scoped>
/* Puedes agregar estilos adicionales aquí si lo deseas */
</style>
