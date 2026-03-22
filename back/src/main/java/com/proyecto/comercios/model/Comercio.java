// Modelo de entidad para comercios
package com.proyecto.comercios.model;

import jakarta.persistence.*; // Anotaciones JPA para persistencia
import java.time.LocalDateTime; // Fecha y hora

// Marca la clase como entidad JPA y la mapea a la tabla "comercios"
@Entity
@Table(name = "comercios")
public class Comercio {

    // Clave primaria autoincremental
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre del comercio (obligatorio)
    @Column(nullable = false)
    private String nombre;

    // RUT único del comercio (obligatorio)
    @Column(nullable = false, unique = true)
    private String rut;

    // Rubro, dirección, email y estado (activo por defecto)
    private String rubro;
    private String direccion;
    private String email;
    private Boolean activo = true;

    // Fecha de carga del registro
    @Column(name = "fecha_carga")
    private LocalDateTime fechaCarga;

    // Asigna la fecha actual antes de guardar el registro
    @PrePersist
    public void prePersist() {
        this.fechaCarga = LocalDateTime.now();
    }

    // Métodos para acceder y modificar los atributos
    // Getters y Setters
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