import axiosInstance from "../../../config/axios";
import { FacturasFilters, FacturasResponse, FacturaCreateRequest } from "../types/facturas.types";

class FacturaService {
  private baseUrl = "/facturas"; // Ajusta según tu endpoint
  async getFacturas(filters: FacturasFilters = {}): Promise<FacturasResponse> {
    try {
      const params = new URLSearchParams();

      // Agregar parámetros de paginación
      if (filters.page !== undefined)
        params.append("page", filters.page.toString());
      if (filters.size !== undefined)
        params.append("size", filters.size.toString());

      const url = `${this.baseUrl}?${params.toString()}`;
      const response = await axiosInstance.get<FacturasResponse>(url);

      return response.data;
    } catch (error) {
      console.error("Error fetching facturas/ invoices:", error);
      throw error;
    }
  }

  async createFactura(data: FacturaCreateRequest): Promise<any> {
    try {
      const response = await axiosInstance.post(`${this.baseUrl}`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating factura:", error);
      throw error;
    }
  }
}

export const facturasService = new FacturaService();
