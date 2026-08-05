// src/components/ListProductos.tsx
import { useState } from "react";
import { Pagination, Spinner } from "flowbite-react";
import { HiPencil, HiTrash, HiPlus } from "react-icons/hi";
import { Product, ProductFilters } from "../../types/product.types";
import { ProductFormData } from "../../schemas/product.schema";
import FormProductos from "./components/FormProductos";
import { useProducts } from "../../hooks/useProducts";

const StockIndicator = ({ stock }: { stock: number }) => {
  let color = "text-green-600";
  let bgColor = "bg-green-100";

  if (stock <= 0) {
    color = "text-red-600";
    bgColor = "bg-red-100";
  } else if (stock <= 5) {
    color = "text-yellow-600";
    bgColor = "bg-yellow-100";
  } else if (stock <= 20) {
    color = "text-orange-600";
    bgColor = "bg-orange-100";
  }

  return (
    <span
      className={`rounded-full ${bgColor} px-2 py-1 text-xs font-medium ${color}`}
    >
      {stock <= 0
        ? "Sin Stock"
        : stock <= 5
          ? "Stock Bajo"
          : `${stock} unidades`}
    </span>
  );
};

export default function ListProductos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const {
    products,
    pagination,
    loading,
    error,
    changePage,
    changeSize,
    refreshProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    changeName,
  } = useProducts({ page: 0, size: 5, nombre: "" });

  const onPageChange = (page: number) => {
    changePage(page);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeSize(Number(e.target.value));
  };

  const onChangeName = (nombre: string) => {
    changeName(nombre);
    setSearchTerm(nombre);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = async (id: number) => {
    try {
      setLoadingAction(true);
      const product = await getProduct(id);
      setSelectedProduct(product);
      setModalOpen(true);
    } catch (error) {
      console.error("Error al cargar producto:", error);
    } finally {
      setLoadingAction(false);
    }
  };

  // Eliminar producto
  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      return;
    }

    try {
      setLoadingAction(true);
      await deleteProduct(id);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    } finally {
      setLoadingAction(false);
    }
  };

  // Enviar formulario (crear o actualizar)
  const handleSubmit = async (data: ProductFormData) => {
    try {
      if (selectedProduct) {
        // Actualizar
        await updateProduct(selectedProduct.id, data);
      } else {
        // Crear
        await createProduct(data);
      }
      setModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error al guardar producto:", error);
      throw error;
    }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Productos</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => onChangeName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 pr-10 focus:border-transparent focus:ring-2 focus:ring-orange-400 focus:outline-none sm:w-64"
            />
            {loading && (
              <div className="absolute top-1/2 right-3 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-400 border-t-transparent"></div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <select
              value={pagination.pageSize}
              onChange={handleSizeChange}
              className="rounded-lg border border-gray-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-400 focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            <button
              onClick={handleCreate}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-white transition-all duration-300 hover:shadow-lg hover:shadow-orange-200"
            >
              <HiPlus className="h-5 w-5" />
              Nuevo
            </button>
          </div>
        </div>
      </div>

      {/* Mostrar error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-medium">Error al cargar productos</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Tabla de productos */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto p-4">
          {loading && products.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="xl" color="warning" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-gray-500">
              <svg
                className="h-16 w-16 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="mt-4 text-lg font-medium">No hay productos</p>
              <p className="text-sm">Intenta con otros filtros de búsqueda</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 font-semibold">ID</th>
                  <th className="pb-3 font-semibold">Nombre</th>
                  <th className="pb-3 font-semibold">Categoría</th>
                  <th className="pb-3 text-right font-semibold">Precio</th>
                  <th className="pb-3 text-center font-semibold">Stock</th>
                  <th className="pb-3 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b transition-colors last:border-0 hover:bg-orange-50"
                  >
                    <td className="py-3 font-mono text-sm">
                      #{String(product.id).padStart(4, "0")}
                    </td>
                    <td className="py-3 font-medium text-gray-800">
                      {product.nombre}
                    </td>
                    <td className="py-3">
                      <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                        {product.categoria || "Sin categoría"}
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold text-gray-800">
                      {formatPrice(product.precio)}
                    </td>
                    <td className="py-3 text-center">
                      <StockIndicator stock={product.stock} />
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="mr-2 inline-flex items-center rounded-lg p-2 text-orange-600 transition-colors hover:bg-orange-50 hover:text-orange-700"
                        disabled={loadingAction}
                      >
                        <HiPencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="inline-flex items-center rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                        disabled={loadingAction}
                      >
                        <HiTrash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Paginación con Flowbite */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-4 py-3 sm:flex-row">
            <p className="text-sm text-gray-500">
              Mostrando{" "}
              <span className="font-medium">
                {pagination.currentPage * pagination.pageSize + 1}
              </span>{" "}
              -{" "}
              <span className="font-medium">
                {Math.min(
                  (pagination.currentPage + 1) * pagination.pageSize,
                  pagination.totalElements,
                )}
              </span>{" "}
              de <span className="font-medium">{pagination.totalElements}</span>{" "}
              productos
            </p>

            <Pagination
              currentPage={pagination.currentPage + 1}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
              showIcons
              previousLabel="Anterior"
              nextLabel="Siguiente"
              className="flex"
              theme={{
                pages: {
                  selector: {
                    active: "bg-orange-500 text-white hover:bg-orange-600",
                  },
                },
              }}
            />
          </div>
        )}
      </div>

      {/* Modal de Formulario */}
      <FormProductos
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleSubmit}
        product={selectedProduct}
        isLoading={loadingAction}
      />
    </div>
  );
}
