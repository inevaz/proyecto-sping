package com.proyecto.comercios.service;

import com.proyecto.comercios.model.Comercio;
import com.proyecto.comercios.repository.ComercioRepository;
import org.springframework.stereotype.Service;
import com.proyecto.comercios.dto.UploadResultDTO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ComercioService {
    private static final org.apache.logging.log4j.Logger logger = org.apache.logging.log4j.LogManager
            .getLogger(ComercioService.class);

    private final ComercioRepository repository;

    public ComercioService(ComercioRepository repository) {
        this.repository = repository;
    }

    public List<Comercio> findAll() {
        return repository.findAll();
    }

    public Optional<Comercio> findById(Long id) {
        return repository.findById(id);
    }

    public Comercio save(Comercio comercio) {
        logger.info("Guardando comercio: {}", comercio.getNombre());
        return repository.save(comercio);
    }

    public void delete(Long id) {
        logger.info("Eliminando comercio con ID: {}", id);
        repository.deleteById(id);
    }

    public boolean existsByRut(String rut) {
        return repository.existsByRut(rut);
    }

    private String getCellValue(Cell cell) {
        if (cell == null)
            return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                return String.valueOf((long) cell.getNumericCellValue()).trim();
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue()).trim();
            default:
                return "";
        }
    }

    public UploadResultDTO cargarDesdeExcel(MultipartFile file) {
        int exitosos = 0;
        int fallidos = 0;
        List<String> errores = new ArrayList<>();

        try (InputStream is = file.getInputStream();
                Workbook workbook = new XSSFWorkbook(is)) {

            Sheet hoja = workbook.getSheetAt(0);

            for (int i = 1; i <= hoja.getLastRowNum(); i++) {
                Row fila = hoja.getRow(i);

                if (fila == null)
                    continue;

                try {
                    String nombre = getCellValue(fila.getCell(0));
                    String rut = getCellValue(fila.getCell(1));
                    String rubro = getCellValue(fila.getCell(2));
                    String direccion = getCellValue(fila.getCell(3));
                    String email = getCellValue(fila.getCell(4));

                    if (nombre.isEmpty() || rut.isEmpty()) {
                        errores.add("Fila " + (i + 1) + ": nombre y RUT son obligatorios");
                        logger.warn("Fila {} inválida: nombre o RUT vacío", i + 1);
                        fallidos++;
                        continue;
                    }

                    if (repository.existsByRut(rut)) {
                        errores.add("Fila " + (i + 1) + ": RUT " + rut + " ya existe");
                        logger.warn("Fila {} rechazada: RUT duplicado {}", i + 1, rut);
                        fallidos++;
                        continue;
                    }

                    Comercio comercio = new Comercio();
                    comercio.setNombre(nombre);
                    comercio.setRut(rut);
                    comercio.setRubro(rubro);
                    comercio.setDireccion(direccion);
                    comercio.setEmail(email);
                    comercio.setActivo(true);

                    repository.save(comercio);
                    logger.info("Fila {} cargada correctamente: {}", i + 1, nombre);
                    exitosos++;

                } catch (Exception e) {
                    errores.add("Fila " + (i + 1) + ": error inesperado - " + e.getMessage());
                    logger.error("Error en fila {}: {}", i + 1, e.getMessage(), e);
                    fallidos++;
                }
            }

        } catch (Exception e) {
            logger.error("Error al procesar el archivo Excel: {}", e.getMessage());
            errores.add("Error general al procesar el archivo: " + e.getMessage());
        }

        return new UploadResultDTO(exitosos, fallidos, errores);
    }
}