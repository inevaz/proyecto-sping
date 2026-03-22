package com.proyecto.comercios.repository;

import com.proyecto.comercios.model.Comercio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComercioRepository extends JpaRepository<Comercio, Long> {
    boolean existsByRut(String rut);
}