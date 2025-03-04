<template>
  <div class="flex h-screen" :style="{ backgroundColor: 'var(--body-bg)', color: 'var(--body-text)' }">
    <!-- Sidebar -->
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
              :disabled="!selectedUsuarios || !selectedUsuarios.length" />
          </template>
          <template #end>
            <Button label="Export CSV" icon="pi pi-upload" severity="secondary" @click="exportCSV" />
          </template>
        </Toolbar>

        <!-- DataTable de Usuarios -->
        <DataTable
          ref="dt"
          v-model:selection="selectedUsuarios"
          :value="usuarios"
          dataKey="id"
          paginator
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
        >
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <h4 class="m-0 font-bold">Gestión de Usuarios</h4>
             <div :style="{ backgroundColor: 'var(--body-bg)', borderColor: 'var(--text-subtle)', color: 'var(--body-text)' }"
                  class="flex items-center gap-2 px-3 py-2 rounded-md border transition-all">
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

          <!-- Columnas de usuario -->
          <Column field="nombre" header="Nombre" sortable style="min-width: 12rem" />
          <Column field="username" header="Username" sortable style="min-width: 12rem" />
          <Column field="email" header="Email" sortable style="min-width: 12rem" />
          <Column field="roles" header="Roles" sortable style="min-width: 10rem">
            <template #body="slotProps">
              <span>
                {{
                  slotProps.data.roles
                    ? slotProps.data.roles
                        .map(role => role === 'ADMIN' ? 'Administrador' : role === 'USER' ? 'Usuario' : role)
                        .join(', ')
                    : ''
                }}
              </span>
            </template>
          </Column>

          <!-- Acciones -->
          <Column header="Acciones" :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editUsuario(slotProps.data)" />
              <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteUsuario(slotProps.data)" />
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Diálogo para Crear/Editar Usuario -->
      <Dialog v-model:visible="usuarioDialog" :style="{ width: '450px' }" header="Detalles del Usuario" modal>
        <div class="flex flex-col gap-6">
          <div>
            <label for="nombre" class="block font-bold mb-3">
              Nombre <span class="text-red-500">*</span>
            </label>
            <InputText id="nombre" v-model.trim="usuario.nombre" required autofocus :invalid="submitted && !usuario.nombre" fluid />
            <small v-if="submitted && !usuario.nombre" class="text-red-500">El nombre es requerido.</small>
          </div>
          <div>
            <label for="username" class="block font-bold mb-3">
              Username <span class="text-red-500">*</span>
            </label>
            <InputText id="username" v-model.trim="usuario.username" required :invalid="submitted && !usuario.username" fluid />
            <small v-if="submitted && !usuario.username" class="text-red-500">El username es requerido.</small>
          </div>
          <div>
            <label for="email" class="block font-bold mb-3">
              Email <span class="text-red-500">*</span>
            </label>
            <InputText id="email" v-model.trim="usuario.email" required :invalid="submitted && !usuario.email" fluid />
            <small v-if="submitted && !usuario.email" class="text-red-500">El email es requerido.</small>
          </div>
          <div>
            <label for="password" class="block font-bold mb-3">
              Contraseña <span v-if="!usuario.id" class="text-red-500">*</span>
            </label>
            <InputText
              id="password"
              type="password"
              v-model.trim="usuario.password"
              :placeholder="usuario.id ? 'Dejar en blanco para mantener la contraseña' : ''"
              fluid
            />
            <!-- Si se envía en creación y está vacío -->
            <small v-if="submitted && !usuario.password && !usuario.id" class="text-red-500">
  La contraseña es requerida.
</small>

            <!-- Validación discreta de la contraseña -->
            <small v-if="usuario.password && !isPasswordValid" class="text-red-500">
  La contraseña debe tener al menos 8 caracteres, incluyendo minúsculas, mayúsculas, números y caracteres especiales.
