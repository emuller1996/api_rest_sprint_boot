package com.esmuller.mi_app_jpa_mysql.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.esmuller.mi_app_jpa_mysql.entities.Producto;

public interface ProductosRepository extends JpaRepository<Producto, Long> {

    // Métodos personalizados
    List<Producto> findByNameContaining(String name);

    List<Producto> findByStockLessThan(int stock);

    // Si necesitas más búsquedas
    List<Producto> findByPriceBetween(double minPrice, double maxPrice);

    boolean existsByName(String name);

}
