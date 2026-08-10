// src/types/categoria.types.ts
export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface ClienteCreateResponse {
    message :string,
    data:Cliente
}

export interface ClienteResponse {
  data: Cliente[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ClienteFilters {
  page?: number;
  size?: number;
  search?: string;
}