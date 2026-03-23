# Sistema de Gestión de Comercios Afiliados

Sistema interno para la administración y carga masiva de comercios afiliados a una red de pagos. Desarrollado con Spring Boot en el backend y React en el frontend.

# Arquitectura
React (Frontend)  →  Spring Boot (Backend)  →  PostgreSQL (Base de datos)

El frontend se comunica con el backend mediante una API REST. El backend contiene toda la lógica de negocio y se conecta a la base de datos a través de JPA/Hibernate.

# Cómo ejecutar con Docker

### Requisitos previos
- Docker Desktop instalado y funcionando

### Pasos

1. Cloná el repositorio

2. Levantá todos los servicios con un solo comando:
```bash
docker-compose up --build
```
3. Esperás que termine de buildear (la primera vez demora unos minutos). Cuando veas en los logs:
```
Started ComerciosApplication
```
ya está todo listo.

4. Abrí el browser y entrá a:
```
http://localhost
```

5. Ingresá con cualquier email `@proyecto.com` y cualquier contraseña.
   
### deploy front:
Si querés ver el deploy del front (no va a tener funcionamiento real), podés entrar a: 
https://proyecto-sping.vercel.app/

## Stack 

**Backend**
- Java 25 + Spring Boot 4
- Gradle (build y gestión de dependencias)
- Spring Data JPA + Hibernate
- PostgreSQL
- Apache POI (lectura de archivos Excel)
- Log4j2 (logging)

**Frontend**
- React + Vite
- Tailwind CSS
- Styled Components
- Lucide React (íconos)
 
## Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/comercios` | Lista todos los comercios |
| GET | `/api/comercios/{id}` | Obtiene un comercio por ID |
| POST | `/api/comercios` | Crea un comercio individual |
| PUT | `/api/comercios/{id}` | Actualiza un comercio |
| DELETE | `/api/comercios/{id}` | Elimina un comercio |
| POST | `/api/comercios/upload` | Carga masiva desde archivo .xlsx |

### Credenciales de acceso
Ingresar con cualquier email con dominio `@proyecto.com` y cualquier contraseña.

---

## Estructura del Excel para carga masiva

El archivo `.xlsx` debe tener las siguientes columnas en la primera fila:

| nombre | rut | rubro | direccion | email |
|--------|-----|-------|-----------|-------|
| Supermercado A | 210050030016 | Supermercado | Calle X esq. calle Y | contacto@supermercadoA.com.uy |
