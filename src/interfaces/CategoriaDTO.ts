// DTO para obtener una categoría (equivalente a tu CategoriaDTO en C#)
export interface CategoriaDTO {
  id: number;
  nombre: string;
}

// DTO para crear/actualizar una categoría
export interface CreateCategoriaDTO {
  nombre: string;
}
