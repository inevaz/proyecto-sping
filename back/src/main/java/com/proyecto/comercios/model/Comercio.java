package com.proyecto.comercios.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
entity representa un comercio afiliado en la base de datos.
hibernate lee esta clase y genera/mantiene la tabla "comercios" en PostgreSQL automáticamente.
 */
@Entity
@Table(name = "comercios")
public class Comercio {

    //id autoincremental, hibernate lo asigna solo al guardar un nuevo comercio
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) //si viene vacío, la db rechaza el registro
    private String nombre;

    @Column(nullable = false, unique = true) //restricción de que no puede haber dos comercios con el mismo RUT
    private String rut;

    //campos opcionales, pueden ser null sin problema
    private String rubro;
    private String direccion;
    private String email;

    private Boolean activo = true; //todo comercio nuevo arranca como activo

    @Column(name = "fecha_carga")
    private LocalDateTime fechaCarga;

    /**
     se ejecuta automáticamente antes de cada INSERT.
     lo que hace es asignar la fecha y hora actual al campo fechaCarga, para registrar cuándo se creó el comercio.
     */
    @PrePersist
    public void prePersist() {
        this.fechaCarga = LocalDateTime.now();
    }

    // Getters y Setters — necesarios para que Hibernate y Spring puedan leer/escribir los campos
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getRut() { return rut; }
    public void setRut(String rut) { this.rut = rut; }

    public String getRubro() { return rubro; }
    public void setRubro(String rubro) { this.rubro = rubro; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public LocalDateTime getFechaCarga() { return fechaCarga; }
    public void setFechaCarga(LocalDateTime fechaCarga) { this.fechaCarga = fechaCarga; }
}