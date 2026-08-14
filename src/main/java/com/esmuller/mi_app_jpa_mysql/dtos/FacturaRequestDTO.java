package com.esmuller.mi_app_jpa_mysql.dtos;

import java.util.List;

public class FacturaRequestDTO {
    private Long clienteId;
    private List<DetalleFacturaRequestDTO> detalles;
    private String estado;

    // Getters y Setters
    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }

    public List<DetalleFacturaRequestDTO> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleFacturaRequestDTO> detalles) { this.detalles = detalles; }

    public String getEstado() { return this.estado; }
    public void setEstado(String estado) { this.estado = estado; }

}

