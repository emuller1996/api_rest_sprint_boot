package com.esmuller.mi_app_jpa_mysql.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.esmuller.mi_app_jpa_mysql.dtos.CategoriaDTO;
import com.esmuller.mi_app_jpa_mysql.dtos.ClienteDTO;
import com.esmuller.mi_app_jpa_mysql.entities.Categoria;
import com.esmuller.mi_app_jpa_mysql.entities.Cliente;
import com.esmuller.mi_app_jpa_mysql.repositories.ClienteRepository;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public List<ClienteDTO> findAll() {
        return clienteRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClienteDTO create(ClienteDTO dto) {

        Cliente cliente = new Cliente();
        cliente.setNombre(dto.getNombre());
        cliente.setDireccionn(dto.getDireccion());
        cliente.setTelefono(dto.getTelefono());

        Cliente saved = clienteRepository.save(cliente);
        return convertToDTO(saved);
    }

    private ClienteDTO convertToDTO(Cliente cliente) {
        ClienteDTO dto = new ClienteDTO();
        dto.setId(cliente.getId());
        dto.setNombre(cliente.getNombre());
        dto.setTelefono(cliente.getTelefono());
        dto.setDireccion(cliente.getDireccionn());
        return dto;
    }
}
