package com.esmuller.mi_app_jpa_mysql.services;

import com.esmuller.mi_app_jpa_mysql.dtos.CategoriaDTO;
import com.esmuller.mi_app_jpa_mysql.dtos.ProductoDTO;
import com.esmuller.mi_app_jpa_mysql.entities.Categoria;
import com.esmuller.mi_app_jpa_mysql.entities.Producto;
import com.esmuller.mi_app_jpa_mysql.repositories.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    // Obtener todas las categorías
    public List<CategoriaDTO> findAll() {
        return categoriaRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Obtener categoría por ID
    public Optional<CategoriaDTO> findById(Long id) {
        return categoriaRepository.findById(id)
                .map(this::convertToDTO);
    }

    public List<ProductoDTO> findProductosByCategoriaId(Long categoriaId) {
        // Primero verificamos que la categoría existe
        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + categoriaId));
        
        // Convertimos los productos de la categoría a DTOs
        return categoria.getProductos().stream()
                .map(this::convertProductoToDTO)
                .collect(Collectors.toList());
    }

    // Crear nueva categoría
    @Transactional
    public CategoriaDTO create(CategoriaDTO dto) {
        // Validar que no exista una categoría con el mismo nombre
        if (categoriaRepository.existsByNombre(dto.getNombre())) {
            throw new RuntimeException("Ya existe una categoría con el nombre: " + dto.getNombre());
        }

        Categoria categoria = new Categoria();
        categoria.setNombre(dto.getNombre());
        categoria.setDescripcion(dto.getDescripcion());

        Categoria saved = categoriaRepository.save(categoria);
        return convertToDTO(saved);
    }

    // Actualizar categoría
    @Transactional
    public Optional<CategoriaDTO> update(Long id, CategoriaDTO dto) {
        return categoriaRepository.findById(id)
                .map(categoria -> {
                    categoria.setNombre(dto.getNombre());
                    categoria.setDescripcion(dto.getDescripcion());
                    Categoria updated = categoriaRepository.save(categoria);
                    return convertToDTO(updated);
                });
    }

    // Eliminar categoría
    @Transactional
    public boolean deleteById(Long id) {
        if (categoriaRepository.existsById(id)) {
            categoriaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Buscar categoría por nombre
    public Optional<CategoriaDTO> findByNombre(String nombre) {
        return categoriaRepository.findByNombre(nombre)
                .map(this::convertToDTO);
    }

    // Métodos de conversión
    private CategoriaDTO convertToDTO(Categoria categoria) {
        CategoriaDTO dto = new CategoriaDTO();
        dto.setId(categoria.getId());
        dto.setNombre(categoria.getNombre());
        dto.setDescripcion(categoria.getDescripcion());
        return dto;
    }

    // Convertir Producto a ProductoDTO (para el nuevo endpoint)
    private ProductoDTO convertProductoToDTO(Producto producto) {
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