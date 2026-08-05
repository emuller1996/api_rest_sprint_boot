// src/hooks/useProducts.ts
import { useState, useEffect, useCallback } from "react";
import { productService } from "../services/product.service";
import { Product, ProductResponse, ProductFilters } from "../types/product.types";
import { ProductFormData } from "../schemas/product.schema";

interface UseProductsReturn {
  products: Product[];
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
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  changePage: (page: number) => void;
  changeSize: (size: number) => void;
  changeName: (nombre: string) => void;
  refreshProducts: () => Promise<void>;
  createProduct: (data: ProductFormData) => Promise<Product>;
  updateProduct: (id: number, data: ProductFormData) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
  getProduct: (id: number) => Promise<Product>;
}

export const useProducts = (initialFilters: ProductFilters = {}): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
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
  const [filters, setFilters] = useState<ProductFilters>({
    page: 0,
    size: 10,
    nombre: "",
    ...initialFilters,
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.getProducts(filters);
      
      setProducts(response.data);
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
      setError(err instanceof Error ? err.message : "Error al cargar productos");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleSetFilters = useCallback((newFilters: ProductFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const changePage = useCallback((page: number) => {
    const pageZeroBased = page - 1;
    handleSetFilters({ page: pageZeroBased });
  }, [handleSetFilters]);

  const changeSize = useCallback((size: number) => {
    handleSetFilters({ size, page: 0 });
  }, [handleSetFilters]);


  const changeName = useCallback((nombre: string) => {
    handleSetFilters({ nombre, page: 0 });
  }, [handleSetFilters]);
  

  const refreshProducts = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  // Crear producto
  const createProduct = useCallback(async (data: ProductFormData): Promise<Product> => {
    try {
      const newProduct = await productService.createProduct(data);
      await refreshProducts();
      return newProduct;
    } catch (err) {
      console.error("Error creating product:", err);
      throw err;
    }
  }, [refreshProducts]);

  // Actualizar producto
  const updateProduct = useCallback(async (id: number, data: ProductFormData): Promise<Product> => {
    try {
      const updatedProduct = await productService.updateProduct(id, data);
      await refreshProducts();
      return updatedProduct;
    } catch (err) {
      console.error(`Error updating product ${id}:`, err);
      throw err;
    }
  }, [refreshProducts]);

  // Eliminar producto
  const deleteProduct = useCallback(async (id: number): Promise<void> => {
    try {
      await productService.deleteProduct(id);
      await refreshProducts();
    } catch (err) {
      console.error(`Error deleting product ${id}:`, err);
      throw err;
    }
  }, [refreshProducts]);

  // Obtener producto por ID
  const getProduct = useCallback(async (id: number): Promise<Product> => {
    try {
      return await productService.getProductById(id);
    } catch (err) {
      console.error(`Error getting product ${id}:`, err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  return {
    products,
    pagination,
    loading,
    error,
    filters,
    setFilters: handleSetFilters,
    changePage,
    changeSize,
    changeName,
    refreshProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
  };
};