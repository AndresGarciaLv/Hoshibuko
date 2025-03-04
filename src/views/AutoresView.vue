<template>
  <!-- Contenedor principal en flex para Sidebar y contenido -->
  <div class="flex h-screen" :style="{ backgroundColor: 'var(--body-bg)', color: 'var(--body-text)' }">
    <!-- Sidebar a la izquierda -->
    <div>
      <AdminSidebar />
    </div>

    <!-- Contenido principal -->
    <div class="flex-1 overflow-y-auto p-6">
      <div class="card">
        <Toolbar class="mb-6">
          <template #start>
            <Button label="Nuevo" icon="pi pi-plus" class="mr-2" @click="openNew" />
            <Button
              label="Eliminar"
              icon="pi pi-trash"
              severity="danger"
              outlined
              @click="confirmDeleteSelected"
              :disabled="!selectedAutores || !selectedAutores.length"
            />
          </template>
          <template #end>
            <Button label="Export CSV" icon="pi pi-upload" severity="secondary" @click="exportCSV" />
          </template>
        </Toolbar>

        <!-- DataTable con autores -->
        <DataTable
          ref="dt"
          v-model:selection="selectedAutores"
          :value="autores"
          dataKey="id"
          paginator
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} autores "
        >
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <h4 class="m-0 font-bold">Gestión de Autores</h4>
              <div
                class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white focus-within:border-blue-500 transition-colors"
              >
                <i class="pi pi-search text-gray-500"></i>
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Buscar..."
                  class="outline-none border-0 p-0 focus:ring-0"
                />
              </div>
            </div>
          </template>

          <!-- Selección múltiple -->
          <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>

          <!-- Columnas -->
          <Column field="id" header="ID" sortable style="min-width: 6rem" />
          <Column field="nombre" header="Nombre" sortable style="min-width: 12rem" />


          <!-- Acciones -->
          <Column header="Acciones" :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                outlined
                rounded
                class="mr-2"
                @click="editAutor(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                outlined
                rounded
                severity="danger"
                @click="confirmDeleteAutor(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Diálogo para Crear/Editar Autor -->
      <Dialog v-model:visible="autorDialog" :style="{ width: '450px' }" header="Detalles del Autor" :modal="true">
        <div class="flex flex-col gap-6">
          <div>
            <label for="nombre" class="block font-bold mb-3">
              Nombre <span class="text-red-500">*</span>
            </label>
            <InputText
              id="nombre"
              v-model.trim="autor.nombre"
              required
              autofocus
              :invalid="submitted && !autor.nombre"
              fluid
            />
            <small v-if="submitted && !autor.nombre" class="text-red-500">El nombre es requerido.</small>
          </div>

        </div>

        <template #footer>
          <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
          <Button label="Guardar" icon="pi pi-check" @click="saveAutor" />
        </template>
      </Dialog>

      <!-- Diálogo de confirmación para un solo autor -->
      <Dialog v-model:visible="deleteAutorDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle !text-3xl" />
          <span v-if="autor">¿Seguro que deseas eliminar el autor <b>{{ autor.nombre }}</b>?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="deleteAutorDialog = false" />
          <Button label="Sí" icon="pi pi-check" @click="deleteAutor" />
        </template>
      </Dialog>

      <!-- Diálogo de confirmación para múltiples autores -->
      <Dialog v-model:visible="deleteAutoresDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle !text-3xl" />
          <span v-if="selectedAutores && selectedAutores.length">
            ¿Seguro que deseas eliminar los autores seleccionados?
          </span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="deleteAutorDialog = false" />
          <Button label="Sí" icon="pi pi-check" text @click="deleteSelectedAutores" />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from '@/components/Sidebar.vue'
import { ref, onMounted } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { useToast } from 'primevue/usetoast'
import AutorService from '@/service/autorService'
import type { AutoresDTO, CreateAutoresDTO } from '@/interfaces/AutoresDTO'

const dt = ref()
const autores = ref<AutoresDTO[]>([])
const selectedAutores = ref<AutoresDTO[] | null>(null)

const autor = ref<Partial<AutoresDTO>>({
  nombre: '',
})

const autorDialog = ref(false)
const deleteAutorDialog = ref(false)
const deleteAutoresDialog = ref(false)
const submitted = ref(false)
const toast = useToast()

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

onMounted(async () => {
  await loadAutores()
})

async function loadAutores() {
  try {
    const data = await AutorService.getAll()
    autores.value = data
  } catch (error) {
    console.error('Error cargando autores:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cargar la lista de autores',
    })
  }
}

function openNew() {
  autor.value = { nombre: '' }
  submitted.value = false
  autorDialog.value = true
}

function hideDialog() {
  autorDialog.value = false
  submitted.value = false
}

function editAutor(aut: AutoresDTO) {
  autor.value = { ...aut }
  autorDialog.value = true
}

async function saveAutor() {
  submitted.value = true
  if (!autor.value.nombre || !autor.value.nombre.trim() ) {
    return
  }
  try {
    let success = false
    if (!autor.value.id) {
      const createDto: CreateAutoresDTO = {
        nombre: autor.value.nombre.trim(),

      }
      success = await AutorService.create(createDto)
    } else {
      const updateDto: CreateAutoresDTO = {
        nombre: autor.value.nombre.trim(),

      }
      success = await AutorService.update(autor.value.id, updateDto)
    }
    if (success) {
      toast.add({
        severity: 'success',
        summary: autor.value.id ? 'Actualizado' : 'Creado',
        detail: autor.value.id
          ? 'Autor actualizado exitosamente'
          : 'Autor creado exitosamente',
        life: 3000,
      })
      autorDialog.value = false
      await loadAutores()
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: autor.value.id
          ? 'No se pudo actualizar el autor'
          : 'No se pudo crear el autor',
        life: 3000,
      })
    }
  } catch (error) {
    console.error('Error guardando autor:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo guardar el autor',
      life: 3000,
    })
  }
}

function confirmDeleteSelected() {
  deleteAutoresDialog.value = true
}

function confirmDeleteAutor(aut: AutoresDTO) {
  autor.value = { ...aut }
  deleteAutorDialog.value = true
}

async function deleteAutor() {
  try {
    if (autor.value.id) {
      const success = await AutorService.delete(autor.value.id)
      if (success) {
        toast.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Autor eliminado',
          life: 3000,
        })
        await loadAutores()
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el autor',
          life: 3000,
        })
      }
    }
  } catch (error) {
    console.error('Error eliminando autor:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo eliminar el autor',
      life: 3000,
    })
  } finally {
    deleteAutorDialog.value = false
    autor.value = {}
  }
}

async function deleteSelectedAutores() {
  if (!selectedAutores.value || !selectedAutores.value.length) {
    deleteAutoresDialog.value = false
    return
  }
  try {
    for (const aut of selectedAutores.value) {
      if (aut.id) {
        await AutorService.delete(aut.id)
      }
    }
    toast.add({
      severity: 'success',
      summary: 'Eliminados',
      detail: 'Autores eliminados',
      life: 3000,
    })
    await loadAutores()
  } catch (error) {
    console.error('Error eliminando autores:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo eliminar uno o más autores',
      life: 3000,
    })
  } finally {
    selectedAutores.value = null
    deleteAutoresDialog.value = false
  }
}

function exportCSV() {
  dt.value?.exportCSV()
}
</script>

<style scoped>
/* Estilos opcionales */
</style>
