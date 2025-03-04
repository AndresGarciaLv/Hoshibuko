<template>
  <!-- Contenedor principal en flex para Sidebar y contenido -->
  <div
    class="flex h-screen"
    :style="{ backgroundColor: 'var(--body-bg)', color: 'var(--body-text)' }"
  >
    <!-- Sidebar a la izquierda -->
    <div class="">
      <AdminSidebar />
    </div>

    <!-- Contenido principal -->
    <div class="flex-1 overflow-y-auto p-6">
      <div>
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
                :disabled="!selectedLibros || !selectedLibros.length"
              />
            </template>

            <template #end>
              <!-- Opcional: Import/Export -->
              <Button label="Export CSV" icon="pi pi-upload" severity="secondary" @click="exportCSV" />
            </template>
          </Toolbar>

          <!-- DataTable con libros -->
          <DataTable
            ref="dt"
            v-model:selection="selectedLibros"
            :value="libros"
            dataKey="id"
            paginator
            :rows="10"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} libros"
          >
            <template #header>
              <div class="flex flex-wrap gap-2 items-center justify-between">
                <h4 class="m-0 font-bold">Gestión de Libros</h4>
               <div :style="{ backgroundColor: 'var(--body-bg)', borderColor: 'var(--text-subtle)', color: 'var(--body-text)' }"
                  class="flex items-center gap-2 px-3 py-2 border rounded-md transition-all
                         bg-white focus-within:border-blue-500"
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
            <Column field="autorNombre" header="Autor" sortable style="min-width: 12rem" />

            <!-- Imagen de portada -->
            <Column header="Portada" style="min-width: 8rem">
              <template #body="slotProps">
                <img
                  v-if="slotProps.data.urlImagen"
                  :src="slotProps.data.urlImagen"
                  alt="Portada"
                  class="rounded"
                  style="width: 64px"
                />
                <span v-else>Sin imagen</span>
              </template>
            </Column>

            <!-- Categorías -->


            <Column
  field="categorias"
  header="Categorías"
  style="min-width: 14rem"
></Column>



            <!-- Acciones -->
            <Column header="Acciones" :exportable="false" style="min-width: 8rem">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  outlined
                  rounded
                  class="mr-2"
                  @click="editLibro(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  outlined
                  rounded
                  severity="danger"
                  @click="confirmDeleteLibro(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Diálogo para Crear/Editar Libro -->
        <Dialog v-model:visible="libroDialog" :style="{ width: '450px' }" header="Detalles del Libro" :modal="true">
          <div class="flex flex-col gap-6">
            <!-- Gestión de Imagen manual con <input type="file"> -->
            <div class="mt-4">
              <label class="block font-bold mb-3">Imagen del Libro</label>
              <!-- Vista previa -->
              <div v-if="imagePreview || libro.urlImagen" class="flex flex-col items-center gap-2">
                <img
                  :src="imagePreview || libro.urlImagen || ''"
                  alt="Portada"
                  class="block m-auto pb-4"
                  style="max-width: 200px;"
                />
                <div class="flex gap-2">
                  <Button label="Eliminar Imagen" icon="pi pi-times" class="p-button-danger" @click="removeImage" outlined size="small" />
                </div>
              </div>
              <div v-else class="p-3 border-dashed border-2 border-gray-300 text-center">
                <span>No hay imagen seleccionada.</span>
              </div>

              <!-- Input file manual -->
              <div class="mt-3 flex flex-col items-center">
  <!-- Etiqueta como botón con estilo Tailwind -->
  <label
    for="fileInput"
    class="inline-block cursor-pointer bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition-colors"
  >
    Seleccionar imagen
  </label>
  <!-- input oculto que dispara el evento change al seleccionar archivo -->
  <input
    type="file"
    id="fileInput"
    accept="image/*"
    @change="onImageSelected"
    class="hidden"
  />
