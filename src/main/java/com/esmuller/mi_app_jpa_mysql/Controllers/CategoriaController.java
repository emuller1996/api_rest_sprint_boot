package com.esmuller.mi_app_jpa_mysql.controllers;

import com.esmuller.mi_app_jpa_mysql.dtos.CategoriaDTO;
import com.esmuller.mi_app_jpa_mysql.dtos.ProductoDTO;
import com.esmuller.mi_app_jpa_mysql.services.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    // Obtener todas las categorías
    @GetMapping
    public List<CategoriaDTO> getAllCategorias() {
        return categoriaService.findAll();
    }

    // Obtener categoría por ID
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDTO> getCategoria(@PathVariable Long id) {
        return categoriaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // NUEVO: Obtener productos de una categoría específica
    @GetMapping("/{id}/productos")
    public ResponseEntity<List<ProductoDTO>> getProductosByCategoria(@PathVariable Long id) {
        try {
            List<ProductoDTO> productos = categoriaService.findProductosByCategoriaId(id);
            return ResponseEntity.ok(productos);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Crear nueva categoría
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoriaDTO createCategoria(@RequestBody CategoriaDTO categoriaDTO) {
        return categoriaService.create(categoriaDTO);
    }

    // Actualizar categoría
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDTO> updateCategoria(@PathVariable Long id, 
                                                         @RequestBody CategoriaDTO categoriaDTO) {
        return categoriaService.update(id, categoriaDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Eliminar categoría
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoria(@PathVariable Long id) {
        if (categoriaService.deleteById(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Buscar categoría por nombre
    @GetMapping("/search")
    public ResponseEntity<CategoriaDTO> searchByNombre(@RequestParam String nombre) {
        return categoriaService.findByNombre(nombre)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}