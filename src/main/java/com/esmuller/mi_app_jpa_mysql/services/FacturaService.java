package com.esmuller.mi_app_jpa_mysql.services;

import com.esmuller.mi_app_jpa_mysql.dtos.*;
import com.esmuller.mi_app_jpa_mysql.entities.Cliente;
import com.esmuller.mi_app_jpa_mysql.entities.DetalleFactura;
import com.esmuller.mi_app_jpa_mysql.entities.Factura;
import com.esmuller.mi_app_jpa_mysql.entities.Producto;
import com.esmuller.mi_app_jpa_mysql.repositories.ClienteRepository;
import com.esmuller.mi_app_jpa_mysql.repositories.DetalleFacturaRepository;
import com.esmuller.mi_app_jpa_mysql.repositories.FacturaRepository;
import com.esmuller.mi_app_jpa_mysql.repositories.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FacturaService {

    @Autowired
    private FacturaRepository facturaRepository;

    @Autowired
    private DetalleFacturaRepository detalleFacturaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProductoRepository productoRepository;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // ==========================================
    // 1. OBTENER FACTURAS CON PAGINACIÓN
    // ==========================================
    public PageResponseDTO<FacturaResponseDTO> findAll(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Factura> pageResult = facturaRepository.findAll(pageable);

        List<FacturaResponseDTO> facturasDTO = pageResult.getContent()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new PageResponseDTO<>(
                facturasDTO,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isFirst(),
                pageResult.isLast(),
                pageResult.isEmpty());
    }

    // ==========================================
    // 2. OBTENER FACTURA POR ID
    // ==========================================
    public Optional<FacturaResponseDTO> findById(Long id) {
        return facturaRepository.findById(id)
                .map(this::convertToDTO);
    }

    // ==========================================
    // 3. CREAR FACTURA
    // ==========================================
    @Transactional
    public FacturaResponseDTO create(FacturaRequestDTO request) {
        // 1. Validar y obtener el cliente
        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + request.getClienteId()));

        // 2. Validar que la factura tenga al menos un producto
        if (request.getDetalles() == null || request.getDetalles().isEmpty()) {
            throw new RuntimeException("La factura debe tener al menos un producto");
        }

        // 3. Crear la factura
        String numeroFactura = generarNumeroFactura();
        Factura factura = new Factura(cliente, numeroFactura);
        factura.setEstado("PENDIENTE");

        // 4. Procesar cada detalle
        for (DetalleFacturaRequestDTO detalleRequest : request.getDetalles()) {
            // Validar producto
            Producto producto = productoRepository.findById(detalleRequest.getProductoId())
                    .orElseThrow(
                            () -> new RuntimeException("Producto no encontrado: " + detalleRequest.getProductoId()));

            // Validar stock
            if (producto.getStock() < detalleRequest.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre() +
                        ". Stock disponible: " + producto.getStock());
            }

            // Crear detalle de factura
            DetalleFactura detalle = new DetalleFactura();
            detalle.setProducto(producto);
            detalle.setCantidad(detalleRequest.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setFactura(factura);

            // Agregar a la factura
            factura.addDetalle(detalle);

            // Actualizar stock del producto
            producto.setStock(producto.getStock() - detalleRequest.getCantidad());
            productoRepository.save(producto);
        }

        // 5. Recalcular total y guardar
        factura.recalcularTotal();
        Factura saved = facturaRepository.save(factura);

        return convertToDTO(saved);
    }

    // ==========================================
    // 4. ACTUALIZAR ESTADO DE FACTURA
    // ==========================================
    @Transactional
    public Optional<FacturaResponseDTO> updateEstado(Long id, String nuevoEstado) {
        return facturaRepository.findById(id)
                .map(factura -> {
                    // Validar estado
                    if (!estadoValido(nuevoEstado)) {
                        throw new RuntimeException("Estado inválido. Estados permitidos: PENDIENTE, PAGADA, CANCELADA");
                    }

                    // Si se cancela, restaurar stock
                    if ("CANCELADA".equals(nuevoEstado) && !"CANCELADA".equals(factura.getEstado())) {
                        restaurarStock(factura);
                    }

                    factura.setEstado(nuevoEstado);
                    Factura updated = facturaRepository.save(factura);
                    return convertToDTO(updated);
                });
    }

    // ==========================================
    // 5. ELIMINAR FACTURA
    // ==========================================
    @Transactional
    public boolean deleteById(Long id) {
        Optional<Factura> facturaOpt = facturaRepository.findById(id);
        if (facturaOpt.isPresent()) {
            Factura factura = facturaOpt.get();
            // Restaurar stock si la factura no está cancelada
            if (!"CANCELADA".equals(factura.getEstado())) {
                restaurarStock(factura);
            }
            facturaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // ==========================================
    // 6. BUSCAR FACTURAS POR CLIENTE
    // ==========================================
    public PageResponseDTO<FacturaResponseDTO> findByCliente(Long clienteId, int page, int size, String sortBy,
            String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Factura> pageResult = facturaRepository.findByClienteId(clienteId, pageable);

        List<FacturaResponseDTO> facturasDTO = pageResult.getContent()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new PageResponseDTO<>(
                facturasDTO,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isFirst(),
                pageResult.isLast(),
                pageResult.isEmpty());
    }

    // ==========================================
    // 7. BUSCAR FACTURAS POR FECHA
    // ==========================================
    public PageResponseDTO<FacturaResponseDTO> findByFechas(LocalDateTime inicio, LocalDateTime fin,
            int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Factura> pageResult = facturaRepository.findByFechaCreacionBetween(inicio, fin, pageable);

        List<FacturaResponseDTO> facturasDTO = pageResult.getContent()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new PageResponseDTO<>(
                facturasDTO,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isFirst(),
                pageResult.isLast(),
                pageResult.isEmpty());
    }

    // ==========================================
    // 8. MÉTODOS DE UTILIDAD
    // ==========================================

    private String generarNumeroFactura() {
        String fecha = LocalDateTime.now().format(FORMATTER);
        long count = facturaRepository.count() + 1;
        return String.format("FAC-%s-%04d", fecha, count);
    }

    private boolean estadoValido(String estado) {
        return "PENDIENTE".equals(estado) || "PAGADA".equals(estado) || "CANCELADA".equals(estado);
    }

    private void restaurarStock(Factura factura) {
        for (DetalleFactura detalle : factura.getDetalles()) {
            Producto producto = detalle.getProducto();
            producto.setStock(producto.getStock() + detalle.getCantidad());
            productoRepository.save(producto);
        }
    }

    private FacturaResponseDTO convertToDTO(Factura factura) {
        // Convertir cliente
        ClienteDTO clienteDTO = new ClienteDTO(
                factura.getCliente().getId(),
                factura.getCliente().getNombre(),
                factura.getCliente().getTelefono(),
                factura.getCliente().getDireccionn());

        // Crear respuesta básica
        FacturaResponseDTO dto = new FacturaResponseDTO(
                factura.getId(),
                factura.getNumeroFactura(),
                factura.getFechaCreacion(),
                factura.getTotal(),
                factura.getEstado(),
                clienteDTO);

        // Convertir detalles
        List<DetalleFacturaResponseDTO> detallesDTO = factura.getDetalles().stream()
                .map(detalle -> new DetalleFacturaResponseDTO(
                        detalle.getId(),
                        detalle.getProducto().getId(),
                        detalle.getProducto().getNombre(),
                        detalle.getCantidad(),
                        detalle.getPrecioUnitario(),
                        detalle.getSubtotal()))
                .collect(Collectors.toList());

        dto.setDetalles(detallesDTO);
        return dto;
    }
}