</div>
            </div>

            <!-- Campos del Libro -->
            <div>
              <label for="nombre" class="block font-bold mb-3">Nombre <span class="text-red-500">*</span></label>
              <InputText
                id="nombre"
                v-model.trim="libro.nombre"
                required
                autofocus
                :invalid="submitted && !libro.nombre"
                fluid
              />
              <small v-if="submitted && !libro.nombre" class="text-red-500">El nombre es requerido.</small>
            </div>

            <div>
              <label for="descripcion" class="block font-bold mb-3">Descripción <span class="text-red-500">*</span></label>
              <Textarea id="descripcion" v-model="libro.descripcion" rows="3" cols="20" fluid />
            </div>

            <div>
              <label for="autor" class="block font-bold mb-3">Autor <span class="text-red-500">*</span></label>
              <Select
                id="autor"
                v-model="libro.autorId"
                :options="autores"
                optionLabel="nombre"
                optionValue="id"
                filter
                placeholder="Selecciona Autor"
                class="w-full"
              />
            </div>

            <div class="mt-4">
              <label for="categorias" class="block font-bold mb-3">Categorías </label>
              <MultiSelect
    id="categorias"
    v-model="libro.categoriaIds"
    :options="categorias"
    optionLabel="nombre"
    optionValue="id"
    filter
    placeholder="Selecciona Categorías"
    display="chip"
    class="w-full"
  >
    <template #footer>
      <div class="p-3 flex justify-between">
        <Button
          label="Nuevo"
          severity="primary"
          text
          size="small"
          icon="pi pi-plus"
          @click="showAddCategoryModal = true"
        />
      </div>
    </template>
  </MultiSelect>

  <!-- Modal para añadir categoría -->
  <CreateCategoria
    :visible="showAddCategoryModal"
    @update:visible="showAddCategoryModal = $event"
    @category-created="loadCategorias"
  />


            </div>
          </div>

          <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
            <Button label="Guardar" icon="pi pi-check" @click="saveLibro" />
          </template>
        </Dialog>

        <!-- Diálogo de confirmación para un solo libro -->
        <Dialog v-model:visible="deleteLibroDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
          <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="libro">¿Seguro que deseas eliminar <b>{{ libro.nombre }}</b>?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteLibroDialog = false" />
            <Button label="Sí" icon="pi pi-check" @click="deleteLibro" />
          </template>
        </Dialog>

        <!-- Diálogo de confirmación para múltiples libros -->
        <Dialog v-model:visible="deleteLibrosDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
          <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="libro">¿Seguro que deseas eliminar los libros seleccionados?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteLibrosDialog = false" />
            <Button label="Sí" icon="pi pi-check" text @click="deleteSelectedLibros" />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from '@/components/Sidebar.vue';
import { ref, onMounted, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';

import LibroService from '@/service/libroService';
import AutorService from '@/service/autorService';
import CategoriaService from '@/service/categoriaService';
import LibroImagenService from '@/service/libroImagenService';

import type { GetLibroDTO, CreateLibroDTO } from '@/interfaces/LibroDTO';
import type { AutoresDTO } from '@/interfaces/AutoresDTO';
import type { CategoriaDTO } from '@/interfaces/CategoriaDTO';
import CreateCategoria from '@/components/Dashboard/CreateCategoria.vue';
const showAddCategoryModal = ref(false)

const dt = ref();
const libros = ref<GetLibroDTO[]>([]);
const selectedLibros = ref<GetLibroDTO[] | null>(null);
const autores = ref<AutoresDTO[]>([]);
const categorias = ref<CategoriaDTO[]>([]);

const selectedImage = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

const libro = ref<Partial<GetLibroDTO>>({
  autorId: 0,
  categoriaIds: []
});

const libroDialog = ref(false);
const deleteLibroDialog = ref(false);
const deleteLibrosDialog = ref(false);
const submitted = ref(false);
const toast = useToast();

// Filtro global
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Computed para la URL de subida
const uploadUrl = computed(() => {
  return libro.value.id
    ? `https://localhost:7061/api/libros/${libro.value.id}/imagen`
    : '';
});

onMounted(async () => {
  libros.value = await LibroService.getAll();
  autores.value = await AutorService.getAll();
  categorias.value = await CategoriaService.getAll();
  await loadLibros();
});

async function loadLibros() {
  try {
    const data = await LibroService.getAll();
    libros.value = data.map(libroItem => ({
      ...libroItem,
      urlImagen: libroItem.urlImagen
    ? `${import.meta.env.VITE_IMAGE_BASE}${libroItem.urlImagen}`
    : null,
      categorias: libroItem.categorias?.join(', ') ?? ''
    }));

  } catch (error) {
    console.error('Error cargando libros:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cargar la lista de libros'
    });
  }
}

/** Abre el diálogo para crear un nuevo libro */
function openNew() {
  libro.value = { autorId: null, categoriaIds: [] };
  selectedImage.value = null;
  imagePreview.value = null;
  submitted.value = false;
  libroDialog.value = true;
}

function hideDialog() {
  libroDialog.value = false;
  submitted.value = false;
}

/**
 * Se llama al seleccionar manualmente un archivo <input type="file" />
 */
function onImageSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files || !target.files.length) {
    return;
  }
  selectedImage.value = target.files[0];
  // Genera vista previa local
  imagePreview.value = URL.createObjectURL(selectedImage.value);
}