</small>

          </div>
          <div>
            <label for="roles" class="block font-bold mb-3">
              Roles <span class="text-red-500">*</span>
            </label>
            <!-- Usamos el computed "usuarioRol" para trabajar con un solo rol -->
            <Select
              id="roles"
              v-model="usuarioRol"
              :options="rolesOptions"
              optionLabel="label"
              optionValue="value"
              filter
              placeholder="Selecciona un rol"
              class="w-full"
            />
          </div>
        </div>
        <template #footer>
          <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
          <Button label="Guardar" icon="pi pi-check" @click="saveUsuario" />
        </template>
      </Dialog>

      <!-- Diálogo de confirmación para eliminar un usuario -->
      <Dialog v-model:visible="deleteUsuarioDialog" :style="{ width: '450px' }" header="Confirmar" modal>
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle !text-3xl"></i>
          <span v-if="usuario">¿Seguro que deseas eliminar a <b>{{ usuario.nombre }}</b>?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="deleteUsuarioDialog = false" />
          <Button label="Sí" icon="pi pi-check" @click="deleteUsuario" />
        </template>
      </Dialog>

      <!-- Diálogo de confirmación para eliminar múltiples usuarios -->
      <Dialog v-model:visible="deleteUsuariosDialog" :style="{ width: '450px' }" header="Confirmar" modal>
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle !text-3xl"></i>
          <span>¿Seguro que deseas eliminar los usuarios seleccionados?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="deleteUsuariosDialog = false" />
          <Button label="Sí" icon="pi pi-check" text @click="deleteSelectedUsuarios" />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import AdminSidebar from '@/components/Sidebar.vue';
import { FilterMatchMode } from '@primevue/core/api';
import UsuarioService from '@/service/usuarioService';
import type { UsuarioDTO, CrearUsuarioDTO, UpdateUsuarioDTO } from '@/interfaces/UsuarioDTO';

// Refs y variables reactivas
const dt = ref();
const usuarios = ref<UsuarioDTO[]>([]);
const selectedUsuarios = ref<UsuarioDTO[] | null>(null);
// "usuario" es el objeto que se está creando o editando
const usuario = ref<Partial<UpdateUsuarioDTO>>({});
const usuarioDialog = ref(false);
const deleteUsuarioDialog = ref(false);
const deleteUsuariosDialog = ref(false);
const submitted = ref(false);
const toast = useToast();

// Opciones predefinidas para roles
const rolesOptions = [
  { label: 'Administrador', value: 'ADMIN' },
  { label: 'Usuario', value: 'USER' }
];

// Computed para mapear el rol único (solo se permite un rol)
const usuarioRol = computed({
  get: () => {
    return usuario.value.roles && usuario.value.roles.length ? usuario.value.roles[0] : '';
  },
  set: (value: string) => {
    usuario.value.roles = [value];
  }
});

// Computed para validar la contraseña
const isPasswordValid = computed(() => {
  // Si se está actualizando y no se ingresa contraseña, se considera válida
  if (usuario.value.id && !usuario.value.password) return true;
  if (!usuario.value.password) return false;
  // La contraseña debe tener: mínimo 8 caracteres, al menos una minúscula, una mayúscula, un número y un carácter especial
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(usuario.value.password);
});

// Filtro global para la DataTable
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Cargar usuarios desde el backend
async function loadUsuarios() {
  try {
    const data = await UsuarioService.getAll();
    usuarios.value = data.map(u => ({
      ...u,
      roles: u.roles || []
    }));
  } catch (error) {
    console.error('Error cargando usuarios:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cargar la lista de usuarios'
    });
  }
}

onMounted(() => {
  loadUsuarios();
});

// Abre el diálogo para crear un nuevo usuario
function openNew() {
  usuario.value = {};
  submitted.value = false;
  usuarioDialog.value = true;
}

// Cierra el diálogo y reinicia la validación
function hideDialog() {
  usuarioDialog.value = false;
  submitted.value = false;
}

// Prepara el diálogo para editar un usuario
function editUsuario(selected: UsuarioDTO) {
  usuario.value = { ...selected };
  usuarioDialog.value = true;
}

