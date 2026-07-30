package com.esmuller.mi_app_jpa_mysql.dtos;

public class ClienteDTO {
    private Long id;
    private String nombre;
    private String telefono;
    private String direccion;

    public ClienteDTO() {}

    public ClienteDTO(Long id, String nombre, String telefono, String direccionn) {
        this.id = id;
        this.nombre = nombre;
        this.telefono = telefono;
        this.direccion = direccionn;

    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTelefono() {
        return this.telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return this.direccion;
    }

    public void setDireccion(String direccionn) {
        this.direccion = direccionn;
    }

}
