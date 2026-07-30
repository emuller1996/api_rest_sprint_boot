package com.esmuller.mi_app_jpa_mysql;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.esmuller.mi_app_jpa_mysql.entities.Producto;
import com.esmuller.mi_app_jpa_mysql.repositories.ProductosRepository;

@SpringBootApplication
public class MiAppJpaMysqlApplication implements CommandLineRunner {

	@Autowired
	private ProductosRepository repositoryProductos;

	public static void main(String[] args) {
		SpringApplication.run(MiAppJpaMysqlApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// TODO Auto-generated method stub
		System.out.println("Aplicacion inicada correctamente");
		List<Producto> productos = repositoryProductos.findAll();
		productos.stream().forEach(prod -> System.out.println(prod));
		//throw new UnsupportedOperationException("Unimplemented method 'run'");
	}

}
