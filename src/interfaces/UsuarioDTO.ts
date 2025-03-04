// src/interfaces/UsuarioDTO.ts
export interface UsuarioDTO {
  id?: string;      // Puede ser opcional si el backend lo genera
  nombre: string;
  username: string;
  email: string;
  roles?: string[]; // Puede ser opcional o requerido, dependiendo de tu lógica
}
