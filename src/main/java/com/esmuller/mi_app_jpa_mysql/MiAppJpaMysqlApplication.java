package com.esmuller.mi_app_jpa_mysql;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MiAppJpaMysqlApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(MiAppJpaMysqlApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// TODO Auto-generated method stub
		System.out.println("Aplicacion inicada correctamente");
	
		//throw new UnsupportedOperationException("Unimplemented method 'run'");
	}

}
