package com.esmuller.mi_app_jpa_mysql.repositories;

import com.esmuller.mi_app_jpa_mysql.entities.Producto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {


    // Buscar productos por nombre (con paginación)
    Page<Producto> findByNombreContaining(String nombre, Pageable pageable);

    // Buscar productos por nombre (contiene)
    List<Producto> findByNombreContaining(String nombre);
    
    // Buscar productos por categoría
    List<Producto> findByCategoriaId(Long categoriaId);
    
    // Buscar productos con stock bajo
    List<Producto> findByStockLessThan(Integer stock);
    
    // Buscar productos por rango de precio
    List<Producto> findByPrecioBetween(Double min, Double max);
}