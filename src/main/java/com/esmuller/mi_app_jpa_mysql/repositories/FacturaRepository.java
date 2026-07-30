package com.esmuller.mi_app_jpa_mysql.repositories;

import com.esmuller.mi_app_jpa_mysql.entities.Factura;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Long> {
    
    Page<Factura> findByClienteId(Long clienteId, Pageable pageable);
    
    Page<Factura> findByEstado(String estado, Pageable pageable);
    
    Page<Factura> findByFechaCreacionBetween(LocalDateTime inicio, LocalDateTime fin, Pageable pageable);
    
    Optional<Factura> findByNumeroFactura(String numeroFactura);
    
    List<Factura> findByClienteId(Long clienteId);
    
    boolean existsByNumeroFactura(String numeroFactura);
}