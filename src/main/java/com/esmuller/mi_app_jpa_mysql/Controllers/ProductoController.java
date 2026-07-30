
package com.esmuller.mi_app_jpa_mysql.controllers;

import com.esmuller.mi_app_jpa_mysql.dtos.CrearProductoRequest;
import com.esmuller.mi_app_jpa_mysql.dtos.ProductoDTO;
import com.esmuller.mi_app_jpa_mysql.services.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // Obtener todos los productos
    @GetMapping
    public List<ProductoDTO> getAllProductos() {
        return productoService.findAll();
    }

    // Obtener producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> getProducto(@PathVariable Long id) {
        return productoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear nuevo producto
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductoDTO createProducto(@RequestBody CrearProductoRequest request) {
        return productoService.create(request);
    }

    // Actualizar producto
    @PutMapping("/{id}")
    public ResponseEntity<ProductoDTO> updateProducto(@PathVariable Long id, 
                                                      @RequestBody CrearProductoRequest request) {
        return productoService.update(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Eliminar producto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        if (productoService.deleteById(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Buscar productos por nombre
    @GetMapping("/search")
    public List<ProductoDTO> searchByNombre(@RequestParam String nombre) {
        return productoService.findByNombre(nombre);
    }

    // Buscar productos por categoría
    @GetMapping("/categoria/{categoriaId}")
    public List<ProductoDTO> getByCategoria(@PathVariable Long categoriaId) {
        return productoService.findByCategoria(categoriaId);
    }

    // Buscar productos con bajo stock
    @GetMapping("/low-stock")
    public List<ProductoDTO> getLowStock(@RequestParam(defaultValue = "10") Integer threshold) {
        return productoService.findLowStock(threshold);
    }
}