/** Elimina la imagen tanto localmente como en el backend si ya existe */
async function removeImage() {
  // Si el libro ya tiene ID y urlImagen, se elimina del backend
  if (libro.value.id && libro.value.urlImagen) {
    const success = await LibroImagenService.deleteImage(libro.value.id);
    if (success) {
      libro.value.urlImagen = null;
      imagePreview.value = null;
      selectedImage.value = null;
      toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Imagen eliminada', life: 3000 });
      return;
    }
  }
  // Si no existe en backend, simplemente limpiamos
  selectedImage.value = null;
  imagePreview.value = null;
}

/** Edita un libro existente */
function editLibro(libroSeleccionado: GetLibroDTO) {
  libro.value = { ...libroSeleccionado };
  if (!libro.value.categoriaIds && libroSeleccionado.categorias) {
    libro.value.categoriaIds = libroSeleccionado.categorias;
  }
  imagePreview.value = libro.value.urlImagen || null;
  selectedImage.value = null;
  libroDialog.value = true;
}

/** Crea o actualiza el libro y sube la imagen manualmente usando LibroImagenService */
async function saveLibro() {
  submitted.value = true;
  if (!libro.value.nombre || !libro.value.nombre.trim()) {
    return;
  }

  // 1. Determinar si es un libro nuevo o existente
  const isNew = !libro.value.id;  // si no hay ID, es nuevo

  const libroDto: CreateLibroDTO = {
    nombre: libro.value.nombre.trim(),
    descripcion: libro.value.descripcion || '',
    autorId: libro.value.autorId || 0,
    categoriaIds: libro.value.categoriaIds || []
  };

  try {
    let success = false;

    // 2. Crear o actualizar según sea el caso
    if (!libro.value.id) {
      // Crear
      const newId = await LibroService.create(libroDto);
      if (newId) {
        libro.value.id = newId;
        success = true;
      }
    } else {
      // Actualizar
      success = await LibroService.update(libro.value.id, libroDto);
    }

    // 3. Subir imagen si hay un ID y un archivo seleccionado
    if (success && libro.value.id && selectedImage.value) {
      let imageUrl: string | null = null;
      if (libro.value.urlImagen) {
        imageUrl = await LibroImagenService.updateImage(libro.value.id, selectedImage.value);
      } else {
        imageUrl = await LibroImagenService.uploadImage(libro.value.id, selectedImage.value);
      }
      if (imageUrl) {
        libro.value.urlImagen = imageUrl;
      }
    }

    // 4. Mostrar el mensaje según sea creación o edición
    if (success) {
      toast.add({
        severity: 'success',
        summary: isNew ? 'Creado' : 'Actualizado',
        detail: isNew ? 'Libro creado exitosamente' : 'Libro actualizado',
        life: 3000
      });
      libroDialog.value = false;
      await loadLibros();
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: isNew ? 'No se pudo crear el libro' : 'No se pudo actualizar el libro',
        life: 3000
      });
    }
  } catch (error) {
    console.error('Error guardando libro:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el libro', life: 3000 });
  }
}


function confirmDeleteLibro(libroSeleccionado: GetLibroDTO) {
  libro.value = { ...libroSeleccionado };
  deleteLibroDialog.value = true;
}

async function deleteLibro() {
  try {
    if (libro.value.id) {
      const success = await LibroService.delete(libro.value.id);
      if (success) {
        toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Libro eliminado', life: 3000 });
        await loadLibros();
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el libro', life: 3000 });
      }
    }
  } catch (error) {
    console.error('Error eliminando libro:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el libro', life: 3000 });
  } finally {
    deleteLibroDialog.value = false;
    libro.value = {};
  }
}

function confirmDeleteSelected() {
  deleteLibrosDialog.value = true;
}

async function deleteSelectedLibros() {
  if (!selectedLibros.value || !selectedLibros.value.length) {
    deleteLibrosDialog.value = false;
    return;
  }
  try {
    for (const l of selectedLibros.value) {
      if (l.id) {
        await LibroService.delete(l.id);
      }
    }
    toast.add({ severity: 'success', summary: 'Eliminados', detail: 'Libros eliminados', life: 3000 });
    await loadLibros();
  } catch (error) {
    console.error('Error eliminando libros:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar uno o más libros', life: 3000 });
  } finally {
    selectedLibros.value = null;
    deleteLibrosDialog.value = false;
  }
}

function exportCSV() {
  dt.value?.exportCSV();
}

async function loadCategorias() {
  try {
    categorias.value = await CategoriaService.getAll()
  } catch (error) {
    console.error('Error cargando categorías:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cargar la lista de categorías',
    })
  }
}

onMounted(() => {
  loadCategorias()
})


</script>

<style scoped>
/* Estilos opcionales */
.border-dashed {
  border-style: dashed;
}
</style>
