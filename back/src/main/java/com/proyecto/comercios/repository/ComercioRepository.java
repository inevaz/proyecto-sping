package com.proyecto.comercios.repository;

import com.proyecto.comercios.model.Comercio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//interfaz que extiende JpaRepository para proporcionar métodos CRUD básicos para la entity Comercio.
@Repository
public interface ComercioRepository extends JpaRepository<Comercio, Long> {
    boolean existsByRut(String rut);
}