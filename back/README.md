# Backend — Sistema de Gestión de Comercios

API REST construida con Spring Boot que gestiona los comercios afiliados a la red de pagos. Se encarga de toda la lógica de negocio, validaciones y persistencia de datos.

---

## Stack

- **Java 21** + **Spring Boot 4**
- **Gradle** — build y gestión de dependencias
- **Spring Data JPA** + **Hibernate** — acceso a datos
- **PostgreSQL** — base de datos relacional
- **Apache POI** — lectura de archivos Excel
- **Log4j2** — logging

---

## Arquitectura

El backend sigue una arquitectura de tres capas:
```
Controller → Service → Repository → PostgreSQL
```

Cada capa tiene una responsabilidad única y solo conoce a la inmediatamente inferior.

---

## Clases

### `ComercioController`
Recibe los requests HTTP y los delega al Service. No contiene lógica de negocio — su único trabajo es actuar de puerta de entrada y devolver la respuesta al cliente.

### `ComercioService`
Contiene toda la lógica de negocio: valida datos, detecta RUTs duplicados y procesa el archivo Excel fila por fila. Es el intermediario entre el Controller y el Repository.

### `ComercioRepository`
Interfaz de acceso a datos. Extiende `JpaRepository` para tener CRUD automático sin escribir SQL. Spring genera las consultas solo a partir del nombre de los métodos.

### `Comercio`
Entidad JPA que representa la tabla `comercios` en PostgreSQL. Hibernate la lee y genera/mantiene la tabla automáticamente al iniciar la aplicación.

### `UploadResultDTO`
Objeto simple que transporta el resultado de la carga masiva: cantidad de filas exitosas, fallidas y lista de errores.

