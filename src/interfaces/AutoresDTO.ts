// DTO para obtener una categoría (equivalente a tu CategoriaDTO en C#)
export interface AutoresDTO {
  id: number;
  nombre: string;
}

// DTO para crear/actualizar una categoría
export interface CreateAutoresDTO {
  nombre: string;
}
