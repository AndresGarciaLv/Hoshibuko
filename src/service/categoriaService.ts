import api from "./apiService";
import type { CategoriaDTO, CreateCategoriaDTO } from "@/interfaces/CategoriaDTO";

export const CategoriaService = {
  /**
   * Obtiene todas las categorías (GET /Categoria).
   */
  async getAll(): Promise<CategoriaDTO[]> {
    const response = await api.get("/Categoria");
    return response.data as CategoriaDTO[];
  },

  /**
   * Obtiene una categoría por ID (GET /Categoria/{id}).
   */
  async getById(id: number): Promise<CategoriaDTO> {
    const response = await api.get(`/Categoria/${id}`);
    return response.data as CategoriaDTO;
  },

  /**
   * Crea una nueva categoría (POST /Categoria).
   */
  async create(categoriaDto: CreateCategoriaDTO): Promise<boolean> {
    // Se asume que un status 200 indica éxito en la creación
    const response = await api.post("/Categoria", categoriaDto);
    return response.status === 200 || response.status === 201;
  },

  /**
   * Actualiza una categoría existente (PUT /Categoria/{id}).
   */
  async update(id: number, categoriaDto: CreateCategoriaDTO): Promise<boolean> {
    // Se asume que un status 204 indica que la actualización fue exitosa
    const response = await api.put(`/Categoria/${id}`, categoriaDto);
    return response.status === 204;
  },

  /**
   * Elimina una categoría por ID (DELETE /Categoria/{id}).
   */
  async delete(id: number): Promise<boolean> {
    // Se asume que un status 204 indica que la eliminación fue exitosa
    const response = await api.delete(`/Categoria/${id}`);
    return response.status === 204;
  },
};

export default CategoriaService;
