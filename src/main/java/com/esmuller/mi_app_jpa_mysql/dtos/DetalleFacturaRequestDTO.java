package com.esmuller.mi_app_jpa_mysql.dtos;

public class DetalleFacturaRequestDTO {
    private Long productoId;
    private Integer cantidad;

    // Constructores
    public DetalleFacturaRequestDTO() {}

    public DetalleFacturaRequestDTO(Long productoId, Integer cantidad) {
        this.productoId = productoId;
        this.cantidad = cantidad;
    }

    // Getters y Setters
    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}