// Guarda (crea o actualiza) el usuario
async function saveUsuario() {
  submitted.value = true;
  if (!usuario.value.nombre || !usuario.value.username || !usuario.value.email) {
    return;
  }

  // Si se está creando, la contraseña debe ser válida
  if (!usuario.value.id && !isPasswordValid.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail:
        'La contraseña debe tener al menos 8 caracteres, incluyendo minúsculas, mayúsculas, números y caracteres especiales.',
      life: 3000,
    });
    return;
  }

  let success = false;
  try {
    if (!usuario.value.id) {
      // Crear usuario: se requiere password
      if (!usuario.value.password) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'La contraseña es requerida para crear un usuario',
        });
        return;
      }
      const newUser: CrearUsuarioDTO = {
        nombre: usuario.value.nombre,
        username: usuario.value.username,
        email: usuario.value.email,
        password: usuario.value.password,
        roles: usuario.value.roles || [],
      };
      const created = await UsuarioService.create(newUser);
      if (created && created.id) {
        usuario.value.id = created.id;
        success = true;
      }
      // Mensaje de éxito para creación
      if (success) {
        toast.add({
          severity: 'success',
          summary: 'Creado',
          detail: 'Usuario creado exitosamente',
          life: 3000,
        });
      }
    } else {
      // Actualizar usuario: la contraseña es opcional (puede enviarse vacía)
      const updatedUser: UpdateUsuarioDTO = {
        id: usuario.value.id,
        nombre: usuario.value.nombre,
        username: usuario.value.username,
        email: usuario.value.email,
        // Si la contraseña está vacía, se envía undefined para no modificarla
        password: usuario.value.password ? usuario.value.password : undefined,
        roles: usuario.value.roles || [],
      };
      const updated = await UsuarioService.update(String(usuario.value.id), updatedUser);
      success = !!updated;
      // Mensaje de éxito para actualización
      if (success) {
        toast.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'Usuario actualizado exitosamente',
          life: 3000,
        });
      }
    }
    if (success) {
      usuarioDialog.value = false;
      await loadUsuarios();
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: usuario.value.id ? 'No se pudo actualizar el usuario' : 'No se pudo crear el usuario',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error guardando usuario:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo guardar el usuario',
      life: 3000,
    });
  }
}


// Diálogo de confirmación para eliminar un usuario
function confirmDeleteUsuario(selected: UsuarioDTO) {
  usuario.value = { ...selected };
  deleteUsuarioDialog.value = true;
}

// Elimina un usuario
async function deleteUsuario() {
  try {
    if (usuario.value.id) {
      const success = await UsuarioService.delete(String(usuario.value.id));
      if (success) {
        toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Usuario eliminado', life: 3000 });
        await loadUsuarios();
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el usuario', life: 3000 });
      }
    }
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el usuario', life: 3000 });
  } finally {
    deleteUsuarioDialog.value = false;
    usuario.value = {};
  }
}

// Abre el diálogo para eliminar múltiples usuarios
function confirmDeleteSelected() {
  deleteUsuariosDialog.value = true;
}

// Elimina los usuarios seleccionados
async function deleteSelectedUsuarios() {
  if (!selectedUsuarios.value || !selectedUsuarios.value.length) {
    deleteUsuariosDialog.value = false;
    return;
  }
  try {
    for (const u of selectedUsuarios.value) {
      if (u.id) {
        await UsuarioService.delete(String(u.id));
      }
    }
    toast.add({ severity: 'success', summary: 'Eliminados', detail: 'Usuarios eliminados', life: 3000 });
    await loadUsuarios();
  } catch (error) {
    console.error('Error eliminando usuarios:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar uno o más usuarios', life: 3000 });
  } finally {
    selectedUsuarios.value = null;
    deleteUsuariosDialog.value = false;
  }
}

// Exporta la data de la DataTable a CSV
function exportCSV() {
  dt.value?.exportCSV();
}
</script>

<style scoped>
.border-dashed {
  border-style: dashed;
}
</style>
