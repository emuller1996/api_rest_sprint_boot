package com.esmuller.mi_app_jpa_mysql.dtos;

public class CrearProductoRequest {
    private String nombre;
    private Double precio;
    private Integer stock;
    private Long categoriaId;

    // Constructores
    public CrearProductoRequest() {}

    public CrearProductoRequest(String nombre, Double precio, Integer stock, Long categoriaId) {
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.categoriaId = categoriaId;
    }

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Long getCategoriaId() { return categoriaId; }
    public void setCategoriaId(Long categoriaId) { this.categoriaId = categoriaId; }
}