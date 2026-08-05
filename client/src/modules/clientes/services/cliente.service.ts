import axiosInstance from "../../../config/axios";
import { Cliente, ClienteCreateResponse } from "../types/cliente.types";

class ClienteService {
  private baseUrl = "/clientes"; // Ajusta según tu endpoint

  async getAllClientes(): Promise<Cliente[]> {
    try {
      const response = await axiosInstance.get<Cliente[]>(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error("Error fetching clientes:", error);
      throw error;
    }
  }

  async createCliente(cliente: Partial<Cliente>): Promise<ClienteCreateResponse> {
    try {
      const response = await axiosInstance.post<ClienteCreateResponse>(
        this.baseUrl,
        cliente,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating categoria:", error);
      throw error;
    }
  }
}

export const clienteService = new ClienteService();
