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

/**
 capa de lógica de negocio para comercios.
 funciona como el intermediario entre el Controller (que recibe requests) y el Repository (que habla con la BD).
 toda validación y decisión de negocio pasa por acá
 */
@Service
public class ComercioService {

    //log asociado a esta clase: cada mensaje en consola va a mostrar "ComercioService" como origen
    private static final org.apache.logging.log4j.Logger logger = org.apache.logging.log4j.LogManager
            .getLogger(ComercioService.class);

    private final ComercioRepository repository;

    //spring inyecta el repository auto. por constructor, no hay que hacer new ComercioRepository()
    public ComercioService(ComercioRepository repository) {
        this.repository = repository;
    }

    //trae todos los comercios de la db sin filtros
    public List<Comercio> findAll() {
        List<Comercio> comercios = repository.findAll();
        logger.info("Listando comercios: {} registros encontrados", comercios.size());
        return comercios;
    }

    /**
     busca un comercio por ID.
     retorna Optional, puede tener un valor o estar vacío, evita el NullPointerException
     si el ID no existe en la db
     */
    public Optional<Comercio> findById(Long id) {
        logger.info("Buscando comercio con ID: {}", id);
        Optional<Comercio> resultado = repository.findById(id);
        if (resultado.isEmpty()) {
            logger.warn("Comercio con ID {} no encontrado", id);
        }
        return resultado;
    }

    /**
     guarda un comercio nuevo o actualiza uno existente.
     si el id es null, es una creación. Si tiene ud, es una actualización.
     JPA/Hibernate decide solo si hace INSERT o UPDATE según esto.
     */
    public Comercio save(Comercio comercio) {
        boolean esNuevo = comercio.getId() == null;
        logger.info("{} comercio: {}", esNuevo ? "Creando" : "Actualizando", comercio.getNombre());
        Comercio guardado = repository.save(comercio);
        logger.info("Comercio {} con ID: {}", esNuevo ? "creado" : "actualizado", guardado.getId());
        return guardado;
    }

    //elimina un comercio por id. El Controller ya verificó que existe antes de llamar esto.
    public void delete(Long id) {
        logger.info("Eliminando comercio con ID: {}", id);
        repository.deleteById(id);
        logger.info("Comercio con ID {} eliminado correctamente", id);
    }

    /**verifica si ya existe un comercio con ese RUT en la BD.
     se usa antes de guardar para evitar duplicados.
     usa DEBUG en vez de INFO porque se llama muchas veces durante la carga del Excel y llenaría el log de mensajes repetitivos.
     */
    public boolean existsByRut(String rut) {
        boolean existe = repository.existsByRut(rut);
        logger.debug("Verificando RUT {}: {}", rut, existe ? "ya existe" : "disponible");
        return existe;
    }

    /* lee el valor de una celda del Excel sin importar su tipo.
     sin esto, intentar leer un número como String tiraría una excepción.
     cubre los tipos más comunes: texto, número y booleano.
     */
    private String getCellValue(Cell cell) {
        if (cell == null)
            return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                //se convierte en núm a entero long para evitar que los RUTs salgan como "210050030016.0"
                return String.valueOf((long) cell.getNumericCellValue()).trim();
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue()).trim();
            default:
                return "";
        }
    }

    /* procesa un archivo excel y carga los comercios válidos en la db
     itera fila por fila, valida cada una y acumula errores sin detener el proceso.
     al final devuelve un resumen con exitosos, fallidos y detalle de errores.
     */
    public UploadResultDTO cargarDesdeExcel(MultipartFile file) {
        int exitosos = 0;
        int fallidos = 0;
        List<String> errores = new ArrayList<>();

        logger.info("Iniciando carga de archivo Excel: {}", file.getOriginalFilename());

        //try-with-resources, cierra el workbook automáticamente al terminar, evita memory leaks (o sea, que quede abierto consumiendo memoria)
        try (InputStream is = file.getInputStream();
                Workbook workbook = new XSSFWorkbook(is)) {

            Sheet hoja = workbook.getSheetAt(0); //tomo siempre la primera hoja del excel
            int totalFilas = hoja.getLastRowNum();
            logger.info("Archivo abierto correctamente. Total de filas a procesar: {}", totalFilas);

            //empiezo desde 1 para saltear la fila 0 que serían los headers (nombre, rut, etc.) (esto habría que verlo igual pero bueno)
            for (int i = 1; i <= totalFilas; i++) {
                Row fila = hoja.getRow(i);

                if (fila == null) {
                    logger.debug("Fila {} vacía, saltando", i + 1);
                    continue;
                }

                try {
                    //leo cada celda por posición, columna 0 = nombre, 1 = rut, etc.
                    String nombre = getCellValue(fila.getCell(0));
                    String rut = getCellValue(fila.getCell(1));
                    String rubro = getCellValue(fila.getCell(2));
                    String direccion = getCellValue(fila.getCell(3));
                    String email = getCellValue(fila.getCell(4));

                    //primer validación: campos obligatorios
                    if (nombre.isEmpty() || rut.isEmpty()) {
                        errores.add("Fila " + (i + 1) + ": nombre y RUT son obligatorios");
                        logger.warn("Fila {} inválida: nombre o RUT vacío", i + 1);
                        fallidos++;
                        continue; //paso a la siguiente fila sin guardar
                    }

                    //segunda validación: rut duplicado
                    if (repository.existsByRut(rut)) {
                        errores.add("Fila " + (i + 1) + ": RUT " + rut + " ya existe");
                        logger.warn("Fila {} rechazada: RUT duplicado {}", i + 1, rut);
                        fallidos++;
                        continue;
                    }

                    //si pasó las validaciones, armo el objeto y lo guardo en la db
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
                    //capturo errores por fila para no cortar todo el proceso por solo una fila problemática
                    errores.add("Fila " + (i + 1) + ": error inesperado - " + e.getMessage());
                    logger.error("Error en fila {}: {}", i + 1, e.getMessage(), e);
                    fallidos++;
                }
            }

            logger.info("Carga finalizada. Exitosos: {}, Fallidos: {}", exitosos, fallidos);

        } catch (Exception e) {
            //error general: el archivo no se pudo abrir o procesar
            logger.error("Error al procesar el archivo Excel: {}", e.getMessage(), e);
            errores.add("Error general al procesar el archivo: " + e.getMessage());
        }

        return new UploadResultDTO(exitosos, fallidos, errores);
    }
}