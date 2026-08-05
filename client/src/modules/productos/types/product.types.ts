// src/types/product.types.ts
export interface Product {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoriaId?: number;
  categoria?: string; // Si el backend devuelve el nombre de la categoría
}

export interface ProductResponse {
  data: Product[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ProductFilters {
  page?: number;
  size?: number;
  nombre?: string;
}