//Data Transfer Object para resultados solamente de carga de Excel. 
//objeto simple para encapsular el número de registros exitosos, fallidos y los mensajes de error.

package com.proyecto.comercios.dto;
import java.util.List;

public class UploadResultDTO {
    //atributos para contar los registros exitosos, fallidos y almacenar mensajes de error
    private int exitosos;
    private int fallidos;
    private List<String> errores;

    //constructor completo para inicializar los atributos
    public UploadResultDTO(int exitosos, int fallidos, List<String> errores) {
        this.exitosos = exitosos;
        this.fallidos = fallidos;
        this.errores = errores;
    }

    //getters para acceder a los atributos, no se necesitan setters porque este DTO es inmutable después de la creación
    public int getExitosos() { return exitosos; }
    public int getFallidos() { return fallidos; }
    public List<String> getErrores() { return errores; }
}