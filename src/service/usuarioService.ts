// src/service/usuarioService.ts

import api from "./apiService";
import type { UsuarioDTO, CrearUsuarioDTO, UpdateUsuarioDTO } from "@/interfaces/UsuarioDTO";
import axios from "axios";

/**
 * Función auxiliar para gestionar los errores provenientes de Axios u otras fuentes.
 * Lanza un error con un mensaje amigable para el usuario.
 * @param error Error recibido de la petición.
 */
function handleError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message ||
      error.response?.statusText ||
      "Error en la respuesta del servidor";
    throw new Error(message);
  }
  if (error instanceof Error) {
    throw new Error(error.message);
  }
  throw new Error("Error desconocido");
}

/**
 * Servicio para gestionar usuarios.
 */
export const UsuarioService = {
  /**
   * Obtiene la lista de todos los usuarios (GET /api/Usuario).
   * Requiere el rol "Admin" según el backend.
   */
  async getAll(): Promise<UsuarioDTO[]> {
    try {
      const response = await api.get("/Usuario");
      return response.data as UsuarioDTO[];
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Obtiene un usuario por ID (GET /api/Usuario/{id}).
   * Requiere estar autenticado (rol Admin o el mismo usuario).
   */
  async getById(id: string): Promise<UsuarioDTO> {
    try {
      const response = await api.get(`/Usuario/${id}`);
      return response.data as UsuarioDTO;
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Crea un nuevo usuario (POST /api/Usuario).
   * Requiere el rol "Admin".
   * @param usuarioDto Datos del usuario a crear, incluyendo la contraseña en el body.
   * @returns El usuario creado (con su Id).
   */
  async create(usuarioDto: CrearUsuarioDTO): Promise<UsuarioDTO> {
    try {
      const response = await api.post("/Usuario", usuarioDto);
      return response.data as UsuarioDTO;
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Actualiza un usuario existente (PUT /api/Usuario/{id}).
   * Requiere estar autenticado. Si no es Admin, debe ser el mismo usuario.
   * @param id Identificador del usuario a actualizar.
   * @param usuarioDto Nuevos datos del usuario, incluyendo password opcional.
   * @returns El usuario actualizado.
   */
  async update(id: string, usuarioDto: UpdateUsuarioDTO): Promise<UsuarioDTO> {
    try {
      const response = await api.put(`/Usuario/${id}`, usuarioDto);
      return response.data as UsuarioDTO;
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Elimina un usuario por ID (DELETE /api/Usuario/{id}).
   * Requiere el rol "Admin".
   * @param id Identificador del usuario a eliminar.
   * @returns true si se eliminó con éxito, false en caso de error.
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await api.delete(`/Usuario/${id}`);
      return response.status === 204;
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Obtiene los datos del usuario autenticado (GET /api/Usuario/me).
   * Requiere estar autenticado.
   * @returns Los datos del usuario en sesión.
   */
  async getAuthenticatedUser(): Promise<UsuarioDTO> {
    try {
      const response = await api.get("/Usuario/me");
      return response.data as UsuarioDTO;
    } catch (error) {
      handleError(error);
    }
  },
};

export default UsuarioService;
