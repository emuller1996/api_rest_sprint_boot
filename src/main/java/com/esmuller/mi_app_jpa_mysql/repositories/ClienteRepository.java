package com.esmuller.mi_app_jpa_mysql.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.esmuller.mi_app_jpa_mysql.entities.Cliente;
import com.esmuller.mi_app_jpa_mysql.entities.Producto;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    List<Cliente> findByNombreContaining(String nombre);

}
