// src/services/product.service.ts
import axiosInstance from "../../../config/axios";
import { Product, ProductResponse, ProductFilters } from "../types/product.types";

class ProductService {
  private baseUrl = "/productos"; // Ajusta según tu endpoint

  // Obtener productos con paginación
  async getProducts(filters: ProductFilters = {}): Promise<ProductResponse> {
    try {
      const params = new URLSearchParams();
      
      // Agregar parámetros de paginación
      if (filters.page !== undefined) params.append('page', filters.page.toString());
      if (filters.size !== undefined) params.append('size', filters.size.toString());
      if (filters.nombre !== undefined) params.append('nombre', filters.nombre.toString());

      const url = `${this.baseUrl}?${params.toString()}`;
      const response = await axiosInstance.get<ProductResponse>(url);
      
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  // Obtener un producto por ID
  async getProductById(id: number): Promise<Product> {
    try {
      const response = await axiosInstance.get<Product>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  // Crear producto
  async createProduct(product: Partial<Product>): Promise<Product> {
    try {
      const response = await axiosInstance.post<Product>(this.baseUrl, product);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  // Actualizar producto
  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    try {
      const response = await axiosInstance.put<Product>(`${this.baseUrl}/${id}`, product);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  }

  // Eliminar producto
  async deleteProduct(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }

  // Actualizar stock
  async updateStock(id: number, quantity: number): Promise<Product> {
    try {
      const response = await axiosInstance.patch<Product>(`${this.baseUrl}/${id}/stock`, { quantity });
      return response.data;
    } catch (error) {
      console.error(`Error updating stock for product ${id}:`, error);
      throw error;
    }
  }
}

export const productService = new ProductService();