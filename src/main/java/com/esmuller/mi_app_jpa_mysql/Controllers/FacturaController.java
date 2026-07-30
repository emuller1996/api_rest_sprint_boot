package com.esmuller.mi_app_jpa_mysql.controllers;

import com.esmuller.mi_app_jpa_mysql.dtos.FacturaRequestDTO;
import com.esmuller.mi_app_jpa_mysql.dtos.FacturaResponseDTO;
import com.esmuller.mi_app_jpa_mysql.dtos.PageResponseDTO;
import com.esmuller.mi_app_jpa_mysql.services.FacturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/facturas")
public class FacturaController {

    @Autowired
    private FacturaService facturaService;

    // ==========================================
    // 1. OBTENER TODAS LAS FACTURAS (PAGINADO)
    // ==========================================
    @GetMapping
    public PageResponseDTO<FacturaResponseDTO> getAllFacturas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        return facturaService.findAll(page, size, sortBy, sortDir);
    }

    // ==========================================
    // 2. OBTENER FACTURA POR ID
    // ==========================================
    @GetMapping("/{id}")
    public ResponseEntity<FacturaResponseDTO> getFactura(@PathVariable Long id) {
        return facturaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================================
    // 3. CREAR FACTURA
    // ==========================================
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FacturaResponseDTO createFactura(@RequestBody FacturaRequestDTO request) {
        return facturaService.create(request);
    }

    // ==========================================
    // 4. ACTUALIZAR ESTADO DE FACTURA
    // ==========================================
    @PatchMapping("/{id}/estado")
    public ResponseEntity<FacturaResponseDTO> updateEstado(
            @PathVariable Long id,
            @RequestParam String estado) {
        
        return facturaService.updateEstado(id, estado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================================
    // 5. ELIMINAR FACTURA
    // ==========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFactura(@PathVariable Long id) {
        if (facturaService.deleteById(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ==========================================
    // 6. BUSCAR FACTURAS POR CLIENTE
    // ==========================================
    @GetMapping("/cliente/{clienteId}")
    public PageResponseDTO<FacturaResponseDTO> getFacturasByCliente(
            @PathVariable Long clienteId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fechaCreacion") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        return facturaService.findByCliente(clienteId, page, size, sortBy, sortDir);
    }

    // ==========================================
    // 7. BUSCAR FACTURAS POR RANGO DE FECHAS
    // ==========================================
    @GetMapping("/search/fechas")
    public PageResponseDTO<FacturaResponseDTO> getFacturasByFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fechaCreacion") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        return facturaService.findByFechas(inicio, fin, page, size, sortBy, sortDir);
    }
}