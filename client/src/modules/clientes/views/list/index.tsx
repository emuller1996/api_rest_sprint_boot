import { Spinner } from "flowbite-react";
import { useClientes } from "../../hooks/useClientes";
import { Cliente } from "../../types/cliente.types";
import { useState } from "react";
import FormCliente from "./components/FormCliente";
import { ClientetFormData } from "../../schemas/cliente.schema";
import CardCliente from "./components/CardCliente";
import { toast } from "react-toastify";

export default function ClientePage() {
  const { clientes, loading, createCliente,getCliente, updateCliente } = useClientes();

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);


  
  // Enviar formulario (crear o actualizar)
  const handleSubmit = async (data: ClientetFormData) => {
    try {
      if (selectedCliente) {
        // Actualizar
        const result =  await updateCliente(selectedCliente.id, data);
        toast.success(result.message)
      } else {
        // Crear
        const result = await createCliente(data);
        toast.success(result.message)
      }
      setModalOpen(false);
      setSelectedCliente(null);
    } catch (error) {
      console.error("Error al guardar producto:", error);
      throw error;
    }
  };


  const handleEdit = async (id: number) => {
    try {
      setLoadingAction(true);
      const client = await getCliente(id);
      setSelectedCliente(client);
      setModalOpen(true);
    } catch (error) {
      console.error("Error al cargar cliente:", error);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Clientes</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar clientes..."
            className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-400 focus:outline-none sm:w-auto"
          />
          <button
            onClick={() => {
              setModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-white transition-all duration-300 hover:shadow-lg hover:shadow-orange-200"
          >
            <span>+</span> Nuevo
          </button>
        </div>
      </div>

      {loading && clientes.length === 0 && (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="xl" color="orage" />
        </div>
      )}

      {clientes.length === 0 && (
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
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clientes &&
          clientes.map((clie: Cliente) => (
            <CardCliente key={clie.id}  cliente={clie}  handleEdit={handleEdit}  />
          ))}
      </div>

      <FormCliente
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCliente(null);
        }}
        onSubmit={handleSubmit}
        cliente={selectedCliente}
        isLoading={loadingAction}
      />
    </div>
  );
}
