package com.esmuller.mi_app_jpa_mysql.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.esmuller.mi_app_jpa_mysql.entities.Producto;
import com.esmuller.mi_app_jpa_mysql.services.ServiceProductos;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

@RestController
@RequestMapping("/api/products")
public class ProductoController {

    @Autowired
    private ServiceProductos productoService;

    // Obtener todos los productos
    @GetMapping
    public List<Producto> getAllProductos() {
        return productoService.findAll();
    }

    // Obtener producto por ID
    @GetMapping("/{id}")
    public Producto getProducto(@PathVariable Long id) {
        return productoService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "❌ El producto con ID " + id + " no existe en la base de datos"));
    }

    // Crear nuevo producto
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Producto createProducto(@RequestBody Producto producto) {
        return productoService.createProducto(producto);
    }

    // Actualizar producto
    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Long id, @RequestBody Producto producto) {
        try {
            Producto updatedProducto = productoService.updateProducto(id, producto);
            return ResponseEntity.ok(updatedProducto);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    // Eliminar producto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        try {
            productoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    // Aumentar stock
    @PatchMapping("/{id}/stock/increase")
    public ResponseEntity<Producto> increaseStock(@PathVariable Long id, @RequestParam int quantity) {
        try {
            Producto producto = productoService.increaseStock(id, quantity);
            return ResponseEntity.ok(producto);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    // Disminuir stock
    @PatchMapping("/{id}/stock/decrease")
    public ResponseEntity<Producto> decreaseStock(@PathVariable Long id, @RequestParam int quantity) {
        try {
            Producto producto = productoService.decreaseStock(id, quantity);
            return ResponseEntity.ok(producto);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    // Buscar productos por nombre
    @GetMapping("/search")
    public List<Producto> searchProductos(@RequestParam String name) {
        return productoService.findByNameContaining(name);
    }

    // Productos con bajo stock
    @GetMapping("/low-stock")
    public List<Producto> getLowStockProducts(@RequestParam(defaultValue = "10") int threshold) {
        return productoService.findLowStockProducts(threshold);
    }

}
