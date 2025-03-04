import api from './apiService'; // Instancia de Axios o similar

/**
 * Servicio para gestionar las imágenes de los libros.
 */
export const LibroImagenService = {
  /**
   * Sube una nueva imagen para un libro.
   * @param libroId - Identificador del libro.
   * @param file - Archivo de imagen a subir.
   * @returns La URL de la imagen subida o null en caso de error.
   */
  async uploadImage(libroId: number, file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`libros/${libroId}/imagen`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        // Se espera que la respuesta contenga { url: string }
        return response.data.url;
      }
      return null;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      return null;
    }
  },

  /**
   * Obtiene la URL de la imagen de portada de un libro.
   * @param libroId - Identificador del libro.
   * @returns La URL de la imagen o null si no se encuentra o hay error.
   */
  async getImage(libroId: number): Promise<string | null> {
    try {
      const response = await api.get(`libros/${libroId}/imagen`);
      if (response.status === 200) {
        return response.data.url;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener la imagen:', error);
      return null;
    }
  },

  /**
   * Actualiza la imagen de portada de un libro reemplazando la imagen existente.
   * @param libroId - Identificador del libro.
   * @param file - Nuevo archivo de imagen.
   * @returns La URL de la imagen actualizada o null en caso de error.
   */
  async updateImage(libroId: number, file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.put(`libros/${libroId}/imagen`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        return response.data.url;
      }
      return null;
    } catch (error) {
      console.error('Error al actualizar la imagen:', error);
      return null;
    }
  },

  /**
   * Elimina la imagen de portada de un libro.
   * @param libroId - Identificador del libro.
   * @returns true si la eliminación fue exitosa, false en caso contrario.
   */
  async deleteImage(libroId: number): Promise<boolean> {
    try {
      const response = await api.delete(`libros/${libroId}/imagen`);
      return response.status === 204;
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      return false;
    }
  },
};

export default LibroImagenService;
