// Representa la estructura básica de un usuario (por ejemplo, para lectura o listado)
export interface UsuarioDTO {
  id?: string;      // El backend lo genera
  nombre: string;
  username: string;
  email: string;
  roles?: string[];
}

// Representa los datos necesarios para crear un usuario
export interface CrearUsuarioDTO {
  id?: string;
  nombre: string;
  username: string;
  email: string;
  password: string; // Se envía en el body de la petición
  roles?: string[];
}

// Representa los datos para actualizar un usuario
// (puedes ajustarlo según tu lógica de negocio)
export interface UpdateUsuarioDTO {
  id?: string;
  nombre: string;
  username: string;
  email: string;
  password?: string;
  roles?: string[];
}
