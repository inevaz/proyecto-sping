package com.proyecto.comercios.controller;

import com.proyecto.comercios.model.Comercio;
import com.proyecto.comercios.service.ComercioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.proyecto.comercios.dto.UploadResultDTO;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import java.util.List;

@RestController
@RequestMapping("/api/comercios")
@CrossOrigin(origins = "*")
public class ComercioController {

    private final ComercioService service;

    public ComercioController(ComercioService service) {
        this.service = service;
    }

    @GetMapping
    public List<Comercio> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comercio> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadResultDTO> upload(@RequestParam("file") MultipartFile file) {
        UploadResultDTO result = service.cargarDesdeExcel(file);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public Comercio create(@RequestBody Comercio comercio) {
        return service.save(comercio);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comercio> update(@PathVariable Long id, @RequestBody Comercio comercio) {
        return service.findById(id)
                .map(existing -> {
                    existing.setNombre(comercio.getNombre());
                    existing.setRut(comercio.getRut());
                    existing.setRubro(comercio.getRubro());
                    existing.setDireccion(comercio.getDireccion());
                    existing.setEmail(comercio.getEmail());
                    existing.setActivo(comercio.getActivo());
                    return ResponseEntity.ok(service.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.findById(id)
                .map(c -> {
                    service.delete(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}