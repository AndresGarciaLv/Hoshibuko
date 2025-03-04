// DTO para crear un libro (equivalente a tu CreateLibroDTO en C#)
export interface CreateLibroDTO {
  nombre: string;
  descripcion: string;
  autorId: number;
  categoriaIds: string[];
}

// DTO para obtener un libro (equivalente a tu GetLibroDTO en C#)
export interface GetLibroDTO {
  id: number;
  nombre: string;
  descripcion: string;
  autorId: number;
  autorNombre: string;       // Nombre del autor
  categoriaIds: number[];    // IDs de categorías
  categorias: string[];      // Nombres de categorías
  urlImagen: string | null;         // URL de la imagen
}
