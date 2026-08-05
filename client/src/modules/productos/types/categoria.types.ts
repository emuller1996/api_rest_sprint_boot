// src/types/categoria.types.ts
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface CategoriaResponse {
  data: Categoria[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface CategoriaFilters {
  page?: number;
  size?: number;
  search?: string;
}