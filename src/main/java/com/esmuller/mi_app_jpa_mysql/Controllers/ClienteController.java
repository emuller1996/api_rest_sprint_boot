package com.esmuller.mi_app_jpa_mysql.controllers;

import com.esmuller.mi_app_jpa_mysql.services.CategoriaService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.esmuller.mi_app_jpa_mysql.dtos.ClienteDTO;
import com.esmuller.mi_app_jpa_mysql.services.ClienteService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final CategoriaService categoriaService;
    @Autowired
    private ClienteService clienteService;

    ClienteController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    public List<ClienteDTO> getAllClientes() {
        return clienteService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createCliente(@RequestBody ClienteDTO clienteDTO) {
        // TODO: process POST request
        ClienteDTO clienteGuardado = clienteService.create(clienteDTO);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Cliente creado exitosamente");
        response.put("data", clienteGuardado);
        return response;
    }

}
