//Data Transfer Object para resultados de carga de Excel. Objeto simple para encapsular el número de registros exitosos, fallidos y los mensajes de error.
package com.proyecto.comercios.dto;

import java.util.List;

public class UploadResultDTO {

    private int exitosos;
    private int fallidos;
    private List<String> errores;

    public UploadResultDTO(int exitosos, int fallidos, List<String> errores) {
        this.exitosos = exitosos;
        this.fallidos = fallidos;
        this.errores = errores;
    }

    public int getExitosos() { return exitosos; }
    public int getFallidos() { return fallidos; }
    public List<String> getErrores() { return errores; }
}