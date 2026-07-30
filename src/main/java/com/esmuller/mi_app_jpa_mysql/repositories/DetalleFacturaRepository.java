package com.esmuller.mi_app_jpa_mysql.repositories;

import com.esmuller.mi_app_jpa_mysql.entities.DetalleFactura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleFacturaRepository extends JpaRepository<DetalleFactura, Long> {
    
    List<DetalleFactura> findByFacturaId(Long facturaId);
    
    List<DetalleFactura> findByProductoId(Long productoId);
}