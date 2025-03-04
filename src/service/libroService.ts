import api from "./apiService";
import type { CreateLibroDTO, GetLibroDTO } from "@/interfaces/LibroDTO";

// Si tu API retorna estos campos capitalizados ("TotalLibros", "PaginaActual", etc.),
// definimos la interfaz tal cual para no tener problemas de asignación:
interface CatalogResponse {
  TotalLibros: number;
  PaginaActual: number;
  TotalPaginas: number;
  Libros: GetLibroDTO[];
}

export const LibroService = {
  /**
   * Obtiene todos los libros (GET /libro).
   */
  async getAll(): Promise<GetLibroDTO[]> {
    const response = await api.get("Libro");
    return response.data as GetLibroDTO[];
  },

  /**
   * Obtiene un libro por ID (GET /libro/{id}).
   */
  async getById(id: number): Promise<GetLibroDTO> {
    const response = await api.get(`/Libro/${id}`);
    return response.data as GetLibroDTO;
  },

  /**
   * Crea un nuevo libro (POST /libro).
   */
/**
 * Crea un nuevo libro (POST /libro) y devuelve el ID del libro creado.
 */
async create(libroDto: CreateLibroDTO): Promise<number | null> {
  try {
    // Llamada al endpoint de creación
    const response = await api.post("/Libro", libroDto);

    // Si el servidor devuelve status 200 y en el body está el ID
    if (response.status === 200) {
      // Asumiendo que el controlador .NET retorna el ID directamente:
      // return Ok(newLibroId);
      return response.data as number;
    }

    // Si no es 200, retornamos null para indicar error
    return null;
  } catch (error) {
    console.error("Error creando libro:", error);
    return null;
  }
},


  /**
   * Actualiza un libro existente (PUT /libro/{id}).
   */
  async update(id: number, libroDto: CreateLibroDTO): Promise<boolean> {
    // Se asume que si la API responde con status 204, la actualización fue exitosa
    const response = await api.put(`/Libro/${id}`, libroDto);
    return response.status === 204;
  },

  /**
   * Elimina un libro por ID (DELETE /libro/{id}).
   */
  async delete(id: number): Promise<boolean> {
    // Se asume que si la API responde con status 204, la eliminación fue exitosa
    const response = await api.delete(`/Libro/${id}`);
    return response.status === 204;
  },

  /**
   * Obtiene el catálogo de libros con paginación (GET /libro/catalogo).
   */
  async getCatalog(page = 1, pageSize = 10): Promise<CatalogResponse> {
    const response = await api.get("/Libro/catalogo", { params: { page, pageSize } });
    return response.data as CatalogResponse;
  },

  /**
   * Obtiene libros de una categoría específica (GET /libro/categoria/{categoriaId}).
   */
  async getByCategory(categoriaId: number): Promise<GetLibroDTO[]> {
    const response = await api.get(`/Libro/categoria/${categoriaId}`);
    return response.data as GetLibroDTO[];
  },
};

export default LibroService;
