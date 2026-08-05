// src/components/FormProductos.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, Spinner, ModalHeader, ModalBody } from "flowbite-react";
import {
  ProductFormData,
  productSchema,
} from "../../../schemas/product.schema";
import { Product } from "../../../types/product.types";
import { useCategorias } from "../../../hooks/useCategorias";

interface FormProductosProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  product?: Product | null;
  isLoading?: boolean;
}

export default function FormProductos({
  isOpen,
  onClose,
  onSubmit,
  product,
  isLoading = false,
}: FormProductosProps) {
  const {
    categorias,
    loading: loadingCategorias,
    error: errorCategorias,
  } = useCategorias();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nombre: "",
      precio: 0,
      stock: 0,
      categoriaId: undefined,
    },
  });

  const selectedCategoriaId = watch("categoriaId");

  // Cargar datos del producto si estamos editando
  useEffect(() => {
    if (product) {
      setValue("nombre", product.nombre);
      setValue("precio", product.precio);
      setValue("stock", product.stock);
      setValue("categoriaId", product.categoriaId);
    } else {
      reset();
    }
  }, [product, setValue, reset]);

  // Resetear el formulario cuando se cierre el modal
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Error al enviar formulario:", error);
    }
  };

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="md"
      popup
      dismissible={!isSubmitting && !isLoading}
    >
      <ModalHeader className="bg-orange-400 ">
        {product ? "Editar Producto" : "Nuevo Producto"}
      </ModalHeader>
      <hr className="pb-2 text-gray-300" />

      <ModalBody>
        <div className="space-y-6">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Campo: Nombre */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nombre del Producto *
              </label>
              <input
                {...register("nombre")}
                type="text"
                className={`w-full rounded-lg border ${
                  errors.nombre ? "border-red-500" : "border-gray-200"
                } px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-400 focus:outline-none`}
                placeholder="Ej: Laptop HP Pavilion"
                disabled={isSubmitting || isLoading}
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            {/* Campo: Categoría (Select) */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Categoría
              </label>
              <div className="relative">
                <select
                  {...register("categoriaId", { valueAsNumber: true })}
                  className={`w-full rounded-lg border ${
                    errors.categoriaId ? "border-red-500" : "border-gray-200"
                  } px-4 py-2 pr-10 focus:border-transparent focus:ring-2 focus:ring-orange-400 focus:outline-none ${
                    loadingCategorias ? "cursor-not-allowed opacity-70" : ""
                  }`}
                  disabled={isSubmitting || isLoading || loadingCategorias}
                >
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>

                {loadingCategorias && (
                  <div className="absolute top-1/2 right-3 -translate-y-1/2">
                    <Spinner size="sm" color="warning" />
                  </div>
                )}
              </div>

              {errorCategorias && (
                <p className="mt-1 text-sm text-red-600">
                  Error al cargar categorías: {errorCategorias}
                </p>
              )}

              {errors.categoriaId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.categoriaId.message}
                </p>
              )}

              {selectedCategoriaId && (
                <p className="mt-1 text-xs text-green-600">
                  Categoría seleccionada:{" "}
                  {categorias.find((c) => c.id === selectedCategoriaId)?.nombre}
                </p>
              )}
            </div>

            {/* Campo: Precio */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Precio *
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  {...register("precio", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  className={`w-full rounded-lg border ${
                    errors.precio ? "border-red-500" : "border-gray-200"
                  } px-4 py-2 pl-8 focus:border-transparent focus:ring-2 focus:ring-orange-400 focus:outline-none`}
                  placeholder="0.00"
                  disabled={isSubmitting || isLoading}
                />
              </div>
              {errors.precio && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.precio.message}
                </p>
              )}
            </div>

            {/* Campo: Stock */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Stock *
              </label>
              <input
                {...register("stock", { valueAsNumber: true })}
                type="number"
                step="1"
                min="0"
                className={`w-full rounded-lg border ${
                  errors.stock ? "border-red-500" : "border-gray-200"
                } px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-400 focus:outline-none`}
                placeholder="0"
                disabled={isSubmitting || isLoading}
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.stock.message}
                </p>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-200"
                disabled={isSubmitting || isLoading || loadingCategorias}
              >
                {isSubmitting || isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {product ? "Actualizando..." : "Creando..."}
                  </>
                ) : (
                  <>{product ? "Actualizar" : "Crear"} Producto</>
                )}
              </Button>
              <Button
                type="button"
                color="gray"
                onClick={onClose}
                disabled={isSubmitting || isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </ModalBody>
    </Modal>
  );
}
