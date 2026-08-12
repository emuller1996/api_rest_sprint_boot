import { useCallback, useEffect, useState } from "react";
import { Facturas, FacturasFilters } from "../facturas/types/facturas.types";
import { productService } from "../productos/services/product.service";
import { facturasService } from "../facturas/services/facturas.service";

interface UseFacturasReturn {
  facturas: Facturas[];
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
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FacturasFilters>({
    page: 0,
    size: 10,
    ...initialFilters,
  });

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
    pagination,
    loading,
    error,
    filters,
    setFilters: handleSetFilters,
    refreshFacturas,
  };
};
