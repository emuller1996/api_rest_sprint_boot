package com.esmuller.mi_app_jpa_mysql.services;

import com.esmuller.mi_app_jpa_mysql.entities.Producto;
import com.esmuller.mi_app_jpa_mysql.repositories.ProductosRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ServiceProductos {

    @Autowired
    private ProductosRepository productoRepository;

    // Obtener todos los productos
    public List<Producto> findAll() {
        return productoRepository.findAll();
    }

    // Obtener producto por ID
    public Optional<Producto> findById(Long id) {
        return productoRepository.findById(id);
    }

    // Guardar un producto (crear o actualizar)
    @Transactional
    public Producto save(Producto producto) {
        return productoRepository.save(producto);
    }

    // Crear un nuevo producto
    @Transactional
    public Producto createProducto(Producto producto) {
        // Aquí puedes agregar lógica adicional antes de guardar
        // Por ejemplo: validaciones, generar códigos, etc.
        return productoRepository.save(producto);
    }

    // Actualizar un producto existente
    @Transactional
    public Producto updateProducto(Long id, Producto productoDetails) {
        return productoRepository.findById(id)
                .map(producto -> {
                    producto.setName(productoDetails.getName());
                    producto.setPrice(productoDetails.getPrice());
                    producto.setStock(productoDetails.getStock());
                    return productoRepository.save(producto);
                })
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
    }

    // Eliminar un producto
    @Transactional
    public void deleteById(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado con ID: " + id);
        }
        productoRepository.deleteById(id);
    }

    // Métodos adicionales útiles
    public boolean existsById(Long id) {
        return productoRepository.existsById(id);
    }

    public long count() {
        return productoRepository.count();
    }

    // Buscar productos por nombre (si agregas este método en el repository)
    public List<Producto> findByNameContaining(String name) {
        return productoRepository.findByNameContaining(name);
    }

    // Buscar productos con stock bajo (ejemplo de lógica de negocio)
    public List<Producto> findLowStockProducts(int threshold) {
        return productoRepository.findByStockLessThan(threshold);
    }

    // Aumentar stock de un producto
    @Transactional
    public Producto increaseStock(Long id, int quantity) {
        return productoRepository.findById(id)
                .map(producto -> {
                    producto.setStock(producto.getStock() + quantity);
                    return productoRepository.save(producto);
                })
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
    }

    // Disminuir stock de un producto (con validación)
    @Transactional
    public Producto decreaseStock(Long id, int quantity) {
        return productoRepository.findById(id)
                .map(producto -> {
                    if (producto.getStock() < quantity) {
                        throw new RuntimeException("Stock insuficiente. Stock actual: " + producto.getStock());
                    }
                    producto.setStock(producto.getStock() - quantity);
                    return productoRepository.save(producto);
                })
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
    }
}
