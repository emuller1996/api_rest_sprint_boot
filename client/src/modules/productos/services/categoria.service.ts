// src/services/categoria.service.ts
import axiosInstance from "../../../config/axios";
import { Categoria, CategoriaResponse, CategoriaFilters } from "../types/categoria.types";

class CategoriaService {
  private baseUrl = "/categorias"; // Ajusta según tu endpoint

  // Obtener todas las categorías (sin paginación para selects)
  async getAllCategorias(): Promise<Categoria[]> {
    try {
      const response = await axiosInstance.get<Categoria[]>(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error("Error fetching categorias:", error);
      throw error;
    }
  }

  // Obtener categorías con paginación
  async getCategorias(filters: CategoriaFilters = {}): Promise<CategoriaResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.page !== undefined) params.append('page', filters.page.toString());
      if (filters.size !== undefined) params.append('size', filters.size.toString());
      if (filters.search) params.append('search', filters.search);

      const url = `${this.baseUrl}?${params.toString()}`;
      const response = await axiosInstance.get<CategoriaResponse>(url);
      
      return response.data;
    } catch (error) {
      console.error("Error fetching categorias:", error);
      throw error;
    }
  }

  // Crear categoría
  async createCategoria(categoria: Partial<Categoria>): Promise<Categoria> {
    try {
      const response = await axiosInstance.post<Categoria>(this.baseUrl, categoria);
      return response.data;
    } catch (error) {
      console.error("Error creating categoria:", error);
      throw error;
    }
  }

  // Actualizar categoría
  async updateCategoria(id: number, categoria: Partial<Categoria>): Promise<Categoria> {
    try {
      const response = await axiosInstance.put<Categoria>(`${this.baseUrl}/${id}`, categoria);
      return response.data;
    } catch (error) {
      console.error(`Error updating categoria ${id}:`, error);
      throw error;
    }
  }

  // Eliminar categoría
  async deleteCategoria(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting categoria ${id}:`, error);
      throw error;
    }
  }
}

export const categoriaService = new CategoriaService();