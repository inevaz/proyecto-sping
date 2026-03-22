package com.proyecto.comercios.controller;

import com.proyecto.comercios.model.Comercio;
import com.proyecto.comercios.service.ComercioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.proyecto.comercios.dto.UploadResultDTO;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import java.util.List;


//expone los endpoints rest mediante url y métodos HTTP para gestionar los comercios. 
//la "logica de negocio"
@RestController
@RequestMapping("/api/comercios")
@CrossOrigin(origins = "*") //permite requests desde cualquier origen
public class ComercioController {

    //logger de Log4j2 asociado a comercioController 
    private static final org.apache.logging.log4j.Logger logger =
            org.apache.logging.log4j.LogManager.getLogger(ComercioController.class);

    private final ComercioService service;

//la lógica de negocio sería el procesamiento de los datos, validaciones, reglas de negocio, etc. 
//el controlador solo se encarga de recibir las solicitudes, delegar al servicio y retornar las respuestas.
//esto es para hacer que spring separe la recepción de las solicitudes (controlador) de la lógica de negocio (servicio).
    public ComercioController(ComercioService service) {
        this.service = service;
    }

    /* GET /api/comercios
    lista completa de comercios registrados.
     */
    @GetMapping
    public List<Comercio> getAll() {
        logger.info("GET /api/comercios - solicitando lista de comercios");
        return service.findAll();
    }

    /* GET /api/comercios/{id}
    comercio específico por su ID
    si no existe, HTTP 404
     */
    @GetMapping("/{id}")
    public ResponseEntity<Comercio> getById(@PathVariable Long id) {
        logger.info("GET /api/comercios/{} - buscando comercio por ID", id);

        //map() envuelve el resultado en un 200 ok si existe, orElse() devuelve 404 si no
        ResponseEntity<Comercio> respuesta = service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());

        if (respuesta.getStatusCode().is4xxClientError()) {
            logger.warn("GET /api/comercios/{} - comercio no encontrado", id);
        }
        return respuesta;
    }

    /* POST /api/comercios/upload
     recibe un archivo .xlsx y delega su procesamiento a la clase ComercioService.
     retorna un resumen con la cantidad de filas exitosas y fallidas.
     consumes = MULTIPART_FORM_DATA_VALUE es lo que indica que espera un archivo, no JSON.
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadResultDTO> upload(@RequestParam("file") MultipartFile file) {
        logger.info("POST /api/comercios/upload - recibiendo archivo: {}", file.getOriginalFilename());
        UploadResultDTO result = service.cargarDesdeExcel(file);
        logger.info("POST /api/comercios/upload - carga finalizada. Exitosos: {}, Fallidos: {}",
                result.getExitosos(), result.getFallidos());
        return ResponseEntity.ok(result);
    }

    /* POST /api/comercios
     recibe un nuevo comercio a partir del JSON recibido en el body
     @RequestBody hace que Spring convierta el JSON a un objeto Comercio auto.
      retorna el comercio creado con su id asignado por la base de datos (pk)
     */
    @PostMapping
    public Comercio create(@RequestBody Comercio comercio) {
        logger.info("POST /api/comercios - creando comercio: {}", comercio.getNombre());
        return service.save(comercio);
    }

    /* PUT /api/comercios/{id}
     actualiza los datos de un comercio existente.
     si el ID no existe, retorna HTTP 404.
     solo deja actualizar los campos editables, el ID y la fecha de carga original no deja.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Comercio> update(@PathVariable Long id, @RequestBody Comercio comercio) {
        logger.info("PUT /api/comercios/{} - actualizando comercio", id);

        ResponseEntity<Comercio> respuesta = service.findById(id)
                .map(existing -> {
                    // Se actualizan solo los campos del comercio existente, no se reemplaza el objeto completo
                    existing.setNombre(comercio.getNombre());
                    existing.setRut(comercio.getRut());
                    existing.setRubro(comercio.getRubro());
                    existing.setDireccion(comercio.getDireccion());
                    existing.setEmail(comercio.getEmail());
                    existing.setActivo(comercio.getActivo());
                    return ResponseEntity.ok(service.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());

        if (respuesta.getStatusCode().is4xxClientError()) {
            logger.warn("PUT /api/comercios/{} - comercio no encontrado para actualizar", id);
        }
        return respuesta;
    }

    /* DELETE /api/comercios/{id}
     elimina un comercio por su ID.
     si el ID no existe, HTTP 404
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        logger.info("DELETE /api/comercios/{} - eliminando comercio", id);

        ResponseEntity<Void> respuesta = service.findById(id)
                .map(c -> {
                    service.delete(id);
                    // Void indica que la respuesta no tiene body, solo el status 200
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());

        if (respuesta.getStatusCode().is4xxClientError()) {
            logger.warn("DELETE /api/comercios/{} - comercio no encontrado para eliminar", id);
        }
        return respuesta;
    }
}