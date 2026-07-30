package com.esmuller.mi_app_jpa_mysql.dtos;

import java.util.List;

public class CategoriaDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    //private List<ProductoDTO> productos; // Opcional: lista de productos

    // Constructores
    public CategoriaDTO() {}

    public CategoriaDTO(Long id, String nombre, String descripcion) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    //public List<ProductoDTO> getProductos() { return productos; }
    //public void setProductos(List<ProductoDTO> productos) { this.productos = productos; }
}