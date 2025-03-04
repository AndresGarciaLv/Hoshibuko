import api from "./apiService";
import type { AutoresDTO, CreateAutoresDTO } from "@/interfaces/AutoresDTO";

export const AutorService = {
  /**
   * Obtiene todos los autores  (GET /Autor).
   */
  async getAll(): Promise<AutoresDTO[]> {
    const response = await api.get("/Autor");
    return response.data as AutoresDTO[];
  },

  /**
   * Obtiene una un autor  por ID (GET /Autor/{id}).
   */
  async getById(id: number): Promise<AutoresDTO> {
    const response = await api.get(`/Autor/${id}`);
    return response.data as AutoresDTO;
  },

  /**
   * Crea una nueva categoría (POST /Autor).
   */
  async create(autorDto: CreateAutoresDTO): Promise<boolean> {
    // Se asume que un status 200 indica éxito en la creación
    const response = await api.post("/Autor", autorDto);
    return response.status === 200 || response.status === 201;
  },

  /**
   * Actualiza un autor existente (PUT /Autor/{id}).
   */
  async update(id: number, autorDto: CreateAutoresDTO): Promise<boolean> {
    // Se asume que un status 204 indica que la actualización fue exitosa
    const response = await api.put(`/Autor/${id}`, autorDto);
    return response.status === 204;
  },

  /**
   * Elimina un autor por ID (DELETE /Autor/{id}).
   */
  async delete(id: number): Promise<boolean> {
    // Se asume que un status 204 indica que la eliminación fue exitosa
    const response = await api.delete(`/Autor/${id}`);
    return response.status === 204;
  },
};

export default AutorService;
