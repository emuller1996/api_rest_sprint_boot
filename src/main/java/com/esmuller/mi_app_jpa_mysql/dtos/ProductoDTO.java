package com.esmuller.mi_app_jpa_mysql.dtos;

public class ProductoDTO {
    private Long id;
    private String nombre;
    private Double precio;
    private Integer stock;
    private Long categoriaId;
    private String categoria;

    // Constructores
    public ProductoDTO() {}

    public ProductoDTO(Long id, String nombre, Double precio, Integer stock, 
                       Long categoriaId, String categoria) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.categoriaId = categoriaId;
        this.categoria = categoria;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Long getCategoriaId() { return categoriaId; }
    public void setCategoriaId(Long categoriaId) { this.categoriaId = categoriaId; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
}