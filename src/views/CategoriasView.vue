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
            <Button label="Nueva" icon="pi pi-plus" class="mr-2" @click="openNew" />
            <Button
              label="Eliminar"
              icon="pi pi-trash"
              severity="danger"
              outlined
              @click="confirmDeleteSelected"
              :disabled="!selectedCategorias || !selectedCategorias.length"
            />
          </template>

          <template #end>
            <!-- Opcional: Import/Export -->
            <Button label="Export CSV" icon="pi pi-upload" severity="secondary" @click="exportCSV" />
          </template>
        </Toolbar>

        <!-- DataTable con categorías -->
        <DataTable
          ref="dt"
          v-model:selection="selectedCategorias"
          :value="categorias"
          dataKey="id"
          paginator
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} categorías"
        >
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <h4 class="m-0 font-bold">Gestión de Categorías</h4>
              <div
                class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md
                       bg-white focus-within:border-blue-500 transition-colors"
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
          <Column field="nombre" header="Nombre" sortable style="min-width: 6rem" />


          <!-- Acciones -->
          <Column header="Acciones" :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                outlined
                rounded
                class="mr-2"
                @click="editCategoria(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                outlined
                rounded
                severity="danger"
                @click="confirmDeleteCategoria(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Diálogo para Crear/Editar Categoría -->
      <Dialog v-model:visible="categoriaDialog" :style="{ width: '450px' }" header="Detalles de la Categoría" :modal="true">
        <div class="flex flex-col gap-6">
          <div>
            <label for="nombre" class="block font-bold mb-3"
              >Nombre <span class="text-red-500">*</span></label
            >
            <InputText
              id="nombre"
              v-model.trim="categoria.nombre"
              required
              autofocus
              :invalid="submitted && !categoria.nombre"
              fluid
            />
            <small v-if="submitted && !categoria.nombre" class="text-red-500"
              >El nombre es requerido.</small
            >
          </div>


        </div>

        <template #footer>
          <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
          <Button label="Guardar" icon="pi pi-check" @click="saveCategoria" />
        </template>
      </Dialog>

      <!-- Diálogo de confirmación para una sola categoría -->
      <Dialog v-model:visible="deleteCategoriaDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle !text-3xl" />
          <span v-if="categoria"
            >¿Seguro que deseas eliminar la categoría <b>{{ categoria.nombre }}</b>?</span
          >
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="deleteCategoriaDialog = false" />
          <Button label="Sí" icon="pi pi-check" @click="deleteCategoria" />
        </template>
      </Dialog>

      <!-- Diálogo de confirmación para múltiples categorías -->
      <Dialog v-model:visible="deleteCategoriasDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle !text-3xl" />
          <span v-if="selectedCategorias && selectedCategorias.length"
            >¿Seguro que deseas eliminar las categorías seleccionadas?</span
          >
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="deleteCategoriasDialog = false" />
          <Button label="Sí" icon="pi pi-check" text @click="deleteSelectedCategorias" />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from '@/components/Sidebar.vue';
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';

// Importamos el servicio de categorías
import CategoriaService from '@/service/categoriaService';

// Tipos de categorías
import type { CategoriaDTO, CreateCategoriaDTO } from '@/interfaces/CategoriaDTO';

// Referencia al DataTable
const dt = ref();

// Lista de categorías y selección
const categorias = ref<CategoriaDTO[]>([]);
const selectedCategorias = ref<CategoriaDTO[] | null>(null);

// Objeto de categoría para crear/editar
const categoria = ref<Partial<CategoriaDTO>>({
  nombre: '',
});

// Control de diálogos
const categoriaDialog = ref(false);
const deleteCategoriaDialog = ref(false);
const deleteCategoriasDialog = ref(false);

// Control de validación
const submitted = ref(false);

// Toast para notificaciones
const toast = useToast();

// Filtro global
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Cargar categorías al montar
onMounted(async () => {
  await loadCategorias();
});

// Función para cargar la lista de categorías
async function loadCategorias() {
  try {
    const data = await CategoriaService.getAll();
    categorias.value = data;
  } catch (error) {
    console.error('Error cargando categorías:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cargar la lista de categorías',
    });
  }
}

// Abrir diálogo para nueva categoría
function openNew() {
  categoria.value = { nombre: '' };
  submitted.value = false;
  categoriaDialog.value = true;
}

// Cerrar diálogo
function hideDialog() {
  categoriaDialog.value = false;
  submitted.value = false;
}

// Editar categoría
function editCategoria(cat: CategoriaDTO) {
  categoria.value = { ...cat };
  categoriaDialog.value = true;
}

// Guardar categoría (crear o actualizar)
async function saveCategoria() {
  submitted.value = true;
  if (!categoria.value.nombre || !categoria.value.nombre.trim()) {
    return; // El nombre es requerido
  }

  try {
    let success = false;
    // Determinar si es nueva o existente
    if (!categoria.value.id) {
      // Crear
      const createDto: CreateCategoriaDTO = {
        nombre: categoria.value.nombre.trim(),

      };
      success = await CategoriaService.create(createDto);
    } else {
      // Actualizar
      const updateDto: CreateCategoriaDTO = {
        nombre: categoria.value.nombre.trim(),

      };
      success = await CategoriaService.update(categoria.value.id, updateDto);
    }

    if (success) {
      toast.add({
        severity: 'success',
        summary: categoria.value.id ? 'Actualizada' : 'Creada',
        detail: categoria.value.id
          ? 'Categoría actualizada exitosamente'
          : 'Categoría creada exitosamente',
        life: 3000,
      });
      categoriaDialog.value = false;
      await loadCategorias();
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: categoria.value.id
          ? 'No se pudo actualizar la categoría'
          : 'No se pudo crear la categoría',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error guardando categoría:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo guardar la categoría',
      life: 3000,
    });
  }
}

// Confirmar eliminación de una sola categoría
function confirmDeleteCategoria(cat: CategoriaDTO) {
  categoria.value = { ...cat };
  deleteCategoriaDialog.value = true;
}

// Eliminar una sola categoría
async function deleteCategoria() {
  try {
    if (categoria.value.id) {
      const success = await CategoriaService.delete(categoria.value.id);
      if (success) {
        toast.add({
          severity: 'success',
          summary: 'Eliminada',
          detail: 'Categoría eliminada',
          life: 3000,
        });
        await loadCategorias();
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la categoría',
          life: 3000,
        });
      }
    }
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo eliminar la categoría',
      life: 3000,
    });
  } finally {
    deleteCategoriaDialog.value = false;
    categoria.value = {};
  }
}

// Confirmar eliminación de múltiples categorías
function confirmDeleteSelected() {
  deleteCategoriasDialog.value = true;
}

// Eliminar múltiples categorías
async function deleteSelectedCategorias() {
  if (!selectedCategorias.value || !selectedCategorias.value.length) {
    deleteCategoriasDialog.value = false;
    return;
  }
  try {
    for (const cat of selectedCategorias.value) {
      if (cat.id) {
        await CategoriaService.delete(cat.id);
      }
    }
    toast.add({
      severity: 'success',
      summary: 'Eliminadas',
      detail: 'Categorías eliminadas',
      life: 3000,
    });
    await loadCategorias();
  } catch (error) {
    console.error('Error eliminando categorías:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo eliminar una o más categorías',
      life: 3000,
    });
  } finally {
    selectedCategorias.value = null;
    deleteCategoriasDialog.value = false;
  }
}

// Exportar CSV
function exportCSV() {
  dt.value?.exportCSV();
}
</script>

<style scoped>
/* Estilos opcionales */
</style>
