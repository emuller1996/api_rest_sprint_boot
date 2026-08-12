import { Cliente } from "../../clientes/types/cliente.types";

export interface Facturas {
  id: number;
  numeroFactura: string;
  total: number;
  estado: string;
  cliente:Cliente
}
export interface FacturasResponse {
  data: Facturas[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface FacturasFilters {
  page?: number;
  size?: number;
}

export interface FacturaItem {
  productoId: number;
  cantidad: number;
  precio: number;
  nombreProducto?: string; // Para visualización en la tabla
}

export interface FacturaCreateRequest {
  clienteId: number;
  detalles: FacturaItem[];
  fecha?: string;
}
