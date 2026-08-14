import { useCallback, useEffect, useState } from "react";
import { Facturas, FacturasFilters, FacturaCreateRequest } from "../facturas/types/facturas.types";
import { productService } from "../productos/services/product.service";
import { facturasService } from "../facturas/services/facturas.service";
import { clienteService } from "../clientes/services/cliente.service";
import { Cliente } from "../clientes/types/cliente.types";

interface UseFacturasReturn {
  facturas: Facturas[];
  clientes: Cliente[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  };
  loading: boolean;
  error: string | null;
  filters: FacturasFilters;
  setFilters: (filters: FacturasFilters) => void;

  refreshFacturas: () => Promise<void>;
  createFactura: (data: FacturaCreateRequest) => Promise<{ success: boolean; message: string }>;
  fetchClientes: () => Promise<void>;
}

export const useFacturas = (
  initialFilters: FacturasFilters = {},
): UseFacturasReturn => {
  const [facturas, setFacturas] = useState<Facturas[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
    empty: true,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FacturasFilters>({
    page: 0,
    size: 10,
    ...initialFilters,
  });
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const fetchFacturas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await facturasService.getFacturas(filters);

      setFacturas(response.data);
      setPagination({
        currentPage: response.pageNumber,
        pageSize: response.pageSize,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        first: response.first,
        last: response.last,
        empty: response.empty,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar productos",
      );
      console.error("Error fetching facturas:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refreshFacturas = useCallback(async () => {
    await fetchFacturas();
  }, [fetchFacturas]);

  const fetchClientes = useCallback(async () => {
    try {
      const data = await clienteService.getAllClientes();
      setClientes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar clientes");
    }
  }, []);

  const createFactura = useCallback(async (data: FacturaCreateRequest) => {
    try {
      setIsCreating(true);
      await facturasService.createFactura(data);
      await refreshFacturas();
      return { success: true, message: "Factura creada exitosamente" };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al crear factura";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setIsCreating(false);
    }
  }, [refreshFacturas]);


  useEffect(() => {
      fetchFacturas();
    }, [filters]);

  const handleSetFilters = useCallback((newFilters: FacturasFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  return {
    facturas,
    clientes,
    pagination,
    loading,
    error,
    filters,
    setFilters: handleSetFilters,
    refreshFacturas,
    createFactura,
    fetchClientes,
  };
};
