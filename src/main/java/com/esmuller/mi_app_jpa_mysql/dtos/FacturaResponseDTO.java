package com.esmuller.mi_app_jpa_mysql.dtos;

import java.time.LocalDateTime;
import java.util.List;

public class FacturaResponseDTO {
    private Long id;
    private String numeroFactura;
    private LocalDateTime fechaCreacion;
    private Double total;
    private String estado;
    private ClienteDTO cliente;
    private List<DetalleFacturaResponseDTO> detalles;

    // Constructores
    public FacturaResponseDTO() {}

    public FacturaResponseDTO(Long id, String numeroFactura, LocalDateTime fechaCreacion, 
                              Double total, String estado, ClienteDTO cliente) {
        this.id = id;
        this.numeroFactura = numeroFactura;
        this.fechaCreacion = fechaCreacion;
        this.total = total;
        this.estado = estado;
        this.cliente = cliente;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumeroFactura() { return numeroFactura; }
    public void setNumeroFactura(String numeroFactura) { this.numeroFactura = numeroFactura; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public ClienteDTO getCliente() { return cliente; }
    public void setCliente(ClienteDTO cliente) { this.cliente = cliente; }

    public List<DetalleFacturaResponseDTO> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleFacturaResponseDTO> detalles) { this.detalles = detalles; }
}
