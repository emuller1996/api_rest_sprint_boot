import { useCallback, useEffect, useState } from "react";
import { Cliente, ClienteCreateResponse } from "../types/cliente.types";
import { clienteService } from "../services/cliente.service";
import { ClientetFormData } from "../schemas/cliente.schema";

interface UseClientesReturn {
  clientes: Cliente[];
  loading: boolean;
  error: string | null;
  refreshClientes: () => Promise<void>;
  createCliente: (data: ClientetFormData) => Promise<ClienteCreateResponse>;
}

export const useClientes = (): UseClientesReturn => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await clienteService.getAllClientes();
      setClientes(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar categorías",
      );
      console.error("Error fetching categorias:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const createCliente = useCallback(
    async (data: ClientetFormData): Promise<ClienteCreateResponse> => {
      try {
        const newCliente = await clienteService.createCliente(data);
        await fetchClientes();
        return newCliente;
      } catch (err) {
        console.error("Error creating client:", err);
        throw err;
      }
    },
    [fetchClientes],
  );

  return {
    clientes,
    loading,
    error,
    refreshClientes: fetchClientes,
    createCliente,
  };
};
