import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { Cliente } from "../../../types/cliente.types";
import {
  clienteSchema,
  ClientetFormData,
} from "../../../schemas/cliente.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useClientes } from "../../../hooks/useClientes";

interface FormClienteProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientetFormData) => Promise<void>;
  cliente?: Cliente | null;
  isLoading?: boolean;
}

export default function FormCliente({
  isOpen,
  onClose,
  onSubmit,
  cliente,
  isLoading = false,
}: FormClienteProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ClientetFormData>({
    resolver: zodResolver(clienteSchema),
  });

  const handleFormSubmit = async (data: ClientetFormData) => {
    try {
      console.log(data);
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Error al enviar formulario:", error);
    }
  };

  const { createCliente } =  useClientes()

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="md"
      popup
      dismissible={!isSubmitting && !isLoading}
    >
      <ModalHeader>{cliente ? "Editar Cliente" : "Nuevo Cliente"}</ModalHeader>
      <ModalBody>
        <div className="space-y-6">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nombre del Cliente *
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

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Telefono del Cliente
              </label>
              <input
                {...register("telefono")}
                type="text"
                className={`w-full rounded-lg border ${
                  errors.telefono ? "border-red-500" : "border-gray-200"
                } px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-400 focus:outline-none`}
                disabled={isSubmitting || isLoading}
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.telefono.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Direccion del Cliente
              </label>
              <input
                {...register("direccion")}
                type="text"
                className={`w-full rounded-lg border ${
                  errors.direccion ? "border-red-500" : "border-gray-200"
                } px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-400 focus:outline-none`}
                disabled={isSubmitting || isLoading}
              />
              {errors.direccion && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.direccion.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-200"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {cliente ? "Actualizando..." : "Creando..."}
                  </>
                ) : (
                  <>{cliente ? "Actualizar" : "Crear"} Cliente</>
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
