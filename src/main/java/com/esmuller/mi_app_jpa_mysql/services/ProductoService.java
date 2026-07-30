package com.esmuller.mi_app_jpa_mysql.services;

import com.esmuller.mi_app_jpa_mysql.dtos.CrearProductoRequest;
import com.esmuller.mi_app_jpa_mysql.dtos.ProductoDTO;
import com.esmuller.mi_app_jpa_mysql.entities.Categoria;
import com.esmuller.mi_app_jpa_mysql.entities.Producto;
import com.esmuller.mi_app_jpa_mysql.repositories.CategoriaRepository;
import com.esmuller.mi_app_jpa_mysql.repositories.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    // Obtener todos los productos
    public List<ProductoDTO> findAll() {
        return productoRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Obtener producto por ID
    public Optional<ProductoDTO> findById(Long id) {
        return productoRepository.findById(id)
                .map(this::convertToDTO);
    }

    // Crear nuevo producto
    @Transactional
    public ProductoDTO create(CrearProductoRequest request) {
        // Verificar que la categoría existe
        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + request.getCategoriaId()));

        // Crear el producto
        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setPrecio(request.getPrecio());
        producto.setStock(request.getStock());
        producto.setCategoria(categoria);

        Producto saved = productoRepository.save(producto);
        return convertToDTO(saved);
    }

    // Actualizar producto
    @Transactional
    public Optional<ProductoDTO> update(Long id, CrearProductoRequest request) {
        return productoRepository.findById(id)
                .map(producto -> {
                    // Actualizar campos básicos
                    producto.setNombre(request.getNombre());
                    producto.setPrecio(request.getPrecio());
                    producto.setStock(request.getStock());

                    // Actualizar categoría si cambia
                    if (request.getCategoriaId() != null) {
                        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
                        producto.setCategoria(categoria);
                    }

                    Producto updated = productoRepository.save(producto);
                    return convertToDTO(updated);
                });
    }

    // Eliminar producto
    @Transactional
    public boolean deleteById(Long id) {
        if (productoRepository.existsById(id)) {
            productoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Buscar productos por nombre
    public List<ProductoDTO> findByNombre(String nombre) {
        return productoRepository.findByNombreContaining(nombre)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Buscar productos por categoría
    public List<ProductoDTO> findByCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Buscar productos con bajo stock
    public List<ProductoDTO> findLowStock(Integer threshold) {
        return productoRepository.findByStockLessThan(threshold)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Métodos de conversión
    private ProductoDTO convertToDTO(Producto producto) {
        return new ProductoDTO(
                producto.getId(),
                producto.getNombre(),
                producto.getPrecio(),
                producto.getStock(),
                producto.getCategoria() != null ? producto.getCategoria().getId() : null,
                producto.getCategoria() != null ? producto.getCategoria().getNombre() : null
        );
    }
}