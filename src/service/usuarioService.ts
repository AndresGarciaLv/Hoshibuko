// src/service/usuarioService.ts

import api from "./apiService";
import type { UsuarioDTO } from "@/interfaces/UsuarioDTO";

/**
 * Servicio para gestionar usuarios.
 */
export const UsuarioService = {
  /**
   * Obtiene la lista de todos los usuarios (GET /api/Usuario).
   * Requiere el rol "Admin" según tu controlador.
   */
  async getAll(): Promise<UsuarioDTO[]> {
    const response = await api.get("/Usuario");
    return response.data as UsuarioDTO[];
  },

  /**
   * Obtiene un usuario por ID (GET /api/Usuario/{id}).
   * Requiere estar autenticado (rol Admin o el mismo usuario).
   */
  async getById(id: string): Promise<UsuarioDTO> {
    const response = await api.get(`/Usuario/${id}`);
    return response.data as UsuarioDTO;
  },

  /**
   * Crea un nuevo usuario (POST /api/Usuario?password=...).
   * Requiere el rol "Admin".
   * @param usuarioDto Datos del usuario (sin Id).
   * @param password Contraseña que se pasa por query string.
   * @returns El usuario creado (con su Id).
   */
  async create(usuarioDto: UsuarioDTO, password: string): Promise<UsuarioDTO> {
    // Se pasa la contraseña como query param
    const response = await api.post(`/Usuario?password=${encodeURIComponent(password)}`, usuarioDto);
    // El backend responde con CreatedAtAction (201) y el usuario creado en el body
    return response.data as UsuarioDTO;
  },

  /**
   * Actualiza un usuario existente (PUT /api/Usuario/{id}).
   * Requiere estar autenticado. Si no es Admin, debe ser el mismo usuario.
   * @param id Identificador del usuario a actualizar.
   * @param usuarioDto Nuevos datos del usuario.
   * @returns El usuario actualizado.
   */
  async update(id: string, usuarioDto: UsuarioDTO): Promise<UsuarioDTO> {
    const response = await api.put(`/Usuario/${id}`, usuarioDto);
    return response.data as UsuarioDTO;
  },

  /**
   * Elimina un usuario por ID (DELETE /api/Usuario/{id}).
   * Requiere el rol "Admin".
   * @param id Identificador del usuario a eliminar.
   * @returns true si se eliminó con éxito, false si no se encontró o hubo error.
   */
  async delete(id: string): Promise<boolean> {
    const response = await api.delete(`/Usuario/${id}`);
    return response.status === 204;
  },

  /**
   * Obtiene los datos del usuario autenticado (GET /api/Usuario/me).
   * Requiere estar autenticado.
   * @returns Los datos del usuario en sesión.
   */
  async getAuthenticatedUser(): Promise<UsuarioDTO> {
    const response = await api.get("/Usuario/me");
    return response.data as UsuarioDTO;
  },
};

export default UsuarioService;
