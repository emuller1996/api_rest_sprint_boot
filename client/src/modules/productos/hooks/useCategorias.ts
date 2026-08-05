// src/hooks/useCategorias.ts
import { useState, useEffect, useCallback } from "react";
import { categoriaService } from "../services/categoria.service";
import { Categoria } from "../types/categoria.types";

interface UseCategoriasReturn {
  categorias: Categoria[];
  loading: boolean;
  error: string | null;
  refreshCategorias: () => Promise<void>;
}

export const useCategorias = (): UseCategoriasReturn => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await categoriaService.getAllCategorias();
      setCategorias(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar categorías");
      console.error("Error fetching categorias:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  

  return {
    categorias,
    loading,
    error,
    refreshCategorias: fetchCategorias,
  };
};